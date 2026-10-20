# Ideaboard scale plan (proposal, 2026-10-19)

Weibao asked for a fresh look at implementing everything on the ideaboard and
reaching the scale he wants, and more. This is a planning note. Everything here
is a **proposal**; nothing is accepted until he says so (AD32), no runtime code
changed, and no build, agent fleet or acquisition run was started. It composes
existing owners and links them instead of copying them.

Rules applied: AD5, AD22, AD33, AD36, AD37, AD38, CX1–CX8, AR1–AR16, WA1–WA21,
GR1–GR17, AU1–AU15 ([rules index](RULES_INDEX.md)). UI work stays desktop first
(AD34); mobile is deferred. The first milestone stays one realm and one prestige
layer; this plan grows outward from it and does not replace it.

Method and limits. Three read-only sweeps (engine proposals, worlds and
palettes, measured numbers) fed this note; I verified the numbers that carry
the argument against files (marked **V**). Everything else is cited or marked
**I** (inference) or **E** (estimate). No sealed world truth was opened or is
shown here; secrets appear only by ID if at all.

## Top-line answer

1. The ideaboard is not one build. It is about 15,000 lines of palettes
   (sweep count), 16 accepted rulebooks and about 24 world folders, sitting on
   roughly 97,000 lines of top-level `src/` (**V**: `cat src/*.js | wc -l`
   = 97,044). Docs lead code by a wide margin, so the scarce resource is
   **playable, accepted slices**, not ideas.
2. "Scale" has three separable meanings: how many worlds (content), how many
   living things per world (simulation) and how many ideas interact (rules).
   Each has a different cheapest route and a different binding limit.
3. The binding limit today is **human acceptance plus agent budget**, not
   engine speed or save size. The engine limit that bites first is **active
   actor tick cost**, which matters once absent worlds and NPCs are simulated.
4. The single highest-unlock piece of engine work is a **pack loader that
   lands through the domain registry**, because `src/world_pack.js` lints
   packs but "No runtime reads a pack yet" ([WA doc](WORLD_ABSORPTION_RULES.md)).
5. To go beyond the ambition rather than reach it, change the unit of growth
   from "a world someone authored" to "a world a pipeline derives, a rule
   composes or play generates", all frozen into saves only on reveal (GR3).

## 1. Inventory

Owners are linked, not summarised. Status vocabulary: **accepted** (Weibao's
words or an accepted rulebook), **proposal** (palette or audit, never binding),
**impl-unverified** (code exists, human play acceptance open), **deferred**.

### 1.1 Rule sets (all accepted unless noted)

| Family | Codes | Owner |
|---|---|---|
| Foundational rulebook, accepted direction | Rulebook 1–12, AD1–AD38 | [RULES_INDEX](RULES_INDEX.md) |
| Architecture | AR1–AR16 | [ARCHITECTURE_RULES](ARCHITECTURE_RULES.md) |
| World absorption | WA1–WA21 (accepted 2026-10-18) | [WORLD_ABSORPTION_RULES](WORLD_ABSORPTION_RULES.md) |
| Generation | GR1–GR17 | [GENERATION_FOUNDATION_RULES](GENERATION_FOUNDATION_RULES_2026-10-14.md) |
| Complexity guardrails | CX1–CX8 | [Part 9](gm/dispatch/ui-foundation-2026-10-15/next-parts/part-9-complexity-and-openness.md) |
| Domain rules | BHR1–30, CBR1–30, ECR1–33, SLR1–39, PIR1–25 | [DOMAIN_RULES](DOMAIN_RULES.md) |
| UI, making, sites | UR1–UR58, MR1–MR36, SR1–SR24 | [UI_RULES](UI_RULES.md), [MAKING_RULES](MAKING_RULES.md), [SITE_AND_EXPLORATION_RULES](SITE_AND_EXPLORATION_RULES.md) |
| Agent usage | AU1–AU15 | [AGENT_USAGE_RULES](AGENT_USAGE_RULES.md) |

### 1.2 Idea palettes by system (all proposal unless the rules above restate them)

