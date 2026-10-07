# Commonwealth module catalogue: salvage, service and powered assemblies

Status: Develop/Research proposal r1, 2026-10-03. Sole local component owner: progression/granularity GM. This is authoring detail, not registered equipment, a save schema or playable Fallout content.
Read [campaign](CAMPAIGN.md), [entry brief](WORLD_BRIEF.md), [source ledger](SOURCE_LEDGER.md) and [shared assembly contract](../PROGRESSION_AND_ASSEMBLY.md). Campaign owns institutions/plots; ledger owns source rulings; this file owns functional families and worked assemblies.
Boundary: Fallout 4 base-game Commonwealth branch, visitor rather than Sole Survivor. No Fallout 76, television, DLC, Creation Club or Anniversary equipment is silently inherited.
Evidence F2: [Bethesda's Fallout 4 overview](https://fallout.bethesda.net/en/games/fallout-4/welcome-home) supports weapon modification, settlement construction and maintained Power Armor. Its current page includes later editions; those additions are outside this boundary.
Evidence F3: the [2016 Survival essay](https://bethesda.net/en-US/news/fallout-4%27s-all-new-survival-mode) supports consequential supply/health tradeoffs, including ammunition weight and treatment costs. It is a design reference, not permission to change the existing native failure policy.
Exact frame models, fusion-core use, named upgrades, resistance values and repair recipes need item-specific primary evidence in [ledger](SOURCE_LEDGER.md). A remembered wiki or Fallout 76 recharge mechanic supplies none.
P marks original engineering stages, custom attachments and budgets. The **Waterline Reclamation Rig** below is an invented build, not a canonical Power Armor variant or a claim that base-game characters manufacture new cores.

Evidence marks inherit the ledger: C primary fact, A official adaptation corroboration, I inference, O original extension, U unresolved. P in this catalogue is explicitly an O proposal, never an official adaptation mark.
[Ability variants](../ABILITY_AUTHORING.md) permits stage/context differences and genuinely superior methods. The lower-cost roles illustrated here are concrete options, not a universal rule that every weak variant must survive or every mature method must pay a compensating penalty.

## Independent dimensions and component records

- Definition IDs use `fallout.module.<family>` revision 1; specimen identity is separate from blueprint, model name and stage.
- Structural tier identifies architecture: hand hoist, controlled powered lift, or serviceable multi-role rig. A canon T-series label is its own source-qualified model, not this ladder.
- Grade/rarity identifies source-certified material/model availability if verified. Common steel can be the correct repair material for an advanced assembly.
- Quality identifies tolerances, seal integrity and calibration as made. A rare scavenged part can have poor quality.
- Condition identifies bent mounts, leaking seals, fouled cooling, remaining fuel and corrosion independently. Repair does not retroactively improve original fabrication quality.
- Mastery belongs to the operator/mechanic: diagnosis, driving, load management, marksmanship and safe maintenance are different learned practices.
- Source/body identifies actual power supply, bodily compatibility and any acquired implant. A schematic supplies neither fuel nor a biological modification.
- Institution identifies workshop access, faction authorization and transport rights. Joining a faction never grants every restricted design or sufficient power output.
- Research distinguishes recovered manual, untested interpretation, bench-verified design and field-qualified application.
- Module kind records installed, carryable, learned, body-bound or facility-bound custody. Actual mounts and portable volume determine capacity, not a global slot count.
- One physical actuator is one specimen, with one owner and holder. Installing it removes availability from loose cargo and other simultaneous projects.
- Recovering an old Power Armor part preserves its source model and damage; calling it a custom stage cannot wash away compatibility requirements.

## Eleven module families and local stages

All stage names are P architecture. Power Armor applications remain source-pending where the exact base-game part is not verified.
Generic reclamation equipment can use ordinary mechanics without assuming universal interchangeability with canonical suits.

| Family / stable ID | Lower niche | Mid specialization | Mature capability | Inputs, acquisition and output |
|---|---|---|---|---|
| Chassis `fallout.module.chassis` | Braced cart carries loads cheaply without fuel | Operator-sized reclamation frame supports powered lifting | Serviced modular rig carries interchangeable declared tools at a prepared base | Salvaged beams, measured mounts and labor; canonical Power Armor frame acquired separately under ledger evidence |
| Actuation `fallout.module.actuation` | Hand winch moves a load slowly while conserving supply | Powered ram makes repeated lifts with pressure/control limits | Independently serviceable lift and stabilizer circuits support precise recovery under uneven loads | Actual motor/ram, seals, mechanical drive and qualified mechanic; output is force/motion, never free ammunition |
| Armor/protection `fallout.module.protection` | Apron, gloves and ordinary cover protect repair work | Replaceable debris guard protects rig and operator during reclamation | Source-qualified Power Armor equipment may support a distinct hazardous sortie after fit/service | Steel/cloth and actual acquired armor; debris, bullets, radiation and heat remain separate exposures |
| Power supply `fallout.module.power` | Hand labor or external workshop supply runs a stationary tool | Carried qualified supply supports a finite powered rig shift | Logged reserve and independent base supply support repeated sorties | Acquire compatible supply; fusion-core terms only for verified Fallout 4 equipment; no assumed core fabrication/recharge |
| Cooling `fallout.module.cooling` | Open casing and scheduled rest suit low duty cycles | Clean ducting and a replaceable fan permit longer tool operation | Isolated thermal paths keep sensors operating while heavy tools cycle | Salvaged fan, conductors, housing and inspection; P engineering, not invented canon Power Armor upgrade names |
| Sensors `fallout.module.sensors` | Gauge, plumb line and sample vial diagnose a bypass | Source-tested meter and shielded display expose load/exposure evidence | Calibrated redundant sensors distinguish actual fault from bad reading | Acquired meter, reference samples, batteries and trained interpretation; exact radiation detector availability ledger-gated |
| Interface/control `fallout.module.control` | Direct lever makes one observable motion | Dead-man switch and mechanical stop limit an accidental lift | Independent emergency stop and manual fallback support a trained operator team | Salvaged controls, wiring and physical linkages; P rig mechanism, not autonomous suit intelligence |
| Weapons/tools `fallout.module.tools` | Wrench, saw and plain sourced sidearm have narrow cheap roles | Interchangeable cutter or hoist uses a qualified mount | Source-qualified weapon modification and serviced tool rack support distinct missions | Real tools, rounds, mounts and training; ammo, cutting consumables and fuel paid separately |
| Utility `fallout.module.utility` | Rope, litter, sealed cargo box and dry clothing | Spill tray, filtration/sample kit and replaceable work lamps | Tested decontamination bay and transport containers protect a supply project | Acquired media, clean water, containers and paid labor; filtration is not universal radiation removal |
| Workshop/logistics `fallout.module.workshop` | Borrowed bench repairs one item | Dedicated bay stocks common seals and holds parts under custody | Staffed service depot schedules several assemblies and maintains a reserve line | Bench lease, tools, rights, finite stock and wages; facility remains in the Commonwealth |
| Operator/body support `fallout.module.operator` | Ordinary load stance, food, rest and injury awareness | Practice controlled lift, field diagnosis and emergency shutdown | Qualified crew coordinates recovery, escort and treatment without double-booking people | Actual body/training and supplies; any chem/implant effect needs its own primary evidence and acquired source |

### Central operating stages

- Chassis / braced cart: wood/steel frame and wheels produce a low-supply cargo solution; it remains useful for silent local transport.
- Chassis / reclamation frame: measured body clearance and tool mounts enable supported powered work. Wrong geometry can trap the operator or foul a hatch.
- Chassis / modular rig: declared mount spacing and service panels allow tool replacement at a bay. A heavier frame can still fail on a weak bridge.
- Actuation / manual: rope, winch and bracing trade time for fuel independence; no electronics are needed for the ordinary lift.
- Actuation / powered: ram plus qualified supply enables repeated motion. Undersupplied input stalls under load instead of generating scaled-down magic.
- Actuation / separated circuits: load and stabilizer circuits allow controlled work on uneven terrain. Added complexity costs seals, diagnostics and spare stock.
- Protection / workwear: abrasion cover enables maintenance without heavy transport overhead; it does not confer bullet or radiation immunity.
- Protection / debris guard: removable panels deflect defined work debris while preserving service access. Heavy guard may block a sensor or emergency exit.
- Protection / sourced suit: each canon armor piece retains model, repair state and verified mount eligibility. New plating is not an invented T-series promotion.
- Power / stationary: rented base supply serves production; carrying the bench's account does not make it portable.
- Power / finite field: one owned qualified supply supports a declared work envelope. Running out removes powered assistance but preserves the manual fallback.
- Power / reserve line: two independently acquired supply specimens and logged usage support a return sortie. Each has its own condition and remaining usable output.
- Cooling / rest cycle: expose casing safely and stop at the tested duty limit; low-load work remains simpler to repair.
- Cooling / ducted: add fan and clean ducting, test blockage and hot ambient conditions. More supply cannot cure inadequate heat rejection.
- Cooling / isolated: separate tool heat from sensitive controls with real packaging. A broken fan forces reduced duty even if reserve is full.
- Sensors / ordinary gauge: read force/position and inspect a sample directly. A cheap mechanical reference remains useful when a display lies.
- Sensors / calibrated meter: compare against known reference material and retain uncertainty. The reading supports judgment, not automatic immunity.
- Sensors / redundant: disagreement between channels pauses the operation for inspection. Redundancy is two actual sensors, not one duplicated UI value.
- Control / direct lever: operator watches one motion; affordable for a stationary supervised lift.
- Control / guarded: dead-man release and mechanical stop contain an unattended motion within tested limits. Training is still necessary.
- Control / independent stop: another person or separate mechanism can halt the tool. An adversary can attack that reachable control or sever its linkage.
- Tools / plain: sharpen saw and service wrench. Low-power tools work after a supply failure and do not spend valuable rounds.
- Tools / mounted: one cutter or hoist uses the mount and supply; fitting the other requires a safe refit, not a free mid-lift swap.
- Tools / mission rack: prepared alternatives enable salvage, escort or pump repair. Carrying every tool competes with spare supply and recovered cargo.

## Kinds and custody

| Kind | Example and owner | Portability / service obligation |
|---|---|---|
| Installed | Operator's motor, ram, guard, controls and sensor mounted in owned rig | Parts reserve the same specimen identities; removal returns their actual wear and contamination |
| Carryable | Wrench, spare seal, rounds, sourced armor part, sample and qualified supply | Cargo has volume/weight and holder; a loan cannot be consumed or scrapped as owned stock |
| Learned | Diagnostic sequence, weapon practice and verified drawing | Knowledge travels; local stock/facilities and operating practice remain necessary |
| Body-bound | Physical conditioning and a specifically acquired compatible modification, if later verified | Actual body/source travels under shared policy; wearing armor does not grant implant effects |
| Facility-bound | Service bay, pressure test stand, treatment station and generator | Site custody, capacity and legal access remain local; leasing a bay grants no ownership of its tools |

## Failure, discovery and service

| Family | Counter/failure and proposed test | Repair/refit/salvage; irreversible limit |
|---|---|---|
| Chassis | Bent mount or weak bridge fails loaded geometry test | Straighten or replace inspected member; retained serial/identity, condemned metal only ordinary scrap |
| Actuation | Leak or overload stalls a lift; proof under supported test mass | Replace seals, bleed/adjust qualified circuit, retain used motor; dropped cargo can remain destroyed |
| Protection | Gaps admit the actual exposure; separate debris and contamination tests | Patch plate, replace liner, decontaminate only by validated method; no universal seal rating |
| Power | Wrong connector/output rejects; remaining usable supply tested independently | Replace source at safe halt; spent source stays spent; no invented core recharge route |
| Cooling | Fouled duct raises heat at the same load; test hot ambient and blocked fan | Clean/replace fan, reduce duty; overheated actuator may remain damaged after cooling |
| Sensors | Saturated meter or miscalibration hides risk; compare mechanical/reference reading | Recalibrate or replace sensor, keep failed-test record; lost sample provenance cannot be reconstructed by a better meter |
| Control | Damaged linkage permits unintended motion; test stop with unloaded tool | Refit linkage and retest; successful software display does not prove mechanical stopping force |
| Tools | Empty magazine, dull cutter or wrong mount denies the action | Refill real rounds, replace cutting edge, choose plain backup; test shots and cut stock stay spent |
| Utility | Exhausted media or contaminated bottle invalidates treatment/sample | Replace actual media, clean under validated protocol; filtered appearance alone is not a safe-water result |
| Workshop | Lost lease or missing mechanic pauses the next batch | Rent another bay or train locally; moving contracts does not teleport machinery or stock |
| Operator | Fatigue/injury spoils control; supervised unloaded practice reveals gap | Rest and source-supported treatment; repair of metal does not heal the body or erase learned skill |

- Source-specific Power Armor repair must preserve what Fallout 4 actually permits. This catalogue's seal/thermal engineering is P and cannot override a canon equipment rule.
- Ordinary maintenance and fuel purchase stay useful beyond the first stage. Advanced machinery does not force every task into a powered sortie.
- Refits reserve the tool, bay, mechanic and actual parts together; no two projects borrow the same ram concurrently.
- Salvage recovers only inspected surviving material/parts. It never yields all original inputs plus an intact finished assembly.
- Defined safe repeated jobs may idle until stock, site or duty limit stops them. Novel pressure tests and hazardous sorties require active commitment.

### Family salvage and irreversible constraints
- Chassis: dismantle only owned surviving members; condemned or corroded material stays scrap until tested, never a fresh frame duplicate.
- Actuation: recover the actual intact ram/motor after safe removal; damaged seals and dropped cargo retain the consequences of the failed lift.
- Armor/protection: reuse source-eligible surviving plates with their condition; debris guard scrap does not become radiation shielding by renaming it.
- Power: retain unused qualified source with measured remaining supply; spent core/source gets only source-evidenced handling, not a fabricated recharge recipe.
- Cooling: recover tested fan and conductors; overheated insulation remains damaged, even after the rig's thermal reserve has recovered.
- Sensors: retain calibrated surviving instrument and its error history; destroyed sample/provenance is not recreated from the sensor's price.
- Control: recover inspected lever/switch; bent linkage cannot be counted simultaneously as installed protection and loose replacement stock.
- Weapons/tools: recover unused viable rounds and sound tool steel only; shots, cutting edges and destroyed targets never refund all inputs.
- Utility: recover clean compatible containers; spent filter media remains spent and contaminated stock cannot quietly join clean medical supply.
- Workshop/logistics: actual owned spare stock can transfer, hired machinery/access cannot; dismantled bay yields only declared surviving material.
- Operator/body: learned practice survives equipment salvage; injury and specifically acquired bodily sources require real treatment/compatibility rather than metalwork.

## Multi-component assembly: Waterline Reclamation Rig

P assembly `fallout.assembly.waterline_rig`, revision 1. Custom open work frame, not a canonical suit model; direct Power Armor use is a separately source-qualified alternative.
| Part/support | Function and dependency | Physical conflict / replacement |
|---|---|---|
| Salvaged operator frame and leg braces | Supports tool mass and tested operator clearance | Bent leg member replaced at bay; lighter cart for weak crossings |
| Powered ram plus hand winch | Powered lift with slow fuel-free fallback | Leak removes ram output; fallback remains at its actual lower envelope |
| Acquired qualified supply and protected wiring | Feeds ram/control under verified output | Wrong source rejected; manual tool or base tether chosen instead |
| Fan, duct and tool heat isolation | Enables declared duty cycle | Guard cannot block duct; dirty fan reduces allowed consecutive cycles |
| Gauge, calibrated meter, separate reference vial | Exposes position and supported exposure evidence | Meter disagreement requires halt; do not turn diagnosis into protection |
| Lever, dead-man release and mechanical stop | Direct control with tested stop | Reachability conflicts with armor panel; refit geometry before use |
| Cutter OR hoist mount; plain tools | Mission-specific work and field repair | One declared mount shared, safe bay/halt for exchange; no universal slot cap |
| Work guard, gloves, sample box and spill tray | Debris and sample handling support | Sealed box occupies cargo space; no assumed airtight Power Armor protection |
| Mina's bay, Imani's sampling, transport agreement | Real facilities and specialists support the full chain | Rights can lapse; trained crew and stocked inputs cannot be replaced by frame quality |

Proposed budgets are design fixtures: rig field source holds twenty work units, lift costs four, travel two per leg, cutter six per cut.
Two lifts, round-trip travel and one cut consume eighteen, leaving two for contingency. A second cut exceeds reserve and rejects before starting.
P supply throughput is eight draw units: lift five, control one and sensing one fit at seven; cutter six plus control/sensing fits at eight; simultaneous lift/cutter exceeds supply and rejects. Draw limits and reserve expenditure are distinct measurements.
Thermal budget P: two consecutive heavy cycles, then one cooling interval. A full power source cannot bypass this limit.
Cargo budget P: ten units; rig mission kit six, safe sample two, recovered parts two. Carrying spare supply requires surrendering some recovered cargo or separate transport.
Operator and mechanic each reserve one task at a time; Imani's separate sampling appointment has independent capacity and stock.

## Three worked loadouts

### Poor specialist: manual bypass mechanic
- Owns hand winch, wrench, gauge, apron, gloves, rope, two seals and clean sample bottles; knows ordinary geometry and basic diagnostic work.
- Materials: salvaged inspected steel, paid clean water and Mina's borrowed bench. No suit, core, radiation cure or firearm is granted.
- Budget P: six carry units, one manual lift per work interval, one paid sample comparison; fuel-free work still costs labor/rest.
- Action unlocked: reopen the narrow bypass through correct hoist placement, leaving the armored gate confrontation to another route.
- Decision: consume the best seal on the water joint or preserve it for the winch bearing and buy a replacement.
- Conflict: cargo and tool bulk limit recovered salvage; choose the evidence sample or an extra steel bundle.
- Counterplay: contaminated flooded access, armed seizure or overloaded winch defeats the plan without making the mechanic useless at ordinary repairs.
- Replacement: repair rope or rent transport; keep inexpensive gauge as the reference for later electronics.
- Lasting result: diagnosis and witnessed contribution persist; missed carrier access and consumed sample materials remain actual costs.

### Developed field build: qualified reclamation operator
- Owns Waterline Rig, calibrated meter, hoist, cutter stored at bay, plain weapon if lawfully sourced and a finite declared ammunition lot.
- Acquisition: buy/claim damaged machinery, diagnose, repair, fit, qualify supply and learn operator practice; owning a frame skips none of those steps.
- Budget P: twenty field-work units, eighteen for selected mission, two-cycle heat envelope, ten cargo units; ammunition and treatment separate.
- Action unlocked: remove larger debris and recover the tested pipe sample while retaining slow manual escape from a mechanical stall.
- Decision: take cutter for blocked metal access or hoist for intact recovery. One mounted tool cannot satisfy both without paid refit.
- Conflict: heavier protective panels obstruct stop access/cooling; retain lighter guard until geometry is retested.
- Counterplay: hostile operator targets controls, meter lies, ram leaks or actual threat exceeds guard protection. A mere supply upgrade does not solve all four.
- Replacement: swap actual fan at a safe service point, preserving removed damage; use plain hand tools while source stock is exhausted.
- Lasting result: repaired rig and operator knowledge survive; source expenditure, lost parts and accepted service obligations do not reset on return.

### Mature project: armored sortie plus cooperative service depot
- Sources an actual canon Power Armor frame/parts and supply under verified ledger rules, keeping custom rig as a separate work asset; named model left open until verified.
- Owns/leases service bay, test stand, spare qualified supply, tool rack and sample logistics. Crew trains driving, escort, diagnostics and treatment separately.
- Budget P: two staffed bays, one reserved emergency supply, finite rounds/medicine, three booked specialist shifts; each assembly has its own measured envelope.
- Action unlocked: a properly supported armored sortie can overpower lesser fixed threats while the reclamation rig maintains the civilian water line.
- Decision: commit scarce supply and escort to Orren's gate or secure another clean-water load; capacity cannot serve every claimant at once.
- Conflict: a powerful suit does not supply missing medical stock, prove water quality or create lawful public service rights.
- Counterplay: superior enemy firepower, denied route, source shortage or internal control failure imposes specific limits; no adaptive enemy-level scaling.
- Replacement: repair older armor for routine patrol, reserve newer verified parts for actual hazard, or buy another mechanic's shift instead of another suit attachment.
- Lasting result: retained source-qualified armor, repaired project assets and negotiated claims; actual fuel/rounds remain spent and faction memories remain instance-specific.

## Worked salvage-to-refit chain and paid hybrid tests

1. Gather legal scrap and acquire damaged ram/control with explicit provenance. Inspect damage and reserve the physical specimens at Mina's bay.
2. Research old drawing and actual pipe clearance; compare gauge reading with Imani's finite sample service. Unsupported source assumptions stay uncertain.
3. Manufacture a measured mount and replace seals; use actual salvaged steel, rubber-equivalent qualified material and labor. Not every scrap substitutes for pressure-rated parts.
4. Test unloaded stop and supported proof load. P failed test: a warped mount binds halfway, spending labor and damaging a cheap link while saving the costly ram.
5. Refit only link/mount, preserve ram identity and retest. Successful production grants gear; operator handling still requires supervised practice.
6. Use the rig on the committed waterline job, paying source, duty-cycle time and sample handling. An interrupted lift stops in its declared safe/unsafe state.
7. Recover surviving removed seal/metal as inspected salvage, not new parts. Publish the actual repaired bypass and its service-right consequence once.
8. Lasting consequence: field-qualified design, used rig and actual water access; failed sample/damaged link/spent fuel remain in the record.
Hybrid P: fit an ordinary Skyrim-forged bracket after one imported sample, one metallurgy comparison and one loaded test. Stronger material still needs geometry and repair knowledge.
Failed import P: an enchanted boot mounted as a rig power source has no evidenced electrical/actuation output. Pay test labor; boot retains its original effect and ownership.
Second hybrid P: imported trained strength drives the manual winch with its own source. Test frame stress and operator clearance; greater force can exceed the mount rather than upgrade it.
No transfer converts Magicka, chakra or FP into fusion-core charge by naming the part a battery. A validated future conversion would need its own bounded research contract.

## Exact runtime gaps and owned checkpoint

- Inspected [items](../../../src/items.js): flat template components and quality-based identity/rarity do not preserve serial actuator wear, contamination, fuel remaining and independent grade.
- Inspected [native equipment](../../../src/native_equipment_transaction.js) and [equipment effects](../../../src/simulation_effects.js): whole-item slot transactions exist. A rig spanning limbs and tools needs footprint/occupancy validation, child custody and actual removal state.
- Inspected [power models](../../../src/power_models.js): design capacity counts authored functions. Missing typed force/mount, electrical output, heat, mass, control reach and derived function-availability checks.
- Inspected [energy](../../../src/energy_resources.js): actor-method reserve and strain exist. Device-owned supply, per-shot ammo, thermal duty cycles and field source replacement need selected adapters.
- Inspected [site projects](../../../src/site_projects.js): paid dependent phases/site capacity can stage the bay. Durable pressure-test/refit requires atomic part reservation, failed-test damage and publication/reload without fresh copies.
- Independent native world/instance state, actual Fallout inventory/stations/currency, radiation/treatment semantics and source-qualified suit recipes remain missing. Generic actor conditions do not establish radiation protection.
- Later proof: fail mount test, refit same ram, swap actual tool, exhaust supply while manual fallback works, reject second assembly use and reload at each step. These runtime checks are unrun.
Checkpoint r1: only this catalogue written; start HEAD `97c28efece4fd6248b6f075ad0c6927c3d0432df`; pre-existing dirty source/bundle/docs preserved.
Inputs: role, PROJECT, framework, progression contract, briefs and named source modules inspected; official F2/F3 checked. Live campaign/ledger read; F2/F3 labels now aligned. Exact Power Armor rules remain FU1/FU2/FU3/FU7 gates.
Source limits: custom rig, thermal/pressure budgets and engineering stages are P; canonical armor names, core mechanics and upgrade recipes need ledger verification before implementation.
Verification: static design/link review only; rebuild/browser/save/migration and human fiction/balance gates unrun.
Reviewed shared inputs SHA256: framework `c1c796a29139284bbeda99d9caf2ad57e8ddd797cb11249eb073d146269550f4`, progression `35a3ea8aaa3ab4f1336d3617f07c4e7ef5e5287b8dfed4cd7cec7cbc77f37147`, ability variants `a6062efad9c196ab069bee910c543bca45f89ad9b74907f5f7cabb900e4b1687`. Recheck live owners after refresh before edits.
Resume: master reviews campaign/source alignment and selects manual-to-powered refit proof after resolving device/child-state publication. No children, messages, commits, publishing or private saves.
