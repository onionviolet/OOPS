# Landing receipt: book UI wave batch (2026-10-30, lane bk-land)

One batch, thirteen lanes, merged in a single integration branch and landed with a fast-forward. Nothing pushed. No `Co-Authored-By` trailer anywhere in the range. `dist/`, `index.html` and `figure-gallery.html` were not committed (the primary checkout holds uncommitted, partly staged edits to them; the rebuild is theirs to commit).

## Lanes

| Lane | Tip landed | State | Notes |
|---|---|---|---|
| bk-scout | 746f5edd0 | landed | docs only |
| bk-ui-directions | f384a890e | landed | fixed after the first gate: stylesheet not-loaded list, token-only CSS (ui_contract) |
| bk-benefits | 18b445603 | landed | economy doc kept both sections; fixture registered in `fixtures/manifest.js` |
| bk-seams | 100a7edb6 | landed, below floor | law seam row adapter (GM23) |
| bk-coi | d3817cd54 | landed | invented currency names (CLR3); rep-economy approved the `owed_ledger_view.js` edit |
| bk-party | 489d2c5e4 | landed | its committed dist/index.html taken from master |
| bk-ss | 3e724094a | landed | first tip held for CLR3 (canon rank/trial names in src/tests); renamed to neutral names, then landed. Crossing carry list (WCO1) not wired: below floor |
| bk-mol | 1c7caed79 | landed, below floor | `Proposal:` reason label fixed after the first gate (player_text_hygiene) |
| bk-hp | ef250c622 | landed, below floor | fizzle draw needs a command-level seeded chance in `src/simulation.js` (patch note in ideas/bk-hp.md) |
| bk-gaps | ba24c2bb0 | landed | `working_state.css` reworked onto tokens after the first gate; its link block reaches `index.html` only through the rebuild |
| bk-progression | cb66a5929 | landed | design round and fixtures |
| bk-making-ui | 47b492d6f | landed | design round and fixtures |
| bk-forms | 8372b2c2f | landed | first tip held: conflict with master's RPX11 `people_ui.js` rewrite; rebased by the lane |

CLR3: added lines in tracked `src/`, `tests/` and `scripts/` carry no canon names that master does not already ship (Cyoria 840 tracked lines on master, Klein 53); one `Klein` is a browser-script click on an existing control and ss's test asserts canon words are absent.

Conflicts resolved by hand (all append-only or one side clearly stale): `CHOICES.md` (kept master queue, added Whole-UI direction), `ECONOMY_AND_INSTITUTIONS.md` (kept both sections), `fixtures/manifest.js` (kept every registration line; `benefits` and `making_forms` added there after `figure_gallery.js` became manifest-based), `figure_gallery.js` (master's skin cells plus forms' `?form=` switch).

## Commit ranges (merge-base with master 8148223b6 .. tip)

| Lane | Range |
|---|---|
| bk-scout | c82442113..746f5edd0 |
| bk-ui-directions | 6c97ec39e..f384a890e |
| bk-benefits | c82442113..18b445603 |
| bk-seams | c82442113..100a7edb6 |
| bk-coi | 6d9f0ff00..d3817cd54 |
| bk-party | 053dd6276..489d2c5e4 |
| bk-ss | cd811c306..3e724094a |
| bk-mol | 6c97ec39e..1c7caed79 |
| bk-hp | e90e12a1c..ef250c622 |
| bk-gaps | 6c97ec39e..ba24c2bb0 |
| bk-progression | afc609704..cb66a5929 |
| bk-making-ui | c82442113..47b492d6f |
| bk-forms | 0c04f755a..8372b2c2f |

## Gate (merged tree, all through `slot_run.mjs`)

- `npm run build`: exit 0 (bundle v0.6-c51c427de436, not committed).
- `npm run check:arch`: exit 0. `npm run check:rules`: exit 0 (PASS, 17 receipts checked), rerun on the landing tree including this receipt.
- `npm test` on the merged tree before the last lane tips: 4797 tests, 4789 pass, 8 fail. Classified:
  - On bare master too: `facts_frame` (1), `market_life` (2), `world_lead_pipeline` (1), `ui_contract` (only `style.css` hits; master's working copy carries an uncommitted deletion that clears them).
  - `cast_inference_adapter` test 6 and `cast_journeys` test 16: paired run at the same time and load on bare master `99d997eaa` and on this tree gave the identical two failures (14 of 16 pass on both). They fail on master, not a lane regression; the disposable-copy workers run 270+ s under machine load of 70-150, so recheck on a quiet machine.
- `stylesheet_manifest` "index.html loads each manifest stylesheet" fails on the committed `index.html` (also on bare master, which lacks `cheat_faculty.css`; this tree adds the `working_state.css` link) and passes after `npm run build` regenerates `index.html`; it was not among the full-suite failures because the gate build ran first.
- Tips that changed after that suite ran (bk-gaps `ba24c2bb0`, bk-ui-directions `f384a890e`, bk-mol, bk-forms) were verified by focused tests only: stylesheet_manifest, working_state, palette_browse, ui_directions, ui_contract (only `style.css`), player_text_hygiene, figure_forms, 83 lane tests together.

Measured on: the full suite ran on `bf42ec9f9` (before the last lane tips); focused tests, `check:arch` and `check:rules` were rerun on the landing tree after the `99d997eaa` and `8148223b6` master merges; the bundle `c51c427de436` was built before those merges. Landed tip: `46ab02375`. Committed `dist/` and `index.html` on master are stale against the landed source until someone commits a rebuild; the owner is whoever holds `index.html` staged in the primary checkout.

## Floor state

Implemented, below floor unless the lane's own evidence says otherwise: seams (not wired), mol, hp (fizzle draw), ss (WCO1 carry list). Lane browser evidence at 1920x1080 was reported for hp, mol, ss, party, gaps (before/after) and coi (recaptured); each lives under its lane's evidence folder. This batch adds no new human-reviewed state.

## Follow-ups

- Whoever commits the rebuilt `dist/` and `index.html` also picks up the `working_state.css` link.
- Rerun the two cast tests on a quiet machine.
- `bk-recon` rows: RC1 coi landed, RC2 hp landed (below floor), RC3 mol landed (below floor), RC4 ss landed (below floor), RC5 party landed, RC6 gaps landed, RC7 rebase done for all (landing is on current master); scout, seams, ui-directions and benefits had no row and are now landed.
