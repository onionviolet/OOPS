# Structured backlog entries beyond idea codes

Status: agent-verified on the adopted desktop Atlas, not human-reviewed.

## Preflight and characterization

The parent measured the 101 named public backlog owners with the coded parser: 423 rows and 39 owners with zero rows. A fresh local measurement reproduced those denominators before editing. This task extends the existing on-demand owner view rather than treating ordinary prose as new ideas. AD6/AD36, AR14 and [UI rules](../../../UI_RULES.md) UR70–UR75 apply. The target is 1366×768; mobile remains deferred.

The actual formats inspected were multiline acceptance bullets in `gm/artifact-collection`, numbered bold-title checks in `gm/audit-absorption`, Gate/Gate family tables in audit and foundation-adoption owners, bold code/status prefixes in P3, unnumbered P4 status bullets, generated feedback finding tables and generated prose-rewrite findings. Empty naming/pacing reports and narrative-only R8/life-experience summaries were checked separately. Their lack of structured entries is not filled with invented tasks.

| Source form | Treatment |
|---|---|
| Acceptance bullets, numbered checks and Gate tables | Preserve the block, wrapped lines and nested continuation; label as a source acceptance check without inferring execution status. |
| Explicit proposal section | Label as a proposal-context entry; no decision or implementation claim. |
| Structured historical/report note | Retain the source context and its report-note label. |
| Generated finding row or prose rewrite item | Label as a reported finding rather than a new feature proposal. |
| Metadata, measured totals, policy definitions, fenced examples and general narrative | Exclude from the new structured-entry forms. Existing coded identities remain intact. |

The established source voice remains visible: “seller/native bag/money/stock must conserve and no revisit replenishes stock.” That is a quoted source check, not a claim that this lane ran it or that an older phase's deferral overrides current direction. Uncoded entries have `code: null`; the UI supplies no invented idea code.

## Measured coverage

| Denominator | Before | After |
|---|---:|---:|
| Same named public backlog owners | 101 | 101 |
| Parsed structured entries | 423 | 1,277 |
| Coded entries | 423 | 430 |
| Uncoded entries | 0 | 847 |
| Owners with zero parsed entries | 39 | 5 |
| Previous exact IDs lost | n/a | 0 of 423 |

Afterward the source-kind breakdown is 340 acceptance checks, 231 unclassified structured backlog entries, 100 proposal-context entries, 603 reported findings and three historical/report notes. These are format/context counts, not counts of open, approved or implemented features. The seven additional coded entries come from existing bold code/status forms, not assigned new codes. The 101 source files stayed byte-identical during this check.

The five zero-entry owners are R8's acceptance status prose, the life-experience acceptance narrative, and the generated names, openings and pacing backlogs. They have no qualifying remaining structure under the bounded formats checked here; the view continues to explain that it does not ingest every sentence.

[Before identities](../../../representations/evidence/atlas-structured-backlogs-2026-11-25/coverage-before.json) and [after identities, kinds and source hashes](../../../representations/evidence/atlas-structured-backlogs-2026-11-25/coverage-after.json) retain the exact denominator and preservation checks. The development measurement reads those 101 public files explicitly; the application still fetches one selected owner's contents on demand.

## Citation compatibility

Uncoded blocks use the existing owner/section/content/occurrence SHA-256 mechanism with a null code. Backlinks, exact lookup, source lines and drift refusal are preserved. All 423 previous IDs survive. One shared `CITED_REFERENCE_LIMIT = 2048` now owns the model's citation validation, form maximum length, parser citation admission and owner lookup bound. Existing shorter references and packet schemas are unchanged. Other 160-character fields such as the runtime-consumer name retain their own bounds.

## Verification

| Command/evidence | Result |
|---|---|
| `node --test tests/atlas_idea_owners.test.js tests/atlas_reading_handoffs.test.js` | 20/20 passed. Includes multiline/nested/numbered blocks, context kinds, metadata/fence exclusion, generated findings, preserved coded references, larger-bound validation and an actual uncoded source entry saved in a removed test fixture. |
| `node prototypes/world-atlas/prove-structured-backlogs.mjs` | Passed, exit 0 at 1366×768. The real artifact owner returns five uncoded multiline acceptance checks. The browser saves one through an isolated temporary `ATLAS_HANDOFFS` queue, verifies immutable exact lookup plus owner/entry reverse citations and the shared form bound. No real queue is written. Zero page errors or horizontal overflow. |
| Syntax/whitespace and `npm run check:docs` | Passed; documentation check reports no new hits. |

[Machine proof](../../../representations/evidence/atlas-structured-backlogs-2026-11-25/proof.json), [uncoded source check](../../../representations/evidence/atlas-structured-backlogs-2026-11-25/uncoded-acceptance-1366.png), [fixture citation](../../../representations/evidence/atlas-structured-backlogs-2026-11-25/fixture-citation-1366.png). The fixture packet was `f89917309a41380a1c54ff0870237fdef0d8a2ce1b902ef6401a288a55105557`; its temporary queue was removed after proof. The adopted snapshot was read as `8a30f74679c0298744a058d1c8637daf87bd8dbc4cc54fb71241c927ad7f9c99`, without regenerating it.

No owner text, runtime, source corpus, real saved proposal, user save, commit or deployment changed. Owned proof processes and fixture directories were removed. The parent owns integrated release gates; Klein's separate report/build evidence hunks were preserved.
