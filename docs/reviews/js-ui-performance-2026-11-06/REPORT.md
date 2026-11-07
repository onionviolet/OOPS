# JavaScript costs and a clearer experiments view

**Installed follow-up:** the Tauri app now serves verified build `v0.6-7d4dcc19467b` (shared display reads, slice 2), built on `v0.6-231c350d8838`. Details below.

The remaining weight comes from repeated fact projection, full dictionary copies and UI/style work. This pass improves those paths and repairs a reproduced input-detachment problem. It does not establish that the whole game now meets its performance budgets.

## Slice 2: shared display reads (installed `v0.6-7d4dcc19467b`)

On the crowded save, the game rebuilt every actor's full context about 70 times a second, nearly all outside the existing one-build-per-pass frame: per-tick and per-clock panel refreshes, plus the tempo panel's four quotes per poll. Those reads now join one pass. Field-works reasons read only their rule's facts, and each actor's world-completion context skips one full-dictionary copy. Builds per 10 s dropped from 704 to 347.

| Crowded, normal speed (alternating pairs) | Installed before | Candidate |
|---|---|---|
| Task busy | 63.2 / 63.6% | 51.8 / 51.2% |
| Script busy | 42.8 / 43.1% | 29.6 / 29.4% |
| Longest task | 322 / 323 ms | 250 / 249 ms |
| Retained heap | 181 MiB | 182–184 MiB |
| Style recalculations | 52/s | 63/s (layouts 3/s both; the rise is likely freed timer work, inferred) |

