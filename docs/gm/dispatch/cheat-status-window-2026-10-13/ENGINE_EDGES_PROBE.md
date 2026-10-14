# Shipped cheat stage 0: engine edge probe

2026-10-14, America/New_York. Read-only technical assessment; stage-1 rules below are proposals, not accepted behavior or new gates.

Pinned build: `master` at `cc5fa55614985127a28058368f5722ef9a1848e5`, fresh detached `/tmp/yairpg-te`. Ran the requested `git worktree add --detach /tmp/yairpg-te master`, `npm ci`, `node build.js`; installation/build exited 0, zero dependency vulnerabilities and zero Ink diagnostics. Served only `127.0.0.1:18471`. [Snapshot/build output](runs/te/snapshot-build.log) and [served-byte SHA-256 equality](runs/te/served.log) identify the rebuilt bytes. Desktop browser: isolated headless installed Google Chrome, 1366×768 for the main probe. No personal browser/profile/save was used.

Read the live AGENTS.md, PROJECT.md authority summary, CHEAT_LIBRARY ME1–ME8/OS6, AUDIT_REPORT, and the pinned runtime. This task implements no product decision. Stage 0 remains informational; desktop/laptop is primary and mobile work is deferred. No source, gate, other owner or commit was changed. All scripts, fixtures and outputs are under `runs/te/`, as OS6 requests for probe hooks outside shipped code.

Evidence vocabulary: **source** means code/contract inspection or isolated module execution; **seeded-native** means synthetic fixture/input followed by the rebuilt real browser runtime. No new natural-from-creation journey was run. Source references below are to the pinned commit, not the moving primary checkout. [Numbered source excerpts](runs/te/source-lines.log) and [full RNG scan](runs/te/rng-scan.log) preserve evidence after worktree removal. Commands used: `node runs/te/probe.cjs`, `node runs/te/contracts.mjs`, `node runs/te/travel.cjs`, `node runs/te/import-lifecycle.cjs`, with paths relative to this dispatch directory. Their complete outputs are linked per finding.

## TE1 · ME1: there is no single post-tick awakening settlement order

**Label: source.** Day awakening executes after `update_timer()` advances the calendar but before the tick's effect/activity work, XP and final title check (`src/main.js:7242-7267,7688-7690`). It is guarded by `curr_day > prev_day`, then `awakenCheats` checks `dayCount >= 3`. A skill level earned later in that callback is therefore not part of the awakening snapshot. The panel's independent 250ms render subsequently reads current stats (`src/status_window.js:23-33,43`); that eventual display does not establish a durable shared settlement boundary.

Combat has a separate timeout loop. Attack actions, skill XP, enemy defeat, character XP and loot precede the end-of-group callback (`src/models/combat.js:210-234,433-453`). Within `finish_combat_round`, awakening and its save run **before** incrementing `enemy_groups_killed`, clear rewards and clear quest events (`src/main.js:3640-3662`). Thus a kill-induced character level is already visible at awakening, while a clear-reward level is not. Stance skill XP is also applied before the callback. Combat and minute callbacks run in event-loop order; no common atomic “tick plus combat result” exists. The special-combat branch at `combat.js:231-234` clears loops instead of calling this normal victory callback.

Command evidence: [source-lines.log](runs/te/source-lines.log), especially the `nl -ba src/models/combat.js` and `nl -ba src/main.js` outputs. The current `awakenOptionalStart` assigns state, emits the message and renders before saving (`main.js:308-315`); the prior audit's failed-write result agrees with that order. This probe did not repeat its storage-fault journey.

**Smallest stage-1-safe rule:** settle native facts for the triggering transition first, then evaluate awakening/opening/completion from that settled snapshot, stage one validated save, and publish messages/controls only after the write succeeds. Give combat settlement the same explicit hook after defeat XP, loot and clear rewards. Do not infer transaction order from the next panel render or require simultaneous independent callbacks to share one tick.

## TE2 · ME3: cheat operations draw nothing; native gameplay is not one seedable stream

**Labels: source; seeded-native for the isolated browser API observation.** Card selection/grant, awakening, messages, lookup and status rendering contain no RNG calls (`src/cheat_cards.js:65-101`, `src/status_window.js:23-44`, `src/main.js:8165-8177,8316-8325`). The browser dynamically imported the real cheat module, counted `Math.random` only around grant/awaken/20 lookups/repeated awakening, and returned:

```text
PURE_CHEAT_RANDOM {"calls":0,"messages":1,"repeat":0}
```

[Browser output](runs/te/browser.log). This isolates the cheat functions; it does not count an entire simultaneously running game as “zero random.” The regular tick, combat, save-related systems and other UI still run normally.

