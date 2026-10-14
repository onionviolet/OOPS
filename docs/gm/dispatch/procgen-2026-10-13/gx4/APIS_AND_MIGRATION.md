# GX4 GA1-GA8 APIs and migration proposal

All APIs below are proposed. Existing exports are identified in [AUDIT](AUDIT.md); proposed filenames are not present by virtue of this document. Use namespaced references such as `procgen-status:GA1` in coordination: [generation rules](../../../../GENERATION_FOUNDATION_RULES_2026-10-14.md) has a different GA1-GA9 list. This packet implements neither list.

D1: Extend the P1 root/owner and expose read interfaces over P2/P3/P4 stores first. Wrap a real existing consumer in each landing. Do not create a universal replacement save, actor, item, clock or reward store. Preserve algorithm v1 and its exact cursor/order/distribution while new domains can opt into addressed-v2. Reuse [G1 kit](../../gen-rules-2026-10-14/g1/REPORT.md) after root verifies its actual branch; its tests are reported there, not rerun here.

## GA1: stream and draw contract

Proposed owner: E1/P1 successor; `src/generation_draws.js` adapter over `seeded_streams.js`, optionally G1 kit. Algorithm implementation remains with its owner.

```js
makeDrawAddress({worldId, instanceId, lifeId, generatorId, subjectId,
                 slot, ordinal, attempt, tableRevision}) // canonical JSON address
peekDecision({streams, address, mode, algorithm, distribution, table})
// -> {value, receipt, expected:{root,cell,ordinal,salt,tableRevision}}
stageDecision({state, quote})
// -> {state, value, receipt}; clone state, recheck expected, no durable write
legacyStep({algorithm:'xorshift32-v1', cursor}) // -> {cursor, unit}
```

`mode` is `keyed|cursor|resolved`; `algorithm` is `p1-v1|xorshift32-v1|mixture-v1|addressed-v2`. `distribution` is `unit|uniformInt|legacyRound|weightedV1|integerWeightedV2`. Explicit identifiers prevent float-to-integer or half-endpoint changes disguised as deduplication. `resolved` consumes a retained value with no RNG operation.

Peek never calls ensure, logs, allocates a counter, reserves an ID or draws from native globals. Root initialization belongs to staged enrollment/load compatibility, not render. Cursor peek computes next ordinal without mutating; stage increments cloned cell and appends a receipt. Keyed peek reads exact key/ordinal/salt; stage can append a receipt if consequential, without cursor increment. A generated truth admission can instead save the resolved record and seed path. Receipt fields include algorithm, mode, address, ordinal/salt, selected result, table/law revision and cause. The numeric value stays internal. Existing receipts remain their original schema.

Migration: forward existing exports to same v1 evaluator, then port one local xorshift closure to `legacyStep` without changing seed or call order. Preserve P2 hash scope and P4 variable draw count/naming input. Move new generators to v2 individually. Keep old P3 deck RNG in place until a separate opt-in/new-cycle policy lands; no conversion of RNG to a P1 ordinal can generally recover its past history. No v2 draw hashes inside old v1 cells.

Unicode fix: P1 `for...of` plus `charCodeAt(0)` loses low surrogates for supplementary characters. G1 reports this collision. Correcting P1 hash in place would move every future v1 stream draw, including already admitted keyed encounter decisions. Preserve `hashStreamSeedV1`; introduce an explicitly versioned v2 hash for new addresses. Do not call compatibility the same because numeric roots can be passed to both.

Scope: default child world seed derived from existing root plus stable instance ID, stored when a real world instance is admitted. No second crypto seed on visit. Person/fate/craft travel policy follows E1's local choice, not an unconditional life reset. Existing `craft` stays global and existing world-ID suffixes stay unchanged for v1. GO2 can mean child seed ownership rather than a second unrelated campaign root.

## GA2: generated-record envelope

Proposed owner: P1/P2/P4 plus U14 migration owner; `src/generated_record.js` pure validation/ref adapters.

```js
wrapLegacyRecord({kind, ownerRef, id, payload, metadata}) // pure logical view
createGeneratedRecord({id, kind, generator, origin, seedPath, truth,
                       dependencies, receiptRefs, createdAt}) // -> record
validateGeneratedRecord(record, registry, resolveRef)
readGeneratedRecord(owner, ref) // -> logical record or explicit absent
migrateGeneratedRecord(record, targetRevision, migrationRegistry)
```

