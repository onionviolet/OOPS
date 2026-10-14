# T5 worked AND/OR roadmaps

2026-10-14. Original proposals extending PI2–PI5/PI8–PI11. Eleven targets, each in home world and an original cultivation world. No roadmap is implemented, accepted or verified reachable in native play.

## V20: Reading and measuring these graphs

`OR` chooses a method/provider; `AND` requires every listed node. A node reused by name is shared capability, not a second free copy of consumable stock. Lines are dependency declarations, not chronological procedures. Actual ordering, ownership, capacities and runtime actions need a method/scheduler contract. The strict distinction between making, commissioning and obtaining remains per the player's intent (REFERENCES V13).

Each block's **D** is the longest edge path from root to a named terminal leaf. **W** is the largest number of distinct nodes at the same shortest distance from root across the union of printed alternatives. **N** is total distinct nodes. AND/OR operators are not nodes. Metrics are computed from these printed graphs, include knowledge/people/access leaves, and are insensitive to indentation. W is structural breadth, not simultaneous labor; D is neither elapsed time nor scientific difficulty. A purchased/service leaf deliberately compresses its external supply chain. A deep project can expand further when ordinary institutions do not exist. The fission graph is a compressed institutional example, not a claim of a complete civilization roadmap.

Terminal leaves mean the **authoring horizon stops there**, not that the player owns them or knows them. Every prospective playable pack must qualify each leaf's acquisition route, coexistence, world law and consumer under the existing generation contract P6. Missing support is reported as proposed/unverified, not silently marked available. Native anchors below point to inspected definitions; actual unlocks, sourcing and services still need a native journey. PI4's player view filters unknown branches and institutions, including misleading knowledge; these full proposal diagrams are author views and reveal no sealed world truth.

## V32: Cultivation-world premise

The second world in all examples is **Reed Basin**, an explicitly original cultivation-world proposal, not a book adaptation or new selected world. Ordinary matter and mechanical processes can work there; qualified local qi patterns may supply heat, cleansing, sensing, signaling and forming only where an authored law and consumer exist. Clays, reeds, charged tokens, glowstones, bathhouses, workshops and sect services are proposed available families/institutions with acquisition routes still to author. There is no universal qi substitution or automatic nuclear/medical expertise. Each instance must freeze lawful availability and receipts. Strong personal means, independent invention, trade and institutions may coexist; a sect's refusal is a local relationship consequence, not a permanent global lock.

Every cost below is fictional game balance, not a physical amount or historical duration. **PI9:** explosive, weapon and drug roadmaps remain abstract project/resource/access nodes, with no real preparation, reagents, procedures, quantities or conditions. The planner must keep those nodes opaque even if a player knows more. Ordinary glass/wood/paper basics are allowed, but native recipes are game abstractions rather than scientific certificates.

## V21: Soap

Target: clean grease; household; bar or wash.

Plant wash and a cleansing fixture satisfy cleaning, not literal soap composition; a literal soap request filters those branches.

**Home world: D=5, W=9, N=29.**

```roadmap
grease_cleaning = OR(soap_bar, plant_wash)
soap_bar = AND(fat_stock, alkali_stock, mixing_access, soap_knowledge, cleaning_consumer)
fat_stock = OR(native_fat, purchased_fat)
native_fat = AND(boar_meat, cooking_skill, fat_recipe_access)
alkali_stock = OR(native_potash, traded_alkali)
native_potash = AND(charcoal, alchemy_skill, potash_recipe_access)
charcoal = AND(raw_wood, smelting_skill, village_smelting)
mixing_access = OR(own_vessel_workspace, artisan_service)
plant_wash = AND(qualified_plant, crushing_vessel, water_access, plant_knowledge, cleaning_consumer)
qualified_plant = OR(identified_harvest, seed_supplier)
```

**Reed Basin cultivation world: D=4, W=8, N=20.**

```roadmap
grease_cleaning = OR(soap_bar, cleansing_fixture)
soap_bar = AND(traded_fat, traded_alkali, artisan_workspace, soap_knowledge, cleaning_consumer)
cleansing_fixture = AND(purifying_pattern, fitted_carrier, qi_service, cleaning_consumer)
purifying_pattern = OR(teacher_lesson, tested_original_pattern)
fitted_carrier = AND(local_clay, potter_skill, kiln_access)
qi_service = OR(owned_charged_token, bathhouse_service)
bathhouse_service = AND(keeper_agreement, funded_service_right)
```

