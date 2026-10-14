# Rebirth and challenges

All mechanism statements below are shown-source unless marked inferred. Installed-source anchors are listed in FINDINGS.json.

## Reset order matters

`Rebirth.engage(bool)` first settles AP, converts beard trimmings and applies MacGuffin bonuses. It then records new NUMBER and prior boss/time factors, resets resource pools and training, resets bosses/time, invokes feature resets and clears gold/stats/fruit run state. A hard challenge/difficulty branch additionally resets NUMBER factors and banks. Thus a generic reset-everything operation would lose rewards that must settle before clearing.

| State | Ordinary rebirth | Challenge / difficulty boundary |
|---|---|---|
| NUMBER attack/defense multipliers | Recomputed from this and previous run boss/time factors plus training, blood, NGU, beards, fruit, MacGuffins and Hacks | Most challenge starts and difficulty switches set current/next/prior factors to 1 |
| Boss, run time, gold | Reset | Reset |
| Current Energy / Magic / Resource 3 allocations | Clear | Clear |
| Energy cap | Early cap at or below 100000 is recomputed from Energy gained; higher purchased capacity follows different behavior | Same reset route; not a universal wipe of resource power/cap/bars |
| Basic Training | Levels/bars/allocations reset; attack/defense caps reduced, floor 1 | Same trained-cap improvement route |
| NGU | Normal/Evil/Sadistic levels, fractional progress and targets retained; energy/magic removed | No NGU challenge disables their effects rather than deleting these levels |
| Hacks | Resource 3 allocations removed; levels/progress remain in inspected reset | Not globally deleted by the hard NUMBER reset |
| Wishes | `Wish.reset` clears the three allocations, leaves level/progress | Retained in inspected reset chain |
| Inventory | Reset handler empty; equipment/items retained | No Equipment changes bonuses, not an inventory deletion |
| Advanced Training | Bank fraction from perks, then baseline perk levels; bank becomes available after re-unlock | Bank explicitly cleared |
| Time Machine | Speed/gold multiplier banks from perks; levels and bars clear; bank transfer guarded | Bank explicitly cleared |
| Beards | Convert temporary growth into permanent gains before reset; optional temporary bank | Temporary bank cleared; permanent conversion remains distinct |
| Yggdrasil | Run growth/activation/harvest counters clear or follow resetFactor; seeds/max tiers not cleared by fruit reset | Do not describe all fruit bonuses as always active: activation flags also reset |
| Challenge completion record | Retained counts and best times feed later consumers | Separate Normal/Evil/Sadistic completion counts |

Blood Magic reset explicitly clears blood points, rebirth power, gold-spell blood and loot-spell blood (`AllBloodMagicController.reset`). Its cooldown fields are outside this selected reset trace. Augment base/upgrade levels, energy and progress clear through `AllAugsController` to `Aug.reset`. Previous blood contribution is displayed as history; the next-NUMBER formula uses current blood power, not that historical field.

This is selected carryover coverage, not every save field. Currency ownership, offline catch-up, serialization durability and every cooldown are not fully audited.

## Challenge structure

The active `AllChallengesController` names 11 challenge controllers: Basic, No Augs, 24 Hour, 100 Levels, No Equipment, No Rebirth, Troll, Laser Sword, Blind, No NGU and No Time Machine. A separate YggdrasilChallengeController file exists but is not referenced by that active roster; its presence is not evidence of a twelfth usable challenge.

The challenge button appears once highestBoss exceeds 57. Individual challenges still have their own gate. Starting checks minimum rebirth time (180 seconds, reducible by a wish to a 120-second floor), no active challenge and a defeated first boss. Enrollment confirms and sets one challenge type. Laser Sword uniquely uses ordinary `engage()`; the other inspected starts use hard reset. Quitting calls the relevant failed-challenge handler; it is not shown as restoring the pre-entry NUMBER snapshot.

| Challenge | Unlock / target evidence | Design pattern |
|---|---|---|
| Basic | Available within challenge screen; target index 57 | Benchmark ascent; retained stat/recycling rewards and final Paralyze unlock |
| No Augs | highestBoss at least 75; target 58 | Suppress one progression tool |
| 24 Hour | Basic best time below 86400 seconds; target min(299, 57 + 26 times current-tier completions) | Deadline and escalating objective |
| 100 Levels | At least 10 combined energy NGU levels through the inspected getter; target 57 | Per-run budget with explicit exceptions, to be enforced by consumers |
| No Equipment | Received GRB set; target 65 | Temporary suppression of gear contribution |
| No Rebirth | Persistent unlock flag set on Titan 3 routes; target 39 + 5 times current-tier completions | Single-run ascent |
| Troll | Achievement 129; target 68 + 15 times current-tier completions | Deliberate disruption, including menu misrouting; poor default usability model |
| Laser Sword | Augment row 6 base and upgrade each reach 1; completion tests both against laserSwordTarget | Non-boss target and gentler entry reset |
| Blind | Item 141 discovered or persisted unlock; target 57 + 10 times completions | Hide numbers, not progress data deletion |
| No NGU | Combined normal NGU levels reach 10000; target 57 + 10 times completions | Suppress permanent bonus contribution |
| No Time Machine | Diggers unlocked; target 57 + 15 times completions | Remove economic accelerator |

Targets are internal indices. Restriction enforcement is traced directly for menu gating/NGU disable and selected entry/exit paths; every budget/combat consumer is an unread gap. Reward formula and completion caps vary by challenge. Basic completion can continue counting beyond the reward cap, while its benefits stop scaling through capped getters. Do not turn source reward caps into a fixed once-only YAIRPG rule.

## Transfer limits

Inferred: a useful challenge tests a different solution, records a durable outcome and has a reward consumed later. YAIRPG's `structured_renewal.js` already returns lost/retained rows, validates freshness and writes through the caller's normal durable transaction. It also currently prevents repeating that specific renewal. That current code is not authority to impose new fixed once limits; changing it would require a separately scoped compatibility decision. The immediate proposal is better projection of the existing transition, not changing its lifecycle.
