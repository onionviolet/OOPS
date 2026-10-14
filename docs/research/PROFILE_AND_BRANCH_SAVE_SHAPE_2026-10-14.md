# One profile, many branches: save-shape audit

2026-10-14. Read-only save-shape lane. **INFERRED proposal:** wrap today's complete save as the first branch, with a separately versioned profile envelope. Keep the existing branch loader and gameplay payload initially. Do not convert the existing character into a new start or try to reconstruct its inventory and commitments from canon changes.

**VERIFIED scope:** only this report and the lane checkpoint were written. No production source, tests, bundle, real saves, git index or commits were changed by this lane. Evidence labels throughout: VERIFIED means source inspected or a named check run; INFERRED means proposed behavior, deduction or untested expectation. Design-owner text is VERIFIED as a recorded consideration, not as implemented or accepted gameplay.

## Authority and limits

**VERIFIED:** persistence requires migration or an explicit compatibility decision, with private saves untouched (`AGENTS.md:78-80`). SV1/SV7 specify a profile whose first branch retains today's play; SV5 requires retaining the previous save until the new format loads and saves cleanly (`docs/INTRO_FLOW_CONSIDERATIONS_2026-10-13.md:1232-1242`). Round 17 commissions this audit without code changes (`docs/INTRO_FLOW_CONSIDERATIONS_2026-10-13.md:1318-1322`). TB7 separates branch possessions/relationships from player unlocks; BR1/BR6/BR11/BR12 define dormancy, one offline recipient and pinned content (`docs/INTRO_FLOW_CONSIDERATIONS_2026-10-13.md:863-871,933-945`). MP1/MP5/MP9/MP10 describe delayed player-layer presentation, carryover, preferences and active-life policy (`docs/INTRO_FLOW_CONSIDERATIONS_2026-10-13.md:1221-1230`). These remain considerations, not a migration already selected.

**VERIFIED:** shared direction preserves deeper systems, distinct worlds and separate prestige/travel (`PROJECT.md:221-230`); desktop/laptop is primary (`PROJECT.md:43-47`). The engineering review asks for independent identities/revisions, recovery, atomic consequences, bounded semantic history and measured size (`docs/ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md:35-43`). Historical v0.6 verification is a prior receipt, not this lane's runtime proof (`docs/V06_MIGRATION.md:11-19`).

**VERIFIED:** the derived-snapshots GOAL calls its module a pure prototype, not playable gameplay (`docs/gm/dispatch/derived-snapshots-2026-10-14/GOAL.md:9-10,14-43`). Canon-events COMMON supplies timed overrides and the no-staging writing contract (`docs/gm/dispatch/canon-events-2026-10-14/COMMON.md:9-12,22-29`). At inspection there was no derived-snapshots `COMMON.md` and no canon-events `GOAL.md`; the two present files and start-sources COMMON supplied their available contracts. The latter limits writers to named outputs (`docs/gm/dispatch/start-sources-2026-10-14/COMMON.md:12-15,28-33`).

## 1. Today's save

### F1. Storage keys and writer

**VERIFIED:** primary keys are `save data` and `dev save data`; timed backup keys are `backup save` and `dev backup save`. `heir request` holds a small succession request across reload (`src/main.js:371-384`). `skip_live_import` prevents development fallback after reset; development otherwise falls back to the live save when its own save is absent (`src/main.js:7075-7088,7113-7118,8114-8118`). Backup and other-release restoration use the file-import validation route (`src/main.js:7098-7107`). These are single live/development slots, not a branch index.

**VERIFIED:** a Web Lock is named `yairpg-save:<primary key>` and owned for the document lifetime; absent Locks support or a competing writer makes the tab read-only (`src/main.js:588-597`). Manual and periodic backup writes use the same serializer/storage adapter (`src/main.js:5255-5274,7631-7650`). Other same-origin keys consume the shared capacity guard: display settings `yairpg.display.v1`, color `yairpg.colors.v1`, craft placement `yairpg.craft-detail.v1`, workspace `yairpg.workspace.v1.desktop`/`.narrow` and authoring suffix `.authoring` (`src/display_settings.js:1-6`; `src/workspace_layout.js:33,45,81-85,383`; `src/workspace_state.js:1,52`). These host preferences are outside today's exported gameplay save.

