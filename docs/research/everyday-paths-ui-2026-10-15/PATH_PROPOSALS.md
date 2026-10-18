# Fishing and farming: methods, discoveries and chosen involvement

2026-10-15 follow-up. User asks what to take from the research, what else skills/powers/discovery/involvement imply, and whether to decompile more. Research and proposals only. This extends [REPORT](REPORT.md), preserving its F1–F6/P1–P5/J1/G1–G4 references. No shared-owner edit or implementation is authorized here.

**Recommended direction for consideration:** give each pursuit a few consequential decisions with a useful end product and durable knowledge. Let the player choose involvement separately from available means. Deeper paths can consist of better methods, understanding, relationships and personal projects at one place; larger operations remain an option.

Accepted D2–D4 still govern: whole paths, chosen involvement per pursuit/life, repeatable world-specific principles with possible unexpected discoveries. Exact controls, rewards and laws below are proposed. The Proto23 shell, shared surfaces/navigation and populated1366×768 remain the UI target; mobile is deferred. Overarching-direction chat retains canonical gameplay integration.

## F7–F9: the focused additional research

| Code | Additional evidence | What it changes in the proposal |
|---|---|---|
| F7 | Two new read-only Stardew exports, `Crop` and `HoeDirt`, from the matching native assembly. `Crop.newDay:830–869` separates out-of-season death from the watered/no-water-required growth branch. `HoeDirt:875–936` checks paddy proximity and passes watered state to growth. Existing `Object:1634–1641,1701–1754` applies sprinkler coverage through ordinary soil state. | Placement and watering can have actual causes, while growth timing, unattended care and season consequences remain separately chosen rules. A little field need not import all donor chores or crop-loss rules. No current native test. |
| F8 | Retained Stardew `GameLocation:13932–14060,14113–14193` distinguishes species bait from magic bait: target identity feeds probability and retry selection; magic bait bypasses selected season/time/weather checks. Retained `GameData.cs:3923–3949` applies per-spawn specific-bait modifiers. | A power can change eligibility, while another method changes selectivity. Neither is merely a percentage-yield upgrade. Exact effective odds and the complete magic-bait ignore-key set remain outside this pass. |
| F9 | Five additional complete Immortal Life TextAssets reused: Crop37, AutoWater4, SeedPack3, SeedQuality6 and CropPack1. Crop has growth/harvest stages and drought/resistance fields; AutoWater records distinguish manual/auto configurations and ranges. `AutoWaterItem` declarations identify actions and ground-search methods but have empty bodies. | Rich growing parameters and care modes are real source data. They do not prove current executed costs, true breeding, a mutation algorithm or NPC knowledge. Do not claim a simulation from field names. |

These are local primary code/data observations. The [existing UI evidence](UI_EVIDENCE.md) remains independently versioned. No new screenshot, game launch or installed-state compatibility claim accompanies the code exports. Full bodies/tables, field IDs, hashes and exact source spans are saved privately in `private/FOLLOWUP_SOURCE_NOTES.md` and `private/FOLLOWUP_RECEIPT.json`.

## P6: ACCOUNT FOR NOW, keep involvement, skill and means separate

Choose how closely to participate in a pursuit without resetting its skill, stock or past discoveries. These are attention choices, not mandatory advancement tiers:

| Chosen involvement | Fishing example | Farming example | What the interface needs |
|---|---|---|---|
| Personal practice | Read signs, choose presentation, respond to a meaningful bite/technique situation | Tend a particular bed, inspect a plant, choose a growing intervention | Local place/plot plus current choice and feedback |
| Prepared routine | Follow the selected bank/method until its stated stop | Carry out known planting/care/harvest instructions | Method, real means/supplies, expected result range and stop reason |
| Supervised experimentation | Compare a lure or condition, inspect observations at chosen intervals | Compare one treatment or layout with a control | Notebook, changed variable, observations and uncertainty |
| Delegated or broadly managed | Ask an actual helper or device to execute a supported instruction | Entrust staples to a worker, construct, irrigation or plant-control power | Assignments, custody, reserves, exceptions and attributed results |

