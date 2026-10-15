# Taiwu aspect pass, 2026-10-14

Static installed-code/data research. **Status: PARTIAL.** All twelve aspect rows have evidence or an explicit gap. A03/A05/A09 are covered at mechanism level, not complete whole-build semantics or runtime acceptance. Other rows remain partial. No game, game DLL, save, database, mod or account operation was executed.

`new:` means `/Users/weiwei/.codex/research/taiwu-2-aspects/extract/`; `deep:` means the reused read-only `/Users/weiwei/.codex/research/taiwu-2/extract/`; `prior:` means read-only `/Users/weiwei/.codex/research/taiwu/extract/`. Source paths are private local evidence; committed text is paraphrase. The [reference and tooling map](TOOLING.md) names full private dialogue/flow artifacts. No repo-private directory was written because this lane permits writes only in this aspects folder.

Shown means directly read static bodies/data; stated means an explicitly named prior dossier claim; inferred means an interpretation. All YAIRPG takeaways are **PROPOSALS**, not accepted decisions or implementation. First milestone stays one realm/one prestige, reasonable repeat/alternate routes remain reachable, no imported fixed once-only caps. Any future UI proof targets1440×900 desktop/laptop; mobile stays deferred.

## A01: Dialogue and conversation

Status: partial. Sources: `new:EventModel.cs:Select`, `new:EventModel.cs:HandleContentTag`, `deep:Package.CharacterInteraction_Main.cs`, `deep:Scripts.CharacterInteraction_Main.json`, `new:dialogue_linked_selected.json`.

Shown: conversations have stable event GUIDs, per-option keys and GUIDs, generated speaker-role selectors, event/option flags and separate visibility/availability conditions. Five previously extracted generated packages and .twes records are reused. The main teaching entry composes institutional exploration, calendar days, alertness, punishment/jurisdiction, prior lessons and school-specific routes. Personal favor is directed and is not a universal permission switch. EventScriptRuntime attaches type1 event action,2 event condition,3 option action,4 available and5 visible records; generated C# contains additional handlers/conditions.

New preservation:858 shipped CN/EN event-language files,34,812,600 bytes, are retained privately. Their82,367 EventGuid occurrences count language-file records, not unique stories. A selected join has1,108 language-event records for554 unique event IDs across the five packages; all match generated classes, and314 records have decoded script entries. Raw text, authoring event names, role selectors, option GUIDs and scripts are joined without placing dialogue in the public repo. Full text preservation is not full semantic review.

EventModel.Select sends EventSelect(eventGuid,optionKey), can ask confirmation for an authored Important option and records selected interaction counts. Display handling resolves language/number tags and actor names and supplies avatar-related data; shy flags feed a blush-character list. This is template/actor substitution, not evidence of generative-language-model dialogue. Package helpers return behavior-specific NPC words. Full bark selection, every portrait route, all conversation graphs and the final visible layout remain partial.

PROPOSAL AP1: Preserve line/option IDs, actual predicates and state effects together in private reference, with public paraphrase. Owner: CHARACTERS_AND_WORLD_EVENTS.md and engine event/knowledge contracts.

PROPOSAL: Explain a failed lesson through its actual social, institutional, knowledge or calendar predicate. Owner: LIFE_SIM_NORTH_STAR.md and UI owner.

## A02: Narrative delivery

Status: partial. Sources: `deep:AdventureDomain.cs:SelectMajorEvent`, `new:GameData.Domains.LifeRecord.LifeRecordDomain.cs:QueryByDate`, `deep:TaiwuEventDomain.cs`, `prior:WorldDomain.cs:AdvanceMonth_DisplayedMonthlyNotifications`.

Shown: narrative has spatial adventures and major-event node graphs with current, unlocked and visited state. Events can pause on player input and resume via named listeners. Completion, exit, removal and expiry are different operations. The same world produces monthly/instant notifications and structured life records rather than only a quest string.

