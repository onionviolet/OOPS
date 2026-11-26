# Windows native cast acceptance timing

| Preflight | Scope |
| --- | --- |
| Reading | Diagnose shared acceptance timeouts without weakening the live Save/reload/Export/Import route or its assertions. |
| Authority | Parent-assigned performance diagnosis; AD36 and AR9. No gameplay or source-world change. |
| Player sentence, route and screen | n/a: test infrastructure, no player wording or UI behavior changes. These adapter tests use the native in-process DOM, not Playwright or Chrome. |
| Fit and mechanism | `scripts/headless/runner.mjs` bundles real current source and rechecks its source-state cache on every reload. Preserve the existing full-path, size, mtime, filter and sorted traversal invalidation inputs. |
| Files | Own the scoped `hashTree` hunk, coordinated with root; preserve root's concurrent atomic bundle publication fix. Own hash/process regressions, test-only fixture process helper, and cancellation/cleanup hunks in the five assigned cast adapter tests. No `scripts/perf/lib.mjs` edits; coordinated with `klein`. |
| Failure | A different traversal order or skipped metadata could reuse a stale bundle. Compare exact digest to the prior serial implementation, cross a batch boundary, modify included and excluded files, and fail on a missing root. |

## Measurements and change

F1: The exchange live worker was traced in its disposable copied fixture. It spent time in initial boot and subsequent reloads before reaching the later gameplay assertions. This did not establish a teardown leak. A separate boot-only V8 CPU profile completed normally in 51.86 seconds. Leading self samples: idle 10.83s, structuredClone 9.17s, module compilation 5.90s, JSON validation 2.81s, DOM traversal 1.94s. These are one host/load sample, not universal budgets.

F2: The original `hashTree` performed a serial awaited stat for each included file on every reload. A source-only sample of 1,941 included files took 11.24s. Batching at most sixteen independent stat calls, then folding their results in the original sorted depth-first order, took 0.744s on the same disposable source tree. The actual function now uses that bounded batching. No source-state cache input, validation, assertion, timeout, native route, or save operation was removed.

F3: The first exchange run failed its existing child-worker timeout: 3 pure cases passed, live route failed at 293.35s overall test duration. Later timing was contaminated by a concurrently running full suite. A representative after the change was also started while that suite was running, so it cannot serve as quiet-load performance evidence. A misleading empty `Get-Process` result initially suggested that suite children were orphaned; root checked the live CIM parent chain and confirmed the suite was still running. No suite process was stopped.

F4: The loaded post-hash run proved a second cause. Test process 99420 started at 15:01:27; its worker 96372 started at 15:02:55. The outer test emitted a 300-second timeout, yet both processes remained live at 15:06:45 and worker CPU continued increasing. The complete process exited after 324.57s. The worker's independent 270-second allowance started after preparation, and its exec did not consume the test's abort signal.

D1: The assigned exchange/inference/divination/making/ability worker calls, then the additionally assigned body/journeys calls, now use `tests/helpers/fixture_process.mjs`. It observes the outer test signal and the unchanged 270-second worker timeout, stops the worker tree with Windows `taskkill /T /F` or the Unix process group, and settles after process close and tree termination. Each fixture-removal hook waits the worker promise before removing its source. Worker and cancellation commands use hidden Windows execution. This repairs cancellation ownership; it does not turn a timed-out gameplay assertion into a passing test or enlarge its 300-second gate.

## Checks

