# Lane EP: expert modpack progression and quest graphs (audit, 2026-10-14)

Labels: shown = read in data or code; stated = author text; inferred = my reading. Source: pinned archives under `docs/research/minecraft/private/bulk-2026-10-14/`, unpacked read-only into `private/extract/` (media and JARs skipped, nothing run). All numbers come from a small `python3 -I` SNBT/BetterQuesting parser plus text-pattern counters in `private/audits/ep/tools/`. Full quest graphs (IDs, prerequisites, tasks, rewards per quest) are in `private/audits/ep/graphs/`; notes in `private/audits/ep/NOTES_batch1.md` and `NOTES_batch2.md`. Paraphrased; Minecraft values are reference only. Mod licenses vary; no code or asset reuse.

## Top findings

- EP1 (shown, CAB) Order is enforced by intermediate items, not by quest locks. Seven stage machine families each need a custom "mechanism" part (kinetic, sealed, precision, infernal, inductive, calculation), made by sequenced assembly from the previous part. The quest book's "Milestone" nodes are auto-true (a stat task with value 1) and only mark chapter ends. Recipes.js removes 105 vanilla/mod recipes in one cleanup function and rewrites about 25 sections by stage.
- EP2 (shown, CAB) The quest book doubles as a repeatable shop. 125 shipment quests and 30 profession quests take coins as submit tasks, pay out a "trade card" or "profession card" item, then a custom reward resets that quest. A card is the catalyst in a machine recipe (card plus input gives output), 8 professions and 2 plain trade lists. Spending is a recipe, not a menu.
- EP3 (shown, CAB) Chaotic Alchemy is a per-world hidden-code puzzle. The world seed fixes, for 7 categories, a secret 4 digit code over 6 reagents, plus a self-inverse pairing over 38 substrates. The player submits 4 reagents; a failure produces one of 10 distinct "failed" items whose lore lists the guess (a Mastermind feedback loop made of items). Accelerator items keep one reagent that was right in place or in kind. Transmutation loses 25% of inputs with a chaos-substrate catalyst and 50% with a generic one. Same family as Embers alchemy (TA1).
- EP4 (shown, Cabricality vs CAB) The reimplementation keeps the same quest skeleton: 248 of 454 quest ids carry over, 234 with identical prerequisites. Changes: lifesavers chapter dropped, advancements (9) and thanks (1) added, shipments 125 to 189 nodes with new ids, the 51 node alchemy chapter replaced by 52 jar-item nodes. Its recipe logic ships in a downloaded mod JAR that is not in the archive and has no decompile, so recipe comparison is not possible.
- EP5 (shown, SevTech) Stages advance through a single-parent advancement tree. 255 advancements in 6 stage branches (52, 40, 41, 51, 38, 33), every non-root requires its parent. One key advancement per stage runs the stage function (workstump, melter, astable, stevescarts, plastic, moon); most criteria are "obtain this item" (321 of about 420). The stage function also swaps the mob stage, fires an Astral Sorcery research grant and adds prestige points. Gating payload: about 10,000 staged entries by rough count, 107 per-mod item files, ore replacement blocks until the stage, dimension gating by id, Tinkers materials, tool types and modifiers by stage, enchantments, liquids and gases, mobs and containers.
- EP6 (shown, E6) Normal and Expert are two script sets over a shared base. `kubejs/.../expert` has 224 files, `normal` 71, `base` 495; one global (mode.json) switches them and a mode quest is completed or reset per player. Expert adds restriction JSON: placement of a machine is blocked outside a named dimension unless a stage is held, and a stage is granted by right-clicking a specific item (schematics, red chalk, master blood orb, lesser soul gem). "Learn by using the thing" is the stage unlock.
- EP7 (shown, Monifactory) One config of 18 feature booleans defines Normal, Hard and Expert, e.g. coin trading and Hostile Neural Networks only in Normal, Steam Age and harder processing in Hard and Expert, assembly-line ordering warning only in Expert. A login hook writes a game stage `doX` or `dontX` per feature, and the quest chapter `dependency_chain` (25 stage-task quests) uses them to show or skip per-mode quests. The opening chapter exists as three separate per-mode files (60, 65, 63 quests).
- EP8 (shown, Nomifactory and Monifactory) Coins are a spend-by-recipe-shape economy. Quest rewards hand out coins (Nomi omnicoins 5/25/100; Moni nickel, quarter, dollar). Shaped recipes place coins in specific cells of the 3x3 and the pattern identifies the trade. Moni limits this to Normal mode.
- EP9 (shown, GTNH) Tier walls are single gate quests. 14 tier lines (stone age, steam, LV to UMV, 33 to 152 quests each); each has one quest named for the tier that depends on 2 or 3 final quests of the previous tier, sometimes plus a multiblock-line quest. All other quests in the tier descend from it. The pack spine has a longest chain of 208 across lines; 1,382 of 5,460 edges cross lines (25%).
- EP10 (shown, GTNH) 65 "Trigger: ... Skip" quests ask for a big stack (64 to 128) of an intermediate or a vehicle and have no or one child. Inferred: they let mods unlock shortcut recipes for a chain. Not verified because recipes are in mod code, not in the pack repo.
- EP11 (shown, DJ2) Quests as supply lines. 1,736 quests in a nearly linear 30-line spine (longest chain 394). A completed submit task pays out more of the next step's inputs: the atomic line pays 16 to 64 stacks of elements and ingots for compounds. Custom pack-only proof items (not a quest flag) mark milestones. Rewards average 10.7 items per quest, the highest of any pack here.
- EP12 (shown, MeatballCraft) Dimension gating by ingredient entanglement. 66 `*Gating.zs` files remove 928 recipes and re-add them (355 7x7 Extended Crafting recipes, 24 combination crafting, 24 Modular Machinery, about 650 other machine recipes) using parts from other mods or pack-made parts, so an item is unbuildable until the player has visited the right dimension. Active questbook is BetterQuesting (4,765 quests, 17 lines, one connected component, chain 143); an FTB Quests copy (2,099 quests) is stale (inferred from the mod list).
- EP13 (shown, Floramancer) Mastery is tracked by output, not possession. Each of 13 generating flowers has an advancement whose criteria are cumulative 1,000,000-mana steps (50 to 200 steps). The reward is a trophy recipe stage, so mastery changes what can be crafted; every flower decays in one hour of game time, forcing real automation. Story is delivered by a tiny-potato block that answers via chat when clicked, refusing until all 13 are done, then upgrading the player's book.
- EP14 (shown, Cuboid Outpost) A rescue layer exists inside the quest book: an "Emergency Items" chapter in the last appendix gives optional stage rewards (End, Nether, Cuboid Overworld access) and ration packs, so a stuck player can pay the cost of skipping.
- EP15 (shown) Graph shape differs sharply by authoring style: wide and shallow (E6: 1,413 quests, chain 17, fan-in 1 on 89%) versus deep and braided (Monifactory chain 84, 26% cross-chapter edges; Nomifactory chain 72, 39% cross-chapter), versus long single spines (DJ2 chain 394, antimatter 76 of 196).

