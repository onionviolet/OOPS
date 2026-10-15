# idle-reincarnator: system inventory

Status: PARTIAL. Every distinct family found in the inspected build/export is routed below, followed by a complete discovered source-unit index. This is an inventory of the available snapshot, not a claim to identify every behavior hidden in unparsed scenes, native bodies or server code. A class/helper/asset is a size signal, not necessarily an independent gameplay system. UNDOCUMENTED means no full semantic trace was located, even where a prior lane mentioned its name.

| Family | Where it lives | Size signal | Prior/new documentation |
|---|---|---|---|
| Player, body and life transitions | `models/player/` | Age, life, wallets, lifecycle and equipped activities | Prior selected |
| Jobs and training | `assets/jobs and assets/trainings` | 47 jobs,17 training rows (prior census) | Prior selected gates/XP |
| Skills, spells and lifestyles | `assets/skills, spells, lifestyles` | 40 skills,20 spells,50 lifestyles (prior census) | Prior selected; all combinations undocumented |
| Exploration and danger | `assets/explorations; models/action/types/exploration` | 170 rows in 12 groups (prior census) | Prior selected; A05/A08 extend |
| Story and popup/history | `assets/stories; models/action/types/story` | 177 rows:117 lore/48 job/12 life | NEW A01/A02 |
| Technology and civilizations | `assets/technologies; assets/civilizations` | 80 technology rows and8 civilization definitions | Prior selected; remaining effect chains undocumented |
| Temporal powers and redemption | `assets/temporals; assets/redeems` | 32 Temporal and10 redeem rows | Prior selected; full combinations undocumented |
| Declarative effects and dependencies | `models/effects; models/action/requirement; models/AssetLoader` | 75 JSON tables in total, 651 content rows (prior census) | NEW architecture/authoring extension |
| Save and clock controllers | `models/game/Save, offline_time_manager, auto_save_controller` | 10-second autosave; separate offline bank | Prior selected; new failure/thread trace |
| Automation and loadouts | `models/automation; player_automation` | Per-family automation scripts and saved plans | Prior selected; all queue combinations undocumented |
| Mod and Workshop authoring | `models/steam/mod, mod_manager, steam_workshop` | Local and Workshop registries | NEW A07/deeper D3 |
| UI/options/statistics | `Scenes; models/statistic; tab_manager` | 96 binary scenes/55 resources prior inventory | Scripts inventoried; binary layout unread |

Top three deeper reads: [DEEPER_SYSTEMS.md](DEEPER_SYSTEMS.md). Exact remaining gaps: [CHECKPOINT.md](CHECKPOINT.md).

## Discovered source-unit index

Every unit below is structurally indexed. Semantic coverage is restricted to the cited A01-A12 paths and prior selected traces. Units with no such citation remain undocumented in depth. Counts for repeated IDs are per asset. No raw prose or source bodies are included.

