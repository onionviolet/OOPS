# World atlas as the project's platform: goal check, 2026-11-24

Proposal, not an accepted decision (AD32). Trigger: Weibao, "how can we bring the world atlas up to speed and use that as a platform for implementing things/organize everything we have or will have in the future?", then "are we taking into consideration the updated goal/direction and more?"

**Owner.** The atlas plan lives in the [World atlas ideaboard](../research/WORLD_ATLAS_IDEABOARD_2026-11-22.md), whose [implementation workspace proposal](../research/WORLD_ATLAS_IDEABOARD_2026-11-22.md#implementation-workspace-proposal-2026-11-24) (written today, uncommitted at the time of this check) already says: the atlas joins existing owners by their IDs and links back, refresh and provenance first, a Workbench implementation view, a Watchcraft pilot. This note does not replace it. It checks that plan against the updated goal and direction and adds what it misses.

Evidence reached: atlas build run at `db24d3a92` plus the uncommitted tree (13 s, zero failures); [goal discovery](OOPS_GOAL_DISCOVERY_2026-11-24.md); the [vision log](../gm/USER_VISION_LOG_2026-11.md) entries from 11-19 to 11-24; [PROJECT.md](../../PROJECT.md) current focus; [RULES_INDEX](../RULES_INDEX.md) register; uncommitted diffs to `prototypes/world-atlas/build.mjs` and `serve.mjs` (edited 15:28 today: on-demand refresh, dirty-tree flag, latest batch collection). Nothing built.

## The direction it has to serve

- **Working goal (provisional).** Getting better feels good right away; growth keeps opening things to try; a pursuit of your own across worlds that can still surprise; book-world possibilities brought to life; a UI that shows progress. Builder motivation: watching the UI improve and seeing novel possibilities come alive. ([goal discovery](OOPS_GOAL_DISCOVERY_2026-11-24.md))
- **Build order.** Procedural foundations first (Gu, creatures, potions, chemistry, crafting, spellcraft), proven headless; playable slices and Klein/Harry/Fang Yuan routes resume on them. ([PROJECT.md](../../PROJECT.md#current-focus))
- **Making.** One making loop in every world, typed by each world's capabilities; five bench forms embedded in the scene (MKC33-MKC105).
- **UI.** Responsive and expressive; 1920×1080 leads reviews.

## How the atlas plan fits

- **F1 Fits: book possibilities brought to life.** The atlas's core is already the book-to-game ladder (Making view, WA11). That is the builder motivation in Q4 made visible.
- **F2 Fits, and should merge: the Watchcraft pilot is the goal check.** The ideaboard pilots the implementation view on Watchcraft; goal discovery's A1 asks Weibao to replay Watchcraft and notice whether the numbers going up feel good. Run them as one: the pilot card records his A1 answer and the Q2 follow-up ("which number did you check twice?") as the pilot's player outcome.
- **F3 Gap: the atlas shows worlds, not "what opens next".** The goal's spine is growth that opens things. No atlas view answers "what does getting better at X unlock, and where?" The data partly exists (recipes, mechanics, progress). An unlock-chain lens per world would test the goal on paper before play does.
- **F4 Gap: foundations-first is not visible.** The active work is the foundation run, but the atlas has no shared-system row for Gu, potions or the bench forms; game-making covers LOTM and HP only. The ideaboard allows a shared system under several worlds; Gu refinement, the rune bench and the five making forms should be the first such rows, ahead of more book places.
- **F5 Gap: "see the UI get better".** WA16 (since last time) is proposed as source diffs. The builder motivation wants a visible change too: the newest browser receipt or screenshot per card, oldest-to-newest. Cheap, since receipts already exist under `docs/representations/evidence/`.
- **F6 Guard: the atlas stays a dev tool.** The goal prizes surprise. GN1 keeps sealed truth out of play; WA7 (the atlas as an in-world object) would need a spoiler line before it goes anywhere near the player.
- **F7 Code clash.** The ideaboard's WA1-WA22 reuse the prefix of the registered World absorption rules (WA1-WA68 in RULES_INDEX), and WA1/WA5/WA8 appear twice inside the ideaboard. Rename the ideaboard family (for example WAT) before more documents cite it.

## What changes from my first draft

My first draft (same file, earlier today) proposed parsing every register (rules, systems, seams, writeups, ideas) into the atlas. The ideaboard's leaner rule wins: add links as work is picked up and backfill only where a missing link blocks a decision. That matches the build order and avoids a large ingest nobody consumes. A rules-register part stays a cheap option later, since `check:rules` already enforces its format.

## Reconciliation: Watchcraft pilot versus a game codex (2026-11-24, later)

Weibao: "what is the watchcraft pilot? why not work on the world walks, or on turning the readings into implementation or first into atlas for implementation? like atlas of all the gus, potions, stuff and more? almost like a wiki of this game?"

| ID | Claim and locator | Classification | Evidence | Disposition |
|---|---|---|---|---|
| R1 | The ideaboard pilots the implementation view on Watchcraft (ideaboard, implementation workspace proposal, step 3) | Compatible variant, wrong fit for the platform's base | Watchcraft is a Village patrol career: rehearsal, a 60-coin patrol, Tessa's report, a Local life follow-up, promotion to Mentor ([replay receipt](../audits/WATCHCRAFT_HANDOFF_REPLAY_2026-11-24.md), agent-verified). It was chosen because it was freshly verified, not because it is foundations work | Keep it as Weibao's 20-minute goal check (goal discovery A1). Stop using it as the atlas pilot; F2 above is withdrawn |
| R2 | Readings into the atlas for implementation | Incomplete integration | Reader digests are already in the atlas snapshot: RI 5,410 entities (912 labels ending in "Gu"), LOTM 10,929 (85 labels naming a potion), HP 3,445. The Things view draws at most 72 per world (`things-views.mjs` `MAX`). The book-to-game ladder (absent, recorded, playable) exists only for LOTM rites, potions and summons plus three HP/LOTM makers (`game-making.mjs`) | Proposed base for the platform: generalize the ladder from making rows to every entity kind |
| R3 | Game catalogue linked to readings | Missing supplier | `src/gu_catalogue.js` holds 81 Gu with chapter citations; 0 of 81 carry a reader id (`ri.*`). LOTM has a join key (`indexId` in the private cast pack, act rows' `sourceIds`); RI does not | The first slice adds reader ids to the Gu catalogue rows; name matching may seed it but stays labelled atlas-inferred, as `game-making.mjs` already does for its hand links ("never passes a guess off as a citation") |
| R4 | World walks (the lead-life playthroughs: Klein, Harry, Fang Yuan) | Current direction says wait | PROJECT.md current focus: foundations first; Klein and Fang Yuan pause at ch129 and ch140 and are first consumers when slices resume | User decision. A codex makes the walks cheaper later, because each walk window can list which Gu, potions and places it needs and their ladder state |

**Revised recommendation.** Build the codex first: one page per kind (Gu, potions, then items, creatures, places), each row a read thing with its source locator, its game id if any, and its ladder state. The gaps list on each page is the implementation backlog for the foundation run. Gu first, since the reading is deepest and the catalogue is a foundation part; LOTM potions second, since their join already exists.

## Round 3: is an atlas worth it, its look, and what foundations take (2026-11-24, later)

Weibao: "is it even effective to have a world atlas, or would it be effective once the world atlas existance means existing in game? How can we at the same time improve the look of the world atlas? Foundation is true, but what do we need to do to achieve foundations?"

Evidence: `docs/coverage/README.md` (generated, last ledger commit `33e84f692`, 2026-11-19); state counts over all `docs/coverage/*.jsonl` run today; `src/known_things.js` (SX1); `prototypes/world-atlas/mechanics.mjs`; atlas screenshots of 2026-11-21; [foundation run resume block](../gm/dispatch/foundation-run-2026-11-12/RUN.md#current-resume-block); [foundation plan milestones](../PROCEDURAL_FOUNDATION_PLAN.md#milestones-ms-each-one-useful-if-the-run-stops-after-it).

| ID | Finding | Classification |
|---|---|---|
| R5 | The "wiki of everything" data already exists as the coverage ledgers: about 200 corpora, 73,026 rows, each with a state (runs, expressed, catalogued, blocked with a named missing rule, not-a-thing). 71,348 things, 432 computed runs (0.6%). Gu kinds 1,466 rows, 16 run; Gu moves 778, 759 blocked; LOTM potions 226, 208 typed runs; HP potions 316, 90 typed runs; HP spells 117, 108 typed runs | Duplicate: R2/A2 above proposed rebuilding this from reader digests. Superseded; the codex reads the ledgers |
| R6 | The atlas reads the ledgers only in aggregate (`mechanics.mjs`: blocked slugs and running laws per world). No per-row page per kind | Incomplete integration |
| R7 | At least four "atlases" over overlapping data: World atlas, Progress atlas, `foundation-atlas.html` (foundation run), Library build atlas | Scatter. One view over the ledgers; the others link in |
| R8 | The game already has a player wiki: Known things (SX1), one searchable reference over creatures, books, items and places the player has met, built from records the game keeps | Compatible variant: the in-game lens of the same rows |
| R9 | Only 9 effects land in ordinary play (all in the RI Keeper start; Village 0), per the ledger headline (PWC128) | Missing proof for foundations "works in play" (MS5) |
| R10 | The foundation run's last wave is Wave 22 (2026-11-16). Since then the work went to play-surface UI | Stalled lane, not a decision |
| R11 | Largest blockers: Gu kinds `effect-unknown` 296 and `rank-unknown` 221; Gu moves `roles-unknown` 651; LOTM powers `effect-unknown` 82, `form-transformation` 64; HP potions `body-door` 46, `effect-sentence` 33, `mind-state` 31. Inference, not verified: the `*-unknown` slugs are reading gaps (the source fact is missing), the rest are missing rules | Backlog with owners in the ledgers |

**Is it effective?** As a separate dev map, not proven: no commit found where atlas output drove an implementation decision. It earns its place when existence is tied to the game. Proposed shape: one data layer (the ledger rows, with reader ids), two lenses. The dev atlas shows every row, its state and its gap. Known things shows rows that run and that the player has met, in the world's voice. "In the atlas" then means "a ledger row"; "in the game" means its state runs. The atlas itself stays out of play (F6).

**Look.** Draw the atlas with the game's own kit (Graphite tokens in `styles/ui_tokens.css`, the reference kit Known things uses). Each improvement then previews the in-game codex. Concretely: kind pages as cards or rows with a kind glyph and a state colour (WA2), a book quote or caption (WA3, WA4), the bitmap face for headings only, a themed search field, box diagrams kept for places and relations only, and a coverage bar per page (16 of 1,466 Gu run).

**What foundations take (MS1-MS7 already define done).**
1. Restart the foundation run from its resume block (R10).
2. Close reading gaps for the largest `*-unknown` blocks: Gu effect and rank, Gu move roles (R11). Targeted reads; spend is Weibao's call.
3. Build the few missing rules shared across worlds: mind-state, body-form, form-transformation, divination-fate, effect-sentence.
4. Make effects land in ordinary play beyond the Keeper start, Village first (MS5, R9).
5. Track it on atlas kind pages over the ledgers, Gu first (R5, R6).

## Round 4: canvas, the cat, a path into the game, the run, a design language (2026-11-24, later)

Weibao: "also make atlas more tech capable like the scrollablw canvas/web? Consider the original inspiration of the cat with the thoughts and more? Can we improve how foundation run works too based on newe directions, and also make world atlas proper? like both a Dev wiki on what exists, but also a path to directly add to thje game easily somehow? more to cvonsider? How can we implement the cannon thinggs? The Ui work has resulted in alot of improvements, but we need a custom/us specific design language to fopllow through and make sure evcerythign is similar quality and more?"

Evidence: [Sol canvas brief](../gm/dispatch/play-surface-2026-11-14/ATLAS_CANVAS_SOL_BRIEF_2026-11-20.md) and its references (`box-map-reference.png`, `kitten-inspector-reference.webp` in `docs/representations/evidence/world-atlas-2026-11-20/`); [DESIGN.md](../../DESIGN.md) DSG1-DSG11; UI_RULES (175 UR rows); [round 14 UI kit](../../prototypes/ui-kit-2026-11-15/README.md) (proposal, 11-15, before Graphite); `tests/ui_contract.test.js` and its allowlist (783 grandfathered entries); `src/ui/` (76 shared modules, including `inspector.js`, `figure_graph.js`, `walk_map.js`, `relationship_web.js`, `creature_record.js`); [case shape](../coverage/CASE_SHAPE.md); `src/authored_site.js`.

### What the cat was

The reference is a single creature line, "calm brown kitten", with `+ body` and `- thoughts` folds; the open fold reads "What is this place? Where am HELP I AM STUCK IN CAT BODY meow". Four ideas in one image: a thing has an inner life; you unfold it in place, nested; the inner life is live state, not a description; and it can be funny. The Sol lane applied it to atlas creatures only (Moss's Kind, Traits, Observations folds).

| ID | Finding | Classification |
|---|---|---|
| R12 | The cat fold is the strongest piece of the original atlas inspiration and is used in one view | Incomplete integration |
| R13 | The atlas draws with its own `canvas.mjs`; the game already has a figure primitive with graph layouts, a walk map, an inspector and a relationship web in `src/ui/` | Duplicate renderer |
| R14 | Implementing canon has a defined conveyor: ledger row, then `case` plus `expect`, then `runCase`, giving `expressed` when the world changes and `runs` when the case module is reachable from `src/main.js`. Today 39,234 rows are `catalogued` (no case), 1,615 `expressed`, 432 `runs`, 9 effects landing in ordinary play. The field-fill step (`scripts/field_fill.mjs`) sits on an unmerged branch | The conveyor exists; reach into play is the narrowest stage |
| R15 | Design language exists in pieces: DESIGN.md (feel and six readiness checks), 175 UI rules, a pre-Graphite UI kit marked proposal, a token contract with 783 grandfathered exceptions | Scatter plus missing proof: nothing shows every feature meets the same bar |
| R16 | Master holds 136 uncommitted files from other sessions, including atlas server edits from 15:28 today | Landing debt; the foundation plan's own step 1 is "stabilize" |

### Atlas technology: options

- **T1 Grow the atlas's own canvas.** Add infinite pan and zoom, level of detail and virtualization to `canvas.mjs`. Cheapest now; keeps a second renderer.
- **T2 Adopt a graph library** (Cytoscape.js for large graphs, or a whiteboard engine). Handles thousands of nodes; diverges from the game's look and adds a dependency.
- **T3 Build the atlas from the game's own UI primitives (recommended).** Extend `figure_graph.js` and `walk_map.js` with pan, zoom and level of detail; use `inspector.js` for the side panel; add one shared Fold primitive for the cat. Everything built for the atlas becomes available in play, and the atlas becomes the largest live demo of the design language. Cost: the atlas imports game UI modules, so it follows the token contract.
- **T4 (unusual) The atlas as a web of pages.** Every row is a page with links (a wiki), and the canvas is just the map of those links, as in a note-graph app. Strong for "dev wiki"; pairs with T3 rather than replacing it.

Recommendation: T3 plus T4. Pages for every ledger row, the canvas as the map over them, both drawn with game primitives. With 73,026 rows the canvas shows aggregates and opens rows on demand (8 GB target, OR8).

### The cat, generalized

One Fold primitive, used in the atlas inspector and in Known things. Each kind supplies its folds from live state: a Gu its body, will and appetite (`gu_attitude.js` exists), refinement and path; a potion its ingredients, effect and risk; a person body, thoughts and routine; a place who is here and what can be done. The dev atlas shows the true state; Known things shows what the observer knows (GN1, KNW rules). Thoughts text comes from state and the world's voice (DSG3 whimsy), never as a free-floating flavour line.

### A proper atlas: dev wiki plus a path into the game

The wiki is the ledger rows (R5). The path into the game follows the conveyor (R14), and each row page shows which stage it is stuck at with the action for that stage:

1. **Missing facts** (`catalogued`, a `*-unknown` blocker): "queue a targeted read" for that row (spend gated by Weibao).
2. **Missing rule** (`blocked:<rule>`): links to the rule's owner and to every other row the same rule blocks, so a rule is picked by how much it unblocks.
3. **Has a case, not reachable** (`expressed`): "draft a consumer" opens the Workbench with the owning module and a named scenario.
4. **Runs**: the play receipt, and the Known things preview.

Writeback stays as the translation-layer proposal set it: the atlas writes an overlay or a scratch patch (a ledger line, a case stub, a pack draft) plus a diff for review; it never writes `src/` or a live pack directly. `authored_site.js` and the Workbench scratch pack are the precedents.

### Foundation run, updated for the new direction

Keeps OR1-OR10. Adds:

- **FR1 Pick by unblocking.** A wave takes the blocker that unblocks the most rows whose consumer exists now (OR1), read from the ledgers.
- **FR2 Reach is the score.** Each wave moves the ordinary-play landing count (PWC128, 9 today), not only ledger states.
- **FR3 Payoff line.** The wave report adds what number now goes up and what opened for the player (goal discovery).
- **FR4 Built in the language.** A wave's panel uses the shared primitives and adds no allowlist entries.
- **FR5 Atlas at the end.** The wave reruns `build.mjs`; the row pages are the wave report.
- **FR6 Land first.** No wave starts on a tree with unowned uncommitted work (R16).

### A design language of our own

- **L1 One grammar, enforced (recommended).** Name a small set of primitives (box, row, verb row, fold, glyph token, meter, known/estimated/unknown number, report line, map node, beat for motion), each with one implementation in `src/ui/`. Rebuild the UI kit page from those real components in Graphite, so it cannot drift from the game. Ratchet the 783 contract exceptions down, never up. Score each feature at 1920×1080 against DSG6-DSG11 with a screenshot.
- **L2 A strong metaphor (unusual).** Every surface is a page of an in-world almanac or ledger (ID2 from 11-21). Weibao chose the Graphite baseline over it, so it stays a per-world dial, not the language.
- **L3 Per-world skins first.** Defer the shared grammar and let each world style itself. Rejected: it multiplies the consistency problem this round is about.

### Making sure DESIGN.md and the UI rules are followed

Weibao: "make sure design.md and ui rules are followed?"

| ID | Finding | Classification |
|---|---|---|
| R17 | Checked by tooling: tokens, spacing, control heights, layers, type roles and clickable divs (`tests/ui_contract.test.js`, UR65-UR68, UR130-UR133; new literals fail, 783 grandfathered); five 1920×1080 pixel baselines plus two private lives (`npm run check:visual`, on request, not in `npm test`); player text, descriptions and UR178 filler phrases (`check:rules`); DSG12 and DSG13 world looks (`tests/world_look.test.js`) | Enforced, partly |
| R18 | Not checked by anything: DSG6-DSG11, the six readiness checks every feature UI meets (home, glance form, details one click away, empty state, reason on anything greyed, one home per fact); the UR76 contract card is a prompt | Accepted text with no check |

Proposed, warning-first like the existing rule lints:

- **DC1 Design receipt per feature home.** Each registered panel home carries a short receipt: its UR76 card, a 1920×1080 screenshot, and one line per DSG6-DSG11. A script lists homes without one (warning, not a gate). Assumes panel homes are enumerable from `definePanel` registrations; not verified.
- **DC2 Ratchet.** Report the contract-exception count in each wave and lane report; it only goes down.
- **DC3 Review pass.** At the end of a UI or foundation wave, one reviewer pass reads DESIGN.md, the UI rules router and the screenshots, and lists DSG misses. Labelled agent-verified, not human-reviewed (AD42).
- **DC4 The kit is a baseline.** The rebuilt kit page (L1) joins `check:visual`'s screens, so a token change that breaks a primitive shows up in one place.

### Ideas from the Proto23 Discord catalog

Weibao: "we can also use the discord MCP in parallel for more ideas too". No Discord MCP is connected; [TOOL_REGISTRY](../TOOL_REGISTRY.md) keeps Discord as a shell route over the offline workbench. A read-only search of its three local catalogs (`corc-2026-10-20`, `-tagged`, `corc-demo`, all Corc-filtered Proto23 messages) found nothing for wiki, codex, bestiary, canvas or kitten. Locators are message ids in `discord-reference-workbench/data/catalog/corc-2026-10-20-tagged/catalog.json`. Unclassified evidence, read by a subagent; not spot-checked.

| ID | Idea | Locator | Feeds |
|---|---|---|---|
| DI1 | Undiscovered entries show "???" or a placeholder block (Corc, 2021-03-29, 2026-07-27) | 826197286777389086, 1531327134620975185 | Known things empty and unknown states (DSG9) |
| DI2 | Recipe hints through lore before the recipe is known (2021-11-03/04) | 905507539150594078, 905647609589420083 | Codex rows the player has heard of but not met |
| DI3 | Search recipes by component, after Cataclysm (2023-05-26/27) | 1111779482752274432, 1111836731768061963 | Atlas and Known things search |
| DI4 | Body-part state you cannot read until you have the knowledge ("it's just a big graph"; Mercurius, 2026-07-11) | 1525646114697515008 and following | The Fold shows what the observer knows |
| DI5 | Hold Shift to reveal how a status changes a weapon (Corc, 2024-07-07) | 1259375626364915743 | Details one click away (DSG8) |
| DI6 | Recipe info: success rate, whether it teaches a skill, times crafted (2021-11-03) | 905448996988940328 | Potion and Gu row folds |
| DI7 | A player kept a Trello of every item and mechanic (2021-11-04) | 905714641383063553 | Demand for a codex |
| DI8 | Consistency fixes: one backdrop behind HP text, matching glow on effect icons, a description window that "matches the rest of ui", Corc disliking no gaps between windows | 1515291245159649401, 1162857001827704955, 1556108309105344552, 944926662489960478 | L1 grammar. Gaps conflict with the accepted seamless Graphite panels, so Graphite stays |
| DI9 | "cat thoughts are unhinged" (Corc, 2026-07-10) | 1525227182631419966 | Possible origin of the kitten reference; not confirmed |

### More to consider

- Sealed truth: the dev atlas shows what Known things must hide; one read model, two observers.
- Source text: ledger rows derive from private books; keep `private/` content out of commits and anything published.
- One writer per file: another session is editing the atlas server now; T3 touches shared `src/ui/` files owned by play-surface lanes (OR6).
- A rule unblocks across worlds: a blocker page should list every corpus it blocks (mind-state blocks HP potions and Gu kinds alike).

## Suggested order

0. **A0** Land the uncommitted tree by owner (R16, FR6). Weibao's call which session does it.
1. **A1** Let the in-flight refresh and provenance work (ideaboard step 1) land; do not start a parallel one.
1b. **A1b** Name the design grammar and rebuild the kit page from real components (L1), with the Fold primitive (cat) as its first new piece.
2. **A2** Gu kind page over `docs/coverage/gu_kinds.jsonl` in the game's UI kit, with a coverage bar and per-row blocker; reader ids added to the catalogue (R3, R5, R6). Superseded framing in R2: rows come from the ledgers, not reader digests.
3. **A3** LOTM potions page on the existing join, then HP brewing and the bench forms (F4).
4. **A4** Unlock-chain lens for one world (F3), then a receipts strip per card (F5). Watchcraft stays a play check for Weibao (R1).
5. **A5** Rename the ideaboard codes (F7) whenever the ideaboard is next committed.

Open: **Q1** whether this note should be folded into the ideaboard as a round once its author's work is committed; **Q2** any spend on the 29 pending world reads ($816.18 bound) stays Weibao's call.
