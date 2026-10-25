# Lane C4: lean tests, 2026-10-25

## Authority and ownership

User-authorized branch `codex/lean-tests-2026-10-25`, isolated worktree
`~/.codex/worktrees/lean-tests/yet-another-idle-rpg`, base `9b997ea60a7eb12200dbc825684e6668403aa015`.
Only this worktree is writable for this task. No master integration or push.
Rules: AD32 (audit proposals are not decisions), AD36 and AGENTS Verification
2026-10-22 (system organization; preserve meaningful invariants), AD37 / AU1–AU3
(bounded reviewers), AD41 (explicitly requested isolation). Primary COMMON.md read.
B5 audit is read-only proposal input from the primary checkout.

No runtime behavior or player UI changes planned. Failure to prevent: losing
assertions, fixtures, runner discovery, native boundaries or compatibility while
moving tests. Existing `node --test tests/<system>.test.js` focused checks plus
user-requested baseline/final `npm test`, final architecture and rule checks.

## Review budget

Coordinator writes and commits. Two fresh Luna-low read-only equivalence reviewers,
one for container/absorption, one for system/host renames and regrouping; at most
two concurrent workers. Each checks base-to-result cases, assertions, setup,
references and discovery in its exact slice, returns evidence and gaps. Coordinator
reviews claims against diff and exact source preservation. No full suite by workers.
Live allowance unknown; no paid fallback or further worker tree.

## Primary dirty tests deferred

Initial read-only `git -C /Users/weiwei/code/yet-another-idle-rpg status --short tests/`:
tracked dirty: continuation_state, economy_standing, gear_dimensions, gear_workshop,
household_fortunes_domain, life_record, p23-host-joins-world-adaptation,
p23-world-adaptation, peer_standing_domain, pledges (`.test.js`), ui_contract_allowlist.json.
All remain untouched, including as destinations. All initially untracked primary
test files are excluded; full paths are recorded in `DEFERRED_PRIMARY_TESTS.txt`. Primary status is rechecked before each edit slice.

## Checks and progress

- Initial sandbox baseline: aborted after confirmed `listen EPERM 127.0.0.1`; only this lane’s process tree stopped. Invalid environment, not test/runtime defect evidence. Log `/private/tmp/lean-tests-baseline.log`.
- Baseline `/usr/bin/time -p npm test` with required localhost/Chrome permissions, pristine base: PASS 2,877 tests, 0 failures, 0 skipped; 419.58 s real (runner 419.259 s). Log `/private/tmp/lean-tests-baseline-unsandboxed.log`. 372 root `.test.js` files discovered. The existing seeded-story scheduler case dominated the final tail; concurrent lanes also ran suites, so timings are observational.
- Failure triage: no failures at base in the valid environment. `cheat_awakening`, `cheat_cards`, and `rt_slice1_fixtures` passed. B5’s headless subdirectory files are outside the existing npm test glob; no claim of headless-subdirectory coverage. No bug fixes required. R6 fixture move is now safe because its original test passed with diagnostics retained.

- `node --test tests/structured_container.test.js`: PASS 22/22; development, preparation, runtime and native integration fixtures kept in distinct lexical scopes. All 22 registration blocks retained exactly. M1 implemented; no assertions deleted.

- `node --test tests/{home_furnishing_bonuses,accessory_utility,local_life,fort_supply,pacing,equipment_durability,elemental_affinities}.test.js`: PASS 62/62. R1 plus the same local-life owner from R2; no assertion deletion. New names identify distinct runtime owners; existing home-household and fork-fort suites cover different seams. Exact block preservation now 84 cases across 12 base files.

- `node --test` over the 25 R2/R4/R5/R6 destination suites listed in `relocation-systems.json`: PASS 278/278, including current native-save fixture browser journey; log `/private/tmp/lean-tests-systems.log` (45.530 s runner). All 362 relocated registrations from 39 base files remain literal once in the working result.
- Review A (Luna-low): checked M1/R1 imports, lexical fixture scopes, document/equipment-reader restoration and native-loader prefixes; no assertion loss found. Coordinator confirmed exact block preservation plus original import identities and reviewed the scoped diff. No test re-run by reviewer.
- Commit sequencing correction: the R1 commit process overlapped the next slice’s preparation and captured new system destinations before their original paths retired. This commit finishes those moves; final equivalence and discovery compare the complete branch to base. No unrelated work was present or included. Further edits/commits are sequential.

