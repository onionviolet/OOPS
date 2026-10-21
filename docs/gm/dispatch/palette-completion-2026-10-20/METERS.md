# Work and meter lane receipt

## Scope and authority

Implemented against the authorized 2026-10-20 palette completion checkpoint. Relevant rules: AR1–AR8, AR10, UR1/UR6–UR8/UR11/UR16, MR1–MR5, AD6–AD9, AD15–AD17, AD32, AD36, AD38 and AD40. This is a source implementation receipt. No build, browser play, persistence journey, visual acceptance or release gate is claimed. The shared checkout was already dirty; no shared outputs or commits were made.

## Changes

- `src/meter_bar.js` and `styles/meter_bar.css`: owner-supplied useful bands, signed rates with units, separate free/held/proposed stock, observation context and previous-value deltas. Deltas require a matching subject key and explicit subject lifetime. Unsupported limits remain absent.
- `src/work_status_view.js`: state-free work view for exact totals, remaining time, named stages, optional native batch/cycle counts and explicit pause reasons.
- `src/tools_panel.js` and `src/tools_domain.js`: repair progress uses the saved job total and native location/idle gates; cancellation text says whether spent materials return. Each bound tool copy has its own condition meter and subject-specific delta. Possible restoration is labelled proposed. The Tools view appears for a carried Oil lamp alone and reads native lit/fuel state, loose flask count and burn rate. Fuel uses the one-flask 240-minute baseline, not a claimed tank capacity. Existing inventory commands still own lamp actions.
- `src/lamplight_domain.js`: exported read-only presentation for the existing lamp state and a refresh callback so its Tools reading follows native fuel/custody updates.
- `src/crafting_visibility.js`, `src/crafting_detail.js`, `src/crafting_home.js` and narrow `src/display.js` recipe projection/receipt mapping: native item recipes distinguish exact owned, usable and blocked input stock. The herbal trial shows carried and selected quantities only because its reader has no reservation projection. Batch previews label proposed input cost and say nothing is reserved. Immediate item-recipe receipts report measured attempt and success counter deltas; no continuing timed craft is implied.
- No harvest edits in this lane. Root owns its actual routine-cycle tally and work-total projection using native job/processed state.

## Palette disposition

Bound here: **BD1** (lamp fuel reserve and loose flask count), **BD3** (repair work against exact saved total), **BD5** for native recipe stock and proposed inputs, **BD7** for the real hand-repair stage, **BD9** for per-copy condition change, **BD10** for immediate selected-batch attempt/success receipts, **BD11** (repair clock, pause and readiness), **LD2** (cancel/return commitment) and **LD7** (native busy/location pause reason).

**BD4 and BD6 are root-owned in the native Condition/You view. BD12 is root-owned in harvest** using the real processed tally/current job. **BD8 remains open** for an observer-owned uncertain or stale reading. BD10 does not claim a target continuing across clicks. The alternate herbal trial cannot report usable/blocked quantities because its read port does not expose reservation state. Human visual/play acceptance and rebuilt desktop-browser evidence remain root integration gates.

## Focused checks

Command run: `node --test tests/meter_bar.test.js tests/meter_bar_dom.test.js tests/work_status_view.test.js tests/tools_domain.test.js tests/tools_panel.test.js tests/lamplight_domain.test.js tests/crafting_visibility.test.js tests/crafting_detail.test.js tests/craft_cues.test.js`.

Result: 40 tests passed, 0 failed. Coverage includes changed-subject delta suppression, unsupported limits, paused work display and truthful pause wording, native repair projection, lamp read-only state/burn behavior and lamp-only Tools discovery, exact recipe stock, non-reserving batch previews and measured receipt totals. No full suite, build or browser exercise was run in this lane. Root owns integration checks and rebuilt desktop-browser evidence.
