# UI grammar inventory (2026-11-24)

Working-tree snapshot: 75 modules in `src/ui/`; 10 shared top-level modules in scope (five named shared modules plus five inspector-style modules).

**Method.** Modules are the current `src/ui/*.js` files plus `src/ui_components.js`, `src/panel_kit.js`, `src/reference_kit.js`, `src/ui_ports.js`, `src/known_things.js`, and top-level `src/*inspector*.js`. Importer counts/lists are literal source module-specifier references from JavaScript files below `src/` (relative paths); they are direct-reference counts, not runtime reachability. Stylesheet names are `styles/*.css` files containing an exact selector token for a literal class name found in the module; generated classes, inherited/global selectors, and attributes may be missed. Primitive labels are code-shape candidates, not accepted design decisions.

## 1. Shared UI modules

| Module | Draws / role | Candidate primitive(s) | Importers (count; file list) | Stylesheet matches in `styles/` |
|---|---|---|---|---|
| `ui/action_label.js` | Normalizes world action labels and short text. | other | 3; `book_world_hp_lead_ui.js`, `book_world_lotm_ui.js`, `ui/lotm_task_summary.js` | — |
| `ui/action_verbs.js` | Maps stable action IDs to verb words. | verb row | 1; `structured_pack_ui.js` | — |
| `ui/approach_strip.js` | Builds the segmented combat approach and stance strip. | row / verb row | 2; `combat_situation_ui.js`, `tempo_fight_domain.js` | `combat_versus.css` |
| `ui/bar_semantics.js` | Adds accessible value and low/ok state to existing vitality meters. | meter | 1; `display.js` | — |
| `ui/bench_form.js` | Renders shared bench/form controls and next-action summary. | row / verb row | 2; `gear_workshop_panel.js`, `pledges_ui.js` | — |
| `ui/bestiary_terms.js` | Synchronizes bestiary terminology with visible combat text. | other | 1; `combat_situation_ui.js` | — |
| `ui/body_view.js` | Renders a body figure and its text form. | glyph token / map node | 1; `body_ui.js` | `body_view.css` |
| `ui/book_craft_controls.js` | Builds shared book crafting action controls. | verb row | 2; `feature_expansion_ui.js`, `structured_pack_ui.js` | `component_themes.css`, `ui_tokens.css`, `workspace.css` |
| `ui/box_tabs.js` | Mounts conditional tabs and pages into Skills, Journal, and Character boxes. | box tab | 5; `book_world_lotm_domain.js`, `journal_home.js`, `structured_pack_ui.js`, `workspace_layout.js`, `workspace_navigation.js` | — |
| `ui/capability_runs.js` | Creates the capability-runs panel and its controls. | inspector / other | 1; `capability_runs_domain.js` | — |
| `ui/carried_skills.js` | Synchronizes carried skill labels into the existing view. | row | 1; `own_holdings.js` | — |
| `ui/character_sheet_view.js` | Renders a character sheet from projected rows. | row | 3; `people_ui.js`, `ui/preview/character_sheet_gallery.js`, `you_sheet.js` | — |
| `ui/combat_display.js` | Builds legacy player/enemy stat and health-bar DOM. | meter / row | 2; `main.js`, `models/combat.js` | — |
| `ui/combat_situation.js` | Projects combat/chase/tempo wording and choice data; no standalone renderer. | report line / other | 4; `combat_situation_ui.js`, `pursuit_ui.js`, `ui/preview/fixtures/bridges.js`, `ui/preview/fixtures/combat.js` | — |
| `ui/combat_versus.js` | Builds opponent comparison rows and summary text. | row / number | 4; `combat_situation_ui.js`, `ui/preview/fixtures/combat.js`, `ui/preview/fixtures/redesigns.js`, `ui/preview/redesign_gallery.js` | `combat_versus.css` |
| `ui/control_box.js` | Creates a labeled native control box. | box | 3; `game_bar.js`, `shell_control_boxes.js`, `shell_strip_boxes.js` | — |
| `ui/craft_glance.js` | Projects chance, needs, and crafting summary language. | number / report line | 2; `crafting_detail.js`, `display.js` | — |
| `ui/craft_groups.js` | Groups recipe rows under category headings. | row / fold | 1; `display.js` | `crafting_detail.css` |
| `ui/creature_record.js` | Creates a creature record with semantic labels. | report line | 1; `household_scene.js` | — |
| `ui/cross_freely.js` | Builds the cross-freely setting control and shared event behavior. | verb row | 2; `book_world_lotm_ui.js`, `game_bar.js` | — |
| `ui/crossing_threshold.js` | Projects and renders threshold/carry choices. | map node / row | 2; `book_world_lotm_ui.js`, `ui/form_adapters.js` | — |
| `ui/day_strip.js` | Mounts the day/time and next-event strip. | report line / motion beat | 1; `main.js` | `day_strip.css`, `status_line.css` |
| `ui/discord_kit_features.js` | Registers and supplies kit feature examples. | other | 0 | — |
| `ui/discord_surfaces.js` | Builds fast-travel map and bestiary rate text blocks. | map node / report line | 1; `display.js` | `action_legibility.css` |
| `ui/feel_finish.js` | Applies visual preferences, decorates fight messages, and mounts sound/feel controls. | other | 1; `ui_extras.js` | `display_settings.css`, `feel_finish.css` |
| `ui/field_record.js` | Renders a location field record with state and evidence. | report line | 2; `home_panel.js`, `known_things.js` | `field_record.css` |
| `ui/figure.js` | Validates and renders the shared SVG figure grammar, glyphs, edges, states, and legend. | glyph token / map node | 29; `book_world_lotm_ui.js`, `combat_situation_ui.js`, `continuation_ui.js`, `family_tree_panel.js`, `knowledge_home.js`, `people_ui.js`, `pursuit_ui.js`, `research_home.js`, `structured_pack_ui.js`, `ui/body_view.js`, `ui/combat_versus.js`, `ui/figure_forms.js`, `ui/figure_interact.js`, `ui/gathering_view.js`, `ui/home_view.js`, `ui/ladder_groups.js`, `ui/preview/figure_gallery.js`, `ui/preview/fixtures/housing_variants.js`, `ui/preview/fixtures/people_variants.js`, `ui/preview/fixtures/places_variants.js`, `ui/preview/fixtures/redesigns.js`, `ui/preview/housing_gallery.js`, `ui/preview/ladder_groups_gallery.js`, `ui/preview/people_gallery.js`, `ui/preview/places_gallery.js`, `ui/preview/redesign_gallery.js`, `ui/preview/style_guide.js`, `ui/preview/ui_directions.js`, `ui/walk_map.js` | `figure.css`, `redesign_drafts.css`, `skin_paper.css` |
| `ui/figure_forms.js` | Renders a figure as table, matrix, or sentence and switches forms. | row / map node | 4; `knowledge_home.js`, `people_ui.js`, `research_home.js`, `ui/preview/figure_gallery.js` | `figure.css`, `skin_paper.css` |
| `ui/figure_graph.js` | Lays out graph nodes and edges; no DOM drawing. | map node | 1; `ability_graph.js` | — |
| `ui/figure_interact.js` | Adds focus, filters, compare, pin, and highlight interactions to figures. | map node / tooltip | 1; `ui/figure_forms.js` | `figure.css` |
| `ui/form_adapters.js` | Adapts owed and threshold records to figure specs. | map node / other | 1; `ui/preview/fixtures/forms.js` | — |
| `ui/gather_line.js` | Projects gathering outcome text. | report line | 1; `display.js` | — |
| `ui/gathering_view.js` | Renders a gathering view with figure and text. | map node / report line | 1; `gathering_panel.js` | `gathering_view.css` |
| `ui/grow_columns.js` | Calculates expandable workspace columns; no renderer. | other | 2; `journal_home.js`, `workspace_layout.js` | — |
| `ui/gu_house_view.js` | Renders a Gu house from its current view. | box / row | 1; `structured_pack_ui.js` | — |
| `ui/gu_moves_view.js` | Renders Gu move choices and their status. | verb row | 1; `ui/gu_house_view.js` | — |
| `ui/here_kinds.js` | Classifies current place context and mounts location chips/way-outs. | glyph token / map node | 1; `village_workspace.js` | `shell_chrome.css` |
| `ui/home_view.js` | Renders home/location overview figure and text. | map node / report line | 3; `book_world_hp_lead_ui.js`, `book_world_lotm_ui.js`, `home_overview_panel.js` | `home_view.css` |
| `ui/inspector.js` | Mounts item inspection details in workspace navigation. | inspector | 1; `workspace_navigation.js` | — |
| `ui/inventory_row.js` | Projects inventory names and controls for existing rows. | row | 1; `display.js` | — |
| `ui/item_card.js` | Renders a shared item card with details. | box / tooltip | 2; `proto23_shell.js`, `ui/preview/item_card_gallery.js` | — |
| `ui/journal_lives.js` | Projects life/history rows for the journal. | report line / row | 1; `journal_home.js` | — |
| `ui/kit.js` | Renders shared kit row, verb, number, chip, tooltip, and feature gallery forms. | row / verb row / number / tooltip | 20; `book_world_lotm_ui.js`, `combat_situation_ui.js`, `hp_brewing_panel.js`, `journal_home.js`, `load_failure_notice.js`, `nearby_context_view.js`, `ri_daily_powers.js`, `ui/bench_form.js`, `ui/carried_skills.js`, `ui/creature_record.js`, `ui/day_strip.js`, `ui/discord_kit_features.js`, `ui/field_record.js`, `ui/inventory_row.js`, `ui/item_card.js`, `ui/journal_lives.js`, `ui/ready_hub.js`, `ui/reforge_preview.js`, `ui/report_filters.js`, `ui/walk_map.js` | `ui_tokens.css` |
| `ui/known_number.js` | Renders a number with known, estimated, range, or unknown status. | number known/estimated/unknown | 4; `combat_situation_ui.js`, `recent_learning.js`, `ui/combat_versus.js`, `ui/kit.js` | `combat_versus.css` |
| `ui/ladder_groups.js` | Renders grouped pathway ladders and path selection. | map node / row | 1; `ui/preview/ladder_groups_gallery.js` | `figure.css`, `redesign_drafts.css` |
| `ui/lives_figure.js` | Projects life-history figures and labels. | glyph token / map node | 3; `continuation_ui.js`, `ui/preview/fixtures/people_variants.js`, `ui/preview/fixtures/spacetime.js` | — |
| `ui/local_money_label.js` | Formats local purse and price labels. | number / report line | 1; `display.js` | — |
| `ui/look_presets.js` | Mounts look presets and grouped disclosures. | fold | 1; `ui/feel_finish.js` | `feel_finish.css` |
| `ui/lotm_task_summary.js` | Renders a LOTM task summary with workroom tabs. | box tab / report line | 1; `book_world_lotm_ui.js` | `ui_tokens.css`, `workroom_tabs.css` |
| `ui/map_marks.js` | Projects activity/location marks and danger labels; no standalone renderer. | map node / glyph token | 2; `display.js`, `ui/walk_map.js` | — |
| `ui/native_controls.js` | Mounts native selection controls and light-dismiss dialogs. | verb row / tooltip | 1; `ui_extras.js` | — |
| `ui/next_steps.js` | Mounts next-step links and status wording. | verb row / report line | 2; `structured_pack_ui.js`, `workspace_navigation.js` | `status_line.css`, `ui_tokens.css` |
| `ui/owed_ledger.js` | Renders owed/ledger records. | report line / row | 1; `work_ledger_ui.js` | — |
| `ui/panel_sections.js` | Renders panel sections, disclosure folds, labeled controls, chips, action groups, info rows, and reason lines. | box / fold / row / verb row | 11; `absorb_p23/host_joins/world_adaptation_ui.js`, `crafting_home.js`, `economy_standing_ui.js`, `field_layer_panel.js`, `gear_workshop_panel.js`, `home_household_panel.js`, `loadouts.js`, `owned_place_clock_panel.js`, `pledges_ui.js`, `rank_gap_observer_domain.js`, `recent_learning.js` | `shell_layout.css`, `ui_extras.css`, `ui_tokens.css` |
| `ui/pathway_card_view.js` | Renders a pathway card. | box / row | 0 | — |
| `ui/pinned_band.js` | Mounts pinned status/action rows. | row / verb row | 1; `workspace_navigation.js` | — |
| `ui/ready_hub.js` | Projects and mounts ready-action hub rows. | verb row | 2; `ui/pinned_band.js`, `workspace_navigation.js` | — |
| `ui/reforge_preview.js` | Renders reforge preview and result summaries. | report line / number | 2; `gear_workshop_panel.js`, `ui/item_card.js` | — |
| `ui/relationship_web.js` | Projects relationship figure specs, relationship-stage meters, and glance bars. | map node / meter / report line | 4; `companion_stage.js`, `people_ui.js`, `relationship_web_view.js`, `ui/preview/fixtures/relationship_web.js` | — |
| `ui/report_filters.js` | Mounts report filters and category tags. | row / glyph token | 2; `display.js`, `shell_control_boxes.js` | — |
| `ui/rite_figure.js` | Projects ritual/making figure specs and risk summaries. | map node / number / report line | 3; `book_world_lotm_ui.js`, `ui/preview/fixtures/bridges.js`, `ui/preview/fixtures/rituals.js` | — |
| `ui/scene_card.js` | Renders scene heading, quote, and current-scene card. | box / report line | 5; `combat_situation_ui.js`, `storylet_ui.js`, `ui/crossing_threshold.js`, `ui/preview/ui_directions.js`, `ui/talk_view.js` | — |
| `ui/search_field.js` | Mounts an accessible search field and escape behavior. | other | 4; `known_things.js`, `ui/figure_interact.js`, `ui_components.js`, `ui_extras.js` | `ui_extras.css` |
| `ui/semantic_ink.js` | Assigns semantic state presentation to existing nodes. | glyph token | 6; `home_panel.js`, `hp_brewing_panel.js`, `ui/creature_record.js`, `ui/field_record.js`, `ui/status_line.js`, `village_workspace.js` | — |
| `ui/skill_row.js` | Measures and abbreviates skill table rows. | row / number | 1; `display.js` | — |
| `ui/skills_tab.js` | Renders the native skills tab content. | box tab / row | 1; `ui/preview/skills_tab_gallery.js` | — |
| `ui/start_compare.js` | Renders start comparison questions and rows. | row | 1; `book_world_lotm_ui.js` | `crossing_threshold.css` |
| `ui/status_line.js` | Mounts the shared compact status and active-work line. | report line / motion beat | 5; `game_bar.js`, `structured_pack_ui.js`, `ui/day_strip.js`, `village_workspace.js`, `workspace_views.js` | — |
| `ui/talk_view.js` | Renders dialogue exchanges and choices. | report line / verb row | 1; `talk_dialogue_host.js` | `talk_view.css` |
| `ui/tempo_interaction.js` | Captures/restores combat tempo focus and builds handover/run lines. | motion beat / report line | 3; `combat_situation_ui.js`, `tempo_fight_domain.js`, `ui/feel_finish.js` | — |
| `ui/variant.js` | Mounts appearance/variant controls. | verb row | 1; `workspace_navigation.js` | — |
| `ui/verb_marks.js` | Finds and mounts action verb/readiness marks on existing rows. | verb row / glyph token | 3; `ui/pinned_band.js`, `ui/ready_hub.js`, `workspace_navigation.js` | — |
| `ui/walk_board.js` | Projects walk-board layout data. | map node | 1; `book_world_lotm_ui.js` | — |
| `ui/walk_map.js` | Projects and renders walk map, ladder, and route-strip figure specs. | map node | 3; `book_world_lotm_ui.js`, `ui/discord_surfaces.js`, `ui/preview/fixtures/maps.js` | `figure.css`, `redesign_drafts.css`, `walk_board.css` |
| `ui/walk_topology.js` | Projects connected walk topology data. | map node | 1; `ui/walk_map.js` | — |
| `chain_inspector.js` | Projects chain inspection data. | inspector | 1; `chain_inspector_ui.js` | — |
| `chain_inspector_ui.js` | Renders chain inspection UI. | inspector | 1; `harvest_ui.js` | — |
| `check_inspector.js` | Projects check/sensitivity inspection values; no renderer. | inspector | 0 | — |
| `known_things.js` | Projects known/reachable things and registers the Known Things panel. | inspector / row | 0 | `ui_extras.css` |
| `material_inspector.js` | Projects material evidence for craft selection. | inspector | 2; `craft_ingredient_selection.js`, `hp_brewing_formula.js` | — |
| `panel_kit.js` | Registers panels with the workspace registry; no visual primitive renderer. | other | 63; `adventure_notebook.js`, `book_world_hp_contact_panel.js`, `book_world_hp_lead_ui.js`, `book_world_lotm_ui.js`, `book_world_mol_access_ui.js`, `book_world_primordial_ui.js`, `canon_pull_panel.js`, `cheat_ui.js`, `cohort_battle_domain.js`, `combat_review_domain.js`, `companion_roster.js`, `condition_panel.js`, `continuation_ui.js`, `crafting_home.js`, `cultivation_intents_domain.js`, `deeds_ui.js`, `dnd_phandalin_panel.js`, `drainage_site_ui.js`, `economy_standing_ui.js`, `event_feed_ui.js`, `family_tree_panel.js`, `field_layer_panel.js`, `gathering_panel.js`, `gear_workshop_panel.js`, `generated_people_ui.js`, `harvest_ui.js`, `home_layout_panel.js`, `home_overview_panel.js`, `home_panel.js`, `household_fortunes_panel.js`, `hp_brewing_panel.js`, `known_things.js`, `life_events_ui.js`, `life_record_ui.js`, `lineage_domain.js`, `lives_carry_domain.js`, `loadouts.js`, `management/ui.js`, `naming_achievements_ui.js`, `npc_lives_ui.js`, `owned_place_clock_panel.js`, `peer_standing_panel.js`, `personal_journal_domain.js`, `pin_store_domain.js`, `pledges_ui.js`, `projects_drawer.js`, `proto23_shell.js`, `quest_board_ui.js`, `rank_gap_observer_domain.js`, `region_view.js`, `research_home.js`, `rewind_domain.js`, `root_retuning_domain.js`, `statistics_panel.js`, `status_window.js`, `stock_view_ui.js`, `story_insight_domain.js`, `tools_panel.js`, `ui/capability_runs.js`, `vessel_thread_domain.js`, `village_workspace.js`, `workspace_navigation.js`, `workspace_views.js` | — |
| `reference_kit.js` | Provides keyed list/table updates, accessible tabs, and visible-only rendering. | row / box tab | 27; `book_world_hp_contact_panel.js`, `book_world_lotm_tabs.js`, `book_world_mol_access_ui.js`, `book_world_primordial_ui.js`, `canon_pull_panel.js`, `companion_roster.js`, `condition_panel.js`, `deeds_ui.js`, `family_tree_panel.js`, `knowledge_home.js`, `known_things.js`, `lineage_domain.js`, `lives_carry_domain.js`, `loadouts.js`, `naming_achievements_ui.js`, `palette_feedback_domain.js`, `personal_journal_domain.js`, `pin_store_domain.js`, `rank_gap_observer_domain.js`, `region_view.js`, `reports_dock.js`, `research_home.js`, `rewind_domain.js`, `rewind_echo.js`, `statistics_panel.js`, `stock_view_ui.js`, `today_strip.js` | — |
| `skill_inspector.js` | Projects native/simulation skill inspection layers. | inspector | 1; `character_bio_ui.js` | — |
| `ui_components.js` | Decorates action controls with visible reasons and adds search/filter tools to existing inventory lists. | verb row / row | 8; `book_world_lotm_ui.js`, `continuation_ui.js`, `harvest_ui.js`, `projects_drawer.js`, `simulation_ui.js`, `village_career_ui.js`, `workspace_navigation.js`, `workspace_views.js` | `inventory.css`, `inventory_composition.css`, `shell_chrome.css`, `skin_graphite.css`, `ui_tokens.css` |
| `ui_ports.js` | Connects UI projections to game read ports; no renderer. | other | 47; `book_life_holdings.js`, `book_world_hp_contact_panel.js`, `book_world_hp_lead_domain.js`, `book_world_lotm_domain.js`, `book_world_mol_access_domain.js`, `canon_pull_panel.js`, `capability_runs_domain.js`, `combat_situation_ui.js`, `companion_roster.js`, `condition_panel.js`, `crafting_domain.js`, `deeds_ui.js`, `display.js`, `family_tree_panel.js`, `home_domain.js`, `household_fortunes_domain.js`, `hp_brewing_domain.js`, `hp_life_holdings.js`, `journal_home.js`, `knowledge_home.js`, `known_things.js`, `lineage_domain.js`, `lives_carry_domain.js`, `loadouts.js`, `naming_achievements_ui.js`, `opponent_board.js`, `owed_ledger_sources.js`, `palette_feedback_domain.js`, `personal_journal_domain.js`, `played_effects_domain.js`, `rank_gap_observer_domain.js`, `ready_sources.js`, `reports_dock.js`, `research_home.js`, `skill_overflow_domain.js`, `statistics_panel.js`, `stock_view_ui.js`, `story_effects_domain.js`, `structured_pack_ui.js`, `talk_dialogue_host.js`, `today_strip.js`, `ui/day_strip.js`, `ui/status_line.js`, `workspace_layout.js`, `workspace_navigation.js`, `world_look.js`, `you_sheet.js` | — |