### F2. Top-level payload and versions

**VERIFIED:** `create_save` returns JSON text, refuses unavailable writer/loading states, and rebuilds a named-field object rather than serializing every runtime global (`src/main.js:4935-4939,5197-5202`). The inventory below is the explicit serializer plus its snapshot adapters. Optional rows need not exist in a fresh save.

| Label | Top-level fields | File:line evidence |
| --- | --- | --- |
| VERIFIED | `game version`, `current time`, `language`, `saved_at`; `total_playtime`, `total_deaths`, `total_crafting_attempts`, `total_crafting_successes`, `total_kills`, `total_crits_done`, `total_crits_taken`, `total_hits_done`, `total_hits_taken`, `strongest_hit`, `gathered_materials`, `global_flags`, `last_rewarded_export` | `src/main.js:4940-4956` |
| VERIFIED | `character` contains name, titles, bio, equipment, money, XP total, health/stamina deficits and reputation; `rain_counter`, `cold_status_counters`, `are_finished_quests_hidden`, `favourite_consumables`, `favourite_items`, `skill_category_order`, `levels` | `src/main.js:4957-5002` |
| VERIFIED | `current location`, `locations`, `favourite_locations`, optional `current_activity`, `availabilities`, `npc_equipment`, `npcs`, `inventories`, `books`, `quests` | `src/main.js:5004-5141` |
| VERIFIED | `is_reading`, `is_sleeping`, `active_effects`, `enemy_killcount`, `item_log`, `loot_sold_count`, `last_combat_location`, `last_location_with_bed`, `options`, `stances`, `current_stance`, `selected_stance`, `faved_stances`, `message_filters`, `skill_list_state` | `src/main.js:5143-5176` |
| VERIFIED | `equipment_durability`, `pacing_e1`, `fort_supply`, `absorb_local_life`, `cheats`, `content_packs`, `village_career`, `work_ledger`, `customization`, `fork_schema`, `life_record`, optional `npc_lives`, `expansion`, optional `retired_content` | `src/main.js:5178-5197`; `src/save_compatibility.js:56-57` |
| VERIFIED | Conditional native projections for Tidemark, nested campaign, Paradise, Mother of Learning, Proto23 and causal stories; preserve the full adapter output, not merely expansion facts | `src/main.js:5191-5196`; domain examples `src/feature_expansion_destination.js:17`, `src/feature_expansion_nested_content.js:5`, `src/book_world_paradise_ids.js:3`, `src/book_world_mol_ids.js:5` |

**VERIFIED:** current game version is `v0.6` (`src/game_version.js:3`); serializer writes `fork_schema:1`, while validator admits absent, 1 or 2 (`src/main.js:5187`; `src/save_files.js:99`). Game-version validation rejects newer versions and distinguishes old registry layouts from v0.6 component layouts (`src/save_files.js:58-66,100-104`). Fork schema is not the expansion schema. Fresh expansion starts at schema 5, with sequence/clock/RNG, campaign/journey/world/actor/scenario domains, pending work, opportunities, history, checkpoints and optional chronicle/simulation (`src/expansion_engine.js:59-79`). Higher optional domains have distinct reader admissions, including imported schema constants; do not infer compatibility solely from `fork_schema:1` (`src/expansion_engine.js:137-165,187-188`).

**VERIFIED:** `life_record` schema 1 is a lossy biography, with at most 64 recent entries, 200 year summaries and older counts. It is explicitly not authority for rewards, relationships or quests. Missing records begin at the loaded date without inventing a past (`src/life_record.js:1-26,40-47,65-77`). `lifeSaveStorage` stages biography and NPC-year observations, performs a guarded write, then publishes live observations and related panels (`src/main.js:414-438`). A branch wrapper must sit below that staging or reproduce its order, rather than feed the outer profile to this adapter as if it were a native save. **INFERRED requirement**, grounded in its direct `save['current time']` access.

