"""Launch one detached `codex exec` reader that survives the calling shell.

Usage: python3 -I launch_codex_reader.py WORKDIR PROMPT_FILE
WORKDIR becomes the reader's writable root; run.log, LAST_MESSAGE.md and the
session id (first 'session id:' line in run.log) land there. Detached with a
setsid double fork, because plain nohup runs died with Claude's shell.
Resume a stalled run with: codex exec resume <session id> "<prompt>".
"""
import os
import sys

wd, prompt = os.path.abspath(sys.argv[1]), os.path.abspath(sys.argv[2])
os.makedirs(wd, exist_ok=True)
if os.fork() > 0:
    print("launched", wd)
    sys.exit(0)
os.setsid()
if os.fork() > 0:
    os._exit(0)
log = open(os.path.join(wd, "run.log"), "ab")
fin = open(prompt, "rb")
os.dup2(fin.fileno(), 0)
os.dup2(log.fileno(), 1)
os.dup2(log.fileno(), 2)
os.chdir(wd)
os.execvp("codex", ["codex", "exec", "-C", wd, "-s", "workspace-write", "--skip-git-repo-check",
                    "-o", os.path.join(wd, "LAST_MESSAGE.md"), "-"])
