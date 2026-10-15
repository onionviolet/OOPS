# Siralim Ultimate: deeper systems

Static installed build 20548371, 2026-10-14. Research and PROPOSALS only. Ranked D01-D15 cover the highest useful connections for YAIRPG, including weak analogies and absent evidence rather than forcing Siralim into a life simulator.

Evidence: **SHOWN** is an inspected table, string, symbol or named body. **STATED** is shipped help/interface behavior. **INFERRED** is interpretation. A symbol is evidence that a named entry exists, not evidence that it executes a particular rule. Table locators below count the header as record 1 and quoted multiline cells as one record. Tags are preferred durable locators. Source prefix `L/` means `~/.codex/research/mw-siralim/extract/localization/`. Native prefix `N/` means the new work area's `extract/native/`. Full table indexes, original prose and native bodies stay in the private areas linked in TOOLING. No source game ran.

## D01: Knowledge, recruitment and targeted acquisition

**Model and authoring, SHOWN:** `codex.csv` character-knowledge and creature-mana tags; `ui.csv` `L_BESTIARY_*`, `L_PROJECTS_HUNT_*`, `L_PROJECTS_ASSASSINATION_*`, `L_DIVCANDLE_*`; compiled `scr_KnowledgeGetExperience/GetRank/GetRank2/Update`, `scr_DatabaseCreature*`, `scr_DatabaseProjects`. These separate creature definition, learned knowledge, summoning Mana and a selected mission target. They are not a single ownership flag.

**Rules, STATED:** kills gain Knowledge; having 100% Mana doubles Knowledge gain (`L_CODD_CHARACTER_KNOWLEDGE`, record 199). Recruitment requires 100% Mana (`CREATURES_MANA`, 203); Bestiary text quotes 1000 Essence and separately refuses insufficient Mana or excessive menagerie population (`ui.csv` 2953,2967-2969). Hunts require at least rank D but exclude S; Assassination requires S and an actual corresponding trait material (716-728). Candles require C knowledge, quote 1000 Power initially, increase cost per use in that realm, and refuse excessive enemy population (1038,3000,780-784). Rank benefit labels include lore, HP bar, Hunt, candle, +30% experience/resources, better card chance and Assassination (2957-2963). Their complete rank-to-benefit join needs the native consumers; label order alone is not that join.

**Connections:** learning opens a controlled acquisition route; that route feeds collections, body recruitment and crafting. Hunt is targeted knowledge progression, not evidence for scholarly research or technical invention. **Saving:** string families `Hunt`, `Assassination`, `Bestiary` are SHOWN; whole-save ownership of points and targets remains unread. Native rank evidence is added below in the trace supplement.

**PROPOSAL:** extend P03/P04/P11, K9/K11/K13, technology and means/appraisal palettes. A learned local creature fact should open one real observation or material route, with separate knowledge, permission, stock and availability. Do not require killing as YAIRPG's universal learning method. Dedicated cross-world target-acquisition ownership is only partial; use the existing knowledge and production owners jointly.

## D02: Projects, repeatable missions and service progression

**Model, SHOWN:** 258 localization records in `projects.csv`, stable `L_PROJN_*` and `L_PROJD_*` pairs. Compiled `scr_CreateProject`, `scr_ProjectCreate/Progress/IsDone/Finish`, requirements for resources/parts/dust/chance, maximum active count, availability and prior completion are separate entry points. `save_Project/load_Project` are separate from quest serializers. A project instance is distinct from its definition and lifetime completion record.

**Rules, STATED:** Everett starts projects; objective items arise from battles, quest completions or ground finds (`CASTLE_PROJECTS`, codex 171). Blacksmith ranks raise upgrade access; Enchanter ranks do the same for gems. Capacity projects each add one simultaneous project (projects 32-37). Repeatable Raid gives treasure, Forage artifact material, Experiment gem material, Hunt knowledge, Pilgrimage favor, Training three stat scrolls, Assassination a chosen trait material, and Nether Synthesis a random Nether Stone (60-75). Unlock missions and later specialization projects are authored separately. No evidence says these are real-time companion expeditions, autonomous jobs or production machines.

