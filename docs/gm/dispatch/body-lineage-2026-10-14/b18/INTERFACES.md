# B18 interface specifications

2026-10-14. PROPOSAL, docs only. Extends genetics G78 AB1-AB12; selects no runtime work, balance, prestige or world. [CODE_MAP](CODE_MAP.md) owns inspected source evidence; [OVERLAPS](OVERLAPS.md) resolves shared owners; [MINIMAL_SET](MINIMAL_SET.md) limits the first implementation candidate. All function names below are proposed unless explicitly identified as existing.

Default: adapters read existing owners and preserve old behavior. Dial: a qualified world can enable stronger, absent or exceptional effects. Reason/cost: actual physiology, instruments, procedures and local laws determine effects and payment; none of these interfaces imposes a universal flaw, genome, purity score or lifetime quota. A local absolute remains possible as lore.

## Shared boundary

`Ref = {owner, id, instance?, incarnation?}` identifies the actual domain object, not its display name. Body, person, life, source definition, source acquisition and office are different references. IDs and revisions must resolve through their owning validators. A reusable `player` actor key or B2's illustrative `native.player.body` cannot identify every historical person/body after succession.

`ActualContext` contains trusted host actor/body/world-instance/clock references, current sequence, definition revisions and actual inventory/vital/access facts. Only planners and domain rules receive it. `KnownContext` contains viewer identity, authorized means and projected claims. Renderers receive projected rows, never ActualContext. Views draw no RNG, materialize no NPC, grant no knowledge and advance no clock. Native ordinary ticks retain their existing save cadence; staged commands use the existing durable-before-publication host. This spec does not claim every native tick is a storage transaction.

All proposed stored additions need explicit local-load, create-save, import-preflight and definition-validation support. Serializer acceptance alone is insufficient. Present invalid/unsupported data rejects before mutation; absent data stays neutral. Unsupported body/world operations retain data and return an observer-safe unavailable reason. Active pinned definitions need supported resolvers or an explicit migration. B15's [CV1_SPEC](../b15/CV1_SPEC.md) and kit [W18_ABSTRACTIONS](../../../../worlds/world-core-kit-2026-10-14/W18_ABSTRACTIONS.md), which arrived during this lane, are concrete read-interface clients/owners. Their proposal status remains exact.

## AB1 Body record

Minimal interface:

```text
readBody(envelope, bodyRef) -> {bodyRef, personRef, revision, physical, person, coverage}
prepareLegacyBody(envelope) -> clonedEnvelope
projectBody(bodyRef, KnownContext, fields) -> BodyRows
```

**Extend/replace:** adopt B2 physical/person paths at `character.body_record`, with explicit BioComponent access/serialization. Keep `getBio()` as the legacy four-field projection. Native race/height/age aliases must agree with valid split state; legacy `gender` becomes a compatibility snapshot. B7 sparse NPC adapter uses the same vocabulary with its own admitted schema, not unchecked extra keys in B2 schema1. Existing `simulation.people[id].body` and possessed-body owners retain their present scalars, vitals and custody. One field has one writer; overlapping fields require a declared adapter rather than duplicate writable copies.

**Consumers:** real `characterBioView` (`src/character_bio.js:12`) and native bio address resolution (`src/main.js:2143`) can use a shared reader. Serialization is also real (`src/main.js:5006`), but does not prove bodily gameplay. Native sleep/craft consumers become consumers of optional physical effects through AB8. General anatomy is premature; NPC demand generation is specified by B7, not implemented here.

**Save impact:** optional versioned native record plus separate sparse NPC admission if selected. B2 migration preserves male/female/ambiguous identity and current address behavior; never infers sex, fertility or pronouns. Missing anatomy remains unspecified. No new diagnosis, card, observer, history or roll on load. Preserve the current `middle aged` versus `middle-aged` compatibility mismatch until separately changed. B11 revision2/model extension cannot be read by B2 revision1's strict validator without new admission.

**Comic join:** comic CA7 persona may reference the person/body, but a disguise is neither gender identity nor a second biological person. CA2 skin reads BodyRows without changing body truth.

## AB2 Faculty card

Minimal interface:

