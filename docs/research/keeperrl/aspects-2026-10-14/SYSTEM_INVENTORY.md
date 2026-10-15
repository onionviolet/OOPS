# KeeperRL: system inventory, 2026-10-14

This is a static published-source inventory, not an installed-build manifest. Optional content, ports and platform files may not enter one build. Counts are tracked-path matches and byte counts, not guessed class/record counts or proof of semantic reading. Prior coverage means only the supplied dossier; unknown coverage by other lanes is not treated as absent. UNREAD means not semantically reviewed here. The module census below exposes the remaining source units rather than hiding them inside a few large groups.

## KeeperRL: subsystem map

| System | Source families | Size signal | Dossier / this pass |
|---|---|---:|---|
| Chat and petting actions | `player.cpp creature.cpp creature_attributes.cpp creature_attributes.h` | 4 paths, 183,223 bytes | new selected A01; D1 |
| Save archives and profile lifetime | `main_loop.cpp parse_game.h serialization.h unlocks.cpp` | 4 paths, 66,526 bytes | new A04; D2 |
| Tutorial predicates and highlights | `tutorial.cpp tutorial_state.h tutorial_highlight.h` | 3 paths, 13,214 bytes | new A10; D3 |
| Game/model clock and actor queue | `game.cpp model.cpp time_queue.*` | 4 paths, 56,816 bytes | new selected A03/A09 |
| Weighted behaviour AI | `monster_ai.cpp move_info.*` | 3 paths, 49,067 bytes | new A05 |
| Collective tasks and needs | `collective.cpp minion_activities.cpp task*.cpp` | 3 paths, 137,690 bytes | prior REPORT |
| Workshop queues and equipment | `workshops.cpp minion_equipment.cpp` | 2 paths, 15,875 bytes | prior REPORT |
| Training and facilities | `collective.cpp furniture*.cpp` | 11 paths, 117,633 bytes | prior REPORT |
| Body, injury and damage | `body.cpp body_part.cpp creature.cpp` | 3 paths, 146,697 bytes | prior REPORT plus selected A08 |
| Construction and invitation | `immigration.cpp construction_map.*` | 3 paths, 35,511 bytes | prior REPORT |
| Factions and attack consequences | `village_control.cpp village_behaviour.*` | 3 paths, 26,883 bytes | prior REPORT |
| Content factory and mod schemas | `content_factory.cpp game_config.* pretty_archive.* key_verifier.*` | 7 paths, 57,978 bytes | new A07 |
| Campaign generation and travel | `campaign*.cpp` | 3 paths, 27,661 bytes | prior world access; full generation UNREAD |
| Level generation and layouts | `level_maker.cpp model_builder.cpp layout*.cpp` | 4 paths, 168,138 bytes | inventory only |
| Spell schools and effects | `spell*.cpp effect*.cpp lasting_effect*.cpp` | 5 paths, 171,251 bytes | prior availability; full effects UNREAD |
| Resources, stock and trade | `resource*.cpp trade*.cpp cost_info.cpp` | 2 paths, 1,081 bytes | prior funded paths; broader UNREAD |
| Visibility, memory and navigation | `visibility_map.cpp map_memory.cpp shortest_path.cpp` | 3 paths, 18,283 bytes | UNREAD beyond serialized fields |
| Desktop GUI and map | `gui_builder.cpp map_gui.cpp gui_elem.cpp window_view.cpp` | 4 paths, 467,756 bytes | selected A06; runtime layout UNREAD |
| Feedback, animation, sound and text | `animation*.cpp sound*.cpp message_generator.cpp t_string.cpp translations.cpp` | 7 paths, 30,905 bytes | inventory and selected chat |
| Achievements and account unlocks | `unlocks.cpp steam_achievements.cpp achievement*.h` | 4 paths, 1,924 bytes | new local profile A12; Steam runtime UNREAD |
| Retirement and shared sites | `retired_games.cpp file_sharing.cpp main_loop.cpp` | 3 paths, 87,974 bytes | inventory/entry only; network UNREAD |
| Player and team control | `player_control.cpp collective_teams.cpp player.cpp` | 3 paths, 222,137 bytes | prior agents; full control variants UNREAD |
| Free configuration families | `data_free/game_config/*.txt` | 41 paths, 1,452,591 bytes | family census below; most records UNREAD |
| Media, libraries and platform builds | `extern/*/* cmake/* mac/* Makefile* CMakeLists.txt` | 94 paths, 1,426,455 bytes | inventory only; no builds or commercial media |

### Free configuration families

Every tracked text family under `data_free/game_config/`; record semantics are unread unless an aspect says otherwise.

