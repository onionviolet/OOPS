# Larger foundations and modularity, 2026-11-06

Weibao, 2026-11-06: "what about larger foundational and modularity that would be useful? from little stuff like random or not so random events, to like ammunition system and more? Balancing different things like classroom based playthroughs to mercenary to soldier to other stuff and more, and all can happen in the same world? Maybe we need a normal society seam to apply to all the worlds? Also on details for each world? specific gaps, such as LOTM missing other potions, how to digitalize combat and variety of abstract abilities and more?"

Follow-up to the [progress atlas](PROGRESS_ATLAS_2026-11-04.md#foundational-gaps-left-2026-11-06) (AT15-AT20). Snapshot master `48b6af6e8`, by grep of `src/` (importer counts, row tables) and owner docs; no runtime run, no code changed. Everything here is a proposal (AD32); nothing is accepted or dispatched. FD codes continue the atlas series.

## What the code shows

The project has more seams than consumers. Society-shaped modules exist and are wired to one world each, or none:

| Module | Importers | Who uses it |
|---|---|---|
| `law_case.js` | 0 | nobody |
| `ability_ladders.js` | 0 | nobody |
| `institution_access.js` | 1 | MoL |
| `life_events.js` | 1 | Village household |
| `institution_store.js` | 2 | LOTM, primordial |
| `storylet_deck.js` (weighted random cards) | 4 | Village only |
| `world_events.js` (dated happenings) | 7 | LOTM only |
| `faction_rank.js` | 5 | Qud-parity proposal content |
| `world_rhythm.js` | 27 | broad (the one real shared clock) |

No module models a *position*: being enrolled, enlisted, hired, contracted or apprenticed. Klein's civil-staff contract, his probationer track, the Village patrol career and Harry's school are each built by hand from pay, duties and acts. The [world core kit](../worlds/WORLD_CORE_KIT_2026-10-14.md) K1-K34 already lists what a world's normal society needs (K6 cast, K7 institutions, K8 daily life and economy, K20 language, K23 information flow, K24 law of the small, K26 routine), but as a design checklist, not a runtime declaration.

## Proposed foundations

### FD14 Society sheet: the "normal society seam"

A world declares its ordinary society once, as data: currency and price bands, a calendar and working week, institutions, the positions they offer, law of the small (fines, debt, petty crime), how news travels, forms of address, and a background population with jobs. Each line points at an existing owner (`world_rhythm`, `own_holdings`, `institution_store`, `law_case`, `people_knowledge`, `cast_schedule`, `world_events`). A missing line can draw from a palette ("Victorian industrial city", "boarding school", "frontier town", "sect"), each row labelled authored, palette or missing, so a new world starts with a working baseline and canon overrides it. (Round 2: renamed from "templates" because AD46 says no world is the template; lane A.)

Default: the sheet is a declaration and a coverage printout (K34), not a new simulation. Dial: worlds whose society is the point (Tingen, Hogwarts) fill it in depth; test beds keep the template. Reason: today every world rebuilds pay, jobs and law by hand, and a missing piece looks like the world lacks it.

### FD15 Positions: classroom, soldier, mercenary, clerk in one world

One position record: institution, role, rank, term type (enrolled, enlisted, hired, contracted, apprenticed, sworn, member), and what it gives and asks:

- duties and fixed slots through FD8 `recurring_duties`
- pay or fees through FD6 `purseEffect`
- lessons through FD11 `lesson.js`
- access and kit through `institution_access` and `institution_store`
- rank and standing through `faction_rank`
- discipline through `law_case` (round 2: `law_case` and `jurisdiction_rules` have no importers, so this needs wiring first)
- an exit with a cost: graduate, resign, desert, be expelled, contract ends

This is how "all can happen in the same world." A pupil, a soldier and a mercenary are the same record with different numbers on different institutions, so a world can host all three and a character can hold more than one at once. Klein is a clerk, a Nighthawk and a club member at the same time, and the FD8 slots settle the clashes. The balance between them comes from what each position actually pays, costs, risks and teaches in that world, not from a global tuning table (AD5, AD38). Activity abstraction (ACR1-ACR14) keeps repeated shifts and classes compact.

First consumers: Klein's civil-staff and probationer lives, which move onto the record with saves unchanged, and Harry's enrolment with the G5 calendar (AT16). A mercenary contract is the third shape, proving that terms with a fixed end and payment on completion work.

### FD16 Event director: random and not-so-random

One picker over three sources that already exist apart: dated canon events (`world_events`, LOTM), weighted storylet cards (`storylet_deck`, Village) and consequence events (debts due, ripples K29, rumours spreading, misses from FD8). Weights read state: place, position, notoriety, season, the tension rhythm (K32), who knows what (FD10). That gives the "not so random" part: a clerk hears office gossip, a soldier gets a posting, a famous boy gets stared at. Draws use `seeded_streams` so a save replays the same way.

Default: canon events stay pinned to dates, and storylets fill the quiet between them. Dial: density per world and per life.

### FD3+ Ready stock, extended

FD3 already counts carried and loaded rounds. The next layer is properties on the stock: exorcism or silver rounds, poisoned arrows, potion strength, wand condition. These are item properties that the contest reads, plus carried weight (FD13) when a window needs it. Same seam for talismans, spell charges and doses.

### FD17 Combat as one encounter frame with pluggable resolvers

Round 2 correction (lane C): the frame already exists. `conflict_frame.js` runs the road duel, party contest, sluice, tempo fights and `cast_ability_adapter`, and tempo already has light, footing, weather, surprise, allies, priced exits and hit location. Tempo is the scheduler; the per-exchange resolvers are `combat_math`, the notch contest (FD2) and dice (`check_contract`); authored ordered encounters are a separate route. FD17 means extending that frame, not adding one. Original wording follows. Making combat "digital" means sharing what sits around the resolvers rather than merging them. One encounter frame holds:

- the situation: range, cover, light, numbers, objective, ways out
- the resolver the world picks
- abilities and stock entering as modifiers or extra verbs
- outcomes going to `harm_state`
- non-lethal objectives, which `audit_remainder_combat_objectives_*` already sketches

It runs at three grains: quote and settle (skip), exchange summary, and turn by turn, with the player picking and ACR compressing repeats. First consumer: the AT15 native fight (Klein's revolver, FD3 plus FD2). Second: Harry's troll (W7) on a different resolver in the same frame.

### FD18 Effect channels for abstract abilities

Abstract powers (divination, the Clown's flash of someone's next move, Spirit Vision, luck, reading subtext, fate tampering, rewinds) are hard because they do not deal damage. They change *what is known*, *what is likely* or *when you act*. Proposal: a short list of channels that ability rows target, each owned by an existing seam:

| Channel | Owner seam | Example |
|---|---|---|
| Reveal a fact | `people_knowledge`, facts | divination answer, Spirit Vision |
| Shift odds | `check_contract`, notch contest | luck, a blessing |
| Act first or interrupt | encounter frame (FD17) | danger intuition, Clown prediction |
| Perceive the hidden | look/seenBy (ABR19) | spirit sight, detection charms |
| Read people | subtext (K31), FD10 | Spectator, Legilimency |
| Change an event | event director (FD16) | omens, fate pathways |
| Bend time or save | cheat domain (ABR16) | rewinds, Mother of Learning loops |

A new ability is then a row that names a channel, a cost and a drawback, and needs no new code. `effect_dsl.js` stays inert until a channel needs it (ABR4).

## Per-world gaps (checked)

| World | What source shows | Gap | Which foundation unlocks it |
|---|---|---|---|
| LOTM potions | Round 2 correction (lane D): five playable pathways, not four. Seer, Corpse Collector, Savant and Sailor run on `book_world_lotm_rows.js`; Visionary (Spectator, Telepathist) runs on a second factory in `book_world_lotm_generated.js`. `lotm_formula_rows.js` holds 43 canon formula rows over 12 of 22 pathways; `lotm_advancement.js` already seams the Seer ladder above Sequence 8 | 18 more pathways and the higher sequences. Lower rungs are content on a proven factory; higher rungs need new verbs (ABR18), so they need FD18 channels | FD18 for abilities; FD15 for the churches and orgs that hand out formulas |
| LOTM abilities | 12 player ability commands in `book_world_lotm_abilities.js` (round 2 correction; the earlier "about 35" counted every `id:` line) | Abstract powers (prediction, spirit sight variants, acting digestion depth) are hand-built | FD18 |
| LOTM combat | B8 below floor, no native fight (AT15) | Everything from the Tingen climax onward | FD17 + FD3 |
| HP | File counts mislead (round 2, lane D): HP code also lives in `world_packs/`, `hp_*` and the spell seam; a school timetable exists for the original 70-day life, not for Harry's lead life | Spells as data (the 100-row census, DWF165), classes, house points, timetable | FD15 enrolment, FD11, FD8, G5 calendar; FD18 for charms and Legilimency |
| MoL, paradise, primordial, Gu | 12, 15, 4 and 2 world files | Depth not inspected in this pass | Inspect before claiming gaps |

Round 2 (lane A): `feature_expansion_society` is multi-step consented Village apprenticeship and handoff work, not one-time meetings; its name clashes with FD14, which keeps its own name. World depth for MoL, paradise, primordial and Gu is now carded in lane D.

## Suggested order (proposal)

Superseded by the round 2 revised order below; kept as the first-round view.

1. **FD15 positions**, moving Klein's two lives and Harry's enrolment onto it. It composes FD6, FD8 and FD11, which already exist, and it answers the classroom/soldier/mercenary question directly.
2. **FD17 encounter frame**, with AT15's fight as its first consumer, since that fight already blocks both lead lives.
3. **FD16 event director**, lifting the Village deck and LOTM's dated events into one picker.
4. **FD18 channels**, when the Clown sequence or HP charms need them.
5. **FD14 society sheet**, written as the declaration that collects 1-4 per world, plus templates. It is cheap as a format at any point, and it only pays off once 1-3 exist.

LOTM's missing pathways are content work on the factory. They can run in parallel at any time for Sequence 9 rungs that use existing verbs.

## Round 2: reconciliation and depth, 2026-11-06

Weibao, 2026-11-06 (`/reconcile-project`): "based on this, we should consider each idea ... each in depth? to keep working/ideating backwards?" Four Sonnet lanes reconciled each idea against existing owners and then worked backward from concrete playable outcomes. Each lane wrote one file and keeps its own IDs (cited here as lane-ID, e.g. A-G1 is lane A's G1); the coordinator spot-checked key source claims (listed under Evidence). Everything stays a proposal (AD32).

| Lane | File | Covers |
|---|---|---|
| A | [LANE_A_SOCIETY_POSITIONS](larger-foundations-2026-11-06/LANE_A_SOCIETY_POSITIONS.md) | FD14, FD15; six outcomes; record shape, terms, exits, palettes; M1-M15 |
| B | [LANE_B_EVENTS](larger-foundations-2026-11-06/LANE_B_EVENTS.md) | FD16; nine emitters; three-layer split; F1-F4 and more-to-consider |
| C | [LANE_C_COMBAT_STOCK_ABILITIES](larger-foundations-2026-11-06/LANE_C_COMBAT_STOCK_ABILITIES.md) | FD3+, FD17, FD18; 21 reconciliation rows; N1-N16, L1-L9 |
| D | [LANE_D_WORLD_GAPS](larger-foundations-2026-11-06/LANE_D_WORLD_GAPS.md) | LOTM LG rows, HP HG rows, MoL, paradise, primordial, Gu cards |

### Ledger (one row per idea)

| ID | Idea | Existing owners found | Classification | Changed proposal | Deepest gap |
|---|---|---|---|---|---|
| FD14 | Society sheet | World core kit K6-K8, K20-K26; 13 world institutions docs hold most of each sheet as tables | Compatible variant (machine-readable form of a checklist) | Palettes, not templates (AD46); AD51 supports the shared seam | Nothing reads the kit at runtime |
| FD15 | Positions | `institution_access` (access), `purseEffect` (pay), FD8 duties, FD11 lessons, `institution_store` missions (contracts), BF29 and the membership guard (several at once); soldier doc has routes, pay, terms, exits | Incomplete integration | Start as a read-only projection over Klein's facts and the Village career so no save changes, then `positions@1` | A-G1 no position record (Klein's 5-year term is display text); A-G2 no in-institution rank; A-G3 discipline and contracts unwired, missions pay only contribution (`institution_store.js:23`) |
| FD16 | Event director | E2 row shape (partly built), E5 storyteller (unbuilt), K32 (duplicates E5), `COSMIC_EVENTS` omens, occurrence/discovery/response/aftermath split; nine emitters; `world_events` and `world_calendar` overlap | Compatible variants; K32 is a duplicate of E5 | Three layers: calendar events scheduled and never weighted; consequences triggered by state with no draw; weighted draw fills the quiet. Keeps E5 R10 (director never writes events) | B-F2 storylet deck locked to the Village (`storylet_deck.js:21,67,92,99`), needs schema 2; B-F3 replay stability unverified across clock chunking; B-F4 no consequence writer and no Tingen daily deck |
| FD3+ | Ammunition and stock | B8 already has silver rounds; Frontier schema 5 battles have carry/supply objectives | Partial duplicate | Add a `holder` so NPCs carry stock; spend inside the detached fight plan | C-N4/N7 `ready_stock` is player-only, `resolveShot` has no caller outside the firearm module |
| FD17 | Encounter frame | `conflict_frame.js` (5 importers), tempo conditions and exits, LOTM combat deep dive LCB1-LCB10, `PATHWAY_LEANS` in `book_world_lotm_bands.js` | Duplicate of built work, stated as new | Extend the frame and tempo; HP troll fits the authored-encounter route | C-N1 tempo move list is closed: split allowed from default so `shoot`, `reload`, `ability` can be granted per fighter |
| FD18 | Ability channels | ABR rules, the abilities `functions` vocabulary, HTP49, implementation map C3 term contracts (duels, mercenary terms) | Compatible variant | Channels project onto `functions`, not a new list | C-N3 abilities enter fights by two unjoined routes; the saved fight log can reveal concealed abilities |
| World | Per-world gaps | Potion-pathways IMPLEMENTATION_DESIGN 1.3, 2.3, 3.2 already plans other pathways as rows | Stale root doc, duplicate plan | Cite that design; only Sun 9-8 is data-only on the generated factory today | LOTM LG4 acting adherence and role laws (next advancement); HP HG1 lead-life calendar, HG2 houses and points, HG3 spell rows; MoL academy institution; paradise mission cycle; primordial sect and source range; Gu acquired Gu with a consumer |

### Defects shown in passing (not ideas)

| ID | Defect | Evidence | Consequence |
|---|---|---|---|
| RD1 | `DEATH_CAUSES` in `defeat_domain.js:12` lacks `loss_of_control`, which `HARM_DEATH_CAUSES` has | coordinator grep | A Beyonder losing control can die through harm but cannot be tallied by the defeat domain |
| RD2 | Tempo reads only `light === 'dark'` (`tempo_fight.js:67`, `tempo_exit.js:29`, `tempo_allies.js:26`); FD9 fog never reaches a fight | coordinator grep | Tingen night fog changes the status line but not a fight in it |

### Revised order (proposal)

1. **AT15 fight through the existing frame**: open the tempo move list (C-N1), give stock a holder (C-N4/N7), route fog into conditions (RD2). This closes the gap that blocks both lead lives, using built parts.
2. **FD15 positions as a projection** over Klein's lives and the Village career, then `positions@1` with term, rank and exit (A-G1, A-G2). It can run beside step 1 because it changes no save.
3. **HP lead-life calendar (HG1)**, then houses and points (HG2) as the first FD15 consumer outside LOTM.
4. **FD16 layers**: storylet deck schema 2 (B-F2) with a Tingen daily deck and a debt-due consequence writer (B-F4), after a replay sweep (B-F3).
5. **FD18 channels on `functions`**, with neutral observer text in fight logs (C-N3), when LOTM's acting adherence (LG4) needs them.
6. **FD14 sheet** as the declaration over 1-5, with palettes.

### Evidence

Coordinator checks on the current tree, 2026-11-06, master `48b6af6e8` plus other sessions' uncommitted edits: `storylet_deck.js` Village gates at lines 21, 67, 92 and 99; `law_case.js` has no importer; `institution_store.js:23` forces `reward: 'contribution'`; AD46 text in RULES_INDEX; `book_world_lotm_generated.js`, `lotm_advancement.js` and `lotm_formula_rows.js` exist and the generated file names Spectator and Telepathist; `book_world_lotm_abilities.js` exports 12 ability commands (node import); `conflict_frame.js` has five importers; `defeat_domain.js:12` and the three tempo `light` reads. Everything else is the lanes' reading, labelled shown, stated or inferred in each file. No tests, build or browser run.

Residue not mapped: `simulation.js` (E5 citations taken as stated), weather files, `return_digest.js`, LIFE_SIM_NORTH_STAR in full, the HP pack data (house points unverified), the LCB tests' pass state, and most paradise and MoL pack content.

### Open for Weibao

- Rename FD14 "templates" to palettes (AD46). The default is the rename, already applied as a proposal.
- RD1 and RD2 are small defects that could be fixed in the step 1 lane.

## Round 3: cross-world foundations, 2026-11-06

Weibao, 2026-11-06: "do we have comprehensive abstraction rules and more? what is foundational across all worlds that we should implement?" then "Can we address all of these? Deeper dive in in terms of little stuff long term? from little details to extend possibilitity in all worlds? like choosing to farm, or choosing to start a society, or mining? Or building? Or researching? or group or other functional abilities that should be sharred across all the worlds?"

Four Sonnet lanes reconciled each area against existing owners first, then worked backward from small outcomes. Each lane keeps its own IDs. Proposals only (AD32).

| Lane | File | Covers |
|---|---|---|
| E | [LANE_E_LIVELIHOODS](cross-world-foundations-2026-11-06/LANE_E_LIVELIHOODS.md) | Farming, herding, mining, gathering, building, crafting, storage, rights and dues; E-R1-R15, E-S1-S9, E-O1-O8, E-L1-L9 |
| F | [LANE_F_GROUPS](cross-world-foundations-2026-11-06/LANE_F_GROUPS.md) | Founding and running groups, delegation, collective acts; G1-G6, F1-F15 |
| G | [LANE_G_RESEARCH_SKILLS](cross-world-foundations-2026-11-06/LANE_G_RESEARCH_SKILLS.md) | Study, inquiry, notes and texts, shared non-combat skills; 9 skill channels |
| H | [LANE_H_HOSTS_REGISTER](cross-world-foundations-2026-11-06/LANE_H_HOSTS_REGISTER.md) | World-gated hosts, seam adoption register, AR17 draft |

### Answer to "do we have comprehensive abstraction rules?"

The rules on *when* to abstract are thorough: AD51 (shared seam when two or more worlds plausibly share a mechanism; split a seam that flattens real differences), AR11 (a second, different world proves a seam), AR12 (the shared floor widens), AD46 (each world picks its own version), ACR1-ACR14 (compress repeated play), ABR (abilities). Lane E found one stale older line ("share only after two real consumers") that AD51 supersedes by date; it still limits build order, not seam design. Two pieces are missing: nothing records adoption (lane H's register), and no rule requires hosts to be world-neutral (lane H's AR17 draft). Both are proposals below.

### Ledger (one row per area)

| Area | What exists | Classification | Deepest gaps | Proposed seam |
|---|---|---|---|---|
| Hosts (lane H) | 12 shared domains take the Frontier-only `harvestWritable` port (`main.js`); 5 of them are world-neutral by purpose (tempo fight, banked time, return digest, journal, pledges); five siblings already pass the neutral `tradeWritable`; no pattern embeds a shared panel in a world panel | Incomplete integration | Tempo is a one-line port fix (coordinator confirmed `tradeWritable` checks save, ledger and life, not world); panels have no home in LOTM or HP views | AR17 world-neutral hosts plus a shared-panel slot in world panels |
| Seam register (lane H) | 37 seams scanned: 6 with no world consumer, 16 one world, 15 two or more; none proven by a second world's player route; only `ready_stock` has a native receipt | Missing tracker | AR11 cannot be checked; stale counts (`ability_ladders` now 2 UI importers) | `docs/SEAM_REGISTER.md` printed by `scripts/seam_register.mjs` under `check:rules` |
| Livelihoods (lane E) | SSD10, SSD70-SSD82 already own most of the seam set; plot, seedbed, frost plot, sheep, home building, workshop and spoilage modules are all Frontier/Village; four crop lifecycles share one shape; `home_building_model.js` does not use `site_projects.js` | Prior art, incomplete integration | E-G1 no second world; E-G2 rights and dues nowhere (`plotRight` is a one-off fact); E-G3 two build paths, no shop or buyer channel | One stage record for crops/stock, a site record, one build-project path, rights and dues through FD8 duties and FD6 purse |
| Groups (lane F) | No founding verb anywhere; 15 one-world fragments (`gatherings` 1 importer, `party_battle` 6 around one hard-coded helper, Village-only delegation, `law_case` 0, `companion_roster` 0); `33_INSTITUTIONS_AND_COMMUNITIES.md` and `ORGANIZATIONS.md` name the missing record | Incomplete integration | G1 no group record or founding verb; G2 no shared treasury, premises or keys; G3 three disjoint delegation prototypes; G4 law unwired | `organizations@1` paired with `positions@1` (a member's side is a position), three-rung delegation ladder, shared role-slot frame with local effects |
| Research and skills (lane G) | Knowledge-making exists five times with no shared name (Frontier study rows, lessons, LOTM inference and divination, claims runtime, craft trial log, MoL accounts); 65 native skills cover Perception, Literacy, Medicine, Haggling | Compatible variants | No book life in Study; notes and texts are not objects; no persuade, deceive, read people, stealth, language or wayfinding anywhere | `inquiry@1` (question, method, sources, effort, partial result, risk, output) writing to the existing knowledge store; a `channel` tag on skill and ability rows (9 channels) instead of new native skills |

Coordinator spot checks, current tree: `law_case`, `companion_roster`, `ability_skill_rows` 0 importers; `gatherings` 1; `party_battle` 6; `organization_view` 1 (`src/management/ui.js`); `home_building_model.js` has no `site_projects` import; `native_tool_domains.js:44` passes raw `operations` to tempo while lines 47, 48, 51, 59 pass `tradeWritable||writable`; `tradeWritable` in `main.js` checks the work ledger, restore, storage and life only. Not checked by the coordinator: lane G's `craft_failure_ledger` "not wired" header claim (it has 1 importer).

### How the areas fit

They share one spine. A world's society sheet (FD14) declares institutions; positions (FD15) and founded groups (lane F) are the player's and NPCs' place in them; livelihoods (lane E), research (lane G) and fights (FD17) are what a position or a free person does with time; duties (FD8), purse (FD6), stock (FD3) and the clock carry the costs; knowledge (FD10) and events (FD16) carry the consequences; world-neutral hosts (AR17) let every world show it. Skill channels (lane G) and ability channels (FD18) are the same idea for non-combat and combat verbs and should share one vocabulary.

### Proposed AR17 (draft, lane H)

A shared host port answers only about the engine and the save (can this write, is the character alive, is another activity running), never which world the player is in; any world or place restriction lives in the domain or data row that owns it, and a world panel offers a slot where shared panels render. Mistake it prevents: a world-neutral engine behind a one-world host (T1, T2).

### Implementation order (proposal)

| Slice | What | Closes | Why here |
|---|---|---|---|
| 1 | AR17 host fix: tempo takes `tradeWritable`; the other four world-neutral domains follow; a shared-panel slot in the LOTM view, first filled by the open fight | T1, T2, AT15 native walk | Every later seam is invisible outside Frontier without it |
| 2 | Seam register script and doc | Lane H register | Makes AR11 checkable before more seams land |
| 3 | `positions@1` as a projection, then `organizations@1` with a founding verb | Lane A G1-G2, lane F G1-G2 | Pupil, soldier, mercenary, club founder in one record family |
| 4 | Harry's lead-life calendar and houses as the first non-LOTM position and duties consumer | HG1, HG2, AT16 | Second world proves 3 and FD8 |
| 5 | `inquiry@1` with notes as objects; first consumers Klein's library and Harry's study | Lane G gaps 1-2 | Research in book lives |
| 6 | Livelihood stage record and rights and dues, second world first (Tingen kitchen garden or Hogwarts greenhouse) | E-G1, E-G2 | Moves production off Frontier-only |
| 7 | Skill and ability channels, one vocabulary | Lane G gap 3, FD18 | Social, stealth, language verbs everywhere |
| 8 | FD16 event layers, FD14 society sheet | Lane B, FD14 | Collects the rest per world |

Each slice lands at the AD43 floor or is recorded below it. Nothing here is dispatched.

## Coverage against the U01-U15 map (2026-11-06)

Weibao, 2026-11-06: "did we account for everything and take everything that we could have?" Rounds 2 and 3 reconciled each idea against the world core kit (K codes), institution docs and `src/`, but never against the [U01-U15 map](../SHARED_FOUNDATIONS_AUDIT_2026-10-12.md) scored in the [core foundations scorecard](../CORE_FOUNDATIONS_SCORECARD_2026-10-14.md); only U09 is cited anywhere in these docs. This block closes that. Proposal only (AD32); no priority changes, nothing dispatched.

**Evidence level.** Scorecard rows are from 2026-10-14. "Now" is a grep of `src/` at master `52d40f7f9` on a dirty shared tree (importer counts, `git merge-base`), no runtime run. Rows marked *unrechecked* keep the 10-14 status. NX1-NX15 in the core kit are merge and process notes, not foundations, so they are not part of this ledger.

| U | Foundation | Scorecard 10-14 | Now | Relation to FD14-FD18 and rounds 2-3 | Class |
|---|---|---|---|---|---|
| U01 | Person, body, controller | partial | unrechecked | Positions for NPCs and possession-style contracts assume control transfer; owned by the nonhuman-starts lane | Depended on, owned elsewhere |
| U02 | Anatomy, needs, senses | thin | unrechecked | FD3+ stock properties and FD17 wounds read body parts; not required for slice 1-4 | Depended on, owned elsewhere |
| U03 | Coherent beginnings | solid, narrow | unrechecked | Positions add a start-time seat (enrolled, enlisted); WER owns starts | Out of scope here |
| U04 | Randomness | partial, fix unmerged | `proc/p1-streams` is an ancestor of master; `seeded_streams` has 26 importers; 30 `Math.random` calls remain in 7 `src/` paths (`display.js`, `misc.js`, `main.js`, `particles.js`, `absorb_p23/`); which are gameplay vs cosmetic is **not checked** | FD16 draws weighted cards: it must use seeded streams, never `Math.random` | **Dependency, now mostly met. Add to FD16: draw only through `seeded_streams`; check the remaining 30 calls** |
| U05 | Time and scheduling | partial | `away_ledger` has 1 importer; offline catch-up still not a shared seam | FD8 duties and FD16 consequences (debts due, rumours) need a rule for time skipped while away; core kit NX7 and NX14 already flag the frozen-absence policy | **Gap: add to FD16 and FD15 (term end while away)** |
| U06 | Knowledge and perception | partial | `knowledge_view` 2 importers, `world_events_knowledge` exists; predicates reading true state **not rechecked** | Lane C found the saved fight log can reveal concealed abilities; FD16 emitters must say who knows an event | **Gap: add the M12 belief fence to FD16 and FD18** |
| U07 | Learning and capability | partial, fragmented | unrechecked | Lane G (research and skills) and FD18 channels | Covered (lane G, FD18) |
| U08 | Relationships and standing | thin | `relationship_web_view` merged and used by 3 files; `relationship_view` (A4) has 0 importers; `person_standing`, `peer_standing`, `economy_standing` exist | FD15 rank and standing read these; FD16 consequence events write them | **Dependency, partly met. Add to FD15: name which standing store a position reads** |
| U09 | Ownership and economy | partial | unrechecked | FD6 purse, pay and fees; cited in rounds 2-3 | Covered |
| U10 | NPC agency | solid (engine) | unrechecked | Hired, enlisted and contracted NPCs act through controllers; lane F groups | Covered in lane F, positions for NPCs not yet specified |
| U11 | Actions and consequences | partial | not rechecked | Three action pipelines is the thing AR17 and the host fix address | Covered (AR17 draft) |
| U12 | Travel and carriers | partial | Realm travel tests merged (A3) | Mercenary contracts away from home; deployment of a soldier | Out of scope, tests exist |
| U13 | Loss and continuation | partial | unrechecked | FD15 exits include desert, expelled, killed in service; death and heir flow are U13 | **Gap: add exit-by-death to FD15** |
| U14 | Durable state | solid, fragmented | unrechecked | `positions@1`, `organizations@1` and `inquiry@1` are new save slices; AR9 migration rule applies | Covered by slice plan, name migration per slice |
| U15 | Presentation | thin | `panel_kit` now in 58 files | Slice 1 shared-panel slot; each position and event surface needs a view | Mostly met by slice 1 |

**What changes in the proposals.** F1: FD16 gains a rule to draw only through `seeded_streams`, an away-time rule (U05) and a who-knows field (U06). F2: FD15 names the standing store it reads (U08) and adds death and away-time term ends (U13, U05). F3: FD18 and FD16 share one belief fence. F4: the 30 remaining `Math.random` calls need a one-pass classification (gameplay or cosmetic) before FD16 slice 8; that is a small check, not a lane.

**Still unreconciled.** The [gap audit](GAP_AUDIT_2026-10-30.md) (646 vision rows), the [cross-world detail pass](CROSS_WORLD_DETAIL_PASS_2026-11-03.md) and the outside-game comparison (Mount & Blade, Rimworld, Wildermyth, Crusader Kings, Princess Maker for FD15) have not been matched to FD14-FD18. Rows marked *unrechecked* above need a fresh source read before anyone relies on them.

## Round 4: depth without micromanagement (obligations, heat, ownership, economy), 2026-11-06

Weibao, 2026-11-06: "COnsider if like liveliehoods and rights and dues would be too complex for an 'idle' rpg game? more layers to worry about or would it add to it? Or would it add depth, allowying ownership and stuff and more? we can make it really interesting, consider stuff like reputation and wanted levels? like not paying tax and whatever results in stuff like tax colelctors and more? also random events based on these and more? but then if it requires too much micro management it might be something to worry about? Also economy and more?"

Relevant owners: USER_VISION "7. Balance between active play and idling" (open since 2026-10-07; this round is input, not a decision), AD33 (complexity welcome, slices sequence it), AD52 and ACR1-ACR14 (compress repeated play, keep decisions), economy rules ECR in DOMAIN_RULES (local economies, arbitrage intended, per-place price curves), AD22 (limits are per-world adjectives). Existing code: `jurisdiction_rules.js` (1 importer), `law_case.js` (0), `reputation.js` and `faction_rank.js` (Village regions), `pursuit.js`, the owed ledger, FD8 duties, the Frontier-gated return digest (lane H).

### View

Obligations add depth to an idle game when they are standing arrangements the player sets once and consequences that arrive as people and events. They become micromanagement when they are bills the player must click. The difference is the shape, not the amount of simulation underneath. Idle games already prove the pattern: the interesting decision is the policy (how much risk, which costs to skip), and the payoff is coming back to a world that moved.

### Principles (proposals)

| ID | Default | Dial and reason |
|---|---|---|
| OB1 | **The choice is a policy, not a payment.** Each obligation (rent, tax, tithe, guild dues, protection money) has a standing order: pay on time, pay late, pay part, dispute, hide income, bribe, evade. Set once; it runs while away (ACR1, FD8 duties, FD6 purse) | Per obligation; a world can offer only some policies (no bribing an incorruptible office) |
| OB2 | **Consequences escalate through people, legibly.** Miss, then a notice, then a collector visit, then fine or seizure, then a bounty or warrant. Each step is a state-triggered consequence event (FD16 layer 2, no random draw) with a stated grace window | Grace and steps per jurisdiction; a lenient landlady and a strict state differ in-world (AD5) |
| OB3 | **Heat is local and known.** Notoriety or wanted level is per jurisdiction and per group, decays, and rises only from acts someone knows about (FD10, ABR19). An unseen evasion carries no heat until an audit or informer finds it | Decay speed, informer density and audit rate per world; Tingen's police and a cultivation sect read heat differently (AD46) |
| OB4 | **Idle never springs an unpreventable loss.** While away, standing orders settle; anything that needs a choice (a collector at the door, a raid) waits for the player or resolves by the policy they set, and the return digest says what happened and why | Hardcore dial per life for players who want away-time risk; default off |
| OB5 | **Ownership pays only if it compounds.** Owned land, a shop or a workshop produces income, access or standing while away, appreciates or decays, and can be lost through the same obligation chain. Owning without upkeep or risk is a number, not depth | Upkeep and yield per world and per asset |
| OB6 | **Detail is a view, not a duty.** One ledger at three grains: a weekly line ("Rent and dues paid, 3 soli 4 pence"), exceptions only, full ledger. Default: weekly line plus exceptions (ACR3, ACR5) | Per player and per world; a world without taxes shows nothing |
| OB7 | **Delegation is the late-game answer.** A steward, spouse, accountant or guild clerk runs obligations by the player's policy and reports in character, with their own honesty and skill (lane F delegation ladder, lane A positions) | Their competence and loyalty are people, not settings |

### What it unlocks (from small to large)

- Small: a landlady who forgives one late week and remembers it; a tax notice that names the clerk; a collector who can be talked down, paid off or avoided by being out.
- Middle: hiding income from a side job (Klein's divination fees are a natural case) raises audit risk, not a bill; a guild fines you for undercutting; a sect demands contribution and lets you buy exemption with service.
- Large: owning a property chain, running a fence for hot goods, a wanted level that changes which streets are safe, bounty hunters as encounters (FD17), a district riot when taxes rise (FD16 dated event plus a price shift).
- Events: obligations are prime material for the consequence layer, so the event director gets a steady supply of plausible, personal happenings without random noise.

### Economy (proposal, within ECR)

Keep the economy local per world and per place (ECR1, AD27); do not build a macro simulation. Add four flows that the obligations need: dues and taxes as money sinks with a named recipient; prices that respond to dated events and tax changes (ECR3 curves already allow it); credit and debt through the owed ledger (AT10), so a loan, a mortgage and a protection debt share one view; and grey channels (a fence, a black market, a smuggler) whose prices read heat. NPCs pay the same dues through the same records (AD6), which is what makes a collector believable.

### Risks and how the design meets them

| Risk | Answer |
|---|---|
| Micromanagement | OB1 standing orders, OB6 summary grain, OB7 delegation |
| Punishing idle play | OB4 waits and the return digest |
| Spreadsheet feel | OB2 people and scenes, not line items; numbers stay in the full-ledger grain |
| Implementation cost | Rides on seams already queued: FD8 duties, FD6 purse, FD16 consequence layer, FD10 knowledge, positions and groups. New pieces are a policy field on duties, a heat ladder per jurisdiction and the escalation chain |
| Worlds where it does not fit | AD46: a world declares no obligations, or only social ones (a sect's contribution, a school's house points) |

### First slice (proposal)

One rent obligation in Tingen with a standing order and three policies (on time, late, skip), a two-step escalation (notice, then the landlady's visit), heat in one jurisdiction from one hidden-income act, the weekly ledger line, and an away-time run that shows OB4. It needs AR17 host work and the FD16 consequence layer, so it sits after slice 1 and with slice 8 in the round 3 order, or earlier if Weibao moves it.

### Round 4b: where obligations apply, fighting authority, automated income (2026-11-06)

Weibao, 2026-11-06: "Automating making money and more? If I am strong enough I can choose to fight the 'governemnt' or whatver? also rent and more only for locations where that makes sense? if I chosee to manually craft a domicile in an uninhavitaed place or something,, I am not known so I wont need to pay tax, or there is no authority for those kind of stuff?"

Applies AD38 (things work by how they work), AD5 (pushback needs an in-world agent with a reason), AD46, ACR1-ACR14. Proposals.

| ID | Default | Dial and reason |
|---|---|---|
| OB8 | **An obligation needs an authority with a claim, knowledge and reach.** Rent exists where someone owns the room; tax where a state claims the land, knows you are there and can send someone. A cabin you build in empty land owes nothing, because no one claims it, knows of it or can reach it. The price is the other side of the same mechanism: no protection, no market, no credit, no help when hurt | Per place through `jurisdiction_rules.js` and the society sheet (FD14); some worlds' authorities reach far (a sect's spiritual sense, a church's divination), others stop at the city wall |
| OB9 | **Being unknown is a state you hold, not a loophole.** Anonymity lowers dues and heat and also blocks contracts, positions, loans and a good name. It erodes through your own acts (selling at a market, a rumour, a traveller who saw smoke) and through events (a surveyor, a lord's expansion, hunters, refugees) | Discovery rate per place and per act (FD10, FD16 consequence layer); a hermit life can stay unknown for years by choice |
| OB10 | **Authority's reach is people, so strength can refuse it.** Collectors and officers are real fighters with real bands (FD17). If you beat them, the next step is the authority's own choice: more and stronger enforcers, a bounty, specialists (a Beyonder squad, a sect elder), negotiation, an exemption, recruitment, or leaving you alone because you cost too much. Winning has costs: markets and allies close, you become a target, and people treat you as a power | Escalation ceiling and willingness per authority and world; canon strength (LOTM's churches, a cultivation empire) makes open war ruinous until very high tiers, by in-world agents, not a cap |
| OB11 | **You can become the authority.** A founded group (lane F) that claims land, protects people and collects dues runs the same records from the other side: your own collectors, your own defaulters, your own heat with the old authority | Recognition by neighbours and the old authority per world |
| OB12 | **Income automates through the same means as everything else.** Wages (positions), rent you collect, workshop and farm output, standing orders that sell surplus, hired hands and stewards (delegation), loans and shares. All run while away as ACR plans and settle on the clock; yield reads real inputs (workers, tools, stock, market saturation via `market_saturation.js`, ECR3 price curves), so growth slows through markets and limits of people, not a fixed cap | Per world and per asset; the return digest reports income and why it changed |

What this adds to the event layer: a found cabin, a tax surveyor's first visit, a bounty notice with your description, a deputation offering terms. All are state-triggered consequences, so they come from what you did, not noise.

## Reconciliation, 2026-11-06

Weibao: "accordingly based on these" (`/reconcile-project`), covering rounds 1-4b. Source revision: master after `e8711b07c`. Each row is one discrepancy; claims reach only the evidence row named.

| ID | Claim and locator | Classification | Owner and consumer | Evidence | Disposition |
|---|---|---|---|---|---|
| RC1 | Weibao's words for this session were in chat only | Missing record | USER_VISION | Read | Added [section](../USER_VISION.md#cross-world-foundations-obligations-and-authority-2026-11-06) with his words verbatim, an agent reading, and what is accepted (AT15 step 1 only); VISION_DIGEST gained one line marked as asked, designs proposed |
| RC2 | Open question "7. Balance between active play and idling" had no input since 2026-10-07 | Stale | USER_VISION | Read | Pointer to round 4 as input, not an answer |
| RC3 | No rule that hosts are world-neutral | Missing rule | ARCHITECTURE_RULES, RULES_INDEX | Lane H, coordinator check of `native_tool_domains.js:44` and `tradeWritable` | AR17 added as a **proposed** row; register reads AR1–AR17 with AR17 proposed. Not standing until Weibao accepts |
| RC4 | No router row for the cross-world foundations palette | Missing integration | RULES_INDEX | Read | Router row added; FD, OB and lane IDs stated as palette proposals, not rules |
| RC5 | B8 backlog row said "no `resolveShot` consumer yet" | Stale | MECHANISM_BACKLOG | Commit `8788923e5` | Row updated: first consumer is the tempo shoot move, below floor (T1, T2); B8 runner stale (T3) |
| RC6 | AT15 receipt header used free text where `check_receipts` expects its vocabulary | Evidence correction | AT15 CHECKPOINT | `npm run check:rules` failed, now passes | Fields set to allowed values; qualifiers moved to receipt notes (state "built" read as below floor; persistence is the fixture reload only) |
| RC7 | Lane E E-R6 called "share only after two real consumers" (modular palette, SR23) a disagreement with AD51 | Compatible variant (lane classification corrected) | MODULAR_PRODUCTION_CHAINS palette, SR23, AD51 | Read SR23 and the palette line | AD51 governs design, SR23 and the palette line govern extraction and build. Pointer added to the palette |
| RC8 | Round 1 table said `ability_ladders.js` has 0 importers | Stale | This doc | Lane H scan: 2 UI gallery importers | Corrected here; no gameplay consumer either way |
| RC9 | Round 1 said LOTM has four pathways and about 35 ability rows | Stale | This doc | Corrected in round 2 (five pathways, 12 player ability commands) | Already corrected in place |
| RC10 | `lesson.js` header says HP classes are not built, but hand-written `lesson_charms` commands exist in `world_packs/book_hp_life_data.js` (lane G) | Stale source comment | `src/lesson.js` | Grep: 3 `lesson_charms` hits | Not edited (runtime file; comment only). Carry to the next slice that touches `lesson.js` |
| RC11 | ABILITY_RULES per-world table counts (Oct 25) differ from today's | Compatible (dated snapshot, labelled as such) | ABILITY_RULES | Read | No edit |
| RC12 | K32 tension rhythm duplicates E5 storyteller pacing (lane B) | Duplicate | World core kit, E5 | Lane B reading | No edit; FD16 cites E5 as the owner |
| RC13 | PROJECT.md current focus | No change | PROJECT.md | Read | Unchanged: these are proposals and step 1 sits inside the existing LOTM-first focus |

Unmapped residue: IDEA_INDEX current queue routing has no entry for the round 3 implementation order (proposals are not queued until Weibao selects a slice); the lane files' own more-to-consider items are kept in their lanes and not individually reconciled; lane G's `craft_failure_ledger` "not wired" header claim is unchecked; the five lane H open questions (`cultivation_intents`, `gear_workshop`, `field_layer`, `lamplight`, `tools` world scope) remain open.

Checks: `npm run check:rules` pass (rules index, receipts, direction sync). No runtime change in this reconciliation.

## Reconciliation of the remaining sources (2026-11-06)

Weibao, 2026-11-06 (`/reconcile-project`): "so what are we missing?" Four read-only Sonnet lanes matched FD14-FD18, the lane files and the U01-U15 block against the [gap audit](GAP_AUDIT_2026-10-30.md), the [cross-world detail pass](CROSS_WORLD_DETAIL_PASS_2026-11-03.md), the unrechecked U rows and outside-game prior art. The coordinator then re-grepped the claims below against `src/` at master `b9d020380` (dirty shared tree, no runtime run, no tests). Proposals only (AD32); nothing accepted or dispatched.

**Inspected.** Both audits' ranked rows and the two docs here, in full, by one lane each. **Not inspected.** The nine files in `gap-audit-2026-10-30/` (coverage detail, including the 115 unbuilt research packets and 22 unrecorded asks), the 576 cells of the detail-pass matrix, and the eight lane files beyond keyword matches. Lane classifications (a: owned by an FD or lane, b: other owner doc, d: content only) are inferred from keywords; about 10 detail-pass SD rows could move between classes. Gap audit: about 7 a, 12 b, 4 c, 8 d. Detail pass (96 items): 39 a, 14 b, 15 c (about 5 distinct), 28 d.

### Gaps still without an owner (class c, after the spot check)

| ID | Claim | Source locator | Spot check | Nearest FD | Distinguishing check |
|---|---|---|---|---|---|
| M1 | One identity rule for batch, portion and label (potion doses, pills, rations, ammunition) | detail pass J5, R4, H6 (CW09/14/16) | Lane C lists doses as `ready_stock` without batch identity; not grepped | FD3+ | Does a stock row carry a batch or label field? |
| M2 | Care and recovery access record: who provides it, rank or price gate, duration, what it does not restore | detail pass J8, H14 | Appears in 5+ worlds per the pass; lane G has a "Heal" verb and no record behind it | FD15, FD6 | Grep for any care-access record |
| M3 | Interrupted-operation record: stop point, partial effect, what is kept, who is told | detail pass J9, H15 (CW14) | Lane F covers delegate reporting and no stop record | FD8, FD17 | Same |
| M4 | Copies, portraits and remote agents | detail pass R8 (CW26) | No covered cell in 16 worlds | FD18, lane F | Same |
| M5 | ~~A player checkpoint store~~ **Corrected (residue lane, read):** the store exists. `src/continuation_state.js` keeps `initial` plus one replaceable `checkpoint` (lines 96, 168-171, 198-199); `src/absorb_p23/save_time_options/backup_undo.js` adds a swap fallback; tests exist. `anchor_snapshots.js` is a different module (world timeline replay), still 0 `src/` importers | gap audit G15 tail, detail pass H2 | Gap narrowed to: rewind is limited (default for now; dial: widen when another world has a consumer) to Frontier and starts with a loop row (`continuation_state.js:39-44`) | FD18, U14 | Extend rewind to another world when it has a consumer |
| M6 | Loop kinds: chosen, real entrapment, duplicate processing | gap audit G5 part | Not checked; `bk-mol` may cover it | FD16 (U05) | Read `bk-mol` for the distinction |

### Built as one-world slices (incomplete integration, not unowned)

| ID | Claim in the audit | Now | Disposition |
|---|---|---|---|
| G1 | Canon pull has no seam | `src/canon_pull.js`, `canon_pull_host.js`, `canon_pull_panel.js` (1 importer), LOTM cast host | Generalize the pull dial into the FD16 pinned-calendar layer; check the resolver actually reads it |
| G3 | Persistent rival with hidden power: nothing in `src/` | `src/rival_memory.js` (2 importers): Mara, "H7 first slice", margin and grudge dials | Name a rival record shape for FD15/FD17 beyond the one road rival |
| G6 | Hit location: nothing in `src/` | `src/tempo_location.js` | Stale gap-audit wording; no action beyond correcting it |

### Stale documentation found

| Where | Said | Now (importers in `src/`) |
|---|---|---|
| Module table, Foundations doc | `world_events` 7, `ability_ladders` 0 | 13 and 2 (Round 3 already says 2) |
| Detail pass | `away_ledger` unused; `harm_loops` tests alone | 1 and 4 |
| Detail pass | `canon_pull_panel` unused | 1 |

Still true: `law_case`, `anchor_snapshots`, `invention_receipts`, `lotm_price_map` have 0 `src/` importers (tests only). H11 generators exist but have no FLR1/2/6 receipts (missing proof).

### Source recheck of the U rows (read, no tests run)

| U | Now |
|---|---|
| U01, U02, U07, U11, U14 | Unchanged since 10-14: no control transfer, no body parts or senses, `techniques` the de facto capability center, world IDs still hardcoded at `simulation.js:256`, per-feature schema bumps with no general migration chain |
| U03 | Start still gated by `?foundation_probe=1` (`main.js:399`); `structured_pack_runtime` wider |
| U04 | About 28 `Math.random` calls, all cosmetic or flavor text; gameplay draws go through `gameRandom`. The duplicated xorshift remains in 16 files. Closes the FD16 randomness dependency; `misc.js:73` `random_range` default still falls through to `Math.random` |
| U06 | Player view is a pure projection of the seat's own knowledge; whether other-actor predicates read it is untraced |
| U09 | Custody spread; money still a legacy scalar |
| U10 | Not read (needs and goals unchecked) |
| U13 | Heir flow reachable once a life ends; rebirth reached by tests alone; combat death is unconsciousness plus a defeat count |

### Outside-game prior art for FD14-FD16 (proposals, mostly secondary sources)

Round 4 and 4b (OB1-OB12: obligations, heat, claim, reach) and RC1-RC13 above were written by another session in parallel. Loyalty drift, tiered asks and strain overlap the OB family: fold them into the OB rows (and FD15 asks) before giving them new codes.

Best three, in order: loyalty drift on a position with thresholds that fire FD16 events (CK3); host demands scaled by rank with a cap (Dwarf Fortress); strain as a forced exit (Princess Maker 2). Smaller: tiered asks raised one step at a time with a renegotiation budget; term length with a renewal event (Mount & Blade, figures unverified); re-check an event trigger at delivery; severity scaled by standing; arrival damping as a roster fills; a build-time reachability check for calendar-gated content (Persona 4); pair tags on cards (Wildermyth). Sources are mostly fan wikis or search snippets; Kenshi and Football Manager were not searched. Each is a default with a dial and a reason, not a requirement.

### NPC agency (D, proposal)

Pseudo agency now, real needs and goals later, through the same command and controller path so a later layer is another controller. Reason: authored worlds need the right person in the right place; cost: real goals multiply the causes every NPC action must justify. U10 needs and goals are unread, so this rests on the 10-14 scorecard.

### Proposed edits to existing proposals

FD3+: add M1. FD15: M2, tiered asks, loyalty drift, strain exit, term length and renewal. FD16: M6, trigger recheck at delivery, canon-pull dial. FD17: rival record shape. FD18: M4, M5. Cross-cutting: correct the stale counts above in the module table and note the Mara and canon-pull slices as first consumers.

### Residue closure (coordinator, 2026-11-06, read-only lanes, tree at `b9d020380`)

- **M1 is built for one world:** `src/hp_brewing_state.js:38,68` has batches with id, doses, grade and history; `hp_preparation.js:31` has `lotId`; `ready_stock.js` counts by kind alone. Gap: a shared batch/label shape, first consumer Klein's Seer dose allocation (`book_world_lotm_actions.js:45-47`). **M2 missing** (just the Village fever storylet, `storylet_content.js:52-54`). **M3 partial** in three one-off forms (`wait_until.js:22-33`, `agreed_duty_continuation.js:20-68`, `everyday_life.js:52-66`). **M4 missing, no reachable consumer.**
- **M6 partly covered:** `harm_loops.js:6-27` has `cycle`, `restart:initial`, `restart:checkpoint` and triggers; no `cause` (chosen, imposed, entrapped) and no per-attempt re-processing check. Owner `harm_loops.js` with `continuation_state.js`.
- **U10:** pseudo agency through the command path is already how controllers work (`simulation.js:690-720`, `previewCommand` then `startCommand`); `npc_lives.js` is a scripted yearly register, not an agent layer. Missing: a schedule fact a controller guard can read. Host-file direct-edit scan was not exhaustive (inferred).
- **U06:** predicates about another actor read raw target state (`simulation_effects.js:131-232`; `meets` callers at `simulation.js:118,163,704`); just `person.<id>.*` is observer-filtered. Missing: a `knownTargetFacts` adapter that appraisal and price rules require.
- **Unowned foundation-shaped rows from the nine coverage files (O1-O13; about 330 rows scanned, filtered not read line by line; 5 stale rows):** O1 travel budget and logistics; O2 entry permission record; O3 directed group-to-group stance; O4 gifts versus conditional services from a group; O5 paid information becoming a saved lead; O6 concealed capability on any actor with appraisal gate (generalizes `rival_memory.js`); O7 starting hostility with reputation cost; O8 bluff and false signal; O9 transfer of non-item holdings (identity, luck, titles); O10 reset-and-carry contract with a predicate; O11 failure path per system; O12 terminating chains and a tie rule (partial FD16); O13 named capacity gauges (partial FD18). Locators are in the coverage files (research_cov, uv_cov_1-5, coord_cov); not individually verified. Stale in the audit: Nemesis (`rival_memory.js`), hit location (`tempo_location.js`), canon pull per fact (`canon_pull*.js`), anchor snapshots.
- **Not done:** the 576-cell detail-pass matrix (all content by nature), line-by-line read of uv_cov_1-5.


## Delivery reconciliation, 2026-11-06 (after waves 1-10)

Weibao asked "did everything get done?". Input: master at `498a7b10b`, final gate build `01eab058...`, `npm test` 5470/5471 with the one failure fixed (see the [run record](../gm/dispatch/cross-world-run-2026-11-06/CHECKPOINT.md#full-blast-waves-6-10-receipt-2026-11-06)). Evidence rows follow the reconcile table: **source** (read at producer and consumer), **tests** (focused run on the current tree), **walk** (a native or fixture journey on a built bundle). None is human-reviewed. Answer: every slice has a first working version; the native walks and a long palette tail are not done.

### Implementation order

| Slice | Delivered | Evidence reached | Left |
|---|---|---|---|
| 1 AR17 hosts | Tempo, away bank, return digest and journal take the neutral write port; LOTM encounter slot | walk (AT15 runner, reload and Export/Import) | Pledges still on the Frontier port (blocked split); AR17 text stays proposed until Weibao accepts it |
| 2 Seam register | `scripts/seam_register.mjs`, `docs/SEAM_REGISTER.md` | tests, `--check` current | none |
| 3 Positions and groups | `positions@1` term and resign; projections in LOTM (clerk, probationer, guard) and HP (pupil, house); `organizations@1` founding, invite, dues, treasury, feast, lookout | walk for the clerk positions line (wave 2); tests for the rest | Founding, dues, resign and guard not walked; other exit kinds named but not playable; NPC founding (AT17); `law_case` wiring (lane F G4); splits |
| 4 HP calendar and houses | Countdown, train on 1 September, Sorting, pupil and house lines, class slot, Charms and Potions lessons | walk for the countdown (wave 2); tests for the route | The 31-day wait and the school route not walked; Head of House, house points, troll and duel (HG4), owl post (HG6) |
| 5 Inquiry | `inquiry@1`, Frontier lever write-up | tests | Not walked (MCP cannot reach the craftsman); the slice's named consumers, Klein's library and Harry's study, are not built; notes as objects not built |
| 6 Livelihoods | Stage records (Frontier plot, pen, wilds homestead; LOTM clerk wage); hired hands run the plot; authority and knownness decide obligations | tests | Production is still Frontier-only (no Tingen garden or Hogwarts greenhouse); hired hand not walked |
| 7 Channels | One 16-channel vocabulary; skill tooltip line; fight-log channels with perceive against conceal; social contests and "Talk the price down" | tests; walk could not open a skill tooltip in Tingen | No channel line on LOTM ability rows; no language, stealth or wayfinding verbs; ability moves in fights; shop button not walked |
| 8 Events and society sheet | Consequences (owed, heat, collector, fine); Tingen deck and market and service days; sheets for Tingen and Harry | walk: owed lines and deck cards in Klein's digest | Deck cards carry flavour text without effects or choices; forms of address missing in both sheets; other worlds have no sheet |

### Round 4 obligations (OB1-OB12)

| ID | Delivered | Evidence | Left |
|---|---|---|---|
| OB1 | Pay on time, a week late, skip | walk | Pay part, dispute, hide income, bribe, evade |
| OB2 | Notice, landlady, collector at 3, fine at 4 | walk for notice and landlady; tests for collector and fine | Seizure, bounty, warrant |
| OB3 | `heat@1`, per authority, from known acts, decays | tests | Audit discovery; few producers of known acts (collector fight, one roster caller) |
| OB4 | Fines wait, wages end at a week boundary, nothing taken while away | tests (AT23 included) | none at this scope |
| OB5 | Hired-hand income | tests | Appreciation, decay and loss of owned things |
| OB6 | Weekly money line with exceptions, wired into Reports | tests | Not seen natively |
| OB7 | Hired hand (ladder L1) | tests | Stewards and accountants running obligations |
| OB8 | `authorityOver` with claimant, knowledge, reach; livelihoods obey it | tests | Duties and rent do not consult it yet (Tingen rent is correct by authoring, not by the seam) |
| OB9 | Knownness from Mira's plot right and market sales | tests | No LOTM readers; rumours and positions do not feed it |
| OB10 | Turn the collector away; police heat after a win | tests | The authority's stronger follow-up steps |
| OB11 | Founded groups collect member dues | tests | Claiming land and collecting from outsiders as the authority |
| OB12 | Wages through positions, hired hands | tests | Standing orders that sell surplus, rent you collect, loans |

### FD rows, per-world gaps and findings

- **FD3+ stock properties:** silver and poison done (tests, loaded kind seen natively); M1 batch and label identity not built; Frontier bow has no item, recipe or opener.
- **FD17 fight frame:** stalemate end, foe stock, armed robber, collector and guard openers (armed opener seen natively; the rest tests).
- **FD18 ability channels:** vocabulary and fight-log text; executable ability effects not built.
- **LOTM potions:** Sun 9-8 and Klein's Sequence 7 (tests); 18 pathways and higher Sequences remain (LG2 needs source reading first); LG3-LG8 open.
- **Other worlds:** MoL, Reinvented Paradise, Primordial Saint Sect and Gu had a light pass; no slice landed there.
- **Findings:** AT21 fixed (tests), AT22 fixed (walk), AT23 verified (tests), AT24 fixed (tests), AT25 data path fixed (timer behaviour not checked in a browser), AT26 fixed (walk). Still open: pledges split; M1-M4 and M6; G1 canon pull into the FD16 calendar; G3 rival record shape; the Tingen skill tooltip and owed ledger panels not offered in that view; the game MCP server needs a restart before `game_freeze` works.

### Classification

Incomplete integration: OB8 duties, the inquiry book consumers, Tingen panels for tooltip and ledger, the Frontier bow. Missing proof: every "tests" row above until a walk runs. Proposals still awaiting Weibao: AR17 and every authored dial (AD32). No genuine disagreement found.

## Round 5: thoughts, expansion and reconciliation of rounds 4-4b and the health round (2026-11-06)

Weibao, 2026-11-06: "what new ideas did we save today? any way to expand on them?" then "your thoughts on these? Expanding/reconciling them with everything else?" A `more-to-consider` pass over OB1-OB12, the [health round](../BODY_AND_HEALTH_CONSIDERATIONS_2026-10-17.md#illness-healing-and-resistance-2026-11-06) and the code at `b68e4c88d`. Proposals (AD32). Evidence is a read of `authority.js`, `authority_sources.js`, `heat.js`, `duties_domain.js`, `recurring_duties.js`, `organizations_domain.js`, `care_access.js`, `obligations_ledger.js`, `trade.js`, `known_target_facts.js` and the ACR, ECR and ABR owners; no tests run.

### View

The four rounds are one mechanism seen from four sides, and the code already holds every piece of it: earning makes you known (OB9, `knownness`), known means you owe (OB8, `authorityOver`), owing unpaid makes heat (OB3, `heat@1`), and heat you pay off, refuse (OB10) or replace (OB11, `claimGround`). What is missing is not a system but three readers and one consult. That is the best news of the day: the loop needs integration, not invention. The health round sits beside the loop until care can be owed (F5), after which a healer's fee, a loan and rent are one ledger.

### ACCOUNT FOR NOW (constraints on the next slices, no new feature work)

| ID | Finding | Evidence | Disposition |
|---|---|---|---|
| F1 | **The loop has one dead link: Tingen has no knownness reader and duties do not consult authority.** Rent in Tingen is right by authoring; a wilds cabin owes nothing by authoring too. `authority_sources.js` registers village readers (plot right, market sales) and says "nothing registered reads the player's knownness yet" for LOTM. | `authority_sources.js:16-24`; reconciliation row "OB8 duties and rent do not consult it yet" | The next obligation slice is the consult (`duties_domain` asks `authorityOver` before a dues week counts) plus two Tingen readers: wages through `positions@1` and divination fees. No new seam. |
| F2 | **Witnesses already exist; do not add a seen-by set.** `heat.recordAct` refuses unknown acts and expects the caller to say who knew. `known_target_facts.js` (consumers: `rival_memory`, `tempo_fight_domain`) records who observed what. ACR9 keeps each observer's knowledge separate from truth. | `heat.js` header; `known_target_facts.js` | Witness = a knownness reader over known-target facts whose observer belongs to an authority (a constable who saw the fight, a market clerk). Informers and wanted notices are then transfers between authorities' readers, not new state. |
| F3 | **Anonymity must erode through positions, not block them.** OB9 says being unknown blocks positions; `positions@1` has no knownness check and should not get one. Taking a post is itself a known act. | `grep known src/positions*.js` empty | A knownness reader over held positions (weight by how public the post is: clerk 2, hired guard 1, hermit's trade 0, dials per world). Gating stays with the employer's own requirements by default; a world whose employers check papers can read knownness too, with that reason stated. |
| F4 | **Knownness never fades; heat does.** `knownness` sums reader weights with no age; `heat@1` decays over `decayDays`. A hermit who sold at market once is "noticed" forever. | `authority.js` `knownness`; `heat.js` palette | Readers return `at` (day) and the sum applies a per-authority half-life (dial; a sect with records forgets slowly, a market town fast). Derived, so no save change. |
| F5 | **Care as debt is one gate kind away.** `care_access.js` gates on price, rank or favor; the owed ledger already holds money rows (`eases: 0`) and time-easing rows. | `CARE_GATE_KINDS`; `easeObligations` | A `credit` gate writes an owed row to the provider instead of taking coins. The provider side (player as healer) then earns standing and a knownness signal with the same row, which is how the health round joins the loop. |
| F6 | **Hogwarts is the money-less test of OB8.** AD46 already allows worlds with only social obligations. House points and detentions fit the ledger's non-money row shape (an amount that eases by time, a creditor that is a Head of House with claim, knowledge and reach inside the castle). | `obligations_ledger.js` eases rows; `world_society_sheet.js` | Run OB8 there before spreading it to a third money world: if the seam carries points and detentions without a special case, it is world-neutral; if not, the special case is the finding. Default: one creditor per house. Dial: whether points ease by term or by year. Reason: the castle's year is its clock. |
| F7 | **The other side of OB11 is half built.** `claimGround` exists with `settlerDues` as a rule; the old authority does not learn of the claim, and settlers have no policies against the player. | `organizations_domain.js:160`, claims palette | A claim inside a world's bounds is a known act toward that world's authority (one `recordAct`), and settlers' dues use the same OB1 policy set, read from the group side. Reuses everything; nothing new to save beyond the claim already stored. |
| F8 | **Identity should be reserved in the knownness key.** `RIVALS_IDENTITIES_AND_FATE` names layered identity claims as a reusable part; LOTM lives on aliases; knownness today keys on "the player". | `authority.js` readers take `ctx` | Readers accept `ctx.identity` and default it to the player; no behaviour change now, no rekey later when a false name arrives. |
| F9 | **OB4 holds in today's build.** Seizure waits for the player's return (`seizureWaiting` is derived, nothing taken while away); "Talk the price down" enters prices as one `part` of the reconciled terms with a reason (ECR4, ECR5) rather than a stacked factor. | `duties_domain.js:140-142`; `trade.js` `talkTerms` | No change. Recorded so the next lane does not reopen it. |

### LATER / DELEGATE

- **L1 Legibility of claim and knownness (small, haiku-sized once the panel seam is known).** No view says who claims this place, what they know and why dues apply, which is why OB8 is "correct by authoring" and unwalkable. One line in Ledger at the OB6 grain: "The landlady claims this room and knows you; the Tingen police have heard of you (market, position)." Done check: the line changes when the player moves from Tingen to unclaimed ground.
- **L2 Settle open question 7 with the round 4 shape (Weibao's call).** OB1, OB4 and OB6 are a workable default answer to "active versus idle": everything that repeats runs by a policy the player set, and the player's active time goes to exceptions, scenes and new arrangements. Proposed wording for USER_VISION if he accepts it: "Routine runs by policy; play is the exceptions." Until he says so it stays input.
- **L3 Delegation rungs above L1 as the OB7 and OB11 meeting point.** A steward (L2) runs standing orders by the player's policies and is also the group's collector from the other side. Their honesty and skill are a person (ACR10), so a dishonest steward is the first automated-income risk event (OB12), reported in the return digest with cause.
- **L4 Health provider route.** Player-as-healer through the lesson seam with `who: player` care records, gated by a skill and `knownTargetFacts` diagnosis; "tend the child" replaces "carry the message" at a skill. Depends on F5 so the fee can be owed.
- **L5 Worlds with far reach.** OB8's dial for a sect's spiritual sense or a church's divination has no source rows yet; LG2 source reading decides what Tingen's churches can know. Not before LG2.

### What this does not change

No AD line, no rule code and no PROJECT.md line moves. The suggested order in the delivery reconciliation stands, with F1 first because it makes the rest observable. F6 is the one ordering change worth considering: a Hogwarts pass before a third money world.
