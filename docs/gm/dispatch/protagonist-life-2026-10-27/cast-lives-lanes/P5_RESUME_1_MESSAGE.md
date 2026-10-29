# P5 resume 1: two full-suite failures after integration (coordinator, 2026-10-29)

The coordinator applied `P5_INTEGRATION.patch` and F1's patch, then ran the full `npm test`: 3906/3908. Both failures
point at P5's skipped boundaries. Log: `/private/tmp/claude-501/-Users-weiwei-code-yet-another-idle-rpg/bf0faa81-7a24-47b8-b1ee-6f706b97f36d/scratchpad/npm_test_p5f1.log`.

1. `tests/routine_jobs.test.js:39` ("SOURCE reserve 4 and held 3 ... released 2 starts one frozen batch"), line 43:
   after the kit stock drops to 2 and the clock advances 1 minute, `stockHold` stays `true` (expected `false`). The
   work plan reports `workPlanNextBoundary === Infinity` while held and relied on an ordinary minute boundary to
   re-check stock. Stock changes outside authored actor-fact effects (inventory spends, trades, tests that set
   inventory). **Treat this as a behavior change, not a test premise**, unless you can show the old behavior was
   itself incidental and no player route depends on it: a held plan must release when stock drops, within the same
   minute it did before. Fix in the scheduler (for example, the work-plan owner exposes a stock wake, or a held
   plan keeps the one-minute poll), with the original-poll comparison dial proving equivalence on this fixture.
2. `tests/story_spine_qa.test.js:13`: `assert.ok(a.budgetReturns>0)` fails: the seeded story run no longer drains
   the boundary budget. Decide from the test's intent (it guards draws and receipts across seed, chunking and
   reload): if the budget return was only reached through idle polls, change the fixture to reach it through real
   work, as you did for `tests/simulation.test.js`, and say so; if draws or receipts changed, that is a defect.

Owned files: your original grant plus `tests/routine_jobs.test.js` and `tests/story_spine_qa.test.js` (and the
work-plan source if the fix lives there: name it in the checkpoint; prepared patch if it is a shared world file).
Run both files, your focused set and the headless equivalence test; update `P5_CHECKPOINT.md`. Do not commit.
