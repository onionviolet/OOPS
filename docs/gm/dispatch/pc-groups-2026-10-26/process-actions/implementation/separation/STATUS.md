# PC19–PC20 separation lane

State: **interface-ready, released-for-integration; implemented, below AD43 floor**. Owner transfer: integration may now adapt/repair the released source/test paths. Separation has stopped writes to them. Primary checkout; no commits or publication. Agent-verified pure behavior, not human-reviewed.

Reserved exact paths (no incumbent files existed at inspection):
- `src/craft_process_separation.js`
- `tests/craft_process_separation.test.js`
- this `STATUS.md`

No shared adapter/UI/save/clock/build ownership. Integration owns custody and commits returned pure state once. Agitation/cues reservations appeared during preflight and do not overlap. Thermal reservation now inspected, no overlap. Reconcile CONTRACT before release.

## Vessel contract for thermal and integration (proposed interface, available now)

One apparatus record: `{id, material, capacity, closure:'open'|'sealed'|'reflux', condenserPermille, meshSize, thermalMass, heatTransfer, films:[]}`. Volume/capacity are local integer volume units; thermalMass/heatTransfer are authored integer parameters to thermal (not SI claims). `films` contains `{id,phase,amount}` constituent rows, never body residue. Batch `{volume, constituents:[{id,phase,amount}]}` phases: dissolved/suspended/settled/surface/vapor. All quantities safe integers >=0. Headspace is `capacity - batch.volume`, derived rather than separately saved. Thermal reads this same record and supplies elapsed exposure to the environment adapter; it does not own a second vessel. G5 lot identity/provenance and inventory quantities remain upstream; these rows are committed constituent quantities, not inventory definitions. G6 owns environmental exposure and clock intervals; this module accepts a settled volume loss and air contact budget, creates no weather or clock.

Final apparatus also preserves `remainders:{key:0..999}` for condenser quantization. Save this with shared apparatus. Thermal's optional `surfaceArea`/`containment` fields can pass through the same record; separation does not add another reader or state owner for those thermal capabilities. Thermal's live `quoteThermalBatch` reads capacity/closure/thermalMass/heatTransfer consistently with this schema.

## Contract reconciliation and required integration joins

Read `../CONTRACT.md` revision 1 after publication. Compatible with its fresh-state/cost/custody boundary. No shared files changed. Functions take the frozen process law and return plans; integration must revalidate live stock/means and commit once through the current native transaction. Stage identity/revision and once-only settlement belong to integration, not a duplicate token ledger here.

1. **I1, custody reader:** import `defineSeparationLaw`, `quoteSeparation`, `separateProcessBatch`, `contactProcessVessel`, `transferProcessBatch`, `cleanProcessVessel`, `exposeProcessVessel` from `src/craft_process_separation.js`. Persist the ORIGINAL definition/revision in process envelope `law`, batch packets under `intermediates`, shared apparatus films/remainders beyond collection. Do not restore an earlier apparatus snapshot when beginning the next batch.
2. **I2, destinations/use:** ordinary separation owns `product`, `residue`, `vaporCapture`, `exit`, `waste`, `doses`, returned `vessel`, costs. **Distill puts usable captured condensate in `product`; `vaporCapture` is empty. Divide puts matter in `doses`; pooled `product` is empty.** Do not sum or mint both a packet and a convenience alias. Residue remains recoverable until explicitly disposed. Existing oral/product readers consume summed constituent IDs from the selected packet, not the pre-separation pooled composition. Filter cake is consumed-input matter, not retained catalysts. Harm remains active through the existing toxin reader. All rows, including matrix/traces, need explicit authored phase admission; absence from this lane law refuses instead of silently deleting them.
3. **I3, means/costs and UI:** debit seconds/work/fuel from separation and explicit contact stages; cleaning debits water/work. Costs are original authored units scaled by selected volume or film amount. Quotes do not debit. Revalidate compatible destination and live capacity before committing a transfer. Offer capacity/mesh/condenser/material upgrades through actual apparatus means. Project public costs/cues/refusals through cues/knowledge owners; raw constituent IDs/material conversion truth are internal. Cues rescue split delegates `divide` and receives doses; no lost-fraction recreation. Desktop 1920×1080/current matrix, mobile deferred.
4. **I4, G6 clock/exposure:** `exposeProcessVessel` accepts **settled integer** `evaporateVolume` or received `airUnits`, not elapsed seconds, temperature or a new weather sample. G6/thermal adapter owns fractional exposure accumulation and canonical event boundaries. Evaporation and air in the same nonsealed call refuse, because changing fill changes headspace conditions. Settle them as explicitly ordered exposures at their physical boundaries, preserving the same order under long/short clock chunks; do not pick an order per render tick. Condenser integer remainders persist. Sealed default suppresses evaporation/air; this selected law does not implement pressure/boiling equilibrium. Reflux captures outside the batch, not automatic return to it. Air conversion reads received contact and positive headspace; no conversion at zero headspace. G6 exposure owner is `../../../weather-environment/implementation/` relative to this directory. This required clock adapter is not an optional future appendix.
5. **I5, persistence/replay:** preserve current law revision, films, phase amounts, residues, doses and remainders across Save/reload/Export/literal Import. Interrupted stage inputs and outputs settle once; a quote never calls contact as an implicit side effect. Replay/helper routes use these same functions and current means. Integration owns old-state compatibility under existing deferral, browser proof and full floor checks. G5 owns lots/provenance under material-foundations; G2 owns input allocation under ingredient-substitution. No new lot or stock owner here.

