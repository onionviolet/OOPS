# Electron and Rust assessment

2026-11-05. Advisory response to Weibao's question about Electron efficiency and
Rust. Applies AD39, AR3/AR4 and the existing TS11/TS13 comparison in the
[stack owner](../ENGINE_RUNTIME_PERFORMANCE_AND_STACK_CONSIDERATIONS_2026-10-14.md#programming-language-and-stack-round-7-ts10-ts17-2026-10-25).
No new accepted decision or migration authorization (AD32; AD39 stays the stack direction).

Follow-up: Weibao authorized an experiment on Nov 6. See the
[measured Electron/Tauri comparison](shell-comparison-2026-11-06/REPORT.md) for
new evidence; the unmeasured statements below describe this Nov 5 assessment.

## Findings

- F1: Electron is the desktop host; game logic and DOM UI remain JavaScript.
  `desktop/README.md`, `desktop/preload.cjs` and `src/host.js` show a bounded
  host bridge. Changing the shell would not itself port simulation to Rust.
- F2: The current source disables background throttling by default in
  `desktop/host_context.cjs` to keep the clock running. This is a concrete
  battery investigation target, not a measured battery result. Allowing timer
  throttling needs progression/catch-up checks before becoming a player default.
- F3: The Oct 25 headless profile recorded copying, save planning and harness
  DOM traversal costs. It is historical, includes harness overhead, and does
  not establish current desktop bottlenecks. No matched Electron/Tauri CPU,
  memory, battery or startup benchmark exists in that assessment or this pass.

## Recommendation, proposed

Keep Electron for now. Measure the same synthetic game fixture during startup,
visible idle, active work and minimized play before selecting optimizations.
Separate host/process-tree memory, simulation, rendering and save costs. Fix
measured waste in the existing implementation first. A Tauri shell experiment
can retain the web game, but must compare equivalent state and host features,
including save recovery, menus, pop-outs, window lifecycle and rendering.
Consider a Rust/WASM kernel if a measured compute-heavy operation justifies its
conversion and integration costs. A native Rust UI rewrite is a larger separate
choice and has no demonstrated performance justification here.

Electron bundles Chromium and Node
([official introduction](https://www.electronjs.org/docs/latest/)); Tauri uses
platform webviews and a Rust core
([official process model](https://v2.tauri.app/concept/process-model/)). Thus
Tauri can reduce bundled runtime size, but CPU, RAM, battery and game speed
improvements remain hypotheses for OOPS until measured.

## Verification

- Read-only source inspection at HEAD `958740e92`, with existing dirty dist,
  index.html and work/ preserved; no app launch or personal-save access.
- Inspected desktop host/adapter and existing stack assessment; consulted
  official Electron/Tauri documentation. No runtime or installed-state claim.
- Documentation-only addition; checked relative links resolve. No build or
  runtime tests needed for this advisory note.
