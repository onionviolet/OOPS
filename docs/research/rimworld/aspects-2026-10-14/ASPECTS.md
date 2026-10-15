# RimWorld aspect backfill, installed 1.7 branch

## Corrections and extensions to prior dossiers

| Code | Prior statement | Current evidence and disposition |
| --- | --- | --- |
| F1 | Root INTAKE.json says no game installed | Historical result from 2026-10-06. Steam appmanifest_294100.acf now says StateFlags 4, build 25947168; payload exists. No install needed. |
| F2 | Prior payload 1.6.4871 rev573, filename rev588 | Current Version.txt is 1.7.4979 rev109 on unstable. Current DLL hash differs. Prior intake has no Steam build ID, so a numeric build-ID change cannot be established; version/payload change can. |
| F3 | Unity gameplay/Mono route in old dossier | Version-bound. This install has .NET 10 Waylith host, Unity compatibility stubs and Brutal dependencies. Retained UnityEngine APIs do not mean the old engine host is unchanged. |
| F4 | Root review was Core-only | Still accurate for that pass. Feature-pass later unpacked all six 1.6 modules. This lane independently reads all six installed 1.7 data modules; presence is not activation. |
| F5 | Feature aspect pass leaves dialogue, quest closure and save framework gaps | Current source now traces generated exchanges plus explicit faction dialogs, quest signal/closure lifecycle, autosave, loader stages and compatibility dispatch. Individual migrations and all quest scripts remain unread. |
| F6 | Feature raw census: 13,809 definitions, 252 tags, 8,210 English rows | Installed data census is 14,084 raw nodes, 254 tags, 8,223 English direct-child rows. Counts use raw XML records, not resolved runtime content; this is a new snapshot, not proof each difference is gameplay. |

Prior root REPORT.md/CHECKPOINT.md and INTAKE.json/COVERAGE.json were read. Root TOOLING.md is absent; feature-pass-2026-10-14/TOOLING.md and intake commands supply the prior route. Prior files are unchanged.

## Evidence boundary

Shown means direct installed-file or recovered-source evidence. Stated means prior dossier or dispatch wording, explicitly identified. YAIRPG takeaways are inferred PROPOSALS, not accepted decisions or implementation. No game was launched, no saves/profile read, no executable from the game run. Covered means the named source route was traced, not every method in the aspect. A06/A12 remain partial and all unperformed gates are in CHECKPOINT.md.

Source shorthand: `source/<type>.cs` is under `~/.codex/research/bf-rimworld/extract/`; `Data/` and runtimeconfig paths use that same extract root. [Evidence map](EVIDENCE.md) names methods and line ranges. Full text, XML and decoded notes stay private in the work area. [Tooling](TOOLING.md) owns reproduction and hashes.


## A01: Dialogue and conversation [covered]

Shown: two routes coexist. Autonomous pawn exchanges select InteractionDef workers by eligibility and weight, apply attributed thoughts and skill XP, check for a social fight, call worker aftermath when no fight replaces it, then emit bubbles, logs and optional letters. `CanInteractNowWith` checks cooldown, position, spawning and initiation/reception rules. `ignoreTimeSinceLastInteraction` does not bypass the earlier unconditional cooldown call in this reviewed path. Worker selection can read directed opinion through NegativeInteractionUtility; this is state-dependent small talk, not a universal hand-authored conversation tree.

Shown: PlayLogEntry_Interaction stores the interaction def, participant references, optional sentence packs and faction/ideology attribution. Rendering selects initiator/recipient grammar, injects participant constants and temporarily seeds Rand from logID. Text generation is separate from the earlier state mutation. Rule selection validates constants, tags, usage and priority, with bounded recursion and translated-text fallback. Re-render stability depends on the retained grammar/content and participant state; a seed alone does not freeze every word forever.

Shown: DiaNode/DiaOption also provide explicit choices, disabled reasons, links, late-bound links and action callbacks. FactionDialogMaker chooses greetings by relations and adds options by faction capabilities, skill, title, temperature and cooldown. The trader request callback queues a real arrival, records the request tick and spends goodwill before showing its result node. Dialog_Negotiation labels the negotiator and call target with social skill and relation status. Interaction symbols can come from a faction or ideology. A general portrait registry was not traced.

