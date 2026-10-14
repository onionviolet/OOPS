# P14: receipts, retention and storage

2026-10-14. **PROPOSAL ONLY.** Logical shapes below are design contracts, not existing APIs, selected migrations or reserved numeric schemas. Extend the optional D8 history owner after root binds actual integrated interfaces. Keep existing domain ledgers authoritative for stock, health, relationships, debt, knowledge, world clocks and claims. History references those outcomes; it does not maintain shadow balances.

## K1: minimum typed records

All refs are world/instance/branch-qualified where meaningful, with stable IDs independent of display names. `null`, unsupported, unknown and zero are different values. Arrays below are logical bounded sets with deterministic ordering. Optional fields are retained only when a selected consumer needs them.

```text
HistoryScope
  worldDefinitionRef, continuityId, instanceId, branchId?, eraRef,
  sourceSnapshotRef?, sourceHorizon?, overlayRefs[], lawRevision,
  generatorRevision, calendarBindingRef, coverageIntervals[]

HistoricalReceipt
  id, scopeRef, origin: authored | generatedBackground | lived,
  producer: {ownerRef, ownerRevision, definitionRef, definitionRevision},
  operationKey: {causeRef, ordinal, resultKind}, sequence?,
  time: {clockDomainRef, localAtOrInterval, committedAt, calendarAnchorRef},
  actorRefs[], roleBindings, placeRefs[], objectRefs[],
  requiresRefs[], causeRefs[], outcomeCode,
  consequenceRefs[], retainedOutcomeValues, provenanceRef,
  disclosurePolicyRef, audienceEvidenceRefs[], drawReceiptRef?

Account
  id, scopeRef, subjectRefs[], authorRef, creditedAuthorRef?, sponsorRef?,
  composedAt, evidenceRefs[], parentAccountRefs[], claimRefs[],
  intentRef?, genreRef, languageRef, intendedAudiencePolicyRef,
  transformationRefs[], revision, rendererRevision,
  frozenText, permittedBindings, drawReceiptRef?

Claim
  id, scopeRef, speakerRef, assertedAt, subjectRefs[],
  proposition: {predicate, arguments, value, qualifier, claimedTime},
  basisRefs[], sourceLineageRefs[], relationToPriorClaimRefs[],
  internalAssessmentRef?, disclosurePolicyRef

BeliefEpisode
  id, observerRef, claimRef, receivedByMessageRef?, learnedAt,
  stance: accepted | tentative | rejected | disputed,
  confidenceClass, personalInterpretationRef?,
  supersedesRef?, correctionEvidenceRefs[]

ChronicleEdition
  id, scopeRefs[], lifeRefs[], observerRef, interval,
  coverageRef, selectedReceiptRefs[], selectedClaimRefs[],
  sentenceBindings[], rendererRevision, frozenText,
  acknowledgedThroughSequence?, createdAt

LegacyTrace
  id, originScopeRef, originLifeRef, originActorRef,
  survivingObjectOrPersonOrRecordRef, consequenceRef,
  retentionPolicyRef, destinationScopeRef?, crossingReceiptRef?,
  disclosurePolicyRef
```

`retainedOutcomeValues` contains the minimum **actual applied** result needed to explain the event after its producer's display window expires, such as supported outcome, exact object identity and relevant transfer quantity, or who contributed and who received. A frozen effects array is an intention, not proof it executed. Outcomes must be staged after real resolver effects and before publication. If domain interpretation requires an evolving policy, retain its revision and necessary values. Never guess applied deltas from a command label or completion counter.

An event ID can explain multiple outcomes; an operation key distinguishes them. Repeat delivery of the same producer/cause/ordinal/result maps to the same history receipt without reapplying effects. A genuinely new repair, shipment, performance or loan can get a new cause indefinitely under local rules. This is idempotency, not a lifetime once limit.

