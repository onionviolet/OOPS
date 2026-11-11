// Merge queue (FRC71) on a throwaway repo: clean merge, conflict stop, dirty-path three-way
// sync and the refusal when master moves underneath. Stub npm scripts keep it to seconds.
import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

const SCRIPT = fileURLToPath(new URL('../scripts/merge_queue.mjs', import.meta.url));
const lines = (n, tag = '') => Array.from({length: n}, (_, i) => `line ${i + 1}${tag}`).join('\n') + '\n';

function env() {
  const {YAIRPG_SLOT_HELD, GIT_INDEX_FILE, GIT_DIR, GIT_WORK_TREE, ...rest} = process.env;
  return {...rest, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_NOSYSTEM: '1'};
}
function sh(cwd, cmd, args) {
  const r = spawnSync(cmd, args, {cwd, env: env(), encoding: 'utf8'});
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(' ')}: ${r.stderr}`);
  return r.stdout.trim();
}
const git = (cwd, ...args) => sh(cwd, 'git', args);

// buildCmd lets a test make the stub build do something (e.g. move master).
function makeRepo(buildCmd = 'node -e 0') {
  const dir = realpathSync(mkdtempSync(join(tmpdir(), 'mq-test-')));
  git(dir, 'init', '-q', '-b', 'master');
  git(dir, 'config', 'user.name', 'Test');
  git(dir, 'config', 'user.email', 'test@example.invalid');
  writeFileSync(join(dir, 'package.json'), JSON.stringify({
    scripts: {
      build: buildCmd,
      'check:arch': 'node -e 0',
      'check:rules': 'node -e 0',
      test: 'node -e "console.log(\'# tests 2\\n# pass 2\\n# fail 0\')"',
    },
  }, null, 2));
  writeFileSync(join(dir, 'a.txt'), lines(12));
  writeFileSync(join(dir, 'b.txt'), lines(3));
  writeFileSync(join(dir, 'gone.txt'), 'old\n');
  git(dir, 'add', '.');
  git(dir, 'commit', '-q', '-m', 'base');
  return dir;
}
function branch(dir, name, files, remove = []) {
  git(dir, 'checkout', '-q', '-b', name, 'master');
  for (const [p, body] of Object.entries(files)) writeFileSync(join(dir, p), body);
  for (const p of remove) git(dir, 'rm', '-q', p);
  git(dir, 'add', '.');
  git(dir, 'commit', '-q', '-m', `work on ${name}`);
  git(dir, 'checkout', '-q', 'master');
}
function queue(dir, ...args) {
  const r = spawnSync(process.execPath, [SCRIPT, ...args], {cwd: dir, env: env(), encoding: 'utf8'});
  return {status: r.status, out: r.stdout + r.stderr};
}
const worktrees = (dir) => git(dir, 'worktree', 'list').split('\n').length;

test('clean merge: dry run leaves master, --apply moves it and syncs clean paths', () => {
  const dir = makeRepo();
  branch(dir, 'one', {'a.txt': lines(12).replace('line 2\n', 'line 2 one\n'), 'new.txt': 'new\n'});
  branch(dir, 'two', {'b.txt': lines(3, ' two')}, ['gone.txt']);
  const H = git(dir, 'rev-parse', 'master');

  const dry = queue(dir, 'one', 'two');
  assert.equal(dry.status, 0, dry.out);
  assert.match(dry.out, /dry run/);
  assert.match(dry.out, /test: pass .*tests 2 pass 2 fail 0/);
  assert.equal(git(dir, 'rev-parse', 'master'), H, 'dry run never moves master');
  assert.equal(worktrees(dir), 1, 'scratch worktree removed');

  const app = queue(dir, '--apply', 'one', 'two');
  assert.equal(app.status, 0, app.out);
  const next = git(dir, 'rev-parse', 'master');
  assert.notEqual(next, H);
  assert.equal(git(dir, 'log', '-2', '--format=%s', 'master'), 'Merge two\nMerge one');
  assert.doesNotMatch(git(dir, 'log', '--format=%B', `${H}..master`), /Co-Authored-By/i);
  assert.equal(git(dir, 'status', '--porcelain'), '', 'primary matches the new master');
  assert.match(readFileSync(join(dir, 'a.txt'), 'utf8'), /line 2 one/);
  assert.match(app.out, /merged paths \(4\)/);

  const again = queue(dir, 'one', 'two');
  assert.match(again.out, /already merged[\s\S]*no-op/);
  rmSync(dir, {recursive: true, force: true});
});

test('conflict stops the queue and names the branch and path', () => {
  const dir = makeRepo();
  branch(dir, 'left', {'a.txt': lines(12).replace('line 5\n', 'line 5 left\n')});
  branch(dir, 'right', {'a.txt': lines(12).replace('line 5\n', 'line 5 right\n')});
  const H = git(dir, 'rev-parse', 'master');
  const r = queue(dir, '--apply', 'left', 'right');
  assert.equal(r.status, 1);
  assert.match(r.out, /STOPPED at right: conflict\s+a\.txt/);
  assert.equal(git(dir, 'rev-parse', 'master'), H);
  rmSync(dir, {recursive: true, force: true});
});

test('a path dirty in the primary gets a three-way sync, never an overwrite', () => {
  const dir = makeRepo();
  branch(dir, 'far', {'a.txt': lines(12).replace('line 11\n', 'line 11 merged\n')});
  branch(dir, 'near', {'b.txt': lines(3).replace('line 2\n', 'line 2 merged\n')});
  // Another session's uncommitted edits in the primary.
  writeFileSync(join(dir, 'a.txt'), lines(12).replace('line 1\n', 'line 1 mine\n'));
  writeFileSync(join(dir, 'b.txt'), lines(3).replace('line 2\n', 'line 2 mine\n'));
  const r = queue(dir, '--apply', 'far', 'near');
  assert.equal(r.status, 0, r.out);
  const a = readFileSync(join(dir, 'a.txt'), 'utf8');
  assert.match(a, /line 1 mine/);
  assert.match(a, /line 11 merged/);
  assert.match(r.out, /three-way clean: a\.txt/);
  assert.equal(git(dir, 'diff', '--cached', '--name-only'), '', 'index follows HEAD');
  assert.equal(git(dir, 'diff', '--', 'a.txt').split('\n').filter((l) => /^[-+][^-+]/.test(l)).join('|'), '-line 1|+line 1 mine');
  // b.txt conflicts on the same line: left untouched, marked copy saved for review.
  assert.equal(readFileSync(join(dir, 'b.txt'), 'utf8'), lines(3).replace('line 2\n', 'line 2 mine\n'));
  const m = r.out.match(/CONFLICT left untouched: b\.txt \(1 hunks; marked copy (.+)\)/);
  assert.ok(m, r.out);
  assert.match(readFileSync(m[1], 'utf8'), /<<<<<<< primary working copy[\s\S]*line 2 merged/);
  assert.match(r.out, /needs review/);
  rmSync(dir, {recursive: true, force: true});
});

test('refuses when master moves underneath, and when the primary index has staged entries', () => {
  // The stub build commits to master in the primary while the queue is checking.
  const dir = makeRepo();
  writeFileSync(join(dir, 'package.json'), readFileSync(join(dir, 'package.json'), 'utf8').replace(
    /"build": "[^"]*"/, `"build": "git -C ${dir} commit -q --allow-empty -m race"`));
  git(dir, 'commit', '-q', '-am', 'stub build moves master');
  branch(dir, 'late', {'b.txt': 'late\n'});
  const r = queue(dir, '--apply', 'late');
  assert.equal(r.status, 1);
  assert.match(r.out, /REFUSED: master moved underneath/);
  assert.equal(git(dir, 'log', '-1', '--format=%s', 'master'), 'race', 'the racing commit survives');
  assert.equal(readFileSync(join(dir, 'b.txt'), 'utf8'), lines(3), 'primary not synced');

  writeFileSync(join(dir, 'b.txt'), 'staged by someone else\n');
  git(dir, 'add', 'b.txt');
  const s = queue(dir, 'late');
  assert.equal(s.status, 1);
  assert.match(s.out, /REFUSED: primary index has 1 staged entries \(b\.txt\)/);
  rmSync(dir, {recursive: true, force: true});
});
