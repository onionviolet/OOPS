# K4 extensions: desktop card editor with live lint

2026-10-14. **PROPOSAL ONLY.** This is a new story-card authoring surface, not a claim that current editors support stories. Reuse [P15 A2-A6](../p15/AUTHORING_PIPELINE.md), [K3](CONTENT_PACKS.md) and [K1](DIRECTOR_MODE.md). [E2](../../../../emergent/E2_STORYLETS.md#3-card-schema-final-proposal) is an older drafting schema; integrate the actual delivered P3 contract rather than assuming every draft field exists.

## K4.1: existing source and boundaries

| Shown/SOURCE locator | Existing capability | P22 extension |
|---|---|---|
| `src/authored_site.js:1-4,17-32,60-99` | Field-bounded original gather/work-site draft and schema-1 compiler | Reuse normalization/structured diagnostics. It never lists existing content or validates arbitrary story cards. |
| `src/authored_site_ui.js:29-52,61-81` | Dirty draft, explicit Apply, local import/export and canWrite guards; input refresh does not run complete live lint | Reuse staged import/export and preserve unapplied draft. Add live diagnostics and a safe player preview. |
| `src/authored_site.js:119-134` | Applied site draft belongs to a life; reset removes its local state and provenance | Card-editor drafts belong to authoring/test storage. Do not copy destructive reset semantics onto accepted story instances. |
| `src/work_ledger_author_ui.js:7-17`; `src/work_ledger_system.js:25-36,68` | JSON edit/import/export, stale revision checks and frozen accepted commission terms | Reuse revision-aware draft conflicts. Work Ledger functions are their own bounded owner. |
| `src/simulation_contracts.js:30-38,47-82,195-212` | Predicate/effect/reference validation and selected cycle checks | Necessary static lint substrate. It does not prove reachability, fair choices, truthful text, funding or secrecy. |

## K4.2: draft-to-play interaction

Inside the disposable director session: choose a public original card → **Copy to draft** → edit cause, cast, requirements, choices, effects, recurrence, tone and text slots → inspect live lint → preview known player card → **Try in test fork** → export candidate pack for P15 review. Copy retains `derivedFrom` and creates a draft identity, never overwrites the original. Private source-card bodies and sealed outcomes are not shown in a generic editor. A source-qualified private authoring route can expose permitted material within its policy; still no secret truth without scoped unsealing.

At 1366x768, left column holds card outline and field navigation, center holds form/optional JSON and safe player preview, right holds diagnostics/route witnesses. Controls stay visible above scrollable content. At 1600x1000 show choice/effect comparisons side by side. Live lint should run on input after a short debounce and stamp draft revision plus dependency-lock fingerprint. Stale asynchronous results are ignored. Keystrokes, preview, search and lint never mutate gameplay or consume RNG. A user can keep/export an invalid draft; only trying/admitting it needs valid required gates.

Offer a form for supported fields and an advanced JSON view of the same inert intermediate format. No arbitrary JS, eval, embedded script, network URL fetch or secret-state console. Unsupported fields become an explicit engine-gap diagnostic, not a silently discarded property. The proposed recurrence field selects local conditions/adjectives or references an authored unique-source rule. It does not offer a universal once anti-abuse checkbox.

## K4.3: live diagnostics as a P15 client

| Code | Diagnostic | Severity / proof boundary |
|---|---|---|
| L22.1 Shape and references | IDs, revisions, allowed opcodes, predicates, slot bindings, registered world/people/site/effect references | Error blocks test admission. Reuse actual validators. |
| L22.2 Cause and writers | Every requirement has an owner/writer, every claimed result a supported effect/consumer; flag contradictory prerequisites and self-unlocking loops | Error for a demonstrated contradiction; unknown for an unresolved adapter. A fact name existing somewhere does not prove an attainable state. |
| L22.3 Means and settlement | Real payer/input/custody, present qualified cast, affordable/assisted alternatives, expiry/cancel/refund behavior and per-occurrence settlement | Controlled resolver witness required. Preview does not invent free stock to make a card green. |
| L22.4 Reachability | Positive legitimate acquisition trace and negative/missing-input witness; completion/refusal/wait and supported alternate means | Show **witness found**, **impossible under declared model**, or **unknown**. Random sampling that finds none is not proof of impossibility. P18 owns search/coverage. |
| L22.5 Text and knowledge | Claimed quantities/people/effects agree with frozen terms; observer knows slots; hidden names/traits and secret-derived branches do not affect public previews | P15 QA7/QA10, plus private reviewer. Keyword scan alone cannot certify secrecy. |
| L22.6 Source/continuity | Per-claim locator, SHOWN/STATED/INFERRED/UNKNOWN, source quality, AU delta and unresolved contradictions | Essential unresolved canon rule blocks canon-labelled admission. Original fill and explicit AU remain separate candidates. |
| L22.7 Lifecycle | Frozen responses/grammar/revisions, next draws, old/missing pack, failed save and changed dependency state | Source fixtures first, rebuilt literal import later. No compile-time green badge claiming native proof. |
| L22.8 Readability and repetition | Overflow, slot worst cases, similar cards, decision load, long explanations | Warning and human review. A repeated genre word is not automatically bad content. |

Display errors, warnings and unknowns separately. Each diagnostic includes safe code, field path, current draft revision, owner link, why it matters and a suggested repair. For sealed dependencies, show ID/status and request a private validation route. Do not display the violating hidden string or expand private predicate values. Scanners run locally over permitted inputs; no raw private source upload.

## K4.4: atomic test apply, revisions and escape routes

**Try in test fork** compiles the draft and exact dependency closure, creates a new K1 test checkpoint, registers the candidate only in that fork, then runs actual supported admission. Recheck revisions immediately before apply. Dirty original or sibling draft edits remain preserved. A failed compile/write leaves prior fixture, candidate and RNG unchanged. Editing text while an occurrence is open creates a new candidate revision; it does not change frozen choices/terms in the existing occurrence.

Undo/redo operates on draft revisions. A timeline rewind uses K1 checkpoints and is labelled separately. **Export draft**, **Export candidate pack** and **Export feedback** are separate formats, none is a gameplay save. Import stages a local draft for review and never auto-installs it. K2 acceptance records can later identify exactly which entries and hashes were accepted. There is no “Publish” action or implicit commit.

Optional later route: let normal-play users author original cards in a detached editor, then install compatible content through K3 after review. That is a separate selected scope and need not expose director force tools or private-save access. Preserve P16's player-authored-story option, P6's in-world manuscript creation and P11's library/teaching consumers as distinct routes; a card authoring editor does not grant the character author powers or in-world knowledge.

Future gate, all NOT RUN: create a card with an unknown prerequisite → see unknown/error at its field → repair it using an existing writer → demonstrate a real consequence in a disposable fork → export/import the same inert draft → preserve an old pending occurrence after revision → reject malformed/secret-bearing/stale content without mutation. Rebuilt desktop evidence and human editor usability acceptance remain separate.
