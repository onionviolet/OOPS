#!/usr/bin/env node
// Merge queue (FRC71): the isolated merge procedure used by hand on 2026-11-10.
//
// Usage: node scripts/merge_queue.mjs [--apply] [--no-checks] [--target master]
//          [--primary <path>] [--keep-scratch] <branch> [<branch>...]
//
// 1. Records the target's commit H and refuses if the primary index has staged entries.
// 2. Merges each branch in order with `git merge-tree --write-tree` and `git commit-tree`
//    ("Merge <branch>", no trailers). A branch already in the result is skipped. On a conflict
//    it stops and names the branch and paths. Conflicts limited to generated build outputs
//    (dist/bundle.js, its map, index.html) take the queue's side and are rebuilt in step 3.
// 3. Checks the result in a detached scratch worktree with a node_modules symlink:
//    npm run build, check:arch, check:rules, then one npm test (already behind the limiter).
// 4. Dry run by default. With --apply and a pass: guarded `git update-ref <target> <new> <H>`,
//    then syncs the primary checkout. Clean paths: `git checkout HEAD -- <path>`. Paths dirty in
//    the primary: three-way `git merge-file` of the working copy, H's blob and the new blob, with
//    the index set to HEAD for those paths. A conflicted three-way leaves the working file as is
//    and saves the marked copy for review. A dirty file is never overwritten.
// 5. Removes the scratch worktree and prints a receipt, also saved under
//    <git-common-dir>/merge-queue/<stamp>/.
//
// Never stashes, resets, forces or pushes. Exit codes: 0 pass, 1 refused or failed, 2 usage.
import {spawnSync} from 'node:child_process';
import {existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, symlinkSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const GENERATED = ['dist/bundle.js', 'dist/bundle.js.map', 'index.html'];
const DEFAULT_CHECKS = [
  ['build', 'npm run build'],
  ['check:arch', 'npm run check:arch'],
  ['check:rules', 'npm run check:rules'],
  ['test', 'npm test'],
];
const ZERO = '0000000000000000000000000000000000000000';

function parseArgs(argv) {
  const o = {apply: false, checks: true, target: 'master', primary: null, keepScratch: false, branches: []};
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--apply') o.apply = true;
    else if (a === '--no-checks') o.checks = false;
    else if (a === '--keep-scratch') o.keepScratch = true;
    else if (a === '--target') o.target = argv[++i];
    else if (a === '--primary') o.primary = argv[++i];
    else if (a === '-h' || a === '--help') o.help = true;
    else if (a.startsWith('-')) throw new Error(`unknown option ${a}`);
    else o.branches.push(a);
  }
  if (!o.help && !o.branches.length) throw new Error('name at least one branch');
  if (o.apply && !o.checks) throw new Error('--apply needs the checks; drop --no-checks');
  return o;
}

function childEnv(extra = {}) {
  const {YAIRPG_SLOT_HELD, GIT_INDEX_FILE, GIT_DIR, GIT_WORK_TREE, ...rest} = process.env;
  return {...rest, ...extra};
}

function git(cwd, args, {input, env, ok = [0]} = {}) {
  const r = spawnSync('git', args, {cwd, input, env: env || childEnv(), maxBuffer: 1 << 28});
  if (r.error) throw r.error;
  if (!ok.includes(r.status)) {
    throw new Error(`git ${args.join(' ')} failed (${r.status}): ${String(r.stderr).trim()}`);
  }
  return {status: r.status, out: r.stdout, text: String(r.stdout).trim(), err: String(r.stderr).trim()};
}
const gitText = (cwd, args, opts) => git(cwd, args, opts).text;

function stampNow() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function findPrimary(cwd, override) {
  if (override) return realpathSync(resolve(override));
  const common = realpathSync(resolve(cwd, gitText(cwd, ['rev-parse', '--git-common-dir'])));
  return dirname(common);
}

function stagedPaths(primary) {
  return gitText(primary, ['diff', '--cached', '--name-only', '-z']).split('\0').filter(Boolean);
}

// Paths the primary has changed against its index or HEAD, including untracked files.
function dirtyPaths(primary) {
  const raw = String(git(primary, ['status', '--porcelain=v1', '-z', '--untracked-files=all', '--no-renames']).out);
  const set = new Set();
  for (const entry of raw.split('\0')) if (entry.length > 3) set.add(entry.slice(3));
  return set;
}

