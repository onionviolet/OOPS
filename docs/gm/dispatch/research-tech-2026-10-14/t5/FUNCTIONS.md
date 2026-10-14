# T5 function vocabulary and native fit

2026-10-14. Proposed vocabulary, magnitude descriptors and forms extending PI1/PI6. This is a bounded source inspection, not an implementation specification or gameplay proof. Names below denote desired behavior; they grant no action, recipe or hidden knowledge.

## Native anchors inspected today

All locators refer to the current dirty checkout. A station's category/tier supports existing recipe calculations; it is not proof of a temperature-controlled furnace, chemical laboratory or arbitrary engineering capability.

| Anchor | Verified source foundation | Boundaries |
|---|---|---|
| N1 | Woodcutting, Mining, Herbalism: `src/data/skills.js:1955`, `:1965`, `:1985`; [skill definitions](../../../../../src/data/skills.js#L1955) | Names and native skills exist; target-specific acquisition must be checked |
| N2 | Crafting ID displayed as Tinkering, Smelting, Forging, Cooking, Alchemy, Butchering, Woodworking: `src/data/skills.js:2155`, `:2167`, `:2180`, `:2200`, `:2208`, `:2216`, `:2243`; [definitions](../../../../../src/data/skills.js#L2155) | Do not invent Engineering or Chemistry as existing native skill IDs |
| N3 | Village category tiers at `src/data/locations.js:381`; locked Swampland workhuts at `:1715`; cooking-only camp at `:1429`; [Village](../../../../../src/data/locations.js#L381) | Access and recipe unlock are separate; tier does not imply all apparatus |
| N4 | Ore, coal, wood, sap, wool, silica sand, flax, ingot and cloth templates: `src/items.js:1740`, `:1770`, `:1783`, `:1840`, `:1851`, `:1856`, `:1862`, `:3944`, `:4079`; [materials](../../../../../src/items.js#L1740) | Native material types are categories, not quantitative property vectors |
| N5 | Existing wood processing, cloth, charcoal, potash and raw glass recipes: `src/crafting_recipes.js:1248`, `:1079`, `:1323`, `:1434`, `:1223`; [glass recipe](../../../../../src/crafting_recipes.js#L1223) | Some start locked. These are game abstractions, not real chemistry instructions |
| N6 | Metal/wood component recipes and component-weighted assembly: `src/crafting_recipes.js:451`, `:555`, `:376`; [aggregation](../../../../../src/crafting_recipes.js#L376) | Existing equipment composition does not establish arbitrary connectors or machines |
| N7 | Glass phial/bottle recipes and templates: `src/crafting_recipes.js:1106`, `:1117`; `src/items.js:1507`, `:1512`; [carriers](../../../../../src/items.js#L1507) | Static carrier items do not implement general fluid volume or contents |
| N8 | Shared field workshop, specialist contributions and survey-kit work: `src/field_workshop.js:21`, `:25`, `:82`, `:89`; [workshop](../../../../../src/field_workshop.js#L21) | Particular stocked jobs and energy means, not arbitrary machine production |
| N9 | Stamped measurement qualification: `src/world_completion_materials_facts.js:40`; [facts](../../../../../src/world_completion_materials_facts.js#L40) | Specific sample/cause/body checks, not a universal thermometer |
| N10 | Drying rack and drafting bench phases: `src/home_furnishing_content.js:40`, `:50`; [fixtures](../../../../../src/home_furnishing_content.js#L40) | Fixed jobs have their own rights, workshop and notebook prerequisites; no generic drying lab |
| N11 | Literacy, timed books and native reading: `src/data/skills.js:2539`; `src/items.js:1414`; `src/main.js:2872`; [reading](../../../../../src/main.js#L2872) | Reading is supported; arbitrary writing, duplication or computation is not established |
| N12 | Native use/effect application: `src/main.js:4710`, `:4843`; item restoration branches: `src/items.js:1218`; [use](../../../../../src/main.js#L4710) | Dynamic product behavior/identity needs a compatible consumer and restoration adapter |
| N13 | Native coin repair transaction: `src/absorb_e2/durability.js:133`; [repair](../../../../../src/absorb_e2/durability.js#L133) | Particular optional equipment-condition repair, not general machine maintenance |

## V16: 33 function verbs

The native column maps proposed methods to inspected skill/material/station anchors. **Existing analogue** means only that the cited bounded behavior exists. **New consumer** means the function itself still needs selected behavior. A mapped skill never makes an unsupported physical process legal by itself.

| Verb | Target question | Native skill, materials and station mapping | Consumer status |
|---|---|---|---|
| clean | Remove a named kind of dirt from a surface? | Alchemy/Cooking N2; potash N5; Village N3 | New cleaning action; not automatic disease prevention |
| dry | Remove relevant moisture? | Woodworking N2; logs/offcuts and rack N10 | Existing specific offcut analogue; other substrates proposed |
| heat | Supply usable heat to a task? | Cooking/Smelting N2; wood/coal N4; Village/camp N3 | Existing cooking/smelting analogue; heat-source output adapter new |
| cool | Remove heat from a task or store? | Crafting N2; metal/cloth N4; Village N3 | New cooler and local thermal law |
| light | Illuminate a work area? | Crafting/Forging N2; glass N7, metal N4; Village N3 | New owned lamp/use effect; patrol kit text N11 is not general illumination |
| bind | Join materials under a load? | Woodworking/Crafting N2; sap/wood N4; Village N3 | New bond/interface consumer; sap's description supplies no strength value |
| cut | Separate a supported solid? | Forging/Woodworking N2; metal/wood components N6; Village N3 | Existing component/tool analogue; task-specific cutting adapter needed |
| shape | Give a material a supported form? | Woodworking/Forging/Crafting N2; processed wood N5, glass N7; Village N3 | Existing named outputs; arbitrary form grammar proposed |
| refine | Make stock fit a chosen role? | Smelting/Alchemy N2; ore/charcoal N4; Village N3 | Existing ingot/potash analogue; quantitative purity proposed |
| separate | Partition stock by an applicable property? | Alchemy N2; cloth N4, carrier N7; Village N3 | New partition/conservation consumer |
| extract | Recover a useful constituent? | Alchemy/Herbalism N1/N2; carrier N7; Village N3 | Existing authored-alchemy analogue only; full fraction resolver proposed |
| mix | Combine owned batches? | Alchemy/Cooking N2; carrier N7; Village N3 | Fixed recipe foundation N5; arbitrary batch composition proposed |
| coat | Apply a functional surface layer? | Alchemy/Crafting N2; sap/cloth N4; Village N3 | New surface/route consumer |
| insulate | Reduce transfer across an interface? | Crafting N2; wool cloth N4; Village N3 | Clothing analogue; electrical/thermal device law new |
| contain | Hold a named payload? | Crafting N2; glass carriers N7; Village N3 | Static carrier analogue; capacity/interface check new |
| store | Retain useful stock or energy? | Crafting/Woodworking N2; glass/wood N4/N7; workshop N8 | New storage target; field energy use is not an invented battery |
| move | Transport a thing or actor? | Crafting/Woodworking N2; frames N6; Village N3 | New crafted transport consumer |
| lift | Raise a supported load? | Forging/Crafting N2; metal/frames N6; Village N3 | New lift/interface consumer; no physics inferred from quality |
| pump | Move a fluid to an actual receiver? | Forging/Crafting N2; metal/glass N4/N7; Village N3 | New pump and receiver consumer; links J1 rather than claiming delivery |
| transmit | Deliver information to a recipient? | Crafting N2; metal/wood N4; Village N3 | New communication-network consumer |
| sense | Detect an observable difference? | Herbalism N1, Crafting N2; sample kit/workshop N8 | Existing bounded survey analogue; sensor responses new |
| measure | Establish a task-specific reading? | Crafting N2; stamped specimen N9; workshop N8 | Existing sample qualification analogue; scales/calibration new |
| record | Preserve a known observation? | Literacy N11; books N11; field observation N8 | Existing particular knowledge receipts; authored notebook-target adapter new |
| copy | Reproduce a supported record/design? | Literacy/Crafting N2/N11; paper proposed, wood N4; Village N3 | New record-copy/printing consumer; no copying hidden truth |
| compute | Transform known data by a supported rule? | Literacy/Crafting N2/N11; wood/metal N4; Village N3 | New calculation/device consumer; Literacy grants no computer |
| grow | Develop a lawful living product? | Herbalism N1; harvested flax N4; viable seed and garden station proposed | New planting/growth consumer; harvested stock does not certify viable seed |
| preserve | Extend a supported product's useful state? | Cooking N2; glass N7; Village/camp N3 | Existing food-preparation analogue; shelf-life/decay law new |
| heal | Improve a specified bodily condition? | Alchemy N2; existing carrier N7; Village N3; use N12 | Existing fixed recovery/effect analogue; antibiotic/infection response new |
| protect | Reduce a supported incoming harm? | Crafting/Forging N2; cloth/metal N4/N6; Village N3 | Existing equipment analogue; newly named defenses need an actual reader |
| release | Deliver stored energy as a declared event? | Forging/Crafting N2 and metal/components N4/N6 as fabrication analogues; new abstract facility | No native general release consumer established; PI9 abstraction mandatory |
| convert | Change an input into another useful kind of output? | Smelting/Crafting N2; metal/wood N4/N6; Village N3 | Existing material transformation analogue; heat-to-motion consumer new |
| assemble | Connect parts into a functional whole? | Crafting N2; components N6; workshop N8/Village N3 | Existing equipment/project analogue; general interfaces new |
| repair | Restore an owned object's supported function? | Native repair N13; Crafting/Forging N2 as proposed method roles; Village N3 | Existing optional equipment repair; machine spare-parts consumer new |

These are function IDs, not another set of XP skills. `heat`, `mix` and `shape` can be method operations as well as targets. Compiling a target must resolve each operation to a lawful existing action or a separately authored proposed adapter. There is no automatic `verb → skill level → success` rule.

## V17: Magnitude bands with local typed requirements

| Display band | Example | Binding requirements |
|---|---|---|
| Specimen | Read one sample; clean one tool | Substrate, method and required resolution |
| Personal | Portable light; one patient's care | Coverage, carrying form and duration |
| Household | Light a room; wash a household batch | Room/service coverage and replenishment |
| Workshop | Drive one installation; print a run | Output rate, precision and input/storage capacity |
| Settlement | Maintain a public service | Served population/receivers, distribution and staffing |
| Regional | Communication between settlements | Reach, uptime, endpoints and local standards |
| Civilizational | Reproduce a complex industry | Interacting supply systems, training and continuity |

Bands are display summaries, never universal level gates or effect ceilings. A precise specimen sensor can require more rare means than household lighting. Magnitude is a vector: `{worldLawRef, substrate, coverage, rate, duration, resolution, loadClass}` with only applicable axes present. Proposed symbolic local units may label qi service capacity. Ordinary magnitudes may later use real units under the generation contract's conversion rules. Dangerous/drug outputs use abstract fictional scope classes and costs only; no physical quantities are encoded in this research.

Example: `light(room, portable, sustained)` requires a supported receiver and replenishment route. Better native workmanship N6 is separate from coverage; multiplying quality cannot invent coverage. A world-specific power can satisfy a large demand directly without an artificial chain of lesser bands.

## V18: Form factors create interfaces, not free capabilities

| Form family | Proposed examples | Native starting point and gap |
|---|---|---|
| Carried material | Bar, sheet, thread, powder | Ingots/cloth N4/N5; new sheet/bar properties need reader |
| Consumable service carrier | Bar, vial, fictional treatment package | N7/N12; new use/identity/restore adapter |
| Surface application | Film, coating, printed mark | Sap/cloth N4; substrate binding and persistence new |
| Held implement | Tool, lamp, gauge | Components N6, kit N8; supported manipulation/reading new |
| Worn or fitted part | Protective layer, insert, connector | Equipment N6; new interface types need compatibility rules |
| Fixed installation | Rack, machine, press, sensor station | Particular fixtures N10; new installed function and access new |
| Distributed system | Communication line, school, clinic service | Actor/project precedent N8; endpoints, staff and receiver contracts new |

A lamp built as a fixture does not automatically become carryable. A living body's lawful sensing organ can replace an implement under its world/body contract; the verb remains `sense`. Source canon can require exact objects rather than generic profile substitution.

## V19: Combined functions need a shared-part check

For a lamp that also senses temperature, merge the two method graphs but retain separate light and measurement consumers. Share a housing only if both interfaces fit; reserve its actual capacity. Keep sensing unaffected by lamp operation unless a supported local law says otherwise. The actor may choose a larger housing, separate housings, another sensor or a genuine exceptional material. Do not silently double-count one energy payer or assume two individually feasible plans fit together.

PI6's generated name is observer-filtered metadata. The product records part roles, method/revision, installed interface and consumer IDs under P1/P8; its output remains stable when renamed. N12's existing decoder recognizes native IDs/components/quality, so arbitrary extra function fields cannot be promised to round-trip today. All broad behavior above remains proposed until selected adapters are implemented and exercised.