Existing call sites and reusable mechanisms:

| Owner | Call sites and consequence |
| --- | --- |
| Native combat | `src/models/combat.js:160,319,323,351,377` uses `Math.random` directly or `rollBaseCombatDamage`, whose default is `Math.random` (`src/combat_math.js:34`). Loot is requested at `combat.js:446`. These rolls are not restored from a saved JS random seed. |
| Native crafting/actions/background | `src/main.js:2593,2933,4224,4236,4273,4694,7503,7574-7581` consumes `Math.random`; `src/misc.js:68-69` also does. A board using this global source would share randomness with unrelated work. |
| Expansion engine | `createExpansionState(seed)` stores `rng` (`src/expansion_engine.js:73-76`). Private `draw(state)` is xorshift32 (`:517-521`); action selection uses it at `:557,577`. Drawing from the live expansion state would shift those outcomes. |
| Simulation | `src/simulation.js:38-39` has deterministic hash/xorshift helpers. Automatic checks get independent derived states at `:69`; some manual choices advance `simulation.seed` at `:182-186`. Exported `deriveSimulationSeed(seed,id)` (`src/simulation_resolution.js:4-7`) hashes without consuming its input; event checks use it at `src/simulation_effects.js:378`. |

Command output: [rng-scan.log](runs/te/rng-scan.log), generated by `rg -n 'Math.random|seed|rng' /tmp/yairpg-te/src`, plus numbered excerpts. There is reusable deterministic machinery, but no shipped cheat-owned stream or public universal RNG service. “Reload gives the same fights” is not a current guarantee for native `Math.random` combat.

**Smallest stage-1-safe rule:** a fixed first quest needs no random draw. If selecting candidates, persist a board-specific seed/state inside the card, derive it once with a versioned domain ID from an existing saved anchor without advancing that anchor, then draw only against the board state. Reuse the hash/xorshift mechanism, not the live expansion or simulation state. Persist selection before presentation; rendering and restore draw nothing. Do not promise deterministic native fights as a consequence.

## TE3 · ME4: one origin has one save writer; preview stays stale

**Label: seeded-native.** [probe.cjs](runs/te/probe.cjs) opened two real pages in one browser context and origin against the same seeded dormant save, day 2 at 23:55. Both Play buttons were clicked before the boundary. [browser.log](runs/te/browser.log) records:

```text
TWO_OWNER_AFTER: day 3 00:01; visible=true; one awakening message in save and owner log
TWO_PREVIEW_AFTER: visible=false; no awakening line in its log; “This tab cannot save local actions.”
LOCKS: held=[{mode:"exclusive",name:"yairpg-save:save data",...}], pending=[]
PREVIEW_WRITE_UNCHANGED true
PREVIEW_AFTER_OWNER_CLOSE: visible=false
PREVIEW_RELOAD: visible=true; stored messages still exactly one; no new awakening log
```

The logged `time` and `cheats` in both snapshots read **shared durable localStorage**. They are not independent live-state snapshots of the preview. Preview visibility/log and the unchanged bytes are the independent observations: only the owner published awakening, the preview did not overwrite it, and it did not automatically refresh or acquire ownership when the owner closed. Reload acquired ownership and restored the existing awake card silently.

Existing other-tab detection is Web Locks, `ifAvailable:true`, held until document close (`src/main.js:585-598`). Lock failure sets the read-only explanation (`:7878-7888`). Serialization and saves refuse nonowners (`:4937,5255`); import also refuses (`:7058`). The legacy clock fallback lacks a direct ownership guard before `goUp` (`:7175`), but its local-life publication rejects the preview and returns zero in this exercised fixture; the stronger joined-clock guards are at `:7131,7153`. Do not treat this result as exhaustive proof of every alternate timer/combat entry path. No `storage` listener or BroadcastChannel handoff was found in the runtime scan; this lock is exclusion, not live synchronization.

**Smallest stage-1-safe rule:** reuse the whole-save writer lock for opening, completion and claim, explicitly reject nonowner commands before mutation, and keep a visible read-only explanation with reload takeover. Read the current authoritative row under ownership and persist its claim identity once. No additional cross-tab bus is needed for this slice; do not let a stale preview pay a claim.

## TE4 · ME5: visibility-only emulation barely changes timing; suspension is different

**Label: seeded-native.** Starting from day 2 23:59, the visible control awakened at 00:00 in **1,135ms** after Play. With `document.hidden=true`, `visibilityState='hidden'` and a dispatched `visibilitychange` event, it awakened at the same game time in **1,098ms**. Six seconds later the controls read 00:06 visible versus 00:05 hidden; both retained exactly one message. [browser.log](runs/te/browser.log) includes the full state and actual timeout implementation.

