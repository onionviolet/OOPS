# Retort leaf delivery and root integration interface

The isolated original retort adapter is implemented in three modules: six declarative controls, five native item specifications, one opt-in rack, one generic three-batch plan, current-stock facts, strict receipt/job validators and a pure center-panel projection. **Source-only delivered, implemented-unverified.** Root owns shared integration, final-envelope native conservation, item registration, UI dispatch, build and canonical delivery. This is not a playable/current-bundle or verified persistence claim.

Writer `/root/book_of_hours_gm`, parent `/root`, 2026-10-07. Exclusive writes were `src/factorio_retort_content.js`, `src/factorio_retort_facts.js`, `src/factorio_retort_host.js` and this interface only. No shared source, reserved assay leaf, personal save, build, commit or publication changed. The earlier [ENGINE_SCOUT.md](ENGINE_SCOUT.md) is a released read-only intake/interface pointer. Oxygen owns only `factorio_retort_native.js` and its [native-validator interface](NATIVE_VALIDATOR_INTERFACE.md); its reader is an independently reviewed root integration dependency.

## Source qualification

Root reports recovered native Factorio methods separate input eligibility/consumption, production progress and output admission. `canGiveProducts` guards completed-output admission; `tryToProduceAndEject` bypasses that check while progress is incomplete. This original adapter **reserves both physical trays before accepting a batch**, which is a deliberately stricter custody choice, not literal Factorio ordering. Its fuel stays unburned during refundable preparation and is spent at three-minute settlement. There is no progressive burner buffer, grid, tick-rate, train or quality implementation. Root binds the exact source method ranges/hashes and recovery limits after its native research completes; this leaf does not claim full native-source completion.

The reversible original setup is two owned Rough wood logs, one player stamina and a separately received two-coin fixture/placement fee to willing Eda. It builds a fixed player-owned rack with a cold disposal place and supplies exactly one Empty resin receiver and one Empty residue receiver. No Eda cooling faculty, secret stock, skill or automatic replenishment is granted. The normal sleeve resin route remains separate and usable.

## Exports and concrete IDs

| Module | Public exports |
| --- | --- |
| [factorio_retort_content.js](../../../../../src/factorio_retort_content.js) | `FACTORIO_RETORT_IDS`, `FACTORIO_RETORT_KEYS`, `FACTORIO_RETORT_TERMS`, `factorioRetortDefinitions`, `factorioRetortOperatingRequires`, `factorioRetortItemSpecifications`, `factorioRetortPlanDefinitions`, `registerFactorioRetortItems({itemTemplates, OtherItem})` |
| [factorio_retort_facts.js](../../../../../src/factorio_retort_facts.js) | `factorioRetortFacts(state, context, registry)` |
| [factorio_retort_host.js](../../../../../src/factorio_retort_host.js) | `factorioRetortContext(state, registry, context)`, `commitFactorioRetortCommand(state, registry, command, context, expectedSequence)`, `cancelFactorioRetortJob(state, registry, jobId, context, expectedSequence)`, `startFactorioRetortPlan(state, registry, context, expectedSequence)`, `controlFactorioRetortPlan(state, registry, command, context, expectedSequence)`, `factorioRetortPresentation(state, registry, context)`; validators `validateFactorioRetortDefinitions(registry)`, `validateFactorioRetortState(state, registry?)`, `validateFactorioRetortAcceptedJob(job, state, registry?)`, `validateFactorioRetortHeldNative(state, context)` |

Fixed world `base.frontier`, location `Village`, group/prefix `factorio_retort`, teacher `feature_objects.miri`, existing bench `feature_objects.fitting_bench`, new site `factorio_retort.rack`, plan `factorio_retort.three_batches`, origin `factorio_retort.install`. The new site declares `provision:false`; root must retain the validated optional-site flag and skip it during generic simulation enrollment. The site is created only by the paid once-only install effect, with owner `player` and capacity 1. That capacity is a work reservation limit, not stored-output stock.

Command constants are `install`, `batch`, `collectResin`, `collectResidue`, `disposeFilled`, `disposeLoose`, with exact IDs `factorio_retort.install`, `.batch`, `.collect_resin`, `.collect_residue`, `.dispose_filled_residue`, `.dispose_residue`. All revisions are 1. Batch is three minutes; the two disposal variants are one minute each; setup and collections are immediate declared commands.

