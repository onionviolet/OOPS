# Unlocks and parallel progression

Evidence labels: **shown-source** means read in the installed decompiled assembly; **shown-image** means visible in the official store screenshot; **stated** means a public source says it; **inferred** means analysis. Paths below are relative to the private `extract/assembly/`, pinned in FINDINGS.json.

## Early run ladder, shown-source

| System | Gate | What rebirth changes | Anchor |
|---|---|---|---|
| Basic Training | Available from start; later training rows open from earlier levels | Levels, allocations and bars clear; future caps shrink from prior training | `Rebirth.resetTraining`, `ButtonShower.updateButtons` |
| Boss combat / EXP | Boss combat available; Spend EXP hidden before first-ever boss defeat | Boss index returns to zero; permanent purchases are not the run stat | `ButtonShower.updateButtons`, `Rebirth.resetBoss` |
| Adventure | Current `bossID >= 4` | Gate can close again; retained adventure power is separate from NUMBER | `ButtonShower.updateButtons` |
| Inventory | `settings.inventoryOn` | Inventory reset handler is empty | `InventoryController.reset` |
| Money Pit | Permanently set when real gold reaches 100000 | Gold and per-run toss state reset; unlock flag retained | `Character.addGold` vicinity; `Rebirth.resetGold` |
| Augments | Current bossID at least 17 and not No Augs conduct | Temporary augment growth must be rebuilt | `ButtonShower.updateButtons`, `Rebirth` reset chain |
| Advanced Training | Attack and defense training row index 4 each reach 25000 | Levels reset; perk bank transfers only once this gate reopens | `AllAdvancedTraining.advancedTrainingUnlocked`, `reset`, `Update` |
| Time Machine | Current bossID at least 30 | Speed/gold levels reset; bank is conditional on perks | `ButtonShower.updateButtons`, `TimeMachineController.reset` |
| Blood Magic | Current bossID at least 37 | Run contribution differs from retained NUMBER and cooldown state | `ButtonShower.updateButtons`, `Rebirth.calculateNextMultis` |

bossID is an internal next-boss index, not safely interchangeable with every player-facing boss label. The gates above preserve exact source predicates. Basic challenge target index 57 is the displayed Boss 58. Avoid silently adding one to all menu predicates.

## Loot and permanent unlock ladder, shown-source

| System | Actual unlock action | Source drop route | Important distinction |
|---|---|---|---|
| Wandoos | Use item 66 | `LootDrop.zone4Drop` and later routes | Persistent OS upgrades coexist with temporary boot/resource levels |
| NGU | Use item 102 | Titan 1, `zone6Drop` | Button is revealed from highestBoss 4, well before usable unlock |
| Yggdrasil | Use item 92 | Titan 2, `zone8Drop` | Button revealed from highestBoss 17; fruit unlock/max tiers differ from current fruit growth |
| Gold Diggers | Use item 197 | Titan 3, `zone11Drop` | Button revealed from highestBoss 30; the gold economy finances a separate growth path |
| Beards | Use item 141 | Titan 4, `zone14Drop` | Button revealed from highestBoss 37; temporary and permanent beard levels differ |
| Questing | Use item 292 | Titan 6, `zone19Drop` | Also opens additional NGU control capability |
| Hacks / Resource 3 | Use item 294 | Titan 7, `zone23Drop` | Adds a new resource pool, not just another energy row |
| Wishes | Use item 343 with Hacks already unlocked | Titan 8, `zone26Drop` | Actual prerequisite checked in item consumer; consuming too early follows a failure branch |
| Cards | Use item 391 | Titan 9, `zone30Drop` | Sets unlock and immediately adds a card |
| Cooking | Set directly on Titan 10 reward path | `LootDrop.zone34Drop` vicinity of line 4514 | Not another item-use flag in the inspected route |

All loot-use unlocks above are joined through `ItemController`, not inferred from menu names. Drop handlers include probability, titan versions and availability checks; the table establishes the unlock route, not guaranteed first-kill acquisition for every row. Titan 5 and later titan puzzles are not detailed here because they do not change the requested resource/unlock pattern.

## Why parallel systems remain intelligible, inferred from shown source

A visible feature can be disabled while its permanent discovery remains. Permanent progression survives a reset even when the run pool must refill. Reused row grammar gives each allocation, target, progress and bonus a stable meaning. The shared scarce pools link choices across systems; they are not independent free XP streams. Hacks and Wishes use timed callbacks at 0.02 seconds; Wishes has separate slower UI refresh callbacks. This is mechanism evidence, not a measured performance claim.

For YAIRPG, the equivalent means are actors, time, tools, materials, sites and known methods. `src/simulation.js` already handles actor occupation and site capacity, and `feature_expansion_work_plan.js` already supplies finite itineraries. Add authored consumers and explanations there rather than translating Energy/Magic/Resource 3 literally. Keep the long-life model and repeatable reasonable options. No unlock redesign is accepted by this report.
