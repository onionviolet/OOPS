# Representation merge receipt, 2026-10-30

Integration branch `claude/ui-integration-8e9e92` (cherry-picks with `-x`, so each commit names its source SHA), then merged to local master. All of it is draft for integration, not final design. Not pushed.

## Order and what landed

| # | Branch (tip) | Landed | Dropped or deferred |
| --- | --- | --- | --- |
| 1 | rep-abilities (7105a4579) | Vertical tracks, `track.progress`, step `fill`/`note`, `guessed` (~) state, ladder figure, gallery fixtures, ABILITIES.md | none |
| 2 | rep-rituals (7d1d29022) | Rite circle, risk ledger, making tracks, `--fig-units` text scaling | `progressWord` removed; `rite_figure` and its fixture use `track.progress` |
| 3 | rep-family-tree (a37f0a94a) | Pedigree figure in the Family panel | "(guessed)" label workaround removed; uses the shared `guessed` state |
| 4 | rep-combat (2ebb36ed8) | Fight situation card, versus row | committed `dist/` dropped; typed outcomes and readied-ability intent stay unread (G4, G5) |
| 5 | rep-maps (292a3ee01) | Walk board and walk map | label-prefix match removed from board and map; one fallback remains in `legsFromMoves` until the host puts `to` on its moves |
| 6 | rep-character-sheet (46860a015) | One projected sheet for you and anyone met | last commit (duplicate stylesheet link) was already empty after the fold |
| 7 | rep-body (01ed641bf) | Body by part | cures from `healPart` (G13) still open |
| 8 | rep-knowledge (85bd279eb) | Journal Knows tab, case board | none |
| 9 | rep-research (8d183468d) | Study panel | none |
| 10 | rep-organizations (cdcdd17ce) | Organization overview | territory and holdings read the road kit later (L11) |
| 11 | rep-crafting (7e182b44e) | Craft glance | none |
| 12 | rep-mixing (a3e1e5f14) | Mixing counter | none |
| 13 | rep-economy (0e6a05c69) | Ledger Owed tab | none |
| 14 | rep-time (d204c5c62) | Return digest, report folding | digest seam takes bridge rows; host wiring deferred (G16, needs the pack wording lookup) |
| 15 | rep-spacetime (1b33eda69) | Lives figure | none |
| 16 | rep-worlds (96a583631) | Crossing threshold, Tingen workroom tabs | merged by hand with the abilities ladder in the Path tab |
| 17 | rep-relationship-web (fe012c740) | Relationship web on People (committed by its session on request) | round 2 will land later on its branch |
| 18 | great-ritchie (477d63b8d, c0f82542b) | Walks wait for report_in; PLAN receipt | `3287d6a2e` (L10 slice 1) dropped: superseded by L10 slices on master. `sw-absorb` agreed to the host hunk; `sw-wire` now owns host edits |

| 19 | rep-items (f95a65bc) | Item card in Item details, comparison against the worn slot | none |
| 20 | rep-first-hour (446045ac) | Next-step line under the top strip while the opening quest is unfinished | UR17 checked: adds one display setting `nextStep` with fallback `on`, and a `#next_step` strip outside the workspace modules; no layout, pin or collapse state changes. Frozen UI-freeze files untouched |
| 21 | rep-talk | **not merged**: its commit had not landed (only a staged TALK.md and a modified dist in its worktree) | take it when the session commits |

## Shared primitives (RCT1)

One `figure.js` API: `track.orient`, `track.progress` (words), step `fill` and `note`, `edge.detail`, states including `guessed`, `--fig-units`. `scene_card.js` was touched by no branch. The gallery draws one deduplicated list of every fixture list.

## Contract test (RCT2)

`tests/representation_contract.test.js` loads every module in `src/ui/preview/fixtures/` and checks: spec validates, text form carries every stated label, effects add no facts, DOM nodes under 2500, no global `document` in renderers, no colour literals in `figure.css`. Seat-limited convention: a fixture module exports `SEAT_LIMITED_PAIRS = [{id, full, limited}]`. **No branch has registered a pair yet, so that check is empty.**

## L13 bridges

| Bridge | State |
| --- | --- |
| abilities `ladderViewFromRecord` | switched in `book_world_lotm_path.js` and `book_world_lotm_pathways.js` |
| combat `versusWithEngine` | switched; rung shown on the threat chip and in its text line |
| maps `legsFromRoute` | legs contract adopted via `legsFromMoves` (no route rows exist for Tingen); window shape `{hours,text,waitMinutes}` confirmed (G6) |
| character sheet `subjectFromDatedSheet` / `standingRows` | `row.guess` honoured (G10); no live dated-sheet source reaches a view yet (G11), so these two are not switched |
| body `bodyViewFromHarm` | switched; `bodyViewModel` takes `harm` |
| time `digestRowsFromEvents` | seam added (`returnDigest({events})`); not wired at the host (G16) |

## Checks

See the bottom lines, filled after the final runs.

## Floor state

Implemented and agent-verified at the unit level; **below the AD43 floor**: no post-merge browser run at 1920x1080 for any feature, and `dist/` was rebuilt once after the merge. Each branch's own browser evidence is in `docs/representations/evidence/`.
