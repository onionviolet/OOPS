# Faster steps, clearer play, and the next reader pass

2026-11-18. Recommendations and a headless probe. The primary checkout was at `abc74afe6` with shared edits. The step-speed changes and synchronous transaction-write correction were available in the five-branch integration candidate `b79c029b1`.

## Chunk-size probe

Built the `lotm-tingen-day3` fixture and ran the candidate's `step_digest.mjs` for 240 game minutes at seed 1 on Node v24.22.2. Ran each chunk twice in order 60, 120, 240, 240, 120, 60. CPU measures the step call. The script's elapsed wall time also includes digest assembly.

| Chunk in minutes | CPU seconds | Wall seconds |
| --- | --- | --- |
| 60 | 16.40, 21.27 | 15.07, 20.33 |
| 120 | 11.83, 18.17 | 10.75, 16.98 |
| 240 | 14.10, 17.25 | 13.28, 16.35 |

All six runs advanced 240 minutes, reported zero page errors, and had identical live snapshot digest `4874f7a3babf2cc9` and expansion clock 3121. Two samples per chunk on a busy machine establish a test candidate for larger chunks. The 120-minute chunk used less CPU than the 60-minute chunk in both passes, while the 240-minute result varies relative to 120.

**F1. The saved Reports tail depends on chunk size in this probe.** The three other storage keys matched. A follow-up run compared decoded save data for 60 and 120, removed the wall-clock fields through `canonicalSave`, and isolated one differing field, `/reports_dock/lines/2`. Both saved clocks were 3121. Both stored saves also differed from their live snapshots in two skill “seen” flags. The Reports domain projects its tail from the DOM, and the batch closes its save work before its final render flush. Trace the specific line and make the persisted report available before checkpoint capture, then rerun chunk and reload parity before changing the default. The check covers the candidate and this fixture. [Reports save owner](../../src/reports_dock.js) · [Timing receipt](../../work/effect-wave-2026-11-18/step-speed-review/chunks.log) · [Storage comparison](../../work/effect-wave-2026-11-18/step-speed-review/storage-diff.log)

## Account for now

### Step speed and parallel work