function treeEntry(cwd, rev, path) {
  const line = gitText(cwd, ['ls-tree', '-z', rev, '--', path]).replace(/\0$/, '');
  if (!line) return null;
  const [meta, p] = line.split('\t');
  const [mode, type, oid] = meta.split(' ');
  return {mode, type, oid, path: p};
}

function blobBytes(cwd, oid) {
  return oid ? git(cwd, ['cat-file', 'blob', oid]).out : Buffer.alloc(0);
}

// Replace conflicted generated paths in a merge-tree result with the queue side's entry.
function resolveGenerated(repo, tree, cur, paths, scratchRoot) {
  const index = join(scratchRoot, `gen-index-${process.pid}`);
  const env = childEnv({GIT_INDEX_FILE: index});
  git(repo, ['read-tree', tree], {env});
  const info = paths.map((p) => {
    const e = treeEntry(repo, cur, p);
    return e ? `${e.mode} ${e.oid}\t${p}` : `0 ${ZERO}\t${p}`;
  }).join('\n') + '\n';
  git(repo, ['update-index', '--index-info'], {env, input: info});
  const out = gitText(repo, ['write-tree'], {env});
  rmSync(index, {force: true});
  return out;
}

function mergeBranches(repo, H, branches, scratchRoot) {
  let cur = H;
  const steps = [];
  let regenerate = false;
  for (const name of branches) {
    const v = git(repo, ['rev-parse', '--verify', '--quiet', `${name}^{commit}`], {ok: [0, 1]});
    if (v.status !== 0) return {cur, steps, stop: {branch: name, reason: 'unknown branch'}};
    const tip = v.text;
    if (git(repo, ['merge-base', '--is-ancestor', tip, cur], {ok: [0, 1]}).status === 0) {
      steps.push({branch: name, tip, result: 'already merged', commit: cur});
      continue;
    }
    const m = git(repo, ['merge-tree', '--write-tree', '--name-only', '-z', '--no-messages', cur, tip], {ok: [0, 1]});
    const fields = String(m.out).split('\0').filter(Boolean);
    let tree = fields[0];
    let note = '';
    if (m.status === 1) {
      const conflicts = [...new Set(fields.slice(1))];
      const real = conflicts.filter((p) => !GENERATED.includes(p));
      if (real.length) return {cur, steps, stop: {branch: name, reason: 'conflict', paths: conflicts}};
      tree = resolveGenerated(repo, tree, cur, conflicts, scratchRoot);
      regenerate = true;
      note = ` (generated outputs taken from the queue side: ${conflicts.join(', ')})`;
    }
    const commit = gitText(repo, ['commit-tree', tree, '-p', cur, '-p', tip, '-m', `Merge ${name}`]);
    steps.push({branch: name, tip, result: `merged${note}`, commit});
    cur = commit;
  }
  return {cur, steps, regenerate};
}

function parseCounts(text) {
  const pick = (k) => { const m = text.match(new RegExp(`^# ${k} (\\d+)`, 'm')); return m ? Number(m[1]) : null; };
  const counts = {tests: pick('tests'), pass: pick('pass'), fail: pick('fail'), skipped: pick('skipped')};
  return counts.tests === null ? null : counts;
}

function runChecks(scratch, logDir, checks) {
  const results = [];
  for (const [name, cmd] of checks) {
    const started = Date.now();
    const r = spawnSync(cmd, {cwd: scratch, shell: true, env: childEnv(), encoding: 'utf8', maxBuffer: 1 << 28});
    const out = `${r.stdout || ''}${r.stderr || ''}`;
    const log = join(logDir, `${name.replace(/[^\w.-]/g, '_')}.out`);
    writeFileSync(log, out);
    const res = {name, cmd, status: r.status, ok: r.status === 0, seconds: Math.round((Date.now() - started) / 1000), log};
    const counts = parseCounts(out);
    if (counts) res.counts = counts;
    results.push(res);
    if (!res.ok) break;
  }
  return results;
}