**Connections:** an expedition's loot supports a permanent home service, which supports better equipment, which enables another excursion. Reusable missions preserve reasons to revisit the loop after unlock projects finish. Exact requirement scaling, spawn odds, payout selection and active-cap logic require helper bodies, not guessed timers.

**Authoring:** compiled `scr_DatabaseProjects`, localized name/description, native creation/finish dispatch. Localization doesn't contain all costs or an executable recipe schema. **Saving:** native domain helpers are examined in the supplement; outer publication and interrupted payout remain open.

**PROPOSAL:** P02/P06/P12/P16/P18, K8/K9/K13/K25. Modular production and technology owners can use one paid home improvement that consumes real trip-earned stock, changes an existing service and leaves a receipt. Reuse actual jobs; don't introduce an expedition simulator because a mission label exists.

## D03: Refinery, reusable recipes and recovery sinks

**Model, SHOWN:** `projects.csv:L_PROJD_REFINERY`, `ui.csv:L_CHOICE_REFINERY_*` (1232-1237); inventory `inv_` material/artifact/gem families and compiled material definitions. Separate inputs are Artifact, Spell Gem, Nether Stone and ordinary resource stock.

**Rules, STATED:** refinery can destroy an Artifact for resources, grind a Spell Gem for resources, crush a Nether Stone for Piety, or convert one resource into another. Earlier project description mentions only artifacts/gems and conversion; the interface explicitly adds stones. Artifact unsocketing destroys ordinary inserted material but returns Nether Stones (`codex.csv:L_CODD_ARTIFACTS_UNSOCKETING`, 140). These are different recovery policies. No exact salvage yield or exchange rate is established. Do not assume conversion is lossless or profitable.

**Connections:** optional rare-item sink competes with equipping a stone; Piety then funds relics. Artifact acquisition, socketing, unsocketing and crushing are a small production graph, not a full economy with suppliers and demand. Gem inscriptions remain reusable recipe knowledge while crafted gems remain inventory objects (codex 161).

**Authoring:** compiled inventory and material tables with localized IDs. Repeated text can describe different item kinds; do not key mechanics by display name. **Saving:** `save_Item/load_Item` exist but are unread in this pass. Resource and Piety save keys are name evidence only; conservation, item removal and payment need actual callers.

**PROPOSAL:** P02/P18/P16, K8/K9, modular production owner. Quote the complete salvage basket and what survives disassembly. Gate: naturally acquire an original item, salvage it, use its output, refuse a second salvage of the same instance, then persist the changed result. Exact rates are original balance choices.

## D04: Personality as growth policy and companion voice

**Model, SHOWN:** `personality.csv` has 1120 logical rows, with race-coded `L_D_PERS_ATTACK_*`, `SPEED`, `DEFENSE`, `HEALTH`, `INT` families. Native `scr_PersonalityDialog` dispatches to five named voice families; `scr_PersonalityRate`, stat-increase/decrease and string/icon functions are separate. This is evidence for authored race/growth-style speech, not mood, affection or remembered conversation.

**Rules, STATED:** 20 personalities; ordinary level growth is 30% of level-1 base per stat, favored stat 40%, disfavored stat 20%; changing personality with a tome retroactively adjusts stats (`codex.csv` 205-210). Codex 205 also explicitly says personality plus race chooses speech. Thus the favored/disfavored ordered pair yields 5 x 4 = 20 possible growth profiles (INFERRED combinatorial explanation, not a recovered enum). Exact final-stat rounding and training interaction remain open.

**Connections:** a creature's build identity has a legible voice while mechanics remain authored separately. This can help a companion feel specific without pretending each bark reflects changing inner life. **Authoring:** localization tags contain speech; compiled dispatch selects a family/race; cosmetic or personality changes must not masquerade as memory.

**Saving:** prior `scr_Fuse` retains primary personality, nickname and GUID. New creature serialization evidence below closes a field-level portion, not a load-roundtrip. Personality speech itself is definition text, not a saved conversation transcript.

**PROPOSAL:** P15/P21/P16, K6/K20/K31. Companion and genetics palettes cover body dispositions; use retained known facts to choose an original voice and a real supported method. No universal personality penalty is proposed, and retroactive stat respec is a Siralim rule only. Full social conversation and companion agency remain unsupported analogies.