## Quest graph shape per pack (shown)

Chapters = chapter files or BetterQuesting lines. Chain = longest prerequisite path (cycle-guarded). Roots = quests with no prerequisite. Optional = pack flag (FTBQ `optional`, BQ not-main). Reward stacks counted for item rewards only.

| Pack | Chapters | Quests | Edges | Roots | Chain | Cross-chapter edges | Max fan-in / fan-out | Optional | No reward |
|---|---|---|---|---|---|---|---|---|---|
| CAB | 13 | 454 | 402 | 191 | 38 | 14 | 10 / 40 | 1 | 230 |
| Cabricality | 14 | 478 | 369 | 241 | 39 | 17 | 10 / 42 | 0 | 224 |
| Enigmatica 6 | 38 | 1,413 | 1,487 | 78 | 17 | 69 | 17 / 26 | 116 | 274 |
| Monifactory (default) | 14 | 853 | 1,157 | 168 | 84 | 301 | 75 / 21 | 68 | 302 |
| Nomifactory | 12 + unlined | 845 | 1,119 | 177 | 72 | 436 | 56 / 16 | 514 | 261 |
| GTNH | 47 | 3,814 | 5,460 | 8 | 208 | 1,382 | 8 / 55 | 2,857 | 602 |
| Divine Journey 2 | 31 | 1,736 | 2,176 | 11 | 394 | 149 | 7 / 20 | flags unset | 36 |
| MeatballCraft (BQ) | 17 | 4,765 | 6,380 | 11 | 143 | 210 | 186 / 159 | 4,740 | 3,190 |
| Antimatter Chemistry | 8 | 196 | 214 | 4 | 76 | 7 | 4 / 24 | 6 | 55 |
| Cuboid Outpost | 44 | 1,511 | 1,754 | 190 | 109 | 174 | 12 / 22 | 351 | 1,233 |
| FTB Interactions | 28 (titles only) | 453 titles | not in repo | - | - | - | - | - | - |
| Floramancer, Ultimate Alchemy, SevTech | no quest book | - | - | - | - | - | - | - | - |