Sources: `source/RimWorld.Pawn_InteractionsTracker.cs`, `source/RimWorld.InteractionDef.cs`, `source/Verse.PlayLogEntry_Interaction.cs`, `source/Verse.Grammar.GrammarResolver.cs`, `source/Verse.DiaOption.cs`, `source/RimWorld.FactionDialogMaker.cs`, `source/RimWorld.Dialog_Negotiation.cs`.

PROPOSALS: CHARACTERS_AND_WORLD_EVENTS.md: separate durable social occurrence and participant attribution from generated wording. ENGINE_EXPANSION.md and dialogue owner: reuse host action predicates for choices; a late-bound return node should reflect changed relations.

## A02: Narrative delivery [covered]

Shown: quests are persistent objects with generated name/description, root script def, parts, acceptance/expiry ticks, outcome, visibility and cleanup state. Quest-scoped signal tags and part listen modes route accepted, pending and historical behavior. Delay parts compare enable tick plus duration to game ticks, expose countdowns and can wait for a home map. Activable parts disable themselves before emitting completion signals and may explicitly allow reactivation.

Shown: Quest.End rejects historical resolution, records outcome, cleans parts, and sends outcome-specific letters/sounds unless hidden or suppressed. Cleanup is guarded, runs pre-cleanup and cleanup hooks, and can hide the entry. Historical quest parts are eventually cleared after the source's retention interval. Persistent quest history therefore differs from indefinitely retaining every executable part. SignalManager has a per-frame signal ceiling and catches receiver exceptions. Exact script-to-part generation for every quest is unread.

Sources: `source/RimWorld.Quest.cs`, `source/RimWorld.QuestManager.cs`, `source/RimWorld.QuestPartActivable.cs`, `source/RimWorld.QuestPart_Delay.cs`, `source/RimWorld.QuestPart_QuestEnd.cs`, `source/RimWorld.SignalManager.cs`, `source/Verse.PlayLog.cs`.

PROPOSALS: CHARACTERS_AND_WORLD_EVENTS.md: retain outcome and causal journal even when active handlers retire. ENGINE_EXPANSION.md: scope signals to a durable occurrence and make recurrence an authored choice.

## A03: Implementation architecture [covered]

Shown: current Steam payload has Assembly-CSharp.dll plus RimWorld.dll, UnityStubs.dll, Waylith libraries and Brutal dependencies. RimWorld.runtimeconfig.json targets net10.0 with included Microsoft.NETCore.App 10.0.10-waylithclr.dev and Unity assembly-name redirects. Program calls EngineApplication.Run with Bootstrap.Initialize. Bootstrap builds a UnityRuntime compatibility layer and steps it on engine update. Gameplay retains UnityEngine-named calls; those names do not establish that this installed build is the old Unity player/Mono distribution.

Shown: Verse owns root/UI lifecycle, ticks, definitions, serialization and shared entities. RimWorld owns domain workers, quest parts, social interactions, trade and story scheduling. Verse.AI composes think nodes, jobs and toils. Game.UpdatePlay calls TickManagerUpdate and update services; DoSingleTick advances world, things, quests, storyteller, history and autosaver. Def/worker and component composition coexist with code-driven callbacks. TickList buckets normal/rare/long updates, and UI rendering/log generation are separate from job mutation. No recovered project was compiled or benchmarked.

Sources: `source/RimWorldWaylith.Program.cs`, `source/RimWorldWaylith.Bootstrap.cs`, `source/Verse.Root.cs`, `source/Verse.Root_Play.cs`, `source/Verse.Game.cs`, `source/Verse.TickManager.cs`, `source/Verse.TickList.cs`, `source/Verse.LoadedModManager.cs`.

PROPOSALS: ENGINE_EXPANSION.md: preserve domain-specific workers and shared stable IDs; avoid replacing the engine merely to imitate a donor. Engine clock owner: spread infrequent consumers over stable buckets without changing causal order.