New keys are plain canonical `JSON.stringify({id})`:

| Key property | ID and material meaning |
| --- | --- |
| `resinEmpty` | Empty retort resin tray, one empty receiver |
| `resinFull` | Filled retort resin tray, same receiver holding one resin unit |
| `residueEmpty` | Empty retort residue tray, one empty coproduct receiver |
| `residueFull` | Filled retort residue tray, same receiver holding one spent residue unit |
| `residue` | Spent retort residue, one actual collected loose unit |

Existing imported keys are `sap` = Tree sap, `log` = Rough wood log, `resin` = Set repair resin, `sound` = Sound repair stave, `kit` = Prepared survey kit. `reference_gameplay.resin_kits` remains the exact downstream consumer: one resin, two sound staves, one stamina and three minutes yield two native Prepared survey kits. The adapter adds no parallel kit type or recipe.

## Ownership, completion and pause contract

Manual wrappers validate the optional reader/declared definitions/current held stock, recompute live facts, and call the existing simulation command or cursor API. They return a plan without writing/publishing storage. Root passes that plan to its existing `persistExpansion` path. No leaf changes native inventory, native time, source stock or state in rendering.

Batch admission requires actual carried, unequipped and unborrowed sap/log plus both Empty receiver variants. Existing `availableOwnedNativeCount` supplies the same conservative custody/equipment policy as the established kit reserve. The common executor reserves only this batch and its physical receiver pair, occupies the actor/rack and pins its fixed costs/effects/support. Completion returns both Filled receiver variants once with `reservationReturn:true`; separate collection then grants the real resin or loose residue material as an acquisition. The receiver itself is a changed old object, not a fresh acquisition.

**Admission stock conditions are deliberately excluded from completion support.** Sap, fuel and Empty trays are already held in the accepted job, so demanding them in the bag at completion would falsely refund every batch. Completion rechecks actual local living native body, usable hands, retained workshop rights and the owned rack. Both disposals use the same supported site and actual objects. Cancellation/unsupported completion returns the unchanged input/fuel/trays/effort once and creates no processed output. There is no partial burn or product spill policy.

The three-step plan contains only ordinary command steps for revision-1 batch. It uses no `stockPolicy`; the existing stock-band parser intentionally accepts only the earlier exact resin-kit reserve. The generic cursor settles an actual accepted completion, then previews the next batch. Filled/missing/borrowed/equipped/other-held receivers cause that preview to pause before another sap/log spend. A paused cursor does not occupy the actor, so separate collection/disposal can proceed. Resume is explicit; no infinite routine or new minute timer is added. Cancelling future steps preserves the current accepted job unless its ordinary explicit cancellation is selected.

## Additive reader and validators

The host creates `state.referenceGameplay.retort = {schema:1, installedAt, installedSequence}` after its immediate install command succeeds. Root admits this optional exact-key field under existing expansion 9–11/reference schema1 readers. Missing receipt means inert: no own fact, knowledge, completed work, rack, job or retort cursor. New saves need this updated fork; old schema meanings/absence/other frozen jobs remain untouched. The host does not force an outer schema upgrade or modify unrelated reference fields.

The state validator pins once-only installation count/cause/observer, owned rack/bench, six known completed counters, one saved installed fact, exact definition observation text/basis, natural past sequence/time and no future/replayed receipt. It rejects retort programs, retort steps/origin hidden under another cursor, other actors' retort namespace and unsupported local observations. It requires the exact ordinary plan when present. It rejects orphan or overlapping rack reservations.

The accepted-job validator requires only standard declared job/context fields; exact costs/effects/revision/label; player actor/null target; no roll/outcome/claim; one participant; exact refundable completion support; actual rack reservation; origin sequence after installation; and start time `due-duration` between installation and current played time. It validates retained definitions against content and rejects changed site/cost/output/support terms. Neither helper invents another accepted-job domain.

