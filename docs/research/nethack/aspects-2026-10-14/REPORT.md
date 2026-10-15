# NetHack: research report, 2026-10-14

Fresh source pass covers all twelve aspect rows for 1 game(s), with strongest semantic depth in dialogue, architecture and saves. The useful result is how text, actor rules, clocks and durable state meet. Catalogue-wide balance/mod/AI coverage remains partial. Installation adds no missing source access and is not needed for this pass; a later separately authorized install/play session would answer presentation, pacing and usability questions.

## Ranked PROPOSALS

These extend existing owners only if a fresh consumer audit establishes the named gap. No gameplay or owner edit is authorized by saving this research.

1. **PN1: Explain one useful conversation refusal** (NetHack). Use an existing actor/action and its real eligibility to select a short reason and an earned alternate reply. Keep every reasonable route reachable after its condition changes. Medium scope; no general dialogue engine. Owner: `src/data/dialogues.js; src/components/dialogue_component.js; src/models/dialogue_action.js`.
2. **PN2: Preserve a short recap beside full quest text** (NetHack). Attach an authored synopsis to an existing committed milestone, separately from its full passage. Show it in a desktop history panel; reading itself gives no new reward. Low to medium scope. Owner: `src/simulation_ui.js; existing Notebook/event content owner`.
3. **PN3: Keep timer subject and area together** (NetHack). Give one existing delayed actor/material job an explicit saved subject and area scope, only if current schema lacks it. Missing or moved subjects pause/refuse instead of silently settling elsewhere. Medium scope. Owner: `src/simulation.js; src/simulation_contracts.js`.
4. **PN4: Protect the old artifact on rejected restore** (NetHack). Audit existing candidate publication before changing it. Extend only a concrete uncovered failure: malformed candidate, unknown schema or unresolved actor links. Do not copy NetHack's destructive restore edge. Owner: `src/save_compatibility.js; src/native_storage_transaction.js`.
5. **PN5: Retain participation beside a voluntary conduct result** (NetHack). Reuse current feat receipts for one eligible repeatable activity with not-entered, active, met, broken and withdrawn distinctions. Do not re-add the now-present vial label view or impose a fixed solo-player attempt limit. Medium scope. Owner: `src/nethack_fieldcraft_feats.js; src/frontier_campaign.js`.

## Prior findings: confirm, correct or extend

| Code | Disposition | Evidence / implication |
|---|---|---|
| C1 | correction or qualification | The old FOLLOWUP_SOURCE.md claim that the fieldcraft inventory label adapter is absent is stale against the current checkout. src/nethack_fieldcraft_item_view.js now defines projectFieldcraftItemView, with an explicit completed-work and knowledge predicate. This is source presence only; this lane did not test its host integration or browser behavior. |
| C2 | correction or qualification | The new NetHack pin differs from the old 8898570da710513f38d81ed973f834863b795217. The current quest pager explicitly caches a private Lua interpreter and supports fallbacks and message-history synopsis. The old reports did not audit this route or saves, so these extend their coverage rather than overturning their item/pet/conduct conclusions. |
| nethack-E | extends | Dialogue/architecture/save routes and three deeper systems are newly read. Prior dossier [REPORT](../REPORT.md) remains bounded by its original source pin. |

## Scope and remaining gates

[A01-A12 source analysis](ASPECTS.md), [inventory](SYSTEM_INVENTORY.md), [deeper traces](DEEPER_SYSTEMS.md) and [future packets](IMPLEMENTATION_PACKETS.md) are written. Raw text, full source, structured dialogue conditions and extracts remain under `~/.codex/research/bf-roguelike-src/`, outside Git. No code, assets or prose were copied into YAIRPG gameplay. Licenses and notices remain in each clone; these are original behavioral proposals. No build, game launch, save test, browser proof, commit or push occurred.

Future implementation must reread live owners, choose a saved-field compatibility decision and complete rebuilt desktop play plus generated save/reload/literal Import where persistence changes. One realm and one prestige remain the first milestone. Food stays useful without ordinary hunger death; applicable passive progression remains allowed. No fixed solo-player attempt limit or mobile work is selected. Proposed owner edits are limited to the packets and require a later runtime assignment.
