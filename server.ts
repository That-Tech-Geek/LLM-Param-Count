import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import openrouterHandler from './api/openrouter.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', openrouterConfigured: !!(process.env.OPENROUTER_API || process.env.OPENROUTER_API_KEY) });
  });

  // OpenRouter Proxy API Endpoint
  app.post('/api/openrouter', async (req, res) => {
    try {
      await openrouterHandler(req, res);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Error processing request' });
    }
  });

  // Vite Middleware in Development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
