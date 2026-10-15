# Small touches, all PROPOSALS

Original adaptations for existing owners, not a copied UI checklist or new required scope. Source-defined cues are unplayed. P01 owner: UI_AT_SCALE; P03: SKILL_MECHANISMS_AND_MEANS; P04: TECHNOLOGY_AND_PROGRESSION; CH: MODULAR_PRODUCTION_CHAINS; BD: current body owner to recover.

| Code | Small change | Donor locator | Owner packet |
|---|---|---|---|
| T01 | Show reading pages retained before leaving a study view. | ISReadABook.update | P03 |
| T02 | Show the eligible skill band next to a study bonus. | ISReadABook.checkMultiplier | P03 |
| T03 | Call a preparation bonus preparation, without implying earned XP. | XPSystem_SkillBook | P03 |
| T04 | Explain that a reference is too advanced before paid study. | ISReadABook.doHaloText | P03 |
| T05 | Explain that a book is already below the learner's level. | ISReadABook.doHaloText | P03 |
| T06 | Retain learned method when the manual leaves inventory. | IsoGameCharacter.knownRecipes | P03 |
| T07 | Show direct practice/media gain separately from active bonus. | ISRadioInteractions.doSkill | P03 |
| T08 | Disclose a known training cutoff before spending time. | ISRadioInteractions.doSkill | P03 |
| T09 | Use one stable occurrence ID to prevent duplicate grant. | ISRadioInteractions.checkPlayer | P03 |
| T10 | Show learned state next to current skill requirement. | ISCraftRecipeInfoBox | P04 |
| T11 | Use held/required input quantities with units. | ISWidgetInput | P04 |
| T12 | Distinguish kept tools from consumed inputs. | ISWidgetInput | P04 |
| T13 | Show a known sharpness/condition failure, not just tool name. | recipes_leather_prep.txt flags | P04 |
| T14 | Expose supported ingredient alternatives without hiding current stock. | ISWidgetTooltipInput | P04 |
| T15 | Make fluid amounts use liters or the world's clear unit. | ISWidgetInput | P04 |
| T16 | Keep pause cause beside progress rather than in a log. | DryingCraftLogic.doProgressTooltip | P01 |
| T17 | Name wetness and cold independently when both stop work. | DryingCraftLogic.doProgressTooltip | P01 |
| T18 | Show current rate and its unit. | DryingCraftLogic.getDryingFactor | P01 |
| T19 | Show output capacity reserved by pending work. | CraftLogic.getFreeOutputSlotCount | P01 |
| T20 | Change a job's appearance at meaningful progress states. | CraftLogic.updateSpriteOverlay | CH |
| T21 | Offer a real batch size within current held stock. | DryBasil variable input | CH |
| T22 | Label active work and unattended stages differently. | ISHandcraftAction / DryingCraftLogic | CH |
| T23 | Name the affected body part in a work-time explanation. | ISBaseTimedAction.adjustMaxTime | BD |
| T24 | Explain incompatible pending content without inventing output. | CraftRecipeData.load | P01 |