**Original abbreviated example:** receipt `demo.repair.17` identifies a lived joint repair, actor roles `supplier`, `maker` and `organizer`, exact tool/site refs, a timber-transfer consequence and the completed repair consequence. Claim `demo.claim.2` asserts only the traveler did the work, based on an earlier account. A belief episode records one listener tentatively accepting it. The claim does not modify the joint-repair receipt, craftsperson's credit or tool custody. These names are synthetic fixtures, not current APIs or sealed IDs.

## K2: joins and authority boundaries

| Producer / consumer | Proposed adapter | Retention and authority constraint |
|---|---|---|
| P3 / generic simulation | On settled response, ambient outcome or expiry, emit actual applied outcome and occurrence/cause refs | Capture before terminal pruning. A draw, open offer or default timeout is not an accepted player action |
| Causal-story ledger | Read exact typed receipt/closure through an observer-safe adapter | Preserve its 192/64 and reserved recovery policy; do not append arbitrary P14 fields to its exact validated shape |
| P4 generated people | Bind existing stable IDs, known names and actual interaction outcome | Its store differs from simulation actors; an explicit mapping is required, never name matching |
| P6 works / P11 libraries | Account/claim payload references one work/edition/copy family | P6 owns production/performance/teaching; P11 owns loan/message/circulation, including who actually receives it |
| P12 arcs | Read qualified historical predicates and subject refs | Arc selector cannot manufacture past events or rewards to make a satisfying story |
| P13 canon / snapshots | Link source graph event and selected continuity/overlay | Canon assertions retain source labels; future events remain expectations until actual application |
| P15 rendering | Receive restricted claim/evidence bindings, return validated text edition | No arbitrary truth reads, mechanical effects, new participants or unstored live rerender |
| P16 / temporal owner | Retain trace with exact branch/life/carrier scope | A chronicle is insufficient for playable ghost, rewind, merge or archive resume |
| Bio/feed/People | Project known evidence with dates, basis and receipt links | Display windows may stay bounded; queries/callbacks use typed state, never prose parsing |

Use P11 `GenerationContext` for declared reads, availability and KnownContext. No mandatory universal context blob is copied into every receipt. Pin the selected dependency subset or keep sufficient immutable values when an upstream record can disappear. An unresolved foreign ref must not resolve to a different actor or newer product just because its display name matches.

P15 T2's semantic frame can be constructed from these account/claim bindings; it is not another history owner. Preserve a visit reference only when a historical/actionable consumer needs that actual interval. Cosmetic descriptions can retain endpoint/calendar snapshots without pinning every visit forever: the current visit compactor scans matching IDs anywhere in state. P16 controls player edits and carriers; P11 keeps actual circulation, even where sibling shorthand calls P14's role “retelling circulation.”

Keep materialized event truth separate from claims about it. A STATED canon account can be faithfully recorded as a sourced claim while its proposition remains disputed. An account's factual assessment is author-only; a viewer receives the result of their own evidence route. Stored data is private save data, not a claim of cryptographic secrecy from a save editor. Public reports and fixtures contain only synthetic data and opaque secret IDs.

## K3: commit lifecycle

Validate source/world constraints and expected owner revisions before reserving a generation operation. Previews and displays consume no draws. Stage outcomes, history records, knowledge/account publication and consumed named-stream state in the host's detached transaction. Persist one consistent save envelope before exposing consequences. A rejected stale command, full quota, unsupported reference or failed write publishes neither a receipt nor the associated new effect/draw. Retrying continues the same admitted operation, with no replacement story.

Register history-background, account-text or mutation draw scopes with the integrated P1 owner. These are semantic domain suggestions, not asserted P1 stream names. Freeze the result, content revisions and any per-account seed; changing a grammar cannot change later combat draws or previous books. A source-authored outcome needs no random draw. Schedules use existing clock and selected absence policy. No independent history timer, wall-time event creation or automatic offline reenactment is authorized.