Native boundary: Native fat is a Cooking recipe, not an inferred butchery drop: `src/crafting_recipes.js:1332`; charcoal/potash: `:1323`, `:1434`. Soap, plant-wash response, water stock and the cleaning consumer are new proposals. Potash is a game ingredient, not a certified real soap input.

People and institutions: Home: ordinary artisan service can replace owning apparatus; a household batch needs no compulsory guild. Cultivation: potter or equivalent forming means, and a bathhouse keeper only on that service branch.

World reactions, proposed: Home: a laundry commission creates demand; reliable public washing may change a separately authored illness-exposure check. Cultivation: bathhouse keepers can license the fixture or adopt it; no automatic sect hostility.

Useful intermediate returns and idle stop: A fitted vessel remains useful before soap; a cleansing fixture serves a named washing action. Stop when stock or admitted service access runs out.

Illustrative fictional cost: Home: 4 workshop credits and 2 work cycles. Cultivation: 3 craft credits and 1 keeper favor. All proposed fictional balances.

## V22: Glass

Target: contain or transmit light; specimen; vessel or pane.

**Home world: D=5, W=7, N=21.**

```roadmap
glass_product = OR(native_vessel, commissioned_pane)
native_vessel = AND(raw_glass, crafting_skill, vessel_recipe_access, village_crafting)
raw_glass = AND(silica_sand, potash, smelting_skill, glass_recipe_access, village_smelting)
potash = AND(charcoal, alchemy_skill, potash_recipe_access)
charcoal = AND(raw_wood, smelting_skill, village_smelting)
commissioned_pane = AND(glazier_contract, purchased_glass, pane_acceptance)
glazier_contract = AND(project_budget, reachable_artisan)
```

**Reed Basin cultivation world: D=4, W=8, N=19.**

```roadmap
glass_product = OR(ordinary_glass, qi_formed_glass)
ordinary_glass = AND(traded_feedstock, glassworker_skill, kiln_access, shaping_method)
qi_formed_glass = AND(qualified_glass_stock, forming_pattern, qi_service, fitted_mould)
forming_pattern = OR(teacher_lesson, tested_original_pattern)
fitted_mould = AND(local_clay, potter_skill, kiln_access)
qi_service = OR(owned_charged_token, workshop_contract)
workshop_contract = AND(keeper_agreement, project_budget)
```

Native boundary: Native raw glass, phial and bottle recipes: `src/crafting_recipes.js:1223`, `:1106`, `:1117`. They start locked; the book `A Glint On The Sand` declares recipe and sand-gathering unlocks at `src/items.js:1354` (inspect the exact book route before a build). Panes, mould interfaces and transparent optical performance are proposed.

People and institutions: Home: a glazier is needed only for the service route. Cultivation: glassworker, potter and pattern expertise may be one capable actor or hired specialists; workshop keeper on the contracted route.

World reactions, proposed: Home: bottle supply helps established recipes; panes create glazier commissions. Cultivation: workshops can bargain over pattern access while merchants adopt consistent vessel sizes.

Useful intermediate returns and idle stop: Native bottles/phials already have item consumers; a pane needs a new window or instrument reader. Unlock/access is the visible stall, not an unexplained era tier.

Illustrative fictional cost: Home: 5 workshop credits and 3 work cycles for the proposed project wrapper. Cultivation: 4 craft credits and 2 work cycles.

## V23: Paper

Target: record known information; household; sheet.

**Home world: D=4, W=10, N=21.**

```roadmap
record_sheet = OR(rag_paper, fibre_paper)
rag_paper = AND(rag_stock, pulp_work, sheet_frame, drying_access, writing_consumer)
fibre_paper = AND(fibre_stock, pulp_work, sheet_frame, drying_access, writing_consumer)
fibre_stock = OR(flax_stock, traded_fibre)
pulp_work = AND(water_access, beating_tool, papermaking_knowledge)
sheet_frame = AND(processed_wood, mesh_stock, woodworking_skill)
processed_wood = AND(raw_wood, woodworking_skill, village_woodworking)
drying_access = OR(new_sheet_rack, papermaker_service)
```

