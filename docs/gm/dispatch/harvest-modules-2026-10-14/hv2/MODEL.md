# HV2 modular harvest model

2026-10-14. PROPOSAL ONLY. This extends [P8 creature resources D1-D3](../../procgen-2026-10-13/p8/CREATURE_RESOURCES.md), [harvest yields D1-D3](../../procgen-2026-10-13/p8/HARVEST_YIELDS.md), [deposits](../../procgen-2026-10-13/p8/DEPOSITS.md) and [magical resources](../../procgen-2026-10-13/p8/MAGICAL_RESOURCES.md). Those owners retain conservation, local rights, ecology and acquisition law. HV2 supplies the common interface between their sources and downstream consumers. [REPORT](REPORT.md) distinguishes source evidence from proposed interfaces and the unresolved HV1 fit.

## M1. One operation contract, several source adapters

Use one sequence: select actual source and operation, quote available parts/costs, reserve affected capacity, advance eligible work, settle source delta plus output batches and receipts. Carcass, producer, deposit and reservoir are different source kinds behind this sequence. Do not turn a plant into a dead-animal record or turn a conserved identity into divisible mass.

Semantic roles below are proposals, not field names to impose on HV1:

| Role | Minimum information and owner |
|---|---|
| Source | Stable reference, world **instance** and place, template/body revision, local law revision, custody/access reference, available compartments, resolved specimen facts, clock reference and condition. Living body/producer owner remains authoritative |
| Part template | Stable part ID, geometry/count or mass basis, compartment claim, allowed operations, dependencies/conflicts, knowledge route, output material/product adapter, preservation applicability and known-only display projection |
| Operation | Source revision, selected part IDs, method/tool/actor means, affected claims, time/inputs, loss destinations, interruption policy, output grades, next source condition and knowledge/XP receipts |
| Output batch | Actual material reference, quantity and unit, applicable grade axes, source/operation lineage, acquisition time, preservation state, custody and any exact identity references. P2/P6 own composition and executable consumers |
| Observation | Observer, means/protocol, scope, date, confidence and disclosed facts. Never another copy of the source's truth |

M1a: Existing HV1 records should be exposed through readers and staged operations. Keep its saved domain and rat entry points. Add source-kind adapters incrementally; do not migrate all native loot/gathering into a new registry. All source-backed operations must settle inventory, source depletion, paid time, XP and discovery together through the host's durable transaction. Failed save changes none of these; repeated receipt cannot settle twice. An interrupted operation retains committed work and explicitly releases or retains its reserved remainder. No cancellation refund of already cut material.

M1b: Specimen traits resolve at admission and persist. A supported kill uses the saved loot stream and stable kill identity; plant/deposit collection uses saved gather decisions under its world-instance scope. Use existing [seeded streams](../../../../../src/seeded_streams.js), not a second generator. Preview and diagram rendering consume no draws. Failed admission publishes no cursor change. Saved lot IDs/ordinals must preserve cohort members where distinct outcomes matter; an aggregate average cannot reroll an individual when selecting it later.

## M2. Body plans and part templates

Templates describe available structure, not a promise that every creature contains every part. Query [CR1 body/species interfaces](../../procgen-2026-10-13/cr1/BODY_AND_SPECIES.md) for body revision, installed anatomy and source coupling. CR1 owns response of the eventual recipient; harvest owns removal from the donor. A removed tissue does not automatically teach its donor's technique or reproduce its faculty.

