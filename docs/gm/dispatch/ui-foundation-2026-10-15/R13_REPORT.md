# R13 report: every region has a job

2026-10-15, Claude. Scope and gate in [R13_CHECKPOINT](R13_CHECKPOINT.md); proposals in
[PARITY_INTENT](PARITY_INTENT_2026-10-15.md) B1, B2, B11. Candidate, not accepted.

**See it:** [comparison](http://127.0.0.1:19253/r13/comparison.html) · play the frozen
build at `http://127.0.0.1:19253/` (restart: `python3 -m http.server 19253 --bind 127.0.0.1
--directory ~/.codex/candidates/yair-ui-r13-regions-2026-10-15-claude`). R12 stays on 19251.

## What was wrong

Sweep of every top-bar destination at 1366×768 on the populated save (S1–S5 in the
checkpoint): all views except Stats opened in a 216px pane under an empty "Around you";
the idle place card never drew because Focus redraws were keyed without the presentation;
the Inventory button emptied its own panel; expanded views had two Back controls; native
area progress was not on the opponent panel.

## What changed

| ID | Change | File |
| --- | --- | --- |
| C1 | **Regions yield when idle (B1).** The center controller publishes `data-center-task`. One rule: while a task or reference is open outside combat and Focus has no subject, the task takes the full-height right-center column and Inventory widens. Replaces R12's Crafting-only rule. A selected person, a conversation or opponents keep Focus | `center_modes.js`, `ui_tokens.css` |
| C2 | **Idle place card (B2).** Focus redraw key now includes presentation and place text, so the card appears. People and things come first as inspect chips (things are new), description follows | `village_workspace.js` |
| C3 | **Local return from a subject:** "← Village" in the subject view, and Esc when no center view is open | `village_workspace.js`, `ui_tokens.css` |
| C4 | **Inventory button stays home:** focuses the visible list's search box; Expand still opens the large view | `workspace_navigation.js` |
| C5 | **One Back per view:** the header's Expand/Return toggle hides inside center views | `ui_tokens.css` |
| C6 | **Native area progress (B11-lite):** opponent toolbar adds "n groups left" and "Clears" from the native counters | `village_workspace.js` |
| C7 | Presentation label R13 | `workspace_layout.js` |

## Checks

All on fresh loopback origins with synthetic saves (populated village; R9 three-enemy fight).

| Check | Result |
| --- | --- |
| `check-r13.cjs` at 1366×768 14/17.5/21px and 1920×1080 21px | **22/22 pass** ([r13-checks.json](evidence/r13/r13-checks.json)): place card with people and things; subject → ← Village and Esc back; Journal, People, Projects, Settings each yield Focus with exactly one Back and restore the exact grid on Esc; a selected subject keeps Focus; Inventory stays home with focus in its search; three opponent cards with native progress text; no native state change, no page errors |
| Sweep after (`check-r13-sweep.cjs`) | Every view 216px → 511px tall; Inventory opens no center view; native state unchanged |
| Regressions on 19253 ([log](runs/r13-regress.log)) | R11 fit 6/6 (same secondary counts), modes, interactions (resize/ticks/shield/three-enemy cards) pass; R12 recipe journey 20/20; R12 ticks/exit pass |
| Focused node tests | 11/11 and 18/18 pass, including the UI contract |
| Full suite, working tree | 1788 pass, **2 fail** (`cheat_awakening.test.js` 3–4). The same file passes 4/4 on HEAD + foundation + R13, so the failures come from other lanes' uncommitted work (continuation / simulation clock), not R13 |

Not claimed: persistence (unchanged, not rerun), natural progression, worlds other than
the Village frontier, palettes other than default, human visual acceptance.

## Open

- **R13-1** The People/Things tabs in the lower center now repeat the Focus chips. Keep
  both until you choose, or let Here keep only actions (UR42).
- **R13-2** Trip tally (loot/XP/time this trip) is still a proposal: it needs a log
  projection, not a DOM read.
- **R13-3** Settings is 869px of content in a 511px column and still scrolls; it is a
  long reference, which UR25 allows, but a two-column settings layout would fit.
- **R13-4** Other lanes' working-tree changes break `cheat_awakening.test.js`; their owner
  should check before committing.

## Dedupe pass (Weibao: "dedupe, consider better options and more?")

The 19253 candidate was refreshed in place with this pass; the pre-dedupe R13 runtime was
not kept separately (its screenshots are in `evidence/r13/sweep/`).

| ID | Duplicate | Options considered | Chosen |
| --- | --- | --- | --- |
| DD1 | Lower People/Things tabs repeat the place card's chips (R13-1) | (a) drop the tabs, Focus owns who/what; (b) drop the chips, back to a blank Focus; (c) keep both | **(a)** under the Proto23 layout: Focus is the inspection home (UR41/UR42); talking stays one action away in the subject card and in "Talk to someone". Existing layout keeps the tabs |
| DD2 | Place card repeated the place name shown in the place header below | drop it, or merge into the heading | Dropped; the card now leads with who and what is here |
| DD3 | Expand and ▾ on every panel header (U1 gripe) | remove; move into a menu; show on hover/focus | **Show when you point at or tab into a panel**, space kept so nothing shifts; layout editing shows all. The top bar still reaches every large panel (UR21) |
| DD4 | Presentation picker beside the Layout menu, labelled with an internal round ("Proto23 UI R13") | leave; move into Layout | Moved into Layout ▸ Presentation, labelled "Proto23 layout"; PROJECT already says play shows one Layout menu |

Kept on purpose (UR49): five Journal entries in the top bar (UR21 one-click paths with
hotkeys); Stats in the top bar and Attributes › in You (global path plus in-context link);
the visitor counter ("dummy hit counter" locally), which is upstream code; the
Comfortable/Compact quick toggle, your requested compact mode, with the full Density list
inside Layout.

Checks: `check-r13.cjs` 26/26 at 1366×768 14/17.5/21px and 1920×1080 21px, now including
dedupe assertions (tabs show only Actions/Options, no card title, presentation hidden
until Layout opens, Expand visible on hover). Regressions ([log](runs/r13-dedupe-regress.log)):
R11 fit 6/6, modes (now through Layout ▸ Presentation, the real player path), interactions
4/4, R12 recipe 20/20. UI contract and focused tests 14/14.

## Better options and more (proposals, ranked)

| ID | Observation | Better option |
| --- | --- | --- |
| BO1 | Crafting is reachable three ways in one screen: the "Crafting stations" chip, the Crafting tab and "Try to craft something"; Mixing and Projects twice | Keep the native action and the tab; make service chips say who keeps them and what is ready there ("Crafting stations · Cooking ready"), so the chip adds a fact instead of repeating a door (UR4/UR26) |
| BO2 | The place description is long and sits under the chips | Show its first sentence with the rest on focus/hover of the card title area; full text stays in the place header tooltip (no text cut without a route) |
| BO3 | Twelve to fifteen flat top-bar entries | Group as You · World · Records · System with thin separators and status dots (B9); keeps K1 |
| BO4 | Settings is 869px in a 511px column | Two-column settings at wide columns; sticky section index at laptop size |
| BO5 | Trip tally in fights | Build from recorded log events (subjects already stored), not a new store |
| BO6 | Panel header controls now hide at rest | If you find them hard to discover, keep Expand on hover but show ▾ always, or add a one-time hint; your call after playing |
