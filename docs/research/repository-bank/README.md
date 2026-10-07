# YAIR repository bank

Type: REFERENCE-INVENTORY. Audience: YAIR game masters and source readers.

Saved 2026-10-05 from the human-authorized repository research in chat `01a10ca4-204a-7370-8473-6ae95f747125`. [SOURCES.json](SOURCES.json) owns the complete inventory, source URLs, collected revisions, seed-file evidence, access limits and reference works. It contains 30 source repositories and nine related works. Those works are references, not claimed open-source repositories or downloaded commercial games/books.

The local bank uses shallow, filtered bare Git mirrors outside the game checkout. It saves default-head commit/tree objects and selected source blobs without running upstream code. It is not a complete offline copy, all-branch audit or gameplay verification. Portable rows identify mirrors by cache key; the device cache root is `~/.cache/yairpg-repository-bank/2026-10-05/`. A local `LOCAL_CACHE.json` there records the actual device path. Collection failures remain in the inventory for the GM to resolve through another official source or report precisely.

[collect_sources.py](collect_sources.py) is the task-authored collection helper. It disables interactive authentication and Git hooks, does not check out or run third-party projects, preserves an existing matching mirror, and writes final collection evidence atomically. Use `python3 docs/research/repository-bank/collect_sources.py` to collect pending sources or read matching saved mirrors. Existing mirrors remain pinned; this is not a refresh command.

## Review and ownership

The requested [Repository GM assignment](../../gm/world-implementation/second-pass/repository-bank-absorption/ASSIGNMENT.md) owns the new cross-game comparison. The bank is acquisition evidence. The GM's COVERAGE/FINDINGS/REPORT/CHECKPOINT will own what was actually inspected and what could be absorbed. Neither saved links nor cached source establish a completed review or a selected implementation.

Existing [selective engine absorption](../../gm/world-implementation/second-pass/engine-absorption/REPORT.md), [YAIR fork-network review](../../gm/world-implementation/second-pass/fork-network-absorption/REPORT.md), [niche references](../../NICHE_GAME_REFERENCES.md) and [idle-game comparisons](../../RESEARCH_IDLE_GAMES.md) retain their own findings. The new role checks their relevant evidence and extends it rather than changing their status or rewriting their reports. PROJECT/USER_VISION/canonical plan reconciliation remains with the current project coordinator; native source/UI/save/build integration remains with Engine.

## Starting hypotheses to verify

Prior source research suggested five connected absorption families. These are research inputs, not accepted mechanics or proof of the collected default heads:

1. NetHack/xNetHack: usable object interactions, per-character discovery and situational monster use of actual inventory.
2. ToME/Angband/Crawl: function-changing mastery, composable effects, separate power sources and explicit execution blockers.
3. FrogComposband: body-dependent powers, possession costs and separately implemented monster evolution.
4. QuestJS/CoffeeMUD/OpenNefia/CDDA: attack-effect composition, finite NPC agendas, teaching, professions, real materials and institutional work.
5. Wesnoth/Wildermyth plus qualified narrative tools: retained campaign decisions, recurrent people, branching episodes and host-owned consequence settlement.

Progression/automation candidates Arcanum, Idle Loops, Progress Knight and Evolve remain part of the complete comparison, including their different core fantasies. Evennia/DFHack/Inform/rot.js and TextWorld benchmarks need specific fit judgments instead of automatic adoption. The archived OpenNefia prototype remains a historical comparator.

The manifest records corrections from source readback: the two OpenNefia repositories are distinct; YarnBound is third-party ISC JavaScript rather than the official C# runtime; its lookahead limitation concerns commands/set variables and dialogue-ending detection; possession does not prove observation-based acquisition; and rendered-page line numbers must be rechecked against actual source.

## Repository collection table

Collection completed: 30 of 30 repositories have pinned partial mirrors; no acquisition failures. Nine reference works remain separate. Selected seed files are saved where they exist at the collected default head; missing/moved seed paths remain explicit in SOURCES.json.

