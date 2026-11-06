# Lane H: world-neutral hosts and the seam adoption register (2026-11-06)

Round 3, lane H. Read-only survey of `src/` at the working tree of 2026-11-06 (master `a3879e4bb` plus other sessions' uncommitted edits, so line numbers can drift). Everything here is a proposal (AD32); nothing is accepted and no code, rule file or register was edited. Applies AD46 (a view that names one world's ids in shared UI code is a defect), AD51 and AR11/AR12.

Labels: **shown** = read in a file or printed by a grep/import scan; **inferred** = derived from names or one hop of imports. Importer counts come from a throwaway import scan (static `from '...'` lines in `src/`, `tests/`, `scripts/`, run from the scratchpad, not committed); "src" excludes the module itself.

## Headline

- **Task A:** 12 shared domains read the Frontier-only `writable` port (`harvestWritable`, main.js:2210); 3 more carry their own Frontier/Village literals on a neutral port; 2 host-level readers gate on `base.frontier` too. At least 5 of the 12 are world-neutral by purpose (tempo fight, away bank, return digest, journal, pledges). A one-line fix for tempo already exists as a pattern five siblings use.
- **Task B:** 37 seams scanned: 6 reach no world file (0), 16 reach one world (1), 15 have importers from two or more world families (2+). Player routes are "unknown" for all but two. "2+" means code-level importers, not a proven second *different* case (AR11).
- **Task C:** AR17 draft: a shared host supplies write permission from save state only, and a world gate lives inside the domain that owns the world, so no world is locked out of a shared seam by a port it did not choose.

## Task A: host survey

### The shape

`configureNativeToolDomains(operations)` (native_tool_domains.js:37) fans one `operations` bag out to about 20 domain configures. The bag carries two write ports, both built in main.js:

| Port | Defined | What it checks | World gate |
|---|---|---|---|
| `writable: harvestWritable` | main.js:2210-2211 (via `harvestWriteReason`) | restoring, tab owns save, save blocked/import probe/load error/life storage failure, alive, **then `worldId !== 'base.frontier'` -> "Return to the frontier world first."** | Frontier only |
| `tradeWritable` | main.js:9475 (`workLedgerCanWrite()&&!restoringNativeSave&&!lifeStorageFailure&&character.is_alive`), `workLedgerCanWrite` at main.js:3387 | the same save-state checks, no world clause | none |
| LOTM's own `writable` | main.js:1133 inside `configureLotm({...})` | tab owns save, no save block, no import probe, not restoring, no expansion error (no alive or life-storage check) | none |

So the same save-state predicate is written three times and only one copy carries a world clause. The LOTM copy has already drifted (no alive check). Five domains already take `operations.tradeWritable||operations.writable` (native_tool_domains.js: hp_brewing, root_retuning, vessel_thread, shop_locks, life_events); the rest take the Frontier port unchanged.

### Gate inventory

