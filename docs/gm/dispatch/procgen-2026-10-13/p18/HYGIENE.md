# F2-F5: generator hygiene

2026-10-14. **PROPOSAL ONLY.** Extends [root F2-F5](../../../../PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md#f-quality-scale-and-safety).
Reuse [P9 profile rules](../p9/PROFILE_RULES.md), [P7 guidelines](../p7/GUIDELINES.md),
[P5 D8](../p5/D8_LORE_GRAMMAR.md), [P14 history](../p14/HISTORY.md) and
[P15 runtime text](../p15/RUNTIME_TEXT.md). These proposals do not reserve a
new universal save schema or change any current validator.

## F2.1: revision stamps with separate meanings

| Stamp | Meaning / retention |
|---|---|
| `schemaVersion` | Record shape and validation/migration contract; not generator balance |
| `generatorId`, `generatorRevision` | Resolver semantics and algorithm version |
| `tableId`, `tableRevision`, `tableDigest` | Immutable eligible content and weights; digest identifies bytes, not just a mutable label |
| `lawRevision`, `profileRevision` | Per-world admissibility, scaling, retention and local adjective rules |
| `sourceSnapshotRef`, `continuityId`, `eraId`, `overlayRevision` | Canon evidence cutoff and explicit branch differences; no publication-year substitution for fictional era |
| `expressionRevision`, `variantId` | Grammar/template revision for a frozen line; independent of situation/outcome |
| `worldInstanceId`, `causeRef`, `ordinal`, `streamRef` | Scope and draw position of actual commitment; internal draw receipt, not a public seed |
| `recordRevision` | Subsequent transactional state changes to the entity; does not mean regenerated identity |

A proposed stamp object can live in the owning optional generator record or
reference an immutable per-instance manifest. Stamp result, bound actor IDs,
resolved effect/terms snapshot and saved text, not only the seed. Keep public
manifest metadata free of sealed aliases, answer-derived IDs and canon prose.
For original fixtures, use public synthetic refs; direct adaptation data stays
in its project-designated private pack with attribution/source locators.

Shown/SOURCE precedents: `simulation.js:56,398-400` retains definition revisions;
`simulation_resolution.js:9-25` freezes spawn/situation definitions;
`causal_story_ids.js:2-5` separates schema/definition versions;
`causal_story_native.js:133-141,421-440` validates native owner revisions.
P4 branch `generated_people.js:22-34` retains generated names/grammar revision,
but its schema references current template membership. P3 branch deck receipts
do not contain a complete generator/table revision tuple. Inferred: stamps and
supported old resolvers must be designed together; adding metadata alone does
not make a content update compatible.

## F2.2: update and missing-content matrix

| Saved state | Proposed handling |
|---|---|
| Old save without new optional generator | Remain absent, no retroactive generated people/history or enrollment; selected opt-in begins at current clock |
| Existing resolved entity/text | Keep exact identity, effects and original line; newer grammar/table changes future permitted commitments only |
| Pending supported occurrence | Complete with frozen response/effect/terms and retained resolver law. Never reinterpret from the newest table |
| Existing instance starts new content | Prefer pinned manifest by default. An explicitly reviewed compatible additive update can change future generation at a stamped activation boundary; do not reset RNG, cooldowns or history |
| Unknown/future schema or incompatible resolver | Reject before mutation, or use an already selected supported dormant policy. Never execute a guessed fallback |
| Missing optional pack with no executable commitment | Preserve opaque owner plus safe frozen display where existing dormant infrastructure supports it; do not synthesize new stock/persons |
| Missing pack with live obligations | Pause/dormant through a supported owner or reject loading/import before writes. Frozen text does not authorize unsupported mechanical settlement |
| Canon/source contradiction discovered | Retain original claim, basis and snapshot; record contradiction and a reviewed correction for future content. Existing branch changes only via explicit migration/overlay policy |

Future migration must name old/new versions, affected fields, exact preservation
queries, frozen commitments, activation time and supported rollback/export route.
Stage in a detached envelope, validate all owner/native refs, size-check, persist,
then publish. Failed migration changes neither native stock nor RNG. Do not stamp
old provenance as known when it is absent: use `legacyUnspecified`, keeping old
behavior. Retain sufficient old data/resolver code or an explicit conversion;
a stamp pointing to removed code is not compatibility.

Root owns shared registration/save changes. Strict exact-key validators such as
`causal_story_core.js:184-189` cannot accept arbitrary added stamps. Their owner
needs a selected schema change, or a reviewed enclosing manifest join; P18 grants
no permission to patch those records. Keep P1 stream integration and P3/P4 old
saved outputs intact rather than regenerating them on migration.

## F3.1: history has different jobs

Shown/SOURCE:

| Store / locator | Current behavior | Safe inference |
|---|---|---|
| `simulation.js:35,405-407` | Log last 100; terminal occurrence window last 100 | Display windows cannot provide complete long-run metrics or future causal history |
| `simulation_effects.js:287-292` | Relationship memories last 32, per-cause dedup in `s.causes` | Pruning prose does not prune settlement identity; cause-map growth needs separate measurement |
| `event_feed.js:102` | News window eight | Zero visible news is not zero generated events |
| `life_record.js:1,15,32-58` | Lossy biography, 64 recent/200 yearly; count folding, first four distinct highlights | Counts survive; exact outcomes/participants generally do not. Never drive quests/rewards from it |
| `world_visit_history.js:6-58,63-69` | Validate/reconcile all instance clocks, pin references, active/mission visits, first two and latest per group; detached preview | Existing reference-aware compaction precedent, not generic history pruning |
| `causal_story_core.js:282-298`; `causal_story_ids.js:13` | Strict capacity with closure/recovery reserve; no causal receipt pruning | Do not replace this behavior with a generic lossy summary |
| P3 `storylet_deck.js:65-71,89` | Twenty recent receipts; card cooldown/seen map limited to 400 | Instrument before pruning; a bound check can eventually reject new card IDs, not compact them automatically |

Proposal: classify data as **executable authority**, **typed history used by
queries**, **public display**, and **QA telemetry**. P12 A6 threads and D8/P14
fact/account owners remain canonical. No fifth narrative store here. Telemetry
may live outside the save as compact test aggregates; it cannot become the
game's memory or leak private detail in reports.

## F3.2: pin, summarize, validate, publish

Proposed compaction protocol at explicit safe boundaries:

1. **F3.C1** Validate the entire original owner before removing anything, then
   reconcile instance/branch calendars through their actual owners. Never hide
   corruption by deleting the damaged row.
2. **F3.C2** Compute transitive required references: open threads/payoffs,
   reservations, custody, source acquisition, current identity/aliases,
   evidence/knowledge bases, live relationship queries, canon anchors/overrides,
   dedup claims and loop-retained memories. Ask each owning consumer to declare
   reads/pins. Preserve the minimal closure needed for those queries.
3. **F3.C3** Fold only unpinned terminal detail into typed sufficient summaries
   plus optional safe text. Preserve query dimensions actually read: count,
   latest time/outcome, participant-specific count, revision partition and
   resolution class. A count summary cannot serve a consumer asking for exact
   cast or receipt. Keep ID→retained-record/typed-tombstone resolution where
   allowed; do not invent prior witnessed knowledge.
4. **F3.C4** Run full validation and before/after declared-query parity, future
   callback selection, next-draw equality, duplicate-settlement rejection and
   explanation projection. Stage native envelope size then persist/publish
   atomically. Compaction is deterministic, RNG-free and idempotent.
5. **F3.C5** At all-pinned capacity, retain live commitments and recovery space;
   stop optional texture admission with a neutral storage message. Keep ordinary
   play/recovery reachable where supported. If required history must grow, offer
   a selected larger storage/export/archive route. Never silently delete a branch
   or erase a debt, cause or known person. Player archive/delete is a distinct
   explicit action, not automatic compaction authorization.

These are implementation steps, not runtime methods. A future query manifest
could declare `count(type,world,actor)`, `latestOutcome`, `exactEvidence(ref)`
and `settled(causeRef)`, with preservation tests for each. Unregistered prose
searches are not valid consumers. P14 can generate an annual synopsis from safe
retained claims, but it must not be asked to reconstruct authority from a
sentence. Do not turn E6's provisional 96 facts/25 legend years into universal
world limits. Measure [M9](METRICS.md#f1m9-save-growth-per-game-year-f3).

Existing visit compaction scans strings and keys throughout state. Storing
cosmetic telemetry against every visit may pin them all. Give optional display
refs a documented soft-reference representation only after the visit owner
accepts its schema; never erase an existing hard ref by relabelling it locally.

## F4: leak scans

Reuse P15's authoring/text pipeline, P7's reservation catalog and the
[sealed-secret owner](../../../../worlds/WORLD_SECRETS_AND_DISCOVERY.md).
This lane supplies gates and orchestration, not another content-authoring system.

| Stage | Proposed check | Public output |
|---|---|---|
| Author lint | Declared claim/basis/source locator, supported world/era, approved original bindings, no hidden field interpolation; validate template/control flow and reserved aliases | Rule IDs, affected synthetic content IDs and status |
| Private exact-secret scan | Against locally held sealed truth/alias/candidate fixtures; scan text, accessibility labels, HTML/attributes, diagnostics, exportable summaries and errors before discovery | Secret ID, route state, surface ID, pass/fail; never matched bytes, truth, answer-derived hash or candidate count |
| Behavioral noninterference | Paired undiscovered states varying only a secret's truth; compare public projections, sorting/filtering, prices, action labels, trait counts and refusal reasons | ID-only differences and declared permitted clue-route status |
| Canon prose overlap | Normalize token/Unicode variants and compare generated text/templates to privately read source corpus; flag exact sequences of eight tokens or 40 normalized characters, plus distinctive shorter matches and suspicious near-copy syntax | Corpus/locator reference IDs, output synthetic IDs, review status; private diagnostic spans only |
| Post-discovery | Verify disclosure only through the chosen route and to the authorized observer; still enforce canon prose and source attribution | Route/status, no public secret truth |

Token/character thresholds are proposed conservative triage triggers, not
copyright rules or proof of originality. Credit work/author and preserve
edition/chapter/scene or claim locators. Short commonplace phrases, permitted
names and intentional bounded attribution need a reviewed allowlist with reason
and locator; no blanket whitelist of an entire book/template. Exact matching
misses paraphrased secrets; fuzzy matching can flag unrelated prose. Include
manual semantic review of risky templates and indirect outcomes. Report coverage
cells and scan limitations. No scan certifies every generated possibility.

Novel files/private analytical notes may be read locally for comparison, never
quoted into tests, reports or errors, never modified. Build source fingerprints
in memory or the selected private test area, not public artifacts. Sealed tests
must not print assertion operands/snapshots/stack locals carrying truth. Hashes
of small answer spaces can be reversed; publish only opaque IDs and status.
Private fixture output remains local and outside git under existing project
rules. This P18 packet creates no private corpus or secret fixtures.

Noninterference applies before an allowed clue route: a valid clue may differ
across truths according to its sealed route contract. Compare projection fields
outside those declared clue surfaces, and have a sealed reviewer validate clue
fairness/solvability privately. Do not assert identical entire gameplay when a
secret legitimately affects physics. Public franchise twists are not sealed,
but spoiler settings and actor knowledge still apply separately (root C2).

If a runtime LLM is later selected, run these checks on the semantic input and
candidate output before freezing/publishing. Reject/neutral fallback through
P15's same committed situation, without another gameplay draw or invented
effect. Log adapter/model/prompt revision and safety verdict privately. Cache
the approved line; browser display never calls the model again. Template-only,
offline authoring, optional LLM and player-authored text remain distinct
reachable options, not a forced pipeline choice.

## F5.1: repetition memory without permanent exclusion

P3 branch `storylet_deck.js:37-39` uses lifetime `seen` decay with floor 0.1,
last-family damping and miss pity. That is a source fact, not the proposed
recent-window memory. New per-instance memory can keep a last-64 semantic event
ring, decayed family/phrasing counts for 30 played days and per-role cast reuse
timestamps. Bounds/windows are first-fixture proposals, selected per world.
Store semantic IDs and revisions, no repeated full text or hidden aliases.

Before a future draw: hard world/means prerequisites first, then soft variety
weights. For a legal candidate, a possible factor is
`max(profile.floor, exp(-lambdaFamily*nFamily - lambdaPhrase*nPhrase))`, where
counts decay with played time. Cast continuity has a separately selected
factor: a family continuation can prefer the same actor while a fresh subplot
can prefer someone else. Family/phrase/cast dampers cannot hard-ban a possible
route, alter pending cards, substitute an unsupported actor or consume a second
draw. Original occurrence identity still protects a settlement from duplication.

Record `lastShown` only when the observer learns a committed event/utterance,
not on every render; separate internal committed occurrence counts from
player-exposure memory. Update each by stable occurrence/utterance ID exactly
once. Preserve saved memory on reload/import; preview, failed writes and panel
opens do not age/reduce it. Revision changes preserve semantic-family continuity
where compatible instead of resetting every repeat count. Fictional loop reset
can erase local memory under P13/P16 law while retained player knowledge uses a
separate explicitly declared carrier. Loading a file never resets either.

Gate: hundreds of hours with a small deck still allow old families and actors
to return; new funded jobs remain possible; explaining/rendering does not change
the next draw; combined repeats improve without destroying recurring-cast
payoffs. [M2](METRICS.md#f1m2-repetition-by-family-phrasing-and-cast-f5) supplies
exposure-aware measures rather than a cosmetic unique-word score.
