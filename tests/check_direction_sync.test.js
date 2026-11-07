import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdtempSync, mkdirSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

const script = join(process.cwd(), 'scripts/check_direction_sync.mjs');
const repo = () => {
  const dir = mkdtempSync(join(tmpdir(), 'dirsync-'));
  const git = (...a) => execFileSync('git', ['-C', dir, '-c', 'user.name=t', '-c', 'user.email=t@t', ...a], {encoding: 'utf8'});
  git('init', '-q');
  mkdirSync(join(dir, 'docs/gm'), {recursive: true});
  const put = (p, t) => writeFileSync(join(dir, p), t);
  put('docs/USER_VISION.md', '# v\n'); put('docs/VISION_DIGEST.md', '# d\n'); put('PROJECT.md', 'line one\nline two\n'); put('docs/gm/PROJECT_LOG_x.md', '# log\n');
  git('add', '.'); git('commit', '-qm', 'base');
  return {dir, git, put, run: (...a) => execFileSync('node', [script, '--root', dir, ...a], {encoding: 'utf8'})};
};

test('a dated USER_VISION heading warns that it belongs in the direction log', () => {
  const r = repo();
  r.put('docs/USER_VISION.md', '# v\n## New direction (2026-11-03)\nWeibao: x\n');
  r.put('docs/VISION_DIGEST.md', '# d\n- new direction\n');
  assert.match(r.run(), /WARN .*USER_VISION_LOG/);
  assert.throws(() => r.run('--strict'), /status 1|Command failed/);
});

test('removing a PROJECT.md line without a project log entry warns', () => {
  const r = repo();
  r.put('PROJECT.md', 'line one\nreplacement\n');
  assert.match(r.run(), /WARN .*PROJECT\.md/);
  r.put('docs/gm/PROJECT_LOG_x.md', '# log\n2026-11-03: replaced line two\n');
  assert.match(r.run(), /PASS/);
});

test('an undated heading or a PROJECT.md pure addition does not warn', () => {
  const r = repo();
  r.put('docs/USER_VISION.md', '# v\n## A topic with no date\n');
  r.put('PROJECT.md', 'line one\nline two\nline three\n');
  assert.match(r.run(), /PASS/);
});

test('a dated request added to the direction log needs USER_VISION or the digest', () => {
  const r = repo();
  r.put('docs/gm/USER_VISION_LOG_2026-11.md', '# log\n'); r.git('add', '.'); r.git('commit', '-qm', 'log');
  r.put('docs/gm/USER_VISION_LOG_2026-11.md', '# log\n## A request, 2026-11-07\nWeibao: x\n');
  assert.match(r.run(), /WARN .*direction log/);
  r.put('docs/USER_VISION.md', '# v\n- standing line\n');
  assert.match(r.run(), /PASS/);
});
