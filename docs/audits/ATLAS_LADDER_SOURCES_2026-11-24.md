# Atlas evidence ladder, rungs 2-4: sources and receipt design, 2026-11-24

Proposal under AD32, not an accepted decision. Agent-verified, not human-reviewed. Read-only investigation: no tracked file was edited except this one, no ledger line was changed, and the shared receipt `docs/coverage/effect_landings.json` was not rewritten.

Decision it serves: Weibao, 2026-11-24, Q1. Case success, module reachability, player action and persistence stay four separate fields. None is inferred from another. Missing means "not recorded", which is different from failed, stale, deferred and not applicable.

## 0. Summary

- **F1 (rung 2 is cheap and exact, but only for rows with a case).** 2,049 of about 72,400 ledger rows carry a `case`; they name 14 modules. `scripts/reachable.mjs` answers per module in about 0.5 to 1 s. The other ~70,370 rows have no module to test, so their rung 2 is "no case module", not "no".
- **F2 (rung 2 as the runner reports it is a trap for the Gu rows).** All 16 Gu rows that run share one module, `src/world_packs/gu_effect_pack.js`. It is reachable from `src/main.js` only because a played-landing file imports the Gu grammar from it (chain in section 2). Nothing on that chain calls `coverageCase`. The row's scene is never played. "Reachable" is true and says almost nothing about the row.
- **F3 (rung 3 has no join key today, the biggest gap).** The ordinary-play counter records `law`, `entry`, verb and object. It records no ledger key. The 9 landings in `effect_landings.json` join to zero ledger rows. See section 2 and the gap in section 8.
- **F4 (rung 4 is not covered by any producer that touches ledger rows).** The headless trace never saves or loads. Played landings run in a transient world with no save slice. The only persistence proofs that exist are engine round trips inside 292 case timelines (a `restore` step), and one untracked pilot test for the Monarch Lotus.
- **F5 (a pilot is in flight).** `tests/gu_lotus_essence_play.test.js` and `docs/gm/dispatch/atlas-platform-2026-11-24/pilot/HANDOFF_fandom_Heavenly_Essence_Treasure_Monarch_Lotus.md` are untracked. They prove rungs 3 and 4 for one wiki-layer row, in a capability run (a demo surface that the landing counter denies by design). They are the closest thing to a rung 3/4 receipt today and they set the shape this document reuses.

## 1. How I measured (commands and what they returned)

Working tree at the time: HEAD `3c31774e2` at the start, `98700248b` by the end (another lane committed meanwhile); 29 to 30 dirty or untracked paths including `docs/coverage/gu_kinds.jsonl` (sha1 prefix `a6dd37a096d2`). The ledger moved between two of my scans, so counts below name their run.

| Command (read-only) | Result |
| --- | --- |
| `node scripts/reachable.mjs` | `reachable 1710 of 1932 src files`; `computedImports: 1` (`src/translation.js: import(\`../locales/${language}.js\`)`); about 1 s wall |
| `node scripts/reachable.mjs --is src/world_packs/gu_effect_pack.js` | reachable |
| `node scripts/reachable.mjs --is src/world_packs/gu_move_coverage_cases.js` | not reachable |
| scan of all ledgers (scratch script, run 1) | 72,415 rows, 2,047 with `case`, 0 inline `data`, 14 modules; rows on a reachable module 432, on an unreachable module 1,615; no missing module files. `src/form_transformation_law.js` alone is 1,204 of the unreachable rows |
| `runCase` over every case row with the shared walk (scratch script, run 2) | 2,048 cases, 0 throws, 0 typed-versus-computed mismatches; states `expressed-authored` 1,507, `runs-authored` 264, `runs-derived` 168, `expressed-derived` 109; walk 0.54 s, runs 6.8 s, 7.4 s wall total |
| static scan of case data for a timeline `restore: true` step (run 3, 2,049 cases) | 292 cases have one; none of the 16 Gu scenes does; 0.3 s |
| `runCase` on `love`, `thunderwings`, `nine-eyes-liquor-worm`, `iceblade-storm`, `three-heads-six-arms`, `levitation`, `hover` with the walk | first call 239 ms (module load), the rest 1 to 17 ms; the two `gu_move_coverage_cases.js` rows return `expressed-authored` with detail "case module is library or test only" |
| import chain from `src/main.js` to `gu_effect_pack.js` (BFS over `importsOf`) | `main.js` to `native_tool_domains.js` to `played_effects_domain.js` to `played_landing.js` to `world_effect_packs.js` to `world_packs/gu_effect_pack.js` |
| `node scripts/effect_landing_count.mjs --start book.ri.keeper --minutes 360 --actions 40` | 1 landing (`gu-working / keeper-moonblade-hunt`), 36 presses, **3 min 20 s wall** (175 s CPU), printed only, receipt untouched |
| `node --test tests/gu_lotus_essence_play.test.js` (untracked pilot) | pass, 17.2 s (boots the game three times) |
| `freezeBuild()` from `scripts/mcp/frozen_build.mjs` | `bundleSha256` and `inputCount: 179` in 0.3 s (bundle cached); temp dir removed afterwards |

