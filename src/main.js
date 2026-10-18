import {configureCraftingDomain} from './crafting_domain.js';
import {domainRegistry} from './domain_registry.js';
import {configureResourceDomains,harvestOwner,habitatOwner,harvestPanel,habitatPanel,setHarvestOwner,setHabitatOwner,receiveHarvest} from './native_resources_domain.js';
import {bindNativeView} from './native_view.js';
import {translate, bindTranslationReaders} from './native_translation.js';
import {can_work, enough_time_for_earnings} from './activity_time.js';
import {global_flags, languages, language, current_location, travel_times, unlocked_beds, last_location_with_bed, last_combat_location, active_effects, selected_stance, faved_stances, favourite_consumables, favourite_items, game_options, setLanguage, setCurrentLocation, setTravelTimes, setUnlockedBeds, setLastLocationWithBed, setLastCombatLocation, setSelectedStance} from './runtime_state.js';
import {readNativeCombatFocus} from './combat_focus.js';
import {mountProto23Shell} from './proto23_shell.js';
import {mountWorkspaceNavigation} from './workspace_navigation.js';
import {createVillageWorkspace} from './village_workspace.js';
import {projectPlaceTypes} from './place_types_projection.js';
import {get_location_type_penalty} from './models/location.js';
import {projectsHome,openProjects} from './projects_drawer.js';
import {generatedPeopleView} from './generated_people.js';
import {mistglassProfile as MISTGLASS,mistglassContent} from './absorb_p23/world_adaptation/index.js';
import {MISTGLASS_LOCATION,MISTGLASS_KEEPER,registerMistglassNative,mistglassContext,stageMistglassTravel,stageMistglassTeaching,stageMistglassTrial,stageMistglassAdvance,stageMistglassRestock,mistglassNextBoundary,knownMistglassView} from './absorb_p23/host_joins/world_adaptation.js';
import {createMistglassPanel} from './absorb_p23/host_joins/world_adaptation_ui.js';
import {PROFILE,enrollGrowth,validateGrowthState,growthView,consumeTonic,setBackground,advanceBackground,settleAward,quoteTonicAcquisition} from './absorb_p23/growth_profile/profile.js';
import {GROWTH_COUNTER_ID,GROWTH_COUNTER_TEMPLATE,GROWTH_TONIC_KEY,growthLearned,growthFlatSource,noHealGrowthVitals,GROWTH_EARNED_THRESHOLD,validateGrowthEarned,readNativeSkillXP,observeGrowthEarned,freezeEarnedGrowth} from './absorb_p23/host_joins/growth_profile.js';
import {createGrowthPanel} from './absorb_p23/host_joins/growth_profile_ui.js';
import {PROFILE_ID, ENEMY_ID, AREA_ID, WORLD_ID, readProfileState, beginAttempt, previewExchange, planExchange, planSettlement, finishAttempt} from './absorb_p23/encounter_profiles/profile.js';
import {registerTrainingProfile,trainingEnemy,trainingEnemyKey,initialTrainingEncounter} from './absorb_p23/host_joins/encounter_profiles.js';
import {createTrainingPanel} from './absorb_p23/host_joins/encounter_profiles_ui.js';
import {normalizeFieldFamiliarity,fieldAction,advanceFieldFamiliarity,fieldView} from './absorb_p23/field_familiarity/index.js';
import {normalizeMarketLife,planMarketTrade,planMarketDelivery,marketLifeView} from './absorb_p23/market_life/market_life.js';
import {LEISURE_PERSON,createLeisureMemory,startLeisureRound,settleLeisureRound,respondToEda,revisitEda,rememberNativeDefeat,leisureMemoryView} from './absorb_p23/leisure_memory/index.js';
import {normalizeRepeatSearch,replenishRepeatSearch,repeatSearchAction,advanceRepeatSearch,repeatSearchView} from './absorb_p23/repeat_search/repeat_search.js';
import {stageTrancheFourReward,stageLeisureMemory,nativeMarketPreview,P23_BED_FACT,P23_LEISURE_RESERVATION,EDA_KNOWLEDGE} from './absorb_p23/host_joins/tranche_four.js';
import {createTrancheFourPanel} from './absorb_p23/host_joins/tranche_four_ui.js';
import {stageTitleRecognition} from './absorb_p23/host_joins/long_life.js';
import {installTrainingLink,trainingView} from './absorb_p23/long_life/training.js';
import {validateWornTitle,selectWornTitle,wornTitleView,longLifeTitleBonuses} from './absorb_p23/long_life/worn.js';
import {engineTimeout,engineInterval,clearEngineInterval,engineNow,stepping,testHooksEnabled,pauseEngine,resumeEngine,runEngineTicks} from './simulation_clock.js';
import {createPlanningReadFrame} from './planning_read_frame.js';
import {deferSimulationRender,beginSimulationRenderBatch,endSimulationRenderBatch,framedSimulationRead,withSimulationFrame,deferWhileHidden} from './simulation_render.js';
import {ANTHOLOGY,ANTHOLOGY_KEY,REST_MEAL,REST_KEY,REGISTRATIONS} from './absorb_p23/reading/content.js';
import {planReadingCommand,observeReadingClock,longRestClockRequest} from './absorb_p23/reading/runtime.js';
import {readingPresentation} from './absorb_p23/reading/presentation.js';
import {readingRate} from './reveal_chain.js';
import {SALVAGE,loadSalvage,wornSalvageChoices,quoteSalvage,stageSalvage} from './absorb_p23/salvage/salvage.js';
import {stageReadingResult} from './absorb_p23/host_joins/tranche_three.js';
import {createReadingSalvagePanel} from './absorb_p23/host_joins/tranche_three_ui.js';
import {Tool} from './items.js';
import {createCombatOptionsPanel} from './absorb_p23/host_joins/combat_options_ui.js';
import {TACTICS,createCombatOptions,validateCombatOptions} from './absorb_p23/combat_options/runtime.js';
import {createLivingGearPanel} from './absorb_p23/host_joins/tranche_two_ui.js';
import {createLivingGear,registerLivingGearItems,LIVING_GEAR} from './absorb_p23/living_gear/index.js';
import {livingGearKind,stageLivingEquip} from './absorb_p23/host_joins/tranche_two.js';
import inventoryTemplates from './data/inventory_templates.js';
import {TradeItem,TradeItemGroup} from './models/trade_item.js';
import {PROTO23_IDS} from './proto23_world_ids.js';
import {stageExposureJoin,stageHouseholdJoin} from './absorb_p23/host_joins/tranche_one.js';
import {validateExposure,exposureEffects,famineEfficiency} from './absorb_p23/exposure/exposure.js';
import {mountExposurePanel,exposureStatus} from './absorb_p23/exposure/panel.js';
import {HOUSEHOLD,householdRest} from './absorb_p23/household/model.js';
import {householdPresentation} from './absorb_p23/household/host.js';
import {createHouseholdPanel} from './absorb_p23/host_joins/tranche_one_ui.js';
import {STREAMS,ensureStreams,bindGameStreams,gameKeyedRandom,gameRandom,gameRandomRange,drawUnit,scopedStream,seededRecipe,validateNativeEncounter,streamSeed} from "./seeded_streams.js";
import {GRADED_IDS,consumedHarvestQuality,gradedKey} from './harvest.js';
import {buildVillageObtainability,villageTablesFromNative} from './village_obtainability.js';
import {setProductAppearanceOwner} from './product_appearance_view.js';
import {resolveWorldCalendar, createCalendarLog} from './world_calendar.js';
import {worldWeatherWords} from './world_weather_display.js';
const mixtureSeed=()=>streamSeed(expansionState,STREAMS.craft,"village.mixtures@1");
const generatedPeopleSeed=()=>streamSeed(expansionState,scopedStream("world.people"),"village.generated_people@2");
import {getMixtureOwner,setMixtureOwner,MIXTURE_ID} from './mixture_state.js';
import {stageMixtureAction,commitMixturePlan} from './mixture_native.js';
import {createMixturePanel} from './mixture_ui.js';
import {createStoryletPanel} from './storylet_ui.js';
import {HERB_LESSON,heldLesson,bindAcquisitionLesson,bindDenominationKnowledge,createPracticePanel,knownPracticeHints,openingAllows,stageRevealKnowledge} from './reveal_chain.js';
import {getDisplaySetting,subscribeDisplaySettings,DISPLAY_KEY,exportDisplayPreferences,adoptDisplayPreferences} from './display_settings.js';
import {settleObservedDrops,validateDropObservations} from './absorb_p23/known_detail/observations.js';
import {mountKnownMethodChains,mountKnownNumber,formatKnownNumber} from './absorb_p23/known_detail/presentation.js';
import {createKnownItemHotkeys,mountKnownItemBinding,mountKnownItemHotkeyList} from './absorb_p23/known_detail/hotkeys.js';
import {skillExpansionPresentation} from './skill_expansion_host.js';
import {setNativeObservedDropReader} from './display.js';
let p23DropObservations,loadedDisplayPreferences;

