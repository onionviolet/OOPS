# Micro correctness audit, 2026-10-14

## CHECKPOINT

ER9 source audit complete for MC1–MC21 and MC34. Pure Node probes and a focused
37-test slice passed. Findings and fixes below are proposals; no runtime edits,
build, browser proof, private save access, commit, push or install. Resume from
[ER9 report](../gm/dispatch/engine-runtime-2026-10-14/ER9/REPORT.md) and its
`checks.mjs`, `results.json`, `source-survey.json` and source fingerprints.
Browser lifecycle, actual corrupt-runtime reachability and whole-campaign
partition equality remain open. No sealed files or private packs were read.

## Scope and evidence

The requested lane is a read-only audit, not a GM implementation wave. Existing
standing direction and deferred gameplay remain with `PROJECT.md` and
`docs/USER_VISION.md`. No new offline rule or mobile gate is selected here.
The checkout contains other owners' dirty files; only the two requested reports
and ER9 scratch evidence were written. A memory registry search had no relevant
ER9 hit; conclusions use live source.

This extends the [root palette](../ENGINE_RUNTIME_PERFORMANCE_AND_STACK_CONSIDERATIONS_2026-10-14.md),
[E1–E10 save review](../ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md) and
[offline clock audit](OFFLINE_TIME_AND_BRANCH_CLOCK_AUDIT_2026-10-14.md), without
repeating their general rows. [ER1 hotspots](RUNTIME_HOTSPOT_AUDIT_2026-10-14.md)
owns performance measurements; [ER3 stack options](TECH_STACK_OPTIONS_2026-10-14.md)
owns tooling choices. Platform guarantees belong to ER10; DOM feel to ER11.

READ means inspected source at `file:line`. MEASURED means the command below ran
on Node v22.23.3 with synthetic fixtures, with results in the lane. INFERRED
means consequence, severity, reachability or proposed fix. A failing invariant
in a fixture is not proof that a player's current save is corrupt. Severity
orders data loss first, wrong outcomes next, then annoyance. Likelihood and
repair value can differ from severity.

## Findings ranked by long-campaign severity

