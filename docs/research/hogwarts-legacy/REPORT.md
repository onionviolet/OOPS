# Hogwarts Legacy: installed data pass

2026-10-14. The strongest result is **a lesson grants a verb, and an object checks whether that verb fits**. Installed mission steps connect lessons to learned spells; decoded puzzle code checks the player's actual Lumos tool. The care loop is equally concrete: a room station runs a recipe, a creature has separate care and harvest state, and its products pay for gear work. These are useful design references for YAIRPG, not accepted changes or novel canon.

The pass read Steam build **20773316** without launching it. Both SQLite databases, English interface text and 20 selected Blueprint packages were extracted. Ten Blueprint flow exports succeeded. About 29 MiB of targeted game files were extracted, rather than the full install. Raw data, tools and code stay in `~/.codex/research/hogwarts-legacy/`. No saves, game files, YAIRPG source, builds, staging or commits were changed.

**REA was tested only after a real native gap appeared:** the talent table lacks a price field and its UI calls native PurchasePerk. Both Ghidra and REA recovered the same three-function purchase chain. The first-purchase success path passes minus one to the point updater. REA adds convenient batched evidence, but this trial shows no better decompiler result and does not justify making it a default dependency. The trial used an explicit local limit on REA's importer; see [REA_TRIAL](REA_TRIAL.md).

Labels: **SHOWN** is directly present in installed data or decoded code; **STATED** is what shipped interface/help text says; **INFERRED** joins those observations. None means played, exhaustive, or runtime-accepted. Row counts include unused, development and gated records. No sealed truth is reproduced. S1 identifies the hidden progression review, with its details kept private.

## Answers to the five groups

All DB locators below refer to `extract/base/Phoenix/Content/SQLiteDB/PhoenixShipData.sqlite` unless GameData is named. Localization refers to `extract/base/Phoenix/Content/Localization/WIN64/MAIN-enUS.bin`. Blueprint paths are in [BLUEPRINT_PASS](BLUEPRINT_PASS.md). [COVERAGE.json](COVERAGE.json) tracks each requested subquestion and its remaining limit.

