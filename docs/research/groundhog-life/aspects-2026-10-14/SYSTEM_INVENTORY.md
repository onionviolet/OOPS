# Groundhog Life: system inventory

Scope: every distinct family located in the available source snapshot, followed by a complete mechanical locator appendix. Inventory is not semantic reading of every row. Missing executables/unseen builds cannot be exhaustively inventoried. NEW means undocumented at this depth in the inspected prior dossiers.

| System/subsystem | Where | Size signal | Prior/new coverage |
|---|---|---|---|
| Entity/dependency/lock framework | v1 L270-350;v2 exports appendix | state/update/locks/registries | prior/new architecture |
| Daily schedule/free-time budget | prior REPORT F2 | 1440min/day;v2 exercise | prior |
| Career/pay/investment | prior REPORT F4/F5 | 3 ladders;geometric progression | prior |
| Research/books/reading queue | prior REPORT F6;later queue digest | 4 v1 fields;later goals | prior |
| Homes/helpers/upkeep/austerity | prior REPORT F4 | 10 v1 homes | prior |
| Happiness/modifier explanations | prior REPORT F3;v2 L5470 onward | 4 v1 contributions | prior/new static detail |
| Health/food/exercise/habit trend | v2 L5435-5470,L5557-5585 | EMA saved scalar plus modifiers | NEW deeper read |
| Events/paths/journal/log/history | v1 L1910-2050;v2 L4900-4973 | factory/entity appendix | NEW dialogue read |
| Boosts/automation/queue | later digest | notify/pause/act caveats | prior |
| Achievements/groups | later digest | 31 later achievements;7 groups | prior |
| Life/reset/skill carry | prior REPORT F1/F7 | per-skill best/ordinary reset | prior |
| Loop Trap efficiency/war | later digest | per-skill multiplier;defense waves | prior |
| Save/entity reconstruction | v1 L3500-3563;v2 L2890-2958 | version0.4.0 vs0.6.0 | NEW deeper read |
| Time/catch-up/banking/Turbo | prior/later reports | 300ms v1;1/10 later bank | prior |
| UI panes/shortcuts/settings | v2 L1196-1210,L5737-5780 | exports and entities appendix | NEW shortcut read |
| Market/subscription remnants | later source/prior report | presence is not working access | partial prior;no account |

Top three by payoff are detailed in [DEEPER_SYSTEMS.md](DEEPER_SYSTEMS.md). Appendix rows marked inventory-only require semantic reading before adopting behavior.

## v1 complete named export groups

These are mechanical webpack export groups, not a promise of complete module-body review. Generated UI and unnamed helpers remain in the private snapshot.

