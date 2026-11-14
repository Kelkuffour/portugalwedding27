import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createGuestbookStore } from '../backend/guestbook-store.ts';
import type { StoredGuestbookWish } from '../backend/guestbook-types.ts';

if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
  throw new Error('Set DATABASE_URL in your local .env before importing comments.');
}
const file = path.join(process.env.INVITATION_DATA_DIR || path.join(process.cwd(), 'data'), 'invitation-store.json');
const data = JSON.parse(await fs.readFile(file, 'utf8')) as { wishes?: StoredGuestbookWish[] };
const store = createGuestbookStore();
const existing = new Set((await store.list()).map((wish) => wish.id));
let imported = 0;
for (const wish of data.wishes ?? []) {
  if (['wish-initial-1', 'wish-initial-2'].includes(wish.id) || existing.has(wish.id)) continue;
  await store.add({
    id: wish.id, name: wish.name, relationship: wish.relationship || 'Guest',
    message: wish.message, createdAt: wish.createdAt, ownerHash: wish.ownerHash,
  });
  existing.add(wish.id);
  imported++;
}
console.log(`Imported ${imported} comments. Existing comments were preserved.`);
