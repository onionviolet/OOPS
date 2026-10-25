# Lane tools

Standard-library Python helpers for detached Codex lanes and read-only branch checks.

```sh
python3 scripts/lanes/lanes.py launch L1 prompts/l1.md "$PWD" --runs docs/gm/dispatch/example/runs --model gpt-6-luna --effort low
python3 scripts/lanes/lanes.py status --runs docs/gm/dispatch/example/runs
python3 scripts/lanes/lanes.py merge-report --repo . --base master
```

`launch` resolves Codex from `--binary`, `CODEX_BIN`, then `PATH`; it writes a JSON PID receipt, append-only log, and Codex last-message path. A launch refuses to reuse a name whose recorded process is alive. Use `--approve-for-me` only when the host run is authorized for it. `status` reports process liveness and artifact sizes; an exited process with a last message is not automatically a successful lane.

`merge-report` is read-only. It reports current base ancestry, merge-tree conflicts, dirty files and changed paths. It does not merge, rebase, commit or push, and readiness does not replace owner review or project gates.