| Code / palette | Severity and evidence | Minimal reproduction | Smallest fix proposal |
| --- | --- | --- | --- |
| ER9-F1 / MC7, MC19, DA1, CH5 | **High: lost money or invalid saved counters.** READ `src/main.js:4935-4953,5197,5255-5260,414-421`: ordinary save serializes before the adapter parses it; this route has no full envelope validation. READ `src/save_files.js:128` accepts `c.money ?? 0`; `src/main.js:5429` loads `money || 0`. MEASURED: direct NaN/Infinity money rejects, but both serialize as null and the parsed envelope passes. Synthetic top-level `total_hits_done` accepts Map/Set/Date/null after JSON loss. INFERRED: a runtime poison can overwrite a good save with zero money or altered counters. No ordinary path producing poison was proven. | Run `checks.mjs`, rows `money-*`, `counter-*`. Inject nonfinite money before a synthetic ordinary save and verify that the last-good storage remains unchanged after a proposed guard. | Validate a plain save DTO **before** stringify, including native lifetime counters. Allow missing legacy money deliberately, reject present null/nonfinite money. Retain last-good save on failure. Do not blanket-reject Game_Time methods: snapshot its numeric fields, since the current save intentionally includes its instance. |
| ER9-F2 / MC14, new MC36, RT5, CH7 | **High conditional: durable/live state disagreement and replay.** READ `src/main.js:414-438`: `lifeSaveStorage.setItem` writes at 421, then migrates and renders before returning. READ `src/main.js:921-933`: caller treats a thrown adapter error as failed persistence, before assigning new expansion state. INFERRED: a post-write render/migration throw can report failure after storage already changed, leaving live expansion behind durable state. This is an exception-phase gap, not a demonstrated double reward. | Fault-inject a throwing `workLedgerPanel.render` after `writeGuardedSave` on a synthetic origin; compare saved sequence with live sequence and retry behavior. Not run in browser. | Split durable writing from publication. After storage succeeds, publish all model fields before isolated rendering; report a render error as a committed transaction with display failure. Cost: moderate adapter/caller refactor and failed-publication tests. |
| ER9-F3 / MC14, RT5, DA1 | **High conditional: progress overwritten during import.** READ `src/main.js:7056-7068`: `importInProgress` excludes another file import only. Its only other occurrence is declaration at 365. READ `src/save_files.js:185-191`: awaits preflight before writing; `src/import_probe.js:2-25` uses asynchronous iframe messages. Ordinary saves/ticks/commands do not check that flag (`main.js:1459-1461,5255,7226`). INFERRED: play during a slow import can be committed and then replaced by the chosen import; failed imports allow intervening play. Import replacement itself is intended, the unannounced overlap is the edge. | Hold a synthetic preflight Promise; perform a paid command/autosave; release preflight and inspect which sequence remains. Browser proof open. | Freeze mutation and timers for the import transaction, retain a durable revision/epoch, and resume on rejection. Cost: small shared guard plus lifecycle tests; keep the existing single-import guard. |
| ER9-F4 / MC15, MC16, MC20, DA1, OS1 | **Medium/high: unsaved native progress or stale restored owner.** READ source survey: no pagehide, pageshow, beforeunload, storage event listener or storage.persist call. Only two VFX modules handle visibility. READ `src/main.js:1745,1749,7630-7643`: save every 60 callbacks at default tickrate and backup every 3600; joined commits save more often. READ `main.js:588-597,7879-7891`: one initial Web Lock and cached `ownsSave`. INFERRED: sudden leave loses native work since the last successful save; restored-page lock state and stale read-only views need proof. This does not claim a browser releases a lock on every navigation. | On a fresh test origin, earn native progress, hide/leave before autosave, return through back/forward, open a second tab, then verify writer exclusivity and actual durable sequence. Unrun. | Best-effort hidden/pagehide save through the existing writer, plus pageshow ownership revalidation and read-only tab refresh/stale notice. Cost: small lifecycle adapter plus multi-tab browser checks. Keep platform behavior/version facts with ER10. |
| ER9-F5 / MC1, MC2, MC5, RT1, RT8 | **Medium: skewed combat/activity time and persistent cadence correction.** READ `src/models/combat.js:110,198-216`: 60 timer callbacks per attack, wall-clock variance. READ `src/main.js:7226-7235,7688-7694`: wall smoothing but callback-count playtime; action intervals at 2532,2556. MEASURED `nextAttackTiming`: ±1-hour wall jumps leave variance ±3,600,000 ms while adjustment clamps to ±100 ms. INFERRED: the correction debt persists beyond one callback; timer delay is not actual elapsed settlement. This adds combat-specific evidence to offline F2/F6 rather than selecting catch-up policy. | `wall-jump` probe; browser test clock change and suspend during combat/action, comparing game time, attack count, effects and work. Browser part open. | Inject monotonic duration clock into smoothing, reset/reconcile on resume, and pass actual consumed minutes to supported consumers. Cost: small clock seam; shared elapsed adapters are a larger separate proposal. |
| ER9-F6 / new MC35, MC8, RT9 | **Medium: systematically biased rewards/quality.** READ `src/misc.js:68-70`: inclusive integer range uses round, not floor. MEASURED actual helper extracted into a VM with 10,000 evenly spaced midpoint draws for [0,2]: bins **2500,5000,2500**. READ consumers: `main.js:3296,7504,7509`; `crafting_recipes.js:206,236,302`. Similar direct round-based count/quality sites in `enemies.js:174`, `models/location.js:355`, `components/trader_component.js:119,123`. Uniform integers are an INFERRED intention, not a stated balance contract. | `integer-range` probe. Compare the intended distribution for each native caller before changing outcomes. | If uniform inclusive integers are intended, use `min + floor(draw*(max-min+1))` with finite integer bounds and draw validation. Cost: small helper repair, distribution regression and balance note; audit direct duplicates separately. |
| ER9-F7 / MC11, RT9 | **Medium: presentation draws share the native RNG source.** READ every site inventory below. Click effects, dialogue text, ambient sounds and particles use the same global Math.random API as combat, crafting, gathering and trader stock. INFERRED: adding a view draw changes subsequent native draws under a seeded replacement; native randomness is not saved so this is not a current replay contract failure. MEASURED 1,000 expansion `evaluateAction` calls leave seed 123/state unchanged and call Math.random zero times. | Count draws with a synthetic Math.random replacement while rendering native floating effects versus previewing one expansion action. Only expansion fixture was measured. | Separate cosmetic RNG from named saved gameplay streams; ban draws in read-only projections. Cost: small cosmetic seam, moderate native outcome-stream migration with compatibility policy. |
| ER9-F8 / MC12, MC13, RT9, RT6 | **Medium conditional: locale/content-order dependent resolution.** READ `src/simulation.js:498-545`: checks, controllers and programs sorted by localeCompare; equal-priority candidate ties compare JSON text. `src/pursuit.js:96,140` chooses route traversal/pursuit order by locale. `realm_connections.js:242`, `realm_boundary_rules.js:148` pick the latest remembered snapshot using locale ties. These are saved/causal consumers, not just display. MEASURED a/ä/z order differs for en and sv; sampled ASCII IDs a_b/a-b/a.b have the same order in those two locales. No current ASCII-content wrong outcome reproduced. | Reverse registry/input insertion and property order for same-priority candidates; run equivalent save on two locale/ICU configurations and compare chosen actions, causes and RNG. | Use code-unit stable ID comparator in causal paths; author explicit stable candidate IDs/order, rather than JSON shape ties. Cost: small comparator substitution, moderate tie-contract fixture work. |
| ER9-F9 / MC4, RT8 | **Medium if bulk idle settlement is added: batch search is intentionally unequal.** READ `src/absorb_c2/local_life.js:42-83`: one search/contact attempt per observed step, documented no batch replay. MEASURED same 60 minutes in Shack with failing RNG: jump gives 1 draw/miss and 0.5 Perception XP; minute steps give 12 draws/misses and 6 XP. This is current intentional policy, not a bug requiring backpay. | `search-60` probe, with constant .999 draws. | Declare the module callback/observation-based in any elapsed adapter; either keep paused/bounded behavior or obtain a new policy before implementing deadline replay. Cost: tiny contract, larger balance decision if changed. |
| ER9-F10 / MC7, MC9, CH5 | **Medium conditional: native numeric entry points are weaker than expansion.** READ `src/game_time.js:18-42` accepts NaN/Infinity/fractions/negative input without a guard. `src/combat_math.js:34-36` accepts unbounded attack/count/draw. MEASURED calendar NaN poisons minute; infinite attack returns [Infinity], JSON [null]. READ expansion duration guard at `expansion_engine.js:589` rejects clock overflow; domain completed counters use safe integers (92). READ native lifetime load at `main.js:5356-5364` uses truthy defaults, with no counter schema validation in `save_files.js`. Natural 200-hour unit counters are far below 2^53; amplified resources/XP and imported values deserve more attention than tick exhaustion. | `calendar-NaN`, `combat-Infinity`, `clock-overflow`; synthetic maximum native counters and invalid draws at caller boundary. | Guard finite values where data enters, integer/count bounds for counts, post-operation range validation for amplified XP/resources; distinguish legal fractional XP from integer counts. Cost: small boundary slice, moderate native inventory/stat inventory. |
| ER9-F11 / MC4, MC6, RT2 | **Low: exact hunger equality differs by float accumulation.** READ `src/absorb_e1/pacing.js:35-37`: fullness subtracts minutes/4.8. MEASURED 60-minute split delta **2.8421709430404007e-13**; at 480 minutes jump=0, split=**5.230815780521425e-13**. Weather phase/remaining matches in these same fixtures; 1440-minute whole state matches after clamping. Hunger starts off and current accepted food direction stays with its owner. | `pacing-*` probes. Compare XP around thresholds if a future consumer branches on exactly zero fullness. | Fixed-point fullness units with explicit conversion remainder, or a documented tolerance at threshold decisions. Cost: small numeric change but persisted-value compatibility needed. Tiny drift alone does not justify an engine rewrite. |
| ER9-F12 / MC8, new MC37, RT4 | **Low: rounded odds and mutating duration formatting.** READ `src/display.js:3077,3487,3783,3821` rounds percentages to whole integers while gameplay uses unrounded chance (`main.js:4236,7503`). A 0.996 chance would display 100%; this is an example, not a measured current recipe. MEASURED actual `format_time({time:{minutes:61}})` returns 1h1m and mutates input to `{minutes:1,hours:1}` (`game_time.js:142-159`). INFERRED: passing a shared quote to a formatter can alter later arithmetic. No such shared-state caller proved. | `formatter-mutation`; inspect tooltip quote versus paid craft for near-one chance. | Format on a copied duration; show '<100%' or one decimal for non-guaranteed near-one odds. Cost: small leaf change and one consumer check. |
| ER9-F13 / MC3, MC10, RT9 | **Low today, medium for future replay/real-day features.** READ `src/main.js:4904-4914` stores local label without offset. Epoch export reward at 5234-5235 is separate. READ local daily gates use game-calendar minutes (`absorb_c2/local_life.js:73`) and Game_Time uses fixed 30-day months. No OS timezone/DST rule is used for those gates. READ combat powers (`combat_math.js:5-22,54`) and XP scaling (`components/levelable_component.js:80,83`) use fractional powers. INFERRED: cross-engine last-bit changes could affect future exact replay; current cross-browser outcome divergence is unmeasured. | Compare saved label in two TZ settings; prove game-calendar gates unchanged. Compare boundary combat/XP fixtures across engines before requiring bitwise math. | Keep labels separate from numeric elapsed cursors and game-day identity. Do not migrate daily gameplay to local Date. Pin numeric replay contract only if replay becomes required. Cost: small label addition, larger replay compatibility work. |
| ER9-F14 / MC34, CH5 | **Low: one event-loop yield, no direct real clock/RNG tests found.** MEASURED text survey across public tests finds no Math.random, Date.now, new Date or performance.now references; one `setTimeout(resolve,0)` in `tests/feature_panel_save_failure.test.js:37` is a task yield without a timing assertion. This does not prove transitively imported native defaults are deterministic. READ most audited pure tests pass injected RNG/seeds. | `source-survey.json` testSites; run default-RNG callers under a throwing Math.random sentinel. | Keep source probes clock/RNG injected; move default RNG to host boundary and add strict draw-count fixtures for newly adopted native seams. Cost: small per new seam. No test-runner replacement indicated. |

