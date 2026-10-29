# V2 resume 4: last differing path

Committed resume 3 (`b229df259`). Coordinator run on that HEAD (204-person candidate, ch1-24 first 100 steps, build with the V2 seed patch): the
clock-aligned comparison now reports a single differing path in both runs, `skillRecords.tracked` (time-driven skill tracking, the same
class as the `Breathing` paths already normalized; `scripts/floor/run_floor.cjs` `canonical` excludes it as "time-driven skill tracking").
Normalize `skillRecords.tracked` the way the floor does, as a named excluded path in the audit (not a blanket prefix such as all of `skillRecords`; only the
tracked-record timing), and add it to the synthetic test. After that, two identical runs must report no mismatch and the 2 control steps in the batch should
score as reproducible or report a typed gap. Same grants as resume 3. Run `node --test tests/lead_replay_score.test.js`. Do not commit.
