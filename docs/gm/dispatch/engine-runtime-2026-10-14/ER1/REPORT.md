# ER1 runtime hotspot audit report

## CHECKPOINT

Complete as a read-only source audit plus headless synthetic benchmark. No implementation or browser acceptance claim. Resume from the audit's ER1-Q1 through ER1-Q4 only if follow-up is authorized. Root palette and all other lanes remain with their owners.

## Files written

| Code | File | Result |
| --- | --- | --- |
| ER1-A1 | `docs/research/RUNTIME_HOTSPOT_AUDIT_2026-10-14.md` | Top 10 likely hotspots with effort and palette mappings; all source timer sites, shim, clones/scans/JSON/DOM/listener audit; autosave envelope/path; every native main RNG call and mutable state owners; measured table and limits. |
| ER1-A2 | `docs/gm/dispatch/engine-runtime-2026-10-14/ER1/benchmark.mjs` | Runnable Node benchmark, public-test-derived synthetic fixtures; input purity, validators, consumed time and per-actor settlement assertions. |
| ER1-A3 | `docs/gm/dispatch/engine-runtime-2026-10-14/ER1/benchmark-results.json` | Raw fresh/mid/crowded measurements, shapes, bytes and environment. |
| ER1-A4 | `docs/gm/dispatch/engine-runtime-2026-10-14/ER1/source-snapshot.json` | Key audit input SHA-256 values, capture/verification times, load averages, unchanged paths check. |
| ER1-A5 | This `REPORT.md` | Lane receipt, scope, commands and open questions. |

## Findings

| Code | Finding |
| --- | --- |
| ER1-F1 | Joined time persists an entire envelope per consumed tick, beyond the nominal 60-second autosave. Native publication also scans/replaces inventory maps and refreshes many panels. READ, not timed whole-browser behavior. |
| ER1-F2 | Envelope validation clones and recursively walks retirement data; ordinary keys attempt JSON parsing and catch exceptions. A likely high-value local repair, pending isolated attribution. |
| ER1-F5 | Workspace 250 ms poll still updates geometry/layout when its work signature is unchanged. Main rule-editor poll rewrites pretty JSON. Event invalidation is a bounded proposal. |
| ER1-B5 | Crowded fixture: 1,579,124 UTF-8 bytes / 3,158,248 guard bytes; median stringify 4.2341 ms, validation 509.3587 ms, one-minute advance 132.4878 ms. MEASURED on heavily contended host. |

## Commands run and checks

Read `COMMON.md`, repo `AGENTS.md`, `PROJECT.md`, user preferences, runtime palette, save/scale review and offline audit; inspected relevant source/tests. Lightweight memory lookup only supplied preservation/ownership context; current files supplied audit facts.

Primary reproducible commands:

```sh
git status --short
git branch --show-current
rg -n 'setTimeout|setInterval|requestAnimationFrame' src index.html
rg -n 'Math.random' src/main.js
rg -n 'addEventListener|removeEventListener' src
node docs/gm/dispatch/engine-runtime-2026-10-14/ER1/benchmark.mjs
uptime
ps -Ao pid,pcpu,comm
```

Additional `rg` searches traced clones, serialization, autosave counters, boundaries and render publication; bounded `sed`/`cat` reads inspected callers and fixture contracts. A Python check counted 18 main RNG calls and 16 source interval call sites and compared listed source hashes. Report tables were generated from raw successful benchmark JSON, not estimated timings.

The first benchmark attempt failed because the synthetic persistence call omitted the player binding. Added the fixture binding and complete gameplay inventory to the lane-local harness, then reran successfully. Failed run yielded no accepted results. One lookup of a nonexistent `simulation_facts.js` was replaced by the actual `simulation_effects.js` export. No source was changed to make headless imports work.

Successful benchmark: Node v22.23.3, Apple M5 Pro, Darwin arm64, UTC 2026-10-14T04:54:27.219Z to 04:59:20.606Z. Four warmups and 31 samples per path. No personal saves, source novels, SECRETS files or private packs opened. Existing dirty documents/index/dist were preserved. Listed source hashes match at final verification. No npm tests/build, repo installs, dist write, native browser, commit or push.

## Open questions

| Code | Gate |
| --- | --- |
| ER1-Q1 | Repeat on an idle host and isolate retirement walking/exception cost. Load 695.05 during this run makes p95 and cross-size ratios unreliable as engine CPU attribution. |
| ER1-Q2 | Rebuilt fresh-origin desktop browser trace of main simulation, DOM/layout, storage and input p95. Node mock storage excludes actual localStorage and native construction/publication. |
| ER1-Q3 | Long-session timer/listener/retained-memory counts; no proven accumulation leak from source inspection alone. |
| ER1-Q4 | Any future clock/storage/RNG optimization must preserve atomic failure, ordering, save compatibility and existing absence policy. Recommendations are not accepted specs. |

No gameplay acceptance gate was closed or added by this research task. These open measurement questions do not block delivery of the requested audit.
