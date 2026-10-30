# C5 prep receipt, 2026-10-30

Files: `prepare.mjs`, `fold.mjs`, `fold.md`, `manifest.json`, `luna_1.md` through `luna_19.md`, and this receipt, all in this owned folder. Private TSVs, row bindings, adapter, manifest and dry-run evidence are under `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/wb-families-texture/`. No source/script/runtime changes outside these two owned areas. No commits, model workers or classification outputs.

Input identity: `extras.jsonl` SHA-256 `bc07779fbea9f79c0a044746351544ae0a643a007dcaf1014a8ea01848caeeae`; input path and per-brief SHA-256 values in [manifest.json](manifest.json).

| Command/check | Result | Gaps |
|---|---|---|
| `node docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c5/prepare.mjs` | Exit 0; existing family prep generated 19 TSVs, 51,194 row ids: 28,987 texture + 22,207 rules other; 0 news | Source snapshot has no volume-one texture/rules_other; see fold.md |
| `node --check docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c5/prepare.mjs` | Exit 0 | Syntax only |
| `node --check docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c5/fold.mjs` | Exit 0 | Syntax only |
| `node docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c5/fold.mjs --dry-run` | Exit 0; 51,194 source-bound ids assigned exactly once, 19 brief/output owners, summaries preserved, source and TSV hashes match, existing tally exits 0 | No reader answers; semantic classification false; `dry-run/tally.json` is intentionally empty |
| `git check-ignore docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/wb-families-texture/manifest.json` | Exit 0; private artifacts ignored | Private files are local, not portable through a tracked commit |
| Python local Markdown-link, whitespace, brief-count and placeholder-output assertions | Exit 0; 19 briefs, links resolve, no trailing whitespace, no top-level reader outputs | Does not review labels |
| `git diff --check -- docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c5` | Exit 0 | New files are untracked; Python separately checked their whitespace |

Prep acceptance: every selected texture and rules_other row has exactly one Luna brief; existing tally dry run passes. Classification/fold with real answers and 15-row-per-family semantic review are pending coordinator launch. Full runtime tests/build/browser are not applicable to this prep-only lane. Volume-one expansion needs the merge owner's canonical input selection, not a silent blend with an older snapshot. See [fold.md](fold.md) for the finite launch/repair plan and acceptance gates.
