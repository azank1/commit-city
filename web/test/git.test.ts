// The pack download: pkt-lines split anywhere across network chunks, the progress the replay guard watches, and
// the ways a download stops.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DELIM, FLUSH, fetchPack, GitError, pkt, type Transport } from '../lib/engine/git';

const SHA = 'a'.repeat(40);

/** One side-band pkt-line: band 1 carries pack bytes, band 3 an error. */
function band(n: number, data: Buffer): Buffer {
  return Buffer.concat([Buffer.from((data.length + 5).toString(16).padStart(4, '0')), Buffer.from([n]), data]);
}

/** The packfile section: the pack in side-band pkt-lines of the biggest size git sends. */
function packfile(pack: Buffer): Buffer[] {
  const parts = [pkt('packfile\n')];
  for (let i = 0; i < pack.length; i += 65515) parts.push(band(1, pack.subarray(i, i + 65515)));
  return parts;
}

/** A protocol-v2 fetch response: shallow-info, then the pack. */
function response(pack: Buffer): Buffer {
  return Buffer.concat([pkt('shallow-info\n'), pkt(`shallow ${SHA}\n`), DELIM, ...packfile(pack), FLUSH]);
}

/** Serves `body` in chunks of the given sizes, round and round: 3 bytes splits a pkt-line's length in two. */
function chunked(body: Buffer, sizes: number[]): Transport {
  return {
    async rpc() {
      return (async function* () {
        for (let i = 0, k = 0; i < body.length; k++) {
          const n = sizes[k % sizes.length];
          yield body.subarray(i, i + n);
          i += n;
        }
      })();
    },
  };
}

function pattern(n: number): Buffer {
  const b = Buffer.allocUnsafe(n);
  for (let i = 0; i < n; i++) b[i] = (i * 2654435761) >>> 24;
  return b;
}

test('a pack split anywhere across chunks arrives whole, and its progress counts up to its size', async () => {
  const pack = pattern(1_500_000);
  const body = response(pack);
  const seen: number[] = [];
  const r = await fetchPack(chunked(body, [3, 1, 7001, 65536, 100_000, 2]), { want: SHA, onProgress: n => seen.push(n) });
  assert.ok(r.pack.equals(pack));
  assert.deepEqual(r.shallow, [SHA]);
  assert.equal(seen.at(-1), pack.length);
  assert.ok(seen.every((n, i) => i === 0 || n > seen[i - 1]));
});

const code = (c: string) => (e: unknown) => e instanceof GitError && e.code === c;

test('a response a byte at a time: lengths, side bands and text lines split everywhere', async () => {
  const pack = pattern(66_000);                  // two pkt-lines
  const body = Buffer.concat([pkt('shallow-info\n'), pkt(`shallow ${SHA}\n`), pkt(`unshallow ${'b'.repeat(40)}\n`), DELIM, ...packfile(pack), FLUSH]);
  const r = await fetchPack(chunked(body, [1]), { want: SHA });
  assert.ok(r.pack.equals(pack));
  assert.deepEqual(r.shallow, [SHA]);
  assert.deepEqual(r.unshallow, ['b'.repeat(40)]);
});

test('an error on the side band, split across chunks, stops the fetch with its message', async () => {
  const body = Buffer.concat([pkt('packfile\n'), band(1, pattern(1000)), band(3, Buffer.from('fatal: the remote end hung up\n')), FLUSH]);
  await assert.rejects(fetchPack(chunked(body, [7]), { want: SHA }),
    (e: unknown) => code('protocol')(e) && (e as Error).message === 'remote error: fatal: the remote end hung up');
});

test('a pack over its budget stops with too_big and aborts the download', async () => {
  let signal: AbortSignal | undefined;
  const t = chunked(response(pattern(300_000)), [65536]);
  const spy: Transport = { rpc: (b, s) => { signal = s; return t.rpc(b, s); } };
  await assert.rejects(fetchPack(spy, { want: SHA, maxBytes: 200_000 }), code('too_big'));
  assert.equal(signal?.aborted, true);
});

test('an ERR line, and a response with no pack, say why', async () => {
  const err = (m: string) => chunked(Buffer.concat([pkt(`ERR ${m}\n`), FLUSH]), [5]);
  await assert.rejects(fetchPack(err(`upload-pack: not our ref ${SHA}`), { want: SHA }), code('empty'));
  await assert.rejects(fetchPack(err('upload-pack: something else'), { want: SHA }), code('protocol'));
  // git answers a deepen-since that selects no commits with shallow-info and no pack
  const none = chunked(Buffer.concat([pkt('shallow-info\n'), pkt(`shallow ${SHA}\n`)]), [9]);
  await assert.rejects(fetchPack(none, { want: SHA, deepenSince: 1 }), code('empty'));
});
