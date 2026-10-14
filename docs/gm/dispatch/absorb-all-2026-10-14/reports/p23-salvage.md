# P08 salvage lane, 2026-10-14

Status: module implemented; native gameplay **IMPLEMENTED-UNVERIFIED**. Do not final-merge this gameplay lane before P00 integration and the native gates below. Proposal, no director taste acceptance.

F1: Worktree `/Users/weiwei/code/yair-absorb-all-20261014/p23-salvage`, branch `absorb-all/p23-salvage`, clean initial HEAD `0216ccdefcfce79877378f8cb0ee41129fe11c5d`. Coordinator's assignment explicitly reserves port 18827 and authorizes independent wave-2 construction; live `runs/SESSIONS.md` lists session `01a138b8-d40e-7901-a54a-eac3818cd8f9`. No source files in main or other lanes edited. No wave-1 files taken over. p23-ui-polish report reviewed; reveal-chain and living-gear reports were not present at initial inspection. Previously adopted d49cb911/379007d7 UI features left alone.

F2: Original pinned HTML disassembly/tool/worst-condition mechanisms and R4 reader plus mod orphan-recipe notes informed an original implementation. No Proto23 code/assets copied. Native `native_equipment_transaction`, `native_storage_transaction`, `native_craft_transaction`, `artifact_workshop_content`, custody guard and E2 durability owner read; none changed. USER_VISION desktop direction governs; LIFE_SIM_NORTH_STAR is explicitly a proposal. R24 stays parked; no singleton food ages or lot claim.

## Row dispositions

| Row | Disposition | Landing / limits |
| --- | --- | --- |
| N05 | Implemented-unverified | `src/absorb_p23/salvage/salvage.js`: exact identified carried Leather vest copy, real tool precondition, native Crafting level + condition yield, exact output/XP receipt. Staged native owners, no live mutation. Native registration and played journey OPEN. |
| N06 | Implemented-unverified | Worn-first legal-copy list; explicit override; exact key consumption. Equipped, unidentified stacked, borrowed-instance and borrowed-canonical controls. Reclaimed survey kit consumes one selected vest + one real log, preserves spare, returns one existing native Prepared survey kit. |
| N07 | Implemented-unverified | Portable leatherworking kit minimum quality 60, usable condition, carried/equipped ownership and custody checks shared by preview/commit. Native registration and quality roundtrip OPEN. Queue/speed systems outside this smallest recipe slice. |
| R24 | Parked | Lossless food lots across acquire/split/merge/chest/literal import and optional spoilage policy not established. Not a required salvage acceptance gate. |
| Recipe acquisition | Contract implemented, native OPEN | Successful salvage learns `p23.salvage.survey_kit`; direct craft bypass rejects. Existing locked recipes inspected all had `recipe_id` acquisition references, so no existing native orphan is claimed repaired. The new portable recipe has an explicit earned route rather than remaining a new orphan. P00 must connect this route before this requirement can pass natively. |

## Concrete P00 host request

A1: Import `{SALVAGE, salvageItemSpecifications, loadSalvage, wornSalvageChoices, quoteSalvage, stageSalvage}` from `src/absorb_p23/salvage/salvage.js`. Register the new portable tool from the specification as native `Tool`, using existing `sickle` slot only if equipped; carrying it is sufficient and does not require a new slot. Native `Tool` retains quality through inherited `createInventoryKey()` and native decoding, even though `use_quality=false`; no factory change is needed. Test template/key roundtrip at grades 59, 60, 100 and E2 copy IDs. Give the portable tool a legitimate priced Village merchant/workshop acquisition route; do not grant it on load. Keep low-grade tool reachable as a control. Existing output/material IDs need no duplicate registrations.

A2: Bind context **from live native owners**, not UI input:

```js
c = {
  state: expansionState, gameplay: readGameplay(), equipment: readNativeEquipment(actors),
  durability: equipmentDurability, saved: savedP23Salvage,
  location: currentNativeLocationName, money: character.money,
  skillLevel: character.getTotalSkillLevel('Crafting'), getItem: getItemFromKey
};
request = {recipe: SALVAGE.salvage /* or SALVAGE.craft */,
  itemKey: exactHeldCopyKey, toolKey: exactHeldToolKey,
  sequence: c.state.sequence};
quote = quoteSalvage(c, request);
plan = stageSalvage(c, {...request, token: quote.token});
```

`wornSalvageChoices(c)` returns legal `{key,condition}` rows sorted lowest condition first. Selection stays explicit in `request.itemKey`; no silent pristine fallback. Preview throws a truthful block reason. Commit re-runs the same native eligibility, held-copy, canonical/instance custody, skill/material/tool conditions and checks the exact preview token. Real E2 copy key and count 1 are mandatory. P04/P00 owns lossless identity allocation for canonical copies before exposure; never mutate an inventory item or assign IDs in a preview. At 20 condition and Crafting 10, salvage returns 2 leather; at 100 condition and Crafting 10, 4. Skill bonus is bounded to +1 yield; no cap on number of separately funded crafts.

