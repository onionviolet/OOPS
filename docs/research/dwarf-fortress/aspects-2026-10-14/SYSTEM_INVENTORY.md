# System inventory

The census covers all shipped nonprivate file paths and every retained TXT/Lua file, not every native function. Numbers are lexical size signals, not semantic review. A module can contain several systems. No installation, active-mod claim or runtime observation follows. Source root: private extract/payload; receipts: notes/inventory.json, text-census.json, text-sets.json and native-targets.json.

## All shipped vanilla content groups found

Each row names its exact home beneath data/vanilla/. TXT/Lua count includes info files and examples; images/audio are counted separately below. Top token counts include Lua strings, so only direct raw declarations should be used as content record counts. Prior coverage means at least one prior selected span, not whole-module review.

| Home / distinct authoring system | Text/Lua files | Physical lines | Size signals | Prior lane | This pass |
|---|---:|---:|---|---|---|
| `examples and notes` | 3 | 221 | NAME 8, DESCRIPTION 8, REAGENT 5 | selected | Inventory only, except named aspect samples |
| `interaction examples` | 9 | 525 | CDI 57, CE 33, I_TARGET 24 | **undocumented previously** | Inventory only, except named aspect samples |
| `readme.txt` | 1 | 5 | example/readme text | **undocumented previously** | Inventory only, except named aspect samples |
| `vanilla_bodies` | 5 | 3,491 | BP 996, CATEGORY 996, DEFAULT_RELSIZE 996 | selected | Inventory only, except named aspect samples |
| `vanilla_buildings` | 2 | 64 | TILE 14, COLOR 14, BLOCK 4 | selected | Inventory only, except named aspect samples |
| `vanilla_buildings_graphics` | 8 | 5,114 | TILE_GRAPHICS 4,874, TILE_PAGE 24, FILE 24 | **undocumented previously** | Inventory only, except named aspect samples |
| `vanilla_creatures` | 36 | 50,075 | APPLY_CREATURE_VARIATION 3,585, BODY_DETAIL_PLAN 2,230, USE_MATERIAL_TEMPLATE 1,656 | selected | Inventory only, except named aspect samples |
| `vanilla_creatures_extinct` | 11 | 12,667 | APPLY_CREATURE_VARIATION 1,130, BODY_DETAIL_PLAN 566, USE_MATERIAL_TEMPLATE 447 | **undocumented previously** | Inventory only, except named aspect samples |
| `vanilla_creatures_extinct_graphics` | 63 | 7,105 | LAYER_SET 500, CREATURE_GRAPHICS 400, LAYER_GROUP 400 | **undocumented previously** | Inventory only, except named aspect samples |
| `vanilla_creatures_graphics` | 61 | 100,048 | LAYER 14,968, USE_PALETTE 9,691, CONDITION_TISSUE_LAYER 5,064 | **undocumented previously** | Inventory only, except named aspect samples |
| `vanilla_descriptors` | 6 | 2,548 | CP_COLOR 707, COLOR_PATTERN 285, PATTERN 285 | **undocumented previously** | Inventory only, except named aspect samples |
| `vanilla_descriptors_graphics` | 4 | 225 | PALETTE_COLOR 136, SHAPE_GRAPHICS_LARGE_GEM 22, SHAPE_GRAPHICS_SMALL_GEM 22 | **undocumented previously** | Inventory only, except named aspect samples |
| `vanilla_entities` | 2 | 2,246 | PERMITTED_REACTION 313, PERMITTED_JOB 202, VALUE 165 | selected | Inventory only, except named aspect samples |
| `vanilla_environment` | 7 | 4,766 | TILE_GRAPHICS 4,195, TILE_PAGE 88, FILE 88 | **undocumented previously** | Inventory only, except named aspect samples |
| `vanilla_interactions` | 2 | 82 | I_TARGET 12, IE_TARGET 12, IT_LOCATION 10 | **undocumented previously** | Inventory only, except named aspect samples |
| `vanilla_interactions_graphics` | 3 | 28 | INTERACTION_GRAPHICS 3, LIST_ICON 3, OBJECT 2 | **undocumented previously** | Inventory only, except named aspect samples |
| `vanilla_interface` | 11 | 8,460 | TILE_GRAPHICS 3,648, ASCII_GRAPHICS 2,258, ASCII_RECTANGLE 894 | **undocumented previously** | Names/declarations only; no renderer claim |
| `vanilla_items` | 14 | 1,365 | NAME 113, MATERIAL_SIZE 96, ATTACK 79 | selected | Inventory only, except named aspect samples |
| `vanilla_items_graphics` | 6 | 1,730 | TILE_GRAPHICS 803, PROCEDURAL_ITEM_GRAPHICS 148, TILE_PAGE 39 | **undocumented previously** | Inventory only, except named aspect samples |
| `vanilla_languages` | 7 | 31,975 | T_WORD 8,784, S_WORD 3,198, WORD 2,196 | **undocumented previously** | Counts plus grammatical schema sample |
| `vanilla_materials` | 8 | 6,808 | STATE_COLOR 474, DISPLAY_COLOR 336, SOLID_DENSITY 334 | selected | Inventory only, except named aspect samples |
| `vanilla_music` | 3 | 268 | FILE 47, CARD 46, MUSIC 29 | **undocumented previously** | Music/sound declarations read; D2 deeper read |
| `vanilla_plants` | 6 | 11,025 | USE_MATERIAL_TEMPLATE 997, STATE_COLOR 596, DISPLAY_COLOR 550 | selected | Inventory only, except named aspect samples |
| `vanilla_plants_graphics` | 8 | 8,263 | TREE_TILE 4,688, TILE_GRAPHICS 805, GROWTH 408 | **undocumented previously** | Inventory only, except named aspect samples |
| `vanilla_procedural` | 18 | 16,638 | CDI 182, IS_CDI 118, PERSONALITY 88 | selected | Selected entry/weight/provenance reread |
| `vanilla_reactions` | 5 | 1,740 | REAGENT 314, PRODUCT 163, NAME 160 | selected | Inventory only, except named aspect samples |
| `vanilla_text` | 65 | 732 | NAME 150, CONTEXT 70, OBJECT 64 | **undocumented previously** | All object files read; D1 deeper read |
| `vanilla_world_map` | 3 | 3,404 | TILE_GRAPHICS 3,183, TILE_PAGE 20, FILE 20 | **undocumented previously** | Inventory only, except named aspect samples |

