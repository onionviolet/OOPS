import {setProductAppearanceOwner} from './product_appearance_view.js';
import {STREAMS,ensureStreams,bindGameStreams,gameRandom,gameRandomRange,drawUnit,scopedStream,seededRecipe,validateNativeEncounter,streamSeed} from "./seeded_streams.js";
const mixtureSeed=()=>streamSeed(expansionState,STREAMS.craft,"village.mixtures@1");
const generatedPeopleSeed=()=>streamSeed(expansionState,scopedStream("world.people"),"village.generated_people@1");
import {getMixtureOwner,setMixtureOwner,MIXTURE_ID} from './mixture_state.js';
import {stageMixtureAction,commitMixturePlan} from './mixture_native.js';
import {createMixturePanel} from './mixture_ui.js';
import {createStoryletPanel} from './storylet_ui.js';
import {beginNativeCraftTransaction,nativeCraftQuestOwners} from './native_craft_transaction.js';
import {worldCompletionSavedNativeItem} from './world_completion_native.js';
import {createFoundationInteractionPanel} from './foundation_interaction_ui.js';
import {foundationInteractionProbeContext,foundationInteractionProbeGuard,FOUNDATION_PROBE_GROUP} from './foundation_interaction_content.js';
import {createFoundationStartContent,FOUNDATION_START_PACK_ID} from './foundation_start_content.js';
import {createLocalLivelihoodContent,LIVELIHOOD_PACK_ID} from './local_livelihood_content.js';
import {mountWorkspace,registerWorkspaceModule,workspaceOwns,openWorkspaceModule} from './workspace_layout.js';
import {createWorkspaceViews,createEquipmentComparison} from './workspace_views.js';
import {defaultCustomizationState,validateCustomizationState,getCustomizationSettings,applyCustomizationProfile} from './customization_profiles.js';
import {createCustomizationUI} from './customization_ui.js';
import {createWorkLedgerAuthorUI} from './work_ledger_author_ui.js';
import {createSettledTextEffects} from './settled_text_effects.js';
import {createNativeDiscoveryFeedback} from './native_discovery_feedback.js';
import {nativeSkillDiscovery} from './skill_discovery_native.js';
import {createQuietPlaceDetail} from './quiet_place_detail.js';
import {createWorkLedger,migrateWorkLedger,validateWorkLedger,transitionWorkLedger,observeWorkLedgerCraft,modifyWorkLedgerChance,modifyWorkLedgerQuality,workLedgerPresentation,createWorkLedgerRulesDraft,applyWorkLedgerRulesDraft,resetWorkLedgerRules} from './work_ledger_system.js';
import {createWorkLedgerUI} from './work_ledger_ui.js';
import {commitManagement} from './management/host.js';
import {createManagementPanel} from './management/ui.js';
import {normalizeElementalOption,describeElementalPreparation,ELEMENTAL_SETTING_DESCRIPTION} from './absorb_e3/elemental_affinities.js';
import {equipmentDurability as durability,createDurability} from './absorb_e2/durability.js';
import {getPacingState,setPacingState,advancePacing,prepareFood,getPacingEffects} from './absorb_e1/pacing.js';
import {mountPacingPanel,pacingStatus} from './absorb_e1/panel.js';
import {setKnownClearTextReader} from './display.js';
import {FORT, createFortSupply, migrateFortSupply, stageFortAction, observeFortSource, fortDisclosures, knownClearText} from './absorb_d/fort.js';
import {registerFortContent} from './absorb_d/register.js';
import {createFortControls} from './absorb_d/ui.js';
import {normalizeLocalLife, advanceLocalLife, localLifeAction} from './absorb_c2/local_life.js';
import {createLocalLifePanel} from './absorb_c2/panel.js';
import {setAccessoryEquipmentReader, accessoryCraftingTiers} from './absorb_c1/accessories.js';
import {furnitureProjection, furnitureSkillMultiplier, furnitureRecovery, furniturePresentation, furnitureItemBonusText} from './absorb_b/furniture.js';
import {STEAM_ABSORPTION_GROUPS} from './steam_absorption_content.js';
import {steamAbsorptionContext,commitSteamAbsorptionCommand} from './steam_absorption_host.js';
import {contextualBalmContext,commitContextualBalmCommand,stageContextualBalmEffectRequest} from './contextual_balm_host.js';
import {prepareContextualBalmNative} from './contextual_balm_native.js';
import {coolingRefinementContext,commitCoolingRefinementCommand} from './cooling_refinement_host.js';
import {commitAgreedDutyAction} from './agreed_duty_host.js';
import {createKnownRoutesPanel} from './known_routes_ui.js';
import {knownRoutesPresentation} from './known_routes_host.js';
import {pocketRealmView,pocketRealmActions,previewPocketRealmAction} from './pocket_realm_host.js';
import {proto23Presentation} from './proto23_world_host.js';
import {gameAbsorptionAssayContext,commitGameAbsorptionAssayCommand,cancelGameAbsorptionAssayJob} from './game_absorption_assay_host.js';
import {validateGameAbsorptionAssay} from './game_absorption_assay_facts.js';
import {commitParadiseCampaignDepthCommand} from './book_world_paradise_campaign_host.js';
import {reconcileParadiseCampaignDepthRuntime} from './book_world_paradise_campaign_runtime.js';
import {projectParadiseCampaignEffects,paradiseCampaignContext} from './book_world_paradise_campaign_facts.js';
import {worldCompletionContext} from './world_completion_facts.js';
import {commitWorldCompletionCommand} from './world_completion_host.js';
import {worldCompletionSimulationContexts,reconcileWorldCompletionPlan} from './world_completion_runtime.js';
import {commitLorePracticeCommand} from './lore_practice_host.js';
import {reconcileLorePractice,lorePracticeSimulationContexts} from './lore_practice_runtime.js';
import {commitBookCareCommand} from './book_care_host.js';
import {projectBookCareEffects} from './book_care_facts.js';
import {reconcileBookCareRuntime} from './book_care_runtime.js';
import {commitFieldCareCommand,reconcileFieldCareNative} from './field_care_host.js';
import {projectFieldCareEffects} from './field_care_facts.js';
import {commitStatusCareCommand,reconcileStatusCareNative} from './status_care_host.js';
import {projectStatusCareEffects,statusCareRainMultiplier} from './status_care_facts.js';
import {createCausalStoryNativeBindings} from './causal_story_native.js';
import {causalStoryContext,causalStorySimulationContexts,commitCausalStoryCommand,reconcileCausalStoryPlan,causalStoryTravelReasons} from './causal_story_host.js';
import {createCausalStoryUI} from './causal_story_ui.js';
import {CAUSAL_STORY_PROOFS,causalStoryPersonIds,causalStoryId} from './causal_story_ids.js';
import {readNativeFighter} from './native_battle.js';
import {commitArtifactWorkshopCommand} from './artifact_workshop_host.js';
import {advanceAuditRemainder,auditRemainderSimulationContexts} from './audit_remainder_runtime.js';
import {validateAuditRemainderNative} from './audit_remainder_facts.js';
import {auditRemainderContext,commitAuditRemainderCommand} from './audit_remainder_host.js';
// Initialize the existing cyclic core before optional host adapters.
import './expansion_engine.js';
import {setFieldcraftKnowledgeReader} from './display.js';
import {nethackFieldcraftContext,commitNethackFieldcraftCommand} from './nethack_fieldcraft_host.js';
import {auditedWorkshopContext,commitAuditedWorkshopCommand} from './audited_workshop_host.js';
import {startAuditedKitReserve,controlAuditedKitReserve} from './audited_kit_reserve_host.js';
import {createParadiseNativeBindings} from './book_world_paradise_native.js';
import {createMolNativeBindings} from './book_world_mol_native.js';
import {MOL_LOCATIONS,MOL_FOOTPRINTS} from './book_world_mol_content.js';
import {activeMolVisit,molContext,molSimulationContexts,commitMolCommand} from './book_world_mol_host.js';
import {syncMolClock} from './book_world_mol_state.js';
import {createProto23NativeBindings} from './proto23_world_native.js';
import {PROTO23_LOCATIONS,PROTO23_FOOTPRINTS} from './proto23_world_content.js';
import {activeProto23Visit,proto23Context,proto23SimulationContexts,commitProto23Command} from './proto23_world_host.js';
import {syncProto23Clock} from './proto23_world_state.js';
import {factorioRetortContext,commitFactorioRetortCommand,cancelFactorioRetortJob,startFactorioRetortPlan,controlFactorioRetortPlan} from './factorio_retort_host.js';
import {projectBookWorldEffects} from './book_world_effects.js';
import {commitHomeFurnishingCommand} from './home_furnishing_host.js';
import {commitCrushSocialAction} from './crush_social_host.js';
import {createCrushSocialPanel} from './crush_social_views.js';
import {PARADISE_IDS,PARADISE_LOCATIONS,PARADISE_FOOTPRINTS} from './book_world_paradise_content.js';
import {BOOK_WORLD_AGENCY_CONTRACTS,validateBookWorldAgencyContracts} from './book_world_player_agency_contracts.js';
import {activeParadiseVisit,paradiseContext,paradiseSimulationContexts,syncParadiseClock,commitParadiseCommand} from './book_world_paradise_host.js';
import {stageParadiseCarrierClock,retainParadiseCarrierReceipt} from './book_world_paradise_carriers.js';

import {commitNestedLifeCommand,previewNestedLifeCommand,nestedLifeContext} from './feature_expansion_nested_life.js';
import {createNestedInkPanels} from './feature_expansion_nested_ink_ui.js';
import {previewNestedCommand} from './feature_expansion_nested_host.js';
import {createQualifiedBacklogAdapter,bookNativeContext,assertQualifiedOfficePlan} from './feature_expansion_book_host.js';
import {replacementView,replacementCarrierView,validateReplacementRecord} from './backlog_expansion_replacement.js';
import {createRelayHost,relayContext,validateRelayState} from './feature_expansion_subtlety_host.js';
import {createReferenceDeskHost,referenceDeskContext} from './feature_expansion_reference_desk.js';
import {createNestedNativeBindings} from './feature_expansion_nested_native.js';
import {NESTED_IDS,NESTED_LOCATIONS} from './feature_expansion_nested_content.js';
import {nestedContext,nestedSimulationContexts,activeNestedVisit,syncNestedCampaignClock,commitNestedCommand} from './feature_expansion_nested_host.js';
import {nestedChainContext,nestedChainSimulationContexts,commitNestedChainCommand} from './feature_expansion_nested_chains_host.js';
import {stageNestedCarrierClock,retainNestedCarrierReceipt} from './feature_expansion_nested_carriers.js';
import {refinementPresentation} from './feature_expansion_refinements_host.js';
import {registerBookSubtletyCatalogue} from './feature_expansion_book_catalogue.js';
import {createReplacementRecognitionPanel} from './feature_expansion_recognition_host.js';
import {createTidemarkNativeBindings} from './feature_expansion_destination_native.js';
import {activeTidemarkVisit,tidemarkContext,tidemarkSimulationContexts,syncTidemarkClock,commitTidemarkAction,beginTidemark} from './feature_expansion_destination_host.js';
import {TIDEMARK_LOCATIONS,TIDEMARK_IDS} from './feature_expansion_destination.js';
import {featurePowerContext,planFeaturePowerCommand} from './feature_expansion_powers_host.js';
import {createFeatureBattleHost} from './feature_expansion_battle_host.js';
import {featureBattleToken} from './feature_expansion_battle.js';
import {advanceReferenceGameplay,commitReferenceControl} from './reference_gameplay_state.js';
import {referenceGameplayContext,commitReferenceGameplayCommand} from './reference_gameplay_host.js';
import {startWorkPlan,controlWorkPlan} from './feature_expansion_work_plan.js';
import {backlogNativeContext,commitBacklogAction,assertBacklogPublication,backlogNativeClockPaused,backlogNativeActionReasons,backlogActions,previewBacklogAction} from './backlog_expansion_host.js';
import {createBacklogExpansionPanel} from './backlog_expansion_ui.js';
import {repositoryAbsorptionContext,beginRepositoryAbsorption,commitRepositoryAbsorption,cancelRepositoryAbsorption,commitRepositoryProjection} from './repository_absorption_host.js';
import {createRepositoryAbsorptionPanel} from './repository_absorption_ui.js';
import {commitInkNarrativeAction,inkNarrativeView} from './ink_narrative.js';
import {createTidemarkInkHost,createRelayInkHost} from './ink_scene_content.js';
import {createInkNarrativeUI} from './ink_narrative_ui.js';
import {beginFeatureObjects,commitFeatureObjectCommand,validateFeatureObjectState,featureObjectContext} from './feature_expansion_objects_host.js';
import {beginSociety,commitSocietyAction,societyContext} from './feature_expansion_society_host.js';
import {createFeatureExpansionPanel} from './feature_expansion_ui.js';
import {featureWavePresentation} from './feature_expansion_wave_host.js';
import NPC from './models/npc.js';
import {SafeLocation, CombatZone} from './models/location.js';
import {TraderComponent} from './components/trader_component.js';
import {commitPocketRealmAction,pocketContext} from './pocket_realm_host.js';
import {skillExpansionContext} from './skill_expansion_host.js';
import {createSkillExpansionPanel} from './skill_expansion_ui.js';
import {createOriginalFrontierPanel} from './original_frontier_campaign_ui.js';
import {beginOriginalFrontier,commitOriginalFrontier,originalFrontierContext,recordOriginalFrontierEncounter} from './original_frontier_campaign_host.js';
import {createPocketRealmPanel} from './pocket_realm_ui.js';
import {registerPocketLocation,POCKET_LOCATION} from './data/pocket_location.js';
import {activeRealmVisit,realmSimulationContexts,syncRealmClock} from './realm_state.js';
import {beginObservation,commitObservationCommand} from "./observation_content.js";
import {createObservationPanel} from "./observation_ui.js";
import {beginExchange,commitExchangeCommand} from './exchange.js';
import {createExchangePanel} from './exchange_ui.js';
import {beginPromiseVisitor} from "./promise_content.js";
import {createPromisePanel} from "./promise_ui.js";
import {createFrontierCampaignPanel} from "./frontier_campaign_ui.js";
import {createNativeBattleHost} from "./native_battle_host.js";
import {initializeNativeBattle} from "./native_battle.js";
import {initializePartyBattle,partyHelperReasons} from "./party_battle.js";
import {createPartyPanel} from "./party_ui.js";
import {prepareRivalRematch,commitFieldRenewal,RIVAL_PURSUIT} from "./frontier_campaign.js";
"use strict";

import { current_game_time, is_night, Game_Time } from "./game_time.js";
import { Book, BookData, OtherItem, Armor, item_templates, item_log, getItem, book_stats, rarity_multipliers, getArmorSlot, getItemFromKey, getItemRarity} from "./items.js";
import { loot_sold_count, market_region_mapping, recover_item_prices, trickle_market_saturations, set_loot_sold_count, capped_at } from "./market_saturation.js";
import { locations, favourite_locations, location_types } from "./data/locations.js";
import { skills } from "./data/skills.js";
import { which_skills_affect_skill } from "./models/skill.js";
import { Enemy, enemy_killcount, enemy_templates, tags_for_droprate_modifier_skills } from "./enemies.js";
import { is_in_trade, start_trade, cancel_trade, accept_trade, exit_trade,
         add_to_buying_list, remove_from_buying_list, add_to_selling_list, remove_from_selling_list} from "./trade.js";
import { character, 
         time_until_wet,
         cold_status_temperatures,
         time_until_cold,
         time_until_cold_when_wet,
         cold_status_effects,
         hero_id,
         } from "./data/character.js";
import { activities } from "./activities.js";
import { end_activity_animation, 
         update_displayed_character_inventory, update_displayed_trader_inventory, sort_displayed_inventory, sort_displayed_skills,
         update_displayed_money, log_message,
         update_displayed_combat_location, update_displayed_normal_location,
         log_loot, update_displayed_equipment,
         update_displayed_health, update_displayed_stamina,
         format_money, update_displayed_stats,
         update_displayed_effects, update_displayed_effect_durations,
         update_displayed_time, update_displayed_character_xp, 
         start_sleeping_display,
         create_new_skill_bar, update_displayed_skill_bar, update_displayed_skill_description,
         update_displayed_ongoing_activity, 
         remove_fast_travel_choice,
         create_new_bestiary_entry,
         start_reading_display,
         update_displayed_xp_bonuses, 
         update_displayed_skill_xp_gain, update_all_displayed_skills_xp_gain, update_displayed_stance_list, 
         update_displayed_stamina_efficiency, update_displayed_stance, update_displayed_faved_stances,
         update_gathering_tooltip,
         open_crafting_window,
         update_displayed_location_types,
         close_crafting_window,
         switch_crafting_recipes_page,
         switch_crafting_recipes_subpage,
         create_displayed_crafting_recipes,
         update_displayed_component_choice,
         update_displayed_material_choice,
         update_recipe_tooltip,
         update_displayed_crafting_recipes,
         update_item_recipe_visibility,
         update_item_recipe_tooltips,
         update_displayed_book,
         update_backup_load_button,
         update_other_save_load_button,
         set_game_action_finish_text,
         update_game_action_progress_bar,
         update_game_action_finish_button,
         update_displayed_storage_inventory,
         update_location_icon,
         skill_list,
         update_booklist_entry,
         update_displayed_temperature,
         update_displayed_quest, add_quest_to_display,
         start_rain_animation,
         start_snow_animation,
         stop_background_animation,
         skill_category_order,
         update_displayed_total_price,
         start_stars_animation,
         update_export_button_tooltip,
         update_displayed_reputation,
         hide_loading_screen,
         set_loading_screen_versions,
         set_loading_screen_errors_warning,
         set_loading_screen_progress,
         hide_loading_text,
         show_play_button,
         set_loading_screen_warnings_warning,
         fill_action_box,
         update_bestiary_entry_killcount,
         update_bestiary_entry_tooltip,
         set_play_button_text,
         create_floating_effect,
         booklist_entry_divs,
         update_location_kill_count,
         change_completed_quest_visibility,
         update_fav_display,
         update_displayed_item_log,
         set_light_based_background_color,
         unassign_dynamic_loot_message,
         fill_character_bio,
         insert_HTML,
        } from "./display.js";
import { update_displayed_fighters_stats, update_displayed_health_of_fighter, } from "./ui/combat_display.js";
import { compare_game_version, crafting_tags_to_skills, get_component_name, is_a_older_than_b, get_item_mapping, skill_consumable_tags, rtp, write_availability_status, npc_key_mapping, format_working_time } from "./misc.js";
import { stances } from "./combat_stances.js";
import { registerMixtureGathering, recipes, get_recipe_xp_value, get_component_stats } from "./crafting_recipes.js";
import { game_version, get_game_version } from "./game_version.js";
import { restoreActiveEffect, ActiveEffect, effect_templates } from "./active_effects.js";
import { open_storage, close_storage, move_item_to_storage, remove_item_from_storage, player_storage, is_storage_open, bind_storage_transfer } from "./data/storage.js";
import { Verify_Game_Objects } from "./verifier.js";
import { quests, questManager, active_quests, Quest, QuestTask } from "./quests.js";
import { get_current_temperature_smoothed, is_raining } from "./weather.js";
import { Pathfinder, speed_modifiers_from_skills } from "./pathfinding.js";
import { translationManager } from "./translation.js";
import { characterCreator } from "./character_creation.js";
import { config } from "./config.js";
import NPCRegistry from "./data/npcs.js";
import InventoryComponent, { inventories } from "./components/inventory_component.js";
import { levels, availabilities } from "./data/component_references.js";
import { dialogues } from "./data/dialogues.js";
import { flag_to_status, status_to_flag } from "./components/availability_component.js";
import { height_values } from "./models/person.js";
import { playable_races } from "./races.js";
import { fill_availability_methods } from "./component_management.js";
import Combat from "./models/combat.js";
import { Rewards } from "./rewards.js";
import { ReputationManager } from "./reputation.js";
import { traders } from "./data/traders.js";
import { dialogue_owners } from "./components/dialogue_component.js";

fill_availability_methods();
registerFortContent({locations,item_templates,book_stats,quests,availabilities,SafeLocation,CombatZone,Book,BookData,Quest,QuestTask});

import {prepareFoundationSave, retainRetiredContent} from "./save_compatibility.js";
import {writeGuardedSave, encodeSaveFile, importSaveFile, validateSaveEnvelope} from "./save_files.js";
import {preflightImport, installImportProbe} from "./import_probe.js";
import {restoreSavedReputation, shouldReplayReputation} from "./reputation_state.js";
import {hasEarnedClear} from "./clear_state.js";
import {createExpansionState, loadExpansionState, commitAction, advanceSimulation, cancelAction, validateExpansionState} from "./expansion_engine.js";
import {beginFieldWorkshop} from "./field_workshop.js";
import {createFieldPanel} from "./field_ui.js";
import {expeditionRegistry, initializeExpedition, SURVEY_KIT_KEY, SURVEY_ROPE_KEY} from "./expedition_content.js";
import {defaultCheatState, validateCheatState, grantCheat, optionalStartCard, awakenCheats} from './cheat_cards.js';
import {loadContentPacks, emptyPackState, validatePackState, enterPack, leavePack, actPack, cancelPack, advancePackSettlement, preparePackSave, packSaveState} from './content_packs.js';
import {syncAuthoredRegistration, applyAuthoredState, resetAuthoredState, AUTHORED_WORLD_ID} from './authored_site.js';
import {createAuthoredSiteUI} from './authored_site_ui.js';
import {compileStructuredPack,mergeStructuredPack,stageStructuredNativeObjects} from './structured_pack_definitions.js';
import {beginStructuredCampaign,planStructuredSelection,validateStructuredBootstrap,structuredCampaignView} from './structured_pack_runtime.js';
import {requireStructuredContent,requireStructuredSelection} from './structured_pack_state.js';
import {previewStructuredRenewal,commitStructuredRenewal} from './structured_renewal.js';
import {createStructuredPackPanel} from './structured_pack_ui.js';
import {nativeStructuredEquipmentTemplate,projectStructuredEquipment} from './structured_equipment_runtime.js';
import {createContentPackPanel} from './content_pack_ui.js';
import {SafeLocation as OptionalPackLocation} from './models/location.js';
const optionalPacks=new Map();
const foundationProbeEnabled=typeof location!=='undefined'&&['localhost','127.0.0.1'].includes(location.hostname)&&new URLSearchParams(location.search).get('foundation_probe')==='1';
const structuredPacks=new Map();
const initialStructuredDefinition=()=>foundationProbeEnabled&&structuredPacks.get(FOUNDATION_START_PACK_ID)||structuredPacks.get(LIVELIHOOD_PACK_ID)||[...structuredPacks.values()][0];
const packDefinitionsForSave=()=>new Map([...optionalPacks,...structuredPacks]);
let structuredPanel,structuredNotice='',suspendedStructuredSave=null;
let cheatState=defaultCheatState();
let statusWindow;
function cheatCalendarTime() {
    const {year, month, day, hour, minute, day_count} = current_game_time;
    return {year, month, day, hour, minute, day_count};
}
function awakenOptionalStart(wonFight = false) {
    const result = awakenCheats(cheatState, {dayCount: current_game_time.day_count, wonFight, at: cheatCalendarTime()});
    if(!result.messages.length) return;
    cheatState = result.state;
    for(const message of result.messages) log_message(message, 'notification');
    statusWindow?.render();
    save_progress();
}
let optionalPackState=emptyPackState();
let optionalPackPanel;
import "./data/expedition_items.js";
import {createExpeditionPanel} from "./expedition_ui.js";
import {persistExpansionPlan} from "./expansion_persistence.js";
import {prepareGameplayPublication} from "./gameplay_publication.js";

import {readInventoryOwner, prepareOwnershipPublication, recordAcquisitions} from "./acquisition.js";
import {createNativeGameplayAdapter, publishNativeVitals, nativeActionReasons, assertNativeItemDisposition} from "./native_gameplay_adapter.js";
import {stageNativeTrade} from "./native_trade_transaction.js";

import {activePractice, answerTechniquePractice, cancelTechniquePractice, observeNativeTechnique} from "./techniques.js";
import {createTechniquePanel} from "./technique_ui.js";
import {applyGameplayEffect} from "./gameplay_transactions.js";
import {commandChronicle, chronicleFacts, automaticResponse} from "./chronicle.js";
import {createChroniclePanel} from "./chronicle_ui.js";
import {techniqueFacts} from "./techniques.js";
import {RAT_STEP} from "./technique_content.js";
import {calendarMinutes} from "./world_rhythm.js";
import {ROUTE_NOTES, NOTES_KEY, usesVillageClock} from "./village_content.js";
import {createVillagePanel} from "./village_ui.js";
import {everydayFacts, recordRouteReading} from "./everyday_life.js";
import {townUnlocks, usesTownClock} from "./town_content.js";
import {createTownPanel} from "./town_ui.js";
import {createExpansionQuests} from "./expansion_quest_ui.js";
import {worldIdentityView} from "./world_knowledge.js";
import {createStatusWindow} from './status_window.js';
import {createAdventureNotebook} from "./adventure_notebook.js";
import {createCharacterBio} from "./character_bio_ui.js";
import {bodyFacts, beginBodyRecord} from "./body_progression.js";
import {createBodyPanel} from "./body_ui.js";
import {createSimulationPanel} from "./simulation_ui.js";
import {createEventFeed} from "./event_feed_ui.js";
import {lifeLearningMultiplier,LIFE_LESSONS} from './life_experience.js';
import {buildLifeHeirSave} from './life_experience_host.js';
import {deriveHeirLeftovers,heirLeftoverLines} from './heir_inheritance.js';
import {enrollSimulation, commitSimulationCommand, cancelSimulationJob, setSimulationProgram, pauseSimulationProgram, resumeSimulationProgram, answerSimulationEncounter, withdrawSimulationEncounter,
    respondSimulationEvent, simulationOccupiesActor, waitingSimulationChoice} from "./simulation.js";
import {prepareNativeUnlocks} from "./native_unlock_transaction.js";
import {readNativeEquipment, prepareNativeEquipment, nativeEquipmentSnapshot} from "./native_equipment_transaction.js";
import {stageNativeStorageTransfer} from "./native_storage_transaction.js";
import {recordPursuitDeparture,pursuitView} from "./pursuit.js";
import {createPursuitPanel} from "./pursuit_ui.js";

const gameplayBindings = {player: {category: "person", id: "main_character"}, oldCraftsman: {category: "person", id: "oldCraftsman"}};

let retiredContent = {schema: 1, entries: []};
let foundationSaveBlocked = false;
const importProbeToken = new URL(window.location.href).searchParams.get("import_probe");
let importInProgress = false;
let loadingReputationTotals = null;
let restoringNativeSave = false;

import {prepareV06Save} from "./save_migration.js";

const save_key = "save data";
const dev_save_key = "dev save data";
const backup_key = "backup save";
const dev_backup_key = "dev backup save";
// Heir succession: the ended life stays in the save slot until the heir's
// envelope passes the real import check. Only a small request crosses reload.
const heir_request_key = "heir request";
const heirRequest = (() => {
    if(importProbeToken) return null;
    try {
        const r = JSON.parse(localStorage.getItem(heir_request_key));
        if(r?.error) localStorage.removeItem(heir_request_key);
        return r?.schema === 1 ? r : null;
    } catch {localStorage.removeItem(heir_request_key); return null;}
})();

registerBookSubtletyCatalogue(expeditionRegistry);
const agencyIntegrity=validateBookWorldAgencyContracts();if(!agencyIntegrity.valid)throw new Error(`Invalid book-world source contracts: ${agencyIntegrity.errors.join('; ')}`);
expeditionRegistry.bookPlayerAgency={contracts:BOOK_WORLD_AGENCY_CONTRACTS,nativeBindings:new Map([['reincarnation-paradise',{revision:1,worldIds:PARADISE_FOOTPRINTS.map(f=>f.worldId),scope:'first-Goa supplied-MTL alternate branch',status:'implemented-unverified'}],['mother-of-learning',{revision:1,worldIds:MOL_FOOTPRINTS.map(f=>f.worldId),scope:'Cyoria academy independent visitor branch',status:'implemented-unverified'}]])};
import {createLifeRecord, migrateLifeRecord, observeLifeSave, appendLifeMilestone, lifeCalendarMinute} from './life_record.js';
import {createLifeRecordPanel} from './life_record_ui.js';
import {normalizeTitles, grantEarnedTitles, titleBonuses, titleView, title_by_id, describeTitleBonus, yearsSince, titleCalendarMinute} from './titles.js';
import {createTitlesPanel} from './titles_ui.js';
let titlesPanel;
let title_check_ticks = 0;
import {createVillageLives, advanceVillageLives, addVillageRecruit} from './npc_lives.js';
import {createVillageLivesPanel} from './npc_lives_ui.js';
import {restoreGeneratedPeople, generatedPeopleSnapshot, registerGeneratedPeople} from './generated_people_ui.js';
import {createVillageCareer, migrateVillageCareer, beginVillageShift, finishVillageShift, resolveVillageKit, promoteVillageCareer, CAREER_RANKS, WATCHCRAFT_BOOK, WATCHCRAFT_READING, WATCHCRAFT_PRACTICE, issueWatchcraft, practiceWatchcraft, watchcraftPresentation, villageShiftBonus, assignVillageRecruit, beginVillageTeaching, beginRecruitSolo, advanceVillageMentor, villageTeachingCost, villageTeachingStipend, resolveIonaTuition, villageTeachingBusy, beginTessaInstruction, advanceTessaInstruction, COVER_PAYMENT, SOLO_PAYMENT} from './village_career.js';
import {createVillageCareerControls} from './village_career_ui.js';
let customization = defaultCustomizationState();
let customizationPanel, workLedgerAuthor;
let workLedger = createWorkLedger();
const nativeCraftScopes=[];
let workLedgerPanel;
let workLedgerCraftEffects;
let nativeDiscoveryFeedback;
let villageCareer = createVillageCareer();
let villageCareerControls;
let npcLives = null;
let villageLivesPanel;
let lifeRecord = createLifeRecord();
let lifeRecordPanel;
let lifeStorageFailure = false;
// Shared save writes stage life observations and publish them only after success.
const lifeSaveStorage = {setItem(key, serialized, onDurable) {
    const save = JSON.parse(serialized);
    const next = observeLifeSave(save.life_record ?? createLifeRecord(), save);
    save.life_record = next;
    const nextNpc = save.npc_lives == null ? null : advanceVillageLives(save.npc_lives, save['current time'].year);
    if(nextNpc) save.npc_lives = nextNpc;
    writeGuardedSave(localStorage, key, JSON.stringify(save));
    onDurable?.();
    villageCareer = migrateVillageCareer(save);
    const previousRules=workLedger?.rules,previousConnection=workLedger?.connection,previousPrecision=workLedger?.precisionKnown,previousAssist=workLedger?.assistUnlocked;
    workLedger=migrateWorkLedger(save.work_ledger);
    if(previousRules?.revision!==workLedger.rules.revision||previousConnection!==workLedger.connection||previousPrecision!==workLedger.precisionKnown||previousAssist!==workLedger.assistUnlocked)update_displayed_crafting_recipes();
    customization=customizationFromSave(save);
    refreshCustomization();
    workLedgerPanel?.render();
    cheatState=validateCheatState(save.cheats??defaultCheatState());
    optionalPackState=validatePackState(save.content_packs??emptyPackState());
    optionalPackPanel?.render();
    villageCareerControls?.render();
    lifeRecord = next;
    npcLives = nextNpc;
    restoreGeneratedPeople(save);
    lifeRecordPanel?.render();
    villageLivesPanel?.render();
}};

let expansionState = initializeExpedition(createExpansionState(crypto.getRandomValues(new Uint32Array(1))[0]));
ensureStreams(expansionState);
bindGameStreams(() => expansionState);
let pendingNativeEncounter = null;
setFieldcraftKnowledgeReader(()=>expansionState);
character.setSimulationEffectReader(()=>{const context={nativeBody:currentNativeBody(),nativeAlive:character.is_alive===true};return {...projectStatusCareEffects(expansionState,expeditionRegistry,context),...projectFieldCareEffects(expansionState,expeditionRegistry,context),...projectBookCareEffects(expansionState,expeditionRegistry,context),...projectBookWorldEffects(expansionState,expeditionRegistry,context),...projectParadiseCampaignEffects(expansionState,expeditionRegistry,context),...structuredEquipmentView().effects};});
let publishedStatusCareSignature = "";
let expansionError = "";
let expeditionPanel;
let techniquePanel;
let chroniclePanel;
let villagePanel;
let simulationPanel;
let pursuitPanel;
let townPanel;
let adventureNotebook;
let knownRoutesPanel;
let expansionQuests;
let characterBio;
let bodyPanel;
let fieldPanel;
let promisePanel;
let managementPanel;
let crushSocialPanel;
let worldEventFeed;
let frontierCampaignPanel;
let nativeBattleHost;
let partyPanel;
let exchangePanel;
let observationPanel;
let pocketRealmPanel;
let skillExpansionPanel;
let originalFrontierPanel;
let featureExpansionPanel;
let foundationInteractionPanel;
let causalStoryPanel;
let featureBattleHost;
let backlogPanel;
let replacementRecognitionPanel;
let backlogOpeningPanel;
let repositoryPanel;
let inkPanel;
let nestedInkPanels;
const qualifiedBacklog=createQualifiedBacklogAdapter({
    commit:(state,registry,command,context,sequence)=>commitBacklogAction(state,registry,command,context,sequence,{advancePlan:(plan,minutes)=>advanceChroniclePlan(plan,minutes,true)}),
    preview:previewBacklogAction,actions:backlogActions,validate:state=>validateReplacementRecord(state.backlog,state),view:replacementView,carrierView:replacementCarrierView
});
const relayHost=createRelayHost(qualifiedBacklog),referenceDeskHost=createReferenceDeskHost();
const tidemarkInkHost=createTidemarkInkHost();
const relayInkHost=createRelayInkHost({previewReplacement:qualifiedBacklog.preview,commitReplacement:qualifiedBacklog.commit});
function currentInkHost(){
    const wrapper=expansionState.inkNarrative,saved=wrapper?.schema===2?wrapper.legacy:wrapper;
    if(saved&&saved.status!=='complete')return saved.sceneId==='relay.office'?relayInkHost:tidemarkInkHost;
    return current_location?.id==='Village'?relayInkHost:tidemarkInkHost;
}

let hasLoadedNativeSave=false;
registerPocketLocation();
const tidemarkNative=createTidemarkNativeBindings({NPC,NPCRegistry,SafeLocation,locations,availabilities,InventoryComponent,inventories,TraderComponent,Quest,QuestTask,quests,activeQuests:active_quests,Game_Time,getItemFromKey,getNativeContext:get_context,getCurrentLocation:()=>current_location?.id||null,getNativeBody:()=>{
    const body=expansionState.backlog?.body?expansionState.simulation?.people.player?.body:null;
    return {id:body?.id||'native.player.body',form:body?.form||character.getRace()};
}});
tidemarkNative.register();
const nestedNative=createNestedNativeBindings({NPC,NPCRegistry,SafeLocation,locations,availabilities,InventoryComponent,inventories,TraderComponent,Quest,QuestTask,quests,activeQuests:active_quests,Game_Time,getItemFromKey,getNativeContext:get_context,getCurrentLocation:()=>current_location?.id||null,getNativeBody:()=>{
    const body=expansionState.backlog?.body?expansionState.simulation?.people.player?.body:null;
    return {id:body?.id||'native.player.body',form:body?.form||character.getRace()};
}});
nestedNative.register();
const paradiseNative=createParadiseNativeBindings({NPC,NPCRegistry,SafeLocation,locations,availabilities,InventoryComponent,inventories,TraderComponent,Quest,QuestTask,quests,activeQuests:active_quests,Game_Time,getItemFromKey,getNativeContext:get_context,getCurrentLocation:()=>current_location?.id||null,getNativeBody:()=>{
    const body=expansionState.backlog?.body?expansionState.simulation?.people.player?.body:null;
    return {id:body?.id||'native.player.body',form:body?.form||character.getRace(),ownerId:body?.ownerId||'player',controllerId:body?.controllerId||'player'};
}});
paradiseNative.register();
const molNative=createMolNativeBindings({NPC,NPCRegistry,SafeLocation,locations,availabilities,InventoryComponent,inventories,TraderComponent,Quest,QuestTask,quests,activeQuests:active_quests,Game_Time,getItemFromKey,getNativeContext:get_context,getCurrentLocation:()=>current_location?.id||null,getNativeBody:currentNativeBody});
molNative.register();
const proto23Native=createProto23NativeBindings({NPC,NPCRegistry,SafeLocation,locations,availabilities,InventoryComponent,inventories,TraderComponent,Quest,QuestTask,quests,activeQuests:active_quests,Game_Time,getItemFromKey,getNativeContext:get_context,getCurrentLocation:()=>current_location?.id||null,getNativeBody:currentNativeBody});
proto23Native.register();
function nativeCareFrame() {
    return {clock:expansionState.clock,calendarMinute:calendarMinutes(current_game_time),underRoof:current_location?.is_under_roof===true,
        battleRunning:!!current_combat,effects:Object.fromEntries(Object.entries(active_effects).map(([id,e])=>[id,{duration:e.duration}]))};
}
function refreshStatusCareStats(force=false) {
    const signature=JSON.stringify(Object.entries(character.getSimulationEffects()).map(([id,e])=>[id,e.effects.stats]));
    if(force || signature!==publishedStatusCareSignature) {
        character.addActiveEffectBonus(active_effects);character.updateStatsAndDisplay();
        publishedStatusCareSignature=signature;update_displayed_effects();
    }
}
function structuredEquipmentView() {
    const definition=structuredPacks.get(optionalPackState?.structured?.packId);
    if(!definition)return {effects:{},facts:{},rainMultiplier:1};
    const temperature=current_location?get_current_temperature_smoothed():15;
    const sheltered=current_location?.is_under_roof===true;
    return projectStructuredEquipment({definitions:definition.items,equipment:readNativeEquipment({player:character}).player,
        state:expansionState,wearByKey:Object.fromEntries(Object.values(character.getEquipment()).filter(Boolean).map(item=>[item.getInventoryKey(),durability.factor(item,.15)])),body:{...expansionState.simulation?.people.player?.body,...currentNativeBody()},
        facts:Object.fromEntries(Object.entries(expansionState.actors.player.facts).map(([key,value])=>['actor.'+key,value])),
        weather:{raining:!sheltered&&getPacingEffects(homePacingContext()).raining,hot:!sheltered&&temperature>25,cold:!sheltered&&temperature<5,rainPenalty:.1,coldPenalty:.1}});
}
function currentNativeBody(){
    const body=expansionState.simulation?.people.player?.body;
    return {id:body?.id||'native.player.body',form:body?.form||character.getRace(),ownerId:body?.ownerId||'player',controllerId:body?.controllerId||'player',hands:body?.hands??2,mobile:body?.mobile??true};
}
const causalNative=createCausalStoryNativeBindings({NPC,NPCRegistry,Quest,QuestTask,quests,activeQuests:active_quests,availabilities,locations,getItemFromKey,
    getNativeBody:currentNativeBody,getNativeContext:get_context,getCurrentLocation:()=>current_location?.id||null,getNativeFighters:()=>({player:readNativeFighter(character)})});
causalNative.register();
for(const id of causalStoryPersonIds)gameplayBindings[id]={category:"person",id};
function refreshCausalQuests(){
    if(!expansionState.causalStories)return;
    for(const proof of CAUSAL_STORY_PROOFS){const id=causalStoryId(proof,'quest');if(active_quests[id]||quests[id].isFinished()){
        if(!document.querySelector(`[data-quest_id="${id}"]`))add_quest_to_display(id);else update_displayed_quest(id);
    }}
}

function refreshMolQuests(){
    if(!expansionState.motherOfLearning)return;
    for(const f of MOL_FOOTPRINTS){const id=f.native.questId;if(active_quests[id]||quests[id].isFinished()){
        if(!document.querySelector(`[data-quest_id="${id}"]`))add_quest_to_display(id);else update_displayed_quest(id);
    }}
}

function refreshParadiseQuests(){
    if(!expansionState.bookWorldCampaign)return;
    for(const f of PARADISE_FOOTPRINTS){const id=f.native.questId;if(active_quests[id]||quests[id].isFinished()){
        if(!document.querySelector(`[data-quest_id="${id}"]`))add_quest_to_display(id);else update_displayed_quest(id);
    }}
}

function refreshNestedQuests(){
    if(!expansionState.nestedCampaign)return;
    for(const id of [NESTED_IDS.hubQuest,NESTED_IDS.saltQuest,NESTED_IDS.archiveQuest])if(active_quests[id]||quests[id].isFinished()){
        if(!document.querySelector(`[data-quest_id="${id}"]`))add_quest_to_display(id);else update_displayed_quest(id);
    }
}

function refreshTidemarkQuest(){
    if(!expansionState.featureDestination||(!active_quests[TIDEMARK_IDS.quest]&&!quests[TIDEMARK_IDS.quest].isFinished()))return;
    if(!document.querySelector(`[data-quest_id="${TIDEMARK_IDS.quest}"]`))add_quest_to_display(TIDEMARK_IDS.quest);
    else update_displayed_quest(TIDEMARK_IDS.quest);
}

let nativeBattlePauseReason="";
let chroniclePauseReason = "";

function renderWorldIdentity() {
    const note = document.getElementById("world_identity_note");
    if(!note) return;
    const known = worldIdentityView(expansionState, expeditionRegistry);
    note.hidden = !known.label;
    if(note.textContent !== known.label) note.textContent = known.label;
    if(note.title !== known.description) note.title = known.description;
}
// One writer owns the entire envelope, including legacy autosave. Import probes
// never acquire a lock or write. A second tab remains a read-only preview.
let ownsSave = !!importProbeToken;
async function acquireSaveOwnership() {return importProbeToken ? true : new Promise(resolve => {
    if(!navigator.locks) {resolve(false); return;}
    navigator.locks.request(`yairpg-save:${is_on_dev() ? dev_save_key : save_key}`, {ifAvailable: true}, lock => {
        resolve(!!lock);
        if(lock) return new Promise(() => {}); // Released by the browser when this document closes.
    }).catch(() => resolve(false));
});}

const nativeGameplay = createNativeGameplayAdapter({player:character,getPerson:id=>NPCRegistry.get(id),skills,getContext:get_context,bindings:gameplayBindings});
function gameplaySnapshot() {return nativeGameplay.snapshot(expansionState);}

let furniturePanel;
let localLife=normalizeLocalLife(),localLifePanel;
let fortSupply=createFortSupply(),fortControls;
let pacingMinute=null,pacingPanel,pacingStatusPanel;
let durabilityPanel;
let elementalPanel;
function changeElementalPreparation(enabled) {
    if(!ownsSave||foundationSaveBlocked||importProbeToken||restoringNativeSave)throw Error('Elemental settings require the writable game tab.');
    const state=structuredClone(expansionState);state.sequence++;
    persistExpansion({state,external:{money:character.money},gameplay:gameplaySnapshot(),nativePatch:{'options/elemental_affinities':enabled},
        absorbPublish:()=>{game_options.elemental_affinities=enabled;}});elementalPanel?.render();
}
function createElementalPanel() {
    const option=document.createElement('label'),input=document.createElement('input');input.type='checkbox';input.dataset.elementalOption='true';
    option.append(input,document.createTextNode('Elemental preparation (off by default)'));document.getElementById('options_choices').append(option);
    const panel=document.createElement('details');panel.id='elemental_panel';panel.className='expedition_panel';
    const title=document.createElement('summary');title.textContent='Elemental preparation';const body=document.createElement('div'),notice=document.createElement('p');panel.append(title,body,notice);
    input.onchange=()=>{try{changeElementalPreparation(input.checked);}catch(error){notice.textContent=error.message;render();}};
    let signature='';
    function render(){const host=document.getElementById('location_actions_div');if(panel.parentElement!==host)host.append(panel);input.checked=game_options.elemental_affinities;
        const current=current_combat?.defenders||[],known=Object.keys(enemy_killcount).filter(id=>enemy_killcount[id]>0).map(id=>enemy_templates[id]).filter(Boolean);
        const view=describeElementalPreparation({enabled:game_options.elemental_affinities,equipment:character.getEquipment(),encounteredEnemies:[...current,...known]});
        panel.hidden=!!current_dialogue;const next=JSON.stringify(view);if(next===signature)return;signature=next;body.replaceChildren();
        const text=document.createElement('p');text.textContent=view.text;body.append(text);for(const row of view.rows){const p=document.createElement('p');p.textContent=row.text;body.append(p);}
    }
    render();return {render};
}

function commitDurability(stage) {
    if(!ownsSave||foundationSaveBlocked||importProbeToken||restoringNativeSave||nativeOccupationReason())throw Error('Finish current work in the writable game tab before equipment maintenance.');
    const state=structuredClone(expansionState);state.sequence++;
    persistExpansion({state,external:stage.external||{money:character.money},gameplay:gameplaySnapshot(),equipment:stage.equipment,
        nativePatch:stage.nativePatch,absorbPublish:stage.publish});
    character._equipItem(null);character.updateStatsAndDisplay();update_displayed_equipment();update_displayed_character_inventory();
    if(current_combat){current_combat.resetCombatLoops(true);update_displayed_fighters_stats();}
    durabilityPanel?.render();elementalPanel?.render();
}
function createDurabilityPanel() {
    const host=document.getElementById('options_choices'),option=document.createElement('label'),input=document.createElement('input');
    input.type='checkbox';input.dataset.durabilityOption='true';option.append(input,document.createTextNode('Equipment durability (off by default)'));host.append(option);
    const panel=document.createElement('details');panel.id='durability_panel';panel.className='expedition_panel';
    const title=document.createElement('summary');title.textContent='Equipment condition and repair';const body=document.createElement('div'),notice=document.createElement('p');panel.append(title,body,notice);
    input.onchange=()=>{try{commitDurability(durability.stageToggle(character,input.checked,getItemFromKey,key=>assertNativeItemDisposition(expansionState,key)));}catch(error){notice.textContent=error.message;render();}};
    let signature='';
    function render(){const target=document.getElementById('location_actions_div');if(panel.parentElement!==target)target.append(panel);input.checked=durability.enabled;
        panel.hidden=!!current_dialogue;const rows=durability.rows(character),next=JSON.stringify([durability.enabled,rows,!!current_combat,!!nativeOccupationReason(),ownsSave&&!foundationSaveBlocked]);if(next===signature)return;signature=next;
        body.replaceChildren();const help=document.createElement('p');help.textContent=durability.enabled?'Landed hits wear weapon, armor and shield copies. Lower condition reduces their native damage or protection; gear remains owned. Repair costs at most5 coins.':'Durability is off. Existing condition is frozen and native gear power applies. Activate in Settings; untouched old stacks keep their keys.';body.append(help);
        for(const row of rows){const line=document.createElement('p');line.textContent=`${row.name}: ${row.condition.toFixed(2)}/100 · repair ${row.cost} coins `;
            const button=document.createElement('button');button.textContent='Repair';button.dataset.durabilityRepair=row.key;button.disabled=!row.cost||!row.affordable||!!current_combat||!!nativeOccupationReason();
            button.onclick=()=>{try{commitDurability(durability.stageRepair(character,row.key,key=>assertNativeItemDisposition(expansionState,key)));notice.textContent='Equipment repaired.';}catch(error){notice.textContent=error.message;}};line.append(button);body.append(line);}
    }
    render();return {render};
}

function homePacingContext(state=expansionState, location=current_location, calendar=current_game_time) {
    return {homeWorld:state.actors.player.worldId==='base.frontier'&&!Object.values(optionalPackState.packs).some(p=>p.active),
        outdoors:location?.is_under_roof===false,season:calendar.getSeason?calendar.getSeason():current_game_time.getSeason(),nativeRain:!!is_raining()};
}
function changeHomePacing(next) {
    if(!ownsSave||foundationSaveBlocked||importProbeToken||restoringNativeSave)throw Error('Pacing changes require the writable game tab.');
    const state=structuredClone(expansionState);state.sequence++;
    persistExpansion({state,external:{money:character.money},gameplay:gameplaySnapshot(),nativePatch:{pacing_e1:next},pacingNext:next,pacingTarget:calendarMinutes(current_game_time)});
    pacingPanel?.render();pacingStatusPanel?.render();durabilityPanel?.render();elementalPanel?.render();
}
function createPacingStatusPanel() {
    const panel=document.createElement('details');panel.id='pacing_status_panel';panel.className='expedition_panel';
    const title=document.createElement('summary');title.textContent='Optional pacing';const text=document.createElement('p');panel.append(title,text);
    const render=()=>{const host=document.getElementById('location_actions_div');if(panel.parentElement!==host)host.append(panel);
        panel.hidden=!!current_dialogue||!!current_combat;text.textContent=pacingStatus(getPacingState(),homePacingContext());};
    render();return {render};
}

function readFortFrame() {
    const stock=readInventoryOwner(character.getItems());
    return {fort:fortSupply,worldId:expansionState.actors.player.worldId,location:current_location?.id,
        fieldClears:Math.floor(locations['Infested field'].enemy_groups_killed/locations['Infested field'].enemy_count),
        yardClears:Math.floor(locations[FORT.yard].enemy_groups_killed/locations[FORT.yard].enemy_count),
        notesRead:book_stats[FORT.notes].accumulated_time>=4,money:character.money,
        stock:Object.fromEntries(['Rat tail','Iron ore','Iron ingot'].map(id=>[id,stock[item_templates[id].getInventoryKey()]||0])),
        knownItems:item_log.items,disabled:!ownsSave||foundationSaveBlocked||importProbeToken||!character.is_alive||!!nativeOccupationReason()||!!current_dialogue};
}
function actFort(action) {
    const frame=readFortFrame();
    const plan=stageFortAction({state:expansionState,gameplay:gameplaySnapshot(),money:character.money,itemLog:item_log.items,
        fort:fortSupply,action,context:{...frame,busy:frame.disabled,readOnly:!ownsSave||foundationSaveBlocked||importProbeToken,
        assertItemDisposition:key=>assertNativeItemDisposition(expansionState,key)},keyFor:id=>item_templates[id].getInventoryKey(),getItem:getItemFromKey});
    persistExpansion(plan);log_message(plan.message,action==='buy_notes'?'purchase':'notification');fortControls?.render();pacingPanel?.render();pacingStatusPanel?.render();durabilityPanel?.render();elementalPanel?.render();return plan;
}
function observeFortAcquisition(itemId,count,kind,sourceId,label) {
    if(restoringNativeSave||!(count>0)||!item_templates[itemId]||expansionState.actors.player.worldId!=='base.frontier')return;
    fortSupply=observeFortSource(fortSupply,{itemId,count,kind,sourceId:String(sourceId),label:String(label),at:expansionState.clock});
}

function localLifeContext(calendar=current_game_time, state=expansionState, location=current_location?.id) {
    return {worldId:state.actors.player.worldId, location,
        alive:character.is_alive===true&&state.chronicle?.life.endedAt==null,
        idle:!current_combat&&!current_activity&&!current_game_action&&!is_sleeping&&!is_reading&&!current_dialogue&&!is_in_trade()&&nativeActionReasons(state).length===0,
        clock:calendarMinutes(calendar),calendarMinute:calendarMinutes(calendar),
        perception:character.getTotalSkillLevel('Perception'),money:character.money,
        foodPoisonRemaining:active_effects['Slight food poisoning']?.duration||0};
}
function stageLocalLifeResult(plan, result) {
    plan.gameplay ||= gameplaySnapshot();
    plan.external ||= {money:character.money};
    plan.external.money+=result.native.money;
    const acquisitions=[];
    for(const row of result.native.items){const key=item_templates[row.item_id].getInventoryKey();
        applyGameplayEffect(plan.gameplay,{type:'item',key,amount:row.count},'player');acquisitions.push({owner:'player',key,count:row.count});}
    for(const [skill,amount] of Object.entries(result.native.skillXp))if(amount>0)
        applyGameplayEffect(plan.gameplay,{type:'xp',skill,amount:Math.round(amount*100)/100},'player');
    plan.acquisitions=[...(plan.acquisitions||[]),...acquisitions];
    plan.nativePatch={...plan.nativePatch,absorb_local_life:result.state};plan.localLifeResult=result;
    return plan;
}
function advanceSavedLocalLife(state,context) {
    return advanceLocalLife(localLife,context,()=>drawUnit(state,scopedStream(STREAMS.localLife,context.worldId),`local:${context.clock}`));
}
function dispatchLocalLifePlan(result, state = structuredClone(expansionState)) {
    if(!ownsSave||foundationSaveBlocked||importProbeToken||is_loading_error)throw Error('This tab cannot save local actions.');
    if(result.ok===false)throw Error(result.messages.join(' '));
    state.sequence++;
    persistExpansion(stageLocalLifeResult({state,external:{money:character.money},gameplay:gameplaySnapshot()},result));
    return result;
}

function readFurnitureInput() {
    return {state: expansionState, locationId: current_location?.id,
        housingAccessible: !!current_location?.housing?.isUnlocked(),
        nativeInventory: readInventoryOwner(character.getItems()),
        chestInventory: readInventoryOwner(player_storage.getItems()), bookStats: book_stats,
        context: expeditionContext()};
}
function readFurnitureBonuses() {return furnitureProjection(readFurnitureInput());}
function createFurniturePanel() {
    const panel=document.createElement('details');panel.id='furniture_panel';panel.className='expedition_panel';
    const summary=document.createElement('summary');summary.textContent='Furniture and home comforts';
    const body=document.createElement('div');panel.append(summary,body);
    document.getElementById('location_actions_div').append(panel);
    let signature='';
    const render=()=>{const host=document.getElementById('location_actions_div');if(panel.parentElement!==host)host.append(panel);const view=furniturePresentation(readFurnitureInput());panel.hidden=!view.visible||!!current_dialogue||!!current_combat;
        const next=JSON.stringify(view.sections.map(section=>section.records.map(r=>r.text)));if(next===signature)return;signature=next;
        body.replaceChildren();for(const section of view.sections)for(const record of section.records){const p=document.createElement('p');p.textContent=record.text;body.append(p);}};
    render();return {render};
}


function validateNativeGameplayReferences(definitions) {
    for(const definition of definitions) for(const effect of definition) {
        if(effect.type === "item" && !getItemFromKey(effect.key)) throw new Error("Unsupported expedition item.");
        if(effect.type === "xp" && !Object.hasOwn(skills, effect.skill)) throw new Error(`Unsupported expedition skill ${effect.skill}.`);
        if(effect.type === "technique" && effect.operation === "observe" && !Object.hasOwn(enemy_templates, effect.enemyId)) throw new Error("Unsupported technique enemy.");
        if(effect.type === "reputation" && !Object.hasOwn(character.reputation, effect.region)) throw new Error("Unsupported expedition reputation region.");
    }
}

function simulationNativeContexts() {
    const contexts=tidemarkSimulationContexts(expansionState,realmSimulationContexts(expansionState,nativeGameplay.contexts(expansionState,!!(current_activity || current_game_action || current_combat || current_dialogue || is_sleeping || is_reading || is_in_trade()))));
    const evidence=frontierNativeEvidence(),causalFrame=causalNative.read(expansionState);
    for(const id of Object.keys(expansionState.simulation?.people || {player:true})) contexts[id]={...contexts[id],nativeSkillLevels:evidence.nativeSkillLevels,nativeZoneCounts:evidence.nativeZoneCounts,destinationNative:tidemarkNative.read(expansionState),nestedNative:nestedNative.read(expansionState),paradiseNative:paradiseNative.read(expansionState),molNative:molNative.read(expansionState),proto23Native:proto23Native.read(expansionState),causalStoryNative:causalFrame,...nativeCampaignLocationOwners(),
        facts:{...contexts[id]?.facts,...evidence.facts,...(id==='player'?{location:current_location?.id,strength:character.getFullStats().strength,agility:character.getFullStats().agility}: {})}};
    for(const [id,ctx] of Object.entries(contexts))ctx.facts=featurePowerContext(expansionState,{...ctx,actorId:id,vitals:{[id]:ctx.vitals},equipment:{[id]:ctx.equipment}}).facts;
    Object.assign(contexts.player.facts,structuredEquipmentView().facts);
    Object.assign(contexts.player.facts,techniqueFacts(expansionState.actors.player,expeditionRegistry,contexts.player));
    const gameplay=gameplaySnapshot(),vitals=Object.fromEntries(Object.entries(contexts).map(([id,c])=>[id,c.vitals]));
    for(const [id,c] of Object.entries(contexts))Object.assign(c,{managementPlayerLocation:current_location?.id,managementPlayerAlive:character.is_alive===true,actorId:id,worldId:expansionState.actors[id].worldId,nativeBody:id==='player'?currentNativeBody():null,nativeCareFrame:nativeCareFrame(),gameplay,vitalsByActor:vitals,nativeAlive:character.is_alive===true,nativeReady:!active_effects.Recovering,inventoryOwners:structuredInventoryOwners(),structuredNative:optionalPackState.structured?{...optionalPackState.structured,bound:true}:null,remainderLivelihoodClock:{calendarMinute:calendarMinutes(current_game_time),clock:expansionState.clock},facts:{...c.facts,...(id==="player"?{"skill.Crafting":character.getTotalSkillLevel("Crafting")}:{}),"weather.raining":getPacingEffects(homePacingContext()).raining,...(id==='player'?{"village.shackUnlocked":!!locations.Shack.getAvailabilityComponent().getStatus().is_unlocked,"village.craftsmanMet":metVillageElder()&&expeditionContext().facts["village.craftsmanMet"],"village.craftsmanPresent":expansionState.simulation?.people.oldCraftsman?.life==='alive'&&expansionState.simulation.people.oldCraftsman.location==='Village'}:{})}});
    const joined=nestedChainSimulationContexts(expansionState,nestedSimulationContexts(expansionState,contexts));
    for(const [id,c] of Object.entries(joined))joined[id]=nestedLifeContext(expansionState,c);
    return proto23SimulationContexts(expansionState,worldCompletionSimulationContexts(expansionState,lorePracticeSimulationContexts(expansionState,causalStorySimulationContexts(expansionState,auditRemainderSimulationContexts(expansionState,molSimulationContexts(expansionState,paradiseSimulationContexts(expansionState,joined)))))));
}

function frontierNativeEvidence(){
    const nativeSkillLevels=Object.fromEntries(Object.keys(skills).map(id=>[id,character.getLevelableComponent().skill_progress[id]?.current_level || 0]));
    const nativeZoneCounts=Object.fromEntries(Object.entries(locations).filter(([,l])=>l.tags.combat_zone).map(([id,l])=>[id,l.enemy_groups_killed || 0]));
    const facts={'originalFrontier.townAccessible':!!locations['Town square'].canBeStarted(get_context())};
    for(const id of ['Forest road','Nearby cave','Cave room','Forest','Infested field','Shack','Town outskirts']) facts[`native.zone.${id}.accessible`]=!!locations[id]?.canBeStarted(get_context());
    return {nativeSkillLevels,nativeZoneCounts,facts};
}

function projectNativePeopleBodies() {
    for(const [id,p] of Object.entries(expansionState.simulation?.people || {})) if(id !== "player" && p.inventory === "native" && p.vitals) {
        const stats = NPCRegistry.get(id).getFullStats();
        stats.health = Math.max(0, Math.min(stats.max_health, p.vitals.health));
        stats.stamina = Math.max(0, Math.min(stats.max_stamina, p.vitals.stamina));
    }
}
function expeditionContext() {
    const gameplay = gameplaySnapshot();
    const evidence=frontierNativeEvidence();
    return originalFrontierContext(expansionState,expeditionRegistry,skillExpansionContext(expansionState,{nativeBody:currentNativeBody(),nativeAlive:character.is_alive===true,nativeCareFrame:nativeCareFrame(),equipment:readNativeEquipment({player:character}),actorId: "player", worldId: expansionState.actors.player.worldId, external: {money: character.money}, gameplay,...evidence,
        facts: {...evidence.facts,...chronicleFacts(expansionState.chronicle), location: current_location?.id, strength: character.getFullStats().strength, agility: character.getFullStats().agility,
            ...everydayFacts(expansionState, {hour: current_game_time.hour}),
            ...bodyFacts(expansionState),
            "day.hour": current_game_time.hour,
            "weather.raining": getPacingEffects(homePacingContext()).raining, "weather.damp": rain_counter > 0,
            "village.circleOpen": current_game_time.hour >= 8 && current_game_time.hour < 10,
            "village.briefingActive": (expansionState.actors.player.sources["village.morning_signs"]?.expiresAt ?? 0) > expansionState.clock,
            calendarMinute: calendarMinutes(current_game_time), perception: character.getTotalSkillLevel("Perception"),
            'skill.Crafting': character.getTotalSkillLevel('Crafting'),
            "village.elderMet": metVillageElder(),
            "village.craftsmanMet": (() => {const status = dialogues["old craftsman"].textlines.hello.getAvailabilityComponent().getStatus(); return !!(status.is_locked || status.is_finished);})(),
            "village.shackUnlocked": !!locations.Shack.getAvailabilityComponent().getStatus().is_unlocked,
            "village.notesRead": item_templates[ROUTE_NOTES].isFinished(),
            "village.notesHeld": !!gameplay.player.inventory[NOTES_KEY],
            climbing: skills.Climbing ? character.getTotalSkillLevel("Climbing") : 0,
            kits: gameplay.player.inventory[SURVEY_KIT_KEY] || 0, rope: gameplay.player.inventory[SURVEY_ROPE_KEY] || 0}}));
}

function persistExpansion(plan, ownershipBindings = {}, itemsByOwner = {}) {
    // Non-person pack inventories are native registry owners. Their contents
    // publish through the existing ownership transaction after durable saving.
    for(const [id,counts] of Object.entries(plan.ownership||{})) {
        const definition=expeditionRegistry.simulation.containers?.get(id);
        if(!definition)continue;
        const live=inventories[definition.category]?.[id];
        if(!live||plan.state.simulation?.containers?.[id]?.holder!==definition.holder)throw Error('Restore the actual inventory owner before continuing.');
        ownershipBindings={...ownershipBindings,[id]:{category:definition.category,id}};
        itemsByOwner={...itemsByOwner,[id]:live.getItems()};
    }
    const pacingTarget=calendarMinutes(plan.calendar||current_game_time);
    if(!restoringNativeSave&&pacingMinute!=null&&!plan.pacingNext&&pacingTarget>pacingMinute){
        plan.pacingNext=advancePacing(getPacingState(),pacingTarget-pacingMinute,homePacingContext());
        plan.pacingTarget=pacingTarget;plan.nativePatch={...plan.nativePatch,pacing_e1:plan.pacingNext};
    }
    const localFrame=localLifeContext(plan.calendar||current_game_time,plan.state,plan.nativeLocation||current_location?.id);
    if(!restoringNativeSave&&!plan.localLifeResult&&localFrame.clock>(localLife.lastClock??localFrame.clock))
        stageLocalLifeResult(plan,advanceSavedLocalLife(plan.state,localFrame));
    // Played-time settlements may retain their original job sequence. Opted-in
    // characters give this committed boundary a fresh nonce before recognition.
    if(plan.state.referenceGameplay && expansionState.referenceGameplay && plan.state.sequence===expansionState.sequence && plan.state.clock>expansionState.clock)plan.state.sequence++;
    if(plan.state.auditRemainder||plan.state.causalStories||plan.state.motherOfLearning||plan.state.proto23Village)plan.state.schema=11;
    else if(plan.state.bookWorldCampaign)plan.state.schema=10;
    else if(plan.state.referenceGameplay)plan.state.schema=9;
    if(plan.state.causalStories){const current=gameplaySnapshot();plan.gameplay={...current,...plan.gameplay};}
    if(plan.state.causalStories&&plan.nativeLocation)plan.state.simulation.people.player.location=plan.nativeLocation;
    const causalContexts=simulationNativeContexts();
    if(plan.state.causalStories){
        const currentVitals=Object.fromEntries(Object.entries(causalContexts).filter(([,c])=>c.vitals).map(([id,c])=>[id,c.vitals]));
        plan.vitals={...currentVitals,...plan.vitals};
        plan.equipment={...Object.fromEntries(Object.entries(causalContexts).filter(([,c])=>c.equipment).map(([id,c])=>[id,c.equipment])),...plan.equipment};
        if(plan.native)for(const [key,offset] of [['health','hpToFull'],['stamina','staminaToFull']])if(plan.native[offset]!=null)plan.vitals.player[key]=Math.max(0,plan.vitals.player[`max_${key}`]-plan.native[offset]);
        for(const [id,c] of Object.entries(causalContexts)){c.vitals=plan.vitals[id]||c.vitals;c.vitalsByActor=plan.vitals;c.equipment=plan.equipment[id]||c.equipment;}
    }

    if(plan.nativeLocation)causalContexts.player.facts={...causalContexts.player.facts,location:plan.nativeLocation};
    reconcileCausalStoryPlan(expansionState,plan,expeditionRegistry,causalContexts);
    advanceReferenceGameplay(expansionState,plan,expeditionRegistry,featureWaveContext());
    advanceAuditRemainder(expansionState,plan,expeditionRegistry,featureWaveContext());
    reconcileBookCareRuntime(expansionState,plan,expeditionRegistry);
    reconcileParadiseCampaignDepthRuntime(expansionState,plan,expeditionRegistry);
    reconcileLorePractice(expansionState,plan,expeditionRegistry,causalContexts);
    validateAuditRemainderNative(plan.state,plan.gameplay || gameplaySnapshot());
    validateGameAbsorptionAssay(plan.state,expeditionRegistry,{...plan,gameplay:plan.gameplay || gameplaySnapshot()});
    retainNestedCarrierReceipt(plan);
    retainParadiseCarrierReceipt(plan);
    assertBacklogPublication(expansionState,plan);
    assertQualifiedOfficePlan(expansionState,plan,{id:plan.backlogCommand},backlogContext());
    if(plan.state.auditRemainder||plan.state.causalStories||plan.state.motherOfLearning||plan.state.proto23Village)plan.state.schema=11;
    else if(plan.state.bookWorldCampaign)plan.state.schema=10;
    else if(plan.state.referenceGameplay)plan.state.schema=9;
    else if(plan.state.nestedCampaign)plan.state.schema=plan.state.actors.player.facts['nested.personal.version']===1||plan.state.actors.player.facts['nested.life.version']===1?8:7;
    else if(plan.state.featureDestination || plan.state.backlog || plan.state.inkNarrative || plan.state.simulation?.workPlans)plan.state.schema=6;
    plan = {...plan, state: recordRouteReading(plan.state, item_templates[ROUTE_NOTES].isFinished())};
    syncRealmClock(plan.state);
    syncTidemarkClock(plan.state);
    syncNestedCampaignClock(plan.state);
    syncParadiseClock(plan.state);
    syncMolClock(plan.state);
    syncProto23Clock(plan.state);
    validateRelayState(plan.state,expeditionRegistry,plan);
    validateFeatureObjectState(plan.state,expeditionRegistry,plan);
    reconcileStatusCareNative(expansionState,plan,expeditionContext());
    reconcileFieldCareNative(expansionState,plan,expeditionContext());
    stageContextualBalmEffectRequest(expansionState,plan,expeditionContext());
    reconcileWorldCompletionPlan(plan,expeditionRegistry,{player:{...expeditionContext(),external:plan.external,gameplay:plan.gameplay,vitals:plan.vitals||expeditionContext().vitals,equipment:plan.equipment||expeditionContext().equipment}});
    const previousNight = is_night(current_game_time);
    if(!ownsSave || importProbeToken || expansionError || foundationSaveBlocked || is_loading_error) throw new Error(expansionError || "This tab cannot commit expeditions.");
    for(const actor of Object.values(plan.state.actors)) {
        const active = activePractice(actor);
        if(active && !Object.hasOwn(skills, active[1].practice.xpSkill)) throw new Error("Unsupported saved practice skill.");
    }
    const stagedGameplay = nativeGameplay.stageBindings(plan.gameplay,plan.state);
    const actorBindings = stagedGameplay.actors;
    const unlockAdapter = unlocks => [
        ...(unlocks.skills || []).map(id => ({kind: "skill", id})),
        ...(unlocks.recipes || []).map(r => ({kind: "recipe", id: recipes[r.category]?.[r.subcategory]?.[r.recipe_id]?.id})),
        ...(unlocks.quests || []).map(id => ({kind: "quest", id}))];
    const publication = prepareGameplayPublication(plan.gameplay, {actors: actorBindings, skills, getItemFromKey, unlockAdapter});
    const townAccess = townUnlocks(expansionState, plan.state);
    const unlockPublication = prepareNativeUnlocks([...(plan.unlocks || []), ...publication.unlocks, ...townAccess], {availabilities, flags: global_flags, quests, questManager});
    const wearState=plan.nativePatch?.equipment_durability||durability.serialize();
    const structuredWear=optionalPackState.structured&&plan.equipment&&wearState.enabled?createDurability(wearState):null;
    const equipmentPublication = prepareNativeEquipment(nativeEquipmentSnapshot(plan.equipment, plan.state.simulation?.people), {actors: actorBindings, getItem:key=>{
        const item=getItemFromKey(key);
        return structuredWear&&item.tags.structuredEquipment?structuredWear.prepareEquip(item,getItemFromKey):item;
    }});
    if(structuredWear) {
        plan.nativePatch={...plan.nativePatch,equipment_durability:structuredWear.serialize()};
        const previousPublish=plan.absorbPublish;
        plan.absorbPublish=()=>{previousPublish?.();durability.load(structuredWear.serialize());};
    }
    const ownershipPublication = plan.ownership && prepareOwnershipPublication(plan.ownership, {itemsByOwner, getItem: getItemFromKey});
    plan.itemLog ??= recordAcquisitions(item_log.items, (plan.acquisitions || []).filter(e => e.owner === "player"), getItemFromKey);
    // Check pending native rewards before accepting reserved costs, not only at
    // completion. Unsupported milestone unlocks reject this command safely.
    if(plan.commitment) {
        const nativeContexts = simulationNativeContexts();
        nativeContexts.player.facts = expeditionContext().facts;
        for(const [id,c] of Object.entries(nativeContexts)){c.vitals=plan.vitals?.[id]||c.vitals;}
        const stagedVitals=Object.fromEntries(Object.entries(nativeContexts).filter(([,c])=>c.vitals).map(([id,c])=>[id,c.vitals]));
        for(const c of Object.values(nativeContexts))c.vitalsByActor=stagedVitals;
        const future = advanceSimulation(plan.state, expeditionRegistry, Math.max(0, plan.commitment.due - plan.state.clock),
            plan.external, plan.gameplay, nativeContexts);
        prepareGameplayPublication(future.gameplay, {actors: actorBindings, skills, getItemFromKey, unlockAdapter});
    }
    const practice = activePractice(plan.state.actors.player);
    if(practice) {
        const future = structuredClone(plan.gameplay), p = practice[1].practice;
        applyGameplayEffect(future, {type: "xp", skill: p.xpSkill, amount: Math.max(...p.rewards) * p.xpPerPoint}, "player");
        prepareGameplayPublication(future, {actors: actorBindings, skills, getItemFromKey, unlockAdapter});
    }
    const nativePublications=[tidemarkNative.stage(plan),nestedNative.stage(plan),paradiseNative.stage(plan),molNative.stage(plan),proto23Native.stage(plan),causalNative.stage(plan),prepareContextualBalmNative(expansionState,plan,{activeEffects:active_effects,itemTemplates:item_templates,effectTemplates:effect_templates,ActiveEffect,refresh:()=>{update_displayed_effects();character.addActiveEffectBonus(active_effects);character.updateStatsAndDisplay();}})];
    const nativePublication={write:envelope=>nativePublications.forEach(p=>p.write(envelope)),publish:()=>nativePublications.forEach(p=>p.publish())};
    try {persistExpansionPlan(plan, {createSave: create_save, storage: lifeSaveStorage, bindings: stagedGameplay.bindings, ownershipBindings, unlockPublication, equipmentPublication, nativePublication,
        validateEnvelope: data => validateSaveEnvelope(data, game_version), key: is_on_dev() ? dev_save_key : save_key});}
    catch(error) {
        lifeStorageFailure = error.code === 'SAVE_STORAGE_FULL';
        expansionError = lifeStorageFailure ? error.message : "Progress paused because saving failed. Free storage and reload before continuing.";
        foundationSaveBlocked = true;
        if(current_combat) end_combat();
        throw error;
    }
    if(plan.reloadRequired) {foundationSaveBlocked = true; window.location.reload(); return;}
    // Every owned domain is durable before native state is published. Rendering
    // happens afterward and never applies rewards.
    expansionState = plan.state;
    if(plan.pacingNext){setPacingState(plan.pacingNext);pacingMinute=plan.pacingTarget;pacingPanel?.render();pacingStatusPanel?.render();durabilityPanel?.render();elementalPanel?.render();}
    if(plan.nativePatch?.fort_supply)fortSupply=migrateFortSupply({fort_supply:plan.nativePatch.fort_supply});
    if(plan.localLifeResult){localLife=normalizeLocalLife(plan.localLifeResult.state);for(const message of plan.localLifeResult.messages)log_message(message,'notification');}
    character.money = plan.external.money;
    if(plan.calendar) current_game_time.loadTime(plan.calendar);

    if(plan.effectDurations) {
        let expired = false;
        for(const [id, duration] of Object.entries(plan.effectDurations)) {
            if(duration === 0) {delete active_effects[id]; expired = true;} else active_effects[id].duration = duration;
        }
        if(expired) {character.addActiveEffectBonus(active_effects); character.updateStatsAndDisplay();}
    }
    if(expansionState.chronicle?.life.endedAt != null) character.is_alive = false;
    if(plan.absorbPublish)plan.absorbPublish();
    publication.publish();
    unlockPublication.publish();
    equipmentPublication.publish();
    publishNativeVitals(plan.native,character);
    projectNativePeopleBodies();
    ownershipPublication?.publish();
    nativePublication.publish();
    if(plan.statusCareNative?.resetRain)rain_counter=0;
    refreshStatusCareStats();
    refreshTidemarkQuest();
    refreshNestedQuests();
    refreshParadiseQuests();
    refreshMolQuests();
    refreshCausalQuests();
    if(plan.nativeLocation)change_location({location_id:plan.nativeLocation,skip_travel_time:true,do_quest_events:plan.nativeEnterQuest===true,realm_move:true});
    if(plan.market) set_loot_sold_count(plan.market);
    item_log.items = plan.itemLog;
    for(const {id, target} of publication.dependencies) {
        which_skills_affect_skill[target] ||= [];
        if(!which_skills_affect_skill[target].includes(id)) which_skills_affect_skill[target].push(id);
    }
    try {
        update_displayed_money();
        if(plan.calendar) update_displayed_time();
        if(plan.native) {update_displayed_stamina(); update_displayed_health();}
        update_displayed_character_inventory();
        if(is_storage_open()) {
            update_displayed_storage_inventory();
            stampStorageRequests();
        }
        update_displayed_item_log();
        for(const id of publication.changes) {
            if(skills[id].visibility_treshold <= skills[id].getTotalXP()) {
                create_new_skill_bar(skills[id]);
                update_displayed_skill_bar(skills[id], true);
            }
        }
        if(publication.changes.length) character.updateStatsAndDisplay();
        if(plan.calendar && previousNight !== is_night(current_game_time)) character.updateStatsAndDisplay();
        if(townAccess.length && current_location.tags.safe_zone) update_displayed_normal_location(current_location);
        renderWorldIdentity();
        expeditionPanel?.render(); techniquePanel?.render(); chroniclePanel?.render(); villagePanel?.render(); simulationPanel?.render(); townPanel?.render();
        pursuitPanel?.render();
        bodyPanel?.render();
        fieldPanel?.render(); promisePanel?.render(); crushSocialPanel?.render(); managementPanel?.render();
        frontierCampaignPanel?.render();
        partyPanel?.render(); exchangePanel?.render(); observationPanel?.render(); pocketRealmPanel?.render();skillExpansionPanel?.render();originalFrontierPanel?.render();featureExpansionPanel?.render();foundationInteractionPanel?.render();causalStoryPanel?.render();
        backlogPanel?.render();replacementRecognitionPanel?.render();backlogOpeningPanel?.render();repositoryPanel?.render();inkPanel?.render();nestedInkPanels?.render();
        knownRoutesPanel?.render();adventureNotebook?.render();localLifePanel?.render();fortControls?.render();pacingPanel?.render();pacingStatusPanel?.render();durabilityPanel?.render();elementalPanel?.render();
        expansionQuests?.render();
        characterBio?.render();
        worldEventFeed?.render();
    } catch(error) {console.error("Saved expedition display could not refresh; reload to restore it.", error);}
}

function commitNativeTrade(quote, currentQuote) {
    if(simulationOccupiesActor(expansionState) || waitingSimulationChoice(expansionState)) throw new Error("Finish your living-world work or decision before trading.");
    if(expansionState.pending.some(job => job.context.actorId === "player") || activePractice(expansionState.actors.player)) throw new Error("Finish your expedition or technique drill before trading.");
    for(const item of quote.sell) assertNativeItemDisposition(expansionState,item.item_key);
    const vendor = NPCRegistry.get(quote.vendorId).getTraderInventory();
    // Preserve the native uncapped Haggling award and its current XP bonuses.
    const skill = skills.Haggling;
    const xp = skill.canGainXP(get_context()) ? Math.round((quote.buyValue + quote.sellValue) / 10 *
        config.global_xp_multiplier * character.getSkillXPGain("Haggling") * (character.xp_multiplier ?? 1) * 100) / 100 : 0;
    const plan = stageNativeTrade({state: expansionState, gameplay: gameplaySnapshot(),
        owners: {player: readInventoryOwner(character.getItems()), vendor: readInventoryOwner(vendor)},
        money: character.money, market: loot_sold_count, itemLog: item_log.items, quote, currentQuote, xp, getItem: getItemFromKey});
    persistExpansion(plan, {vendor: {category: "trader", id: quote.vendorId}}, {vendor});
}

function stampStorageRequests() {
    for(const [target, items] of [["character", character.getItems()], ["storage", player_storage.getItems()]]) {
        for(const node of document.querySelectorAll(`[data-${target}_item]`)) {
            node.setAttribute("data-storage-sequence", expansionState.sequence);
            node.setAttribute("data-item_count", items[node.getAttribute(`data-${target}_item`)]?.count || 0);
        }
    }
}

function commitNativeStorage(request) {
    try {
        if(!is_storage_open() || !current_location?.housing?.isUnlocked()) throw new Error("Open an accessible chest first.");
        const plan = stageNativeStorageTransfer({state: expansionState, gameplay: gameplaySnapshot(), money: character.money,
            owners: {player: readInventoryOwner(character.getItems()), chest: readInventoryOwner(player_storage.getItems())},
            equipment: readNativeEquipment({player: character}), request});
        persistExpansion(plan, {chest: {category: "storage", id: "player"}}, {chest: player_storage.getItems()});
        return true;
    } catch(error) {
        log_message(expansionError || error.message, "notification");
        return false;
    }
}
bind_storage_transfer(commitNativeStorage);

function startExpedition(actionId, sequence) {
    if(expansionState.chronicle?.session || expansionState.chronicle?.life.endedAt != null || current_activity || current_game_action || current_combat || is_sleeping || is_reading || is_in_trade()) {
        throw new Error("Finish your current activity, combat, trade or rest before beginning an expedition.");
    }
    persistExpansion(commitAction(expansionState, expeditionRegistry, actionId, expeditionContext(), sequence));
}

function cancelExpedition(jobId, sequence) {
    const practice = activePractice(expansionState.actors.player);
    if(practice?.[1].practice.id === jobId) {
        persistExpansion({state: cancelTechniquePractice(expansionState, "player", jobId, sequence),
            external: {money: character.money}, gameplay: gameplaySnapshot()});
        return;
    }
    persistExpansion(cancelAction(expansionState, expeditionRegistry, jobId, expeditionContext(), sequence));
}

function answerPractice(practiceId, response, sequence) {
    const result = answerTechniquePractice(expansionState, "player", practiceId, response, sequence);
    const gameplay = gameplaySnapshot();
    if(result.reward) applyGameplayEffect(gameplay, result.reward, "player");
    validateExpansionState(result.state, expeditionRegistry);
    persistExpansion({state: result.state, external: {money: character.money}, gameplay});
    return {correct: result.correct};
}

function usesJoinedClock() {return !!expansionState.chronicle || !!expansionState.simulation || usesVillageClock(expansionState) || usesTownClock(expansionState);}

function structuredInventoryOwners() {
    return Object.fromEntries([...expeditionRegistry.simulation.containers.values()].map(c=>[c.id,readInventoryOwner(inventories[c.category]?.[c.id]?.getItems()||{})]));
}
function structuredContext() {
    const contexts=simulationNativeContexts();
    return {...contexts.player,registry:expeditionRegistry,actorId:'player',worldId:expansionState.actors.player.worldId,
        nativeBody:{...currentNativeBody(),form:character.getRace(),lifeStage:character.getBioComponent().age},inventoryOwners:structuredInventoryOwners(),equipment:readNativeEquipment({player:character}),external:{money:character.money},gameplay:gameplaySnapshot(),vitals:Object.fromEntries(Object.entries(contexts).map(([id,c])=>[id,c.vitals])),
        nativeReady:!active_effects.Recovering,
        structuredNative: optionalPackState.structured?{...optionalPackState.structured,bound:true}:null,
        facts:{...contexts.player.facts,location:current_location?.id,'skill.Crafting':character.getTotalSkillLevel('Crafting')},busy:!!current_activity||!!current_game_action||!!current_combat||!!current_dialogue||is_sleeping||is_reading||is_in_trade()};
}
function readStructuredCampaign() {
    const record=optionalPackState.structured,d=record?structuredPacks.get(record.packId):optionalPackState.pendingStructured?structuredPacks.get(optionalPackState.pendingStructured.packId):initialStructuredDefinition();
    const canWrite=ownsSave&&!foundationSaveBlocked&&!expansionError&&!importProbeToken;
    if(!d)return {available:false,active:false,canWrite:false};
    const context=structuredContext();
    const view=structuredCampaignView(expansionState,d,record,context);
    if(optionalPackState.pendingStructured){requireStructuredSelection(optionalPackState.pendingStructured,structuredPacks);view.beginLabel='Continue beginning';}
    if(record&&d.renewal)view.renewal=previewStructuredRenewal(expansionState,d,context);
    return {...view,pauseReason:feedbackClockPauseReason(),canWrite:canWrite&&(record||current_location?.id==='Village'&&!nativeOccupationReason()&&!context.busy),error:structuredNotice};
}
function commandStructuredCampaign(command) {
    try {
        if(!ownsSave||foundationSaveBlocked||expansionError||importProbeToken)throw Error('Restore saving before continuing.');
        const record=optionalPackState.structured,d=record?structuredPacks.get(record.packId):optionalPackState.pendingStructured?structuredPacks.get(optionalPackState.pendingStructured.packId):initialStructuredDefinition(),context=structuredContext();
        if(!d)throw Error('This beginning content is unavailable.');
        if(optionalPackState.pendingStructured&&command.type!=='begin')throw Error('Finish your saved beginning first.');
        let plan,next;
        if(command.type==='begin') {
            if(current_location?.id!=='Village'||nativeOccupationReason())throw Error('Begin from an unoccupied native opening.');
            if(d.starts&&!optionalPackState.pendingStructured){
                const selected=planStructuredSelection(expansionState,d,context);
                const reserved=packSaveState({...optionalPackState,pendingStructured:selected.selection},packDefinitionsForSave());
                selected.plan.nativePatch={content_packs:reserved};
                persistExpansion(selected.plan);optionalPackState=reserved;
            }
            const result=beginStructuredCampaign(expansionState,d,structuredContext(),record,optionalPackState.pendingStructured);plan=result.plan;
            const initialized={...optionalPackState,structured:result.record};delete initialized.pendingStructured;
            next=packSaveState(initialized,packDefinitionsForSave());
            plan.nativePatch={...plan.nativePatch,content_packs:next};
        } else {
            requireStructuredContent(record,structuredPacks);
            if(command.type==='renewal'){
                plan=commitStructuredRenewal(expansionState,d,context,expansionState.sequence);
            } else if(command.type==='action') {
                const a=d.simulation.commands.find(a=>a.id===command.id);if(!a)throw Error('This action is unavailable.');
                plan=commitSimulationCommand(expansionState,expeditionRegistry,{id:a.id},{...context,targetId:a.targetId},expansionState.sequence);
            } else if(command.type==='cancel') {
                if(!expansionState.simulation.jobs.some(j=>j.id===command.jobId&&j.commandId.startsWith(d.id+'.')&&j.actorId==='player'))throw Error('This work is no longer pending.');
                plan=cancelSimulationJob(expansionState,expeditionRegistry,command.jobId,context,expansionState.sequence);
            } else throw Error('Unsupported local action.');
        }
        persistExpansion(plan);if(next)optionalPackState=next;structuredNotice='';structuredPanel?.render(true);
    }catch(error){structuredNotice=error.message;throw error;}
}

// C4 authored site: registration follows the saved draft; Apply/Reset persist
// immediately and roll back registration if the save cannot be written.
const authoredSiteOwners=()=>({registry:expeditionRegistry,locations,definitions:optionalPacks,
    makeLocation:l=>new OptionalPackLocation({id:l.id,name:l.label,description:l.description,connected_locations:[],is_under_roof:true})});
function syncAuthoredSite(draft){return syncAuthoredRegistration(draft,authoredSiteOwners());}
function commandAuthoredSite(kind,draft) {
    if(!ownsSave||foundationSaveBlocked||importProbeToken||lifeStorageFailure)throw Error('Restore saving before authoring.');
    const previous=optionalPackState,next=kind==='apply'?applyAuthoredState(previous,draft):resetAuthoredState(previous);
    syncAuthoredSite(next.authored?.draft??null);
    let save;
    try {
        optionalPackState=next;save=JSON.parse(create_save());
        if(kind==='reset'&&save.expansion?.worlds)delete save.expansion.worlds[AUTHORED_WORLD_ID];
        validateSaveEnvelope(save,game_version);
        lifeSaveStorage.setItem(is_on_dev()?dev_save_key:save_key,JSON.stringify(save));
    }catch(error){optionalPackState=previous;syncAuthoredSite(previous.authored?.draft??null);throw error;}
    expansionState=save.expansion;optionalPackPanel?.render(true);
}
function commandOptionalPack(id,action) {
    if(optionalPackState.pendingStructured||optionalPackState.structured)throw Error('Continue through your local routes.');
    const d=optionalPacks.get(id);if(!d||!ownsSave||foundationSaveBlocked||importProbeToken)throw Error('Optional content cannot be saved in this tab.');
    if(action==='enter'&&(current_location?.id!=='Village'||nativeOccupationReason()||current_activity||current_game_action||current_combat||current_dialogue||is_sleeping||is_reading||is_in_trade()))throw Error('Finish your Village activity before departing.');
    const next=action==='enter'?enterPack(optionalPackState,d):action==='return'?leavePack(optionalPackState,id):action==='cancel'?cancelPack(optionalPackState,d):actPack(optionalPackState,d,action);
    const save=JSON.parse(create_save());save.content_packs=packSaveState(next,optionalPacks);
    const target=action==='enter'?d.locations[0].id:action==='return'?'Village':null;
    if(target) {
        save['current location']=target;
        const world=d.world.id;
        save.expansion.worlds[world]??=structuredClone(next.packs[id].domain??{facts:{},resources:{},completed:{}});
        save.expansion.actors.player.worldId=action==='enter'?world:'base.frontier';
        if(save.expansion.simulation?.people?.player)save.expansion.simulation.people.player.location=target;
    }
    validateSaveEnvelope(save,game_version);
    lifeSaveStorage.setItem(is_on_dev()?dev_save_key:save_key,JSON.stringify(save));
    optionalPackState=next;
    if(target){expansionState=save.expansion;change_location({location_id:target,skip_travel_time:true,do_quest_events:false,realm_move:true});renderWorldIdentity();}
    optionalPackPanel?.render();
}

function nativeOccupationReason() {
    if(!restoringNativeSave && Object.values(optionalPackState.packs).some(r=>r.active))return 'Return from your optional world before starting native activities.';
    if(!restoringNativeSave && villageTeachingBusy(villageCareer))return 'Finish the agreed teaching minutes before starting another activity.';
    const backlogReasons=backlogNativeActionReasons(expansionState);
    if(backlogReasons.length)return backlogReasons.join(' ');
    if(expansionState.actors.player.facts['original_frontier.travel.remaining']>0)return 'Finish or cancel your remaining native journey in local notes first.';
    if(simulationOccupiesActor(expansionState) || waitingSimulationChoice(expansionState)) return "Finish your living-world work or decision first.";
    if(usesJoinedClock() && ((!ownsSave && !restoringNativeSave) || foundationSaveBlocked || expansionError)) return "Progress is paused until saving is restored. Reload before continuing.";
    if(expansionState.chronicle?.session || expansionState.chronicle?.life.endedAt != null) {
        return "Finish or withdraw from the elder encounter; an ended mortal life cannot begin a new activity.";
    }
    if(expansionState.pending.some(job => job.context.actorId === "player") || activePractice(expansionState.actors.player)) {
        return "Finish or cancel your current expedition or technique drill before starting another activity.";
    }
    return "";
}

function expeditionOccupiesPlayer() {
    const reason = nativeOccupationReason();
    if(reason) log_message(reason, "notification");
    return !!reason;
}

function advanceExpeditions(minutes) {
    if(importProbeToken || !ownsSave || expansionError || foundationSaveBlocked || is_loading_error) return;
    // Idle clocks need no write. Timers request simulation work; committed jobs
    // and opportunities, including crossed travel deadlines, decide the result.
    const active = !!activeProto23Visit(expansionState) || !!activeMolVisit(expansionState) || !!activeParadiseVisit(expansionState) || expansionState.pending.length || Object.values(expansionState.opportunities)
        .some(o => o.status === "scheduled" || o.status === "available") || Object.values(expansionState.actors)
        .some(actor => Object.values(actor.sources || {}).some(source => source.expiresAt > expansionState.clock));
    if(active) {
        try {persistExpansion(advanceSimulation(expansionState, expeditionRegistry, minutes, {money: character.money}, gameplaySnapshot(),simulationNativeContexts()));}
        catch(error) {expansionError ||= error.message; console.error("Expedition clock paused:", error); log_message(`Progress paused: ${error.message}`, "notification");}
    }
    expeditionPanel?.render();
    techniquePanel?.render();
    chroniclePanel?.render();
    villagePanel?.render(); simulationPanel?.render(); townPanel?.render();
    pursuitPanel?.render();
    bodyPanel?.render();
    fieldPanel?.render(); promisePanel?.render(); crushSocialPanel?.render(); managementPanel?.render();
    knownRoutesPanel?.render();adventureNotebook?.render();
    expansionQuests?.render();
    characterBio?.render();
    worldEventFeed?.render();
    renderWorldIdentity();
}

function calendarSnapshot() {
    return Object.fromEntries(["year", "month", "day", "hour", "minute", "day_count"].map(k => [k, current_game_time[k] ?? 1]));
}
function metVillageElder() {
    const status = dialogues["village elder"].textlines.hello.getAvailabilityComponent().getStatus();
    return status.is_locked || status.is_finished;
}
function chronicleContext() {
    const stats = character.getFullStats(), stance = current_stance.getStats();
    const elder = NPCRegistry.get("villageElder");
    return {location: current_location?.id, calendar: calendarSnapshot(), money: character.money, stamina: stats.stamina, heroName: character.name,
        manualKey: item_templates["Old combat manual"].getInventoryKey(), ratStepId: RAT_STEP,
        ratStep: !!techniqueFacts(expansionState.actors.player, expeditionRegistry, expeditionContext())[`technique.${RAT_STEP}.executable`],
        witness: !!current_location?.npcs?.includes("villageGuard") && NPCRegistry.get("villageGuard").getAvailabilityComponent().getStatus().is_unlocked,
        elderId: elder.id,
        hero: {strength: stats.strength, agility: stats.agility, defense: stats.defense * (stance.defense || 1),
            attackPower: character.getAttackPower() * (stance.attack_power || 1), maxStamina: stats.max_stamina,
            blockStrength: character.hasShield() ? character.getBlockStrength() * (stance.block_strength || 1) : 0,
            staminaMultiplier: 1 / stats.stamina_efficiency, strikeMultiplier: current_stance.stamina_cost}};
}
function advanceChroniclePlan(plan, minutes, travel = false) {
    const nativeContexts = simulationNativeContexts(); nativeContexts.player.facts = expeditionContext().facts;
    let advanced = advanceSimulation(plan.state, expeditionRegistry, minutes, plan.external, plan.gameplay, nativeContexts);
    // A scheduler work budget never pays the rest of a journey. Drain its
    // remainder with the same owners, stopping at an actual waiting choice.
    while(advanced.budgetExhausted && advanced.remaining > 0 && !advanced.stoppedAtChoice) {
        const before=advanced, contexts=structuredClone(nativeContexts);
        if(before.native) {
            const v=contexts.player.vitals;
            if(before.native.hpToFull!=null)v.health=v.max_health-before.native.hpToFull;
            if(before.native.staminaToFull!=null)v.stamina=v.max_stamina-before.native.staminaToFull;
        }
        for(const id of Object.keys(contexts)) if(id!=='player'&&before.state.simulation?.people[id]?.vitals)contexts[id].vitals=before.state.simulation.people[id].vitals;
        advanced=advanceSimulation(before.state,expeditionRegistry,before.remaining,before.external,before.gameplay,contexts);
        advanced.acquisitions=[...before.acquisitions,...advanced.acquisitions];
        advanced.unlocks=[...before.unlocks,...advanced.unlocks];
        advanced.native=advanced.native || before.native;
    }
    const consumed = advanced.state.clock - plan.state.clock;
    const calendar = new Game_Time(calendarSnapshot()); calendar.goUp(consumed);
    return {...advanced, native: advanced.native || plan.native, effectDurations: Object.fromEntries(Object.entries(active_effects).map(([id,e]) => [id, Math.max(0,e.duration-(travel && !e.affected_by_travel ? 0 : consumed))])), calendar: Object.fromEntries(["year", "month", "day", "hour", "minute", "day_count"].map(k => [k, calendar[k]])),
        acquisitions: [...(plan.acquisitions || []), ...advanced.acquisitions]};
}
function makeChroniclePlan(command) {
    const context = chronicleContext(), result = commandChronicle(expansionState, command, context);
    const gameplay = gameplaySnapshot();
    for(const effect of result.effects) applyGameplayEffect(gameplay, effect, "player");
    const plan = {state: result.state, external: {money: character.money + result.moneyDelta}, gameplay,
        acquisitions: result.effects.filter(e => e.type === "item").map(e => ({owner: "player", key: e.key, count: e.amount})),
        native: result.staminaSpent ? {staminaToFull: context.hero.maxStamina - context.stamina + result.staminaSpent} : undefined};
    return result.minutes ? advanceChroniclePlan(plan, result.minutes) : plan;
}
function actSimulation(command) {
    if(command.id&&expeditionRegistry.simulation.commands.get(command.id)?.group==='structured_local')throw Error('Use your current local-life controls for this action.');
    const hostedId=id=>STEAM_ABSORPTION_GROUPS.includes(expeditionRegistry.simulation.commands.get(id)?.group)||['game_absorption_assay','contextual_balm','cooling_refinement'].includes(expeditionRegistry.simulation.commands.get(id)?.group)||id?.startsWith('feature_society.duty.');
    if(command.id&&hostedId(command.id))throw new Error('Choose this action in its current Here project controls.');
    if(command.type==='cancel'&&expansionState.simulation?.jobs.some(j=>j.actorId==='player'&&hostedId(j.commandId)))throw new Error('Cancel this exact job through its Here project controls.');
    if(['program','pause','resume'].includes(command.type)&&hostedId(expansionState.simulation?.programs.player?.commandId))throw new Error('No automatic program is registered for these project choices.');
    const equippedActors = {player: character};
    for(const [id,p] of Object.entries(expansionState.simulation?.people || {})) if(id !== "player" && p.inventory === "native") equippedActors[id] = NPCRegistry.get(id);
    const context = {...expeditionContext(), equipment: readNativeEquipment(equippedActors), targetId: command.targetId || null,
        busy: !!(current_activity || current_game_action || current_combat || current_dialogue || is_sleeping || is_reading || is_in_trade()),
        vitals: Object.fromEntries(Object.entries(simulationNativeContexts()).map(([id,c]) => [id,c.vitals]))};
    if(command.id&&expeditionRegistry.simulation.commands.get(command.id)?.group==='management')throw new Error('Use the courtyard controls for this quoted commitment.');
    if(['cancel','pause','resume'].includes(command.type)&&expansionState.simulation?.programs.player?.commandId.startsWith('mg.'))throw new Error('Use the courtyard mandate controls.');
    if(command.type==='cancel'&&expansionState.simulation?.jobs.some(j=>j.actorId==='player'&&j.commandId.startsWith('mg.')))throw new Error('Cancel courtyard work through its current controls.');
    if(["enroll","storylet_begin"].includes(command.type) && !metVillageElder()) throw new Error("Speak to the Village elder first.");
    if(command.id&&expeditionRegistry.simulation.commands.get(command.id)?.group?.startsWith('world_completion_'))throw new Error('Use the current home-world controls for this action.');
    if(command.id && ['status_care','field_care','book_care','book_care_npc','lore_work','lore_warning'].includes(expeditionRegistry.simulation.commands.get(command.id)?.group))throw new Error('Use the current care controls for this preparation.');
    if(command.type==='cancel'&&expansionState.simulation?.jobs.some(j=>j.actorId==='player'&&j.commandId.startsWith('world.completion.')))throw new Error('Cancel the actual home-world job from its connected controls.');
    if(command.type==='cancel' && expansionState.simulation?.jobs.some(j=>j.actorId==='player'&&['status_care','field_care','book_care','book_care_npc','lore_work','lore_warning'].includes(expeditionRegistry.simulation.commands.get(j.commandId)?.group)))throw new Error('Cancel the actual care job from its care controls.');
    let plan;
    if(command.type === "promise_begin") plan = beginPromiseVisitor(expansionState, expeditionRegistry, context, command.sequence ?? expansionState.sequence);
    else if(command.type === "body_begin") plan = beginBodyRecord(expansionState, expeditionRegistry, context);
    else if(command.type === "field_begin") plan = beginFieldWorkshop(expansionState, expeditionRegistry, context);
    else if(command.type === "storylet_begin") {
        const enrolled=expansionState.simulation?null:enrollSimulation(expansionState,expeditionRegistry,context);
        plan=commitSimulationCommand(enrolled?.state || expansionState,expeditionRegistry,{id:'village.storylets.begin'},{...context,external:enrolled?.external || context.external,gameplay:enrolled?.gameplay || context.gameplay});
    }
    else if(command.type === "enroll") plan = enrollSimulation(expansionState, expeditionRegistry, context);
    else if(command.type === "command"&&['home_furnishings','proto23','factorio_retort','causal_story','artifact_collection','audit_remainder','remainder_livelihood','remainder_home','remainder_offers','remainder_consequences','remainder_combat_fit','remainder_combat_objectives'].includes(expeditionRegistry.simulation.commands.get(command.id)?.group))throw new Error('Choose this action in its current Here project controls.');
    else if(command.type === "command") plan = commitSimulationCommand(expansionState, expeditionRegistry, command, context, command.sequence ?? expansionState.sequence);
    else if(command.type === "program") plan = setSimulationProgram(expansionState, expeditionRegistry, command.id, command.count, context);
    else if(command.type === "pause") plan = pauseSimulationProgram(expansionState, context);
    else if(command.type === "resume") plan = resumeSimulationProgram(expansionState, expeditionRegistry, context);
    else if(command.type === "response") plan = answerSimulationEncounter(expansionState, expeditionRegistry, command.responseId, context);
    else if(command.type === "withdraw") plan = withdrawSimulationEncounter(expansionState, context);
    else if(command.type === "cancel") plan = cancelSimulationJob(expansionState, expeditionRegistry, expansionState.simulation.jobs.find(j => j.actorId === "player")?.id, context);
    else if(command.type === "event") plan = respondSimulationEvent(expansionState, expeditionRegistry, command.eventId, command.responseId, context);
    else throw new Error("Unsupported local interaction.");
    persistExpansion(plan); simulationPanel?.render(); pursuitPanel?.render();skillExpansionPanel?.render();
}
function actSkillExpansion(command){
    if(!ownsSave||importProbeToken||foundationSaveBlocked||expansionError)throw new Error('Saving must be available before this action.');
    if(command.type==='command'&&expeditionRegistry.simulation.commands.get(command.id)?.group!=='skills'&&command.id!=='party.rest')throw new Error('Unsupported method action.');
    if(['response','withdraw'].includes(command.type)&&expeditionRegistry.simulation.commands.get(expansionState.simulation?.sessions.player?.commandId)?.group!=='skills')throw new Error('No accepted method exercise.');
    if(command.type==='cancel'&&!expansionState.simulation?.jobs.some(j=>j.actorId==='player'&&(expeditionRegistry.simulation.commands.get(j.commandId)?.group==='skills'||j.commandId==='party.rest')))throw new Error('No accepted method work.');
    actSimulation(command);
}
function actOriginalFrontier(command){
    if(!ownsSave||importProbeToken||foundationSaveBlocked||expansionError)throw new Error('Saving must be available before this action.');
    const definition=expeditionRegistry.simulation.commands.get(command.id);
    const context={...campaignContext(),targetId:command.targetId || definition?.targetId || null,
        equipment:Object.fromEntries(Object.entries(simulationNativeContexts()).filter(([,c])=>c.equipment).map(([id,c])=>[id,c.equipment]))};
    const sequence=command.sequence ?? expansionState.sequence;
    let plan;
    if(command.type==='begin')plan=beginOriginalFrontier(expansionState,expeditionRegistry,context,sequence);
    else if(command.type==='command')plan=commitOriginalFrontier(expansionState,expeditionRegistry,{...command,targetId:context.targetId},context,sequence);
    else if(command.type==='program'){
        if(definition?.group!=='original_frontier'||!Number.isInteger(command.count)||command.count<1||command.count>20)throw new Error('Choose a known finite Frontier routine.');
        plan=setSimulationProgram(expansionState,expeditionRegistry,command.id,command.count,originalFrontierContext(expansionState,expeditionRegistry,context),sequence);
    }else if(['pause','resume'].includes(command.type)){
        if(expeditionRegistry.simulation.commands.get(expansionState.simulation?.programs.player?.commandId)?.group!=='original_frontier')throw new Error('No saved Frontier routine.');
        plan=command.type==='pause'?pauseSimulationProgram(expansionState,context,sequence):resumeSimulationProgram(expansionState,expeditionRegistry,originalFrontierContext(expansionState,expeditionRegistry,context),sequence);
    }else if(command.type==='cancel'){
        if(command.id==='native-journey'){
            if(expansionState.sequence!==sequence||!(expansionState.actors.player.facts['original_frontier.travel.remaining']>0))throw new Error('No current native journey.');
            plan={state:structuredClone(expansionState),external:context.external,gameplay:context.gameplay};plan.state.sequence++;
            plan.state.actors.player.facts['original_frontier.travel.remaining']=0;persistExpansion(plan);return;
        }
        const job=expansionState.simulation?.jobs.find(j=>j.id===command.id&&j.actorId==='player');
        if(expeditionRegistry.simulation.commands.get(job?.commandId)?.group!=='original_frontier')throw new Error('No accepted Frontier work.');
        plan=cancelSimulationJob(expansionState,expeditionRegistry,job.id,context,sequence);
    }else if(['response','withdraw'].includes(command.type)){
        if(expeditionRegistry.simulation.commands.get(expansionState.simulation?.sessions.player?.commandId)?.group!=='original_frontier')throw new Error('No accepted Frontier exercise.');
        plan=command.type==='response'?answerSimulationEncounter(expansionState,expeditionRegistry,command.responseId,context,sequence):withdrawSimulationEncounter(expansionState,context,sequence);
    }else throw new Error('Unsupported Frontier action.');
    persistExpansion(plan);
}
function actFoundationInteraction(command){
    if(!foundationProbeEnabled||!ownsSave||foundationSaveBlocked||importProbeToken||restoringNativeSave)throw Error('Use the writable local experimental view.');
    if(command.expectedSequence!==expansionState.sequence)throw Error('This experimental action is stale.');
    let state=expansionState,base=expeditionContext(),enrolled;
    if(!state.simulation){
        if(command.id!=='foundation.probe.enroll')throw Error('Complete the experimental admission drill first.');
        enrolled=enrollSimulation(state,expeditionRegistry,base,state.sequence);state=enrolled.state;
        base={...base,external:enrolled.external,gameplay:enrolled.gameplay,vitals:enrolled.vitals||base.vitals,equipment:enrolled.equipment||base.equipment};
    }
    const context=foundationInteractionProbeContext(state,command.actorId,{...base,targetId:command.targetId||null,busy:!!nativeOccupationReason()});
    let plan;
    if(command.type==='encounter'){
        const session=state.simulation.sessions[command.actorId];
        foundationInteractionProbeGuard(state,expeditionRegistry.simulation.commands.get(session?.commandId),context);
        if(!session||expeditionRegistry.simulation.commands.get(session.commandId)?.group!==FOUNDATION_PROBE_GROUP)throw Error('No experimental encounter is bound.');
        plan=answerSimulationEncounter(state,expeditionRegistry,command.id,context,state.sequence);
    }else{
        const d=expeditionRegistry.simulation.commands.get(command.id);
        if(d?.group!==FOUNDATION_PROBE_GROUP||d.actorId!==command.actorId)throw Error('Unknown experimental actor/action.');
        foundationInteractionProbeGuard(state,d,context);
        plan=commitSimulationCommand(state,expeditionRegistry,{id:command.id},context,state.sequence);
    }
    if(enrolled){plan.acquisitions=[...(enrolled.acquisitions||[]),...(plan.acquisitions||[])];plan.unlocks=[...(enrolled.unlocks||[]),...(plan.unlocks||[])];}
    persistExpansion(plan);foundationInteractionPanel?.render();
    return plan;
}
function featureWaveContext(){
    const bookCurrent=paradiseContext(expansionState,referenceGameplayContext(expansionState,expeditionRegistry,nestedLifeContext(expansionState,nestedChainContext(expansionState,nestedContext(expansionState,repositoryAbsorptionContext(expansionState,expeditionRegistry,featurePowerContext(expansionState,tidemarkContext(expansionState,societyContext(expansionState,featureObjectContext(expansionState,expeditionRegistry,campaignContext()))))))))));
    const current=paradiseCampaignContext(expansionState,molContext(expansionState,bookCurrent));
    const joined=coolingRefinementContext(expansionState,expeditionRegistry,contextualBalmContext(expansionState,gameAbsorptionAssayContext(expansionState,expeditionRegistry,factorioRetortContext(expansionState,expeditionRegistry,proto23Context(expansionState,worldCompletionContext(expansionState,auditRemainderContext(expansionState,expeditionRegistry,auditedWorkshopContext(expansionState,expeditionRegistry,nethackFieldcraftContext(expansionState,expeditionRegistry,current)))))))));
    return steamAbsorptionContext(expansionState,expeditionRegistry,joined);
}
function actManagement(command){
    if(!ownsSave||importProbeToken||foundationSaveBlocked||expansionError||is_loading_error)throw new Error('Saving must be available before this courtyard choice.');
    const context={...featureWaveContext(),managementHost:true};
    persistExpansion(commitManagement(expansionState,expeditionRegistry,command,context,command.sequence??expansionState.sequence));
    managementPanel?.render();
}
function actFeatureExpansion(command){
    if(!ownsSave||importProbeToken||foundationSaveBlocked||expansionError)throw new Error('Saving must be available before this action.');
    const context=featureWaveContext(),sequence=command.sequence??expansionState.sequence;let plan;
    if(command.type==='feature_battle_action')return featureBattleHost.act({...command,type:command.actionType});
    if(command.type==='feature_battle_resume'){
        const token=featureBattleToken(expansionState);
        if(!token||['sessionId','sequence','action','seed'].some(key=>command[key]!==token[key]))throw new Error('This saved battle changed. Review it again.');
        if(context.busy)throw new Error('Finish the current native activity first.');
        featureBattleHost.resume(command);return;
    }
    if(STEAM_ABSORPTION_GROUPS.includes(command.type))plan=commitSteamAbsorptionCommand(expansionState,expeditionRegistry,command,context,sequence);
    else if(command.type==='contextual_balm')plan=commitContextualBalmCommand(expansionState,expeditionRegistry,command,context,sequence);
    else if(command.type==='cooling_refinement')plan=commitCoolingRefinementCommand(expansionState,expeditionRegistry,command,context,sequence);
    else if(command.type==='agreed_duty')plan=commitAgreedDutyAction(expansionState,expeditionRegistry,context,command.id,sequence);
    else if(command.type==='world_completion')plan=commitWorldCompletionCommand(expansionState,expeditionRegistry,command,context,sequence);
    else if(command.type==='lore_practice')plan=commitLorePracticeCommand(expansionState,expeditionRegistry,command.operation?{...command,type:command.operation}:command,context,sequence);
    else if(command.type==='book_care')plan=commitBookCareCommand(expansionState,expeditionRegistry,command,context,sequence);
    else if(command.type==='field_care')plan=commitFieldCareCommand(expansionState,expeditionRegistry,command,context,sequence);
    else if(command.type==='status_care')plan=commitStatusCareCommand(expansionState,expeditionRegistry,command,context,sequence);
    else if(command.type==='book_paradise_campaign')plan=commitParadiseCampaignDepthCommand(expansionState,expeditionRegistry,command,context,sequence);
    else if(command.type==='book_paradise')plan=planParadiseAction(expansionState,expeditionRegistry,command,context,sequence);
    else if(command.type==='book_mol')plan=commitMolCommand(expansionState,expeditionRegistry,command,{...context,nativeAlive:character.is_alive===true},sequence);
    else if(command.type==='home_furnishings')plan=commitHomeFurnishingCommand(expansionState,expeditionRegistry,command,context,sequence);
    else if(command.type==='proto23')plan=commitProto23Command(expansionState,expeditionRegistry,command,context,sequence);
    else if(command.type==='factorio_retort')plan=commitFactorioRetortCommand(expansionState,expeditionRegistry,command,context,sequence);
    else if(command.type==='factorio_retort_cancel')plan=cancelFactorioRetortJob(expansionState,expeditionRegistry,command.id,context,sequence);
    else if(command.type==='factorio_retort_plan_start')plan=startFactorioRetortPlan(expansionState,expeditionRegistry,context,sequence);
    else if(command.type==='factorio_retort_plan_control')plan=controlFactorioRetortPlan(expansionState,expeditionRegistry,command,context,sequence);
    else if(command.type==='game_absorption_assay')plan=commitGameAbsorptionAssayCommand(expansionState,expeditionRegistry,command,context,sequence);
    else if(command.type==='nethack_fieldcraft')plan=commitNethackFieldcraftCommand(expansionState,expeditionRegistry,command,context,sequence);
    else if(command.type==='artifact_collection'){if(!expansionState.auditRemainder)throw new Error('Open the optional local projects first.');plan=commitArtifactWorkshopCommand(expansionState,expeditionRegistry,command,context,sequence);}
    else if(command.type==='audit_remainder')plan=commitAuditRemainderCommand(expansionState,expeditionRegistry,command,context,sequence);
    else if(command.type==='audit_workshop')plan=commitAuditedWorkshopCommand(expansionState,expeditionRegistry,command,context,sequence);
    else if(command.type==='audited_kit_reserve_start')plan=startAuditedKitReserve(expansionState,expeditionRegistry,context,sequence);
    else if(command.type==='audited_kit_reserve_control')plan=controlAuditedKitReserve(expansionState,expeditionRegistry,command,context,sequence);
    else if(command.type==='reference_control')plan=commitReferenceControl(expansionState,expeditionRegistry,command,context,sequence);
    else if(command.type==='reference_workshop')plan=commitReferenceGameplayCommand(expansionState,expeditionRegistry,command,context,sequence);
    else if(command.type==='reference_plan_start') {
        if(command.id!=='reference_gameplay.cooling_plan')throw new Error('Unknown cooling practice plan.');
        plan=startWorkPlan(expansionState,expeditionRegistry,expeditionRegistry.workPlans,command.id,context,sequence);
    }else if(command.type==='reference_plan_control') {
        if(expansionState.simulation?.workPlans?.cursors.player?.definitionId!=='reference_gameplay.cooling_plan')throw new Error('This cooling plan changed.');
        plan=controlWorkPlan(expansionState,expeditionRegistry,command,context,sequence);
    }else if(['feature_enroll','feature_command','feature_cancel'].includes(command.type))plan=planFeaturePowerCommand(expansionState,expeditionRegistry,command,context,sequence);
    else if(command.type==='objects_begin')plan=beginFeatureObjects(expansionState,expeditionRegistry,context,sequence);
    else if(command.type==='society')plan=commitSocietyAction(expansionState,expeditionRegistry,command.action,context,sequence);
    else if(command.type==='tidemark')plan=command.id==='tidemark.chart'&&!expansionState.simulation?beginTidemark(expansionState,expeditionRegistry,context,sequence):commitTidemarkAction(expansionState,expeditionRegistry,command.id,context,sequence);
    else if(command.type==='backlog')return actBacklog(command);
    else if(command.type==='relay')plan=relayHost.commit(expansionState,expeditionRegistry,{...command,type:command.action},backlogContext(),sequence);
    else if(command.type==='reference')plan=referenceDeskHost.commit(expansionState,expeditionRegistry,command,backlogContext(),sequence);
    else if(command.type==='nested_campaign')plan=planNestedAction(expansionState,expeditionRegistry,command.id,context,sequence);
    else if(command.type==='nested_life')plan=commitNestedLifeCommand(expansionState,expeditionRegistry,command,context,sequence);
    else if(command.type==='nested_chain')plan=commitNestedChainCommand(expansionState,expeditionRegistry,command.action,nestedChainContext(expansionState,context),sequence);
    else if(command.type==='command'){
        const d=expeditionRegistry.simulation.commands.get(command.id);
        if(d?.group==='feature_objects')plan=commitFeatureObjectCommand(expansionState,expeditionRegistry,command,context,sequence);
        else if(d?.group==='feature_society')plan=commitSocietyAction(expansionState,expeditionRegistry,command,context,sequence);
        else throw new Error('Unsupported feature action.');
    }else if(command.type==='cancel'){
        const job=expansionState.simulation?.jobs.find(j=>j.id===command.id&&j.actorId==='player');
        if(job&&expeditionRegistry.simulation.commands.get(job.commandId)?.group==='game_absorption_assay'){
            persistExpansion(cancelGameAbsorptionAssayJob(expansionState,expeditionRegistry,job.id,context,sequence));return;
        }
        if(!job||!['feature_objects','feature_society','feature_powers','tidemark','reference_gameplay','cooling_refinement','nethack_fieldcraft','audit_fixture','audit_lesson','remainder_livelihood','remainder_home','remainder_offers','remainder_consequences','remainder_combat_fit','remainder_combat_objectives'].includes(expeditionRegistry.simulation.commands.get(job.commandId)?.group))throw new Error('This accepted work changed.');
        plan=cancelSimulationJob(expansionState,expeditionRegistry,job.id,context,sequence);
    }else throw new Error('Unsupported feature control.');
    persistExpansion(plan);
    if(command.id==='feature_battle.start')featureBattleHost.resume(featureBattleToken(expansionState));
}
function currentCausalContext(){return causalStoryContext(expansionState,campaignContext());}
function actCausalStory(command){
    if(!ownsSave||importProbeToken||foundationSaveBlocked||expansionError||is_loading_error)throw new Error('Saving must be available before this story choice.');
    const plan=commitCausalStoryCommand(expansionState,expeditionRegistry,command,currentCausalContext(),command.sequence??expansionState.sequence);
    persistExpansion(plan);causalStoryPanel?.render();
}
function backlogContext(){
    const nativeOtherInventories=[];
    for(const [category,owners] of Object.entries(inventories))for(const [id,inventory] of Object.entries(owners))if(category!=='person'||id!=='main_character')
        nativeOtherInventories.push(Object.fromEntries(Object.entries(inventory.getItems()).map(([key,row])=>[key,row.count])));
    return bookNativeContext(expansionState,backlogNativeContext(expansionState,{...featureWaveContext(),wallNowMs:Date.now(),nativeOtherInventories},
        {character,locationId:current_location?.id,heroCreated:global_flags.is_hero_created,creationPanelOpen:config.do_hero_creation&&!global_flags.is_hero_created,freshNativeGame:!hasLoadedNativeSave&&!importProbeToken,gameStats:game_stats}),{character,locationId:current_location?.id});
}
function assertFeatureWriter(){
    if(!ownsSave||importProbeToken||foundationSaveBlocked||expansionError||is_loading_error)throw new Error('Saving must be available before this action.');
}
function replacementRecoverySnapshot(){
    const context=backlogContext(),known=expansionState.simulation?.knowledge.player||{},r=expansionState.backlog?.replacement;
    const allowed=new Set(['backlog.replacement.honest_entry','backlog.replacement.return_template','backlog.replacement.return_office','backlog.replacement.revisit']);
    const recovery=r?backlogActions().filter(a=>allowed.has(a.id)).map(a=>({known:true,id:a.id,label:a.label,description:a.description,
        observerId:'player',preview:qualifiedBacklog.preview(expansionState,expeditionRegistry,a.id,context),
        disclosure:{completion:[{known:true,text:a.description}]},command:{id:a.id,sequence:expansionState.sequence}})):[];
    return {state:expansionState,recovery,error:expansionError,canWrite:ownsSave&&!foundationSaveBlocked&&!importProbeToken};
}
function actBacklog(command){
    assertFeatureWriter();
    persistExpansion(qualifiedBacklog.commit(expansionState,expeditionRegistry,command,backlogContext(),command.sequence??expansionState.sequence));
}
function actRepository(command){
    assertFeatureWriter();const context=featureWaveContext(),sequence=command.sequence??expansionState.sequence;
    const plan=command.type==='begin'?beginRepositoryAbsorption(expansionState,expeditionRegistry,context,sequence):
        command.type==='cancel'?cancelRepositoryAbsorption(expansionState,expeditionRegistry,command.id,context,sequence):
        command.type==='projection'?commitRepositoryProjection(expansionState,expeditionRegistry,command,context,sequence):
        commitRepositoryAbsorption(expansionState,expeditionRegistry,command,context,sequence);
    persistExpansion(plan);
}
function actInk(id,token){
    assertFeatureWriter();
    persistExpansion(commitInkNarrativeAction(expansionState,expeditionRegistry,{...token,id},currentInkHost()===relayInkHost?backlogContext():featureWaveContext(),currentInkHost()));
}
function nativeCampaignLocationOwners(){
    const snapshot=id=>{const l=locations[id],status=l.getAvailabilityComponent().getStatus();return {id,enemy_groups_killed:l.enemy_groups_killed||0,availability:{is_unlocked:!!status.is_unlocked,is_finished:!!status.is_finished,is_locked:!!status.is_locked}};};
    return {frontierLocationOwner:snapshot('Village'),proto23LocationOwners:Object.fromEntries(PROTO23_FOOTPRINTS.flatMap(f=>f.native.locations.map(id=>[`native.location.${id.replaceAll(' ','_')}`,{...snapshot(id),worldId:f.worldId}]))),molLocationOwners:Object.fromEntries(MOL_FOOTPRINTS.flatMap(f=>f.native.locations.map(id=>[`native.location.${id.replaceAll(' ','_')}`,{...snapshot(id),worldId:f.worldId}]))),paradiseLocationOwners:Object.fromEntries(PARADISE_FOOTPRINTS.flatMap(f=>f.native.locations.map(id=>[`native.location.${id.replaceAll(' ','_')}`,{...snapshot(id),worldId:f.worldId}]))),nestedLocationOwners:Object.fromEntries(Object.entries(NESTED_LOCATIONS).map(([key,id])=>[`native.location.${id.replaceAll(' ','_')}`,{...snapshot(id),worldId:['hub','workroom'].includes(key)?NESTED_IDS.hub:['salt','enginehouse'].includes(key)?NESTED_IDS.salt:NESTED_IDS.archive}]))};
}
function planNestedAction(state,registry,id,context,sequence){
    const plan=commitNestedCommand(state,registry,id,{...context,nativeAlive:character.is_alive===true},sequence);
    if(!plan.nestedAdvanceBy)return plan;
    if(id!=='nested.extraction.wait'||plan.nestedAdvanceReason!=='extraction')throw new Error('Unsupported campaign clock commitment.');
    return stageNestedCarrierClock(plan,{...context,nativeAlive:character.is_alive===true},plan.nestedAdvanceBy,
        (draft,minutes)=>advanceChroniclePlan(draft,minutes,true),syncNestedCampaignClock);
}
function planParadiseAction(state,registry,command,context,sequence){
    const plan=commitParadiseCommand(state,registry,command,{...context,nativeAlive:character.is_alive===true},sequence);
    if(!plan.paradiseAdvanceBy)return plan;
    if(command.id!=='book.paradise.extraction.wait'||plan.paradiseAdvanceReason!=='extraction')throw new Error('Unsupported source-world clock commitment.');
    return stageParadiseCarrierClock(plan,{...context,nativeAlive:character.is_alive===true},plan.paradiseAdvanceBy,
        (draft,minutes)=>advanceChroniclePlan(draft,minutes,true),syncParadiseClock);
}
function campaignContext() {
    return {...expeditionContext(),destinationNative:tidemarkNative.read(expansionState),nestedNative:nestedNative.read(expansionState),paradiseNative:paradiseNative.read(expansionState),molNative:molNative.read(expansionState),proto23Native:proto23Native.read(expansionState),causalStoryNative:causalNative.read(expansionState),...nativeCampaignLocationOwners(),equipment:Object.fromEntries(Object.entries(simulationNativeContexts()).filter(([,c])=>c.equipment).map(([id,c])=>[id,c.equipment])),nativeAlive:character.is_alive===true,busy:!!(current_activity || current_game_action || current_combat || current_dialogue || is_sleeping || is_reading || is_in_trade()),
        vitals:Object.fromEntries(Object.entries(simulationNativeContexts()).map(([id,c])=>[id,c.vitals]))};
}
function advanceFrontierJourney(plan,minutes){
    const f=plan.state.actors.player.facts,remaining=f['original_frontier.travel.remaining'];
    const next=advanceChroniclePlan(plan,Math.min(minutes,remaining),true),nf=next.state.actors.player.facts;
    nf['original_frontier.travel.remaining']=remaining-(next.state.clock-plan.state.clock);
    if(nf['original_frontier.travel.remaining']===0&&locations[nf['original_frontier.travel.to']]?.canBeStarted(get_context())){
        next.nativeLocation=nf['original_frontier.travel.to'];next.nativeEnterQuest=true;
        next.nativePatch={...(next.nativePatch||{}),'current location':next.nativeLocation};
    }
    return next;
}
function beginFrontierJourney(to){
    pathfinder = new Pathfinder();pathfinder.fill_connections(locations);
    const minutes=pathfinder.find_shortest_paths(current_location.id)[to];
    if(!Number.isSafeInteger(minutes)||minutes<0)throw new Error('No currently accessible native route.');
    const state=structuredClone(expansionState),f=state.actors.player.facts;state.sequence++;
    state.simulation.schema=Math.max(state.simulation.schema,4);
    Object.assign(f,{'original_frontier.travel.from':current_location.id,'original_frontier.travel.to':to,
        'original_frontier.travel.remaining':minutes,'original_frontier.travel.startedAt':state.clock});
    const plan=minutes?advanceFrontierJourney({state,external:{money:character.money},gameplay:gameplaySnapshot()},minutes):
        {state,external:{money:character.money},gameplay:gameplaySnapshot(),nativeLocation:to,nativeEnterQuest:true,nativePatch:{'current location':to}};
    persistExpansion(plan);
    if(plan.state.actors.player.facts['original_frontier.travel.remaining']>0)log_message('The journey stopped for a waiting choice. Its remaining time is saved in local notes.','notification');
}
function actFrontierCampaign(command) {
    if(!ownsSave || importProbeToken || foundationSaveBlocked || expansionError) throw new Error("Saving must be available before this action.");
    if(command.type === "battle_resume") {if(campaignContext().busy)throw new Error("Finish your current native activity first.");nativeBattlePauseReason="";nativeBattleHost.resume();return;}
    if(command.type === "battle_withdraw") {nativeBattleHost.withdraw(command.sequence);return;}
    const context={...campaignContext(),targetId:command.targetId || null};
    let plan;
    if(command.type === "renewal") plan=commitFieldRenewal(expansionState,expeditionRegistry,context,command.sequence);
    else if(command.type === "rematch") plan=prepareRivalRematch(expansionState,expeditionRegistry,context);
    else {
        if(command.id === "rival.confront" && (context.vitals.player.health <= 1 || expansionState.simulation.people.roadRival.vitals.health <= 1)) throw new Error("Both participants need recovery before a duel.");
        plan=commitSimulationCommand(expansionState,expeditionRegistry,command,context);
        if(command.id === "rival.confront") initializeNativeBattle(plan);
    }
    persistExpansion(plan);
    if(command.id === "rival.confront") nativeBattleHost.resume();
    frontierCampaignPanel?.render();
}

function actPocketRealm(command){
    if(command.id==='pocket.observation.replay'){pocketRealmPanel?.render();return;}
    if(!ownsSave || importProbeToken || foundationSaveBlocked || expansionError)throw new Error('Saving must be available before this action.');
    const contexts=simulationNativeContexts(),context=pocketContext(expansionState,{...campaignContext(),equipment:Object.fromEntries(Object.entries(contexts).filter(([,c])=>c.equipment).map(([id,c])=>[id,c.equipment]))});
    persistExpansion(commitPocketRealmAction(expansionState,expeditionRegistry,command.id,context,command.sequence));
    pocketRealmPanel?.render();
}

function actObservation(command) {
    if(!ownsSave || importProbeToken || foundationSaveBlocked || expansionError)throw new Error("Saving must be available before this action.");
    const context={...campaignContext(),targetId:command.targetId||null};
    context.facts={...context.facts,"observation.handsUsable":(expansionState.simulation?.people.player?.body?.hands??2)>=2&&!bodyFacts(expansionState)["body.handsTender"]};
    const plan=command.type === "open"?beginObservation(expansionState,expeditionRegistry,context,command.sequence):commitObservationCommand(expansionState,expeditionRegistry,{id:command.id},context,command.sequence);
    persistExpansion(plan);observationPanel?.render();
}

function actExchange(command) {
    if(!ownsSave || importProbeToken || foundationSaveBlocked || expansionError)throw new Error("Saving must be available before this action.");
    const context={...campaignContext(),targetId:command.targetId||null};let plan;
    if(command.type === "cancel") {const job=expansionState.simulation?.jobs.find(j=>j.id===command.jobId&&j.actorId==="player"&&j.commandId.startsWith("exchange."));if(!job)throw new Error("This parcel work is no longer pending.");plan=cancelSimulationJob(expansionState,expeditionRegistry,job.id,context,command.sequence);}
    else if(command.id === "exchange.begin")plan=beginExchange(expansionState,expeditionRegistry,context,command.sequence);
    else plan=commitExchangeCommand(expansionState,expeditionRegistry,{id:command.id},context,command.sequence);
    persistExpansion(plan);exchangePanel?.render(); observationPanel?.render();
}

function actCrushSocial(command) {
    assertFeatureWriter();
    if(command.type==='party_command'||command.type==='party_start')return actParty(command);
    if(command.type==='audit_remainder')return actFeatureExpansion(command);
    persistExpansion(commitCrushSocialAction(expansionState,expeditionRegistry,command,featureWaveContext(),command.sequence??expansionState.sequence));
    crushSocialPanel?.render(); managementPanel?.render();
}

function actParty(command) {
    if(!ownsSave || importProbeToken || foundationSaveBlocked || expansionError)throw new Error("Saving must be available before this action.");
    const context=campaignContext();
    if(command.type === "party_cancel") {const job=expansionState.simulation.jobs.find(j=>j.id===command.jobId&&j.actorId==="player"&&j.commandId.startsWith("party."));if(!job)throw new Error("This party work is no longer pending.");persistExpansion(cancelSimulationJob(expansionState,expeditionRegistry,job.id,context,command.sequence));return;}
    if(command.type === "party_release") {nativeBattleHost.release(command.sequence,command.action,command.sessionId);return;}
    if(command.type === "party_ask" || command.type === "party_decline") {
        if(command.sequence !== expansionState.sequence || context.busy || nativeActionReasons(expansionState).length)throw new Error("This invitation is stale or someone is occupied.");
        if(!expansionState.actors.player.facts["party.met"] || context.facts.location !== "Village")throw new Error("Meet Lio first in the Village.");
        const reasons=partyHelperReasons(expansionState,context);
        const state=structuredClone(expansionState);state.sequence++;
        state.actors.player.facts["party.invited"]=command.type === "party_ask" && !reasons.length;
        state.actors.player.facts["party.declined"]=command.type === "party_decline";
        state.actors.player.facts["party.answer"]=command.type === "party_decline" ? "You declined assistance; no commitment was made."
            : reasons.length ? `Lio declined: ${reasons.join(" ")}` : "Lio agreed to the proposed guard role; acceptance still rechecks his availability and means.";
        persistExpansion({state,external:context.external,gameplay:context.gameplay});
        if(command.type === "party_ask" && reasons.length)throw new Error(reasons.join(" "));
    } else if(command.type === "party_start") {
        if(!expansionState.actors.player.facts["party.invited"])throw new Error("Ask for Lio's current consent first.");
        const plan=initializePartyBattle(expansionState,expeditionRegistry,{requestId:pursuitView(expansionState,RIVAL_PURSUIT)?.requestId},context,command.sequence);
        plan.state.actors.player.facts["party.invited"]=false;persistExpansion(plan);nativeBattlePauseReason="";nativeBattleHost.resume();
    } else {
        const id=command.type === "party_settle" ? "rival.settle" : command.id;
        const plan=commitSimulationCommand(expansionState,expeditionRegistry,{id},{...context,targetId:command.type === "party_settle" ? "roadRival" : command.targetId || null},command.sequence);
        if(command.type === "party_settle") {plan.state.actors.player.facts["party.lastResult"]="settled";plan.state.actors.player.facts["party.guardsTaken"]=0;plan.state.actors.player.facts["party.helperStatus"]="not involved";}
        persistExpansion(plan);
    }
    partyPanel?.render();
}

function actChronicle(command) {
    if(simulationOccupiesActor(expansionState) || waitingSimulationChoice(expansionState)) throw new Error("Finish your living-world work first.");
    if(current_activity || current_game_action || current_combat || is_sleeping || is_reading || is_in_trade() ||
        expansionState.pending.some(j => j.context.actorId === "player") || activePractice(expansionState.actors.player)) throw new Error("Finish your current activity before this interaction.");
    if(command.type === "enroll" && !metVillageElder()) throw new Error("Speak to the Village elder first.");
    persistExpansion(makeChroniclePlan(command)); chroniclePauseReason = ""; chroniclePanel?.render(true);
}

// Heir succession (accepted 2026-10-10): count what the ended life left behind,
// keep it saved, then build the heir on a pristine beginning after reload.
const equippedInventoryKeys = () => Object.values(character.getEquipment()).filter(Boolean).map(item => item.getInventoryKey());
const lessonLabels = () => Object.fromEntries(LIFE_LESSONS.map(l => [l.id, l.label]));
let heirPreviewLines = null;
function previewHeir() {
    if(heirRequest?.error) return [heirRequest.error];
    if(heirPreviewLines || expansionState.chronicle?.life.endedAt == null || !ownsSave) return heirPreviewLines || [];
    const serialized = create_save(); if(!serialized) return ["What this life left cannot be counted while saving is unavailable."];
    return heirPreviewLines ||= heirLeftoverLines(deriveHeirLeftovers(JSON.parse(serialized), {equippedKeys: equippedInventoryKeys()}), lessonLabels());
}
function beginHeir() {
    if(!ownsSave || importProbeToken || foundationSaveBlocked || is_loading_error) throw new Error("Saving must be available before an heir can begin.");
    const serialized = create_save(); if(!serialized) throw new Error("This life could not be saved, so the heir waits.");
    const leftovers = deriveHeirLeftovers(JSON.parse(serialized), {equippedKeys: equippedInventoryKeys()});
    lifeSaveStorage.setItem(is_on_dev() ? dev_save_key : save_key, serialized);
    localStorage.setItem(heir_request_key, JSON.stringify({schema: 1, leftovers}));
    window.location.reload();
}
async function completeHeirRequest(request) {
    const key = is_on_dev() ? dev_save_key : save_key;
    try {
        if(!(await saveOwnership)) throw new Error("Another game tab owns the save.");
        const previous = JSON.parse(localStorage.getItem(key)), fresh = create_save();
        if(!fresh) throw new Error("No fresh beginning could be created.");
        const next = buildLifeHeirSave(previous, JSON.parse(fresh), request.leftovers);
        await importSaveFile(encodeSaveFile(JSON.stringify(next)), {currentVersion: game_version, preflight: preflightImport, storage: lifeSaveStorage, key});
        localStorage.removeItem(heir_request_key);
    } catch(error) {
        console.error("Heir succession failed:", error);
        localStorage.setItem(heir_request_key, JSON.stringify({schema: 1, error: `The heir could not begin; the ended life is kept. ${error.message}`}));
    }
    window.location.reload();
    await new Promise(() => {});
}

const global_flags = {
    is_gathering_unlocked: false,
    is_crafting_unlocked: false,
    is_strength_proved: false, //this role could be fulfilled by a quest, but it was originally added before that mechanic; besides, flags are cool and elegant
    is_mofu_mofu_enabled: true,
    is_guard_met: false,
    is_hero_created: false, //changed after going through hero creation panel
};
const flag_unlock_texts = {
    is_gathering_unlocked: "You have gained the ability to gather new materials! Remember to equip your tools first <br>[Note: equipped tools do not appear in inventory as you will be swapping them very rarely]",
    is_crafting_unlocked: "You have gained the ability to craft items and equipment!",
}

const play_button = document.getElementById("loading_screen_play_button");

const languages = {
    english: "english",
};

let language = languages.english;

let is_loading_error = false;


//some random stats to keep count of in case they ever become relevant
const game_stats = {
    total_playtime: 0, //in seconds
    total_deaths: 0,
    total_crafting_attempts: 0,
    total_crafting_successes: 0,
    total_kills: 0,
    total_crits_done: 0,
    total_crits_taken: 0,
    total_hits_done: 0,
    total_hits_taken: 0,
    strongest_hit: 0,
    gathered_materials: {},
}


//keeping the time to use it for export bonus
let last_rewarded_export = 0;

//temperature
let current_temperature = 20;

let rain_counter = 0;
const cold_status_counters = [0,0,0,0];

let was_raining = false;
let was_starry = false;

//current Combat object
let current_combat = null;

//current location
let current_location;

let current_activity;

let game_action_interval;
let game_action_tick;
let current_game_action;

//loot from currently active source (combat location or specific activity), used for display if dynamic loot logging option is enabled
const current_loot = {
    recent: {},
    total: {},
}

//time needed to travel from A to B
let travel_times = {};
let pathfinder;

//locations for fast travel
let unlocked_beds = {};

//resting, true -> health regenerates
let is_resting = true;

//sleeping, true -> health regenerates, timer goes up faster
let is_sleeping = false;

let last_location_with_bed = null; //actually last location where player slept!
let last_combat_location = null;

//reading, either null or book name
let is_reading = null;

//ticks between saves, 60 = ~1 minute
const save_period = 60;
let save_counter = 0;

//ticks between backup saves, 60 = ~1 minute
const backup_period = 3600;
let backup_counter = 0;

//can be changed without reloading if dev mode is active, hence not a const
let tickrate = config.tickrate;

//accumulates deviations
let time_variance_accumulator = 0;
//all 3 used for calculating and adjusting tick durations
let time_adjustment = 0;
let start_date;
let end_date;

let current_dialogue;
const active_effects = {};
//e.g. health regen from food

let selected_stance = stances["normal"];
let current_stance = stances["normal"];
const faved_stances = {};

const favourite_consumables = {};
//consumables that are to be used automatically if their effect runs out

const favourite_items = {};
//items to be displayed with "show faves" option in inventory

//stuff from options panel
const game_options = {
    elemental_affinities:false,
    uniform_text_size_in_action: false,
    auto_return_to_bed: true,
    remember_message_log_filters: false,
    remember_sorting_options: false, //not in use?
    combat_disable_autoswitch: false,

    do_dynamic_loot_message: false,

    auto_use_when_longest_runs_out: true, //can't actually be changed by a player; despite the name, it decides whether to first use longest-duration item or shortest-duration item
    use_uncivilised_temperature_scale: false, //true -> swap Celsius for Fahrenheit
    do_background_animations: false,
    change_background_color: false,
    skip_play_button: false, //not really skips, just automatically clicks it right after loading
    mofu_mofu_mode: true,
    do_enemy_onhit_animations: true,
    expo_threshold: 9,
    hide_max_level_skills: false,
    use_text_outlines_for_tooltips: true,
    use_text_outlines_for_bars: true,

    stop_crafting_on_material_change: true, //not changeable
};

let message_log_filters = {
    unlocks: true,
    events: true,
    combat: true,
    loot: true,
    crafting: true,
    background: true,
};

//holds the stack of dialogues/textlines and actions/activities
const content_stack = [];
const content_stack_removal_options = {TOP: "top", ALL: "all"};


//character name
const name_field = document.getElementById("character_name_field");
name_field.value = character.name;
name_field.addEventListener("change", () => character.name = name_field.value.toString().trim().length>0?name_field.value:"Hero");

const time_field = document.getElementById("time_div");
time_field.innerText = current_game_time.toString();

const full_stats = character.getFullStats();

function option_uniform_textsize(option) {
    //doesn't really force same textsize, just changes some variables so they match
    const checkbox = document.getElementById("options_textsize");
    if(checkbox.checked || option) {
        game_options.uniform_text_size_in_action = true;    
        document.documentElement.style.setProperty('--options_action_textsize', '20px');
    } else {
        game_options.uniform_text_size_in_action = false;
        document.documentElement.style.setProperty('--options_action_textsize', '16px');
    }

    if(option !== undefined) {
        checkbox.checked = option;
    }
}

function option_bed_return(option) {
    const checkbox = document.getElementById("options_bed_return");

    if(option !== undefined) {
        game_options.auto_return_to_bed = option;
        checkbox.checked = option;
    } else {
        game_options.auto_return_to_bed = checkbox.checked;
    }
}

function option_remember_filters(option) {
    const checkbox = document.getElementById("options_save_messagelog_settings");
    if(checkbox.checked || option) {
        game_options.remember_message_log_filters = true;
    } else {
        game_options.remember_message_log_filters = false;
    }

    if(option !== undefined) {
        checkbox.checked = option;

        if(message_log_filters.unlocks){
            document.documentElement.style.setProperty('--message_unlocks_display', 'inline-block');
        } else {
            document.documentElement.style.setProperty('--message_unlocks_display', 'none');
            document.getElementById("message_show_unlocks").classList.remove("active_selection_button");
        }

        if(message_log_filters.combat) {
            document.documentElement.style.setProperty('--message_combat_display', 'inline-block');
        } else {
            document.documentElement.style.setProperty('--message_combat_display', 'none');
            document.getElementById("message_show_combat").classList.remove("active_selection_button");
        }

        if(message_log_filters.events) {
            document.documentElement.style.setProperty('--message_events_display', 'inline-block');
        } else {
            document.documentElement.style.setProperty('--message_events_display', 'none');
            document.getElementById("message_show_events").classList.remove("active_selection_button");
        }

        if(message_log_filters.loot) {
            document.documentElement.style.setProperty('--message_loot_display', 'inline-block');
        } else {
            document.documentElement.style.setProperty('--message_loot_display', 'none');
            document.getElementById("message_show_loot").classList.remove("active_selection_button");
        }

        if(message_log_filters.crafting) {
            document.documentElement.style.setProperty('--message_crafting_display', 'inline-block');
        } else {
            document.documentElement.style.setProperty('--message_crafting_display', 'none');
            document.getElementById("message_show_crafting").classList.remove("active_selection_button");
        }

        if(message_log_filters.background) {
            document.documentElement.style.setProperty('--message_background_display', 'inline-block');
        } else {
            document.documentElement.style.setProperty('--message_background_display', 'none');
            document.getElementById("message_show_background").classList.remove("active_selection_button");
        }
    }
}

function option_combat_autoswitch(option) {
    const checkbox = document.getElementById("options_dont_autoswitch_to_combat");

    if(checkbox.checked || option) {
        game_options.disable_combat_autoswitch = true;
    } else {
        game_options.disable_combat_autoswitch = false;
    }

    if(option !== undefined) {
        checkbox.checked = option;
    }
}

function option_expo_threshold(option) {
    const input = document.getElementById("options_expo_threshold");

    game_options.expo_threshold = option || input.value || 0;

    if(option !== undefined) {
        input.value = option;
    }
    input.nextElementSibling.value = '1e'+game_options.expo_threshold;
}

function option_use_uncivilised_temperature_scale(option) {
    const checkbox = document.getElementById("options_use_uncivilised_temperature_scale");
    if(checkbox.checked || option) {
        game_options.use_uncivilised_temperature_scale = true;
    } else {
        game_options.use_uncivilised_temperature_scale = false;
    }

    if(option !== undefined) {
        checkbox.checked = option;
    }

    update_displayed_temperature();
}

function option_do_background_animations(option) {
    const checkbox = document.getElementById("options_do_background_animations");
    if(checkbox.checked || option) {
        game_options.do_background_animations = true;
    } else {
        game_options.do_background_animations = false;
        stop_background_animation();
        
        window.removeEventListener("resize", start_snow_animation);
        window.removeEventListener("resize", start_rain_animation);
        window.removeEventListener("resize", start_stars_animation);
    }

    if(option !== undefined) {
        checkbox.checked = option;
    }
}

function option_change_background_color(option) {
    const checkbox = document.getElementById("options_change_background_color");
    if(checkbox.checked || option) {
        game_options.change_background_color = true;
        set_light_based_background_color(!current_location.is_under_roof);
    } else {
        game_options.change_background_color = false;
        document.documentElement.style.setProperty('--background_opacity', 0);
    }

    if(option !== undefined) {
        checkbox.checked = option;
    }
}

function option_skip_play_button(option) {
    const checkbox = document.getElementById("options_skip_play_button");
    if(checkbox.checked || option) {
        game_options.skip_play_button = true;
    } else {
        game_options.skip_play_button = false;
    }
    
    if(option !== undefined) {
        checkbox.checked = option;
    }
}

function option_mofu_mofu_mode(option) {
    const checkbox = document.getElementById("options_mofu_mofu_mode");

    if(option !== undefined) {
        checkbox.checked = option;
    }

    if(checkbox.checked) {
        game_options.mofu_mofu_mode = true;
        global_flags.is_mofu_mofu_enabled = true;
    } else {
        game_options.mofu_mofu_mode = false;
        global_flags.is_mofu_mofu_enabled = false;
    }
}

function option_do_enemy_onhit_animations(option) {
    const checkbox = document.getElementById("options_do_enemy_onhit_animations");
    if(checkbox.checked || option) {
        game_options.do_enemy_onhit_animations = true;
    } else {
        game_options.do_enemy_onhit_animations = false;
    }
    
    if(option !== undefined) {
        checkbox.checked = option;
    }
}

function option_hide_max_level_skills(option) {
    const checkbox = document.getElementById("options_hide_max_level_skills");
    if(checkbox.checked || option) {
        game_options.hide_max_level_skills = true;
        document.documentElement.style.setProperty('--maxxed_skill_display', 'none');
    } else {
        game_options.hide_max_level_skills = false;
        document.documentElement.style.setProperty('--maxxed_skill_display', 'block');
    }
    
    if(option !== undefined) {
        checkbox.checked = option;
    }
}

function option_use_text_outlines_for_tooltips(option) {
    const checkbox = document.getElementById("options_tooltip_outline");
    if(checkbox.checked || option) {
        game_options.use_text_outlines_for_tooltips = true;
        document.documentElement.style.setProperty('--outline_white', document.documentElement.style.getPropertyValue("--outline_white_default"));
        document.documentElement.style.setProperty('--outline_black', document.documentElement.style.getPropertyValue("--outline_white_default"));
    } else {
        game_options.use_text_outlines_for_tooltips = false;
        document.documentElement.style.setProperty('--outline_white', '0');
        document.documentElement.style.setProperty('--outline_black', '0');
    }
    
    if(option !== undefined) {
        checkbox.checked = option;
    }
}

function option_use_text_outlines_for_bars(option) {
    const checkbox = document.getElementById("options_bar_outline");
    if(checkbox.checked || option) {
        game_options.use_text_outlines_for_bars = true;
        document.getElementById("character_xp_value").classList.add("outline_black_static");
        document.getElementById("character_stamina_value").classList.add("outline_black_static");
        document.getElementById("character_mana_value").classList.add("outline_black_static");
        document.getElementById("character_health_value").classList.add("outline_black_static");
    } else {
        game_options.use_text_outlines_for_bars = false;
        document.getElementById("character_xp_value").classList.remove("outline_black_static");
        document.getElementById("character_stamina_value").classList.remove("outline_black_static");
        document.getElementById("character_mana_value").classList.remove("outline_black_static");
        document.getElementById("character_health_value").classList.remove("outline_black_static");
    }
    
    if(option !== undefined) {
        checkbox.checked = option;
    }
}

function option_do_dynamic_loot_message(option) {
    const checkbox = document.getElementById("options_dynamic_message");
    clear_loot_information(); //reset it in both cases

    if(option !== undefined) {
        checkbox.checked = option;
    }

    if(checkbox.checked) {
        game_options.do_dynamic_loot_message = true;
    } else {
        game_options.do_dynamic_loot_message = false;
    }
}


/**
 * Main translation wrapper. Supports 3 text placeholders:
 * 
 * {%param(value)%}, which requires additional array of params and inserts them at specified order
 * 
 * {%translation(key)%}, which is self explanatory
 * 
 * and {%dynamic(key)%}, which dynamically selects string based on the key, requires manual setup for each (see get_dynamic_translation function);
 * intended mostly for smaller text inserts based on age/race/gender/height
 * @param {*} text_id 
 * @param {*} params
 * @returns 
 */
function translate(text_id, params = []) {    
    let text = translationManager.getText(text_id, language);
    const regex = /\{%\s*(\w+)\s*(?:\(([^)]*)\))?\s*%\}/g; //scary stuff

    text = text.replace(regex, (_, name, value) => {
        if(name === "param") {
            return params[value] ?? "";
        } else if(name === "dynamic") {
            return get_dynamic_translation(value);
        } else if(name === "translation") {
            return translationManager.getText(value, language);
        }
    });

    return text;
}

function get_dynamic_translation(key) {
    const bio = character.getBioComponent();
    if(key === "gendered playful") {
        return bio.gender === "male" ? (bio.age === "middle-aged" ? "Jii-san" : "Onii-san") : (bio.age === "middle-aged" ? "Baa-san" : "Onee-san");
    } else if(key === "HeroName") {
        return character.name;
    }
}

function update_pathing() {
    pathfinder = new Pathfinder();
    pathfinder.fill_connections(locations);
    travel_times = {};
    travel_times[current_location.id] = pathfinder.find_shortest_paths(current_location.id);
}

/**
 * Changes current_location value without triggering a full location change
 * @param {String} location_key 
 */
function change_current_location(location_key) {
    current_location = locations[location_key];
}

/**
 * 
 * @param {Object} params
 * @param {Event} params.event
 * @param {Boolean} params.skip_combat used to not call start_combat function, used in loading as it's only called after 'PLAY' button is clicked
 */
function change_location({location_id, event, skip_travel_time = false, do_quest_events = true, skip_combat = false,realm_move=false}) {
    if(!realm_move&&!restoringNativeSave&&optionalPackState.structured&&location_id!==current_location?.id&&!optionalPackState.structured.locationIds.includes(location_id)){log_message('Continue through your local routes.','notification');return;}
    if(!realm_move&&!restoringNativeSave&&Object.values(optionalPackState.packs).some(r=>r.active)&&location_id!==current_location?.id){log_message('Use Return to Village in your optional world controls.','notification');return;}
    if(!restoringNativeSave&&location_id!==current_location?.id){const reasons=causalStoryTravelReasons(expansionState,'player');if(reasons.length){log_message(reasons.join(' '),'notification');return;}}
    if(!realm_move&&!restoringNativeSave&&location_id!==current_location?.id){const reasons=backlogNativeActionReasons(expansionState,'travel');if(reasons.length){log_message(reasons.join(' '),'notification');return;}}
    if(!realm_move&&!restoringNativeSave&&location_id!==current_location?.id&&(activeProto23Visit(expansionState)||Object.values(PROTO23_LOCATIONS).includes(location_id))){log_message('Use your Proto23 visitor controls in Notebook to move or return.','notification');return;}
    if(!realm_move&&!restoringNativeSave&&location_id!==current_location?.id&&(activeMolVisit(expansionState)||Object.values(MOL_LOCATIONS).includes(location_id))){log_message('Use your Cyoria passage in Notebook to move or return.','notification');return;}
    if(!realm_move&&!restoringNativeSave&&location_id!==current_location?.id&&(activeParadiseVisit(expansionState)||Object.values(PARADISE_LOCATIONS).includes(location_id))){log_message('Use your independent-world passage in Notebook to move or return.','notification');return;}
    if(!realm_move&&!restoringNativeSave&&location_id!==current_location?.id&&(activeNestedVisit(expansionState)||Object.values(NESTED_LOCATIONS).includes(location_id))){log_message('Use the service-district passage in Notebook to walk or return.','notification');return;}
    if(!realm_move&&!restoringNativeSave&&location_id!==current_location?.id&&(activeTidemarkVisit(expansionState)||Object.values(TIDEMARK_LOCATIONS).includes(location_id))){log_message('Use the harbor passage in Notebook to walk or return.','notification');return;}
    if(!realm_move&&!restoringNativeSave&&location_id!==current_location?.id&&Object.values(expansionState.realmPrototype?.observation?.state.leases||{}).some(l=>l.status==='active')){log_message('Close the viewing slit in your Notebook before traveling.','notification');return;}
    if(!realm_move&&!restoringNativeSave&&location_id!==current_location?.id&&(current_location?.id===POCKET_LOCATION||location_id===POCKET_LOCATION&&!activeRealmVisit(expansionState))){log_message('Use the folded doorway in your Notebook to enter or return.','notification');return;}
    if(!skip_travel_time && expeditionOccupiesPlayer()) return;
    if(event?.target.classList.contains("fast_travel_removal_button")) {
        return;
    }

    const previous_location = current_location;
    let location = locations[location_id] || current_location;

    if(location_id !== current_location?.name && !location.canBeStarted(get_context())) {
        //refuse to change location if it's finished and it's not the current one
        return;
    }

    if(!skip_travel_time&&current_location&&location.id!==current_location.id&&expansionState.actors.player.facts['original_frontier.freight.introduced']){
        if(current_combat)end_combat();
        try{beginFrontierJourney(location.id);}catch(error){log_message(error.message,'notification');}
        return;
    }

    if(current_combat) {
        end_combat();
    }

    if(!location) {
        throw `No such location as "${location_id}"`;
    }

    if((optionalPackState.structured||expansionState.causalStories||expansionState.proto23Village)&&!realm_move&&!restoringNativeSave&&location.id!==current_location?.id){
        const state=structuredClone(expansionState);state.sequence++;state.simulation.people.player.location=location.id;
        persistExpansion({state,external:{money:character.money},gameplay:gameplaySnapshot(),nativeLocation:location.id,nativeEnterQuest:do_quest_events,nativePatch:{'current location':location.id}});
        return;
    }
    if(do_quest_events) {
        do_quest_event({
            quest_event_type: "enter_location",
            quest_event_target: location.id,
            quest_event_count: 1,
        });
    } 

    if(typeof current_location !== "undefined" && current_location.id !== location.id){
        //so it's not called when initializing the location on page load or on reloading current location due to new unlocks
        log_message(`[ Entering ${location.name} ]`, "message_travel");
    }

    if(location.crafting) {
        update_displayed_crafting_recipes();
    }

    clear_loot_information();
    
    if(previous_location && !skip_travel_time && expansionState.simulation?.pursuits) {
        const witnessed=recordPursuitDeparture(expansionState,previous_location.id,location.id);
        if(witnessed.changed) {
            try {persistExpansion({state:witnessed.state,external:{money:character.money},gameplay:gameplaySnapshot()});}
            catch(error) {log_message(error.message,"notification");return;}
        }
    }
    current_location = location;

    if(!pathfinder) {
        pathfinder = new Pathfinder();
        pathfinder.fill_connections(locations);
    }

    if(!travel_times[current_location.id]) {
        travel_times[current_location.id] = pathfinder.find_shortest_paths(current_location.id);
    }

    if(previous_location && !skip_travel_time) {
        progress_time({value: travel_times[previous_location.id][current_location.id], source: "travel"});
    }

    update_displayed_temperature();
    if(game_options.change_background_color) {
        set_light_based_background_color(!current_location.is_under_roof);
    }
    
    character.updateStatsAndDisplay();

    if(current_location.tags.safe_zone) { 
        update_displayed_normal_location(current_location);
    } else {
        update_displayed_combat_location(current_location);
        if(!skip_combat) {
            start_combat();
        }

        if(!current_location.is_challenge) {
            last_combat_location = current_location.id;
        }
    }

    process_rewards({rewards: current_location.entrance_rewards});
}

function handle_location_icon_click() {
    if(current_location.housing && current_location.housing.isUnlocked()) {
        return;
        //nothing
    } else if(favourite_locations[current_location.id]) {
        remove_location_from_favourites({location_id: current_location.id, update_choices: false});
    } else {
        add_location_to_favourites({location_id: current_location.id});
    }
}

/**
 * 
 * @param {Object} selected_activity - {id} of activity in Location's activities list??
 */
function customizationFromSave(save) {
    if(save.customization!=null)return validateCustomizationState(save.customization);
    const next=defaultCustomizationState();if(save.work_ledger?.settings)Object.assign(next.profiles.Default.settings,save.work_ledger.settings);return validateCustomizationState(next);
}
function refreshCustomization() {
    if(!customization)return;
    document.documentElement.dataset.effects=customization.profiles?.[customization.active]?.settings?.effects||'full'; // settings pass S3: save-level Effects caps per-browser motion
    applyCustomizationProfile(customization,{season:current_game_time.getSeason(),moduleNodes:{ledger:document.getElementById('work_ledger_panel'),crafting:document.getElementById('crafting_window'),'local-actions':document.getElementById('location_related_div'),vitals:document.getElementById('basic_character_info_div'),preparation:document.getElementById('character_div'),belongings:[document.getElementById('inventory_div'),document.getElementById('inventory_combat_switch_selection')],records:document.getElementById('journal_div'),time:document.getElementById('time_and_location'),location:document.getElementById('location_div'),skills:document.getElementById('skills_and_stances_div'),messages:document.getElementById('message_log_div'),notebook:document.getElementById('adventure_notebook'),'status-window':document.getElementById('status_window_panel'),customization:[document.getElementById('customization_host'),document.getElementById('customization_effects_host'),document.getElementById('customization_rules_host')]}});
    customizationPanel?.refresh();workLedgerAuthor?.refresh();
}
function saveCustomization(next) {
    if(!workLedgerCanWrite())throw new Error('Saving is unavailable.');
    const validated=validateCustomizationState(next),serialized=create_save();if(!serialized)throw new Error('Could not create a native save.');
    const save=JSON.parse(serialized);save.customization=validated;validateSaveEnvelope(save,game_version);
    lifeSaveStorage.setItem(is_on_dev()?dev_save_key:save_key,JSON.stringify(save));
    workLedgerCraftEffects?.cancel();workLedgerPanel?.cancel();nativeDiscoveryFeedback?.cancel();refreshCustomization();
}

function workLedgerContext(extra={}) {
    return {actorId:expansionState.actors.player.id || 'player', locationId:expansionState.actors.player.worldId==='base.frontier'?current_location?.id:'away', alive:character.is_alive===true,
        busy:!!(current_activity||current_dialogue||current_game_action||current_combat||is_sleeping||is_reading||is_in_trade()||nativeOccupationReason()),...extra};
}
export function nativeWorkLedgerChance(baseChance,category,subcategory) {return modifyWorkLedgerChance(workLedger,baseChance,workLedgerContext({category,subcategory})).value;}
export function nativeWorkLedgerQuality(baseQuality,category,subcategory,qualityCap) {return modifyWorkLedgerQuality(workLedger,baseQuality,workLedgerContext({category,subcategory,qualityCap})).value;}
function workLedgerCanWrite(){return ownsSave&&!foundationSaveBlocked&&!importProbeToken&&!expansionError&&!is_loading_error;}
function feedbackClockPauseReason() {
    if(!workLedgerCanWrite())return 'Paused until saving is restored.';
    if(expansionState.simulation?.sessions.player||waitingSimulationChoice(expansionState))return 'Waiting for your response.';
    if(backlogNativeClockPaused(expansionState))return 'Waiting for the current local situation.';
    if(expansionState.chronicle?.life.endedAt!=null)return 'This life has ended.';
    return '';
}
function publishWorkLedger(plan,anchor,onDurable) {
    if(!workLedgerCanWrite())throw new Error('Saving must be available before the Work Ledger can settle.');
    const serialized=create_save();if(!serialized)throw new Error('The Work Ledger could not create a save.');
    const save=JSON.parse(serialized);save.work_ledger=plan.state;
    validateSaveEnvelope(save,game_version);
    // Native inventory, XP and recipe outputs are included in this same envelope.
    // This existing durable owner publishes ledger state only after storage succeeds.
    lifeSaveStorage.setItem(is_on_dev()?dev_save_key:save_key,JSON.stringify(save),onDurable);
    for(const event of plan.events) {
        log_message(event.text,'crafting');
        if(anchor&&document.getElementById('crafting_window')?.contains(anchor))workLedgerCraftEffects?.present(event,{anchor});
        else workLedgerPanel?.present(event,{anchor:workLedgerPanel.panel.querySelector('.work-ledger-status')});
    }
}
function actWorkLedger(command) {
    if(!workLedgerCanWrite())throw new Error('Saving must be available before this choice.');
    publishWorkLedger(transitionWorkLedger(workLedger,command,workLedgerContext()));
}
function settleWorkLedgerCraft(evidence,anchor) {
    if(!workLedgerCanWrite())throw Error('Saving is unavailable for this craft.');
    const scope=nativeCraftScopes.at(-1),plan=observeWorkLedgerCraft(workLedger,evidence,workLedgerContext());
    publishWorkLedger(plan,anchor,scope?()=>{workLedger=plan.state;scope.transaction.markDurable();}:undefined);
}

function watchcraftKnown() {return villageCareer.watchcraft.tutorMinutes===6 || book_stats[WATCHCRAFT_BOOK].accumulated_time>=WATCHCRAFT_READING;}
// Kit resolution, manual issuance and promotion publish their saved state together.
function writeVillageCareer(choice) {
    if(!ownsSave || foundationSaveBlocked || importProbeToken || current_location?.id!=='Village' || expansionState.actors.player.worldId!=='base.frontier' || (current_activity && !(choice.startsWith('teach:') && current_activity.id==='patrolling')) || current_dialogue || current_game_action || current_combat || is_sleeping || is_reading || is_in_trade() || expeditionOccupiesPlayer())throw new Error('Finish your current work and speak to Tessa in Village.');
    const serialized=create_save();if(!serialized)throw new Error('The career ledger could not be saved.');
    const save=JSON.parse(serialized);
    if(choice==='recruit') {
        save.village_career=assignVillageRecruit(villageCareer);
        save.npc_lives=addVillageRecruit(npcLives,save['current time'].year,expansionState.rng);
    } else if(choice.startsWith('teach:') || choice==='solo' || choice==='cover') {
        const p=npcLives?.people.find(p=>p.id==='iona');
        if(!p || current_game_time.year>=p.deathYear)throw new Error('Iona is no longer available for patrol.');
        save.village_career=choice.startsWith('teach:')?beginVillageTeaching(villageCareer,watchcraftKnown(),character.name,choice.split(':')[1]):beginRecruitSolo(villageCareer,choice==='cover');
        if(choice==='teach:time'){save.current_activity.gathering_time=0;save.current_activity.earnings=0;}
    } else if(choice.startsWith('tuition:')) {
        const p=npcLives?.people.find(p=>p.id==='iona');if(!p || current_game_time.year>=p.deathYear)throw new Error('Iona is no longer available.');
        save.village_career=resolveIonaTuition(villageCareer,choice.split(':')[1]);
        if(choice==='tuition:accepted')save.character.money+=5;
    } else if(choice==='tutor') {
        save.village_career=beginTessaInstruction(villageCareer);
    } else if(choice==='notes') {
        save.village_career=issueWatchcraft(villageCareer);
        const key=item_templates[WATCHCRAFT_BOOK].getInventoryKey();
        const inventory=save.inventories.person.main_character;
        inventory[key]={count:(inventory[key]?.count || 0)+1};
    } else if(choice==='promote') {
        save.village_career=promoteVillageCareer(villageCareer);
        const t=save['current time'];
        save.life_record=appendLifeMilestone(save.life_record,{year:t.year,at:lifeCalendarMinute(t),worldId:'base.frontier',kind:'career',text:`Tessa named you a ${CAREER_RANKS[save.village_career.rank].toLowerCase()} on the Village patrol.`});
    } else {
        save.village_career=resolveVillageKit(villageCareer,choice);
        if(choice==='pay') {if(save.character.money<50)throw new Error('You need 50 coins to settle the kit debt.');save.character.money-=50;}
    }
    lifeSaveStorage.setItem(is_on_dev()?dev_save_key:save_key,JSON.stringify(save));
    if(choice==='pay')add_money_to_character(-50);
    if(choice==='tuition:accepted')add_money_to_character(5);
    if(choice==='teach:time'){current_activity.gathering_time=0;current_activity.earnings=0;}
    if(choice==='tutor'){start_activity('meditating');log_message('Tessa teaches sector scanning in person for six Village meditation minutes. No coins or book needed; leaving pauses the lesson.');}
    if(choice==='notes') {
        character.addToInventory([{item_id:WATCHCRAFT_BOOK,count:1}]);
        log_message('Tessa gives you her watchcraft notes. Read, rehearse during Village meditation, then apply the method on a new patrol with our loaned kit.');
    }
    if(choice.startsWith('tuition:'))log_message(choice==='tuition:accepted'?'You accept Iona’s offered five coins from her first solo stipend.':'You decline Iona’s tuition. She remembers your answer.');
    else if(choice.startsWith('teach:'))log_message(`You begin teaching Iona on ${choice.split(':')[1]} terms. The agreed terms are in your patrol ledger.`);
    else if(['recruit','solo','cover'].includes(choice))log_message(choice==='recruit'?'Tessa assigns Iona to your patrol.':choice==='cover'?'Iona spends one owed favor covering a two-hour shift: 50 coins on return, no player career credit.':'Iona begins a two-hour solo patrol. Stay in Village to hear her report and receive 10 coins.');
    else if(!['notes','tutor'].includes(choice))log_message(choice==='promote'?`Tessa recognizes you as ${CAREER_RANKS[villageCareer.rank]}. Your life record remembers this promotion.`:choice==='return'?'Tessa: “Lantern and baton accounted for. Thank you.”':choice==='keep'?'Tessa records a 50-coin kit debt. Return the kit or pay before your next shift.':'Tessa records your kit debt as paid.');
    villageCareerControls?.render();
}

function start_activity(selected_activity) {
    if(expeditionOccupiesPlayer()) return;
    if(!restoringNativeSave && (!ownsSave || foundationSaveBlocked || importProbeToken))return;
    if(!restoringNativeSave && current_activity)return;
    current_activity = Object.assign({},current_location.activities[selected_activity]);
    current_activity.id = selected_activity;

    if(!activities[current_activity.activity_name]) {
        throw `No such activity as ${current_activity.activity_name} could be found`;
    }

    if(activities[current_activity.activity_name].type === "JOB") {
        if(!can_work(current_activity)) {
            current_activity = null;
            return;
        }
    } else if(activities[current_activity.activity_name].type === "TRAINING") {
        if(!can_work(current_activity)) {
            current_activity = null;
            return;
        }
    } else if(activities[current_activity.activity_name].type === "GATHERING") { 
        
        let has_proper_tool = !activities[current_activity.activity_name].required_tool_type || character.getEquipment()[activities[current_activity.activity_name].required_tool_type];
        //just check if slot is not empty

        if(!has_proper_tool) {
            log_message("You need to equip a proper tool to do that!");
            current_activity = null;
            return;
        }
    } else throw `"${activities[current_activity.activity_name].type}" is not a valid activity type!`;

    if(!restoringNativeSave && current_location.id === 'Village' && selected_activity === 'patrolling') {
        try {villageCareer = beginVillageShift(villageCareer,watchcraftKnown());}
        catch(error) {log_message(error.message);current_activity=null;return;}
        log_message('Tessa loans you the patrol lantern and baton. Return them after the round, or a 50-coin debt must be recorded.');
    }
    current_activity.earnings = 0;
    current_activity.gathering_time = 0;
    current_activity.gathered_materials = {};
    current_activity.gathering_time_needed = current_activity.getActivityEfficiency().gathering_time_needed;

    add_to_content_stack({content_type: "activity", data: {activity: current_activity}});

    //start_activity_display(current_activity);
}

function end_activity() {
    if(!current_activity)return;
    const paidRoundCompleted=current_activity.earnings>0;
    if(villageTeachingBusy(villageCareer)){log_message('Finish the agreed teaching minutes before leaving this round.');return;}
    if(current_location.id === 'Village' && current_activity.id === 'patrolling' && villageCareer.loan?.status === 'active') {
        const bonus=villageShiftBonus(villageCareer,current_activity.earnings>0);
        const firstUse=bonus>0 && !villageCareer.watchcraft.used;
        const teachingStipend=villageTeachingStipend(villageCareer,current_activity.earnings>0);
        const teachingCost=villageTeachingCost(villageCareer,current_activity.earnings>0);
        villageCareer = finishVillageShift(villageCareer, current_activity.earnings > 0);
        if(teachingCost)log_message(teachingCost===60?'This full teaching shift earns no pay, as agreed.':'The post pays 10 less: teaching on your shift meant less patrol work. These are lost wages, not a fee.');
        if(bonus) {
            current_activity.earnings+=bonus;
            log_message('Your practiced watchcraft and loaned lantern and baton produced a clear patrol report: +10 coins, 60 total.');
            if(firstUse) {
                const t=current_game_time;
                lifeRecord=appendLifeMilestone(lifeRecord,{year:t.year,at:lifeCalendarMinute(t),worldId:'base.frontier',kind:'career',text:'You first used Tessa’s practiced watchcraft with the loaned lantern and baton to earn a clearer patrol report.'});
                lifeRecordPanel?.render();
            }
        }
        current_activity.earnings=Math.max(0,current_activity.earnings-teachingCost)+teachingStipend;
        if(teachingStipend)log_message('Tessa pays a 10-coin teaching stipend on top of your round. Training recruits is part of a Mentor’s job.');
        log_message('Tessa notes how your shift went. Bring back the loaned lantern and baton before taking another round.');
    }
    
    log_message(`%HeroName% stopped ${current_activity.activity_name}${activities[current_activity.activity_name].type === "JOB" && !paidRoundCompleted ? ": no paid round completed" : ""}`, "activity_finished");
    
    if(current_activity.earnings) {
        log_message(`%HeroName% earned ${format_money(current_activity.earnings)}`, "activity_money");
        add_money_to_character(current_activity.earnings);
    }

    if(current_activity.gathered_materials) {
        const loot = []; 
        Object.keys(current_activity.gathered_materials).forEach(mat_key => {
            loot.push({item_id: mat_key, count: current_activity.gathered_materials[mat_key]});
        });

        if(!game_options.do_dynamic_loot_message) {
            process_current_loot({loot_list: loot, is_summary: true});
        }
    }
    end_activity_animation(); //clears the "animation"
    current_activity = null;
    clear_loot_information();
    remove_from_content_stack(content_stack_removal_options.TOP);
}

/**
 * Starts selected action, checks conditions if applicable, launches action animations
 * @param {String} action_key
 * @param {String} source either "location" or "dialogue"
 * @returns 
 */
function start_game_action(action_key, event) {
    if(expeditionOccupiesPlayer()) return;
    current_game_action = action_key;
    let game_action;
    if(current_dialogue) {
        game_action = NPCRegistry.get(current_dialogue).getDialogueComponent().actions[action_key];
    } else{
        game_action = current_location.actions[action_key];
    }
    let conditions_status; //[0,...,1]

    add_to_content_stack({content_type:"action", data: {npc_id: current_dialogue, action_key: action_key}});
    //start_game_action_display(selected_action);

    if(!game_action.canBeStarted(get_context())) {
        finish_game_action({action_key, conditions_status: -1, dialogue_key: current_dialogue});
        return;
    }
    
    if(!game_action.check_conditions_on_finish) {
        conditions_status = game_action.getConditionsStatus(get_context());

        if(conditions_status == 0) {
            finish_game_action({action_key, conditions_status: 0, dialogue_key: current_dialogue});
            return;
        }
    }

    if(event && game_action.floating_click_effects) {
        const random_effect = game_action.floating_click_effects[Math.floor(Math.random()*game_action.floating_click_effects.length)];
        create_floating_effect(random_effect, {x: event.pageX, y: event.pageY});
    }

    if(game_action.attempt_duration > 0) {
        let current_iterations = game_action.keep_progress?game_action.accumulated_progress:0;
        const total_iterations = game_action.attempt_duration/0.1;

        //kept in a variable rather than passed inline, so the interval can be re-armed at a new speed without losing the progress
        game_action_tick = ()=>{
            if(current_iterations >= total_iterations - 1) {
                stop_game_action_interval();
                finish_game_action({action_key, conditions_status, dialogue_key: current_dialogue});
            }

            current_iterations++;
            if(game_action.keep_progress) {
                game_action.accumulated_progress = current_iterations;
            }
            update_game_action_progress_bar(current_iterations/total_iterations);
        };
        game_action_interval = setInterval(game_action_tick, game_action_period());
    } else {
        update_game_action_progress_bar(1);
        finish_game_action({action_key, conditions_status,dialogue_key: current_dialogue});
    }
}

//the action ticker's period at the current speed
function game_action_period() {
    return 1000 * 0.1 / tickrate;
}

function stop_game_action_interval() {
    clearInterval(game_action_interval);
    game_action_interval = undefined;
    game_action_tick = undefined;
}

//re-arms the running action at the current speed, used for speed changing in dev mode
function rearm_game_action_interval() {
    if(!game_action_tick) {
        return;
    }
    clearInterval(game_action_interval);
    game_action_interval = setInterval(game_action_tick, game_action_period());
}
/**
 * Handles the finish, successful or not, of a game action. Not to be mistaken for end_game_action
 * @param {String} action_key 
 * @param {Number} conditions_status
 * @param {String} dialogue_key optional, only passed if action is from dialogue instead of from location
 */
function finish_game_action({action_key, conditions_status, dialogue_key}){
    end_activity_animation(true);

    let action;
    if(dialogue_key) {
        action = NPCRegistry.get(dialogue_key).getDialogueComponent().actions[action_key];
    } else {
        action = current_location.actions[action_key];
    }

    if(typeof conditions_status === 'undefined') {
        if(dialogue_key) {
            conditions_status = NPCRegistry.get(dialogue_key).getDialogueComponent().actions[action_key].getConditionsStatus(get_context());
        } else {
            conditions_status = current_location.actions[action_key].getConditionsStatus(get_context());
        }
    }
    
    let result_message = 'If you see this, Miktaew screwed something up. Whoops!';

    if(conditions_status == -1) {
        //not meeting requirements to begin
        result_message = action.failure_texts.unable_to_begin[Math.floor(action.failure_texts.unable_to_begin.length * Math.random())];
    } else if(conditions_status == 0) {
        //lost by failing to meet conditions, nothing to check, deal with it
        result_message = action.failure_texts.conditional_loss[Math.floor(action.failure_texts.conditional_loss.length * Math.random())];
    } else {
        const action_result = get_game_action_result({action_key, conditions_status, dialogue_key});
        let is_won = false;
        if(action_result > gameRandom(STREAMS.reward, `action:${action.id || action.name}:success`)) {
            //win

            result_message = action.getSuccessText({character});
            if(!action.getAvailabilityComponent().isRepeatable()) {
                lock_action({dialogue_key, location_key: current_location.id, action_key});
            } else {
                action.completion_count++;
            }
            process_rewards({rewards: action.rewards, source_type: "action", source_name: dialogue_key || current_location.id});
            process_mixed_rewards({mixed_rewards: action.mixed_rewards, source_type: "action", source_name: dialogue_key || current_location.id});
            is_won = true;
        } else {
            //random loss

            const lines = action.failure_texts.random_loss;
            result_message = lines?.length
                ? lines[Math.floor(lines.length * Math.random())]
                : result_message;

            process_rewards({rewards: action.failure_rewards, source_type: "action", source_name: dialogue_key || current_location.id});
            process_mixed_rewards({mixed_rewards: action.mixed_failure_rewards, source_type: "action", source_name: dialogue_key || current_location.id});
        }

        const success_conditions = action.getAvailabilityComponent().success_conditions;
        const start_conditions = action.getAvailabilityComponent().start_conditions;

        Object.keys(success_conditions[0]?.items_by_id || {}).forEach(item_id => {
            //no need to check if they are in inventory, as without them action would have been conditionally failed before reaching here
            if(success_conditions[0].items_by_id[item_id].remove) {
                character.removeFromInventory([{item_key: item_templates[item_id].getInventoryKey(), item_count: success_conditions[0].items_by_id[item_id].count}]);
            }
        });
        Object.keys(start_conditions.items_by_id || {}).forEach(item_id => {
            //again no need to check
            if(start_conditions.items_by_id[item_id].remove_on_success && is_won || start_conditions.items_by_id[item_id].remove_on_fail && !is_won) {
                character.removeFromInventory([{item_key: item_templates[item_id].getInventoryKey(), item_count: start_conditions.items_by_id[item_id].count}]);
            }
        });
    }

    update_game_action_finish_button();

    if(!dialogue_key) {
        set_game_action_finish_text(result_message);
    } else {
        pass_data_down_the_content_stack({data: {upstack_result_message: result_message}});

        if(action.attempt_duration == 0) { //if action is instant, just jump back to dialogue without bothering with display of results, leave that stuff to dialogue answer
            remove_from_content_stack(content_stack_removal_options.TOP);
        }
    }
}

/**
 * Handles quitting a game action, no matter the results. Not to be mistaken for finish_game_action which deals with what happens on timer finish (and with the results)
 */
function end_game_action() {
    end_activity_animation();
    stop_game_action_interval();
    current_game_action = null;
    remove_from_content_stack(content_stack_removal_options.TOP);
}

/**
 * 
 * @param {String} action_key 
 * @param {Number} conditions_status assumed to be more than 0
 * @param {String} dialogue_key
 * @returns {Boolean} did_succeed
 */
function get_game_action_result({action_key, conditions_status, dialogue_key}) {
    let action;
    if(dialogue_key) {
        action = NPCRegistry.get(dialogue_key).getDialogueComponent().actions[action_key];
    } else {
        action = current_location.actions[action_key];
    }
    if(action.success_chances.length == 1) {
        return action.success_chances[0];
    } else if(conditions_status == 1 && action.success_chances[1]) {
        return action.success_chances[1];
    } else {
        return action.success_chances[0] + (action.success_chances[1]-action.success_chances[0]) * conditions_status;
    }
}

/**
 * @description Globally unlocks an activity and adds a proper message to the message log, local children might still need to be unlocked separately. NOT called on loading a save.
 * @param {String} activity_id
 */
function unlock_global_activity({activity_id}) {
    if(!activities[activity_id].isUnlocked()){
        activities[activity_id].setUnlocked();
        
        let message = "";
        if(activities[activity_id].unlock_text) {
           message = rtp(activities[activity_id].unlock_text)+":\n";
        }
        log_message(message + `Gained the ability of "${activities[activity_id].name}"`, "activity_unlocked");
    }
}

/**
 * @description Unlocks an activity and adds a proper message to the message log
 * @param {Object} activity_data {activity, location_name}
 */
function unlock_activity(activity_data) {
    if(!activity_data.activity.isUnlocked()){
        activity_data.activity.setUnlocked();
        
        if(!activity_data.skip_message) {
            let message = "";
            if(locations[activity_data.location].activities[activity_data.activity.activity_id].unlock_text) {
                message = locations[activity_data.location].activities[activity_data.activity.activity_id].unlock_text+":\n";
            }

            if(
                (activities[activity_data.activity.activity_name].type !== "GATHERING" || global_flags.is_gathering_unlocked) 
                && 
                activities[activity_data.activity.activity_name].isUnlocked()
                &&
                activities[activity_data.activity.activity_name].base_skills_names.filter(skill_id => skills[skill_id].isUnlocked()).length > 0
            ) {
                log_message(message + `Unlocked activity "${activity_data.activity.activity_name}" in location "${activity_data.location}"`, "activity_unlocked");
            }
        }
        
    }
}

function unlock_action(action_data) {
    if(!action_data.action.isUnlocked()) {
        action_data.action.setUnlocked();
        
        if(!action_data.skip_message) {
            let message = "";
            if(action_data.location) {
                if(locations[action_data.location].actions[action_data.action.action_id].unlock_text) {
                    message = locations[action_data.location].actions[action_data.action.action_id].unlock_text+":\n";
                    log_message(message + `Unlocked action "${action_data.action.action_name}" in location "${action_data.location}"`, "activity_unlocked");
                }
            } else if(action_data.dialogue) {
                const action = dialogues[action_data.dialogue].actions[action_data.action.action_id];
                if(action.unlock_text) {
                    message = action.unlock_text+":\n";
                    log_message(message + `Unlocked action "${action_data.action.action_name}" with "${action_data.npc}"`, "activity_unlocked");
                }
            }
        }
    }
}

function lock_action({location_key, dialogue_key, action_key}) {
    if(dialogue_key) {
        NPCRegistry.get(dialogue_key).getDialogueComponent().actions[action_key].setFinished();
    } else  {
        locations[location_key].actions[action_key].setFinished();
    }
}

function add_money_to_character(money_num) {
    character.money += money_num;
    update_displayed_money();
}

/**
 * @description Handles health change from beneficial and harmful sources
 * @param {Object} params
 * @param {Number} params.ammount 
 * @param {Boolean} params.add_xp 
 * @param {Number} params.xp_to_add skippable
 * @returns 
 */
function update_health({ammount_to_restore = 0, ammount_to_loose = 0, add_xp = true} = {}) {

    if(!ammount_to_restore && !ammount_to_loose) {
        //no change, nothing to do
        return;
    }

    //actual change: smaller between missing and balance of lose/restoration
    const actual_health_change = Math.min(full_stats.max_health - full_stats.health, ammount_to_restore-ammount_to_loose);
    //actual healing: smaller between missing+lose and restoration
    const actual_healing_done = Math.min(full_stats.max_health - full_stats.health + ammount_to_loose, ammount_to_restore);

    //anything changed - update health and display
    if(actual_health_change) {
        full_stats.health += actual_health_change;

        update_displayed_health();
    }

    //anything actually healed - add xp
    if(actual_healing_done && add_xp && actual_healing_done > 0) {
        add_xp_to_skill({skill: skills["Regeneration"], xp_to_add: actual_healing_done});
    }

    //out of hp - set hp to 0, kill
    if(full_stats.health <= 0) {
        full_stats.health = 0;
        kill_player({is_combat: "parent_location" in current_location});
    }
}

//single tick of resting
function do_resting() {
    if(full_stats.health < full_stats.max_health) {
        const resting_heal_ammount = furnitureRecovery(readFurnitureBonuses(),  Math.round(Math.max(full_stats.max_health * 0.01, 2) * (1 + 3*character.getTotalSkillLevel("Regeneration")/skills["Regeneration"].max_level)));

        update_health({ammount_to_restore: resting_heal_ammount});
    }

    if(full_stats.stamina < full_stats.max_stamina) {
        const resting_stamina_ammount = furnitureRecovery(readFurnitureBonuses(), Math.round(Math.max(full_stats.max_stamina/120, 2)));
        //todo: scale it with skill as well

        full_stats.stamina += (resting_stamina_ammount);
        if(full_stats.stamina > full_stats.max_stamina) {
            full_stats.stamina = full_stats.max_stamina;
        } 
        
        update_displayed_stamina();
    }
}

function do_sleeping() {
    if(full_stats.health < full_stats.max_health) {
        const sleeping_heal_ammount = furnitureRecovery(readFurnitureBonuses(), Math.round(Math.max(full_stats.max_health * 0.04, 5) * (1 + character.getTotalSkillLevel("Sleeping")/skills["Sleeping"].max_level) * (1 + 3*character.getTotalSkillLevel("Regeneration")/skills["Regeneration"].max_level)));
        
        update_health({ammount_to_restore: sleeping_heal_ammount});
    }

    if(full_stats.stamina < full_stats.max_stamina) {
        const sleeping_stamina_ammount = furnitureRecovery(readFurnitureBonuses(), Math.round(Math.max(full_stats.max_stamina/30, 5) * (1 + character.getTotalSkillLevel("Sleeping")/skills["Sleeping"].max_level)));

        full_stats.stamina += (sleeping_stamina_ammount);
        if(full_stats.stamina > full_stats.max_stamina) {
            full_stats.stamina = full_stats.max_stamina;
        } 
        update_displayed_stamina();
    }
}

function start_sleeping() {
    if(expeditionOccupiesPlayer()) return;
    start_sleeping_display();
    is_sleeping = true;
    pursuitPanel?.render();

    last_location_with_bed = current_location.id;
}

function end_sleeping() {
    is_sleeping = false;
    pursuitPanel?.render();
    change_location({location_id: current_location.id, skip_travel_time: true});
    end_activity_animation();
}

function start_reading(book_key) {
    if(expeditionOccupiesPlayer()) return;
    
    const book_id = is_JSON(book_key)?JSON.parse(book_key).id:book_key;
    if(current_location?.tags.combat_zone) {
        return; //no reading in combat areas
    }

    if(is_reading === book_id) {
        end_reading();
        return; 
        //reading the same one, cancel
    } else if(is_reading) {
        end_reading();
    }

    if(item_templates[book_id].isFinished()) {
        return; //already read
    }

    if(is_sleeping) {
        end_sleeping();
    }
    if(current_activity) {
        end_activity();
    }


    is_reading = book_id;
    start_reading_display(book_id);

    update_displayed_book(is_reading);
}

function end_reading() {
    change_location({location_id: current_location.id, skip_travel_time: true});
    end_activity_animation();
    
    const book_id = is_reading;
    is_reading = null;

    update_displayed_book(book_id);
}

function do_reading() {
    item_templates[is_reading].addProgress();

    update_displayed_book(is_reading);
    const book = book_stats[is_reading];
    add_xp_to_skill({skill: skills["Literacy"], xp_to_add: book.literacy_xp_rate});

    if(item_templates[is_reading].isFinished()) {
        log_message(`Finished the book "${is_reading}"`);
        update_booklist_entry(is_reading, true);
        end_reading();

        character.addBookBonus(book.bonuses);
        character.updateStatsAndDisplay();
        process_rewards({rewards: book.rewards});
    }
}

function get_current_book() {
    return is_reading;
}


/**
 * processes rewards and logs all necessary messages
 * @param {Object} rewards_data
 * @param {Object} rewards_data.rewards //the standard object with rewards
 * @param {String} rewards_data.source_type //location, gameAction, textline
 * @param {Boolean} rewards_data.is_first_clear //exclusively for location rewards (and only for a single message to be logged)
 * @param {Boolean} rewards_data.inform_overall //if unlocks are to be logged
 * @param {Boolean} rewards_data.inform_textline //if textline unlock is to be logged (requires inform_overall to also be true)
 * @param {String} rewards_data.source_name //in case it's needed for logging a message
 * @param {Boolean} rewards_data.only_unlocks //processes only unlock-type rewards (skips money, item, etc; doesn't skip rep)
 */
function process_rewards({rewards = {}, source_type, source_name, is_first_clear, inform_overall = true, inform_textline = true, only_unlocks = false, is_from_loading = false}) {
   
    if(!is_from_loading && rewards.chance != null && !(gameRandom(STREAMS.reward, `reward:${source_type}:${source_name}`) < rewards.chance)) {
        return;
    }

    let was_any_location_availability_changed = false;
    let is_current_location_reload_needed = false;
    if(rewards.messages && !is_from_loading) {
        for(let i = 0; i < rewards.messages.length; i++) {
            nativeCraftMessage(rewards.messages[i]);
        }
    }

    if(rewards.money && typeof rewards.money === "number" && !only_unlocks) {
        if(inform_overall) {
            nativeCraftMessage(`%HeroName% earned ${format_money(rewards.money)}`);
        }
        add_money_to_character(rewards.money);
    }

    if(rewards.xp && typeof rewards.xp === "number" && !only_unlocks) {
        if(source_type === "location") {
            if(inform_overall) {
                if(is_first_clear) {
                    nativeCraftMessage(`Obtained ${rewards.xp}xp for clearing ${source_name} for the first time`, "location_reward");
                } else {
                    nativeCraftMessage(`Obtained additional ${rewards.xp}xp for clearing ${source_name}`, "location_reward");
                }
            }
        } else {
            //other sources
            nativeCraftMessage(`Gained ${rewards.xp}xp`, "location_reward");
        }
        add_xp_to_character(rewards.xp);
    }

    if(rewards.skill_xp && !only_unlocks) {
        Object.keys(rewards.skill_xp).forEach(skill_key => {
            if(typeof rewards.skill_xp[skill_key] === "number") {
                if(inform_overall) {
                    nativeCraftMessage(`%HeroName% gained ${rewards.skill_xp[skill_key]}xp to ${skills[skill_key].getName()}`);
                }
                add_xp_to_skill({skill: skills[skill_key], xp_to_add: rewards.skill_xp[skill_key], cap_gained_xp: false});
            }
        });
    }

    if(rewards.items && !only_unlocks) {
        for(let i = 0; i < rewards.items.length; i++) {
            const entry = rewards.items[i];
            const is_bare_name = typeof entry === "string";
            const item_id = is_bare_name ? entry : entry.item;
            const template = item_templates[item_id];

            if(!template) {
                console.error(`No such item as "${item_id}" - reward skipped.`);
                continue;
            }

            const count = is_bare_name ? 1 : (entry.count || 1);
            const quality = is_bare_name ? undefined : entry.quality;

            const item = quality ? getItem({...template, quality}) : template;

            nativeCraftMessage(`%HeroName% obtained "${item.getName()} x${count}"`);
            character.addToInventory([{item_key: item.getInventoryKey(), count}]);
            if(!is_from_loading)observeFortAcquisition(item_id,count,source_type==="location"?"clear":"contact",source_name||source_type||"native.reward",source_name||"Received native reward");
        }
    }

    if(rewards.active_effects && !only_unlocks) {
        Object.keys(rewards.active_effects).forEach(effect_key => {
            nativeCraftMessage(`%HeroName% obtained became subjected to ${effect_templates[effect_key].name}`);
            add_active_effect(effect_key, rewards.active_effects[effect_key]);
        });
    }
    
    if(rewards.locations) {
        for(let i = 0; i < rewards.locations.length; i++) {
            was_any_location_availability_changed = 
                unlock_location({location: locations[rewards.locations[i].location], skip_message: (inform_overall && rewards.locations[i].skip_message || is_from_loading)}) 
                || was_any_location_availability_changed;
                
        }
    }

    if(rewards.flags) {
        for(let i = 0; i < rewards.flags.length; i++) {
            const flag = global_flags[rewards.flags[i]];
            global_flags[rewards.flags[i]] = true;
            if(!flag && flag_unlock_texts[rewards.flags[i]] && inform_overall) {
                nativeCraftMessage(`${flag_unlock_texts[rewards.flags[i]]}`, "activity_unlocked");
            }
        }
    }

    if(rewards.textlines) {
        for(let i = 0; i < rewards.textlines.length; i++) {
            let any_unlocked = false;
            
            const dialogue = dialogues[rewards.textlines[i].dialogue || rewards.textlines[i].npc];
            for(let j = 0; j < rewards.textlines[i].lines.length; j++) {
                if(!dialogue.textlines[rewards.textlines[i].lines[j]].isUnlocked()) {
                    any_unlocked = true;
                    dialogue.textlines[rewards.textlines[i].lines[j]].setUnlocked();
                }
            }

            if(any_unlocked && inform_textline && inform_overall && !rewards.textlines[i].skip_message && source_name !== rewards.textlines[i].dialogue && dialogue_owners[dialogue.name]) {
                nativeCraftMessage(`You should talk to ${NPCRegistry.get(dialogue_owners[dialogue.name]).getName({is_mofu_mofu_enabled: global_flags.is_mofu_mofu_enabled})}`, "dialogue_unlocked");
                //maybe do this only when there's just 1 dialogue with changes?
            }
        }
    }

    if(rewards.npcs) {
        for(let i = 0; i < rewards.npcs?.length; i++) {
            const npc = NPCRegistry.get(rewards.npcs[i].npc);
            if(!npc.isUnlocked()) {
                npc.setUnlocked();
                if(!rewards.npcs[i].skip_message) {
                    nativeCraftMessage(`You can now interact with ${npc.name}`, "activity_unlocked");
                }
            }
        }
    }

    if(rewards.dialogues) {
        for(let i = 0; i < rewards.dialogues?.length; i++) {
            const dialogue = dialogues[rewards.dialogues[i]]
            if(!dialogue.isUnlocked()) {
                dialogue.setUnlocked();
                nativeCraftMessage(`You can now talk with ${dialogue.name}`, "activity_unlocked");
            }
        }
    }

    if(rewards.traders) { 
        for(let i = 0; i < rewards.traders.length; i++) {
            const trader = traders[rewards.traders[i].trader];
            if(!trader.isUnlocked()) {
                trader.setUnlocked();
                if(!rewards.traders[i].skip_message) {
                    if(trader.getUnlockMessage()) {
                        nativeCraftMessage(trader.getUnlockMessage(), "activity_unlocked");
                    } else {
                        nativeCraftMessage(`You can now trade with ${trader.name}`, "activity_unlocked");
                    }
                }
            }
        }
    }

    if(rewards.housing) {
        for(let i = 0; i < rewards.housing.length; i++){
            locations[rewards.housing[i]].housing.setUnlocked();

            if(favourite_locations[rewards.housing[i]]) {
                //unfavourite the location as it will be added to fast travel anyways due to having housing=true
                remove_location_from_favourites({location_id: rewards.housing[i]});
            }
        }
    }

    if(rewards.crafting) {
        for(let i = 0; i < rewards.crafting.length; i++) {
            locations[rewards.crafting[i]].crafting.setUnlocked();
            nativeCraftMessage(`You can now use a crafting station in ${locations[rewards.crafting[i]].name}`, "activity_unlocked");
        }
    }

    if(rewards.global_activities) {
        for(let i = 0; i < rewards.global_activities?.length; i++) {
            unlock_global_activity({activity_id: rewards.global_activities[i]});
        }
    }

    if(rewards.activities) {
        for(let i = 0; i < rewards.activities?.length; i++) {
            if(!locations[rewards.activities[i].location].activities[rewards.activities[i].activity].tags?.gathering || global_flags.is_gathering_unlocked) {

                unlock_activity({location: locations[rewards.activities[i].location].name, 
                                activity: locations[rewards.activities[i].location].activities[rewards.activities[i].activity],
                                skip_message: is_from_loading,
                            });

            }
        }
    }

    if(rewards.actions) {
        for(let i = 0; i < rewards.actions?.length; i++) {
            if(rewards.actions[i].dialogue) {
                const dialogue = dialogues[rewards.actions[i].dialogue];
                unlock_action({
                                dialogue: dialogue.name,
                                action: dialogue.actions[rewards.actions[i].action],
                                skip_message: is_from_loading,
                            });
            } else if(rewards.actions[i].location){
                unlock_action({
                                location: locations[rewards.actions[i].location]?.name,
                                action: locations[rewards.actions[i].location].actions[rewards.actions[i].action],
                                skip_message: is_from_loading,
                            });
            }
        }
    }

    if(rewards.stances) {  
        for(let i = 0; i < rewards.stances.length; i++) {
            unlock_combat_stance(rewards.stances[i]);
        }
    }

    if(rewards.skills) {
        for(let i = 0; i < rewards.skills.length; i++) {
            if(!skills[rewards.skills[i]].isUnlocked()) {
                
                skills[rewards.skills[i]].setUnlocked();
                create_new_skill_bar(skills[rewards.skills[i]]);
                update_displayed_skill_bar(skills[rewards.skills[i]], false);
                if(inform_overall) {
                    nativeCraftMessage(`Unlocked new skill: ${skills[rewards.skills[i]].getName()}`);
                }

                if(source_type === "skill") {
                    if(!which_skills_affect_skill[rewards.skills[i]]) {
                        which_skills_affect_skill[rewards.skills[i]] = [];
                    }

                    if(skills[source_name]) {
                        which_skills_affect_skill[rewards.skills[i]].push(source_name);
                        //shouldn't cause issues, as it will only trigger on skill unlocks by other skills
                    } else {
                        console.error(`Tried to register skill "${source_name}" as related to "${rewards.skills[i]}", but the former does not exist!`);
                    }
                }

                //update all related skills; may be none if unlock was not from another skill, so need to check with '?'
                for(let j = 0; j < which_skills_affect_skill[rewards.skills[i]]?.length; j++) {
                    update_displayed_skill_bar(skills[which_skills_affect_skill[rewards.skills[i]][j]], false);
                }
            }
        }
    }

    if(rewards.recipes) {
        for(let i = 0; i < rewards.recipes.length; i++) {
            if(!recipes[rewards.recipes[i].category][rewards.recipes[i].subcategory][rewards.recipes[i].recipe_id].isUnlocked()) {
                recipes[rewards.recipes[i].category][rewards.recipes[i].subcategory][rewards.recipes[i].recipe_id].setUnlocked();
                if(inform_overall) {
                    nativeCraftMessage(`Unlocked new recipe: ${recipes[rewards.recipes[i].category][rewards.recipes[i].subcategory][rewards.recipes[i].recipe_id].name}`);
                }
            }
        }
    }

    if(rewards.quests) {
        for(let i = 0; i < rewards.quests.length; i++) {
            if(!questManager.isQuestActive(rewards.quests[i]) && !questManager.isQuestFinished(rewards.quests[i])) {
                questManager.startQuest({quest_id: rewards.quests[i]});
                if(inform_overall) {
                    //nativeCraftMessage(`Received a new quest: ${quests[rewards.quests[i]].getQuestName()}`);
                    //already done in quests
                }
            }
        }
    }

    if(rewards.quest_progress) {
        for(let i = 0; i < rewards.quest_progress.length; i++) {
            const quest_id = rewards.quest_progress[i].quest_id;
            const task_index = rewards.quest_progress[i].task_index;
            if(task_index == quests[quest_id].getCompletedTaskCount()) {
                if(quests[quest_id]?.quest_tasks[task_index]) {
                    questManager.finishQuestTask({quest_id: quest_id, task_index: task_index, skip_warning: true});
                } else {
                    console.warn(`Tried to complete ${task_index}'th task for quest '${quest_id}', but either quest or index does not exist!`);
                }
            }
        }
    }

    if(rewards.locks) {
        if(rewards.locks.textlines) {
            Object.keys(rewards.locks.textlines).forEach(dialogue_key => {
                const dialogue = dialogues[dialogue_key];
                for(let i = 0; i < rewards.locks.textlines[dialogue_key].length; i++) {
                    dialogue.textlines[rewards.locks.textlines[dialogue_key][i]].setLocked();
                }
            });
        }
        if(rewards.locks.npcs) {
            for(let i = 0; i < rewards.locks.npcs.length; i++) {
                NPCRegistry.get(rewards.locks.npcs[i]).setLocked();
                if(current_location.npcs.includes(rewards.locks.npcs[i])) {
                    is_current_location_reload_needed = true;
                }
            }
        }
        if(rewards.locks.locations) {
            for(let i = 0; i < rewards.locks.locations.length; i++) {
                was_any_location_availability_changed = lock_location({location: locations[rewards.locks.locations[i]]}) || was_any_location_availability_changed;
            }
        }

        if(rewards.locks.quests) {
            for(let i = 0; i < rewards.locks.quests.length; i++) {
                questManager.finishQuest({quest_id: rewards.locks.quests[i], skip_rewards: true})
            }
        }
        if(rewards.locks.actions) {
            for(let i = 0; i < rewards.locks.actions.length; i++) {
                lock_action({
                            dialogue_key: rewards.locks.actions[i].dialogue,
                            location_key: rewards.locks.actions[i].location,
                            action_key: rewards.locks.actions[i].action
                        });
            }
        }
    }

    if(rewards.reputation) {
        Object.keys(rewards.reputation).forEach(region => {
            if(shouldReplayReputation(region, loadingReputationTotals)) {
                ReputationManager.add_reputation({region, reputation: rewards.reputation[region]});
            }
        });
        update_displayed_reputation();
    }

    if(was_any_location_availability_changed && !is_from_loading) {
        update_pathing();
        //shouldn't need any display updates
    }

    if(rewards.move_to && !only_unlocks) {
        if(source_type !== "action") {
            change_location({location_id: rewards.move_to.location});
        } else {
            //changes the current_location without breaking the action display (finishing it will trigger location reload anyway)
            change_current_location(rewards.move_to.location);
        }
    } else if(is_current_location_reload_needed) {
        change_location({location_id: current_location.id});
    }
}

/**
 * 
 * @param {Object} rewards_data
 * @param {Array} rewards_data.mixed_rewards [{chance_to_be_in_mix, rewards: [Rewards]}]
 */
function process_mixed_rewards({mixed_rewards, source_type, source_name, is_first_clear, inform_overall = true, inform_textline = true}) {
    const arr = mixed_rewards.rewards_array;

    const total_rewards = {};

    for(let i = 0; i < arr.length; i++) {
        if(arr[i].chance_to_be_in_mix != null && !(gameRandom(STREAMS.reward, `mix:${source_type}:${source_name}:${i}:include`) < arr[i].chance_to_be_in_mix)) {
            continue;
        }

        const selected_rewards = arr[i].possible_rewards[gameRandomRange(STREAMS.reward, `mix:${source_type}:${source_name}:${i}:pick`,0, arr[i].possible_rewards.length-1)];

        if(selected_rewards.money) {
            total_rewards.money = (total_rewards.money || 0) + selected_rewards.money;
        }

        if(selected_rewards.xp) {
            total_rewards.xp = (total_rewards.xp || 0 ) + selected_rewards.xp;
        }

        if(selected_rewards.skill_xp) {
            if(!total_rewards.skill_xp) {
                total_rewards.skill_xp = {};
            }
            Object.keys(selected_rewards.skill_xp).forEach(skill_id => {
                total_rewards.skill_xp = (total_rewards.skill_xp || 0)  + selected_rewards.skill_xp[skill_id];
            });
        }

        if(selected_rewards.items) {
            if(!total_rewards.items) {
                total_rewards.items = [];
            }
            for(let i = 0; i < selected_rewards.items.length; i++) {
                if(typeof selected_rewards.items[i] === "string") {
                    total_rewards.items.push(selected_rewards.items[i]);
                } else {
                    let found = false;
                    for(let j = 0; j < total_rewards.items.length; j++) {
                        if(typeof total_rewards.items[j] === "string") {
                            continue;
                        } else {
                            if(total_rewards.items[j].item === selected_rewards.items[i].item && total_rewards.items[j].quality === selected_rewards.items[i].quality) {
                                found = true;
                                total_rewards.items[j].count = (total_rewards.items[j].count || 1) + (selected_rewards.items[i].count || 1);
                            }
                        }
                    }
                    if(!found) {
                        total_rewards.items.push(selected_rewards.items[i]);
                    }
                }
            }
        }

        //effect durations are summed
        if(selected_rewards.active_effects) {
            if(!total_rewards.active_effects) {
                total_rewards.active_effects = {};
            }
            Object.keys(selected_rewards.active_effects).forEach(effect_id => {
                total_rewards.active_effects[effect_id] = total_rewards.active_effects[effect_id] ?? 0;
                total_rewards.active_effects[effect_id] += selected_rewards.active_effects[effect_id];
            });
        }

        //unlocks can just be processed here since there's nothing to sum up anyway
        process_rewards({
            rewards: selected_rewards,
            source_type, source_name, is_first_clear, inform_overall, inform_textline, only_unlocks: true, is_from_loading: false,
        });
        
    }
    
    //non-unlock rewards get processed together because it looks better in message log; unlocks will go through it again, but won't do anything new
    process_rewards({
        rewards: total_rewards,
        source_type, source_name, is_first_clear, inform_overall, inform_textline, only_unlocks: false, is_from_loading: false,
    });
}


/**
 * 
 * @param {*} selected_activity location activity property (job or training)
 * @returns if current time is within working hours
 */
function can_work(selected_activity) {
    //if can start at all
    if(!selected_activity.infinite) {
        if(selected_activity.availability_time){
            if(selected_activity.availability_time.end > selected_activity.availability_time.start) {
                //ends on the same day
                if(current_game_time.hour * 60 + current_game_time.minute > selected_activity.availability_time.end*60
                    ||  //too late
                    current_game_time.hour * 60 + current_game_time.minute < selected_activity.availability_time.start*60
                    ) {  //too early
                    
                    return false;
                }
                if(!selected_activity.availability_seasons?.includes(current_game_time.getSeason())) {
                    //can't be done in current season
                    return false;
                }  
            } else { //ends on the next day (i.e. working through the night)
                if(!selected_activity.availability_seasons?.includes(current_game_time.getSeason(1))) {
                    //ends on new season during which it's not available
                    return false;
                }  

                if(current_game_time.hour * 60 + current_game_time.minute > selected_activity.availability_time.start*60
                    //too late
                    ||
                    current_game_time.hour * 60 + current_game_time.minute < selected_activity.availability_time.end*60
                    //too early

                ) {  
                    return false;
                }
            }
        } else {
            if(!selected_activity.availability_seasons?.includes(current_game_time.getSeason())) {
                //can't be done in current season
                return false;
            }  
        }
    }

    return true;
}

/**
 * 
 * @param {} selected_job location job property
 * @returns if there's enough time to earn anything
 */
function enough_time_for_earnings(selected_job) {

    if(!selected_job.infinite) {
        //if enough time for at least 1 working period
        if(selected_job.availability_time.end > selected_job.availability_time.start) {
            //ends on the same day
            if(current_game_time.hour * 60 + current_game_time.minute + selected_job.gathering_time_needed - selected_job.gathering_time%selected_job.gathering_time_needed > selected_job.availability_time.end*60
                ||  //not enough time left for another work period
                current_game_time.hour * 60 + current_game_time.minute < selected_job.availability_time.start*60
                ) {  //too early to start (shouldn't be allowed to start and get here at all)
                return false;
            }
        } else {
            //ends on the next day (i.e. working through the night)
  
            if(!selected_job.availability_time.includes(current_game_time.getSeason(1))) {
                //ends on new season during which it's not available
                return false;
            } 

            if(current_game_time.hour * 60 + current_game_time.minute > selected_job.availability_time.start*60
                //timer is past the starting hour, so it's the same day as job starts
                && 
                current_game_time.hour * 60 + current_game_time.minute + selected_job.working_period  - selected_job.gathering_time%selected_job.gathering_time_needed > selected_job.availability_time.end*60 + 24*60
                //time available on this day + time available on next day are less than time needed
                ||
                current_game_time.hour * 60 + current_game_time.minute < selected_job.availability_time.start*60
                //timer is less than the starting hour, so it's the next day
                &&
                current_game_time.hour * 60 + current_game_time.minute + selected_job.working_period  - selected_job.gathering_time%selected_job.gathering_time_needed > selected_job.availability_time.end*60
                //time left on this day is not enough to finish
                ) {  
                return false;
            }
        }
    }

    return true;
}

/**
 * 
 * @param {String} npc_id 
 */
function start_dialogue(npc_id) {
    if(expeditionOccupiesPlayer())return;
    add_to_content_stack({content_type: "dialogue", data: {npc_id: npc_id}});
}

function end_dialogue() {
    current_dialogue = null;
    remove_from_content_stack(content_stack_removal_options.TOP);
}

function reload_normal_location() {
    update_displayed_normal_location(current_location);
    furniturePanel?.render();localLifePanel?.render();fortControls?.render();pacingPanel?.render();pacingStatusPanel?.render();durabilityPanel?.render();elementalPanel?.render();
}

/**
 * 
 * @param {String} textline_key 
 */
function start_textline(textline_key){
    if(!restoringNativeSave&&expeditionOccupiesPlayer())return;
    const dialogue = NPCRegistry.get(current_dialogue).getDialogueComponent();
    const textline = dialogue.textlines[textline_key];

    process_rewards({rewards: textline.rewards, source_type: "textline", inform_textline: false, source_name: current_dialogue})

    if(textline.otherUnlocks) {
        textline.otherUnlocks();
    }

    
    //start_dialogue(current_dialogue);
    let text = get_textline_answer(textline);

    //a very stupid easter egg that totally won't be annoying - 1% chance to have a random word in dialogue replaced with "rat" if your hero's name contains that word
    if(character.isRat()) {
        if(Math.random() <= 0.01) {
            const words = text.split(" ");
            const index = Math.floor(words.length * Math.random());
            words[index] = "rat";
            text = words.join(" ");
        }
    }

    if(textline.branches_into?.length) {
        fill_action_box({content_type: "dialogue_branch", data: {text: text, npc_id: current_dialogue, textlines: textline.branches_into}});
    } else {
        fill_action_box({content_type: "dialogue_answer", data: {text: text, npc_id: current_dialogue}});
    }
}

/**
 * Attaches some context to textline's .getText()
 * @param {Textline} textline 
 * @returns textline answer
 */
function get_textline_answer(textline) {
    return textline.getText({
            season: current_game_time.getSeason(),
            //to be expanded with more stuff when needed
        });
}

/**
 * 
 * @returns context for condition processing
 */
// Read-only eligibility shared by native crafting and its optional UI filter.
export function canConsumeNativeCraftingItem(key) {
    if(nativeOccupationReason()) return false;
    try {
        assertNativeItemDisposition(expansionState, key);
        return true;
    } catch {
        return false;
    }
}

function get_context() {
    return {
        character,
        current_game_time,
        season: current_game_time.getSeason(),
        global_flags,
        height_values,
        playable_races,
        locations,
        quests
    }
}

function unlock_combat_stance(stance_id) {
    if(!stances[stance_id]) {
        console.warn(`Tried to unlock stance "${stance_id}", but no such stance exists!`);
        return;
    }

    if(!stances[stance_id].isUnlocked()) {
        log_message(`You have learned a new stance: "${stances[stance_id].name}"`, "location_unlocked");
    }
    stances[stance_id].setUnlocked();
    update_displayed_stance_list(current_stance);
}

function change_stance({stance_id, is_temporary = false}) {
    if(!restoringNativeSave){const reasons=backlogNativeActionReasons(expansionState,'combat');if(reasons.length){log_message(reasons.join(' '),'notification');return;}}
    if(expansionState.chronicle?.session || expansionState.chronicle?.life.endedAt != null) return;
    if(is_temporary) {
        if(!stances[stance_id]) {
            throw new Error(`No such stance as "${stance_id}"`);
        }
        if(!stances[stance_id].isUnlocked()) {
            throw new Error(`Stance "${stance_id}" is not yet unlocked!`);
        }

    } else {
        selected_stance = stances[stance_id];
        update_displayed_stance(selected_stance);
    }
    
    current_stance = stances[stance_id];

    character.updateStatsAndDisplay();
    if(current_combat && !current_combat.is_special_combat) {
        current_combat.resetCombatLoops(true); //param will be used to award 'Persistence' xp only when change was due to low stamina and not to a player click
        update_displayed_fighters_stats();
    }
}

/**
 * @description handle faving/unfaving of stances
 * @param {String} stance_id 
 */
function fav_stance(stance_id) {
    if(faved_stances[stance_id]) {
        delete faved_stances[stance_id];
    } else if(stances[stance_id].isUnlocked()){
        faved_stances[stance_id] = true;
    } else {
        console.warn(`Tried to fav a stance '${stance_id}' despite it not being unlocked!`);
    }
    update_displayed_faved_stances();
}

/**
 * @description sets attack cooldowns and new enemies, either from provided list or from current location, called whenever a new enemy group starts
 * @param {List<Enemy>} enemies 
 */
function set_new_combat({enemies} = {}) {

    if(current_combat) {
        end_combat();
    }

    if(!current_location.get_next_enemies){
        return;
    }

    const savedEncounter = pendingNativeEncounter?.locationId === current_location.id ? pendingNativeEncounter : null;
    pendingNativeEncounter = null;
    if(savedEncounter && !enemies) {
        enemies=savedEncounter.enemies.map(row=>{
            const e=new Enemy({...enemy_templates[row.template],stats:{...row.stats}});
            e.init();Object.assign(e.getFullStats(),row.full);e.is_alive=row.alive;
            e.rngKey=row.key;e.encounterKey=savedEncounter.key;e.templateKey=row.template;return e;
        });
    }
    enemies ||= current_location.get_next_enemies();

    current_combat = new Combat({attackers: [character], defenders: enemies, savedEncounter});
    // A durable technique observation can occur after the last kill but before
    // the zone clear. Resume that boundary without awarding the kill twice.
    if(savedEncounter && !enemies.some(e=>e.is_alive)) {finish_combat_round(false);return;}
    current_combat.start();
}

function start_combat() {
    if(current_combat == null) {
        if(expeditionOccupiesPlayer())return;
        set_new_combat();
        pursuitPanel?.render();
        knownRoutesPanel?.render();adventureNotebook?.render();
    }
}

function finish_combat_round(was_special_combat) {
    // CH1: the native combat calls this only after the player wins.
    awakenOptionalStart(true);
    // Clear rewards may move the player. Retain the defeated zone for its event.
    const cleared_location=current_location;
    if(!was_special_combat){
        const contribution=recordOriginalFrontierEncounter(expansionState,campaignContext(),cleared_location.id,cleared_location.enemy_groups_killed+1);
        if(contribution)persistExpansion(contribution);
    }
    cleared_location.enemy_groups_killed += 1;
    if(cleared_location.enemy_groups_killed > 0 && cleared_location.enemy_groups_killed % cleared_location.enemy_count == 0) {
        get_location_rewards(cleared_location);

        if(!was_special_combat) {
            do_quest_event({
                quest_event_type: "clear",
                quest_event_target: cleared_location.id,
                quest_event_count: 1,
            });
        }
    }
    if(current_location?.tags.combat_zone)update_location_kill_count(current_location);
    set_new_combat();
}

/**
 * sets enemy to dead, disabled their attack, checks if that was the last enemy in group
 * @param {Enemy} enemy 
 * @return {Boolean} if that was the last of an enemy group
 */
function kill_target({target_index, fighter_index, is_target_an_attacker, do_quest_events = true, is_special_combat}) {
    //target is the one getting killed, fighter is the one attacking the target
    const target = is_target_an_attacker ? current_combat.attackers[target_index] : current_combat.defenders[target_index];
    const fighter = is_target_an_attacker ? current_combat.defenders[fighter_index] : current_combat.attackers[fighter_index];

    if(target.tags.main_character) {
        console.error("Main character was designed as a target of kill_target()!");

    }
    
    target.is_alive = false;
    update_displayed_health_of_fighter({fighter_index: target_index, is_attacker: is_target_an_attacker});

    // Enemies are defenders since the combat rewrite (hero attacks), so count kills of defenders.
    if(target.add_to_bestiary && !is_target_an_attacker && !is_special_combat) {
        if(enemy_killcount[target.name]) {
            enemy_killcount[target.name] += 1;
            update_bestiary_entry_killcount(target.name);
        } else {
            enemy_killcount[target.name] = 1;
            create_new_bestiary_entry(target.name);
        }
    }

    if(fighter.tags.main_character && do_quest_events && !is_special_combat) {
        do_quest_event({
            quest_event_type: "kill",
            quest_event_target: target.id,
            quest_event_count: 1,
        });

        Object.keys(target.tags || {}).forEach(tag => {
            do_quest_event({
                quest_event_type: "kill_any",
                quest_event_target: tag,
                quest_event_count: 1,
            });
        })
    }
    if(fighter.tags.main_character && !is_special_combat && target.get_loot && ownsSave && !expansionError && !foundationSaveBlocked) {
        const observed = observeNativeTechnique(expansionState, expeditionRegistry, "player", target.name);
        if(observed) {
            try {
                persistExpansion({state: observed, external: {money: character.money}, gameplay: gameplaySnapshot()});
                log_message(`Observed ${target.name}'s footwork. Read the Technique notebook in Village.`, "notification");
            } catch(error) {log_message("Technique observation could not be saved: " + error.message, "message_critical");}
        }
    }

}

function kill_player({is_combat = true}) {
    if(is_combat) {
        game_stats.total_deaths++;
        log_message("%HeroName% has lost consciousness", "hero_defeat");

        update_displayed_health();
        if(game_options.auto_return_to_bed && last_location_with_bed&&(!optionalPackState.structured||optionalPackState.structured.locationIds.includes(last_location_with_bed))) {
            change_location({location_id: last_location_with_bed});
            start_sleeping();
        } else {
            change_location({location_id: current_location.parent_location.id});
        }
    }

    add_active_effect("Recovering", 2);
}

function use_stamina({stamina_to_use = 1, skip_persistence_xp_for_stance_change = false}) {

    //todo: move to hero?
    
    full_stats.stamina -= stamina_to_use/(full_stats.stamina_efficiency || 1);

    if(full_stats.stamina < 0)  {
        full_stats.stamina = 0;
    }

    if(full_stats.stamina < 1) {

        //double the gain if hp under 20%
        if(full_stats.health/full_stats.max_health < 0.2) {
            stamina_to_use *= 2;
        }
        for(let i = 0; i < cold_status_effects.length; i++) {
            if(active_effects[cold_status_effects[i]]) {
                stamina_to_use *= (1.19**i); //~x2 at i==4
            }
        }

        if(!skip_persistence_xp_for_stance_change) {
            add_xp_to_skill({skill: skills["Persistence"], xp_to_add: stamina_to_use});
        }
        update_displayed_stats();
    }

    update_displayed_stamina();
}

/**
 * adds xp to skills, handles their levelups and tooltips
 * @param skill - skill object 
 * @param {Number} xp_to_add 
 * @param {Boolean} should_info 
 * @returns {Boolean}
 */
function add_xp_to_skill({skill, xp_to_add = 1, should_info = true, use_bonus = true, add_to_parent = true, cap_gained_xp = true, is_from_loading = false, do_quest_events = true})
{
    if(!skill.canGainXP(get_context())) {
        return;
    }

    if(!is_from_loading && use_bonus) xp_to_add *= lifeLearningMultiplier(expansionState.chronicle);
    if(!is_from_loading && !restoringNativeSave && use_bonus) xp_to_add *= furnitureSkillMultiplier(readFurnitureBonuses(), skill.skill_id);

    if(!is_from_loading&&!restoringNativeSave)xp_to_add*=getPacingEffects(homePacingContext()).efficiency;
    let {leveled, prev_name, new_name, was_hidden, message, unlocks} = character.addXPToSkill({skill, xp_to_add, should_info, use_bonus, add_to_parent, cap_gained_xp, is_from_loading, do_quest_events});

    const is_visible = skill.visibility_treshold <= skill.getTotalXP();

    if(was_hidden && is_visible) {
        //skill only now became visible, so it needs to be added to display
        create_new_skill_bar(skill);
        update_displayed_skill_bar(skill, false);
        
        if(typeof should_info === "undefined" || should_info) {
            nativeCraftMessage(`Unlocked new skill: ${skill.getName()}`, "skill_raised");
        }
        if(!is_from_loading && !restoringNativeSave && nativeSkillDiscovery(skill,character)) {
            const event={type:'native-skill-discovery',id:skill.skill_id,settled:true};
            const scope=nativeCraftScopes.at(-1);
            if(scope)(scope.discoveries ||= []).push(event);
            else nativeDiscoveryFeedback?.publish(event);
        }
    } 
    
    if(is_visible) {
        if(prev_name !== new_name) { //skill name has changed; this may trigger on levelup OR on becoming visible
            if(which_skills_affect_skill[skill.skill_id]) {
                for(let i = 0; i < which_skills_affect_skill[skill.skill_id].length; i++) {
                    update_displayed_skill_bar(skills[which_skills_affect_skill[skill.skill_id][i]], false);
                }
            }

            Object.keys(booklist_entry_divs).forEach(book_id => {
                //update anthology entry
                const bonuses = book_stats[book_id]?.bonuses?.xp_multipliers || {};
                if(bonuses[skill.skill_id]) {
                    update_booklist_entry(book_id, true);
                }
            });
            Object.keys(character.getItems()).forEach(inv_key => {
                //update equippable/useable/book item
                const item = getItemFromKey(inv_key);
                if(item.tags.usable) {
                    const effects = item.effects;
                    for(let i = 0; i < effects.length; i++) {
                        if(effect_templates[effects[i].effect].effects?.bonus_skill_levels?.[skill.skill_id]) {
                            update_displayed_character_inventory({item_key: inv_key});
                            return;
                        }
                    }
                } else if(item.tags.book) {
                    const bonuses = book_stats[item.id]?.bonuses?.xp_multipliers || {};
                    if(bonuses[skill.skill_id]) {
                        update_displayed_character_inventory({item_key: inv_key});
                    }
                } else if(item.tags.equippable) {
                    const bonuses = item.getBonusSkillLevels();
                    if(bonuses[skill.skill_id]) {
                        update_displayed_character_inventory({item_key: inv_key});
                    }
                }
            });
            Object.keys(character.getEquipment()).forEach(eq_slot => {
                //update equipped item
                if(!character.getEquipment()[eq_slot]) {
                    return;
                }
                const bonuses = character.getEquipment()[eq_slot].getBonusSkillLevels(); {
                    if(bonuses[skill.skill_id]) {
                        update_displayed_equipment();
                        update_displayed_character_inventory({equip_slot: eq_slot});
                    }
                }
            });
        }

        if(typeof message !== "undefined"){ 
        //not undefined => levelup happened and levelup message was returned
            leveled = true;

            update_displayed_skill_bar(skill, true);

            if(typeof should_info === "undefined" || should_info)
            {
                character.updateStatsAndDisplay();
            }

            if(typeof skill.get_effect_description !== "undefined")
            {
                update_displayed_skill_description(skill);
            }

            if(skill.is_parent) {
                update_all_displayed_skills_xp_gain();
            } else {
                update_displayed_skill_xp_gain(skill);
            }

            //no point doing any checks for optimization
            update_displayed_stamina_efficiency();
            
            process_rewards({source_name: skill.skill_id, source_type: "skill", rewards: unlocks, inform_overall: should_info});
            
            if(typeof should_info === "undefined" || should_info){
                nativeCraftMessage(message, "skill_raised");
            }

            if(prev_name !== new_name) { //skill name has changed
                //display of skill name in other places (like tooltips of other skills) is handled slightly earlier
                if(!was_hidden && (typeof should_info === "undefined" || should_info)) {
                    nativeCraftMessage(`Skill ${prev_name} upgraded to ${new_name}`, "skill_raised");
                }

                if(current_location?.connected_locations && !current_activity) {
                    Object.keys(current_location.activities).forEach(activity_key => {
                        if(activities[current_location.activities[activity_key].activity_name].base_skills_names.includes(skill.skill_id)) {
                            update_gathering_tooltip(current_location.activities[activity_key]);
                        }
                    });
                }

                update_displayed_effects();
                //a bit lazy, but there shouldn't ever be enough to have any performance impact
            }

            if(speed_modifiers_from_skills[skill.skill_id] && !is_from_loading) {
                //check if skill affects any travel times, update pathing if so
                pathfinder = new Pathfinder();
                pathfinder.fill_connections(locations);
                travel_times = {};
                travel_times[current_location.id] = pathfinder.find_shortest_paths(current_location.id);
                //shouldn't need any display updates
            }

            if(tags_for_droprate_modifier_skills[skill.skill_id]) { 
                //this skill affects some droprates, so bestiary update is required
                
                //go through enemy types that were killed, check if relevant tag is present, update related display if so
                Object.keys(enemy_killcount).forEach(enemy_id => {
                    if(enemy_templates[enemy_id].tags[tags_for_droprate_modifier_skills[skill.skill_id]]) {
                        //update_bestiary_entry(enemy_id);
                        update_bestiary_entry_tooltip(enemy_id);
                    }
                });
            }

            if(do_quest_events) {
                questManager.catchQuestEvent({
                    quest_event_type: "reach_skill",
                    quest_event_target: skill.skill_id,
                    quest_event_count: skill.getCurrentLvl(),
                });
            }
        } else {
            update_displayed_skill_bar(skill, false);
        }
    } else {
        //
    }

    return leveled;
}

/**
 * adds xp to character, handles levelups
 * @param {Number} xp_to_add 
 * @param {Boolean} should_info 
 */
function add_xp_to_character(xp_to_add, should_info = true, use_bonus) {
    if(!restoringNativeSave)xp_to_add*=getPacingEffects(homePacingContext()).efficiency;
    const level_up = character.addXP({xp_to_add, use_bonus});
    
    if(level_up) {
        if(should_info) {
            log_message(level_up, "level_up");
        }
        
        full_stats.health = full_stats.max_health; //free healing on level up, because it's a nice thing to have
        character.updateStatsAndDisplay();
    }

    update_displayed_character_xp(level_up);
}

/**
 * @param {Location} location game Location object
 * @description handles all the rewards for clearing location (both first and subsequent clears), adding xp and unlocking stuff
 */
function get_location_rewards(location) {

    let should_return = false;

    if(location.enemy_groups_killed == location.enemy_count || location.is_challenge) { //first clear

        if(location.is_challenge) {
            lock_location({location, challenge_self_lock: true});
        }
        should_return = true;
        
        if(location.first_reward) {
            process_rewards({rewards: location.first_reward, source_type: "location", source_name: location.name, is_first_clear: true, source_id: location.id});
        }
    } else if(location.repeatable_reward.xp && typeof location.repeatable_reward.xp === "number") {
        process_rewards({rewards: {xp: location.repeatable_reward.xp}, source_type: "location", source_name: location.name, is_first_clear: false, source_id: location.id});
    }

    if(location.rewards_with_clear_requirement) {
        for(let i = 0; i < location.rewards_with_clear_requirement.length; i++) {
            if(location.enemy_groups_killed == location.enemy_count * location.rewards_with_clear_requirement[i].required_clear_count)
            {
                //only once, on N-th clear
                process_rewards({rewards: location.rewards_with_clear_requirement[i], source_type: "location", source_name: location.name, is_first_clear: false, source_id: location.id});
            }
        }
    }

    //calls in first clear give xp, this call omits xp to avoid repeating it
    //repeatable rewards are indeed intended to be called on first clear as well (with the exception of xp, duh)
    process_rewards({rewards: {...location.repeatable_reward, xp: null}, source_type: "location", source_name: location.name, is_first_clear: false, source_id: location.id});

    if(location.otherUnlocks) {
        location.otherUnlocks();
    }

    //return if need be; additional check in case it was already performed by rewards
    if(should_return && current_location?.tags.combat_zone) {
        change_location({location_id: current_location.parent_location.id}); //go back to parent location, only on first clear
    }
}

/**
 * Performs logging of provided loot
 * @param {*} param0 
 */
function process_current_loot({loot_list, is_combat, is_summary}) {
    current_loot.recent = {};

    loot_list.forEach(loot_list_entry => {
        if(!is_summary)observeFortAcquisition(loot_list_entry.item_id||getItemFromKey(loot_list_entry.item_key).id,loot_list_entry.count,is_combat?"drop":"gather",current_location.id,current_location.name);
        const key = loot_list_entry.item_id || loot_list_entry.item_key;

        current_loot.recent[key] = {item_id: loot_list_entry.item_id, item_key: loot_list_entry.item_key, item_count: loot_list_entry.count};
        
        if(!current_loot.total[key] && loot_list_entry.count) {
            current_loot.total[key] = {item_id: loot_list_entry.item_id, item_key: loot_list_entry.item_key, item_count: loot_list_entry.count};
        } else {
            current_loot.total[key].item_count += loot_list_entry.count;
        }
    });
    
    log_loot({loot_list: current_loot, is_combat, is_dynamic: game_options.do_dynamic_loot_message, is_a_summary: is_summary && !game_options.do_dynamic_loot_message});
}

function clear_loot_information() {
    //called whenever changing a location or stopping an activity
    current_loot.recent = {};
    current_loot.total = {};
    unassign_dynamic_loot_message();
}

/**
 * 
 * @param location game location object 
 * @returns whether it was actually unlocked (false meaning it was already available before)
 */
function unlock_location({location, skip_message}) {
    let was_unlocked = false;
    if(!location.isUnlocked()){
        location.setUnlocked();
        was_unlocked = true;
        if(!skip_message) {
            const message = location.unlock_text || `Unlocked location "${location.name}"`;
            log_message(message, "location_unlocked");
        }

        //reloads the current location just in case it needs the new unlock to be added to current display
        //current action check most probably unnecessary
        if(current_location && !current_dialogue && !current_game_action) {
            change_location({location_id: current_location.id, skip_travel_time: true});
        }
    }

    if(location.housing?.isUnlocked()) {
        unlocked_beds[location.id] = true;
    }

    return was_unlocked;
}

/**
 * 
 * @param {*} param0 
 * @returns whether it was actually locked (false meaning it was already locked before)
 */
function lock_location({location, challenge_self_lock = false}) {
    let was_locked = false;
    if(favourite_locations[location.id]) {
        delete favourite_locations[location.id];
        if(!challenge_self_lock) {
            remove_fast_travel_choice({location_id: location.id});
        }
    }

    if(!location.isLocked()) {
        was_locked = true;
        location.setLocked();
    }
    if(last_combat_location === location.id) {
        last_combat_location = null;
    }

    return was_locked;
}

function add_location_to_favourites({location_id}) {
    if(favourite_locations[location_id]) {
        console.warn(`Tried to favourite location "${locations[location_id].name}" despite it already being in favourites`);
        return;
    }

    favourite_locations[location_id] = true;
    update_location_icon();
}

function remove_location_from_favourites({location_id, update_choices = true}) {
    if(!favourite_locations[location_id]) {
        console.warn(`Tried to unfavourite location "${locations[location_id].name}" despite it not being in favourites`);
        return;
    }

    delete favourite_locations[location_id];
    update_location_icon();
    if(update_choices) {
        remove_fast_travel_choice({location_id});
    }
}

function end_combat() {
    if(current_combat) {
        current_combat.end();
        current_combat = null;
    }
}

function nativeCraftMessage(...args){
    const scope=nativeCraftScopes.at(-1);
    if(scope)scope.messages.push(args);else log_message(...args);
}
function use_recipe(target, amount=1){
    const kind=target?.parentNode?.parentNode?.dataset.crafting_subcategory;
    if(!['items','components'].includes(kind))return execute_native_recipe(target,amount);
    if(expeditionOccupiesPlayer()||!workLedgerCanWrite())return;
    let scope;
    try {
        const transaction=beginNativeCraftTransaction({owners:[expansionState.streams,character,character.getItems(),character.getLevelableComponent(),item_log,game_stats,global_flags,availabilities,
            ...Object.values(skills).map(skill=>skill.getAvailabilityComponent()),which_skills_affect_skill,favourite_consumables,favourite_items,favourite_locations,active_effects,
            ...nativeCraftQuestOwners(quests,active_quests)],
            bindings:[{get:()=>fortSupply,set:v=>{fortSupply=v;}},{get:()=>workLedger,set:v=>{workLedger=v;}},
                {get:()=>pathfinder,set:v=>{pathfinder=v;}},{get:()=>travel_times,set:v=>{travel_times=v;}},{get:()=>current_location,set:v=>{current_location=v;}}]});
        scope={transaction,messages:[]};nativeCraftScopes.push(scope);
        return execute_native_recipe(target,amount);
    }catch(error){
        if(scope?.transaction.status==='pending'){
            try {scope.transaction.rollback();}catch(restoreError){
                foundationSaveBlocked=true;
                log_message('Craft could not be restored. Reload the last saved game. '+restoreError.message,'notification');return;
            }
            try {
                character.updateStatsAndDisplay();update_displayed_character_inventory();update_displayed_item_log();
                for(const skill of Object.values(skills))update_displayed_skill_bar(skill);
                update_displayed_crafting_recipes();update_item_recipe_visibility();update_item_recipe_tooltips();
                workLedgerPanel?.render();
            }catch(renderError){console.warn('Restored craft display needs refresh.',renderError);}
            finally {log_message('Craft was not saved. Materials, output, XP and rule expenditure were restored. '+error.message,'notification');}
        }else log_message((scope?.transaction.status==='durable'?'Craft was saved; its display could not refresh. ':'Craft could not begin. ')+error.message,'notification');
    }finally{
        if(scope){
            nativeCraftScopes.pop();
            if(scope.transaction.status==='durable') {
                for(const args of scope.messages)log_message(...args);
                for(const event of scope.discoveries || [])nativeDiscoveryFeedback?.publish(event);
            }
        }
    }
}
function execute_native_recipe(target, ammount_wanted_to_craft = 1) {
    if(expeditionOccupiesPlayer() || !workLedgerCanWrite()) return;
    workLedgerCraftEffects?.gesture();

    const category = target.parentNode.parentNode.dataset.crafting_category;
    const subcategory = target.parentNode.parentNode.dataset.crafting_subcategory;
    const recipe_id = target.parentNode.dataset.recipe_id;
    const station_tier = accessoryCraftingTiers(current_location, undefined, global_flags.is_crafting_unlocked)[category];
    if(!station_tier) {nativeCraftMessage('This place no longer supports that crafting station.','notification');return;}

    if(!category || !subcategory || !recipe_id) {
        //shouldn't be possible to reach this
        throw new Error(`Tried to use a recipe but either category, subcategory, or recipe id was not passed: ${category} - ${subcategory} - ${recipe_id}`);
    } else if(!recipes[category][subcategory][recipe_id]) {
        //shouldn't be possible to reach this
        throw new Error(`Tried to use a recipe that doesn't exist: ${category} -> ${subcategory} -> ${recipe_id}`);
    } else {
        const selected_recipe = seededRecipe(recipes[category][subcategory][recipe_id],()=>gameRandom(STREAMS.craft, `recipe:${recipe_id}:quality`));
        const recipe_div = document.querySelector(`[data-crafting_category="${category}"][data-crafting_subcategory="${subcategory}"] [data-recipe_id="${recipe_id}"]`);
        try {
            if(subcategory === "items") {
                const {materials} = selected_recipe.get_availability();
                for(const group of materials) for(const entry of group.items) assertNativeItemDisposition(expansionState,entry.item.getInventoryKey());
            } else {
                for(const choice of recipe_div.querySelectorAll(".selected_component, .selected_material")) if(choice.dataset.item_key) assertNativeItemDisposition(expansionState,choice.dataset.item_key);
            }
        } catch(e) {nativeCraftMessage(e.message,"notification");return;}

        let leveled = false;
        let xp_to_add;
        if(subcategory === "items") {
            const { available_ammount, materials } = selected_recipe.get_availability();    //TODO check, using new method
            let ammount_that_can_be_crafted = Math.min(ammount_wanted_to_craft, available_ammount);

            let attempted_crafting_ammount = ammount_that_can_be_crafted; //ammount that will be attempted (e.g. 100)
            let successful_crafting_ammount; //ammount that will succeed (e.g. 100 * 75.6% success = 75.6 -> 75 + 60% for another 1)
            //all 3 are 'crafting actions', not result counts

            if(ammount_that_can_be_crafted > 0) { 
                const chanceBefore=selected_recipe.get_success_chance(station_tier);
                const success_chance = modifyWorkLedgerChance(workLedger,chanceBefore,workLedgerContext({category,subcategory})).value;
                let {result_id, count} = selected_recipe.getResult();

                const scale_results = selected_recipe.scale_results && count > 1;

                const recipe_skill = skills[selected_recipe.recipe_skill];

                const needed_xp = (recipe_skill.getTotalXPToNextLvl() - recipe_skill.getTotalXP()) || Infinity;
                //const xp_per_craft = get_recipe_xp_value({category, subcategory, recipe_id});
                const xp_per_craft = Math.min(recipe_skill.getXPToNextLvl()*config.crafting_skill_xp_gains_cap, get_recipe_xp_value({category, subcategory, recipe_id})*character.getSkillXPGain(recipe_skill.skill_id)*furnitureSkillMultiplier(readFurnitureBonuses(), recipe_skill.skill_id));
                const estimated_xp_per_craft = xp_per_craft * success_chance;
                const needed_crafts = Math.ceil(needed_xp/estimated_xp_per_craft);
                
                attempted_crafting_ammount = Math.min(needed_crafts, ammount_that_can_be_crafted);
                successful_crafting_ammount = Math.floor(attempted_crafting_ammount*success_chance);
                
                //chance to get 1 more if it was not an integer
                const variable_craft = gameRandom(STREAMS.craft, `recipe:${recipe_id}:success-round`)<(attempted_crafting_ammount*success_chance - successful_crafting_ammount)?1:0;
                successful_crafting_ammount += variable_craft;
                
                //const current_gained_xp = (attempted_crafting_ammount-1)*estimated_xp_per_craft + (variable_craft?xp_per_craft:(xp_per_craft/4));
                const current_gained_xp = (successful_crafting_ammount + (attempted_crafting_ammount-successful_crafting_ammount)/4)*xp_per_craft;
                let success = 0;
                let fail = 0;
                
                if(attempted_crafting_ammount < ammount_that_can_be_crafted && current_gained_xp < needed_xp) {
                    //if more can be crafted and failed to get enough for a levelup, try to make up to 3 more (since it's 1/4th per fail and there's already 1 fail)
                    for(let i = 0; i < 2 && attempted_crafting_ammount+success+fail < ammount_that_can_be_crafted; i++) {
                        
                        if(gameRandom(STREAMS.craft, `recipe:${recipe_id}:attempt`)<success_chance) {
                            success++;
                        } else {
                            fail++;
                        }
                        
                        if((current_gained_xp + xp_per_craft*(success+fail/4)) >= needed_xp) {
                            break;
                        }
                    }
                    attempted_crafting_ammount += success + fail;
                    successful_crafting_ammount += success;
                }

                xp_to_add = current_gained_xp + xp_per_craft*(success+fail/4);

                game_stats.total_crafting_attempts += attempted_crafting_ammount;
                game_stats.total_crafting_successes += successful_crafting_ammount;

                //remove used materials
                for (let i = 0; i < selected_recipe.materials.length; i++) {
                    let to_remove = selected_recipe.materials[i].count * attempted_crafting_ammount;

                    for (let j = 0; j < materials[i].items.length && to_remove > 0; j++) {
                        const removed = Math.min(materials[i].items[j].count, to_remove);
                        const key = materials[i].items[j].item.getInventoryKey();

                        character.removeFromInventory([{ item_key: key, item_count: removed }]);

                        to_remove -= removed;
                    }
                }

                const final_result_count =  count * successful_crafting_ammount; 
                //recipe is either full success or full fail

                const fuzzy_result = count * attempted_crafting_ammount * success_chance;
                const fuzzy_final_result_count = Math.floor(fuzzy_result) + (gameRandom(STREAMS.craft, `recipe:${recipe_id}:partial-round`)<(fuzzy_result - Math.floor(fuzzy_result))?1:0);
                //recipe can be a partial success; ignores successful_crafting_ammount for crafting gains but still uses it for xp as of now
 
                const final_count = scale_results ? fuzzy_final_result_count : final_result_count;

                if(final_count) {
                    character.addToInventory([{item_key: item_templates[result_id].getInventoryKey(), count: final_count}]);
                    observeFortAcquisition(result_id,final_count,"craft",selected_recipe.id,selected_recipe.name);
                    let msg = `Created ${item_templates[result_id].getName()}`;
                    if(attempted_crafting_ammount > 1 || scale_results) {
                        msg+=` [${final_count} out of ${count*attempted_crafting_ammount}]`;
                    } else {
                        msg+= ` x${final_count}`;
                    }
                    nativeCraftMessage(msg, "crafting");
                } else {
                    let msg = `Failed to create ${item_templates[result_id].getName()}`;
                    if(attempted_crafting_ammount > 1 || scale_results) {
                        msg+=` [0 out of ${count*attempted_crafting_ammount}]`;
                    } else {
                        msg+= ` x${count*attempted_crafting_ammount}`;
                    }
                    nativeCraftMessage(msg, "crafting");
                }

                leveled = add_xp_to_skill({skill: recipe_skill, xp_to_add: xp_to_add, cap_gained_xp: false, use_bonus: false});
                //no cap, as it was already capped; skip bonus as it was already added
                Object.keys(item_templates[result_id].tags).forEach(tag => {
                    const skill_id = crafting_tags_to_skills[tag];
                    if(skill_id) {
                        let leveled = add_xp_to_skill({skill: skills[skill_id], xp_to_add: xp_to_add/2, cap_gained_xp: true, use_bonus: false});
                        //cap, as it's assumed to not be a crafting skill; skip bonus as it was already added
                        if(leveled) {
                            character.addActiveEffectBonus(active_effects);
                            character.updateStatsAndDisplay();
                            Object.keys(character.getItems()).forEach(item_key => {
                                if(character.getItems()[item_key].item.tags.medicine) {
                                    //update display if medicine skill leveled up, as it would affect tooltips
                                    update_displayed_character_inventory({item_key});
                                }
                            });
                        }
                    }
                });
                
                settleWorkLedgerCraft({sequence:workLedger.sequence+1,category,subcategory,recipeId:recipe_id,attempts:attempted_crafting_ammount,successes:successful_crafting_ammount,outputs:final_count,outputLabel:item_templates[result_id].getName(),chanceBefore,chanceAfter:success_chance},recipe_div);
                if(attempted_crafting_ammount < ammount_that_can_be_crafted) {
                    use_recipe(target, ammount_that_can_be_crafted - attempted_crafting_ammount);
                }
                
                update_item_recipe_visibility();
                update_item_recipe_tooltips();
                
                if(leveled) {
                    //reload all recipe tooltips of matching category, except it's kinda pointless if reload happens anyway?
                }
            } else {
                console.warn(`Tried to use a recipe without having enough materials!`);
            }
            
        } else if(subcategory === "components" || selected_recipe.recipe_type === "component" || selected_recipe.recipe_type === "componentless" ) {
            //either component, clothing, or componentless
            //read the selected material, pass it as param

            const material_div = recipe_div.children[1].querySelector(".selected_material");
            if(!material_div) {
                return;
            } else {
                const material_1_key = material_div.dataset.item_key;
                const {id} = JSON.parse(material_1_key);
                const recipe_material = selected_recipe.materials.find(x => x.material_id === id);
                if(!recipe_material || !character.getItems()[material_1_key]) {
                    nativeCraftMessage("This material is no longer available for the selected recipe. Choose it again.", "notification");
                    return;
                }

                if(recipe_material.count <= character.getItems()[material_1_key]?.count) {

                    const recipe_skill = skills[selected_recipe.recipe_skill];
                    let ammount_that_can_be_crafted = Math.min(ammount_wanted_to_craft, Math.floor(character.getItems()[material_1_key].count/recipe_material.count));
                    let needed_xp = recipe_skill.getTotalXPToNextLvl() - recipe_skill.getTotalXP();
                    let accumulated_xp = 0;
                    let crafted_items = {};
                    let crafted_count = 0;
                    const all_crafted = {};
                    const result = selected_recipe.getResult(character.getItems()[material_1_key].item, station_tier);
                    let ledgerQuality;

                    let quality;

                    for(let i = 0; i < ammount_that_can_be_crafted; i++) {
                        //loop for every item to be crafted, as they differ in quality and resultingly in xp too
                        const result_tier = result.component_tier ?? result.item_tier;
                        const qualityBefore=selected_recipe.roll_quality(station_tier - result_tier);
                        quality = modifyWorkLedgerQuality(workLedger,qualityBefore,workLedgerContext({category,subcategory,qualityCap:selected_recipe.get_quality_cap()})).value;
                        if(!ledgerQuality || (ledgerQuality.qualityAfter===ledgerQuality.qualityBefore && quality>qualityBefore))ledgerQuality={qualityBefore,qualityAfter:quality,qualityCap:selected_recipe.get_quality_cap()};

                        crafted_items[quality] = (crafted_items[quality]+1 || 1);
                        all_crafted[quality] = (all_crafted[quality]+1 || 1);
                        crafted_count++;

                        accumulated_xp += Math.min(
                            recipe_skill.getXPToNextLvl()*config.crafting_skill_xp_gains_cap, 
                            get_recipe_xp_value({category, subcategory, recipe_id, material_count:recipe_material.count, result_tier: result_tier, rarity_multiplier: rarity_multipliers[getItemRarity(quality)]})* character.getSkillXPGain(recipe_skill.skill_id)*furnitureSkillMultiplier(readFurnitureBonuses(), recipe_skill.skill_id)
                        );
                        if(accumulated_xp  >= needed_xp) {
                            const qualities = Object.keys(crafted_items).map(x => Number(x)).sort((a,b)=>b-a);
                            const highest_qual = qualities[0];

                            if(crafted_count > 1) {
                                nativeCraftMessage(`Created ${result.getName()} x${crafted_count} [highest quality: ${highest_qual}% x${crafted_items[highest_qual]}] (+${Math.floor(accumulated_xp)} xp)`, "crafting");
                            } else {
                                nativeCraftMessage(`Created ${result.getName()} [${highest_qual}% quality] x1 (+${Math.floor(accumulated_xp)} xp)`, "crafting");
                            }

                            add_xp_to_skill({skill: recipe_skill, xp_to_add: accumulated_xp, cap_gained_xp: false, use_bonus: false});

                            crafted_items = {};
                            crafted_count = 0;
                            accumulated_xp = 0;
                            needed_xp = recipe_skill.getTotalXPToNextLvl() - recipe_skill.getTotalXP();
                        }
                    }
                    game_stats.total_crafting_attempts+=ammount_that_can_be_crafted;
                    game_stats.total_crafting_successes+=ammount_that_can_be_crafted;

                    if(crafted_count > 0) {
                        const qualities = Object.keys(crafted_items).map(x => Number(x)).sort((a,b)=>b-a);
                        const highest_qual = qualities[0];

                        if(crafted_count > 1) {
                            nativeCraftMessage(`Created ${result.getName()} x${crafted_count} [highest quality: ${highest_qual}% x${crafted_items[highest_qual]}] (+${Math.floor(accumulated_xp)} xp)`, "crafting");

                        } else {
                            nativeCraftMessage(`Created ${result.getName()} [${highest_qual}% quality] x1 (+${Math.floor(accumulated_xp)} xp)`, "crafting");
                        }
                        add_xp_to_skill({skill: recipe_skill, xp_to_add: accumulated_xp, cap_gained_xp: false, use_bonus: false});
                    }

                    //grab key, modify it with proper quality value, add (together with count) to list for adding to inv
                    const result_key = result.getInventoryKey();
                    const parsed_key = JSON.parse(result_key);
                    const crafted_qualities = Object.keys(all_crafted).map(x => Number(x));
                    const to_add = [];
                    for(let i = 0; i < crafted_qualities.length; i++ ) {
                        const new_key = JSON.stringify({...parsed_key, quality: crafted_qualities[i]});
                        to_add.push({item_key: new_key, count: all_crafted[crafted_qualities[i]]});
                    }
                    character.addToInventory(to_add);

                    //remove used mats
                    character.removeFromInventory([{item_key: material_1_key, item_count: recipe_material.count*ammount_that_can_be_crafted}]);
                    settleWorkLedgerCraft({sequence:workLedger.sequence+1,category,subcategory,recipeId:recipe_id,attempts:ammount_that_can_be_crafted,successes:ammount_that_can_be_crafted,outputs:to_add.reduce((n,r)=>n+r.count,0),outputLabel:result.getName(),...ledgerQuality},recipe_div);

                    //update display
                    material_div.classList.remove("selected_material");
                    if(character.getItems()[material_1_key]) { 
                        //if item is still present in inventory + if there's not enough of it = change recipe color
                        if(recipe_material.count > character.getItems()[material_1_key].count) { 
                            material_div.classList.add("recipe_unavailable");
                        }
                    } else {
                        material_div.remove();
                    }
                    
                    update_displayed_material_choice({category, subcategory, recipe_id, refreshing: true});
                    update_displayed_crafting_recipes();
                } else {
                    console.log("Tried to create an item without having necessary materials");
                }
            }
            
        } else if (subcategory === "equipment") {
            let ammount_that_can_be_crafted = ammount_wanted_to_craft;
            const comp = [];
            const component_keys = {};

            //read the selected components, pass them as params
            for (var i = 0; i < selected_recipe.components.length; i++) {
                const component_1_key = recipe_div.children[1].children[i].children[1].querySelector(".selected_component")?.dataset.item_key;
                if(!component_1_key) {
                    return;
                }
                if(!character.getItems()[component_1_key] || !character.getItems()[component_1_key].count) {
                    //a probably unnecessary check to see if they are actually in inventory
                    //no need to check how many there is as crafting always takes only 1
                    throw new Error(`Tried to create item with components that are not present in the inventory!`);
                }

                ammount_that_can_be_crafted = Math.min(ammount_that_can_be_crafted, character.getItems()[component_1_key].count);
                comp.push(character.getItems()[component_1_key]);
                component_keys[component_1_key] = true;
            }

            const recipe_skill = skills[selected_recipe.recipe_skill]; //should always be "Crafting" but who knows what changes in the future?
            let needed_xp = recipe_skill.getTotalXPToNextLvl() - recipe_skill.getTotalXP();
            let accumulated_xp = 0;
            let crafted_items = {};
            let crafted_count = 0;
            const all_crafted = {};
            const result = selected_recipe.getResult(comp, station_tier);

            let quality;

            const component_stats = get_component_stats(comp);

            const comp_quality_weighted = component_stats.weighted_quality;
            const comp_tier_max = component_stats.max_tier;

            for(let i = 0; i < ammount_that_can_be_crafted; i++) {
                quality = selected_recipe.roll_quality(comp_quality_weighted, station_tier-comp_tier_max);

                crafted_items[quality] = (crafted_items[quality]+1 || 1);
                all_crafted[quality] = (all_crafted[quality]+1 || 1);
                crafted_count++;

                accumulated_xp += Math.min(
                    recipe_skill.getXPToNextLvl(), 
                    get_recipe_xp_value({category, subcategory, recipe_id, selected_components: comp, rarity_multiplier: rarity_multipliers[getItemRarity(quality)]})*character.getSkillXPGain(recipe_skill.skill_id)*furnitureSkillMultiplier(readFurnitureBonuses(), recipe_skill.skill_id)
                );
                            
                if(accumulated_xp >= needed_xp) {
                    const qualities = Object.keys(crafted_items).map(x => Number(x)).sort((a,b)=>b-a);
                    const highest_qual = qualities[0];

                    if(crafted_count > 1) {
                        nativeCraftMessage(`Created ${result.getName()} x${crafted_count} [highest quality: ${highest_qual}% x${crafted_items[highest_qual]}] (+${Math.floor(accumulated_xp)} xp)`, "crafting");
                    } else {
                        nativeCraftMessage(`Created ${result.getName()} [${highest_qual}% quality] x1 (+${Math.floor(accumulated_xp)} xp)`, "crafting");
                    }

                    add_xp_to_skill({skill: recipe_skill, xp_to_add: accumulated_xp, use_bonus: false, cap_gained_xp: false});

                    crafted_items = {};
                    crafted_count = 0;
                    accumulated_xp = 0;
                    needed_xp = recipe_skill.getTotalXPToNextLvl() - recipe_skill.getTotalXP();
                }
            }

            game_stats.total_crafting_attempts+=ammount_that_can_be_crafted;
            game_stats.total_crafting_successes+=ammount_that_can_be_crafted;

            if(crafted_count > 0) {
                const qualities = Object.keys(crafted_items).map(x => Number(x)).sort((a,b)=>b-a);
                const highest_qual = qualities[0];

                if(crafted_count > 1) {
                    nativeCraftMessage(`Created ${result.getName()} x${crafted_count} [highest quality: ${highest_qual}% x${crafted_items[highest_qual]}] (+${Math.floor(accumulated_xp)} xp)`, "crafting");

                } else {
                    nativeCraftMessage(`Created ${result.getName()} [${highest_qual}% quality] x1 (+${Math.floor(accumulated_xp)} xp)`, "crafting");
                }
                add_xp_to_skill({skill: recipe_skill, xp_to_add: accumulated_xp, use_bonus: false, cap_gained_xp: false});
            }

            //grab key, modify it with proper quality value, add (together with count) to list for adding to inv
            const result_key = result.getInventoryKey();
            const parsed_key = JSON.parse(result_key);
            const crafted_qualities = Object.keys(all_crafted).map(x => Number(x));
            const to_add = [];
            for(let i = 0; i < crafted_qualities.length; i++ ) {
                const new_key = JSON.stringify({...parsed_key, quality: crafted_qualities[i]});
                to_add.push({item_key: new_key, count: all_crafted[crafted_qualities[i]]});
            }
            character.addToInventory(to_add);

            //remove used mats
            for (let i in comp) {
                character.removeFromInventory([{ item_key: comp[i].item.getInventoryKey(), item_count: ammount_that_can_be_crafted }]);
            }

            update_displayed_component_choice({ category, subcategory, recipe_id, component_keys });
        }  
    }
}

function add_to_content_stack({content_type, data, what_to_remove = content_stack_removal_options.TOP}) {
    content_stack.push({content_type, data, what_to_remove});

    switch_action_box_content();
}

function remove_from_content_stack() {
    const content = content_stack.pop();
    const what_to_remove = content.what_to_remove || content_stack_removal_options.TOP;

    if(what_to_remove === content_stack_removal_options.TOP) {
        //nothing - already done
    } else if(what_to_remove === content_stack_removal_options.ALL) {
        //clear it completely, which will default to location display
        while(content_stack[0]) {
            content_stack.pop();
        }
    } else {
        throw new Error(`No such content stack removal option as "${what_to_remove}"`);
    }

    switch_action_box_content();
}

function pass_data_down_the_content_stack({data}) {
    if(content_stack.length > 1) {
        content_stack[content_stack.length - 2].data.special = data;
    }
}

function switch_action_box_content() {
    //cancel everything when switching
    if(current_dialogue) {
        current_dialogue = null;
    } else if(current_activity) {
        current_activity = null;
        end_activity_animation();
    } else if(current_game_action) {
        current_game_action = null;
        end_activity_animation();
        stop_game_action_interval();
    }

    if(content_stack.length) {
        let {content_type, data} = content_stack[content_stack.length - 1];

        if(content_type.startsWith("dialogue")) {
            current_dialogue = data.npc_id;
        }
        if(content_type === "dialogue") {

            //nothing?
        } else if(content_type === "dialogue_answer") {
            //no need to handle this one? (and it's expected to not appear here), as there's no need to put the answer to the stack
        } else if(content_type === "dialogue_branch") {
            //need to handle this one, to allow infinite depth branching?
        } else if(content_type === "action") {
            //everything else is handled in action code
            current_dialogue = data.npc_id;
            current_game_action = data.action_key;
        } else if(content_type === "activity") {
            current_activity = data.activity;
            //no need to do much as nothing should be stackable on top of it
        } else {
            throw new Error(`Error on switching action box content: no such content type as "${content_type}"`);
        }

        if(content_type) {
            //something -> pass it forward
            fill_action_box({content_type, data});
        } else {
            //nothing -> shouldn't be possible
        }
        
    } else {
        //stack is empty, just display the current location

        change_location({location_id: current_location.id, skip_travel_time: true});
    }
}

function character_equip_item(item_key) {
    const reasons = nativeActionReasons(expansionState);
    if(reasons.length) {log_message(reasons.join(" "),"notification");return;}
    try{assertNativeItemDisposition(expansionState,item_key);}catch(error){log_message(error.message,"notification");return;}
    character.equipItemFromInventory(item_key);
    if(current_location.tags.safe_zone) reload_normal_location();
    update_displayed_crafting_recipes();
    update_displayed_stats();
    if(current_combat) {
        current_combat.resetCombatLoops(true);
        update_displayed_fighters_stats();
    } else if(current_location.tags.safe_zone) {
        //update resource gathering tooltips in case there's a skill lvl bonus change
        //done on any change as of now, but could be slightly optimized
        Object.keys(current_location.activities).forEach(activity_key => {
            if(current_location.activities[activity_key].gained_resources) {
                update_gathering_tooltip(current_location.activities[activity_key]);
            }
        });
    }
}

function character_unequip_item(item_slot) {
    const reasons = nativeActionReasons(expansionState);
    if(reasons.length) {log_message(reasons.join(" "),"notification");return;}
    character.unequipItem(item_slot);
    if(current_location.tags.safe_zone) reload_normal_location();
    update_displayed_crafting_recipes();
    if(current_combat) {
        current_combat.resetCombatLoops(true);
        update_displayed_fighters_stats();
    }
}

function performMixtureAction(request) {
    const reasons=nativeActionReasons(expansionState);if(reasons.length||!character.is_alive)throw new Error(reasons.join(" ")||"A living character is needed.");
    if(!workLedgerCanWrite()||(request.type!=='use'&&current_location?.id!=='Village')||expansionState.actors.player.worldId!=='base.frontier'||expeditionOccupiesPlayer()||current_activity||current_game_action||current_combat||current_dialogue||is_sleeping||is_reading||is_in_trade())throw new Error('Use the mixing counter while free in Village.');
    if(request.key)assertNativeItemDisposition(expansionState,request.key);
    const plan=stageMixtureAction({owner:getMixtureOwner(),seed:mixtureSeed(),inventory:character.getItems(),money:character.money,clock:calendarMinutes(current_game_time),request,expansion:expansionState});
    commitMixturePlan(plan,{createSave:create_save,validateEnvelope:save=>validateSaveEnvelope(save,game_version),
        write:text=>lifeSaveStorage.setItem(is_on_dev()?dev_save_key:save_key,text),publish:p=>{
            if(p.expansion)expansionState=p.expansion;
            setProductAppearanceOwner(expansionState.productAppearances);
            setMixtureOwner(p.state);character.money=p.money;
            const stock=character.getItems();for(const key of Object.keys(stock))if(!p.inventory[key])delete stock[key];
            for(const [key,row]of Object.entries(p.inventory))stock[key]={item:getItemFromKey(key),count:row.count};
            if(p.effect)active_effects['Village mixture exposure']=restoreActiveEffect('Village mixture exposure',p.effect);
            update_displayed_character_inventory();update_displayed_money();update_displayed_effects();character.addActiveEffectBonus(active_effects);character.updateStatsAndDisplay();
        }});return plan;
}

function use_item(item_key) { 
    const reasons = nativeActionReasons(expansionState);
    if(reasons.length) {log_message(reasons.join(" "),"notification");return;}
    try {assertNativeItemDisposition(expansionState,item_key);} catch(e) {log_message(e.message,"notification");return;}
    if(!character.getItems()[item_key]?.count)return;
    const {id} = JSON.parse(item_key);
    if(id===MIXTURE_ID){try{performMixtureAction({type:'use',key:item_key});}catch(error){log_message(error.message,'notification');}return;}
    const nourishment=prepareFood(getPacingState(),item_templates[id],homePacingContext());
    const item_effects = item_templates[id].effects;
    let used = nourishment.restored>0;
    for(let i = 0; i < item_effects.length; i++) {
        used = add_active_effect(item_effects[i].effect,item_effects[i].duration, true) || used;
        /*
        const duration = item_templates[id].effects[i].duration;
        if(!active_effects[item_effects[i].effect] || active_effects[item_effects[i].effect].duration < duration) {

            active_effects[item_effects[i].effect] = new ActiveEffect({...effect_templates[item_effects[i].effect], duration});
            used = true;
        }
        */
    }
    
    if(used) {
        update_displayed_effects();
        character.addActiveEffectBonus(active_effects);
        character.updateStatsAndDisplay();

        const recovered = [];
        Object.keys(item_templates[id].recovery_chances).forEach(recoverable => {
            const chance = item_templates[id].recovery_chances[recoverable];
            if(chance > gameRandom(STREAMS.gather, `recover:${id}:${recoverable}`)) {
                recovered.push({item_id: recoverable});
            }
        });
        character.addToInventory(recovered);

        //update consuming-related skills if relevant tags are present
        Object.keys(skill_consumable_tags).forEach(skill_id => {
            if(item_templates[id].tags[skill_consumable_tags[skill_id]]) {
                let leveled = add_xp_to_skill({skill: skills[skill_id], xp_to_add: (item_templates[id].value/10)**.6667});
                //if levelup, update all related tooltips
                if(leveled) {
                    character.addActiveEffectBonus(active_effects);
                    character.updateStatsAndDisplay();
                    Object.keys(character.getItems()).forEach(item_key => {
                        if(character.getItems()[item_key].item.tags[skill_consumable_tags[skill_id]]) {
                            update_displayed_character_inventory({item_key});
                        }
                    });
                }
            }
        });

        character.removeFromInventory([{item_key}]);
        setPacingState(nourishment.state);pacingPanel?.render();pacingStatusPanel?.render();durabilityPanel?.render();elementalPanel?.render();
    }
}

function add_consumable_to_favourites(item_id) {
    if(!item_templates[item_id]) {
        throw new Error(`Tried to add "${item_id}" to auto consume, but no such item exists.`);
    } else if(!item_templates[item_id].tags.usable) {
        throw new Error(`Tried to add "${item_id}" to auto consume, but it's not a consumable.`);
    }
    favourite_consumables[item_id] = true;
    //update autouse button display? currently done in .html
}

function remove_consumable_from_favourites(item_id) {
    if(!favourite_consumables[item_id]) {
        throw new Error(`Tried to remove "${item_id}" from auto consume, but it's not there.`);
    }
    delete favourite_consumables[item_id];
    if(character.getItems()[item_templates[item_id].getInventoryKey()]) {
        //update autouse button display? currently done in .html
    }
}

function change_consumable_favourite_status(item_id) {
    if(!item_templates[item_id]) {
        throw new Error(`Tried to change "${item_id}" auto consum status, but no such item exists.`);
    } else if(!item_templates[item_id].tags.usable) {
        throw new Error(`Tried to change "${item_id}" auto consume status, but it's not a consumable.`);
    }

    if(favourite_consumables[item_id]) {
        remove_consumable_from_favourites(item_id);
    } else {
        add_consumable_to_favourites(item_id);
    }

    if(character.getItems()[item_templates[item_id].getInventoryKey()]) {
        //update autouse button display? currently done in .html
    }
}

function add_item_to_favourites(item_key) {
    favourite_items[item_key] = true;
}

function remove_item_from_favourites(item_key) {
    delete favourite_items[item_key];
}

function change_item_favourite_status(target, item_key) {
    if(item_key in favourite_items) {
        remove_item_from_favourites(item_key);
        update_fav_display(target, false);
    } else {
        add_item_to_favourites(item_key);
        update_fav_display(target, true);
    }

    if(character.getItems()[item_key]) {
        //it's in inventory, update display in inventory
        update_displayed_character_inventory({item_key});
    } 


    const equip_slot = getItemFromKey(item_key).equip_slot;
    if(equip_slot && character.getEquipment()[equip_slot]?.getInventoryKey() === item_key) {
        //it's in equips, update equipment part of inventory display
        update_displayed_character_inventory({equip_slot});
    }
}

/**
 * 
 * @param {String} effect_key 
 * @param {Number} duration 
 * @param {Boolean} was_xp_added whether this code should skip xp gain for relevant skill (if such exists) 
 * @returns {Boolean} whether effect was in fact applied (it wasn't active, it had shorter duration, or a weaker was active)
 */
function add_active_effect(effect_key, duration = 1, skip_xp){
    if(!effect_templates[effect_key]) {
        throw new Error(`No such active effect available as "${effect_key}"`);
    }
    let do_not_apply_because_stronger_is_active = false; //readable names are good, right?
    const was_already_active = active_effects[effect_key];
    const old_duration = active_effects[effect_key]?.duration ?? 0;

    if(!was_already_active) {
        Object.keys(active_effects).forEach(effect => {
            if(do_not_apply_because_stronger_is_active) {
                return;
            }
            Object.keys(active_effects[effect].group_tags).forEach(group_tag => {
                if(do_not_apply_because_stronger_is_active) {
                    return;
                }
                if(group_tag in effect_templates[effect_key].group_tags) {
                    if(active_effects[effect].group_tags[group_tag] > effect_templates[effect_key].group_tags[group_tag]) {
                        //stronger effect is active, skip
                        do_not_apply_because_stronger_is_active = true; 
                    } else {
                        //existing effect is weaker, aply the effect normally, remove the weaker
                        delete active_effects[effect];
                    }
                }
            });
        });

        if(do_not_apply_because_stronger_is_active) {
            //shouldn't need any recalculations or display updates as nothing was changed
            return;
        }
    } else {
        delete active_effects[effect_key];
    }
    active_effects[effect_key] = new ActiveEffect({...effect_templates[effect_key], duration});
    update_displayed_effects();
    
    if(!was_already_active) {
        character.addActiveEffectBonus(active_effects);
        character.updateStatsAndDisplay();
    }

    //no need to check for whether effect was activated, code won't reach this point if it wasn't
    if(!skip_xp) {
        //update consuming-related skills if relevant tags are present
        Object.keys(skill_consumable_tags).forEach(skill_id => {
            if(effect_templates[effect_key].tags[skill_consumable_tags[skill_id]]) {
                let leveled = add_xp_to_skill({skill: skills[skill_id], xp_to_add: (effect_templates[effect_key].base_xp_value * active_effects[effect_key].duration **.3333)});
                //if levelup, update all related tooltips
                if(leveled) {
                    character.addActiveEffectBonus(active_effects);
                    character.updateStatsAndDisplay();
                    Object.keys(character.getItems()).forEach(item_key => {
                        if(character.getItems()[item_key].item.tags[skill_consumable_tags[skill_id]]) {
                            update_displayed_character_inventory({item_key});
                        }
                    });
                }
            }
        });
    }

    return old_duration < active_effects[effect_key].duration;
}

function add_xp_to_activity_skills() {
    if(current_activity.gained_skills) {
        const gained_skills = current_activity.gained_skills;
        Object.keys(gained_skills).forEach(skill_key => {
            add_xp_to_skill({skill: skills[skill_key], xp_to_add: gained_skills[skill_key]});
        });
    } else {
        const skill_names = activities[current_activity.activity_name].base_skills_names;
        for (let i = 0; i < skill_names?.length; i++) {
            add_xp_to_skill({skill: skills[skill_names[i]], xp_to_add: current_activity.skill_xp_per_tick[i]});
        }
    }
}

/**
 * Handles preliminary management of quest events, simplifying work by automatically providing all the additional data
 * @param {Object} quest_event_data 
 */
function do_quest_event({quest_event_type, quest_event_target, quest_event_count}) {

    questManager.catchQuestEvent({
        quest_event_type,
        quest_event_target,
        quest_event_count,
        additional_quest_tags: {
            location: current_location?.id || "",
            season: current_game_time.getSeason() || "",
            //just whatever might be possibly needed, to be updated as things expand
        }
    })
}

/**
 * 
 */
function give_export_reward() {
    add_active_effect("Spark of Inspiration", 1800);
    log_message("Gained a Spark of Inspiration!", "export_reward");
}

function get_date() {
    const date = new Date();
    const year = date.getFullYear();
    const month_num = date.getMonth()+1;
    const month = month_num > 9 ? month_num.toString() : "0" + month_num.toString();
    const day = date.getDate() > 9 ? date.getDate().toString() : "0" + date.getDate().toString();
    const hour = date.getHours() > 9 ? date.getHours().toString() : "0" + date.getHours().toString();
    const minute = date.getMinutes() > 9 ? date.getMinutes().toString() : "0" + date.getMinutes().toString();
    const second = date.getSeconds() > 9 ? date.getSeconds().toString() : "0" + date.getSeconds().toString();
    return `${year}-${month}-${day} ${hour}_${minute}_${second}`;
}

function is_on_dev() {
    return window.location.href === "https://miktaew.github.io/yet-another-idle-rpg-dev/";
}
function is_on_main() {
    return window.location.href === "https://miktaew.github.io/yet-another-idle-rpg/";
}

function is_JSON(str) {
    try {
        return (JSON.parse(str) && !!str);
    } catch (e) {
        return false;
    }
}

/**
 * puts all important stuff into a string
 * @returns string with save data
 */
function create_save({forExport = false} = {}) {
    try{
        if(!ownsSave) throw new Error("This tab does not own the save. Close the other game tab and reload.");
        if((foundationSaveBlocked && !(forExport && lifeStorageFailure)) || is_loading_error) throw new Error("Saving disabled after a loading error. Preserve the original save and use a compatible build.");
        const save_data = {};
        save_data["game version"] = game_version;
        save_data["current time"] = current_game_time;
        save_data["language"] = language;
        save_data.saved_at = get_date();
        save_data.total_playtime = game_stats.total_playtime;
        save_data.total_deaths = game_stats.total_deaths;
        save_data.total_crafting_attempts = game_stats.total_crafting_attempts;
        save_data.total_crafting_successes = game_stats.total_crafting_successes;
        save_data.total_kills = game_stats.total_kills;
        save_data.total_crits_done = game_stats.total_crits_done;
        save_data.total_crits_taken = game_stats.total_crits_taken;
        save_data.total_hits_done = game_stats.total_hits_done;
        save_data.total_hits_taken = game_stats.total_hits_taken;
        save_data.strongest_hit = game_stats.strongest_hit;
        save_data.gathered_materials = game_stats.gathered_materials;
        save_data.global_flags = global_flags;
        save_data.last_rewarded_export = last_rewarded_export || 0;
        save_data["character"] = {
                                name: character.name, titles: character.titles,
                                bio: character.getBio(), equipment: character.getEquipment(),
                                money: character.money, 
                                xp: {
                                    total_xp: character.getTotalXP(),
                                },
                                hp_to_full: full_stats.max_health - full_stats.health,
                                stamina_to_full: full_stats.max_stamina - full_stats.stamina,
                                reputation: character.reputation,
                            };
        //stats don't get saved, they will be recalculated upon loading

        save_data.rain_counter = rain_counter;
        save_data.cold_status_counters = cold_status_counters;

        save_data.are_finished_quests_hidden = document.getElementById("quest_hiding_button").checked;
       
        //Object.keys(character.getEquipment()).forEach(key =>{
            //save_data["character"].equipment[key] = true;
            //need to rewrite equipment loading first
        //});

        save_data["favourite_consumables"] = favourite_consumables;
        save_data["favourite_items"] = favourite_items;

        save_data["skill_category_order"] = skill_category_order;

        save_data["levels"] = {};

        Object.keys(levels).forEach(key => {
            save_data["levels"][key] = {};

            Object.keys(levels[key]).forEach(levelable_key => {
                const levelable = levels[key][levelable_key];

                save_data["levels"][key][levelable_key] = {
                    total_xp: levelable.total_xp,
                    skill_xp: {},
                };

                Object.keys(levelable.skill_progress).forEach(skill_id => {
                    save_data["levels"][key][levelable_key].skill_xp[skill_id] = levelable.skill_progress[skill_id].total_xp;
                });
            });
        });
        
        save_data["current location"] = current_location.id;
        save_data.native_encounter = current_combat?.snapshot(current_location.id) || pendingNativeEncounter;

        save_data["locations"] = {};
        Object.keys(locations).forEach(function(key) { 
            save_data["locations"][key] = {};

            if(locations[key].tags.combat_zone && locations[key].enemy_groups_killed) {
                save_data["locations"][key]["enemy_groups_killed"] = locations[key].enemy_groups_killed;
            }

            if(locations[key].actions) {
                save_data["locations"][key]["actions"] = {};
                Object.keys(locations[key].actions).forEach(action_key => {
                    if(locations[key].actions[action_key].isUnlocked()) {
                        save_data["locations"][key]["actions"][action_key] = {};
                        if(locations[key].actions[action_key].keep_progress) {
                            save_data["locations"][key]["actions"][action_key].accumulated_progress = locations[key].actions[action_key].accumulated_progress;
                        }
                        if(locations[key].actions[action_key].repeatable) {
                            save_data["locations"][key]["actions"][action_key].completion_count = locations[key].actions[action_key].completion_count;
                        }
                    }
                    
                });
            }
        }); //save locations' (and their activities'/actions') unlocked status and their killcounts

        save_data.favourite_locations = favourite_locations;


        if(current_activity) {
            save_data["current_activity"] = {activity_id: current_activity.id,
                                             earnings: current_activity.earnings,
                                             gathering_time: current_activity.gathering_time,
                                             gathered_materials: current_activity.gathered_materials,
                                            };
        }

        //all the unlock/finish/lock statues
        save_data["availabilities"] = {};

        Object.keys(availabilities).forEach(category_key => {
            save_data["availabilities"][category_key] = {};
            Object.keys(availabilities[category_key]).forEach(availability_id => {
                save_data["availabilities"][category_key][availability_id] = status_to_flag(availabilities[category_key][availability_id].getStatus());
            }); 
        });


        save_data["npc_equipment"] = readNativeEquipment(NPCRegistry.getAll());
        save_data["npcs"] = {};
        const npcs = NPCRegistry.getAll();
        Object.keys(npcs).forEach(npc_key => {
            //const npc_availability = npcs[npc_key].getAvailabilityComponent();
            //const dialogue_availability = npcs[npc_key].getDialogueAvailability();
            //const trader_availability = npcs[npc_key].getTraderAvailability();

            const dialogue = npcs[npc_key].getDialogueComponent();
            const trader = npcs[npc_key].getTraderComponent();

            save_data["npcs"][npc_key] = {
                dialogue: {
                    textlines: {},
                    actions: {},
                },
                trader: {
                    last_refresh: (trader.last_refresh == -1 || trader?.can_refresh?.())? -1 : trader.last_refresh,
                }
            }

            
            /*
            no need to save since availabilities get saved separately?

            //write_availability_status(save_data["npcs"][npc_key], npc_availability);
            //write_availability_status(save_data["npcs"][npc_key]["dialogue"], dialogue_availability);
            //write_availability_status(save_data["npcs"][npc_key]["trader"], trader_availability);

            Object.keys(dialogue.textlines).forEach(textline_key => {
                //const textline_availability = dialogue.textlines[textline_key].getAvailabilityComponent();
                save_data["npcs"][npc_key]["dialogue"]["textlines"][textline_key] = {};
                //write_availability_status(save_data["npcs"][npc_key]["dialogue"]["textlines"][textline_key], textline_availability);
            });
            */

            Object.keys(dialogue.actions).forEach(action_key => {
                //const action_availability = dialogue.actions[action_key].getAvailabilityComponent();
                save_data["npcs"][npc_key]["dialogue"]["actions"][action_key] = {};
                //write_availability_status(save_data["npcs"][npc_key]["dialogue"]["actions"][action_key], action_availability);

                save_data["npcs"][npc_key]["dialogue"]["actions"][action_key]["accumulated_progress"] = dialogue.actions[action_key].getCurrentProgress();
                save_data["npcs"][npc_key]["dialogue"]["actions"][action_key]["completion_count"] = dialogue.actions[action_key].getCompletionCount();
            });
        });

        save_data["inventories"] = {};
        Object.keys(inventories).forEach(inventory_category => {
            save_data["inventories"][inventory_category] = {};
            Object.keys(inventories[inventory_category]).forEach(inventory_owner => {
                save_data["inventories"][inventory_category][inventory_owner] = {};
                const items = inventories[inventory_category][inventory_owner].getItems();
                Object.keys(items).forEach(inventory_key => {
                    save_data["inventories"][inventory_category][inventory_owner][inventory_key] = {count: items[inventory_key].count};
                });
            });
        });

        save_data["books"] = {};
        Object.keys(book_stats).forEach(book => {
            if(book_stats[book].accumulated_time > 0) {
                save_data["books"][book] = {
                    accumulated_time: book_stats[book].accumulated_time
                };
            }
        });

        save_data["quests"] = {};
        Object.keys(quests).forEach(quest_id => {
            //save quest status and their tasks' statuses

            save_data["quests"][quest_id] = {
                is_active: quest_id in active_quests,
                is_finished: quests[quest_id].isFinished(),
                task_status: [],
            };

            for(let i = 0; i < quests[quest_id].quest_tasks.length; i++) {
                if(quests[quest_id].quest_tasks[i].isFinished()) {
                    save_data["quests"][quest_id].task_status[i] = {is_finished: true};
                } else {
                    if(quest_id in active_quests){
                        //save the progress and return, as only up to the first not-completed needs to be saved, anything after that cannot have  progress
                        save_data["quests"][quest_id].task_status[i] = {progress: active_quests[quest_id].quest_tasks[i].task_condition};
                        return;
                    }
                }
            }
        });

        save_data["is_reading"] = is_reading;

        save_data["is_sleeping"] = is_sleeping;

        save_data["active_effects"] = active_effects;
        if(getMixtureOwner())save_data.mixtures=structuredClone(getMixtureOwner());

        save_data["enemy_killcount"] = enemy_killcount;
        save_data["item_log"] = item_log.items;

        save_data["loot_sold_count"] = loot_sold_count;

        save_data["last_combat_location"] = last_combat_location;
        save_data["last_location_with_bed"] = last_location_with_bed;

        save_data["options"] = game_options;

        save_data["stances"] = {};
        save_data["current_stance"] = current_stance;
        save_data["selected_stance"] = selected_stance;
        save_data["faved_stances"] = faved_stances;

        save_data["message_filters"] = {
            unlocks: document.documentElement.style.getPropertyValue('--message_unlocks_display') !== "none",
            events: document.documentElement.style.getPropertyValue('--message_events_display') !== "none",
            combat: document.documentElement.style.getPropertyValue('--message_combat_display') !== "none",
            loot: document.documentElement.style.getPropertyValue('--message_loot_display') !== "none",
            background: document.documentElement.style.getPropertyValue('--message_background_display') !== "none",
            crafting: document.documentElement.style.getPropertyValue('--message_crafting_display') !== "none",
        };

        save_data["skill_list_state"] = {};
        for (let i = 0; i < skill_list.childElementCount; i++) {
            save_data["skill_list_state"][i] = skill_list.children[i].classList.contains("skill_category_expanded");
        }

        save_data.equipment_durability=durability.serialize();
        save_data.pacing_e1=getPacingState();
        save_data.fort_supply=structuredClone(fortSupply);
        save_data.absorb_local_life=structuredClone(localLife);
        save_data.cheats = validateCheatState(cheatState);
        save_data.content_packs = packSaveState(optionalPackState,packDefinitionsForSave());
        save_data.village_career = structuredClone(villageCareer);
        save_data.work_ledger=structuredClone(workLedger);
        save_data.customization=structuredClone(customization);
        save_data.fork_schema = 1;
        save_data.life_record = observeLifeSave(lifeRecord, {...save_data, expansion: expansionState});
        const generatedSnapshot=generatedPeopleSnapshot(calendarMinutes(current_game_time));
        if(generatedSnapshot)save_data.generated_people=generatedSnapshot;
        if(npcLives) save_data.npc_lives = advanceVillageLives(npcLives, current_game_time.year);
        save_data.expansion = recordRouteReading(expansionState, item_templates[ROUTE_NOTES].isFinished());
        tidemarkNative.snapshot(save_data,expansionState);
        nestedNative.snapshot(save_data,expansionState);
        paradiseNative.snapshot(save_data,expansionState);
        molNative.snapshot(save_data,expansionState);
        proto23Native.snapshot(save_data,expansionState);
        causalNative.snapshot(save_data,expansionState);
        return JSON.stringify(retainRetiredContent(save_data, retiredContent));
    } catch(error) {
        console.error("Something went wrong on saving the game!");
        console.error(error);
        log_message("FAILED TO CREATE A SAVE FILE, PLEASE CHECK CONSOLE FOR ERRORS AND REPORT IT", "message_critical");
    }
} 

//encodes provided text (presumably: JSONified save data) to base64, necessary as 'btoa' does not support any characters outside of Latin1 encoding
function to_base64(text) {
    const bytes = new TextEncoder().encode(text);
    let latin1 = "";
    for(let i = 0; i < bytes.length; i++) {
        latin1 += String.fromCharCode(bytes[i]);
    }
    return btoa(latin1);
}

function from_base64(encoded) {
    const latin1 = atob(encoded);
    const bytes = new Uint8Array(latin1.length);
    for(let i = 0; i < latin1.length; i++) {
        bytes[i] = latin1.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
}

/**
 * called from index.html
 * @returns save string encoded to base64
 */
function save_to_file() {
    if(importProbeToken) return null;
    if(suspendedStructuredSave)return encodeSaveFile(JSON.stringify(suspendedStructuredSave));
    try {
        // Validate creation/encoding before offering a download or saving anything.
        encodeSaveFile(create_save({forExport:true}));
        if(Date.now() - last_rewarded_export > config.time_between_export_rewards) {
            last_rewarded_export = Date.now();
            give_export_reward();
        }
        const serialized = create_save({forExport:true});
        const encoded = encodeSaveFile(serialized);
        try {lifeSaveStorage.setItem(is_on_dev() ? dev_save_key : save_key, serialized);}
        catch(error) {log_message(error.message + " Your exported file can still be kept.", "message_critical"); return encoded;}
        save_counter = 0;
        log_message("Saved the game manually");
        return encoded;
    } catch(error) {
        log_message("Export canceled: no valid save file could be created. " + error.message, "message_critical");
        return null;
    }
}

/**
 * saves game state to localStorage, on manual saves also logs message about it being done
 * @param {Boolean} is_manual 
 */
function save_to_localStorage({key, is_manual}) {
    if(importProbeToken || !ownsSave) return;
    const save = create_save();
    if(save) {
        try {lifeSaveStorage.setItem(key, save);}
        catch(error) {log_message(error.message, "message_critical");return undefined;}
        if(is_manual) {
            log_message("Saved the game manually");
            save_counter = 0;
        }
    }
    return save ? JSON.parse(save).saved_at : undefined;
}

function save_progress() {
    if(is_on_dev()) {
        save_to_localStorage({key: dev_save_key, is_manual: true});
    } else {
        save_to_localStorage({key: save_key, is_manual: true});
    }
}

//core function for loading
function load(save_data) {
    nativeDiscoveryFeedback?.reset();
    hasLoadedNativeSave=true;
    // Restore validated native reading/sleep/activity before the new document
    // acquires its writer lock. Occupied/ended-life checks still apply.
    restoringNativeSave = true;
    try{
        try {
            try {requireStructuredContent(save_data.content_packs?.structured,structuredPacks);requireStructuredSelection(save_data.content_packs?.pendingStructured,structuredPacks);}
            catch(error){suspendedStructuredSave=structuredClone(save_data);throw error;}
            syncAuthoredSite(save_data.content_packs?.authored?.draft??null);
            save_data = preparePackSave(save_data,packDefinitionsForSave());
            save_data = validateSaveEnvelope(save_data, game_version);
            setMixtureOwner(save_data.mixtures);
            cheatState=validateCheatState(save_data.cheats??defaultCheatState());
            optionalPackState=validatePackState(save_data.content_packs??emptyPackState());
            localLife=normalizeLocalLife(save_data.absorb_local_life);
            fortSupply=migrateFortSupply(save_data);
            durability.load(save_data.equipment_durability);
            setPacingState(save_data.pacing_e1);pacingMinute=calendarMinutes(save_data["current time"]);
            if(localLife.lastClock==null)localLife.lastClock=calendarMinutes(save_data["current time"]);
            const prepared = prepareFoundationSave(save_data);
            save_data = prepareV06Save(prepared.save);
            retiredContent = prepared.retired;
            villageCareer = migrateVillageCareer(save_data);
            workLedger=migrateWorkLedger(save_data.work_ledger);
            customization=customizationFromSave(save_data);
            refreshCustomization();
            workLedgerPanel?.render();
            lifeRecord = migrateLifeRecord(save_data);
            restoreGeneratedPeople(save_data);
            npcLives = save_data.npc_lives == null ? null : advanceVillageLives(save_data.npc_lives, save_data["current time"].year);
            expansionState = initializeExpedition(loadExpansionState(save_data.expansion, expeditionRegistry, expansionState.rng));
            setProductAppearanceOwner(expansionState.productAppearances);
            // Pre-expansion saves have no seed: use the documented stable
            // fallback for native streams while leaving legacy engine RNG alone.
            ensureStreams(expansionState,save_data.expansion?.rng ?? 1);
            pendingNativeEncounter = save_data.native_encounter || null;
            validateNativeEncounter(pendingNativeEncounter,save_data["current location"]);
            if(pendingNativeEncounter && (!locations[pendingNativeEncounter.locationId]?.tags.combat_zone ||
                pendingNativeEncounter.enemies.some(e=>!enemy_templates[e.template])))throw Error("Unsupported saved native encounter.");
            validateGameAbsorptionAssay(expansionState,expeditionRegistry,{gameplay:{player:{inventory:Object.fromEntries(Object.entries(save_data.character.inventory || {}).map(([key,row])=>[key,row.count]))}}});
            validateNativeGameplayReferences(expansionState.pending.flatMap(job => [job.effects, job.costs || []]));
            for(const actor of Object.values(expansionState.actors)) {
                const active = activePractice(actor);
                if(active && !Object.hasOwn(skills, active[1].practice.xpSkill)) throw new Error("Unsupported saved practice skill.");
            }

        } catch(error) {
            foundationSaveBlocked = true;
            throw error;
        }
        character.reputation = restoreSavedReputation(character.reputation, save_data.character.reputation);
        loadingReputationTotals = save_data.character.reputation ?? null;
        //single loading method
        
        //Pre-stream saves have no active encounter; resume with a deterministic fresh group.

        let any_warnings = false;

        current_game_time.loadTime(save_data["current time"]);
        time_field.innerText = current_game_time.toString();
        //set game time

        Object.keys(save_data.global_flags||{}).forEach(flag => {
            
            if(flag === "is_deep_forest_beaten") { //compatibility for pre-0.5
                global_flags["is_strength_proved"] = save_data.global_flags[flag];
            } else {
                global_flags[flag] = save_data.global_flags[flag];
            }
        });

        if(save_data.language) {
            if(languages[save_data.language]) {
                language = save_data.language;
            } else {
                if(save_data.language !== "mofu_english") {
                    console.warn(`Language ${save_data.language} could not be found.`);
                }
            }
            
        }

        //if last export was in past, read normally; if last export was somehow in feature, replace it with "this moment", 
        //for some edge cases like people having wrong year in their system and then fixing it
        last_rewarded_export = save_data.last_rewarded_export < Date.now() ? (save_data.last_rewarded_export || last_rewarded_export) : Date.now();

        game_stats.total_playtime = save_data.total_playtime || 0;
        game_stats.total_deaths = save_data.total_deaths || 0;
        game_stats.total_crafting_attempts = save_data.total_crafting_attempts || 0;
        game_stats.total_crafting_successes = save_data.total_crafting_successes || 0;
        game_stats.total_kills = save_data.total_kills || 0;
        game_stats.total_crits_done = save_data.total_crits_done || 0;
        game_stats.total_crits_taken = save_data.total_crits_taken || 0;
        game_stats.total_hits_done = save_data.total_hits_done || 0;
        game_stats.total_hits_taken = save_data.total_hits_taken || 0;
        game_stats.strongest_hit = save_data.strongest_hit || 0;
        game_stats.gathered_materials = save_data.gathered_materials || {};

        name_field.value = save_data.character.name;
        character.name = save_data.character.name;
        character.titles = normalizeTitles(structuredClone(save_data.character.titles || {}));
        const bio = character.getBioComponent();
        Object.keys(bio).forEach(info => {
            bio[info] = save_data.character?.bio?.[info];
        });

        last_location_with_bed = save_data.last_location_with_bed;
        last_combat_location = save_data.last_combat_location;

        game_options.elemental_affinities=normalizeElementalOption(save_data.options?.elemental_affinities);
        game_options.uniform_text_size_in_action = save_data.options?.uniform_text_size_in_action;
        option_uniform_textsize(game_options.uniform_text_size_in_action);

        game_options.auto_return_to_bed = save_data.options?.auto_return_to_bed;
        option_bed_return(game_options.auto_return_to_bed);

        game_options.disable_combat_autoswitch = save_data.options?.disable_combat_autoswitch;
        option_combat_autoswitch(game_options.disable_combat_autoswitch);

        game_options.remember_message_log_filters = save_data.options?.remember_message_log_filters;
        if(save_data.message_filters) {
            Object.keys(message_log_filters).forEach(filter => {
                message_log_filters[filter] = save_data.message_filters[filter] ?? true;
            })
        }

        option_remember_filters(game_options.remember_message_log_filters);


        game_options.do_background_animations = save_data.options?.do_background_animations;
        option_do_background_animations(game_options.do_background_animations);

        game_options.skip_play_button = save_data.options?.skip_play_button;
        option_skip_play_button(game_options.skip_play_button);

        game_options.mofu_mofu_mode = save_data.options?.mofu_mofu_mode;
        option_mofu_mofu_mode(game_options.mofu_mofu_mode);

        game_options.do_enemy_onhit_animations = save_data.options?.do_enemy_onhit_animations;
        option_do_enemy_onhit_animations(game_options.do_enemy_onhit_animations);

        game_options.expo_threshold = save_data.options?.expo_threshold;
        option_expo_threshold(game_options.expo_threshold);

        game_options.hide_max_level_skills = save_data.options?.hide_max_level_skills;
        option_hide_max_level_skills(game_options.hide_max_level_skills);

        game_options.use_text_outlines_for_tooltips = save_data.options?.use_text_outlines_for_tooltips;
        option_use_text_outlines_for_tooltips(game_options.use_text_outlines_for_tooltips);

        game_options.use_text_outlines_for_bars = save_data.options?.use_text_outlines_for_bars;
        option_use_text_outlines_for_bars(game_options.use_text_outlines_for_bars);

        document.getElementById("quest_hiding_button").checked = save_data.are_finished_quests_hidden;
        change_completed_quest_visibility();

        //compatibility for old saves, can be removed at some point
        const is_from_before_eco_rework = compare_game_version("v0.3.5", save_data["game version"]) == 1;

        character.money = (save_data.character.money || 0) * ((is_from_before_eco_rework == 1)*10 || 1);
        update_displayed_money();

        rain_counter = save_data.rain_counter || 0;
        for(let i = 0; i < save_data.cold_status_counters?.length; i++) {
            cold_status_counters[i] = save_data.cold_status_counters[i] || 0;
        }

        Object.keys(save_data.favourite_consumables || {}).forEach(key => {
            favourite_consumables[key] = true;
        });
        Object.keys(save_data.favourite_items || {}).forEach(key =>{
            favourite_items[key] = true;
        })

        update_displayed_reputation();

        set_loading_screen_progress("Checking out your books");
        
        if(save_data.skill_category_order) {
            save_data.skill_category_order.forEach((elem, idx) => {
                skill_category_order[idx] = elem;
            });
        }

        Object.keys(save_data["availabilities"] || {}).forEach(category_key => {
            if(!availabilities[category_key]) {
                console.error(`No such category of availability having elements as "${category_key}"`);
                return;
            }
            Object.keys(save_data["availabilities"][category_key]).forEach(availability_id => {
                if(!availabilities[category_key][availability_id]) {
                    console.error(`No such element with availability as "${category_key}" -> "${availability_id}"`);
                    return;
                }

                availabilities[category_key][availability_id].setStatus(flag_to_status(save_data["availabilities"][category_key][availability_id]));
            });
        });

        const meditationXP = save_data.skills?.Meditation?.total_xp ?? save_data.levels?.person?.main_character?.skill_xp?.Meditation ?? 0;
        if(meditationXP > 0) process_rewards({rewards: {skills: ["Meditation"]}, is_from_loading: true, only_unlocks: true});

        if(is_a_older_than_b(save_data["game version"], "v0.6")) {
            if(save_data.books) {
                let total_book_xp = 0;
                const literacy_xp = save_data.skills["Literacy"]?.total_xp ?? 0;
                Object.keys(save_data.books).forEach(book=>{
                    if(!item_templates[book]) {
                        console.warn(`Book ${book} couldn't be found and was skipped!`);
                        any_warnings = true;
                    }

                    if(save_data.books[book].accumulated_time > 0) {
                        if(save_data.books[book].is_finished) {
                            item_templates[book].setAsFinished();
                            character.addBookBonus(book_stats[book].bonuses);
                            process_rewards({rewards: book_stats[book].rewards, only_unlocks: true, inform_overall: false, is_from_loading: true});

                            total_book_xp += book_stats[book].required_time * book_stats[book].literacy_xp_rate;
                        } else {
                            item_templates[book].addProgress(save_data.books[book].accumulated_time);
                            total_book_xp += book_stats[book].accumulated_time * book_stats[book].literacy_xp_rate;
                        }
                    }

                    update_booklist_entry(book, save_data.books[book].is_finished);
                });
                if(total_book_xp > literacy_xp) {
                    add_xp_to_skill({skill: skills["Literacy"], should_info: false, xp_to_add: total_book_xp, use_bonus: false, cap_gained_xp: false, is_from_loading: true});
                    console.warn(`Saved XP for "Literacy skill" was less than it should be based on progress with books (${literacy_xp} vs ${total_book_xp}), so it was adjusted to match it!`);
                    any_warnings = true;
                } else {
                    add_xp_to_skill({skill: skills["Literacy"], should_info: false, xp_to_add: literacy_xp, use_bonus: false, cap_gained_xp: false, is_from_loading: true});
                }
            }
        } else {
            if(save_data.books) {
                let total_book_xp = 0;
                const literacy_xp = save_data.levels["person"]["main_character"].skill_xp["Literacy"] ?? 0;
                Object.keys(save_data.books).forEach(book_id=>{
                    if(!item_templates[book_id]) {
                        console.warn(`Book ${book_id} couldn't be found and was skipped!`);
                        any_warnings = true;
                    }

                    if(save_data.books[book_id].accumulated_time > 0) {

                        item_templates[book_id].addProgress(save_data.books[book_id].accumulated_time);
                        total_book_xp += book_stats[book_id].accumulated_time * book_stats[book_id].literacy_xp_rate;
                        
                        if(item_templates[book_id].isFinished()) {
                            character.addBookBonus(book_stats[book_id].bonuses);
                            process_rewards({rewards: book_stats[book_id].rewards, only_unlocks: true, inform_overall: false, is_from_loading: true});
                        }
                    }

                    update_booklist_entry(book_id, item_templates[book_id].isFinished());
                });
                if(total_book_xp > literacy_xp) {
                    add_xp_to_skill({skill: skills["Literacy"], should_info: false, xp_to_add: total_book_xp, use_bonus: false, cap_gained_xp: false, is_from_loading: true});
                    console.warn(`Saved XP for "Literacy skill" was less than it should be based on progress with books (${literacy_xp} vs ${total_book_xp}), so it was adjusted to match it!`);
                    any_warnings = true;
                } else {
                    add_xp_to_skill({skill: skills["Literacy"], should_info: false, xp_to_add: literacy_xp, use_bonus: false, cap_gained_xp: false, is_from_loading: true});
                }
            }
        }

        if(is_a_older_than_b(save_data["game version"], "v0.6")) {
            add_xp_to_character(save_data.character.xp.total_xp, false);
            Object.keys(save_data.skills).forEach(key => { 
                if(key === "Literacy") {
                    return; //done separately, for compatibility with older saves (can be eventually removed)
                }
                if(skills[key]){
                    if(save_data.skills[key].total_xp > 0) {
                        add_xp_to_skill({
                                            skill: skills[key], xp_to_add: save_data.skills[key].total_xp, 
                                            should_info: false, add_to_parent: !Object.hasOwn(save_data.skills, skills[key].parent_skill), use_bonus: false, cap_gained_xp: false,
                                            is_from_loading: true
                                        });
                    }
                } else if(save_data.skills[key].total_xp > 0) {
                        console.warn(`Skill "${key}" couldn't be found!`);
                        any_warnings = true;
                }
            }); //add xp to skills


            //unlock stances
            if(save_data["stances"]) {
                Object.keys(save_data["stances"]).forEach(stance => {
                    if(save_data["stances"]) {
                        stances[stance].setUnlocked();
                    } 
                });
            }
        } else {
            Object.keys(save_data.levels).forEach(category => {
                if(!levels[category]) {
                    console.warn(`XP owner category "${category}" couldn't be found!`);
                    return;
                }
                Object.keys(save_data.levels[category]).forEach(xp_target => {
                    if(!levels[category][xp_target]) {
                        console.warn(`XP target "${xp_target}" couldn't be found!`);
                        return;
                    }

                    if(xp_target === hero_id) {
                        add_xp_to_character(save_data.levels[category][xp_target].total_xp, false, false);
                    } else {
                        levels[category][xp_target].addXP({xp_to_add: save_data.levels[category][xp_target].total_xp, use_bonus: false});
                    }

                    Object.keys(save_data.levels[category][xp_target].skill_xp).forEach(skill_id => {
                        // Player Literacy was reconstructed with the title-owned
                        // book progress above. Restore it once, as in legacy saves.
                        if(category === "person" && xp_target === "main_character" && skill_id === "Literacy" && save_data.books) return;
                        if(!skills[skill_id]) {
                            console.warn(`Skill "${skill_id}" couldn't be found!`);
                            return;
                        }

                        if(xp_target === hero_id) {
                            add_xp_to_skill({
                                skill: skills[skill_id], 
                                xp_to_add: save_data.levels[category][xp_target].skill_xp[skill_id],
                                should_info: false,
                                use_bonus: false,
                                add_to_parent: !Object.hasOwn(save_data.levels[category][xp_target].skill_xp, skills[skill_id].parent_skill),
                                cap_gained_xp: false,
                                is_from_loading: true,
                            });
                        } else {
                            (category === "person" && NPCRegistry.getAll()[xp_target] ? NPCRegistry.get(xp_target) : levels[category][xp_target]).addXPToSkill({
                                skill: skills[skill_id], 
                                xp_to_add: save_data.levels[category][xp_target].skill_xp[skill_id],
                                should_info: false,
                                use_bonus: false,
                                add_to_parent: !Object.hasOwn(save_data.levels[category][xp_target].skill_xp, skills[skill_id].parent_skill),
                                cap_gained_xp: false,
                            });
                        }
                    });
                });
            });
        }

        update_displayed_stance_list(current_stance);

        if(save_data.faved_stances) {
            Object.keys(save_data.faved_stances).forEach(stance_id=> {
                if(stances[stance_id] && stances[stance_id].isUnlocked()) {
                    fav_stance(stance_id);
                }
            });
        }
        update_displayed_faved_stances();

        if(save_data.current_stance) {
            current_stance = stances[save_data.current_stance.id] || stances[save_data.current_stance];
            selected_stance = stances[save_data.selected_stance.id] || stances[save_data.selected_stance];

            change_stance({stance_id: selected_stance.id});
        }

        Object.keys(save_data.character.equipment).forEach(function(key){
            if(save_data.character.equipment[key] != null) {
                const quality_mult = compare_game_version("v0.4.4", save_data["game version"]) == 1?100:1; //x100 if its from before quality rework
                if(item_templates[save_data.character.equipment[key].id]?.tags.structuredEquipment) {
                    character._equipItem(getItemFromKey(save_data.character.equipment[key].inventory_key||JSON.stringify({id:save_data.character.equipment[key].id})),true);
                } else if(key === "weapon") {
                    const {quality, equip_slot} = save_data.character.equipment[key];
                    let components;
                    if(save_data.character.equipment[key].components) {
                        components = save_data.character.equipment[key].components
                    } else {
                        const {head, handle} = save_data.character.equipment[key];
                        components = {head, handle};
                    }

                    Object.keys(components).forEach(comp => components[comp] = get_component_name(components[comp]));

                    if(!item_templates[components.head]){
                        console.warn(`Skipped item: weapon head component "${components.head}" couldn't be found!`);
                        any_warnings = true;
                    } else if(!item_templates[components.handle]) {
                        console.warn(`Skipped item: weapon handle component "${components.handle}" couldn't be found!`);
                        any_warnings = true;
                    } else {
                        const item = getItem({components, quality:quality*quality_mult, equip_slot, item_type: "EQUIPPABLE"});
                        character._equipItem(item, true);
                    }
                } else if(key === "off-hand") {
                    const {quality, equip_slot} = save_data.character.equipment[key];
                    let components;
                    if(save_data.character.equipment[key].components) {
                        components = save_data.character.equipment[key].components
                    } else {
                        const {shield_base, handle} = save_data.character.equipment[key];
                        components = {shield_base, handle};
                    }

                    Object.keys(components).forEach(comp => components[comp] = get_component_name(components[comp]));

                    if(!item_templates[components.shield_base]){
                        console.warn(`Skipped item: shield base component "${components.shield_base}" couldn't be found!`);
                        any_warnings = true;
                    } else if(!item_templates[components.handle]) {
                        console.warn(`Skipped item: shield handle "${components.handle}" couldn't be found!`);
                        any_warnings = true;
                    } else {
                        const item = getItem({components, quality:quality*quality_mult, equip_slot, item_type: "EQUIPPABLE"});
                        character._equipItem(item, true);
                    }
                } else if(save_data.character.equipment[key].equip_slot === "artifact" || save_data.character.equipment[key].tags?.tool) {
                    //no components
                    character._equipItem(getItem({...item_templates[save_data.character.equipment[key].id]}), true);
                } else { //armor
                    
                    const {quality, equip_slot} = save_data.character.equipment[key];
                    
                    if(save_data.character.equipment[key].components && save_data.character.equipment[key].components.internal.includes(" [component]")) {
                        //compatibility for armors from before v0.4.3
                        const item = getItem({...item_templates[save_data.character.equipment[key].components.internal.replace(" [component]","")], quality:quality*quality_mult});
                        character._equipItem(item, true);
                    } else if(save_data.character.equipment[key].components) {
                        let components = save_data.character.equipment[key].components;
                        
                        Object.keys(components).forEach(comp => components[comp] = get_component_name(components[comp]));

                        if(!item_templates[components.internal]){
                            console.warn(`Skipped item: internal armor component "${components.internal}" couldn't be found!`);
                            any_warnings = true;
                        } else if(components.external && !item_templates[components.external]) {
                            console.warn(`Skipped item: external armor component "${components.external}" couldn't be found!`);
                            any_warnings = true;
                        } else {
                            const item = getItem({components, quality:quality*quality_mult, equip_slot, item_type: "EQUIPPABLE"});
                            character._equipItem(item, true);
                        }
                    } else {
                        const item = getItem({...item_templates[save_data.character.equipment[key].name], quality:quality*quality_mult});
                        character._equipItem(item, true);
                    }

                }
            }
        }); //equip proper items

        if(character.getEquipment().weapon === null) {
            character._equipItem(null, true);
        }

        if(save_data.item_log) {
            item_log.items = save_data.item_log;
        }
        update_displayed_item_log();

        if(is_a_older_than_b(save_data["game version"], "v0.6")) {
            const item_list = [];

            Object.keys(save_data.character.inventory).forEach(key => {
                if(is_JSON(key)) {
                    //case where this is False is left as compatibility for saves before v0.4.4
                    let {id, components, quality} = JSON.parse(key);
                    if(id && !quality) { 
                        //id is just a key of item_templates
                        //if it's present, item is "simple" (no components)
                        //and if it has no quality, it's something non-equippable
                        const mapped_item = get_item_mapping(id);
                        id = mapped_item.item_id;
                        if(item_templates[id]) {
                            const new_item_key = item_templates[id].getInventoryKey();

                            if(id === "Coal" && is_a_older_than_b(save_data["game version"], "v0.4.6.12")) {
                                item_list.push({item_key: item_templates["Charcoal"].getInventoryKey(), count: save_data.character.inventory[key].count, quality: quality});
                            } else {
                                item_list.push({item_key: new_item_key, count: Math.round(mapped_item.item_count * save_data.character.inventory[key].count), quality: quality});
                            }
                        } else {
                            console.warn(`Inventory item "${key}" from save on version "${save_data["game version"]} couldn't be found!`);
                            any_warnings = true;
                            return;
                        }
                    } else if(components) {
                        Object.keys(components).forEach(comp => components[comp] = get_component_name(components[comp]));

                        const {head, handle, shield_base, internal, external} = components;
                        if(head) { //weapon
                            if(!item_templates[head]){
                                console.warn(`Skipped item: weapon head component "${head}" couldn't be found!`);
                                any_warnings = true;
                                return;
                            } else if(!item_templates[handle]) {
                                console.warn(`Skipped item: weapon handle component "${handle}" couldn't be found!`);
                                any_warnings = true;
                                return;
                            } else {
                                const item = getItem({components, quality, equip_slot: "weapon", item_type: "EQUIPPABLE"});
                                item_list.push({item_key: item.getInventoryKey(), count: save_data.character.inventory[key].count, quality: quality});
                            }
                        } else if(shield_base){ //shield
                            if(!item_templates[shield_base]){
                                console.warn(`Skipped item: shield base component "${shield_base}" couldn't be found!`);
                                any_warnings = true;
                                return;
                            } else if(!item_templates[handle]) {
                                console.warn(`Skipped item: shield handle component "${handle}" couldn't be found!`);
                                any_warnings = true;
                                return;
                            } else {
                                const item = getItem({components, quality, equip_slot: "off-hand", item_type: "EQUIPPABLE"});
                                item_list.push({item_key: item.getInventoryKey(), count: save_data.character.inventory[key].count, quality: quality});
                            }
                        } else if(internal) { //armor
                            if(!item_templates[internal]){
                                console.warn(`Skipped item: internal armor component "${internal}" couldn't be found!`);
                                any_warnings = true;
                                return;
                            } else if(!item_templates[external]) {
                                console.warn(`Skipped item: external armor component "${external}" couldn't be found!`);
                                any_warnings = true;
                                return;
                            } else {
                                let equip_slot = getArmorSlot(internal);
                                if(!equip_slot) {
                                    return;
                                }
                                const item = getItem({components, quality, equip_slot:  getArmorSlot(internal), item_type: "EQUIPPABLE"});
                                item_list.push({item_key: item.getInventoryKey(), count: save_data.character.inventory[key].count, quality: quality});
                            }
                        } else {
                            console.error(`Intentory key "${key}" from save on version "${save_data["game version"]} seems to refer to non-existing item type!`);
                        }
                    } else if(quality) { //no comps but quality (clothing / artifact /)
                        const item_id = get_component_name(id);
                        //const new_item_key = item_templates[item_id].getInventoryKey();
                        item_list.push({item_id: item_id, count: save_data.character.inventory[key].count, quality: quality});
                    } else {
                        console.error(`Intentory key "${key}" from save on version "${save_data["game version"]} is incorrect!`);
                    }
                } else { //older savefile, probably can be deleted at this point
                    if(Array.isArray(save_data.character.inventory[key])) { //is a list of unstackable items (equippables or books), needs to be added 1 by 1
                        for(let i = 0; i < save_data.character.inventory[key].length; i++) {
                            if(save_data.character.inventory[key][i].item_type === "EQUIPPABLE" ) {
                                if(save_data.character.inventory[key][i].equip_slot === "weapon") {
                                    
                                    const {quality} = save_data.character.inventory[key][i];
                                    let components;
                                    if(save_data.character.inventory[key][i].components) {
                                        components = save_data.character.inventory[key][i].components
                                    } else {
                                        const {head, handle} = save_data.character.inventory[key][i];
                                        components = {head, handle};
                                    }

                                    Object.keys(components).forEach(comp => components[comp] = get_component_name(components[comp]));

                                    if(!item_templates[components.head]){
                                        console.warn(`Skipped item: weapon head component "${components.head}" couldn't be found!`);
                                        any_warnings = true;
                                    } else if(!item_templates[components.handle]) {
                                        console.warn(`Skipped item: weapon handle component "${components.handle}" couldn't be found!`);
                                        any_warnings = true;
                                    } else {
                                        const item = getItem({item_type: "EQUIPPABLE", equip_slot: "weapon", components});
                                        item_list.push({item_key: item.getInventoryKey(), count: 1, quality: quality*100});
                                    }
                                } else if(save_data.character.inventory[key][i].equip_slot === "off-hand") {
                                    const {quality} = save_data.character.inventory[key][i];
                                    let components;
                                    if(save_data.character.inventory[key][i].components) {
                                        components = save_data.character.inventory[key][i].components
                                    } else {
                                        const {shield_base, handle} = save_data.character.inventory[key][i];
                                        components = {shield_base, handle};
                                    }

                                    Object.keys(components).forEach(comp => components[comp] = get_component_name(components[comp]));

                                    if(!item_templates[components.shield_base]){
                                        console.warn(`Skipped item: shield base component "${components.shield_base}" couldn't be found!`);
                                        any_warnings = true;
                                    } else if(!item_templates[components.handle]) {
                                        console.warn(`Skipped item: shield handle "${components.handle}" couldn't be found!`);
                                        any_warnings = true;
                                    } else {
                                        const item = getItem({item_type: "EQUIPPABLE", equip_slot: "off-hand", components});
                                        item_list.push({item_key: item.getInventoryKey(), count: 1, quality: quality*100});
                                    }
                                } else if(save_data.character.inventory[key][i].equip_slot === "artifact" || save_data.character.inventory[key][i].equip_slot === "amulet") {
                                    item_list.push({item_key: key, count: 1});
                                } else { //armor    
                                    if(save_data.character.inventory[key][i].components && save_data.character.inventory[key][i].components.internal.includes(" [component]")) {
                                        //compatibility for armors from before v0.4.3
                                        //const item = getItem({item_type: "EQUIPPABLE", equip_slot: "weapon", components});
                                        item_list.push({item_key: key, count: 1});
                                    } else if(save_data.character.inventory[key][i].components) {
                                        let components = save_data.character.inventory[key][i].components;

                                        Object.keys(components).forEach(comp => components[comp] = get_component_name(components[comp]));

                                        if(!item_templates[components.internal]){
                                            console.warn(`Skipped item: internal armor component "${components.internal}" couldn't be found!`);
                                            any_warnings = true;
                                        } else if(components.external && !item_templates[components.external]) {
                                            console.warn(`Skipped item: external armor component "${components.external}" couldn't be found!`);
                                            any_warnings = true;
                                        } else {
                                            const item = getItem({item_type: "EQUIPPABLE", components});
                                            item_list.push({item_key: item.getInventoryKey(), count: 1, quality: save_data.character.inventory[key][i].quality*100});
                                        }
                                    } else {
                                        item_list.push({item_id: key, count: 1});
                                    }
                                }
                            } else {
                                item_list.push({item_id: key, count: 1, quality: save_data.character.inventory[key][i].quality*100});
                            }
                            
                        }
                    } else { //is stackable 
                        if(item_templates[key]) {
                            item_list.push({item_id: key, count: save_data.character.inventory[key].count});
                        } else {
                            console.warn(`Inventory item "${key}" from save on version "${save_data["game version"]}" couldn't be found!`);
                            any_warnings = true;
                            return;
                        }
                    }
                }
            }); //add all loaded items to list

            const skip_item_log = !is_a_older_than_b(save_data["game version"], "v0.5.5.9");
            character.addToInventory(item_list, skip_item_log); // and then to inventory
        } else {
            Object.keys(save_data["inventories"]).forEach(inventory_category => {
                if(!inventories[inventory_category]) {
                    console.warn(`No such inventory category as "${inventory_category}" was found`);
                    any_warnings = true;
                    return;
                }
                Object.keys(save_data["inventories"][inventory_category]).forEach(inventory_owner => {

                    const saved_inventory = save_data["inventories"][inventory_category][inventory_owner];
                    const inventory = inventories[inventory_category][inventory_owner];
                    const item_list = [];

                    if(!inventory) {
                        console.warn(`No such inventory owner as "${inventory_owner}" was found`);
                        any_warnings = true;
                        return;
                    }

                    Object.keys(saved_inventory).forEach(key => {
                        const parsedKey=JSON.parse(key);
                        if(parsedKey.id===MIXTURE_ID){const item=getItemFromKey(key);item_list.push({item_key:item.getInventoryKey(),count:saved_inventory[key].count});return;}
                        const measuredItem=worldCompletionSavedNativeItem(key,saved_inventory[key],getItemFromKey);
                        if(measuredItem){item_list.push(measuredItem);return;}
                        if(parsedKey.e2_instance!=null){
                            const item=getItemFromKey(key);
                            if(!item.tags.equippable||item.getInventoryKey()!==key||saved_inventory[key].count!==1)throw Error('Invalid identified equipment copy.');
                            item_list.push({item_key:key,count:1});return;
                        }
                        let {id, components, quality} = parsedKey;
                        if(id && !quality) { 
                            //id is just a key of item_templates
                            //if it's present, item is "simple" (no components)
                            //and if it has no quality, it's something non-equippable
                            const mapped_item = get_item_mapping(id);
                            id = mapped_item.item_id;
                            if(item_templates[id]) {
                                const new_item_key = item_templates[id].getInventoryKey();

                                if(id === "Coal" && is_a_older_than_b(save_data["game version"], "v0.4.6.12")) {
                                    item_list.push({item_key: item_templates["Charcoal"].getInventoryKey(), count: saved_inventory[key].count, quality: quality});
                                } else {
                                    item_list.push({item_key: new_item_key, count: Math.round(mapped_item.item_count * saved_inventory[key].count), quality: quality});
                                }
                            } else {
                                console.warn(`Inventory item "${key}" from save on version "${save_data["game version"]} couldn't be found!`);
                                any_warnings = true;
                                return;
                            }
                        } else if(components) {
                            Object.keys(components).forEach(comp => components[comp] = get_component_name(components[comp]));

                            const {head, handle, shield_base, internal, external} = components;
                            if(head) { //weapon
                                if(!item_templates[head]){
                                    console.warn(`Skipped item: weapon head component "${head}" couldn't be found!`);
                                    any_warnings = true;
                                    return;
                                } else if(!item_templates[handle]) {
                                    console.warn(`Skipped item: weapon handle component "${handle}" couldn't be found!`);
                                    any_warnings = true;
                                    return;
                                } else {
                                    const item = getItem({components, quality, equip_slot: "weapon", item_type: "EQUIPPABLE"});
                                    item_list.push({item_key: item.getInventoryKey(), count: saved_inventory[key].count, quality: quality});
                                }
                            } else if(shield_base){ //shield
                                if(!item_templates[shield_base]){
                                    console.warn(`Skipped item: shield base component "${shield_base}" couldn't be found!`);
                                    any_warnings = true;
                                    return;
                                } else if(!item_templates[handle]) {
                                    console.warn(`Skipped item: shield handle component "${handle}" couldn't be found!`);
                                    any_warnings = true;
                                    return;
                                } else {
                                    const item = getItem({components, quality, equip_slot: "off-hand", item_type: "EQUIPPABLE"});
                                    item_list.push({item_key: item.getInventoryKey(), count: saved_inventory[key].count, quality: quality});
                                }
                            } else if(internal) { //armor
                                if(!item_templates[internal]){
                                    console.warn(`Skipped item: internal armor component "${internal}" couldn't be found!`);
                                    any_warnings = true;
                                    return;
                                } else if(!item_templates[external]) {
                                    console.warn(`Skipped item: external armor component "${external}" couldn't be found!`);
                                    any_warnings = true;
                                    return;
                                } else {
                                    let equip_slot = getArmorSlot(internal);
                                    if(!equip_slot) {
                                        return;
                                    }
                                    const item = getItem({components, quality, equip_slot:  getArmorSlot(internal), item_type: "EQUIPPABLE"});
                                    item_list.push({item_key: item.getInventoryKey(), count: saved_inventory[key].count, quality: quality});
                                }
                            } else {
                                console.error(`Intentory key "${key}" from save on version "${save_data["game version"]} seems to refer to non-existing item type!`);
                            }
                        } else if(quality) { //no comps but quality (clothing / artifact /)
                            const item_id = get_component_name(id);
                            //const new_item_key = item_templates[item_id].getInventoryKey();
                            item_list.push({item_id: item_id, count: saved_inventory[key].count, quality: quality});
                        } else {
                            console.error(`Intentory key "${key}" from save on version "${save_data["game version"]} is incorrect!`);
                        }
                    });
                    
                    if(inventory_owner === hero_id) {
                        character.addToInventory(item_list, true);
                    } else {
                        inventory.addToInventory(item_list);
                    }
                });
            });
        }

        durability.restoreEquipment(character,save_data.character.equipment,getItemFromKey);
        character._equipItem(null,true);

        if(is_a_older_than_b(save_data["game version"], "v0.6")) {
            const storage_item_list = [];
            if(save_data.player_storage) {
                Object.keys(save_data.player_storage.inventory).forEach(function(key){
                    if(is_JSON(key)) {
                        let {id, components, quality} = JSON.parse(key);
                        if(id && !quality) { 
                            //id is just a key of item_templates
                            //if it's present, item is "simple" (no components)
                            //and if it has no quality, it's something non-equippable

                            const mapped_item = get_item_mapping(id);
                            id = mapped_item.item_id;

                            if(item_templates[id]) {
                                const new_item_key = item_templates[id].getInventoryKey();
                                storage_item_list.push({item_key: new_item_key, count: Math.round(mapped_item.item_count * save_data.player_storage.inventory[key].count), quality: quality});
                            } else {
                                console.warn(`Inventory item "${key}" from save on version "${save_data["game version"]} couldn't be found!`);
                                any_warnings = true;
                                return;
                            }
                        } else if(components) {

                            Object.keys(components).forEach(comp => components[comp] = get_component_name(components[comp]));

                            const {head, handle, shield_base, internal, external} = components;
                            if(head) { //weapon
                                if(!item_templates[head]){
                                    console.warn(`Skipped item: weapon head component "${head}" couldn't be found!`);
                                    any_warnings = true;
                                    return;
                                } else if(!item_templates[handle]) {
                                    console.warn(`Skipped item: weapon handle component "${handle}" couldn't be found!`);
                                    any_warnings = true;
                                    return;
                                } else {
                                    const item = getItem({components, quality, equip_slot: "weapon", item_type: "EQUIPPABLE"});
                                    storage_item_list.push({item_key: item.getInventoryKey(), count: save_data.player_storage.inventory[key].count, quality: quality});
                                }
                            } else if(shield_base){ //shield
                                if(!item_templates[shield_base]){
                                    console.warn(`Skipped item: shield base component "${shield_base}" couldn't be found!`);
                                    any_warnings = true;
                                    return;
                                } else if(!item_templates[handle]) {
                                    console.warn(`Skipped item: shield handle component "${handle}" couldn't be found!`);
                                    any_warnings = true;
                                    return;
                                } else {
                                    const item = getItem({components, quality, equip_slot: "off-hand", item_type: "EQUIPPABLE"});
                                    storage_item_list.push({item_key: item.getInventoryKey(), count: save_data.player_storage.inventory[key].count, quality: quality});
                                }
                            } else if(internal) { //armor
                                if(!item_templates[internal]){
                                    console.warn(`Skipped item: internal armor component "${internal}" couldn't be found!`);
                                    any_warnings = true;
                                    return;
                                } else if(!item_templates[external]) {
                                    console.warn(`Skipped item: external armor component "${external}" couldn't be found!`);
                                    any_warnings = true;
                                    return;
                                } else {
                                    let equip_slot = getArmorSlot(internal);
                                    if(!equip_slot) {
                                        return;
                                    }
                                    const item = getItem({components, quality, equip_slot: getArmorSlot(internal), item_type: "EQUIPPABLE"});
                                    storage_item_list.push({item_key: item.getInventoryKey(), count: save_data.player_storage.inventory[key].count, quality: quality});
                                }
                            } else {
                                console.error(`Intentory key "${key}" from save on version "${save_data["game version"]} seems to refer to non-existing item type!`);
                            }
                        } else if(quality) { //no comps but quality (clothing / artifact?)
                            const item_id = get_component_name(id);
                            storage_item_list.push({item_id: item_id, count: save_data.player_storage.inventory[key].count, quality: quality});
                        } else {
                            console.error(`Intentory key "${key}" from save on version "${save_data["game version"]} is incorrect!`);
                        }
                    } //storage didn't exist before everything became stackable, so no need to check the other case
                }); //add all loaded items to list

                player_storage.addToInventory(storage_item_list); // and then to storage inventory
            }
        }

        set_loading_screen_progress("Meowing at your cat");

        if(is_a_older_than_b(save_data["game version"], "v0.6")) {
            Object.keys(save_data.dialogues).forEach(function(dialogue_key) {
                const key = npc_key_mapping[dialogue_key];
                if(key) {
                    const npc = NPCRegistry.get(key);
                    const dialogue = npc.getDialogueComponent();
                    const dialogue_availability = npc.getDialogueAvailability();

                    write_availability_status(dialogue_availability, save_data.dialogues[dialogue_key]);
                    
                    
                    if(save_data.dialogues[dialogue_key].textlines) {  
                        Object.keys(save_data.dialogues[dialogue_key].textlines).forEach(textline_key => {
                            if(dialogue.textlines[textline_key]) {
                                const textline_availability = dialogue.textlines[textline_key].getAvailabilityComponent();
                                write_availability_status(textline_availability, save_data["dialogues"][dialogue_key]["textlines"][textline_key]);
                            } else {
                                console.warn(`Textline "${textline_key}" in npc "${dialogue_key}" couldn't be found!`);
                                any_warnings = true;
                                return;
                            }
                        });
                    }
                    if(save_data.dialogues[dialogue_key].actions) {  
                        Object.keys(save_data.dialogues[dialogue_key].actions).forEach(action_key => {
                            if(dialogue.actions[action_key]) {

                                const action_availability = dialogue.actions[action_key].getAvailabilityComponent();
                                write_availability_status(action_availability, save_data["dialogues"][dialogue_key]["actions"][action_key]);

                                dialogue.actions[action_key].setCurrentProgress(save_data.dialogues[dialogue_key].actions[action_key]["accumulated_progress"]);
                                dialogue.actions[action_key].setCompletionCount(save_data.dialogues[dialogue_key].actions[action_key]["completion_count"]);

                            } else {
                                console.warn(`Textline "${action_key}" in npc "${dialogue_key}" couldn't be found!`);
                                any_warnings = true;
                                return;
                            }
                        });
                    }
                }
            });

            Object.keys(save_data.traders).forEach(function(trader_key) { 
                const key = npc_key_mapping[trader_key];
                if(key) {
                    const npc = NPCRegistry.get(key);
                    if(npc?.tags?.trader) {
                        const trader = npc.getTraderComponent();
                        const trader_availability = npc.getTraderAvailability();
                        
                        write_availability_status(trader_availability, save_data.traders[trader_key]);
                        
                        let trader_item_list = [];

                        if(save_data.traders[trader_key].inventory) {
                            Object.keys(save_data.traders[trader_key].inventory).forEach(function(key){
                                if(is_JSON(key)) {
                                    let {id, components, quality} = JSON.parse(key);
                                    if(id && !quality) { 
                                        //id is just a key of item_templates
                                        //if it's present, item is "simple" (no components)
                                        //and if it has no quality, it's something non-equippable and not a component

                                        const mapped_item = get_item_mapping(id);
                                        id = mapped_item.item_id;

                                        if(item_templates[id]) {
                                            const new_item_key = item_templates[id].getInventoryKey();
                                            trader_item_list.push({item_key: new_item_key, count: Math.round(mapped_item.item_count * save_data.traders[trader_key].inventory[key].count), quality: quality});
                                        } else {
                                            console.warn(`Inventory item "${key}" from save on version "${save_data["game version"]} couldn't be found!`);
                                            any_warnings = true;
                                            return;
                                        }
                                    } else if(components) {

                                        Object.keys(components).forEach(comp => components[comp] = get_component_name(components[comp]));

                                        const {head, handle, shield_base, internal, external} = components;

                                        if(head) { //weapon
                                            if(!item_templates[head]){
                                                console.warn(`Skipped item: weapon head component "${head}" couldn't be found!`);
                                                any_warnings = true;
                                                return;
                                            } else if(!item_templates[handle]) {
                                                console.warn(`Skipped item: weapon handle component "${handle}" couldn't be found!`);
                                                any_warnings = true;
                                                return;
                                            } else {
                                                const item = getItem({components, quality, equip_slot: "weapon", item_type: "EQUIPPABLE"});
                                                trader_item_list.push({item_key: item.getInventoryKey(), count: save_data.traders[trader_key].inventory[key].count, quality});
                                            }
                                        } else if(shield_base){ //shield
                                            if(!item_templates[shield_base]){
                                                console.warn(`Skipped item: shield base component "${shield_base}" couldn't be found!`);
                                                any_warnings = true;
                                                return;
                                            } else if(!item_templates[handle]) {
                                                console.warn(`Skipped item: shield handle component "${handle}" couldn't be found!`);
                                                any_warnings = true;
                                                return;
                                            } else {
                                                const item = getItem({components, quality, equip_slot: "off-hand", item_type: "EQUIPPABLE"});
                                                trader_item_list.push({item_key: item.getInventoryKey(), count: save_data.traders[trader_key].inventory[key].count, quality});
                                            }
                                        } else if(internal) { //armor
                                            if(!item_templates[internal]){
                                                console.warn(`Skipped item: internal armor component "${internal}" couldn't be found!`);
                                                any_warnings = true;
                                                return;
                                            } else if(!item_templates[external]) {
                                                console.warn(`Skipped item: external armor component "${external}" couldn't be found!`);
                                                any_warnings = true;
                                                return;
                                            } else {
                                                if(!getArmorSlot(internal)) {
                                                    return;
                                                }

                                                const item = getItem({components, quality, equip_slot: getArmorSlot(internal), item_type: "EQUIPPABLE"});
                                                trader_item_list.push({item_key: item.getInventoryKey(), count: save_data.traders[trader_key].inventory[key].count, quality});
                                            }
                                        } else {
                                            console.error(`Intentory key "${key}" from save on version "${save_data["game version"]} seems to refer to non-existing item type!`);
                                        }
                                    } else if(quality) { //no comps but quality (clothing / artifact?)
                                        const item_id = get_component_name(id);
                                        trader_item_list.push({item_id: item_id, count: save_data.traders[trader_key].inventory[key].count, quality});
                                    } else {
                                        console.error(`Intentory key "${key}" from save on version "${save_data["game version"]} is incorrect!`);
                                    }
                                    
                                } else { //compatibility for saves before v0.4.4
                                    if(Array.isArray(save_data.traders[trader_key].inventory[key])) { //is a list of unstackable (equippable or book) item, needs to be added 1 by 1
                                        for(let i = 0; i < save_data.traders[trader_key].inventory[key].length; i++) {
                                            if(save_data.traders[trader_key].inventory[key][i].item_type === "EQUIPPABLE"){
                                                if(save_data.traders[trader_key].inventory[key][i].equip_slot === "weapon") {
                                                    const {quality} = save_data.traders[trader_key].inventory[key][i];
                                                    let components;
                                                    if(save_data.traders[trader_key].inventory[key][i].components) {
                                                        components = save_data.traders[trader_key].inventory[key][i].components
                                                    } else {
                                                        const {head, handle} = save_data.traders[trader_key].inventory[key][i];
                                                        components = {head, handle};
                                                    }

                                                    Object.keys(components).forEach(comp => components[comp] = get_component_name(components[comp]));

                                                    if(!item_templates[components.head]){
                                                        console.warn(`Skipped item: weapon head component "${components.head}" couldn't be found!`);
                                                        any_warnings = true;
                                                    } else if(!item_templates[components.handle]) {
                                                        console.warn(`Skipped item: weapon handle component "${components.handle}" couldn't be found!`);
                                                        any_warnings = true;
                                                    } else {
                                                        const item = getItem({components, item_type: "EQUIPPABLE", equip_slot: "weapon"});
                                                        trader_item_list.push({item_key: item.getInventoryKey(), count: 1, quality: quality*100});
                                                    }
                                                } else if(save_data.traders[trader_key].inventory[key][i].equip_slot === "off-hand") {
                                                    
                                                    const {quality} = save_data.traders[trader_key].inventory[key][i];
                                                    let components;
                                                    if(save_data.traders[trader_key].inventory[key][i].components) {
                                                        components = save_data.traders[trader_key].inventory[key][i].components
                                                    } else {
                                                        const {shield_base, handle} = save_data.traders[trader_key].inventory[key][i];
                                                        components = {shield_base, handle};
                                                    }

                                                    Object.keys(components).forEach(comp => components[comp] = get_component_name(components[comp]));

                                                    if(!item_templates[components.shield_base]){
                                                        console.warn(`Skipped item: shield base component "${components.shield_base}" couldn't be found!`);
                                                        any_warnings = true;
                                                    } else if(!item_templates[components.handle]) {
                                                        console.warn(`Skipped item: shield handle "${components.handle}" couldn't be found!`);
                                                        any_warnings = true;
                                                    } else {
                                                        //trader_item_list.push({item_key: key, count: 1, quality: quality*100});
                                                        const item = getItem({components, item_type: "EQUIPPABLE", equip_slot: "off-hand"});
                                                        trader_item_list.push({item_key: item.getInventoryKey(), count: 1, quality: quality*100});
                                                    }
                                                } else { //armor
                                                    const {quality} = save_data.traders[trader_key].inventory[key][i];
                                                    if(save_data.traders[trader_key].inventory[key][i].components && save_data.traders[trader_key].inventory[key][i].components.internal.includes(" [component]")) {
                                                        //compatibility for armors from before v0.4.3
                                                        const item = getItem({...item_templates[key]});
                                                        trader_item_list.push({item_key: item.getInventoryKey(), count: 1, quality: quality*100});
                                                    } else if(save_data.traders[trader_key].inventory[key][i].components) {
                                                        let components = save_data.traders[trader_key].inventory[key][i].components;

                                                        Object.keys(components).forEach(comp => components[comp] = get_component_name(components[comp]));

                                                        if(!item_templates[components.internal]){
                                                            console.warn(`Skipped item: internal armor component "${components.internal}" couldn't be found!`);
                                                            any_warnings = true;
                                                        } else if(components.external && !item_templates[components.external]) {
                                                            console.warn(`Skipped item: external armor component "${components.external}" couldn't be found!`);
                                                            any_warnings = true;
                                                        } else {
                                                            //trader_item_list.push({item_key: key, count: 1, quality: quality*100});
                                                            const item = getItem({components, item_type: "EQUIPPABLE", equip_slot: "armor"});
                                                            trader_item_list.push({item_key: item.getInventoryKey(), count: 1, quality: quality*100});
                                                        }
                                                    } else { //no components, so clothing? not sure, it's old stuff
                                                        trader_item_list.push({item_id: key, count: 1, quality: quality*100});
                                                    }
                                                }
                                            } else {
                                                console.warn(`Skipped item, no such item type as "${0}" could be found`)
                                                any_warnings = true;
                                            }
                                        }
                                    } else {
                                        save_data.traders[trader_key].inventory[key].item.value = item_templates[key].value;
                                        if(item_templates[key].item_type === "EQUIPPABLE") {
                                            save_data.traders[trader_key].inventory[key].item.equip_effect = item_templates[key].equip_effect;
                                        } else if(item_templates[key].item_type === "USABLE") {
                                            save_data.traders[trader_key].inventory[key].item.use_effect = item_templates[key].use_effect;
                                        }
                                        trader_item_list.push({item_id: key, count: save_data.traders[trader_key].inventory[key].count});
                                    }
                                }
                            });
                        }

                        trader.last_refresh = save_data.traders[trader_key].last_refresh;
                        trader.emptyInventory();
                        trader.addToInventory(trader_item_list);
                    }
                }
            });
        } else {
            Object.keys(save_data.npcs).forEach(npc_key => {

                const npc = NPCRegistry.get(npc_key);

                if(!npc) {
                    console.warn(`Could not find npc "${npc_key}"`);
                    any_warnings = true;
                    return;
                }
                //dialogue - textline, action, unlock status of all 3
                //trader - inventory, unlock status
                //inventory

                //const npc_availability = npc.getAvailabilityComponent();
                //const dialogue_availability = npc.getDialogueAvailability();
                //const trader_availability = npc.getTraderAvailability();
                
                const dialogue = npc.getDialogueComponent();
                const trader = npc.getTraderComponent();

                //write_availability_status(npc_availability, save_data["npcs"][npc_key]);
                //write_availability_status(dialogue_availability, save_data["npcs"][npc_key]["dialogue"]);
                //write_availability_status(trader_availability, save_data["npcs"][npc_key]["trader"]);

                Object.keys(save_data["npcs"][npc_key]["dialogue"]["textlines"]).forEach(textline_key => {
                    if(!dialogue.textlines[textline_key]) {
                        console.warn(`Could not find textline "${textline_key}" of npc "${npc_key}"`);
                        any_warnings = true;
                        return;
                    }
                    //const textline_availability = dialogue.textlines[textline_key].getAvailabilityComponent();
                    //write_availability_status(textline_availability, save_data["npcs"][npc_key]["dialogue"]["textlines"][textline_key]);
                });

                Object.keys(save_data["npcs"][npc_key]["dialogue"]["actions"]).forEach(action_key => {
                    if(!dialogue.actions[action_key]) {
                        console.warn(`Could not find dialogue action "${action_key}" of npc "${npc_key}"`);
                        any_warnings = true;
                        return;
                    }
                    //const action_availability = dialogue.actions[action_key].getAvailabilityComponent();
                    //write_availability_status(action_availability, save_data["npcs"][npc_key]["dialogue"]["actions"][action_key]);

                    dialogue.actions[action_key].setCurrentProgress(save_data["npcs"][npc_key]["dialogue"]["actions"][action_key]["accumulated_progress"]);
                    dialogue.actions[action_key].setCompletionCount(save_data["npcs"][npc_key]["dialogue"]["actions"][action_key]["completion_count"]);
                });

                if(npc.tags.trader) {
                    trader.last_refresh = save_data["npcs"][npc_key]["trader"]["last_refresh"] ?? -1;
                    //trader.emptyInventory();
                }
            });
        }

        if(is_a_older_than_b(save_data["game version"], "v0.5.1")) {
            //compatibility for some dialogues
            process_rewards({
                rewards: new Rewards({
                    textlines: [{dialogue: "village elder", lines: ["crab rumors"]}]
                }),
                inform_overall: false,
            });

            if(NPCRegistry.get("villageGuard").getDialogueComponent().textlines["hello"].isFinished()) {
                process_rewards({
                    rewards: new Rewards({
                        flags: ["is_guard_met"],
                        textlines: [
                            {dialogue: "village elder", lines: ["about guard"]},
                            {dialogue: "old craftsman", lines: ["about guard"]},
                            {dialogue: "village millers", lines: ["about guard"]},
                        ],
                    }),
                    inform_overall: false,
                });
            }

            if(NPCRegistry.get("villageGuard").getDialogueComponent().textlines["wide"].isFinished()) {
                process_rewards({
                    rewards: new Rewards({
                        textlines: [{dialogue: "village guard", lines: ["hi", "tips 2", "serious", "teach more"]}]
                    }),
                    inform_overall: false,
                });
            }
        }

        if(is_a_older_than_b(save_data["game version"], "v0.5.2")) {
            //dealt with boars but didn't yet start task to deal with ants -> unlock additional line for winter, that explains that more work will be available after winter ends
            let supervisor = NPCRegistry.get("farmSupervisor").getDialogueComponent();
            if(supervisor.textlines["defeated boars"].isFinished() && !supervisor.textlines["troubled"].isFinished()) {
                process_rewards({
                    rewards: new Rewards({
                        textlines: [{dialogue: "farm supervisor", lines: ["troubled unavailable"]}]
                    }),
                    inform_overall: false,
                });
            }
            const elder = NPCRegistry.get("villageElder").getDialogueComponent();
            if(elder.textlines["money"].isFinished()) {
                process_rewards({
                    rewards: new Rewards({
                        textlines: [{dialogue: "village elder", lines: ["other work"]}]
                    }),
                    inform_overall: false,
                });
            }

            if(elder.textlines["cleared cave"].isFinished()) {
                process_rewards({
                    rewards: new Rewards({
                        locks: {
                            textlines: {"village elder": ["leave for materials"]}
                        }
                    }),
                    inform_overall: false,
                });
            }
        }

        set_loading_screen_progress("Hiding rats in your walls");

        Object.keys(save_data.locations || {}).forEach(function(key) {
            if(locations[key]) {
                if(save_data.locations[key].is_unlocked) {
                    locations[key].setUnlocked();
                }

                if(save_data.locations[key].is_finished) {
                    locations[key].setFinished();
                }

                if("parent_location" in locations[key]) { // if combat zone
                    locations[key].enemy_groups_killed = save_data?.locations[key]?.enemy_groups_killed || 0;

                    if(is_a_older_than_b(save_data["game version"], "v0.4.6")) { //compatibility patch for pre-rep and/or pre-rewrite of rewards with required clear count
                        if(locations[key].rewards_with_clear_requirement) {
                            //process rewards with clear req, as these won't be checked on further clears
                            for(let i = 0; i < locations[key].rewards_with_clear_requirement.length; i++) {
                                if(locations[key].enemy_groups_killed == locations[key].enemy_count * locations[key].rewards_with_clear_requirement[i].required_clear_count)
                                {
                                    //always do it if there was enough or more than enough clears
                                    process_rewards({
                                                        rewards: locations[key].rewards_with_clear_requirement[i], source_type: "location", 
                                                        source_name: locations[key].name, is_first_clear: false, source_id: locations[key].id,
                                                        is_from_loading: true
                                                    });
                                }
                            }
                        }
                    } else {
                        if(locations[key].rewards_with_clear_requirement) {
                            //process rewards with clear req, as these won't be checked on further clears
                            for(let i = 0; i < locations[key].rewards_with_clear_requirement.length; i++) {
                                if(locations[key].enemy_groups_killed >= locations[key].enemy_count * locations[key].rewards_with_clear_requirement[i].required_clear_count)
                                {
                                    //always do it if there was enough or more than enough clears
                                    process_rewards({
                                                        rewards: locations[key].rewards_with_clear_requirement[i], source_type: "location", 
                                                        source_name: locations[key].name, is_first_clear: false, source_id: locations[key].id, 
                                                        only_unlocks: true, is_from_loading: true
                                                    });
                                }
                            }
                        }
                    }

                    if(locations[key].first_reward && hasEarnedClear(locations[key].enemy_groups_killed, locations[key].enemy_count)) {
                        //process first clear reward, as it won't be checked on further clears
                        process_rewards({
                            rewards: locations[key].first_reward, 
                            source_type: "location",
                            is_first_clear: true, 
                            source_id: locations[key].id,
                            is_from_loading: true,
                            only_unlocks: true,
                        });
                    }
                }


                if(is_a_older_than_b(save_data["game version"], "v0.6")) {
                    //unlock activities
                    if(save_data.locations[key].unlocked_activities) {
                        for(let i = 0; i < save_data.locations[key].unlocked_activities.length; i++) {
                            if(!locations[key].activities[save_data.locations[key].unlocked_activities[i]]) {
                                continue;
                            }
                            if(save_data.locations[key].unlocked_activities[i] === "plowing the fields") { //old compatibility patch
                                locations[key].activities["fieldwork"].setUnlocked();
                            } else {
                                locations[key].activities[save_data.locations[key].unlocked_activities[i]].setUnlocked();
                            }
                        }
                    }

                    if(save_data.locations[key].actions) {
                        Object.keys(save_data.locations[key].actions).forEach(action_key => {
                            if(save_data.locations[key].actions[action_key].is_unlocked) {
                                locations[key].actions[action_key].setUnlocked();
                                if(locations[key].actions[action_key].keep_progress && save_data.locations[key].actions[action_key].accumulated_progress) {
                                    locations[key].actions[action_key].accumulated_progress = save_data.locations[key].actions[action_key].accumulated_progress;
                                }
                                if(locations[key].actions[action_key].repeatable) {
                                    locations[key].actions[action_key].completion_count = save_data.locations[key].actions[action_key].completion_count || 0;
                                }
                            }

                            if(save_data.locations[key].actions[action_key].is_finished) {
                                locations[key].actions[action_key].setFinished();
                            }

                        });
                    }
                } else {
                    if(save_data.locations[key].actions) {
                        Object.keys(save_data.locations[key].actions).forEach(action_key => {
                            if(locations[key].actions[action_key].isUnlocked()) {
                                if(locations[key].actions[action_key].keep_progress && save_data.locations[key].actions[action_key].accumulated_progress) {
                                    locations[key].actions[action_key].accumulated_progress = save_data.locations[key].actions[action_key].accumulated_progress;
                                }
                                if(locations[key].actions[action_key].repeatable) {
                                    locations[key].actions[action_key].completion_count = save_data.locations[key].actions[action_key].completion_count || 0;
                                }
                            }
                        });
                    }
                }

                if(save_data.locations[key].housing_unlocked) {
                    if(!Object.keys(locations[key].housing).length) {
                        console.warn(`Location "${locations[key].name}" was saved as having a bed unlocked, but it no longer has this mechanic and was skipped!`);
                        any_warnings = true;
                    } else {
                        locations[key].housing.setUnlocked();
                        if(save_data.locations[key].is_unlocked) { //if location itself is unlocked
                            unlocked_beds[key] = true;
                        }
                    }
                } else if(locations[key].housing?.isUnlocked()){ 
                    unlocked_beds[key] = true;
                }

                if(save_data.locations[key].crafting_unlocked) {
                    if(!Object.keys(locations[key].crafting).length) {
                        console.warn(`Location "${locations[key].name}" was saved as having a crafting unlocked, but it no longer has this mechanic and was skipped!`);
                        any_warnings = true;
                    } else {
                        locations[key].crafting.setUnlocked();
                    }
                }
                

            } else {
                console.warn(`Location "${key}" couldn't be found!`);
                any_warnings = true;
                return;
            }
        }); //load for locations their unlocked status and their killcounts

        if(is_a_older_than_b(save_data["game version"], "v0.5")) {
            //unlock status was swapped from local activity to global activity, so a need for this
            if(locations["Nearby cave"].activities["climbing"].isUnlocked()) {
                activities["climbing"].setUnlocked();
            }
        }

        if(is_a_older_than_b(save_data["game version"], "v0.5.1.4")) {
            //lake camp was fused with lake beach
            if(save_data.locations["Lake camp"]?.is_unlocked) {
                locations["Lake beach"].housing.setUnlocked();

                if(save_data["current location"] === "Lake camp") {
                    save_data["current location"] = "Lake beach";
                }
            }
        }

        if(is_a_older_than_b(save_data["game version"], "v0.5.1.11")) {
            if(locations["Lake beach"].actions["create lake camp"].isFinished()) {
                process_rewards({
                    rewards: new Rewards({
                        crafting: ["Lake beach"],
                    }), 
                    inform_overall: false
                });
            }
        }

        if(is_a_older_than_b(save_data["game version"], "v0.5.1.5")) {
            if(last_location_with_bed === "Lake camp") {
                last_location_with_bed = "Lake beach";
            }

            if(locations["Lake beach"].actions["create lake camp"].isFinished()) {
                process_rewards({
                    rewards: new Rewards({
                        housing: ["Lake beach"],
                    }), 
                    inform_overall: false
                });
            }
        }

        if(is_a_older_than_b(save_data["game version"], "v0.4.6.7")) {
            locations["Town square"].getAvailabilityComponent().setStatus({is_unlocked: false});
            if(save_data["current location"] === "Town square") {
                save_data["current location"] = "Village";
            }
            //tiny lock and location swap as it was accidentally unlocked in 4.6.0 - 4.6.6
        }
        
        if(is_a_older_than_b(save_data["game version"], "v0.6")) {
            Object.keys(save_data.activities).forEach(activity_key => {
                if(activities[activity_key]) {
                    activities[activity_key].getAvailabilityComponent().setStatus({is_unlocked: save_data.activities[activity_key].is_unlocked || false});
                } else if(activity_key === "plowing the fields") { //old compatibility patch
                    activities["fieldwork"].getAvailabilityComponent().setStatus({is_unlocked: save_data.activities[activity_key].is_unlocked || false});
                } else {
                    console.warn(`Activity "${activity_key}" couldn't be found!`);
                    any_warnings = true;
                }
            });
        }
        
        if(is_a_older_than_b(save_data["game version"], "v0.5")) {
            //save from before v0.5: 
            // - split sold count equally between traders
            // - add an "Old shovel"
            const loot_count = {};
            const divisor = Object.keys(market_region_mapping).length;
            Object.keys(save_data.loot_sold_count).forEach(loot_key => {
                const count = save_data.loot_sold_count[loot_key];
                Object.keys(market_region_mapping).forEach(region_key => {
                    if(!loot_count[region_key]) {
                        loot_count[region_key] = {};
                    }
                    
                    loot_count[region_key][loot_key] = [{sold: 0, recovered: 0}];
                    loot_count[region_key][loot_key][0].sold = Math.floor(count.sold/divisor);
                    loot_count[region_key][loot_key][0].recovered = Math.floor(count.recovered/divisor);
                });
            });
            set_loot_sold_count(loot_count);
            
            if(NPCRegistry.get("old craftsman").getDialogueComponent().textlines["learn"].isFinished()) {
                character.addToInventory([{item_id: "Old shovel"}]);
            }
        } else if(is_a_older_than_b(save_data["game version"], "v0.5.0.22") && is_a_older_than_b("v0.5", save_data["game version"])) {
            //save between 0.5 and trickle rate fix
            const loot_count = {};
            
            Object.keys(save_data.loot_sold_count).forEach(region_key => {
                loot_count[region_key] = {};
                Object.keys(save_data.loot_sold_count[region_key]).forEach(trade_key => {
                    loot_count[region_key][trade_key] = [];
                    for(let i = 0; i < save_data.loot_sold_count[region_key][trade_key].length; i++) {
                        if(save_data.loot_sold_count[region_key][trade_key][i].sold > capped_at) {
                            console.warn(`Encountered a large sold count (${save_data.loot_sold_count[region_key][trade_key][i].sold}) of a trade group "${trade_key}" at tier ${i}. Due to the save being from a game version where a certain bug`
                                    + ` could make these values keep growing by themselves, it was reduced to ${capped_at}, and it's recovered_count was lowered proportionally.`);

                            const ratio = save_data.loot_sold_count[region_key][trade_key][i].recovered/save_data.loot_sold_count[region_key][trade_key][i].sold;
                            save_data.loot_sold_count[region_key][trade_key][i].sold = capped_at;
                            save_data.loot_sold_count[region_key][trade_key][i].recovered = capped_at*ratio;
                        }

                        loot_count[region_key][trade_key].push({sold: save_data.loot_sold_count[region_key][trade_key][i].sold, recovered: save_data.loot_sold_count[region_key][trade_key][i].recovered});
                    }
                });
            });

            set_loot_sold_count(loot_count);
        } else {
            //set it normally
            set_loot_sold_count(save_data.loot_sold_count || {});
        }

        //load active effects if save is not from before their rework
        if(compare_game_version(save_data["game version"], "v0.4.4") >= 0){
            Object.keys(save_data.active_effects).forEach(function(effect) {
                active_effects[effect] = restoreActiveEffect(effect,save_data.active_effects[effect]);
            });
            character.addActiveEffectBonus(active_effects);
        }

        set_loading_screen_progress("Hiding from the vet");

        if(save_data.character.hp_to_full == null || save_data.character.hp_to_full >= full_stats.max_health) {
            full_stats.health = 1;
        } else {
            full_stats.health = full_stats.max_health - save_data.character.hp_to_full;
        }
        
        //if missing hp is null (save got corrupted) or its more than max_health, set health to minimum allowed (which is 1)
        //otherwise just do simple substraction
        //then same with stamina below
        if(save_data.character.stamina_to_full == null || save_data.character.stamina_to_full >= full_stats.max_stamina) {
            full_stats.stamina = 0;
        } else {
            full_stats.stamina = full_stats.max_stamina - save_data.character.stamina_to_full;
        }

        set_loading_screen_progress("Hiding rats in your walls (again!)");

        if(save_data["enemy_killcount"]) {
            Object.keys(save_data["enemy_killcount"]).forEach(enemy_name => {
                enemy_killcount[enemy_name] = save_data["enemy_killcount"][enemy_name];
                create_new_bestiary_entry(enemy_name);
            });
        }

        set_loading_screen_progress("Looking for things that can be done tomorrow instead");

        if(save_data["quests"]) {
            Object.keys(save_data["quests"]).forEach(quest => {
                if(quest===TIDEMARK_IDS.quest)return; // The destination bridge restores its exact tasks without rewards.

                if(save_data["quests"][quest].is_finished) {
                    //finished => all tasks are also finished, don't care about their specifics
                    for(let i = 0; i < quests[quest].quest_tasks.length; i++) {
                        quests[quest].quest_tasks[i].setFinished();
                    }
                    questManager.startQuest({quest_id: quest, should_inform: false});
                    questManager.finishQuest({quest_id: quest, should_inform: false, only_unlocks: true, is_from_loading: true});

                } else if(save_data["quests"][quest].is_active) {
                    questManager.startQuest({quest_id: quest, should_inform: false});
                    //active => at least 1 task is unfinished and its specifics matter
                    for(let i = 0; i < save_data["quests"][quest].task_status.length-1; i++) {
                        //set all but last to finished
                        questManager.finishQuestTask({quest_id: quest, task_index: i, only_unlocks: true, skip_warning: true, skip_message: true, is_from_loading: true});
                    }

                    //set progress of the first unfinished task
                    const unfinished_index = save_data["quests"][quest].task_status.length-1;
                    const first_unfinished_task = save_data["quests"][quest].task_status[unfinished_index].progress;


                    Object.keys(first_unfinished_task || {}).forEach(task_group => {
                        if(!quests[quest].quest_tasks[unfinished_index].task_condition[task_group]) {
                            console.warn(`Skipped loading progress for quest "${quest}", no such task group as "${task_group}" was present.`);
                            any_warnings = true;
                            return;
                        }
                        Object.keys(first_unfinished_task[task_group]).forEach(task_type =>{
                            if(!quests[quest].quest_tasks[unfinished_index].task_condition[task_group][task_type]) {
                                console.warn(`Skipped loading progress for quest "${quest}", no such task type as "${task_type}" was present.`);
                                any_warnings = true;
                                return;
                            }
                            Object.keys(first_unfinished_task[task_group][task_type]).forEach(task_target_id => {
                                if(!quests[quest].quest_tasks[unfinished_index].task_condition[task_group][task_type][task_target_id]) {
                                    console.warn(`Skipped loading progress for quest "${quest}", no such task target as "${task_target_id}" was present.`);
                                    any_warnings = true;
                                    return;
                                }
                                quests[quest].quest_tasks[unfinished_index].task_condition[task_group][task_type][task_target_id].current = first_unfinished_task[task_group][task_type][task_target_id].current;
                            });
                        });
                    });
                    if(!quests[quest].is_hidden) {
                        update_displayed_quest(quest);
                    }
                }
            });
        }

        //save from before quests, need to manually setup story quests
        if(is_a_older_than_b(save_data["game version"], "v0.5.0")){
            
            let elder = NPCRegistry.get("villageElder").getDialogueComponent();
            //memory line
            questManager.startQuest({quest_id: "Lost memory", should_inform: false});
            if(elder.textlines["what happened"].isFinished()) {
                questManager.finishQuestTask({quest_id: "Lost memory", task_index: 0, skip_message: true});

                if(elder.textlines["need to"].isFinished()) {
                    questManager.finishQuestTask({quest_id: "Lost memory", task_index: 1, skip_message: true});

                    if(elder.textlines["cleared cave"].isFinished()) {
                        questManager.finishQuestTask({quest_id: "Lost memory", task_index: 2, skip_message: true});
    
                        if(elder.textlines["defeated"].isFinished()) {
                            questManager.finishQuestTask({quest_id: "Lost memory", task_index: 3, skip_message: true});
                        }
                    }
                }
            }

            //rat saga line
            if(locations["Suspicious wall"].isFinished()) {
                questManager.startQuest({quest_id: "The Infinite Rat Saga", should_inform: false});

                if(locations["Mysterious gate"].enemy_groups_killed >= locations["Mysterious gate"].enemy_count) {
                    questManager.finishQuestTask({quest_id: "The Infinite Rat Saga", task_index: 0, skip_message: true});

                    if(locations["Nearby cave"].actions["open the gate"].isFinished()) {
                        questManager.finishQuestTask({quest_id: "The Infinite Rat Saga", task_index: 1, skip_message: true});

                        if(locations["Writhing tunnel"].enemy_groups_killed >= locations["Writhing tunnel"].enemy_count) {
                            questManager.finishQuestTask({quest_id: "The Infinite Rat Saga", task_index: 2, skip_message: true});
                        }
                    }
                }
            }

            let puppy = NPCRegistry.get("suspiciousMan").getDialogueComponent();
            //slums line
            if(puppy.textlines["gang"].isFinished()) {
                questManager.startQuest({quest_id: "Light in the darkness", should_inform: false});
                questManager.finishQuestTask({quest_id: "Light in the darkness", task_index: 0, skip_message: true});

                if(locations["Gang hideout"].isFinished()) {
                    questManager.finishQuestTask({quest_id: "Light in the darkness", task_index: 1, skip_message: true});
                }
            }

            let supervisor = NPCRegistry.get("farmSupervisor").getDialogueComponent();

            //town farm quest
            if(supervisor.textlines["fight0"].isFinished() || supervisor.textlines["fight"].isFinished()) {
                questManager.startQuest({quest_id: "Ploughs to swords", should_inform: false});

                if(supervisor.textlines["fight"].isFinished()) {
                    questManager.finishQuestTask({quest_id: "Ploughs to swords", task_index: 0, skip_message: true});
                    
                    if(supervisor.textlines["defeated boars"].isFinished()) {
                        questManager.finishQuestTask({quest_id: "Ploughs to swords", task_index: 1, skip_message: true});
                    }
                }
            }
        }

        //repeated because "fight" textline was originally not included, causing issues
        if(is_a_older_than_b(save_data["game version"], "v0.5.0.7") && is_a_older_than_b("v0.5.0", save_data["game version"])){ 
            let supervisor = NPCRegistry.get("farmSupervisor").getDialogueComponent();
             if(supervisor.textlines["fight0"].isFinished() || supervisor.textlines["fight"].isFinished()) {
                questManager.startQuest({quest_id: "Ploughs to swords", should_inform: false});

                if(supervisor.textlines["fight"].isFinished()) {
                    questManager.finishQuestTask({quest_id: "Ploughs to swords", task_index: 0, skip_message: true});
                    
                    if(supervisor.textlines["defeated boars"].isFinished()) {
                        questManager.finishQuestTask({quest_id: "Ploughs to swords", task_index: 1, skip_message: true});
                    }
                }
            }
        }

        //continuation for compatibility
        let supervisor = NPCRegistry.get("farmSupervisor").getDialogueComponent();
        if(supervisor.textlines["defeated boars"].getAvailabilityComponent().getStatus().is_finished) {
            supervisor.textlines["troubled"].setUnlocked();
        }
        
        set_loading_screen_progress("Mixing catnip with more catnip");

        if(save_data["recipes"]) {
            Object.keys(save_data["recipes"]).forEach(category => {
                Object.keys(save_data["recipes"][category]).forEach(subcategory => {
                    Object.keys(save_data["recipes"][category][subcategory]).forEach(recipe_id => {
                        if(!recipes[category][subcategory][recipe_id]) {
                            if(is_a_older_than_b(save_data["game version"], "v0.5.0")){
                                if(
                                    (
                                        category === "crafting" 
                                        && subcategory === "items" 
                                        && (recipes["butchering"]["items"][recipe_id] || recipes["woodworking"]["items"][recipe_id])
                                    )
                                    || recipe_id === "Shield base" 
                                    || recipe_id === "Shield handle"
                                ) {
                                    //don't warn as they were moved to different category
                                    return;
                                }
                            }

                            console.warn(`Could not find recipe "${category}"->"${subcategory}"->"${recipe_id}". It might have been removed.`);
                            any_warnings = true;
                            return;
                        }
                        if(save_data["recipes"][category][subcategory][recipe_id].is_unlocked) {
                            recipes[category][subcategory][recipe_id].setUnlocked();
                        }
                        if(save_data["recipes"][category][subcategory][recipe_id].is_finished) {
                            recipes[category][subcategory][recipe_id].setFinished();
                        }
                    });
                });
            });
        }

        if(save_data.npc_equipment) {
            const actors = NPCRegistry.getAll();
            prepareNativeEquipment(save_data.npc_equipment, {actors, getItem: getItemFromKey}).publish();
        }
        projectNativePeopleBodies();
        set_loading_screen_progress("Doing some finishing pats");

        if(save_data.favourite_locations) {
            Object.keys(save_data.favourite_locations).forEach(location_key => {
                if(locations[location_key]) {
                    if(!locations[location_key]?.housing?.isUnlocked()) { 
                        //tiny little check that's not even worth including a version comparison in it
                        //adds location to favs only if it is not an unlocked housing
                        favourite_locations[location_key] = true;
                    }
                } else {
                    console.warn(`Saved favourite locations included "${location_key}", which is not a valid location id`);
                    any_warnings = true;
                }
            });
        }

        if(save_data.skill_list_state) {
            Object.keys(save_data.skill_list_state).forEach(index => {
                if (skill_list.childElementCount > 0 && save_data.skill_list_state[index]) {
                    skill_list.children[index].classList.add("skill_category_expanded");
                }
            })
        }

        tidemarkNative.restore(save_data);
        nestedNative.restore(save_data);
        paradiseNative.restore(save_data);
        molNative.restore(save_data);
        proto23Native.restore(save_data);
        causalNative.restore(save_data);
        validateAuditRemainderNative(expansionState,gameplaySnapshot());
        refreshCausalQuests();
        refreshTidemarkQuest();
    refreshNestedQuests();
        character.updateStatsAndDisplay();
        update_displayed_character_inventory();

        update_displayed_health();
        //load current health
        
        update_displayed_effects();
        
        create_displayed_crafting_recipes();
        change_location({location_id: save_data["current location"], skip_travel_time: true, do_quest_events: false, skip_combat: true});
        refreshStatusCareStats(true);

        //temperature and background are location dependent so display settings are loaded after location is set
        game_options.use_uncivilised_temperature_scale = save_data.options?.use_uncivilised_temperature_scale;
        option_use_uncivilised_temperature_scale(game_options.use_uncivilised_temperature_scale);

        game_options.change_background_color = save_data.options?.change_background_color;
        option_change_background_color(game_options.change_background_color);

        game_options.do_dynamic_loot_message = save_data.options?.do_dynamic_loot_message;
        option_do_dynamic_loot_message(game_options.do_dynamic_loot_message);

        //set activity if any saved
        if(save_data.current_activity) {
            //search for it in location from save_data
            const activity_id = save_data.current_activity.activity_id;
            if(typeof activity_id !== "undefined" && current_location.activities[activity_id] && activities[current_location.activities[activity_id].activity_name]) {
                
                start_activity(activity_id);
                if(activities[current_location.activities[activity_id].activity_name].type === "JOB") {
                    current_activity.earnings = save_data.current_activity.earnings * ((is_from_before_eco_rework == 1)*10 || 1);
                    document.getElementById("action_end_earnings").innerText = `(pay accrued on stopping: ${format_money(current_activity.earnings)})`;
                } else if(activities[current_location.activities[activity_id].activity_name].type === "GATHERING") {
                    //current_activity.gathered_materials = save_data.current_activity.gathered_materials || {};
                    //pretty sure this was used only for logging purposes, but let's just leave it commented out instead of deleting
                }

                current_activity.gathering_time = save_data.current_activity.gathering_time;
                
            } else {
                console.warn(`Couldn't find saved activity "${activity_id}"! It might have been removed`);
                any_warnings = true;
            }
        }

        if(save_data.is_sleeping) {
            start_sleeping();
        }
        if(save_data.is_reading) {
            start_reading(save_data.is_reading);
        }

        if(any_warnings) {
            set_loading_screen_warnings_warning();
        }

        update_displayed_time();
        set_loading_screen_versions(save_data["game version"]);
        if(any_warnings) foundationSaveBlocked = true;
        return {warnings: any_warnings};
    } catch(error) {
        foundationSaveBlocked = true;
        set_loading_screen_versions(save_data["game version"]);
        throw error;
    } finally {
        loadingReputationTotals = null;
        restoringNativeSave = false;
    }
} 

/**
 * called from index.html;
 * loads game from file by resetting everything that needs to be reset and then calling main loading method with same parameter;
 * @param {String} save_string 
 */
async function load_from_file(save_string) {
    if(importProbeToken || importInProgress) return;
    if(!ownsSave) {log_message("Import blocked: this tab is read-only.", "message_critical"); return;}
    importInProgress = true;
    try {
        await importSaveFile(save_string, {currentVersion: game_version, preflight: preflightImport,
            storage: lifeSaveStorage, key: is_on_dev() ? dev_save_key : save_key});
        window.location.reload(false);
    } catch (error) {
        log_message("Import rejected. Current save kept. " + error.message, "message_critical");
    } finally {
        importInProgress = false;
    }
} 

/**
 * loads the game from localStorage
 * it's called when page is refreshed, so there's no need for it to reset anything
 */
function load_from_localstorage() {
    try{
        if(is_on_dev()) {
            if(localStorage.getItem(dev_save_key)){
                load(JSON.parse(localStorage.getItem(dev_save_key)));
                log_message("Loaded dev save. If you want to use save from live version, import it through options panel or manually");
            } else {
                //no need to check if it should import or do a fresh start (in case it's a result of hard reset), as that's already handled elsewhere
                load(JSON.parse(localStorage.getItem(save_key)));
                log_message("Dev save was not found. Loaded live version save.");
            }
        } else {
            load(JSON.parse(localStorage.getItem(save_key)));
        }
    } catch(error) {
        is_loading_error = true;
        set_loading_screen_progress("Something went wrong 😭");
        set_loading_screen_errors_warning();
        console.error("Something went wrong on loading from localStorage!");
        console.error(error);
    }
}

async function restoreStoredSave(sourceKey) {
    if(!ownsSave) {log_message("Restore blocked: this tab is read-only.", "message_critical"); return;}
    const serialized = localStorage.getItem(sourceKey);
    if(!serialized) {log_message("There is no saved progress to restore.", "notification"); return;}
    try {await load_from_file(encodeSaveFile(serialized));}
    catch(error) {log_message("Restore rejected. Current save kept. " + error.message, "message_critical");}
}

function load_backup() {return restoreStoredSave(is_on_dev() ? dev_backup_key : backup_key);}
function load_other_release_save() {return restoreStoredSave(is_on_dev() ? save_key : dev_save_key);}

function hard_reset() {
    if(!ownsSave) {log_message("This tab is read-only. Close the other game tab and reload.", "message_critical"); return;}
    let confirmation = prompt(`This will erase all your progress and you will have to start from the very beginning. If you are sure this is what you want, type "reset" below`);

    if(confirmation === "reset" || confirmation === `"reset"`) {
        if(is_on_dev()) {
            localStorage.removeItem(dev_save_key);
            localStorage.setItem("skip_live_import", "true");
        } else {
            localStorage.removeItem(save_key);
        }
        window.location.reload();
        return false;
    } else {
        console.log("Hard reset was cancelled.");
    }
}

//update game time
function update_timer(time_in_minutes, source = null) {
    if(optionalPackState.pendingStructured&&!optionalPackState.structured)return 0;
    if(Object.values(optionalPackState.packs).some(r=>r.active)) {
        if(importProbeToken||!ownsSave||foundationSaveBlocked||is_loading_error||lifeStorageFailure)return 0;
        const minutes=time_in_minutes??1;
        try {
            // Use the same joined clock and durable boundary as native played
            // time. World-scoped consumers retain their existing absence policy.
            const plan=advanceChroniclePlan({state:expansionState,external:{money:character.money},gameplay:gameplaySnapshot()},minutes);
            const consumed=plan.state.clock-expansionState.clock;
            if(!consumed)return 0;
            const {state:next,pay,settled}=advancePackSettlement(optionalPackState,optionalPacks,consumed);
            plan.external.money+=pay;
            plan.nativePatch={...plan.nativePatch,content_packs:packSaveState(next,optionalPacks)};
            persistExpansion(plan);
            optionalPackState=next;optionalPackPanel?.render();update_displayed_time();
            for(const s of settled)log_message(`${s.label} finished${s.pay?`; earned ${s.pay} wood coins`:''}.`,'notification');
            return consumed;
        }catch(error){log_message('Optional work paused: '+error.message,'notification');return 0;}
    }
    if(backlogNativeClockPaused(expansionState)){backlogPanel?.render();replacementRecognitionPanel?.render();backlogOpeningPanel?.render();knownRoutesPanel?.render();adventureNotebook?.render();return 0;}
    const was_night = is_night(current_game_time);
    const minutes = time_in_minutes ?? (is_sleeping ? config.time_speedup_when_sleeping : 1);
    if(minutes === 0) return 0;
    if(usesJoinedClock()) {
        if(importProbeToken || !ownsSave || expansionError || foundationSaveBlocked || is_loading_error || expansionState.chronicle?.life.endedAt != null) return 0;
        if(expansionState.simulation?.sessions.player || waitingSimulationChoice(expansionState)) {frontierCampaignPanel?.render();featureExpansionPanel?.render();foundationInteractionPanel?.render();causalStoryPanel?.render();simulationPanel?.render(); pursuitPanel?.render(); fieldPanel?.render(); promisePanel?.render(); crushSocialPanel?.render(); managementPanel?.render(); knownRoutesPanel?.render();adventureNotebook?.render(); return 0;}
        if(expansionState.chronicle?.session?.policy === "manual") {chroniclePanel?.render(); return 0;}
        try {
            const response = expansionState.chronicle && automaticResponse(expansionState.chronicle);
            const pendingJourney=expansionState.actors.player.facts['original_frontier.travel.remaining']>0;
            const plan = response ? makeChroniclePlan({type: "respond", action: response}) : pendingJourney ? advanceFrontierJourney({state:expansionState,external:{money:character.money},gameplay:gameplaySnapshot()},minutes) : advanceChroniclePlan({state: expansionState, external: {money: character.money}, gameplay: gameplaySnapshot()}, minutes, source === "travel");
            const consumed = plan.state.clock - expansionState.clock;
            persistExpansion(plan);
            if(was_night !== is_night(current_game_time)) character.updateStatsAndDisplay();
            if(expansionState.chronicle?.life.endedAt != null) {if(current_combat) end_combat(); character.is_alive = false;}
            expeditionPanel?.render(); techniquePanel?.render(); chroniclePanel?.render(); villagePanel?.render(); simulationPanel?.render();
            return consumed;
        } catch(error) {
            console.error("Joined clock paused:", error); log_message(`Progress paused: ${error.message}`, "notification");
            if(expansionState.chronicle?.session && !foundationSaveBlocked) {
                persistExpansion(makeChroniclePlan({type: "policy", policy: "manual"}));
                chroniclePauseReason = `Prepared plan stopped: ${error.message} Withdraw or choose a supported response.`;
            } else expansionError ||= error.message;
            chroniclePanel?.render(true); return 0;
        }
    }
    current_game_time.goUp(minutes);
    refreshCustomization();
    advanceExpeditions(minutes);
    if(localLife.lastClock!==calendarMinutes(current_game_time)) {
        try{const state=structuredClone(expansionState);dispatchLocalLifePlan(advanceSavedLocalLife(state,localLifeContext()),state);}
        catch(error){console.error('Local life paused:',error);log_message(error.message,'notification');return 0;}
    }

    //character.updateStatsAndDisplay(); //done every second, probably only used for day-night cycle at this point
    const daynight_change = was_night !== is_night(current_game_time);
    if(daynight_change) {
        character.updateStatsAndDisplay();
    }
    
    update_displayed_time();
    return minutes;
}

function progress_time({value = 0, source}) {
    const consumed = update_timer(value, source);
    if(consumed && !usesJoinedClock()) update_effect_durations({time_in_minutes: consumed, is_sleep: is_sleeping, is_travel: source==="travel"});
}

/**
 * 
 * @param {Object} param0
 * @param {String} param0.source skipped -> assume it's normal game ticks
 */
function update_effect_durations({time_in_minutes = 1, is_travel}) {
    let were_stats_updated = false;
    Object.keys(active_effects).forEach(key => {
        if(!is_travel || is_travel && active_effects[key].affected_by_travel) {

            if(time_in_minutes == 1 && is_sleeping && active_effects[key].tags.debuff) {
                time_in_minutes = config.time_speedup_when_sleeping;
            }

            active_effects[key].duration-= time_in_minutes;
            if(active_effects[key].duration <= 0) {
                //duration ended - remove effect
                delete active_effects[key];
                character.addActiveEffectBonus(active_effects);
                character.updateStatsAndDisplay();
                were_stats_updated = true; //only for use later, as skipping update in here would be bad
            }
        }
    });

    return were_stats_updated;
}

function update() {
    setTimeout(() => {
        end_date = Date.now();
        //basically when previous tick ends, used for timer smoothing

        time_variance_accumulator += ((end_date - start_date) - 1000/tickrate);
        //duration of previous tick, minus time it was supposed to take
        //important to keep it between setting end_date and start_date, so they are 2 completely separate values

        start_date = Date.now();
        /*
        basically when current tick starts
        so before this assignment, start_date is when previous tick started
        and end_date is when previous_tick ended
        */

        let were_stats_updated = false;
        const prev_day = current_game_time.day_count;
        const advancedMinutes = update_timer();
        furniturePanel?.render();localLifePanel?.render();fortControls?.render();pacingPanel?.render();pacingStatusPanel?.render();durabilityPanel?.render();elementalPanel?.render();
        if(!advancedMinutes || expansionState.chronicle?.life.endedAt != null) {update(); return;}

        if(start_date - last_rewarded_export > config.time_between_export_rewards) {
            document.getElementById("save_to_file_button").classList.add("export_button_with_reward");
        } else {
            document.getElementById("save_to_file_button").classList.remove("export_button_with_reward");
        }

        update_export_button_tooltip(start_date - last_rewarded_export, config.time_between_export_rewards);

        const curr_day = current_game_time.day_count;
        if(curr_day > prev_day) {
            // CH1 dormant seed: first won fight or day 3.
            awakenOptionalStart();
            recover_item_prices(config.trade_price_recovery_flat, config.trade_price_recovery_ratio);
            trickle_market_saturations(config.market_saturation_trickle_rate);
            if(is_in_trade()) {
                //update displayed prices due to recovery
                update_displayed_character_inventory({is_trade: true});
                update_displayed_trader_inventory();
            }
        }

        //update effect durations and displays;
        were_stats_updated = were_stats_updated || (!usesJoinedClock() && update_effect_durations({time_in_minutes: 1}));
        update_displayed_effect_durations();
        update_displayed_effects();

        const optionalWeather=getPacingEffects(homePacingContext());
        const new_temperature = get_current_temperature_smoothed()+optionalWeather.temperatureOffset;

        if(!current_location.is_under_roof) {
            //not under roof, background animations can happen
            if(optionalWeather.raining) {
                if(rain_counter >= time_until_wet) {
                //been in rain long enough, add wet even if present
                    add_active_effect("Wet",30);
                } else {
                    //haven't been in rain long enough, increase the counter

                    if(new_temperature < 0)
                        //snowing, doesn't soak the player as much the rain
                        rain_counter += 0.25 * statusCareRainMultiplier(expansionState,{nativeBody:currentNativeBody(),nativeAlive:character.is_alive===true}) * structuredEquipmentView().rainMultiplier
                    else 
                        rain_counter += statusCareRainMultiplier(expansionState,{nativeBody:currentNativeBody(),nativeAlive:character.is_alive===true}) * structuredEquipmentView().rainMultiplier;
                }

                if(!was_raining && game_options.do_background_animations) {

                    window.removeEventListener("resize", start_stars_animation);

                    if(new_temperature >= 0) {
                        window.addEventListener("resize", start_rain_animation);
                        window.removeEventListener("resize", start_snow_animation);
                        start_rain_animation();
                    } else {
                        window.addEventListener("resize", start_snow_animation);
                        window.removeEventListener("resize", start_rain_animation);
                        start_snow_animation();
                    }
                }

                was_raining = true && game_options.do_background_animations;
            } else {
                //not raining

                if(rain_counter > 0) {
                    //not in rain -> reduce rain counter
                    rain_counter--;
                }
                was_raining = false;

                //not in rain -> sky visible
                if(!was_starry && is_night()) {

                    if(game_options.do_background_animations) {
                        window.addEventListener("resize", start_stars_animation);
                        window.removeEventListener("resize", start_snow_animation);
                        window.removeEventListener("resize", start_rain_animation);
                        start_stars_animation();
                    }
                    was_starry = true && game_options.do_background_animations;
                } else if(was_starry && !is_night()) {
                    stop_background_animation();
                    window.removeEventListener("resize", start_stars_animation);
                }
            }

            if(game_options.change_background_color) {
                set_light_based_background_color(true);
            }
            
        } else {
            //under roof
            if(was_raining || was_starry) {
                //was animation - stop doing that
                stop_background_animation();
                window.removeEventListener("resize", start_stars_animation);
                window.removeEventListener("resize", start_snow_animation);
                window.removeEventListener("resize", start_rain_animation);
            }
            was_raining = false;
            was_starry = false;
            if(game_options.change_background_color) {
                set_light_based_background_color(false);
            }
        }

        //temperature changed => update stats if needed, update display
        if(current_temperature !== new_temperature) {
            if(!were_stats_updated) {
                character.updateStatsAndDisplay();
            }

            update_displayed_temperature();
        }
        
        current_temperature = new_temperature;

        //add cold status if applicable
        let was_effect_added = false;
        for(let i = cold_status_temperatures.length - 1; i >= 0; i--) {
            if(current_temperature + character.getColdTolerance() <= cold_status_temperatures[i]) {
                if((active_effects["Wet"] && cold_status_counters[i] >= time_until_cold_when_wet) || (cold_status_counters[i] >= time_until_cold)) {
                    if(was_effect_added) {
                        continue;
                    }
                    add_active_effect(cold_status_effects[i],60);
                } else {
                    cold_status_counters[i]++;
                }

                add_xp_to_skill({skill: skills["Cold resistance"], xp_to_add: 0.2});
            } else {
                if(cold_status_counters[i] > 0) {
                    cold_status_counters[i]--;
                }
            }
        }

        if("parent_location" in current_location){ //if it's a combat zone

            //use consumables if their longest effect ran out
            //remove them from list if there are no more in inventory
            Object.keys(favourite_consumables).forEach(item_id => {
                const inv_key = item_templates[item_id].getInventoryKey();
                if(!character.getItems()[inv_key]) {
                    //if out of item, remove it from auto-consume
                    remove_consumable_from_favourites(item_id);
                    return;
                }

                const effects = item_templates[item_id].effects.sort((a,b) => {
                    if(game_options.auto_use_when_longest_runs_out) {
                        return b.duration-a.duration;
                    } else {
                        return a.duration-b.duration;
                    }
                });

                //if effect not active, use item and return
                if(!active_effects[effects[0].effect]) {
                    use_item(inv_key);
                    //use will call 'remove item' which will call 'remove consumable from favs', so nothing more to do here
                    return;
                }
            });


            //go through location's types, check if any of them apply active effects, if so then add them
            for(let i = 0; i < current_location.types.length; i++) {
                const effect_key = current_location.types[i].type;
                const stage = current_location.types[i].stage;
                if(location_types[effect_key].stages[stage].applied_effects) {
                    for(let j = 0; j < location_types[effect_key].stages[stage].applied_effects.length; j++) {
                        add_active_effect(location_types[effect_key].stages[stage].applied_effects[j].effect, location_types[effect_key].stages[stage].applied_effects[j].duration);
                    }
                }
            }

            add_xp_to_skill({skill: skills["Breathing"], xp_to_add: 0.1});
        } else { //everything other than combat
            if(is_sleeping) {
                do_sleeping();
                add_xp_to_skill({skill: skills["Sleeping"], xp_to_add: current_location.housing?.sleeping_xp_per_tick});
            }
            else {
                if(is_resting) {
                    do_resting();
                }
                if(is_reading) {
                    do_reading();
                }
            } 

            if(selected_stance.id !== current_stance.id) {
                change_stance({stance_id: selected_stance.id});
            }

            if(villageCareer.recruit) {
                const p=npcLives?.people.find(p=>p.id==='iona');
                const next=advanceVillageMentor(villageCareer,{inVillage:current_location.id==='Village' && expansionState.actors.player.worldId==='base.frontier',alive:character.is_alive===true && !!p && current_game_time.year<p.deathYear,patrolling:current_activity?.id==='patrolling'});
                if(next.recruit.soloPatrols>villageCareer.recruit.soloPatrols) {
                    // Report, stipend and first biography publish together after durable storage.
                    try {
                        const save=JSON.parse(create_save());save.village_career=next;const payment=villageCareer.recruit.covering?COVER_PAYMENT:SOLO_PAYMENT;save.character.money+=payment;
                        if(next.recruit.soloPatrols===1) {const t=save['current time'];save.life_record=appendLifeMilestone(save.life_record,{year:t.year,at:lifeCalendarMinute(t),worldId:'base.frontier',kind:'career',text:`Iona first patrolled Village alone using the Watchcraft you taught her. Tessa paid your career a ${payment}-coin ${villageCareer.recruit.covering?'covered-shift payment':'stipend'}.`});}
                        lifeSaveStorage.setItem(is_on_dev()?dev_save_key:save_key,JSON.stringify(save));add_money_to_character(payment);
                        log_message(`Iona returns with a clear solo report. Tessa pays ${payment} coins; Iona remembers ${next.recruit.taughtBy} as her teacher.`);
                    } catch(error) {log_message(`Iona’s report could not be saved: ${error.message}`);}
                } else villageCareer=next;
            }
            if(villageCareer.watchcraft.tutoring) {
                const before=villageCareer.watchcraft.tutorMinutes;
                villageCareer=advanceTessaInstruction(villageCareer,{inVillage:current_location.id==='Village' && expansionState.actors.player.worldId==='base.frontier',alive:character.is_alive===true,meditating:current_activity?.id==='meditating'});
                if(before<6 && villageCareer.watchcraft.tutorMinutes===6){log_message('Tessa’s instruction is complete. Watchcraft is known; rehearse it for five more minutes before use.');end_activity();}
            }
            if(current_activity) { //in activity
                if(villageCareer.watchcraft.issued && villageCareer.watchcraft.practiceMinutes<WATCHCRAFT_PRACTICE) {
                    const before=villageCareer.watchcraft.practiceMinutes;
                    villageCareer=practiceWatchcraft(villageCareer,{known:watchcraftKnown(),location:current_location.id,activity:current_activity.id,worldId:expansionState.actors.player.worldId,alive:character.is_alive===true});
                    if(before<WATCHCRAFT_PRACTICE && villageCareer.watchcraft.practiceMinutes===WATCHCRAFT_PRACTICE)
                        log_message('Watchcraft practiced: you can now apply the sector scan on a new full Village patrol with Tessa’s loaned lantern and baton.');
                }

                //if effects: add them
                if(current_activity.applied_effects) {
                    for(let i = 0; i < current_activity.applied_effects.length; i++) {
                        add_active_effect(current_activity.applied_effects[i].effect, current_activity.applied_effects[i].duration);
                    }
                }

                if(activities[current_activity.activity_name].type === "TRAINING") {
                    add_xp_to_skill({skill: skills["Breathing"], xp_to_add: 0.5});
                } else {
                    add_xp_to_skill({skill: skills["Breathing"], xp_to_add: 0.1});
                }

                //ticks are varied for gathering activities, 1 second for most other activities
                current_activity.gathering_time += 1;

                if(!current_activity.xp_given_per_working_period) {
                    add_xp_to_activity_skills();
                }

                if(current_activity.gathering_time >= current_activity.gathering_time_needed) { 
                    const {gathering_time_needed, gained_resources, quality_range} = current_activity.getActivityEfficiency();
                    const items = [];

                    //add xp
                    if(current_activity.xp_given_per_working_period) {
                        add_xp_to_activity_skills();
                    }

                    //add resource drops (if defined)
                    if (gained_resources) {
                        for(let i = 0; i < gained_resources.length; i++) {
                            if(gameRandom(STREAMS.gather, `activity:${current_activity.activity_id}:${i}:chance`) < gained_resources[i].chance) {
                                const count = gameRandomRange(STREAMS.gather, `activity:${current_activity.activity_id}:${i}:count`,gained_resources[i].count[0], gained_resources[i].count[1]);
                                let quality = null;

                                //quality
                                if (quality_range) {
                                    quality = Math.round(gameRandomRange(STREAMS.gather, `activity:${current_activity.activity_id}:${i}:quality`,quality_range[0], quality_range[1]) / 4) * 4;
                                }

                                items.push({item_id: gained_resources[i].name, quality: quality, count: count});

                                game_stats.gathered_materials[gained_resources[i].name] = (game_stats.gathered_materials[gained_resources[i].name] || 0) + count;
                            }
                        }

                        if(items.length > 0) {
                            process_current_loot({loot_list: items});
                            

                            for(let i = 0; i < items.length; i++) {
                                current_activity.gathered_materials[items[i].item_id] = (current_activity.gathered_materials[items[i].item_id] + items[i].count || items[i].count);
                            }
                        
                            character.addToInventory(items);
                        }

                        update_gathering_tooltip(current_activity);
                    }

                    //if job: payment
                    if (activities[current_activity.activity_name].type === "JOB") {
                        current_activity.earnings += current_activity.get_payment();
                    }

                    current_activity.gathering_time = 0;
                    current_activity.gathering_time_needed = gathering_time_needed;
                }

                // A career shift is one native working period, not an endless wage loop.
                if(current_location.id === 'Village' && current_activity.id === 'patrolling' && villageCareer.loan?.status === 'active' && current_activity.earnings > 0) {
                    end_activity();
                } else {
                    update_displayed_ongoing_activity(current_activity);
                    if(!can_work(current_activity))end_activity();
                }

                
            } else {
                //no current activity

                add_xp_to_skill({skill: skills["Breathing"], xp_to_add: 0.1});
                const divs = document.getElementsByClassName("activity_div");
                //go through all displayed activities, if they are of proper type check if they are available and if there's a change, modify their display
                for(let i = 0; i < divs.length; i++) {
                    const activity = current_location.activities[divs[i].getAttribute("data-activity")];

                    if(activities[activity.activity_name].type === "JOB" || activities[activity.activity_name].type === "TRAINING") {
                        if(can_work(activity)) {
                            divs[i].classList.remove("activity_unavailable");
                            divs[i].classList.add("start_activity");
                        } else {
                            divs[i].classList.remove("start_activity");
                            divs[i].classList.add("activity_unavailable");
                        }
                        
                    }
                }
            }

            let sounds = current_location.getBackgroundNoises();
            if(sounds.length > 0){
                if(Math.random() < 1/600) {
                    log_message(`"${sounds[Math.floor(Math.random()*sounds.length)]}"`, "background");
                }
            }
            if (current_activity && Math.random() < 1/100) {
                sounds = activities[current_activity.activity_name].getBackgroundNoises();
                if(sounds.length > 0){
                    log_message(`"${sounds[Math.floor(Math.random()*sounds.length)]}"`, "background");
                }
            }
        }

        let health_to_add = 0;
        let health_to_subtract = 0
        //health regen
        if(full_stats.health_regeneration_flat) {
            health_to_add += full_stats.health_regeneration_flat;
        }
        if(full_stats.health_regeneration_percent) {
            health_to_add += full_stats.max_health * full_stats.health_regeneration_percent/100;
        }
        //health loss
        if(full_stats.health_loss_flat) {
            health_to_subtract -= full_stats.health_loss_flat;
        }
        if(full_stats.health_loss_percent) {
            health_to_subtract += full_stats.max_health * full_stats.health_loss_percent/100;
        }

        update_health({ammount_to_restore: health_to_add, ammount_to_loose: health_to_subtract});

        //stamina regen
        if(!expansionState.chronicle?.session && full_stats.stamina_regeneration_flat) {
            full_stats.stamina += full_stats.stamina_regeneration_flat;
        }
        if(!expansionState.chronicle?.session && full_stats.stamina_regeneration_percent) {
            full_stats.stamina += full_stats.max_stamina * full_stats.stamina_regeneration_percent/100;
        }
        //mana regen
        if(full_stats.mana_regeneration_flat) {
            full_stats.mana += full_stats.mana_regeneration_flat
        }
        if(full_stats.mana_regeneration_percent) {
            full_stats.mana += full_stats.max_mana * full_stats.mana_regeneration_percent/100;
        }

        if(full_stats.stamina > full_stats.max_stamina) {
            full_stats.stamina = full_stats.max_stamina
        } else if(full_stats.stamina < 0) {
            full_stats.stamina = 0;
        }

        if(full_stats.stamina_regeneration_flat || full_stats.stamina_regeneration_percent) {
            update_displayed_stamina();
        }
        
        save_counter += 1;
        if(save_counter >= save_period*tickrate) {
            save_counter = 0;
            if(is_on_dev()) {
                save_to_localStorage({key: dev_save_key});
            } else {
                save_to_localStorage({key: save_key});
            }
            console.log("Auto-saved the game!");
        } //save in regular intervals, irl time independent from tickrate

        backup_counter += 1;
        if(backup_counter >= backup_period*tickrate) {
            backup_counter = 0;
            let saved_at;
            if(is_on_dev()) {
                saved_at = save_to_localStorage({key: dev_backup_key});
            } else {
                saved_at = save_to_localStorage({key: backup_key});
            }

            if(saved_at) {
                update_backup_load_button(saved_at);
            }
            console.log("Created an automatic backup!");
        }

        if(!is_sleeping && current_location && current_location.light_level === "normal" && is_night()) {
            add_xp_to_skill({skill: skills["Night vision"], xp_to_add: 1});
        }

        //add xp to proper skills based on location types
        if(current_location) {
            const skills = current_location.gained_skills;
            let leveled = false;
            for(let i = 0; i < skills?.length; i++) {
                leveled = add_xp_to_skill({skill: current_location.gained_skills[i].skill, xp_to_add: current_location.gained_skills[i].xp}) || leveled;
            }
            if(leveled){
                update_displayed_location_types(current_location);
            }
        }

        //limiting maximum adjustment, to avoid any absurd results;
        if(time_variance_accumulator <= 100/tickrate && time_variance_accumulator >= -100/tickrate) {
            time_adjustment = time_variance_accumulator;
        }
        else {
            if(time_variance_accumulator > 100/tickrate) {
                time_adjustment = 100/tickrate;
            }
            else {
                if(time_variance_accumulator < -100/tickrate) {
                    time_adjustment = -100/tickrate;
                }
            }
        }

        game_stats.total_playtime += 1/tickrate;
        if(++title_check_ticks >= 5*tickrate) {title_check_ticks = 0; refresh_titles();}
        update();
    }, 1000/tickrate - time_adjustment);
    //uses time_adjustment based on time_variance_accumulator for more precise overall stabilization
    //(instead of only stabilizing relative to previous tick, it stabilizes relative to sum of deviations)
    //probably completely unnecessary lol, but hey, it sounds cool
}

/** Lifetime counters that titles read; all derived from existing saved state. */
function readTitleCounters() {
    const level = character.getLevelableComponent().current_level || 0;
    const books = Object.values(book_stats).filter(b => b.required_time > 0 && b.accumulated_time >= b.required_time).length;
    return {
        // game_stats.total_kills is never incremented in this fork; the saved bestiary counts are the real tally.
        kills: Object.values(enemy_killcount).reduce((a, n) => a + (n || 0), 0),
        enemy_kinds: Object.values(enemy_killcount).filter(n => n > 0).length,
        crits_done: game_stats.total_crits_done,
        strongest_hit: game_stats.strongest_hit,
        hits_taken: game_stats.total_hits_taken,
        deaths: game_stats.total_deaths,
        level,
        level_without_death: game_stats.total_deaths === 0 ? level : 0,
        crafts: game_stats.total_crafting_successes,
        gathered: Object.values(game_stats.gathered_materials).reduce((a, n) => a + (n || 0), 0),
        books,
        years: yearsSince(current_game_time),
        playtime_hours: game_stats.total_playtime / 3600,
        money: character.money,
    };
}

/**
 * Grants titles whose counters are reached and reapplies the derived bonus.
 * silent: back-fill on load, one summary line instead of one per title.
 */
function refresh_titles({silent = false} = {}) {
    const earned = grantEarnedTitles(character.titles, readTitleCounters(), titleCalendarMinute(current_game_time));
    character.setTitleBonus(titleBonuses(character.titles));
    if(!earned.length && !silent) return earned; // load (silent) always redraws: skill bars were built before the bonus existed
    if(silent) {
        if(earned.length) log_message(`Titles recognized from your past: ${earned.map(id => title_by_id[id].name).join(", ")}.`, "level_up");
    } else {
        for(const id of earned) {
            const title = title_by_id[id], bonus = describeTitleBonus(title.bonus);
            log_message(`Title earned: ${title.name}. ${title.text}${bonus ? ` (${bonus})` : ""}`, "level_up");
        }
    }
    character.updateStatsAndDisplay();
    update_displayed_xp_bonuses();
    update_all_displayed_skills_xp_gain();
    titlesPanel?.render();
    return earned;
}

function run() {
    if(importProbeToken) return;
    if(expansionState.chronicle?.life.endedAt != null) {character.is_alive = false; chroniclePanel?.render(true); return;}
    if(typeof current_location === "undefined") {
        change_location({location_id: "Village", skip_travel_time: true});
    } 

    if(current_location.tags.combat_zone) {
        start_combat();
    }
    
    update_displayed_health();
    if(config.do_hero_creation) {
        fill_character_bio();
    }
        
    start_date = Date.now();
    update();

    if(game_options.change_background_color) {
        set_light_based_background_color(!current_location.is_under_roof);
    }
}

window.equip_item = character_equip_item;
window.unequip_item = character_unequip_item;

window.change_location = change_location;
window.reload_normal_location = reload_normal_location;
window.handleLocationIconClick = handle_location_icon_click;
window.remove_location_from_favourites = remove_location_from_favourites;

window.start_dialogue = start_dialogue;
window.end_dialogue = end_dialogue;
window.start_textline = start_textline;

window.remove_fast_travel_choice = remove_fast_travel_choice;

window.start_activity = start_activity;
window.end_activity = end_activity;

window.start_game_action = start_game_action;
window.end_game_action = end_game_action;

window.start_sleeping = start_sleeping;
window.end_sleeping = end_sleeping;

window.start_reading = start_reading;
window.end_reading = end_reading;

window.start_trade = (...args) => {if(!expeditionOccupiesPlayer()) return start_trade(...args);};
window.exit_trade = exit_trade;
window.add_to_buying_list = add_to_buying_list;
window.remove_from_buying_list = remove_from_buying_list;
window.add_to_selling_list = add_to_selling_list;
window.remove_from_selling_list = remove_from_selling_list;
window.cancel_trade = cancel_trade;
window.accept_trade = () => {
    try {accept_trade();}
    catch(error) {
        log_message("Trade cancelled: " + error.message, "message_critical");
        update_displayed_trader_inventory();
        update_displayed_character_inventory({is_trade: true});
    }
};
window.is_in_trade = is_in_trade;
window.update_displayed_total_price = update_displayed_total_price;

window.open_storage = (...args) => {open_storage(...args); update_displayed_character_inventory(); stampStorageRequests();};
window.exit_storage = close_storage;
window.move_item_to_storage = move_item_to_storage;
window.remove_item_from_storage = remove_item_from_storage;
window.is_storage_open = is_storage_open;

window.format_money = format_money;
window.get_character_money = character.getOwnedMoney.bind(character);

window.use_item = use_item;
window.change_consumable_favourite_status = change_consumable_favourite_status;
window.change_item_favourite_status = change_item_favourite_status;
window.update_fav_display = update_fav_display;

window.sort_displayed_inventory = sort_displayed_inventory;
window.update_displayed_character_inventory = update_displayed_character_inventory;
window.update_displayed_trader_inventory = update_displayed_trader_inventory;
window.update_displayed_storage_inventory = update_displayed_storage_inventory;

window.sort_displayed_skills = sort_displayed_skills;

window.change_stance = change_stance;
window.fav_stance = fav_stance;

window.openCraftingWindow = open_crafting_window;
window.closeCraftingWindow = ()=>{workLedgerCraftEffects?.cancel();close_crafting_window();};
window.switchCraftingRecipesPage = switch_crafting_recipes_page;
window.switchCraftingRecipesSubpage = switch_crafting_recipes_subpage;
window.useRecipe = use_recipe;
window.updateDisplayedComponentChoice = update_displayed_component_choice;
window.updateDisplayedMaterialChoice = update_displayed_material_choice;
window.updateRecipeTooltip = update_recipe_tooltip;

window.remove_from_content_stack = remove_from_content_stack;

window.option_uniform_textsize = option_uniform_textsize;
window.option_bed_return = option_bed_return;
window.option_combat_autoswitch = option_combat_autoswitch;
window.option_remember_filters = option_remember_filters;
window.option_use_uncivilised_temperature_scale = option_use_uncivilised_temperature_scale;
window.option_do_background_animations = option_do_background_animations;
window.option_change_background_color = option_change_background_color;
window.option_skip_play_button = option_skip_play_button;
window.option_mofu_mofu_mode = option_mofu_mofu_mode;
window.option_do_enemy_onhit_animations = option_do_enemy_onhit_animations;
window.option_expo_threshold = option_expo_threshold;
window.option_hide_max_level_skills = option_hide_max_level_skills;
window.option_use_text_outlines_for_tooltips = option_use_text_outlines_for_tooltips;
window.option_use_text_outlines_for_bars = option_use_text_outlines_for_bars;
window.option_do_dynamic_loot_message = option_do_dynamic_loot_message;

window.change_completed_quest_visibility = change_completed_quest_visibility;

window.getDate = get_date;

window.isOnDev = is_on_dev;

window.saveProgress = save_progress;
window.save_to_file = save_to_file;
window.load_progress = load_from_file;
window.loadBackup = load_backup;
window.importOtherReleaseSave = load_other_release_save;
window.hardReset = hard_reset;
window.get_game_version = get_game_version;

window.run = run;

// Do not suspend the legacy initialization before its onload UI has elements.
const saveOwnership = acquireSaveOwnership().then(owned => {
    ownsSave = owned;
    if(!owned) expansionError = "This tab is read-only. Close the other game tab and reload to save progress.";
    expeditionPanel?.render(true);
    techniquePanel?.render(true);
    chroniclePanel?.render(true);
    villagePanel?.render(true);
    simulationPanel?.render(); pursuitPanel?.render(); fieldPanel?.render(); promisePanel?.render(); crushSocialPanel?.render(); managementPanel?.render(); bodyPanel?.render(); townPanel?.render();
    frontierCampaignPanel?.render();
    featureExpansionPanel?.render();foundationInteractionPanel?.render();
    knownRoutesPanel?.render();adventureNotebook?.render(); worldEventFeed?.render();
    return owned;
});

//Verify_Game_Objects();

//speed multiplier for dev mode, not saved
let game_speed = 1;

function set_game_speed(multiplier) {
    const allowed = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000];
    //tickrate later divides some 
    if(!allowed.includes(multiplier)) {
        console.error(`Speed must be one of ${allowed.join(", ")}.`);
        return game_speed;
    }
    if(multiplier >= 200) {
        console.warn('Too high game speed might cause issues, as well as make combat behave a lot differently than it would normally.');
    }
    game_speed = multiplier;
    //tickrate from config, so function sets speed relative to it and not to previous speed
    tickrate = config.tickrate * game_speed;

    //an action already running holds its own interval, which has to be re-armed to be affected by speed change
    rearm_game_action_interval();
    return game_speed;
}

/**
 * development console, can be enabled in config.js
 * exposes a bunch of useful functions to browser console
 *
 *     add_active_effect("Coffee", 1800)
 *     give({items: [{item: "Iron sword", quality: 120}], money: 50000}) //can use any valid reward argument
 *     goto("Slums")
 *     set_speed(100)
 */
function enable_dev_console() {
    const list = (registry) => Object.keys(registry).sort();

    const real_add_active_effect = add_active_effect;

    const helpers = {
        //duration is in in-game minutes, like every duration in content
        add_active_effect: (effect_key, duration = 600) => {
            if(!effect_templates[effect_key]) {
                console.error(`No such effect as "${effect_key}". Try list_effects().`);
                return;
            }
            real_add_active_effect(effect_key, duration);
            return `${effect_key} for ${duration} minutes`;
        },

        give: (rewards) => {
            process_rewards({rewards, source_type: "dev console", source_name: "dev console"});
            return Object.keys(rewards);
        },

        /*
            adds all buff-type effects at once, selecting strongest possible effect for mutually exclusive ones,
            and skipping the rest;
            returns applied and skipped effects
        */
        add_best_effects: (duration = 1800) => {
            if(typeof duration !== "number" || !(duration > 0)) {
                console.error(`Duration has to be a positive number of in-game minutes, got "${duration}".`);
                return;
            }

            const buffs = Object.keys(effect_templates).filter(key => effect_templates[key].tags?.buff);
            const applied = [];
            const skipped = [];
            buffs.sort().forEach(key => {
                real_add_active_effect(key, duration);
                (active_effects[key] ? applied : skipped).push(key);
            });

            return skipped.length
                ? {applied, held_back_by_a_stronger_effect: skipped}
                : applied;
        },
        add_money: (amount) => { add_money_to_character(amount); return character.money; },
        add_xp: (amount) => { add_xp_to_character(amount); return character.xp.current_level; },
        add_skill_xp: (skill, amount) => {
            if(!skills[skill]) {
                console.error(`No such skill as "${skill}". Try list_skills().`);
                return;
            }
            add_xp_to_skill({skill: skills[skill], xp_to_add: amount});
            return skills[skill].current_level;
        },

        //goes to specified location, unlocks it if needed
        go_to: (location_name) => {
            if(!locations[location_name]) {
                console.error(`No such location as "${location_name}". Try list_locations().`);
                return;
            }
            unlock_location({location: locations[location_name], skip_message: true});
            change_location({location_id: location_name});
            return location_name;
        },

        set_flag: (flag, value = true) => {
            if(!(flag in global_flags)) {
                console.error(`No such flag as "${flag}". Known: ${list(global_flags).join(", ")}`);
                return;
            }
            global_flags[flag] = value;
            return `${flag} = ${value}`;
        },

        simulate_combat: ({use_hero, fighter_locations}) => {
            if(current_location.tags.combat_zone) {
                change_location({location_id: current_location.parent_location.id});
                console.warn('Cannot simulate while another fight is happening - retreated from ongoing combat');
            }

            for(let i = 0; i < fighter_locations.length; i++) {
                if(!locations[fighter_locations[i]]) {
                    console.error('No such location as '+location[fighter_locations[i]]);
                    return;
                }
            }

            let attackers;
            let defenders;

            if(use_hero) {
                attackers = [character];
                defenders = locations[fighter_locations[0]].get_next_enemies();
            } else {
                attackers = locations[fighter_locations[0]].get_next_enemies();
                defenders = locations[fighter_locations[1]].get_next_enemies();
            }

            let combat_window = document.getElementById("combat_window");
            if(!combat_window) {
                combat_window = document.createElement("div");
                combat_window.id = "combat_window";

                const attacker_box = document.createElement("div");
                attacker_box.id = "attacker_box";
                const defender_box = document.createElement("div");
                defender_box.id = "defender_box";

                const exit_button = document.createElement("div");
                exit_button.id = "combat_window_exit";
                exit_button.innerText = translate("ui exit");

                exit_button.addEventListener("click", () => {
                    change_location({location_id: current_location.id});
                    combat_window.remove();
                });

                combat_window.append(attacker_box, defender_box, exit_button);
            }

            document.body.append(combat_window);
            
            current_combat = new Combat({
                attackers,
                defenders,
                attackers_ui_slot: combat_window.querySelector("#attacker_box"),
                defenders_ui_slot: combat_window.querySelector("#defender_box"),
                is_special_combat: true,
            });
            current_combat.start();
        },

        list_effects: () => list(effect_templates),
        list_items: () => list(item_templates),
        list_locations: () => list(locations),
        list_skills: () => list(skills),
        list_quests: () => list(quests),
        list_dialogues: () => list(dialogues),
        list_flags: () => list(global_flags),

        set_speed: (multiplier) => set_game_speed(multiplier),
    };

    Object.keys(helpers).forEach(name => { window[name] = helpers[name]; });

    console.log("Dev console is active. Available functions:\n");
    console.log(Object.keys(helpers).join("(),\n") + "()");
}

window.Verify_Game_Objects = Verify_Game_Objects;

set_loading_screen_progress("Waking up from a nyap...");

set_loading_screen_progress("Translating the meows");
const registerStructuredNative=async raw=>{
        const compiled=compileStructuredPack(raw,expeditionRegistry);
        for(const l of raw.locations){if(locations[l.id])throw Error('Structured native location collision.');if(l.combat?.enemyIds.some(id=>!enemy_templates[id]))throw Error('Unsupported native encounter.');}
        for(const item of raw.items||[])if(item_templates[item.id])throw Error('Structured native item collision.');
        for(const c of raw.simulation.containers||[])if(inventories[c.category]?.[c.id])throw Error('Structured native inventory collision.');
        const bytes=new TextEncoder().encode(JSON.stringify(raw));const digest=await crypto.subtle.digest('SHA-256',bytes);
        const contentHash='sha256:'+Array.from(new Uint8Array(digest)).map(n=>n.toString(16).padStart(2,'0')).join('');
        const localLocations={};
        const staged=stageStructuredNativeObjects(raw,{availabilities,
            makeLocation:l=>localLocations[l.id]=l.combat?new CombatZone({id:l.id,name:l.label,description:l.description,enemies_list:l.combat.enemyIds,enemy_stat_variation:0,parent_location:null,leave_text:'Return to shelter',is_unlocked:true}):new OptionalPackLocation({id:l.id,name:l.label,description:l.description,connected_locations:[],is_under_roof:l.underRoof!==false,is_unlocked:true}),
            makeItem:i=>i.equipment?new Armor({...nativeStructuredEquipmentTemplate(i),tags:{expedition:true,structuredEquipment:true}}):new OtherItem({id:i.id,name:i.label,description:i.description,value:i.value||0,tags:{expedition:true}}),
            makeInventory:()=>new InventoryComponent()});
        const starts=raw.starts?await Promise.all(raw.starts.map(async start=>{
            const snapshot={...start};delete snapshot.snapshotHash;
            const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(snapshot)));
            return {...start,snapshotHash:'sha256:'+Array.from(new Uint8Array(digest)).map(n=>n.toString(16).padStart(2,'0')).join('')};
        })):null;
        const admitted={...compiled.definition,contentHash,...(starts?{starts}:{})};validateStructuredBootstrap(admitted);
        const d={...mergeStructuredPack(compiled,expeditionRegistry),...admitted};
        for(const [id,l]of staged.locations){const authored=raw.locations.find(row=>row.id===id);if(authored.combat){l.parent_location=localLocations[authored.combat.parentId];l.parent_location.connected_locations.push({location:l,travel_time:1});}locations[id]=l;}for(const [id,item]of staged.items)item_templates[id]=item;
        for(const [category,id,inventory]of staged.inventories){inventories[category]||={};inventories[category][id]=inventory;}
        structuredPacks.set(d.id,d);return d;
};
const loadedOptionalPacks=await loadContentPacks({registry:expeditionRegistry,locations,
    makeLocation:l=>new OptionalPackLocation({id:l.id,name:l.label,description:l.description,connected_locations:[],is_under_roof:true}),
    registerStructured:registerStructuredNative,
    onError:()=>console.warn('An optional content pack could not be loaded; the base game remains available.')});
for(const [id,definition] of loadedOptionalPacks)if(definition.schema===1)optionalPacks.set(id,definition);
if(foundationProbeEnabled)await registerStructuredNative(createFoundationStartContent());
await registerStructuredNative(createLocalLivelihoodContent());
await translationManager.init(language);
translationManager.translateUI(language);

//check if there's an existing save file, otherwise just do some initial setup
if(importProbeToken) {
    // Probe uses fresh definitions and never reads another saved character.
} else if(!heirRequest?.leftovers && (!is_on_dev() && save_key in localStorage || is_on_dev() && (dev_save_key in localStorage || !("skip_live_import" in localStorage) && save_key in localStorage ))) {
    load_from_localstorage();
    if(!is_loading_error) refresh_titles({silent: true});
    character.updateStatsAndDisplay();
    update_displayed_xp_bonuses();
} else {
    set_loading_screen_versions();
    character.addToInventory([
                                //{item_id: "Cheap iron sword", quality: 50},
                                {item_id: "Cheap leather pants", quality: 40},
                                {item_id: "Stale bread", count: 5},
                            ]);

    add_xp_to_character(0);
    character.money = 102;
    update_displayed_money();
    character.updateStatsAndDisplay();

    update_displayed_stance_list(current_stance);
    change_stance({stance_id: "normal"});
    create_displayed_crafting_recipes();
    change_location({location_id: "Village", skip_travel_time: true});
    questManager.startQuest({quest_id: "Lost memory"});

    last_rewarded_export = Date.now() - 1000*60*60*16; //reduces timer by 16 hours, making first reward export appear in 4 hours from starting
    if(heirRequest?.leftovers) await completeHeirRequest(heirRequest);
}

if(suspendedStructuredSave) {
    const panel=document.createElement('section');panel.id='structured_recovery';
    Object.assign(panel.style,{position:'fixed',inset:'20% 15%',zIndex:'20000',background:'#252525',color:'#eee',padding:'24px',overflow:'auto'});
    const message=document.createElement('p');message.textContent='This character is paused until its exact beginning content is restored. The original save and chosen beginning are preserved. Restore the content, then reload.';
    const exportButton=document.createElement('button');exportButton.type='button';exportButton.textContent='Export preserved character';
    exportButton.onclick=()=>{const encoded=save_to_file(),a=document.createElement('a');a.href=URL.createObjectURL(new Blob([encoded],{type:'text/plain'}));a.download='preserved-character.txt';a.click();URL.revokeObjectURL(a.href);};
    panel.append(message,exportButton);document.body.append(panel);
}
if(!is_loading_error) {
    set_loading_screen_progress("Waiting for you to click 'PLAY'");
    hide_loading_text();
    show_play_button();
} else {
    hide_loading_text();
    set_play_button_text("Play...?");
    show_play_button();
}

play_button.addEventListener("click", hide_loading_screen);

if(!global_flags.is_hero_created && config.do_hero_creation) {
    characterCreator.fill_creation_panel();
    // CH1 capture runs before CharacterCreator removes the creation controls.
    document.getElementById('hero_creation_panel_confirmation').addEventListener('click', () => {
        if(global_flags.is_hero_created) return;
        const choice = document.querySelector('[data-cheat-start]').value;
        if(choice === 'system-quests' || choice === 'surprise') {
            cheatState = grantCheat(cheatState, optionalStartCard(), {route: 'optional-start', at: cheatCalendarTime()});
        }
        lifeRecord = appendLifeMilestone(lifeRecord, {year: current_game_time.year,
            at: lifeCalendarMinute(current_game_time), worldId: 'base.frontier', kind: 'beginning',
            text: choice === 'none' ? 'You chose an ordinary beginning without a system.' :
                choice === 'surprise' ? 'You chose a surprise beginning with a dormant system.' : 'You chose to begin with a dormant system.'});
    }, {capture: true});
    //run is triggered from confirming hero creation
} else {
    play_button.addEventListener("click", run);
    characterCreator.remove_creation_panel();
}

if(config.use_racial_bonuses) {
    character.addRaceBonus();
}

if(config.use_height_bonuses) {
    character.addHeightBonus();
}

function add_stuff_for_testing() {
    const items = [];
    for(let i = 1; i < 250; i++) {
        items.push({item_id: "Iron sword", quality:i});
        items.push({item_id: "Cheap iron sword", quality:i});
    }
    character.addToInventory(items);
}

function add_all_stuff_to_inventory(count = 10){
    Object.keys(item_templates).forEach(item => {
        character.addToInventory([
            {item_id: item, count: count},
        ]);
    })
}

function add_all_active_effects(duration){
    Object.keys(effect_templates).forEach(effect_key => {
        active_effects[effect_key] = new ActiveEffect({...effect_templates[effect_key], duration});
    });
    character.addActiveEffectBonus(active_effects);
    update_displayed_effects();
}

//character.addToInventory([{item_id: "Iron sword", count: 20, quality: 100}]);
//character.addToInventory([{item_id: "Iron sword", count: 20, quality: 120}]);
//character.addToInventory([{item_id: "Potion of sapping", count: 20}]);

//add_stuff_for_testing();
//add_all_stuff_to_inventory();
//add_all_active_effects(120);
//add_consumable_to_favourites("Stale bread");

update_displayed_equipment();
sort_displayed_inventory({sort_by: "name", target: "character"});

if(!importProbeToken && !foundationSaveBlocked && !is_loading_error) {
    if(structuredPacks.size)structuredPanel=createStructuredPackPanel({read:readStructuredCampaign,command:commandStructuredCampaign});
    optionalPackPanel=createContentPackPanel({definitions:optionalPacks,always:true,
        read:()=>({state:optionalPackState,pauseReason:feedbackClockPauseReason(),canEnter:ownsSave&&current_location?.id==='Village'&&!nativeOccupationReason()&&!current_activity&&!current_game_action&&!current_combat&&!current_dialogue&&!is_sleeping&&!is_reading&&!is_in_trade(),canAct:ownsSave&&!foundationSaveBlocked&&!lifeStorageFailure,
            reference:villageCareer.rank>=1&&!villageCareer.loan&&!villageCareer.debt}),command:commandOptionalPack});
    renderWorldIdentity();
    validateNativeGameplayReferences([...expeditionRegistry.actions.values()].flatMap(action =>
        [action.costs, action.effects || [], ...action.outcomes.map(outcome => outcome.effects || [])])
        .concat([...expeditionRegistry.rollTables.values()].flatMap(table => table.outcomes.map(outcome => outcome.effects || []))));
    const readProgression = () => ({canAdvance:!feedbackClockPauseReason(),pauseReason:feedbackClockPauseReason(),state: expansionState, context: {...expeditionContext(),busy:!!(current_activity || current_game_action || current_combat || current_dialogue || is_sleeping || is_reading || is_in_trade())}, error: expansionError,
        enabled: ownsSave && !current_activity && !current_game_action && !current_combat && !is_sleeping && !is_reading && !is_in_trade()});
    expeditionPanel = createExpeditionPanel({registry: expeditionRegistry, read: readProgression,
        command: startExpedition, cancel: cancelExpedition});
    techniquePanel = createTechniquePanel({registry: expeditionRegistry, read: readProgression,
        command: startExpedition, cancel: cancelExpedition, answer: answerPractice});
    villagePanel = createVillagePanel({registry: expeditionRegistry,
        read: () => ({...readProgression(), inDialogue: !!current_dialogue}),
        command: startExpedition, cancel: cancelExpedition, readBook: start_reading});
    townPanel = createTownPanel({registry: expeditionRegistry,
        read: () => ({...readProgression(), inDialogue: !!current_dialogue}), command: startExpedition, cancel: cancelExpedition});
    simulationPanel = createSimulationPanel({registry: expeditionRegistry,
        read: () => ({...readProgression(), inDialogue: !!current_dialogue}), command: actSimulation});
    const storyletPanel=createStoryletPanel({registry:expeditionRegistry,read:()=>({...readProgression(),inDialogue:!!current_dialogue}),command:actSimulation});
    const renderWorkshop=simulationPanel.render;
    simulationPanel.render=()=>{renderWorkshop();storyletPanel.render();};simulationPanel.render();
    pursuitPanel=createPursuitPanel({registry:expeditionRegistry,read:()=>{const snapshot=readProgression();return {...snapshot,inDialogue:!!current_dialogue,inCombat:!!current_combat,canWrite:ownsSave && !foundationSaveBlocked && !importProbeToken,
        context:{...snapshot.context,vitals:Object.fromEntries(Object.entries(simulationNativeContexts()).map(([id,c])=>[id,c.vitals]))}};},command:actSimulation});
    nativeBattleHost=createNativeBattleHost({Combat,Enemy,registry:expeditionRegistry,player:character,getState:()=>expansionState,getContext:campaignContext,persist:persistExpansion,
        getCombat:()=>current_combat,setCombat:c=>{current_combat=c;},endCombat:end_combat,
        refresh:()=>{for(const [is_attacker,list] of [[true,current_combat?.attackers||[]],[false,current_combat?.defenders||[]]])for(let i=0;i<list.length;i++)update_displayed_health_of_fighter({fighter_index:i,is_attacker});},
        render:error=>{if(error)nativeBattlePauseReason=error;frontierCampaignPanel?.render();partyPanel?.render();knownRoutesPanel?.render();adventureNotebook?.render();}});
    featureBattleHost=createFeatureBattleHost({Combat,Enemy,registry:expeditionRegistry,player:character,getState:()=>expansionState,getContext:featureWaveContext,persist:persistExpansion,
        getCombat:()=>current_combat,setCombat:c=>{current_combat=c;},endCombat:end_combat,
        attackersSlot:()=>document.getElementById('feature_battle_attackers'),defendersSlot:()=>document.getElementById('feature_battle_defenders'),
        refresh:()=>{for(const [is_attacker,list] of [[true,current_combat?.attackers||[]],[false,current_combat?.defenders||[]]])for(let i=0;i<list.length;i++)update_displayed_health_of_fighter({fighter_index:i,is_attacker});},
        render:()=>{featureExpansionPanel?.render();foundationInteractionPanel?.render();causalStoryPanel?.render();knownRoutesPanel?.render();adventureNotebook?.render();}});
    frontierCampaignPanel=createFrontierCampaignPanel({registry:expeditionRegistry,read:()=>({...readProgression(),context:campaignContext(),
        error:expansionError || nativeBattlePauseReason,inDialogue:!!current_dialogue,inCombat:!!current_combat,battleRunning:!!current_combat?.actionAdapter,canWrite:ownsSave && !foundationSaveBlocked && !importProbeToken}),command:actFrontierCampaign});
    partyPanel=createPartyPanel({registry:expeditionRegistry,read:()=>({...readProgression(),context:campaignContext(),error:expansionError || nativeBattlePauseReason,inDialogue:!!current_dialogue,canWrite:ownsSave && !foundationSaveBlocked && !importProbeToken}),command:actParty});
    exchangePanel=createExchangePanel({registry:expeditionRegistry,read:()=>({...readProgression(),context:campaignContext(),inDialogue:!!current_dialogue,inCombat:!!current_combat,canWrite:ownsSave && !foundationSaveBlocked && !importProbeToken}),command:actExchange});
    observationPanel=createObservationPanel({registry:expeditionRegistry,read:()=>({...readProgression(),context:campaignContext(),inDialogue:!!current_dialogue,inCombat:!!current_combat,canWrite:ownsSave && !foundationSaveBlocked && !importProbeToken}),command:actObservation});
    skillExpansionPanel=createSkillExpansionPanel({registry:expeditionRegistry,read:()=>({...readProgression(),context:campaignContext(),inDialogue:!!current_dialogue,inCombat:!!current_combat,enabled:ownsSave&&!foundationSaveBlocked&&!importProbeToken}),command:actSkillExpansion});
    featureExpansionPanel=createFeatureExpansionPanel({read:()=>({...readProgression(),context:featureWaveContext(),battleView:featureBattleHost.view(),battleRunning:featureBattleHost.isRunning(),notice:featureBattleHost.pauseReason(),canWrite:ownsSave&&!foundationSaveBlocked&&!importProbeToken}),command:actFeatureExpansion,present:snapshot=>refinementPresentation(snapshot,expeditionRegistry,{base:featureWavePresentation,relayHost,referenceDeskHost,replacementContext:backlogContext})});
    if(foundationProbeEnabled)foundationInteractionPanel=createFoundationInteractionPanel({registry:expeditionRegistry,enabled:true,read:()=>({state:expansionState,context:expeditionContext(),enabled:ownsSave&&!foundationSaveBlocked&&!importProbeToken&&!nativeOccupationReason(),error:expansionError}),command:actFoundationInteraction});
    managementPanel=createManagementPanel({registry:expeditionRegistry,read:()=>({...readProgression(),context:featureWaveContext(),inDialogue:!!current_dialogue,inCombat:!!current_combat,canWrite:ownsSave&&!foundationSaveBlocked&&!importProbeToken}),command:actManagement});
    managementPanel.render();
    crushSocialPanel=createCrushSocialPanel({registry:expeditionRegistry,read:()=>({...readProgression(),context:featureWaveContext(),inDialogue:!!current_dialogue,inCombat:!!current_combat,canWrite:ownsSave&&!foundationSaveBlocked&&!importProbeToken}),command:actCrushSocial});
    document.getElementById('location_actions_div')?.append(crushSocialPanel.element);
    causalStoryPanel=createCausalStoryUI({registry:expeditionRegistry,read:()=>({...readProgression(),context:currentCausalContext(),canWrite:ownsSave&&!foundationSaveBlocked&&!importProbeToken}),command:actCausalStory});
    const readBacklog=()=>({...readProgression(),context:backlogContext(),inDialogue:!!current_dialogue,inCombat:!!current_combat,canWrite:ownsSave&&!foundationSaveBlocked&&!importProbeToken});
    backlogPanel=createBacklogExpansionPanel({registry:expeditionRegistry,read:readBacklog,command:actBacklog,preview:qualifiedBacklog.preview,parent:document.getElementById('location_actions_div')});
    backlogOpeningPanel=createBacklogExpansionPanel({registry:expeditionRegistry,read:readBacklog,command:actBacklog,preview:qualifiedBacklog.preview,parent:document.getElementById('hero_creation_panel'),opening:true});
    replacementRecognitionPanel=createReplacementRecognitionPanel({read:replacementRecoverySnapshot,command:actBacklog,preview:qualifiedBacklog.preview,parent:document.getElementById('location_actions_div')});
    repositoryPanel=createRepositoryAbsorptionPanel({registry:expeditionRegistry,read:()=>({...readProgression(),context:featureWaveContext(),canWrite:ownsSave&&!foundationSaveBlocked&&!importProbeToken}),command:actRepository});
    inkPanel=createInkNarrativeUI({read:()=>{
        const view=inkNarrativeView(expansionState,expeditionRegistry,currentInkHost()===relayInkHost?backlogContext():featureWaveContext(),currentInkHost()),canWrite=ownsSave&&!foundationSaveBlocked&&!importProbeToken&&!expansionError;
        return {...view,choices:view.choices?.map(choice=>({...choice,eligible:canWrite&&choice.eligible})),actions:view.actions?.map(action=>({...action,eligible:canWrite&&action.eligible}))};
    },act:actInk,choose:actInk});
    document.getElementById('location_actions_div')?.append(inkPanel.element);
    nestedInkPanels=createNestedInkPanels({registry:expeditionRegistry,read:()=>({...readProgression(),context:featureWaveContext(),canWrite:ownsSave&&!foundationSaveBlocked&&!importProbeToken}),previewNative:previewNestedCommand,commitNative:planNestedAction,previewLife:previewNestedLifeCommand,commitLife:commitNestedLifeCommand,command:(id,token,host)=>{assertFeatureWriter();persistExpansion(commitInkNarrativeAction(expansionState,expeditionRegistry,{...token,id},featureWaveContext(),host));}});
    originalFrontierPanel=createOriginalFrontierPanel({registry:expeditionRegistry,read:()=>({...readProgression(),context:campaignContext(),inDialogue:!!current_dialogue,inCombat:!!current_combat,enabled:ownsSave&&!foundationSaveBlocked&&!importProbeToken}),command:actOriginalFrontier});
    pocketRealmPanel=createPocketRealmPanel({registry:expeditionRegistry,read:()=>({...readProgression(),context:pocketContext(expansionState,{...campaignContext(),equipment:Object.fromEntries(Object.entries(simulationNativeContexts()).filter(([,c])=>c.equipment).map(([id,c])=>[id,c.equipment]))}),inDialogue:!!current_dialogue,inCombat:!!current_combat,canWrite:ownsSave&&!foundationSaveBlocked&&!importProbeToken}),command:actPocketRealm});
    bodyPanel = createBodyPanel({registry: expeditionRegistry,
        read: () => {const snapshot=readProgression();return {...snapshot,inDialogue:!!current_dialogue,
            context:{...snapshot.context,vitals:Object.fromEntries(Object.entries(simulationNativeContexts()).map(([id,c])=>[id,c.vitals]))}};}, command: actSimulation});
    fieldPanel = createFieldPanel({registry:expeditionRegistry,read:()=>{const snapshot=readProgression();return {...snapshot,inDialogue:!!current_dialogue,
        context:{...snapshot.context,vitals:Object.fromEntries(Object.entries(simulationNativeContexts()).map(([id,c])=>[id,c.vitals]))}};},command:actSimulation});
    promisePanel=createPromisePanel({registry:expeditionRegistry,read:()=>({...readProgression(),context:campaignContext(),canWrite:ownsSave && !foundationSaveBlocked && !importProbeToken,inDialogue:!!current_dialogue,inCombat:!!current_combat}),command:actSimulation});
    chroniclePanel = createChroniclePanel({read: () => ({state: expansionState, context: chronicleContext(),
        canWrite: ownsSave && !importProbeToken && !foundationSaveBlocked,
        enabled: ownsSave && current_location?.id === "Village" && !current_activity && !current_game_action && !current_combat && !is_sleeping && !is_reading && !is_in_trade() && !activePractice(expansionState.actors.player) && metVillageElder(),
        occupied: expansionState.pending.some(j => j.context.actorId === "player"),
        dutyJob: expansionState.pending.find(j => j.actionId === "chronicle.archive_duty"), error: expansionError, pauseReason: chroniclePauseReason}),
        command: actChronicle, duty: () => startExpedition("chronicle.archive_duty", expansionState.sequence),
        cancelDuty: () => {const j = expansionState.pending.find(j => j.actionId === "chronicle.archive_duty"); if(j) cancelExpedition(j.id, expansionState.sequence);},
        exportSave: () => {const serialized = create_save(); if(!serialized) return; const url = URL.createObjectURL(new Blob([encodeSaveFile(serialized)], {type: "text/plain"})); const a = document.createElement("a"); a.href = url; a.download = "YAIRPG-ended-life.txt"; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);}, reset: hard_reset,
        beginHeir, heirPreview: previewHeir});
    knownRoutesPanel=createKnownRoutesPanel({container:document.getElementById('location_actions_div'),focusFallback:document.getElementById('journal_show_notebook'),
        read:()=>({...readProgression(),context:featureWaveContext(),inDialogue:!!current_dialogue,inCombat:!!current_combat,canWrite:ownsSave&&!foundationSaveBlocked&&!importProbeToken}),
        present:snapshot=>{
            if(snapshot.inDialogue||snapshot.inCombat)return {visible:false,section:null};
            const pocketView=pocketRealmView(snapshot.state),pocketCurrent=pocketContext(snapshot.state,snapshot.context);
            const pocketActions=pocketView.discovered?['pocket.open','pocket.enter','pocket.exit'].flatMap(id=>{
                const action=pocketRealmActions.find(a=>a.id===id),quote=previewPocketRealmAction(snapshot.state,expeditionRegistry,id,pocketCurrent);
                return quote.visible?[{...action,...quote,command:{id,sequence:snapshot.state.sequence}}]:[];
            }):[];
            return knownRoutesPresentation(snapshot,{refinement:refinementPresentation(snapshot,expeditionRegistry,{base:featureWavePresentation,relayHost,referenceDeskHost,replacementContext:backlogContext}),proto23:proto23Presentation(snapshot.state,expeditionRegistry,snapshot.context),pocket:{view:pocketView,actions:pocketActions}});
        },command:command=>command.type?actFeatureExpansion(command):actPocketRealm(command)});
    // CH1 panel wiring: read native stats and only held title names.
    statusWindow = createStatusWindow({read: () => ({cheats: cheatState, level: character.getLevelableComponent().current_level,
        stats: character.getFullStats(), titles: titleView(character.titles, readTitleCounters()).filter(row => row.held).map(row => row.name)}),
        onKnown: () => {
            // Appearance names this module only after its persisted discovery.
            const select = document.querySelector('#customization_host select[aria-label="Native module"]');
            if(select && !select.querySelector('option[value="status-window"]')) {
                const option = document.createElement('option'); option.value = 'status-window'; option.textContent = 'Status window'; select.append(option);
            }
        }});
    adventureNotebook = createAdventureNotebook({registry: expeditionRegistry,
        read: () => ({...readProgression(), inDialogue: !!current_dialogue, inCombat: !!current_combat})});
    document.getElementById('crafting_window').classList.add('settled-effects-host');
    workLedgerCraftEffects=createSettledTextEffects({container:document.getElementById('crafting_window'),readSettings:()=>getCustomizationSettings(customization,'crafting',{season:current_game_time.getSeason()})});
    nativeDiscoveryFeedback=createNativeDiscoveryFeedback({container:document.getElementById('skills_and_stances_div'),
        readSettings:()=>getCustomizationSettings(customization,'skills',{season:current_game_time.getSeason()}),
        resolve:id=>skills[id] ? nativeSkillDiscovery(skills[id],character) : null});
    registerMixtureGathering(locations);
    createMixturePanel({craftingContainer:document.getElementById('crafting_window'),actionContainer:document.getElementById('location_actions_div'),
        read:()=>({seed:mixtureSeed(),clock:calendarMinutes(current_game_time),inventory:character.getItems(),
            visible:current_location?.id==='Village'&&expansionState.actors.player.worldId==='base.frontier'&&!current_dialogue&&!current_combat,
            ready:workLedgerCanWrite()&&!nativeOccupationReason()&&!current_activity&&!current_game_action&&!current_dialogue&&!current_combat&&!is_sleeping&&!is_reading&&!is_in_trade()}),act:performMixtureAction});
    const cancelCraftEffect=document.createElement('button');cancelCraftEffect.type='button';cancelCraftEffect.textContent='Cancel visual effect';cancelCraftEffect.id='cancel_craft_visual_effect';cancelCraftEffect.addEventListener('click',()=>workLedgerCraftEffects.cancel());document.getElementById('crafting_window').append(cancelCraftEffect);
    workLedgerPanel=createWorkLedgerUI({container:document.getElementById('location_actions_div'),readSettings:()=>getCustomizationSettings(customization,'ledger',{season:current_game_time.getSeason()}),cancelExternalEffects:()=>workLedgerCraftEffects?.cancel(),read:()=>({...workLedgerPresentation(workLedger,workLedgerContext()),canWrite:workLedgerCanWrite()&&workLedgerContext().alive&&!workLedgerContext().busy&&workLedgerContext().locationId==='Village',reason:!workLedgerCanWrite()?'Saving unavailable; ledger is read-only.':workLedgerContext().busy?'Finish current work before choosing.':''}),command:actWorkLedger});
    const customizationHost=document.createElement('div');customizationHost.id='customization_host';
    const effectsHost=document.createElement('div');effectsHost.id='customization_effects_host';
    const rulesHost=document.createElement('div');rulesHost.id='customization_rules_host';
    const previewHost=document.createElement('div');previewHost.id='customization_preview_host';
    document.getElementById('location_actions_div').append(customizationHost,effectsHost,rulesHost,previewHost);
    customizationPanel=createCustomizationUI({container:customizationHost,effectsContainer:effectsHost,previewContainer:previewHost,readPreview:()=>[{label:'Known place',value:document.getElementById('location_name_span')?.innerText.trim()||'Unavailable'},{label:'Level',value:document.getElementById('character_level_div')?.innerText.trim()||'Unavailable'}],read:()=>customization,save:saveCustomization,season:()=>current_game_time.getSeason(),canWrite:workLedgerCanWrite,moduleIds:['ledger','crafting','local-actions','vitals','preparation','belongings','records','time','location','skills','messages','notebook','customization']});
    workLedgerAuthor=createWorkLedgerAuthorUI({container:rulesHost,read:()=>createWorkLedgerRulesDraft(workLedger),apply:draft=>publishWorkLedger(applyWorkLedgerRulesDraft(workLedger,draft,workLedgerContext(),{sequence:workLedger.sequence+1})),reset:()=>publishWorkLedger(resetWorkLedgerRules(workLedger,workLedgerContext(),{sequence:workLedger.sequence+1})),canWrite:()=>workLedgerCanWrite()&&workLedgerContext().alive&&!workLedgerContext().busy&&workLedgerContext().locationId==='Village'});
    const quietPlaceDetail=createQuietPlaceDetail({container:document.getElementById('location_div'),before:document.getElementById('location_description_div'),read:()=>({
        knownVillage:expansionState.actors.player.worldId==='base.frontier'&&current_location?.id==='Village',
        roofed:!!current_location?.is_under_roof,raining:is_raining(),daylight:current_game_time.getTimeOfDaySimple(),
        effects:getCustomizationSettings(customization,'location',{season:current_game_time.getSeason()}).effects
    })});
    refreshCustomization();
    setInterval(()=>{quietPlaceDetail.render();workLedgerPanel?.render();customizationPanel?.refresh();if(!workspaceOwns(customizationHost)&&!customizationHost.isConnected)document.getElementById('location_actions_div')?.append(customizationHost);workLedgerAuthor?.refresh();},250);
    villageCareerControls = createVillageCareerControls({read:()=>({state:villageCareer,study:watchcraftPresentation(villageCareer,watchcraftKnown()),hasNotes:!!character.getItems()[item_templates[WATCHCRAFT_BOOK].getInventoryKey()],
        visible:current_location?.id==='Village' && expansionState.actors.player.worldId==='base.frontier' && !current_dialogue && !current_combat && !is_sleeping && !is_reading && !is_in_trade() && !current_game_action,
        canWrite:ownsSave&&!foundationSaveBlocked&&!importProbeToken,
        busy:!!current_activity || !!nativeOccupationReason(),canTeach:current_activity?.id==='patrolling' && !foundationSaveBlocked && !importProbeToken && ownsSave && !nativeOccupationReason(),recruitAlive:!!npcLives?.people.some(p=>p.id==='iona' && current_game_time.year<p.deathYear)}),
        mentor:choice=>writeVillageCareer(choice),resolve:choice=>writeVillageCareer(choice),promote:()=>writeVillageCareer('promote'),
        notes:()=>writeVillageCareer('notes'),tutor:()=>writeVillageCareer('tutor'),readNotes:()=>start_reading(WATCHCRAFT_BOOK),
        practice:()=>start_activity('meditating')});
    registerGeneratedPeople({read:()=>({at:calendarMinutes(current_game_time),seed:generatedPeopleSeed(),
        inVillage:current_location?.id==='Village'&&expansionState.actors.player.worldId==='base.frontier',
        canWrite:ownsSave&&!foundationSaveBlocked&&!importProbeToken&&!is_loading_error&&!lifeStorageFailure,
        busy:!!(nativeOccupationReason()||current_activity||current_game_action||current_combat||current_dialogue||is_sleeping||is_reading||is_in_trade())}),
        save:create_save,persist:serialized=>lifeSaveStorage.setItem(is_on_dev()?dev_save_key:save_key,serialized),
        authoredNames:[...expeditionRegistry.simulation.people.values()].map(p=>p.label||p.name||p.id),
        itemKey:id=>item_templates[id].getInventoryKey(),canSupply:key=>canConsumeNativeCraftingItem(key)&&character.getItems()[key]?.count>=1,
        publishSupply:key=>{character.removeFromInventory([{item_key:key,item_count:1}]);update_displayed_character_inventory();},publishReward:add_money_to_character});
    villageLivesPanel = createVillageLivesPanel({read:()=>({state:npcLives,inVillage:current_location?.id==='Village' && expansionState.actors.player.worldId==='base.frontier',canWrite:ownsSave&&!foundationSaveBlocked&&!importProbeToken}),meet:()=>{
        if(npcLives || !ownsSave || foundationSaveBlocked || importProbeToken || current_location?.id!=='Village' || expansionState.actors.player.worldId!=='base.frontier')throw new Error("Meet your neighbors in Village when your life can be saved.");
        const serialized=create_save();if(!serialized)throw new Error("This meeting could not be remembered.");
        const save=JSON.parse(serialized);save.npc_lives=createVillageLives(save['current time'].year,expansionState.rng);
        lifeSaveStorage.setItem(is_on_dev()?dev_save_key:save_key,JSON.stringify(save));
    }});
    titlesPanel = createTitlesPanel({read: () => titleView(character.titles, readTitleCounters())});
    for(const id of ['Proto23 plain bed','Proto23 cottage hearth','Proto23 bookstand','Prepared survey kit']) {
        const bonus=furnitureItemBonusText(id);if(item_templates[id]&&bonus&&!item_templates[id].description.includes(bonus))item_templates[id].description+=' '+bonus;
    }
    setAccessoryEquipmentReader(() => {
        const equipment=character.getEquipment(),amulet=equipment.amulet;
        if(amulet){try{assertNativeItemDisposition(expansionState,amulet.getInventoryKey());}catch{return {};}}
        return equipment;
    });
    furniturePanel=createFurniturePanel();
    if(localLife.lastClock==null)localLife.lastClock=calendarMinutes(current_game_time);
    localLifePanel=createLocalLifePanel({container:document.getElementById('location_actions_div'),
        read:()=>({state:localLife,context:localLifeContext()}),
        act:id=>dispatchLocalLifePlan(localLifeAction(localLife,localLifeContext(),id))});
    pacingMinute??=calendarMinutes(current_game_time);
    pacingPanel=mountPacingPanel({host:document.getElementById('options_choices'),getContext:homePacingContext,onChange:changeHomePacing});
    pacingStatusPanel=createPacingStatusPanel();
    durabilityPanel=createDurabilityPanel();
    elementalPanel=createElementalPanel();
    setKnownClearTextReader(location=>knownClearText(location,fortDisclosures(book_stats[FORT.notes].accumulated_time>=4)));
    fortControls=createFortControls({read:readFortFrame,act:actFort});
    if(current_location?.tags.safe_zone && !current_activity && !current_game_action && !current_combat && !current_dialogue && !is_sleeping && !is_reading && !is_in_trade()) reload_normal_location();
    lifeRecordPanel = createLifeRecordPanel({read:()=>({record:lifeRecord,canWrite:ownsSave&&!foundationSaveBlocked&&!importProbeToken}),remember:()=>{
        if(!ownsSave || foundationSaveBlocked || importProbeToken) throw new Error("This life cannot be written right now.");
        const serialized=create_save(); if(!serialized) throw new Error("This day could not be remembered.");
        const save=JSON.parse(serialized), t=save["current time"], worldId=expansionState.actors.player.worldId;
        const at=lifeCalendarMinute(t);
        if(save.life_record.recent.some(e=>e.kind==='memory' && Math.floor(e.at/1440)===Math.floor(at/1440) && e.worldId===worldId)) throw new Error("You have already held this day in memory.");
        save.life_record=appendLifeMilestone(save.life_record,{year:t.year,at,worldId,kind:'memory',text:`You paused in ${current_location.name || current_location.id} and held this day in memory.`});
        lifeSaveStorage.setItem(is_on_dev()?dev_save_key:save_key,JSON.stringify(save));
    }});
    worldEventFeed = createEventFeed({registry: expeditionRegistry,
        read: () => ({...readProgression(), inDialogue: !!current_dialogue, inCombat: !!current_combat}),
        open: event => {
            adventureNotebook.open(event.view);
            const panel = document.getElementById(event.panel);
            if(!panel || panel.hidden) return;
            panel.open = true;
            const attribute = ({chronicle_panel:"chronicle",simulation_panel:"simulation",storylet_panel:"storylet-card",expedition_panel:"expedition-action",field_panel:"field-command",promise_panel:"promise-command",pursuit_panel:"pursuit"})[event.panel];
            const control = event.control && panel.querySelector(`[data-${attribute}="${CSS.escape(event.control)}"]`);
            if(control)for(let ancestor=control.parentElement;ancestor && ancestor !== panel;ancestor=ancestor.parentElement)if(ancestor.tagName === "DETAILS")ancestor.open=true;
            const target = control && !control.hidden && !control.disabled ? control : panel.querySelector("summary");
            target?.focus(); target?.scrollIntoView({block:"nearest"});
        }});
    for(const [id,title,nodeId,home,critical] of [
        ['vitals','Character vitals','basic_character_info_div','left',true],
        ['time','Time & weather','time_and_location','center',true],
        ['location','Current location','location_div','center',true],
        ['combat-controls','Inventory & combat view','inventory_combat_switch_selection','left',true],
        ['skills','Skills & practice','skills_and_stances_div','right',false],
        ['records','Journal & received accounts','journal_div','right',false],
        ['preparation','Character & preparation','character_div','left',false],
        ['belongings','Belongings','inventory_div','left',false],
        ['local-actions','Local actions','location_related_div','center',true],
        ['messages','Reports','message_log_div','right',false],
    ]) {const node=document.getElementById(nodeId);if(node)registerWorkspaceModule({id,title,node,home,critical});}
    createEquipmentComparison({read:()=>{
        const held=Object.entries(character.getItems()).map(([id,row])=>({id,item:row.item,label:'Held'}));
        const worn=Object.entries(character.getEquipment()).filter(([,item])=>item).map(([id,item])=>({id:'worn:'+id,item,label:'Worn'}));
        return [...held,...worn].filter(r=>r.item?.tags.equippable).map(({id,item,label})=>{
            const stats={};if(item.getAttack)stats.Attack=item.getAttack();if(item.getDefense)stats.Defense=item.getDefense();
            if(item.quality!=null)stats.Quality=item.quality+'%';
            for(const [key,value]of Object.entries(item.getStats?.()||{}))stats[key]=[value.flat!=null?`+${value.flat}`:null,value.multiplier!=null?`×${value.multiplier}`:null].filter(Boolean).join(' ');
            return {id,label:label+': '+item.getName(),slot:item.equip_slot,stats};
        });
    }});
    // Current work names the activity in the game's own words; jobs add native next-pay timing.
    const nativeWorkLabel=activity=>{
        const base=activities[activity.activity_name],label=(base?.action_text||activity.starting_text||'Current activity').replace(/\.+$/,'');
        if(base?.type!=='JOB')return label;
        return enough_time_for_earnings(activity)?`${label} · next full-round pay in ${format_working_time(activity.gathering_time_needed-activity.gathering_time%activity.gathering_time_needed)}`:`${label} · no time for another full paid round`;
    };
    createWorkspaceViews({read:()=>({
        work:[current_activity?nativeWorkLabel(current_activity):null,current_game_action?.name,
            is_sleeping?'Sleeping':null,is_reading?'Reading':null,current_dialogue?'Conversation in progress':null,
            current_combat?'Combat in progress':null,
            ...expansionState.pending.filter(j=>j.context.actorId==='player').map(j=>`${j.label||expeditionRegistry.actions.get(j.actionId)?.label||'Current work'}: ${Math.max(0,j.due-expansionState.clock)} min remaining`),
            ...(expansionState.simulation?.jobs||[]).filter(j=>j.actorId==='player').map(j=>`${j.label||'Current work'}: ${Math.max(0,j.due-expansionState.clock)} min remaining`),
            ...Object.entries(optionalPackState.packs).filter(([,r])=>r.active&&r.job).map(([id,r])=>`${optionalPacks.get(id)?.activities.find(a=>a.id===r.job.actionId)?.label||'Local work'}: ${r.job.remaining} min remaining`),
            expansionState.simulation?.sessions.player?'A response is waiting in your notes.':null,
            ...Object.values(expansionState.simulation?.events||{}).filter(e=>e.actorId==='player'&&e.mode==='decision'&&e.nonBlocking!==true&&e.status==='open'&&e.discoveredBy.includes('player')).map(e=>'Waiting response: '+e.label),
        ].filter(Boolean),waiting:!!expansionState.simulation?.sessions.player||Object.values(expansionState.simulation?.events||{}).some(e=>e.actorId==='player'&&e.mode==='decision'&&e.nonBlocking!==true&&e.status==='open'&&e.discoveredBy.includes('player')),canWrite:workLedgerCanWrite(),error:expansionError,
        world:Object.values(optionalPackState.packs).find(p=>p.active)?.worldId || expansionState.actors.player.worldId,
        away:expansionState.actors.player.worldId!=='base.frontier'
    }),combatKnown:()=>!!last_combat_location||game_stats.total_hits_done>0});
    registerWorkspaceModule({id:'ledger',title:'Work Ledger',node:workLedgerPanel.panel,home:'center',eligible:()=>!workLedgerPanel.panel.hidden});
    registerWorkspaceModule({id:'customization',title:'Appearance',node:customizationHost,home:'left'});
    registerWorkspaceModule({id:'customization-effects',title:'Effects & sound',node:effectsHost,home:'center'});
    registerWorkspaceModule({id:'customization-rules',title:'Original rules',node:rulesHost,home:'right'});
    registerWorkspaceModule({id:'customization-preview',title:'Draft preview',node:previewHost,home:'right'});
    const authoredHost=document.createElement('div');authoredHost.id='customization_sites_host';document.getElementById('location_actions_div').append(authoredHost);
    const authoredSiteEditor=createAuthoredSiteUI({container:authoredHost,
        read:()=>({applied:optionalPackState.authored?.draft??null,canWrite:ownsSave&&!foundationSaveBlocked&&!lifeStorageFailure&&!optionalPackState.packs.authored_site?.active,
            reason:optionalPackState.packs.authored_site?.active?'Return to the Village from the site to change it.':''}),
        apply:draft=>commandAuthoredSite('apply',draft),reset:()=>commandAuthoredSite('reset'),openSite:()=>openWorkspaceModule('optional-worlds'),
        download:(name,text)=>{const url=URL.createObjectURL(new Blob([text],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),0);}});
    setInterval(()=>authoredSiteEditor.refresh(),500);
    registerWorkspaceModule({id:'customization-sites',title:'Original site',node:authoredHost,home:'center'});
    mountWorkspace();
    refreshCustomization();
    expansionQuests = createExpansionQuests({read: readProgression});
    const bodySkills = new Set(["Running","Weightlifting","Climbing","Equilibrium","Breathing","Swimming","Fortitude","Perception","Meditation","Sleeping","Cold resistance"]);
    characterBio = createCharacterBio({registry: expeditionRegistry, read: readProgression,
        readTraining: () => Object.values(skills).filter(skill => skill.isUnlocked() && skill.getTotalXP() >= skill.visibility_treshold && skill.getCurrentLvl() > 0)
            .map(skill => ({id:skill.skill_id, label:skill.getName(), level:skill.getCurrentLvl(), effectiveLevel:character.getTotalSkillLevel(skill.skill_id), visible:true,
                stats:skill.get_bonus_stats({skillXP:{current_level:0},level:skill.getCurrentLvl(),track_dependencies:false}).stats,
                bodyEffect:bodySkills.has(skill.skill_id) ? skill.get_effect_description() : ""})),
        practice: () => adventureNotebook.open("practice"),
        showSkill: id => {
            document.getElementById("show_skills")?.click();
            const bar = document.querySelector(`#skill_list_div [data-skill="${CSS.escape(id)}"]`);
            if(bar) {bar.closest("[data-skill_category]").classList.add("skill_category_expanded"); bar.tabIndex=-1; bar.focus(); bar.scrollIntoView({block:"nearest"});}
        }});
}

if(game_options.skip_play_button && !importProbeToken) {
    play_button.click();
}

if(importProbeToken) installImportProbe(importProbeToken, data => {
    const result = load(data);
    if(config.use_racial_bonuses) character.addRaceBonus();
    if(config.use_height_bonuses) character.addHeightBonus();
    return result;
});

if(is_on_dev()) {
    log_message("It looks like you are playing on the dev release. It is recommended to keep the developer console open (in Chrome/Firefox/Edge it's at F12 => 'Console' tab) in case of any errors/warnings appearing in there.", "notification");

    if(localStorage[dev_backup_key]) {
        update_backup_load_button(JSON.parse(localStorage[dev_backup_key]).saved_at);
    } else {
        update_backup_load_button();
    }

    if(localStorage[save_key]) {
        update_other_save_load_button(JSON.parse(localStorage[save_key]).saved_at || "", true);
    } else {
        update_other_save_load_button(null, true);
    }
} else {
    if(localStorage[backup_key]) {
        update_backup_load_button(JSON.parse(localStorage[backup_key]).saved_at);
    } else {
        update_backup_load_button();
    }

    if(localStorage[dev_save_key]) {
        update_other_save_load_button(JSON.parse(localStorage[dev_save_key]).saved_at || "");
    } else {
        update_other_save_load_button();
    }
}


//attach proper hitcounter, plus noindex for dev page
if(is_on_dev()) {
    insert_HTML(
        document.head,
        `<meta name="robots" content="noindex">`
    );
    insert_HTML(
        document.getElementById("bottom_panel_div"), 
        `<img id = "hits_counter" src="https://hitscounter.dev/api/hit?url=https%3A%2F%2Fmiktaew.github.io%2Fyet-another-idle-rpg-dev%2F&label=Visitors&color=%23084298&message=&style=flat&tz=UTC">`
    );
} else if(is_on_main()) {
    insert_HTML(
        document.getElementById("bottom_panel_div"), 
        `<img id = "hits_counter" src="https://hitscounter.dev/api/hit?url=https%3A%2F%2Fmiktaew.github.io%2Fyet-another-idle-rpg%2F&label=Visitors&color=%23084298&message=&style=flat&tz=UTC">`
    );
} else {
    insert_HTML(
        document.getElementById("bottom_panel_div"), 
        `<img id = "hits_counter" src="https://hitscounter.dev/api/hit?label=dummy+hit+counter&color=%23084298&message=&style=flat&tz=UTC">`
    );
}

if(config.enable_dev_mode) {
    enable_dev_console();
}
export { 
    current_combat,
    current_location,
    can_work, active_effects,
    enough_time_for_earnings, add_xp_to_skill, commitNativeTrade,
    get_current_book,
    last_location_with_bed, last_combat_location,
    current_stance, selected_stance, change_stance, faved_stances, 
    game_options, global_flags,
    character_equip_item,
    unlocked_beds,
    favourite_consumables,
    remove_consumable_from_favourites,
    get_context,
    travel_times,
    language, languages,
    add_active_effect, add_xp_to_character,
    favourite_items, remove_item_from_favourites,
    run,
    tickrate,
    finish_combat_round, use_stamina,
    game_stats, 
    kill_target, kill_player,
    process_current_loot,
    add_money_to_character,
    unlock_location,
    flag_unlock_texts,
    remove_location_from_favourites,
    unlock_global_activity,
    unlock_activity,
    unlock_action,
    unlock_combat_stance,
    lock_location,
    lock_action,
    update_pathing,
    change_location, change_current_location,
    process_rewards,
    translate
};