| Template family | Example slots | Specific accounting rule |
|---|---|---|
| Fur-bearing vertebrate | Surface hide, paired teeth, meat cuts, bone, optional authored organ | Teeth reserve discrete members; cuts reserve mass. Skinning can damage meat surface but must not consume all meat unless its law says so |
| Feathered / scaled / shelled | Feathers or scales, hide, shell segments, cuts, optional eggs | Shed/collected surface material differs from the remaining living surface and from postmortem stock; eggs have their own producer cycle |
| Arthropod / segmented | Plates, limbs, fluid compartment, authored gland | Shared fluid pool cannot pay full volume once per limb; plate fit may matter more than mass |
| Amorphous / colonial | Supported biomass, colony portion, isolated reservoir | No invented skeleton/skin. Portion removal updates actual surviving body or colony under its transition law |
| Herb / tree / fungus | Leaves, flowers, fruit, roots, bark, sap, timber, fruiting body | Shared stem/root dependencies; fruit/leaf cycles retain producer, uproot/fell changes lifecycle. Fungus fruiting stock and substrate remain distinct |
| Mineral deposit | Vein zone, ore fraction, gangue, placer parcel | Reserve in declared units; intact crystal geometry differs from mineral fraction. Mining and panning can target different source parcels |
| Magical source | Tissue carrier, charge reservoir, pattern carrier, exact token | Declare which budget moves. Copying a diagram is information; moving a token is custody; extracting charge does not clone its carrier |

M2a: Claims form a small dependency graph, not just an output list. Example: selecting an intact hide reserves its surface; another operation cannot later award that same hide. A gland operation can reserve its organ and drain a shared secretion budget. Whole processing computes one compatible plan across claims. Conflicting parts require an explicit preference preview. Unsupported or unknown parts are not silently granted by “whole.” A later anatomy discovery can expose a surviving part, never restore already discarded material.

## M3. Harvest verbs

| Verb | Source transition | Cost / option that keeps it distinct |
|---|---|---|
| Kill, then process whole | Combat creates supported carcass; processing claims compatible recoverable parts | Killing and processing are separate work receipts. Show time, tools, conflicts and remains left behind |
| Take one part | Spend only selected claims plus declared collateral damage | Faster targeted work; rest remains until disposal/spoilage. Taking a trophy does not pay a second loot trophy |
| Nonlethal collect | Spend available secretions/sheds/fruiting stock; retain donor | Readiness, access and actual handling means; blood/tissue sampling also updates real donor condition if supported |
| Shear | Remove renewable coat portion | Tool and animal handling; readiness follows local regrowth/care law, not repeated clicks |
| Milk | Transfer available production reservoir | Containers, current producer stage and care; not all species/life stages produce milk |
| Pick versus uproot | Pick spends selected mature part; uproot removes plant/root capacity | Gentler slower picking can preserve future output; uprooting may yield useful roots now and need later replanting |
| Mine versus pan | Mine spends a vein zone; pan processes actual placer feed | Mining uses access/tool and produces gangue; panning needs water/apparatus and loses declared fines. Neither converts every deposit to the other |
| Tap / capture | Transfer sap or supported energy flow | Actual source and receiver capacity; felling/tissue removal is a separate destructive operation |

M3a: Availability distinguishes physically impossible, currently missing means, forbidden by an authority, unknown to this observer and unsupported simulation. Law can attach consequences without pretending an illicit physical operation is impossible. [WORLDS](WORLDS.md) defines adapter obligations. Alternate methods, purchase and commissioned work remain reachable where their law supports them.

## M4. Grade is four separate axes

| Axis | Meaning | Drivers | Consumer |
|---|---|---|---|
| Completeness | Retained geometry/member coverage relative to selected template, not the fraction of a carcass used | Death damage location/type, overkill/hit history where available, preexisting injury, cut path and handling | Whole-pelt request, fitted armor/trophy; scraps still usable for a mass-based recipe |
| Quality | Functional condition/workmanship of the recovered part | Existing specimen condition, method competence, tool function/condition, contamination/handling and applicable freshness | Tanning/craft recovery or specified preparation result; never automatic combat-rank potency |
| Freshness | Time-sensitive condition on an applicable clock | Acquisition/death time, temperature/storage, exposure, preservation and resumed time | Food/reagent eligibility and remaining handling window. Ore normally marks this axis inapplicable |
| Purity | Relevant fraction or unwanted content on a declared measurement basis | Source-zone truth, soil/gangue/fluids, washing/separation, contamination, magical law | Refining/mixture fraction or exact reagent predicate. Purity is not moral cleanliness or universal safety |