## Distinct subsystems and boundaries within those groups

The table expands the content groups into the systems actually identified. Source claims remain scoped to the named declarations, comments or static bodies. Unread native families are included so they cannot disappear behind the module census.

| ID | System/subsystem | Home / size signal | Existing coverage and current status |
|---|---|---|---|
| S01 | Contextual dialogue and small talk | vanilla_text; 64 sets, 99 speaker/audience/context substitutions | NEW D1; full supplied text layer, native selection unread |
| S02 | Book-title authoring and other text fragments | vanilla_text; 155 instruction and 18 art title patterns | NEW; title generation rules only |
| S03 | Language lexemes, translations, semantic symbols | vanilla_languages; 2,196 WORD, 8,784 T_WORD, 3,198 S_WORD | Previously unread; census/schema sample, not full linguistic semantics |
| S04 | Raw text registration | Native 0x14131de00; one useful function | NEW partial static loader |
| S05 | Fixed text-set case selection | Native 0x14131e4f0; one incomplete switch | NEW attempted; jump table unresolved |
| S06 | Generation phases and provenance | init/generators.lua; 827 lines | Prior DF-C01; selected joins confirmed |
| S07 | Candidate enumeration and weighting | init/globals.lua; 638 lines | Prior DF-C01; selected 1-66 and 258-283 |
| S08 | Generated creature body/profile/depiction | procedural generators/creatures; shared_info and rcp | Prior DF-C02/C03; whole catalogs unread |
| S09 | Generated divine materials and items | procedural materials/items/entities | Prior selected; dormant/TODO boundaries preserved |
| S10 | Generated powers, curses, blessings, secrets | procedural interactions/* | Prior DF-C08/C09; all combinations unread |
| S11 | Anatomy, topology and tissue healing | bodies + creature records | Prior DF-C07; 996 BP occurrences in body-module text |
| S12 | Natural attacks and weapon modes | creatures + items/item_weapon.txt | Prior DF-C07; resolver unread |
| S13 | Clothing, armor and tool definitions | items; 14 module text files including info | Partial prior item chains; catalog inventory only |
| S14 | Material physics, temperature and value | materials; 265 INORGANIC occurrences | Prior DF-C04; equations unread |
| S15 | Workshop construction and work tiles | buildings; 2 workshop and 1 furnace definitions in building_custom.txt | Prior DF-C06 |
| S16 | Reactions, reusable tools and source-specific outputs | reactions; 159 REACTION declarations | Prior DF-C04/C05/C10; most catalog not reviewed |
| S17 | Book media, writing and artifact transfer | reaction_other.txt:333-437 | Prior DF-C10; reading/writing engines unread |
| S18 | Institutions, appointments and succession | entities/entity_default.txt | Prior DF-C11; runtime succession unread |
| S19 | Ethics, values and permission lists | entities; 132 ETHIC, 165 VALUE token occurrences in module text | Prior DF-C06/C12; enforcement unread |
| S20 | Accounting, appraisal and medical information | entities:636-689 | Prior DF-C11; native precision unread |
| S21 | Plants, crops, seasons and material products | plants; 408 GROWTH occurrences | Prior selected ecology/production; bulk unread |
| S22 | Active/extinct creature catalogs and habitats | creatures + extinct; 62,742 module lines | Partial prior species/body selections; bulk unread |
| S23 | Hauling storage preference | d_init_default.txt:49-61; five discount settings | NEW D3; comment-level formula only |
| S24 | Traffic/pathfinding preferences | d_init_default.txt:49-52; four weights | Newly read defaults; native search unread |
| S25 | Population, pregnancy, visitors and seed limits | d_init_default.txt:63-79 | Newly read defaults; enforcement unread |
| S26 | Calendar, life stages and actor activity phases | creature_standard:213-301; init settings | Data inputs only; native calendar/queue unread |
| S27 | Retention/culling and simulation threading | d_init_default:119-127 | STATED defaults; runtime guarantees unread |
| S28 | Autosave, compression and manual retention | init/d_init defaults; three stated rotating slots | Extended prior DF-P02; serializer unread |
| S29 | Save and load diagnostics | Native 0x14154919c / 0x14157c890; two useful handlers | NEW static partial, no fixture or rollback proof |
| S30 | Announcement routing and report association | init/announcements.txt; 353 records | NEW D2; event producers/dispatcher unread |
| S31 | Keyboard bindings, repeats and log focus | init/interface.txt; 914 BIND records | NEW declarations; usability unverified |
| S32 | Event music, context music and shuffled cards | music_standard; 29 MUSIC, 46 CARD tokens | NEW D2; playback/deck state unread |
| S33 | Sounds and environmental triggers | sound_standard; 18 SOUND, 16 ANNOUNCEMENT tokens | NEW D2; spatial runtime unread |
| S34 | Creature/equipment/corpse/statue graphical layers | creature graphics modules; 100,048 active-module text lines | Prior depiction join only; bulk conditions unread |
| S35 | Item/material/descriptor graphic selection | items/descriptors graphics | Inventory only |
| S36 | Buildings/environment/world-map rendering | corresponding graphics modules | Inventory only |
| S37 | Interface icons, announcements and combat animation | vanilla_interface; 8,460 text lines | Inventory/sample only; no visual acceptance |
| S38 | Module metadata, compatibility and authoring examples | info.txt + examples/interaction examples | Selected metadata; dependency resolution unread |
| S39 | Tutorial, embark and staged access | defaults + release notes | STATED fragments only; native flow unread |
| S40 | Individual AI, jobs, combat collision and faction plans | Native executable, 26,507,264 bytes total | Unread engine families, no class-count coverage |
| S41 | Worldgen terrain/history, offscreen simulation and economy | Native executable; exposed worldgen call boundary only | Unread engine families |
| S42 | Historical records, discoveries and narrative recall | text references + native string inventory | Exact durable representation unread |
| S43 | Achievements, collections and minigames | No dedicated readable table identified | Unread/undetermined; not claimed absent |

## Other payload

One executable, 12 DLLs, one BAT file, 605 PNGs, seven BMPs, 1,728 OGGs and two extensionless files. BAT, DLL, image and audio bodies were not run/decoded. Definitions reference rendering/audio assets; file count does not prove quality or reachability. data/installed_mods was observed as a directory, but this pass does not assert any active user mod configuration. No private directories were entered.

Top three newly documented systems by reusable payoff: D1 contextual text, D2 event/report/audio routing, D3 storage-target discounts. See DEEPER_SYSTEMS.md. Save diagnostics remain a priority partial finding rather than an invented complete format audit.
