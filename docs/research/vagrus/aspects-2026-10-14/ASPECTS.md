# vagrus: aspect pass, 2026-10-14

Static source research. SHOWN means inspected code/data, STATED means a cited prior statement, INFERRED means interpretation. Covered means the aspect has a bounded implementation answer, not an exhaustive narrative or runtime audit. Source locators below are relative to `~/.codex/research/vagrus-2/extract/code/` unless explicitly described as prior docs or table data. Raw prose and code remain in the retained private areas, read-only in this lane. No game launch, saves access or gameplay acceptance.

## A01: Dialogue and conversation

Status: covered.

SHOWN: dialogue and encounters share authored event/step/choice records, with 1,178 events, 17,223 steps and 34,323 choices. Descriptions are prose; bracket scripts carry dependencies, hidden conditions, checks, costs, transitions and actions. Event and step actor/NPC lists drive portrait holders. Step portraits override event portraits, with a no-portrait option. Choices keep original indices even when some buttons are hidden. Hidden and unavailable choices are omitted outside test mode; other unavailable choices can remain visible with dependency icons. Selection rechecks eligibility, registers history, logs the chosen response, resolves action/check/transition paths and can await combat/exploration callbacks. This is authored branching, not a language-model conversation. All personal-quest prose and relationship-gated lines remain unread.

Implementation/evidence: `EventStep.cs:1631-1939; EventUI.cs:2119-2255,2368-2414; Vagrus.UI/EventChoiceButton.cs:111-135; Vagrus.Data/EventScriptParser.cs; ../pass-2026-10-14/EVENT_ENGINE.md`.

PROPOSAL: docs/DIALOGUE_AND_INTERACTIONS.md should distinguish hidden knowledge from visible unmet means and retain stable response IDs; docs/ENGINE_EXPANSION.md should recheck at commit and log actual consequences.

## A02: Narrative delivery

Status: covered.

SHOWN: journals have parent/children, objectives, quality, hidden/optional flags, expiry and active/modified order. Codex, news, rumors, logs and notes are separate persisted collections. Chosen responses are appended to the event display and unused choices removed from that display. Event closure and quest completion are distinct actions. That display behavior does not prove an all-session transcript survives save/load. Full codex/journal data tables were not recovered in the two-table pass.

Implementation/evidence: `Journal.cs; Vagrus/SaveData.cs; EventUI.cs:2368-2414; ../pass-2026-10-14/EVENT_ENGINE.md; ../pass-2026-10-14/COMPANIONS_CREW.md`.

PROPOSAL: docs/CHARACTERS_AND_WORLD_EVENTS.md and docs/DIALOGUE_AND_INTERACTIONS.md should retain outcome receipts and unfinished promises independently of a scene window.

## A03: Implementation architecture

Status: covered.

SHOWN: Unity Mono application with 1,506 recovered C# files, data pools and Addressables loading. A bracket-command parser drives the legacy event engine. A separate typed graph/exploration layer has 46 base graphs and 569 subevents in build.json; ExplorationManager exposes objectives, challenges, treasure, choices and change events, and the AOT helper references typed values, branches and subevents. Presence of both engines does not make their execution rules identical. Async save serialization uses a thread pool; combat simulation yields work. Full graph-controller execution is unread.

Implementation/evidence: `Vagrus/SaveGame.cs; Caravan.cs; Vagrus.Data/GameEvent.cs; Vagrus.Data/EventScriptParser.cs; Vagrus.Exploration/ExplorationManager.cs; EventGraphAotHelper.cs; SYSTEM_INDEX.json`.

PROPOSAL: docs/ENGINE_EXPANSION.md should keep a typed result bridge between scene chains and contained activities; use one committed state owner rather than duplicate quest state.

## A04: Save and persistence

Status: covered.

