# Procedural generation wave 1: plan

**Current use, reconciled 2026-10-18:** this is the original wave plan, not
an active lane roster. [STATUS](STATUS.md) records P1–P4 integrated as `4e13f97f`
and G1/GX5/P34 integrated as `759dd393`, with separate open B1–B3 and human
acceptance gates. Documentation returns/folds and cancelled duplicate WR lanes
are listed there. Recover exact current consumers before selecting another slice.
Later direction defers NPC-heavy expansion and procedural layouts; see
[the opportunities owner](../../../PROCEDURAL_AND_GENERAL_OPPORTUNITIES_2026-10-16.md).
Current UI_RULES targets and compatibility decisions apply to new proof.

Date: 2026-10-13. Authority: Weibao, 2026-10-13, after the [status map](../../../PROCEDURAL_GENERATION_STATUS_2026-10-13.md): "expand and then send out slices with relevant codex in parallel". Earlier direction: [USER_VISION](../../../USER_VISION.md) 2026-10-09 "random events, interactions, people, enemies... unscripted stuff", then implement each once comprehensive; procedural potions from mixing (materials audit request).

Root coordinator: Claude session in the main checkout. Root owns this folder's PLAN/STATUS, integration and merges. Each worker owns only its worktree branch and its `pN/` report folder.

Root considerations for story generation: [PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS](../../../PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md). On P12-P16 completion, resume each once to fold it in.

## Slices

