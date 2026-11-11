# Zorian's class tests in Cyoria: the exam seam in a second world (2026-11-10)

Proves the exams-against-a-cohort seam from Harry's first-year exams ([hp-exams](../hp-exams-2026-11-10/README.md)) in a loop world (AD51, FND5).
Cites GTR12, GTR14, GTR20, GTR21, GTR26; SPR9, SPR20-SPR22; STY33; SKR1, SKR21; AR3, AR18, AR19; WKR9. Proposal-level numbers (AD32); canon sets the bands.

## What a player does
Zorian start, any run. **Revise {Spell Formulas | Advanced Mathematics | Warding} · 90 min** in the academy library, until that run's paper is sat;
eight sessions per subject in all, summed over every run. Nora's existing 60-question placement test (workshop) is now marked: **Get your placement test back
from Nora** from day 3. **Sit the Advanced Mathematics test** from day 4 (workshop), **Sit the Warding test** from day 18 (academy). Each is sat once per run.
A new panel section, "Class tests this month", lists the three papers with this run's band, Zach's, Akoja's and Neolu's, and what Zorian remembers
("you have sat this paper 1 time before, last time a solid mark"). After the month restarts the class has forgotten the marks; Zorian has not.

## Owners
- Shared model: `src/exam_cohort.js` `examModel(spec)` (new). Hogwarts: `src/hp_exam_model.js` (now a spec plus the same exports). Cyoria: `src/mol_exam_model.js`.
- Commands: `src/world_packs/book_mol_exam_data.js` (windowKit act rows, `group: 'book_mol'`), appended in `book_world_mol_actions.js` after the pack's rows (ids under `book.mol.zorian.`, so the WA17 export hash is untouched).
- Facts, view, section: `src/mol_zorian_exams.js`; one registration line in `book_world_mol_host.js` `molPresentation` (AR18).
- Carry: `src/harm_restart_scope.js`, Zorian row only: `soulBound.resources: [/^book\.mol\.loop\./]`.
- Save check: `src/book_world_mol_state.js` accepts a frozen job's effects plus its drawn outcome's (MOL never had weighted outcomes).
- Tests `tests/mol_exams.test.js`; browser `scripts/playtest/mol-exams.mjs`; area guide entry "Exams against a cohort".

## What changed in the seam, and why (Weibao 2026-11-10: "adapt and adjust things to fit our purpose")
1. **Extracted the model.** Every function in `hp_exam_model.js` closed over Hogwarts constants, so a second world could not call it. `examModel(spec)` takes
   subjects, anchors, cohort size, spread, terms and dials. Harry's numbers are byte-identical: a digest over three cohorts, 252 inputs per cohort (every subject), anchors and
   overall chances, plus a hash of the HP command rows, is asserted in `tests/mol_exams.test.js` (taken before the change). `hp_exams.test.js` passes unchanged.
2. **Terms instead of fixed inputs.** HP's fluency/understanding/sessions became a list of `{input, weight, cap, narrow}`. Cyoria uses understanding, sessions and a
   new loop term `seen` (earlier sittings of the same paper: he remembers the questions). Harry has no `seen` term; nothing of his changed.
3. **Anchor variants by run.** `cohortMarks(seed, variant)` changes only anchor ranges, never the number of draws, so every classmate who resets sits the paper the
   same way in every run (asserted). Zach is a fixed top anchor because he remembers too; Neolu tops the class only in the first run.
4. **A 100-mark ceiling** (`maxMark`, Cyoria only) and **integer widths** (`floor`) so a half-step narrowing still enumerates. HP widths were already whole.
5. **Soul-bound counters.** Revision and sittings are memory, so they ride the existing soul-bound list as resources; this run's band is an ordinary actor fact and
   resets with the world. Declared in the restart scope (the one authority on what crosses), not copied in `afterRunRestart`.