Under 2× CPU slowdown, script time fell from 75–79% to 64–66% and the longest task from about 615 ms to 500–530 ms, but the main thread is still saturated. The comfortable target is not met under that proxy, and physical older 8 GB hardware is still unqualified. Fresh saves show no meaningful change. Durable saves are byte-identical to the installed build (fresh and crowded, 8 minutes). Four desktop routes pass, and visible controls match exactly. The hidden signed host passes save, quit and relaunch. Full suite: 5522 pass, 0 fail, 5 optional skips. Diagnostic audits found zero writes to shared context objects and zero stale reads within a pass, idle and across the four UI routes. Agent-verified, not human-reviewed; no commit. Receipts: [pairs](display-frames-crowded-pairs.json), [saves](display-frames-determinism.json), [UI](display-frames-ui.json), [host](display-frames-tauri.json), [install](display-frames-installation.json), [1920×1080](display-frames-1920.png). Details and next leads (shell render timer, reveal-observer visibility checks): [task record](../../gm/dispatch/js-ui-performance-2026-11-06/CHECKPOINT.md#slice-2-shared-display-reads-2026-11-07-claude).

## Older 8 GB computers: measured follow-up

The previous 16 GB/M2 recommendation was not hardware-qualified. The accepted target is comfortable play on older computers with 8 GB RAM, now recorded in AD39 and the vision owners. This pass reduces measured waste; it does not certify a CPU generation or physical 8 GB machine. Test host: Apple M5 Pro, 64 GiB RAM, macOS 27.2. Current installed executable is arm64, bundle minimum macOS 14; performance optimization does not add Intel/older-OS packaging support.

| Code | Heavy path and correction | Verified scope |
|---|---|---|
| F4 | Fact-cache dependency trie allocated a Map for each field/value. Replace it with compact complete identity vectors bucketed by registry, actor and target. | Five alternating process pairs, 68 actors  × 1,500 scalar facts: median live cache metadata 35.91→1.97 MiB (~94.5% less); lookup 144.3→78.7 ms (~45% less). Exactly 68 builds in every run. This is isolated cache metadata, not whole-app RAM. Complete dependencies, invalidation, SameValueZero identity and defensive copies remain. |
| F5 | Coin feedback requested computed styles even for unchanged/increasing purses or disabled automatic feedback. Reject those events before checking the start-screen geometry. | Regression proves no style read/no receipt on ineligible events and one exact receipt on a trusted spend; no game money/save/timer changes. |
| F6 | Secondary-stat fitting and log controls rewrote unchanged hidden/label/title/data values. Existing global reveal observers then rechecked hidden panels. | Guard repeated writes while preserving layout calculation and controls. Rebuilt 1920×1080 and 1536×864, native saved 14/21 px settings, all four interaction routes pass, including live native-stat changes and a committed experiment. Samples vary: final crowded style recalculations 50.3/s during the suite, 55.7/s in the later quiet sample versus baseline 55.3/s. No reliable overall style-rate reduction claimed; the eliminated redundant writes are the verified structural change. |

The browser retains roughly 173–174 MiB fresh and 179–196 MiB crowded after GC in these synthetic scenarios. Final crowded 2× CPU slowdown under shared test load advances 0.80 game min/wall s and reports a 698 ms longest task. This stress scenario still misses the comfortable target. Pre-GC allocation peaks vary considerably. The native sampler could attribute the host but not all WebKit helpers in this agent-launched setup, so no complete native RAM figure is claimed. Older-machine comfort depends more on CPU bursts than these retained JavaScript heaps alone. Both baseline and intermediate candidate stall in the crowded 4× CPU-throttle test; that remains an unresolved stress limit, not a verified older-hardware result.

[Task/evidence record](../../gm/dispatch/js-ui-performance-2026-11-06/CHECKPOINT.md), raw probes and reconstruction patch: `work/older-8gb-20261106/`. Frozen candidate `v0.6-231c350d8838` is based on `04c5fd798` plus 17 owned source/test/style paths; other concurrent primary work is excluded. Build/arch/rules pass. Final isolated full suite: 5518 pass, 0 fail, 5 optional skips (373.3 s). Installed adoption preserved both protected saved files, retained the previous frozen build/rollback pointer, and verified the unchanged signed host. [Installation receipt](older-8gb-installation.json). No commit or push. Agent-verified, not human-reviewed. Hidden signed Tauri crowded save/quit/relaunch passed with no errors/missing files/timeouts. Fresh and crowded 8-minute simulations preserve all saved values; fresh raw JSON property order differs while keys/values match exactly, crowded bytes match.

Last sequential crowded comparison after the full suite: task busy 63.1→59.8%, script 42.3→40.3%, max long task 327→296 ms; retained JS heap 184.3→178.9 MiB. Both keep ~1 game minute/wall second and 60 saves/min. One matched pair on a shared machine, not a reliable overall percentage or older-hardware certification. [Before](older-8gb-quiet-before-crowded.json), [after](older-8gb-quiet-after-crowded.json). The cache microbenchmark is the strongest quantified allocation reduction; expensive projection/copying and the ~51k-node populated DOM remain profiling candidates.

## Changes and evidence

| Finding | Correction | Evidence |
|---|---|---|
| F1: world-completion aggregation allocated entries for the full context dictionary, then discarded unrelated facts | Collect this family's output as its leaf projections run, preserving supplied family facts and leaf dependency order | Identical projection output; focused synthetic 1,500-fact benchmark median 969 → 821 ms for 500 calls, about 15% faster, seven alternating-order runs. Not a whole-game speedup. |
| F2: hidden experiments rebuilt quote/control DOM as the clock changed; repeated unchanged shell writes also caused work | Defer hidden experiments, track visibility without repeated forced geometry, retain the empty recipe prompt, skip unchanged root/resource/status writes and explicitly hidden combat style reads | Final browser proof observes zero child-list changes in the hidden experiments panel over 2.2 s. Same-clock readiness and reveal regressions pass. |
| F3: a browser checkbox click timed out because clock updates detached its input | Keep material inputs and method options until their contents change; keep the experiment detail when its displayed terms match, while updating the underlying quote on every visible refresh | Regression preserves focus, a partly typed quantity and the action node across a clock update, then executes the latest quote. Browser route gathers, selects, closes and reopens with selection retained. |
| D1: supply books pushed the current experiment below the fold | Group shelf and carried references under a native Books and methods disclosure, collapsed by default | Rebuilt 1920×1080 browser screenshot and interaction check; controls remain available through the disclosure. Local implemented choice, not a global design rule. The commitment can still need panel scrolling; this does not solve every above-the-fold layout issue. |

[Expanded experiments screenshot](experiments-proof.png). [Browser receipt](ui-proof.json). [Focused benchmark](projection-benchmark.json). [Task record](../../gm/dispatch/js-ui-performance-2026-11-06/CHECKPOINT.md).

## Performance limits

The initial crowded Chrome profile measured 83.7% task busy, 52.8% script busy and a 459 ms longest task in a 12 s window. Top self costs were world-completion aggregation (831 ms), shell rendering (586 ms), facts reads/copies (550 ms), visibility checks (487 ms), combat eligibility (478 ms) and crafting detail (464 ms). Initial fresh task busy was 20.2%.

An early comparison reduced crowded aggregation self time to 478 ms, but overall task busy only moved to 82.4%. Subsequent samples overlapped another session's full suite and other verification processes. They are retained as raw evidence, **not** used to claim an overall speedup or regression. CDP windows reported values above 100% under that load, another reason not to interpret them as reliable comparative utilization.

The standing perf gate compared HEAD `abdaedf0ab` to the dirty working tree: durable saves identical on fresh/crowded, no page errors, best-of-15 Node tick 0.16/12.36 ms within its 1/17 ms budgets. It failed existing fresh CPU, long-task and storage-volume ceilings, plus crowded CPU and long-task ceilings. The gate candidate preceded the final input/detail retention and disclosure polish. Budgets were not relaxed. Autosave cadence, game speed and save schema were not changed.

`baseline.json`, `after.json` and `standing-gate.json` are measurement receipts for their recorded candidates, not final installed-build evidence. Those temp snapshots omitted the private font and optional private-pack manifest; the final UI proof links the existing local private font. Missing optional packs qualify world coverage. No private player save was read.

## Visual direction

[UI audit round 35](../../audits/UI_DESIGN_CORE_AUDIT.md#round-35-2026-11-06-polish-that-also-removes-repeated-ui-work) owns VG1–VG5. The recommended continuation is to improve the current Luminous Gothic hierarchy: current subject/action/commitment first, quieter supporting metadata, readable navigation and category counts, then selected world-specific accents. A focused desk/notebook view is an optional task form. A broad reskin and permanent animation do not address the measured work. Independent panes, player Appearance settings, full-height Reports, meaningful costs and known-information boundaries remain.

## Verification and delivery

Final build and browser receipts are recorded in the task checkpoint. The overlapping full suite passed 5,525 tests, zero failures/skips (644.5 s); final focused crafting checks passed 17/17. Architecture and rules checks passed, with unrelated existing prose/direction-sync warnings. The full suite is reused from the overlapping checkout run only for the inputs it actually exercised; the later local UI grouping and experiment-detail retention have their own focused and rebuilt-browser checks. A final hidden Tauri crowded-fixture smoke also passed with no page errors ([receipt](tauri-final.json)); optional private-pack manifest misses qualify world coverage. Source changes are uncommitted. The initial pass left the installed app untouched; the follow-up below now records its update. No visible window was opened.


## Installed follow-up

The experiments view now puts process/materials beside the current quote and result. Both sides scroll independently, and the existing action remains above Back. Inventory labels and counts use separate baselines; the native large-text Find/filter popover uses three equal columns so its longer labels fit. Source stat changes mark the shell for repaint, unchanged attribute models skip repeated paints, inventory visibility is counted once after filter writes, and actor contexts reuse their freshly merged facts rather than copying them again.

[Default desktop screenshot](followup-experiment.png), [1536×864 at 21 px](followup-experiment-large-text.png), [large-text inventory controls](followup-inventory-large-text.png).

The isolated full suite passed 5,516 tests, zero failures, with five optional private-source/checkpoint tests skipped. Final CSS checks passed 14/14; all four rebuilt desktop/profile combinations passed with actual 14/21 px fonts and no page overflow. The source-mirror fixture, current-quote experiment commit, fresh/crowded deterministic saves, seven Rust tests and signed-binary frozen quit/relaunch passed. Architecture and rules checks passed. The native check's JavaScript/host identity is identical to the installed candidate; its final CSS-only inventory correction has separate browser evidence.

The installed package signature and host hash were verified. All 126 runtime files, including existing fonts/content packs, were retained; storage and save-mirror bytes are unchanged. The app was not launched on the player's profile. It uses the update on next launch. [Installation receipt](installation.json), [UI proof](followup-ui.json), [save comparison](followup-det.json), [native receipt](followup-tauri.json). Rollback retains the old package and `v0.6-a4982e8239d6` build pointer in the task's local work directory. Source is uncommitted; no push occurred.

The first clean-input profile improved task busy from 17.9→14.7% fresh and 65.8→62.3% crowded, but the final-build recheck was 19.4%/64.9% and partly overlapped viewport checks. Overall CPU gains are therefore modest/uncertain, not a guaranteed percentage improvement. No memory/battery claim or relaxed budget follows. Full fact copies, leaf projections and remaining shell visibility work are still the main measured families. [First comparison](followup-after.json), [final recheck](followup-final-profile.json). The task fixes repeated work and real interaction/layout defects without changing simulation speed or save cadence.

## Current hardware target: older computers with 8 GB RAM

Weibao selected comfortable older-computer/8 GB play after questioning the agent's M2/16 GB estimate. That estimate is superseded as guidance, was never a measured minimum and is preserved in the project log. [USER_VISION](../../USER_VISION.md#comfortable-play-on-older-8-gb-computers-2026-11-06) owns this direction; the task checkpoint owns optimization evidence. No exact CPU generation, new runtime memory/latency budget or validated minimum is inferred from the request.

The verified environment remains M5 Pro/64 GiB/macOS 27.2, with an arm64 app declaring macOS 14 in its bundle. This does not qualify older CPUs, 8 GB system RAM or older macOS releases. CPU throttling is a stress proxy, not physical hardware qualification. Distinguish actual game limits from what an unfinished implementation currently costs. New memory evidence must separate retained heap, transient allocations, DOM, native/WebKit footprint and system RAM.
