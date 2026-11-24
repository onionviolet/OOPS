# Headless runner and power fixtures, November 19

On clean `dc4e5ba49`, I measured the public fresh and crowded saves at seed 251036. Each step advanced 240 game minutes. The scope prototype changed one line in a detached copy of `src/main.js`. The case fixtures and prototype are experimental. [Raw phase samples](../../work/deep-headless-2026-11-19/measure.json)

| Phase | Fresh | Crowded |
| --- | ---: | ---: |
| Warm boot, wall time | 2.59–2.80 s | 4.58–4.71 s |
| Full action list, wall time per read across 12 reads | 721–738 ms | 957–970 ms |
| Here action list, wall time per read across 12 reads | 16 ms | 25 ms |
| Full snapshot, wall time per read across 12 reads | 1.7–1.9 ms | 3.3 ms |

A warm instrumented bundle lookup took 25–30 ms and a forced rebuild took 382 ms wall time. The bundle was 60.7 MB. The CPU time reported for the lookup process excludes esbuild's child process. The first boot stage to improve is the work after bundle lookup. Reusing an immutable bundle reduces filesystem work when expanding a large test matrix, but the lookup is a small part of each boot here.

## P1 · Scope the activity update

The largest sampled self-time entry on the crowded 60-minute-chunk profile was the document-wide activity-row scan inside `simulateTick` (507 samples). The prototype looks under the native local-actions owner. The lists agreed at boot and every paired run preserved both its live digest and its stored digest. These were two samples per variant and chunk on one machine.

| Chunk | Median wall time before → prototype | Median CPU time before → prototype |
| --- | ---: | ---: |
| 60 | 9.78 → 9.02 s | 11.08 → 10.24 s |
| 240 | 7.44 → 6.67 s | 8.48 → 7.67 s |

Before landing, verify that the owner still contains every native activity row across travel, combat return, and both Here layouts. Replay an availability change while the job list is open. The measurement covers the crowded idle route. [Patch](../../work/deep-headless-2026-11-19/activity-lookup.patch) · [Baseline](../../work/deep-headless-2026-11-19/tick-before.json) · [Prototype](../../work/deep-headless-2026-11-19/tick-after.json)

## P2 · Preserve durable parity before changing the step size

The crowded live digest matched across 60 and 240. The durable digests differed across chunk sizes. The 240-minute checkpoint also differed from the same run's live state at one Reports line and two skill observation fields. At 60, the two skill fields still differed. These are results from the committed baseline. The earlier working-copy ward proof covered a distinct route.

Start with the existing checkpoint owner. Compare durable state after normal automatic saving and after round-trip reload, including Reports, skill observation, RNG, and domain state. Then split the cost of preparing and validating a save from the cost of flushing it. On the crowded profile, `writeExpansionPlan`, `create_save`, and cloning also ranked high. Try projecting only the reads needed by one ordinary clock path while keeping immediate transaction writes. Keep render and storage batching separate from skipping game minutes. An exact quiet span is a later experiment with passive XP, draws, work completion and loan expiry all represented as boundaries. [Save and step history](STEP_SPEED_UI_AND_READERS_2026-11-18.md)

## P3 · Make fixture builds reusable and traceable

`scenarioSave` keys cached recipes using a top-level modification-time/count stamp. Nested world packs and optional pack bytes can change while that stamp stays the same. Its same-key fast path returns the saved recipe directly. Build a dependency identity once for an immutable run. Use fixture ID and version, seed, wall start, and the relevant content digests. The existing `scenarioInputIdentity` supplies an example of recursive content identity, and the frozen build already records hashes for materialized inputs. Avoid rehashing unrelated assets on every case.

Use the existing case runner for effect timelines, the expedition engine for ownership and persistence matrices, and the headless runner for an earned journey. Check an expensive scenario once, fork its serialized checkpoint for direct engine variants, and replay one representative route through the headless UI. Report cold fixture generation, warm reuse, boot and simulation separately. Use one live game per process for parallel sweeps because the runner installs globals. Choose worker counts from measured wall throughput and peak resident memory on the 8 GB target. [Case runner](../../scripts/case_runner.mjs) · [Fixture build and verify](../../scripts/headless/world_fixtures.mjs)

