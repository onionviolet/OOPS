# Melvor Idle adaptation packets

2026-10-06. Four ranked original proposals, drawn from a broader source study. These are unselected and unimplemented. [Report](REPORT.md), [findings](FINDINGS.json), [exact coverage](COVERAGE.json) and [current owner pins](YAIR_OWNER_AUDIT.json) retain the evidence and larger implications. Raw game code/data remains private outside Git.

The first useful settlement-slip packet was published early as MEL-P01; later findings put recipe choice, a survey consumer and a finite native policy ahead of it. IDs remain stable. No new realm, prestige layer, inventory, scheduler, publisher or offline-time rule is selected. The familiar opening remains authoritative. All player, browser, save, failure, regression and director gates below are later backlog, not checks run during this research.

## 1. MEL-P02: Choose the real recipe for a finite kit reserve

Meet Eda at the existing Village bench. Deliberately choose the resin method or your earned ordinary frame for up to three accepted supply batches. Compare actual owned inputs,effort and time. Spend the resulting kits on the existing field work; the reserve holds or pauses using its selected recipe.

**Prerequisites.** Resin route retains its current enrollment/method/support. Frame route needs actual completed frame,retained bench-use right and supported hands/body. The ordinary frame needs no special charged source,teacher participation or cooling sleeve.

**Actual cost and time.** Current resin:1 Set repair resin +2 Sound repair staves +1 stamina +3 played minutes ->2 Prepared survey kits. Current ordinary frame:1 Tree sap +2 Sound repair staves +2 stamina +6 minutes ->2 same native kits. Costs are source-existing,not new balance.

**Specific missing consumer.** src/feature_expansion_work_plan.js23-47 admits only resin policy/definition/costs; advanceOne207-209 only checks resin+sound inputs. Add one explicit frame-route plan/facts projection and narrowly admitted exact-definition branch. No general purpose crafting planner is required.

**Consequences retained.** Selected route does not silently fall back when sap,resin,body,bench support or stamina is missing. Exact held materials/refunds remain owned by current jobs; accepted cancellations still consume the finite allowance. Whole two-kit batch output and4/2 hold/restart semantics persist.

**Compatibility.** Keep existing revision1 resin cursor and frozen jobs byte-compatible. Frame route must require explicit new optional accepted plan/receipt and existing audit fixture enrollment; absent state inert. Named route stored as exact definition/revision, not inferred from old completed counts. If additional state field/schema is required, migration/compatibility decision and later save/reload gate belong to integrator.

**Later observable gate.** From supported enrolled Village state, compare the two real quotes. A chosen frame batch spends1 sap+2 sound staves+2 stamina, reserves6 played minutes and creates2 native kits; the selected resin route retains3min terms. Spend kits through an existing field consumer; hold/resume at4/2, pause on missing selected means, no fallback, no kit/output after cancelled or unsupported completion, no4th accepted batch. Deferred save/reload checks preserve old resin cursor and original opening.

**Current owners.** `src/audited_workshop_fixture.js:63–67` (existing ordinary frame recipe and completion support); `src/feature_expansion_work_plan.js:23–47` (current exact resin-policy validator); `src/feature_expansion_work_plan.js:179–260` (existing reservation/hold/pause/budget boundary); `src/audited_kit_reserve_content.js:5–23` (existing stock thresholds/recipe terms); `src/expansion_persistence.js:7–51` (same durable publisher).

**Source support.** MEL-PROD-C01, MEL-PROD-C03, MEL-PROD-C07 in [FINDINGS](FINDINGS.json); precise hashes and reader references remain there.

## 2. MEL-P03: An earned local survey becomes a finite recovery lead

Finish the existing ordinary or loaded Shack survey,then learn one attributed local recovery lead. Choose a supported paid search or ordinary inspection. A finite actual compatible offcut can reach the existing repair/salvage consumer; remembered knowledge remains when the material source is exhausted.

**Prerequisites.** Own actual completed survey knowledge and current earned workshop access. Existing ordinary survey holds1 log+1 kit for4 minutes and3 stamina; loaded specialization uses2 stamina and the same time,returning held objects. Knowledge alone is not physical loot.

**Actual cost and time.** Proposed original first proof:one local3-minute/1-stamina search using a held owned survey kit,returning that kit. Success transfers at most1 Compatible repair offcut from an explicitly declared finite world/local owner. No absent stock becomes free player stock. Exact location/name/result/stock and balance remain reversible proposals.

**Specific missing consumer.** A leaf local availability/search adapter consumes the specific retained remainder_home.survey_ordinary/loaded knowledge and transfers finite real stock. Current survey commands only record firsthand load knowledge; no targeted consumer of those specific receipts was found. Refresh source before implementation.

**Consequences retained.** Unknown lead stays hidden from search/badges/tooltips. Survey does not grant material ownership. Empty or interrupted search retains disclosed spent effort unless an explicit job refund applies. Exhausted source cannot be farmed; ordinary survey remains useful without exclusive training.

**Compatibility.** Explicit optional leaf admission; missing old state remains inert/unknown,no backfilled survey history. Same actor/body,known provenance,site,custody,inventory,job,clock and durable publisher. Existing frozen jobs retain meaning.

**Later observable gate.** Disposable opt-in state:complete ordinary survey -> known lead without spoiler -> pay one real search -> transfer finite stock and spend it through an existing repair use -> exhausted lead retains knowledge; old unenrolled state receives no grant. Reload/import/failure/director gates deferred.

