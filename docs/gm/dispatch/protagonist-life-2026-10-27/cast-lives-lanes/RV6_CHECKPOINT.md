# RV6 checkpoint: paragraph review, chapters 4–8

Status: selected range exhausted, private offline candidate reviewed and
adapter/registry-verified; not adopted, gameplay-verified or human-reviewed.
No commit, staging, push, runtime edit, private-pack write or player-save access.
Rules: CLR1–CLR4, CLR6, CLR12; AD36, AD44; sealed-secrets standard.
Authority: [RV6 brief](RV6_BRIEF.md), current PROJECT lead-life direction and
[cast-lives card](../CAST_LIVES_CARD.md). No standing direction changed.

## Probe and scope

| Input | Expected | Observed | Gate |
| --- | --- | --- | --- |
| Steps identified by evidence chapter 4–8 in the specified reviewed mapping | Inventory; brief gives no RV6-specific count | 72 | No |
| Gap steps in that range | Most; review at most first 100 | 52; all 52 reviewed in scene/step order | No |
| Retrievable cited paragraphs for selected steps | Nearly all; stop below half | 52/52 have retrievable bare citations | PASS |
| Source-volume agreement | Semantic review, beyond raw retrieval | 42/52; 10 later-volume shard identities conflict with their bare opening-volume citations | Evidence gaps retained |

The explicit mapping contains ten misbound later-volume steps inside the
chapter-number filter. Their retrieved opening-volume paragraphs were reviewed
and do not support the mapped actions. They are recorded as evidence gaps under
`no mechanism`, with explicit private citation-mismatch details. They do not
establish ten missing mechanics, and none becomes a candidate row. The remaining
42 steps reach the end of the requested opening-volume range. No source ids,
places or people were invented to conceal these discrepancies.

## Outputs and counts

Private directory:
`docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/reviewed-rows-2026-10-29/`.
Everything except this checkpoint stays there.

| File | Purpose |
| --- | --- |
| `RV6.jsonl` | 52 sequentially appended verdicts, exact locators, paraphrases and private gap details |
| `RV6-input.json` | Frozen selection, probe and cited-paragraph review input |
| `RV6-review.mjs` | Private append helpers enforcing sequence and stable step-derived ids |
| `RV6-validate.mjs` | Reproducible per-row adapter, id, JSON, predicate, registry and in-memory merge checks |
| `RV6-validation.json` | Counts, validation receipt and SHA-256 identities for mapping, scenes, pack, adapters, registry, merger and reviewed output |

| Kind | Supported rows | Gaps |
| --- | ---: | ---: |
| Act | 9 | 25 |
| Topic | 3 | 9 |
| Journey | 2 | 3 |
| Wait | 0 | 1 |
| Total | 14 | 38 |

| Gap reason | Count |
| --- | ---: |
| No mechanism, including 10 citation mismatches | 25 |
| Actor not the lead | 7 |
| Unresolved person/place/object | 4 |
| Not an action under the cited sequence | 2 |

Rows use pack ids, one canon choice per topic, explicit unknown fares and
labelled one-minute duration fills where source timing is absent. The fills are
adapter minima, not exact source durations. No wait is assigned a guessed
duration. Knowledge is observer-bound by the adapters; explicit added effects
are paragraph-supported object facts. An observed action is not attributed to
the lead when another character performs it. Two place bindings were corrected
from the encompassing area to the paragraph-supported hall already in the pack.
No new alias was applied. One journey stays within a single resolved place while
crossing its crowd; it claims no new destination.

## Top ten gap subcauses

Ranked generic descriptions for coordinator triage; these are findings and
possible next lanes, not accepted design decisions. Counts are disjoint.

| Rank | Subcause | Count | Implication |
| --- | --- | ---: | --- |
| 1 | Source-volume/citation mismatch | 10 | Repair source bindings before choosing a mechanism; do not count as mechanic coverage |
| 2 | Another character acts outside the lead's seat | 7 | Preserve actor and viewpoint; no lead control inferred |
| 3 | Ritual, supernatural transition, environment change or unbounded ritual wait | 5 | Preserve ordered prerequisites, outputs and perceptions through their actual mechanism |
| 4 | Purchase, tender and change | 4 | Settle money and item quantity/custody together without inventing stock |
| 5 | Missing addressed people and multi-person conversation | 3 | Resolve registry identities into the pack and preserve all participants |
| 6 | Dressing and equipment state | 2 | Bind clothing custody, removal and worn state to consumers |
| 7 | Extraction does not identify a discrete action at this point | 2 | Correct action/order extraction rather than inventing a command |
| 8 | Unresolved ordinary carried object | 1 | Resolve an existing object/custody owner before transfer |
| 9 | Household stash versus carried money | 1 | Preserve transfer and totals across separate custody scopes |
| 10 | Object protection concurrent with movement | 1 | Preserve movement support and held-object custody together |

Other singleton subcauses: language transformation (1), and a decision whose
postponement needs an intention/gating consumer (1). These complete all 38 gaps.

## Checks

Commands run from the repository root. Input identities are frozen in the private
validation receipt. The validation run loads current source directly, with no
prebuilt bundle or synthetic adoption patch.

| Command | Result | Gaps |
| --- | --- | --- |
| Node probe using `shardIndex`/`locatorsOf`, specified mapping and whole-book scenes | PASS: 72 range steps, 52 gaps, 52/52 retrievable; 10 semantic citation mismatches identified | Retrieval alone does not establish source support |
| `node docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/reviewed-rows-2026-10-29/RV6-validate.mjs` | PASS: 52 ordered verdicts, 14/14 row definitions, zero failures; all definitions accepted individually and together by adapters/predicates/registry | Offline content validation, not command execution |
| Same validator, `mergeReviewedRows` against the live pack in memory | PASS: adds 9 acts, 3 topics, 2 journeys; combined 512 acts, 67 topic commands and 524 journeys validate | Does not write or adopt the combined pack |
| `node --check` on `RV6-review.mjs` and `RV6-validate.mjs` | PASS | Syntax only |
| Scoped whitespace check over five private files and this checkpoint; `git diff --check -- <checkpoint>` | PASS | New/ignored files checked directly; unrelated shared-tree changes excluded |
| Build, full test suite, architecture/rule checks, browser, save/import and replay score | Not run | Private content-only lane; no runtime, persistence or rules changed. Coordinator owns ingestion and combined playable evidence |

## Handoff

Owned files are released to the coordinator. The 14 supported rows are candidate
content, not a measured fidelity improvement. The next authoritative gameplay
check is coordinator ingestion followed by a rebuilt fresh-origin desktop replay
on the combined candidate. Human review is optional. Source-mismatched and other
gap verdicts remain gaps for that ingestion; this lane claims no whole-book or
browser coverage increase.
