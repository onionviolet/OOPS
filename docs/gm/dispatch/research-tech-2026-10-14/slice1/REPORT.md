# B1 craft cue and Village sentence, 2026-10-14

Implemented in `codex/rt-slice1`, based on b12f5161, under the authorized
[brief](../NEXT_SLICE_PROMPT.md). No changes to B2 fixture files or private saves.
Root review and Weibao's feel acceptance remain separate from these checks.

## Changes

| ID | Change | Evidence class |
|---|---|---|
| F1 | `src/craft_cues.js` selects one sight-channel sentence for Woodworking/Forging. Presentation bands are novice below 10, practiced 10-49, master 50+. Unknown skills, invalid/missing levels and failed/empty results produce nothing. No defect, provenance or hidden quality is invented. | Source |
| F2 | Existing Result details contains the cue; measured receipts append it. `display.js` captures the level before crafting XP, stores it with the session-only receipt, and reuses it in both locations. Preview uses present expertise until a receipt exists. | Source and seeded-native |
| F3 | `town_content.js` projects existing `town.returned` into one sight-channel sentence. The native Village description includes it, including its existing full-prose disclosure and tooltip. Publication refreshes the Village immediately when that fact changes. Viewing grants nothing. | Source and seeded-native |

No save fields, schema/migration, rewards, feed messages, RNG calls or crafting
mechanics were added. Current desktop-first direction remains unchanged; mobile,
planner wiring and additional sensory consumers are deferred.

## Verification

| ID | Check | Result |
|---|---|---|
| T1 | `node --test tests/craft_cues.test.js tests/town.test.js` | 16 passed, 0 failed; includes 10 new checks |
| T2 | `npm test`, final complete run | 1,388 passed, 0 failed, 3 existing TODOs; 1,391 enumerated |
| T3 | `npm run build` | Passed; Ink check included |
| T4 | Browser Chrome, rebuilt bytes, fresh profile/origin, 1366x768 and 1600x1000 | 10 seeded-native groups passed, zero page errors; [machine evidence](browser-evidence.json) |
| T5 | Scoped `git diff --check` | Passed |

Initial full run exposed a new reader export missing from a test harness that
extracts the final named export list. Fixed the export placement; the affected
8-test seeded-stream suite and the final whole suite pass. Browser harness
selector/toggle waits were corrected during evidence collection; no unrelated
runtime repair was made.

The browser creates hero `TEST FIXTURE RT SLICE1`, saves its new envelope, and
uses [seed.mjs](seed.mjs) to prepare disposable setup in `/private/tmp`. The real
expansion engine completes the survey/settlement prerequisites; the real save
encoder, validator, preflight and literal-file loader admit the envelopes. Stock
and XP are synthetic setup, not naturally earned progression. No private save
was read. Novice setup begins just below level 10, and master at level 50. Native
Craft 10 clicks perform each Woodworking and Forging batch. Both novice batches
cross level 10 while retaining novice receipt/detail wording. Collapsing Result
details removes its text; reopening shows the same sentence.

At each target viewport the native `town.return` button completes the final
step. The Village description updates immediately. Native Save/reload before
PLAY keeps the entire stored envelope identical. Native Export downloads a
literal file; native file-input Import restores that entire exported envelope
exactly, with the identical Village sentence. Export's existing bookkeeping is
included in the exported baseline. Import of an old envelope missing the fact
keeps the original description. Repeated reading changes no stored state.

Browser proof checks served bundle bytes against the local rebuilt bundle and
records SHA-256. Generated `dist/` and `index.html` are excluded from the commit and restored to
the clean baseline after browser proof. Rebuild before serving this worktree again.
Full-suite/build logs are retained under `/private/tmp/rt-slice1-*` for this run.
The two scripts here reproduce the journey with a worktree HTTP server at 21400
and the specified Playwright installation; `browser.cjs` captures the fresh base
and invokes `seed.mjs` itself. The profile path is in the machine evidence.

## Screenshots

All screenshots are **seeded-native**, from rebuilt bytes. Craft screenshots use
open Result details, scrolled to its cue, with the measured receipt visible.
Village screenshots use the existing More about this place disclosure and scroll
its place panel to the sentence; the harness verifies the sentence lies within
the panel’s visible bounds.

| Viewport | Woodworking | Forging | Village |
|---|---|---|---|
| 1366x768 | [Novice](novice-woodworking-1366.png) | [Novice](novice-forging-1366.png) | [After native return](village-1366.png) |
| 1600x1000 | [Master](master-woodworking-1600.png) | [Master](master-forging-1600.png) | [After native return](village-1600.png) |

Practiced wording is source-tested rather than browser-exercised. The required
two contrasting levels are browser-exercised; no all-band native claim is made.
See [BACKLOG](BACKLOG.md) for remaining acceptance.
