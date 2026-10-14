# BK1–BK4: runtime, catch-up, bundle and save budgets

2026-10-14. All targets below are proposals, not measured runtime performance or accepted world laws. Read-only file sizes are shown facts. P18 owns the [runner](../p18/HARNESS.md), [metrics](../p18/METRICS.md) and [hygiene](../p18/HYGIENE.md); P32's [level of detail](../p32/LEVEL_OF_DETAIL.md) is a draft input, not a finished REPORT or an implemented scheduler.

## BK1.1: per-tick envelope

Define one simulation turn as one host call advancing admitted played time and publishing its detached result. Count source planning, validation, cloning and publication separately from panel rendering and durable serialization. Do not confuse this with the 100 ms/tickrate native action-progress interval (`src/main.js:2540-2561`). P39 performed no timing experiment.

| Proposed laptop target | Envelope | What happens on excess |
|---|---:|---|
| Ordinary simulation turn, including new generators | p95 ≤4 ms; p99 ≤8 ms | Record owner/phase timings; postpone another boundary, preserve remainder |
| All new generation and receipt consumers combined | p95 ≤1.5 ms within the 4 ms total | Not 1.5 ms per lane. Use indexed deltas and local promoted actors |
| Individual hot generator | p95 ≤0.25 ms | Dirty-input cache, bounded candidate set, supported coarse model for distant actors |
| Visible panel update | p95 ≤2 ms, at most one coalesced update per painted frame | Render only dirty visible panels; defer noncritical views, keep accepted actions visible |
| Catch-up work task | target ≤8 ms; report every >16 ms task | Yield between atomic units; no silent time skip or dropped work |

These are initial admission thresholds for a 1366x768 laptop fixture, with a 1600x1000 check. Record actual hardware, browser/build fingerprint, normal/accelerated speed, p50/p95/p99/max, and foreground/hidden-tab mode. A slower machine changes wall-time chunking only, never saved candidates, terms, due times or RNG results. Required gates: baseline and changed trace, attribution by owner, choice latency, growth against actor/content scale, and deterministic outcome equivalence across several time-slice sizes. Human comfort and director taste remain distinct.

## BK2.1: the existing 512 boundary cap is not an elapsed-time cap

**F1 shown:** `advanceSimulation` clones state/external/gameplay (`src/expansion_engine.js:588-596`), chooses the next boundary (`:600-612`), settles all due jobs (`:614-625`), breaks after 512 boundaries (`:626`) and returns `remaining`, `stoppedAtChoice`, `budgetExhausted` (`:636-640`). One boundary can process many jobs/consumers, so 512 alone gives no milliseconds guarantee. `src/simulation_effects.js:189` bounds expanded effect activation at 256; that is a different bound.

**F2 shown / contradiction to a broad “continue later” reading of root BK2:** `src/main.js:1250-1267` synchronously drains repeated 512-boundary calls while remainder exists. This preserves time but can monopolize the main thread. Root BK2 is the desired future behavior, not proof that every current host yields. Do not claim offline catch-up: the current owner advances played time and P2's branch report explicitly defers closed-browser production.

**F3 shown, P2 branch-only:** `mixture_native.js:23-33` reserves one due batch and schedules another at supplied `clock+3`; `mixture_ui.js:37` polls every 500 ms only while free/visible. A large jump settles one batch, not all chronological batches. Moving it to this scheduler needs an explicit old-job timing/clock compatibility decision, not a timer-only refactor.

Proposed extension keeps 512 as the absolute boundary ceiling per invocation and adds a cooperative elapsed-time target checked **before starting the next atomic boundary**. A boundary itself cannot be interrupted halfway through a stock/RNG/receipt transaction. For large fan-out, partition work into explicit deterministic semantic sub-boundaries with stored cursors and predeclared order; do not stop halfway and expose an invalid save. Persist an admitted advance target and remaining work via the existing/P38-approved owner. Never re-add already consumed minutes after yield/reload.

A normal yield returns unspent time plus trace counts and queues a later host task. Clock, money, inventory, vitals, effects and acquisitions move only by consumed time. Blocking choices stop progression and leave the pending target visible. Cancellation/interruption follows the existing owner policy. Never let a second command race the same pending advance. Full frame rendering is not required for every intermediate boundary; mandatory current choice/recovery state is. The 8 ms target is cooperative and can overrun on one atomic unit; the trace must report that overrun.

Future acceptance compares minute stepping, one long call, 1/16/512 boundary chunks, several wall-time chunk sizes, a >512-boundary target, reload after yield, interruption at choice, same-time due events, all-pinned capacity pressure and failed durable writes. Compare ordered receipts, next draws, held stock, effects and exact final clock, not just final money. At 360 days/year, one daily boundary needs at least `ceil(360/512)=1` chunk; one minute boundary needs `ceil(518400/512)=1013`. These are arithmetic examples, not estimates of actual event density (`src/game_time.js:35-41` owns the 30-day/12-month calendar).

## BK3.1: current dist snapshot and lazy packs

Read-only sizes, 2026-10-14; hashes in [INPUT_SNAPSHOT.json](INPUT_SNAPSHOT.json). Gzip numbers are in-memory compression estimates with mtime zero, **not measured served transfer**. Another worker changed main dist during the audit. This table uses the final read snapshot; P39 neither built it nor established its source/served-byte provenance. No rebuilt-source claim follows from these bytes.