- Host slice `node --test tests/{growth_profile,known_detail,title_training,reading,exposure,household,living_gear,combat_options,field_familiarity,leisure_memory,market_life,native_optional_envelope}.test.js`: PASS 171/171; initial log `/private/tmp/lean-tests-hosts.log`, final import/setup cleanup log `/private/tmp/lean-tests-hosts-final.log` (0.428 s runner). Original assertions unchanged; unused copied fixtures removed from combat/market host blocks, and unused split imports removed.
- Review B (Luna-low): owner grouping, same-directory fixture URLs, seeded-stream fixture scope and executable references spot-checked; two retired-path references corrected in the fixture README and playtest comment. Reviewer did not independently prove all bodies; coordinator’s exact-block check supplies that evidence.
- `python3 docs/gm/dispatch/lean-tests-2026-10-25/verify-relocation.py`: PASS, all 390 original registration blocks from 46 base files retained exactly once, every assertion intact, every destination discovered by the existing npm glob. Coordinator reviewed unified import bindings and fixture closures, plus unchanged helpers/source modules. No runtime code changed.

## Scope outcome and final gates

M1 implemented with isolated lifecycle fixture blocks. M2/R3 implemented through
owner-specific integration suites rather than a mixed host-joins file. The one
cross-family schema case stays whole in `native_optional_envelope.test.js`.
R1–R6 implemented where primary files are clean. R2/R3 world-adaptation tests
remain deferred. No deletion proposal was justified; no assertions were pruned.
Existing compatibility, layout, world-pack lifecycle and distinct combat nonce /
practice suites remain unchanged. This is test organization, not new gameplay.

Final gate follows the final implementation commit, per the explicit lane brief:
`npm test`, `npm run check:arch`, `npm run check:rules`. Final results are below.
The original delivery left the post-commit validation receipt uncommitted.
G1’s same-session continuation now authorizes committing only this checkpoint.
The recorded checks remain valid for unchanged implementation inputs; no
equivalent suite is rerun for this documentation-only receipt.

## Post-commit verification receipt

Reorganization candidate HEAD: `585746158be8ac7550d1eadbc8dd2eca351b9091`.
Four reorganization commits from base, followed by the bounded harness repair below; no master integration or push. The working tree was
clean when the final gates started. The original delivery updated this checkpoint and the deferred-path snapshot
after the implementation gates. The deferred snapshot was included in the harness
repair commit; this continuation commits only the final checkpoint receipt.

- `npm run check:arch`: PASS, source ratchets satisfied; six grandfathered main imports and 226 cyclic edges remain unchanged. Log `/private/tmp/lean-tests-arch.log`.
- `npm run check:rules`: PASS, 22 register rows, 41 AD codes, 125 relative links, 0 warnings. Log `/private/tmp/lean-tests-rules.log`.
- Exact registration check with an additional literal-occurrence count: PASS, all 390 registrations retained once across final destinations; existing npm glob unchanged. Focused slice counts independently match the original mapped case totals.
- Final read-only primary status versus base-to-HEAD paths: PASS, zero overlap with all 42 currently dirty/untracked primary paths. The snapshot also includes newly dirty `stepper_life_commit.test.js` and untracked `native_rendering.test.js`; neither is touched. R2/R3 world-adaptation remains deferred.
- First final `/usr/bin/time -p npm test` at `585746158`: FAIL 2,876/2,877, one source-extraction VM timeout in untouched `traveler_lint_hint.test.js:16`; 307.52 s real (runner 305.345 s), 0 skipped. Log `/private/tmp/lean-tests-final.log`. Root runner files: 372 → 360 (12 fewer, 3.23%); no assertions removed.
- `node --test tests/traveler_lint_hint.test.js` on unchanged failed-run inputs: PASS 3/3 (7.531 s). Log `/private/tmp/lean-tests-timeout-repro.log`. The 100 ms VM wall-time bound in the offline source-table helper is load-sensitive; source evaluation uses inert constructors and no native gameplay code. This is a harness/tooling timing defect, not an observed game runtime defect.
- Repair: `scripts/village_supply_tables.mjs` retains identical literal inputs, sandbox context and output, with the runaway-evaluation guard widened from 100 ms to 1 s. Primary helper/test paths were clean. No assertion changed; no synthetic timing assertion added.
- `node --test tests/{traveler_lint_hint,village_obtainability,village_traveler_asks,world_history_consumers,generated_people}.test.js`: PASS 20/20 (2.708 s), unchanged output/knowledge/invariant checks cover direct consumers. Log `/private/tmp/lean-tests-extraction.log`.
- Repair commit / final gate input: `e9c547605c7e4de208b2d6d200cdcec12204a3f8`. `npm test` completed with the same dependencies and localhost/browser permissions as the valid baseline. Repeating the full suite is justified by the named final-gate failure and the repaired shared extraction helper.
- Post-repair `npm run check:arch`: PASS, unchanged ratchets/grandfathered counts; log `/private/tmp/lean-tests-arch-repaired.log`.
- Post-repair `npm run check:rules`: PASS, 0 warnings; log `/private/tmp/lean-tests-rules-repaired.log`.

