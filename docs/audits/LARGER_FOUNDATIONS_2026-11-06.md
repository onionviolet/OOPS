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
