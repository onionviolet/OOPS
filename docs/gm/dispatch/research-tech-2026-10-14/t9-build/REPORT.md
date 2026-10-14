# T16: Z1-Z6 headless planner QA delivery

2026-10-14. SOURCE / QA COMPLETE at the bounded demonstration contract. No gameplay or native persistence claim. Branch `codex/invention-planner-qa`, isolated worktree `rt-t16-qa`, released T6 base `144ed1a0ca8312bc336a57ae716c57b4877d60b6`. Root explicitly selected the lane and authorized a local commit after zero full-suite failures. No push or merge.

F1: 30 planner tests, 334 new QA tests and 992 full-suite tests passed, all with zero failures/cancelled/skipped/todo. Full suite includes the 30 planner and 334 QA tests; the inherited suite had 658 tests. No pre-existing failure was observed. Final full run took 9.664 seconds. The 250 smoke fixtures overlap the 250 generated QA test cases, so they are not an additional independent test count.

F2: All 128 descriptor/world cells match independently declared expectations: 120 unsupported, four supported-solvable and four supported-unsolvable. Direct intermediate/deep IDs are disposed separately. Smoke completes 250 cases across four seeds; sweep completes 2,000 across seeds 1..32. Each case is exactly replayed. Supported-unsolvable, unsupported, invalid and budget-exceeded remain separate.

F3: All 216 benchmark profiles completed in 221.320 seconds, with 180 admitted profiles and 36 expected admission refusals. Every admitted p95 meets the proposed timing target. Scope remains a pure planner demonstration; all native consumers are `unbound-demo`.

## Authority and scope

Read live AGENTS/PROJECT/USER_VISION, main-checkout PI1-PI11/PQ owners, T9 REPORT/FUZZ/GOLDEN/DANGER_LINT/SAVE_STABILITY, finished T6 REPORT/CHECKPOINT, COMMON, supporting technology/research owners and P18 HARNESS/HYGIENE/METRICS joins. The explicit T16 worktree/commit decisions supersede T9's original preconditions and COMMON's docs-only restriction. No product direction changed. Existing research palettes remain proposals. Desktop/laptop remains primary; no UI was selected and mobile remains deferred.

Main checkout and T6 worktree were read-only. No source acquisition, personal saves, private library, sealed truth, native save registration, DOM/game handler, package.json, dist or index.html was touched. No real dangerous procedures, ingredients or physical quantities were added to fixtures. Hazard negatives use synthetic policy markers; numeric game-credit controls are explicitly typed fictional costs.

## Gates

| Gate | State | Evidence / exact boundary |
|---|---|---|
| Z1 matrix and dispositions | PASS | `smoke.json`, `sweep.json`; 128/128 expected dispositions, zero censored matrix cells |
| Z1 I/T/C/U/M mutant detection | PASS | Each deliberate mutant is detected; approved gift, optional cycle, dormant unsolvable and demo consumer controls pass. Findings are independent, not an exclusive enum |
| Z2 independent oracle | PASS | <=8-goal subset BFS; no planner solver/SCC imports. Sweep maximum: 8 goals, 24 methods, 11 primitives; at most 256 subsets |
| Z2 witness, metamorphic, purity | PASS | Primitive availability, dependency order, legal method/roots, selected acyclicity; catalog reversal, availability, OR pruning, composition, hidden-stock projection, frozen inputs and detached output controls |
| Z2 legal shrinking | PASS | Independent worker, two-second deadline; retained C finding. `shrink.json` records initial/minimal manifests, eight attempts and finite oracle scope. Minimality is within method/requirement/unused-primitive reductions, not a global mathematical minimum |
| Z3 frozen v1 golden contracts | PASS | Separate candidate capture, hand-table self-review and explicit freeze. Three complete truth/witness/estimate/view bundles plus magic, missing-water/reference and composition companions. Current pack digest and semantic checks also pass |
| Z4 original/joined/rendered synthetic lint | PASS | Original catalog hazard closures include pruned alternatives; final text surfaces and joined fragments scan. Closed abstract schemas, typed fictional costs, Unicode normalization, missing annotations, unknown text, required-surface coverage and exact review exceptions are tested |
| Z4 real-vocabulary / semantic / language coverage | REVIEW | Initial policy is scoped synthetic English coverage. Real vocabulary, other languages and exhaustive semantic inference are unreviewed. Unknown text/language/required surfaces hold review; no universal PI9 certification |
| Z5 retained receipts and detached restoration | PASS | v1 meaning, graph, law, choices and wrong knowledge remain pinned against additive/removal/rename/semantic/world changes; no current-pack lookup. Invalid/future/missing executable revision rejects before synthetic publication |
| Z5 capacity / sharing / query parity | PASS | 1/32/128 projects share one retained bundle, repeated capture/queries add no records, overflow denies new optional admission. Mock write/handler failures preserve the old SOURCE_SYNTHETIC memory fixture |
| Z6 structural/work/deadline limits | PASS | Catalog, text, graph, path and operation bounds apply before planner cloning and during counted work. All five call phases and external graphs are checked. Oversize returns no graph/witness; independent worker timeout is exercised |
| Z6 proposed p95 timing profile | PASS | 10 warmups/100 serial samples per profile; dedicated child, exact source/fixture digests, median/p95/max and operation counts in `benchmark.json` |
| Z6 heap/RSS evidence | REVIEW | Between-call heap samples plus GC pre-collection observations and process peak RSS. Observed added heap meets target; an exact transient live-heap maximum is not certified |
| Rebuild / browser / gameplay / native Save-reload-Import | NOT RUN | Excluded headless lane. Pure receipts and fault mocks cannot prove those gates |
| Director acceptance / merge / push | NOT RUN | No accepted game content, fiction, balance, taste or integration claim |

