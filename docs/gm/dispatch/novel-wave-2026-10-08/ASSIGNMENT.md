# Novel source GM: new books plus a skill-evolution comparison

Dispatched 2026-10-08 by Claude Code at Weibao's request: "send sessions to
audit new books ... all the possible options".

Follow [NOVEL_SOURCE_GM_PROMPT.md](../../NOVEL_SOURCE_GM_PROMPT.md) and
AGENTS.md:
- Read the supplied books in full.
- Never modify the source files.
- Never commit raw prose; derived notes go in the gitignored
  `docs/research/novels/`.

## Sources (in `~/Downloads/`, read-only)

- *Kairos: The Last Gods* and *Kairos II: Legacy of Hades* (Maxime J. Durand)
- *War of the Pantheon* (Maxime J. Durand)
- *The Second Coming of Gluttony* (Ro Yu-jin)
- *Warlock of the Magus World* (Wen Gong)

Filenames start with those titles. Use one bounded subagent per book.

## Part 1: audit each new book

Use the lens in [LIFE_SIM_NORTH_STAR.md](../../../LIFE_SIM_NORTH_STAR.md):
- life progression and carryover;
- cheats and golden fingers, and how they work as rules, for example the
  Warlock's chip or Gluttony's eating;
- protagonists and cheaters as rivals;
- hidden stats;
- at least twenty small touches;
- how each item maps onto vanilla YAIR.

## Part 2: compare skill evolution across all books

Compare every audited book: the five above, *Speedrunning the Multiverse*
(notes in `docs/research/novels/full-book/speedrunning-multiverse/`) and the
local library (Lord of the Mysteries, Reverend Insanity, Shadow Slave, Mother
of Learning, Reincarnation Paradise, Fated Villain, Regressor's Tale,
Omniscient Reader). Use existing notes first, and read the source only where
the notes are thin.

Answer with evidence:
1. **Growth:** use, breakpoints, evolution branches, fusion, acting or
   digestion, insight, synergy stacking, rust and flaws, and any other
   mechanism found.
2. **Tiers and rarity, including "unique":** how each book handles them, and
   how many uniques can exist.
3. **Limits and exceeding them:** what caps exist and every way characters
   break them.
4. **Across worlds:** what transfers between worlds or systems, and how it
   changes.

## Output

1. A short plain-language REPORT first.
2. A taxonomy table of every mechanism found, with sources.
3. Five to ten ranked proposals, handed to the life-sim GMs
   (`docs/gm/life-sim-*-2026-10-07/`). Proposals are not decisions.
4. Keep a checkpoint. Don't edit `src/`. Don't commit.