## Final result

- Post-repair `/usr/bin/time -p npm test`: PASS 2,877/2,877, 0 failed/cancelled/skipped/todo; 122.94 s real (runner 122.782 s), user 519.91 s, sys 56.82 s. Input `e9c547605c7e4de208b2d6d200cdcec12204a3f8`; log `/private/tmp/lean-tests-final-repaired.log`. Post-repair architecture and rules gates also passed after this commit.
- Baseline comparison: 2,877 → 2,877 tests; 372 → 360 root test files (12 fewer, 3.23%); 419.58 → 122.94 s observed real time (296.64 s less). Baseline user CPU was 577.89 s, sys 63.01 s. Concurrent machine load differed materially, so this is not a controlled benchmark or proof of a stable causal speedup. The cleanup preserves coverage and reduces file/process count.
- Final read-only primary status overlap check: PASS, 0 changed branch paths overlap the 42 dirty/untracked primary paths. Full deferred path inventory is `DEFERRED_PRIMARY_TESTS.txt`; world-adaptation proposal moves remain deferred. No primary files, master ref, user saves, or remote refs changed by this lane.
- Five implementation commits through `e9c547605`, followed by this checkpoint-only delivery receipt under G1’s same-session continuation. All test organization and the harness guard repair were already committed. No equivalent suite was rerun because only documentation changed; the exact final 2,877/2,877 receipt above remains authoritative for implementation input `e9c547605`. No further build/browser gameplay gate applies because application behavior and persistence were unchanged; the retained native-save browser journey passed in the full suite. Headless subdirectory tests remain outside the existing npm command, as at baseline.

## Assertion relocation mapping

No assertion or invariant was deleted. Cases are numbered in their original
base-file registration order; the same case title and complete registration body
remain in the destination. Every assertion inside each listed case therefore
continues to check the same initial state, action and observable invariant.
The assertion column is a lexical count of `assert` calls/references, not dynamic
loop iterations. Detailed source/destination/case/title lists are in
`relocation-*.json`. Existing helper assets and save fixtures retain their paths.

