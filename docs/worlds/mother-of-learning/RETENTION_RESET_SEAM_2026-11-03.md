# Retention and reset seam: one row shape for MoL and the LOTM lane (2026-11-03)

Status: proposal (AD32, AD51). Nothing here is accepted or built. Evidence: file reads just (src, docs, the merged MoL rule rows); nothing run.
Authority: AD51 (reasonable things get abstracted; shared seams proposed as AB1-AB10 in `ABILITY_RULES.md#abstraction-round-2026-11-03`,
which sits in the main checkout's uncommitted edits at the time of writing), WA55 (differences rows), WA56 (later-source pressure).
Census context: [COVERAGE_CENSUS](COVERAGE_CENSUS_2026-11-03.md) row 21.

## The mechanism, named

**A bounded replay with a carry set.** Something ends a run (a date, a death, a switch), the world's own state returns to an anchor, and a
named set of things crosses back, each by a carrier that has a reason and a cost. Other people either reset with the world or remember by an
in-world reason. The run may spend a budget. Foreknowledge from earlier runs goes stale as the world diverges. This is the
[death and reset dial set R1-R6](../../research/DEATH_AND_RESET_CONSIDERATIONS_2026-10-10.md#r-the-reset-profile-proposal) plus its F (decaying
foreknowledge) and L (loopers as people) lists; MoL fills every dial, so it is the best test of the shape, not a special case.

## What already exists (do not rebuild)

| Owner | What it gives | Limit for MoL |
|---|---|---|
| `src/harm_loops.js` `LOOP_RESETS` | Per-world dial rows (trigger, command, anchor, carry, cost, witnesses, exit, reason) with archetypes `default`, `book.lotm.tingen`, `loop.time-bound`, `loop.perfect-run`; `loopPlan` picks the connection command | One trigger per row; carry is coarse categories; budget, carriers and staleness exist just as prose; no MoL row |
| `src/harm_restart_scope.js` `RESTART_SCOPES` | Scoped restart: replay this seat and world, keep other worlds and shared records; `motherOfLearning` already listed as an owner | Scope just; says nothing about what the seat keeps |
| `src/loop_table.js` plus the MoL call at `book_world_mol_access.js:36` | World-neutral readout of resets and carries as strings | The MoL rows describe a **visitor** (guest pass returns to Ilsa's stock); the source says canon loop read pending |
| `src/continuation_state.js`, `continuation_retention.js` | Commands `cycle`, `restart:initial`, `restart:checkpoint`, aptitude anchors (a multiplier on practised skills, bought with insight or coins) | Retention is an aptitude multiplier, not carried memory or the skill itself; verify against `continuation_state` before assuming any other carry |
| `src/anchor_snapshots.js` | Derives a world snapshot at a time or anchor, branches, `explainFact` | Fits "what was true on day N of the replayed month"; not wired to MoL |

## What the LOTM lane already provides (and does not)

B0-B7 in the [Klein plan](../../gm/dispatch/refinement-audits-2026-10-31/LOTM_KLEIN_FULL_JOURNEY_PLAN.md) treat rewind as a **later, source-qualified
pressure**: the temporal-recursion row says native elapsed time and committed work stay authoritative, a rewind does not undo independent effects, and
"local time/rollback implementation later at source-qualified use"; TD3 queues cross-arc cases (a rewind crossing an independently persistent
recipient). `book.lotm.tingen` reset is a death restart (carry knowledge, mastery, retention, preferences; people forget; sealed matters stay sealed).
So LOTM has: one death row, the scoped-restart machinery, and a deferred rollback case. It has no date trigger, no budget, no carriers and no
witness list. The mechanism lane items I could not match by name (B11, B12 in the brief) are not in the Klein plan; AB7 says that lane names a shared
seam in each slice where reasonable, so this note is the MoL half of that exchange.

## Proposal: one reset row, two readers (AB11, proposed)

Extend the existing `LOOP_RESETS` row, keep `loopReadout` as the player-facing reader, and make `loop_table` rows derive from it (no second table).
New optional fields, all defaulting to today's behavior so LOTM and the default row do not change:

| Field | Meaning | Default (today's rows) |
|---|---|---|
| `triggers` | list of {kind: date, death, switch, player, exhaustion} each with its own anchor; replaces the single `trigger`/`anchor` pair (keep the old pair as a one-item list) | one trigger |
| `carry` | list of {what, class, carrier, reason}; class is `soul-bound`, `carried`, or `reset`; carrier names the bridge (the self, a notebook, a code phrase, a memory packet, a token) | categories as now, class `soul-bound` |
| `budget` | optional {unit, remaining, spentPer, effectWhenLow}; world-set, shown as a plain readout | none |
| `witnesses` | list of {who or kind, how remembered, since, lapses}; default none | `none` string |
| `staleness` | optional {sourceKind, decays after N days since divergence}; foreknowledge items carry a day stamp | none |
| `exit` | list of conditions with cost, as now but several allowed | one string |

Consumers: `loopPlan` (several triggers), `loopReadout` (adds budget, carriers, witnesses), a fact-staleness read over `people_knowledge`/notes
(later), and `anchor_snapshots` for "day N of this month". Nothing in this shape names a world; a world just fills rows.

## WA55 differences rows (MoL against the shared shape)

| Difference | MoL (source locator) | LOTM and default | Handling |
|---|---|---|---|
| Two ways a run ends | a month passes or a contingency fires (c55 p20); the marker holder's death or a protected soul procedure ends it (c75 p32, p51); a holder-commanded switch ends it early (c47 p3) | death just | `triggers` list; LOTM row stays a one-item list |
| Carry class | soul-bound things persist in full: memory, trained skill, soul damage (c6 p3, c55); the world's items, money, injuries and bodies reset | LOTM carries knowledge/mastery/retention by the default row | `carry` class per entry; confirm what `continuation_state` does with mastery before reusing the word "retention" |
| Carriers for what is not soul-bound | notebooks (c78 p133), memory packets (c17 p147), a prior-run code phrase for an ally | none | `carrier` field, each with a reason and cost |
| Budget | the loop spends power per run, not per day; the count is stated (c55 p91); heavy use degrades it | Perfect Run has a try budget in prose | `budget` field |
| Witnesses | allies must be won again each run unless a carrier or a conferred looper status holds; conferred status lapses after a stated number of runs (c105 p14) | people forget (LOTM row) | `witnesses` list with `lapses` |
| Foreknowledge half-life | routines repeat until nudged, then cascade; knowledge stays reliable a few days after divergence (LOOP_INERTIA, c49) | none | `staleness`; per-world inertia setting (deep dive section 3) |
| Time rooms | a room that buys extra time inside a run, with a stated multiplier and an exit window (c50 p74, c61 p129) | none | place row plus a read of `budget`; later |
| Seat | the lead is a soul-bound looper; the built pack's seat is a visitor with no loop knowledge | n/a | **Zorian gets his own world key and row; the visitor's `loop_table` row is left as it is** |

## WA56 later-source pressure

- Early assumption: one month, one death trigger, whole-world reset. Later text adds the switch, the budget, conferred and lapsing looper
  status, and an exit that has costs (c54 p51, c92 p14). The shape above allows all of them without a migration because every new field is
  optional. Confidence: S for the rows cited (rule rows with locators); I for how solo death-restarts square with another looper's loop (still open
  in the deep dive).
- Refactor trigger: when a second world needs a budget (Perfect Run is the candidate), move `budget` from prose to the field in the same change.

## What is not decided

- Whether the scoped restart should keep the seat's skill (soul-bound) or just an aptitude multiplier. This changes the idle feel (real carry vs
  lifted caps) and is Weibao's call, not an agent default; the shape supports both.
- Persistence: a field addition to the saved row set is a persistence change and needs a migration note (AD45); no save today stores these rows.
- A build. Per the [playthrough plan](ZORIAN_PLAYTHROUGH_PLAN_2026-11-03.md), nothing ships until a Zorian seat exists to read the row.
