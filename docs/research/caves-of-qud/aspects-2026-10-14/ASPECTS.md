# Caves of Qud aspect backfill

2026-10-15 execution of the 2026-10-14 lane. Research only. SHOWN means installed data or decoded source inspected; STATED means a manifest/prior report says it; INFERRED means analysis. No source game, Windows executable or personal save was run/read. Covered means bounded static aspect coverage, not exhaustive source review or native acceptance.

## Corrections to prior dossier first

| Code | Prior wording / assumption | Current correction and evidence |
|---|---|---|
| F1 | Original full 5,437-file export is available. | That old path is historical and the old Mac extracts are gone. This lane rebuilt only a class index and targeted exports from the installed app. The newer audit also records the old path as absent. Its retained data is not proof of current full export availability. |
| F2 | Game not installed in original intake/re-pass. | Historical truth for those passes. Steam now reports app 333640 StateFlags 4, build **25520692**, downloaded/staged byte totals complete. No install action needed. |
| F3 | Compare installed build to prior INTAKE. | Prior INTAKE.json contains no Steam build ID, so numeric build change is **unknown**. Installed Assembly-CSharp.dll SHA-256 `2cc28fba5a86221e27bfdcaa5f5a91a2e249fd474814dce7cff25a9a649b8589` exactly matches prior version **2.0.211.56**. No gameplay assembly change is shown; platform/DLC/package equality is not implied. |
| F4 | Generic failed-candidate fallback / asynchronous achievement profile. | Re-pass already narrowed AI fallback: the missile wrapper can report true after inner failure. Achievement-profile persistence is separate from the main save. This pass traces main save publication and shows backup/header checks, not atomicity. |
| F5 | Root CHECKPOINT, COVERAGE, TOOLING expected. | Those Markdown files are absent. Read REPORT.md and INTAKE.json, FINDINGS/VALIDATION, then repass CHECKPOINT.md, COVERAGE.json and REPORT.md. Original tooling is in INTAKE.json; do not invent missing-file contents. |
| F6 | Five inspected mechanic paths summarize all available research. | The newer [Qud systems audit](../../qud-systems-audit-2026-10-15/SYSTEM_CATALOG.md) covers skills/powers, reputation, knowledge/crafting, generated world and UI, with two deeper supplements. Reuse its named windows and limits. It is not whole-game coverage. |

Private evidence root: `~/.codex/research/bf-caves-of-qud/`. Source references below are relative to `extract/` there. Original bytes, full text/conditions/IDs, parsed XML trees, commands and hashes stay outside Git. [TOOLING](TOOLING.md) supplies replay steps; [SYSTEM_INVENTORY](SYSTEM_INVENTORY.md) includes all discovered namespace families and table files. Proposals route to current owners and are not accepted decisions. Desktop/laptop first, mobile deferred; one realm/one prestige remains unchanged.


## A01: Dialogue and conversation

Status: **covered**, static scope.

SHOWN: the two Base files contain 212 conversation declarations, 1,503 node tags (counting one capitalized Node), 119 start tags and 3,482 choice tags. These are raw declarations, not unique baked runtime nodes. Full XML trees, text, conditions and IDs stay private. Base conversation attributes include 123 IfHaveActiveQuest, 94 IfHaveState, 53 CompleteQuestStep and 32 StartQuest occurrences; this counts attributes on all elements, not unique routes.

ConversationLoader merges matching IDs, supplies BaseConversation inheritance, resolves/bakes dependencies and distributes children. Conversation.GetStart wakes and stable-sorts starts by priority, selecting a visible start. IConversationElement routes known attributes to predicate and action delegates, supports expression evaluation and propagates typed conversation events through parts. Text preparation has subject/object substitution hooks. ConversationUI supplies speaker/listener/transmitter/receiver and an icon; this does not establish separate authored portrait assets for every NPC.

