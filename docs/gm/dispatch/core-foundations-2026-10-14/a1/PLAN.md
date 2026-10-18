# A1: core consolidation without stopping feature work

**Current reuse boundary, 2026-10-18:** this is an unrun 2026-10-14 proposal,
not an alternate live runtime specification. Current AR1–AR16 and the later
modular brief/checkpoint own the implemented domain registry and M1–M3 evidence.
Recover those before selecting another seam. The original census, API sketch,
save-format plan and ranked worktrees below are retained design history; they
do not require a second registry, migration chain or re-extraction.

2026-10-14. Proposal only, for the coordinating Claude session and Weibao.
Extends scorecard F2/F3 and M2-M5/M11; A1-prefixed codes avoid collisions
with the root findings and other lanes.

**A1-D1 INFERRED:** reduce shared-file edits through read adapters and an
injected runtime registry. Move one existing world or home feature at a time,
without changing its rules or saved payload. Keep store mergers and the new
save format behind separate, explicit compatibility changes. Features can
continue through existing hosts while their own adapter is moved.

Authority: [COMMON](../COMMON.md), [scorecard](../../../../CORE_FOUNDATIONS_SCORECARD_2026-10-14.md),
PROJECT.md standing priorities, and docs/USER_VISION.md. Canon-first content
order and one-realm/one-prestige first milestone remain intact. Moving an
existing adapter is infrastructure work, not permission to expand a world.
A Soldier's Life runtime stays paused; no private packs or SECRETS files were
opened. Nonhuman-starts owns body/control design, procgen owns streams/mixing,
derived-snapshots owns snapshots/offline time, W6 owns the engine template.
No new offline policy, content census or world implementation is required here.

Evidence labels: **SHOWN** means source or local document actually read;
**INFERRED** means this lane's design; **UNKNOWN** means not established.
All implementation steps and proposed tests below are INFERRED and unrun.
No gameplay completion, native proof or director acceptance is claimed.

## A1-F6: live snapshot and limits (SHOWN)

Main checkout: `codex/gameplay-foundations`, HEAD
`5991761632234aea99e81b38195ed6eb5b9a713b` at final source refresh. Initial read was
`11cadb30ae5dd2fe0f0e77508790b1d6dec079d6`; a concurrent merge changed
main.js and its cited regions were re-read/remapped. The root scorecard cites
`5c084e50`; A5's report cites a different worktree base. Line numbers below
come from the live tree, not those earlier reports. Other workers are active,
and the checkout/index contain unrelated edits. Only A1's three documents
are written, unstaged.

| Source | Lines | SHA-256 of inspected UTF-8 bytes |
|---|---:|---|
| src/simulation.js | 642 | c5717787ca8e0fcb57e2933e8d8a39e9088f6e12d8d7197d91605517cdc0041b |
| src/simulation_effects.js | 395 | 0202f7e77262b327a7e79d22451b9744ee888415e2430742e42b624323559765 |
| src/simulation_resolution.js | 41 | b47789d1959d5e43fcce298b3631830169aa0d89b972cd7d08da1a55e4c2fd94 |
| src/expansion_engine.js | 689 | 92bf28809145aec3ee223b463cae378978c643474010a4a3eb77cf4a5b3ffac9 |
| src/main.js | 8786 | a8aced6a32ad5a7171b3014521384ce2368bd71b4e98d70535e046c8cf4079fc |
| src/display.js | 6273 | f9c254cfa49593e0df5ae07d2d594eb96c80e56c8e39b19763b2105f7c6ae982 |

Hashes pin this read, not an immutable checkout or a proof of behavior.
Re-read affected sources at implementation time. Existing test names cited
here identify reusable cases; this docs lane ran zero game tests.

## M3: dependency and hardcoded-ID census

### A1-F7: imports (SHOWN)

The ledger below includes every world-facing and feature-specific import
in the requested simulation files, with the imported names. It deliberately
includes adjacent shared hooks so an extraction cannot leave a world callback
behind. S means shared machinery, F means a named home feature/assay/probe,
W means a retained world or source-specific adapter. F/W classification is
architectural judgment, not a claim that every module is a separate world.
The existing `registry.worlds` is definition data, not a registry for these
callbacks (`src/expansion_engine.js:306`, `src/simulation_contracts.js:101`).

