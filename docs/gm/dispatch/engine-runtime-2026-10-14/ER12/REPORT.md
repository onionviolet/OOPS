# ER12 report, 2026-10-14

## CHECKPOINT

COMPLETE: current-code kernel proposal and this report written. READ audit plus one MEASURED focused baseline; no implementation. Resume from the design's K/C/X/S rows and current live owners, checking source and sibling report drift before planning any extraction. Lane writes were limited to the two assigned documents.

## Files written

| Code | File | Result |
| --- | --- | --- |
| ER12-O1 | [Own-engine kernel design](../../../../research/OWN_ENGINE_KERNEL_DESIGN_2026-10-14.md) | OE1-OE10 and SB1-SB10 mapped to existing code with READ file:line, missing seams, proposed function signatures and first-moving modules. Includes command/publication contract, filled pacing and Tidemark manifests, exact cycle cuts, eight-step strangler order with tests/save compatibility, stop rules and ranked build/adopt choices. |
| ER12-O2 | `ER12/REPORT.md` | This receipt, actual commands, evidence limits and open gates. |

## Findings for root reconciliation

| Code | Evidence / result | Root codes |
| --- | --- | --- |
| ER12-F1 | READ + INFERRED: existing scheduler and write-before-publication seam are the best kernel seed. Do not build a second state/clock owner. Individual command plans are not a whole-game transaction guarantee. | OE1, OE2, OE5, OE10, RT2, E3 |
| ER12-F2 | READ + INFERRED: manifests need injected providers at composition. Keeping the core's world validators, fact/effect/admission imports or aggregate content imports leaves the large ER2 cycles intact. Native imports of main need live getter/action ports, not captured values. | OE3, OE8, RT10, CH2 |
| ER12-F3 | READ: expansion and event checks retain seeded streams, while native combat still calls Math.random. Ink pins retained artifacts/cursors and leaves consequential rewards/time/randomness with its host. Extraction must retain field meaning and draw order. | OE1, OE4, OE5, RT9, SB3 |
| ER12-F4 | READ discrepancy: root SB1's third-use wording is stricter than ENGINE_EXPANSION.md:626-628, which permits two actual features or a single safety boundary. Design follows the live owner for local extraction and uses three exercised consumers only as a bar for broad reuse. No root file edited. | SB1, OE10 |
| ER12-F5 | INFERRED: keep game-specific causal/identity/disclosure contracts custom; retain/adopt peripheral renderer, shell, Ink, validation/reactivity/query tools where needed. ER5 and newly landed ER6 are linked with their evidence intact. | OE2, OE4, OE6, EG1, EG5, EG7, LB1/LB4/LB5 |

## Commands run and validation

Read COMMON, AGENTS.md, PROJECT.md, user preferences, relevant USER_VISION standing priorities, root OE/SB palette, E1-E10 save/scale review, offline clock audit and ENGINE_EXPANSION stopping rule. Read ER1 hotspots, ER2 structure/report and ER3 stack; read ER5 engine comparison and ER6 library comparison/report when they landed. Source inspection used `rg`, `rg --files`, `nl -ba`, `sed`, `cat` and `head` on the named owners. Source facts come from this live dirty checkout; ER2 SCC sizes are explicitly attributed to ER2's snapshot.

Representative executed discovery commands:

```sh
git status --short
rg -n 'engine-runtime|kernel|ER12' /Users/weiwei/.codex/memories/MEMORY.md
rg --files src tests
rg --files docs/gm/dispatch/engine-runtime-2026-10-14 docs/research
rg -n 'Math.random|rng|seed' src/rules.js src/world_instances.js src/models/combat.js
rg -n 'definePanel' src --glob '!SECRETS*'
```

The memory search returned no relevant entries; no prior-memory facts were used. Initial guessed `src/random.js`, `src/rng.js`, `src/ink_runtime.js` paths did not exist; discovery found RNG in expansion_engine/simulation and narrative in ink_narrative. One zsh panel wildcard did not match; `rg --files`/`rg` found panel_kit and the existing pacing panel. No missing source file was created. Large combined reads produced truncated output; targeted reads recovered the lines used in the design.

MEASURED focused baseline command:

```sh
node --test tests/expansion_engine.test.js tests/save_files.test.js tests/save_compatibility.test.js tests/absorb_e1.test.js tests/ink_lin_parity.test.js > /tmp/er12-kernel-baseline.tap 2>&1
```

Exit 0, 43 tests, 43 passed, zero failed/cancelled/skipped; Node runner duration 2304.847625 ms. This proves the selected current-source slice only. No runtime performance benchmark, full-suite rerun, extraction test or rebuilt/native acceptance ran. The tests use existing synthetic fixtures, not Weibao's saves.

Document validation: Python checked both outputs for required OE1-OE10/SB1-SB10 coverage, local Markdown link targets, cited source paths/line bounds, manifest JSON parsing and no banned dash forms/trailing whitespace. `git diff --check` checked scoped paths; explicit text checks covered these new untracked files. Validation passed: two documents, 13 local links, 77 cited source references within file bounds, two parseable JSON manifests and complete OE/SB coverage. Changes are documentation only. Existing source/dist/index/PROJECT/other dirty and staged state was left with its owners. No SECRETS-named file, private pack or personal save opened; no installs, commits or pushes.

## Open questions and acceptance

| Code | Remaining gate |
| --- | --- |
| ER12-Q1 | Which bounded extraction to authorize first? R1 primitive/publication facade is the highest-value proposal; no runtime extraction is authorized by this report. |
| ER12-Q2 | Residual SCCs after actual provider/primitive cuts, and whether the first two real consumers expose a mismatch. No claimed graph reduction yet. |
| ER12-Q3 | Exact unknown-field preservation through native loaders, missing-content suspension, async backend commit and future-schema recovery. Current copied envelopes do not prove every loader preserves every unknown field. |
| ER12-Q4 | Rebuilt fresh-origin desktop equality and Save/reload/literal-file Import per consequential extraction, plus failed-write conservation. Existing native backlog stays open. |
| ER12-Q5 | Real per-module planning/validation/encode/write/render cost, useful query/worker/renderer workload and whole-game RNG capture. No invented performance budget or replay completion. |

No research blocker remains. Proposed APIs/manifests/order are not accepted specifications, installed tools, gameplay changes or new gates for current content work. Root palette and live design owners remain read only.
