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
           Paragraphs not already in HEAD are APPENDED at the end, or after
           the --after heading line if given right after that --para group.
           Shared docs reuse headings and table headers, so a matching first
           line never replaces anything by itself. To update a HEAD paragraph,
           put `--replace` before its markers: `--para F m1 --replace m2 m3`.
           A replace marker needs exactly one HEAD paragraph with the same first
           line (none: it is appended; several: refuse, pick a longer first line
           or append). Markers before `--replace` always append.
Each file prints a summary of added and removed lines. The commit is refused
when removed lines exceed the lines of the HEAD paragraphs being replaced.
Builds the commit in a temporary index, moves the branch only if HEAD did not
move meanwhile, then resets those paths in the real index so other sessions'
staged work is untouched.
"""
import subprocess, re, os, sys, tempfile, difflib, atexit

def run(*a, env=None, inp=None):
    r = subprocess.run(a, capture_output=True, text=True, env=env, input=inp)
    if r.returncode:
        sys.exit(f"FAIL {' '.join(a)}: {r.stderr}")
    return r.stdout.strip()

norm = lambda t: ' '.join(t.split())
args = sys.argv[1:]
msg = None; files = []; paras = []  # paras: [path, [(marker, replace)], after]
i = 0
while i < len(args):
    a = args[i]
    if a == '--msg-file': msg = open(args[i + 1]).read(); i += 2
    elif a == '--files':
        i += 1
        while i < len(args) and not args[i].startswith('--'): files.append(args[i]); i += 1
    elif a == '--para':
        cur = [args[i + 1], [], None]; i += 2; rep = False
        while i < len(args) and (not args[i].startswith('--') or args[i] == '--replace'):
            if args[i] == '--replace': rep = True
            else: cur[1].append((args[i], rep))
            i += 1
        if i < len(args) and args[i] == '--after': cur[2] = args[i + 1]; i += 2
        paras.append(cur)
    else: sys.exit(f"unknown arg {a}")
if not msg: sys.exit("--msg-file required")
for f in files:
    if not os.path.isfile(f): sys.exit(f"missing {f}")
old = run('git', 'rev-parse', 'HEAD')
branch = run('git', 'symbolic-ref', '--short', 'HEAD')
env = dict(os.environ, GIT_INDEX_FILE=tempfile.mktemp(prefix='idx-'))
atexit.register(lambda: os.path.exists(env['GIT_INDEX_FILE']) and os.remove(env['GIT_INDEX_FILE']))
run('git', 'read-tree', old, env=env)
if files: run('git', 'add', '-f', '--', *files, env=env)
split = lambda t: re.split(r'\n\s*\n', t)
first_line = lambda p: p.strip('\n').split('\n', 1)[0]
for path, markers, after in paras:
    disk = split(open(path).read())
    head = run('git', 'show', f'{old}:{path}') + '\n'
    orig = head
    mine = []  # (paragraph, replace?)
    for m, rep in markers:
        hits = [p for p in disk if norm(m) in norm(p)]
        if len(hits) != 1: sys.exit(f"{path}: marker {m!r} matched {len(hits)} paragraphs")
        if hits[0].strip() not in head: mine.append((hits[0].strip('\n'), rep))
    if not mine: continue
    allowed = 0  # HEAD lines that replacements are entitled to remove
    appended = []
    for m, rep in mine:
        if not rep: appended.append(m); continue
        fl = first_line(m)
        hp = [p.strip('\n') for p in split(head) if first_line(p) == fl]
        if len(hp) > 1:
            sys.exit(f"{path}: --replace first line {fl!r} matches {len(hp)} HEAD paragraphs; "
                     "refusing to guess. Use a marker whose first line is unique, or append.")
        if not hp: appended.append(m); continue
        if head.count(hp[0]) != 1: sys.exit(f"{path}: HEAD paragraph for {fl!r} is not unique text")
        head = head.replace(hp[0], m, 1)
        allowed += hp[0].count('\n') + 1
    block = '\n\n'.join(appended)
    if not block: new = head
    elif after:
        if after not in head: sys.exit(f"{path}: heading {after!r} not in HEAD")
        idx = head.index(after) + len(after)
        idx = head.index('\n', idx) + 1
        new = head[:idx] + '\n' + block + '\n' + head[idx:]
    else:
        new = head.rstrip('\n') + '\n\n' + block + '\n'
    ol, nl = orig.split('\n'), new.split('\n')
    added = removed = 0
    for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, ol, nl, autojunk=False).get_opcodes():
        if tag in ('delete', 'replace'): removed += i2 - i1
        if tag in ('insert', 'replace'): added += j2 - j1
    print(f"{path}: +{added} -{removed} lines ({len(appended)} appended, {len(mine) - len(appended)} replaced, "
          f"{allowed} HEAD lines replaceable)")
    if removed > allowed:
        sys.exit(f"{path}: REFUSED, {removed} lines removed but replacements account for {allowed}")
    blob = run('git', 'hash-object', '-w', '--stdin', inp=new)
    run('git', 'update-index', '--cacheinfo', f'100644,{blob},{path}', env=env)
print(run('git', 'diff', '--cached', '--stat', old, env=env))
tree = run('git', 'write-tree', env=env)
new = run('git', 'commit-tree', tree, '-p', old, '-m', msg)
run('git', 'update-ref', f'refs/heads/{branch}', new, old)
run('git', 'reset', '-q', new, '--', *files, *[p[0] for p in paras])
print('committed', new)
