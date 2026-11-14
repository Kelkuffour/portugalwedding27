import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { PGlite } from '@electric-sql/pglite';
import { PostgresGuestbookStore, createGuestbookStore } from '../backend/guestbook-store.ts';
import { createGuestbookApp } from '../backend/guestbook-app.ts';

async function serve(store) {
  const server = http.createServer(createGuestbookApp(store));
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  return {
    base: `http://127.0.0.1:${server.address().port}/api/guestbook`,
    stop: () => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())),
  };
}

test('Postgres comments persist across function instances and deletes enforce ownership', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'wedding-postgres-'));
  let database;
  let api;
  const connect = async () => {
    database = new PGlite(directory);
    const store = new PostgresGuestbookStore(async (sql, values) => (await database.query(sql, values)).rows);
    api = await serve(store);
    return store;
  };
  try {
    let store = await connect();
    assert.deepEqual(await (await fetch(api.base)).json(), { wishes: [] });
    const response = await fetch(api.base, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: ' João & Ana ', message: "Parabéns! '); DROP TABLE wedding_comments; --" }),
    });
    assert.equal(response.status, 201);
    const { wish } = await response.json();
    const cookie = response.headers.get('set-cookie').split(';')[0];
    assert.equal(wish.name, 'João & Ana');
    assert.equal(wish.canDelete, true);
    assert.equal(wish.ownerHash, undefined);
    assert.equal(wish.message, "Parabéns! '); DROP TABLE wedding_comments; --");
    const publicResponse = await fetch(api.base);
    assert.match(publicResponse.headers.get('cache-control'), /no-store/);
    const publicData = await publicResponse.json();
    assert.equal(publicData.wishes[0].ownerHash, undefined);
    assert.equal(publicData.wishes[0].canDelete, false);
    assert.equal((await fetch(`${api.base}/${wish.id}`, { method: 'DELETE' })).status, 403);
    assert.equal((await fetch(`${api.base}/${wish.id}`, {
      method: 'DELETE', headers: { Cookie: `guestbook_owner=${'0'.repeat(64)}` },
    })).status, 403);
    await api.stop(); api = undefined;
    await database.close(); database = undefined;

    store = await connect();
    const reloaded = await (await fetch(api.base, { headers: { Cookie: cookie } })).json();
    assert.equal(reloaded.wishes[0].id, wish.id);
    assert.equal(reloaded.wishes[0].canDelete, true);
    // Parallel writes must not overwrite each other as file-based storage can.
    await Promise.all(Array.from({ length: 10 }, (_, i) => store.add({
      id: `parallel-${i}`, name: 'Guest', relationship: 'Guest', message: `Wish ${i}`,
      createdAt: new Date().toISOString(), ownerHash: 'test-owner',
    })));
    assert.equal((await store.list()).length, 11);
    assert.equal((await fetch(`${api.base}/${wish.id}`, { method: 'DELETE', headers: { Cookie: cookie } })).status, 200);
    assert.equal((await fetch(`${api.base}/${wish.id}`, { method: 'DELETE', headers: { Cookie: cookie } })).status, 404);
    assert.equal((await store.list()).length, 10);
    const invalid = await fetch(api.base, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Guest', message: 'x'.repeat(2001) }),
    });
    assert.equal(invalid.status, 400);
  } finally {
    if (api) await api.stop();
    if (database) await database.close();
    await rm(directory, { recursive: true, force: true });
  }
});

test('Vercel never writes local files when the database is missing', async () => {
  const original = { VERCEL: process.env.VERCEL, DATABASE_URL: process.env.DATABASE_URL, POSTGRES_URL: process.env.POSTGRES_URL };
  let api;
  try {
    process.env.VERCEL = '1';
    delete process.env.DATABASE_URL;
    delete process.env.POSTGRES_URL;
    assert.throws(createGuestbookStore, /database is not configured/);
    api = await serve();
    const response = await fetch(api.base);
    assert.equal(response.status, 503);
    assert.match((await response.json()).error, /temporarily unavailable/);
  } finally {
    if (api) await api.stop();
    for (const [name, value] of Object.entries(original)) {
      if (value === undefined) delete process.env[name]; else process.env[name] = value;
    }
  }
});
