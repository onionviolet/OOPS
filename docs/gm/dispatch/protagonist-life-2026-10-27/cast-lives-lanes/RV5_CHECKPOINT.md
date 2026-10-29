# RV5 checkpoint: reviewed-row ingest and replay mapping

Status: private candidate pack and mappings regenerated; offline data/tooling
lane, agent-verified, not human-reviewed. No runtime or UI change. Rules: CLR1,
CLR2, CLR3, CLR4, CLR6, CLR7, CLR12; AD36, AD44. Public source and tests are
name-free; the candidate pack and mappings remain private.

## Ingest result

Two reviewed ledgers were merged into a copy of the live pack. Prior controls
for a source step receiving a reviewed row were replaced so the reviewed row is
the single pack row for that step. Existing IDs with different content still
stop the merge. Re-running the same inputs skips identical IDs.

| Kind | Added | Total adapter definitions after merge |
|---|---:|---:|
| Topic | 1 | 65 |
| Journey | 1 | 522 |
| Place act | 10 | 507 |

The candidate output is
`docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/pack-backups/cast-whole-book-reviewed-candidate-2026-10-29.json`.
The live pack remains unchanged.

## Replay result

| Range | Steps | Exact controls | Retained gaps |
|---|---:|---:|---:|
| Chapters 1–3 before RV5 | 18 | 2 | 16 |
| Chapters 1–3 after RV5 | 18 | 12 | 6 |
| Chapters 1–24 after RV5 | 161 | 41 | 120 |

All 18 reviewed chapter 1–3 step identities were found: all 12 reviewed rows
now have an exact control, and all six reviewed gaps remain gaps with their
typed reasons. The scorer currently recognizes control, wait, blocked and gap,
but has no excluded status. The two review gap categories marked `excluded`
in the brief therefore remain gaps and carry `excludedCandidate` metadata for
a recommended V-lane change; the replay denominator is unchanged.

Private mapping outputs:

- `x1-be-mapping-2026-10-29/chapters-1-3-reviewed.json`
- `x1-be-mapping-2026-10-29/chapters-1-24-reviewed.json`

## Checks

| Command | Result | Gaps |
|---|---|---|
| `node --test tests/merge_reviewed_rows.test.js tests/build_replay_mapping.test.js tests/lead_replay_score.test.js tests/build_place_acts.test.js` | PASS, 34 tests | Synthetic tests; no source or browser replay |
| `node scripts/lead_run/merge_reviewed_rows.mjs` with live pack, RV4 and RV2 inputs | PASS, 11 added rows; 65/522/507 adapter definitions; pack validator and combined simulation registry pass | Candidate pack; runtime adoption and persistence proof were not part of this lane |
| `node scripts/lead_run/build_replay_mapping.mjs` for chapters 1–3 and 1–24 with RV4/RV2 | PASS, 18 and 161 steps; 12 and 41 exact controls | Offline mapper output; not command settlement or gameplay replay |
| `node scripts/lane_review.mjs` with the four owned source/test paths | 0 outside-grant paths, 0 top-level-await hits; one existing name hit in `tests/build_replay_mapping.test.js` | Baseline and current file each have three private-name matches; added-line comparison found 0 new matches |
| `node --check` on the four owned source/test files; scoped whitespace scan | PASS | Syntax and whitespace scope |
| `git diff --check -- scripts/lead_run/build_replay_mapping.mjs tests/build_replay_mapping.test.js` | PASS | Git's check omits the new untracked files; a separate whitespace scan covered all four owned files |
| `node scripts/check_doc_slips.mjs` | RV5 checkpoint has 0 findings | Seven existing findings remain in other documents |

The broad `git diff --check` also encountered a trailing-whitespace warning in
the already modified, unowned `dist/bundle.js`; that file was not changed by
this lane. No build, browser replay, save/import proof, commit or push was run.

## Resume 1: replay source-step validation, 2026-10-29

The original RV5 regeneration used `merged-cast-2026-10-28/scenes.jsonl`, a
429-scene input, instead of the 4,899-scene M4 merge used by the replay driver.
This caused the source-step assertion to fail. The earlier table's 18 and 161
step counts describe the smaller input and do not describe the M4 chapter
ranges. The reviewed overlay itself did not remove steps: the old and the
original reviewed 1–24 mapping differed by 1,330 old-only IDs and 0 new-only
IDs, matching the smaller input's coverage.

