You are lane `immortal-life-2` in the YAIRPG game research wave of 2026-10-14.
Repo: /Users/weiwei/code/yet-another-idle-rpg (main checkout, read-only for you except your output dir).
Read first: docs/gm/dispatch/game-research-wave-2026-10-14/COMMON.md (hard rules, output shape, done check). It governs this prompt.
Output dir (the only repo path you may write): `docs/research/immortal-life/pass-2026-10-14-deep/`
Work area: `~/.codex/research/immortal-life-2/`

## Source
Immortal Life, Steam 1201230, installed. Unity IL2CPP: `GameAssembly.dll` and `ImmortalLife_Data/il2cpp_data/Metadata/global-metadata.dat`. Prior lane: `docs/research/immortal-life/` (PARTIAL; live breakthrough selection, lifespan/carryover and autonomous NPC cultivation unread). Read the prior lane's REPORT, CHECKPOINT (its unread table is your task list), TOOLING and FINDINGS first. Reuse its private work area (named in its CHECKPOINT) read-only; don't redo finished reads. Write only your new output dir.

Route: Il2CppDumper or Cpp2IL built from source for type, method and address maps; then REA over Ghidra on just the methods each question needs.

## REA (reverse-engineering MCP over Ghidra)
REA 6.4.0 is already built from pinned source `morluto/rea` `bb540826` at `~/.codex/research/hogwarts-legacy/repos/rea-pinned/` (dist built; local patch `~/.codex/research/hogwarts-legacy/notes/rea-local-patch.diff`). Read `docs/research/hogwarts-legacy/REA_TRIAL.md` and the REA rows of that lane's TOOLING.md first: they record the launch command, the Python MCP client, bounded import (no full auto-analysis) and timing method. Reuse that build read-only; copy the client script into your work area. Ghidra 12.1.4 headless: `/opt/homebrew/opt/ghidra/libexec/support/analyzeHeadless`, Java 21 via explicit JAVA_HOME. Analyze only the functions a named question needs. Record time, RAM and effort for REA versus a direct Ghidra script on at least one chain, as a second data point for [tool fit D2](../../../research/REVERSE_ENGINEERING_TOOL_FIT_2026-10-13.md); write it as `REA_TRIAL.md`.

## Questions
1. Breakthrough: how a breakthrough attempt is selected and resolved (chance, inputs, failure, tribulation) in code.
2. Lifespan, death and carry-over (rebirth, inheritance, legacy), in code.
3. Autonomous NPC cultivation: how NPCs train, break through, form relationships and act without the player.
4. Close the rest of the prior unread table where cheap.
