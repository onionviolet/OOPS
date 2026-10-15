# legends-of-idleon: aspect pass, 2026-10-14

Status: PARTIAL. Lane `asp-idle`. This is a static source/data extension of the prior dossier, not gameplay, a full semantic read or implementation. SHOWN means inspected source/data, STATED means authored Help/text, INFERRED means analysis; prior native evidence is explicitly labelled. Raw source/text stays in the private work areas linked in TOOLING.

## A01 Dialogue and conversation

Status: partial. SHOWN: N.js uses DialogueDefGET definitions plus NPCdialogue, QuestStatus and QuestComplete maps. NPCdialogue is saved with a character suffix. _customBlock_QuestComplete checks AccountWideQuests and propagates selected quest completion/dialogue states to other roster members; not all conversation history is account-wide. _customBlock_DialogueETC wraps text with language/font branches and explicit break markers, then creates a dialogue actor. Full speaker/portrait definitions, every line/condition and choice graph remain unread.

Sources: `/Users/weiwei/.codex/research/idleon/extract/N.js:NPCdialogue,DialogueDefGET,_customBlock_QuestComplete,_customBlock_DialogueETC`; `/Users/weiwei/.codex/research/asp-idle/extract/idleon/save-dispatch.txt`.

PROPOSAL: Give each actor private conversation history, with explicit shared quest effects rather than copied knowledge. Owner: `docs/CHARACTERS_AND_WORLD_EVENTS.md`.

## A02 Narrative delivery

Status: partial. SHOWN: quest helper entries refer to dialogue-definition quest IDs; completion maps and status maps are separate persisted objects. QuestComplete also joins achievements and named special cases. This links conversation to tasks and rewards; sequential quest text is not proof of an autonomous story planner. Whole world story chronology and all quest payout branches remain unread.

Sources: `/Users/weiwei/.codex/research/idleon/extract/N.js:_customBlock_RemoveQuestFromHelper,_customBlock_QuestComplete,QuestHelperMenu`.

PROPOSAL: Keep a durable task receipt tied to the exact quest and speaker, and distinguish completion from active tracking. Owner: `docs/CHARACTERS_AND_WORLD_EVENTS.md`.

## A03 Implementation architecture

Status: covered. SHOWN: shipped web bundle contains Haxe/Stencyl/OpenFL/Lime runtime and 251 distinct scripts.* registrations. Event behavior classes use shared engine gameAttributes, custom block helpers and actor/scene callbacks. Generic names like ActorEvents_266 conceal substantial feature logic. Browser cloud functions bridge through window.React.createElement calls. Script registrations are not 251 independent gameplay systems, and downloaded JavaScript was never executed.

Sources: `/Users/weiwei/.codex/research/idleon/extract/N.js:scripts.ActorEvents_266,scripts.* registration,lime,com.stencyl`; `/Users/weiwei/.codex/research/asp-idle/extract/idleon/classes.json`.

PROPOSAL: Document state ownership across event handlers before splitting a system into new modules. Owner: `docs/ENGINE_AUTHORING.md`.

## A04 Save and persistence

Status: partial. SHOWN: save dispatch calls beginSave, emits CSver=33.05 and typed scalar/list/map/JSON/sparse-list entries, including account-wide stock and character-suffixed fields. NPCdialogue, QuestComplete, QuestStatus and helper entries use the active character suffix. The bridge hands data to host React functions; the inspected bundle alone does not reveal the full server format, durability, rollback or conflict rules. Load waits for status flags, requests time, loads data and runs AddNewStuff initialization. Complete migration/corruption handling remains unread. No account, save or cloud request executed.

Sources: `/Users/weiwei/.codex/research/idleon/extract/N.js:beginSave,addSaveEntryMap,loadStatus,_customEvent_AddNewStuff`; `/Users/weiwei/.codex/research/asp-idle/extract/idleon/save-dispatch.txt`; `/Users/weiwei/.codex/research/asp-idle/extract/idleon/cloud-load.txt`.

PROPOSAL: Persist actor-local state and shared services with explicit scopes and schema versions; do not infer server guarantees from a client serializer. Owner: `docs/ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md`.

## A05 AI and NPC behavior

Status: partial. SHOWN: actor/scene behaviors manage combat, movement, dialogue and work; prior source shows roster assignments and AFK calculations. NPC conversation progress is mostly state-machine data; general resident schedules, utility planning and faction AI were not established. Full combat actor transitions and server behavior remain unread.

Sources: `/Users/weiwei/.codex/research/idleon/extract/N.js:PlayerDATABASE,NPCdialogue,scripts.ActorEvents_1,scripts.SceneEvents_112`; `../ROSTER_AND_SCOPE_DIGEST.md`.

PROPOSAL: Make an actor assignment consume actual availability before letting it produce shared benefits. Owner: `docs/CHARACTERS_AND_WORLD_EVENTS.md`.

## A06 UI and information design

Status: partial. SHOWN/STATED: roster task icons, elapsed time, AFK rate screens and Quick Reference entries connect many local boards. Dialogue wrapper uses pixel-width/font rules and hard-break syntax, not a general responsive text system. Prior wiki descriptions cover capacities, detection odds and contributions. No current runtime screenshot, accessibility audit or desktop usability acceptance was performed.