| Command | Result |
| --- | --- |
| `node --test tests/headless/bundle_hash.test.js` | 1 passed, exit 0. Exact old/new digest, nested ordering, 35 included files across batches, ignored-file behavior, source size and mtime invalidation, and missing-root failure. |
| `node --test tests/fixture_process.test.js tests/headless/bundle_hash.test.js` | 3 passed, exit 0. Real worker plus descendant killed before promise settlement, both PIDs absent, fixture still held for caller cleanup, success output retained, independent timeout enforced. Initial 8.24s under shared load; final current-helper check after native groups passed in 1.925s. |
| Loaded exchange representative | 3 pure cases passed, 1 canceled at 300s; complete process duration 324.57s. Disposable build SHA-256 `ed214a1882c56be2337e823da5913bba755e68beb7d6ba49de8d85bfa9adda1a`. This run predates the cancellation fix and does not prove quiet performance. |
| `git diff --check -- scripts/headless/runner.mjs tests/headless/bundle_hash.test.js` | Passed. |
| `node scripts/check_doc_slips.mjs` | Passed after receipt wording correction. |
| Normal Windows full gate | `YAIRPG_TEST_CONCURRENCY=8 npm test` through the package's machine-wide limiter, started 2026-11-25 21:53:39 UTC: **exit 1**, official 2,822s (47m02s), 1,161 files / 8,304 tests: 8,273 pass, 9 fail, 1 timeout cancellation, 21 skip. All seven exclusive native files passed 44/44. Complete ignored local stdout/stderr capture: [windows-full-test-2026-11-25.log](windows-full-test-2026-11-25.log), SHA-256 `29c76f1a3155cb0d4896fdeb8a809c1a5a9b562771b7281a7c811d89e1c1d2f1`. No separate raw-suite command or second limiter wrapper. |
| Focused original-profile contract repair | `node --test --test-name-pattern='original profiles retain\|pack-absent reader hides' tests/lotm_cast_week.test.js`: 2 passed, exit 0, 23.302s under the continuing gate. Existing old hashes retained. Exactly the fresh locked probationer directory row at University is admitted; removing it restores the prior action bytes, with no row admitted for machinery/storm/civil. Loaded and absent-pack variants retain their full-panel comparison. |
| Quiet ordinary-env exchange | `node --test --test-concurrency=1 tests/cast_exchange_adapter.test.js`: 4 passed, exit 0, live case 138.244s / process 141.252s. Existing Save/reload/Export/Import and all assertions retained. `YAIRPG_TIMEOUT_SCALE` unset. Bundle SHA-256 `62eab0ad956d29294c4d467c1694219737be7243e8958a43e4c57da39e9743fc`. |
| Serial adapter group | `node --test --test-concurrency=1 tests/cast_inference_adapter.test.js tests/cast_divination_adapter.test.js tests/cast_making_adapter.test.js tests/cast_ability_adapter.test.js`: 24 passed, exit 0, process 775.008s. Node executes alphabetically; live timings and hashes below. |
| Additional timeout group | `node --test --test-concurrency=1 tests/cast_body_adapter.test.js tests/cast_journeys.test.js`: 16 passed, exit 0, process 299.069s. Body six cases and journeys ten cases. The same cancellation and removal-barrier hunks extend to their worker calls; assertions and timeouts unchanged. |

| Quiet live case | Duration | Disposable integrated bundle SHA-256 |
| --- | --- | --- |
| Ability | 139.770s | `9d4cbf23de3896bb24b9c25e4510531dc83d3ba00561b45d34335ca460366d23` |
| Divination | 167.199s | `2a7bf9282a4fc60551e82f748b5aec8b0488c4fddc762a6a221f40b8a9dd3388` |
| Inference | 254.457s | `67a1b7457344386719973dca81157fa7521fe4fb9f029d1ad3bdd2ac610f5a36` |
| Making | 198.938s | `262084440c8dcd600306a1bd52b6be04808b60226bd04e6658a7d53916b6a59b` |
| Body | 135.248s | `027e28270ce0a49f2165716fea2164622695e6404005d191a379b4a13ad0de6c` |
| Journeys | 157.972s | Existing fixture rebuilds live source but emits no candidate hash; this row records native performance acceptance, not a new graphical UI delivery claim. |

All seven heavy files passed quiet native acceptance: 44 tests across the three explicit commands above. `YAIRPG_TIMEOUT_SCALE` remained unset. No outer 300-second or worker 270-second deadline changed, and no native validation, pending-save, reload, literal Export/Import or aftermath assertion was removed. Inference's 254.457s live case has the tightest observed margin; serial success does not establish reliability with eight concurrent native workers. The scheduler owner received this exact seven-file group and timings for its separately owned Windows scheduling change.

The subsequent normal full gate began from shared dirty checkout HEAD `db24d3a929de36dc476918b44c7af06b53223416`. Relevant infrastructure input hashes at launch:

| Input | SHA-256 |
| --- | --- |
| `scripts/test_suite.mjs` | `d618e7cd86aa3561632f3f48532fa43f424f3ffbb4a36ab82496c9ec3b097d8f` |
| `scripts/test_plan.mjs` | `4f0a2d6484703c7a53896b22cc1052e09671e3b93ba24086e04f0106924afb91` |
| `scripts/headless/runner.mjs` | `996ee1c45c36c670cd1f6da7096a848c30b9ce79d39d746504216975006a489b` |
| `tests/helpers/fixture_process.mjs` | `0a8a31468ec2b436b6da991648594cad1bb30ab6f7d78b49f112e8ff5384d4d0` |

