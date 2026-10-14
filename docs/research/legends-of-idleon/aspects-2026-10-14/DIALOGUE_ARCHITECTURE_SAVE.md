# legends-of-idleon: dialogue, architecture and save digest

The priority rows are [A01-A04 in ASPECTS](ASPECTS.md). [DEEPER_SYSTEMS](DEEPER_SYSTEMS.md) traces the three selected joins. This digest records the denominator and the retrieval boundary.

## A01 Dialogue and conversation

SHOWN: N.js uses DialogueDefGET definitions plus NPCdialogue, QuestStatus and QuestComplete maps. NPCdialogue is saved with a character suffix. _customBlock_QuestComplete checks AccountWideQuests and propagates selected quest completion/dialogue states to other roster members; not all conversation history is account-wide. _customBlock_DialogueETC wraps text with language/font branches and explicit break markers, then creates a dialogue actor. Full speaker/portrait definitions, every line/condition and choice graph remain unread.

Source locators: `/Users/weiwei/.codex/research/idleon/extract/N.js:NPCdialogue,DialogueDefGET,_customBlock_QuestComplete,_customBlock_DialogueETC`; `/Users/weiwei/.codex/research/asp-idle/extract/idleon/save-dispatch.txt`.

## A02 Narrative delivery

SHOWN: quest helper entries refer to dialogue-definition quest IDs; completion maps and status maps are separate persisted objects. QuestComplete also joins achievements and named special cases. This links conversation to tasks and rewards; sequential quest text is not proof of an autonomous story planner. Whole world story chronology and all quest payout branches remain unread.

Source locators: `/Users/weiwei/.codex/research/idleon/extract/N.js:_customBlock_RemoveQuestFromHelper,_customBlock_QuestComplete,QuestHelperMenu`.

## A03 Implementation architecture

SHOWN: shipped web bundle contains Haxe/Stencyl/OpenFL/Lime runtime and 251 distinct scripts.* registrations. Event behavior classes use shared engine gameAttributes, custom block helpers and actor/scene callbacks. Generic names like ActorEvents_266 conceal substantial feature logic. Browser cloud functions bridge through window.React.createElement calls. Script registrations are not 251 independent gameplay systems, and downloaded JavaScript was never executed.

Source locators: `/Users/weiwei/.codex/research/idleon/extract/N.js:scripts.ActorEvents_266,scripts.* registration,lime,com.stencyl`; `/Users/weiwei/.codex/research/asp-idle/extract/idleon/classes.json`.

## A04 Save and persistence

SHOWN: save dispatch calls beginSave, emits CSver=33.05 and typed scalar/list/map/JSON/sparse-list entries, including account-wide stock and character-suffixed fields. NPCdialogue, QuestComplete, QuestStatus and helper entries use the active character suffix. The bridge hands data to host React functions; the inspected bundle alone does not reveal the full server format, durability, rollback or conflict rules. Load waits for status flags, requests time, loads data and runs AddNewStuff initialization. Complete migration/corruption handling remains unread. No account, save or cloud request executed.

Source locators: `/Users/weiwei/.codex/research/idleon/extract/N.js:beginSave,addSaveEntryMap,loadStatus,_customEvent_AddNewStuff`; `/Users/weiwei/.codex/research/asp-idle/extract/idleon/save-dispatch.txt`; `/Users/weiwei/.codex/research/asp-idle/extract/idleon/cloud-load.txt`.

## A09 Time and scheduling

SHOWN: cloud loading requests time, updates GlobalTime and passes elapsed time into AwayTimers; separate per-character PlayerAwayTime participates in assignment settlement. Background production differs from the active character task and capped stores. The AddNewStuff/load sequence is visible but full crash/replay settlement and server time authority remain unread.

Source locators: `/Users/weiwei/.codex/research/idleon/extract/N.js:loadStatus,requestTime,GlobalTime,_customBlock_AwayTimers,PlayerAwayTime`; `../AFK_AND_LEGIBILITY_DIGEST.md`.

Raw prose, complete tables and code stay in the private work areas linked by TOOLING; no prose reconstruction or raw dump belongs in this public dossier. Dialogue actions and save fields require separate consumer traces.
