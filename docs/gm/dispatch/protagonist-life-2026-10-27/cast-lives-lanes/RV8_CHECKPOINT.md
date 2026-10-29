# RV8 checkpoint

Status: completed the specified mapping shard through its end; private paragraph review and adapter/registry validation PASS, agent-verified, not human-reviewed. No pack adoption, runtime change, browser replay claim or commit.

Rules: CLR1, CLR2, CLR3, CLR4, CLR6, CLR12; AD36, AD44. Authority: [RV8 brief](RV8_BRIEF.md), current PROJECT lead-life direction and the cast-lives card. Existing mechanism seams: topic talk, journeys and place acts, including H2 operations. Public checkpoint contains generic descriptions; all source content and authored rows remain private.

## Ownership and inputs

Only `RV8*` files under `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/reviewed-rows-2026-10-29/` and this checkpoint were written. No other lane files, shared owners, live pack, saves, source mechanisms or build outputs were changed. Ownership is released to the coordinator.

Input mapping: `x1-be-mapping-2026-10-29/chapters-1-24-reviewed.json`, SHA-256 `d308032ac646af4c8418e231bbf9c1e2614cce8bceab5d900bed1915a775ca30`. Source scenes: M4 merged scenes, SHA-256 `27540d66f80aeec3301aab50bc00a297e07ab99e55ade4dabdfc6eb46bc3735b`. Live pack: SHA-256 `f02cc1fe6b7cce74810b581911005b5a8286050bfa4798c91ebf7ed71c022ced`, unchanged at final validation. Private probe records these identities.

## Probe and result

| Input or result | Count | Gate / meaning |
| --- | ---: | --- |
| Chapters 17-24, opening-volume steps in specified mapping | 23 | Non-gate; substantially below the brief's approximate historical shard count |
| Existing mapping gaps | 18 | All reviewed in source scene order; 100-step cap not reached because range ends |
| Selected steps with retrievable citations | 18/18 | CLR2 gate PASS; expanded supporting paragraphs also checked |
| Authored rows | 8 | 3 acts, 4 topics, 1 journey, 0 waits |
| Remaining gaps | 10 | 9 no mechanism; 1 actor not the lead; 0 unresolved identity; 0 not an action |
| Adapter and registry definitions validated | 8/8 | PASS, no failed rows |

Chapter selection uses `第N章` in scene evidence and opening-volume shard identity, excluding later volumes with the same chapter numbers. Existing mapped controls are outside this review. Source paragraphs and neighbouring context were read before writing each disposition. Incorrect inherited places and off-seat knowledge were corrected where source-supported. Each verdict was appended individually; later pack-schema fitting changed only authored row payloads and retained full private review paraphrases.

Display text respects the pack's 200-character string bound; detailed supported knowledge uses separate attributed effects. Topic rows have one canon choice. Durations without source support are explicitly labelled scheduling fills. No stock, prices, skill gains or unobserved outcomes were invented. Identified cash and equipment transactions remain gaps where a receipt would lose their actual effects.

## Ranked gap mechanisms

There are nine distinct categories across ten gaps, so this is the complete top list rather than ten padded entries. Counts describe this shard, not whole-book prevalence.

| Code | Count | Generic mechanism implied |
| --- | ---: | --- |
| G1 | 2 | Multiple interlocutors: preserve each participant, intended audience and response order |
| G2 | 1 | Staged wait and movement: local timed waiting followed by travel and intermediate exchanges |
| G3 | 1 | Other-actor authorisation: document creation belongs to its actual actor |
| G4 | 1 | Advance and repayment: real purse inflow coupled to repayment obligations |
| G5 | 1 | Supply issue and equipment: quantities, custody, equipment state and issue records |
| G6 | 1 | Purchase and change: durable goods, actual payment, denominations and bargaining response |
| G7 | 1 | Firearm loading: round types, chamber occupancy, reserves and safety state |
| G8 | 1 | Training and fatigue: repeated practice, rests and a time-window finish |
| G9 | 1 | Household transfer and errand: recipient funds and custody, shopping instructions and uncertain remaining change |

These are findings for coordinator lane selection, not accepted new design or implementation scope.

## Files and checks

Private files: `RV8.jsonl`, `RV8_probe.mjs`, `RV8_probe.json`, `RV8_citations.json`, `RV8_review.mjs`, `RV8_pack_fit.mjs`, `RV8_validate.mjs`, `RV8_validation.json`. All are in the private review directory named above. `RV8_review.mjs` appends once and refuses duplicate steps; `RV8_pack_fit.mjs` applies the pack-schema correction to those records. Final JSONL SHA-256: `d424980e97daebea6fe88b9765d08ecdf2d9482cc7f65ceb4b53fc9cd648e998`.

Commands below use the private review directory as the path prefix; scripts are executed from the repository root.

| Command | Result | Gaps |
| --- | --- | --- |
| `node <private-review-dir>/RV8_probe.mjs` | PASS: 23 steps, 18 gaps, 18 selected and retrievable | Citation retrieval is not semantic review; completed separately |
| `node <private-review-dir>/RV8_review.mjs` | PASS: 18 individually appended verdicts, end of range | Private offline review only |
| `node <private-review-dir>/RV8_pack_fit.mjs` | PASS: all 8 rows fit string limits | Corrected the first merge rejection; review notes stay outside pack payloads |
| `node <private-review-dir>/RV8_validate.mjs` | Final PASS: 18 ordered unique dispositions, 18 expanded citation records, 8 adapter/registry definitions, zero failures | Earlier runs caught oversized strings and missing knowledge attribution context; both fixed |
| `mergeReviewedRows` inside validation | PASS: in-memory merge adds 3 acts, 4 topics and 1 journey; combined pack validates 506 acts, 68 topics and 523 journeys | No pack written or adopted; combined runtime behavior remains coordinator work |

No full suite, build, browser or persistence checks were run for this private content-only lane. Remaining acceptance: coordinator ingests the reviewed rows and measures rebuilt desktop replay through the existing integration gates. This lane establishes source review and schema/registry validity, not improved replay fidelity or playable completion.
