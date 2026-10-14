# BI2: one settled-outcome log

2026-10-14. **PROPOSAL ONLY.** Consolidates [D8](../p5/D8_LORE_GRAMMAR.md), [P14 K1-K6](../p14/CONTRACT.md), [P12 C2/C6](../p12/CONTRACT.md), [P17 SS](../p17/CONTRACT.md) and P34 S-2. [SOURCE_AUDIT](SOURCE_AUDIT.md) distinguishes actual code from these proposals. Proposed successor location: existing `expansion.loreHistory`, with a root-selected schema migration rather than a parallel feature-history store.

## BI2.1: an immutable fact about a committed transition

```text
Receipt = {
  id, appendOrdinal, transactionRef,
  operationKey: {scopeRef, producerId, commandCauseRef, ordinal, outcomeKind},
  origin: lived | authored | generatedBackground | premise | director,
  scopeRef,
  time: {clockRef, occurredAtOrInterval, commitSequence, calendarBindingRef?},
  producer: {ownerId, resolverRevision, definitionRef?},
  actionKind, outcomeCode,
  actorRoleRefs[], targetRefs[], placeRoleRefs[], threadRefs[], factionRefs[],
  causalParents[], prerequisiteEvidenceRefs[], consequenceRefs[],
  appliedValues: [{ownerRef, subjectRef?, dimension, unitRef?, delta?, value?, revision}],
  evidence: {mode, sourceQuality, locatorRefs[], speakerRef?, contradictionRefs[]},
  disclosurePolicyRef, audienceEvidenceRefs[], drawReceiptRefs[],
  retainedCapabilities[], retentionContractRef
}
ReceiptLog = {
  schema, revision, nextOrdinal, enrollmentCoverage,
  immutableSegments, receiptDirectory, operationDirectory,
  compactionManifests, registeredQueryContracts
}
```

Settled means a transition really committed. Acceptance/reservation, partial work, refusal, expiry, delivery, completion, observed discovery and cancellation can each be settled transitions. An open offer, frozen future effect, forecast or draw is not proof of delivered goods or consent. Separate `accepted`, `performed`, `received`, `acknowledged` and `paid` kinds when they occur at different boundaries. A physical act and the later receipt of testimony are different events.

Store actual applied deltas or immutable consequence records, not a second purse/health/stock ledger. Zero is a valid observed result where the owner defines it. Unknown input is not zero. A single transaction can link several role/target/place deltas without copying a full receipt per participant. Local chronological time and append order remain separate; late received reports never backdate knowledge. Cross-clock sorting requires a real mapping or partial order, not comparing unrelated minute numbers.

Mechanical corrections append a compensating transition with a reason and prior receipt ref. Claim corrections append new claims/belief episodes. Neither edits the old outcome. A prospective canon event is definition/state in its owner until application; imported source background uses its proper origin and cannot become earned player credit. The log is not a universal replay engine: mutable domain stores still restore current authority.

## BI2.2: one publication boundary

The producer builds a detached plan, revalidates owner revisions and frozen terms, reserves required closure storage, applies real effects, and passes the actual resolved values to the log owner. Domain state, receipt, operation key, draw consumption, knowledge delivery and pins validate and persist in the same envelope before publication. Failure publishes none. A producer can keep a narrow legacy settlement marker where its validator requires it, but points to one canonical receipt instead of storing another narrative event payload.

Idempotency is scoped to one admitted operation. Same operation with different immutable content rejects as a conflict; it must not return a superficially matching old row. A genuinely new request, paid batch, contact, grant or recurrence gets a new cause. No lifetime once rule is introduced.

The operation directory survives payload compaction. It returns the saved receipt handle or a tombstone with supported result capability; retry never redraws/reapplies. Monotonic producer high-water marks can compact operation keys only after contiguous completion and gap/retry rules are proven. Gaps, concurrent commands, amendments and branch imports need exact exception entries. Bloom filters or hashes alone are insufficient: false positives could deny legitimate work and a digest cannot restore a lost result. Exact dedup metadata grows with distinct unconstrained operations; bounded storage needs the explicit options in RETENTION.

P34 currently evicts payload **and** its operation lookup entry together; S-2 is not this stronger append-only contract. Migration must establish protection before eviction resumes. A previously evicted key cannot be reconstructed from `evicted` count or prose.