## Measured partition checks and protections

All numbers in this section come from:

```sh
node docs/gm/dispatch/engine-runtime-2026-10-14/ER9/checks.mjs
node --test tests/expansion_engine.test.js tests/absorb_e1.test.js tests/absorb_c2.test.js tests/save_files.test.js tests/native_combat_math.test.js
```

MEASURED: Node v22.23.3; probe exit 0; **37 tests passed**, 0 failed/skipped.
`results.json` retains exact numeric output, `check-output.txt` and
`test-output.txt` retain the command output. Checks use no personal saves.

| Code | Probe and result | Limit |
| --- | --- | --- |
| ER9-M1 | Game_Time split/single exact numeric-field equality at 60, 1440 and 518400 minutes, starting one minute before a year boundary. | Calendar arithmetic only, not weather seasonal transitions or paid consumer hooks. |
| ER9-M2 | One queued 4-minute synthetic reward, followed through 60 minutes: state, money and gameplay match exactly; money 17, clock 60. | No NPC contention, event decision, boundary-budget exhaustion or changing context. |
| ER9-M3 | 1,000 evaluateAction previews: zero native random calls, seed 123 unchanged, full state unchanged. | One eligible pure action; not every native preview/view. Native recipe tooltips read ranges at `display.js:3525`; quality draws occur at craft commits `main.js:4366,4483`. |
| ER9-M4 | Expansion clock MAX_SAFE_INTEGER plus one rejected. | Does not validate every native counter or amplified fractional quantity. |
| ER9-M5 | UTF-16 guard count for 'a', '魏', '🐉': storage bytes 2,2,4; UTF-8 bytes 1,3,4. READ `save_files.js:200-215` includes keys and other origin records. | Confirms implementation's conservative budget units, not a browser quota guarantee. CJK is not inherently larger than ASCII in this guard; surrogate pairs are. |