| Unit / locator | Bytes, rows or references | Coverage limit |
|---|---|---|
| `Scenes/Action/ActionCard.gd` | 3687 | Token-rendered script; untraced unless cited |
| `Scenes/Action/ActionSubTab.gd` | 5358 | Token-rendered script; untraced unless cited |
| `Scenes/Action/ActionTab.gd` | 4797 | Token-rendered script; untraced unless cited |
| `Scenes/Action/nav_manager.gd` | 3639 | Token-rendered script; untraced unless cited |
| `Scenes/Action/subtab_nav_button.gd` | 2606 | Token-rendered script; untraced unless cited |
| `Scenes/Action/tab_nav_button.gd` | 3406 | Token-rendered script; untraced unless cited |
| `Scenes/Automation/AutomationTab.gd` | 589 | Token-rendered script; untraced unless cited |
| `Scenes/Automation/sections/exploration.gd` | 2205 | Token-rendered script; untraced unless cited |
| `Scenes/Automation/sections/job.gd` | 908 | Token-rendered script; untraced unless cited |
| `Scenes/Automation/sections/lifestyle/lifestyle_section.gd` | 874 | Token-rendered script; untraced unless cited |
| `Scenes/Automation/sections/lifestyle/lifestyle_type.gd` | 2490 | Token-rendered script; untraced unless cited |
| `Scenes/Automation/sections/reincarnation.gd` | 2419 | Token-rendered script; untraced unless cited |
| `Scenes/Automation/sections/settings.gd` | 1151 | Token-rendered script; untraced unless cited |
| `Scenes/Automation/sections/spells.gd` | 1771 | Token-rendered script; untraced unless cited |
| `Scenes/Automation/sections/training.gd` | 1692 | Token-rendered script; untraced unless cited |
| `Scenes/Exploration/AreaNav/ExplorationAreaCard.gd` | 1118 | Token-rendered script; untraced unless cited |
| `Scenes/Exploration/ExplorationCard.gd` | 5034 | Token-rendered script; untraced unless cited |
| `Scenes/Exploration/ExplorationSkillLevelHbox.gd` | 692 | Token-rendered script; untraced unless cited |
| `Scenes/Exploration/ExplorationSkillPanel.gd` | 464 | Token-rendered script; untraced unless cited |
| `Scenes/Exploration/ExplorationSubTab.gd` | 1557 | Token-rendered script; untraced unless cited |
| `Scenes/Exploration/ExplorationSubTabContainer.gd` | 166 | Token-rendered script; untraced unless cited |
| `Scenes/Exploration/ExplorationSubTabNavButton.gd` | 1278 | Token-rendered script; untraced unless cited |
| `Scenes/Exploration/ExplorationSubTabNavSection.gd` | 1640 | Token-rendered script; untraced unless cited |
| `Scenes/Exploration/ExplorationTab.gd` | 5433 | Token-rendered script; untraced unless cited |
| `Scenes/Exploration/SubTabContainer.gd` | 196 | Token-rendered script; untraced unless cited |
| `Scenes/Exploration/danger_reduction.gd` | 213 | Token-rendered script; untraced unless cited |
| `Scenes/Exploration/hide_completed_explorations_button.gd` | 269 | Token-rendered script; untraced unless cited |
| `Scenes/FAQ/faq_tab.gd` | 332 | Token-rendered script; untraced unless cited |
| `Scenes/GameWindow/GameWindow.gd` | 422 | Token-rendered script; untraced unless cited |
| `Scenes/General/notification_icon.gd` | 792 | Token-rendered script; untraced unless cited |
| `Scenes/General/version_label.gd` | 67 | Token-rendered script; untraced unless cited |
| `Scenes/Job/ActionButton.gd` | 387 | Token-rendered script; untraced unless cited |
| `Scenes/Job/AutomationButton.gd` | 786 | Token-rendered script; untraced unless cited |
| `Scenes/Job/JobCard.gd` | 2652 | Token-rendered script; untraced unless cited |
| `Scenes/Job/JobSubTab.gd` | 349 | Token-rendered script; untraced unless cited |
| `Scenes/Job/JobTab.gd` | 611 | Token-rendered script; untraced unless cited |
| `Scenes/Lifestyle/LifeStyleTab.gd` | 534 | Token-rendered script; untraced unless cited |
| `Scenes/Lifestyle/LifestyleCard.gd` | 2489 | Token-rendered script; untraced unless cited |
| `Scenes/Lifestyle/LifestyleEffectsLabel.gd` | 168 | Token-rendered script; untraced unless cited |
| `Scenes/Lifestyle/LifestyleSubTab.gd` | 2860 | Token-rendered script; untraced unless cited |
| `Scenes/Lifestyle/enhancements_section.gd` | 96 | Token-rendered script; untraced unless cited |
| `Scenes/Lifestyle/lifestyles_loadout.gd` | 424 | Token-rendered script; untraced unless cited |
| `Scenes/Lifestyle/unequip_all_lifestyles_btn.gd` | 97 | Token-rendered script; untraced unless cited |
| `Scenes/Loading/loading_screen.gd` | 4174 | Token-rendered script; untraced unless cited |
| `Scenes/Main/Control.gd` | 1721 | Token-rendered script; untraced unless cited |
| `Scenes/Main/FPS.gd` | 291 | Token-rendered script; untraced unless cited |
| `Scenes/Main/Log.gd` | 189 | Token-rendered script; untraced unless cited |
| `Scenes/Main/MotivateButton.gd` | 5316 | Token-rendered script; untraced unless cited |
| `Scenes/Main/side_menu/FAQ_btn.gd` | 140 | Token-rendered script; untraced unless cited |
| `Scenes/Main/side_menu/about_btn.gd` | 86 | Token-rendered script; untraced unless cited |
| `Scenes/Main/side_menu/options_btn.gd` | 144 | Token-rendered script; untraced unless cited |
| `Scenes/Main/side_menu/quit_btn.gd` | 136 | Token-rendered script; untraced unless cited |
| `Scenes/Main/side_menu/return_to_title.gd` | 145 | Token-rendered script; untraced unless cited |
| `Scenes/Main/side_menu/side_menu.gd` | 1862 | Token-rendered script; untraced unless cited |
| `Scenes/Main/side_menu/side_menu_btn.gd` | 96 | Token-rendered script; untraced unless cited |
| `Scenes/Options/fps_option_btn.gd` | 500 | Token-rendered script; untraced unless cited |
| `Scenes/Options/hard_reset_section.gd` | 780 | Token-rendered script; untraced unless cited |
| `Scenes/Options/number_notation_btn.gd` | 671 | Token-rendered script; untraced unless cited |
| `Scenes/Options/options_tab.gd` | 16 | Token-rendered script; untraced unless cited |
| `Scenes/Options/pause_on_reset_check_button.gd` | 318 | Token-rendered script; untraced unless cited |
| `Scenes/Options/popup_behaviour_option_btn.gd` | 357 | Token-rendered script; untraced unless cited |
| `Scenes/Options/redeem_section.gd` | 388 | Token-rendered script; untraced unless cited |
| `Scenes/Options/save_section/clipboard_save_section.gd` | 1605 | Token-rendered script; untraced unless cited |
| `Scenes/Options/save_section/file_save_section.gd` | 3690 | Token-rendered script; untraced unless cited |
| `Scenes/Options/save_section/legacy_save_section.gd` | 638 | Token-rendered script; untraced unless cited |
| `Scenes/Options/save_section/save_load_section.gd` | 24 | Token-rendered script; untraced unless cited |
| `Scenes/Options/speed_reset_check_button.gd` | 390 | Token-rendered script; untraced unless cited |
| `Scenes/Options/window_behaviour_option_button.gd` | 1953 | Token-rendered script; untraced unless cited |
| `Scenes/Skill/SkillCard.gd` | 1920 | Token-rendered script; untraced unless cited |
| `Scenes/Skill/SkillEffectsLabel.gd` | 96 | Token-rendered script; untraced unless cited |
| `Scenes/Skill/SkillSubTab.gd` | 512 | Token-rendered script; untraced unless cited |
| `Scenes/Skill/SkillTab.gd` | 191 | Token-rendered script; untraced unless cited |
| `Scenes/Spell/SpellCard.gd` | 2186 | Token-rendered script; untraced unless cited |
| `Scenes/Spell/SpellEffectsLabel.gd` | 96 | Token-rendered script; untraced unless cited |
| `Scenes/Spell/SpellSubTab.gd` | 22 | Token-rendered script; untraced unless cited |
| `Scenes/Spell/SpellTab.gd` | 1394 | Token-rendered script; untraced unless cited |
| `Scenes/Spell/spells_loadout.gd` | 902 | Token-rendered script; untraced unless cited |
| `Scenes/Spell/unequip_all_spells_btn.gd` | 300 | Token-rendered script; untraced unless cited |
| `Scenes/Starting/mods_popup.gd` | 1750 | Token-rendered script; untraced unless cited |
| `Scenes/Starting/options_popup.gd` | 226 | Token-rendered script; untraced unless cited |
| `Scenes/Starting/starting_screen.gd` | 1168 | Token-rendered script; untraced unless cited |
| `Scenes/Starting/title_screen_buttons.gd` | 501 | Token-rendered script; untraced unless cited |
| `Scenes/Starting/workshop/create_mod_popup.gd` | 2635 | Token-rendered script; untraced unless cited |
| `Scenes/Starting/workshop/mod_card.gd` | 1678 | Token-rendered script; untraced unless cited |
| `Scenes/Statistics/basic_stats_tab.gd` | 5764 | Token-rendered script; untraced unless cited |
| `Scenes/Statistics/boss_stats_card.gd` | 3122 | Token-rendered script; untraced unless cited |
| `Scenes/Statistics/detailed_stats_tab.gd` | 641 | Token-rendered script; untraced unless cited |
| `Scenes/Statistics/statistic_tab.gd` | 863 | Token-rendered script; untraced unless cited |
| `Scenes/Story/StoryCard.gd` | 800 | Token-rendered script; untraced unless cited |
| `Scenes/Story/StorySubTab.gd` | 1153 | Token-rendered script; untraced unless cited |
| `Scenes/Story/StoryTab.gd` | 570 | Token-rendered script; untraced unless cited |
| `Scenes/Technology/TechnologyCard.gd` | 420 | Token-rendered script; untraced unless cited |
| `Scenes/Technology/TechnologySubTab.gd` | 851 | Token-rendered script; untraced unless cited |
| `Scenes/Technology/TechnologyTab.gd` | 2424 | Token-rendered script; untraced unless cited |
| `Scenes/Temporal/TemporalSkillCard.gd` | 148 | Token-rendered script; untraced unless cited |
| `Scenes/Temporal/TemporalSubTab.gd` | 22 | Token-rendered script; untraced unless cited |
| `Scenes/Temporal/TemporalTab.gd` | 582 | Token-rendered script; untraced unless cited |
| `Scenes/Temporal/reset_temporals_on_regress_button.gd` | 249 | Token-rendered script; untraced unless cited |
| `Scenes/Training/ActionButton.gd` | 407 | Token-rendered script; untraced unless cited |
| `Scenes/Training/AutomationButton.gd` | 826 | Token-rendered script; untraced unless cited |
| `Scenes/Training/TrainingCard.gd` | 2708 | Token-rendered script; untraced unless cited |
| `Scenes/Training/TrainingEffectsLabel.gd` | 92 | Token-rendered script; untraced unless cited |
| `Scenes/Training/TrainingSubTab.gd` | 22 | Token-rendered script; untraced unless cited |
| `Scenes/Training/TrainingTab.gd` | 206 | Token-rendered script; untraced unless cited |
| `Scenes/player_information/Age.gd` | 104 | Token-rendered script; untraced unless cited |
| `Scenes/player_information/DeathButton.gd` | 196 | Token-rendered script; untraced unless cited |
| `Scenes/player_information/FastForwardButton.gd` | 559 | Token-rendered script; untraced unless cited |
| `Scenes/player_information/Gamespeed.gd` | 196 | Token-rendered script; untraced unless cited |
| `Scenes/player_information/GamespeedBuffDuration.gd` | 23 | Token-rendered script; untraced unless cited |
| `Scenes/player_information/Happiness.gd` | 349 | Token-rendered script; untraced unless cited |
| `Scenes/player_information/Lifespan.gd` | 133 | Token-rendered script; untraced unless cited |
| `Scenes/player_information/MiracleHBox.gd` | 465 | Token-rendered script; untraced unless cited |
| `Scenes/player_information/PlayButton.gd` | 515 | Token-rendered script; untraced unless cited |
| `Scenes/player_information/RebirthButton.gd` | 299 | Token-rendered script; untraced unless cited |
| `Scenes/player_information/RegressButton.gd` | 449 | Token-rendered script; untraced unless cited |
| `Scenes/player_information/RenownHBox.gd` | 440 | Token-rendered script; untraced unless cited |
| `Scenes/player_information/Status.gd` | 1177 | Token-rendered script; untraced unless cited |
| `Scenes/player_information/gold_gain_label.gd` | 368 | Token-rendered script; untraced unless cited |
| `Scenes/player_information/gold_label.gd` | 297 | Token-rendered script; untraced unless cited |
| `Scenes/player_information/player_name.gd` | 207 | Token-rendered script; untraced unless cited |
| `Scenes/popup/EndOfContentPopUp.gd` | 849 | Token-rendered script; untraced unless cited |
| `Scenes/popup/ForceRegressConfirmWindow.gd` | 1627 | Token-rendered script; untraced unless cited |
| `Scenes/popup/about/about_popup.gd` | 209 | Token-rendered script; untraced unless cited |
| `Scenes/popup/accumulation_popup.gd` | 3298 | Token-rendered script; untraced unless cited |
| `Scenes/popup/action/action_popup.gd` | 2066 | Token-rendered script; untraced unless cited |
| `Scenes/popup/action/action_popup_handler.gd` | 2583 | Token-rendered script; untraced unless cited |
| `Scenes/popup/action/story/story_popup.gd` | 1948 | Token-rendered script; untraced unless cited |
| `Scenes/popup/action/tech/tech_details.gd` | 341 | Token-rendered script; untraced unless cited |
| `Scenes/popup/action/tech/tech_popup.gd` | 1254 | Token-rendered script; untraced unless cited |
| `Scenes/popup/action/temporal/temporal_popup.gd` | 2777 | Token-rendered script; untraced unless cited |
| `Scenes/popup/close_popup.gd` | 81 | Token-rendered script; untraced unless cited |
| `Scenes/popup/death/RebirthPopUp.gd` | 2018 | Token-rendered script; untraced unless cited |
| `Scenes/popup/manual_reset/manual_reset_popup.gd` | 1485 | Token-rendered script; untraced unless cited |
| `Scenes/popup/offline_popup.gd` | 958 | Token-rendered script; untraced unless cited |
| `Scenes/popup/reset_automation_popup.gd` | 2809 | Token-rendered script; untraced unless cited |
| `addons/collapsible_container/collapsible_container_inspector_plugin.gd` | 1263 | Token-rendered script; untraced unless cited |
| `addons/collapsible_container/collapsible_container_plugin_loader.gd` | 570 | Token-rendered script; untraced unless cited |
| `addons/collapsible_container/collapsible_elements/FoldingPresets/folding_presets.gd` | 7510 | Token-rendered script; untraced unless cited |
| `addons/collapsible_container/collapsible_elements/collapsible_container.gd` | 39435 | Token-rendered script; untraced unless cited |
| `addons/collapsible_container/collapsible_elements/collapsible_inspector_buttons.gd` | 713 | Token-rendered script; untraced unless cited |
| `addons/fontawesome/All.gd` | 65917 | Token-rendered script; untraced unless cited |
| `addons/fontawesome/FontAwesome.gd` | 1568 | Token-rendered script; untraced unless cited |
| `addons/fontawesome/finder/option.gd` | 641 | Token-rendered script; untraced unless cited |
| `addons/fontawesome/finder/window.gd` | 3401 | Token-rendered script; untraced unless cited |
| `addons/fontawesome/plugin.gd` | 779 | Token-rendered script; untraced unless cited |
| `models/AssetLoader.gd` | 10463 | Token-rendered script; untraced unless cited |
| `models/Helper.gd` | 2323 | Token-rendered script; untraced unless cited |
| `models/LogHandler.gd` | 1532 | Token-rendered script; untraced unless cited |
| `models/WindowControl.gd` | 44 | Token-rendered script; untraced unless cited |
| `models/action/action.gd` | 13817 | Token-rendered script; untraced unless cited |
| `models/action/action_update_handler.gd` | 4565 | Token-rendered script; untraced unless cited |
| `models/action/level.gd` | 8452 | Token-rendered script; untraced unless cited |
| `models/action/requirement.gd` | 22501 | Token-rendered script; untraced unless cited |
| `models/action/reward.gd` | 111 | Token-rendered script; untraced unless cited |
| `models/action/types/Redeem.gd` | 5128 | Token-rendered script; untraced unless cited |
| `models/action/types/Skill.gd` | 5205 | Token-rendered script; untraced unless cited |
| `models/action/types/Temporal.gd` | 4947 | Token-rendered script; untraced unless cited |
| `models/action/types/civilization/Technology.gd` | 4820 | Token-rendered script; untraced unless cited |
| `models/action/types/civilization/civilization.gd` | 1280 | Token-rendered script; untraced unless cited |
| `models/action/types/civilization/civilization_level_handler.gd` | 2377 | Token-rendered script; untraced unless cited |
| `models/action/types/civilization/technology_hint.gd` | 3543 | Token-rendered script; untraced unless cited |
| `models/action/types/exploration/Exploration.gd` | 14150 | Token-rendered script; untraced unless cited |
| `models/action/types/exploration/danger.gd` | 2905 | Token-rendered script; untraced unless cited |
| `models/action/types/job/Job.gd` | 4498 | Token-rendered script; untraced unless cited |
| `models/action/types/job/income.gd` | 1712 | Token-rendered script; untraced unless cited |
| `models/action/types/job/job_equip.gd` | 4786 | Token-rendered script; untraced unless cited |
| `models/action/types/lifestyle/lifestyle.gd` | 2709 | Token-rendered script; untraced unless cited |
| `models/action/types/lifestyle/lifestyle_enhancements.gd` | 4474 | Token-rendered script; untraced unless cited |
| `models/action/types/lifestyle/lifestyle_equip.gd` | 7119 | Token-rendered script; untraced unless cited |
| `models/action/types/lifestyle/lifestyle_loadout.gd` | 858 | Token-rendered script; untraced unless cited |
| `models/action/types/lifestyle/lifestyle_manager.gd` | 575 | Token-rendered script; untraced unless cited |
| `models/action/types/spell/spell.gd` | 1448 | Token-rendered script; untraced unless cited |
| `models/action/types/spell/spell_equip_handler.gd` | 3258 | Token-rendered script; untraced unless cited |
| `models/action/types/spell/spell_loadout.gd` | 951 | Token-rendered script; untraced unless cited |
| `models/action/types/story/story.gd` | 5766 | Token-rendered script; untraced unless cited |
| `models/action/types/story/story_popup_handler.gd` | 1277 | Token-rendered script; untraced unless cited |
| `models/action/types/training/Training.gd` | 3208 | Token-rendered script; untraced unless cited |
| `models/action/types/training/training_equip.gd` | 8195 | Token-rendered script; untraced unless cited |
| `models/automation/automation_manager.gd` | 5052 | Token-rendered script; untraced unless cited |
| `models/automation/base_automation_handler.gd` | 1121 | Token-rendered script; untraced unless cited |
| `models/automation/exploration_automation.gd` | 3442 | Token-rendered script; untraced unless cited |
| `models/automation/job_automation.gd` | 2667 | Token-rendered script; untraced unless cited |
| `models/automation/lifestyle_automation.gd` | 3572 | Token-rendered script; untraced unless cited |
| `models/automation/lifestyle_automation_manager.gd` | 2773 | Token-rendered script; untraced unless cited |
| `models/automation/reset_automation.gd` | 4572 | Token-rendered script; untraced unless cited |
| `models/automation/spell_automation.gd` | 4358 | Token-rendered script; untraced unless cited |
| `models/automation/training_automation.gd` | 3663 | Token-rendered script; untraced unless cited |
| `models/big.gd` | 28824 | Token-rendered script; untraced unless cited |
| `models/effects/effect_calculator.gd` | 2386 | Token-rendered script; untraced unless cited |
| `models/effects/effect_handler.gd` | 9757 | Token-rendered script; untraced unless cited |
| `models/effects/effect_text.gd` | 6993 | Token-rendered script; untraced unless cited |
| `models/effects/effect_type.gd` | 12151 | Token-rendered script; untraced unless cited |
| `models/effects/effect_updater.gd` | 11654 | Token-rendered script; untraced unless cited |
| `models/game/Save.gd` | 15749 | Token-rendered script; untraced unless cited |
| `models/game/auto_save_controller.gd` | 326 | Token-rendered script; untraced unless cited |
| `models/game/game.gd` | 3727 | Token-rendered script; untraced unless cited |
| `models/game/game_loading_controller.gd` | 3149 | Token-rendered script; untraced unless cited |
| `models/game/game_speed_handler.gd` | 2197 | Token-rendered script; untraced unless cited |
| `models/game/offline_time_manager.gd` | 867 | Token-rendered script; untraced unless cited |
| `models/game/scene/scene_controller.gd` | 905 | Token-rendered script; untraced unless cited |
| `models/game/scene/scene_paths.gd` | 202 | Token-rendered script; untraced unless cited |
| `models/heap.gd` | 2374 | Token-rendered script; untraced unless cited |
| `models/player/age.gd` | 4393 | Token-rendered script; untraced unless cited |
| `models/player/death_handler.gd` | 651 | Token-rendered script; untraced unless cited |
| `models/player/happiness.gd` | 2035 | Token-rendered script; untraced unless cited |
| `models/player/lifespan.gd` | 5031 | Token-rendered script; untraced unless cited |
| `models/player/motivation.gd` | 3632 | Token-rendered script; untraced unless cited |
| `models/player/player/new_player.gd` | 3552 | Token-rendered script; untraced unless cited |
| `models/player/player/old_player.gd` | 1 | Token-rendered script; untraced unless cited |
| `models/player/player/player_actions.gd` | 838 | Token-rendered script; untraced unless cited |
| `models/player/player/player_automation.gd` | 249 | Token-rendered script; untraced unless cited |
| `models/player/player/player_lifecycle.gd` | 4769 | Token-rendered script; untraced unless cited |
| `models/player/player/player_progression.gd` | 2377 | Token-rendered script; untraced unless cited |
| `models/player/player/player_serialization.gd` | 6584 | Token-rendered script; untraced unless cited |
| `models/player/player/player_state.gd` | 572 | Token-rendered script; untraced unless cited |
| `models/player/resources/gold.gd` | 2892 | Token-rendered script; untraced unless cited |
| `models/player/resources/miracle.gd` | 919 | Token-rendered script; untraced unless cited |
| `models/player/resources/player_resource.gd` | 1900 | Token-rendered script; untraced unless cited |
| `models/player/resources/renown.gd` | 756 | Token-rendered script; untraced unless cited |
| `models/player/resources/temporal_essence.gd` | 2100 | Token-rendered script; untraced unless cited |
| `models/player/time_unit.gd` | 1157 | Token-rendered script; untraced unless cited |
| `models/signal_bus.gd` | 2884 | Token-rendered script; untraced unless cited |
| `models/statistics/base_reset_statistics.gd` | 3579 | Token-rendered script; untraced unless cited |
| `models/statistics/boss_statistics.gd` | 1230 | Token-rendered script; untraced unless cited |
| `models/statistics/lifetime_statistic.gd` | 2481 | Token-rendered script; untraced unless cited |
| `models/statistics/rebirth_statistics.gd` | 1341 | Token-rendered script; untraced unless cited |
| `models/statistics/regression_statistics.gd` | 1162 | Token-rendered script; untraced unless cited |
| `models/statistics/statistic_manager.gd` | 1925 | Token-rendered script; untraced unless cited |
| `models/steam/mod.gd` | 4091 | Token-rendered script; untraced unless cited |
| `models/steam/mod_manager.gd` | 4079 | Token-rendered script; untraced unless cited |
| `models/steam/steam_handler.gd` | 1537 | Token-rendered script; untraced unless cited |
| `models/steam/steam_workshop.gd` | 2754 | Token-rendered script; untraced unless cited |
| `models/steam/ugc_item.gd` | 5918 | Token-rendered script; untraced unless cited |
| `models/tab_manager.gd` | 691 | Token-rendered script; untraced unless cited |
| `assets/automations/data.json` | 0 content rows | JSON table; see family coverage |
| `assets/civilizations/data.json` | 0 content rows | JSON table; see family coverage |
| `assets/explorations/ancient_crypt/content.json` | 10 content rows | JSON table; see family coverage |
| `assets/explorations/avanosh/content.json` | 15 content rows | JSON table; see family coverage |
| `assets/explorations/blue_sea/content.json` | 20 content rows | JSON table; see family coverage |
| `assets/explorations/dark_light/content.json` | 11 content rows | JSON table; see family coverage |
| `assets/explorations/dark_sea/content.json` | 15 content rows | JSON table; see family coverage |
| `assets/explorations/data.json` | 0 content rows | JSON table; see family coverage |
| `assets/explorations/eldorian_tournament/content.json` | 14 content rows | JSON table; see family coverage |
| `assets/explorations/exah/content.json` | 16 content rows | JSON table; see family coverage |
| `assets/explorations/grasslands/content.json` | 15 content rows | JSON table; see family coverage |
| `assets/explorations/hall_of_heroes/content.json` | 19 content rows | JSON table; see family coverage |
| `assets/explorations/magic_research/content.json` | 10 content rows | JSON table; see family coverage |
| `assets/explorations/shaded_woods/content.json` | 17 content rows | JSON table; see family coverage |
| `assets/explorations/yuksul/content.json` | 8 content rows | JSON table; see family coverage |
| `assets/jobs/arcanic/content.json` | 6 content rows | JSON table; see family coverage |
| `assets/jobs/common/content.json` | 12 content rows | JSON table; see family coverage |
| `assets/jobs/data.json` | 0 content rows | JSON table; see family coverage |
| `assets/jobs/heroic/content.json` | 11 content rows | JSON table; see family coverage |
| `assets/jobs/knight/content.json` | 9 content rows | JSON table; see family coverage |
| `assets/jobs/noble/content.json` | 9 content rows | JSON table; see family coverage |
| `assets/lifestyles/companion/content.json` | 6 content rows | JSON table; see family coverage |
| `assets/lifestyles/data.json` | 0 content rows | JSON table; see family coverage |
| `assets/lifestyles/food/content.json` | 12 content rows | JSON table; see family coverage |
| `assets/lifestyles/home/content.json` | 8 content rows | JSON table; see family coverage |
| `assets/lifestyles/item/content.json` | 17 content rows | JSON table; see family coverage |
| `assets/lifestyles/transportation/content.json` | 7 content rows | JSON table; see family coverage |
| `assets/redeems/data.json` | 0 content rows | JSON table; see family coverage |
| `assets/redeems/main/content.json` | 10 content rows | JSON table; see family coverage |
| `assets/resources/ascendant/content.json` | 2 content rows | JSON table; see family coverage |
| `assets/resources/data.json` | 0 content rows | JSON table; see family coverage |
| `assets/resources/eternal/content.json` | 1 content rows | JSON table; see family coverage |
| `assets/resources/rebirth/content.json` | 3 content rows | JSON table; see family coverage |
| `assets/resources/temporal/content.json` | 2 content rows | JSON table; see family coverage |
| `assets/skills/arcane/content.json` | 7 content rows | JSON table; see family coverage |
| `assets/skills/combat/content.json` | 3 content rows | JSON table; see family coverage |
| `assets/skills/creating/content.json` | 4 content rows | JSON table; see family coverage |
| `assets/skills/data.json` | 0 content rows | JSON table; see family coverage |
| `assets/skills/defense/content.json` | 5 content rows | JSON table; see family coverage |
| `assets/skills/excavating/content.json` | 2 content rows | JSON table; see family coverage |
| `assets/skills/exploring/content.json` | 3 content rows | JSON table; see family coverage |
| `assets/skills/fishing/content.json` | 2 content rows | JSON table; see family coverage |
| `assets/skills/fundamentals/content.json` | 7 content rows | JSON table; see family coverage |
| `assets/skills/scavenging/content.json` | 2 content rows | JSON table; see family coverage |
| `assets/skills/social/content.json` | 5 content rows | JSON table; see family coverage |
| `assets/spells/conjuration/content.json` | 6 content rows | JSON table; see family coverage |
| `assets/spells/data.json` | 0 content rows | JSON table; see family coverage |
| `assets/spells/evocation/content.json` | 6 content rows | JSON table; see family coverage |
| `assets/spells/illusion/content.json` | 4 content rows | JSON table; see family coverage |
| `assets/spells/restoration/content.json` | 4 content rows | JSON table; see family coverage |
| `assets/statistics/data.json` | 0 content rows | JSON table; see family coverage |
| `assets/stories/data.json` | 0 content rows | JSON table; see family coverage |
| `assets/stories/job/content.json` | 48 content rows | JSON table; see family coverage |
| `assets/stories/life/content.json` | 12 content rows | JSON table; see family coverage |
| `assets/stories/lore/content.json` | 117 content rows | JSON table; see family coverage |
| `assets/technologies/0/content.json` | 3 content rows | JSON table; see family coverage |
| `assets/technologies/1/content.json` | 12 content rows | JSON table; see family coverage |
| `assets/technologies/2/content.json` | 15 content rows | JSON table; see family coverage |
| `assets/technologies/3/content.json` | 15 content rows | JSON table; see family coverage |
| `assets/technologies/4/content.json` | 9 content rows | JSON table; see family coverage |
| `assets/technologies/5/content.json` | 9 content rows | JSON table; see family coverage |
| `assets/technologies/6/content.json` | 9 content rows | JSON table; see family coverage |
| `assets/technologies/7/content.json` | 8 content rows | JSON table; see family coverage |
| `assets/technologies/data.json` | 0 content rows | JSON table; see family coverage |
| `assets/temporals/0/content.json` | 11 content rows | JSON table; see family coverage |
| `assets/temporals/1/content.json` | 11 content rows | JSON table; see family coverage |
| `assets/temporals/2/content.json` | 7 content rows | JSON table; see family coverage |
| `assets/temporals/3/content.json` | 3 content rows | JSON table; see family coverage |
| `assets/temporals/data.json` | 0 content rows | JSON table; see family coverage |
| `assets/trainings/arcane/content.json` | 4 content rows | JSON table; see family coverage |
| `assets/trainings/data.json` | 0 content rows | JSON table; see family coverage |
| `assets/trainings/mental/content.json` | 3 content rows | JSON table; see family coverage |
| `assets/trainings/physical/content.json` | 4 content rows | JSON table; see family coverage |
| `assets/trainings/temporal/content.json` | 2 content rows | JSON table; see family coverage |
| `assets/trainings/worldly/content.json` | 4 content rows | JSON table; see family coverage |
