# AFK and legibility digest

SHOWN means static shipped code, not a played claim.

## Offline calculation shape

`q._customBlock_AFKgains` clears a reward map, reads global minus player time and dispatches on the activity type. The inspected combat/gathering branches require more than 120 elapsed seconds. A selected prayer can clamp used time to 36,000 seconds. This is a conditional ten-hour cap, not a universal offline cap. The path also resets clearly invalid time values. It calculates Anvil progression and capped Worship charge as side effects before ordinary rewards.

Combat rewards separate effective activity time, AFK gain rate, kill-per-kill credit, monster XP and generated drops. Portal/kill credit therefore must not be treated as a universal multiplier for XP and rare loot. Mining separately multiplies elapsed hours, hourly harvest rate, AFK rate, multi-ore chance and ore value; XP takes a different path. Flooring and large-number branches differ. Do not collapse the source into a universal `time × damage` formula.

`k._customBlock_HourlyKillRate` builds a combat input map from monster health/count/respawn, expected damage, crit terms, accuracy, movement and attack delay. Survivability is calculated separately. Its gathering branches use skill speed and harvest chance, with activity-specific conditions.

`k._customBlock_AFKgainrates` collects family, talents, cards, guild, divine, shrine, item and later-system inputs. This combat branch has a 0.4 base and common early gathering branches a 0.5 base before their additions/multipliers. These are formula constants in this download, not a promise of a player's displayed final rate. The [older AFK page](https://idleon.wiki/wiki/Game_Mechanics_AFK) labels itself outdated and gives a 0.2 combat base and historical maximum. The code takes precedence for this static snapshot.

General bonus aggregation includes paid bundle/companion checks. Static inspection does not establish what an ordinary free account possesses. W7 Spelunking uses its own branch and a conditional generic-rate conversion rather than inheriting every older AFK bonus at full strength.

## Background production is a separate model

| Model | Example | Limiting condition |
|---|---|---|
| Current character AFK activity | Combat, gathering, Lab, meditation, cooking-area XP | Assignment and personal performance. |
| Shared timed producer | Kitchens, breeding eggs, liquid, fleet/garden | Capacity, resource inputs, unlocks or collection rhythm. |
| Support board contribution | Brewing assignment, cogs | Personal skill/input improves shared production without necessarily consuming normal AFK activity. |
| Event-derived extra time | Wiki Omniphau link | Non-candy claim advances one eligible system, not all systems. Name/effect mapping has a trace gap. |
| Stored record or sample | Worship record, 3D Printer sample | Earlier earned performance feeds later collection/production. Exact resampling semantics not fully traced here. |

Wiki liquid generation stops at its cap; crop overgrowth can make waiting useful. Therefore each system needs its own description of waiting, full storage and collection. A blanket wasted-time alert would sometimes be wrong.

## How the player reads the system

The roster draws six entries per page, uses AFK-type icons, distinguishes the current character and draws a global-time-minus-away-time duration for others. A player can inspect task allocation without opening each character's full build. The Quick Reference event dispatch checks eligibility before changing system menus. Some remote operations require a companion; unlocking a menu and performing an action from anywhere are different capabilities.

The stat menu uses system-specific helpers for lab reach/XP, divine gain rates and fleet speed. Wiki descriptions show capacity/total counters, detection risk and contribution information inside local boards. Research adjacency and world progression restrict initial exposure.

INFERRED: these are useful handles, but the high number of interacting multipliers creates opaque priorities. The Alchemy article warns that inattention slows account growth. The source's fixed menu indices and shared scratch stat objects make a poor architecture to copy into YAIRPG. Adapt the visible question and its evidence, using existing workspace registration and player-observed event projections.

Read-only YAIRPG comparison: `src/workspace_layout.js` has eligibility/discovery-aware module registration; `src/event_feed.js` excludes unobserved NPC acts; `src/activities.js` distinguishes activity unlock and local availability. P2/P3 should extend those contracts. No claim that YAIRPG currently implements general wall-time catch-up follows from this comparison.

Open: server authority, reward commit/replay behavior, exact rates at logout versus claim, full food depletion/drop probability order and real usability. Static source cannot prove those runtime outcomes.
