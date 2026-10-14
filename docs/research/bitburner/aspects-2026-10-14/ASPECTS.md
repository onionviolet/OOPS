# bitburner: aspect backfill, 2026-10-14

## Corrections

No contradiction of the prior six selected chains was found in the same stable revision. Extend its text coverage: messages are not merely flavor popups. sendMessage also stores a message filename on home and grants faction rumors; the first hacking-threshold message supplies a program. A modal named DialogBox does not establish a conversation tree. The prior offline comment/expression distinction remains.

Static reads only. **Shown** means inspected executable code/data; **stated** means page or declaration; **inferred** means the proposed YAIR interpretation. Covered means the bounded aspect question has source support, not that every record was read. Partial/unread limits stay explicit. Sources are pinned in [TOOLING](TOOLING.md); complete acquired files and raw text remain under `/Users/weiwei/.codex/research/bf-idle-src`. No code/assets/text are copied into YAIR.

## A01 Dialogue and conversation

Status: covered.

Shown: authored one-way messages keyed by MessageFilename. Delivery checks received IDs, hacking thresholds, an augmentation and router visibility. sendMessage opens a suppressible modal, stores the filename and grants faction rumors. No player reply graph is in this module; speaker identity is inside authored text, not a portrait/relationship schema. Full other text routes are partial.

Sources: [MessageHelpers.tsx](https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/Message/MessageHelpers.tsx); [Message.ts](https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/Message/Message.ts)

PROPOSAL: Deliver a local letter with a distinct heard/read/rumor consequence; do not silently equate it with joining a faction. Owner: docs/worlds/PROGRESSION_AND_ASSEMBLY.md; src/data/dialogues.js; src/life_record.js.

## A02 Narrative delivery

Status: covered.

Shown: literature records and messages are separate content families. Engine counters periodically check story messages; stored filenames support later reading. Authored terminal files let story sit beside actionable systems. No complete branching campaign or closure audit was made.

Sources: [Literatures.tsx](https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/Literature/Literatures.tsx); [LiteratureHelpers.tsx](https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/Literature/LiteratureHelpers.tsx); [engine.tsx](https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/engine.tsx)

PROPOSAL: Keep a readable known-document shelf alongside the action panels. Owner: docs/worlds/PROGRESSION_AND_ASSEMBLY.md; src/data/dialogues.js; src/life_record.js.

## A03 Implementation architecture

Status: covered.

Shown: TypeScript simulation, React UI, webpack tooling, class-based systems and event emitters. Engine cycles are 200 ms; counters schedule slower work and saves. Netscript workers have PID, threads, RAM admission and cleanup. User scripting is a product feature; its full API/interpreter remains unread.

Sources: [package.json](https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/package.json); [engine.tsx](https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/engine.tsx); [NetscriptWorker.ts](https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/NetscriptWorker.ts); [UIEventEmitter.ts](https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/ui/UIEventEmitter.ts)

PROPOSAL: Keep visible finite work costs and cancellation in the existing routine owner. Owner: src/feature_expansion_work_plan.js; src/simulation.js.

## A04 Save and persistence

Status: covered.

Shown: outer constructor-tagged JSON holds separately serialized player/server/company/settings/system fields and VersionSave. Export uses gzip bytes when Compression Streams exists, with base64 fallback otherwise. saveGame awaits storage before bridge notification/toast. Import writes then reloads; comparison and loader validation are separate stages, not proof of atomic rollback. Recovery/import disable autosave. Migration history and Electron restore parity remain partial.

Sources: [SaveObject.ts](https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/SaveObject.ts); [SaveDataUtils.ts](https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/utils/SaveDataUtils.ts); [SaveDataMigrationUtils.ts](https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/utils/SaveDataMigrationUtils.ts)

PROPOSAL: Explain export format and last successful write without treating a toast as validation of every loader. Owner: src/save_files.js; src/save_compatibility.js.

## A05 AI and NPC behavior

Status: partial.

Shown: Go uses board analysis, valid-move rules, opponent identity, promises and stale-board checks. Other organizations are timed simulations, not evidence of independent daily NPC lives. Gang and Bladeburner policy detail remains unread.

Sources: [goAI.ts](https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/Go/boardAnalysis/goAI.ts); [Gang.ts](https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/Gang/Gang.ts); [Bladeburner.ts](https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/Bladeburner/Bladeburner.ts)

PROPOSAL: Reject an asynchronous NPC choice if its world state changed while deciding. Owner: src/npc_lives.js; world CAMPAIGN.md.

## A06 UI and information design

Status: covered.

Shown: terminal commands, script editor/logs and expandable worker rows expose threads, RAM and online/offline production separately. Settings govern message suppression and display. Rendered desktop layout, keyboard accessibility and pacing were not exercised.