```js
{
 schema: 1, id, kind,
 revision: 1, // record format; separate from mutable owner's revision
 generator: {id, revision, algorithm, tableRevision, lawRevision},
 origin: {worldId, instanceId, lifeId, continuityId, sourceRef},
 seedPath: {stream, key, ordinal, salt, algorithm}, // internal, optional for legacy
 truth: {},
 dependencies: [{owner, id, revision, retainedValue}],
 receiptRefs: [], createdAt: {clockId, minute, cause}
}
```

Concrete legacy logical kinds: mixture profile, mixture product, mixture method, traveler and storylet occurrence. IDs stay exact `m1:` identity, traveler owner+traveler ID, occurrence ID. Qualify reused traveler IDs with their existing owner before any multi-world expansion. `origin.instanceId`/seedPath may be `unavailableLegacy`; never invent or regenerate a historical path. Raw truth belongs to original domain store. Store metadata only when needed by a new consumer, in an optional domain-local subrecord; no duplicate payload mirror.

Migration: v1 payload validator/resolver retained as a named old-law handler; GA2 wrapping itself is read-only. A future schema bump reads v1 and v2, writes v2 only after explicit compatible migration. Recipe IDs/inventory keys are not recomputed. Existing names, roles, rewards, ingredient fractions, dose and due terms remain frozen. Current validators must accept legacy templates/cultures through pinned adapters before new registries replace hardcoded lists. Missing optional owner remains absent; required missing law/revision rejects before writes, or a declared dormant record preserves bytes and prohibits consumption. Never silently apply new effect law to retained stock.

Freeze boundary: once an unseen entity affects costs, stock, eligibility, an NPC plan or world consequences, its truth must be retained even before player discovery. Pure uncommitted descriptions may stay addresses. This tightens GR3's 'freeze on reveal' where earlier consequences already exist. Revisioned retcon is an explicit event with prior record and carrier/knowledge policy, not reload regeneration.

## GA3: knowledge projection

Proposed owner: U06/AX6 observation and cheat AB1-AB4; `src/generation_projection.js` adapters to existing observation owners.

```js
readObservations({observerRef, subjectRef, owners}) // -> observation[]
projectGenerated({recordView, observations, publicPolicy, lensView})
// -> {subjectRef, fields, display}; exact allowlist, no raw record reference
stageObservation({plan, observerRef, subjectRef, field, value, basis, asOf})
// -> plan with append/replace policy chosen by observation owner
```

Each field returns `status: known|suspected|unobserved|unsupported|notApplicable`, safe value/range if allowed, asOf and knowledge-safe basis. SHOWN/STATED/INFERRED describes evidence origin; it is independent of truth accuracy and confidence. Several contradictory accounts can coexist with conflict refs; certainty does not delete the earlier account. No spread of raw truth into a display object. An unknown value is omitted, not `null` plus an enumerated hidden field list.

First two adapters: P2 observed exact-product dose and P4 met/knownTraits. Map current observations to player observer and legacy basis without new grants. Preserve P4's current public routine/role and ordinary trait count under its explicit public policy; secrets default to suppress existence/count/aliases and route through discovery. General `simulation.knowledge` stays its owner. `seen/interpreted/understood` cannot be equated blindly with known/suspected: a well understood false report remains stated information. NPC contexts read NPC evidence, not player knowledge.

Projection must cover labels, tooltip, sorting/filtering, price explanation, disabled reasons, aria text, exported accounts and cheat peeks. Physical effect resolution retains truth even when its view is unobserved. For hidden prerequisites show a generic safe inability or known alternate route, rather than exposing the failed private predicate. No new source-world secret truth examples in fixtures; synthetic neutral labels and ID-only sealed artifacts.

## GA4: context reader

Proposed owner: [P11 CONTEXT](../p11/CONTEXT.md); `src/generation_context.js`, consuming owner adapters rather than copying P11's domain catalogue.

```js
createContextReader({adapters, clocks, refResolver}) // deterministic registration
reader.actual({request, declarations})
// -> {identity, anchor, inputs, availability, provenance, expectedOwners}
reader.known({actual, observerRef, declarations}) // safe subset via GA3
reader.assertCurrent(snapshot, currentOwners) // throws stale, no mutation
```

Each declaration `{key, owner, required, channel:'E|W|Q|K', policy}` names only consumed inputs. P11 identity/anchor vocabulary retained. Native calendarMinutes and expansion clock are separately identified, with declared conversion/admission anchor; no assertion that equal numbers mean equal time. No Date.now, DOM, enrollment, weather update, draw or global owner writes. Required unsupported input fails admission. Optional absent input has no influence; only a schema-declared missing-zero policy supplies zero.

