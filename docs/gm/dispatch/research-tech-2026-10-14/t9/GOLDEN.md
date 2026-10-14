# Z3: hand-checked frozen roadmaps

2026-10-14. **PROPOSAL / NOT RUN.** Extends PQ2 and PI2/PI4/PI5/PI6.
[Owner](../../../../TECHNOLOGY_AND_PROGRESSION.md:1197), current byte bindings
in [REPORT](REPORT.md). These are T6 demonstration contracts, not recipes or
proof of native use. All examples use public original fixtures.

## Z3: three semantic anchors

Hand-derived from T6 `src/data/invention_pack_home.js:5-38,60-69,84-107`
and planner `:68-100,136-187,241-275`. The later builder must verify these
expectations before freezing output. A mismatch is a finding to reconcile,
not permission to regenerate the expected file from whatever code returns.

| Golden ID | Descriptor / world | Exact roadmap and useful future consumer |
|---|---|---|
| Z3.SOAP | `clean grease / household / bar`, home | Soap OR `soap.fat`, `soap.plant`. Fat method AND `alkali`, `fat`, `heat`, `soap-knowledge`. Alkali OR `alkali.ash`, `alkali.trade`; ash method AND `ash`, `barrel`, `water`; trade requires `traded-alkali`. Plant method AND `cleansing-plant`, `plant-knowledge`, `water`. Future consumer: supported cleaning outcome. No hygiene or illness mechanic is implemented by this fixture |
| Z3.LAMP | `light / room / portable`, home | `lamp.oil` AND `glasswork`, `lamp-knowledge`, `oil`, `wick`. `glasswork.make` AND `glass`, `glass-skill`, `heat`. Future consumer: one supported dim-work action gains usable light under actual fuel/access, with a dark control |
| Z3.THERM | `measure temperature / workshop / instrument`, home | `thermometer.build` AND `glasswork`, `measurement-knowledge`, `reference`, `sensor`; same glasswork subgraph. Future consumer: one qualified temperature reading with calibration basis; never expose all author properties |

The baseline world permits combustion and lacks cleansing plant/traded alkali.
All three home roots should solve. Freeze both the complete OR graph and the
selected feasibility witness. They serve different purposes: changing an
unused branch still changes the roadmap even when the witness is identical.

| Baseline assertion | Soap | Lamp | Thermometer |
|---|---|---|---|
| Complete graph kinds | 2 goals, 4 methods, 9 primitives | 2 goals, 2 methods, 6 primitives | 2 goals, 2 methods, 6 primitives |
| Node count / depth / width | 15 / 4 / 7 | 10 / 4 / 4 | 10 / 4 / 4 |
| Shortest-distance layer counts | `[1,2,7,2,3]` | `[1,1,4,1,3]` | `[1,1,4,1,3]` |
| Scale counts, person/workshop | 15 / 0 | 5 / 5 | 3 / 7 |
| Witness product steps, dependency first | `alkali` via `alkali.ash`, then `soap` via `soap.fat` | `glasswork` via `glasswork.make`, then `lamp` via `lamp.oil` | `glasswork` via `glasswork.make`, then `thermometer` via `thermometer.build` |
| Witness primitive IDs, sorted | `ash, barrel, fat, heat, soap-knowledge, water` | `glass, glass-skill, heat, lamp-knowledge, oil, wick` | `glass, glass-skill, heat, measurement-knowledge, reference, sensor` |
| Witness node count / depth / width | 10 / 4 / 4 | 10 / 4 / 4 | 10 / 4 / 4 |

All three: `missingPrimitives=[]`, `deadEnds=[]`, `cycles=[]`, `pruned=[]`.
Depth counts goal-to-method and method-to-requirement edges, not production
time or scientific sophistication. Scale is authored metadata, not computed
from magnitude. Freeze `target` descriptors independently of scale labels.
Full fidelity-5 projection has no `nextMissing`; it may show known unavailable
alternatives without exposing availability. Do not replace knowledge gaps with
truth-level resource shortages in the actor golden.

## Z3: companions and controls

| Golden/control | Expected difference |
|---|---|
| Magic lamp | Home oil method pruned by `combustion`; only `lamp.magic` with `light-gift`, `mana-source`. Four reached nodes, depth 2, width 2; goal/method are workshop, primitives person. Witness is magic method, not a home method with renamed text |
| Home soap without water | Unsolvable, witness null, shortages `cleansing-plant`, `traded-alkali`, `water`; preserve the fixture's world reason for water. This is a union of unresolved alternatives, not a minimal cut or cheapest missing input |
| Thermometer without reference | Unsolvable, one named reference shortage. Fidelity 3 reference with otherwise mastery returns a knowledge gap for reference, not the stock verdict |
| Knowledge views | Freeze TK0 and TK1 root slots; known soap/fat route with unknown alkali; TK1 method slot; all TK5; wrong lamp-oil belief with remembered label. Unknown IDs/descendants, `available`, `missingReason`, `pruned` and truth verdicts must be absent from the actor projection |
| Lamp + thermometer | 15 unique nodes: shared five-node glasswork subgraph occurs once. Both roots solve. Roots sorted; reverse composition equal; self-composition equals single graph. Sharing a graph does not permit double spending or mint a combined native product |

