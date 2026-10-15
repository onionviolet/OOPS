# System inventory

2026-10-14. Bounded installed-build census. This inventories all distinct systems identified in the archive/text/native-name pass, not every possible feature of the entire game. Only named decoded bodies earn native implementation evidence. Names alone earn inventory evidence. Counts are records or symbol-family counts, never assumed active gameplay entities.

## Installed text tables

| Table | Records | Empty English | Documented here |
|---|---:|---:|---|
| `accessories.csv` | 388 | 0 | Inventory only; mechanics unread |
| `achievements.csv` | 10570 | 0 | Inventory only; mechanics unread |
| `battle.csv` | 256 | 0 | Inventory only; mechanics unread |
| `bosses.csv` | 597 | 0 | Inventory only; mechanics unread |
| `cards.csv` | 465 | 0 | Inventory only; mechanics unread |
| `codex.csv` | 341 | 0 | A01-A12 |
| `creatures.csv` | 1612 | 0 | A08 |
| `decorations.csv` | 2775 | 0 | Inventory only; mechanics unread |
| `dialog.csv` | 269 | 0 | A01 |
| `dialog_story.csv` | 892 | 0 | A01/A02 |
| `items.csv` | 3220 | 0 | Inventory only; mechanics unread |
| `lore.csv` | 1376 | 0 | A02 |
| `masters.csv` | 312 | 0 | Inventory only; mechanics unread |
| `misc.csv` | 80 | 0 | Inventory only; mechanics unread |
| `overworld.csv` | 431 | 0 | A01/A12 |
| `perks.csv` | 1322 | 0 | A08/build digest |
| `personality.csv` | 1120 | 0 | Inventory only; mechanics unread |
| `projects.csv` | 258 | 0 | A12 |
| `quests.csv` | 1062 | 121 | A02 |
| `skins.csv` | 834 | 0 | Inventory only; mechanics unread |
| `spells.csv` | 1494 | 0 | Inventory only; mechanics unread |
| `traits.csv` | 4341 | 0 | A08/build digest |
| `ui.csv` | 3073 | 0 | A06/A10/A11 |
| `vocabulary.csv` | 480 | 0 | Inventory only; mechanics unread |

All 24 full tables are copied privately; their parsed English/tag indexes and source hashes make later dialogue and balance reads possible without recollecting them. Name/description pairs, references, empty cells and future placeholders can inflate totals.

## Native system families

| Subsystem | Evidence / size signal | Coverage |
|---|---|---|
| Battle events | 46 named native symbols, `gml_Script_bc_Event` | A03/A08; exact dispatcher unread |
| Battle reactions | 13 named native symbols, `gml_Script_bc_On` | A03/A08; bodies unread |
| Other battle mechanics | 230 named native symbols, `gml_Script_bc_` | Inventory; overlaps events/reactions, not additive |
| Inventory and artifact/gem/item APIs | 156 named native symbols, `gml_Script_inv_` | A06/A08; full body audit unread |
| Saved domain encoders | 9 named native symbols, `gml_Script_save_` | A04; separate from whole-save atomicity |
| Saved domain decoders | 9 named native symbols, `gml_Script_load_` | A04; migrations/recovery unread |
| Battle macro control | 14 named native symbols, `gml_Script_scr_(?:Macro|HandleMacro)` | A05; help read, full native flow unread |
| Realm properties and boosts | 16 named native symbols, `gml_Script_scr_(?:Realm|AddRealm|CountRealm|ResetRealm|GetRandomRealm)` | Realm digest/NATIVE_TRACE |
| Biome identity and pools | 6 named native symbols, `gml_Script_scr_(?:Biome|GodBiome|SetBiome|GetRaceArrayByRealm|GetRandomBiome)` | Realm digest/NATIVE_TRACE |
| Fusion | 5 named native symbols, `gml_Script_scr_.*Fusion` | Build digest/NATIVE_TRACE |
| God favor, boss, altar and shop support | 29 named native symbols, `gml_Script_scr_.*God` | A12; complete economy unread |
| Quest helpers | 17 named native symbols, `gml_Script_scr_.*Quest` | A02; full gate graph unread |
| Text engine Scribble | 389 named native symbols, `gml_Script_.*[Ss]cribble` | A03; library detected, not adopted |
| GMLive/compiler parser support | 246 named native symbols, `gml_Script_.*(?:GMLive|gml_parser|ast_gml)` | A03/A07; not a player mod API |

## Authored database entry points

Each row is a distinct compiled entry point found in the native symbol census. Large functions may represent many records; no row-count estimate is inferred from code size. All bodies in this list are unread unless NATIVE_TRACE explicitly says otherwise.

