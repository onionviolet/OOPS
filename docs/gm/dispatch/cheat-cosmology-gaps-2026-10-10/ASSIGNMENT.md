# Cheat cosmology gap pass (2026-10-10)

Dispatched 2026-10-10 by Claude Code. Weibao asked whether we need an
audit of how cheats from existing books, games and more fit our
cosmology. Claude found the framework already exists and proposed a gap
pass; Weibao: "send accordingly, use codex". Two Codex runs, one section
each. Everything you write is a proposal.

Read first: AGENTS.md, PROJECT.md, `docs/CHEAT_COSMOLOGY.md` (whole
file: backing table, placement card, compatibility modes, meeting
outcomes, verse equalization, patron gifts), `docs/CHEATS_BY_WORLD.md`,
and `docs/CHEAT_LIBRARY.md` sections "Gameplay by cheat family" and
"Enemies with cheats". Skim `docs/LIFE_SIM_NORTH_STAR.md` for the
sections CHEAT_COSMOLOGY links.

## Shared rules

- **Write only where your section says.** No YAIR source edits, builds
  or commits. Don't touch `docs/research/novels/` (out of git) beyond
  reading, and never copy raw prose.
- **Other Codex runs are live** (steam-library-wave, power-systems
  wiki digests). Their folders are read-only to you, and may be
  half-written: say so when you cite an incomplete one.
- **Sources:** our own research notes first (`docs/research/*`,
  `docs/worlds/*`, `docs/gm/dispatch/*`). General knowledge of a game is
  allowed but flag it (G). Cite every row by file and line or JSON key.
- **Style:** plain short sentences, no em dashes, match the table style
  already in CHEATS_BY_WORLD.md. Keep existing text; add, don't rewrite.
  If you think an existing row or rule is wrong, add a "Disputes" note
  with evidence instead of editing it.
- Keep `CHECKPOINT.md` current in this folder under your section letter
  (`CHECKPOINT_G.md` or `CHECKPOINT_M.md`) so a resume can continue.

## The unbiased lens (applies to both sections)

- Report sources as they are, including what contradicts or doesn't fit
  CHEAT_COSMOLOGY. Contradictions and misfits are the most useful
  findings.
- Label claims: **shown** (seen in data, code or text), **stated**
  (claimed by the source), **inferred** (yours, marked (I)).
- Don't rank sources, and don't build a general rule from one example.
- Proposals are options, not bans or musts. Only PROJECT.md accepted
  decisions and Weibao's quoted words bind. Every world makes its own
  rules; "everything possible, reasonably".

## Section G: game cheats (one run)

Question: does the cosmology (backing table, placement card,
compatibility modes) also fit cheats that come from games, not books?

1. Sweep our game research folders under `docs/research/` (Noita,
   Factorio, Kenshi, Tale of Immortal, Rogue Legacy, Caves of Qud, Dwarf
   Fortress, RimWorld, Cultist Simulator, Book of Hours, Disco Elysium,
   Planescape: Torment, Bitburner, Melvor Idle, Increlution, Magic
   Research 2, Path of Achra, Amazing Cultivation Simulator, Elin,
   NetHack, Tales of Maj'Eyal, Sunless Sea/Skies, Crusader Kings 3,
   Battle Brothers, Cult of the Lamb, Oxygen Not Included, the idle-game
   folders, and the franchise worlds in `docs/worlds/`). Use each
   folder's REPORT, FINDINGS and COVERAGE. Aim for 40 to 60 game cheats;
   breadth over depth, but at least 15 games.