## Complete selected detail coverage

Each row is implemented pure behavior with a real test consumer; **all rows still depend on integration I1–I5 for gameplay delivery**, rather than being closed by a pilot. Selected details remain in that implementation horizon.

| Code/detail | Producer/state → reader | Observable focused check / dependency |
|---|---|---|
| S19a strain | phase rows + authored particle size + vessel mesh → `take` | Test 1 filters suspended harm/grit, keeps dissolved harm and usable restorative matter; test 3 changes capture with mesh upgrade |
| S19b decant | settled/suspended/dissolved rows → partial `take` | Test 2 retains bottom sediment, transfers dissolved fraction; actual integer quantities |
| S19c skim | surface phase → `take` | Test 2 withdraws surface ash, leaves dissolved constituents |
| S19d distill | selected volatility per volume + reflux condenser → `exposeProcessVessel` | Test 6 pays fuel, usable condensate differs with upgraded condenser; nonvolatile restorative/harm stays residue |
| S19e divide | batch volume + dose count + retained phase → dose packets | Test 4 gives exact 3/2/2 volumes, conserved 7/5/5 active amounts and sediment in final dose; no draw |
| S19f exits/remainders | product/residue/capture/escape/waste/doses/apparatus films → custody outputs | Tests 1/5/6/7/11/12/13 conserve mass; 527-size sweep covers divide + films; cleaning waste includes actual matter and paid water volume |
| S19g particles vs dissolved | phase and particle-size law → filter reader | Tests 1/3 prove dissolved harm survives a filter that removes its particulate counterpart |
| S19h uneven doses | unremixed settled layer + deterministic volume split → dose composition | Test 4; agitation owns homogeneity/settling and integration must project that actual state into phase rows before dividing |
| S19i partial transfer | source/destination + distinct apparatus IDs → `transferProcessBatch` | Test 13 conserves both vessels, retains sediment, refuses overflow/self-transfer/incompatible receiver without mutation |
| S20a material compatibility | constituent materialEffects → admission refusal/contact conversion | Test 10 refuses unsupported contact or converts existing restorative amount into harmful amount; no invented wall material |
| S20b closure/evaporation | closure + received evaporation budget → escape | Test 7 suppresses sealed loss, open vessel exits vapor; test 14 pouring does not collect trapped vapor |
| S20c condensation | condenserPermille + quantization remainders → captured packet | Tests 6/8 conserve integer capture and agree across 11 units versus 1+2+1+3+4; JSON roundtrip retains next result |
| S20d air/headspace | actual fill/capacity + G6 airUnits + authored air reaction → conversion | Test 9 converts selected restorative amount to ash, suppresses at full/closed conditions, agrees across split received-air budgets; combined changing exposure refuses with named boundary |
| S20e retained films | outgoing product → shared apparatus films → next explicit contact | Test 11 transfers actual trace seed and harmful matter between batches; no personal medicine state |
| S20f useful seeding | film seed + remaining dissolved substrate → conserved stoichiometric contact reaction | Test 11 consumes 2 seed + 4 restorative to produce 6 active amount; no catalytic free quantity |
| S20g harm/trace reagent | retained harmful/seed quantities → next batch constituent consumer | Test 11 harmful carryover remains measurable; G5 definitions and I2 useful active/toxin consumer pending |
| S20h cleaning | films + paid budget → waste + cleared apparatus | Test 12 insufficient water/work refuses, successful clean removes exactly 5 matter with 10 water/15 work; next batch has no carryover |
| S20i equipment capability | actual capacity/material/mesh/condenser/thermal parameters → named readers | Tests 3/6/10/15 exercise physical changes, thermal lane reads inertia/transfer; I3 must expose actual earned apparatus upgrades |
| S20j body separation | apparatus-only films field → apparatus contact/clean readers | No body imports or writes; integration keeps existing medicinal residue owner distinct |
| S20k costs/scale | selected volume and film mass → quote/contact/clean costs | Tests 6/11/12/14/15 pay fuel/work/water/time, larger load costs more, dry residue contact still costs work |

