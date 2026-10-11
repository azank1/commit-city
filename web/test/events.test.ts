// commit.city/events and the city page's live pulses: GitHub's raw events, compacted.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { compactEvent } from '../lib/routes/live';
import { siteOgSVG } from '../lib/card';

const raw = (type: string, payload: object, actor = 'octocat', repo = 'octo/hello') => ({
  id: '1', type, created_at: '2026-10-11T12:00:00Z', actor: { id: 583231, login: actor }, repo: { name: repo }, payload,
});

test('a push keeps who sent it and when', () => {
  const e = compactEvent(raw('PushEvent', { ref: 'refs/heads/main' }));
  assert.deepEqual(e, { id: '1', t: 1791720000, type: 'push', actor: 'octocat', aid: 583231, repo: 'octo/hello', who: '' });
});

test('a merged pull request is a merge, whichever way GitHub says it', () => {
  assert.equal(compactEvent(raw('PullRequestEvent', { action: 'closed', pull_request: { number: 7, merged: true } }))?.type, 'merge');
  assert.equal(compactEvent(raw('PullRequestEvent', { action: 'merged', pull_request: { number: 7 } }))?.type, 'merge');
  const closed = compactEvent(raw('PullRequestEvent', { action: 'closed', pull_request: { number: 7, merged: false } }));
  assert.equal(closed?.type, 'pr');
  assert.equal(closed?.act, 'closed');
  assert.equal(closed?.n, 7);
});

test('agents are recognised by their account and by their branch', () => {
  assert.equal(compactEvent(raw('PushEvent', { ref: 'refs/heads/main' }, 'copilot-swe-agent[bot]'))?.who, 'copilot');
  assert.equal(compactEvent(raw('PullRequestEvent', { action: 'opened', pull_request: { number: 1, head: { ref: 'claude/fix-login' } } }))?.who, 'claude');
  assert.equal(compactEvent(raw('PushEvent', { ref: 'refs/heads/codex/tidy' }))?.who, 'codex');
  assert.equal(compactEvent(raw('PushEvent', { ref: 'refs/heads/main' }, 'dependabot[bot]'))?.who, 'bot');
  assert.equal(compactEvent(raw('PushEvent', { ref: 'refs/heads/main' }, 'someone'))?.who, '');
});

test('branch and tag events carry their kind; releases their tag', () => {
  const br = compactEvent(raw('CreateEvent', { ref: 'cursor/new-ui', ref_type: 'branch' }));
  assert.equal(br?.rt, 'branch');
  assert.equal(br?.who, 'cursor');
  assert.equal(compactEvent(raw('CreateEvent', { ref: 'v1.0.0', ref_type: 'tag' }))?.who, '');   // a tag name is not a branch
  assert.equal(compactEvent(raw('ReleaseEvent', { action: 'published', release: { tag_name: 'v2.0.0' } }))?.tag, 'v2.0.0');
});

test('events the city does not draw, or that lack a repo or actor, are dropped', () => {
  assert.equal(compactEvent(raw('GollumEvent', {})), null);
  assert.equal(compactEvent({ ...raw('PushEvent', {}), repo: undefined }), null);
  assert.equal(compactEvent({ ...raw('PushEvent', {}), actor: undefined }), null);
});

test('the site pages have their own link previews', () => {
  for (const page of ['home', 'events', 'explore', 'readme', 'about', 'nonsense']) {
    const svg = siteOgSVG(page);
    assert.match(svg, /^<svg [^>]*width="1200" height="630"/, page);
    assert.doesNotMatch(svg, /undefined|NaN/, page);
  }
  assert.match(siteOgSVG('events'), /right now\./);
});
