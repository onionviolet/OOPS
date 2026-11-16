# PS216 handoff: the layout grows with the life (for ui-cohesion; proposal, AD32)

PS216 is a `?variant=ps216` branch of `gridTemplate` in `src/layout_spec.js`, owned by ui-cohesion after its renderer slice. The PS275 pair puts it beside today's four columns. The pair asks one question (PS242): "Should a new life start narrow and grow columns as content arrives, or show all four from the first minute?"

## The seam

`gridTemplate({context, atLeast, empty})` already folds a column whose regions are all in `empty` into the column before it (PS99, round 14). The variant only widens `empty`. Grid areas, slots and box ids stay as they are, so turning the variant off returns today's layout exactly.

| Region | Today | ps216: counts as empty until | Why |
|---|---|---|---|
| `player`, `inventory` | always shown | never empty | You (column 1) is half of the starting pair |
| `focus`, `actions` | always shown | never empty | The place and its verbs (column 2) are the other half |
| `journal` | empty when nothing is in it (PS99) | the first quest **or** the first skill with a level above 0 | Column 3 opens on the first thing worked toward |
| `log` | always shown | the first Reports line beyond the arrival stamp and the deed line every life starts with | Column 4 opens on the first thing that happened because of the player |

A fight takes column 2's middle (PS121), so it does not open a column. Once a column has opened, it stays open for that life by default. Store a per-life flag beside the box-tab memory (PS137) rather than in the save, so a quiet day does not close it again. That holds still to UR144.

## Variant CSS skeleton (`styles/variants/ps216.css`)

The JS branch decides the columns. The stylesheet only marks the moment a column opens, so the player sees what arrived:

```css
/* ?variant=ps216 (PS216, round 21; proposal). gridTemplate widens `empty` under data-variant="ps216"; this sheet
   only marks a column the moment it opens. Motion uses the feel-finish tokens and stops under reduce motion. */
:root[data-variant="ps216"] #main_content .workspace-board {
  transition: grid-template-columns var(--ui-motion-settle) var(--ui-motion-ease);
}
:root[data-variant="ps216"] #main_content [data-region][data-region-opened="new"] > .workspace-module {
  animation: feel-new-pulse var(--ui-motion-settle) var(--ui-motion-ease) 1;
}
/* The header of a newly opened box says why it opened ("First quest: Lost memory") until it is hovered. */
:root[data-variant="ps216"] #main_content [data-region-opened="new"] > .workspace-module > :is(h2, h3, .module-head)::after {
  content: " · " attr(data-opened-because); color: var(--feel-near, var(--ui-accent)); font-size: var(--ui-type-small);
}
```

Two hooks are needed from the JS side. `data-region-opened="new"` is set for one settle period when a region leaves `empty`. `data-opened-because` carries the short reason. Some browsers do not animate `grid-template-columns`; there the column simply appears, which is acceptable.

## Capture plan (PS275)

- **Lives.** A fresh Village life from the start screen, in headless Chrome at 1920×1080. Optionally, Fang Yuan's first day from the `ri-fang-yuan-wild-gu` fixture as a second sample.
- **Two runs.** Run 1 is today (no variant). Run 2 adds `?variant=ps216`. Both start from a fresh origin with the same seed and the same click script.
- **Script.** Follow the game's own "Right now" line for 10 in-game minutes or 40 clicks, whichever comes first. Use the same script in both runs.
- **Captures.** One frame at t=0, at each column opening and at the end. Name each `ps216-<run>-<t>-<HEAD>.png`, plus one side-by-side composite per moment.
- **Measures, in one table per run:**
  1. Blank area at t=0 and at the end: the percentage of the 1920×1080 frame inside boxes that holds no text or control. Measure it with `getBoundingClientRect` over boxes minus their children's rects.
  2. Clicks to each of the first three goals: the first quest accepted, the first skill level, the first item made or bought.
  3. Layout shift: the count of side-column moves from `check:flow`'s idle-shift probe. ps216 should add only the planned openings.
- **Gates.** `check:visual --lives` with the variant off must be unchanged. Run `check:flow`, `check:arch` and `test:changed` on the gridTemplate change. Rebuild in a scratch tree; dist/ and index.html are not committed this wave.
- **Show Weibao.** The t=0 pair and the end pair, the table, and the single question above.
