# Thermal lane: PC17, PC22

Status: active, pure mechanism work. Implemented work remains below AD43 floor until integration connects and plays it.

Reserved exact paths (sole writer, 2026-10-26):
- `src/craft_process_thermal.js`
- `tests/craft_process_thermal.test.js`
- this `thermal/STATUS.md` and sibling evidence files.

No edits to shared runtime, vessel ownership, clock registration, UI or shared docs. Integration owns those adapters. Seam: pure thermal/scale functions called by the existing custody owner; no imports or registrations in core owners. Rules: MR1–5/10–13/16–23/29–32, AR3/6–8/10–16, AD5/6–8/15–17/32–34/36/38/41–43. Source: ORIGINAL pilot kinetics; existing summed heat/availability law stays unchanged.

Plan: explicit admitted mass/volume and apparatus view, maker means and stock produce a read-only admission/cost quote; a revisioned first-order temperature trajectory consumes vessel inertia/transfer and finite fuel, accumulates threshold residence, extraction and degradation. Clock supplied by integration. No random draws. Stop/cool alters remaining trajectory, cannot recreate degraded constituent. Contract pending; reconcile before release.

Focused check: `node --test tests/craft_process_thermal.test.js`. Failure scenario: overcapacity or missing tools/stock refuses before any debit. Other required evidence: pulse versus hold; heating/cooling/inertia; chunk equivalence including finite fuel exhaustion; 1x/10x mass/work/fuel/yield; maker/mode parity; state roundtrip.

## Interface-ready release, 2026-10-26

State: **released-for-integration; implemented, below floor**. Sole write ownership of `src/craft_process_thermal.js` and `tests/craft_process_thermal.test.js` transfers to integration now. No shared tracked source/build files edited. No registration/import edges added. No commits, pushes, purchases, private saves or app adoption.

Reconciled against `../CONTRACT.md` revision 1 and separation's single-vessel interface. Thermal reads `capacity`, `thermalMass`, `heatTransfer`, optional `surfaceArea`, optional `containment`, and `closure` from that apparatus. It owns no vessel record. Missing area uses ORIGINAL similar-shape geometry, `capacity^(2/3)`; explicit area permits different shapes. Missing pressure/containment capability defaults to unsupported for a positive declared containment demand, rather than implying a sealed vessel is pressure-rated. Closed/pressurized kinetics remain a selected dependency, not accomplished by this field.

### Handoff API

- `quoteThermalBatch({law,vessel,load,maker,program})`: read-only `{ok,reasons,costs:{fuel,agitationWork}, rate,heatCapacity,surfaceArea,conductance,warmSeconds,durationSeconds,...}`. `load={mass,volume,specificHeat,containment?,requiredClosure?}` uses actual admitted quantities, never row count. `maker={tools,competence,workCapacity,fuelStock,heater:{fuelPerSecond,maxTemperature,maxConductance}}`. Program names actual `heaterTool`, optional `agitationTool`, required competence, agitation demand per mass, start/source/target temperature and hold seconds. All units authored ORIGINAL. A target is the warm-up planning threshold, not a thermostat: the source remains at source temperature for the paid burn window. Gentle holds select a gentle source; hot pulses select a hot source and shorter burn.
- `createThermalState(law,quote,{fuel?})`: requires eligible quote, stores thermal coefficients/anchor, permits a smaller actual committed fuel charge. Integration revalidates current means and debits once. Budgeted fuel is reserved/prepaid by custody; `fuelSpent` records burned fuel and never grants a refund. `agitationWork` is the whole-program requirement, not a second work debit on top of the agitation lane's actual actions. Integration must reserve/deliver it once.
- `advanceThermal(law,state,elapsedSeconds)`: supplied native elapsed minutes × 60, exactly once. First-order heating then cooling after finite fuel exhaustion; anchored recomputation makes integer-second chunk partition exact without raw tick history. No weather/clock source and no random draws. G6 ambient exposure remains upstream.
- `stopThermal(law,state)`: immediate source removal; retained temperature cools on subsequent elapsed time, old damage/fuel stays. `resumeThermal(law,state,newQuote,{fuel?})`: fresh paid segment at the settled current temperature, retains prior residence/damage. Live tool loss/travel policy must settle then stop through integration.
- `thermalYield(law,state,activeAmount,admission?)`: absolute conserved integer `{usable,degraded,unextracted}`. Integration partitions the original admitted active pool once, gives usable to its existing product reader and routes other destinations through separation. Do not repeatedly mint this absolute result. Per-portion `admission={extractionSeconds,degradationSeconds}` freezes residence at admission so new additions get no prior extraction/damage. Integrator owns cohort/lot identity and must update thermal coefficients and physically mixed temperature when mass is added, not keep an old-mass rate. Same-temperature additions can re-quote/resume directly; mixed-temperature/geometry changes need an explicit energy-balance adapter and remain named below.
- `validateThermalState(state)`: revision/finite/history-bound structural validator. Integration additionally validates saved law identity, quoted coefficients/maker references, apparatus, custody and clock. These helpers do not replace that transaction/save validation.

Law shape: `{revision:'original.process.thermal@1',ambient,extraction:{min,max,seconds},degradation:{above,seconds}}`. Thermal residence is in game seconds inside/above declared windows; output uses deterministic exponential extraction/survival fractions and integer remainder destinations. It is ORIGINAL phenomenological game kinetics, no real medicine/chemistry claim. Existing `craft_resolver` summed exposure, distinct-material allowance and compounding per-op availability are unchanged. The new law cannot silently replace or reinterpret old products.

### Complete selected detail coverage

