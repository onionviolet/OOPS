# Gathering and connected resource uses

Design expanded 2026-10-02. The user requested broader existing-system depth, gatherable things and character interactions, then selected **broaden the design first**. These are original proposals, not implemented content or accepted balance. [PROJECT.md](../PROJECT.md) owns direction; [User vision](USER_VISION.md#broader-gathering-and-character-interactions-2026-10-02) preserves the request.

[Engine implementation scope](ENGINE_EXPANSION.md#gathering-and-character-interaction-implementation-scope-2026-10-02) now starts with native Village collection, an existing-craftsman exchange and one earned native activity. It distinguishes that medium-sized scene from larger production, actor, clock/site and offline work. The earlier guaranteed willow/sap outputs are archived; base access, pacing, XP and interface remain the baseline. These are refined proposals, not delivered gameplay.

This document owns gathering content breadth and the connections between a find, its acquisition method and its uses. [Wandering](WANDERING_ZONES_AND_INSIGHT.md) owns outing plans/discoveries; [granular systems](GRANULAR_SYSTEMS_AND_INTERACTIONS.md#g3-materials-and-logistics-need-owned-usable-outputs) owns material/tool/crafting distinctions; [characters](CHARACTERS_AND_WORLD_EVENTS.md#broader-character-interactions-2026-10-02) owns relationships and negotiated work. Existing runtime contracts remain in [Engine expansion](ENGINE_EXPANSION.md); this pass selects no new implementation queue.

The central loop is **notice something → choose how to obtain it → decide what to do with it → change a later opportunity**. Gathering mastery can improve identification, selective extraction, preservation, cultivation or access. Higher output remains useful, but mastery can also change which actions are possible.

## What the existing game supplies

Source inspected at `97c28efece4fd6248b6f075ad0c6927c3d0432df` on 2026-10-02:

| Foundation | Verified source declaration | Useful extension |
|---|---|---|
| Ordinary gathering | `src/activities.js` defines mining, digging, woodcutting, herbalism, animal care, harvesting and fishing | Extend these professions before creating a separate skill for every resource |
| Place, tools and proficiency | `src/models/location.js` declares activity access/seasons and calculates skill-scaled intervals, yield/chance and optional quality; `src/data/locations.js` declares location-specific outputs | Give selected patches meaningful access, methods and local conditions |
| Existing material chains | `src/items.js` includes ores, wood, herbs, flax, wool, fish and monster materials. `src/crafting_recipes.js` declares flax-to-cloth/string, wool-to-cloth, medicine and equipment recipes | Add alternate uses and discoveries to recognizable materials |
| Gathering with side finds | Forest lake woodcutting declares Piece of willow wood plus occasional Tree sap; its underwater silver vein has an unlock | Make observation and preparation matter to selected finds; general ecology is additional work |
| People already connect to work | The farm supervisor unlocks animal care/harvesting and accepts Bonemeal; the Longhouse scout has a timed Herbalism lesson unlocking local foraging | Extend concrete trades, lessons and work relationships, rather than treating every NPC as a new subsystem |

These are source findings, not a new runtime or full-content playtest. Generic cultivation, persistent resource patches, salvage appraisal and negotiated NPC relationships are not established by these declarations.

## Five resource families

The examples below are a catalogue of alternatives, not a request to add every item. A resource earns its place by enabling a useful choice.

| Family | Gatherable candidates | Methods and choices | Connections and later growth |
|---|---|---|---|
| **Plants, fungi and tended resources** | Herbs, fruit, roots, seeds, cuttings, bark, sap, fibers; optional cultures or useful insects | Bulk harvest, select an intact specimen, tap rather than fell, identify a lookalike, or establish a tended patch. A specimen, seed and prepared reagent have different uses | Cooking, medicine, textiles, dyes, bait and cultivation. Later worlds can add affinity-bearing plants or engineered cultures. Mastery can preserve potency or reproduce a useful trait |
| **Earth, water and salvage** | Ore, clay, sand, salt, pigments, crystals, wreck components, broken mechanisms and buried relics | Prospect before extraction; wash, quarry, dive, excavate or dismantle. Repair a recovered device or recover its parts. An unknown relic can be appraised before sale | Forging, glassmaking, construction, inscriptions and engineering. Later progression can reveal impurities, preserve complex components or safely extract difficult deposits |
| **Creature products and living specimens** | Existing meat, hides, bones and toxin glands; proposed eggs, feathers, shed scales, silk, secretions or live specimens | Hunt, track, capture, tend, shear, collect shed material or trade. Nonlethal collection can be available for selected species. Preserving a gland may conflict with maximum meat yield | Food, armor, fictional alchemy, research, taming and breeding. A live creature requires its own care/ownership design; it is not an ordinary stackable crafting ingredient |
| **Environmental and power resources** | Authored spring essence, storm charge, mineral resonance, dream residue, waste heat or compatible power cells | Collect in a suitable vessel, observe a safe window, use a device or arrange specialist collection. Some phenomena are usable only on site | Fuel, formations, laboratory work, devices and local advancement. A cultivation world's harvestable essence and a technological world's energy supply keep their own rules and strength |
| **Evidence, methods and opportunities** | Tracks, samples, maps, rumors, recipe fragments, observed techniques, introductions and site access | Observe, record, verify, compare, ask or earn permission. A physical sample/manual can be an item; its interpretation, learned method and permission are separate records | New routes, counters, teaching offers, commissions and contested discoveries. Learning a route does not grant its owner's permission; copying information does not consume the original |

Practical completeness means several useful approaches within a family, not fifty nearly identical herb names. Ordinary wood or flax can remain relevant in specialized handles, cordage, vessels or advanced composite recipes. Their late-game role should have an actual recipe or action, not just a description claiming usefulness.

## What makes two resources play differently

**Function and substitution.** Describe relevant properties such as flexibility, absorbency, conductivity, affinity or reagent role. Let an authored recipe accept a substitute with a clear change in output where useful. Some recipes genuinely require a particular material. Rarity, quality and suitability stay distinct: a common flexible fiber may suit a task better than an expensive rigid one.

**Method and preservation.** Selective harvesting can take longer but preserve a seed, intact part or usable sample; bulk work favors dependable supply. Better tools and mastery can reveal a new method. Limit freshness, delicate transport or vessel requirements to resources that create an interesting preparation choice. Ordinary inventory should not become constant spoilage management.

**Place and renewal.** Distinguish renewable work, slowly recovering sites, finite deposits and unique finds. A tended patch can improve future access; a rare bloom can offer a shortcut without becoming the sole mandatory progression source. Persistent depletion and regeneration need their own clock/save work. Native repeated gathering does not already prove finite patch ecology.

**Access and competition.** Wild resources, privately tended plots, leased mines and shared sites can have different permissions. A rival can discover the same deposit, a local can offer harvesting rights, or a community can ask for restoration. Named actors spend time and supplies under the character owner; competition does not secretly erase settled player cargo.

**Demand and discovery.** A commission can value an intact specimen while a cook needs bulk ingredients. A proven formulation can turn an overlooked material into a useful supply. Demand can change after an authored shortage or project; a generic sale bonus need not affect every merchant. A field guide can remember known uses and unresolved leads while leaving unknown properties undisclosed.

## Characters give finds a purpose

Connect resource choices to the same recurring people:

| Resource situation | Character interaction | Observable consequence |
|---|---|---|
| A craftsperson needs a particular wood property | Discuss substitutes, commission a part or bring a tested sample | Different finished tool or a retained recipe lead, not merely more affection |
| A scout knows where an uncommon plant grows | Pay for a lesson, share evidence or join a guided outing | Earn a gathering method or known route; permission remains a separate issue |
| A peer lacks a collection tool | Lend it, share the task or offer another workable plan | Actual custody and agreed yield change; returning it settles the obligation |
| Two people want the same specimen | Negotiate portions, preserve it jointly, trade claims or contest under known terms | Shared work, a specific grievance or an exclusive result that changes a later meeting |
| A grower needs a viable cutting rather than leaves | Preserve the living material and help establish a patch | A later supply source or access agreement, subject to an authored growth rule |

The player can also sell, keep, use or ignore a find. Other people's needs create options; every gatherable does not become a compulsory delivery quest. [The character expansion](CHARACTERS_AND_WORLD_EVENTS.md#broader-character-interactions-2026-10-02) develops friendship, teaching, cooperation and conflict beyond resource exchange.

## One connected outing to compare later

Original proposal: extend the existing wooded-outing idea with **willow wood, sap and one recurring route apprentice**. Forest lake's native outputs are a source for the materials, not proof that its combat/location entry is ready for the proposed outing controller.

Before leaving, the apprentice offers a stated division of work and collected sap. Gathering alone keeps the player's output; pairing up spends some yield on a defined benefit, such as reaching one supported collection pocket with the apprentice's tool or learning one selective collection method. The tool, access and lesson need actual costs and rules, not an unexplained party multiplier.

On return, the same sap can be kept for the existing Potion of sapping recipe if its real recipe/station/skill requirements are met, sold normally, or delivered under an original commission for a proposed resin-treated route marker. The new marker would improve one disclosed route function. Its recipe and effect are proposals; the native sap recipe is not automatically unlocked by finding sap.

If the player promised a share or borrowed a tool, settlement changes that apprentice's later offer. A failed outing allows an authored renegotiation or repayment route. The later meeting should refer to the actual delivery, return or dispute, rather than reset to the first greeting.

For a future playable proof, compare solo gathering and one agreed partnership, then use a real collected output and revisit the same character. Check saved ownership, promised shares, known methods and settled results across reload. Useful ordinary yield and one different later decision are the design gate. This proposal complements the existing outing/peer packets; it does not supersede them or select a second world, another prestige layer or implementation order.

Documentation only. No gameplay source, schema, bundle or personal save changed; no new build, test or browser result is claimed.

## Further connected considerations, 2026-10-02

Follow-up request: "other stuff to consider?" Continue design exploration. These five original refinements connect existing families rather than select another catalogue or implementation queue. Keep the accepted center action menu primary; changed locations, known leads, offers and plan status can appear there without requiring a map.

| Consideration | Proposed interaction and payoff | Design question to resolve in play |
|---|---|---|
| **Places the player develops** | Restore a grove, propagate a useful cutting, establish a collection shelter or improve a workshop. A place gains a specific capability: repeatable local supply, specimen preservation or a new production method. Residents may care about its use | Does investing materials/time change where or how the player works? Choose functional upgrades and stewardship terms, rather than adding compulsory upkeep to every location |
| **Information that can be investigated** | Appraise an unknown find, compare a guide with a witness, test a sample or trace an item's origin. Distinguish suspected property, verified use and unresolved lead. An old map may describe a route that has since changed | Can curiosity produce a usable lead through more than one route? Uncertainty should have clues or a way to investigate; essential requirements should not depend on guessing a hidden property |
| **Relationships between other people** | A mentor introduces a supplier, two friends disagree over a shared site, a rival's apprentice asks for help, or a grower and collector negotiate access. Their ties can create cooperation, divided loyalties and changed offers | Do other actors' relationships explain a visible action? Start with a small authored network; a favor does not instantly become universal affection or global reputation. Character/observer records retain authority |
| **Specialization and competing uses** | The same intact specimen can support research, a commission or cultivation; ordinary material can become equipment or shared infrastructure. A craftsperson can commission an escort while a fighter purchases preparation. A useful specialty creates opportunities without making every profession mandatory | Are several routes complete and appealing under different goals? If one use or build always wins, vary the actual task, demand or property fit. Show required amounts and consequences before consuming scarce inputs |
| **Earned convenience and recoverable setbacks** | After understanding a safe task, save a bounded routine such as gathering to a supply target while reserving seeds and stopping at a new discovery. A failed trip can retain a clue, allow a repaired tool or reopen a disputed agreement through repayment | Does familiar work become easier while new decisions remain reviewable? Show stop reasons and a return summary. Recurring windows, reasonable fallback routes and deliberate loss policies keep meaningful time from becoming a demand for constant attendance |

Place progression extends [homes and managed sites](RESEARCH_GENRE_SWEEP.md), while investigation reuses [G2 knowledge](GRANULAR_SYSTEMS_AND_INTERACTIONS.md#g2-distinguish-knowing-what-from-being-able-to-do-it). Social networks stay with [characters](CHARACTERS_AND_WORLD_EVENTS.md); automation and supported time stay with [idle/clock contracts](ENGINE_EXPANSION.md#3-simulation-time-scheduler-and-actor-context). These refinements do not establish ecology, autonomous populations, a universal belief system or closed-browser simulation.

An original continuation of the willow example: preserve a cutting instead of selling all the gathered material; negotiate a small planting site with a grower; consult a scout about its conditions; eventually gain access to one authored sap source. The apprentice may want immediate payment while the grower wants a viable specimen, creating a real allocation choice. Timing, growth requirements, yields and title/ownership rules remain proposals. Native source already declares a Camping supplies action unlocking Mountain camp (`src/data/locations.js`), a useful example of functional place development, not proof of generic gardens or workshops.

For any selected extension, compare the player's next action before and after its result. A changed route, usable method, specific relationship offer or supported routine demonstrates depth. More journal prose, item names or numeric bonuses alone do not prove that change. No new gameplay or browser result is claimed by this follow-up.
