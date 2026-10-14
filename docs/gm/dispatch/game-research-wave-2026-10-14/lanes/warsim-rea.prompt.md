You are lane `warsim-rea` in the YAIRPG game research wave of 2026-10-14.
Repo: /Users/weiwei/code/yet-another-idle-rpg (main checkout, read-only for you except your output dir).
Read first: docs/gm/dispatch/game-research-wave-2026-10-14/COMMON.md (hard rules, output shape, done check). It governs this prompt.
Output dir (the only repo path you may write): `docs/research/warsim/pass-2026-10-14-rea/`
Work area: `~/.codex/research/warsim-rea/`

## Source
Warsim: The Realm of Aslona, Steam 659540, `Warsim.exe` is a native PE32+ x86-64 console program (C++). Prior lane: `docs/research/warsim/` (PARTIAL; exact formulas, event weights and persistence unread). Read the prior lane's REPORT, CHECKPOINT (its unread table is your task list), TOOLING and FINDINGS first. Reuse its private work area (named in its CHECKPOINT) read-only; don't redo finished reads. Write only your new output dir.

## REA (reverse-engineering MCP over Ghidra)
REA 6.4.0 is already built from pinned source `morluto/rea` `bb540826` at `~/.codex/research/hogwarts-legacy/repos/rea-pinned/` (dist built; local patch `~/.codex/research/hogwarts-legacy/notes/rea-local-patch.diff`). Read `docs/research/hogwarts-legacy/REA_TRIAL.md` and the REA rows of that lane's TOOLING.md first: they record the launch command, the Python MCP client, bounded import (no full auto-analysis) and timing method. Reuse that build read-only; copy the client script into your work area. Ghidra 12.1.4 headless: `/opt/homebrew/opt/ghidra/libexec/support/analyzeHeadless`, Java 21 via explicit JAVA_HOME. Analyze only the functions a named question needs. Record time, RAM and effort for REA versus a direct Ghidra script on at least one chain, as a second data point for [tool fit D2](../../../research/REVERSE_ENGINEERING_TOOL_FIT_2026-10-13.md); write it as `REA_TRIAL.md`.

## Questions (from the prior unread table)
1. Event dispatch: how RandomTurnEvent, RandomExploreEvent and ProcGenExplo choose an event (weights, conditions, cooldowns). Trace one named petition end to end.
2. Exact economy, army and battle formulas: income, upkeep, recruitment, battle resolution, arena.
3. Name and lore generators: the full NameMaker / NameWriter / FactionNameGenerator resolver and how `Data/Names/*.txt` feeds it.
4. Save format and what persists.
5. Update `PROVINCE_WAR_FIT.md` for Province War where exact formulas change the fit.
