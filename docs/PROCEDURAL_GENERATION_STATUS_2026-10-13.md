# Procedural and generative systems: status map

Date: 2026-10-13. Read-only survey of live `src/` and design docs. No runtime edits, build, browser run or tests. Proposals here are not accepted decisions. Sealed secrets are referenced by ID only.

Direction sources: [USER_VISION](USER_VISION.md) (2026-10-02 RNG across systems; 2026-10-09 "random events, interactions, people, enemies... unscripted stuff", then implement each once comprehensive; 2026-10-10 talent generation and discoverable secrets; generated households), [EMERGENT_SYSTEMS](EMERGENT_SYSTEMS.md) index.

## What runtime code actually does

Bottom line: seeded per-save randomness exists, but it only **picks among hand-authored outcomes**. Nothing generates new materials, potions, names, NPCs, quests, maps, affixes, recipes, genetics or secret truths. The older core loop is unseeded.

| Code | System | Location | Seeded? | Notes |
|---|---|---|---|---|
| F1 | Per-save seed | `src/main.js:440` (crypto), saved/restored in main.js | Yes | Root of all seeded draws below |
| F2 | Expansion roll tables | `src/expansion_engine.js:73-75,518-579`; `src/expedition_content.js:67` | Yes | One table exists (`frontier.observation`). Tested |
| F3 | Simulation events/commands | `src/simulation.js:36-184`; `src/simulation_content.js:104` | Yes, per-event streams | One timed event (`village.shower`). Tested |
| F4 | Village NPC lives | `src/npc_lives.js` | Hash | Only death year varies; names/families fixed |
| F5 | Native/party duels, causal-story strikes | `src/native_battle.js`, `src/party_battle.js`, `src/causal_story_host.js` | Yes | Gated content |
| F6 | Remainder offers | `src/audit_remainder_offers_state.js:50-55` | Recorded, unused | Seed stored and checked but varies nothing |
| F7 | Old loot, enemy groups, combat hit/crit, trader stock, crafting success, gathering | `src/enemies.js`, `src/models/location.js`, `src/models/combat.js`, `src/combat_math.js`, `src/components/trader_component.js`, `src/main.js` | **No** (`Math.random`, ~60 call sites) | Live core loop, no RNG tests. `combat_math.js` already accepts an injectable `random` |
| F8 | Alchemy | `src/crafting_recipes.js` `alchemy_recipes` | n/a | Fixed recipe table; fixed `result_id` outputs |
| F9 | "Unmarked pale vial" | `src/nethack_fieldcraft_content.js:15` | n/a | One authored substance, not a per-save appearance shuffle |

## Design coverage

| Code | Domain | Owner doc | Design state | Audit | Code |
|---|---|---|---|---|---|
| D1 | Procedural materials/alchemy | [audit](PROCEDURAL_MATERIALS_AND_ALCHEMY_AUDIT_2026-10-13.md), [deep report](research/procedural-materials-2026-10-13/deep/REPORT.md), [E4B](emergent/E4B_MATERIALS_AND_NOITA.md), [E4](emergent/E4_TAGS_AND_RULES.md) | Deepest: rule contract, 85 cards, risks R1-R9, slice A1-A5 | Yes, two rounds | None |
| D2 | Seeded streams | [E1](emergent/E1_SEEDED_STREAMS.md), [RNG doc](RNG_ENCOUNTERS_AND_SOURCE_DEVELOPMENT.md) | Proposal with ranked migration list | Call-site audit (2026-10-02, stale) | Partial (F1-F5) |
| D3 | Talents/cheats/power variants | [Simulators](SIMULATORS_AND_CHEAT_IMPLEMENTATION.md), [E8B](emergent/E8B_POWER_CATALOG.md), [Cheat library](CHEAT_LIBRARY.md) | Considerations | [cheat audit](audits/cheat-implementation-2026-10-10/REPORT.md) | None |
| D4 | Storylets/random events | [E2](emergent/E2_STORYLETS.md) | Build-ready draft, 20 Village cards | None | One event (F3) |
| D5 | Generated people | [E3](emergent/E3_LIVING_PEOPLE.md), [Characters](CHARACTERS_AND_WORLD_EVENTS.md) | Proposal | None | Death year only (F4) |
| D6 | Randomized world secrets | [World secrets](worlds/WORLD_SECRETS_AND_DISCOVERY.md) | Sealing accepted; rolling truths proposal | None | None |
| D7 | Generated households/starts | [Origins](worlds/ORIGINS_AND_WORLD_TIMELINES.md), [Starts palette](STARTS_ENDINGS_AND_RANDOMNESS_PALETTE.md) | Proposal, "missing selected delivery" | None | None |
| D8 | Lore/names/history grammar | [E6](emergent/E6_LORE_LAYER.md), [Timelines](TIMELINES_AND_DIVERGENCE.md) | Proposal | None | None |
| D9 | Storyteller pacing | [E5](emergent/E5_STORYTELLER_AND_FATE.md) | Proposal | None | None |
| D10 | Rivals, cosmic events, genetics, observation | [Rivals](RIVALS_IDENTITIES_AND_FATE.md), [Cosmic](COSMIC_EVENTS.md), [Genetics](GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md), [E7](emergent/E7_OBSERVATION_AND_MYSTERY.md) | Palettes | None | None |

