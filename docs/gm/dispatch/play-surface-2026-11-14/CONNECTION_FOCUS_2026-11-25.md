# Connection keyboard focus receipt, 2026-11-25

| Preflight | Scope |
| --- | --- |
| Reading and authority | Fix one reproducible shared desktop UI interaction under the authorized comprehensive UI pass. Existing direction: desktop first, AD34/AD43; preserve keyboard and inspection context under UR43/UR74. |
| Player sentence and ordinary route | Existing voice sample: “Investigate · 10 min of available time”. Focus that button, start investigation with Enter, read progress, then pause with Enter. Disabled operations retain their existing reason. No new player copy. |
| Mechanism and fit | Existing `createContinuationUI` renderer and continuing-connection host. Clock updates replace action nodes; restore focus to the same enabled action ID. Uses existing controls and styling. |
| Ring | UI-only correction over the existing producer/consumer and persistence. No save fields, migration, simulation effects, world modules or style registries change. |
| Screen | Populated `tests/fixtures/perf/mid.json`, fresh browser storage, headless Chrome, 1920×1080. Same Connection center surface and back bar. Mobile and other shared-route findings remain deferred to their next assigned slice. |
| Files and rules | `src/continuation_ui.js`, `tests/continuation_focus_browser.mjs`, this receipt and cited evidence. UI UR43/UR74; architecture AR2–AR5, AR7; AD36/AD43. No import edges, cycle edges or registration lines added. |
| Failure and checks | A single clock minute removes the focused investigation button and leaves focus on BODY. Browser regression exercises idle update, command transition, progress update and keyboard pause. Existing continuation tests and UI contract/style ratchets cover unchanged semantics/style. |

## Reproduction and change

F1: Before the fix, a rebuilt isolated bundle showed `document.activeElement` as the `study` action before one ordinary game minute, then as BODY afterward. A keyboard player could no longer press Enter to investigate or pause without finding the control again. The renderer now restores the same enabled operation after replacement, including the Investigate/Pause label transition. A removed or disabled operation does not receive restored focus.

F2: The route-only portion of the existing `check:flow` reproduced six current findings: two Connection “baseline” text leaks, Connection Escape return, two Settings “native” text leaks, and Settings Escape return. The route/copy follow-up below closes these at its focused scope. The prior receipt mentioned Skills among the six; that route-only output did not. The integrated full-flow output later reports Skills separately, owned by the coordinator.

## Verification

| Check | Result and gaps |
| --- | --- |
| FLR1 Build | Passed; bundle SHA-256 `1ce744bc82d02171f51ad3f9d0365317f24325fcd451f0146c4c59a35945b117`. Isolated `BUILD_OUT=.lane-builds/player-ui npm run build`; existing duplicate-key warnings in `layout_spec.js` and `travel_legs.js`. |
| FLR2 Route | Named mid-life fixture, fresh headless browser context at 1920×1080. Existing enrollment and study controls thereafter. Test clock advances setup/progress. |
| FLR3 Shown | Existing study description, time, active Pause control and unchanged blocked reasons. No visual layout change. |
| FLR4 Used | Keyboard Enter starts and pauses the existing investigation consumer while focus survives idle and study progress updates. |
| FLR5 Kept | No persistence changes; save/import verification is not applicable. |
| FLR6 Labelled | Agent-verified, not human-reviewed. [Desktop capture](../../../representations/evidence/connection-focus-2026-11-25/connection-focus.png) and [browser result](../../../representations/evidence/connection-focus-2026-11-25/result.json). No page errors; two missing-asset console responses. |
| Checks | `node tests/continuation_focus_browser.mjs .lane-builds/player-ui docs/representations/evidence/connection-focus-2026-11-25`: all four keyboard assertions completed and wrote the cited result. Browser close stalled after the assertions; its own processes were stopped during cleanup. `node --test tests/continuation_state.test.js tests/continuation_clock.test.js tests/ui_style_ratchet.test.js tests/ui_contract.test.js`: 39/40 passed; UI contract inventory compares Windows backslash paths with slash ledger entries. `npm run check:arch` passed; `npm run check:rules` stopped on nine existing Mac-only external links. `git diff --check` passed. |
| Not covered in this initial focus proof | Connection/Settings findings are covered by the follow-up below; mobile remains untested. No installed build or deployment claim. |

