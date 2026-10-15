# Stepper performance evidence, 2026-10-14

Candidate base: `9dd86b5a`. Desktop viewport: 1366x768. Mobile and product UI
redesign are deferred. No gameplay, save schema or timer consumer order changes.

V1. `before-benchmark.json` and `after-benchmark.json` contain three serialized
200-tick samples per idle, native Running, native combat and timed-search case.
`performance-comparison.json` verifies all six canonical save hashes per case
match. Only `saved_at` and `last_rewarded_export` are excluded, as in sim-stepper.
Host samples are saved with every run. These are contended measurements; the
quiet preflight was not requested or certified. Changing host load prevents an
attributable speedup claim. The 1000 idle/work and 200 combat targets remain OPEN.

V2. `after.cpuprofile` is the final 1000-tick idle Chrome CDP profile at a
1000-microsecond sampling interval; `after-profile-top.json` resolves its bundled
source map. Inclusive timings overlap. Intermediate profiles: `s1` after the
native object adapter; `s2` the discarded all-context-copy variant; `s2-shared`
after sharing read-only snapshots; `s3` after the missing panels were batched.
Do not compare their wall times as isolated speed trials.

V3. `equivalence.json` records seven baseline-native-timer versus candidate
stepper comparisons, including the next resumed live tick and a household
fuel burn across a due autosave. Combat transcript and batched log layout
assertions are retained. Full disposable saves and screenshots are under
`/tmp/stepper-perf-equivalence-final`, not player saves. Final gate metadata is
in `final-gate.json`; full gate logs remain at its `out` path.

Reproduction (serve this worktree at 127.0.0.1:18980):

```sh
# Before bundle must be rebuilt from 9dd86b5a, with its .map beside it.
YAIRPG_BENCH_BUNDLE=/tmp/stepper-perf-before.js node scripts/stepper_perf_profile.cjs --benchmark before
node scripts/stepper_perf_profile.cjs --benchmark after
node scripts/stepper_perf_profile.cjs --compare before after
node scripts/stepper_perf_profile.cjs --profile after
YAIRPG_REFERENCE_BUNDLE=/tmp/stepper-perf-before.js node scripts/stepper_perf_browser.cjs
```

S1. Full mutable-envelope validation, durable transaction writes and native
publication remain authoritative. None are cached or deferred across ticks.
The retirement traversal optimization only avoids temporary path allocations;
it retains the same clone, classification, validation, ordered entries and
serialized bytes. Normal rendering retains its original traversal.
