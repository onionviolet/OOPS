# Zorian plan packets P1 and P2: paper tests (2026-11-03)

Status: proposal (AD32). Paper only; no code changed. Packets from the [playthrough plan](ZORIAN_PLAYTHROUGH_PLAN_2026-11-03.md).
Evidence: `src/harm_loops.js` (read), `src/book_world_mol_host.js` and `src/world_packs/book_mol_pack.js` (read, command ids extracted by pattern, so
the count is approximate), ZS rows in `gm/dispatch/protagonist-life-2026-10-27/LEAD_SKILL_TIMELINES_2026-11-03.md` (exists, 201 lines, untracked in the
main checkout; this closes the plan's open question about it). Nothing run.

## P1: reset row v2 against three rows

Fields from the [seam note](RETENTION_RESET_SEAM_2026-11-03.md). "gap" means today's row cannot say it; "ok" means the field fills from current text.

| Field | `book.lotm.tingen` (death restart) | `loop.perfect-run` (retry) | MoL (Zorian) |
|---|---|---|---|
| `triggers` | ok: [death -> `restart:initial`] | ok: [death -> `restart:checkpoint`] | **gap in today's shape**: [date (month end), death, switch (marker holder), contingency]; `trigger` holds one value and the validator allows only player/death/date |
| `carry` with class and carrier | partial: categories fill as class `soul-bound` with carrier "the self"; no entry has a reason beyond the row's prose | ok: [knowledge, soul-bound] | gap: needs notebooks, memory packets and a code phrase as carriers for ally knowledge (class `carried`), plus items and money as class `reset` |
| `budget` | none (correct) | **gap**: "world-set budget of tries" is prose in `cost`; first user of the field | gap: per-run power budget (c55 p91), heavy use degrades |
| `witnesses` | ok: "people forget" = []; sealed matters stay sealed | ok: none | gap: list with `since` and `lapses` (conferred looper status lapses, c105 p14) |
| `staleness` | none | none | gap: LOOP_INERTIA, reliable a few days after divergence (c49) |
| `exit` | ok, one string | ok | gap: several conditions with costs (c54 p51, c92 p14) |

Result: the LOTM and Perfect Run rows fill every field without change, so making every new field optional is safe for both. MoL needs five of
six fields. **Perfect Run is the second user of `budget`**, which trips the seam note's refactor trigger; moving it from prose is the one edit to
an existing row, and it is optional.

Two things the paper test found that the seam note does not say:
- **R1:** `validateLoopRows` requires `trigger` in {player, death, date} and `command` in KINDS. A `triggers` list needs the validator and `loopPlan`
  changed together, and `loopPlan` picks a row by one trigger match, so a multi-trigger row needs a defined order when a death falls on the last day.
  Default: the earliest event in the clock wins; a tie is a date end.
- **R2:** `continuation_retention.js` carries mastery as an aptitude multiplier (seam note). The `soul-bound` class must be a name the validator maps to
  one of two implementations, or "carry" means different things in two worlds. This is Weibao's decision (a) in the plan, not an agent default.

## P2: Zorian seat

What the host does today (read):
- `book.mol.zorian` is a **resident NPC** the visitor meets (`book.mol.zorian_talk`). The pack gives him a body and a talk command, not a seat.
- `commitMolCommand` forces `actorId:'player'`; `molPresentation` lists only commands whose `actorId==='player'`; `bodySupported` checks
  `native.player.body`; every location and permission gate reads the visitor facts (guest permit, Village origin, `book.mol.enroll`).
- About 78 `book_mol` commands exist, all player-bound, nearly all visitor service life (library shift, lamp study, Taiven hatch work, Kael treatment).

**Revised after Weibao's question (same day): one Cyoria world, two starts.** Zorian is a start (a seat beginning at c1 day 1) on the existing
Cyoria pack; the visitor stays as the other start, with its gates conditioned on the start. Shared people, places and study rows are used by
reference. The loop row and restart scope are keyed per start (for example `book.mol.cyoria#zorian`), since `loopRule` looks up by `worldId`
and the visitor row says no loop. In the Zorian start `book.mol.zorian` is the seat, not a resident, and `zorian_talk` is suppressed. Order:
P2b grep of the 78 commands for hard-coded `player` and guest-permit assumptions, start concept plus per-start loop key, bind S0 (ZS1-ZS5), then S1.
The text below is the earlier new-key proposal, kept for the reasons it lists against reusing the pack unchanged.

**Earlier decision (superseded):** a new world key (working name `book.mol.loop`) with its own seat, leaving the Cyoria visitor pack unchanged. Reasons:
reusing the pack puts Zorian in the world twice (NPC and seat), and the pack's gates (guest pass, enroll from Village, "no loop, festival invasion
or protagonist replacement" in the presentation text) all state the opposite of Zorian's premise. Cost: a second pack must reuse the same
people, places and lamp/formula study rows; share them by reference, not copy (one place for Nora's formula rows). Reversible until a slice ships.

Command classification for a Zorian seat: the 78 visitor commands split three ways.

| Group | Examples | Handling |
|---|---|---|
| Reusable if the actor becomes a parameter (partial until a focused test runs it as the seat; LOTM seat-reachability lesson) | `study_invocation`, `study_formula`, `assemble_lamp`, `control_drill`, `lamp_test`, `catalog_shift`, `mana_assessment`, `taiven_*`, `kael_*` | bind to the seat's `actorId`; the cost, duration and body checks already read the actor |
| Visitor premise only | `chart`, `arrival`, `enroll`, `guest_pass`, `guest_room`, `return_visit_life`, `enter`, `return` | not reused; Zorian lives there |
| Lore trials (`book.mol.lore.*`, ~25) | borrow/read/compare/trial_ink/certify_device | reusable as study work; check that none assumes a guest permit |

Consumers for the 19 ZS skills (from the file's own Consumer column, with the seat test):

| Result | Rows | Meaning |
|---|---|---|
| Consumer exists as a visitor or NPC row, needs actor binding | ZS1 (reserve), ZS3 (shaping), ZS4 (study invocation), ZS5 (formula lamp), ZS10 (Taiven combat: the row is Taiven's) | 5 rows; ZS3 and ZS4 are `actorId:"player"` commands, ZS5 and ZS10 are non-lead trained rows |
| No consumer: gap with a named mechanism | ZS6 mana sensing, ZS7 divination, ZS8 mind shield, ZS9 mind sense, ZS11 teleport, ZS12 wards, ZS13 soul perception, ZS14 route planning, ZS15 briefing allies, ZS16 dimensional boundary, ZS17 simulacrum, ZS18 blood magic | 12 rows; ZS8/ZS9/ZS13 ride M6 (typed mind and soul abilities, GM29); ZS11/ZS14 ride travel (GM31); ZS15 is the carrier mechanism in M2/M4 |
| No reader: derived state | ZS2 efficiency, ZS19 casting after a wound | 2 rows; ZS2 is a band on ZS1, ZS19 is an injury cause (SLR42), not rust |

Totals match the file's count: 0 pass the seat test as built. After binding, S0-S1 need ZS1-ZS5 only; the other 14 enter with their stages (S2 on).

## Open for Weibao (both reversible)

1. Soul-bound carry versus an aptitude multiplier for a restart (R2).
2. New world key for the Zorian seat versus a lead seat on the existing Cyoria pack. The P2 recommendation is the new key.

## More to consider

- ACT NOW (done): F1 closed, the three-row test, the seat classification.
- ACCOUNT FOR NOW: R1 needs a tie-break rule written in the seam note before any validator change.
- LATER: a P2b pass that opens the `lore.*` commands one by one for guest-permit assumptions (haiku shard, mechanical grep); confirm the
  command count with the pack's own loader instead of the pattern extract.

## P2b: what actor binding costs (read by script over the pack object, 2026-11-03; not run in the game)

Script read the 82 `book_mol` commands from `book_mol_pack.js` (so the 78 in the earlier estimate is replaced by 82).
- All 82 have `actorId:"player"`, and the command blocks hold 387 hard-coded `"player"` references (effects, costs, transfers). **Binding the seat is a
  data rewrite of the pack plus the host, not a host-only change.** Resolve `player` to the seat actor at load, not by editing each row (LOTM's T8: one writer for the shared pack).
- 81 of 82 gate on three condition facts derived from the visitor's native binding: `mol.nativeBound`, `mol.playerSupported`,
  `mol.local.book.mol.cyoria`. The Zorian start must supply them from its own named supplier (WA51), or the gate is parameterised by start.
- 29 commands gate on `actor.book.mol.guestPermit`, 30 on any visitor-only fact in total (`village.elderMet` and `mol.chartSupported` gate only `chart`).
  Zorian is an enrolled student, so the permit becomes a student-status condition in his start; the rows keep their other terms.
- Two world ids appear: `base.frontier` (the Village side: `chart`, `enroll`) and `book.mol.cyoria`. A per-start key must not collide with either.
- Actor per verb: nearly every command is a verb the player performs; Taiven, Kael and Ilsa verbs are the player acting on a person, so the Zorian
  start swaps the target set (he is not his own `zorian_talk` target). Seat reachability stays "partial" until a focused test passes as the seat.
