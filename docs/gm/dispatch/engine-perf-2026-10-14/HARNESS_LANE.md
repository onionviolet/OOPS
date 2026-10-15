# Engine-perf harness lane, 2026-10-14

Test tooling only; no `src/` edits. Implements audit findings T5-T8 and D2 from
`docs/research/BROWSER_TESTING_AND_ENGINE_PERF_AUDIT_2026-10-14.md` (branch
`claude/engine-perf`). Base: `6e5f190f` (= `absorb-all/integration` at start).

## What changed

- `scripts/ui_helpers.cjs` gained the shared harness:
  - `launchChrome()`: `YAIRPG_CHROME`, then system Chrome, then Playwright's
    bundled Chromium. Playwright resolves from `YAIRPG_PLAYWRIGHT`, then
    `playwright`, then the Codex runtime path. Headless.
  - `runBrowser(fn)`: launch, run, and close in `finally`.
  - `waitForPage(page, pred)`: `waitForFunction` at 250 ms polling, not rAF.
  - `waitForSave(page, pred(save, arg))`: 250 ms polling, one `JSON.parse` of
    the save per poll, predicate compiled once per page.
  - Dev-stepped time through the `?test_hooks=1` stepper (`67c7f15c`):
    `withTestHooks(url)`, `advanceGameMinutes(page, n)` (reads the game
    calendar, so sleep cannot undercount), `stepUntil(page, pred)` (one tick at
    a time inside one `evaluate`). `YAIRPG_REAL_TIMERS=1` turns all three into
    natural-pace waits with the same predicates. `timeMode()` labels results
    `dev-stepped` or `natural-pace`.
- `scripts/village_browser.cjs`: shared launcher and `finally` close, 1366x768,
  dev-stepped game-time waits (8 waits, 2 fixed sleeps), `timeMode` in
  `result.json`.
- `scripts/everyday_browser.cjs`: shared launcher and `finally` close,
  1366x768, 12 rAF waits moved to 250 ms polling. Stays natural pace (see F3).
- `scripts/systems_workshop_browser.cjs`: shared launcher, `timeMode` in
  output, rejection sets exit code. Kept minimal because lane int-fix edited
  this file on integration the same hour.
- `scripts/simulation_check_helpers.cjs`: its natural-pace fallback now polls
  at 250 ms instead of every frame.
- `docs/gm/dispatch/absorb-all-2026-10-14/FINAL_GATE.proposed.sh`: corrected
  runner pattern (T5). `FINAL_GATE.sh` is untouched.

## Stale harness assumptions fixed (same intent, same strength)

- `getByText('Talk to someone')` now also matches the elder's Village life
  quest text (`99b207e6`/`f52344c7`), a strict-mode violation. Replaced with
  `getByRole('button', {name: 'Talk to someone'})` in village and everyday.
- An injected `QuotaExceededError` shows the storage-full notice added in
  `73519a0a` ("Your browser has no room for this life..."), not "saving
  failed". Village and everyday now assert that exact notice. It fails the same
  way at natural pace, so stepping did not cause it.

## Evidence

Rebuilt bundle `v0.6-cbda4592f8d0` (fingerprint asserted against `index.html`),
served from this worktree on an OS-assigned port, fresh `newContext` per
segment, 1366x768, system Chrome headless. Host load swung 12-240 from other
lanes; each figure carries its load.

| Check | Before | After |
| --- | --- | --- |
| village | Fails at launch (no `playwright` module). With Chrome forced: stale selector at line 79 | 5/5 pass dev-stepped: 29.7, 27.7, 30.0, 33.5, 34.1 s (load 15-40). Natural pace 1/1: 56.7 s |
| systems workshop (already dev-stepped by `67c7f15c`) | 10/10 cases, 83.8 s and 87.1 s (load 25-40) | 10/10 cases, 3/3 runs: 79.6 s (load 27), 112.8 s and 143.0 s (load 31-96) |
| everyday | Stale selector at line 45 | 3/3 pass natural pace: 139.2 s (load 191), 109.5 s, 110.6 s (load 25-30) |

- F1. Workshop wall time is engine work, not harness waiting. Its 59 actions
  take about 1.1 s each because each tick and click re-renders a developed
  save (audit M1). The launcher swap does not change that. The before/after
  spread is load.
- F2. Injected assertion failure inside `runBrowser`: 1 Chrome child while
  open, 0 alive after the throw, 0 children before exit. The old launch-then-
  throw pattern left 1 Chrome alive until Node exited.
- F3. Dev-stepping everyday failed 4/4 at its commission-then-interrupt step,
  under load 70-240. Live `?test_hooks=1` timers keep running and end the
  craftsman's bench job before the click lands. Stepping does not leave the
  page busier: 21.3% main-thread busy before `advanceTicks(30)`, 20.2% and
  20.7% after; the 30 minutes took 370 ms instead of 30 s. The structural fix is to pause live
  timers (`simulationTestHooks.pause()`, as the workshop does) and step
  explicitly. A trial showed both village and everyday rely on implicit live
  ticks (Notebook reveal after dialogue, craftsman availability), so that
  conversion is follow-up work, not done here.
- F4. `waitForSave` cost, `baseline.cjs` plus `waitForSave` windows, fresh
  idle game. Interleaved A/B, 6 rotated windows of 10 s each (load 15-110):
  renderer script time mean **1272 ms** `waitForSave`, **1512 ms**
  `polling:250`, 1293 ms plain idle. Sequential 15 s windows (4 runs) were
  within idle noise in both orders (1704-2212 vs 1643-2063 ms; idle windows
  1530-2447 ms). rAF polling of the same predicate: 1790-2594 ms.
- F5. Gate pattern, run as a stub gate with the proposed functions: two
  concurrent gates got different OS ports, 4 servers alive mid-run, 0 after;
  a failing group retried alone with "(retry)" marking; SIGTERM mid-run exited
  130 with 0 servers left.

## Open

- Hold-time conversion for village/everyday (F3), then dev-step everyday.
- Remaining `*_browser.cjs` scripts: 14 of 32 still use per-frame
  `waitForFunction`; 8 lack `finally`. Migrate as lanes touch them.
- Coordinator decision on adopting `FINAL_GATE.proposed.sh`. Its check specs
  drop fixed ports and use `{PORT}` where a URL needs `?test_hooks=1`.
