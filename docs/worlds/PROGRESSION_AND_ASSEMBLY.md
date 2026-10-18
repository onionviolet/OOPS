# Progression paths, modules and assemblies

Status: campaign-scale design contract v2, 2026-10-03. Owner: master GM. Requested direction: deepen each world across training, technology, suits and attachments, magical/ordinary crafting, local lore, parallel histories, and finer module/tier granularity. This is an authoring proposal. No component runtime or new gameplay is claimed.

## Shared contract for world GMs

Expand local design through a `CAMPAIGN.md` owned by that world's GM. `WORLD_BRIEF.md` remains the entry/summary/checkpoint owner, linking the campaign dossier rather than duplicating it. `GM_PROMPT.md` inherits the expanded assignment. `IMPLEMENTATION_PACKET.md` remains staged build scope/evidence, separate from the campaign's fiction. Read [campaign framework](CAMPAIGN_FRAMEWORK.md) for continuity, plot, transfer and loss boundaries.

The first playable milestone sequences code; it does not restrict design depth. Develop each world as a campaign with local life, multiple progression routes, regional institutions, characters, conflicts, discoveries and mature paths. Follow source lore for actual setting rules and prerequisites. Mark original extensions, inferred adaptations and unverified details beside their use. A remembered future is a belief until current evidence confirms it.

### Progression dimensions

| Dimension | What changes | Why it stays separate |
|---|---|---|
| Training / mastery | Precision, control, efficiency, combinations and new techniques | Owning excellent equipment does not teach its use |
| Structural tier | Architecture, supported functions, capacity or material compatibility | A different chassis can enable a function practice alone cannot supply |
| Quality | How well a particular specimen was made | A precisely made ordinary part can outperform a damaged advanced part in its suitable task |
| Condition | Wear, wounds, contamination, calibration and stability | Repairs restore retained capabilities, rather than replaying acquisition |
| Source / body | Actual organ, lineage, soul, implant, pact or equipment ownership | Knowledge is not possession or physiological compatibility |
| Institution / rank | Access, authority, duties, legitimacy and collaborators | Social rank is not a guaranteed combat-power measurement |
| Research / recipes | Known method, tested hypotheses, source evidence and design permissions | Reading a blueprint does not create its ingredients or validate it locally |

### Proposed module record

Each local module names stable ID/revision, source/version boundary, type, owner/body/assembly binding, material or acquired source, tier track, functions, inputs/outputs, requirements, compatibility, mounting/interface, active costs, idle/upkeep policy, known failure modes, inspection evidence, repair, upgrade/downgrade, salvage and portability. These are proposed records, not current save fields.

A **tier** must open/change a function, operating envelope or integration possibility. A level within that tier may tune efficiency, precision or capacity. Grade/rarity, tier, quality, condition and mastery are different dimensions; by default a globally labelled T3 has no automatic lore equivalence; verse equalization is the dial that adds one. Do not impose a universal highest tier, slot count or one breakthrough ritual on all worlds. Canonical stages require actual evidence, and source-specific prerequisites remain real.

### Campaign delivery criteria

For each world develop at least six regional/institutional contexts, early/middle/mature campaign play, five materially distinct progression paths where lore supports them, three worked builds, and a module catalogue with local tier changes. Include bodily/training, equipment/artifice and an ordinary craft/support/institution route. The same numbered tiers need not fit every path.

Three worked builds: a resource-poor specialist, a developed field build, and a high-capability project with genuine logistics or local authority. Show their components/techniques, dependencies, inputs, resulting actions, weaknesses and tradeoffs. A cheap build needs useful play; a mature build should really surpass lower threats. Some acquired variants can simply be superior without a forced lower-tier niche, per the [ability-family contract](ABILITY_AUTHORING.md). Include at least one multi-component assembly (suit, puppet, warded outfit, construct, workshop or spiritual tool) when supported by the world's lore; do not invent lore-compatible suit technology merely to satisfy a template.

Every campaign needs recurrent original people and source-verified canon anchors, paid everyday production/research, a medium institution/site project and several long arcs. Show combat, craft, exploration and social alternatives where they fit. Include independent enemies/rivals with their own progression and finite means; extreme failure need not guarantee recovery. Eras/parallel instances change actors, institutions and opportunities, not just names and dates.

Use at least eight clearly identified modules/components or technique families per world and locally meaningful stages for the central ones. Do not inflate an ability list into a second scripture or claim a complete canon catalogue. This is a full campaign architecture and worked content dossier, not every possible quest or line of the source.

## Capacity and ownership boundaries