## A04: Save and persistence [covered]

Shown: ScribeSaver writes indented XML with a savegame root, metadata and deeply serialized game object. Values, definitions, nested owned objects and references have distinct helpers. Metadata records game version and running mod IDs/names/Steam IDs. ScribeLoader reads variables, resolves cross-references, then runs post-load init. Game.LoadGame clears caches, invokes pre-load compatibility hooks, reads world/maps, finalizes references and maps, initializes game components and invokes post-load hooks. Quest parts save state/deadlines; alert and grammar caches are derived.

Shown: overwrite saves write .new, move current to .old, promote .new, then remove .old unless retained for permadeath. Promotion failure attempts rollback; a first save writes directly. SafeMove retries moves; this is source-level failure handling, not demonstrated filesystem atomicity or power-loss recovery. ScribeSaver refuses finalization after internal serialization exceptions. Loader ForceStop clears serializer state; malformed files and missing references can log, recover selected fields or abort at different layers. PreLoadUtility catches header-read failure but can still reach loadAct. There is no blanket proof of strict corrupt-save rejection.

Shown: BackCompatibility accepts earlier 1.x minor versions at the policy level and dispatches applicable converters for pre/post-load, def-name and object hooks. Metadata mismatches can show mod/version dialogs and allow user-directed loading. Individual converter bodies remain unread, so no claim that every old save migrates correctly. Autosaver advances on simulation ticks, respects temporary save blocks, rotates unused then oldest configured autosave slots, and uses a unique permadeath file. No closed-game wall-clock catch-up was found in the reviewed load/tick paths; full absence across every system is unproved.

Sources: `source/Verse.GameDataSaveLoader.cs`, `source/Verse.SafeSaver.cs`, `source/Verse.ScribeSaver.cs`, `source/Verse.ScribeLoader.cs`, `source/Verse.ScribeMetaHeaderUtility.cs`, `source/Verse.PreLoadUtility.cs`, `source/Verse.BackCompatibility.cs`, `source/Verse.Game.cs`, `source/RimWorld.Autosaver.cs`, `source/RimWorld.Quest.cs`.

PROPOSALS: ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md: stage parsing, reference repair and derived-cache rebuild before publishing loaded state. ENGINE_EXPANSION.md: version content identity and define each migration; test interrupted writes and mid-deadline reload separately.

## A05: AI and NPC behavior [covered]

Shown: ThinkNode_Priority asks children in order and returns the first valid job, logging child failures. Work selection filters actor restrictions and ShouldSkip, then searches reachable/legal targets within priority bands. Scanner priority and distance help choose a target before constructing an actual job. Job drivers track toils and failure state; they are not a free-form language planner. Social behavior has its own admission and weighted worker selection. Faction state and managers exist, but the presence of faction classes does not prove a full offscreen economic simulation.

Inferred: sharing eligibility readers between manual and autonomous routes improves truthful feedback. Detailed pathfinding costs, every think tree, group lord AI, raid strategy and complete autonomous faction lives remain unread.

Sources: `source/Verse.AI.ThinkNode_Priority.cs`, `source/RimWorld.JobGiver_Work.cs`, `source/Verse.AI.Pawn_JobTracker.cs`, `source/Verse.AI.JobDriver.cs`, `source/RimWorld.Pawn_InteractionsTracker.cs`, `source/RimWorld.FactionManager.cs`.

PROPOSALS: CHARACTERS_AND_WORLD_EVENTS.md: let NPCs request actual jobs against the same actor/resource predicates. ENGINE_EXPANSION.md: keep target selection, reservation and execution distinct.

## A06: UI and information design [partial]

Shown in source: ordered data-driven main buttons share screen width, respect visibility/disabled workers and invoke hotkeys. Inspect tabs, bill dialogs, negotiation and window stack provide parallel information layers. Negotiation uses two speaker columns above node text; bill controls expose current/target stock, filters and ingredient radius. DiaOption renders a disabled reason in text. Time controls highlight speed, label shortcuts and show forced pause. These are intended layout/interaction paths, not observed native appearance.