M4a: Use numeric truth only where the law supplies it; present scoped categories/estimates when measured. `unknown`, `inapplicable` and zero are different. Do not infer purity from high quality or repair missing anatomy with a quality bonus. Freshness may drive an explicitly declared quality loss, but do not apply the same decay twice. HV1's completeness/quality categories and formula stay authoritative for its slice until a separately authorized revision. Future axes extend them without retroactively changing output keys or already earned items.

M4b: Recipes choose lots explicitly under a visible default such as oldest eligible or lowest adequate grade, protecting reserved trophies/rare variants. Combining mass-compatible scraps preserves weighted fractions, loss and lineage; completeness for an intact recipe is a per-member predicate, never an average of two half pelts. P6 tanning/preparation can transform geometry and condition through its own law. A P2 mixture receives measured mass/active properties via a declared adapter, not a generic “rare = stronger” scalar. Unknown properties still operate in truth. [Crafting palette RX3](../../../../PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS_2026-10-14.md#rx-place-time-and-conditions) supplies handling/timing provenance as properties; no consumer means descriptive provenance only.

## M5. Rarity, trophies and batch history

Local adjective tiers can be common, uncommon, rare, exceptional and singular, with world-specific names, distribution, region/era and discovery policy. These are supply descriptors, not globally equivalent power ranks. A rare variant is a coherent authored trait bundle drawn once with the specimen: size, coat, ecology or a supported tissue function. Avoid multiplying every output independently by its rarity. Abundant magical wool can be mundane wool's superior in one property while remaining common locally.

Trophies retain source/cohort reference, selected part, completeness, known acquisition event, maker/preservation and custody. Mounted trophies consume or move the same part; they do not leave a second saleable raw part. Certification is an attributed claim with issuer, scope and authenticity; chemical appraisal cannot prove consent or legal ownership. Forgery alters belief, not material truth. Unique tokens retain exact identity through sale, installation and consumption. Sealed origin is projected only by ID, route and status until its discovery route permits more.

Store append-only acquisition/transform links where a consumer needs them, coalescing ordinary fungible batches only when all gameplay distinctions match. Split preserves proportional fractions and member claims. Freshness or provenance with gameplay meaning must survive inventory, chest, sale, craft, cancellation, export and literal import. The [p23-salvage report](../../absorb-all-2026-10-14/reports/p23-salvage.md) owns exact equipment disassembly and explicitly parks food lots R24. Its vest-copy state is not a carcass/food-lot owner.

## M6. Spoilage and preservation

New supported lots can opt into explicit spoilage laws; legacy items do not acquire ages on load. Earliest slice uses played eligible time, with closed-browser behavior unchanged. A world may declare suspended, rapid, selective or absent spoilage. Travel reads declared origin/destination storage compatibility and clock policy; no double decay from two clocks. Once settled, backward calendar display changes do not restore freshness.

Salt, smoke, drying, cold storage and magical stasis are distinct processes: reserve actual salt/fuel/container/space or charge, spend work, update batch condition and next boundary, retain origin and losses. Cold slows an applicable rate; it does not reconstruct spoiled stock. Smoking may change cooking or mixture properties. Stasis can pause a declared clock without pretending to cleanse contamination. A strong preservation cheat may restore freshness if its explicit law allows restoration and supplies the corresponding source/cost rule. Preview states effect and uncertainty; failed durable publication consumes no supplies.

## M7. Helpers and automation

Same operation contract for player, hired worker, companion and apparatus. Read executor skill, body/tool means, consent/control, availability, site rights, wages/feed/charge and receiver capacity from their owners. A beast carrying a carcass is transport work, not automatically skilled skinning. A helper who performs work earns that helper's receipts; player gains only supported supervision/teaching experience. No duplicated source budgets per actor.

Standing orders choose known part/method, minimum acceptable grade, protected stock, receiver, preservation and overflow policy. Admission rechecks each job against current stock and means. Stop truthfully on shortage, full receiver or lost access; keep paid partial work. Preserve HV1's lot cap/overflow behavior until inspected. Never silently delete finished parts or rare/trophy members to reduce save size. Offline progression needs its own bounded time, wages, stock and absence decision; this design does not enable it.

## M8. Desktop presentation contract

Targets: 1366x768 and 1600x1000. Source list and selected source diagram/list use the screen together; selected-part details expose grade, cost, remaining source and Begin/Queue actions. A body-plan schematic highlights known surface/part regions and selected conflicts; a keyboard-accessible part list has the same actions. Mineral zones and plant organs use their own diagrams. Hidden anatomy does not appear as a named disabled gland or a telltale count of secret slots.

Grade display uses four labeled chips with units/scope and `unknown`/`not applicable` states; an intact-pelt requirement highlights completeness rather than an unexplained star rating. Preview explains applicable drivers without displaying unseen combat/specimen truth. “Process recoverable known parts” shows leftovers; a declared harvest-everything cheat has its separate scope. Fullness/overflow, protected trophies, preservation cost and progress remain visible. Tooltips add detail; essential cost/refusal is inline. Appraisal and anatomy sight follow [CHEATS](CHEATS.md). No browser proof exists for this proposed UI; rebuilt fresh-origin evidence at both target viewports is an implementation gate. Mobile, bespoke art and a mandatory minigame are deferred.

## M9. Fit to landed HV1 source snapshot

Read branch `proc/hv1-carcass` at `de15c662a8a2c7a76976c02502df3f8001f3bbc8`, report and `src/harvest.js` through `git show`. This is SOURCE evidence only, not integration or rerun verification. HV1's report was absent on the first read and available on the second.

| Actual HV1 shape | Framework binding / compatibility decision |
|---|---|
| `harvest {schema:1, revision:1, sequence, auto, lots, job, left, processed, last}` | Existing harvest owner retained. New readers can project rat sources without changing saved bytes; plants/deposits need additional revisioned owners or an explicit schema migration, not entries in species-only lots |
| `lots[species]` is a FIFO array of individual specimens, cap 24 including held job | No aggregate specimen reroll problem in this snapshot. `key` is source identity; `species` maps to family template; `born` is played-minute death time. Preserve each specimen and its saved draw/damage |
| Specimen `{species,key,born,draw,size,condition,variant,damage}` | Source adapter reads these fields; size/variant presently descriptive, no potency bonus. Do not regenerate them or independently redraw more variants on load |
| `damage {hits,crits,overkill,type}` | Supports grade drivers at specimen scope, not anatomical damage location. Body-region targeting needs new combat evidence/state; do not claim it exists |
| `job {specimen,choice,remaining,automatic}`; `planHarvest` returns outputs/minutes/xp/choice | Existing timed settlement/cancel entry points can remain. Rat revision 1 has no per-part remaining claims or stage work ledger. Remainder retention requires versioned extension before M2a/M3 selective persistence works |
| Output `{part,item_key,count,completeness,quality,integrity,freshness}`; inventory key `{id,quality,completeness}` | Key truth is quality 10..150 in steps of five and whole/damaged/scraps. Inventory does not retain freshness, purity or per-source provenance. Output's freshness is a calculation snapshot, not a stored per-item decay clock |
| `last` retains only latest specimen, plan output and grade context | Useful receipt/inspector, not history for all finished parts. Provenance-sensitive asks/trophies require exact lot identity; cannot reconstruct it from `last` |
| Take-one consumes specimen, other parts left behind | Honest revision-1 selective-and-discard behavior. M3 retain-and-return is a future revision, not current compatibility. Migration never resurrects discarded tissue or settled specimens |
| `addCarcass` auto overflow invokes `finishHarvest` immediately; ordinary auto jobs are timed | Preserve this explicit snapshot policy unless revised. Do not describe overflow as timed work. A unified timed automation law needs cap/reservation/time/XP and throughput review |

M9a: HV1 validators accept only supported rat species, known part choices and schema/revision 1. Additive arbitrary source fields are not a proven extension seam. Readers/adapters can reuse grade/output functions now; new species or fields affecting claims require validator and content-version changes. Preserve revision-1 pending jobs with their existing whole/selective result and cancellation behavior. Migrate only unsettled stock explicitly, retaining ID/birth/draw/damage; new claims must neither create stock absent from the source template nor revive prior losses. Tests need mixed legacy/native graded inventory and literal native import, not only JSON of this semantic table.
