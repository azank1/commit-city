// Bundle test/*.test.ts with esbuild and run them with node's built-in test runner.
import { build } from 'esbuild';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, '.test-out');
fs.rmSync(out, { recursive: true, force: true });
const only = process.argv.slice(2);
const entries = fs.readdirSync(path.join(root, 'test')).filter(f => f.endsWith('.test.ts'))
  .filter(f => !only.length || only.some(o => f.includes(o))).map(f => path.join(root, 'test', f));
await build({
  entryPoints: entries, bundle: true, platform: 'node', format: 'esm', target: 'node20', outdir: out,
  outExtension: { '.js': '.mjs' }, sourcemap: 'inline', logLevel: 'warning',
  banner: { js: "import { createRequire as __cr } from 'node:module'; const require = __cr(import.meta.url);" },
});
const files = fs.readdirSync(out).filter(f => f.endsWith('.mjs')).map(f => path.join(out, f));
const r = spawnSync(process.execPath, ['--test', '--test-reporter=spec', ...files], { stdio: 'inherit', cwd: root });
process.exit(r.status ?? 1);
