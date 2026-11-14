import { neon } from '@neondatabase/serverless';
import type { DeleteResult, GuestbookStore, StoredGuestbookWish } from './guestbook-types.ts';

export const COMMENT_SCHEMA = `CREATE TABLE IF NOT EXISTS wedding_comments (
  id TEXT PRIMARY KEY,
  name VARCHAR(120) NOT NULL CHECK (length(trim(name)) > 0),
  relationship VARCHAR(80) NOT NULL DEFAULT 'Guest',
  message VARCHAR(2000) NOT NULL CHECK (length(trim(message)) > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  owner_hash VARCHAR(64)
)`;

type Row = Record<string, unknown>;
export type SqlQuery = (text: string, values?: unknown[]) => Promise<Row[]>;

function fromRow(row: Row): StoredGuestbookWish {
  return {
    id: String(row.id), name: String(row.name), relationship: String(row.relationship),
    message: String(row.message), createdAt: new Date(row.created_at as string | Date).toISOString(),
    ownerHash: typeof row.owner_hash === 'string' ? row.owner_hash : undefined,
  };
}

export class PostgresGuestbookStore implements GuestbookStore {
  private query: SqlQuery;
  private ready?: Promise<void>;

  constructor(query: SqlQuery) { this.query = query; }

  private ensureSchema(): Promise<void> {
    if (!this.ready) {
      this.ready = this.query(COMMENT_SCHEMA).then(() => undefined).catch((error) => {
        this.ready = undefined;
        throw error;
      });
    }
    return this.ready;
  }

  async list(): Promise<StoredGuestbookWish[]> {
    await this.ensureSchema();
    const rows = await this.query(`SELECT id, name, relationship, message, created_at, owner_hash
      FROM wedding_comments ORDER BY created_at DESC, id DESC`);
    return rows.map(fromRow);
  }

  async add(wish: StoredGuestbookWish): Promise<void> {
    await this.ensureSchema();
    await this.query(`INSERT INTO wedding_comments (id, name, relationship, message, created_at, owner_hash)
      VALUES ($1, $2, $3, $4, $5, $6)`,
    [wish.id, wish.name, wish.relationship, wish.message, wish.createdAt, wish.ownerHash ?? null]);
  }

  async deleteOwned(id: string, hash: string): Promise<DeleteResult> {
    await this.ensureSchema();
    // Check ownership and delete in a single statement, safe across function instances.
    const removed = await this.query('DELETE FROM wedding_comments WHERE id = $1 AND owner_hash = $2 RETURNING id', [id, hash]);
    if (removed.length) return 'deleted';
    const existing = await this.query('SELECT id FROM wedding_comments WHERE id = $1', [id]);
    return existing.length ? 'forbidden' : 'not_found';
  }
}

export function createGuestbookStore(): GuestbookStore {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (connectionString) {
    const sql = neon(connectionString);
    // Create a fresh timeout per query rather than reusing a signal across requests.
    return new PostgresGuestbookStore((text, values) => sql.query(text, values, {
      fetchOptions: { signal: AbortSignal.timeout(15000) },
    }));
  }
  throw new Error('Comments database is not configured. Connect Neon and set DATABASE_URL.');
}
