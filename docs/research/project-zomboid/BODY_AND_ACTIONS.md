# Body fields and timed-action feedback

Shown source findings, with no game run. Java sources here mean the selected CFR reconstruction under the work area.

| Code | State owner | Reader and effect |
|---|---|---|
| BD1 | Trait membership FAST_READER / SLOW_READER | `ISReadABook.getDuration`: 0.7 or 1.3 reading-time factor. Reading glasses and sitting each add a separate 0.9 factor. |
| BD2 | FAST_LEARNER / SLOW_LEARNER / CRAFTY and descriptor XP boosts | `IsoGameCharacter.XP.AddXP`: route-dependent XP multipliers, with exclusions; book multiplier is separate retained state. |
| BD3 | FAST_HEALER / SLOW_HEALER | `BodyPart` wound-time setup reads them for several injury types. No need to encode every wound through one constitution value. |
| BD4 | Raw CharacterStat values plus BodyDamage | `Moodle.Update`: Tired reads FATIGUE; Hungry reads HUNGER; Unhappy reads UNHAPPINESS; Pain reads PAIN; Sick combines apparent infection and SICKNESS; Bleeding counts bleeding parts, with a neck special case. Moodles are derived indicators, not the authoritative wound fields. |
| BD5 | UNHAPPY / DRUNK moodle levels; local arm pain | `ISBaseTimedAction.adjustMaxTime`: time multiplied by 1+unhappy/4, then 1+drunk/4, then 1+sum(hand-through-forearm pain)/300 unless `ignoreHandsWounds`. Reading opts out of hand wound slowdown. |
| BD6 | Local thermal state | Base timed action calls `getTimedActionTimeModifier`; `IsoPlayer` delegates to BodyDamage thermoregulator. A separate action-rate reader, not simply the temperature moodle icon. |
| BD7 | Per-part injury, bandaged, stitched, additional pain, stiffness, fracture/splint, glass/bullet and burn state | `media/lua/client/XpSystem/ISUI/ISHealthPanel.lua` lists affected parts and builds treatment controls from those fields plus available supplies. Bandaging can hide underlying wound details. Treatment state and player knowledge need not be the same. |
| BD8 | BodyDamage part injury and pain | `IsoGameCharacter.calculateBaseSpeed` reads torso-through-neck injury/bandage and leg additional pain, alongside endurance/load moodles; other movement modifiers remain separate. |
| BD9 | Character gender | `IsoGameCharacter.isFemale` callers select outfits, names and visual data. This pass does not establish a universal gender-to-work-strength modifier. |
| BD10 | Human genetics, complete physique and constitution mapping | Unread/not established in this slice. Animal definitions are present, but animal breeds do not prove independent human genetics. Avoid upgrading a requested design taxonomy into a source fact. |

## TA1: lifecycle is not a reason protocol

`media/lua/shared/TimedActions/ISBaseTimedAction.lua` provides start-validity, ongoing-validity, start/update/stop/perform hooks. Default stop resets the queue, and perform advances it plus calls `ISLogSystem.logAction`. The existence of a log call does not prove a retained player work receipt. `ISTimedActionQueue.onCompleted` warns and clears the queue when the next start validity fails; selected retrigger paths retain delta and avoid duplicate input consumption. That special case does not guarantee arbitrary resumability.

`LuaTimedActionNew.valid` accepts only a boolean from the Lua callback. Its client update force-stops rejected network actions, and stop forwards to Lua cleanup. No reason payload is exposed in these inspected lifecycle methods. Walking/running/aiming stop flags are copied from the action table.

## TA2: feedback varies by action

Reading's validity emits too-dark halo text. Too-hard/obsolete book cases issue distinct feedback and stop, while pages are tracked explicitly. Missing inventory and some vehicle conditions simply return false. `ISHandcraftAction.isValid` checks recipe and station-use relation, while its start and actual execution use reconstructed recipe logic. Failed manual-input/current-recipe checks can log debug text and force stop, with no equivalent causal player message in that branch.

Drying is the good P01 example: `DryingCraftLogic.doProgressTooltip` gives wetness, temperature category, rate and why work is paused; progress and environmental state have separate saved owners. The improvement for YAIRPG is to expose actual existing blocker and receipt fields together on desktop. A log, a disabled button or a queue reset alone is insufficient evidence of truthful work feedback.