## D05: Fusion, primary identity and inherited faculties

**Model, SHOWN:** prior `extract/native/gml_Script_scr_Fuse.c` retains `fuse1/fuse2`, primary nickname/personality/GUID, strategy/macro, item and training fields; revises stable membership and calls `scr_UpdateCreature`, then visual `scr_SetFusion`. The latter only caches visuals. Body, palette, class, traits, control and inventory are distinct responsibilities.

**Rules, STATED:** offspring uses parents' averaged base stats and both traits; secondary parent supplies class and palette, primary supplies body (`codex.csv` 214). UI errors reject identical creature choices and secondary Avatar choices (prior build digest, ui 527-533). **SHOWN native:** XP uses a rounding helper on an average. This does not settle base-stat calculation, admission/payment, primary artifact custody or every special-case fusion. No exact inheritance algorithm beyond these observations is claimed.

**Connections:** native item-return and stable helpers show fusion touches multiple owners. Identity continuity is a design choice that must be explicit, not automatically biological breeding. `scr_DatabaseBreeding` exists, but does not prove a reachable breeding system or ancestry simulation in Ultimate.

**Authoring and saving:** compiled creature/update definitions realize traits and derived stats; full creature definitions and lore stay private. New save/load fields below provide bounded carrier evidence. Traits granted during battle remain distinct from inherited traits; exact dispatch remains open.

**PROPOSAL:** P05/P15/P16, K3/K15/K22, genetics and nonhuman body-change owners. An original body transformation should state who continues, which faculties belong to body or soul and what item custody survives. Preserve supported alternatives, without copying Siralim's two-parent recipe or making all transformations require a cost or flaw.

## D06: Cooking and recipe discovery, uncertain reachability

**Model, SHOWN:** `obj_cooking`, `obj_cooking_menu`; `scr_DatabaseCooking`, `scr_CookingGetRecipe/GetBonus/GetName/GetDesc`, `scr_PlayerHasCookingRecipe`; archive STRG indexes 37652-37684 describe two ingredients, a cooking style, a confirmation, refusal of duplicate ingredients, a bad combination and adding a discovered recipe. These strings were not in the topic-filtered localization hits. That discrepancy matters.

**Rules, STATED by embedded strings only:** select two different ingredients and a style; confirm before cooking; combinations can yield undesirable meals; a novel combination can enter a recipe menu. No duration, cost, effect lifetime, hunger drain or body need is established. The presence of recipe and breeding language in the binary can reflect legacy/dead code. Native `CookingGetBonus` is inspected below, but a helper body still cannot establish the reachability of the meal loop.

**Connections, INFERRED:** a small combinatorial authoring system could connect inventory selection to a retained learned recipe and a battle bonus. Actual consumption, lasting recipe registration and the invoked menu need callers. Do not call this a verified life-sim food system.

**Authoring:** compiled cooking database plus name/description/recipe/ingredient/style helpers; original embedded lines retained privately. **Saving:** cooking-specific serialization is not joined. No positive claim that meals or discoveries survive saves.

**PROPOSAL:** P02/P03/P16, K8/K9/K11, production/technology and food owners. A discovered original recipe can record its inputs and method while keeping execution dependent on actual tools/stock. This is an optional design analogy; ordinary comfortable unfed play and no hunger death remain standing direction. Dedicated experimental recipe-discovery policy has only partial owner coverage.

## D07: Castle decoration as service placement and authored speech

**Model, SHOWN:** 2775 decoration text rows, `scr_DatabaseDecorations*`, floor/wall/background/weather definitions, `save_Decoration/load_Decoration`; room identities include castle/service rooms. Distinguish unlock ownership, placed instance, collision and service behavior.

**Rules, STATED:** most decorations are aesthetic, some are interactive, Utility/NPCs are functional (codex 168-170). Decoration mode lets the player pass through solids and change castle name, music and floor style. A custom NPC's name and dialogue are editable. That is user-authored speech, not proof the custom NPC has autonomous needs or a relationship graph. Service placement follows project completion (ui `L_PROJ_DONE_*`).