I did not run `effect_landing_count.mjs --check` or the default mode. The committed receipt (`effect_landings.json`, last changed 2026-11-18, commit `c80548e36`) was not replayed, so I make no claim that it still matches the tree.

## 2. Rung by rung

### Rung 1 (context only): case success

Already in codex as `ladder.caseState`: the ledger's stored state. `check:coverage` (`computeLedgers` in `scripts/coverage_report.mjs`) fails when the typed state disagrees with `runCase`, so the stored state is a computed value checked on demand. One caution for rung 2: the runner's `runs-*` already fuses "case executed" and "module reachable" into one word. The atlas must not read rung 2 out of that prefix (Q1). Compute it separately, as below.

### Rung 2: module reachability

**Producers today.**
- `scripts/reachable.mjs`: `walkFrom(entry)` returns `{reachable, computedImports, unresolved}`; `reachableFrom()` is what `runCase` consumes; CLI `--is <path>` and `--json`.
- `scripts/case_runner.mjs` `runCase(row, {reachable})`: the `runs-` versus `expressed-` suffix. Fused, so not a source for this rung.
- `scripts/coverage_report.mjs` `computeLedgers` and the README "Reachability from `src/main.js`" section: counts only, no per-module list.

**Join.** `row.case.module` (repo-relative path) to the walk's `reachable` set. Key in the atlas: `<ledger>:<row.id>`, then the row's module.

**Freshness.** Computed on demand, about 1 s, deterministic from the src tree. No stored receipt exists. `computedImports` (one today) and `unresolved` imports are gaps in the walk itself: a pack loaded through a computed path would read "not reachable" falsely, so the receipt must carry both lists and the atlas must print the count beside any "not reachable" verdict.

**What it can say and cannot say.**
- It says: some chain of static imports from `src/main.js` reaches the module file.
- It does not say: anything calls `coverageCase`, or that a player action runs the row's scene (F2). For the 16 Gu rows the chain is a grammar import. The Lotus handoff already asks for the importing file to be shown (its WA11), so a bare re-export looks different from a consumer. The receipt therefore stores `via`, the shortest import chain.

**Gaps (rows that can never be joined to a module today).**
- G2a: rows with no `case` (about 70,370 of about 72,400 (run 1 counted 72,415 rows and 2,047 cases; later runs saw 2,048 and 2,049)): no module. Show "no case module", never "unreachable".
- G2b: a case that names a module the walk cannot see (computed import) would be mislabelled; none of the 14 modules is in that state now, but the guard is cheap.
- G2c: all 16 Gu rows (and 168 `lotm_derived_cases.js` rows, 108 `hp_effect_pack.js` rows and so on) share a module, so one verdict covers many rows. That is correct for the module and not row-level evidence.

### Rung 3: player-action proof