Not every world supplies all these means. The player may still choose how closely to watch or direct the means that do exist. No automatic hireling requirement or unlock-by-repeating-a-chore rule is selected. A valid power may remove work entirely. Do not add an arbitrary nuisance tax to restore it.

The personal route should offer expression and consequential control when present. Avoid a universal reward multiplier that makes repetitive clicking optimal forever. Routine play must remain a worthwhile path, including opportunities to learn and discover. Equal reward per minute is not asserted, but a less-hands-on life must be able to achieve its intended outcomes through suitable means.

Watching a detailed animation, issuing an instruction and personally executing a technique are different. Expanding a pond view should not stop work or grant extra mastery. A helper gathering fish does not automatically give the player the helper's embodied technique, but reading their report, designing an experiment or studying with them may teach something through an actual learning route. Exact XP and teaching rules remain open.

## P7: ACCOUNT FOR NOW, mastery and powers change what can be done

| Capability | Fishing proposal | Farming proposal | Qualitative consequence |
|---|---|---|---|
| Perception/diagnosis | Distinguish feeding signs, false nibbles or an unsuitable method | Diagnose maturity or a particular stress using available evidence | Better-informed decisions, rather than a universal revealed truth panel |
| Precision/control | Present a lure differently, release safely, handle a difficult catch | Graft, prune or place a delicate intervention accurately | A new supported technique or improved reproducibility |
| Environmental power | Reach another current or hold a line in a formerly inaccessible place | Direct rain, warmth, shade or a world's relevant energy | Another method or growing location becomes available |
| Living-system power | Communicate with a creature or work through a suitable companion | Shape growth or coordinate care through plants/constructs | Different access, control or labor, subject to that world's actual laws |
| Knowledge/teaching | Explain a useful method to another person | Share a cultivation method or propagate a known plant where supported | A community or legacy path without requiring larger property |

These are original examples, not verified donor features or selected YAIR laws. Combine capabilities through the activity: perception identifies a useful pattern, practiced control acts on it, water control enables the approach. A shared process can compose those contributions without a named bespoke combo for every pair. Detailed material/process composition stays with the [production owners](../../PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS_2026-10-14.md).

Let a strong fitting capability be strong. If a power really removes the seasonal restriction or supplies sufficient water, allow that consequence. Other limitations apply only if the selected world/process actually has them. Do not invent universal mana upkeep, ecology backlash or nutrient scarcity to make every power inconvenient. If spatial distinctions cease to matter, simplify the display accordingly.

## P8: ACCOUNT FOR NOW, discovery should create reusable understanding

Separate discovering a species, recognizing its behavior, learning a method, learning a use and reproducing an exceptional result. Catching something once need not reveal its entire life history. A good observation can open a useful question before the player knows the answer.

Original fishing example: a catch repeatedly occurs near floating blossoms. The character records the correlation. A deliberate comparison, a teacher or suitable perception can test whether place, timing or something about the blossoms matters. A known ingredient may then become a useful lure. Its bait/cooking/other uses share actual stock and provenance; discovery of one does not reveal all. Companion crafting research owns any resulting preparation law.

Original farming example: compare two small beds with one meaningful difference. Observe changed timing, vigor or an unusual product if the world supports that response. Separate a stable variety or seed identity from that season's treatment/result. A saved observation is not proof of heritable breeding. Add genetics only if inheritance itself becomes a selected worthwhile question.

Repeatable laws do not require every individual catch or harvest to be identical. Conditions can produce a distribution, with stable world rules and actual retained outcomes. Unexpected findings can come from unfamiliar combinations, rare conditions, incomplete knowledge or genuine world-supported variation. Looking away, re-opening details or switching involvement should not reroll the physical result. A settled observation should not be re-proved by tedious experimentation every life unless a world rule actually changes it.

Discovery through routines must remain possible. A supported routine can retain an anomalous specimen or log a new sign; a helper can return an observation they actually made. The player's knowledge should come through that report/inspection, not magically inherit every hidden fact known by the helper. Reserve the unknown as unknown in previews and automation summaries.