**Connections:** home is a visible return on expedition progression, not just a menu. A placeable service joins content unlock to navigation and access. UI permits decoration-mode collision exceptions; exact ordinary collision/placement legality and whether an inaccessible service can be recovered remain unread.

**Authoring:** compiled decoration definitions plus localization and per-instance strings. No public plugin/mod API is established. **Saving:** field-level decoration helpers inspected below; whole castle layout, edits and missing-definition recovery need outer callers.

**PROPOSAL:** P12/P16/P19, K6/K8/K14/K25, life-sim and authoring owners. One original useful furnishing should expose an existing service through actual owned placement. Custom descriptions must stay separate from authoritative permissions, needs or memories. A housing service gate must remain recoverable rather than permanently missable by layout mistakes.

## D08: Patron favor, spending currency and local blessings

**Model, SHOWN:** compiled `scr_DatabaseGodShops`, `scr_GodLevel`, `scr_GodFavorQuestCheck`, `scr_BiomeGod`; `dialog.csv:L_GOD_*`, help and UI. Names distinguish favor, rank, emblem stock, shop catalogue and realm-local boost. Prior native biome-to-patron mapping is available, not a complete society model.

**Rules, STATED:** each of 30 realms has a god; objectives grant favor; ranks can unlock shop items and slightly increase general item rewards (codex 150-153). Emblems are god-specific, acquired in that god's realm; a frontier realm quest guarantees one (152,198). Shop assortment differs by issuer. Blessings are active only in that god's realm; duplicate next-battle benefits do not stack, but only one copy is removed per battle. Help caps blessing grants at five each for buffs, enemy debuffs and minions (147). No exact favor threshold, bonus curve or donation exchange rate is recovered.

**Connections:** patron relationship supplies services and local preparation, while repeated stock has a useful later consumer. This is institutional access; it does not establish personal affection or NPC motives.

**Authoring:** realm/patron mapping, god shops and reward/object consumers plus localized offers. **Saving:** `Gods/Favor`, resource and emblem-related string names support candidate retained domains; not an audited serialization or causal memory graph.

**PROPOSAL:** P07/P18/P14, K7/K8/K21/K29, institution and life-sim owners. Province War may use issuer-specific standing and separately funded services. Keep local law, service permission and pay stock distinct; never copy source gods, rewards or universal reputation gates.

## D09: Guild bounties, risk composition and cross-role anointments

**Model, SHOWN:** `scr_DatabaseRunes`, five `scr_*GuildShopSetup` functions, guild reputation helpers, `TargetGuild`, `WorldBossDepth`, `Anointments` save-shaped keys. Guilds are keyed to five classes; bounty occurrence and chosen reward are separate from standing.

**Rules, STATED:** projects establish guilds after defeating each Nether Boss twice (codex 232). Accept bounty, reach declared realm depth, fight to gain five runes, then enter a portal to the False God (233-234). Runes strengthen that opponent and increase reputation/rewards. Winning normally offers three anointments, keep one; stronger runes enlarge the choice pool. At most five equipped; some perks have no corresponding anointment (235). This is selective acquired capability import, not blanket access to every other class.

**Connections:** standing opens shops; chosen danger modifies the encounter and the reward choice, while equipped capability remains a separate state. Useful lesson for many worlds: proof, entitlement and present loadout need different fields. No live guild politics or autonomous NPC labor is shown.

**Authoring:** compiled runes/perks/guild shop definitions plus localized bounty and choice interfaces. **Saving:** guild-specific reputation keys, selected guild/depth and anointment array names are SHOWN only. Exact equipped/pending-choice publication remains unread. Numeric reputation helper evidence appears below.

**PROPOSAL:** P07/P10/P14/P16, K3/K7/K10/K13. Institutions/power authoring can support one optional chartered challenge with quoted risk and a useful selectable cross-role method. Persist accepted terms and pending choice; reopening cannot reroll or pay again. No source loadout ceiling is proposed for YAIRPG.

## D10: Prophecy tasks, line completion and relic investment

