# Retort source review

**All three original findings are resolved in source, and the finite review of the new shared retort joins found no additional source defect.** The combined build is `cc3798910c48`; the final shared-join receipt below qualifies the reviewed source/build snapshot and supersedes earlier open P1/P2 statuses. All changed gameplay remains implemented-unverified, with no gameplay or save/reload acceptance claim.

Initial reviewer `/root/retort_review`, parent `/root`, 2026-10-07. That read-only phase wrote only this file. It read AGENTS/PROJECT, the native-usage checkpoint/scout/interfaces, the four retort leaves, native SOURCE_BINDING/NATIVE_PRODUCTION_TRACE and the necessary simulation, work-plan, reference, native inventory, trader, body and publication readers. No private save, recovered-code execution, gameplay/browser/unit/failure/regression suite, code edit, shared/canonical write, build or publication occurred in that phase. The separately authorized two-leaf repair and its release are recorded below.

## Original reviewed findings

These line references and source descriptions identify the original reviewed snapshot pinned below. The two P2 corrections are recorded in the final leaf-repair receipt; the P1 remains outside this leaf writer's scope.

| Priority | Exact source | Effect and required correction |
| --- | --- | --- |
| P1 | [Native trader refresh](../../../../../src/components/trader_component.js:62), especially line 65; [saleable retort specifications](../../../../../src/factorio_retort_content.js:29); [global stock equations](../../../../../src/factorio_retort_native.js:169) | The adapter explicitly permits stored/sold trays and ordinary traded loose residue, and its reader counts trader stock. Normal trader refresh empties the entire actual shop inventory before filling its ordinary template. A previously sold empty/filled receiver or loose residue therefore disappears without a retort completion/disposal receipt. The next save preflight rejects the conserved-pair or coproduct equation. Preserve the exact five retort keys/counts in that same actual trader inventory across ordinary stock refresh, without recreating native tray pairs, changing retort counters or adding a second stock owner. The alternative would require an explicit narrower non-saleable policy and matching UI/reader terms; silent destruction is incompatible with the delivered contract. |
| P2 | [Current body support](../../../../../src/factorio_retort_facts.js:14); [inherited hand predicate](../../../../../src/original_frontier_facts.js:14); [actual clay possession](../../../../../src/backlog_expansion_body.js:343) | `localSupported` binds a native inventory, life flag and scaffold vitals, but does not qualify the actual current body's identity/owner/controller/function or native-alive frame. Existing reference support only supplies two hands and local native stock/vitals. The already implemented stationary, externally owned clay possession has two hands and leaves the parked native stock/vitals available, so the retort quote can appear eligible for immediate installation/collection on the wrong body. The final [Backlog publication guard](../../../../../src/main.js:521) already rejects that ordinary publication, so this is false eligibility and incomplete completion-support qualification, not a demonstrated spend bypass. Compose the existing actual-body/native-action gate into retort support, with current native-alive evidence and the declared usable body/functions. Keep the original native body and any already authorized physical-function policy distinct from the controlled clay body; do not infer permission from the bag binding or impose a new universal species rule. |
| P2 | [Bench presence](../../../../../src/factorio_retort_facts.js:13), [rack rights](../../../../../src/factorio_retort_facts.js:18), [receipt reader](../../../../../src/factorio_retort_host.js:92); [actual bench creation](../../../../../src/feature_expansion_objects.js:114) | The promised retained fitting-bench rights are currently represented only by an opened workshop receipt and truthy bench existence. Eda's actual bench is created with owner `feature_objects.miri` and capacity 1, but the retort reader/facts accept a bench whose owner is missing or has changed to another actor. Pin the retained bench's declared owner/capacity in both current eligibility and the enrolled-state reader. Keep the commissioned rack's player ownership separate. This needs no new Eda attendance requirement after installation: the receipt supplies the granted permission, while the site must still be the actual permitted bench. |

The first finding is an ordinary-gameplay path from the existing shop refresh code. The latter two are source contract/reader consistency findings. No execution fixture was used to inflate their evidence.

## Confirmed static contracts

