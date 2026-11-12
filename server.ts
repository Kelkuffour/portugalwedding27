import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { createHash, randomBytes } from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = process.env.INVITATION_DATA_DIR || path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'invitation-store.json');

export interface RsvpEntry {
  id: string;
  name: string;
  contact: string;
  attending: 'joyfully_accepts' | 'regretfully_declines';
  guestsCount: number;
  attireNote: string;
  message: string;
  createdAt: string;
}

export interface GuestbookWish {
  id: string;
  name: string;
  relationship: string;
  message: string;
  createdAt: string;
  canDelete?: boolean;
}

interface StoredGuestbookWish extends GuestbookWish {
  ownerHash?: string;
}

function commentOwner(req: express.Request): string | undefined {
  const token = req.headers.cookie?.split(';').map((value) => value.trim())
    .find((value) => value.startsWith('guestbook_owner='))?.slice('guestbook_owner='.length);
  return token && /^[a-f0-9]{64}$/.test(token) ? token : undefined;
}

const ownerHash = (token: string) => createHash('sha256').update(token).digest('hex');

function publicWishes(req: express.Request, wishes: StoredGuestbookWish[], token = commentOwner(req)): GuestbookWish[] {
  const hash = token ? ownerHash(token) : undefined;
  return wishes.map(({ id, name, relationship, message, createdAt, ownerHash: storedHash }) => ({
    id, name, relationship, message, createdAt,
    canDelete: Boolean(hash && storedHash && hash === storedHash),
  }));
}

export interface EditablePlaceholders {
  groomFullName: string;
  familyHostsWording: string;
  receptionSubtitle: string;
  receptionTime: string;
  receptionVenue: string;
  registryDetails: string;
  registryUrl: string;
  giftNote: string;
}

interface StoreData {
  rsvps: RsvpEntry[];
  wishes: StoredGuestbookWish[];
  placeholders: EditablePlaceholders;
}

const DEFAULT_STORE: StoreData = {
  rsvps: [],
  wishes: [],
  placeholders: {
    groomFullName: 'Agostinho',
    familyHostsWording: 'Together with their loving families and dear friends',
    receptionSubtitle: 'Casamento de Agostinho e Kety',
    receptionTime: '24 de julho de 2027 às 14 horas',
    receptionVenue: 'Rua das Nogueiras 7, Foros do Almada, 2130-523 Santo Estêvão',
    registryDetails: 'REGISTERED AT NAME',
    registryUrl: '',
    giftNote: 'Your presence at Santo Estêvão is the greatest gift of all. As noted on the invitation, the celebration is registered at:',
  },
};

function loadStore(): StoreData {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_STORE, null, 2), 'utf-8');
    return structuredClone(DEFAULT_STORE);
  }
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  const parsed = JSON.parse(raw) as Partial<StoreData>;
  const store: StoreData = {
    rsvps: Array.isArray(parsed.rsvps) ? parsed.rsvps : [],
    wishes: Array.isArray(parsed.wishes)
      ? parsed.wishes.filter((wish) => !['wish-initial-1', 'wish-initial-2'].includes(wish.id))
      : [],
    placeholders: { ...DEFAULT_STORE.placeholders, ...(parsed.placeholders || {}) },
  };
  if (Array.isArray(parsed.wishes) && store.wishes.length !== parsed.wishes.length) saveStore(store);
  return store;
}

function saveStore(data: StoreData): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const temporaryFile = `${DATA_FILE}.tmp`;
  fs.writeFileSync(temporaryFile, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(temporaryFile, DATA_FILE);
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '5mb' }));

  app.get('/api/state', (_req, res) => {
    const store = loadStore();
    res.set('Cache-Control', 'no-store').json({ ...store, wishes: publicWishes(_req, store.wishes) });
  });

  app.post('/api/rsvp', (req, res) => {
    const { name, contact, attending, guestsCount, attireNote, message } = req.body || {};
    if (!name || typeof name !== 'string' || !name.trim()) {
      res.status(400).json({ error: 'Please provide your full name.' });
      return;
    }
    if (!contact || typeof contact !== 'string' || !contact.trim()) {
      res.status(400).json({ error: 'Please provide your phone number or email address.' });
      return;
    }

    const store = loadStore();
    const newEntry: RsvpEntry = {
      id: `rsvp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim(),
      contact: contact.trim(),
      attending: attending === 'regretfully_declines' ? 'regretfully_declines' : 'joyfully_accepts',
      guestsCount: attending === 'regretfully_declines' ? 0 : Math.max(1, Math.min(10, Number(guestsCount) || 1)),
      attireNote: typeof attireNote === 'string' ? attireNote.trim() : 'Black tie / Casual chic',
      message: typeof message === 'string' ? message.trim() : '',
      createdAt: new Date().toISOString(),
    };

    store.rsvps.unshift(newEntry);
    saveStore(store);

    res.status(201).json({ rsvp: newEntry, rsvps: store.rsvps });
  });

  app.get('/api/guestbook', (_req, res) => {
    res.set('Cache-Control', 'no-store').json({ wishes: publicWishes(_req, loadStore().wishes) });
  });

  app.post('/api/guestbook', (req, res) => {
    const { name, relationship, message } = req.body || {};
    if (!name || typeof name !== 'string' || !name.trim()) {
      res.status(400).json({ error: 'Please enter your name.' });
      return;
    }
    if (!message || typeof message !== 'string' || !message.trim()) {
      res.status(400).json({ error: 'Please write a congratulatory message.' });
      return;
    }
    if (name.trim().length > 120 || message.trim().length > 2000) {
      res.status(400).json({ error: 'Use up to 120 characters for your name and 2000 for your message.' });
      return;
    }

    const store = loadStore();
    const token = commentOwner(req) || randomBytes(32).toString('hex');
    const newWish: StoredGuestbookWish = {
      id: `wish-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim(),
      relationship: typeof relationship === 'string' && relationship.trim() ? relationship.trim() : 'Honoured Guest',
      message: message.trim(),
      createdAt: new Date().toISOString(),
      ownerHash: ownerHash(token),
    };

    store.wishes.unshift(newWish);
    saveStore(store);

    res.cookie('guestbook_owner', token, {
      httpOnly: true, sameSite: 'strict', path: '/', maxAge: 365 * 24 * 60 * 60 * 1000,
      secure: req.secure || req.get('x-forwarded-proto') === 'https',
    });
    const wishes = publicWishes(req, store.wishes, token);
    res.status(201).json({ wish: wishes[0], wishes });
  });

  app.delete('/api/guestbook/:id', (req, res) => {
    const store = loadStore();
    const wish = store.wishes.find((entry) => entry.id === req.params.id);
    if (!wish) {
      res.status(404).json({ error: 'This comment no longer exists.' });
      return;
    }
    const token = commentOwner(req);
    if (!token || !wish.ownerHash || ownerHash(token) !== wish.ownerHash) {
      res.status(403).json({ error: 'You can only delete comments posted from this browser.' });
      return;
    }
    store.wishes = store.wishes.filter((entry) => entry.id !== wish.id);
    saveStore(store);
    res.set('Cache-Control', 'no-store').json({ wishes: publicWishes(req, store.wishes) });
  });

  app.put('/api/invitation-details', (req, res) => {
    const updates = req.body || {};
    const store = loadStore();
    store.placeholders = {
      ...store.placeholders,
      ...updates,
    };
    saveStore(store);
    res.json({ placeholders: store.placeholders });
  });

  app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Invitation storage error:', error.message);
    res.status(500).json({ error: 'Comments could not be loaded or saved. Please try again.' });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Invitation server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