Sources: `/Users/weiwei/.codex/research/idleon/extract/N.js:_event_cardQuickRef,_customBlock_DialogueETC`; `../AFK_AND_LEGIBILITY_DIGEST.md`.

PROPOSAL: Use wide desktop space for activity, shared stock and output destination, then verify at 1366x768 and 1920x1080; mobile deferred. Owner: `docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md`.

## A07 Content authoring and modding

Status: partial. SHOWN: generated definition maps, custom lists, actor events and scripts custom blocks combine data and procedural content. The official bundle is readable shipped implementation, not a public reusable source license or supported mod API. No public mod/load-order contract was verified. Wiki generated tables are secondary decoded references and may differ from the frozen bundle.

Sources: `/Users/weiwei/.codex/research/idleon/extract/N.js:DialogueDefGET,CustomMaps,CustomLists`; `../SOURCE_LEDGER.md`.

PROPOSAL: Keep declarative content readable but validate every referenced consumer and field. Owner: `docs/ENGINE_AUTHORING.md`.

## A08 Balance and numbers

Status: partial. SHOWN: AFK uses activity-specific calculations with elapsed seconds, hourly performance and modifiers; selected combat starts at a 40 percent base in this bundle, correcting an old wiki page. JS number arithmetic and Math functions are pervasive; display abbreviations do not establish arbitrary-precision state. Probability modifier order, complete caps and bad-luck protection remain partial.

Sources: `/Users/weiwei/.codex/research/idleon/extract/N.js:_customBlock_AFKgainrates,_customBlock_HourlyKillRate`; `../AFK_AND_LEGIBILITY_DIGEST.md`.

PROPOSAL: Show the base, additive and multiplicative parts of one rate from the same authoritative calculation. Owner: `docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md`.

## A09 Time and scheduling

Status: partial. SHOWN: cloud loading requests time, updates GlobalTime and passes elapsed time into AwayTimers; separate per-character PlayerAwayTime participates in assignment settlement. Background production differs from the active character task and capped stores. The AddNewStuff/load sequence is visible but full crash/replay settlement and server time authority remain unread.

Sources: `/Users/weiwei/.codex/research/idleon/extract/N.js:loadStatus,requestTime,GlobalTime,_customBlock_AwayTimers,PlayerAwayTime`; `../AFK_AND_LEGIBILITY_DIGEST.md`.

PROPOSAL: Keep claim time, activity elapsed time and storage saturation distinct in a receipt. Owner: `docs/ENGINE_EXPANSION.md`.

## A10 Onboarding and reveal

Status: partial. SHOWN/STATED: seven-world progression adds distinct production webs; character slots depend on shared class levels, with eleven available in the prior pinned wiki/table. Quick Reference is unlocked selectively. Later Research/Divinity effects can relieve old station occupancy. Exact displayed divine-name/effect-ID mapping remains unresolved, so the qualitative relief pattern is stronger than any selected name binding.

Sources: `/Users/weiwei/.codex/research/idleon/extract/N.js:NewCharLvReq,GodsInfo,_event_cardQuickRef`; `../WORLD_SYSTEMS_DIGEST.md`; `../ROSTER_AND_SCOPE_DIGEST.md`.

PROPOSAL: Earn tools/services that reduce routine maintenance without creating free bodies or removing funded prerequisites. Owner: `docs/TECHNOLOGY_AND_PROGRESSION.md`.

## A11 Little touches

Status: partial. SHOWN/STATED: task icons, storage capacities, rate previews, remote reference, language-aware dialogue wrapping, quest tracking and character-specific conversation state all help a growing roster remain inspectable. These do not prove the maintenance load is pleasant or every menu is remote-operable. Twenty-four proposal-sized touches are recorded separately.

Sources: `/Users/weiwei/.codex/research/idleon/extract/N.js:_customBlock_DialogueETC,QuestHelperMenu,_event_cardQuickRef`; `../SMALL_TOUCHES.md`.

PROPOSAL: Show what changed and where to act next instead of making players check every board. Owner: `docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md`.

## A12 Other systems

Status: partial. SHOWN/STATED: gathering/manufacture, Alchemy, Construction, Worship, Trapping, Cooking, Breeding, Laboratory, Divinity, Sailing, Gaming, Farming, Sneaking, Summoning, Research, Spelunking and later reef/jelly systems coexist with classes, quests, achievements, storage, shops and collections. Source symbol inventory extends beyond the prior seven-world digest; finding a handler is not semantic coverage of all of its branches.

Sources: `/Users/weiwei/.codex/research/idleon/extract/N.js`; `../WORLD_SYSTEMS_DIGEST.md`; `SYSTEM_INVENTORY.md`.

PROPOSAL: Trace one complete producer-to-consumer chain and its maintenance costs before adding a new board. Owner: `docs/ENGINE_AUTHORING.md`.

The existing one-realm/one-prestige milestone, familiar opening, comfortable unfed play, desktop-first direction and reasonable future reachability remain authoritative. These observations impose no fixed once-ever solo limit, source reset cadence or new mandatory release gate.