| Function | Address (arm64 original) | Coverage |
|---|---|---|
| `scr_DatabaseNPCs` | `0x0000000104e97a64` | Inventory only |
| `scr_DatabaseCards` | `0x0000000102332928` | Inventory only |
| `scr_DatabaseFlags` | `0x0000000103508e24` | Inventory only |
| `scr_DatabaseMusic` | `0x0000000103909a08` | Inventory only |
| `scr_DatabasePerks` | `0x0000000103b1e410` | Inventory only |
| `scr_DatabaseRunes` | `0x0000000103f4b9a0` | Inventory only |
| `scr_DatabaseSkins` | `0x0000000103f53ff4` | Inventory only |
| `scr_DatabaseStats` | `0x00000001047ac1dc` | Inventory only |
| `scr_DatabaseTiers` | `0x00000001047ac558` | Inventory only |
| `scr_DatabaseWalls` | `0x00000001047e6d9c` | Inventory only |
| `scr_DatabaseColors` | `0x0000000102332a38` | Inventory only |
| `scr_DatabaseFloors` | `0x0000000103508f34` | Inventory only |
| `scr_DatabaseQuests` | `0x0000000103eccdec` | Inventory only |
| `scr_DatabaseTitles` | `0x00000001047d71a0` | Inventory only |
| `scr_DatabaseCooking` | `0x0000000102336254` | Inventory only |
| `scr_DatabaseWeather` | `0x00000001047eb050` | Inventory only |
| `scr_DatabaseBreeding` | `0x0000000102332818` | Inventory only |
| `scr_DatabaseCreature` | `0x000000010233ecb4` | Inventory only |
| `scr_DatabaseGodShops` | `0x0000000103513d3c` | Inventory only |
| `scr_DatabasePassives` | `0x0000000103927f04` | Inventory only |
| `scr_DatabaseProjects` | `0x0000000103d9a33c` | Inventory only |
| `scr_DatabaseCreature2` | `0x000000010252e14c` | Inventory only |
| `scr_DatabaseCreature3` | `0x00000001026f02a0` | Inventory only |
| `scr_DatabaseCreature4` | `0x00000001028c4e9c` | Inventory only |
| `scr_DatabaseMaterials` | `0x0000000103513e4c` | Inventory only |
| `scr_DatabasePassives2` | `0x00000001039af9b8` | Inventory only |
| `scr_DatabasePassives3` | `0x0000000103aff598` | Inventory only |
| `scr_DatabaseSpellGems` | `0x00000001040e9e18` | Inventory only |
| `scr_DatabaseMaterials2` | `0x00000001036bb0b8` | Inventory only |
| `scr_DatabaseMaterials3` | `0x00000001038c688c` | Inventory only |
| `scr_DatabaseSpellGems2` | `0x00000001042f2f94` | Inventory only |
| `scr_DatabaseSpellGems3` | `0x00000001044e6948` | Inventory only |
| `scr_DatabaseSpellGems4` | `0x00000001047040f4` | Inventory only |
| `scr_DatabaseSpellGems5` | `0x0000000104785760` | Inventory only |
| `scr_DatabaseAccessories` | `0x0000000101430840` | Inventory only |
| `scr_DatabaseBackgrounds` | `0x00000001023151b0` | Inventory only |
| `scr_DatabaseDecorations` | `0x0000000102b2913c` | Inventory only |
| `scr_DatabaseAchievements` | `0x0000000101ea0400` | Inventory only |
| `scr_DatabaseDecorations2` | `0x0000000102dec080` | Inventory only |
| `scr_DatabaseDecorations3` | `0x0000000103005c38` | Inventory only |
| `scr_DatabaseDecorations4` | `0x00000001032897f8` | Inventory only |
| `scr_DatabaseAchievements1` | `0x0000000101ea0510` | Inventory only |
| `scr_DatabaseAchievements2` | `0x0000000101fb5628` | Inventory only |
| `scr_DatabaseAchievements3` | `0x0000000102023e90` | Inventory only |
| `scr_DatabaseAchievements4` | `0x00000001020907fc` | Inventory only |
| `scr_DatabaseAchievements5` | `0x00000001020fa664` | Inventory only |
| `scr_DatabaseAchievements6` | `0x000000010216b498` | Inventory only |
| `scr_DatabaseAchievements7` | `0x00000001021d3dfc` | Inventory only |
| `scr_DatabaseAchievements8` | `0x0000000102240ba8` | Inventory only |
| `scr_DatabaseAchievements9` | `0x00000001022a9df0` | Inventory only |
| `scr_DatabaseAchievements10` | `0x0000000101f0c6f4` | Inventory only |
| `scr_DatabaseAchievements11` | `0x0000000101f8fd2c` | Inventory only |
| `scr_DatabaseAchievementMain` | `0x00000001018129f0` | Inventory only |
| `scr_DatabaseAchievementFulfillment` | `0x0000000101461d60` | Inventory only |

## Object/room subsystems

| System | Size / names | Coverage |
|---|---|---|
| Object resources | 1160 OBJT records | Full private index; selected encounter/menu identities read |
| Script resources | 5785 SCPT records | Full private index; includes wrappers and libraries |
| Native GML bodies | 8648 named script/object bodies | Full private index; selected targets only |
| Generated realms | One generic `realm` ROOM | Shared template, full generator unread |
| Boss rooms | 30 named `boss_` templates | Inventory only |
| Nether side rooms | 30 named templates | Treasure, risk, cards, valves, projects, knowledge, relics and taverns; mechanics mostly unread |
| Castle/service rooms | `castle_throneroom`, `castle_TEMPLATE`, smith/enchant, tutorial, arena | A12; home utility stated |
| Realm-specific objects | Lab machines/parts, Hive games, Gallery art, cocoons, rituals | Realm digest; not every object condition decoded |
| Menu/filter/inspect | `obj_filter`, inventory/achievement/quest filters, battle creature/menu objects | A06; draw/input execution unrun |
| Audio and atmosphere | Realm-named OGG loops/cues, weather table, text libraries | Resource presence; no audio playback or mechanical climate proof |

## Highest-payoff undocumented consumers

D1: actual property/pool generation and local encounter conditions; D2: battle trigger ordering, exemptions and queue termination; D3: complete save/domain/instance retention and failure recovery. See [DEEPER_SYSTEMS](DEEPER_SYSTEMS.md). These are research gaps, not added gameplay gates.
