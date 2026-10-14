# CR6 two playable checkpoints and builder ownership

2026-10-14. PROPOSAL ONLY. One future code lane, suggested branch `proc/cr6-crafting-wave2`, fresh test origin **port 21700**. Port is not reserved or running. Root assigns a builder and recovers shared writers before implementation. This packet authors no runtime, fixture, build, commit or browser evidence.

Build one checkpoint completely before the second. AB1 registry adapter, AB2 ledger and AB3 projection travel with the behavior that uses them; they are not three completed gameplay waves. First realm stays original Village/base.frontier, one prestige layer. Canon-first source-world order remains intact; the original fixture demonstrates reuse without selecting a comic world. Food optional, comfortable unfed play, no hunger death; mobile and new closed-browser production deferred.

## S-P: CR1 poison/antidote with selectable whole-vial dose

Original fixed source table for `village.response@1`:

| Paid ingredient | Cost / pack | Per pack: 1000 fictional-mass units |
|---|---|---|
| Grey reed | 8 coins | Q-A 100, matrix 900 |
| Red flint | 10 coins | Q-B 60, matrix 940 |
| Binding clay | 6 coins | N-A 50, matrix 950 |
| Clear water | 2 coins | matrix 1000 |

These are original fictional ingredient identities, not P2's saved materials or real recipes. Before implementation check template/name collisions and choose neutral alternative names if needed. This selection introduces one supported **Blend** operation only. Whole input packs 0-99, at least one active pack plus one Clear water. It sums every fraction exactly; mass is packs ×1000. Product is one whole generated vial with that entire batch's Q-A/Q-B/N-A vector. Process does not normalize to P2's reference-vial dose. Larger batches have larger actual delivered active amounts under this newly versioned law. No arbitrary new random draw. Different ratios produce distinct canonical products from this law rather than separate result templates. Partial contents/empty container recovery remain later P6 adapters.

Player path: free in Village → open the existing counter → choose Response mixtures → buy exact inputs or use previously paid stock → blend vial → select count **1 or 2** from owned identical vials → drink as an explicit test → see native agility/strength penalty and a scoped notebook observation → blend/use matching antidote → see only matched response diminish → new dose still acts. UI permits any admitted positive whole count up to actual owned stock; 1/2 are convenient presets, not lore caps. This dose UI applies to new response vials. Existing P2 Drink one dose retains revision-1 behavior.

Natural witness at unchanged time: brew two identical `Grey reed:1,Clear water:1` vials, one `Red flint:1,Clear water:1` vial and one `Binding clay:1,Clear water:1` vial. Acquire through actual paid counter actions. Drink two reed vials -> Q-A200, raw agility penalty -2. Drink flint -> Q-B60, raw strength penalty -0.6. Drink clay -> N-A50 binds Q-A100, leaves Q-A100/strength penalty -0.6. New reed vial restores Q-A200 if the earlier contribution has not expired. Check EXPOSURE's expiry boundaries and receipts at the actual admitted times, rather than assume the interface took no game minutes.

Useful consequence is the real derived agility/strength values used by native stats/combat, not just displayed vial text. Demonstrate final values against baseline and an existing action whose calculation reads those stats if feasible without altering this slice's guards. Source test must show the character stat consumer actually receives the modifier. Native stat changes are the minimum decisive consumer gate; a combat-result claim requires its own actual encounter evidence. No health-loss or lethality is introduced by this controlled fixture. Generic poison harm and damage-rate laws remain CR1 extensions.

Control: activate a regular observed P2 restorative mixture before treatment and retain a QB contribution while curing QA. Antidote must not delete the P2 benefit, ordinary legacy venom or prior health deficit. Buy/use another antidote at a new action ID as needed; expiry/rest and ordinary P2 support are available independent routes. Other recipes containing both toxins/neutralizer are admitted and resolved under the same accounting/order, not banned because they are unusual.

Response method repeat is not in this checkpoint: P2 saved-method/repeat remains fully functional. Response products can be remade manually with paid inputs. Later saved response routines use CR3's automation owner; no duplicate queue is introduced now.