**Model, SHOWN:** native prophecy generation, task/line completion, turn-in predicate, per-task/total Piety, relic array and Reliquary enhancement families. UI has task, line and full-rune notifications and distinct progress/reward labels (ui 309-315,1061-1065). This is a multi-objective board with intermediate settlement opportunities, not future prediction.

**Rules, STATED:** story completion plus Reliquary project unlocks it. At least one completed line enables claiming; completing more lines improves reward. Prophecies repeat; task pool includes missions, arena, candles and Piety acquisition. Piety funds both individual relic ranks and shared Reliquary upgrades. Each ten relic ranks through 100 gives another perk; further ranks grow stats only (codex 217-222). UI enhancement descriptions quote 1% per rank for their respective effect family; Synergy grants a percentage of unassigned relic stat bonuses (567-573). Duplicate attunement in the current party blocks realm entry; unattuning is castle-only (479; dialog 241). Exact task distributions, board shape, rank costs and payout scaling are not supplied by text alone.

**Connections:** optional tasks point toward existing activities, then currency offers competing investments. Achievement completion raises Piety gain (codex 197,219). Native task predicates and arithmetic are recorded in supplement. **Saving:** `Piety`, `Reliquary`, `TaskCount/Task/TID/Done/Req/Prog`, `RelicArray` are candidate schema names; a coherent board and reward publication remains unproved.

**Authoring:** native task dispatch plus `L_PROPH_NAME_*`/`DESC_*`, relic perk text and compiled battle consumers. **PROPOSAL:** P10/P12/P02, K9/K12/K13/K16, event and production owners. Offer optional original tasks with retainable partial progress and explicit claim-now versus continue. No universal grind board or imported relic rank formula.

## D11: Collections and achievements are different progress dimensions

**Model, SHOWN:** `cards.csv` 465 records; `scr_DatabaseCards`, `inv_CardCount`, `inv_CardSetBonus`, power-unlocked/calculate/cache-clear helpers. Achievement definition/init/fulfillment families are distinct from text: 10570 achievement rows are not 10570 achieved or reachable goals. `CardArray/CardQuant/Achievement` are candidate save keys.

**Rules, STATED:** enemy cards are rare drops; distinct cards progress their set bonus; duplicate cards still grant ordinary additional stat bonuses but do not advance set completion (codex 200). Card text examples show qualitative transitions, not just additive stats: Ent set labels include 20% more Mend healing, 10% less damage while Mended, then permanent Mend duration (cards 2-4). Achievement points increase Piety from all sources (codex 197). No exact drop rate, distinct-card threshold or achievement multiplier is recovered. A `NetherStonePity` string is not evidence for card pity.

**Connections:** knowledge and candle targeting improve agency around a collection. Native cache helper names suggest derived lookup caching, but invalidation correctness requires bodies. Global collection bonuses are not evidence for technology transfer, inheritance or companion learning.

**Authoring and saving:** compiled set bonus and fulfillment consumers, text IDs, separate quantities and membership. No load roundtrip or complete cache rebuild trace. **PROPOSAL:** P04/P11/P16, K9/K11/K18, knowledge and ability owners. Show unique coverage and duplicate stock separately wherever they affect real outcomes. Exact collection-synergy ownership is partial; a general skill or codex owner alone does not establish a collector engine.

## D12: Race mastery, normalized trials and specialization ascension

**Model, SHOWN:** `masters.csv` name/trait families, `MasterKills/MasterDepth`, specialization-dependent gate UI, creature/class definitions. Masters and gods are different challenge families. Native same-name body coverage remains absent.

**Rules, STATED:** Masters appear at highest-ever depth, and a won depth no longer spawns one. Each win grants one mastery for that race, affecting damage by/to/from that race; exact coefficients are unread (codex 223-225). First win grants trait material; later wins can roll more, fifth grants costume, tenth permits that race's bestiary transmog. God gate scales your creatures to level 100; unlock requires defeating every Nether Boss (226). Ten key fragments form one key; Keyforge and favor-50 god shops are alternate key routes (227). Reward increases stop at god difficulty 10, but difficulty can continue through prior-level wins (228). Thirty gods defeated at difficulty 10+ with the same specialization yields that specialization's ascension (231). This is role-keyed accomplishment, not demonstrated reincarnation or a second prestige layer.

