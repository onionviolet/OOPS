# Amazing Cultivation Simulator: aspect backfill

## Corrections and limits to the prior dossier

| Code | Prior statement or gap | Current result |
| --- | --- | --- |
| F1 | Historical private extract links implied local availability | Those old-Mac extracts are unavailable for this lane. New private recovery is under `~/.codex/research/bf-amazing-cultivation-simulator/`. Prior reports remain historical source evidence. |
| F2 | Build or content may have changed | Shown: installed build **17074448** is unchanged and both gameplay DLL hashes exactly match prior INTAKE.json. Steam StateFlags is 4. No install needed. |
| F3 | Prompt named COVERAGE/INTAKE/TOOLING | COVERAGE.json and INTAKE.json exist; their .md equivalents and prior TOOLING.md do not. INTAKE.json supplies the old tool route. New TOOLING.md records the rerun. |
| F4 | Five prior mechanic families could be read as whole-game coverage | Prior finite traces stay complete at their own scope. This pass adds dialogue, save/architecture, spatial and regional systems, with explicit unread boundaries. It does not complete whole-game reading. |
| F5 | Recovered-file counts | Prior 4,581 C# files covered both assemblies. This run exports 3,179 main-assembly C# files plus three targeted firstpass classes. Different extraction scope/tool version is not a demonstrated build regression. |
| F6 | Save atomicity/offline policy left unclaimed | New source shows staged delete/move and a direct-write overload, not proven atomic recovery. Persisted simulation time and timestamps still do not prove offline catch-up. |
| F7 | Readable content assumed from directory names | 64 copied inputs have encrypted wrappers. Static decoder reconstruction recovered all of them privately. A structural scan found 19 RPG graphs/187 nodes and 289 tagged Jianghu data rows after the two header lines. Full writing and closure coverage is not claimed. |

Read [REPORT](REPORT.md), [SYSTEM_INVENTORY](SYSTEM_INVENTORY.md), [DEEPER_SYSTEMS](DEEPER_SYSTEMS.md), [SAVE_AND_ARCHITECTURE](SAVE_AND_ARCHITECTURE.md) and [TOOLING](TOOLING.md). All code findings mean shown in static recovered source, not played. Stated means shipped documentation. Inference and all YAIRPG takeaways are proposals.

Source convention: `managed/`, `input/` and `SevenZipHelper.cs` are relative to the private workspace's `extract/`; prior `../traces/` links refer to the dossier's existing reports. Private source hashes are in `extract/HASHES.txt`. The source-versioned evidence index records selected reading, not whole-file coverage.

## A01: Dialogue and conversation

Status: partial.

Shown in recovered code: RPG conversations are named graphs with Begin, Speech, Option and Function nodes. Links select reachable nodes; VisibleScript filters visibility, EnableScript disables options, and ExecuteScript changes state through Lua. Speech/function alternatives use weights; options sort by weight. Speaker tokens resolve the player or target and select portraits. Per-node audio, actor animation and effects are supported. Function nodes have Enter/Update/Leave hooks, may hide the dialogue and use simulation or presentation updates.

Jianghu conversation is a second system, not just the same graph with other text. Tagged records hold question, success/failure/default responses, rank type and NPC exclusion. Rank and tags filter candidates; the inspected selector then chooses uniformly. Ordinary chat can reveal interests or known information, modify favour and schedule a rumour event. The inspected Track request tests favour and social skill, halves a chance for vigilance, and stores information keys. That establishes information transfer, not universal truth or trust. Lua talk actions expose separate name, description, enable and action calls. The earlier everyday JobTalk/relationship trace remains a third layer.

Shown after static decoding: 19 RPG graphs have 187 nodes: 19 Begin, 103 Speech, 42 Option and 23 Function. Twenty-six nodes have visibility scripts and 22 have execute scripts; no nonempty EnableScript was found in these base RPG graphs. Eight Jianghu talk files have 289 nonempty tagged data rows after their two header lines. A named Missing fallback is present. All local graph link targets resolve in the structural scan. Conditions include world-flag state, cultivation rank and information discovery; selected effect scripts update flags and invoke encounter/control changes. Full writing, cross-script closure and all outcome paths remain unread. Schema capability is not assumed to occur in authored content. No LLM or procedural prose model was found in the selected paths; templates and random alternatives are shown.

Sources: `managed/XiaWorld/DlgDef.cs:9-124`; `managed/XiaWorld/DlgMgr.cs:127-275`; `managed/Wnd_Dlg.cs:89-285`; `managed/Wnd_JianghuTalk.cs:86-132,1089-1220,1673-1792`; `managed/XiaWorld/JianghuMgr.cs:143-188,743-800,1290-1370`; `input/Settings/RPG/Dialogues/`; `input/Settings/Jianghu/Talk/`.

