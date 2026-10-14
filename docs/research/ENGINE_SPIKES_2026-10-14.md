# Engine spikes, 2026-10-14

## CHECKPOINT

ER7 complete as a synthetic Node research lane. S1, S2 and S3 executed in `/tmp/yairpg-er7` with their own package. S4 omitted because ER1 already measured the pure expansion path. Scripts, lockfile, raw samples and run logs are archived in [ER7](../gm/dispatch/engine-runtime-2026-10-14/ER7/REPORT.md). No runtime migration or gameplay acceptance is claimed. Resume from that report; recommendations below are proposals.

## Scope and evidence

ER7-E1, READ: [common rules](../gm/dispatch/engine-runtime-2026-10-14/COMMON.md), [palette](../ENGINE_RUNTIME_PERFORMANCE_AND_STACK_CONSIDERATIONS_2026-10-14.md), [save/scale E1–E10](../ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md), [offline clock audit](OFFLINE_TIME_AND_BRANCH_CLOCK_AUDIT_2026-10-14.md), AGENTS.md, PROJECT.md, user preferences and `docs/USER_VISION.md:1877-1894` keep this as research into portable boundaries, not an accepted engine change. Desktop/laptop priority, one-realm/one-prestige milestone and existing save semantics stay with those owners. No UI was changed or measured. Mobile optimization remains deferred.

ER7-E2, READ: `src/save_files.js:100-153` requires native/component save domains; `:159-181` defines marked UTF-8 JSON exports; `:194-211` measures UTF-16 storage bytes under a shared 4 MiB guard. `src/expansion_persistence.js:8-20,36-50` validates, parses or clones the envelope, patches domains, stringifies, writes, then permits publication. `src/main.js:4940-4967,5177-5202` builds native and expansion domains. This spike models that envelope structure with generated IDs and Unicode receipts. It does **not** call those validators or the real loader. Fixtures are shape models, not supported playable saves. No repo modules were copied or imported, and no personal save or private pack was read. [Read provenance](../gm/dispatch/engine-runtime-2026-10-14/ER7/read-provenance.json) pins the observed files, not a frozen shared checkout.

ER7-E3, READ: [ER1](RUNTIME_HOTSPOT_AUDIT_2026-10-14.md) already covers real pure-path advance, full validation and plan persistence. [ER3](TECH_STACK_OPTIONS_2026-10-14.md) owns worker, codec, browser storage and recovery contracts. This report adds container, bridge and codec measurements, rather than repeating those owners.

ER7-E4, MEASURED: Node v22.23.3, macOS 27.2 build 26B5101f, darwin/arm64, Apple M5 Pro, 18 logical CPUs; npm 10.9.9. Scratch install resolved **miniplex 2.0.0** and **@sqlite.org/sqlite-wasm 3.53.4-build2**, SQLite engine 3.53.4. Install reported 0 vulnerabilities. Versions and dependency integrity are pinned in the copied manifests. Commands: `node -v`, `npm -v`, `sw_vers`, `uname -m`, `sysctl -n machdep.cpu.brand_string`, and `npm install --save-exact miniplex @sqlite.org/sqlite-wasm` in `/tmp/yairpg-er7`.

ER7-E5, MEASURED method: five warmups and 31 samples per case; median and nearest-rank p95 elapsed milliseconds. No forced GC, profiler or CPU isolation. Compared cases rotate order within each round; S2 local baselines precede the rotated worker cases. S1 divides a batch by its tick count, so its p95 is a **batch-average per-tick** p95, not a single-tick tail. S2/S3 measure individual operations. Fixture construction, assertions and database resets are outside timing unless named. The three final benchmark processes ran sequentially. Raw JSON records every sample and start/end environment.

ER7-E6, MEASURED contention: start/end 1-minute load averages were S1 36.68/35.34, S2 76.97/67.49, S3 35.80/59.14; 5/15-minute loads also remain in the JSON. `uptime` corroborated heavy concurrent work. No other process was stopped. These are elapsed results on a busy machine, not stable CPU ratios, browser main-thread long tasks, energy numbers or input latency. Local baseline inversion in S2 and loop-style variation in S1 are reasons to avoid precise universal speed claims. An idle-host repeat plus a rebuilt desktop trace would be the authority for adoption budgets.