| Original base file | Original cases (same titles retained) | Final covering system suite | Assert expressions retained |
|---|---|---|---:|
| `absorb_b.test.js` | 1, 2, 3, 4, 5 | `home_furnishing_bonuses.test.js` | 30 |
| `absorb_c1.test.js` | 1, 2, 3, 4, 5, 6 | `accessory_utility.test.js` | 52 |
| `absorb_c2.test.js` | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 | `local_life.test.js` | 73 |
| `absorb_d.test.js` | 1, 2, 3, 4, 5, 6, 7, 8 | `fort_supply.test.js` | 49 |
| `absorb_e1.test.js` | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 | `pacing.test.js` | 52 |
| `absorb_e2.test.js` | 1, 2, 3, 4, 5, 6 | `equipment_durability.test.js` | 69 |
| `absorb_e3.test.js` | 1, 2, 3, 4, 5 | `elemental_affinities.test.js` | 30 |
| `p23_life_loops.test.js` | 1, 2, 3, 4, 5, 6, 7, 8, 9 | `local_life.test.js` | 58 |
| `structured_container_development.test.js` | 1, 2, 3 | `structured_container.test.js` | 7 |
| `structured_container_integration.test.js` | 1, 2, 3, 4, 5 | `structured_container.test.js` | 21 |
| `structured_container_preparation.test.js` | 1, 2, 3, 4 | `structured_container.test.js` | 31 |
| `structured_container_runtime.test.js` | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 | `structured_container.test.js` | 47 |
| `p23-host-joins-growth.test.js` | 1, 2, 3, 4 | `growth_profile.test.js` | 15 |
| `p23-host-joins-known-detail.test.js` | 1, 2 | `known_detail.test.js` | 7 |
| `p23-host-joins-long-life.test.js` | 1, 2, 3 | `title_training.test.js` | 8 |
| `p23-host-joins-tranche3.test.js` | 1, 2 | `reading.test.js` | 8 |
| `p23-host-joins-tranche-one.test.js` | 1, 2, 3, 4 | `exposure.test.js` | 11 |
| `p23-host-joins-tranche-one.test.js` | 5 | `household.test.js` | 2 |
| `p23-host-joins-tranche-two.test.js` | 1, 2, 3, 4, 5, 7 | `living_gear.test.js` | 15 |
| `p23-host-joins-tranche-two.test.js` | 6 | `combat_options.test.js` | 2 |
| `p23-host-joins-step2.test.js` | 1 | `native_optional_envelope.test.js` | 3 |
| `p23-host-joins-step2.test.js` | 2, 4 | `leisure_memory.test.js` | 3 |
| `p23-host-joins-step2.test.js` | 3 | `field_familiarity.test.js` | 2 |
| `p23-host-joins-step2.test.js` | 5 | `market_life.test.js` | 3 |
| `p23-combat-options.test.js` | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 | `combat_options.test.js` | 57 |
| `p23-encounter-host.test.js` | 1, 2, 3, 4 | `encounter_host.test.js` | 14 |
| `p23-encounter-profiles.test.js` | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13 | `encounter_profiles.test.js` | 48 |
| `p23-exposure.test.js` | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 | `exposure.test.js` | 58 |
| `p23-field-familiarity.test.js` | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 | `field_familiarity.test.js` | 72 |
| `p23-growth-profile.test.js` | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 | `growth_profile.test.js` | 63 |
| `p23-household.test.js` | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 | `household.test.js` | 56 |
| `p23-known-detail.test.js` | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 | `known_detail.test.js` | 49 |
| `p23-leisure-memory.test.js` | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17 | `leisure_memory.test.js` | 59 |
| `p23-living-gear.test.js` | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 | `living_gear.test.js` | 54 |
| `p23-long-life.test.js` | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 | `title_training.test.js` | 56 |
| `p23-market-life.test.js` | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 | `market_life.test.js` | 62 |
| `p23-native-authority.test.js` | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17 | `native_authority.test.js` | 83 |
| `p23-repeat-search.test.js` | 1, 2, 3, 4, 5, 6, 7 | `repeat_search.test.js` | 38 |
| `p23-reread.test.js` | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13 | `reading.test.js` | 49 |
| `p23-salvage.test.js` | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 | `salvage.test.js` | 74 |
| `p23-save-time-options.test.js` | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 | `backup_undo.test.js` | 33 |
| `fa09_routines.test.js` | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18 | `routine_jobs.test.js` | 120 |
| `fa10_manual.test.js` | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 | `manual_learning.test.js` | 90 |
| `fa11_retort.test.js` | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 | `retort_jobs.test.js` | 129 |
| `fa18_runner_consequence.test.js` | 1, 2, 3, 4, 5, 6, 7 | `runner_consequences.test.js` | 36 |
| `life_experience_b.test.js` | 1, 2, 3, 4, 5 | `life_experience.test.js` | 38 |
| `life_experience_c.test.js` | 1, 2 | `life_experience.test.js` | 10 |
| `micro_p1_xp.test.js` | 1 | `skill_xp_grants.test.js` | 13 |
| `seeded_streams.test.js` | 1, 2, 3, 4, 5, 6, 7, 8 | `seeded_streams.test.js` | 45 |
| `procgen_wave1_integration.test.js` | 1 | `seeded_streams.test.js` | 7 |
| `rt_slice1_fixtures.test.js` | 1 | `native_save_fixtures.test.js` | 28 |
