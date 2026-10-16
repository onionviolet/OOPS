#!/usr/bin/env python3
"""Detached Codex launcher (setsid double fork). Usage: launch.py <name> <prompt_file> [effort] [resume_id]"""
import os, sys, time
CODEX = "/Applications/ChatGPT.app/Contents/Resources/codex-cli/CodexCLI.app/Contents/MacOS/codex"
REPO = "/Users/weiwei/code/yet-another-idle-rpg"
RUNS = os.path.dirname(os.path.abspath(__file__))
name, prompt_file = sys.argv[1], sys.argv[2]
effort = sys.argv[3] if len(sys.argv) > 3 else "medium"
resume = sys.argv[4] if len(sys.argv) > 4 else None
prompt = open(prompt_file).read()
log = os.path.join(RUNS, f"{name}.log")
if os.fork() > 0: sys.exit(0)
os.setsid()
if os.fork() > 0: os._exit(0)
os.chdir(REPO)
fd = os.open(log, os.O_WRONLY | os.O_CREAT | os.O_APPEND, 0o644)
os.dup2(fd, 1); os.dup2(fd, 2)
os.dup2(os.open(os.devnull, os.O_RDONLY), 0)
print(f"== {time.strftime('%Y-%m-%d %H:%M:%S')} launch {name} effort={effort} pid={os.getpid()} pgid={os.getpgid(0)}", flush=True)
args = [CODEX, "-c", 'forced_login_method="chatgpt"', "-c", f'model_reasoning_effort="{effort}"', "exec"] + (["resume", resume] if resume else []) + ["--skip-git-repo-check", "-o", os.path.join(RUNS, f"{name}.last.md"), prompt]
os.execv(CODEX, args)