This is **JavaScript visibility emulation**, not Chrome background scheduling emulation. It tests application dependence on visibility; the one-minute sample difference is scheduling noise, not evidence of a hidden-tab throttle factor. No hidden-visibility branch governs awakening. The shipped `index.html:15` loads HackTimer, and `resources/js/HackTimer/HackTimer.min.js:1` creates a Worker and replaces window timeout/interval functions with worker-message timers. The measured function string is the HackTimer wrapper, so this browser used it successfully.

A separate real CDP lifecycle experiment ran `Page.setWebLifecycleState` frozen for 6 seconds, then active for 1.8 seconds. From 23:59 it reached 00:02, awake with one message ([import-lifecycle.log](runs/te/import-lifecycle.log)). This is consistent with delayed/queued work resuming and ordinary ticks, not full wall-time catch-up. There was no sample while frozen, so it does not establish the precise queued-callback count. Long background intensive throttling, OS sleep and tab discard were not measured. HackTimer does not make them equivalent to foreground execution.

Source: `src/main.js:7226-7246,7673-7691` schedules one simulation step per callback, adjusts delay within ±100ms/tickrate, and does not award elapsed-minute catch-up. `src/config.js:19,23` sets one tick/second and six minutes per sleeping tick.

**Smallest stage-1-safe rule:** evaluate absolute committed calendar/skill facts after every time settlement, independent of visibility, callback count or elapsed wall seconds. Hidden or suspended pages may reach the same game-time threshold later in real time. Restore remains silent for already recorded transitions. No new background timer is needed.

## TE5 · ME7: clock jumps can bypass the day-3 hook

**Label: seeded-native for travel, restore and wall-clock injection; source for the offline subsystem.** [travel.cjs](runs/te/travel.cjs) starts from the pinned day-2 23:15 fixture, unlocks the field using ordinary elder dialogue, and makes four native 15-minute trips. After six more seconds:

```text
travel.log: day_count=3, hour=0, minute=23; awakened=false; messages=[]; kills={}; visible=false
browser.log PAST_DAY3_RESTORE: day_count=5, 23:18; awakened=false; messages=[]
browser.log WALL_BEFORE: day 2 23:16
browser.log WALL_PLUS_7_DAYS: day 2 23:19; awakened=false
```

[Travel output](runs/te/travel.log), [screenshot](runs/te/travel-crossed-day3.png), [browser output](runs/te/browser.log). The day-5 test seeds an internally compatible legacy-calendar fixture; it is not an earned five-day journey. The +7-day test replaces page `Date.now()` while retaining real browser scheduling. It proves this input does not turn into seven days of general offline progression, not that physical machine sleep was tested.

Travel's `progress_time` advances time without checking awakening (`src/main.js:2233-2234,7193-7196`). The next update captures `prev_day` after that jump and sees no boundary of its own (`:7243-7259`). Restore likewise loads the card without an overdue-threshold check (`:5290-5302,7075-7096`). A sleeping tick that itself crosses a day still reaches the existing boundary hook; multi-day `Game_Time.goUp` correctly increments `day_count` (`src/game_time.js:18-32`). The defect is the location of evaluation, not calendar normalization.

There is also a distinct bounded prepaid packing “offline” mechanism. It requires an armed batch, a trusted wall timestamp and explicit reviewed elapsed request capped at 120 minutes; credited time is limited by escrow and two-minute quanta (`src/backlog_expansion_time.js:79-94,197-216`). It is not universal offline catch-up. This probe did not arm/play that subsystem, and does not claim its native interaction with awakening was exercised. General load simply restores the saved calendar; `saved_at` is not used there to simulate missing days.

**Smallest stage-1-safe rule:** run an idempotent `current day >= threshold` evaluator on every successfully settled clock change, including travel/sleep/explicit offline credit, plus an explicit legacy-overdue reconciliation policy at writable restore. For a jump, record all newly eligible rows once and emit one summary after commit. Raw wall-clock changes alone must not grant game-time progression. Do not use `prev_day` equality as the only eligibility check.

## TE6 · ME8: small now, uncapped message growth later

**Label: source, measured with real serializers/module functions.** `node runs/te/contracts.mjs` reports compact JSON sizes for the pinned dormant fixture and real `awakenCheats` result:

| Serialized value | UTF-8 bytes | UTF-16 storage bytes |
| --- | ---: | ---: |
| Dormant card | 187 | 374 |
| Dormant held entry, including acquisition | 318 | 636 |
| Dormant cheat domain | 367 | 734 |
| Awake held entry | 470 | 940 |
| Awake cheat domain | 519 | 1,038 |
| Whole dormant fixture | 46,498 | 92,988 |
| Cheat domain after 100 additional short messages | 10,819 | 21,638 |

