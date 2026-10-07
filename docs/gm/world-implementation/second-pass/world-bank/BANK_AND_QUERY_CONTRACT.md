# Reviewed world bank and scoped query contract

Proposal revision 1, 2026-10-04. All new record shapes, query operations and service names here are design notation. [Capability matrix](COVERAGE_AND_CAPABILITY.json) distinguishes them from actual exports. This consumes [authoring](../authoring/REPORT.md), [foundations](../foundations/REPORT.md) and [token retrieval](../token-efficiency/REPORT.md); it does not replace their owner contracts or the source dossiers.

## Five authorities and version rules

| Authority | Record and writer | Meaning and correction policy |
|---|---|---|
| Reviewed reference | Source GM's existing claims/notes, adapted into an immutable reference revision | Edition hash, source locator, claim kind, review receipt, valid occurrence interval/partial order, reveal position, exceptions and unknowns. New corrections supersede claims explicitly; retain old references used by commitments |
| Authored branch policy | Local World GM, shared contracts accepted by Engine/master | Selected start, divergence permission, local rules, entry/exit and absence policy. Reference fidelity, original extension and prototype numerical balance have separate labels |
| Committed state | Existing actor, simulation, native inventory/body and bound world-instance owners | Actual identity, life/body, sources/fuel, quantities/custody, location, work, clocks and consequences. Reference revisions never rewrite these silently |
| Evidence and belief | Observer's attributed observations/assertions plus derived current belief | Who learned what, when, from whom, by which channel and with what uncertainty. An observed assertion proves speech occurred; its contents may be false |
| Derived projection | Read-only author/actor/player/task view, no new authoritative save mirror | Query input revisions and selected dependencies determine freshness. Invalidating a view recomputes it; it neither rewinds history nor grants rewards |

Reference identity is world/source family + exact edition hash + claim ID + claim revision. Distinct editions, source translations and continuities can disagree without overwriting each other. Add adapters to current claim formats, not a second manually maintained canon ledger. A review receipt names criteria and inputs, not merely a hash. Preserve source labels such as witnessed, reported, narrator, inference, original and unknown. A reported custom must retain its speaker and time.

Independent version axes: reference revision; package/definition revision; authored policy revision; operating content revision; state schema/migration; instance/state sequence. A typo can update prose projection without changing paid work. Changed mechanics, identity or IDs need an explicit Engine compatibility choice: compatible addition, frozen commitment, migration or recoverable incompatibility. Missing optional bank state introduces no enrollment/reward. Do not silently upgrade the current expansion5/simulation3/realmPrototype2 save.

## Record families and closure

Use stable IDs and typed relations for laws/exceptions; geography/routes/materials; cultures/institutions/rights; actors/bodies/relationships; items/components/recipes; talents/methods/abilities/sources; events/eras/knowledge disclosures. A family may add a new primitive when its actual function does not fit existing types. Shared categories are retrieval conveniences, never a mandatory universal rank or mechanism vocabulary.

Each executable feature row requires acquisition, support, function/target, actual use consumer, cost/fuel/time, growth, counter/interruption, portability and provenance. Link its actual owner/registration/enrollment/native/UI bindings and later acceptance ID. A descriptive source catalogue can legitimately lack an executable binding; mark it reference-only. Known source-defined functions remain positive requirements, including genuine superiority. Represent an inexhaustible rule as a guarded semantic function, not an IEEE infinity value or an arbitrary finite replacement. Current finite-number models need a bespoke consumer for that case.

The proposed minimum shapes are recorded as field contracts in EXAMPLES.json. Reference claims carry subjects, relation/value, evidence kind, review/input versions, occurrence validity, reveal locator, exceptions and unknowns. Branch policy carries explicit overrides and activation/time/compatibility choices. Individual profiles retain identity/body/instance, priors/seed/revisions/overrides and actual initial grants. Assertions retain speaker/recipient, content, channel and learning receipt separately from belief selection. Query responses identify complete trusted closure, safe observer payload and input revision vector. These fields are conceptual requirements; Engine chooses concrete schemas and migration only after review.

