# R1 stage 0 hardening, 2026-10-14

Worker branch: `ui/cheats-r1`, isolated worktree `.claude/worktrees/ui-cheats-r1`, base `cc5fa55614985127a28058368f5722ef9a1848e5`. Source commit: `88a7561e2b54cd07bff3d1df93f6ce8a85ec5a22` (Harden stage-zero cheat awakening and status discovery). Final full wrapper exited 0 after the last source/CSS edit. No merge or push is authorized for this worker.

Authority and scope: GOAL.md R1–R6/REG, live CHEAT_LIBRARY AW1/AW2/AW4/AW5, AGENTS.md and USER_VISION desktop priority. The shipped milestones remain first won fight or day 3. Target: 1366×768 Standard and Vivid, a visible level row at arrival and keyboard access to contents. The existing CH1 regression also covers 1440×900 and 1920×1080. Mobile, stage 1, additional milestones and new panels are deferred. No product direction changed, so the live direction owners were not rewritten.

## What was wrong

- **F1:** Live awakening, first log line and panel discovery preceded successful persistence. An awakened-only quota fault left durable cheats dormant but published the arrival; recovery did not retry until a later day boundary.
- **F2:** Travel crossing day 3 and import already past day 3 missed the tick-local day-boundary check.
- **F3:** An awakened flag alone discovered the card, and negative/fractional points and message-free awakened imports passed validation.
- **F4:** A reveal marker could occur below the desktop viewport; F6 reached the shell but Tab had no focusable contents.

## Named source hunks

Paths are relative to the worker worktree.

| Hunk | File:line | Change |
| --- | --- | --- |
| C1 | `src/main.js:308` | Stage the complete candidate save with awakened card and first message. Validate, then write through the existing lifeSaveStorage owner. Publish cheatState at its durable callback; log/render afterward. Failed writes leave live and durable card dormant for retry. A post-durable display error cannot roll back the committed card. |
| C2 | `src/main.js:1019` | Check after a joined calendar plan has been persisted and published, including native joined journeys/time advances. |
| C3 | `src/main.js:7066` | Check after full load finishes; import preflight, read-only ownership and blocked/error loads remain guarded. |
| C4 | `src/main.js:7209` | Check after the ordinary clock advances, covering tick, travel and sleeping sources through the same function. |
| C5 | `src/main.js:7266` | Retry on a tick without advancement; remove the old awakening call inside the tick-local day-change branch. |
| C6 | `src/main.js:7908` | Evaluate restored state when save ownership is acquired. Persisted won zone rounds supply the existing first-win fact on retry/load. An individual bestiary kill is not treated as a won fight. |
| V1 | `src/cheat_cards.js:40` | Any present points value must be a non-negative safe integer; rejection names the card. |
| V2 | `src/cheat_cards.js:60` | An explicitly awakened held entry must have its validated first message. |
| V3 | `src/cheat_cards.js:89` | Discovery requires messages; construct the complete awakening transition before validating so no awakened/message-free intermediate is passed through validation. |
| U1 | `src/status_window.js:10` | Focusable labelled contents region, labelled only after discovery. Existing awakened restores start known and do not scroll/replay. |
| U2 | `src/status_window.js:41` | At the live transition, update the existing workspace layout and bring the level row into view in the same turn as its reveal. |
| U3 | `styles/status_window.css:13` | Contents focus ring uses the existing workspace focus color, with an inset offset so the panel container cannot clip it. |
| T1 | `tests/cheat_awakening.test.js:10` | Four new cheat-awakening tests: discovery/legacy contract; invalid imports before preflight/storage; real-game clock jump with targeted write fault, dormant live/durable state, recovery and message uniqueness; partial enemy kill remains dormant on load. |

`src/save_files.js` needs no edit: its existing validator path already calls validateCheatState before import preflight or storage. No other gameplay files were changed.

## Compatibility decision

Save schema remains 1; no migration or new field. Missing cheats still defaults to the empty domain. Valid C0 cards with `{}` state and a stored message keep their known presentation; missing points still displays zero. Valid CH1 dormant/awakened saves retain their acquisition and message records. Past-milestone dormant saves now commit their normal awakening on load/ownership or the next eligible clock check.

Previously accepted malformed entries with `awakened:true` but no message, or present points outside the non-negative safe-integer range, are intentionally rejected before import preflight/writes. No first message, historical reward or point value is fabricated to repair those inputs. No personal save was used.

## Gate first and baseline evidence