Regenerated both private mappings with `/tmp/m4-lotm/merged/scenes.jsonl` and
its crosswalk and registry. The M4 scene file SHA-256 is
`27540d66f80aeec3301aab50bc00a297e07ab99e55ade4dabdfc6eb46bc3735b`.
The CLI now records the raw scene-file hash in the existing driver-recognized
`inputHashes.scenes.jsonl` field. A synthetic CLI regression verifies that
adding reviewed dispositions preserves the selected IDs and untouched rows.

| Mapping | Source scenes | Source steps | Exact mapped controls | Retained gaps |
|---|---:|---:|---:|---:|
| Chapters 1–3 reviewed | 57 | 175 | 24 | 151 |
| Chapters 1–24 reviewed | 418 | 1,491 | 153 | 1,338 |

The regenerated 1–24 and prior unreviewed 1–24 mappings have identical ID sets:
0 old-only and 0 new-only. All 12 reviewed rows and six reviewed gaps from RV4
remain represented in the 1–3 range; RV2 contributes 54 further reviewed gaps
within 1–24. These mappings describe candidate controls, not settled gameplay.

| Command | Result | Gaps |
|---|---|---|
| `node scripts/lead_run/build_replay_mapping.mjs` with M4 scenes, crosswalk and registry, candidate pack, RV4 and RV2, for ranges 1–3 and 1–24 | PASS, 175 and 1,491 steps | Private offline outputs |
| `node scripts/headless/lead_runs/lotm_ui_replay.mjs --seat be --mapping <1-3-reviewed> --scenes /tmp/m4-lotm/merged/scenes.jsonl --l4b-gaps <gaps.jsonl> --chapters 1-3 --audit-only --out /tmp/rv5-resume1-audit-1-3` | PASS, validates 175 source steps and selects 175 | Audit path, no browser execution |
| Same driver command with `<1-24-reviewed>` and `/tmp/rv5-resume1-audit-1-24` | PASS, validates 1,491 source steps and selects 175 | Audit path, no browser execution |
| `node --test tests/merge_reviewed_rows.test.js tests/build_replay_mapping.test.js tests/lead_replay_score.test.js tests/build_place_acts.test.js` | PASS, 35 tests | Synthetic tests, plus driver audits above |
| `node scripts/lane_review.mjs` with the mapper, its test and this checkpoint granted | 0 outside-grant and 0 top-level-await hits; one pre-existing test-file name hit | HEAD and current test each match three private names; 0 new matches |
| `node --check scripts/lead_run/build_replay_mapping.mjs`, `node --check tests/build_replay_mapping.test.js`, scoped `git diff --check` | PASS | Syntax and whitespace scope |
| `node scripts/check_doc_slips.mjs` | RV5 checkpoint has 0 findings | Seven existing findings remain in other documents |

No browser replay, command settlement, persistence proof, commit or push was
performed in this resume. Agent-verified, not human-reviewed.

## Resume 2: all reviewed shards, 2026-10-29

The RV2, RV4, RV6, RV7, RV8 and RV9 ledgers were applied in that order to a
copy of the live pack. A row verdict beats a gap verdict; the later shard wins
when verdicts have the same kind. The mapper and merger share that resolution.
RV7 overlaps RV2 on 54 steps: 25 later rows replace gaps and 29 later gaps
replace earlier gaps. There were 54 differing-record conflicts, no identical
duplicates, no ID collisions and no rejected rows.

| Shard | Acts added | Topics added | Journeys added | Rejected |
|---|---:|---:|---:|---:|
| RV2 | 0 | 0 | 0 | 0 |
| RV4 | 10 | 1 | 1 | 0 |
| RV6 | 9 | 3 | 2 | 0 |
| RV7 | 12 | 9 | 4 | 0 |
| RV8 | 3 | 4 | 1 | 0 |
| RV9 | 12 | 20 | 3 | 0 |
| Total | 46 | 37 | 11 | 0 |

The private candidate is `pack-backups/cast-whole-book-reviewed2-candidate-2026-10-29.json`
under the lead-run private directory; SHA-256
`abb1eb1ea73226b2be5ba0facfc50de84e3d83f4e1a9fea77a5ea9e6c0db0d6f`.
The live pack was read without modification. H2 operations use the actual
`definePlaceActs` adapter and operation registry, including their stock,
custody and clock checks.

