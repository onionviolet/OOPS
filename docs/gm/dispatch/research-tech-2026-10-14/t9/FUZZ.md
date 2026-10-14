# Z1, Z2, Z6: planner fuzz and bounded execution

2026-10-14. **PROPOSAL / NOT RUN.** Extends PQ1, PI1/PI2/PI5/PI6/PI8
and PV4 in [the owner](../../../../TECHNOLOGY_AND_PROGRESSION.md:937).
Source observations below describe the T6 snapshot bound in
[REPORT](REPORT.md), not main integration or passing tests.

## Z1: current boundary and coverage matrix

T6 `src/invention_planner.js:39-50` matches an exact authored descriptor or
goal ID. It does not generate arbitrary methods. Its catalog merges pack and
world entries, checks collisions/references, and prunes methods by ID, tags
and flags (`:11-36,53-100`). Expansion is topology; world availability is a
boolean capability, not a quantity, time budget or native stock transaction
(`:9,78-80,136-187`). The pack explicitly has no game outputs
(`src/data/invention_pack_home.js:1`). Do not call feasibility acquisition,
production, law compliance at a later clock, or gameplay proof.

The first Cartesian sweep uses the distinct descriptor values in T6's pack:

| Axis | Exact initial values |
|---|---|
| Function | `clean grease`, `light`, `measure temperature`, `release energy` |
| Magnitude | `household`, `room`, `workshop`, `civilization` |
| Form | `bar`, `portable`, `instrument`, `abstract project` |
| World | `home.prototype`, `magic.prototype` |

This is 128 cells, including 120 unsupported tuples and eight matching tuples,
hand-derived from pack `:5-15,84-107`. Under the current availability fixtures,
home soap/lamp/thermometer and magic lamp should solve; the other four should
not. No execution here confirms those counts. Add direct-ID cases for `alkali`,
`glasswork` and the abstract subprojects separately; they have no descriptor.
Future grammar/catalog expansion enumerates all declared axes and worlds and
updates an explicit coverage manifest, never silently sampling away cells.

Proposed harness result distinguishes `supported-solvable`,
`supported-unsolvable`, `unsupported-target`, `invalid-input` and
`budget-exceeded`. Exactly zero descriptor matches is unsupported; multiple
matches is invalid ambiguity. Until a typed adapter exists, classify the
zero-match case from an independent catalog lookup, then assert the documented
RangeError. Do not catch every exception and label it unsupported. Report
enumerated/attempted/completed/unsupported/censored cells separately.

Each case manifest contains `caseId`, immutable fixture revision/digest,
planner byte digest, pack/world/law revision, descriptor or target ID,
test seed, mutation IDs, expected support/solvability, approved shortcut refs,
consumer contract refs and limits. SHA-256 in Node tooling can identify public
synthetic fixtures; private/sealed content gets opaque public refs only. The
QA seed belongs to the test generator, never to gameplay RNG. The planner
itself uses no RNG. Bind Node/platform only for timing comparisons. Reuse
P18 [HARNESS F1.2/F1.5](../../procgen-2026-10-13/p18/HARNESS.md:43), not
its story clocks, E1 policies or scheduler drain loop for this synchronous API.

## Z1: named failure classes

These are independent findings, not a single exclusive result enum. Attach a
rule ID, affected root/method IDs, expectation ref and reproduction case ID.

| Class / code | Detection and severity | Avoid false classification |
|---|---|---|
| `impossible` / Z1.I | Supported graph has no derivation from declared primitives. Hard fail if declared reachable in this fixture, or if planner returns a false positive/negative against Z2's oracle | A wishlist/deep target with named shortages is a valid unsolvable result. Unsupported tuple is not impossibility. Bounded search exhaustion is unknown |
| `trivial` / Z1.T | Selected witness lacks the profile's required independent means, or an empty-input method bypasses a specifically required gate. Review warning unless it contradicts declared semantics | Short paths, salvage, bought outputs, native faculties and real cheats may be correct. Approve by exact method/world-law ref. Scale labels and arbitrary minimum depth alone prove nothing |
| `cyclic` / Z1.C | SCC contains a circular dependency; report `blocking` and whether it lies on the unresolved root frontier. Hard fail if reachable target cannot bootstrap or witness uses a cycle | Optional loops may remain when another OR path solves. `estimate(graph).depth === null` describes full cyclic topology, not selected-witness failure. Never fail on every SCC |
| `unbounded` / Z1.U | Admitted work exceeds structural/operation budgets, repeats without progress, overflows stack or misses the isolated-call deadline. Reject execution/publication and report incomplete coverage | A finite huge graph is oversize, not proven infinite. Infinite magnitude progression is successive finite requests; computational limits are not per-world power caps |
| `missing-consumer` / Z1.M | Playable target has no resolving output contract, or its declared consumer reads none of the promised function/magnitude/form | A planner-only demonstration is intentionally unbound and reports `unbound-demo`. A badge/label is not a gameplay consumer. Synthetic consumer probes prove only their pure contracts |

