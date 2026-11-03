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

test('a dated USER_VISION heading without the digest warns; with the digest it passes', () => {
  const r = repo();
  r.put('docs/USER_VISION.md', '# v\n## New direction (2026-11-03)\nWeibao: x\n');
  assert.match(r.run(), /WARN .*VISION_DIGEST/);
  assert.throws(() => r.run('--strict'), /status 1|Command failed/);
  r.put('docs/VISION_DIGEST.md', '# d\n- new direction\n');
  assert.match(r.run(), /PASS/);
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
