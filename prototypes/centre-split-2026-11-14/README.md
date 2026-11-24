# Centre split mock, 2026-11-14 (proposal, AD32)

Weibao: "Ui feels cluncky, with things not obviously sectioned off? the center panel might be better to split into multiple panels".
Open `index.html` (keys 1-3 screen, q/w/e option, m measurements). Text is from the game's own screens; "Today" is the real capture.

## Measured at 1920x1080 (centre column 1027 px wide, about 930 px tall above the tabs)

| Screen | Stacked panels (heights) | Two columns (heights, 510 px each) |
|---|---|---|
| Fang Yuan's opener | Ready 233, Doing 165, Place 204, Story 214: 840 px, all rows in view | Ready 328, Doing 184 / Place 223, Story 290; every action button wraps to two lines |
| Village home | Ready 268, Doing 63, Place 242 (people, stations, ways out side by side), Journal 95 | fits, but Place grows to 309 and its two sub-lists stack |
| Crafting | Ready 125, recipe list 723, Place 63 (folded) | list 794 at half width, recipe names and gaps squeezed |

## Pick: stacked docked panels
Ready now, Doing now (activity or fight card slot), This place, Story, each with a header and its own bounded scroll, sized to content and shrinking in proportion. Reading order is top to bottom, actions stay one line wide, and the left column stays the inspector (direction A).
Rejected: two centre columns (halves the row width, so labels and gaps wrap and the eye zigzags); today's single scroll (no section edges, the complaint itself).
