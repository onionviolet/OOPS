# Reset and life digest

Shown means static installed code, not runtime. Locators are `res://` paths, with human-readable token rendering under the work area.

## Two live reset depths

`models/player/player/player_lifecycle.gd::rebirth/regress` pause, reset currency/content through object handlers, restore starting age/equips, update automation/statistics, save, reinitialize actions, switch navigation to Jobs and resume unless pause-on-reset is selected. Individual handlers own exceptions. This order matters: a name like “permanent” is not enough to predict behavior.

| Domain | Rebirth | Regression | Locator |
|---|---|---|---|
| Gold/Renown | Clear current wallet, add starting effects | Clear wallet, add starting effects unless Temporal allocations are being reset | `models/player/resources/gold.gd`, `renown.gd` |
| Miracle wallet | Resets through tier-one defaults | Resets through tier-one defaults | `miracle.gd`, `player_resource.gd` |
| Normal levels/XP | Zero; raise cycle/lifetime best | Zero; clear cycle best, preserve lifetime best | `models/action/level.gd::rebirth/regress` |
| Best-level multiplier | Ordinary Action uses cycle best / 10 plus 1 | Cycle multiplier is cleared for ordinary Action | `models/action/Action.gd::update_max_level_multiplier` |
| Skills | Current practice normally resets; XP multiplier override uses effects only | Same, except Heroic Potential skips both handlers | `models/action/types/Skill.gd` |
| Spells | Level rebirth handler records best, clears current practice | Calls rebirth rather than generic regress, so do not assume its cycle-best clearing matches jobs | `models/action/types/spell/spell.gd::regress` |
| Technologies | Stay unlocked; requirements refresh | Clear unless Library of Time permanence is active and allocation reset is off | `models/action/types/civilization/Technology.gd` |
| Lifestyle enhancements | Clear unless enhancement permanence is active | Clear unless permanence remains active and allocations are kept | `models/action/types/lifestyle/lifestyle_enhancements.gd` |
| Explorations | Reset life completions/timing | Also reset cycle completions/timing; lifetime survives | `models/action/types/exploration/Exploration.gd` |
| Story knowledge | Current unlock/effects clear and can requalify; was-unlocked survives | Same | `models/action/types/story/story.gd` |
| Temporal Essence | No rebirth mutation | Award essence, rebuild wallet from lifetime total; retained allocation costs are charged by Temporal handlers | `models/player/resources/temporal_essence.gd`, `types/Temporal.gd` |
| Temporal skill allocations | Keep levels/effects | Keep and re-charge cost by default, or clear under the player's reset setting | `models/action/types/Temporal.gd::regress` |
| Rebirth count | Increment cycle and lifetime counts | Cycle count clears; lifetime survives | `models/statistics/rebirth_statistics.gd`, `base_reset_statistics.gd` |

Temporal Essence grants learning speed from its lifetime total at 0.05 per essence. Gain uses the cycle's rebirth count, normally one essence per ten rebirths, modified by purchased effects, plus boss rewards, then floored. Retention is not just “keep your current spendable essence”: its special regression handler restores lifetime value before allocations are charged. Conditional insufficient-funds and refund behavior is source-shown, not tested in a saved game.

## Risk and choice

`can_rebirth` accepts death or earned manual access, but refuses while force-regress is active. `can_regress` accepts completion of the specified route boss or force-regress. Dark Light and a late-region route set the flag on entry; specified end bosses clear it. The confirm window says that dying now will regress the run until that boss is defeated, describes technology/rebirth-count loss and previews essence.

`player_actions.gd::can_press_on` checks exploration death, Indomitable Will and the active exploration's pressed-on flag. Completion clears that flag. This is a source-specific rescue rule, not a proposed YAIRPG once-ever cap.

## Age and lifespan

`models/player/lifespan.gd` starts at 20, or 12 with Temporal Youth. Base maximum age is 50. Remaining life is derived from maximum age minus body age; adding lifespan does not roll a new character. Formula components: base days; boss cycle-day and lifetime-day bonuses; effect-derived years; accumulated daily growth minus daily loss; final lifespan multiplier. `Age` stores day/year/century/millennium/mya/eon units. These are numeric long-life displays, not demonstrated geological world simulation.

`player_lifecycle.gd::update_death_state` checks age before exploration risk, sampling mortality during update. It spends one Miracle if available to avert that exploration result. `Danger.get_mortality` converts a scaled annual chance to daily chance and applies logarithmic speed compensation. The update call is frame-driven, so the effective real-time risk rate needs runtime measurement. Zero total danger can produce a division edge case in `get_reduced_danger`; do not copy the expression as a robust probability model.

Life-cost training is authored: `assets/trainings/physical/content.json::limit_breaking` gives strong multi-skill XP but accumulates daily lifespan loss. This supports a legible cost ledger, not a default death policy for YAIRPG.

No generated talents/traits, household roll or reroll seed was found in the live player state, defaults, lifecycle, serialization or JSON row schemas. Heroic Potential and Luck are named trained skills, not proof of rolled birth traits.

## Player explanation

`Scenes/popup/action/action_popup.gd::update_descriptions` shows past best and learning multiplier, hiding the multiplier for Skill. `Scenes/popup/manual_reset/manual_reset_popup.gd` previews total essence and two sources. `Scenes/popup/ForceRegressConfirmWindow.gd` warns before the rule change. `Scenes/popup/death/RebirthPopUp.gd` offers available Rebirth, Regress and Press On buttons. Binary scene defaults and actual rendering were not recovered, so fixed label text, visual hierarchy and keyboard usability stay open.
