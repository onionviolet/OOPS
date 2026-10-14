# W25 report: One world clock and away behaviour

## CHECKPOINT

Complete, design only, 2026-10-14. Output: [W25_CLOCKS_AND_AWAY.md](../../../worlds/world-core-kit-2026-10-14/W25_CLOCKS_AND_AWAY.md). Own only that file and this report. No implementation, native gameplay acceptance or policy acceptance claimed. Other lanes remain independent writers.

| Code | Delivered |
|---|---|
| W25.F1 | C1-C20 functional clock map and 208-module temporal-expression census, distinguishing global calendar, joined played time, world-instance elapsed, supported leases, wall time, callback time and supplied projections. Guards/receipts are distinguished from independent tickers. |
| W25.F2 | A01-A22 away rows: source behavior for closed absence versus live play elsewhere, proposed Default + Dial, eligible boundaries and durable consequences, including KX74 storms crossed. Rows extend the existing ledger, not its API. |
| W25.F3 | D1-D7 determinism risks and smallest shared read/settlement seam. HEAD already contains seeded native streams and pure anchor/away modules. Branch core/a5-determinism contributes source replay tests only; its old exclusions are not treated as current HEAD absences. |
| W25.F4 | Nineteen world rows, with TTKS's five book slices kept distinct in its row, readiness limits, proposed floors and new angles. Five ranked repairs, nine further/cross-world angles and three ranked suggestions. No new canon facts or sealed truths. |

## Sources read and authority

Read COMMON first, AGENTS, PROJECT top/standing direction, synced user preferences, relevant USER_VISION direction, kit root and round 9/10 MC/DR/MD/KX additions, and audit playbook. Applied the more-to-consider skill proportionally within design-only scope.

Read the away-ledger and derived-snapshots GOAL dispatches, derived offline checkpoint and the full prior offline/branch-clock audit. Reused their elapsed-ledger, native/joined/local-clock and compatibility distinctions. Read W21's evidence rules and clock/away readiness rows. W22/W23 output files were absent at the initial sibling read; no sibling file was edited or waited on.

Source inspection covered game_time, weather, world_rhythm, instance/lease planners, realm support, native local-calendar adapters, expansion scheduler and publisher, simulation/situations/storylet/chronicle, native job/action/craft/gather/weather/effect loops, local-life and E1 pacing, market/restock, container/crop support, elapsed packing, anchor_snapshots, away_ledger, seeded_streams, generated people, titles, cheat awakening and wall/UI timing. The output census supplies per-module file:line samples and marks supplied-time/receipt-only cases.

Read branch `core/a5-determinism:tests/determinism_replay.test.js` and `tests/core_ratchets.baseline.json` through git show. Its tip `6fbc319` adds tests, not runtime clock code. Inspected `git branch --no-merged HEAD`: 35 branches at initial read, including a2/a3/a4/a5. No branch checkout, merge or edit. No need to inspect unrelated branch implementations to establish this lane's HEAD clock findings.

## Checks actually run

| Code | Check and result |
|---|---|
| W25.V1 | Read-only git status/HEAD/unmerged-branch inspection and process listing. Shared tree was already heavily dirty; active nearby lane processes were present. No shared writes, staging, commits or branch operations performed. |
| W25.V2 | Recursive src temporal-expression census with supplemental indirect readers: 208 modules indexed. It deliberately includes validators and timestamp sinks; absence of a match is not proof a transitive consumer has no time dependency. Named functional families and call sites cover the requested clock/schedule/price/festival/canon/job/craft seams. |
| W25.V3 | Documentation script checked 573 source locator occurrences for file existence and line range, plus local Markdown links: zero invalid. Counted 22 away rows, five ranked repair rows and 19 world rows; no em dash or spaced double hyphen. This is structural validation, not proof of source semantics or gameplay. |
| W25.V4 | HEAD moved from `6dd515278a6e8a9982d899ebb985c3eb19e8176f` to `be8658af29e10467481c5ab9e373d1499ab35084` during concurrent work. The read-only source-path diff between the initial commit and that HEAD returned no paths. Initial source citations remain applicable to that comparison. |

No npm, tests, build, server, browser, save/reload/import or real save access. No private packs or SECRETS files opened. The prior audit's test results are historical evidence, not rerun results from W25.

## Open decisions and later acceptance

| Code | Open item / receiving owner |
|---|---|
| W25.Q1 | Barrier equality and partial scheduler consumption need a host contract with the existing away-ledger owner. Current computeAway's strict barrier comparison and linear XP are not a complete native settlement. No new API selected here. |
| W25.Q2 | W23/W28 own pure climate/calendar shape; W24 owns same-tick causal order; W22 owns copy identity; W26 owns carrier/obligation effects; W27 owns read-only inspector presentation. Route these findings to their existing owners without another clock/state store. |
| W25.Q3 | Policy dials for native search/contact cadence, E1 away qualification, world rates, absent-world movement and carried age/effect durations remain proposals. Default preservation is distinct from selecting permanent freeze or forbidding future moving-world content. |

Remaining playable gate: a separately authorized integrated host must settle one supported queue and one eligible passive condition from one elapsed claim, then demonstrate equal consumed-time results across segmented/live/closed return and exact full-envelope Save/reload/literal Import on rebuilt desktop bytes. Include choice/barrier, failed publish, packing exclusion and public held-versus-crossed storm reporting. This lane neither implements nor closes that gate.