The held-native helper rejects decorated/noncanonical native tray keys, malformed counts, any receiver duplicated across current carried stock and real negative job costs, and new own items without enrollment. It permits zero held trays if they are genuinely stored/other-held. The full conservation proof therefore belongs to Oxygen's `validateFactorioRetortNativeEnvelope(save)` after root writes the complete staged envelope. It aggregates actual bags/shops/native storage/simulation owners plus negative accepted-job costs and handles legacy aliases once.

Let actual completed counters be B=batch, R=resin collection, C=loose residue collection, D=filled disposal, L=loose disposal. The final reader checks `Filled resin=B-R`, `Filled residue=B-C-D`, `Loose residue=C-L`, and Empty+Filled+held=1 per tray family. No similar global resin equation applies because old sleeve work produces the same useful resin and the old kit recipe spends it. These are consistency checks on real stock/completion, not saved product counters.

## Required root joins

1. Merge definitions once into the existing simulation aggregator; append the plan in `expedition_content.js`; register the five OtherItem specs through `data/expedition_items.js`. Keep `site.provision:false` validated and skipped by generic `enrollSimulation`. Plain static IDs need no `items.js` custom key-preservation change.
2. Recompute `factorioRetortFacts(state, context, registry)` inside `simulationFacts` in `simulation_effects.js`, as well as the manual feature context. The common work-plan scheduler must see fresh stock/support without caller-only booleans. Invoke `validateFactorioRetortState` through the optional reference reader and `validateFactorioRetortNativeEnvelope` through final save preflight.
3. In the strict feature action dispatcher, route `factorio_retort` to the command wrapper, `factorio_retort_cancel` to the declared job cancellation wrapper, and `factorio_retort_plan_start` / `factorio_retort_plan_control` to the finite cursor wrappers. Carry current actor/context/sequence. Exclude this group from `simulation_ui.js` generic controls and reject or explicitly route generic `actSimulation` bypass, so installation cannot omit its receipt wrapper. Root confirmed that protection will be integrated.
4. Append `factorioRetortPresentation`'s section to the existing feature-wave projection and compose the fresh retort context. Its player text explains only costs, receiver state, collection/disposal, pause and refundable preparation. Provenance/agent/verification language is confined to this document. Existing center-panel focus/legibility/action sequence behavior remains the UI owner.
5. Root performs source/native-reader review, integrated static/import/definition/item/link checks and one rebuild/current-source-map receipt. Do not touch reserved `game_absorption_assay_*`, rewrite generic stock policy, clone an inventory, insert a second publisher or run the deferred gameplay suite.

## Evidence, acceptance and release

Passed locally: Node syntax for all three owned modules; pure imports of content/facts/host with the listed exports; pure definition/plan registry construction for six commands, one site, one plan and five native item specifications. No body/native constructor, command executor, generated gameplay fixture, browser, save, reload, failure, unit or regression suite ran. No bundle was rebuilt in this lane. Root's future integrated build must establish source/native/UI/current-build delivery separately.

Later generated journey: install once; settle batch 1 from actual inputs/fuel/Empty pair; inspect two Filled outputs; attempt next batch/finite plan and observe no second input spend; collect resin only and retain residue stall; clear actual residue and resume; consume the collected resin in the existing two-stave kit recipe. Later cancellation/storage/shop/reload/import/failed-save checks must retain pair/input/product/capacity conservation and one durable publisher. Director acceptance remains separate.

All owned leaf source and this interface are ready for root acquisition. The lane releases these four reservations after its receipt; no worker/process/unsaved delta remains. Source-native method binding, shared reader repair, integrated build and later acceptance stay with root. No automatic additional research or gameplay scope is started here.

## Acquired leaf fingerprints

Root should compare the following live files before acquiring; subsequent root integration changes must supersede these pins in its own build/evidence owners.

| Owned source | SHA-256 |
| --- | --- |
| `src/factorio_retort_content.js` | `e617c1ac206d3d75e48ee80b027c0a878d7cc745f26797877ed1a838b89aec3f` |
| `src/factorio_retort_facts.js` | `ade33a8c32878de59fd9b63584181190782397b438f43f57e2c89f450ac6ba6b` |
| `src/factorio_retort_host.js` | `76a0ab2d0075077a70568b0e890abcfb861bdf860de5e74bbbd56137d9787dbf` |
