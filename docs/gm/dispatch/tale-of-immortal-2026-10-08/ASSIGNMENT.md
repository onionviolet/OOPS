# Tale of Immortal: extract properly, then audit for the life sim

Dispatched 2026-10-08 by Claude Code at Weibao's request: "send codex to
extract tales of immortal, properly". Personal-use reconstruction is
authorized (vault `Game_Idea_Bank.md`, 2026-10-05).

Read first: AGENTS.md, PROJECT.md, [the north star](../../../LIFE_SIM_NORTH_STAR.md)
and the previous game-audit method in
[life-sim-sources-2026-10-07](../life-sim-sources-2026-10-07/ASSIGNMENT.md)
(copy, hash, coverage and reporting rules). That wave recorded Tale of
Immortal as blocked; it is now installed.

## The install (checked 2026-10-08)

- Steam app 1468810, folder
  `~/Library/Application Support/Steam/steamapps/common/鬼谷八荒` (about
  27 GB), manifest present.
- **IL2CPP Unity build:** `GameAssembly.dll` plus
  `guigubahuang_Data/il2cpp_data/Metadata/global-metadata.dat`.
- MelonLoader is already present with Cpp2IL output under
  `MelonLoader/Dependencies/Il2CppAssemblyGenerator/Cpp2IL/cpp2il_out/` and
  `MelonLoader/Managed/`. Those are type and signature stubs, not method
  bodies.
- Official mod folders exist (`Mod/`, `ModExportData/`, `Mods/`), including
  a modding template. Game data tables (config sheets, text) may be the
  richest source.
- **Weibao's install is his:** MelonLoader, mods and `UserData/` may be his
  own setup. Read only. Never modify, delete or move anything in the game
  folder, never touch saves, never launch the game, and **do not uninstall**
  (unlike the earlier wave; Weibao decides).
- Disk is tight (about 23 GB free). Do not copy the whole 27 GB install.
  Copy only what the audit needs (metadata, `GameAssembly.dll`, stubs,
  config and text tables, mod templates) to
  `~/.codex/research/tale-of-immortal/`, hash-matched.

## Extraction, properly

1. Inventory the install: engine version, data layout, asset bundles,
   config tables, localization, mod template docs.
2. Recover types and method signatures from IL2CPP (Il2CppDumper or Cpp2IL;
   install tools under `~/.codex/research/tools/` if needed). Where logic
   matters, recover method bodies with Cpp2IL analysis or a disassembler on
   the specific methods only.
3. Extract config and text tables (realms, aptitude, techniques, NPC
   generation, events, sects, items, monsters) into readable files.
4. Record what was recovered, what remains opaque, and hashes in
   `~/.codex/research/tale-of-immortal/RETENTION.json` and an extraction
   receipt.

## Audit lens

Use [LIFE_SIM_NORTH_STAR.md](../../../LIFE_SIM_NORTH_STAR.md) and
[WORLD_CARDS.md](../../../WORLD_CARDS.md). Questions:

1. **NPC lives:** how NPCs are generated, age, cultivate, form relationships,
   marry, have children, join sects, die, and remember the player; how the
   world simulates people you aren't watching, and at what cost.
2. **Cultivation and aptitude:** realms, breakthroughs, failure, aptitude and
   root systems, how aptitude changes, techniques and their growth.
3. **Sects and factions:** recruitment, ranks, duties, wars, the player
   founding or leading one, followers and disciples.
4. **Events and the director:** random and scheduled events, opportunities,
   encounters, pacing.
5. **Ancient monsters and plans:** world bosses, sealed beings, any revival
   or inheritance plans, world-scale timelines.
6. **Life and death:** lifespan, life extension, death, reincarnation or
   legacy.
7. **Work and economy:** jobs, crafting, trade, prices.
8. **Twenty or more small touches,** each mapped to vanilla YAIR.
9. **Save size and history:** how a long world history is stored.

## Output

Under `docs/research/tale-of-immortal/` (match the earlier waves: INTAKE,
REPORT, FINDINGS, COVERAGE, IMPLEMENTATION_PACKETS, CHECKPOINT):
1. A short plain-language REPORT first.
2. Five to ten ranked proposals for the north star. Proposals are not
   decisions, and implementation packets are not authorization to build.
3. Don't edit `src/`, build or commit. Keep a CHECKPOINT so a context
   refresh can resume.
