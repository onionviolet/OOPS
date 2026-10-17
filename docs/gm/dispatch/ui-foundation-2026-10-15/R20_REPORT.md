# R20: opponent board sized by count, 2026-10-16

Candidate, technically verified; Weibao's visual/play acceptance stays OPEN (UR16).
[Checkpoint](R20_CHECKPOINT.md) · [Round 15 plan](next-parts/round-15-whole-plan.md) (R20 row, NX22,
WX4–WX7, PP1–PP8, GU1–GU8) · [NEXT_PARTS Part 2](NEXT_PARTS_2026-10-15.md) (B1, UX17, R2, W4).
Branch `claude/ui-r20-opponent-board-be97bc`, cut from `codex/gameplay-foundations` at ea9dbd8d2.
Not merged, not pushed.

Target: desktop 1366×768 at 14px and 21px, plus 1920×1080 at 21px. Mobile deferred.

## What was wrong (reproduced in Weibao's terms, UR15)

On the R17 shell, three "Starving wolf rat" opponents each got a full card with the same six
facts (Atk, Spd, Hit you, Evade, Defense, Your hit) repeated three times. At 1366×768 21px the
cards made the top row 412px, taller than You (387px), so inventory showed 5 rows while the
Reports column sat empty. From five opponents on, the shell switched to a compact roster plus an
open "Combat readout". The open readout switched off the content-fit top row (a
`:has(.combat-readout[open])` rule), so the top row jumped to 423px at 1366 (inventory 9 rows at
14px instead of 14). With 8 opponents at 21px only 6 of 8 names were visible, and the readout was
cut off. [Before shots](evidence/r20/before/).

Causes in source: `village_workspace.js` gave the cards at least 304px or 20 text lines whatever
the count, every card carried its own 3×2 fact grid, and the 5+ path used a different layout.

## What changed

| Part | Change | Files |
| --- | --- | --- |
| Board by count (B1) | One row per opponent: letter and name, health, a hairline attack cycle. 1 → `single`, 2–4 → `rows`, 5–8 → `grid` (2 columns), 9+ → `dense` (3 columns). A column narrower than 15em falls back to fewer columns: more rows, never smaller text (R2, UR46). At most 8 visible rows, then the rows scroll inside the board | `src/village_workspace.js`, `styles/opponents.css` (new) |
| Facts once | The inspected opponent's facts show once, below the rows: a list with your own value ("You: 1.2") for up to four opponents, a compact grid beyond that. **Compare** (replaces the old Panels/Compact toggle, same place) puts each opponent's facts on its own row when you want to compare | same |
| Grouping (UX17, UR56) | From five opponents, repeated names group: the name once ("Starving wolf rat · 9"), then one cell per opponent with its own letter, health, cycle and selection. Nothing is aggregated; letters follow native slots, so a mixed fight shows A, D, G under one name | same |
| Defeated stay | A defeated opponent keeps its slot and letter, says "Defeated", is struck through and dimmed (not color alone, UR37), and can still be inspected. The caption counts "N defeated" | same |
| Public projection (W4, NX22) | Cards read one shape (`src/opponent_board.js`, new leaf module): per opponent `{id, slot, letter, name, defeated, health:{text, progress, knowledge}, cycle, facts:[{label, value, knowledge}]}`. Knowledge per fact is `known`, `native`, `partial` or `unknown`; a missing field renders as `???`, never as known. The game's adapter marks today's native readout `native` (inherited legacy disclosure, not AD8). No new truth reads: same DOM rows and encounter counters the cards read before | `src/opponent_board.js` |
| Engine projection ready (GU8) | `fromCombatOpponentsProjection` maps the engine lane's posted `combat-opponents` schema 1 onto the same shape, with a unit test. It is not merged, so the game still uses `read()`. Swap = one line in `main.js` after both merge | `src/opponent_board.js` |
| Layout data (GU1) | `LAYOUT_SPEC.opponentBoard` holds the bands, minimum column width, visible-row cap and grouping numbers; `boardLayout()` picks the layout. A count change is data | `src/layout_spec.js` |
| Composition hunk | The fit engine counts a `[data-fit-clip]` part (the board rows) at its declared size, even while squeezed, and treats a new board signature (`data-opponent-board`, e.g. a new wave with another count) as a stable moment. The 304px floor is gone; the board's own height feeds the top row | `src/shell_composition.js` (2 small changes) |
| Stability (UR52, WX4) | Rows keep their nodes in slot order; the caption keeps a fixed two-line box, so a defeat mid-fight moves nothing; name buttons size to their own text, so health text changing beside them never resizes the target | `styles/opponents.css`, `src/village_workspace.js` |
| Preview | `ui-preview.html` gains five combat fixtures in the projection shape: **unknown** (nothing learned), **partial** (two known, one estimate `~30–40%`, rest `???`), **ALL-KNOWN** (labelled fixture case, not the game default), five and nine with a defeat | `src/ui/preview/fixtures.js`, `ui-preview.html` (one link), `scripts/build_ui_preview.mjs` (one list entry) |

