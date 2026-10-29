# RV9 checkpoint

Status: paragraph review complete for the first 100 mapping gaps in the assigned
volume-one chapter 25–60 range. Private research and adapter/registry validation
only; agent-verified, not human-reviewed. No pack adoption, runtime change,
browser replay, commit, staging or push. Owned paths released to the coordinator.
Rules: CLR1–CLR4, CLR6, CLR9, CLR12; AD36, AD44; sealed-secrets standard.
Authority remains PROJECT.md and the [RV9 brief](RV9_BRIEF.md).

## Probe and outputs

The range contains 187 steps and 153 mapping gaps. All 100 selected steps have
retrievable cited paragraphs, so the CLR2 gate passes. The selected prefix ends
in chapter 44; 53 later gaps remain outside this bounded lane. There is no
step-ID overlap with RV2/RV4/RV6/RV7.

The ladder includes later-volume scenes with unqualified chapter citations.
Selection uses the chapter evidence plus the volume-one shard provenance;
chapter numbers and the ladder's volume field alone would select wrong inputs.
The private probe records the filter and input hashes.

Private directory:
[reviewed rows](../../../../research/novels/lord-of-mysteries/private/lead-run-2026-10-27/reviewed-rows-2026-10-29/).
Owned private files: `RV9.jsonl`, `RV9_probe.mjs`, `RV9_probe.json`,
`RV9_citations.json`, `RV9_review.mjs`, `RV9_validate.mjs`,
`RV9_validation.json`, `RV9_source_review.json`.
Only the private files and this checkpoint were written.

Each verdict was appended during review. The private authoring script records
individual dispositions rather than generating them from lexical families.
Read the cited paragraphs and nearby context to correct inherited action,
actor, place and ordering errors. Ambiguity remains a typed gap.

## Counts

| Verdict / adapter kind | Count |
|---|---:|
| Row: act | 12 |
| Row: topic | 20 |
| Row: journey | 3 |
| Row: standalone wait | 0 |
| All rows | 35 |
| All gaps | 65 |
| All verdicts | 100 |

Two of the act rows use the supported local-wait operation. Topic rows contain
one canon choice each. Unknown journey fares are explicit nulls. Source durations
and approximate or unstated scheduling fills are labelled separately. No stock,
prices, resource grants, relationship deltas or hidden truths were invented.
One service payment uses the paragraph's explicit amount and native purse cost.

| Gap reason | Count |
|---|---:|
| no mechanism | 44 |
| actor not the lead | 17 |
| unresolved person/place/object | 3 |
| not an action | 1 |

Top ten detailed gap categories by count, with first-observed order breaking ties.
These are findings for future lane selection, not accepted build decisions.

| Code | Generic category | Count | Mechanism or correction implied |
|---|---|---:|---|
| G1 | Other actor preparation | 8 | Attribute production to its actual worker; retain a witnessing role separately |
| G2 | Mental practice and perception control | 5 | Bind learned state, activation, practice and costs |
| G3 | Shopping transaction | 4 | Bind seller stock, purse settlement and item output |
| G4 | Ingredient preparation | 3 | Bind real ingredients and outputs rather than a free receipt |
| G5 | Food consumption | 3 | Bind food custody, expenditure and supported consequences |
| G6 | Other actor combat | 3 | Preserve the participant who acts and the lead's actual role |
| G7 | Other actor negotiation | 3 | Preserve who negotiates instead of assigning another actor's agreement to the lead |
| G8 | Ritual crossing | 3 | Bind entry/return context and effects to their existing owners |
| G9 | Firearm practice | 2 | Bind ammunition expenditure, practice and observed results |
| G10 | Sleep and dream state | 2 | Bind sleep, waking, dream context and recovery |

The remaining detailed categories and individual reasons are private. The
private rows also flag two inherited ordering errors for ingest; one rearranges
interleaved actions and one places reading before a later exchange. A final
elapsed-time step is not a wait by the lead at the inherited location.

## Checks

Commands below use `P` for the private directory linked above.

| Command / input | Result | Gaps |
|---|---|---|
| `node "$P/RV9_probe.mjs"` | PASS: 187 range steps, 153 gaps, 100 selected, 100 retrievable | Citation availability is not action fidelity; each disposition was reviewed separately |
| `node "$P/RV9_review.mjs"` | PASS: 100 individually authored verdicts appended; reruns skip existing steps | Authoring record, not runtime execution |
| `node "$P/RV9_validate.mjs"` | PASS: 100 verdicts, 35/35 adapter definitions, JSON round trips, registry validation, reference checks, zero prior-review overlap | Does not prove eligibility, settlement or replay coverage |
| Same validator, in-memory `mergeReviewedRows` | PASS: 20 topics, 3 journeys, 12 acts added; combined totals 84/525/515 validate | No candidate file or live pack written. An intermediate rerun rejected one added metadata string over 200 characters; split into bounded fields and final run passes |
| `node --check` on the three RV9 private scripts | PASS | Syntax only |
| Private script checks checkpoint links, final row digest, counts and unchanged live pack hash | PASS | Scoped artifact checks only |
| `git diff --check -- <checkpoint>` | PASS | Tracked whitespace only; new checkpoint also inspected directly |
| Build, full suite, architecture/rule gates, desktop browser and persistence | Not run | Private-data-only lane; no runtime, registered rule, UI or persistence change |

Final rows SHA-256:
`ce007da832ab3011064bd482eaebdc4391b286a9a50ea180ca782e6f6d5eb506`.
Live pack input SHA-256, unchanged at validation:
`f02cc1fe6b7cce74810b581911005b5a8286050bfa4798c91ebf7ed71c022ced`.
All other input hashes are in `RV9_validation.json`.

Coordinator next gate: inspect source corrections and ordering notes, ingest the
private rows, then measure the combined rebuilt be-seat replay. This lane proves
source-reviewed candidate data and static contracts, not new playable coverage.
