You are lane `mw-hyperrogue` in the YAIRPG multi-world research dispatch of 2026-10-14.
Repo: /Users/weiwei/code/yet-another-idle-rpg (main checkout, read-only for you except your output dir).
Read first: docs/gm/dispatch/game-research-wave-2026-10-14/COMMON.md (hard rules, output shape) and docs/gm/dispatch/game-research-wave-2026-10-14/ASPECTS.md (aspect standard). They govern this prompt.
Output dir (the only repo path you may write): `docs/research/hyperrogue/`
Work area: `~/.codex/research/mw-hyperrogue/`
Weibao, 2026-10-14: "send out stuff for https://github.com/zenorogue/hyperrogue/ ... https://www.retromud.org/frames/main_home.html? https://3k.org/realms/index.php? We can learn from some of the ui from https://store.steampowered.com/app/4122910/Multiverse_Idle/ Send out deep decompilers and auditors, Remanant 2 and Kingdom hearts are still installing". He compared YAIRPG (a traveler living in many worlds with their own power systems and careers) against Siralim Ultimate, Remnant II, Kingdom Hearts, HyperRogue and The Strange (tabletop).

## The YAIRPG question for every lane
How does this source make **different worlds or places play differently**, and how does one traveler carry growth, items, powers and relationships across them? Read the YAIRPG owners first (don't edit them): `docs/worlds/WORLD_CORE_KIT_SUCCESSOR_2026-10-14.md`, `docs/worlds/WORLD_CORE_KIT_2026-10-14.md` (K1-K34 topic map), `docs/NESTED_WORLDS_AND_DEEP_TROPE_CHAINS_2026_10_05.md`, `docs/research/START_AND_BRANCH_INTEGRATION_MAP_2026-10-14.md`, and `docs/research/cross-game-synthesis-2026-10-14/REPORT.md`. Map findings to kit parts (K codes) and existing synthesis packets; mark new ones.

Write the standard game-lane outputs (REPORT, FINDINGS, IMPLEMENTATION_PACKETS, SMALL_TOUCHES, TOOLING, CHECKPOINT) and an `aspects-2026-10-14/` folder (A01-A12, SYSTEM_INVENTORY, DEEPER_SYSTEMS) where the source supports it.

## Source
HyperRogue, open source (GPL): https://github.com/zenorogue/hyperrogue. Shallow-clone into your work area and pin the commit. Read the C++ statically; no build needed (build only if a question needs it, never run network code).
## Deep questions
1. **Lands:** the land list, how each land's unique mechanic is implemented (land type enums, per-land generation, monsters, items, treasure rules), and how lands unlock (treasure thresholds, Orb of Yendor, Hyperstone).
2. **Boundaries and interactions:** how land borders are generated (great walls, barriers, land placement on the hyperbolic tiling), and how mechanics interact when two lands meet or when an item from one land is used in another (orbs carried between lands).
3. **Carry-over:** what the player keeps across lands (orbs, treasures, kill counts) and how the game keeps a run legible.
4. Achievement and mode structure (Chaos mode, Pure Tactics, shmup) as alternate rule sets over the same lands.
