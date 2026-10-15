# Learning and crafting mechanisms

All findings are shown in installed 42.21 source unless marked inferred. Installed root and local Java map: [REPORT](REPORT.md#evidence-and-saved-depth).

## L1: Books prepare, XP events advance

`media/lua/server/XpSystem/XPSystem_SkillBook.lua` maps each supported skill to a perk and five maxima, 3, 5, 8, 12, 16. `media/lua/shared/TimedActions/ISReadABook.lua` selects by starting trained level 1/3/5/7/9. `checkMultiplier` floors pages read to ten-percent steps and raises the actor's multiplier only if the new value exceeds the current one. Reading updates both item pages and actor pages keyed by full item type. Completion installs the full band multiplier; reading itself has no skill XP award. Too advanced, obsolete and illiterate cases reset progress/stop with separate feedback. No book is consumed to retain the multiplier.

`IsoGameCharacter.XP.addXpMultiplier` stores one entry per perk, not a stack of book bonuses. `XP.AddXP` applies learner/profession modifiers, the book multiplier and sandbox multiplier on the boost path. It removes the retained band when total XP crosses its upper boundary, or drops below its lower boundary. This is not a precision clamp of one award to the book band: the award is applied before the crossing test. Maximum skill XP is clamped to level 10. `XP.load/save` retain multiplier, minimum level and maximum level separately from XP amounts. All are source findings, not runtime verification.

## L2: Magazines learn IDs, not resources

`ISReadABook.complete` records completed recipe literature; `IsoGameCharacter.ReadLiterature` iterates the item's learned-recipe list and calls `learnRecipe`. `knownRecipes` is actor-owned and saved/loaded independently of inventory and reading pages. `learnRecipe` guards existing knowledge and checks meta recipes. Item data in `media/scripts/generated/items/literature.txt` provides learned recipe lists and skill-book parameters. A handwritten/reference item may carry a `modData.learnedRecipe` directly. A book moving away does not invoke unlearning in these inspected paths.

## L3: TV and VHS share the effect-code route

`media/lua/shared/RecordedMedia/ISRecordedMedia.lua` registers IDs and ordered lines, text references, colors and codes from `recorded_media.lua`. `DeviceData` emits `OnDeviceText` with a line GUID and codes. `media/lua/shared/RadioCom/ISRadioInteractions.lua` checks floor/proximity, indoor/outdoor consistency and sleeping, then rejects previously known line GUIDs. It records a new GUID **before** processing codes, so a line heard above the XP cutoff does not automatically become a deferred award later. Codes dispatch either stat changes, a skill grant or `RCP` learning. Per-player, per-code cooldowns suppress closely repeated effects; tick updates decrement them. This is line identity deduplication, not a universal once-per-skill rule.

For skills, `doSkill` requires a positive amount, rejects current level at/above `SandboxVars.LevelForMediaXPCutoff`, then calls `addXp` for 50 times the code amount. Apocalypse declares cutoff 3 in `media/lua/shared/Sandbox/Apocalypse.lua:153`. Other sandbox values can change it. The check is pre-award: a final boosted grant can cross the threshold. `LuaManager.GlobalObject.addXp` calls normal `XP.AddXP` locally, so an active book can amplify media XP. Server dispatch uses `GameServer.addXp`, whose transport was not decompiled here. Recipe codes call `learnRecipe` separately, so media is not only an XP route.

`IsoPlayer.save/load` calls `saveKnownMediaLines/loadKnownMediaLines`. The source mechanism retains encountered lines across save, but a complete disk round trip was not run.

## L4: Knowledge and current feasibility

`IsoGameCharacter.isRecipeKnown(CraftRecipe,true)` ignores the display sandbox override and checks permanent known IDs, meta IDs and translation names, unless debug know-all applies. `CraftRecipeManager.isValidRecipeForCharacter` checks required skill, then true knowledge for recipes that need learning. `CraftRecipeData.canPerform` subsequently tests actual input consumption and output creation in test mode; `perform` rechecks validity before consumption and output creation.

A reference exception is explicit: `CraftRecipe.couldBenefitFromRecipeAtHand` requires an actually known, learn-required recipe, relevant skills no more than one level below requirements and a player actor. `canBenefitFromRecipeAtHand` adds enough light to read; `hasRecipeAtHand` looks through inventory/containers for the recipe or meta recipe. The skill validator accepts this reference path. This supports knowledge plus situational aid without treating possession as permanent learning.

`HandcraftLogic.createCachedRecipeInfo` checks surface range for AnySurfaceCraft. Bench selection binds workstation recipe sets/tags. The UI does not prove legal access or custody title. Inputs use item tags, explicit items, fluid amounts, keep/consume modes and condition flags; e.g. knife sharpness and tool wear remain distinct from owning any knife.

## L5: UI strengths and limits

`ISCraftRecipeInfoBox.createDynamicChildren` shows craft time, surface requirement, light status, learning requirement and learned state. Required skills are colored by the direct skill test. It computes a current-level string but does not pass it into the displayed pair in this build; do not claim the detail panel always shows current versus required skill numerically. The direct skill row also need not explain the reference-at-hand exception. Its literal placeholder row suggests unfinished presentation in this installed version.

`ISWidgetInput` shows held/required amounts, fluid liters, alternatives, keep/consume icons and bad/partial states. `ISWidgetHandCraftControl` disables Craft from cached feasibility and shows progress during an active action. `ISHandcraftAction.start` reconstructs logic and can fail with a debug log; `performCurrentRecipe` rechecks on execution. No unified player-facing blocker object was found in the sampled generic path. All UI conclusions are source-defined, with no screenshot or native interaction proof.
