import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import { handleGeminiChat, handleGeminiAnalysis, handleGeminiMcqAnalysis } from './server/geminiHandler.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function geminiServerPlugin(env) {
  return {
    name: 'gemini-server-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // Read JSON body helper
        const readBody = () => new Promise((resolve) => {
          let buffer = '';
          req.on('data', (chunk) => { buffer += chunk; });
          req.on('end', () => {
            try {
              resolve(buffer ? JSON.parse(buffer) : {});
            } catch {
              resolve({});
            }
          });
          req.on('error', () => resolve({}));
        });

        // 1. Status Check
        if (req.url === '/api/gemini/status' && req.method === 'GET') {
          const apiKey = process.env.GEMINI_API_KEY || env.GEMINI_API_KEY || '';
          const isConfigured = Boolean(apiKey && apiKey !== 'your_gemini_api_key_here');
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            configured: isConfigured,
            model: 'gemini-2.5-flash',
            provider: 'Google Gen AI SDK',
          }));
          return;
        }

        // 2. Conversational Assessment Turn
        if (req.url === '/api/gemini/chat' && req.method === 'POST') {
          const body = await readBody();
          const result = await handleGeminiChat(body);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result));
          return;
        }

        // 3. Structured Assessment Analysis & MCQ Evaluation
        if ((req.url === '/api/gemini/analyze' || req.url === '/api/gemini/analyze-mcq') && req.method === 'POST') {
          const body = await readBody();
          const result = await handleGeminiMcqAnalysis(body);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result));
          return;
        }

        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Also synchronize to process.env for Node server
  if (env.GEMINI_API_KEY) {
    process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
  }

  return {
    plugins: [react(), geminiServerPlugin(env)],
    server: {
      port: 3001,
      strictPort: true,
    },
    resolve: {
      alias: {
        '@shared': path.resolve(__dirname, '../../shared'),
      },
    },
  };
})
