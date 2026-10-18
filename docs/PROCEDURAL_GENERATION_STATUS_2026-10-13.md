# Procedural and generative systems: status map

**Current routing, reconciled 2026-10-18:** [dispatch STATUS](gm/dispatch/procgen-2026-10-13/STATUS.md)
records both wave-1 and R3-10 integration. The older unmerged/running rows below
are dated observations superseded by those receipts. Open B1–B3 are separate
from the later P34 partial B4 closure; no whole-procgen acceptance follows.
For newly selected scope, [ruins/world-first direction](PROCEDURAL_AND_GENERAL_OPPORTUNITIES_2026-10-16.md)
retains NPC-heavy/layout deferrals. This refresh did not rerun runtime gates.

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

## Round 3: more-to-consider pass on live state (2026-10-14)

Weibao, 2026-10-14: "Use more to consider on stuff like procedural features and more?" Checked against live `src/`, branches and dispatch files, not only docs. Proposals, not accepted decisions. Codes are `R3-n` to avoid collisions with CG/PG/PM rows elsewhere.

Bottom line: the idea palette is saturated. Six owner docs and about 60 docs lanes already cover generation (this doc, [foundation rules](GENERATION_FOUNDATION_RULES_2026-10-14.md), [story](PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md), [crafting](PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS_2026-10-14.md), comic and world-kit docs). Grep found save-size, name filters, seed sharing and content-version drift already discussed. The gap is code Weibao can play, not more categories.

### Act now (correctness of what is already built)

| Code | Finding | Evidence | Disposition |
|---|---|---|---|
| R3-1 | Crafting quality is still unseeded. P1 "seeded native core gameplay" but `roll_quality` uses `random_range`, i.e. `Math.random` | `src/crafting_recipes.js:207,237,303` via `src/misc.js:69` | Route through a P1 stream (`crafting.quality`). Small code lane |
| R3-2 | One combat proc is unseeded: guardian bleed 20% | `src/enemies.js:282` | Same fix, combat stream |
| R3-3 | F7 row is stale: 28 `Math.random` sites remain, not ~60, and 22 are cosmetic (particles, display, flavor lines, idle sounds in `main.js`) | grep 2026-10-14 | Update F7; add the GI6 guard as an allowlist test (cosmetic files only) so new gameplay draws fail |

### Account for now (affects the next dispatch, no new feature)

| Code | Finding | Evidence | Disposition |
|---|---|---|---|
| R3-4 | Three code branches sit unmerged and stale: `gen/g1-kit` (1 ahead, 105 behind), `proc/gx5-appearances` (1/74), `proc/p34-story-spine` (7/105) | `git rev-list` | Merge-before-dispatch rule: gate and merge or explicitly park these before any new procgen lane |
| R3-5 | [STATUS](gm/dispatch/procgen-2026-10-13/STATUS.md) is dated 2026-10-13 23:58 and lists P30-P40 as running; 16 `codex exec` processes are live but unmapped to lanes | `ps`, STATUS | Reconcile lane states from CHECKPOINT files before the next wave |
| R3-6 | Docs-to-play ratio: wave 1 (mixing, storylets, travelers) is the only merged playable procgen. Every later round produced docs | STATUS table | Next procgen work should be one playable wave 2 slice, not another palette round |
| R3-7 | Duplicate code families across owners (`CG1-CG12` exists in both this doc and foundation rules with different meanings) | grep | P39 (roadmap/registry) should own one crosswalk; new rounds pick a unique prefix |
| R3-8 | Wave-1 open items B1-B4 (P3 decks off P1 streams, P2/P4 internal draws outside receipts, import of saves with P2/P4 state code-checked only, P3 not casting P4 people) are still open | Root integration note above | Fold into wave 2 gates; B3 needs a literal browser import proof |

### Later / delegate

| Code | Item | Level, done check |
|---|---|---|
| R3-9 | Seed R3-1/R3-2/R3-3 guard | Economy/medium Codex lane, own worktree. Done: same-seed craft replay test, reload leaves next quality draw unchanged, allowlist test fails on a new `Math.random` in a gameplay file, build passes |
| R3-10 | Merge pass for R3-4. **Done 2026-10-14**: landed `759dd393`, [report](gm/dispatch/procgen-2026-10-13/r3-merge/REPORT.md); R3-5 STATUS reconciled | Balanced/medium. Done: each branch rebased or merged on current base, full test suite and build pass, desktop browser proof at 1366x768 including Save/reload and literal Import; or a written park reason |
| R3-11 | Wave 2 playable slice, ranked from P5: per-save appearances (GX5, already coded) + storylets casting generated travelers (B4) + one generated lore recap (P14 top pick) | Strong/high coordinator, balanced workers. Done: Weibao can play it in Village; all three survive Save/reload and Import |
| R3-12 | Fate-ledger debug view (GL2) as the first lens, scoped to developer mode | Balanced/medium. Reveals only; never shows sealed truths outside their route |