```text
FacultyDefinition {id, revision, family, mechanismRef, awakeningRuleRef,
  operationRuleRef, functionRefs, costPolicyRef, discoveryRef, transmissionRef}
FacultyBinding {cardRef, bodyOrCarrierRef, sourceDefinitionId,
  sourceRevision, acquisitionReceiptRef}
resolveFaculty(binding, ActualContext) -> {capabilities, executionSupport, costPolicyRef}
```

**Extend/replace:** add validated definition metadata beside existing `registry.sources`; bind earned functions to `actors[actor].sources[sourceId]`. Keep capabilities as their current `max`/`sum` aggregation. Family physique/constitution/quirk is authoring metadata initially mapped to supported `trait` or `bloodline` kinds. Adding new runtime kinds would also require bio and every source-kind reader to admit them. Do not replace C0 cheat cards with this object: their ten exact top-level keys and inert hooks remain; a typed source reference can connect a cheat to a faculty after its dispatcher is implemented.

**Consumers:** `frontier.pack` consumes body hand control (`src/expedition_content.js:93`); `characterBioView` consumes source provenance (`src/character_bio.js:16`). These are actual action and presentation consumers. B6 generated cards and B11 tendon changes are proposed producers, not additional live consumers.

**Save impact:** pinned card tuple/parameters/name and binding only when acquisition actually commits. Definitions are not copied into every body. Current source lookup is one definition ID per actor, and query uses current registry grants despite saving a revision. Historical resolver dispatch must therefore be implemented before claiming pinned behavior. Multiple same-definition organs/personalized grants require an instance-aware query/remove migration; premature for a finite archetype catalog.

**Comic join:** CA3 grade is a view of supported outputs; CA4 mantle can carry a faculty without inventing inherited blood. CA6 audience fuel stays an explicit resource/action adapter.

## AB3 Expression state

Minimal interface:

```text
readExpression(binding, ActualContext) -> {present, awakened, active,
  suppressed, impairmentRefs, removedReceiptRef, development, operational}
stageExpression(candidate, binding, operation, causeRef, expectedSequence) -> plan
```

**Extend/replace:** wrap `simulation.faculties[actor][sourceId]`. Latent, awakened, active, suppressed, damaged and removed are descriptions of several axes, not one mutually exclusive enum. A faculty can be awakened, active, suppressed and injured at the same time. Latent means present and not awakened. Removed means no current binding/source, with history retained by its actual receipt owner. Damaged needs a located impairment affecting that function, not an invented new universal faculty state. Existing no-faculty legacy sources retain their current usable behavior.

**Consumers:** `queryCapabilities` gates grants (`src/capabilities.js:53`), and `simulationFacts` gates executable command facts (`src/simulation_effects.js:116`). Bio also uses awakening (`src/character_bio.js:18`).

**Save impact:** none for the initial reader wrapper. Located damage/history additions require their condition/body owner and versioned validation. Existing source remove deletes both source and faculty in simulation, while the expansion remove path deletes the source alone; a future unified removal must explicitly reconcile stale faculty links. No load-time reawakening.

**Comic join:** CA1 world laws provide operational suppression support. CA8 return after defeat does not automatically repair a source, body or expression.

## AB4 Carrier link

Minimal interface:

```text
CarrierLink {id, carrierRef, payloadRef, relation, causeRef, validFrom,
  validUntil?, policyRef}
readCarriers(payloadRef, envelope) -> CarrierLinks
previewCarrierDisposition(links, transferRequest, KnownContext) -> DispositionRows
```

**Extend/replace:** read existing inventory/custody, source/body, knowledge, titles and estate through typed adapters. A carrier answers where a payload resides and under which relation; AB10 answers how a particular event can transmit it. Owner, holder, user, beneficiary and recognized claimant differ. Store links only for facts with no existing owner; current custody does not become a second carrier inventory. B3 `lineage_legacy` may own frozen historical transmission links if selected.

**Consumers:** estate derivation/application (`src/heir_inheritance.js:32`, `:81`) and live loan transfer/return (`src/simulation_effects.js:265`) supply two material consumers. The generalized body/soul/office transfer executor remains premature; property consumers alone do not implement it.