Failed text rendering should not invalidate an already valid deed. The selected producer commits its minimal typed history first with a bounded neutral fallback; optional literary rendering can be retried without redrawing facts. If that minimum durable history cannot fit, reserve space or reject the new history-requiring operation **before** its costs/effects. Never silently commit an undocumented deed under a contract promising exact retention. Existing unrelated gameplay remains governed by its existing owners.

## K4: retention promise, without pretending finite storage is infinite

The proposed promise is exact retention of **enrolled consequential records and their required causal evidence**, with explicit coverage for unsupported or pre-enrollment events. It is not a keystroke-by-keystroke transcript of every fight. The builder must declare which producers emit durable records before claiming a complete life chronicle.

| Tier | Keep | May compact |
|---|---|---|
| Active authority | Pending commitments, applicable obligations, transfer/identity traces, discovery evidence and callback predicates | Nothing needed by their live resolver; keep references and required values |
| Durable life/history | Significant committed outcomes, immutable minimal episodes, source provenance and linked claim editions | Index layout, redundant fields and duplicate strings; do not replace factual episodes with poetic highlights |
| Routine history | Typed interval aggregates with exact supported counts/totals and scope | Repeated equivalent work only under an explicit aggregation contract; split intervals at meaningful changes |
| Presentation | Recap caches, thumbnails, duplicate formatted paragraphs and recent-news windows | Evict/rebuild from retained authorized records without changing old committed editions |
| Optional background | Uncommitted decorative detail | Stop admitting it under pressure; do not erase committed identity/history to make room |

A routine aggregate may preserve “14 deliveries, 42 coins, same client and terms in this interval.” It cannot later answer who witnessed delivery 9 unless that evidence is retained. A referenced routine occurrence must be promoted before aggregation, or the dependent feature must declare that detail unavailable. User pins preserve the selected episode; an active obligation pins required causal closure regardless of literary importance. Dead actors need stable historical identity capsules; requiring a currently living person to read their old biography would break history.

Compaction walks explicit references and retention requirements, not prose and not only the newest N entries. A frozen account may remain readable after a nonessential source copy is lost, but its evidence availability is labelled. All actionable references must still resolve to sufficient retained authoritative data. Hashes can detect drift; they cannot recreate a missing event. Validate before and after compaction, including records about to be retired, following the useful pattern in `src/world_visit_history.js:24-31`.

Routine aggregates and selected histories cannot support exact playable replay unless the temporal consumer's separate input contract is met. Keep `readable`, `evidence-complete-for-declared-query`, and `playable-resume` capabilities distinct. A full branch archive needs mutable state, commitments, RNG, actor/stock/custody and pinned content, as timeline T4 already says. Do not silently collapse separate branches because their summary paragraphs look alike.

## K5: proposed storage envelope and measurement gate

These are **unmeasured prototype planning budgets**, not browser quotas or shipped caps. Count UTF-8 serialized JSON bytes plus any retained sidecar blobs, indexes and text. Local storage representation, envelope encoding, browser implementation, quota and available space must be measured separately. Do not quote the older timeline “hundreds fit” estimate as a guarantee.

| Per selected active instance | Planning allocation | Intended content |
|---|---:|---|
| Durable typed episodes and causal capsules | 256 KiB | Roughly 512 average 512-byte episodes, illustrative only; long refs/evidence may exceed this |
| Claims, belief episodes and source-lineage nodes | 128 KiB | Shared claims with recipient-specific refs, no duplicated full story per listener |
| Frozen account/chapter/work summaries | 128 KiB | Short bounded passages, shared editions rather than a full generated novel |
| History indexes, manifests, cursors and background skeleton | 64 KiB | IDs, interval indexes, coverage and dependency metadata |
| Closure/correction/recovery reserve | 64 KiB | Reserved at admission for completing existing history-dependent commitments |
| **Initial target subtotal** | **640 KiB** | Separate from the rest of the save; not a universal per-world allowance |

Literary text may cap at 240 characters per short paragraph using D8's precedent; a work contains multiple bounded paragraphs. Longer books are a separate budget decision. Underlying typed receipts must not truncate IDs, values, dates or causal qualifiers to satisfy a text cap. Share author/source/role dictionaries without relying on mutable display text. Limit graph depth, recipient fan-out and optional detail by the selected world's data profile, with overflow continuation rather than invisible dropping.