## 2. UI contract allowlist counts

The current `tests/ui_contract_allowlist.json` has **783 entries** across **89 paths**. Counts below are allowlist records (`entries` array elements), not the per-record `count` field.

| Rank | File | Entries by rule | Total |
|---:|---|---|---:|
| 1 | `style.css` | control-height: 3; declaration: 4; layer: 5; motion: 4; spacing: 90; type: 5 | 111 |
| 2 | `styles/workspace.css` | control-height: 4; declaration: 1; layer: 9; motion: 2; spacing: 78; type: 13 | 107 |
| 3 | `styles/shell_chrome.css` | layer: 1; spacing: 44; type: 10 | 55 |
| 4 | `src/display.js` | color: 1; foreign-host: 48 | 49 |
| 5 | `styles/opponents.css` | spacing: 21; type: 8 | 29 |
| 6 | `styles/corc_readability.css` | declaration: 2; spacing: 19; type: 5 | 26 |
| 7 | `styles/customization.css` | control-height: 1; declaration: 2; spacing: 20; type: 3 | 26 |
| 8 | `src/customization_profiles.js` | color: 24 | 24 |
| 9 | `src/main.js` | color: 2; foreign-host: 21; spacing: 1 | 24 |
| 10 | `styles/nearby_context_view.css` | spacing: 15; type: 8 | 23 |
| 11 | `styles/component_themes.css` | control-height: 1; declaration: 4; spacing: 13; type: 4 | 22 |
| 12 | `src/component_themes.js` | color: 20 | 20 |
| 13 | `styles/inventory_composition.css` | spacing: 16 | 16 |
| 14 | `styles/ui_extras.css` | spacing: 15; type: 1 | 16 |
| 15 | `src/chain_inspector_ui.js` | color: 4; cssText: 4; spacing: 4; type: 3 | 15 |
| — | `styles/action_legibility.css` | control-height: 1; declaration: 1; spacing: 12; type: 1 | 15 |
| — | `src/rarity_palette.js` | color: 13 | 13 |
| — | `styles/combat_log.css` | spacing: 7; type: 6 | 13 |
| — | `styles/palette_feedback.css` | motion: 2; spacing: 8; type: 2 | 12 |
| — | `styles/display_settings.css` | motion: 1; spacing: 6; type: 4 | 11 |
| — | `styles/inventory.css` | spacing: 7; type: 4 | 11 |
| — | `styles/status_window.css` | spacing: 10; type: 1 | 11 |
| — | `src/harvest_ui.js` | color: 1; cssText: 3; spacing: 4; type: 1 | 9 |
| — | `src/character_creation.js` | foreign-host: 8 | 8 |
| — | `styles/oops_branding.css` | spacing: 6; type: 2 | 8 |
| — | `styles/ui_preview.css` | spacing: 5; type: 3 | 8 |
| — | `styles/shell_layout.css` | spacing: 4; type: 3 | 7 |
| — | `styles/meter_bar.css` | spacing: 6 | 6 |
| — | `styles/start_probe.css` | spacing: 4; type: 2 | 6 |
| — | `src/misc.js` | color: 5 | 5 |
| — | `src/pocket_realm_ui.js` | cssText: 1; declaration: 1; foreign-host: 1; spacing: 1 | 4 |
| — | `styles/palette_reports.css` | spacing: 4 | 4 |
| — | `src/particles.js` | color: 3 | 3 |
| — | `src/ui/combat_display.js` | color: 3 | 3 |
| — | `index.html` | color: 1; cssText: 1 | 2 |
| — | `src/expedition_ui.js` | foreign-host: 2 | 2 |
| — | `src/habitat_care_ui.js` | cssText: 1; spacing: 1 | 2 |
| — | `src/mixture_ui.js` | pixel-geometry: 2 | 2 |
| — | `src/village_career_ui.js` | foreign-host: 2 | 2 |
| — | `src/workspace_views.js` | foreign-host: 2 | 2 |
| — | `styles/material_icons.css` | declaration: 1; type: 1 | 2 |
| — | `styles/redesign_drafts.css` | declaration: 2 | 2 |
| — | `src/absorb_p23/host_joins/combat_options_ui.js` | foreign-host: 1 | 1 |
| — | `src/absorb_p23/host_joins/encounter_profiles_ui.js` | foreign-host: 1 | 1 |
| — | `src/absorb_p23/host_joins/growth_profile_ui.js` | foreign-host: 1 | 1 |
| — | `src/absorb_p23/host_joins/tranche_four_ui.js` | foreign-host: 1 | 1 |
| — | `src/absorb_p23/host_joins/tranche_three_ui.js` | foreign-host: 1 | 1 |
| — | `src/absorb_p23/host_joins/tranche_two_ui.js` | foreign-host: 1 | 1 |
| — | `src/adventure_notebook.js` | foreign-host: 1 | 1 |
| — | `src/body_ui.js` | foreign-host: 1 | 1 |
| — | `src/character_bio_ui.js` | foreign-host: 1 | 1 |
| — | `src/chronicle_ui.js` | foreign-host: 1 | 1 |
| — | `src/content_pack_ui.js` | foreign-host: 1 | 1 |
| — | `src/dev_console.js` | foreign-host: 1 | 1 |
| — | `src/display_settings.js` | color: 1 | 1 |
| — | `src/exchange_ui.js` | foreign-host: 1 | 1 |
| — | `src/feature_expansion_nested_ink_ui.js` | foreign-host: 1 | 1 |
| — | `src/feature_expansion_ui.js` | foreign-host: 1 | 1 |
| — | `src/field_ui.js` | foreign-host: 1 | 1 |
| — | `src/foundation_interaction_ui.js` | foreign-host: 1 | 1 |
| — | `src/frontier_campaign_ui.js` | foreign-host: 1 | 1 |
| — | `src/observation_ui.js` | foreign-host: 1 | 1 |
| — | `src/original_frontier_campaign_ui.js` | foreign-host: 1 | 1 |
| — | `src/party_ui.js` | foreign-host: 1 | 1 |
| — | `src/promise_ui.js` | foreign-host: 1 | 1 |
| — | `src/proto23_shell.js` | foreign-host: 1 | 1 |
| — | `src/pursuit_ui.js` | foreign-host: 1 | 1 |
| — | `src/reports_dock.js` | foreign-host: 1 | 1 |
| — | `src/repository_absorption_ui.js` | foreign-host: 1 | 1 |
| — | `src/reveal_chain.js` | foreign-host: 1 | 1 |
| — | `src/simulation_ui.js` | foreign-host: 1 | 1 |
| — | `src/skill_expansion_ui.js` | foreign-host: 1 | 1 |
| — | `src/status_window.js` | foreign-host: 1 | 1 |
| — | `src/storylet_ui.js` | foreign-host: 1 | 1 |
| — | `src/structured_pack_ui.js` | foreign-host: 1 | 1 |
| — | `src/technique_ui.js` | foreign-host: 1 | 1 |
| — | `src/tempo_fight_domain.js` | foreign-host: 1 | 1 |
| — | `src/titles_ui.js` | foreign-host: 1 | 1 |
| — | `src/town_ui.js` | foreign-host: 1 | 1 |
| — | `src/trade.js` | foreign-host: 1 | 1 |
| — | `src/ui/here_kinds.js` | foreign-host: 1 | 1 |
| — | `src/ui/preview/fixtures/combat.js` | foreign-host: 1 | 1 |
| — | `styles/body_view.css` | declaration: 1 | 1 |
| — | `styles/character_sheet.css` | declaration: 1 | 1 |
| — | `styles/crafting_detail.css` | declaration: 1 | 1 |
| — | `styles/figure_gallery.css` | declaration: 1 | 1 |
| — | `styles/figure.css` | declaration: 1 | 1 |
| — | `styles/settled_text_effects.css` | declaration: 1 | 1 |
| — | `styles/workspace_discovery.css` | motion: 1 | 1 |