Not proposed anywhere: per-save appearance shuffles for unidentified items, generated item affixes, dungeon layouts (deliberately backburnered in the [architecture review](reviews/WHOLE_PROJECT_GAME_ARCHITECTURE_REVIEW_2026-10-12.md)), standalone name generators.

## Proposed order (agent proposal, unaccepted)

| Code | Step | Why this order | Gate |
|---|---|---|---|
| O1 | Seed the old loop (F7) through named streams, starting with `combat_math.js` | Every generator below needs "reload never rerolls" (materials risk R7). Cheapest real win | Same-seed replay test; save/reload leaves next draw unchanged; old saves get a fresh stream |
| O2 | Materials slice A1-A4 (Village mixing to generated potion) | Most designed, Weibao's explicit ask, proves product identity + generated effect persistence that D3/D5 also need | Audit's own gates: native journey, Save/reload, literal import |
| O3 | Per-save appearance shuffle for unidentified vials (new) | Reuses O2's truth/knowledge split; NetHack-style, small, fun | Same vial looks different across saves, same across reloads; identification persists |
| O4 | Storylet deck (D4) on F3 streams | Draft is build-ready; makes idle time eventful | 20 cards drawable, cooldowns saved |
| O5 | Randomized secret pick for one original world (D6) + talent roll (D3) | Needs O1 seeding and a sealed-reviewer pass | Roll at run creation, ID-only save, two discovery routes |

Audits still missing before their slices: D4, D5, D6, D7, D8. The D2 call-site audit should be refreshed (it predates most of current `src/`).

Dispatched 2026-10-13 as [procgen wave 1](gm/dispatch/procgen-2026-10-13/PLAN.md): P1 streams, P2 mixing, P3 storylets, P4 people/names, P5 audits and wave-2 specs.

2026-10-14: story and content generation palette saved in [PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS](PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md); lanes P12-P18 dispatched (docs only).

2026-10-14: crafting and consumables palette saved in [PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS](PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS_2026-10-14.md) (CO, FE, MK, IT, WL, CT, AU, EC, SO, TL). P2 mixing is committed on `proc/p2-mixing` (`f8fe6994`), not yet merged. No lanes dispatched.

2026-10-14: shared generator contract saved in [GENERATION_FOUNDATION_RULES](GENERATION_FOUNDATION_RULES_2026-10-14.md) (GR1-GR17 rules, SB1-SB17 subtle bugs, MC1-MC12). Lanes G1 kit (code, `gen/g1-kit`), G2 conformance audit, G3 tag tables and overlays dispatched.

## Round 2: comics, lens cheats, subtle, overarching, implications, abstractions (2026-10-14)

Weibao, 2026-10-14: "Considering comic worlds and stuff and more? ... Cheats that would show stuff like these and more? ... Subtle stuff too? Overarching stuff? Implementation implications and more? Abstraction that's needed? Merging, committing or pushing?" This round covers only the **generation** angle. Broad comic worlds, comic cheats and general abstractions are owned by [comic considerations](COMIC_WORLDS_AND_MEDIUM_CONSIDERATIONS_2026-10-14.md) (CW, CK, CA; lanes K1-K6), [story considerations](PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md) and the UI-at-scale doc. All items are proposals.

State now: wave 1 (P1 streams, P2 mixing, P3 storylets, P4 people) merged into `codex/gameplay-foundations` as `4e13f97f` (679/679 tests reported by the merging session). Docs lanes P5-P11 finished: see [PLAN](gm/dispatch/procgen-2026-10-13/PLAN.md).

### CG. Comic worlds through a generation lens

