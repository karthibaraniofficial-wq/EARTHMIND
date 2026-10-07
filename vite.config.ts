import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import path from 'path';
import fs from 'fs';
import { WebSocketServer, WebSocket } from 'ws';

function getGeminiApiKey(): string {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      const match = content.match(/^GEMINI_API_KEY\s*=\s*["']?(.*?)["']?\s*$/m);
      if (match) {
        return (match[1] || '').trim();
      }
    }
  } catch {
    // Fallback safely
  }
  return (process.env.GEMINI_API_KEY || '').trim();
}

function geminiLiveGatewayPlugin(): Plugin {
  return {
    name: 'gemini-live-gateway',
    configureServer(server) {
      // 1. Health Endpoint: /api/health/ai
      server.middlewares.use('/api/health/ai', (_req, res) => {
        const apiKey = getGeminiApiKey();
        const isConfigured = Boolean(apiKey && apiKey.trim().length > 0);
        const liveModel = process.env.GEMINI_LIVE_MODEL || 'gemini-3.8-live';
        const researchModel = process.env.GEMINI_RESEARCH_MODEL || 'gemini-3.8-flash';
        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            status: 'healthy',
            provider: 'google-gemini-live',
            model: liveModel,
            liveModel,
            researchModel,
            configured: isConfigured,
            audioInput: '16kHz PCM linear16',
            audioOutput: '24kHz PCM linear16',
            liveWebSocketEndpoint: '/api/gemini/live',
            researchEndpoint: '/api/research/query',
            toolsCount: 28,
            timestamp: new Date().toISOString(),
          })
        );
      });

      // 1b. Research Query Endpoint: /api/research/query
      server.middlewares.use('/api/research/query', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', async () => {
            try {
              (req as any).body = JSON.parse(body || '{}');
            } catch {
              (req as any).body = {};
            }
            try {
              const handler = (await import('./api/research/query.ts')).default;
              await handler(req, res);
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else {
          res.statusCode = 405;
          res.end('Method Not Allowed');
        }
      });

      // 1c. URL Research Endpoint: /api/research/url
      server.middlewares.use('/api/research/url', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', async () => {
            try {
              (req as any).body = JSON.parse(body || '{}');
            } catch {
              (req as any).body = {};
            }
            try {
              const handler = (await import('./api/research/url.ts')).default;
              await handler(req, res);
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else {
          res.statusCode = 405;
          res.end('Method Not Allowed');
        }
      });

      // 2. WebSocket Gateway: /api/gemini/live
      if (server.httpServer) {
        const wss = new WebSocketServer({ noServer: true });

        server.httpServer.on('upgrade', (req, socket, head) => {
          const url = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
          if (url.pathname === '/api/gemini/live') {
            wss.handleUpgrade(req, socket, head, (clientWs) => {
              wss.emit('connection', clientWs, req);
            });
          }
        });

        wss.on('connection', (clientWs) => {
          const apiKey = getGeminiApiKey();
          if (!apiKey || apiKey.length === 0) {
            console.log('[Gemini Live Gateway] GEMINI_API_KEY not configured on server. Informing client to activate local fallback.');
            clientWs.send(
              JSON.stringify({
                error: {
                  code: 'API_KEY_MISSING',
                  message: 'GEMINI_API_KEY is not configured on the secure server environment. Activating deterministic local voice engine fallback.',
                },
              })
            );
            clientWs.close(1008, 'API_KEY_MISSING');
            return;
          }

          console.log('[Gemini Live Gateway] Client connected. Connecting to Google Gemini Live API...');
          const googleLiveUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${apiKey}`;

          let googleWs: WebSocket | null = null;
          try {
            googleWs = new WebSocket(googleLiveUrl);

            googleWs.on('open', () => {
              console.log('[Gemini Live Gateway] Upstream connected to Gemini Live.');
            });

            googleWs.on('message', (data) => {
              if (clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(data);
              }
            });

            googleWs.on('error', (err) => {
              console.warn('[Gemini Live Gateway] Upstream Google WS error:', err.message);
              if (clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(JSON.stringify({ error: { message: err.message } }));
              }
            });

            googleWs.on('close', (code, reason) => {
              console.log(`[Gemini Live Gateway] Upstream closed: ${code} - ${reason.toString()}`);
              if (clientWs.readyState === WebSocket.OPEN) {
                clientWs.close(code, reason.toString());
              }
            });

            clientWs.on('message', (data) => {
              if (googleWs && googleWs.readyState === WebSocket.OPEN) {
                googleWs.send(data);
              }
            });

            clientWs.on('close', () => {
              if (googleWs && googleWs.readyState === WebSocket.OPEN) {
                googleWs.close();
              }
            });
          } catch (err: any) {
            console.error('[Gemini Live Gateway] Proxy error:', err);
            clientWs.close(1011, err.message);
          }
        });
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  if (env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY) {
    process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
  }

  return {
    plugins: [react(), geminiLiveGatewayPlugin()],
    resolve: {
      alias: {
        'lucide-react': path.resolve(__dirname, './src/components/icons.tsx'),
      },
    },
  };
});