Partition equality should compare consumed time and carried unspent time as well
as final state. The scheduler intentionally stops at choice and 512-boundary
limits (`expansion_engine.js:606,628-645`); one capped call cannot be compared to
arbitrarily many fully draining calls without resubmitting its remainder. A
season-changing context cannot be held fixed in one case and changed per minute
in the other. These are comparison constraints, not extra implementation gates.

## Every Math.random site classified

MEASURED public `src/` text inventory: **63 occurrences on 63 lines in 10 files**,
including **3 injectable default references**, not 63 unconditional draws.
This supersedes the root palette's 42-in-6 spot count for this snapshot.
The complete line text is in `ER9/source-survey.json`. Every line is assigned
below; indirect `random_range` and `roll_quality` callers are covered in F6/F7.
Cosmetic and gameplay are intent categories, not separated streams today.

| Code | File and every line | Classification / consumer |
| --- | --- | --- |
| ER9-R1 | `src/display.js:361,376` | Cosmetic: floating-effect offset and path. |
| ER9-R2 | `src/particles.js:5,7,8,9,10,16,43,49,72,85,86,102` | Cosmetic: particle positions, size, opacity, drift and speed. |
| ER9-R3 | `src/main.js:2511,2586,2589,2610,3502,3504,7574,7575,7578,7581` | Cosmetic: click effect, failure-line selection, rat dialogue substitution, ambient log chance/text. These still consume global native draws. |
| ER9-R4 | `src/main.js:2593,2933,3292,4224,4236,4273,4694,7503` | Gameplay: action result, reward/mixed-reward inclusion, craft fractional count/success/yield, effect chance, gathering chance. |
| ER9-R5 | `src/models/location.js:344,355,357,367,373,374,375,376,377,378,379,380,381` | Gameplay: encounter selection, size, member selection, varied enemy stats. |
| ER9-R6 | `src/models/combat.js:160,323,351,377` | Gameplay: target count, block, evasion, critical. |
| ER9-R7 | `src/enemies.js:170,174,216,443,454,501,518` | Gameplay: loot chance/count, status choice, on-hit/on-damage ability chance. |
| ER9-R8 | `src/components/trader_component.js:117,119,123` | Gameplay: generated stock inclusion/count/quality. Template insertion order controls draw order. |
| ER9-R9 | `src/misc.js:69` | Gameplay helper draw: inclusive integer reward/gathering/quality selection. Not pure-importable because misc imports main.js; the exact three-line helper was extracted for its measure. |
| ER9-R10 | `src/absorb_c2/local_life.js:42`; `src/combat_math.js:34,44` | Gameplay injectable default references: local search/contact, base damage, strike resolution. Draws occur through supplied `rng`/`random`; merely importing these does not draw. |