Visibility calls predicates; selection separately calls choice.Enter, current-node.Leave and target-node.Enter before choice.Entered changes state. QuestHandler applies start/step/finish/complete on EnteredElementEvent. RequireReputation computes Fulfilled during text preparation and uses that cached value at entry. WaterRitualLearnSkill has a separate actual reputation-spend call and teacher attribution. These must not be described as one universal fresh predicate check or atomic transaction. Unknown/throwing predicates can return the default true; action exceptions are logged and later actions can continue. Choice hashes drive visited coloring; this pass does not establish their whole-save retention. See DEEPER_SYSTEMS for the exact ordering.

Sources: `XRL.World.Conversations.ConversationLoader.cs`, `XRL.World.Conversations.Conversation.cs`, `XRL.World.Conversations.IConversationElement.cs`, `XRL.World.Conversations.Choice.cs`, `XRL.UI.ConversationUI.cs`, `XRL.World.Conversations.Parts.RequireReputation.cs`, `XRL.World.Conversations.Parts.QuestHandler.cs`, `Base/Conversations.xml`, `Base/HiddenConversations.xml`.

PROPOSALS: Narrative/social service owner: separate visible offers, entry permission and committed result. UI_RULES.md: show useful gate reasons and visited state without exposing undiscovered truth.

## A02: Narrative delivery

Status: **covered**, static scope.

SHOWN: authored Quests.xml holds 28 quest declarations and 84 steps; Books.xml holds 53 books and 210 page elements. JournalAPI owns structured notes and accomplishments rather than only a scrolling combat feed. XRLGame has quest state and completion-time owners; QuestHandler connects a selected dialogue choice to those owners. History saves entities and their events, reconstructing event and entity indexes on load. Generated historic prose uses HistorySpice alongside snapshots and event records.

The newer local generated-world audit already traces a fetch quest from generated context to placement, acceptance, turn-in and reward. REUSED source evidence, not a new playthrough: ../../qud-systems-audit-2026-10-15/GENERATED_WORLD_AND_QUESTS.md. INFERRED: this separation helps explain a world through discoverable records, but a recorded historic year does not prove ongoing offscreen simulation. Every authored quest branch and generated sentence remains unread.

Sources: `Base/Quests.xml`, `Base/Books.xml`, `Base/HistorySpice.json`, `Qud.API.JournalAPI.cs`, `HistoryKit.History.cs`, `HistoryKit.HistoricEntity.cs`, `XRL.XRLGame.cs`.

PROPOSALS: Journal/knowledge owner: keep structured discovery records linked to actual quest outcomes. World/history owner: generate evidence from stable events rather than independently rolling each retelling.

## A03: Implementation architecture

Status: **covered**, static scope.

SHOWN: installed CoQ.app contains Unity managed assemblies and a Mono-style Assembly-CSharp.dll. ILSpy reads managed IL, with no native executable needed. Object blueprints and XML/JSON tables author much content; C# parts, effects, skills, mutations, builders and systems implement behavior. Factory construction, inheritance/mixins and actual part registration are distinct phases.

ActionManager owns active actors, action queues and delayed commands. RunSegment adds Speed to Energy and admits actions at 1000 energy, then runs cooldown and turn work. MinEvent registers typed event IDs and reusable pools; ResetPools resets active allocations. IGameSystem exposes lifecycle/save hooks. ModManager resolves types and compiles mod C# through Roslyn. This is neither an ECS claim nor proof that all content is externalized. Performance intentions are INFERRED from pooling, field caches and zone freezing; no benchmark ran.

Sources: `XRL.Core.ActionManager.cs`, `XRL.World.MinEvent.cs`, `XRL.IGameSystem.cs`, `XRL.World.GameObjectFactory.cs`, `XRL.World.Loaders.ObjectBlueprintLoader.cs`, `XRL.ModManager.cs`.

PROPOSALS: Engine/event owner: adapt typed result boundaries within current commands instead of importing another component engine. Scheduler owner: keep one authoritative action/time owner and explicit remote-zone policy.

## A04: Save and persistence

Status: **partial**, static scope.