Freeze actual inputs or durable refs plus minimum retained values at admission. All references pin revisions and clock basis; hashes diagnose drift but cannot replace facts after compaction. Existing P4 help is a good first consumer: person ID, actual supply/purse, Village endpoint, busy/write guard and calendar; no festival/faction/director prerequisites. Recheck stock/custody on commit. Known projection is separate and need not contain all execution inputs.

## GA5: eligibility and weight tables, per-world overrides

Proposed owner: P3, P9/P10 profiles and [G3](../../gen-rules-2026-10-14/g3/). `src/generation_tables.js` adapter, using G1 pick helpers if adopted.

```js
resolveTable({definition, overlays, context, registry})
// -> {id, revision, rows:[{id, eligible, weight, internalReasons}], quiet}
previewTable({resolved, observerRef, projection}) // safe authorized diagnostics
pickTable({resolved, draw}) // -> {value, receipt}, no effects/publication
lintTable(definition, registry) // -> issues, incl. constraints/reader refs
```

Overlay order is explicit `core → world → instance/era → region → actor → declared cheat`; each overlay pins revision, operations and provenance. Hard legality veto runs before modifiers and remains zero unless an actual exceptional world-law handler changes the legality predicate. Weights must never revive an impossible row. Unsupported rule is not a zero-weight 'rare' candidate.

Legacy P3 float/cooldown/family/pity behavior stays weightedV1. New integer tables use integer totals within G1's uint32 supported bound, with explicit quantization if migrating floats; scale/rounding/candidate order is a revisioned choice. Stable code-point ordering for v2, preserve old ordering for admitted v1 replay. Retry attempts are addressed and bounded; authored fallback must also be legal and have a real reader. Empty table returns explicit quiet/no-result or unsupported, never a free reward. Stratified category selection is an option when expanding content would dilute desired category shares.

Local adjectives describe renewability, rarity, cooldown, costs, authority, retention and exceptions. Replace future `once` semantics with `repeatPolicy:{ruleId,revision,scope,resetCause}`; store seen count/history for idempotency. Existing `shower_bench`, `stray_dog`, `fever_spreads` and begin command have once metadata, and other facts suppress callbacks after resolution. Preserve existing pending cards. A separately chosen recurrence slice can use new incident/need IDs with actual new causes and paid resources, rather than resetting fulfilled facts or paying the same event twice. A scarce/unique source may legitimately have its own constraint; that is a world law, not global anti-abuse.

## GA6: generator registry, lint and replay

Proposed owner: [P39](../p39/) registry roadmap, U14 core A1 and G1/G3. New `src/generation_registry.js` is a typed extension beside `createContentRegistry` and `createSimulationRegistry`, not a second world registry.

```js
createGeneratorRegistry(entries) // validate unique IDs, DAG, revision coverage
{
 id, revision, kind, ownerPath, dependencies, inputs, outputs, readerRefs,
 algorithms, tables, budget, absencePolicy,
 generate: (address, inputs, tables, draws) => ({value, receipt}),
 read: envelope => optionalOwner,
 validate: (owner, envelope, refs) => owner,
 migrate: (owner, from, to) => owner,
 project: (record, observer) => safeView,
 lint: (definition, registry) => issues,
 replay: ({fixture, steps, checkpoint}) => replayResult
}
registry.validateEnvelope(envelope, refs) // two phases: local then cross-owner
registry.snapshot(envelope, runtimeReaders) // only registered own paths
registry.restore(preparedEnvelope, runtimePublishers) // after preflight/write
registry.lint() // graph, declarations, readers, leaks, budgets, revision handlers
registry.replay(generatorId, fixture) // source harness hook, no browser startup
```

Registration is composition-root-owned, deterministic and side-effect-free. Modules do not import main or world data; the root passes definitions/handlers. Reject duplicate ownership of a save path, duplicate generator ID, cycles, missing readers and illegal revision transitions. Shared world-registry A1 owns facts/gates/clock plugins. Generator entries reference its endpoints; they cannot redefine them.

First migration registers P2 validator only behind current `validateMixtureEnvelope` call. Preserve its full-holder scan and ordering before item decoding. Next replace a single main snapshot/restore join, then P4, then deck validator. Callbacks may stage native owner patches through existing durable host; registry never directly sets localStorage or starts UI timers. Validation must finish for all local and cross-owner records before restoring any live module. Existing `setMixtureOwner` early in load is not a template for partial restore of a future arbitrary owner.

Replay fixture records immutable inputs/root/algorithm/table, commands with played-clock anchors and supported native state. Compare canonical authoritative owner state and next draws after each command, after checkpoint JSON restoration, and after whole-envelope import validation. Presentation randomness/wall timestamps are excluded explicitly; causes/knowledge/terms/stock may not be normalized away. Golden fixtures are revision-specific, and regeneration requires reviewed semantic change, not automatic approval. Reuse A5/P18/P40 harness hooks; no second broad simulator.

