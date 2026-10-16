# scripts/

Browser checks (`*_browser.cjs`, `systems_workshop_*.cjs`) and their tooling. Perf gate tooling lives in `perf/`.

## Run heavy work through the queue

Several sessions and lanes share this machine. Run a full `node --test` suite or a browser check through
`test_queue.mjs` so only one suite and at most two browser checks run at a time, machine-wide. Waiters run in
arrival order and see who holds a slot.

```bash
node scripts/test_queue.mjs suite -- npm test
node scripts/test_queue.mjs browser -- node scripts/village_browser.cjs
node scripts/test_queue.mjs status
```

The command's exit code is returned. Slots are directories under `os.tmpdir()/yairpg-test-queue`, reclaimed when
their owner pid is gone. Env: `YAIRPG_QUEUE_BROWSER_SLOTS` (2), `YAIRPG_QUEUE_SUITE_SLOTS` (1),
`YAIRPG_QUEUE_TIMEOUT_S` (wait limit), `YAIRPG_QUEUE_DIR`.

## Writing a browser check

Use `ui_helpers.cjs`:

- `runBrowser(async browser => ...)` launches system Chrome (override with `YAIRPG_CHROME`) and always closes it.
- `waitForPage` / `waitForSave` poll every 250 ms instead of every animation frame.
- `advanceGameMinutes`, `stepUntil`, `waitGameTime` step game time with the `?test_hooks=1` stepper
  (labeled `dev-stepped`). `YAIRPG_REAL_TIMERS=1` runs the same predicates at natural pace (`natural-pace`).
  Natural-pace evidence is a separate run, never mixed into a dev-stepped result.
- Point a check at a server with `YAIRPG_PROOF_URL`; do not hard-code a lane port.

## Measuring a check

`node scripts/measure_check.cjs <label> scripts/x_browser.cjs ...` serves this checkout on an OS-assigned port,
runs each script serially, and appends wall seconds and Chrome CPU seconds (renderer and total, sampled from `ps`)
to `$YAIRPG_MEASURE_OUT`.
