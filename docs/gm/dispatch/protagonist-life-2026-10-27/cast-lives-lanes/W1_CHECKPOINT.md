# W1 checkpoint: repeatable cast-lives lane workflow

State: implementation and focused checks recorded below. Route kind: local workflow tools; no gameplay route. Review: agent-verified, not human-reviewed.

| Check | Command | Result | Gaps |
| --- | --- | --- | --- |
| Focused lane runner tests | `node --test tests/codex_lane.test.js` | Pass, 4/4 | No Codex process launched by tests |
| Focused reviewer tests | `node --test tests/lane_review.test.js` | Pass, 3/3 | Synthetic fixtures only |
| Script syntax | `node --check scripts/codex_lane.mjs && node --check scripts/lane_review.mjs` | Pass | None |
| Live Codex preflight | `node scripts/codex_lane.mjs preflight` | Blocked: app-server exits before reply with `Operation not permitted` while creating PATH aliases in this sandbox | Needs a run in the supported Codex host environment |
| Current cast review | `node scripts/lane_review.mjs --grant scripts/codex_lane.mjs --grant scripts/lane_review.mjs --grant tests/codex_lane.test.js --grant tests/lane_review.test.js --grant docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/LANE_BRIEF_TEMPLATE.md --grant docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/W1_CHECKPOINT.md scripts/codex_lane.mjs scripts/lane_review.mjs tests/codex_lane.test.js tests/lane_review.test.js` | Pass: 2 candidate `src/`/`tests/` paths, 0 name hits, 0 top-level awaits, 0 outside grant | No gameplay/browser/persistence change |

The lane runner records detached process and session metadata under `~/.codex/lanes/protagonist-life-2026-10-27/<lane-id>/`; it strips API keys and passes `-s workspace-write` to both launch and resume. Session IDs are read from JSONL thread events. `lane_review.mjs` prints counts only for private-name hits. The live preflight could not verify account or usage in this sandbox.

## Coordinator review (2026-10-28, evening)

| Check | Result | Gaps |
| --- | --- | --- |
| `node --test tests/codex_lane.test.js tests/lane_review.test.js` | PASS 7/7 | Synthetic |
| `node scripts/codex_lane.mjs preflight`, outside the sandbox | PASS: account chatgpt, ordinary usage allowed, 1 window under 100% | Closes the lane's blocked preflight |
| `codex exec resume --help` | Resume has no `-s` flag. Coordinator fix: resume passes `-c sandbox_mode="workspace-write"` (the `exec` launch keeps `-s`). Argument parse checked | Not yet exercised on a live resume |

Known limits, recorded rather than fixed (proposals for a later W lane):

- W1-K1. `lane_review.mjs` scans only `src/` and `tests/`; scripts and docs that become public are not swept. The coordinator sweeps them by hand.
- W1-K2. The name sweep matches whole `name` fields of 3+ characters from the cast packs; surnames and place labels pass. The coordinator also sweeps capitalized tokens from pack names and labels.
- W1-K3. Without explicit paths it falls back to `git diff --name-only`, which misses untracked files; always pass the lane's paths.
- W1-K4. `src/main.js` always reports one name hit and one top-level await; both predate the cast lanes (boot awaits at HEAD). Read them as baseline.
- W1-K5. `launch` keeps the parent node process alive as the log writer until the lane exits; run it in the background.