## S-N: CR3 notebook/codex and one paid comparison

Reach through **Notebook** within the crafting workspace or current notebook navigation. Do not create a rival top-level adventure notebook. New `src/crafting_journal_ui.js` exports `createCraftingJournalPanel({container,read,act})` returning `{render,destroy}`. It reads only `projectCraftingJournal`/safe product views. It may host a response-vial tab or small product detail dose controls; `src/mixture_ui.js` remains the existing mixing shell.

Natural journey: pay for P2 ingredients → mix one steeped and one boiled product with **River bellleaf:2, Spring water:1 in each**, or another exact shared selection → select the two owned safe handles → show one controlled change, sample counts, fee **4 coins**, duration **2 played minutes**, station and measurement scope → Run paid comparison → Save pending → return after eligible due time → complete and view health-rate intervals, conclusion and uncertainty. Use evidence to choose one method, pay/mix another vial, drink it through real P2 use, save observed method, queue repeat, see a due output and a shortage/cancel control. A paid comparison alone does not grant the P2 learned method.

Every pair remains separately identifiable after visual grouping. Consumed samples stay in the journal through exact retained product references. Support positive, opposite and overlapping/inconclusive conclusions by the rules in KNOWLEDGE; source tests may use original synthetic near-resolution products but cannot forge P2 identities. Natural P2 lawful pairs may not yield every category for the current save's profiles, so label category fixtures seeded-native/source honestly. Repeated new paid comparisons remain allowed; no first-choice lock or universal discovery reward cap.

UI at **1366x768**: two main independent panes within available crafting width, known product list on left and selected product/test/observation on right; compact pending assay and exact fee/actions remain visible. Histories scroll within reading panes, not above routine actions. At **1600x1000**, add a pinned third comparison/evidence pane if space permits and use height for more readable evidence, retaining comfortable text. Avoid retaining P2's 850px limit for the whole expanded workspace. Make selected variables/count/fee/cancel state readable without horizontal clipping. Keep Back to local actions, inventory access and ordinary crafting reachable. Keyboard labels, focus after result refresh and internal scrolling are acceptance criteria. Cosmetic panel placement remains a reversible builder proposal, not accepted direction.

## Minimal shared edits and exclusive files

One selected builder owns new modules/tests. Root/integrator owns the shared edit sequence below; if root assigns them to the same builder, record an explicit reservation before edits. No second simultaneous writer to items/main/save/mixture UI.