**Reed Basin cultivation world: D=4, W=8, N=19.**

```roadmap
record_sheet = OR(ordinary_paper, spirit_fibre_sheet)
ordinary_paper = AND(traded_rags, papermaker_service, writing_consumer)
spirit_fibre_sheet = AND(fibre_harvest, pattern_frame, drying_access, writing_consumer)
fibre_harvest = AND(identified_reed_plot, herbalist_means, harvest_right)
pattern_frame = AND(processed_wood, mesh_stock, inscription_knowledge)
drying_access = OR(ordinary_sheet_rack, drying_pattern)
drying_pattern = AND(qi_service, tested_drying_law)
```

Native boundary: Flax and processed wood exist: `src/items.js:1862`, `src/crafting_recipes.js:1248`. Native cloth is not automatically suitable rag pulp, and the existing offcut rack at `src/home_furnishing_content.js:40` cannot dry paper without a new job. Paper, mesh, pulp/frame/drying and writing consumers are proposed.

People and institutions: Home: a papermaker can supply the whole production service; larger mills need transport and staff beyond this horizon. Cultivation: reed-plot keeper supplies harvest rights on that branch; pattern knowledge can be self-developed rather than a mandatory sect lesson.

World reactions, proposed: Home: record sheets change ledger/manual supply only with real writing consumers; scribes may buy stock rather than resist it. Cultivation: cheap instruction sheets can widen learning; the plot keeper reacts to overharvest only under a selected local ecology law.

Useful intermediate returns and idle stop: A frame becomes reusable tooling; sheets support actual records before printing exists. Stop on fibre/water/access/output-storage shortage.

Illustrative fictional cost: Home: 3 workshop credits and 3 work cycles. Cultivation: 3 craft credits and 2 work cycles.

## V24: Lamp upgrade

Target: light a room longer or more usefully; household; carried lamp.

**Home world: D=5, W=7, N=26.**

```roadmap
room_lamp = OR(improved_oil_lamp, glazed_lantern)
improved_oil_lamp = AND(lamp_body, wick_stock, fuel_stock, burn_test, light_consumer)
glazed_lantern = AND(lamp_body, glass_panel, wick_stock, fuel_stock, fit_test, light_consumer)
lamp_body = AND(metal_stock, forging_skill, lamp_design)
glass_panel = OR(glazier_service, pane_work)
pane_work = AND(raw_glass, shaping_knowledge, glass_workspace)
raw_glass = AND(silica_sand, potash, glass_recipe_access, village_smelting)
fuel_stock = OR(traded_lamp_fuel, native_fat_adapter)
native_fat_adapter = AND(owned_animal_fat, fuel_law)
```

**Reed Basin cultivation world: D=4, W=7, N=19.**

```roadmap
room_lamp = OR(repairable_qi_lamp, improved_oil_lamp)
repairable_qi_lamp = AND(emitter_part, patterned_housing, qi_service, light_consumer)
emitter_part = OR(qualified_glowstone, commissioned_emitter)
patterned_housing = AND(local_clay, potter_skill, compatible_pattern)
qi_service = OR(owned_charged_token, household_supply_contract)
household_supply_contract = AND(keeper_agreement, funded_service_right)
improved_oil_lamp = AND(traded_lamp_body, wick_stock, traded_fuel, light_consumer)
```

Native boundary: Metal/components, glass and Animal fat are source foundations: FUNCTIONS N4/N6/N7 and `src/crafting_recipes.js:1332`. Patrol loan-kit text at `src/items.js:1415` does not provide an owned lamp recipe or general lighting law. Lamp fittings, fuel response and working-hours consumer are proposed.

People and institutions: Home: glazier optional; a sufficiently equipped solo maker can build the oil branch. Cultivation: emitter artisan and supply keeper only on their service branches; personal energy means can bypass the utility.

World reactions, proposed: Home: a household chooses an actual evening activity, with no compulsory night-work bonus. Cultivation: reliable lamps can spread to ordinary households; supply outage changes that contract, not every light source.

Useful intermediate returns and idle stop: The upgrade changes one supported work interval or visibility response, with the original lighting route still usable. Glass panels can also serve instruments. Stop on fuel, charge or output incompatibility.