The unchanged worktree supplied all baseline observations in `runs/r1/baseline.log`. R1/R2 were run together; after correcting a pre-freeze elder route in R3, the remaining items were run separately against the same unchanged build. R5's final baseline uses the paused loading screen to eliminate ordinary clock-saving interference and counts attempted import writes across reload. Earlier harness development output remains in `runs/r1/prefreeze-harness-history.log` and `prefreeze-r5*.log`; it is not acceptance evidence.

| Item | Baseline result |
| --- | --- |
| R1 | FAIL: 2 refused awakened writes; durable dormant/empty messages, visible panel, one line/reveal below viewport; restoring storage did not awaken the durable card. |
| R2 | FAIL: day 3 after native field/Village travel, still dormant with no panel/message. |
| R3 | FAIL: literal-file import of real-code day-3 00:10 dormant save stayed dormant. |
| R4 | FAIL in Standard and Vivid: level row outside viewport at reveal; F6 shell reached but contents never reached by Tab. |
| R5 | FAIL for all three invalid imports: each attempted a write and changed the durable save. |
| R6 | FAIL for required new tests: existing npm suite passed, zero cheat-and-awakening test names. |

`fixtures/r1_dormant_past_day3.save.txt` was made before source edits using the real optional-start control, real update_timer and real create_save on the base branch. Its builder/provenance are `fixtures/r1_build_fixture.mjs` and `fixtures/r1_provenance.md`. Other negative imports are explicit malformed mutations of the real-code dormant fixture, encoded in the game's export format; they are fault inputs, not valid gameplay prerequisites.

Frozen SHA-256s, stored in `GATE_R1.sha256` before source edits:

- `checks/r1_gate.cjs`: `820f5e925523c6a29e677afba303f43f5ba28e66c6105b9f84342069db6d0d1d`
- `check_r1.sh`: `d237ad031ec6cdc154627da2b3cb39f11d47ee3c54b0954fda9c05f16e272615`

Neither gate file was edited after freezing. The wrapper checks R1 and all existing frozen hashes before building. It owns only its port-18451 server, restores prior dist/index bytes on exit, and executes byte-identical copies of regression scripts under authorized `runs/r1/regressions` because those scripts otherwise overwrite other workers' screenshot evidence. All browser contexts use isolated fresh storage on the supplied URL, following CH1's approach; this is not a claim of distinct-port persistence coverage for each item.

## Verification and evidence labels

Final frozen-check outcome: **PASS, exit 0**. R1–R6 and all required regressions passed against the final rebuilt candidate. The full command output is below and in `runs/r1/check-final.log`. Intermediate attempts 1 and 2 passed R1–R6, then were deliberately stopped during CH1 with exit 143. Attempt 1 predated the won-round predicate correction; attempt 2 predated the final inset focus-outline CSS correction identified in screenshot review. Both exit traps restored dist/index bytes. Neither is final acceptance evidence.

| Item | Label | Evidence and limit |
| --- | --- | --- |
| R1 | seeded-native | Near-boundary real-code fixture, normal ticks, awakened-only storage fault, recovery, durable card/message and one log/reveal. `runs/r1/r1-storage.png`. |
| R2 | seeded-native | Same prerequisite; actual elder dialogue and four native 15-minute field/Village trips, then ≤10-second arrival check. |
| R3 | seeded-native | Literal-file import of real-code past-boundary dormant save. Native sleep is not exercised: Shack is locked in this fixture and requires a won fight to unlock, which already awakens the card. The gate explicitly records this conditional scope limit. |
| R4 | seeded-native | Normal fixture ticks in Standard and Vivid at 1366×768; observer samples level-row bounds at reveal; actual F6 then Tab reaches contents. Both final keyboard screenshots were visually reviewed: the inset focus outline is visible, and the contents fit the reading area. Served status CSS equals source SHA-256 `1d2bf21969421b9946a00b6722fae3368808864ecc41e99eda1ab170ddd04c15` (`runs/r1/final-style.sha256`, `final-served-style.sha256`). `runs/r1/r1-standard-focus.png`, `r1-vivid-focus.png`. |
| R5 | seeded-native | Actual file input with three malformed save files; full durable-save comparison and zero attempted writes on rejection. Imports start while play is paused, so normal clock saves cannot mimic corruption. |
| R6 | source | Full npm suite passed 638/638, including four newly added named contract/runtime-helper tests. `runs/r1/r1-npm-test.log`. Focused final seven-test slice is recorded in `runs/r1/focused-final.log`. |
| REG | seeded-native and source | Frozen CH1, C0, panel-kit, settings, crafting and Vivid gates on the worker build. Existing gates retain their original limits. |

