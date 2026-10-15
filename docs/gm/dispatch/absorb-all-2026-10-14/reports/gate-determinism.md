# Gate determinism, 2026-10-14

Status: **INCOMPLETE. Do not land yet.** Requested solo checks pass15/15; all three also passed initial parallel runs in two complete gate attempts. No full gate returned RESULT PASS. Final harness commit: `2cc26214` on `absorb-all/integration`, starting from `9dd86b5a`.

## Findings and changes

F1. **P15 extra write is a separate legitimate save, not a split operation.** The instrumented live journey recorded enrollment revision1 at `2026-10-15T00:49:56.697Z` (76953 UTF-16 units,76957 UTF-8 bytes), then revision2 at `00:49:56.887Z` (77260 units,77264 bytes). Both target `yairpg:p23:native-authority:1:live`. Source-mapped revision2 caller is `persistExpansionPlan -> persistExpansion -> update_timer`, the joined clock's own durable publication. Live trace: `/tmp/gate-determinism/trace/authority-writes-mapped.json`. The historical failed log has no caller trace, so its exact interleaving cannot be reconstructed retrospectively; this run reproduces the competing publication in the same journey.

A controlled same-journey challenge places one real native engine tick inside the old manual Save counting window, after the paid trade. It passes with the following distinct publications:

| Publication | Revision | UTC timestamp,2026-10-15 | String units / UTF-8 bytes | Mapped caller |
|---|---:|---|---:|---|
| Paid trade |3|01:16:46.616Z|169023 /169031|`trade.js:103 -> commitNativeTrade -> persistExpansion`|
| Native tick |4|01:16:46.746Z|169331 /169339|`main.js:8683 -> update_timer -> persistExpansion`|
| Manual Save |5|01:16:46.942Z|169333 /169341|`main.js:6643 -> save_to_localStorage`|

Evidence: `/tmp/gate-determinism/p15-caller-challenge/p15-native-RKi2Jw/authority-writes.json` and `result.json`. The manual Save operation retains exactly one write, while the distinct tick contributes a second physical write within that Playwright window. No persistence source fix was needed or made.

F2. P15 now records key,length,UTF-8 bytes,timestamp,revision,stack and source-mapped callers across reloads. Its strict one-write count excludes only writes whose mapped caller lies in the native `simulateTick` body, including its due autosave. A Save/import/Undo split through its own caller still counts twice and fails. Capture awaits its completed native status rather than any unrelated revision bump. Exact snapshots, prior-authority preservation on failure, schema rejection and recovery assertions remain. Each of the five solo journeys verified eight counted operations,40/40 one-write operation checks.

F3. All three requested checks use localhost `?test_hooks=1` and pause after PLAY. P18 and tranche1 advance native callbacks explicitly. Snapshot/reload/import comparisons execute without live engine ticks. Existing assertions are retained; P18 adds exact reload projection equality and verifies the quota action is eligible. Explicit native readiness ticks mount panels after dialogue, reading and sleep transitions; final batched rendering refreshes current action quotes. P15 corrupt boot contexts never PLAY, so no engine starts there. Viewport1366x768; mobile remains deferred.

| Item | Decision | Paths |
|---|---|---|
| P15 authority-count race |Instrument and count by mapped caller; pause snapshots|`checks/p23-host-joins/final-p15-native.cjs`|
| P18 growth comparisons |Opt into deterministic helper; wait for actual shop arrival|`checks/p23-host-joins/step3-p18-native.cjs`, `lib/native-step3-helper.inc`|
| Household/exposure comparisons |Pause and explicitly step played time|`checks/p23-host-joins/tranche1-native.cjs`|
| Workshop hook/menu readiness found by full gate |Await hooks, pause before stepping, refresh already-earned native choices with quest events disabled|`scripts/systems_workshop_browser.cjs`|
| Workshop exact persistence |Pause exact comparisons; separate screenshot display tick afterward|`scripts/systems_workshop_persistence.cjs`|
| Workshop cancellation race found by full gate |Pause boundary snapshots; use existing engineWait for timed assisted work|`scripts/systems_workshop_boundaries.cjs`|

## Verification

F4. Requested solo setup used built old client `78e3c70a` at `.proof-old/`, and the main checkout's real private packs linked into both builds. Every invocation owns a fresh browser context. The15 solo invocations ran sequentially, with no retries or concurrent checks from this lane.

| Check | Solo | First full gate, initial parallel | Second full gate, initial parallel |
|---|---:|---|---|
| final-p15-native |5/5|PASS, no retry|PASS, no retry|
| step3-p18-native |5/5|PASS, no retry|PASS, no retry|
| tranche1-native |5/5|PASS, no retry|PASS, no retry|

Solo evidence and exact durations: `/tmp/gate-determinism/solo/results.json`, with each run's logs, screenshots and snapshots beneath that directory. Candidate bundle SHA256: `cbda4592f8d09bbb102dfecc5262d0752ba119a397712d4e5efb7cec9a19ece7`. Old client bundle: `deeadb63b1f5fe3446b92d11ef6af2b7f2eff31c88ac14672594bf116e42190a`.

All full attempts invoked the supplied FINAL_GATE.sh with this worktree and OLD=`78e3c70a`, differing only in OUT. Each build and full npm test completed PASS1699/1699,0 failures.

| OUT under `/tmp/gate-determinism/` | Result | Exact remaining failure |
|---|---|---|
| `full-gate` |RESULT FAIL|Workshop hook readiness, then missing stale native travel menu on retry; dependent fixtures absent. Other failing groups passed their built-in isolated retries.|
| `full-gate-final` |RESULT FAIL|Only workshop boundaries remained failing. Its initial cancel button raced job completion. Isolated retry entered a hot renderer loop and was explicitly terminated, never counted as PASS. Workshop natural, persistence and legacy passed.|
| `full-gate-verified` |ABORTED, exit143, no final RESULT|Severe host contention: observed load averages532.78/436.09/267.44, with failures across a dozen groups, including a30-second workshop import-load timeout. Stopped only this gate and its74 owned descendants; unrelated workers untouched. This is not passing evidence.|

The latest workshop changes have focused positive evidence: natural journey10 cases/no page errors; boundaries10 cases/no page errors with paused engine; exact native reload/Export/literal Import PASS. Artifacts: `/tmp/gate-determinism/workshop-fix/`. Final boundary harness is implemented and focused-verified, but full-wave acceptance remains OPEN. Host contention is a rerun constraint, not proof that every late failure is caused by contention.

## Compatibility, ownership and remaining gate

R1. Harness-only changes. No runtime source, save schema, migration, private pack or user save changed. `src/main.js` and `src/expansion_persistence.js` remain untouched, avoiding the stepper-perf source overlap. The shared native helper enables deterministic mode only for P18; other callers keep live timing. Workshop harness files may overlap another lane's harness work and must be reconciled normally. No merge or push performed.

Commits, per change: `cff4ea85`, `1fd3885c`, `de07bbd0`, `8682ca1a`, `56f6dcc8`, `aef6f7f7`, `1396c4a8`, `4585b247`, `2cc26214`. Report is also committed on this branch. Temporary proof servers and old-client worktrees created by this lane are released; logs and synthetic proof artifacts remain under `/tmp/gate-determinism/`.

**One remaining technical gate:** rerun the exact FINAL_GATE.sh on the final committed harnesses during a quieter host window and obtain RESULT PASS, with no retries on P15/P18/tranche1. The coordinator must not land before that result. No new gameplay or director play/taste acceptance is claimed.