**Connections:** direct challenge history, repeat mastery, cosmetics, capability and reward-ceiling disclosure serve different needs. Source once-per-depth and once-per-avatar-upgrade constraints are source mechanics, not YAIRPG direction. **Authoring:** race-specific master trait tables, god encounter and gate UI. **Saving:** keys are inventoried but exact role/depth/upgrade retention unread.

**PROPOSAL:** P09/P14/P05, K3/K10/K16, trials and skills owners. One optional normalized trial can test real mechanics rather than raw level, with explicit rewards and further self-challenge terms. Preserve first-milestone one-prestige scope and all reasonable later paths.

## D13: Events, dialogue and narrative state are not one table

**Model, SHOWN:** 269 dialog, 892 story-dialog, 1376 lore and 1062 quest localization rows; 121 empty English quest cells. Stable scene/speaker prefixes, substitution tokens and separate choice/result tags coexist with native NPC/quest/flag databases and object events. Personality speech is another channel. Full rows and conditions visible in text are indexed privately, without flattening all four into one assumed graph.

**Rules, STATED:** realm quest completion enables the next expedition; codex introduction says these quests earn perk points, but specialization help qualifies perk-point earning to highest-ever depth (143 versus 195). Preserve that qualification instead of treating every lower-depth quest as a perk source. Arena dialogue has escalating rounds and separate loss/infinite-streak lines. Nether dwarf offers include free-play and already-used responses. These show authored states; they do not establish durable flags or a lifetime limit. A new supported occurrence can recur.

**Connections:** an object's local event can offer battle, grant loot or unlock dialogue. Text mentioning a reward is not proof that a typed response paid it. No universal relationship eligibility, portrait assignment or autonomous story clock is decoded.

**Authoring:** compiled flag/quest/NPC entry points and object scripts select stable localization IDs; no Ink-like general interpreter is established. **Saving:** `Flags`, quest serializers, quest-completed/tracked keys exist, but complete event-to-field-to-restore join unread.

**PROPOSAL:** P19/P20/P21/P10/P12/P24, K6/K12/K20/K23/K31. Reuse YAIRPG's staged dialogue host and existing durable publication. One original conversation should read actual event aftermath and commit a real supported choice, with pending-choice reload and blocked controls. Avoid new speech that implies unearned knowledge.

## D14: Optional macros, inspectors and local side games

**Model, SHOWN:** `scr_MacroProcess/IsLegal/HandleMacro` and editing/list/condition/action families; filters and source labels; arena and minigame object families. These share battle/inventory systems but have different admission and reward owners. This section documents their interfaces, not their full algorithms.

**Rules, STATED:** macros have up to twenty ordered lines, each subject + condition + action. First accepted action ends the turn; a selected spell still needs its gem (codex 154-158). They are explicitly optional. Arena drafts six level-100 creatures for up to five fights; Infinite continues with stronger foes; Wild adds a selected random local rule; Master requires a defeated Master. Interface quotes 5000 Crystal, performance Glory, Fame shop access, rank gates and draft mulligans (ui 535,1036,1263-1282). Dwarf ticket menu offers one/two/three-ticket choices (1154-1156). Exact gamble odds, payout tables, draft weights, mulligan count and scaling remain unread. Do not turn these into financial recommendations.

**Connections:** automation is chosen intent over existing action rules; arena loans a temporary roster without implying recruited-creature mutation. Filters expose traits, knowledge, fused state and ownership, while history separates current and last combat. Actual rendered desktop density is untested.

**Authoring and saving:** compiled macro list/legality/process and object Step/Draw/input bodies. `Macros/Lines`, arena streak/Fame/Glory names are SHOWN; interrupted drafts, macro edit recovery and temporary roster restore unread. **PROPOSAL:** P08/P01/P04/P14/P25, K10/K11/K14/K26/K30. For a selected original routine, show intent, useful next action and real stop reason at 1366x768. Mobile deferred. A macro is not NPC social autonomy or offline work. Dedicated minigame odds/payout ownership is absent in the read owners, though trials/UI provide adjacent routing.