**Save impact:** read wrapper costs no new bytes. Actual cross-life links need durable life/body IDs, pending-offer revision, disposition receipts and retained world references. Current estate uses bounded 512-row lists and `kin`/`apprentice` labels; these cannot silently become a conserved generalized manifest. An office requires its own record, actual issuer/holder terms and disputes. Actor title booleans or a claimant's belief cannot create that office.

**Comic join:** merge with CA4 Office/Mantle through one carrier/disposition contract. A mantle's transferable gear, office, name and eligibility remain separate payloads. Adoption or appointment can transfer some without body inheritance.

## AB5 Knowledge claim

Minimal interface:

```text
FactVersion {id, subjectRef, field, value, editionRef?, worldInstanceRef,
  validFrom:{clockRef, at}, validUntil?, replacesRef?, causeRef}
KnowledgeClaim {id, observerRef, subjectRef, field, reportedValue,
  factVersionRef?, subjectEpoch?, stage, basisRef, observedAt:{clockRef, at},
  confidence:{kind, bandOrInterval?, calibrationRef?}, supersedesRef?}
readClaims(subjectRef, observerRef, fields) -> KnowledgeClaims
projectClaims(claims, KnownContext) -> {rows, uncertainty, knownStaleness}
```

**Extend/replace:** one semantic design shared with comic CA5, with separate truth-version and observer-claim ownership. Adapt simulation `{stage,value,at,cause,basis}` and B2 `{path,stage,value,at,evidenceRef}` to this read interface. B15 CV1 D3 nests bounded typed readings in B2 `value`; map readingId/bodyId/clockRef/sourceRef/meansRef/scopeRef/confidence into the claim reader. Keep its bounded bodyKnowledgeView as the first bio/status consumer, without requiring a universal fact-version store for CV1. A report received through testimony can reference an observation receipt; current causal `basis` has only four exact kinds and requires a situation, so do not inject a new `report` kind there without admission. No bulk copy of simulation knowledge into every body. Typed values/confidence/version links require an admitted extension. `seen/interpreted/understood` are learning stages, not probabilities. No basis is unknown evidence, not proof of direct observation.

Same-key knowledge currently overwrites on equal/higher stage. Conflicting/stale accounts therefore need distinct claim IDs and a selection projection, rather than one key per supposedly infallible truth. A world retcon appends a truth version; it does not rewrite every observer's memory. A diagnostic error changes a report, not world truth. Mutation of a body epoch and retcon of its origin can use the same version reference vocabulary without conflating their causes.

**Consumers:** command admission reads knowledge (`src/simulation_effects.js:110`), while directed body disclosures write separate observer/player records (`src/body_progression.js:28`). Bio (`src/character_bio.js:16`) and status window (`src/status_window.js:23`) are actual presentation endpoints but lack the shared body claim projection today. Both must consume the same viewer-safe rows before CV1 can claim truthful diagnosis.

**Save impact:** wrapper can read old records without inventing confidence or versions. New claim/version IDs, supersession and epistemic basis require versioned storage and references retained through compaction. Old values remain attributed legacy claims. Do not reveal a hidden later change by showing “stale” solely because private truth changed: distinguish a dated unrefreshed report from a discrepancy the viewer actually learned. Preserve sealed truths outside discovery routes, including tooltips, accessibility text, counts and error previews.

**Comic join:** CA5 + kit AX6 Observation + AX14 Overlay + AX15 Receipt + AX21 Projection share references and projection. Truth, observation, belief and version selection keep distinct responsibilities.

## AB6 Means

Minimal interface:

```text
MeansDefinition {id, revision, operation, channels, fieldScope, targetScope,
  supportRuleRef, precisionPolicyRef, costPolicyRef, discoveryRouteRef?}
previewMeans(request, KnownContext) -> {available, quotedCosts, visibleScope, reasons}
stageObservation(candidate, request, ActualContext, expectedSequence) -> plan
```

**Extend/replace:** compose current capability requirements, body/fuel/access, participants, realm observation routes and knowledge effects. Read eligibility and write claims through the common executor, never through rendering. A C0 cheat's `hooks` JSON is metadata until a dispatcher validates and runs a registered method; holding/awakening a card alone provides no medical scan. Biological sense, borrowed device and another person's report can each carry narrower evidence.