Illustrative fictional cost: Home: 4 workshop credits and 2 work cycles. Cultivation: 4 craft credits and 1 supply favor.

## V25: Thermometer

Target: measure temperature within a useful reading band; specimen; held instrument.

**Home world: D=4, W=10, N=26.**

```roadmap
temperature_reading = OR(mechanical_thermometer, fluid_column_instrument)
mechanical_thermometer = AND(sensor_stock, precision_forming, readout_scale, calibration, measurement_consumer)
fluid_column_instrument = AND(glass_tube, qualified_response_fluid, readout_scale, calibration, measurement_consumer)
precision_forming = AND(metal_stock, fitter_skill, gauge_access)
glass_tube = AND(raw_glass, glassworker_skill, forming_access)
raw_glass = AND(silica_sand, potash, glass_recipe_access, village_smelting)
calibration = OR(reference_instrument_service, local_reference_method)
reference_instrument_service = AND(metrologist_agreement, project_budget)
readout_scale = AND(marking_tool, known_unit_convention)
```

**Reed Basin cultivation world: D=5, W=6, N=19.**

```roadmap
temperature_reading = OR(ordinary_instrument, heat_sensing_tile)
ordinary_instrument = AND(traded_instrument, local_calibration, measurement_consumer)
heat_sensing_tile = AND(sensor_crystal, sensing_pattern, readout_scale, local_calibration, measurement_consumer)
sensor_crystal = OR(identified_deposit, supplier_certificate)
sensing_pattern = OR(teacher_lesson, tested_original_pattern)
local_calibration = AND(reference_access, known_local_unit)
reference_access = OR(sect_reference_service, earned_personal_reference)
sect_reference_service = AND(keeper_agreement, project_budget)
```

Native boundary: Glass and metal stock are native foundations; N9 qualifies one stamped sample, not temperature. Sensor response, instrument forming, unit convention, calibration and readout are new. No real hazardous sensing fluid or chemical details are supplied.

People and institutions: Home: precision maker and metrologist can be personal means or services. Cultivation: a sect reference keeper appears only on the institutional route; an independently earned reference remains possible.

World reactions, proposed: Home: makers can compare batches and detect bad readings. Cultivation: reproducible readings may help ordinary crafters challenge an inaccurate supplier certificate; response comes from affected actors, not automatic persecution.

Useful intermediate returns and idle stop: Calibration improves what the actor can report without changing the sample. A coarse reading can be useful before a finer gauge. Stop when reference access or supported sensor range is absent.

Illustrative fictional cost: Home: 6 workshop credits and 4 work cycles. Cultivation: 4 craft credits and 2 comparison cycles.

## V26: Steam engine

Target: convert heat to mechanical motion; workshop; fixed machine.

**Home world: D=6, W=12, N=31.**

```roadmap
workshop_engine = OR(new_engine_project, restored_engine_project)
new_engine_project = AND(power_module, precision_motion_module, frame_drive, operation_right, installed_consumer)
power_module = AND(qualified_machine_shop, energy_supply, water_service, pressure_module_contract)
precision_motion_module = AND(precision_tools, fitter_means, machine_design)
precision_tools = AND(gauge_access, toolmaker_means, metal_supply)
metal_supply = OR(native_ingot_route, foundry_contract)
native_ingot_route = AND(ore_stock, coal_stock, smelting_skill, village_smelting)
frame_drive = AND(processed_wood, metal_stock, assembly_means)
restored_engine_project = AND(reachable_engine_relic, restoration_contract, operation_right, installed_consumer)
operation_right = OR(owned_worksite, mill_owner_agreement)
```

**Reed Basin cultivation world: D=4, W=10, N=22.**

```roadmap
workshop_engine = OR(qi_heated_steam_project, traded_engine_restoration)
qi_heated_steam_project = AND(steam_machine_contract, heat_pattern, precision_motion_module, operation_right, installed_consumer)
steam_machine_contract = AND(qualified_workshop, water_service, project_budget)
heat_pattern = AND(compatible_pattern, qi_service, local_heat_law)
precision_motion_module = OR(local_fitter_service, imported_motion_module)
imported_motion_module = AND(working_carrier, compatibility_check)
traded_engine_restoration = AND(reachable_engine_stock, restoration_means, operation_right, installed_consumer)
operation_right = OR(owned_worksite, sect_mill_agreement)
```