At a proposed 80% soft threshold, discard only regenerable caches, compact proven-safe routine data, and show a private storage hint. Preserve reserve. Before new history-requiring admission would exceed its validated envelope, offer durable expansion/archive options or leave that optional operation unadmitted. Ordinary repetition is still possible after capacity is expanded or safe storage is provided; this is an engineering failure mode, not a fictional frequency adjective or global once policy.

Larger options remain reachable: IndexedDB chunk storage, bundled compressed archive, external user-managed export, larger in-memory active cache and pinned full histories. Selection requires an actual transactional design. In particular, splitting IndexedDB and the existing save envelope needs a manifest, staged chunks, atomic publication/recovery and complete export/import portability; a successful local chunk write alone is insufficient. No storage-engine migration is selected here.

Measure a fresh and a mature full envelope at 1/10/100 lived years, repeated work, 1/10/100 retained lives/branches and maximum-visibility fan-out. These are synthetic SOURCE stress scales, not mandatory natural play durations. Report raw/encoded bytes, growth per outcome, parse/validate/compaction time, quota failure and recovery. Compare the same world with history absent. An unlimited exact archive has linear growth with distinct events; use explicit storage choices rather than claiming compaction makes it constant-size.

## K6: compatibility, import and missing content

Old saves keep absent optional owners and unchanged historical behavior until compatible enrollment. Do not insert a fabricated earlier life. Existing legacy biography and source-owned ledgers stay untouched; a read adapter can import supported records with an origin/coverage receipt. The migration must explain whether the first durable event starts now or includes a qualified retained earlier interval.

Validate schemas, revisions, unique operation keys, sorted time within each clock domain, endpoint/identity refs, quantities, claim lineage, acyclic causal dependencies and bounded text/graphs before import writes. Legitimate loops reference distinct iteration records, not cycles in one occurred-before graph. Same ID with different content is a conflict, not silent deduplication. Reject or quarantine an unsupported new domain according to an explicit whole-envelope policy; do not partially import payment without its receipt or resolve a live obligation from an archived paragraph.

Missing private packs/revisions need two separate paths: safe retained summaries can remain readable if the saved disclosure policy allows; unsupported live commands/commitments remain suspended/dormant until a compatible adapter is available. Not every current loader supports that path. New pack revision never silently rewrites existing history, identities, old text or sealed assignments. Exports are private and include all required chunks/records under the selected format; public examples use synthetic fixtures. Never log actual user saves.

## K7: future acceptance matrix, all NOT RUN

| Gate | Required observation |
|---|---|
| Source lifecycle | Actual outcome emitted once after effects; duplicate replay, stale quote and write failure leave no phantom event/draw/reward; event/relationship/feed eviction does not erase enrolled history |
| Generation | Same seed/revision yields same admitted past; preview pure; different valid pasts change a survivor or action; no future source detail or reserved-role collision |
| Narrative fidelity | Every factual clause resolves to retained evidence and legal observer projection; unsupported claims labelled; current status and historical status differ correctly |
| Memory/retelling | False/partial/deceitful accounts, independent versus copied sources, audience-specific correction and exact edition identity remain distinct |
| Capacity | Fill active pins, reach soft/hard thresholds, reserve closure/recovery, simulate quota/crash; no partial publication, lost unresolved obligation, corrupt receipt or silent archival |
| Persistence | Fresh disposable natural and separately labelled seeded-native journeys; pending/completed Save/reload, Export and literal-file Import preserve scopes, editions, refs, custody, knowledge, draws and coverage |
| Desktop/seals | Rebuilt 1366x768 and 1600x1000, meaningful story plus evidence/current-action use; inspect hidden DOM/accessibility/filters/errors with ID-only artifacts; mobile deferred; human prose/feel acceptance separate |