| Slice | Outcome Weibao can play | Owner doc(s) | Worktree / branch | Port |
|---|---|---|---|---|
| P1 Seeded core loop | Combat, loot, enemy groups, trader stock, crafting success and gathering draw from named saved streams; reload never rerolls the next fight or shop | [E1](../../../emergent/E1_SEEDED_STREAMS.md), status F7 | `.claude/worktrees/proc-p1-streams` / `proc/p1-streams` | 19310 |
| P2 Procedural mixing | Village mixing: buy/gather fictional ingredients, mix in different ratios/process, get distinct generated potions with real effects that survive save/reload/import; learn one hidden property by experiment; repeat a learned method | [Materials audit](../../../PROCEDURAL_MATERIALS_AND_ALCHEMY_AUDIT_2026-10-13.md) A1-A4, [deep report](../../../research/procedural-materials-2026-10-13/deep/REPORT.md) | `proc-p2-mixing` / `proc/p2-mixing` | 19320 |
| P3 Storylet deck | Idle Village time produces varied seeded events (offers, ambient, decisions) from a card deck with cooldowns; at least 12 of E2's 20 Village cards live | [E2](../../../emergent/E2_STORYLETS.md) | `proc-p3-storylets` / `proc/p3-storylets` | 19330 |
| P4 Generated people + names | Seeded generated travelers/residents (names from a per-world grammar, traits, one need/goal) appear in Village, can be met, and persist | [E3](../../../emergent/E3_LIVING_PEOPLE.md), [E6](../../../emergent/E6_LORE_LAYER.md) names | `proc-p4-people` / `proc/p4-people` | 19340 |
| P5 Audit + wave-2 specs (docs only) | Implementation-ready specs for: talent roll (D3), per-save secret roll for one original world (D6), generated households/starts (D7), lore/history grammar (D8), storyteller pacing (D9), per-save unidentified-appearance shuffle (O3, on P2) | listed in status map | main checkout, `docs/gm/dispatch/procgen-2026-10-13/p5/` only | none |
| P6 Creation systems (docs only, added 2026-10-13) | Procedural creation specs for smithing, cooking, coatings, enchanting/formations, agriculture/constructs, technique and spell invention, buildings, creative works | materials research, P2, P5 | main checkout, `p6/` only | none |
| P7 Book-world people and names (docs only, added 2026-10-13) | Guidelines and per-world data shapes so P4 people and names fit canon worlds | P4, world briefs, wiki digests | main checkout, `p7/` only | none |
| P8 Resources and harvesting (docs, added 2026-10-14) | Deposits, yields, renewal/ecology, creature and magical resources, supply, logistics, idle gathering | materials atlas, P2, P6 | `p8/` only | none |
| P9 Book-world generation profiles (docs, added 2026-10-14) | Per world: what is generated vs canon, world laws per generator | world briefs, wiki digests | `p9/` only | none |
| P10 Anime and original-world profiles (docs, added 2026-10-14) | Same for JJK, Bleach, Fate, HxH, FMA, Naruto, CSM, original worlds | wiki digests, world folders | `p10/` only | none |
| P11 Context layer and more (docs, added 2026-10-14) | Shared context contract plus further domains (requests, markets, creatures, rumors, books, dreams, festivals, disasters, more) | P5 EXTRA_IDEAS | `p11/` only | none |
| P12 Quests, arcs, plot structure (docs, added 2026-10-14) | Multi-step quests, arcs, NPC plans and story sifting from actual causes, on P3/P4 | E2, E5, P3, P4, P11 N1 | `p12/` only | none |
| P13 Canon and divergence (docs, added 2026-10-14) | Per world: canon spine, where generated stories attach, protagonist pull, reserved canon, fan-premise templates | TIMELINES_AND_DIVERGENCE, P9, P10 | `p13/` only | none |
| P14 History, chronicle, legends (docs, added 2026-10-14) | Generated pasts, player chronicle/recaps, rumors, songs, books and legends with bias | P5 D8, E6, P11 | `p14/` only | none |
| P15 Text, dialogue, authoring pipeline (docs, added 2026-10-14) | Runtime text/dialogue options (incl. LLM tradeoffs) and agent mass-authoring with lint and QA gates | P7, E2, ABILITY_AUTHORING | `p15/` only | none |
| P16 More story angles (docs, added 2026-10-14) | Crossovers, endings, loops, villain/other-self lives, player-authored content, meta, idle story forms | E7, P10, intro doc | `p16/` only | none |
| P17 Story as a power source (docs, added 2026-10-14) | ORV stories, LOTM acting, System quest givers, luck/fate, reputation as power, per world | root considerations D1-D5, p9, p10 | `p17/` only | none |
| P18 Headless story QA (docs, added 2026-10-14) | Long-run simulator, story metrics, revisions, compaction, leak scans, "why did this happen" | root considerations E6, F1-F5 | `p18/` only | none |
| P19 Social web (docs, added 2026-10-14) | NPC-NPC lives, companion arcs, lineages, mirror rivals, gossip, banter | root G1-G6 | `p19/` only | none |
| P20 Places and settlements (docs, added 2026-10-14) | Place memory, changing settlements, multi-scale news, residue, home stories | root H1-H5 | `p20/` only | none |
| P21 Conflict and economic stories (docs, added 2026-10-14) | Battle receipts, returning enemies, wars, ecology, booms/busts, ventures | root I1-I4, J1-J3 | `p21/` only | none |
| P22 Creative-director tools (docs, added 2026-10-14) | Director mode, story requests, content packs, editor, feedback bookmarks | root K1-K5 | `p22/` only | none |
| CR1 Consumables and body response (docs, added 2026-10-14; crafting lane, prompt `CR1.md`) | Poisons/antidotes, area items, pills, tolerance/toxicity, mutagens, social/mind consumables, species response | root crafting CO, RS2, XD2-4 | `cr1/` only | none |
| CR2 World crafting laws (docs, added 2026-10-14; crafting lane, prompt `CR2.md`) | Per-world making laws, resolver modes, canon vs generated, cheat interactions | root crafting WL, CT, RX1-3, p9, p10 | `cr2/` only | none |
| CR3 Crafting play, automation, director tools (docs, added 2026-10-14; crafting lane, prompt `CR3.md`) | Property map/grid UI, journal, standing orders, chains, codex/field guide, sandbox, coverage, fuzzing | root crafting FE, AU, SC, CL, TL; P2 code | `cr3/` only | none |
| CR4 Makers, economy, social, NPC crafters (docs, added 2026-10-14; crafting lane, prompt `CR4.md`) | Maker identity, items over time, crafted-goods economy, gifts/healer/contests, recipe lineages, NPC crafters, prestige carryover | root crafting MK, IT, EC, SO, KN, NP, PR; P4 | `cr4/` only | none |
| CR5 Comic-world making (docs, added 2026-10-14; crafting lane, prompt `CR5.md`) | Sourced check of root CM/CX rows, more comic/webtoon/manhua/manga making | root crafting round 3, comics research | `cr5/` only | none |
| CR6 Crafting wave 2 build packet (docs, added 2026-10-14; crafting lane, prompt `CR6.md`) | Product family registry, exposure ledger, observer knowledge, poison/antidote and codex slices on merged code | root II/AB, cr1, cr3, weaponcraft R1-R3 | `cr6/` only | none |
| P23 Inner life, ambitions, morals, story progression (docs, added 2026-10-14) | Belief drift, wants, ambitions, dilemmas, epiphanies, personal heart demons | root M, N, R, S | `p23/` only | none |
| P24 Knowledge, perspectives, time (docs, added 2026-10-14) | Decaying foreknowledge, wrong info, nonhuman stakes, cutaways, item stories, anniversaries, countdowns | root O, P, Q | `p24/` only | none |
| P25 Presentation and export (docs, added 2026-10-14) | Episodes, Stories tab, timeline/map views, triage, hero wiki page, novel export | root E3, T, U | `p25/` only | none |
| P26 Book beat templates, genres, humor (docs, added 2026-10-14) | Canon scene shapes as templates, trope weights, fan seeds, genre packs, running gags, rare events | root W, X, Z | `p26/` only | none |
| P27 Journeys, groups, death (docs, added 2026-10-14) | Road events, expeditions, leading a sect/guild, disciples, funerals, afterlives | root AA, AB, AC | `p27/` only | none |
| P28 Intent, taste, writers' room, onboarding (docs, added 2026-10-14) | Intent box, topics, taste learning, agent writers' room kit, gradual generator unlocks | root Y, AD, AE, AF | `p28/` only | none |
| P30 Power levels, body/age, family (docs, added 2026-10-14) | Late-game and low-power stories, injury/illness/aging, children, animals | root AG, AH, AI | `p30/` only | none |
| P31 Promises, secrets, faith (docs, added 2026-10-14) | Promise tracker, oaths/contracts, favors, secrets as currency, prayer and temples | root AJ, AK, AL | `p31/` only | none |
| P32 Level of detail, continuity, content math (docs, added 2026-10-14) | Simulation LOD, contradiction guard, authoring budget, local play logs | root AM, AN, AO | `p32/` only | none |
| P33 Rankings, media, calendar, outsiders, pacing, defeat (docs, added 2026-10-14) | Heaven lists, forums/chats per world, social calendar, other transmigrators, session-sized stories, defeat arcs | root AP-AU | `p33/` only | none |
| P34 Story spine prototype (code, added 2026-10-14) | Merge P1/P3/P4; typed receipts; a traveler's real request with aftermath; recap; later card remembers; lint; headless seeded run | root round 7 spine S-1 to S-5 | `proc-p34-spine` / `proc/p34-story-spine` | 22400 |
| P35 Environment, codex, sound, challenges (docs, added 2026-10-14) | Scenes from real past events, in-game encyclopedia, leitmotifs, generated challenges | root AV-AY | `p35/` only | none |
| P36 Micro details (docs, added 2026-10-14) | Names by familiarity, remembered preferences, traces, village reactions, certainty markers, timing, UI touches | root BA-BG | `p36/` only | none |
| P37 Per-world micro texture (docs, added 2026-10-14) | Honorifics, etiquette, message formats, routines, props per world | root BH | `p37/` only | none |
| P38 Contract consolidation (docs, added 2026-10-14) | One entity-ref scheme, one receipt log, store owners, retention, duplicate map, migration | root BI | `p38/` only | none |
| P39 Roadmap, graph, registry (docs, added 2026-10-14) | Slice table, dependency graph, file-conflict map, generator registry, budgets, waves | root BJ, BK | `p39/` only | none |
| P40 Determinism hazard audit (docs, added 2026-10-14) | Live-code findings with file:line, lint rule specs, headless test cases | root BL | `p40/` only | none |
| WR1 Weaponcrafting (docs, added 2026-10-14) | Parts, technique, bonds and growth, world weapons, upkeep, commissions | WEAPONCRAFTING_RUNES_AND_REVEAL WC | `wr1/` only | none |
| WR2 Runes and inscriptions (docs, added 2026-10-14) | Inscription layer, world grammars, discovery and error, surfaces | RN | `wr2/` only | none |
| WR3 Reveal cheats and lenses (docs, added 2026-10-14) | Lens model, source lenses, secret limits, item view UI | RV | `wr3/` only | none |
| WR4 Shared making abstractions (docs, added 2026-10-14) | Item identity, composition, effects, lenses, bonds, world laws, save vs derive, registry, migration | XA, IM | `wr4/` only | none |