## S1: plain actors versus miniplex

ER7-S1, MEASURED command, working directory `/tmp/yairpg-er7`:

```sh
node actors.mjs > actors-run.log
```

[Script](../gm/dispatch/engine-runtime-2026-10-14/ER7/actors.mjs), [raw samples](../gm/dispatch/engine-runtime-2026-10-14/ER7/actors-results.json), [run log](../gm/dispatch/engine-runtime-2026-10-14/ER7/actors-run.log). Final run 2026-10-14T05:04:43.448Z to 2026-10-14T05:04:47.615Z.

Each actor is a plain object with stable ID, world ID, three needs, utility weights, small facts and chosen action. Each tick decays food/rest/social needs, scores three actions, selects the largest score with fixed tie rules and restores a little of the selected need. This is a synthetic kernel, not the current gameplay scheduler. Array and miniplex cases use exactly the same actor function. Queries require `needs` and `active`. All actor fields agree after the same warmup/sample ticks; inactive actors stay unchanged. This proves container iteration equivalence for the kernel, not live-body or save compatibility.

With all actors active, median / p95 ms per tick:

| Code / actors | Plain for-of + active check | Plain indexed + active check | Cached active array, indexed | miniplex query, for-of | miniplex query, indexed |
| --- | --- | --- | --- | --- | --- |
| ER7-S1A1 / 1,000 | 0.0184 / 0.0238 | 0.0186 / 0.0269 | 0.0107 / 0.0479 | 0.0202 / 0.0301 | 0.0173 / 0.0213 |
| ER7-S1A2 / 10,000 | 0.0995 / 0.1262 | 0.1486 / 0.1881 | 0.1435 / 0.1780 | 0.2229 / 0.2806 | 0.0828 / 0.1138 |
| ER7-S1A3 / 100,000 | 1.3680 / 2.6088 | 1.8667 / 4.0226 | 1.8281 / 3.8712 | 2.4774 / 4.8172 | 1.1636 / 2.0451 |

With only 10% active, median / p95 ms per tick:

| Code / actors | Plain for-of + active check | Plain indexed + active check | Cached active array, indexed | miniplex query, for-of | miniplex query, indexed |
| --- | --- | --- | --- | --- | --- |
| ER7-S1B1 / 1,000 | 0.0031 / 0.0035 | 0.0043 / 0.0052 | 0.0018 / 0.0023 | 0.0025 / 0.0032 | 0.0013 / 0.0014 |
| ER7-S1B2 / 10,000 | 0.0306 / 0.0465 | 0.0459 / 0.0928 | 0.0183 / 0.0316 | 0.0269 / 0.0576 | 0.0094 / 0.0433 |
| ER7-S1B3 / 100,000 | 0.2981 / 0.3619 | 0.4048 / 0.4843 | 0.1647 / 0.2056 | 0.2190 / 0.2716 | 0.0844 / 0.1360 |

Batches: 200 ticks at 1k, 20 at 10k, two at 100k. Cached plain arrays and miniplex queries both select membership once at setup. Thus the sparse benefit can come from avoiding inactive scans without adopting ECS. The indexed cases also avoid generator/iterator overhead. No timed component churn, query rebuild, dynamic membership, relationship graph, allocation retention or world scheduling is present. A cached array would need an invalidation owner in real play, just as miniplex needs component changes routed through its API.

ER7-S1C, MEASURED setup is a single non-warmed observation, excluded from ticks; it includes actor creation, active-array filtering and, for miniplex, world insertion/query connection. For 100k all-active actors: plain for-of 199.37 ms; cached active array 58.29 ms; indexed miniplex query 113.91 ms. Timing noise prevents a firm setup ranking. Every setup observation is in the raw file.

ER7-S1D, INFERRED palette change: qualify **LB1**. Miniplex is a query/membership option, not a blanket fast-loop upgrade. The ordinary miniplex iterator was slower than plain for-of at all three dense sizes in this run. Indexed miniplex was competitive, and sparse iteration helped, but the cached-array control captured much of that benefit too. Start with explicit active/due membership under **RT6/RT7/AI5** when live profiles show scans; adopt an entity store for valuable membership semantics after measuring churn. This simple 100k kernel does not justify **EG4/TS7**, nor does it prove the full world sim is cheap.

