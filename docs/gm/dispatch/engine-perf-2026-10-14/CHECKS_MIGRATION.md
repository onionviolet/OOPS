# Browser-check migration (wave F), 2026-10-15

Scope: `scripts/*_browser.cjs`, `scripts/systems_workshop_*.cjs`, new `scripts/test_queue.mjs`,
`scripts/measure_check.cjs`, `scripts/README.md`. No `src/` or `scripts/perf/` edits.

## What changed

- All 32 scripts: `chromium.launch` and the per-script Playwright require became `launchChrome()`
  from `ui_helpers.cjs`; every `waitForFunction` became `waitForPage` (250 ms polling, not rAF).
  The 8 scripts with no `finally` (bio, body, chronicle, helpers, notebook, people, simulation, town) now
  close the browser in `finally`. The workshop-boundaries script lost its hard-wired Playwright path;
  upstream_dev and simulation_stepper read `YAIRPG_PROOF_URL` (same default port as before).
- `ui_helpers.cjs`: new `waitGameTime(page, ms)`, a drop-in for a sleep that only waits for game time.
  dev-stepped: runs the ticks that `ms` would have produced at the current tickrate (rendering on).
  `YAIRPG_REAL_TIMERS=1`: real sleep (natural-pace, same assertions).
- Dev-stepped (`?test_hooks=1` added through `withTestHooks`): absorb_B, E1, E2, E3, absorb, field,
  frontier_campaign, pursuit, promise, events, chronicle (sleeps of 600 ms and up). Other scripts keep
  natural-pace sleeps because they could not be verified passing (below). Sleeps under 250 ms that settle
  page load are unchanged.
- Stale selectors/text fixed with the same intent (same pattern as the harness lane): 14 scripts
  `getByText('Talk to someone')` to `getByRole('button',{name:'Talk to someone'})`; events_browser feed
  selectors target the "Recent news" list (the feed now has three lists); chronicle expects the storage-full
  notice ("Your browser has no room for this life") for its injected quota error.

## Before / after (paired runs, same bundle, fresh origin per context)

Rebuilt bundle `v0.6-ee4dfe12abfe` served from this worktree on OS-assigned ports, `private_packs` linked
read-only, headless system Chrome, one browser at a time, through `test_queue.mjs`. "Before" is the
`HEAD` copy of each script run immediately before the migrated one. Cell: result, wall, renderer CPU s,
total Chrome CPU s (all Chrome processes), host load. The viewport is each script's own (1500x1000 to
1600x1100); the 1366x768 target was not applied because several assertions are layout-dependent.

| Script | Before | After |
| --- | --- | --- |
| absorb_B_browser.cjs | pass 8 s / 1.3 / 7.9 (load 8) | pass 5.9 s / 5.1 / 7.7 (load 8) |
| absorb_E1_browser.cjs | pass 10.1 s / 4.2 / 8.5 (load 8) | pass 8.2 s / 5.6 / 8.5 (load 7) |
| absorb_E2_browser.cjs | fail 6.3 s / 1.3 / 5.7 (load 7) | pass 8.9 s / 6.7 / 9.9 (load 8) |
| absorb_E3_browser.cjs | pass 17.3 s / 1.4 / 14.1 (load 8) | pass 10.3 s / 8.5 / 13.8 (load 8) |
| absorb_browser.cjs | fail 7.1 s / 3.3 / 7.7 (load 8) | pass 8.9 s / 2.8 / 11.7 (load 8) |
| field_browser.cjs | fail 4.1 s / 3.4 / 5.3 (load 8) | pass 110.7 s / 65.4 / 77.4 (load 6) |
| frontier_campaign_browser.cjs | fail 4.9 s / 3.4 / 5.2 (load 6) | pass 79.3 s / 41.5 / 53.6 (load 6) |
| pursuit_browser.cjs | fail 4.3 s / 2.7 / 4.4 (load 6) | pass 74 s / 39.4 / 67.3 (load 7) |
| events_browser.cjs | fail 22 s / 0 / 11.9 (load 35) | pass 26.2 s / 13 / 24.3 (load 25) |
| chronicle_browser.cjs | fail 38.9 s / 14.8 / 26.3 (load 16) | pass 46.4 s / 9.9 / 30.5 (load 27) |
| observation_browser.cjs | pass 39.1 s / 17.5 / 35.5 (load 19) | pass 39.9 s / 15.9 / 33.1 (load 16) |

