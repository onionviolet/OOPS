# R12 report: native Cooking recipe clarity

2026-10-15, Claude continuation of [CLAUDE_HANDOFF](CLAUDE_HANDOFF.md) A1–A4. Scope and
acceptance gate were saved first in [R12_CHECKPOINT](R12_CHECKPOINT.md). Candidate, not
accepted: Weibao's visual/play acceptance stays OPEN.

**See it:** [comparison](http://127.0.0.1:19251/r12/comparison.html) ·
[play R12 synthetic cooking save](http://127.0.0.1:19251/r12-demo.html) · R11 stays on 19171.
Frozen runtime `~/.codex/candidates/yair-ui-r12-recipe-2026-10-15-claude`, manifest
[evidence/r12/frozen-runtime.json](evidence/r12/frozen-runtime.json). Restart:
`python3 -m http.server 19251 --bind 127.0.0.1 --directory ~/.codex/candidates/yair-ui-r12-recipe-2026-10-15-claude`.

## What was wrong (A1, found before extending)

| ID | Defect in R11, matched state | Evidence |
| --- | --- | --- |
| F1 | Crafting lived in the short lower-center pane while "Around you" sat empty above it. At 1366×768 the list showed about 1.5 rows and the Craft button sat at y 1010–1140 in a 768px window: you had to scroll inside the pane to craft | `before-*.png`, `before-geometry.json` |
| F2 | The recipe detail ignored the chosen text size (stayed 14px at 17.5/21px) while the list beside it followed it | `before-1366-21.png` |
| F3 | The detail grew to its content, so Craft scrolled away with the pane instead of staying pinned | same |
| F4 | "Cancel visual effect" showed permanently under the window, even with no effect playing, costing a row | `after-1366-14.png` first pass |
| F5 | A single-choice "Items/trinkets" subpage row and a 42px-tall checkbox took another ~70px at 21px | layout probe |

## What changed and why

| ID | Change | Owner |
| --- | --- | --- |
| C1 | While Crafting is open (outside combat), it borrows the full-height right-center column, reusing R10's accepted Attributes pattern. You is untouched; Inventory widens so ingredients stay readable. Leaving restores the exact previous grid. A two-center-column variant was tried and rejected: it crushed You's stat labels at 21px (`try-B-21.png`) | `styles/ui_tokens.css` |
| C2 | Window fills its pane; list and detail body scroll on their own; Craft stays pinned. Below ~12 lines of room the pane scrolls instead of crushing. When the column is under 28em wide in the chosen text size, list stacks above detail | `styles/crafting_detail.css` |
| C3 | Detail text follows `--shell-context-size`; cancel button shows only while an effect plays; single-choice subpage row hidden (marked by a `data-choices` count set where native already hides empty subpages) | `crafting_detail.css`, `display.js:switch_crafting_recipes_page` |
| C4 | "Uses · have / need" and an accessible label per row ("Rat meat chunks: have 3, need 2"), rebased from the unapplied `parallel/recipe-legibility.patch` | `crafting_detail.js` |
| C5 | "Can craft now: N attempts" from existing `itemRecipeStatus().amount`; worded as attempts, not outputs; 0 when the native guard refuses | `display.js`, `crafting_detail.js` |
| C6 | **When used**: effect name, duration and buff/debuff kind of a usable result, shown before Craft. Same `item.effects`/`effect_templates` data the existing Result details tooltip already shows, so no new knowledge exposure. Description on hover; color repeats the word, never replaces it | same |
| C7 | **Related on this station** (A3, bounded): other unlocked recipes on the same station page that share a known, named ingredient or use the result. Picking one keeps you in the service and offers "← Back to <recipe>", which restores the selection, list scroll and row focus. Unknown or "any type" materials never create links; nothing outside the rows already listed is named | same |
| C8 | Station and XP moved to a quieter secondary row; Success and attempts share one line | `crafting_detail.css` |
| C9 | Presentation label now reads "Proto23 UI R12" | `workspace_layout.js` |

No main, save, clock, simulation, eligibility, combat or commit-path changes. Craft still
goes through `commit_selected_item_recipe` → native `window.useRecipe`; receipts still come
from measured deltas. Hashes for untouched inputs (shell, village workspace, navigation,
main, save, simulation, clock) still match the handoff receipt.

## Checks run

All browser checks used a new loopback origin (19251), the frozen candidate, headless
Chrome and a synthetic save: the 2026-10-13 `craft_ready` fixture plus 3 known Rat meat
chunks (`evidence/r12/cooking-fixture.save.json`). Belmart leaf stays unknown.

| Check | Result |
| --- | --- |
| `node check-r12-recipe.cjs` at 1366×768 14/17.5/21px and 1920×1080 21px | **20/20 pass** ([recipe-journey.json](evidence/r12/recipe-journey.json)). Per size: detail facts; Craft visible with no page scroll; unknown ingredient reads "Unfamiliar material" and "Belmart" appears nowhere in the crafting DOM or attributes; blocked Craft focuses the missing row and changes no native state; related → Back restores selection, list scroll and focus with no state change; explicit Craft 1 receipt equals native inventory/XP deltas; attempts drop to 0 with the named shortage |
| `node check-r12-success.cjs`, 12-chunk fixture, six Craft 1 | Pass ([craft-sequence.json](evidence/r12/craft-sequence.json)): 1 failure (+2.3 XP, 2 used), 5 successes (+9.2 XP each), attempts 6→1→0, every receipt matches deltas. The 3-chunk fixture fails its first craft every time, consistent with deterministic seeded RNG from the same save |
| `node check-r12-ticks.cjs` | Pass: clock ran 08:58→09:01 while inspecting; title and keyboard focus held; leaving Crafting restored the exact grid |
| Geometry before/after | Craft 1 bottom at 1366: 14px 1038→619, 17.5px 1055→611, 21px 1184→599; 1920@21: 1366→911. Page never scrolls |
| R11 regression (copies redirected to `evidence/r12/r11-regress/`, [log](runs/r12-r11-regress.log)) | Fit: pass, same secondary counts as R11 (6/0/0/6/11/11). Modes: pass. Interactions: R12 4 of 5 runs pass, R11 4 of 4. The one failure read the attribute hover preview right after a Gear click with no wait; R12 changed no shell code, but this is **unresolved**, not proven unrelated |
| Focused node tests (`ui_contract`, `workspace_composition`, `village_workspace`, `workspace_focus`, `workspace_disclosure`, `native_craft_transaction`) | 16/16 pass after removing two `border-radius` declarations the UI contract flagged |

Not claimed: natural progression to this recipe, a non-Village station, Smithing/other
categories' item pages, palettes other than default, mobile, persistence (unchanged, so
no Save/reload/import was rerun), human visual acceptance.

## Remaining seams (A3/A5)

- **R1** Related uses stay on one station page. Cross-station uses (an ingredient used in
  Alchemy while you are in Cooking) need a station/access-checked route through the
  shared controller; not built.
- **R2** Material-type matches ("Any meat") do not create related links yet; only exact
  known ids do.
- **R3** At 1366×768 with 21px text the stacked detail shows about five lines before its
  own scroll; the station tabs still wrap to three rows. This is the same short-screen
  tradeoff as R11's zero secondary stats, and the next lever if it bothers you.
- **R4** The combined "reserved, or you are busy" reason is still the truthful limit of
  the boolean guard.
- **R5** C6 shows effect durations at base value; the tooltip's bonus-adjusted stat
  lines stay in Result details.

No commit, push or publish. R7–R11 frozen runtimes, the recipe prototype on 19218 and
the cross-audit lane were not touched.
