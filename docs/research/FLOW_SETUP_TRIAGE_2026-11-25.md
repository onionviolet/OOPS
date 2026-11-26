# Flow state setup triage, 2026-11-25

| Preflight | Scope |
| --- | --- |
| Trigger | Final normal flow walk reported a six-second click timeout entering Infested field under simultaneous gate load. An earlier walk read all four states. Root assigned reproduction and a harness fix if supported by evidence. |
| Mechanism | The state factory created a Session, then awaited travel before returning it. A rejected click left the outer walk's `other` variable null, so its finalizer could not close the allocated Session. Root authorized correcting that ownership gap and preserving available error detail. |
| Bounds | Flow-specific guard and tests; no shared Session, browser runner, game runtime, adopted `dist`, timeout or fixed-wait changes. UI audit route remains 1920×1080, with its existing zoom checks. UR139–UR143 and UR33; AD36. |
| Failure check | Setup click rejection must close the acquired session and preserve the exact original error; startup/load failures must also close. If cleanup fails too, retain the original cause and both failures. |

F1: The failed receipt is preserved at [final/flow.json](../representations/evidence/default-web-2026-11-25/final/flow.json), SHA-256 `74f815c7b0fb98289387464ee0f6bbe86395cf910d9f4eda373f3a47746f6775`. It records the combat click timeout and three read states, but the previous harness truncated the Playwright message to its first line. It cannot establish whether the target was absent, covered, unstable or delayed under load.

F2: `openFlowSession` owns a session through start, load and the state's setup callback. Success transfers it to the walk. Failure closes it before rethrowing the original error. If closure also fails, an AggregateError retains the original message, cause and both errors. Rain and combat factories run their extra setup inside this guard. State findings now keep the full available message and Call log.

| Check | Result |
| --- | --- |
| Focused lifecycle | `node --test tests/flow_session.test.js`: 2/2 passed. Success retains the session for the walker; click rejection, startup and load failures close; cleanup failure retains both errors and the original cause. |
| Syntax | `node --check scripts/check_flow.mjs`: passed. |
| Independent retry | `YAIRPG_FLOW_PROGRESS=1 npm run check:flow -- --json docs/representations/evidence/default-web-2026-11-25/final/flow-checked.json`: passed, exit 0. All 16 routes, both zoom levels and four states including Infested field combat were read, with zero findings and two unchanged baseline strays. [Fresh retry](../representations/evidence/default-web-2026-11-25/final/flow-checked.json). Started before the guard edit, so its loaded harness remained an independent retry of the original timing behavior. The click timeout did not recur; its cause remains unconfirmed. |
| Input identity | Retry's normal command rebuilt its own copied WORKTREE. Staged bundle SHA-256 `ae7dc5f49b193fcf41dcd70db3ac9e57ea401b891608dfdeca008758a93fa573`. The then-current adopted `dist` hash was `e797966bfa5b358605400dc68227cb544adf7dc58406cb5b6479c43ebf975aa5`; this is source-gate evidence rather than exact adopted-bundle acceptance. Root owns packaging. |
| Docs and cleanup | `node scripts/check_doc_slips.mjs`: passed. Flow's staged build was removed by the normal harness. Shared runner warned of a Windows-locked private profile `yairpg-owned-chrome-H0LJoS`; retained for runner owner. Failed flow receipt remains unchanged. No additional browser or server retained by this lane. |

The ownership defect is confirmed independently of the timeout's cause. No timeout increase, forced click or additional sleep was introduced. Agent-verified harness regression, not human-reviewed; original flow timing reproduction is recorded separately above.
