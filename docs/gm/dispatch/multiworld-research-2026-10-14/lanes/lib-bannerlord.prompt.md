You are lane `lib-bannerlord` in the YAIRPG multi-world research dispatch of 2026-10-14.
Repo: /Users/weiwei/code/yet-another-idle-rpg (main checkout, read-only for you except your output dir).
Read first: docs/gm/dispatch/game-research-wave-2026-10-14/COMMON.md (hard rules, output shape) and docs/gm/dispatch/game-research-wave-2026-10-14/ASPECTS.md (aspect standard). They govern this prompt.
Output dir (the only repo path you may write): `docs/research/mount-and-blade-2-bannerlord/`
Work area: `~/.codex/research/lib-bannerlord/`
Weibao, 2026-10-14: "send out stuff for https://github.com/zenorogue/hyperrogue/ ... https://www.retromud.org/frames/main_home.html? https://3k.org/realms/index.php? We can learn from some of the ui from https://store.steampowered.com/app/4122910/Multiverse_Idle/ Send out deep decompilers and auditors, Remanant 2 and Kingdom hearts are still installing". He compared YAIRPG (a traveler living in many worlds with their own power systems and careers) against Siralim Ultimate, Remnant II, Kingdom Hearts, HyperRogue and The Strange (tabletop).

## The YAIRPG question for every lane
How does this source make **different worlds or places play differently**, and how does one traveler carry growth, items, powers and relationships across them? Read the YAIRPG owners first (don't edit them): `docs/worlds/WORLD_CORE_KIT_SUCCESSOR_2026-10-14.md`, `docs/worlds/WORLD_CORE_KIT_2026-10-14.md` (K1-K34 topic map), `docs/NESTED_WORLDS_AND_DEEP_TROPE_CHAINS_2026_10_05.md`, `docs/research/START_AND_BRANCH_INTEGRATION_MAP_2026-10-14.md`, and `docs/research/cross-game-synthesis-2026-10-14/REPORT.md`. Map findings to kit parts (K codes) and existing synthesis packets; mark new ones.

Write the standard game-lane outputs (REPORT, FINDINGS, IMPLEMENTATION_PACKETS, SMALL_TOUCHES, TOOLING, CHECKPOINT) and an `aspects-2026-10-14/` folder (A01-A12, SYSTEM_INVENTORY, DEEPER_SYSTEMS) where the source supports it.

## Source and payload gate
Mount & Blade II: Bannerlord, in Weibao's Steam library, not yet installed. The watcher starts this lane when Steam reports it fully installed under `~/Library/Application Support/Steam/steamapps/common/`. Read-only; never run it.
## Route
Managed C# (`bin/Win64_Shipping_Client/TaleWorlds.*.dll`, `Modules/*/bin`) with ilspycmd, plus module XML. Windows-only (notproton). About 60 GB.
## Deep questions
Clans, marriage, pregnancy, children, aging, death and heirs (bodies and genetics BW rows); companions and their skills; kingdoms, policies and settlements for Province War (write PROVINCE_WAR_FIT.md); workshops and caravans (chains).
Also run the aspect pass (A01-A12) into `docs/research/mount-and-blade-2-bannerlord/aspects-2026-10-14/`.