| Detail/finding | Producer → retained state → reader | Owner/dependency | Observable check and status |
|---|---|---|---|
| PC17 pulse versus hold, heating/cooling | source + elapsed → temperature → residence/yield | thermal pure; integration custody/product | Focused test 1, distinct extraction/damage; implemented pure |
| PC17 vessel inertia/geometry | shared apparatus thermalMass/area/transfer + actual load heat → anchored rate → temperature/fuel | separation vessel; thermal reader | Test 2 and 7; implemented pure |
| PC17 threshold extraction/degradation | declared ORIGINAL windows → residence → usable/degraded/unextracted | thermal; integration partition/use | Tests 1/8, conservation and later-input boundary; implemented pure |
| PC17 existing heat/availability meaning | existing resolver retained unchanged; new revision separate | integration product adapter | Source-inspected untouched; must preserve old reader or select new law explicitly |
| PC17 finite-burn exception/clock chunks | committed fuel/tool burn rate → exhaust boundary → cooling | thermal; G6/native clock integration | Test 3, [3,17,1,29,100] equals 150 seconds including exhaustion; implemented pure |
| PC22 amount versus row count | actual material quantities → mass/volume/specificHeat → quote/rate | G5 material vocabulary + G2 allocation; integration | Explicit load, 4/40 mass test; native quantity adapter still integration-owned |
| PC22 capacity/geometry/heat transfer | shared apparatus → admission/rate → supported load | separation + thermal | Tests 2/4/5/7; overcapacity refuses before state/debit |
| PC22 agitation workload | mass × declared work/mass → quote requirement → agitation execution | agitation + integration, thermal quote | Test 4, work 8→80; integrate actual work once |
| PC22 containment and actual heater | closure/capability + tools → quote refusal → native admission | separation/thermal + integration | Test 5/7; unsupported containment/tool rating refuses |
| PC22 actual stock/competence/tools | frozen actual maker → eligible quote → paid stage | integration revalidation | Test 5; no actor/mode privilege, test 6 |
| PC22 1x/10x fuel/yield | same method + actual load → longer warm-up → fuel/yield | thermal | Mass 4→40: warm 10.22849→71.59942 s, work 8→80, fuel 17.55712→32.89985; active pool 1000→10000 yields 891→9709. No forced linear yield or duration |
| PC22 supported equal-fuel exception | fixed rated burner + same short paid pulse → different achieved temperature | thermal | Test 4, equal 1.25 fuel at 5s, larger load warms less |
| J1/D1–D3 quick/guided/deep/helper policies | same known program + maker → same pure quote/trajectory | cues recorded-method + integration policy | Test 6 pure parity; actual known-method/stop-policy route still integration-owned |
| Lifecycle/rescue | stop/resume at settled boundary → retained exposure/fuel → weaker useful yield | thermal + cues/integration | Tests 1/7; no reversal of accumulated damage/fuel, paid reheat |
| SF2 projections/preview/draws | pure truth helpers → integration known projection | cues + integration | Test 5/6 input purity, zero RNG; temperature/yield truth must not go straight to player without means |
| SF3 staged additions/scale reconfiguration | actual admitted portions → new coefficients/mixed temperature and per-portion baselines → future yield | integration energy balance + G5 lots | Test 8 prevents prior residence on new pool; mixed-temperature admission adapter remains dependent work, not closed |
| SF4 G6 clocks/ambient | native settled interval/exposure → supplied seconds/ambient law → trajectory | G6 + integration | No competing clock/weather; released G6 contract and changing-ambient segment adapter pending integration |
| SF5 revisions/current persistence | frozen law + anchor + cohort baselines → next same outcome | integration native save owner | JSON chunk roundtrip passed test 3/6; native Save/reload/Export/Import not run here |
| SF1 world distinctions | source-qualified world law → selected rule/reader | source owners + integration | ORIGINAL Frontier pilot only; HP p481/LOTM0031 remain exact source qualification dependencies |
| PC20 selected pressure/material/closure depth | shared vessel and specific world law → supported thermal/mechanical effect | separation/integration/source owners | Closure admission supported; no claim of pressure kinetics, boiling/phase equilibrium or material-specific thermal reaction from unused names. Keep selected horizon open for these connected mechanisms |

### More-to-consider disposition

**ACT NOW completed:** strict finite inputs/revision; real quantity/stock/tool/capacity admission; anchored finite-burn settlement; pure quotes; conserved integer partitions; per-admission residence baseline; paid stop/reheat; shared vessel reconciliation; focused meaningful failures. No full suite/build/shared-doc edits.

**ACCOUNT FOR NOW:** native transaction owner must convert fractional authored fuel units to actual inventory units with one declared rounding/reservation law, never charge fractional native item counts or round each clock chunk; snapshot each admitted pool once; late admission updates mass/inertia and mixed temperature; work cost once; known projections distinct from truth; helper policy cannot ignore tool loss. These are required adapters in the implementation horizon.

**DEPENDENT selected work:** integration owns actual runtime readers, cues, changing ambient and energy-balance admission, actual stock debits, clock/save adapters, combined gates and browser/persistence. Separation owns pressure/material/closure mechanisms and shared vessel extensions; G6 ambient/clock and G5/G2 material quantity/fit remain owning dependencies. Source qualification for HP/LOTM kinetics is not closed by ORIGINAL pilot. No unrelated optional extension added.

### Verification

`node --test tests/craft_process_thermal.test.js` → **8 passed, 0 failed/skipped**; saved `focused-tests.tap`. Input identity and SHA-256 hashes saved in `input-identity.json`. Tests use synthetic fixtures. Source edit + focused pure tests only, agent-verified, not human-reviewed; no rebuilt bundle or gameplay-complete claim. Integration owns remaining AD36/AD43 gates.