A future full golden bundle contains `graph`, `feasibility`, `estimateAll`,
`estimateWitness`, and named `views`. Keep methods and primitive IDs in the
public synthetic bundle. Sealed-world goldens run in the private route with
ID/status-only public output under P18 [F4](../../procgen-2026-10-13/p18/HYGIENE.md:128).

## Z3: freeze protocol

1. **Z3.F1** After T6's owner finishes, copy its reviewed public pack/world
   fixtures into immutable `tests/fixtures/invention_qa/v1/input.json` in the
   later lane. Record SHA-256 of fixture, planner bytes and API/schema revision
   in `manifest.json`. Freeze explicit knowledge maps, missing-stock controls
   and expected consumer disposition `unbound-demo`. Never read a mutable
   production pack as the only regression input.
2. **Z3.F2** Hand-check the AND/OR adjacency, primitive boundaries, world
   pruning, witness ordering and the scalar table above. Compare against actual
   API output. Fix an implementation bug or correct a documented expectation
   with a reason. Save the review receipt with reviewer/date and exact digests;
   builder self-review is enough for these original fixtures.
3. **Z3.F3** Capture a candidate output in an explicit command, then compare
   semantic and presentation diffs. The capture helper writes candidates to a
   separate directory only. Normal tests never write expected output; no CI
   snapshot-update flag. Freeze only reconciled candidate bytes.
4. **Z3.F4** Store canonical JSON with recursively sorted object keys,
   deterministic array ordering and trailing newline. Preserve witness step
   order, projection order and slot identities; arrays are not generically
   sorted. Do not remove labels, reasons, `version`, scale, `pruned`, unknown
   slots or optional branches merely to make snapshots pass.
5. **Z3.F5** On pack or planner revision, v1 fixtures and expected outputs stay
   immutable for supported v1 semantics. Add v2 fixture/bundle/manifest and a
   deliberate compatibility test. A format change may need a v1 resolver or
   explicit conversion; cosmetic changes get a reviewed presentation revision,
   not a silent rewrite of all old saved roadmaps. Run both old and new gates.

Two checks coexist: exact full bundle equality on pinned fixtures, and semantic
contracts on the current public pack. The second catches production drift that
could otherwise hide behind an untouched old fixture. A current-pack difference
is classified as intentional new version, unsupported revision or regression.
Only a documented change can replace an expectation, not a passing hash alone.
Canonical digest identifies bytes; it does not certify correctness.

### Proposed `tests/invention_planner_golden.test.js` sketch

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {expandTarget, checkFeasibility, roadmapView, estimate}
  from '../src/invention_planner.js';
import {canonicalJSON, replayWitness, verifyFixtureDigest}
  from './helpers/invention_qa.mjs'; // Proposed QA helpers.

const base = new URL('./fixtures/invention_qa/v1/', import.meta.url);
const read = name => JSON.parse(readFileSync(new URL(name, base), 'utf8'));
const input = read('input.json'), expected = read('golden.json');
verifyFixtureDigest(input, read('manifest.json')); // Fixture digest is immutable.
for (const id of ['soap', 'lamp', 'thermometer']) {
  test(`Z3: ${id} complete pinned bundle`, () => {
    const graph = expandTarget(input.pack, input.home, id);
    const feasibility = checkFeasibility(graph, input.home);
    replayWitness(graph, input.home, feasibility.witness);
    const choice = Object.fromEntries(feasibility.witness.steps
      .map(s => [s.id, s.method]));
    const views = Object.fromEntries(Object.entries(input.knowledge[id])
      .map(([name, k]) => [name, roadmapView(graph, k)]));
    const actual = {graph, feasibility, estimateAll: estimate(graph),
      estimateWitness: estimate(graph, choice), views};
    assert.equal(canonicalJSON(actual), canonicalJSON(expected[id]));
  });
}
// Add table scalar assertions independently, current-pack semantic contracts,
// magic pruning, missing water/reference and composition/knowledge controls.
// Do not require current planner byte hash == capture hash: code may change
// while behavior stays identical. Record current hash in the run manifest.
```

Frozen expected JSON and helper implementations are proposed later repo files.
No snapshot or test file was created or executed by T9. Native cleaning,
fuel-based work, calibrated readings, rebuild/browser and persistence remain
separate future gates if selected; these goldens do not require wiring the game.
