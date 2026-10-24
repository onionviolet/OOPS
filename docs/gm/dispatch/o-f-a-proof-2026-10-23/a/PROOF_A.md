# PROOF_A (worker A), combined bundle, headless Chrome 1920x1080, fresh 127.0.0.1 origin (port 0), generated state only

Rerun F1-F4: `node docs/gm/dispatch/o-f-a-proof-2026-10-23/a/f_frail.cjs` (from the worktree root; evidence in a/evidence/, text in f-results.json, log f-run.log).
Hooks: `?test_hooks=1` dev-stepped minutes only (advanceGameMinutes) to finish timed jobs; `?start_probe=1` (localhost Beginning section, real controls) selects the frail layer; `?skill_inspector=1` shows the dev inspector. Everything else is native clicks/keys. No state edits. One quirk: summaries under the Bio pane are opened with keyboard Enter because a resize handle overlay intercepts mouse clicks there (UI nit, not a feature fault).
Page errors: no pageerrors. 4 console "404 Not Found" resource loads on every page (also on the untouched start screen; not from these features).
Early failures (f-FAIL.png, dbg-*.png) were harness mistakes: Notebook nav opens an empty Journal sub-view; the notebook module opens via the "Other known panels" select, then Practice tab.

## F1 frail start: PASS
Start screen: body=lock/frail, "use" checked (f-f1-01), PLAY. Underfed condition and Frail frame trait appear (f-f1-02). Body & recovery panel after meeting the elder: only "Eat a proper meal" is enabled, grips/kit/cold wind/walk disabled with reasons (f-f1-03). Eat meal clears Underfed; 3 lane walks + "Keep the steadier frame" gives Steadier frame, carry +1; later grip drills gave Climbing 60 XP, Breathing 72, Stamina +2 (f-f1-04, f4 shot).
Seen: layouts read clearly, no overflow or overlap at 1920x1080.
## F2 changing description: PASS
Bio "How you look": thin/narrow build + pinched bearing (f-f2-01) -> pinched line gone after the meal (f-f2-02) -> "walker's easy stride" after training (f-f1-04). Reload reproduces it (f-f2-03); export (window.save_to_file, 185 KB) + file import through #saved_file_input reproduces it (f-f2-04).
## F3 traits earned/faded with cause: PASS
Frail frame cause "Left by a hungry winter before your story began"; Steadier frame "Acquired through training"; Faded traits: "Frail frame ... Faded: replaced by Steadier frame" (f-f3-01, f-f1-04); survives reload and import.
## F4 skill-layers inspector: PARTIAL / FAIL on "three skills"
Reached read-only (0 buttons/inputs inside it). In the run it listed ONE native skill (Climbing: level 1 of 50, 60 XP, parent none, milestones, carry note) plus two source rows (Frail frame trait/acquired, Steadier frame trait/trained). Native list only includes skills with visible XP and level > 0 (Breathing at 72 XP was not listed), and no simulation methods existed in this start. So "three skills with layers and sources" is NOT shown here; the A-series power starts (below) supply methods. f-f4-01 screenshot was taken after the practice pane re-rendered, so it does NOT show the inspector (text is in f-results.json). My before/after "state unchanged" comparison returned false because game time kept ticking between the two saves; read-only is therefore shown by 0 controls and the unit test, not by this diff.

## A3 / A5 / O1 (rerun: `node docs/gm/dispatch/o-f-a-proof-2026-10-23/a/a_powers.cjs <warmhand|lanternloan|slakebench>`; evidence a-<id>-*.png, a-<id>-results.json, a-<id>.log)
Entry (real UI): localhost `?structured_candidate=<id>` (existing local authoring-preview switch, not a player-facing menu), PLAY, nav "Beginning" panel, "Begin", then each pack's own action buttons. Hooks: `?test_hooks=1` stepped minutes only (22 min between actions for cooldowns). No state edits.
Layout defect (all three): the shell resize handle (data-shell-resize="top") intercepts mouse clicks on the Begin and action buttons at 1920x1080; Playwright could not click them. I activated buttons with focus + Enter. A real mouse user would hit the same overlap.
Persistence: panel text after save+reload and after export + file import equals the pre-reload text for all three (only the transient "Command saved. Action settled." line and the cooldown minute counter differ). Page errors: none (same 404 console noise).
### A3 warm hands (data-only innate power start): PASS
Begin gives six Cold loaf; warm (1 loaf -> Warm loaf, 4 stamina, "Power recovers in N game minutes" cooldown), two practice rounds (mastery), then batch warm (3 loaves, 8 stamina) succeeded: inventory Cold loaf x2, Warm loaf x4 (a-warmhand-6-warm_batch). Layout reads clearly; long panel scrolls inside its pane, no overlap.
### A5 lantern loan (second power style: borrowed, charge-based): PASS (one use, no growth)
One look burns 1 of 2 charges and 1 Keeper's lamp oil (oil 3 -> 2); "Refit the loan" correctly stays unavailable while charges remain; seen note recorded (a-lanternloan-3-see). Growth/refit not exercised (refit needs both charges spent; not grown because this style has no mastery route).
### O1 chemistry/energy chain (slake bench): PASS
Slake: Quicklime 3->2, Clean water 3->2, Slaked lime +1 (mass conserved), heat reserve +2. Bake: Dough 6->5, Flatbread +1, heat spent, plate strained; afterwards Bake shows "Recover enough energy before using this method" (energy gate; a-slakebench-4-bake). Rest/refit not exercised.
## Open items
F4 FAIL on its criterion (see above). The inspector was not re-run against the A-series methods (it lives in the Frontier Bio panel and the structured starts were not combined with it), so "three skills with layers and sources, including a method" remains unproven by browser evidence.
