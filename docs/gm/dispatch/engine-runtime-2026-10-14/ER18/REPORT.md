# ER18 report, 2026-10-14

## CHECKPOINT

Completed the requested abstraction inventory as READ research and INFERRED consolidation proposals. All AB1–AB15 are covered. No implementation or accepted architecture decision. Resume from the inventory and lane census/anchors/checks, verifying live hashes first because other lanes are editing the workspace.

## Files written

- `docs/research/ABSTRACTION_INVENTORY_2026-10-14.md`: per-AB owner groups, source-site/file counts, differences, strongest existing candidate, effort/risk, ranked first moves, keep-separate semantics and full grouped source worklist.
- `docs/gm/dispatch/engine-runtime-2026-10-14/ER18/REPORT.md`: this lane return.
- Lane-only audit support: `census.py`, `census.json`, `supplement-misses.json`, `inventory-body.md`, `render_inventory.py`, `anchors.json`, `check_inventory.py`, `checks.json`. Source hashes and structural pointers only; no save payload or sealed truth.

[Inventory](../../../../research/ABSTRACTION_INVENTORY_2026-10-14.md) builds on [ER12](../../../../research/OWN_ENGINE_KERNEL_DESIGN_2026-10-14.md) and [ER2](../../../../research/CODEBASE_STRUCTURE_AND_BUNDLE_AUDIT_2026-10-14.md). Root palette and other owners were read, not edited. Existing dirty and staged workspace changes were preserved.

## Findings returned

| Code | Result | Evidence / palette |
| --- | --- | --- |
| ER18-F1 | Shared services should retain semantic adapters. Clock coordinates, observer knowledge, native owner identity and world laws cannot be flattened safely. | READ anchors in AB1/AB5/AB6/AB10–AB12; INFERRED recommendations. |
| ER18-F2 | Five near-identical native local-calendar conversions and ten xorshift32 arithmetic sites are the clearest bounded math extractions. Their validators, saved cursors and draw distributions differ. | MEASURED census and xorshift scan; READ explicit anchors. AB1/AB4/AB15, RT9, MC11. |
| ER18-F3 | Existing planner, ordered scheduler, registry admission and durable publication are stronger foundations than a replacement generic engine/store. | READ expansion/simulation, save_files, native adapters and ER2 saved cycles; links to ER12. AB2/AB3/AB7–AB9, OE1/OE2/OE3, CH2. |
| ER18-F4 | Current native combat already uses keyed saved streams. ER12's older Math.random combat references are stale for this source snapshot. | READ `src/models/combat.js` random binding and `src/seeded_streams.js` keyed API, exact lines in inventory. AB4, RT9. |
| ER18-F5 | Candidate counts are a review worklist, not deletion counts. Local validation sets, UI caches, content admission validators and thin wrappers inflate lexical matches. | MEASURED structural scan with explicit filters; INFERRED owner classification. All AB rows. |

## Commands run and evidence

Read/search commands: `cat`/`sed` on COMMON, AGENTS, PROJECT, USER_VISION, user preferences, GM prompt, the root palette, E1–E10, offline audit, ER2, ER12 and relevant source. `git status --short` established unrelated dirty/staged state. `rg --files src -g '!SECRETS*'` and scoped `rg -n` searched declarations, clocks/advancers, random arithmetic/calls, schedulers/boundaries/browser timers, command/commit/transfer routes, registries, facts/knowledge, persistence, manifests/config, selectors/signatures and formatters. A targeted memory-registry search for this dispatch found no relevant entry; no memory-derived project claim was used.

Reproducible generated evidence commands, all run:

```sh
python3 docs/gm/dispatch/engine-runtime-2026-10-14/ER18/census.py
python3 docs/gm/dispatch/engine-runtime-2026-10-14/ER18/render_inventory.py
python3 docs/gm/dispatch/engine-runtime-2026-10-14/ER18/check_inventory.py
```

The census records 474 source files, excluding SECRETS-prefixed names. Category site/file counts are in the inventory and `checks.json`; categories overlap and are not summed as independent abstractions. Ten xorshift arithmetic line sites and 27 raw Math.random line sites were found. These are structural counts, not runtime frequency or performance measurements. Explicit anchors total 88.

The first pointer/hash check correctly flagged concurrent main.js drift and the not-yet-written REPORT link. The report was then written and census/pointers refreshed. Five newly landed source files were also inspected: away_ledger, anchor_snapshots, start_records, start_probe_ui and data/start_layers_frontier. Their clock, scheduler, RNG, historical read-model, identity/config and presenter roles were added before finalization. MEASURED final validation passed (exit 0): 474 captured files, 88 explicit anchors, every census pointer range, all 15 category/appendix sections, inventory links, style checks, full source membership and source hashes; zero errors and zero source drift. Exact result is in `checks.json`. A later source edit can stale this snapshot and requires refresh before extraction.

No gameplay tests, build, browser/native controls, runtime benchmarks, installation, source edits, commits or pushes were performed. Source-site discovery is the verification appropriate to this documentation task. Existing lane tests or ER2 performance numbers were not rerun or represented as ER18 results.

## Open questions and limits

| Code | Remaining question / consequence |
| --- | --- |
| ER18-Q1 | No implementation slice is selected by this audit. Ranked proposals are in the inventory; extracting anything requires its own scoped ownership and compatibility checks. |
| ER18-Q2 | The scan is structural, not AST-based semantic equivalence proof. Arbitrary anonymous callbacks or unusually named code can hide further near duplicates. The saved exact filters and reviewed owner groups bound the counts honestly. |
| ER18-Q3 | Generic command idempotency, historical observer `as_of`, a universal manifest/store and dependency-qualified selectors are not established existing APIs. Their smallest candidates require new facades rather than simply renaming one function. |
| ER18-Q4 | There is no gameplay acceptance gate for the audit itself. Future changes need source equivalence, failed-write/save/reload/import and rebuilt desktop checks relevant to the chosen slice. The audit supplies no runtime or human acceptance. |

No new product direction, offline policy, world scope, hunger behavior, cheat limit or mobile gate was introduced.