Additional hard diagnostics: `invalid-pack`, `invalid-witness`,
`nondeterministic`, `input-mutation`, `knowledge-leak`, `dangling-reference`,
`danger-lint-failed`, `save-meaning-drift`. Invalid schema checks occur before
Z1's semantic classes. Consumer sidecar, proposed for QA only:
`{targetId, worldId, status: demo|playable, outputKind, consumerId,
consumerRevision, reads:[function,magnitude,form], contractTestId}`.
For a playable claim, look up the real handler and exercise a changed consequence
and opposite control. A sidecar cannot make T6's unbound products playable.

## Z2: generator, oracle and metamorphic checks

Use dependency-free seeded test helpers under future `tests/helpers/`. Generate
small original catalogs with at most eight goals, 24 methods, 12 primitives;
cap the independent oracle at 256 reached-goal subsets. Methods have AND
requirements; worlds toggle available primitives and prune only permitted
methods. Generate acyclic graphs first, then inject a self-loop, intertwined
SCC, independent escape, shared intermediate, zero-input gift or fully pruned
root. Keep label/ID/scale/reference validation mutations in a separate invalid
input suite. Shrinking must preserve the tested class and legal fixture schema.

Oracle shape: BFS over sets of derived **goal IDs**. Start with no goals and the
world's explicit available primitives. At each state, each permitted method
whose requirements are available primitives or already derived goals can add
its produced goal. Skip transitions adding nothing. Return solvable if all
roots coexist in any state; exhaustive exhaustion proves unsolvable for this
finite model. This differs from T6's method-node fixed-point implementation.
Do not import its `catalog`, SCC or solve helpers into the oracle. For graphs
above eight goals, use handcrafted expected outcomes plus invariants; classify
oracle coverage as N/A rather than claiming exhaustive proof.

| Check | Exact expected relation |
|---|---|
| Witness replay | Every primitive is explicitly available; each step uses a root-reachable permitted method; every requirement precedes its product; all roots derive; unique node IDs; selected estimate is acyclic |
| Permutation and replay | Reorder catalog arrays, requirement arrays and map keys; duplicate requirement references; outputs equal current deterministic semantics. Repeat all five APIs on frozen inputs, then mutate returned nested objects and check no aliases |
| Availability monotonicity | For identical topology/law, adding primitives cannot make a solvable graph unsolvable; removing primitives cannot make an unsolvable graph solvable. Wrong knowledge changes projection, not truth feasibility |
| OR and world rules | Add an independent permitted alternative: solvable stays solvable. Prune a method: no witness uses it. Re-expand when topology rules change; passing a different world to feasibility does not re-prune the old graph |
| Composition | Both roots must solve, order A/B is equal, A/A equals A, unique shared IDs occur once. Lamp+thermometer share `glasswork`, `glasswork.make`, `glass`, `heat`, `glass-skill`; graph sharing is not stock reservation |
| Knowledge | TK0/TK1 roots are anonymous slots; unknown methods stay hidden despite known descendants; remembered wrong labels remain believed. Flip hidden stock/reasons only: projection equal. Hidden topology changes require a qualified visibility contract, not a blanket equality assertion |

Mutation campaign must demonstrate the five requested classes: remove all routes
to a declared reachable root (I); insert an unapproved gift bypass (T); remove
the escape from a required cycle (C); oversize/deep/repeat work (U); remove or
misbind a playable consumer (M). Detect each deliberately broken case; controls
include approved gift, optional cyclic route, supported dormant target and demo
consumer absence. This protects the classifier from returning “clean” always.

Failing cases shrink deterministically: delete unreachable entries, optional
methods, requirements, availability entries, then unrelated world rules. Accept
a shrink only if schema stays valid and the same diagnostic rule remains. Store
the initial and minimal manifests and oracle scope. Shrink in an isolated
budgeted process; never turn a natural acquisition claim into fixture injection.
Borrow P18 [MORE F1.X9](../../procgen-2026-10-13/p18/MORE.md:21). Public failures
print IDs and verdicts only. Use synthetic fixtures for assertion deep diffs.

### Proposed `tests/invention_planner_fuzz.test.js` sketch

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import {expandTarget, checkFeasibility, estimate, composeTargets}
  from '../src/invention_planner.js'; // Existing T6 API after integration.
import {matrixCases, generatedCases, oracleDerivable, replayWitness,
  deepFreeze, reverseCatalog, assertSupportError, assertKnownOnly}
  from './helpers/invention_qa.mjs'; // Proposed helpers, build these.

test('Z1: every declared Cartesian cell has a disposition', () => {
  const cases = matrixCases();
  assert.equal(cases.length, 128); // Frozen T6-v1 fixture only.
  for (const c of cases) {
    if (!c.supported) {
      assertSupportError(() => expandTarget(c.pack, c.world, c.target));
      continue;
    }
    const g = expandTarget(c.pack, c.world, c.target);
    assert.equal(checkFeasibility(g, c.world).solvable, c.solvable);
  }
});

