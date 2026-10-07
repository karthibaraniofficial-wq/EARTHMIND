import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { query, mode, expandedQueries } = req.body || {};
  if (!query || typeof query !== 'string' || !query.trim()) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  if (!apiKey) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY not configured on server',
      fallbackAvailable: true,
    });
  }

  const researchModel = (process.env.GEMINI_RESEARCH_MODEL || 'gemini-3.8-flash').trim();

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are the EARTHMIND Research Intelligence Agent. Conduct authoritative real-time scientific research for the user query:
"${query}"

Sub-queries: ${(expandedQueries || []).join(' | ')}
Mode: ${mode || 'QUICK'}

Provide:
1. An objective synthesized scientific summary (2-4 paragraphs).
2. Explicitly cite observational datasets, peer-reviewed studies, or official agencies (NASA, NOAA, IPCC, ISRO, Copernicus, Nature).
3. If sources disagree on estimates or rates, state that sources disagree and present the range.`;

    const response = await ai.models.generateContent({
      model: researchModel,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const candidate = response.candidates?.[0];
    const groundingMetadata = candidate?.groundingMetadata as any;
    const groundingChunks = groundingMetadata?.groundingChunks || [];

    const sources: Array<{
      title: string;
      url: string;
      publisher?: string;
      snippet?: string;
    }> = [];

    if (Array.isArray(groundingChunks)) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri) {
          sources.push({
            title: chunk.web.title || 'Authoritative Source',
            url: chunk.web.uri,
            snippet: chunk.web.title || '',
          });
        }
      });
    }

    return res.status(200).json({
      success: true,
      query,
      summary: response.text || '',
      sources,
      sourceAgreement: 'AGREEMENT',
      searchQueries: groundingMetadata?.webSearchQueries || [],
      model: researchModel,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.warn('[Research API] Live search grounding error:', error.message);
    return res.status(502).json({
      error: error.message || 'Error executing Google Search Grounding',
      fallbackAvailable: true,
    });
  }
}