**Producers today.**
1. `scripts/effect_landing_count.mjs`: plays each start headless with the work policy (`scripts/headless/trace.mjs`, `lead_bot.mjs`), counts `landEffect` results that changed the world through the `LAND_TAP` observer in `src/effect_host.js`, by `law` and `entry`. Capability runs, the workshop and test hooks are denied (`DENY`). Receipt: `docs/coverage/effect_landings.json` (`schema: 1`, `season`, per-start `byLaw`, `byEntry`, `byLawEntry`). Season default: seed 1, 2,880 game minutes, 300 presses. Committed result: village 0, `book.ri.keeper` 9 (`gu-working` 5, `layered-ward` 4).
2. Headless game scripts that press real controls: `scripts/headless/runner.mjs` (`boot`, `click`, `clickText`, `step`), `scenarios.mjs` (named starts, for example `fresh`, `village-watchcraft-ready`, the private `ri-fang-yuan-*` checkpoints), the Game MCP (`game_new`, `game_click`, `game_step`), and tests such as `tests/ri_lead_day_journey.test.js`, `tests/gu_lead_life.test.js`, `tests/village_lead_line.test.js`.
3. The pilot `tests/gu_lotus_essence_play.test.js` (untracked): Capability runs, workshop, Begin, Lotus act; asserts the report line appears.
4. Per-slice delivery receipts under `docs/representations/evidence/<topic>/*.json` and `docs/gm/dispatch/**` (for example `combat/journey.json` carries `route`, `bundle`, viewport and text). These are historical, one-off, hand-shaped and keyed by topic, not by ledger row.

**Join identifiers, and where each one stops.**
- Producer 1 joins on `law` and `entry` (`gu-working`, `keeper-moonblade-hunt`). Those are keys of `ENTRY_POINTS` in `src/played_effects_domain.js`. The Moonblade entry lands `guLanding({kind: 'attack'})` with authored dials (`ENTRY_DIALS`), a function family, not a catalogue Gu's sentence. The entry's `key` (`book.ri.keeper.km.use.moonblade__moon__own`) is a native action key. No field names a ledger row or a case id. **F3 again: no join exists.** A mapping from `keeper-moonblade-hunt` to `gu_moves:little-light-moonblade` would be my inference, and the row is `expressed-authored` on an unreachable module anyway.
- Producer 2 and 3 join on a scenario name plus whatever the author writes in the test. There is no machine-readable ledger key.
- Producer 4 joins on a topic folder name.

