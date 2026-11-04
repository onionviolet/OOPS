# PF1 data: what is worth absorbing (2026-11-04)

Proposal, not accepted direction. Weibao: "We can absorb and improve
accordingly, for stuff worth having, add to list?"

Inputs:
- The Foundry PF1 and PCGen clones, plus the d20pfsrd and Archives of Nethys
  sets in the [d20 receipt](D20_RULES_COLLECTION_2026-11-03.md). All are
  private and paraphrased only (WA2).
- The counts come from a local script over `private/repos/foundry-pf1/packs/`.

The test for "worth having": a row qualifies if it adds a mechanism the engine
lacks, or calibrates a seam that already has a consumer. Bulk content import
does not qualify. Source numbers are calibration points, not law (AD49), and
the engine owns verbs while worlds own nouns and numbers (WA5). Where a row
overlaps the [afflictions palette](../../AFFLICTIONS_AND_WEAPON_PROPERTIES_CONSIDERATIONS_2026-11-03.md),
it cites that palette's code instead of opening a new one.

## Foundry pack census

| Pack | Records | Notes |
|---|---|---|
| spells | 3,028 | level per class, for 28 class lists |
| class-abilities | 4,673 | class features |
| items | 1,691 | 525 gear, 398 adventuring, 188 wondrous, 93 clothing, 73 food, 58 trade goods, 53 tools; prices and weights |
| weapons-and-ammo | 499 | 402 weapons, 97 ammunition |
| feats | 390 | |
| technology | 274 | 27 cybertech, 17 pharmaceuticals |
| ultimate-equipment | 269 | reference pages, including weapon, armor and shield special abilities |
| monster-templates, template-abilities | 198, 188 | |
| buffs | 185 | bonus types: 108 untyped, 40 competence, 26 morale, 10 luck, 9 alchemical, 8 sacred, and others |
| races, classes, racial HD | 80, 49, 13 | |
| armors-and-shields | 70 | |
| mythic-paths | 6 | |
| skills | 50 | |

The Foundry data has no affliction pack. Poisons, diseases and curses come
from the d20pfsrd pages and the 345 Archives of Nethys poison-trait records.

## Candidates

Seam paths are under `src/`. The owner is the session that wrote that seam
unless stated otherwise.

| ID | Candidate | Data | Target seam and gap | Overlaps | Disposition | Done check |
|---|---|---|---|---|---|---|
| PFA1 | **Exposure without a wound.** Contact, ingestion and inhalation sit beside injury. A meal, a cloud or a doorknob can expose a body, by how the agent actually travels (AD38) | d20pfsrd poisons and drugs; 345 AoN poison-trait records | `affliction_track.js:90-94`: `exposuresFor` matches only `r.wound` routes, so a non-wound source cannot expose | AFW1, AFW39, AFW-L3 | ACCOUNT FOR NOW: handed to the seam owner | A focused test: a swallowed dose exposes with no wound; a sealed mask blocks an inhaled route |
| PFA2 | **A timing dial: frequency and cure.** Default: PF2 stages. Dial: PF1 timing. The poison or disease checks at a set frequency for a set duration; each failed save applies its effect (ability damage, a condition); N consecutive successes cure it. Same seam, one more dial (AD51), no parallel module | d20pfsrd poisons, diseases and curses; calibration only | `affliction_track.js`: `advance` only shifts stages by degree; it has no frequency, per-failure effect or consecutive-save cure | AFW1 (maxDuration), AFW-L3 | ACCOUNT FOR NOW: handed to the seam owner | A test: a disease that cures after 2 consecutive saves, and a poison that ends after its last frequency tick |
| PFA3 | **Typed bonus stacking.** Bonuses of the same type do not stack (the highest applies); untyped ones do. This makes many buffs combine sensibly without a pairwise list | 185 Foundry buffs with bonus types | `active_effects.js:31-35`: `group_tags` keeps the highest in a group, but removal and priority are still a todo | none | LATER/DELEGATE: runtime owner, medium effort | Two morale bonuses give the higher one; morale plus luck add together; a save round-trips |
| PFA4 | **A spell's tier per tradition.** The same spell sits at different tiers for different teachers (a cleric at 1, a wizard at 2). It is a fact about who teaches it, not about the spell | 3,028 spells with level by class | `spell_seam.js`: rows carry origin, prepare, failure and strain, but no tier per tradition. Consumers: the HP and LOTM adapters, and the 20-spell SRD 5.2.1 pilot in `data/srd521/` used by `dnd_phandalin_domain.js` | none | LATER/DELEGATE: spell seam owner, small effort, when a world teaches one spell through more than one tradition | An adapter reads a tier for a tradition; an unstated tier is listed under `unstated` |
| PFA5 | **Condition ladders.** Fatigued then exhausted, shaken then frightened then panicked, sickened then nauseated: a source steps a body up one rung | d20pfsrd conditions page; the SRD 5.2.1 conditions held | the SRD pilot holds 15 flat 5.2.1 conditions | AFW10, AFW-R4-5, AFW-L4 | ACCOUNT FOR NOW: already AFW-L4, so the PF1 ladders are its calibration | as AFW-L4 |
| PFA6 | **Hit and crit riders on weapons and armor.** Energy on hit, bleed on a hit (wounding), extra effect against one kind of creature (bane), fortification that ignores crits | 184 weapon and 117 armor ability pages | `material_corrosion.js` holds only rusting | AFW14, AFW19, AFW25, AFW-L2 | ACCOUNT FOR NOW: already AFW-L2; bleed feeds AFW14 | as AFW-L2 |
| PFA7 | **Price and weight calibration for ordinary goods.** Food, tools, clothing, trade goods and gear with list prices and weights, for making and trade worlds | 1,691 Foundry items | economy and making seams: no shared d20 price table | economy palette | LATER/DELEGATE: making or economy owner, small effort | A world's price table cites PF1 rows as calibration and labels them `supplement` (WA3) |
| PFA8 | **Templates as layers on a creature.** Ghost, lich, half-dragon, vampire and so on: a stack of changes applied on top of a body, removable or permanent | 198 templates, 188 template abilities | the identity-layer palette (PJI) and the bloodline seams (AB12) | PJI layers, AB12 | LATER/DELEGATE: bloodline or transformation owner, when a world needs one | One template applied to and removed from a test creature, with what it changed listed |
| PFA9 | **Pharmaceuticals and cybertech.** Doses with side effects, and implants that cost body capacity | 17 pharmaceuticals, 27 cybertech | the affliction seam (doses) and AB21 capacity | AFW1, DL76 (Shadowrun) | LATER: when a technology world is picked | |

Not worth absorbing in bulk, because they have no mechanism and no consumer:
the class abilities (4,673), feats (390), races and classes, mythic paths,
roll tables, macros and basic monsters. Use them as a lookup during a world
pass.

## Handoff

The seam changes for PFA1 and PFA2 touch files this session does not own.
They are handed to the seam's owner through the shared notes folder, and
nothing in `src/` was changed. There are no data gaps in the Foundry clone to
add to wishlist W11. PF1 affliction text comes from d20pfsrd, which is
already held.