## P4 · Keep the MCP path narrow and the frozen path complete

The real frozen materializer reproduced a missing-module error when its next-event helper tried to import `src/simulation.js`, which the package omits. Route the read through the bundled runtime's existing `nextSimulationBoundary` owner. Keep time-to-scheduler-boundary distinct from time-to-player-visible choice. Check both live and frozen advancement before exposing that distinction in the tool schema. Scoped or receipt replies after a click remain the first transport improvement. Full action enumeration costs roughly 0.7–1.0 s even inside the direct harness, so bypassing stdio alone leaves substantial view work. [Frozen reproduction](../../work/deep-headless-2026-11-19/frozen-event.log)

## Powers that exercise the same seams

| Candidate | Fixture and decision |
| --- | --- |
| P5 · Portal versus distance | First probe passed two tests. A distance effect reweights a road while a separately authored portal stays in reach. The fixture's admission hook refuses the crossing at the minute the portal expires and after reload. A charged or explicitly protected portal would be a separate world dial. [Fixture](../../work/deep-headless-2026-11-19/portal-distance.test.mjs) · [Run](../../work/deep-headless-2026-11-19/portal.log) |
| P6 · Autonomous companion or Stand | Use the existing controller and companion-work seams. Compare a standing order when its issuer is occupied, out of reach, or under time hold. State whether the command depends on the issuer's continuing link, the companion's clock, or a prepaid commitment. Verify one order can finish exactly once after reload. |
| P7 · Forecast versus luck | Give a forecast a named observation and a covered horizon. Compare a choice made from that forecast, a later intervention, and an unchanged replay. Keep preview RNG independent of committed draws. Show the player what changed when an intervention invalidates the forecast. |

## P1–P4 implementation and replay

The isolated candidate is `91e2deee7` on `codex/headless-parity`. It scopes the
idle activity scan to its native owner. An ordinary deferred checkpoint takes
the final Reports tail and skill observation after the render batch when the
checkpoint and live state are at the same expansion revision. Menu discovery
notices stay visible during play. Automatic checkpoints omit those
session-specific notices. The persisted schema stays compatible with existing
saves. A fresh rebuilt browser reopened fieldwork on the next morning and
preserved activity ownership through Village travel and combat entry and return
with both Here placements. Fresh Chrome matched live and durable crowded saves
at chunk 60 and 240, then restored the clock and Reports on reload.
[Activity and parity replays](../../work/headless-p1-p4/)

The first candidate benchmark used the same crowded fixture, seed, 240-minute
advance, and alternating chunk sizes as the baseline above. It matched live
and durable snapshots across all four runs. There were two observations per
chunk. CPU time includes user and system CPU for the Node process.

| Chunk | Median wall before → candidate | Median CPU before → candidate |
| --- | ---: | ---: |
| 60 | 9.78 → 8.72 s | 11.08 → 10.01 s |
| 240 | 7.44 → 7.04 s | 8.48 → 8.13 s |

[Before samples](../../work/deep-headless-2026-11-19/tick-before.json) ·
[Candidate samples](../../work/headless-p1-p4/parity-first.json)

Scenario recipes use a content hash of nested runtime sources and pack
inputs. The hash covers manifest supplements and directly referenced optional
JSON. A prior world fixture can carry over after passing its existing load
and world assertions. Set `YAIRPG_FIXTURE_REBUILD=1` for a clean rebuild
from the current inputs. Cache writes publish atomically. In one Village
Standing sample, the forced build took 5.00 s and reuse took 0.45 s including
the input hash. Both returned the same canonical save.
[Cache sample](../../work/headless-p1-p4/cache-bench.log)

MCP uses the bundled schedule owner for `until: "event"`. Live and frozen
workers both advanced one minute to the tested boundary. A click can reply
with a scoped view or an action receipt. A click that closes its own scope
returns the action receipt and clears prior action indices. In a stdio travel
loop with six calls per mode under shared load, median full replies were
1.23 s and 14,963 bytes. Scoped replies were 0.31 s and 1,483 bytes.
Receipts were 0.25 s and 143 bytes. The control reads used to select each
action were outside the timed window.
[Protocol check](../../work/headless-p1-p4/mcp-narrow.log) ·
[Click samples](../../work/headless-p1-p4/click-bench.json)