[contracts.log](runs/te/contracts.log). Timestamp widths/text affect these values. The first awakening adds 152 UTF-8 bytes to the domain. The chosen 19-character probe messages add 103 bytes each at this calendar. These are JSON sizes, not compressed/export base64 sizes; export framing/base64 adds overhead.

Current stage 0 records only one awakening per explicitly dormant card (`src/cheat_cards.js:89-101`). `recordCheatMessage` appends forever, validates/clones the whole domain before and after appending (`:47-76`); there is no retention or text-length cap. General state/hooks/stages arrays are also arbitrary JSON. Thus future repeated board receipts could grow both saves and copying cost linearly per record, with cumulative repeated-copy work increasing across a long history. This is a growth path, not a current observed performance failure. Save writes enforce a shared 4MiB UTF-16 budget across origin keys (`src/save_files.js:194-211`); other saves/backups consume that budget too.

**Smallest stage-1-safe rule:** persist compact row IDs, immutable baselines/targets, seed and lifecycle/claim markers; derive presentation from definitions. Bound optional message history with an explicit retention policy while preserving the small durable records that prevent replay. Never use a prunable message as the sole proof that a point was paid. Stage 0 itself does not need a size optimization.

## TE7 · ME6: unknown state survives; unknown closed fields reject

**Labels: source for the import matrix; seeded-native for literal-file import.** `validateSaveEnvelope` validates cheats before preflight (`src/save_files.js:40-42`); decode then preflight then guarded storage is the explicit order (`:158-191`). C0's envelope is closed, but card state is open JSON (`src/cheat_cards.js:1,11-15,32-63`).

The real import function with a stub preflight/storage produced this command output ([contracts.log](runs/te/contracts.log)):

| Mutation | Accepted | Preflight calls / writes |
| --- | --- | --- |
| `card.state.futureField={revision:9,payload:'retain'}` | Yes, exact cheat preservation | 1 / 1 |
| `card.state.board=[{kind:'future-quest',reward:99}]` | Yes, exact cheat preservation | 1 / 1 |
| Unknown direct card field | No | 0 / 0 |
| Unknown held-entry field | No | 0 / 0 |
| Unknown message field | No | 0 / 0 |
| Cheat domain schema 2 | No | 0 / 0 |

The stub matrix proves validation/write ordering, not real-loader acceptance. The complementary browser run uses actual `#saved_file_input`, loader preflight and Save: a nested `card.state.future={schema:8,board:[{kind:'future-kind',reward:12}]}` survives import and the subsequent native load/save unchanged. An unknown direct card field is rejected with “Current save kept. Invalid cheat card…”, with no save created on that clean origin. [import-lifecycle.log](runs/te/import-lifecycle.log) and the two literal save files preserve these inputs/results. Preservation of a preexisting life was not separately exercised in that browser case; zero-write rejection is established by the module matrix and source order.

Stage 0 neither interprets unknown board kinds nor marks them retired. It does not silently refund them either. Generic foundation retirement is not a typed cheat-board compatibility policy.

**Smallest stage-1-safe rule:** add a versioned typed contract inside this card's open state. Explicitly migrate recognized legacy shapes; preserve unsupported data, and make unknown row kinds inert/retired without completing, paying or refunding them. Reject unsupported board schemas before preflight/storage if safe retention cannot be interpreted. Keep the existing closed outer envelope rather than silently dropping its unknown fields.

## Branch comparison and completion limits

At initial inspection and the final comparison, `master` and `ui/cheats-r1` both resolved to `cc5fa55614985127a28058368f5722ef9a1848e5`. `git log master..ui/cheats-r1 --oneline` and `git diff master...ui/cheats-r1 -- src/main.js src/cheat_cards.js` were empty. Its latest cheat runtime commit visible in the log was existing CH1 `dc06d02e`; no committed R1 awakening fix was available to qualify these findings. The other worker's uncommitted code was not read or tested. A later committed change that moves awakening to durable post-transition settlement would directly change TE1/TE5 and may affect TE3/TE4; that is conditional, not a branch acceptance claim. [Branch snapshot output](runs/te/snapshot-build.log).

Only the bounded probes above were run. No gate or full regression suite was rerun for this report, and no stage-1 implementation, natural combat journey, long background-throttle run or human acceptance is claimed. Cleanup evidence is in [cleanup.log](runs/te/cleanup.log): own Chrome sessions closed, the sole probe server stopped, and the detached worktree removed. Other workers and existing worktrees were left intact.