Assemblies respect physical/ritual interfaces, weight, space, power/energy, heat/strain, response/control, durability, range, material support and authority as relevant. Local definitions choose actual channels and limits. A capability exists only when its required modules and support are operative. Replacing a module can remove a function while preserving unrelated training and possessions. An authority cannot be installed like a battery unless that source explicitly permits it.

One physical component has one owner/holder and one instance identity. Installation reserves the actual part; removal returns that part in its current condition, not a fresh copy. This protects the save; in-fiction duplication is a costed cheat or world law. An assembled inventory display may project child components but cannot create a second player inventory. Refit costs labor/materials and may require a safe facility; battle swapping needs an actual quick-change interface, not a free menu action.

Modern-looking technology is not automatically canon in Naruto, and ordinary craftsmanship cannot automatically manufacture a Bleach soul-bound release. Magical crafting can use substrates, inscription/control, anchors, fuel, seals, interfaces, protective housings and learned methods where the selected source supports them. Unsupported cross-world combinations are named original experiments with paid tests and explicit unknowns.

## Assembly graph and fine granularity

The proposed hierarchy is **career → discipline → technique/design → assembly → subsystem → component → material/inscription → tested function**. It is an authoring/dependency graph, not eight compulsory UI menus or a requirement that every power contains physical parts. A martial technique may have stance, breath, timing and perception dependencies; a soul-bound source may have no lawful removable component. Shared services retain one owner for knowledge, actual items, body, resources, time and effects.

Examples of meaningful detail:

| Layer | Technological example | Magical/artifice example | Training/institution example |
|---|---|---|---|
| Career | Field engineer / powered operator | Enchanter / construct keeper | Martial scout / healer / academy researcher |
| Discipline | Actuation, shielding, sensing, power delivery | Substrate, pattern, anchoring, fuel and control | Balance, channel control, perception, instruction |
| Design | A lifting frame or sealed field suit | A hauling charm or directional ward | An interruption-safe stance or a reproducible treatment |
| Assembly | Actual owned chassis with installed parts | A warded outfit with compatible anchors | A learned method with prerequisites and applications |
| Subsystem | Arm actuators, thermal loop, sensor network | Left/right binding, reservoir, regulator | Footwork, breathing, timing and attention |
| Component | Motor, pump, lens, cable, plating | Inscription segment, focus, seal, vessel | A practiced motion, recognized cue or taught exercise |
| Material / method | Alloy, sealant, calibrated winding | Conductive medium, reagent, known pattern | Local teaching evidence, actual body support |
| Tested function | Lift this load for this duration | Protect this target from this mechanism | Execute in this circumstance with retained control |

### Definition, specimen and installed position

`moduleId + revision` identifies an author definition; `moduleInstanceId` identifies the actual acquired component/source; `assemblyInstanceId` identifies the actual composed object; `mountId` identifies its installation point. These remain proposed records. A fixed authored equipment variant can approximate a first proof; it is not a dynamically editable assembly system.

A useful component record includes these groups:

| Group | Proposed fields and rule |
|---|---|
| Identity | Definition/revision, instance ID, acquisition cause, provenance/source scope |
| Ownership | Owner, holder, installed location, loan/claim, transfer policy |
| Structure | Local tier track/stage, size/mass, material properties, connectors, permitted body/assembly |
| Operation | Functions, operating modes, input channels, output/capacity, range, cost, heat/strain, stopping policy |
| Skill/evidence | Required learned method/mastery, known blueprint versus tested design, local observations |
| State | Integrity/wear, calibration, charge/reserve, contamination, active/suppressed/failed status |
| Lifecycle | Build/refit/test/repair/removal/salvage costs, irreversible consumption and recoverable outputs |

A mount has a declared interface and physical or ritual capacity, rather than an automatic universal slot count. A component can require a second stabilizer or exclude an incompatible regulator. Two parts with the same rarity need not connect. A body-bound faculty is checked against its actual body/source and cannot be removed as inventory by renaming it a module.

### Tier tracks with distinct functions

The stages below are original authoring examples, not accepted balance or canonical cross-world ranks:

