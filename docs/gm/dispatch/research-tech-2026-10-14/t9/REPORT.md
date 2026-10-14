# Z7: invention planner QA design and later build packet

2026-10-14. **DOCS COMPLETE / DESIGN PROPOSALS / EXECUTION NOT RUN.**
T9 delivers a bounded QA design against T6's five actual APIs: 128-cell target
coverage, independent small-graph oracle, named failure classes, frozen
soap/lamp/thermometer contracts, contextual PI9 lint, revision-stable receipts
and resource budgets. No code/test file, build, browser, save, staging or commit
was performed by T9. [CHECKPOINT](CHECKPOINT.md) records final verification.

## Findings and delivery map

| Code | Finding / ready design | Evidence and owner |
|---|---|---|
| Z1 | Exact authored matching means unsupported combinations differ from impossible plans. Five requested failure classes have mutant and approved-control cases; missing consumers are intentionally unbound in the demonstration | T6 planner `:39-50,136-187`; pack `:1`; [FUZZ](FUZZ.md) extends PQ1/PI8 |
| Z2 | Existing determinism/purity and witness checks are a base, not an independent fuzz oracle. BFS over <=8-goal derived sets supplies bounded contrary evidence and legal shrinking | T6 tests `:1-38,310-341`; [FUZZ](FUZZ.md) extends PQ1 and P18 F1 |
| Z3 | Three hand-derived roadmaps have exact graph, witness, scale, knowledge and composition expectations. Immutable v1 fixtures plus explicit candidate review prevent snapshots from accepting regressions automatically | Pack `:5-38,60-107`; planner `:68-100,241-275`; [GOLDEN](GOLDEN.md) extends PQ2 |
| Z4 | Abstract T6 deep data and a disjoint-primitive test do not constitute danger lint. Lint must preserve risk context from original catalogs through dependencies, composition and every text surface | Pack `:13-24,39-57`; tests `:258-270`; [DANGER_LINT](DANGER_LINT.md) extends PI9/PQ3 |
| Z5 | Graph format v1 and pack ID v1 do not retain executable pack/world semantics. A pure detached receipt design pins meaning, knowledge and supported resolvers through explicit revision cases | Planner `:99-100`; pack `:3`; [SAVE_STABILITY](SAVE_STABILITY.md) extends PQ4/P18 F2-F3 |
| Z6 | Current recursion and repeated catalog/fixed-point scans need measured limits. Computational admission bounds protect a request without imposing a global invention/power cap | Planner `:73-96,119-150,155-175,206-233,259-274`; [FUZZ](FUZZ.md) defines budgets, isolation and benchmarks |
| Z7 | Later code-lane prompt below names file ownership, proposed API boundaries, exact commands, evidence and acceptance. It does not authorize code work in this docs lane | [COMMON](../COMMON.md), [T9](../T9.md), [PLAN](../PLAN.md) |

Shown means inspected source or document bytes. Hand-derived scalar/coverage
expectations are marked unexecuted. T6's newly available report **states** 30
focused and 658 full-suite tests passed, zero failures, including the planner
slice. T9 read that report but did not rerun or independently certify it.
The report also confirms no game or save wiring. P18 is a proposal lane, not
an existing story runner to import. Its contracts are reused, not its passing
runtime status. No broad canon, current science or external-game claim was
researched here.

## Inspected source bindings

T6 source prefix:
`/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/rt-t6-planner/`.
Line references above/below are relative to this worktree, not the main source.
The three implementation digests were refreshed after T6's in-progress edits
and matched on the final read. These identify source bytes, not a build.

