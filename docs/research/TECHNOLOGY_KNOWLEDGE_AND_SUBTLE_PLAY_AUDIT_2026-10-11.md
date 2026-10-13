# Technology, knowledge and subtle play audit

2026-10-11. Requested by Weibao: subtle details, pursuing technology, knowledge,
skills/stats and other aspects. Bounded design/source audit. Recommendations are
proposals; no runtime, source-library, save, build or gameplay changes assigned.

## Outcome and scope

Technology can be a substantive pursuit alongside power progression. The best
next step is one connected method-to-use chain, building on native crafting and
existing knowledge/work consumers. The current design palette already covers
many subtle details. Its missing delivery is their selected functional joins,
not another universal technology ladder.

Inspected live PROJECT, TECHNOLOGY_AND_PROGRESSION, CRAFTING_TECH_MICRO_MACRO,
ENGINE_AUTHORING's relevant bindings, the D1 checkpoint and targeted source:
crafting_recipes, crafting_visibility, native use_recipe, field_workshop and
world_completion_materials facts/runtime/host. This is not an exhaustive audit
of all research commands, every world, all stats or the entire save pipeline.
Existing dirty owners remain untouched. Earlier wave browser evidence remains
historical evidence for that wave; this pass performs no current-build verification.

## Findings

| ID | Verified observation | Implication and proposed next work |
|---|---|---|
| F2 | Native recipes store an availability/unlock state, skill and level range. The makeable projection checks unlock, station, compatible inputs and disposition. The technology owner explicitly labels its per-actor fidelity/tech-node sketch unstarted | A recipe unlock is not a general record of understanding, tacit practice or experimental evidence. Bind a selected method's knowledge/practice to its actual craft consumer before claiming that chain delivered |
| F3 | Base success/quality formulas read total crafting skill, station offset and component quality; crafting XP is awarded in the native caller. These inspected formulas do not directly read a general intelligence stat | Extend existing skill roles first. Add a stat contribution only with a named operation, actual calculation and observable effect. No new universal intelligence gate is established by the source |
| F4 | Materials facts qualify a specific measurement using observer receipts, cause ordering, body identity and an actual stamped inventory item | There is a useful bounded observation foundation. It does not establish a general instrument/calibration/uncertainty engine. Reuse its provenance discipline for one selected property rather than exposing all author properties |
| F5 | Field workshop has actual teaching/copy/practice, specialist contributions, jobs and resulting kit production. The materials runtime joins completed work to a specific existing crop/drain consequence | Useful chains and recipients already exist. Arbitrary machine assembly, adaptable part interfaces and broad technology adoption are not established by these examples. Select and prove one actual installed-device or service consumer |
| F6 | Existing design covers bootstrapping, teaching, adoption, cross-world compatibility and inheritance, but explicitly leaves its general implementation proposed. Naruto's local source owner excludes Boruto by default while the broad palette mentions scientific ninja-tool design | Freeze local source/era and retention rules. Later-era technology, original invention and imported methods need distinct dispositions. Do not interpret a broad palette hook as permission to import every sequel technology or as a verified native feature |

