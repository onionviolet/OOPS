# Novel source GM: Speedrunning the Multiverse, books 1-4

Dispatched 2026-10-07 by Claude Code. Weibao: "I meant speedrunning the
multiverse as the RR novel, as a reference, I just downloaded books 1-4 for
auditing."

Follow [NOVEL_SOURCE_GM_PROMPT.md](../../NOVEL_SOURCE_GM_PROMPT.md) and
AGENTS.md. In short:
- Read the supplied books in full.
- Never modify the source files.
- Never commit raw prose. All derived notes go in the gitignored
  `docs/research/novels/`.

## Sources (in `~/Downloads/`, read-only)

The four "Speedrunning the Multiverse" epubs by Adastra339, books 1-4. The
filenames begin with `Speedrunning the Multiverse`.

## Lens

Weibao's frame is a life sim across a multiverse; see
[LIFE_SIM_NORTH_STAR.md](../../../LIFE_SIM_NORTH_STAR.md). Answer through
these questions:

1. **Run structure.** How does a "run" across worlds work: what resets, what
   carries, and why does it get faster each time?
2. **Life progression.** How long lives or runs are, how pacing changes
   across books, and what makes repeating fun instead of grinding.
3. **Carryover rules.** What carries between worlds and runs, and how
   gameplay or chance decides it.
4. **Life extension and body change.** Lifespan, body replacement, new
   bodies per world, and any limits or costs.
5. **Per-world power systems.** How each world's rules differ, and how the
   protagonist translates powers between them.
6. **The little stuff.** At least twenty small touches: system messages,
   running jokes, small rewards, quirks, recurring characters.
7. **Mapping to YAIR.** For each item, what vanilla YAIR system it could ride
   on and what would be new.

## Output

1. A short plain-language REPORT first, readable by Weibao in five minutes.
2. Then detailed findings and five to ten ranked implementation proposals,
   handed to the life-sim experience and foundation GMs
   (`docs/gm/life-sim-*-2026-10-07/`). The proposals are not decisions.
3. Use bounded subagents, one per book. Keep a checkpoint. Don't edit
   `src/`. Don't commit.