| Import locator | Kind | Module | Imported symbols |
|---|---|---|---|
| src/simulation.js:1 | S | `storylet_deck.js` | `initializeStoryletDecks,nextStoryletBoundary,advanceStoryletDecks,validateStoryletState` |
| src/simulation.js:2 | S | `foundation_interaction_policy.js` | `admitFoundationInteraction,freezeFoundationInteractionActivation,advanceFoundationInteractions,nextFoundationInteractionBoundary` |
| src/simulation.js:3 | F | `foundation_interaction_content.js` | `foundationInteractionProbeGuard` |
| src/simulation.js:4 | F | `steam_lamb_runtime.js` | `guardSteamLambAdmission,stampSteamLambAcceptedJob,steamLambCompletionContext` |
| src/simulation.js:5 | F | `steam_oni_runtime.js` | `guardSteamONIAdmission,stampSteamONIAcceptedJob,steamONICompletionContext` |
| src/simulation.js:6 | F | `steam_boh_runtime.js` | `guardSteamBOHAdmission,stampSteamBOHAcceptedJob,steamBOHCompletionContext` |
| src/simulation.js:7 | F | `nethack_fieldcraft_facts.js` | `stampNethackFieldcraftJob` |
| src/simulation.js:8 | F | `management/validation.js` | `stampManagementJob` |
| src/simulation.js:9 | F | `alloy_equipment.js` | `alloyTechniqueEffects` |
| src/simulation.js:10 | F | `steam_df_runtime.js` | `guardSteamDFAdmission,stampSteamDFAcceptedJob,steamDFCompletionContext` |
| src/simulation.js:11 | F | `agreed_duty_host.js` | `agreedDutyCompletionEffects,agreedDutyCancellationEffects,agreedDutyStoppedEffects,agreedDutyRefusalEffects` |
| src/simulation.js:12 | F | `agreed_duty_facts.js` | `agreedDutySelectedCommand` |
| src/simulation.js:13 | F | `agreed_duty_continuation.js` | `stampAgreedDutyContinuationJob` |
| src/simulation.js:14 | W | `book_world_paradise_campaign_runtime.js` | `paradiseCampaignControllerAllowed` |
| src/simulation.js:15 | W | `book_world_paradise_campaign_facts.js` | `paradiseCampaignExistingCommandGate` |
| src/simulation.js:16 | F | `world_completion_runtime.js` | `worldCompletionJobContext,stampWorldCompletionAcceptedJob,recordWorldCompletionJobCompletion,worldCompletionTimersSupported,reconcileWorldCompletionPlan` |
| src/simulation.js:17 | F | `lore_practice_runtime.js` | `lorePracticeTimersSupported,lorePracticeAdmissionGuard,stampLorePracticeJob,completeLorePracticeJob,recordLorePracticeCancellation` |
| src/simulation.js:18 | F | `audit_remainder_state.js` | `auditRemainderControllerAllowed` |
| src/simulation.js:19 | F | `causal_story_host.js` | `causalStorySimulationContexts, completeCausalStoryJob, recordCausalStoryJobCompletion, invalidateCausalStorySupport, advanceCausalStoryBoundary, causalStoryTravelReasons` |
| src/simulation.js:21 | F | `causal_story_core.js` | `causalStoryOccupiesActor` |
| src/simulation.js:22 | F | `audit_remainder_combat_fit_hooks.js` | `syncRemainderCombatFitCompletion` |
| src/simulation.js:23 | F | `audit_remainder_combat_objectives_state.js` | `recordRemainderSupplyCommandCommit` |
| src/simulation.js:24 | F | `audit_remainder_consequences_host.js` | `reconcileRemainderConsequences` |
| src/simulation.js:25 | F | `audit_remainder_consequences_facts.js` | `remainderConsequencesExistingCommandGate` |
| src/simulation.js:26 | F | `feature_expansion_work_plan.js` | `advanceWorkPlansBoundary` |
| src/simulation_effects.js:1 | F | `systems_workshop_runtime.js` | `systemsWorkshopFacts` |
| src/simulation_effects.js:2 | S | `foundation_interaction_policy.js` | `applyFoundationInteractionEffect,resolveFoundationDelivery,recordFoundationDelivery` |
| src/simulation_effects.js:3 | F | `foundation_interaction_content.js` | `foundationInteractionProbeFacts` |
| src/simulation_effects.js:4 | S | `structured_container_runtime.js` | `applyContainerEffect,containerFacts,advanceContainerClocks` |
| src/simulation_effects.js:5 | F | `management/facts.js` | `managementFacts` |
| src/simulation_effects.js:6 | F | `alloy_equipment.js` | `alloyEquipmentFacts` |
| src/simulation_effects.js:7 | F | `steam_absorption_facts.js` | `steamAbsorptionFacts` |
| src/simulation_effects.js:8 | F | `steam_df_runtime.js` | `steamDFStockCount,recordSteamDFStockMutation` |
| src/simulation_effects.js:9 | F | `contextual_balm_facts.js` | `contextualBalmFacts` |
| src/simulation_effects.js:10 | F | `cooling_refinement_facts.js` | `coolingRefinementFacts` |
| src/simulation_effects.js:11 | F | `agreed_duty_facts.js` | `agreedDutyFacts` |
| src/simulation_effects.js:12 | F | `game_absorption_assay_facts.js` | `gameAbsorptionAssayFacts` |
| src/simulation_effects.js:13 | F | `home_furnishing_facts.js` | `homeFurnishingFacts` |
| src/simulation_effects.js:14 | F | `factorio_retort_facts.js` | `factorioRetortFacts` |
| src/simulation_effects.js:15 | F | `proto23_world_actions.js` | `proto23Facts` |
| src/simulation_effects.js:16 | F | `crush_social_facts.js` | `crushSocialFacts` |
| src/simulation_effects.js:17 | W | `book_world_paradise_campaign_runtime.js` | `paradiseCampaignControllerAllowed` |
| src/simulation_effects.js:18 | W | `book_world_paradise_campaign_facts.js` | `paradiseCampaignFacts` |
| src/simulation_effects.js:19 | F | `world_completion_facts.js` | `worldCompletionFacts` |
| src/simulation_effects.js:20 | F | `world_completion_lens_facts.js` | `worldCompletionLensCustodyUseAllowed,worldCompletionLensCustodyReturnAllowed` |
| src/simulation_effects.js:21 | F | `lore_practice_facts.js` | `lorePracticeFacts` |
| src/simulation_effects.js:22 | F | `book_care_facts.js` | `bookCareFacts` |
| src/simulation_effects.js:23 | F | `field_care_facts.js` | `fieldCareFacts` |
| src/simulation_effects.js:24 | F | `status_care_facts.js` | `statusCareFacts` |
| src/simulation_effects.js:25 | F | `audit_remainder_state.js` | `auditRemainderControllerAllowed` |
| src/simulation_effects.js:26 | F | `causal_story_content.js` | `causalStoryFacts` |
| src/simulation_effects.js:27 | F | `causal_story_core.js` | `causalStoryOccupiesActor` |
| src/simulation_effects.js:28 | F | `audit_remainder_facts.js` | `auditRemainderCombinedFacts` |
| src/simulation_effects.js:29 | F | `audit_remainder_state.js` | `auditRemainderFacts` |
| src/simulation_effects.js:30 | F | `nethack_fieldcraft_facts.js` | `nethackFieldcraftFacts` |
| src/simulation_effects.js:31 | F | `audited_workshop_facts.js` | `auditedWorkshopFacts` |
| src/simulation_effects.js:32 | W | `book_world_paradise_actions.js` | `paradiseFacts` |
| src/simulation_effects.js:33 | W | `book_world_mol_actions.js` | `molFacts` |
| src/simulation_effects.js:34 | W | `book_world_mol_ids.js` | `MOL_FOOTPRINTS` |
| src/simulation_effects.js:35 | W | `book_world_paradise_ids.js` | `PARADISE_FOOTPRINTS,PARADISE_IDS` |
| src/simulation_effects.js:36 | W | `feature_expansion_nested_life.js` | `nestedLifeFacts` |
| src/simulation_effects.js:37 | F | `feature_expansion_subtlety_host.js` | `relayFacts` |
| src/simulation_effects.js:38 | F | `feature_expansion_reference_desk.js` | `referenceDeskFacts` |
| src/simulation_effects.js:39 | W | `feature_expansion_nested_host.js` | `nestedFacts` |
| src/simulation_effects.js:40 | W | `feature_expansion_nested_chains.js` | `nestedChainFacts` |
| src/simulation_effects.js:41 | F | `repository_absorption_facts.js` | `repositoryAbsorptionFacts` |
| src/simulation_effects.js:42 | F | `feature_expansion_society.js` | `societyFacts` |
| src/simulation_effects.js:43 | F | `feature_expansion_objects_host.js` | `featureObjectFacts` |
| src/simulation_effects.js:44 | F | `reference_gameplay_host.js` | `referenceGameplayFacts` |
| src/simulation_effects.js:45 | F | `feature_expansion_powers.js` | `featurePowerFacts` |
| src/simulation_effects.js:46 | F | `feature_expansion_battle.js` | `featureBattleFacts` |
| src/simulation_effects.js:47 | W | `feature_expansion_destination_host.js` | `tidemarkContext` |
| src/simulation_effects.js:48 | W | `realm_state.js` | `realmFacts,applyRealmWorldEffect,applyRealmSiteEffect` |
| src/simulation_effects.js:49 | W | `original_frontier_facts.js` | `originalFrontierFacts` |

`src/simulation_resolution.js:1` imports assert/copy/stableId from
simulation_contracts.js; `:2` imports resolveEffectAmount from power_models.js.
Reading all 41 lines found **zero world imports or world-specific IDs**.
`$spawn.`, generated spawn IDs and effect-type names are generic protocol
selectors (`:15`, `:18`, `:25`, `:26`, `:27`), not world coupling. Leave this
module alone unless a later world adds a dependency.

Shared imports beyond the ledger: simulation.js:27-32 are techniques,
contracts, effects, power models, resolution and pursuit. Effects.js:50-57
are causal situations, contracts, acquisition, gameplay transactions,
resolution, energy, durability and pursuit. Durability is a native bridge,
not a world registration. These shared imports do not need removal merely
to reach a zero-world-import count.

### A1-F8: every named exception in simulation.js (SHOWN)

Generic IDs such as `player`, `$party`, `origin.selected`, and protocol scopes
are listed separately below; they should not be mistaken for world IDs.
There is no hardcoded destination world ID in this file. Most coupling uses
command groups, prefixes and feature fact keys.

| Locator | Exact IDs, groups, prefixes or feature keys | Current use |
|---|---|---|
| src/simulation.js:54 | `Village` | Default native enrollment location |
| :78 | `original_frontier.travel.remaining` | Player occupation |
| :89 | `proto23` | Trusted preview host |
| :92 | `original_frontier`, `originalFrontier.clockSupported` | Preview clock gate |
| :158-159 | `world_completion_`, `world_completion_lens` | Actual host quote requirements |
| :160-165 | `status_care`, `field_care`, `causal_story`, `book_care`, `lore_work`, `lore_warning`, `lore.warning.exposure_job` | Host-specific admission |
| :174 | `pursuit` | Shared subsystem schema floor, not a world |
| :190 | `original_frontier` | Detect item reservation returns |
| :214 | `original_frontier`, `repositories`, `feature_objects`, `feature_society`, `tidemark`, `subtlety_relay`, `nested_campaign`, `nested_chains`, `nested_life`, `book_paradise`, `book_paradise_npc`, `book_mol`, `book_mol_npc`, `book_paradise_campaign`, `book_paradise_campaign_npc`, `reference_gameplay`, `nethack_fieldcraft`, `audit_fixture`, `audit_lesson`, `remainder_livelihood`, `remainder_home`, `remainder_offers`, `remainder_consequences`, `remainder_combat_fit`, `remainder_combat_objectives`, `causal_story`, `causal_story_npc`, `game_absorption_assay` | Historical fallback list for `reservationReturns`; explicit `d.reservationReturns === 1` already supported |
| :239-240 | `world_completion_`; `causal_story`, `causal_story_npc`; `proto23`, `book_paradise_npc`, `book_mol`, `book_mol_npc`, `book_paradise_campaign`, `book_paradise_campaign_npc` | Immediate settlement context routing |
| :257 | `world_completion_` | Completion context |
| :260-268 | `book_mol`, `book_mol_npc`, `book_paradise_campaign`, `book_paradise_campaign_npc`, `audit_lesson`, `feature_society.duty.`, `game_absorption_assay`, `remainder_livelihood`, `remainder_home`, `home_furnishings`, `proto23` | Add the accepted job to its fact-provider context |
| :281, :321 | `original_frontier.work_cave_protected`, `original_frontier.work_forest_protected`; `original_frontier.control.encounterConsumed` | Clear encounter reservation after stopped/cancelled work |
| :289-290 | `proto23`, `book_care_npc`, `book_paradise_npc`, `book_mol`, `book_mol_npc`, `book_paradise_campaign`, `book_paradise_campaign_npc`, `causal_story`, `causal_story_npc` | Actual completion effect bindings and accepted-job fields |
| :296 | `remainder_combat_fit.grip_practice` | Synchronize completed combat-fit owner |
| :299 | `feature_society.stop_future` | Refusal after no selected duty job remains |
| :302 | `field`, `promise` | Private NPC completion log audience |
| :309 | `world.completion.` | Cancel/refund context routing |
| :319 | `original_frontier` | Restore finite routine count on cancellation |
| :327 | `status_care`, `field_care`, `book_care`, `book_care_npc`, `lore_work`, `lore_warning` | Forbid generic care routines |
| :330 | `management` | Learned recipe, trusted host, finite count <=3 |
| :461 | regex `^lore\.(?:work|warning)\.`; `world.completion.`; `remainder_consequences.frost_warning`, `remainder_consequences.frost_settlement`; `world.completion.learning.neri_controller` | Skip unsupported jobs/checks/controller when choosing a boundary |
| :477-478 | same lore regex; `world.completion.` | Skip unsupported due jobs; clone pre-job state for world completion |

