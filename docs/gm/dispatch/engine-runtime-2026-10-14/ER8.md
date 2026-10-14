Read docs/gm/dispatch/engine-runtime-2026-10-14/COMMON.md and follow it.

Lane ER8: simulation and NPC architecture. Output
docs/research/SIMULATION_AND_NPC_ARCHITECTURE_2026-10-14.md and
docs/gm/dispatch/engine-runtime-2026-10-14/ER8/REPORT.md.

Also read docs/LIFE_SIM_NORTH_STAR.md, docs/CHARACTERS_AND_WORLD_EVENTS.md
and the existing actor/resident/simulation code (READ file:line).
Survey, with sources (GDC talks, postmortems, papers, open code): The Sims
needs/advertisement, utility AI (Dave Mark), GOAP (F.E.A.R.), behavior
trees, RimWorld storyteller and job system, Dwarf Fortress history and
off-screen sim, CK3 character/opinion model, Prom Week / Versu social
physics, Fallen London storylets, Stardew schedules, Shadows of Doubt
off-screen citizens, Caves of Qud history generation.
For each: core data model, tick cost and scaling trick, what fits this game
and where it would plug into current code. Then propose an engine-level NPC
architecture for this repo (stores, scheduler hooks, LOD tiers, knowledge
model, save shape) as a proposal with phased first steps. Respect sealed
secrets and the "considerations, not specs" rule.
