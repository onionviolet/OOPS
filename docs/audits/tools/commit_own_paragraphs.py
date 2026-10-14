#!/usr/bin/env python3
"""Commit only this task's files and paragraphs while other sessions edit the
same shared docs.

Usage:
  commit_own_paragraphs.py --msg-file MSG --files a.md b.md ... \
      --para docs/USER_VISION.md "unique marker 1" "unique marker 2" ... \
      --para docs/IDEA_INDEX.md "unique marker" --after "## How ideas are kept"

--files    whole files to commit as they are on disk.
--para     a shared file, then markers; each marker must match exactly one
           blank-line-separated paragraph on disk (whitespace-insensitive).
           A paragraph whose first line matches a HEAD paragraph replaces it;
           other paragraphs not already in HEAD are appended at the end, or after
           the --after heading line if given right after that --para group.
Builds the commit in a temporary index, moves the branch only if HEAD did not
move meanwhile, then resets those paths in the real index so other sessions'
staged work is untouched.
"""
import subprocess, re, os, sys, tempfile

def run(*a, env=None, inp=None):
    r = subprocess.run(a, capture_output=True, text=True, env=env, input=inp)
    if r.returncode:
        sys.exit(f"FAIL {' '.join(a)}: {r.stderr}")
    return r.stdout.strip()

norm = lambda t: ' '.join(t.split())
args = sys.argv[1:]
msg = None; files = []; paras = []  # paras: [path, [markers], after]
i = 0
while i < len(args):
    a = args[i]
    if a == '--msg-file': msg = open(args[i + 1]).read(); i += 2
    elif a == '--files':
        i += 1
        while i < len(args) and not args[i].startswith('--'): files.append(args[i]); i += 1
    elif a == '--para':
        cur = [args[i + 1], [], None]; i += 2
        while i < len(args) and not args[i].startswith('--'): cur[1].append(args[i]); i += 1
        if i < len(args) and args[i] == '--after': cur[2] = args[i + 1]; i += 2
        paras.append(cur)
    else: sys.exit(f"unknown arg {a}")
if not msg: sys.exit("--msg-file required")
for f in files:
    if not os.path.isfile(f): sys.exit(f"missing {f}")
old = run('git', 'rev-parse', 'HEAD')
branch = run('git', 'symbolic-ref', '--short', 'HEAD')
env = dict(os.environ, GIT_INDEX_FILE=tempfile.mktemp(prefix='idx-'))
run('git', 'read-tree', old, env=env)
if files: run('git', 'add', '-f', '--', *files, env=env)
for path, markers, after in paras:
    disk = re.split(r'\n\s*\n', open(path).read())
    head = run('git', 'show', f'{old}:{path}') + '\n'
    mine = []
    for m in markers:
        hits = [p for p in disk if norm(m) in norm(p)]
        if len(hits) != 1: sys.exit(f"{path}: marker {m!r} matched {len(hits)} paragraphs")
        if hits[0].strip() not in head: mine.append(hits[0].strip('\n'))
    if not mine: continue
    # A paragraph whose first line already starts a HEAD paragraph is an
    # update of that paragraph: replace it in place instead of inserting.
    rest = []
    for m in mine:
        first = m.split('\n', 1)[0]
        hp = [p for p in re.split(r'\n\s*\n', head) if p.strip('\n').split('\n', 1)[0] == first]
        if len(hp) == 1: head = head.replace(hp[0].strip('\n'), m, 1)
        else: rest.append(m)
    mine = rest
    if not mine:
        blob = run('git', 'hash-object', '-w', '--stdin', inp=head)
        run('git', 'update-index', '--cacheinfo', f'100644,{blob},{path}', env=env)
        continue
    block = '\n\n'.join(mine)
    if after:
        if after not in head: sys.exit(f"{path}: heading {after!r} not in HEAD")
        idx = head.index(after) + len(after)
        idx = head.index('\n', idx) + 1
        new = head[:idx] + '\n' + block + '\n' + head[idx:]
    else:
        new = head.rstrip('\n') + '\n\n' + block + '\n'
    blob = run('git', 'hash-object', '-w', '--stdin', inp=new)
    run('git', 'update-index', '--cacheinfo', f'100644,{blob},{path}', env=env)
print(run('git', 'diff', '--cached', '--stat', old, env=env))
tree = run('git', 'write-tree', env=env)
new = run('git', 'commit-tree', tree, '-p', old, '-m', msg)
run('git', 'update-ref', f'refs/heads/{branch}', new, old)
run('git', 'reset', '-q', new, '--', *files, *[p[0] for p in paras])
os.remove(env['GIT_INDEX_FILE'])
print('committed', new)