Native boundary: Native ingot transformation and component assembly: `src/crafting_recipes.js:1192`, `:376`. Controlled pressure machinery, gauges, fitting precision, energy/water services and installed drive consumers are new, including the hypothesized relic. This is an architecture-level ordinary-machine roadmap, not construction instructions.

People and institutions: Home: toolmaker, fitter and mill owner are substitutable roles; larger continuing production needs an actual operator/supply service. Cultivation: workshop and sect mill services appear only on the selected branch; strong personal means can satisfy those roles.

World reactions, proposed: Home: a mill gains a supported mechanical service; suppliers and laborers may gain or lose orders. Cultivation: a mundane-motion engine gives non-cultivators usable power without granting them qi control; utility keepers may expand supply.

Useful intermediate returns and idle stop: Precision tooling pays off in other crafts before the engine. Running consumes actual stock/service and halts at missing water, energy, staff or receiver capacity. A qi motor alone is not a steam engine.

Illustrative fictional cost: Home: 20 workshop credits and 8 project cycles. Cultivation: 14 craft credits and 6 project cycles.

## V27: Antibiotics

Target: provide qualified infection care; personal; abstract treatment package.

A fictional healing service is functionally comparable care, not antibiotics; a literal antibiotic request removes it. Local compatibility never follows from the word heal.

**Home world: D=5, W=7, N=22.**

```roadmap
infection_care = OR(antibiotic_project, supplied_clinic_service)
antibiotic_project = AND(qualified_therapeutic_stock, treatment_design, clinical_validation, accountable_delivery)
qualified_therapeutic_stock = OR(licensed_supplier, abstract_pharmaceutical_facility)
abstract_pharmaceutical_facility = AND(institutional_capacity, medical_expertise, fictional_supply_budget)
institutional_capacity = AND(funded_clinic, trained_staff, supported_logistics)
treatment_design = AND(qualified_medical_knowledge, lawful_research_access)
clinical_validation = AND(qualified_clinician, declared_fictional_review)
accountable_delivery = AND(patient_assessment, carrier_service, care_consumer)
supplied_clinic_service = AND(licensed_supplier, qualified_clinician, accountable_delivery)
```

**Reed Basin cultivation world: D=4, W=7, N=19.**

```roadmap
infection_care = OR(antibiotic_supply, fictional_healing_service)
antibiotic_supply = AND(qualified_therapeutic_stock, local_compatibility_review, accountable_delivery)
qualified_therapeutic_stock = OR(licensed_importer, abstract_sect_medical_facility)
abstract_sect_medical_facility = AND(funded_clinic, trained_staff, fictional_supply_budget)
local_compatibility_review = AND(qualified_clinician, declared_fictional_review)
accountable_delivery = AND(patient_assessment, care_consumer, service_access)
fictional_healing_service = AND(qualified_healer, local_compatibility_review, accountable_delivery)
service_access = OR(personal_care_means, healer_agreement)
```

Native boundary: N12 supplies native fixed recovery/effects only. It does not prove infection diagnosis or antibiotics. Every therapeutic substance, production facility and review is abstract; no real drug ingredients, preparation, conditions, quantities or dosage are present.

People and institutions: Home: qualified clinician/research/delivery roles and supplier or institutional capacity. Cultivation: medical sect capacity or licensed trade plus local review; a competent personal healer may supply the alternative care route. No institution grants competence by title alone.

World reactions, proposed: Home: reliable care creates clinic access and demand under an authored health law. Cultivation: commoner clinics may improve access; medical sects can collaborate, compete or set service terms. No universal cure or certainty claim.

Useful intermediate returns and idle stop: Medical knowledge and delivery support other care before this target. Repeat services use admitted fictional treatment stock and actual care access; failure may remain inconclusive rather than granting a cure.

Illustrative fictional cost: Home: 12 care credits and 5 review cycles. Cultivation: 10 care credits and 1 clinic accord. Fictional balances only.

## V28: Telegraph

Target: send a reliable addressed message; regional; network.

Paired talismans can satisfy messaging, but do not count as wired telegraphs under a literal request.

**Home world: D=4, W=10, N=28.**