**Consumers:** body `show_*` commands require an actual meeting and demonstrable hands (`src/body_progression.js:25`); realm operating-source/evidence checks use physical support (`src/realm_boundary_rules.js:69`, `:100`). B15 CV1 D2 composes bodyLens on an already known system-quests card and adds a durable free “Review known body” action, not a second dormant status card selected by map order. That action reads known evidence and grants no scan or faculty. A universal diagnostic resolver is premature until two selected methods supply real field scopes and outcomes.

**Save impact:** pure eligibility wrapper adds none. Paid tests freeze method/target/body epoch/law revisions/costs and write their claim/receipt at the current command boundary. Known diagnostic output does not grant a source. NPCs use their own context and observer records. Communication requires an actual channel.

**Comic join:** CA7 mask-piercing/exposure is an observation using these means; CA2 is its presentation. Neither a skin nor a rank grants epistemic access.

## AB7 World dial profile

Minimal interface:

```text
DialDefinition {id, revision, type, allowedValues, defaultValue,
  resolverRef, reason, costPolicyRef}
ProfileSelection {worldInstanceRef, profileId, revision, overrides, adoptionReceiptRef?}
resolveWorldDials(selection, definitions, ActualContext) -> TypedDialValues
projectDialChoices(selection, KnownContext) -> DisclosedChoices
```

**Extend/replace:** one registry shared with comic CA1 and kit AX20, composed with kit AX2 Law. B2 `worldProfiles` becomes a body-profile selection/legacy compatibility adapter, not a second registry of independently mutable values. Immutable definitions may stay in the registry/pack manifest; pin actual selections in the existing world/body owners. Current `world_instances.js` definition keys are closed, so arbitrary `dials` cannot be appended without admission.

**Consumers:** native racial/height bonus selectors are real (`src/config.js:37`), and realm boundary operation/source support is real (`src/realm_boundary_rules.js:47`, `:100`). They are adaptation targets, not current readers of a shared dial registry. New comic timescale/revival/retcon consumers remain premature and unselected.

**Save impact:** none for immutable catalog alone; versioned profile selection for behavior changes. B2 legacy selection stays cosmetic, unsupported world/body stays neutral for bodily modifiers. Known local prohibitions still constrain their actual operations. Freeze selected dial/law revision with paid jobs and explicitly resolve changes while work is reserved. No automatic rebalance or destination-driven reroll.

**Comic join:** CA1 uses the same registry; presentation CA2 and information/realism density are separately typed options and do not imply mechanical laws. A world-specific prohibition is not a global prohibition.

## AB8 Consumer hook with cost

Minimal interface:

```text
queryBodyEffects({bodyRef, actionId, ActualContext, definitionRevision}) ->
  {multipliers, chanceDelta, staminaCostDelta, durationDelta,
   additionalCosts, contributionRefs}
applyBodyQuote(baseQuote, contributions, actionAdapter) -> FrozenQuote
projectBodyReasons(contributionRefs, KnownContext) -> KnownReasons
```

**Extend/replace:** B2 `queryBodyEffects` is the base contract, narrowed per registered action. Positive capacities stay in capabilities; signed impairments and costs use this adapter or existing conditions. Do not accept negative grants into `queryCapabilities`. Extend existing duration modifiers/cost reservation and native stat/chance buckets; no parallel physics, damage or job loop. Unsupported actions return exact identity values. A known reason is a separate projection of a contribution, not permission to disclose its hidden definition ID.

**Consumers:** actual `frontier.pack` time modifiers (`src/expedition_content.js:92`) and native sleep recovery (`src/main.js:2827`); native item crafting (`src/main.js:4238`) is another. New micro states in B12 still need their actual causes and scopes. Lockpicking, directional wind, handwriting and generalized persuasion are premature despite nearby craft/log/dialogue code.

