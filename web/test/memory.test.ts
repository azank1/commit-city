// The replay guard, on a fake clock and fake memory: what counts as too big, what as busy, and when it collects.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { GitError } from '../lib/engine/git';
import { type Memory, replayGuard } from '../lib/engine/memory';

const MB = 1e6;

function harness(start: Memory, o: { maxLive?: number; maxRss?: number } = {}) {
  const h = {
    mem: { ...start }, t: 1_000_000, collections: [] as boolean[],
    freed: { live: 0, rss: 0 }, fullFreed: { live: 0, rss: 0 },     // what a collection gives back, normal and thorough
  };
  const guard = replayGuard({
    deadline: h.t + 60_000, maxLive: o.maxLive ?? 1200 * MB, maxRss: o.maxRss ?? 1900 * MB,
    read: () => ({ ...h.mem }), now: () => h.t,
    collect: thorough => {
      h.collections.push(thorough);
      const f = thorough ? h.fullFreed : h.freed;
      h.mem.live -= f.live;
      h.mem.rss -= f.rss;
    },
  });
  return { h, guard };
}

const code = (c: string) => (e: unknown) => e instanceof GitError && e.code === c;

test("too big counts what the replay holds, not what the instance held when it began", () => {
  // google/dawn started where another replay had left 1,196 MB live; the whole-process figure called it too big
  const { h, guard } = harness({ live: 1196 * MB, rss: 1300 * MB });
  h.mem.live += 900 * MB;                       // its own 900 MB, 2,096 MB in all: fine, nothing to collect
  guard();
  assert.deepEqual(h.collections, []);
  h.t += 3000;
  h.mem.live += 400 * MB;                       // 1,300 MB of its own: too big, after a collection that frees nothing
  assert.throws(() => guard(), (e: unknown) => code('too_big')(e) && /1300 MB of its own/.test((e as Error).message));
});

test('garbage over the limit is collected before it is believed, at most once per two seconds', () => {
  const { h, guard } = harness({ live: 50 * MB, rss: 300 * MB });
  h.mem.live += 1500 * MB;
  h.freed.live = 1400 * MB;                     // all but 100 MB of it is garbage
  guard();
  assert.deepEqual(h.collections, [false]);
  h.freed.live = 0;
  h.t += 500;
  h.mem.live += 1300 * MB;                      // over again half a second later: new garbage, not believed yet
  guard();
  assert.deepEqual(h.collections, [false]);
  h.t += 1600;                                  // two seconds on, it is collected and believed
  assert.throws(() => guard(), code('too_big'));
  assert.deepEqual(h.collections, [false, false]);
});

test('a full instance gets the thorough collection, and is busy only if that does not make room', () => {
  const { h, guard } = harness({ live: 50 * MB, rss: 1850 * MB });
  h.mem.rss += 100 * MB;
  h.fullFreed.rss = 600 * MB;                   // pooled pages given back
  guard();
  assert.deepEqual(h.collections, [true]);
  h.fullFreed.rss = 0;
  h.t += 200;
  h.mem.rss = 1950 * MB;                        // full again a moment after a thorough collection: full
  assert.throws(() => guard(), code('busy'));
  assert.deepEqual(h.collections, [true]);
});

test('a normal collection a moment ago does not stand in for the thorough one', () => {
  const { h, guard } = harness({ live: 50 * MB, rss: 500 * MB });
  h.mem.live += 1300 * MB;
  h.freed.live = 1300 * MB;
  guard();
  assert.deepEqual(h.collections, [false]);
  h.t += 200;
  h.mem.rss = 1950 * MB;
  h.fullFreed.rss = 400 * MB;
  guard();                                      // full: collects thoroughly though it collected 200 ms ago
  assert.deepEqual(h.collections, [false, true]);
});

test('the reserve keeps room for the copy a step is about to make', () => {
  const { h, guard } = harness({ live: 50 * MB, rss: 1500 * MB });
  guard(300 * MB);                              // 1,800 MB with the copy: room
  assert.deepEqual(h.collections, []);
  h.t += 200;
  assert.throws(() => guard(500 * MB), (e: unknown) => code('busy')(e) && /500 MB to come/.test((e as Error).message));
  assert.deepEqual(h.collections, [true]);
});

test('memory is read at most every 100 ms, and the deadline is checked every time', () => {
  let reads = 0, t = 0;
  const guard = replayGuard({ deadline: 1000, read: () => (reads++, { live: 0, rss: 0 }), now: () => t, collect: () => {} });
  const at = reads;                              // the guard reads once when it is made, for its starting point
  for (; t < 1000; t += 10) guard();
  assert.equal(reads - at, 10);
  t = 1001;
  assert.throws(() => guard(), code('timeout'));
});