| Proposed owner / files | Minimum concrete change |
|---|---|
| Builder: `product_registry.js`, `mixture_product_family.js`, `consumable_product_family.js` | Register P2 first; preserve exact old decoder/keys; add only response law/decoder/item spec. No universal parts/runes resolver. |
| Builder: `crafting_state.js`, `crafting_native.js`, `product_runtime.js` | Optional owner/migrations, guarded staged publication, runtime read binding. `product_runtime.js` exports `bindProductRuntime(read)`, `readProductEnvelope()`, `runtimeProductItemSpec(key)` and `runtimeProductKeyCheck(key,count)`. It supplies current observer/body and detached envelope snapshots to pure registry. Standalone P2 tests still read `getMixtureOwner()` when no new runtime binding is installed, preserving the old decoder seam. Binding installation never generates products or streams. |
| Builder: `exposure_state.js`, `exposure_laws.js`, `crafting_knowledge.js`, `crafting_journal.js`, `crafting_journal_ui.js` | Ledger/projection/protocols/UI per linked specs. No external app, generated people, food or world-secret files. |
| Integrator: `src/items.js:1,1218-1226,4533-4534` | Registry-dispatch generated decoder before ordinary branches; preserve dynamic projected text/exact inventory_key. Add four fixed public ingredient templates plus response carrier only. Keep legacy P2 fields/getters and ordinary component/quality fallback. Avoid registry importing items, which would cycle. |
| Integrator: `src/components/inventory_component.js:1,40-46` | Replace P2-only insertion check with generated-family count/key validation; preserve ordinary inventory behavior and count model. Prepared item objects remain class instances, not save payloads. Construct candidate generated items from `productItemSpec(nextEnvelope,...)` and the existing item factory before commit; do not decode newly staged products through a runtime reader still bound to the old catalogue. |
| Integrator: `src/active_effects.js:1,515-518` | Add validated `craftingExposure` restore branch with exact metadata and ledger cross-check. Keep P2 branch unchanged; no dynamic per-product template catalogue. |
| Integrator: `src/mixture_ui.js:1,4,21,24,29-37` | Observer-safe product views/handles, knowledge sequence invalidation, notebook/response control host, preview on detached seed context. Existing P2 buy/mix/learn/repeat/cancel retain current law/capacity/timing. Remove raw canonical key from new and existing product DOM metadata. |
| Integrator: `src/main.js:4696-4717,5195-5196,5341-5342,6787-6792,8408-8412` | Bind optional runtime/owner before item reconstruction; route generated use to new host with actual key/count/body/access guards; stage P2 observation/legacy mirror in same transaction; serialize new owner and restore in order; mount notebook. Retain P2 `stageMixtureAction` as the core stage engine. Use `writeGuardedSave(lifeSaveStorage,key,text)` through existing guarded adapter for new commits rather than a new raw writer. |
| Integrator: `src/main.js:956-961,1250-1271,7256,7264-7284,7331` | The new ledger's single-clock hooks and exclusion from legacy decrement per EXPOSURE. Include new owner in joined durable plan, not a render-driven timer. Preserve P2/ordinary timers. Audit other time writers first; expand only affected seams with explicit report. |
| Integrator: `src/save_files.js:2,45-47,168-201` | Normalize optional crafting envelope after original P2 checks; validate registry/ledger/knowledge/journal closure before actual loader or import storage mutation. Leave UTF8 encoder/import preflight and save budget ownership intact. |

`src/mixture_state.js`, `src/mixture_native.js` and `src/seeded_streams.js` need no semantic edits. Keep legacy exports/validators for compatibility. New host wraps P2 plans to patch new owners, its single effect and observations atomically; do not call old commit and then write knowledge in a second save. Existing native entry routes get expected revision checks in the wrapper. If a rebase requires shared helper changes, root must document the necessity and preserve revision-1 vectors. All listed files are future ownership proposals, not current reservations.

## T1-T5: future source verification bundles

Each row is a test bundle, not a fabricated test count. No new tests run in CR6.

| Code | Files / decisive cases |
|---|---|
| T1 identity | `tests/product_registry.test.js`, existing `mixture_state`, `mixture_native`, `mixture_adapters` tests: old key byte equality, ordinary fallback, reserved-field rejection, equivalent response stack/different ratio separation, decoder across hero/chest/vendor/storage/reservation, consumed definition closure, exact conserved fractions, preview/load stream purity. |
| T2 response | `tests/exposure_state.test.js`, `tests/crafting_clock.test.js`: T-E1-E8, dose count/whole-vial law, QA/QB/NA accounting, actual character stat projection and withdrawal at expiry, all relevant native clock branches. |
| T3 evidence | `tests/crafting_knowledge.test.js`, `tests/crafting_journal.test.js`: T-K1-K8, legacy method gate, paid samples/fee/refund, measurement interval math, conflict roots, observer isolation and truthful partial discovery. |
| T4 persistence/transactions | `tests/crafting_native.test.js`, extensions to `tests/save_files.test.js`: successful write-before-publish; quota/validation/stale-tab/reused-plan failure, post-write render failure recovery, migration twice, unsupported family/law/dangling import before overwrite, active source already consumed and pending assay. |
| T5 UI/regression | `tests/crafting_journal_ui.test.js`, existing `tests/mixture_ui.test.js`, relevant native craft/storage/trade and import suites: safe metadata, exact handle selection, focus/poll stability, observed dose and P2 repeat/cancel unchanged. Then required `npm test` and own `npm run build` once implementation is ready. Broaden only for new failures or edits. |

## B1-B5: browser acceptance, future and OPEN