Counts by intent: **24 cosmetic draw lines**, **36 gameplay draw lines**,
**3 gameplay injectable defaults**. No sealed/private random consumer was opened.
The inventory is exhaustive for literal Math.random in public src at this
snapshot, not for crypto or aliases provided by content packs. Expansion uses
saved xorshift (`expansion_engine.js:517`, `simulation.js:39,183,509`), not this
API. Draw consumption changes for guaranteed events at `simulation.js:509-511`
still matter: that path draws before checking its guarantee. Freezing this order
or versioning streams is safer than silently skipping those draws later.

## Ordering, persistence and remaining palette coverage

| Code / palette | READ evidence and disposition | Reproduction / smallest proposal |
| --- | --- | --- |
| ER9-C1 / MC12 | Pending work orders by due then sequence (`expansion_engine.js:614`; `simulation.js:474`), stronger than due-only sorting. Opportunities iterate Object.values (`expansion_engine.js:617`) and controllers tie-break on JSON text (`simulation.js:525`). Dictionary key order should not be inferred from author source layout. No same-time job wrong outcome measured. | Reverse insertion of equivalent synthetic records, including integer-looking keys in any permissive native dictionaries. Preserve sequence total order; give authored equal-priority actions stable IDs. |
| ER9-C2 / MC13 | All 20 localeCompare lines in 10 files are in source-survey. Display-only: `display.js:5291,5504`, `known_routes_host.js:239`, `event_feed.js:92-93`. Saved ordering: `npc_lives.js:21,51`, `structured_equipment_runtime.js:75`. Causal/latest selection: simulation/pursuit/realm rows in F8; `world_completion_learning_runtime.js:101` orders stock validation traversal. | Replace causal/saved comparators first. Display locale order can remain; validation traversal alone does not prove changed gameplay. Same-time saved NPC event ordering can change JSON without changing event meaning. |
| ER9-C3 / MC14 | Ordinary JS synchronous steps do not interleave merely because multiple timers exist. Engine planners clone state (`expansion_engine.js:65`) and command entry checks expected sequence (`simulation.js:49,303`); expansion writes precede publish. The open seams are asynchronous import and post-write callback/render errors, F2/F3. `window.run` is exposed (`main.js:7875`), and run has no active-loop sentinel (`7744-7760`). | Synthetic call run twice and count queued callbacks, then verify whether any actual UI route does that. Unrun; add an idempotent run/stop owner if reproduced. Do not claim current normal clicks start duplicate loops. |
| ER9-C4 / MC17 | Export and backup routes exist (`main.js:5226,7642`; `save_files.js:176-192`). No persist request found in public source. No eviction observed. | ER10 owns browser eviction facts. A fresh-origin deletion/eviction-recovery drill and bounded export reminder are proposals; persist cannot guarantee backups. |
| ER9-C5 / MC18 | Guard intentionally counts UTF-16 code units and shared origin data (`save_files.js:198-215`), with friendly quota catch (`219-225`). Probe M5 verifies byte-count semantics. | Keep both UTF-8 export and guard metrics. No replacement of the current guard proposed on these measurements. |
| ER9-C6 / MC19 | Present undefined keys disappear; Map/Set become {}, Date becomes ISO text, -0 becomes 0, nonfinite numbers become null, BigInt throws in actual JSON probes. Save validators check selected known paths, not a recursive JSON DTO shape. `prepareFoundationSave` clones at `save_compatibility.js:10` but cloneability is not JSON fidelity. | Validate DTO leaves and required-field presence before serialization; legacy optional omissions stay explicitly allowed. Distinguish -0 cosmetic identity from losing an entire inventory Map. The probe placed exotic objects in an unchecked counter, not in current runtime inventories. |
| ER9-C7 / MC20 | Secondary tab is a read-only preview from one lock acquisition (`main.js:588-597,7879-7891`); no storage refresh hook. Many expansion buttons consult ownsSave. This audit does not establish that every legacy button is disabled. | Two-tab synthetic browser action matrix: writer, preview, writer close, preview resume. Guard mutation at shared entry points and show current stale/ownership status. Do not assume a storage event is itself writer authority. |
| ER9-C8 / MC21 | READ `main.js:921-922` validates a full envelope on joined writes, and `expansion_persistence.js:7,47` validates state/envelope. ER1 owns measured validation cost and transaction-per-minute findings. | Link ER1 rather than rerun perf. Before incremental validation, retain pre-serialize poison checks, failed-write atomicity and import/load full validation; caching invalid values faster would worsen F1. |

