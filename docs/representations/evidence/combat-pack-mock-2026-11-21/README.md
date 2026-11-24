# Combat pack mock: fold versus stack (MW9, 2026-11-21)

Weibao: "Yes, mock in game". Question: how does a pack of identical foes fit on the fight card without scrolling? The options are ST2 (fold the untouched) and MS1 (one stacked bar), from the [walkthrough note](../../../gm/dispatch/play-surface-2026-11-14/PROTAGONIST_WALKTHROUGH_UI_ELEMENTS_2026-11-20.md#avoiding-scroll-fold-the-pack-st1-to-st9-2026-11-21-b-decided-send-it-for-ui-stuff). Fidelity: native. These are real builds of the game, not drawn pages.

## Branches (local, worktree `~/code/yarpg-mock-combat-pack`)

| Variant | Branch | Commit | What is real |
| --- | --- | --- | --- |
| Master | `mock/combat-pack-2026-11-21` base | `741731ec4` | Snapshot of the primary checkout's uncommitted work on 2026-11-21, including the combat fix pass. Nothing changed. |
| Fold (ST2 to ST7) | `mock/combat-pack-2026-11-21` | `3edfaeb2d` | Real. A display change in `src/combat_situation_ui.js` and `styles/combat_page.css`, derived from fight state with no save field. |
| Stack (MS1) | `mock/combat-pack-stack-2026-11-21` | `40798ec52` | A picture of the display. One segmented bar per kind. The mechanic (hits land on the front, no spill, front width) is not built: hits still go to the chosen rat, and the mock keeps the front as the target. |

## Fixture and replay

The seven-rat test fight from the fix pass (`packFightSave()` in `tests/combat_situation_page.browser.mjs`, with its full-effects seed). G starts with 2 HP. The steps are the same in every build:

1. Quick strike on the default target (G dies).
2. Target the next untouched rat: the fold's button, or the same rat picked from the timing bars on master.
3. Quick strike, then three more strikes on the target.

The capture is an offscreen WebKit view, adapted from the fix-pass lane's script: [capture.swift](capture.swift). Arguments are build directory, output prefix, width, height and port. No window is shown.

## Results

| | Roster height 1920 | Roster height 1280 | Page errors | Rows after four strikes |
| --- | --- | --- | --- | --- |
| Master | 366 px, scrolls | 366 px, scrolls | none | 7 (A to F plus dead G) |
| Fold | 207 px | 217 px | none | 4: A, B (target, Hurt), Wolf rat ×4 (C–F), "Wolf rat G · dead" |
| Stack | 86 px | 96 px | none | 2: Wolf rat ×6 (front Hurt), "Wolf rat G · dead" |

[1920 comparison](compare-1920.png) · [1280 comparison](compare-1280.png) · full frames: [master](master-1920.png), [fold](fold-1920.png), [stack](stack-1920.png) · logs per run.

## Findings

- **F1. The fold works on the real card.** Seven rows become four, there's no scrollbar, and the thick bar form is unchanged. The fold's button targeted B, the rat acting next, and B split out with its Target tag and its "Hands: shaken" condition.
- **F2. Splits by observation re-fold.** C first split out because it read "Atk looks weaker than you". Once it hit the hero it read "Atk ~1" like the others and folded back into the group, so the rows moved without a player action. The mock keeps targeted, hurt and affected rats out; a rat that differed in what was observed can rejoin. Decide: keep any rat that has split out (stricter ST3), or accept this.
- **F3. The stack hides conditions.** "Hands: shaken" on one rat has nowhere to go in a single bar. It needs per-segment marks, or it suits crowds whose members carry no individual state and nothing else.
- **F4. The stack loses the per-rat timer.** The ticks share the timer bar, and at 86 px they crowd the segment edges. A crowd that acts as one (MS1 to MS10) would have one timer anyway, so this is a mechanic question rather than a display one.
- **F5. An existing bug at 1280, on master too.** A target row with a condition squeezes the name column: "Target" breaks to "Tar get" and "Wolf rat B" wraps to two lines. This is for the combat feel pass.
- **F6. Reload behaviour.** The fold is rebuilt from fight state on every render. The sticky split (ST3) lives on the roster element for one fight, so a reload re-folds rats that split because they were targeted earlier and nothing else. This was not exercised; it is read from the code.

## Hashes

Bundle SHA-256 prefixes: master `a9c135507db6a980`, fold `978b0571af2f9b00`, stack `718f99d0480049d5`.

## Status

Local branches only, not pushed. Taking a variant means merging its branch into the combat feel pass's files, and the decision retires both mock branches and the worktree (MW9). The stack needs the MS mechanic before it is more than a picture.

## Round 2: state word on the left, one layered bar (2026-11-21)

Weibao: "maybe we dont need to center text describing their state? Also for stacked, we can have them all in the same bar, like stacked on top of eachother?"

| Variant | Branch | Commit | Change |
| --- | --- | --- | --- |
| Fold | `mock/combat-pack-2026-11-21` | `4b752f611` | The state word ("Fresh", "Hurt", "All fresh") sits at the bar's left edge. |
| Layered | `mock/combat-pack-stack-2026-11-21` | `dad3ef8f6` | Replaces the six segments with one bar. The front rat's health is the top layer; where it has drained, a deeper red layer shows instead of empty track. A "×6" chip at the left edge carries the count in words, and the name drops its own count. Still a picture of the display. |

(`6dad665e9` is the same change carried onto the stack branch.) Same fixture and steps. Both run clean at 1920 and 1280 with no page errors; roster height is unchanged from round 1 (fold 207 px, layered 86 px at 1920). [1920 comparison](layered-compare-1920.png) · [1280 comparison](layered-compare-1280.png) · [layered frame](layered-1920.png) · [fold frame](fold-left-1920.png). Layered bundle prefix `307ac77d4bd39355`; the fold's JavaScript is unchanged (`978b0571af2f9b00`), since the change is CSS.

- **F7. The left word reads faster.** Name, then state, then the fill, in reading order. It also clears the bar's middle for the RV1 harm-preview stripe and keeps the word clear of the drain edge.
- **F8. The layered bar reads as "a crowd, partly worn".** The bar keeps colour while layers remain, which matches how a crowd feels. The front rat's own drain is visible; how many layers sit behind is in the chip. F3 still holds: a single rat's condition has no place, so this suits crowds without individual state.
- **F9. Layer colour.** The mock uses one deeper red for every layer behind. With more than two kinds of layer (a ward over health, for example), each needs its own shade, so the chip and the word carry the meaning and colour stays secondary (UR37).

## Round 3: the move buttons stay put (2026-11-21)

- **F10. The fold moved the move buttons.** Measured from the round 2 frames at x=560: on master the move strip's top stays at y=460 all fight. In the fold it started at y=217 and dropped to y=301 after the first strike, because splits add rows to a roster that sized to its content. That breaks the fixed-place rule (RS, FT9).
- **Fix, commit `a2e137432`:** the roster reserves its height once when the fight opens (one row per opponent present, under the six-row cap), so splits fill reserved space. Replayed: the move strip stayed at y=460 at open, after the first strike, after the second and after five strikes, with no page errors. [Frame](fold-reserved-1920.png) · [log](fold-reserved-1920.log).
- **What that costs.** For this seven-rat pack the roster is as tall as today's. What the fold buys is no scrollbar, and three to four rows to read instead of seven. The height saving comes back when FT9 sizes the roster to fewer rows than the opponents present, which needs a rule for how many splits to expect. Not decided.
- **Absorbing.** Don't merge either branch: the base commit `741731ec4` is a snapshot of 422 uncommitted files. Take the two source files' changes from `3edfaeb2d`, `4b752f611` and `a2e137432`.