| Example track | Initial function | Developed architecture | Mature specialization | Further development |
|---|---|---|---|---|
| Actuation | Support one carried load slowly | Sustained multi-joint lifting with actual supply | Precision manipulation or impact recovery | Improved materials/control expand its real envelope |
| Sensor | Detect a nearby signal in one band | Calibrated identification and local mapping | Track an observed signature or filter interference | Wider evidence/countermeasure research, no free omniscience |
| Power supply | Finite portable charge | Stable operation and safe recovery | High draw or prolonged endurance under different costs | New source compatibility after paid tests |
| Ward anchor | Fix a known pattern to one substrate | Maintain protection during supported motion | Select a directional or area envelope | New material/target mechanisms require new understanding |
| Control technique | Execute a rehearsed movement | Correct a known disturbance while acting | Combine it with another paid method | Develop beyond a school's original method when supported |
| Workshop | Repair familiar parts with hand tools | Reproducible component fabrication | Calibrated production/research for uncommon systems | Institutions, supply chains and taught expertise enlarge scope |

Within a structural stage, mastery can reduce waste, improve precision or support harder applications. High mastery cannot create an absent catalyst or lineage. Higher structural stages do not erase mastery. A narrow low-stage lens may use less power or reveal a specific clue better than a heavy broad-spectrum suite; the upgrade decision should have an actual reason, not compulsory replacement every few levels.

### Operating budgets and compatibility

For an authored mode, sum only simultaneously used demand on the same supported channel, including declared startup draw. Sustained draw must fit current supply throughput; reserve bounds duration; available heat/strain capacity bounds exposure to high draw. Load/pressure/control/jurisdiction are different constraints. Calibrated values are local prototype numbers, not fictional franchise physics.

Illustrative engineering calculation: a proposed supply offers 8 draw units and 24 reserve units. Lifting demands 5, sensors 2 and a protection package 3. Lifting plus sensors fits at 7; running all three exceeds 8. A burst store can cover the extra draw only if its actual charge/interface/control and heat limits support that burst. Switching to a low-draw sensor may permit protection but reduces observed detail. Reserve spent and heat gained persist through the actual action. This example is neither Fallout canon nor an implemented formula.

Illustrative artifice constraint: one reservoir supports a measured protection output, while an inscription directs it and an anchor determines the target. Improving the reservoir does not improve a damaged anchor's ability to keep the target bound. Adding a second ward may conflict with the first pattern, require a new regulator, or work perfectly after tested integration. A resistance or immunity actually supplied by the completed design should work; do not negate it merely to preserve difficulty.

An assembly preview reports only known functions/budgets and identified incompatibilities. Unknown materials/designs can show incomplete validation. Accepting a paid experiment freezes its test conditions and possible outcome; inspection/preview does not consume material or reroll failure. A failed test leaves actual spent inputs, damaged or recoverable parts and observed evidence under its declared policy.

### Crafting, fitting and persistent returns

Craft chains can join gathering, material preparation, design learning, prototype construction, fitting, calibration, load test, use, maintenance and refinement. Each phase must add a decision or useful evidence. Do not require nine identical timers for every rope. Known repeatable safe work can batch under capacity/input/stop rules; novel integration or dangerous trials use active decisions and declared risk.

Ordinary examples: cook a mixture that makes long workshop work viable; tailor a lining that separates a hot component from skin; grind a lens whose calibration makes a new sensor useful; make a seal that survives a local contaminant; maintain a forge, clinic or training site. These can support extraordinary progression without becoming another mandatory daily attendance meter.

Prototype replacement example: buy a damaged actuator, learn its fitting method, supply the workshop with repair stock, test it on an unloaded frame, then install it. Its original acquisition and repaired condition remain. Upgrading the power supply can enable longer lifts; an uncalibrated controller may still fail precision work. Removing it returns the same worn/repaired unit. Selling a loaned part is forbidden by custody; salvage consumes the actual unit and returns only the declared recoverable stock once.

### Builds, access and presentation

Support multiple loadouts under an actual owned-parts set, safe refit places and labor time. A saved loadout is a plan, not a duplicate inventory. A worker can schedule repair on one owned part while another remains installed; it cannot repair and consume the same unit simultaneously. A locked institution may permit fabrication after standing/training or through another legitimate service, not merely a level gate.

Use the original equipment/inventory/location interfaces when implemented. A summary shows usable functions and known constraints; expandable inspection shows the assembly graph, relevant budgets, material condition, dependencies and possible refits. Tier changes advertise the new action. Expose no engine IDs, unseen enemy builds, frozen future failures or unexplained metaphysical secrets through player-facing labels.

### Inspected engine fit and missing assembly delivery

Existing `power_models.js` design/investment/practice models can check selected functional capacity and local paid output. Current commands/effects, native inventory staging, equipment transactions, custody, jobs, sites, knowledge and save-before-publication are foundations. Current typed formulas resolve scalar facts and bounded arithmetic; they do not implement an arbitrary graph solver, thermal simulation or dynamic component instance inventory.