```roadmap
message_network = OR(wired_telegraph, commissioned_telegraph)
wired_telegraph = AND(signal_power, endpoint_pair, link_route, code_agreement, message_consumer)
signal_power = AND(abstract_power_unit, maintainer_means, power_supply)
endpoint_pair = AND(contact_devices, operator_training, endpoint_access)
contact_devices = AND(metal_stock, precision_fitter, instrument_workspace)
link_route = AND(wire_stock, insulated_supports, route_access, line_maintenance)
insulated_supports = AND(processed_wood, qualified_insulator, forming_means)
commissioned_telegraph = AND(network_provider_agreement, reachable_endpoint_pair, message_consumer)
route_access = OR(owned_route, landholder_agreements)
```

**Reed Basin cultivation world: D=3, W=12, N=23.**

```roadmap
message_network = OR(wired_telegraph, paired_talisman_service)
wired_telegraph = AND(traded_endpoint_pair, line_route, signal_power, message_consumer)
line_route = AND(wire_stock, insulator_stock, landholder_agreements)
paired_talisman_service = AND(paired_carriers, pairing_pattern, endpoint_access, qi_service, message_consumer)
paired_carriers = AND(compatible_carrier_stock, inscription_means)
pairing_pattern = OR(teacher_lesson, tested_original_pattern)
endpoint_access = AND(sender_access, receiver_agreement, code_agreement)
qi_service = OR(owned_charged_tokens, utility_contract)
```

Native boundary: Metal and processed wood are native stock foundations. There is no general wire, battery, endpoint or communication-network consumer established by this audit. Power unit is an abstract project part; no real chemical battery recipe is given.

People and institutions: Home: both endpoint operators or supported automation, route holders and a maintainer. Cultivation: inscription roles plus a receiving participant; utility keeper only on that energy branch. Reachable receiving means cannot be omitted.

World reactions, proposed: Home: supported market-news delivery can change observable prices only after messages actually arrive. Cultivation: sects may offer public relays or private service; route holders bargain over access. Messages are not omniscient world-state reads.

Useful intermediate returns and idle stop: An endpoint can serve local signaling before the regional link. Queue messages against actual endpoint capacity and service rights. Stop with a missing receiver/route/power reason.

Illustrative fictional cost: Home: 14 network credits and 6 project cycles. Cultivation: 8 relay credits and 2 endpoint accords.

## V29: Printing press

Target: copy known records at a useful rate; workshop; fixed machine.

**Home world: D=4, W=10, N=26.**

```roadmap
record_production = OR(movable_type_press, block_press)
movable_type_press = AND(press_frame, reusable_type, ink_stock, paper_supply, printer_means, record_consumer)
block_press = AND(press_frame, carved_block, ink_stock, paper_supply, printer_means, record_consumer)
press_frame = AND(processed_wood, metal_fittings, forming_means)
reusable_type = AND(precision_tools, type_design, metal_supply)
precision_tools = AND(gauge_access, toolmaker_means)
paper_supply = OR(papermaker_contract, local_sheet_work)
local_sheet_work = AND(fibre_stock, sheet_frame, drying_access, papermaking_knowledge)
carved_block = AND(processed_wood, carving_means, known_record)
```

**Reed Basin cultivation world: D=4, W=9, N=23.**

```roadmap
record_production = OR(ordinary_block_press, pattern_assisted_press)
ordinary_block_press = AND(traded_press_frame, carved_block, sheet_supply, ink_stock, record_consumer)
pattern_assisted_press = AND(press_frame, transfer_pattern, compatible_ink, sheet_supply, qi_service, record_consumer)
transfer_pattern = AND(inscription_knowledge, known_record, transfer_validation)
press_frame = AND(processed_wood, fitting_means)
sheet_supply = OR(papermaker_contract, spirit_sheet_work)
spirit_sheet_work = AND(identified_reed_stock, sheet_frame, drying_access)
carved_block = AND(processed_wood, carving_means, known_record)
```

Native boundary: Wood/metal and Literacy/book consumers N4/N11 are native foundations. Paper, ink, type, press, record-copy fidelity and dissemination are new. This graph expands V23 in context instead of claiming its new sheet method already exists.

People and institutions: Home: printer, toolmaker and papermaker roles; publication/adoption may add readers, distributors and local permissions beyond making a press. Cultivation: inscription/validation roles and sheet supply; a personal workshop can remain independent of a sect.