| File / family | Lines | Bytes |
|---|---:|---:|
| `data_free/game_config/achievements.txt` | 33 | 2500 |
| `data_free/game_config/attributes.txt` | 164 | 3866 |
| `data_free/game_config/biomes.txt` | 399 | 8116 |
| `data_free/game_config/body_materials.txt` | 139 | 4294 |
| `data_free/game_config/buffs.txt` | 528 | 20639 |
| `data_free/game_config/build_menu.txt` | 633 | 26992 |
| `data_free/game_config/building_info.txt` | 160 | 3170 |
| `data_free/game_config/campaign_info.txt` | 10 | 173 |
| `data_free/game_config/campaign_villains.txt` | 87 | 5366 |
| `data_free/game_config/creatures.txt` | 5659 | 127611 |
| `data_free/game_config/dance_positions.txt` | 24 | 1274 |
| `data_free/game_config/endless_enemies.txt` | 311 | 4807 |
| `data_free/game_config/enemies.txt` | 2959 | 57860 |
| `data_free/game_config/equipment_groups.txt` | 11 | 517 |
| `data_free/game_config/furniture.txt` | 2684 | 63607 |
| `data_free/game_config/furniture_lists.txt` | 166 | 1517 |
| `data_free/game_config/help.txt` | 6 | 203 |
| `data_free/game_config/immigration.txt` | 1025 | 30830 |
| `data_free/game_config/intro_text.txt` | 1 | 10 |
| `data_free/game_config/item_lists.txt` | 584 | 13799 |
| `data_free/game_config/items.txt` | 2201 | 60524 |
| `data_free/game_config/keeper_creatures.txt` | 319 | 11320 |
| `data_free/game_config/keys.txt` | 61 | 2418 |
| `data_free/game_config/layout_mapping.txt` | 168 | 5833 |
| `data_free/game_config/names.txt` | 14191 | 191158 |
| `data_free/game_config/promotions.txt` | 154 | 6149 |
| `data_free/game_config/random_layouts.txt` | 1268 | 35948 |
| `data_free/game_config/resource_info.txt` | 17 | 1051 |
| `data_free/game_config/resources.txt` | 57 | 1209 |
| `data_free/game_config/spell_schools.txt` | 107 | 2148 |
| `data_free/game_config/spells.txt` | 1061 | 24975 |
| `data_free/game_config/storage_ids.txt` | 13 | 135 |
| `data_free/game_config/technology.txt` | 197 | 5485 |
| `data_free/game_config/tile_gas_types.txt` | 44 | 856 |
| `data_free/game_config/tiles.txt` | 1027 | 53074 |
| `data_free/game_config/translations/english.txt` | 4224 | 211899 |
| `data_free/game_config/translations/polish.txt` | 10282 | 432375 |
| `data_free/game_config/workshop_info.txt` | 76 | 1422 |
| `data_free/game_config/workshops_menu.txt` | 429 | 24532 |
| `data_free/game_config/world_maps.txt` | 2 | 52 |
| `data_free/game_config/zlevels.txt` | 152 | 2877 |

### KeeperRL: complete immediate gameplay-module census

This mechanically lists every immediate C/C++ source/header stem in the game source root, including helpers. A stem is a discovery unit, not a claim of a separate engine. Nested directories remain visible in the directory census. Status is selected semantic reading when cited, otherwise UNREAD/inventory-only.

