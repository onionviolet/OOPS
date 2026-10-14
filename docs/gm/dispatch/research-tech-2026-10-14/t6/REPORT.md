# T6 invention planner prototype, 2026-10-14

F1: The pure module implements authored AND/OR planning, world pruning and additions, feasibility witnesses, cycle diagnostics, actor knowledge projection, scale estimates and shared-node composition. It has no imports, DOM access, clock, randomness or game registration. All five requested API signatures are retained.

F2: Final focused run: **30 tests passed, 0 failed**. Final worktree `npm test`: **658 tests passed, 0 failed**, 0 cancelled/skipped/todo, 13.159 seconds reported by Node. The full count includes the 30 planner tests. No pre-existing failures were observed. `git diff --check` also passed. This is source/test proof only.

F3: Nothing is wired into gameplay or persistence. No build, browser, installed-game or human acceptance claim is made. This task changes only the two new source files, one test file and T6 checkpoint/report. No other src file, dist file or index.html changed. Delivery branch is `codex/invention-planner`; scope authorizes a local commit, no push or merge.

## Authority and files

Read the **main-checkout** [round 5 design owner](/Users/weiwei/code/yet-another-idle-rpg/docs/TECHNOLOGY_AND_PROGRESSION.md:923), including its uncommitted PI1–PI11 text, and [COMMON.md](/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/research-tech-2026-10-14/COMMON.md). The explicit T6 instruction overrides COMMON's docs-only/no-commit constraint in this isolated worktree. PROJECT/USER_VISION standing direction remains unchanged; the shared main checkout was read-only. Supporting research owners listed by COMMON were read, with no external research needed for this implementation.

| File | Purpose |
|---|---|
| `src/invention_planner.js` | Pure ES module, five exports, authored-data validation |
| `src/data/invention_pack_home.js` | Demonstration pack and home/magic world fixtures, deliberately unregistered |
| `tests/invention_planner.test.js` | 30 node:test cases |
| `docs/gm/dispatch/research-tech-2026-10-14/t6/CHECKPOINT.md` | Resume state, authority and scoped acceptance |
| This report | API contract, proof and future integration proposal |

The authored data belongs in src so a later consumer can reuse it without importing tests. It remains demonstration data, not accepted game content or balance. It includes soap alternatives, a lamp upgrade, a thermometer and a wholly abstract civilization-scale energy target. The tiny magic world is original fiction: it prunes combustion-based lighting and adds magic lighting. No franchise/canon claim is made. The deep target contains fictional capacities only; no weapon procedures, reagents, quantities or chemistry (PI9).

## API and data contract

Inputs are ordinary structured-cloneable data. IDs are globally unique nonempty strings; `$` is reserved for projected slots. A pack has arrays `functions`, `methods`, `primitives`. Functions are goal records `{id, label, scale?, target?}`. A named target descriptor is exactly `{function, magnitude, form}`; matching zero or multiple authored functions throws. Intermediate functions need no descriptor.

Methods are `{id, label, produces, requires, scale?, tags?, when?}`. `produces` names a declared function; requirements name declared functions/primitives. Duplicate IDs, dangling products/requirements and unknown scales throw instead of silently becoming feasible. `requires: []` explicitly represents an independent route. Requirements are a set of capabilities, without quantities or consumption.

Primitives are `{id, label, scale?, missingReason?}`. Worlds declare availability with `available[id] = true` or `{available: true, reason?}`. Omitted, false and truthy non-boolean values are unavailable. Available means held/supported capability for this model, not a stock count or reservation. Unavailable primitives stay terminal so diagnostics can name them.

Worlds may add their own `functions`, `primitives`, `methods`, using fresh IDs. `rules.blockedMethods` and `rules.blockedTags` map IDs/tags to plain reasons. A method's `when` map must match `rules.flags` exactly; missing flags do not grant a capability. No adapter callbacks or random world generation run in the planner.

| Export | Result and semantics |
|---|---|
| `expandTarget(pack, world, target)` | `{version: 1, roots, nodes, pruned}`. Goal nodes OR over methods; methods AND over requirements; primitives record availability. Only reachable permitted branches are expanded. IDs/edges are sorted; repeated references share nodes. Cycles are retained as edges and expansion terminates. |
| `checkFeasibility(graph, world)` | `{solvable, witness, missingPrimitives, cycles, deadEnds}`. A least fixed point prevents self-bootstrap. A successful witness lists roots, unique node IDs, primitive IDs and dependency-first steps `{id, method, requires}`. It chooses a deterministic satisfiable route, without claiming cheapest or fastest. Missing primitives carry ID, label and plain reason; world reasons override authored/default reasons. |
| `roadmapView(graph, knowledge)` | `{roots, nodes, nextMissing}`. Knowledge entries are fidelity 0–5, or `{fidelity?, wrong?, label?}`. Unknown OR alternatives vanish completely. Fidelity 0/1 requirements become anonymous `$slot:n` records with no truth ID, label, scale, availability or descendants. Fidelity 2–5 shows known labels/edges. `{wrong: true}` shows `state: "believed"`, default fidelity 2, optional remembered label, without telling the actor it is wrong. |
| `estimate(graph, choice = {})` | Depth, width, unique node count, counts by kind/scale, highest scale, shortest-distance layers and `cyclic`. `choice` maps function IDs to permitted method IDs; unspecified functions retain all alternatives. Invalid choices throw. |
| `composeTargets(pack, world, a, b)` | Same graph format, both roots required (AND), no synthetic root. Expansion shares intermediates, methods and primitives by stable ID. Reversed target order gives the same graph; composing an identical target twice gives its original graph. |

