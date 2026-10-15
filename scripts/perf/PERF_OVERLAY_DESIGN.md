# PF3 perf overlay: design proposal

Status: PROPOSAL, 2026-10-14. No `src/` change made; the engine-core lane owns
`src/main.js`. Target viewport: desktop 1366x768 and up; mobile deferred.

## Outcome

`?perf=1` on a local origin shows a small fixed panel during normal play, so a
playtest notices a regression without running the gate. It reads the same
quantities the gate budgets, so a number in the overlay means the same thing
as a number in a gate report.

## Gate

Enabled only when `location.hostname` is `localhost` or `127.0.0.1` and
`new URLSearchParams(location.search).get('perf') === '1'`, the same pattern as
`foundation_probe` (main.js:313). Off: no wrappers installed, zero cost.
The overlay never writes the save and is not part of save data.

## Rows (rolling 15 s window, refreshed once a second)

| Row | Source |
| --- | --- |
| Tick ms (median / max) | `performance.now()` around the `update()` call in the main timer loop (main.js `setTimeout(... update(); ...)`) |
| Render ms | Same, around the `withReadFrame` render pass (main.js:826) |
| Simulation tick ms | Around `advanceSimulation` inside the tick, so engine and DOM cost separate |
| Long tasks | `PerformanceObserver({type:'longtask'})` count and max |
| Layouts/s | Not readable in-page; show `getEntriesByType('layout-shift')` count only and label the CDP number as gate-only |
| Save KB, writes/min | Wrapper on `Storage.prototype.setItem` for the `save data` key, as in the gate |
| DOM nodes, listeners | `document.getElementsByTagName('*').length`; listener count from a counting `addEventListener` wrapper installed at startup |
| Heap MB | `performance.memory.usedJSHeapSize` where Chrome exposes it, else hidden |

Rows over the fixture budget in `scripts/perf/budgets.json` (copied in at build
time for the closest fixture: actor count picks fresh, mid or crowded) turn
amber; there is no red, since a live save is not a fixture.

## Shape

- One module, `src/perf_overlay.js`, imported dynamically only when the flag is
  set, so the bundle cost on normal loads is one `import()` branch.
- Exposes `window.__perf.snapshot()` returning the current window as JSON, so
  browser checks can read it instead of re-instrumenting.
- A "copy" button puts the snapshot on the clipboard for a bug report.

## Acceptance (when built)

- Flag off: gate numbers unchanged within noise; det identical.
- Flag on: overlay visible at 1366x768, values within 20% of the gate's for the
  same fixture; no page errors; save bytes unchanged by the overlay.