Sources: [WorkerScriptAccordion.tsx](https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/ui/ActiveScripts/WorkerScriptAccordion.tsx); [Terminal.ts](https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/Terminal/Terminal.ts); [Settings.ts](https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/Settings/Settings.ts)

PROPOSAL: At 1440x900, show the routine, its budget and actual result beside current work; retain separate reading/log regions. Owner: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md.

## A07 Content authoring and modding

Status: partial.

Shown: author content is TypeScript/TSX registries and formulas; player-authored Netscript scripts call an API. A scripting API is not a content mod loader. Complete API validation, plugins and load order were not read.

Sources: [NetscriptFunctions.ts](https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/NetscriptFunctions.ts); [BaseResearchTree.ts](https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/Corporation/data/BaseResearchTree.ts); [Literatures.tsx](https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/Literature/Literatures.tsx)

PROPOSAL: Use declarative content IDs for local research; do not add executable closures to YAIR content. Owner: docs/TECHNOLOGY_AND_PROGRESSION.md.

## A08 Balance and numbers

Status: partial.

Shown: offline script income uses measured prior production; experience uses confidence and does not simply match the half-rate comment. Research uses parent/points gates. Casino RNG and every balance formula remain unread beyond identity.

Sources: [ScriptHelpers.ts](https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/Script/ScriptHelpers.ts); [ResearchTree.ts](https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/Corporation/ResearchTree.ts); [RNG.ts](https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/Casino/RNG.ts)

PROPOSAL: Label measured versus predicted rates and state the confidence boundary. Owner: src/feature_expansion_work_plan.js; src/simulation.js.

## A09 Time and scheduling

Status: covered.

Shown: engine counters schedule slower tasks; load elapsed cycles drive separate subsystem catchup. Saved scripts restart only after UI load and RAM admission can fail. Offline production is not uninterrupted execution of every saved script.

Sources: [engine.tsx](https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/engine.tsx); [ScriptHelpers.ts](https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/Script/ScriptHelpers.ts)

PROPOSAL: Separate saved plan ownership from current eligibility to run. Owner: src/feature_expansion_work_plan.js; src/simulation.js.

## A10 Onboarding and reveal

Status: covered.

Shown: stateful tutorial steps and threshold-gated messages introduce the terminal, scripts and factions. Receiving a rumor and becoming eligible for faction entry remain distinct. All advanced reveal gates remain partial.

Sources: [InteractiveTutorial.ts](https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/InteractiveTutorial.ts); [InteractiveTutorialRoot.tsx](https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/ui/InteractiveTutorial/InteractiveTutorialRoot.tsx); [MessageHelpers.tsx](https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/Message/MessageHelpers.tsx)

PROPOSAL: Teach one real local action and reveal its next usable consequence. Owner: src/native_discovery_policy.js; src/observation_channels.js.

## A11 Little touches

Status: covered.

Shown: pre-import comparison, worker kill/log controls, message suppression and separately labelled online/offline figures. These are static affordances, not measured usability.

Sources: [ImportSaveComparison.tsx](https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/ui/React/ImportSaveComparison.tsx); [WorkerScriptAccordion.tsx](https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/ui/ActiveScripts/WorkerScriptAccordion.tsx); [Settings.ts](https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/Settings/Settings.ts)

PROPOSAL: Use precise stop controls and a save preview with useful identity fields. Owner: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md.

## A12 Other systems

Status: partial.

Shown inventory: Go, DarkNet, Infiltration, coding contracts, augmentations, factions, companies, stocks, gangs, corporations, sleeves and Bladeburner coexist. The earlier six chains did not document most of them. Go next-turn safety was deepened here; whole subsystem semantics remain partial.

Sources: [Go.ts](https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/Go/Go.ts); [DarkNet](https://github.com/bitburner-official/bitburner-src/tree/1da7316ffd9d281b45a86c4c54ec532276557892/src/DarkNet); [Infiltration](https://github.com/bitburner-official/bitburner-src/tree/1da7316ffd9d281b45a86c4c54ec532276557892/src/Infiltration); [CodingContract](https://github.com/bitburner-official/bitburner-src/tree/1da7316ffd9d281b45a86c4c54ec532276557892/src/CodingContract)

PROPOSAL: Keep mini-games optional and attach rewards to named local means. Owner: docs/worlds/ABILITY_AUTHORING.md.

## Remaining scope

Full Netscript semantics, Gang/Bladeburner AI, DarkNet rules, all formula/content records and Electron save parity remain unread. No install needed for these static questions.

All proposals use the existing actor/stock/job/clock/knowledge/save owners. Preserve reasonable alternative paths, repeatable solo play, one realm/one prestige first milestone and canon-specific rules. UI target for future packets is 1440x900 laptop; mobile optimization deferred. No source/build/runtime/save/human acceptance gate is claimed passed.