Unread: actual desktop readability, window overlap, keyboard focus, screen-reader behavior, color/contrast and resolutions. Native launch is prohibited. For any YAIRPG adoption the target is a rebuilt 1366x768 laptop view with useful work/context/action panels visible; mobile remains deferred.

Sources: `source/RimWorld.MainButtonsRoot.cs`, `source/RimWorld.MainTabWindow_Inspect.cs`, `source/RimWorld.Dialog_BillConfig.cs`, `source/RimWorld.Dialog_Negotiation.cs`, `source/RimWorld.TimeControls.cs`, `source/Verse.WindowStack.cs`, `source/Verse.DiaOption.cs`.

PROPOSALS: THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md: keep routine actions and their reasons visible together at laptop size.

## A07: Content authoring and modding [covered]

Shown: Data contains Core plus Royalty, Biotech, Ideology, Anomaly and Odyssey. Content uses XML Def records, inheritance, patch operations, worker class names and stable defName references. LoadedModManager initializes active packs in configured load order, loads content/classes/XML, combines XML, applies patches and parses/processes records. It clears inheritance and patch caches around load stages. Definition ConfigErrors/ResolveReferences methods provide validation; RulePackDef includes other packs and checks direct include cycles. A declaration is not proof of a valid live consumer.

Shown: 14,084 raw Def children across 254 tag families and 1,676 XML files in copied Data; 8,223 English direct-child text records. These include abstract records and unresolved inheritance, not effective content totals. Installed modules are present on disk; user mod configuration and actual active DLC were not read. DLL mod entry classes exist in the loader. No external mod installed, code executed or effective loader run.

Sources: `source/Verse.LoadedModManager.cs`, `source/Verse.Def.cs`, `source/Verse.RulePackDef.cs`, `source/RimWorld.InteractionDef.cs`.

PROPOSALS: ENGINE_EXPANSION.md: validate stable references and worker requirements before accepting authored content. World content owners: retain raw authoring provenance separately from resolved gameplay records.

## A08: Balance and numbers [covered]

Shown: Rand exposes seed plus iteration-based random values, push/pop isolation, seeded helpers, Gaussian draws and mean-time-between-event helpers. Quality creation maps skill to a distribution center, samples an asymmetric Gaussian, clamps ordinary results, rerolls some top ordinary results, and applies inspiration adjustments. Reward/trader/base-generation distributions differ. This is route-specific variation; no universal pity system was established. Grammar lowers repeated-rule weight within resolution, which is text variation rather than loot protection.

Shown: stat workers gather actor/item requests and part-based adjustments; storyteller components use weighted eligible incidents. Numeric data mixes floats, integers, curves and ranges; no arbitrary-precision progression system was traced. Full combat, wealth scaling, economy calibration, global random-state persistence and balance simulation remain unread.

Sources: `source/Verse.Rand.cs`, `source/RimWorld.QualityUtility.cs`, `source/RimWorld.StatWorker.cs`, `source/RimWorld.StorytellerComp_RandomMain.cs`, `source/Verse.Grammar.GrammarResolver.cs`.

PROPOSALS: Crafting/skill owners under ENGINE_EXPANSION.md: expose actor-relevant quality chances by production route. CHARACTERS_AND_WORLD_EVENTS.md: isolate cosmetic randomness from consequential rolls.

## A09: Time and scheduling [covered]

Shown: simulation ticks are distinct from render updates and absolute/calendar time. TickManager accumulates frame delta, runs bounded work per frame, and discards excess positive backlog after the frame budget. TickList spreads updates over 1/250/2000-tick buckets; hash-interval social checks distribute other work. This is not an exact arbitrary-duration offline integrator.

Shown: IncidentQueue saves queued incidents and sorts by fire tick, but traverses the list backwards when executing. Initial failure is removed immediately when retry duration is zero; otherwise seeded retry slots recur until the retry window expires. Map removal drops targeted incidents. A sorted list alone therefore does not guarantee earliest-first ordering among simultaneous overdue entries. Quest delays persist enable time and duration; autosave uses simulation time; GenDate supplies local dates. Aging and every world travel clock remain unread.

