# Crafting and technology: micro, workshop and macro research

2026-10-11. Weibao: "Research and more? micro and macro level details?"

Status: bounded public-document research and original design proposals. No game
installation, playthrough, runtime implementation or new accepted mechanics.
Detail owner: [Technology and progression](../TECHNOLOGY_AND_PROGRESSION.md).
S06 is primary; livelihood, skills, knowledge, responses, continuity and saves
join through the [completion standard](../WORLD_COMPLETION_STANDARD.md).
Public examples below reveal no sealed world content.

## Research scope and evidence

Gap: native crafting already models skill, station tier, component tier and
quality. The prior CT1–CT5 palette separates those dimensions but does not yet
specify how a specimen's properties become workshop capability and regional
change. Research asks which joins create decisions worth representing.

Existing [Factorio dossier](factorio/REPORT.md) and
[Dwarf Fortress dossier](dwarf-fortress/REPORT.md) were inspected for routing.
Their evidence and unfinished work retain their owners. This pass does not
repeat the installed-source audits or promote their proposals to gameplay.
The candidate inventory was checked before adding references.

| Source | Documented mechanism | Disposition for YAIR and cost |
|---|---|---|
| R1 CDDA [proficiencies](https://docs.cataclysmdda.org/JSON/PROFICIENCY.html), live docs accessed 2026-10-11 | Specific expertise is distinct from broad skill; dependencies form a graph; recipes can use proficiencies to affect time and failure | Adapt a selected process specialty to existing learning, rather than add another broad XP system. Requires a real recipe consumer and persisted learning |
| R2 Vintage Story [smithing](https://wiki.vintagestory.at/Smithing), page marked last verified for 1.20.6 | Different metals use different preparation facilities; working needs equipment, fuel and heat; a cooled unfinished work item retains progress | Adapt process access and resumable work when useful. Requires staged inventory and interruption handling. Park compulsory voxel manipulation |
| R3 Factorio [FFF 375](https://www.factorio.com/blog/post/fff-375), 2023-09-08 design diary | Contrasts improving a production setup with building more of it; quality has function-specific effects; recycling recovery is limited to avoid productive loops | Adapt the scale-versus-quality choice and explicit salvage accounting. Keep native continuous quality, not Factorio's five labels. Compounding outputs need chain-level review |
| R4 Factorio [FFF 414](https://www.factorio.com/blog/post/fff-414), 2024-06-07 design diary | Freshness follows biological products through processing; spoilage leaves a usable residue; the design narrowed many shallow crops into fewer deeper production chains | Trial one local perishable family only if logistics makes it interesting. Requires batch age, declared clocks and handling. No general expiry mandate |
| R5 Victoria 3 [DD 59](https://www.paradoxinteractive.com/games/victoria-3/news/victoria-3-dev-diary-59-ai), 2022-09-21 | Economic planning accounts for anticipated supply/demand from queued buildings and hiring, avoiding redundant responses to a shortage; actor strategies follow goals | Adapt committed supply reservations and fitting institutional plans. Coarse local projects first; a global price solver would be a large separate commitment |
| R6 NIST [measurement traceability](https://www.nist.gov/metrology/metrological-traceability), live policy/FAQ accessed 2026-10-11 | Calibration chains include uncertainty; traceability alone does not establish whether a measurement is adequate for its intended use | Adapt purpose-specific measurement where precision matters. Requires separating actual properties from actor readings; never universal omniscience |
| R7 NASA ESTO [technology readiness](https://esto.nasa.gov/trl/), live table accessed 2026-10-11 | A concept, laboratory component, prototype in a relevant environment and demonstrated operational system are distinct evidence stages | Adapt fictional prototype-to-use maturation, not nine mandatory player bars. Test evidence needs a context; adoption is another axis |

These are documented mechanisms, not current-build playtest claims. Old design
diaries are historical evidence, not assertions of exact 2026 balance. Official
Victoria DD 27 and DD 5 fetch routes did not yield readable bodies; this pass
does not rely on them or third-party summaries for diffusion/production formulas.
No code was copied. Recommendations and all examples below are our inference.

## Micro: a material, specimen, person or operation

Only model a property when some selected action reads it. These are possible
detail rows, not mandatory fields on every apple or sword.

| ID | Detail | Decision it creates | Concrete consumer |
|---|---|---|---|
| MI01 | Composition and purity | Refine a feedstock or choose a tolerant process | Selected alloy/reagent recipe accepts the actual stock |
| MI02 | Shape, grain and structure | Orient or process material for its application | A handle, seal or lens has a relevant function |
| MI03 | Time and environment during processing | Choose a supported treatment or skip an unnecessary stage | An authored temperature/process window changes the result |
| MI04 | Dimensions and fit | Buy a matched part, machine it or make an adapter | A real assembly accepts or rejects the interface |
| MI05 | Precision of readings | Use a rough estimate, better instrument or specialist | A tolerance check uses what the observer can establish |
| MI06 | Specific practiced method | Practice fitting without pretending all smithing is mastered | One chosen recipe gains reliability or speed |
| MI07 | Part roles | Improve the part responsible for the desired function | Grip affects handling; reservoir affects supported duration |
| MI08 | Workmanship and variation | Prioritize precision, quantity or a genuinely superior process | Batch yield and selected item behavior differ visibly |
| MI09 | Unfinished work | Pause, transfer to supported storage or abandon | Actual progress, stock and condition survive declared interruptions |
| MI10 | Experiment evidence | Vary one input, repeat a result or test in another environment | The actor gains only the knowledge that observation supports |
| MI11 | Repair and salvage history | Refit an owned specimen or reclaim its declared material | Identity/custody persists; consuming it pays recovery once |
| MI12 | Body and working means | Use adapted tools, assistance or a different operation | The actual body/access supports the work; knowledge alone is insufficient |

Proposed UI distinction: the author knows a part's actual properties; the actor
may know only an estimate, a measured range, a certificate or field experience.
A calibration task can improve uncertainty without changing the material.
An exceptional appraisal ability can supply exact knowledge if it truly does.

Avoid treating all failures as the same lost roll. Local outcomes can include
lower useful grade, repairable work, recoverable inputs, evidence only or total
loss. Declare the selected process's actual outcomes and commitment policy.
Do not invent permanent damage, random defects or fatigue for every craft.

## Workshop: the missing bridge between micro and macro

| ID | Detail | Decision it creates |
|---|---|---|
| WS01 | Stock versus capacity | A hundred ingots do not establish a furnace's supported throughput |
| WS02 | Fixtures and access | Own, borrow, rent or commission workshop capability under actual custody |
| WS03 | Jobs and reservations | One batch cannot consume stock already committed to another |
| WS04 | Setup, batch size and jigs | Invest once in a repeatable run where setup actually matters |
| WS05 | Queues and priorities | Choose urgent repair, paid order, experiment or personal equipment |
| WS06 | Human specializations | Hire a fitter, train an apprentice or personally handle a critical operation |
| WS07 | Input/output destinations | Full storage, unavailable receiver or fuel exhaustion stops the affected work |
| WS08 | Inspection and acceptance | A working prototype and a customer-approved batch have different evidence |

For a simple single-output chain, normalize capacities to final-output units:
usable rate is bounded by the slowest supported step and actual consumer demand.
This is an authoring estimate, not a general solver for recipes with shared
workers, multiple products, stochastic yield or changing reservations.

Illustrative numbers: a workshop can make 12 pump parts per hour, but its
assembler supports 3 pumps per hour using 4 parts each. Expanding the part
workshop alone does not raise pump output. Better tolerances may instead open
one pump application requiring that precision. Quality and scale have different
returns. Figures are fictional, not selected balance.

## Macro: regions, institutions, eras and connected worlds

| ID | Detail | Player-facing consequence |
|---|---|---|
| MA01 | Maturity versus adoption | One working prototype, dependable local production and common regional use are separate achievements |
| MA02 | Uneven fields | Advanced medicine can coexist with scarce metals or poor communications |
| MA03 | Complementary infrastructure | A device becomes useful when a real route, energy source or trained operator supports it |
| MA04 | Resource geography | Locations favor different processes; trade or substitution opens other options |
| MA05 | Demand and purchasing power | Produce for a real commission or community need; output is not guaranteed income |
| MA06 | Training and diffusion | Teaching, documents, demonstrations and observable use create routes for spread |
| MA07 | Standards and interoperability | Common measures and connectors enable suppliers to cooperate; adapters can preserve other traditions |
| MA08 | Ownership and institutional access | Guild, communal, private or patron-backed work changes who can use and benefit from it |
| MA09 | Responses and bargaining | Institutions can fund, buy, improve, ignore, regulate or oppose methods for concrete reasons |
| MA10 | Public services | Pumps, preservation, printing, clinics or communication alter ordinary lives and reachable choices |
| MA11 | Natural development | Other actors progress without waiting for the player; interventions change supported timelines |
| MA12 | Loss and recovery | A lost facility differs from lost knowledge; surviving tools, workers or records support rebuilding |
| MA13 | Heirs and centuries | Shops, standards and institutions persist where supported; personal mastery needs its own carrier |
| MA14 | Cross-world reproduction | Importing a device does not grant the supply chain or local compatibility to reproduce it |

Possible feedback: reliable tools increase production, production funds teaching,
teaching enables several workshops, workshops make a process locally common.
This is a candidate causal chain, not an automatic rule. Each link needs actual
actors, resources, means and supported time. Dissemination can be fast or complete
where earned means support that result; no universal resistance tax.

## In-game research can itself have micro and macro play

| ID | Research consideration | Example decision |
|---|---|---|
| IR01 | Question and hypothesis | Seek a more durable seal, not generic research points |
| IR02 | Apparatus and sample | Design a test the held instruments can actually answer |
| IR03 | Controlled comparison | Change material or process and compare supported evidence |
| IR04 | Negative result | Rule out this combination without pretending to learn every alternative |
| IR05 | Replication and transfer | Does it work again, for another maker or in field conditions? |
| IR06 | Publication and secrecy | Share, teach, sell or retain a method through reachable local routes |
| IR07 | Institutions and research programs | Support a team, library or workshop with real tools and continuing stock |
| IR08 | Translation across worlds | Retest assumptions that local laws/materials actually change |

No compulsory hypothesis form for ordinary crafting. Known production can stay
idle and repeatable. New research decisions deserve attention when the answer
changes available play; strong knowledge means can bypass uncertainty outright.

## Three connected proposal journeys

| ID | Micro return | Workshop return | Macro return | Scope boundary |
|---|---|---|---|---|
| J1 Precision to water access | Make/measure a seal that fits one authored pump | Assemble and supply one functioning installation | A recipient gains a real water-dependent action | Original selected location only; no fluid-network simulation |
| J2 Craft specialty to supply | Learn one material/process specialty | Meet a repeat customer order and teach one worker | A second supported supplier can fulfill that need | Bounded orders and stock; no global market required |
| J3 Preservation to travel | Develop one supported preparation method | Batch and store one local perishable family | A previously impractical delivery reaches a consumer | Explicit local/offline clock and expiry; no universal food decay |

J1 is the strongest candidate for demonstrating the whole scale in a small
scope. J2 has less machinery complexity but requires actual worker/contract
consumers. J3 has the largest time/persistence burden. None is selected for a
build and none requires a Frontier start. No secret's location or truth is named.

## Implementation fit, costs and acceptance

Source inspected: `src/crafting_recipes.js` quality caps/ranges and
`get_component_stats`, plus the native crafting skill definitions in
`src/data/skills.js`. These support skill-dependent quality and tier-weighted
component assembly, not arbitrary part interfaces or physical simulations.

Native numeric quality can remain the incumbent for ordinary items. A selected
function may use a fixed authored variant first. Dynamic part identity,
installation and salvage keep the [assembly owner's](../worlds/PROGRESSION_AND_ASSEMBLY.md)
missing-delivery boundary. Specific process learning can reuse knowledge/practice
owners, but its craft effect needs an actual adapter. A regional adoption label
without a reachable consumer would be a display claim, not delivery.

Represent only properties read by the selected recipes and consumers. Prefer
bounded event-driven orders and institution responses over ticking every item,
NPC or market each frame. Offline work must stop at actual exhaustion, expiry,
capacity or other declared boundaries; elapsed time alone cannot invent stock.
Shared inventory, clocks, saves and result publication retain one writer.

Acceptance for a selected journey needs current rebuild and fresh-origin play
from acquisition through use and a real recipient consequence. Exercise missing
means, wrong/unknown readings, a paused job, shared stock, repeat reward and
lost access where relevant. Persistence changes need explicit compatibility,
old-save and save/reload/import evidence. Check that inspections neither consume
materials nor reroll tests, and that salvage/production do not duplicate inputs.
Game feel and fiction require Weibao's actual review.

Open research limits: no reference-game execution, current-build tuning,
complete technology diffusion model, full economic simulation or source-book
audit. This report identifies usable mechanisms and costs; it claims no feature
implemented, installed, accepted or delivered.
