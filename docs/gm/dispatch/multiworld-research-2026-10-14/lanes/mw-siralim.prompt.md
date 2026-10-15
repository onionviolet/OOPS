You are lane `mw-siralim` in the YAIRPG multi-world research dispatch of 2026-10-14.
Repo: /Users/weiwei/code/yet-another-idle-rpg (main checkout, read-only for you except your output dir).
Read first: docs/gm/dispatch/game-research-wave-2026-10-14/COMMON.md (hard rules, output shape) and docs/gm/dispatch/game-research-wave-2026-10-14/ASPECTS.md (aspect standard). They govern this prompt.
Output dir (the only repo path you may write): `docs/research/siralim-ultimate/`
Work area: `~/.codex/research/mw-siralim/`
Weibao, 2026-10-14: "send out stuff for https://github.com/zenorogue/hyperrogue/ ... https://www.retromud.org/frames/main_home.html? https://3k.org/realms/index.php? We can learn from some of the ui from https://store.steampowered.com/app/4122910/Multiverse_Idle/ Send out deep decompilers and auditors, Remanant 2 and Kingdom hearts are still installing". He compared YAIRPG (a traveler living in many worlds with their own power systems and careers) against Siralim Ultimate, Remnant II, Kingdom Hearts, HyperRogue and The Strange (tabletop).

## The YAIRPG question for every lane
How does this source make **different worlds or places play differently**, and how does one traveler carry growth, items, powers and relationships across them? Read the YAIRPG owners first (don't edit them): `docs/worlds/WORLD_CORE_KIT_SUCCESSOR_2026-10-14.md`, `docs/worlds/WORLD_CORE_KIT_2026-10-14.md` (K1-K34 topic map), `docs/NESTED_WORLDS_AND_DEEP_TROPE_CHAINS_2026_10_05.md`, `docs/research/START_AND_BRANCH_INTEGRATION_MAP_2026-10-14.md`, and `docs/research/cross-game-synthesis-2026-10-14/REPORT.md`. Map findings to kit parts (K codes) and existing synthesis packets; mark new ones.

Write the standard game-lane outputs (REPORT, FINDINGS, IMPLEMENTATION_PACKETS, SMALL_TOUCHES, TOOLING, CHECKPOINT) and an `aspects-2026-10-14/` folder (A01-A12, SYSTEM_INVENTORY, DEEPER_SYSTEMS) where the source supports it.

## Source
Siralim Ultimate, Steam 1289810, installed natively: `~/Library/Application Support/Steam/steamapps/common/Siralim Ultimate/SiralimUltimate.app` (GameMaker: `Contents/Resources/game.ios` data archive plus native `Contents/MacOS/SiralimUltimate`). Read-only; never run the game.
## Route
Identify GameMaker runtime and whether code is VM bytecode or YYC native. VM: UndertaleModTool's cross-platform CLI (UndertaleModCli) built from source with the local dotnet (`~/.dotnet`), dump scripts, objects, strings and data tables. YYC: dump data and strings, then REA over Ghidra for named functions only (see `docs/research/hogwarts-legacy/REA_TRIAL.md`). Record which.
## Deep questions
1. **Realms:** how each realm differs (realm properties, enemy pools, realm-specific mechanics, instability), how realm depth scales, and how realm data is authored.
2. **Creature traits and builds:** trait data model, fusion and trait combining, specializations, artifacts and how combinations stay computable.
3. **Carry-over:** castle, progression across depths, what one traveler keeps between realms.
4. **UI:** how a huge build space is shown on desktop (inspectors, tooltips, search, comparison).