Sources: `source/Verse.TickManager.cs`, `source/Verse.TickList.cs`, `source/RimWorld.IncidentQueue.cs`, `source/RimWorld.QueuedIncident.cs`, `source/RimWorld.QuestPart_Delay.cs`, `source/RimWorld.GenDate.cs`, `source/RimWorld.Autosaver.cs`.

PROPOSALS: ENGINE_EXPANSION.md: give queued occurrences explicit target, deadline, retry and expiry policies. Clock owner: preserve passive eligible progress and separately choose offline integration; do not copy dropped-time behavior into an idle RPG.

## A10: Onboarding and reveal [covered]

Shown: tutorial-mode InstructionDefs react to event tags and can reject actions with a reason through the active lesson. Adaptive training is separate, enabled by preference/storyteller policy, and considers incomplete ConceptDefs, graded opportunities, knowledge demonstration, grace periods and desire/knowledge decay. Time-control clicks report demonstrated knowledge. Data has 86 raw ConceptDef and 37 InstructionDef nodes. The entire tutorial sequence and every hidden UI unlock were not followed.

Inferred: contextual help can be offered when the next action becomes useful rather than gated behind a long mandatory tour. Remember demonstrated knowledge independently of whether a panel was merely opened.

Sources: `source/RimWorld.TutorSystem.cs`, `source/RimWorld.LessonAutoActivator.cs`, `source/RimWorld.TimeControls.cs`.

PROPOSALS: THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md: teach at the point of need and preserve readable blocked reasons.

## A11: Little touches [covered]

Shown in reviewed code: participant-perspective logs link back to the other pawn; social icons preserve faction/ideology context; choices show disabled reasons; negotiation keeps skill and relations beside the speaker; deadlines expose both relative and absolute-date tooltips; time controls acknowledge demonstrated knowledge; generated text has a language fallback. Bill controls carry filters and counts near the work request. More source-grounded details and original transfers are listed in SMALL_TOUCHES.md.

Unread: tactile/audio/visual quality in the running game, accessibility outcomes and controller behavior. Source calls to sounds, highlighting and bubbles are evidence of intent only.

Sources: `source/Verse.PlayLogEntry_Interaction.cs`, `source/Verse.DiaOption.cs`, `source/RimWorld.Dialog_Negotiation.cs`, `source/RimWorld.TimeControls.cs`, `source/RimWorld.QuestPart_Delay.cs`, `source/RimWorld.Dialog_BillConfig.cs`, `source/RimWorld.LessonAutoActivator.cs`.

PROPOSALS: THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md: pair small feedback with a useful state explanation.

## A12: Other systems [partial]

Shown: trade separates preview quantities from ResolveTrade, rejects insufficient colony funds, has a distinct gifting/goodwill path, and records some ideology-sensitive acts before item resolution. This source order is not an atomic transaction guarantee. Research/history/faction code and the complete raw definition census expose many additional domains: body/health, genetics, children, books, rituals, ideology, titles/permits/abilities, containment, caravans, space/gravships, world generation, weather, combat and production.

Unread: most DLC-specific consumers, full economic sinks, every collection/achievement surface, world generation and complete combat/medical simulation. No claim of universal account prestige or a missing achievement system is made. SYSTEM_INVENTORY separates indexed families from semantically reviewed routes; DEEPER_SYSTEMS expands the three highest-payoff gaps from the prior scoped aspect pass.

Sources: `source/RimWorld.TradeDeal.cs`, `source/RimWorld.TradeUtility.cs`, `source/RimWorld.ResearchManager.cs`, `source/RimWorld.HistoryAutoRecorder.cs`, `source/RimWorld.FactionManager.cs`.

PROPOSALS: CHARACTERS_AND_WORLD_EVENTS.md: keep goodwill, goods and authored obligations as distinct state. World/body/crafting owners: select a useful consumer before expanding a data taxonomy.