| Code | Group | File evidence and answer | Limit |
|---|---|---|---|
| H1 | Spells and lessons | SHOWN: 162 SpellDefinition and 164 SpellKnowledge rows separate cooldown/damage/target flags from subject, category, unlock and companion use. MissionRewards has 34 spell-reward rows. MissionSteps for ZSR_01 requires two page stats; ZSI_01 checks two Crossed Wands rounds plus spell-combination practice, then enables practice objects and unlocks Incendio. B1/B2 connect minigame completion to a mission task. B3 checks a Lumos actor attached to the wand. **Yes, lessons have noncombat uses in data and code.** | A reward row alone does not prove the spell was learned. NurtureOnly restricts room tools. Full combo order and every spell object's consumer were not audited. [Spell digest](SPELL_AND_LESSON_DIGEST.md). |
| H2 | Shield counters and spell tags | STATED: localization `TUT_Display_AccioBlue_desc` ties violet shields to Force spells; `TUT_Display_YellowShieldsZZD_desc` ties yellow shields to Control spells. `Hint_BreakShields` says to match spell color. LoadingScreen_Combat11 lists several bypasses and a Hard-mode exception for Stupefy. SHOWN: base Accio, Levioso and Incendio rows all have EnemyShieldBreaker=None, so that column alone is not the rule. | Red/damage follows the game's category presentation, but a native tag-mask implementation was not traced. Do not turn the None field into “cannot break shields.” |
| H3 | Progression | SHOWN: ExperienceActions distinguishes main quest 260, side quest 180, homework 150 and other challenge-progress awards from zero-valued Progression rows. ExperienceLevels supplies all 40 thresholds. PerkDefinition supplies 48 visible candidates across five trees, plus eight internal/challenge rows, levels 5/16/22 and spell locks. Native purchase chain supports a one-point spend. | Table values are not a final damage/XP formula or evidence that XP keeps flowing after its challenge is exhausted. Exact level-award cadence remains untraced. [Progression digest](PROGRESSION_DIGEST.md). |
| H4 | Pages, Challenges and gear | SHOWN: 24 challenge groups, 88 FGC criteria rows, chained prerequisite locks and rewards. CollectionItems has 640 rows across 11 categories; exploration includes 90 Hogwarts, 30 Hogsmeade and 30 Overland entries. Six gear slots, 75 trait recipes, 38 stat-cost rows and nine rarity/upgrade increments are separate tables. | Collection rows are not every Field Guide page or one achievable total. DLC, house and unlock filters matter. Most ordinary Rare/Epic/Legendary gear rows declare one general ability, but a few outliers exist. Do not infer a universal three-trait limit from the schema maximum. |
| H5 | Care to craft | SHOWN: seven potion recipes, eight plant rows, 13 adult product rows, 13 family rows, four 12-creature/four-species habitat rows. Fed, interaction, happiness, production progress, pregnancy and simulation are separate NurturingCreatureDynamic fields. All adult product rows use 1,500 seconds; yields differ. Moonstone placement, slot caps, potion/plant timers and loom input recipes are explicit. B5–B7 connect site state, presentation and separate loom events. | Empty dynamic templates are shipped definitions, not user saves. Child duration -1 is a sentinel; Phoenix has no offspring ID. Offline timer policy is not proved. [Exact recipe digest](CARE_TO_CRAFT_DIGEST.md). |
| H6 | School life | SHOWN: Schedule_Overland has 618 rows; ActivityDefinition has weekday/time/season fields. Some teacher defaults span 0–2400 and have inert-looking bed intervals, so schema richness is not proof of a complete class timetable. MissionSteps explicitly sets seasons and overrides schedules. CharacterDefinition.CompanionLock, quest follow/off/allowed-area tasks, B8 and B9 govern different availability layers. | No verified student attendance, missed-class penalty or full term simulation. MissionLines defines Relationship and 105 mission records use it, including child/checkpoint rows. These are not 105 distinct quests. CompanionBondingLevels has six rows, but no played general friendship ladder is established. |
| H7 | Cup and OWLs | SHOWN: HCP_01 has MissionLevel 34, waits on WEE_01, applies an end-of-year schedule and starts a story graph. WEE_01 waits on campaign missions. Houses stores house/dorm identity. No score-ledger table or HousePoints task keyword was found in the checked schema/MissionSteps. STATED: Lighthouse_13 is preparation for OWLs. | Cup cinematics were not reconstructed. A House Points text label and older CurriculumEOYRewards rows do not prove a functioning annual competition. No written/practical OWL test and grade contract was located in inspected missions, criteria or localized exam terms. “Not located here” is narrower than “cannot exist.” |
| H8 | World and enemies | SHOWN: 158 EnemyDefinition rows reference positioning, agility, aggression, damage, accuracy and attributes; related attack, defense, selection and vulnerability tables add rules. CharacterDefinition.FactionID includes school houses and regional/social groups, not just enemy teams. Enemy IDs/definitions distinguish dark-wizard roles, goblins, spiders, wolves, trolls, Dugbogs and Inferi. Dugbog vulnerability scales differ by difficulty. STATED: Inferius tips say fire opens it to other damage. | No exhaustive faction-relations graph or complete AI behavior-tree audit. Enemy presets are not full tactics. Final stacking/resistance formulas are not reconstructed. |
| H9 | Puzzle families, collections and S1 | SHOWN: active-looking Sphinx Blueprint folders cover light, braziers, platforms, ball, rock stack, target breaking, block matching and repair. SphinxPuzzleInstance has 304 rows including test/unused worlds; that is not 304 live Merlin Trials. Demiguise mission DMS_01 checks turn-in counts and unlocks Alohomora tiers. STATED: CURR_Infiltrator_Token_desc restricts moon collection to night. S1 data joins were inspected; hidden details remain private. | Only Lumos and fire-cube flows were followed deeply. Other puzzle folders are inventory evidence. No exact reachable puzzle total or complete hidden-gate execution claim. |

## Reconcile earlier findings and packets

The [earlier public-page report](../hogwarts-games/REPORT.md) remains unchanged. Its unread Legacy rows are superseded only within the bounds listed here, not silently marked as fully played or fully decompiled.