## BI2.3: indexes and a query API shared by every lane

Indexes are derived, rebuildable and checked against immutable segments: operation key; actor/role; target/kind; place/role; thread; faction; world-instance/branch/life; action/outcome; local clock interval; causal parent/reverse dependency. Index values hold IDs and ordinal ranges, not duplicated receipt objects. Persist only a verified checkpoint/digest if startup measurement justifies it. A stale cache is discarded, never treated as history authority.

```text
getReceipt(ref, {capability, observerRef?, asOf?})
findReceipts({scope, actor?, target?, place?, thread?, faction?,
              action?, outcome?, clockInterval?, origin?, afterCursor?, limit}, lens)
findOperation(operationKey)  // producer/internal integrity route only
aggregateReceipts(query, {groupBy, countOrUnitTotals, queryRevision}, lens)
traceCauses(ref, {depth, capability}, lens)
queryCoverage(query, {predicateRevision, requiredDimensions}, lens)
declareConsumer({id, ownerId, queryRevision, queries, pinPolicy, retentionCapabilities})
```

Logical result: `{rows, nextCursor, coverage, availableCapabilities, unavailableReason?}`. Coverage reports producer enrollment intervals, clocks, origin filters, schema/resolver partitions, lost legacy intervals and compaction precision. Cursor binds query, lens, log revision/snapshot and last ordinal. Stable pagination uses append order, with explicit local-time ordering available; concurrent appends cannot skip an older page. Observer queries project **before** counts, facets, totals and pagination. Hidden rows cannot leak through empty slots, result counts, search suggestions or errors. Internal integrity queries are never player UI endpoints.

Availability: exact retained, exact archived under a supported manifest, supported aggregate, identity-only, insufficient coverage, or unsupported. No matches means only no matches within declared coverage. A negative claim such as no one helped requires a closed window and complete relevant producer coverage. A total or latest query must not pretend to return exact omitted witnesses. Rejected required exact queries block only their dependent operation; ordinary unrelated routes continue.

## BI2.4: every lane maps to this log

Rows identify proposal owners, not implementation acceptance. Reports/domain drafts available on 2026-10-14 are tracked in the source snapshot; later lanes require a final refresh before coding.