Cleanup: removed this lane’s isolated build, synthetic fixture copies, temporary probe scripts and background processes after retaining the cited captures and measurements. Source edits, regression test and receipts remain.

## Connection and Settings route/copy follow-up

| Preflight field | Bounded scope |
|---|---|
| Reading / authority | Parent assigned the Connection/Settings Back/Escape and engine-word findings from the completed integration flow walk. Skills stays with the coordinator. AD36/AD43, UR22/UR43/UR53/UR70–UR75, PRS4/PRS6/PRS7, AR3/AR7. |
| Player sentence / voice | Existing sample: “Changes remain a draft until applied.” Connection now says marking this moment gives a starting point without inventing earlier arrival. Settings calls its targets panels. |
| Mechanism / ordinary route | Existing direct-control route opens Connection's registered center view, like Capability runs. Settings still borrows its original panel. Named Back and one Escape return to the previous play view; existing dialog/default-prevented Escape guards retain priority. |
| Failure / ring | Connection previously expanded its launcher, then pushed its real view, so one Escape left the launcher in history. A standalone old-bundle Settings probe returned correctly; the integrated sequence inherited Connection's navigation problem. Producer/consumer are the route spec and shared center controller. No new global keyboard listener, history store or save shape. |
| UI / files | Existing populated mid-life fixture at 1920×1080, normal game bar → Connection → Escape → Settings → Escape, plus dialog/editing priority and draft retention. `layout_spec.js` one route field; `continuation_ui.js` three text lines; `customization_ui.js` two labels/descriptions; `main.js` one matching discovery-selector hunk; `settings_return_browser.mjs` focused regression. Prior dirty work preserved. Mobile deferred. |

The setting label changed from “Native module” to “Panel”; its saved IDs and options are unchanged. The matching status-window discovery selector follows the renamed accessible label so later discovered panels can still join the list. No settings or connection operations were removed.

| Check / floor | Result and limits |
|---|---|
| Focused native checks | `node --test tests/layout_spec.test.js tests/center_modes.test.js`: **30/30 passed**, including nested modes, rejected stop recovery and focus/history structure. |
| FLR1 build | `BUILD_OUT=.lane-builds/connection-settings-20261125 npm run build` passed; SHA256 `c352727473048da07e0aad7b15e5485436e563cb942bbfab4f36520943216d4d`. Existing duplicate-key warnings remain. |
| FLR2–FLR4 focused desktop proof | `node tests/settings_return_browser.mjs .lane-builds/connection-settings-20261125 docs/representations/evidence/connection-settings-2026-11-25` exited **0**. Fixture setup, normal game-bar clicks thereafter. Exact flow-visible home signature restored after Connection → Escape → Settings → Escape; focus returns to each route button. Named Back also restores home. Existing shortcut dialog and control-owned Escape consumption retain priority. Unapplied draft and the complete actual panel option list remain intact. [Connection](../../../representations/evidence/connection-settings-2026-11-25/connection.png), [Settings](../../../representations/evidence/connection-settings-2026-11-25/settings.png), [machine result](../../../representations/evidence/connection-settings-2026-11-25/result.json). Both images inspected. |
| FLR5 persistence | No persistence changes. Unapplied settings draft retention is checked across Back/Escape, without applying or writing the profile. |
| FLR6 review | Agent-verified, not human-reviewed. Zero page exceptions; two missing-resource console responses remain. Browser/server closed and process exited normally. Coordinator owns integrated full-flow rerun; no full flow or full suite run by this lane. |
| `npm run check:arch`; `npm run check:player-text` | Passed; no new cycle or composition-root growth, zero new vocabulary or duration findings. |
| `npm run check:docs` | This receipt has no hit. Gate currently fails on concurrent `ATLAS_OWNER_IDEAS_2026-11-25.md:22,32` wording; owner notified. |
| Scoped `git diff --check` | Passed. |

Proof setup corrections: the first dialog probe looked for the help button inside navigation after the bar had moved it; the final proof uses the normal `?` shortcut. A later assertion assumed the optional status-window panel was already discovered by this fixture; it now checks preservation of the fixture's actual full option list. Both were proof assumptions, with no runtime change in response. The old-bundle standalone Settings probe and its screenshot remain alongside the final result as bounded diagnostic evidence. The cited isolated build is retained for integration. No process, copied save, temporary server, commit or push remains from this follow-up.