| Start line | Span signal | Named exports |
|---|---|---|
| 35 | 236 lines to next named group | createCompletedOrReadingListLock, createCompletedLock, createLevelLockChain, createLevelLock, createSelectedLock, createTrueStateLock, createMinimumValueLock, createPredicateLock, createAnyLock, createCustomLock, createUnlockedLock, Locks, Lock |
| 271 | 116 lines to next named group | BasicEntity |
| 387 | 204 lines to next named group | LevelAddMultModifier, LevelAddModifier, LevelModifier, NumberStateModifier, StatEffectiveMultModifier, GenericMultModifier, MultModifier, NumberStateAddModifier, StatEffectiveAddModifier, GenericAddModifier, AddModifier, Modifier |
| 591 | 24 lines to next named group | isNumber, isNear, assert |
| 615 | 126 lines to next named group | NumberStateEntity, BooleanStateEntity, StateEntity |
| 741 | 105 lines to next named group | Stat |
| 846 | 55 lines to next named group | currentYear, currentDay |
| 901 | 75 lines to next named group | Area |
| 976 | 136 lines to next named group | activities, freeTime, slacking, chores, eat, research, work, sleep |
| 1112 | 74 lines to next named group | selectPane, panes, journalPane, lifeSummaryPane, logPane, achievementPane, amazonPane, privacyPane, aboutPane, settingsPane, eventPane, lifestylePane, happinessPane, boostsPane, housingPane, spendingPane, researchPane, readingPane, jobPane, topLevelPanes |
| 1186 | 43 lines to next named group | createResearchXpPerHourStat, baseResearchXpPerHourStat, createWorkXpPerHourStat, baseWorkXpPerHourStat |
| 1229 | 60 lines to next named group | energyStat |
| 1289 | 36 lines to next named group | communicationVictory, cannonVictory, anomalyAverted, fastestCannonVictory, fastestCommunicationVictory, aaCounter, unlockedDarkPlateau |
| 1325 | 68 lines to next named group | studyPoints, money |
| 1393 | 63 lines to next named group | currentLoop, currentLifeThisLoop, currentLife |
| 1456 | 64 lines to next named group | Book |
| 1520 | 179 lines to next named group | configureXpProgression, XPModule, linearXpIncrease, linearExponentialXpIncrease |
| 1699 | 57 lines to next named group | currentJobContainer, currentIncomeContainer |
| 1756 | 28 lines to next named group | yugle, yugleCeo, cto, productManager, divisionLead, seniorArchitect, teamLead, projectLead, softwareEngineer, juniorDeveloper, unpaidIntern |
| 1784 | 45 lines to next named group | currentHomeContainer |
| 1829 | 45 lines to next named group | log |
| 1874 | 34 lines to next named group | investmentReturnStat, expenseRatioStat, dailyNetIncomeStat, dailyIncomeStat, dailyExpensesStat |
| 1908 | 181 lines to next named group | createEvent, createUserChoiceNode, createAutoChoiceNode, createNode, createPath |
| 2089 | 28 lines to next named group | darkPlateau, darkPlateauCeo, lambdaComplexChief, lambdaComplexScientist, lambdaComplexTrainee, labSupervisor, seniorScientist, scientist, juniorScientist, labAssistant, labCleaner |
| 2117 | 44 lines to next named group | currentResearchContainer |
| 2161 | 45 lines to next named group | Field |
| 2206 | 73 lines to next named group | happinessStat |
| 2279 | 47 lines to next named group | foodCostFactor |
| 2326 | 28 lines to next named group | bunMasters, bunMastersCeo, burgerFlipper |
| 2354 | 73 lines to next named group | Career |
| 2427 | 83 lines to next named group | JobState, Job |
| 2510 | 44 lines to next named group | programming, programming5, programming4, programming3, programming2, programming1 |
| 2554 | 126 lines to next named group | readingList |
| 2680 | 91 lines to next named group | homes, parentsBasement |
| 2771 | 75 lines to next named group | loginWithSavegameId, logPlayerProgression, logCustomEvent, makeid |
| 2846 | 139 lines to next named group | prestiger |
| 2985 | 27 lines to next named group | foodCostsPerDayStat |
| 3012 | 32 lines to next named group | boosts |
| 3044 | 94 lines to next named group | assistants, secretary, researchAssistant, servant, cleaner |
| 3138 | 7 lines to next named group | paused |
| 3145 | 13 lines to next named group | xpPerHour, nightMode, idleMode, pauseOnPrestige |
| 3158 | 59 lines to next named group | selectHome, changeActivityTime, setActiveResearch, setActiveJob, findActiveJob |
| 3217 | 14 lines to next named group | jobs, careers |
| 3231 | 30 lines to next named group | leadership, gungHo, leadership101 |
| 3261 | 15 lines to next named group | areas, fields |
| 3276 | 10 lines to next named group | physics, alienCommunication, constructMirrorCannon, constructPowerPlant, studyMirroredShip, demirrorAnomaly, mirrorMatter, anomaly, dmScanner |
| 3286 | 17 lines to next named group | qm, qm4, qm3, qm2, qm1, qm0 |
| 3303 | 21 lines to next named group | getStuffDone |
| 3324 | 11 lines to next named group | nutrition |
| 3335 | 17 lines to next named group | studySkills |
| 3352 | 37 lines to next named group | messageBox |
| 3389 | 63 lines to next named group | Pane, PaneGroup |
| 3452 | 220 lines to next named group | saver |
| 3672 | 192 lines to next named group | schedule |
| 3864 | 46 lines to next named group | Achievement |
| 3910 | 94 lines to next named group | achievements |
| 4004 | 193 lines to next named group | autoplay, autoplayLifestyle, autoplayActivityDuration, autoplayResearch, autoplayJob, findBestJob |
| 4197 | 71 lines to next named group | Boost |
| 4268 | 59 lines to next named group | anomalyEvent |
| 4327 | 33 lines to next named group | dp |
| 4360 | 10 lines to next named group | events |
| 4370 | 25 lines to next named group | lostWallet |
| 4395 | 45 lines to next named group | groundHogging |
| 4440 | 7 lines to next named group | autoPromote |
| 4447 | 16 lines to next named group | delta |
| 4463 | 25 lines to next named group | playerId |
| 4488 | 9 lines to next named group | business |
| 4497 | 11 lines to next named group | investment |
| 4508 | 17 lines to next named group | alg, alg3, alg2, alg1 |
| 4525 | 12 lines to next named group | compsci |
| 4537 | 20 lines to next named group | se, se5, se4, se3, se2, se1 |
| 4557 | 16 lines to next named group | selfImprovement |
| 4573 | 39 lines to next named group | JobLevelModifier |
| 4612 | 39 lines to next named group | standardEnergyModifier |
| 4651 | 182 lines to next named group | setupGame |
| 4833 | 40 lines to next named group | dailyWorkIncomeStat |
| 4873 | 27 lines to next named group | doubleIncomeAtLevelStat |
| 4900 | 2809 lines to next named group | IncomePerWorkHourStat |

### v1 authored literal entity IDs

Static constructor/factory matches: 251. Dynamic generated IDs are not captured; see private source for their factories. Identifiers only, no prose.