World reactions, proposed: Home: scribes may use the press for repeated text; access to records can spread literacy and disputes where authored. Cultivation: manuals become easier to circulate, but copied marks cannot grant a faculty, bound identity or power not conveyed by the original record.

Useful intermediate returns and idle stop: Block printing is a useful lower-precision alternative, not a forced preliminary tier. Sheets and reusable blocks pay off separately. Repeat runs stop on known record access, stock, storage or publisher decisions.

Illustrative fictional cost: Home: 10 workshop credits and 5 project cycles. Cultivation: 8 craft credits and 3 project cycles.

## V30: Gunpowder-class explosive

Target: release energy as an abstract bounded event; workshop scope; fictional device.

A burst artifact satisfies the energy-event class, not literal gunpowder. Under strict identity, use only the abstract local compound branch.

**Home world: D=4, W=6, N=18.**

```roadmap
abstract_explosive = OR(authored_supply_project, licensed_supply_contract)
authored_supply_project = AND(explosive_compound, abstract_workshop_capacity, handling_means, world_event_adapter)
explosive_compound = OR(qualified_abstract_supplier, fictional_material_project)
fictional_material_project = AND(authored_material_law, fictional_supply_budget, specialist_agreement)
abstract_workshop_capacity = AND(worksite_right, project_budget, trained_staff)
licensed_supply_contract = AND(qualified_abstract_supplier, service_agreement, world_event_adapter)
handling_means = OR(personal_qualified_means, specialist_service)
```

**Reed Basin cultivation world: D=4, W=6, N=18.**

```roadmap
abstract_explosive = OR(local_compound_project, fictional_burst_artifact)
local_compound_project = AND(explosive_compound, abstract_workshop_capacity, handling_means, world_event_adapter)
explosive_compound = OR(qualified_abstract_supplier, fictional_material_project)
fictional_material_project = AND(authored_material_law, fictional_supply_budget, specialist_agreement)
fictional_burst_artifact = AND(authored_burst_law, sect_artifact_contract, world_event_adapter)
sect_artifact_contract = AND(keeper_agreement, project_budget)
handling_means = OR(personal_qualified_means, specialist_service)
```

Native boundary: No native explosive-creation path is asserted. Only general assembly/project foundations N6/N8 are analogues. All compound, facility and handling nodes remain abstract. No constituent names, procedures, conditions or actual performance quantities are supplied.

People and institutions: Home: actual specialist/supplier agreements or equivalent personal means and a supported worksite. Cultivation: abstract workshop roles or artifact keeper; politics alters access but is not a universal prohibition.

World reactions, proposed: Home: a fictional public-works use may change a named blocked route; conspicuous use can attract guard or merchant attention. Cultivation: sects respond to trade, territorial damage or rivalry under authored relationships. Use is a consequential player decision, never an automatic idle trigger.

Useful intermediate returns and idle stop: Supply/access and a lawful event adapter are the payoff. Repeated projects require fresh fictional stock and retain custody; no recipe or detonation interaction is detailed.

Illustrative fictional cost: Home: 18 project credits and 6 abstract work cycles. Cultivation: 15 project credits and 2 patron favors. These numbers have no real material or energy correspondence.

## V31: Fission weapon

Target: obtain a supported fictional fission-class world-event capability; civilizational scope; abstract device.

**Home world: D=9, W=7, N=37.**

```roadmap
fission_weapon = OR(civilization_project, retained_relic_project)
civilization_project = AND(fissile_material, abstract_device_program, institutional_continuity, world_event_adapter)
fissile_material = OR(qualified_abstract_supplier, enrichment_facility)
enrichment_facility = AND(industrial_capacity, expert_institution, fictional_resource_program)
industrial_capacity = AND(power_service, precision_industry, regional_logistics)
power_service = AND(energy_institution, funded_network)
precision_industry = AND(toolmaking_sector, standards_service, trained_workforce)
toolmaking_sector = AND(foundry_sector, machinery_sector)
machinery_sector = AND(engineering_school, prototype_workshops)
prototype_workshops = AND(existing_craft_means, capital_agreements)
abstract_device_program = AND(qualified_research_team, fictional_review, secured_project_access)
institutional_continuity = OR(long_lived_organizer_means, successor_institutions)
successor_institutions = AND(archives, training_program, funded_succession)
retained_relic_project = AND(authored_fission_relic, accountable_custody, abstract_restoration_service, world_event_adapter)
```

