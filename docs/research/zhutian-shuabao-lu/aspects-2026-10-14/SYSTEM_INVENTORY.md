# System inventory

Scope: every shipped Construct array table is inventoried below, plus the main event-system and scene/battle subsystems found in this pass. Shapes are allocated capacity, including sentinel/blank rows; not active content counts. The 1,782 named groups include individual click handlers and formulas, so they are not counted as 1,782 distinct gameplay systems. Their complete private path index is `notes/event-groups.tsv`.

Documented means this lane covered the named scope. No complete all-row semantic audit is claimed. Undocumented joins and named gaps remain in CHECKPOINT.

## Data tables

| File | Shape x/y/z | System or best current reading | Documentation |
|---|---|---|---|
| `bk.json` | 73/4/1 | Treasure exchange references | Documented at system level; individual rows not all decoded |
| `bm.json` | 11/5/1 | Company departments | Documented at system level; individual rows not all decoded |
| `buff.json` | 68/15/1 | Combat statuses | Documented at system level; individual rows not all decoded |
| `bz.json` | 59/62/1 | Help and system explanations | Documented at system level; individual rows not all decoded |
| `cj.json` | 166/23/1 | Places/scenes | Documented at system level; individual rows not all decoded |
| `cscz.json` | 52/20/1 | Late-game numeric grid, precise column meanings unread | INVENTORIED; semantic joins PARTIAL/UNDOCUMENTED |
| `csdj.json` | 55/69/1 | Late-game advancement grid, precise column meanings unread | INVENTORIED; semantic joins PARTIAL/UNDOCUMENTED |
| `cszb.json` | 82/27/1 | Late-game equipment/reference grid, precise column meanings partial | INVENTORIED; semantic joins PARTIAL/UNDOCUMENTED |
| `dh.json` | 171/13/1 | Scripted dialogue | Documented at system level; individual rows not all decoded |
| `dhmb.json` | 18/16/1 | Service dialogue templates | Documented at system level; individual rows not all decoded |
| `dl.json` | 31/463/1 | Enemy-indexed drops, axes confirmed by consumer | Documented at system level; individual rows not all decoded |
| `dr.json` | 463/15/1 | Enemy definitions | Documented at system level; individual rows not all decoded |
| `drsx.json` | 11/8/1 | Enemy stat templates | Documented at system level; individual rows not all decoded |
| `fb.json` | 31/28/1 | Large dungeon definitions | Documented at system level; individual rows not all decoded |
| `fbcj.json` | 39/22/1 | Dungeon reward/location references, partial | INVENTORIED; semantic joins PARTIAL/UNDOCUMENTED |
| `fw.json` | 600/21/1 | Target/area data, full geometry semantics unread | INVENTORIED; semantic joins PARTIAL/UNDOCUMENTED |
| `gg.json` | 4/31/1 | Announcements/credits | Documented at system level; individual rows not all decoded |
| `gs.json` | 7/7/1 | Rift/military buildings | Documented at system level; individual rows not all decoded |
| `gxdh.json` | 17/85/1 | Faction exchange grid, detailed joins unread | INVENTORIED; semantic joins PARTIAL/UNDOCUMENTED |
| `hh.json` | 296/18/1 | Cosmetic transformations and credits | Documented at system level; individual rows not all decoded |
| `ht.json` | 9/12/1 | Tower themes and encounters | Documented at system level; individual rows not all decoded |
| `jn.json` | 378/52/1 | Combat skills | Documented at system level; individual rows not all decoded |
| `jnz.json` | 35/5/1 | Skill-group reference grid, detailed join unread | INVENTORIED; semantic joins PARTIAL/UNDOCUMENTED |
| `jpdh.json` | 22/29/1 | Exchange reference grid, exact role partial | INVENTORIED; semantic joins PARTIAL/UNDOCUMENTED |
| `js.json` | 194/37/1 | Actor templates | Documented at system level; individual rows not all decoded |
| `jst.json` | 37/9/1 | Character/reference group grid, exact role partial | INVENTORIED; semantic joins PARTIAL/UNDOCUMENTED |
| `jz.json` | 26/30/1 | City buildings | Documented at system level; individual rows not all decoded |
| `kj.json` | 76/17/1 | Research/technology | Documented at system level; individual rows not all decoded |
| `lau.json` | 5220/3/1 | Translation strings | Documented at system level; individual rows not all decoded |
| `ls.json` | 49/23/1 | Spirit beasts | Documented at system level; individual rows not all decoded |
| `lsjn.json` | 145/5/1 | Beast skills/reference data | Documented at system level; individual rows not all decoded |
| `mc.json` | 75/35/1 | Name pool | Documented at system level; individual rows not all decoded |
| `mg.json` | 321/15/1 | Destiny configurations | Documented at system level; individual rows not all decoded |
| `mj.json` | 22/42/1 | Secret realms | Documented at system level; individual rows not all decoded |
| `mm.json` | 1000/5/1 | Mixed lookup/reference grid, full role unread | INVENTORIED; semantic joins PARTIAL/UNDOCUMENTED |
| `mp.json` | 38/9/1 | Destiny-board references | Documented at system level; individual rows not all decoded |
| `ms.json` | 379/11/1 | Destiny stone affix/stat references | Documented at system level; individual rows not all decoded |
| `pf.json` | 692/19/1 | Recipes | Documented at system level; individual rows not all decoded |
| `qh.json` | 133/8/1 | Special affix definitions | Documented at system level; individual rows not all decoded |
| `rw.json` | 28/16/1 | Repeatable task templates | Documented at system level; individual rows not all decoded |
| `save.json` | 1/1/1 | Zero-state save template, not user save | Documented at system level; individual rows not all decoded |
| `shili.json` | 43/26/1 | Factions/services | Documented at system level; individual rows not all decoded |
| `sj.json` | 6/34/1 | Divine-world locations | Documented at system level; individual rows not all decoded |
| `sl.json` | 21/12/1 | Hunting target/reward data | Documented at system level; individual rows not all decoded |
| `sldh.json` | 115/5/1 | Rift exchange references | Documented at system level; individual rows not all decoded |
| `sq.json` | 160/14/1 | Encounter region definitions | Documented at system level; individual rows not all decoded |
| `ss.json` | 73/12/1 | Shop/production facilities | Documented at system level; individual rows not all decoded |
| `sw.json` | 29/14/1 | Divine positions | Documented at system level; individual rows not all decoded |
| `sx.json` | 203/12/1 | Stat definitions and display rules | Documented at system level; individual rows not all decoded |
| `tgzw.json` | 11/5/1 | Divine-position reference grid, exact rule partial | INVENTORIED; semantic joins PARTIAL/UNDOCUMENTED |
| `tz.json` | 387/23/1 | Traits/talents | Documented at system level; individual rows not all decoded |
| `wm.json` | 14/34/1 | Plane definitions | Documented at system level; individual rows not all decoded |
| `wmdh.json` | 30/5/1 | Plane exchange references | Documented at system level; individual rows not all decoded |
| `wp.json` | 1793/40/1 | Items/equipment | Documented at system level; individual rows not all decoded |
| `yjdh.json` | 11/113/1 | Relic/exchange grid, detailed joins unread | INVENTORIED; semantic joins PARTIAL/UNDOCUMENTED |
| `zbct.json` | 51/22/1 | Equipment affix grid | Documented at system level; individual rows not all decoded |
| `zh.json` | 10/13/1 | Summoning references | Documented at system level; individual rows not all decoded |
| `zs.json` | 14/17/1 | World guardians | Documented at system level; individual rows not all decoded |
| `zx.json` | 25/16/1 | Numeric layout/reference grid, exact rule unread | INVENTORIED; semantic joins PARTIAL/UNDOCUMENTED |
| `zy.json` | 42/33/1 | Career definitions | Documented at system level; individual rows not all decoded |

