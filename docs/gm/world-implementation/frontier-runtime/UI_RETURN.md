# Original Frontier panel return

2026-10-05. Exclusive worker writes: `src/original_frontier_campaign_ui.js` and this return. Parent retains host, registration, main, Notebook, style and current-build integration.

## Delivered source

`createOriginalFrontierPanel({registry, read, command})` imports `originalFrontierPresentation(state, registry, context)` from `original_frontier_campaign_host.js` and returns `{element, panel: element, render, focus}`. `element` is a native `details.expedition_panel` with ID `original_frontier_panel`; `focus()` opens it and focuses its summary. Initial mounting follows the existing `location_actions_div` convention, with later Notebook ownership left to the parent.

`read()` supplies `{state, context, error, enabled, inDialogue, inCombat}`. `enabled` must represent safe durable writes if cancellation/pause should remain available during a native activity; actual action eligibility remains host-owned. The renderer projects only the supplied public actions, quest, accepted work, program, records and optional accepted contest. It never scans registry labels, reads private campaign truth, enrolls, writes state or starts work during render/import.

Player controls send:

- Opening: `{type: 'begin'}`; work: `{type: 'command', id, targetId}`; cancellation: `{type: 'cancel', id: work.id}`.
- Finite routine: `{type: 'program', id, targetId, count}` with explicit integer target 1–20, default 3; pause/resume: `{type: 'pause'}` / `{type: 'resume'}`. Routines exist only for host-projected automatable actions. Running/paused routines prevent replacement routine starts.
- Accepted exercise: `{type: 'response', responseId}` / `{type: 'withdraw'}` from optional `contest: {cue, responses: [{id, label, eligible, reasons}]}`.

New commitments disable for missing write access, save error, dialogue, combat, accepted work or accepted exercise. Pending work/cancellation, program controls/stop reason and accepted exercise remain in the panel when ordinary access is temporarily lost. Cancellation and pause respect durable write access/error without requiring new-work eligibility. Resume and accepted responses additionally respect dialogue/combat; resume waits for pending work/exercise to finish.

Action, response and record nodes retain identity across timer/resource/status renders; removing or hiding a focused control falls back to the panel summary. Disappeared actions are removed rather than kept as hidden secret labels. Routine targets survive ordinary renders. Current work shows remaining played minutes and refund/forfeit/no-cancel terms. Recorded findings retain their supplied played-minute timestamps. Native Rest/Sleep receives only a recovery advisory.

## Checks and retained gate

`node --check src/original_frontier_campaign_ui.js` and a Node module import/export-link check both passed against the created parent host. Source SHA-256: `5083256943113f0133ca15cecbcd6582767ba9413de056faa0d61d0260dcf176`.

Source readback/diff confirms the UI consumes the public host projection and writes only the two reserved files. Parent integration/build is separate from this return. Static style review found that the shared Notebook rule explicitly displaying card buttons can override native hidden-button display; the parent accepted the scoped `original_frontier_panel` hidden rule for its style join. Parent will also include other native busy conditions in `canBegin` and action eligibility while `enabled` represents durable write access.

Status: **implemented-unverified**. Browser, unit, gameplay, keyboard, generated save/reload/import/stale/failure and regression suites remain deferred by the current implementation-first instruction. No installation, commit, private-save access or gameplay verification occurred. The later playable acceptance gate is rebuilt native Notebook/Quests entry followed by real earned opening, changing legal actions, a pending cancellable job, a finite routine pause/resume/stop, an accepted exercise, disclosure/focus and generated save/reload checks.