SHOWN: XRLGame writes save version 409 and accepts reader versions 395 through 409. It serializes a custom binary stream compressed as .sav.gz, plus JSON summary metadata. The payload includes player, game systems, zones, action manager/commands, quests, reputation, identification/tinkering globals, factions, history, genders/pronouns, typed game-state maps, object game state, journal and seen blueprints. TransientGameState and many caches are marked NonSerialized. ZoneManager also owns Cache.db and frozen-zone data, so the main compressed file alone is not the entire world envelope.

SerializationReader's field path skips static/literal/NonSerialized fields and respects FieldSaveVersion minimums. Load uses sentinel checks between sections, rejects unsupported versions and has reader error paths. On eligible primary-version upgrades it attempts backups of both save and zone cache. Save serializes in memory, writes JSON, copies existing payload to .bak, writes compressed payload, then CheckSave checks only length and the two-byte gzip header. SaveGameError attempts to restore the payload backup and shows a failure. JSON, cache and payload publication is not shown as one atomic transaction. The save function often returns null; an asynchronous-looking signature is not proof of asynchronous durable completion.

AutoSaveCommand deduplicates queued ISystemSaveCommand instances before saving Primary. ActionManager explicitly writes action queue identities and commands. No private save was opened. UNREAD: every migration branch, exact object identity repair, all autosave producers and corruption recovery end to end. No wall-clock offline reward mechanism was established. The LoadGame decompilation contains a collapsed gzip conditional; its uncompressed legacy fallback must be checked against IL before claiming it works.

Sources: `XRL.XRLGame.cs`, `XRL.World.SerializationReader.cs`, `XRL.World.SerializationWriter.cs`, `XRL.World.FieldSaveVersion.cs`, `XRL.World.ZoneManager.cs`, `XRL.Core.ActionManager.cs`, `Qud.API.SavesAPI.cs`, `XRL.Core.AutoSaveCommand.cs`.

PROPOSALS: Persistence owner: validate the whole durable envelope and retain recoverable metadata/cache consistency. Command owner: save committed delayed work with explicit restore policy; prove it with isolated save/reload/import later.

## A05: AI and NPC behavior

Status: **partial**, static scope.

SHOWN, plus bounded predecessor trace: Brain acquires targets through perception and dispatches goals; Kill checks actual target validity, range, ability readiness, body/equipment and collateral context. Candidate kinds can be randomized or authored. Goal stacks, pursuit, pathfinding and faction attitudes are separate concerns. Base Factions has 83 declarations, ChiliadFactions 49; these are not a runtime faction total.

The re-pass found that an inner missile-fire failure can be hidden by an outer true return, ending that selection pass; do not claim every failed candidate falls through. Nearby allies can veto an NPC burst while a direct method remains eligible. Physical equipment and loaded ammo matter, not inventory names alone. REUSED: ../repass-2026-10-14/REPORT.md and newer audit depth-2. UNREAD: all 44 goal-handler classes and full actor schedules. Native autonomous lives and universally shared player/NPC decision policy are not proved.

Sources: `XRL.World.Parts.Brain.cs`, `XRL.World.AI.GoalHandlers.Kill.cs`, `Base/Factions.xml`, `Base/ChiliadFactions.xml`.

PROPOSALS: NPC owner: preserve observation, eligibility and actual result as different records. Encounter owner: let narrow versus broad methods respond to current collateral and tools.

## A06: UI and information design

Status: **partial**, static scope.

SHOWN source only: ConversationUI supports wrapped choices, scroll-to-selection, numeric/alphabetic selectors, Escape when allowed, mouse events and a separate Popup.ShowConversation route. Priority and visited state alter the choice list. TradeScreen has two inventories, category collapse, search/navigation context and totals denominated in water drams. Commands.xml declares 198 command tags, 241 keyboard binds, 75 gamepad binds and eight mouse binds; Options.xml has 194 option declarations. These are source declarations, not a successful keybinding census.