| Lane / history proposal | Canonical output or reference | What stays in its domain owner |
|---|---|---|
| P5 D3 talent chapter settlements | Exercise outcomes, assessment and grant receipts; chapter refs | Active chapter/counters, source ownership; no replayed old-biography credit |
| P5 D6 / O3 secret and appearance enrollment | Opaque enrollment/discovery/allocation receipts, route/status only | Sealed truth and appearance bindings; no secret payload in generic text |
| P5 D7 / P7 people admission | Admission/custody/household transitions | Identity, means, role constraints, explicit actor bridge |
| P5 D8 facts/accounts/legends | Facts become Receipts; accounts/claims/editions reference them | Lore account tables and frozen editions, no private fact copy |
| P5 D9 pacing receipt ring | Settings/meaningful decisions reference occurrence receipts | Rolling weight diagnostics/impact cache and due policy; non-outcome draws stay P1-owned |
| P6 / P8 creation and acquisition | Harvest/manufacture/use/repair/teaching/transfer receipts | Material truth, products, jobs, custody, lots and site state |
| P11 context/N1/N2 | Need/request/quote acceptance and actual settlement | Live needs/terms/reservations; pure context is not serialized history |
| P11 N5/N6 / P14 retelling | Real dispatch/arrival/study/publication outcomes; account refs | Message transport/copy custody; claim, account and edition semantics |
| P12 arcs and sifting | Admission, beat transition, closure, recognized-pattern evidence refs | Active graph, frontier, partial matches and interpretation revision |
| P13 divergence and canon state | Actual event/prerequisite transitions with premise/lived origin | Source graph, anchor, selected branch/overlay, forecast applicability |
| P14 HistoricalReceipt / LegacyTrace | HistoricalReceipt is the shared Receipt; carrier crossing is a receipt | Account/Claim/ChronicleEdition and retained trace joins |
| P15 semantic frames, dialogue/utterance | Only actual utterance delivery/choice/consequence emits a receipt | Frozen realization, turn state and voice profile; words do not award effects |
| P16 crossover/reset/ending/player authoring | Crossing/reset/transfer/publication outcomes with carrier manifest | Full playable anchors, per-owner reset/carry rules, labelled notes |
| P17 StorySignal/assessment/grant | Assessment and applied grant/use reference one deed | World-specific progression/source state; overlapping matches are not extra deeds |
| P18 QA/explanations | Queries/coverage over production log | External synthetic telemetry, checks, safe explanation projections |
| P19 SocialEpisode/ContactEpisode/PastHook | One episode outcome with several directed consequences, actual contact delivery | Axes/bonds/plans, background origin, teaching/biological links |
| P20 PlaceEpisodeLink/home/settlement/residue | Place-role index over one outcome; actual site transitions | Title/fixture/population dimensions and physical survivor state |
| P21 battle/war/ecology/economy/venture | Supported action/result, campaign-stage, debit/delivery/settlement receipts | Current forces, ecology, venture stages and balances |
| P22 director/request/pack/feedback | Applied test intervention, pack activation, explicit mark transition | Editorial acceptance, pack lock, feedback note; no proof from a bookmark |
| P23 interpretation/ambition/judgment | Real endorsement/assessment/goal transitions reference deed/claim | Inner-life commitments and goal predicates; no universal morality balance |
| P24 forecast/question/item/anniversary | Observation, inquiry, crossing and actual anniversary occurrence | Foreknowledge facets, questions, exact object state and calendar policy |
| P25 episode/Stories/hero export | Read existing receipts; in-world legend admission emits a distinct transition | Editions, acknowledgment cursor, preferences/export candidate; no playback rewards |
| P26 beats/genre/gags/firsts | Actual turn/recognition outcome; structural fingerprint references receipts | Authoring metadata, recurrence law and interpretation; novelty label is not an act |
| P27 journey/crew/group/disciple/death | Stage/cargo/appointment/lesson/death/estate transfer outcomes | Reservations, membership, succession rights and source-specific afterlife state |
| P28 intent/taste/onboarding | Explicit saved interpretation/mark/help acknowledgment when admitted | Goal reference, taste epoch/reducer, help state; dwell is not consent |
| P29 crafting draft, now CR4 | Commission/maker/NPC manufacture/gift/item transfer outcomes | Same P2/P6/P11 owners and actor-specific means, no new story P29 registry |
| P30 body/age/family/animals | Actual body/care/life/family/bond transitions | Conditions, identity/lineage and actual animal means; no hunger death |
| P31 promises/oaths/favors/confidentiality/faith | Acceptance/amendment/performance/waiver/breach/enforcement, real disclosure/offer/reception receipts | Current terms, private circumstance, observer holding, transport/deal/rite and separate power grant |
| P32 LOD/continuity/play logs | Promotion/fallback transitions only when they commit meaningful state | Capsule/cursor, query contracts; optional play telemetry is not game memory |
| P33 ranking/media/calendar/outsiders/defeat/pacing | Adjudication/publication/arrival/booking/actual loss/recovery outcomes | Board rule/edition, appointment, outsider/carrier and actual commitments; attention size is presentation, no invented offscreen outcomes |
| P34 S-2 | Existing records convert losslessly where supported; request and aftermath producers register | S-3 request state stays request-owned; S-2 ambient/expiry coverage is not inferred |
| P35 environment/codex/sound/challenge | Actual residue/observation/challenge result; known codex links | Scene survivor, collection projection and audio preferences; sound emits no deeds |
| P36 micro contracts | Real witnessed usual/order/gift/wear/change receipts | Bounded qualified preference/mark caches and frozen utterance |
| P37 textureCard | Semantic refs to the same known receipt/claim | Evidence-qualified phrase bank; an effect routes to its declared existing owner |
| Crafting P26-P29 drafts / CR1-CR4 | Dose/response, world-law operation, queue, commission and transfer receipts | Body/exposure, law, production, economy and maker owners remain distinct |

See [DUPLICATES](DUPLICATES.md) for specific conflicts and [STORE_OWNERS](STORE_OWNERS.md) for writer boundaries. This mapping extends CO/FE/MK/IT/WL/CT/AU/EC/SO/TL/RX/KN/SC/RS/PG/CL/XD/NP/PR through shared receipt joins, without repeating their feature palettes.
