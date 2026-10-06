export default function handler(_req: any, res: any) {
  const apiKey = process.env.GEMINI_API_KEY || '';
  const isConfigured = Boolean(apiKey && apiKey.trim().length > 0);

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  res.status(200).json({
    status: 'healthy',
    provider: 'google-gemini-live',
    model: 'gemini-2.0-flash-exp',
    configured: isConfigured,
    audioInput: '16kHz PCM linear16',
    audioOutput: '24kHz PCM linear16',
    liveWebSocketEndpoint: process.env.VITE_GEMINI_LIVE_GATEWAY_URL || '/api/gemini/live',
    toolsCount: 24,
    transport: 'vercel-serverless-ephemeral',
    timestamp: new Date().toISOString(),
  });
}
