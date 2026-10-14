# Sessions

Launched 2026-10-14 by `chain.py` (setsid detached, Codex default model, high effort). T3 starts automatically when T2 exits **and** T2's CHECKPOINT starts with `DONE`; otherwise `chain.log` records why T3 did not start. Logs `~/.codex/research/chain-build-2026-10-14/<lane>.log`, final message `<lane>.last.md`, runner log `chain.log`. Resume: `python3 chain.py --resume <lane> <session id> ["message"]`; run T3 alone: `python3 chain.py T3`. Liveness: match `# T2:` or `# T3:` in `ps` command lines.

| Lane | Session id | Worktree / branch | Base | Port |
|---|---|---|---|---|
| T2 | 01a13c01-7ca2-7840-90f7-01c31ddf235f | `.claude/worktrees/cb-t2-inspector` / `proc/cb-t2-inspector` | `codex/gameplay-foundations` at `4f853c24` | 22450 |
| T3 | pending (starts after T2 DONE) | `.claude/worktrees/cb-t3-rules` / `proc/cb-t3-rules` | `proc/cb-t2-inspector` | 22460 |