## D15: Domain serialization, reconstruction and unresolved publication

**Model, SHOWN:** six newly decoded bodies cover paired creature, decoration and project encoders/decoders. Each delegates scalar/string work to `save_int/save_str` or `load_int/load_str`; nested equipment uses item helpers. This establishes real field readers/writers, not just names in the archive. Format keys, default behavior inside those scalar helpers, compression and whole-file protection remain unread.

| Domain | Native field observations | Reconstruction and limit |
|---|---|---|
| Project | `pid`, six `iq` counters, `param`, `parts`, `dust`, `finished`, `quests` read and written | Loader creates an instance and clamps negative `quests` to zero. Not proof of complete payout idempotency or schema migration. |
| Decoration | `did`, x/y, horizontal/vertical flips, name/text, direction, wander, two params read and written | Loader creates an instance then restores properties. Wander is a saved property, not evidence for a social planner. |
| Creature | writer reads slot/XP/definition constant, GUID/nickname/macro, five training counters, fusion parents/sort/personality, strategy/relic, visuals/accessories, race, Godforge, gems and item | Loader constructs through `scr_Creature`, restores identity/body/control fields, parses Godforge values and nested items; a conditional invalid-GUID branch calls `scr_GetGUID`. Full type/default/version and item-alias semantics remain open. |

**Correction:** `load_Creature` reads `note`, while the observed `save_Creature` field-read list does not include `note`. This is an asymmetry to investigate with key/default/caller joins, not proof that notes are lost. An omitted field name in decompiled output is not a reproduced data-loss bug.

**Rules and authoring:** field order is explicit in native operations; no self-describing mod schema is established. `save_Project` and `load_Project` pair all twelve visible fields, but version policy cannot be inferred from symmetry. Domain creation may derive other values from current definitions. Saved resolved identity and reconstruction of defaults must therefore be examined together.

**Whole-save limits:** prior Create copies files conditionally; Step timed out; `scr_LoadMain`, async completion, replacement/failure and backup selection remain unread. Save UI offers continue/upload/restart/exit and an Ironman realm refusal. A platform-specific corrupt-data warning exists (`ui.csv:L_PS_CORRUPT_DATA`), but is not proof the macOS build uses that recovery path. No personal save was accessed, no format fuzzing or source-game roundtrip occurred.

**PROPOSAL:** P16/P23/P24/P05, K15/K18/K33, save and authoring owners. Persist actual acquired instances and pending decisions under current publication owners. Keep labels and compiled definitions separate, preserve unknown content recoverably and test failed publication before promising durable state. This is no request to replace YAIRPG's save engine.

## Native trace supplement: exact static observations

All 18 requested helpers returned pseudocode in the corrected batch. Raw envelope: `~/.codex/research/ds-siralim-ultimate/notes/rea-followup-native.json`; short per-function census: `rea-followup-native-summary.json`. Bodies use `N/gml_Script_<name>.c`. Symbol-backed normal paths are SHOWN; high-level arithmetic interpretations below remain INFERRED where noted. Generated types, global overlaps, PIC calls and unwind tails remain decompiler limits. A returned body is not complete caller coverage.

