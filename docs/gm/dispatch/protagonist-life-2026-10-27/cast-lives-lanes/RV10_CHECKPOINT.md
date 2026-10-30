# RV10 checkpoint: paragraph-reviewed shard

Status: completed the first 100 gap steps in scene order within volume 1,
chapters 61–100. Private content candidate, adapter/registry-verified,
not ingested or browser-verified, not human-reviewed. Ownership released to the
coordinator. No commit, staging, pack write or player-save access.

Authority: [RV10 brief](RV10_BRIEF.md), PROJECT's lead-first forced-canon direction;
CLR1–CLR4, CLR6, CLR12, AD36, AD44 and sealed-secret publication boundaries.
This is an offline paragraph-review lane, not a runtime implementation or replay
coverage claim. Existing runtime, shared documents and concurrent edits were
left untouched.

## Probe and inputs

| Input | Expectation | Observed | Gate |
| --- | --- | --- | --- |
| Range steps | Inventory; brief's approximate counts are nonbinding | 210 | None |
| Range gaps | Most steps | 157 | None |
| Selected gaps | First 100 in scene order | 100, chapters 61–84 | PASS |
| Retrievable selected citations | Nearly all; stop below half | 100/100 | PASS |

Selection uses chapter numbers in scene evidence plus the original volume-one
shard identities. Later-volume scenes with unqualified chapter citations are
excluded. The copied probe initially omitted the third extraction wave; this
was corrected before completing the selection. Range counts above use the
corrected probe. The first 100 selected IDs are preserved in the private citation
snapshot, and the validator checks output order against that snapshot. Live
mapping files changed concurrently; no broader mapping repair was attempted.

Frozen probe SHA-256 identities:

| Input | SHA-256 |
| --- | --- |
| Ladder mapping | `a490620216da1bccfe90e3f0ab58d8c9d3e3b079e8083e145eb37314ad2aad7f` |
| Merged scenes | `27540d66f80aeec3301aab50bc00a297e07ab99e55ade4dabdfc6eb46bc3735b` |
| Live pack, also unchanged at validation | `f02cc1fe6b7cce74810b581911005b5a8286050bfa4798c91ebf7ed71c022ced` |
| Reviewed JSONL | `823ec967c12d4c2efca88cfc2f2c28dbe141f006a8ebbff9b3fd22da785736a8` |

Private publication only: [output folder](../../../../research/novels/lord-of-mysteries/private/lead-run-2026-10-27/reviewed-rows-2026-10-29/).
Owned private files: `RV10.jsonl`, `RV10_probe.mjs`, `RV10_probe.json`,
`RV10_citations.json`, `RV10_review.mjs`, `RV10_validate.mjs`,
`RV10_validation.json`. The only public output is this checkpoint.

## Dispositions

| Verdict / row kind | Count |
| --- | ---: |
| Row: act | 6 |
| Row: topic | 1 |
| Row: journey | 1 |
| Row: wait | 0 |
| Gap | 92 |
| Total | 100 |

| Exact gap reason | Count |
| --- | ---: |
| not an action | 48 |
| no mechanism | 23 |
| actor not the lead | 19 |
| unresolved person/place/object | 2 |

Here, “not an action” means the supplied paragraph does not establish the
particular step, even when it contains a different action. Each private verdict
explains that distinction. Other actors' actions are gaps; supported lead
observations can use the explicit observation exception. New operations were
considered, but no receipt substitutes for a purchase, practice result, ritual,
combat action, custody transfer or unbounded wait. All authored durations are
explicitly labelled one-minute fills, not claimed source times. Unknown fare
is `null`. One topic has one canon choice. Effects remain existing observation
receipts without invented stock, relationship deltas or outcomes.

## Top ten gap clusters for next-lane choice

These are a generic, nonoverlapping subdivision of the exact reasons above;
they propose investigation and do not authorize a new lane.

| Code | Count | Finding and implied work |
| --- | ---: | --- |
| F1 | 48 | Citation/action mismatch: repair paragraph anchoring before selecting a mechanism. |
| F2 | 19 | Other actor: preserve actor attribution; later scheduling belongs to that actor's life. |
| F3 | 5 | Exchange or consumption: bind owned stock, exact consideration and custody before settlement. |
| F4 | 5 | Ritual or remote effect: bind prerequisites, information transfer and stated results to their mechanism. |
| F5 | 4 | Combat or weapon readiness: preserve ammunition, intent, positioning and conflict settlement. |
| F6 | 3 | Group conversation: retain every listener rather than reducing a group to one target. |
| F7 | 2 | Study or practice: retain learning activity and its supported output rather than a receipt-only substitute. |
| F8 | 2 | Place or participant resolution: reconcile the cited location and add no guessed endpoint. |
| F9 | 1 | Budget reasoning: model priorities without inventing a purchase or allocation. |
| F10 | 1 | Tracking: preserve the tracking cause and intermediate movement rather than just arrival. |

Two remaining singleton clusters are a wait without a numeric/event-bound
completion and a gift without established object transfer. These account for
all 92 gaps. Detailed evidence remains private.

## Checks

Commands below use private folder abbreviation `P` for the linked output folder.

| Command / input | Result | Gaps |
| --- | --- | --- |
| `node $P/RV10_probe.mjs` | PASS: corrected range 210 steps, 157 gaps; first 100 selected; all citations retrievable | Live mapping is concurrent; frozen snapshot identifies this lane's input |
| `node $P/RV10_review.mjs` | PASS: appends one verdict per selected step, in order; 100 JSONL lines | Explicit paragraph decisions; no pack adoption |
| `node $P/RV10_validate.mjs` | PASS: 100 unique ordered verdicts, 8/8 adapter definitions, JSON safety, locator availability, real pack IDs and simulation registry | Offline validation, no command execution |
| Same validator, in-memory `mergeReviewedRows` | PASS: adds 6 acts, 1 topic, 1 journey; combined pack validates at 509 acts, 65 topics, 523 journeys | No merged candidate written; reviewed observation supersedes one generated act |
| `node --check` on the three private scripts | PASS, 3/3 | Syntax only |
| Python checkpoint link/whitespace check and `node scripts/lane_review.mjs` with eight exact grants and paths | PASS: links exist, no trailing whitespace or source-language text; 0 outside-grant paths | Static only; lane scanner scans no source/test files here; public checkpoint manually reviewed for generic wording |
| Build, full tests, desktop replay, Save/Export/Import | Not run | No runtime or persistence change; coordinator adoption and combined gameplay proof remain |

The remaining acceptance gate is coordinator ingestion followed by replay on a
rebuilt combined candidate. These eight rows establish no new browser coverage
score. The remaining 57 range gaps are outside this lane's first-100 cap.