Reading notes. FTBQ dangling prerequisite ids: CAB 10, Cabricality 10, E6 34, Moni 41, Cuboid 7 (ids not present in the chapter files). Task types: item submit dominates every pack (CAB 466 of 634 tasks, GTNH 3,743 retrieval plus 1,399 optional retrieval of 5,663); checkmark tasks are 24% of CAB tasks and about 6% of E6; kills, stats, dimension and location tasks are single digits to low double digits percent. Reward types: CAB 274 item plus 140 custom (the shop reset trick); E6 761 command rewards (mostly "spawn a loot table at the player", i.e. rewards are data-driven loot tables), 531 item, 119 xp, 5 stage; Moni 527 item stacks (mostly coins); GTNH 4,267 item, 977 choice, 333 "quest completion" rewards; Cuboid 6 stage rewards. Reward stack size is almost always 1 (median) except DJ2 (4, max 128), GTNH (max 8,192 once at the farewell quest), Antimatter (up to 64).

### GTNH tier spine (shown)
Quests per tier line: stone age 84, steam 101, LV 152, MV 143, HV 111, EV 85, IV 130, LuV 77, ZPM 65, UV 42, UHV 33, UEV 54, UIV 46, UMV 44. Depth of the gate quest along the global chain: MV 48, HV 64, EV 74, IV 88, LuV 103, ZPM 122, UV 131, UHV 141, UEV 152, UIV 169, UMV 173. Gate-to-gate spacing runs 4 to 19 with no clear trend, while per-tier quest counts shrink from 150 to about 45, so late tiers are shorter lists on a deeper chain.

## Stage gating and ordering mechanisms (shown unless noted)

| Mechanism | Where | Notes |
|---|---|---|
| Custom intermediate items required by next machines | CAB, Nomifactory (circuits, GregTech tiers), GTNH (mod code, inferred) | Order lives in recipes. No stage flag needed. |
| Game stages plus recipe/item/ore hiding | SevTech (ZenStages, OreStages, RecipeStages), Floramancer (RecipeStages for trophies), Cuboid (stage rewards), E6 (restriction JSON) | SevTech hides ores (replaced by plain blocks), items, recipes, dimensions, mobs, enchantments, liquids, Tinkers parts. |
| Stage granted by action | SevTech (advancement milestones), E6 (use an item), Floramancer (output milestone), Cuboid (rescue quest) | Four routes to the same state. |
| Ingredient entanglement across dimensions | MeatballCraft, Divine Journey 2 (pack-made parts) | No stage object; progress is physical possession of parts. |
| Quest locks | BQ lockedProgress (Nomifactory 603, GTNH 121), hidden/secret visibility (Nomifactory 175 hidden, GTNH 27) | Controls what the player sees or registers, not what they can craft. |
| Mode switch | E6 (mode.json), Monifactory (packmode.json with 18 booleans) | Mode picks recipe sets and which quests show. |
| Mob difficulty stages | SevTech (zero_mob..five_mob), FTB Interactions (peaceful, overworld, bronze, nether, space) | Danger rises with stage, not with area (shown for SevTech, stated in FTBI lang text). |

