# Dungeon Crawl Stone Soup and Cataclysm: Dark Days Ahead: research report, 2026-10-14

Fresh source pass covers all twelve aspect rows for 2 game(s), with strongest semantic depth in dialogue, architecture and saves. The useful result is how text, actor rules, clocks and durable state meet. Catalogue-wide balance/mod/AI coverage remains partial. Installation adds no missing source access and is not needed for this pass; a later separately authorized install/play session would answer presentation, pacing and usability questions.

## Ranked PROPOSALS

These extend existing owners only if a fresh consumer audit establishes the named gap. No gameplay or owner edit is authorized by saving this research.

1. **PC1: Make recurring companion barks quieter and evidence based** (Dungeon Crawl Stone Soup). Choose barks from actual actor state and observed facts, with lower frequency for long-lived companions. Keep random flavor separate from material outcomes. Low scope. Owner: `src/simulation_ui.js; actor observation owner`.
2. **PD1: Make a failed dialogue option useful information** (Cataclysm: Dark Days Ahead). For one existing earned exchange, show why the option is unavailable and one reasonable way to meet it. Separate preview from commit and retain ordinary exits. Low to medium scope. Owner: `src/data/dialogues.js; src/components/dialogue_component.js`.
3. **PC2: Build a useful chronicle from actual receipts** (Dungeon Crawl Stone Soup). Filter already-recorded actions into a concise earned chronology with cause, route and outcome. Keep mundane repeat events in history without crowding milestones. Low to medium scope. Owner: `src/simulation_ui.js; src/frontier_campaign.js`.
4. **PD2: Persist one delayed world event with its actor context** (Cataclysm: Dark Days Ahead). Use an existing event consumer and declare skip/coalesce/replay policy. Save due time, subject and context; prevent global work from repeating once per NPC. Medium scope. Owner: `src/simulation.js; src/simulation_contracts.js`.
5. **PC3: Stop a paid plan at a useful function** (Dungeon Crawl Stone Soup). Extend existing work plans with one authored earned-function target. Reuse mastery; pause on lost tools, source or funding. Medium scope, with no new broad XP engine. Owner: `src/feature_expansion_work_plan.js; src/feature_expansion_powers.js`.
6. **PD3: Preserve dirty state after a failed save** (Cataclysm: Dark Days Ahead). Check existing storage reporting before editing. Add only an uncovered path where failure clears dirty state or announces success. Medium scope because persistence is affected. Owner: `src/native_storage_transaction.js; src/save_files.js`.
7. **PC4: Give automated work a legible stop reason** (Dungeon Crawl Stone Soup). Show a named reason when a plan stops for access, tool, result or player-selected milestone. Keep independent laptop detail and history panels. Low scope. Owner: `src/feature_expansion_work_plan.js; src/display.js`.
8. **PD4: Distinguish practice from product in the plan view** (Cataclysm: Dark Days Ahead). Display actual learning goal, tool charges/time and whether a job produces an item. Reuse current crafting/practice owners and functional mastery. Low scope if current data already records the distinction. Owner: `src/feature_expansion_work_plan.js; src/display.js`.
9. **PC5: Version optional hints separately from earned state** (Dungeon Crawl Stone Soup). If needed, let old explanation cache rebuild without changing actual knowledge, skills or economic receipts. Validate simulation state more strictly. Medium scope. Owner: `src/save_compatibility.js; src/simulation_content.js`.
10. **PD5: Expose why a resident deferred its work** (Cataclysm: Dark Days Ahead). Project one existing actor's blocked/deferred/finished work status from actual resources, tools, consent and destination. No new utility AI framework. Low to medium scope. Owner: `src/feature_expansion_society.js; src/simulation_ui.js`.

## Prior findings: confirm, correct or extend

| Code | Disposition | Evidence / implication |
|---|---|---|
| C3 | correction or qualification | Fresh source extends the old selected-mechanics dossier; no contradiction to the prior conclusions was established; only the training-target route was freshly reread, while rune/run-record paths were inventoried. The old pin is not current HEAD and its line numbers must not be reused as new evidence. |
| C4 | correction or qualification | The repository monster_speech.txt is historical guidance, not current probability authority. Current maybe_mons_speaks returns early for neutral/patrolling actors, lowers the chance denominator for uniques, and multiplies it for allies. Copying the document's exact neutral/allied rates would be wrong at this pin. |
| crawl-E | extends | Dialogue/architecture/save routes and three deeper systems are newly read. Prior dossier [REPORT](../REPORT.md) remains bounded by its original source pin. |
| C5 | correction or qualification | The new pin differs from a68ad093f6f89f3e7d29ad62cbb7fcde46acfd25. The old achievement/conduct/practice dossier remains a bounded historical review; its complete causal paths were not all repeated here. |
| C6 | correction or qualification | Save version metadata does not prove transactional rejection. Current game::unserialize catches JsonError and returns, while unserialize_impl mutates live fields incrementally. game::save writes several owners in sequence and can report failure after earlier writes. This extends the prior save scope and rules out describing this as one atomic whole-world JSON save. |
| cdda-E | extends | Dialogue/architecture/save routes and three deeper systems are newly read. Prior dossier [REPORT](../REPORT.md) remains bounded by its original source pin. |

## Scope and remaining gates

[A01-A12 source analysis](ASPECTS.md), [inventory](SYSTEM_INVENTORY.md), [deeper traces](DEEPER_SYSTEMS.md) and [future packets](IMPLEMENTATION_PACKETS.md) are written. Raw text, full source, structured dialogue conditions and extracts remain under `~/.codex/research/bf-roguelike-src/`, outside Git. No code, assets or prose were copied into YAIRPG gameplay. Licenses and notices remain in each clone; these are original behavioral proposals. No build, game launch, save test, browser proof, commit or push occurred.

Future implementation must reread live owners, choose a saved-field compatibility decision and complete rebuilt desktop play plus generated save/reload/literal Import where persistence changes. One realm and one prestige remain the first milestone. Food stays useful without ordinary hunger death; applicable passive progression remains allowed. No fixed solo-player attempt limit or mobile work is selected. Proposed owner edits are limited to the packets and require a later runtime assignment.