## Canon contract (results set the band; source: Calibre 21 EPUB, chapter files)
| Locator | Source says | Asserted |
|---|---|---|
| c3 p27-50 (run 1) | Warding test goes "badly" for Zorian and Akoja; Zach aces it; Neolu beats Akoja "in every single class" | Warding is his weakest paper in run 1; Zach top every run; Neolu top in run 1 |
| c3 p272 (run 1) | Ilsa: "one of the best students in your group" | run 1 overall good or high, never top (≥0.999 exact; 175+/200 other classes) |
| c6 p324 (about run 8) | "near-perfect scores in all subjects, even warding", beating Akoja | run 8 and 10 top overall (>0.99); Warding top >0.95; his lowest mark above Akoja's |
| c7 p346 | Zach involved Neolu "the first time he went through this month" | Neolu ordinary (good or below) from run 2 |
| c10 p98 (later run) | "top grades on every exam" despite skipping classes | attendance is not an input |
Route variation inside the band: a Zorian who never revises or sits a paper stays at his run-1 chances in any run (asserted); the rise is from what he did.

## Model (assumed units, SPR21)
`mark = aptitude + 6*understanding + 1.5*min(sessions, 8) + 4*min(seen, 4) + draw(-w..w)`, `w = max(1, floor(8 - 0.5*sessions - seen))`, capped at 100.
Aptitude: Formulas 74, Mathematics 75, Warding 56. Understanding: Nora's three study months (Formulas, Mathematics); Haslush's ward-reading method and result
and Kael's barrier cubes (Warding), all knowledge the restart already carries. Class of 24 (assumed; the text names about a dozen): Zach 94-100,
Akoja 79-88 (Warding 66-76), Neolu 44-58 (run 1: 95-100), 20 others N(55, 12). Bands by rank (top 2, high 5, good 12) and a pass mark of 40;
overall high from 2.6 band points (two papers near the top and one solid). Test days 3, 4 and 18 are fixture dates (the text: week 1 for Nora, "two weeks later" for Warding).

## Verification (one line per check)
- Focused: `node --test tests/mol_exams.test.js` 8/8 (HP digest and command-hash regression, canon bands, 200-class slack, input monotonicity, soul-bound scope, played run 1 to run 2 carry, saved job with a drawn outcome, panel section); with hp_exams, mol_zorian_start, mol_zorian_restart, world_pack_registry, book_world_native_binding, harm_restart_scope, continuation_state: 101/101.
- `npm run build`, `npm run check:arch` (exit 0, no new cycle), `npm run check:rules`: pass. One TMR1 warning (non-failing) is in `book_world_hp_exams.js:14` from the merged Hogwarts slice, not this change.
- Full `npm test` after the last code change: 5937 tests, 5913 pass, 0 fail, 24 skipped.
- Browser, rebuilt bundle from this tree, headless Chrome 1920x1080, fresh origin: `node scripts/playtest/mol-exams.mjs . <out>` exit 0, zero page errors (108 console 404s for missing static resources). Route: native start, Village elder, chart, begin Zorian, then panel buttons: revise three subjects (save and reload keep 1 of 8), Nora's placement test, day 4 return of Formulas and the Mathematics test, day 18 Warding at the academy (overall line plus Zach/Akoja/Neolu lines; save and reload keep the bands), month end through the host's own tick (run 2: marks gone, last band, sittings and revision kept), Export then Import keeps them, run 2 revise and resit Formulas (sittings 2, revision 2; reload keeps the band). Run 1 bands drawn: Formulas high, Mathematics good, Warding pass; run 2 Formulas high. Screenshots 1-5 and `receipt.json` here.
- **Route kind: clock-only fixture** for days 4, 18, the month's last minute and run 2 day 3 (same technique as `scripts/playtest/mol-restart-memory.mjs`: no job running, scheduled checks and controllers shifted by the same delta). Fixture digests are in the receipt; the files are not committed. Everything else is player input.
- Agent-verified, not human-reviewed.

## Not done / gaps
- Earlier wording fixed: the pack's placement-test note said "Your answers are not scored here"; it now says Nora hands the marked test back from the third day (old saves keep the old note).
- Practical subjects (Kyron's combat class, Xvim's shaping) are not papers here; Zach's absent runs (c10) are not modelled (dial: a `variant` per run).
- Test days are fixtures and open until the month ends; a missed day is not a missed paper.
- No foreknowledge row for the test dates (adding them to `WORLD_DAY_EVENTS` would change what the restart writes; left for the calendar owner).