### Power experiments

The engine-level Stand fixture spends three coins on issuance. Its controller
takes a job on minute 1 and delivers on minute 4 while the issuer still has
a job through minute 20. Reloading the running job produces the same settled
state. A second reload and advance leave one completion and one debit. With
an authored link requirement, cutting the link before acceptance leaves the
prepaid order pending. A world that uses the linked variant needs a decision
on how pending orders expire and who recovers the payment. This fixture
covers a busy issuer and a cut link on the common game clock.

The forecast fixture exposes the observation, minutes 15–20, and 9-in-20
odds for a crossing. Repeating that read leaves the resolved receipt intact.
The saved roll misses by one. A paid luck modifier changes that result using
the same dice, records the reason, and survives receipt serialization. A
forecast after its window needs a fresh observation. These were engine
fixtures with authored policies, without a native power or player-facing
forecast screen.
[Fixture source](../../work/headless-p1-p4/power-fixtures.test.mjs) ·
[Three passing cases](../../work/headless-p1-p4/powers.log)

The final candidate reproduced the crowded digest in all four runs during
shared suite load. At 60-minute chunks, median elapsed time was 21.27 s and
CPU was 17.25 s. At 240, the medians were 15.23 s and 13.63 s. Use those
numbers for a same-run chunk comparison. The earlier low-load sample above
is the before/after comparison. Headless fresh and crowded saves also
matched at 60, 120 and 240 through normal publication. Reports, skill
records and clock survived reload and the native export/import path. The
Tingen deed replay confirmed the durable Reports tail at 60 and 120. The
global default remains 60. Larger chunks are available via the existing
`--chunk` switch for verified workloads.
[Final candidate samples](../../work/headless-p1-p4/final-ticks.json) ·
[Round-trip proof](../../work/headless-p1-p4/roundtrip.log) ·
[Tingen proof](../../work/headless-p1-p4/private-proof.log)

### Final landing

Local `master` landed the candidate at `96b0b8d04`. The exact merge
passed build, architecture, rules, a fresh browser replay and the
live/frozen MCP smoke. The full suite reported 8,019 passed, 31 skipped
and zero failed. The primary checkout had an overlapping Reports-only
checkpoint edit. Its two hunks now use the landed checkpoint and retain
the checkout's unrelated edits. Live/frozen MCP and both Here layouts
passed again on the reconciled primary. The combat return replay follows
the visible Withdraw control when the fight card owns it.
[Merge receipt](../../work/headless-p1-p4/merge-receipt.txt) ·
[Primary MCP](../../work/headless-p1-p4/primary-mcp.log) ·
[Primary browser](../../work/headless-p1-p4/primary-travel.log)

An interleaved rerun compared the final source candidate with the
committed baseline. Both used the same crowded fixture, seed and
240-minute workload. Each row has two runs per revision.

| Chunk | Median wall before → final | Median CPU before → final |
| --- | ---: | ---: |
| 60 | 8.73 → 8.05 s | 10.01 → 9.40 s |
| 240 | 7.33 → 6.74 s | 8.44 → 7.88 s |

Baseline storage differed from live in skill observation and, at chunk
240, a Reports line. On the final candidate every stored and live
digest was `ee547312b7dea2c8`.
[Matched benchmark](../../work/headless-p1-p4/matched-ticks.jsonl)

## What to optimize next

### One fewer JSON serialization

A disposable checkout of `96b0b8d04` ran the same 240-minute exact advance
with 240-minute chunks, seed 251036, and the public fresh and crowded saves.
The control built the serialized return from `writeExpansionPlan`. The
prototype omitted that string when a host took the prepared envelope
and the caller discarded the result. Both variants kept the initial save
projection and detachment, validation calls, and the durable writer. The
variants ran control, omit, omit, control for each fixture. Timing covers
the step call. Each median has two samples and measures this Mac.

| Fixture | Median wall control → omit | Median CPU control → omit |
| --- | ---: | ---: |
| Fresh | 1.65 → 1.58 s | 1.92 → 1.84 s |
| Crowded | 7.08 → 6.88 s | 8.31 → 7.97 s |