**O1. Reduce what a minute costs.** The step-speed lane measured about 8 to 15 game minutes per CPU second on Tingen after routing purse reads through a narrow port and coalescing durable writes. Its remaining profile attributed 16% to chronicle context construction, 15% to expansion persistence and 14% to batch-close rendering. Those shares came from one route under heavy machine load. The integration candidate restores synchronous durability for transactions. Profile save projection and storage separately, then move one repeatedly read fact family to narrow reads. Use the existing read frame within a pass. Cross-tick reuse needs explicit dependencies for every value it caches. [Step-speed and integration receipts](../audits/EFFECT_WAVE_PROGRESS_2026-11-18.md#five-branch-integration-and-the-next-improvements)

**O2. Give automated play a cheaper reply and a better stopping point.** The MCP compact reply calls `lookFull` before diffing. That path collects controls, walks visible text and snapshots the game to get its clock. Add an opt-in receipt response that reads the live clock and returns advance, stop reason and relevant report IDs. For callers choosing their next move, offer one scoped view after the run. A further option is “advance to next decision, up to this horizon,” using the native blocking decision, work completion or other requested stop condition. Keep the existing full and compact paths for callers that need them. Test token volume and time spent in reply assembly separately from stepping. Keep observations within player knowledge, and tie actionable choices to the view that produced them. [MCP worker](../../scripts/mcp/game_worker.mjs) · [Life-walk evidence](../gm/dispatch/life-walk-2026-11-18/LIFE_WALK.md#lw15-tool-limits-met)

**O3. Make one quiet span exact.** The candidate's opt-in span probe was roughly three times faster on its Tingen sample and skipped per-minute passive XP. Village also differed in its random stream and Reports. Start with a registered native idle span and prove equivalence for XP and its level thresholds, duration ticks, timers, clock-driven work and event order. Compute eligibility with the existing controller-wake seam. Add one boundary fixture for a job, an expiring loan and a rule change at the same minute when the relevant owners are together. For per-holder clocks, convert each relevant holder's deadlines to a global wake and include rate changes. Use ordinary ticks whenever a writer or random draw can affect the skipped interval. [Simulation boundary owner](../../src/simulation.js#L534) · [Step-speed and span receipts](../audits/EFFECT_WAVE_PROGRESS_2026-11-18.md#five-branch-integration-and-the-next-improvements)

**O4. Parallelize independent lives first.** Game MCP already isolates sessions in child processes, and the Node runner boots one live game per process because it installs globals. Start by comparing one, two and four resident processes for the same seeded matrix. Reuse boots when fixture isolation permits it. Measure aggregate throughput, single-job latency and peak memory across children. A worker can compute a detached forecast, a pack index or a pure read from a versioned snapshot. The owning life checks its revision before using the result and settles effects, RNG and saves in order. Splitting consecutive ticks across threads would require dependency analysis across shared clocks, stock, effects and random streams. [MCP process owner](../../scripts/mcp/game_mcp.mjs) · [Node worker documentation](https://nodejs.org/api/worker_threads.html)

### UI responsiveness and ordinary play

**O5. Schedule visible reads by what changed.** Shared display reads already cut actor-context builds from 704 to 347 per ten seconds on a historical crowded fixture. Its longest task still ran about 250 ms at normal CPU and over 500 ms at 2× slowdown. Profile the current build, then migrate one visible slow panel to a shared read frame fed by the specific state revisions it uses. Update timers and counters independently from action controls. Retain selected rows, typed values, focus and scroll on refresh, and quote the action again at commit. Render lengthy Reports in pages or a window if profiling identifies DOM size as a cost, preserving keyboard access and jump-to-event. [Shared display-read results](../reviews/js-ui-performance-2026-11-06/REPORT.md#slice-2-shared-display-reads-installed-v06-7d4dcc19467b)

**O6. Prove one effect through ordinary play.** Start with the existing ward route where applicable, then a brew or Gu chore as a second caller. Put the current action, price or commitment and next choice together in the current pane. Use the same quote for the displayed cost and settlement; the life walk reported a patrol label of “5C” alongside “50 coins.” Use the settled consequence as the source for the immediate result, the active Condition row and the Reports history. Show source, remaining duration and a detail link when the player knows them. Fold repeated ambient messages by source and reason, with access to the details. Check that expiry updates Condition and that reload preserves history without playing the notification again. [Life-walk observations](../gm/dispatch/life-walk-2026-11-18/LIFE_WALK.md#lw13-empty-or-repetitive) · [Effect UI proposals](../ui/EFFECT_UI_STANDARDS_2026-11-18.md)

**O7. Make elapsed time readable at long horizons.** For rest, travel and catch-up, show what finished, what needs a decision and why time stopped. Use progress and cancel at a committed boundary during a long browser advance, including the time actually reached. In a separate developer view, report counts per effect cause, largest cascades, boundary categories and time spent per phase. This can distinguish a fast empty season from one that produced ordinary-play consequences. [Life-walk plug points](../gm/dispatch/life-walk-2026-11-18/LIFE_WALK.md#top-ten-plug-points-ranked-by-how-much-ordinary-play-they-would-change)

### Source reading

**O8. Read to select behavior that can be tested.** The JoJo, Toaru, Railgun, Ward, Wish Upon the Stars and Mother of Learning reader returns are already in the candidate. The report marks most mechanism readings as unchecked and shows taxonomy noise and duplicate translations. Start with source verification and one narrow adjudication batch on trigger, interruption and competing rules. Where present, record source edition and locator, stated condition, what actually fired, how a counter worked, who could observe it and what persisted. Use an independent reader on ambiguous and contradictory cases. Promote three verified cases into fixtures: a clean trigger, a counter or failure, and a collision or expiry. Use tabletop timing text if prose leaves resolution order ambiguous, and revisit the manga when usable text closes a named gap. [Batch reading workflow](../research/BATCH_READING_WORKFLOW.md) · [Reader return and receipt](../audits/EFFECT_WAVE_PROGRESS_2026-11-18.md#five-branch-integration-and-the-next-improvements)

## Later or delegate

| Order | Scope and suggested effort | Done check |
| --- | --- | --- |
| 1 | Performance engineer, medium. Separate boot, step, save projection, batch close and reply assembly. Try the receipt response and a narrow read first. | Alternating runs on Tingen, Village, crowded and active combat or work. Report game minutes per CPU and wall second, tail latency, memory and stable save digests. |
| 2 | UI engineer, medium. Migrate one ordinary effect route and its visible read model. | Rebuilt desktop browser proof at 1920×1080 and a laptop viewport with large text. Verify keyboard focus, quote, Condition, Reports, expiry and save/reload. Measure input-to-feedback and long tasks in the same scenario. |
| 3 | Engine engineer, high. Exact idle span with a single known-safe route, then expand by measured coverage. | Short ticks and long steps reach the same clock, canonical save, durable values, Reports and RNG positions. Inject a save failure during a transaction and verify the published state. |
| 4 | Research reader and adjudicator, medium. Verify a dozen to twenty source scenes for the selected mechanism. | Three candidate fixtures with evidence and competing outcomes. Record which missing input would justify another batch. |
| 5 | Performance engineer, medium. Compare process-pool throughput on fixed inputs. Consider a pack compile cache for boot-heavy jobs and a worker for a measured pure hotspot. | Results and ordering match serial execution. Compare total RAM across processes on the 8 GB target before raising concurrency. Consider WASM or Rust after profiling identifies a stable CPU-bound computation whose boundary costs can be measured. |

## Implementation preflight

| Field | Scope |
| --- | --- |
| Reading and authority | Weibao asked to fix the Reports mismatch, add the small step receipt, and verify parity, speed and responsiveness on the ordinary ward route. |
| Player sentence and route | The existing ward line shows held after a plain strike and broken after a reinforced strike. Use the earned Gu Keeper route and native controls at 1920×1080. |
| Mechanism, fit and ring | The stepper batch closes pending render work and saves. Reports owns its tail. The MCP worker serves the current game clock and player-visible Reports. Cover the save writer, MCP tool, player route, failure behavior and reload. |
| Rules and files | AR3, AR6, AR9, RT8 and FLR1–FLR6. Scope is the batch close, Reports projection, MCP step view, focused checks and ward harness. Keep the existing Reports save shape. |
| Failure scenario and checks | A deed earned during a long chunk can appear on screen after its durable checkpoint. Compare Tingen snapshots and stored values at 60/120/240, exercise transactional write failure, and play the ward through save, reload and literal import. |

## Implementation receipt

The reproduced Tingen difference was an earned deed line appended during a deferred refresh. The batch now refreshes the Reports slice of an ordinary pending checkpoint after the refresh, with the existing synchronous transaction path intact. The ward also exposed two independent problems. Reports loaded before the player's world port was bound, and “now available in navigation” notices could land at different render boundaries. The Reports history now binds to the live player world on restore. New panel-availability hints are visible during the sitting and excluded from the saved tail. Existing plain-text tails load as stored. [Reproduction](../../work/effect-wave-2026-11-18/ward-step-receipt/baseline.log)

**MCP.** `game_step({minutes: 60, view: "receipt"})` returns step timing, the clock, location, stop reason and up to three newly inserted visible Reports lines. It keeps the last compact baseline and invalidates stale action indices. Read `game_look({scope: "reports"})` when more history is needed. On two five-minute runs per view from the earned ward save, structured replies measured 397–449 B for receipt, 6.6–6.9 KB for compact and 16.4 KB for full. Timing samples were taken under shared load. [MCP size and timing samples](../../work/effect-wave-2026-11-18/ward-step-receipt/ward-mcp-perf.log)

| Floor | Verification |
| --- | --- |
| FLR1 | Rebuild exited 0. Browser bundle SHA-256 `cf2c3ac09c4740f43fadf086697eb02627691c00726647c156f3c070079f44aa`, built from primary on `eb029a974` with the working-tree edits present. [Build log](../../work/effect-wave-2026-11-18/ward-step-receipt/build-proof.log) |
| FLR2–4 | Fresh 1920×1080 headless Chrome origin. Earned Myriad Self through Gu Keeper, compared the disclosed force and cost, paid for the force-four hold and force-six break, then crossed through the unlocked gate. [Held](../../work/effect-wave-2026-11-18/ward-step-receipt/giant-hand-ward-held.png) · [Broken](../../work/effect-wave-2026-11-18/ward-step-receipt/giant-hand-ward-broken.png) |
| FLR5 | Held, ready, broken and crossed matched for ward state, expenditure, gate, clock and the harness's gameplay digest across save/reload and Export/literal Import. The saved Reports tail matched the Earlier lines after both reload and literal Import at each point. |
| FLR6 | Agent-verified on the earned route. No page errors. Trusted ward hold, break and crossing clicks took 140, 193 and 195 ms to the second animation-frame callback, used as a paint-opportunity proxy. Synchronous 10- and 20-tick preparation steps took 202 and 232 ms. These samples do not measure physical 8 GB hardware or establish an input-latency improvement. [Browser evidence](../../work/effect-wave-2026-11-18/ward-step-receipt/browser.json) |
| Change surface | Existing stepper and Reports owners, workspace navigation notice metadata and the MCP step view. Zero new cycles, save format changes or domain registrations. |
| Checks | `check:arch` and `check:rules` exited 0. The final Tingen deed regression passed with matching durable Reports and canonical saves at 60 and 120. [Architecture](../../work/effect-wave-2026-11-18/ward-step-receipt/arch-proof.log) · [Rules](../../work/effect-wave-2026-11-18/ward-step-receipt/rules-proof.log) · [Tingen](../../work/effect-wave-2026-11-18/ward-step-receipt/tingen-proof.log) |

The earned ready-to-strike ward save was advanced 240 minutes at seed 1 twice per chunk size. Every candidate run ended at clock 270 with canonical digest `cbf226d6958d178e` for both the live snapshot and durable save. The other storage keys matched with zero page errors. The archived `eb029a974` reference differed between its live snapshot and the durable save even at 60. [Ward headless log](../../work/effect-wave-2026-11-18/ward-step-receipt/ward-parity-proof.log)

| Build and chunk in minutes | CPU seconds, two samples | Wall seconds, two samples |
| --- | --- | --- |
| Before, 60 | 3.94, 3.63 | 3.47, 3.19 |
| Candidate, 60 | 3.99, 3.72 | 3.52, 3.27 |
| Candidate, 120 | 3.12, 3.13 | 2.71, 2.72 |
| Candidate, 240 | 2.81, 2.82 | 2.44, 2.44 |

The default chunk was effectively even with the reference in this sample. At 240, the candidate used about 27% less CPU than its 60-minute setting. Larger chunks remain an explicit headless benchmark setting. Focused Reports, batch validation and transaction-failure tests passed 17/17. The receipt passed the stdio protocol check. The full suite and hardware qualification were outside this focused pass. [Focused tests](../../work/effect-wave-2026-11-18/ward-step-receipt/focused.log) · [MCP protocol check](../../work/effect-wave-2026-11-18/ward-step-receipt/mcp-check.log)
