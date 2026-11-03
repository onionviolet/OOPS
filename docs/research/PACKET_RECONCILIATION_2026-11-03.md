# Idle and cultivation packet reconciliation, 2026-11-03

Research only. Requested by Weibao: check the saved implementation packets for
Immortality Idle, Immortal Life, Tale of Immortal, NGU Idle, Your Chronicle,
Arcanum/Theory of Magic and The Climb against current `src/`, then consider
deeper dives. Packets are proposals (AD32), not accepted decisions; nothing here
selects work. Proto 23 is excluded (already deep-dived).

Evidence reached: **source grep plus partial reads by Sonnet readers; no tests read
or run; nothing built or played.** "Missing" means no keyword anchor found, not
proven absent. Reader tables: [Immortality/Immortal Life/Tale](packet-reconciliation-2026-11-03/trace_immortality_life_tale.md),
[NGU/Your Chronicle](packet-reconciliation-2026-11-03/trace_ngu_yourchronicle.md),
[Arcanum/Climb](packet-reconciliation-2026-11-03/trace_arcanum_climb.md).
Two spot-checks by me held: work-plan steps accept only command/travel/wait
(`src/feature_expansion_work_plan.js:50`); renewal returns separate lost/retain
lists (`src/structured_renewal.js:38`).

## Result

- No packet is deferred by direction on its own. AD33 touches Tale P2/P5 and Immortal Life P3 only in part.
- No packet is adopted: PROJECT.md and the rules index do not mention the three older research folders.
- Stale doc: Climb gap audit E3 cites `tests/fa09_routines.test.js` (gone; see `routine_jobs.test.js`, `trial_routine.test.js`); Arcanum anchors `src/items.js:1092-1152` now point at Cape/Amulet/Ring code (books are `items.js:1155-1207`).
- Fully implemented: NGU T6, T11; Tale P6 (core only).

## Candidate next picks (ranked, none accepted)

| ID | Item | Source | Note |
|---|---|---|---|
| C1 | Numeric current/next/reactivation rows in renewal preview | NGU P1 | small |
| C2 | Reading row says what finishing allows | Arcanum P7+P5 | row exists at `display.js:5303` |
| C3 | Native reading/study work-plan step | Your Chronicle P4 | unblocks YC-P1 |
| C4 | Gain-derived aptitude | Immortality Idle P2 | carrier and consumer exist |
| C5 | Desktop activity board | NGU P3 | fits desktop-first priority |
| C6 | Work-plan target and capacity-return display | NGU P7, T15, T16 | |
| C7 | Named plan with threshold switch | Immortality Idle P3 | |
| C8 | End-to-end natural player journey audit | Climb gap audit G1 | audit, not code |

## Follow-ups run 2026-11-03

- [C1-C7 re-trace with tests](PACKET_RETRACE_C1_C7_2026-11-03.md): small = C1, C2, C6; medium = C4, C5, C7; large = C3.
- [Climb source read](CLIMB_SOURCE_READ_2026-11-03.md): the public repo holds only built assets, so this is a bundle read, not authored source.
- C1 slice built (structured-pack renewal preview shows numeric mastery/reserve now and after renewal); the field-renewal path is deferred.

## Deeper dives proposed

1. **The Climb source read** of `tomlipo/the-climb` at a pinned commit: awakening, enchant slots/capacity, heirloom retention, training-dummy award (G5), opening chain, and whether rune blessings exist at all. Captured bundle `climb.js` already sits in the private folder.
2. **Trace pass on the ~10 untraced NGU small touches and Immortal Life T6-T14** (UI-level reading, then tests).
3. **Re-trace C1-C7 with tests read** before any is scheduled.
4. Fresh itch cultivation sweep (screen is from 2026-10-22).