2. Count two kinds of game cheat and keep them apart:
   - **In-fiction:** a power a character has in the game world (Noita's
     wand editing and perks, Kenshi's robot bodies, Tale of Immortal's
     sealed souls, Elden Ring grace).
   - **Player-layer:** something only the player has (save and reload,
     New Game+, prestige multipliers, offline progress, console
     commands, seeds, debug modes, known exploits, wiki knowledge,
     Factorio blueprints, Increlution carry-over). Record whether the
     game itself puts this into the fiction (Planescape's immortality,
     Rogue Legacy's heirs) or leaves it outside.
3. For each, fill the CHEATS_BY_WORLD row shape (World, Holder, Cheat,
   Does, Backing, Taken back?, Limits, Source) plus a "Kind" column
   (in-fiction / player-layer).
4. Test the backing table: which game cheats fit an existing backing,
   which need a new one (for example a save file, a run seed, a meta
   currency, the player's own memory), and which break the
   portability prediction. Same for compatibility modes and the
   placement card fields.
5. Note how a player-layer cheat could become a diegetic cheat in our
   game (the idle loop itself is "auto-cultivation"; save-scumming is
   a regression cheat), as proposals tied to CHEAT_COSMOLOGY's
   "Absorbing tropes properly" method.

**Write:** append a new section `## Game cheats (2026-10-10, Codex)` to
the end of `docs/CHEATS_BY_WORLD.md` with the table and a short "What
these add to the cosmology" list (at most eight bullets, misfits first).
Put the longer analysis in
`docs/gm/dispatch/cheat-cosmology-gaps-2026-10-10/GAMES_REPORT.md`
(REPORT first, plain and short, then backing-table fit, then proposed
new backings or card fields, then coverage: which folders you read and
which were too thin). You are the only writer of CHEATS_BY_WORLD.md in
this pass. Don't edit CHEAT_COSMOLOGY.md.

## Section M: when cheats meet (one run)

Question: CHEAT_COSMOLOGY intake step 5 ("check meetings") has never
been run. Does the framework give clear, consistent answers when two
placed cheats collide?

1. From the 25 placed cheats in CHEAT_COSMOLOGY.md and the 70 in
   CHEATS_BY_WORLD.md (only the rows present when you start; Section G
   is appending game rows in parallel, ignore those), pick 25 to 35
   pairs. Cover every backing against every other backing at least
   once where a pair exists, plus the obvious hard cases: two time
   cheats (Spring Autumn Cicada vs Mother of Learning's loop), meta vs
   system (Fourth Wall vs a Paradise system), absorb vs absorb (Soul
   Eater vs Authority of Gluttony), knowledge vs regression, analysis
   vs concealment (A.I. Chip vs gray fog), patron vs patron, item theft
   vs soulbound items.
2. For each pair, in a neutral world and in each holder's home world:
   which meeting outcome applies (ignore, override, cancel, counter,
   translate, trade, merge, devour, infect, cascade), why, from which
   source evidence (feats and anti-feats, cited), and whether verse
   equalization changes it.
3. Flag every case where the framework gives no answer, two
   conflicting answers, or an answer that contradicts a source feat.
   These are the main result.
4. Light check of the (I) "Outside" rows: list any that contradict the
   backing table's own prediction or a source feat. Don't rewrite them.
5. Propose the smallest fixes to the framework (a tie-break rule, a new
   field, a clarified outcome), each as an option with its cost, and
   note which would be the same data an engine cheat registry needs.

**Write:** append `## When cheats meet (2026-10-10, Codex)` near the end
of `docs/CHEAT_COSMOLOGY.md`, just before "## More cheats by world":
a pair table (Pair, Backings, Neutral world, Home worlds, Evidence,
Gaps) and a short list of framework gaps and proposed fixes. Also add a
bullet to the "## Open" list pointing to unresolved gaps. Put the full
analysis in
`docs/gm/dispatch/cheat-cosmology-gaps-2026-10-10/MEETINGS_REPORT.md`.
You are the only writer of CHEAT_COSMOLOGY.md in this pass. Don't edit
CHEATS_BY_WORLD.md.

## Done means

Your appended section is in place, your report exists with a plain
summary first, your CHECKPOINT says "complete" and lists anything left
open. Final message: what you added, where, and the top three findings.
