// Versioned documents: what the gallery and owner settings are stored as, since the CDN in front of a public
// Blob store cannot be told to skip its cache.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { tmpdir } from './helpers';

const dir = tmpdir('cc-store-');
process.env.LOCAL_STORE_DIR = dir;
delete process.env.BLOB_READ_WRITE_TOKEN;
delete process.env.BLOB_STORE_ID;
const { getJSON, listVersions, putJSON, readVersions, versionName, writeVersion } = await import('../lib/store');

test('version names sort newest first, even within one millisecond', () => {
  const a = versionName(1_800_000_000_000), b = versionName(1_800_000_000_000), c = versionName(1_800_000_000_500);
  assert.ok(b < a && c < b, `${c} < ${b} < ${a}`);
  assert.match(a, /^\d{13}-\w+\.json$/);
});

test('a read returns the newest versions; a write keeps only the newest few', async () => {
  for (let i = 1; i <= 5; i++) await writeVersion('doc/', { i }, 3);
  assert.deepEqual(await readVersions<{ i: number }>('doc/', 2), [{ i: 5 }, { i: 4 }]);
  assert.equal((await listVersions('doc/')).length, 3);
});

test('two writers racing from the same listing both leave a version', async () => {
  const names = await listVersions('race/');
  await Promise.all([writeVersion('race/', 'a', 4, names), writeVersion('race/', 'b', 4, names)]);
  assert.deepEqual((await readVersions<string>('race/', 4)).sort(), ['a', 'b']);
});

test('a listing is scoped to its directory', async () => {
  await writeVersion('settings/ab/', { hidden: true }, 2);
  await putJSON('settings/ab.json', { hidden: true }, { overwrite: true });
  await writeVersion('settings/abc/', { hidden: false }, 2);
  assert.equal((await listVersions('settings/ab/')).length, 1);
});

test('a fresh read sees a deletion; a plain one only reads what is there', async () => {
  await putJSON('meta/gone.json', { v: 1 });
  assert.deepEqual(await getJSON('meta/gone.json', true), { v: 1 });
  fs.rmSync(path.join(dir, 'meta/gone.json'));
  assert.equal(await getJSON('meta/gone.json', true), null);
});
