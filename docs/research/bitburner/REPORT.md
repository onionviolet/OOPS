# Bitburner source audit, 2026-10-09

Bitburner adds a useful model for **visible, bounded automation** and research that changes what a player can do. The best next proposal is P1: improve the existing YAIR routine row. P2 offers the strongest new local gameplay: discover a workshop method, craft one tool, and use it in a native action.

Official stable source pinned at `1da7316ffd9d281b45a86c4c54ec532276557892`. Remote default was dev; stable was chosen deliberately. Six selected chains were inspected. No game was launched, dependencies installed, build run, saves read or YAIR gameplay changed. This is source evidence, not runtime or full-game verification.

## Source findings

**F1 Automation reserves a measurable budget before execution.** Worker start checks RAM per thread, rejects shortage before allocation, tracks PID and cleans up resolved/rejected execution. [src/NetscriptWorker.ts:74-155](https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/NetscriptWorker.ts#L74-L155)

**F2 Research joins data, requirements, effects and readable UI.** Research checks parent and points, subtracts once, then shares the unlock with same-industry divisions; transport updates warehouse size explicitly. [src/Corporation/Actions.ts:501-539](https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/Corporation/Actions.ts#L501-L539)

**F3 Reset types have different destruction and retention boundaries.** Augmentation reset clears skills, money, work and invitations and reapplies installed augmentations. Source-file reset calls that path and additionally clears institutions and augmentations. The non-flume BitNode entry caller grants/upgrades a Source-File before resetting; flume entry does not grant it. [src/RedPill.tsx:16-78](https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/RedPill.tsx#L16-L78) [src/PersonObjects/Player/PlayerObjectGeneralMethods.ts:80-175](https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/PersonObjects/Player/PlayerObjectGeneralMethods.ts#L80-L175)

**F4 Offline progress is a model with subsystem-specific treatment.** Offline script production uses measured prior activity, elapsed time, confidence for experience and a configurable income factor. Grow/weaken use half-rate counts; money guards nonfinite values. Startup restores only listed saved scripts after MainUILoaded, can skip them with ?noscript, and RAM admission may fail; offline calculation is called after each start attempt, so this code is not a promise of uninterrupted script execution. [src/NetscriptWorker.ts:218-264](https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/NetscriptWorker.ts#L218-L264) [src/Script/ScriptHelpers.ts:14-90](https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/Script/ScriptHelpers.ts#L14-L90)

**F5 Automation UI makes cost and outcomes inspectable.** A collapsed script row identifies RAM and arguments; expansion separates threads, online/offline time, totals and measured production rates; kill and log handlers expose control. [src/ui/ActiveScripts/WorkerScriptAccordion.tsx:47-165](https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/ui/ActiveScripts/WorkerScriptAccordion.tsx#L47-L165)

**F6 Save success and import review have explicit stages.** Saving awaits encoding and storage, returning on either failure before the success toast. Import writes storage and reloads; an adjacent comparison screen parses both candidate/current data and temporarily suspends autosave. [src/ui/React/ImportSaveComparison.tsx:114-161](https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/ui/React/ImportSaveComparison.tsx#L114-L161) [src/SaveObject.ts:235-336](https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/SaveObject.ts#L235-L336)

## Ranked original proposals

| Rank/code | Adds to the north star | Vanilla fit / limit |
|---|---|---|
| 1 / P1 Make the existing routine legible | Repeat one native gathering command a chosen number of times, pause it, and see why the next iteration cannot start. | src/simulation.js:311-329; existing center actions. No new automation scheduler; care actions remain excluded. |
| 2 / P2 Workshop discovery with one functional payoff | Gather one specimen, study one method at a local workshop, then craft one tool whose use changes an existing action. | native gathering, crafting recipes, professions and equipment. Reuse one realm and native panels; no generic research currency tree until selected. |
| 3 / P3 Receipts for productive time | Return from a short absence and see completed work, inputs spent and the precise reason work stopped. | existing simulation clock, routine status and activity logs. Use the existing clock policy; no forecast production until it is defined and verified. |
| 4 / P4 Review the life being loaded | Before replacing a life, compare location, played time and schema, with a useful storage failure message tied to the last successful save. | src/save_files.js:166-190; native save/import flow. Guarded storage already exists. This is an extension, not a replacement or a claim of absent safety. |
| 5 / P5 Research sharing needs a place and a teacher | Teach the unlocked workshop method to one named craftsperson; a related facility changes only after the lesson or delivered copy. | native Village NPCs, workshop inventory, quests and trade. Original proposal; existing npc_lives.js:5-39 is a predetermined household, not evidence of autonomous teaching. |
| 6 / P6 One prestige preview, separate from travel | Inspect a proposed rebirth charter showing the capability gained and which current possessions or work would end before accepting anything. | PROJECT.md one prestige layer; native stats, items, life record. Policy undecided. Start with preview only; no reset implementation, second layer or travel coupling authorized. |

All six are proposals. None is accepted or implemented. Twenty-six small touches and observable gates are in [IMPLEMENTATION_PACKETS.md](IMPLEMENTATION_PACKETS.md).

## Avoid duplicate work and unsupported conclusions

The live YAIR source already has guarded size/error handling (`src/save_files.js:166-190`), single-command routines with care exclusions (`src/simulation.js:311-329`), biography compaction (`src/life_record.js:41-47`) and a bounded predetermined household (`src/npc_lives.js:5-39`). The proposals extend those systems; none establishes that a scheduler, storage guard, biography or autonomous household is absent or newly built.

The offline source comment says production is at most half online, but the experience expression actually uses confidence without that half factor. This audit follows the expression rather than repeating that comment as a universal rule. Source-specific offline estimates are not a YAIR balance recommendation. Bitburner import comparison does not prove rollback or atomicity of every loader.

Retained source and hashes remain private under `~/.codex/research/bitburner/`; only derived audit documents live here. Preserve both games’ attribution and YAIR LICENSE. No copying of source/UI/lore is proposed.
