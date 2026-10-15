# Stepper performance lane, 2026-10-14

Branch `absorb-all/stepper-perf`, base `9dd86b5a`, port 18980.
Status: source changes committed; **7/7 byte comparisons pass**, corrected full
suite **1705 passed, zero failures, three existing TODOs**. Required final gate
**RESULT FAIL** against the newer current-main client; details below. Throughput
targets remain OPEN.

Desktop target: 1366x768. Visible outcome: existing final panels and gameplay
remain the same after synchronous advancement. Mobile optimization and product
UI redesign remain deferred. No mechanics or taste decisions are introduced.

## Changes and ownership

| Item | Decision and landed change | Commit |
| --- | --- | --- |
| S1 native life-save owner | `persistExpansionPlan` transfers its detached staged envelope to `lifeSaveStorage.setEnvelope`; existing string callers use the same owner. Keeps expansion validation, create-save parsing, overlay order, full envelope validation, pre-observation serialized return, life/NPC observations, guarded durable write, authority routing and post-success publication. | `72590baf` |
| S2 planning reads | Explicit frame passed through existing native, expedition, feature and campaign builders; local to one unchanged `render:false` planning phase. Read-only contexts share snapshots; amended actor contexts receive independent copies. Clears before staging bindings, life-owner entry and native/expansion publication. Ordinary native clock planning can carry the same frame to persistence before those boundaries. | `87a957a2`, `97aa7041` |
| S3 P00 panels | Adds tranche-four, growth, training, Mistglass and harvest to the existing deferred-render batch. Household, living gear, combat options and exposure were already present at this base and are retained. Storylets render through the batched parent simulation panel. | `9cae94a0` |
| S4 retirement traversal | Final profiling retained save preparation as a cost. Suppressed-render traversal reuses a path cursor and copies only paths actually retained. Keeps input detachment, ordered retirement entries, failure behavior and all checks. | `93c7291d` |
| S5 further validator/checkpoint caching | Rejected for this lane: mutable envelope validation and durable native writes still dominate; caching or skipping them would weaken current save/transaction guarantees. No gameplay or save-byte change made to chase the target. | Report only |

F1. Optional-domain absence, save schemas and migration behavior are unchanged.
No player save was touched. An enrolled save still makes one authority commit,
with no legacy write; failed storage leaves the transaction pending and publishes
no observations. Six focused new checks exercise the actual native owner on
legacy/enrolled success and failure, read-frame invalidation/copy isolation, and
exact normal-versus-batched retirement paths/bytes. Original persistence checks
were also run. The initial all-context-copy profile was rejected because cloning
ate the savings; the retained frame only copies mutable actor contexts.

F2. Three-run 200-tick medians, with final render included:

| Case | Before ticks/s | After ticks/s | Measured ratio | Canonical save hashes equal |
| --- | ---: | ---: | ---: | --- |
| idle | 88.44 | 152.51 | 1.72x | yes |
| work | 88.90 | 171.78 | 1.93x | yes |
| combat | 39.77 | 42.19 | 1.06x | yes |
| search | 98.02 | 159.16 | 1.62x | yes |

These are provisional contended-host samples. Baseline load rose above 200 on an
18-core host; after-run load was lower and variable. No quiet slice was certified,
and these ratios do not isolate the code's speedup. **1000 ticks/s idle/work and
200 combat remain OPEN.** Combat uses the same synthetic survival fixture and
15205 actual callbacks as sim-stepper; search executes 800 callbacks over 200
ticks. Reproduction and raw host samples are in
[checks/stepper-perf](../checks/stepper-perf/README.md).

F3. Final idle profile: 1000 ticks in 6866.5 ms. Inclusive costs are overlapping:
`persistExpansionPlan` 3344.49 ms, `validateSaveEnvelope` 1454.72 ms,
`featureWaveContext` 1157.31 ms and `simulationNativeContexts` 953.96 ms.
[Final resolved profile](../checks/stepper-perf/after-profile-top.json) and raw
Chrome captures preserve the evidence. The final 200-tick combat profile identifies
native transaction `capture` as the largest self cost (1101.37 ms). It snapshots
mutable descriptors for failed-strike rollback; caching those snapshots or
skipping its owner set would change failure guarantees, so it was not altered.
Durable writes/full validation remain
mandatory; they cannot be certified within a 1 ms budget on this measured host.