| Trace | Function / original arm64 address | Result and boundary |
|---|---|---|
| N16 | `save_Creature` 0x1012acd78; `load_Creature` 0x101235de4 | Field-level body/identity/control/equipment serialization, as D15. Constructor, scalar defaults, item identity and whole-save callers incomplete. |
| N17 | `save_Project` 0x1012b7794; `load_Project` 0x101240280 | Twelve paired fields; negative loaded quest counter becomes zero (`load_Project` lines 280-295). Completion bit exists separately from input counters. |
| N18 | `save_Decoration` 0x1012b101c; `load_Decoration` 0x101239ca8 | Eleven paired properties including custom name/text and wander. Exact functional service and placement legality remain independent consumers. |
| N19 | `scr_KnowledgeGetRank` 0x104b596a4 | Scans count-prefixed `kills`, matches creature key at column 0 and reads numeric column 1. Thresholds below. Does not prove current Bestiary uses this reader. |
| N20 | `scr_KnowledgeGetRank2` 0x104b59e14 | Scans separate `knowledge` table, same key/value shape, different thresholds; object-exists guard returns -1. Symbol contains both historical/alternative readers; do not silently combine them. |
| N21 | `scr_ProjectIsDone` 0x104cf2684 | Tests dust/parts through requirement helpers and six collected `iq` values against `proj[pid]` slots 8-13 where corresponding item IDs in slots 2-7 are active. No wall-clock timer observed in this predicate. Completion/payout caller still unread. |
| N22 | `scr_ProjectMaxAmount` 0x104d0067c | Starts at 1, calls prior-completion predicate for four constant IDs and adds 1 for each. Native maximum in this helper is 5. Name/constant join remains open. |
| N23 | `scr_ProjectRequiredResources` 0x104d05128 | Generic `proj[id][14] * 1000`; IDs 33/34 return 40000, 73 returns 25000, 125 returns 30000. INFERRED decoded double constants. Constant-ID-to-project-name join still open. This returns a quantity, not a proven complete cost basket. |
| N24 | `scr_ProjectRequiredItemChance` 0x104d0422c | Compares requested item against definition item slots 2-7, reads associated definition chance slots. Exact probability units and actual random draw caller unjoined; full body retained. |
| N25 | `scr_CookingGetBonus` 0x101382d2c | Scans indices 0-27 in `cook`; each of two arguments must match either ingredient column 3 or 4 and style matches column 5; returns column 2. No match returns numeric 28. Does not itself enforce distinct ingredients or consume stock. Bonus ID 28's meaning and UI reachability unread. |
| N26 | `scr_GuildRepLevel` 0x104b212d4; `scr_GuildRepRequired` 0x104b21570 | Level helper calls floor after division by double 1000; required helper multiplies supplied level by integer 1000. INFERRED `floor(rep/1000)` and `1000*level`, justified by named overloads. Reputation award/cap/shop callers unjoined. |
| N27 | `scr_ProphecyCanTurnIn` 0x104d0dc5c | Returns whether `scr_ProphecyCountCompletedLines()` is nonzero. This is an actual eligibility predicate; line layout and payout caller unread. |
| N28 | `scr_ProphecyTaskPiety` 0x104d1c200 | Reads task `tid/req`, branches among authored task coefficients and flat values, adds an achievement-point term, then rounds. INFERRED final form `round(baseTaskPiety * (1 + AchievementPoints/1000))`; exact task-ID names and total-board multiplier unjoined. Raw branch data retained privately, not copied as a production balance table. |
| N29 | `scr_PersonalityRate` 0x104cb843c | Returns 0.3 for biome ID 21; otherwise stat-name/personality-ID dispatch chooses 0.4/0.2/0.3. Thus help's ordinary growth description has a native context exception. Biome-name/caller join and final stat rounding remain unread. |

### N19/N20 rank thresholds

SHOWN comparison constants and return values, interpreted as numeric rank indices. Highest satisfied threshold wins. Rank labels and current caller selection are not fully joined. No source coefficients are proposed for YAIRPG.

| Returned index | `kills` reader threshold | `knowledge` reader threshold |
|---|---:|---:|
| 0 | 1 | 10 |
| 1 | 10 | 100 |
| 2 | 50 | 500 |
| 3 | 100 | 1000 |
| 4 | 250 | 2500 |
| 5 | 500 | 5000 |
| 6 | 1000 | 10000 |

Both readers return 0 for a known Bestiary creature when no qualifying row is found, otherwise -1 for absent identity; N20 also returns -1 when its guard object exists. Therefore index 0 is not a clean proof that the first listed numeric threshold was earned. A display or eligibility reader must preserve the source's fallback distinction.

### Retained private depth

`extract/table-index.json` preserves full multilingual cells with table and logical-record locators. Topic extracts keep all matched records for knowledge, body/personality, projects, social offers, relics, dialogue, save and side games. Cooking/raw-game/save-window strings and all native bodies remain private. `extract/native-field-index.json` records exact field order and callers by helper. `extract/HASHES.txt` binds extracts; TOOLING provides the rerun route. Conditions encoded only in unread native callers are marked unread, rather than fabricated from adjacent dialogue text.
