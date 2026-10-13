// The object store: what indexing a pack keeps, and in how much memory.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { test } from 'node:test';
import { ObjectDB, TREE_SLAB } from '../lib/engine/pack';
import { Repo, tmpdir } from './helpers';

test('kept trees hold their own bytes, not the 16 KB buffers they were inflated into', () => {
  const r = new Repo(path.join(tmpdir(), 'repo'));
  for (let i = 0; i < 200; i++) r.write(`d${i}/f.txt`, 1);
  r.commit(1_750_000_000);
  // every object whole, as a shallow fetch sends the trees at its edge: each one inflated on its own
  const p = spawnSync('git', ['pack-objects', '--all', '--window=0', '--no-reuse-delta', '--stdout'],
    { cwd: r.dir, stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1 << 30 });
  assert.equal(p.status, 0, p.stderr?.toString());
  const db = new ObjectDB();
  db.addPack(p.stdout);
  let bytes = 0, held = 0;
  const buffers = new Set<ArrayBufferLike>();
  for (const t of db.trees.values()) {
    bytes += t.length;
    if (!buffers.has(t.buffer)) { buffers.add(t.buffer); held += t.buffer.byteLength; }
  }
  assert.equal(db.trees.size, 201);
  // anomalyco/opencode's window: 129 MB of trees held in 684 MB of buffers
  assert.ok(held <= bytes + TREE_SLAB, `${db.trees.size} trees, ${bytes} bytes, held in ${held}`);
});