### F3. Existing migration, import/export and dormancy

**VERIFIED load order:** require exact structured receipt/selection content; clone unavailable structured save for recovery; sync authored content; prepare optional-pack save; validate envelope; normalize local owners; preserve retired content; prepare v0.6 biography/kits; restore life/NPC/expansion state; then restore native registries/calendar (`src/main.js:5284-5338`). Expansion absence creates its default state; schemas 1-4 migrate additively, then cooling-refinement migration/validation runs (`src/expansion_engine.js:256-270`). v0.6 adaptation preserves older personal biography and prevents repeat creation, and transfers legacy kit counters once (`src/save_migration.js:3-25`). Existing loader branches also handle old flags, economy and item-quality scaling (`src/main.js:5334-5337,5427,5639`). This is current compatibility behavior, not byte-identical runtime loading for every historical format.

**VERIFIED:** retired prototype data is copied to opaque `{schema:1,entries:[{path,value}]}`; retired locations are mapped to Village for active play and retained as entries (`src/save_compatibility.js:9-57`). Simple unavailable packs park known locations/availability/inventory/world data, freeze their saved job, and may return the active character to Village; matching identity restores parked native data (`src/content_packs.js:137-186`). Structured beginnings require exact revision/hash/start/instance bindings. Missing or changed content suspends the whole saved character and offers preserved export rather than a fresh fallback (`src/structured_pack_state.js:4-34`; `src/main.js:5286-5287,8145-8151,5230`). Structurally malformed/future-schema content can still be rejected; today's code does not admit all unknown data as dormant.

**VERIFIED import:** text file -> marked UTF-8 base64, old unmarked Latin-1, or upstream v0.6 unmarked UTF-8 decoding -> JSON -> `validateSaveEnvelope` -> disposable actual-loader preflight -> guarded storage write -> page reload (`src/save_files.js:158-191`; `src/main.js:7056-7068`). Preflight uses a same-origin hidden iframe/token, checks actual loader warnings/errors and times out after 60 seconds; probe startup skips loading another saved character (`src/import_probe.js:2-56`; `src/main.js:8115-8116`). Local load instead parses the selected stored JSON and invokes `load`, with saving blocked on loader warnings/failure (`src/main.js:7075-7095,7033-7044`).

**VERIFIED export:** `YAIR-UTF8-1:` plus base64 UTF-8 JSON; no compression/encryption is applied (`src/save_files.js:176-182`). Normal export can grant an inspiration reward, update its wall timestamp and attempt a storage write; a suspended structured save bypasses that reward path (`src/main.js:5228-5244`). Backup-first migration must therefore copy exact stored bytes through a recovery route, not call the gameplay export action. **INFERRED requirement.**

**VERIFIED transaction boundary:** expansion publication stages copied native money/calendar/effects/items/ownership and patches, validates, then calls storage; live publication follows successful persistence (`src/expansion_persistence.js:5-50`; `src/main.js:921-922`). This is useful for one atomic outer wrapper commit, not proof that multiple localStorage keys are atomic together.

### F4. Fresh save size

**VERIFIED measurement, this lane:** actual `create_save` from an in-memory build of current source, using the existing `tests/helpers/cheat_game.mjs:8-39` opening helper at 1366x768, cheat choice `none`. The temporary Node script read that helper into memory, resolved its imports to their existing paths and injected `context.addInitScript` before navigation. It replaced `window.localStorage` with a Map-backed Storage-shaped object. Browser persistent storage and user origins were not accessed. No test/source/bundle file was written. After opening/creation, serializer and encoder were called directly, not the reward-bearing export action.