Reading it honestly:

- Where `HEAD` passed (absorb_B, E1, E3, observation) wall time fell 1.0 to 7 s on the short scripts
  (E3 17.3 to 10.3 s, B 8.0 to 5.9 s). CPU totals are equal within noise. Those scripts had only 1 to 2 s
  sleeps, so the gain is small.
- Where `HEAD` failed early on the stale selectors, "before" is time to failure, not a comparable total.
  The after figures are the first complete passes: field 111 s, frontier 79 s, pursuit 74 s, chronicle 46 s.
  Their remaining time is natural-pace waits (commission/job timers, up to 40 s each) that still use
  `waitForPage`/`waitForSave`; converting those needs pause-and-step (see F3 in HARNESS_LANE.md).
- Renderer CPU is sampled from `ps` every 200 ms and is unreliable below about 10 s (short-lived renderers
  are missed); use the total column for CPU comparisons. Host load varied from 6 to 35 from other lanes.
- Earlier passes during load 250 to 600 timed out on page load in about 12 scripts and were discarded.

## Status of every script

Pass after migration (14): systems_workshop_browser, systems_workshop_persistence, absorb_B, E1, E2, E3,
absorb, field, frontier_campaign, pursuit, promise, events, chronicle, observation. (absorb_E2 and absorb
flipped once under load 100+ before passing in the paired run; they use real-time sleeps.)

Migrated but still failing, and failing at `HEAD` too (13), not fixed here because it needs
product-intent decisions or live debugging: absorb_C1, C2, D, combined (stale expectations);
exchange (20 s wait on a job that never ends); helpers and simulation (PLAY button hidden after the
loading screen with their fixture saves); notebook (`#adventure_notebook` count 0); party, people, town
(`town.brief` stays disabled after travel, so travel completion needs a wait); systems_workshop_boundaries
(assertion false). simulation_stepper passed at `HEAD` only against a hard-coded 18950 server of unknown
bundle; on this bundle it fails at "Invalid tick count accepted", which looks like engine behavior, not harness.

Cannot run here (fixtures absent): bio, body (need a generated bio-review save under `~/.codex/visualizations`),
storage, promise_focus (need a 2026-10-04 seed), systems_workshop_legacy, upstream_dev (need the `.proof-old`
client worktree that the final gate builds). They are migrated (launcher, waits, finally) and parse; they
are implemented-unverified.

## Injected failure and queue evidence

- `runBrowser` throw: 8 descendants while open, 0 Chrome after (harness probe).
- Bad-URL runs of town, bio, events and simulation (four scripts, three of them newly wrapped in `finally`):
  exit 1 in about 1 s, no Chrome pid left alive after each run (measure_check leak check).
  All 22 paired runs also finished with no leaked pids.
- `test_queue.mjs`: three concurrent `suite` requests ran one after another in arrival order (3 s jobs
  started at +0, +3.4, +6.7 s); with 2 browser slots the third waiter started only after one finished; exit
  code 7 propagated; a SIGKILLed wrapper's slot was reclaimed on the next call.

## Migration note for docs/gm/dispatch/*/checks (not edited here)

Those check scripts launch Chrome with their own `chromium.launch`. To adopt the harness: require
`../../../../scripts/ui_helpers.cjs`, use `launchChrome()` (or `runBrowser(fn)`), swap
`page.waitForFunction` for `waitForPage`/`waitForSave`, swap sleeps that only wait for game time for
`waitGameTime`, take the URL through `withTestHooks(process.env.YAIRPG_PROOF_URL||...)`, and replace
`getByText('Talk to someone',{exact:false})` with the role selector. Run them through
`node scripts/test_queue.mjs browser -- node <check>`. FINAL_GATE.proposed.sh can wrap each check the same way.
