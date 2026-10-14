# Generated dungeon content inside authored maps

Status: PROPOSAL N10, 2026-10-14. Procedural layouts remain backburnered by this task. Original fictional examples. Uses [CONTEXT](CONTEXT.md), [P5 X8](../p5/EXTRA_IDEAS.md) for the layout distinction and [REPORT gates](REPORT.md#future-gates).

**Value:** returning to an authored route can offer a different expedition purpose, inhabitants, evidence, hazards and recoverable objects, while keeping navigation trustworthy.

**Cost:** medium for authored-slot population, high for persistent expedition/occupancy changes. Dependencies: P1 encounter/loot scopes, P3 causal event content, P4 bound inhabitants, P8 resource slots, N3 creature packages, D8 history and existing encounter/lock/container/object owners. No new maze generator or universal encounter editor is needed.

Shown/SOURCE: `src/models/location.js:335-381` generates authored encounter groups, not geometry. Stated [P5](../p5/EXTRA_IDEAS.md) reconciles broad dungeon aspirations with the explicit layout deferral. Inferred extension: content slots can vary independently of authored adjacency.

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
