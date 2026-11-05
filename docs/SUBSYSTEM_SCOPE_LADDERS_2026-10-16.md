# Subsystem scope ladders: fishing, farming, ranching and other activities

**Current rule owner, 2026-11-04:** Weibao requested that the activity/cross-world findings become rules. [ACR1–ACR14](ACTIVITY_ABSTRACTION_RULES.md), restated by AD52, now own those standing principles. [Bounded adoption](ACTIVITY_ABSTRACTION_RULES.md#source-findings-and-bounded-adoption) maps AC1–AC18, SI1–SI12, XC1–XC10 and XD1–XD8; their particular activities, examples, proposed fixtures and numeric choices remain conditional proposals. Earlier SSD ladders and historical evidence retain their own status. [Long-term playstyle ideas](research/GAMEPLAY_LOOPS_AND_WORLD_IDEAS_2026-10-26.md#long-term-playstyles-and-compressed-life-2026-11-04) are later proposals, outside this adoption.

**Related application, 2026-11-01:** [World slices, alternate starts and activity abstraction](reviews/WORLD_SLICE_EFFORT_AND_ABSTRACTION_2026-11-01.md#a1-abstract-routine-work-preserve-consequential-choices) applies MR18/MR29 and these proposed dials to routine investigation, study and rituals. It recommends summarized work with world-specific admission/results and consequential choices, records current code suppliers and gaps, and changes no ladder's status or build priority.

2026-10-16. **Planning only; every ladder, budget, register entry and first-slice
suggestion below is a proposal.** Weibao asked, after the Part 9 complexity pass:

> for like the part 9 complexity and scope stuff, send similar complexity scoping
> for subsystems and more? like for fishing, Farming, ranching, other possible
> actions and more?

This applies the [Part 9 complexity pass](gm/dispatch/ui-foundation-2026-10-15/next-parts/part-9-complexity-and-openness.md)
(people ladder P9Z23, impossible scopes P9Z30, accepted guardrails CX1–CX8) to
activities. It builds on these owners rather than replacing them:

- [Farming, building and hidden implementation cost](gm/dispatch/ui-foundation-2026-10-15/next-parts/IMPLEMENTATION_COMPLEXITY_REVIEW_2026-10-16.md) C1–C15
- Everyday paths research: [river keeper](research/everyday-paths-ui-2026-10-15/FISHING_PATH_PROPOSAL.md), [courtyard grower](research/everyday-paths-ui-2026-10-15/FARMING_PATH_PROPOSAL.md), [land and involvement](research/everyday-paths-ui-2026-10-15/LAND_AREA_AND_INVOLVEMENT_UI.md) LA2/NP1–NP5, [delegation](research/everyday-paths-ui-2026-10-15/FARMING_DELEGATION_DEEP_DIVE.md)
- [Activity surfaces](gm/dispatch/ui-foundation-2026-10-15/next-parts/activities.md) AV, MG01–MG10 in [LIFE_SIM_NORTH_STAR](LIFE_SIM_NORTH_STAR.md)
- [Making rules](MAKING_RULES.md) MR18 (depth per activity) and MR29 (shared envelope, separate product logic)
- [Gathering and resource uses](GATHERING_AND_RESOURCE_USES.md), [genetics and brood play](GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md) GN10
- Accepted direction: D2–D4 (whole paths, involvement chosen per activity and life, repeatable world principles) from the [representation discussion](gm/REPRESENTATION_DIRECTION_DISCUSSION_2026-10-15.md); AD5, AD13, AD16, AD27, AD33 in the [rules index](RULES_INDEX.md)

It selects no implementation and changes no priority. Codes use **SSD**.

Game examples come from general knowledge of how those games work, not from a
new decompile or source audit. Treat them as patterns, not citations. "Exists
now" rows are stated from current source paths; none was exercised in a browser
for this pass.

## Short answers

| Code | Question | Answer |
| --- | --- | --- |
| SSD1 | Do we simulate every fish, plant and animal? | **No, same answer as NPCs.** Things exist as pools and groups until a player choice needs a cohort or an individual. Cost scales with decisions the player can make, not with how many fish are in the river. |
| SSD2 | Are some subsystem scopes impossible? | Some literal versions are (real aquatic ecology in every river of every world, plant physiology per crop, full genetics for every sheep). Each has an achievable version that plays the same from the player's seat (SSD90). |
| SSD3 | One ladder for every subsystem? | **One set of six dials (SSD10), with each subsystem picking a rung per dial, per world and per slice.** The dials describe models, not a progression the player must climb. Involvement stays the player's choice (D2–D4). |
| SSD4 | Is depth the same as scale? | **No, separate axes.** One rare koi or one grafted spirit tree can be deep; a 200-acre wheat field can stay one row. Bigger operations summarize; favorite things zoom in (LA2). |
| SSD5 | What do the subsystems share? | One activity envelope (who, where, means, time, inputs, outputs, knowledge, stop reason) over separate product logic, the way MR29 handles making. Plus three cheap primitives: **pools, condition tags and promotion** (SSD71–SSD73). |

## How other games scope these systems

| Code | Game | Technique | What we take |
| --- | --- | --- | --- |
| SSD6a | Stardew Valley, Harvest Moon | Fish are location × season × weather × time tables plus a minigame. Crops are one tile each with daily watering. Animals are a handful of named individuals with friendship. | Condition tables are cheap breadth. The cost is clicks and chores, kept small by capping animals and land. |
| SSD6b | Melvor Idle, RuneScape | Skill-gated spots with loot tables; farming is a few plot timers. No populations. | The idle floor: one spot, one table, one timer. Our R0 rungs. |
| SSD6c | Dredge, Animal Crossing | Fish by zone and time of day; shadow size hints before the catch; a world-law twist (aberrations) layered on the same tables. | Cheap pre-catch information and world-law variants on a shared table. |
| SSD6d | RimWorld | Growing zones are areas with fertility and one crop; animals are individuals with taming and training. | Zone as the right farm unit. Individual animals get expensive at scale. |
| SSD6e | Dwarf Fortress | Every animal is an individual; famous slowdowns from breeding cats. | The counterexample for ranching: individuals without a cap. Same lesson as Shadows of Doubt for people (P9Z20). |
| SSD6f | Farming Simulator | Fields are polygons with states (plowed, sown, fertilized); the depth is machinery. | Field state as a few values, not per-plant simulation. |
| SSD6g | Amazing Cultivation Simulator, Immortal Life | A field plan is an intention carried out by workers; powers remove chores while keeping decisions. | Delegation and powers change who does the work, not what grows (already in the delegation research). |
| SSD6h | Mount & Blade, Kenshi | Herds and goods are counts on caravans and towns; a few named animals or leaders. | Named few, counted many, for animals too (P9Z12). |
| SSD6i | Pokémon, Monster Rancher | Genetics and training live on a small number of deep individuals. | Deep breeding works on a short list of named animals, not the whole herd. |
| SSD6j | Factorio, Satisfactory | Throughput is rates between buildings, not tracked items in transit when it can be avoided. | Production as rates for large operations; individual items only at custody boundaries. |

Common thread: **tables for breadth, pools for quantity, a few named things for
attachment, rates for scale, and conditions as shared inputs.**

## SSD10: the six dials

Every subsystem has the same six dials. Rungs are ordered by implementation and
save cost. They are interchangeable models or views for a task (LA2), not tiers
the player climbs. Different worlds can default to different rungs (P9Z84
density adjectives): a fishing-village world can start fishing at a higher Stock
rung than a desert world.

| Dial | R0 | R1 | R2 | R3 | R4 | Reason to climb |
| --- | --- | --- | --- | --- | --- | --- |
| **Space** | Activity at a location | Named spot (bank, plot, pen) | Zones with relationships (shallows and current seam; sunny and shaded beds; pasture rotation) | Spatial plan or coverage overlay | Specimen position | A choice consumes position or reach |
| **Stock** | Loot table, unlimited | Depletable count with regrowth | Pool per spot or group (fish stock, field group, herd size) | Cohorts with traits and age | Individuals | A choice targets a subgroup or one thing |
| **Time** | Result per action | Played-minute work periods | Stage clock (growth, gestation, curing) | Calendar, season, weather and day windows as conditions | Continuous ecological simulation | An outcome depends on when |
| **Actors** | Self | Tool or power does a chore (net overnight, spirit rain) | One helper with an instruction | Staffed operation | Institutions and market actors | The player wants to stop doing a chore (D2–D4) |
| **Knowledge** | Known table | Observed conditions | Hypothesis and discovery with a repeatable cause (MR formulas as attractors) | Research tradition, records | Teaching others, spreading methods | A hidden rule changes a decision |
| **Consumers** | Fixed sale | Local saturation | Orders, contracts, household needs | Regional prices and supply chains | Cross-world trade (AD27) | Outputs pile up with nowhere useful to go |

**SSD11, climb one dial per step** (C5, CX7) and only for a named choice (CX1).
**SSD12, keep a rung the player relied on;** a named animal stays named, a
discovered fish run stays known (mirrors P9Z23). **SSD13, switching view does not
reroll, split stock or reset timers** (LA2). **SSD14, the Stock dial for people is
the P9Z23 ladder;** animals, plants and fish use the same promotion contract.

## SSD20: fishing

**Exists now (stated):** a `fishing` gathering activity with the Fishing skill
and a `fishing_pole` tool in `src/activities.js`; four location registrations in
`src/data/locations.js` (river, river rapids, two lakes); `src/weather.js` for
conditions. Proposed paths: river keeper RF1–RF5, LA3.

| Dial | Proposed first rung | Deeper, when earned | Reopen trigger |
| --- | --- | --- | --- |
| Space | R1–R2: named spot with two or three water features (shallows, current seam, cover) | R3 local diagram when reach matters (boat, net, casting power) | A tool or power has different reach |
| Stock | R2: pool per species group per spot, with regrowth | R3 seasonal runs as calendar entries on a route; R4 for named trophies and legends | Overfishing or a seasonal run changes where to fish |
| Time | R1–R3: work periods with time-of-day and season windows | Weather as a condition tag | Two windows give different catches |
| Actors | R0 self, R1 net or trap left overnight | R2 boat crew, R3 fleet (MG05 shipping) | Player repeats a routine and asks to hand it off |
| Knowledge | R1 observed conditions ("they rise at dusk here") | R2 discovery with a repeatable cause (RF4); R4 teaching | A hidden rule changes where or how to fish |
| Consumers | R0–R1 sell or cook | R2 kitchen and household demand; preservation through making | Catch saturates the local buyer |

**Depth style (MR18):** quick repeats a recorded method; guided picks bait, spot
and window; deep adds a hands-on read of the water. Default: no reflex minigame,
because the format is idle and text. Dial: a world or cheat can add timing play
with a reason, and the quick route still reaches the same catch.

**Budget (CX5, proposal):** about eight species groups per spot; pools update
on visit or catch-up, not on a tick; regrowth computed in closed form over away
time.

## SSD30: farming

**Exists now (stated):** `harvesting` (items) and fieldwork (money) both use the
Farming skill in `src/activities.js`; the MG06 one-plot crop flow in
`src/management/shipping_farming.js` (rent a plot, greens or grain, plant, tend,
explicit growth by played minutes, harvest once; per review F2);
`src/world_completion_crop_clock.js`; `src/systems_irrigation_model.js` (a
bounded proposal model, not native stock); `src/world_calendar.js`,
`src/world_climate.js`. Proposed path: courtyard grower CG1–CG5.

| Dial | Proposed first rung | Deeper, when earned | Reopen trigger |
| --- | --- | --- | --- |
| Space | R1: named capacity unit (current MG06 plot) | R2 area and crop groups, then named beds with relationships (LA2); R3 coverage overlay for a device or power | Beds differ in sun, water or treatment |
| Stock | R2: crop group with one stage | R3 per-bed cohort with condition; R4 rare specimen, graft or spirit herb | A choice treats one bed or plant differently |
| Time | R2: stage clock with boundary-correct catch-up (C8, C9) | R3 season and weather as condition inputs; soil memory across years as one fertility value per bed | Two crops differ by season, or rotation gives a real choice |
| Actors | R0 self | R1 power removes a chore; R2 one helper chore; R3 staffed farm with a field plan as intention | A chore repeats enough to delegate |
| Knowledge | R0 crop card | R1 observed conditions; R2 crossbreeds and discoveries; R3 seed keeping as a tradition (GN10) | A hidden property changes what to plant |
| Consumers | R0–R1 sell or cook | R2 household food, festival orders (MG09); R3 regional supply | Harvests outgrow local use |

**Default on neglect (C12):** neglect delays growth rather than destroying the
crop. Dial: harsher worlds or optional settings can wilt crops, with the cause
shown beforehand. Reason: farming should not become a daily chore tax on an
idle player.

**Budget (proposal):** bed condition as two or three values (moisture,
fertility, a pest tag); no per-plant state below R4.

## SSD40: ranching and animal husbandry

**Exists now (stated):** `animal care` with the Animal handling skill in
`src/activities.js`; the LP4 meadow pen with fleece sheep in
`src/habitat_care.js`, which projects time lazily so rendering or reloading never
grants stock and leaves the native calendar and inventory authoritative.
Related owners: companions and familiars, GN10 breeding.

The key move is a **hybrid herd: named few, counted many.** A flock of forty sheep
is one count plus traits as a spread, and three named animals the player cares
about (breeding ram, old lead ewe, the lamb they rescued).

| Dial | Proposed first rung | Deeper, when earned | Reopen trigger |
| --- | --- | --- | --- |
| Space | R1: pen as a named site (LP4) | R2 pasture zones with rotation; barns and coops as capabilities; herd routes on the place graph (transhumance) | Grazing location changes yield or health |
| Stock | R2: herd count with product rate | R3 cohorts by age and sex with trait spread; R4 named animals (breeding stock, mounts, favorites, monsters) | Player names, breeds, rides or trains one |
| Time | R2: product cycles (daily milk or eggs, seasonal shearing) | R3 life cycle (birth, maturity, age, death); breeding generations | A product or choice depends on age |
| Actors | R0 self | R1 dog or power helps; R2 hired herder; R3 ranch staff | Herd size makes care a chore |
| Knowledge | R0 species card | R1 temperament and health observations; R2 heritability as a world law; R3 stud book | A breeding goal exists |
| Consumers | R0–R1 products sold or used | R2 household and contracts; R3 breeding sales and markets | Products outgrow local use |

**Stakes to account for:** animals carry emotional weight. Default: slaughter is
optional and shown, with tone set per world; disease and predators arrive as
events with causes (AD25), not as a running epidemiology or predator simulation.
Nonhuman starts (AD13) can flip the frame: a wolf start herds nothing and hunts
the herd.

**Budget (proposal):** named animals capped per holding (a per-world adjective,
starting around a dozen); herd counts uncapped because they cost a few numbers.
By default, full genetics (GN codes) apply to named breeding stock; a breeding-focused world can lower that threshold.

## SSD50: other actions, compact

Same dials, shown as default first rung and achievable depth. "Impossible as
stated" means not achievable at acceptable cost by this project, not forbidden.

| Code | Subsystem | Exists now (stated) | Proposed first rung | Achievable depth | Impossible as stated | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| SSD51 | Foraging, herbalism | Herbalism gathering with sickle; `lunar_gathering` training | Named patches as regrowing pools by season | Property discovery (MR), rare finds as specimens | Botanical ecology | [Gathering](GATHERING_AND_RESOURCE_USES.md), [wandering](WANDERING_ZONES_AND_INSIGHT.md) |
| SSD52 | Hunting, trapping | `src/harvest.js` wolf-rat slice (pure plans) | Game as encounter tables plus a zone pool; traps as overnight tool chores | Tracking as knowledge (signs to hypothesis), zone pressure from overhunting | Predator-prey simulation | Gathering; native combat |
| SSD53 | Mining, quarrying | Mining (pickaxe) and digging (shovel) gathering | Site with finite seams as counts plus discovery | Veins as authored depth layers in the site model | Voxel geology | [SR1–SR24](SITE_AND_EXPLORATION_RULES.md) |
| SSD54 | Woodcutting, forestry | Woodcutting (axe); north-star Forester branch | Stand as a regrowing pool | Stand age cohorts, replanting, forest health as a value | Individual trees on a map | Gathering |
| SSD55 | Bees, silkworms, gu and other small husbandry | None found | Colony as one entity with health and yield | Queen or mother lines as named individuals | Per-insect simulation | Ranching model above; GN10 |
| SSD56 | Cooking, brewing, crafting, smithing | Craft engine, mixture system | MR18 quick, guided or deep | MR1–MR36 | Real chemistry | [Making rules](MAKING_RULES.md) |
| SSD57 | Building, construction | `src/site_projects.js`; home furnishing | Building as a capability change to a place | Rooms through authored adjacency (C2–C9) | Structural physics | [Complexity review](gm/dispatch/ui-foundation-2026-10-15/next-parts/IMPLEMENTATION_COMPLEXITY_REVIEW_2026-10-16.md) |
| SSD58 | Trade, shopkeeping | `src/exchange.js`, `src/market_saturation.js` (sold and recovered counts per market region) | Local saturation per item per market | Orders, contracts, arbitrage across worlds (AD27), MG03 shop | Price-equilibrium economy (P9Z36) | [Requests and markets](gm/dispatch/procgen-2026-10-13/p11/REQUESTS_AND_MARKETS.md) |
| SSD59 | Shipping, caravans | MG05 one-order manifest in `src/management/shipping_farming.js` | One manifest with a route quote | Several carriers, route risk events | Every cart simulated | MG05; [known routes](../src/known_routes.js) |
| SSD60 | Jobs, labor | Native JOB activities; `src/village_career.js` | Pay per work period | Workplace standing, promotion, relationships (Known rung) | A labor market | Village career; AD33 for NPC depth |
| SSD61 | Study, research, teaching | TRAINING activities, `src/skill_discovery.js`, lore practice | Skill XP plus discoveries | Research traditions, students as Known people | Simulated science | Skills owners; MR |
| SSD62 | Healing, medicine | Status care, field care | Condition to known or unknown treatment (G2) | Diagnosis as knowledge, remedies through making | Physiology simulation | [Granular systems](GRANULAR_SYSTEMS_AND_INTERACTIONS.md) |
| SSD63 | Home, household | Home furnishing; AD31 | Furniture bonuses | Household members as Known people | Household AI for everyone | AD31; AD33 |
| SSD64 | Cultivation, power training | Per-world power models | Training activity plus breakthrough conditions | Per-world pack rules | One universal power simulation | World packs, AD1 |
| SSD65 | Exploration, ruins, combat | Owned elsewhere | See owners | See owners | See owners | SR1–SR24, native combat |

Festivals (MG09), restoration and collections (MG10), auctions (MG04), lending
(MG08) and property (MG02) stay with their MG owners at their current later
status.

## SSD70: what the subsystems share

| Code | Shared idea | Disposition |
| --- | --- | --- |
| SSD71 | **Pools, not entities.** One small primitive (amount, cap, regrowth rate, condition modifiers) can describe fish stocks, forage patches, herd size, forest stands, seams and market saturation. Away time resolves in closed form. Inference: `market_saturation.js`'s sold and recovered counts are already a pool of this shape; check whether it can be the shared shape before writing a new one (CX2). | ACCOUNT FOR NOW |
| SSD72 | **Conditions as tags.** Season, weather, time of day, world laws (spirit density, cursed water) and cheat effects reach every subsystem through E4 tags. One drought rule affects crops, fish and pasture (CX3). | ACCOUNT FOR NOW |
| SSD73 | **Promotion.** Pool to cohort to individual when the player names, breeds, rides, trains or studies one; frozen on reveal (GR3). Same contract as P9Z23. | ACCOUNT FOR NOW |
| SSD74 | **Lazy catch-up.** Project elapsed time on read, as `habitat_care.js` does; settle across stage and condition boundaries (C8, C9). Away time runs chosen routines and stops at important choices (AD16). | ACCOUNT FOR NOW |
| SSD75 | **One activity envelope.** Actor, place, means (tool, power, skill, body), inputs, time model, actual outputs with custody, knowledge gained, stop reason. Current `JOB`/`TRAINING`/`GATHERING` classes and the AV12 card proposal are the seams. Bridge a demonstrated gap when a second consumer needs it; do not write a universal engine first (C4). | ACCOUNT FOR NOW |
| SSD76 | **Involvement apart from scale** (D2–D4, NP2). A hands-on pond and a staffed estate are both viable lives. | Already accepted direction |
| SSD77 | **Powers and cheats change dial values, not code paths.** A water-control power adds reach; talking to fish adds a knowledge source; a growth cheat scales a stage clock. | ACCOUNT FOR NOW |
| SSD78 | **Nonhuman bodies use the same envelope** with body means: a bear fishes by paw, a slime farms by absorbing (AD13). | ACCOUNT FOR NOW |
| SSD79 | **Per-world defaults per dial.** A world pack sets which subsystems exist and their starting rungs; an absent subsystem is honest absence, not a lock (CX6). | ACCOUNT FOR NOW, with the world pack loader |
| SSD80 | **Save cost lives in promotion.** Pools cost a few numbers per known spot; named things cost bytes. Store the delta, derive the rest (P9Y, P9Z82). | ACCOUNT FOR NOW |
| SSD81 | **Cross-subsystem links are where depth feels real**: manure feeds fields, fields feed herds, fish feed the kitchen, forests feed building. Add links one at a time with a declared input and output (P9L4), not as a full ecology by default; an ecology-themed world pack can dial that up with its own budget. | LATER, per slice |
| SSD82 | **UI:** the same activity card at every rung; deeper rungs open center views through the shared controller; checked at 1920×1080 (AD34, UI rules). | ACCOUNT FOR NOW |

## SSD90: impossible or unwise scopes and their achievable versions

| Code | Scope as stated | Why it fails | Achievable version |
| --- | --- | --- | --- |
| SSD91 | Real ecology (food webs, spawning, runoff) in every place of every world | Compute, balance and debugging grow with every link | Pools with regrowth and condition tags; seasonal runs as calendar entries |
| SSD92 | Every fish, plant and animal as an individual | Save size and catch-up time; nobody inspects most of them | Pools and cohorts; individuals on promotion (SSD73) |
| SSD93 | Full genetics on every herd animal | Pedigree bookkeeping across generations | Trait spread per herd; GN genetics on named breeding stock |
| SSD94 | Reflex minigames as the only route | Wrong for idle play; locks out quick involvement | MR18 depth styles; timing play as an optional dial |
| SSD95 | Mandatory daily care | Turns a life path into a chore tax | Neglect delays by default; delegation and powers remove chores |
| SSD96 | Price-equilibrium economy across goods and worlds | Every price affects every other | Local saturation, orders and arbitrage (AD27) |
| SSD97 | Factorio-scale automation for every product | Huge authoring and UI per chain | Rates for large operations; chains only where a slice uses them |
| SSD98 | Every subsystem at full depth in every world from day one | Authoring cost with no play yet (P9Z38) | Per-world default rungs; deepen where play goes (CX1) |
| SSD99 | All subsystems ticking in inactive worlds | Multiplies cost by world count (P9Z35) | Inactive worlds pause per accepted AD16 |

## SSD100: deferral register (CX8)

Seed entries; owners keep their own.

| Deferred | Reopen when |
| --- | --- |
| Fish runs and moving populations | A seasonal run would change where the player fishes |
| Crop seasons and weather effects | Two crops differ by when they are planted |
| Soil fertility and rotation | Two crops give a real rotation choice |
| Animal life cycle | The player breeds, or a product depends on age |
| Individual genetics beyond named stock | A named breeding goal slice exists (GN10) |
| Helpers and staffed operations | A chore repeats enough that the player asks to hand it off, and the helper's Known rung exists (AD33) |
| Regional markets | Outputs saturate local consumers in play |
| Spatial farm grid, pasture map, fishing diagram | A placement or reach choice exists |
| Timing minigames | A guided or deep style is selected for that activity (MR18) |
| Pest, disease and predator causes beyond events | An event version proves repetitive without causes |
| Cross-subsystem links | Two subsystems share a place and one's output changes the other's choice |
| Small husbandry (bees, silkworms, gu) | A world pack or start needs it |

## SSD110: possible first slices (proposal, no build order selected)

Each one climbs one dial from what exists, per SSD11:

- **Fishing:** one existing river spot with two water features and per-group pools (Space R2, Stock R2). NP3 already names this.
- **Farming:** MG06 plot with Farming skill integration and a boundary-correct stage clock (Time R2). NP3 names this too.
- **Ranching:** the LP4 meadow pen grows from one animal to a herd count plus one named animal (Stock R2 plus one R4).

These are alternatives, not a bundle. Current active work (UI on the R14
baseline, Part 9 planning, the world pack loader) keeps its place; one slice
finishes before the next starts (CX7).

## Dispositions

- **ACT NOW:** this palette saved; request recorded in USER_VISION; router row in the rules index.
- **ACCOUNT FOR NOW:** six dials SSD10 as vocabulary for any activity work; SSD11–SSD14 climbing rules; shared primitives SSD71–SSD75; per-world defaults SSD79; save cost in promotion SSD80.
- **LATER:** deferral register SSD100; cross-subsystem links SSD81; first slices SSD110 when Weibao picks a slice.

## Questions for Weibao

None required. Build order among SSD110 is open whenever a new gameplay slice is
chosen.


## Routine abstraction and effort reconciliation, 2026-11-04

Full content review of [world-slice F1/E1–E5/O1–O3/S1/A1](reviews/WORLD_SLICE_EFFORT_AND_ABSTRACTION_2026-11-01.md). SSD75 is the activity-envelope home; the report's search example and alternatives remain useful, while its hour/month bands are unbenchmarked historical judgments rather than present delivery estimates. No franchise ranking selects a new world or replaces LOTM-first (AD32/AD44).

The later [Nov 3 direction](USER_VISION.md#variance-abstraction-and-procedural-work-2026-11-03) resolves the earlier abstract-or-manual question: repeated stretches are abstracted, investigation is low priority and may use a progress bar, and variance fills what the source leaves unstated. SSD10/SSD75 retain a dial for consequential choices; a shared card shape is a presentation proposal, with AD46 preserving world/task differences.

Carry A1's causal distinctions into SSD75: the chosen source/method/worker and actual access determine what can be learned; committed costs and completed work determine the attributed result; notebook/access/next-action readers make that result useful. Repeating an exhausted source does not create a new true clue. A changed method may reveal new information by its actual mechanism. A progress bar supplies neither hidden knowledge nor missing resources.

Preserve A1's alternatives as conditions: closer play for a consequential interpretation/bargain, summarized work for a repeated stretch, and delegation when an actual worker and supported stopping policy exist. Interrupted access/support settles performed work and retained costs under the actual job owner. These are applicable design constraints, not a newly implemented investigation engine or a mandatory new scheduler. Reopen when the selected route needs that repeated activity; keep ordinary-life entry proof separate from the protagonist developer route.

## Activity compression audit: choices and interactions, 2026-11-04

### Scope, correction and authority

Weibao clarified: “I meant abstractions as in abstracting something like investigation into a progress bar type thing instead of somethign else?” He then requested: “Audit other areas of the worlds we can abstract like this, what choices should stay interesting, and subtle interactions we need to keep. Save and reconcile the audit accordingly.” This round answers that request. The earlier [world abstraction audit](reviews/WORLD_ABSTRACTION_AUDIT_2026-11-04.md) primarily inspected shared software boundaries; it remains a qualified historical technical review, not the main answer to activity compression.

This is a design audit and owner reconciliation, with targeted current-source inspection. AC1–AC18 and SI1–SI12 are local audit references, not new standing rules or an implementation queue. The activity designs below are **proposals under AD32**. The underlying direction to abstract repeated stretches, vary unstated facts and keep world/task differences comes from [Nov 3 USER_VISION](USER_VISION.md#variance-abstraction-and-procedural-work-2026-11-03), SSD10/SSD74–SSD76, MR18/MR29, AD6–8/16–18/38/44/46/49 and SLR5/12/26 at their owning status. No new accepted design, world selection, needs meter or milestone follows from saving this round.

Read against [BF95–BF109, especially “Where abstraction buys the most”](worlds/BOOK_WORLD_FEATURE_GAPS_2026-10-15.md#where-abstraction-buys-the-most) and the [lead-life long-routine procedure](LEAD_LIFE_GUIDE.md#10-lotm-first-ui-and-engine-implementation-procedure-2026-10-31). Those already cover broad families and support loss; this round adds concrete compressed units, choices, interacting causes and distinguishing checks instead of duplicating another family register. No new book reading or franchise-law claims; examples are authored design proposals.

### Working recommendation

Default to **choose a plan → resolve a stretch of routine work → intervene when a meaningful condition changes → receive a usable result**. A bar is suitable for bounded effort, a recurring order for upkeep, a batch for production and a route summary for travel. A process with unknown total effort may show elapsed effort and known coverage rather than a fictitious “percentage solved”.

Interesting choices change the likely result, actual cost, information, exposure, relationship or future options. Merely restarting the same safe action adds clicks. Preserve personality and world texture through concise concrete reports, occasional relevant observations and the option to inspect supported detail; those need not become mandatory dialogue or new decisions. Manual stages suit a new experiment, a consequential negotiation or tactical danger; policy-based delegation suits a player who wants to manage means and priorities rather than attend each step. These can coexist per activity and life. MR18's depth choice is a comfort setting: clicking more is not itself a better success modifier. A genuinely different method or intervention can change the outcome for its stated reason.

### Candidate activities, ordered by likely value of compression

The order expresses design fit and repetition burden, not readiness, measured effort or a change to LOTM-first. All rows retain world-specific resolution. “Preserve” means where the selected activity actually has that cause; it does not require adding every listed subsystem to every world.

| ID / existing family | Compressed unit | Choices that earn attention | Subtle consequence to preserve / proposed check |
|---|---|---|---|
| AC1 / SSD75, BF96, SLR5 | **Study and skill practice:** a supported study/practice block, optionally repeated under a budget | Topic, feedback source, exercise difficulty, teacher versus self-study, when to switch methods | Repetition can build fluency without new understanding; mistaken practice can reinforce error. Remove feedback midway: retain the learning actually earned, not a guaranteed full unlock. |
| AC2 / SSD56, MR18/MR29 | **Familiar crafting, cooking and brewing:** a batch or stable process stage | Materials, quality target, batch size, tool use, safety, experiment versus known recipe | Ingredients, fuel, tool use, spoilage and custody follow actual steps. Stop after consumption: do not restore burned fuel because the bar did not finish. A new recipe can merit guided decisions. |
| AC3 / SSD75, BF97/BF99 | **Paid work, commissions and service:** a shift or bounded client job | Employer/client, terms, effort, accepting more work, specialization, stopping policy | Work completed, quality, payment due and payment received differ. A missed deadline or absent client changes settlement by the terms; a completed work bar does not mint a wage without a payer. |
| AC4 / SSD74, BF99 | **Travel, errands and logistics:** a route leg with combined errands | Route, urgency, transport, companions, supplies, cargo and delivery priority | Time windows, fatigue, perishables, ownership and actual carried capacity matter. Delay one leg: recompute the remaining errands and missed meeting, retaining completed deliveries. |
| AC5 / SSD51–SSD54 | **Gathering, fishing, hunting and mining:** work period against a spot/pool | Location, window, tool, effort, target, depletion tolerance and danger policy | Yield draws, finite stock, regrowth, weight and processing uses remain connected. Doubling duration across a depleted seam cannot simply double its remaining stock. Tactical prey can leave routine resolution. |
| AC6 / SSD20–SSD55, SSD71–SSD74 | **Farming, husbandry and living-carrier care:** seasonal plan, cohort or recurring feeding order | Crop/stock mix, feed, breeding selection, reserves, helper assignment, named favorites | Drought, illness and food shortages act through their real effects; named individuals keep identity when grouped. Withdraw a food shipment: settle supported care rather than applying an estate-wide generic happiness tax. |
| AC7 / BF102, SSD75 | **Household provisioning, cleaning and maintenance:** recurring plan or bundled chores | Spending priorities, living arrangement, repair/replace, whom to care for | A home grants its actual storage/rest/work capabilities, not an invented universal needs meter. A repair competes for the same money/materials used elsewhere; settlement respects property rights. |
| AC8 / BF101, SLR12 | **Rest, healing and rehabilitation:** supported rest/treatment interval | Provider, treatment, expense, acceptable downtime and return to activity | Sleep, healing, recovery of expression and retained mastery differ. A finished treatment session need not cure the whole condition. Interrupt care or remove medicine: retain stage-specific progress and consequences. |
| AC9 / BF96, SSD75 | **Routine ritual preparation and power exercises:** qualified preparation/practice block | Target/question, means, source, resource budget and hazardous steps | Quiet preparation may compress; a material invocation or newly risky act can deserve a decision. A prepared setup is not the final effect, and an interrupted support source need not refund all expenditure. |
| AC10 / SSD58, ECR4/9/14 | **Shopping, trading and shopkeeping:** buy list, sales policy or actual order batch | Price limits, quality, counterparty, trusted appraisal, stock reserves and delivery | Quotes can expire, demand saturate, goods differ and buyers misjudge. A hidden valuable property does not become known through an exact automated sale estimate. Sales transfer stock; unsold inventory remains owned. |
| AC11 / SSD57 | **Construction and large projects:** milestone/work package with assigned resources | Site, layout/capability, materials, budget, labor and sequence | Work done, usable capability, wages owed and access differ. Supply loss can leave a partly built structure; multiple projects cannot spend the same reserved timber. Structural physics is not required to retain that distinction. |
| AC12 / BF100, PIR | **Routine social contact, correspondence and networking:** intent-based exchange or supported recurring contact | Whom to approach, purpose, disclosure, promise, refusal and repair | Routine greetings need not be a dialogue tree. Trust, debt, knowledge and willingness are different. A contact may learn a secret without liking the player more; an absent person cannot receive an unsent letter. Avoid mandatory friendship decay to manufacture upkeep. |
| AC13 / SSD75, PIR | **Administration, institutions and organizations:** application/case/meeting process | What is requested, evidence presented, obligation undertaken, negotiation or challenge | Filing, review, approval, appointment and actual authority are distinct. Expediting paperwork does not make an unsupported credential true; a withdrawn sponsor affects the benefits that actually depend on them. |
| AC14 / BF101/BF103 | **Scouting, expeditions and routine encounters:** bounded area search or objective policy | Objective, route, formation, resource limits, extraction/retreat and protected targets | Terrain, injury, ammunition, custody and delivery of findings still matter. Exploration coverage is not proof every secret was detected. Stop on a relevant encounter, with observer-safe information rather than hidden truth. |
| AC15 / CBR, BF103 | **Repeated combat and sparring:** selected tactic/policy against a supported encounter family | Loadout, target priority, retreat threshold, learning objective and acceptable lasting risk | Summarize repetitive exchanges when the policy handles them. A materially changed opponent or exhausted escape route changes the decision. Do not declare a fight safe from a hidden fact or turn victory into automatic healing/loot delivery. |
| AC16 / SSD75, BF96/BF103 | **Research, invention and experiments:** hypothesis plus bounded trial program | Hypothesis, discriminating test, materials, acceptable loss, recording/publication | Work can finish without discovery; negative results can be useful. Repeating identical observations is not new understanding. Keep consumed samples, uncertainty, attribution and actual downstream recipe/method use. |
| AC17 / SSD75, BF96 | **Investigation and archives:** selected question, source set and effort budget | Which evidence to trust, approach, disclosure, alternative test, when to stop | Retain inconclusive findings, false testimony and exhausted sources. Show known effort/coverage rather than omniscient solution progress. Still low priority under existing direction; this is the comparison baseline, not the selected build. |
| AC18 / SSD74–SSD76, BF101 | **Delegation and long-lived operations:** standing order or scheduled work program | Delegate, authority, supplied budget, priorities, exception policy and review point | Delegation changes who works, not the world's laws. Worker competence, independent motives, custody, competing commitments and report delivery retain their actual causes. A worker's discovery is not instant player knowledge. |

### Cross-activity interactions to retain

These are proposed distinguishing scenarios, not new mandatory tests or claims that each supplier is implemented. Trace the cause through its owning state and actual result consumer in the selected slice. Avoid building a world-wide simulation to cover unrelated rows.

| ID / applies to | Producer → affected owner → consumer | Consequence and distinguishing scenario |
|---|---|---|
| SI1 / AC1–AC18 | Work duration → actual world/body/space clock and obligations → next activity eligibility and recap | A training block can overlap a lesson window, client appointment, rent deadline or journey. Batch up to a relevant boundary. Agelessness need not pause the world; independent helpers may still work concurrently. Compare a deadline before/after completion without giving every actor a full offscreen life. |
| SI2 / AC2/5/6/9/11/18 | Consumption/reservation → inventory, job and output custody → subsequent work | Multiple tasks can share resources or a helper. Reserve actual capacity where needed, settle spent inputs once, keep usable intermediate output, and re-quote the remainder. Remove support before versus after consumption; results should differ for a reason. |
| SI3 / AC1/8/9/15/18 | Bodily work/support → fatigue, condition, competence and active sources → ability to continue | Mental learning, physical expression, actual fuel and sustained authority differ. A damaged hand may block practice without deleting knowledge. Restoration recovers the appropriate layer; a faster practice animation is not extra competence. |
| SI4 / AC12/14/16/17/18 | Evidence or worker finding → attributed observer knowledge → notebook, report or decision | Hidden truth, a witness's belief, worker knowledge, player knowledge and delivered evidence differ. A 100% bar must not disclose the existence of undiscovered evidence or exact hidden danger. Delay or lose a report: completed fieldwork does not auto-transfer its findings. |
| SI5 / AC2/3/4/10/11 | Completed work → actual item/service/ledger/delivery → recipient and next use | Finished, successful, delivered, approved and paid are separate where terms distinguish them. A batch can wait for collection, a parcel arrive damaged, a client owe money. Test one result through its next actual use rather than awarding an isolated meter. |
| SI6 / AC1/2/5/9/16/17 | Selected activity law plus stable draws → supported outcome → repeat/inspection | More clicks, reopening detail or splitting a block must not create free retries or rewrite a source-fixed fact. Batching should preserve the relevant distribution and causal boundaries; it need not use identical internal draws without such a contract. Source-known quantities stay fixed; variance applies to unstated values under the Nov 3 direction. |
| SI7 / AC3/10/11/13/18 | Agreed terms and independent agents → wages, debt, access and capacity → renewed quote/current options | Frozen accepted terms differ from live support. A helpful provider can become busy without rewriting the work already paid for. Keep economically useful counters, rights and motives rather than adding full market equilibrium or blanket social decay. |
| SI8 / AC4/6/8/9/14/15 | Relevant hazard/event → local support or condition → stop policy and aftermath | “Pause for decision” is not necessarily “freeze the world”. A burning process, pursuit or exposure can continue according to its cause. Stop before an informed commitment where possible; an unknowable hazard need not come with a spoiler warning or immunity. Record how pending time settles on return. |
| SI9 / AC1–AC18 | Player plan and chosen detail → same activity resolver → costs/results/available intervention | Distinguish detail from method. Opening the detailed view neither resets progress nor changes policy. Quick and deep views can expose the same supported decisions; active intervention earns an advantage through its action, not a compulsory minigame reward. |
| SI10 / AC3/6/7/10/11/18 | Completed output or shortage → another activity's actual input/demand → meaningful next plan | Supply chains create choices cheaply: food supports care, a tool supports gathering, sales fund materials. Keep stock, spoilage, storage and shared demand where they change decisions. A summary rate is not permission to sell goods that have not been made or erase a named possession. |
| SI11 / AC1–AC18 | Committed plan/job/result revision → native save owner → reload/import and rebuilt projection | Preserve spent inputs, completed work, pending output and stop terms. A result receipt is not a new action. Change content/support while an order is saved: retain or explicitly migrate its contract, then show current eligibility without duplicate pay, clues or free rerolls. |
| SI12 / AC1/3/9/12/13/15/17 | Developer canon policy versus ordinary means → selected resolver/sequence → alternative-life actions | A known protagonist outcome can guide the developer harness without promising every ordinary life that success. A summary should retain alternative methods that work by local mechanisms; a scripted sequence should not swallow unrelated jobs or turn a story event into repeatable practice. |

### Reconciliation ledger

Each selected discrepancy appears once here. Activity rows and SI scenarios above are the proposed expansion, not additional discrepancies. Residue is explicit below.

| ID and original locator | Classification | Owning producer/state → consumer and current evidence | Disposition |
|---|---|---|---|
| R1 / original WORLD_ABSTRACTION_AUDIT scope and the user's clarification | Genuine scope mismatch | Existing review focuses on shared engine boundaries; SSD10/SSD75 and BF95–BF109 own activity depth → lead-life implementation guide | ACT NOW, done: retain historical technical findings, add a current-scope pointer and save this activity-focused round in this owner. No acceptance of proposed activity designs implied (AD32). |
| R2 / original audit F1 | Stale current-state reading after another writer's source edits | Current `structured_ability_runtime.js` permits matching refund/forfeit; `place_acts.js` reads row cancellation; `simulation_contracts.js` no longer limits support-loss forfeiture to the old group exception → simulation job settlement | ACT NOW, done: add a dated source-only correction to the original report. Its 35-test result remains historical. This pass neither owns nor verifies that other writer's full implementation. Staged partial consumption remains distinct from an all-or-nothing forfeit option. |
| R3 / BF95–BF109 activity-family table and SSD75 | Compatible variant / under-specified application | Existing routine policy and world/domain laws → actual activity result consumers, many outside this pass's inspected code | ACCOUNT FOR NOW: map AC1–AC18 and SI1–SI12 into these owners; use bars, batches, recurring orders and summaries according to activity. No new universal activity engine or per-world feature quota. |
| R4 / earlier visual's “pause at a meaningful change” | Missing timing qualification | Actual clock/event/support owners → player decision and subsequent settlement | ACCOUNT FOR NOW: SI1/SI8 distinguish notification, decision and suspension; the visual was an explanatory proposal, not proof the world pauses safely. |
| R5 / generic place-act names mistaken for complete domain resolution | Incomplete integration / missing proof | Inspected `place_act_operations.js`: plain read/use/wash/clean operations add no domain effects themselves; `place_acts.js` composes authored costs/effects and observation receipts → actual learning/health/item/result consumer | ACCOUNT FOR NOW: trace the selected operation's real effects, not its label. A report can document an act without implementing skill gain, sanitation or recovery. No claim that all composed acts lack those consumers. |

### Disposition, scope and verification

**ACT NOW, completed:** corrected the intended scope, saved the activity/choice/interaction audit here, linked its existing review and lead-life consumers, and qualified the old F1 statement from current source. Shared files were edited through narrow insertions. No new gameplay was implemented.

**ACCOUNT FOR NOW:** AC1–AC18 and SI1–SI12 are design proposals to apply when their real consumer is selected, using current laws and known context. Default to fewer repeated clicks with useful feedback, explicit outcomes and player-chosen priorities; reject a universal guaranteed-success bar, mandatory microsteps and full offscreen simulation as general defaults. A setting can justify any of those locally through its actual premise and costs.

**LATER / DELEGATE, no dispatch:** when a selected Klein/HP slice reaches a repeated activity, choose one supported unit from AC1–AC18 and compare its compressed result with a relevant SI counterexample through the existing delivery floor. Suggested capability: one implementation agent with substantive domain judgment; effort depends on the named missing consumer and is not estimated here. Done check: usable result, meaningful stop/failure, rebuilt desktop journey and affected persistence under AD36/AD43. No new world or activity implementation order is selected; investigation remains low priority. Reopen on a selected repeated route, not merely because this inventory has rows.

Evidence: startup owners, SSD10/SSD70–SSD81 and routine fold, BF95–BF109 abstraction section, MR18/MR29, selected SLR/ECR/CBR rows and lead-life routine paragraphs read. Targeted source inspection: place-act operation producer/composition, current interruption contracts/compiler, simulation commit/completion/cancel paths, teacher availability projection and market saturation storage. This establishes those source boundaries, not an implemented general resolver for all AC rows. Source fingerprints and the pre-edit owner snapshots are in `/tmp/oops-activity-audit-inputs-2026-11-04.json` and `/tmp/oops-activity-audit-before-2026-11-04.json`; these are task-local checks, not proof of historical behavior.

Unmapped residue: per-world source qualification, full domain implementation coverage, current runtime readiness of the concurrent interruption changes, numeric pacing/throughput, detailed activity UI and play feel. Original technical-audit F2–F5 keep their own scoped evidence; this pass does not reverify or close them. No book chapters read, agents spawned, runtime files edited, saves touched, build/browser/full suite run, commit or push. Documentation and link checks are recorded at this round's close; prior runtime tests are not reused as proof of these proposals.

Close checks for this activity round:

- AC1–AC18, SI1–SI12 and R1–R5 definition accounting: passed, each defined once and in order within this round. Existing SSD/BF inventories retain their original scope.
- Local file targets across the four edited owners: 126 exist; all 10 newly inserted relative links and their heading anchors checked. Pre-edit text retained in order in each of the four files; whitespace checks passed. The pre-edit snapshot includes other writers' uncommitted content.
- `npm run check:docs`: exit 1, 21 diagnostics outside the four edited paths and zero on these paths after correcting this round's wording. Output: `/tmp/oops-activity-abstraction-doc-check-2026-11-04.txt`. This is not a clean repository-wide check.
- Selected source fingerprints unchanged since this round's inspection; no runtime test evidence claimed. `git diff --check` passed on the three tracked edited owners; the untracked technical review received an explicit whitespace check. No rules-index/register/code changes, so `check:rules` was not added as a new gate.

## Cross-world activity patterns and changing detail, 2026-11-04

Weibao: “Okay taking this into consideration, lets consider areas of abstraction accros most if not all worlds”. This expands the activity-compression round above. **Proposal under AD32:** broad reusable forms of play with world-specific consequences, not a universal software framework or a requirement that each world contain each activity. XC1–XC10 and XD1–XD8 are local continuation references, not standing rule codes. AC1–AC18 and SI1–SI12 retain their definitions and evidence; this round adds cross-world applicability and how detail changes with circumstances.

Scope: compare patterns against SSD10/SSD70–SSD81, the preceding AC/SI round and the lead-life routine procedure. Spot-check existing HP/MoL/JJK/Frontier briefs, the LOTM campaign plan and the living-upkeep source for applicability boundaries. This is not a census or new source read of every world. Existing brief proposals do not become canon or playable coverage through this comparison. No sealed truth or late plot detail is needed. Ordinary and alternative lives remain distinct from developer canon routes (AD44/AD46); world differences and reasonable means govern each use (AD5/AD38).

### Reusable forms of play

These patterns cover much of repeated life in worlds where their prerequisites exist. They can be combined: a study program is a recurring plan of bounded sessions, and a workshop is a project supplied by batch production. Do not multiply bars for every noun. Use the smallest unit that exposes the player's actual decision and yields a useful consequence.

| ID / existing activities | Form across worlds | What the player chooses | What makes each world or life distinct |
|---|---|---|---|
| XC1 / AC1/9 | **Practice session / training program** | Aim, method, means, feedback and time budget | What can be learned, bodily/faculty requirements, teachers, fatigue, chance, side effects and meaningful mastery. Reading, physical practice and supernatural development need not resolve alike. |
| XC2 / AC2/5/6 | **Production / collection batch** | Method, location, input quality, quantity and reserves | Material law, local stock, seasons, danger, tools, yield, waste and useful outputs. Mining, harvesting and brewing can share a compact work presentation without becoming the same activity. |
| XC3 / AC3/10/13 | **Request / service / negotiated commitment** | Counterparty, objective, terms, evidence and obligations | Actual employment, commissioned work, mission authority, law, payment and discretion. A notice is an opportunity; it does not grant permission, competence or a guaranteed reward. |
| XC4 / AC4/14 | **Journey / search leg** | Destination or search scope, route, pace, load, companions and retreat | Physical access, information, travel means, exposure, local clocks and who controls passage. A known shortcut or suitable power can remove the mundane leg for its actual cost. |
| XC5 / AC7/8/18 | **Standing support / maintenance order** | Priorities, recipient, budget, provider and shortage policy | Care, food, fuel, repair, rest and sustained powers have different causes. A self-sustaining or nonliving life can omit irrelevant chores; no universal upkeep tax is proposed. |
| XC6 / AC12/13 | **Relationship / institutional thread** | Intent, approach, contact, disclosure, promise, negotiation and refusal | Personality, history, authority, motives and communication. Summarize routine contact while retaining consequential conversations; a generic affinity bar is not a substitute for a specific promise. |
| XC7 / AC16/17 | **Question / hypothesis / bounded inquiry** | Question, sources, test, effort and acceptable exposure | What can be known, evidence quality, mistaken accounts, source exhaustion and possible methods. Effort can be bounded even when the answer or total search space is unknown. |
| XC8 / AC11/18 | **Milestone project / managed operation** | Desired capability, design, workers, supply, dependencies and handoff | A house, expedition base, laboratory, business or organization gains its actual functions and obligations. Progress is tied to completed work packages, not an interchangeable construction score. |
| XC9 / AC14/15 | **Encounter policy / objective resolution** | Objective, means, target priorities, allowed costs and withdrawal | World-specific tactics, defenses, injuries, independent actors and aftermath. Routine combat or avoidance can compress; a meaningful tactical change can require attention. World, task and player preference determine detail. |
| XC10 / AC1–AC18, SSD74 | **Period plan / chapter summary** | Near-term priorities, appointments, reserved resources, exception policy and review horizon | A school week, quiet employment stretch, cultivation retreat or voyage summarizes its supported activities and declared clocks. It does not invent a calendar jump, complete offscreen careers or guarantee every planned outcome. |

### Illustrative applications, not source-law or delivery claims

The examples below translate existing owner topics into proposed compressed play. They do not certify the franchise's full mechanics, register a new start or select implementation in that world.

| World / owning context | Likely useful combination | Decisions and differences that keep it recognizable |
|---|---|---|
| [Harry Potter](worlds/harry-potter/WORLD_BRIEF.md) | Study program + preparation batch + school/household period plan | What to study, supervised means, ingredients, relationships, secrecy, permission and appointments. A routine lesson can compress while an unfamiliar preparation or consequential conversation gets closer play. The old candidate brief is not the current Harry developer-run authority. |
| [LOTM developer campaign](gm/dispatch/refinement-audits-2026-10-31/LOTM_KLEIN_FULL_JOURNEY_PLAN.md) | Work/service block + supported practice + recurring home tasks | Question/method, actual means and materials, who pays, who knows and what obligations remain. Canon developer sequencing does not mean every other life gets the same opportunity or result. Investigation stays low priority. |
| Gu lives / [upkeep consumer](../src/book_world_gu_keeper_domain.js) | Feeding/support order + resource work + selected method practice | Living-carrier identity, food, ownership/control and resources. Food and mastery do different jobs; a whole-routine bar must not hide which held being lacks support. This source inspection is not a full Reverend Insanity source review. |
| [Mother of Learning retained visitor context](worlds/mother-of-learning/WORLD_BRIEF.md) | Lesson reservation + trial program + funded service/project | Actual guest permission, teacher availability, tools, observations and delivery. The existing visitor brief distinguishes its continuous local branch from unimplemented source-loop mechanics; a repeated activity supplies no reset or memory-transfer feature. |
| Mission/expedition contexts, including [JJK's proposed slices](worlds/jujutsu/WORLD_BRIEF.md#implementation-slices-proposal) | Commitment + preparation + journey + objective policy + recovery | What the assignment asks, the actor's actual means, local risk, other participants and reporting/payment terms. A mission label does not certify its difficulty or collapse supernatural effects into generic damage. |
| [Original Frontier](worlds/original-frontier/WORLD_BRIEF.md), authored worlds and nonhuman lives | Select the applicable forms, omit those without an in-world cause | Useful work, care, exploration and relationships need not require a human school, coin economy or protagonist. Existing native routes and absence policies remain with their owners; this row selects no new Frontier depth. |

### What changes the level of detail

**XD1 / familiarity is contextual.** Compress a familiar *situation*, not merely an action name. The same recipe with an unknown substitute or a changed target can introduce a new decision. Conversely a novice can use a quick route with the support they actually have; detailed clicking is not a prerequisite to ordinary results. MR18 remains the depth owner.

**XD2 / relevance is relative to the player's goal.** A rare but irrelevant observation can go in a recap; a common shortage threatening the chosen objective can merit attention. Notification frequency should follow declared priorities and consequences. Avoid manufacturing constant crises so that an automatic routine becomes a disguised click loop; no fixed interruption quota is proposed.

**XD3 / work, calendar and opportunity are different displays.** A study session can show time spent, a delivery its current leg, a construction milestone its actual work, and an inquiry its known coverage. One percentage for all four would imply knowledge the character may lack. The player should see whether work is active, waiting on a prerequisite, blocked or completed, rather than a bar silently filling during unsupported work.

**XD4 / preparation can be a reusable plan.** Save a supported loadout, shopping list, work method or research protocol instead of repeating its setup clicks. On reuse, show changed price/support/stock and request an actual command when needed. A plan is neither reserved material nor payment; it confers no missing means. This applies SI2/SI7/SI11 without adding a second inventory or quote owner.

**XD5 / parallel work has concrete performers.** The player may combine compatible activities or run independent helpers according to the actual body, attention, tools and world law; do not assume universal one-job exclusivity or universal multitasking. Passive curing can continue while the player travels if its required support remains. Multiple progress bars cannot conjure duplicate labor or split one irreplaceable tool.

**XD6 / a changed viewpoint preserves history.** Zooming into a previously summarized person, item or place retains established identity, ownership, event causes and knowledge. An actor who has already delivered a finding cannot be rerolled into somebody incompatible with that delivery. Aggregate background participants where appropriate; promote meaningful ones under SSD73 rather than writing full lives for everyone.

**XD7 / large powers may remove a chore.** A working means can eliminate distance, gathering, hunger or manual labor where the world's law supports it. Keep its actual source, costs and consequences; do not invent equivalent chores, opposition scaling or a required manual step to preserve an old progress bar. The remaining interesting choice may become what to do with the saved capacity, who benefits or whether to reveal the means.

**XD8 / a summary preserves the possibility of changing course.** A period plan can run until a known horizon or meaningful change without spending the entire future at once. A decision prompt is not automatically a safe world pause (SI8). Retain completed work and relevant pending effects when the player changes priorities. A canon developer summary and an ordinary-life policy can have different outcome constraints without changing local mechanisms by accident (SI12).

### Disposition and limits

**ACT NOW, completed:** saved XC1–XC10, six illustrative contexts and XD1–XD8 in the existing activity owner; linked the continuation from the lead-life guide. This continues the earlier activity audit instead of relabeling it as implementation or replacing its codes.

**ACCOUNT FOR NOW:** use these forms as a palette across applicable worlds, with local defaults, reasons and exceptions. Ten forms do not require ten new subsystems or a standard dashboard. A world may use several forms, combine them, or reasonably omit one. Repeated play can be richly causal while its interface stays compact. Useful prose, character voice and optional supported detail preserve flavor without imposing additional decisions.

**LATER / DELEGATE, no dispatch:** apply the relevant form when a selected campaign or ordinary-life consumer reaches it; no whole-world rollout is selected. Suggested capability: one agent with substantive design/implementation judgment; effort remains unestimated until the consumer and missing behavior are named. Done check for a future slice: its actual result and meaningful changed-condition case work through the selected world route and existing AD36/AD43 floor. Keep current LOTM-first and HP selection; no new activity order or investigation priority.

Verification state: design expansion and owner reconciliation, not runtime proof. No book chapters read, external research, new agents, code changes, save changes, build/test/browser run, commit or push. New examples are proposed applications of existing context, not verified canon behavior. Remaining residue: per-world source qualification, full world inventory coverage, pacing/play feel, concrete implementation and runtime delivery. This pass does not claim that every world was read or that every activity is supported.

Close checks for the cross-world continuation: XC1–XC10 and XD1–XD8 each defined once in order; all seven newly inserted local links and heading anchors passed; existing text preserved in order in both edited owners; whitespace and scoped `git diff --check` passed. `npm run check:docs` exited 1 with 21 diagnostics outside the two edited paths and zero on these paths. Output: `/tmp/oops-cross-world-compression-doc-check-2026-11-04.txt`. No registered codes changed and no runtime proof is claimed.


## Complete ladders and bounded activity-adoption reconciliation, 2026-11-04

Read SSD scope ladders through the full AC/SI and XC/XD continuations, then ACR1–ACR14 directly. The current AD52 adoption makes the mapped operating principles standing, while each activity, example, numerical budget, fixture and later playstyle idea keeps its conditional status. Earlier proposal-only headers describe their original rounds; they do not undo that bounded adoption. ACR1 explicitly supports long growth and sustained play: compression reduces repeated handling, not how long the player may enjoy a life.

SSD10 rungs describe implementation models, not a compulsory player progression or universal cost ordering. Different views retain named individuals, established custody, causes and learned knowledge. SSD71’s pool analogy and closed-form away projection do not prove ecological equivalence, safe batching across condition boundaries or a shared primitive already exists. SSD58’s exchange.js pointer is the historical clerk parcel seam, not general native trade authority, as ECX10 already records. Old first-slice rankings, active UI/loader names, per-holding named-animal budgets and second-consumer wording do not select today’s work; AD51 governs actual shared design.

AC/SI/XC/XD preserve the important distinctions: a chosen plan has no stock by itself; detail changes are not extra competence; usable result, delivery and pay can occur separately; a worker’s knowledge needs a reporting route; support loss settles actual stages once; a decision prompt does not stop all clocks. Independent passive processes and helpers need their own means, without a universal one-job limit. A power can remove a chore without replacement busywork. Progress expresses known effort/coverage rather than omniscient success, and the developer canon route does not certify ordinary lives. No code, source acquisition, world-wide rollout or new pacing benchmark was produced here (AD32, AD36, AD43).