Wave 2 (after root integration of P1-P4): P5's specs become slices; P2 adapters (coating, appearance shuffle); talent and secret rolls on P1 streams.

## Shared-file conflicts (root merges)

| File | Primary owner | Others |
|---|---|---|
| `src/main.js` | none; each slice minimal, listed in report | P1: gameplay `Math.random` sites + save/load of streams. P2: `use_item`, `add_active_effect`, active-effect restore, product identity. P3/P4: registration lines only |
| `src/combat_math.js`, `src/models/combat.js`, `src/enemies.js`, `src/models/location.js`, `src/components/trader_component.js` | P1 | none |
| `src/items.js`, `src/crafting_recipes.js`, `src/components/inventory_component.js`, `src/active_effects.js` | P2 | none |
| `src/simulation_content.js` | P3 | P4 does not edit; uses its own module |
| `src/npc_lives.js` | P4 | none |
| `src/simulation.js`, `src/save_files.js` | none; minimal, listed | all |

P2, P3, P4 do not wait for P1: derive their own seeded draws from the existing per-save seed (`expansionState.rng` / `deriveSimulationSeed`) in a small local helper; root unifies onto P1 streams at integration.

## Status

See [STATUS.md](STATUS.md) and [SESSIONS.md](SESSIONS.md).

## Round 2 lanes (2026-10-14)

Wave 1 merged as `4e13f97f`. New lanes per [status map round 2](../../../PROCEDURAL_GENERATION_STATUS_2026-10-13.md#round-2-comics-lens-cheats-subtle-overarching-implications-abstractions-2026-10-14): GX1 comic/webtoon generation profiles, GX2 generation-lens cheats, GX3 subtle and overarching generation, GX4 framework implications and abstractions (docs, `gx1/`-`gx4/` only); GX5 per-save mixture appearances (code, worktree `proc-gx5-appearances`, branch `proc/gx5-appearances`, port 19410). Labels GX avoid collisions with P12-P40, CR and WR lanes from other sessions.