## GA7: level-of-detail refinement

Proposed owner: [P32](../p32/) plus U05 clock/scheduler; `src/generation_detail.js` pure adapter over retained identities.

```js
planDetail({ref, record, from:'address|summary|detail', to, context, budget})
// -> {record, receipt, expectedOwners}; no visit-time reroll
compactDetail({record, pinnedRefs, retentionPolicy}) // immutable authoritative core
nextDetailBoundary({record, clockPolicy}) // used by existing scheduler
```

Summary saves stable identity, generator/law revision, commitments, scoped truth already used, ordinal/attempt and pending causal deadlines. Detail slots derive from saved address/revision and keep those truths fixed. Persist promotion and draw allocation with visit/observation transaction, then reveal. Returning/demoting/reloading does not create a new traveler or recompute supply. A visited NPC's true stock/claim cannot vanish during compaction.

Proof: direct address→detail versus address→summary→detail yields equal authoritative facts; fine vs coarse stepping preserves committed effects and due boundaries. Exact not-yet-simulated dynamics are explicitly unavailable. Coarse offscreen NPC simulation is opt-in clock law, not inferred from current P4 O(people) routine or permission for universal offline catch-up. UI budget limits notices; it cannot drop goods, deaths, obligations or paid work. Unlimited renewable content can be paged/compacted under bounded storage without making a global once cap.

## GA8: lens interface

Proposed owner: [GX2](../gx2/), cheat AB3, AX18 and [G5/G6](../../gen-rules-2026-10-14/). `src/generation_lens.js` adapter consumes existing cheat ownership/observations and draw contracts.

```js
quoteLens({cardRef, observerRef, subjectRef, operation, context, registry})
// -> safe offer + expected revisions; operation reveal|peek|pin|reroll
projectLens({quote, knowledge, law, skin}) // pure display only
stageLens({plan, quote, request}) // actual cost/knowledge/modifier effects
```

`reveal|peek` projects facts or prospective decisions; durable acquired knowledge needs an explicit accepted lens action. Hover/focus has no cost/evidence write. Range/grade/freshness/counter/spoiler classes and cost-free powerful modes are local definitions. An exact float is not an exact future story: peek freezes table/context/time horizon and marks conditional predictions stale if they change. Current v1 roll helpers ignore salt, so pin/reroll adapters cannot assume merely editing a cell salt reaches all sites.

Pin/reroll is an authorized effect operation, separate from read-only AX18 lens. Target must be a typed unclaimed decision with declared replacement/retcon policy. Stage actual cost, decision-local salt/modifier, original/replacement receipts, resolved consequence and any observation atomically; do not increment a whole stream salt and alter unrelated keys. A historical consumed product/person truth changes only through an explicit world transformation or retcon. Merely viewing a lens never creates truth. Sealed routes are enforced before projection; ID-only diagnostic references, no root-based secret prediction panel by default.

Migration: existing card state and baseline world knowledge untouched. Begin with one P2 exact-product appraisal and ordinary player's legacy observation; second user P4 people view establishes shared projection. Later separately selected E1 draw peek does not require pin/reroll or charge mechanics to land with it. Recurring/new lens use remains reachable where supported; one receipt cannot settle twice, but the power has no imposed universal once limit.

## D2: staged compatibility decisions

| Step | Proposed transition | Required invariants |
|---|---|---|
| M1 | Read wrappers only, no new save fields | Existing imports, bytes, IDs, root/cursors/next outcomes, views and absence remain identical. |
| M2 | Optional metadata / registered validator for one domain | Old payload and canonical key retained; absent owner not materialized; failed validation/write no live mutation. |
| M3 | Pinned revision handlers, future domain envelopes | Keep old v1 interpreter and fixtures available; new revisions select new handlers only for newly admitted content. Unsupported future data rejects before publication or explicit dormant preservation. |
| M4 | One new addressed-v2 generator / child instance scope | Retained v1 pending outcomes unchanged, no old-root hash replacement, explicit world/life carry policy; old saves opt in using existing root rather than time/crypto. |
| M5 | Deliberate world retcon / cyclic recurrence / refinement | Named causal transaction and carrier/knowledge policy, original facts/receipts retained, ordinary alternatives reachable. No automatic patch-day reshuffle. |

No global schema number is reserved here. Root/U14 owner selects version and migration gate when code is authorized. Save/reload and literal-file Import check pending as well as final states, and then compare the next draw, not just a checksum of the present.
