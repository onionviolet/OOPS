# Automation, offline work and party opportunity cost

Evidence is stated in installed Help unless explicitly marked shown. Entries and
CSV record numbers are pinned in [coverage](COVERAGE.json). Actual scheduler,
battle, drop and quest consumers remain unread in this pass.

## Concurrent plans with separate ownership

Sloth describes three queues: Dungeon, Loop and Other. Each runs independently
or alongside the others. Dungeon and loop jobs have matching queues; templates,
food/examination and instant/upgrade/next actions may be inserted more broadly.
Rows execute top to bottom, with a count, repeat mode and skip-if-stuck option.
Help states a 0.1-second action cadence and a configurable batch symbol. This
is not a benchmark or proof every queued action can run offline.

AHA assigns unused Habit every ten seconds and on selecting a new template.
Locked routines are ignored until unlocked. Disabling AHA removes its allocated
points while preserving manual allocations. Convert-to-manual changes ownership.
The prior native trace independently distinguishes manual and automatic arrays;
this pass extends the authored interaction policy, not the allocation algorithm.

Shown `baking` and `makeGrilledFish` declare offline eligibility. Shown `fishing`,
`makingPotion` and `makingElixir` declare Sloth eligibility. These are different
fields and cannot substitute for each other. A recipe's input costs still matter
when offline. The prior native UpgradeAction wrapper refuses offline operation;
Help's broad queue support does not override that selected native exception.

## Away time is not uniformly full-speed time

Offline Help states first-to-fifth-day reward factors of 50%, 40%, 30%, 20%,
then 10% thereafter. Ten days yields a 20% average according to this authored
policy: (50+40+30+20+10+10+10+10+10+10)/10. Additive improvement extends the
time before decay reaches the floor; multiplicative improvement raises the
starting factor, with a stated maximum of 95%.

The formula Help prints a minimum between 0.95 and a power expression. The
precise interpolation, units, zero behavior and relationship to this prose need
native review. Prior native evidence separately gives the 63,072,000-second
validation ceiling and scaled versus full-time dispatch. Neither fact establishes
clock anomaly handling, duplication safety or a complete reward benchmark.

## Allies can do something other than fight

Quest Help states a squad can contain any number of allies. Once working, allies
cannot be added; removal is allowed while more than one remains. An ally cannot
simultaneously occupy party and squad. This makes quest production compete with
combat capability instead of treating absent allies as free bonuses.

Each filled progress bar gives a minute reward and advances quest completion in
one-minute increments. Squad stamina is the sum of ally stamina and is spent at
progress reward. Zero stamina doubles time instead of halting work; recovery can
be manual or consume an Auto Recoverer item. Max stamina also increases the
completion reward. The authored diminishing-return thresholds distinguish ritual
benefits from other effects. These are stated mechanics, not measured quest time.

Wrath personalities explicitly connect this labor choice to investment: Idealism
improves quest completion; Principle improves quest speed. Other personalities
improve battle or native passives, with shared rising costs. Reincarnation Help
says active quests continue while temporary quest effects reset, a distinction
that still needs the actual saved squad and callback trace.

## Collection skill differs from research skill

Shown `loveDissection` and `loveHug` have the same Stamina cost but different
intervals, elements, base parameters and doubled additional effects. Help says
Collection improves resource drops on the killer's attack, excluding chests;
Luck instead improves research drops. Neither can be called a blanket global
loot multiplier. Formation and who defeats the enemy matter.

Wrath reinforcement changes a formation bonus itself, while Echo changes the
multiplier of formation-qualified additional effects. The Help example compounds
multiple Penetrate effects after Echo. This should not be confused with adding a
flat percent to final damage. No new exact damage calculation or native skill
fallback execution was proven; the earlier selected fallback trace remains the
source for shortage behavior.