**Save impact:** no derived modifier cache or rendered prose. Persist only selected quirk/state parameters, activation cause/timer and necessary message-deduplication cursor. Simulation commits freeze the quote; changing a body cannot rewrite a paid job. Native tick paths retain their existing save policy. Shared preview/execution helper prevents mismatched craft chance, reading ETA or combat affordability. Multipliers multiply; signed deltas add; final probability clamps to [0,1], stamina/duration stays nonnegative, units are defined per adapter. Acquisition, sustained use and settlement costs are separate; zero is valid.

**Comic join:** CA1 governs local effect policy, CA6 can provide actual resource costs, CA2 projects known reasons. None warrants a universal signed-modifier engine.

## AB9 Sample with provenance

Minimal interface:

```text
SampleLot {id, revision, materialDefinitionRef, templateSnapshotRef?,
  origin:{donorRef?, collectedAt?, processedAt?, evidenceRef},
  quality, purity:{unit, valueOrUnknown}, preservationRef, clockRef?}
SampleUnit {id, lotRef, currentHoldingRef, dispositionReceiptRef?}
readSample(unitRef, envelope) -> {lot, unit, holding}
previewSampleUse(unitRef, recipeRef, ActualContext) -> EligibilityAndReservation
```

**Extend/replace:** B11 sample lot/unit archive metadata joins exact inventory keys, escrow and custody. Crafting-material properties and diagnostic evidence can reference the same lot. Archive custody history never becomes a second current holder/count. A sample is not a source grant, proof of the alleged donor, learned technique or a clone self. Old stack material has unknown individual donor/time unless real evidence exists.

**Consumers:** ordinary material reservation/consumption (`src/simulation_effects.js:254`) and custody transfer (`:265`) are real supporting machinery. Sample-specific assay and edit are B11 proposals. **PREMATURE as a new general sample abstraction:** two live semantic sample consumers and one playable slice were not established. A local B11 lot/unit adapter is enough if that loop is selected.

**Save impact:** optional lot metadata and unique unit identity, validated against every inventory/escrow and retired consumption receipt. B11's `{id, sample}` item-key extension requires item reconstruction, trade/chest, acquisition and preflight support. No untested extra JSON key. Default stabilization has no decay; a harsh-world freshness dial needs a real clock, preservation rule and known costs. Aliquots require conservation receipts and new IDs, not duplicate ownership of one unit.

**Comic join:** CA4 may transfer stored material; CA5 preserves alleged provenance separately from actual origin. CA9 cross-world resemblance does not authenticate a donor.

## AB10 Transmission rule

Minimal interface:

```text
TransmissionRule {id, revision, eventKind, contributorRoles, carrierKinds,
  eligibleRef, donorDispositionRef, retainedPayloadRefs,
  expressionPolicyRef, costPolicyRef, variationTableRef?}
planTransmission(candidate, ruleRef, eventRef, contributorSnapshotRefs,
  recipientRef, expectedSequence) -> {frozenPlan, receiptRef}
projectTransmissionOffer(frozenPlan, KnownContext) -> OfferRows
```

**Extend/replace:** wrap current estate and teaching/power-transfer mechanisms as explicitly named policies. AB4 supplies links, AB3 supplies expression, AB11 supplies variation if needed. B3 owns prospective cross-life sidecar/frozen offer; B7 owns creation capsule dependency freezing. Body/genetic, soul, legal, taught and office relationships remain different. Rules include `none`; ordinary adoption transfers property/teaching without inventing inherited organs.

**Consumers:** live heir papers/apprentice routes (`src/heir_inheritance.js:36`, `src/life_experience_host.js:21`) and Watchcraft teaching (`src/village_career.js:145`) are real. Power copy/transfer already distinguishes donor loss/mastery (`src/simulation_effects.js:340`). **PREMATURE for a general heredity/clone/soul executor:** none of these establishes an implemented birth-template or soul transmission route. Keep current narrow policies until G30 or another slice is selected.

**Save impact:** event-time contributor/template snapshots, eligible recipient identity, policy revision, RNG result if any, conserved disposition, frozen offer and durable settlement key. A child's inputs freeze at the declared birth/conception/creation event; late inspection cannot read the parent's new current sheet. Historical mutable `player`/body IDs are insufficient. Current heir builder reconstructs expansion and clock0, so retained world state, trials, streams and old due times need explicit compatibility before general carry. Lossy biography is never inheritance authority. Receipt deduplication concerns one event, not all future transmissions.

