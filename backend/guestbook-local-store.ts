import fs from 'node:fs';
import path from 'node:path';
import type { DeleteResult, GuestbookStore, StoredGuestbookWish } from './guestbook-types.ts';

interface LocalData {
  wishes?: StoredGuestbookWish[];
  [key: string]: unknown;
}

export class FileGuestbookStore implements GuestbookStore {
  private file: string;
  constructor(directory: string) { this.file = path.join(directory, 'invitation-store.json'); }

  private read(): LocalData {
    fs.mkdirSync(path.dirname(this.file), { recursive: true });
    if (!fs.existsSync(this.file)) this.write({ wishes: [] });
    const data = JSON.parse(fs.readFileSync(this.file, 'utf8')) as LocalData;
    const original = Array.isArray(data.wishes) ? data.wishes : [];
    data.wishes = original.filter((wish) => !['wish-initial-1', 'wish-initial-2'].includes(wish.id));
    if (original.length !== data.wishes.length) this.write(data);
    return data;
  }

  private write(data: LocalData): void {
    const temporary = `${this.file}.tmp`;
    fs.writeFileSync(temporary, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(temporary, this.file);
  }

  async list(): Promise<StoredGuestbookWish[]> { return this.read().wishes ?? []; }

  async add(wish: StoredGuestbookWish): Promise<void> {
    const data = this.read();
    data.wishes = [wish, ...(data.wishes ?? [])];
    this.write(data);
  }

  async deleteOwned(id: string, hash: string): Promise<DeleteResult> {
    const data = this.read();
    const wish = data.wishes?.find((entry) => entry.id === id);
    if (!wish) return 'not_found';
    if (!wish.ownerHash || wish.ownerHash !== hash) return 'forbidden';
    data.wishes = data.wishes!.filter((entry) => entry.id !== id);
    this.write(data);
    return 'deleted';
  }
}

