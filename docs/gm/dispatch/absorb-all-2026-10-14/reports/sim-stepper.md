# Performance follow-up, 2026-10-14

Correctness remains passing; speed acceptance remains OPEN. Profile-driven
retirement-key caching and batched log layout improve provisional median
throughput from about 20 ticks/s to 170–207 ticks/s. The 1000 ticks/s idle/work
and 200 ticks/s combat targets are not met, and no quiet slice was certified.
No transaction semantics or main.js code changed in this follow-up. Engine
commits: `1806ec91` and `3a6c7eb4`; initial profiler commit: `8de5347a`.

[Performance report, profiles, call sites and smallest safe next fixes](../checks/sim-stepper/PERFORMANCE_FOLLOWUP.md)
own the current evidence: 991/991 full tests, six byte-equal state comparisons,
three-run medians with matching before/after save hashes, both native journeys
passing. See the report for the exact structural costs and quiet-machine gate.

---

## Initial correctness delivery (commit 67c7f15c)

# Sim-stepper lane, 2026-10-14

Branch `absorb-all/sim-stepper`, base `b0fba727`, port 18950.
Desktop target: 1366x768. Outcome: advance the existing engine synchronously for
tests/dev play. Mobile work and product/UI redesign are deferred.

## Absorption decisions

| Item | Decision | Owner |
| --- | --- | --- |
| Existing per-tick joins | Reuse unchanged inside named `simulateTick()` | `src/main.js` |
| Fast-forward | `advanceTicks(n,{render:false})`, integer validation, synchronous actual engine callbacks, coalesced final projections | `src/main.js`, `src/simulation_render.js` |
| Action and combat timing | Opt-in deterministic engine timer queue; original native timers when hooks are disabled; monotonic logical clock after resume | `src/simulation_clock.js`, `src/models/combat.js` |
| Helper exposure | Dev config, or localhost/127.0.0.1 with `?test_hooks=1`; no helper on normal player URL | `src/simulation_clock.js`, bottom of `src/main.js` |
| Slow checks | Convert existing workshop progress and Fort action/reading/combat predicates to engine advancement | `scripts/simulation_check_helpers.cjs`, original two harnesses |
| Save compatibility | No schema, migration, serialized scheduler, or player-save change | Existing save owners retained |

F1. This is one gameplay path. The real loop and stepper both enter the original
tick callback and `simulateTick()`. Action and attack callbacks also remain the
actual callbacks. Seeded stream keys and draw calls were not changed. Default
batches coalesce repeated state-derived panels, skill bars, inventory, workspace,
vitals and attack bars. Incidental DOM writes/animations remain, so this is not
a renderer-free headless engine.

F2. Autosave counters still count every tick. Only due autosave/backup requests
are coalesced, once per key at the end; no unconditional save is introduced.
Joined-world transactions still save durably through their existing publication
checks. Deferring those writes would acknowledge transactions that were never
saved. Persistence/schema and ownership logic are untouched; no user save was
opened or modified. The committed opening fixture is generated disposable test
state, captured before this engine change.

F3. Normal URLs retain native setTimeout/setInterval and Date timing. Test-mode
live timers and stepping share logical deadlines, including combat phases.
Returning to live timers retains that monotonic engine time, avoiding a long
negative drift correction after a large jump. Export reward eligibility remains
based on wall time.

## Verification

V1. Build passes. Tested bundle SHA-256:
`37424ab0679b5bef0446fbb496b5f35684895a54eb12cbca22f716bf9b8665d2`.
`git diff --check` and syntax checks pass. Rebuilt bytes were served only from
this worktree at port 18950.

V2. Full `npm test` passed **988/988** during implementation (13.44 s, later
266.88 s). A later loaded-host run was 987/988: the existing alloy native fixture
hit its 60-second child-process timeout; its isolated retry also timed out.
Final complete test set passes **988/988**, zero failures, in 238.17 s:
`YAIRPG_FIXTURE_TIMEOUT_MS=180000 node --test --test-concurrency=2 tests/*.test.js`.
The optional timeout override changes no assertion and defaults to the original
60000 ms. An initially misplaced Node concurrency argument did not bound workers;
those duplicate lane runs were stopped, and the final command above places the
flag correctly before the file paths. Other agents' runs were not stopped.

