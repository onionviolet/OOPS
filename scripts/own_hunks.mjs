#!/usr/bin/env node
// Commits only the hunks you added to files other sessions may also be editing (workflow smoothing item T7).
//   node scripts/own_hunks.mjs snapshot <path>...        before you edit: records each file's current content
//   node scripts/own_hunks.mjs commit -m "<message>" <path>...   stages (working - snapshot) onto HEAD's version, then commits
// A pathspec commit takes the whole file, including other sessions' unfinished edits. This takes only the lines you changed
// since the snapshot. It stops if your hunks do not apply cleanly to HEAD's version (someone else edited the same lines).
import {execFileSync, spawnSync} from 'node:child_process';
import {mkdirSync, writeFileSync, readFileSync, existsSync, mkdtempSync, rmSync} from 'node:fs';
import {join, resolve} from 'node:path';
import {tmpdir} from 'node:os';

const root = process.env.OWN_HUNKS_ROOT ? resolve(process.env.OWN_HUNKS_ROOT) : execFileSync('git', ['rev-parse', '--show-toplevel'], {encoding: 'utf8'}).trim();
const git = (...a) => execFileSync('git', ['-C', root, ...a], {encoding: 'utf8'});
const gitDir = resolve(root, git('rev-parse', '--git-dir').trim());
const store = join(gitDir, 'own-hunks'); mkdirSync(store, {recursive: true});
const key = p => p.replace(/[^A-Za-z0-9._-]/g, '_');
const [cmd, ...rest] = process.argv.slice(2);

if (cmd === 'snapshot') {
  for (const p of rest) { const sha = git('hash-object', '-w', '--', p).trim(); writeFileSync(join(store, key(p)), sha); console.log(`snapshot ${p} ${sha.slice(0, 10)}`); }
} else if (cmd === 'commit') {
  const mi = rest.indexOf('-m'); const message = rest[mi + 1]; const paths = rest.filter((a, i) => i !== mi && i !== mi + 1);
  if (mi < 0 || !message || !paths.length) { console.error('usage: commit -m "<message>" <path>...'); process.exit(2); }
  const tmp = mkdtempSync(join(tmpdir(), 'ownhunks-'));
  try {
    for (const p of paths) {
      const snapFile = join(store, key(p));
      if (!existsSync(snapFile)) { console.error(`no snapshot for ${p}; run snapshot before editing`); process.exit(1); }
      const before = join(tmp, 'before'), after = join(tmp, 'after');
      writeFileSync(before, git('cat-file', 'blob', readFileSync(snapFile, 'utf8').trim()));
      writeFileSync(after, readFileSync(resolve(root, p)));
      const d = spawnSync('diff', ['-u', '--label', `a/${p}`, '--label', `b/${p}`, before, after], {encoding: 'utf8'});
      if (d.status === 0) { console.log(`no change in ${p}`); continue; }
      const patch = join(tmp, 'p.patch'); writeFileSync(patch, d.stdout);
      const ap = spawnSync('git', ['-C', root, 'apply', '--cached', '--recount', patch], {encoding: 'utf8'});
      if (ap.status !== 0) { console.error(`your hunks do not apply to HEAD's ${p} (another session edited the same lines):\n${ap.stderr}`); process.exit(1); }
    }
    console.log(git('diff', '--cached', '--stat'));
    git('commit', '-q', '-m', message);
    for (const p of paths) rmSync(join(store, key(p)), {force: true});
    console.log(git('log', '--oneline', '-1').trim());
  } finally { rmSync(tmp, {recursive: true, force: true}); }
} else { console.error('usage: snapshot <path>... | commit -m <message> <path>...'); process.exit(2); }