| Input | Lines / SHA-256 |
|---|---|
| `src/invention_planner.js` | 275 lines; `c3f90c5ea0cc4a68251f7cfdc566055dc15611f98b28657b546af09c887cad87` |
| `tests/invention_planner.test.js` | 354 lines, 30 static test declarations; `d60cf0c6031ca4db965d533446f397fa6155d8ea93088b26326cfbaf69fde1ef` |
| `src/data/invention_pack_home.js` | 107 lines; `c0a6305606a880b43fb683415aaa39f69b13888b2c3f0e2b6ca4739a097aa10e` |
| T6 checkpoint/report | Read-only authority/proof record in its `docs/gm/dispatch/research-tech-2026-10-14/t6/`; report appeared during T9. Root must refresh its final commit/release status before integration |

Final read-only T6 git observation: clean worktree at commit
`144ed1a0ca8312bc336a57ae716c57b4877d60b6` on its delivery branch. All three
source digests above still matched. This observes its commit, not a T9 commit,
root integration or a write-ownership transfer.

Main owner: [round 5](../../../../TECHNOLOGY_AND_PROGRESSION.md:923),
[PI9](../../../../TECHNOLOGY_AND_PROGRESSION.md:1054),
[round 6/PQ](../../../../TECHNOLOGY_AND_PROGRESSION.md:1102).
Read the full technology owner as it stood through round 6, COMMON's three
supporting research owners, relevant LIFE_SIM research/tech sections, project
priorities and USER_VISION. Later round 9's architecture/build order remains
explicitly illustrative/unselected (`TECHNOLOGY_AND_PROGRESSION.md:1539-1567`);
it does not expand this lane into panel, cheat or evidence-store implementation.

Read-only P18 joins:
[HARNESS](../../procgen-2026-10-13/p18/HARNESS.md:43),
[METRICS](../../procgen-2026-10-13/p18/METRICS.md:173),
[HYGIENE](../../procgen-2026-10-13/p18/HYGIENE.md:9),
[EXPLAIN](../../procgen-2026-10-13/p18/EXPLAIN.md:40),
[MORE](../../procgen-2026-10-13/p18/MORE.md:21), its REPORT and CHECKPOINT.
Adopt manifests, bounded unknowns, ID-only diagnostics, frozen results, pinned
queries and pure projections. Planner QA does not need story actors, scheduler
clocks, E1 policy implementation or long-life telemetry to pass its own gate.

## Ranked later slices, unselected

| Rank / code | Deliverable / acceptance |
|---|---|
| 1 / Z7.A | Pure matrix/oracle/classifier and pinned goldens against finished T6. All 128 cells disposed, five mutants/controls detected, all witnesses legal, immutable fixtures verified |
| 2 / Z7.B | PI9 lint at pack admission and candidate rendering. Abstract/ordinary controls pass; prohibited synthetic detail rejects; unresolved real-vocabulary/semantic coverage explicitly held for review |
| 3 / Z7.C | Pure revision-stable receipts. v1 meaning/projection survives v2 pack changes; corrupt/future/missing executable revision rejects before synthetic publication; absent owner unchanged |
| 4 / Z7.D | Bounded traversal/isolation and benchmark profile. No admitted case overflows; oversize gets structured refusal; timing distributions and operation counts bind exact bytes |
| 5 / Z7.E | Separately selected actual consumer/panel later. Acquire/build/use at 1366x768, rebuild/fresh origin and applicable native persistence; mobile deferred and human acceptance separate |

A-D can form one headless QA checkpoint through the build prompt below; E is
excluded from it. No original proof fixture becomes a compulsory player opening.

## Ready-to-run later code-lane prompt

Paste only when root selects the code lane and T6 releases its files. This is
a concrete implementation brief, not a second source of product authority.

