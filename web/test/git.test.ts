// The pack download: pkt-lines split anywhere across network chunks, and the progress the replay guard watches.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DELIM, FLUSH, fetchPack, pkt, type Transport } from '../lib/engine/git';

const SHA = 'a'.repeat(40);

/** A protocol-v2 fetch response: shallow-info, then the pack in side-band pkt-lines of the biggest size git sends. */
function response(pack: Buffer): Buffer {
  const parts = [pkt('shallow-info\n'), pkt(`shallow ${SHA}\n`), DELIM, pkt('packfile\n')];
  for (let i = 0; i < pack.length; i += 65515) {
    const data = pack.subarray(i, i + 65515);
    parts.push(Buffer.from((data.length + 5).toString(16).padStart(4, '0')), Buffer.from([1]), data);
  }
  parts.push(FLUSH);
  return Buffer.concat(parts);
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
