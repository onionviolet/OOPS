# Warsim aspect pass

2026-10-14. Status: PARTIAL. Steam 659540, build 25097075. Static native/data evidence only; no game launch or personal save access. All twelve aspects are addressed, with unread scope retained. Prior dossiers and private extracts were reused read-only.

SHOWN means observed bytes, tables or a traced native path; STATED means a source describes behavior; INFERRED means a deduction. No new external stated claims are needed here. All YAIRPG takeaways below are PROPOSALS, not accepted design or implementation.

Priority findings: **F1** dialogue pools have retained IDs and a shown advisor eligibility rule; **F2** native control flow and file-specific readers explain the implementation split; **F3** fixed save fields coexist with companion and generated disk state.

## A01: Dialogue and conversation

SHOWN: 33 local Talk.txt pools contain 2,630 physical lines. Five further dialogue/flavor pools are Advice (265), Jest (290), ArenaInsults (138), GnomeInsults (378) and Ruffian (49). All 38 pools have native literal-path references. This pass retains their full text privately, with build/path/line IDs, hashes and reference-site addresses. Reference counts measure literal loading sites, not visits, player options or executed lines.

Implementation: native C++ branches consume text files rather than a demonstrated external dialogue graph. Many paths live in main; ProtofolkTribe, TravDuneWarriors, NomadCamp, KidsHideout and Drunk also reference local pools. Name/FaceGenerator produce identity/presentation separately. A face is not evidence of a distinct conversational agent or simulated past.

Advice at 0x140af5dc7 counts Data/Advice.txt rows, samples a row with rand()%rowCount, reads its integer prefix and rejects it unless that tag equals AdvisorType, AdvisorType2 or AdvisorType3. It prints the remainder and clears all three advisor slots after the pause. Tag counts are 999:8, 1:140, 2:20, 3:5, 4:2, 5:30, 6:35, 7:5 and 8:20. These are opaque category IDs; this read does not establish what every advisor role means. The shown helper has no general quest/resource transaction. No bounded retry or empty eligible-pool fallback was seen.

The prior Reaction read joins ten context families, ReactorType and ReactBonus to response branches. One livestock-aid petition, slot 44, checks NoBegging=NoRabble=SlaveKingdom=0, removes 100 gold on the selected aid route, requests reaction context 5 with bonus 40 and consumes the visitor. A recovered herd or recipient economy was not shown. Thus acknowledgment, treasury change and recipient consequence need separate evidence.

INFERRED: rejection sampling changes the eligible distribution; row counts alone do not give visitor probabilities. UNREAD: all caller gates, relationship-specific lines, complete speaker ownership and state effects for every embedded conversation. Full native string offsets and Reaction assembly are already private in prior work. This pass does not relabel every native branch as a line graph.

Evidence: [Prior pool census](../CONTENT_AND_SCOPE_DIGEST.md); [Reaction and petition chain](../pass-2026-10-14-rea/EVENT_DISPATCH_DIGEST.md); [Full private text, IDs and new Advice trace](PRIVATE_REFERENCE_INDEX.md).

PROPOSALS:

- `docs/worlds/DIALOGUE_AND_INTERACTIONS.md`: P1: give each original line a stable ID, eligibility facts, speaker and explicit effects; keep repeatable conversation routes reachable.
- `docs/CHARACTERS_AND_WORLD_EVENTS.md`: Resolve a petition transaction before its acknowledgment; show recipient consequences only when a real consumer applies them.

## A02: Narrative delivery

SHOWN: HeroBackground selects authored story rows; mercenary and champion/adventurer story strings are written to saves. This is retained generated prose, not proof that those lives occurred. The annual path clears battle-report strings, calls CombatPhase, appends mercenary battle logs and later calls TurnReport. Text receipts and retained state have different lifecycles.

Implementation: main and native event helpers combine embedded prose with tables. RandomTurnEvent, RandomExploreEvent and ProcGenExplo use different dispatch models, already traced in the prior lane. QuestGenerator supplies an item/value/place/giver tuple, including a SmallHaven state check, rather than a proven objective graph. See D3 for its exact composition and limits.

