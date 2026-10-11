# Prompt: held systems, enemy cheats and the cheat library, deeper (2026-10-10)

Prepared by Claude Code at Weibao's request: "make prompt to consider this
deeper." Dispatched 2026-10-10 as one detached Codex run after Weibao said "send
it"; session ID in SESSION.txt, log in
`~/.codex/research/held-systems-2026-10-10/run.log`.

## Prompt

You are extending the YAIRPG design ideaboard. Read first: AGENTS.md,
PROJECT.md, `docs/RULES_FROM_SCRATCH.md` (the accepted rulebook),
`docs/CHEAT_LIBRARY.md`, `docs/CHEAT_COSMOLOGY.md`, `docs/CHEATS_BY_WORLD.md`,
and these north-star sections in `docs/LIFE_SIM_NORTH_STAR.md`: "Systems
held back by someone in the world", "The cheat library", "Enemy powers
and how they work", "Enemies who are reincarnators", "Levels of system",
"When systems and cheats meet", "Patron gifts" (in CHEAT_COSMOLOGY).

**Goal:** go deeper on three linked ideas, with sources.
1. **Held systems:** a cheat or system owned, sealed, throttled or
   steered by someone in the same world, who still influences the holder
   through it.
2. **Enemies with cheats:** enemy holders using the same cheat library
   cards, and how the player meets, reads, counters and inherits them.
3. **The cheat library:** cheat families as gameplay loops, the card
   schema, engine hooks and the phased build plan.

**Sources, in order:**
1. **Find the Royal Road story Weibao remembers:** a cultivation story
   where a system was held back by a powerful character in the same world
   but still influenced the main character. Lead candidate from his
   history: *Tale of the Creation of the Heavens* (Royal Road fiction
   91538, FallenMoon3): a boy receives a fragment of the Celestial
   Emperor's divine book. Also check *Godfather's System* (63078),
   *Regressed Master: Raising the Son of Heaven* (88880) and *Homegrown
   System* (94213). Read public chapters politely (follow "Be a polite
   client" in `docs/research/novels/SUBAGENT_RUN_RULES.md`); confirm or
   rule out each one against Weibao's description. Raw text stays under
   `docs/research/novels/held-systems-2026-10-10/` (gitignored).
2. **Our own notes** for held, sealed, loaned or parent systems: Solo
   Leveling's Architect and deletion, Fated Villain's system and fortune,
   Omniscient Reader's sponsors and the Star Stream, Reincarnation
   Paradise, Shadow Slave's Spell, the Primordial Saint Sect Book and its
   title page held by a rival, Reverend Insanity's Gu loans that keep the
   owner's will, Warlock's world-will loan, Renegade Immortal's revocable
   ring.
3. **General genre knowledge,** labelled as such.

**Unbiased lens (required):** report sources as they are, including
anything that contradicts our ideas. Label each claim shown, stated or
inferred. Don't rank sources or invent general rules from one source.
Frame proposals as options; the rulebook says each world makes its own
rules and only Weibao's words bind.

**Questions to answer:**
- How do held systems work in each source: who holds, why, the channels
  of influence, how the holder is discovered, and how the holder is
  resisted, bargained with, defeated or replaced?
- Storyteller or lore: where does the source's influence come from (an
  authored character or a fate-like force)? Our current proposal: lore
  decides what is true; the storyteller decides when and how hard it
  shows. Test that against the sources.
- For each cheat family in the library, what does an enemy holder do,
  and what are the counters? Fill gaps in the existing table.
- What library card fields are missing (for example `holder` and
  `influence`)? Propose the schema additions.
- Which three held-system or enemy-cheat scenarios would make the best
  first playable slices in the home world, using existing systems?

**Outputs:**
- `docs/gm/dispatch/held-systems-2026-10-10/FINDINGS.md` (tracked,
  paraphrase only): source by source, labelled claims with locators.
- `docs/gm/dispatch/held-systems-2026-10-10/PROPOSALS.md`: five to ten
  options for the north star and the cheat library, plus twenty small
  touches.
- A short "which story it was" answer at the top of FINDINGS.
- `CHECKPOINT.md` in the same folder, kept current.

**Don't:** edit `src/`, build, commit, or edit the north star or cheat
library directly. Claude folds accepted findings in afterwards.