## More-to-consider, SF1–SF8 disposition

- **ACT NOW, done:** phase/mass validation, safe integer arithmetic with BigInt multiply intermediates, deterministic remainder allocation, alias-free packet custody, destination admission, quote purity, film conservation, paid cleaning, trapped vapor not poured, and explicit combined-exposure refusal. Named tests above exercise each. No RNG, stock, knowledge or clock calls exist.
- **ACCOUNT FOR NOW, integration-owned:** lifecycle once-only commit/cancel, actual apparatus continuity, homogeneity admission, truth-to-known projection, received exposure order, current revision persistence and real useful consumers. I1–I5 are necessary contract joins. This covers SF2–SF8 without shadow inventory/G5/G2/G6 systems.
- **SOURCE BOUNDARY, selected horizon retained:** these numerical rules are ORIGINAL local pilot laws (SF1). HP scene p481/LOTM process locators in `../../REPORT.md` do not source a strain/skim/distill algorithm. Source-qualified world variants require integration's selected source owner to qualify the relevant process locators before claiming them canon; no acquired book or canon assertions in this lane. Pressure equilibrium and whole-fluid simulation are outside the selected reactions, not implied by a closure field.

## Evidence and release

| Check | Result | Inputs / gaps |
|---|---|---|
| `node --test tests/craft_process_separation.test.js` | **16 passed, 0 failed**, final run | Synthetic ORIGINAL law fixtures; meaningful conservation/failure/roundtrip tests only, no native gameplay |
| `git diff --check -- src/craft_process_separation.js tests/craft_process_separation.test.js docs/gm/dispatch/pc-groups-2026-10-26/process-actions/implementation/separation/STATUS.md` | exit 0 | No tracked shared paths changed; paths new/untracked, final handoff prose subsequently appended |
| Combined build/full suite/architecture/rules/browser/native persistence | Not run by lane | Integration-owned under dispatch; no shared tracked build output touched |

Released SHA-256 inputs:

```text
19855eb1d1f46edeabfc169cd4cce69284d0e93847a139b7cab7b4632d1ec82d  src/craft_process_separation.js
97f2020f10ae287bd1ce4b44b16c6b4f82e575a7c8f52812d28446684c4e876b  tests/craft_process_separation.test.js
```

Change surface: zero core-owner files touched, zero imports/cycle edges or registration lines added. No original private saves accessed. No commits/pushes, spending, installed app or human acceptance. AD43 floor remains unmet until integration's connected useful-output/desktop/persistence journey and bundle evidence.

Fit: existing `craft_resolver.js` conserves integer `amounts` and matrix; `crafting_frontier_runtime.js` owns custody. This leaf extends constituent partition, not recipe resolution. AR3/7/8/10–14, MR1–5/11–18/29–36, AD5/6–8/15–17/32–34/36/38/41–43 apply. Runtime rules: `docs/ARCHITECTURE_RULES.md`, `.claude/rules/runtime-code.md`.

Original authored pilot only. No HP/LOTM canon claim or body medicine state. Interface proposal: phase-addressed integer constituent rows, volume in authored integer units, one apparatus record with films. Every result accounts product, residue, captured vapor, atmospheric exit and waste. Cost receipt returned for integration's transaction owner; preview is pure.

Before-code failure checks: straining suspended harm does not remove dissolved harm; partial transfer and integer remainders cannot duplicate; incompatible vessels refuse without mutation; shared films carry actual mass and cleaning consumes budget. Focused test only; integration owns combined build/rules/architecture/full suite and browser/persistence proof.

MAW stages 0/1/4 now; 5–7 integration. No changed live command or save validator in this lane; integration must snapshot and extend its current validators. Existing custody not edited.