INFERRED: this mixture supports local callbacks and reports without requiring a general narrative engine. UNREAD: complete closure/reset chains, journal recall, letter/codex schemas and whether any caller turns the quest tuple into durable objectives. No generic story graph was established.

Evidence: [Story selection](../GENERATION_DIGEST.md); [Event scheduling](../pass-2026-10-14-rea/EVENT_DISPATCH_DIGEST.md); [Quest resolver](DEEPER_SYSTEMS.md#d3-quest-composition).

PROPOSALS:

- `docs/CHARACTERS_AND_WORLD_EVENTS.md`: Use fact-linked report entries with origin/action/outcome IDs instead of treating generated biography as earned history.
- `docs/GENERATION_FOUNDATION_RULES_2026-10-14.md`: P3: generate a quest description from real item/place/person records only when those records have objective and reward consumers.

## A03: Implementation architecture

SHOWN: Warsim.exe is a PE32+ x86-64 Windows console C++ program with COFF symbols, MinGW/libstdc++ markers and no CLR directory. Tables are plain text; selected readers use getline with periods and stoi. The observed helpers share many fixed globals for context, random scratch state and outputs. No managed engine, embedded script interpreter or external event bus was established by these reads.

This inventory finds 143 named no-argument game helpers matching the COFF naming pattern, plus main. It is not a count of classes or every callable routine. The next-symbol span from main to Extras is 7,334,807 bytes; that span is a size signal, not the amount of semantic gameplay code. Large resolvers and main contain many unnamed menu subsystems. Native layout is not a clean module boundary.

A bounded opening read shows console code page 437, title setup, clock sampling and srand(time(NULL)) at 0x14000172e-0x14000173a before MainMenu. On one loop path, GameLoaded can bypass the opening section, Autosave==1 sets it to 2 and calls SaveGame, then a later path calls RefreshPhase, increments Year, calls CombatPhase, appends and clears mercenary logs, calls EnemyCombatPhase and calls TurnReport unless Gameover==1. This is a selected path, not certification of every annual entry/exit.

Focused native reads also show repeated file counting/reopening and rejection sampling in Advice and MonsterMaker. These are observed operations, not measured runtime bottlenecks. This pass uses bounded import with no full auto-analysis and decompiles five named functions successfully. Prior REA/direct timing is reused rather than rerun. UNREAD: threading, all runtime hotspots, complete main control flow and any hidden interpreter or dispatch mechanism outside selected regions.

Evidence: [PE and symbols](../TOOLING.md); [REA versus direct measurement](../pass-2026-10-14-rea/REA_TRIAL.md); [Focused reads and phase window](TOOLING.md).

PROPOSALS:

- `docs/GENERATION_FOUNDATION_RULES_2026-10-14.md`: Keep identity, eligibility and effects in the existing generation kit; avoid a parallel scratch-global resolver.
- `docs/ENGINE_EXPANSION.md`: Separate annual refresh, deployment, opponent resolution and reports with explicit state owners and order.

## A04: Save and persistence

SHOWN: SaveGame at 0x14078fc02 writes a positional period-delimited text stream. The previous scan retained 1,903 named writes: 1,454 integer writes and 449 string writes, with 1,901 distinct names because Spymaster and MonsterChallenge recur. The ENDOFFILE sentinel gives the regular reader its expected 1,904th token. LoadGame at 0x140767166 counts tokens and compares with 0x770, unless SkipLoad bypasses that check, then parses positions using getline/stoi. Later count-dependent compatibility branches exist. This is not a keyed or explicit versioned schema.

The 1,454 integer readers align with the writer sequence except seconds loads into BonusSeconds. That timer mapping does not prove offline advancement. Treasury, armies, policies, Year, generated faction identity, arena records, lore strings and selected exploration/callback state are retained. New verification finds 33 direct fields across three monster slots: name/description/image/color/strength, three abilities, feeding state, XP and level for each slot. Trainer/pit/challenge fields are additional. These are writer observations, not a save/reload test.

Companions include NobilityOne..Five and Adventurers files. Data/Names/*_NamingSystem.txt are mutable recipe artifacts outside the shown main envelope. New GenerateRelations evidence shows Data/Relations.txt is also regenerated on disk and sets BanditTruce1..5 in memory when the corresponding final relation is positive. The whole persistence boundary therefore cannot be inferred from the main file alone. The live Relations file was excluded from retained data; its writer schema is retained instead.

Autosave==2 chooses the Autosave name in SaveGame and returns the mode to 1. The opening main path sets that mode before SaveGame. Initial RNG seeding now has a shown time-based site, but complete seed lifecycle and RNG continuation remain unread; no rand-state write was identified in the selected writer.

UNREAD: 449 string reader joins, all legacy count migrations, malformed string/numeric failure paths, delimiter escaping, complete companion copy/load and recipe/relation save isolation. No private save or score was accessed and no game/save routine was run. Absence of a shown offline resolver is not proof that none exists.

Evidence: [Schema and numeric joins](../pass-2026-10-14-rea/SAVE_FORMAT_DIGEST.md); [Monster fields and relation disk writer](DEEPER_SYSTEMS.md); [Field sequence locators](PRIVATE_REFERENCE_INDEX.md).

PROPOSALS:

- `docs/research/PROFILE_AND_BRANCH_SAVE_SHAPE_2026-10-14.md`: P2: audit the complete persistence boundary, including generated companions/recipes, and preserve identity plus required generator version state.
- `docs/ENGINE_EXPANSION.md`: Validate save/reload and literal import against changed monster, relation and petition facts before claiming retention.

## A05: AI and NPC behavior

SHOWN: KingdomGenerator and MercGenerator reuse race, identity and presentation helpers. Fixed faction/unit slots and EnemyCombatPhase exist; separate DiplomacyRelation and IndieDiplo helpers are cataloged. The new initial relation writer makes independent directed entries with hard-coded bias inputs, not a symmetric matrix. Five positive results set bandit truce flags. D2 records the exact random helper.

Implementation evidence supports generated faction facts and native opponent/diplomacy routes. It does not establish planners, utility scoring, personal schedules or that opponents use the player's full rules. Monster progression is numeric growth; names and biographies do not establish autonomous lives.

UNREAD: relation consumer mapping, opponent action weights, staff decisions and shared affordability/combat rules. No general planner was identified in the selected reads, which is a bounded negative observation.

Evidence: [Identity reuse](../GENERATION_DIGEST.md); [Relation initializer](DEEPER_SYSTEMS.md#d2-directed-starting-relations); [Opponent and diplomacy helpers](SYSTEM_INVENTORY.md).

PROPOSALS:

- `docs/research/SIMULATION_AND_NPC_ARCHITECTURE_2026-10-14.md`: Model directed beliefs/relations separately from treaties and truce flags; add real consumers before describing faction agency.
- `docs/ENGINE_EXPANSION.md`: Province War opponents should resolve budgets and losses through the actual economy/combat owners.

## A06: UI and information design

SHOWN: native console output uses numeric choice helpers, printed menus, colors, ASCII portraits/graphics, clear-screen and pause calls. main sets console output code page 437. Helpers include KingdomStatsBar, CurrentGoldBar, TroopCountReport, KingdomReport and battle graphics. These are source-visible surfaces, not observed desktop screenshots.

Implementation is sequential console interaction with presentation routines and globals, not demonstrated browser panels or responsive layout. How much information remains visible together depends on branches and terminal dimensions. UNREAD: complete menu hierarchy, key bindings, number formatting and screen density. No game was launched.

PROPOSAL viewport: 1366x768 for YAIRPG, with selected province, available labor/deployed residents and next-turn affordability visible together. Mobile work remains deferred; rebuilt browser proof is required for an eventual UI claim.

Evidence: [Menu observations](../KINGDOM_LOOPS_DIGEST.md); [Console setup](TOOLING.md); [Desktop proposal](../pass-2026-10-14-rea/PROVINCE_WAR_FIT.md).

PROPOSALS:

- `docs/ENGINE_EXPANSION.md`: Make labor, deployment and affordability readable in one desktop decision view.
- `docs/worlds/DIALOGUE_AND_INTERACTIONS.md`: Preserve speaker and transaction context while a dialogue choice is open.

## A07: Content authoring and modding

SHOWN: the prior metadata inventory has 255 Data/Extras text files, including 217 Data files and 38 Extras files. This pass retains 190 selected Data files privately and excludes 27 settings, portrait, dynamic roster, recipe or relation files. The exclusions preserve personal state boundaries; they are not proof the files are unused.

External tables feed names, race modifiers, stories, talk, quest items and monster parts. Formats differ by reader: Advice has an integer eligibility prefix; monster rows have category, strength, ability and counted art fragments; QuestItem has value then description. Many conditions, effects, place/giver vocabularies and UI branches remain compiled native code. Data-driven content and a full mod API are distinct claims.

NameMaker/NameWriter use an alphabet recipe; the prior resolver recovered 50 typed-name aliases with no cycles/missing destinations. Those mechanisms do not make every content pool universally scriptable. UNREAD: editor tooling, mod API, load order, hot reload and complete validation. No such public authoring interface was established locally.

Evidence: [Data inventory](../CONTENT_AND_SCOPE_DIGEST.md); [Name recipes and aliases](../pass-2026-10-14-rea/NAME_AND_LORE_DIGEST.md); [Three table/code joins](DEEPER_SYSTEMS.md).

PROPOSALS:

- `docs/GENERATION_FOUNDATION_RULES_2026-10-14.md`: Give each content family a documented schema, stable row ID, validation and a real native consumer.
- `docs/worlds/DIALOGUE_AND_INTERACTIONS.md`: Validate advisor eligibility pools before selection and keep original authored text separate from effect rules.

## A08: Balance and numbers

SHOWN: prior arithmetic reads recover selected labor-based harvest, wages/desertion, recruitment transfers, living-unit casualty sampling, survivor return and arena settlement. They remain selected formulas, not a full balance model. Damage thresholds use strict boundaries; modifier order and integer rounding matter. The new monster curve spends 100 XP and adds newLevel+1 strength per level; D1 gives its caller gate and closed form.

RNG uses C rand with remainder arithmetic. Initial srand(time(NULL)) is shown in the opening main window. RandomTurnEvent includes quiet slots; exploration and Advice/monster category selection can redraw rejected candidates. Quest giver selection has 27 explicit outcomes and 23/50 nominal mass for a default farmer generator, rather than 50 distinct authored roles. Relation negative bias uses the original input magnitude and consumes a discarded first draw.

INFERRED: quoted weights are residue counts, not exact uniformity guarantees for the platform RNG, and call order couples later random outcomes. UNREAD: full seed lifecycle, pity/bad-luck protection, global overflow handling, every event/economy coefficient and all battle-round budgets. Selected native integers are not evidence of safe arbitrary big-number scaling.

Evidence: [Exact selected formulas](../pass-2026-10-14-rea/ECONOMY_AND_BATTLE_DIGEST.md); [Dispatch weights](../pass-2026-10-14-rea/EVENT_DISPATCH_DIGEST.md); [New curves and distributions](DEEPER_SYSTEMS.md).

PROPOSALS:

- `docs/ENGINE_EXPANSION.md`: Keep power, head count, damage budget, loss and returned population distinct; specify rounding/order at boundaries.
- `docs/GENERATION_FOUNDATION_RULES_2026-10-14.md`: Use existing addressed RNG and record eligibility/quiet outcomes instead of copying mutable global draw order.

## A09: Time and scheduling

SHOWN: an inspected main path calls RefreshPhase, increments Year, resolves CombatPhase then EnemyCombatPhase and TurnReport, with a Gameover exit before the last report. Autosave occurs earlier on its eligible path. The opening samples clock and seeds from wall time; that does not make game years real-time ticks.

The prior dispatcher reads establish separate turn/explore/procedural selection architectures and some flags. They do not reconstruct all cooldowns, queue budgets or reset consumers. seconds->BonusSeconds is a persistence mapping, not an offline catch-up formula.

UNREAD: every transition into the annual path, aging/lifespan rules, deadlines, complete staff/monster refresh cadence and offline behavior. No real-time scheduler or background advancement was established by this pass.

Evidence: [Opening main path](TOOLING.md); [Dispatch and reset limits](../pass-2026-10-14-rea/EVENT_DISPATCH_DIGEST.md); [Timer field](../pass-2026-10-14-rea/SAVE_FORMAT_DIGEST.md).

PROPOSALS:

- `docs/research/OFFLINE_TIME_AND_BRANCH_CLOCK_AUDIT_2026-10-14.md`: Keep action time, annual resolution and away time under explicit clock owners; do not infer a missed year from wall time alone.
- `docs/ENGINE_EXPANSION.md`: Make refresh, wages, losses and report order observable in one annual receipt.

## A10: Onboarding and reveal

SHOWN: MainMenu, DifficultyChoice, Choice/Choice2 and many conditional local-content routes exist. Selected petition policy flags alter eligibility and selected annual loading state bypasses opening work. These facts show gated routes, not a recovered tutorial sequence.

UNREAD, because the menu/difficulty bodies and full discovery chronology were not selected for focused analysis: starting presets, tutorial steps, unlock order and staged complexity. No independent prestige/new-game-plus loop was proved. A huge inventory is not an onboarding design.

Evidence: [Menu and difficulty locators](SYSTEM_INVENTORY.md); [Policy-gated route](../pass-2026-10-14-rea/EVENT_DISPATCH_DIGEST.md).

PROPOSALS:

- `docs/worlds/DIALOGUE_AND_INTERACTIONS.md`: Explain a known refusal and an available next action where the player makes the choice.
- `docs/ENGINE_EXPANSION.md`: Reveal one playable decision loop through actual state and consequences, then expose deeper options through discovery.

## A11: Little touches

SHOWN: color and ASCII face/monster art routines, reaction variants, local talk pools, contextual jokes/insults, explicit level/strength/XP receipts, sound functions and quiet-display controls are present. MonsterLeveller respects Ascii, SoundMute and MonsterUpNoSplit in selected presentation paths. The last suppresses a pause, not the XP/strength transaction.

Implementation combines table text, native print branches, shared presentation globals and stored identity. Prior touches already enumerate 24 ideas; this pass adds evidence rather than another parallel list. UNREAD: full keyboard accessibility, screen-reader support, color-blind handling and every sound/animation setting. No runtime presentation quality is certified.

Evidence: [Prior 24 touches](../SMALL_TOUCHES.md); [Growth receipts](DEEPER_SYSTEMS.md#d1-monster-assembly-and-growth); [Context pools](PRIVATE_REFERENCE_INDEX.md).

PROPOSALS:

- `docs/worlds/DIALOGUE_AND_INTERACTIONS.md`: Keep acknowledgment and stable identity in quiet/delegated outcomes without requiring repetitive pauses.
- `docs/ENGINE_EXPANSION.md`: Pair growth feedback with exact XP spent and strength gained, derived from the applied transaction.

## A12: Other systems

SHOWN as inventory: arena/tournaments/champion recruitment, dice and brawling, drinking competitions, bard/entertainment, nomad/protofolk/dune travelers, kids hideout, council/staff, monster pit/training, raids/invasions/skirmishes, faction generation, black market and exploration. Some live in helpers, others in main menus and local tables. The complete symbol/table inventory keeps all observed families reachable for later reading rather than equating unselected with absent.

New deeper reads cover monster assembly/progression, directed initial relations and quest composition. Existing arena/recruitment/economy digests remain reusable. UNREAD: full gambling rules, council/staff effects, nonselected place economics, collections/achievements and an independent meta-progression loop. Named helpers establish locations, not a complete mechanic specification.

Evidence: [Full native and table catalogs](SYSTEM_INVENTORY.md); [Top three deeper reads](DEEPER_SYSTEMS.md); [Existing arena and recruitment](../pass-2026-10-14-rea/ECONOMY_AND_BATTLE_DIGEST.md).

PROPOSALS:

- `docs/ENGINE_EXPANSION.md`: Let side activities feed an existing training, social or resource owner rather than build isolated rewards.
- `docs/GENERATION_FOUNDATION_RULES_2026-10-14.md`: Choose the next deeper system by reachable consequence and missing reader, not table count.

## A01 pool index

Full text stays private. IDs use `ws.25097075:<Data/path>:line:<1-based row>`. Build qualification makes row addresses reproducible for this snapshot; they are not cross-version canonical IDs. Except Advice, exact per-line predicates are not reconstructed. Native path references show possible loading contexts only.

| Pool | Physical rows | Literal references | Referencing helpers |
|---|---:|---:|---|
| `Data/Advice.txt` | 265 | 2 | _Z6Advicev |
| `Data/ArasukTalk.txt` | 70 | 2 | main |
| `Data/ArenaInsults.txt` | 138 | 6 | _Z12BattleEventsv, _Z12ProcGenExplov, _Z9BattleSimv |
| `Data/ArenaTalk.txt` | 41 | 2 | main |
| `Data/ArtifactTalk.txt` | 41 | 2 | main |
| `Data/BaiaaTalk.txt` | 46 | 4 | main |
| `Data/BanditTalk.txt` | 41 | 2 | main |
| `Data/BardTalk.txt` | 50 | 4 | main |
| `Data/BlackmarketTalk.txt` | 212 | 12 | main |
| `Data/BrawlTalk.txt` | 154 | 4 | main |
| `Data/DarkdaleGuardTalk.txt` | 28 | 2 | main |
| `Data/DuneHoldTalk.txt` | 35 | 2 | main |
| `Data/DunewarriorTalk.txt` | 18 | 2 | _Z16TravDuneWarriorsv |
| `Data/GnomeInsults.txt` | 378 | 4 | _Z8DiceGamev, main |
| `Data/GoblinwoodDrummerTalk.txt` | 26 | 2 | main |
| `Data/GoblinwoodPrisonerTalk.txt` | 28 | 2 | main |
| `Data/GorthmekTalk.txt` | 70 | 2 | main |
| `Data/Jest.txt` | 290 | 29 | _Z11EntertainMev, _Z12ProcGenExplov, _Z6Extrasv, main |
| `Data/JestersSocietyTalk.txt` | 23 | 2 | main |
| `Data/LeafburnerTalk.txt` | 18 | 6 | main |
| `Data/LoveCultistTalk.txt` | 19 | 4 | main |
| `Data/LoveTalk.txt` | 41 | 2 | main |
| `Data/MageTalk.txt` | 38 | 2 | main |
| `Data/MineTalk.txt` | 41 | 2 | main |
| `Data/NomadTalk.txt` | 64 | 2 | _Z9NomadCampv |
| `Data/NorthwatchTalk.txt` | 11 | 2 | main |
| `Data/PrisonTalk.txt` | 51 | 2 | main |
| `Data/ProtoTalk.txt` | 79 | 2 | _Z14ProtofolkTribev |
| `Data/RosesOrderTalk.txt` | 33 | 2 | main |
| `Data/Ruffian.txt` | 49 | 2 | _Z11KidsHideoutv |
| `Data/ScorpTalk.txt` | 35 | 2 | main |
| `Data/SewerTalk.txt` | 122 | 4 | main |
| `Data/ShaianTalk.txt` | 69 | 6 | _Z5Drunkv, main |
| `Data/SlaverTalk.txt` | 61 | 4 | main |
| `Data/SlumPitTalk.txt` | 23 | 2 | main |
| `Data/SnowfolkTalk.txt` | 32 | 2 | main |
| `Data/TavernTalk.txt` | 883 | 56 | _Z5Drunkv, main |
| `Data/VillageTalk.txt` | 127 | 12 | _Z5Drunkv, main |