## Verification

V1. Final rebuilt bundle SHA-256: `ef9c1e906e36bcea90fd21007cfd3f0d383d3b84f351a74cf351483153cccac9`. Build passes.
Source syntax and scoped whitespace checks pass. Generated bundle/HTML changes
are not committed. The requested main-checkout performance follow-up file was
missing, so the identical lane-worktree copy was read instead.

V2. Final rebuilt candidate passes **7/7** baseline-native-timer versus candidate
stepper comparisons, covering 356 ticks: idle 12, Running 12, combat 12, timed
search 65, paid fieldwork 125, autosave 65, household/autosave 65. Whole serialized
save envelopes match after excluding only `saved_at` and `last_rewarded_export`;
the next resumed live tick matches in every case. Combat transcript equality,
log-layout bound, invalid/zero tick handling, fresh normal-URL play/reload,
old-save load and absence of test helpers pass; zero page errors. Household fuel
expires through its actual tick join and crosses one due autosave. Desktop
screenshot inspected at 1366x768. [Receipt](../checks/stepper-perf/equivalence.json).
Full saves/screenshots: `/tmp/stepper-perf-equivalence-final`. An intermediate
browser run hit an out-of-scope local panel name during a temporary panel audit;
that entry was removed before the panel commit, and both subsequent complete
seven-case runs pass. No gameplay repair was needed.

V3. Required `FINAL_GATE.sh` ran **once**, with `OUT=/tmp/stepper-perf-final-gate`,
`MAXPAR=2` and old client `27764108efb9eb30ea6aa98658753a639100746f` (then-current
`codex/gameplay-foundations`). **RESULT FAIL**, exit 1. Build passes. Final browser
outcomes: **46/47 PASS**, **38/39 groups PASS**. All P00 groups pass, including
P15's native one-write/enrollment/capture/paid trade/Undo/reload/literal import
journey on the gate's built-in retry. Fort restoration also passes on built-in
retry. [Exact receipt](../checks/stepper-perf/final-gate.json); full logs at the OUT
path. The gate script itself was not rerun.

V4. Two harness defects were corrected without runtime changes: W33.T6's
extracted publication seam needed its new `readFrame` local in the VM fixture
(`cb9f7d60`, seven calendar checks pass); Fort restoration read its export from
its source directory rather than the gate's proof directory (`98cfc5b5`).
The initial gate suite was 1704 passed, one failed, three TODOs, due solely to the
calendar fixture. After correction, the full package glob rerun via
`npm test -- --test-concurrency=2` passes **1705/1705 non-TODO tests**, zero
failures, three existing TODOs, 160930.81 ms (1708 total). Six new focused checks
also pass 6/6. [Full-suite receipt](../checks/stepper-perf/npm-final.json). The
separate passing rerun does not rewrite the original gate RESULT.

V5. The sole remaining browser failure is `workshop-legacy`: the newer old
client saves `availabilities.item.Meadow hay=1`, while this base has no such
content. It fails both the first attempt and built-in retry. `27764108` registers
that item in `src/items.js` and habitat care; `9dd86b5a` does not. An independent
fresh-origin load of the same real old-client export into the untouched base
bundle and candidate produces **identical canonical serialized envelopes**,
with that key absent in both and zero page errors.
[Baseline comparison](../checks/stepper-perf/legacy-base-comparison.json).
This compatibility failure exists on the base, rather than being introduced by
the performance changes. Adding content or changing its saved availability here
would violate this lane's byte/gameplay constraint, so it is reported rather
than repaired.

## Integration and remaining acceptance

R1. `src/main.js` overlaps the coordinator's integration area. Preserve P00's
later tick joins, authority owner and panel wiring when integrating these focused
function edits. The new optional read-frame argument keeps existing callers
compatible. `save_compatibility.js` retains sim-stepper's classifier memo. No
branches were merged and nothing was pushed.

A1. The remaining authoritative integration gate is compatibility with the
current-main old client. The coordinator should preserve its newer content while
integrating these focused performance commits, then run its integration gate.
This lane is **not gate-certified for merge** because its required run returned
FAIL. No changed runtime path is left implemented-unverified by these checks;
the outstanding performance limits are the 1000/200 targets and an attributable
quiet-host measurement. No new human fiction/balance decision is introduced.
