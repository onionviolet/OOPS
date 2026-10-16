# Subsystem scope ladders: fishing, farming, ranching and other activities

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
| SSD82 | **UI:** the same activity card at every rung; deeper rungs open center views through the shared controller; checked at 1366×768 (AD34, UI rules). | ACCOUNT FOR NOW |

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
