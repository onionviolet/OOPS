You are lane `lib-rimworld-deep` in the YAIRPG multi-world research dispatch of 2026-10-14.
Repo: /Users/weiwei/code/yet-another-idle-rpg (main checkout, read-only for you except your output dir).
Read first: docs/gm/dispatch/game-research-wave-2026-10-14/COMMON.md (hard rules, output shape) and docs/gm/dispatch/game-research-wave-2026-10-14/ASPECTS.md (aspect standard). They govern this prompt.
Output dir (the only repo path you may write): `docs/research/rimworld/pass-2026-10-14-deep/`
Work area: `~/.codex/research/lib-rimworld-deep/`
Weibao, 2026-10-14: "send out stuff for https://github.com/zenorogue/hyperrogue/ ... https://www.retromud.org/frames/main_home.html? https://3k.org/realms/index.php? We can learn from some of the ui from https://store.steampowered.com/app/4122910/Multiverse_Idle/ Send out deep decompilers and auditors, Remanant 2 and Kingdom hearts are still installing". He compared YAIRPG (a traveler living in many worlds with their own power systems and careers) against Siralim Ultimate, Remnant II, Kingdom Hearts, HyperRogue and The Strange (tabletop).

## The YAIRPG question for every lane
How does this source make **different worlds or places play differently**, and how does one traveler carry growth, items, powers and relationships across them? Read the YAIRPG owners first (don't edit them): `docs/worlds/WORLD_CORE_KIT_SUCCESSOR_2026-10-14.md`, `docs/worlds/WORLD_CORE_KIT_2026-10-14.md` (K1-K34 topic map), `docs/NESTED_WORLDS_AND_DEEP_TROPE_CHAINS_2026_10_05.md`, `docs/research/START_AND_BRANCH_INTEGRATION_MAP_2026-10-14.md`, and `docs/research/cross-game-synthesis-2026-10-14/REPORT.md`. Map findings to kit parts (K codes) and existing synthesis packets; mark new ones.

Write the standard game-lane outputs (REPORT, FINDINGS, IMPLEMENTATION_PACKETS, SMALL_TOUCHES, TOOLING, CHECKPOINT) and an `aspects-2026-10-14/` folder (A01-A12, SYSTEM_INVENTORY, DEEPER_SYSTEMS) where the source supports it.

## Source
RimWorld 1.7.4979 (Steam 294100, build 25947168), installed natively at `~/Library/Application Support/Steam/steamapps/common/RimWorld/` with its DLCs. The prior dossier read 1.6; the aspect pass `docs/research/rimworld/aspects-2026-10-14/` just finished on 1.7 (read it and its CHECKPOINT unread table first; reuse its private work area read-only). Route: ilspycmd on `Assembly-CSharp.dll`, plus the Defs XML in `Data/` and each DLC folder.
## Deep questions (beyond the aspect pass)
1. **Odyssey and multiple maps:** gravships, planet layers or orbit, multiple active maps; how one colony moves between places with different rules (the multi-world question).
2. **Biotech:** genes, xenotypes, inheritance and germline versus xenogenes, children growing up and learning (growth moments, learning needs); maps to the genetics palette (BW, G rows) and P03.
3. **Ideology:** memes, precepts, roles and rituals as institution rules; how one belief system changes many systems (P07).
4. **Anomaly:** studying entities to unlock knowledge (research by study, containment); maps to technology RW rows.
5. **Work and production:** work priorities, bills with conditions ("do until X"), how a pawn reports why a job is not done (P01 blockers), and production chains (butchering, cooking, drugs, smelting).
6. **Storyteller:** incident eligibility, weights, cooldowns and population curves (P10).