## Recipe-script rewrites (pattern counts, approximate)

Counts are regex hits, not parsed calls; they rank effort, they are not exact. `remove` = recipe removals, `adds` = shaped plus shapeless plus custom JSON plus machine-recipe calls.

| Pack | Script files / lines | Removals | Adds | Notes |
|---|---|---|---|---|
| CAB (KubeJS) | 10 / 5,409 | 254 | about 150 | 70 replace-input swaps for unification; stage sections are functions per machine family |
| E6 (KubeJS) | 852 / 87,926 | 168 | about 560 | 791 event hooks, 208 loot edits, 148 dimension mentions; split base 495 / expert 224 / normal 71 files |
| Monifactory (KubeJS) | 211 / 31,547 | 585 | about 2,070 | 1,446 machine-recipe calls, 45 JEI hides; chains per processing line (dragon, sculk, witherline, prismarine...) |
| Cuboid (KubeJS+ZS) | 114 / 5,965 | 146 | about 310 | 216 custom JSON recipes |
| Nomifactory (ZenScript) | 45 / 19,978 | about 1,190 | about 1,660 | 1,059 JEI hides, about 1,970 oredict references, phase files by game stage |
| SevTech (ZenScript) | 341 / 42,507 | 431 | about 150 | stage logic dominates; recipes mostly stage-tagged |
| DJ2 (ZenScript) | 130 / 30,726 | 3,690 | about 4,900 | largest per-line rewrite density; unifying files for dusts, gears, plates, rods |
| MeatballCraft (ZenScript) | 505 / 168,398 | 1,069 | about 11,200 | 66 gating files; tooltips 7,421 hits |
| Floramancer (ZenScript) | 25 / 2,065 | 71 | about 180 | small; 13 staged trophy recipes |
| Antimatter (ZenScript) | 63 / 3,329 | 64 | about 150 | Alchemistry decompose/combine tables (213 entries) |
| Ultimate Alchemy (ZenScript) | 24 / 1,525 | 44 | about 225 | clay removed, hand-crush recipes |
| GTNH | none in repo | - | - | recipe logic is in mod code; not covered |
| Cabricality | none in archive | - | - | recipe logic is in a downloaded mod JAR |

Categories seen: removal of unwanted or shortcut recipes, replacement of ingredients for unification, new gated intermediates (CAB mechanisms, DJ2 and Meatball parts), tooltip explanation of new chains, loot table edits to feed the chain (E6, Meatball), tag/oredict unification, worldgen edits (Meatball 714 hits, E6 78), JEI hiding to remove temptation (Nomifactory 1,059, DJ2 106, Floramancer 69), and event hooks for special rules (CAB alchemy, E6 stage grants).

## Donor questions

