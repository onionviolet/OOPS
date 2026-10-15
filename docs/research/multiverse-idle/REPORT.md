# Multiverse Idle: desktop UI research

Multiverse Idle supplies a useful example of a stable desktop shell with a working center and an inspectable right side. Six store screenshots show training, allies, skills and combat. They do **not** show several live worlds side by side or the map screen. The strongest lessons are near the current YAIRPG work-feedback proposal, not a new multiverse dashboard. See [screenshot-by-screenshot evidence](EVIDENCE.md).

**Research only, PROPOSALS ONLY. Status: PARTIAL.** No implementation, gameplay test, install, purchase, save access, commit or owner edit. Source claims retain SHOWN/STATED/INFERRED labels in [FINDINGS.json](FINDINGS.json). Live store and API list the base game as coming soon and free, with demo 4330370 offered; “if bought” is therefore an unnecessary premise for a later archive inspection ([store](https://store.steampowered.com/app/4122910/Multiverse_Idle/)). No demo downloaded. Official Itch says Godot and has no playable upload now ([Itch](https://kappagames.itch.io/multiverse-idle)).

## What makes places differ and what the traveler carries

**SHOWN:** Celestia and Naturia battle views retain the same character/nav shell but change named stages, enemies and local artifact/dust rewards. Naturia's inspector explicitly separates zone effects from enemy effects; Siege uses a wave header. This is evidence of destination-specific combat information, not proof of whole local societies or power systems ([S03](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4122910/ebc9b5373b80181458ebde399109e22095b6dc35/ss_ebc9b5373b80181458ebde399109e22095b6dc35.1920x1080.jpg?t=1789512680), [S04](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4122910/83dce1439a886648a42afdad8e57be7ea2ec020a/ss_83dce1439a886648a42afdad8e57be7ea2ec020a.1920x1080.jpg?t=1789512680), [S05](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4122910/b2fdfdd17852c74c1e2b67384b3d8052564bae52/ss_b2fdfdd17852c74c1e2b67384b3d8052564bae52.1920x1080.jpg?t=1789512680)).

**SHOWN:** Allies can be filtered by world; selected details show a local set counter, player-stat bonuses and class. **INFERRED:** the game builds a shared traveler/team across themed battle destinations. **UNREAD:** exact crossing rules for items, suppressed powers, social recognition, relationship continuity, destination history and inactive-world clocks. Do not adopt its battle-area naming as YAIRPG ontology ([S01](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4122910/3d28194e3955e9c81f40d4568c429403c92308e3/ss_3d28194e3955e9c81f40d4568c429403c92308e3.1920x1080.jpg?t=1789512680)).

## Ranked PROPOSALS

| Rank / code | Adaptation and owner | Kit / synthesis | Cost and 1366×768 visible outcome |
|---|---|---|---|
| 1 / MI-P01 | Side-by-side current work, receipt, blocker and selected-action explanation. UI at scale SC1/IN1; thematic UI P2; production-chain owner. | K13/K14; extend P01/P04 | Projection first. Keep one paid action, stop control and cause visible without scrolling the whole page. |
| 2 / MI-P02 | Inspector labels distinguish per-attempt, completion and conditional rewards; show known local modifiers separately. Means/appraisal and thematic UI. | K2/K10/K14; extend P04/P14 | Requires canonical preview values. A known reward's trigger and local cause fit beside its action. |
| 3 / MI-P03 | Origin-filtered companion/item list plus one selected detail and formation/equipment comparison. Companions and crossing owners; UI at scale NV5. | K6/K9/K15; NEW presentation packet, reuses P05/P16 | Keep origin, current custody and current usability distinct; list/details remain visible together. |
| 4 / MI-P04 | Explicit known unlock handoff with destination and reason; retain entry after cue fades. Panel kit and UI at scale SC3/SC5. | K11/K14; extend P04 | Use existing discovery contracts, no new unlock ledger. A world/action reveal must be findable after reloading. |
| 5 / MI-P05 | Rates, caps, active slots and next milestone beside the trained/worked value, with one shared breakdown. Ability authoring and UI at scale IN1. | K3/K13/K14; extend P01/P09 | Adapt numbers only where native semantics exist. Do not import a universal stat hierarchy. |
| 6 / MI-P06 | Return summary distinguishes earned work, stored allowance, capped time and a stopped decision. Offline-time owner and UI at scale. | K18/K26/K33; extend P13 | Larger clock/persistence cost; park until native consumers are verified. A bank meter is not a reward receipt. |
| 7 / MI-P07 | Keep critical save/stop status readable and labelled; compress duplicate routine log messages by count. Panel kit, thematic UI and event feed. | K14/K18/K23; extend P01/P20 | Bounded view change; preserve ordered underlying facts. No repeated alerts stealing action height. |

These ranks are this lane's UI assessment, not a replacement for synthesis P01/P03/P19 or the kit successor's selected P01 Village mixing slice. Mobile optimization, simultaneous simulation, branch switching, new worlds and a general upgrade-tree engine are deferred. All reasonable later options remain reachable; no fixed lifetime limits proposed.

## Desktop fit and source limits

**SHOWN:** source media are 1920×1080. Approximate rail boundaries are x=316 and x=1556, leaving a 1240px center and 364px right rail. **INFERRED arithmetic:** direct scaling to 1366×768 gives about 225/882/259px and 71% text scale. This is not an acceptable readable-layout claim. S02 already spends large fixed height on six stat groups; S01 has a tall roster; S06 contains unused central space. Adapt allocation and spacing before reducing font size.

**PROPOSAL:** begin a 1366px fit trial with 220px left, 800px center and 310px right, plus 36px total gaps/padding. Budget 56px global header, 680px content and 32px footer. In center, reserve 56px local context, 88px current-work summary, 440px useful action/list region and 96px controls. Test actual container width, text at 16px, long labels and zoom rather than treating these sums as proof. Keep several useful actions visible; long reference prose and history scroll within their regions. No mockup or rebuilt YAIRPG browser result was produced in this research lane.

## Prior findings: confirm, correct, extend

| Code | Existing packet/owner | Result from this source |
|---|---|---|
| MI-C01 | Synthesis P01 and P04 | Extends the visual case for current-value/cost/cap/requirement proximity. No native work or permission logic verified here. |
| MI-C02 | Synthesis P14, kit K2/K13 | Local modifiers/reward identity are shown; different world-law execution is still unread. A biome or mode label alone is insufficient. |
| MI-C03 | Synthesis P05, nested-world campaign | Does not establish carrier-specific crossing contracts. Roster origin tags complement, not replace, body/fuel/custody/jurisdiction rules. |
| MI-C04 | Synthesis P13 and integration map IR3/IR4 | Offline stamina label does not prove catch-up. Historical web-save problems strengthen separate clock/save proof, not a claim that current Steam saves fail. |
| MI-C05 | Kit successor FK3/NX12 | No readiness score changed. UI media add no runtime completion to the dated K19-K34 grid; fidelity and the selected local slice still govern. |
| MI-C06 | New MI-P03 | Origin-filtered list/inspector is a new presentation packet, not a new traveler-state model. |

Owner routing: [UI at scale](../../UI_AT_SCALE_CONSIDERATIONS_2026-10-14.md), [thematic UI](../../THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md), [kit successor](../../worlds/WORLD_CORE_KIT_SUCCESSOR_2026-10-14.md), [kit K1-K34](../../worlds/WORLD_CORE_KIT_2026-10-14.md), [integration map](../START_AND_BRANCH_INTEGRATION_MAP_2026-10-14.md), [synthesis packets](../cross-game-synthesis-2026-10-14/PACKETS.md). The prompt's nested-world path was absent; the actual [owner](../../gm/dispatch/NESTED_WORLDS_AND_DEEP_TROPE_CHAINS_2026_10_05.md) was located and read. Observed branch was `codex/gameplay-foundations`, not main; no branch switch. Observation HEAD: `ad89c04ecb926ee701df03842f5b0d219f58ebe2`.

## Decompile value

**PROPOSAL: bounded read-only archive pass, medium value.** Godot is officially stated, precise shipped version unverified. Later inspect legally available demo files or a user-supplied install without launch: hash files, identify separate/embedded PCK and engine revision, inventory scenes/resources/scripts, then follow training breakdown, world selection, navigation/pause coupling and save/offline consumers. [Godot documents packs](https://docs.godotengine.org/en/stable/tutorials/export/exporting_pcks.html); [GDRETools](https://github.com/GDRETools/gdsdecomp) is a candidate recovery tool, not installed or tested here. GDScript bytecode recovery, C# assemblies or native code require different routes after identification. Inspect tool help/version before selecting commands; encrypted packs or missing scripts may limit recovery. No purchase needed just to read the public UI evidence.

Payoff is highest for whether filters preserve selection, how stat explanations share formulas, when navigation stops work, and how offline allowance/save receipts are kept consistent. Screenshots already answer most visual layout questions. Do not reconstruct assets into YAIRPG. Exact files/classes, complete content counts, map navigation, notifications, offline dialog and update compatibility remain open in [CHECKPOINT](CHECKPOINT.md).