| # | File:line | What it gates | Locked out | Smallest world-neutral fix | Reading |
|---|---|---|---|---|---|
| G1 | main.js:2210 `harvestWriteReason` | the Frontier clause on the shared write port; also feeds `harvestBlockReason` (2215), homes `read.ready`/`writable` (9484-9485), `configureResourceDomains` (9488) | LOTM, HP, MoL, paradise, primordial, Gu, proto23 (any `worldId` but `base.frontier`) | Split into `saveWriteReason()` (everything before the world clause) and `harvestWriteReason = saveWriteReason() \|\| worldClause`. Hand the first to world-neutral domains; keep the second for carcass and Frontier homes | shown |
| G2 | tempo_fight_domain.js:42, 93, 170-174, 199, 206-207 | open fight eligibility, opener quotes (`eligible: q.eligible && ports.writable()`), move/order/handover buttons, `aim`, `begin`, `move` commands | every non-Frontier world: a LOTM player sees the opener disabled with the Frontier message (CHECKPOINT T1) | In native_tool_domains.js:46 replace `configureTempoFight(operations)` with `configureTempoFight({...operations, writable: operations.tradeWritable\|\|operations.writable})`, the pattern already used at lines 25, 49, 50, 52, 61. The domain already passes the player's own `worldId` to the harm ladder (line 24) | shown |
| G3 | away_bank_domain.js:45, 68 | spending banked time, `writable` in the projection | non-Frontier | same one-line swap in native_tool_domains.js:39. Purpose is world-neutral (banked time), inferred | shown gate, inferred purpose |
| G4 | return_digest_domain.js:25, 37 | marking the return digest read, projection `writable` | non-Frontier | same swap (line 56 of the fan-out); a LOTM player coming back after sleep cannot dismiss it | shown gate, inferred purpose |
| G5 | personal_journal_domain.js:12, 16, 21 | saving a journal entry; `view()` falls back to `'base.frontier'` when no world port (line 21) | non-Frontier | swap the port; drop the `'base.frontier'` fallback or take it from the active world's id | shown |
| G6 | pledges_domain.js:51 | enabling/configuring trial routines (`ports.writable?.()===false`) | non-Frontier | swap the port | shown gate, inferred purpose |
| G7 | cultivation_intents_domain.js:5 | `context().ready = ports.writable() && idle && !blocked` | non-Frontier | swap the port if cultivation intents are meant for xianxia worlds; otherwise it is a Frontier feature and should carry its own `WORLD` constant | purpose unknown |
| G8 | gear_workshop_domain.js:29-32, 131, 136 | mender station availability; `discovered: m.world === 'base.frontier' && m.station > 0` (136) | non-Frontier | maker rows should carry their own world; swap the port | shown gate, purpose inferred |
| G9 | field_layer_domain.js:17-19 | passes `writable` into `nativeFields.configure` | non-Frontier | swap the port; fields are used by proto-like worlds (needs a look) | inferred |
| G10 | lamplight_domain via native_tool_domains.js:63-66 | light-source lighting uses `writable` | non-Frontier | swap the port. World light is a seam LOTM already uses (see Task B) | inferred |
| G11 | tools_domain.js:83, 116, 122, 191, 229, 266 | tool prep and repair; line 122 hard-codes `location !== 'Village' \|\| world !== 'base.frontier'` ("Village forge"); 83 same for the lever tool | non-Frontier | writable swap for the generic part; the forge stays Frontier by place, so its world check should be a data field on the station, not a literal | shown |
| G12 | cohort_battle_domain.js:17, 18, 31, 70 | cohort manor field and battle; line 17 hard-codes `worldId: 'base.frontier'`; line 70 `visible` requires it | non-Frontier | Frontier-bound by design (manor). Keep, but own the world as a constant in the domain, not inherited from the shared port | shown, by design |
| G13 | drainage_site_domain.js:22 | gallery work, `ready: ports.writable() && ...` | non-Frontier | Frontier-bound by design; same constant treatment | shown, by design |
| G14 | life_events_domain.js:49 | `ports.world?.() !== 'base.frontier' \|\| location !== 'Village'` on household plans (the writable is already neutral) | non-Frontier | by design (Village household); move the world+place pair to a `gate` data field so a second world can add a row | shown, by design |
| G15 | aging_contact_domain.js:33 | `here = () => location === 'Village'` | non-Frontier | by design; same data-field treatment | shown |
| G16 | hp_brewing_domain.js:61, 101 | `world() === 'base.frontier'` for foreign uses and structural repair; the HP bench itself uses the neutral port | none for the bench | fine as is: a world-specific rule inside a domain that already uses the neutral port | shown |
| G17 | main.js:3382 `workLedgerContext` | `locationId` is `'away'` for any non-Frontier world, so the work ledger sees a LOTM player as away from everything | LOTM, HP, MoL, paradise and others for any work-ledger consumer | provide the active world's `location` (the LOTM host already exposes `location: () => current_location?.id`, main.js:1133) | shown |
| G18 | native_resources_domain.js:14, 23 | carcass receive/act need `harvestWritable`; error text "writable frontier game" | non-Frontier | by design (harvest is Frontier skinning); rename the port `frontierWritable` so the name states the gate | shown |
| G19 | main.js:9897, 9908, 9912, 9970 | `here`, denomination knowledge, practice hints, `away` all keyed on the Frontier world id | non-Frontier | host-level; low priority, each is Frontier teaching copy | shown |

Count: **G2-G11 are 10 shared domains on the Frontier port whose purpose is plausibly cross-world** (5 shown to be: tempo, away bank, return digest, journal, pledges; 5 uncertain: intents, gear workshop, fields, lamplight, tools). G12-G13 are 2 more on the same port but Frontier-bound by design. Total on the gated port: **12**. G14-G16 are domains with their own literals on a neutral port (3). G1, G17-G19 are host-level.

