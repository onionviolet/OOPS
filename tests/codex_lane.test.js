import test from 'node:test';
import assert from 'node:assert/strict';
import { parseArgs, stripApiKeys, laneRecord } from '../scripts/codex_lane.mjs';

test('parses launch arguments and requires model and effort', () => {
  assert.deepEqual(parseArgs(['launch', 'W1', 'brief.md', '--model', 'gpt-6-luna', '--effort', 'medium']),
    { command: 'launch', lane: 'W1', file: 'brief.md', model: 'gpt-6-luna', effort: 'medium' });
  assert.throws(() => parseArgs(['launch', 'W1', 'brief.md']), /requires --model and --effort/);
  assert.throws(() => parseArgs(['launch', '../bad', 'brief.md', '--model', 'm', '--effort', 'e']), /invalid lane-id/);
});

test('parses resume and status without accepting stray options', () => {
  assert.deepEqual(parseArgs(['resume', 'W1', 'message.md']), { command: 'resume', lane: 'W1', file: 'message.md' });
  assert.deepEqual(parseArgs(['status']), { command: 'status' });
  assert.throws(() => parseArgs(['status', 'W1']), /takes no arguments/);
});

test('strips API credentials without mutating the input environment', () => {
  const input = { OPENAI_API_KEY: 'a', CODEX_API_KEY: 'b', ANTHROPIC_API_KEY: 'c', KEEP: 'yes' };
  assert.deepEqual(stripApiKeys(input), { KEEP: 'yes' });
  assert.equal(input.OPENAI_API_KEY, 'a');
});

test('records a stable lane receipt shape without storing prompt contents', () => {
  const row = laneRecord({ lane: 'W1', pid: 45, cwd: '/repo', brief: '/repo/brief.md', model: 'gpt-6-luna', effort: 'medium', log: '/tmp/run.log', last_message: '/tmp/last.md' });
  assert.deepEqual(Object.keys(row), ['lane', 'pid', 'session_id', 'started_at', 'cwd', 'brief', 'model', 'effort', 'log', 'last_message']);
  assert.equal(row.session_id, null); assert.equal(Number.isNaN(Date.parse(row.started_at)), false);
});
