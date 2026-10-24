# Final-candidate proof, tree cd40e6424b22201d (verified 2026-10-24, matches)

No src/tests/styles/dist/index.html edits, no build, no full test run, no commit. Servers and browsers stopped. Detail: p1/RESULT.md, p2/RESULT.md. All rerun commands run from the worktree root. Screenshots paths below are under p1/evidence or p2/evidence.

| Item | Verdict |
|---|---|
| 1 D1/D2 real clicks, Notebook, 14/21px | PASS |
| 2 F4 inspector with learned method row | PASS (layout caveat) |
| 3 Paradise chart enrolment | PASS (download gap) |
| 4 Relationship-tie relative | PARTIAL: Family tree PASS, heir estate preview FAIL |

## 1. D1/D2 (PASS)
Rerun: `node docs/gm/dispatch/o-f-a-proof-2026-10-23/final/p1/item1.cjs`; `.../item1b.cjs 14`; `.../item1b.cjs 21`.
Real pointer clicks at element centre; elementFromPoint recorded before each click. Begin, the warm action and the Bio summaries hit BUTTON/SUMMARY, never [data-shell-resize]; each effect happened. Notebook unlocks right after Begin (report line "Notes, practice & people is now available"); a real click opens "Notes, practice & people" (Practice tab, "Years & company"), not an empty Journal. Screens: i1-1..5, i1b-14-*, i1b-21-* (i1-5-notebook.png inspected: reads clearly). 1536x864 at 14px and 21px read clearly with no overflow; 21px is tight (Bio just above tab row, Reports header truncates to "Repor…"), not a failure.
Fixture: `?structured_candidate=warmhand` (authoring preview) for Begin/action buttons; `?test_hooks=1` only to step minutes. Page errors: none (only 404s for private font files).
Side finding (not a failure of the item): at 1536x864 a report line reads "You lost 11 coins on the road into null." (coins 102 to 91), absent in the 1920 run. Looks like an unresolved location name. Repro: item1b.cjs 14, Reports column of i1b-14-3-bio.png; also visible in p2 i2-method-row-page.png.

## 2. F4 inspector with method row (PASS)
Rerun: `node docs/gm/dispatch/o-f-a-proof-2026-10-23/final/p2/item2_inspector.cjs warmhand`.
Route: `?test_hooks=1&start_probe=1&skill_inspector=1&structured_candidate=warmhand`; no state hook. Native XP from frail-start body commands; the learned method warmhand.warming from the A3 pack's own actions. Inspector shows four native rows (Cold resistance, Running, Climbing, Breathing) with Level, Parent, Milestones, Carry and sources, then "Warming (simulation)": Held Owned, source structured:11; Mastery 2 after 2 uses; Understanding 0 fragments; Carry line; Source Frail frame and Warm hands. Screens: p2/evidence/i2-method-row-page.png (inspected, reads clearly), i2-method-row.png, i2-inspector-element.png. Caveat: inspector is ~1079px tall in a 777px scroll pane, so the element screenshot cuts off the method row; scroll needed.
Read-only: sim paused, game time identical before and after opening; full save JSON identical except saved_at; 0 controls in the inspector. Persistence: method row identical after reload, export and file import. Native XP drifted by 1 Breathing XP in one run (a tick between PLAY and pause hook; P2's reading, unconfirmed); counts normalised. Page errors: 0 (404s for optional private fonts and /private_packs/manifest.json).

## 3. Paradise chart (PASS)
Rerun: `node docs/gm/dispatch/o-f-a-proof-2026-10-23/final/p1/item3.cjs` (adapted from paradise_chart_proof.cjs, serves the worktree).
Fresh game, after elder dialogue and no other enrolment, a real click on the chart enrolled (player at Village, book.paradise.chart complete, no refusal). Stayed enrolled after reload, and after export (window.save_to_file, 177,072 chars) plus file import via #saved_file_input setInputFiles. Screens i3-1..4 (i3-4 inspected: renders fine, but enrolment itself rests on i3-results.json). Hooks: `?test_hooks=1`; dialogue lines clicked with el.click() in the harness as in the original proof; only the chart click is a real pointer click. Gap: the Export button's file download was not driven, only the function behind it. Page errors: none.

## 4. Relationship-tie relative (PARTIAL)
Rerun: `node docs/gm/dispatch/o-f-a-proof-2026-10-23/final/p2/item4_ties.cjs`.
Fixture (labelled): b/pre-boundary.save.txt with relationships.bram.ties = {kinRelation: spouse, kinName: Bram, kinAge: 60}, imported by file; the rest is native (ended-life modal, Begin heir, Family, Save, reload, Export, file Import).
- Family tree: PASS at heir start, after reload, after export and after file import. Shows Hero (died at 80), Bram (spouse of Hero, 60), You (this life, took the estate as next of kin); Lineage.relatives identical in all four JSON stages. Screens: p2/evidence/i4-family-1/2/3-*.png (i4-family-3 inspected: clear).
- Heir estate preview: FAIL. Repro: run item4_ties.cjs, open #chronicle_heir_leftovers in the ended-life modal (p2/evidence/i4-estate-modal.png, inspected). Expected: a line naming the relative Bram. Actual: only Recipient, Money, Belongings, Home. Cause (verified in source): deriveHeirLeftovers sets leftovers.kin at src/heir_inheritance.js:114 but heirLeftoverLines (~line 181 onward) has no line that renders l.kin. Suggested hunk for the integrator: a `Next of kin: Name (relation, age)` line from l.kin.
- The heir's own chronicle.relationships keeps only villageElder; the relative lives in experience.lineage only.
Page errors: 0.
