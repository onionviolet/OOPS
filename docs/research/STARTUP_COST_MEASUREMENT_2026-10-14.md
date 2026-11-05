# Startup cost measurement (PF4), 2026-10-14

Status: measurement and proposals only. No build or gameplay change landed. Tool: `node scripts/perf/startup.mjs [--runs N] [--fixtures fresh,crowded]` (serves the built tree, fresh origin, 1366x768, cold = empty cache, warm = same-origin reload).

## Caveat on the numbers

The host ran at load average 100-200 (other waves) during every run. Wall times varied 1.3-2.5 s for the same build. Treat the table as relative evidence; rerun on a quiet host before quoting.

## Baseline (base bundle 5,545,241 B, median of 3)

| Case | load event | PLAY visible | PLAY-ready | V8 compile |
| --- | ---: | ---: | ---: | ---: |
| fresh, cold | 1357 ms | 1413 | 2993 | 298 ms |
| fresh, warm | 481 | 1091 | 1549 | 128 |
| crowded, cold | 517 | 4202 | 4650 | 312 |
| crowded, warm | 394 | 3932 | 4398 | 118 |

Bundle download from localhost is about 68 ms; transfer is not the cost here. Warm compile drops 2.3x because Chrome caches the compiled code.

## Where the time goes (CDP sampling profiler mapped through the source map)

Fresh game, load to PLAY visible, about 465 ms of sampled JS:
- `createContentRegistry` / `createSimulationRegistry` (module-level registries, src/expansion_engine.js:316, src/simulation_contracts.js:101): about 183 ms inclusive. Mostly validation (`assert`, `validateSimulationEffect`, `validatePredicate`) plus clone and freeze. `compileStructuredPack` (src/structured_pack_definitions.js:34) is about 84 ms of it.
- main.js top-level wiring: about 378 ms inclusive (includes the above).
- Compile of the 5.5 MB script: 300 ms cold, 120 ms warm (not in the JS profile).

Crowded fixture, load to PLAY visible, about 2.5-4.4 s of sampled JS, almost all in `src/simulation_render.js` (2.7 s inclusive: simulationFacts, world_completion_facts, refinements host, feature_expansion_ui, known_routes_ui). That is render-path work on a big state, owned by the render lane, not bundle size.

## What does not help (measured)

- JSON as `JSON.parse("...")` (esbuild plugin): CONTRACTS.json, VOICE_CUES.json and the Ink story each cost under 1 ms to evaluate as literals in Node (cpuUsage, 15 runs). The plugin added 15 KB and no measurable gain. Reverted.
- esbuild `splitting`: there is no `import()` call in src, so nothing would split. The big inputs (CONTRACTS.json 5%, main.js 4%, ink.mjs 2.5%) are small shares of a bundle that is mostly several hundred modules of content; lazy-loading one JSON saves at most 262 KB of 5.5 MB and about 1 ms of evaluation.
- `legalComments`: left alone (Ink notices are handled separately; license-sensitive).

## Why 0.6x is not reachable from build.js alone

PLAY-ready on a fresh game is about 40% compile (fixed by size), 40% module-evaluation (registry validation and wiring), 20% first render. Build options touch only the first. The crowded load is dominated by render of a large state, which no bundle change affects.

## Patch proposals (owned by other lanes; not applied)

1. **Skip authored-content validation in the shipped bundle** (about 150 ms of the 465 ms). Add `define: {__DEV_VALIDATE__: 'false'}` to build.js's esbuild call and guard the validate loops in `createSimulationRegistry`, `createContentRegistry` and `compileStructuredPack` with `if(__DEV_VALIDATE__)` (declare `globalThis.__DEV_VALIDATE__ ??= true` for Node so tests keep validating). Content is static, so the node tests already prove it valid; the browser only needs clone and freeze. Owner: engine state / core seam lane. Alternative with no semantic risk: validate lazily after PLAY via `requestIdleCallback`.
2. **Defer per-world registries behind `import()`** (main.js import change, lane A). Needs the eager registry/runtime links broken first (ER2-F3: SCCs of 55 and 36 modules). Once an `import()` exists, add `splitting: true, outdir: 'dist', chunkNames: 'chunks/[name]-[hash]'` to build.js and change the index.html script tag to `dist/main.js`; I can do that build.js half on request.
3. **Crowded load**: first render computes simulationFacts for panels not yet visible. Defer non-visible panels past first paint (render lane / D1 follow-up).
4. Hosting: serve `dist/bundle.js` with long-lived cache headers and brotli (1.4 MB gzip vs 5.5 MB raw) so cold load approaches warm.

Not run: old-save load tests, systems workshop check and `node --test`, since no shipped file changed (only `scripts/perf/startup.mjs` and this note were added).


## Content reconciliation B309: measured scope and conditional proposals

All PF4 baseline, profiler, experiment, decomposition and four proposal sections were content-reviewed. Keep this as a dated measurement: exact old bundle, fresh/crowded fixtures, cold/warm conditions, three-run medians and severely loaded host. Load event, PLAY visible and PLAY-ready measure different intervals. Inclusive registry, compileStructuredPack and main-module times overlap; adding them would double-count. The approximate40/40/20 shares and the0.6x build-only conclusion describe this input and instrumentation, not a present lower bound or guaranteed performance gain. Localhost transfer and warmed Chrome compilation do not establish remote hosting, another browser or today's bundle.

The rejected JSON plugin and absent dynamic-import experiments retain their then-current scope. Sub-millisecond Node literal evaluation does not certify full browser parsing, initialization or future larger content. A stale source assertion about no import() calls is not a current code review. Long cache lifetimes require correct asset identity/invalidation; compressed transfer is not automatically a warmer evaluation/render cache. Retain legal notices and upstream attribution.

The validation-skipping proposal needs a selected admission and trusted-input boundary; an old test run does not certify different shipped inputs, runtime packs or mutable content. Lazy idle validation cannot safely discover invalid data after its effects were already admitted. Deferring registry work or offscreen rendering must retain initialization ordering, side effects and actual state/knowledge consumers, and distinguish faster first paint from delay at first useful action. These are useful conditional options, not selected patches or a requirement to optimize before the next playable slice. Current desktop targets qualify the old1366 measurement viewport. No benchmark, build, script, runtime or test was run by this review.