Symbol-based exceptions have no additional literal IDs in core: controller
allow-lists at :71; occupation at :79; preview gates :115-116; admission
:153-156/:166/:171-172; cost technique transform :133; commit record :179;
freeze :189; job stamps :221-229; special completions :254-255; context
composition :270; post-completion :294-295/:298; stopped duty :282;
cancellation :314-315; response admission :373-377; boundary hooks
:471-476/:481-482/:519/:525-526/:559-560; travel reasons :568. The import
ledger names each provider, so these are part of the M3 move scope too.

Generic hardcoded selectors remaining by design: `player` (:51, :54, :78,
:85, :110 and later actor checks), `$party` (:83), `world.services` (:52),
`origin.selected` (:620/:623-624), `native` inventory binding (:54), effect
types and life/status values. World registration does not erase native
player binding or reserved envelope fields (:608).

### A1-F9: simulationFacts and effect exceptions (SHOWN)

`src/simulation_effects.js:89-97` invokes **40 unique functions named
*Facts**, plus `tidemarkContext(...).facts`. `auditRemainderFacts` runs twice
in the :90 expression. This count excludes simulationFacts itself. The
ordered provider calls and imports are in the ledger, not inferred from
world-name matches alone.

Order is observable: context facts first, then :90's spreads in source
order; systemsWorkshop/probe :91, containers :92, alloy :93,
home/crush/retort/Proto23 :95, balm/cooling/duty :96, Steam :97. Core inventory,
actor, resource, body, world and target fields are added afterward :98-159.
Reference facts are calculated before the merged object (:89); remainder and
audited-workshop providers receive specially enriched input (:90).
Moving everything into an alphabetical merge could change overwritten keys
or dependency input. Whether there are accidental collisions is UNKNOWN.

| Locator | Exact named dependencies/IDs | Role |
|---|---|---|
| src/simulation_effects.js:17, :25, :210 | Paradise/remainder controller predicates | Spawned-controller admission must match initial enrollment |
| :34-35, :213-214 | MOL_FOOTPRINTS, PARADISE_FOOTPRINTS; `book.mol.`, `book.paradise.`; motherOfLearning/bookWorldCampaign owners | Exact native NPC relocation support |
| :35 | PARADISE_IDS | Imported but no other reference in this file; removal is a separate tiny cleanup if desired |
| :212 | causalStoryOccupiesActor | Restraint prevents relocation |
| :217-218 | `native.person.${actor}.body`, molNative/paradiseNative revision checks | Exact actual body/owner/controller binding |
| :226, :247 | applyRealmSiteEffect, applyRealmWorldEffect | Pocket-world canonical instance state, not duplicate flat world facts |
| :192, :386 | steamDFStockCount, recordSteamDFStockMutation | Before/after effect conservation observation |
| :257-258, :275 | worldCompletionLensCustodyUseAllowed/ReturnAllowed; `lore.instrument.amber` | Exact loan-use and loan-return policy |
| :195-196 | resolveFoundationDelivery, recordFoundationDelivery, applyFoundationInteractionEffect | Delivery route and shared interaction effect |
| :215, :221 | `player`, structuredNative location/body/controller binding; `current location` patch | Shared typed-pack native relocation, not a named world exception |
| :90, :250 | `player`; native resource key `money` | Native-life projection and existing resource bridge |

A registry that only moves simulationFacts leaves effect-time world coupling
and controller spawn admission behind. Both need hooks with the same tests.

### A1-F10: boundary loop outside simulation.js (SHOWN)

The common-clock loop is `src/expansion_engine.js:591-638`. Its imported
world/feature callbacks are also part of F3; moving only simulation.js would
leave every new clock adapter editing the engine. This table gives each
world-facing import and its boundary call locators. Pure validators elsewhere
in this file remain a later registration concern, not an unlisted clock hook.

| Import locator/module | Imported names used by the loop | Use locator |
|---|---|---|
| :1 systems_workshop_runtime.js | reconcileSystemsWorkshop | :638 |
| :13 proto23_world_state.js | syncProto23Clock, nextProto23Boundary | :610/:612/:615 |
| :14 proto23_world_host.js | proto23SimulationContexts | :626 |
| :15 book_world_paradise_campaign_runtime.js | reconcileParadiseCampaignDepthRuntime | :635 |
| :17 world_completion_crop_clock.js | worldCompletionCropClockSupported | :610 |
| :20 world_completion_runtime.js | worldCompletionTimersSupported, retainWorldCompletionWindows, nextWorldCompletionBoundary, worldCompletionSimulationContexts, reconcileWorldCompletionPlan | :610/:612-613/:626/:636 |
| :22 lore_practice_runtime.js | lorePracticeTimersSupported, retainLorePracticeWindows, nextLorePracticeBoundary, lorePracticeSimulationContexts, reconcileLorePractice | :610/:612-613/:626/:628/:633 |
| :24 book_care_runtime.js | reconcileBookCareRuntime | :634 |
| :27 audit_remainder_runtime.js | advanceAuditRemainder, retainAuditRemainderWindows, auditRemainderSimulationContexts | :612-613/:626-627/:631 |
| :29 causal_story_host.js | causalStorySimulationContexts, nextCausalStoryBoundary, reconcileCausalStoryPlan | :610/:626/:632 |
| :32 book_world_paradise_state.js | syncParadiseClock, nextParadiseBoundary | :610/:612/:615 |
| :33 book_world_paradise_host.js | paradiseSimulationContexts | :626 |
| :34 book_world_mol_state.js | syncMolClock, nextMolBoundary | :610/:612/:615 |
| :35 book_world_mol_host.js | molSimulationContexts | :626 |
| :38 repository_absorption_facts.js | retainRepositoryAbsorptionWindows | :612-613 |
| :40 feature_expansion_nested_host.js | syncNestedCampaignClock, nextNestedCampaignBoundary, nestedSimulationContexts | :610/:612/:615/:626 |
| :41 feature_expansion_nested_chains_host.js | nestedChainSimulationContexts | :626 |
| :44 feature_expansion_destination_host.js | syncTidemarkClock, nextTidemarkBoundary, tidemarkSimulationContexts | :610/:612/:615/:626 |
| :46 feature_expansion_work_plan.js | workPlanNextBoundary | :610 |
| :49 realm_state.js | syncRealmClock, realmSimulationContexts, nextRealmActivityBoundary, expireRealmObservation | :610/:612/:615-616/:626 |
| :50 original_frontier_facts.js | retainOriginalFrontierWindow | :612-613 |

Shared imports called here: :2 nativeEquipmentSnapshot, :3
nextContainerBoundary, :4 advanceNativeContainerClocks, :55 advanceChronicle/
nextChronicleBoundary, :58 nextSimulationBoundary/advanceSimulationBoundary/
waitingSimulationChoice. Chronicle contains original-world behavior, but
the present outer loop treats it as a separate service. Registering that
service is later than preserving its current stop semantics.