PROPOSALS: Knowledge/social owners: retain who knows a fact, why they share it and what was already told, separately from affection. Dialogue/content owner: separate hidden, disabled and executable choices; record outcomes in domain state rather than prose flags alone.

## A02: Narrative delivery

Status: partial.

Shown: event definitions carry IDs, kinds, descriptions, weights, unlock/world flags, class names and parameters. Scheduled events compare deadlines to simulation time, retry with other candidates of the same kind up to a bounded counter, then remove the handled entry and break. This inspected loop processes one resolved scheduled entry per Step. Conversation's rumour finish schedules a future event. Jianghu Save records known NPCs, clues, unlocked information and new-story state. Prior NpcMgr/NpcInfo traces establish personal prose memories separately from relation changes.

The build also has map-story Lua, NPC-story definitions and epilogue authoring directories. Their inventory does not establish a complete quest journal, letter system or branch closure. Full event admission, writing, biography generation and all failure closures remain unread. Decoded RPG graph scripts additionally demonstrate narrative state changes through world flags and discovery gates; those are structural observations, not a reading of the whole story.

Sources: `managed/XiaWorld/GameEventMgr.cs:15-77,739-775,968-1011`; `managed/XiaWorld/JianghuMgr.cs:743-800`; `input/Scripts/MapStory/MapStory.lua`; `input/Settings/NpcStories/`; `input/Settings/NpcBiography/`.

PROPOSALS: Narrative/history owner: keep a durable event result and actor-qualified recollection; let logs render those records. World event owner: give failed admission a documented reschedule or closure policy.

## A03: Implementation architecture

Status: covered.

Shown: this is a Unity managed C# build with XLua and FairyGUI bindings. FixedUpdate ticks KCoroutine, MainManager.Step and GlobleEvent.Step; Update renders through MainManager. Manager modules separate Init/Step/Render/Save/Load/AfterLoad. Data lives in XML and text definitions; scripts supply Lua actions and content behavior. MainManager loops managers, respects run/pause-update policies and emits FreeStep/Step events. EventMgr sends enum-keyed callbacks and Lua events; it buffers listener changes during dispatch. Its try/catch encloses the callback loop, so an exception can skip later listeners in that invocation.

JobMgr uses definition DriverClass names to instantiate jobs and caches released job objects by definition name. Periodic managers retain a remainder, subtract one interval and call OnStep once per Step. This is not an unbounded catch-up loop. Pooled UI list items and weighted-choice temporary list pools are shown. No benchmark or whole-engine performance claim follows. Unity native internals, all vendor assemblies and most gameplay classes remain outside semantic scope.

Sources: `managed/GameMain.cs:569-588`; `managed/XiaWorld/MainManager.cs:353-400,460-468`; `managed/XiaWorld/EventMgr.cs:9-85`; `managed/IManagerModule_LoopInterval.cs`; `managed/XiaWorld/JobMgr.cs:27-120`; `managed/ModsMgr.cs:1084-1140`.

PROPOSALS: Simulation/scheduler owner: express phase and pause policy explicitly; profile before adding pooling or threads. Content loader owner: validate definition-to-driver links and listener failure boundaries.

## A04: Save and persistence

Status: partial.

Shown: modules assemble SL_GAME; Newtonsoft serializes it with null/default/reference-loop policies and custom converters. The root stores version, seed, world, jobs, institutional, discovery, mod and many other domain records. World uses opt-in JsonProperty fields. Graph lookup maps and live UI objects have ignore attributes or are derived at load. JobMgr saves only unfinished jobs with a worker, then rebuilds their links through AfterLoad. Periodic manager remainders are persisted by full type name.

Normal save bodies are UTF-8 JSON compressed with LZMA after an AES-wrapped JSON metadata header, normally padded to 2,000 bytes. An alternate text path is separate. Save headers include version/mode/mod/DLC metadata and simulation date. The string write path builds .saveb, then deletes the old .save and moves the new file. This is staging but is not atomic replace, durable backup rotation or a power-loss guarantee. The object overload writes directly to its destination. Optional background writes and synchronous writes differ; exception paths merit caution.

Loading decompresses to an .osave intermediate and deserializes; exceptions log, and MainManager rejects null data with LoadFail. This is not proof of comprehensive validation, recovery or safe handling of all malformed inputs. Post-load VersionCorrect invokes attributed fixes for older version thresholds; other domain repairs exist. MainManager autosave accumulates dt/timeScale, compares configured minutes and runs only after the running check; GetAutoSaveTime defaults to 15 outside its special cases. Wall-clock stamps identify saves but do not establish offline rewards. Full mod/DLC refusal UI, every migration and fault-injected disk behavior remain unread/unrun.

