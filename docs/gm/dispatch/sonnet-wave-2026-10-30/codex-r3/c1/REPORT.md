# C1 handoff, 2026-10-30

Brief: [C1 L10 cost and slugs](../C1_L10_COST_AND_SLUGS.md). State: requested inference/prep implemented and focused checks pass; seven Luna briefs ready for coordinator launch. Not integrated gameplay, not human-reviewed. No commit, staging, push or host edits. Ownership of these files is released to the coordinator after this report.

## Files

| Surface | Files |
| --- | --- |
| Pure inference seam | `src/ability_cost_infer.js`, `tests/ability_cost_infer.test.js` |
| Tracked handoff | This folder: `prep.mjs`, `fold.mjs`, `fold.test.mjs`, `fold.md`, `luna_1.md` through `luna_7.md`, `REPORT.md` |
| Private cost outputs | `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l10/cost-infer/{merged.jsonl,typed.jsonl,manifest.json}` |
| Private slug inputs | `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l10/slug-cluster/inventory.json`, `in_1.json` through `in_7.json` |

No change to `src/ability_records.js`: qualitative inference is a separate metadata result, because its existing `cost` field requires a concrete spend. The coordinator does not need to merge an optional record-field edit. No core-owner or registration lines touched; no imports from core owners; this leaf introduces no cycle.

## Counts and inference rule

The design's earlier statement that costs are never invented predates the later C1/CHOICES item 2 default. This lane applies that default as labelled authoring proposals, preserving stated source costs. Relevant authority: AD5, AD36, AD38, AR3/AR5/AR8/AR10 and WA48. No accepted design rule changed.

| Input population | All rows | Stated cost rows | Costless rows | Qualitative proposal | Reason only |
| --- | ---: | ---: | ---: | ---: | ---: |
| Merged `rules/ability` occurrences, volumes 1-8 | 3,417 | 106 | 3,311 | 936 | 2,375 |
| Typed ability rows, volumes 2-8 | 2,368 | 92 | 2,276 | 542 | 1,734 |

These populations overlap and must not be added together. Typed stated-cost entries total 113 across 92 rows. Original inputs remain byte-identical to the snapshot. Each costless occurrence appears exactly once in its output with original id, zero-based row index, input path and inference. Stated rows are omitted from inference outputs and left untouched.

`inferAbilityCost` preserves stated costs even if their amount is missing or zero. Otherwise it accepts a caller-supplied mechanism or selects a narrow name hint among bodily, perception, mental, projection, transformation, transport, material and passive. An unknown mechanism yields an explicit unresolved reason. Mechanisms set qualitative cost, recovery and risk defaults; a world profile can override each adjective. Supplied Sequence 9-7 / 6-5 / 4-2 / 1-0 maps to modest / demanding / major / extreme scope demand. This describes default demands, with mastery, duration and world circumstances as dials, not guaranteed fatigue, backlash or a numeric debit.

Every result has `inferred: true`, rule/version, world, mechanism basis, rank basis and proposal status. The schemas do not give a reliable user rung, so all output rows retain `sequence: null` and unresolved intensity. Neither volume nor a target's rank in an ability name is substituted. Unknown mechanisms need reviewed classification; unknown rungs need the owning rung/pathway adapter. No anonymous flat fee was substituted.

Slug scope is the 1,575 distinct `actor.lotm.*` condition/blocker fact suffixes, not ability id suffixes. Inventory carries 1,905 uses with source ids, volume, row index, role, all extracted labels and locators. Each of seven input slices has exactly 225 slugs; coverage is exhaustive and disjoint. One-line meanings are extracted-label hints, explicitly awaiting paragraph review. All source-derived details stay private.

## Checks

Commands run from the repository root. Input identities are SHA-256 bound in private `cost-infer/manifest.json`; shared checkout HEAD is not used as a substitute for dirty-file identity.

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/ability_cost_infer.test.js` | 6 passed | Pure inference, no runtime integration. |
| `node --test tests/ability_cost_infer.test.js docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c1/fold.test.mjs` | 8 passed | Adds synthetic coverage and bad-evidence rejection; does not establish semantic merges. |
| `node docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c1/prep.mjs` | Prepared 18 deterministic artifacts | Includes 7 tracked briefs and 11 private files; no source paragraph validation claimed. |
| `node docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c1/prep.mjs --check` | Passed: all artifacts reproducible, source hashes unchanged; complete costless coverage and exactly-once slug coverage | Reader outputs pending. |
| `git check-ignore` on private manifest and inventory | Both ignored | Private artifacts are local handoff evidence, not committed distribution. |
| `git diff --check -- src/ability_cost_infer.js tests/ability_cost_infer.test.js docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c1` | Passed | New files are untracked; also ran a Python trailing-whitespace scan over owned files, passed. |

Inference module SHA-256: `2b67418134d655b1762eec8f5e8eae5bd425181dc6b3a862586bed8523999fe9`. Test SHA-256: `1c7b9039cc7b80a492ab8345af8a62adc271a186ba751c4c8058dc9f027a5bbf`. Prep/fold scripts and all input hashes are recoverable from the files and manifest. Full suite, build, architecture/rule gates and browser were not run by this lane; coordinator owns integration gates. No gameplay, persistence or UI behavior changed or claimed.

## Exact remaining steps

Coordinator launches `luna_1.md` through `luna_7.md`; each writes its one `out_N.jsonl`. No agents were spawned here. Follow [fold.md](fold.md) to validate outputs, review cross-slice aliases, generate `folded.json` and perform fifteen-row source spot-checks per family. All 1,575 slug ids await that semantic review; their exact partition is in private `in_N.json`. Reason-only cost ids are exactly the output rows lacking `inference.cost`; rung resolution is pending for every output row. These are explicit data gaps, not silently supplied source claims.