No named-world ID literal occurs in :591-638. `player`, `dead`, `departed`,
`available`, `scheduled`, `expired` and the 512-boundary cap are generic
protocol values (:605-606/:609/:621-622/:629). The world-specific skip option
names are `skipLoreJobs`, `skipCompletionJobs`, `skipCompletionCropChecks`
(:610), whose exact ID tests are in simulation.js:461. Crop check/controller
filters occur in next-boundary selection; the due checks/controllers in
simulation.js:504/:527 do **not** repeat those filters. The first extraction
must reproduce this asymmetry; deciding whether it is a defect is separate.

### A1-D2: runtime registration API (INFERRED)

Keep immutable content definitions in the existing content registry. Build a
separate, immutable runtime registry at application composition, then pass it
through core calls. Do not put functions in createContentRegistry's cloned
definition payload (`src/expansion_engine.js:308-314`) or saved JSON. No global
mutable singleton and no import-time self-registration. Tests construct their
own runtime registry. An empty registry supports the existing generic sandbox.

Illustrative contract, not implementation:

```js
createRuntimeRegistry([
  {
    id: 'adapter.mol',                 // stable adapter ID, not a save world ID
    worldIds: molWorldIds,             // actual IDs from its existing owner
    owns: {commands: molCommands, controllers: molControllers, savePaths: ['motherOfLearning']},
    facts: [{id, phase, order, reads, writes, project}],
    gates: {preview, admit, program, occupies, travel, relocate},
    controllers: {allowEnrollment, allowSpawn},
    jobs: {stamp, immediateContexts, completionContext, handleCompletion,
           beforeCompletion, afterCompletion, stopped, cancelled},
    effects: {before, after, custodyUse, custodyReturn, world, site},
    boundary: {next, includeJob, includeCheck, includeController,
               retainWindow, syncClock, contexts, phaseHooks, reconcile},
    persistence: {ownerVersion, readVersion, steps, validate, requireContent}
  }
]);
```

The actual adapter only supplies needed hooks. Registration is not enrollment:
presence of a module must not grant actors, controllers, goods or receipts.
Named home features can register against `base.frontier` without claiming it
exclusively; a retained-world adapter can cover multiple footprint world IDs.
Selectors use exact registered definitions/owner presence. A watcher that
operates across worlds is not silently disabled just because the player left.

| Contract | First-change rule | Later ratchet |
|---|---|---|
| Fact precedence | Preserve existing call positions and each enriched input. Evaluate all existing providers initially. Keep native/core projection phases unchanged. | Declare reads/writes and intentional overwrite pairs; reject new undeclared collisions. Only optimize providers after equivalence proof. |
| Gate semantics | Keep preview reasons/order, hidden control behavior and authoritative commit guards distinct. Admission asserts run before costs. | A preview is never an authorization token or a cached commit quote. |
| Boundary ordering | Preserve retain-window-before-clock, clock sync, expansion pending jobs, opportunities, chronicle, then simulation phases and post-loop reconciliation. Preserve due/sequence and ID tie order. | Every hook declares its phase; no callback decides arbitrary global order. |
| Boundary skip | Use a common policy result for selecting the next due time and settling due work, with explicit legacy exceptions for checks/controllers above. | Add a focused parity fixture before tightening semantics; no overdue infinite loop or skipped conserved work. |
| Controller allow-lists | Compose both existing allow predicates with logical AND for initial and spawned controllers; registration itself adds none. | Reject references to unknown controllers; spawning preserves definitionId/actorId and future due time. |
| Jobs/effects | Keep frozen outcomes, stamp order, completion short-circuit order, accepted job context, refunds and cause IDs. | Exact owner of each effect hook; exclusive handled-completion hook, not two handlers that award twice. |
| Schema steps | Persist only data versions; pure owner migration reads a cloned candidate, returns it, and validates known paths. Content requirements run before publication. | One runner; owner steps cannot migrate another owner's state except through an explicit cross-owner dependency. |

Composition root can initially live next to expedition_content.js:40 and :170,
where definitions/work-plan registries are already assembled. That application
module may import worlds. The target is **core imports no world adapters**,
not every application module imports none. During transition, unmoved adapters
keep their existing direct calls. Never invoke both paths for the moved adapter.
Core entry-point changes use one short integration reservation; features keep
editing their own files. Do not make every world write one shared registry list:
use per-adapter exports and a small explicitly owned application assembly seam.

### A1-D3: adoption order and identical-behavior test per move (INFERRED)

Build the registry container and generic delegation seams once, without
moving all worlds. Capture baseline fixtures from the current implementation
before each move, then compare the same seed/inputs through the new path.
Use either a temporary test-only legacy implementation pinned to the pre-move
revision or frozen baseline traces; do not retain two production executors.
Compare full state plus external/gameplay/vitals/equipment/acquisitions/unlocks,
native/ownership patches, errors and preview output. Compare per-boundary traces,
not just the final clock. Keep ordered arrays/cause IDs intact; sort only JSON
object keys when hashing. This is stronger than both implementations passing
similar hand-written expectations.

Each table row is one world per change, or one named home subsystem where the
current source has no independent world. Larger rows use several sequential
changes, each restricted to that same owner. This is refactor order only;
the accepted order for building new canon slices is unchanged.

| Order | Adapter to move | Differential fixture and exit |
|---:|---|---|
| 1 | Tidemark | Inactive, active visit, paid pending travel/work, freeze while away, return/revisit. Compare tidemarkContext facts, next/sync clocks and native bindings. Small proof of both fact and clock interfaces. |
| 2 | Folded Glasshouse (`realm_state`) | Inactive/active instance, site activation, world-fact effect, claim, expiry and return. Prove instance owner changes once and flat world facts remain as before. |
| 3 | Proto23 | Wrong-host preview/admission, immediate and delayed work, accepted-job support, local clock, return. No bypass of its actual visitor controls. |
| 4 | Mother of Learning | Player plus native NPC, bound/unbound relocation, busy actor, frozen pending job, absent-world clock freeze, return. Preserve exact source/entry/body and nativeRevision checks. |
| 5 | Paradise | First move footprints/facts/native relocation/clock; next same-world change moves campaign-depth controllers/gates. Fixture independent onEnroll/spawn filtering, support loss, command block, mission pending/settled, away/return. |
| 6 | Nested campaign | Existing visit and clock, then chains, then continued life in separate same-owner changes. Fixture first/personal visits, independent NPC/party binding and paid job reload. Do not enable copy plurality. |
| 7 | Original Frontier | Occupancy, clock window retention, item returns, protected-work cancellation/stopped support. Assert money/items/encounterConsumed/program count and native travel agree. |
| 8 | Home feature adapters | One subsystem per change: reference gameplay/workshop, remainder, lore practice, world completion, society/duty, then the provider queue below. Lore/completion use supported and unsupported timer/crop/controller fixtures, simultaneous jobs, cancellation, refusal and exact custody. Steam DF/BOH/ONI/Lamb each moves separately with admission/stamp/context/effect-stock conservation checks. |

For facts-only home providers, first fixture compares absent/enrolled facts,
one successful command, blocked command and exact reload; preserve all keys,
not only keys used in that command. Audit remainder's enriched reference
input and each systems/probe/container/alloy late phase need explicit cases.
The provider ledger is the remaining-work checklist, not an excuse to move
its 49 imports in one branch. Shared container, foundation interaction,
storylet, pursuit and energy code stay shared.

Remaining home-provider queue, one row per subsequent change. Reorder a row
around its live feature writer; nothing depends on this entire queue finishing.