| System | Palette owners | Lines (sweep) |
|---|---|---|
| Life sim, multiverse, cheats, starts | [North star](LIFE_SIM_NORTH_STAR.md) (7,662 lines **V**), [USER_VISION](USER_VISION.md), [Intro flow](INTRO_FLOW_CONSIDERATIONS_2026-10-13.md) 1,813 | large |
| Worlds and kit | [World core kit](worlds/WORLD_CORE_KIT_2026-10-14.md) K1–K34, [completion standard](WORLD_COMPLETION_STANDARD.md), [multiverse structures](worlds/MULTIVERSE_STRUCTURES.md), [lore and continuity](worlds/LORE_AND_CONTINUITY.md) | 80,153 in `docs/worlds` |
| Combat | [Combat and conflict](COMBAT_AND_CONFLICT_CONSIDERATIONS_2026-10-18.md), [encounters](ENCOUNTERS_AND_PURSUIT.md) | 263 |
| Economy | [Economy and trade](ECONOMY_AND_TRADE_CONSIDERATIONS_2026-10-18.md) | 333 |
| Body, health | [Body and health](BODY_AND_HEALTH_CONSIDERATIONS_2026-10-17.md), [genetics](GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md) | 207 |
| Skills, learning | [Skills and learning](SKILLS_AND_LEARNING_CONSIDERATIONS_2026-10-18.md), [skills and talents](SKILLS_AND_TALENTS.md), [technology](TECHNOLOGY_AND_PROGRESSION.md) | 508 |
| Making | [Tools](TOOLS_AND_INSTRUMENTS_CONSIDERATIONS_2026-10-17.md) 735, [production chains](MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md) 578, [consumables](PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS_2026-10-14.md) 466, four weaponcraft/runes docs (overlap, see risk R6) | about 2,700 |
| People, social, companions | [Relationships and canon](RELATIONSHIPS_AND_CANON_CONSIDERATIONS_2026-10-18.md) 783, [companions](COMPANIONS_FAMILIARS_AND_PETS_CONSIDERATIONS_2026-10-14.md) 1,631, [rivals](RIVALS_IDENTITIES_AND_FATE.md), [enemy protagonists](ENEMY_PROTAGONISTS.md) | about 2,400+ |
| Procedural story and content | [Procedural story](PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md) 1,223, [emergent systems](EMERGENT_SYSTEMS.md) (I40) | 1,223+ |
| Presence, UI at scale | [UI at scale](UI_AT_SCALE_CONSIDERATIONS_2026-10-14.md) 1,569, [Around you](AROUND_YOU_SUBJECT_ACTIONS_CONSIDERATIONS_2026-10-18.md) 381, [play beyond menus](PLAY_BEYOND_MENU_SELECTORS_CONSIDERATIONS_2026-10-14.md) 397 | 2,300+ |
| Engine, runtime, saves | [Engine runtime and stack](ENGINE_RUNTIME_PERFORMANCE_AND_STACK_CONSIDERATIONS_2026-10-14.md) 1,033, [saves and scale](ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md) 253, [ENGINE_EXPANSION](ENGINE_EXPANSION.md) 1,640 | 2,900+ |
| Comic and medium worlds | [Comic worlds](COMIC_WORLDS_AND_MEDIUM_CONSIDERATIONS_2026-10-14.md) 388 | 388 |
| Gathering, sites, time | [Gathering](GATHERING_AND_RESOURCE_USES.md), [scope ladders](SUBSYSTEM_SCOPE_LADDERS_2026-10-16.md) SSD1–110, calendars in kit W33–W35 | n/a |

The ID spine for older families is I01–I40 in [IDEA_INDEX](IDEA_INDEX.md).

### 1.3 World packs and worlds

Built in `src/` (impl-unverified; human acceptance open): original frontier
(about 1,440 lines), Proto23 village (711), Reincarnation Paradise hub
(1,140 across 11 files), Mother of Learning/Cyoria (six bespoke files, 361
lines, plus the read-only pilot `src/world_pack_mol.js`), and a private-pack
soldier world ([entry matrix](worlds/BOOK_WORLD_ENTRY_MATRIX.md)).

Design-only (brief and build packet, no runtime; about 400–1,600 doc lines
each): Jujutsu, Bleach, Naruto, Elden Ring, Fallout, Skyrim, Hunter x Hunter,
Fate, One Piece, Fullmetal Alchemist, Black Clover, Frieren, MHA, Chainsaw Man,
Demon Slayer; D&D has a partial SRD slice; Harry Potter and Proving Ground are
small. Franchise worlds are named in the roster files (`feature_expansion_book_*`,
about 7,500 lines) as data, not as playable packs. Sweep caveat: "name-only"
is inferred from grep, not from play.

### 1.4 Engine and UI proposal families