| Code | Consideration |
|---|---|
| CG1 | Comic universes are already procedural in practice: rotating writers, crossovers and events. A world's "editorial era" can be a generation context (CONTEXT from P11) that shifts tone, power level and threat tables without changing saved truth. |
| CG2 | Legacy mantles: generate successors who inherit a title, costume, artifact and partial power, keeping the canon original reserved (P7 rule). |
| CG3 | Villain-of-the-week generator from authored archetype packages (gimmick + motive + weakness + escalation), the comic version of P5 X1 build packages. |
| CG4 | Webtoon/system-apocalypse worlds (towers, gates, dungeons, ranked hunters) are the most native fit: their "system" already speaks in generated ranks, loot and quests. Gate/tower floors are generated content within authored rules; dungeon layouts stay backburnered, so a floor is a challenge card, not a map. |
| CG5 | Power-origin generator (accident, mutation, artifact, training, legacy, cosmic) with per-world eligibility, feeding D3 talent roll. |
| CG6 | Secret-identity pressure: generated civilians who might discover you, using P4 people and knowledge vs truth. |
| CG7 | Retcon/reboot as a rule over generated records: a reboot keeps a saved revision and re-derives the projection, never silently rerolling (P2 risk R6). |
| CG8 | Issue/arc cadence: P3 storylets grouped into numbered "issues" with a cliffhanger card; idle time advances an issue. |

### GL. Cheats that show or bend generated stuff

| Code | Cheat shape | What it touches |
|---|---|---|
| GL1 | Appraisal tiers: name, then properties, then provenance, then hidden truth | P2 knowledge vs truth projection |
| GL2 | Fate ledger: see the next N draws of one stream | P1 streams (E1 §7 See) |
| GL3 | Pin or reroll one draw at a cost | P1 streams; must never reroll saved truth silently |
| GL4 | People sight: hidden traits, needs, goals of generated people | P4 knowledge projection |
| GL5 | Deck peek: upcoming storylet cards and their weights | P3 deck |
| GL6 | Vein sense / resource map: deposits, grade, renewal state | P8 resources |
| GL7 | Recipe intuition: predicted mixture result before mixing | P2 preview (pure) |
| GL8 | Seed reading: name the world's rolled truths, by ID only until discovered | D6 secret roll, sealed |
| GL9 | Panel sight (comics): see the "next page" beat or cover blurb | CG8 issues |
| GL10 | Rarity/quality aura: color or glyph for generated quality | presentation dial, accessibility |

Rules: a lens reveals, it does not create; costs and ranges are per-world adjectives; revealed knowledge saves as player knowledge, not truth; sealed truths stay sealed except through their route.

### GS. Subtle generation

GS1 wear and patina on owned items; GS2 people's mood and small talk varying by need and weather; GS3 rumors that drift as they spread; GS4 small batch-to-batch variance in harvests and brews; GS5 names that shorten into nicknames over time; GS6 seasonal description changes; GS7 tiny personal records (first potion, first sale) remembered by D8 lore; GS8 rare harmless oddities (a two-headed flower) with optional follow-up.

### GO. Overarching generation

GO1 one generation framework for all worlds, with per-world switches (P9/P10); GO2 one saved seed root per world instance, with derived streams; GO3 levels of detail: far-away places and people simulated coarsely, refined when visited; GO4 era/arc layer above storylets (D9 storyteller); GO5 cross-world consistency when items or people travel (compatibility law); GO6 content budget: how much is generated vs authored per world, and a lint that catches empty or broken generations; GO7 idle accumulation caps so long absences summarize instead of flooding.

### GI. Implementation implications (after wave 1)

GI1 wave 1 has several local seeded helpers (P2/P4 were re-seeded from P1's root at integration); unify on `src/seeded_streams.js`. GI2 three separate knowledge-vs-truth projections exist or are coming (mixtures, people, secrets); one shared projection contract avoids drift. GI3 every generator needs a revisioned saved record and an old-save absence policy. GI4 every generator needs a lint plus a deterministic replay test. GI5 `src/main.js` and `src/save_files.js` are the merge choke points; registration through a generator registry reduces conflicts. GI6 Math.random calls still added by other lanes need a guard (test or lint).

### GA. Abstractions needed (generation-specific)

GA1 Stream and draw contract (exists, P1). GA2 Generated-record envelope: id, kind, revision, seed path, truth payload. GA3 Knowledge projection: per observer, known / suspected / unobserved. GA4 Context reader (P11). GA5 Eligibility and weight tables with per-world overrides. GA6 Generator registry with lint and replay hooks. GA7 Level-of-detail refinement. GA8 Lens interface for cheats (reveal/pin/reroll with costs). These map to the broader [abstraction lists](UI_AT_SCALE_CONSIDERATIONS_2026-10-14.md) and CA rows rather than replacing them.

### Lanes GX1-GX5 (dispatched 2026-10-14)

| Lane | Task | Kind |
|---|---|---|
| GX1 | Generation profiles for comic and webtoon worlds (CG), building on K1-K6 | docs |
| GX2 | Generation-lens cheats (GL), mapped to live wave-1 code | docs |
| GX3 | Subtle and overarching generation (GS, GO), with first slices | docs |
| GX4 | Generation framework: implications and abstractions (GI, GA), code-grounded on merged wave 1, ranked refactor slices | docs |
| GX5 | Build W2-1: per-save appearances for unidentified mixtures (P5 O3) | code, own worktree |
