# bk-gaps ideas (2026-10-30)

Proposals only (AD32). Round 1: gap fillers for long loads and unfinished surfaces, after [CG3 and CG4](../../../../audits/UI_CAPABILITY_GAPS_2026-10-30.md).

**ACT NOW (done in this lane)**
- `src/working_state.js`: one shared working state. In the page, `withWorking` disables the control, names the step, refuses a second run and restores on failure. Across a reload, `markWorking` / `resumeWorking` repeat the line on the loading screen and press Play once when the load is clean. No percentage (UR61). Session storage only; no save change.
- First consumer: `fresh_life_start.js`, which both the menu's "Start a new life" and the Tingen "Be Klein Moretti" start reach.

**ACCOUNT FOR NOW**
- Never show a bar or percentage for a duration nobody measured; name the step instead.
- A skipped Play must never hide loading errors or warnings; the helper checks the status class.
- The helper keeps reading as plain text with effects off and reduced motion.

**LATER / DELEGATE** (level, effort, done check)
- Wire the other reload sites in `src/main.js` (heir at `beginHeir`, independent life at `completeIndependentRequest`, Import, Reset, Undo): one `markWorking` call before each reload. Sonnet, S. Done when each shows the loading-screen line in the browser. `main.js` is the shared root, so hunk-only from disk.
- `book_world_lotm_ui.js` `'Starting…'` notice uses `withWorking` on the confirm button (floor-wire, one line).
- Measure where the 3 to 27 s goes (save, reload, world boot) with a `beforeunload` timestamp and boot mark. Haiku, S. Done when the receipt separates the two.
- CG3 placeholder: no new component. `definePanel` already takes `emptyText` and `unavailableReason`; the missing parts are lead-start Next step rows and the cast-schedule line "your first appointment is at …", both in other sessions' files (floor-wire, General UI). Sonnet, S-M.
- A shared "not written yet" label for surfaces that exist but have no content, so a half-built view says so in one voice (CX6). Reopen when a second unfinished surface asks for it.
- Pop-out and Electron: show the working note in the host window too (`desktop/popout_host.cjs`). Reopen with the Electron pass.