Every run matched its live and durable canonical digest and produced zero
page errors. The crowded samples overlap in CPU time. This suggests a
small saving to confirm with repetitions. The patch is experimental.
The public fixtures leave the failure contract open. An early stringify
can detect an unserializable staged value before it reaches the deferred
writer. Keep that timing for synchronous transactions and qualify the
already-deferred path with a failed patch, a failed storage write, and
an intervening reload. The earlier stringify/parse also detaches native
objects such as gear and global flags. A direct-object save path would
need an explicit equivalent detachment.
[Fresh samples](../../work/headless-perf-next/fresh.jsonl) ·
[Crowded samples](../../work/headless-perf-next/crowded.jsonl) ·
[Probe and patch](../../work/headless-perf-next/)

### Feasible cuts in order

| Option | First cut | Evidence for expanding it |
| --- | --- | --- |
| P8 · Run independent fixtures in a bounded pool | Wrap the existing `step_digest.mjs` worker with a queue and a ceiling of two processes for this Mac. Give both the same immutable code and input bytes. Put seed, starting wall time, chunk, clock, and both digest types in each result. Compare repeated serial and paired runs. Keep one worker as the fallback for low memory. | The prior paired workload took 13.36 s versus 21.85 s serial, with matching per-worker digests. Individual RSS peaks were about 1.9–2.0 GiB. Measure simultaneous RSS and swap on the 8 GB target. For short fixtures record warm boot separately. The measured bundle cache lookup is already tens of milliseconds. |
| P9 · Reduce exact-tick work at the source | Instrument `advanceChroniclePlan`, native context construction, save projection, envelope detachment, validation, storage write, and batch-close render. Then narrow one repeatedly built read for the active route, as the purse port did. Use the existing planning frame to share identical reads within a publication. | Interleaved control/candidate runs on Village, crowded and a private active job. Verify the clock, durable and live digests, and exact stop at a choice. Preserve native mutation boundaries, validation side effects and failure timing. |
| P10 · Improve desktop responsiveness | Profile crowded idle and a visible action in the actual desktop host. Pick one costly panel and use the existing display gate and change topics. Exercise first show, background updates, reopen and automatic discovery. | Measure task time and long tasks or input delay on a fixed layout. Rebuild Chrome proof for the changed surface and check the bundled WebKit run on target hardware. Earlier display gating showed the benefit of bounding one surface. |
| P11 · Make a quiet span exact | Use the existing span experiment on one Tingen route. Add aggregate passive skill ticks with their original threshold order. Explicitly account for minute-addressed draws and move scheduler reads behind the bundled clock owner. Fall back to exact ticks at any unproven boundary. | Replay the same save minute-by-minute and in spans. Compare the first divergence in clock, RNG, Reports, inventory, and durable state. Village follows once its local-life draws are accounted for. Keep this route-specific while other routes use exact ticks. |
| P12 · Stop interactive play at the next choice | Add a bounded choice stop to the runner's existing exact advance. Use native blocking-choice ownership, return the first stop reason and time, and request one scoped screen at the stop. The existing step receipt in the primary working copy already addresses reply size. | Walk a scheduled effect that needs no response, then reach a real blocking choice. The same headless and live/frozen MCP walks stop on the same minute and offer the same action. |

For P8, a replay failure can report the first mismatching checkpoint interval,
then rerun that interval with minute-level hashes and receipts. An endpoint
comparison can miss a transient divergence that later converges. Use ordered
checkpoints or a rolling trace when the difference itself matters.

P11 has a useful power fixture. Hold the issuer through a prepaid Stand's
due minute and reload before release. Author whether the Stand uses the
world clock or the issuer's clock and test which due minute it reaches.
Compare order completion and debit counts with an exact stepper on each
clock policy. Forecast versus luck can use the same checkpoint harness to
replay a saved pending result, with a forecast that expires at the named
minute and a luck spend whose debit settles once.