**Current owners.** `src/audit_remainder_home_content.js:143–151` (actual survey cost/returned objects and knowledge); `src/skill_discovery.js:123–138` (knowledge-filtered known lead projection); `src/audit_remainder_home_host.js:1–40` (existing local command projection/host); `src/simulation.js:214–259` (actual timed support/failure/settlement); `src/artifact_collection.js:100–125` (reusable carrier/actual item scene compiler already exists); `src/expansion_persistence.js:7–51` (same durable publisher).

**Source support.** MEL-EXP01, MEL-EXP03 in [FINDINGS](FINDINGS.json); precise hashes and reader references remain there.

## 3. MEL-P04: An explicitly accepted guard-and-withdraw policy

For one newly admitted native encounter,choose manual action or a finite preparation policy. Use one actually reserved physical guard at a visible readiness boundary; withdraw at the agreed later boundary while retaining injuries,spent stock and unspent equipment.

**Prerequisites.** Current supported body,source,consent and real admitted prep; existing host legal-action quote. A known enemy name or high stat is not sufficient preparation.

**Actual cost and time.** Reuse current one physical preparation and2-stamina guard. Existing combat cadence pays time. Proposed proof thresholds,subject to balance review:guard once when own HP reaches60% or lower;withdraw at30% or lower or below2 stamina at a later legal player cadence. Enemy cadence can act first; this is no survival guarantee.

**Specific missing consumer.** featureNativeAction currently handles defended-open-choice pauses, conduct/recovery guards, existing helper release and default strike; it has no explicitly accepted finite preparation manifest that chooses one admitted physical guard at a player-set readiness boundary and withdraws when that accepted resource/condition limit is reached. Existing automatic favourite effects and stock reserve remain their owners; this proposal does not replace them.

**Consequences retained.** Keep existing defense-earned choice manual,helper loss/body/stock/stamina support and single unused-prep/rope return. Spent inputs/injuries and won/lost/escaped/objective/withdrawn records remain distinct. Native favourite consumables already exist and retain their current owner.

**Compatibility.** Explicit versioned policy only in newly admitted encounter. Absent policy retains current choices; old frozen3/4 and existing5 must not acquire hidden behavior. Existing simulation session/item/stock/clock/vitals/RNG/token/one durable publisher remain authoritative; no new inventory/save publisher/scheduler or offline combat guarantee.

**Later observable gate.** Generated newly admitted encounter:review actual prep quote/manual alternative;observe one legal paid guard;hit stop boundary and withdraw with exact spent/returned stock;stale tokens cannot repeat it. Reload/import/failed-save/legacy/director gates deferred.

**Current owners.** `src/feature_expansion_battle.js:407–438` (existing legal native action selection/defensive-window pause); `src/feature_expansion_battle_host.js:61–84` (saved action adapter on same combat cadence); `src/audit_remainder_combat_objectives_battle.js:15–145` (real physical prep/rope and settlement); `src/native_storage_transaction.js:7–33` (owned stock conservation); `src/expansion_persistence.js:7–51` (same durable publisher).

**Source support.** MEL-C1, MEL-C2, MEL-C3, MEL-C4, SHOP01 in [FINDINGS](FINDINGS.json); precise hashes and reader references remain there.

## 4. MEL-P01: A settlement slip for one finite supply plan

At Eda's familiar Village bench, accept the existing finite resin reserve. After real played boundaries, open its slip to see accepted/refunded/finished batches, owned materials and stamina spent, actual kits received, played minutes and why future work held or paused. Resume only through the existing eligible control.

**Specific missing consumer.** WorkPlanView projects state, next price and accepted job, and current logs/news give labels. Add a bounded per-plan settlement projection joining each accepted job to its actual conserved stock/vital deltas, outcome and time. Do not substitute current unrelated stock changes or repeat reward effects.

**Consequences retained.** Cancelled/refunded accepted batches still use the current3-commitment reserve allowance; elapsed played time remains spent. Real depletion, custody exclusion, site/body/consent pauses persist.

**Compatibility.** Start as an ephemeral view from successful staged before/after publication plus exact job IDs. If a durable slip is selected, use optional versioned bounded metadata tied to retained receipt IDs under existing reader/publisher; missing old metadata is unknown rather than invented history. No offline catchup policy or scheduler added.

**Later observable gate.** Fresh disposable save: accept3 finite commitments across complete/cancel/support-loss; inspect real owned stock/stamina/time and exact slip, reload and confirm no doubled reward or invented old receipt. These gameplay/save gates remain deferred.

**Current owners.** `src/feature_expansion_work_plan.js:146–159` (settle exact accepted job/cursor outcome); `src/feature_expansion_work_plan.js:179–260` (supported stock hold/pause/budget and re-quote); `src/feature_expansion_work_plan.js:331–354` (current accepted and next-step view); `src/simulation.js:214–259` (actual completed/refunded/cancelled outcome); `src/expansion_persistence.js:7–51` (existing durable publisher); `src/event_feed.js:71–78` (known recent news already exists).

**Source support.** OFF01, OFF02 in [FINDINGS](FINDINGS.json); precise hashes and reader references remain there.

## Wider work retained separately

[FINDINGS](FINDINGS.json) also preserves profession bottlenecks, mastery investment and checkpoint loss, passive versus material support, discovery versus possession, paid combat cadence, damage compatibility, expansion-specific resources, safe interruption, and explicit unread queries. Harvesting site continuity is parked because a general warmup meter could duplicate existing finite jobs or add unwanted upkeep. The four small packets do not replace that wider mechanic map.
