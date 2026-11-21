# Combat feel polish, November 21

| Item | 1920 × 1080 | 1280 × 800 | Result |
| --- | --- | --- | --- |
| P1 · Opponent health | [Before and after](bars-1920.png) | [Before and after](bars-1280.png) | Target Wolf rat H and focus Heavy swing. The striped forecast stays on the fill. “Fresh · Likely hurt on a hit” is available through the bar title and accessible name. The folded pack and injured rat also have clear bars. A subsequent hit drew the recent-damage trail during the five-strike replay. |
| P2 · Terms | [Before and after](terms-1920.png) | [Before and after](terms-1280.png) | All six buttons measure 28.19 px high. The wide view fits all six on one line. The laptop fits the three timed moves above the three standing preferences. Each timed button encloses its beat count. The disabled plea gives “A wolf does not bargain.” on hover and keyboard focus. |
| P3 · Observed conditions | [Before and after](conditions-1920.png) | [Before and after](conditions-1280.png) | Brace in the training yard. The rival shows “Standing · Guarding · Hands: maimed” and the adept shows “Standing · Warded”. The laptop now gives the hand injury its full 108 px, up from 36 px. Attack and speed use short labels there and retain the full readings on hover. A strike breaks the adept’s ward while the rival continues guarding. |
| P4 · Hero card | [Before and after](hero-1920.png) | [Before and after](hero-1280.png) | Vertical overflow fell from 4 px to 0 at 1920 and from 76 px to 0 at 1280. The Condition and Body line fits inside the card. The native Hero bars retain their readings. |

The eight-rat pack opened with two visible entries and had seven after five Quick strikes. Each sample followed a painted frame. Target changes retained the existing fighter and group nodes, focus and roster scroll position. [Measurements, build hashes and all twelve position samples](measurements.json)

| Viewport | Reserved rows | Move strip y at open / after five | Quick strike y at open / after five |
| --- | ---: | ---: | ---: |
| 1920 × 1080 | 8 | 586.71875 / 586.71875 px | 588.71875 / 588.71875 px |
| 1280 × 800 | 6 | 473.71875 / 473.71875 px | 475.71875 / 475.71875 px |

## Full viewport captures

| Played state | 1920 × 1080 | 1280 × 800 |
| --- | --- | --- |
| Pack opens on G, Quick strike focused | [Before](before-pack-1920.png) · [After](after-pack-1920.png) | [Before](before-pack-1280.png) · [After](after-pack-1280.png) |
| Select the folded member H, focus Heavy swing | [Before](before-forecast-1920.png) · [After](after-forecast-1920.png) | [Before](before-forecast-1280.png) · [After](after-forecast-1280.png) |
| Practice bout after Brace | [Before](before-guard-1920.png) · [After](after-guard-1920.png) | [Before](before-guard-1280.png) · [After](after-guard-1280.png) |

## Checks

Both isolated builds used the same working-tree snapshot. The before bundle and combat stylesheet match the hashes in the [coordinator-reviewed capture](../README.md). The candidate overlays the combat UI JavaScript and CSS on that snapshot. The browser fixtures and assertions live in the [combat page test](../../../../../tests/combat_situation_page.browser.mjs).

The replay commands, exit codes and bounded gate output are in the [check log](checks.txt).

| Command | Exit | Result |
| --- | ---: | --- |
| `node build.js` in each isolated tree | 0 | Both built. Both reported existing duplicate keys in `layout_spec.js` and `travel_legs.js`. |
| `focused <pack-or-guard>-<width> <port> <before-or-after>` and `focused-forecast forecast-<width> <port> <before-or-after>` | 0 | Twelve offscreen WebKit replays at fresh origins. The runner served the built files through a local URL protocol. The candidate exercised the checked-in pack, Hero and guarded-row assertions, plus the fresh-target Heavy swing forecast. All twelve captured zero page errors. |
| `node --test tests/{tempo_fight,tempo_fight_run,tempo_kit,tempo_stock,fight_terms,combat_situation,combat_versus,combat_focus,opponent_board,combat_surface_types,combat_interaction,reports_dock}.test.js` | 0 | 127 passed. |
| `npm run check:arch` and scoped `git diff --check` | 0 | Passed. |
| `node tests/combat_situation_page.browser.mjs` and `npm run check:flow` | 1 | Both reached the local server and failed at `listen 127.0.0.1` with `EPERM`, before Chromium opened. |
| `npm run check:rules`, `npm run check:docs`, and `node --test tests/ui_style_ratchet.test.js` | 1 | Shared findings cover hearth text in `tranche_one_ui.js`, existing rule wording and acceptance claims in other documents, and markup growth in `book_craft_controls.js`. |

The tempo observer currently returns qualitative opponent HP. An earned numeric readout has no playable verification route in these fixtures. The earlier target-only split still needs a save decision. The existing record contains identical bytes for different targeting histories. [Restore test and smallest proposed change](../README.md#november-21-corrections)
