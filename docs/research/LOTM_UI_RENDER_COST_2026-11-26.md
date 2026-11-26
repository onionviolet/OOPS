# Ordinary Tingen UI cost

Status: bounded dense-map UI change measured and agent-verified. Repeated native
projection cost remains a separate issue; browser action latency is not claimed fixed.

| Preflight | Scope |
|---|---|
| Reading | Separate native ordinary-local bakery/tent UI work from browser/CPU contention, then implement one measured improvement if supported. |
| Authority | Coordinator assignment: “preserving all gameplay, discoverability, keyboard access and snapshot parity.” AR3, AR9, AD36; existing UI disclosure/navigation under UR41–UR43. |
| Player sentence | Existing action/map labels, costs and reasons remain the starting point. |
| Route | Actual earned day-two bakery checkpoint, SHA `a780076e9371703d04b959a05e659422b84af3eaa68cd6198d699063cbc49c44`. No outcome edits. |
| Mechanism / fit | Existing full native Node runner and in-process DOM; frozen actual projection isolates DOM composition from host quoting. Browser layout/paint/AX timing is outside this harness. |
| Ring | Native projection diagnosis and DOM presentation. The selected change is the existing map's initial disclosure state. |
| Files | `src/book_world_lotm_ui.js` map hunk, new `scripts/perf/lotm_render_cost.mjs`, `tests/lotm_walk_map_disclosure.test.js`, and this measurement receipt/evidence. `lotm_view_context_budget.test.js` belongs to atlas_passes. This lane used no default build or real browser. |
| Failure and checks | A visual reduction could conceal a method or alter state. Compare native save snapshots, full command sets and the existing keyboard/disclosure route; measure paired work on identical inputs. |

## Baseline

The [initial measurement](../representations/evidence/lotm-render-cost-2026-11-26/baseline.json)
boots the real source in an isolated cached headless bundle. Five native view
reads take 3.50–3.87 seconds. A separate panel mounted from that frozen actual
view takes 359ms and creates 3,610 elements; its unchanged rerenders take
0.67–3.75ms and create zero elements. The saved state stays unchanged.

The projected state contains 351 walks and 352 places. The panel has 7,812
elements and 369 buttons. Its initially open walking map accounts for 4,218
elements. This is a real structural UI cost, but the repeated native projection
is the larger measured synchronous cost. These numbers do not establish that
the map causes the reported 10–25 second browser delays.

## Bounded change and paired result

The existing eight-destination display cutoff now also selects the map's initial
state. With more than eight finite walkable destinations, its figure is built
after the player chooses the existing Show control. Small maps keep the immediate
overview. An explicit show/hide choice survives subsequent renders and travel.
The native walk rows, commands, labels and costs are retained.

The [same-process refined measurement](../representations/evidence/lotm-render-cost-2026-11-26/refined.json)
uses the identical earned input. Its default panel has 3,593 elements instead of
7,812, a 54.0% reduction. All 363 `data-lotm` commands, 369 buttons and 351 walk
rows remain. Five alternating open/closed renders have median costs of 254.75ms
and 14.63ms. These are in-process DOM costs, not browser paint, AX or end-to-end
action timings. An eight-row projection control still mounts its map immediately
in 2.85ms; its unchanged renders have a 0.095ms median. That control is derived
from the same view, not a separate played small-map life. The native snapshot and
original input bytes remain unchanged.

The [CPU diagnostic](../representations/evidence/lotm-render-cost-2026-11-26/profile-baseline.json)
places `auditRemainderCombinedFacts`, `buildSimulationFacts` and garbage collection
above map work in repeated view projection. Profiling and machine load change
absolute timings; the unprofiled read range also varies between runs. No native
projection speedup is attributed to this UI change. A separate owner is examining
the fact-composition cost.

## Separate coordinator desktop observations

The coordinator reports actual built-in-browser checks at 1920×1080 on
`db58757be1df194ac5193c357d176c71eec4f235ff831065038d8913342b57a1`:
the dense bakery panel has 3,627 descendants closed, 7,847 open and 3,627 closed
again, with the same 363 native action buttons and Wendy's request available in
all three states. An earned early Klein post-bread bakery input still begins
with Hide the walking map, and retains market review and the actual tent walk.
These are the coordinator's observations, distinct from this lane's Node timings.

| Check | Result / scope |
|---|---|
| `node --test tests/lotm_walk_map_disclosure.test.js tests/lotm_panel_gaps.test.js` | 9/9 passed: density boundary, explicit choice, figure absent while closed, map-to-quote navigation, retained walk focus, and existing panel behavior. |
| `node scripts/perf/lotm_render_cost.mjs <earned input> <output>` | Paired DOM measurements, retained command multiset and snapshot/input parity passed. Optional fourth argument `profile` enables the separate CPU sample. |
| Scoped whitespace check | Passed. |
| Browser / build | Owned by coordinator; this lane launched neither. No overall latency claim. |
| Cleanup | Native measurement processes exited 0; no server or browser process was started. The shared headless bundle cache remains managed by the existing runner. |

The [summary](../representations/evidence/lotm-render-cost-2026-11-26/summary.json)
binds the input, UI source hash, measured counts and separately attributed browser
observations. Mobile and browser timing measurements remain outside this slice.

## Recomputing the bakery view

The next CPU profile led to a change in how the game combines facts for the current view. It now copies the inherited facts once per projection. On the same day-two bakery save, median time to compute the native view fell from 2,522 ms to 1,660 ms over five views per build. Every returned view matched byte for byte, including all 405 records governing action availability. Serialized state matched before and after every run with the wall-clock save timestamp excluded. The remaining question for desktop play is how long the player waits between requesting an action and seeing its result. [Paired measurements and input hashes](../representations/evidence/lotm-render-cost-2026-11-26/audit-copy-comparison.json)