| Range | Steps | Controls before | Controls after | Exclusion candidates: non-lead / not an action |
|---|---:|---:|---:|---:|
| Chapters 1–3 | 175 | 24 | 24 | 1 / 1 |
| Chapters 1–24 | 1,491 | 153 | 200 | 16 / 4 |
| Volume 1, chapters 1–100 | 1,130 | 201 | 262 | 33 / 5 |

All three before/after ID sets match exactly. The first two comparisons use
the Resume 1 reviewed mappings; the volume 1 comparison uses the prior ladder
mapping. Exclusion candidates remain typed gaps in the current scorer, so they
still enter its denominator. Counts measure candidate mappings, not successful
command execution.

The private mapping outputs are `x1-be-mapping-2026-10-29/chapters-1-3-reviewed.json`
(`42b7f7f2bca3…`), `x1-be-mapping-2026-10-29/chapters-1-24-reviewed.json`
(`0831911962e4…`) and `x4-whole-book-mapping-2026-10-29/ladder/v1-ch1-100.json`
(`a490620216da…`). All were generated from the full M4 source whose SHA-256 is
recorded in Resume 1.

| Command | Result | Gaps |
|---|---|---|
| `node scripts/lead_run/merge_reviewed_rows.mjs` with live pack and all six shards | PASS, 94 rows added; `validateLotmCast`, JSON/predicate checks and combined native registry validated 101 topic, 530 journey and 536 act definitions | Candidate data; no command settlement |
| `node scripts/lead_run/build_replay_mapping.mjs` with full M4 inputs, candidate pack and all six shards for each requested range | PASS, 175 / 1,491 / 1,130 rows, unchanged ID sets | Offline mappings |
| Driver audit mode, full M4 scenes, chapter 1–3 reviewed mapping, `--chapters 1-3` | PASS, validates and selects 175 steps | No browser replay |
| Driver audit mode, full M4 scenes, chapter 1–24 reviewed mapping, `--chapters 1-3` | PASS, validates 1,491 steps and selects 175 | No browser replay |
| Driver audit mode, full M4 scenes, volume 1 ladder, `--chapters 1-100` | FAIL, source-step assertion | Driver selects chapters across volumes and does not use mapping locator bounds; driver is outside this lane's grant |
| Driver audit mode with a temporary volume-filtered M4 scene file and temporary mapping copy with its matching file hash | PASS, validates and selects 1,130 steps | Supplemental check; does not establish full-input driver compatibility |
| `node --test tests/merge_reviewed_rows.test.js tests/build_replay_mapping.test.js tests/lead_replay_score.test.js tests/build_place_acts.test.js` | PASS, 38 tests | Synthetic coverage and adapter checks |
| `node scripts/lane_review.mjs` with the five owned paths | 0 outside-grant and 0 top-level-await hits; two test files have pre-existing private-name matches | HEAD and current matches are unchanged, 0 new matches |
| `node --check` on both scripts and both test files; scoped `git diff --check` | PASS | Syntax and whitespace scope |
| `node scripts/check_doc_slips.mjs` | RV5 checkpoint has 0 findings | Ten findings remain in other documents |

The driver owner needs volume-aware source selection before the true volume 1
ladder can pass audit against the full M4 file. Browser replay, persistence,
commit and push were not performed. Agent-verified, not human-reviewed.

## Resume 3: divination, making and inference, 2026-10-29

The live pack matched the reviewed2 candidate by SHA-256. RV2, RV4, RV6, RV7,
RV8, RV9, RV10, RW4, RW5 and RW6 were merged in that order into a new private
candidate. The shared resolver keeps a row over a gap and uses the later shard
for equal verdicts. The 54 conflicts are the earlier RV2/RV7 overlap. No row
was rejected and no ID collision occurred; RW4 supplied 150 gap verdicts and
no rows. The native place, topic, journey, divination, making and inference
adapters validate their own data and command definitions.

| Shard | Acts | Topics | Journeys | Divinations | Making | Inferences | Identical rows skipped | Rejected |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| RV2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| RV4 | 0 | 0 | 0 | 0 | 0 | 0 | 12 | 0 |
| RV6 | 0 | 0 | 0 | 0 | 0 | 0 | 14 | 0 |
| RV7 | 0 | 0 | 0 | 0 | 0 | 0 | 25 | 0 |
| RV8 | 0 | 0 | 0 | 0 | 0 | 0 | 8 | 0 |
| RV9 | 0 | 0 | 0 | 0 | 0 | 0 | 35 | 0 |
| RV10 | 6 | 1 | 1 | 0 | 0 | 0 | 0 | 0 |
| RW4 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| RW5 | 0 | 0 | 0 | 0 | 9 | 0 | 0 | 0 |
| RW6 | 0 | 0 | 0 | 0 | 0 | 56 | 0 | 0 |
| Total | 6 | 1 | 1 | 0 | 9 | 56 | 94 | 0 |