Builder serves its **own rebuilt** candidate on `http://127.0.0.1:21700`, using `python3 -m http.server 21700 --bind 127.0.0.1` from its authorized checkout. Root checks listener/owner first. Fresh disposable Chrome profiles using COMMON's available Playwright path; no user saves. Hero `TEST FIXTURE PROCGEN CR6 ...`. Bind source/commit plus dirty relevant input hashes, rebuilt bundle/map hashes and fetched bytes; a prebuilt bundle is insufficient. Label every witness natural, seeded-native or source.

| Gate | Journey and pass condition / future evidence |
|---|---|
| B1 old P2 baseline | At 1366x768, normal paid buy/mix/unknown-use/observe/learn/repeat/cancel works; same old product/key/dose/latest-replace and reservation refund as source fixture. Record before/after JSON projection plus screenshot. |
| B2 response | Natural paid SP witness above, chosen count and effect values visible; specific antidote leaves QB/P2 benefit/prior health deficit. Actual inventory counts decrease, ledger accounting closes, expiry removes new penalty, another new dose acts. Screenshot + bounded state comparison; native values, not clicks alone. |
| B3 notebook | Natural paid pair, pending assay fee/sample escrow, completion, safe partial measured result, preserved conflicting claim/inconclusive fixture category; use resulting choice for actual P2 drink/method/repeat. Shortage/cancel and failed-write no-op controls through supported disposable test adapter. |
| B4 desktop/projection | Repeat changed behavior on 1600x1000; controls, known inputs/results/queue and independent panes make use of screen. Check keyboard/focus/Back/inventory. Inspect visible text, DOM/ARIA, sort/search/counts/notes copy for hidden payload. Synthetic secret marker remains absent except ID/status on permitted view. No comic styling or mobile gate required. |
| B5 persistence | For pending assay, active dose after source consumption, treated state and P2 pending repeat: UI Save -> reload -> Export actual file -> literal file selection through Import on second fresh origin on port21700 after disposing first profile. Compare normalized state below and next named-stream draw from detached snapshots; do not consume live draws to check them. Invalid Import leaves existing target save untouched. |

Persistence comparison fields: mixture seed/profiles/products/keys/knowledge/methods/job/sequence; crafting family products; all holder counts/reservations; fee/purse; bodyRef, contributions/totals/legacy native-duration mirror and projected active payloads; observer evidence/contradictions/handles; pending assay due/terms/receipt status; streams root/cells/next decision; ordinary food settings/current effect state. Allow only documented elapsed played minutes between captures; freeze via supported pause for exact equality. Preserve unknown historic quantities as unknown. Full save round-trip is distinct from observer-filtered journal copy/export.

## O1-O5: old-save fixture matrix

All synthetic disposable saves made through real retained code or checked-in compatible fixtures, never personal exports.

| Case | Import/reload expected behavior |
|---|---|
| O1 | Pre-P2 save and no crafting state: absent owners remain absent, native ordinary inventory/effects/food and next legacy stream decision unchanged. Opening notebook opts into explicit migration only. |
| O2 | P2 products in hero plus chest/vendor/player_storage, observed and unobserved variants: same exact keys/doses/counts and safe display, no extra observations or fallback. All holders load. |
| O3 | Consumed P2 product with partially elapsed exposure and metadata not equal to calendar subtraction: exact remaining native duration/payload preserved, mirror idempotent, no dose replay and no fabricated past count. |
| O4 | P2 learned method and held repeat with pending due; or unobserved products with no effect: held/due/remaining/cancel and current P2 settlement timing unchanged. No automatic new assay/response enrollment. |
| O5 | Unknown future schema/family, canonical-key forgery, orphan exposure/evidence, changed dose or negative/fractional vial count: reject before target save overwrite/live mutation; prior compatible save still reloads/exports. New valid owner also survives a second normalization unchanged. |

Native Save/reload and literal Import must cover at least O1-O4, with O5 rejection observed in disposable browser and source tests. Technical acceptance leaves source fidelity of later canon adapters and Weibao's balance/fiction/taste judgment separate. These two slices do not certify food, every poison delivery, weapons/runes, NPC production, comic continuity, permanent gains or away-progress behavior.
