# Combat and technique digest

All claims in this file are **shown** in the pinned Immortality Idle source unless marked inferred. Locators are `src/app/game-state/battle.service.ts` (B), `activity.service.ts` (A), and `hell.service.ts` (H).

## F11: what actually generates and keeps a family technique

B1888-1937 advances development once per battle tick with enemies present and room for another family move. B959-967 generates on a later long tick at a strict `>` threshold of 20000 x 10^active-family-count. This is battle exposure, not a kill reward or a roll tied to the skill used. B1384-1481 selects an allowed prefix, random attack attribute and noun, cooldown 5-14 ticks, stamina cost 0-14, optional qi cost 0-4, and a one-in-five optional effect. Empty allowed lists reopen the whole pool. Duplicate names gain punctuation. Prefixes can add health costs and damage multipliers; dangerous health-cost or explosive moves start disabled.

B1902-1937 adds base power before checking whether the strike can pay its costs. Focus gives +4 instead of +1. B1940-1970 debits qi, then stamina, then health, returning on each shortfall. A later failed resource check can follow an earlier debit. These are source hazards, not a transactional model to adopt.

A4492-4553 requires training chambers, a technique-master follower, a chosen focus and access outside Hell. It spends 10000 stamina, then refines once for each chamber using the masters' combined power. B1537-1603 separates power, cooldown, weapons, ambient energy, divine damage, qi spend, lifesteal, low-health power, critical chance/damage and severing. Most approach configurable caps by interpolation. Inferred: keep intentional costs separate from convenience upgrades; greater qi use is a power choice, not improved efficiency.

B1483-1528 supports forsaking, archiving and relearning. Archive clears focus and frees an active slot; relearning checks capacity. B1159-1187 resets encounters and per-life kill counters but does not clear techniques or the library. B1189-1329 serializes both lists, development, choices and refinement fields. Static retention is shown; no save/reload/import was exercised.

## Battle resolution and useful differences

| ID | Mechanism | Locator |
|---|---|---|
| B1 | Player attacks resolve before enemy attacks each battle tick; status recovery occurs first | B671-715 |
| B2 | Each enemy can fire only one ready technique per tick, in array order; player techniques have no equivalent single-attack cap | B1677-1716, B1888-1937 |
| B3 | Slow changes cooldown gain; poison takes a share of current health, with much smaller damage under resistance | B1677-1705 |
| B4 | Ice shield consumes itself to prevent a lethal hit; survival formation instead leaves 1 HP once | B1811-1820, B1880-1885 |
| B5 | Darklight blocks healing; corruption raises damage and exposes the user; explosive moves hurt the user and can destroy weapons | B1830-1877, B2045-2260 |
| B6 | Element, qi compression, weapon contribution, concepts, nutrition and divine compatibility all enter damage | B1988-2347 |
| B7 | Formation lifetime advances on ordinary and battle ticks; stealth blocks enemy attacks until the player fires | B626, B672, B1137-1157, B1911-1914 |
| B8 | Trouble selects location-specific monster types in a kill-count cycle, scales quality/power and can eventually eradicate eligible types | B2521-2659, B3056-4530 |
| B9 | Learned instant kill uses a cached past hit and has guards for pause, empty encounter and enemy HP | B2453-2470 |
| B10 | Flee gives enemies three cooldown-processing passes, clears combat, can lose swim progress and dismisses the youngest follower | B2503-2518 |
| B11 | Decoy switches target; a healing ally and an ally-death enrage make target order matter | B2785-2805, B2891-2971, B2975-3053 |

## Contradictions to retain

B2620-2634 reconstructs normal monster techniques with selected fields and drops `effect` and `hitTracker`. The force-feeder template at B4283-4302 names a fasting-reset effect, and B1823-1838 implements that effect, but the normal spawn path does not forward it. Do not claim the fasting disruption works. The reflection template's technique list also passes through that reduced mapping, so it does not preserve the player's full move semantics.

B2341 fixes blowthrough to false. The overage calculation exists but is dormant. It is not an active cleave system. B2406 checks a function reference rather than calling the immortality method in one death-toast condition. These observations are static findings, not a requested upstream bug-fix pass.