SHOWN: current source SaveVersion is 37, minimum accepted version 14; future-version saves are rejected outside test mode. Mode/tutorial/demo compatibility has extra gates. Envelope is VAGRI prefix, additive checksum, header length, base64 JSON header and gzip JSON body. SaveData includes company, actors, inventories, journals, map state, markets, event/step/choice history, variables, scheduled actions, tutorial and UI state. Active events block Save and are not automatically retried there. Async requests coalesce by target path, serialize off-thread and report completion later. Local durable path writes and verifies a temp file, then deletes destination and moves; backend FileManager uses its own write route. VerifySaveReadable uses DecodeSaveData with full=false, checking envelope/header without body deserialization. The ordinary synchronous input path calls WriteSaveToFile directly, so not every save uses the temp path. Migrations repair content as well as schema, including route visibility, queued actions, character resets and a prior missing story variable. No personal saves were opened and no roundtrip was run.

Implementation/evidence: `Vagrus/SaveGame.cs:350-767,817-938,2380-2609,2867-2903; Vagrus/SaveData.cs; Vagrus/SaveHeader.cs; GeneralSettings.cs:60; Crypto.cs:147-199; Vagrus.IO/VFile.cs:63-115`.

PROPOSAL: docs/ENGINE_EXPANSION.md should specify supported versions, full-body validation and migration receipts; UI must distinguish queued, blocked and completed saves. Avoid delete-before-move as an assumed crash-safety guarantee.

## A05: AI and NPC behavior

Status: partial.

SHOWN: combat AI simulates candidate skills/targets and scores damage, kills, healing, effects and position. Tactical level can select max, average or skew score. Under realistic simulation, iterations clamp 14+4*tacticalLevel to 1..150; non-realistic simulation returns 75 and an override exists. IterationPerFrame defaults to 8. Tutorial combat can prescribe a first action instead. Companions use authored loyalty/departure rules. These do not establish autonomous overworld lives or universal rule parity; full enemy rules and all simulation branches remain unread.

Implementation/evidence: `HeroCombat.cs:10514-10630,11020-11996; AiTweak.cs:21-74,163-168; ../pass-2026-10-14/COMPANIONS_CREW.md`.

PROPOSAL: docs/ENGINE_EXPANSION.md and docs/ENCOUNTERS_AND_PURSUIT.md can compare legal candidate outcomes with a compute budget, while docs/CHARACTERS_AND_WORLD_EVENTS.md keeps authored loyalty separate from autonomous goals.

## A06: UI and information design

Status: partial.

SHOWN: scrollable event text, portraits, selected heroes, requirement/action icons, test chance and optional resourcefulness controls share one event UI. Stable original indices are retained apart from visible button indices. Visible tests show their icons; hidden tests are exposed in test mode. Code links text to codex and tooltips. UI save fields include sorting, filters, last-read entries and camera zoom. Actual desktop density, keyboard completeness and accessibility remain untested.

Implementation/evidence: `EventUI.cs:804-970,1269-1372,2119-2255; Vagrus.UI/EventChoiceButton.cs; Vagrus/SaveData.cs; SYSTEM_INDEX.json`.

PROPOSAL: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md should show speaker, response, costs and current context at 1440x900, with map/log side panels where useful; mobile optimization is deferred.

## A07: Content authoring and modding

Status: covered.

SHOWN: data tables separate stable UIDs, prose, scripts and ordering. Events include readiness, version, locked/checkout and commit metadata; these suggest an authoring workflow but do not prove a shipped editor is public. Tutorial rows contain language-specific descriptions, action text and positioning data. Typed graph data supports another authoring format. No supported public mod API/load order was established. A regex command count is not parser validation.

Implementation/evidence: `events.json schema; AirTable.json schema; Vagrus.Data/EventScriptParser.cs; EventGraphAotHelper.cs; ../pass-2026-10-14/EVENT_ENGINE.md`.

PROPOSAL: docs/DIALOGUE_AND_INTERACTIONS.md should author prose separately from stable conditions/effects and validate references; docs/ENGINE_EXPANSION.md should declare module dependencies and load validation explicitly.

## A08: Balance and numbers

Status: partial.