| Queue | Owner | Minimum identical-behavior fixture beyond common fact/command/reload comparison |
|---|---|---|
| H1 | Contextual balm | Supported/unsupported preparation and actual equipment/body input |
| H2 | Cooling refinement | Quiet window, retry weights, pending descriptor repair and applied preparation |
| H3 | Field care | Actual quote, no routine, native battle callback and NPC completion |
| H4 | Status care | Actual status/strain/body, expiry and no generic routine |
| H5 | Book care | Source-world body/services, player admission and NPC effect bindings |
| H6 | Home furnishing | Pending reservation, completion support and custody/stock |
| H7 | Crush social | Existing work-plan eligibility, directed memory and no implicit institution standing |
| H8 | Management | Trusted finite mandate, first learned completion, repeat <=3, job stamp |
| H9 | Factorio retort | Native envelope/fact bindings and accepted finite work-plan stock |
| H10-H13 | Steam DF, BOH, ONI, Lamb, separate changes | Actual admission, accepted stamps, completion-context order; DF before/after stock observation |
| H14 | Repository absorption | Window retention, reservation return and away-clock input |
| H15 | Feature objects | Registry-dependent facts, situation/custody and reservation returns |
| H16 | Subtlety relay | Existing remembered consequence, accepted stock and refund |
| H17 | Reference desk | Current source/contact fact and unsupported context |
| H18 | Feature powers/alloy | Existing cost/effect transform order and current fuel/technique facts |
| H19 | Feature battle | Current/native encounter facts, no change to executor schemas or clocks |
| H20 | Nethack fieldcraft | Accepted job stamp, native known-item inputs and blocked unsupported facts |
| H21 | Game absorption assay | Registry-dependent facts, accepted job reservation context and native envelope |
| H22 | Causal story | Occupation/restraint, trusted admission, special completion, travel, support invalidation and phase order; several same-owner changes if needed |
| H23 | Systems workshop | Fact phase, clock reconciliation and actual chest ownership |
| H24 | Foundation probe | Current dev-only guard and late fact projection, without activating the probe in ordinary play |

Audit workshop and the remainder variants stay with the reference/remainder
moves above; work plans remain shared and receive runtime
registrations for existing per-feature hooks rather than a new executor.

Reusable source tests read here: simulation.test.js:71 (schema4 additive
load), :93 (split time), :120 (frozen jobs), :192 (bounded work), :197
(failed publication); simulation_extensions.test.js:20 (spawn), :90 (native
movement), :96 (split/reload), :114 (inactive actors). Add missing adapter
cases; these existing files do not prove every named world today.

The refactor gate is a passing affected test slice and differential trace
in that worktree. Any playable/UI claim still needs a fresh rebuilt desktop
origin, and changed persistence needs save/reload/literal-file import. Do not
turn unavailable native proof into a claim that the refactor is playable.

## M4: migration chain and existing-save decision

### A1-F11: engine schema 5-11 today (SHOWN)

`expansion.schema` and `simulation.schema` are different version domains.
Simulation starts at 1 and accepts 1-6 (`src/simulation_contracts.js:217-227`);
reservation/support accounting requires >=4 (:264/:290-291). Do not infer
simulation version from expansion version or a pack's schema number.

| expansion.schema | Current meaning and gate | Source read |
|---:|---|---|
| 5 | Default expansion state; schemas 1-4 clone forward to 5 with null chronicle/simulation and actor sources/techniques. Does not enroll anything. | expansion_engine.js:61/:75-81/:261-273 |
| 6 | Feature wave payload reader: featureDestination/backlog/inkNarrative/workPlans can cause native publication to choose 6. Not a global 5->6 step. | expansion_engine.js:63; main.js:901 |
| 7 | Nested campaign reader; nestedCampaign presence requires an admitted 7-11 reader. | expansion_engine.js:64/:168-169; main.js:900 |
| 8 | Personal/continued nested life reader, selected through actor facts `nested.personal.version` or `nested.life.version`; those records have their own version 1. | expansion_engine.js:65; main.js:900; feature_expansion_nested_host.js:69/:238; feature_expansion_nested_life.js:157 |
| 9 | Reference gameplay owner schema1 required for exactly engine9; validator also supports 10/11 with this owner. Enrollment chooses 9/10/11 by other owners. | reference_gameplay_state.js:9/:56/:66; expansion_engine.js:190 |
| 10 | Explicit Paradise bookWorldCampaign schema1; exact source/hash, same body, freeze and independent entry profile; permits 10/11. | book_world_paradise_state.js:7/:35; expansion_engine.js:191 |
| 11 | At least one auditRemainder, causalStories, motherOfLearning schema1 or proto23Village schema1. Independent owners share this number. Their own validators bind exact policy/source/definition records. | expansion_engine.js:143/:147-174; audit_remainder_state.js:8/:44-48/:62; book_world_mol_state.js:24; proto23_world_state.js:36; causal_story_ids.js:3/core.js:185 |

`validateExpansionState` admits the seven numbers, calls a series of world
validators and checks owner-specific constraints (:138-191). It does not
walk 5->6->7->8->9->10->11. `loadExpansionState` clones existing 5-11 and
applies the narrow cooling descriptor repair before validation (:270-273).
That repair mutates only the candidate: it fixes an attributed situation ID
in matching frozen cooling jobs/knowledge, not costs, due times or draws
(`src/cooling_refinement_facts.js:210-226`). Main publication recalculates
schema by owner presence twice (:869-871/:897-901); it is not a migration.

### A1-F12: native migration, retirement and import order (SHOWN)

| Existing stage | What it does | Source |
|---|---|---|
| File decoding / structural preflight | Recognizes UTF-8 marker and legacy encodings; rejects newer game version, unsupported fork schema and malformed envelope; prepares retirement and validates optional/native owners. | save_files.js:46-95/:111/:170-185 |
| Optional generic content preparation | Clones and restores matching parked locations/inventories/availability, or parks unavailable optional registrations. An active generic visit can return to Village; registrations must match world/location/item/binding IDs. | content_packs.js:152-186 |
| Exact typed-content preflight | Requires structured campaign or pending selection content before native loader proceeds; records a suspended original if exact content is unavailable. This is distinct from generic parking. | main.js:5412-5416; structured_pack_state.js:17/:32-33 |
| Retirement | Clones, detaches retired prototype payload/IDs, records path+opaque value, relocates retired current/bed/combat location to Village, removes retired activity; rejects unknown retirement schema. Reattaches only when nonempty. | save_compatibility.js:2-57 |
| v0.6 preparation | Clones; pre-v0.6 bio defaults and creation flag; moves positive whole legacy expansion kits into the correct native inventory and zeroes old counter. Bad counts/missing inventory fail. | save_migration.js:3-25 |
| Other native owners | Career, ledger, life record, generated people, durability, pacing and fort have their own loaders/normalizers; expansion loads with the live definition registry. Legacy items/dialogues/locations also have in-loader compatibility branches. | main.js:5418-5445/:5562/:5830/:6002/:6385/:6541/:6621/:6674/:6802 |
| Durable import | Decode/validate, await actual isolated loader preflight, then guarded storage write. Native file import reloads only after successful publication. | save_files.js:197-203; main.js:7194-7206 |

Retirement preparation runs during envelope validation and again in native
load (:5425), with opaque retirement data retained between them. A new chain
must prove idempotence and avoid losing that ledger or migrating kits twice.
`game version`, `fork_schema`, retired_content.schema, optional pack schemas,
expansion.schema, simulation.schema and native owner schemas are not one number.

### A1-D4: one runner, global format and owner sub-versions (INFERRED)

**Compatibility decision A1-C1:** continue accepting every currently supported
valid legacy envelope. No implicit optional enrollment, reroll, reset, reward,
copy creation, ID renaming or body-policy change. Migrate cloned candidates
additively, then validate against the exact supported content. Preserve
original stored/file bytes on any failure. Unknown future global/owner
versions or unsupported exact content suspend/reject with export/recovery;
do not silently normalize them away. Generic optional parking and exact typed
campaign suspension remain separate policies.

Proposed first format transition is global **save_format:1** for the complete
envelope, separate from game version and fork_schema. Absence means legacy
format 0. Expansion reader compatibility continues to use its existing schema
until owner checks have been lifted into registered validators. Do not simply
set expansion.schema=12 while its validators still require 9/10/11.

Add data-only `save_versions` to the envelope when the accepted format change
is published:

```text
save_format: 1
save_versions:
  core.expansion: 1
  core.simulation: <its actual existing schema when present>
  core.retirement: 1
  worlds: { <stable owner ID>: <sub-version> }
  features: { <stable owner ID>: <sub-version> }
```

World versions belong to saved **owners**, not just `actors.player.worldId`:
one Paradise owner covers its footprints; absent owners have no version and
must stay absent. Nested personal/life policies can have a sub-version even
when their current payload is actor facts. Content hash/source snapshot,
definitionRevision, nativeRevision and rules profile remain separate pins;
they do not become interchangeable with a data migration version.

