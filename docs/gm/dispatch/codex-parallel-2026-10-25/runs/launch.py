#!/usr/bin/env python3
"""Detached Codex launcher (setsid double fork).
Usage: launch.py <name> <prompt_file> <workdir> <model> <effort> [resume_session_id]"""
import os, sys, time
CODEX = "/Applications/ChatGPT.app/Contents/Resources/codex-cli/CodexCLI.app/Contents/MacOS/codex"
RUNS = os.path.dirname(os.path.abspath(__file__))
name, prompt_file, workdir, model, effort = sys.argv[1:6]
resume = sys.argv[6] if len(sys.argv) > 6 else None
prompt = open(prompt_file).read()
log = os.path.join(RUNS, f"{name}.log")
if os.fork() > 0: sys.exit(0)
os.setsid()
if os.fork() > 0: os._exit(0)
os.chdir(workdir)
fd = os.open(log, os.O_WRONLY | os.O_CREAT | os.O_APPEND, 0o644)
os.dup2(fd, 1); os.dup2(fd, 2)
os.dup2(os.open(os.devnull, os.O_RDONLY), 0)
with open(os.path.join(RUNS, f"{name}.pid"), "w") as f: f.write(f"{os.getpid()} {os.getpgid(0)}\n")
print(f"== {time.strftime('%Y-%m-%d %H:%M:%S')} launch {name} pid={os.getpid()} pgid={os.getpgid(0)} model={model}/{effort} cwd={workdir}", flush=True)
args = [CODEX, "exec"] + [
    "--skip-git-repo-check", "-m", model, "-c", f'model_reasoning_effort="{effort}"',
    "--approve-for-me",
    "--add-dir", "/Users/weiwei/code/yet-another-idle-rpg/.git", "--add-dir", "/Users/weiwei/code/yet-another-idle-rpg",
] + sum([["--add-dir", d] for d in os.environ.get("EXTRA_ADD_DIRS","").split(":") if d], []) + [
    "-o", os.path.join(RUNS, f"{name}.last.md")
] + (["resume", resume] if resume else []) + [prompt]
os.execv(CODEX, args)