**Freshness.** Producer 1: stored receipt, no commit named, last rewritten 2026-11-18; one start at 360 minutes and 40 presses cost 3 min 20 s, so scaling linearly the default 2,880-minute season is roughly 25 to 30 minutes per start (an estimate, not a measurement; the script's own comment says about seven minutes per headless day). Producer 2 and 3: computed on demand when run, with no stored output. Producer 4: historical.

**Gaps.**
- G3a: no producer carries a ledger key (F3). Every row's rung 3 is "not recorded" today, and that is the honest value.
- G3b: ordinary play is thin. Village landed 0 effects in a 2,880-minute season. The 9 landings are two entries in one book life. A rung 3 verdict of "ordinary play" can exist for at most those two entries until more entry points are added.
- G3c: rows whose case is a fixture scene (all 16 Gu kinds rows, all of `gu_moves`) have no player entry at all. The same ids appear in 20+ game source files (keeper lines, diet defaults, fusion, wolf ridge), but those are the game's own Gu mechanics, a name match and not an identity (B2 of the direction audit). The one test-only host, `src/gu_workshop.js`, is itself unreachable from `main.js`.
- G3d: private-checkpoint scenarios need `private_packs/` and local saves; they skip on a clean checkout, so a receipt from them is not reproducible by every agent.

### Rung 4: persistence proof (FLR5: save, reload, Export, Import)

**Producers today.**
1. Engine round trip inside a case: a timeline step `{id, restore: true}` runs `serializeEngineWorld`, JSON round trip, `restoreEngineWorld`, then `isDeepStrictEqual`; a difference returns `blocked:runner-restore`. 292 of 2,049 cases have one (all `lotm_derived_cases.js` rows, 34 `hp_potions`, 46 `lotm_potions` on `brew_coverage_cases.js`, 9 `gu_moves`, 26 of 108 `hp_effect_pack.js` rows, and a few singles). It proves the engine world serializes. It does not prove the game save, and it does not prove the row's consumer is in the save (this is engine-layer only).
2. Game-level: `boot().save()`, `reload()`, `exportFile()`, `importFile()` in `scripts/headless/runner.mjs`; Game MCP `game_save`, `game_export`, `game_load`. Tests: `tests/save_files.test.js` (encode, decode, refuse bad imports), `tests/lead_saves_load.test.js` (three earned private saves boot and play an hour; skips without `private_packs/`), `tests/ri_lead_day_journey.test.js` (reload refills the sea), `tests/world_pack_save.test.js` (section round trip on a fixture pack), and the Lotus pilot (save, reload, export, clear storage, import).
3. Played landings (producer 1 of rung 3) have no save slice by design (`src/played_effects_domain.js` header: "The observer re-baselines on load and has no save slice"). They can never feed rung 4.

**Join.** Engine restore: `row.case` data, readable from `coverageCase(id).timeline`. Game level: the test author's own assertion; no ledger key.

**Freshness.** Engine restore: computed on demand with the case (the 7.4 s all-cases run above covers it). Game level: tests rerun on demand (17 s for the Lotus pilot), nothing stored. The FLR1 bundle hash is available from `freezeBuild().bundleSha256` and nothing stores it with a ledger row.

**Gaps.**
- G4a: none of the 16 Gu scenes has a `restore` step, so even the weakest layer is unrecorded for them.
- G4b: no save test is keyed to a ledger row. The lead-save tests boot a save and check for errors; they say nothing about a row's effect surviving.
- G4c: the browser layer (fresh-origin rebuilt build) has no producer for ledger rows at all; the pilot says so explicitly.
- G4d: migration of older saves is separately recorded nowhere.

## 3. Proposed receipts

Rule: reuse existing formats. Three precedents are in the tree: `effect_landings.json` (schema number plus run parameters plus counts), `codex.mjs` `builtFrom {hash, bytes}` (sha1 of the file text, first 12 hex), and `freezeBuild` (sha256 identities, `bundleSha256`). The ledger row stays unchanged; `parseLedger` rejects extra row fields (CASE_SHAPE), so evidence lives beside the ledger.

**Storage.** `docs/coverage/evidence/ladder/` (the directory `docs/coverage/evidence/` already holds `gu_move_slots.jsonl`, which the atlas already reads through `moveSlots()`). It must not sit at the top of `docs/coverage/`: both `ledgerNames()` in `codex.mjs` and `readLedgers()` in `coverage_report.mjs` treat every `*.jsonl` there as a ledger and the validator would reject it. It is a subdirectory, which neither lists.

### Rung 2 receipt: `reachability.json` (one file, computed)

Illustrative shape, not a recorded result; the values are examples from this session's run.

```json
{"schema": 1, "rung": "module-reachability", "entry": "src/main.js",
 "producer": {"script": "scripts/ladder_receipts.mjs", "command": "node scripts/ladder_receipts.mjs reach"},
 "inputs": {"srcSha1": "<sha1 over sorted 'path:sha1' lines of src/**/*.js>", "fileCount": 1932},
 "tree": {"commit": "98700248b", "dirty": true},
 "walk": {"reachableCount": 1710, "srcCount": 1932, "computedImports": [{"file": "src/translation.js", "snippet": "import(`../locales/${language}.js`)"}], "unresolved": []},
 "modules": {"src/world_packs/gu_effect_pack.js": {"reachable": true, "via": ["src/main.js", "src/native_tool_domains.js", "src/played_effects_domain.js", "src/played_landing.js", "src/world_effect_packs.js", "src/world_packs/gu_effect_pack.js"], "viaSha1": {"src/played_landing.js": "..."}},
             "src/world_packs/gu_move_coverage_cases.js": {"reachable": false, "via": null}},
 "at": "2026-11-24T22:00:00Z"}
```

Only the modules named by some ledger `case.module` are listed (14 now). The atlas joins a row by its `case.module`. `via` is the shortest chain, so a reader sees "grammar import" or "consumer" at a glance; the receipt does not classify it, a person does.

### Rung 3 receipt: `player_action.jsonl` (one line per observation, appended, never edited)

Illustrative shape, not a recorded result. No such line exists yet and the probe named in it has not been written; `proven` and `17000` are placeholders.

```json
{"schema": 1, "rung": "player-action", "keys": ["gu_kinds:vitality-leaf"],
 "case": {"module": "src/world_packs/gu_effect_pack.js", "id": "vitality-leaf"},
 "result": "proven",
 "route": {"kind": "capability-run", "scenario": "fresh", "entry": "Capability runs > workshop > act gu", "ordinaryPlay": false},
 "join": {"basis": "reviewed-same-catalogue-id-and-sentence", "reviewer": "agent"},
 "producer": {"command": "node --test tests/gu_vitality_leaf_play.test.js", "seed": 1, "exit": 0, "ms": 17000},
 "inputs": {"rowSha1": "...", "bundleSha256": "..."},
 "watch": {"src/world_packs/effects_workshop.js": "<sha1>", "src/world_packs/gu_effect_pack.js": "<sha1>", "tests/gu_vitality_leaf_play.test.js": "<sha1>"},
 "tree": {"commit": "98700248b", "dirty": true},
 "review": "agent-verified", "at": "2026-11-24T22:00:00Z"}
```

- `keys` is an array because the joins are many-to-many (platform audit C5): one probe can bear on several rows, one row can have several probes. Ledger-scoped composite keys only, never a bare id (81 bare ids repeat across ledgers).
- `result`: `proven`, `not-proven` (a probe ran and the action did not land), `failed` (the probe errored), `not-applicable`, `deferred` (engine-only on purpose, OR1). An absent line means `not-recorded`.
- `route.kind` is the FLR6 route kind and is required: `ordinary-play`, `earned-save`, `fixture`, `capability-run`, `engine-only`. `ordinaryPlay` is true only for the first. A landing from `effect_landing_count.mjs` is `ordinary-play`; the Lotus and vitality-leaf workshop acts are `capability-run`.
- `join.basis` records how the ledger key was attached: `explicit-id` (the producer carries `ledgerKey`), `reviewed-match`, `candidate` (name match, never shown as proof).
- For the landing counter, one line per `byLawEntry` bucket once an entry carries a key (A3 in section 6), with `landed`, `attempted`, `season` copied from the script's own output so `effect_landings.json` stays the source and this is a projection of it.

### Rung 4 receipt: `persistence.jsonl` (same envelope, separate layers)

Illustrative shape, not a recorded result.

```json
{"schema": 1, "rung": "persistence", "keys": ["..."], "case": {...},
 "layers": {"engineRestore": "proven", "saveReload": "proven", "exportImport": "proven", "browser": "not-recorded", "migration": "not-recorded"},
 "route": {"kind": "capability-run", "scenario": "fresh"},
 "producer": {...}, "inputs": {...}, "watch": {...}, "tree": {...}, "review": "agent-verified", "at": "..."}
```

`engineRestore` can be filled for 292 rows from case data plus the runner with no game boot. The other layers need a game boot and come only from a probe that does all of save, `reload()`, `exportFile()`, storage clear, `importFile()` (the pilot's sequence). FLR5 is met only when `saveReload` and `exportImport` are both `proven`; `engineRestore` alone is shown as "engine layer only".

### Alignment with the platform audit (C1, C5, D1)

- **C1** (data before rendering, cache against input hashes, report unavailable or stale sources): section 4 follows it. Receipts are small files read on page load; every cache key is a content hash; stale and not-recorded are displayed, not hidden.
- **C5** (existing owners stay authoritative; delivery proof belongs to task receipts; many-to-many joins; a name match stays inferred): the files under `docs/coverage/evidence/ladder/` are an index the atlas reads, written by a named producer from the owner's own command (the test, the runner, the walk). The authority stays with the command and its output. This is a small departure: C5 puts delivery proof with task receipts, and I add one machine-readable index beside the ledger because the existing task receipts (`docs/representations/evidence/**`, `docs/gm/dispatch/**`) have no common shape and no ledger key. If the owner prefers, the same lines can live in each task's own receipt folder and the atlas can read them from there; only the `keys`, `route`, `watch` and `tree` fields matter.
- **Audit D1** (adopt the four-field ladder): this design is that decision applied. Nothing here changes it.

## 4. How the atlas computes and shows each rung

Hard rule: opening a page never starts a job. The page reads receipts (small files under `docs/coverage/evidence/ladder/`) and the cheap content hashes. Heavy producers are named jobs with fixed arguments, started by a button or by an agent, with a log.

| Rung | Page-load work | Cache key | Refresh job (named, fixed args) | Cost |
| --- | --- | --- | --- | --- |
| 2 | read `reachability.json`, join by `case.module`, recheck `viaSha1` of the chain files | `inputs.srcSha1` for "not reachable"; the chain files' sha1 for "reachable" | `ladder:reach` | about 1 to 3 s |
| 3 | read `player_action.jsonl`, take the latest line per key and route | `inputs.rowSha1` plus the `watch` map | `ladder:play <probe>`; `ladder:landings --start <id> --minutes N --actions M` (gated, long) | about 17 s per boot probe; 3 min 20 s for the 360-minute sample; 25 to 30 min estimated per full-season start |
| 4 | read `persistence.jsonl` (and `engineRestore` from the case data via a cached `coverageCase` read) | same as rung 3 | `ladder:persist <probe>`; `ladder:case` for engine restore | 0.3 s static, 7.4 s all cases, about 17 s per boot probe |

**Staleness is by content, not by commit.** The tree is dirty and other lanes commit during a session (HEAD moved at least once while I worked (`3c31774e2` to `98700248b`)), so "stale when the commit moved" would mark everything stale all the time. Rules:
- `current`: every file in `watch` and the row's own line (`rowSha1`) hash the same as when the receipt was written.
- `commit moved`: the commit differs but every watched hash matches. Still valid for those inputs; show both commits.
- `stale`: a watched file or the row line changed. Show the old verdict greyed with its date, never as the current verdict. A `not-reachable` verdict is stale when any `src` file changed (a new import could reach it); a `reachable` verdict is stale only when a chain file changed.
- `bundle moved`: `bundleSha256` differs from a fresh `freezeBuild()`. Informational (FLR1 names the bundle a receipt was proven on); not by itself stale, because nearly every edit moves the bundle.
- `not-recorded`: no line for the key. Shown as such, plus any `candidate` pointers kept visibly apart (grey, "name match, not evidence").

**Display.** One chip row per rung, each chip with value, route word and age: `R2 reachable (via played_landing.js grammar import) | R3 not recorded | R4a engine restore: none | R4b-d not recorded`. The route word "capability-run" or "fixture" prints next to any `proven` that is not `ordinary-play`, so the Lotus line reads "proven in the workshop demo run, not ordinary play". The atlas keeps `playerAction` and `persistence` as objects (not booleans) in `ladder`, and `moduleReachable` as `{reachable, via, receiptState}` or `null` for no case.

## 5. First slice

Smallest change that fills rung 2 for every row that can have one, and gives rungs 3 and 4 a recorded value for the 16 Gu rows.

**What "fill" means here.** A recorded value, not a yes. By section 2, I expect rung 2 to read yes for 16 of 16, rung 3 to read proven (capability run) for at most 1 of the 16 (`vitality-leaf` through the workshop `gu` act, same sentence, different scene), and the other rows to stay `not-recorded` with a candidate pointer. Saying "all 16 proven" would be false.

Steps (all new files, none touch the ledger or `case_runner.mjs`):
1. **`scripts/ladder_receipts.mjs`** (one new script, about 150 lines, reusing `walkFrom`, `importsOf`, `runCase`, `freezeBuild`):
   - `node scripts/ladder_receipts.mjs reach` writes `docs/coverage/evidence/ladder/reachability.json`. About 1 to 3 s. Fills rung 2 for the 2,049 rows with a case (14 modules) and records the chain. The ~70,370 rows without a case get "no case module" at read time, no file.
   - `node scripts/ladder_receipts.mjs engine` runs every case through `runCase` with the same walk and the static `restore` scan; appends `engineRestore` lines for the 292 rows (`proven` only when `runCase` returned a non-blocked state, so a `blocked:runner-restore` never reads as proven). About 8 s.
2. **One probe for the 16 rows, `tests/gu_vitality_leaf_play.test.js`**, copied from the pilot's pattern (boot, Capability runs, workshop, Begin, the `gu` act; save, `reload()`, `exportFile()`, clear, `importFile()`). About 17 s. The runner appends one `player_action.jsonl` and one `persistence.jsonl` line for `gu_kinds:vitality-leaf` only if the test exits 0, with `route.kind: "capability-run"`. I checked the join: `EFFECT_GRAMMARS.gu.read('vitality-leaf')` and `coverageCase('vitality-leaf').sentence` pass `assert.deepStrictEqual` (same verb, object, target, time, carrier, cost and limits: `add vitality, touched, instant`). The landings differ: the act lands amount 3 on holder `brewer` through `land(e, parts, 3)` in `effects_workshop.js`; the case scene lands amount 2 on holder `patient`. So the sentence is shared and the scene is not. Record `join.basis: reviewed-same-catalogue-id-and-sentence` and the amount and holder difference in `reason`.
3. **The other 15 get no proof line.** The runner writes `candidate` lines (file list from a grep of the id in `src`, split into reachable and unreachable files) so the atlas can say "name appears in 12 game files; none recorded as this row's route". Examples from my grep: `moonlight` appears in 30+ files, `src/gu_workshop.js` is among them and is not reachable from `main.js`; `thunderwings` in `src/gu_wolf_ridge.js` and `book_gu_lead_lightning_lycan.js`. These are leads for a human or a later lane.
4. **Adopt the pilot's Lotus row as a 17th**, from its own test and handoff, once that lane lands them. It is untracked now and has no commit; cite it as in flight, and do not write its lines until it is committed.
5. **Atlas change (owner of `prototypes/world-atlas/codex.mjs`)**: `projectRow` reads the three receipt files (cached by file sha1, the way `readLedger` caches) and fills `moduleReachable`, `playerAction`, `persistence`. Rows with no receipt keep `null`. No game boot on the page.

Commands and time for one fresh refresh of everything in this slice:

```
node scripts/ladder_receipts.mjs reach        # about 1-3 s
node scripts/ladder_receipts.mjs engine       # about 8 s (all 2,049 cases)
node --test tests/gu_vitality_leaf_play.test.js   # about 17 s
node scripts/ladder_receipts.mjs candidates --ledger gu_kinds   # under 2 s
```

Total about 30 s on this machine. The long job stays out of the slice: `node scripts/effect_landing_count.mjs --start book.ri.keeper --minutes 360 --actions 40` (3 min 20 s, printed only) is only needed once an entry carries a ledger key (R3 below). Never run the script in default mode as a refresh: it rewrites the tracked receipt (`fs.writeFileSync(RECEIPT, ...)`); use `--start` (prints) or `--check` (compares, nonzero on difference).

## 6. Decisions and requests for owners

- **A1 (owner of `scripts/reachable.mjs`).** Export a `chainTo(file)` helper so the shortest import chain does not need a second walker. Small, additive.
- **A2 (owner of `scripts/effect_landing_count.mjs` and `src/effect_host.js`).** Make the tap row carry the commit and a `ledgerKey` when an entry has one, and write that into the receipt. Today the receipt names no commit, so a landing count cannot be stale-checked.
- **A3 (owner of `src/played_effects_domain.js`).** Add an optional `ledgerKey` (and `caseId`) to each `ENTRY_POINTS` row and pass it through `withLandingEntry`. Without it, rung 3 can never be joined by an id (F3). Whether `keeper-moonblade-hunt` should name `gu_moves:little-light-moonblade` or a catalogue kind is that owner's call: the landing is a generic `attack` sentence with authored dials.
- **A4 (coverage owner).** Decide whether the 292 existing `restore` steps are enough for "engine layer" or whether a ledger row should also name the save slice it round trips; I assumed the former.
- **P1 (question for Weibao, or for AD32 review).** Whether a capability-run proof counts toward the headline at all. The headline "effects that fire in ordinary play" excludes it by design (`DENY`). I propose it appears on the rung 3 chip, labelled, and never in that headline.

## 7. Risks

- **R1: A static import is not a player action.** `gu_effect_pack.js` is "reachable" through the grammar import chain, so all 16 rows would read as reachable while no player command touches their scenes. Mitigation: store `via`; show the chain; keep rung 2 separate from rung 3.
- **R2: A fixture run is not ordinary play.** The capability workshop, the `scenarios.mjs` dev-seeded starts (labelled DEV SEEDED) and the engine `restore` step are fixtures. Mitigation: `route.kind` required; "capability-run" and "fixture" print beside any proven; only `ordinary-play` can feed the "fire in ordinary play" headline.
- **R3: A historical receipt is not current proof.** `effect_landings.json` was last written 2026-11-18, names no commit, and was not replayed here. The `docs/representations/evidence/**` and dispatch receipts are keyed by topic and date. Mitigation: `watch` hashes and the `stale` state; show the age; an old line is greyed, never deleted.
- **R4: A name match is not an identity.** The Gu ids appear in many game files. Mitigation: `join.basis` and the `candidate` tier.
- **R5: A shared module hides row-level truth.** One reachable verdict covers 16 rows on `gu_effect_pack.js` and 168 on `lotm_derived_cases.js`. Mitigation: label the verdict "module", not "row".
- **R6: The ledger is generated and moving.** The pilot handoff notes `scripts/gu_coverage_ledgers.mjs` overwrites hand-applied lines, and my own two scans differed by one row. Mitigation: key every receipt by `rowSha1` and `case` ref, and re-join on read.
- **R7: Cost of full ordinary play.** 3 min 20 s for 360 minutes means a default season is a long job. Mitigation: job, not page load; gated; keep the bounded `--start` mode for a scoped sample; report season parameters with the count (the script already does).
- **R8: Private inputs.** Earned-save probes need `private_packs/` and local checkpoints. Mitigation: record `scenario` and whether it is private; a receipt from a private scenario is marked non-reproducible on a clean checkout.
- **R9: Atlas must not hide partial data.** `parseRows` in `codex.mjs` silently skips malformed lines; the same would apply to receipt lines. Mitigation: count and show skipped lines, as the direction audit asks for ledgers.

## 8. Biggest gap

Rung 3 has no join key. Nothing that plays the game records which ledger row, case id or effect id it exercised. The one producer of ordinary-play counts keys by `law` and `entry`, and the 9 recorded landings come from a generic sentence family with authored dials. Until `ENTRY_POINTS` rows (and any future play probe) carry a `ledgerKey`, rung 3 can be recorded only by a human-reviewed join, and rung 4 only per probe. The cheap rungs (2 and engine-layer 4) can be filled for everything that has a case, but 97 percent of rows have no case, so for most rows even those read "no case".

## 9. Check receipt

| Check | Result |
| --- | --- |
| Files edited | this document only; scratch scripts were written under the session scratchpad and are not in the repo |
| Ledger or runner edits | none |
| `effect_landings.json` | untouched (`--start` mode prints and exits before the write) |
| Full-season landing replay, `--check`, browser receipts | not run |
| Commands in section 1 | run on this tree; figures are from the named run, on a tree that moved between runs |
| Review state | agent-verified only (FLR6) |
