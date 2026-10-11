# C2: Level scales across sources and genres

Read `docs/gm/dispatch/skill-growth-2026-10-10/COMMON.md` first and follow it.

**Goal:** check and extend the "Level scales" section (S1 to S14) in
`docs/SKILLS_AND_TALENTS.md`. Weibao asked about worlds where 100 is
OP versus 1000 versus more. For each source, record: the scale shape,
the cap or lack of one, spacing (linear, exponential, named jumps), the
population curve (how many people at each level), the gap rule (can
lower beat higher), where protagonists start and end, the rate of
growth, how big numbers stay readable, and how numbers convert when
characters cross worlds.

**Sources, in order:**
1. Local first: `docs/research/novels/` dossiers and full-book notes
   (A Novel Concept, Lord of the Mysteries, Reverend Insanity, Shadow
   Slave, Solo Leveling, Omniscient Reader, Cradle, Worm, Mother of
   Learning, Legendary Mechanic, Regressor's Tale and others there),
   `docs/research/power-systems/` wiki digests (Naruto, HxH, JJK,
   Bleach, Type-Moon, Elder Scrolls, Dark Souls, Fallout, Dungeon
   Crawler Carl, Harry Potter and others), and the games in
   `docs/research/` (Disgaea-like idle games, RuneScape-likes,
   roguelikes, CK3, Dwarf Fortress, Caves of Qud, Tale of Immortal).
2. The Royal Road catalog `docs/research/novels/royal-road-2026-10-10/catalog.tsv`
   (read only): scan blurbs for scale signals (level caps, SSS, tiers,
   realm counts) to estimate how common each shape is.
3. Genre knowledge (tabletop, MMOs, idle and incremental games, manhwa,
   xianxia), labeled MEMORY.
No novel-site downloading in this run (C1 owns Royal Road).

**Output:** `docs/research/skill-growth-2026-10-10/LEVEL_SCALES_AUDIT.md`:
a table of sources by scale, new scale shapes, an "OP" analysis (what
makes a number feel overpowered in each shape), conversion between
worlds, idle-game pacing and display findings, rough genre frequencies,
YAIRPG implementation considerations (including the vanilla `max_level`
in `src/models/skill.js`, read only), and the checkpoint.