| Label | Measurement | Value |
| --- | --- | --- |
| VERIFIED | JSON UTF-8 bytes | 54,265 |
| VERIFIED | Estimated value-only localStorage UTF-16 bytes | 108,522 |
| VERIFIED | Marked encoded export ASCII bytes | 72,368 |
| VERIFIED | Fresh serialized top-level fields | 61 |
| VERIFIED | Game / fork / expansion schema; location; expansion clock | `v0.6` / `1` / `5`; `Village`; `0` |
| VERIFIED | Captured page errors | 0 |

**VERIFIED:** measurements use `measureSaveSize`, where storage estimate is twice JS string length, and `encodeSaveFile`; the guard budgets 4 MiB across the origin, including key names and other values (`src/save_files.js:194-216`). The measured value excludes key bytes, backups and host settings. **INFERRED limitation:** one fresh opening is not a campaign or multi-branch size target. Names, timestamps, initialization and optional installed content can change size. The Storage substitution establishes serializer size, not persistence, quota behavior, native file import or real reload acceptance. Full source-built browser persistence remains open.

## 2. Proposed profile shape

**INFERRED P1: additive envelope, illustrative fields, not a selected schema.** Separate `profileSchema`/`branchSchema` from the native `game version`, `fork_schema`, expansion and pack schemas. Version pins identify definitions; they do not bundle missing code or prove that an older revision can execute in a newer build.

```js
{
  kind: 'yairpg-profile', profileSchema: 1, profileId: '<stable-id>',
  generation: 1,
  player: {
    preferences: {}, knownWorlds: [], openedStarts: [],
    libraryKnowledge: [], cheatResearch: {}, lifeRefs: []
  },
  branchIndex: [{
    id: '<branch-id>', status: 'active', parentId: null, forkPoint: null,
    label: '<knowledge-safe-name>', note: '', lifeIds: ['<life-id>'],
    payloadRef: '<branch-id>', estimatedBytes: 0
  }],
  active: {branchId: '<branch-id>', lifeId: '<life-id>'},
  branches: {
    '<branch-id>': {
      branchSchema: 1,
      baseRef: {kind: 'legacy-native', worldId: 'base.frontier', anchorId: null},
      pins: {nativeBuild: '<verified-build-id>', canonRevision: null, packs: []},
      changes: [],
      live: {format: 'native-envelope', save: '<complete current save object>'},
      settings: {}, clocks: {absence: 'legacy', offlineCursor: null},
      derivationSummary: null
    }
  },
  migration: {sourceDigest: '<digest>', sourceFormat: 'single-save', fromKey: '<key>'}
}
```

**INFERRED P2: player ownership.** Only newly declared cross-life unlocks, known starts/worlds, library knowledge, cheat research and player preferences belong here (TB7/MP5/MP9). Start the legacy player's collections empty and refer to its existing life record; do not infer unlocks from biography text. Existing `cheats`, titles, wealth, inventories, people, relationships, quests, work-ledger rules and receipts stay inside branch `live.save` initially. A held cheat is not automatically player research. Profile life IDs qualify references without rewriting inner legacy actor/item IDs; several lives in one branch require a later explicit ownership/turn policy.

**INFERRED P3: branch ownership and compatibility.** The first branch keeps the entire current native envelope, including current location, all nested instances, retired/dormant data, RNG, paid pending work and native projections. A pre-branch vanilla Village save remains there; an existing save already elsewhere keeps its actual current location. SV7 is not permission to teleport such saves to Village. The legacy branch has no authored canon anchor, so `changes:[]` means no new canon derivation history, not an undisturbed world. Its complete saved state is the authority. The wrapper itself rerolls nothing and seeds no new world. Missing legacy expansion continues only through today's existing compatibility policy.