LifeRecordDomain queries records by actor/index/date, assembles raw typed records, and uses DatabaseBridge with LifeRecordTmp/LifeRecordDeadTmp tables. These are part of the embedded working database in a local archive. Prior Taiwu life summaries preserve predecessor history at succession. This is a useful distinction between an event's mutable state, a participant's knowledge and retrospective evidence.

Unread: complete letter/journal catalogue, record text rendering, all story closure routes and which history remains visible after every death or migration. No broad claim that every narrative channel is populated follows from a class name.

PROPOSAL: Record the cause and participant IDs of a world change so later logs and dialogue can refer to the same occurrence. Owner: CHARACTERS_AND_WORLD_EVENTS.md, ENGINE_EXPANSION.md.

## A03: Implementation architecture

Status: covered. Sources: `new:GameData.GameDataBridge.GameDataBridge.cs:Initialize`, `deep:GameData.ActionPlanning.dll.cs`, `deep:AdventureDataCompiler.cs`, `prior:WorldDomain.cs:AdvanceMonth_Execute`, `prior:Character.cs:GetMaxNeili`.

Shown static architecture: Unity frontend Assembly-CSharp talks to a separate managed backend through GameDataBridge. Initialize creates a named Master pipe, starts the backend process through a separate helper and prepares read/write threads. AddMethodCall serializes typed arguments into operation buffers using domain/method IDs; display events and subscriptions carry results back. None of these initialization routines was executed by this pass.

Backend modules separate domain orchestration, Shared types/compiled config, Serializer, ArchiveData, ActionPlanning, concrete action implementations, Adventure, secret information and several combat libraries. Shared config has306 detected table/item pairs in the available metadata, with localized text and mutable domain instances separate. Adventure editor JSON compiles to host-bound instruction bytes in protobuf definitions; event packages also contain generated managed classes. CompDevLib supplies expression AST/evaluation, not a proof that all scripts are Lua. ModDomain separately references Lua settings.

World advancement explicitly sequences monthly phases. Parallel modification records separate calculated actor work from applied changes; pools reuse temporary collections; getters cache derived properties with dependency invalidation; the frontend batches operation/data traffic. These are shown implementation techniques, not measured performance. The bridge's sleep constants, the existence of AStar and a large NPC table do not establish frame rate, planner choice or CPU cost. The actual inspected NPC agent uses weighted regressive planning.

Covered means the architecture question has an evidenced answer. Complete protocol schema, engine startup/error recovery, every signal/listener and source-generator internals remain unread.

PROPOSAL AP2: Keep authored definitions, mutable actor state, derived caches and presentation messages distinct, using existing YAIR engine owners. Owner: ENGINE_EXPANSION.md.

PROPOSAL: Give each event command an observable result and retained causal record before exposing it as an autonomous NPC action. Owner: actor scheduling and event contracts.

## A04: Save and persistence

Status: partial. Sources: `new:GameData.ArchiveData.LocalArchiveFile.cs:ReadContent`, `new:GameData.ArchiveData.GlobalArchiveFile.cs`, `new:GameData.ArchiveData.ArchiveFileBase.cs:Save`, `new:GameData.Domains.Global.GlobalDomain.cs:SaveWorld`, `new:GameData.Common.DataUpgradeManager.cs:Upgrade`, `new:GameData.ArchiveData.DatabaseBridge.cs`.

Shown without reading any save: local archives use T1L magic bytes, an archive-format byte and incompatibility mark4. Global archives use T1G and mark2. The header contains compression and game/build version metadata; local metadata also retains creation version/build and WorldInfo. Header CRC32 and content CRC32 are checked separately. CompressionStreamFactory supports raw or Deflate, with speed/size options. This is a custom binary container, not a plain JSON save or a standalone SQLite database.