Source bindings: [recipe definitions](../../src/crafting_recipes.js#L46),
[base success/quality](../../src/crafting_recipes.js#L80),
[component aggregation](../../src/crafting_recipes.js#L376),
[makeable projection](../../src/crafting_visibility.js#L3),
[native crafting caller](../../src/main.js#L3802),
[field method/workshop](../../src/field_workshop.js#L75),
[measurement qualification](../../src/world_completion_materials_facts.js#L40),
[materials consequence join](../../src/world_completion_materials_runtime.js#L30).
Markdown line fragments are author locators; native file links in chat use app
line syntax. A source-inspected consumer is not a passing browser journey.

## Proposed capability model

Separate what the actor knows from what this actor or available team can do.
Knowledge states can be per-method observations and receipts, not one global
science XP meter or five mandatory bars. Keep the existing TK palette as an
authoring aid; fidelity decay, every-failure progress and imperfect teaching
remain local proposed policies, not automatic universal rules.

| Dimension | Proposed role | Alternate ways to meet the need |
|---|---|---|
| Information | Know a principle, drawing, procedure or experimentally supported relation | Teacher, records, purchase, observation, reverse engineering, invention or a genuine knowledge cheat |
| Practical mastery | Control an operation reliably and repeat it in relevant conditions | Personal practice, a specialist, assisted work, a functioning machine or a genuine execution cheat |
| Body and stats | Supply task-specific reach, force, dexterity, perception, endurance or other locally supported faculties | Adapted tools, fixtures, teamwork, different process or body; exceptional means may suffice outright |
| Tools and measurement | Produce and assess the relevant precision | Rough estimate where adequate, calibrated instrument, specialist or actual appraisal faculty |
| Inputs and environment | Supply compatible stock, energy, workspace and conditions | Trade, substitutes, local resources, imports or a declared creation mechanism |
| Application | Make a real item/device/service change an actual outcome | Personal use, installation, customer, teaching, production or institutional uptake |

Examples of proposed stat uses: dexterity improves a selected fitting operation;
endurance changes an admitted work interval; a supported perceptive faculty
reveals a flaw within its actual resolution; intuition suggests a testable lead
without certifying it. Analytical or memory capability can help design work
where the world/actor supports it. These are candidates, not new stats or formulas.
A fast maker need not invent better designs; an excellent designer can hire
someone with the means to execute. Ownership of a machine differs from the
ability to reproduce it.

## Subtle details with actual decisions

The following is a reference inventory. Select only leaves consumed by the
chosen chain; absence of a property elsewhere is not automatically a defect.

| Detail | Useful choice or consequence |
|---|---|
| Partial/wrong knowledge | Inspect, test, seek a teacher or use an already reliable alternative |
| Tacit technique | Practicing a process improves that execution without unlocking unrelated disciplines |
| Instrument resolution and calibration | A reading may be adequate for one job and inadequate for another |
| Batch provenance and variation | Test the relevant lot instead of assuming every ingot or reagent is identical |
| Purity, grain, fit and process order | Improve the constituent responsible for the desired function |
| Jigs, setup and standard parts | Invest in repeatable production rather than repeatedly hand-fitting everything |
| Unfinished work | Pause/resume or salvage with retained identity, inputs and declared losses |
| Test context | Bench success and actual field use can establish different facts |
| Replication | Another maker can demonstrate that the method is teachable, not only that its inventor succeeded |
| Useful failure | Produce evidence, lower useful grade or repairable work under a declared outcome; failure need not always help |
| Collaboration | Designer, craftsperson, operator and funder need not be the same actor |
| Social access | Borrow, rent, commission, negotiate, publish or keep a method private where fitting |
| Repair and substitution | Replace the relevant part or use a locally compatible material |
| Idle stopping | Stop at exhausted stock, capacity or unsupported conditions with a named reason |
| Adoption | A supplied installation or taught worker changes a real local activity |
| Cross-world transfer | Carry notes/device/parts separately; test only assumptions the destination actually changes |
| Continuity and retention | Keep records, inventions, specimens and personal mastery under their distinct timeline/life policies |
| Knowledge/power cheats | Appraisal, copying, simulation, fabrication and creation solve different parts of the chain |

No mandatory deterioration, forgetting, institutional hostility, random defect,
stat ceiling or invention fee follows from this inventory. Powerful means can
remove a bottleneck. Model only meaningful remaining decisions.

## Other fields and world fit

Medicine, sanitation, food preservation, water, transport, communications,
agriculture, education and bookkeeping deserve pathways alongside weapons.
Their progress must have concrete consumer actions or outcomes. Improved
learning access or reliable deliveries can matter without a combat-stat bonus.

RI proposal: combine ordinary processes, material/resource handling and locally
qualified Gu functions without assuming modern engineering defeats its laws.
LOTM proposal: develop machinery, measurement, materials and supported mystical
applications as distinct cooperating disciplines. Naruto proposal: ordinary
tools and puppet manufacture can cooperate with separately acquired control,
medical or seal methods; an era/source gate resolves later scientific-tool hooks.
These are adaptation directions, not assertions that every hybrid is canon.
Each world GM must qualify the selected source rules and actual means before
an implementation packet is ready.

## Candidate first proof and acceptance

Reuse J1 from the existing micro/macro report: **precision to water access**.
One method, one relevant material property, one tool/instrument, one functioning
installation and one recipient consequence. Select an actual world/location
before coding. The chain can use an ordinary operator or a genuine supported
exceptional means; it does not require Frontier or a global fluid simulation.

| Criterion | Proposed proof |
|---|---|
| Knowledge affects the craft | Acquire/test the method through reachable actions; the relevant native consumer changes eligibility or result, not merely a tooltip |
| Execution has fitting alternatives | Make, commission or use a selected supported cheat; actual maker/tool/body/input costs and outcomes match |
| Precision changes a function | A chosen measurement/fit decision changes the actual pump or local equivalent, with known feedback and observer boundaries |
| Installation serves someone | Recipient gains the actual water-dependent action/output; repeated inspection cannot duplicate installation rewards |
| Continued production is usable | Selected idle work stops/resumes at its declared stock/access/capacity boundary; teaching or a repeat order has a real consumer if included |
| Persistence is honest | Compatible old saves, mid-work restore, save/reload/import and failed publication preserve committed evidence, specimen identity, stock and outcome |

Freeze a bounded ledger and source-qualified contracts first. Rebuild and
exercise the connected native journey from a fresh test origin; include missing
means, unknown/wrong readings, pause/cancel, repeated settlement and relevant
equipment/body changes. Those cases are specified-not-run by this audit.
Human acceptance of fiction, balance and feel remains separate.

## External evidence and verification state

[NASA's readiness table](https://esto.nasa.gov/trl/) distinguishes concepts,
laboratory validation, prototypes and operational demonstration. It supports
our proposal to separate these achievements, not nine required player levels.
[NIST measurement guidance](https://www.nist.gov/metrology/metrological-traceability)
discusses calibration, uncertainty and fitness for intended use. It supports
purpose-specific measurements, not a compulsory universal calibration minigame.
Official sources refreshed 2026-10-11; game adaptation is our inference.

Executed: bounded document/source reads and structural/relative-file-link
checks for this report. No tests, builds, browser journeys, saves, source
acquisition, worker dispatch, commit or publishing. Runtime findings are scoped
source observations; no whole-engine absence claim or new gameplay completion.