One pure `migrateSave(candidate, registrations, contentRequirements)` runner:
validate input version headers, resolve known applicable steps, clone once,
apply numbered steps in explicit dependency order, validate candidate owners
and cross-owner/native bindings, return candidate plus a safe migration
receipt for diagnostics. Persist only through the existing guarded publication
boundary. No step writes storage, rolls RNG, grants content or advances clocks.
Step signature is `(candidate, frozenContext) -> candidate`; frozenContext
contains registered definitions/version requirements, no live native objects.
Tests deep-freeze inputs to detect mutation. The runner may clone once, but
standalone steps must not rely on mutating callers' objects.

First wrap existing behavior in format-0 preparation steps without changing
the writer: retirement, v0.6 prep, expansion1-4 additive lift and cooling
repair. Keep exact-content preflight order and existing native loader
compatibility branches until their own fixture-backed extraction. Then add the
format0->1 metadata step, deriving versions only from validated existing
owners. A format1 reader accepts both formats; an older reader is not promised
forward compatibility. Switching the writer to format1 is a separate reviewed
change with import/storage failure evidence and an explicit newer-reader need.

After all owner gates can read versions, a later core expansion schema bump
can remove overloaded world-specific engine numbers once, with a mapping of
old 5-11 to exact owners. This plan does not require that final cleanup before
shipping another world. New worlds first use their registered owner version;
they should not invent engine12/13 solely to mark enrollment.

| Fixture family (synthetic, no user saves) | Required assertions |
|---|---|
| Existing versions | Valid schema5,6,7,8,9,10,11 separately; supported combinations of owners, especially engine11 without audit but with each other owner. Empty/unenrolled saves gain no optional owner. Unknown engine/global/owner versions fail without source mutation. |
| Old native formats | Pre-v0.6 bio and inventory, current component inventory, positive whole survey kits, zero/already moved kits, malformed/fractional/overflow stock; preserved XP/equipment/money and exact input bytes. |
| Retired / unavailable content | Opaque retirement payload, repeated preparation, generic missing/restored pack, typed missing/mismatched/restored content, pending typed selection. Preserve exact opaque content; no truth in public fixture names. |
| Pending / settled work | Frozen paid costs, effects, chosen outcome/draw, due, revision, cancellation/support, custody cause, equipment/body IDs, RNG and streams. Migrate then settle once; reload suffix equals uninterrupted suffix. Include cooling repair and unrelated job unchanged. |
| Cross-owner joins | One active retained-world visit; native location/calendar/XP/stock consistency; owner versions independent; migrating A leaves B byte-equivalent except declared global metadata. Failed validation or storage write publishes nothing. |

Use the existing actual loader/import boundary for final tests, not merely
the pure migration runner. `tests/save_compatibility.test.js:5/:11/:35`,
save_files.test.js:20/:34/:43 and expansion_engine.test.js:39/:161/:177 are
existing cases read here, not pass counts. Native changes still require
rebuilt save/reload/export/literal-file import on an isolated origin.

## M5: one read shape per concept over both stores

### A1-D5: ranked by worlds unblocked (INFERRED)

All read APIs take injected snapshots/bindings, never import main.js or write
state, draw RNG, enroll actors or cache mutable native references. Use stable
source-qualified refs and explicit identity maps, not matching display names.
Unknown, missing, zero, expired, suppressed and hidden are different states.
For observer UI use known projections; internal execution truth is separately
named and must not leak through the UI API. This does not silently implement
M12 or change existing legality predicates.

Rank is breadth judgment, not a measured world count. W6's worlds are targets
that benefit from the seam, not claims of current playable coverage.

| Rank/code | Verified duplicate sources | One proposed read shape | First caller and test | Store merger worth doing? |
|---|---|---|---|---|
| 1 A1-RD1 person | Legacy Person has component-owned inventory/equipment/bio/levels and is_alive (models/person.js:47-79/:105/:413/:455); engine people has life/body/location/inventory binding (simulation_effects.js:60-68). Native bridge exists (native_gameplay_adapter.js:9-47; main.js:635). | `readPerson(ref, frame, {observerId, mode}) -> {ref, actorId, nativeId?, life, location, bodyRef?, controllerRef?, vitals, inventoryOwnerRef, equipmentOwnerRef, bio, known, provenance, conflicts}`. Native-bound actor reads actual native vitals/stock; pure simulated actor reads simulation owners. Field ownership map is explicit; disagreement returns diagnostics, not a guessed merge. | First add adapter beside the native bridge and use the People notebook view, then context construction. Golden fixtures player/main_character mapping, simulated NPC, native NPC, no enrollment, conflicting body/life and observer-hidden fields. Benefits all canon starts/cast and nonhuman/body/control consumers. Coordinate with nonhuman-starts before body field design. | Maybe for durable identity/body metadata after nonhuman contract, never by copying component inventory into people. Native components may stay valid owners permanently. Read unification is enough to ship worlds. |
| 2 A1-RD2 relationships | Simulation directed axes/memories/cause dedup (simulation_effects.js:286-294/:157); chronicle counterpart record has axes/ties/memories, clamps axes [-100,100], and real trust gates (chronicle.js:34-39/:62-69/:213; chronicle_ui.js:92/:118). | A4 owns `relationship_view.js`: `{viewer,target, records:[{store,ref,axes,ties,memories,clamp}], conflicts, knowledgeScope}` with explicit source selection for rules. No sum, renamed axes, reverse-edge inference or “simulation wins” default. Chronicle's player-linked counterpart record does not prove the NPC's directed opinion. | First A4's new pure adapter tests, then notebook; one source-qualified gate after review. Broad social, institution and companion unlocks across HP, D&D, MoL, LOTM/CoI, JJK and other cast-heavy worlds. A4's current checkpoint already corrects the root's broad write-only claim. | Only if same actors/direction/axes and causal memory have a proved mapping. Preserve bounded chronicle axes/ties and simulation cause dedup. Institution membership/reputation are separate concepts; do not force region integers into directed regard. |
| 3 A1-RD3 capabilities | Native skills via Person.getTotalSkillLevel (:413); provider grants and actor sources query (capabilities.js:41-68); actor techniques/practice (techniques.js:81-97); powers/faculties/progression/energies fact loops (simulation_effects.js:106/:116-128); power quote (power_models.js:5). | `readMeans(actor, frame) -> {entries:[{ref,kind,known,owned,available,value?,unit?,limits,reasons,sourceReceipts,costQuoteRef?}]}`. Preserve queryCapabilities' own max/sum policy. Skill rank, technique proficiency, power mastery, faculty activation and energy reserve are distinct kinds, not one strength number. | First action-legibility/notebook shows common availability/provenance, delegating to existing queries. Fixture inherited-but-dormant, suppressed, expired source, learned technique, cooled power and insufficient reserve; pure preview consumes no cursor. Unblocks K3/K13 in D&D, JJK, TTKS, LOTM/CoI, HxH and other power worlds. | Broad merger is not worth it: acquisition, activation, expression and fuel are different state. Merge only a demonstrated duplicate receipt or identical source registry later. |
| 4 A1-RD4 conditions | Legacy process_conditions is graded requirement evaluation, not injury state (conditions.js:87-126); engine meets delegates to evaluateRule (simulation_contracts.js:38); packConditions evaluates local values (content_packs.js:48-49). Native active effects and engine conditions are a second, different duplication (active_effects.js:15-28; simulation_effects.js:123-124/:303-315). | Requirements: `readRequirement({pipeline,definition}, frame) -> {supported,met,score?,reasons,readRefs}` delegates to each evaluator. Keep legacy fractional score separate from boolean engine/pack result. Body effects: `readConditions(actor, frame) -> {entries:[{ref,active,intensity?,remaining?,expiresAt?,modifiers,provenance}]}` over legacy effects and engine conditions; never turn pack predicates into saved bodily conditions. | First display.js:4195 effect rows, reusing Hero's existing simulationEffectReader (models/hero.js:18-22/:114); then a single action reason panel. Test same-key sources, duration0/permanent, engine expiry/intensity, stacking and fractional requirements. Supports all worlds' legality; bodily part especially injury, curse, rest and preparation loops. | Evaluator consolidation can be useful through a lossless compiler after all legacy keys and score semantics map. Effect stores can stay distinct while their expiration/stat application is reconciled. No generic boolean rewrite or double application. |
| 5 A1-RD5 actions | Legacy GameAction progress/rewards/duration (models/game_action.js:18-70; main.js:2632/:2736); expansion actions/pending jobs (expansion_engine.js:317/:330-350/:585); simulation commands/jobs/responses (simulation.js:87/:243/:448); optional schema1 pack jobs also exist (content_packs.js:111). Root's three pipelines are not an exhaustive count of all action-like hosts. | `readAction(ref, frame) -> {ref:{pipeline,id},label,visible,eligible,reasons,actorRef,targetRefs,duration,progress,costs,completionPolicy,quoteToken?}`. Delegate preview to owner, preserve cost units and uncertainty. Token represents source sequence/session, never permission to commit stale data. | First action_legibility UI or a list-only adapter for current work; later one world loop chooses this API. Test same ID in different pipelines, hidden/blocked actions, native busy, pending accepted costs, changes between preview and commit. All K13 loops benefit; later than person/capability facts because it consumes them. | Eventually reduce new authored worlds to generic commands where semantics fit. Legacy behavior and standalone pack job pipeline can be retired only after lossless fixtures and a save migration. Do not merge executors to make a common list. |
| 6 A1-RD6 battles | Legacy Combat/native callbacks coexist with chronicle cue/recovery session (chronicle.js:46-53), simulation encounter sessions (simulation.js:230-237/:367-386), native duel schema1 and party schema2 (native_battle.js:10-14/:38-41; party_battle.js:103), feature/reference/remainder schemas3/4/5 (feature_expansion_battle.js:16-21). Field-care/remainder-objective modules extend a battle rather than each proving another full machine. | `readBattle(frame) -> {ref:{executor,sessionId},status,participants:[{ref,side,role,knownVitals}],phase,availableActions,actionToken,outcome?,recoveryPolicy}`. Keep real-time cadence, cue turn, NPC decision and objective progress separately tagged. Truth fighter stats stay in internal adapter; public view respects observation. | First common “current encounter/occupied” view, then workspace battle summary. Test saved duel/party/feature/chronicle/ordinary encounter, paused recovery and stale session/action token. Useful for D&D/JJK/Fate and combat grammar across canon worlds, but not prerequisite to a noncombat first slice. | One universal executor is usually not worth it: cue, turn, real-time and objective rules differ. Share combat_math, binding, publication and read shapes; merge only same grammar with proved defeat/refund rules. |

