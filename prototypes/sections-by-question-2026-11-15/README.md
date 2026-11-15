# Sections by question mock, 2026-11-15 (round 13, PS112-PS118; proposals, AD32)

Weibao picked "Mock then build" for round 13. Open `index.html` (keys 1-3 for the screen, t for Today against Mock, m for the top-bar menus). The text comes from the game's own screens; "Today" is the real capture at 1920x1080. These are mocks, not builds.

| File | What it shows |
|---|---|
| mock-village.png | Village home (perf-mid): Now, Here as cards with their own verbs, Here tab with leftover verbs, Goals then Reports |
| mock-fy.png | Fang Yuan's Here (ri-fang-yuan-ice-crystal): same regions with his own nouns (his Gu, the alliance board, the stalls); the story's next choices take the workspace |
| mock-craft.png | Crafting: Now and Here fold to their header lines while a workspace is open |
| mock-menus.png | The top bar's five families opened, plus Menu holding Keys and Options |
| today-*.jpg | Today's real screens for comparison |

## What changes against today
- PS112 regions: the left column answers Who am I, the centre answers Now, then Here, then the open workspace, and the right column answers why (Goals, then Reports).
- PS113, verbs on their nouns: "Move somewhere else", "Try to craft something" and "Talk to someone" go. Talk sits on Old Hesk's card, Go or Enter sits on a way out with its time and danger, and Open sits on a station. The workspace keeps only verbs with no card (Find work, Train) and the activity chips.
- PS114: the Journal's quests join the next step under Goals.
- PS115: there is one level of play tabs (Here, Crafting, Mixing, or a world's own). Actions/Home/Options fold into the workspace; Keys and Options move to Menu.
- PS116: the top bar has five menus: You, Things, People, World, Tools.
- PS117: an empty panel folds to its header line (Condition with nothing on you, Gear).
- PS118: the regions are the same in every life, and the contents are each world's own.

## Measured
No panel body overflows on any of the three screens at 1920x1080 (headless check). When Here holds few cards it sizes to them, and the leftover height goes to the workspace (PS99).

## Open for the build
- Each card's verbs read the owners' existing actions. Talk, Trade and Feed already exist as actions targeted at a person or thing. The build re-hosts them, so the content nodes stay with feature-ui (ask before moving any).
- The rows in "Places to deal" on Fang Yuan's screen are grouped by the noun in each row's label. The build needs each ready row to name its noun (a `target` on the row), which its owner supplies.
- Stats, Bio, Equipment and Tools stay a centre view opened from You ▾. They are not a second tab level.
