# Architecture and save review, 2026-11-15

*Findings and proposals only (AD56: nothing here is accepted). Weibao asked: "overall architecture and design review? if we should improve in any way? more to consider? improve saving? other aspects? Are we constrained by being able to work on the web too?" Rules applied: AR1-AR19, AR6 (saves), AD22, AD36, AD39, AD45, AD51, PFP1-PFP9, the 2026-10-17 old-save decision and the 8 GB performance target.*

Earlier reviews this builds on: [whole-project review](../reviews/WHOLE_PROJECT_GAME_ARCHITECTURE_REVIEW_2026-10-12.md), [modularity assessment](../reviews/MODULARITY_AND_REWRITE_ASSESSMENT_2026-10-16.md) (its O2, no rewrite, is the accepted direction in [USER_VISION](../USER_VISION.md#platform-performance-and-saves)), [cycle ledger](../reviews/CYCLE_LEDGER_2026-10-26.md), [Codex foundations review](CODEX_FOUNDATIONS_REVIEW_2026-11-11.md). Nothing below proposes a rewrite, TypeScript, ECS or a UI framework; the target shape in [ARCHITECTURE_RULES](../ARCHITECTURE_RULES.md) rules those out without a demonstrated gap.

## Short answer

The direction is sound and the guard rails work: `check:arch` holds zero growth, the domain registry has 92 registrants, and the new headless engine joins the save through the registry (`capability_runs_domain.js` registers a slice and calls `serializeEngineWorld`), so the engine-first plan is not creating a third save path. Three things deserve real effort: the save envelope is two systems glued together, the 11 MB bundle loads every world eagerly, and the ratchet stops growth without shrinking the two big cycle groups. The web is not a meaningful constraint; the WebView is, and the desktop host already compensates for it.

## Measured state (2026-11-15, this checkout)

| Measure | Value | Source |
| --- | --- | --- |
| JS in `src` | 1,850 files, about 272k lines, 1,449 entries flat in `src/` | `find`, `wc` |
| Hot files | `main.js` 10,115 (10,337 on Oct 16), `display.js` 6,767, `save_files.js` 310; growth 0 | `npm run check:arch` |
| Cycles | 205 grandfathered edges in 3 groups: C01 hub `main.js` (122), C02 hub `simulation_effects.js` (81), C03 (2) | `node scripts/cycle_ledger.mjs` |
| Registry | 92 files call `registerDomain`; `main.js` still has 367 import lines | grep |
| Save envelope | about 50 hand-ordered validators in `validateSaveEnvelope` plus `domainRegistry.validate`; `load()` restores dozens of top-level keys by hand | `src/save_files.js`, `src/main.js:6722` |
| Save size | Weibao's current life about 238 KB; crowded perf fixture 279 KB; budget 4 MB of UTF-16 (about 2 MB of characters) | Tauri store sizes, `tests/fixtures/perf`, `SAVE_STORAGE_BUDGET` |
| Save cadence | About 60 durable writes a minute: every native commit through `persistExpansion` runs a full `create_save` (`src/expansion_persistence.js:10`); the base-world autosave every 60 ticks is the slower path. Corrected in round 2 | perf gate `storageWritesPerMin`, `scripts/perf/save_probe.mjs` |
| Bundle | `dist/bundle.js` 11 MB minified, one ESM entry, no code splitting, no dynamic `import()`; `book_mol_pack.js` alone is 20k source lines | `build.js`, `du` |
| Web | `origin/ghpages` holds upstream's June 2026 state; OOPS has no web deployment and no CI workflow | `git ls-remote`, `.github/` absent |
| Desktop saves | Tauri host keeps a disk store (`storage/local.json`, revisioned) and a mirror (`latest.json` plus 22 gzip snapshots, 14-day prune) | `desktop-tauri/src/store.rs`, `mirror.rs` |

## Findings

**F1 · Two save systems coexist (open since Oct 16).** AR6 asks for one key per domain. The registry does that for 92 domains, but the envelope still carries keys named by delivery wave (`p23_*`, `absorb_*`, `tranche_*`, `pacing_e1`, `field_familiarity_p07`) with validators listed by hand in a fixed order and restored by hand in `load()`. Every new hand key costs a line in three hot files and a place in an order nobody can see. The names also mean nothing to a reader who was not in that wave.

**F2 · Saving has side effects (new; retracted in round 2, see below).** `lifeSaveStorage.setEnvelope` (`src/main.js:599`) does more than store: it calls `observeLifeSave`, advances village lives through `stageFamily`, migrates the work ledger, refreshes customization and redraws panels. If any of those advance state, then how often you save changes the outcome, and a stepper batch, a manual save and an autosave produce different worlds. Not yet verified whether they advance state or only stage it; the staging comments suggest the authors meant it to be pure. It is an AR3 smell either way: the save writer is also a mutation owner.

**F3 · Every save rebuilds and validates the whole envelope (new).** `create_save` stringifies the whole life and runs the full validator chain on each native commit, about once a second, on the main thread, blocking (round 2 has the numbers). At 238 KB this is cheap. Lives grow: life records, NPC lives, generated people, engine runs and per-world state all accumulate, and long play is welcome. Unknown: how long a create, validate and write takes on a crowded save on 8 GB hardware. The durable writer already skips unchanged bytes, which helps idle time but not the build cost.

**F4 · The bundle loads every world eagerly (new).** One 11 MB bundle parses all world packs, book content and Gu catalogues at boot, whichever world the player is in. This is the largest single lever for the 8 GB target and for boot time, and it gets worse with each canon-as-data world (PFP1 turns books into big tables).

**F5 · The ratchet stops growth but does not shrink (open since Oct 16).** `main.js` lost about 2% in a month. Zero-growth (AR1) works; no round is scheduled to burn down C01 or C02. C02 is newer and centred on `simulation_effects.js` with 37 members, which suggests a shared effects helper that imports its callers.

**F6 · Flat file naming by wave (new).** 1,449 entries in `src/`, many named by delivery wave or audit (`audit_remainder_*`, `absorb_c2/`, `feature_expansion_*`, `backlog_expansion_*`). The [area guide](../AREA_GUIDE.md) and [seam register](../SEAM_REGISTER.md) compensate, but a new agent cannot find the owner of "fights" or "brewing" from the tree. The prefix counts show the real domains already exist: `book` 139, `gu` 90, `world` 57, `home` 36, `craft` 29.

**F7 · The web is not the constraint; the WebView is (answers the web question).** Tauri on macOS runs WKWebView, which has the same localStorage quota and synchronous API as a browser. What "web compatible" costs today is small: the game must run without the host (`src/host.js` already gives every host call a browser fallback). What it buys is large: the headless browser checks, the game MCP, `check:visual`, fixture boots and any future sharing all run the same web build. The desktop side has already gone further than a browser could: host store, mirror, recovery page, hang guard. The web build has localStorage plus manual Export only, which is fine because no one plays it.

**F8 · Save safety on desktop is good; on the web it is thin (new).** The host store recovers a wiped WebKit store and the mirror keeps rolling snapshots. Gaps: the 4 MB budget is a hard wall shared with layout keys and archives, the format is base64 of raw JSON (about a third larger than the JSON), there is no compression, and the mirror poll is 30 s with a 5 s store write gap, so a crash can lose up to a minute of play (the D3 decision accepts losing counters, not state, between saves).

**F9 · The engine tie-in is going the right way (positive).** `capabilityRuns` registers as a domain and serializes engine worlds into its own slice. Keep that the only route: every engine world saved through a registered domain, never a new top-level key.

**F10 · The rule and doc layer is now a cost of its own (new, AR13 spirit).** Thirteen proposed rulebooks, AR, UR, MR, SPR, WPR and more, plus `check:rules` with eight scripts. It catches real drift. It also means a small runtime change reads more rules than code. This review does not propose cutting rules (that would be a limiting line under AD56); it notes the cost so it is weighed.

## Options for saving

| Code | Option | Gain | Cost |
| --- | --- | --- | --- |
| O1 | **Re-key the envelope by domain** while old saves are disposable: move each `p23_*`, `absorb_*` and `tranche_*` key into a registered domain with a meaningful id, delete the hand lines in `save_files.js` and `load()` | One save path, readable keys, lines leave the hot files (pays AR1) | Breaks old saves, which is acceptable now; one structural round per group (AR9) |
| O2 | **Make the save writer pure**: move life observation, NPC staging and ledger migration to the tick or command that causes them; by default the writer serializes and stores, and any exception names its reason | Save frequency stops changing outcomes; easier tests | Must first confirm F2 with a same-scenario test: save every minute versus every in-game hour, compare state |
| O3 | **IndexedDB as primary storage in both hosts**, localStorage kept for small prefs | Async writes off the main thread, quota in the hundreds of MB, structured clone instead of stringify | Async load at boot; the Tauri store currently mirrors localStorage changes, so it would mirror IDB writes instead |
| O4 | **Host file as primary on desktop** through `host.js`, IDB or localStorage fallback on the web | The disk becomes the authority on desktop; no WebKit quota | Two primaries to keep in step; more host code |
| O5 | **Compress** exports and stored saves with `CompressionStream('gzip')` | Typically 5-10x smaller for this JSON; export files shrink | Async; a format tag (the `YAIR-UTF8-1:` prefix pattern already exists, add `YAIR-GZ-1:`) |
| O6 | **Measure first**: add create, validate and write timings to the perf harness on the crowded fixture | Decides whether O3/O5 are urgent or later | Small |

Default proposal (updated in round 2): O6 is done and O2 needs no change; next O1, then O5 for exports (cheap now, expensive after the first release), then O5 for exports. O3 waits until O6 shows main-thread save cost or size near the budget.

## Options for the rest

| Code | Option | Gain | Cost |
| --- | --- | --- | --- |
| O7 | **Lazy-load world packs**: esbuild `splitting: true`, the world pack registry loads a world's packs with `import()` when that world is entered or a save names it | Smaller boot, lower memory on 8 GB machines; scales with canon-as-data | Boot and load become async for world content; tests that import packs directly are unaffected |
| O8 | **Scheduled burn-down rounds** for C01 and C02 (FND3), one group per round with a measured edge count before and after | Turns the ratchet into progress | Writer reservation on hot files (AR15) |
| O9 | **Domain folders applied as files are touched**: a moved file goes to `src/<domain>/`, default is no mass move and structural commits kept apart from behavior (AR9), because mixed moves hide changes | Tree tells you the owner | Import path churn; do it per domain round, never mixed with behavior |
| O10 | **Keep web compatibility as a free property**, not a target: one CI-like local check that boots the plain web build headless and saves, reloads and imports | Protects the MCP and browser checks | Small |

## Risks

**R1 · Save size wall.** At about 240 KB now and 2 MB of characters available, long lives with several worlds and engine runs could reach the wall; the guard refuses to save rather than corrupt, which pauses play.

**R2 · Outcome depends on save timing** if F2 is confirmed. Hard to notice, easy to mistake for randomness.

**R3 · Release freezes the envelope.** Once `v0.1.0` ships and saves matter, O1 costs a migration per key. Cheapest before release.

**R4 · Eager loading compounds.** Each canon-as-data world adds to every boot.

## Questions for Weibao

**Q1 · Old saves before v0.1.0.** O1 drops current saves' wave-named state (your current life included unless migrated). Reset, or write a one-time migration for your life?

**Q2 · Web as a target.** Keep the web build as an unadvertised but working copy (default proposal, it costs little and the tools depend on it), or also publish it to the fork's pages branch at release?

## More to consider (round 1)

**ACT NOW (done in this review):** measured hot files, cycles, save size, cadence, bundle and web state; confirmed the engine saves through the registry (F9).

**ACCOUNT FOR NOW**
- Save-on-hide and quit already flush; a crash between autosaves loses up to a minute. If idle play runs for hours unattended, consider autosave by in-game events (a finished activity) as well as by wall clock.
- Export rewards (`time_between_export_rewards`) teach the player to export; on desktop the mirror makes that less needed. Keep or retune when the release UI is reviewed.
- Archives of ended lives (heir and independent requests) live in the same 4 MB origin budget as the current life. Several lives in, they crowd it first.
- Engine worlds serialized inside a domain slice should carry their own schema number, so the kernel can change shape without touching the envelope version.
- Determinism: `replaySeed` is wired for test hooks today. A seeded save plus a command log would make bugs replayable and is the natural next step after O2.

**LATER / DELEGATE**
- O6 timing harness: level small, sonnet lane, done when the crowded fixture reports create, validate and write ms in the perf harness.
- O1 re-key round per group (p23, absorb, tranche): level medium each, sonnet lane, done when the group's keys leave `save_files.js` and `load()` and save, reload, Export and Import pass in a rebuilt browser.
- O7 lazy world packs: level medium, sonnet lane after a spike, done when boot bundle size drops and a world entry and a save naming that world both load its packs.
- O8 cycle round C02: level medium, done when C02's edge count drops with the same scenario before and after.

## Round 2: measurements and the save writer (2026-11-15)

Weibao: "lets do those, but are there archetectual improvements you can use". Ran O6 and the O2 check.

**Corrections.** Round 1 said saves happen about once a minute and that saving might change outcomes. Both were wrong. Saves happen about once a second, because every native commit writes the whole save; the once-a-minute autosave covers only the base-world path. The save writer's side effects are deliberate commit-time settlement, not a timing dependence (F2 below).

**F2 retracted.** What `lifeSaveStorage.setEnvelope` runs, and why each is safe:
- `observeLifeSave` records a world change once; repeating it at the same world adds nothing.
- `advanceVillageLives` is a function of the year it is given, so how often it runs does not change the result.
- `stageVillageFamilySave` settles births and conceptions per year from a per-year seed. `tests/village_family.test.js` already checks that one long interval and yearly saves produce the same people (its last test).
- Bond changes (estrange, mend) are commands that commit through the same writer, so no span between saves can hide a bond change from family settlement.
- A world crossing commits through `persistExpansion`, which writes the save, so the life record sees each crossing at its commit.
O2 needs no code change. The writer still being the place where these happen is a design choice (commit-time settlement), recorded here rather than counted as an AR3 breach.

**O6 measured.** Tools: `node scripts/perf/save_cost.mjs` (pure parts, Node) and `node scripts/perf/save_probe.mjs` (full save in headless Chrome from a temp build; the checkout's `dist/` is untouched). This 18-core arm64 Mac, load about 7:

| Fixture | Stored chars | Full manual save (median) | Validate (Node) | Stringify (Node) | Storage `setItem` | Durable writes per minute |
| --- | --- | --- | --- | --- | --- | --- |
| fresh | 90,079 | 8.7 ms | 1.2 ms | 0.08 ms | about 0.1 ms | 60 |
| mid | 103,503 | 9.4 ms | 1.3 ms | 0.10 ms | about 0.1 ms | 60 |
| crowded | 324,322 | 22.5 ms (28.6 on the working tree, same code, noisy host) | 5.5 ms | 0.48 ms | about 0.1 ms | 60 |

Reading: a save costs about 1 to 2 percent of one core here at 60 a minute, most of it building the envelope (`create_save` snapshots), then validation; the storage write itself is negligible. It scales with save size. On an older 8 GB laptop expect several times this. Not urgent at today's sizes; it becomes the first thing to fix once saves pass about 1 MB.

**F11 · One long task a second, unrelated to saving (new).** Every fixture, fresh included, shows about one long task (over 50 ms) per second in the idle window, while a fresh save costs 9 ms. Something else on the one-second tick (rendering or a panel poll; `main.js` runs pollers every 250 ms to 1 s) blocks the main thread. For the 8 GB target this matters more than the save. Not traced in this round.

**Architecture improvements applied this round.**
- Deleted the dead `to_base64` and `from_base64` in `src/main.js` (no callers; `encodeSaveFile` in `save_files.js` owns encoding). `main.js` 10,115 to 10,096 lines, 19 lines of AR1 headroom.
- Added the two bench tools above, so save cost is now a repeatable measurement rather than a guess.

**O11 · Skip building an unchanged save (proposal).** The durable writer already skips storing identical bytes, but only after `create_save` has built and stringified everything. A dirty counter on the commit path (any domain or native publication bumps it) would let a commit with no state change skip the build. Gain: most of the 60 builds a minute when idle. Cost: every owner must bump it, and a missed bump loses state, so it needs a test that compares skipped and forced saves byte for byte.

**O12 · Trace F11 (proposal).** Profile one idle second on the fresh fixture with the CDP profiler (the perf gate already opens a CDP session) and name the long task's owner.

**Checks this round:** `npm run test:changed` (620 files, 4,556 pass, 0 fail, 2 skipped); `npm run check:arch` (main.js growth -19, cycles unchanged at 205); `npm run check:rules` (pass, one pre-existing stale glob warning); working-tree temp build boots and saves in headless Chrome with no page errors (fresh and crowded). Not run: full `npm test` (the commit gate); save, reload, Export and Import in a browser, because no save format or persistence behavior changed. The in-checkout `npm run build` was not run because another lane has `index.html` modified and the build rewrites its bundle version line.

### More to consider (round 2)

**ACCOUNT FOR NOW**
- The save writer is also the settlement point for family, village news and the life record. Anything that changes state without a commit (a debug console edit, a future background worker) would skip those settlements. Keep every state change on the commit path.
- 60 writes a minute means the Tauri host store and mirror see a save a second too; its 5 s batching already absorbs that.

**LATER / DELEGATE**
- O12 trace: level small, sonnet lane, done when the long task's owner is named with a profile.
- O11 dirty counter: level medium, sonnet lane, done when idle saves skip the build and a skipped-versus-forced byte comparison test passes.

## Round 3: a long-term save architecture (2026-11-15)

Weibao: "long term expandable saving algorithm/archetecture?" Everything here is a proposal (AD56). The default widens what saves can hold; the one place it could narrow play (crash-loss window) is listed for his answer in Q3.

### What grows, measured

| Fixture | Save chars | `expansion` | Largest simulation tables |
| --- | --- | --- | --- |
| fresh | 47,650 | 1,251 | (none yet) |
| mid | 60,639 | 13,384 | sites 2.4k, knowledge 2.0k, log 1.4k |
| crowded (synthetic: 64 helpers, 512 claims) | 278,073 | 224,775 | events 55k, claims 46k (513), people 24k (68), causes 20k (641), relationships 16k, controllers 15k, knowledge 13k |

`simulation.log` is capped at 100 entries (`src/simulation_contracts.js:381`). Settled `claims`, `causes` and `events` have no bound or fold, so they grow with play time; `people`, `relationships`, `knowledge` and `controllers` grow with population. About 74% of the crowded save is the single `expansion.simulation` object. Base-game keys (`availabilities`, `inventories`) are a small, flat remainder.

From round 2: building the save costs about 20 ms, writing it about 0.1 ms. So a new storage backend alone does not make saving cheaper. The gain comes from **not rebuilding what did not change**, and from **keeping finished history out of the hot save**.

### Constraints any design must keep

- **K1 · Durable before publish.** Today every commit writes synchronously, then publishes state (`writeExpansionPlan`). IndexedDB, OPFS and host files are async. A crash today can lose the D3 counters and nothing else.
- **K2 · The desktop host watches localStorage and nothing else.** `store.rs` captures localStorage changes in the page's init script. Moving data to IndexedDB without a `host.js` port would bypass the host store, the mirror and recovery.
- **K3 · Export stays one file**, and import still reads `YAIR-UTF8-1:` saves. Upstream's `game version` field stays for attribution.
- **K4 · Same result in one jump or many** (the kernel's time-partition rule, PFP and AR12). Dormant worlds and folded history depend on it rather than on a new invariant.
- **K5 · One writer** (AR3). Domains own their data; one save owner writes.

### Options weighed

| Code | Shape | Verdict |
| --- | --- | --- |
| O13 | Monolith plus gzip and IndexedDB | Simplest. Still rebuilds the whole life on every commit, so cost grows with play. Good stopgap, wrong end state |
| O14 | **Chunked save with a manifest**: chunks per table and per world, dirty counters, only dirty chunks rebuilt | Cost follows what changed, not total size. **Default** |
| O15 | **Content-addressed chunks** (the unusual one): the manifest lists each chunk's hash; unchanged chunks are shared across generations | Backups, rollback, an incremental mirror and dedup all come free, and it reuses the mirror's existing SHA-256. **Adopt as O14's storage layout** |
| O16 | Event log as the authority (replay commands from a snapshot) | Replay breaks whenever command code changes, and every command must be deterministic forever. Rejected as authority; kept as a short dev journal (O20) |
| O17 | SQLite (Tauri side) or sqlite-wasm on OPFS | Queryable history, but two engines across hosts, and it is a stack change that needs a demonstrated gap (ARCHITECTURE_RULES target shape). Rejected for now; revisit if history needs queries the game cannot answer from chunks |

### The default design (O14 with O15 storage)

**1. Units.** A save is a **manifest** plus **chunks**.
- A chunk is `{owner, part, schema, data}`. `owner` is a registry domain id. `part` partitions large owners: by table (`simulation.claims`), then by world (`simulation.people@lotm`), then by id range when a table passes a size dial.
- The manifest is `{format: 2, gen, gameVersion, savedAt, chunks: {"owner/part": hash}}`. It stays small, a few KB.

**2. Dirty tracking (O11, promoted).** Each owner keeps a version counter per part and bumps it when it mutates. `create_save` becomes `buildDirtyChunks(lastVersions)`: it serializes only parts whose counter moved. Safety net: a periodic and on-exit full rebuild compares hashes with the incremental result. A mismatch logs which owner forgot to bump and writes the full result, so a missed bump costs time, never state.

**3. Validation per chunk.** Each owner validates its own chunks. Cross-owner checks (today's ordered list in `validateSaveEnvelope`) become declared dependencies that run only when one of their chunks is dirty. A full validation runs on load, import and the periodic full rebuild.

**4. Commit protocol (meets K1 by default).**
1. Build and validate the dirty chunks.
2. **Synchronous step:** write the dirty chunks' bytes plus the new manifest to a localStorage journal key (`yairpg.journal`). A typical commit's journal is a few KB, not the whole save. Then publish state, as today.
3. **Async step:** write the chunks (content-addressed, so an unchanged chunk is skipped) and the manifest to the main store, then clear the journal.
4. **Load:** read the main store's manifest, then replay a leftover journal on top. Crash loss stays where it is today (the D3 counters and nothing else).

**5. Storage backends behind one port.** `saveStore` exposes `{putChunk(hash, bytes), getChunk(hash), putManifest(m), getManifest(), journal}`:
- **Web:** IndexedDB for chunks and manifests; localStorage keeps the journal and small preferences. Quota grows from about 5 MB to hundreds of MB.
- **Desktop:** `host.js` gains `putChunk` and `putManifest`, and Tauri writes them as files (`saves/chunks/<hash>.gz`, `saves/manifests/<gen>.json`). The disk becomes the primary store, which retires the localStorage mirror trick (K2); the WebKit copy is just a cache.
- **Fallback:** a monolith in localStorage, for tests and a browser without IndexedDB.

**6. History tiers (the growth fix).** Each history table declares a hot bound as a dial (default proposal: the current year plus the last 200 entries).
- Older settled rows fold into a **summary chunk**, as `life_record` already does with `years` and `earlier`.
- The full detail moves to a **cold chunk** that is not rebuilt again and loads when something asks for it: an inspection, a chronicle page, a cause lookup.
- Cold chunks are immutable, so content addressing stores each one once, forever.

**7. Dormant worlds.** A world the player is not in becomes a frozen chunk set, and its packs need not load (pairs with O7 lazy packs). On return it settles the elapsed time in one jump, which K4 already guarantees matches stepwise play.

**8. Migrations per chunk.** Each owner declares `migrate(schemaFrom → schemaTo)` for its own parts. The manifest's `format` covers only the manifest's shape. Old monolith saves load through one adapter that splits them into chunks (`format 1 → 2`). After v0.1.0, old saves keep loading through that adapter.

**9. Generations, backups and rollback.** Keep the last N manifests (dial; default proposal 24 recent plus one per day for 14 days, mirroring today's mirror prune). Rollback means "load an older manifest". Garbage-collect chunks no kept manifest references. The current backup-key system, the mirror's history folder and "load backup" all collapse into this.

**10. Export and import.** Export bundles the manifest and every reachable chunk into one gzip file with a `YAIR-GZ-2:` prefix. Import validates per chunk, preflights as today, and still reads `YAIR-UTF8-1:`. Optional: an "export with cold history" switch, defaulting to on.

**11. Lives and archives.** Ended lives and heirs become manifests whose chunks are shared with the living life where unchanged. An heir costs only what differs.

### Staging (thresholds are dials)

| Step | When | Change | Done check |
| --- | --- | --- | --- |
| S0 | Before v0.1.0 | O1 re-key: wave-named keys become registry owners | Hand lines gone from `save_files.js` and `load()`; save, reload, Export and Import pass in a rebuilt browser |
| S1 | Before v0.1.0 | `saveStore` port with the monolith backend; `create_save` emits chunks that the port joins | Byte-identical saves before and after on the perf fixtures (the gate's det check) |
| S2 | When build time passes 25 ms on mid, or any save passes 1 MB | Dirty counters plus the full-rebuild safety net | Idle commits mostly skip the build; the safety-net comparison reports zero mismatches over a long gate run |
| S3 | With S2 | IndexedDB and host-file backends, journal commit, content addressing, generations | Crash test (kill between the sync and async steps) loses nothing but counters; the Tauri wipe test still recovers |
| S4 | When a history table passes its hot bound in real play | History tiers: folds and cold chunks | Same scenario gives the same visible state with and without folding; cold detail loads on demand |
| S5 | With O7 lazy packs | Dormant worlds | Leave a world, return after N days: same state as a stepwise run |
| S6 | Any time, dev-only | O20 command journal since the last manifest, for bug replay | A recorded session replays to the same manifest hash on the same build |

S0 and S1 are worth doing before release because they remove the format-freeze risk (R3). Everything after them waits for its measured trigger.

### Proposed standing lines (for ARCHITECTURE_RULES, not added without Weibao's yes)

- **AR20 (proposal) · Save cost follows change, not size.** By default a commit rebuilds the parts whose owner marked them changed, and no others, because rebuilding unchanged parts is the measured cost; a periodic full rebuild checks that.
- **AR21 (proposal) · History has a hot bound and a fold.** A table that grows with play declares its bound (a dial) and its fold, so finished history leaves the hot save without being lost.
- **AR22 (proposal) · Every saved part carries its own schema** and migration, so owners change shape without bumping the whole save.

### Q3 for Weibao

**Q3 · Crash window.** The default keeps today's guarantee (only the counters can be lost) by writing a small journal synchronously on each commit. A simpler variant would write everything async and could lose up to a few seconds of play on a crash. That narrows a guarantee, so it waits for your answer: keep the journal (default), or accept a few seconds of loss to keep the code simpler?

### More to consider (round 3)

**ACCOUNT FOR NOW**
- Claims, causes and events are unbounded today. Even before S4, a lane touching them should not add more permanent per-tick rows.
- Content addressing means identical chunks across lives are shared. Deleting a life then frees its unique chunks and keeps the shared ones, so a "free space" view counts reachable bytes, not file sizes.
- Sealed secrets live in the save. Cold chunks and exports carry them too, so inspection tools keep reading through projections (AR8) rather than raw chunks, so a secret stays behind its discovery route.
- Hashes must be computed over canonical JSON (sorted keys), or the same state hashes differently. `hash_entries` in `mirror.rs` already sorts.

**LATER / DELEGATE**
- S0 and S1: level medium each, sonnet lanes, one at a time on `save_files.js` and `main.js` with a writer reservation (AR15). Done checks as in the table.
- Chunk-size spike: level small, haiku or sonnet, split the crowded and mid fixtures by the proposed parts and report chunk counts and sizes, to set the default size dials.

## Round 4: S0 and S1 started, growth, the web question, size and run performance (2026-11-15)

Weibao: "GO ahead, consider how much things will change wiht more implementations and more? will we still need to worry abput it being a web game? or do we package as zip or something?" and then "Also size efficicentcy, and run performance?" Task record: [save architecture checkpoint](../gm/dispatch/save-architecture-2026-11-15/CHECKPOINT.md).

### What landed (implemented, below floor: no player journey crosses it yet)

- **`src/save_parts.js`** (S1 core). `splitSave` cuts a save into parts: one per top-level key, with `expansion.simulation` split per table. `joinSave` rebuilds the same bytes. `changedParts` diffs two manifests, and `partHash` is a fast synchronous change detector. No runtime caller yet. The planned callers are the chunked store (S3) and dirty tracking (S2).
- **Owner table** (S0 step 1). `HAND_SAVE_KEYS` declares an owner for each of the 80 keys `create_save` writes by hand: upstream, fork, or wave-named. It also gives a proposed lasting name for each of the 15 wave-named keys (`p23_market_life` becomes `market_life`, `pacing_e1` becomes `pacing`, and so on).
- **`tests/save_parts.test.js`.** Byte-identical round trip on all three perf fixtures, change isolation, a missing part refusing to load, and a guard: **a new hand-written key in `create_save` fails the test until it has an owner.** The table blocks new wave-named keys today.
- **`scripts/perf/save_probe.mjs`** now also reports part churn per commit, gzip and export sizes, and a CPU profile (`--profile`, from an unminified temp build).

**Not done, and why:** the renames themselves (S0 step 2). Each wave name is also a staging key on the commit path, at about 100 sites, mostly in `main.js`. Renaming means changing those sites, adding a load alias so your current life keeps loading, then testing save, reload, Export and Import in a rebuilt browser. Default proposal: do it as one structural round (AR9) with a writer reservation on `main.js` (AR15), before v0.1.0, keeping your life through the alias (this answers Q1 with "migrate", the reversible choice).

### How much changes as implementations grow

| Measure | Oct 10 | Oct 20 | Nov 1 | Nov 8 | Nov 15 |
| --- | --- | --- | --- | --- | --- |
| `dist/bundle.js` | 4.5 MB | 6.0 MB | 8.2 MB | 8.9 MB | 11.0 MB (3.3 MB gzip) |
| JS files in `src` | 369 | 664 | 1,189 | 1,339 | 1,851 |

- **Code grows about 1.3 MB a week.** At that rate the bundle passes 20 MB around mid-December, and canon-as-data (PFP1) will add catalogue tables on top. All of it parses at boot whichever world you play. **This is the first scaling wall, ahead of saves.** Lazy world packs (O7) are the fix, and they pair with dormant worlds (round 3, step 7).
- **Saves grow with play, not with code.** Catalogues are static data in the bundle; a save holds state. Each new world adds its own state parts plus history rows. The chunked design scales with that because cost follows what changed. Measured now: **about 7 to 8 of 74 to 102 parts change per commit, 16 to 19% of the bytes.** Rebuilding changed parts alone (S2) would cut save build work about five-fold today, and by more as cold history accumulates.
- **What changes every commit:** `current time`, `saved_at`, `total_playtime`, `levels`, `skillRecords`, `absorb_local_life`, `expansion` (its clock) and `expansion.simulation/controllers`. These stay small parts, so a commit's real write is a few KB.

### The web question

You don't need to worry about being a web game; the cost is small and the benefits are real.
- **The desktop app is already the package.** Tauri wraps the same HTML and JS in a native `.app` (17 MB, ad hoc signed), with disk saves, a mirror and recovery. That is the "zip": the web build sits inside it.
- **A plain zip of `index.html` plus `dist/` does not open by double-click.** The bundle is an ES module, and browsers block module scripts from `file://`. A zip works on a static host (itch.io HTML5 uploads, GitHub Pages) or with `npm run serve`. So: Tauri bundles for players on desktop (`.app` or `.dmg` now, Windows `.msi` and Linux AppImage from the same Tauri project when wanted), and the web zip for sharing or for itch.io.
- **What being web-capable costs:** a few habits. Storage needs a port with a browser fallback (S3 already does this). There's one main thread, but Web Workers exist in both hosts. File access goes through `host.js`. None of these blocks a feature, because a desktop-only feature can live behind `host.js` with a weaker browser fallback.
- **What it buys:** the game MCP, every headless browser check, visual baselines, fixture boots and the perf probe all run the web build. Dropping it would cost the verification stack.

Default proposal: **desktop first through Tauri, web build kept as a free, working fallback, published to the fork's pages or itch.io at release only if you want to share it** (Q2 stays open as a share question, not a constraint).

### Size efficiency

| Fixture | JSON | In localStorage (UTF-16) | Export file (base64) | Gzip | Gzip ratio |
| --- | --- | --- | --- | --- | --- |
| fresh | 88 KB | 176 KB | 117 KB | 19 KB | 4.5x |
| mid | 101 KB | 202 KB | 135 KB | 23 KB | 4.5x |
| crowded | 317 KB | 634 KB | 422 KB | 36 KB | 8.7x |

- Storage doubles the bytes (UTF-16), and the export adds a third (base64). A gzip export (O5, `YAIR-GZ-1:`) would make a crowded export about 50 KB instead of 422 KB. Gzip chunks in the S3 store would cut the stored life by four to nine times, and they move the 4 MB browser wall to roughly 20 to 40 MB of raw state before IndexedDB even matters.
- The bundle: 11 MB raw, 3.3 MB gzip. Tauri serves it from disk, so transfer size does not matter on desktop, but **parse and compile time does**, and gzip does not help that. Lazy packs (O7) do.
- In-save waste worth trimming when S0 renames run: whole structured copies of state that stop changing after creation (cold history, settled claims), which round 3's tiers handle.

### Run performance (idle, headless Chrome, this Mac, load about 10)

| Fixture | Script busy | Task busy (script, style, layout) | Long tasks in 12 s | Worst long task | DOM nodes | Heap |
| --- | --- | --- | --- | --- | --- | --- |
| fresh | 8 to 11% | 21 to 30% | 10 to 12 | 77 to 109 ms | 29k to 49k | 76 to 136 MB |
| mid | 16% | 30% | 12 | 156 ms | 30k | 95 MB |
| crowded | 34 to 49% | 61 to 87% | 12 to 20 | 330 to 529 ms | 48k to 80k | 103 to 146 MB |

The save accounts for 1 to 2 points of that. Where the rest goes, from the CPU profile (crowded; source modules mapped from an unminified build):

| Self time | Where | What it is |
| --- | --- | --- |
| 9.0% | `checkVisibility` (native) | Panels asking "am I on screen?" on their own timers; each call can force a style pass |
| 6.0% | `ui_components.js` `refresh` | Shared component refresh on a poll |
| 4.7% + 2.9% | `proto23_shell.js` and `reports_dock.js` `render` | Shell and Reports redraws |
| 3.6% | `workspace_views.js` `syncProse` | Prose sync on a poll |
| 2.4% + 1.8% + 1.3% | `world_completion_bridge.js`, `world_completion_facts.js`, `world_completion_runtime.js` | World-completion facts rebuilt per frame |
| 1.9% + 1.4% + 1.5% | `main.js` `buildSimulationNativeContexts`, `simulation_effects.js` `buildSimulationFacts`, `facts_frame.js` | Simulation facts rebuilt for every world's actions |
| (fresh) | `book_world_mol_actions.js` `molFacts`, `book_world_mol_host.js` `previewMolCommand` | Mother of Learning facts computed while the player is in the Frontier |

**F12 · Thirty-two UI pollers (new).** `src` has 40 `setInterval` calls across 32 files and 36 `checkVisibility` or `offsetParent` checks. Each panel runs its own clock and its own visibility check. There's no single render scheduler. AR3 forbids a second game clock; UI timers are its display-side cousin.

**F13 · Facts for worlds you are not in (new).** Action previews and facts frames build contexts for every world's actions on each render. The cost grows with every world added, which is the same curve as the bundle.

**F14 · DOM size (new).** 29k to 80k nodes at idle. Hidden panels stay in the DOM, and the pollers still touch them.

### Options for run performance

| Code | Option | Gain | Cost |
| --- | --- | --- | --- |
| O21 | **One display scheduler**: panels register `{dirty(), render()}`, and the scheduler runs on commit publications (the existing `deferSimulationRender` batch) plus a slow fallback tick. One `IntersectionObserver` answers visibility for all panels, so nobody calls `checkVisibility` on a timer. `change_badges.js` `registerChangeCounter` is the seam to extend | Removes most of the 9% plus the poll renders. Idle cost then follows what changed, the same principle as saves | Touches 32 files, one at a time, each a structural change (AR9) |
| O22 | **Facts per active world**: facts frames build contexts for the current world and its open crossings. Other worlds' facts build when asked (their panel opens, a crossing previews) | Cost stops growing with the world count | Needs a world-scope field on action definitions; dovetails with O7 and dormant worlds |
| O23 | **Unmount hidden panels**, or render them empty until shown | Smaller DOM and style passes | Panels must rebuild from their projection on show (AR8 makes that cheap) |
| O7 | Lazy world packs (round 1) | Boot parse time and memory | As before |

Proposed standing line (not added without Weibao's yes): **AR23 (proposal) · Display work follows change.** A panel renders when its inputs changed and it is on screen; a timer is a fallback, not the driver.

### Order, ranked by payoff per effort (all proposals)

1. **O21 display scheduler**, the biggest measured idle cost. Start with the five hottest pollers above.
2. **O7 + O22 lazy packs and active-world facts**, the curve that grows with every world.
3. **S0 step 2 renames with a load alias**, before v0.1.0.
4. **S2 dirty parts** (about five-fold less save build work), when save build passes its dial.
5. **O5 gzip export**, small and independent.

### More to consider (round 4)

**ACCOUNT FOR NOW**
- Headless Chrome on an 18-core M-series Mac is a kind host. The 8 GB target needs one run on real older hardware before any budget is set from these numbers.
- WebKit (Tauri) and Chrome differ: `checkVisibility` and style passes may cost more or less in WKWebView. `scripts/tauri/harness.mjs` can repeat the probe in the real host.
- Fresh-fixture heap and DOM varied between runs (76 to 136 MB, 29k to 49k nodes): the start screen and opened panels differ by timing. A fixed panel layout in the probe would make runs comparable.
- `levels` and `skillRecords` change every commit. If they're large in long lives, splitting them per skill keeps each commit's dirty part small.

**LATER / DELEGATE**
- O21 first slice: level medium, sonnet lane. Done when the five hottest pollers render through one scheduler and the probe shows lower crowded idle task busy with no visual-baseline change.
- O22 spike: level small, sonnet. Done when the facts frame reports which worlds it built per render and a fresh Frontier life builds Frontier facts alone.
- Tauri probe run: level small. Done when the same report comes from WKWebView.