**VERIFIED model; INFERRED P4 integration:** worktree `/Users/weiwei/.codex/worktrees/start-records/yet-another-idle-rpg/src/anchor_snapshots.js:13-25,45-93` accepts timed `changes` with `set`, `cancel`, `insert`, `cause`, and old `divergeAt`/`overrides`. Canon runs before same-time changes, then inserted events; failed requirements, substitutions and fixed-event resistance are recorded. Provenance and revision checks exist (`anchor_snapshots.js:95-104` in that same worktree). For future authored branches, use `baseRef:{worldId,baseRevision,eventRevision,anchorId,at}` plus exact revision/hash pins and that changes list. Wrap change causes with life/action IDs. Keep native live state alongside it; these pure fact operations do not serialize native inventory/custody, queues, stock, body or rewards. Cache a summary only as a check; report mismatch and preserve originals instead of silently replacing live state (SV4/DV12/OV12).

**INFERRED P5: active pointer and demand loading.** One committed root includes active branch/life, index and payloads. Native adapters receive only the active `live.save`. Resting branches have no timers or active native registries. An active pointer targeting dormant content yields recovery, not a silent replacement branch. For the one-branch first step, an inline root is simplest and fits a single guarded write. It is not full SV2 on-demand storage: parsing inline JSON materializes every payload. Later, immutable branch blobs with an atomic root manifest or an IndexedDB transaction can provide real demand loading after measurement. Do not split the pointer, rewards and payload into independent mutable keys prematurely.

## 3. Backup-first migration and import order

All M steps are **INFERRED proposals**. They deliberately retain raw source bytes separately from any loader normalization. “Unchanged” means no new gameplay/reset/reroll caused by the wrapper; current historical compatibility transformations still apply as F3 documents.

| Step | Exact order and failure behavior |
| --- | --- |
| M1 | Choose live/dev namespace under a writer lease covering legacy and profile writers. Pause autosave/gameplay publication during preparation. Read selected legacy bytes once, without removing/changing the key. Establish source digest and intended migration ID in memory. An already matching profile migration is resumed, not repeated into another branch. |
| M2 | Secure an immutable, exact-byte pre-migration recovery copy; verify equality/readback or verify a deliberate file-backup route. Original primary and existing hourly backup remain untouched. Capacity calculation includes source, recovery copy, candidate and other keys. If space or backup verification fails, stop migration with legacy play available; never delete another save to make room. Do not use `save_to_file` for this copy because it can reward/mutate play. |
| M3 | Parse/validate a copy, preserving raw source. Retain current legacy/v0.6/retirement transformations through the existing loader and inspect pack/revision dependencies. Reject corrupt unsupported schemas without changing storage. For a valid but unavailable exact structured pack, classify the branch dormant and retain opaque raw payload; do not initialize a new start. Unknown schemas that cannot be structurally admitted remain preserved recovery inputs, not executable dormant payloads. |
| M4 | Create one stable profile/branch/life identity; leave player unlocks empty. Store complete original parsed native envelope as branch payload; normalizers run only on a cloned executable view. Use nullable legacy canon anchor and actual stored revision/pack evidence, never invented historical pins. Record missing pin information explicitly. Outer wrapping alone must unwrap to the same parsed object. |
| M5 | Validate outer structure, unique IDs/references, versions and size. Preflight the active executable copy with the actual loader in isolation. Loader warnings block activation. Dormant import uses a separately designed structural-preservation path, since today's `importSaveFile` insists on real-loader success. Preserve all bytes on failure; do not weaken native validation to force admission. |
| M6 | Write candidate to a new namespaced root, e.g. `yairpg.profile.v1.live` or `.dev`, using a guarded single-key write. The root includes pointer, generation, index and complete payload. Read back, validate and unwrap; compare source digest and protected gameplay fields. A candidate is not yet an active profile just because its write succeeded. |
| M7 | Reload candidate via the profile adapter on a fresh synthetic test origin, then perform one ordinary staged save and reload again. Only after this loads and saves cleanly mark the same root generation active with a guarded root replacement. A dormant-only profile instead needs its recovery-view load and opaque-preservation save/readback gate, with gameplay still suspended; this does not count as native playability. Activation status belongs inside the root, not a second independently written active-pointer key. Interrupted/unverified candidates retain source and recovery; resume verification or use legacy explicitly. |
| M8 | Keep original/recovery bytes after activation. Future saves update only the profile root and active branch through the staged publisher, preserving inactive branch bytes and opaque fields. Rollback to exact pre-migration gameplay restores the legacy source via its supported route, under the same writer policy. Do not advertise that as retaining later profile-only progress. A later native-envelope export of the first branch is separately validated for backward compatibility; no automatic downgrade of genuinely new features. |