| ID | Kind | Line |
|---|---|---|
| activitySleep | constructor | 1074 |
| activityWork | constructor | 1080 |
| activityStudy | constructor | 1084 |
| activityResearch | constructor | 1091 |
| activityEat | constructor | 1095 |
| activityChores | constructor | 1096 |
| activitySlacking | constructor | 1097 |
| activityFreeTime | constructor | 1098 |
| job-pane | constructor | 1117 |
| reading-pane | constructor | 1118 |
| research-pane | constructor | 1118 |
| spending-pane | constructor | 1120 |
| housing-pane | constructor | 1120 |
| boosts-pane | constructor | 1120 |
| happiness-pane | constructor | 1120 |
| lifestyle-pane | constructor | 1121 |
| event-pane | constructor | 1122 |
| settings-pane | constructor | 1123 |
| about-pane | constructor | 1124 |
| privacy-pane | constructor | 1125 |
| amazon-affiliate | constructor | 1126 |
| achievement-pane | constructor | 1127 |
| log-pane | constructor | 1127 |
| life-summary-pane | constructor | 1127 |
| journal-pane | constructor | 1127 |
| baseWorkXpPerHourStat | constructor | 1206 |
| baseResearchXpPerHourStat | constructor | 1212 |
| happinessEnergyMod | constructor | 1258 |
| unlocked_dark_plateau | constructor | 1301 |
| aa_counter | constructor | 1303 |
| minlivestocommvictory | constructor | 1303 |
| minlivestocannonvictory | constructor | 1303 |
| state_anomalyAverted | constructor | 1314 |
| cannon_victory_counter | constructor | 1314 |
| communication_victory_counter | constructor | 1314 |
| studyPoints | constructor | 1382 |
| yugle1 | constructor | 1761 |
| yugle2 | constructor | 1762 |
| yugle3 | constructor | 1763 |
| yugle4 | constructor | 1764 |
| yugle5 | constructor | 1765 |
| yugle6 | constructor | 1766 |
| yugle7 | constructor | 1767 |
| yugle8 | constructor | 1768 |
| yugle9 | constructor | 1769 |
| yugle10 | constructor | 1770 |
| yugle | constructor | 1773 |
| dailyExpensesStat | constructor | 1879 |
| dailyIncomeStat | constructor | 1882 |
| dailyNetIncome | constructor | 1885 |
| expenseRatioStat | constructor | 1891 |
| investmentReturnStat | constructor | 1897 |
| dp1 | constructor | 2094 |
| dp2 | constructor | 2095 |
| dp3 | constructor | 2096 |
| dp4 | constructor | 2097 |
| dp5 | constructor | 2098 |
| dp6 | constructor | 2099 |
| dp7 | constructor | 2100 |
| dp8 | constructor | 2101 |
| dp9 | constructor | 2102 |
| dp10 | constructor | 2103 |
| dark_plateau | constructor | 2106 |
| foodCostFactorStatMod | constructor | 2301 |
| foodCostFactorEnergyMod | constructor | 2303 |
| bm1 | constructor | 2332 |
| bm2 | constructor | 2333 |
| bm3 | constructor | 2334 |
| bm4 | constructor | 2335 |
| bm5 | constructor | 2336 |
| bm6 | constructor | 2337 |
| bm7 | constructor | 2338 |
| bm8 | constructor | 2339 |
| bm9 | constructor | 2340 |
| bunMasters | constructor | 2343 |
| programming1 | constructor | 2518 |
| programming2 | constructor | 2519 |
| programming3 | constructor | 2520 |
| programming4 | constructor | 2521 |
| programming5 | constructor | 2522 |
| area_programming | constructor | 2524 |
| programming_research_level_mod | constructor | 2525 |
| home_parentsBasement | constructor | 2756 |
| home_sharedApartment | constructor | 2757 |
| home_studioApartment | constructor | 2758 |
| home_tinyApartment | constructor | 2759 |
| home_regularApartment | constructor | 2760 |
| home_fancyApartment | constructor | 2761 |
| home_penthouse | constructor | 2762 |
| home_smallHouse | constructor | 2763 |
| home_house | constructor | 2764 |
| home_mansion | constructor | 2765 |
| boost_coffeine | constructor | 3021 |
| coffeine_mod | constructor | 3022 |
| boost_organize | constructor | 3024 |
| boost_organize_mod | constructor | 3025 |
| boost_spa | constructor | 3027 |
| boost_spaMod | constructor | 3028 |
| boost_conference | constructor | 3030 |
| boost_conferenceMod | constructor | 3031 |
| assistant_cleaner | constructor | 3088 |
| cleaner_mod | constructor | 3093 |
| assistant_servant | constructor | 3095 |
| servant_mod | constructor | 3100 |
| assistant_research | constructor | 3119 |
| researchAssistant_mod | constructor | 3124 |
| assistant_secretary | constructor | 3126 |
| secretary_mod | constructor | 3131 |
| state_paused | constructor | 3140 |
| set_pauseOnPrestige | constructor | 3147 |
| set_idleMode | constructor | 3147 |
| state_nightmode | constructor | 3147 |
| show_xpPerHour | constructor | 3147 |
| leadership1 | constructor | 3238 |
| leadership2 | constructor | 3241 |
| leadership3 | constructor | 3243 |
| leadership4 | constructor | 3245 |
| leadership5 | constructor | 3247 |
| area_leadership | constructor | 3249 |
| leadership_research_level_mod | constructor | 3250 |
| area_dmScanner | constructor | 3277 |
| area_investigateAnomaly | constructor | 3277 |
| area_mirrorMatter | constructor | 3277 |
| area_demirror | constructor | 3277 |
| area_studyMirroredShip | constructor | 3277 |
| area_constructPowerPlant | constructor | 3277 |
| area_constructMirrorCannon | constructor | 3277 |
| area_study_alien_com | constructor | 3277 |
| physics | constructor | 3281 |
| qm0 | constructor | 3291 |
| qm1 | constructor | 3292 |
| qm2 | constructor | 3293 |
| qm3 | constructor | 3294 |
| qm4 | constructor | 3295 |
| area_qm | constructor | 3297 |
| gsd1 | constructor | 3311 |
| gsd1_slacking_mod | constructor | 3312 |
| gsd2 | constructor | 3314 |
| gsd2_job_experience_mod | constructor | 3315 |
| gsd3 | constructor | 3316 |
| gsd3_job_experience_mod | constructor | 3317 |
| area_getting_stuff_done | constructor | 3318 |
| gsd_research_level_mod | constructor | 3319 |
| area_nutrition | constructor | 3328 |
| nutrition_research_level_mod | constructor | 3329 |
| area_study_skills | constructor | 3339 |
| study_skills_research_level_mod | constructor | 3340 |
| schedule | constructor | 3824 |
| achievement_edge_of_retirement | constructor | 3918 |
| achievement_samsara | constructor | 3922 |
| achievement_flippin_faster | constructor | 3926 |
| achievement_flippin_fantastic | constructor | 3932 |
| achievement_flipping_livetimes | constructor | 3936 |
| achievement_burgerKing | constructor | 3940 |
| achievement_mayering | constructor | 3944 |
| achievement_happy | constructor | 3950 |
| achievement_miserable | constructor | 3954 |
| achievement_millionaire | constructor | 3960 |
| achievement_billionaire | constructor | 3964 |
| achievement_communication_victory | constructor | 3968 |
| achievement_cannon_victory | constructor | 3972 |
| achievement_speed_communication | constructor | 3976 |
| achievement_speed_cannon | constructor | 3982 |
| achievement_anomalyAverted | constructor | 3991 |
| event_a18 | Node | 4275 |
| event_a_17 | Node | 4279 |
| event_a_16 | Node | 4285 |
| event_a_15 | Node | 4286 |
| a_not_fired | Node | 4287 |
| event_a18_firepower | Node | 4288 |
| a_fired | Node | 4292 |
| event_a_too_late | Node | 4298 |
| event_a_checkfire | AutoChoiceNode | 4302 |
| a_path_dont | Path | 4303 |
| a_path_fire | Path | 4304 |
| event_a13c | Node | 4306 |
| event_a13b | Node | 4307 |
| event_a13 | Node | 4308 |
| event_a12 | Node | 4309 |
| event_a11 | Node | 4310 |
| event_a10 | Node | 4311 |
| event_a9 | Node | 4312 |
| event_a8 | Node | 4313 |
| event_a7 | Node | 4314 |
| event_a5 | Node | 4315 |
| event_a4 | Node | 4316 |
| event_a3 | Node | 4317 |
| event_a2 | Node | 4318 |
| event_a1 | Node | 4319 |
| event_anomaly | Event | 4321 |
| event_dp_success2 | Node | 4335 |
| event_dp_failure | Node | 4338 |
| event_dp_success | Node | 4339 |
| event_dp4 | AutoChoiceNode | 4343 |
| event_dp3 | Node | 4344 |
| event_dp2 | Node | 4345 |
| event_dp1 | Node | 4346 |
| event_dp | Event | 4348 |
| event_lostwallet_inheritance2 | Node | 4375 |
| event_lostwallet_inheritance1 | Node | 4378 |
| event_lostwallet_kept_it | Node | 4379 |
| event_lostwallet_gave_back | Node | 4380 |
| event_path_keeplostWallet | Path | 4381 |
| event_path_giveBacklostwallet | Path | 4382 |
| event_lostwallet2 | Node | 4384 |
| event_lostwallet1 | Node | 4385 |
| event_lostWallet | Event | 4387 |
| event_groundhog_prestige | Node | 4407 |
| replyGroundhog | Path | 4408 |
| event_brokengroundhog_prestige | Node | 4409 |
| brokenreplyGroundhog | Path | 4410 |
| event_brokengroundhog2 | Node | 4412 |
| event_brokengroundhog1 | Node | 4413 |
| event_groundhog2 | Node | 4415 |
| event_groundhog1 | Node | 4416 |
| event_gh_ano | AutoChoiceNode | 4420 |
| groundhogging | Event | 4422 |
| autoPromote | constructor | 4442 |
| schedule_delta | constructor | 4449 |
| business | constructor | 4492 |
| area_investment | constructor | 4501 |
| investment_research_level_mod | constructor | 4502 |
| alg1 | constructor | 4514 |
| alg2 | constructor | 4515 |
| alg3 | constructor | 4516 |
| area_alg | constructor | 4518 |
| alg_research_level_mod | constructor | 4519 |
| compsci | constructor | 4531 |
| se1 | constructor | 4544 |
| se2 | constructor | 4545 |
| se3 | constructor | 4546 |
| se4 | constructor | 4547 |
| se5 | constructor | 4548 |
| area_se | constructor | 4550 |
| se_research_level_mod | constructor | 4551 |
| selfimprovement | constructor | 4562 |
| research_hours_mod | constructor | 4712 |
| work_hours_mod | constructor | 4732 |
| investment_income_per_day_mod | constructor | 4754 |
| happinessFromHomeFactorMod | constructor | 4766 |
| happinessFromSleepHoursMod | constructor | 4780 |
| sleepDeprivation | constructor | 4784 |
| happinessFromExpenseRatioStat | constructor | 4792 |
| expenseRatioHappinessMod | constructor | 4796 |
| happinessFromExpenseRatioMod | constructor | 4798 |
| totalWorkingHours | constructor | 4803 |
| workHoursMod | constructor | 4804 |
| researchHoursMod | constructor | 4805 |
| choresHoursMod | constructor | 4806 |
| happinessFromWorkLifeBalanceMod | constructor | 4808 |
| mod_aacounter_energy | constructor | 4818 |

