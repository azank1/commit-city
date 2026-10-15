// Which commit this deployment was built from, so a deploy can be read back and checked against the history.
// Vercel sets VERCEL_GIT_COMMIT_SHA for deployments made from git; a deployment without it says so rather than guess.
import { handle, HttpError, json } from '../http.js';

export const GET = handle(async () => {
  const commit = process.env.VERCEL_GIT_COMMIT_SHA;
  if (!commit || !/^[0-9a-f]{40}$/.test(commit)) throw new HttpError(503, 'this deployment does not know its commit');
  const ref = process.env.VERCEL_GIT_COMMIT_REF;
  return json({ commit, source: 'env:VERCEL_GIT_COMMIT_SHA', ...(ref ? { ref } : {}) });
});