## S2: worker roundtrip and full step

ER7-S2, MEASURED command, working directory `/tmp/yairpg-er7`:

```sh
node workers.mjs > workers-run.log
```

[Driver](../gm/dispatch/engine-runtime-2026-10-14/ER7/workers.mjs), [worker](../gm/dispatch/engine-runtime-2026-10-14/ER7/worker.mjs), [raw samples](../gm/dispatch/engine-runtime-2026-10-14/ER7/workers-results.json), [run log](../gm/dispatch/engine-runtime-2026-10-14/ER7/workers-run.log). Final run 2026-10-14T05:05:55.888Z to 2026-10-14T05:06:03.518Z.

The input is 1k/10k actors, 50/500 future jobs, eight world clock/fact records, sequence/clock/RNG metadata and nested actor facts. There are no functions, DOM nodes or classes. Input JSON sizes are 175,791 / 1,759,010 UTF-8 bytes; returned full stepped state plus up to 16 action events and remaining work is 192,109 / 1,914,738 bytes. Return payload is intentionally a full changed slice, not an optimally bounded delta. Every result agrees with the synchronous step. Both outgoing and returning transfer lists are exercised, and detached sender buffers are asserted.

Object mode uses `postMessage`'s implicit structured clone; local `structuredClone` is shown as a separate baseline, not an extra pre-message copy. Byte modes use **the same lossless JSON representation**. The clone/transfer echo tests isolate copying versus ownership transfer of an already-packed buffer. Input buffer creation, output inspection and equality checks are outside echo timing. Full byte-step timing includes sender stringify/UTF-8 encode, scheduling/messages, worker decode/parse/step/stringify/encode, and main decode/parse. Assertions are outside all timing. This is not a typed numeric ECS layout benchmark.

Median / p95 ms:

| Code / operation | 1,000 actors | 10,000 actors |
| --- | --- | --- |
| ER7-S2T1 / Local structuredClone of input | 2.0532 / 3.1632 | 18.3193 / 19.8173 |
| ER7-S2T2 / Local clone + same step | 1.9287 / 2.4282 | 16.2351 / 18.7692 |
| ER7-S2T3 / JSON stringify + UTF-8 pack input | 0.4737 / 0.8504 | 3.7539 / 4.2097 |
| ER7-S2T4 / JSON parse result text, excluding UTF-8 decode | 0.9414 / 1.2709 | 6.8172 / 7.6651 |
| ER7-S2T5 / Object echo, implicit structured clone both ways | 3.8290 / 5.4813 | 27.9375 / 36.6643 |
| ER7-S2T6 / Prepacked bytes echo, clone both ways | 0.2096 / 0.6824 | 1.0330 / 1.8316 |
| ER7-S2T7 / Prepacked bytes echo, transfer both ways | 0.1248 / 0.7034 | 0.1200 / 1.2061 |
| ER7-S2T8 / Object step, implicit structured clone both ways | 4.0409 / 9.1492 | 28.1510 / 37.3229 |
| ER7-S2T9 / JSON byte step, cloned buffers, full boundary | 3.7411 / 4.3355 | 22.2262 / 27.4504 |
| ER7-S2T10 / JSON byte step, transferred buffers, full boundary | 3.6885 / 4.3612 | 21.0719 / 27.8941 |

ER7-S2C, MEASURED five cold worker starts to the ready message: 33.885, 38.628, 39.250, 29.560, 31.698 ms, including thread creation and module initialization. The last worker is kept warm for all cases. Startup is not included in the table.

ER7-S2D, INFERRED palette change: keep **TS4/RT2/RT8** conditional and add a message-size contract. At 10k, transferred prepacked echo was 0.1200 / 1.2061 ms, but the full transferred JSON step was 21.0719 / 27.8941 ms. Ownership transfer removes one copy mechanism; it does not remove encoding or reconstructing the graph. Local clone + step was 16.2351 / 18.7692 ms. A worker may free the UI while increasing total latency. The useful next worker gate is a retained simulation state, commands in, bounded actor-qualified patches out, plus version/cancel/stale-result handling and atomic main-owner publication. That retained-state protocol was **not** measured here.