V3. Final-byte equivalence browser check exits 0. It compares whole
`create_save()` envelopes from the same disposable opening fixture after the
normal unflagged speed-1 timer callbacks and after stepping. Only `saved_at` and
`last_rewarded_export` are excluded as wall-clock fields. Seeded streams, calendar,
played time, inventory, XP, quests and pending fighter/action progress remain.
Every case also compares the next live speed-1 tick after resuming.

| Case | Ticks | Actual engine callbacks | Advance call |
| --- | ---: | ---: | ---: |
| Idle | 12 | 12 | 1.163 s |
| Running work/training | 12 | 12 | 1.125 s |
| Combat | 12 | 1444 | 1.152 s |
| Timed search through completion | 65 | 665 | 6.836 s |
| Paid field work | 125 | 125 | 11.070 s |
| Autosave boundary | 65 | 65 | 6.691 s |

The paid period earns the same 20 coins in both paths. Idle reports zero due
autosaves; 65 ticks reports one final autosave. Invalid/fractional/nonfinite counts
reject and zero advances nothing. Total advance-call time: **28.037 s for 291
speed-1 ticks**, whose natural timer duration is 291 s. This comparison uses an
independent deterministic browser timer queue around the normal bundle; it is
not another gameplay model and does not pretend the reference waited 291 wall
seconds. Final normal-URL fresh-origin play advances with real browser timers,
reload succeeds, helpers are absent, and the pre-change opening save loads.
All six cases run at 1366x768, with zero page errors. Desktop screenshot inspected.

V4. Both converted journeys pass their existing native assertions, not merely
clock checks: workshop **10 groups**, Fort **12 groups**, zero page errors. These
include save/reload and literal file-input import, partial Fort action progress,
paid crafting inputs, combat clears and repeated reward checks. Their final
artifacts are `/tmp/sim-stepper-workshop-final-pause` and
`/tmp/sim-stepper-fort-accepted`.

| Journey | Initial natural-timer baseline | First converted checkpoint | Final loaded-host run |
| --- | ---: | ---: | ---: |
| Workshop | 92.08 s | 99.24 s | 384.48 s |
| Fort route | 112.19 s | 22.92 s | 92.99 s |

These are actual `/usr/bin/time -p` measurements. The host was concurrently
running several unrelated full suites; they are not isolated benchmark samples.
An additional seeded workshop timer baseline passed in 175.83 s. **Do not claim
an end-to-end workshop speedup.** Its timer waits are replaced, but UI, rendering,
publication and shared-host CPU costs still dominate. The demonstrated speed
wins are the equivalent engine advancement and Fort route. Workshop conversion
is functionally verified, with performance acceptance still for Weibao to judge.
The workshop freezes engine timers between native controls and explicitly
advances its existing predicates, then resumes before file import.

V5. Reproduction summaries are committed in
[`checks/sim-stepper/verification.json`](../checks/sim-stepper/verification.json).
Full comparison saves and screenshots remain in `/tmp/sim-stepper-equivalence`.
No million-tick stress run, 3600-tick backup UI boundary, or all-speed matrix was
performed; those are limits of this evidence, not extra director acceptance
requirements.

## Merge notes and remaining acceptance

M1. No branches were merged and nothing was pushed. `src/main.js` has an in-place
extraction with the tick body indentation/order retained, two helper imports,
action wrapper, autosave deferral, customization render guard, and a stepper
beside the loop. P00 must retain its later tick joins when applying this diff.
The panel list in `advanceTicks` covers panels present at `b0fba727`; a later new
panel can still render normally until added to that batching list.

M2. `src/display.js`, `src/ui/combat_display.js`, `src/models/combat.js` and
`src/workspace_layout.js` also change. Their edits are small entry guards or
engine-timer substitutions. The isolated native Combat VM test now supplies
those explicit timer bindings. Save formats and content definitions do not
change. Generated `dist`/HTML fingerprints are not committed.

A1. Weibao's remaining acceptance is that faster checks return identical results.
No new mechanics or taste decision is proposed. Usage and reproduction:
[SIM_STEPPER.md](../checks/SIM_STEPPER.md).