for (const c of generatedCases({seeds: [1, 17, 73, 0xffffffff], count: 250})) {
  test(`Z2: synthetic ${c.id}`, () => {
    const before = structuredClone(c);
    deepFreeze(c);
    const g = expandTarget(c.pack, c.world, c.target);
    const result = checkFeasibility(g, c.world);
    assert.equal(result.solvable, oracleDerivable(c).solvable);
    if (result.solvable) replayWitness(g, c.world, result.witness);
    assert.deepEqual(expandTarget(reverseCatalog(c.pack), c.world, c.target), g);
    assertKnownOnly(g, c.knowledge); // Uses roadmapView, including leak controls.
    assert.deepEqual(c, before);
    assert.equal(estimate(g).nodeCount, g.nodes.length);
    assert.deepEqual(composeTargets(c.pack, c.world, c.target, c.target), g);
  });
}
// Add explicit I/T/C/U/M mutant/control tests through the proposed QA runner.
// Add availability and composition metamorphic pairs, not copied solve logic.
```

## Z6: performance and admission bounds

Source inference, not timings: expansion scans all methods per reached goal
(`:72,85`); the fixed point rescans nodes/edges until no changes
(`:139-150`). Worst-case solve work can approach O(V*(V+E)); expansion includes
O(G*M) plus sorting/copying the whole catalog. SCC, witness, projection and
depth routines recurse (`:73,119,155,173,206,259`). Reserving IDs bounds cyclic
expansion, but is not stack-depth protection. No resource budgets are present
in these inspected APIs. Benchmark adversarial ID order as well as favorable
order; a long chain can need many fixed-point passes.

Proposed initial engineering profile, finite request limits rather than product
ceilings. The later builder records measured results and can propose revisions
with evidence instead of silently raising a failing limit.

| Resource | Initial bound and check |
|---|---|
| Catalog input | <=1 MiB UTF-8 JSON; <=4,096 combined entries; <=16,384 requirement refs before dedup; <=2,048 characters/string; validate plain bounded schema before copying |
| Expanded graph | <=1,024 reached nodes, <=4,096 edges, <=256 dependency edges on a simple path; enforce during admission/expansion, not only after allocating. Iterative preflight or traversal avoids stack overflow on rejected input |
| Operation work | <=1,000,000 counted visits/edge inspections per public call; stop with structured `budget-exceeded`, never return a partial graph as solved. Define counters for catalog, expansion, solve, SCC, view and estimate |
| Single call isolation | Parent terminates child/worker after 2 seconds, records `timeout`, no result publication. Same-thread timers cannot interrupt synchronous recursion. Limits apply to every API and malformed graph entry point |
| Text/retention | <=256 KiB combined rendered strings per request; <=1 MiB serialized receipt bundle and <=128 pinned project receipts in the first synthetic profile. Deny new optional admission on overflow; never delete earned records |

Smoke: all 128 cells, hand cases and 250 generated cases total over four fixed
seeds. Extended sweep: 2,000 cases total over seeds 1..32. CLI is sequential
initially with total 60-second smoke and five-minute sweep deadlines; report
which cases were not completed. Deterministic count-budget failures are hard
gates. Wall timings are benchmark diagnostics except isolated-call timeout.

Benchmark 64/256/1,024 reached nodes in chain, wide AND, many OR, diamond/shared,
SCC-with-exit and hostile sorted-ID layouts, with sparse and 4,096-entry unused
catalogs. Warm up ten calls; measure 100 serial calls per shape in a dedicated
process. Use sorted timings, nearest-rank p95 at index `ceil(.95*n)-1`, median
and max, and report module/fixture digests, Node, platform and concurrency.
Initial p95 target <=50 ms per API at 256 nodes, <=200 ms at 1,024 nodes,
<=500 ms for the five-API bundle. These targets are unmeasured proposals.
Instrument peak heap with a bounded dedicated workload (target <64 MiB added
heap, report RSS separately); before/after heap delta alone is not peak proof.

### Proposed `tests/invention_planner_limits.test.js` sketch

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import {runIsolated, adversarialCase} from './helpers/invention_qa.mjs';
// Child uses proposed src/invention_qa.js preflight + operation budgets.
// Parent timeout is an independent fail-safe, not the only resource guard.
test('Z6: oversize work returns no publishable graph', async () => {
  for (const kind of ['long-chain', 'wide-and', 'unused-catalog', 'huge-text']) {
    const r = await runIsolated(adversarialCase(kind, {overLimit: true}), 2000);
    assert.equal(r.status, 'budget-exceeded');
    assert.equal(r.graph, undefined);
    assert.equal(r.witness, undefined);
  }
});
// A timeout/crash fails the structured-limit test; record U and censored case.
// Separately inject a nonterminating child and assert parent termination works.
```

Future CI gate: no unexpected hard finding, all deterministic mutant controls
detected, no incomplete smoke cases, exact seed replay, and explicit N/A for
native consumers/performance dimensions not exercised. Performance figures,
browser gameplay, quantities, paid effort and project scheduling remain NOT RUN.
