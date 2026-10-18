# Generated dungeon content inside authored maps

Status: PROPOSAL N10, 2026-10-14. Procedural layouts remain backburnered by this task. Original fictional examples. Uses [CONTEXT](CONTEXT.md), [P5 X8](../p5/EXTRA_IDEAS.md) for the layout distinction and [REPORT gates](REPORT.md#future-gates).

**Current focus, 2026-10-16:** Weibao prioritized consideration of ruins and
world/environment over NPC-heavy procedural work. The expanded consideration
below is design only. D1–D5 preserve the earlier proposal; their NPC/helper options
and first-slice example are not prerequisites for this focus. The later world-first
candidate is proposed, not selected implementation. Procedural layouts stay deferred.

**Value:** returning to an authored route can offer a different expedition purpose, inhabitants, evidence, hazards and recoverable objects, while keeping navigation trustworthy.

**Cost:** medium for authored-slot population, high for persistent expedition/occupancy changes. Dependencies: P1 encounter/loot scopes, P3 causal event content, P4 bound inhabitants, P8 resource slots, N3 creature packages, D8 history and existing encounter/lock/container/object owners. No new maze generator or universal encounter editor is needed.

Shown/SOURCE: `src/models/location.js:335-381` generates authored encounter groups, not geometry. Stated [P5](../p5/EXTRA_IDEAS.md) reconciles broad dungeon aspirations with the explicit layout deferral. Inferred extension: content slots can vary independently of authored adjacency.

Current standing decision principles: [site/exploration rules](../../../../SITE_AND_EXPLORATION_RULES.md)
SR1–SR24. The [library, temple, mine/cave and map expansion](LIBRARIES_TEMPLES_MINES_CAVES_AND_MAPS_2026-10-16.md)
adds the requested site families and information routes as domain proposals.

## D1: authored slot contract

An authored map defines stable node/edge IDs, supported actions and eligible slot types. The generator fills only declared slots: occupants, resource patches, evidence, recoverable objects, camps, puzzles assembled from validated primitives, hazard episodes or requests. `expedition = {id, endpointRef, authoredMapRevision, causeRef, contentEpoch, slotAssignments, claimedObjects, occupantRefs, dynamicReceipts, drawReceipts, knownView}`. Store assignment at first admitted expedition, not on room render. Slot compatibility accounts for world law, physical capacity, reachable prerequisite/counter and authored exclusions.

Map affordances remain authored: a hazard can close/open a declared edge through an actual effect, but cannot generate a new corridor. A riddle is valid only if its answer is tied to accessible evidence; generated wording cannot choose the solution after the player guesses. Loot uses real object custody and the appropriate saved stream; quality doesn't reroll on leaving the room.

## D2: first slice

One original authored two-stop cellar route has a work alcove and a store room. Admission chooses a supported pest-disturbance or abandoned-work context with coherent evidence and a useful salvage/repair action. Hero can inspect, use a qualified helper, clear through supported means or withdraw. Current map and exits stay fixed. One assignment changes preparation and reward through a real consumer, with no promise of full puzzle/combat generation.

## D3: persistence and return

Consumed salvage remains consumed. A killed/departed persistent inhabitant stays gone unless a real repopulation cause creates a new arrival. Site-local adjectives can allow renewable, rapidly replenishing, sparse or permanently altered content. A new epoch requires that world's cooldown/population/story cause and retains old history; reload/travel alone cannot create it. Future repeatable magical dungeons can support explicit regeneration without a fixed once rule.

## D4: future gates

Validate every assignment against authored slot capacity, reachable counters and exit connectivity; prove altered preparation and a useful withdrawal route. Save/reload mid-expedition and after claimed loot; Export/literal-file Import retains all assignments, objects, inhabitants, draw receipts and next eligible epoch. Content/map revision mismatch rejects or migrates explicitly, never resets the expedition into fresh treasure. No hidden slot counts or future puzzle answers in previews/debug/accessibility. Rebuilt desktop proof is required for a later implementation; no P11 runtime gate ran.

## D5: further content

Expedition sponsors, rival teams, prior explorers' marks, safe camps, site histories, excavation permits, salvage rights, staged boss preparation and research samples can fill authored affordances. Enemies and traps may cooperate through actual actor means. Multilevel layouts, infinite geometry and cross-map pathfinding stay outside this packet; these options remain in their backburnered owner for later selection.

## Ruins and world-first consideration, 2026-10-16

**Direction:** [Weibao's later instruction](../../../../USER_VISION.md#procedural-focus-ruins-and-world-first-2026-10-16)
deprioritizes NPC-heavy systems because of their implications and implementation
cost. Focus this procedural design pass on ruins, exploration and world/environment
systems. **No implementation yet.** The direction is accepted; all detailed
mechanics, rankings and examples below are proposals. This does not suspend other
active delivery or authorize a new map generator.

### R1–R5: what matters most

1. **R1 A place has a function, then a condition.** Begin with what it was for:
   storage, study, transport, water supply, shelter, manufacture, worship or
   cultivation. A past change and present environment explain surviving tools,
   evidence, hazards and resources. This creates coherent places rather than
   unrelated rooms, enemies and treasure.
2. **R2 Visiting changes what the player can do.** Salvage a useful material, learn
   a supported method, repair local apparatus, establish shelter or restore access.
   A paragraph of history and a generic coin reward are insufficient as the only
   payoff. The player's own exploration and crafting goals can motivate the trip;
   an NPC commission is unnecessary.
3. **R3 Preparation and approaches change a decision.** Information, light, tools,
   containers, protective equipment and supported powers should matter through
   actual effects. Observe, bypass, repair, extract, study or withdraw where those
   verbs exist. Do not turn every ruin into a combat dungeon or a compulsory puzzle.
4. **R4 The site remembers.** Opened access, removed objects, damaged mechanisms,
   collected samples and learned observations persist. Returning should recognize
   actual changes. Renewal needs a real world/site cause; entering or reloading
   does not refill a chest. This is not a universal once-ever resource rule.
5. **R5 Keep the first system local.** One authored site with a small connected
   set of changes can demonstrate the experience. Full history generation, living
   civilizations, climate simulation, dynamic factions and generated geography
   are not prerequisites. Supported background abstractions must be labeled.

### W1: a bounded site model, not a new world simulator

Proposed design chain: **region and world law → former purpose → bounded past
change → present condition → surviving evidence/resources → supported approaches
→ persistent aftermath**. Existing history, resource, expedition and knowledge
owners retain their data. This is a way to compose one site, not a new runtime
schema or requirement to simulate centuries.

| Aspect | Useful variation | Constraint or consumer |
|---|---|---|
| Placement | Within an authored site, original region or explicitly permitted fill | Canon gaps do not authorize new named landmarks; tie a place to a reachable route |
| Former function | Storehouse, workshop, observatory, waystation, garden, waterworks | Determines eligible apparatus, traces and useful materials |
| Past change | Abandonment, flooding, disrepair, repurposing or a supported disaster | One coherent cause can explain several present features; avoid random catastrophe by default |
| Present condition | Dry/damp, exposed/sheltered, lit/dark, functioning/broken | Condition changes supported work, preservation or safe access, not merely description |
| Evidence | Wear marks, sediment, tool placement, records or structural remains | Supports an observation or interpretation; not every mark is a secret code |
| Resources | Salvage, cultivated survivors, deposits or a supported renewable patch | Bound quantity, access, extraction effects, identity and actual use |
| Apparatus | A damaged station, reservoir, lens, bench or transport mechanism | Repair restores a declared local function; no magical universal crafting bonus |
| Hazards | Poor footing, exposure, unstable work surface or supported contamination | Telegraph known signs and means to assess risk; causal counter/withdrawal route |
| Aftermath | Open passage, functioning station, emptied stock or altered environment | Save through existing owners; later consumers read the same changed state |

Variation should alter decisions. A wet versus dry store room can change material
condition and useful handling; five decorative wall colors need not each become
a gameplay subsystem. Sample compatible combinations, with named fallbacks when
constraints fail, rather than independent adjective rolls that contradict one
another. The same cause should explain more than one clue without making every
observation redundant.

### W2: exploration can give crafting its purpose

Proposed loop: **notice something → investigate enough to plan → prepare → enter
and act → recover or learn something useful → use it → return under changed conditions**.
The player can seek materials for their own experiments, a place to work, a useful
technique or a better route. None requires a simulated customer or market demand.

Crafting can support a light source, suitable container, replacement component or
other declared equipment. Only charge for preparations a consumer actually reads.
Avoid a shopping checklist where every trip consumes the same five items. A
supported power may bypass an obstacle or replace a tool; honor its means rather
than inventing universal anti-magic walls to preserve the intended puzzle.

Rewards can be material, procedural knowledge, apparatus access, shelter, route
access or a discovered resource. A recovered method needs actual study/learning
support, not automatic mastery from picking up a book. An apparatus should be
useful within known limits, not necessarily portable. Ordinary materials can be
valuable because of their condition or use, without every ruin containing a
legendary artifact. Full condition simulation is optional; add properties only
when a selected consumer uses them.

Extraction can create a meaningful tradeoff: dismantling usable apparatus may
yield parts but remove its local service; damaging a support can affect access
only if that dependency is modeled. Warn through known consequences or uncertainty.
Do not imply arbitrary destructive freedom before supporting object/structure
effects, and do not silently add permanent traps to the first exploration slice.

### W3: discovery and history without a living cast

Reuse [history H1–H5](../p14/HISTORY.md): authored past, generated background,
lived outcomes and attributed accounts remain distinct. A few frozen causal
facts and surviving objects can explain a site without generating its founders,
descendants, current rivals or entire civilization. Filling an old name later
does not spawn a living NPC, legal claim or quest.

Separate observation (a waterline), interpretation (the chamber flooded) and
tested understanding (operating a mechanism changes water level). Learning a
useful local rule is rewarding even if there is no grand revelation. Handwritten
records can be incomplete or wrong. Meaningful clues should have supported
inspection and interpretation routes; cryptic prose alone is not a fair puzzle.

Stable unknown facts and already consumed causes must survive later investigation.
Lazy detail fills only genuinely uncommitted gaps within the existing history
constraints. Do not choose the ruin's cause to match the player's latest theory.
No sealed truths, hidden chamber counts or unexplored rewards appear in summaries,
route previews, sorting, accessibility labels or developer reports to the player.

Site discovery, entrance access, surveyed extent and understood function are
different states. Knowing where the entrance is does not reveal the whole site.
Maps/notes can record observed routes and signs. A player's attempted approach
can reveal that they lack means without identifying every hidden alternative.

### W4: other world systems worth considering beside ruins

The [world/site palette](WORLD_SITE_PALETTE_2026-10-16.md) expands world families,
discovery stages, useful outcomes, restoration tradeoffs and subtle interactions.
It is a supporting proposal under this owner, with no implementation selected.

| Candidate | Why it belongs here | First boundary |
|---|---|---|
| Natural sites | Springs, caves, groves, exposed strata and unusual habitats support exploration without lost civilizations | One site, useful action and coherent resources; no full terrain generator |
| Working old infrastructure | An intact shelter or neglected station provides function without mandatory disaster | A supported local service, with explicit upkeep only if meaningful |
| Regional resource character | Known materials and site conditions make destinations worth choosing | Use existing family/source owners; do not generate a new species for every coordinate |
| Local weather and seasons | Rain, light, growth or water level can affect selected opportunities | Reuse world calendar/weather context; climate and fluid simulation are unnecessary |
| Environmental succession | Regrowth, exposure or recovery makes returns meaningful | One explicit supported transition on declared world time; do not simulate an ecosystem by implication |
| Survey and field notes | Remember known routes, observations and tested methods | Extend existing knowledge/notebook consumers; no omniscient atlas |
| World-specific anomalies | A local world law can create a different exploration problem | Qualify its law, signals and actual counter/use; do not make every anomaly a sealed plot twist |

These are a palette, not cumulative prerequisites. Keep peaceful, intact and
ordinary places alongside ruins so all worlds do not become the same fallen
civilization. Culture and world law should change what a place does, what survives
and what means work there, beyond changing nouns. Canon adaptations need source
qualification; original examples are not evidence for a franchise rule.

### W5: limits that keep world-first genuinely smaller

An abandoned site is not automatically ownerless or free to loot. Preserve any
authored access/ownership rule and distinguish unknown ownership from none.
Use a simple existing boundary where relevant; do not add heirs, permits, police
and political simulation as mandatory support for the first site. NPC occupants,
faction responses, competing explorers and merchant resale can remain later
consumers. Ordinary combat variants are also optional.

Weather changes and natural regrowth follow actual world time and the accepted
pause/absence policy, not panel opens or wall-clock login penalties. Safe known
surveying or harvesting may eventually queue; a new hazard or important discovery
requires a choice under existing direction. Revisit state may be unchanged, and
that is valid. Do not manufacture incidents to make every return eventful.

Coarse site capacities, a few condition states and bounded authored transitions
can support depth. Fluid simulation, structural physics, erosion and universal
ecology would add a different order of implementation cost. Do not quietly
reintroduce the same complexity the NPC deprioritization is intended to avoid.

### W6: proposed first candidate and evidence boundary

The [detailed workshop and spring/grove journeys](WORKSHOP_AND_NATURAL_SITE_JOURNEYS_2026-10-16.md)
preserve the requested deeper examples, world variants and interactions. They
expand this candidate without selecting a build or changing its open gates.

**Original example:** an abandoned worksite inside an eligible authored/original
location has an accessible work area and an obstructed storage area. Observable
wear and water damage explain the condition. Supported inspection gives enough
information to choose between recovering loose useful materials now and preparing
a repair that restores access or a working station. The recovered material has a
real existing crafting use. The repaired function is read by a real action.
Return shows the access/repair and exact remaining stock. No issuer, public
reputation, simulated supplier, new canon landmark or generated adjacency needed.

Exact material, apparatus and obstacle must be chosen from supported consumers
before implementation. If a player can only inspect and collect, label that
smaller result honestly. Do not report repair, environmental history inference
or material use as delivered merely because a description mentions it.

Proposed order: establish one site's purpose, actionable condition and useful
payoff first; then add a meaningful preparation/approach choice; then consider
regional variation or a supported time-based return change. Do not launch a world
factory or generic ruin engine before this loop has a reader.

Existing [structured expedition metadata](../../../../../src/structured_expedition_runtime.js)
already connects discovery, preparation, approach, retreat and extraction through
shared simulation commands. It owns no independent inventory, timer or reward
dispatcher. This is a source reuse lead, not proof that the example is supported
or playable. Check actual selected commands and their consumers before reuse.

For future player-facing work, target **1366×768** and use the existing place/Focus
and reference homes under [UI rules](../../../../UI_RULES.md). Known actions and
conditions should be readable while the log remains intact; details expand
without exposing undiscovered contents. Back/Esc and a real retreat path must
remain clear. No new UI is built here; mobile and generated geometry stay deferred.

Future proof should show changed preparation or approach, useful output/function,
honest uncertainty, withdrawal and persistent aftermath. Save/reload/import must
retain assignments, consumed objects, access, repair, next draws and any time-based
transition. Source invariants can check compatibility and resource conservation;
rebuilt fresh-origin desktop play and the player's feel judgment remain separate.

**This pass:** design and priority reconciliation only. Local owner/source reads,
documentation edits and link/format checks; no implementation, runtime tests,
build, user-save access, commit or push. Existing deep commissions work is retained
in [its owner](REQUESTS_AND_MARKETS.md), with current deprioritization stated there.
