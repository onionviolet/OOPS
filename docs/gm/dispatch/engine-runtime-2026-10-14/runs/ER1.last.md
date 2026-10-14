Completed the [runtime audit](/Users/weiwei/code/yet-another-idle-rpg/docs/research/RUNTIME_HOTSPOT_AUDIT_2026-10-14.md) and [ER1 report](/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/engine-runtime-2026-10-14/ER1/REPORT.md), with a runnable benchmark and raw results.

Top finding: joined-clock play persists a full envelope per tick. The crowded synthetic save reached 1.58 MB; median serialization took 4.23 ms versus 509 ms for validation. Severe host contention limits timing conclusions.

Source unchanged. Browser profiling remains open.