| Module | Files | Source lines | This pass |
|---|---:|---:|---|
| `achievement_id` | 1 | 8 | UNREAD / inventory only |
| `achievement_info` | 1 | 12 | UNREAD / inventory only |
| `ai_type` | 1 | 6 | UNREAD / inventory only |
| `animation` | 2 | 91 | UNREAD / inventory only |
| `animation_id` | 2 | 41 | UNREAD / inventory only |
| `assembled_minion` | 2 | 67 | UNREAD / inventory only |
| `attack` | 1 | 46 | UNREAD / inventory only |
| `attack_behaviour` | 1 | 34 | UNREAD / inventory only |
| `attack_level` | 1 | 5 | UNREAD / inventory only |
| `attack_trigger` | 1 | 74 | UNREAD / inventory only |
| `attack_type` | 1 | 16 | UNREAD / inventory only |
| `attr_info` | 1 | 23 | UNREAD / inventory only |
| `attr_type` | 1 | 9 | UNREAD / inventory only |
| `audio_device` | 2 | 319 | UNREAD / inventory only |
| `automaton_part` | 1 | 14 | UNREAD / inventory only |
| `avatar_info` | 2 | 280 | UNREAD / inventory only |
| `avatar_menu_option` | 1 | 9 | UNREAD / inventory only |
| `bed_type` | 2 | 29 | UNREAD / inventory only |
| `best_attack` | 1 | 12 | UNREAD / inventory only |
| `biome_id` | 1 | 9 | UNREAD / inventory only |
| `biome_info` | 1 | 68 | UNREAD / inventory only |
| `body` | 2 | 1,251 | UNREAD / inventory only |
| `body_material` | 1 | 25 | UNREAD / inventory only |
| `body_material_id` | 1 | 9 | UNREAD / inventory only |
| `body_part` | 2 | 37 | UNREAD / inventory only |
| `bucket_map` | 2 | 83 | UNREAD / inventory only |
| `buff_id` | 1 | 9 | UNREAD / inventory only |
| `buff_info` | 2 | 101 | UNREAD / inventory only |
| `build_info` | 2 | 157 | UNREAD / inventory only |
| `building_id` | 1 | 8 | UNREAD / inventory only |
| `building_info` | 1 | 33 | UNREAD / inventory only |
| `call_cache` | 1 | 58 | UNREAD / inventory only |
| `campaign` | 2 | 431 | UNREAD / inventory only |
| `campaign_builder` | 2 | 469 | UNREAD / inventory only |
| `campaign_info` | 1 | 16 | UNREAD / inventory only |
| `campaign_menu_index` | 2 | 123 | UNREAD / inventory only |
| `campaign_type` | 1 | 7 | UNREAD / inventory only |
| `clock` | 2 | 128 | UNREAD / inventory only |
| `collective` | 2 | 2,212 | UNREAD / inventory only |
| `collective_attack` | 2 | 97 | UNREAD / inventory only |
| `collective_builder` | 2 | 170 | UNREAD / inventory only |
| `collective_config` | 2 | 517 | UNREAD / inventory only |
| `collective_control` | 2 | 113 | UNREAD / inventory only |
| `collective_name` | 1 | 15 | UNREAD / inventory only |
| `collective_teams` | 2 | 171 | UNREAD / inventory only |
| `collective_warning` | 2 | 152 | UNREAD / inventory only |
| `color` | 2 | 294 | UNREAD / inventory only |
| `companion_info` | 1 | 15 | UNREAD / inventory only |
| `conquer_condition` | 1 | 10 | UNREAD / inventory only |
| `construction_map` | 2 | 290 | UNREAD / inventory only |
| `container_helpers` | 1 | 37 | UNREAD / inventory only |
| `container_range` | 1 | 248 | UNREAD / inventory only |
| `content_factory` | 2 | 630 | selected spans only |
| `content_id` | 2 | 327 | UNREAD / inventory only |
| `controller` | 2 | 135 | UNREAD / inventory only |
| `corpse_info` | 1 | 15 | UNREAD / inventory only |
| `cost_info` | 2 | 49 | UNREAD / inventory only |
| `creature` | 2 | 3,545 | selected spans only |
| `creature_action` | 2 | 84 | UNREAD / inventory only |
| `creature_attributes` | 2 | 596 | selected spans only |
| `creature_debt` | 2 | 60 | UNREAD / inventory only |
| `creature_experience_info` | 2 | 70 | UNREAD / inventory only |
| `creature_factory` | 2 | 1,129 | UNREAD / inventory only |
| `creature_group` | 2 | 105 | UNREAD / inventory only |
| `creature_id` | 1 | 8 | UNREAD / inventory only |
| `creature_inventory` | 2 | 33 | UNREAD / inventory only |
| `creature_list` | 2 | 147 | UNREAD / inventory only |
| `creature_name` | 2 | 208 | UNREAD / inventory only |
| `creature_predicate` | 2 | 799 | UNREAD / inventory only |
| `creature_status` | 2 | 66 | UNREAD / inventory only |
| `creature_view` | 1 | 70 | UNREAD / inventory only |
| `custom_item_id` | 1 | 11 | UNREAD / inventory only |
| `dancing` | 2 | 167 | UNREAD / inventory only |
| `debug` | 2 | 178 | UNREAD / inventory only |
| `destroy_action` | 2 | 173 | UNREAD / inventory only |
| `directory_path` | 2 | 171 | UNREAD / inventory only |
| `drag_and_drop` | 2 | 70 | UNREAD / inventory only |
| `draw_line` | 2 | 52 | UNREAD / inventory only |
| `duel_state` | 1 | 9 | UNREAD / inventory only |
| `dummy_view` | 1 | 75 | UNREAD / inventory only |
| `dungeon_level` | 2 | 79 | UNREAD / inventory only |
| `effect` | 2 | 3,069 | UNREAD / inventory only |
| `effect_type` | 1 | 562 | UNREAD / inventory only |
| `encyclopedia` | 2 | 128 | UNREAD / inventory only |
| `enemy_aggression_level` | 1 | 7 | UNREAD / inventory only |
| `enemy_factory` | 2 | 142 | UNREAD / inventory only |
| `enemy_id` | 1 | 8 | UNREAD / inventory only |
| `enemy_info` | 2 | 157 | UNREAD / inventory only |
| `entity_map` | 2 | 279 | UNREAD / inventory only |
| `entity_set` | 2 | 176 | UNREAD / inventory only |
| `enum_variant` | 1 | 96 | UNREAD / inventory only |
| `enums` | 1 | 138 | UNREAD / inventory only |
| `equipment` | 2 | 224 | UNREAD / inventory only |
| `equipment_slot` | 1 | 17 | UNREAD / inventory only |
| `event_generator` | 2 | 81 | UNREAD / inventory only |
| `event_listener` | 1 | 42 | UNREAD / inventory only |
| `exit_info` | 1 | 7 | UNREAD / inventory only |
| `external_enemies` | 2 | 205 | UNREAD / inventory only |
| `external_enemies_type` | 1 | 8 | UNREAD / inventory only |
| `field_of_view` | 2 | 226 | UNREAD / inventory only |
| `file_path` | 2 | 130 | UNREAD / inventory only |
| `file_sharing` | 2 | 910 | UNREAD / inventory only |
| `fire` | 2 | 90 | UNREAD / inventory only |
| `font_id` | 1 | 11 | UNREAD / inventory only |
| `fontstash` | 2 | 873 | UNREAD / inventory only |
| `fps_counter` | 2 | 63 | UNREAD / inventory only |
| `framebuffer` | 2 | 81 | UNREAD / inventory only |
| `furnace` | 2 | 65 | UNREAD / inventory only |
| `furniture` | 2 | 1,028 | UNREAD / inventory only |
| `furniture_array` | 2 | 68 | UNREAD / inventory only |
| `furniture_click` | 2 | 65 | UNREAD / inventory only |
| `furniture_dropped_items` | 2 | 61 | UNREAD / inventory only |
| `furniture_entry` | 2 | 150 | UNREAD / inventory only |
| `furniture_factory` | 2 | 232 | UNREAD / inventory only |
| `furniture_layer` | 1 | 10 | UNREAD / inventory only |
| `furniture_list` | 2 | 53 | UNREAD / inventory only |
| `furniture_list_id` | 1 | 8 | UNREAD / inventory only |
| `furniture_on_built` | 2 | 206 | UNREAD / inventory only |
| `furniture_tick` | 2 | 144 | UNREAD / inventory only |
| `furniture_type` | 1 | 9 | UNREAD / inventory only |
| `furniture_usage` | 2 | 168 | UNREAD / inventory only |
| `fx_base` | 1 | 85 | UNREAD / inventory only |
| `fx_color` | 2 | 50 | UNREAD / inventory only |
| `fx_curve` | 2 | 161 | UNREAD / inventory only |
| `fx_defs` | 1 | 127 | UNREAD / inventory only |
| `fx_draw_buffers` | 2 | 80 | UNREAD / inventory only |
| `fx_emission_source` | 2 | 71 | UNREAD / inventory only |
| `fx_factory` | 1 | 1,914 | UNREAD / inventory only |
| `fx_info` | 2 | 115 | UNREAD / inventory only |
| `fx_manager` | 2 | 437 | UNREAD / inventory only |
| `fx_math` | 2 | 93 | UNREAD / inventory only |
| `fx_name` | 1 | 52 | UNREAD / inventory only |
| `fx_particle_system` | 2 | 406 | UNREAD / inventory only |
| `fx_rect` | 1 | 165 | UNREAD / inventory only |
| `fx_renderer` | 2 | 608 | UNREAD / inventory only |
| `fx_texture_factory` | 1 | 64 | UNREAD / inventory only |
| `fx_texture_name` | 1 | 35 | UNREAD / inventory only |
| `fx_variant_name` | 1 | 43 | UNREAD / inventory only |
| `fx_vec` | 2 | 182 | UNREAD / inventory only |
| `fx_view_manager` | 2 | 299 | UNREAD / inventory only |
| `game` | 2 | 1,186 | selected spans only |
| `game_config` | 2 | 158 | selected spans only |
| `game_event` | 1 | 170 | UNREAD / inventory only |
| `game_info` | 2 | 728 | UNREAD / inventory only |
| `game_save_type` | 1 | 12 | UNREAD / inventory only |
| `game_time` | 2 | 286 | UNREAD / inventory only |
| `gen_variant` | 1 | 142 | UNREAD / inventory only |
| `gen_variant_serialize` | 1 | 18 | UNREAD / inventory only |
| `gen_variant_serialize_pretty` | 1 | 29 | UNREAD / inventory only |
| `gender` | 2 | 86 | UNREAD / inventory only |
| `gui_builder` | 2 | 5,733 | selected spans only |
| `gui_elem` | 2 | 3,762 | UNREAD / inventory only |
| `gzstream` | 2 | 286 | UNREAD / inventory only |
| `hashing` | 1 | 108 | UNREAD / inventory only |
| `health_type` | 1 | 9 | UNREAD / inventory only |
| `highscores` | 2 | 146 | UNREAD / inventory only |
| `immigrant_auto_state` | 1 | 3 | UNREAD / inventory only |
| `immigrant_info` | 2 | 365 | UNREAD / inventory only |
| `immigration` | 2 | 783 | UNREAD / inventory only |
| `indexed_vector` | 1 | 106 | UNREAD / inventory only |
| `inhabitants_info` | 2 | 85 | UNREAD / inventory only |
| `input_queue` | 2 | 57 | UNREAD / inventory only |
| `intrinsic_attack` | 2 | 51 | UNREAD / inventory only |
| `inventory` | 2 | 285 | UNREAD / inventory only |
| `ioapi` | 2 | 252 | UNREAD / inventory only |
| `item` | 2 | 907 | UNREAD / inventory only |
| `item_ability` | 1 | 14 | UNREAD / inventory only |
| `item_action` | 1 | 23 | UNREAD / inventory only |
| `item_attributes` | 2 | 189 | UNREAD / inventory only |
| `item_class` | 1 | 13 | UNREAD / inventory only |
| `item_counts` | 1 | 6 | UNREAD / inventory only |
| `item_factory` | 2 | 74 | UNREAD / inventory only |
| `item_index` | 2 | 50 | UNREAD / inventory only |
| `item_list` | 2 | 127 | UNREAD / inventory only |
| `item_list_id` | 1 | 8 | UNREAD / inventory only |
| `item_prefix` | 2 | 249 | UNREAD / inventory only |
| `item_type` | 2 | 696 | UNREAD / inventory only |
| `item_types` | 1 | 142 | UNREAD / inventory only |
| `item_upgrade_info` | 2 | 83 | UNREAD / inventory only |
| `keeper_base_info` | 2 | 47 | UNREAD / inventory only |
| `keeper_creature_info` | 2 | 75 | UNREAD / inventory only |
| `key_verifier` | 2 | 50 | UNREAD / inventory only |
| `keybinding` | 1 | 9 | UNREAD / inventory only |
| `keybinding_info` | 1 | 9 | UNREAD / inventory only |
| `keybinding_map` | 2 | 308 | UNREAD / inventory only |
| `known_tiles` | 2 | 105 | UNREAD / inventory only |
| `lasting_effect` | 2 | 1,542 | UNREAD / inventory only |
| `lasting_or_buff` | 2 | 257 | UNREAD / inventory only |
| `layout_canvas` | 1 | 18 | UNREAD / inventory only |
| `layout_generator` | 2 | 616 | UNREAD / inventory only |
| `layout_mapping` | 1 | 99 | UNREAD / inventory only |
| `layout_mapping_id` | 1 | 8 | UNREAD / inventory only |
| `layout_renderer` | 2 | 110 | UNREAD / inventory only |
| `level` | 2 | 996 | UNREAD / inventory only |
| `level_builder` | 2 | 426 | UNREAD / inventory only |
| `level_maker` | 2 | 3,395 | UNREAD / inventory only |
| `main` | 1 | 547 | UNREAD / inventory only |
| `main_loop` | 2 | 1,678 | selected spans only |
| `map_gui` | 2 | 1,836 | UNREAD / inventory only |
| `map_layout` | 2 | 81 | UNREAD / inventory only |
| `map_layout_id` | 1 | 8 | UNREAD / inventory only |
| `map_layouts` | 2 | 57 | UNREAD / inventory only |
| `map_memory` | 2 | 116 | UNREAD / inventory only |
| `mem_usage_counter` | 1 | 162 | UNREAD / inventory only |
| `message_buffer` | 1 | 10 | UNREAD / inventory only |
| `message_generator` | 2 | 251 | UNREAD / inventory only |
| `minimap_gui` | 2 | 204 | UNREAD / inventory only |
| `minion_activity` | 2 | 477 | UNREAD / inventory only |
| `minion_activity_map` | 2 | 211 | UNREAD / inventory only |
| `minion_controller` | 2 | 194 | UNREAD / inventory only |
| `minion_equipment` | 2 | 401 | UNREAD / inventory only |
| `minion_equipment_type` | 1 | 12 | UNREAD / inventory only |
| `minion_page_index` | 2 | 117 | UNREAD / inventory only |
| `minion_trait` | 2 | 36 | UNREAD / inventory only |
| `miniunz` | 2 | 336 | UNREAD / inventory only |
| `mod_info` | 1 | 27 | UNREAD / inventory only |
| `model` | 2 | 595 | selected spans only |
| `model_builder` | 2 | 411 | UNREAD / inventory only |
| `monster` | 2 | 113 | UNREAD / inventory only |
| `monster_ai` | 2 | 1,462 | selected spans only |
| `mouse_button_id` | 1 | 5 | UNREAD / inventory only |
| `move_info` | 2 | 65 | UNREAD / inventory only |
| `movement_info` | 2 | 64 | UNREAD / inventory only |
| `movement_set` | 2 | 122 | UNREAD / inventory only |
| `movement_type` | 2 | 167 | UNREAD / inventory only |
| `msg_type` | 1 | 53 | UNREAD / inventory only |
| `music` | 2 | 170 | UNREAD / inventory only |
| `music_type` | 1 | 5 | UNREAD / inventory only |
| `my_containers` | 1 | 514 | UNREAD / inventory only |
| `name_generator` | 2 | 131 | UNREAD / inventory only |
| `name_generator_id` | 1 | 8 | UNREAD / inventory only |
| `navigation_flags` | 2 | 31 | UNREAD / inventory only |
| `opengl` | 2 | 298 | UNREAD / inventory only |
| `options` | 2 | 792 | UNREAD / inventory only |
| `owner_pointer` | 1 | 332 | UNREAD / inventory only |
| `parse_game` | 2 | 133 | selected spans only |
| `perlin_noise` | 2 | 80 | UNREAD / inventory only |
| `phylactery_info` | 1 | 11 | UNREAD / inventory only |
| `player` | 2 | 1,615 | selected spans only |
| `player_control` | 2 | 4,345 | UNREAD / inventory only |
| `player_info_action` | 1 | 12 | UNREAD / inventory only |
| `player_message` | 2 | 140 | UNREAD / inventory only |
| `portals` | 2 | 103 | UNREAD / inventory only |
| `position` | 2 | 1,560 | UNREAD / inventory only |
| `position_map` | 2 | 223 | UNREAD / inventory only |
| `position_matching` | 2 | 113 | UNREAD / inventory only |
| `pretty_archive` | 2 | 1,108 | selected spans only |
| `pretty_printing` | 2 | 166 | UNREAD / inventory only |
| `profiler` | 1 | 23 | UNREAD / inventory only |
| `progress` | 2 | 22 | UNREAD / inventory only |
| `progress_meter` | 2 | 56 | UNREAD / inventory only |
| `promotion_info` | 2 | 44 | UNREAD / inventory only |
| `random_layout_id` | 1 | 8 | UNREAD / inventory only |
| `read_write_array` | 1 | 94 | UNREAD / inventory only |
| `renderable` | 2 | 50 | UNREAD / inventory only |
| `renderer` | 2 | 1,226 | UNREAD / inventory only |
| `resource_counts` | 2 | 38 | UNREAD / inventory only |
| `resource_id` | 1 | 9 | UNREAD / inventory only |
| `resource_info` | 1 | 15 | UNREAD / inventory only |
| `resource_path` | 1 | 43 | UNREAD / inventory only |
| `retired_enemy_info` | 1 | 9 | UNREAD / inventory only |
| `retired_games` | 2 | 105 | UNREAD / inventory only |
| `save_file_info` | 1 | 18 | UNREAD / inventory only |
| `saved_game_info` | 2 | 68 | UNREAD / inventory only |
| `scripted_help_info` | 1 | 12 | UNREAD / inventory only |
| `scripted_ui` | 2 | 1,469 | UNREAD / inventory only |
| `scripted_ui_data` | 1 | 103 | UNREAD / inventory only |
| `scroll_position` | 2 | 108 | UNREAD / inventory only |
| `sdl` | 1 | 28 | UNREAD / inventory only |
| `sdl_event_generator` | 2 | 290 | UNREAD / inventory only |
| `sdl_keycodes` | 2 | 263 | UNREAD / inventory only |
| `sectors` | 2 | 271 | UNREAD / inventory only |
| `serialization` | 2 | 237 | selected spans only |
| `serialize_optional` | 1 | 60 | UNREAD / inventory only |
| `settlement_info` | 1 | 123 | UNREAD / inventory only |
| `shortest_path` | 2 | 549 | UNREAD / inventory only |
| `simple_game` | 2 | 168 | UNREAD / inventory only |
| `sokoban_input` | 2 | 65 | UNREAD / inventory only |
| `sound` | 2 | 74 | UNREAD / inventory only |
| `sound_library` | 2 | 59 | UNREAD / inventory only |
| `special_attr` | 1 | 12 | UNREAD / inventory only |
| `special_trait` | 2 | 152 | UNREAD / inventory only |
| `spectator` | 2 | 101 | UNREAD / inventory only |
| `spell` | 2 | 270 | UNREAD / inventory only |
| `spell_id` | 1 | 8 | UNREAD / inventory only |
| `spell_map` | 2 | 193 | UNREAD / inventory only |
| `spell_school` | 2 | 29 | UNREAD / inventory only |
| `spell_school_id` | 1 | 8 | UNREAD / inventory only |
| `square` | 2 | 354 | UNREAD / inventory only |
| `square_array` | 2 | 48 | UNREAD / inventory only |
| `square_attrib` | 1 | 28 | UNREAD / inventory only |
| `stack_printer` | 2 | 95 | UNREAD / inventory only |
| `stair_key` | 2 | 67 | UNREAD / inventory only |
| `statistics` | 2 | 100 | UNREAD / inventory only |
| `stb_truetype` | 2 | 2,068 | UNREAD / inventory only |
| `stdafx` | 1 | 154 | UNREAD / inventory only |
| `steam_achievements` | 2 | 30 | UNREAD / inventory only |
| `steam_base` | 2 | 189 | UNREAD / inventory only |
| `steam_call_result` | 2 | 105 | UNREAD / inventory only |
| `steam_client` | 2 | 159 | UNREAD / inventory only |
| `steam_friends` | 2 | 97 | UNREAD / inventory only |
| `steam_input` | 2 | 269 | UNREAD / inventory only |
| `steam_internal` | 1 | 13 | UNREAD / inventory only |
| `steam_ugc` | 2 | 568 | UNREAD / inventory only |
| `steam_user` | 2 | 35 | UNREAD / inventory only |
| `steam_utils` | 2 | 50 | UNREAD / inventory only |
| `storage_id` | 1 | 9 | UNREAD / inventory only |
| `storage_info` | 1 | 10 | UNREAD / inventory only |
| `storage_positions` | 2 | 82 | UNREAD / inventory only |
| `sunlight_info` | 2 | 102 | UNREAD / inventory only |
| `t_string` | 2 | 469 | UNREAD / inventory only |
| `target_type` | 1 | 7 | UNREAD / inventory only |
| `task` | 2 | 2,250 | UNREAD / inventory only |
| `task_callback` | 1 | 25 | UNREAD / inventory only |
| `task_map` | 2 | 404 | UNREAD / inventory only |
| `team_member_action` | 2 | 24 | UNREAD / inventory only |
| `team_order` | 2 | 48 | UNREAD / inventory only |
| `tech_id` | 1 | 8 | UNREAD / inventory only |
| `technology` | 2 | 134 | UNREAD / inventory only |
| `territory` | 2 | 131 | UNREAD / inventory only |
| `test` | 2 | 1,403 | UNREAD / inventory only |
| `test_struct` | 1 | 47 | UNREAD / inventory only |
| `text_serialization` | 1 | 83 | UNREAD / inventory only |
| `texture` | 2 | 249 | UNREAD / inventory only |
| `texture_id` | 1 | 40 | UNREAD / inventory only |
| `theoraplay` | 2 | 905 | UNREAD / inventory only |
| `theoraplay_cvtrgb` | 1 | 74 | UNREAD / inventory only |
| `tile` | 2 | 290 | UNREAD / inventory only |
| `tile_gas` | 2 | 134 | UNREAD / inventory only |
| `tile_gas_info` | 1 | 17 | UNREAD / inventory only |
| `tile_gas_type` | 1 | 9 | UNREAD / inventory only |
| `tile_info` | 1 | 48 | UNREAD / inventory only |
| `tile_paths` | 2 | 36 | UNREAD / inventory only |
| `tile_predicate` | 2 | 152 | UNREAD / inventory only |
| `tileset` | 2 | 508 | UNREAD / inventory only |
| `time_queue` | 2 | 307 | UNREAD / inventory only |
| `translations` | 2 | 259 | UNREAD / inventory only |
| `tribe` | 2 | 452 | UNREAD / inventory only |
| `tribe_alignment` | 2 | 21 | UNREAD / inventory only |
| `tutorial` | 2 | 367 | selected spans only |
| `tutorial_highlight` | 1 | 29 | UNREAD / inventory only |
| `tutorial_state` | 2 | 152 | UNREAD / inventory only |
| `unique_entity` | 2 | 178 | UNREAD / inventory only |
| `unknown_locations` | 2 | 48 | UNREAD / inventory only |
| `unlocks` | 2 | 70 | selected spans only |
| `unzip` | 2 | 1,944 | UNREAD / inventory only |
| `user_input` | 1 | 309 | UNREAD / inventory only |
| `util` | 2 | 3,154 | UNREAD / inventory only |
| `variant_serialize` | 1 | 98 | UNREAD / inventory only |
| `video` | 1 | 212 | UNREAD / inventory only |
| `view` | 2 | 369 | UNREAD / inventory only |
| `view_id` | 2 | 90 | UNREAD / inventory only |
| `view_index` | 2 | 389 | UNREAD / inventory only |
| `view_layer` | 1 | 14 | UNREAD / inventory only |
| `view_object` | 2 | 382 | UNREAD / inventory only |
| `view_object_action` | 2 | 69 | UNREAD / inventory only |
| `view_object_modifier` | 1 | 39 | UNREAD / inventory only |
| `village_action` | 1 | 5 | UNREAD / inventory only |
| `village_behaviour` | 2 | 295 | UNREAD / inventory only |
| `village_control` | 2 | 541 | UNREAD / inventory only |
| `villain_group` | 1 | 9 | UNREAD / inventory only |
| `villain_type` | 2 | 42 | UNREAD / inventory only |
| `visibility_map` | 2 | 90 | UNREAD / inventory only |
| `vision` | 2 | 67 | UNREAD / inventory only |
| `vision_id` | 1 | 9 | UNREAD / inventory only |
| `warlord_controller` | 2 | 216 | UNREAD / inventory only |
| `weapon_info` | 1 | 32 | UNREAD / inventory only |
| `window_view` | 2 | 1,436 | UNREAD / inventory only |
| `workshop_array` | 1 | 6 | UNREAD / inventory only |
| `workshop_info` | 1 | 21 | UNREAD / inventory only |
| `workshop_item` | 2 | 103 | UNREAD / inventory only |
| `workshop_type` | 1 | 10 | UNREAD / inventory only |
| `workshops` | 2 | 198 | UNREAD / inventory only |
| `world_map_info` | 1 | 11 | UNREAD / inventory only |
| `z_level_info` | 2 | 58 | UNREAD / inventory only |
| `zlevel` | 2 | 117 | UNREAD / inventory only |
| `zones` | 2 | 234 | UNREAD / inventory only |