**Comic join:** CA4 office transfer uses this interface with appointment/training rules; mantle is not a bloodline. CA9 copies/variants do not imply transmission. CA5 can describe an altered account without changing settled property.

## AB11 Seeded draw

Minimal interface, adapting the EXISTING named-stream service:

```text
decide(streams, {stream, key, ordinal, salt, algorithmRevision,
  tableRef, tableRevision}) -> {value, receipt}       // pure
commitDecision(candidate, causeRef, decision, resolvedResult) -> plan
readCommittedDecision(causeRef) -> resultOrAbsent
```

**Extend/replace:** reuse `seeded_streams.unitDecision`, `rollTable` and existing saved `expansion.streams`; retain legacy `expansion.rng` and simulation/event cursors. No second body RNG root by default. Current supported families include `world.people`, `discovery`, `text`, `legacy.action` and others, but **not `body.gen` or `body.modify`**. Proposed valid names: `world.people:body@<instance>` for intrinsic body slots, `discovery:body.modify@<instance>` for procedure outcome, and `text:body.name@<instance>` for names. Full keys pin body/cause/slot/epoch/rule revision and use canonical encoding. These names are proposals within the existing accepted family grammar, not registered body content.

**Consumers:** live generated-person/mixture roots (`src/main.js:2`, `:3`) and native combat decisions (`src/models/combat.js:80`); craft (`src/main.js:4215`) is another. B6/B7/B11 use the same seam prospectively. Intrinsic lazy fields use keyed decision ordinal0 and explicit frozen salt0, not a sequential cursor sensitive to observer order or the currently mutable cell salt. An actual authorized reroll supplies a new cause/policy and retains the original receipt.

**Save impact:** named stream root/cells/log already serialize. Retain settled outcome/cause index and required decision receipt in the owning body/edit/capsule, because stream log retains at most 256 entries and 32 per stream. The log cannot be permanent idempotence authority. `ensureStreams` can initialize a missing block and `streamSeed` calls it; neither may run from a pure projection or speculative preview. Existing fallback derives from saved legacy cursor or1, not a recoverable historical initial seed. Honor saved roots; new body integration does not claim original-seed recovery. Save decision/result/costs together before publication. Cosmetic lines never advance gameplay cursors.

**Comic join:** CA8 return schedule and CA10 event choices may reuse seeded decisions once selected; CA5 retcons require explicit causes and cannot be reload rerolls.

## AB12 Rank ladder view

Minimal interface:

```text
RankLadder {id, revision, domain, dimensions, anchors, labelRuleRef,
  issuerRef?, precisionPolicyRef, displayPolicyRef}
projectRank(ladderRef, subjectRef, supportedClaims, KnownContext) ->
  {labelOrUnknown, intervalOrBands?, basisRefs, ratedAt?, caveat?}
```

**Extend/replace:** a pure shared view over existing native level, career rank, model mastery bands, or observed appraisal claims. It does not create another rank progression store. Actual promotions/breakthroughs stay in their earned receipt owners. Named anchors compare only within a domain; a PRT classification, cultivation stage, guild office and Marvel dimension do not convert into universal damage/power. A grade can be an institutional guess or a verified office with different labels.

**Consumers:** live career ranks/promotions (`src/village_career.js:2`, `:92`) and native level presentation (`src/status_window.js:29`) supply two real presentation targets. `previewPowerModel` bands (`src/power_models.js:10`) are execution rules, not already fuzzy ratings. **PREMATURE for a generalized fuzzy-rating runtime:** CV5/CC1/comic CA3 have no selected live assessment producer. Start with a label adapter only when a chosen UI needs two ladders.

**Save impact:** read-only label adapter adds none. A recorded rating belongs to AB5 with ladder/issuer revision and date; a promoted rank remains career/progression state. Hidden numbers stay absent from visible rows unless the actual means supports them. Changed assessment never rewrites earned mastery, imposes a ceiling or grants a stat boost.

**Comic join:** merge AB12 and comic CA3 into one ladder/projection contract, owned by kit K3.4/CW4 and AX21; body CV5/CC1 are clients. CA2 changes framing only.
