# Play surface lanes, 2026-11-14

Coordinator: the "Opus chats and UI refinement" session. Direction: [Weibao, 2026-11-14](../../USER_VISION_LOG_2026-11.md#play-surface-ui-per-feature-combat-across-worlds-daily-loops-2026-11-14). Fable usage is exhausted until 2026-11-16, so every chat runs on Opus. Usage at dispatch: 5-hour window 6%, weekly all-models 56%.

## Lanes and owners

| Lane | Session | Owns | Done when |
| --- | --- | --- | --- |
| Feature-by-feature UI (farming first, then crafting, mixing, care display, gathering) | feature-ui, `local_7ab5da3b` (new) | Feature panel UI files: `field_works_ui.js`, `field_ui.js`, `field_layer_panel.js`, crafting and mixing display, care display; a new round in the UI audit ledger | Farming and two more features seen before and after in headless Chrome at 1920×1080, with ledger lines and commits |
| Daily actions and loops for the three leads | daily-loops, `local_4ce8289f` (new) | Duties, livelihood and lead-day files; a new round in the lead core-flow audit | Map saved, loops proposed, and one lead's day loop playable at floor (AD43) |
| Combat refined and carried across worlds | Combat styles across worlds, `local_263f9375`, with its children combat-design, fight-view, combat-tables and scene-spike | `contest.js`, `combat_situation_ui.js`, contest and fight tests | One playable fight carrying the new possibilities, with a familiar surface, in each lead's world |
| Day strip follow-ups | Switching to Opus model, `local_2ce54229` (took over from the UI and vision coordination chat when it hit its Fable limit) | `src/ui/day_strip.js`, `styles/day_strip.css` | Its own list: instant hide at fight start, hide over centre views, the clipped tempo card, LOTM disabledReason, home baseline |

`src/book_world_lotm_ui.js` had another chat's uncommitted edit at dispatch; by default the other lanes leave it until that edit is committed, because two writers on one file lose work.

## Shared gates

- Browsers run headless, so nothing opens on Weibao's screen.
- `npm run test:changed` while working, and `check:arch` plus `check:rules` before each commit.
- Build with `sh scripts/clean_bundle.sh`.
- Commit your own paths from a fresh HEAD.
- No push without Weibao's yes, and no `Co-Authored-By` trailer.
- Report "agent-verified, not human-reviewed".

## Waiting on Weibao

- The combat chat's pending question. It was asked before the new brief, so the brief stays queued until he answers it.
- The held UI picks: directions A to F, the top bar (UIC132, UIC175), the Notebook (UIC168) and the growing screen (UIC131). The mocks are in `prototypes/ui-directions-2026-11-13/index.html`.
- Pushing the 15 local commits on master.

## Log

- 2026-11-14: direction recorded; feature-ui and daily-loops started; the combat brief was queued to the combat chat; the day-strip chat was told the boundaries.
