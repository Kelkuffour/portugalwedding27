export interface GuestbookWish {
  id: string;
  name: string;
  relationship: string;
  message: string;
  createdAt: string;
  canDelete?: boolean;
}

export interface StoredGuestbookWish extends Omit<GuestbookWish, 'canDelete'> {
  ownerHash?: string;
}

export type DeleteResult = 'deleted' | 'forbidden' | 'not_found';

export interface GuestbookStore {
  list(): Promise<StoredGuestbookWish[]>;
  add(wish: StoredGuestbookWish): Promise<void>;
  deleteOwned(id: string, ownerHash: string): Promise<DeleteResult>;
}