| Earlier code | Disposition | What this pass adds or corrects |
|---|---|---|
| F1 | Confirm and extend | Mission prerequisites, spell reward/unlock steps, B1 lesson-task callback and B3 noncombat tool inspection provide installed-file evidence. |
| F2 | Outside Legacy scope | Mystery's seven-year chapter ladder was not inspected here. Legacy data cannot validate it. |
| F3 | Correct the possible comparison | Legacy OWL preparation is present; no equivalent playable written/practical grade contract was located. Mystery's cited exam remains separate. |
| F4 | Outside Legacy scope | No Mystery energy/payment code was read. Local recipe timers are not its paid energy system. |
| F5 | Outside Legacy scope; useful contrast | Legacy B1/B2 uses asynchronous minigame completion and mission tasks. It does not prove Mystery's star-task logic. |
| F6 | Confirm, qualify absence | Cup level 34 and campaign/quest gate shown. No ordinary house-score economy found in the inspected rows; labels and old curriculum rows are insufficient. |
| F7 | Extend | Character companion locks, mission follow/off/area tasks and B8/B9 are distinct layers. No evidence of arbitrary roster summoning follows. |
| F8 | Confirm and extend | Moonstone cost, room tool flag, station slot pools, generator timers and loom event separation shown. |
| F9 | Confirm and extend | Four habitats explicitly hold 12 creatures/four species; care-state fields, 1,500-second product timers, family links and exact gear recipes shown. Breeding row presence is not universal breedability. |
| F10 | Extend Legacy half | Spell/category data and localized shield/counter advice exist. Mystery stance rules and native full combat math remain outside this pass. |
| F11 | Extend, preserve distinction | Mission progression and scripted season changes support campaign framing. Weekday/time schema exists, but no complete student timetable is proved. |
| F12 | Outside Legacy scope | Mystery graduation and retained resources were not rechecked. Do not import that contract from Legacy's Cup. |
| F13 | Extend | ZZC_01 stores separate game-result branches after teaching Accio. Full Summoner's Court physics/scoring was not reconstructed. |
| F14 | Unchanged reception | Installed data is not a new player survey or evidence about how repetitive a player finds it. |
| F15 | Strengthen proposal only | A useful-verb school slice has concrete reference wiring. Story-driven seasons are now shown in mission data; no automatic acceptance of the proposed YAIRPG design. |
| P1 | Stronger evidence, still PROPOSAL | Use B1 lesson-task completion and B3 actual-tool checks as a reference for one known obstacle gaining a useful solution. |
| P2 | No Legacy exam proof | Reuse a learned action in an authored assessment only after the existing school owner accepts it. Legacy supplies no verified grade algorithm here. |
| P3 | Extend, still PROPOSAL | Separate a partner's known relationship, quest state, area rules and current availability. Avoid deriving all four from one friendship scalar. |
| P4 | Stronger evidence, still PROPOSAL | Station capacity, real recipe stock and separate care/harvest state give a concrete production reference. No project save schema selected. |
| P5 | Refine, still PROPOSAL | Separate story season from daily NPC availability and from retained learning. A Cup cutscene is not a general graduation transition model. |

## Ranked YAIRPG proposals

All are **PROPOSALS**, not accepted designs, implementation tasks or new gates on existing work. They extend [existing Hogwarts packets](../hogwarts-games/IMPLEMENTATION_PACKETS.md), the [HP brief](../../worlds/harry-potter/WORLD_BRIEF.md) and [source ledger](../../worlds/harry-potter/SOURCE_LEDGER.md). The novel source baseline remains distinct from Legacy's adaptation balance. Proposed UI target: 1440 × 900 desktop, later 1366 × 768 fit; mobile optimization deferred.

