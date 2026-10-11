import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { Transport } from '../lib/engine/git';

export const REPO_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..');

export function sh(cwd: string, args: string[], env: Record<string, string> = {}): string {
  const r = spawnSync(args[0], args.slice(1), { cwd, env: { ...process.env, ...env }, encoding: 'utf8', maxBuffer: 1 << 30 });
  if (r.status !== 0) throw new Error(`${args.join(' ')} failed: ${r.stderr}`);
  return r.stdout;
}

export function tmpdir(prefix = 'cc-test-'): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

/** A scratch repo where every commit gets an explicit time, author and timezone. */
export class Repo {
  constructor(readonly dir: string) {
    fs.mkdirSync(dir, { recursive: true });
    sh(dir, ['git', 'init', '-q', '-b', 'main']);
    sh(dir, ['git', 'config', 'core.symlinks', 'true']);
  }
  write(p: string, lines?: number, data?: Buffer | string): this {
    const full = path.join(this.dir, p);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    if (data !== undefined) fs.writeFileSync(full, data);
    else fs.writeFileSync(full, Array.from({ length: lines ?? 1 }, (_, i) => `line ${i} of ${p}\n`).join(''));
    return this;
  }
  rm(p: string): this { sh(this.dir, ['git', 'rm', '-rq', p]); return this; }
  mv(a: string, b: string): this {
    fs.mkdirSync(path.dirname(path.join(this.dir, b)), { recursive: true });
    sh(this.dir, ['git', 'mv', a, b]);
    return this;
  }
  symlink(target: string, p: string): this { fs.symlinkSync(target, path.join(this.dir, p)); return this; }
  /** author is a name (the email is made up from it) or a full `Name <email>`. */
  env(ts: number, author: string, tz: string, cts?: number): Record<string, string> {
    const m = /^(.*) <(.*)>$/.exec(author);
    const [name, email] = m ? [m[1], m[2]] : [author, `${author.toLowerCase()}@x.test`];
    return {
      GIT_AUTHOR_DATE: `${ts} ${tz}`, GIT_COMMITTER_DATE: `${cts ?? ts} ${tz}`,
      GIT_AUTHOR_NAME: name, GIT_AUTHOR_EMAIL: email, GIT_COMMITTER_NAME: name, GIT_COMMITTER_EMAIL: email,
    };
  }
  /** msg, when given, is kept verbatim (CRs, trailers and all). */
  commit(ts: number, author = 'Ann', tz = '+0000', cts?: number, msg?: string): string {
    sh(this.dir, ['git', 'add', '-A']);
    sh(this.dir, ['git', 'commit', '-q', '--allow-empty', ...(msg === undefined ? ['-m', `c${ts}`] : ['--cleanup=verbatim', '-m', msg])],
      this.env(ts, author, tz, cts));
    return this.head();
  }
  checkout(...args: string[]): this { sh(this.dir, ['git', 'checkout', '-q', ...args]); return this; }
  merge(branch: string, ts: number, author = 'Ann', tz = '+0000'): string {
    sh(this.dir, ['git', 'merge', '-q', '--no-ff', '-m', `merge ${branch}`, branch], this.env(ts, author, tz));
    return this.head();
  }
  head(): string { return sh(this.dir, ['git', 'rev-parse', 'HEAD']).trim(); }
  revList(...args: string[]): string[] { return sh(this.dir, ['git', 'rev-list', ...args]).split('\n').filter(Boolean); }
  bare(): string {
    const dest = this.dir + '.git';
    fs.rmSync(dest, { recursive: true, force: true });
    sh(path.dirname(this.dir), ['git', 'clone', '-q', '--bare', '--single-branch', '--no-tags', this.dir, dest]);
    return dest;
  }
}

/** `git upload-pack --stateless-rpc` speaking protocol v2: the server side of a GitHub fetch, offline. */
export function localTransport(gitDir: string, log?: string[]): Transport {
  return {
    async rpc(body) {
      log?.push(body.toString('latin1'));
      const p = spawn('git', ['-c', 'uploadpack.allowAnySHA1InWant=true', '-c', 'uploadpack.allowFilter=true', 'upload-pack', '--stateless-rpc', gitDir],
        { env: { ...process.env, GIT_PROTOCOL: 'version=2' } });
      const chunks: Buffer[] = [];
      const err: Buffer[] = [];
      p.stdout.on('data', c => chunks.push(c));
      p.stderr.on('data', c => err.push(c));
      p.stdin.end(body);
      await new Promise<void>((res, rej) => p.on('close', code => (code === 0 || chunks.length ? res() : rej(new Error(Buffer.concat(err).toString())))));
      const out = Buffer.concat(chunks);
      return (async function* () { for (let i = 0; i < out.length; i += 7001) yield out.subarray(i, i + 7001); })();
    },
  };
}

export interface PyRecord {
  head: string; fp_commits: number; base_t: number | null;
  files: [string, number, number[]][];
  v: number;
  mine: [number, number, number, number[], string, string][];     // ..., sha12, who
}

/** The reference implementation: commit_city.extract.replay on a bare clone. */
export function pythonReplay(bareDir: string, start: number, shas: string[]): PyRecord {
  const code = `
import json, sys
from commit_city import extract
from commit_city.config import Config
cfg = Config()
shas = [s for s in open(sys.argv[3]).read().split() if s]
rec = extract.replay(sys.argv[1], int(sys.argv[2]), shas, extract.make_keep(cfg), extract.lang_table({}))
print(json.dumps(rec))`;
  const list = path.join(tmpdir('cc-shas-'), 'shas.txt');
  fs.writeFileSync(list, shas.join('\n'));
  const out = sh(REPO_ROOT, ['python3', '-c', code, bareDir, String(start), list], { PYTHONPATH: REPO_ROOT });
  return JSON.parse(out);
}