Sources: `managed/XiaWorld/SaveMgr.cs`; `SevenZipHelper.cs`; `managed/XiaWorld/MainManager.cs:502-645,645-732`; `managed/XiaWorld.SaveLoad/SL_GAME.cs`; `managed/XiaWorld/VersionCorrect.cs:9-95`; `managed/GameWatch.cs:259-280,1013-1020`; `managed/IManagerModule_LoopInterval.cs`.

PROPOSALS: Persistence owner: preserve last good state with tested replacement/recovery; distinguish a save message from durable success. Time owner: save scheduler phase and define each offline rule; never derive catch-up from a timestamp alone.

## A05: AI and NPC behavior

Status: partial.

Shown: behavior priority combines behavior kind, main priority, work kind and child priority. Enabled/ban state is distinct from that numeric order. Job definitions resolve managed drivers; jobs then own worker and toil execution. RPG dialogue jobs move into reach before starting conversation. The prior selected cleaning trace remains evidence for eligibility, claiming, movement, completion and interruption, rather than an assumption of a global utility planner. Pet behavior-tree and Lua job-search files exist, but were inventoried rather than fully traversed. Full faction autonomy, schedules and every need arbitration remain unread.

Sources: `managed/XiaWorld/BehaviourBase.cs`; `managed/XiaWorld/JobMgr.cs:27-120`; `managed/XiaWorld/JobRPGDialog.cs`; `input/Scripts/LsFindJob/`; `../traces/actors.md`.

PROPOSALS: Actor/job owner: separate desire, eligibility, reservation and execution; show why a funded actor declines or delays a duty.

## A06: UI and information design

Status: partial.

Shown in code: graph dialogue separates speech/options, speaker portraits and hidden function states. Jianghu actions keep disabled entries visible, supply descriptions as tooltips, sort enabled actions first and provide a return action. Wnd_NpcTalk has hotkey and click handling. Generated UI bindings, main-list definitions, help and message rules support many distinct windows. Teaching highlights and restricts specific controls. These are implementation observations, not observed screen layout, accessibility or comfortable density. No game was launched, so screen composition, scaling and keyboard completeness remain unverified.

Sources: `managed/Wnd_Dlg.cs:177-245`; `managed/Wnd_JianghuTalk.cs:86-132`; `managed/Wnd_NpcTalk.cs:50-105`; `managed/TeachingMgr.cs:241-325`; `input/Settings/Ui/`; `input/Mods/Readme_EN.txt`.

PROPOSALS: UI owner docs/UI_RULES.md: propose an information conversation as a place service/center view with a clear home and preserved log. Later gate: rebuilt populated save at 1366×768, Back/Esc and discoverability. Mobile remains deferred.

## A07: Content authoring and modding

Status: covered.

Stated in shipped mod documentation: XML is recursive, same-name definitions replace by load order, duplicate numeric text IDs replace earlier rows, scripts auto-load, and Info.json declares identity and minimum game version. Developer console, language packs and example assets are documented. The authoring map covers many systems, including RPG dialogue/event editors and pet trees.

Shown in code: ModsMgr sorts configured mod records, enumerates recursive XML files, deserializes through XmlSerializer and logs per-file failures. DlgMgr resolves names, reconstructs node maps and separates mod namespaces. CheckLink constrains link kinds in the editor. This does not prove a global content validator or deterministic duplicate order inside every folder. Active user mod order was not read. The XML parser inventory found one empty Human.xml; that is an empty-file parse result, not proof of a game defect.

Sources: `input/Mods/Readme_EN.txt`; `managed/ModsMgr.cs:403-417,1084-1150`; `managed/XiaWorld/DlgMgr.cs:170-214`; `managed/XiaWorld/DlgDef.cs`; `input/Scripts/RPG/DlgNode/`.

PROPOSALS: Content/mod owner: validate duplicate names, missing links, driver classes and migration requirements before activating a content pack.

## A08: Balance and numbers

Status: partial.

Shown: weighted sampling sums eligible weights and subtracts from a sampled total; generic World.RandomRate compares a random float to the supplied chance. World exposes named random streams and seed helpers, while Wnd_Dlg also uses UnityEngine.Random for text alternatives. Thus a saved seed alone does not establish whole-game reproducibility. Social results read rank, favour, social skill, charisma, vigilance and repeat-knowledge keys. These are distinct gates, not one affinity number.

Regional material costs ceil scaled item counts, while some abstract costs truncate to int. Readable disaster policies inherit a relief effect and set different daily material needs. Source example: drought relief spends wheat daily and supplies aid; focus changes cost scale. No universal pity system, arbitrary-precision arithmetic or stable effective difficulty is established. Full balance curves, loaded overrides and empirical rates remain unread/unmeasured.