SHOWN: event rarity rolls give 6/25/69 percent before fallback, not the labels alone. Eligibility, priority and category competition alter observed frequency. Market quantity quotes follow changing prices rather than a flat unit quote; logistics reduce real profit. Tactical scoring varies with actor level. Checksum is a byte sum, not a cryptographic integrity test. Full test formulas, RNG seeding, difficulty tuning and bad-luck protection remain unread. Event-drought scaling is not proof of a universal pity system.

Implementation/evidence: `AiTweak.cs:41-74; EventStep.cs; ../pass-2026-10-14/EVENT_ENGINE.md; ../pass-2026-10-14/ECONOMY_TRAVEL.md; Crypto.cs:147-156`.

PROPOSAL: docs/ENGINE_EXPANSION.md should distinguish authored probability, eligibility and realized frequency; docs/MEANS_AND_APPRAISAL.md can show quantity and net trip estimates.

## A09: Time and scheduling

Status: covered.

SHOWN: day/turn state, event drought, cooldown history and scheduled actions are persisted. Event, step and choice each have independent histories. Positive max-trigger values impose a cap; nonpositive values do not. Elapsed day equal to dayFreq passes the cooldown. Travel, city entry and camp picks use different scheduling paths. Save timestamps alone do not establish offline catch-up; none was established in reviewed consumers.

Implementation/evidence: `ScheduledEventActionSave.cs; Vagrus/SaveData.cs; ../pass-2026-10-14/EVENT_ENGINE.md; ../pass-2026-10-14/ECONOMY_TRAVEL.md`.

PROPOSAL: docs/TIME_KEEPERS_AND_VARIANTS.md and docs/ENGINE_EXPANSION.md should save simulation deadlines and pending actions, and let reasonable recurrence depend on world conditions rather than universal once-only flags.

## A10: Onboarding and reveal

Status: covered.

SHOWN: 195 tutorial rows include type, dimensions, placement, localized instructions and hold-key hints. Tutorial flags gate event choices and other UI actions. Save data retains status/history; load repair can reconstruct expected flags from history and re-enable accidentally locked flags, with an exclusion list. Tutorial combat can prescribe initial actions. This proves repair hooks, not that every tutorial route is currently flawless.

Implementation/evidence: `AirTable.json Tutorial table; TutorialStatus.cs; TutorialHistorySave.cs; Vagrus/SaveGame.cs:2120-2220; EventStep.cs:1631-1650`.

PROPOSAL: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md and docs/ENGINE_EXPANSION.md should save learned steps and recover stale tutorial locks without changing actual earned capabilities.

## A11: Little touches

Status: covered.

SHOWN: translation-reviewed indicators with explanatory tooltips, chosen-response log cleanup, step-specific portrait overrides, selected-hero portraits, original choice mapping, last-read pointers and sorting preferences are distinct small features. The indicator concerns localization review, not in-world language knowledge. Cost and dependency icons can explain visible refusals. These hooks were source-read, not evaluated for usability.

Implementation/evidence: `Vagrus.UI/EventChoiceButton.cs:111-135; EventUI.cs:2119-2255,2368-2414; Vagrus/SaveData.cs; ../SMALL_TOUCHES.md`.

PROPOSAL: docs/DIALOGUE_AND_INTERACTIONS.md should keep selected participant and response attribution visible; the UI owner should persist useful reading position and preferences separately from game rules.

## A12: Other systems

Status: partial.

SHOWN: recovered tables cover trade/mercenary/exploration tasks, passengers, rumors, factions, properties/effects, crew and hero combat, gear, collections, achievements and product records. Exploration has objective/challenge/treasure state separate from the legacy event. DLC records in data do not prove ownership or actual access. Outpost, full expansion progression, factions/endings and every collection remain unread. Province War can cite the existing fit report and this pass without any edit to its own files.

Implementation/evidence: `AirTable.json; SYSTEM_INDEX.json; Vagrus.Exploration/ExplorationManager.cs; ../pass-2026-10-14/DLC_CONTENT.md; ../pass-2026-10-14/PROVINCE_WAR_FIT.md`.

PROPOSAL: docs/MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md and docs/ENGINE_EXPANSION.md can consume a typed excursion receipt; Province War planning should use optional explicit upkeep and real logistics, preserving YAIR no-hunger-death direction.

