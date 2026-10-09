// The project's star count for the page chrome, cached at the edge so visitors never hit GitHub.
import { handle, json } from '../http.js';

export const GET = handle(async () => {
  const token = process.env.GITHUB_TOKEN;
  const r = await fetch('https://api.github.com/repos/azank1/commit-city', {
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'commit.city', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    signal: AbortSignal.timeout(4000),
  }).catch(() => null);
  const stars = r && r.ok ? ((await r.json()) as { stargazers_count?: number }).stargazers_count ?? null : null;
  return json({ stars }, 200, { 'Cache-Control': `public, s-maxage=${stars === null ? 60 : 600}, stale-while-revalidate=3600` });
});
