# FIX_OPENINGS report (2026-11-07)

CHECKPOINT: done for every first-screen flag (OPN2, OPN3, OPN4, OPN8). Left: policy-limited trace flags (bot artifacts, PAC's
measure) and one private-pack duplicate (lotm.beside). Not committed. Baseline updated for all 15 starts including lotm.beside.

## Result (SHOWN: `node scripts/check_openings.mjs`, headless, scenes refreshed)

The baseline went from 77 flags to 37. Every first-screen flag is gone except lotm.beside same-label (see below); the 36 others are trace-based and policy-limited. `check_openings`: 15 starts, 0 regressions. `node --test tests/openings_check.test.js`: 10 pass.
Focused tests on every touched module (553 across reports_dock, structured_*, walk_board, ui_components, player_reasons, gu_*, lotm_*,
observer_view, ui_contract, openings_check): 0 fail. `check:arch` passes. `check:rules` fails only on CHECKPOINT.md line 1 (not mine).

## Fixed

| Item | Before -> after (what the player sees) | Where |
| --- | --- | --- |
| OPN8 Next-step pointer on book starts (6) | "Talk to Old Hesk, the village elder" showed on book entry for up to a second (the card follows the Village life but its own timer lags); race, so it flickered in the headless read. Now the Reports dock shows the pointer only while the world is the Village | src/reports_dock.js |
| OPN8 Mixing tooltip (12 starts) | "return to Village and finish your conversation" -> "Mixing · Alt+M · no mixing bench here." off-Village; Village wording kept in the Village | src/workspace_navigation.js |
| OPN4 engine reason, tooltips (book starts, 25 controls) | tooltip carried "The required knowledge, means or circumstances are missing."; it now loses the engine text and, with nothing else to say, reads "Not open to you yet." (NEUTRAL_REASON) | src/ui_components.js, src/player_reasons.js |
| OPN4 engine reason, lotm.storm (31) | broker rows now say "Report in at the workroom first." (was the engine situation assertion) and, after reporting, the broker's own reasons; Verify, Settle and Reject stay out of sight until their turn (display only, definitions untouched). Storm drops from 53 broker rows to 9 pay rows | src/book_world_lotm_ui.js |
| OPN2 walls (7 starts) | ri.keeper 1801 -> 260 words, hp.school 754 -> 202, ss.company 766 -> under 300, storm 733 -> 195, ri.academy 688, ss.apprentice 550, hp.lead 340 all under 300. Action quotes fold behind "Details" per card (locked reason stays visible); locked actions wait in "Not available yet (N)"; status rows fold behind "Details" (open state survives re-render); repeated Gu-care text said once; Gu ledger rows fold behind "Ledger entries" | src/structured_pack_ui.js, src/ui/gu_house_view.js |
| OPN3 "Walk · N min" (lotm.*) | "Walk · 20 min" ×3 -> "Walk to Tingen docks · 20 min" | src/ui/walk_board.js (+ tests/walk_board.test.js assertion) |
| OPN3 "Continuing" | "Open Continuing connection" had no intro; the line above now ends "Your continuing connection is the way back." | src/book_world_lotm_ui.js |
| OPN3 same-label (machinery, storm) | three identical doses -> "Pay 1440 pence for lot 1, an unmarked prepared dose" (display numbering only). machinery's two "Walk · 25 min" fixed by the Walk label | src/book_world_lotm_ui.js |
| OPN3 soldier.p01 (5 terms) | "Premise: Choose before enlistment: Canon, Divergent, Remix or Swapped premise"; method line names its three options | private_packs/a-soldiers-life/pack.json (git-ignored) |
| OPN3 ri.keeper "Gu-house" | label now "Do clan Gu house chores" (matches the panel heading) | src/world_packs/book_gu_keeper.js |
| Check precision (mine) | "Repeat X" no longer flags X's verb; "Talk to / Walk to <name>" is not an unexplained term; Sequence and Pathway count as given | scripts/check_openings.mjs, tests/openings_check.test.js |

Note: a first try changed broker labels, reasons and visibility inside `book_world_lotm_broker.js`. The byte-identity tests in
lotm_cast_week and the pre-brewing command pin failed, so I reverted it and did the same work in the display layer.

## What the player now reads (quotes, SHOWN from the headless first screen)

- book.ri.keeper: "Reverend Insanity · Gu keeper, first year" then the lead paragraph; buttons "Take in a Moonlight Gu · issued free, 1 essence",
  "Buy 8 Moon Orchid petals · 1 stone"; each card's quote under "Details"; locked ones under "Not available yet (N)".
- lotm.storm: "First life is paused where you left it. Your continuing connection is the way back."; locked "Pay 36 pence for a dried black-spotted
  frog…" -> "Report in at the workroom first."; "Pay 1440 pence for lot 1, an unmarked…" -> "Insufficient money."
- book.hp.school: 202 words; "Attend introductory charms · 30 min", "Study your school notes · 10 min"; no pointer.

## Left, with reason

- trace flags (first-payoff-late, no-effect-choice, trace-refusal-no-reason, soldier.p01 first-action-late 9 and dead-stretch 19): the curious
  bot presses everything in screen order, e.g. soldier.p01 presses seven "Choose" cards before the duty; the player reads one. PAC's measure.
- lotm.beside same-label 2: two places both named "Uninhabited island" in the private cast data (CONTINUITY holds private_packs/lotm-cast/*).
  Also raw ids reach the walk list ("Walk to lotm.place.dream-junk-hall", "...gate-corridor", "...passenger-liner", "lotm.organization.import-export-company",
  "lotm.place.klein-flat" and others): a naming gap for NAMES/PRIVATE-NAMES, not fixed here.
- A real tooltip hover and a rebuilt browser pass were not run; evidence is the headless first-screen read (agent-verified, not human-reviewed).
  `dist/` was not rebuilt by me.
- Per-pack reasons for the 25 book-start controls that only had the engine fallback: they now read "Not open to you yet." The real reasons belong
  in each pack's rules (`reason` on its `requires` leaves), e.g. src/world_packs/book_*.js; sweep later.

## lotm.beside

Not a hang. The recorder is slow (about 10 s per press at start, scene boot of the private cast), and the old run was waiting out the 25-minute
loop. A full 100-press trace recorded this time; scene captured; now in the baseline. No trace.mjs hunk needed.

## Claims added

src/reports_dock.js, src/workspace_navigation.js, src/ui_components.js, src/player_reasons.js, src/structured_pack_ui.js, src/ui/gu_house_view.js,
src/book_world_lotm_ui.js, src/ui/walk_board.js, tests/walk_board.test.js, src/world_packs/book_gu_keeper.js, private_packs/a-soldiers-life/pack.json
(all in CLAIMS.md). FEEDBACK-held src/main.js, src/proto23_shell.js, src/lineage_domain.js untouched.

## Owner hunks for the coordinator

- UR73 line could add: "A tooltip with only the engine fallback reads `NEUTRAL_REASON` ('Not open to you yet.'), until its pack names the reason."
- `npm test` once (I ran focused files only); `dist/` rebuild belongs to the coordinator.