### Source and content directory census

Every tracked file is counted once by its containing directory. Presence is verified; unlisted semantics remain unread. Full path/blob manifests remain privately in `extract/keeperrl-git-tree.txt`.

| Directory | Tracked files |
|---|---:|
| `.` | 656 |
| `.github` | 1 |
| `cmake` | 6 |
| `data_contrib` | 3 |
| `data_free` | 8 |
| `data_free/game_config` | 39 |
| `data_free/game_config/map_layouts/adoxie_temple` | 1 |
| `data_free/game_config/map_layouts/adoxie_vault` | 1 |
| `data_free/game_config/map_layouts/castle1` | 2 |
| `data_free/game_config/map_layouts/city` | 1 |
| `data_free/game_config/map_layouts/death` | 1 |
| `data_free/game_config/map_layouts/satan` | 1 |
| `data_free/game_config/map_layouts/wizard_tower` | 1 |
| `data_free/game_config/translations` | 2 |
| `data_free/images` | 17 |
| `data_free/images/ui` | 30 |
| `data_free/ui` | 60 |
| `extern` | 10 |
| `extern/cereal` | 4 |
| `extern/cereal/archives` | 5 |
| `extern/cereal/details` | 6 |
| `extern/cereal/external` | 1 |
| `extern/cereal/external/rapidjson` | 19 |
| `extern/cereal/external/rapidjson/error` | 2 |
| `extern/cereal/external/rapidjson/internal` | 12 |
| `extern/cereal/external/rapidjson/msinttypes` | 2 |
| `extern/cereal/external/rapidxml` | 6 |
| `extern/cereal/types` | 24 |
| `extern/cereal/types/concepts` | 1 |
| `mac` | 1 |
| `mac/keeper.xcodeproj` | 1 |
| `obj` | 1 |
| `obj-opt` | 1 |
| `obj-opt/extern` | 1 |
| `obj/extern` | 1 |
| `server` | 11 |