**N1, natural supplemental:** Fresh hero chose the system through the ordinary creation control, talked to the elder, received/equipped the starting sword/pants and entered the native field. The first won fight awakened on day 1 after 23.401 wall-clock seconds from confirmation. One enemy defeated, one first system message, exactly one status-window reveal, zero points, and Blooded displayed after the normal title scan. Native Save and Export completed. No fixture, clock change or development command was used. Evidence: `runs/r1/natural-win.cjs`, `natural-win.log`, `r1-natural-win.json`, `r1-natural-win.png`, `r1-natural-win-export.txt`. This repeated natural run used the corrected gameplay source, before the final CSS-only focus-outline inset. The JavaScript bundle is unchanged by that CSS correction. Its bundle and served bytes both hash to `a26c84e30e653bc4926c15e254e2b4df0c7aa8a2bce6d0653d1f01770f7848b3` (`runs/r1/final-build.sha256`, `final-served.sha256`). This timing is an automated fast path, not human reading time. The earlier 27.095-second candidate run is retained under `runs/r1/first-candidate-natural`.

## Unexercised and remaining scope

**O1:** No separate native sleep journey, offline catch-up or 40-minute uninterrupted natural day-3 wait was run. Source has no separate offline catch-up implementation; all current timer sources and persisted joined calendars reach the shared predicate. Sleep uses the same timer source, which is source evidence only here.

**O2:** No screen-reader session, real browser zoom, OS-level visual capture, human taste approval, dialogue/combat reveal-deferral journey, private content pack or full heir journey. The R1 contract does not introduce the broader AW palette's future deferred-presentation behavior. Post-durable render faults and the broader read-only/blocked-save matrix were source-reviewed, not newly fault-injected in this lane. Existing regressions retain their own source/native boundaries. Mobile and stage 1 remain deferred.

**O3:** Coordinator review/merge remains a separate gate. The source commit contains only the five allowed task paths, has no Co-Authored-By trailer, and the worktree is clean. The final wrapper restored dist/index version bytes; no process listens on the worker’s used ports 18451–18453. No push or merge was run. Gate, fixture and report artifacts remain in the authorized main-dispatch paths for the coordinator.

## Implementation correction before final verification

The first source candidate derived retry/load victory from bestiary kills. Source review of models/combat.js showed kills can precede the defeat of the whole enemy group. A new partial-kill load test failed on that candidate (`runs/r1/partial-kill-before-fix.log`). The predicate was corrected to persisted won combat-zone rounds while retaining the explicit native victory callback. This preserves the original milestone. The final full wrapper rebuilt this corrected source and passed; attempt 1 is intermediate evidence only. Frozen gates were unchanged.

Keyboard screenshot review also found that the normal outside outline of the new focusable contents was clipped by the module body. The final CSS puts the outline inside the contents. The final wrapper ran after that last edit and exited 0; the frozen gate remained unchanged.

## Full final check_r1.sh output

Exit code: 0.

```text
PASS gate_integrity
PASS build
PASS R1 "failed write dormant and hidden; recovery persisted, logged and revealed once"
PASS R2 {"day":3,"awake":true,"messages":[{"text":"Your system is awake. You can now read your level and known abilities.","at":{"year":999,"month":4,"day":3,"hour":0,"minute":2,"day_count":3}}],"visible":true,"lines":1,"reveals":1,"revealRows":[true]}
INFO R3 sleep unexercised: Shack locked in dormant fixture; unlocking requires a won fight
PASS R3 "literal past-day-3 import awakens; sleep tested if fixture has reachable bed"
PASS R4 "level row in view at reveal, F6 then Tab reaches contents in both schemes"
PASS R5 "three semantic invalid imports name card, refuse before writes, preserve full durable save"
PASS R6 {"suite":true,"newCheatAwakeningTests":["cheat awakening rejects message-free discovery and preserves legacy messages","cheat awakening invalid points and missing message refuse before import preflight or writes","cheat awakening clock jump commits first message before live discovery and retries failed storage","cheat awakening does not mistake a partial enemy kill for a won fight on load"]}
PASS H1_no_cheat_default opt-in control, default none, nothing leaks
PASS H2_dormant_start held dormant, route optional-start, nothing shown yet
PASS H3_awakening awoke after 47s, message logged, revealed once
PASS H4_panel_contents {"level":"0","vitalsLevel":"0","strength":"12.0","strengthStats":"12.0","titles":true,"points":true,"quests":true,"rowH":26.59375}
PASS H5_persistence survives reload and literal import without replaying the reveal
PASS H6_template fits, readable, F6-reachable at 3 desktop sizes
PASS c0_regression
PASS panelkit_regression 7 items
PASS settings_regression 7 items
PASS crafting_regression 9 items
PASS vivid_regression 10 items
```
