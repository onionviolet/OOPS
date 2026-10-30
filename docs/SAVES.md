# Saves and compatibility

Owner of **what a save holds** and **what was promised about old saves**. Created
2026-10-30 at Weibao's request so lanes stop deciding persistence one by one.

- The **code map** (how to plug a slice in, gotchas, line-level API) stays in
  [systems guide S12](systems/PROGRESSION_WORLD_STATE.md#s12-persistence). This file does not repeat it.
- Authority order: Weibao's words in [USER_VISION](USER_VISION.md), then AD lines and
  [AR6](ARCHITECTURE_RULES.md), then the code, then agent records (checkpoints, commit bodies).
- Status: the contract in sections 1, 2 and 4 restates code read on 2026-10-30
  (agent-verified by reading, not by a new run). Every line in sections 5 and 6 marked
  *proposal* binds only after Weibao accepts it by name (AD32).

## 1. What a save is

**One storage key per life, one JSON envelope.** The browser holds the live envelope as a
single `localStorage` string; Export wraps the same JSON as base64 with a marker prefix.

| Part | What it is | Owner |
|---|---|---|
| Storage keys | `save data` (live), `dev save data` (dev release), `backup save` and `dev backup save` (hourly copy) | `src/main.js` (`save_key`, `dev_save_key`, `backup_key`) |
| Single writer | One tab owns the save through a Web Lock named `yairpg-save:<key>`; `createDurableSaveWriter` skips a write that changes just `saved_at` and `total_playtime` | `src/main.js`, `src/save_files.js` |
| Export file | `YAIR-UTF8-1:` + base64(UTF-8 JSON). Older unmarked files decode as Latin-1 | `encodeSaveFile`, `decodeSaveFile` in `src/save_files.js` |
| Import | decode, `validateSaveEnvelope`, real-loader `preflight`, then one guarded write; any failure leaves the stored save untouched | `importSaveFile` in `src/save_files.js` |
| Size guard | 4 MiB shared-origin budget, counted across all keys in the origin | `checkSaveSize`, `writeGuardedSave` |
| Version gate | `game version` (`v0.6`, `src/game_version.js`) must not exceed the running game; `fork_schema` is 1 | `validateSaveEnvelope` |
| Authority, undo | Optional enrolled "native authority" record plus a backup journal (current, previous, revision) as separate keys | `src/absorb_p23/save_time_options/native_authority.js`, `backup_undo.js` |
| Retired content | `retired_content {schema:1, entries:[{path,value}]}` holds data the game no longer defines, opaque and round-tripped | `src/save_compatibility.js` |

### 1a. Top-level sections, by who writes them

**A. Written directly by `create_save` in `src/main.js`** (about 80 keys, some conditional).
Grouped by owner; the code is the exhaustive list.

| Group | Keys | Owning module (reader/validator) |
|---|---|---|
| Native game core | `game version`, `current time`, `current location`, `character`, `levels`, `inventories`, `availabilities`, `locations`, `npcs`, `npc_equipment`, `books`, `stances` and stance picks, `quests`, `recipes`, `options`, `active_effects`, `global_flags`, `item_log`, `loot_sold_count`, `player_storage`, `current_activity`, `is_reading`, `is_sleeping`, `enemy_killcount`, `last_combat_location`, `last_location_with_bed`, lifetime counters (`total_*`, `strongest_hit`, `gathered_materials`) | `src/main.js` load path, structural checks in `validateSaveEnvelope` |
| Presentation kept in the save | `language`, `message_filters`, `skill_list_state`, `skill_category_order`, `favourite_*`, `are_finished_quests_hidden`, `display_preferences`, `customization`, `customization_default` | `src/main.js`, `src/display_settings.js`, `src/customization_profiles.js` |
| Expansion engine | `expansion` (schema 5 through 11 by opt-in, see section 2), `native_encounter` | `src/expansion_engine.js` and the per-world `*_native.js` validators |
| Village and life records | `village_career`, `work_ledger`, `life_record`, `npc_lives`, `generated_people`, `household`, `fort_supply`, `pacing_e1`, `equipment_durability`, `absorb_local_life`, `mixtures`, `content_packs` | `village_career.js`, `work_ledger_system.js`, `life_record.js`, `npc_lives.js`, `generated_people.js`, `absorb_d/fort.js`, `absorb_e1/pacing.js`, `absorb_e2/durability.js`, `absorb_c2/local_life.js`, `mixture_state.js`, `content_packs.js` |
| Absorbed Proto23 state | `p23_*`, `p23Encounter*`, `field_familiarity_p07`, `absorb_repeat_search`, `combatOptions` | `src/absorb_p23/` host joins, validated in the first lines of `validateSaveEnvelope` |
| Continuation | `continuation` (lives, retention, baggage, laws, challenges) | `src/continuation_state.js` and `continuation_*.js` |
| Envelope metadata | `saved_at`, `last_rewarded_export`, `fork_schema`, `retired_content` | `src/save_files.js`, `src/save_compatibility.js` |

**B. Registry slices.** A domain registered through `registerDomain` writes
`envelope[domain.id]` when it declares a `save` hook that returns a defined value
(`src/domain_registry.js`). Counting `registerDomain(` call sites gives 75; about 41
declare a save hook (heuristic count, 2026-10-30). Three kinds exist:

1. **Slice owners** with `save` (and usually `validate` and `migrate`): for example `cheats`, `defeat`, `pledges`, `loadouts`, `skillRecords`, `life_events`, `returnDigest`, `beatLedger`, `economy_standing`, `aging_contact`, `companions`, `home_layout`, `memory`.
2. **Envelope validators** with `validate` and no slice, because their state lives under `expansion`: for example `dojoTower`, `drainage_site`, `gear_workshop`, `material_lineage`, `gu_care`, `lotm_envelope`.
3. **Projection or panel domains** with no persistence: for example `statistics`, `today`, `reports_dock`, `world_packs`.

Enumerate the live set with `domainRegistry.list()`; no checked-in list of slice keys exists (gap G6).

**C. Browser storage outside the envelope** (not in Export unless noted):

| Key | Holds | Owner |
|---|---|---|
| `yairpg:p23:native-authority:1:<release>` | enrolled authority record and its undo journal | `native_authority.js` |
| `heir request`, `structured independent request` | one-shot request crossing a reload during succession | `src/main.js` |
| `<save key>:ended-life:<instanceId>` | archive of an ended structured life | `src/structured_life_runtime.js` |
| `yairpg.display.v1`, `yairpg.profile.v1`, `yairpg.known-item-hotkeys.v1`, `yairpg.presentation.*`, `yairpg.colors.v1`, `yairpg.craft-detail.v1`, `yairpg.opening.v1`, notice-seen keys | per-browser presentation and profile preferences | `display_settings.js`, `achievements.js`, `workspace_layout.js` and neighbours |

`display_preferences` is copied into the envelope on save, so Export carries it; the other
presentation keys stay in the browser. Proposal: treat these as per-browser by default and
list any that should travel with a life in the ledger when they change.

## 2. Migrations

The envelope version is fixed (`v0.6`, `fork_schema` 1). Compatibility is carried by
**per-section schemas and migrate-on-load functions**, not by an envelope version ladder.
Imports run the same functions on a clone before any write.

| Section | From to | What changes | Function |
|---|---|---|---|
| Envelope | upstream before v0.6 to v0.6 | Old biography moves into `character.bio`; `is_hero_created` set; legacy survey-kit counter becomes stock of "Prepared survey kit" once | `prepareV06Save`, `src/save_migration.js` |
| Envelope | prototype to fork foundation | Retired ids (Jade Hollow, Dewleaf, Dewleaf tea, Meridian pellet) and the `cultivation` key move into `retired_content`; a character in Jade Hollow returns to Village | `prepareFoundationSave`, `retainRetiredContent`, `src/save_compatibility.js` |
| Envelope | v0.3.5, v0.4.4, v0.6 upstream gates | Economy and quality reworks, component saves | `compare_game_version` branches in `load()` of `src/main.js` |
| Export file | Latin-1 to UTF-8 | Marker `YAIR-UTF8-1:`; unmarked files from v0.6 on get a second UTF-8 pass | `decodeSaveFile` |
| `expansion` | schema 1, 2, 3, 4 to 5 | Adds `chronicle: null`, `simulation: null`, per-actor `sources` and `techniques`; no retroactive rewards | `migrateExpansionState`, `src/expansion_engine.js` |
| `expansion` | 5 to 6, 7, 8, and 9, 10, 11 | Selected by opt-in (default 5): 6 destination, backlog, Ink, work plans; 7 nested campaign; 8 continued life; 9 reference gameplay; 10 book-world Paradise; 11 audit remainder. An older reader rejects a newer schema | `FEATURE_ENGINE_SCHEMA`, `NESTED_ENGINE_SCHEMA`, `CONTINUED_LIFE_ENGINE_SCHEMA` and the 9 to 11 constants in `expansion_engine.js` and its state files |
| `expansion.simulation` | 1 to 2 to 3 (to 5) | Opt-in schema 2 for encounters and pursuits; schema 3 for situation and provenance; older readers reject | `src/simulation_*.js`, records in section 3 |
| `expansion` | cooling-refinement situation | Rewrites saved situation shape on load | `migrateCoolingRefinementSituation`, `src/cooling_refinement_facts.js` |
| `village_career` | 1 to 2 to 3 to 4 | Adds `watchcraft` study, `recruit`, tutor and teaching fields; grants no method | `migrateVillageCareer`, `src/village_career.js` |
| `work_ledger` | 1 to 2 | Adds frozen `rules`, `acquired`, `settings`, `receipts` from original terms | `migrateWorkLedger`, `src/work_ledger_system.js` |
| `absorb_local_life` | 1, 2, 3 | Normalizes searches and runner meal accounts | `normalizeLocalLife`, `src/absorb_c2/local_life.js` |
| `fort_supply` | 1 | Validates, no rewrite; absent value creates a fresh ledger | `migrateFortSupply`, `src/absorb_d/fort.js` |
| `pacing_e1` | 1 | Normalizes with defaults | `normalizePacing`, `src/absorb_e1/pacing.js` |
| `life_record` | absent | Created at the loaded date, no invented past | `migrateLifeRecord`, `src/life_record.js` |
| `memory` | 1 to 2 | Schema 1 without `claims` still loads | `src/person_memory.js` (`MEMORY_SCHEMA = 2`) |
| LOTM places | alias to current id | Renames place ids in locations, availabilities, continuation snapshots and people | `migrateLotmPlaces`, `src/book_world_lotm_envelope.js` |
| Registry slices | absent to fresh | Many domains pass `slice == null ? fresh() : validated clone`; absence means the default state | each domain's `migrate` hook, run by `domainRegistry.load` |
| Pack sections | revision chain | One step per (pack, from revision), retired storage, dormant packs kept verbatim | `src/world_pack_save.js`; **no importer outside `world_pack_*`, so nothing runs this on a real save** (gap G2) |

## 3. Compatibility-decisions ledger

One row per decision. **Authority:** `W` is Weibao's own words (quoted in USER_VISION);
`A` is an agent record (checkpoint, commit body or task record), which is a decision the lane
made under AR6 and not new product direction; `P` is a proposal or rule that is not yet code.
Sourcing: commit bodies found with `git log -i --grep` on migration, save, compat, additive,
absent-slice, schema and `-S` on the validator and writer symbols, plus a bounded grep for
"Compatibility" lines in `docs/gm/` and the dated considerations files. The log is a sample
of what those searches surfaced, not a proof that every persistence change has a row (gap G5).

| Date | Feature | Decision | Auth | Source |
|---|---|---|---|---|
| 2026-10-01 | v0.6 foundation port, fork expeditions | Migrate on load: bio and survey kits move once (`prepareV06Save`); unknown sources and native effect refs reject the load; new saves need the updated fork | A | commit `935385d9a`; [PLAYTEST](PLAYTEST.md) compatibility note |
| 2026-10-01 | Retired prototype content | No migration of meaning: retired data is kept opaque in `retired_content` and written back unchanged | A | commit `62f100f99`; [project log](gm/PROJECT_LOG.md) "src/save_compatibility.js moves retired prototype fields" |
| 2026-10 (undated) | Expansion schemas 1 to 4 | Migrate additively to 5 with `chronicle: null`; frozen jobs, RNG, sources and dormant records preserved; no enrollment, no retroactive reward | A | [project log](gm/PROJECT_LOG.md) "schemas1-4 migrate to5" |
| 2026-10-06 | Simulation schema 2 (encounters, pursuits) | Ordinary schema 5 / simulation 1 loads unchanged; using the optional content opts that simulation in; older builds reject it | A | [recovered engine authoring](gm/book-world-completion-2026-10-06/RECOVERED_ENGINE_AUTHORING.md), [project log](gm/PROJECT_LOG.md) |
| 2026-10-06 | Care worlds, schemas 5 to 11 | Optional additive facts and jobs; absence inert; new ids need the matching fork | A | [care worlds delivery](gm/care-worlds-2026-10-06/DELIVERY.md) |
| 2026-10-07 | Feature wave, expansion 6, 7, 8 | Opt-in by first use (destination, nested campaign, continued life); unenrolled saves keep 5; older readers reject newer schemas | A | [feature-wave delivery](gm/feature-wave/features/DELIVERY.md), [continued-life delivery](gm/feature-wave/features/nested-campaign/continued-life/DELIVERY.md) |
| 2026-10-01 | Export encoding | New `YAIR-UTF8-1:` marker; unmarked Latin-1 files still import | A | commit `935385d9a` (`src/save_files.js`) |
| 2026-10-12 | Work ledger | Optional `work_ledger` migrates 1 to 2; a missing field starts the original unanswered offer, no invented entitlement | A | [customization C3 return](gm/coordination/customization-c3-return-2026-10-12.md) |
| 2026-10-13 | Cheat cards (`cheats`) | New optional field; old saves load an empty default and the next save writes schema 1; an invalid present value is rejected, not erased | A | commit `057d6f50e`; [C0 report](gm/dispatch/cheat-status-window-2026-10-13/C0_REPORT.md) |
| 2026-10-14 | Durable write skip (D3) | A write that differs just in `saved_at` and `total_playtime` may be skipped; a crash can lose those two counters and no game state (default, per the D3 comment) | A | commit `8b3290763`; `src/save_files.js` comment "Compatibility decision D3" |
| 2026-10-14 | Core foundations A1-C1 | Keep accepting every currently supported valid legacy envelope; migrate clones additively then validate; keep original bytes on failure; reject unknown future versions rather than normalize them away | A | [A1 plan](gm/dispatch/core-foundations-2026-10-14/a1/PLAN.md) |
| 2026-10-15 | Continuation (one self across journeys) | Versioned single-authority topology, explicit legacy adoption; schema is a proposal until built | P | [continuation coverage and compatibility](gm/CONTINUATION_STATE_COVERAGE_AND_COMPATIBILITY_2026-10-15.md), [USER_VISION](USER_VISION.md#concrete-continuation-coverage-and-compatibility-request-2026-10-15) |
| 2026-10-15 | Saved UI layouts | UI reorganization keeps ids, layouts, pins and collapse states unless a written compatibility decision says otherwise | P | [UR17](UI_RULES.md) |
| 2026-10-14 | Native backup authority (P00 step 5) | Single-write enrolled authority and undo journal in separate keys outside the envelope | A | commit `916617cb7`; `native_authority.js` |
| 2026-10-17 | **Old-save compatibility** | "old save compatibility is no worry for now": work may reset or drop old state and says so; new state still round-trips Save, reload, Export and Import. Supersedes MR33 and AGENTS' migration wording for now | **W** | [USER_VISION](USER_VISION.md#old-save-compatibility-deferred-2026-10-17), [AR6](ARCHITECTURE_RULES.md), [MR33 override](MAKING_RULES.md) |
| 2026-10-18 | **Content-id retirement** | "G5 we dont need to worry about safe migration": retiring, splitting or merging a content id needs no migration; a save naming an unknown id drops it with a log line | **W** | [USER_VISION](USER_VISION.md#content-id-retirement-and-frozen-world-idle-2026-10-18) |
| 2026-10-18 | Defeat record | No slice in old saves loads an empty record; not seeded from `total_deaths`; no migration of existing fields | A | [combat considerations](COMBAT_AND_CONFLICT_CONSIDERATIONS_2026-10-18.md) |
| 2026-10-18 | Economy ledger | No save change: the ledger is session memory, a reload starts a new window | A | [economy considerations](ECONOMY_AND_TRADE_CONSIDERATIONS_2026-10-18.md) |
| 2026-10-24 | Book-world places (LOTM) | Rekey old place ids on load; refuse a save that holds both old and new key | A | commit `e3c50c0c3`; `migrateLotmPlaces` |
| 2026-10-25 | HP world lives | Additive content with its own ids; no change to existing save shapes; exact content hashes guard new HP saves | A | [HP world checkpoint](gm/dispatch/hp-world-2026-10-25/CHECKPOINT.md) |
| 2026-10-25 | LOTM Q3 | `state.lotm` stays schema 1; new enrollment adds the entry knowledge key | A | [LOTM Q3 checkpoint](gm/dispatch/lotm-q3-2026-10-25/CHECKPOINT.md) |
| 2026-10-25 | Tool crack, per-copy wear | Optional schema-1 per-copy fields; absent means no crack | A | [tool-crack receipt](gm/dispatch/tool-crack-2026-10-25/RECEIPT.md) |
| 2026-10-26 | Entry changes to saved worlds | A change to a start record, pack identity or carry rule that saves hold needs a migration or an explicit compatibility decision | P | [WER16](WORLD_ENTRY_RULES.md) |
| 2026-10-27 | `beatLedger` | New slice; absent loads empty; no migration | A | commit `352e91ddf` |
| 2026-10-27 | Heir tie (CAE-E2) | Additive predecessor life id beside the frozen name; old saves render unchanged | A | commit `3ed02a5bb` |
| 2026-10-27 | Trader stock `worldSeed` (PL-E1) | Opt-in keyed path; default path unchanged | A | commit `5f4b73e71` |
| 2026-10-30 | Person memory schema 2 | Schema 1 without `claims` still loads; new fields are optional | A | commits `b626a8c2c` (leaf, 2026-10-29), `a25844ea9`; `src/person_memory.js` |
| 2026-10-30 | `returnDigest` marker slice | New slice `{schema 1, seenAt}`; absent baselines at the save's own clock; a future marker clamps; pre-slice save exercised | A | commit `a21533b62` |
| 2026-10-30 | Cheat core round 2 | Derived presentation, no saved field changed | A | commit `812aef9b6` |
| not dated | Book pack revisions and save deltas | Per-pack sections with revision chain; a proposal in the lead-life systems design, code is tested but unwired | P | LSD142-LSD143 in [RULES_INDEX](RULES_INDEX.md) router; `src/world_pack_save.js` |

Reading the ledger: a row with Auth `A` restates what that lane did; it does not widen the
2026-10-17 and 2026-10-18 decisions and is not a promise to future lanes. The default new rows
should follow is in section 5.

## 4. What is promised right now

Restating existing decisions, with their dials:

1. **Old saves are not guaranteed.** Default: a lane may reset or drop old state and records
   that choice (2026-10-17, `W`). Dial: the lane may still choose to preserve, and most
   additive slices above do, at no extra cost. Reason: Weibao is the only player and wants
   speed. Unknown content ids drop with a log line (2026-10-18, `W`).
2. **New state must survive a round trip.** Default: Save, reload, Export and literal Import
   all restore it (FLR5 in [GROUND_RULES](GROUND_RULES.md), AR6, AR10).
3. **Import must not damage the stored save.** Default: validate and preflight before the
   one write; a failure leaves the old bytes (`importSaveFile`; A1-C1).
4. **Newer saves are refused by older game versions** and by older readers of opt-in schemas.
5. **User saves stay private and untouched** by agents (AGENTS Safety). Fixtures are
   synthetic; see `tests/fixtures/`.

## 5. How to change persistence (checklist, proposal)

Each step cites an existing check. Defaults can change with a reason in the task record.

1. **Pick the home.** Default: a registry slice with its own key (AR2, AR6; S12 steps 1 to 3).
   Use an envelope validator when the state belongs in `expansion` (AR3, one authority).
   Derive allowed values from the definition rather than freezing a whole-save schema.
2. **Write the compatibility line** in the task record: one of *no save change*, *new optional
   key, absent loads <default>*, *migration X (from, to)*, or *old state reset or dropped
   (2026-10-17)*. Add a row to section 3 in the same change.
3. **Absent must be inert.** A missing slice should create no reward, enrollment or
   invented history (MR33 as a default, qualified by 2026-10-17).
4. **Focused tests:** `tests/save_files.test.js` (envelope, encode, import, size),
   `tests/save_compatibility.test.js` (retirement; also `npm run check:rule-behavior -- saves`),
   `tests/v06_migration.test.js`, `tests/durable_save_writer.test.js`,
   `tests/native_save_fixtures.test.js`, and the slice's own test. Add a case for an old or
   absent slice and for a bad value rejected before the loader.
5. **Browser floor (FLR5):** fresh life, Save, reload, Export, literal Import on a rebuilt
   bundle at a fresh origin. The scripted route is `scripts/floor/run_floor.cjs`;
   `scripts/storage_browser.cjs` covers storage failure.
6. **Gates:** `npm run build`, `npm test`, `npm run check:arch` at the stages AD36 names;
   `npm run check:docs` for this file; `npm run check:rules` when the index changes.
7. **Registration cost:** a new validator line in `save_files.js` follows AR1 (net zero);
   prefer the registry, which adds none.

## 6. Open gaps

Ranked by how likely they are to hurt a real save or mislead a lane. All are findings from
reading code on 2026-10-30; none is a decision.

| Code | Risk | Detail | Suggested next step (proposal) |
|---|---|---|---|
| G1 | **The 2026-10-18 promise has no general implementation** | `W` says an unknown content id is dropped with a log line. `prepareFoundationSave` retires a fixed four-id list (`RETIRED_IDS`). An unknown item key reaches `nativeGetItemFromKey`/`getItem` and the import preflight, which refuses the whole save (see the "unknown book or stance" case in `tests/save_files.test.js`). Not exercised end to end (inference) | Decide in one line whether the promise means "drop and log" (then build it) or "refuse with a clear message" (then amend the ledger row with Weibao's yes). Test one retired item, recipe and location |
| G2 | **World packs: loader yes, save no** | `src/world_pack_save.js` (sections, revision chain, dormant packs) has no importer outside `world_pack_*` and the registered `world_packs` domain has no `save`. A pack revision bump cannot reach any real save, so the first pack that holds per-life state hits an undesigned path (S8, LSD142-LSD143) | Do not store per-life pack state in `expansion` ad hoc; wire the section under one key with a pack-fingerprint check when the first book world needs it (WV8 in the [playability plan](MASTER_PLAYABILITY_PLAN_2026-10-25.md)) |
| G3 | **Exact-field validators refuse whole saves** | Many world validators demand exact key sets and matching `definitionRevision` or `sourceHash` (S12 gotchas), so adding one field or bumping a revision turns every older save into an import failure, even where the 2026-10-17 policy intends only "may drop" | Prefer an optional key with a default; when a bump is unavoidable, state "refuses older saves" in the ledger row |
| G4 | **`fork_schema` 2 passes validation but nothing writes it** | `validateSaveEnvelope` lets 1 and 2 through (checked by running it on a fixture); `create_save` writes 1; no commit introduced a writer for 2. `tests/v06_migration.test.js` lists `fork_schema = 2` among saves expected to be rejected and still passes (its preflight stub also throws), so the test does not pin the validator | Decide whether 2 is reserved or stale; pin it with a direct validator assertion |
| G5 | **Ledger completeness is unproven** | No check ties a new top-level key or slice to a ledger row. Rows above come from searches, so slices added without a message or doc line are missing | Proposal: a test that lists `domainRegistry.list()` slice keys and `create_save` direct keys, compared with a checked-in key list (G6) |
| G6 | **No save-key registry** | The top-level key list exists as code in `create_save`, `validateSaveEnvelope` and 75 `registerDomain` calls. A key can be written with no reader, or read with no writer, and nothing flags it. The writer/reader scan of the 82 direct keys found no key written without a reader; `fork_schema` is read by its validator alone | Same list as G5 |
| G7 | Presentation keys outside the envelope | `yairpg.*` preference keys do not travel with Export (section 1a C). A player importing on a new browser loses layout, colors and hotkeys | Low priority; record any key that should travel |
| G8 | Rule text still says "migration required" | AGENTS Safety, MR33 and AR6 read as strict while the 2026-10-17 decision relaxes them; lanes cite whichever they met first | This file is the reconciliation; cite section 4 |

## 7. Links

- Code map: [S12](systems/PROGRESSION_WORLD_STATE.md#s12-persistence); world packs [S8](systems/PROGRESSION_WORLD_STATE.md).
- Historical engineering review (proposed E1 to E10, A1 to A4): [ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11](ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md).
- Rules: [AR6, AR10](ARCHITECTURE_RULES.md), [MR33](MAKING_RULES.md), [FLR5](GROUND_RULES.md), router row "Saves and persistence" in [RULES_INDEX](RULES_INDEX.md).