ER7-S2E, STATED, checked 2026-10-14: [Node worker documentation](https://nodejs.org/download/release/v22.23.0/docs/api/worker_threads.html) describes structured-clone messages and transferred ArrayBuffer ownership. [HTML workers](https://html.spec.whatwg.org/multipage/workers.html) define browser dedicated workers and lifecycle. INFERRED browser qualification: numeric costs may differ with engine, process placement, browser scheduling, module loading and background/suspend policy. Node's warm thread numbers do not predict Chrome/Safari latency or closed-tab accrual. Workers do not supply DOM access or authorize a changed offline policy. Browser checks remain OPEN and follow ER3-T5 and the offline audit.

## S3: developed saves, gzip and SQLite WASM

ER7-S3, MEASURED command, working directory `/tmp/yairpg-er7`:

```sh
node saves.mjs > saves-run.log
```

[Script](../gm/dispatch/engine-runtime-2026-10-14/ER7/saves.mjs), [fixture generator](../gm/dispatch/engine-runtime-2026-10-14/ER7/fixtures.mjs), [raw samples](../gm/dispatch/engine-runtime-2026-10-14/ER7/saves-results.json), [run log](../gm/dispatch/engine-runtime-2026-10-14/ER7/saves-run.log). Final run 2026-10-14T05:04:58.381Z to 2026-10-14T05:05:47.105Z.

Two synthetic envelopes contain native character/calendar/levels/inventory/availability/book/effect/retired domains, an expansion actor map, world clocks, future jobs, simulation people and retained logs. Developed: 1k actors, 1k inventory keys, 2k receipts, plus duplicated life-record/NPC projections. Stress: 5k actors, 5k item keys, 10k receipts. IDs/text are deterministic and repetitive, with `café 工作` exercising Unicode; the compression ratio is not a forecast for all future worlds. Expansion/domain schemas are a model, not actual validator-compatible gameplay state.

ER7-S3B, MEASURED bytes, same `node saves.mjs > saves-run.log` command:

| Code / fixture | JSON UTF-8 | JSON UTF-16 guard bytes | Gzip binary | Gzip base64 UTF-16 bytes | SQLite TEXT DB image | SQLite split DB image |
| --- | --- | --- | --- | --- | --- | --- |
| ER7-S3B1 / 1,000 actors | 1,085,087 | 2,140,164 | 75,860 | 202,296 | 1,097,728 | 1,261,568 |
| ER7-S3B2 / 5,000 actors | 5,484,546 | 10,819,082 | 350,792 | 935,448 | 5,496,832 | 5,947,392 |

Gzip binary is 6.99% / 6.40% of UTF-8 JSON. SQLite images are exported with `sqlite3_js_db_export`; export time is excluded from the timings below. WASM asset is 868,907 bytes uncompressed, excluding JS glue. SQLite init was 26.701 ms, one observation including module initialization but excluding static import time and any browser download. No bundle size conclusion is claimed.

Median / p95 ms:

| Code / operation | 1,000 actors | 5,000 actors |
| --- | --- | --- |
| ER7-S3T1 / JSON stringify + in-memory string sink | 3.1838 / 7.6916 | 12.9013 / 30.3137 |
| ER7-S3T2 / JSON parse | 4.9173 / 6.7191 | 16.7389 / 44.8011 |
| ER7-S3T3 / Gzip of prepared JSON text | 7.5301 / 22.6439 | 21.7434 / 91.9939 |
| ER7-S3T4 / JSON stringify + gzip | 10.8807 / 30.1132 | 36.6513 / 100.5880 |
| ER7-S3T5 / Gunzip + JSON parse | 9.4140 / 37.9410 | 30.2053 / 204.5498 |
| ER7-S3T6 / SQLite TEXT snapshot: stringify + transaction | 4.6861 / 12.2140 | 19.4406 / 61.7376 |
| ER7-S3T7 / SQLite TEXT snapshot: read + parse | 5.9530 / 11.1560 | 22.5955 / 61.5489 |
| ER7-S3T8 / SQLite split records: full write | 16.8908 / 42.9191 | 61.4052 / 214.6856 |
| ER7-S3T9 / SQLite split records: full read | 13.1945 / 69.4686 | 47.7519 / 161.2076 |
| ER7-S3T10 / SQLite split records: clock/header + 10 actor update | 0.1890 / 0.4042 | 1.0534 / 3.1312 |

ER7-S3C, MEASURED operation boundaries:

| Code | What was timed and checked |
| --- | --- |
| ER7-S3C1 | JSON writes stringify an already-built object into a Map string sink. This measures a **localStorage-sized string**, not localStorage, disk, quota exceptions or a durable save. UTF-16 bytes model the current source guard. Every string equals the expected serialization; parse restores every field. |
| ER7-S3C2 | Gzip uses Blob text stream → CompressionStream('gzip') → Response arrayBuffer. Prepared-text compression still includes Blob text encoding and stream setup; full write adds JSON stringify. Read includes gunzip text decode and JSON parse. Every codec result is decoded outside timed writes and compared exactly, including Unicode. Base64 size is recorded, but base64 encoding time and a marked gzip export reader are not benchmarked. |
| ER7-S3C3 | SQLite snapshot is one TEXT row, JSON stringify + explicit BEGIN/COMMIT + prepared bind/update. Read is SELECT + JSON parse. Same envelope, no queries or normalized-format advantage. Every retrieved text/object equals the original. |
| ER7-S3C4 | SQLite hybrid uses JSON top-level/native domains, expansion/simulation headers, separate actor/person rows and ordered history rows. Full write serializes all records, deletes/replaces all rows in one transaction; full read selects/parses/reconstructs the whole object. It preserves the duplicated native life projections. This is a lossless synthetic adapter, not an accepted save format. |
| ER7-S3C5 | Hybrid patch updates expansion clock/sequence/header and ten actor rows in a transaction. It includes source-object splitting, Object.entries/slicing, JSON encoding and SQL binds. Reset/full initial write is excluded. Restored full state equals exactly those intended changes. It is less work than a whole-envelope write by design, not an apples-to-apples serializer speed claim. A thrown/interrupted app-level publisher and OPFS durability were not exercised. Explicit SQL UPDATE followed by ROLLBACK preserves the original fixture in memory. |

ER7-S3D, INFERRED capacity arithmetic: the 1k primary uses 2,140,164 UTF-16 bytes; two identical generations use 4,280,328 before keys, already exceeding the current 4,194,304-byte shared guard. The 5k primary alone exceeds it. Binary gzip fits comfortably in these fixture sizes; base64 storage still has its expansion shown above. This is arithmetic against a READ source guard, not a browser quota failure measurement. Compression does not decide which history can be dropped or remove atomic cursor/reward requirements.

ER7-S3E, STATED, checked 2026-10-14: [the package's Node support](https://github.com/sqlite/sqlite-wasm#nodejs-support) limits Node to in-memory databases without persistence. [Compression Standard](https://compression.spec.whatwg.org/) defines the stream codecs. The installed WASM library actually ran in Node with in-memory `:memory:` DBs. No OPFS, IndexedDB, Web Lock, process-crash recovery, disk sync, browser import, save migration or storage backend replacement was exercised.

ER7-S3F, INFERRED palette changes: **DA3** gets direct synthetic size evidence and a measured latency tradeoff. Start with an optional versioned compressed export or binary snapshot, preserving existing readers and bounded decompression. Qualify **LB2/DA1/DA2/DA6**: SQLite is attractive when actual indexed queries and small transactional changes earn its integration cost. Merely storing the whole JSON envelope in SQLite was slower than the Map-sink stringify, and neither SQLite DB image was smaller than raw JSON. Its small-update benefit requires changed data ownership and a migration/recovery adapter. Current envelope validation, native construction and browser writes may dominate anyway, as ER1 shows.

## S4: existing real expansion baseline

ER7-S4, READ, not measured again by this lane: [ER1-B1/B6](RUNTIME_HOTSPOT_AUDIT_2026-10-14.md#headless-measurements) ran `node docs/gm/dispatch/engine-runtime-2026-10-14/ER1/benchmark.mjs` with copied source and actual validated synthetic fixtures. Its [raw results](../gm/dispatch/engine-runtime-2026-10-14/ER1/benchmark-results.json) cover `advance_1_future_jobs` and `advance_60_settle_all`, among other stages. ER1 reports severe host contention and nonmonotonic fixtures, so those results cannot be combined with S1's tiny invented kernel as a claim that ECS fixes the real scheduler. No additional source copy or pure-path run was needed.

## Ranked proposals and what would change the palette

All recommendations are INFERRED from the measured slices. None authorizes an install or runtime change.

| Rank / code | Proposed palette clarification | Value / cost | Evidence that would change it |
| --- | --- | --- | --- |
| 1 / ER7-R1 | **PF1/PF2/E6:** keep the raw fixtures and phase boundaries; profile real validation, projection and browser writes before picking a backend. | High information value; low reuse cost plus a bounded idle-host/browser profile. | A rebuilt desktop trace names the dominant stage and stable device budget. Node numbers alone do not select a new engine. |
| 2 / ER7-R2 | **DA3:** optional compressed exports/binary backups are now worth a bounded compatibility prototype. | Large synthetic byte reduction; moderate codec marker, old-reader and bounded-decode work. | Real synthetic envelope corpus stays small enough after compression and decode time fits the selected budget; corrupt/oversized/old-format reader gates pass. If CPU dominates and capacity is ample, compression stays export-only. |
| 3 / ER7-R3 | **LB1/RT6/RT7/AI5:** try explicit active/due arrays before a mandatory ECS; use miniplex for useful component membership rather than a claimed universal speed gain. | Low-cost scan reduction; an ECS adapter adds identity/save and membership routing work. | Real heterogeneous actors with frequent churn/queries show consistent end-to-end gains over maintained plain arrays, including setup and export/restore. This spike contains no bitECS/typed-column comparison. |
| 4 / ER7-R4 | **TS4/RT2/RT8:** spike a retained-state worker and bounded command/result patches rather than full snapshots each tick. | Potential UI relief; moderate ownership, sequencing, cancellation and publication work. | Rebuilt browser catches up responsively with bounded bridge cost and equal durable results. If the kernel is tiny like S1, transport can dominate and a worker may add latency. |
| 5 / ER7-R5 | **LB2/DA1/DA2/DA6:** choose SQLite for query/transaction use, not faster whole-JSON serialization. Consider plain IDB binary snapshots if queries are unnecessary, following ER3. | Small updates are promising; high schema, migration, worker/OPFS and recovery cost. | A real access pattern needs indexed facts/history and incremental writes, and durable interruption/import gates pass. An in-memory commit cannot close that gate. |

ER7-D1, INFERRED: **EG0 stays the leading proposal.** These results supply no evidence requiring Godot/Unity/Rust or a language rewrite. That is a result of the bounded measurements, not an accepted platform decision. **EG4/TS7** remain triggered by a measured expensive pure kernel after bridge cost. **AI1/LB6** get a working synthetic needs/utility kernel, not a validated autonomous NPC design, and no player-hunger policy changes.

## Remaining acceptance

| Code | Open gate |
| --- | --- |
| ER7-Q1 | Idle-host repeat and rebuilt desktop 1366×768 profile of actual joined ticks, input, render, validation and storage. No current browser budget is proven. |
| ER7-Q2 | Actor membership churn, heterogeneous components/worlds, graph workload, retained memory and optional typed-column ECS comparison. |
| ER7-Q3 | Real browser worker startup/scheduling, retained state/patch protocol, stale/cancelled result rejection, single authority and hidden/suspend handling. |
| ER7-Q4 | Versioned codec/DB format, real envelope validation and native save/reload/import, legacy compatibility, bounded decode, storage-full/crash/recovery. These require their own authorized gameplay/persistence slice. |

No source, tests, dist, root package, shared root palette, personal save, commit or push was changed by ER7. Only its research output and lane artifacts were delivered.