function addScratch(repo, primary, commit, root) {
  const dir = join(root, 'tree');
  git(repo, ['worktree', 'add', '--detach', dir, commit]);
  const nm = join(primary, 'node_modules');
  if (existsSync(nm) && !existsSync(join(dir, 'node_modules'))) symlinkSync(realpathSync(nm), join(dir, 'node_modules'));
  return dir;
}

function removeScratch(repo, root) {
  // The build dirties tracked outputs, so `git worktree remove` would refuse; the scratch is ours.
  rmSync(root, {recursive: true, force: true});
  git(repo, ['worktree', 'prune']);
}

// Fold rebuilt generated outputs into the final merge commit (only after a generated-path conflict).
function foldRebuilt(repo, scratch, commit) {
  const present = GENERATED.filter((p) => existsSync(join(scratch, p)));
  if (!present.length) return commit;
  git(scratch, ['add', '--', ...present]);
  const tree = gitText(scratch, ['write-tree']);
  if (tree === gitText(repo, ['rev-parse', `${commit}^{tree}`])) return commit;
  const parents = gitText(repo, ['rev-list', '--parents', '-n', '1', commit]).split(' ').slice(1);
  const msg = gitText(repo, ['log', '-1', '--format=%B', commit]);
  return gitText(repo, ['commit-tree', tree, ...parents.flatMap((p) => ['-p', p]), '-m', msg]);
}

function hashFile(primary, path) {
  return gitText(primary, ['hash-object', '--', path]);
}

// `dirty` is read before the target moves; afterwards every changed path differs from HEAD in the index.
function syncPrimary(primary, H, next, reviewDir, dirty) {
  const raw = gitText(primary, ['diff', '--name-status', '--no-renames', '-z', H, next]);
  const parts = raw.split('\0').filter(Boolean);
  const changed = [];
  for (let i = 0; i + 1 < parts.length; i += 2) changed.push({status: parts[i], path: parts[i + 1]});
  const report = {checkedOut: [], removed: [], threeWay: [], conflicts: [], skipped: []};
  const clean = [];
  for (const {status, path} of changed) {
    const oldE = treeEntry(primary, H, path);
    const file = join(primary, path);
    const onDisk = existsSync(file) && !lstatSync(file).isDirectory();
    // Re-check right before touching: other sessions are live in the primary.
    const stillClean = !dirty.has(path) && (oldE ? onDisk && hashFile(primary, path) === oldE.oid : !onDisk);
    if (stillClean) { clean.push({status, path}); continue; }
    const newE = treeEntry(primary, next, path);
    if (!onDisk) {
      // Dirty by deletion in the primary: keep the deletion, index follows HEAD.
      report.skipped.push(`${path} (deleted in the primary; left deleted)`);
      continue;
    }
    if ((oldE && oldE.type !== 'blob') || (newE && newE.type !== 'blob')) {
      report.skipped.push(`${path} (not a regular blob; review by hand)`);
      continue;
    }
    const before = hashFile(primary, path);
    const work = readFileSync(file);
    const tmp = mkdtempSync(join(tmpdir(), 'mq-file-'));
    const [w, o, n] = ['work', 'old', 'new'].map((k) => join(tmp, k));
    writeFileSync(w, work);
    writeFileSync(o, blobBytes(primary, oldE?.oid));
    writeFileSync(n, blobBytes(primary, newE?.oid));
    const m = spawnSync('git', ['merge-file', '-p', '-L', 'primary working copy', '-L', 'old master', '-L', 'new master', w, o, n],
      {cwd: primary, env: childEnv(), maxBuffer: 1 << 28});
    rmSync(tmp, {recursive: true, force: true});
    if (m.status < 0 || m.status > 127 || m.status === null) throw new Error(`merge-file failed on ${path}`);
    if (m.status === 0) {
      if (hashFile(primary, path) !== before) { report.skipped.push(`${path} (changed during sync; left as is)`); continue; }
      writeFileSync(file, m.stdout);
      report.threeWay.push(path);
    } else {
      const side = join(reviewDir, path);
      mkdirSync(dirname(side), {recursive: true});
      writeFileSync(side, m.stdout);
      report.conflicts.push({path, markers: m.status, review: side});
    }
  }
  const restore = changed.map((c) => c.path).filter((p) => !clean.some((c) => c.path === p));
  for (const p of restore) {
    const e = treeEntry(primary, 'HEAD', p);
    git(primary, ['update-index', '--index-info'], {input: e ? `${e.mode} ${e.oid}\t${p}\n` : `0 ${ZERO}\t${p}\n`});
  }
  const toCheckout = clean.filter((c) => treeEntry(primary, 'HEAD', c.path)).map((c) => c.path);
  const toRemove = clean.filter((c) => !treeEntry(primary, 'HEAD', c.path)).map((c) => c.path);
  for (let i = 0; i < toCheckout.length; i += 200) git(primary, ['checkout', 'HEAD', '--', ...toCheckout.slice(i, i + 200)]);
  // The index already differs from the moved HEAD, so plain `git rm` refuses: drop the entry, then the
  // file (its content was checked equal to H's blob above).
  for (let i = 0; i < toRemove.length; i += 200) git(primary, ['rm', '--cached', '--quiet', '--ignore-unmatch', '--', ...toRemove.slice(i, i + 200)]);
  for (const p of toRemove) rmSync(join(primary, p), {force: true});
  report.checkedOut = toCheckout;
  report.removed = toRemove;
  report.changed = changed.length;
  return report;
}