### What is locked out in play (shown)

LOTM, HP, MoL, paradise, primordial and Gu players cannot reach: a tempo fight (T1), banked time, the return digest, the journal save, pledges. The tempo domain already prints the Frontier message to them: "Return to the frontier world first."

### Panel placement

- **Tempo panel (shown):** `tempo_fight_domain.js:125` builds a raw `details#tempo_fight_panel.expedition_panel` and mounts it through `registerDomain({... panels: [() => panel = mount()]})` (line 210). It is not a `definePanel`, so it has no `perspective`, `discovered`, or `home`. The Notebook files unregistered `.expedition_panel` nodes under its People section (CHECKPOINT T2); `adventure_notebook.js:18` maps ids to views and `tempo_fight_panel` is not in the map.
- **LOTM panel (shown):** `book_world_lotm_ui.js:369` `definePanel({id:'lotm', ..., home, perspective:'book.lotm.tingen', discovered: v.enrolled||v.startable})`. Its blocks (`actions`, `walks`, `path`, `work`, `bench`, `notebook`) are the panel's own nodes, grouped into tabs by `mountWorkroomTabs` (book_world_lotm_tabs.js:5-9, 25). It imports renderer helpers (`ui/walk_map`, `ui/figure`, `ui/rite_figure`, `ui/lotm_task_summary`), not other domains' panels. A grep of `book_world_lotm_ui.js`, `book_world_hp_lead_ui.js` and `hp_brewing_panel.js` for `domainRegistry`/`.project(` finds nothing.
- **HP (shown):** two separate `definePanel`s on `main_content`: `hp` "The household day" (book_world_hp_lead_ui.js:42) and `hp-polyjuice` (hp_brewing_panel.js:237). No cross-embedding.
- **Existing hooks that could carry a shared embed (shown):** `registerWorkspaceModule` already takes `homeHost`, `perspective`, `access` and `eligible` (workspace_layout.js:114); `seatAllowsPanel` and `panelAccessible` filter by seat (workspace_layout.js:259-262); `registerOwnedWorkPanel` lets a work owner name its own panel for Notebook attention (adventure_notebook.js:25); `companionPanels` names shell companions in layout_spec.js:365.
- **Is there an "embed a shared panel inside a world panel" pattern? No (shown by grep).** World panels reuse render functions; no world panel hosts another domain's panel node.

### Smallest fixes, in order

1. **Port split (S, minutes):** add `saveWritable` beside `harvestWritable` in main.js and pass `tradeWritable` (already equivalent) to G2-G6. Test: one `tempo_fight_domain` test that `writable()` is true for a non-Frontier world id (the existing domain test file is the place).
2. **Tempo surface (M):** make the tempo panel a `definePanel` with `perspective` set per world seat and `discovered` true when an opener or open fight exists; LOTM's workroom gets a named slot (`data-slot="encounter"`) in the `here` tab that the registry re-parents the tempo node into (`homeHost`). Needs a 1920x1080 capture (AGENTS UI rule); UI work under DESIGN/UR.
3. **Gate as data (M):** replace G11/G14/G15's literals with a `gate: {world, place}` field on the row or station, so Frontier rows say Frontier and another world adds its own row.
4. **Deduplicate the predicate (S):** one `saveWriteReason()` consumed by `configureLotm.writable`, `tradeWritable` and `harvestWriteReason`.

## Task B: seam adoption register

### Method

For each module: `src` = distinct non-test importer files in `src/`; `tests`/`scripts` counts importers there; worlds = world families of the *importing file names* (shown), with one hop through a shared adapter marked (inferred). Families: lotm (`book_world_lotm*`, `lotm_*`), hp (`book_world_hp*`, `hp_*`, `world_packs/book_hp*`), mol, paradise, primordial, gu, mistglass (`mistglass*`, `root_retuning`, `vessel_thread`), proto23 (`proto23*`, `p23`), dnd, village/frontier (`village_*`, `frontier_*`, `expedition_*`, `cohort_*`, `life_events*`, `storylet*`, `tools_domain`, `gear_workshop`, `pocket*`). `main.js`/`display.js` are composition, not worlds. A world pack under `world_packs/` is counted under its book. **Player route** is "unknown" unless a test or receipt shows a native play route; a unit test is not a route (AR10).

