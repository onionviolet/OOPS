# Opening-fixture CPU profile before optimization

Profile: `before.cpuprofile`, baseline commit `67c7f15c`, headless Chrome, 1366x768, `advanceTicks(1000,{render:false})`. Measured call: 66,152.7 ms. Host was contended (load 277.6 on 18 logical cores). Source locations resolve the baseline bundle source map. Inclusive totals count a recursive function once per sample.

## Top 15 by self time

| Function | Call site | Self ms | Total ms |
| --- | --- | ---: | ---: |
| `retiredKey` | `../src/save_compatibility.js:4:10` | 57055.21 | 57055.21 |
| `persistExpansionPlan` | `../src/expansion_persistence.js:7:17` | 544.14 | 60447.88 |
| `setItem` | `../src/main.js:452:26` | 462.48 | 786.25 |
| `prepareFoundationSave` | `../src/save_compatibility.js:9:17` | 445.60 | 57847.09 |
| `(garbage collector)` | `(V8):0:0` | 376.77 | 376.77 |
| `n` | `../src/save_compatibility.js:42:20` | 347.50 | 57402.72 |
| `worldCompletionFacts` | `../src/world_completion_facts.js:15:17` | 309.42 | 947.52 |
| `auditRemainderCombinedFacts` | `../src/audit_remainder_facts.js:12:17` | 299.24 | 428.61 |
| `simulateTick` | `../src/main.js:7797:10` | 289.92 | 65661.27 |
| `frontierNativeEvidence` | `../src/main.js:1040:10` | 257.06 | 292.10 |
| `structuredClone` | `(V8):0:0` | 231.26 | 231.26 |
| `(program)` | `(V8):0:0` | 225.94 | 225.94 |
| `originalFrontierFacts` | `../src/original_frontier_facts.js:7:17` | 220.15 | 230.61 |
| `create_save` | `../src/main.js:5457:10` | 217.04 | 576.68 |
| `readGameplayActor` | `../src/gameplay_publication.js:3:17` | 193.33 | 230.55 |

## Top 15 by total time

| Function | Call site | Self ms | Total ms |
| --- | --- | ---: | ---: |
| `(root)` | `(V8):0:0` | 0.00 | 66580.32 |
| `(anonymous)` | `(V8):1:2` | 0.00 | 65729.51 |
| `evaluate` | `(V8):305:11` | 0.00 | 65729.51 |
| `(anonymous)` | `(V8):1:1` | 0.00 | 65729.20 |
| `advanceTicks` | `../src/main.js:8254:10` | 0.00 | 65729.20 |
| `runEngineTicks` | `../src/simulation_clock.js:62:17` | 1.59 | 65673.53 |
| `engineTimeout` | `../src/main.js:7777:19` | 9.39 | 65670.68 |
| `simulateTick` | `../src/main.js:7797:10` | 289.92 | 65661.27 |
| `update_timer` | `../src/main.js:7681:10` | 13.42 | 65140.51 |
| `persistExpansion` | `../src/main.js:1077:10` | 58.79 | 64392.13 |
| `persistExpansionPlan` | `../src/expansion_persistence.js:7:17` | 544.14 | 60447.88 |
| `data` | `../src/main.js:1203:27` | 7.25 | 58400.05 |
| `validateSaveEnvelope` | `../src/save_files.js:49:17` | 43.22 | 58388.60 |
| `prepareFoundationSave` | `../src/save_compatibility.js:9:17` | 445.60 | 57847.09 |
| `n` | `../src/save_compatibility.js:42:20` | 347.50 | 57402.72 |

F1. `retiredKey` accounts for 57,055.22 ms self time (about 86% of the advance call). `prepareFoundationSave` recursively visits save keys and tries JSON parsing for each non-retired key. Most field names are not JSON, so this repeatedly creates and catches syntax errors.

D1. Cache only this immutable string classification per `render:false` advance. Keep each transaction's new-state validation, envelope traversal, serialization, durable write and publication. Do not treat this as authority to skip full transaction validation.
