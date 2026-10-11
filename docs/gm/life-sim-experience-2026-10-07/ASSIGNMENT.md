# Life-sim experience GM (passes C and B, then A and D)

Dispatched 2026-10-07 by Claude Code at Weibao's request ("send the ones that
can be done right now").

Read first: AGENTS.md, PROJECT.md, [the north-star doc](../../LIFE_SIM_NORTH_STAR.md)
(a proposal; its absorption-pass table defines this work) and
[GAME_MASTER_PROMPT.md](../../GAME_MASTER_PROMPT.md) for roles and refresh.

## Goal

Make one character's life feel lived, starting from vanilla YAIR, which stays
intact and the default.

1. **Pass C, re-read what we have.** Read Your Chronicle, Amazing Cultivation
   Simulator, Elin, Rogue Legacy, Melvor and Orb of Creation, all in
   `~/.codex/research/`, through a life-sim lens: lifetimes, aging, rebirth,
   legacy.
2. **Pass B, a life (first playable slice).** On the existing lifespan clock
   (`src/chronicle.js`):
   - **Aging log voice.** The log reads breathless at 12, terse at 40,
     wistful at 80.
   - **Aging that changes play.** Youth learns faster, old age teaches.
   - **Death with a legacy.** A grave, an epitaph from the life's
     milestones, and one thing that carries to an heir.

   Show it through the side events panel: a Life view of milestones and a
   Heard view of gossip and missed events. This extends the original UI and
   adds no new window.
3. **Pass A, director.** A storyteller event director (RimWorld storytellers,
   Dwarf Fortress history) using the saved RNG, so reloads don't reroll.
4. **Pass D, memory and legend.** A memory-loss origin, gossip about your own
   deeds, and a legend that drifts after death. Sources: Caves of Qud, Dwarf
   Fortress legends.

## Rules

- Spawn subagents for source reading. You own synthesis and integration.
- Each pass ends in one playable behavior, a `tests/*.test.js` file and a
  browser check from a fresh origin. Dossiers alone don't count.
- **Player-facing text is in-world voice**, the character's life, never
  contract language. Prefer data-driven text over new JS modules where the
  engine allows it.
- D2a and D2b in the north-star doc are drafts, not accepted. Design so they
  can change.
- **Own:** the new life modules and the event panel's Life and Heard views
  (`src/event_feed*.js`).
- **Coordinate:** save code and the life record belong to the life-sim
  foundation GM. Agree the record's shape with it in its folder. The
  story-life lane owns `src/causal_story_*`. Four other Codex lanes are live;
  keep one writer per file area.
- Keep a checkpoint in this folder. Don't commit; the coordinator or Weibao
  will.
- Report in plain words: what changed, how it was checked, what remains.
