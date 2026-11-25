# Game Idea Bank

Source: `~/Documents/Claude/Projects/Weibao's Workspace/plans/06_Projects/Side_Projects/Game_Idea_Bank.md`  
Port date: 2026-11-24. Ported with Weibao's yes.  
Everything below is a proposal under AD32, not a build decision. Non-game material (personal, career, course, scheduling, and process material) was left out.

This port keeps Weibao's quoted words verbatim and labels them as his. Interpretations and agent suggestions are labelled separately. The former source's personal-use research scope and workflow preferences are contextual material, not game concepts, and are not restated as proposals here.

## Progression-fantasy life simulation

**GIB1 · A text-based progression-fantasy life simulation.** A BitLife-like text game with saving, widened from cultivation alone to broader progression fantasy; regression and details from *Shadow Slave*, *Reverend Insanity*, *Lord of the Mysteries* (LOTM), and other Chinese novels are inspirations to consider.

**Weibao's words, verbatim (September 29, 2026):**

> I had the idea of a text based game like bitlife and stuff, save accordingly

**Working interpretation:** This is a text-based life simulation centered on broader progression fantasy. Specific mechanics, platform, and distinguishing features remain open. The named novels are inspiration references, not an agreed list of systems to copy. On September 29, cultivation and broader progression fantasy were both possibilities; on September 30, broader progression fantasy became the preferred direction.

**OOPS relation:** This idea continues in OOPS; its repo-owned direction is [LIFE_SIM_NORTH_STAR.md](../LIFE_SIM_NORTH_STAR.md), with related proposals such as `life-sim-north-star#B1` through `#B5` and `depth-dial-proposal#F2` in the atlas.

## AI and DNA recollection

**GIB2 · An uncertain AI/DNA modification and evolution game concept.** A recall placeholder only: the concept may not have been a game, and the original scope is unknown.

**Weibao's words, verbatim (September 29, 2026):**

> I once had an idea about dna modification and a evolution type game

**Current recollection (September 30, 2026):** Weibao remembers a concept involving AI and DNA, but has forgotten the details and is unsure whether it was a game. DNA modification and evolution are clues from the initial recollection, not confirmed requirements. Do not reconstruct a specific project from them.

**OOPS relation:** No matching DNA-modification idea surfaced in the atlas searches; this remains a separate, unrecalled concept. The broader nonhuman framing in `nonhuman-overarching-frame-2026-10-14#AR1` overlaps only at the subject of life forms, not at a DNA mechanic.

## Scale-growing war and progression game

**GIB3 · Grow from an individual fighter to interplanetary command.** A scale-growing simulation combining individual and technological power with war, production, and strategic command. It is banked and unranked; its setting, scope, and first playable slice remain open.

**Weibao's words, verbatim (September 23, 2026):**

> MAybe an idea where its like stellaris but you start as a small commander on a small planet and then slowly move upwards? From going from individual local war to inter continental to global so solar system to system wide and more? Can even start as a soldire in a FPS? or swordsman or like follow a little guy? That could be more of a simulation game, consider all the progression novels I am interested in, there can both be individual power and tech power but then the scope might be too wide

> I mean write down the directions we are interested, from BEyond all reasons RTS, to like HOI4/Call of war of units and factories, to stellaris and more? more to consider?

Weibao later confirmed that “zoom from world map to battle,” “grand strategy plus tactics,” and “soldier to commander” describe the idea.

### Working interpretation, not a locked specification

- The player's role could grow from one person or junior commander to squad, territory, planet, and eventually interplanetary or wider command. The same world persists across those stages, so early people, places, and choices can matter later.
- Two linked progression tracks are possible: personal power (skills, relationships, reputation, perhaps extraordinary abilities) and collective power (technology, factories, logistics, institutions, armies, fleets, and alliances).
- The reference range spans Beyond All Reason's visible RTS battles, HOI4 and Call of War's units and production, and Stellaris's empire scale. The desired connection is between strategic decisions and the battles or individual lives affected by them.
- A first-person soldier or swordsman opening is an option to explore, not a requirement. A tactical character view could carry early progression without requiring a full FPS.
- One possible simulation approach is to show the active location in detail while distant armies and planets use broader rules. This is a design suggestion from the original chat, not an accepted implementation choice.

**Open design questions:** What changes when command grows? How often can the player return to an individual battle or person? What is the smallest playable slice that proves an early personal choice still matters at planetary scale? Pacing, setting, and the balance between direct control and delegation remain open.

**OOPS relation:** Separate project; the bank says a new repo or an existing project such as `province-war` would own its state if built. OOPS has adjacent life-simulation direction (`LIFE_SIM_NORTH_STAR.md`) and world people/organization proposals (`world-completion-standard#S04`), but no matching scale-growing war board was found in the atlas search.

### Ebbtide reference and scale/control proposals (November 17, 2026)

These are agent suggestions from a Claude Code chat, not accepted decisions. Weibao asked whether Ebbtide could be a foundation, how to extend its scale, how individual control works, and what else to consider.

**Reference evidence:** Based on Ebbtide's Steam page only; unreleased, no date, not played. It is described as real-time zombie-survival strategy by ProjectAlive. Three scales are a 3D pixel-art street battlefield, a Los Angeles operations map of 15 districts (Hold, Crisis, Lost), and a world campaign. The page describes scrolling from map to street without a loading screen while the fight continues, losses carrying back to the map, and ammo/fuel supply being available only at held bases. Fire support from the top layer lands on the bottom one; the player can directly control soldiers, tanks, or helicopters. This is a reference for seamless zoom, live simulation, upward-flowing state, and direct control. It covers one theme and three scales; it does not answer how to make each higher scale a different kind of game. These observations are from marketing material, not gameplay verification.