Missing deliverable: validated nested component identity/ownership/installation, model-specific material/channel compatibility, effective native equipment publication, safe refit/repair/salvage transactions, durable mode budgets/failures, inspected-known graph projection and migration/import rules. One writer must integrate these with the existing owners. Fixed item variants remain a possible first proof, explicitly limited to their authored functions.

Future proof: two loadouts made from the same finite owned set, one meaningful new module tier, a failed incompatible installation with no spend, one paid calibration, a mode constrained by real power/support, and a removal/salvage/reload sequence with no duplicated parts. Worlds supply different local mechanisms through the same durable services. Unit/source checks alone cannot establish visible equipment behavior; rebuild/browser/save verification belongs to its actual implementation.

## Review and checkpoint

Root owns shared design and final integration. Specialist roles owned exact named files in five local folders, rather than entire directories. All five authorized local specialist chats are completed; no leaf workers, runtime edits, private-save writes, bundles, commits or publication were assigned. PROJECT owns current identifiers/status and the next gate. This contract no longer carries a copied active-worker queue.

The five deep-world folders each retain WORLD_BRIEF (entry/resume), CAMPAIGN (local careers/story), MODULE_CATALOGUE (53 families across five worlds, local tiers/loadouts/assemblies), SOURCE_LEDGER (evidence/limits), ABILITY_VARIANTS (source/function comparisons), INTERACTIONS (situation/reaction/choice briefs), GM_PROMPT and IMPLEMENTATION_PACKET. Owners link shared rules rather than copy their tables.

Completed module delivery has 15 loadouts and five assemblies with paid craft/refit chains. Source-ID and Naruto one-shot scope findings were repaired; numbers, installed graphs and outcomes remain authored proposals. Master checks the combined docs in [framework review](CAMPAIGN_FRAMEWORK.md#expanded-design-review-2026-10-03). This is not runtime assembly or browser/save evidence.

Latest breadth is retained in [origins/timelines](ORIGINS_AND_WORLD_TIMELINES.md) and [multiverse scope](MULTIVERSE_STRUCTURES.md). Next engineering gate is the integrator-owned nested component/native projection/compatibility proof above, sequenced with the current native-world gate where required. One ordinary refit can be built without declaring every setting or conceptual function implemented. Final fiction, numbers and game-feel acceptance remain pending.

## GW3 useful progression across approaches, 2026-10-15

[Wider pass](../gm/DIRECTION_DETAILS_REVIEW_2026-10-15.md#wider-gameplay-and-world-design-pass-2026-10-15)
reuses the existing progression dimensions and accepted expansion/balance guidance.
**Proposed selected-content check:** name the actual new control/procedure/target,
capacity, bodily function or access produced by an improvement, and show its real
consumer. Compare two supported approaches to a useful objective by preparation,
time, supplies, information and aftermath, not forced equal damage/reward. Craft,
research/social routes need their own useful execution rather than only fighter
discounts. Earned power can trivialize an older obstacle; no automatic level matching.
Social rank, item quality, condition, body/source and learned mastery stay distinct.
No universal power formula, numeric target, new progression currency, selected
world or runtime work follows. Evidence/feel comes from the authorized slice.

## GW3 Cyoria worked comparison, 2026-10-15

The [Cyoria specimen](mother-of-learning/GW1_GW3_LOCAL_RULE_AND_APPROACHES_2026-10-15.md)
compares prepared device mastery with evidence-led willing specialist help through
the same existing objective. Neither turns retained knowledge into unearned
personal casting. Device control has actual consumers; collaboration changes which
actor can perform the needed work using real means. No new social XP/party system
or equal-reward formula is needed for the contrast. Compare total preparation as
well as marginal field costs and later reusable utility before tuning values.
This is a source/design comparison, not accepted final balance or gameplay proof.


## GW3 preparation-to-maturity follow-through, 2026-10-15

[Cyoria full comparison](mother-of-learning/GW1_GW3_LOCAL_RULE_AND_APPROACHES_2026-10-15.md#full-preparation-later-reuse-and-helper-availability-2026-10-15)
finds that useful early collaboration does not yet establish independent mature
research: both routes can deliver an observed account, but current notebook and
repeatable research gates require a tested lamp. Treat independent non-device
maturity as a later scope proposal, not implemented progress or an accepted need
to merge every career. Also distinguish persistent mastery/owned tool from finite
charge and service claims. Compare actual recurring consumers before claiming
setup pays back. No equal-reward formula, new XP or current runtime work selected.