- Paid installation consumes two actual logs, two player coins and one stamina; the fee reaches Eda's existing `coins` purse. It creates one player-owned rack and exactly one native empty receiver per family. The rack declares `provision:false`; current `simulation.js:54` skips it during generic enrollment, and the site reader admits that optional boolean. Installation still needs its receipt wrapper at the root dispatcher.
- Batch costs reserve only one sap, one log fuel, one empty receiver per family and one stamina. The common executor freezes the exact revision/costs/effects/participants/rack reservation and completion support. Completion support excludes input/empty-tray admission facts, since these objects are correctly absent from the bag while held. Three supported played minutes settle into two separate filled variants once; cancellation/unsupported settlement refunds unchanged costs and creates no processed output. Collection returns the existing empty receiver with `reservationReturn:true`, while resin/residue are genuine material acquisitions. Resin uses the existing two-stave kit consumer.
- The final reader counts plain canonical physical keys across actual native bags, chest, shops, legacy aliases and real simulation-owned bags, plus negative accepted-job costs. Alias projections must agree and count once; future positive effects contribute no present stock. Decorated keys, equipment and borrowed retort custody reject. Conservation includes filled-residue disposal and loose-residue disposal reservations correctly. Shared native owner validity still depends on the existing real-loader/registered-owner preflight; this reader is not proof that an arbitrary saved inventory owner is loadable.
- The optional `referenceGameplay.retort` receipt is absent-inert. Its reader pins once installation, observed causes/text, allowed counters and exact held jobs/cursors; absent receipt rejects new physical stock, jobs, rack or activation. Outer expansion 9–11/reference 1 and other frozen jobs retain their meanings. The ordinary three-command cursor neither uses kit `stockPolicy` nor prepays batch two; current `advanceOne` pauses on failed next-batch preview. Custom projected types are `factorio_retort`, `factorio_retort_cancel`, `factorio_retort_plan_start` and `factorio_retort_plan_control`, with existing `action`/`cursorId` controls and a separate accepted-job cancellation.
- Native source qualification supports separate input eligibility/spend, retained progress and completed-output admission. **The original merged method locators are historical and superseded:** the fresh native qualification identifies `CraftingMachine::canGiveProducts` at `0x100741a98` as a wrapper calling the actual `ProductionHelper::canGiveProducts` helper at `0x100741abc`. The native writer owns fresh body/helper review and SOURCE_BINDING/NATIVE_PRODUCTION_TRACE repair. This retort review does not independently requalify those recovered bodies. Both empty trays reserved before batch acceptance, discrete unburned-fuel refund, three-minute timing, prices and resin/residue fiction remain explicitly ORIGINAL YAIR choices. Neither source qualification nor this review proves whole Factorio recovery, identical native ordering or progressive burner behavior.

## Static checks and remaining acceptance

Passed: Node syntax on all four retort leaves; pure content/facts/host/native imports; pure simulation/work-plan registry construction and retained-definition validation. Result: six commands, one optional site, one ordinary finite plan, five item specifications. No native item constructor, accepted command, timer, in-memory save/corruption fixture or gameplay path ran.