REUSED: the newer UI_IMPLEMENTATION.md covers ability bars, skill/cybernetic panels, journal and recipe surfaces. UNREAD: serialized prefab layout and actual current presentation. No screen count, simultaneous desktop composition, font fit or accessibility outcome is claimed from source alone. No game was launched for visual evidence.

Sources: `XRL.UI.ConversationUI.cs`, `Qud.UI.TradeScreen.cs`, `Base/Commands.xml`, `Base/Options.xml`, `TutorialManager.cs`.

PROPOSALS: UI_RULES.md / Proto23 owner: put routine actions and gate reasons in their existing desktop homes, retain the log column. Navigation owner: show selection, inspect and activation as separate states; later check 1366×768 on a populated save.

## A07: Content authoring and modding

Status: **covered**, static scope.

SHOWN: XML supplies object inheritance/mixins, conversation graphs and parts, quests, populations, factions, powers and configurable UI data; JSON supplies history grammar and corpus data. ModManager discovers mods, resolves dependencies, computes load order, builds C# assemblies, checks conflicting type names and resets mod-sensitive caches. ResolveType searches loaded mod assemblies before the base fallback in the inspected path; cached/reflection routes have their own semantics. Duplicate mod IDs are skipped with a warning. Conversation loader logs potential mod errors and continues.

Compat.xml names old/new identifiers across skills, mutations, factions and blueprints; it is compatibility data, not proof all old saves migrate. Mods.xml's 59 mod tags are item modifications, not 59 installed user mods. Map editor namespaces and RPM files show separate map-authoring support; that file format/editor workflow was not decoded. No new parser/compiler framework is proposed for YAIR.

Sources: `XRL.ModManager.cs`, `XRL.World.Conversations.ConversationLoader.cs`, `XRL.World.Conversations.ConversationXMLBlueprint.cs`, `XRL.World.Loaders.ObjectBlueprintLoader.cs`, `Base/Compat.xml`, `Base/Mods.xml`.

PROPOSALS: Content registry owner: validate references and unique type/record IDs before a playable build. World authoring owner: keep small authored tables backed by explicit current behavior consumers.

## A08: Balance and numbers

Status: **partial**, static scope.

SHOWN: Stat uses several named Random streams, reseeding and push/pop state; level-up state uses a stored seed. PopulationManager reads Chance, Weight and Number plus recursive population references. PopulationTables.xml contains 1,510 population declarations, 7,900 object tags, 2,049 groups and 2,167 table references. Skills has 21 skill and 123 power rows; mutation tables hold 132 mutation rows. Counts include authored alternatives and hidden entries, not exact obtainable runtime sets.

These are bounded integer/resource and dice systems rather than evidence of arbitrary-precision idle growth. Seed partitioning does not by itself prove replay determinism across save/version/mod changes. UNREAD: all distributions, every curve/consumer, overflow behavior and broad pity mechanics. No global assertion that pity is absent is warranted.

Sources: `XRL.Rules.Stat.cs`, `XRL.PopulationManager.cs`, `Base/PopulationTables.xml`, `Base/Skills.xml`, `Base/Mutations.xml`, `Base/HiddenMutations.xml`.

PROPOSALS: Balance/RNG owner: use purpose-specific deterministic streams where replay matters. Population/content owner: keep roll weights and nested references inspectable with a declared sampled pool.

## A09: Time and scheduling

Status: **covered**, static scope.

SHOWN: action energy, simulation ticks, calendar display and generated historic years have separate owners. Calendar defines 50 turns per hour, 1,200 per day and 438,000 per year. ActionManager ticks ability cooldowns and advances game.TimeTicks; a fast actor can take multiple eligible actions. Delayed commands have a queue and serialized entries. ZoneManager stores frozen ticks and passes elapsed simulation ticks to Zone.Thawed.

A thaw hook is not proof of full remote NPC/combat/economy simulation. WallTime tracks played duration in the inspected save path, not an established offline-progress clock. UNREAD: all thaw listeners, every cooldown consumer and long-run aging. Calendar labels are not real-time duration promises.