- N19 (SevTech: separate exists, observable, understood, usable, offered). Answer (shown): SevTech splits these. "Exists" is world state (ore replacement blocks until the stage); "observable" is the item/recipe hide set per stage (about 10,000 entries); "understood" is the Triumph advancement tree plus Waila/JEI hiding; "usable" is recipe staging; "offered" is the stage advancement unlocking the next batch. Alternate learning routes exist as advancements with the same stage function (shown, 18 reward functions). See EP5.
- N20 (Floramancer: mastery by method). Answer (shown): a flower is mastered when cumulative mana it generated crosses N million; mastery is per flower (method), not per item owned. Decay at one hour forces continuing production, so mastery equals maintained throughput. Maintenance versus chore is not measured in data; the decay constant is the only pressure (EP13).
- N21 (Ultimate Alchemy). Answer (shown, partial): no quest book and no automation graph in the archive. The data is a recipe rewrite pack: clay replaced by gravel, hand-crush recipes, color-copy recipes, a creative-tier barrel crafted from plain parts. The void island layout and map are not parsed. Premise not verified beyond scripts.
- N22 (Antimatter Chemistry). Answer (shown): decomposition and recombination are authored tables (213 entries over Dissolver and Combiner); I found no check that inputs and outputs balance, so conservation is by author convention. Quest book: 196 quests, 8 chapters, a single spine of 76 in the last chapters.
- N23 (Cuboid Outpost: supplied start). Answer (shown, partial): 1.16.5 v1.1.2; 1,511 quests in 10 groups ("A New Life" to "A New World", five appendices); 1,233 have no reward, so the book is guidance, not supply; the Emergency Items chapter is the supplied safety net. A start-base structure was not located in the archive.
- N24 (Divine Journey 2 cross-system chain). Answer (shown): see EP11. The "Getting Atomic" line (85 quests) runs from Alchemistry elements through compounds to Draconic reactor parts; each step pays materials for the next. Optionality is nearly absent (flags unset), the chain is one long spine of 394, and the needless-gate risk is the 12 checkbox and 12 location tasks used as barriers.
- N25 (MeatballCraft expedition finds to later specialized production). Answer (shown): expedition finds enter recipes through gating files (parts from dimension mods become required in AE, Botania, NuclearCraft, EnderIO recipes). The endgame is a boss-key chain of callstones then the stone of dimensional ascension. Image-only page claims not used.
- N26 (Monifactory differing operating rules). Answer (shown): see EP7. Fourteen features differ across three modes; Normal keeps coin trading and HNN, Hard and Expert replace them with steam age and harder processing. Quest content differs only in the opening chapter file and stage-tagged quests, so multiple routes share most of the graph.
- N27 (FTB Interactions). Answer (shown, limited): the repo copy has no scripts or quest files, only 19 changelogs and a lang file with 453 quest titles in 28 chapters. Dependencies not recoverable. Difficulty stages are explained in advancement text.
- N44 (Cabricality vs CAB). Answer (shown): see EP4. Main threads are 5 numbered stage chapters (stage_1 to stage_5, plus the alchemy branch and a metallurgy chapter); optional threads are the shipments, professions and market chapters; the quest overview is the 19 node chain of milestones (chain 38 to 39). Cabricality keeps the same numbers of stage nodes (22, 26, 44, 30, 20 versus 22, 28, 44, 33, 28) and adds an advancements chapter with 9 achievement nodes.

## System patterns across targets

- SP1 Two ways to enforce order: item-flow (CAB, Nomi, Meatball, DJ2) versus flag-flow (SevTech, E6, Cuboid, Moni). Item-flow needs no state object and survives import; flag-flow lets one switch toggle whole families and makes rescue rewards cheap.
- SP2 A quest book can be a market (CAB, Nomi, Moni coins) as well as a to-do list. Coin sink = recipe shape or catalyst card.
- SP3 Optional lines dominate large packs: GTNH 75% non-main, Nomifactory 61%, Cuboid 23%. Main spines are 25% to 40% of nodes.
- SP4 Single-parent trees (SevTech, E6 89% fan-in 1) are readable; braided graphs (Moni fan-in max 75) need hub quests whose job is to hold many prerequisites in one place.
- SP5 Rewards are mostly of one kind: raw materials for the next step (DJ2), coins (Nomi, Moni), loot tables (E6), or nothing (Meatball 67%, Cuboid 82%, GTNH 16%).
- SP6 Hidden and secret nodes are used sparingly (CAB 15, GTNH 27) and rescue content sits at the end.
- SP7 Narrative can ride existing channels: Floramancer uses hidden advancements plus chat functions; Cuboid uses a voiced description on every quest; FTBI uses advancement roots as stage introductions.

## YAIRPG fit (proposals only)

Owners found by grep: `src/quests.js` (Quest, QuestTask with hidden tasks, rewards that can start the next quest; `questManager.finishQuest`), `src/native_unlock_transaction.js` (staged unlocks: skill, recipe, quest, flag; completed unlocks do not replay rewards), `src/world_knowledge.js` (authored identity versus player knowledge), `src/reveal_chain.js` and `src/skill_discovery*.js` (practice-driven reveal), `src/story_requests.js` (take, deliver, decline contract with receipts), `src/adventure_notebook.js`, and docs `docs/worlds/WORLD_SECRETS_AND_DISCOVERY.md` (sealed secrets, found via fitting skills).