## Implementation and T6 changes

| Area | Delivered behavior |
|---|---|
| `src/invention_qa.js` | Bounded plain-data/catalog/external-graph admission; matrix disposition; multi-finding classifier; synthetic consumer sidecar resolution; deterministic canonical manifests and SHA-256; structured refusal |
| `src/invention_danger_lint.js` | Contextual catalog and joined/rendered scan; hazard propagation with visited closures, exact exceptions, abstract schemas and explicit incomplete-coverage reporting. No model call |
| `src/invention_receipts.js` | Pure capture/encode/decode/retain-v1 migration/query/projection, explicit supplied IDs/revisions, detached validation, immutable bundle and meaning digests, resolver support checks and knowledge separation. Roadmaps only, no products/stock/witness execution |
| Helpers, worker and five QA suites | Seeded public synthetic catalogs, independent BFS oracle, legal witness replay, invariants, mutant controls, bounded shrinking, parent-controlled isolation and fault-injection fixtures |
| Two CLI scripts / v1 fixtures | Smoke, sweep, benchmark and candidate-only capture; frozen input/golden/policy/manifests; no snapshot update in tests. Output confined to this lane |

T6's planner needed **scoped instrumentation only**, because repeated catalog scans, fixed-point solving and recursive SCC/view/depth walks had no work counters. Added `measurePlannerCall` as the accounting bridge and counters for catalog/validation/copy/ordering/expansion/index/solve/edges/trace/diagnostics/view/depth/estimate. Existing five signatures and admitted outputs stay exact. Copy accounting activates only inside the scoped bridge, preserving ordinary structured-cloneable metadata behavior in direct calls. QA found no inherited T6 semantic defect requiring repair; T6's pack and test file are unchanged.

The adapter uses iterative topology preflight and SCC condensation before invoking recursive planner walks. DAG longest paths and conservative SCC-size path bounds enforce the 256-edge profile. A large SCC may be refused despite a shorter actual simple path; that is a conservative computational admission decision, not proof of an impossible invention or a player power cap. Direct raw T6 calls are not a substitute for the QA adapter's external-input admission.

Work units combine counted visits/edge inspections/order comparisons and serialized copy characters, plus admission/output validation. They are an engineering counter contract, not CPU instruction counts. Refused-preflight benchmark profiles have null operation measurements rather than fabricated zero-work proof.

## Performance and retention

36 profiles are censored by the configured admission bounds: 1,024-node favorable/hostile chains exceed the path bound; 1,024-node SCC-with-exit exceeds the conservative SCC bound. They return `budget-exceeded`; no timeout/crash/partial publication occurred in the final run. There is no claimed admitted 1,024-node chain timing.

