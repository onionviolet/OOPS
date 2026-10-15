You are lane `mw-kingdom-hearts` in the YAIRPG multi-world research dispatch of 2026-10-14.
Repo: /Users/weiwei/code/yet-another-idle-rpg (main checkout, read-only for you except your output dir).
Read first: docs/gm/dispatch/game-research-wave-2026-10-14/COMMON.md (hard rules, output shape) and docs/gm/dispatch/game-research-wave-2026-10-14/ASPECTS.md (aspect standard). They govern this prompt.
Output dir (the only repo path you may write): `docs/research/kingdom-hearts/`
Work area: `~/.codex/research/mw-kingdom-hearts/`
Weibao, 2026-10-14: "send out stuff for https://github.com/zenorogue/hyperrogue/ ... https://www.retromud.org/frames/main_home.html? https://3k.org/realms/index.php? We can learn from some of the ui from https://store.steampowered.com/app/4122910/Multiverse_Idle/ Send out deep decompilers and auditors, Remanant 2 and Kingdom hearts are still installing". He compared YAIRPG (a traveler living in many worlds with their own power systems and careers) against Siralim Ultimate, Remnant II, Kingdom Hearts, HyperRogue and The Strange (tabletop).

## The YAIRPG question for every lane
How does this source make **different worlds or places play differently**, and how does one traveler carry growth, items, powers and relationships across them? Read the YAIRPG owners first (don't edit them): `docs/worlds/WORLD_CORE_KIT_SUCCESSOR_2026-10-14.md`, `docs/worlds/WORLD_CORE_KIT_2026-10-14.md` (K1-K34 topic map), `docs/NESTED_WORLDS_AND_DEEP_TROPE_CHAINS_2026_10_05.md`, `docs/research/START_AND_BRANCH_INTEGRATION_MAP_2026-10-14.md`, and `docs/research/cross-game-synthesis-2026-10-14/REPORT.md`. Map findings to kit parts (K codes) and existing synthesis packets; mark new ones.

Write the standard game-lane outputs (REPORT, FINDINGS, IMPLEMENTATION_PACKETS, SMALL_TOUCHES, TOOLING, CHECKPOINT) and an `aspects-2026-10-14/` folder (A01-A12, SYSTEM_INVENTORY, DEEPER_SYSTEMS) where the source supports it.

## Source and payload gate
KINGDOM HEARTS -HD 1.5+2.5 ReMIX-, Steam 2552430, installing at `~/Library/Application Support/Steam/steamapps/common/KINGDOM HEARTS -HD 1.5+2.5 ReMIX-/`. A watcher starts this lane when Steam reports it fully installed. Read-only; never run it.
## Route
The OpenKH project (github.com/OpenKH) documents and parses the PC archives (.hed/.pkg) and KH1/KH2 file formats; build its CLI tools from source with the local dotnet. Prefer documented formats and tables over binary RE; REA only for a named native question.
## Deep questions
1. **Visiting established settings:** how each Disney world is defined (world IDs, rooms, party members per world, world-specific forms or rules such as Atlantica swimming or Halloween Town costumes), and how the game keeps the protagonist's growth constant while each world changes presentation and rules.
2. **Progression across worlds:** levels, abilities, keyblades, summons, drive forms, Gummi routes; what is world-gated.
3. **Story delivery:** cutscene and event scripting, world revisits and changed states.
4. Note how KH1 and KH2 differ in this; other titles in the collection only if cheap.