Feasibility re-reads primitive availability from the supplied world, but the graph already encodes its expansion-time world rules. Re-expand when flags, prohibitions or world additions change. Shortage diagnostics stop at already solved subprojects. For each remaining OR region they give the union of shortages, **not** a minimal set that every solution must obtain. A pruned goal with no methods reports a named dead end even when no primitive is missing.

Cycles are reported as strongly connected groups. `blocking` means a loop remains unresolved inside that group under current availability, not that every other root or alternate route fails. An independent route can remove the block. An exit for only one goal does not hide a remaining smaller circular dependency in that group.

`nextMissing` is the first deterministic depth-first **knowledge gap**: an unknown slot, a goal with no known method, or a known node below recipe fidelity 4. Descendant gaps precede the current node's fidelity gap. It can identify a gap in an optional known route; it is not an active queue or route optimizer. Complete knowledge returns null even if stock is absent. The view never copies full feasibility diagnostics, primitive availability or world-pruning reasons. Wrong entries display beliefs for nodes retained in the graph; arbitrary false/pruned belief graphs and experimental correction are not implemented.

Depth is the longest dependency path in **edges**, with roots at depth 0. Cyclic selected graphs report null depth rather than a fictitious finite estimate. Width is the largest layer by shortest distance from any root, so shared nodes count once. Scale bands are authored illustrative annotations, not a universal era rule or a depth threshold. Unscaled primitives/functions default to person; unscaled methods inherit their product's band. Estimates are structural, not time, labor, cost or throughput forecasts.

## Observed demonstrations and checks

| Target, all alternatives | Depth | Width | Unique nodes | Highest scale |
|---|---:|---:|---:|---|
| Soap | 4 | 7 | 15 | person |
| Lamp upgrade | 4 | 4 | 10 | workshop |
| Thermometer | 4 | 4 | 10 | workshop |
| Abstract energy project | 12 | 6 | 32 | civilization |

The deep graph has 4 person, 7 workshop, 6 town, 6 nation and 9 civilization nodes. In the home fixture soap/lamp/thermometer have complete witnesses; the deep target names unavailable fictional capacities. Composed lamp/thermometer goals share glasswork and its prerequisites once. These are module evaluations, not playable results.

Commands run in this worktree:

```sh
node --test tests/invention_planner.test.js
npm test
git diff --check
```

The final full run followed the cycle/diagnostic fixes. Focused coverage exercises functional and ID targets, AND/OR shape, method/tag/flag pruning and magic additions, full witness validity/order, named shortages, all-pruned goals, self and multi-goal cycles, independent escapes, partial escapes, knowledge fog/beliefs, projection non-disclosure, estimates/choices, composition, deterministic catalog reordering, frozen-input purity and returned-data independence. No pre-existing failure names to report. A static source inspection also found no imports, DOM references, random or clock calls in the new module/data.

## Later wiring proposal, not implemented

A1: Put an invention roadmap panel in the existing **1366×768 desktop workspace**. Target selection, known roadmap and selected-node details should use available width at readable size. Render only `roadmapView`, including its plain gap reason. Keep full truth graphs and feasibility diagnostics out of player text; any actor-facing scale/cost estimate needs its own knowledge-safe projection or explicit tree-view means. Mobile remains deferred. Rebuild and fresh-origin browser proof would be required for that UI slice.

A2: Adapt existing held actor means, workshop access and native craft/research actions to primitives. A witness is a plan, not permission to consume stock or grant an item. A selected implementation must reserve/pay actual resources, use the existing played clock, stop for supported reasons and produce an ordinary item/service with a real consumer. Queueing, cancellation, cost optimization, stock quantities, fabrication quality, NPC projects and outcomes remain absent here.

A3: Derive graphs from a versioned pack and saved world facts; save target IDs/descriptors, selected methods, actor fidelity/beliefs/provenance and actual work receipts rather than author truth or ephemeral slot IDs. Preserve generated world facts instead of rerolling. This module writes no save fields, so current saves are unaffected. A later adapter needs an explicit optional-state compatibility/migration decision, validation for changed pack IDs, old-save checks and exact Save/reload/export/literal-file import proof. No arbitrary free-text grammar, offline/runtime language model or save adapter is included.

The pure prototype and test gate are complete. Game integration remains a separate authorized slice.