## Lane returns fold: P5-P11, GX1-GX4 (2026-10-14)

Folded at the request of the gameplay-foundations session after the returns were committed in `bc201e60`. Story lanes P26-P40 fold into the [story palette](PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md#lane-returns-fold-p26-p40-2026-10-14). Everything stays a proposal; no new lanes. Lane-local codes (F, R, S, C, G, A, X, O) are cited as `<lane>.<code>` because every lane reuses them.

### Superseded rows in this doc

- F4 and D5 ("death year only, names fixed") predate P4. Live: P4 generated travelers with names, needs and requests (`src/generated_people.js`), extended by P34 requests. P7 flagged this.
- "P2 mixing is committed on `proc/p2-mixing`, not yet merged" is history: P2 merged in `4e13f97f`. P30 and P33 noted it.
- O3 (per-save appearances) shipped as GX5, and the D8-A deed recap exists in part as `src/lore_history_*` (P34). P5's W2-1 and part of W2-2 are delivered; re-scope rather than rebuild.

### Per lane

| Lane | Adds | Duplicates | Contradictions or stale | Top picks |
|---|---|---|---|---|
| [P5](gm/dispatch/procgen-2026-10-13/p5/REPORT.md) audits, wave-2 specs | Ranked W2-1..W2-5 with ownership and ports; D3/D6/D7/D8/D9 specs (D6 candidates sealed, ID only); P5.F4 "a seed alone cannot preserve a generated start, save the people and manifest" | D and O rows here (bound, not new); P5.X1-X8 restate D10, CG3, GS | W2-1 done (GX5); W2-2 partly live (P34) | W2-1 appearances (done), W2-2 deed recap, W2-3 earned talent |
| [P6](gm/dispatch/procgen-2026-10-13/p6/REPORT.md) creation systems | Shared creation contract P6.C8-C15; eleven family papers with slices S1-S11; live audit; four product logics L1-L4 | C8/C10 = GA2, GA6, GR1; C11 = GR5, GA7; C12 = GR12; C13/C15 = GR3, GR10; families echo the crafting palette (CO, KN, XD, SC, SU) | P2 line numbers stale after merge | S1-A binder to repaired tool, S2-A two meals with unfed control, S3-A alloy brace |
| [P7](gm/dispatch/procgen-2026-10-13/p7/REPORT.md) canon people and names | Guidelines and DATA_SHAPE (pack, culture, cohort, reservation); profiles for HP, D&D, Soldier's Life, TTKS B1-B5, MoL, LOTM, Shadow Slave and anime worlds; P4 gaps (size-weighted names, token splitting, validator fixed to three travelers) | Canon cast reservation = CG2, CG7; overlays = foundation CG1, GA10; frozen identity = GR3, GR4, GR10 | Flags F4/D5 stale (above). P7.O1-O5 reuse this doc's O codes with other meanings | O1 HP household people, O2 D&D Phandalin contacts, O3 Soldier's Life billet |
| [P8](gm/dispatch/procgen-2026-10-13/p8/REPORT.md) resources, harvesting | Acquisition contract RC1 (law, region, site, intent, job, receipt, manifest); slices R1-A..R11 incl. creature resources (carcass partition, now the base for [harvest lanes](gm/dispatch/harvest-modules-2026-10-14/PLAN.md)); only lane giving GL6 and GS4 real producers | D3/D4 = GR1-GR3, GR5; D5 = GA7, GL1; RC1 overlaps P6.C8-C9 | R8-A proposes new energy modules but `src/energy_resources.js` exists; "do not guess the P1 export" is stale (merged) | R1-A herb patch survey to P2 input, R2-A leaf vs root harvest, R3-A renewal |
| [P9](gm/dispatch/procgen-2026-10-13/p9/REPORT.md) book-world profiles | 40 per-world generation profiles (TTKS by book, LOTM by era) with canon reservations and source tiers; switches P9.W1-W14; findings F1-F8 | W3/F3 = GR3, GR5, GR6, GR10, GA2; W11/W12 = GA3, GI2, D6; W14 = layouts backburnered | Claims P1 seeded native gameplay; R3-1/R3-2 show crafting quality and guardian bleed still unseeded (R3-9 is still a proposal) | S1 HP greenhouse harvest, S2 D&D potion commission, S3 Soldier supply |
| [P10](gm/dispatch/procgen-2026-10-13/p10/REPORT.md) anime and original worlds | 17 profiles (JJK, Bleach, Fate, HxH, FMA, Naruto, CSM, Demon Slayer, Frieren, Black Clover, Original Frontier, factory of ten seed families); source contradictions C1-C8 | F4 = GR5, GA3; F6 = D6, D7; factory truths = D6, GL8 | None. Original Frontier stays optional | S1 JJK survey, S2 Bleach parcel, S3 Fate authenticity |
| [P11](gm/dispatch/procgen-2026-10-13/p11/REPORT.md) context layer | Read-only context snapshot with four channels (eligibility, weight, quality, exposure); live audit F1-F19; domain packets N1-N15 (requests, markets, rumors, libraries, festivals, disasters...); M1-M20 | Channels and freeze-inputs = GR3, GR9, GR10, GA4; N15 = D6, GO1, GO2; N4/N7 = D3, D5; cheat variants = GX2 | Own R1-R7 (slot definitions, split person stores, legacy once metadata) | S1 context reader on a P4 interaction, S2 cause-backed requests, S3 finite market |
| [GX1](gm/dispatch/procgen-2026-10-13/gx1/REPORT.md) comic and webtoon profiles | 13 profile families; persona evidence, witness pressure, presentation vs semantic revision, quiet issues | Implements CG1-CG8 here and comics-doc CW | Uses this doc's CG meanings; foundation CG1-CG12 differ (R3-7) | S1 villain package (CG3), S2 challenge card (CG4), S3 receipt-backed issue (CG8) |
| [GX2](gm/dispatch/procgen-2026-10-13/gx2/REPORT.md) generation lenses | GL1-GL10 specified with live seams; GL11-GL20 (provenance, tension, Bias, Steal, Rewind, counterfactuals); knowledge-vs-truth contract with declared observe vs intervene; slices L1-L5 | GL rows verbatim; foundation GC1-GC14 cover the same lenses (GC6 = GL3a, GC7 = GL3b, GC8 = GL15, GC10 = GL17/GL20, GC14 = GL8) without cross-citation | E1's daily/once examples conflict with per-world adjectives; P3 deck forecast needs its own adapter | L1 mixture-property reveal, L2 process forecast, L3 people trait sight |
| [GX3](gm/dispatch/procgen-2026-10-13/gx3/REPORT.md) subtle and overarching | GS9-GS14; carrier, saved policy and cost for GS1-GS8; GO1-GO5 specs; GO6/GO7 budget and absence rules; slices S1-S14 | GS, GO, GI3/GI4; story BI/BK budgets | Its receipt-query dependency is now unblocked (P34 merged) | S1 seasonal scene windows (GS6), S2 remembered firsts (GS7), S3 traveler small talk (GS2) |
| [GX4](gm/dispatch/procgen-2026-10-13/gx4/REPORT.md) framework | GA1-GA8 API and migration specs; randomness ratchet T1-T3; per-site audit | GA1-GA8, GI1-GI6 here; foundation GI4 and A5 ratchet; R3-3 | Files guardian bleed and crafting `random_range` as cosmetic or latent; R3-1/R3-2 treat them as live gameplay fixes. 27 vs 28 sites. Live ratchet baseline still allows 60 calls | S1 randomness guard with replay hook, S2 legacy draw adapter for P4, S3 one-domain validator (P2) |

### Cross-lane

- **Code collisions (R3-7 grows).** P5.X vs P6.X, P7.O vs this doc's O, lane R1-Rn vs R3-n, foundation CG vs status CG, GX2 GL vs foundation GC, and GX4 GA vs foundation GA. P39's registry is the natural owner of one crosswalk. Until then, cite lane-qualified.
- **Two lens catalogs.** GX2 (GL1-GL20) and foundation GC1-GC14 describe the same cheats. Reconcile before any lens slice ships, together with story BN and BO1 (one knowledge owner).
- **Picks that build on live code now:** GX4.S1 (the guard, same as R3-9), GX3.S3 and P11.S1 (on P4 travelers), GX2.L3 (people sight, same as TA-L3), P8.R2-A (now the HV lanes).