#### Scale ladder

- **GIB3a · Change the verb at each scale.** D1: Fight, allocate, route and supply, set policy, or shape long-run trends at different levels.
- **GIB3b · Separate adjacent levels by space and time.** D2: A rough 10–30x ratio between levels was suggested.
- **GIB3c · Simulate detail on demand.** D3: Simulate downward only when needed and generate the local scene from stats with seeded generation.
- **GIB3d · Pass compact summaries between levels.** D4: Levels communicate with the one below through a small summary such as production, casualties, stability, and morale.
- **GIB3e · Let crises climb the ladder.** D5: A local outbreak, supply crisis, political crisis, or species-level crisis could move upward across scales.
- **GIB3f · Build adjacent levels before expanding.** D6: Fully build two neighboring levels before adding a third.

#### Individual control

- **GIB3g · Keep one persistent identity for each person.** C1: Low-scale units consist of individuals; high-scale units use a statistical distribution plus a few named notables. Promotion from statistical to named could use a stable seed so the same soldier returns.
- **GIB3h · Let the player possess a running entity.** C2: The player can inhabit any named person in the simulation; direct control is a lens onto an entity the sim already runs, not a separate mode.
- **GIB3i · Give each entity a control ladder.** C3: Direct control, specific orders, standing doctrine, and full delegation to an AI officer. Higher scales use upper rungs by default; zooming in drops to direct control.
- **GIB3j · Make attention scarce.** C4: Direct control uses command bandwidth elsewhere, where the map continues under doctrine; the player chooses where to be present.
- **GIB3k · Grow delegation quality from personal progression.** C5: Officers developed, trained, or befriended while playing individually can become the AI that runs things at higher scale. This links personal and collective power.
- **GIB3l · Bound the reward for direct play.** C6: Direct play can outperform auto-resolve within a cap, making zooming in a choice rather than a chore.
- **GIB3m · Use crises to invite zooming in.** C7: Lower scales can raise optional alerts, such as a notable being pinned or a base about to fall.
- **GIB3n · Continue control through death and succession.** C8: Control could pass to an heir, protege, or nearest officer, fitting regression and rebirth themes from progression novels.
- **GIB3o · Decide how personal power scales upward.** C9: An extraordinary person could become a strategic asset, such as a hero unit, doctrine, or cultivation school; decide whether personal power grows with the ladder or remains human-sized as collective power grows.

#### More to consider, ranked by possible design impact

1. **GIB3p · Conserve state across scales.** Casualties, supply, and population should reconcile between detailed scenes and summaries. Decide which layer is authoritative and add conservation checks.
2. **GIB3q · Define promotion and demotion for saves.** Decide what is saved (named IDs, relationships, history), derived on load (the crowd), and transient. Preserve old saves as content changes.
3. **GIB3r · Close cross-scale exploits.** Consider zooming in to cheese an unfavorable fight, zooming out to skip risk, and fast-forwarding past a crisis. Cap direct-play benefits and make time scale explicit (partly covered by C6).
4. **GIB3s · Keep generation deterministic.** Use a world seed and stable sub-seeds per scale and system so one generator change does not reshuffle everything; this also enables replayable bug reports.
5. **GIB3t · Define update order and time.** Use a clock abstraction with different tick lengths per scale. Define which scale reads before another writes, and what happens to a live fight while zoomed out at 4x.
6. **GIB3u · Make simulation causes inspectable.** A read-only cross-scale inspector could explain why a district fell, which individuals caused it, and what delegation decided. Keep inspection separate from cheat mutation.
7. **GIB3v · Let the setting determine the scale ladder.** Modern military, fantasy cultivation, and sci-fi imply different rungs. Pick one setting for the first slice. The combined progression-novel scope of personal power and technology risks becoming too wide, as Weibao noted.
8. **GIB3w · Match AI to each scale.** Tactical behavior trees or utility AI and strategic planners or policy models were suggested. Make each layer's perception explicit.
9. **GIB3x · Balance performance and information density.** Consider low-scale entity counts and how much each higher-scale UI can show without becoming a spreadsheet.
10. **GIB3y · Verify the reference before relying on it.** Ebbtide's release and reviews could test whether no-loading-screen zoom holds up. Wishlist and revisit; do not build on marketing claims.

#### Smallest playable slice proposal

**GIB3z · Prove one person changes the adjacent map.** Two adjacent scales only: a tactical scene with one controllable person and a district or territory map. Share control, supply, and casualties. Promote one named individual from a statistical soldier, play a fight, then show the outcome changing the map and persisting after save/load. This would test C1, C2, and the conservation proposal before adding a third scale. Setting remains open.

**Status:** The scale-growing game remains unranked, not accepted, and has no repository selected. If built, a new repo or an existing project such as `province-war` owns its state; this entry only records the ideas.

## Source notes

- Life simulation: September 29 and 30, 2026 Codex chats. The October 7 link records that the YAIRPG expansion continues this idea; its repo owns its state.
- DNA recollection: September 29 and 30, 2026 Codex chats. Retained as its own concept; no connection to the other ideas was specified.
- Scale-growing war game: Local Codex transcript `01a0cfbd-a649-79a1-ad8f-312cd468ff4e`, September 23, 2026, “Find games with deep tech trees”; Weibao confirmed the framing on September 27. The Ebbtide addendum came from a Claude Code chat on November 17, 2026.

## Changelog

| Date | Description |
|---|---|
| 2026-11-24 | Ported Weibao's game ideas and separately labelled interpretations and unaccepted agent suggestions. |
