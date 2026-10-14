# Offline and clock digest

## What is shown

- F5a: `models/game/offline_time_manager.gd::load_from_save` calculates max(now minus last_played, 0) plus `offline_buff_duration`. No cap is imposed there. The value is serialized again by `Save.save`.
- F5b: `game_loading_controller.gd::_threaded_load` loads that metadata. It does not replay a simulation for the missing days. Normal progression starts through the in-game process loop.
- F5c: `OfflineTimeManager.tick` returns when paused, dead or bank empty. When fast-forward is selected it subtracts speed divided by two per call. The method accepts no elapsed-time argument and is called each game frame. No lower-bound clamp follows subtraction.
- F5d: `game_speed_handler.gd::update_speed_multiplier` multiplies selected fast-forward speed by registered gamespeed effects. It does not read offline time. Its speed ladder is 1, 2, 4, 8, 16, 24, 48, 100. Diary state expands available entries. No empty-bank restriction was found in the fast-forward button or controller.

## What the game states

`Scenes/popup/offline_popup.gd` describes elapsed time as earning a duration of 2x gamespeed benefit. Its method ignores absences below five seconds and shows a popup above five minutes, if called. A search of recovered script call sites found no caller for its update method; the loader calls the bank loader directly. The bank is loaded regardless of those popup thresholds. Binary scene signal wiring was not converted, so the popup's actual display route is unresolved.

## Contradiction, not a measured bug report

The stated duration-based benefit has no corresponding bank-dependent multiplier in the inspected speed handler. The per-frame subtraction cannot express seconds consumed reliably across frame rates. At selected 2x it removes one unit per running frame, not one unit per elapsed second. These are static facts and an inferred implementation defect. No game was run to measure it. No claim is made that users receive the promised 2x benefit or that a particular runtime frame rate is used.

The broader simulation also mixes delta accumulators and tick-based updates. PlayerProgression throttles heavy work to an accumulator interval but discards the interval remainder; the speed controller scales game speed from delta and a constant. Danger applies a logarithmic speed correction while death is checked each player update. Research should borrow explicit clock identities, not those rate expressions.

## Comparison and proposal

The saved Immortality Idle report describes closed time banked at one tenth and manually spent without spending life while closed. The saved Groundhog Life report describes actual catch-up ticks and an optional reset pause. This build shows bank metadata plus ordinary accelerated foreground play, with a missing or contradictory benefit consumer. These are three distinct policies.

P5 proposes a funded, visible, opt-in time bank only if the appropriate YAIRPG owner selects it. Validate equal elapsed time at different frame rates; pause/death/reset stop behavior; clock rollback; empty-bank stopping; save/reload/import. Offline aging, death, automatic reincarnation and policy changes remain unselected. No bounded bank value in this source settles the project's current absence policy.