All four infrastructure hashes and HEAD were unchanged at completion. The gate's ten commands covered these groups:

| Group | Files | Passed | Failed | Canceled | Skipped | Process duration |
| --- | --- | --- | --- | --- | --- | --- |
| Seven exclusive native commands | 7 | 44 | 0 | 0 | 0 | 1,254.875s combined |
| Parallel batch 1/3 | 472 | 3,567 | 7 | 0 | 11 | 875.806s |
| Parallel batch 2/3 | 472 | 3,415 | 2 | 1 | 10 | 601.092s |
| Parallel batch 3/3 | 210 | 1,247 | 0 | 0 | 0 | 88.646s |

The final batch passed and the limiter reported no holders after exit. No owned gate worker remained. The full run remains failed even where later focused repairs passed.

Normal-gate diagnoses: two early headless consumers captured an intermediate HP registration import snapshot; three cheat-browser cases implicated owned Chrome transport/profile cleanup (two also timed out waiting for loading UI); two LOTM snapshots encountered the intentionally added probationer directory action. The latter now pass focused checks with the original hashes retained. A later HP registration-only test double needs the absent-cast guard, and the new watch UI family needs perspective inventory integration. These were sent to their owners; source changes made after a failing test do not change this run's historical result.

The second batch's `native_save_fixtures` test timed out at 120.018s, then its old in-memory browser cleanup code prevented process close. At more than seven minutes, process 72716's CPU counters were unchanged and its remaining child was esbuild 83440, with no direct Chrome child. The Chrome owner confirmed the old profile-lock retry defect and that the replacement passed its focused checks. After checking the exact file command and parent against the owned gate, the lane terminated that overdue 72716/83440 tree to let the already-failed gate reach its last batch. This was a forced failed-file cleanup, not natural completion or a passing test. The file's reported duration was 466.4s. Its owner is proving the exact consumer on finalized cleanup code separately.

The Chrome owner subsequently reported that exact consumer passed 1/1 with normal exit 0 in 45.5s, plus the finalized awakening/cards and lifecycle group at 17/17. [Browser teardown receipt](WINDOWS_BROWSER_TEARDOWN_2026-11-25.md) owns those commands and evidence. The HP owner reported current-source activity/ledger checks passing and its absent-cast registration guard passing; these are separate from the failed snapshots above. The new watch perspective tag is with its UI owner. This lane changed the two failing LOTM contract tests, preserving their old action hashes while explicitly checking the admitted directory scope; it made no game-source edits during this full gate.

An additional attempt to select pure exchange cases with a negative test-name filter unexpectedly entered live fixture setup. Its owned process tree was stopped as soon as that was observed; no result or performance evidence is claimed from that interrupted attempt. No further adapter runs were launched while the full suite continued. The quiet commands above began after the parent confirmed its official full suite had completed in 1,903 seconds.

The profile and tracing used disposable fixture copies; their first parent test removed that fixture. The two later owned synthetic fixture directories `C:/Users/wayba/AppData/Local/Temp/yairpg-cu1-save-gjulEO` and `C:/Users/wayba/AppData/Local/Temp/yairpg-cu1-save-wJ1N3d` remain. Automatic tool approval review rejected their cleanup command as “blocked by policy,” despite exact named targets and resolved-path checks; no alternate deletion route was attempted. Their owned processes ended or were stopped. No user saves were used.

No commit, push or paid call. Agent-verified hash/cancellation changes and quiet native acceptance; the separately changed full-suite scheduler remains with its parent integration owner. No new graphical browser behavior is claimed by this infrastructure task.

## Corrected-source full rerun: 20261125-164510

Root requested a fresh normal limiter gate after the preceding corrections. `YAIRPG_TEST_CONCURRENCY=8 npm test` is running with a unique [complete log](windows-full-test-20261125-164510.log). Start inputs were captured at 2026-11-25 22:46:18–19 UTC in [input-start](windows-full-test-20261125-164510-input-start.log): HEAD `db24d3a929de36dc476918b44c7af06b53223416`, Node v22.22.3, 4,061 entries, content fingerprint `df7f66939c0464c95d445763bee71ef371abf4661f22d2aa2d65a0c918a74164`. Runtime source area: `f8f8dd0ef7ef725f43d84e6788ccde00500bc2fab040d78f06f2c71a189a3371`.

