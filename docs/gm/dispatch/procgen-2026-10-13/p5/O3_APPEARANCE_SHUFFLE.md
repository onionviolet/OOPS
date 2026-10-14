# O3: per-save unidentified product appearances

Status: NEW IDEA / PROPOSAL, source-audited 2026-10-13; not an accepted item-system change. Rank W2-1.

| Slice | Outcome Weibao can play | Owner docs | Dependencies | Proposed branch / port |
|---|---|---|---|---|
| O3-A Four product types | Obtain four P2 product types with shuffled unknown appearances, test one, recognize another of that exact type and retain both appearance and learned identity after reload/Import | [Materials audit](../../../../PROCEDURAL_MATERIALS_AND_ALCHEMY_AUDIT_2026-10-13.md), [NetHack follow-up](../../../../research/nethack/FOLLOWUP_SOURCE.md), this proposal | Integrated P1 immutable root/appearance stream and P2 stable identification keys, product truth, knowledge projection mandatory; P3/P4 optional delivery | `proc/w2-o3-appearances` / 19410 |

## Live audit and direction

| Code | Evidence | Finding |
|---|---|---|
| F1 | `src/nethack_fieldcraft_content.js:14-17,29,65-78` | The pale vial is one fixed authored substance and a specific external bench use, not a randomized potion catalogue. Preserve its established identity and use restrictions. |
| F2 | `src/nethack_fieldcraft_item_view.js:26-36,44-65` | Native fieldcraft name/charge projection already exists and requires explicit completed observation plus understood knowledge. The Oct 6 follow-up's “names stay fixed” gap is partly stale. This is a useful pure-projection pattern, not an existing appearance shuffle. |
| F3 | `src/items.js:64-111,230-252` | Item log is a catalogue/seen record; native keys encode identity/components/quality. Renaming a template or putting appearance in its key would corrupt stacking/counts or grant identity globally. Keep key and appearance independent. |
| F4 | `src/simulation_effects.js:281-284`; `src/simulation_contracts.js:217-235` | Actor knowledge is separate from truth. Exact P2 discovery granularity must govern identification; seeing a bottle or logging an item is not learning its hidden properties. |
| F5 | `src/main.js:440`; `src/expansion_engine.js:73-79`; `src/save_files.js:72-73` | Per-save state and validation exist, no finite appearance allocation owner in these audited paths. Integrated P1/P2 APIs are required before this spec can bind real product keys. |

The local NetHack reports retain the earlier source pin and observation/type-knowledge distinction. P5 did not re-fetch upstream and makes no new claim about NetHack's exact shuffle algorithm. This is an original YAIRPG permutation design inspired by identification gameplay, with no copied source. USER_VISION's character knowledge/means direction and `PROJECT.md:381-401` require honest unknown projections; mystery cannot hide whether Save succeeded, what an action actually charged, or what container remains. Same realm/one prestige, existing panels and desktop priority stay intact.

## Conflicts and gaps

| Code | Conflict / gap | Proposed resolution |
|---|---|---|
| R1 | Generated P2 products may form an unbounded identity space; a finite permutation cannot identify all of them uniquely | First slice enrolls exactly four distinct P2 identification keys into a finite demonstration pool. Every additional type remains on P2's existing appearance route. No collisions disguised as type knowledge or infinite mutable permutation. |
| R2 | P2 may identify ingredients/properties, not whole potion types | Consume its real discovery predicates. Showing an identified type never reveals still-unknown dose, side effect or batch property. Property knowledge stays attached to its P2 scope. |
| R3 | Four enrolled products could be batch IDs rather than types | Require P2's canonical identification key: stable composition/process/ingredient-truth revision signature, excluding individual batch serial, quantity, owner, dose remaining and UI name. If no such key exists, adding that narrow P2 adapter is part of O3 integration. |
| R4 | Appearance might encode a truth/effect or leak through tooltips/value/auto-use | Use original neutral visual descriptors independent of effect. Every participating player-facing name/tooltip/list/recipe/shop/knowledge/auto-consume view calls a shared projection. Unknown auto-use requires deliberate selection of the actual owned key; it must not sort by hidden function. |
| R5 | Rerender/new content can reshuffle a saved map | Persist permutation and allocation/revisions. Catalogue additions never re-run shuffle; old mapping wins. Explicit new-save generation is the only shuffle trigger in this slice. |

## Implementation contract

Six neutral appearance records: clouded-glass, striped-clay, amber-glass, ribbed-stoneware, blue-glazed and clear-wrapped. These are fictional container descriptions, not effect/color promises. Distinguish by words and shape as well as color. Pool revision 1 is fixed. At fresh-save setup or explicit O3 enrollment for an old save, Fisher–Yates shuffle the six appearance IDs using integrated P1 `appearances` stream, exactly five draws; persist permutation, revision and cursor atomically. Rendering never calls shuffle.