| Repository | Lane | Saved default head | Source files readable |
|---|---|---|---|
| [YAIR upstream](https://github.com/miktaew/yet-another-idle-rpg) | baseline | `e3356432ad51` | 3/3 seeds |
| [YAIR development](https://github.com/miktaew/yet-another-idle-rpg-dev) | baseline | `af47a8e9b112` | 3/3 seeds |
| [Arcanum / Theory of Magic original](https://gitlab.com/mathiashjelm/arcanum) | progression | `a2632d2edf3e` | 2/2 seeds |
| [Arcanum testing lineage](https://gitlab.com/arcanumtesting/arcanum) | progression | `2ebb89a9e943` | 2/2 seeds |
| [Idle Loops Lloyd fork](https://github.com/lloyd-delacroix/omsi-loops) | automation | `5008c4a1faca` | 3/3 seeds |
| [Idle Loops Omsi source lineage](https://github.com/omsi6/omsi6.github.io) | automation | `fa21477d424f` | 3/3 seeds |
| [Progress Knight Quest](https://github.com/indomit/progress_knight_2) | progression | `d03f8b65addd` | 2/2 seeds |
| [Evolve](https://github.com/pmotschmann/Evolve) | progression | `3436358dcd03` | 2/3 seeds |
| [CoffeeMUD](https://github.com/bozimmerman/CoffeeMud) | living-world | `720aec631f79` | 4/4 seeds |
| [OpenNefia current C# repository](https://github.com/OpenNefia/OpenNefia) | living-world | `d8410b3e5984` | 4/4 seeds |
| [OpenNefia archived Lua prototype](https://github.com/Ruin0x11/OpenNefia) | historical | `dbe3eaa38fb8` | 2/2 seeds |
| [Cataclysm: Dark Days Ahead](https://github.com/CleverRaven/Cataclysm-DDA) | living-world | `09a75ac67df6` | 4/4 seeds |
| [DFHack](https://github.com/DFHack/dfhack) | simulation-tools | `c872dc4c64c5` | 1/2 seeds |
| [NetHack](https://github.com/NetHack/NetHack) | interactions | `a9f93bb008ea` | 5/5 seeds |
| [xNetHack](https://github.com/copperwater/xNetHack) | interactions | `6eef39403f16` | 3/3 seeds |
| [Tales of Maj Eyal / T-Engine4](https://git.net-core.org/tome/t-engine4) | powers | `4b39a195a44e` | 3/3 seeds |
| [Angband](https://github.com/angband/angband) | powers | `a7f492e382eb` | 3/3 seeds |
| [Dungeon Crawl Stone Soup](https://github.com/crawl/crawl) | powers | `ea3290465564` | 3/3 seeds |
| [FrogComposband](https://github.com/sulkasormi/frogcomposband) | bodies-origins | `3d28f6b1d28a` | 3/4 seeds |
| [QuestJS](https://github.com/ThePix/QuestJS) | browser-authoring | `72fef6a7315b` | 5/5 seeds |
| [Battle for Wesnoth](https://github.com/wesnoth/wesnoth) | campaigns | `30130b779e72` | 3/3 seeds |
| [Evennia](https://github.com/evennia/evennia) | living-world | `a89a9b94e4d7` | 3/3 seeds |
| [Yarn Spinner core](https://github.com/YarnSpinnerTool/YarnSpinner) | narrative | `dd8d9b4f7b75` | 3/3 seeds |
| [YarnBound third-party browser runtime](https://github.com/mnbroatch/yarn-bound) | narrative | `636848a2d33f` | 2/3 seeds |
| [Ink authoring/compiler](https://github.com/inkle/ink) | narrative | `35c63e52f1d3` | 2/2 seeds |
| [inkjs browser runtime](https://github.com/y-lohse/inkjs) | narrative | `6b1153410ab1` | 2/3 seeds |
| [rot.js](https://github.com/ondras/rot.js) | spatial-tools | `46782e248c2d` | 3/3 seeds |
| [Inform](https://github.com/ganelson/inform) | interaction-authoring | `5c7ba42b74db` | 2/2 seeds |
| [Microsoft TextWorld](https://github.com/microsoft/TextWorld) | exploratory-benchmark | `6d88a0845bc9` | 2/2 seeds |
| [TextWorldExpress](https://github.com/cognitiveailab/TextWorldExpress) | exploratory-benchmark | `db0e6c09802a` | 2/2 seeds |

## Related works

| Reference | Research focus |
|---|---|
| [Elin](https://store.steampowered.com/app/2135150/Elin/) | Whole-life sandbox, professions, homes and towns; game reference, not OpenNefia source. |
| [Soulash 2](https://store.steampowered.com/app/2399160/Soulash_2/) | Settlements, crafting, activity progression, family/world persistence. |
| [Caves of Qud](https://store.steampowered.com/app/333640/Caves_of_Qud/) | Actor bodies, possession, factions, material interactions, authored/procedural hybrid. |
| [Dwarf Fortress](https://store.steampowered.com/app/975370/Dwarf_Fortress/) | Civilizations, independent lives, culture and embodied adventure; DFHack is a separate tool repository. |
| [Wildermyth](https://wildermyth.com/) | Histories, relationships, body changes, campaign/legacy authoring. |
| [GURPS Infinite Worlds](https://warehouse23.com/products/gurps-infinite-worlds) | Cross-setting characters, world rules, alternate timelines; tabletop reference, no software source claimed. |
| [Cavernous II](https://nucaranlaeg.github.io/incremental/CavernousII/) | Per-character queues, coordination, route planning, realms. |
| [Proto23](https://github.com/miktaew/yet-another-idle-rpg) | YAIR acknowledged inspiration; investigate available creator/source links. |
| [Your Chronicle](https://store.steampowered.com/app/1546320/Your_Chronicle/) | Existing YAIR comparison: story unlocks, automation, summoned companions and endings. |
