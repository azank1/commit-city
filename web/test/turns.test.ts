import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Turns } from '../lib/turns.js';

const tick = (ms = 0) => new Promise(r => setTimeout(r, ms));

test('turns go one at a time, in arrival order', async () => {
  const turns = new Turns(), log: string[] = [];
  const job = async (name: string, ms: number) => {
    assert.equal(await turns.take(5000), true);
    log.push(`${name}+`);
    await tick(ms);
    log.push(`${name}-`);
    turns.done();
  };
  await Promise.all([job('a', 30), job('b', 5), job('c', 5)]);
  assert.deepEqual(log, ['a+', 'a-', 'b+', 'b-', 'c+', 'c-']);
  assert.equal(await turns.take(0), true);           // free again once everyone is done
  turns.done();
});

test('a caller that waits too long gives up its place and the queue moves on', async () => {
  const turns = new Turns();
  assert.equal(await turns.take(1000), true);
  const late = turns.take(20);
  const next = turns.take(1000);
  assert.equal(turns.waiting, 2);
  assert.equal(await late, false);
  assert.equal(turns.waiting, 1);
  turns.done();
  assert.equal(await next, true);
  turns.done();
  assert.equal(turns.waiting, 0);
});