Proposed owner: `expansion.productAppearances = {schema:1, poolId:'village.demonstration', revision:1, permutation:[...], enrolledAt, enrollmentReceiptId, bindings:{[identificationKey]:{appearanceId, productTruthRevision, allocatedAt, acquisitionReceiptId}}, nextSlot:0}`. Closed-key validator verifies six unique allowed appearances, at most four distinct type bindings, unique used slots and real P2 truth/receipt references. Product truth/effect payload remains exclusively P2-owned. Save exact identification keys and mapping, not renderer names. Root selects compatible optional save version after P1/P2 integration.

Enroll a type only at actual accepted product acquisition into this demonstration pool, atomically with P2's creation/custody receipt. Use next slot of frozen permutation; no extra draw. A repeat batch of the same type reuses its binding and does not advance nextSlot. Preview, cancelled/failed acquisition, splitting/merging/trading and repeated load do not allocate. Stable birth order is part of the saved run, not a promise that any acquisition ordering generates the same map. Once four types bind, further types follow normal P2 display; do not reassign a known appearance or silently alias another truth.

Projection inputs: actual product key/state, save mapping, current actor P2 knowledge and genuinely observed container state. Before identification: neutral appearance plus actually known quantity/charge/container and uncertain properties. After valid discovery: P2 authorized identity/property text plus the saved appearance. Appearance alone never grants knowledge; identifying one type can recognize a second instance only when its canonical identification key and P2 type-sharing rule agree. Different concentration, degradation, batches and remaining dose retain P2's instance truth/knowledge rules. Mechanical use always resolves the same P2 truth independent of appearance or identification.

First journey: buy/gather inputs through P2, mix a participating product, inspect its neutral label, experiment/use by a fitting P2 route, acquire another batch of the same learned method and recognize only what the character learned. Obtain three more distinct supported mixtures to fill the four-type pool. This does not turn the old external-use fieldcraft vial into a drink. O3 can use a dedicated demonstration enrollment action or P2 recipe tag; no new free source/ingredient grants.

Compatibility: existing generated products retain their current P2 names/knowledge unless deliberately included in a new demonstration acquisition. Old inventory and known fieldcraft types remain unchanged. Unsupported pool/truth revision or broken mapping rejects Import before replacing the save, or uses a documented read-only compatibility renderer without permitting gameplay; never regenerate IDs to recover. For another fresh seed, the whole mapping should usually differ, but identical permutations are possible. Tests use a chosen distinct seed pair plus many-seed coverage, not a false guarantee that every seed looks different.

File ownership: new `src/product_appearance_{state,content,view}.js` and tests. P2 owns its identification-key/product-acquisition API and shared inventory projection integration; root serializes `src/main.js`, `src/save_files.js`, `src/expansion_engine.js`, `src/items.js`, `src/display.js`, `src/components/inventory_component.js` if touched. No mutation of `src/nethack_fieldcraft_content.js` truth, unrelated item templates or P1 stream implementation. No need for P3 deck or P4 person implementation to ship this slice.

## Acceptance checklist (future, all NOT RUN)

- [ ] A1 SOURCE: finite bijection, fixed draw budget, same-seed determinism, known distinct seed pair, duplicate-type reuse, failed/cancelled acquisition purity, pool exhaustion passthrough, canonical key invariants and P1 stream isolation. Tests and builder build pass.
- [ ] A2 NATIVE: fresh origin acquire/mix unknown product, observe its appearance, experiment through P2, use the real effect, make same type again and recognize learned identity; fill four types. Use another fresh seed to show a changed mapping. Report natural versus seeded-native cases separately.
- [ ] A3 PERSISTENCE: Save/reload unidentified and identified states plus after consumption; Export then literal-file Import at a second fresh origin. Compare mapping, product truth/remaining effects, actor knowledge, inventory keys/counts and next draw. Legacy items and fixed fieldcraft retain behavior.
- [ ] A4 DISCLOSURE / FAILURE: all known player-facing product surfaces omit hidden truth before discovery; type recognition does not reveal unseen batch properties. Failed durable write, forged binding, missing pool and unsupported truth revision leave save/stock/map intact. Color-independent labels distinguish containers.
- [ ] A5 UI: rebuilt 1366x768 and 1600x1000, labels and known/unknown details readable in existing inventory/mixing panels; routine actions visible. Mobile, generalized unknown equipment/curses, infinite catalogue appearances and human mystery acceptance deferred.
