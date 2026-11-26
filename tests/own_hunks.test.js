import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdtempSync, writeFileSync, readFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

const script = join(process.cwd(), 'scripts/own_hunks.mjs');
const mk = (t,name='f.md') => {
  const dir = mkdtempSync(join(tmpdir(), 'ownh space-'));t.after(()=>rmSync(dir,{recursive:true,force:true}));
  const git = (...a) => execFileSync('git', ['-C', dir, '-c', 'user.name=t', '-c', 'user.email=t@t', ...a], {encoding: 'utf8'});
  git('init', '-q'); writeFileSync(join(dir, name), Array.from({length: 12}, (_, i) => `line ${i + 1}`).join('\n') + '\n');
  git('add', '.'); git('commit', '-qm', 'base');
  const run = (...a) => execFileSync(process.execPath, [script, ...a], {encoding: 'utf8', env: {...process.env, OWN_HUNKS_ROOT: dir, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t'}});
  return {dir, git, run, f: join(dir, name)};
};

test('commits only my hunk and leaves another session\'s edit in the working tree', t => {
  const r = mk(t);
  // another session edits line 2 first
  writeFileSync(r.f, readFileSync(r.f, 'utf8').replace('line 2\n', 'line 2 THEIRS\n'));
  r.run('snapshot', 'f.md');
  // I append at the end
  writeFileSync(r.f, readFileSync(r.f, 'utf8') + 'my added line\n');
  r.run('commit', '-m', 'mine', 'f.md');
  const committed = r.git('show', 'HEAD:f.md');
  assert.match(committed, /my added line/); assert.doesNotMatch(committed, /THEIRS/);
  assert.match(readFileSync(r.f, 'utf8'), /THEIRS/);
  assert.match(r.git('status', '--short'), /M f\.md/);
});
test('refuses without a snapshot and when hunks collide', t => {
  const r = mk(t);
  assert.throws(() => r.run('commit', '-m', 'x', 'f.md'), /Command failed/);
  r.run('snapshot', 'f.md');
  const base = readFileSync(r.f, 'utf8');
  writeFileSync(r.f, base.replace('line 5\n', 'line 5 OTHER\n'));
  r.git('commit', '-qam', 'other session commits the same line');
  writeFileSync(r.f, base.replace('line 5\n', 'line 5 MINE\n'));
  assert.throws(() => r.run('commit', '-m', 'mine', 'f.md'), /Command failed/);
  assert.match(r.git('show', 'HEAD:f.md'), /OTHER/);
});

test('Git patch paths retain spaces',t=>{
  const r=mk(t,'my file.md'),head=r.git('rev-parse','HEAD');
  r.run('snapshot','my file.md');
  writeFileSync(r.f,readFileSync(r.f,'utf8')+'spaced path addition\n');
  r.run('commit','-m','spaced','my file.md');
  assert.match(r.git('show','HEAD:my file.md'),/spaced path addition/);
  assert.notEqual(r.git('rev-parse','HEAD'),head);
});