Local content enumerates archive-attached domains, writes domain metadata and OnSaveWorld fields, then disconnects SQLite and embeds working.db bytes before reconnecting. Load resets domain state, restores recorded domain data, initializes new/missing fields/domains, replaces the working database, checks content CRC and runs upgrades. Derived caches and owner registrations can be rebuilt through loaded-data hooks; persisted field IDs and custom serializers are separate from display values. An exhaustive saved-versus-derived field map remains unread.

GlobalDomain.SaveWorld schedules work next frame after version updates, sanity and BeforeSaveWorld hooks. It checks drive space, moves an existing archive to .old, writes a new archive, copies .old back on a caught write failure, then creates/prunes backups according to configured month interval/count. This is a recovery strategy, not a proven atomic transaction. ArchiveFileBase itself opens the target OpenOrCreate. The inspected write-failure branch returns before the success-path SavingWorld reset; runtime recovery is unverified. CRC rejection does not imply no mutation: local loading restores domains/working.db before the final content CRC check.

DataUpgradeManager discovers attributed handlers and executes upgrades newer than stored game version, or newer build date when version is zero. Incompatible headers throw; TryGetArchiveInfo logs and returns false; LoadWorld catches load failure, removes pending post-modification handlers and sends BackToMainMenu. Month-notification completion optionally calls SaveWorld when its saveWorld parameter is true. Backup-selection UI is present. Other autosave triggers, power-loss safety and recovery usability remain unread/unrun.

No wall-clock offline-catch-up algorithm was established. Timestamps and an explicit monthly simulation are not proof of elapsed-real-time rewards. No user archive, database, account state or save folder was opened.

PROPOSAL AP3: Define format rejection, migration, data validation and backup recovery as separate proof gates. Owner: ENGINE_EXPANSION.md persistence and SELVES_AND_ECHOES.md.

PROPOSAL: Restore into a candidate state and validate before replacing active state; preserve a known-good copy. This is an original YAIR proposal, not a claim Taiwu already stages every load.

## A05: AI and NPC behavior

Status: covered. Sources: `deep:GameData.ActionPlanning.MonthlyAI.CharacterGoalData.cs:GetPriority`, `deep:GameData.ActionPlanning.MonthlyAI.CharacterPlanningAgent.cs`, `prior:Character.cs:PeriAdvanceMonth_RelationsUpdate`, `prior:CharacterDomain.cs:ProcessDistantMarriage`, `prior:OrganizationDomain.cs:UpdateFactions`.

Shown: ranked goals select primary/secondary work, and a weighted condition/effect search finds means.276 goal and389 action rows were enumerated previously. Need creation, plans, action points, cooldowns, interruptions and outcomes have distinct state. Concrete actions can ask a knowledgeable actor for a specific unread page and separate agreement from learner success. Protection/revenge creators consider relationships, travel and role constraints.

Social routines separately create/end ties; marriage has executable success/refusal and restricted distant-marriage routes; institution phases change factions and process crime. These are source mechanisms, not an omniscient unified AI. The player has special dialogue and rules, so “NPCs use every player rule identically” is not established. See the prior NPC_AUTONOMY_DIGEST for exact boundaries. Full goal/action coverage and runtime cost remain partial.

PROPOSAL: Start with one named NPC need, several reachable means and a persistent outcome, then expose its reason. Owner: CHARACTERS_AND_WORLD_EVENTS.md, ENGINE_EXPANSION.md.

## A06: UI and information design

Status: partial. Sources: `new:EventModel.cs`, `new:Game.Views.RecordSelect.ViewRevertArchive.cs`, `deep:Game.Views.LegacyPassing.ViewLegacy.cs`, `deep:frontend.types.txt`.

Shown in frontend code: event display binds actors, names, conditions, item/skill/info selectors, costs, confirmation and feedback through one model. Costs format held/needed amounts; content tags resolve localized numbers and names. Legacy selection provides a cost/choice confirmation and submits a sequence of backend calls. Archive-revert, shop, profession, world-map, character, reading and history views exist in metadata.