Sources: `managed/WeightRander.cs:19-98`; `managed/XiaWorld/World.cs:817-873`; `managed/Wnd_JianghuTalk.cs:1089-1220,1673-1792`; `managed/XiaWorld/OutspreadMgr.cs:2943-3045,3804-3830`; `input/Settings/Outspread/Policy/policy_Disaster.xml`.

PROPOSALS: Balance/RNG owner: keep rounding and random stream ownership explicit; test boundary costs and preview purity.

## A09: Time and scheduling

Status: partial.

Shown: World carries double total simulation seconds, day counters and a day-hour conversion based on 600 simulation seconds. Regional day-based costs and disaster durations use that simulation calendar. Manager intervals accumulate dt and persist their phase. Events use due times; regional story intervals add random timing variation. Pause-update and ordinary running paths are separate, as are presentation updates and simulation updates. Autosave uses a different accumulation from game days.

The inspected code does not show a universal wall-clock offline advancement contract. Aging and all separate-world time policies remain unread. Large-dt equivalence is not assumed: the periodic base consumes one interval per call, and the event loop breaks after a handled entry.

Sources: `managed/XiaWorld/World.cs:70-125,817-900`; `managed/IManagerModule_LoopInterval.cs`; `managed/XiaWorld/MainManager.cs:353-420`; `managed/XiaWorld/GameEventMgr.cs:968-1011`; `managed/XiaWorld/OutspreadMgr.cs:1914-1955,3770-3855,4019-4045`.

PROPOSALS: Clock/scheduler owner: preserve remaining work and declared domain clocks; verify split advances and reload before claiming offline equivalence.

## A10: Onboarding and reveal

Status: partial.

Shown: teaching definitions load through ModsMgr, exclude disabled entries and build a type/name index and order list. Task-driven teaching can lock input, point at objects, move the camera, isolate permitted controls, show video and wait for an action. The room code completes a novice teaching task after a qualifying good fengshui result. The readable Teaching XML contains 8,331 XML elements, which is a structural size signal, not 8,331 lessons. Full lesson order, skip/abort cleanup and every unlock dependency remain unread. No claim of good onboarding follows from the existence of these tools.

Sources: `managed/TeachingMgr.cs:74-115,241-325`; `input/Settings/Teaching/TeachingDefs.xml`; `managed/XiaWorld/AreaRoom.cs:750-779`.

PROPOSALS: Onboarding owner: attach a lesson to an observable useful result and retain a skip/revisit path. UI locks need explicit abort cleanup.

## A11: Little touches

Status: covered.

Shown: speaker-specific portrait sides, alternative text variants, ordered options, separate visible/disabled conditions, action tooltips, enabled-first sorting, return entries, node voice/effect hooks, activation and deactivation effects, and contextual teaching completion. These details tie presentation to actual state. Pooling is an implementation touch, not necessarily a player benefit. Shipped docs also state console and hotkey support. SMALL_TOUCHES.md retains twenty source-linked observations and original adaptations. Full audio, localization quality, accessibility and perceived feel remain unverified.

Sources: `managed/Wnd_Dlg.cs:177-285`; `managed/Wnd_JianghuTalk.cs:86-132`; `managed/XiaWorld/AreaRoom.cs:705-779`; `managed/XiaWorld/JobMgr.cs:31-120`; `input/Mods/Readme_EN.txt`.

PROPOSALS: UI/feedback owners: acknowledge the cause and actual result without revealing undiscovered truth; reuse shared components.

## A12: Other systems

Status: partial.

Shown selected new systems: regional agencies couple material storage, influence, population, policy upkeep, aid and disaster state. Unfunded policy stops; delivered aid can resolve a disaster and choose a different closure from timeout. Rooms aggregate building state, layout and conditional relic effects into actual modifiers. SYSTEM_INVENTORY.md additionally records trade/auctions, challenge variants, body/God routes, formations, pet trees, generated names, biographies, ecology and collections. The prior DLC supplement covers selected Wudang and Bamboo paths only. Most of those systems are inventory-only here, not completed mechanic dossiers.

Sources: `input/Settings/Outspread/`; `managed/XiaWorld/OutspreadMgr.cs:1914-1955,2943-3045,3770-4078`; `managed/XiaWorld/AreaRoom.cs:414-785`; `input/Settings/Mutation/`; `input/Settings/Trade/`; `input/Settings/Zhen/`; `../DLC_COVERAGE.json`.

PROPOSALS: Institutions/world-depth owner: shared projects should have ongoing support, shortage outcomes and attributed consequences. Environment/effects owner: make spatial setup change an actual consumer, with reversible removal.