No proposed read shape is persisted, so its first adoption needs no save
migration. **A1-C2:** preserve both stores and their authoritative writers;
typed provenance determines interpretation. If a later store merger changes
identity/direction/effect timing/counters, give it an owner-version step and
fixtures before deleting the old reader. Never dual-write new competing truth.
PRNG consolidation remains with procgen; A1 does not design a replacement.

## M2: concrete ratchets without freezing features

### A1-F13: measured baseline and A5 drift (SHOWN)

Read-only Python text scan of this tree found 26 call-shaped
`Math.random(` occurrences in five source files. It counted direct spelling,
including comments/strings if present, not AST gameplay calls. Native combat
now contains keyed random calls (`models/combat.js:80/:189/:295/:354`);
combat_math still has Math.random defaults (:34/:44). Thus the scorecard's
63 and A5's earlier 60-direct/63-reference baseline must not be repeated as
current counts or as proof of native determinism.

Three requested simulation files have 90 static import statements total
(31/57/2), including shared code. Source has six definePanel call sites in
three caller files, excluding its definition (`status_window.js:36`,
workspace_views.js:19-20, adventure_notebook.js:131-133). These are adoption
counts, not counts of all panels. Raw panel construction is not enough to
measure non-kit panels: nested details and wrapped nodes need identity mapping.

A5's [REPORT](../a5/REPORT.md) and its branch tests are the owner. Its reported
world classifier only matches names containing world/frontier/realm; it
misses many care, Steam and feature adapters listed above. Its prior test
counts are STATED by that report and were not rerun or used as A1 proof.

### A1-D6: counters and enforcement (INFERRED)

| Counter | Exact scope and direction | Integration rule |
|---|---|---|
| M2.1 ambient randomness | AST direct calls and Math.random references in src/**/*.js, excluding SECRETS files before reads; separate gameplay and cosmetic/default-RNG buckets with reviewed explicit paths. All buckets nonincreasing; direct lexical baseline here 26 only. | Extend/rebase A5, not a second harness. Never infer gameplay from total alone; aliases/computed calls need a review rule and injected RNG tests. Preserve legacy cursor owners. |
| M2.2 world-facing imports | Count import edges and re-exports from simulation*.js **and expansion_engine.js** to an explicit adapter module set derived from this ledger and later registrations. Count transitive core-to-world paths too after a shared wrapper appears. Nonincreasing per target file, no unnamed adapter escape. | Keep A5 name classifier as a quick indicator; add the explicit reviewed classification. Application composition imports are allowed and counted separately. Shared containers/energy/contracts are not world debt. |
| M2.3 named exceptions | AST sites containing adapter-owned world IDs/command IDs/groups/prefix regexes/fact keys in core. Track both site count and distinct names, plus the new location of each moved rule. Nonincreasing; first baseline is A1-F8/F9/F10 census, machine count still UNKNOWN. | Deleting a group string while adding an opaque dispatcher with the same imported world code is no improvement. New feature adds its selector to its own registration. |
| M2.4 panels without kit | Inventory top-level player-facing panel IDs/factories against panel_kit registration. Count exact uncovered IDs, not calls to createElement or function names. Ceiling decreases as one panel is adopted; all new player panels use the kit. Current exact uncovered count UNKNOWN. | Cross-link A5 floors (6 sites/3 callers). Retain native markup/export adapters while moving ownership; no unrelated UI redesign or mobile gate. |
| M2.5 schema coupling | Count owner-specific expansion.schema tests/assignments in core/main and count new world-only global schema increments. Old sites nonincreasing; new world-only increments zero once the compatibility API lands. | First report-only inventory, then path-qualified baseline. Native/simulation data format changes still legitimately advance their own version. |
| M2.6 monolith seams | Per seam, count exported delegated functions, main/display back-import edges, and monolith implementation lines removed. No new back-import to main/display in extracted module; extracted logic cannot return to the monolith. | Line counts are review signals, not an unconditional ceiling that blocks a feature or rewards minification. A feature can add its own module while consuming an existing seam. |

A5 begins with its own baseline. Rebase it to the coordinator's integrated
tree, show old/new counts and semantic reasons, then lower accepted ceilings
after each integrated move. Baselines are reviewed input, never automatically
rewritten by tests. Initial checks report only; enforce stable AST/path metrics
once classified. Check changed counters in every feature branch, integrate
finished work before another wave, and refresh only affected references.
Do not hold feature work for the whole consolidation program or inflate the
baseline whenever a new world lands.

## M11: first three seams in each monolith

### A1-D7: small cuts with explicit dependencies (INFERRED)

Each row is one isolated worktree change. Public function/window contracts
stay stable through delegating wrappers; remove the moved implementation.
Factories receive callbacks/snapshots/nodes at boot. Do not import main.js
back into extracted code, capture obsolete mutable state, or split just by
line count. Move one seam, integrate, then dispatch the next.

| Order | main.js seam, verified source | Proposed dependency boundary and check |
|---:|---|---|
| 1 | Save writer-lock acquisition (:624-633) | `createSaveOwnership({locks, key, isProbe})` returns acquisition/lifetime control; main keeps ownsSave assignment and boot timing. Test two contenders, missing lock API, probe, rejection and held lifetime. Smallest extraction; no save shape or storage-key change. |
| 2 | Native context assembly (:795-807, :810-815, :825-844) | `createNativeContextReaders({readState, readNativeFrame, readEvidence, adapters})`; main supplies live character/calendar/location/stock and native adapters. Preserve call order, expeditionContext feedback, fact overwrite and busy logic. It must read current state on every invocation. Compare complete context snapshots for no enrollment, native NPC, away world, busy and changed vitals. Nonhuman/procgen owners retain their fields. |
| 3 | File import/restore orchestration (:7194-7206, :7236-7245) | `createSaveImportController({canWrite,isProbe,currentVersion,storage,readKey,preflight,reload,notify})`; preserve importInProgress guard and reload-after-success. Main keeps the 3k-line native load and create_save at first. Test async preflight rejection, duplicate import, read-only, storage failure and exact success bytes. Existing save_files import logic remains the executor. |