## New micro classes and value per effort

New codes extend the palette as proposals, without editing the Claude-owned root.
The following order ranks repair value per effort, rather than severity alone.

| Code | Proposed first action and root codes | Cost once / acceptance idea |
| --- | --- | --- |
| ER9-A1 | Guard pre-JSON money and native counters (F1/F10; MC7, MC19, CH5, DA1). | Small boundary slice. Synthetic invalid native values must reject without replacing last-good bytes, while legacy valid missing fields still load. |
| ER9-A2 | **MC35: integer distribution correctness.** Decide and test inclusive integer distributions, then repair the shared helper if uniform is intended (F6; MC8, RT9). | Small code/test change, balance review of callers. 10,000 midpoint-grid values should populate [0,2] near thirds after the selected uniform policy. |
| ER9-A3 | **MC36: commit phase versus notification failure.** Separate durable success from model/render callbacks, and gate async imports (F2/F3; MC14, CH7, RT5, DA1). | Moderate publication slice. Throwing render after write must leave model/durable sequence equal and retry must not replay a reward. Slow import must freeze or explicitly reject intervening mutation. |
| ER9-A4 | Add stable causal comparators plus cosmetic RNG isolation (F7/F8; MC11–MC13, RT9). | Small first seam, moderate full native rollout. Reversed input order and view refreshes must not shift an accepted seeded gameplay trace. |
| ER9-A5 | **MC37: read-only helpers that mutate input.** Copy duration before formatting; then tackle monotonic/lifecycle seams with ER10 browser cases (F5/F12; RT4, MC2, MC15–MC16, OS1). | Small formatter fix; lifecycle work moderate. Frozen DTO formatting must succeed unchanged; synthetic hide/return and multi-tab proof required for lifecycle claims. |

The new classes are distribution bias, post-durable exceptions and mutation by
read-only helpers. F9/F11 do not justify automatic balance changes. Scope remains
research only. Browser behavior, whole-game replay, source-to-bundle parity,
save/reload/import of a repaired candidate and director acceptance are unrun.