| Measurement | Final observation |
|---|---:|
| Maximum admitted single-API p95 | 36.865 ms |
| Maximum admitted five-API-bundle p95 | 69.803 ms |
| Maximum five-call aggregate work | 737,485 units |
| Base heap | 5,258,768 bytes |
| Between-call observed peak heap | 62,277,944 bytes |
| Between-call observed added heap | 57,019,176 bytes, below 64 MiB target |
| Largest GC pre-collection heap observation | 63,043,808 bytes |
| Process peak RSS | 163,264 KiB |
| 1 / 32 / 128 projects, UTF-8 bytes | 3,417 / 8,895 / 25,915 |
| 1 / 32 / 128 projects, UTF-16 code units | 3,417 / 8,895 / 25,915 |

Timing values use nearest-rank quantiles over 100 samples; p95 index is `ceil(.95*n)-1`. The five-call bundle invokes all five existing APIs through their checked phases. Dedicated child concurrency is one; T16 did not run a test suite alongside the final benchmark. Other machine load is not controlled. UTF-16 units are not storage bytes or a full-envelope quota guarantee.

Attempt history is retained in `BENCHMARK_ATTEMPTS.md`: initial 60-second timeout with suite overlap, later stdout/GC result-capture failure, and successful final file-based capture. Structural, operation and timing targets were not raised. A supplemental inline shrink-record command inherited Node's `--input-type` into its worker and failed; rerunning that evidence capture from an ordinary `.mjs` passed without source changes. These tooling failures are not reported as passing tests.

## Commands and evidence

Executed from this worktree, final source unchanged afterward:

```sh
node --test tests/invention_planner.test.js
node --test tests/invention_planner_fuzz.test.js tests/invention_planner_golden.test.js tests/invention_danger_lint.test.js tests/invention_receipts.test.js tests/invention_planner_limits.test.js
node scripts/invention_qa.mjs --mode smoke --output docs/gm/dispatch/research-tech-2026-10-14/t9-build/smoke.json
node scripts/invention_qa.mjs --mode sweep --output docs/gm/dispatch/research-tech-2026-10-14/t9-build/sweep.json
node scripts/invention_qa.mjs --mode benchmark --output docs/gm/dispatch/research-tech-2026-10-14/t9-build/benchmark.json
npm test
git diff --check
```

Candidate capture command and explicit table review are in `GOLDEN_REVIEW.md`. Supplemental case manifests bind each executed fixture's seed, target, mutation refs, expected support/solvability, approved gifts, consumer refs, limits and independent-oracle scope. Supplemental isolated C shrink and final source/test/design/telemetry fingerprints are saved in `shrink.json` and `verification.json`.

| Evidence | Purpose |
|---|---|
| `planner-tests.log`, `qa-tests.log`, `full-suite.log` | Actual final counts, failure names (none), commands' Node output |
| `smoke.json`, `sweep.json`, `case-manifests.json` | Completed/attempted/censored coverage, exact replay and pinned per-case inputs |
| `benchmark.json`, `benchmark-child.json` | Final byte-bound metrics and isolated child result |
| `benchmark-gc.log` | 39 MiB raw local GC trace; deliberately ignored by lane-local `.gitignore`, not committed. Digest/observed peak retained in verification and benchmark artifacts |
| `verification.json`, `shrink.json` | Final input/source/test/design digests and bounded isolated shrinking evidence |
| `candidates/`, `GOLDEN_REVIEW.md`, v1 fixture manifest | Candidate provenance, separate review, immutable input/output/policy digests |

Scoped diff: one modified source (`src/invention_planner.js`), three new source modules, five new test suites, two helper modules, two CLI scripts, the public v1 fixture folder and this lane's evidence. No package or other runtime source changed. Commit only this scope after the recorded zero-failure `npm test`; exclude dist/index and raw GC telemetry.

## Remaining concrete gates

R1: Real-vocabulary, multilingual and semantic PI9 review remains open. New unreviewed content is held; this synthetic policy is not a universal detector.

R2: Exact transient live-heap peak and richer adversarial/per-world profiles remain review boundaries. Conservative large-SCC refusal is explicit. No threshold increase or gameplay performance certification.

R3: Actual consumers, roadmap UI, native receipt-owner registration, native persistence/compatibility, rebuilt desktop acquisition/use, product/handler settlement, generation/compaction and human acceptance are separate unselected work. Current receipt product/effect/custody/settlement/generation queries are N/A. Only retain-v1 migration is supported; unsupported conversions reject. No native save or product was created.

This branch delivers the authorized headless QA packet. Root retains integration authority.
