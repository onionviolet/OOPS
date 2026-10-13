# Groundhog Life ranked packets (PROPOSALS, not accepted, not implemented)

Each world keeps its own rules. Use original names and text. Every packet needs its own rebuild, a fresh-origin desktop browser check, and Save/reload/Import proof before anyone calls it done. Finding codes refer to [REPORT.md](REPORT.md).

## P1: Day budget for one opt-in ordinary-life world (F2, F4)

Smallest result: one world shows a 24 h bar (sleep, work, study, chores, free). A home or furnishing adds chore minutes; one helper buys minutes back; free time is the remainder.

Seams: `src/simulation.js` (setSimulationProgram/advanceSimulationBoundary), `src/world_rhythm.js` (calendarMinutes), `src/home_furnishing_content.js`, `src/energy_resources.js`, `src/status_care_host.js`.

Acceptance: the bar always totals 24 h; upgrading the home without enough free time is blocked with a reason; persistence round-trips.

Tradeoff: YAIRPG's native play is one action at a time, so this must be a per-world routine mode, not a global replacement.

## P2: Dated opportunity checks (F8, F11)

Smallest result: at a set age the chronicle raises an offer that checks a skill level. A miss writes "needed X by age Y" into the life record so a later life or heir can plan; a hit opens a career branch. Optional delayed-kindness payoff.

Seams: `src/chronicle.js` (ageYears, nextChronicleBoundary), `src/causal_story_core.js`, `src/life_record.js` (appendLifeMilestone), `src/event_feed.js`, `src/village_career.js`.

Acceptance: fires once per life at the boundary; reload does not re-roll or re-fire; the miss record is visible next life.

## P3: Mood from balance, with rising expectations (F3, F12)

Smallest result: one mood score built from rest, workload and home vs. age expectation, each part with a one-line voice, feeding a small learning multiplier. A later option is a multi-year habit average for health.

Seams: `src/everyday_life.js` (moodConditions), `src/life_experience.js` (lifeLearningMultiplier), `src/home_furnishing_host.js`, `src/status_care_*`.

Acceptance: the tooltip shows each part with its owner; overwork lowers learning; the expectation step changes at a visible age.

## P4: Reading queue and faster rereads (F6)

Smallest result: queue known books; a second reading (same life, or carried by a written note or heir) costs time/(1+times read), while the effect still needs finishing.

Seams: book_stats in `src/main.js`, `src/book_care_runtime.js`, `src/chronicle.js` (createHeirChronicle), knowledge notebook.

Acceptance: the queue survives reload; the reread discount appears only when a carrier exists.

## P5: Soft loop end for a loop world (F7, F1)

Smallest result: a loop world's end trigger is rising time pressure with a warning instead of death, then a restart offer showing what carries. Pairs with the reset dials R1/R6.

Seams: `src/chronicle.js` (lifespanDeadline), `src/life_record_ui.js`, `src/chronicle_ui.js`, reset profile in [death and reset considerations](../DEATH_AND_RESET_CONSIDERATIONS_2026-10-10.md).

Acceptance: the warning appears before the boundary; the restart preview matches what actually carries; no duplicate rewards on import.