```text
Build Z1-Z6 planner QA as a pure headless slice. Work from
/Users/weiwei/code/yet-another-idle-rpg. Read AGENTS.md, PROJECT.md,
docs/USER_VISION.md, the current PI1-PI11/PQ owner and
docs/gm/dispatch/research-tech-2026-10-14/t9/{REPORT,FUZZ,GOLDEN,
DANGER_LINT,SAVE_STABILITY}.md. Read finished T6 REPORT/CHECKPOINT and
P18 HARNESS/HYGIENE/METRICS joins. Treat all T9 APIs as proposed to build;
retain T6's five public signatures and semantic contracts.

Recover current branch/dirty state, active workers and root's ownership
reservation first. Do not edit T6's active worktree. Use a new isolated
worktree/branch codex/invention-planner-qa from root's reviewed T6-delivery
base, or reuse that exact lane only if ownership is current. Obtain the
finished T6 source via the root-approved commit/base. If T6 is unreleased or
not present in that base, report the exact integration/ownership dependency;
do not copy live changing source or cherry-pick into the shared main tree.
Preserve unrelated edits. Use existing Node >=22.13 environment.

Create docs/gm/dispatch/research-tech-2026-10-14/t9-build/CHECKPOINT.md in
the isolated worktree first. Write only these authorized lane areas there:
- new src/invention_qa.js, src/invention_danger_lint.js,
  src/invention_receipts.js; narrow src/invention_planner.js changes only
  for bounded traversal/counters or a reproduced QA defect after transfer;
- new tests/invention_planner_fuzz.test.js,
  tests/invention_planner_golden.test.js,
  tests/invention_danger_lint.test.js, tests/invention_receipts.test.js,
  tests/invention_planner_limits.test.js;
- new tests/helpers/invention_qa.mjs,
  tests/helpers/invention_qa_worker.mjs,
  tests/fixtures/invention_qa/ (public synthetic fixtures/goldens/policies);
- new scripts/invention_qa.mjs and scripts/invention_qa_capture.mjs;
- this isolated t9-build/ evidence/checkpoint/report directory.
Do not edit the finished T9 design docs, T6 pack/tests, package.json, main,
save registration, DOM/UI/native/game handlers, dist or index.html.
No user-save/private-source access, runtime LLM, external acquisition,
commit, push or merge is included. Root handles integration/commit.

Implement dependency-free helpers with a test-only seeded generator.
src/invention_qa.js supplies bounded plain-data admission, catalog matrix
disposition, multi-finding I/T/C/U/M classification, synthetic consumer
sidecar resolution, deterministic manifests and limit diagnostics.
Keep native consumer bindings explicitly unbound-demo. Build an independent
<=8-goal BFS oracle without reusing planner solving/SCC helpers. Validate
witness order against declared world primitives. Add catalog/availability/
OR/composition/knowledge metamorphic pairs and legal class-preserving shrink.
Unsolvable, unsupported, invalid and censored are separate results.

Hand-check GOLDEN's adjacency/scalar/witness tables against the finished
fixture. Freeze v1 input/output/manifests through candidate capture + explicit
review; never update expected output during tests. Keep a current-pack
semantic test too. Freeze all truth and known-view fields with stable ordering.
When code changes intentionally, preserve supported v1 output or implement
explicit supported conversion; do not bless a mismatch automatically.

Build contextual PI9 lint from DANGER_LINT. Scan original catalogs and final
joined/rendered candidates, propagate hazard closures, validate closed abstract
schemas/typed fictional costs, record required-surface coverage and exact
review exceptions. First policy uses reviewed abstract capacities, generic
procedure/quantity cues and public synthetic restricted tokens. Unknown text,
language or real-vocabulary coverage stays review, never a certified pass.
Do not add real dangerous procedures or ingredient lists to fixtures/docs.
Offline LLM admission is a pure candidate-input test, not an LLM call.

Build pure receipt capture/encode/decode/migration/query functions from
SAVE_STABILITY, with explicit supplied IDs/revisions, detached validation,
immutable graph/meaning refs, knowledge separation and resolver support.
Retain outputs across additive/removal/rename/semantic pack changes. Do not
execute witnesses or create stock/products. Mock handler/write-failure tests
are SOURCE_SYNTHETIC. Missing executable support rejects before publication;
old absent owner remains absent. No actual native envelope wiring.

Enforce Z6 limits before large copies and during work. Use iterative graph
preflight/traversal or safe explicit budgets rather than relying on stack
overflow. All public-call phases count work, including validation, copying,
SCC, projection and estimate. Keep same returned semantics inside bounds;
structured over-limit results belong in the QA adapter and never masquerade
as a solved graph. Parent child/worker deadline is independent of same-thread
timers. No persistent changes or partial results on failure.

Implement CLI modes smoke, sweep and benchmark. Use explicit synthetic
fixtures, no default external save path. Manifest binds source/fixture/pack/
world/policy digests, seeds, expected coverage and limits. Public diagnostics
contain synthetic IDs/verdicts only. Write report artifacts only to t9-build/.
Capture tool writes candidate goldens only, requiring separate review to freeze.

Run, from the isolated worktree:
  node --test tests/invention_planner.test.js
  node --test tests/invention_planner_fuzz.test.js tests/invention_planner_golden.test.js tests/invention_danger_lint.test.js tests/invention_receipts.test.js tests/invention_planner_limits.test.js
  node scripts/invention_qa.mjs --mode smoke --output docs/gm/dispatch/research-tech-2026-10-14/t9-build/smoke.json
  node scripts/invention_qa.mjs --mode sweep --output docs/gm/dispatch/research-tech-2026-10-14/t9-build/sweep.json
  node scripts/invention_qa.mjs --mode benchmark --output docs/gm/dispatch/research-tech-2026-10-14/t9-build/benchmark.json
  npm test
  git diff --check

Acceptance: zero planner/regression test failures and zero unexpected hard
findings; all 128 baseline cells have expected status; 250 smoke and 2,000
sweep cases total across their seeds complete, with exact replay; I/T/C/U/M
mutants fail and approved controls pass; all legal witnesses replay; all
pinned goldens and projection leak controls agree; lint coverage gaps remain
explicit review with no admitted hazardous detail; v1 pure receipt meanings
and beliefs survive v2 while invalid/unsupported imports preserve old fixture;
admitted limits cases terminate and oversize yields structured refusal.
Record median/p95/max, operation counts, heap/RSS evidence and exact byte
digests. Z6 p95 targets are proposed: report deviations without silently
raising limits; timing alone does not prove gameplay readiness. Record actual
full-suite counts, overlap and any pre-existing failures by test name.

Finish t9-build/REPORT.md with each gate PASS/FAIL/REVIEW/NOT RUN, exact
commands/input digests, scoped diff and evidence paths. This checkpoint is
pure source/QA only. No build/browser/gameplay/native persistence/human
acceptance claim. Stop after the authorized slice, returning any concrete
remaining gate to root. Consumer/UI wiring is a separate selected slice.
```

## Open boundaries and checks

| Code | Remaining boundary / owner |
|---|---|
| Z7.O1 | Finished T6 commit/release and root's selected integration base must be recovered at implementation time. T9 source hash agreement does not grant write ownership |
| Z7.O2 | Final threshold/profile and curated real-vocabulary lint coverage need measured/reviewed evidence. Initial values are concrete proposals; no timing or universal danger-certification claim |
| Z7.O3 | Shared native save/consumer registration belongs to root/architecture owner. Pure receipt/mocks cannot close native persistence or actual product-use gates; future UI proof remains desktop first |

Executed in T9: read-only authority/source inspection, relevant byte fingerprints,
static test-declaration inventory, six fenced-JavaScript syntax checks (no
execution) and documentation checks recorded in CHECKPOINT.
Not executed: planner tests/fuzz/oracle, snapshots, lint, receipt roundtrip,
benchmarks, builds, browser play, Save/reload/import, offline authoring, commit
or publication. No sealed truth or private prose appears in this packet.

The docs design is ready for a selected code lane; planner QA implementation
and gameplay remain open.