function receiptText(r) {
  const L = [];
  L.push(`merge queue ${r.apply ? 'APPLY' : 'dry run'} ${r.stamp}`);
  L.push(`target ${r.target} at H=${r.H}${r.primary ? `; primary ${r.primary}` : ''}`);
  for (const s of r.steps || []) L.push(`  ${s.branch} ${s.tip.slice(0, 10)}: ${s.result}${s.result.startsWith('merged') ? ` -> ${s.commit.slice(0, 10)}` : ''}`);
  if (r.stop) L.push(`STOPPED at ${r.stop.branch}: ${r.stop.reason}${r.stop.paths ? `\n    ${r.stop.paths.join('\n    ')}` : ''}`);
  if (r.result) L.push(`result ${r.result}${r.result === r.H ? ' (no-op: every branch already in the target)' : ''}`);
  if (r.mergedPaths) L.push(`merged paths (${r.mergedPaths.length}):${r.mergedPaths.length ? `\n    ${r.mergedPaths.slice(0, 60).join('\n    ')}${r.mergedPaths.length > 60 ? `\n    ... ${r.mergedPaths.length - 60} more` : ''}` : ' none'}`);
  if (r.checksNote) L.push(`checks: ${r.checksNote}`);
  for (const c of r.checks || []) {
    const counts = c.counts ? ` tests ${c.counts.tests} pass ${c.counts.pass} fail ${c.counts.fail}${c.counts.skipped ? ` skipped ${c.counts.skipped}` : ''}` : '';
    L.push(`  ${c.name}: ${c.ok ? 'pass' : `FAIL (exit ${c.status})`} ${c.seconds}s${counts}  log ${c.log}`);
  }
  if (r.applied) L.push(`moved ${r.target} ${r.H.slice(0, 10)} -> ${r.result.slice(0, 10)}`);
  if (r.refused) L.push(`REFUSED: ${r.refused}`);
  if (r.sync) {
    const s = r.sync;
    L.push(`primary sync: ${s.changed} changed paths; ${s.checkedOut.length} checked out, ${s.removed.length} removed, ${s.threeWay.length} three-way, ${s.conflicts.length} conflicted, ${s.skipped.length} skipped`);
    for (const p of s.threeWay) L.push(`  three-way clean: ${p}`);
    for (const c of s.conflicts) L.push(`  CONFLICT left untouched: ${c.path} (${c.markers} hunks; marked copy ${c.review})`);
    for (const p of s.skipped) L.push(`  skipped: ${p}`);
  }
  if (r.scratch) L.push(`scratch ${r.scratch} ${r.keptScratch ? 'kept' : 'removed'}`);
  L.push(`verdict: ${r.verdict}`);
  return L.join('\n');
}

