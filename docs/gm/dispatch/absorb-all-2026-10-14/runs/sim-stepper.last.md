Committed four separate changes through `78749564`. Worktree clean; `main.js` untouched.

**B1 — Median ticks/s, three runs:**

| Scenario | Before | After |
|---|---:|---:|
| Idle | 20.77 | 195.79 |
| Work | 20.88 | 206.72 |
| Combat | 19.86 | 169.61 |
| Timed search | 20.75 | 200.12 |

**V1 — Correctness:** 991/991 tests, six byte-equal state comparisons, and both journeys pass.

**Q1 — Still open:** Quiet-machine certification and the 1000/200 targets. The transaction path alone measured 2.20 ms/tick. Its semantics remain unchanged.

[Profiles, top-15 call sites, results, and proposed structural fixes](/Users/weiwei/code/yair-absorb-all-20261014/sim-stepper/docs/gm/dispatch/absorb-all-2026-10-14/checks/sim-stepper/PERFORMANCE_FOLLOWUP.md)