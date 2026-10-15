You are lane `lib-zhutian` in the YAIRPG multi-world research dispatch of 2026-10-14.
Repo: /Users/weiwei/code/yet-another-idle-rpg (main checkout, read-only for you except your output dir).
Read first: docs/gm/dispatch/game-research-wave-2026-10-14/COMMON.md (hard rules, output shape) and docs/gm/dispatch/game-research-wave-2026-10-14/ASPECTS.md (aspect standard). They govern this prompt.
Output dir (the only repo path you may write): `docs/research/zhutian-shuabao-lu/`
Work area: `~/.codex/research/lib-zhutian/`
Weibao, 2026-10-14: "send out stuff for https://github.com/zenorogue/hyperrogue/ ... https://www.retromud.org/frames/main_home.html? https://3k.org/realms/index.php? We can learn from some of the ui from https://store.steampowered.com/app/4122910/Multiverse_Idle/ Send out deep decompilers and auditors, Remanant 2 and Kingdom hearts are still installing". He compared YAIRPG (a traveler living in many worlds with their own power systems and careers) against Siralim Ultimate, Remnant II, Kingdom Hearts, HyperRogue and The Strange (tabletop).

## The YAIRPG question for every lane
How does this source make **different worlds or places play differently**, and how does one traveler carry growth, items, powers and relationships across them? Read the YAIRPG owners first (don't edit them): `docs/worlds/WORLD_CORE_KIT_SUCCESSOR_2026-10-14.md`, `docs/worlds/WORLD_CORE_KIT_2026-10-14.md` (K1-K34 topic map), `docs/NESTED_WORLDS_AND_DEEP_TROPE_CHAINS_2026_10_05.md`, `docs/research/START_AND_BRANCH_INTEGRATION_MAP_2026-10-14.md`, and `docs/research/cross-game-synthesis-2026-10-14/REPORT.md`. Map findings to kit parts (K codes) and existing synthesis packets; mark new ones.

Write the standard game-lane outputs (REPORT, FINDINGS, IMPLEMENTATION_PACKETS, SMALL_TOUCHES, TOOLING, CHECKPOINT) and an `aspects-2026-10-14/` folder (A01-A12, SYSTEM_INVENTORY, DEEPER_SYSTEMS) where the source supports it.

## Source
诸天刷宝录 (Zhutian Shuabao Lu, roughly "Record of looting the myriad worlds"), Steam 2776450, installed at `~/Library/Application Support/Steam/steamapps/common/诸天刷宝录/` (618 MB, Windows: `game.exe` with Chromium libraries, `icons.json`, `dlc/`). Likely NW.js or Electron, so game logic is JavaScript (`package.nw`, `resources/app.asar`, or loose `www/` or `js/` folders; RPG Maker MV/MZ also ships this way). Unpack read-only in your work area; deobfuscate if needed; never run `game.exe`. Chinese text: paraphrase in English.
## Deep questions
1. **Myriad worlds:** how the game models many worlds (诸天), how a world is entered, what each world changes, and how loot and growth carry between worlds. This is the closest genre match to YAIRPG's traveler; compare with `docs/research/multiworld-synthesis-2026-10-14/REPORT.md`.
2. **Idle and loot loop:** farming (刷宝) rates, drop tables, item tiers, offline gains, prestige or rebirth.
3. **Power systems per world:** whether each world has its own cultivation or power ladder and how the character combines them.
4. Engine, data tables, save format (A03, A04) and UI on a desktop screen (A06).
Also run the aspect pass (A01-A12) into `docs/research/zhutian-shuabao-lu/aspects-2026-10-14/`.
