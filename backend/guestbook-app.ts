import express from 'express';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { createGuestbookStore } from './guestbook-store.ts';
import type { GuestbookStore, GuestbookWish, StoredGuestbookWish } from './guestbook-types.ts';

function ownerToken(req: express.Request): string | undefined {
  const token = req.headers.cookie?.split(';').map((value) => value.trim())
    .find((value) => value.startsWith('guestbook_owner='))?.slice('guestbook_owner='.length);
  return token && /^[a-f0-9]{64}$/.test(token) ? token : undefined;
}

const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

function publicWishes(wishes: StoredGuestbookWish[], token?: string): GuestbookWish[] {
  const hash = token ? hashToken(token) : undefined;
  return wishes.map(({ id, name, relationship, message, createdAt, ownerHash }) => ({
    id, name, relationship, message, createdAt, canDelete: Boolean(hash && ownerHash === hash),
  }));
}

const asyncRoute = (handler: express.RequestHandler): express.RequestHandler => (req, res, next) => {
  Promise.resolve().then(() => handler(req, res, next)).catch(next);
};

export function createGuestbookApp(store?: GuestbookStore) {
  const app = express();
  let repository = store;
  const getStore = () => repository ??= createGuestbookStore();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '16kb' }));
  app.use((_req, res, next) => {
    res.set('Cache-Control', 'private, no-store');
    res.vary('Cookie');
    next();
  });

  app.get('/api/guestbook', asyncRoute(async (req, res) => {
    res.json({ wishes: publicWishes(await getStore().list(), ownerToken(req)) });
  }));

  app.post('/api/guestbook', asyncRoute(async (req, res) => {
    const { name, relationship, message } = req.body ?? {};
    if (typeof name !== 'string' || !name.trim() || typeof message !== 'string' || !message.trim()) {
      res.status(400).json({ error: 'Please enter your name and a message.' });
      return;
    }
    if (name.trim().length > 120 || message.trim().length > 2000) {
      res.status(400).json({ error: 'Use up to 120 characters for your name and 2000 for your message.' });
      return;
    }
    const token = ownerToken(req) || randomBytes(32).toString('hex');
    const wish: StoredGuestbookWish = {
      id: `wish-${randomUUID()}`, name: name.trim(), message: message.trim(),
      relationship: typeof relationship === 'string' && relationship.trim() ? relationship.trim().slice(0, 80) : 'Guest',
      createdAt: new Date().toISOString(), ownerHash: hashToken(token),
    };
    await getStore().add(wish);
    res.cookie('guestbook_owner', token, {
      httpOnly: true, sameSite: 'strict', path: '/', maxAge: 365 * 24 * 60 * 60 * 1000,
      secure: Boolean(process.env.VERCEL) || req.secure || req.get('x-forwarded-proto') === 'https',
    });
    // A successful write stays successful even if a later feed read would fail.
    res.status(201).json({ wish: publicWishes([wish], token)[0] });
  }));

  app.delete('/api/guestbook/:id', asyncRoute(async (req, res) => {
    const token = ownerToken(req);
    if (!token) {
      res.status(403).json({ error: 'You can only delete comments posted from this browser.' });
      return;
    }
    const result = await getStore().deleteOwned(req.params.id, hashToken(token));
    if (result === 'not_found') res.status(404).json({ error: 'This comment no longer exists.' });
    else if (result === 'forbidden') res.status(403).json({ error: 'You can only delete comments posted from this browser.' });
    else res.json({ deleted: true });
  }));

  // Retired endpoints no longer expose RSVP contacts or writable invitation settings.
  app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found.' }));
  app.use((error: Error & { status?: number }, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const status = error.status === 400 || error.status === 413 ? error.status : 503;
    res.status(status).json({ error: status === 503
      ? 'Comments are temporarily unavailable. Please try again shortly.'
      : 'Invalid comment request. Please check your message and try again.' });
  });
  return app;
}

export default createGuestbookApp();
