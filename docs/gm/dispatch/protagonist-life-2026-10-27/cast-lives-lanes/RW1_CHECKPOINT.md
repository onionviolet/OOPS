# RW1: paragraph-reviewed query and rite candidates

Status: **100 steps reviewed; 0 row verdicts, 100 typed gaps**. Offline private
research, agent-verified, not human-reviewed. No gameplay coverage added, pack
adoption, runtime edit or commit. Ownership of the two outputs is released to
the coordinator. Authority: [RW1 brief](RW1_BRIEF.md), the current lead-life
direction in [PROJECT](../../../../../PROJECT.md), and the
[query contract](MF_DIVINATION_CHECKPOINT.md#d1-row-contract-for-the-content-lane).
Applies: CLR1–CLR6, CLR12, AD6–AD8, AD36, AD44; sealed-secret publication rules.
No accepted direction or rulebook changed.

## F1: inputs, selection and publication

The private output is
`docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/reviewed-rows-2026-10-29/RW1.jsonl`.
This checkpoint contains generic findings; paragraph paraphrases and source
locators stay in that private JSONL. Each verdict was appended after reading
its cited paragraphs through `shardIndex` from `cite_paragraphs.mjs`, with
neighboring paragraphs used for context. Gap rows carry `row:null`.

Selection uses X4 Resume 2's `x4-whole-book-mapping-2026-10-29/ladder/`
range mappings, the ordered family classifier in `gap_census.mjs`, and
`m4-whole-book-2026-10-29/merged/scenes.jsonl`. At selection time, 342 distinct
step identities already appeared in other reviewed JSONL files. Excluding
them left 387 candidates across the two broad families before rite review.
Order is source volume, chapter, scene order and step number. Source shard
volume resolves later-volume scenes whose chapter citations omit the volume;
their corrected private locators address the actual source volume.

Of the first 114 candidates, 14 ability-family steps were excluded because
they were ordinary calls for people, direct gathering/projection without a
rite, perception, illusion, combat power or artifact activation without an
authored rite. Charm incantations, channeling, self-summoning rites and
pendulum queries remain in scope. No divination-family candidate was skipped
for a poor fit: unsupported actions receive a gap verdict.

| CLR2 probe | Expected | Observed | Gate |
|---|---:|---:|---|
| Unreviewed eligible steps selected | 100 or family end | 100 | Met |
| Selected steps with retrievable cited paragraphs | At least half | 100/100 | PASS |
| Cited paragraph references retrieved | All authored locators | 246/246, none missing | PASS |
| Existing query field | Inventory | Absent from the live private pack | Not a gate |

The 100 verdicts comprise 83 divination-or-ritual family steps and 17
ability-family rites; 51 are in the first source volume and 49 in the second.
Output kind counts: `divination=100`; row kinds: `divination=0`; gap kinds:
`divination=100`. The family is not exhausted; this lane stops at its 100-step
limit. Steps after that boundary remain unreviewed by RW1.

## F2: top five gap reasons

These counts classify the first sufficient blocker, not every possible defect.
They describe the current adapter's fit, not impossibility in the world.

| Code | Exact JSONL gap reason | Count | Generic implication |
|---|---|---:|---|
| G1 | no mechanism: source-supported native payment missing | 52 | The adapter requires a negative native cost on every attempt. Retained instruments, unrelated prices and unquantified fatigue do not support inventing that debit. Review payment policy or an actual supported cost owner before emitting these queries. |
| G2 | no mechanism: physical or capability effect outside query seam | 26 | Some rites change sleep, protection, objects, bodies, progression, location or communication. Preserve those effects through their owners before folding them into a query receipt. |
| G3 | no mechanism: complete ordered query not established | 12 | A preparation, intention, outcome-only citation or recalled result does not establish every ordered stage and supported input/output. More precise source linkage is needed. |
| G4 | not an action: cited paragraph does not support mapped query | 9 | The cited scene passage describes instruction, reasoning, movement or another action. Do not manufacture the mapped query from its step label. |
| G5 | actor not the lead | 1 | Another participant's reported prayer requires that participant's route; it cannot become a lead-owned action. |

Unknown costs were not replaced with coin prices, tool consumption or invented
energy conversions. Explicit charm consumption does occur, but those passages
also require target-state effects outside the query-only seam. No result,
stock, contact predicate, acquisition or canon alternative was fabricated.

## F3: checks and input identity

Temporary reading and validation helpers live under `/tmp`; they are not lane
deliverables. The validator imports the real `defineDivinations` and
`createSimulationRegistry`, validates each row verdict if present, and checks
count, source order, exclusions, uniqueness, overlap, locator retrieval and
JSON safety. There are **zero authored rows to validate**. Empty adapter and
registry success is not evidence that any source query is playable.

| Command | Result | Gaps |
|---|---|---|
| `node /tmp/rw1-validate.mjs` | PASS: 100 verdicts; 246 cited references retrieved; zero duplicate IDs, prior-review overlaps, missing citations, undefined values or empty requires arrays | Adapter row PASS count 0; native command PASS count 0. Empty candidate validates; no source row is admitted. |
| `node --test --test-name-pattern='row validation' tests/cast_divination_adapter.test.js` | PASS, 1 test | Existing focused contract test rejects missing means, unsupported stages/effects and unpaid attempts; no engine, browser or persistence journey run. |
| `node scripts/lane_review.mjs` with exactly both output paths as grants and candidates | PASS: outside-grant=0, source/test candidates=0 | Scope check; its canon-name scanner covers source/tests, not Markdown or private paraphrases. |
| `python3` whole-file JSONL/Markdown whitespace and local Markdown-link check | PASS: 2 files, 3 local links, 100 JSON records | Document check, not gameplay proof. |
| Full suite, build, architecture/rule gates, desktop and save/import | Not run | No runtime, rulebook, UI or persistence changes; combined integration gates belong to the coordinator if later work adds rows. |

Observed shared HEAD: `e7f3d7e77d69efc7dc5fb40ab7b5df53279ba01f`, with unrelated
concurrent changes preserved. SHA-256 input identities:

| Input | SHA-256 |
|---|---|
| Private RW1 JSONL | `433aac28bab6b8ba0175884e0221ad66019c0decd1c0dcbe081ec3dc32fb6c7b` |
| Query adapter | `d243905fe8339c5ea5a121ac70c9c5b7c5f5c9f6d156918b9adacd4639042593` |
| Native registry contracts | `74ea9305ff0f1e455a09cbcb557afbb0578c4dc1dfe7a71c5be7a921a6749158` |
| Live private pack | `abb1eb1ea73226b2be5ba0facfc50de84e3d83f4e1a9fea77a5ea9e6c0db0d6f` |
| Merged source scenes | `27540d66f80aeec3301aab50bc00a297e07ab99e55ade4dabdfc6eb46bc3735b` |

Only RW1.jsonl and this checkpoint were written in the checkout. Existing
source, tests, scripts, private packs, build output and player saves were not
edited by this lane. The remaining content gate is resolving the recorded
source/adapter mismatches before a row can be admitted; there is no new runtime
slice for browser acceptance in this delivery.
