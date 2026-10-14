# Later-build systems: static digest

All numeric line locators below refer to the preserved `app.v2.pretty.js` under `/Users/weiwei/.codex/research/idle-depth/extract/`. **Shown** means control flow or configuration was read; **stated** means generated UI text; **inferred** marks adoption judgment. The raw file's hash, rather than an unverified version label, identifies this build.

## G15: war and research

**Shown, 1576-1597, 2149-2314:** laser damage starts at 0.01 and research adds 10% per level through a stat modifier. Each update attacks the previous target, advances ships, picks the next target and handles waves. Selection minimizes distance/speed inside firing range, not HP or distance alone. The first ship has 5 HP and reaches the inner boundary over 42 game years under normal movement. Its destruction starts waves.

Wave n has health 5 x n^1.04, doubled on multiples of 11 and multiplied by 20 on multiples of 50. Normally eight ships, doubled on multiples of 3, but a multiple-of-50 wave has one boss. Before year 42, speed is the baseline and waves wait for an empty enemy list plus more than 180 wave ticks. Later speed is 10x, with extra fast/boss multipliers; waves may overlap after the timer while the existing count is at most 100. That count is a spawn guard, not a hard cap on total ships.

**Shown, 6175-6204:** a ship reaching the solar system changes the tick interval to 10x normal. This is a slow continuation, not death or a battle loss reset. Attack stops getting a target after arrival. Battle prestige clears encounter state and per-life kills but preserves the total-kill counter. **Stated/shown presentation, 6848-6940, 8580-8625:** canvas uses position, HP outline, armor color, wave and estimated arrival, with a weapon toggle. No browser rendering was tested.

## G16: efficiency and retention

**Shown, 5319-5327 and vendor modules 210 -> 226 -> 264:** research and current-life ship kills each add a term approaching 0.05. Module 264 supplies log10. `LevelAddModifier` at 563-582 applies its 0.01 factor before the research transform. Thus research contributes 0.05 - 0.05/(1 + log10(1 + 0.01 x research level)); combat contributes 0.05 - 0.05/(1 + log10(1 + ships destroyed this life)). Combined efficiency approaches 0.1. These formulas were traced through a static AST read of the matching named vendor bundle, without running game code.

**Shown, 1704-1826:** a skill starts with permanent multiplier 1. Groundhog Factor is 1 + highest level this loop/10. Grand prestige first updates the best to include current level, adds factor x efficiency to the permanent multiplier, then clears level, XP and this-loop best. The gain is additive to the retained multiplier; XP rate multiplies by the result. Repeated traps remain possible.

**Stated/shown, 8810-8840:** UI explains losses and compares old/new values per skill, disables activation below efficiency 0.03, and retains legacy Tachyon/market wording. The handler itself calls grand prestige without repeating that UI threshold. A complete registered-object reset audit and save compatibility test were not run. **Shown, 2775-2830:** reset dispatches to each registered object's own method, updates all, then checks assertions. This does not establish transactional rollback.

## G17: auto-x and queue

**Shown, 3812-3818, 4300-4312:** all three automation capabilities are enabled in user inventory; toggles default off. Retired market methods are empty. UI at 8299 states the market is discontinued and automation is available by default.

**Shown, 4674-4699:** auto-promote waits for a configurable current-job level, scans only that career's following unlocked jobs, and stops at the first with level at/below the threshold. Just Pause sets pause true instead of changing jobs.

**Shown, 5060-5189:** research queue entries hold entity ID, goal, active/finished/unlocked state and an internal ordering ID. Advance selects the first unfinished unlocked goal and skips locked entries. It refreshes goal predicates, changes active research, then continues normal scheduling. Newly active entries under Just Pause toggle pause and still change research. Loading removes unknown area IDs and reconstructs internal IDs. The constructor's initial goal is -1; the player must set a useful goal.

**Shown, 4606-4669:** stacked boosts wait for readiness together, while independent mode activates available boosts individually. The conference condition uses `(exclude || not-conference)` and activation later iterates every boost. This is a mismatch to preserve, not a dependable exclusion policy. Just Pause stops boost activation. **Shown, 6121-6175:** automation runs inside the daily tick before daily income/actions; setting pause in it does not abort that current tick.

**Inferred:** use separate notify/pause/act policies, a clear pause boundary, and an explicit reason for every skipped queue item. Do not copy the toggle behavior or the source's fixed limits into YAIRPG policy.

## G18: achievements

**Shown, 3474-3640:** seven groups cover lives/loops, five selected sins, wealth, burger career, software career, mood and physics career. There are 31 achievement objects. Conditions include highest-ever level, days to level 10/100, lifetime ship kills, selected choices, food days and extremes of mood. These are a mix of accumulated actions, high-water marks and pace feats.

**Shown, 4440-4540:** completion stores life and day, notifies journal/achievement panes and requests a save. Group updates count children. The default reward value exists, but `getReward` only requests a save. Completion can revert when its predicate becomes false; many predicates avoid that with retained maxima.

**Shown mismatch, 3501-3513:** the second and third loop-count achievements subscribe the first loop achievement again. Global reset updates might refresh them; event-time freshness is not proven. **Shown mismatch, 3630-3636, 1499-1503:** wording says use Loop Trap in two consecutive lives, while the predicate tests whether minimum lives in a loop is at most 1. Do not turn wording into a verified rule.

## G19: time banking and changed build behavior

**Shown, 5795-5799, 6177-6214:** normal day interval 300 ms, Turbo divisor 2, dilation multiplier 10, bank divisor 10. Paused time and elapsed offline time add banked ticks at 1/10. Turbo subtracts banked ticks while accelerating active time. These constants and code paths were read, not executed. Later boost definitions at 3643-3670 use 1.75 rather than earlier 2x.

**Inferred adoption:** keep a clock ledger with earned, consumed and remaining bank, distinct from world time and combat progress. For province war, reuse the existing conflict/supply/knowledge owners. This source adds a useful threat countdown example but no evidence of province politics or transport.
