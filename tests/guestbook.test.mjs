import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, writeFile, rm, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import net from 'node:net';
import { setTimeout as delay } from 'node:timers/promises';

test('guestbook removes samples, validates, persists and reports storage failures', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'wedding-guestbook-'));
  const file = path.join(directory, 'invitation-store.json');
  const realComment = { id: 'real-guest', name: 'Ana', relationship: 'Guest', message: 'Parabéns!', createdAt: new Date().toISOString() };
  await writeFile(file, JSON.stringify({ rsvps: [{ id: 'keep-rsvp' }], wishes: [
    { ...realComment, id: 'wish-initial-1' }, { ...realComment, id: 'wish-initial-2' }, realComment,
  ] }));
  const socket = net.createServer();
  await new Promise((resolve) => socket.listen(0, '127.0.0.1', resolve));
  const port = socket.address().port;
  await new Promise((resolve) => socket.close(resolve));
  const base = `http://127.0.0.1:${port}`;
  let processHandle;
  let logs = '';
  const start = async () => {
    processHandle = spawn(process.execPath, ['server.ts'], {
      env: { ...process.env, NODE_ENV: 'production', PORT: String(port), INVITATION_DATA_DIR: directory },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    processHandle.stdout.on('data', (data) => { logs += data; });
    processHandle.stderr.on('data', (data) => { logs += data; });
    for (let attempt = 0; attempt < 100; attempt++) {
      try { if ((await fetch(`${base}/api/guestbook`)).ok) return; } catch {}
      if (processHandle.exitCode !== null) throw new Error(logs);
      await delay(100);
    }
    throw new Error(`Server did not start: ${logs}`);
  };
  const stop = async () => {
    if (!processHandle || processHandle.exitCode !== null) return;
    const exited = new Promise((resolve) => processHandle.once('exit', resolve));
    processHandle.kill();
    await exited;
  };
  const post = (body) => fetch(`${base}/api/guestbook`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  try {
    await start();
    const initial = await (await fetch(`${base}/api/guestbook`)).json();
    assert.deepEqual(initial.wishes, [realComment]);
    assert.equal(initial.rsvps, undefined, 'public comments must not expose RSVP data');
    assert.equal(JSON.parse(await readFile(file, 'utf8')).rsvps[0].id, 'keep-rsvp');
    assert.equal((await post({ name: ' ', message: 'Hello' })).status, 400);
    assert.equal((await post({ name: 'Guest', message: 'x'.repeat(2001) })).status, 400);
    const response = await post({ name: '  João  ', message: '  Felicidades!  ' });
    assert.equal(response.status, 201);
    const saved = await response.json();
    assert.equal(saved.wish.name, 'João');
    assert.equal(saved.wish.message, 'Felicidades!');
    assert.equal(saved.wishes.length, 2);
    await stop();
    await start();
    const reloaded = await (await fetch(`${base}/api/guestbook`)).json();
    assert.equal(reloaded.wishes[0].id, saved.wish.id, 'comment survives server restart');
    // Force a write failure without changing the saved comments.
    await mkdir(`${file}.tmp`);
    const failed = await post({ name: 'Guest', message: 'Must not appear as saved' });
    assert.equal(failed.status, 500);
    assert.ok((await failed.json()).error);
    assert.equal(JSON.parse(await readFile(file, 'utf8')).wishes.length, 2);
  } finally {
    await stop();
    await rm(directory, { recursive: true, force: true });
  }
});
