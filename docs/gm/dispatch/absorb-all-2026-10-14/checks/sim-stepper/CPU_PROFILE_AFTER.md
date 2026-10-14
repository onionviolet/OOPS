# CPU profile after the two bounded fixes

Profile: `after.cpuprofile`, engine commit `3a6c7eb4`, 1000 opening-fixture ticks, 5574.4 ms. This is a sampled contended-host run, not quiet-machine certification.

## Top 15 by self time

| Function | Call site | Self ms | Total ms |
| --- | --- | ---: | ---: |
| `persistExpansionPlan` | `../src/expansion_persistence.js:7:17` | 368.66 | 2200.43 |
| `setItem` | `../src/main.js:452:26` | 299.47 | 504.32 |
| `prepareFoundationSave` | `../src/save_compatibility.js:17:17` | 233.47 | 474.02 |
| `simulateTick` | `../src/main.js:7797:10` | 202.20 | 5381.22 |
| `worldCompletionFacts` | `../src/world_completion_facts.js:15:17` | 200.97 | 651.73 |
| `auditRemainderCombinedFacts` | `../src/audit_remainder_facts.js:12:17` | 189.50 | 270.01 |
| `frontierNativeEvidence` | `../src/main.js:1040:10` | 179.28 | 189.37 |
| `detach` | `../src/save_compatibility.js:50:20` | 172.33 | 240.54 |
| `copy` | `../src/simulation_contracts.js:17:17` | 160.55 | 181.43 |
| `create_save` | `../src/main.js:5457:10` | 151.05 | 416.49 |
| `originalFrontierFacts` | `../src/original_frontier_facts.js:7:17` | 116.67 | 128.36 |
| `visit` | `../src/mixture_state.js:86:14` | 112.01 | 112.01 |
| `structuredClone` | `(V8):0:0` | 107.63 | 107.63 |
| `(program)` | `(V8):0:0` | 101.21 | 101.21 |
| `setItem` | `(V8):0:0` | 90.08 | 90.08 |

## Top 15 by total time

| Function | Call site | Self ms | Total ms |
| --- | --- | ---: | ---: |
| `(root)` | `(V8):0:0` | 0.00 | 5695.90 |
| `(anonymous)` | `(V8):1:2` | 0.00 | 5476.29 |
| `evaluate` | `(V8):305:11` | 0.00 | 5476.29 |
| `(anonymous)` | `(V8):1:1` | 0.00 | 5476.29 |
| `advanceTicks` | `../src/main.js:8254:10` | 1.50 | 5476.29 |
| `runEngineTicks` | `../src/simulation_clock.js:62:17` | 2.65 | 5388.42 |
| `(anonymous)` | `../src/main.js:7777:19` | 1.51 | 5385.77 |
| `simulateTick` | `../src/main.js:7797:10` | 202.20 | 5381.22 |
| `update_timer` | `../src/main.js:7681:10` | 6.69 | 5067.52 |
| `persistExpansion` | `../src/main.js:1077:10` | 23.59 | 4616.45 |
| `persistExpansionPlan` | `../src/expansion_persistence.js:7:17` | 368.66 | 2200.43 |
| `featureWaveContext` | `../src/main.js:1680:10` | 4.54 | 1950.67 |
| `simulationNativeContexts` | `../src/main.js:1025:10` | 36.92 | 940.82 |
| `data` | `../src/main.js:1203:27` | 3.08 | 847.17 |
| `campaignContext` | `../src/main.js:1819:10` | 1.52 | 845.05 |