- Y1 Stage by action, not by flag alone (SevTech, E6 right-click grants): map to `native_unlock_transaction` effects; one named milestone per stage keeps it auditable. Fits the sealed-secret rule: refer by ID only in text.
- Y2 Item-flow ordering (CAB mechanisms) fits modular production owners (`MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md`): a world's gate is a made part, not a counter.
- Y3 Repeatable shop through a recipe card (CAB EP2): fits the existing coin/denomination knowledge hooks (`bindDenominationKnowledge`); worth a world-specific adjective, not a fixed "once" limit.
- Y4 Per-world hidden-code puzzle with item feedback (CAB EP3) pairs with `world_knowledge`: code derives from the world seed, feedback lives on the failed item. Candidate for a mastermind alchemy world; seeds must stay out of chat per sealed secrets.
- Y5 Mode as a feature-boolean table (Moni) is a cheap way to ship several difficulty profiles without three games; fits the "keep every reasonable option reachable" memory.
- Y6 Rescue chapter (Cuboid EP14) fits `story_requests` receipts: a stuck state offers a named cost to skip, never silently.
- Y7 Mastery by cumulative output (Floramancer EP13) fits skill and practice owners; decay constant creates the maintenance load.
- Y8 Skip-token quests (GTNH EP10) as a deliberate shortcut priced in raw intermediates.

## Per-target coverage

- Create: Above and Beyond: quest data read fully (13 chapters); KubeJS server/startup scripts read for stages, alchemy, trading, cleanup (all 10 files parsed by counters; alchemy and trading read in code, recipes.js read by function).
- Cabricality: quest data fully parsed; configs listed; embedded JARs not read; recipe mod JAR absent.
- Enigmatica 6: quests fully parsed; packmode, restrictions, gamestages scripts read; 852 script files pattern-counted only.
- Nomifactory: quest JSON fully parsed; Bountiful, Endgame, JEICleanup read in part; other scripts counted only.
- GregTech New Horizons: all 3,814 quest files parsed; no recipe scripts exist in this repo; configs (194 entries) listed, not read. Honest limit: GTNH recipe tier logic lives in mod code and is not covered.
- Monifactory: quests fully parsed (default plus per-mode opening chapter); packmode and monicoins read; 211 scripts counted only.
- SevTech Ages: stage setup, staging, Triumph tree (255 files) parsed; 107 per-mod stage files counted, not read.
- Divine Journey 2: quests, lang and Triumph read; 130 scripts counted, a few read.
- MeatballCraft: BQ quests parsed in full; gating files counted (66) and two read; stale FTBQ copy parsed for comparison.
- FTB Interactions: all 32 members read at listing level; lang quest titles counted.
- Cuboid Outpost: quests parsed; lang sampled; scripts counted.
- Antimatter Chemistry: quests parsed; Alchemistry scripts counted and two read.
- Ultimate Alchemy: start.zs read; other scripts counted; maps folder and AE2 generated recipes not read.
- Floramancer: Triumph and chat functions read; flower scripts, decay config read; docs (CT dumps, mana stats) not read.

## Gaps

- G1 Cabricality recipe logic is not recoverable from the corpus; fetch the mod JAR (public source) if the alchemy jar redesign matters.
- G2 GTNH recipe tiers, skip-quest consumers and config walls need the mod source.
- G3 E6 expert restriction counts beyond the sample file, packmode quest effects on the graph, and loot table contents are unread.
- G4 Counters over-count tag/oredict and stage words; use the per-file TSVs before quoting.
- G5 Fan-in counts treat "requires any" and "requires all" alike; FTBQ `dependency_requirement` and BQ `questLogic` OR are tallied separately (BQ OR: Nomifactory 48, GTNH 117, DJ2 8) but not folded into depth.
- G6 FTBI quest edges, Ultimate Alchemy map template and Cuboid start-base structure are not in archives or not parsed.