**INFERRED import dispatch:** decode transport first, inspect explicit root kind, then use its versioned validator. Native old exports keep all three current encodings and enter M2-M7 as a one-branch profile candidate. Default import remains a validated replacement of the chosen target, matching today's replace-slot meaning; it must not merge inventory/knowledge into an existing profile. Adding a branch to an existing profile is a separate explicit operation with fresh outer IDs, remapped outer references and retained inner IDs/pins. Whole-profile, branch-only and biography-only exports need distinct kind/version tags. Biography import cannot grant rewards. Use an additional profile transport marker, for example `YAIR-PROFILE-UTF8-1:`, so older native importers reject clearly. Current legacy marker remains for native-envelope exports. All this needs new dispatch code; current decoding assumes a native save (`src/save_files.js:158-173`).

**INFERRED missing-pack rule:** suspend only the affected future branch, preserve its selected start/RNG/body/jobs/native data and pins, and allow explicit selection of another compatible branch without simulating the dormant one. Restore play only with exact admitted content or an explicit migration. Keep simple-pack parking and structured full-character suspension distinct for the legacy branch. Import acceptance of opaque future content is preservation, not playability.

## 4. Risks and smallest first step

All R assessments and closure gates below are **INFERRED**; cited behavior is VERIFIED source evidence.

| Code | Risk and smallest useful closure |
| --- | --- |
| R1 | Unknown top-level native data can disappear when `create_save` reconstructs named fields. Keep preserved opaque extras in the branch adapter, with a declared merge/validation policy, plus exact pre-migration raw backup. Do not claim general roundtrip preservation merely because expansion publication copies an envelope (`src/main.js:4939-5197`; `src/expansion_persistence.js:8-50`). |
| R2 | Multiple mutable keys, stale tabs or live/dev fallback can choose competing authorities. One root/generation and shared profile/legacy writer arbitration are needed. Older builds must not silently overwrite an active profile; preserved legacy bytes are an explicit rollback source. Inject failures at backup, candidate, activation and save stages. Current lock covers only the selected legacy key (`src/main.js:588-597`). |
| R3 | Canon changes are insufficient to recreate native play. Never rederive the legacy payload or rewrite resolved RNG outcomes; hash/revision pins cannot recover missing definitions. Test current saved commitments against changed content, and preserve mismatches (`src/expansion_engine.js:75-79`; worktree `anchor_snapshots.js:87-104`). |
| R4 | Size doubles temporarily through backups/candidates and can grow with branch histories. The 4 MiB guard is shared; no deletion/compaction without its declared semantic contract. Inline profiles do not fulfill SV2. Biography compaction cannot replace reward/custody/causal history (`src/save_files.js:194-216`; `src/life_record.js:1,40-47`). |
| R5 | Branch switching can leak stock, NPC registries, RNG, timers or elapsed credit. Reloading into one active branch is safer initially than a hot registry swap. Preserve today's time policy: general automatic offline catch-up does not exist, and `saved_at` is not a wall-ms cursor. Add any future offline cursor with reward settlement in the same commit; resting branches receive no duplicate credit (`docs/research/OFFLINE_TIME_AND_BRANCH_CLOCK_AUDIT_2026-10-14.md:19-35`; `src/expansion_persistence.js:14-20,46-50`). |

