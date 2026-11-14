import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';
import { createGuestbookApp } from './backend/guestbook-app.ts';
import { FileGuestbookStore } from './backend/guestbook-local-store.ts';

const directory = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const useLocalFiles = !process.env.DATABASE_URL && !process.env.POSTGRES_URL && !process.env.VERCEL;
  const guestbookApp = createGuestbookApp(useLocalFiles
    ? new FileGuestbookStore(process.env.INVITATION_DATA_DIR || path.join(directory, 'data'))
    : undefined);
  const port = Number(process.env.PORT) || 3000;
  app.disable('x-powered-by');
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) guestbookApp(req, res, next);
    else next();
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(directory, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }
  app.listen(port, '0.0.0.0', () => {
    console.log(`Invitation server running at http://0.0.0.0:${port}`);
  });
}

startServer();
