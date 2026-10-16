#!/usr/bin/env python3
"""Detached Codex launcher (setsid double fork), run inside the lane worktree.
Usage: launch.py <name> <prompt_file> [resume_session_id]"""
import os, sys, time
CODEX = "/Applications/ChatGPT.app/Contents/Resources/codex-cli/CodexCLI.app/Contents/MacOS/codex"
WORKTREE = "/Users/weiwei/.codex/worktrees/modular-seams/yet-another-idle-rpg"
RUNS = os.path.dirname(os.path.abspath(__file__))
name, prompt_file = sys.argv[1], sys.argv[2]
resume = sys.argv[3] if len(sys.argv) > 3 else None
prompt = open(prompt_file).read()
log = os.path.join(RUNS, f"{name}.log")
if os.fork() > 0: sys.exit(0)
os.setsid()
if os.fork() > 0: os._exit(0)
os.chdir(WORKTREE)
fd = os.open(log, os.O_WRONLY | os.O_CREAT | os.O_APPEND, 0o644)
os.dup2(fd, 1); os.dup2(fd, 2)
os.dup2(os.open(os.devnull, os.O_RDONLY), 0)
with open(os.path.join(RUNS, f"{name}.pid"), "w") as f: f.write(f"{os.getpid()} {os.getpgid(0)}\n")
print(f"== {time.strftime('%Y-%m-%d %H:%M:%S')} launch {name} pid={os.getpid()} pgid={os.getpgid(0)}", flush=True)
args = [CODEX, "exec"] + (["resume", resume] if resume else []) + ["--skip-git-repo-check", "-o", os.path.join(RUNS, f"{name}.last.md"), prompt]
os.execv(CODEX, args)
