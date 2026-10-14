# Activity definition read

**Shown:** all 109 record identities, consequence functions, costs and gates were inspected in `activity.service.ts:1316-6647`, using direct reading and a local compact extract that omits presentation strings. This is a logic read, not a complete prose/UI read or a balance simulation. Helper internals in other services remain outside this follow-up.

| ID | Lesson | Locator |
|---|---|---|
| A1 | Trade tiers train both general and craft stats; unpaid modes can keep practice while suppressing wages | 2372-3401 |
| A2 | Senior smith, wood and leather work slowly produce useful crafting tools as side output | 2594-2597, 3048-3051, 3199-3202 |
| A3 | Broad craft experience gates formation work; the highest tier's pay multiplier drops compared with the prior tier | 3250-3401 |
| A4 | Dogs, hunting followers and a cormorant fixture shorten resource-production counters | 3602-3701 |
| A5 | Balance training chooses the weakest lore; soul training chooses weakest lore and basic stat | 3734-3787, 3913-4010 |
| A6 | Body/mind cultivation adds aptitude directly during life; aptitude growth is not solely a rebirth reward | 3789-3866 |
| A7 | Core cultivation is deterministic after a counter, despite description calling it a small chance | 3868-3911 |
| A8 | Refinement joins one focused move, multiple chambers and a skilled helper | 4492-4553 |
| A9 | Rest itself can advance spirituality and contemplation at later tiers | 2127-2262 |
| A10 | Trial projection gives narrow external work and treasure routes while the body is confined | 4587-5533; hell activity allowlists |
| A11 | Mobilize needs a capital, food and money; conquer consumes progressively more army items | 1948-2053 |
| A12 | Divine service jobs exchange specific goods or exertion for patron progress and can train capacity too | 5825-6647 |

**Inferred:** the common daily verb is more useful than a separate minigame for each feature. Preserve actual outputs, helpers, costs, prerequisites and failure causes. Do not carry the source's hunger death, forced daily micromanagement or giant flat thresholds into ordinary YAIRPG play. The existing passive-progression direction remains authoritative.

## Identifier coverage inventory

| Record | Source lines |
|---|---|
| Swim | 1316-1350 |
| ForgeChains | 1351-1386 |
| AttachChains | 1387-1449 |
| MakeBrick | 1450-1483 |
| MakeScaffold | 1484-1519 |
| MakeMortar | 1520-1559 |
| BuildTower | 1560-1645 |
| ResearchWind | 1646-1686 |
| TameWinds | 1687-1741 |
| LearnToFly | 1742-1797 |
| OfferDragonFood | 1798-1842 |
| OfferDragonWealth | 1843-1893 |
| TalkToDragon | 1894-1947 |
| GatherArmies | 1948-2005 |
| ConquerTheNation | 2006-2054 |
| MoveStars | 2055-2091 |
| OddJobs | 2092-2126 |
| Resting | 2127-2263 |
| Begging | 2264-2371 |
| Cooking | 2372-2475 |
| Blacksmithing | 2476-2646 |
| GatherHerbs | 2647-2681 |
| Alchemy | 2682-2823 |
| Merchant | 2824-2908 |
| ChopWood | 2909-2941 |
| Woodworking | 2942-3097 |
| Leatherworking | 3098-3249 |
| FormationCreation | 3250-3402 |
| Plowing | 3403-3440 |
| Clearing | 3441-3478 |
| Farming | 3479-3524 |
| Mining | 3525-3563 |
| Smelting | 3564-3601 |
| Hunting | 3602-3653 |
| Fishing | 3654-3702 |
| Burning | 3703-3733 |
| BalanceChi | 3734-3788 |
| BodyCultivation | 3789-3829 |
| MindCultivation | 3830-3867 |
| CoreCultivation | 3868-3912 |
| SoulCultivation | 3913-4011 |
| InfuseEquipment | 4012-4046 |
| InfuseBody | 4047-4095 |
| ExtendLife | 4096-4140 |
| Recruiting | 4141-4188 |
| TrainingFollowers | 4189-4220 |
| Taunting | 4221-4250 |
| CombatTraining | 4251-4283 |
| PetRecruiting | 4284-4327 |
| PetTraining | 4328-4373 |
| PurifyGems | 4374-4417 |
| ExtractGems | 4418-4451 |
| SynthesizingGems | 4452-4491 |
| RefineTechniques | 4492-4554 |
| ManipulateEnergy | 4555-4586 |
| BurnMoney | 4587-4623 |
| hellRecruiting | 4624-4673 |
| Rehabilitation | 4674-4721 |
| HonorAncestors | 4722-4756 |
| CopperMining | 4757-4788 |
| ForgeHammer | 4789-4840 |
| ClimbMountain | 4841-4883 |
| AttackClimbers | 4884-4906 |
| MeltMountain | 4907-4954 |
| FreezeMountain | 4955-4999 |
| HealAnimals | 5000-5029 |
| LiftBoulder | 5030-5057 |
| HellSwim | 5058-5084 |
| SearchForExit | 5085-5122 |
| TeachTheWay | 5123-5159 |
| Interrogate | 5160-5199 |
| RecoverTreasure | 5200-5244 |
| ReplaceTreasure | 5245-5286 |
| EndureTheMill | 5287-5321 |
| ExamineContracts | 5322-5358 |
| HellOddJobs | 5359-5393 |
| ContemplateFire | 5394-5421 |
| ContemplateWater | 5422-5449 |
| ContemplateEarth | 5450-5477 |
| ContemplateMetal | 5478-5505 |
| ContemplateWood | 5506-5533 |
| escapeHell | 5534-5555 |
| returnToHell | 5556-5576 |
| FinishHell | 5577-5598 |
| PortalToMortalRealm | 5599-5620 |
| PortalToDivineRealm | 5621-5642 |
| PortalToFireRealm | 5643-5664 |
| PortalToEarthRealm | 5665-5686 |
| PortalToWaterRealm | 5687-5708 |
| PortalToMetalRealm | 5709-5730 |
| PortalToWoodRealm | 5731-5752 |
| AvatarPortal | 5753-5777 |
| ReturnToGodhoodPortal | 5778-5800 |
| PortalToPhilosopherStates | 5801-5824 |
| DeliverMessages | 5825-5874 |
| ProvideWine | 5875-5907 |
| MoonlightTracking | 5908-5960 |
| SpaDay | 5961-6045 |
| CraftWithHephaestus | 6046-6155 |
| PullTheSun | 6156-6226 |
| ForgeDivineChains | 6227-6261 |
| SearchForPersephone | 6262-6284 |
| BoardGames | 6285-6320 |
| HuntTyphon | 6321-6369 |
| FishingWithPoseidon | 6370-6422 |
| SpeakWithDemeter | 6423-6492 |
| OfferDemeterWealth | 6493-6566 |
| MineDarklightGems | 6567-6612 |
| UpgradeMenagerie | 6613-6647 |
