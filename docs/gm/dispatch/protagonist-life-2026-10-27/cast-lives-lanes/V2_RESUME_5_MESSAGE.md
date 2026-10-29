# V2 resume 5: act timestamps differ because the natural clock keeps running between actions

Committed resume 4. Coordinator run on the whole-book acts pack (be seat, ch1-24 mapping regenerated with `--pack`, 150 steps): 10 control rows, 17 waits,
123 gaps; the 10 controls run, but the two fresh runs differ only in timestamps of the acts they performed:
`expansion.simulation.knowledge.player.book.lotm.emergent.5.at`, `.emergent.6.at`, `...place.act.<id>.result.at` (two acts), `expansion.simulation.log.2.at`, `log.3.at`.
Because the natural clock runs during the real-time gaps between clicks, each run starts each act at a slightly different game minute. For a reproducible
replay (CLR8, CLR13) the driver must make game time depend only on the replay's own steps: keep the simulation paused (`simulationTestHooks.pause`) except
while it advances an act's quoted minutes or a wait's minutes by stepping the clock explicitly with the existing hooks (find the step/advance hook used by
the floor and the tests: `rg "simulationTestHooks" src tests scripts | head`), so both runs issue every action at the same game minute and the
timestamps match. If the hook set cannot do this, write the smallest prepared `V2_INTEGRATION.patch` (src is outside your grant; it must be hook-only and loopback-only
like the seed patch) and explain it. Keep the existing clock-alignment path as a fallback. Done when two identical replay runs report no mismatch and
the controls score as reproducible (synthetic test: identical runs pass, a run whose act ran one minute later fails). Grants as resume 4. Run
`node --test tests/lead_replay_score.test.js`. You cannot run Chrome; the coordinator will. Do not commit.