| Family | Meaning | Owner | Status |
|---|---|---|---|
| EI13–EI22 | Explainable decisions, local law as dependency, committed causes, pausable reactions, versioned IDs, cached projections, validators, semantic replacement, action discovery, metrics | [ENGINE_EXPANSION:1402](ENGINE_EXPANSION.md) | proposal |
| UIE1–UIE12 | View correctness, action agreement, cheap refresh, focus, navigation owner, spoiler-safe inspection, fixtures | [ENGINE_EXPANSION:1463](ENGINE_EXPANSION.md) | proposal |
| RT, PF, DA, AI, TS (engine palette) | Clock, tiered simulation, catch-up, perf, storage tiers, off-screen AI | [Engine runtime palette](ENGINE_RUNTIME_PERFORMANCE_AND_STACK_CONSIDERATIONS_2026-10-14.md) | proposal |
| E1–E10, T1–T10, P1–P3 | Save identity, recovery, transactions, bounded history, workload, portability | [Saves and scale review](ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md) | proposal |
| SC, NV, MW | UI contribution registry, navigation, many worlds and selves | [UI at scale](UI_AT_SCALE_CONSIDERATIONS_2026-10-14.md) | proposal |
| M1–M4 modular seams | Domain registry, architecture check, first migrated domains, lamplight | [Checkpoint](gm/dispatch/modular-seams-2026-10-16/CHECKPOINT.md) | M3 merged, M4 impl-unverified |
| QR1 UI A1/A2, UIL7/UIL8 | Inventory, nearby context, panels, tiers | [IDEA_INDEX QR1](IDEA_INDEX.md#current-queue-routing-2026-10-18) | impl-unverified (other session) |
| QR2 engine A1/A2 | Ability conditions, dependent claims | [IDEA_INDEX QR2](IDEA_INDEX.md#current-queue-routing-2026-10-18) | implemented with fixtures; native gates open |
| QR3–QR5 | Modular engine, source acquisition, older packets | IDEA_INDEX | mixed; anime acquisition deferred |
| WAC8–WAC30 | Cyoria conversion, second world, scaffolder, diff, lint in `npm test`, CLI | [WA doc](WORLD_ABSORPTION_RULES.md) | proposal (LATER/DELEGATE) |

Prefix collisions to fix before anything cites them: PF (play-beyond-menus vs
engine perf), RT (engine vs technology), A1/A2 (UI vs engine). The rules index
has a reserved-prefix table; use it.

## 2. Dependency map: seams ranked by unlock count

Unlock count is **I**: the number of the inventory families above whose own
docs depend on the seam. Mention counts from the sweep (clock 486, custody 206,
workspace 190, projection 187, catalog 165, scheduler 82) are a weak proxy and
are shown only where they agree.

| Rank | Seam (owner) | What one piece of work unlocks | Status of the seam |
|---|---|---|---|
| 1 | **Pack loader through the domain registry** (AR2, WA1, WAC4, K33) | Every design-only world, AU overlays (WA18), private packs, lint in `npm test` (WAC28), pack diff (WAC26), catalog layer (P9Y10), save pin of pack revision (WA10) | Missing. Lint and fingerprint exist; no loader (**V** in WA doc) |
| 2 | **Clock, scheduler and tiered simulation** (AR3, AD15–AD17, RT, AI, E5) | Away-time routines, NPC schedules, canon events as due boundaries (WA15), absent worlds, companions, economy, aging | Partial: `expansion_engine.js` caps 512 boundaries per call; native tick still dominant cost |
| 3 | **Rule modules beyond the village mix** (WAC3, WA4) | World laws as rules, not prose, for every world; absences with in-world reasons | Gap: resolver handles one parameter target |
| 4 | **Custody, transactions, committed receipts** (AR7, E3, EI15, ECR, MR) | Making, trade, loans, companions' inventories, cross-world carry (WA14), rewind safety | Partial; native chest movement outside the custody path is a known gap |
| 5 | **Observer-safe projection and knowledge** (AR8, UIE7, AD6, sealed secrets) | Every UI surface, hidden laws, foreknowledge starts (WA12), secrets | Standing rule; coverage uneven |
| 6 | **Around-you subject selection** (PIR, AY, PF play-beyond, UIE) | Talk, trade, combat target, station use, new-line marks, loops as idle automation | Impl-unverified leaf (QR1) |
| 7 | **Tag/catalog rules over pairs** (CX3, MR, TS, items) | Tenth content item needs no new code; making, tech trees, material traits | Partial |
| 8 | **Generation kit** (GR1–GR17, `gen_kit.js`) | Names, people slots, storylets, area contents, gap filling in packs (WA7) | Kit exists; consumers few |
| 9 | **Generated test journeys** (AR10, AD36, WA19) | Cheap "absorbed" proof for every world and slice | Missing; 37 hand-written `*browser*` scripts (**V**) |
| 10 | **Save slices, compaction, storage backend** (AR6, DA, E4) | Long lives, many worlds, heirs | Fine today; see section 3 |

Reading: ranks 1, 3 and 9 are cheap relative to their unlock and are
prerequisites for the "data, not code" promise (WA1) to be true. Rank 2 is the
only one that is expensive and measured-slow.

## 3. Scale analysis: what limits scale today

### 3.1 Measured facts (V unless marked)

| Metric | Value | Source |
|---|---|---|
| Whole-save bytes: fresh / visitor / 64 helpers | 27,509 / 40,728 / 258,461 | [PLAYTEST:77](PLAYTEST.md) |
| Synthetic larger saves: 1 / 32 / 128 actors | 3,079 / 155,369 / 1,579,124 bytes | engine-runtime ER1 results, cited in the hotspot audit |
| Storage guard | 4 MiB, UTF-16 counted; a crowded primary plus equal backup (6.3 MB) exceeds it | hotspot audit HOT:154 (inference from measured bytes; quota failure not tested) |
| Serialize/write median (64 helpers) | 0.3 / 0.1 ms | PLAYTEST:77 |
| Validate, crowded synthetic | about 509 ms median (Node under heavy host load, ratios provisional) | hotspot audit |
| Tick cost | about 30 ms per game minute fresh; 90–130 ms developed (provisional, busy host) | [rapid iteration F4](reviews/RAPID_ITERATION_CONSIDERATIONS_2026-10-16.md) |
| Offline catch-up arithmetic | 30–130 ms per game minute is 43 s to over 3 min per day away | [foundation considerations](reviews/FOUNDATION_CONSIDERATIONS_2026-10-16.md) (derived, **I**) |
| 64-helper scheduler 12-minute jump | 7,079 ms to 703 ms after one optimisation; first minute tick 1,118 to 200 ms | PLAYTEST:83 |
| Pack-start p95, 64 helpers | 120 ms (from 2,333 ms) | PLAYTEST:77, 83 |
| Inventory render p95, crowded | 14.9 ms; fresh 2.1 ms | PLAYTEST:77 |
| Long tasks, crowded | 10, max 361 ms; DOM about 16,600 nodes, 562 listeners, stable over 40 UI cycles | PLAYTEST:87 |
| Bundle | 5,850,018 bytes (**V**, `wc -c`); 5.1 MB on 10-14 | measured today |
| Tests | 559 `src` files, 272 `tests` entries, 2,234 tests with one failure on 10-18; about 30 s for 1,802 tests on 10-16 | dedup report, rapid iteration |
| Source size | `main.js` 10,310 lines, `display.js` 6,767, `save_files.js` 310 | `wc -l` today |
| Architecture baseline | `main.js` imported by 6 files; many cycle edges tracked on a shrinking baseline | `scripts/architecture_baseline.json` |
| Agent cost, one book | 518 responses, 79.2 M cumulative input tokens (77.4 M cached), 6 sessions, 434,016 words; weekly meter moved 21 to 95 percent (attribution unresolved) | [usage audit](reviews/BOOK_RESEARCH_USAGE_AUDIT_2026-10-16.md) |
| Planned cost under AU13 | 37 shards at 12,000 words plus at most 3 repair, at most 6 responses each (arithmetic, not a trial) | [AGENT_USAGE_RULES](AGENT_USAGE_RULES.md) |

Not found, so not cited: per-world authoring hours, tokens or commits for any
absorbed world; pack record counts; UI list render ms beyond inventory. That
gap is itself a finding (F4).

### 3.2 Which limit binds first

1. **Human acceptance and play time.** Many slices (QR1, QR2, M4, Proto23,
   Glasshouse, FA chain) stand at "implemented-unverified". AGENTS.md says a
   slice ends when Weibao can play it. Each unaccepted slice is a serial gate on
   Weibao, who is the only player. This binds **now**, before any technical
   limit. **I**, but follows directly from the queue rows in IDEA_INDEX.
2. **Agent budget per world.** One whole book consumed most of a weekly
   allowance under the old plan. A world with a series (several books) multiplies
   that. AU13 bounds it, but a series of five 400k-word books is still about 180
   shard readers by arithmetic (**E**). Absorption is cheap per record and
   expensive per world, so the number of worlds is budget-limited well before
   it is engine-limited.
3. **Authoring and review per world.** Franchise worlds have 1,000+ lines of
   design each and zero runtime; built worlds cost hundreds to low thousands of
   bespoke source lines each. Doc volume (405,000 lines outside `research/`)
   exceeds source (97,000) about four to one. Docs are cheap to write and
   expensive to reconcile.
4. **Active-actor tick cost.** 30–130 ms per game minute means whole-world
   simulation of absent worlds is not affordable; it must be tiered (CX4).
   Binds when "living worlds" and offline catch-up arrive.
5. **Save and storage.** Not binding. Even the 64-helper crowded case is 258 KB;
   the guard is 4 MiB. It starts to bind only for the 128-actor synthetic with a
   backup. Trigger to reopen: a real save above about 1 MB (DA, E2).
6. **UI list rendering.** Not binding on measured data (14.9 ms p95), but DOM
   node counts (16–27k) predict trouble once lists multiply; UI at scale already
   owns the answer (SC, LS).

## 4. Scale strategies

Each: proposed default, dial, reason, cost. All are proposals that obey AD5
(defaults with dials) and AD38.

| # | Strategy | Default | Dial | Reason | Cost |
|---|---|---|---|---|---|
| S1 | **Data-driven packs plus rule modules** (WA1, WA5, WA21) | One loader installs pack records into existing owners; a world gets local code only for a truly new verb (AR12) | Local domain module allowed with an in-world reason | New world cost stops growing with world count (WA1's stated mistake) | One loader, one conversion, resolver growth (WAC3). Medium |
| S2 | **Shared verbs, world-owned nouns** (WA5) | Study, craft, fight, trade, travel, learn, appraise are shared | A world may retire a verb | CX2 "connect, don't add" | Needs the second-world proof (AR11) |
| S3 | **Procedural generation and templating** (GR1–GR17, P9Y20) | Area kit: slots by role/count filled by generators, labelled generated, frozen on reveal (GR3) | Generator budgets per world (GR11, WA16) | Fills the gaps books never name without agent reads | Table authoring per generator; lint for budgets |
| S4 | **Lazy and LOD simulation** (CX4, RT, AI5, P9Z41) | People are counts or addresses until observed; absent worlds are coarse yearly summaries; promote on contact | Tier per world: dormant, summarised, supported, active | Measured tick cost forbids full sim; honest to AD15–AD17 | Scheduler tiers, promotion path, equivalence tests (E5) |
| S5 | **Three-layer canon: catalog, inspectable, playable** (P9Y10) | Whole source census as data early; play spreads outward in rings | Ring width per world | Whole canon exists cheaply; depth where play goes (CX1, CX7) | Catalog-only records at Count/Address rung; coverage printout |
| S6 | **Automated absorption pipeline** (WA, WAC12, AU11) | Deterministic locator/shard prep offline; short-lived readers write one ledger each; scaffolder drafts pack records from the ledger; human reviews the draft | Reader model and effort per AU5; shard size per AU10 | Budget and context cost dominate; extraction is mechanical | Scaffolder (small), launcher that enforces AU limits (absent today) |
| S7 | **Generated test journeys** (AR10, WA19, AD36) | One declarative journey spec per signature loop compiled to the existing browser harness: enter, act, save, reload, Export, Import | Per-world depth of journey | 37 bespoke scripts do not scale to 20 worlds | Harness work once; specs per world are small |
| S8 | **Rules over pairs, tags over lists** (CX3) | Interactions as tag rules, not pairwise code | Exception lists per world | Tenth item needs no new code | Rule-module growth |
| S9 | **Overlays, not forks** (WA18, GR8) | AU, divergent and fan continuities add/remove/reweight records | Overlay depth | Seven drifting copies avoided | Loader supports layering |
| S10 | **Deferral register with triggers** (CX8) | Every LATER item names the evidence that reopens it | Trigger strength | Complexity kept, difficulty paced | A table; already seeded in P9Z41 |
| S11 | **Measure-first performance** (E6, PF) | Re-run the representative baseline on today's bundle before any storage, worker or Wasm move | Targets: input p95 < 100 ms, no routine block > 50 ms (proposed targets, not results) | Existing numbers are synthetic, one is under load average ~695 | One profiling session |
| S12 | **Worker or Wasm only for a proven hotspot** (T5, T6, AR header "no rewrite") | Not before S4 and S11 show the tiered tick is still too slow | Trigger: a tier-3 tick above 50 ms after S4 | Avoids rewrite-as-escape | Defer |
| S13 | **Document hygiene** | Fold the four overlapping weaponcraft docs into one owner; fix prefix collisions | One-off | Reconciling docs is a hidden cost (3.2, item 3) | Small |

### Beyond the current ambition

These go past "reach the plan". All are proposals; Weibao chooses direction.

1. **Worlds derived, not authored.** With S1, S6 and S9 working, a new
   continuity (AU, divergent, crossover) is an overlay on an existing pack. The
   multiplier is overlays times worlds, not authored worlds. This is the
   cheapest way to make the multiverse larger than the books he owns.
2. **Combinatorial worlds from the card model.** The north star's world card
   (laws, absences, dials, names, scarcity, deck, doors) is already a
   recombinable record. Generated "infinite-variant" worlds (Kang-style) are cards
   assembled from the shared library under GR rules, kept distinct by the swap
   test. This is the route to unbounded worlds without unbounded reading.
3. **Play as the authoring surface.** Weibao is the creative director and only
   player. A director view that edits dials, absences and decks of a pack in
   game, saved as a pack overlay with revision (WA10), shortens the loop from
   idea to playable to minutes. It reuses WA21 (plain data) and the lint.
4. **Rules that discover interactions.** Tag-based mechanism rules (CX3, AD38)
   mean ideas combine without anyone coding the pair. Add a "possible
   combinations" report from the lint so unexpected synergies (which he wants,
   "busted synergies") are found by search, not by accident.
5. **Optional run-time text generation** (I23) for gap dialogue and rumor, frozen
   on reveal and never writing back into the pack (WAC22). Off by default.
6. **Measure change surface per world as the KPI** (AR13): new core-owner files
   touched per absorbed world. If it trends to zero, scale has been achieved
   regardless of world count.

## 5. Sequenced build order (proposal)

Each slice ends where Weibao can play it. Order follows unlock rank and the
first-milestone rule. Level is who should do it; effort is a rough size (**E**).

**Slice 0 (not mine, in flight): close QR1 and QR2 acceptance.** Other sessions
own this. Nothing below should dispatch implementation into the same files
(AR15).

| Slice | What he can play | Level, effort | Done check |
|---|---|---|---|
| P1 Baseline and budgets | A short report, no gameplay: current tick, save and list numbers on today's bundle, three fixtures | Coder, one session | Table of ms and bytes at 1920×1080 and 1366×768, with input identity; confirms or revises section 3 |
| P2 Pack loader + Cyoria conversion (WAC8, WAC9, WAC10, WA17, WAC28) | The existing Mother of Learning loop, unchanged, now installed from the pack | Strong coder, one focused session; structural | Same rebuilt journey before and after; save, reload, Export, Import identical; pack lint runs inside `npm test`; `check:arch` zero growth |
| P3 Second world through the format (WAC11, WA20, AR11) | Proto23 or another already-built world re-expressed as a pack, then one contrasting small design-only world | Coder plus designer; first conversion is small (Proto23 is about 711 lines) | Format changes recorded; second case needs less core work than first, else revise (AR11) |
| P4 Generated journeys (S7) | Same loops, verified by a spec instead of a bespoke script | Coder, medium | The P2 and P3 journeys re-run from specs; one script retired |
| P5 Tiered NPC and absent-world tick (S4, CX4) | Living household and one absent world that "moves on" while away | Engine designer plus coder, medium to large | Split and single advances agree; tier-3 tick under the P1 target; reload mid catch-up loses no time (E5, G26–G30) |
| P6 Area kit and catalog layer on one world (P9Y20, S5) | The entry area plus one neighbour of a selected world, with the rest of its canon inspectable | Designer plus coder, medium | P9Y21 area check: reach, do one useful thing, meet someone at Met+, leave, return with consequences, survive save/reload/import |
| P7 Absorption pipeline pilot (S6, WAC12) | One new world's signature loop from a fresh read | Coordinator plus readers under AU13 | Ledger to draft pack lints with only WA4 law gaps; usage recorded against a stated budget; first real per-world cost number (fixes F4) |
| P8 Rule-module growth (WAC3) and combination report | Laws for the new world as rules; absence messages in play | Coder, medium | Pilot coverage shows K2 at T2 with laws as rules |

Recommended first three: **P1, P2, P3.** They cost almost no agent budget,
unlock ranks 1, 3 and 9, and produce the first honest numbers. P7 is the first
slice that spends the large agent budget, which is why it comes after the format
is proven twice (WA20).

### Defer (with reopen triggers, CX8)

| Deferred | Reopen when |
|---|---|
| Worker, Wasm, Godot, native app, IndexedDB move | A tier-3 tick or a real save exceeds the P1 target or 1 MB after S4 |
| Per-NPC full simulation for all worlds | A slice needs "where is this person now" for a real choice (P9Z41) |
| Regional aggregate sim, atlas view, tile scenes | Two consumers need region state; a network exceeds the neighbourhood list |
| Absorbing all design-only worlds | P7 gives a measured cost per world, and Weibao names the next world |
| Old-save migration | Compatibility decision of 2026-10-17 is lifted |
| Mobile optimisation | Weibao lifts the standing UI priority |
| Optional LLM runtime text | A pack or slice names a specific unmet need |
| Cross-world simultaneous time | Accepted clock policy change, never by default |

## 6. Risks and flawed premises

R1. **"Implement everything" is not the plan and cannot be.** The accepted
model is "every idea somewhere, not everywhere" ([north star](LIFE_SIM_NORTH_STAR.md#every-idea-somewhere-not-everywhere-proposal-2026-10-08)).
Treating the ideaboard as one backlog would make worlds identical. Success is
that every idea has a home and can be turned on, not that all are on.

R2. **The "add variety as data" promise is not yet true.** The north star's
Build plan says a world adds a route by data, not a new `*_host.js`. Today
Mother of Learning is six bespoke files and Paradise is eleven; the pack
pipeline has a linter and no loader. Until P2 lands, every new world costs like
world one.

R3. **Lint passing is not absorption** (WA19). The pilot lint is clean while two
real gaps (K2 laws, K8 daily life) remain. A pack count is not a progress
measure.

R4. **Acceptance debt.** Many slices read "implemented-unverified". Adding more
engine before Weibao plays them multiplies unverified surface. This plan's first
three slices deliberately add no new gameplay.

R5. **No measured cost per absorbed world exists.** Section 3.2's second
bottleneck uses arithmetic, not a trial. Do not promise a world count until P7.

R6. **Doc volume is outrunning code, and duplicates exist.** Four weaponcraft
and runes docs overlap by title; PF, RT and A1/A2 prefixes collide; two
renames (CX to ECX, GR to UGR) happened on 2026-10-19. Reconciliation cost is
real and silent.

R7. **Performance numbers are synthetic and one set was taken at a load average
of about 695.** The save and tick tables are directional. The 4 MiB guard with
backup (HOT:154) is inferred from bytes, not from a browser quota failure.

R8. **Offline catch-up arithmetic is a quiet blocker.** 43 s to over 3 minutes
per day away at current tick cost makes "away time runs routines" (AD15–AD17)
unaffordable for populated worlds without S4.

R9. **Procedural NPC work is deprioritised by standing direction** (AD33). The
LOD strategy here keeps NPCs as counts and addresses, which is compatible; a
full NPC population sim is not, and is deferred.

R10. **Framing in the brief to check.** "How to create the scale he wants and
more" assumes one scale. He has said both "more complexity retained" and "defer
a lot"; the two meet in CX1–CX8, so the plan paces depth rather than capping it.
Also, the brief's measures (save bytes, tick, list render) are not where the
first limit is, as 3.2 shows.

R11. **Agent-run hazards.** The launcher the usage rules mention was absent when
checked, so AU limits are instruction-level only. A pipeline (S6) should include
a launcher that refuses unbudgeted expansion before any bulk run.

## 7. Open questions only Weibao can answer

Defaults are proposed; he only needs to object.

Q1. **Next world after the format is proven (P3/P7).** Default: a contrasting
world with an existing build packet and strong signature loop (Skyrim's
enchanting supply, trade and expeditions is the proposed default). Cost is agent
budget; this is his selection (WA).
Q2. **Agent budget ceiling for the P7 pilot.** Default: one world, AU13 sized,
inside the five-points-of-weekly-meter default (AU7).
Q3. **Whether to pause new engine proposals until QR1 and QR2 are played.**
Default: yes for runtime code; documentation continues.
Q4. **Irreversible:** committing to the pack as the only route for new worlds
(retiring `*_host.js` for new worlds) after P3 proves it. Default: adopt after
the second world passes AR11.

## 8. Weibao's answers, 2026-10-19

Recorded from his reply in chat (his words are the authority; the readings below are mine).

- **Q1** ("What is first? what even is done yet?"): he wants a plain status of what is finished before choosing an order. The status table is in the chat reply for this date; the standing fact is that **no slice is human-accepted**. [Acceptance prep](reviews/ACCEPTANCE_PREP_2026-10-19.md) is agent evidence for M4 lamplight, the money seam and the defeat publisher, and says acceptance stays open. First world choice is therefore not yet made; P1–P3 need no world choice.
- **Q2**: agent work now runs on Sonnet, so there is more headroom. Reading: AU5's cheap-extraction route is now Sonnet-class; AU7's five-point default ceiling stays until a finite number is stated for P7.
- **Q3**: pausing new engine proposals is not necessary. Reading: proposals and runtime work may proceed in parallel, still one writer per file area (AR15).
- **Q4**: he does not know the optimum and suggests Opus for very hard, consideration-heavy work. Proposed routing (not yet accepted): Opus for format and seam design (pack loader and resolver growth, tiered-simulation design, the P3 format revision); Sonnet for readers, extraction, conversions, tests and journey specs. The Q4 retire-`*_host.js` choice is left open until P3 shows the result.

### Next world, 2026-10-19 (Weibao: "something that can have so much depth? Maybe Naruto or LOTM or something deep")

His words name a direction (deep world) and two candidates, not a final pick. Proposal, labeled as such: **Lord of the Mysteries first, Naruto second.**

Evidence for the order (V, file sizes and docs):
- LOTM has 464 KB of saved reading in [docs/research/novels/lord-of-mysteries](research/novels/lord-of-mysteries/BRIEF.md) (pathways deep dive, wiki cross-check, reader notes, world design), and the [HP versus LOTM recommendation](worlds/HP_LOTM_NEXT_PLAYABLE_FEATURE_2026-10-15.md) found the strongest primary-text support there and recommended an early-LOTM acquisition-to-controlled-use feature. A Fog City card and entry row exist.
- Naruto has a design packet (about 1,000 doc lines) but only a 16 KB fanfic survey under research, and its databook acquisition sits in the [queue](research/FUTURE_ACQUISITION_QUEUE_2026-10-13.md). Its packet leans on general knowledge, so absorbing it means a fresh read first (AU13 cost).
- Depth fit: LOTM's signature loop (acquire, act, digest, mask, madness) stresses WA4 laws-as-rules, hidden state and sealed secrets, which is the strongest test of the pack format for P3/P7. Naruto stresses breadth (bodies, jutsu, villages, ranks), a useful contrast later.
- Cost: LOTM P7 reuses existing reading, so it spends little new agent budget; Naruto spends a full read.

Not decided: Weibao may still pick Naruto or another world; P1–P3 do not depend on it.

### LOTM and COI readiness, more to consider (2026-10-19)

"COI" here is the sequel *Circle of Inevitability*. Sealed MYSTERIES files were not opened; secrets stay by ID (WA11).

**What exists (V, from the two COVERAGE/CHECKPOINT files):**
- COI: 1,178 of 1,178 narrative entries read, reviewed and integrated; final audit rev 73 repaired 11 errors; WORLD_BRIEF, PEOPLE, POWERS, WORLD, TIMELINE, MYSTERIES and INTEGRATION_PACKET exist ([checkpoint](research/novels/full-book/circle-of-inevitability/CHECKPOINT.md)).
- LOTM book 1: all 1,402 entries read, but only **363 reviewed and integrated** (all 213 of Part One plus Part Two 1–150), 1,313 claims, 246 context cards; its goal is host-blocked ([checkpoint](research/novels/full-book/lord-of-mysteries/CHECKPOINT.md)).

**ACT NOW (done in this note)**
- **LC1 Early LOTM is already covered.** The reviewed span (all Part One, start of Part Two) is the early-game material the recommended Seer slice needs, so P7 for early LOTM needs no new reading.
- **LC2 COI is ready as an era overlay, not a first slice.** It is fully reviewed but later in the timeline; model it as a continuity overlay on the same pack (WA18, GR8), with rules versioned by era (identity-laws IL28).

**ACCOUNT FOR NOW**
- **LC3 Review gap is the real remaining cost.** About 1,039 LOTM1 entries are read but not reviewed. This is coordinator review work, not new source reading, so Sonnet at medium effort fits (AU5, AU13). Do it only when a slice needs a later span (CX1).
- **LC4 COI engine fit is unverified.** The packet's "lend and recall" mapping was written against documentation and validators only; the apply code was not read. The pack route (P2/P3) replaces the old "deliver to the implementation master" step, so re-check the mapping against the real loader then.
- **LC5 Engine seams LOTM needs, by existing owner.** Borrowed-source grant and termination (BF5 in [feature gaps](worlds/BOOK_WORLD_FEATURE_GAPS_2026-10-15.md)); ability conditions and dependent claims (QR2 engine A1/A2, implemented with fixtures, **no native consumer yet**, so LOTM can be the first); hidden state and sanity (AD6, AD8); masks and identity (AD23). Native mode currently returns no LOTM grants or commits (gap doc line 54).
- **LC6 Scope trap to avoid.** Full potion crafting, arbitrary pathways, numeric digestion and next-Sequence play are the named expansion risk (HP/LOTM note). Default: one pathway (Seer), one supervised acquisition, one bounded action with stop and recovery. Dial: widen after Weibao plays it (CX7).
- **LC7 Source caveats.** The compilation's authenticity and completeness are unverified and the text is a translation, so facts carry confidence `translated` (WA3) and direct recreation stays in the private pack path (AD1, WAC24).
- **LC8 Sealed truths.** MYSTERIES and any twist the pack encodes are stored as IDs with discovery routes (WA11); agents implement them without showing truths in chat (AGENTS Sealed secrets).
- **LC9 Beside the protagonist.** The [pathways deep dive](research/novels/lord-of-mysteries/PATHWAYS_DEEP_DIVE_2026-10-10.md) is built around living beside the canon cast; canon-people rules (RLCE, P9Y12) apply, with spine characters authored and gaps generated and labelled.
- **LC10 Host state.** The LOTM1 reading goal shows blocked from an external status; check live state before any resume (shared-worktree practice) and do not reuse its old process handles.

**LATER / DELEGATE**

| Code | Item | Level, effort | Done check |
|---|---|---|---|
| LC11 | Review the next LOTM1 span a slice needs | Sonnet medium, bounded shards | Coverage file shows the span reviewed with claims integrated |
| LC12 | LOTM pack draft from the ledger (WAC12) | Sonnet scaffold, Opus reviews the law encoding | Pack lints with only WA4 law gaps |
| LC13 | Native consumer for engine A1/A2 via the Seer feature | Opus design, Sonnet build | Seer action refuses and succeeds by conditions in a rebuilt browser with save, reload, import |
