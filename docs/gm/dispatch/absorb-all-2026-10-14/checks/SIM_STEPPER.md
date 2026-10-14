# Simulation stepper

SIM1. Build and serve this worktree on 127.0.0.1:18950. Open
`http://127.0.0.1:18950/?test_hooks=1`, click PLAY, finish character creation,
and await the writable save owner. `config.enable_dev_mode` also enables the
helpers. Other hosts and a normal local URL expose neither helper.

```js
advanceTicks(600);                 // synchronous, one final display refresh
advanceTicks(600, {render: true}); // diagnostic: retain intermediate rendering
simulationTestHooks.snapshot();   // parsed create_save(), no manual-save reset
```

SIM2. The count means main engine ticks at the current tickrate, not minutes
of travel or a separate accelerated economy. Each tick runs `simulateTick()`
through its existing timer callback. Due action intervals and combat attack
callbacks run in deadline order through their actual callbacks. A sleeping
clock can consume several game minutes per tick. Integers 0..1,000,000 are
accepted. Calling before PLAY throws. Zero does nothing. Calls do not yield.
`simulationTestHooks.pause()` freezes engine timers between harness actions;
`resume()` returns them to live timers. Pause only after initialization and
ensure discovery/UI readiness explicitly when using it.

SIM3. Default rendering batches state-derived panels, skill bars, vitals,
inventory, workspace and attack bars. Gameplay/stat updates and durable joined
transactions still execute. This does not suppress every incidental DOM write
or replace UI animations. Autosave/backup counters keep their normal cadence;
a batch coalesces each due autosave key to one final write and reports
`{ticks, callbacks, autosaves}`. No unconditional save is added. Existing
transactional writes stay durable rather than acknowledging unsaved changes.
Save format, migrations, storage ownership and player save files are untouched.
The scheduler and pause/speed settings are never serialized.

SIM4. Harnesses:

- `node scripts/simulation_stepper_browser.cjs`: exact whole-save comparison of
  normal speed-1 timer callbacks and stepping, including combat, timed actions,
  paid work and an autosave boundary; fresh unflagged smoke and old-save load.
- `node scripts/systems_workshop_browser.cjs`: workshop native journey.
- `node docs/gm/dispatch/absorb-all-2026-10-14/checks/fork-fort/browser.cjs`:
  Fort route, including partial progress, crafting, combat and file import.

The two journey checks use `scripts/simulation_check_helpers.cjs` for their
existing predicates. Set `YAIRPG_REAL_TIMERS=1` and
`YAIRPG_PROOF_URL=http://127.0.0.1:18950/` for their timer baseline.
`YAIRPG_PROOF_DIR` selects disposable artifacts. Workshop additionally accepts
`YAIRPG_START_FIXTURE` for repeatable benchmark input. All checks target
1366x768; mobile is deferred.

SIM5. The equivalence harness supplies a deterministic browser timer queue to
the normal, unflagged bundle, preserving its original timer callback paths,
then compares against stepping from the same disposable fixture. It excludes
only `saved_at` (formatted wall time) and `last_rewarded_export` (wall-clock
export incentive). Played time, calendar, RNG streams, inventories, XP,
quests and partial combat/action progress remain in the comparison. Its timer
queue is test instrumentation, not a second gameplay implementation. Screenshots
and complete comparison saves go to `/tmp/sim-stepper-equivalence`.

The existing alloy native fixture has an optional
`YAIRPG_FIXTURE_TIMEOUT_MS` override; its default stays 60000 ms. On a heavily
loaded host the full test set can run with bounded workers:

```sh
YAIRPG_FIXTURE_TIMEOUT_MS=180000 node --test --test-concurrency=2 tests/*.test.js
```

Put Node runner flags before test paths. Appending them through `npm test --`
does not bound this package's workers.

Performance follow-up: [profiles, three-run medians, limitations and structural
next fixes](sim-stepper/PERFORMANCE_FOLLOWUP.md). The per-advance cache covers
only immutable retirement-key classification; mutable save validation still runs
on each transaction. Combat log-follow geometry and scrolling are batched.

```sh
node scripts/simulation_stepper_profile.cjs --profile after
YAIRPG_PROFILE_SCENARIO=combat YAIRPG_BENCH_TICKS=200 node scripts/simulation_stepper_profile.cjs --profile combat-after
node scripts/simulation_stepper_profile.cjs --bench matched-after
YAIRPG_BENCH_BUNDLE=/path/to/original/bundle.js node scripts/simulation_stepper_profile.cjs --bench matched-before
node scripts/simulation_stepper_profile.cjs --compare matched-before matched-after
```

Benchmark samples default to 200 ticks, three fresh contexts per scenario. The
profiler defaults to 1000 opening ticks. `YAIRPG_QUIET=1` requires a quiet preflight
before every sample and fails if one is unavailable; an unset flag never claims
quiet certification. Set `YAIRPG_BENCH_BUNDLE` to the baseline bundle to replay
it without changing branches. To re-summarize an older `.cpuprofile`, provide its
matching bundle and adjacent `.map` with that same variable, then use
`--summarize <label>`; current maps must not be applied to older profiles.