Sources: `XRL.Core.ActionManager.cs`, `XRL.World.Calendar.cs`, `XRL.World.ZoneManager.cs`, `HistoryKit.History.cs`.

PROPOSALS: Time owner: state which clock each effect uses and what happens when a region is inactive. World lifecycle owner: permit world-specific catch-up rules without assuming total offscreen simulation.

## A10: Onboarding and reveal

Status: **covered**, static scope.

SHOWN: TutorialManager uses TutorialStep instances and context hooks, rather than only a long static help page. Its nested game system saves current step class and substep, recreates the step through ModManager and resumes via StartTutorial after load. Hooks can gate tooltips/inventory and adjust examination rolls. The type inventory has 12 non-nested JoppaTutorial classes. EmbarkModules declares 15 modules, five mode tags, nine pregens and six location tags; Manual has 12 topics.

This supports context-sensitive guidance and some assisted rules, but does not prove every visible control is locked or every lesson survives a native reload. UNREAD: the full lesson sequence and every reveal trigger. Do not infer a universal progression-unlock tree from the tutorial.

Sources: `TutorialManager.cs`, `Base/EmbarkModules.xml`, `Base/Manual.xml`.

PROPOSALS: Onboarding/knowledge owner: resume a lesson from stable IDs/substeps and handle missing content safely. UI owner: reveal context and optional help while keeping useful desktop panels discoverable.

## A11: Little touches

Status: **covered**, static scope.

SHOWN in source: visited-choice coloring, explicit end tags, quest-action tags, reputation gate labels, teacher/skill disambiguation, selection scrolling, number/letter choice shortcuts, context-aware tutorial highlights, chat-node sound hooks and trade weight/totals. Colors.xml declares 27 solid colors and 152 shaders. Options and commands expose many input/presentation choices.

These are source affordances; actual sound, animation, contrast, screen-reader support and key comfort were not tested. SMALL_TOUCHES.md preserves 24 distinct original proposals, with source anchors and owners, rather than copying Qud's prose or visual assets.

Sources: `XRL.World.Conversations.Choice.cs`, `XRL.UI.ConversationUI.cs`, `TutorialManager.cs`, `Qud.UI.TradeScreen.cs`, `Base/Commands.xml`, `Base/Colors.xml`.

PROPOSALS: UI_RULES.md owner: use concise receipts, good focus restoration and readable reasons. Accessibility/settings owner: test feedback with sound disabled and at laptop zoom before acceptance.

## A12: Other systems

Status: **partial**, static scope.

SHOWN: cooking recipes have ingredient/result objects; the procedural effect result explicitly serializes its Effect and deep-copies/initializes an effect for each eater before applying it. Tinkering, body/equipment, cybernetics, liquids/fuel, secrets, identification, achievements, generated settlements/history and character modes are separate systems. Prior/newer dossiers cover selected chains, indexed in SYSTEM_INVENTORY.

SifrahGame is present as a token/slot, turn-limited framework with graded outcomes, displayed chances, per-token use and feedback hooks. Its static Installed flag and mere type presence do not prove a particular mode is enabled in this base build. TradeScreen delegates actual prices and exchange to TradeUI; a complete economy settlement trace is unread. The installed DLC manifest states 13 pets; 12 companion directories with conversation XML were found, so that statement is not an observed runtime pet count. DLC files live in sibling CoQ_Data rather than the app's Base tree. Entitlement, load routing and companion behavior remain unverified. No new install is needed for static base-game research.

Sources: `XRL.World.Skills.Cooking.CookingRecipe.cs`, `XRL.World.Skills.Cooking.CookingRecipeResultProceduralEffect.cs`, `XRL.World.Tinkering.ItemModding.cs`, `XRL.SifrahGame.cs`, `Qud.UI.TradeScreen.cs`, `DLC/PetsPack1/manifest.json`.

PROPOSALS: Crafting/material owner: distinguish recipe knowledge, reference, ingredients and instantiated effect identity. Social/world owner: offer companions and graded outcomes only where the world and existing systems support them.
