import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
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
  wishes: GuestbookWish[];
  placeholders: EditablePlaceholders;
}

const DEFAULT_STORE: StoreData = {
  rsvps: [],
  wishes: [
    {
      id: 'wish-initial-1',
      name: 'Clara & Thomas Vance',
      relationship: 'Family Friends',
      message: 'Dearest Elisabeth, wishing you the most radiant afternoon at Love Gardens Villa and a lifetime filled with grace, warmth, and enduring love.',
      createdAt: '2026-06-18T14:30:00.000Z',
    },
    {
      id: 'wish-initial-2',
      name: 'Sophie Laurent',
      relationship: 'Bridesmaid',
      message: 'Counting down the days until July 16th! Already have my ivory linen dress ready for the afternoon in Miami. Cannot wait to celebrate you!',
      createdAt: '2026-06-21T19:15:00.000Z',
    },
  ],
  placeholders: {
    groomFullName: '[Groom’s Full Name — Click to Edit]',
    familyHostsWording: 'Together with their loving families and dear friends',
    receptionSubtitle: 'Afternoon Garden Soirée & Bridal Shower Reception',
    receptionTime: 'Following the Three O’Clock Gathering',
    receptionVenue: 'Love Gardens Villa — Garden Conservatory, Pearlsville CA 1238 Miami',
    registryDetails: 'REGISTERED AT NAME',
    registryUrl: '',
    giftNote: 'Your presence at Love Gardens Villa is the greatest gift of all. As noted on the invitation, the celebration is registered at:',
  },
};

function loadStore(): StoreData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_STORE, null, 2), 'utf-8');
      return structuredClone(DEFAULT_STORE);
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<StoreData>;
    return {
      rsvps: Array.isArray(parsed.rsvps) ? parsed.rsvps : [],
      wishes: Array.isArray(parsed.wishes) ? parsed.wishes : DEFAULT_STORE.wishes,
      placeholders: { ...DEFAULT_STORE.placeholders, ...(parsed.placeholders || {}) },
    };
  } catch {
    return structuredClone(DEFAULT_STORE);
  }
}

function saveStore(data: StoreData): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist store:', err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '5mb' }));

  app.get('/api/state', (_req, res) => {
    const store = loadStore();
    res.json(store);
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
      attireNote: typeof attireNote === 'string' ? attireNote.trim() : 'White or Brown',
      message: typeof message === 'string' ? message.trim() : '',
      createdAt: new Date().toISOString(),
    };

    store.rsvps.unshift(newEntry);
    saveStore(store);

    res.status(201).json({ rsvp: newEntry, rsvps: store.rsvps });
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

    const store = loadStore();
    const newWish: GuestbookWish = {
      id: `wish-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim(),
      relationship: typeof relationship === 'string' && relationship.trim() ? relationship.trim() : 'Honoured Guest',
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };

    store.wishes.unshift(newWish);
    saveStore(store);

    res.status(201).json({ wish: newWish, wishes: store.wishes });
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
