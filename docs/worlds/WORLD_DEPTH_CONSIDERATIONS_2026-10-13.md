# World depth considerations (proposal, 2026-10-13)

Weibao's requests, in order: "deeper considerations for each world?", then
subtle stuff, a workflow to iterate worlds, parallel worlds and different
starting points, then required features and engine improvements, then a
canon-first priority with easy AU work, then relationship and start-point AUs,
then "how to consider implementing full world and fleshing out every little
detail and more? locations, people, interactions, ability and more?" Full quotes
and the recorded priority live in
[User vision](../USER_VISION.md#world-depth-and-canon-first-world-priority-2026-10-13).

Everything below and in the linked parts is a palette of proposals, not specs
and not accepted decisions. Pick what fits a world and moment. Sealed secrets
appear only by ID, route and status. Franchise facts from memory are labeled
"(general knowledge)" and need a source check before a pack relies on them.
Nothing here was built or run; every acceptance case is specified-not-run.

## Parts

| Part | Covers | Codes | Rows |
|---|---|---|---|
| [01 Home and hubs](world-depth-2026-10-13/01_HOME_AND_HUBS.md) | Original frontier, Proving ground, Reincarnation Paradise, Proto23 | OF, PG, RP, P23 | 113 |
| [02 Academy and magic](world-depth-2026-10-13/02_MOL_HP_JJK_DND.md) | Mother of Learning, Harry Potter, Jujutsu Kaisen, D&D | MOL, HP, JJK, DDC | 122 |
| [03 Bleach, Naruto, Elden Ring](world-depth-2026-10-13/03_BLEACH_NARUTO_ELDEN_RING.md) | Three franchise worlds | BL, NA, ER | 94 |
| [04 Fallout, Skyrim, book worlds](world-depth-2026-10-13/04_FALLOUT_SKYRIM_SL_TTKS.md) | Fallout, Skyrim, A Soldier's Life, TTKS | FO, SK, SL, TT | 125 |
| [05 Researched worlds](world-depth-2026-10-13/05_RESEARCHED_WORLDS.md) | 26 researched and candidate worlds, plus integration, loop, host and cultivation cluster defaults | CLI, CLL, CLH, CLC, per-world | about 340 |
| [06 Cross-world](world-depth-2026-10-13/06_CROSS_WORLD.md) | World iteration workflow and depth ledger, parallel worlds, starting points, subtle joins | WI, PW, ST, SU, MC, SG | 73 |
| [07 Required features and engine](world-depth-2026-10-13/07_REQUIRED_FEATURES_AND_ENGINE.md) | Feature families with code seams, engine improvements, build order, risks | RF, EI, BO, R | 53 |
| [08 Priority canon and AU](world-depth-2026-10-13/08_PRIORITY_CANON_AND_AU.md) | HP, D&D, A Soldier's Life, TTKS, MoL canon spines and easy AUs; AU kit | PHP, PDD, PSL, PTT, PML, AK | 67 + 48 cases |
| [09 More book worlds canon and AU](world-depth-2026-10-13/09_MORE_BOOK_WORLDS_CANON_AND_AU.md) | LOTM, Circle of Inevitability, Shadow Slave, Reverend Insanity, Worm, Legendary Mechanic, Omniscient Reader, A Novel Concept, Regressor's Tale; source coverage ranking | QLM, QCI, QSS, QRI, QWM, QLG, QOR, QNC, QRT, QK | 70 + 83 cases |
| [10 Full-world method](world-depth-2026-10-13/10_FULL_WORLD_METHOD.md) | Production method for a whole detailed world: census, depth tiers, card families, data over code, agents at scale, World1 lessons, D&D Phandalin worked example | FW, DT, LC, PE, IX, AB, IT, EV, IN, DC, SA, LW, MC2 | 106 |
| [Agent brief](world-depth-2026-10-13/00_AGENT_BRIEF.md) | The shared brief the eight research lanes followed | | |

Each world section in parts 01 to 05 ends with a "Smallest playable taste" and
has Starting points, Parallel versions and Subtle details subsections. D&D rows
in part 02 use `DDC` to stay distinct from the coverage map's `DND00` to `DND15`.

## What the pass found

- **World content is mostly code today.** `src/` has 59 `*_host.js` and 62
  `*_content.js` files, and the MoL cast is a hard-coded array. Part 10 proposes
  short authored cards per family (location, person, interaction, ability,
  item) compiled to structured pack rows, with depth tiers T0 to T5 so every
  detail exists at some tier without costing full proof.
- **World1 stalled on production, not on the standard.** Pack p08 spends most
  of its bytes on repeated preconditions; the ledger reached 3,803 rows against
  2 delivered units. Lints and computed coverage replace the hand ledger;
  browser proof runs per slice and per new verb template (part 10, LW rows).
- **AUs are cheap as overlays.** Base pack plus a divergence patch compiled to a
  new pack ID keeps existing saves' shape (part 07 EI1, EI2). Relationship flips
  reuse existing regard and witnessed memory; start shifts reuse existing
  content (AK2, AK3, QK rows).
- **Engine limits that true parallel copies hit:** world clocks assert frozen
  absence (`src/world_instances.js:108-111`), one active visit at a time
  (`src/expansion_engine.js:142-143`), and unknown reputation regions throw
  (`src/reputation_state.js:6-16`). These need one migration slice (part 07 BO10).
- **The heir path is built but unwired** (`buildLifeHeirSave` is never called;
  source-reading inference, not browser-checked).

## Proposed build order

Canon-first priority applied; smallest playable first. Each item needs its own
rebuilt fresh-origin desktop check at 1366x768, 1440x900 and 1920x1080, plus
save, reload and import where persistence changes.

| Code | Slice | Why first | Gate |
|---|---|---|---|
| A1 | PML1: play through the built MoL Cyoria arc natively | Verification only; turns built-unverified into evidence | None beyond browser time |
| A2 | PML6: Taiven as rival retriever AU | Regard flip on an encounter that already runs; first relationship AU | MoL files only |
| A3 | Card compiler and lints (part 10 suggestions 1 and 2) | Makes every later world cheaper | Dev-only tooling |
| A4 | D&D Phandalin ST2 bag repair from cards, then ST3 shrine helper | First D&D native slice on open SRD rules | Needs A3 and one repair consumer |
| A5 | PHP1: HP summer 1991 supply week, then the cousin or ward AU | First native HP instance on existing jobs and starts | Source ledger is thin on canon voice |
| A6 | QLM1: LOTM lodger at the Morettis on the Tingen cover job | Best-covered next book world | New pack |

Held: A Soldier's Life slices PSL5 (colleague is family) and PSL1 (morning
muster) are the cheapest builds overall, but that world is paused since
2026-10-12 and needs Weibao's explicit resume. Per-world presentation (BO1, V6
tints) waits on the Vivid/Proto23 and UI density lanes that own the workspace
files.

## Open conflicts with live work

Other lanes currently own files these slices touch: Vivid/Proto23 UI flow and UI
density (workspace, CSS, display), Foundation chain (`main.js`, saves, tests),
Proto23 VFX (reveal renderers). `dist/` rebuilds race between lanes. Check live
ownership before any runtime write (part 07, R rows).
