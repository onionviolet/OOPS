# Academagia implementation packets

All packets are **PROPOSAL**: not accepted and not implemented. Target viewport is desktop. Any packet built later needs a rebuild, a fresh-origin browser check and save/reload/import checks. Finding codes refer to [REPORT.md](REPORT.md).

## P1. School timetable as a standing week plan

Sources: F1, F2, F10, F19.

- Seams: `game_time.js` `day_count`, `world_rhythm.js:recurringWindow`, `simulation.js:setSimulationProgram`, `chronicle.js` events for terms and holidays, `energy_resources.js` for stress.
- Player path: Mon–Fri class slots are filled by default, and the player assigns free slots once. Days run while idle and pause only on an adventure stage, an exam, a stress-overflow warning or an event with consequences.
- Acceptance: run one in-game week idle and check that attendance, free-slot gains and one pause match the plan after reload.

## P2. Study level and dated exams against a cohort

Sources: F3, F4, F5.

- Seams: `chronicle.js` dated events, `world_completion_learning_runtime.js` and `lore_practice_runtime.js` jobs, `skill_expansion_content.js` subskills, `life_record.js:appendLifeMilestone`.
- Score = an aggregate of subject skills × study level. Each subject picks absolute bands or a curve against the simulated cohort.
- Acceptance: a midterm and a final on fixed dates produce a recorded grade that cannot be skipped, and the grade survives reload without re-rolling.

## P3. House points and the teacher ledger

Sources: F9, HP1.

- Seams: generalize `reputation.js:add_reputation` beyond regions, `chronicle.js:relationshipChange`, `people_knowledge.js`.
- A shared house score with a prize ladder. A favor spends teacher relationship. A reprimand books a detention slot that also teaches.
- Acceptance: one witnessed act moves house points, a favor resets the relationship, and detention appears in the P1 plan.

## P4. Staged skill-check adventures

Sources: F6, F11, F5.

- Seams: `ink_narrative.js`, `rules.js:chooseOutcome`, `simulation_resolution.js:deriveSimulationSeed`, `skill_discovery.js`.
- Each stage spends a slot. A choice rolls skill plus a seeded attribute factor against a target number. Info choices raise the odds. An unknown-skill choice reveals that skill. Date windows and exclusions apply.
- Acceptance: one 3-stage adventure where a reload gives the same seeded result, a failure costs stress, and an exclusive branch locks out its sibling.

## P5. Classmate cohort and friend group

Sources: F7, F8.

- Seams: `npc_lives.js`, `crush_social_*.js`, `people_knowledge.js`, `event_feed.js`.
- 8–12 original classmates rather than 80. Each has goals, likes, term progress that feeds the P2 curve, and a personal arc gated on relationship. A friend group carries a balance warning.
- Acceptance: classmate progress appears in a daily report, and one threshold opens one arc.
