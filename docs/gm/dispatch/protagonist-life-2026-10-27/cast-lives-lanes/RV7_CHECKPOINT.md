# RV7 checkpoint: paragraph-reviewed rows, chapters 9–16

Status: the assigned current gap set is reviewed through the end of the range.
**54 verdicts: 25 rows, 29 gaps.** Offline source and adapter/registry verified,
not human-reviewed. No gameplay, replay improvement or integration is claimed.
Ownership is released to the coordinator; no commit, staging or push.
Rules: CLR1–CLR4, CLR6, CLR12, AD36, AD44; sealed-secret publication boundary.
Authority and scope remain the [brief](RV7_BRIEF.md), current lead-life owners
and existing adapters. No standing direction changed.

## Probe and scope

| Input | Expected | Observed | Result |
|---|---|---|---|
| Opening-volume chapter 9–16 mapping steps | Rough estimate about 500; inventory, not a gate | 59 steps, 54 gaps and 5 existing mappings | Reviewed all 54 current gaps; end of range precedes the 100-step cap |
| Prior review versus current gap set | Re-review prior 54 plus other current gaps, capped at 100 | Exact same 54 IDs; zero additional current gaps | Set equality checked |
| Cited paragraphs retrievable | Nearly all; stop below half | 54/54 target steps have retrievable citations | PASS |
| Review locators and pack IDs | Existing paragraphs and existing registry IDs | All reviewed locator ranges retrievable; all emitted place, person and referenced object IDs resolve | PASS |

Chapter membership comes from scene evidence `第N章` locators, with original
opening-volume shard provenance checked to exclude later-volume unqualified
locator collisions. Target order follows chapter, scene order and step order.
The mapping is the brief's `x1-be-mapping-2026-10-29/chapters-1-24-reviewed.json`.
It remains unchanged. The private probe records input hashes and target citations.

## F1: reviewed result

| Kind | Supported rows | Gaps | Total |
|---|---:|---:|---:|
| act | 12 | 18 | 30 |
| topic | 9 | 6 | 15 |
| journey | 4 | 4 | 8 |
| wait | 0 | 1 | 1 |
| Total | 25 | 29 | 54 |

One supported local wait uses the place-act `wait here` operation and is counted
as an act. Its numeric duration is a labelled approximation of the source's
numeric approximate interval. Other unstated durations use explicit one-minute
scheduling fills. Unknown journey fares remain null; one source-stated fare is
retained. Every topic has one canon choice. Authored effects are knowledge with
basis or source-stated facts; there are no invented stock grants or outcomes.

Gap reasons: **no mechanism 20; actor not the lead 7; unresolved
person/place/object 1; not an action 1**. Actor ownership, dream context and
reported claims remain distinct from waking-world actions and established truth.
The new operations are used where supported; missing stock, clock-display and
sleep-state bindings are retained as gaps rather than manufactured as seeds.
Existing fact custody supports two handling rows without inventing exposure odds.

## F2: ranked remaining classes

These are generic review findings for later lane selection, not accepted build
scope. Categories subdivide the four required gap reasons. Equal-count classes
retain first-encounter order. The private validation receipt lists all 13 classes;
the three omitted one-record classes concern examination effects, distinct local
endpoints, and offered versus performed actions.

| Rank | Class | Count | Mechanism implication |
|---|---|---:|---|
| 1 | Other-actor work | 7 | Keep the other actor's action and schedule ownership; do not add lead controls for it |
| 2 | Ingredient preparation | 5 | Bind actual material stock, recipe stages and resulting outputs to preparation |
| 3 | Clock-display binding | 3 | Supply an existing display producer and supported current reading before checking time |
| 4 | Dream-context actions | 3 | Preserve dream participants and outcomes without relocating or disclosing in the waking world |
| 5 | Reasoning and decisions | 2 | Preserve alternatives, uncertain memory, decision consequences and elapsed order |
| 6 | In-transit conversation | 2 | Keep an occupied vehicle context while dialogue occurs before arrival |
| 7 | Sleep-state binding | 1 | Connect waking to the existing actor sleep-state producer |
| 8 | Departing-group speech | 1 | Preserve recipients, distance and hearing across changing locations |
| 9 | Uncertain wait duration | 1 | Bind a supported interval or completion cue rather than invent an exact minute count |
| 10 | Underspecified conversation | 1 | Obtain source-supported choice and response content before emitting a topic |

## F3: files and ingest boundaries

All source-bearing work is private under
`docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/reviewed-rows-2026-10-29/`:
`RV7.jsonl`, `RV7_probe.mjs`, `RV7_probe.json`, `RV7_citations.json`,
`RV7_review.mjs`, `RV7_validate.mjs`, `RV7_validation.json`, and
`RV7_source_review.json`. This checkpoint is the only public write.
Verdicts were appended during review; subsequent local corrections remain in the
final JSONL and reproducible authoring script. No existing private review was edited.

Ingest must honor the private source corrections and the one documented pair of
reversed inherited steps. Some local acts require a different resolved place from
the inherited scene location. This is reviewed row evidence, not an end-to-end
route: missing approach movement, moving-vehicle dialogue support and the retained
gaps still require integration work. Do not merge contradictory prior verdicts
for the same steps as an additive set; this review supersedes the prior gap set.

## Checks

Commands below run from the repository root. `P` abbreviates the private output
directory above; the exact script paths and hashes are recorded privately.

| Command | Result | Gaps |
|---|---|---|
| `node "$P/RV7_probe.mjs"` | PASS, 59 range steps, 54 gaps, 54/54 cited target availability | Inventory and source retrieval only; provenance excludes later-volume locator collisions |
| `node "$P/RV7_review.mjs"` | PASS, 54 verdicts appended through end of range | Individually authored source review; not runtime execution |
| `node "$P/RV7_validate.mjs"` | PASS, 54 unique ordered verdicts; prior-set equality; 25/25 row adapters and combined registry pass; all locator ranges and references resolve; JSON-safe round trips pass | Initial added ingest check caught four reports over the pack's 200-character limit; shortened and final check passes |
| Same validator: in-memory `mergeReviewedRows` with unchanged live pack | PASS, adds 12 acts, 9 topics, 4 journeys; final 508 acts, 73 topics and 524 journeys validate as a pack and registry | Private candidate in memory only; no pack file written or adopted |
| `node --check` for the three RV7 scripts | PASS | Syntax only |
| Scoped checkpoint links, whitespace and `git diff --check -- <owned paths>` | PASS | Document checks only; ignored private outputs checked directly |
| Runtime build, full suite, architecture/rule checks, browser, persistence and replay | Not run | Offline private content lane; coordinator owns combined runtime adoption and playable verification |

The live private pack and mapping hashes are unchanged from the probe. Input and
output identities are in `RV7_validation.json`. No player save or build output
was touched. Highest state: source-reviewed, adapter/registry and in-memory ingest
verified. Remaining playable gate: coordinator adoption followed by rebuilt desktop
replay of the combined candidate. Human review is optional feedback, not a blocker.