The retained verification script is `work/verification/full-test-20261125-164510/capture-inputs.mjs`. It hashes current file bytes across its explicitly listed source, script, test, private-pack, locale, resource, asset, style, package and build inputs. Directory links are recorded without traversing their external targets. Start/end manifests are input evidence rather than a claim of an atomic checkout snapshot.

The chapter 130 owner reported after launch that its native correction was beginning across charm response, simulation contracts/effects/runtime, cast host/domain/host, silver charms, action host, loan UI and focused tests. This rerun therefore straddles that change. Its pre/post identities will remain distinct; it cannot be relabeled as a complete post-freeze suite. The owner will announce a source freeze and separately prove the final bundle. No game-source ownership was taken by this verification lane.

Provisional source freeze was announced for 22:58 UTC. A [freeze input capture](windows-full-test-20261125-164510-input-freeze.log) at 22:58:47–48 UTC has 4,064 entries, combined fingerprint `26a6dc33511d0b1fb1d04cad8ce677a3422c3e8b120c2b9c4c3087fff5287bae`, runtime-source fingerprint `c9e64b0cbbf63fbe0be281afcb45a20491c34908e62e922e21225afcf6d18835`. Sixteen paths differ from launch: the announced ten runtime paths and new response test; three Atlas readiness/output-record test changes; a new rarity browser proof; and the rebuilt index. The new response test was absent from the launch manifest, so its separate post-freeze focused evidence remains necessary.

Root identified the rebuilt final normal game bundle as SHA-256 `ae7dc5f49b193fcf41dcd70db3ac9e57ea401b891608dfdeca008758a93fa573`. This identity was sent to the chapter 130 owner for the upcoming browser proof, with any proof-driven source change to be flagged. Its reported focused response 8/8 and prior loan/core 15/15 are separate post-change checks, not a relabeling of this run's earlier commands.

A proof-driven occupancy correction then changed `src/lotm_charm_response.js` and `src/book_world_lotm_cast_host.js`. The owner announced the actual late native freeze at 23:06:42 UTC; focused response checks passed 9/9. The rebuilt normal bundle is now `e797966bfa5b358605400dc68227cb544adf7dc58406cb5b6479c43ebf975aa5`, replacing the earlier candidate for the late route's native proof. A separate [second-freeze capture](windows-full-test-20261125-164510-input-freeze2.log) retains this state. These two changed runtime files remain a separately timed delta; earlier full-suite commands are not post-change evidence for them.

Result: **exit 0**, official 1,695s (28m15s), all ten commands exited 0. The launch plan covered **1,168 files / 8,337 tests: 8,318 passed, 19 skipped, zero failed or canceled**. No process was forcibly stopped. The machine-wide limiter released its holder normally.

| Rerun group | Files | Passed | Skipped | Duration |
| --- | --- | --- | --- | --- |
| Seven serial native commands | 7 | 44 | 0 | 857.731s combined |
| Parallel batch 1/3 | 471 | 3,547 | 9 | 521.435s |
| Parallel batch 2/3 | 471 | 3,424 | 10 | 235.461s |
| Parallel batch 3/3 | 219 | 1,303 | 0 | 79.430s |

The retained full log has SHA-256 `602a52d1389f3932c66db7ed818cb4b435782fe1a90865072f5dbec784171e59`. Existing duration-budget warnings did not fail the gate.

[End inputs](windows-full-test-20261125-164510-input-end.log) were captured at 23:15:57–58 UTC: HEAD unchanged, 4,067 entries, combined fingerprint `31717e9e7f63a407ca53253abe8f01f90bdd0a416aff9586090c68ee6d76e3d2`. Runtime-source fingerprint `2c4fea0d407eddc0c021bd687722ecc8e2d4b6276b41d8d2f57c67996a507836` and the normal bundle `e797966bfa5b358605400dc68227cb544adf7dc58406cb5b6479c43ebf975aa5` match the second freeze. Private-pack, package, build, style, asset-link, resource, story and locale identities stayed unchanged from launch. Twenty paths changed or were added from launch; the per-path manifests preserve that exact delta.

After the second freeze, game runtime bytes stayed unchanged. Later script/test changes were `scripts/check_flow.mjs`, new `scripts/flow_session.mjs`, new `tests/flow_session.test.js`, and edits to the rarity/response browser proofs and response unit tests. The new `flow_session.test.js` and `lotm_charm_response.test.js` were absent at launch and therefore omitted from this run's planned set. Their source owners' focused checks are separate evidence; this green run is not relabeled as a full suite over a uniform final checkout. The response owner reports 17/17 final focused checks and is completing the actual native route on the exact final bundle. Flow-focused evidence and the final native-proof link are pending owner reports.