Unread: actual rebuilt Taiwu desktop geometry, simultaneous panel occupancy, scrolling, contrast, keyboard navigation, accessibility and text scaling. No game was launched; class count cannot prove a useful desktop layout. Do not treat old UI_ classes and newer Game.Views classes as equally live without a route trace.

PROPOSAL: At1440×900 retain independent routine actions, useful state and reasons for disabled choices. Owner: THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md. Rebuilt YAIR browser proof required; mobile deferred.

## A07: Content authoring and modding

Status: partial. Sources: `deep:AdventureDataCompiler.cs:Compile`, `deep:Config.EventFunction.cs`, `new:GameData.Domains.Mod.ModDomain.cs:LoadAllMods`, `prior:ConfigData.cs`.

Shown: compiled typed constructors and reference-name maps define tables; localization is separate. Adventure authoring uses editor JSON and a versioned event compiler; data references function IDs, argument expressions, conditions and role bindings. New preservation keeps full event text private with these IDs.

ModDomain loads the supplied ModInfoList in order, loads backend plugins and config additions, tracks LoadedMods, then exposes event-package loading and plugin callbacks including OnLoadedArchiveData. Unload iterates loaded mods backward. Its load-failure branch removes ModSettings.Lua when present and throws. This is inspected source behavior only; no mod/settings files were touched. MoonSharp's presence and a Lua settings filename do not establish the adventure script language. Exact dependencies, overwrite conflicts, plugin trust boundaries, all table validation and complete authoring workflow remain unread.

PROPOSAL: Validate IDs, cross-table links, predicates and effect arguments before playable content loads; keep rule errors visible to authors. Owner: ENGINE_EXPANSION.md and world authoring contracts.

## A08: Balance and numbers

Status: partial. Sources: `deep:GlobalConfig.cs`, `deep:NeiliProportionHelper.cs`, `prior:CombatSkillDomain.cs:CalcNeigongLoopingEffect`, `new:GameData.Domains.Merchant.MerchantDomain.cs:ChangeMerchantCumulativeMoney`, `deep:GameData.ActionPlanning.dll.cs:WeightBasedPathfinder`.

Shown: formulas, integer percentage arithmetic, clamps and explicit random draws appear across study, force, careers and markets. Reading defaults are one day/three intelligence, with work settling in ten-progress batches and150/100/50 efficiency tiers. Force separates element compatibility, per-art capacity, current reserve and allocation. Dealer goodwill uses cumulative transaction progress and a conversion curve rather than direct raw friendship points. Trade totals use long while several stored balances use int; no arbitrary-precision number system is established.

The weighted pathfinder owns its own random source; many domain methods use DataContext.Random. One observed RNG does not prove shared deterministic seeding or split-time equivalence. Pity/bad-luck protection is unread, because no complete relevant consumer was traced. Configured caps and unique flags are source facts, not recommended YAIR restrictions.

PROPOSAL: Show the variables that change a choice, with stable units and separate reserve/capacity/progress ledgers. Owner: SKILLS_AND_TALENTS.md, engine numerical policies.

## A09: Time and scheduling

Status: covered. Sources: `prior:WorldDomain.cs:AdvanceMonth_Execute`, `prior:WorldDomain.cs:AdvanceMonth_DisplayedMonthlyNotifications`, `prior:Character.cs:OfflineIncreaseAge`, `deep:AdventureDomain.cs:AutoGenerateByConfig`, `new:GameData.Domains.Taiwu.Profession.ProfessionData.cs:IsSkillCooldown`.

Shown: explicit day/month advancement orders actor status, study, resources, social changes, goals/actions, movement and settlement work. Birth month increments actual/current age under separate policies. Adventures check calendar and cooldown state. Career cooldowns compare world date against stored deadlines; a context override can bypass them. Active study consumes calendar time outside adventure and action points inside.