Proof states (AR11): **none** = no world file imports it; **one** = one world; **two+** = importers from two or more world families (code-level only; whether the second case is *different enough* to prove the seam is a judgment this scan cannot make).

### The register

| Seam (module) | src | tests | Worlds that import it | Player route | Proof |
|---|---|---|---|---|---|
| ready_stock | 1 (be_firearm) | 1 | lotm | native hire + load shown in CHECKPOINT (20/0 then 14/6); fight use blocked by T1/T2 | one |
| notch_contest | 1 (lotm bands) | 1 | lotm | unknown | one |
| check_contract | 4 (all `check_*`), reaching `dnd_phandalin*` and `person_memory` | 1 | dnd (inferred one hop) | unknown | one |
| own_holdings (purse) | 7 | 4 | lotm (kit, pay), hp (lead_domain, hp_life_holdings), plus book_life_holdings, display, world_look | unknown | two+ |
| recurring_duties | 2 | 2 | lotm (duties, via duties_domain) | unknown | one |
| lesson | 2 | 1 | lotm (divination method), teacher_window (Village) | unknown | two+ |
| teacher_window | 1 (village_ui) | 1 | village/frontier | unknown | one |
| travel_legs | 2 | 3 | lotm (districts, next_city) | unknown | one |
| world_light | 1 | 1 | lotm (events) | unknown | one |
| people_knowledge | 6 (UI: notebook, chronicle, people, web, return_digest) | 8 | none directly; fed by people_sources | unknown | none (see next row) |
| people_sources | 4 | 1 | hp, lotm, mol, plus people_knowledge | unknown | two+ |
| constraint_store | 3 | 2 | lotm (cast_host, state), constraint_pack | unknown | one |
| conflict_frame | 5 | 0 | native_battle, party_battle, feature_expansion_battle, tempo_fight (Frontier); cast_ability_adapter (lotm hosts, inferred) | unknown | two+ (inferred) |
| tempo_fight (engine + contract) | 1 (tempo_fight_domain); contract also in native_battle_contracts, clock_owner | 9 | village/frontier; lotm opener `book_world_lotm_fight.js` registered but unreachable | blocked for LOTM (T1, T2); Frontier unknown | one |
| harm_state | 9 | 6 | lotm (harm), tempo_fight_domain and tempo_location (Frontier), continuation_state, simulation, main | unknown | two+ |
| world_rhythm | 30 | 6 (+8 scripts) | lotm, hp, primordial, proto23, frontier, plus 22 shared | unknown | two+ |
| cast_schedule | 5 | 6 | lotm (cast, cast_host), mol (cast), village (village_workspace), wait_until | unknown | two+ |
| world_events | 11 | 10 | lotm (cities, events, via region_kit/gatherings/bridges); `world_events_pack` lotm only | unknown | one |
| storylet_deck | 4 | 2 | frontier/village (expansion_engine, simulation, storylet_ui; Village gates at lines 21, 67, 92, 99 per round 2) | unknown | one |
| seeded_streams | 25 | 13 | proto23, frontier, lotm, mistglass, plus 16 shared (inferred paradise, hp, mol one hop) | unknown | two+ |
| institution_store | 2 | 1 | lotm (merit), primordial (credit) | unknown | two+ |
| institution_access | 1 | 1 | mol | unknown | one |
| faction_rank | 7 | 1 | main, display, local_life, organization_source, persona_standing, region_kit, reputation; worlds inferred: frontier (reputation, management) and lotm (region_kit, persona_standing) | unknown | two+ (inferred) |
| law_case (+ jurisdiction_rules) | 0 (jurisdiction_rules is imported only by law_case) | 1 | none | none | none |
| owed_ledger_sources | 2 (quest_board_ui, work_ledger_ui) | 1 | none directly (shared UI) | unknown | none |
| structured_ability_runtime | 8 | 3 | lotm (abilities), cast_ability_adapter, ability_records (hp inferred), four start-content files | unknown | one (hp inferred) |
| life_events | 1 (life_events_domain) | 1 | village (gate at domain line 49) | unknown | one |
| home_building_model | 6 (home_* panels/models) | 1 | frontier homes; proto23 inferred one hop | unknown | one |
| research_* (content, view, home) | 1 + 3 + 1 | 1+2+0 | none directly | unknown | none |
| ability_ladders | 2 (ui/ladder_groups and its gallery) | 1 | none (UI gallery only) | none | none |
| effect_dsl | 1 (damage_types) | 1 | none (inert by ABR4) | none | none |
| world_calendar | 9 | 7 | hp, paradise (2), mol, frontier, plus event_feed, world_day_index, weather display | unknown | two+ |
| cast_* adapters (body, inference, divination, exchange, making, topic_talk, journeys, ability: 8 modules) | 1-2 each | 2-5 each | lotm (cast_host, host) | unknown | one |
| ability_records | 4 | 4 | hp and lotm (inferred one hop) | unknown | two+ (inferred) |
| material_lineage | 14 | 7 | frontier, hp, lotm, mistglass, paradise, proto23 (inferred) | unknown | two+ (inferred) |
| lore_history_state | 9 | 7 | frontier, lotm, mistglass, mol, paradise, proto23 (inferred) | unknown | two+ (inferred) |
| combat_math | 13 | 7 | frontier, lotm, mol, paradise, proto23 (inferred) | unknown | two+ (inferred) |