| File | Raw bytes | Estimated gzip bytes | Role |
|---|---:|---:|---|
| `dist/bundle.js` | 5,164,161 | 1,438,222 | Current main entry artifact, about 4.92 MiB raw |
| `dist/bundle.js.map` | 13,277,072 | 3,070,575 | Debug mapping; measure separately from normal script loading |
| `dist/nethack-fieldcraft-preview.js` | 2,927,363 | 806,024 | Separate preview artifact, not automatically part of entry load |
| `dist/nethack-fieldcraft-preview.js.map` | 7,756,828 | 1,735,340 | Preview debug mapping |
| Ink notices/authors | 1,595 | 964 | Attribution artifacts retained |
| All listed dist files | 29,127,019 | 7,051,125 | Directory total, not first-load payload |

**F4 shown:** `build.js:23-33` builds one minified ESM outfile from `src/main.js`; no `splitting`/chunk directory is configured. `src/expedition_content.js:1-23,39-72` statically imports multiple worlds. `src/content_packs.js:88` already provides a content-fetch route. Infer the opportunity for lazy world data/code, not a measured saving.

Proposed loader uses a tiny public pack directory listing ID/revision/digest/required interfaces and nonsecret availability. Load the selected world's content only on entry or before restoring a save that references it; fetch retained dependency revisions too. Downloads complete outside simulation mutation, then validation/admission happens at a safe boundary. Loading order, network latency and cache hits never choose candidates or consume draws. Eager-importing all pack contents into the manifest would defeat laziness.

For data packs, extend the existing content loader. If executable adapters require chunks, root changes build.js once to a reviewed multi-file ESM build, updates index asset resolution and tests cold load, missing chunks and retained revisions. This is a future integration edit, not work done here. Pack chunks use content hashes, an explicit supported offline cache policy and an unavailable-pack recovery route. Public bundles cannot guarantee that shipped secret code/data is inaccessible; UI projection still forbids disclosures, and distribution policy stays with the sealed-content owner. No sealed truth enters a public manifest or diagnostic.

Initial targets: new shared registry/bootstrap ≤32 KiB gzip /128 KiB raw incremental entry growth; an ordinary world data pack ≤64 KiB gzip /256 KiB raw; lazy adapter chunk ≤64 KiB gzip. Larger lawful worlds remain possible: split by place/era/capability with validated dependencies and measure actual first-use latency. Targets flag review, not content deletion. Gate is real network entry payload excluding maps, requested pack list, cold/warm entry, restore with old lock, disabled-world nonfetch, and no ordinary-build director payload. Do not promise a smaller initial bundle until a new build and trace exist.

## BK4.1: per-game-year growth and origin headroom

**F5 shown:** `src/save_files.js:204-224` budgets 4 MiB of total origin UTF-16 storage, including other keys, and refuses unsafe writes. `measureSaveSize` reports UTF-8 JSON bytes and twice JS string length (`:207-215`); these measures differ for Unicode. Export encoding (`:189-192`) adds a base64 wrapper, about `4*ceil(UTF8/3)` characters plus its prefix. P39 read no personal save and has no baseline envelope-size result.

**F6 shown / P2-specific:** `mixture_state.js:61-74` embeds full recipe/fraction JSON in a product ID and repeats that ID in inventory keys, catalogue keys and job/effect references; `:84-89` validates holders and consumed-source effects. Item growth can dominate history even when receipts compact. Do not shorten old IDs or delete their resolved records without a versioned migration and reference audit. The P34 checkpoint states a 96-record history capacity with reference-aware eviction; this is branch-stated behavior, not an extensible storage budget or a lifetime archive.

Proposal for P18's first 10-year enrolled Village soak, aligned to [P38 RETENTION BI4.4](../p38/RETENTION.md): 256 KiB participating-owner pilot and 64 KiB/year routine growth. These overlap P14/P19/P32 allocations; never add their private budgets again. A tighter compact profile remains reachable after measurement.

| Metric | Initial review target | Measurement |
|---|---:|---|
| Rolling recent/uncompacted generation state | ≤256 KiB UTF-8 | All new owners combined, report pinned versus reclaimable separately |
| Post-compaction persistent growth | ≤64 KiB UTF-8 per completed game-year | Annual whole-envelope delta after identical compaction phase, also report UTF-16 storage delta |
| Ten-year new-owner delta | ≤896 KiB UTF-8 | 256 KiB pilot +10×64 KiB; not an allocation independent of existing save |
| Total origin headroom | Stop new admission before projected transaction exceeds existing 4 MiB guard | Actual keys, backups/layout/preferences and non-ASCII names included |

Illustration: 720 settled receipts/year at 600 bytes each is 432,000 bytes/year before indexes/pins, roughly 4.12 MiB UTF-8 over ten years. A proposed compact year of 64 aggregate/account entries at 256 bytes uses 16 KiB, leaving 48 KiB/year for other retained growth. Neither example is an observed workload. Exact fact pins, open promises, anniversaries, provenance, law revisions, pending work and consumed-source exposures can exceed the target; preserve them, disclose pressure and block only unsafe **new transactions**, rather than rewriting history or erasing obligations. At 896 KiB ASCII JSON, a live plus backup pair is about 3.5 MiB UTF-16 before old owners and other keys; this can already exceed origin headroom. The slope target is a review ceiling, not permission to allocate it. These are storage controls, not fictional once rules or caps on powerful effects.

Measure baseline and years 1/2/5/10, adversarial many products, long/CJK names, empty/fully pinned logs, open obligations, multiple content revisions and exports. Attribute bytes to records, duplicated IDs, indexes, products, knowledge, locks and pending jobs. Rebuild indexes from retained truth when P38 permits; never compact a query predicate that a future consumer still needs. Compare pre/post-compaction queries, known projections, import and next draw. An efficient coarse social model must preserve stable actor identity/means on promotion. More material families, source worlds, food and NPC factories remain reachable as separately measured packs; food remains optional with no hunger death.