| Order | display.js seam, verified source | Proposed dependency boundary and check |
|---:|---|---|
| 1 | Effect tooltip and active-effect list (xp_target_name :817-829, create_effect_tooltip :836-911, displayedEffects/update functions :4195-4218) | `createEffectRenderer({readEffects,readBonusEffect,formatTime,skillLabel,statNames,nodes})`. Feed the M5 body-effect projection after it has equality proof. Preserve current key precedence until a separate change. Test empty/permanent/expiring effects, bonuses/category XP and observer-safe names. Desktop effect count and hover/keyboard details unchanged. |
| 2 | Log read/append controller (unread :145-185; counts/types :252-265; log_message :927-1122; dynamic unassign :1124-1126; clear :1169-1172) | `createMessageLog({node,readSettings,readOptions,formatters})` owns counts, dynamic loot line, scroll state and unread button. Keep log_loot formatting/animation outside initially; route append and clear through wrappers. Test category caps, dynamic replacement and clear; browser checks scrolled-up log stays put, unread jump works, follow-always and keyboard work. No localStorage/save migration. |
| 3 | Crafting detail model (item_recipe_state :3094-3100, material_type_known/build_item_recipe_model :3140-3177) | Extract only model construction as `buildCraftingDetail(selection, snapshot, readers)`. Inject recipe/material/skill/station/knownness/custody and result-tooltip reader. Keep selection DOM, scroll, window.useRecipe and receipt publication in display.js initially (:3111-3137/:3180-3231). Test unknown materials stay unnamed, reserved inputs block, quantities/chance/XP labels equal current output. No change to crafting executor or procgen mixing. |

These are behavior-preserving extractions. Desktop verification targets
1366x768 and 1600x1000: independent panels, visible routine actions and
comfortable text retained. Mobile optimization is deferred. Main-only logic
proof is a source/test claim; any UI parity claim needs rebuilt fresh-origin
browser evidence, with keyboard and affected saved-layout checks. Human taste
acceptance remains separate. None of these cuts is permission to extract all
8.8k/6.3k lines or replace the durable publisher at once.

## A1-F14/D8: W6 and root-kit cross-check

SHOWN: [W6_ENGINE_TEMPLATE](../../../../worlds/world-core-kit-2026-10-14/W6_ENGINE_TEMPLATE.md)
exists, is a completed **design** pass, and explicitly claims no runtime,
build/test/browser evidence (:5-9). The root [WORLD_CORE_KIT](../../../../worlds/WORLD_CORE_KIT_2026-10-14.md)
calls itself a palette, not a spec (:7-10). Their local source locators can
drift; A1's locators above use the current tree.

| Kit join | Cross-check and A1 consequence (INFERRED) |
|---|---|
| K2/K3/K13, RF16/RF17/FW8 | W6:75-76/:86/:105 prefers generic commands and a resolver only for unsupported semantics. Register existing resolvers, do not invent a giant law interpreter or require a bespoke host for every world. |
| K4/K17, EI4/EI6/EI8 | W6:45/:48 distinguishes typed-start strict keys, namespaced definitions and actual runtime copy plurality. Migrations preserve one pending/initialized selection and existing footprints; registration grants neither arbitrary copies nor new start fields. |
| K6/K7/K11, UP1-UP4/RF12 | W6:26-27/:31 and :79-80/:84 need cast/standing/knowledge consumers. M5 unifies read shapes while keeping known view, NPC truth, regard and institutional membership distinct. A4 owns standing design. |
| K8/K12, UP6/UP7/RF7 | W6:28/:85/:163 keeps freeze and ordered local clocks. M3 freezes current boundary order and unspent time; offline time is another owner's work. No closed-browser earnings. |
| K9/K15, UP8/RF9 | W6:29/:35/:161 demands conservation and separate provenance. Registry/job fixtures compare exact native inventory, custody and owner/body bindings; no saved duplicate stock. |
| K14, RF4/RF19 | W6:34/:87 requires panel binding/reveal; M2/M11 reuse kit and safe projections with desktop priority. No author/source truth in UI, DOM or error strings. |
| K18/FW9/FW10 | Root:54; W6:65-67/:91-93/:122-127 separates owner schema versions/content availability/proof refs. M4 registers runtime data versions; W6 manifest compatibility remains author-side metadata. Link versions/decision/proof, do not save kit readiness as game truth. |

W6's proposed three-body/role/era floors and K census are not new gates for
a behavior-preserving adapter move. Conversely, passing A1 fixtures cannot
claim a world meets those floors. Template/source/focused-test/browser/
persistence/human acceptance remain separate evidence layers.

## More to consider

New angles extend the root's M codes. All are INFERRED proposals.

| Code | Angle | Why it changes the consolidation plan |
|---|---|---|
| M3.1 | Fact overwrite receipts in dev: provider/key/previous-owner/new-owner, without logging values | Finds order dependencies before removing providers. Opaque diagnostics protect secrets; first registry preserves legacy precedence. |
| M3.2 | Registration/load permutation test | Import order or test execution order must not add duplicate controllers or change fact order. Build isolated registries; duplicate adapter IDs fail at composition. |
| M4.1 | Pending commitment compatibility is stricter than new content compatibility | A new revision can accept new jobs while old frozen jobs retain exact effects/source/body/costs. Track reader support for accepted commitments, not just current pack revision. |
| M4.2 | Unknown-owner recovery test with original-byte export | Adding a global version map must not erase unrecognized owner payload, migrate without exact content or leak source/secret details in errors. Rejection preserves the full original envelope. |
| M5.1 | Read-frame consistency and cost budget | A common read shape can accidentally mix a pre-commit inventory with post-commit vitals or recompute 40 providers per row. Bind reads to one explicit sequence/clock snapshot; measure one boundary before adding memoization. No duplicate saved derived snapshot. |
| M11.1 | Cut both implementation and reverse import edge | A new module that imports main.js preserves cycles and conflict pressure. Count back-import edges and stale closure reads, not only lines removed. |

### Ranked first changes, one worktree each

These five are the proposed initial queue. Root chooses/coordinates writers;
this docs result does not dispatch or authorize code work.

1. **A1-A1:** Rebase A5's ratchet baseline to the integrated tree and add an
   explicit adapter-edge/exception inventory in report mode. Own only A5's
   new tests/baseline paths, use this ledger, record old/new meanings. No
   source rewrite; first gate is correct scoped counters and existing replay.
2. **A1-A2:** Integrate/review A4's read-only relationship adapter, then wire
   one notebook reader in a separately reserved consumer file. No gate
   behavior or store change. Gate: source-qualified parity and observer-safe
   output. Do not duplicate A4's module or standing design.
3. **A1-A3:** Add the immutable runtime-registry container and move only
   Tidemark facts plus its outer clock callbacks through it. Reserve the
   few call sites in effects/engine and the application assembly; no other
   world moves. Gate: full Tidemark absent/active/pending/away/revisit
   differential trace and unchanged save bytes. If those hooks exceed one
   worktree's bounded scope, move facts first and clock second, keeping each
   single-world and the same trace fixture.
4. **A1-A4:** Add the single migration runner in legacy-only shadow mode,
   initially wrapping prepareFoundationSave and prepareV06Save. Compare
   candidate output to the existing path; do not switch writer/loader or add
   save_format yet. Gate: native-kit/retirement/idempotence/failure fixtures
   and immutable inputs. Expansion owner steps follow one at a time.
5. **A1-A5:** Extract the effect renderer from display.js through stable
   wrappers and injected readers, with existing combined-effect precedence.
   Gate: focused model/DOM parity and rebuilt desktop/keyboard effect view.
   This creates the first visible consumer seam for M5 without touching the
   combat, crafting or save executors.

## Current rule-fit constraints, 2026-10-18

Apply AR3/AR7/AR8/AR10–AR12 and AD16–AD18/AD32/AD36/AD38 at one demonstrated
consumer. A1-D2 phases/read-write declarations may inform a missing seam; they
are not a mandate to implement every sketched hook. Existing `domain_registry`
uses optional hooks and native publication/clock owners. A multi-minute callback
is not catch-up proof; an inactive world pauses by accepted policy unless actual
means change it. Pending/banked time and stage reservations settle once.

Old-save migration is currently deferred. A structural extraction still preserves
its selected behavior for a valid before/after comparison; a new feature need not
implement the whole A1-D4 format. First extend/reuse an existing owner rather than
turning this census or historical `Math.random` count into today's acceptance gate.
No runtime edit, new lane, merge or commit follows from this qualification.