Closure follows required relations recursively: method -> source/body -> local support -> fuel/stock/tool -> permission/contact/clock -> consumer/effects -> settlement/aftermath; add cited exceptions and contradictory claims that affect the selected action. Soft background description can be omitted. Mandatory requirements cannot be dropped to hit a context budget. If a required chain exceeds the budget, partition it into linked complete packets or return an explicit incomplete/unexecutable result. Never invent an executable quote from a shortened summary.

## Proposed query request and response

Request fields: purpose/task; access class and trusted observer identity; source edition and cutoff; selected occurrence point/era; continuity/branch/instance; region/layer/contact channel; actor/body/life; requested feature IDs; actual state/policy/reference revisions; optional presentation budget. Null clock synchronization or missing scene knowledge stays unknown. Edition cutoff constrains author evidence; occurrence and learning filters still apply within that cutoff.

Data flow:

1. Resolve trusted IDs, exact edition, review state and selected branch. Filter reference facts by occurrence validity and source cutoff; collect qualified unknowns and explicit contradictions.
2. Join committed state from actual owners at the requested sequence. For an altered branch use state/events, not canonical outcomes, for availability. Mark absent/unmaterialized records; never infer actual stock from recipe lists, job titles or power descriptions.
3. Resolve required support and local exceptions. A trusted mechanical verifier can inspect relevant private truth to determine legality. It returns a safe actionable refusal or quoted consequence through a declared disclosure policy.
4. Project each speaker/player separately from their evidence/learning history and contact rights. Author-only facts and private motives cannot enter a speaker card through dependencies, tooltip reasons, logs, labels or counts. Keep testimony, old-life memory and prediction labelled.
5. Return selected records, evidence locators/review qualifications, required dependency IDs, input revision vector, known action costs/outcomes and withheld/unknown/incomplete status. The actor payload carries no secret record names or spoiler-revealing rejection details. Stale revision rejects action commit; render does not sample or mutate.

The query implementation does not exist. Current worldInstanceView accepts caller-provided known ID lists; that is useful projection groundwork, not a complete authorization/query service. inspectActorChoices exposes the actor's current single-topic knowledge and registered command previews; target/context/era privacy still needs explicit bindings. Capability rows WB-C02/06/09 qualify these seams.

Use an author bundle and separately constructed observer bundles. Runtime need not load a full author-secret bank to render ordinary UI. A fully client-owned single-player game can enforce presentation boundaries but cannot promise secrecy against inspection of shipped assets. Do not describe a caller-supplied author flag as authenticated authorization.

## Storage, retrieval and scale

Keep source-owner files authoritative. Proposed derived indexes partition by edition/world/era/region and map stable claim IDs to exact owner paths/locators. Maintain inverted IDs for prerequisite, actor, institution and feature retrieval; rebuild indexes when corresponding fingerprints change. Cache only revision-bound projections, with dependency invalidation for knowledge, stock/custody, life/body, clock, location, relationship/commitment and definition changes. Avoid a global mutable summary.

Whole-bank review and bounded active simulation are different work. Enrollment selects explicit package actors/sites/checks/controllers/onEnroll effects, with a manifest showing their closure before registration. AUTH02 documents why current enrollSimulation scans a composed registry. Registering 10,000 definitions must not automatically provision 10,000 people. Source state builders are pure proposed authoring tools; activation still uses the real transaction.

Minimal route: claim-format adapters, pure projection, explicit activation intent, instance resolver and diagnostics feeding existing planners/publisher. Wider rewrite: separate graph database, general psychology engine and new inventory/save interpreter. The latter adds ownership/migration work without a demonstrated acceptance benefit for these fixtures. Use it only after a named scale/function failure justifies it.

No latency, memory, token or recall savings measurements were obtained. A later permitted benchmark should separate cold reference lookup, closure/projection, hot actor decision, active scheduler cost and publication size across increasing bank and active-actor counts. Report omissions and function fidelity alongside speed. File/word counts and indexed retrieval alone cannot establish savings or complete gameplay.