## Final stable-wave gate: 20261125-171934

After the previous passing cross-change run, the chapter 130 owner reported a post-gate review edit to `src/lotm_charm_response.js` and focused 19/19 checks. Root rebuilt the normal game as `9a960b6694049fb0da8063c09e6245254469cebeaa20c96c8793a7f54f8e9fc1` and explicitly requested a last normal full gate with both new test files included. The prior passing record above is preserved.

`YAIRPG_TEST_CONCURRENCY=8 npm test` is now running through its normal limiter with a [unique full log](windows-full-test-20261125-171934.log). Before launch, the final bundle hash was verified, the limiter had no holder, and the chapter 130 owner confirmed that its runtime and latest test edits were complete with no further source/script/test/private-pack edits planned. The flow owner was also notified of the input freeze.

[Launch inputs](windows-full-test-20261125-171934-input-start.log) were captured at 2026-11-25 23:19:46–47 UTC: unchanged HEAD, Node v22.22.3, 4,067 entries, combined fingerprint `0920d5c6ef0852acb073c73249ae87cdcd3a3d7927fc097e0719ffd6500ab978`, runtime-source fingerprint `c351f9142de2fd2e21e0893d3e8a56b2d7297a37d9501e28661bad3445088be8`. The same explicitly scoped capture method will be used at completion.

The chapter 130 owner reported reviewed native proof exit 0 at 23:23:51 UTC on served bundle `9a960b…`, with `errors:[]` and no source/test/script changes since launch. [Reviewed proof](../../../representations/evidence/lotm-lender-release-reviewed-2026-11-25/proof.json) owns the actual source-opportunity block, stock/loan/use conservation, home-surviving promise, voluntary release without cash compensation and native Save/reload/Export/Import around use, release and both choices. This final-bundle route is separate from the earlier candidate proof.

Final result: **exit 0**, official **1,602s (26m42s)**, **1,170 files / 8,350 tests: 8,331 passed, 19 skipped, zero failed or canceled**. All ten commands exited 0. No competing gate or forced process termination occurred. Existing duration-budget warnings remained non-failing.

| Stable-wave group | Files | Passed | Skipped | Process duration |
| --- | --- | --- | --- | --- |
| Seven serial native commands | 7 | 44 | 0 | 813.538s combined |
| Parallel batch 1/3 | 472 | 3,549 | 9 | 488.772s |
| Parallel batch 2/3 | 470 | 3,427 | 10 | 212.828s |
| Parallel batch 3/3 | 221 | 1,311 | 0 | 85.624s |

The normal reporter's final file set matches all **1,170 launch-manifest test paths**, with no missing or unexpected files. Both `tests/flow_session.test.js` and `tests/lotm_charm_response.test.js` are included in this full gate. This closes the two-file coverage omission from the preceding cross-change run without relabeling that older record.

[Completion inputs](windows-full-test-20261125-171934-input-end.log) were captured at 23:46:59 UTC. HEAD, runtime source, scripts, private packs, packages, build inputs, index, styles/resources and all 1,170 planned test files match launch byte for byte. Runtime-source fingerprint remains `c351f9142de2fd2e21e0893d3e8a56b2d7297a37d9501e28661bad3445088be8`; normal bundle remains `9a960b6694049fb0da8063c09e6245254469cebeaa20c96c8793a7f54f8e9fc1`.

The wider captured set has one documented difference: standalone `tests/feel_rarity_earned_browser.mjs` changed during the run. It is outside the npm plan, and no references to it were found in other source, script or test files. Thus the combined completion fingerprint is `e7d0fba01f34dbc8310d00c9879f3cae062de7055a990cc4943d794724c1213c`, distinct from launch; the game and planned-test input identities remained stable.

Retained [full log](windows-full-test-20261125-171934.log) SHA-256: `7d3c14fe099cbc662298f467c134d58a6f8fd4dfe4b0e9e904fc87b4beda60da`. The limiter reported no holders after normal exit and no owned gate workers remained. The local input manifests and their capture script are retained as cited verification artifacts. No commit, push or paid call. Final stable-wave full gate and exact-bundle native route are agent-verified, not human-reviewed.