(`observer_view` 19 src, `seat_profiles` 12, `panel_kit` 58 are UI plumbing used by nearly every world and not counted as gameplay seams.)

### Tally (37 rows)

| Proof | Count | Seams |
|---|---|---|
| none (0) | 6 | people_knowledge, law_case, owed_ledger_sources, research_*, ability_ladders, effect_dsl |
| one world (1) | 16 | ready_stock, notch_contest, check_contract, recurring_duties, teacher_window, travel_legs, world_light, constraint_store, tempo_fight, world_events, storylet_deck, institution_access, structured_ability_runtime, life_events, home_building_model, cast_* adapters |
| two or more (2+) | 15 | own_holdings, lesson, people_sources, conflict_frame, harm_state, world_rhythm, cast_schedule, seeded_streams, institution_store, faction_rank, world_calendar, ability_records, material_lineage, lore_history_state, combat_math |

Seven of the 15 are "inferred" (one hop through a shared adapter). Counting only shown direct importers from two world families, the 2+ group is smaller. effect_dsl is inert by design (ABR4). None of the 15 is "two+ proven in play".

### Readings (inferred unless marked)

- **R1.** The LOTM-only rows (ready_stock, notch_contest, recurring_duties, travel_legs, world_light, constraint_store, world_events) are exactly the seams FD lists as foundations. Each has one consumer and a second world has never been asked to use it. AR11 says the seam is unproven until it is.
- **R2.** `world_rhythm` is the one seam consumed by many worlds (shown, 30 importers). It is also the oldest.
- **R3.** `tempo_fight` is world-neutral in code and one-world in play: the LOTM opener exists and is gated off by G2 (shown, CHECKPOINT T1).
- **R4.** `law_case` has no importer (shown), as round 2 said. `ability_ladders` now has two importers (UI gallery only), so the FD table's "0" is stale by two files.
- **R5.** "Two worlds in code" often means one is the Frontier/Village and the other LOTM; HP and MoL appear only on `people_sources`, `own_holdings`, `world_calendar`, `world_rhythm`, `cast_schedule` (mol) and `institution_access`.
- **R6.** No row is verified as reachable from a player route by this scan (AR10). Only ready_stock has a native receipt, and only for hire and load.

## Task C: proposals

### AR17 draft (existing AR table style; proposed, AD32)

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| AR17 | **Hosts and ports are world-neutral; worlds gate themselves.** A host port a shared domain receives (`writable`, `blocked`, `idle`, `location`, `world`) answers only about the engine and the save: tab owns the save, save not blocked, not restoring, actor alive. It never names a world id. A world or place restriction lives in the domain or data row that owns it (a `gate: {world, place}` field, a `WORLD` constant at the top of the domain file) and reads the player's own world from `world()`. A shared panel is a registered module with its own `perspective`/`discovered`, and a world panel exposes a named slot where the registry places it. Default: neutral port. Dial: a place-bound domain (carcass processing, a manor, a forge) keeps its world gate, stated in its own file. Reason: a gate on a shared port locks every other world out of a seam whose engine is already neutral; the owner's world check says who it is for | A neutral engine (tempo fight, banked time, return digest) wired to a Frontier port so a LOTM player sees "Return to the frontier world first"; a panel filed under a hidden module of a world it is not for |