The private candidate is `pack-backups/cast-whole-book-reviewed3-candidate-2026-10-29.json`
under the lead-run private directory; SHA-256
`09c971e95889d9f80bc6f9f15b423547f54cf9bfbd8aa3fa1197e65c80c28e61`.
Live pack and source data were read without modification.

| Range | Steps | Controls before | Controls after | New-kind rows mapped |
|---|---:|---:|---:|---:|
| Chapters 1–3 | 175 | 24 | 26 | 2 inference |
| Chapters 1–24 | 1,491 | 200 | 208 | 7 inference, 1 making |
| Volume 1, chapters 1–100 | 1,130 | 262 | 278 | 7 inference, 1 making |

The before/after ID sets match for each range. The chapter-number mappings
include matching chapters across volumes; the driver selects 41 and 285 volume
1 steps for the first two audits, respectively. The ladder audit selects all
1,130 volume 1 steps. RW5's nine rows and RW6's 56 rows all have M4 source
scenes; most fall outside these requested ranges.

Making maps to its row command. Divination and inference map to their ordered
adapter step commands, using the reviewed place or a resolved source-scene
place. A missing route place remains a gap. Every mapped new-kind command ID
in these ranges was found in the candidate's adapter output. Counts indicate
candidate mapping, not completed actions.

| Command | Result | Gaps |
|---|---|---|
| `node scripts/lead_run/merge_reviewed_rows.mjs` with live pack and all ten reviewed shards | PASS, 73 rows added, 94 identical rows skipped; pack validator and native registry validated 102 topic, 531 journey, 542 act, 0 divination, 9 making and 56 inference definitions | Private candidate; command settlement remains untested |
| `node scripts/lead_run/build_replay_mapping.mjs` with full M4 inputs, reviewed3 candidate and ten shards, for each requested range | PASS, 175 / 1,491 / 1,130 rows; source ID sets unchanged | Offline mappings |
| Driver audit mode with full M4 scenes, chapter 1–3 mapping, `--chapters 1-3 --volume 1` | PASS, validates 175 and selects 41 | Browser replay remains untested |
| Driver audit mode with full M4 scenes, chapter 1–24 mapping, `--chapters 1-24 --volume 1` | PASS, validates 1,491 and selects 285 | Browser replay remains untested |
| Driver audit mode with full M4 scenes, volume 1 ladder, `--volume 1 --locator-range` for chapters 1–100 | PASS, validates and selects 1,130 | Browser replay remains untested |
| Adapter command-ID comparison for all three mappings | PASS, 0 missing mapped new-kind command IDs | Definition comparison, not runtime execution |
| `node --test tests/merge_reviewed_rows.test.js tests/build_replay_mapping.test.js tests/lead_replay_score.test.js tests/build_place_acts.test.js` | PASS, 41 tests | Synthetic fixtures |
| `node scripts/lane_review.mjs` with the five owned paths | 0 outside-grant and 0 top-level-await hits; two existing test-file name hits | Baseline and added-line comparison recorded in lane report |
| `node --check` on changed mapper and test; scoped `git diff --check` | PASS | Syntax and whitespace scope |
| `node scripts/check_doc_slips.mjs` | RV5 checkpoint has 0 findings | 18 findings remain in other documents |

The Resume 2 driver limitation was resolved by the later volume-aware driver.
No browser replay, persistence proof, commit or push was performed in Resume 3.
Agent-verified, not human-reviewed.

## Resume 4: body, ability and exchange, 2026-10-29

The live pack matched reviewed3 by SHA-256. The 13 requested shards were merged
in order into a new private candidate. The existing resolver prefers a row to
a gap and the later shard for equal verdicts. It reported 54 differing-record
conflicts, the RV2/RV7 overlap, and zero identical duplicate verdicts. There
were no ID collisions or rejected rows. RW9 has 100 gaps and no exchange rows.