## v2 complete named export groups

These are mechanical webpack export groups, not a promise of complete module-body review. Generated UI and unnamed helpers remain in the private snapshot.

| Start line | Span signal | Named exports |
|---|---|---|
| 43 | 116 lines to next named group | BasicEntity |
| 159 | 236 lines to next named group | createCompletedOrReadingListLock, createCompletedLock, createLevelLockChain, createLevelLock, createSelectedLock, createTrueStateLock, createMinimumValueLock, createPredicateLock, createAnyLock, createCustomLock, createUnlockedLock, Locks, Lock |
| 395 | 276 lines to next named group | LevelAddMultModifier, GeometricLevelAddModifier, HarmonicLevelAddModifier, LevelAddModifier, LevelModifier, NumberStateModifier, StatEffectiveMultModifier, GenericMultModifier, MultModifier, NumberStateAddModifier, StatEffectiveAddModifier, GenericAddModifier, AddModifier, Modifier |
| 671 | 106 lines to next named group | Stat |
| 777 | 55 lines to next named group | currentYear, currentDay |
| 832 | 24 lines to next named group | isNumber, isNear, assert |
| 856 | 131 lines to next named group | NumberStateEntity, BooleanStateEntity, StateEntity |
| 987 | 134 lines to next named group | activities, freeTime, slacking, chores, exercise, eat, research, work, sleep |
| 1121 | 75 lines to next named group | Area |
| 1196 | 74 lines to next named group | selectPane, panes, journalPane, lifeSummaryPane, logPane, achievementPane, groundhogMarketPane, otherPane, privacyPane, aboutPane, keyBindingsPane, settingsPane, eventPane, lifestylePane, boostsPane, housingPane, healthPane, happinessPane, lambdaPane, loopTrapPane, warPane, lambdaPanes, labPane, queuePane, researchPane, labPanes, readingPane, jobPane, topLevelPanes |
| 1270 | 62 lines to next named group | currentJobContainer, currentIncomeContainer |
| 1332 | 43 lines to next named group | createResearchXpPerHourStat, baseResearchXpPerHourStat, createWorkXpPerHourStat, baseWorkXpPerHourStat, XpPerHourStat |
| 1375 | 43 lines to next named group | messageBox |
| 1418 | 44 lines to next named group | studyPoints, money |
| 1462 | 60 lines to next named group | currentLoop, currentLifeThisLoop, currentLife |
| 1522 | 28 lines to next named group | yugle, yugleCeo, cto, productManager, divisionLead, seniorArchitect, teamLead, projectLead, softwareEngineer, juniorDeveloper, unpaidIntern |
| 1550 | 26 lines to next named group | Book |
| 1576 | 31 lines to next named group | physics, loopTrapResearch, laserGun, studyMirroredShip, demirrorAnomaly, mirrorMatter, anomaly, dmScanner |
| 1607 | 38 lines to next named group | energyStat |
| 1645 | 38 lines to next named group | investmentReturnStat, expenseRatioStat, dailyNetIncomeStat, dailyIncomeStat, dailyExpensesStat |
| 1683 | 177 lines to next named group | configureXpProgression, XPModule, linearXpIncrease, linearExponentialXpIncrease |
| 1860 | 28 lines to next named group | darkPlateau, darkPlateauCeo, lambdaComplexChief, lambdaComplexScientist, lambdaComplexTrainee, labSupervisor, seniorScientist, scientist, juniorScientist, labAssistant, labCleaner |
| 1888 | 45 lines to next named group | currentHomeContainer |
| 1933 | 105 lines to next named group | homes, homeToHappinessFun, parentsBasement |
| 2038 | 115 lines to next named group | selectFoodOption, foodOptions, molecularCooking, yugleCampus, fastFood, studentCuisine, foodQualityStat, foodCostsPerDayStat |
| 2153 | 171 lines to next named group | battle |
| 2324 | 179 lines to next named group | createEvent, createUserChoiceNode, createAutoChoiceNode, createNode, createPath |
| 2503 | 13 lines to next named group | darkMatterTicks, lastSave, bonusTicks, turbo, paused |
| 2516 | 44 lines to next named group | programming, programming5, programming4, programming3, programming2, programming1 |
| 2560 | 44 lines to next named group | currentResearchContainer |
| 2604 | 45 lines to next named group | Field |
| 2649 | 51 lines to next named group | log |
| 2700 | 142 lines to next named group | prestiger |
| 2842 | 225 lines to next named group | saver |
| 3067 | 73 lines to next named group | happinessStat |
| 3140 | 39 lines to next named group | loopTrap |
| 3179 | 59 lines to next named group | selectHome, changeActivityTime, setActiveResearch, setActiveJob, findActiveJob |
| 3238 | 98 lines to next named group | Career, SecretProject |
| 3336 | 80 lines to next named group | JobState, Job |
| 3416 | 21 lines to next named group | areas, fields |
| 3437 | 37 lines to next named group | healthStat |
| 3474 | 168 lines to next named group | achievements |
| 3642 | 26 lines to next named group | boosts |
| 3668 | 31 lines to next named group | lostWallet, keep |
| 3699 | 110 lines to next named group | assistants, secretary, researchAssistant, servant, cleaner |
| 3809 | 14 lines to next named group | autoBoostStack, autoBoostJustPause, autoBoostExclConference, autoBoost, autoResearchJustPause, autoResearch, autoPromoteJustPause, autoPromoteMinLevel, autoPromote |
| 3823 | 7 lines to next named group | minimalism, shadyDoctor |
| 3830 | 7 lines to next named group | playSounds, xpPerHour, nightMode, idleMode, pauseOnPrestige |
| 3837 | 28 lines to next named group | bunMasters, bunMastersCeo, burgerFlipper |
| 3865 | 20 lines to next named group | jobs, careers |
| 3885 | 40 lines to next named group | investment |
| 3925 | 24 lines to next named group | leadership, gungHo, leadership101 |
| 3949 | 17 lines to next named group | alg, alg3, alg2, alg1 |
| 3966 | 12 lines to next named group | compsci |
| 3978 | 20 lines to next named group | se, se5, se4, se3, se2, se1 |
| 3998 | 17 lines to next named group | qm, qm4, qm3, qm2, qm1, qm0 |
| 4015 | 21 lines to next named group | getStuffDone |
| 4036 | 11 lines to next named group | nutrition |
| 4047 | 17 lines to next named group | studySkills |
| 4064 | 63 lines to next named group | Pane, PaneGroup |
| 4127 | 164 lines to next named group | schedule |
| 4291 | 147 lines to next named group | userInventory |
| 4438 | 116 lines to next named group | AG, Achievement |
| 4554 | 244 lines to next named group | autoplay, autoplayLifestyle, autoplayActivityDuration, autoplayResearch, autoPromoteFun, autoplayJob, autoBoostFun, findBestJob |
| 4798 | 71 lines to next named group | Boost |
| 4869 | 25 lines to next named group | anomalyEvent |
| 4894 | 33 lines to next named group | dp |
| 4927 | 10 lines to next named group | events |
| 4937 | 54 lines to next named group | groundHogging, prestigeAction |
| 4991 | 8 lines to next named group | unlockedDarkPlateau |
| 4999 | 16 lines to next named group | delta |
| 5015 | 24 lines to next named group | keyBindings |
| 5039 | 15 lines to next named group | business |
| 5054 | 135 lines to next named group | researchQueue |
| 5189 | 16 lines to next named group | selfImprovement |
| 5205 | 39 lines to next named group | JobLevelModifier |
| 5244 | 39 lines to next named group | standardEnergyModifier |
| 5283 | 259 lines to next named group | setupGame |
| 5542 | 48 lines to next named group | ExpMovAvg, tenYearAlpha, fiveYearAlpha, oneYearAlpha |
| 5590 | 40 lines to next named group | dailyWorkIncomeStat |
| 5630 | 27 lines to next named group | doubleIncomeAtLevelStat |
| 5657 | 4412 lines to next named group | IncomePerWorkHourStat |

