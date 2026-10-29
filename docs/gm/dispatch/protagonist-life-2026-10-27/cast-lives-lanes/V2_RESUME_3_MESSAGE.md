# V2 resume 3: compare at a fixed game minute

Committed `V2 resume 2`. Coordinator run (scratch build of HEAD, 204-person candidate pack, ch1-24 first 100 steps): the two fresh be lives
now differ only at `current time.minute`, `expansion.clock` and `expansion.simulation.controllers.village.craftsman_controller.due`:
they are read at slightly different game minutes because the natural clock keeps running between the runs' last actions and the snapshot.
Make the snapshot comparison clock-aligned: after the last replay action of a run, pause the simulation through the existing test hook
(`simulationTestHooks.pause`) and then read both the snapshot and its clock; compare two runs at the larger of the two clocks by
stepping the run that is behind forward with the existing test hook to that exact minute while paused (no natural clock between), or, if the hook
cannot step to an exact minute, record each run's clock and compare only the state paths that do not depend on the clock, listing the
excluded paths in the audit. The `craftsman_controller.due` path is clock-derived and belongs with the clock. The goal: identical runs report
no mismatch and score as reproducible, a deliberately different run still reports a mismatch (synthetic test). Grants as V2 resume 2
(driver, `tests/lead_replay_score.test.js`, `V2_CHECKPOINT.md` "Resume 3"); a prepared `V2_INTEGRATION.patch` change only if a hook is missing. You cannot run Chrome. Do not commit.