| Shard | Body added | Ability added | Other kinds added | Identical rows skipped | Rejected |
|---|---:|---:|---:|---:|---:|
| RV2 | 0 | 0 | 0 | 0 | 0 |
| RV4 | 0 | 0 | 0 | 12 | 0 |
| RV6 | 0 | 0 | 0 | 14 | 0 |
| RV7 | 0 | 0 | 0 | 25 | 0 |
| RV8 | 0 | 0 | 0 | 8 | 0 |
| RV9 | 0 | 0 | 0 | 35 | 0 |
| RV10 | 0 | 0 | 0 | 8 | 0 |
| RW4 | 0 | 0 | 0 | 0 | 0 |
| RW5 | 0 | 0 | 0 | 9 | 0 |
| RW6 | 0 | 0 | 0 | 56 | 0 |
| RW7 | 31 | 0 | 0 | 0 | 0 |
| RW8 | 0 | 2 | 0 | 0 | 0 |
| RW9 | 0 | 0 | 0 | 0 | 0 |
| Total | 31 | 2 | 0 | 167 | 0 |

The private candidate is `pack-backups/cast-whole-book-reviewed4-candidate-2026-10-29.json`
under the lead-run private directory; SHA-256
`9fe7cf49def248e3b54531ffb5a0e2149103258e36dd309d9af309a83c8d52d9`.
The live pack and M4 inputs were read without modification.

| Range | Steps | Controls before | Controls after | New-kind mapped rows |
|---|---:|---:|---:|---:|
| Chapters 1–3 | 175 | 26 | 26 | 0 |
| Chapters 1–24 | 1,491 | 208 | 210 | 2 body |
| Volume 1, chapters 1–100 | 1,130 | 278 | 285 | 6 body, 1 ability |

All three before/after source-step ID sets match. The chapter-number mappings
include matching chapters across volumes; the audits select 41 and 285 volume
1 steps, respectively. The ladder selects 1,130 volume 1 steps. Mapped body
and ability route IDs match the candidate adapter outputs. These are candidate
controls, with runtime eligibility and settlement still untested.

Private mapping outputs are `x1-be-mapping-2026-10-29/chapters-1-3-reviewed.json`
(`41de393c2809…`), `x1-be-mapping-2026-10-29/chapters-1-24-reviewed.json`
(`25a17344a220…`) and `x4-whole-book-mapping-2026-10-29/ladder/v1-ch1-100.json`
(`6126ec119641…`).

| Command | Result | Gaps |
|---|---|---|
| `node scripts/lead_run/merge_reviewed_rows.mjs` with live pack and all 13 shards | PASS, 33 added, 167 identical skipped; pack validator, JSON/predicate and registry checks validated 102 topic, 531 journey, 542 act, 0 divination, 9 making, 56 inference, 0 exchange, 31 body and 2 ability commands | Candidate data; settlement untested |
| `node scripts/lead_run/build_replay_mapping.mjs` with full M4 inputs, reviewed4 candidate and 13 shards for each range | PASS, 175 / 1,491 / 1,130 rows; unchanged source-step ID sets | Offline mappings |
| Driver audit mode with full M4 scenes, chapter 1–3 mapping, `--chapters 1-3 --volume 1` | PASS, validates 175 and selects 41 | Browser replay untested |
| Driver audit mode with full M4 scenes, chapter 1–24 mapping, `--chapters 1-24 --volume 1` | PASS, validates 1,491 and selects 285 | Browser replay untested |
| Driver audit mode with full M4 scenes, volume 1 ladder, `--volume 1 --locator-range` for chapters 1–100 | PASS, validates and selects 1,130 | Browser replay untested |
| Candidate adapter ID comparison for all three mappings | PASS, 0 missing body, ability or exchange route IDs | Definition comparison; no gameplay claim |
| `node --test tests/merge_reviewed_rows.test.js tests/build_replay_mapping.test.js tests/lead_replay_score.test.js tests/build_place_acts.test.js` | PASS, 43 tests | Synthetic fixtures |
| `node scripts/lane_review.mjs` with the five owned paths | 0 outside-grant and 0 top-level-await hits; two existing test-file name hits | HEAD and current files match the same private names, 0 new matches |
| `node --check` on both scripts; scoped `git diff --check` | PASS | Syntax and whitespace scope |
| `node scripts/check_doc_slips.mjs` | RV5 checkpoint has 0 findings | 27 findings remain in other documents |

No browser replay, persistence proof, commit or push was performed in Resume 4.
Agent-verified, not human-reviewed.