Shared-file touches: `index.html` one stylesheet link; `build.js` one version line for it (same
pattern as R17's `shell_layout.css`). Not touched: `src/main.js`, `src/display.js`,
`src/save_files.js`, `src/proto23_shell.js`, `styles/ui_tokens.css`, `styles/inventory.css`. No game
save change. The Compare choice is per session, not stored.

## Evidence (fresh loopback origins, synthetic fixtures only)

Builds: frozen before (R17 at ea9dbd8d2) on port 19481, R20 on 19480. Fixtures: the parity-r9
`populated-three` save plus new synthetic 1, 5, 8, 9 and 8-mixed saves made by
[`r20-fixtures.cjs`](r20-fixtures.cjs) (cloned enemies, varied health, one defeated in 5 and 9).

Top row (the Focus region's real height) and inventory rows visible,
[`r20-capture.cjs`](r20-capture.cjs):

| Fight | Target | Top row px, before → after | Inventory rows | Board |
| --- | --- | --- | --- | --- |
| 3 rats | 1366×768 14px | 304 → 307 | 14 → 14 | rows |
| 3 rats | **1366×768 21px** | **412 → 387** | **5 → 6** | rows |
| 3 rats | 1920×1080 21px | 497 → 429 | 13 → 15 | rows |
| 1 | 1366×768 21px | 420 → 387 | 5 → 6 | single |
| 1 | 1920×1080 21px | 497 → 429 | 13 → 15 | single |
| 5, 8, 9 rats | 1366×768 14px | 423 → 307 | **9 → 14** | grouped |
| 5, 8, 9 rats | 1366×768 21px | 423 → 387 | 5 → 6 | grouped |
| 5, 8, 9 rats | 1920×1080 21px | 497 → 429 | 13 → 15 | grouped |
| 8 mixed (3 kinds) | 1366×768 14px | 423 → 307 | 9 → 14 | grouped |
| 8 mixed | 1366×768 21px | 423 → 426 | 5 → 5 | grouped, 3 labels |
| 8 mixed | 1920×1080 21px | 497 → 429 | 13 → 15 | grouped |

At 1366×768 21px the top row now equals You's height in every fight except 8 mixed, where three
group labels plus the facts need 426px. Where the top row shrinks, You's secondary stats yield
first (R11 order), as before.

| Check | Result |
| --- | --- |
| [`check-r20.cjs`](check-r20.cjs) (new) | **12/12**: 3, 1, 9 and 8-mixed fights at the three targets. Each: expected layout band, one cell per native opponent, caption, inspected facts and board inside the panel, no page scroll; defeated E in the 9-fight visible and labelled; clicking the last opponent, Compare on/off and keyboard Enter selection leave the game state byte-identical (UR35) and keep focus on the row; rendered ticks under a hovered row move no row, label or fact cell and keep the top row (3-tick steps while the same fight lasts: 30 ticks with two defeats in the 3-rat fight; the 9-rat fight kills the hero after 6–9 ticks, so it is compared over that span). Results: `evidence/r20/check-r20.json` |
| Slack map (WX13), [before](evidence/r20/slack-before/slack-map.md) · [after](evidence/r20/slack-after/slack-map.md) | Combat inventory rows 21px 5→6, 1920 13→15. Focus slack share in combat rises (21px 0.05→0.13, 14px 0.21→0.32): the board no longer stretches to fill, and the top row follows You. Fresh and populated (idle) cases are unchanged |
| `node --test tests/opponent_board.test.js` (new) | 5/5: projection shape, letters past Z, defeat, NX22 (no knowledge field → `???`), bands and fallback columns, grouping rules, engine schema 1 adapter |
| `npm test` | **2,066 pass, 0 fail, 3 TODO** of 2,069 (final tree) |
| `npm run check:arch` | Pass: 8 grandfathered main imports, 298 cycle edges, unchanged. Its line-growth notes on `display.js`/`save_files.js` are pre-existing; R20 does not touch those files |
| `npm run build`, `npm run build:preview` | Pass. Preview receipt `modules 21, gameCore false` (the preview now imports `opponent_board.js` instead of `combat_focus.js`) |
| Preview | Unknown: `??? hp`, no health bar, every fact `???`. Partial: `~30–40%` plus `???`. All-known: labelled in the fixture picker |
| Inherited checks r11–r17, final build, run one at a time | `check-r11-interactions` pass, `check-r12-ticks` pass, `check-r12-recipe` 20/20, `check-r12-success` exit 0, `check-r13` 26/26, `check-r14` 4/4, `check-r15` 4/4, `check-r16` 16/16, `check-r16-default` 6/6, `check-r17-preview` 7/7. check-r13/r14 first stopped on missing untracked evidence folders in this worktree (`evidence/r13`, `evidence/r14/after`); created, then passed. `check-r17-identical` not run: it proves R17's structure against frozen R16 builds, and R20 changes combat on purpose |

Comparisons (before | after): [3 rats 21px](evidence/r20/compare-three-1366x768-21.png),
[8 rats 21px](evidence/r20/compare-n8-1366x768-21.png),
[9 rats 21px](evidence/r20/compare-n9-1366x768-21.png),
[8 mixed 14px](evidence/r20/compare-n8-mixed-1366x768-14.png),
[1 at 21px](evidence/r20/compare-n1-1366x768-21.png), and the rest in `evidence/r20/`.

## Findings

| Code | Finding | Disposition |
| --- | --- | --- |
| F1 | The worktree for this session was cut from `master`, not `codex/gameplay-foundations`; the branch had no commits and was repointed to ea9dbd8d2 before any edit | Done; noted for the coordinator |
| F2 | A defeat mid-fight rewrapped the caption and moved every row 2px, and grouped name buttons resized as health text shortened. Both are UR52 defects in the first R20 build, found by `check-r20` | Fixed (fixed caption box, content-sized name buttons) |
| F3 | The engine lane's schema 1 has no attack-cycle progress; with it the cycle hairline would stay hidden | Note left in the shared notes folder (`r20-opponent-board-consumer.md`) |
| F4 | `#enemies_left_div` and `#clear_count_div` are still read for the caption (NX42) | Unchanged reads; a later projection field |
| F5 | The 8-mixed fight at 21px still needs 426px for three group labels plus facts | Acceptable within the 62% cap; a tune item if Weibao wants mixed fights tighter (e.g. labels inline with the first cell) |
| F6 | The Reports column is still empty at the start of a fight | The log rounds (R21/R22); outside R20 |

## What to look at (IT5)

1. A 3-rat fight at your usual size: rows instead of cards, the facts once below.
2. A big fight: the name once, letters with health in a grid; a defeated rat stays, struck through.
3. Compare in the board header: each opponent's facts on its own row.
4. Whether the shorter top row and the extra inventory row feel right.

## Not claimed

Visual and play acceptance (Weibao). The knowledge ladder and its persistence (R29): unknown and
partial readings are fixture cases proving the renderer, not an integrated knowledge system; the
game's readout is inherited native disclosure. Log letters and dealt/taken tokens (Part 2 log),
Reports tabs, the fight descriptor (L2), hit splats, enemy effects. The registry projection swap
(engine branch unmerged). Classic layout beyond "unchanged path" (GU5). Mobile. Contrast was not
re-measured: the board uses existing palette tokens and the custom-palette overrides follow R14's.