## Event systems and subsystems

Root `M` = `data.json: project/6/0/1`; `B` = `project/6/5/1`. All rows are SHOWN group/handler structure, not proof of complete behavior.

| System / subsystems found | Locator and size signal | Lane coverage |
|---|---|---|
| Initialization, data loading and preprocessing | M/155/8/0..2 | Architecture partial; all transforms unread |
| Menu, manual/auto/backup saves, settings, resolution, volume and filters | M/155/8/3; 21 child groups | Save paths and settings partial |
| Translation, code redemption, spirit-wandering mode, dialogue, choices, messages, number formatting, numeric input, drag control, time | M/155/8/4; 11 child groups | Dialogue/time and compact online display partial; full idle policy unread |
| DLC recognition/support packages and repair mechanisms | M/155/8/5..6 | Inventoried only; files/entitlement logic unread |
| Top status, contribution popup, cursor, combat power refresh | M/156 | UI partial |
| Aggregation from equipment, skill, cosmetic, stones, deputy, beasts, destiny, career, stats, specialization and weapon proficiency | M/157/8/1; 17 child groups | Shared growth architecture partial; formulas incomplete |
| Actor lists, equipment, careers, skills, destiny, deputy, detailed stats, work position, paging and filters | M/157/8/2; 35 records | Power/UI partial; deputy arithmetic unread |
| Beast acquisition, contracts, generated quality, skill tips and collection repair | M/157/8/3; ls/lsjn | Inventoried/help partial; genetics or autonomy not established |
| Inventory, item/affix tips, equipment, stones, manuals, recipes, cosmetics, contracts, stack/add/remove, disposal, locks, sets and comparison | M/157/8/4; 39 records | Loot/manual/UI partial; full item transaction unread |
| Company overview, assets, teams, finances/rent, departments and staffing | M/157/8/5; bm/jz/kj/ss | Economic loop/help partial |
| Plane book, destiny editing, collection, treasure exchange, achievements and claims | M/157/8/6; 18 records | Meta loop and unlock partial |
| Home/plane/otherworld entry, fog, map nodes, selection, party grouping, difficulty, training and quick travel | M/157/8/7; 28 records | Entry consumer read; exhaustive border policy unread |
| Scene entry/exit, conversation, function buttons and service routing | M/157/8/8 | Institution/home-service loop partial |
| Prices, quality, progress, XP/skill/proficiency formulas and item level | M/157/8/9; 31 groups | Progress and selected price reader partial |
| Tasks, abandon/submit, reward, item checks, faction availability and quick tasks | M/157/8/10; 21 records | Task structure/help partial; full task predicates unread |
| Help and main quest unlock/dialogue triggers | M/157/8/11..12 | Narrative/onboarding partial |
| Ownership/licensing checks | M/157/8/13 | Inventoried only; no bypass attempted |
| Divine locations, conquest, office assignment/promotion, book extraction, artifact repair, souls, temples and alternate-world admission | M/157/8/14; 24 groups | Selected sainthood read; rest undocumented |
| Combat setup, actor cores, attacks, skill release, targeting, projectiles, defenses, energy and special mechanics | B; 63 top records | Selected rewards/auto groups only; full combat unread |
| Status duration, damage-over-time, buffs, summoned actors and duration/count checks | B/42,44,59,60,62 | Inventoried; full effect timing undocumented |
| XP, career XP, SP, weapon/beast/medal growth | B/51 | Indexed/help partial |
| Drops, auto-mode settings, settlement, retries, stage counting and encounter reset | B/53..58 | Drops/progress/reset selected consumers read |
| Damage totals, sorting and combat-data panel | B/61 | Inventoried only |

Scene service subfamilies found across help/tables/event index: town trade/training/recruitment; faction tasks/contribution; antique retail/warehousing; city land/rent/building; research and education; smithing/recipes/refinement; exhibition; stone synthesis; beast taming/hunting; practice queue; expedition dispatch; dungeon/secret realm/tower; rebirth; guardian/tree; rift waves; divine offices and artifact systems. These are indexed in private source, with table and handler evidence retained; none implies personal NPC simulation.

Top three deeper payoffs: location-bound services over shared growth; item-to-home-economy loops; explicit progress/save/reset scopes. See [DEEPER_SYSTEMS](DEEPER_SYSTEMS.md).
