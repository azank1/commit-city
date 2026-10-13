// The replay guard: stops a replay that is out of time, or whose memory would take the instance down. Fluid compute
// runs concurrent requests in one process, 2 GB between them, and past that the platform kills the instance with
// every request on it.
import v8 from 'node:v8';
import vm from 'node:vm';
import { GitError } from './git.js';

export const MAX_LIVE = 1.2e9;  // heap + buffers one replay may add to what was live when it began
export const MAX_RSS = 1.9e9;   // resident size, kept pages included: past it the platform is about to kill the instance
const MEM_EVERY_MS = 100;       // reading memory is a syscall, and the guard runs every 1024 objects, commit and pkt-line
const GC_EVERY_MS = 2000;       // a full collection is not free: at most one per two seconds per replay

export interface Memory { live: number; rss: number }    // heap + buffers; resident size

export function readMemory(): Memory {
  const m = process.memoryUsage();
  return { live: m.heapUsed + m.external, rss: m.rss };
}

// V8's collector, which Node hides unless started with --expose-gc; a context made after the flag is set has it.
// A normal collection runs twice: buffers the first pass frees still count as external memory until the next one
// settles the sweep. The thorough one is V8's last resort, which also gives back the heap pages V8 keeps pooled:
// after google/dawn, two normal collections left 1,002 MB resident for 57 MB live; the last resort, 427 MB.
let gc: NodeJS.GCFunction | null | undefined;
export function collectGarbage(thorough = false) {
  if (gc === undefined) {
    try {
      gc = typeof globalThis.gc === 'function' ? globalThis.gc : (v8.setFlagsFromString('--expose-gc'), vm.runInNewContext('gc') as NodeJS.GCFunction);
    } catch { gc = null; }
  }
  if (!gc) return;
  if (thorough) gc({ type: 'major', execution: 'sync', flavor: 'last-resort' });
  else { gc(); gc(); }
}

export interface GuardOptions {
  deadline: number;             // epoch ms: past it the replay stops with timeout
  maxLive?: number;
  maxRss?: number;
  read?: () => Memory;          // tests
  collect?: (thorough: boolean) => void;
  now?: () => number;
}

const mb = (n: number) => Math.round(n / 1e6);

/** The check a replay runs as it goes; `reserve` is memory the step under way is about to add (a pack's copy). */
export function replayGuard(o: GuardOptions): (reserve?: number) => void {
  const read = o.read ?? readMemory, collect = o.collect ?? collectGarbage, now = o.now ?? Date.now;
  const maxLive = o.maxLive ?? MAX_LIVE, maxRss = o.maxRss ?? MAX_RSS;
  // Too big is about the repo, so it counts what this replay holds: live memory beyond what was live when it began.
  // The process's whole figure failed repos on an instance still busy with others. Busy is about the instance: its
  // resident size, with what the step under way is about to add.
  const base = read().live;
  let readAt = -Infinity, gcAt = -Infinity, thoroughAt = -Infinity;
  return (reserve = 0) => {
    const t = now();
    if (t > o.deadline) throw new GitError('replay ran out of time', 'timeout');
    if (t - readAt < MEM_EVERY_MS) return;
    readAt = t;
    let m = read();
    const full = () => m.rss + reserve > maxRss;
    const busy = () => new GitError(`the hosted builder is short of memory right now (${mb(m.rss)} MB resident${reserve ? `, ${mb(reserve)} MB to come` : ''})`, 'busy');
    if (m.live - base <= maxLive && !full()) return;
    // Garbage counts as live until V8 collects it, and V8 collects lazily while memory is plentiful: collect before
    // believing a figure, at most once per GC_EVERY_MS (over again a moment later, it is new garbage). A full
    // instance gets the thorough collection, the one that gives pooled pages back; still full a moment after one,
    // it is full.
    const tight = full();
    if (t - (tight ? thoroughAt : gcAt) < GC_EVERY_MS) {
      if (tight) throw busy();
      return;
    }
    gcAt = t;
    if (tight) thoroughAt = t;
    collect(tight);
    m = read();
    if (m.live - base > maxLive) throw new GitError(`replay needs more memory than the hosted builder has (${mb(m.live - base)} MB of its own)`, 'too_big');
    if (full()) throw busy();
  };
}