A3: Plan outputs: `{state, gameplay, external:{money}, nativePatch:{p23_salvage,equipment_durability}, acquisitions, receipt, learnedRecipe, duration}`. It consumes exactly one selected vest; portable craft also consumes one Rough wood log. It grants native Piece of wolf leather or Prepared survey kit and native Crafting XP with parent propagation through `applyGameplayEffect`. Consumed-copy condition is removed only from staged durability; pristine spare/tool records remain. Persist with `persistExpansionPlan`, normal gameplay/native publication and acquisition logging, validating `loadSalvage(envelope.p23_salvage)` before setItem. Publish expansion/gameplay/condition/saved recipe state and count the craft only after durable success. Failed durable write must leave inventory/XP/conditions/discovery/counters unchanged. Use returned acquisitions for native discovery/new-item effects; Effects-off remains the master switch. No independent counter/event timer exists here.

A4: Recipe route: successful durable SALVAGE.salvage publishes `learnedRecipe=SALVAGE.craft` and `p23_salvage.learned=true`; show it in the native crafting/workshop surface afterward, with known-only labels. The lesson is not granted by preview, load, fixture, import replay or failed persistence. Receipts are keyed to native expansion sequence (`p23.salvage:<next sequence>`); stale/replayed requests reject and a new legal copy can settle another event. Snapshot sequence must be checked against live owner immediately before persistence. Duration is one native played minute: P00 must join paid time/calendar and ordinary scheduler effects in the atomic native transaction, revalidate changed support and rebase/requote sequence if advancing the clock changes it. No wall clock, DOM interval or duplicate scheduler. This integration is not implemented by the lane.

A5: At 1366×768, expose exact selected-copy condition/key, tool quality threshold and precise output count before Craft, plus the durable receipt afterward; do not rearrange unrelated saved layouts. Mobile deferred. Native acceptance must exercise missing/broken/grade-59 tool blocks, grade-60 success, worn-first/default and explicit override, pristine-spare/equipped/custody controls, earned discovery, repeated legal events, failed write, exact Save/reload/Export/literal-file Import and old saves. P00 owns registrations/main/display/skills/calendar/save/workspace. No host file cross-edits requested from this lane.

## Compatibility and checks

D1: Optional `p23_salvage` schema 1 is absent from old saves; `loadSalvage(undefined)` returns unlearned/empty state and changes no inventory. Unknown/malformed schema/receipts reject before mutation. Durable exact consumed/tool keys, native event sequence/time, output and XP are retained; save/import does not replay them. Existing E2 schema is preserved, only the consumed condition key is removed in the staged patch. This establishes JSON/native-envelope SOURCE proof, not a literal-file native import result.

Focused tests: 15/15 pass, zero failures (`checks/p23-salvage/focused.txt`). Build: `npm run build` passed (`build.txt`). Full `npm test`: 634 tests, 633 pass, 1 fail, zero skipped/cancelled (380333.785041 ms). Failure: untouched `tests/alloy_equipment.test.js:118`, test `equipped native brace with an open road offer keeps ticking, travelling and reloading`, fixture subprocess hit 60-second timeout. Targeted rerun passed 1/1 in 8430.578291 ms (`alloy-recheck.txt`); this is evidence of a timing-sensitive failure, not proof that the original full run passed. First serial retry passed 634/634, zero failures (84684.183292 ms), loading the earlier lane snapshot. **Final full `npm test -- --test-concurrency=1`: 636 tests, 636 pass, 0 fail, 0 skipped/cancelled (34142.400666 ms)**, including all 15 lane tests (`full-test-final.txt`). The initial failure remains recorded.

Fresh-origin desktop Playwright used isolated headless Chrome on reserved `http://127.0.0.1:18827/`, 1366×768. Base game smoke passes, zero page errors; served and local rebuilt bundle SHA256 `598e02f54fe7db4c9a35bc79c75a754a7f8dc42eccf9fab828de8fd82e97b615`. `browser.json` and `desktop-base-smoke.png` retain proof. Initial Playwright default executable was absent; switched to installed Chrome, no browser installation. Bundle source map confirms salvage module is absent: this browser smoke is expressly **not changed native gameplay proof**. Rebuilt dist outputs are not committed.

OPEN technical gate: P00 native candidate, native acquisition/tool-quality serialization, paid clock join, fresh-origin changed loop and exact Save/reload/Export/literal-file Import; original inventory/orphan-repair requirement remains unproved where no actual existing orphan was identified. R24 is not part of this gate. After these pass, Weibao's play/taste is the remaining authoritative acceptance.

Implementation commit: `d6d7462574f169639dc9a08aa8f3dcac750c02b5` (`Add exact-copy salvage and portable leatherworking contracts`), 2 task-only files, no Co-Authored-By. Check evidence commit: `58afaf185b0a06c5fafd3fa0cb9a23f6992fb24f` (`Record salvage source checks and native integration limits`). Final worktree clean. No dist committed. Reserved-port base-smoke server stopped after evidence capture. No push or merge by lane. Merge risks: no edits to crafting_recipes/native_craft_transaction, so no shared wave-1 hook conflict; P04 E2 identity and P00 item/save/discovery publication contracts must be retained. P04 report landed and was read: its opt-in `prepareEquip(...,{requireIdentity:true})` supports identity even with wear off; P00 must stage that allocator with native exact inventory/equipment publication before exposing selectable copies. No P04 file edited. UI-polish condition presentation can display these same values without copying its code.
