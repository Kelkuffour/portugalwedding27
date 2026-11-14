import type { IncomingMessage, ServerResponse } from 'node:http';
import app from '../../backend/guestbook-app.ts';

export default function deleteComment(
  req: IncomingMessage & { query?: Record<string, string | string[]> },
  res: ServerResponse,
) {
  // Vercel's dynamic route can arrive as /[id]?id=... after its rewrite.
  const id = req.query?.id ?? new URL(req.url || '/', 'http://localhost').searchParams.get('id');
  if (typeof id === 'string') req.url = `/api/guestbook/${encodeURIComponent(id)}`;
  return app(req, res);
}