**Reed Basin cultivation world: D=9, W=8, N=38.**

```roadmap
fission_weapon = OR(sect_industrial_project, imported_fission_relic_project)
sect_industrial_project = AND(fissile_material, abstract_device_program, institutional_continuity, world_event_adapter)
fissile_material = OR(qualified_abstract_importer, abstract_enrichment_facility)
abstract_enrichment_facility = AND(industrial_capacity, expert_institution, fictional_resource_program)
industrial_capacity = AND(qi_power_service, precision_industry, regional_logistics)
qi_power_service = AND(compatible_energy_law, funded_supply_contract)
precision_industry = AND(toolmaking_sector, standards_service, trained_workforce)
toolmaking_sector = AND(foundry_sector, machinery_sector)
machinery_sector = AND(engineering_school, prototype_workshops)
prototype_workshops = OR(personal_exceptional_means, sect_workshop_agreements)
abstract_device_program = AND(qualified_research_team, fictional_review, secured_project_access)
institutional_continuity = OR(earned_long_life, successor_institutions)
successor_institutions = AND(archives, training_program, funded_succession)
imported_fission_relic_project = AND(authored_fission_relic, working_carrier, local_compatibility_review, accountable_custody, world_event_adapter)
```

Native boundary: Everything beyond general craft/project precedents is proposed. The home-world relic is an explicit optional authored premise, not discovered native content. Both relics must be labelled fictional fission-class devices; a mana blast cannot satisfy that literal target. No real weapon design, internal mechanisms, material quantities, facility procedures or operating conditions appear.

People and institutions: Home: research, energy, industrial, standards, logistics, education and continuity roles, or genuine exceptional means that satisfy them. Cultivation: compatible qi power changes one service branch; it does not grant nuclear expertise. Industrial and transport agreements remain actual costs. Long life can replace succession, not missing capacity.

World reactions, proposed: Home: major patrons and neighboring powers may bargain, sponsor, investigate or react to a demonstrated world event. Cultivation: sect alliances and local watchers respond only to authored observable disturbances. Acquisition, custody and any use are distinct; use waits for player direction.

Useful intermediate returns and idle stop: Foundries, schools, standards and supply networks must have independent useful consumers while the final project remains incomplete. The visible graph is a compressed institutional horizon, not a complete scientific roadmap. Never expand dangerous nodes into technical details.

Illustrative fictional cost: Home: 100 civilization credits, 12 institution accords and 20 abstract project cycles. Cultivation: 80 civilization credits, 8 sect accords and 16 abstract project cycles. Fictional balances have no real-world yield or time correspondence.

## V33: What a roadmap queue must account for

One ordinary chosen batch may run idle on the selected world's supported clock. Reserve its concrete input batch, worksite capacity and retained tools when admitted; planning and preview alone spend nothing. A shared intermediate can serve several future goals, but its stock cannot be spent twice. A machine supplied by a contract remains usable only within actual service access; personal exceptional means can genuinely remove that requirement.

The paper, lamp, gauge and press cases deliberately reuse glass, wood and sheet capabilities. The home-world native glass recipe is an incumbent shortcut; already learned/unlocked means collapse those nodes rather than forcing another research bar. The queued path still checks actual stock and tool custody. For an example merged lamp-plus-instrument, V19 retains both output consumers and a checked shared housing.

A public service requires actual recipients and supported distribution. A clinic node is not an automatic world-health bonus, a telegraph is not an omniscient price feed, and a press cannot copy an unknown or sealed record. Research progress, supply completion, ownership, installed operation and adoption stay distinct. Work can retain an independently useful partial output, change goal or cancel under its declared return policy. Those choices need no fixed once-only invention limit.

For abstract dangerous targets, unattended work may advance the selected fictional resource and institutional project. Acquisition and custody do not authorize triggering a world event. Surface the consequential use decision to the player; never expand an opaque node into real instructions. Check changed access, receivers and world reactions at meaningful boundaries, rather than rerunning a whole planner or calling an LLM per idle tick.