Companion line for AR11 (proposal): "A seam is not proven by a second *importer*; it is proven when a second world's player route reaches it (AR10) and the second case needed less core work." This uses the register's "route" column.

How to check AR17 cheaply: extend `scripts/check_architecture.mjs` (it already holds `scripts/architecture_baseline.json` with a shrink-only baseline) with a literal-world-id scan over *shared host files*: any file whose name is not in a world family may contain `'base.frontier'`, `'Village'` or another registered world id only if listed in the baseline. Today's baseline would hold main.js (35 occurrences of `base.frontier`) and the domain files in G1-G19. The baseline may only shrink (same rule as import cycles). A second assertion: the `writable` argument of every `configure*` call in `native_tool_domains.js` must be `operations.tradeWritable||operations.writable` or be listed as place-bound.

### Register format and home

- **File:** `docs/SEAM_REGISTER.md`, next to `RULES_INDEX.md`, linked from the RULES_INDEX router row for "A new world" and from AR11, and cross-linked from `SYSTEMS_REGISTER.md` (which says what systems exist and their degree; the seam register says who uses each, so the two do not overlap).
- **Columns (one row per seam module group):** `seam` (module path), `FD/AD code`, `owner doc`, `src importers`, `worlds (by family)`, `route (receipt link or "unknown")`, `proof (none | one | two+ | two+ proven in play)`, `blocked by` (a gate code like G2, or empty), `last checked (commit)`.
- **Rules for the file:** "route" is "unknown" until a receipt or native test is linked; a unit test never fills it. "two+ proven in play" needs two worlds with receipts. A row that stays "none" for two rounds is listed in a short "unused seams" section so it is a decision (wire, hold or delete), not drift.
- **How it stays current:** generate the numeric columns, do not hand-edit them. Add `scripts/seam_register.mjs` (the scan used in this lane, about 40 lines: import regex, family classifier by file name, per-module counts) with two modes: `--print` writes a markdown table; `--check` fails when a row's recorded `src importers` or `worlds` differs from the code, or when a seam module is added with `registerDomain` or an `export` in a `*_domain.js` file but has no row. Run it from `npm run check:rules` (which already guards the rules index), so a new seam or a changed consumer count updates the register in the same change, as AD36 asks for rules rows. The family classifier lives in one data table in the script; adding a world adds one regex.
- **Test:** `tests/seam_register.test.js` runs `--check` against the committed file and asserts that every module named in AR11-related FD lists exists.
- **Not in the register:** UI plumbing (`panel_kit`, `observer_view`, `seat_profiles`) and pure content tables. Those get a one-line "plumbing" section so they are not mistaken for seams.

### Open questions for the coordinator (no decision needed from Weibao)

- Q1. Whether `cultivation_intents`, `gear_workshop`, `field_layer`, `lamplight` and `tools` are meant to be cross-world. The scan shows the gate, not intent. Default: treat lamplight and fields as neutral, tools and gear as Frontier-by-place with data gates.
- Q2. Whether to run the one-line tempo fix (G2) before the panel work. It changes no save and unblocks the LOTM opener's eligibility; the panel (T2) still needs the UI lane.
- Q3. The importer scan counted `scripts/` and `tests/` separately; HP world packs under `src/world_packs/` import through `book_hp_*` and were attributed to hp by name, not by tracing.

## Checks and gaps

| Check | Result | Gap |
|---|---|---|
| grep of native_tool_domains.js, main.js, configure sites and 22 domain files for `writable`, `worldId`, `base.frontier`, `'Village'` | listed in G1-G19 | domain bodies not read past the gating lines; purposes inferred from names |
| import scan over `src/`, `tests/`, `scripts/` (regex on `from '...'`) | counts in the register | dynamic `import()` with computed paths and registry-based consumption (a domain reaching a seam through `domainRegistry.project`) are not seen; "route" not measured |
| `.claude/worktrees/` copies of the repo exist and were ignored by the scan | not counted | none |
| runtime, build, tests | not run | read-only lane |
