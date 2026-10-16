# Other procedural systems and general opportunities

Date: 2026-10-16. Weibao asked: "Other procedural thing to consider? Other things
the game could make use of in general?" ([USER_VISION](USER_VISION.md#other-procedural-systems-and-general-opportunities-2026-10-16)).
This is a palette, not a spec. Nothing is selected or dispatched.

**Coverage note.** The [procedural status map](PROCEDURAL_GENERATION_STATUS_2026-10-13.md)
and [idea index](IDEA_INDEX.md) already own most topics: storylets, people, secrets,
lore, storyteller, rivals, cosmic events, genetics, resources and crafting. This
doc does not restate them. It focuses on two things:

- systems that reuse the patterns the [crafting engine](CRAFTING_ENGINE.md) and
  [making rules](MAKING_RULES.md) just proved;
- general tooling the game lacks.

A keyword scan across `docs/` was not informative, because almost every topic is
mentioned somewhere. Rows marked *(overlap likely)* should be folded into their
owner rather than built twice.

## The reusable pattern

The crafting work established a shape that fits most generators:

- **families** with integer ranges and correlations;
- **overlays** by tag (core, world, region, person);
- **freeze on reveal**;
- **three separate chance sources** (world truth, per-attempt execution, rare authored exceptions);
- **observer projection** for anything shown;
- **receipts** that explain why.

New procedural systems should use this shape (GR1-GR17, MR1-MR5, MR31) rather than
inventing a fresh draw or freeze. `generateMaterial` in `src/craft_materials.js` is
already a general "trait bundle from a family" generator. Extract it into a shared
helper only when a second real consumer arrives (AXR1, earn it twice).

## PG. Other procedural systems

| Code | System | What gets generated | Reader that makes it matter (GR12) | Notes |
|---|---|---|---|---|
| PG1 | Needs-driven commissions and bounties | Requests from actual NPC needs: a healer lacks a salve, a farmer has pests, a sect needs a pill | Crafting, harvesting, combat and reputation | The strongest reader for the crafting engine. No quest exists unless a real need does. |
| PG2 | Regional fauna and enemy variants | Creature families with ranges and correlations per region, like material families; habitats, behaviors, parts | Combat, harvesting (living donors) and drops | Canon creatures stay pinned (MR25). *(overlap likely: enemy systems research)* |
| PG3 | Markets and restock | Shop stock as regrowing source nodes; prices from scarcity, quality and the merchant's knowledge | Trading, crafting inputs and economy | Reuses `craft_sources.js` nodes; an expert's offer is a clue (SP12) |
| PG4 | Weather and seasons per world calendar | Daily weather and season state keyed by game day | Harvest gates, travel, mood and events | Shares WR9 calendar. *(overlap likely: P8 ecology, `weather.js`)* |
| PG5 | Rumors and news | Statements over fact IDs with a source and reliability; some are false | Leads to spots, people and events (RS11) | Text is grammar over facts (GR15); false rumors never change truth |
| PG6 | Disease and remedy | Illness families with routes, stages and resistances | Potions and body ledger (PD1), people simulation | Pairs naturally with potions; contagion spreads through real contacts |
| PG7 | Places inside canon nodes | Stalls, rooms, camps and benches with stock and occupancy | Services, harvesting and events | Fill layer only: never new canon landmarks |
| PG8 | Names and languages per culture | Name grammars shared by people, materials, potions and places | Every display | One naming owner (E6) instead of per-feature name lists |
| PG9 | In-world documents | Recipe notebooks, letters, notices and ledgers, frozen once written | Knowledge routes (WR5), clues and trade | Annotated copies carry provenance (PD12) |
| PG10 | Festivals and recurring events | Per-world calendar events with local variation | Markets, social and storylets | Era-bound in canon worlds (RS9) |
| PG11 | History layers and ruins | Past events that leave sites, artifacts and grudges | Exploration, resource spots and rivals | Respects causal commitment (GW5) |
| PG12 | Omens, dreams and visions | Signals tied to storyteller state and sealed secrets | Foreshadowing and cheats | Route-gated; never leaks a secret's truth |
| PG13 | Insignia and appearances | Faction marks and per-save looks for unknown items | Recognition without truth | `product_appearance_*` already does this for mixtures |
| PG14 | Titles and deeds | Titles generated from actual recorded deeds | Titles owner (E4) | Never awarded for things that did not happen |
| PG15 | Expedition layouts | Abstract node graphs (routes, rooms, hazards) rather than tile maps | Expeditions | Dungeon maps stay backburnered; graphs give most of the value |

## GN. Things the game could use in general

| Code | Tool or system | Why it helps |
|---|---|---|
| GN1 | **World atlas and generator inspector (dev)** | See canon anchors versus generated content, evidence labels and "why this?" receipts in one view. Sealed truth stays hidden outside dev. Extends crafting L4. |
| GN2 | **Content pack validator CLI** | Checks citations, exclusions, calendars and revisions for every pack before it loads. Extends crafting L5. |
| GN3 | **Headless balance simulator** | Runs the idle economy for N game days to find runaway loops, free duplication (MR5) and dead ends before players do |
| GN4 | **Replay and determinism harness** | Records commands and replays them to prove the same results (A5, MR34) |
| GN5 | **Named scenario saves** | Load a labelled test state in one step, with DEV SEEDED marking (UI rules) |
| GN6 | **Secret-safe save inspector** | Explains a save through the player's projection, useful for bug reports without spoilers |
| GN7 | **Player codex generated from knowledge** | Glossary, bestiary, herbarium and recipe book built from what the player has actually observed |
| GN8 | **While-you-were-away digest** | Summarizes idle results and stop reasons (builds on `away_ledger.js`) |
| GN9 | **Spoiler-free hints** | Points at reachable but unused mechanics without revealing truths |
| GN10 | **Localization pipeline** | Name and text grammars per locale (`locales/` exists) |
| GN11 | **Performance budgets** | Per-generator budgets (GR11) with a profiling check in tests |
| GN12 | **Data-only player packs** | Packs are pure data, so a later option could load user packs without running code. Validation (GN2) is the gate. |
| GN13 | **Branch and undo saves** | Builds on the [branch save research](research/PROFILE_AND_BRANCH_SAVE_SHAPE_2026-10-14.md) |

## Dispositions

**ACCOUNT FOR NOW**

- **A1:** every new generator uses the reusable pattern above and the GR and MR rules. No fresh draw or freeze code.
- **A2:** rows marked as overlaps fold into their owner, not this doc.
- **A3:** weather, markets and calendars should share one world calendar context (WR9) and one source-node model.

**LATER (proposal ranking)**

1. PG1 needs-driven commissions, because they give crafting and harvesting a reason to exist in play.
2. PG3 market restock on source nodes.
3. GN1 plus GN2, the atlas and validator, so canon fidelity and generation stay checkable.
4. PG2 regional fauna on the family generator.
5. GN3, the headless balance simulator.
