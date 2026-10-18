# Mining: preserve the current loop, deepen selected decisions

2026-10-15. Source review and unselected design/mockup proposal. No gameplay implementation, native play, save access or shared-owner edits. [Design viewer](mockups/index.html), [parity and implications](MOCKUP_PARITY_AND_IMPLICATIONS.md). Current flow and proposed additions are separate views in the viewer; all stock, progress, powers and helpers there are fixtures.

## MN1. Current flow, source-backed

```text
Relevant local access/activity becomes available
  → equip the pickaxe-category tool
  → select a known unlocked mining activity at its place
  → repeat a skill-scaled working cycle
  → qualifying Mining XP + probabilistic actual ore stock
  → stop / inspect stock / select a separate downstream use
```

`activities.js:156–163` defines Mining as Gathering with base skill Mining and required `pickaxe` slot. `start_activity` in `main.js:3515–3564` checks busy/save-owner boundaries, reads the local activity, checks the equipped slot, initializes progress and enters current work. The inspected tool check tests slot occupancy, not rock hardness, durability or pickaxe grade. Item descriptions of stronger tools alone do not prove those rules execute.

`LocationGatheringActivity` sets XP per completed work period. `LocationActivity.getActivityEfficiency` interpolates cycle time, output count/chance and optional quality from relevant skill. A basic known ore definition uses configured time40→15, chance0.4→1, count1→1–3, skill range0–15 and Mining XP1 per cycle. These are source endpoints in the game's activity units, not an observed session or wall-clock production guarantee. The inspected basic ore activity does not request a quality roll.

`main.js:9054–9117` uses the gather RNG stream, rolls actual items, records them and adds them to inventory, then resets cycle progress. `display.js:3919–3951` builds a gathering tooltip from the efficiency result; current work also exposes progress and XP information. Mining skill has Gathering mastery as a parent and an early Strength milestone in the inspected definition. Progress can unlock new activity options through the existing reward routes; no undiscovered site/material list is reproduced here.

`crafting_recipes.js:1178–1188` defines a separate low-quality ingot recipe: five low-quality ore plus one coal-category input, one ingot, Smelting-dependent success/level range. This is a demonstrated source consumer, not a performed craft or proof that every mined material follows that same recipe. Mining does not automatically smelt output.

Full selected source spans, input hashes and exact paths are retained in ignored `private/mining-flow/`. No mining-specific native test or source test suite was run. This review does not establish all availability/season/worker/save edge cases.

## MN2. What the current source does not establish

No spatial face geometry, finite-reserve depletion meter, tunnel construction, collapse system, hauling job, extractor coverage, autonomous device, sensing power or helper mining was established by this selected flow. Do not make existing mining require them. Higher output from numeric skill progression is real source behavior; a meaningful fracture technique is a proposed addition.

A described seam is not a measured ore body. Site ownership/access, exposed working face, reachable extraction area, rock volume, grade/composition, reserves and actual inventory are different facts. A small face diagram can support method/target choice without promising a voxel underground or physical surveying system. Where remaining quantity is unknown, say unassessed or omit it, rather than inventing an infinity symbol or exact reserve.

## MN3. A concrete optional path

A character can become a reliable local extractor, a careful surveyor, a supplier to a known smith or a teacher of useful extraction methods. One known seam and useful metal stock can sustain a path; a mining company or deep excavation is optional.

| Contribution | Proposed concrete decision | Limits |
|---|---|---|
| Personal skill | Read a visible fracture and choose controlled extraction instead of the ordinary method. | Must change real effort, accessible output or another selected consumer. No click-per-strike grind or unsupported fragment-quality statistic. |
| Learned knowledge | Distinguish a useful retained sample and communicate an established method. | One color variation is not a confirmed composition or richer reserve. |
| Power | Sense structure within a represented exposed face, or use a fitting separation force. | Sensing, reaching, extracting and transporting are separate effects; a genuinely stronger power can do more. No automatic power drawback or hidden reserve disclosure. |
| Discovery | Compare extraction method under matched accessible conditions; retain actual observations and specimens. | A routine/helper can notice an anomaly too. Repeatability need not mean identical output; unknown causes remain unknown. |
| Delegation | A helper first carries already-extracted unreserved stock to a real destination; mining requires a separate agreement/capability. | Haul is a proposal. Real actor, claim, inventory/custody and concurrent-work rules apply. No remote duplicate stock. |

**Example agreement:** carry unreserved ore from the known work apron to the collection point. Do not extract, smelt, buy supplies or enter unknown workings. Stop if access or delivery fails. The mock helper Nell is invented; she is not an existing available NPC.

## MN4. UI by involvement

The viewer includes a **Current flow** reconstruction that keeps pickaxe→cycle→XP/ore→separate use legible, then four proposed comparison views. It is not a screenshot of current gameplay.

| View | Useful focus |
|---|---|
| Personal | Known face, represented fracture, selected means and one method preview. Show Mining/tool contribution where relevant. |
| Routine | Current target, actor, cycle, actual stock/destination and a stop condition if such a policy is selected. No mandatory geometry. |
| Investigate | One changed variable, known conditions, retained sample and uncertain inference. Inspection is free; an actual survey/experiment is an explicit action. |
| Delegation | Extraction versus carrying permissions, actor availability, claim/destination, actual wait and report. A sensing overlay does not imply extraction coverage. |

The existing native gather loop has no goal-based stop policy in the inspected mining definition. A proposed stop at a recipe's required stock would need a real instruction consumer and reservation; stopping a prototype view does not implement it. A stage route should distinguish unextracted material, held ore, carried stock and usable ingots only when those separate states actually exist.

## MN5. More to account for, without expanding the engine by default

| Question | Disposition |
|---|---|
| Why pick this known place over another? | ACCOUNT FOR NOW: reflect actual access, output and skill/cycle differences first. Do not flatten places into identical yield cards. |
| How much space matters? | ACCOUNT FOR NOW: reach, working face and target scope can matter before total reserve volume. Use the smallest meaningful spatial model. |
| Can throughput stop somewhere else? | ACCOUNT FOR NOW: extraction, delivery, storage and use have separate conditions where represented. No storage limit or hauling tax is invented solely for balance. |
| What survives a switch, interruption or load? | LATER implementation: preserve actual progress, settled RNG/stock, claims and actor learning under the current owners. No view-driven reroll or duplicate reward. |
| Need depletion, wear, hazards, rights, underground geology? | LATER, only for a chosen worthwhile decision. Current source absence is not a defect or a requirement to import another game's economy. |

No new resource, technique, power, NPC, location, danger or rule was accepted or added. First useful implementation candidate, if later chosen, would preserve the current routine and add one useful method or inspection/consumer join, then prove its native behavior separately.