End-of-month notification acknowledgment is its own phase and can trigger save. The source deliberately waits for a minimum duration in one month-processing presentation path, so wall time of that screen is not a direct measure of simulation work. Offline-named methods mean offscreen/background calculation here; they do not establish real-time catch-up while the application is closed. Full queue fairness and timing benchmarks remain unread.

PROPOSAL: Keep world time, work progress, presentation acknowledgment and real elapsed time separate. Owner: ENGINE_EXPANSION.md scheduler and accepted idle-progression policies.

## A10: Onboarding and reveal

Status: partial. Sources: `new:GameData.Domains.TutorialChapter.TutorialChapterDomain.cs:StartChapter`, `new:GameData.Domains.TutorialChapter.TutorialChapterDomain.cs:SetTutorialFunctionStatus`, `deep:ExtraDomain.cs:ChangeProfessionSeniority`.

Shown: TutorialChapterDomain identifies a special guiding world type, tracks chapter/progress and a function-status bit array. StartChapter resets progress, sets chapter and emits an enter-chapter event. Functions can be enabled individually or as a set. Forced-location data and chapter-specific world adjustments support authored guidance. The inspected AdvanceProgress method is empty, so its name is not evidence that it drives the tutorial.

Career unlock popups and instant notifications are emitted when thresholds newly open skills, with logic to delay presentation during continuous travel/month advancement. HadBeenUnlocked records historical reveal independently of present availability. Complete chapter order, all unlock triggers and whether the resulting introduction feels clear remain unread/unrun.

PROPOSAL: Reveal one working action and its consequence, then retain a way to inspect it later without erasing advanced options. Owner: onboarding/UI and CHARACTERS_AND_WORLD_EVENTS.md.

## A11: Little touches

Status: partial. Sources: `new:EventModel.cs:Select`, `new:EventModel.cs:HandleContentTag`, `new:GameData.Domains.Taiwu.Profession.ProfessionData.cs:OfflineUpdateHadBeenUnlocked`, `prior:Character.cs:OfflineIncreaseAge`.

Shown touches include authored important-choice confirmations, conditional option tips, localized number/name substitution, actor clothing/appearance hooks, shy-character blush flags, birthday potential/appearance updates, career unlock memories and typed life-history records. A damaged copy can remain useful through matching reference pages rather than becoming a binary junk item.

These are code/data mechanisms, not claims that animation, typography or accessibility was visually accepted. Sound/haptics, reduced-motion settings, remappable controls and complete QoL inventory remain unread. The earlier28 SMALL_TOUCHES are original proposals and remain unselected.

PROPOSAL: Let a visible remembered detail refer to an actual prior event, with optional/reduced presentation where applicable. Owner: UI effects, knowledge/history and accessibility settings.

## A12: Other systems

Status: partial. Sources: `new:system_inventory.json`, `prior:GameData.types.txt`, `prior:Shared.types.txt`, `new:GameData.Domains.Merchant.MerchantDomain.cs`, `new:GameData.Domains.Taiwu.Profession.ProfessionData.cs`.

Shown metadata reveals21 domain families and306 config table/item pairs, plus separate combat, planner, adventure, archive and serializer modules. Systems beyond the previous study/succession/village focus include information reception/dissemination, careers, merchant/caravan/book trade, legendary books, effects, item making/repair/poison, treasures, geography, childbirth/genetics, prison/bounty/punishment, cricket/chicken minigames and achievement/recording infrastructure. SYSTEM_INVENTORY gives exact namespace/table identifiers and size signals rather than treating every discovered name as a proven mechanic.

This pass traces the three highest-payoff previously undigested mechanisms: information circulation, trade custody/settlement and career seniority/unlocks. Their remaining rows and runtime paths stay explicit in DEEPER_SYSTEMS. No claim of an exhaustive semantic whole-game audit follows from the metadata census.

PROPOSAL: Use selected source mechanisms to deepen existing YAIR owners, with optional world-specific paths rather than a mandatory whole-world feature checklist. Province War can cite these dossiers through its own register.