**By rule (all files).** color: 78; control-height: 10; cssText: 10; declaration: 24; foreign-host: 123; layer: 15; motion: 10; pixel-geometry: 2; spacing: 421; type: 90.

**Top 15.** Rows with ranks 1–15 above are the paths with the most entries; ties follow file path order.

## 3. `definePanel` registrations

Registration scan covers JavaScript files under `src/` and records literal IDs/titles where available. The `definePanel` declaration in `panel_kit.js` is excluded. Total: **72 call sites**.

| Panel ID | Title | File |
|---|---|---|
| `notebook` | Notes, practice & people | `adventure_notebook.js` |
| `known-people` | People you know | `adventure_notebook.js` |
| `known-routes` | Known routes | `adventure_notebook.js` |
| `hp-contact` | Friends at school | `book_world_hp_contact_panel.js` |
| `hp` | The household day | `book_world_hp_lead_ui.js` |
| `lotm` | Tingen workroom | `book_world_lotm_ui.js` |
| `mol_access` | Cyoria access and loops | `book_world_mol_access_ui.js` |
| `primordial_credit` | Sect Library · priced credit | `book_world_primordial_ui.js` |
| `canon-pull` | The story | `canon_pull_panel.js` |
| `cheat-faculty` | Continuing insight | `cheat_ui.js` |
| `household-cohort` | Household cohort | `cohort_battle_domain.js` |
| `combat-review` | Combat forecast and review | `combat_review_domain.js` |
| `companions` | Companions | `companion_roster.js` |
| `condition` | Condition | `condition_panel.js` |
| `continuation` | Continuing connection | `continuation_ui.js` |
| `herbal-experiments` | Village experiments | `crafting_home.js` |
| `cultivation-insights` | Cultivation insights | `cultivation_intents_domain.js` |
| `deeds` | Deeds | `deeds_ui.js` |
| `dnd-phandalin` | Phandalin | `dnd_phandalin_panel.js` |
| `drainage-site` | Riverside exploration | `drainage_site_ui.js` |
| `economy_standing` | Standing and ledger | `economy_standing_ui.js` |
| `world-events` | World events | `event_feed_ui.js` |
| `family` | Family | `family_tree_panel.js` |
| `fields` | Spills and smoke | `field_layer_panel.js` |
| `gathering` | Gathering at a glance | `gathering_panel.js` |
| `gear-workshop` | Gear workshop | `gear_workshop_panel.js` |
| `village-travelers` | Village travelers | `generated_people_ui.js` |
| `carcass-processing` | Carcass processing | `harvest_ui.js` |
| `home-layout` | Room plan | `home_layout_panel.js` |
| `home-overview` | Home at a glance | `home_overview_panel.js` |
| `homes` | Homes | `home_panel.js` |
| `household-fortunes` | Household | `household_fortunes_panel.js` |
| `hp-polyjuice` | Potioneering | `hp_brewing_panel.js` |
| `known-things` | Known things | `known_things.js` |
| `life-events` | Family & farewells | `life_events_ui.js` |
| `memories` | Remembered years | `life_record_ui.js` |
| `inherited_traits` | Family qualities | `lineage_domain.js` |
| `lives_carry` | Lives and inheritance | `lives_carry_domain.js` |
| `loadouts` | Loadouts | `loadouts.js` |
| `management` | Organizations · Market courtyard | `management/ui.js` |
| `naming` | Naming and achievements | `naming_achievements_ui.js` |
| `village-neighbors` | Village neighbors | `npc_lives_ui.js` |
| `place_clock` | Hearthside clock | `owned_place_clock_panel.js` |
| `social-trust` | Regard | `peer_standing_panel.js` |
| `personal-journal` | Your journal & atlas | `personal_journal_domain.js` |
| `dev-pins` | Dev pins | `pin_store_domain.js` |
| `pledges` | Vows and tempering | `pledges_ui.js` |
| `rune-bench` | Rune bench | `pledges_ui.js` |
| `projects` | Projects | `projects_drawer.js` |
| `shell-inventory-tools` | Inventory tools | `proto23_shell.js` |
| `shell-character` | Stats & equipment | `proto23_shell.js` |
| `shell-detail` | Item details | `proto23_shell.js` |
| `shell-log-tools` | Reports controls | `proto23_shell.js` |
| `quest-board` | Leads | `quest_board_ui.js` |
| `rank_gap_observer` | Watch a working | `rank_gap_observer_domain.js` |
| `region-view` | Where I am | `region_view.js` |
| `research` | Study | `research_home.js` |
| `rewind` | Return to the mark | `rewind_domain.js` |
| `root-retuning` | Root retuning | `root_retuning_domain.js` |
| `statistics` | Statistics | `statistics_panel.js` |
| `status-window` | Status window | `status_window.js` |
| `stock_view` | Stock | `stock_view_ui.js` |
| `story-insight` | Stories and history | `story_insight_domain.js` |
| `tools` | Tools | `tools_panel.js` |
| `capability-runs` | Capability runs | `ui/capability_runs.js` |
| `vessel-thread` | Vessel-thread relic | `vessel_thread_domain.js` |
| `focus` | Focus | `village_workspace.js` |
| `opponents` | Opponents | `village_workspace.js` |
| `village-scene` | (dynamic) | `village_workspace.js` |
| `pane-navigation` | Center views | `workspace_navigation.js` |
| `combat` | Combat | `workspace_views.js` |
| `stance` | Stance & combatants | `workspace_views.js` |

## 4. Clearest duplicate implementations

These pairs implement visibly overlapping shapes in separate modules:

| Primitive | Modules | Difference visible in source |
|---|---|---|
| Row | `ui/kit.js` (`kitRow`) and `ui/panel_sections.js` (`infoRow`) | `kitRow` lays out a label, fact, provenance, and optional action in a kit row. `infoRow` lays out a label, chips, actions, and optional disclosure detail. Both are horizontal labeled information rows with distinct markup and style hooks. |
| Chip | `ui/kit.js` (`kitChip`) and `ui/panel_sections.js` (`chip`) | Both create short labeled chips; kit chip optionally carries count, pressed state, and action, while panel chip carries tone/guess/title metadata. |
| Tab | `ui/box_tabs.js` (`registerBoxTab`/`mountBoxTabs`) and `reference_kit.js` (`createTabs`) | Both create/select tab controls and switch visible content; box tabs insert owned nodes into legacy box slots, while reference tabs create an ARIA tablist with arrow-key navigation. |