### v2 authored literal entity IDs

Static constructor/factory matches: 299. Dynamic generated IDs are not captured; see private source for their factories. Identifiers only, no prose.

| ID | Kind | Line |
|---|---|---|
| activitySleep | constructor | 1084 |
| activityWork | constructor | 1090 |
| activityResearch | constructor | 1094 |
| activityEat | constructor | 1098 |
| activityExercise | constructor | 1099 |
| activityChores | constructor | 1101 |
| activitySlacking | constructor | 1102 |
| activityFreeTime | constructor | 1103 |
| job-pane | constructor | 1201 |
| reading-pane | constructor | 1202 |
| research-pane | constructor | 1203 |
| queue-pane | constructor | 1203 |
| lab-pane | constructor | 1203 |
| war-pane | constructor | 1205 |
| looptrap-pane | constructor | 1205 |
| lambda-pane | constructor | 1205 |
| happiness-pane | constructor | 1207 |
| health-pane | constructor | 1207 |
| housing-pane | constructor | 1207 |
| boosts-pane | constructor | 1207 |
| lifestyle-pane | constructor | 1207 |
| event-pane | constructor | 1208 |
| settings-pane | constructor | 1210 |
| keybindings-pane | constructor | 1210 |
| about-pane | constructor | 1210 |
| privacy-pane | constructor | 1210 |
| other-pane | constructor | 1210 |
| groundhogmarket-pane | constructor | 1211 |
| achievement-pane | constructor | 1213 |
| log-pane | constructor | 1213 |
| life-summary-pane | constructor | 1213 |
| journal-pane | constructor | 1213 |
| baseWorkXpPerHourStat | constructor | 1352 |
| baseResearchXpPerHourStat | constructor | 1358 |
| studyPoints | constructor | 1451 |
| minLivesToLoopTrap | constructor | 1491 |
| yugle1 | constructor | 1527 |
| yugle2 | constructor | 1528 |
| yugle3 | constructor | 1529 |
| yugle4 | constructor | 1530 |
| yugle5 | constructor | 1531 |
| yugle6 | constructor | 1532 |
| yugle7 | constructor | 1533 |
| yugle8 | constructor | 1534 |
| yugle9 | constructor | 1535 |
| yugle10 | constructor | 1536 |
| yugle | constructor | 1539 |
| area_dmScanner | constructor | 1583 |
| area_investigateAnomaly | constructor | 1584 |
| area_mirrorMatter | constructor | 1585 |
| area_demirror | constructor | 1586 |
| area_studyMirroredShip | constructor | 1587 |
| area_constructPowerPlant | constructor | 1588 |
| area_loopTrap | constructor | 1590 |
| physics | constructor | 1596 |
| happinessEnergyMod | constructor | 1637 |
| healthEnergyMod | constructor | 1639 |
| dailyExpensesStat | constructor | 1650 |
| dailyIncomeStat | constructor | 1653 |
| dailyNetIncome | constructor | 1656 |
| expenseRatioStat | constructor | 1662 |
| investmentReturnStat | constructor | 1668 |
| dp1 | constructor | 1865 |
| dp2 | constructor | 1866 |
| dp3 | constructor | 1867 |
| dp4 | constructor | 1868 |
| dp5 | constructor | 1869 |
| dp6 | constructor | 1870 |
| dp7 | constructor | 1871 |
| dp8 | constructor | 1872 |
| dp9 | constructor | 1873 |
| dp10 | constructor | 1874 |
| dark_plateau | constructor | 1877 |
| home_parentsBasement | constructor | 2011 |
| home_sharedApartment | constructor | 2012 |
| home_studioApartment | constructor | 2013 |
| home_tinyApartment | constructor | 2014 |
| home_regularApartment | constructor | 2015 |
| home_fancyApartment | constructor | 2016 |
| home_penthouse | constructor | 2017 |
| home_smallHouse | constructor | 2018 |
| home_house | constructor | 2019 |
| home_mansion | constructor | 2020 |
| foodCostsPerDayStat | constructor | 2063 |
| foodquality | constructor | 2064 |
| simplecooking | constructor | 2108 |
| fastfood | constructor | 2109 |
| regularcooking | constructor | 2110 |
| yuglecampus | constructor | 2111 |
| fancycooking | constructor | 2112 |
| personalChef | constructor | 2113 |
| threestarcook | constructor | 2114 |
| molecularCooking | constructor | 2115 |
| laserGunDamage | constructor | 2204 |
| lg_dmg_mod | constructor | 2205 |
| state_paused | constructor | 2505 |
| state_turbo | constructor | 2505 |
| state_bonus_ticks | constructor | 2505 |
| state_last_save | constructor | 2505 |
| state_dmticks | constructor | 2505 |
| programming1 | constructor | 2524 |
| programming2 | constructor | 2525 |
| programming3 | constructor | 2526 |
| programming4 | constructor | 2527 |
| programming5 | constructor | 2528 |
| area_programming | constructor | 2530 |
| programming_research_level_mod | constructor | 2531 |
| lt_efficiency | constructor | 3158 |
| achievement_edge_of_retirement | constructor | 3492 |
| achievement_samsara | constructor | 3496 |
| achievement_sideways8 | constructor | 3500 |
| ach_loop1 | constructor | 3504 |
| ach_loop2 | constructor | 3508 |
| ach_loop3 | constructor | 3512 |
| ag_circle_of_life | constructor | 3516 |
| ach_envy | constructor | 3518 |
| ach_gluttony | constructor | 3522 |
| ach_greed | constructor | 3526 |
| ach_sloth | constructor | 3530 |
| ach_wrath | constructor | 3534 |
| ag_seven_deadly_sins | constructor | 3538 |
| achievement_millionaire | constructor | 3540 |
| achievement_billionaire | constructor | 3544 |
| achievement_trillionaire | constructor | 3548 |
| ag_money | constructor | 3552 |
| achievement_flippin_faster | constructor | 3554 |
| achievement_flippin_fantastic | constructor | 3560 |
| achievement_flipping_livetimes | constructor | 3564 |
| achievement_burgerKing | constructor | 3568 |
| ag_bunmasters | constructor | 3572 |
| achievement_intern_master | constructor | 3574 |
| achievement_butwhy | constructor | 3578 |
| achievement_carmack | constructor | 3582 |
| achievement_donKnuth | constructor | 3586 |
| achievement_linus | constructor | 3590 |
| achievement_mayering | constructor | 3594 |
| ag_yugle | constructor | 3600 |
| achievement_happy | constructor | 3602 |
| achievement_miserable | constructor | 3606 |
| ag_mood | constructor | 3612 |
| achievement_dark_plateau | constructor | 3614 |
| achievement_freeman | constructor | 3618 |
| achievement_not_breen | constructor | 3622 |
| achievement_laser_gun | constructor | 3626 |
| achievement_groundhog_king | constructor | 3630 |
| ag_lambda | constructor | 3636 |
| boost_coffeine | constructor | 3651 |
| coffeine_mod | constructor | 3652 |
| boost_organize | constructor | 3654 |
| boost_organize_mod | constructor | 3655 |
| boost_spa | constructor | 3657 |
| boost_spaMod | constructor | 3658 |
| boost_conference | constructor | 3660 |
| boost_conferenceMod | constructor | 3661 |
| event_lostwallet_inheritance2 | Node | 3673 |
| event_lostwallet_inheritance1 | Node | 3676 |
| event_lostwallet_kept_it | Node | 3677 |
| event_lostwallet_gave_back | Node | 3678 |
| event_path_keeplostWallet | Path | 3679 |
| event_path_giveBacklostwallet | Path | 3680 |
| event_lostwallet2 | Node | 3682 |
| event_lostwallet1 | Node | 3683 |
| event_lostWallet | Event | 3685 |
| assistant_cleaner | constructor | 3743 |
| cleaner_mod | constructor | 3748 |
| assistant_servant | constructor | 3750 |
| servant_mod | constructor | 3755 |
| assistant_research | constructor | 3774 |
| researchAssistant_mod | constructor | 3779 |
| assistant_secretary | constructor | 3783 |
| secretary_mod | constructor | 3788 |
| assistant_ai_research_ | constructor | 3794 |
| aiResearchAssistant_mod_ | constructor | 3799 |
| autoPromote | constructor | 3812 |
| autoPromoteML | constructor | 3814 |
| autoPromoteJustPause | constructor | 3814 |
| autoResearch | constructor | 3814 |
| autoResearchJustPause | constructor | 3816 |
| autoBoost | constructor | 3816 |
| autoBoostExlConf | constructor | 3818 |
| autoBoostJustPause | constructor | 3818 |
| autoBoostStack | constructor | 3818 |
| shady_doctor | constructor | 3825 |
| minimalism | constructor | 3825 |
| set_pauseOnPrestige | constructor | 3832 |
| set_idleMode | constructor | 3832 |
| state_nightmode | constructor | 3832 |
| show_xpPerHour | constructor | 3832 |
| play_sounds | constructor | 3832 |
| bm1 | constructor | 3843 |
| bm2 | constructor | 3844 |
| bm3 | constructor | 3845 |
| bm4 | constructor | 3846 |
| bm5 | constructor | 3847 |
| bm6 | constructor | 3848 |
| bm7 | constructor | 3849 |
| bm8 | constructor | 3850 |
| bm9 | constructor | 3851 |
| bunMasters | constructor | 3854 |
| area_investment | constructor | 3900 |
| investment_research_level_mod | constructor | 3901 |
| inv_eff_upd | constructor | 3919 |
| leadership1 | constructor | 3932 |
| leadership2 | constructor | 3935 |
| leadership3 | constructor | 3937 |
| leadership4 | constructor | 3939 |
| leadership5 | constructor | 3941 |
| area_leadership | constructor | 3943 |
| leadership_research_level_mod | constructor | 3944 |
| alg1 | constructor | 3955 |
| alg2 | constructor | 3956 |
| alg3 | constructor | 3957 |
| area_alg | constructor | 3959 |
| alg_research_level_mod | constructor | 3960 |
| compsci | constructor | 3972 |
| se1 | constructor | 3985 |
| se2 | constructor | 3986 |
| se3 | constructor | 3987 |
| se4 | constructor | 3988 |
| se5 | constructor | 3989 |
| area_se | constructor | 3991 |
| se_research_level_mod | constructor | 3992 |
| qm0 | constructor | 4003 |
| qm1 | constructor | 4004 |
| qm2 | constructor | 4005 |
| qm3 | constructor | 4006 |
| qm4 | constructor | 4007 |
| area_qm | constructor | 4009 |
| gsd1 | constructor | 4023 |
| gsd1_slacking_mod | constructor | 4024 |
| gsd2 | constructor | 4026 |
| gsd2_job_experience_mod | constructor | 4027 |
| gsd3 | constructor | 4028 |
| gsd3_job_experience_mod | constructor | 4029 |
| area_getting_stuff_done | constructor | 4030 |
| gsd_research_level_mod | constructor | 4031 |
| area_nutrition | constructor | 4040 |
| nutrition_research_level_mod | constructor | 4041 |
| area_study_skills | constructor | 4051 |
| study_skills_research_level_mod | constructor | 4052 |
| schedule | constructor | 4280 |
| event_a13b | Node | 4873 |
| event_a13b0 | Node | 4874 |
| event_a13 | Node | 4875 |
| event_a12 | Node | 4876 |
| event_a11 | Node | 4877 |
| event_a10 | Node | 4878 |
| event_a9 | Node | 4879 |
| event_a8 | Node | 4880 |
| event_a7 | Node | 4881 |
| event_a5 | Node | 4882 |
| event_a4 | Node | 4883 |
| event_a3 | Node | 4884 |
| event_a2 | Node | 4885 |
| event_a1 | Node | 4886 |
| event_anomaly | Event | 4888 |
| event_dp_success2 | Node | 4902 |
| event_dp_failure | Node | 4905 |
| event_dp_success | Node | 4906 |
| event_dp4 | AutoChoiceNode | 4910 |
| event_dp3 | Node | 4911 |
| event_dp2 | Node | 4912 |
| event_dp1 | Node | 4913 |
| event_dp | Event | 4915 |
| event_groundhog_prestige | Node | 4957 |
| replyGroundhog | Path | 4958 |
| event_progressgroundhog_prestige | Node | 4959 |
| progressreplyGroundhog | Path | 4960 |
| event_progressgroundhog2 | Node | 4962 |
| event_progressgroundhog1 | Node | 4963 |
| event_groundhog2 | Node | 4965 |
| event_groundhog1 | Node | 4967 |
| event_gh_ano | AutoChoiceNode | 4971 |
| groundhogging | Event | 4973 |
| unlocked_dark_plateau | constructor | 4993 |
| schedule_delta | constructor | 5001 |
| business | constructor | 5043 |
| selfimprovement | constructor | 5194 |
| dmtMod | constructor | 5314 |
| lt_research | constructor | 5320 |
| lt_alientech | constructor | 5324 |
| research_hours_mod | constructor | 5392 |
| work_hours_mod | constructor | 5412 |
| investment_income_per_day_mod | constructor | 5434 |
| health_age | constructor | 5443 |
| avg_sleep | constructor | 5451 |
| sleep_age | constructor | 5456 |
| foodQualityMod | constructor | 5464 |
| happinessFromHomeFactorMod | constructor | 5470 |
| happinessFromSleepHoursMod | constructor | 5486 |
| sleepDeprivation | constructor | 5490 |
| happinessFromExpenseRatioStat | constructor | 5499 |
| expenseRatioHappinessMod | constructor | 5505 |
| happinessFromExpenseRatioMod | constructor | 5507 |
| totalWorkingHours | constructor | 5516 |
| workHoursMod | constructor | 5517 |
| researchHoursMod | constructor | 5518 |
| choresHoursMod | constructor | 5519 |
| happinessFromWorkLifeBalanceMod | constructor | 5521 |
