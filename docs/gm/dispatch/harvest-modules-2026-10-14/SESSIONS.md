# Sessions

Launched 2026-10-14 via `launch.py` (setsid detached, default model). Logs `~/.codex/research/harvest-modules-2026-10-14/<lane>.log`, final message `<lane>.last.md`. Resume: `python3 launch.py --resume <lane> <session id> ["message"]`. Liveness: match `# HV<n>:` in `ps` command lines.

| Lane | Session id | Where | Effort |
|---|---|---|---|
| HV1 | 01a13bbb-7970-7eb1-9037-160c6a32945d | `.claude/worktrees/hv1-carcass` / `proc/hv1-carcass`, port 22430 | high |
| HV2 | 01a13bbb-8146-7650-a6ed-41cc477e691a | main checkout, `hv2/` only | medium |