[Two-process evidence](HEADLESS_STEP_MATRIX_2026-11-18.md) ·
[Exact and span results](HEADLESS_STEP_SPEED_2026-11-18.md) ·
[Desktop profile and display-gate evidence](../audits/ARCHITECTURE_AND_SAVE_REVIEW_2026-11-15.md#round-5-o21-first-slice-measured-2026-11-15)

## Longer-term software choices

The desktop shell is Tauri. The game also builds as browser ESM through
esbuild. The local test gate uses `node:test` and the browser scripts use
the Playwright library through a shared loader. On this Mac the loader
works and finds Chrome. Playwright has no declared version in
`package.json`, so a clean install does not reproduce the browser setup
on its own. The app's macOS host uses the system WebKit. Keep a packaged
smoke distinct from the pinned browser replay.
[Browser helper](../../scripts/ui_helpers.cjs) ·
[Desktop manifest](../../desktop-tauri/Cargo.toml) ·
[Tauri WebViews](https://v2.tauri.app/reference/webview-versions/)

| Choice | Disposition and first check |
| --- | --- |
| P13 · Playwright with a pinned browser, plus a Tauri smoke | Adopt for repeatable interaction proof. Pin the existing Playwright library and provision its matching Chromium for a clean-clone job. Exercise Go, Talk, reload and export/import with existing scripts. Preserve a local on-failure trace, and use public fixtures for shareable artifacts. Test packaged startup and save restoration through Tauri on macOS because host behavior depends on the system WebView. Revisit Electron if actual WebView defects become a recurring release blocker. [Playwright browsers](https://playwright.dev/docs/browsers) · [Library tracing](https://playwright.dev/docs/trace-viewer#recording-a-trace) · [Electron process model](https://www.electronjs.org/docs/latest/tutorial/process-model) |
| P14 · Node tests with one fast-check trial | Keep the existing test runner and test generated short histories at an engine boundary. For prepaid orders, generate issue, interrupted advance, reload and completion, then assert one debit and one delivery. Save the smallest failing sequence and its seed. Move a representative ordered route through the existing scenario facade and check browser affordances separately. The pinned scenario, seed, input identity, commands and expected terminal receipts should fit in one replay artifact. [fast-check properties](https://fast-check.dev/docs/core-blocks/properties/) · [Configuration and reproducible seeds](https://fast-check.dev/docs/configuration/) · [Scenario facade](../../src/scenario_facade.js) |
| P15 · TypeScript as a checker for selected JavaScript | Trial JSDoc unions and a narrow `checkJs` project around a plain command/receipt contract. A receipt that claims success with a missing result or a command with the wrong payload should fail statically. Keep runtime validation for imported saves and authored packs. Expand after one contract shows useful checks at low annotation cost. This is a maintenance choice. [TypeScript checkJs](https://www.typescriptlang.org/tsconfig/checkJs.html) |
| P16 · One save port, with SQLite as a possible secondary index | Use the existing split/join helpers to trial a save port over today's envelope and backends. Verify identical export and recovery with a failed or interrupted write before replacing any backend. IndexedDB is a browser candidate when measured saves need more storage. Keep the desktop recovery path covered by fault tests. SQLite earns a trial when queries such as finding every loan activation across restored lives show up in normal use. An index rebuilt from exported receipts is a reversible proof. [Save architecture proposal](../audits/ARCHITECTURE_AND_SAVE_REVIEW_2026-11-15.md#staging-thresholds-are-dials) · [IndexedDB standard](https://www.w3.org/TR/IndexedDB-2/) · [SQLite use cases](https://sqlite.org/whentouse.html) |
| P17 · esbuild lazy-loading for one world pack | Keep the build tool. Profile startup parse, pack registration and memory. If a single world dominates, trial an explicit ESM entry loaded on need. Verify that a frozen build lists every chunk, an old save with that world active reloads, and crossing in and out keeps the same state. Check registration ordering and measure both startup and first entry. [esbuild splitting](https://esbuild.github.io/api/#splitting) · [Frozen materializer](../../scripts/mcp/frozen_build.mjs) |

Start with P13 and P14. The useful long-term output is a replay that runs
on a clean machine and reduces a failure to one action sequence. For
performance, use that replay to measure P9 before changing persistence
or the desktop host. These are proposed actions. This comparison verified
the existing source and browser loader, and inspected upstream
documentation. It did not install dependencies or qualify a new runtime.