## P9: ACCOUNT FOR NOW, connect outputs and sustained personal goals

For fishing, candidate uses include a useful meal, bait, a request, a collection or another world-supported consumer. For gardening, food, medicine, bait ingredients, ornament, seeds and teaching can matter where those routes exist. Two real uses with different consequences are deeper than ten decorative variants. Stock reserved for a meal is unavailable to a sale or experiment.

Quiet paths need continuity: a remembered favorite place, a notebook with actual findings, an improved method, a teacher/pupil relationship or a home garden shaped by this life. Community supply, preserving access or maintaining a local tradition can be a whole life intention. A commercial operation or institution is another intention, not the required endpoint.

Ecology and society should be explicit where they matter, without pretending to simulate everything. A seasonal catch table is not a breeding population. NPC demand is not proven by a sell button. Persistent depletion, stocking, pollination, disease, soil exhaustion and market saturation are separate possible rules, each worth adding only when it changes a selected decision. No universal scarcity, conservation mechanic or escalating world penalty is proposed.

## P10: ACCOUNT FOR NOW, show the next useful decision

A fishing place card can show known access/conditions and chosen method. Add a pond/bank inset for real reach, current, cover or device placement; otherwise named place cards suffice. Farming can use a small bed view for actual placement/coverage, with a compact row/card for ordinary equivalent plots. Keep the selected plant/catch detail nearby and use the notebook for hypotheses and experiments.

A routine summary should explain purpose, executing means, supplies/reserves, output destination and when to stop or ask. Example only: “Use this known method at the east bank until the meal request is supplied or the observed window ends; retain unusual catches for inspection.” Exact numbers and allowed requests follow the selected world. A plan should handle depleted stock, unavailable helper, changed access or an unmet prediction intelligibly. Do not pretend an inspection is a paid experiment or silently switch methods when supplies run out.

A calendar supports known seasonal windows and appointments, not clairvoyance. The log records notable causes and links to the activity; the notebook keeps durable knowledge. Avoid a notification per ordinary fish or watered tile. Respect OD4 pauses for important choices and only continue through supported policies/helpers/means. A player should be able to return to personal involvement without losing the routine's state.

At populated1366×768 preserve Proto23's player/inventory, focus/actions and full-height log relationship. Proposed homes: routine at its place, keeper services at an actual place, notebook as reference, proposed features in Projects until selected. Shared Back/Esc, free inspection, known-information limits and readable text remain. No new universal activity framework or shell.

## T1–T4: worthwhile next research, ranked

| Code | Named question | Best route and stop condition |
|---|---|---|
| T1 | Can spatial farming and automatic care share ordinary growing state? | **Completed source slice here:** Crop/HoeDirt plus existing sprinkler consumer. Stop before another complete Stardew audit. Native timing/feel remains later. |
| T2 | Does fish-derived bait change a useful fishing decision? | **Selected source gap narrowed here:** target identity, probability modifiers and fallback/retry consumer inspected. A full raw-fish→produced-bait identity resolver→equipped-bait admission→catch transaction still needs its exact join. Do not claim a native closed loop. |
| T3 | How does a cultivation game allocate care, growth and delegation? | Immortal Life retained growth/automatic-care tables support parameters, but actual native bodies/loader remain unavailable in the current method. ACS's recorded bulk source directory was absent in this pass. Locate an existing matching retained payload/extract before new decompilation; no redownload, install or inferred behavior from declarations. |
| T4 | Do breeding or ecological change add a worthwhile decision? | Only after choosing that question. First inspect existing crop/material/resource dossiers for the exact trait/consumer. A new title or broad decompile is unnecessary until a concrete gap survives that check. |

Decompilation is useful for costs, eligibility, ordering, state and output consumers. Screenshot sequences answer presentation; native trials answer timing, control and actual settlement. Do not use source breadth as a substitute for deciding which experience is worth building.

No runtime/source/style/test/build/save edits, installations, workers, messages, commit or publication. This document records proposals only. Any later implementation still needs G1–G4 from REPORT, including selection, rebuilt fresh-origin proof, persistence where changed and separate human acceptance.
