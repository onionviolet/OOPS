# ER1-F6 combat timers, 2026-10-14

Finding: `docs/research/RUNTIME_HOTSPOT_AUDIT_2026-10-14.md` ER1-F6. Owned file:
`src/models/combat.js`. No `main.js` edit.

## What changed

Each attack cycle is still 60 sub-ticks with the same drift correction, but
sub-ticks 1-58 are now computed in plain code (`plan_subticks`) instead of
being 58 engine timers. Two timers stay per cycle:

- one at the 59th sub-tick deadline. It sees the real clock (as the 59th timer
  did) and arms the 60th with the old expression, so the swing's due time and
  its timer allocation order match the old chain;
- the 60th, which swings exactly as before.

Saved `loops[].count`, strike checkpoints and interrupted cycles (stance or
gear change, pause, kill) report the sub-tick count and drift state the old
timers would have left. Ties at the same engine time follow the old timer
allocation order (`allocated_earlier`). Attack bars are a linear Web Animation
on `transform: scaleX` from the same deadlines (enemy bars grow from the
right, as `margin-left: auto` made them before), frozen when a loop is cleared.

`tests/p23-combat-options.test.js` R51 asserted the first sub-tick delay
(1000/60). It now asserts the 4:1 ratio on the first armed timer (59 sub-ticks)
and the 60th's delay.

## Evidence

Developed fixture (workshop `natural-final-save.json`, clock 66). Rebuilt
bundles served from scratch mirrors, fresh origin, 1366x768, system Chrome
headless. Fight entered with native UI: Move somewhere else, Infested field.
Host load average 160-535 from other lanes.

Busy combat, 20 s windows (`tools/combat_measure.cjs`, `tools/combat_share.cjs`):

| Run | Page JS-busy | Timer callbacks/s | Layout ms | Combat loop JS | Swing JS | Long tasks (max) |
| --- | --- | --- | --- | --- | --- | --- |
| base 1 | 6282 ms | 109.1 | 584 | 147 ms | 1136 ms | 19 (1720 ms) |
| base 2 | 6117 ms | 113.1 | 692 | 133 ms | 901 ms | 21 (1602 ms) |
| new 1 | 4011 ms | 4.9 | 42 | 3 ms | 811 ms | 20 (953 ms) |
| new 2 | 4903 ms | 4.7 | 73 | 4 ms | 1201 ms | 20 (1636 ms) |

- Timer callbacks: 0.04x (gate 0.1x). Combat loop machinery: 0.03x.
- Page JS-busy: 0.72x. The 0.4x gate is not reachable from `combat.js`:
  the loop machinery was about 2% of busy-combat JS (140 of 6200 ms). The rest is the per-tick
  `update_timer -> persistExpansion` path (about 60%) and the per-swing
  `runP23CombatExchange` durable save (about 15%), both in `main.js`.
- Layout time fell from about 600 ms to 40-70 ms per window: the old per-sub-tick
  `style.width` writes forced layouts.

Outcome identity (`tools/combat_replay.cjs`, `tools/combat_replay_cmp.cjs`):
`?test_hooks=1`, engine paused before PLAY, fixed `Math.random` seed, native
combat controls (hero attack power 40, enemy attack power 0.01), 50 ticks,
41 kills over two field entries. Base vs base and base vs new, two reps each:
durable save (minus `saved_at`, `total_playtime`), snapshot save and combat
log byte-identical.

Tests: `node --test --test-concurrency=2 tests/*.test.js` 1710 tests, 1707
pass, 0 fail, 3 todo.

Bars: `results/er1f6-bars-before-{a,b}.png`, `results/er1f6-bars-after-{a,b}.png`
show partial hero and enemy bars mid-cycle.

## Known differences (live play only)

- Live timers: the old chain paid timer lateness and the 4 ms nested-timer
  clamp on every sub-tick, so at high game speed a cycle ran longer than its
  cooldown. Now lateness is paid once per cycle, closer to the stated cooldown.
  Dev-stepped timing is unchanged.
- `set_speed` mid-cycle: the new tickrate applies from the 59th sub-tick, not
  from the next sub-tick. Dev console only.
- Bars keep animating while dev hooks pause the engine; they reset on the next
  cycle.

## Follow-up for the main.js owner

Busy-combat cost is now the per-tick persist path and the per-swing durable
save in `runP23CombatExchange` (`create_save`, `validateSaveEnvelope`, a
`setItem` per swing). Those are where the remaining 0.4x lives.
