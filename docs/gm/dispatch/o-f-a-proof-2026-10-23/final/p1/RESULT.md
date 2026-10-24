# P1 RESULT (tree cd40e642, headless Chrome via launchChrome, server on port 0, fresh context, ?test_hooks=1)
All reruns from the worktree root. Evidence in `evidence/` (this folder). No src/tests/styles/dist edits, no build, no commit.

## Item 1: D1/D2 real pointer clicks: PASS (D1/D2 no longer reproduce)
Rerun: `node docs/gm/dispatch/o-f-a-proof-2026-10-23/final/p1/item1.cjs` (1920x1080); `node .../final/p1/item1b.cjs 14` and `... 21` (1536x864).
Method: page.mouse.click at bounding-box centre; elementFromPoint recorded before every click (lib.cjs `realClick`); no focus+Enter, no el.click().
Entry/fixture: `?structured_candidate=warmhand` (existing local authoring-preview switch, localhost only) supplies the Begin + action buttons; `?test_hooks=1` used only for advanceGameMinutes(22) cooldown stepping. No state edits.
Hits at 1920x1080, none inside [data-shell-resize] (resize=false each time):
- Begin: BUTTON "Begin" at (692,343); effect: Begin button gone, actions warmhand.warm / warm_batch / practice appear.
- Action warmhand.warm: BUTTON at (852,566); effect: panel text changed, "Warm loaf" present in inventory (i1-3-action.png).
- Bio tab DIV#character_show_bio; summaries "How you look" (1024,322) and "Inherited traits" (1024,444): SUMMARY hit, details.open false -> true for both.
- Notebook unlock: hidden at fresh start (top-nav Notebook not visible before Begin). `adventure_notebook.js` shows it once the notebook is "familiar" (known people / chronicle / simulation / techniques / town.joined); here it appears right after Begin ("Notes, practice & people is now available in navigation."). Plain play path alternative: meet the village elder (item3.cjs does this).
- Real click on top-nav "Notebook" (453,14, BUTTON): opens the notebook module ("Notes, practice & people", Practice tab selected, "Years & company"), notebook_empty hidden, journal_div not visible. Not an empty Journal tab (i1-5-notebook.png).
- Layouts at 1920: read clearly (i1-1..i1-5). Page errors: none; console noise only 3x 404 for private font files (resources/fonts/private/gothic-bitmap-12/14.woff2, msgothic.ttc), also present on untouched start.
1536x864 (screenshots of changed surfaces only; font set by real clicks on Settings > "Text size 14" / "Text size 21" presets; Settings is folded under the "More N" nav button at this width, reached by real clicks; Notebook/Beginning/Stats stay in the bar at both sizes). No document overflow (scroll size equals viewport):
- 14px: Begin (i1b-14-1-begin.png), Bio (i1b-14-3-bio.png), Notebook (i1b-14-4-notebook.png): all clear, no overlap, Begin and summaries clickable.
- 21px: Begin (i1b-21-1-begin.png), Bio (i1b-21-3-bio.png), Notebook (i1b-21-4-notebook.png): clear; text wraps, Bio content sits just above the Stats/Bio/Equipment/Tools tab row with little spare room but no overlap; middle pane is narrower, Reports column text truncates ("Repor...", "All repo...") in the header. Acceptable, flagged as tight, not a failure.
Persistence: not part of item 1 (click behaviour only).
Observation (not asserted, outside scope): in both 1536x864 runs a report line reads "You lost 11 coins on the road into null." and coins went 102 -> 91 after Begin (not seen in the 1920 run). The word "null" in player text looks like an unresolved location name; worth a look by whoever owns the warmhand start / travel text. Repro: item1b.cjs 14, see i1b-14-3-bio.png Reports column.

## Item 3: Paradise chart enrolment: PASS
Rerun: `node docs/gm/dispatch/o-f-a-proof-2026-10-23/final/p1/item3.cjs` (adapted from progression-gates-2026-10-23/paradise-chart-fix/paradise_chart_proof.cjs; serves the worktree root).
Steps: fresh game, village elder dialogue (hello / what happened / ask to leave 1 / need to), open Notes tab, simulation absent before (asserted); click chart button "Read the parallel-entry body, cargo and source terms" (real pointer at bbox centre) with no other enrolment first.
Result: enrolled = true (simulation present, player at Village), no refusal text, book.paradise.chart recorded complete. Reload after saveProgress: still enrolled and chart complete. Export via window.save_to_file (177,072 chars, the function behind the Export button; the file picker download itself not driven) then file import via #saved_file_input setInputFiles: still enrolled, Village, chart complete.
Screenshots: i3-1-before-chart, i3-2-after-chart, i3-3-after-reload, i3-4-after-import (.png). i3-4 reads clearly (nav now shows Notebook, People; Journal "Lost memory"; Train action).
Fixtures/hooks: ?test_hooks=1 (snapshot, saveStatus, advanceGameMinutes(3) after dialogue). Dialogue lines clicked via el.click() inside the harness (existing proof's method) and one `end_dialogue()` call; the chart click itself is a real pointer click.
Page errors: no pageerror; console errors only the private-font 404s (9 in this run, repeated per page load).