export function run(argv, {cwd = process.cwd(), checks = DEFAULT_CHECKS} = {}) {
  const o = parseArgs(argv);
  const repo = realpathSync(cwd);
  const primary = findPrimary(repo, o.primary);
  const stamp = stampNow();
  const common = realpathSync(resolve(repo, gitText(repo, ['rev-parse', '--git-common-dir'])));
  const outDir = join(common, 'merge-queue', stamp);
  mkdirSync(outDir, {recursive: true});
  const r = {stamp, apply: o.apply, target: o.target, primary, verdict: 'fail'};
  const finish = () => {
    const text = receiptText(r);
    writeFileSync(join(outDir, 'receipt.txt'), `${text}\n`);
    writeFileSync(join(outDir, 'receipt.json'), `${JSON.stringify(r, null, 2)}\n`);
    return {receipt: r, text, ok: r.verdict.startsWith('pass')};
  };

  const ref = `refs/heads/${o.target}`;
  r.H = gitText(repo, ['rev-parse', '--verify', ref]);
  const staged = stagedPaths(primary);
  if (staged.length) {
    r.refused = `primary index has ${staged.length} staged entries (${staged.slice(0, 5).join(', ')}${staged.length > 5 ? ', ...' : ''}); another session is mid-commit`;
    return finish();
  }

  const scratchRoot = mkdtempSync(join(tmpdir(), 'yairpg-merge-queue-'));
  try {
    const m = mergeBranches(repo, r.H, o.branches, scratchRoot);
    r.steps = m.steps;
    if (m.stop) { r.stop = m.stop; return finish(); }
    let result = m.cur;
    r.mergedPaths = gitText(repo, ['diff', '--name-only', '-z', r.H, result]).split('\0').filter(Boolean);
    if (result === r.H) {
      r.result = result;
      r.checksNote = 'skipped (nothing to merge)';
      r.verdict = 'pass (no-op)';
      return finish();
    }
    if (!o.checks) {
      r.result = result;
      r.checksNote = 'skipped (--no-checks)';
      r.verdict = 'pass (merges only, unchecked)';
      return finish();
    }
    const scratch = addScratch(repo, primary, result, scratchRoot);
    r.scratch = scratch;
    r.checks = runChecks(scratch, outDir, checks);
    if (m.regenerate && r.checks[0]?.ok) {
      const folded = foldRebuilt(repo, scratch, result);
      if (folded !== result) { r.checksNote = 'rebuilt generated outputs folded into the last merge commit'; result = folded; }
    }
    r.result = result;
    r.mergedPaths = gitText(repo, ['diff', '--name-only', '-z', r.H, result]).split('\0').filter(Boolean);
    if (!r.checks.every((c) => c.ok) || r.checks.length < checks.length) return finish();
    if (!o.apply) { r.verdict = 'pass (dry run; rerun with --apply to move the target)'; return finish(); }

    const head = git(primary, ['symbolic-ref', '-q', 'HEAD'], {ok: [0, 1]}).text;
    if (head !== ref) { r.refused = `primary HEAD is ${head || 'detached'}, not ${ref}; cannot sync it`; return finish(); }
    const stagedNow = stagedPaths(primary);
    if (stagedNow.length) { r.refused = `primary index gained ${stagedNow.length} staged entries during the checks`; return finish(); }
    const dirty = dirtyPaths(primary);
    const u = git(repo, ['update-ref', '-m', 'merge-queue', ref, result, r.H], {ok: [0, 1, 128]});
    if (u.status !== 0) {
      const now = git(repo, ['rev-parse', '--verify', ref]).text;
      r.refused = `${o.target} moved underneath (now ${now.slice(0, 10)}, expected ${r.H.slice(0, 10)}); nothing moved, rerun the queue`;
      return finish();
    }
    r.applied = true;
    r.sync = syncPrimary(primary, r.H, result, join(outDir, 'review'), dirty);
    r.verdict = r.sync.conflicts.length || r.sync.skipped.length ? 'pass, primary sync needs review' : 'pass, applied';
    return finish();
  } finally {
    if (o.keepScratch && r.scratch) r.keptScratch = true;
    else removeScratch(repo, scratchRoot);
  }
}

const isMain = process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));
if (isMain) {
  let o;
  try { o = parseArgs(process.argv.slice(2)); } catch (e) { console.error(`merge_queue: ${e.message}`); process.exit(2); }
  if (o.help) {
    console.log(readFileSync(new URL(import.meta.url), 'utf8').split('\n').filter((l) => l.startsWith('//')).map((l) => l.slice(3)).join('\n'));
    process.exit(0);
  }
  const out = run(process.argv.slice(2));
  console.log(out.text);
  process.exit(out.ok ? 0 : 1);
}