**INFERRED smallest implementation:** a one-branch profile adapter with pure wrap/unwrap, distinct root schema and guarded single-root persistence. Keep `create_save`, staged life observations and the native loader operating on their existing native envelope; persist their output into that branch at the final write boundary. Preserve opaque dormant fields and backup semantics. It adds no branch selector, new start, canon compression, player rewards or offline policy. “No-op for current play” is an acceptance goal requiring comparison, not a current verified result.

### Required later verification

All T gates are **INFERRED planned checks, OPEN**. Use synthetic fixtures only.

| Code | Test/browser gate |
| --- | --- |
| T1 | Pure wrap/unwrap exact deep equality and no input mutation; repeated migration stable IDs; old native layouts, current component envelope, absent fork/expansion, supported schema variants, retired content, unknown opaque fields, future versions and corrupt inputs. Validate outer references and identity collision rejection. |
| T2 | Fault-injected Storage tests at every M write/readback/activation step, quota guard including unrelated keys, repeated startup and second-writer rejection. Current source bytes and recovery remain exact. Fail a paid command write and prove no native/profile split, reward duplication or stale pointer. |
| T3 | Native old/marked Unicode/upstream unmarked exports, profile/branch/biography kinds, malformed import rejection, content-revision mismatch and missing simple/structured content. Repeat imports with preserved pending selection/seed/receipts, then restore exact content without reroll. No current target bytes change on rejection. |
| T4 | Rebuild candidate source and verify served bytes on a fresh origin at 1366x768. Create an ordinary vanilla hero, play to a changed inventory/quest/paid-job state, save, reload, export actual file, import that literal file into a second fresh origin, save/reload again. Compare protected native and branch fields; separate legitimate `saved_at`/observation/export-reward changes from wrapper changes. Repeat with a generated legacy fixture. No personal save/origin access. |
| T5 | Before enabling several branches, isolate two branch inventories/NPCs/jobs/RNG/settings, fork without changing parent, switch via full reload, and prove resting/dormant branches unchanged. Demand-loading/size benchmarks and active-only elapsed claims are separate gates; hidden/closed equivalence requires the offline lane's future implementation. |

## 5. Suggestions, ranked

All suggestions are **INFERRED**, not accepted implementation orders.

1. **S1:** Build only the one-branch wrapper and synthetic migration contract first, with protected native-envelope equality as its acceptance condition.
2. **S2:** Keep immutable pre-migration bytes and single-root activation; test interrupted migration and quota failure before routing live autosave through profiles.
3. **S3:** Preserve structured suspension exactly, then add branch-level dormancy admission without relaxing native loader validation.
4. **S4:** Pin definitions and use timed canon changes only for newly authored branches; preserve full live native state until a measured, semantic diff contract exists.
5. **S5:** Measure developed and long synthetic profiles before selecting lazy storage/compaction; keep branch switching and offline accrual as separately verified changes.

## Checks actually run and remaining evidence

**VERIFIED ran:**

```sh
node --test tests/save_files.test.js tests/save_compatibility.test.js tests/v06_migration.test.js tests/life_record.test.js tests/content_packs.test.js tests/structured_pack_runtime.test.js tests/expansion_engine.test.js
```

Exit 0, 49 tests passed, 0 failed/cancelled/skipped. They exercise existing encoding/import rejection, retirement, component migration, life-record bounds/shared budget, optional-pack parking, structured runtime contracts and durable expansion writes (`tests/save_files.test.js:10-60`; `tests/save_compatibility.test.js:5-30`; `tests/v06_migration.test.js:9-49`; `tests/life_record.test.js:6-42`; `tests/content_packs.test.js:7-36`; `tests/expansion_engine.test.js:177-190`). These are source-slice results, not tests of the proposed profile code, which does not exist.

**VERIFIED ran:** the F4 RAM-only fresh serializer probe produced the measurements above using a rebuilt in-memory bundle and reported no page errors. **INFERRED/open:** T1-T5, profile implementation, actual persistent browser save/reload/export/literal import, long-profile budgets and human playable acceptance. No gameplay completion, installation or release is claimed.