Root still owns the five shared joins in [RETORT_INTERFACE](RETORT_INTERFACE.md#required-root-joins): definitions/plan/native registration, fresh common facts and optional/final readers, strict dispatcher/bypass protection, current UI projection, and matching rebuild/source evidence. At the reviewed snapshot only the optional-site core join was already visible. Outstanding planned integration is not misreported here as an extra leaf defect.

Keep these later acceptance families open:

1. Actual funded install, batch completion, independent resin/residue clearing, occupied-receiver pause without next input/fuel spend, explicit cursor resume and existing resin-to-kit use.
2. Cancellation/unsupported body/site settlement, exact input/effort/tray returns, collection/disposal counters and correct current body/bench eligibility.
3. Bag/chest/shop transfer and sold-stock recovery across ordinary trader refresh, without lost or duplicated receivers/coproducts.
4. Old absent saves, enrolled/frozen jobs/cursors, export/import/reload and failed-persistence behavior through the one durable publisher.
5. Actual rebuilt native constructors/UI/keyboard journey and director review of fiction, rates, costs and game feel.

## Reviewed fingerprints and release

| Source | SHA-256 |
| --- | --- |
| `src/factorio_retort_content.js` | `e617c1ac206d3d75e48ee80b027c0a878d7cc745f26797877ed1a838b89aec3f` |
| `src/factorio_retort_facts.js` | `ade33a8c32878de59fd9b63584181190782397b438f43f57e2c89f450ac6ba6b` |
| `src/factorio_retort_host.js` | `76a0ab2d0075077a70568b0e890abcfb861bdf860de5e74bbbd56137d9787dbf` |
| `src/factorio_retort_native.js` | `906d15465db4a40248afd869ad9189d43d9b6bb01ec8766902e3ad44c41ac4e0` |
| `src/components/trader_component.js` | `5eadf84bf69fdfbd953a2eeb1adc0f40943e2cc218d6f43344ff909ba22a1385` |

Root received the actionable findings during review. These pins qualify only this reviewed snapshot; later root fixes/build must supersede them with its own evidence. This reviewer releases the assigned review file and holds no source/shared write scope or running process.

## Leaf-repair receipt and release, 2026-10-07

Parent `/root` reassigned exclusive ownership of `src/factorio_retort_facts.js`, `src/factorio_retort_host.js` and this review for the two concrete P2 fixes. The live PROJECT resume, shared context-refresh protocol, native-usage checkpoint and current source were read before editing. Other files, shared/canonical integration and trader refresh remained outside the write scope.

At [factorio_retort_facts.js:23](../../../../../src/factorio_retort_facts.js:23), `factorioRetort.localSupported` now composes the existing `statusCareSupportedBody(state, context)` policy already used by local lore work. That policy requires current native-alive evidence and the actual owned/controlled, mobile human body with at least two hands, choosing a concrete saved body before the native frame fallback. This uses the project's existing supported-work policy; it adds no universal race rule, copied Factorio rate or persistent body owner. Existing live health, usable-hand, native inventory, realm and local support checks remain.

The new pure export [factorioRetortBenchSupported(state)](../../../../../src/factorio_retort_facts.js:9) qualifies Eda's actual fitting-bench ownership and the capacity declared by the existing `featureObjectDefinitions`. Facts use it at line 21 and the enrolled receipt reader uses the same predicate at [factorio_retort_host.js:92](../../../../../src/factorio_retort_host.js:92). Rack player ownership remains separate, and operation does not acquire a new Eda-presence requirement.

New leaf imports are `featureObjectDefinitions` from `feature_expansion_objects.js` and `statusCareSupportedBody` from `status_care_facts.js`. Host imports the shared pure bench predicate from the facts leaf. Root must preserve `nativeAlive` and `nativeBody` in both current manual/UI contexts and common job-boundary contexts when calling retort facts. Current `campaignContext` and `simulationNativeContexts` already provide those native frames; avoid dropping them during the retort joins. No new native-envelope, schema, accepted-job/context field, custody, publisher, timer, item registration or command/plan definition is required by these fixes.

Passed again after repair: Node syntax for both changed leaves; pure content/facts/host/native imports; pure registry construction and retained-definition validation. Result remains six commands, one optional site, one ordinary plan and five item specifications, with the new bench predicate exported as a function. No body/native constructor, actual predicate fixture, command, timer, save/corruption fixture, browser, unit, failure or regression check ran. Gameplay/save/import/rollback and director acceptance stay deferred. The P1 shop refresh remains the shared home/social integrator's separate task.

| Released changed leaf | SHA-256 |
| --- | --- |
| `src/factorio_retort_facts.js` | `e47c5e936462a70d66b1535faded38955c59e1369c1035eb9eac2dd332f04e2a` |
| `src/factorio_retort_host.js` | `3b22946a10fc4f021721283ec3cee0ce05c44b663c61b9879b335ade7f4c4e99` |

These two hashes supersede their original review pins. Both changed leaves and this review are released to root after this receipt; no child, tool session, unsaved delta or shared write scope remains with `/root/retort_review`.

## Finite shared-join review and release, 2026-10-07

Parent `/root` assigned one read-only review of the NEW retort shared joins after sole home/social integrator `01a114a8-b32c-78b1-9d2f-9b140bb8300c` acquired the four released leaves. The live PROJECT resume, [retort acquisition](../../../home-social-base-2026-10-07/RETORT_ACQUISITION.json), [source-check receipt](../../../home-social-base-2026-10-07/SOURCE_CHECKS.json), [registry readback](../../../home-social-base-2026-10-07/REGISTRY_READBACK.json), [build receipt](../../../home-social-base-2026-10-07/BUILD.json) and relevant live joins were inspected. The only write in this phase is this review. Previous leaf syntax/import/registry checks were not repeated; no code/shared/canonical write or gameplay/browser/save/unit/failure/regression suite occurred.

**No additional actionable retort source defect was found in this finite pass.** The original P1 is resolved by actual merchant preservation; the two P2 corrected leaf hashes remain acquired and matched.

| Shared contract | Current source-qualified join |
| --- | --- |
| One registry, plan and native item registration | [simulation_content.js:108](../../../../../src/simulation_content.js:108) appends the retort definitions once. [expedition_content.js:162](../../../../../src/expedition_content.js:162) includes its three ordinary batch steps in the existing work-plan registry. [data/expedition_items.js:37](../../../../../src/data/expedition_items.js:37) registers all five plain OtherItems once. The current generic enrollment continues to skip the `provision:false` rack; no render/enrollment grants a pair. |
| Fresh manual and scheduled support | [main.js:462](../../../../../src/main.js:462) supplies current `nativeBody` and `nativeAlive` in native simulation contexts. `expeditionContext` and [campaignContext:1021](../../../../../src/main.js:1021) preserve native body/alive evidence plus keyed vitals/equipment, and [featureWaveContext:900](../../../../../src/main.js:900) composes retort context without dropping them. Current common boundary context wrappers preserve those fields; completion rebuilds support from live contexts and staged stock/vitals. [simulation_effects.js:63](../../../../../src/simulation_effects.js:63) recomputes retort facts for common previews, completion and the existing work-plan cursor. No extra timer or cached receiver boolean appears. |
| Optional and full-envelope readers | [reference_gameplay_state.js:46](../../../../../src/reference_gameplay_state.js:46) calls the retort state reader even before absent-reference return and admits only the optional `retort` field in the existing reference record. [save_files.js:46](../../../../../src/save_files.js:46) invokes full native conservation after general expansion validation. The existing staged envelope publisher still writes all ownership domains before that final reader and before storage/publication. Old absence stays inert; held negative job costs and actual bag/store/shop/simulation stock remain the physical owners. |
| Typed controls and bypass admission | [main.js:922](../../../../../src/main.js:922) routes command, job cancellation, plan start and plan control to their four retort wrappers with current sequence/context, then uses the existing `persistExpansion` path. [main.js:848](../../../../../src/main.js:848) explicitly rejects generic command dispatch for this group. Generic panels exclude retort command/work rows. Generic program admission requires `automatable` and positive duration, which retort definitions do not declare together, and the optional reader independently rejects retort programs. Installation therefore cannot publish through the generic path without its receipt wrapper. |
| Existing panel and Notebook | [feature_expansion_wave_host.js:81](../../../../../src/feature_expansion_wave_host.js:81) appends the retort projection to the mounted existing feature panel. Its action buttons retain typed payloads/current sequence; [adventure_notebook.js:37](../../../../../src/adventure_notebook.js:37) routes actual retort jobs to the same panel in Here. Current rendering has no stock, clock, receipt or publisher mutation. |
| Actual merchant preservation | [trader_component.js:13](../../../../../src/components/trader_component.js:13) derives conserved keys from all five retort specs alongside the separately owned Proto23 specs. Lines 71–82 retain the exact native item entries/counts in the same trader inventory before ordinary refresh, reject malformed aliases/counts, refill ordinary template stock and reattach the retained objects. No retort pair is regenerated and no second inventory is created. The five retort IDs remain absent from ordinary merchant templates. This resolves the original P1 source defect. |

The combined integrator's [source-check receipt](../../../home-social-base-2026-10-07/SOURCE_CHECKS.json) reports syntax and static repair checks passed; [registry readback](../../../home-social-base-2026-10-07/REGISTRY_READBACK.json) lists the actual `factorio_retort.three_batches` plan among the seven registered plans. Those are the integrator's permitted checks, not new executed gameplay evidence from this reviewer.

This pass independently compared file bytes: all 17 reviewed files below match their bundled source-map contents. All 16 of those files listed by SOURCE_CHECKS also match its input hashes. `simulation_contracts.js` is unlisted in that receipt's input-hash table, but its live hash and bundled content match the reviewed build. Bundle and map hashes independently match BUILD.json:

| Artifact | Current qualified identity |
| --- | --- |
| Bundle | `cc3798910c48e61f3908cdf2225090d136a3efddd62327cad196c34338c2ed30` |
| Map | `f992821952f2e4f2b21cc82114632fcfe818aa65c5d1f5763745f38552e611d7` |
| Build receipt scope | `cc3798910c48`, 353 matching local bundled sources, 37 vendor entries, no reported source-map drift |
| Receipt's served preview | `http://127.0.0.1:18196/`; BUILD.json records matching served index/bundle bytes. This reviewer did not open/play the browser or repeat serving checks. |

| Reviewed live source | SHA-256 |
| --- | --- |
| `src/simulation_content.js` | `94bad60508d05370bb7fdff7a809ffa271c15749d509b4e24fa21236aab41da4` |
| `src/expedition_content.js` | `556a01896eeda19266b5ed2dadcdfb4b7df5e0e0bb8b89beb7b22ed1bbb8ce9c` |
| `src/data/expedition_items.js` | `ed222db3624744db43835ca4d16586a768b0e6d885d465d9103733bf83fa849a` |
| `src/simulation_effects.js` | `08c00949db06dd1327cee3740aa22176f65b625180b756d8d167217ae4ad67b8` |
| `src/reference_gameplay_state.js` | `9499390df80b452350ccfdd65cc125da92457bd7ed826f79738fd04bbc22b2a9` |
| `src/save_files.js` | `95013edd0e40deb44659f5d51548301210be18b4aba11b9bff00bcbd2e424567` |
| `src/main.js` | `d158aeaa4ce4d6a66e95d3aeae5089eb0b48b5758985f095126442da44fe6c2e` |
| `src/simulation_ui.js` | `e0103896086f210a34442e0f7633061bc507a7e2f378d0e5212ee698dd25ab3d` |
| `src/feature_expansion_wave_host.js` | `693ddfa9331df9d28e8611b0e7ddbaa3398128cbbd91b88120587a7c2e71c6b6` |
| `src/adventure_notebook.js` | `eb4a290a530f462ddf1ae57509b0edadf9a6da2b7f07159a07793dd306b6a225` |
| `src/components/trader_component.js` | `613731e3c6ecb0dd40b600ba63b1981711bb2faa295620779b37f9ed0af6f056` |
| `src/simulation.js` | `bcdd2e8ef7efba11b04c3bd164d8eccda1038566021dcbbed4dba93ee8d4d329` |
| `src/simulation_contracts.js` | `0b048cb891b0e30abeb7f97125d8fe62ca9abe03c7fc7697e0078ae4a72501de` |
| `src/factorio_retort_content.js` | `e617c1ac206d3d75e48ee80b027c0a878d7cc745f26797877ed1a838b89aec3f` |
| `src/factorio_retort_facts.js` | `e47c5e936462a70d66b1535faded38955c59e1369c1035eb9eac2dd332f04e2a` |
| `src/factorio_retort_host.js` | `3b22946a10fc4f021721283ec3cee0ce05c44b663c61b9879b335ade7f4c4e99` |
| `src/factorio_retort_native.js` | `906d15465db4a40248afd869ad9189d43d9b6bb01ec8766902e3ad44c41ac4e0` |

The native writer's fresh wrapper/helper locator correction supersedes the earlier merged native attribution, as noted above. Original retort pre-batch custody and discrete refundable-fuel choices are unchanged. This shared-join review neither closes the whole two-architecture recovery goal nor adds native semantic coverage.

The five later acceptance families already listed remain open: actual funded journey/receiver stalls, cancellation/body/site settlement, stored/sold recovery including normal merchant refresh, save/import/failed publication and director/UI acceptance. Source/build correspondence does not prove those behaviors. Root owns final combined delivery/canonical receipts. This reviewer releases this finite read-only assignment and the review file; no child, process, pending operation or code/shared write reservation remains.