| Rank / code | PROPOSAL | Visible result and cost |
|---|---|---|
| 1 / LP1 | Lesson evidence unlocks one useful method | Extend P1 with one named lesson result and one known environmental task that checks the actual learned method, body and tool. Cost: one real task consumer plus saved acquisition evidence. |
| 2 / LP2 | Show prerequisites as concrete work | Distinguish assignment evidence, teacher return, practice and learned status. The player can see what is missing without seeing hidden destinations. Cost: explicit local lesson states and their causes. |
| 3 / LP3 | One station, one recipe, one useful output | Extend P4 with a finite input/slot/timer/output chain that supplies LP1's practice. Cost: existing scheduler/workshop binding and no duplicate collection on reload/import. |
| 4 / LP4 | Preserve care facts separately | If a habitat is later selected, track fed, attended, production and welfare facts independently. Cost: actual habitat/feed ownership and a useful downstream consumer; no generic “happy means free items.” |
| 5 / LP5 | Keep the school clocks separate | Distinguish daily availability, story phase and term/assessment state. Cost: connect one teacher schedule override to one task, rather than simulate a whole seven-year cohort. |
| 6 / LP6 | Give a companion a specific present role | Extend P3 with a partner who can help at one known site, waits at a real boundary and remembers the favor. Cost: separate relationship cause, current task and location support. |
| 7 / LP7 | Give crafting outputs distinct jobs | Use separate stat improvements and technique-changing properties only where each has a visible useful effect. Cost: one understandable material choice, not a copied 75-recipe gear treadmill. |
| 8 / LP8 | Use earned counters instead of a total-secret checklist | Count known work with an explicit criterion and reward. Cost: disclose each tracker only after discovery; avoid presenting every unseen collectible as a deficit. |

[IMPLEMENTATION_PACKETS](IMPLEMENTATION_PACKETS.md) gives the smallest observable checks without authorizing implementation. [SMALL_TOUCHES](SMALL_TOUCHES.md) lists 26 smaller proposals.

## What else these files could answer cheaply later

| Rank / code | Later question | Existing evidence lead |
|---|---|---|
| 1 / QL1 | Which accessibility/input alternatives are already named? | Localized controller/keyboard variants and minigame UI properties; inspect only selected input assets. |
| 2 / QL2 | How do shops expose and price finite goods? | ItemDefinition economy/sell fields and vendor/container definitions. |
| 3 / QL3 | How does the game keep cosmetics separate from strength? | GearAppearanceItems versus GearItems, GearPowerLevels and localization. |
| 4 / QL4 | Which objects make noise when used, and who could react? | SpellDefinition.CastNoise/ImpactNoise and EnemyPerceptionScores. A perception formula would need its own later scope. |
| 5 / QL5 | Which crafting unlocks offer a purchase alternative? | LockDefinition, item recipes and vendor tables, with no need for more art extraction. |
| 6 / QL6 | How do quests suppress or restore routine behavior? | Add/Replace/RemoveScheduleOverride tasks and schedule keys; no full campaign narrative needed. |
| 7 / QL7 | Which data is retained, rebuilt or transient? | Dynamic table schema, Transient fields and explicit restore callbacks. These do not prove user-save behavior without a separately authorized runtime test. |
| 8 / QL8 | How do localization keys stay tied to mechanical identifiers? | MAIN-enUS dictionary and mission/item/perk joins; a useful recipe for future owned Unreal references. |

## Tool-fit proposal and remaining boundaries

**TF1, proposal for the existing tool-fit owner:** “D2 trial on Legacy build 20773316 recovered the same selected purchase-chain logic through direct Ghidra and a locally bounded REA 6.4.0 importer; retain data/Blueprint-first practice and keep REA optional for multi-query native evidence, with no demonstrated decompiler-quality advantage.” Do not treat this as an edit to [REVERSE_ENGINEERING_TOOL_FIT](../REVERSE_ENGINEERING_TOOL_FIT_2026-10-13.md).

[TOOLING](TOOLING.md) supplies pinned tools, worked commands, local patches and the reusable UE4 IoStore recipe. [CHECKPOINT](CHECKPOINT.md) owns unread coverage and exact disk use. [REA_TRIAL](REA_TRIAL.md) owns native hashes, timings and comparison limits. Further native chains, full behavior trees, every map, full dialogue, live play and user-save behavior remain unread. There is no playable YAIRPG acceptance claim or implementation in this pass.
