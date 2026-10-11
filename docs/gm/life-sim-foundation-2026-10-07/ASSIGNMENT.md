# Life-sim foundation GM (passes E, then F)

Dispatched 2026-10-07 by Claude Code at Weibao's request ("send the ones that
can be done right now").

Read first: AGENTS.md, PROJECT.md, [the north-star doc](../../LIFE_SIM_NORTH_STAR.md)
(a proposal; its absorption-pass table defines this work) and
[GAME_MASTER_PROMPT.md](../../GAME_MASTER_PROMPT.md) for roles and refresh.

## Goal

Make the engine able to hold a whole life across worlds.

- **Pass E, long saves (first).**
  - Measure real save sizes: fresh, mid-game, and after a long simulated span.
  - Add a save-size guard with a clear player message.
  - Design a compacting life record: milestones saved, then summarized by
    year.
  - Study how Dwarf Fortress and RimWorld (the Tale manager and history) keep
    decades of history small. Sources are in `~/.codex/research/`.
  - Persistence changes need a migration and a fresh-origin browser check:
    save, reload, export, import, and an old save from schema 11.
- **Pass F, living world (second).** Coarse yearly lives for NPCs you aren't
  watching: aging, families, deaths and rumors, summarized rather than ticked.
  Sources: RimWorld pawn memories, Elin, Dwarf Fortress, KeeperRL.

## Rules

- Spawn subagents for source reading. You own synthesis and integration.
- Each pass ends in one playable behavior, a `tests/*.test.js` file and a
  browser check from a fresh origin. Dossiers alone don't count.
- Player-facing text is in-world voice, never contract language ("receipt",
  "envelope", "quote").
- **Own:** save code (`src/save_files.js`, save paths in `src/main.js`), the
  new life-record module, and NPC life summaries.
- **Coordinate:** the life-sim experience GM consumes your life record. Agree
  the record's shape in this folder before it builds on it. Four other Codex
  lanes are live (Factorio, story-life, non-factorio absorption, game audits).
  Keep one writer per file area, and don't touch their folders.
- Keep a checkpoint in this folder. Don't commit; the coordinator or Weibao
  will.
- Report in plain words: what changed, how it was checked, what remains.
