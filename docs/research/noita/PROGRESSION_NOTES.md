# Brief progression gate supplement

Static source inspection, 2026-10-09. [Orb/tablet review](BODY_WORLD_DIGEST.md)
contains the main brief. This supplement checks ending entry conditions only,
not a full secret catalogue. Source paths resolve in the private extraction.

F11. The ending entry script reads location tags, run orb count and the
session's new-game-plus count. A new-game-plus branch uses an increasing
orb requirement and a mountain proximity check. It clears run orb collection
and calls the world-transition routine. The ordinary completion route sets a
run completion flag and calls the achievement hook. A high-orb branch uses
another endpoint check and persistent reward flags. These are distinct
collection, place, session and persistent gates, not one prestige number.
Evidence: `data/entities/animals/boss_centipede/ending/sampo_start_ending_sequence.lua:9-90`,
`:98-136`. World rebuilding and achievement internals remain native or in
called routines outside this bounded read. The referenced newgame-plus helper
was located, not fully audited.

The carried completion artifact's name and description depend on current-run
orb count (`data/entities/animals/boss_centipede/sampo_init.lua:3-26`). This is
a small example of an item reflecting world progress without being a separate
progression currency. A pickup script explicitly activates the boss encounter
(`data/entities/animals/boss_centipede/sampo_pickup.lua:3-62`). An earlier
pacifist branch in that function is followed by unconditional re-enabling of
the fight flag; it must not be reported as a working pacifist bypass based on
its comment alone.

P11. For YAIR, keep knowledge unlocks, world collection, local endpoint access
and prestige policy in separate owners. An artifact may show an earned local
history, but it does not grant a new reset layer by implication. Noita's ending
checks do not select our death, reset or retained-power policies.
