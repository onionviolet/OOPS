# Harry's first-year exams (2026-11-10)

Owner of the numbers: `src/hp_exam_model.js`. Commands: `src/world_packs/book_hp_lead_exam_data.js`. State readers, facts, results view:
`src/book_world_hp_exams.js`. Panel section: `src/book_world_hp_lead_ui.js` ("End-of-year exams"). Calendar: `book_world_hp_school_calendar.js`
(`exams`, 17 June, day 321). Tests: `tests/hp_exams.test.js`. Browser script: `scripts/hp_exam_browser.cjs`.
Taken from the Academagia decompile packet ([P1/P2](../../../research/academagia/decompile-2026-10-14/IMPLEMENTATION_PACKETS.md)): a mark is practice
plus preparation, preparation narrows the random range, a subject is graded against the cohort, the exam is a dated event. No Academagia number,
band name or formula is copied; Hogwarts words on the results screen. Cites GTR1, GTR12, GTR14, GTR20, GTR21, GTR26; SLR4, SLR6; SPR9, SPR20-SPR22; STY33.

## What a player does
Easter holidays (day 247) to 16 June: **Revise {subject} · 90 min**, seven subjects, six sessions each, 6 stamina each (past six: "practice or a teacher").
17 June (day 321, lessons stop): seven papers in timetable order, one roll each. Last day of term (day 329): **Read your marks on the board**.

## Model (assumed units, SPR21)
`mark = aptitude(52; Potions 50) + 18*fluency + 6*understanding + 2*sessions + draw(-w..w)`, `w = max(3, 9 - sessions)`.
Fluency: Charms = levitation steps/8, Potions = Alchemy xp/40. Understanding: library write-up, correct flask. The five other papers have no play behind them
yet: baseline plus revision only (stated gap). Cohort of 40: Hermione 90-99 per subject, Ron 50-62, Neville 41-53 (Herbology 78-86), 36 others
N(46,13); fixed per world (seeded), same in every life. Band = rank (tie shares the better: top 1, high 6, good 20) with an absolute pass mark of 38;
overall = mean of band points, one failed paper at most for any pass. Harry's draw is enumerated, so the weights the paper rolls are the exact chances.

## Calibration (results are the contract; SPR9, SPR20-SPR22)
Derived from the results: Hermione leads the year; Ron passes with good marks. Held out: Neville passes, helped by Herbology (tested, 200 cohorts).
Over 200 other cohorts: Hermione top 200/200, Ron good-or-high 194+/200, Neville not failing and Herbology top/high 200/200.
Canon-choice lead (Charms/Potions practice at half, the story's own revision act = 2 sessions each): lands good-or-better ~100% (exact over the draw,
>=90% over 100 cohorts, asserted). Without the story revision: ~75%. No practice and no revision: ~27%. Full effort everywhere: "high marks" ~100%, never past Hermione.
Slack: Ron's range can move about 4 points either side before the held-out cases break. Failing a paper needs a mark under 38: a lead who does nothing
still passes (ordinary Hogwarts first-year; dial `passMark`/`aptitude`).

## Reachability and seams (read before extending)
- Private packs: `private_packs/hp-cast/*.json` carry `baseHash`/`predecessorHash`. Adding native commands changes the base hash, and the base hash at HEAD
  already differed from the one in `flight.json` before this change (`9f7c...` computed vs `f9cf...` in the pack), so the story chain needs re-stamping by
  whoever owns those files. Nothing here edits them.
- The finale pack's `exams` act (passage to day 322) and `results` act (fixed "passed with good marks" text, sets `exam: passed`, which `kings-cross` reads) are
  NOT gated by the papers or marks. Wiring it needs a pack re-stamp: shorten `exams` to end at day 321 08:00, gate `hagrid` on the History paper and `kings-cross`
  on `read_marks`, drop the canned `exam-result` line. Until then a lead can ignore the papers and the canned line can disagree with the marks (STY33: non-canon routes should vary).
- The story's `revision` act credits two sessions per subject through `completed.book.hp.lead.w11_finale.revision` (read, not edited).
- House points: not changed; the feast already fixes the Cup at 482 (the finale pack), so exam points are not added (below floor).
- Next-year trait: a high or top Charms paper adds 5 points to the charm chance in later lessons (`examRegard` in `book_world_hp_lessons.js`); no later year exists, so that reader is unreachable in play (below floor).
- Papers are one sitting day (the book has a week); dial `EXAM_DAY`.

## Verification (one line per check)
- `node --test tests/hp_exams.test.js` + hp_lessons, hp_school_calendar, hp_lead_life, hp_positions: 32 pass (model, 200-cohort slack, commands, save-shaped state).
- `npm run build`, `npm run check:arch`, `npm run check:rules`: pass. Full `npm test`: 5884 tests, 5860 pass, 0 fail, 24 skipped.
- Rebuilt headless browser play at 1920x1080 from a fresh origin through revision, papers, marks and save/reload: **not exercised** when this was committed.
  The lead's route to the Easter holidays is about 40 s of wall time per act press in `scripts/headless/hp_lead_walk.mjs`, so the walk was still running;
  `scripts/hp_exam_browser.cjs` is the Playwright half (it needs a save from the walk). Status: implemented, unit-verified, below the floor until that run is recorded here.
- Route kind: unit fixture (native commands at set clock days); not a from-fresh-life MCP walk.
