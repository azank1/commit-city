// Drive a city build through the public API exactly as the page does (start -> repo x N -> finish).
// Used to prewarm featured cities and to test a deployment end to end.
// usage: node scripts/build-city.mjs <base url> <target> [--all] [--concurrency 4]
const [base, target, ...rest] = process.argv.slice(2);
if (!base || !target) {
  console.error('usage: node scripts/build-city.mjs <base url> <target> [--all] [--concurrency 4]');
  process.exit(2);
}
const all = rest.includes('--all');
const ci = rest.indexOf('--concurrency');
const width = ci >= 0 ? +rest[ci + 1] : 4;

async function call(path, body) {
  const r = await fetch(base + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const j = await r.json().catch(() => ({ error: `HTTP ${r.status}` }));
  if (!r.ok) { const e = new Error(j.error || `HTTP ${r.status}`); e.status = r.status; e.info = j; throw e; }
  return j;
}

const t0 = Date.now();
const secs = t => ((Date.now() - t) / 1000).toFixed(1);
const st = await call('/api/build/start', { t: target, all });
console.log(`${st.target} (${st.kind}): ${st.repos.length} repos, ${st.repos.filter(r => r.cached).length} cached, ${st.skipped.length} skipped, ${st.cost} API points, ${secs(t0)}s`);
for (const s of st.skipped) console.log(`  skipped ${s.name}: ${s.reason}`);
const todo = st.repos.filter(r => !r.cached).sort((a, b) => b.mb - a.mb || b.commits - a.commits);
let i = 0, failed = 0;
await Promise.all(Array.from({ length: Math.min(width, todo.length) }, async () => {
  while (i < todo.length) {
    const r = todo[i++];
    const t1 = Date.now();
    for (let attempt = 1; ; attempt++) {
      try {
        const x = await call('/api/build/repo', { ticket: st.ticket, repo: r.name });
        console.log(`  ${r.name}: ${x.cached ? 'cached' : `${x.files} files, ${x.commits} commits, ${x.mb} MB packs${x.partial ? ', partial' : ''}`} in ${secs(t1)}s`);
        break;
      } catch (e) {
        if (e.status === 422 || e.status === 400 || e.status === 401 || attempt >= 2) { failed++; console.log(`  ${r.name}: FAILED ${e.message} (${secs(t1)}s)`); break; }
      }
    }
  }
}));
const meta = await call('/api/build/finish', { ticket: st.ticket, plan: st.plan });
console.log(`done in ${secs(t0)}s: ${meta.repos} repos, ${meta.commits} commits, ${meta.files} files, ${meta.lines} lines${failed ? `, ${failed} failed` : ''}`);
console.log(`  ${base}/${meta.target}${all ? '?all=1' : ''}`);