import {structuredLifeEnded,reconcileStructuredLifePlan,structuredLifeView,archiveStructuredLife,publishIndependentStructuredLife,listStructuredLifeArchives} from './structured_life_runtime.js';
import {beginNativeCraftTransaction,nativeCraftQuestOwners} from './native_craft_transaction.js';
import {worldCompletionSavedNativeItem} from './world_completion_native.js';
import {createFoundationInteractionPanel} from './foundation_interaction_ui.js';
import {foundationInteractionProbeContext,foundationInteractionProbeGuard,FOUNDATION_PROBE_GROUP} from './foundation_interaction_content.js';
import {createFoundationStartContent,FOUNDATION_START_PACK_ID} from './foundation_start_content.js';
import {createLocalLivelihoodContent,LIVELIHOOD_PACK_ID} from './local_livelihood_content.js';
import {mountWorkspace,registerWorkspaceModule,workspaceOwns,openWorkspaceModule,updateWorkspace} from './workspace_layout.js';
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
import {equipmentDurability as durability,canonicalDurabilityKey,createDurability} from './absorb_e2/durability.js';
import {getPacingState,setPacingState,advancePacing,prepareFood,getPacingEffects as basePacingEffects} from './absorb_e1/pacing.js';
import {mountPacingPanel,pacingStatus} from './absorb_e1/panel.js';
import {setKnownClearTextReader} from './display.js';
import {FORT, createFortSupply, migrateFortSupply, stageFortAction, observeFortSource, fortDisclosures, knownClearText} from './absorb_d/fort.js';
import {registerFortContent} from './absorb_d/register.js';
import {createFortControls} from './absorb_d/ui.js';
import {normalizeLocalLife, advanceLocalLife, localLifeAction, recordLocalPurchases} from './absorb_c2/local_life.js';
import {createLocalLifePanel} from './absorb_c2/panel.js';
import {setAccessoryEquipmentReader, accessoryCraftingTiers} from './absorb_c1/accessories.js';
import {furnitureProjection, furnitureComfort, furnitureSkillMultiplier, furnitureRecovery, furniturePresentation, furnitureItemBonusText} from './absorb_b/furniture.js';
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
import { Amulet, Weapon, WeaponComponent, Book, BookData, OtherItem, Armor, item_templates, restoreSystemsWorkshopAvailability, item_log, getItem, book_stats, rarity_multipliers, getArmorSlot, getItemFromKey, getItemRarity} from "./items.js";
import { loot_sold_count, market_region_mapping, recover_item_prices, trickle_market_saturations, set_loot_sold_count, capped_at } from "./market_saturation.js";
import { locations, favourite_locations, location_types } from "./data/locations.js";
import { skills } from "./data/skills.js";
installTrainingLink(skills);
import { which_skills_affect_skill } from "./models/skill.js";
import { Enemy, enemy_killcount, enemy_templates, tags_for_droprate_modifier_skills } from "./enemies.js";
import { current_trader,is_in_trade, start_trade, cancel_trade, accept_trade, exit_trade,
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
         update_displayed_money, setNativeLogBufferReader, log_message,
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
import { compare_game_version, crafting_tags_to_skills, get_component_name, is_a_older_than_b, get_item_mapping, skill_consumable_tags, rtp, write_availability_status, npc_key_mapping, format_working_time, stat_names } from "./misc.js";
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
import {writeGuardedSave, encodeSaveFile, decodeSaveFile, importSaveFile, validateSaveEnvelope, createDurableSaveWriter} from "./save_files.js";
import {freshNativeSave, preflightImport, installImportProbe} from "./import_probe.js";
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
import {createStartProbe} from './start_probe_ui.js';
import {mountNewGameBeginning} from './new_game_beginning.js';
const optionalPacks=new Map();
const foundationProbeEnabled=typeof location!=='undefined'&&['localhost','127.0.0.1'].includes(location.hostname)&&new URLSearchParams(location.search).get('foundation_probe')==='1';
const structuredPacks=new Map();
// Local authoring preview selects an optional candidate without replacing live content.
const structuredCandidateId=typeof location!=='undefined'&&['localhost','127.0.0.1'].includes(location.hostname)?new URLSearchParams(location.search).get('structured_candidate'):null;
const initialStructuredDefinition=()=>structuredPacks.get(structuredCandidateId)||foundationProbeEnabled&&structuredPacks.get(FOUNDATION_START_PACK_ID)||structuredPacks.get(LIVELIHOOD_PACK_ID)||[...structuredPacks.values()][0];
const packDefinitionsForSave=()=>new Map([...optionalPacks,...structuredPacks]);
let structuredPanel,structuredNotice='',suspendedStructuredSave=null;
const nativeLifeEnded=(state=expansionState)=>state.chronicle?.life.endedAt!=null||structuredLifeEnded(state,optionalPackState.structured);
let cheatState=defaultCheatState();
let statusWindow;
function cheatCalendarTime() {
    const {year, month, day, hour, minute, day_count} = current_game_time;
    return {year, month, day, hour, minute, day_count};
}
function awakenOptionalStart(wonFight = false) {
    if(importProbeToken || !ownsSave || foundationSaveBlocked || is_loading_error || restoringNativeSave) return;
    // A won zone round is retained for retry/load; an individual bestiary kill is not a won fight.
    const result = awakenCheats(cheatState, {dayCount: current_game_time.day_count,
        wonFight: wonFight || Object.values(locations).some(zone => zone.tags.combat_zone && zone.enemy_groups_killed > 0), at: cheatCalendarTime()});
    if(!result.messages.length) return;
    let durable = false;
    try {
        const serialized = create_save();
        if(!serialized) return;
        const save = JSON.parse(serialized);
        save.cheats = result.state;
        validateSaveEnvelope(save, game_version);
        // Keep live discovery dormant until the shared storage owner commits.
        lifeSaveStorage.setItem(is_on_dev() ? dev_save_key : save_key, JSON.stringify(save), () => {
            durable = true;
            cheatState = result.state;
        });
    } catch(error) {
        if(!durable) {log_message(error.message, 'message_critical'); return;}
        console.error('Awakening saved; display refresh failed:', error);
    }
    for(const message of result.messages) log_message(message, 'notification');
    statusWindow?.render();
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
import {townUnlocks, usesTownClock, villageLedgerSentence} from "./town_content.js";
import {createTownPanel} from "./town_ui.js";
import {createExpansionQuests} from "./expansion_quest_ui.js";
import {worldIdentityView} from "./world_knowledge.js";
import {createStatusWindow} from './status_window.js';
import {createAdventureNotebook} from "./adventure_notebook.js";
import {createCharacterBio} from "./character_bio_ui.js";
import {bodyFacts, beginBodyRecord} from "./body_progression.js";
import {createBodyPanel} from "./body_ui.js";
import {createSimulationPanel} from "./simulation_ui.js";
import {createSystemsWorkshopPanel} from './systems_workshop_ui.js';
import {reconcileSystemsWorkshop} from './systems_workshop_runtime.js';
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
import {createNativeAuthority, nativeAuthorityKey} from "./absorb_p23/save_time_options/native_authority.js";
const freshAuthorityProbe = new URL(window.location.href).searchParams.has("authority_fresh");
let authorityOperationBusy=false, authorityBootError=null;
const importProbeToken = new URL(window.location.href).searchParams.get("import_probe");
let importInProgress = false;
let loadingReputationTotals = null;
let restoringNativeSave = false;
const localDateLog = createCalendarLog((...args) => log_message(...args));
function readVillageLedgerSentence() {return villageLedgerSentence(expansionState);}
export function readLocalCalendar() {return resolveWorldCalendar(expansionState, current_game_time);}
export function readLocalWeatherWords() {
    return worldWeatherWords(expansionState?.actors?.player?.worldId ?? 'base.frontier', readLocalCalendar(), current_location);
}
function commitLocalDateHeader() {if (!restoringNativeSave) localDateLog.commit(readLocalCalendar());}


import {prepareV06Save} from "./save_migration.js";

import {beginContinuation, observeContinuation, continuationView, planContinuation} from './continuation_state.js';
import {createContinuationHost} from './continuation_host.js';
import {createContinuationUI} from './continuation_ui.js';
import {suspendEngine} from './simulation_clock.js';
let continuationState=null, continuationPanel=null, continuationArrivalRelease=null;

const save_key = "save data";
const dev_save_key = "dev save data";
const backup_key = "backup save";
const dev_backup_key = "dev backup save";
// Heir succession: the ended life stays in the save slot until the heir's
// envelope passes the real import check. Only a small request crosses reload.
const nativeAuthority=createNativeAuthority({storage:localStorage,release:is_on_dev()?'dev':'live',currentVersion:game_version,
    ownsSave:()=>ownsSave&&!importProbeToken&&!foundationSaveBlocked&&!is_loading_error,
    preflight:preflightImport});
function activeNativeBytes(key) {
    if(importProbeToken)return localStorage.getItem(key);
    if(key===save_key||key===dev_save_key) {
        const release=key===dev_save_key?'dev':'live';
        if(localStorage.getItem(nativeAuthorityKey(release))!==null) {
            // Cross-release reads still validate authority, never silently select legacy.
            return createNativeAuthority({storage:localStorage,release,currentVersion:game_version,
                ownsSave:()=>ownsSave,preflight:preflightImport}).read().current;
        }
    }
    return localStorage.getItem(key);
}
let authorityBootPending=!importProbeToken&&localStorage.getItem(nativeAuthority.key)!==null;
function authorityEnrolled(){return !importProbeToken&&localStorage.getItem(nativeAuthority.key)!==null;}
function assertAuthorityIdle() {
    if(!ownsSave||importProbeToken||foundationSaveBlocked||is_loading_error||authorityOperationBusy)throw Error('Use the writable game tab after recovery finishes.');
    if(current_combat||current_activity||current_game_action||current_dialogue||is_sleeping||is_reading||is_in_trade()||nativeOccupationReason())throw Error('Finish your current native work before save recovery.');
}
async function authorityOperation(run,{reload=false}={}) {
    assertAuthorityIdle();authorityOperationBusy=true;
    try {const result=await run();if(reload){window.location.reload();return result;}authorityOperationBusy=false;return result;}
    catch(error){authorityOperationBusy=false;throw error;}
}
for(const type of ['click','keydown','change','submit'])document.addEventListener(type,event=>{
    if(authorityOperationBusy&&!event.target?.closest?.('#native_authority_recovery')){event.preventDefault();event.stopImmediatePropagation();}
},true);
function downloadAuthorityData(name,bytes) {
    const url=URL.createObjectURL(new Blob([encodeSaveFile(bytes)],{type:'text/plain'})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function mountAuthorityUI() {
    if(importProbeToken||authorityBootError)return;
    const box=document.createElement('details');box.id='native_save_authority';
    const summary=document.createElement('summary');summary.textContent='Backup and Undo (opt in)';box.append(summary);
    const text=document.createElement('p');text.textContent='Enrollment keeps your legacy saves unchanged. Enrolled games need this build or later. Capture a backup before Undo; Undo restores that exact native life.';box.append(text);
    const status=document.createElement('p');status.id='native_save_authority_status';box.append(status);
    const refresh=()=>{try{const root=nativeAuthority.read();status.textContent=root?`Enrolled, revision ${root.revision}. ${root.previous?'Backup available.':'No captured backup yet.'}`:'Not enrolled. Existing save behavior is unchanged.';}catch(error){status.textContent=error.message;}};
    const action=(label,id,run)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.id=id;b.onclick=async()=>{try{await run();refresh();}catch(error){status.textContent=error.message;log_message(error.message,'message_critical');}};box.append(b);};
    action('Enroll this game','native_authority_enroll',()=>authorityOperation(()=>nativeAuthority.enroll(create_save())));
    action('Capture backup','native_authority_capture',()=>authorityOperation(()=>nativeAuthority.capture(create_save())));
    action('Undo to captured backup','native_authority_undo',()=>authorityOperation(()=>nativeAuthority.undo(),{reload:true}));
    action('Download captured backup','native_authority_download',()=>{const r=nativeAuthority.read();if(!r?.previous)throw Error('Capture a backup first.');downloadAuthorityData('YAIRPG-captured-backup.txt',r.previous);});
    document.getElementById('options_choices').append(box);refresh();
}
function showAuthorityRecovery(error) {
    const box=document.createElement('section');box.id='native_authority_recovery';
    Object.assign(box.style,{position:'fixed',inset:'15% 15%',padding:'24px',background:'#252525',color:'#eee',zIndex:'30000',overflow:'auto'});
    const text=document.createElement('p');text.textContent=error.message+' To recover, download your preserved legacy save below, then import that file in an older compatible build on a separate origin. This origin remains blocked until its authority is repaired or explicitly removed in browser storage after preserving these files.';box.append(text);
    for(const [label,key] of [['preserved legacy save',is_on_dev()?dev_save_key:save_key],['original authority',nativeAuthority.key]]) {
        const bytes=localStorage.getItem(key);if(bytes===null)continue;const b=document.createElement('button');b.textContent='Download '+label;b.onclick=()=>downloadAuthorityData('YAIRPG-'+label.replaceAll(' ','-')+'.txt',bytes);box.append(b);
    }
    document.body.append(box);
}
const independent_request_key='structured independent request';
const independentRequest=(()=>{if(importProbeToken)return null;try{const r=JSON.parse(localStorage.getItem(independent_request_key));return r?.schema===1&&!r.error?r:null;}catch{return null;}})();
const heir_request_key = "heir request";
const heirRequest = (() => {
    if(importProbeToken) return null;
    try {
        const r = JSON.parse(localStorage.getItem(heir_request_key));
        if(r?.error && !authorityEnrolled()) localStorage.removeItem(heir_request_key);
        return r?.schema === 1 ? r : null;
    } catch {if(!authorityEnrolled())localStorage.removeItem(heir_request_key); return null;}
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
// Skips rewriting an unchanged life; see the D3 decision in save_files.js.
const durableSaves = createDurableSaveWriter(() => localStorage);
// Shared save writes stage life observations and publish them only after success.
const lifeSaveStorage = {
    setItem(key, serialized, onDurable, options) {return this.setEnvelope(key, JSON.parse(serialized), onDurable, options);},
    // The caller transfers a detached envelope. Only the top-level life fields
    // are replaced here; staged domains remain read-only until publication.
    // force: an explicit save writes even when only wall-clock fields changed (D3).
    setEnvelope(key, save, onDurable, {force = false} = {}) {
    const next = observeLifeSave(save.life_record ?? createLifeRecord(), save);
    save.life_record = next;
    const nextNpc = save.npc_lives == null ? null : advanceVillageLives(save.npc_lives, save['current time'].year);
    if(nextNpc) save.npc_lives = nextNpc;
    if(authorityBootError)throw authorityBootError;
    if(authorityBootPending)throw Error('The enrolled save is awaiting complete native preflight.');
    if(authorityEnrolled()){durableSaves.forget();nativeAuthority.commitPreparedSave(JSON.stringify(save));}
    else durableSaves.write(key, save, {force});
    onDurable?.();
    if(nativeP23Transaction?.status==='pending')nativeP23Transaction.markDurable();
    villageCareer = migrateVillageCareer(save);
    const previousRules=workLedger?.rules,previousConnection=workLedger?.connection,previousPrecision=workLedger?.precisionKnown,previousAssist=workLedger?.assistUnlocked;
    workLedger=migrateWorkLedger(save.work_ledger);
    if(previousRules?.revision!==workLedger.rules.revision||previousConnection!==workLedger.connection||previousPrecision!==workLedger.precisionKnown||previousAssist!==workLedger.assistUnlocked)update_displayed_crafting_recipes();
    customization=customizationFromSave(save);
    refreshCustomization();
    cheatState=validateCheatState(save.cheats??defaultCheatState());
    optionalPackState=validatePackState(save.content_packs??emptyPackState());
    lifeRecord = next;
    npcLives = nextNpc;
    restoreGeneratedPeople(save);
    if(!deferWhileHidden(renderSavedPanels,renderSavedPanels))renderSavedPanels();
}};
// Display-only panels that follow each durable save.
function renderSavedPanels(){workLedgerPanel?.render();optionalPackPanel?.render();villageCareerControls?.render();lifeRecordPanel?.render();villageLivesPanel?.render();}

let expansionState = initializeExpedition(createExpansionState(crypto.getRandomValues(new Uint32Array(1))[0]));
ensureStreams(expansionState);
bindGameStreams(() => expansionState);
registerLivingGearItems({item_templates,Amulet,getItem,WeaponComponent,Weapon});
for(const [tactic,{itemId}]of Object.entries(TACTICS))item_templates[itemId]||=new OtherItem({id:itemId,name:itemId,description:tactic==='throw'?'One paid native projectile replaces a swing.':tactic==='smoke'?'Escape a native fight without its rewards.':'Offer a repeatable native field outing.',value:tactic==='throw'?3:tactic==='smoke'?8:6});
inventoryTemplates.Basic.unshift(new TradeItemGroup({items:[LIVING_GEAR.aura,LIVING_GEAR.collector,LIVING_GEAR.weapon,...Object.values(TACTICS).map(t=>t.itemId)].map(item_name=>new TradeItem({item_name,count:[Object.values(TACTICS).some(t=>t.itemId===item_name)?6:2],quality:Object.values(TACTICS).some(t=>t.itemId===item_name)?undefined:[100,100],chance:1}))}));
book_stats[ANTHOLOGY] ||= new BookData({required_time:12,literacy_xp_rate:0});
item_templates[ANTHOLOGY] ||= new Book({id:ANTHOLOGY,name:ANTHOLOGY,value:5,description:'A retained anthology of original village stories. Read again for another remembered story.'});
item_templates[REST_MEAL] ||= new OtherItem({id:REST_MEAL,name:REST_MEAL,value:4,description:REGISTRATIONS.rest.description});
item_templates[SALVAGE.tool] ||= new Tool({id:SALVAGE.tool,name:SALVAGE.tool,value:30,quality:100,equip_slot:'sickle',description:'Portable leatherwork requires quality 60 and a usable native condition.'});
inventoryTemplates.Basic.unshift(new TradeItemGroup({items:[new TradeItem({item_name:ANTHOLOGY,count:[2],chance:1}),new TradeItem({item_name:SALVAGE.tool,count:[2],quality:[60,60],chance:1}),new TradeItem({item_name:SALVAGE.tool,count:[1],quality:[59,59],chance:1})]}));
let p23Salvage,readingSalvagePanel;
let p23Growth,p23GrowthEarned,growthPanel,p23GrowthCounter;
let mistglassKeeper,mistglassPanel;
function nativeMistglassContext(state=expansionState,location=current_location?.id){return mistglassContext(state,{body:currentNativeBody(),alive:character.is_alive&&!active_effects.Recovering,location,effectsEnabled:document.documentElement.dataset.effects!=='off'});}
function mistglassCanAct(){return workLedgerCanWrite()&&character.is_alive&&!active_effects.Recovering&&!current_combat&&!current_activity&&!current_dialogue&&!current_game_action&&!is_sleeping&&!is_reading&&!is_in_trade()&&nativeActionReasons(expansionState).length===0;}
function refreshMistglassStock(){
    if(!workLedgerCanWrite()||expansionState.actors.player.worldId!==MISTGLASS.worldId||current_location.id!==MISTGLASS_LOCATION)throw Error('Visit the actual conservatory keeper in the writable game.');
    const plan=p23Plan();if(!stageMistglassRestock(plan))return false;
    persistExpansion(plan,{[MISTGLASS_KEEPER]:{category:'trader',id:MISTGLASS_KEEPER}},{[MISTGLASS_KEEPER]:mistglassKeeper.getTradeInventory()});return true;
}
function actMistglass(id){
    if(!mistglassCanAct())throw Error('Finish current native work before this conservatory choice.');
    if(!expansionState.simulation?.people.player)throw Error('Choose Follow local people and work first.');
    const plan=p23Plan(),inside=expansionState.actors.player.worldId===MISTGLASS.worldId;
    if(id==='trade'){if(!inside||current_location.id!==MISTGLASS_LOCATION)throw Error('Visit the keeper first.');window.startTrade(MISTGLASS_KEEPER);return;}
    if(id==='enter'){
        const first=!plan.state.mistglassRealm;stageMistglassTravel(plan,'enter',{fromLocation:current_location.id});
        if(first)stageMistglassRestock(plan,{forceInitial:true});
    }else if(id==='exit')stageMistglassTravel(plan,'exit');
    else if(id==='learn')stageMistglassTeaching(plan,nativeMistglassContext(plan.state),expeditionRegistry,{quoteXP:p00NativeSkillXP});
    else if(id==='trial'){
        if(!skills.Meditation.canGainXP(get_context()))throw Error('Learn native Meditation before purification.');
        const key=Object.entries(character.getItems()).find(([,r])=>r.item.id===MISTGLASS.doseItemId&&r.count>0)?.[0];
        if(!key)throw Error('Buy a Cloudseed dose from the keeper.');assertNativeItemDisposition(expansionState,key);
        stageMistglassTrial(plan,nativeMistglassContext(plan.state),expeditionRegistry,{doseKey:key,quoteXP:p00NativeSkillXP});
    }else throw Error('Unknown conservatory choice.');
    persistExpansion(plan,{[MISTGLASS_KEEPER]:{category:'trader',id:MISTGLASS_KEEPER}},{[MISTGLASS_KEEPER]:mistglassKeeper.getTradeInventory()});mistglassPanel?.render();
}
function mistglassFrame(){
    const inside=expansionState.actors.player.worldId===MISTGLASS.worldId,c=nativeMistglassContext(),key=Object.entries(character.getItems()).find(([,r])=>r.item.id===MISTGLASS.doseItemId&&r.count>0)?.[0],known=knownMistglassView(expansionState,c,key);
    const raw=expansionState.simulation?.conditions?.player?.[MISTGLASS.blockedConditionId],actions=[];
    if(inside){actions.push({id:'exit',label:'Return to Village'},{id:'trade',label:'Trade with conservatory keeper'});
        if(!known.enrolled)actions.push({id:'learn',label:'Learn the conservatory method (explicit opt-in)'});
        else actions.push({id:'trial',label:'Purify one paid Cloudseed dose',enabled:known.preview.eligible&&skills.Meditation.canGainXP(get_context()),reason:!skills.Meditation.canGainXP(get_context())?'Learn native Meditation first.':known.preview.reasons.join(' ')});
    }else if(expansionState.actors.player.worldId==='base.frontier'&&current_location?.id==='Village')actions.push({id:'enter',label:'Enter Mistglass conservatory',enabled:!!expansionState.simulation?.people.player,reason:'Choose Follow local people and work first.'});
    return {visible:inside||actions.length>0,inside,view:known.view,preview:known.preview,rawRemaining:Math.max(0,(raw?.expiresAt||0)-expansionState.clock),disabled:!mistglassCanAct(),actions};
}

function growthIdentity(state=expansionState) {
    const actual=currentNativeBody(),body=state.simulation?.people.player?.body;
    return {worldId:state.actors.player.worldId,profileId:PROFILE.id,bodyId:body?.id||actual.id,
        bodySupported:!!body&&body.id===actual.id&&body.form==='human'&&actual.form==='human'&&body.ownerId==='player'&&body.controllerId==='player'&&actual.ownerId==='player'&&actual.controllerId==='player'};
}
function growthContext(state=expansionState) {
    const identity=growthIdentity(state),stats=character.getFullStats(),known=growthLearned(state);
    const native=proto23Native.read(state),joined=proto23Context(state,{...expeditionContext(),proto23Native:native,
        vitals:Object.fromEntries(Object.entries(simulationNativeContexts()).map(([id,c])=>[id,c.vitals]))});
    const supported=identity.bodySupported&&joined.facts['proto23.playerSupported']===true;
    const available=supported&&!!current_location?.canBeStarted(get_context());
    // This is the profile-specific native eligibility owner. It keeps the
    // original Literacy availability and current native body/preparation rules.
    const eligible=available&&skills.Literacy.canGainXP(get_context())&&character.is_alive===true&&!active_effects.Recovering;
    let ownedReading=false;
    if(is_reading&&is_reading!==ANTHOLOGY&&book_stats[is_reading]&&!item_templates[is_reading].isFinished()) {
        const key=JSON.stringify({id:is_reading});try{assertNativeItemDisposition(state,key);ownedReading=(character.getItems()[key]?.count||0)>0;}catch{}
    }
    const conflict=!!(current_combat||current_activity||current_game_action||current_dialogue||is_sleeping||is_in_trade()||nativeOccupationReason()||nativeActionReasons(state).length);
    return {...identity,clock:state.clock,known,nativeAlive:character.is_alive===true,ownsSave:ownsSave&&!importProbeToken,
        saveBlocked:!!(foundationSaveBlocked||expansionError||lifeStorageFailure||is_loading_error),nativeEligible:eligible,
        idle:!conflict&&!is_reading,shopEligible:eligible&&current_location.id===PROTO23_LOCATIONS.center&&state.actors.player.facts['proto23.stewardMet']===true&&!!p23GrowthCounter.getAvailabilityComponent().canBeStarted(get_context()),
        conditionEligible:eligible,resourcesEligible:stats.health>1,
        occupation:{kind:is_reading?'reading':'idle',jobId:is_reading?`native.book.${is_reading}`:'none',eligible:ownedReading&&!conflict},
        conflictingAction:conflict,bodyConflict:!supported,resourceConflict:!!active_effects.Recovering};
}
function recordGrowthNativeGrant(before,after) {
    if(restoringNativeSave||!p23Growth)return;
    const sequence=expansionState.sequence+1;
    const result=observeGrowthEarned(p23GrowthEarned,p23Growth,growthContext(),{before,after,sequence});
    if(!result.counted)return;
    // Ordinary native XP is saved by its existing native caller. Craft/combat
    // own these bindings in their rollback boundary until their save is durable.
    expansionState.sequence=sequence;p23GrowthEarned=result.counter;p23Growth=result.profile;
}
function stageGrowthNativeGrants(plan) {
    if(!p23Growth||!plan.gameplay?.player?.skills)return;
    const before=readNativeSkillXP(character.getLevelableComponent().skill_progress);
    const after=Object.fromEntries(Object.entries(plan.gameplay.player.skills).map(([id,p])=>[id,p.xp]));
    const profile=plan.nativePatch?.p23_growth_profile||p23Growth;
    const counter=plan.nativePatch?.p23_growth_earned||p23GrowthEarned;
    const sequence=Math.max(plan.state.sequence,expansionState.sequence+1);
    const result=observeGrowthEarned(counter,profile,growthContext(plan.state),{before,after,sequence});
    if(!result.counted)return;
    plan.state.sequence=sequence;
    plan.nativePatch={...plan.nativePatch,p23_growth_profile:result.profile,p23_growth_earned:result.counter};
}
function publishGrowthProjection(source=growthFlatSource(p23Growth,growthIdentity()),preserve=true) {
    const stats=character.getFullStats(),vitals={health:stats.health,stamina:stats.stamina};
    character.getLevelableComponent().stats.flat.p23_growth_profile={...source};
    character.updateStatsAndDisplay();
    if(preserve){stats.health=Math.max(0,Math.min(stats.max_health,vitals.health));stats.stamina=Math.max(0,Math.min(stats.max_stamina,vitals.stamina));update_displayed_health();update_displayed_stamina();}
}
function stageGrowthForPublication(plan) {
    let next=Object.hasOwn(plan.nativePatch||{},'p23_growth_profile')?plan.nativePatch.p23_growth_profile:p23Growth;
    if(p23Growth!==undefined&&next===p23Growth&&plan.state.clock>p23Growth.background.lastClock) {
        const context=growthContext(plan.state),elapsed=plan.state.clock-p23Growth.background.lastClock;
        // Every eligible interval must be one actually played native minute.
        // Larger travel/rest advances and a changed location only move the anchor.
        context.occupation.eligible&&=elapsed===1&&plan.state.actors.player.worldId===expansionState.actors.player.worldId&&!plan.nativeLocation;
        const sequence=plan.state.sequence+1,result=advanceBackground(p23Growth,context,sequence);
        next=result.next;if(result.eligible&&result.minutes===1)plan.state.sequence=sequence;
        plan.nativePatch={...plan.nativePatch,p23_growth_profile:next};
    }
    if(next===undefined)return;
    validateGrowthState(next);
    const source=growthFlatSource(next,growthIdentity(plan.state)),stats=character.getLevelableComponent().stats;
    const native=noHealGrowthVitals(stats.flat.p23_growth_profile||{},source,stats,plan.native);
    if(Object.keys(native).length)plan.native=native;
    plan.p00GrowthSource=source;
}
function stageTonicPurchase(context) {
    // Copy the native commercial owner, then run its existing template/restock
    // method. Only the durable ownership publication changes the live counter.
    const candidate=new TraderComponent({name:p23GrowthCounter.name,inventory_template:GROWTH_COUNTER_TEMPLATE,profit_margin:1,refresh_time:p23GrowthCounter.refresh_time,is_unlocked:true});
    candidate.last_refresh=p23GrowthCounter.last_refresh;
    candidate.addToInventory(Object.entries(readInventoryOwner(p23GrowthCounter.getTradeInventory())).map(([item_key,count])=>({item_key,count})));
    candidate.refresh(get_context());
    const stock=readInventoryOwner(candidate.getTradeInventory()),margin=candidate.getProfitMargin(current_location.market_region);
    const tonicItem=getItemFromKey(GROWTH_TONIC_KEY);
    const nativePrice=Math.ceil(tonicItem.getValue({quality:tonicItem.quality,region:current_location.market_region})*margin);
    if(nativePrice!==PROFILE.tonicPrice)throw Error('The native tonic quote changed. Review the counter before buying.');
    const acquisition=quoteTonicAcquisition(p23Growth,context,{money:character.money,stockCount:stock[GROWTH_TONIC_KEY]||0});
    const quote=()=>({vendorId:GROWTH_COUNTER_ID,region:current_location.market_region,buy:[{item_key:acquisition.itemKey,count:1}],sell:[],buyValue:nativePrice,sellValue:0,money:character.money,
        margin,player:readInventoryOwner(character.getItems()),vendor:stock,market:structuredClone(loot_sold_count),sequence:expansionState.sequence});
    const skill=skills.Haggling,xp=skill.canGainXP(get_context())?Math.round(nativePrice/10*config.global_xp_multiplier*character.getSkillXPGain('Haggling')*(character.xp_multiplier??1)*100)/100:0;
    const plan=stageNativeTrade({state:expansionState,gameplay:gameplaySnapshot(),owners:{player:readInventoryOwner(character.getItems()),vendor:stock},money:character.money,market:loot_sold_count,itemLog:item_log.items,quote:quote(),currentQuote:quote(),xp,getItem:getItemFromKey});
    plan.nativePatch={...plan.nativePatch,[`npcs/${GROWTH_COUNTER_ID}/trader/last_refresh`]:candidate.last_refresh};
    const previous=plan.absorbPublish;plan.absorbPublish=()=>{previous?.();p23GrowthCounter.last_refresh=candidate.last_refresh;};
    persistExpansion(plan,{vendor:{category:'trader',id:GROWTH_COUNTER_ID}},{vendor:p23GrowthCounter.getTradeInventory()});
}
function actGrowth(action,sequence) {
    if(sequence!==expansionState.sequence)throw Error('Study controls changed. Review the current offer.');
    if(!workLedgerCanWrite())throw Error('Restore writable saving before study conditioning.');
    const context=growthContext();
    if(action==='buy')return stageTonicPurchase(context);
    const state=structuredClone(expansionState),gameplay=gameplaySnapshot();let next;
    if(action==='enroll'){
        if(p23Growth!==undefined)throw Error('This profile is already enrolled.');
        if(!context.idle)throw Error('Finish current work before enrolling.');
        next=enrollGrowth(context);
    } else {
        if(p23Growth===undefined)throw Error('Explicitly enroll in the learned method first.');
        if(action==='consume'){
            assertNativeItemDisposition(state,GROWTH_TONIC_KEY);
            const result=consumeTonic(p23Growth,context,{sequence:state.sequence+1,inventoryCount:gameplay.player.inventory[GROWTH_TONIC_KEY]||0});
            if(result.itemCost)applyGameplayEffect(gameplay,{type:'item',key:GROWTH_TONIC_KEY,amount:result.itemCost},'player',true);next=result.next;
        } else if(action==='background')next=setBackground(p23Growth,context,!p23Growth.background.enabled).next;
        else if(action==='settle')next=settleAward(p23Growth,context,8).next;
        else throw Error('Unknown study conditioning choice.');
    }
    state.sequence++;
    const earned=freezeEarnedGrowth(p23GrowthEarned,next,context,state.sequence);
    next=earned.profile;
    const nativePatch={p23_growth_profile:next};
    if(earned.counter!==undefined)nativePatch.p23_growth_earned=earned.counter;
    if(action==='enroll')nativePatch[`availabilities/trader/${GROWTH_COUNTER_ID}`]=1;
    persistExpansion({state,gameplay,external:{money:character.money},nativePatch});
    if(action==='enroll')p23GrowthCounter.getAvailabilityComponent().is_unlocked=true;
    growthPanel?.render();
}
function growthFrame() {
    if(!growthLearned(expansionState))return {visible:false,sequence:expansionState.sequence,lines:[],actions:[]};
    const c=growthContext(),view=p23Growth&&growthView(p23Growth,c),actions=[],lines=[];
    const unavailable=!c.bodySupported||c.worldId!==PROFILE.worldId;
    if(unavailable)return {visible:true,sequence:expansionState.sequence,lines:['This known method is dormant in the current body or world. Saved progress is retained.'],actions};
    const disabled=!c.ownsSave||c.saveBlocked?'Restore writable saving.':!c.nativeEligible?'Current native body, place or preparation blocks study conditioning.':'';
    if(!p23Growth){lines.push('You learned the optional visitor method. Enrollment is a separate choice; background starts off.');actions.push({id:'enroll',label:'Enroll in study conditioning',reason:disabled||(!c.idle?'Finish current work.':'')});}
    else {
        lines.push(`Study conditioning level ${view.level}; ${view.totalXP} local XP; next total ${view.nextTotalXP??'beyond current numeric storage'}; ${view.pendingXP} pending XP.`);
        lines.push(`Earned local native skill XP since enrollment: ${(p23GrowthEarned?.earnedUnits||0)/100} / ${GROWTH_EARNED_THRESHOLD} (proposal threshold). Older XP is not backfilled. ${p23GrowthEarned?.awardedUnits ? `${p23GrowthEarned.awardedUnits/(GROWTH_EARNED_THRESHOLD*100)} threshold rewards frozen. `:''}Each further150000 genuinely earned XP can fund another reward after pending work settles.`);
        lines.push(`${view.tonics} tonics consumed. Each adds 2 permanent raw max-health to this profile, with no healing.`);
        lines.push(`Background ${p23Growth.background.enabled?'on':'off'}: ${view.background.reason}`);
        actions.push({id:'background',label:`Turn background conditioning ${p23Growth.background.enabled?'off':'on'}`,reason:!c.ownsSave||c.saveBlocked?'Restore writable saving.':!p23Growth.background.enabled?disabled:''});
        if(view.pendingXP)actions.push({id:'settle',label:'Settle pending XP: next eight steps',reason:!c.ownsSave||c.saveBlocked?'Restore writable saving.':!c.nativeAlive?'A living supported body is required.':''});
        actions.push({id:'buy',label:'Buy one native tonic at the visitor counter: 25 coins',reason:disabled||(!c.idle||!c.shopEligible?'Use the known visitor counter while free at Village Center.':'')});
        actions.push({id:'consume',label:'Consume one owned tonic: +2 max-health, no healing',reason:disabled||(!c.idle?'Finish current work.':!(character.getItems()[GROWTH_TONIC_KEY]?.count>0)?'Carry your own tonic.':'')});
    }
    return {visible:true,sequence:expansionState.sequence,lines,actions};
}

function studyContext(state=expansionState,gameplay=gameplaySnapshot()) {
    const body=currentNativeBody(),current=state.p23Reading?.current;
    const held=key=>{try{assertNativeItemDisposition(state,key);return gameplay.player.inventory[key]>0;}catch{return false;}};
    return {clock:state.clock,worldId:state.actors.player.worldId,nativeBody:body.ownerId==='player'&&body.controllerId==='player'&&body.form==='human',alive:character.is_alive===true,
        safe:!current_combat&&!current_location?.tags.combat_zone&&!waitingSimulationChoice(state),
        available:!current_activity&&!current_game_action&&!current_dialogue&&!is_in_trade()&&!nativeOccupationReason()&&(!is_reading||is_reading===ANTHOLOGY)&&(!is_sleeping||current?.kind==='rest'),
        ownedAnthology:held(ANTHOLOGY_KEY),ownedRestMeal:held(REST_KEY),knownAnthology:held(ANTHOLOGY_KEY)||state.p23Reading?.current?.kind==='read'||!!state.p23Reading?.receipts.some(r=>r.kind==='read'),
        housingAccessible:!!current_location?.housing?.isUnlocked()&&current_location.getAvailabilityComponent().getStatus().is_unlocked,
        sleepingLevel:character.getTotalSkillLevel('Sleeping'),readProgressPerMinute:readingRate(character.getTotalSkillLevel('Literacy'))};
}
function p00NativeSkillXP(id,amount){
    const skill=skills[id];if(!skill?.canGainXP(get_context()))throw Error('Native skill eligibility blocks this settlement.');
    let xp=amount*lifeLearningMultiplier(expansionState.chronicle)*furnitureSkillMultiplier(readFurnitureBonuses(),id)*getPacingEffects(homePacingContext()).efficiency*config.global_xp_multiplier*character.getSkillXPGain(id)*(character.xp_multiplier??1);
    if(skill.parent_skill)xp*=skill.get_parent_xp_multiplier();
    const toNext=character.getLevelableComponent().skill_progress[id]?.xp_to_next_lvl??skill.base_xp_cost;
    if(Number.isFinite(toNext))xp=Math.min(xp,toNext*config.skill_xp_gains_cap);
    return Math.round(xp*100)/100;
}
function nativeBooksSnapshot(){return Object.fromEntries(Object.entries(book_stats).filter(([,b])=>b.accumulated_time>0).map(([id,b])=>[id,{accumulated_time:b.accumulated_time}]));}
function studyPlan(result,state=structuredClone(expansionState),gameplay=gameplaySnapshot()) {
    return stageReadingResult({state,gameplay,p00StudyCommand:true,external:{money:character.money}},result,{books:nativeBooksSnapshot(),quoteXP:p00NativeSkillXP});
}
function publishStudy(plan){
    if(plan.p00FinishedAnthology){item_templates[ANTHOLOGY].setAsFinished();update_booklist_entry(ANTHOLOGY,true);}
    for(const text of plan.p00ReadingNotices||[])log_message(text,'notification');
    const current=expansionState.p23Reading?.current;
    if(current?.kind==='read'&&current.status==='active'){is_reading=ANTHOLOGY;is_sleeping=false;}
    else if(is_reading===ANTHOLOGY)is_reading=null;
    if(current?.kind==='rest'){is_sleeping=true;is_reading=null;setLastLocationWithBed(current_location.id);}
    else if(plan.p00WasRest)is_sleeping=false;
    readingSalvagePanel?.render();
}
function actStudy(type){
    if(!workLedgerCanWrite())throw Error('Restore writable saving before study.');
    if(type==='prepareMeal'){
        if(current_location.id!=='Village'||character.getTotalSkillLevel('Cooking')<1||!studyContext().available)throw Error('Cooking 1 and free Village work are required.');
        return startExpedition('p23.reading.pack_rest',expansionState.sequence);
    }
    const state=structuredClone(expansionState),context=studyContext(),command={type};
    if(type==='startRead')command.draw=Math.floor(drawUnit(state,scopedStream(STREAMS.reward,context.worldId),'p23.reading.start')*0x100000000);
    const result=planReadingCommand(state.p23Reading,command,context),plan=studyPlan(result,state);state.sequence++;
    if(['startRead','resumeRead','startRest'].includes(type)&&p23Repeat?.looking)stageP23LocalReward(plan,advanceRepeatSearch(p23Repeat,{...p23HereContext(),idle:false}),'absorb_repeat_search');
    plan.p00WasRest=expansionState.p23Reading?.current?.kind==='rest';persistExpansion(plan);
}
function salvageContext(){return {state:expansionState,gameplay:gameplaySnapshot(),equipment:readNativeEquipment({player:character}),durability,saved:p23Salvage,location:current_location.id,money:character.money,skillLevel:character.getTotalSkillLevel('Crafting'),getItem:getItemFromKey};}
function identifySalvageCopy(key){
    if(!workLedgerCanWrite()||!studyContext().available||current_location.id!=='Village')throw Error('Use the free Village workbench with writable saving.');
    assertNativeItemDisposition(expansionState,key);assertNativeItemDisposition(expansionState,canonicalDurabilityKey(key));
    const item=getItemFromKey(key);if(item.id!=='Leather vest'||!(gameplaySnapshot().player.inventory[key]>0))throw Error('Choose one carried Leather vest.');
    const wear=createDurability(durability.serialize()),copy=wear.prepareEquip(item,getItemFromKey,{requireIdentity:true}),nextKey=copy.getInventoryKey();
    const gameplay=gameplaySnapshot();applyGameplayEffect(gameplay,{type:'item',key,amount:1},'player',true);applyGameplayEffect(gameplay,{type:'item',key:nextKey,amount:1},'player');
    const state=structuredClone(expansionState);state.sequence++;persistExpansion({state,gameplay,external:{money:character.money},nativePatch:{equipment_durability:wear.serialize()}});
}
function craftSalvage(recipe,itemKey,toolKey){
    if(!workLedgerCanWrite()||!studyContext().available)throw Error('Finish current work before leatherwork.');
    const c=salvageContext(),request={recipe,itemKey,toolKey,sequence:c.state.sequence};
    const quote=quoteSalvage(c,request),paid=advanceChroniclePlan({state:structuredClone(c.state),gameplay:c.gameplay,external:{money:c.money}},quote.duration);
    if(paid.state.clock-c.state.clock!==quote.duration)throw Error('The native clock paused before leatherwork.');
    const nextContext={...c,state:paid.state,gameplay:paid.gameplay},nextRequest={...request,sequence:paid.state.sequence},nextQuote=quoteSalvage(nextContext,nextRequest);
    const plan=stageSalvage({...nextContext,nativeXP:p00NativeSkillXP(SALVAGE.skill,nextQuote.xp)},{...nextRequest,token:nextQuote.token});plan.calendar=paid.calendar;plan.effectDurations=paid.effectDurations;plan.native=paid.native;
    plan.acquisitions=plan.acquisitions.map(row=>({...row,owner:'player'}));
    plan.nativePatch={...plan.nativePatch,total_crafting_attempts:game_stats.total_crafting_attempts+1,total_crafting_successes:game_stats.total_crafting_successes+1};
    plan.absorbPublish=()=>{game_stats.total_crafting_attempts++;game_stats.total_crafting_successes++;};
    persistExpansion(plan);
}
function studyFrame(){
    const context=studyContext(),view=readingPresentation(expansionState.p23Reading,context),actions=[],lines=[];
    const disabled=!workLedgerCanWrite()?'Restore writable saving.':'';
    if(view.visible){if(view.current)lines.push(`${view.current.label}: ${view.current.status}, ${view.current.remaining.toFixed(2)} remaining.`);
        if(!view.current&&context.knownAnthology)actions.push({id:'startRead',label:'Read Tales of the Lantern Road',reason:disabled||(!context.available||!context.ownedAnthology?'Hold your book and finish other work.':'')});
        else if(view.current.kind==='read')actions.push({id:view.current.status==='paused'?'resumeRead':'stopRead',label:view.current.status==='paused'?'Resume saved read':'Stop and retain read',reason:disabled});
        else actions.push({id:'cancelRest',label:'Cancel long rest (meal stays consumed)',reason:disabled});
        for(const row of view.records)lines.push(`#${row.id}: ${row.text}`);
    }
    if(context.housingAccessible||context.ownedRestMeal){actions.push({id:'startRest',label:'Use one packed meal for 18-hour rest',reason:disabled||(!context.available||view.current||!context.housingAccessible||context.sleepingLevel<5||!context.ownedRestMeal?'Requires free accessible housing, Sleeping 5 and your meal.':'')});}
    if(current_location.id==='Village'&&character.getTotalSkillLevel('Cooking')>=1)actions.push({id:'prepareMeal',label:'Pack rest meal: 2 bread + 2 herbs, 4 minutes',reason:disabled||(!context.available?'Finish current work.':'')});
    const c=salvageContext(),tools=Object.keys(c.gameplay.player.inventory).filter(k=>getItemFromKey(k).id===SALVAGE.tool);
    if(tools.length&&current_location.id==='Village'){
        for(const key of Object.keys(c.gameplay.player.inventory))if(getItemFromKey(key).id==='Leather vest'&&!JSON.parse(key).e2_instance)actions.push({id:'identify',key,label:`Identify one carried vest (${key})`,reason:disabled});
        let choices=[];try{choices=wornSalvageChoices(c);}catch{}
        for(const row of choices)for(const toolKey of tools)for(const recipe of [SALVAGE.salvage,...(p23Salvage?.learned?[SALVAGE.craft]:[])]){let label,reason=disabled;try{const quote=quoteSalvage(c,{recipe,itemKey:row.key,toolKey,sequence:c.state.sequence});label=`${recipe===SALVAGE.salvage?'Salvage':'Survey kit'}: condition ${row.condition}, tool ${getItemFromKey(toolKey).quality}; ${quote.outputCount} output, 1 minute; exact copy ${row.key}`; }catch(e){label=`Leatherwork: condition ${row.condition}, tool ${getItemFromKey(toolKey).quality}; exact copy ${row.key}`;reason=e.message;}actions.push({id:'salvage',recipe,itemKey:row.key,toolKey,label,reason});}
        if(p23Salvage)lines.push(`${Object.keys(p23Salvage.receipts).length} settled leatherwork receipts; survey-kit lesson ${p23Salvage.learned?'learned':'unknown'}.`);
    }
    return {visible:view.visible||actions.length>0||!!p23Salvage,lines,actions};
}

let p23LivingGear;
let livingGearPanel;
let nativeLivingStrike=false;
let nativeP23Transaction=null;
let nativeP23Scope=null;
setNativeLogBufferReader(()=>nativeP23Scope?.messages);
let p23CombatOptions;
let combatOptionsPanel;
let p23EscapeDestination=null;
let p23FaintDeparture=null;
let p23EncounterProfile, p23EncounterReceipt, trainingPanel;
function trainingContext({allowFainted=false}={}) {
    const state=expansionState,body=currentNativeBody(),person=state.simulation?.people.player,visit=activeProto23Visit(state);
    const at=current_location?.id,health=character.getFullStats().health;
    let custodyReady=true;
    for(const item of Object.values(character.getEquipment()).filter(Boolean)) {
        try {assertNativeItemDisposition(state,item.getInventoryKey());} catch {custodyReady=false;}
    }
    const eligible=workLedgerCanWrite()&&!!state.proto23Village&&!!visit&&state.actors.player.worldId===WORLD_ID&&
        [PROTO23_LOCATIONS.dojo,AREA_ID].includes(at)&&person?.location===at&&person.life==='alive'&&person.inventory==='native'&&
        body.id==='native.player.body'&&body.form==='human'&&body.ownerId==='player'&&body.controllerId==='player'&&
        person.body?.id===body.id&&person.body?.form===body.form&&(person.body?.hands??0)>=2&&person.body?.mobile===true&&
        custodyReady&&nativeActionReasons(state).length===0&&!current_activity&&!current_game_action&&!current_dialogue&&!is_reading&&!is_sleeping&&!is_in_trade()&&
        (allowFainted||(character.is_alive===true&&health>0&&!active_effects.Recovering));
    return {worldId:state.actors.player.worldId,locationId:at,nativeEligible:eligible};
}
function trainingTravelMinutes() {
    const edge=locations[PROTO23_LOCATIONS.dojo].connected_locations.find(row=>row.location===locations[AREA_ID]);
    if(!edge||!Number.isFinite(edge.travel_time)||edge.travel_time<0)throw Error('The actual dojo route is unavailable.');
    const paths=new Pathfinder();
    return Math.max(1,Math.round(edge.travel_time*paths.get_total_skills_modifier(edge.travel_time_skills||['Running'])));
}
function trainingTravelPlan(to,{profile,encounter,allowFainted=false}={}) {
    const live=trainingContext({allowFainted});
    if(!live.nativeEligible)throw Error('Use your actual supported independent visitor body at this dojo rung.');
    const source=current_location.id;
    if(!((source===PROTO23_LOCATIONS.dojo&&to===AREA_ID)||(source===AREA_ID&&to===PROTO23_LOCATIONS.dojo)))throw Error('Use the actual dojo training route.');
    const state=structuredClone(expansionState),minutes=trainingTravelMinutes();
    const plan=advanceChroniclePlan({state,external:{money:character.money},gameplay:gameplaySnapshot()},minutes,true);
    if(plan.state.clock-state.clock!==minutes)throw Error('Finish the current native decision before taking the dojo route.');
    if(plan.state.sequence>=Number.MAX_SAFE_INTEGER)throw Error('Native sequence exhausted.');
    plan.state.sequence++;plan.state.simulation.people.player.location=to;plan.nativeLocation=to;
    plan.nativePatch={...plan.nativePatch,'current location':to,native_encounter:encounter??null,
        [`availabilities/location/${AREA_ID}`]:1,...(profile===undefined?{}:{p23EncounterProfile:profile})};
    return plan;
}
function actTraining(id) {
    if(id==='defensive'||id==='normal') {
        if(current_location.id!==AREA_ID||!current_combat||!trainingContext().nativeEligible||!stances[id]?.isUnlocked())throw Error('Choose an available native stance in the actual training fight.');
        change_stance({stance_id:id});trainingPanel?.render();return;
    }
    if(id==='enter') {
        if(current_location.id!==PROTO23_LOCATIONS.dojo||current_combat||character.getFullStats().health<=1)throw Error('Enter this optional rung from the actual dojo lobby with a living free body.');
        const anchor=expansionState,plan=trainingTravelPlan(AREA_ID),profile=readProfileState(p23EncounterProfile);
        if(profile.pending)throw Error('Finish or leave the actual pending training attempt first.');
        const seed=Math.floor(drawUnit(plan.state,scopedStream(STREAMS.encounter,WORLD_ID),`${PROFILE_ID}:${profile.nextAttempt}`)*0x100000000)>>>0;
        const next=beginAttempt(profile,{seed,worldId:WORLD_ID,locationId:AREA_ID,nativeEligible:true});
        plan.nativePatch.p23EncounterProfile=next;plan.nativePatch.native_encounter=initialTrainingEncounter(next,Enemy);
        if(expansionState!==anchor)throw Error('The actual training admission changed.');
        persistExpansion(plan);trainingPanel?.render();return;
    }
    if(id==='leave') {
        if(current_location.id!==AREA_ID||!p23EncounterProfile?.pending||!trainingContext().nativeEligible)throw Error('Leave your actual live training attempt.');
        if(current_combat) {
            runP23CombatExchange(current_combat,()=>{
                p23EncounterProfile=finishAttempt(p23EncounterProfile,{...trainingContext(),abandon:true});
                p23EscapeDestination=PROTO23_LOCATIONS.dojo;
                return {ended:true};
            });
        } else {
            const profile=finishAttempt(p23EncounterProfile,{...trainingContext(),abandon:true});
            persistExpansion(trainingTravelPlan(PROTO23_LOCATIONS.dojo,{profile,encounter:null}));
        }
        trainingPanel?.render();return;
    }
    throw Error('Unknown reed-circle training choice.');
}
function trainingFrame() {
    const at=current_location?.id,world=expansionState.actors.player.worldId;
    if(world!==WORLD_ID||![PROTO23_LOCATIONS.dojo,AREA_ID].includes(at))return {visible:false,lines:[],actions:[]};
    const profile=p23EncounterProfile===undefined?null:readProfileState(p23EncounterProfile),pending=profile?.pending;
    const lines=['Optional repeatable native rung, levels 1–3. Each actual clear returns to this dojo; enter again to repeat.'];
    if(pending) {
        const preview=previewExchange(profile,{worldId:WORLD_ID,locationId:AREA_ID,nativeEligible:true});
        lines.push(`Construct level ${pending.level}. Next intent: ${preview.move||'ordinary strike'}. ${preview.counterHint}`);
        lines.push(`Exchange ${pending.exchange}. ${pending.offBalance?'Off balance: your AP against this construct is ×0.8 until its next exchange.':'Footing steady.'}`);
    }
    if(profile)lines.push(`${profile.completed} actual clears; next attempt ${profile.nextAttempt}.`);
    if(p23EncounterReceipt)lines.push(`Native receipt ${p23EncounterReceipt.eventId}: level ${p23EncounterReceipt.level}; ${p23EncounterReceipt.loot.length?p23EncounterReceipt.loot.map(row=>`${row.count} ${row.item_id}`).join(', '):'no area drop'}.`);
    const actions=at===PROTO23_LOCATIONS.dojo?[{id:'enter',label:'Enter the optional reed-circle rung · native dojo travel'}]:[
        {id:'defensive',label:'Use Defensive Measures',disabled:!stances.defensive.isUnlocked()||!current_combat},
        {id:'normal',label:'Use normal stance',disabled:!current_combat},
        {id:'leave',label:'Leave alive for the dojo · no training rewards'}];
    if(!stances.defensive.isUnlocked())lines.push('Defensive Measures is still locked. Learn it through your existing native route; this rung grants no stance.');
    return {visible:true,lines,actions,disabled:!trainingContext().nativeEligible||(at===PROTO23_LOCATIONS.dojo&&!!current_combat)};
}
function trainingHooks() {
    const matching=(combat,target)=>combat===current_combat&&!combat.is_special_combat&&p23EncounterProfile?.pending&&!p23EncounterProfile.pending.settled&&
        current_location.id===AREA_ID&&combat.defenders.length===1&&target===combat.defenders[0]&&target.rngKey===trainingEnemyKey(p23EncounterProfile.pending.attempt);
    return {
        admitExchange:({combat,fighter,is_attacker,targets})=>trainingContext().nativeEligible&&matching(combat,combat.defenders[0])&&
            (is_attacker?fighter===character&&targets.every(t=>t===combat.defenders[0]):fighter===combat.defenders[0]&&targets.every(t=>t===character)),
        previewExchange:()=>trainingPanel?.render(),
        beforeExchange:({combat,fighter,is_attacker})=>{
            if(is_attacker)return;
            if(!matching(combat,fighter))throw Error('The native training exchange changed.');
            const plan=planExchange(p23EncounterProfile,{...trainingContext(),stanceId:current_stance.id});
            p23EncounterProfile=plan.state;
            if(plan.message)nativeCraftMessage(plan.message,'notification');
        },
        attackPointsMultiplier:({combat,fighter,target})=>fighter===character&&matching(combat,target)&&p23EncounterProfile.pending.offBalance?0.8:1,
        planDefeat:({combat,fighter,target,dropChanceModifier})=>{
            if(fighter!==character||!matching(combat,target)||target.getFullStats().health>0)throw Error('A matching real native construct defeat is required.');
            const expected=p23EncounterProfile,pending=expected.pending;
            const plan=planSettlement(expected,{...trainingContext(),eventId:`p23.reed-circle:${pending.attempt}:kill`,rank:target.rank,defeated:true,dropChanceModifier});
            if(plan.duplicate)return plan;
            const loot=[...target.get_loot({drop_chance_modifier:dropChanceModifier}),...plan.loot];
            for(const row of loot)if(!item_templates[row.item_id]||!Number.isSafeInteger(row.count)||row.count<=0)throw Error('Training settlement has an unsupported native item.');
            return {...plan,loot,areaLoot:plan.loot,expected,pending:{...pending}};
        },
        afterDefeat:({combat,fighter,target,settlement,dropChanceModifier})=>{
            if(settlement?.duplicate)return;
            if(!settlement||settlement.expected!==p23EncounterProfile||fighter!==character||target!==combat.defenders[0])throw Error('The native training settlement quote changed.');
            const zone=locations[AREA_ID];if(zone.enemy_groups_killed>=Number.MAX_SAFE_INTEGER)throw Error('Training group cursor exhausted.');
            p23EncounterProfile=finishAttempt(settlement.state,trainingContext());zone.enemy_groups_killed++;
            p23EncounterReceipt={schema:1,eventId:settlement.eventId,attempt:settlement.pending.attempt,seed:settlement.pending.seed,
                level:settlement.pending.level,clock:expansionState.clock,completed:p23EncounterProfile.completed,dropChanceModifier,loot:structuredClone(settlement.areaLoot)};
            do_quest_event({quest_event_type:'clear',quest_event_target:AREA_ID,quest_event_count:1});
            nativeCraftMessage(`Native receipt ${settlement.eventId}: level ${settlement.pending.level} training clear. Return to the dojo to repeat.`,'notification');
            p23EscapeDestination=PROTO23_LOCATIONS.dojo;
        },
    };
}

function livingFrame(){
    if(p23LivingGear===undefined)return {rows:[],attackMultiplier:1,lightBonus:0,disabled:true};
    const owner=livingOwner(),assertDisposition=key=>{assertNativeItemDisposition(expansionState,key);assertNativeItemDisposition(expansionState,canonicalDurabilityKey(key));};
    return {...livingProjection(),rows:owner.rows({equipment:livingEquipment(),isKnown:()=>true,assertDisposition}),disabled:!workLedgerCanWrite()||!!nativeActionReasons(expansionState).length};
}
function spendLivingCinders(key){
    if(!workLedgerCanWrite()||!character.is_alive||nativeActionReasons(expansionState).length)throw Error('This character cannot spend cinders now.');
    const owner=livingOwner(),stage=owner.stageSpend({actor:character,key,assertDisposition:key=>{assertNativeItemDisposition(expansionState,key);assertNativeItemDisposition(expansionState,canonicalDurabilityKey(key));}});
    stage.preflight();persistExpansion({state:structuredClone(expansionState),external:{money:character.money},gameplay:gameplaySnapshot(),native:stage.native,nativePatch:stage.nativePatch});
}
function livingOwnerFromSave(save){return createLivingGear(save.p23_living_gear).serialize();}
function livingOwner(){return createLivingGear(p23LivingGear);}
function livingEquipment(){return Object.fromEntries(Object.entries(character.getEquipment()).filter(([,item])=>{if(!item)return false;try{assertNativeItemDisposition(expansionState,item.getInventoryKey());assertNativeItemDisposition(expansionState,canonicalDurabilityKey(item.getInventoryKey()));return true;}catch{return false;}}));}
function livingProjection(){if(restoringNativeSave)return {attackMultiplier:1,lightBonus:0};return livingOwner().project({equipment:livingEquipment(),time:current_game_time,assertDisposition:key=>{assertNativeItemDisposition(expansionState,key);assertNativeItemDisposition(expansionState,canonicalDurabilityKey(key));}});}
function livingEffects(){if(p23LivingGear===undefined)return {};const p=livingProjection();return {'Living equipment':{tags:{},effects:{stats:{attack_power:{multiplier:p.attackMultiplier}},bonus_skill_levels:{},xp_multipliers:{}}}};}
character.setNativeLightBonusReader(()=>p23LivingGear===undefined?0:livingProjection().lightBonus);
let pendingNativeEncounter = null;
setFieldcraftKnowledgeReader(()=>expansionState);
character.setSimulationEffectReader(()=>{const context={nativeBody:currentNativeBody(),nativeAlive:character.is_alive===true};return {...projectStatusCareEffects(expansionState,expeditionRegistry,context),...projectFieldCareEffects(expansionState,expeditionRegistry,context),...projectBookCareEffects(expansionState,expeditionRegistry,context),...projectBookWorldEffects(expansionState,expeditionRegistry,context),...projectParadiseCampaignEffects(expansionState,expeditionRegistry,context),...structuredEquipmentView().effects,...livingEffects()};});
let publishedStatusCareSignature = "";
let expansionError = "";
let expeditionPanel;
let techniquePanel;
let chroniclePanel;
let villagePanel;
let simulationPanel;
let systemsWorkshopPanel;
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
item_templates[PROFILE.tonicId] ||= new OtherItem({id:PROFILE.tonicId,name:PROFILE.tonicId,value:PROFILE.tonicPrice,saturates_market:false,description:'Optional learned visitor tonic: +2 raw max-health on the enrolled body, no healing.'});
inventoryTemplates[GROWTH_COUNTER_TEMPLATE]=[new TradeItemGroup({items:[new TradeItem({item_name:PROFILE.tonicId,count:[4],chance:1})]})];
p23GrowthCounter=new TraderComponent({name:'Proto23 visitor tonic counter',inventory_template:GROWTH_COUNTER_TEMPLATE,profit_margin:1,refresh_time:4,is_unlocked:false});
NPCRegistry.add(GROWTH_COUNTER_ID,new NPC({name:'Proto23 visitor tonic counter',trader:p23GrowthCounter,is_unlocked:false,description:'A separate visitor tonic counter at the known Village Center.'}));
registerTrainingProfile({locations,enemyTemplates:enemy_templates,Enemy,CombatZone});
registerMistglassNative(expeditionRegistry);
item_templates[MISTGLASS.doseItemId] ||= new OtherItem({id:MISTGLASS.doseItemId,name:mistglassContent.dose.label,description:mistglassContent.dose.description,value:3,saturates_market:false});
mistglassKeeper=new TraderComponent({name:'conservatory keeper',inventory_template:'Basic',profit_margin:1,is_unlocked:true,played_minute_refresh:refreshMistglassStock});
NPCRegistry.add(MISTGLASS_KEEPER,new NPC({name:'conservatory keeper',trader:mistglassKeeper,is_unlocked:true,description:'Keeper of the optional Mistglass conservatory.'}));
locations[MISTGLASS_LOCATION]=new SafeLocation({id:MISTGLASS_LOCATION,name:'Mistglass conservatory',description:'An original optional conservatory. Native played exposure feeds its learned condensate method.',npcs:[MISTGLASS_KEEPER],market_region:locations.Village.market_region,is_under_roof:true,is_unlocked:true});
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
    update_displayed_money();
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
        absorbPublish:()=>{game_options.elemental_affinities=enabled;}});elementalPanel?.render();livingGearPanel?.render();combatOptionsPanel?.render();householdPanel?.render();
}
function createElementalPanel() {
    const option=document.createElement('label'),input=document.createElement('input');input.type='checkbox';input.dataset.elementalOption='true';
    option.append(input,document.createTextNode('Elemental preparation (off by default)'));document.getElementById('options_choices').append(option);
    const panel=document.createElement('details');panel.id='elemental_panel';panel.className='expedition_panel';
    const title=document.createElement('summary');title.textContent='Elemental preparation';const body=document.createElement('div'),notice=document.createElement('p');panel.append(title,body,notice);
    input.onchange=()=>{try{changeElementalPreparation(input.checked);}catch(error){notice.textContent=error.message;render();}};
    let signature='';
    function render(){const host=projectsHome();if(panel.parentElement!==host)host.append(panel);input.checked=game_options.elemental_affinities;
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
    durabilityPanel?.render();elementalPanel?.render();livingGearPanel?.render();combatOptionsPanel?.render();householdPanel?.render();
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

effect_templates['Household smoke']=new ActiveEffect({name:'Household smoke',description:'An explicitly chosen smoky hearth. Ventilate or step outside to clear it.',effects:{},tags:{debuff:true},base_xp_value:0});
let p23Exposure,household,p23ExposurePanel,householdPanel;
function p00ExposureContext(){
    const body=currentNativeBody(),human=body.form==='human'&&body.ownerId==='player'&&body.controllerId==='player';
    const s=character.getFullStats();
    return {...homePacingContext(),played:character.is_alive===true&&!restoringNativeSave,needsFood:human,
        exposureEligible:human&&character.is_alive===true,sheltered:current_location?.is_under_roof!==false,
        pacing:getPacingState(),coldResistanceLevel:character.getTotalSkillLevel('Cold resistance'),
        maxStamina:s.max_stamina,staminaToFull:s.max_stamina-s.stamina};
}
function getPacingEffects(context){
    const base=basePacingEffects(context),body=p00ExposureContext();
    const hungerEfficiency=famineEfficiency(base.hungerEfficiency,character.getTotalSkillLevel('Famine'),
        {...body,hungerEnabled:getPacingState().hungerEnabled});
    return {...base,hungerEfficiency,efficiency:hungerEfficiency*base.weatherEfficiency,
        temperatureOffset:base.temperatureOffset+exposureEffects(p23Exposure,body).temperatureOffset};
}
function p00HouseholdContext(clock=expansionState.clock,state=expansionState,location=current_location?.id){
    const world=state.actors.player.worldId,body=currentNativeBody();
    const defaultHome=world===PROTO23_IDS.world?`${PROTO23_IDS.world}:${PROTO23_LOCATIONS.cottage}`:'base.frontier:Shack';
    const homeId=household?.homeId||defaultHome,atHome=homeId===`${world}:${location}`;
    const input={...readFurnitureInput(),state,locationId:location,housingAccessible:!!locations[location]?.housing?.isUnlocked()};
    const projection=furnitureProjection(input),protoHome=homeId===`${PROTO23_IDS.world}:${PROTO23_LOCATIONS.cottage}`;
    const rights=protoHome?state.actors.player.facts['proto23.cottageRight']===true&&
        state.simulation?.claims?.['proto23.cottage_right']?.owner==='player'&&state.simulation.claims['proto23.cottage_right'].status==='settled':
        locations.Shack.getAvailabilityComponent().getStatus().is_unlocked===true&&locations.Shack.housing.isUnlocked();
    const stock=readInventoryOwner(character.getItems()),ownedInventory={};
    for(const [key,count] of Object.entries(stock))try{assertNativeItemDisposition(state,key);ownedInventory[key]=count;}catch{/* Unspendable goods never fund the home. */}
    return {sequence:state.sequence,clock,homeId,homeOwned:rights,atHome,alive:character.is_alive===true,
        controlled:body.ownerId==='player'&&body.controllerId==='player'&&body.form==='human',
        animalKnown:household?.animal?.id===HOUSEHOLD.animalId,
        hearthOwned:protoHome?projection.rows.some(r=>r.id==='proto23.hearth'):state.actors.player.facts['household.shackHearthInstalled']===true,
        ownedInventory,wet:!!active_effects.Wet,knownGift:(item_log.items['Rat tail']?.number||0)>0,furnitureInput:input,
        assertDisposition:key=>assertNativeItemDisposition(state,key)};
}
function p00HouseholdFrame(){
    const c=p00HouseholdContext(),view=householdPresentation({household,context:c,furnitureInput:c.furnitureInput});
    const actions=view.sections.flatMap(s=>s.actions.map(a=>({...a,id:a.command.id}))),records=view.sections.flatMap(s=>s.records.map(r=>r.text));
    if(c.homeOwned&&c.atHome&&c.controlled&&!household?.animal)actions.unshift({id:'meet',label:'Meet the brindled cat at this home'});
    if(c.homeId==='base.frontier:Shack'&&c.atHome&&c.homeOwned&&!c.hearthOwned)actions.push({id:'install_hearth',label:'Install a home hearth · 3 Rough wood logs + 5 coins',enabled:(c.ownedInventory[HOUSEHOLD.fuelKey]||0)>=3&&character.money>=5});
    return {visible:c.atHome&&c.homeOwned&&c.controlled&&!current_dialogue&&!current_combat,records,actions,
        disabled:!ownsSave||foundationSaveBlocked||!!importProbeToken||!!nativeOccupationReason()||!!current_game_action||!!current_activity||is_sleeping||is_reading||is_in_trade()};
}
function p00HouseholdEffects(plan,result){
    if(!result)return;
    const next={...active_effects};
    if(plan.effectDurations)for(const [id,duration] of Object.entries(plan.effectDurations)){
        if(duration===0)delete next[id];else if(next[id])next[id]=new ActiveEffect({...next[id],duration});}
    let resetRain=false;
    for(const e of result.effects){
        if(e.type==='removeCondition'){if(e.id!=='Wet')throw Error('Unsupported household condition.');delete next.Wet;resetRain=true;}
        if(e.type==='householdSmoke'){
            if(e.active)next['Household smoke']=new ActiveEffect({...effect_templates['Household smoke'],duration:2});
            else delete next['Household smoke'];
        }
    }
    plan.nativePatch={...plan.nativePatch,active_effects:next,...(resetRain?{rain_counter:0}:{})};
    plan.p00EffectPublication={next,resetRain};
}
function stageP00Time(plan){
    const elapsed=plan.state.clock-expansionState.clock;
    if(elapsed>0&&!restoringNativeSave){
        plan.gameplay ||= gameplaySnapshot();
        stageExposureJoin(plan,p23Exposure,expansionState.clock,p00ExposureContext());
        if(household){
            if(plan.state.sequence===expansionState.sequence)plan.state.sequence++;
            const c={...p00HouseholdContext(plan.state.clock,plan.state),sequence:plan.state.sequence-1};
            stageHouseholdJoin(plan,household,c);
        }
    }
    if(household&&plan.nativeLocation&&plan.nativeLocation!==current_location?.id&&p00HouseholdContext(expansionState.clock).atHome&&!p00HouseholdContext(plan.state.clock,plan.state,plan.nativeLocation).atHome){
        const raw=plan.p00Household?.state||household,c={...p00HouseholdContext(plan.state.clock,plan.state,plan.nativeLocation),sequence:plan.state.sequence};
        const prior=plan.p00Household?.notices||[];
        plan.state.sequence++;
        const result=stageHouseholdJoin(plan,raw,c,'leave');result.notices=[...prior,...result.notices];
    }
    p00HouseholdEffects(plan,plan.p00Household);
}
function actP00Household(type){
    const frame=p00HouseholdFrame();if(frame.disabled||!frame.visible)throw Error('Use this owned home when your living body is free.');
    const c=p00HouseholdContext(),state=structuredClone(expansionState);state.sequence++;
    const plan={state,external:{money:character.money},gameplay:gameplaySnapshot()};
    if(type==='install_hearth'){
        if(c.hearthOwned||c.homeId!=='base.frontier:Shack'||character.money<5)throw Error('An available owned home and five coins are required.');
        c.assertDisposition(HOUSEHOLD.fuelKey);
        applyGameplayEffect(plan.gameplay,{type:'item',key:HOUSEHOLD.fuelKey,amount:3},'player',true);
        plan.external.money-=5;state.actors.player.facts['household.shackHearthInstalled']=true;
    }else {
        if(type==='meet'){c.animalKnown=true;state.actors.player.facts['household.mossKnown']=true;}
        stageHouseholdJoin(plan,household,c,type);
    }
    persistExpansion(plan);householdPanel?.render();
}
function changeP00Exposure(next){
    if(!ownsSave||foundationSaveBlocked||importProbeToken||restoringNativeSave||nativeOccupationReason())throw Error('Use the writable free native body to change exposure.');
    next={...validateExposure(next),cursor:expansionState.clock};
    const state=structuredClone(expansionState);state.sequence++;
    persistExpansion({state,external:{money:character.money},gameplay:gameplaySnapshot(),nativePatch:{p23_exposure:next},p00Exposure:next});
    p23ExposurePanel?.render();pacingStatusPanel?.render();update_displayed_temperature(getPacingEffects(homePacingContext()));
}
function p00SleepingMultiplier(){const c=p00HouseholdContext();return householdRest(household,c,furnitureComfort(readFurnitureBonuses()));}

function homePacingContext(state=expansionState, location=current_location, calendar=current_game_time) {
    // CR8: the home rain cycle belongs to the home world only. Visitor worlds
    // (MoL, Paradise) have no sourced rain, so home rain must not wet them.
    const atHome=state.actors.player.worldId==='base.frontier';
    return {homeWorld:atHome&&!Object.values(optionalPackState.packs).some(p=>p.active),
        outdoors:location?.is_under_roof===false,season:calendar.getSeason?calendar.getSeason():current_game_time.getSeason(),nativeRain:atHome&&!!is_raining()};
}
function changeHomePacing(next) {
    if(!ownsSave||foundationSaveBlocked||importProbeToken||restoringNativeSave)throw Error('Pacing changes require the writable game tab.');
    const state=structuredClone(expansionState);state.sequence++;
    persistExpansion({state,external:{money:character.money},gameplay:gameplaySnapshot(),nativePatch:{pacing_e1:next},pacingNext:next,pacingTarget:calendarMinutes(current_game_time)});
    pacingPanel?.render();pacingStatusPanel?.render();durabilityPanel?.render();elementalPanel?.render();livingGearPanel?.render();combatOptionsPanel?.render();householdPanel?.render();
}
function createPacingStatusPanel() {
    const panel=document.createElement('details');panel.id='pacing_status_panel';panel.className='expedition_panel';
    const title=document.createElement('summary');title.textContent='Optional pacing';const text=document.createElement('p');panel.append(title,text);
    const render=()=>{const host=document.getElementById('location_actions_div');if(panel.parentElement!==host)host.append(panel);
        panel.hidden=!!current_dialogue||!!current_combat;text.textContent=pacingStatus(getPacingState(),homePacingContext()).replace('Total XP ×','Base pacing XP ×')+` Native XP ×${getPacingEffects(homePacingContext()).efficiency.toFixed(5)}. `+exposureStatus(p23Exposure,p00ExposureContext(),Object.keys(skills).filter(id=>nativeSkillDiscovery(skills[id],character)));p23ExposurePanel?.render();householdPanel?.render();livingGearPanel?.render();combatOptionsPanel?.render();trainingPanel?.render();};
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
    persistExpansion(plan);log_message(plan.message,action==='buy_notes'?'purchase':'notification');fortControls?.render();pacingPanel?.render();pacingStatusPanel?.render();durabilityPanel?.render();elementalPanel?.render();livingGearPanel?.render();combatOptionsPanel?.render();householdPanel?.render();return plan;
}
function observeFortAcquisition(itemId,count,kind,sourceId,label) {
    if(restoringNativeSave||!(count>0)||!item_templates[itemId]||expansionState.actors.player.worldId!=='base.frontier')return;
    fortSupply=observeFortSource(fortSupply,{itemId,count,kind,sourceId:String(sourceId),label:String(label),at:expansionState.clock});
}


let p23Field,p23Market,p23Leisure,p23Repeat,trancheFourPanel,p00PublishingActivity=false;
function p23HereContext(state=expansionState,calendar=current_game_time,location=current_location?.id) {
 const stats=character.getFullStats(),body=currentNativeBody();
 const conscious=character.is_alive===true&&!active_effects.Recovering&&stats.health>0&&(!state.simulation?.people.player||state.simulation.people.player.life==='alive');
 return {worldId:state.actors.player.worldId,location,clock:state.clock,calendar,calendarMinute:calendarMinutes(calendar),
  alive:character.is_alive===true&&state.chronicle?.life.endedAt==null,conscious,
  idle:!current_combat&&!current_activity&&!current_game_action&&!is_sleeping&&!is_reading&&!current_dialogue&&!is_in_trade()&&nativeActionReasons(state).length===0,
  controlled:body.ownerId==='player'&&body.controllerId==='player'&&body.form==='human',knownSite:state.actors.player.facts[P23_BED_FACT]===true,
  money:character.money,stamina:stats.stamina,maxStamina:stats.max_stamina,
  rng:state.rng||1};
}
function p23LeisureContext(state=expansionState,calendar=current_game_time) {
 const c=p23HereContext(state,calendar),person=state.simulation?.people?.[LEISURE_PERSON];
 return {...c,personId:LEISURE_PERSON,personKnown:!!state.simulation?.knowledge.player?.[EDA_KNOWLEDGE],
  personPresent:!!person&&person.location===c.location&&state.actors[LEISURE_PERSON]?.worldId===c.worldId,
  personAlive:person?.life==='alive',personMoney:state.actors[LEISURE_PERSON]?.resources.coins??0};
}
function p23MarketContext(vendorId,state=expansionState,calendar=current_game_time,location=current_location?.id) {
 const c=p23HereContext(state,calendar,location),trader=NPCRegistry.get('villageTrader');
 return {...c,traderId:vendorId==='villageTrader'?'village trader':vendorId,
  marketKnown:!!current_location?.npcs?.includes('villageTrader')&&trader.getAvailabilityComponent().getStatus().is_unlocked===true&&trader.canBeTradedWith(get_context()),
  effectsEnabled:document.documentElement.dataset.effects!=='off'};
}
export function previewP23MarketPurchase(vendorId,basket) {
 return nativeMarketPreview(p23Market,p23MarketContext(vendorId),basket);
}
function stageP23LocalReward(plan,result,key) {
 plan.gameplay ||= gameplaySnapshot();
 stageTrancheFourReward(plan,result,{keyFor:id=>{if(!item_templates[id])throw Error('Unknown native local reward.');return item_templates[id].getInventoryKey();}});
 plan.nativePatch[key]=result.state;return plan;
}
function p23Plan(){const state=structuredClone(expansionState);state.sequence++;return {state,external:{money:character.money},gameplay:gameplaySnapshot()};}
function stageP23Leisure(plan,result) {
 const c=p23HereContext(plan.state,plan.calendar||current_game_time);
 return stageLeisureMemory(plan,result,{...c,calendar:plan.calendar||calendarSnapshot(),lifeRecord});
}
function p23ActivityPatch(plan,id) {
 plan.nativePatch={...plan.nativePatch,current_activity:id?{activity_id:id,earnings:0,gathering_time:0,gathered_materials:{}}:null};plan.p00LocalActivity=id;
}
function publishP23Activity(plan) {
 if(!Object.hasOwn(plan,'p00LocalActivity'))return;
 p00PublishingActivity=true;
 try {if(current_activity)end_activity();if(plan.p00LocalActivity)start_activity(plan.p00LocalActivity);}
 finally {p00PublishingActivity=false;}
}
function updateP23MoonConversation() {
 if(metVillageElder())dialogues['village elder'].textlines['p23 moon bed'].getAvailabilityComponent().setStatus({is_unlocked:true});
}
function discoverP23MoonBed() {
 if(!workLedgerCanWrite()||current_dialogue!=='villageElder'||current_location.id!=='Village'||expansionState.actors.player.worldId!=='base.frontier'||!metVillageElder())throw Error('Ask the already-met elder in Village.');
 const plan=p23Plan();plan.state.actors.player.facts[P23_BED_FACT]=true;persistExpansion(plan);
}
export function interruptP23NativeWork() {
 if(restoringNativeSave||p00PublishingActivity)return;
 if(!p23Repeat?.looking&&!p23Field?.pending)return;
 if(!workLedgerCanWrite())throw Error('Saving must be restored before leaving this local search.');
 const plan=p23Plan(),c={...p23HereContext(),idle:false};
 if(p23Repeat?.looking)stageP23LocalReward(plan,advanceRepeatSearch(p23Repeat,c),'absorb_repeat_search');
 if(p23Field?.pending){stageP23LocalReward(plan,fieldAction(p23Field,c,'stop'),'field_familiarity_p07');p23ActivityPatch(plan,null);}
 persistExpansion(plan);
}
function stageP23C2Events(plan,result,id) {
 const old=localLife,next=result.state,context=p23HereContext(plan.state,plan.calendar||current_game_time);
 if(result.ok===true&&['help','decline'].includes(id)) {
  const oldOrdinal=old.helped+old.declined,ordinal=next.helped+next.declined;
  if(!Number.isSafeInteger(oldOrdinal)||!Number.isSafeInteger(ordinal)||ordinal!==oldOrdinal+1||old.encounter!=='runner'||next.encounter!==null)throw Error('Invalid actual runner departure.');
  if(id==='help'?(next.helped!==old.helped+1||next.declined!==old.declined):(next.declined!==old.declined+1||next.helped!==old.helped))throw Error('Runner departure counters disagree.');
  stageP23LocalReward(plan,replenishRepeatSearch(p23Repeat,context,{kind:'village-runner-departed',ordinal,clock:plan.state.clock}),'absorb_repeat_search');
 }
 if(result.ok===true&&id==='parcel'&&old.parcelStep===2&&next.parcelStep===3){
  if(!Number.isSafeInteger(next.parcelRuns)||next.parcelRuns!==old.parcelRuns+1)throw Error('Invalid actual completed mill receipt.');
  const market=planMarketDelivery(p23Market,p23MarketContext('villageTrader',plan.state),{index:next.parcelRuns,kind:'parcel_delivery',completed:true,clock:plan.state.clock});
  if(!market.ok)throw Error('The actual mill receipt could not be recorded.');plan.nativePatch={...plan.nativePatch,p23_market_life:market.state};
  (plan.p00TrancheFourNotices ||= []).push('The mill receipt cleared today’s Village bread supply paperwork: 5% off the native bread subtotal, rounded down.');
 }
}
function stageTrancheFourTime(plan) {
 if(restoringNativeSave)return;
 const elapsed=plan.state.clock-expansionState.clock,calendar=plan.calendar||current_game_time,c=p23HereContext(plan.state,calendar,plan.nativeLocation||current_location?.id);
 const moved=(!!plan.nativeLocation&&plan.nativeLocation!==current_location?.id)||plan.state.actors.player.worldId!==expansionState.actors.player.worldId;
 const occupied=nativeActionReasons(plan.state).length>0||['read','rest'].includes(plan.state.p23Reading?.current?.kind)&&plan.state.p23Reading.current.status==='active';
 const activity=plan.p00Travel?'travel':current_combat?'combat':current_activity?.id||'idle';
 let rawField=plan.nativePatch?.field_familiarity_p07??p23Field;
 if(rawField?.pending&&(moved||occupied)){
  stageP23LocalReward(plan,fieldAction(rawField,{...c,idle:false},'stop'),'field_familiarity_p07');
  p23ActivityPatch(plan,null);rawField=plan.nativePatch.field_familiarity_p07;
 }
 if(elapsed>0&&(rawField!==undefined||activity==='scouting'||activity==='combat'&&current_location?.id==='Infested field')){
  let raw=rawField;
  const start={...p23HereContext(),fromClock:expansionState.clock,clock:expansionState.clock,activity};
  if(raw===undefined||raw.lastClock===null)raw=advanceFieldFamiliarity(raw,start).state;
  const result=advanceFieldFamiliarity(raw,{...start,clock:plan.state.clock,calendar});
  stageP23LocalReward(plan,result,'field_familiarity_p07');
  if(!result.state.pending&&current_activity?.id==='lunar_gathering')p23ActivityPatch(plan,null);
 }
 const rawRepeat=plan.nativePatch?.absorb_repeat_search??p23Repeat;
 if(rawRepeat!==undefined&&(elapsed>0||moved||occupied))stageP23LocalReward(plan,advanceRepeatSearch(rawRepeat,{...c,idle:c.idle&&!moved&&!occupied}),'absorb_repeat_search');
 const rawLeisure=plan.nativePatch?.p23_leisure_memory??p23Leisure;
 if(rawLeisure?.pending&&rawLeisure.pending.due<=plan.state.clock){
  const lc=p23LeisureContext(plan.state,calendar),result=settleLeisureRound(rawLeisure,rawLeisure.pending.id,lc,rawLeisure.revision);
  stageP23Leisure(plan,result);
 }
}
function stageP23Defeat(plan,count=game_stats.total_deaths) {
 if(!p23Leisure)return;
 const c=p23LeisureContext(plan.state,plan.calendar||current_game_time);
 const raw=plan.nativePatch?.p23_leisure_memory??p23Leisure;
 const result=rememberNativeDefeat(raw,{kind:'unconsciousness',cause:'unknown',count},{...c,alive:false,conscious:false},raw.revision);
 stageP23Leisure(plan,result);plan.nativePatch={...plan.nativePatch,total_deaths:count};
}
function actTrancheFour(id,row={}) {
 if(!workLedgerCanWrite()||restoringNativeSave)throw Error('Use the writable native game tab.');
 if(id==='runner_offcut'){const plan=p23Plan(),result=repeatSearchAction(p23Repeat,p23HereContext());if(!result.ok)throw Error(result.messages.join(' '));stageP23LocalReward(plan,result,'absorb_repeat_search');persistExpansion(plan);return result;}
 if(id==='stopField'||id==='stopScout'){
  if(!['scouting','lunar_gathering'].includes(current_activity?.id))throw Error('No native local activity is running.');
  const plan=p23Plan();if(p23Field?.pending)stageP23LocalReward(plan,fieldAction(p23Field,p23HereContext(),'stop'),'field_familiarity_p07');p23ActivityPatch(plan,null);persistExpansion(plan);return;
 }
 const context=p23HereContext();if(!context.alive||!context.conscious||!context.controlled||!context.idle||context.worldId!=='base.frontier'||context.location!=='Village')throw Error('Return to your free, conscious native Village body.');
 if(id==='scout'||id==='gather'||id==='familiar-search'){
  if(!context.knownSite)throw Error('Ask the elder about the public herb bed first.');const plan=p23Plan();
  if(id==='scout')plan.nativePatch={field_familiarity_p07:advanceFieldFamiliarity(p23Field,{...context,fromClock:context.clock,activity:'idle'}).state};
  else {const result=fieldAction(p23Field,context,id);if(!result.ok)throw Error(result.messages.join(' '));stageP23LocalReward(plan,result,'field_familiarity_p07');}
  p23ActivityPatch(plan,id==='scout'?'scouting':'lunar_gathering');
  if(p23Repeat?.looking)stageP23LocalReward(plan,advanceRepeatSearch(p23Repeat,{...context,idle:false}),'absorb_repeat_search');persistExpansion(plan);return;
 }
 if(id==='meetEda'){
  if(expansionState.simulation?.people?.[LEISURE_PERSON])throw Error('Eda is already introduced.');
  const base=featureWaveContext(),first=expansionState.simulation?{state:expansionState,external:{money:character.money},gameplay:gameplaySnapshot()}:enrollSimulation(expansionState,expeditionRegistry,{...base,nativeAlive:true,nativeReady:true});
  const plan=commitSimulationCommand(first.state,expeditionRegistry,{id:'p23.leisure.introduce'},{...base,nativeAlive:true,nativeReady:true,external:first.external,gameplay:first.gameplay},first.state.sequence);
  plan.acquisitions=[...(first.acquisitions||[]),...(plan.acquisitions||[])];
  if(p23Repeat?.looking)stageP23LocalReward(plan,advanceRepeatSearch(p23Repeat,{...context,idle:false}),'absorb_repeat_search');
  persistExpansion(plan);return;
 }
 const plan=p23Plan(),raw=p23Leisure??createLeisureMemory(game_stats.total_deaths),revision=row.revision??raw.revision;
 if(p23Leisure&&revision!==p23Leisure.revision)throw Error('This leisure choice is stale. Review the current round.');
 let c=p23LeisureContext(plan.state),result;
 if(id==='enrollLeisure'){if(p23Leisure)throw Error('Practice is already enrolled.');plan.nativePatch={p23_leisure_memory:raw};plan.p00Leisure=raw;persistExpansion(plan);return;}
 if(!p23Leisure)throw Error('Open the optional target-dice practice first.');
 if(id.startsWith('dice:')) {
  const target=Number(id.split(':')[1]);
  // Draw only on the detached transaction. Failed eligibility/save never moves live streams.
  c.rng=Math.floor(drawUnit(plan.state,scopedStream('interaction:p23.leisure',c.worldId),`p23.leisure.round:${raw.rounds+1}`)*0xffffffff)+1;
  result=startLeisureRound(raw,target,c,revision);
 } else if(id==='edaHelp'||id==='edaRefuse')result=respondToEda(raw,id==='edaHelp'?'help':'refuse',c,revision);
 else if(id==='edaTalk')result=revisitEda(raw,c,revision);
 else throw Error('Unknown local practice command.');
 stageP23Leisure(plan,result);
 if(p23Repeat?.looking)stageP23LocalReward(plan,advanceRepeatSearch(p23Repeat,{...context,idle:false}),'absorb_repeat_search');persistExpansion(plan);
}
function trancheFourFrame() {
 const c=p23HereContext(),lc=p23LeisureContext(),field=fieldView(p23Field,c),leisure=leisureMemoryView(p23Leisure,lc),repeat=repeatSearchView(p23Repeat,c),market=marketLifeView(p23Market,p23MarketContext('villageTrader'));
 const visible=c.worldId==='base.frontier'&&c.location==='Village'&&!current_dialogue&&!current_combat&&!is_in_trade(),disabled=!workLedgerCanWrite()||!c.idle||!c.conscious||!c.controlled;
 const lines=[],actions=[];
 if(field.visible){lines.push(`${field.summary} Physical bed stock: ${field.stock}. Familiarity: ${field.minutes}/30 minutes${field.familiar?' · familiar search learned':''}.`);
  if(field.pending)lines.push(`Searching: ${field.pending.progress}/${field.pending.requiredMinutes} played minutes.`);
  if(current_activity?.id==='scouting')actions.push({id:'stopScout',label:'Stop scouting',disabled:!workLedgerCanWrite()});else actions.push({id:'scout',label:'Scout Village · learn the ground without extra XP',disabled});
  for(const row of field.rows)actions.push({...row,id:row.id==='stop'?'stopField':row.id,disabled:row.id==='stop'?!workLedgerCanWrite():disabled||row.disabled});
 } else if(metVillageElder())lines.push('Ask the village elder about the public moonlit herb bed through Talk to someone.');
 if(market.visible)lines.push(market.notice,market.favor);
 if(p23Repeat!==undefined){lines.push(repeat.summary);for(const row of repeat.rows)actions.push({...row,disabled:disabled||row.disabled});}
 if(!p23Leisure)actions.push({id:'enrollLeisure',label:'Open optional target-dice practice',disabled});
 else {lines.push('Target dice: choose 1–6; two played minutes; one coin and one stamina. A matching throw restores that stamina.');
  if(leisure.pending)lines.push(`Paid round pending: target ${leisure.pending.target}; ${Math.max(0,leisure.pending.due-c.clock)} played minutes remain. The face stays hidden until settlement.`);
  else for(let face=1;face<=6;face++)actions.push({id:`dice:${face}`,label:`Choose ${face}`,revision:p23Leisure.revision,disabled});
  if(leisure?.last)lines.push(`Last round: chose ${leisure.last.target}, rolled ${leisure.last.face}${leisure.last.matched?' · matched':''}.`);
 }
 if(!lc.personKnown)actions.push({id:'meetEda',label:'Speak with the Village cup maker',disabled});
 else {lines.push('Eda · adult Village cup maker.');if(leisure?.person)lines.push(leisure.person.text);
  if(p23Leisure){actions.push({id:'edaTalk',label:'Speak with Eda again',revision:p23Leisure.revision,disabled:disabled||!lc.personPresent||!lc.personAlive});
   if(['none','used'].includes(p23Leisure.offer))actions.push({id:'edaHelp',label:'Give Eda one actual coin for her worn cup',revision:p23Leisure.revision,disabled:disabled||!lc.personPresent||!lc.personAlive||c.money<1},{id:'edaRefuse',label:'Decline Eda’s cup request',revision:p23Leisure.revision,disabled:disabled||!lc.personPresent||!lc.personAlive});}
 }
 return {visible,lines,actions};
}

function localLifeContext(calendar=current_game_time, state=expansionState, location=current_location?.id) {
    return {worldId:state.actors.player.worldId, location,
        alive:character.is_alive===true&&state.chronicle?.life.endedAt==null,
        idle:!current_combat&&!current_activity&&!current_game_action&&!is_sleeping&&!is_reading&&!current_dialogue&&!is_in_trade()&&nativeActionReasons(state).length===0,
        clock:calendarMinutes(calendar),calendarMinute:calendarMinutes(calendar),
        perception:character.getTotalSkillLevel('Perception'),money:character.money,
        millUnlocked:locations['Eastern mill'].getAvailabilityComponent().getStatus().is_unlocked===true,
        bleedingRemaining:active_effects.Bleeding?.duration||0,
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
function dispatchLocalLifePlan(result, state = structuredClone(expansionState), id = null) {
    if(!ownsSave||foundationSaveBlocked||importProbeToken||is_loading_error)throw Error('This tab cannot save local actions.');
    if(result.ok===false)throw Error(result.messages.join(' '));
    state.sequence++;
    const plan=stageLocalLifeResult({state,external:{money:character.money},gameplay:gameplaySnapshot()},result);
    stageP23C2Events(plan,result,id);persistExpansion(plan);
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

// Context builders reuse one build per pass over an unchanged world (simulation_render.js).
// Every caller gets its own top-level and facts copy of the shared build.
const copyFramedContext=c=>c.facts?{...c,facts:{...c.facts}}:{...c};
function framedRead(name,build){
    return framedSimulationRead(expansionState,name,build,name==='simulationNativeContexts'
        ?value=>Object.fromEntries(Object.entries(value).map(([id,c])=>[id,copyFramedContext(c)])):copyFramedContext);
}
// An explicit planning frame (stepper planning) wins; otherwise a render pass's frame.
function simulationNativeContexts(readFrame) {
    if(readFrame)return readFrame.read(simulationNativeContexts,()=>buildSimulationNativeContexts(readFrame),{mutable:true});
    return framedRead('simulationNativeContexts',()=>buildSimulationNativeContexts());
}
function buildSimulationNativeContexts(readFrame) {
    const contexts=tidemarkSimulationContexts(expansionState,realmSimulationContexts(expansionState,nativeGameplay.contexts(expansionState,!!(current_activity || current_game_action || current_combat || current_dialogue || is_sleeping || is_reading || is_in_trade()))));
    const evidence=frontierNativeEvidence(),causalFrame=causalNative.read(expansionState);
    for(const id of Object.keys(expansionState.simulation?.people || {player:true})) contexts[id]={...contexts[id],nativeSkillLevels:evidence.nativeSkillLevels,nativeZoneCounts:evidence.nativeZoneCounts,destinationNative:tidemarkNative.read(expansionState),nestedNative:nestedNative.read(expansionState),paradiseNative:paradiseNative.read(expansionState),molNative:molNative.read(expansionState),proto23Native:proto23Native.read(expansionState),causalStoryNative:causalFrame,...nativeCampaignLocationOwners(),
        facts:{...contexts[id]?.facts,...evidence.facts,...(id==='player'?{location:current_location?.id,strength:character.getFullStats().strength,agility:character.getFullStats().agility}: {})}};
    for(const [id,ctx] of Object.entries(contexts))ctx.facts=featurePowerContext(expansionState,{...ctx,actorId:id,vitals:{[id]:ctx.vitals},equipment:{[id]:ctx.equipment}}).facts;
    Object.assign(contexts.player.facts,structuredEquipmentView().facts);
    Object.assign(contexts.player.facts,techniqueFacts(expansionState.actors.player,expeditionRegistry,contexts.player));
    const gameplay=gameplaySnapshot(),vitals=Object.fromEntries(Object.entries(contexts).map(([id,c])=>[id,c.vitals]));
    for(const [id,c] of Object.entries(contexts))Object.assign(c,{managementPlayerLocation:current_location?.id,managementPlayerAlive:character.is_alive===true,actorId:id,worldId:expansionState.actors[id].worldId,nativeBody:id==='player'?currentNativeBody():null,nativeCareFrame:nativeCareFrame(),gameplay,vitalsByActor:vitals,nativeAlive:character.is_alive===true,nativeReady:!active_effects.Recovering,inventoryOwners:structuredInventoryOwners(),structuredNative:optionalPackState.structured?{...optionalPackState.structured,bound:true}:null,remainderLivelihoodClock:{calendarMinute:calendarMinutes(current_game_time),clock:expansionState.clock},facts:{...c.facts,...(id==="player"?{"skill.Crafting":character.getTotalSkillLevel("Crafting")}:{}),"weather.raining":getPacingEffects(homePacingContext()).raining,...(id==='player'?{"village.shackUnlocked":!!locations.Shack.getAvailabilityComponent().getStatus().is_unlocked,"village.craftsmanMet":metVillageElder()&&expeditionContext(readFrame).facts["village.craftsmanMet"],"village.craftsmanPresent":expansionState.simulation?.people.oldCraftsman?.life==='alive'&&expansionState.simulation.people.oldCraftsman.location==='Village'}:{})}});
    contexts.player.generatedPeopleFrame={people:generatedPeopleSnapshot(calendarMinutes(current_game_time)),clock:expansionState.clock};
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
function expeditionContext(readFrame) {
    if(readFrame)return readFrame.read(expeditionContext,()=>buildExpeditionContext());
    return framedRead('expeditionContext',buildExpeditionContext);
}
function buildExpeditionContext() {
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
            'skill.Crafting': character.getTotalSkillLevel('Crafting'),'skill.Cooking':character.getTotalSkillLevel('Cooking'),
            "village.elderMet": metVillageElder(),
            "village.craftsmanMet": (() => {const status = dialogues["old craftsman"].textlines.hello.getAvailabilityComponent().getStatus(); return !!(status.is_locked || status.is_finished);})(),
            "village.shackUnlocked": !!locations.Shack.getAvailabilityComponent().getStatus().is_unlocked,
            "village.notesRead": item_templates[ROUTE_NOTES].isFinished(),
            "village.notesHeld": !!gameplay.player.inventory[NOTES_KEY],
            climbing: skills.Climbing ? character.getTotalSkillLevel("Climbing") : 0,
            kits: gameplay.player.inventory[SURVEY_KIT_KEY] || 0, rope: gameplay.player.inventory[SURVEY_ROPE_KEY] || 0}}));
}

function persistExpansion(plan, ownershipBindings = {}, itemsByOwner = {}, readFrame = null) {
    plan.p00WasRest ||= expansionState.p23Reading?.current?.kind==='rest';
    if(plan.state.p23Reading && !plan.p00StudyCommand){
        const context=studyContext(plan.state,plan.gameplay||gameplaySnapshot());
        const result=observeReadingClock(plan.state.p23Reading,context);
        stageReadingResult(plan,result,{books:nativeBooksSnapshot(),quoteXP:p00NativeSkillXP});
    }
    stageMistglassAdvance(plan,nativeMistglassContext(),expeditionRegistry,{quoteXP:p00NativeSkillXP});
    if(plan.nativeLocation || plan.state.actors.player.worldId!==expansionState.actors.player.worldId)stageMistglassAdvance(plan,nativeMistglassContext(plan.state,plan.nativeLocation||current_location?.id),expeditionRegistry,{quoteXP:p00NativeSkillXP});
    stageP00Time(plan);
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
    stageTrancheFourTime(plan);
    stageTitleRecognition(plan,{titles:character.titles,counters:readTitleCounters(),calendar:current_game_time,anthologyFinished:item_templates[ANTHOLOGY].isFinished()});
    // Played-time settlements may retain their original job sequence. Opted-in
    // characters give this committed boundary a fresh nonce before recognition.
    if(plan.state.referenceGameplay && expansionState.referenceGameplay && plan.state.sequence===expansionState.sequence && plan.state.clock>expansionState.clock)plan.state.sequence++;
    if(plan.state.auditRemainder||plan.state.causalStories||plan.state.motherOfLearning||plan.state.proto23Village)plan.state.schema=11;
    else if(plan.state.bookWorldCampaign)plan.state.schema=10;
    else if(plan.state.referenceGameplay)plan.state.schema=9;
    if(plan.state.causalStories){const current=gameplaySnapshot();plan.gameplay={...current,...plan.gameplay};}
    if(plan.state.causalStories&&plan.nativeLocation)plan.state.simulation.people.player.location=plan.nativeLocation;
    readFrame ??= stepperRenderSuppressed?createPlanningReadFrame():null;
    const causalContexts=simulationNativeContexts(readFrame);
    if(plan.state.causalStories){
        const currentVitals=Object.fromEntries(Object.entries(causalContexts).filter(([,c])=>c.vitals).map(([id,c])=>[id,c.vitals]));
        plan.vitals={...currentVitals,...plan.vitals};
        plan.equipment={...Object.fromEntries(Object.entries(causalContexts).filter(([,c])=>c.equipment).map(([id,c])=>[id,c.equipment])),...plan.equipment};
        if(plan.native)for(const [key,offset] of [['health','hpToFull'],['stamina','staminaToFull']])if(plan.native[offset]!=null)plan.vitals.player[key]=Math.max(0,plan.vitals.player[`max_${key}`]-plan.native[offset]);
        for(const [id,c] of Object.entries(causalContexts)){c.vitals=plan.vitals[id]||c.vitals;c.vitalsByActor=plan.vitals;c.equipment=plan.equipment[id]||c.equipment;}
    }

    if(plan.nativeLocation)causalContexts.player.facts={...causalContexts.player.facts,location:plan.nativeLocation};
    reconcileCausalStoryPlan(expansionState,plan,expeditionRegistry,causalContexts);
    reconcileSystemsWorkshop(expansionState,plan,{chest:plan.ownership?.chest||readInventoryOwner(player_storage.getItems())});
    advanceReferenceGameplay(expansionState,plan,expeditionRegistry,featureWaveContext(readFrame));
    advanceAuditRemainder(expansionState,plan,expeditionRegistry,featureWaveContext(readFrame));
    reconcileBookCareRuntime(expansionState,plan,expeditionRegistry);
    reconcileParadiseCampaignDepthRuntime(expansionState,plan,expeditionRegistry);
    reconcileLorePractice(expansionState,plan,expeditionRegistry,causalContexts);
    validateAuditRemainderNative(plan.state,plan.gameplay || gameplaySnapshot());
    validateGameAbsorptionAssay(plan.state,expeditionRegistry,{...plan,gameplay:plan.gameplay || gameplaySnapshot()});
    retainNestedCarrierReceipt(plan);
    retainParadiseCarrierReceipt(plan);
    assertBacklogPublication(expansionState,plan);
    assertQualifiedOfficePlan(expansionState,plan,{id:plan.backlogCommand},backlogContext(readFrame));
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
    reconcileStatusCareNative(expansionState,plan,expeditionContext(readFrame));
    reconcileFieldCareNative(expansionState,plan,expeditionContext(readFrame));
    stageContextualBalmEffectRequest(expansionState,plan,expeditionContext(readFrame));
    reconcileWorldCompletionPlan(plan,expeditionRegistry,{player:{...expeditionContext(readFrame),external:plan.external,gameplay:plan.gameplay,vitals:plan.vitals||expeditionContext(readFrame).vitals,equipment:plan.equipment||expeditionContext(readFrame).equipment}});
    reconcileStructuredLifePlan(plan,optionalPackState.structured,{deaths:game_stats.total_deaths});
    const nextLocalCalendar = resolveWorldCalendar(plan.state, plan.calendar ?? current_game_time);
    const previousNight = is_night(current_game_time);
    if(!ownsSave || importProbeToken || expansionError || foundationSaveBlocked || is_loading_error) throw new Error(expansionError || "This tab cannot commit expeditions.");
    for(const actor of Object.values(plan.state.actors)) {
        const active = activePractice(actor);
        if(active && !Object.hasOwn(skills, active[1].practice.xpSkill)) throw new Error("Unsupported saved practice skill.");
    }
    stageRevealKnowledge(plan,readInventoryOwner(character.getItems()),character.money);
    readFrame?.invalidate(); // Staged actor bindings begin a new read phase.
    const stagedGameplay = nativeGameplay.stageBindings(plan.gameplay,plan.state);
    const actorBindings = stagedGameplay.actors;
    const unlockAdapter = unlocks => [
        ...(unlocks.skills || []).map(id => ({kind: "skill", id})),
        ...(unlocks.recipes || []).map(r => ({kind: "recipe", id: recipes[r.category]?.[r.subcategory]?.[r.recipe_id]?.id})),
        ...(unlocks.quests || []).map(id => ({kind: "quest", id}))];
    const p00Hidden=Object.fromEntries(['Famine','Cold resistance'].map(id=>[id,!nativeSkillDiscovery(skills[id],character)]));
    const publication = prepareGameplayPublication(plan.gameplay, {actors: actorBindings, skills, getItemFromKey, unlockAdapter});
    const townAccess = townUnlocks(expansionState, plan.state);
    const villageTextChanged = villageLedgerSentence(expansionState) !== villageLedgerSentence(plan.state);
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
        const nativeContexts = simulationNativeContexts(readFrame);
        nativeContexts.player.facts = expeditionContext(readFrame).facts;
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
    stageGrowthNativeGrants(plan);
    stageGrowthForPublication(plan);
    const nativePublications=[tidemarkNative.stage(plan),nestedNative.stage(plan),paradiseNative.stage(plan),molNative.stage(plan),proto23Native.stage(plan),causalNative.stage(plan),prepareContextualBalmNative(expansionState,plan,{activeEffects:active_effects,itemTemplates:item_templates,effectTemplates:effect_templates,ActiveEffect,refresh:()=>{update_displayed_effects();character.addActiveEffectBonus(active_effects);character.updateStatsAndDisplay();}})];
    const nativePublication={write:envelope=>nativePublications.forEach(p=>p.write(envelope)),publish:()=>nativePublications.forEach(p=>p.publish())};
    readFrame?.invalidate(); // Life observations publish through the durable owner.
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
    readFrame?.invalidate();
    expansionState = plan.state;
    localDateLog.commit(nextLocalCalendar);
    if(plan.pacingNext){setPacingState(plan.pacingNext);pacingMinute=plan.pacingTarget;pacingPanel?.render();pacingStatusPanel?.render();durabilityPanel?.render();elementalPanel?.render();livingGearPanel?.render();combatOptionsPanel?.render();householdPanel?.render();}
    if(plan.p00Exposure)p23Exposure=plan.p00Exposure;
    if(plan.p00Household){household=plan.p00Household.state;for(const text of plan.p00Household.notices)log_message(text,'notification');}
    p23ExposurePanel?.render();householdPanel?.render();livingGearPanel?.render();combatOptionsPanel?.render();
    if(plan.nativePatch?.fort_supply)fortSupply=migrateFortSupply({fort_supply:plan.nativePatch.fort_supply});
    if(plan.localLifeResult){localLife=normalizeLocalLife(plan.localLifeResult.state);for(const message of plan.localLifeResult.messages)log_message(message,'notification');}
    if(Object.hasOwn(plan.nativePatch||{},'field_familiarity_p07'))p23Field=normalizeFieldFamiliarity(plan.nativePatch.field_familiarity_p07);
    if(Object.hasOwn(plan.nativePatch||{},'p23_market_life'))p23Market=normalizeMarketLife(plan.nativePatch.p23_market_life);
    if(Object.hasOwn(plan.nativePatch||{},'p23_leisure_memory'))p23Leisure=structuredClone(plan.nativePatch.p23_leisure_memory);
    if(Object.hasOwn(plan.nativePatch||{},'absorb_repeat_search'))p23Repeat=normalizeRepeatSearch(plan.nativePatch.absorb_repeat_search);
    if(plan.p00LifeRecord)lifeRecord=plan.p00LifeRecord;
    if(plan.nativePatch?.total_deaths!==undefined)game_stats.total_deaths=plan.nativePatch.total_deaths;
    for(const text of plan.p00TrancheFourNotices||[])log_message(text,'notification');
    character.money = plan.external.money;
    if(plan.calendar) current_game_time.loadTime(plan.calendar);

    if(plan.effectDurations) {
        let expired = false;
        for(const [id, duration] of Object.entries(plan.effectDurations)) {
            if(duration === 0) {delete active_effects[id]; expired = true;} else active_effects[id].duration = duration;
        }
        if(expired) {character.addActiveEffectBonus(active_effects); character.updateStatsAndDisplay();}
    }
    if(plan.p00EffectPublication){for(const id of Object.keys(active_effects))delete active_effects[id];Object.assign(active_effects,plan.p00EffectPublication.next);
        if(plan.p00EffectPublication.resetRain)rain_counter=0;character.addActiveEffectBonus(active_effects);character.updateStatsAndDisplay();update_displayed_effects();}
    if(nativeLifeEnded()) character.is_alive = false;
    if(plan.nativePatch?.combatOptions){p23CombatOptions=structuredClone(plan.nativePatch.combatOptions);if(current_combat&&!current_combat.is_special_combat){current_combat.combatOptions=combatRuntime();current_combat.nextCombatEvent=()=>current_combat.combatOptions.snapshot().lastEvent+1;current_combat.nativeExchangeHost=runP23CombatExchange;}}
    if(Object.hasOwn(plan.nativePatch||{},'p23EncounterProfile'))p23EncounterProfile=readProfileState(plan.nativePatch.p23EncounterProfile);
    if(Object.hasOwn(plan.nativePatch||{},'native_encounter'))pendingNativeEncounter=plan.nativePatch.native_encounter;
    if(plan.nativePatch?.[`availabilities/location/${AREA_ID}`]===1)locations[AREA_ID].getAvailabilityComponent().is_unlocked=true;
    if(plan.nativePatch?.p23_living_gear)p23LivingGear=structuredClone(plan.nativePatch.p23_living_gear);
    if(plan.nativePatch?.equipment_durability)durability.load(plan.nativePatch.equipment_durability);
    if(plan.nativePatch?.p23_salvage)p23Salvage=loadSalvage(plan.nativePatch.p23_salvage);
    if(plan.nativePatch?.['character/titles'])character.titles=structuredClone(plan.nativePatch['character/titles']);
    if(plan.nativePatch?.['character/long_life_worn'])character.long_life_worn=validateWornTitle(plan.nativePatch['character/long_life_worn'],character.titles);
    if(plan.nativePatch?.['character/titles'] || plan.nativePatch?.['character/long_life_worn'])character.setTitleBonus(longLifeTitleBonuses(character.titles,character.long_life_worn));
    if(Object.hasOwn(plan.nativePatch||{},'p23_growth_profile'))p23Growth=structuredClone(plan.nativePatch.p23_growth_profile);
    if(Object.hasOwn(plan.nativePatch||{},'p23_growth_earned'))p23GrowthEarned=structuredClone(plan.nativePatch.p23_growth_earned);
    if(plan.nativePatch?.[`availabilities/trader/${GROWTH_COUNTER_ID}`]===1)p23GrowthCounter.getAvailabilityComponent().is_unlocked=true;
    publishStudy(plan);
    readFrame?.invalidate();
    if(plan.absorbPublish)plan.absorbPublish();
    publishP23Activity(plan);
    readFrame?.invalidate();
    publication.publish();
    readFrame?.invalidate();
    unlockPublication.publish();
    if(plan.revealLesson)log_message('Handling twenty Golmoon leaves taught you a preparation. Review it in Learned preparations.','notification');
    readFrame?.invalidate();
    equipmentPublication.publish();
    if(plan.p00GrowthSource)publishGrowthProjection(plan.p00GrowthSource);
    readFrame?.invalidate();
    publishNativeVitals(plan.native,character);
    projectNativePeopleBodies();
    readFrame?.invalidate();
    ownershipPublication?.publish();
    readFrame?.invalidate();
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
        if(!deferWhileHidden(renderPublishedDisplays,renderPublishedDisplays))renderPublishedDisplays(plan);
        for(const id of publication.changes) {
            if(skills[id].visibility_treshold <= skills[id].getTotalXP()) {
                create_new_skill_bar(skills[id]);
                update_displayed_skill_bar(skills[id], true);
            }
        }
        for(const id of publication.changes)if(p00Hidden[id]&&nativeSkillDiscovery(skills[id],character))nativeDiscoveryFeedback?.publish({type:'native-skill-discovery',id,settled:true});
        if(publication.changes.length) character.updateStatsAndDisplay();
        if(plan.calendar && (p23LivingGear!==undefined||previousNight !== is_night(current_game_time))) {character.addActiveEffectBonus(active_effects);character.updateStatsAndDisplay();}
        if((townAccess.length || villageTextChanged && current_location.id === "Village") && current_location.tags.safe_zone) update_displayed_normal_location(current_location);
        if(!deferWhileHidden(renderPublicationPanels,renderPublicationPanels))renderPublicationPanels();
        if(plan.p00EarnedTitles){for(const id of plan.p00EarnedTitles)log_message(`Title earned: ${title_by_id[id].name}. ${title_by_id[id].text}`,'level_up');titlesPanel?.announce(plan.p00EarnedTitles);}
    } catch(error) {console.error("Saved expedition display could not refresh; reload to restore it.", error);}
    if(plan.calendar) awakenOptionalStart();
}

// Display-only refreshes after a publication. A reveal (no plan) refreshes all of them.
function renderPublishedDisplays(plan) {
    if(!plan || plan.calendar) update_displayed_time();
    if(!plan || plan.native) {update_displayed_stamina(); update_displayed_health();}
    update_displayed_character_inventory();
    if(is_storage_open()) {update_displayed_storage_inventory(); stampStorageRequests();}
    update_displayed_item_log();
    renderWorldIdentity();
}
// The publication render batch: display only, one frame over the published state.
function renderPublicationPanels() {
    withSimulationFrame(expansionState,()=>{
        expeditionPanel?.render(); techniquePanel?.render(); chroniclePanel?.render(); villagePanel?.render(); simulationPanel?.render(); systemsWorkshopPanel?.render(); townPanel?.render();
        pursuitPanel?.render();
        bodyPanel?.render();
        fieldPanel?.render(); promisePanel?.render(); crushSocialPanel?.render(); managementPanel?.render();
        frontierCampaignPanel?.render();
        partyPanel?.render(); exchangePanel?.render(); observationPanel?.render(); pocketRealmPanel?.render();skillExpansionPanel?.render();originalFrontierPanel?.render();featureExpansionPanel?.render();foundationInteractionPanel?.render();causalStoryPanel?.render();
        backlogPanel?.render();replacementRecognitionPanel?.render();backlogOpeningPanel?.render();repositoryPanel?.render();inkPanel?.render();nestedInkPanels?.render();
        knownRoutesPanel?.render();adventureNotebook?.render();livingGearPanel?.render();combatOptionsPanel?.render();localLifePanel?.render();practicePanel?.render();updateWorkspace();fortControls?.render();pacingPanel?.render();pacingStatusPanel?.render();durabilityPanel?.render();elementalPanel?.render();livingGearPanel?.render();combatOptionsPanel?.render();householdPanel?.render();
        growthPanel?.render();mistglassPanel?.render();
        expansionQuests?.render();
        trancheFourPanel?.render();lifeRecordPanel?.render();
        characterBio?.render();
        titlesPanel?.render();
        worldEventFeed?.render();
    });
}

function commitNativeTrade(quote, currentQuote) {
    if(quote.vendorId===GROWTH_COUNTER_ID)throw Error('Use the exact funded tonic purchase in Study conditioning.');
    if(simulationOccupiesActor(expansionState) || waitingSimulationChoice(expansionState)) throw new Error("Finish your living-world work or decision before trading.");
    if(expansionState.pending.some(job => job.context.actorId === "player") || activePractice(expansionState.actors.player)) throw new Error("Finish your expedition or technique drill before trading.");
    for(const item of quote.sell) assertNativeItemDisposition(expansionState,item.item_key);
    const refreshed=previewP23MarketPurchase(quote.vendorId,{buySubtotal:quote.buyValue,breadSubtotal:quote.breadSubtotal||0,buyUnits:quote.buy.reduce((n,r)=>n+r.count,0),useCoupon:quote.marketLife?.basket.useCoupon===true});
    if(JSON.stringify(refreshed)!==JSON.stringify(quote.marketLife))throw Error('Village market quote changed. Refresh and review the price.');
    const marketPlan=planMarketTrade(p23Market,p23MarketContext(quote.vendorId),{...refreshed.basket,index:expansionState.sequence+1});
    if(quote.vendorId==='villageTrader'&&expansionState.actors.player.worldId==='base.frontier'&&current_location.id==='Village'&&!marketPlan.ok)throw Error('This market receipt is stale.');
    const vendor = NPCRegistry.get(quote.vendorId).getTraderInventory();
    // Preserve the native uncapped Haggling award and its current XP bonuses.
    const skill = skills.Haggling;
    const xp = skill.canGainXP(get_context()) ? Math.round((quote.buyValue + quote.sellValue) / 10 *
        config.global_xp_multiplier * character.getSkillXPGain("Haggling") * (character.xp_multiplier ?? 1) * 100) / 100 : 0;
    const plan = stageNativeTrade({state: expansionState, gameplay: gameplaySnapshot(),
        owners: {player: readInventoryOwner(character.getItems()), vendor: readInventoryOwner(vendor)},
        money: character.money, market: loot_sold_count, itemLog: item_log.items, quote, currentQuote, xp, getItem: getItemFromKey,buyDebit:refreshed.quote.total});
    const purchased=quote.buy.reduce((n,row)=>n+row.count,0);
    const purchasedLife=recordLocalPurchases(localLife,purchased);
    plan.nativePatch={...plan.nativePatch,absorb_local_life:purchasedLife};
    plan.localLifeResult={state:purchasedLife,messages:[]};
    if(marketPlan.ok)plan.nativePatch.p23_market_life=marketPlan.state;
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
    if(expansionState.chronicle?.session || nativeLifeEnded() || current_activity || current_game_action || current_combat || is_sleeping || is_reading || is_in_trade()) {
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

// Native played time now shares the existing durable expansion clock in every origin.
function usesJoinedClock() {return true;}

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
        if(nativeLifeEnded())throw Error('This life has ended.');
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




function habitatContext(){return {owner:habitatOwner,clock:calendarMinutes(current_game_time),
    money:character.money,inventory:Object.fromEntries(Object.entries(character.getItems()).map(([k,r])=>[k,r.count])),
    location:current_location?.id,world:expansionState.actors.player.worldId,
    ready:harvestReady()&&!nativeActionReasons(expansionState).length,inDialogue:!!current_dialogue,inCombat:!!current_combat};}
function commitHabitatPlan(plan){
    for(const row of plan.items)if(row.amount<0)assertNativeItemDisposition(expansionState,row.key);
    const transaction=beginNativeCraftTransaction({owners:[character,character.getItems(),item_log,favourite_items,favourite_consumables],
        bindings:[{get:()=>habitatOwner,set:v=>{setHabitatOwner(v);}}]});
    try{
        setHabitatOwner(plan.state);character.money=plan.money;
        for(const row of plan.items){
            if(row.amount<0)character.removeFromInventory([{item_key:row.key,item_count:-row.amount}]);
            else character.addToInventory([{item_key:row.key,count:row.amount}]);
        }
        const serialized=create_save();if(!serialized)throw Error('Could not save meadow pen care.');
        validateSaveEnvelope(JSON.parse(serialized),game_version);
        lifeSaveStorage.setItem(is_on_dev()?dev_save_key:save_key,serialized,()=>transaction.markDurable());
    }catch(e){if(transaction.status==='pending')transaction.rollback();throw e;}
    finally{update_displayed_character_inventory();update_displayed_money();update_displayed_crafting_recipes();habitatPanel?.render();}
}

function harvestContext(){
    const weapon=character.getEquipment().weapon;
    const tool=weapon && weapon.weapon_type!=='hammer' ? (weapon.quality??100) : 0;
    return {clock:calendarMinutes(current_game_time),skill:character.getTotalSkillLevel('Butchering'),tool};
}
// First failing native gate, in the existing wording, so a blocked action can say which one holds.
function harvestWriteReason(){return restoringNativeSave?'Wait for the save to finish restoring.':!ownsSave?'This tab is read-only. Close the other game tab and reload to save progress.':foundationSaveBlocked||importProbeToken||is_loading_error||lifeStorageFailure?'Restore writable saving.':!character.is_alive?'A living supported body is required.':expansionState.actors.player.worldId!=='base.frontier'?'Return to the frontier world first.':'';}
function harvestWritable(){return !harvestWriteReason();}
function harvestAutomaticReady(){
    return !current_activity&&!current_game_action&&!current_dialogue&&!is_sleeping&&!is_reading&&!is_in_trade()&&!nativeOccupationReason();
}
function harvestBlockReason(){return harvestWriteReason()||nativeOccupationReason()||(current_activity||current_game_action?'Finish your current activity first.':current_combat?'Leave combat first.':current_dialogue?'Finish the current conversation first.':is_sleeping?'Wake up first.':is_reading?'Stop reading first.':is_in_trade()?'Close trade first.':'');}
function harvestReady(){return !harvestBlockReason();}
function grantHarvest(plan){
    if(!plan)return;
    if(!skills.Butchering.isUnlocked()) {skills.Butchering.setUnlocked();create_new_skill_bar(skills.Butchering);}
    const items=plan.outputs.map(o=>({item_key:o.item_key,count:o.count}));
    character.addToInventory(items);
    add_xp_to_skill({skill:skills.Butchering,xp_to_add:plan.xp,should_info:false,cap_gained_xp:false});
    log_message('Processed carcass: '+plan.outputs.map(o=>`${o.count} ${getItemFromKey(o.item_key).getName()}`).join(', '),'loot');
    update_displayed_character_inventory();update_displayed_crafting_recipes();
}

function harvestTransaction(run){
    const transaction=beginNativeCraftTransaction({owners:[expansionState,character,character.getItems(),character.getLevelableComponent(),item_log,global_flags,availabilities,...Object.values(skills).map(s=>s.getAvailabilityComponent()),which_skills_affect_skill,...nativeCraftQuestOwners(quests,active_quests)],bindings:[{get:()=>harvestOwner,set:v=>{setHarvestOwner(v);}},{get:()=>expansionState,set:v=>{expansionState=v;}},{get:()=>p23Growth,set:v=>{p23Growth=v;}},{get:()=>p23GrowthEarned,set:v=>{p23GrowthEarned=v;}}]});
    try {run();const serialized=create_save();if(!serialized)throw Error('Could not save carcass processing.');validateSaveEnvelope(JSON.parse(serialized),game_version);lifeSaveStorage.setItem(is_on_dev()?dev_save_key:save_key,serialized,()=>transaction.markDurable());}
    catch(e){if(transaction.status==='pending'){transaction.rollback();update_displayed_character_inventory();}throw e;}
}

function nativeOccupationReason() {
    if(!restoringNativeSave&&expansionState.actors.player.facts[P23_LEISURE_RESERVATION])return 'Your paid target-dice round is still settling on the played clock.';
    if(!restoringNativeSave && harvestOwner?.job && !harvestOwner.job.automatic)return "Finish or cancel carcass processing before starting another activity.";
    if(!restoringNativeSave && Object.values(optionalPackState.packs).some(r=>r.active))return 'Return from your optional world before starting native activities.';
    if(!restoringNativeSave && villageTeachingBusy(villageCareer))return 'Finish the agreed teaching minutes before starting another activity.';
    const backlogReasons=backlogNativeActionReasons(expansionState);
    if(backlogReasons.length)return backlogReasons.join(' ');
    if(expansionState.actors.player.facts['original_frontier.travel.remaining']>0)return 'Finish or cancel your remaining native journey in local notes first.';
    if(simulationOccupiesActor(expansionState) || waitingSimulationChoice(expansionState)) return "Finish your living-world work or decision first.";
    if(usesJoinedClock() && ((!ownsSave && !restoringNativeSave) || foundationSaveBlocked || expansionError)) return "Progress is paused until saving is restored. Reload before continuing.";
    if(expansionState.chronicle?.session || nativeLifeEnded()) {
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
    villagePanel?.render(); simulationPanel?.render(); systemsWorkshopPanel?.render(); townPanel?.render();
    pursuitPanel?.render();
    bodyPanel?.render();
    fieldPanel?.render(); promisePanel?.render(); crushSocialPanel?.render(); managementPanel?.render();
    knownRoutesPanel?.render();adventureNotebook?.render();livingGearPanel?.render();combatOptionsPanel?.render();
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
function advanceChroniclePlan(plan, minutes, travel = false, readFrame = null) {
    const nativeContexts = simulationNativeContexts(readFrame); nativeContexts.player.facts = expeditionContext(readFrame).facts;
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
    return {...advanced, p00Travel:travel, native: advanced.native || plan.native, effectDurations: Object.fromEntries(Object.entries(active_effects).map(([id,e]) => [id, Math.max(0,e.duration-(travel && !e.affected_by_travel ? 0 : consumed))])), calendar: Object.fromEntries(["year", "month", "day", "hour", "minute", "day_count"].map(k => [k, calendar[k]])),
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
    persistExpansion(plan); simulationPanel?.render(); systemsWorkshopPanel?.render(); pursuitPanel?.render();skillExpansionPanel?.render();
}
function actSystemsWorkshop(command) {
    if(command.id==='continue') {
        const facts=expansionState.actors.player.facts, id='systems_workshop.settle_'+facts['systems_workshop.draw'];
        return actSimulation({type:'command',id,sequence:command.sequence});
    }
    if(command.id==='apply_model') {
        const facts=expansionState.actors.player.facts;
        const variant=facts['systems_workshop.modelLayout']===facts['systems_workshop.modelBest']?'recommended':'trial';
        return actSimulation({type:'command',id:'systems_workshop.apply_model_'+variant,sequence:command.sequence});
    }
    if(command.id==='cancel') return actSimulation({type:'cancel',sequence:command.sequence});
    return actSimulation({type:command.id==='enroll'?'enroll':'command',id:command.id==='enroll'?undefined:command.id,targetId:expeditionRegistry.simulation.commands.get(command.id)?.targetId,sequence:command.sequence});
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
function featureWaveContext(readFrame){
    if(readFrame)return readFrame.read(featureWaveContext,()=>buildFeatureWaveContext(readFrame));
    return framedRead('featureWaveContext',()=>buildFeatureWaveContext());
}
function buildFeatureWaveContext(readFrame){
    const bookCurrent=paradiseContext(expansionState,referenceGameplayContext(expansionState,expeditionRegistry,nestedLifeContext(expansionState,nestedChainContext(expansionState,nestedContext(expansionState,repositoryAbsorptionContext(expansionState,expeditionRegistry,featurePowerContext(expansionState,tidemarkContext(expansionState,societyContext(expansionState,featureObjectContext(expansionState,expeditionRegistry,campaignContext(readFrame)))))))))));
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
function backlogContext(readFrame){
    const nativeOtherInventories=[];
    for(const [category,owners] of Object.entries(inventories))for(const [id,inventory] of Object.entries(owners))if(category!=='person'||id!=='main_character')
        nativeOtherInventories.push(Object.fromEntries(Object.entries(inventory.getItems()).map(([key,row])=>[key,row.count])));
    return bookNativeContext(expansionState,backlogNativeContext(expansionState,{...featureWaveContext(readFrame),wallNowMs:Date.now(),nativeOtherInventories},
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
function campaignContext(readFrame){
    if(readFrame)return buildCampaignContext(readFrame);
    return framedRead('campaignContext',()=>buildCampaignContext());
}
function buildCampaignContext(readFrame) {
    return {...expeditionContext(readFrame),destinationNative:tidemarkNative.read(expansionState),nestedNative:nestedNative.read(expansionState),paradiseNative:paradiseNative.read(expansionState),molNative:molNative.read(expansionState),proto23Native:proto23Native.read(expansionState),causalStoryNative:causalNative.read(expansionState),...nativeCampaignLocationOwners(),equipment:Object.fromEntries(Object.entries(simulationNativeContexts(readFrame)).filter(([,c])=>c.equipment).map(([id,c])=>[id,c.equipment])),nativeAlive:character.is_alive===true,busy:!!(current_activity || current_game_action || current_combat || current_dialogue || is_sleeping || is_reading || is_in_trade()),
        vitals:Object.fromEntries(Object.entries(simulationNativeContexts(readFrame)).map(([id,c])=>[id,c.vitals]))};
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
function beginIndependentLife(){
    if(!ownsSave||importProbeToken||foundationSaveBlocked||!structuredLifeEnded(expansionState,optionalPackState.structured))throw Error('A writable ended local life is required.');
    const key=is_on_dev()?dev_save_key:save_key;const serialized=activeNativeBytes(key);
    const archived=archiveStructuredLife({storage:{getItem:activeNativeBytes},key,serialized,writeArchive:(k,v)=>writeGuardedSave(localStorage,k,v),validateEnvelope:s=>validateSaveEnvelope(s,game_version)});
    localStorage.setItem(independent_request_key,JSON.stringify({schema:1,key,instanceId:archived.instanceId,archiveKey:archived.archiveKey}));window.location.reload();
}
async function completeIndependentRequest(request){
    const key=is_on_dev()?dev_save_key:save_key;
    try{
        if(!(await saveOwnership)||request.key!==key)throw Error('The destination tab must own this save.');
        const serialized=activeNativeBytes(key),old=JSON.parse(serialized);
        if(old.content_packs?.structured?.instanceId!==request.instanceId||request.archiveKey!==`${key}:ended-life:${request.instanceId}`)throw Error('The active life changed.');
        const nextSerialized=create_save();if(!nextSerialized)throw Error('No supported fresh beginning.');
        await publishIndependentStructuredLife({storage:{getItem:activeNativeBytes,setItem:(k,v)=>writeGuardedSave(localStorage,k,v)},key,serialized,nextSerialized,validateEnvelope:s=>validateSaveEnvelope(s,game_version),preflight:bytes=>preflightImport(JSON.parse(bytes)),publish:bytes=>{if(authorityEnrolled())nativeAuthority.commitPreparedSave(bytes);else lifeSaveStorage.setItem(key,bytes);}});
    }catch(error){console.error('Independent character waits; preserved archive available.',error);
        try{localStorage.setItem(independent_request_key,JSON.stringify({schema:1,error:'Independent character could not begin. The ended life and its archive are preserved.'}));}catch{}
        window.location.reload();await new Promise(()=>{});
    }
    localStorage.removeItem(independent_request_key);window.location.reload();await new Promise(()=>{});
}
async function completeHeirRequest(request) {
    const key = is_on_dev() ? dev_save_key : save_key;
    try {
        if(!(await saveOwnership)) throw new Error("Another game tab owns the save.");
        const previous = JSON.parse(activeNativeBytes(key)), fresh = create_save();
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


const flag_unlock_texts = {
    is_gathering_unlocked: "You have gained the ability to gather new materials! Remember to equip your tools first <br>[Note: equipped tools do not appear in inventory as you will be swapping them very rarely]",
    is_crafting_unlocked: "You have gained the ability to craft items and equipment!",
}

const play_button = document.getElementById("loading_screen_play_button");





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

let pathfinder;

//locations for fast travel


//resting, true -> health regenerates
let is_resting = true;

//sleeping, true -> health regenerates, timer goes up faster
let is_sleeping = false;

 //actually last location where player slept!


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

//e.g. health regen from food

setSelectedStance(stances["normal"]);
let current_stance = stances["normal"];



//consumables that are to be used automatically if their effect runs out


//items to be displayed with "show faves" option in inventory

//stuff from options panel


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

    update_displayed_temperature(getPacingEffects(homePacingContext()));
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

function update_pathing() {
    pathfinder = new Pathfinder();
    pathfinder.fill_connections(locations);
    setTravelTimes({});
    travel_times[current_location.id] = pathfinder.find_shortest_paths(current_location.id);
}

/**
 * Changes current_location value without triggering a full location change
 * @param {String} location_key 
 */
function change_current_location(location_key) {
    setCurrentLocation(locations[location_key]);
}

/**
 * 
 * @param {Object} params
 * @param {Event} params.event
 * @param {Boolean} params.skip_combat used to not call start_combat function, used in loading as it's only called after 'PLAY' button is clicked
 */
function change_location({location_id, event, skip_travel_time = false, do_quest_events = true, skip_combat = false,realm_move=false}) {
    if(!realm_move&&!restoringNativeSave&&current_location?.id===MISTGLASS_LOCATION&&location_id!==MISTGLASS_LOCATION){log_message('Use Return to Village to close this retained visit.','notification');return;}
    if(!realm_move&&!restoringNativeSave&&location_id===MISTGLASS_LOCATION&&current_location?.id!==MISTGLASS_LOCATION)return actMistglass('enter');
    if(!realm_move&&!restoringNativeSave&&current_location?.id===AREA_ID&&location_id===PROTO23_LOCATIONS.dojo)return actTraining('leave');
    if(!realm_move&&!restoringNativeSave&&current_location?.id===PROTO23_LOCATIONS.dojo&&location_id===AREA_ID)return actTraining('enter');
    if(!restoringNativeSave&&!realm_move&&location_id!==current_location?.id)interruptP23NativeWork();
    if(!restoringNativeSave&&location_id!==current_location?.id){const row=expansionState.p23Reading?.current;if(row?.kind==='rest')actStudy('cancelRest');else if(row?.status==='active')actStudy('stopRead');}
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

    if((p23Exposure!==undefined||household!==undefined||p23LivingGear!==undefined||p23CombatOptions!==undefined||p23Salvage!==undefined||expansionState.p23Reading!==undefined||p23Field!==undefined||p23Repeat!==undefined||p23Market!==undefined||p23Leisure!==undefined)&&!realm_move&&!restoringNativeSave&&!skip_travel_time&&previous_location&&location.id!==previous_location.id){
        if(!pathfinder){pathfinder=new Pathfinder();pathfinder.fill_connections(locations);}
        travel_times[previous_location.id] ||= pathfinder.find_shortest_paths(previous_location.id);
        const running=revealFacts()['reveal.run']===true&&character.getTotalSkillLevel('Running')>=1&&!practiceRunReason();
        const minutes=Math.max(1,Math.ceil(travel_times[previous_location.id][location.id]*(running?.8:1)));
        if(!Number.isSafeInteger(minutes))throw Error('No admitted native route connects these places.');
        const plan=advanceChroniclePlan({state:expansionState,external:{money:character.money},gameplay:gameplaySnapshot()},minutes,true);
        if(plan.state.clock-expansionState.clock!==minutes){persistExpansion(plan);log_message('Finish the current local decision before completing this journey.','notification');return;}
        plan.state.sequence++;
        if(plan.state.simulation?.people.player)plan.state.simulation.people.player.location=location.id;
        if(running)plan.native={...plan.native,staminaToFull:Math.min(full_stats.max_stamina,(plan.native?.staminaToFull??full_stats.max_stamina-full_stats.stamina)+2)};
        plan.nativeLocation=location.id;plan.nativeEnterQuest=do_quest_events;
        plan.nativePatch={...plan.nativePatch,'current location':location.id,native_encounter:null};
        if(p23CombatOptions&&['exchange-break','encounter-break'].includes(p23CombatOptions.phase))plan.nativePatch.combatOptions={...p23CombatOptions,phase:'active',breakRequested:false};
        persistExpansion(plan);return;
    }
    if((optionalPackState.structured||expansionState.causalStories||expansionState.proto23Village)&&!realm_move&&!restoringNativeSave&&location.id!==current_location?.id){
        const state=structuredClone(expansionState);state.sequence++;state.simulation.people.player.location=location.id;
        persistExpansion({state,external:{money:character.money},gameplay:gameplaySnapshot(),nativeLocation:location.id,nativeEnterQuest:do_quest_events,nativePatch:{'current location':location.id}});
        return;
    }
    commitLocalDateHeader();
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
    setCurrentLocation(location);

    if(!pathfinder) {
        pathfinder = new Pathfinder();
        pathfinder.fill_connections(locations);
    }

    if(!travel_times[current_location.id]) {
        travel_times[current_location.id] = pathfinder.find_shortest_paths(current_location.id);
    }

    if(previous_location && !skip_travel_time) {
        const running=revealFacts()['reveal.run']===true && character.getTotalSkillLevel('Running')>=1 && !practiceRunReason();
        if(running)use_stamina({stamina_to_use:2});
        progress_time({value: Math.max(1,Math.ceil(travel_times[previous_location.id][current_location.id]*(running?.8:1))), source: "travel"});
    }

    update_displayed_temperature(getPacingEffects(homePacingContext()));
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
            setLastCombatLocation(current_location.id);
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
    if(deferSimulationRender(refreshCustomization, refreshCustomization)) return;
    if(!customization)return;
    document.documentElement.dataset.effects=customization.profiles?.[customization.active]?.settings?.effects||'full'; // settings pass S3: save-level Effects caps per-browser motion
    applyCustomizationProfile(customization,{season:current_game_time.getSeason(),moduleNodes:{ledger:document.getElementById('work_ledger_panel'),crafting:document.getElementById('crafting_window'),'local-actions':document.getElementById('location_related_div'),vitals:document.getElementById('basic_character_info_div'),preparation:[document.getElementById('character_div'),document.getElementById('proto23_character')],belongings:[document.getElementById('proto23_item_detail'),document.getElementById('inventory_div'),document.getElementById('inventory_combat_switch_selection')],records:document.getElementById('journal_div'),time:document.getElementById('time_and_location'),location:document.getElementById('location_div'),skills:document.getElementById('skills_and_stances_div'),messages:document.getElementById('message_log_div'),notebook:document.getElementById('adventure_notebook'),'status-window':document.getElementById('status_window_panel'),customization:[document.getElementById('customization_host'),document.getElementById('customization_effects_host'),document.getElementById('customization_rules_host')]}});
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
    if(nativeLifeEnded())return 'This life has ended.';
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
    if(!restoringNativeSave&&!p00PublishingActivity&&['scouting','lunar_gathering'].includes(selected_activity))return actTrancheFour(selected_activity==='scouting'?'scout':'gather');
    if(expeditionOccupiesPlayer()) return;
    if(!restoringNativeSave && (!ownsSave || foundationSaveBlocked || importProbeToken))return;
    if(!restoringNativeSave && current_activity)return;
    if(!restoringNativeSave&&!p00PublishingActivity)interruptP23NativeWork();
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
    if(!restoringNativeSave&&!p00PublishingActivity&&['scouting','lunar_gathering'].includes(current_activity.id))return actTrancheFour(current_activity.id==='scouting'?'stopScout':'stopField');
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
    interruptP23NativeWork();
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
            if(authorityOperationBusy||authorityBootError)return;
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
        game_action_interval = engineInterval(runGameActionTick, game_action_period());
    } else {
        update_game_action_progress_bar(1);
        finish_game_action({action_key, conditions_status,dialogue_key: current_dialogue});
    }
}

function runGameActionTick() {
    game_action_tick?.();
}

//the action ticker's period at the current speed
function game_action_period() {
    return 1000 * 0.1 / tickrate;
}

function stop_game_action_interval() {
    clearEngineInterval(game_action_interval);
    game_action_interval = undefined;
    game_action_tick = undefined;
}

//re-arms the running action at the current speed, used for speed changing in dev mode
function rearm_game_action_interval() {
    if(!game_action_tick) {
        return;
    }
    clearEngineInterval(game_action_interval);
    game_action_interval = engineInterval(runGameActionTick, game_action_period());
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
    let dialogue_id;
    if(dialogue_key) {
        const dialogue = NPCRegistry.get(dialogue_key).getDialogueComponent();
        action = dialogue.actions[action_key];
        dialogue_id = dialogue.id;
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
                lock_action({dialogue_key: dialogue_id, location_key: current_location.id, action_key});
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
            current_game_action = null;
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
        // miktaew/yet-another-idle-rpg-dev 200f1ba6: rewards use dialogue IDs, not NPC IDs.
        dialogues[dialogue_key].actions[action_key].setFinished();
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
        const sleeping_heal_ammount = p00SleepingMultiplier()*furnitureRecovery(readFurnitureBonuses(), Math.round(Math.max(full_stats.max_health * 0.04, 5) * (1 + character.getTotalSkillLevel("Sleeping")/skills["Sleeping"].max_level) * (1 + 3*character.getTotalSkillLevel("Regeneration")/skills["Regeneration"].max_level)));
        
        update_health({ammount_to_restore: sleeping_heal_ammount});
    }

    if(full_stats.stamina < full_stats.max_stamina) {
        const sleeping_stamina_ammount = p00SleepingMultiplier()*furnitureRecovery(readFurnitureBonuses(), Math.round(Math.max(full_stats.max_stamina/30, 5) * (1 + character.getTotalSkillLevel("Sleeping")/skills["Sleeping"].max_level)));

        full_stats.stamina += (sleeping_stamina_ammount);
        if(full_stats.stamina > full_stats.max_stamina) {
            full_stats.stamina = full_stats.max_stamina;
        } 
        update_displayed_stamina();
    }
}

function start_sleeping() {
    if(expeditionOccupiesPlayer()) return;
    interruptP23NativeWork();
    start_sleeping_display();
    is_sleeping = true;
    pursuitPanel?.render();

    setLastLocationWithBed(current_location.id);
}

function end_sleeping() {
    if(expansionState.p23Reading?.current?.kind==='rest'&&!restoringNativeSave)return actStudy('cancelRest');
    is_sleeping = false;
    pursuitPanel?.render();
    change_location({location_id: current_location.id, skip_travel_time: true});
    end_activity_animation();
}

function start_reading(book_key) {
    if((is_JSON(book_key)?JSON.parse(book_key).id:book_key)===ANTHOLOGY&&!restoringNativeSave){
        const current=expansionState.p23Reading?.current;
        return actStudy(current?.kind==='read'?(current.status==='paused'?'resumeRead':'stopRead'):'startRead');
    }
    if(expeditionOccupiesPlayer()) return;
    
    interruptP23NativeWork();
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
    if(is_reading===ANTHOLOGY&&!restoringNativeSave)return actStudy('stopRead');
    change_location({location_id: current_location.id, skip_travel_time: true});
    end_activity_animation();
    
    const book_id = is_reading;
    is_reading = null;

    update_displayed_book(book_id);
}

let practicePanel, referenceRender=()=>{}, openingStep=0;
try{const step=Number(localStorage.getItem('yairpg.opening.v1'));if(Number.isInteger(step)&&step>=0&&step<=3)openingStep=step;}catch{/* Session-only presentation if browser storage is unavailable. */}
function revealFacts(){return expansionState.actors.player.facts;}
function recipeLesson(inventory){
    if(restoringNativeSave || !ownsSave || foundationSaveBlocked || importProbeToken)return;
    if(!heldLesson(inventory,revealFacts()['reveal.herbLesson']))return;
    revealFacts()['reveal.herbLesson']=true;
    process_rewards({rewards:{recipes:[{category:'alchemy',subcategory:'items',recipe_id:HERB_LESSON.recipe}]}});
    log_message('Handling twenty Golmoon leaves taught you a preparation. Review it in Learned preparations.','notification');
    update_displayed_crafting_recipes();practicePanel?.render();updateWorkspace();
}
function practiceRunReason({toggle=false}={}){
    if(!ownsSave||foundationSaveBlocked||importProbeToken)return 'Saving is unavailable.';
    if(expansionState.actors.player.worldId!=='base.frontier')return 'Run is practiced for frontier travel.';
    if(current_combat||current_activity||is_reading||is_sleeping||current_dialogue||is_in_trade()||nativeOccupationReason())return 'Finish your current activity before running.';
    if(character.getFullStats().stamina<2 && !(toggle && revealFacts()['reveal.run']===true))return 'Requires 2 stamina for a journey; travel falls back to walking.';
    return '';
}
function do_reading() {
    if(is_reading===ANTHOLOGY)return;
    const book = book_stats[is_reading], before=book.accumulated_time;
    item_templates[is_reading].addProgress();
    update_displayed_book(is_reading);
    // Literacy tracks completed study work, preserving the saved-book XP invariant.
    add_xp_to_skill({skill: skills["Literacy"], xp_to_add: book.literacy_xp_rate*(book.accumulated_time-before)});

    if(item_templates[is_reading].isFinished()) {
        log_message(`Finished the book "${is_reading}"`);
        update_booklist_entry(is_reading, true);
        end_reading();

        character.addBookBonus(book.bonuses);
        character.updateStatsAndDisplay();
        process_rewards({rewards: book.rewards});
        referenceRender();updateWorkspace();
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
    if(!is_from_loading && !restoringNativeSave && rewards.money)revealFacts()['reveal.wallet.'+expansionState.actors.player.worldId]=true;

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

/**
 * 
 * @param {String} npc_id 
 */
function start_dialogue(npc_id) {
    if(expeditionOccupiesPlayer())return;
    interruptP23NativeWork();
    add_to_content_stack({content_type: "dialogue", data: {npc_id: npc_id}});
}

function end_dialogue() {
    current_dialogue = null;
    remove_from_content_stack(content_stack_removal_options.TOP);
}

function reload_normal_location() {
    update_displayed_normal_location(current_location);
    renderTickPanels();
}
function renderExportReward() {
    document.getElementById("save_to_file_button").classList.toggle("export_button_with_reward", Date.now() - last_rewarded_export > config.time_between_export_rewards);
    update_export_button_tooltip(Date.now() - last_rewarded_export, config.time_between_export_rewards);
}
function renderEffectDisplays() {update_displayed_effect_durations(); update_displayed_effects();}
function renderClockPanels() {expeditionPanel?.render(); techniquePanel?.render(); chroniclePanel?.render(); villagePanel?.render(); simulationPanel?.render();}
// Display-only panel refreshes that every tick repeats.
function renderTickPanels() {
    domainRegistry.refresh();trancheFourPanel?.render();furniturePanel?.render();localLifePanel?.render();practicePanel?.render();updateWorkspace();fortControls?.render();pacingPanel?.render();pacingStatusPanel?.render();durabilityPanel?.render();elementalPanel?.render();livingGearPanel?.render();combatOptionsPanel?.render();householdPanel?.render();
}

/**
 * 
 * @param {String} textline_key 
 */
function start_textline(textline_key){
    if(!restoringNativeSave&&expeditionOccupiesPlayer())return;
    if(current_dialogue==='villageElder'&&textline_key==='p23 moon bed')discoverP23MoonBed();
    const dialogue = NPCRegistry.get(current_dialogue).getDialogueComponent();
    const textline = dialogue.textlines[textline_key];

    process_rewards({rewards: textline.rewards, source_type: "textline", inform_textline: false, source_name: current_dialogue})

    updateP23MoonConversation();
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
    if(expansionState.chronicle?.session || nativeLifeEnded()) return;
    if(is_temporary) {
        if(!stances[stance_id]) {
            throw new Error(`No such stance as "${stance_id}"`);
        }
        if(!stances[stance_id].isUnlocked()) {
            throw new Error(`Stance "${stance_id}" is not yet unlocked!`);
        }

    } else {
        setSelectedStance(stances[stance_id]);
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
            const e=current_location.id===AREA_ID?trainingEnemy(p23EncounterProfile,Enemy,row):new Enemy({...enemy_templates[row.template],stats:{...row.stats}});
            e.init();Object.assign(e.getFullStats(),row.full);e.is_alive=row.alive;
            if(row.harvestDamage)e.harvestDamage=structuredClone(row.harvestDamage);
            e.rngKey=row.key;e.encounterKey=savedEncounter.key;e.templateKey=row.template;return e;
        });
    }
    if(current_location.id===AREA_ID&&!savedEncounter&&!enemies)throw Error('Restore the durably admitted native training encounter.');
    enemies ||= current_location.get_next_enemies();
    if(!savedEncounter&&p23CombatOptions?.phase==='escaped')p23CombatOptions={...p23CombatOptions,phase:'active'};

    current_combat = new Combat({attackers: [character], defenders: enemies, savedEncounter,encounterProfile:current_location.id===AREA_ID?{id:PROFILE_ID,dropChanceModifier:1}:undefined,encounterHooks:current_location.id===AREA_ID?trainingHooks():undefined,nativeExchangeHost:runP23CombatExchange,combatOptions:p23CombatOptions===undefined?undefined:combatRuntime(),nextCombatEvent:()=>{const n=current_combat.combatOptions.snapshot().lastEvent;if(n>=Number.MAX_SAFE_INTEGER)throw Error('Combat event cursor exhausted.');return n+1;}});
    // A durable technique observation can occur after the last kill but before
    // the zone clear. Resume that boundary without awarding the kill twice.
    if(savedEncounter && p23CombatOptions&&['exchange-break','encounter-break'].includes(p23CombatOptions.phase)){current_combat.showPausedCombatOptions();combatOptionsPanel?.render();return;}
    if(savedEncounter && !enemies.some(e=>e.is_alive)) {finish_combat_round(false);return;}
    current_combat.start();
}

function tacticItem(id){return Object.entries(character.getItems()).find(([key,row])=>{if(row.item.id!==id||row.count<1)return false;try{assertNativeItemDisposition(expansionState,key);assertNativeItemDisposition(expansionState,canonicalDurabilityKey(key));return true;}catch{return false;}});}
function combatRuntime(state=p23CombatOptions){return createCombatOptions({state,host:{
    preflight:({tactic,itemId,context})=>workLedgerCanWrite()&&character.is_alive&&nativeActionReasons(expansionState).length===0&&!!tacticItem(itemId)&&
        (context.training?current_location?.tags.safe_zone&&!current_combat:tactic==='lure'?current_location?.id==='Village'&&!current_combat&&locations['Infested field'].isUnlocked():
        !!current_combat&&!current_combat.is_special_combat&&context.targets?.some(t=>t.is_alive)&&(tactic!=='smoke'||!!current_location.parent_location?.tags.safe_zone)),
    consumeItem:({itemId})=>{const row=tacticItem(itemId);if(!row)return false;character.removeFromInventory([{item_key:row[0],count:1}]);return true;},
    escape:()=>{p23EscapeDestination=current_location.parent_location.id;},
    offerEncounter:()=>{const facts=expansionState.actors.player.facts,n=facts['p23.tactics.lureOffers']||0;if(n>=Number.MAX_SAFE_INTEGER)throw Error('Outing cursor exhausted.');facts['p23.tactics.lureOffers']=n+1;},
    trainThrow:()=>add_xp_to_skill({skill:skills.Throwing,xp_to_add:1})
}});}
function tacticsFrame(){
    const state=current_combat?.combatOptions?.snapshot()||p23CombatOptions;
    const actions=[];
    if(tacticItem(TACTICS.throw.itemId))actions.push({id:'throw',label:'Throw one stone at next exchange'},{id:'train',label:'Practice throwing · one stone · 1 played minute',disabled:!!current_combat||!current_location?.tags.safe_zone});
    if(tacticItem(TACTICS.smoke.itemId))actions.push({id:'smoke',label:'Smoke escape at next exchange',disabled:!!current_combat&&!current_location.parent_location?.tags.safe_zone});
    if(tacticItem(TACTICS.lure.itemId)&&current_location?.id==='Village')actions.push({id:'lure',label:'Offer a scented field outing · one pouch',disabled:!!current_combat||!locations['Infested field'].isUnlocked()});
    const facts=expansionState.actors.player.facts;
    if(current_location?.id==='Village'&&(facts['p23.tactics.lureOffers']||0)>(facts['p23.tactics.lureClaimed']||0))actions.push({id:'follow',label:'Follow a paid scent to Infested field'});
    if(state||current_combat)actions.push({id:'break',label:state?.breakRequested?'Cancel requested break':'Break after next exchange',disabled:state?.phase&&state.phase!=='active'},{id:'clear',label:'Clear queued tactic'});
    if(state&&['exchange-break','encounter-break'].includes(state.phase))actions.push({id:'resume',label:'Resume native encounter'});
    return {visible:actions.length>0,status:state?`Phase: ${state.phase}; queued: ${state.selected||'ordinary swing'}; break: ${state.breakRequested?'requested':'off'}.`:'Paid items use native combat and custody.',actions,disabled:!workLedgerCanWrite()||!character.is_alive||!!nativeActionReasons(expansionState).length};
}
function actTactic(id){
    if(id==='throw'||id==='smoke')return commitTacticChoice({selected:id});
    if(id==='clear')return commitTacticChoice({selected:null});
    if(id==='break')return commitTacticChoice({breakRequested:!(current_combat?.combatOptions?.snapshot()||p23CombatOptions)?.breakRequested});
    if(!workLedgerCanWrite()||!character.is_alive||nativeActionReasons(expansionState).length)throw Error('This character cannot use tactics now.');
    if(id==='resume'){
        const combat=current_combat,phase=combat?.combatOptions?.snapshot().phase;
        if(!combat||!['exchange-break','encounter-break'].includes(phase))throw Error('Restore the actual paused encounter first.');
        const next={...combat.combatOptions.snapshot(),phase:'active'};persistExpansion({state:structuredClone(expansionState),external:{money:character.money},gameplay:gameplaySnapshot(),nativePatch:{combatOptions:next}});
        if(phase==='encounter-break')finish_combat_round(false);else combat.start();return;
    }
    if(current_combat||current_activity||current_dialogue||current_game_action||is_reading||is_sleeping||is_in_trade()||expeditionOccupiesPlayer())throw Error('Finish current work first.');
    if(id==='follow'){
        const state=structuredClone(expansionState),facts=state.actors.player.facts;
        if(current_location.id!=='Village'||!locations['Infested field'].isUnlocked()||(facts['p23.tactics.lureOffers']||0)<=(facts['p23.tactics.lureClaimed']||0))throw Error('No paid field outing is waiting.');
        facts['p23.tactics.lureClaimed']=(facts['p23.tactics.lureClaimed']||0)+1;
        persistExpansion({state,external:{money:character.money},gameplay:gameplaySnapshot()});change_location({location_id:'Infested field'});return;
    }
    if(!['train','lure'].includes(id))throw Error('Unknown tactic command.');
    if(id==='lure'&&(current_location.id!=='Village'||!locations['Infested field'].isUnlocked()))throw Error('The native field route is unavailable.');
    if(id==='train'&&!current_location.tags.safe_zone)throw Error('Practice from a safe location.');
    const state=structuredClone(expansionState),gameplay=gameplaySnapshot(),itemId=TACTICS[id==='train'?'throw':'lure'].itemId,row=tacticItem(itemId);
    if(!row)throw Error('Acquire one usable paid item first.');
    const runtime=createCombatOptions({state:p23CombatOptions?.phase==='escaped'?{...p23CombatOptions,phase:'active'}:p23CombatOptions,host:{preflight:()=>true,consumeItem:()=>{applyGameplayEffect(gameplay,{type:'item',key:row[0],amount:1},'player',true);return true;},escape:()=>{},offerEncounter:()=>{const f=state.actors.player.facts,n=f['p23.tactics.lureOffers']||0;if(n>=Number.MAX_SAFE_INTEGER)throw Error('Outing cursor exhausted.');f['p23.tactics.lureOffers']=n+1;},trainThrow:()=>applyGameplayEffect(gameplay,{type:'xp',skill:'Throwing',amount:1},'player')}});
    if(runtime.snapshot().lastEvent>=Number.MAX_SAFE_INTEGER)throw Error('Combat event cursor exhausted.');
    const event=runtime.snapshot().lastEvent+1;
    if(!(id==='train'?runtime.trainThrow(event,{}):runtime.lure(event,{})))throw Error('This tactic event is unavailable.');
    const plan=id==='train'?advanceChroniclePlan({state,external:{money:character.money},gameplay},1):{state,external:{money:character.money},gameplay};
    if(id==='train'&&plan.state.clock-state.clock!==1)throw Error('Finish the current local decision before practicing.');
    plan.nativePatch={...plan.nativePatch,combatOptions:runtime.snapshot()};persistExpansion(plan);combatOptionsPanel?.render();
}

function commitTacticChoice({selected,breakRequested}){
    if(!workLedgerCanWrite()||!character.is_alive||nativeActionReasons(expansionState).length)throw Error('This character cannot choose tactics now.');
    const runtime=combatRuntime(current_combat?.combatOptions?.snapshot()||p23CombatOptions);
    if(selected!==undefined)runtime.select(selected);if(breakRequested!==undefined)runtime.requestBreak(breakRequested);
    persistExpansion({state:structuredClone(expansionState),external:{money:character.money},gameplay:gameplaySnapshot(),nativePatch:{combatOptions:runtime.snapshot()}});combatOptionsPanel?.render();
}

function runP23CombatExchange(combat,resolve) {
    if(!workLedgerCanWrite()) {combat.clearAllAttackLoops();return;}
    const checkpoint=combat.strikeCheckpoint(),wear=durability.serialize();
    p23EscapeDestination=null;p23FaintDeparture=null;let result;
    let transaction,scope;
    try {
        validateCombatOptions(combat.combatOptions?.snapshot());if(p23LivingGear!==undefined)createLivingGear(p23LivingGear);
        transaction=beginNativeCraftTransaction({owners:[expansionState,character,character.getItems(),character.getLevelableComponent(),character.getEquipment(),character.getBioComponent(),...combat.defenders,...combat.defenders.map(enemy=>enemy.getLevelableComponent()),...(current_location.id===AREA_ID?[locations[AREA_ID],locations[AREA_ID].getAvailabilityComponent()]:[]),item_log,game_stats,global_flags,availabilities,enemy_killcount,favourite_consumables,favourite_items,favourite_locations,
            ...Object.values(skills).map(skill=>skill.getAvailabilityComponent()),which_skills_affect_skill,active_effects,...nativeCraftQuestOwners(quests,active_quests)],
            bindings:[{get:()=>harvestOwner,set:v=>{setHarvestOwner(v);}},{get:()=>p23Growth,set:v=>{p23Growth=v;}},{get:()=>p23GrowthEarned,set:v=>{p23GrowthEarned=v;}},{get:()=>p23EncounterProfile,set:v=>{p23EncounterProfile=v;}},{get:()=>p23EncounterReceipt,set:v=>{p23EncounterReceipt=v;}},{get:()=>pendingNativeEncounter,set:v=>{pendingNativeEncounter=v;}},{get:()=>p23DropObservations,set:v=>{p23DropObservations=v;}},{get:()=>expansionState,set:v=>{expansionState=v;}},{get:()=>p23LivingGear,set:v=>{p23LivingGear=v;}},{get:()=>p23CombatOptions,set:v=>{p23CombatOptions=v;}},{get:()=>current_combat,set:v=>{current_combat=v;}},{get:()=>current_location,set:v=>{setCurrentLocation(v);}},{get:()=>pathfinder,set:v=>{pathfinder=v;}},{get:()=>travel_times,set:v=>{setTravelTimes(v);}}]});
        scope={transaction,messages:[]};nativeP23Scope=scope;nativeCraftScopes.push(scope);
        nativeP23Transaction=transaction;nativeLivingStrike=true;result=resolve();
        if(combat.combatOptions)p23CombatOptions=combat.combatOptions.snapshot();
        if((p23EscapeDestination||p23FaintDeparture)&&current_location.id===AREA_ID&&p23EncounterProfile?.pending)p23EncounterProfile=finishAttempt(p23EncounterProfile,{...trainingContext({allowFainted:true}),abandon:true});
        if(p23EscapeDestination||p23FaintDeparture){
            const destination=p23EscapeDestination||p23FaintDeparture.destination,paths=new Pathfinder();paths.fill_connections(locations);
            const minutes=paths.find_shortest_paths(current_location.id)[destination];
            if(!Number.isFinite(minutes)||minutes<0)throw Error('The native safe return route is unavailable.');
            const plan=advanceChroniclePlan({state:expansionState,external:{money:character.money},gameplay:gameplaySnapshot()},minutes,true);
            if(plan.state.clock-expansionState.clock!==minutes)throw Error('Finish the pending local decision before escaping.');
            plan.nativeLocation=destination;plan.nativePatch={...plan.nativePatch,'current location':destination,native_encounter:null};
            if(p23CombatOptions!==undefined){if(p23FaintDeparture||current_location.id===AREA_ID)p23CombatOptions={...p23CombatOptions,phase:'active',selected:null,breakRequested:false};plan.nativePatch.combatOptions=p23CombatOptions;}
            if(p23FaintDeparture){add_active_effect('Recovering',2);if(p23FaintDeparture.sleep)plan.nativePatch.is_sleeping=true;stageP23Defeat(plan);}
            if(current_location.id===AREA_ID){plan.nativePatch.p23EncounterProfile=p23EncounterProfile;plan.state.simulation.people.player.location=destination;}
            persistExpansion(plan);if(p23FaintDeparture?.sleep)start_sleeping();
        }else{
            const text=create_save();if(!text)throw Error('Native combat save could not be constructed.');
            validateSaveEnvelope(JSON.parse(text),game_version);
            lifeSaveStorage.setItem(is_on_dev()?dev_save_key:save_key,text,()=>transaction.markDurable());
        }
        character.addActiveEffectBonus(active_effects);character.updateStatsAndDisplay();livingGearPanel?.render();combatOptionsPanel?.render();trainingPanel?.render();
        return result;
    }catch(error){
        nativeP23Scope=null;
        if(transaction?.status==='pending'){transaction.rollback();durability.load(wear);combat.restoreStrikeCheckpoint(checkpoint);combat.showPausedCombatOptions();for(const skill of Object.values(skills))update_displayed_skill_bar(skill);}
        combat.clearAllAttackLoops();foundationSaveBlocked=true;
        update_displayed_character_inventory();update_displayed_health();update_displayed_stamina();
        log_message((transaction?.status==='durable'?'Combat was saved; its display failed. Reload the saved encounter. ':'Combat paused because its save failed. Reload the preserved save before continuing. ')+error.message,'message_critical');
        combat.is_ended=true;
    }finally {nativeLivingStrike=false;nativeP23Transaction=null;nativeP23Scope=null;
        if(scope){nativeCraftScopes.pop();if(transaction.status==='durable'){for(const row of scope.bestiary||[]){if(row.existing)update_bestiary_entry_killcount(row.id);else create_new_bestiary_entry(row.id);}for(const args of scope.messages)log_message(...args);for(const event of scope.discoveries||[])nativeDiscoveryFeedback?.publish(event);}}
    }
}

function start_combat() {
    if(current_combat == null) {
        if(expeditionOccupiesPlayer())return;
        interruptP23NativeWork();
        set_new_combat();
        pursuitPanel?.render();
        knownRoutesPanel?.render();adventureNotebook?.render();livingGearPanel?.render();combatOptionsPanel?.render();
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
function kill_target({target_index, fighter_index, is_target_an_attacker, do_quest_events = true, is_special_combat, observedDrops}) {
    //target is the one getting killed, fighter is the one attacking the target
    const target = is_target_an_attacker ? current_combat.attackers[target_index] : current_combat.defenders[target_index];
    const fighter = is_target_an_attacker ? current_combat.defenders[fighter_index] : current_combat.attackers[fighter_index];

    if(target.tags.main_character) {
        console.error("Main character was designed as a target of kill_target()!");

    }
    
    target.is_alive = false;
    if(nativeLivingStrike&&p23LivingGear!==undefined&&!is_special_combat) {
        const owner=livingOwner(),plan=owner.stageKill({sequence:owner.serialize().lastKill+1,killerId:fighter.tags.main_character?'player':fighter.id||'enemy',defeated:{tags:{...target.tags,training:!!target.tags.training||current_location.tags.training===true}},equipment:livingEquipment(),assertDisposition:key=>{assertNativeItemDisposition(expansionState,key);assertNativeItemDisposition(expansionState,canonicalDurabilityKey(key));}});
        plan.preflight();p23LivingGear=plan.nativePatch.p23_living_gear;
    }
    if(fighter.tags.main_character && !is_special_combat)receiveHarvest(target);
    update_displayed_health_of_fighter({fighter_index: target_index, is_attacker: is_target_an_attacker});

    // Enemies are defenders since the combat rewrite (hero attacks), so count kills of defenders.
    if(target.add_to_bestiary && !is_target_an_attacker && !is_special_combat) {
        if(enemy_killcount[target.name]) {
            enemy_killcount[target.name] += 1;
            if(nativeP23Scope)(nativeP23Scope.bestiary ||= []).push({id:target.name,existing:true});else update_bestiary_entry_killcount(target.name);
        } else {
            enemy_killcount[target.name] = 1;
            if(nativeP23Scope)(nativeP23Scope.bestiary ||= []).push({id:target.name,existing:false});else create_new_bestiary_entry(target.name);
        }
    }

    if(fighter.tags.main_character && !is_special_combat && target.add_to_bestiary && Array.isArray(observedDrops)) {
        p23DropObservations=settleObservedDrops(p23DropObservations,{recipientId:'player',creatureId:target.name,killOrdinal:enemy_killcount[target.name],drops:observedDrops.map(row=>({itemId:row.item_id,count:row.count}))}).state;
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
        if(observed && nativeLivingStrike)expansionState=observed;
        if(observed && !nativeLivingStrike) {
            try {
                persistExpansion({state: observed, external: {money: character.money}, gameplay: gameplaySnapshot()});
                log_message(`Observed ${target.name}'s footwork. Read the Technique notebook in Village.`, "notification");
            } catch(error) {log_message("Technique observation could not be saved: " + error.message, "message_critical");}
        }
    }

}

function kill_player({is_combat = true}) {
    if(nativeLivingStrike&&is_combat){
        game_stats.total_deaths++;log_message('%HeroName% has lost consciousness','hero_defeat');
        const sleep=!!(game_options.auto_return_to_bed&&last_location_with_bed&&(!optionalPackState.structured||optionalPackState.structured.locationIds.includes(last_location_with_bed)));
        p23FaintDeparture=current_location.id===AREA_ID?{destination:PROTO23_LOCATIONS.dojo,sleep:false}:{destination:sleep?last_location_with_bed:current_location.parent_location.id,sleep};return;
    }
    if(is_combat) {
        if(p23Leisure){const plan=p23Plan();stageP23Defeat(plan,game_stats.total_deaths+1);persistExpansion(plan);}
        else game_stats.total_deaths++;
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
    const growthNativeBefore=!is_from_loading&&!restoringNativeSave&&p23Growth?readNativeSkillXP(character.getLevelableComponent().skill_progress):null;
    let {leveled, prev_name, new_name, was_hidden, message, unlocks} = character.addXPToSkill({skill, xp_to_add, should_info, use_bonus, add_to_parent, cap_gained_xp, is_from_loading, do_quest_events});

    if(growthNativeBefore)recordGrowthNativeGrant(growthNativeBefore,readNativeSkillXP(character.getLevelableComponent().skill_progress));

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
            practicePanel?.render();updateWorkspace();
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

            if(skill.is_parent || skill.skill_id === "Cooking") {
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
                setTravelTimes({});
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
        setLastCombatLocation(null);
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
            bindings:[{get:()=>p23Growth,set:v=>{p23Growth=v;}},{get:()=>p23GrowthEarned,set:v=>{p23GrowthEarned=v;}},{get:()=>expansionState,set:v=>{expansionState=v;}},{get:()=>fortSupply,set:v=>{fortSupply=v;}},{get:()=>workLedger,set:v=>{workLedger=v;}},
                {get:()=>pathfinder,set:v=>{pathfinder=v;}},{get:()=>travel_times,set:v=>{setTravelTimes(v);}},{get:()=>current_location,set:v=>{setCurrentLocation(v);}}]});
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

                const harvestQuality = category==='butchering' && GRADED_IDS.includes(result_id) ? consumedHarvestQuality(materials,selected_recipe.materials,attempted_crafting_ammount) : null;
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
                    character.addToInventory([{item_key: harvestQuality ? gradedKey(result_id,harvestQuality) : item_templates[result_id].getInventoryKey(), count: final_count}]);
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

// Item bindings use the full native inventory key. Canonical equipment must
// acquire one durable E2 identity before it can be bound.
function knownItemHotkeyRows(){
    const free=workLedgerCanWrite()&&character.is_alive&&!nativeActionReasons(expansionState).length&&!current_combat&&!current_dialogue&&!current_activity&&!current_game_action&&!is_sleeping&&!is_reading&&!is_in_trade();
    const items=Object.entries(character.getItems()).flatMap(([id,row])=>{
        if(row.count<1||!item_log.is_known(row.item.id))return [];
        const equip=row.item.tags.equippable===true,usable=row.item.tags.usable===true;
        if(!usable&&!(equip&&JSON.parse(id).e2_instance))return [];
        let eligible=free;
        try{assertNativeItemDisposition(expansionState,id);assertNativeItemDisposition(expansionState,canonicalDurabilityKey(id));}catch{eligible=false;}
        if(usable&&!equip&&row.item.id!==MIXTURE_ID){const nourishment=prepareFood(getPacingState(),row.item,homePacingContext());eligible=eligible&&(nourishment.restored>0||(row.item.effects||[]).some(effect=>!active_effects[effect.effect]||active_effects[effect.effect].duration<effect.duration));}
        return [{id,label:row.item.getName(),known:true,owned:true,eligible,action:equip?'equip':'use',inputFingerprint:JSON.stringify({id,count:row.count,equipment:readNativeEquipment({player:character}).player,effects:active_effects,pacing:getPacingState(),clock:expansionState.clock,world:expansionState.actors.player.worldId,location:current_location?.id,body:expansionState.actors.player,stats:character.getFullStats(),money:character.money})}];
    });return {canWrite:free,items};
}
function identifyKnownHotkeyCopy(key){
    if(!knownItemHotkeyRows().canWrite)throw Error('Finish current work before identifying a copy.');
    const row=character.getItems()[key];if(!row?.item.tags.equippable||JSON.parse(key).e2_instance)throw Error('Choose an unidentified equipment copy.');
    assertNativeItemDisposition(expansionState,key);const wear=createDurability(durability.serialize()),copy=wear.prepareEquip(row.item,getItemFromKey,{requireIdentity:true}),next=gameplaySnapshot();
    applyGameplayEffect(next,{type:'item',key,amount:1},'player',true);applyGameplayEffect(next,{type:'item',key:copy.getInventoryKey(),amount:1},'player');
    persistExpansion({state:structuredClone(expansionState),gameplay:next,external:{money:character.money},nativePatch:{equipment_durability:wear.serialize()}});
}
function commitKnownItemHotkey(request){
    const row=knownItemHotkeyRows().items.find(row=>row.id===request.id);
    if(!row?.eligible||row.action!==request.action||row.inputFingerprint!==request.inputFingerprint)throw Error('The item or native inputs changed. Review it again.');
    if(request.action==='equip'){
        const item=character.getItems()[request.id].item;
        if(livingGearKind(item)){character_equip_item(request.id);if(character.getEquipment()[item.equip_slot]?.getInventoryKey()!==request.id)throw Error('Equip was not accepted.');return;}
        const equipment=readNativeEquipment({player:character}).player,previous=equipment[item.equip_slot],next=gameplaySnapshot();
        if(previous){assertNativeItemDisposition(expansionState,previous);assertNativeItemDisposition(expansionState,canonicalDurabilityKey(previous));applyGameplayEffect(next,{type:'item',key:previous,amount:1},'player');}
        applyGameplayEffect(next,{type:'item',key:request.id,amount:1},'player',true);
        persistExpansion({state:structuredClone(expansionState),gameplay:next,external:{money:character.money},equipment:{player:{...equipment,[item.equip_slot]:request.id}}});return;
    }
    if(domainRegistry.useItem(request.id))return;
    if(character.getItems()[request.id].item.id===MIXTURE_ID){performMixtureAction({type:'use',key:request.id});return;}
    const wear=durability.serialize(),before=character.getItems()[request.id].count;
    const transaction=beginNativeCraftTransaction({owners:[character,character.getItems(),character.getLevelableComponent(),character.getEquipment(),character.getBioComponent(),item_log,game_stats,active_effects,expansionState,...Object.values(skills).map(skill=>skill.getAvailabilityComponent()),which_skills_affect_skill],bindings:[{get:()=>expansionState,set:v=>{expansionState=v;}},{get:()=>getPacingState(),set:setPacingState}]});
    const scope={transaction,messages:[]};nativeP23Scope=scope;nativeP23Transaction=transaction;nativeCraftScopes.push(scope);
    try{
        use_item(request.id);
        if((character.getItems()[request.id]?.count||0)!==before-1)throw Error('The native use action was not accepted.');
        const serialized=create_save();if(!serialized)throw Error('The item action could not be saved.');validateSaveEnvelope(JSON.parse(serialized),game_version);
        lifeSaveStorage.setItem(is_on_dev()?dev_save_key:save_key,serialized,()=>transaction.markDurable());
    }catch(error){if(transaction.status==='pending'){transaction.rollback();durability.load(wear);character.addActiveEffectBonus(active_effects);character.updateStatsAndDisplay();update_displayed_character_inventory();update_displayed_effects();for(const skill of Object.values(skills))update_displayed_skill_bar(skill);}throw error;}
    finally{nativeP23Scope=null;nativeP23Transaction=null;nativeCraftScopes.pop();if(transaction.status==='durable'){for(const args of scope.messages)log_message(...args);for(const event of scope.discoveries||[])nativeDiscoveryFeedback?.publish(event);}}
}
function installKnownItemHotkeys(){
    const controller=createKnownItemHotkeys({read:knownItemHotkeyRows,reserved:['s'],notice:text=>log_message(text,'notification'),preflight:request=>{const row=knownItemHotkeyRows().items.find(row=>row.id===request.id);return {eligible:row?.eligible===true&&row.action===request.action&&row.inputFingerprint===request.inputFingerprint,command:request};},command:commitKnownItemHotkey});
    const list=mountKnownItemHotkeyList(document.getElementById('character_bio_div'),controller),rows=new WeakMap();
    const refresh=()=>{
        for(const host of document.querySelectorAll('#inventory_content_div [data-character_item]')){
            const key=host.dataset.character_item,row=character.getItems()[key];if(!row||!item_log.is_known(row.item.id))continue;
            const mounted=rows.get(host);if(mounted?.key===key&&mounted.holder.parentNode===host){mounted.binding?.render();continue;}if(mounted){mounted.holder.remove();rows.delete(host);}
            const holder=document.createElement('details');holder.className='known-item-binding';
            const summary=document.createElement('summary');summary.textContent='Hotkey';holder.append(summary);
            holder.addEventListener('click',event=>event.stopPropagation());holder.addEventListener('submit',event=>event.stopPropagation());
            if(row.item.tags.equippable&&!JSON.parse(key).e2_instance){const button=document.createElement('button');button.type='button';button.textContent='Identify this copy for a hotkey';button.addEventListener('click',()=>{try{identifyKnownHotkeyCopy(key);}catch(error){log_message(error.message,'notification');}});holder.append(button);rows.set(host,{key,holder,binding:null});}
            else if(row.item.tags.usable||row.item.tags.equippable)rows.set(host,{key,holder,binding:mountKnownItemBinding(holder,key,controller)});else {rows.set(host,{key,holder,binding:null});continue;}
            host.append(holder);
        }list.render();
    };const observer=new MutationObserver(refresh);observer.observe(document.getElementById('inventory_content_div'),{childList:true,subtree:true});refresh();
}

function character_equip_item(item_key) {
    const reasons = nativeActionReasons(expansionState);
    if(reasons.length) {log_message(reasons.join(" "),"notification");return;}
    try{assertNativeItemDisposition(expansionState,item_key);}catch(error){log_message(error.message,"notification");return;}
    const item=character.getItems()[item_key]?.item;
    if(livingGearKind(item)) {
        if(!workLedgerCanWrite())return;
        try{const plan=stageLivingEquip({state:expansionState,gameplay:gameplaySnapshot(),money:character.money,gear:livingOwner(),wear:durability.serialize(),item,key:item_key,equipment:readNativeEquipment({player:character}).player,getItem:getItemFromKey,assertDisposition:key=>assertNativeItemDisposition(expansionState,key)});persistExpansion(plan);}
        catch(error){log_message(error.message,'notification');return;}
    }else character.equipItemFromInventory(item_key);
    if(current_location.tags.safe_zone) reload_normal_location();
    update_displayed_crafting_recipes();
    update_displayed_stats();
    if(current_combat) {
        if(p23LivingGear!==undefined)current_combat.nativeExchangeHost=runP23CombatExchange;
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
        if(p23LivingGear!==undefined)current_combat.nativeExchangeHost=runP23CombatExchange;
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
            if(p.effect)active_effects['Village mixture exposure']=restoreActiveEffect('Village mixture exposure',p.effect,p.state.products[p.effect.mixtureExposure.product]);
            update_displayed_character_inventory();update_displayed_money();update_displayed_effects();character.addActiveEffectBonus(active_effects);character.updateStatsAndDisplay();
        }});return plan;
}

function use_item(item_key) { 
    const reasons = nativeActionReasons(expansionState);
    if(reasons.length) {log_message(reasons.join(" "),"notification");return;}
    try {assertNativeItemDisposition(expansionState,item_key);} catch(e) {log_message(e.message,"notification");return;}
    if(!character.getItems()[item_key]?.count)return;
    const {id} = JSON.parse(item_key);
    try{if(domainRegistry.useItem(item_key))return;}catch(error){log_message(error.message,'notification');return;}
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
        setPacingState(nourishment.state);pacingPanel?.render();pacingStatusPanel?.render();durabilityPanel?.render();elementalPanel?.render();livingGearPanel?.render();combatOptionsPanel?.render();householdPanel?.render();
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
    if(effect_key==='Bleeding')duration=Math.min(15,old_duration+duration);
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

// Quiet continuation owns no second save slot and uses the same lifetime writer.
function continuationCanWrite() {return ownsSave&&!importProbeToken&&!foundationSaveBlocked&&!is_loading_error&&!authorityBootError&&!authorityBootPending;}
function continuationOccupied() {return !!(current_activity||current_game_action||current_combat||current_dialogue||is_sleeping||is_reading||is_in_trade()||nativeOccupationReason());}
function observeContinuationLearning() {
    if(!continuationState||importProbeToken||authorityOperationBusy||!global_flags.is_hero_created)return;
    const skill_xp=Object.fromEntries(Object.entries(character.getLevelableComponent().skill_progress).map(([id,p])=>[id,p.total_xp]));
    observeContinuation({'current time':current_game_time,continuation:continuationState,life_record:lifeRecord,levels:{person:{main_character:{skill_xp}}}},
        {canStudy:continuationCanWrite()&&!continuationOccupied()&&!continuationState.arrivalPaused&&character.getBio().race==='human'&&character.getBio().age==='adult',knownSkills:Object.keys(skill_xp).filter(id=>skills[id]&&nativeSkillDiscovery(skills[id],character))});
}
function readContinuationUI() {
    const partial={continuation:continuationState,expansion:expansionState,content_packs:optionalPackState,character:{bio:character.getBio()},'current time':current_game_time};
    return {...continuationView(partial),created:!!global_flags.is_hero_created,legacy:hasLoadedNativeSave,
        canWrite:continuationCanWrite()&&!authorityOperationBusy,busy:continuationOccupied()};
}
function publishContinuation(next) {
    validateSaveEnvelope(next,game_version);
    if(!continuationCanWrite())throw Error('The save is not writable. Your life is kept.');
    const bytes=JSON.stringify(next);
    if(authorityEnrolled())nativeAuthority.commitPreparedSave(bytes);
    else writeGuardedSave(localStorage,is_on_dev()?dev_save_key:save_key,bytes);
}
const continuationHost=createContinuationHost({
    capture:()=>JSON.parse(create_save()),preflight:preflightImport,publish:publishContinuation,ownsSave:continuationCanWrite,
    revision:()=>activeNativeBytes(is_on_dev()?dev_save_key:save_key),fresh:async()=>JSON.parse(await freshNativeSave()),
    freeze:()=>{const release=suspendEngine();authorityOperationBusy=true;return release;},
    thaw:release=>{authorityOperationBusy=false;release();},
    reload:next=>{
        continuationState=structuredClone(next.continuation);
        const kind=next.continuation.lastTransition.kind;
        if(['study','set','loop','continue'].includes(kind)||kind.startsWith('loop:')) {
            if(kind==='continue'){continuationArrivalRelease?.();continuationArrivalRelease=null;}
            continuationPanel?.render(true);return;
        }
        foundationSaveBlocked=true; // The old runtime must never overwrite a durably switched life.
        window.location.reload();
    }
});
async function commandContinuation(action) {
    if(!continuationCanWrite())throw Error('Use the writable game tab.');
    if(action==='enroll') {
        if(authorityOperationBusy)throw Error('Another transition is being checked.');
        const release=suspendEngine();authorityOperationBusy=true;
        try {const next=beginContinuation(JSON.parse(create_save()),crypto.randomUUID());await preflightImport(next);publishContinuation(next);continuationState=next.continuation;}
        finally {authorityOperationBusy=false;release();}
        return;
    }
    if(action==='study'&&continuationOccupied())throw Error('Finish current work before investigating. Return itself remains available.');
    observeContinuationLearning();
    return continuationHost.command(action,{expectedSequence:continuationState.sequence,token:crypto.randomUUID()});
}
function maybeRepeatContinuation() {
    const c=continuationState;
    if(!c?.loop.enabled||authorityOperationBusy||!continuationCanWrite()||c.arrivalPaused)return;
    // Only a persisted opt-in starts a new cycle. Replaying the same event cannot.
    const t=current_game_time,at=(((t.year*12+t.month)*30+t.day)*24+t.hour)*60+t.minute;
    if(at>=c.loop.nextAt)commandContinuation('cycle').catch(error=>{c.loop.enabled=false;try{publishContinuation(JSON.parse(create_save()));}catch{/* Preserve the authoritative root if storage cannot record the pause. */}log_message('Repeat loop paused: '+error.message,'notification');});
}

function create_save({forExport = false} = {}) {
    try{
        if(!ownsSave) throw new Error("This tab does not own the save. Close the other game tab and reload.");
        if((foundationSaveBlocked && !(forExport && lifeStorageFailure)) || is_loading_error) throw new Error("Saving disabled after a loading error. Preserve the original save and use a compatible build.");
        const save_data = {};
        save_data["game version"] = game_version;
        if(continuationState) {observeContinuationLearning();save_data.continuation=structuredClone(continuationState);}
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
        if(character.long_life_worn!==undefined)save_data.character.long_life_worn=validateWornTitle(character.long_life_worn,character.titles);
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
        domainRegistry.save(save_data);
        save_data.native_encounter = current_location.id===AREA_ID&&!p23EncounterProfile?.pending?null:(current_combat?.snapshot(current_location.id) || pendingNativeEncounter);

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
        if(p23Exposure!==undefined)save_data.p23_exposure=structuredClone(p23Exposure);
        if(household!==undefined)save_data.household=structuredClone(household);
        if(save_data.is_reading===ANTHOLOGY)delete save_data.is_reading;
        if(expansionState.p23Reading?.current?.kind==='rest')delete save_data.is_sleeping;
        if(p23DropObservations!==undefined)save_data.p23_drop_observations=structuredClone(p23DropObservations);
        if(loadedDisplayPreferences!==undefined || localStorage.getItem(DISPLAY_KEY)!==null)save_data.display_preferences=exportDisplayPreferences();
        if(p23EncounterProfile!==undefined)save_data.p23EncounterProfile=readProfileState(p23EncounterProfile);
        if(p23EncounterReceipt!==undefined)save_data.p23EncounterReceipt=structuredClone(p23EncounterReceipt);
        if(p23Salvage!==undefined)save_data.p23_salvage=structuredClone(p23Salvage);
        if(p23Growth!==undefined)save_data.p23_growth_profile=structuredClone(p23Growth);
        if(p23GrowthEarned!==undefined)save_data.p23_growth_earned=structuredClone(p23GrowthEarned);
        if(p23LivingGear!==undefined)save_data.p23_living_gear=structuredClone(p23LivingGear);
        if(p23CombatOptions!==undefined)save_data.combatOptions=current_combat?.combatOptions?.snapshot()||structuredClone(p23CombatOptions);
        save_data.fort_supply=structuredClone(fortSupply);
        save_data.absorb_local_life=structuredClone(localLife);
        if(p23Field!==undefined)save_data.field_familiarity_p07=structuredClone(p23Field);
        if(p23Market!==undefined)save_data.p23_market_life=structuredClone(p23Market);
        if(p23Leisure!==undefined)save_data.p23_leisure_memory=structuredClone(p23Leisure);
        if(p23Repeat!==undefined)save_data.absorb_repeat_search=structuredClone(p23Repeat);
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
        let encoded = encodeSaveFile(serialized);
        try {lifeSaveStorage.setItem(is_on_dev() ? dev_save_key : save_key, serialized, undefined, {force:true});}
        catch(error) {log_message(error.message + " Your exported file can still be kept.", "message_critical"); return encoded;}
        if(authorityEnrolled()){const root=nativeAuthority.read();encoded=encodeSaveFile(JSON.stringify({p23_native_authority_export:1,release:root.release,current:root.current,previous:root.previous}));}
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
let stepperSaves = null;
function save_to_localStorage({key, is_manual}) {
    if(stepperSaves && !is_manual) {stepperSaves.add(key); return;}
    if(importProbeToken || !ownsSave || authorityOperationBusy || authorityBootError || authorityBootPending) return;
    const save = create_save();
    if(save) {
        try {lifeSaveStorage.setItem(key, save, undefined, {force:is_manual===true});}
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

setNativeObservedDropReader(name=>Object.entries(p23DropObservations?.creatures?.[name]?.drops||{}).filter(([id])=>item_log.is_known(id)).map(([id,count])=>({label:item_templates[id].getName(),count})));

//core function for loading
function load(save_data) {
    nativeDiscoveryFeedback?.reset();titlesPanel?.resetFeedback();
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
            continuationState=save_data.continuation?structuredClone(save_data.continuation):null;
            if(!importProbeToken&&continuationState?.arrivalPaused&&!continuationArrivalRelease)continuationArrivalRelease=suspendEngine();
            p23DropObservations=save_data.p23_drop_observations===undefined?undefined:validateDropObservations(save_data.p23_drop_observations);
            loadedDisplayPreferences=save_data.display_preferences;
            setMixtureOwner(save_data.mixtures);
            domainRegistry.load(save_data);
            cheatState=validateCheatState(save_data.cheats??defaultCheatState());
            optionalPackState=validatePackState(save_data.content_packs??emptyPackState());
            localLife=normalizeLocalLife(save_data.absorb_local_life);
            p23Field=Object.hasOwn(save_data,'field_familiarity_p07')?normalizeFieldFamiliarity(save_data.field_familiarity_p07):undefined;
            p23Market=Object.hasOwn(save_data,'p23_market_life')?normalizeMarketLife(save_data.p23_market_life):undefined;
            p23Leisure=Object.hasOwn(save_data,'p23_leisure_memory')?structuredClone(save_data.p23_leisure_memory):undefined;
            p23Repeat=Object.hasOwn(save_data,'absorb_repeat_search')?normalizeRepeatSearch(save_data.absorb_repeat_search):undefined;
            fortSupply=migrateFortSupply(save_data);
            durability.load(save_data.equipment_durability);
            p23EncounterProfile=Object.hasOwn(save_data,'p23EncounterProfile')?readProfileState(save_data.p23EncounterProfile):undefined;
            p23EncounterReceipt=save_data.p23EncounterReceipt===undefined?undefined:structuredClone(save_data.p23EncounterReceipt);
            locations[AREA_ID].getAvailabilityComponent().is_unlocked=p23EncounterProfile!==undefined;
            validateCombatOptions(save_data.combatOptions);p23CombatOptions=save_data.combatOptions===undefined?undefined:structuredClone(save_data.combatOptions);
            p23LivingGear=save_data.p23_living_gear===undefined?undefined:livingOwnerFromSave(save_data);
            p23Salvage=save_data.p23_salvage===undefined?undefined:loadSalvage(save_data.p23_salvage);
            p23Growth=save_data.p23_growth_profile===undefined?undefined:structuredClone(validateGrowthState(save_data.p23_growth_profile));
            p23GrowthEarned=save_data.p23_growth_earned===undefined?undefined:structuredClone(validateGrowthEarned(save_data.p23_growth_earned));
            p23Exposure=validateExposure(save_data.p23_exposure);household=save_data.household===undefined?undefined:structuredClone(save_data.household);
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
            restoreSystemsWorkshopAvailability(save_data);
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
                setLanguage(save_data.language);
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
        character.long_life_worn=validateWornTitle(save_data.character.long_life_worn,character.titles);
        const bio = character.getBioComponent();
        Object.keys(bio).forEach(info => {
            bio[info] = save_data.character?.bio?.[info];
        });

        setLastLocationWithBed(save_data.last_location_with_bed);
        setLastCombatLocation(save_data.last_combat_location);

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
                            item_templates[book].addProgress(save_data.books[book].accumulated_time,{study:false});
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

                        item_templates[book_id].addProgress(save_data.books[book_id].accumulated_time,{study:false});
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
            setSelectedStance(stances[save_data.selected_stance.id] || stances[save_data.selected_stance]);

            change_stance({stance_id: selected_stance.id});
        }

        Object.keys(save_data.character.equipment).forEach(function(key){
            if(save_data.character.equipment[key] != null) {
                const quality_mult = compare_game_version("v0.4.4", save_data["game version"]) == 1?100:1; //x100 if its from before quality rework
                if(save_data.character.equipment[key].inventory_key&&JSON.parse(save_data.character.equipment[key].inventory_key).e2_instance){
                    character._equipItem(getItemFromKey(save_data.character.equipment[key].inventory_key),true);
                }else if(item_templates[save_data.character.equipment[key].id]?.tags.structuredEquipment) {
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
                        if(GRADED_IDS.includes(parsedKey.id)&&parsedKey.quality!=null){getItemFromKey(key);item_list.push({item_key:key,count:saved_inventory[key].count});return;}
                        if(parsedKey.id===MIXTURE_ID){const item=getItemFromKey(key);item_list.push({item_key:item.getInventoryKey(),count:saved_inventory[key].count});return;}
                        if(domainRegistry.ownsItemKey(key)){getItemFromKey(key);item_list.push({item_key:key,count:saved_inventory[key].count});return;}
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
                setLastLocationWithBed("Lake beach");
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
                active_effects[effect] = restoreActiveEffect(effect,save_data.active_effects[effect],save_data.mixtures?.products?.[save_data.active_effects[effect].mixtureExposure?.product]);
            });
            character.addActiveEffectBonus(active_effects);
        }

        set_loading_screen_progress("Hiding from the vet");

        publishGrowthProjection(growthFlatSource(p23Growth,growthIdentity()),false);
        if(structuredLifeEnded(expansionState,optionalPackState.structured)){full_stats.health=0;character.is_alive=false;}
        else if(save_data.character.hp_to_full == null || save_data.character.hp_to_full >= full_stats.max_health) {
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

        updateP23MoonConversation();
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
        if(save_data.is_reading && save_data.is_reading!==ANTHOLOGY) {
            start_reading(save_data.is_reading);
        }

        if(any_warnings) {
            set_loading_screen_warnings_warning();
        }

        update_displayed_time();
        set_loading_screen_versions(save_data["game version"]);
        if(any_warnings) foundationSaveBlocked = true;
        if(!any_warnings && !importProbeToken && save_data.display_preferences!==undefined) {
            try {adoptDisplayPreferences(save_data.display_preferences);} catch(error) {log_message('Display preferences could not be adopted. '+error.message,'notification');}
        }
        localDateLog.reset();
        localDateLog.commit(readLocalCalendar());
        return {warnings: any_warnings};
    } catch(error) {
        foundationSaveBlocked = true;
        set_loading_screen_versions(save_data["game version"]);
        throw error;
    } finally {
        loadingReputationTotals = null;
        restoringNativeSave = false;
        if(p23LivingGear!==undefined){character.addActiveEffectBonus(active_effects);character.updateStatsAndDisplay();}
        trancheFourPanel?.render();domainRegistry.refresh();
        awakenOptionalStart();
    }
} 

/**
 * called from index.html;
 * loads game from file by resetting everything that needs to be reset and then calling main loading method with same parameter;
 * @param {String} save_string 
 */
async function load_from_file(save_string) {
    if(importProbeToken||importInProgress||authorityOperationBusy)return;
    if(!ownsSave){log_message('Import blocked: this tab is read-only.','message_critical');return;}
    importInProgress=true;
    let releaseImport;
    try {
        const enrolled=authorityEnrolled();
        if(enrolled)assertAuthorityIdle();
        releaseImport=suspendEngine();authorityOperationBusy=true;
        const raw=save_string.trim(),prefix='YAIR-UTF8-1:';
        let candidate;
        try{const binary=atob(raw.startsWith(prefix)?raw.slice(prefix.length):raw);candidate=JSON.parse(raw.startsWith(prefix)?new TextDecoder('utf-8',{fatal:true}).decode(Uint8Array.from(binary,c=>c.charCodeAt(0))):binary);}catch{throw Error('The file is not a valid save.');}
        if(candidate?.p23_native_authority_export!==undefined) {
            if(!authorityEnrolled())throw Error('Explicitly enroll this game before importing an enrolled export. Legacy saves were kept.');
            if(Object.keys(candidate).sort().join(',')!=='current,p23_native_authority_export,previous,release'||candidate.p23_native_authority_export!==1)throw Error('Unsupported enrolled export schema.');
            await nativeAuthority.importAuthority(candidate);
        } else if(authorityEnrolled()) {
            const save=decodeSaveFile(save_string,game_version);await nativeAuthority.importSnapshot(JSON.stringify(save));
        } else {
            await importSaveFile(save_string,{currentVersion:game_version,preflight:preflightImport,storage:lifeSaveStorage,key:is_on_dev()?dev_save_key:save_key});
        }
        foundationSaveBlocked=true;
        window.location.reload(false);
    }catch(error){authorityOperationBusy=false;importInProgress=false;releaseImport?.();log_message('Import rejected. Current save kept. '+error.message,'message_critical');}
}

/**
 * loads the game from localStorage
 * it's called when page is refreshed, so there's no need for it to reset anything
 */
function load_from_localstorage() {
    try{
        if(is_on_dev()) {
            if(activeNativeBytes(dev_save_key)){
                load(JSON.parse(activeNativeBytes(dev_save_key)));
                log_message("Loaded dev save. If you want to use save from live version, import it through options panel or manually");
            } else {
                //no need to check if it should import or do a fresh start (in case it's a result of hard reset), as that's already handled elsewhere
                load(JSON.parse(activeNativeBytes(save_key)));
                log_message("Dev save was not found. Loaded live version save.");
            }
        } else {
            load(JSON.parse(activeNativeBytes(save_key)));
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
    const serialized = activeNativeBytes(sourceKey);
    if(!serialized) {log_message("There is no saved progress to restore.", "notification"); return;}
    try {await load_from_file(encodeSaveFile(serialized));}
    catch(error) {log_message("Restore rejected. Current save kept. " + error.message, "message_critical");}
}

function load_backup() {if(authorityEnrolled())return authorityOperation(()=>nativeAuthority.undo(),{reload:true}).catch(e=>log_message(e.message,'message_critical'));return restoreStoredSave(is_on_dev() ? dev_backup_key : backup_key);}
function load_other_release_save() {return restoreStoredSave(is_on_dev() ? save_key : dev_save_key);}

async function hard_reset() {
    if(!ownsSave) {log_message("This tab is read-only. Close the other game tab and reload.", "message_critical"); return;}
    let confirmation = prompt(`This will erase all your progress and you will have to start from the very beginning. If you are sure this is what you want, type "reset" below`);

    if(confirmation === "reset" || confirmation === `"reset"`) {
        if(authorityEnrolled()) {
            try{await authorityOperation(async()=>nativeAuthority.resetSnapshot(await freshNativeSave()),{reload:true});}
            catch(error){log_message('Reset rejected; current authority kept. '+error.message,'message_critical');}
            return false;
        }
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
    if(authorityOperationBusy||authorityBootError)return 0;
    if(nativeLifeEnded())return 0;
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
    if(backlogNativeClockPaused(expansionState)){backlogPanel?.render();replacementRecognitionPanel?.render();backlogOpeningPanel?.render();knownRoutesPanel?.render();adventureNotebook?.render();livingGearPanel?.render();combatOptionsPanel?.render();return 0;}
    const was_night = is_night(current_game_time);
    let minutes = time_in_minutes ?? (expansionState.p23Reading?.current?.kind==='rest' ? longRestClockRequest(expansionState.p23Reading,studyContext()) : is_sleeping ? config.time_speedup_when_sleeping : 1);
    if(p23Leisure?.pending&&p23Leisure.pending.due>expansionState.clock)minutes=Math.min(minutes,p23Leisure.pending.due-expansionState.clock);
    if(p23Leisure?.pending&&p23Leisure.pending.due<=expansionState.clock){try{persistExpansion(p23Plan());}catch(error){log_message(error.message,'notification');return 0;}}
    minutes=mistglassNextBoundary(expansionState,expansionState.clock+minutes)-expansionState.clock;
    if(minutes === 0) return 0;
    if(usesJoinedClock()) {
        if(importProbeToken || !ownsSave || expansionError || foundationSaveBlocked || is_loading_error || nativeLifeEnded()) return 0;
        if(expansionState.simulation?.sessions.player || waitingSimulationChoice(expansionState)) {frontierCampaignPanel?.render();featureExpansionPanel?.render();foundationInteractionPanel?.render();causalStoryPanel?.render();simulationPanel?.render(); pursuitPanel?.render(); fieldPanel?.render(); promisePanel?.render(); crushSocialPanel?.render(); managementPanel?.render(); knownRoutesPanel?.render();adventureNotebook?.render();livingGearPanel?.render();combatOptionsPanel?.render(); return 0;}
        if(expansionState.chronicle?.session?.policy === "manual") {chroniclePanel?.render(); return 0;}
        try {
            const response = expansionState.chronicle && automaticResponse(expansionState.chronicle);
            const pendingJourney=expansionState.actors.player.facts['original_frontier.travel.remaining']>0;
            const readFrame=stepperRenderSuppressed&&!response&&!pendingJourney?createPlanningReadFrame():null;
            const plan = response ? makeChroniclePlan({type: "respond", action: response}) : pendingJourney ? advanceFrontierJourney({state:expansionState,external:{money:character.money},gameplay:gameplaySnapshot()},minutes) : advanceChroniclePlan({state: expansionState, external: {money: character.money}, gameplay: gameplaySnapshot()}, minutes, source === "travel",readFrame);
            const consumed = plan.state.clock - expansionState.clock;
            persistExpansion(plan,{}, {},readFrame);
            domainRegistry.tick(consumed);
            if(was_night !== is_night(current_game_time)) character.updateStatsAndDisplay();
            if(nativeLifeEnded()) {if(current_combat) end_combat(); character.is_alive = false;}
            if(!deferWhileHidden(renderClockPanels,renderClockPanels))renderClockPanels();
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
    if(importProbeToken||!ownsSave||foundationSaveBlocked||expansionError||is_loading_error)return 0;
    const readFrame=stepperRenderSuppressed?createPlanningReadFrame():null;
    try{persistExpansion(advanceChroniclePlan({state:expansionState,external:{money:character.money},gameplay:gameplaySnapshot()},minutes,source==='travel',readFrame),{}, {},readFrame);}
    catch(error){console.error('Native clock paused:',error);log_message(error.message,'notification');return 0;}
    refreshCustomization();

    //character.updateStatsAndDisplay(); //done every second, probably only used for day-night cycle at this point
    const daynight_change = was_night !== is_night(current_game_time);
    if(daynight_change) {
        character.updateStatsAndDisplay();
    }
    
    update_displayed_time();
    awakenOptionalStart();
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
    engineTimeout(() => {
        if(authorityOperationBusy||authorityBootError){start_date=engineNow();update();return;}
        end_date = engineNow();
        //basically when previous tick ends, used for timer smoothing

        time_variance_accumulator += ((end_date - start_date) - 1000/tickrate);
        //duration of previous tick, minus time it was supposed to take
        //important to keep it between setting end_date and start_date, so they are 2 completely separate values

        start_date = engineNow();
        /*
        basically when current tick starts
        so before this assignment, start_date is when previous tick started
        and end_date is when previous_tick ended
        */

        simulateTick();
        update();
    }, stepping() ? 1000/tickrate : 1000/tickrate - time_adjustment, 'tick');
}

function simulateTick() {
        let were_stats_updated = false;
        const prev_day = current_game_time.day_count;
        const advancedMinutes = update_timer();
        if(!deferWhileHidden(renderTickPanels,renderTickPanels))renderTickPanels();
        if(!advancedMinutes || nativeLifeEnded()) {awakenOptionalStart(); return;}

        if(!deferWhileHidden(renderExportReward,renderExportReward))renderExportReward();

        const curr_day = current_game_time.day_count;
        if(curr_day > prev_day) {
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
        if(!deferWhileHidden(renderEffectDisplays,renderEffectDisplays))renderEffectDisplays();

        const optionalWeather=getPacingEffects(homePacingContext());
        const new_temperature = get_current_temperature_smoothed()+basePacingEffects(homePacingContext()).temperatureOffset;

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

        }
        // Weather duration and XP consequence change even at a stable temperature.
        const showTemperature=()=>update_displayed_temperature(optionalWeather);
        if(!deferWhileHidden(update_displayed_temperature,showTemperature))showTemperature();
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
            if(current_activity && !['scouting','lunar_gathering'].includes(current_activity.id)) { // native P07 has its own saved no-XP settlement
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
            if(authorityEnrolled()){backup_counter=0;try{if(!current_combat&&!current_activity&&!current_game_action&&!nativeOccupationReason())authorityOperation(()=>nativeAuthority.capture(create_save())).catch(e=>log_message(e.message,'message_critical'));}catch(error){log_message(error.message,'message_critical');}return;}
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

    //uses time_adjustment based on time_variance_accumulator for more precise overall stabilization
    //(instead of only stabilizing relative to previous tick, it stabilizes relative to sum of deviations)
    //probably completely unnecessary lol, but hey, it sounds cool
}


let stepperRenderSuppressed=false;
// One stepper batch: autosaves coalesce to one per key and, unless render is set,
// panel renders coalesce to one flush. Returns the close function.
function openStepperBatch(render) {
    if(stepperSaves) throw new Error('Cannot nest advanceTicks.');
    const restore = [];
    stepperSaves = new Set();
    if(!render) {
        beginSimulationRenderBatch();
        stepperRenderSuppressed=true;
        for(const panel of [adventureNotebook,backlogOpeningPanel,backlogPanel,bodyPanel,causalStoryPanel,characterBio,chroniclePanel,combatOptionsPanel,crushSocialPanel,durabilityPanel,elementalPanel,exchangePanel,expansionQuests,expeditionPanel,featureExpansionPanel,fieldPanel,fortControls,foundationInteractionPanel,frontierCampaignPanel,furniturePanel,householdPanel,growthPanel,harvestPanel,mistglassPanel,trainingPanel,trancheFourPanel,inkPanel,knownRoutesPanel,lifeRecordPanel,livingGearPanel,localLifePanel,managementPanel,nestedInkPanels,observationPanel,optionalPackPanel,originalFrontierPanel,p23ExposurePanel,pacingPanel,pacingStatusPanel,partyPanel,pocketRealmPanel,practicePanel,promisePanel,pursuitPanel,readingSalvagePanel,replacementRecognitionPanel,repositoryPanel,simulationPanel,skillExpansionPanel,statusWindow,structuredPanel,systemsWorkshopPanel,techniquePanel,titlesPanel,townPanel,villageCareerControls,villageLivesPanel,villagePanel,workLedgerPanel,worldEventFeed]) {
            if(!panel?.render) continue;
            const original = panel.render;
            panel.render = function(...args) {
                if(!deferSimulationRender(panel, () => original.apply(panel,args))) return original.apply(panel,args);
            };
            restore.push(() => {panel.render = original;});
        }
    }
    return () => {
        const saves = stepperSaves; stepperSaves = null;
        for(const key of saves) {
            const savedAt = save_to_localStorage({key});
            if(savedAt && (key === backup_key || key === dev_backup_key)) update_backup_load_button(savedAt);
        }
        stepperRenderSuppressed=false;
        for(const reset of restore) reset();
        if(!render) endSimulationRenderBatch(expansionState);
        return saves.size;
    };
}
const checkTickCount = n => {
    if(!testHooksEnabled) throw new Error('Test hooks are disabled.');
    if(!Number.isSafeInteger(n) || n < 0 || n > 1000000) throw new RangeError('Ticks must be an integer from 0 to 1000000.');
};
/** Advance the actual engine timers synchronously; never a second simulation. */
function advanceTicks(n, {render = false} = {}) {
    checkTickCount(n);
    if(fastForwarding) throw new Error('Cannot nest advanceTicks.');
    if(n === 0) return {ticks:0, callbacks:0, autosaves:0};
    const close = openStepperBatch(render);
    let result;
    try {result = runEngineTicks(n); return result;}
    finally {
        const autosaves = close();
        if(result) result.autosaves = autosaves;
    }
}
// RT8: the same stepper, one tick at a time, yielding between slices so no task runs
// long. The engine stays paused across yields, so live timers never interleave and the
// result is byte-identical to advanceTicks(n) or n single ticks. Input during a
// forward is not blocked; it interleaves like input between single ticks.
let fastForwarding = null;
const yieldToBrowser = () => globalThis.scheduler?.yield ? globalThis.scheduler.yield() : new Promise(resolve => {
    const channel = new MessageChannel(); channel.port1.onmessage = () => {channel.port1.close(); resolve();}; channel.port2.postMessage(0);
});
function fastForward(n, {sliceMs = 30, onProgress} = {}) {
    checkTickCount(n);
    if(fastForwarding || stepperSaves) return Promise.reject(new Error('Cannot nest fastForward.'));
    if(!Number.isFinite(sliceMs) || sliceMs <= 0) return Promise.reject(new RangeError('sliceMs must be positive.'));
    const run = async () => {
        // Outside a run, stepping() is true exactly while the engine is paused.
        const started = performance.now(), wasPaused = stepping();
        let ticks = 0, callbacks = 0, slices = 0, maxSliceMs = 0, autosaves = 0, close = null;
        pauseEngine();
        try {
            close = openStepperBatch(false);
            while(ticks < n) {
                // Yield first, so not even the first slice joins the caller's task.
                await yieldToBrowser();
                const sliceStart = performance.now();
                let count = 0, elapsed = 0;
                // Stop before a tick that would likely cross the slice budget.
                do {callbacks += runEngineTicks(1).callbacks; ticks++; count++; elapsed = performance.now() - sliceStart;}
                while(ticks < n && elapsed + elapsed / count < sliceMs);
                slices++; maxSliceMs = Math.max(maxSliceMs, elapsed);
                onProgress?.({ticks, total: n});
            }
        } finally {
            try {if(close) autosaves = close();}
            finally {if(!wasPaused) resumeEngine(); fastForwarding = null;}
        }
        return {ticks, callbacks, autosaves, slices, maxSliceMs: +maxSliceMs.toFixed(1), wallMs: Math.round(performance.now() - started)};
    };
    return fastForwarding = run();
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
        home_minutes:localLife.homeMinutes,
        items_bought:localLife.itemsBought,
    };
}

/**
 * Grants titles whose counters are reached and reapplies the derived bonus.
 * silent: back-fill on load, one summary line instead of one per title.
 */
function refresh_titles({silent = false} = {}) {
    if(!silent){
        const plan=stageTitleRecognition({state:structuredClone(expansionState),external:{money:character.money},gameplay:gameplaySnapshot()},{titles:character.titles,counters:readTitleCounters(),calendar:current_game_time});
        if(plan.p00EarnedTitles?.length)persistExpansion(plan);
        return plan.p00EarnedTitles || [];
    }
    const earned = grantEarnedTitles(character.titles, readTitleCounters(), titleCalendarMinute(current_game_time));
    character.setTitleBonus(longLifeTitleBonuses(character.titles,character.long_life_worn));
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
    if(!silent)titlesPanel?.announce(earned);
    return earned;
}

function run() {
    if(importProbeToken) return;
    if(nativeLifeEnded()) {character.is_alive = false; chroniclePanel?.render(true); return;}
    if(typeof current_location === "undefined") {
        change_location({location_id: "Village", skip_travel_time: true});
    } 

    if(current_location.tags.combat_zone) {
        start_combat();
    }
    
    update_displayed_health();
    fill_character_bio();
        
    if(!continuationState&&!hasLoadedNativeSave&&global_flags.is_hero_created) {
        try {const first=beginContinuation(JSON.parse(create_save()),crypto.randomUUID());publishContinuation(first);continuationState=first.continuation;}
        catch(error){log_message('Connection baseline could not be established: '+error.message,'notification');}
    }
    start_date = engineNow();
    update();
    // RT8 test hook: replay ticks away (one game minute each while awake) through the sliced
    // stepper. No player offline policy exists yet; who gets time away stays a design decision.
    const catchUp = testHooksEnabled ? Number(new URLSearchParams(location.search).get('catch_up_ticks')) : 0;
    if(Number.isSafeInteger(catchUp) && catchUp > 0) {
        window.catchUpResult = fastForward(catchUp).catch(error => {console.error('Catch-up stopped:', error); throw error;});
    }

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

window.start_trade = (...args) => {const row=expansionState.p23Reading?.current;if(row?.kind==='rest')actStudy('cancelRest');else if(row?.status==='active')actStudy('stopRead');if(!expeditionOccupiesPlayer()) return start_trade(...args);};
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
    if(authorityBootPending)return owned;
    if(!owned) expansionError = "This tab is read-only. Close the other game tab and reload to save progress.";
    expeditionPanel?.render(true);
    techniquePanel?.render(true);
    chroniclePanel?.render(true);
    villagePanel?.render(true);
    simulationPanel?.render(); pursuitPanel?.render(); fieldPanel?.render(); promisePanel?.render(); crushSocialPanel?.render(); managementPanel?.render(); bodyPanel?.render(); townPanel?.render();
    frontierCampaignPanel?.render();partyPanel?.render();
    featureExpansionPanel?.render();foundationInteractionPanel?.render();
    knownRoutesPanel?.render();adventureNotebook?.render();livingGearPanel?.render();combatOptionsPanel?.render(); worldEventFeed?.render();
    trancheFourPanel?.render();trainingPanel?.render();growthPanel?.render();mistglassPanel?.render();readingSalvagePanel?.render();titlesPanel?.render();updateWorkspace();domainRegistry.refresh();
    awakenOptionalStart();
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
configureCraftingDomain({read:()=>({inventory:Object.fromEntries(Object.entries(character.getItems()).map(([k,r])=>[k,r.count])),clock:calendarMinutes(current_game_time),world:expansionState.actors.player.worldId,location:current_location?.id,blocked:harvestBlockReason(),root:streamSeed(expansionState,STREAMS.craft,'crafting.frontier@1')}),
    itemOwners:()=>[character,character.getItems(),item_log,favourite_items,favourite_consumables],assertSpend:key=>assertNativeItemDisposition(expansionState,key),
    addItem:(key,count)=>character.addToInventory([{item_key:key,count}]),removeItem:(key,count)=>character.removeFromInventory([{item_key:key,item_count:count}]),
    persist:markDurable=>{const save=create_save();if(!save)throw Error('The item action could not be saved.');validateSaveEnvelope(JSON.parse(save),game_version);lifeSaveStorage.setItem(is_on_dev()?dev_save_key:save_key,save,markDurable);},
    refresh:()=>{character.addActiveEffectBonus(active_effects);character.updateStatsAndDisplay();update_displayed_character_inventory();update_displayed_effects();update_displayed_crafting_recipes();}});
configureResourceDomains({harvestContext,harvestWritable,harvestReady,harvestAutomaticReady,
    harvestTransaction,grantHarvest,logMessage:log_message,random:key=>gameKeyedRandom(STREAMS.loot,key),
    habitatContext,commitHabitatPlan,clock:()=>calendarMinutes(current_game_time),
    harvestContainer:()=>document.getElementById('location_actions_div'),careContainer:projectsHome,
    readInspector:()=>({harvest:harvestOwner,mixtures:getMixtureOwner(),ruleTrace:getMixtureOwner()?.ruleLaws?.receipts?.[getMixtureOwner()?.ruleLaws?.lastReceipt]?.trace,expansion:expansionState,inventory:character.getItems(),clock:calendarMinutes(current_game_time),handling:{context:harvestContext(),ready:harvestReady(),automaticReady:harvestWritable()&&harvestAutomaticReady()}}),
    developer:()=>is_on_dev()||new URLSearchParams(location.search).get('harvest-inspector')==='1'});
domainRegistry.initialize();
bindNativeView({readLocalWeatherWords, get_current_book, get_context, canConsumeNativeCraftingItem, nativeWorkLedgerChance, nativeWorkLedgerQuality, readVillageLedgerSentence, get_current_combat:()=>current_combat});
bindTranslationReaders(() => character.getBioComponent(), () => character.name);
await translationManager.init(language);
translationManager.translateUI(language);

// Optional authority boot never changes absent-key selection.
if(!importProbeToken&&authorityEnrolled()) {
    try{await nativeAuthority.boot();authorityBootPending=false;}catch(error){authorityBootError=error;foundationSaveBlocked=true;is_loading_error=true;showAuthorityRecovery(error);}
}
//check if there's an existing save file, otherwise just do some initial setup
if(authorityBootError){
    // Invalid authority blocks both legacy fallback and fresh initialization.
} else if(importProbeToken&&!freshAuthorityProbe) {
    // Probe uses fresh definitions and never reads another saved character.
} else if(!independentRequest && !heirRequest?.leftovers && (!importProbeToken&&(authorityEnrolled()||!is_on_dev() && save_key in localStorage || is_on_dev() && (dev_save_key in localStorage || !("skip_live_import" in localStorage) && save_key in localStorage )))) {
    load_from_localstorage();
    if(!is_loading_error) refresh_titles({silent: true});
    character.updateStatsAndDisplay();
    update_displayed_xp_bonuses();
} else {
    set_loading_screen_versions();
    commitLocalDateHeader();
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
    if(independentRequest) await completeIndependentRequest(independentRequest);
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

// R21b (Weibao, 2026-10-17): the hero creation panel is retired. A new game starts with a default
// hero (name typed later in the You header); the panel's Optional beginning, the local start probe
// and the backlog opening move to the start screen's Beginning section and apply on PLAY.
const newGameBeginning = !global_flags.is_hero_created ? mountNewGameBeginning({screen: document.getElementById('loading_screen'), panel: document.getElementById('hero_creation_panel')}) : null;
characterCreator.complete_default_hero();
characterCreator.remove_creation_panel();
if(newGameBeginning) {
    const startProbe=createStartProbe(newGameBeginning.host);
    // CH1 capture runs on PLAY, before run() starts the clock.
    play_button.addEventListener('click', () => {
        const start=startProbe?.selected();
        if(start) {
            // Vanilla setup precedes PLAY; reapply before creation starts the clock.
            character.removeFromInventory(Object.entries(character.getItems()).map(([item_key,item])=>({item_key,item_count:item.count})));
            character.addToInventory(start.snapshot.items.map(({id,...item})=>({...item,item_id:id})),true);
            character.money=start.snapshot.money;update_displayed_money();character.updateStatsAndDisplay();
            change_location({location_id:start.snapshot.location,skip_travel_time:true});
            questManager.startQuest({quest_id:start.snapshot.quest});
            lifeRecord=appendLifeMilestone(lifeRecord,{year:current_game_time.year,at:lifeCalendarMinute(current_game_time),
                worldId:start.provenance.worldId,kind:'beginning',text:`Start layers: ${start.provenance.layers.map(l=>l.id).join(', ')}. Seed: ${start.provenance.seed}`});
        }
        const choice = newGameBeginning.cheatChoice();
        if(choice === 'system-quests' || choice === 'surprise') {
            cheatState = grantCheat(cheatState, optionalStartCard(), {route: 'optional-start', at: cheatCalendarTime()});
        }
        lifeRecord = appendLifeMilestone(lifeRecord, {year: current_game_time.year,
            at: lifeCalendarMinute(current_game_time), worldId: 'base.frontier', kind: 'beginning',
            text: choice === 'none' ? 'You chose an ordinary beginning without a system.' :
                choice === 'surprise' ? 'You chose a surprise beginning with a dormant system.' : 'You chose to begin with a dormant system.'});
        newGameBeginning.remove();
        log_message('Your name is set in the You panel header. Click it to rename.', 'message_unlocks');
    }, {capture: true, once: true});
}
play_button.addEventListener("click", run);

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

    domainRegistry.mountPanels();
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
    systemsWorkshopPanel=createSystemsWorkshopPanel({registry:expeditionRegistry,parent:document.getElementById('location_actions_div'),read:()=>({...readProgression(),inDialogue:!!current_dialogue,inCombat:!!current_combat}),act:actSystemsWorkshop});
    const storyletPanel=createStoryletPanel({registry:expeditionRegistry,read:()=>({...readProgression(),inDialogue:!!current_dialogue}),command:actSimulation});
    const renderWorkshop=simulationPanel.render;
    simulationPanel.render=()=>{renderWorkshop();storyletPanel.render();};simulationPanel.render();
    pursuitPanel=createPursuitPanel({registry:expeditionRegistry,read:()=>{const snapshot=readProgression();return {...snapshot,inDialogue:!!current_dialogue,inCombat:!!current_combat,canWrite:ownsSave && !foundationSaveBlocked && !importProbeToken,
        context:{...snapshot.context,vitals:Object.fromEntries(Object.entries(simulationNativeContexts()).map(([id,c])=>[id,c.vitals]))}};},command:actSimulation});
    nativeBattleHost=createNativeBattleHost({Combat,Enemy,registry:expeditionRegistry,player:character,getState:()=>expansionState,getContext:campaignContext,persist:persistExpansion,
        getCombat:()=>current_combat,setCombat:c=>{current_combat=c;},endCombat:end_combat,
        refresh:()=>{for(const [is_attacker,list] of [[true,current_combat?.attackers||[]],[false,current_combat?.defenders||[]]])for(let i=0;i<list.length;i++)update_displayed_health_of_fighter({fighter_index:i,is_attacker});},
        render:error=>{if(error)nativeBattlePauseReason=error;frontierCampaignPanel?.render();partyPanel?.render();knownRoutesPanel?.render();adventureNotebook?.render();livingGearPanel?.render();combatOptionsPanel?.render();}});
    featureBattleHost=createFeatureBattleHost({Combat,Enemy,registry:expeditionRegistry,player:character,getState:()=>expansionState,getContext:featureWaveContext,persist:persistExpansion,
        getCombat:()=>current_combat,setCombat:c=>{current_combat=c;},endCombat:end_combat,
        attackersSlot:()=>document.getElementById('feature_battle_attackers'),defendersSlot:()=>document.getElementById('feature_battle_defenders'),
        refresh:()=>{for(const [is_attacker,list] of [[true,current_combat?.attackers||[]],[false,current_combat?.defenders||[]]])for(let i=0;i<list.length;i++)update_displayed_health_of_fighter({fighter_index:i,is_attacker});},
        render:()=>{featureExpansionPanel?.render();foundationInteractionPanel?.render();causalStoryPanel?.render();knownRoutesPanel?.render();adventureNotebook?.render();livingGearPanel?.render();combatOptionsPanel?.render();}});
    frontierCampaignPanel=createFrontierCampaignPanel({registry:expeditionRegistry,read:()=>({...readProgression(),context:campaignContext(),
        error:expansionError || nativeBattlePauseReason,inDialogue:!!current_dialogue,inCombat:!!current_combat,battleRunning:!!current_combat?.actionAdapter,canWrite:ownsSave && !foundationSaveBlocked && !importProbeToken}),command:actFrontierCampaign});
    partyPanel=createPartyPanel({registry:expeditionRegistry,read:()=>({...readProgression(),context:campaignContext(),error:expansionError || nativeBattlePauseReason,inDialogue:!!current_dialogue,canWrite:ownsSave && !foundationSaveBlocked && !importProbeToken}),command:actParty});
    exchangePanel=createExchangePanel({registry:expeditionRegistry,read:()=>({...readProgression(),context:campaignContext(),inDialogue:!!current_dialogue,inCombat:!!current_combat,canWrite:ownsSave && !foundationSaveBlocked && !importProbeToken}),command:actExchange});
    observationPanel=createObservationPanel({registry:expeditionRegistry,read:()=>({...readProgression(),context:campaignContext(),inDialogue:!!current_dialogue,inCombat:!!current_combat,canWrite:ownsSave && !foundationSaveBlocked && !importProbeToken}),command:actObservation});
    skillExpansionPanel=createSkillExpansionPanel({registry:expeditionRegistry,read:()=>({...readProgression(),context:campaignContext(),inDialogue:!!current_dialogue,inCombat:!!current_combat,enabled:ownsSave&&!foundationSaveBlocked&&!importProbeToken}),command:actSkillExpansion});
    installKnownItemHotkeys();
    const knownMethods=mountKnownMethodChains(skillExpansionPanel.panel,()=>skillExpansionPresentation(expansionState,expeditionRegistry,campaignContext()));
    const knownMinutesHost=document.createElement('section');knownMinutesHost.setAttribute('aria-label','Known played minutes');document.getElementById('character_bio_div').append(knownMinutesHost);
    const knownLabel=document.createElement('span');knownLabel.textContent='Played minutes: ';knownMinutesHost.append(knownLabel);
    const knownMinutes=mountKnownNumber(knownMinutesHost,expansionState.clock,getDisplaySetting('numberFormat'));
    const renderKnownMinutes=()=>{const formatted=formatKnownNumber(expansionState.clock,getDisplaySetting('numberFormat')),summary=knownMinutes.element.querySelector('summary'),exact=knownMinutes.element.querySelector('p');
        if(summary.textContent!==formatted.text)summary.textContent=formatted.text;summary.setAttribute('aria-label',`${formatted.text}; expand for exact value`);if(exact.textContent!==`Exact value: ${formatted.exact}`)exact.textContent=`Exact value: ${formatted.exact}`;};
    subscribeDisplaySettings(renderKnownMinutes);renderKnownMinutes();
    const refreshKnown=()=>{knownMethods.render();renderKnownMinutes();};
    setInterval(()=>{if(!deferWhileHidden(refreshKnown,refreshKnown))refreshKnown();},1000);

    featureExpansionPanel=createFeatureExpansionPanel({read:()=>({...readProgression(),context:featureWaveContext(),battleView:featureBattleHost.view(),battleRunning:featureBattleHost.isRunning(),notice:featureBattleHost.pauseReason(),canWrite:ownsSave&&!foundationSaveBlocked&&!importProbeToken}),command:actFeatureExpansion,present:snapshot=>refinementPresentation(snapshot,expeditionRegistry,{base:featureWavePresentation,relayHost,referenceDeskHost,replacementContext:backlogContext})});
    if(foundationProbeEnabled)foundationInteractionPanel=createFoundationInteractionPanel({registry:expeditionRegistry,enabled:true,read:()=>({state:expansionState,context:expeditionContext(),enabled:ownsSave&&!foundationSaveBlocked&&!importProbeToken&&!nativeOccupationReason(),error:expansionError}),command:actFoundationInteraction});
    managementPanel=createManagementPanel({registry:expeditionRegistry,read:()=>({...readProgression(),context:featureWaveContext(),inDialogue:!!current_dialogue,inCombat:!!current_combat,canWrite:ownsSave&&!foundationSaveBlocked&&!importProbeToken}),command:actManagement});
    managementPanel.render();
    crushSocialPanel=createCrushSocialPanel({registry:expeditionRegistry,read:()=>({...readProgression(),context:featureWaveContext(),inDialogue:!!current_dialogue,inCombat:!!current_combat,canWrite:ownsSave&&!foundationSaveBlocked&&!importProbeToken}),command:actCrushSocial});
    document.getElementById('location_actions_div')?.append(crushSocialPanel.element);
    causalStoryPanel=createCausalStoryUI({registry:expeditionRegistry,read:()=>({...readProgression(),context:currentCausalContext(),canWrite:ownsSave&&!foundationSaveBlocked&&!importProbeToken}),command:actCausalStory});
    const readBacklog=()=>({...readProgression(),context:backlogContext(),inDialogue:!!current_dialogue,inCombat:!!current_combat,canWrite:ownsSave&&!foundationSaveBlocked&&!importProbeToken});
    backlogPanel=createBacklogExpansionPanel({registry:expeditionRegistry,read:readBacklog,command:actBacklog,preview:qualifiedBacklog.preview,parent:document.getElementById('location_actions_div')});
    backlogOpeningPanel=createBacklogExpansionPanel({registry:expeditionRegistry,read:readBacklog,command:actBacklog,preview:qualifiedBacklog.preview,parent:document.getElementById('new_game_beginning')?.querySelector('.new-game-beginning-extras'),opening:true});
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
    chroniclePanel = createChroniclePanel({read: () => ({structuredLife:structuredLifeView(expansionState,optionalPackState.structured),state: expansionState, context: chronicleContext(),
        canWrite: ownsSave && !importProbeToken && !foundationSaveBlocked,
        enabled: ownsSave && current_location?.id === "Village" && !current_activity && !current_game_action && !current_combat && !is_sleeping && !is_reading && !is_in_trade() && !activePractice(expansionState.actors.player) && metVillageElder(),
        occupied: expansionState.pending.some(j => j.context.actorId === "player"),
        dutyJob: expansionState.pending.find(j => j.actionId === "chronicle.archive_duty"), error: expansionError||(()=>{try{return JSON.parse(localStorage.getItem(independent_request_key))?.error;}catch{return '';}})(), pauseReason: chroniclePauseReason}),
        command: actChronicle, duty: () => startExpedition("chronicle.archive_duty", expansionState.sequence),
        cancelDuty: () => {const j = expansionState.pending.find(j => j.actionId === "chronicle.archive_duty"); if(j) cancelExpedition(j.id, expansionState.sequence);},
        exportSave: () => {const serialized = create_save(); if(!serialized) return; const url = URL.createObjectURL(new Blob([encodeSaveFile(serialized)], {type: "text/plain"})); const a = document.createElement("a"); a.href = url; a.download = "YAIRPG-ended-life.txt"; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);}, reset: hard_reset,
        beginHeir, heirPreview: previewHeir,beginIndependent:beginIndependentLife,archiveExports:listStructuredLifeArchives({storage:localStorage,key:is_on_dev()?dev_save_key:save_key}).map(a=>({label:a.label,export:()=>{const url=URL.createObjectURL(new Blob([encodeSaveFile(a.serialized)],{type:'text/plain'}));const link=document.createElement('a');link.href=url;link.download='YAIRPG-archived-life.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}}))});
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
        read:()=>({seed:mixtureSeed(),expansion:expansionState,money:character.money,clock:calendarMinutes(current_game_time),inventory:character.getItems(),
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
    const pollDisplays=()=>{quietPlaceDetail.render();workLedgerPanel?.render();customizationPanel?.refresh();if(!workspaceOwns(customizationHost)&&!customizationHost.isConnected)document.getElementById('location_actions_div')?.append(customizationHost);workLedgerAuthor?.refresh();};
    setInterval(()=>{if(!deferWhileHidden(pollDisplays,pollDisplays))pollDisplays();},250);
    villageCareerControls = createVillageCareerControls({read:()=>({state:villageCareer,study:watchcraftPresentation(villageCareer,watchcraftKnown()),hasNotes:!!character.getItems()[item_templates[WATCHCRAFT_BOOK].getInventoryKey()],
        visible:current_location?.id==='Village' && expansionState.actors.player.worldId==='base.frontier' && !current_dialogue && !current_combat && !is_sleeping && !is_reading && !is_in_trade() && !current_game_action,
        canWrite:ownsSave&&!foundationSaveBlocked&&!importProbeToken,
        busy:!!current_activity || !!nativeOccupationReason(),canTeach:current_activity?.id==='patrolling' && !foundationSaveBlocked && !importProbeToken && ownsSave && !nativeOccupationReason(),recruitAlive:!!npcLives?.people.some(p=>p.id==='iona' && current_game_time.year<p.deathYear)}),
        mentor:choice=>writeVillageCareer(choice),resolve:choice=>writeVillageCareer(choice),promote:()=>writeVillageCareer('promote'),
        notes:()=>writeVillageCareer('notes'),tutor:()=>writeVillageCareer('tutor'),readNotes:()=>start_reading(WATCHCRAFT_BOOK),
        practice:()=>start_activity('meditating')});
    const travelerSupplyIndex=()=>buildVillageObtainability(villageTablesFromNative({items:item_templates,trader:traders['village trader'],stock:inventoryTemplates[traders['village trader'].inventory_template],inventory:character.getItems(),activities:locations.Village.activities,enemies:Object.fromEntries(Object.entries(enemy_templates).filter(([id])=>/wolf rat/i.test(id)).map(([id,e])=>[id,{loot_list:e.loot_list,knownKills:enemy_killcount[id]||0}])),recipes,craftingKnown:global_flags.is_crafting_unlocked,gatheringKnown:global_flags.is_gathering_unlocked,tools:Object.fromEntries(Object.entries(locations.Village.activities).map(([id,a])=>[id,!!character.getEquipment()[activities[a.activity_name]?.required_tool_type]])),season:current_game_time.getSeason()}));
    registerGeneratedPeople({read:()=>({supplyIndex:travelerSupplyIndex(),money:character.money,season:current_game_time.getSeason(),at:calendarMinutes(current_game_time),seed:generatedPeopleSeed(),expansion:expansionState,
        inVillage:current_location?.id==='Village'&&expansionState.actors.player.worldId==='base.frontier',
        canWrite:ownsSave&&!foundationSaveBlocked&&!importProbeToken&&!is_loading_error&&!lifeStorageFailure,
        busy:!!(nativeOccupationReason()||current_activity||current_game_action||current_combat||current_dialogue||is_sleeping||is_reading||is_in_trade())}),
        save:create_save,persist:serialized=>{const saved=JSON.parse(serialized);validateSaveEnvelope(saved,game_version);lifeSaveStorage.setItem(is_on_dev()?dev_save_key:save_key,serialized);expansionState=saved.expansion;simulationPanel?.render();},
        authoredNames:[...expeditionRegistry.simulation.people.values()].map(p=>p.label||p.name||p.id),
        itemKey:id=>item_templates[id].getInventoryKey(),canSupply:(key,quantity=1)=>canConsumeNativeCraftingItem(key)&&character.getItems()[key]?.count>=quantity,
        publishSupply:(key,quantity=1)=>{character.removeFromInventory([{item_key:key,item_count:quantity}]);update_displayed_character_inventory();},publishReward:add_money_to_character});
    villageLivesPanel = createVillageLivesPanel({read:()=>({state:npcLives,inVillage:current_location?.id==='Village' && expansionState.actors.player.worldId==='base.frontier',canWrite:ownsSave&&!foundationSaveBlocked&&!importProbeToken}),meet:()=>{
        if(npcLives || !ownsSave || foundationSaveBlocked || importProbeToken || current_location?.id!=='Village' || expansionState.actors.player.worldId!=='base.frontier')throw new Error("Meet your neighbors in Village when your life can be saved.");
        const serialized=create_save();if(!serialized)throw new Error("This meeting could not be remembered.");
        const save=JSON.parse(serialized);save.npc_lives=createVillageLives(save['current time'].year,expansionState.rng);
        lifeSaveStorage.setItem(is_on_dev()?dev_save_key:save_key,JSON.stringify(save));
    }});
    titlesPanel = createTitlesPanel({read: () => titleView(character.titles, readTitleCounters(),{knownOnly:true}),readWorn:()=>wornTitleView(character.titles,character.long_life_worn),readTraining:()=>trainingView(id=>({known:!!nativeSkillDiscovery(skills[id],character),level:character.getLevelableComponent().skill_progress[id]?.current_level || 0})),selectWorn:(id,enabled)=>{try{assertFeatureWriter();const next=selectWornTitle(character.titles,character.long_life_worn,id,enabled);persistExpansion({state:structuredClone(expansionState),external:{money:character.money},gameplay:gameplaySnapshot(),nativePatch:{'character/long_life_worn':next}});character.updateStatsAndDisplay();update_all_displayed_skills_xp_gain();}catch(error){log_message(error.message,'notification');}},readSettings:()=>getCustomizationSettings(customization,'skills',{season:current_game_time.getSeason()})});
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
        act:id=>dispatchLocalLifePlan(localLifeAction(localLife,localLifeContext(),id),undefined,id)});
    updateP23MoonConversation();
    trancheFourPanel=createTrancheFourPanel({read:trancheFourFrame,act:actTrancheFour});
    pacingMinute??=calendarMinutes(current_game_time);
    pacingPanel=mountPacingPanel({host:document.getElementById('options_choices'),getContext:homePacingContext,onChange:changeHomePacing});
    pacingStatusPanel=createPacingStatusPanel();
    p23ExposurePanel=mountExposurePanel({host:document.getElementById('options_choices'),getState:()=>p23Exposure,getContext:p00ExposureContext,
        getKnownSkills:()=>Object.keys(skills).filter(id=>nativeSkillDiscovery(skills[id],character)),onChange:changeP00Exposure});
    combatOptionsPanel=createCombatOptionsPanel({read:tacticsFrame,act:actTactic});
    trainingPanel=createTrainingPanel({read:trainingFrame,act:actTraining});
    livingGearPanel=createLivingGearPanel({read:livingFrame,spend:spendLivingCinders});
    readingSalvagePanel=createReadingSalvagePanel({read:studyFrame,act:(id,row)=>id==='identify'?identifySalvageCopy(row.key):id==='salvage'?craftSalvage(row.recipe,row.itemKey,row.toolKey):actStudy(id)});
    mistglassPanel=createMistglassPanel({host:projectsHome(),read:mistglassFrame,act:actMistglass});
    growthPanel=createGrowthPanel({read:growthFrame,act:actGrowth});
    householdPanel=createHouseholdPanel({host:document.getElementById('location_actions_div'),read:p00HouseholdFrame,act:actP00Household});
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
        ['skills','Skills & practice','skills_and_stances_div','center',false],
        ['records','Journal & received accounts','journal_div','center',false],
        ['preparation','Character & preparation','character_div','left',false],
        ['belongings','Belongings','inventory_div','left',false],
        ['local-actions','Local actions','location_related_div','center',true],
        ['messages','Reports','message_log_div','right',false],
    ]) {const node=document.getElementById(nodeId);if(node){
        const found=()=> {
            if(!openingAllows(id,getDisplaySetting('stagedOpening')==='on',openingStep))return false;
            if(['time','location'].includes(id)&&current_location?.id==='Village'&&expansionState.actors.player.worldId==='base.frontier')return false;
            if(id==='skills')return Object.values(skills).some(skill=>nativeSkillDiscovery(skill,character));
            if(id==='records')return item_templates['Old combat manual'].isFinished() || item_templates['ABC for kids'].isFinished() || Object.values(enemy_killcount).some(n=>n>0) || metVillageElder();
            return true;
        };
        registerWorkspaceModule({id,title,node,home,critical,eligible:found,discovered:found});
    }}
    // An opt-in presentation introduction. Never changes the original beginning or save recovery.
    const opening=document.createElement('section');opening.id='staged_opening';
    const introduction=document.createElement('p'),next=document.createElement('button');next.type='button';
    opening.append(introduction,next);document.getElementById('main_content').prepend(opening);
    const renderOpening=()=>{opening.hidden=getDisplaySetting('stagedOpening')!=='on'||openingStep>=3;
        introduction.textContent=['Time passes as you act. Continue to meet your character.','Your character grows through experience. Continue to inspect your belongings.','Your belongings and local actions are ready. Continue to open your records.'][openingStep]||'';
        next.textContent='Continue introduction';};
    next.onclick=()=>{openingStep=Math.min(3,openingStep+1);try{localStorage.setItem('yairpg.opening.v1',String(openingStep));}catch{/* Session only. */}renderOpening();updateWorkspace();};
    if(Object.values(character.getLevelableComponent().skill_progress).some(p=>p.total_xp>0)||Object.values(enemy_killcount).some(n=>n>0)||Object.values(book_stats).some(b=>b.accumulated_time>0))openingStep=3;
    subscribeDisplaySettings(()=>{renderOpening();updateWorkspace();});renderOpening();
    const reference=document.createElement('section');reference.id='reading_reference';
    const referenceKnown=()=>['ABC for kids','Old combat manual'].some(id=>item_templates[id].isFinished());
    referenceRender=()=>{
        reference.replaceChildren();const heading=document.createElement('h3');heading.textContent='Reading reference (proposal)';
        const text=document.createElement('p');text.textContent=`Completed reading opens your reference desk. ${Object.values(enemy_killcount).filter(n=>n>0).length} creatures recorded from your own encounters.`;
        const button=document.createElement('button');button.type='button';button.textContent='Open Journal & Bestiary';button.onclick=()=>openWorkspaceModule('records');reference.append(heading,text,button);
    };
    document.getElementById('journal_div').after(reference);referenceRender();
    registerWorkspaceModule({id:'reading-reference',title:'Reading reference',node:reference,home:'right',eligible:referenceKnown,discovered:referenceKnown});
    bindAcquisitionLesson(recipeLesson);
    bindDenominationKnowledge(()=>expansionState.actors.player.worldId==='base.frontier'||!!revealFacts()['reveal.wallet.'+expansionState.actors.player.worldId]);
    update_displayed_money();
    practicePanel=createPracticePanel({register:registerWorkspaceModule,update:updateWorkspace,
        read:()=>{const context=localLifeContext(),found=localLife.searches[current_location?.id]?.found;
            return {hints:context.worldId==='base.frontier'?knownPracticeHints(character.getLevelableComponent().skill_progress,character.getItems(),revealFacts()['reveal.herbLesson']):[],progress:character.getLevelableComponent().skill_progress,run:revealFacts()['reveal.run']===true,reason:practiceRunReason({toggle:true}),runFallback:character.getFullStats().stamina<2,recipe:revealFacts()['reveal.herbLesson']===true,craftReason:accessoryCraftingTiers(current_location,undefined,global_flags.is_crafting_unlocked).alchemy?'':'Requires an accessible alchemy station before crafting.',
                search:{on:localLife.looking,reason:!ownsSave||foundationSaveBlocked||importProbeToken?'Saving is unavailable.':!context.idle?'Finish your current activity before investigating.':!['Village','Shack'].includes(context.location)?'Investigate is practiced in Village and Shack.':found?'Nothing remains to find here.':''}};},
        toggleRun:()=>{if(practiceRunReason({toggle:true}))return;const next=structuredClone(expansionState);next.sequence++;next.actors.player.facts['reveal.run']=!revealFacts()['reveal.run'];persistExpansion({state:next,gameplay:gameplaySnapshot(),external:{money:character.money},messages:[]});},
        investigate:()=>dispatchLocalLifePlan(localLifeAction(localLife,localLifeContext(),'look')),
        craft:()=>{if(!accessoryCraftingTiers(current_location,undefined,global_flags.is_crafting_unlocked).alchemy)return;open_crafting_window();switch_crafting_recipes_page('alchemy');}});
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
    mountProto23Shell({read:()=>{
        const stats=character.getFullStats();
        return {stats:[['STR',stats.strength],['AGL',stats.agility],['DEX',stats.dexterity],['INT',stats.intuition],['Attack',character.getAttackPower()],['Defense',stats.defense]].map(([label,value])=>[label,Number.isFinite(value)?Number(value.toFixed(1)):'???']),
            equipment:[...document.querySelectorAll('#character_equipment_div .equipment_slot_div')].map(slot=>{const id=slot.id.replace(/_slot$/,'');const item=character.getEquipment()[id==='fishing'?'fishing_pole':id];return {id,label:id.replaceAll('_',' '),name:item?item.getName():null};}),
            reason:nativeActionReasons(expansionState).join(' ')};
    }});
    createVillageWorkspace({read:()=>{
        const inVillage=current_location?.id==='Village'&&expansionState.actors.player.worldId==='base.frontier';
        const travelers=inVillage?generatedPeopleView(generatedPeopleSnapshot(calendarMinutes(current_game_time))).filter(p=>p.status!=='on_road'):[];
        const authored=inVillage?current_location.npcs.filter(id=>{const p=NPCRegistry.get(id);return p.canBeDisplayed(get_context())&&p.getDialogueComponent().canBeDisplayed(get_context());}).map(id=>({id,name:NPCRegistry.get(id).getName({is_mofu_mofu_enabled:global_flags.is_mofu_mofu_enabled}),role:NPCRegistry.get(id).tags.trader?'Merchant':'Village neighbor',met:id==='villageElder'?metVillageElder():true,traits:[],relationship:null})):[];
        const dealing=current_trader?{id:current_trader,name:NPCRegistry.get(current_trader).getName({is_mofu_mofu_enabled:global_flags.is_mofu_mofu_enabled}),role:'Merchant',met:true,traits:[],relationship:null}:null;
        const people=[...authored,...travelers,...(dealing&&!authored.some(p=>p.id===dealing.id)?[dealing]:[])],things=inVillage?[{id:'mixing',name:'Village mixing counter',description:'Mix and observe your own ingredients.'},...(document.querySelector('.choice_craft')?[{id:'crafting',name:'Crafting stations',description:'Use the available native crafting stations.'}]:[]),{id:'projects',name:'Projects',description:'Read optional proposals before opting in.'}]:[];
        const busy=!!(current_activity||current_game_action||current_combat||current_dialogue||is_sleeping||is_reading||is_in_trade()||nativeOccupationReason());
        const actions=[...people.map(p=>({id:`talk:${p.id}`,target:p.id,label:p.met?`Talk with ${p.name}`:'Meet traveler',disabled:busy,reason:busy?'Finish your current work or conversation first.':''})),...things.map(t=>({id:t.id,target:t.id,label:t.id==='projects'?'Open Projects':`Open ${t.name}`,disabled:t.id!=='projects'&&busy,reason:busy?'Finish your current work or conversation first.':''}))];
        const weatherNode=document.getElementById('weather_div'),weatherLabel=weatherNode?.querySelector('.material-icons')?.textContent.trim()==='ac_unit'?'Snow':is_raining()?'Rain':'Dry',temperatureText=weatherNode?.querySelector('span:not(.material-icons):not(.temperature_tooltip)')?.textContent||'';
        const enemies=readNativeCombatFocus(current_combat?.defenders_ui_slot),enemy=enemies[0]||null;
        return {inVillage,place:current_location?.name||current_location?.id||'',placeTypes:projectPlaceTypes(current_location?.types,{stageOf:(type,stage)=>location_types[type]?.stages?.[stage],penalty:get_location_type_penalty,statName:stat=>stat_names[stat]??stat}),clock:`${current_location?.name||current_location?.id} · ${current_game_time.toString()} · ${current_game_time.getTimeOfDaySimple()} · ${weatherLabel} · ${temperatureText}`,people,things,actions,dialogue:current_dialogue||current_trader,enemy,enemies,history:expansionState,services:inVillage?[{id:'waypost-clerk',name:'Waypost supply clerk',role:'Supply clerk',met:true,traits:[],relationship:null}]:[]};
    },act:id=>{
        if(id==='mixing'){document.getElementById('village_mixing_open')?.click();return;}
        if(id==='crafting'){window.openCraftingWindow();return;}
        if(id==='projects'){openWorkspaceModule('projects');openProjects();return;}
        const person=id.slice(5);
        if(person.startsWith('traveler_')){openWorkspaceModule('village-travelers');const panel=document.getElementById('generated_people_panel');panel.open=true;const row=panel.querySelector(`[data-generated-person="${person}"]`);if(row){row.open=true;row.scrollIntoView({block:'nearest'});row.querySelector('button')?.focus();}return;}
        window.start_dialogue(person);
    }});
    createWorkspaceViews({read:()=>({
        work:[current_activity?nativeWorkLabel(current_activity):null,current_game_action?.name,
            harvestOwner?.job?`${harvestOwner.job.automatic?'Auto-processing':'Processing'} ${harvestOwner.job.specimen.species}: ${harvestOwner.job.choice}, ${Math.ceil(harvestOwner.job.remaining)} min remaining`:null,
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
    const refreshSiteEditor=()=>authoredSiteEditor.refresh();
    setInterval(()=>{if(!deferWhileHidden(refreshSiteEditor,refreshSiteEditor))refreshSiteEditor();},500);
    registerWorkspaceModule({id:'customization-sites',title:'Original site',node:authoredHost,home:'center'});
    continuationPanel=createContinuationUI({read:readContinuationUI,command:commandContinuation});
    setInterval(()=>{if(!authorityOperationBusy){observeContinuationLearning();continuationPanel?.render();maybeRepeatContinuation();}},500);
    mountWorkspace();
    mountWorkspaceNavigation({notice:(text,panelId)=>log_message(text,'notification',{safeText:true,panelId})});
    refreshCustomization();
    expansionQuests = createExpansionQuests({read: readProgression,readLocalLife:()=>localLife,readLocalContext:localLifeContext});
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

if((game_options.skip_play_button || continuationState?.loop.enabled) && !importProbeToken) {
    play_button.click();
}

mountAuthorityUI();
if(importProbeToken&&freshAuthorityProbe)window.parent.postMessage({type:'save-fresh-result',token:importProbeToken,serialized:create_save()},window.location.origin);
if(importProbeToken&&!freshAuthorityProbe) installImportProbe(importProbeToken, data => {
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

// Page exit or a hidden tab stores counters that unchanged autosaves skipped.
function flushDurableSaves() {
    if(importProbeToken || !ownsSave || foundationSaveBlocked || is_loading_error || lifeStorageFailure || authorityEnrolled()) return;
    try {durableSaves.flush();} catch(error) {console.error('Skipped save counters could not be stored.', error);}
}
window.addEventListener('pagehide', flushDurableSaves);
window.addEventListener('beforeunload', flushDurableSaves);
document.addEventListener('visibilitychange', () => {if(document.hidden) flushDurableSaves();});

if(testHooksEnabled) {
    window.advanceTicks = advanceTicks;
    window.fastForward = fastForward;
    window.simulationTestHooks = Object.freeze({pause:pauseEngine,resume:resumeEngine,snapshot:()=>JSON.parse(create_save()),tickrate:()=>tickrate,project:id=>structuredClone(domainRegistry.project(id)),refreshCombatView:()=>{if(current_combat&&!current_combat.is_ended)update_displayed_fighters_stats();},saveStatus:()=>({ownsSave,restoring:restoringNativeSave,writeBlocked:harvestWriteReason()})});
}

if(config.enable_dev_mode) {
    enable_dev_console();
}
export { 
    readVillageLedgerSentence,
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
