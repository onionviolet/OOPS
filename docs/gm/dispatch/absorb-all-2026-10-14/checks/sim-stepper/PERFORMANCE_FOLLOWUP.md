# Simulation performance follow-up, 2026-10-14

Coordinator accepted the earlier correctness result and set targets of 1000 ticks/s for idle/work and 200 ticks/s for combat with `render:false`. **Those targets are not met. No quiet benchmark slice was certified.** The bounded fixes below preserve transaction semantics.

## Profile and implemented fixes

P1. Captured Chrome CDP `Profiler.start/stop` around `advanceTicks(1000,{render:false})` from the committed opening fixture, headless Chrome at 1366x768, sampling interval 1000 microseconds. `before.cpuprofile` is the raw capture. [Top 15 self/total functions and source call sites](CPU_PROFILE_BEFORE.md) resolve the original source map. Baseline call: 66152.7 ms. `retiredKey` alone consumes 57055.21 ms self time, about 86%. This host was heavily contended; do not treat this capture as a quiet throughput benchmark.

P2. `1806ec91`: cache the pure retirement-key classifier per suppressed-render advance. `src/save_compatibility.js:5` reads only a string and its private constant retired-ID set. The cache is created/cleared with the existing batch flag in `src/simulation_render.js`, is disabled for normal play and `render:true`, and ends before the final render. It does not cache mutable save validation. Three focused tests check changing values, new keys, malformed retirement data, boundary reset and the uncached normal path.

P3. `3a6c7eb4`: the combat profile after P2 identified 46.32 ms self time in `is_message_log_near_bottom` over 200 ticks. Batch the log-follow layout snapshot, final scroll write and unread-control refresh under the existing flag. All log entries, counters and ordering remain. The final combat profile records 1.57 ms in the near-bottom read and 4.51 ms in final log scrolling. The browser equivalence check also compares the actual combat transcript and asserts at most two log scroll-height reads per advance. No `main.js` changes in either optimization.

The after-cache opening profile was 4857.7 ms; the final opening profile was 5574.4 ms. Different contended samples are not evidence that P3 changed core cost. See [final top 15](CPU_PROFILE_AFTER.md), `after.cpuprofile`, `after-cache.cpuprofile`, `combat-cache.cpuprofile` and `combat-after.cpuprofile`.

## Three-run benchmarks

B1. Each sample starts from the same cloned fixture on a new disposable browser context, 1366x768. Each call advances 200 ticks and includes the final render. Idle uses the opening fixture; work is native Running training; search is the native 60-second Fort search in Mountain camp, followed by idle ticks through tick 200. Combat uses the opening save with native XP set consistently to 10000000 in both XP owners to keep the combat fixture alive for 200 ticks; it enters Infested field and executes 15205 actual callbacks. This is a synthetic throughput fixture, not natural acquisition evidence.

The original bundle was preserved outside the worktree and routed into the same harness for the matched baseline. Runs were serialized. The table is the median of three runs, not the fastest run. All six canonical save hashes per scenario (three before, three after) are identical after removing only `saved_at` and `last_rewarded_export`.

| Scenario | Before ticks/s | After ticks/s | Ratio | Target |
| --- | ---: | ---: | ---: | ---: |
| idle | 20.77 | 195.79 | 9.43x | 1000 |
| work | 20.88 | 206.72 | 9.90x | 1000 |
| combat | 19.86 | 169.61 | 8.54x | 200 |
| search | 20.75 | 200.12 | 9.64x | not set |

Raw data: `matched-before-benchmark.json`, `matched-after-benchmark.json`, `performance-comparison.json`. Earlier settling-host triplicates are retained separately as `before-benchmark.json` and `after-benchmark.json`; they are not the primary comparison.

Q1. Quiet certification remains OPEN. The harness required at least 85% CPU idle, load no higher than 18 logical cores and at least 1024 MiB free. A bounded 12-attempt quiet baseline failed before its first measurement. A later post-verification probe still showed only 71% CPU idle (load 6.61, 2233 MiB free), with no lane benchmarks/tests running. A quiet slice was requested from the coordinator; no other sessions or user apps were stopped. The medians above are explicitly provisional contended-host measurements.

## Structural costs and smallest safe next fixes

S1. `persistExpansionPlan`, `src/expansion_persistence.js:7`, consumes 2200.43 ms inclusive across the final 1000-tick idle profile, about 2.20 ms/tick in this run. Its required path creates the native envelope, overlays the staged state, validates that new envelope, serializes it, writes durably and only then publishes. `validateSaveEnvelope` (`src/save_files.js:49`) accounts for 844.09 ms; `create_save` (`src/main.js:5457`) for 416.49 ms; the native `lifeSaveStorage.setItem` adapter (`src/main.js:452`) for 504.32 ms. These inclusive totals overlap and must not be added. The transaction path alone exceeds the 1 ms idle budget on this measured host.

**Proposed smallest safe change, not implemented:** add an object-form commit adapter between `persistExpansionPlan` and the native life-save owner to remove the redundant stringify/parse round trip, with an explicit ownership/copy contract. Keep the current validation order, life observations, exact serialized bytes, guarded write and publication-after-success ordering. Prove malformed-envelope rejection and failed-write atomicity against the existing string path before enabling it. Full validation of each new mutable envelope cannot be cached for an entire advance. If it still exceeds budget, split static schema/key checks from mutable-domain checks with explicit revisions and full fallback for unknown domains. Do not skip or defer transactions.

S2. `featureWaveContext` (`src/main.js:1680`) consumes 1950.67 ms inclusive, and `simulationNativeContexts` (`src/main.js:1025`) 940.82 ms. These reconstruct many dependent derived fact frames repeatedly. They include live XP, inventory, vitals, location and calendar dependencies, so a cache keyed only by state identity or by advance would be unsafe.

**Proposed smallest safe change, not implemented:** a read frame scoped to one unchanged transaction-planning phase, explicitly invalidated at staged binding changes and before every native/expansion publication. Pass the frame to existing context builders without changing consumer order. This belongs with P00/the host-publication owner; this lane did not rewrite that shared main.js path or assume its dependencies immutable.

## Verification

V1. Final build passes. Tested bundle SHA-256: `9c5e0401501b4c86280f8ceead98f08be0e4e6cb4005ed0a33b7f3295e24df4b`. Full suite passes **991/991**, zero failures, in 33724.42 ms: `YAIRPG_FIXTURE_TIMEOUT_MS=180000 node --test --test-concurrency=2 tests/*.test.js`. This is the complete package test glob with bounded worker count, not a subset. The three additional cases test the classifier cache.

V2. All six normal-timer versus stepper comparisons pass, now with explicit serialized-byte equality as well as structural equality. The next live speed-1 tick after each advance matches too. Combat transcript equality and the layout-read bound pass. Fresh unflagged play, old-save load and reload pass; helpers remain absent on the normal URL. Evidence: `equivalence-speed.json`; complete test saves/screenshots remain in `/tmp/sim-stepper-equivalence`.

V3. Workshop: 10 native groups, zero page errors, 55.67 s. Fort: 12 native groups, zero page errors, 16.02 s. Both target 1366x768 and retain save/reload and literal-file import assertions. Artifacts: `/tmp/sim-speed-workshop`, `/tmp/sim-speed-fort`. No persistence schema, migration, durable-write cadence or publication ordering changed.

The remaining performance gates are a certified quiet-machine rerun and the 1000/200 targets. This is an approximately 8.5x to 9.9x provisional throughput improvement, not speed acceptance.
