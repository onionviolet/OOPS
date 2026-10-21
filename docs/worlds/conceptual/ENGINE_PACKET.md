# Conceptual ability engine packet

Status: Develop/Research packet r1, 2026-10-03. Exact source inspection and a proposed bounded proof; no runtime edit, build, browser, save or played outcome is claimed.
Role: ability design/implementation GM, chat `01a104a2-fabf-7bf1-a95f-1e93353b9196`; coordinator `01a1046a-bc9d-7351-83e1-98dc3cf4af54` retains shared contracts/integration. No children or dispatched implementers.
Use [role prompt](../../gm/ABILITY_IMPLEMENTATION_GM_PROMPT.md), [refresh protocol](../../GAME_MASTER_PROMPT.md#context-pressure-and-refresh), [live PROJECT](../../../PROJECT.md), [ability contract](../ABILITY_AUTHORING.md) and [reference cases](REFERENCE_CASES.md).
Read [assembly](../PROGRESSION_AND_ASSEMBLY.md) and [framework](../CAMPAIGN_FRAMEWORK.md) before source/body/instance changes. The five local ABILITY_VARIANTS files own setting semantics.
Seven exclusive new files only: the five variants owners, REFERENCE_CASES and this packet. Runtime, globals, sibling campaign/catalogue/ledger/brief/packets, generated files, private saves, LICENSE, commits and publication remain excluded.
Latest human steering: deepen abilities/progression without fixed taxonomies; user now extends open-ended design across other game aspects, including worlds, people, institutions, stories, activities, interaction and presentation.
All new typed names, threat, costs, policies and fixtures below are O proposals. They do not redefine the current one-realm/one-prestige milestone or select lethal/offline behavior.

## Inspected runtime and exact limits

| Live source/function | Actual foundation | Limit for conceptual semantics |
|---|---|---|
| [simulation.js](../../../src/simulation.js): `previewSimulationCommand`, `commitSimulationCommand` | Pure cloned preview; world/actor/target/life/occupancy, authored predicates, known costs, power checks; expected-sequence commit | Co-location is not touch/LOS/geometry. Commit selects registered ID; power-model parameters come from its registered definition, not arbitrary caller text |
| Same: `startCommand`, `completeJob`, `cancelSimulationJob` | Costs paid once at start; frozen target/revision/effects/outcome; cancellation policy | Completion applies frozen effects without a general fresh contact/body/source/target-life recheck; sustained interruption needs an adapter |
| Same: `answerSimulationEncounter`, `previewSimulationResponse` | Frozen authored turns, paid response, sequence checks and settlement | Response effects do not automatically run a power model, ownership/faculty/cooldown gate or increment power execution; authors must specify checks or add a common execution adapter |
| [power_models.js](../../../src/power_models.js): `previewPowerModel`, `resolveEffectAmount` | Practice/design/investment/authority/hybrid scope and bounded scalar formulas | Not a topology solver, arbitrary concept interpreter, exact donor clone or arbitrary expression evaluator |
| [simulation_effects.js](../../../src/simulation_effects.js): `applySimulationEffects` power branch | Copy/transfer of registered power ID, optional donor mastery, donor marker; transfer clears donor owned flag | No copied donor body, fuel/faculty, exact personal refinements, source instance, memory or faithful organ/soul custody transfer |
| Same: source/faculty/body branches | Acquired source definition, awakening/activation/suppression/development; scalar body properties | Definition-keyed records are not surgical anatomy, source-instance transfer or automatic native physiology |
| Same: vital branch; [native adapter](../../../src/native_gameplay_adapter.js) | Health/stamina changes with separate per-actor min/max clamps; selected native snapshots/publication | No conserved two-body HP transfer, maximum-health mutation or automatic life-state change |
| Same: knowledge/title/claim/condition branches | Actor-private knowledge, scoped title records, unique claims and declared conditions | No broad life-history read, enforced behavior program, recognition propagation, soul theft or universal restoration |
| [acquisition.js](../../../src/acquisition.js): `stageAcquisition`; effects inventory/custody | Validate real debits before grants; selected native owners, equipment exclusion and explicit loan policy | Item-key/count ownership is not a full unique specimen/part/damage graph; repair must not consume/grant a fake replacement identity |
| [expansion_engine.js](../../../src/expansion_engine.js), simulation boundary/transition | One joined clock, sequence/claims, safe-boundary transitions, explicit power-world allowlist checks | Decision/session pauses are not time stop; world/body metadata is not a native travel/contact ban unless an actual adapter checks it |
| [native_battle.js](../../../src/native_battle.js): `commitNativeBattleStrike` | Saved staged strike for the named Mara nonlethal duel | Bound validation/participants/end-at-one-HP are not general conceptual combat, parties, death or time-domain permission |
| [expansion_persistence.js](../../../src/expansion_persistence.js): `persistExpansionPlan`; [main.js](../../../src/main.js) | Validate/write staged envelope before caller publication; current save-failure pause | New domains/native projections require explicit compatibility and failed-write checks; an effect cause is not universal exactly-once execution |

`simulationFacts` exposes body/faculty/power and actual actor facts, while target build detail comes from the actor's observations. Authority model checks selected custody/jurisdiction/termination, not every social belief.
`power.worlds` and explicit execution predicates can block selected power commands. Native `nativeActionReasons` principally checks occupancy/life; a descriptive spiritual-body or world-primitive tag alone blocks nothing.
Jobs settle before conditions/expiry/checks/controllers at a shared boundary. That fixed order is not general simultaneous attacks or nested stopped-time ordering.
Sequence rejection protects a stale commit; `once`/claims/session state protect declared unique settlements. Relationship causes are deduplicated, but every repeated raw effect is not globally deduplicated.
A future adapter must preserve those actual services rather than adding a second inventory, reward path, clock or write-before-save UI.

## Proposed typed semantic contract

These are proposed authoring/adapter types, not current effect fields or installed APIs. Validate registered definitions; never evaluate a player-supplied concept sentence.
`TargetRef = ActorBody(actorId, bodyRevision) | ItemInstance(instanceId) | AuthoredObject(worldInstanceId, objectId) | SpatialSegment(sceneId, segmentId) | FunctionOwner(ownerRef, functionId)`.
`TriggerRef = DeliberateUse | EligibleContact(contactReceipt) | QualifiedObservation(evidenceReceipt) | VerifiedDefeat(encounterReceipt) | ActualDeath(lifeReceipt) | ConsumedExtraction(inputReceipt)`.
`AbilityUse = {abilityId, revision, actorId, sourceRef, methodRevision, modeId, targetRef, expectedSequence, evidenceRefs, paidInputs, declaredUncertainty}`.
`ScopeRule = {targetClass, count, extent, range, lineOrContact, jurisdiction, bodyInterface, exceptionRuleIds}`; unknown target state is not encoded as a guaranteed zero.
`ContactReceipt = {participants, targetRef, supportedChannel, observedAt, sceneRevision, validThrough, interruptionRule}`; co-location cannot forge it.
`Transformation = RepairSameInstance | ReadAuthoredMemory | ReadQualifiedFuture | ImposeActionConstraint | RemoveSegment | SuspendTimeDomain | AcquireMethodSnapshot | TransferVitalPair | TransferScopedAuthority | TransferFunctionLease`.
`Termination = {expiryDomain, paidUpkeep, breakConditions, restorationRule, residualChanges}`; completed output, ongoing source and retained ownership are separately explicit.
`ObservationProjection = {observerId, evidenceChannel, visibleResult, inferredCause, confidence, privateFieldsExcluded}`; a true source can reveal broad information, but only through its actual acquired function.
`UseReceipt = {commitId, activationId, targetRevision, sourceRevision, debitRefs, orderedTransforms, observedRefs, settledAt, restorationId}`; permanent acquisition/loss receipts outlive pruned display logs.
`MethodSnapshot = {definitionId, personalRevision, modes, copiedFacets, donorRef, evidenceRefs, sourceMeansProvided, donorLossPolicy}`; choose explicitly what faithful copying retains.
O `DevelopmentChange = {changeId, subjectRef, dimensionId, causeRef, paidInputRefs, beforeRevision, afterRevision, changedFunctions, verifiedFacetEvidence, retainedDomains, lostSupport, branchingPolicy}`; technique mastery, body evolution and equipment upgrade are different target transformations.
The proposed semantic types organize current examples; they are not an exhaustive ability ontology. A novel state domain/mechanism can justify a new validated adapter and compatibility contract, rather than a forced conversion to an existing stat or arbitrary executable concept string.
Preview reports known eligibility/cost/output envelope, spends/draws/writes nothing and does not expose private facts through a detailed rejection.
Commit revalidates authoritative state, freezes permitted parameters and uncertainty, reserves actual inputs/participants and records the meaningful source/target revisions.
Resolution applies a predeclared order to the actual owners; contact interruption, competing transforms, maximums and donor loss cannot be guessed after the outcome.
Observe only supported witnesses/reports; persist source state, partial damage, remaining steps, termination and receipt before publishing.
Repeated settlement/restoration rejects its exact receipt; returning/restoring a leased function never refunds already lost cargo, wounds or spent fuel.
Source suppression can disable execution while leaving method/ownership; source transfer must explicitly alter donor and recipient bodies/faculties rather than call definition-ID copy.

## Precise missing adapters

A1: validated actual target/contact/body-channel resolver integrated with command/response/native action checks; sustained uses recheck the declared live invariants before each impact/tick.
A2: identity-preserving condition/form/installed-object projection with custody; repair/removal/lease modifies the retained object and publishes its native condition once.
A3: private authored-memory read plus cause-bound typed action constraints enforced by commands, routines, controllers and native actions, with conflict/expiry/restoration.
A4: bounded scene topology/occupancy/erasure and navigation/impact reconciliation; removed state differs from destroyed/broken and retains actual history.
A5: stopped-time internal-step budget and affected-domain scheduler, native timers/object contact, queued impact order, exceptional movers and one-time release/catch-up receipts.
A6: method/source-instance acquisition fidelity and atomic donor effects; victory, death, token consumption and facultative theft have different evidence/body/output contracts.
A7: paired vital conservation and maximum/body-capacity publication; select donor floor/life policy, recipient overflow and eligible resistance without independent clamp artifacts.
A8: scoped appearance/credential/office recognition and exclusive function/source leases, actual issuer/instance authority and restoration, retaining stable actor identity.
A9: qualified future read with an explicit information source, authoritative snapshot, horizon/participants, assumptions, permitted private domains and update/retention; inference, frozen-outcome access and forward simulation are separate modes.
A10: caused progression settlement plus anatomy/source/native capacity reconciliation: actual body revisions change supported functions, fitting and execution while retained learning/provenance persists; bodily evolution cannot be implemented merely by writing an unused scalar trait.
First build must select only needed adapters. A small fixed authored scene can approximate object/contact/function state with exact registered facts; it cannot claim A1-A10 generally implemented.
Shared save/schema compatibility, native-world isolation and rebuilt visible execution remain integrator-owned. None is assigned to a child in this run.
Progression guard: `previewPowerModel` currently supports capacity/mastery bands; source/faculty effects support staged ownership/development, and body effects write scalar properties. They do not supply full anatomy, personal technique-revision evolution or automatic native equipment/max-capacity reconciliation.
Future development proof must separately pay/settle method practice and bodily change, demonstrate their distinct new functions and combined use, then reject missing anatomy/old fit/stale revision. Repair/recovery cannot replay advancement; reload/failed writes cannot duplicate mutations, rewards or retained source.

## Future-read extension and bounded proof

O `ForecastSnapshot = {readId, abilityRevision, sourceRef, stateSequence, targetRefs, horizonDomain, horizonEnd, candidatePolicyIds, conditionalInputs, allowedPrivateDomains, observedCourse, certaintyPolicy, staleRule}`; this is proposed data, not a current saved API.
Inspected `commitAction` and simulation `startCommand` retain already selected outcome/draw data in committed work. A qualified source could reveal that actual frozen course through a paid read without drawing a new result; legality still needs A9 and an information projection.
Broader future simulation cannot simply advance the live world: isolated state must include relevant native stats, inventory, timers, controllers, seeds and declared player/NPC policies. Omitted causes remain explicit uncertainty unless the actual source supplies them.
There are separate expansion RNG, simulation seed/check streams and saved native-battle seed/action count. Forecasting must preserve every live stream; do not turn “look again” into a reroll or silently give several incompatible futures for one unchanged course.
Proposed tiny proof: one fixed sentinel makes a committed feint followed by a strike. Pattern Read infers from visible posture; Near Echo reads the eligible committed sequence; Fork Lens compares two authored supported responses without guessing arbitrary future player input.
Pay reading cost separately from execution: O Near Echo spends two real focus units, while a correct sidestep requires two stamina and enough actual movement within the strike window. Seeing the strike never supplies those means.
Valid informed sidestep avoids the eligible strike; insufficient movement/fuel can still fail despite correct knowledge. Sufficient direct defense/output can win without forecasting. The fixed threat does not change to defeat the chosen sight method.
After an ally genuinely changes the mutable course, retain the old read with its snapshot/time and follow its declared stale policy. Updated information requires a lawful new read; an enforced-future variant needs a real fate mechanism beyond this fixture.
Gate: pure preview leaks no sequence/hidden cause, paid reads reveal only qualified information, interrupted reads retain only completed evidence, repeated/reloaded reads do not add steps/reroll/replay rewards, and failed writes publish neither cost nor vision.
This extends the design packet, not implementation scope. Five further families and their semantic/mastery distinctions are saved in [reference cases](REFERENCE_CASES.md#further-families-future-sight-and-other-deep-variants); original prototypes need no invented franchise evidence.

## Small original proof: The Borrowed Fastening

Proposed one-realm Frontier side scene, no new prestige or canonical world. Collector Siv owns one Band of Borrowed Fastening and wants a useful self-lock function for a workshop.
Fixed threat: full hand grip for one resolved beat transfers one eligible detachable latch's self-lock to that band, opens the latch and prevents relocking while held.
This bypasses eligible latch material strength; it really can spill the shipment. It does not steal ropes, actor identity, souls, body strength or arbitrary named concepts.
Band capacity is one held function; Siv has two actual band-charge units, one eligible activation costing both, and physical pry output three. These O numbers are fixed, not scaled to the player.
Author truth names shipment latch, spare clasp, band/source, owners and cargo. Player learns the contact cue and Siv's stated goal by an actual public demonstration/report, with confidence and time.
Opening uncertainty: shipment contents/unknown helpers/private source refinements stay private. Preview can say an exposed clasp may be opened, without revealing hidden NPC fields.
Route A: install one real guard sleeve around the shipment latch, use one rope and four stamina to haul via the supported path. Sleeve cover strength four exceeds Siv's fixed pry three and denies actual hand contact.
Route A success retains the covered latch, delivered cargo and spent sleeve/rope/stamina. A stronger imported body can also disarm/pry the band directly with tested output at least seven and actual four-stamina use.
Route B: knowingly relinquish one actual owned spare clasp to Siv, spend one lashing rope and two stamina to secure cargo independently of its latch, and cross while Siv retains the acquired fastening.
Route B is a paid causal/social counter: Siv's declared policy keeps the desired exclusive function instead of returning it for another theft; rope lashing secures this load without self-lock. It is not mind control or a compulsory dialogue password.
Both routes settle the same unique delivery claim once, but A retains the spare clasp and B records its actual transfer plus Siv's acquisition. No duplicate band/source/item is granted.
An unsupported exposed approach fails: Siv's eligible grip opens the cargo latch; declared stock falls and one delivery opportunity is lost. Ordinary HP stays under existing recovery; no death/extra life is inferred.
Abstention spends no player input or creates debt; the settlement buys its longer route from actual funds, Siv keeps their own resources and the offer expires under its existing played-time policy.
For the bounded response version, beats are frozen authored response order, not a claim of live milliseconds or general simultaneous combat. Native action during those responses follows current occupancy gates.
A modified sleeve below pry three can genuinely fail; missing rope/support, occupied handler, absent charge, wrong latch, already-held function and stale ownership must reject before spend.
No automatic repair restores spoiled shipment, spent charge or relinquished property. A later lawful return of the function restores only the same latch's self-lock once.
Minimal adapters: fixed scene contact/cover resolver, exclusive authored-object function state/receipt, owned fixture inventory/native publication and response execution/source checks. Dynamic component graphs and universal concept strings remain outside.
Proposed future writer packet: one named integrator reserves fixture definitions/UI, shared validation/effects/persistence and tests; exact paths are assigned only after the brief/adapters are approved. There is no invented callable planner in this document.

## Observable acceptance and negative gates

Compare A, B, unprotected failure and abstention on the same fixed fixture; show material costs, actual latch/cargo/holder state and different aftermath. A sufficiently strong direct route must work for its real physical reason.
Pure preview/inspection cannot spend, copy, reveal hidden source/contents, reroll, activate theft or settle delivery. An invalid target/support/custody/stale state rejects before all debits.
Interrupt after one legally paid action; retain actual partial cover, transferred clasp, stolen function and spent resources; cancellation follows its frozen refund/forfeit policy.
Reload mid-commitment and after settlement/restoration; no extra charge, internal beat, acquisition, healthy body, returned clasp or duplicate shipment. Import must validate revision/cause/target links.
Replay the same acquisition/settlement/restoration receipt and stale sequence; repeated discovery grants no extra faculty/unique reward, while a new legal ordinary use pays again where repeatable.
Inject failed storage at commitment and settlement: no live item/function/knowledge/cargo/cost publication; existing pause/reload behavior stays honest. Failed-write recovery never silently settles a second time.
For later time-stop/vital/behavior adapters, additionally test exhausted internal steps, double release/catch-up, constrained native/routine actions, full recipient, donor floor and simultaneous competing transfers.
Runtime verification requires source rebuild, generated separate-origin save/reload/import and visible actual execution. Source inspection, document checks and hypothetical outcomes here are not that evidence.

## Input snapshot and recovery checkpoint

Checkout: `/Users/weiwei/code/yet-another-idle-rpg`; inspected HEAD `97c28efece4fd6248b6f075ad0c6927c3d0432df`; extensive preexisting dirty work preserved.
Captured SHA256 values identify the dirty inputs read during this run, not a clean commit or a promise that concurrently owned documentation cannot change.

| Input | SHA256 at capture |
|---|---|
| `AGENTS.md` | `3524712083267d0cddbad38ccc10c9eee2181ba64904490a9e367cd7d7973aaa` |
| `PROJECT.md` | `fa8ce552565a0ab09bfd82da81a67dae1d9f1516f96c151d3a8e043369bc3997` |
| `docs/GAME_MASTER_PROMPT.md` | `80f615e02151a5c787bdb4351c62b26e6e42a9f99ac93cb6330cb63fe581bbba` |
| `docs/gm/ABILITY_IMPLEMENTATION_GM_PROMPT.md` | `cd140f54af32f9411d053c5c80f8ee43c145eab79274039fdac5163fa9076a31` |
| `docs/worlds/ABILITY_AUTHORING.md` | `a6062efad9c196ab069bee910c543bca45f89ad9b74907f5f7cabb900e4b1687` |
| `docs/worlds/PROGRESSION_AND_ASSEMBLY.md` | `7bc6d184f03306863ffa47e564552a15b88cc927aa03ecc348e7b3e059d2c655` |
| `docs/worlds/CAMPAIGN_FRAMEWORK.md` | `c1c796a29139284bbeda99d9caf2ad57e8ddd797cb11249eb073d146269550f4` |
| `src/simulation.js` | `c824114398d941db6cf393cf6671c66519e695acff5855590cd406e054a4a056` |
| `src/simulation_contracts.js` | `6dd71c3d5024d22767d8e26d19a22c614f0c71f2f3d1980196f5ed259d18b2af` |
| `src/simulation_effects.js` | `e64d422c240a78dfd94410fe73db7b8a95c785136369a5df41918670cc2e5db8` |
| `src/power_models.js` | `cbf6d86aea5cdfd1fda9bb39dddb208944c210e91c60196283f5ea731d3c23b7` |
| `src/native_gameplay_adapter.js` | `41900a2254f3db55fdf9ca8d59c6125ae2797947521756f319fe993f1b7ea8ad` |
| `src/native_battle.js` | `ddea1f34a72524d85f0817871b595a26c939b3d63637d07ffff5953fb6879ab9` |
| `src/expansion_persistence.js` | `57cb4f38c8023dbb796ab23ae4a790e01d3a0ca12a2863c9c7fe3cc87060b2e0` |
| `docs/worlds/skyrim/CAMPAIGN.md` | `f943464572698c190ec0f2402fd3c948b59fd62d485332b50ef45fa9b909a329` |
| `docs/worlds/skyrim/MODULE_CATALOGUE.md` | `fde1b8c4e8d116bdd7a4bca22daf1dd6934d1e7ffba07c9f2c4b8ab7861092d4` |
| `docs/worlds/skyrim/SOURCE_LEDGER.md` | `2820aaffdf7ab84eb68401fe8b90418563cf8c05b8108187544b39b87a2774f3` |
| `docs/worlds/fallout/CAMPAIGN.md` | `f5a7adccf642dcd955cda490e142a317c53380e35b601e5e496fc90ba052d790` |
| `docs/worlds/fallout/MODULE_CATALOGUE.md` | `a1ef5dc6faf96e4ebfa48662f8c83e86df39b8c656dfc00025d77c456937233e` |
| `docs/worlds/fallout/SOURCE_LEDGER.md` | `d4c4eed832b8937879df19dae543de538dd5e7ab839bc4fa28c36d9fc5455c2f` |
| `docs/worlds/elden-ring/CAMPAIGN.md` | `d841e8d552eece42d162816aa24bcd1018837ddbf2b44c8fa1d057216947d8ad` |
| `docs/worlds/elden-ring/MODULE_CATALOGUE.md` | `8473ed1ac6dc3f329c8ee8c3b751dcc4f27668c0076df3b2d40ecaf24c961fd1` |
| `docs/worlds/elden-ring/SOURCE_LEDGER.md` | `46799b854b3b6cb7c000c9796461e319132dbde033560577a557af2d1fca1052` |
| `docs/worlds/naruto/CAMPAIGN.md` | `d9b4af786a4faa084ca9b0172321307fd4e65156a1492a2b65cf1bd4075b40b0` |
| `docs/worlds/naruto/MODULE_CATALOGUE.md` | `4b9811c2b9e48481fca3d7a594889ae3911418a8c7b1715053be93f48c39a4ee` |
| `docs/worlds/naruto/SOURCE_LEDGER.md` | `d0636f17f1425b1d3bacd670f31611845243112251e76239bff3299ec8da8004` |
| `docs/worlds/bleach/CAMPAIGN.md` | `cff4a6d881a08f46c3beaa8c015348fa3eed73456c23fee8be0ae7e1bf970b4d` |
| `docs/worlds/bleach/MODULE_CATALOGUE.md` | `22144a8ea27f835fd5e39bc891f6aa84a4c2f3bf6d4a18e0f89267ebb6513b50` |
| `docs/worlds/bleach/SOURCE_LEDGER.md` | `9d41e919192d7ffdd7ec324135c99afbe3b0bdb633d145616c76f6d153c7ec57` |
| `src/expansion_engine.js` | `3fc85b2b973b9c377d9d3c32bc1580cc0322b721cec0af3a8d6a4b501e4e92d1` |
| `src/simulation_resolution.js` | `8d32c68ac6b826479e0786a86259cecbff258736365d6e8dfa2d62bf4c520185` |
| `src/main.js` | `bb740615c5b25d4985079662753c7d7e4617cf57a2730e685eb3e758b7726034` |
| `src/energy_resources.js` | `cc619def4c618a7b7128c43c499864a4ccc306d5f54dc20660f15004bbbb55ef` |
| `src/people_knowledge.js` | `53fe9acd2e4d79219f781249170d2a45bc8ac989f52c97ac90824abec38801f0` |
| `src/native_equipment_transaction.js` | `573dde38ee5bdaa572c95637a35fede1b461f1caf5fa3078e09c93786d73ed02` |
| `src/acquisition.js` | `4d665d4532ac87312034f763b3e598ae7314ee11fec1805e42df2e44fd9b5b29` |

Checkpoint r6: seven owners retained; follow-ups edit only the two conceptual files. Existing cases/maps/A1-A10 and additional progression candidates remain; latest human correction extends open-ended design across the game. Direction is captured for coordinator integration, without new writers, runtime rules or selected worlds.
No children, model qualification, runtime processes/test origin, unknown writes, commits, publication or private-save access from this role. All tool writes completed synchronously.
Document gate r6: prior r4 checked 54 local links/anchors, initial structure and cited execution/development source anchors. Current two-file readback/local-link/anchor/whitespace checks passed. REFERENCE_CASES grew under subsequent human requests; five local dossiers stay bounded. Runtime gates remain unrun.
Re-read master checkpoint revision 8 and relevant shared-contract updates: master completed initial integration and retired active specialist reservations. This human-requested follow-up updates only the two existing conceptual owners; no new lane, worker, runtime or shared owner is acquired.
Follow-up input drift affects four master-owned documents; inspected runtime, ABILITY_AUTHORING, role prompt and five campaign/catalogue/ledger sets still match capture. Changes concern completed delivery, scope/owner routing and broader candidate worlds; no conflict with the original future-read proposals was found.
Reconciled PROJECT SHA256: `359b062c350e51849cce7ed23767dcadc2a7750d688c6f251c74e017a4b8031b`; master checkpoint remains revision 8, with initial integration recorded separately from these addenda.
Reconciled GAME_MASTER_PROMPT SHA256: `9d38b0784850d72aec19034151ad0b40b2971adf05906f76db09b25317e8f479`.
Reconciled PROGRESSION_AND_ASSEMBLY SHA256: `a6ba3088d1330823318a648f531903a219e9c5100356eccabf5c3c5d46d6f179`.
Reconciled CAMPAIGN_FRAMEWORK SHA256: `a1918358694147bbc90ac85e05bed59302ae9b60146f7850b6d9485a7dce532d`; re-read current framework review, preserving source/invention, ownership and unrun runtime gates.
Master's initial integration passed; these follow-up addenda still need its review. Build/browser/save/human fiction/balance gates remain unrun. Future reading needs causal coverage, paid information and isolated clock/RNG/native inputs; biological/source/method evolution needs actual function/revision/body/fit reconciliation and caused advancement receipts.
Resume: read this checkpoint/role/live PROJECT and inspect changed inputs/real operations before writes. Coordinator integrates the addenda/open-ended direction, then freezes one actual interaction with a named integrator; this packet authorizes no runtime implementation or leaf dispatch.


## Evidence-gap detail, 2026-10-20

WPD-R13, ACCOUNT FOR NOW: WG22's continuity seam is observable evidence only
when an affected observer has a channel to notice it. A memory edit/time effect
need not guarantee a visible tell, and a tell need not identify its cause.
Before implementing a selected effect, declare its actual target, duration,
resource owner, interruption/expiry and local-time/absence policy rather than
add a universal conceptual-power detector. Level/effort: coordinator medium for
causal/save ordering; Luna low for supplied fixtures. Done check: author truth,
observer evidence and inferred cause stay distinct; the effect and its actual
remaining cost survive current-format pending/final round trips. Broader
conceptual families, general counter-search and offline policies remain later
proposals unless the selected operation needs them. This family is not a
separate campaign world and this audit dispatches no runtime proof.
