# Observed system inventory

Build 25097075. SHOWN locations and counts, unless labeled inferred. This is exhaustive for the retained named-helper and text-file catalogs, not proof that every unnamed subsystem in main has been decoded. Rows with inventory-only coverage are **undocumented implementation**, even if their menu name appeared in a prior report. A successful decompile is also distinct from an all-path mechanic read.

## System families

| ID / subsystem | Where it lives | Size signal | Prior documentation / current result |
|---|---|---|---|
| I01 kingdom/faction identity | KingdomGenerator, FactionNameGenerator, Data/FactionName.txt | 378 physical table rows; selected resolver has 154 forms | Prior generation/name digests; combined flags partial |
| I02 race traits and effects | RaceGenerator, SetRaceEffects, race pools | 101 base rows, 379 suffix rows | Prior native generation reads; stacking partial |
| I03 typed/generated names | Name, NameMaker, NameWriter, Data/Names | 50 validated aliases; suffix 3,528 rows | Prior REA resolver trace; lifecycle partial |
| I04 portrait/flag/currency/crown/building/weapon/phrase | Named generators and matching tables | Helpers in catalog below | Generation call composition documented; most individual grammars undocumented |
| I05 hero/mercenary/adventurer background | HeroBackground, MercGenerator, AdventurerGenerator | HeroStory 286; mercenary 333 content rows, 337 physical | Hero selection and retained stories documented; adventurer resolver undocumented |
| I06 contextual conversations | main, Drunk, local helpers, Talk.txt pools | 33 pools / 2,630 lines | Prior census only; now native path index, exact caller gates partial |
| I07 advice | Advice, Data/Advice.txt | 265 tagged rows | Previously undocumented; now eligibility/redraw/clear traced |
| I08 jokes, insults and entertainment | Jest, ArenaInsults, GnomeInsults, Ruffian; EntertainMe/Bard | 855 combined physical rows in those four pools | Prior inventory; selection/effects mostly undocumented |
| I09 petitions and reactions | main, RandomTurnEvent, Reaction | 120 turn candidate slots; ten reaction contexts | Prior dispatch and one petition traced; full branching partial |
| I10 exploration and discovered sites | RandomExploreEvent, ProcGenExplo, CityExploreEvent, TripOut, main | ProcGen 24 slots / 19 family targets | Prior selected dispatch; city/site chains undocumented |
| I11 quest composition | QuestGenerator, Data/QuestItem.txt | 718 item rows, 96 place slots, conditional 77 noun slots, 50 giver slots | Previously undocumented; now tuple resolver traced, objective consumers unread |
| I12 calendar/annual reports | RefreshPhase, CombatPhase, EnemyCombatPhase, TurnReport, main | Year increment plus named phases | Prior selected report/dispatch; now bounded phase order and initial seeding |
| I13 treasury/harvest/wages/tax/trade/tribute/bank | TurnReport, main, policy globals | Selected harvest and soldier wage formulas | Prior arithmetic and menu loops; whole economy partial |
| I14 recruitment/training/delegation | AutoRecruit, RecruitMaster, ChampionHire, Recruiters/main | 3 selected AutoRecruit transfer branches | Prior selected trace; manual markets and training undocumented |
| I15 deployment/battles/raids/siege/assassins | BattleSim, BattleDamage, BattleTroopReturn, Raid/Invade/Skirmish/Assassin | 3 ordinary damage boundaries traced | Prior casualty/return/mercenary setup; round/event/army model partial |
| I16 arena/champions/tournaments/bets | Arena, BattleEvents, Tournament, ChampionChallenge | Arena win/draw/settlement branches | Prior selected arena; tournament/champion/full events undocumented |
| I17 monsters/pit/trainer | MonsterMaker/Viewer/Fight/Leveller, Data/monsters.txt | 105 rows in 3 categories; 3 saved slots | Previously undocumented; now assembly/leveling/one gate traced; fight/trainer effects partial |
| I18 initial faction relations/truces | GenerateRelations, RelationRand, Data/Relations.txt | Writer: 14 rows x 15 values, 196 random cells | Previously undocumented; now initialization/truce writes traced; consumer mapping unread |
| I19 diplomacy/opponent choices | DiplomacyRelation, IndieDiplo, EnemyCombatPhase, main | 3 named routes, many main branches | Prior menu observations; actual action model undocumented |
| I20 staff/council/nobility | FiredStaff, CouncilMeet, LordGenerator, companion rosters | Five nobility companion paths | Prior roster/save paths; decisions and roster schemas undocumented |
| I21 goblin/bandit communities | GoblinClan, GoblinGenerator, BanditGenerator, related helpers | Native catalog and talk pools | Prior generation calls; community action rules undocumented |
| I22 local tribes/camps/travelers | NomadCamp, ProtofolkTribe, TravDuneWarriors/Reavers | Separate native helpers plus talk pools | Prior inventory; local policy/economy chains undocumented |
| I23 black market | main, BlackMarketPreBattle/Graphic, BlackmarketTalk | 212 talk rows | Prior menu/pool inventory; transaction model undocumented |
| I24 dice/brawling/drinking | DiceGame, FreeBrawl, BrawlPit, DrinkingComp, Drunk | 5 primary named helpers | Inventory only; scoring and rewards undocumented |
| I25 children, tutor and local characters | KidsHideout, Tutoricroll, ClarenceTheSlaver, ElykDrunk, main | 4 named helpers plus Ruffian pool | Inventory only; local consequences undocumented |
| I26 ceremonies/celebrations/throne | CelebratoryCeremony, CelebrateComment, ThroneRoomReplica/Graphic | Named helpers and Year path celebration flag | Inventory only; transaction/closure mostly undocumented |
| I27 menu/difficulty/confirmation | MainMenu, DifficultyChoice, Choice/Choice2, AreYouSure | 5 helpers | Inventory only; onboarding sequence undocumented |
| I28 information and art | KingdomStatsBar, CurrentGoldBar, KingdomReport, TroopCountReport, graphic/color helpers | Native catalog below | Source presentation observations; full surfaces undocumented |
| I29 audio and display controls | SoundEffects, RestartThemeMusic, DeathSounds, Ascii/SoundMute | Selected monster display branches | Now quiet level feedback traced; full audio/settings unread |
| I30 saving/loading/deleting | SaveGame, LoadGame, DeleteSave; companion paths | 1,903 writes; 1,454 numeric reader joins | Prior detailed schema; string/migration/companion lifecycle partial |
| I31 authored Extras and start data | Extras helper, Extras/*.txt | 38 text files | Prior inventory; full semantics undocumented |
| I32 endgame/time expiry/last battle | GameOver, TimesUp, LastBattle, graphics | Named helpers | Inventory only; endings/meta-loop undocumented |

## Complete named-helper catalog

143 retained game helper symbols. Addresses use the preferred PE image base, not a live process. Byte counts are spans to the next symbol and must not be read as execution cost. The naming filter can omit overloads/parameterized routines; main is separately documented above. Coverage is keyed to the prior digests and current bounded reads.

| Native helper | VA | Next-symbol span, bytes | Implementation coverage |
|---|---|---:|---|
| `_Z6Extrasv` | `0x140700267` | 226328 | **Undocumented**, inventory only |
| `_Z7Coloursv` | `0x14073767f` | 1768 | **Undocumented**, inventory only |
| `_Z6Choicev` | `0x140737d67` | 216 | **Undocumented**, inventory only |
| `_Z7Choice2v` | `0x140737e3f` | 280 | **Undocumented**, inventory only |
| `_Z8MainMenuv` | `0x140737f57` | 191136 | **Undocumented**, inventory only |
| `_Z10DeleteSavev` | `0x1407669f7` | 1903 | **Undocumented**, inventory only |
| `_Z8LoadGamev` | `0x140767166` | 166556 | Prior selected trace, partial |
| `_Z8SaveGamev` | `0x14078fc02` | 79895 | Prior selected trace, partial |
| `_Z11Preparationv` | `0x1407a3419` | 80807 | **Undocumented**, inventory only |
| `_Z5Arenav` | `0x1407b6fc0` | 54971 | Prior selected trace, partial |
| `_Z12ChampionHirev` | `0x1407c467b` | 97747 | **Undocumented**, inventory only |
| `_Z4Raidv` | `0x1407dc44e` | 34090 | **Undocumented**, inventory only |
| `_Z6Invadev` | `0x1407e4978` | 140796 | **Undocumented**, inventory only |
| `_Z8Skirmishv` | `0x140806f74` | 25610 | **Undocumented**, inventory only |
| `_Z8Assassinv` | `0x14080d37e` | 14701 | **Undocumented**, inventory only |
| `_Z13BattleGraphicv` | `0x140810ceb` | 13983 | **Undocumented**, inventory only |
| `_Z9BattleSimv` | `0x14081438a` | 540329 | Prior selected trace, partial |
| `_Z16ClearBattleUnitsv` | `0x140898233` | 547 | **Undocumented**, inventory only |
| `_Z12BattleDamagev` | `0x140898456` | 50348 | Prior selected trace, partial |
| `_Z10BattlePrepv` | `0x1408a4902` | 9255 | **Undocumented**, inventory only |
| `_Z17BattleTroopReturnv` | `0x1408a6d29` | 13124 | Prior selected trace, partial |
| `_Z6Battlev` | `0x1408aa06d` | 75821 | **Undocumented**, inventory only |
| `_Z10LastBattlev` | `0x1408bc89a` | 5070 | **Undocumented**, inventory only |
| `_Z9eSkirmishv` | `0x1408bdc68` | 1699 | **Undocumented**, inventory only |
| `_Z4Namev` | `0x1408be30b` | 7056 | Prior selected trace, partial |
| `_Z9QuickStatv` | `0x1408bfe9b` | 208 | **Undocumented**, inventory only |
| `_Z10ArenaTitlev` | `0x1408bff6b` | 5469 | **Undocumented**, inventory only |
| `_Z20FactionNameGeneratorv` | `0x1408c14c8` | 26506 | Prior selected trace, partial |
| `_Z13RaceGeneratorv` | `0x1408c7c52` | 18000 | Prior selected trace, partial |
| `_Z17ChampionChallengev` | `0x1408cc2a2` | 602 | **Undocumented**, inventory only |
| `_Z11WarriorTypev` | `0x1408cc4fc` | 361 | **Undocumented**, inventory only |
| `_Z15RandomTurnEventv` | `0x1408cc665` | 106964 | Prior selected trace, partial |
| `_Z13MercGeneratorv` | `0x1408e6839` | 10098 | Prior selected trace, partial |
| `_Z12BattleEventsv` | `0x1408e8fab` | 59530 | **Undocumented**, inventory only |
| `_Z10GoblinClanv` | `0x1408f7835` | 2256 | **Undocumented**, inventory only |
| `_Z8BrawlPitv` | `0x1408f8105` | 43105 | **Undocumented**, inventory only |
| `_Z15BrawlPitGraphicv` | `0x140902966` | 2493 | **Undocumented**, inventory only |
| `_Z17ThickbloodGraphicv` | `0x140903323` | 6126 | **Undocumented**, inventory only |
| `_Z21AnimalFightPitGraphicv` | `0x140904b11` | 1021 | **Undocumented**, inventory only |
| `_Z18BlackMarketGraphicv` | `0x140904f0e` | 10353 | **Undocumented**, inventory only |
| `_Z14CouncilGraphicv` | `0x14090777f` | 2334 | **Undocumented**, inventory only |
| `_Z18RandomExploreEventv` | `0x14090809d` | 76374 | Prior selected trace, partial |
| `_Z18GrandChampionDeathv` | `0x14091aaf3` | 5166 | **Undocumented**, inventory only |
| `_Z13FlagGeneratorv` | `0x14091bf21` | 3298 | **Undocumented**, inventory only |
| `_Z16KingdomGeneratorv` | `0x14091cc03` | 19587 | Prior selected trace, partial |
| `_Z13FaceGeneratorv` | `0x140921886` | 27959 | **Undocumented**, inventory only |
| `_Z15GoblinGeneratorv` | `0x1409285bd` | 2686 | **Undocumented**, inventory only |
| `_Z15PhraseGeneratorv` | `0x14092903b` | 9173 | **Undocumented**, inventory only |
| `_Z15BanditGeneratorv` | `0x14092b410` | 2504 | **Undocumented**, inventory only |
| `_Z17CurrencyGeneratorv` | `0x14092bdd8` | 2738 | **Undocumented**, inventory only |
| `_Z10TurnReportv` | `0x14092c88a` | 917337 | Prior selected trace, partial |
| `_Z16DifficultyChoicev` | `0x140a0c7e3` | 19321 | **Undocumented**, inventory only |
| `_Z12RefreshPhasev` | `0x140a1135c` | 33041 | **Undocumented**, inventory only |
| `_Z11CombatPhasev` | `0x140a1946d` | 90120 | **Undocumented**, inventory only |
| `_Z11ResetColourv` | `0x140a2f475` | 30 | **Undocumented**, inventory only |
| `_Z12RandomColourv` | `0x140a2f493` | 69 | **Undocumented**, inventory only |
| `_Z16EnemyCombatPhasev` | `0x140a2f4d8` | 44010 | **Undocumented**, inventory only |
| `_Z10ColourTestv` | `0x140a3a0c2` | 214 | **Undocumented**, inventory only |
| `_Z9SplitLinev` | `0x140a3a198` | 124 | **Undocumented**, inventory only |
| `_Z12RelationRandv` | `0x140a3a214` | 412 | New selected trace, partial lifecycle |
| `_Z15WeaponGeneratorv` | `0x140a3a3b0` | 6371 | **Undocumented**, inventory only |
| `_Z8GameOverv` | `0x140a3bc93` | 6346 | **Undocumented**, inventory only |
| `_Z17DiplomacyRelationv` | `0x140a3d55d` | 9925 | **Undocumented**, inventory only |
| `_Z9NameMakerv` | `0x140a3fc22` | 2931 | Prior selected trace, partial |
| `_Z10NameWriterv` | `0x140a40795` | 1392 | Prior selected trace, partial |
| `_Z10RaceColourv` | `0x140a40d05` | 458 | **Undocumented**, inventory only |
| `_Z16KingdomBuildingsv` | `0x140a40ecf` | 184425 | **Undocumented**, inventory only |
| `_Z13TileGeneratorv` | `0x140a6df38` | 765 | **Undocumented**, inventory only |
| `_Z13LordGeneratorv` | `0x140a6e235` | 18291 | **Undocumented**, inventory only |
| `_Z13RandomHundredv` | `0x140a729a8` | 106 | **Undocumented**, inventory only |
| `_Z14CrownGeneratorv` | `0x140a72a12` | 511 | **Undocumented**, inventory only |
| `_Z4Bardv` | `0x140a72c11` | 42779 | **Undocumented**, inventory only |
| `_Z8TestBardv` | `0x140a7d32c` | 2939 | **Undocumented**, inventory only |
| `_Z17RestartThemeMusicv` | `0x140a7dea7` | 269 | **Undocumented**, inventory only |
| `_Z11DeathSoundsv` | `0x140a7dfb4` | 3673 | **Undocumented**, inventory only |
| `_Z19AdventurerGeneratorv` | `0x140a7ee0d` | 35615 | **Undocumented**, inventory only |
| `_Z9NomadCampv` | `0x140a8792c` | 45207 | **Undocumented**, inventory only |
| `_Z19CelebratoryCeremonyv` | `0x140a929c3` | 24379 | **Undocumented**, inventory only |
| `_Z16CelebrateCommentv` | `0x140a988fe` | 33037 | **Undocumented**, inventory only |
| `_Z11EntertainMev` | `0x140aa0a0b` | 114714 | **Undocumented**, inventory only |
| `_Z14GuardStatementv` | `0x140abca25` | 4096 | **Undocumented**, inventory only |
| `_Z17ThroneRoomReplicav` | `0x140abda25` | 12408 | **Undocumented**, inventory only |
| `_Z20BlackMarketPreBattlev` | `0x140ac0a9d` | 20019 | **Undocumented**, inventory only |
| `_Z14FarmerTypeRandv` | `0x140ac58d0` | 2903 | **Undocumented**, inventory only |
| `_Z17GenerateRelationsv` | `0x140ac6427` | 11852 | New selected trace, partial lifecycle |
| `_Z14HeroBackgroundv` | `0x140ac9273` | 371 | Prior selected trace, partial |
| `_Z4Helmv` | `0x140ac93e6` | 687 | **Undocumented**, inventory only |
| `_Z16CityExploreEventv` | `0x140ac9695` | 30390 | **Undocumented**, inventory only |
| `_Z7TripOutv` | `0x140ad0d4b` | 23443 | **Undocumented**, inventory only |
| `_Z11KidsHideoutv` | `0x140ad68de` | 4704 | **Undocumented**, inventory only |
| `_Z14QuestGeneratorv` | `0x140ad7b3e` | 7926 | New selected trace, partial lifecycle |
| `_Z12ArenaGraphicv` | `0x140ad9a34` | 8192 | **Undocumented**, inventory only |
| `_Z11SecretPlacev` | `0x140adba34` | 76315 | **Undocumented**, inventory only |
| `_Z15KingdomStatsBarv` | `0x140aee44f` | 2454 | **Undocumented**, inventory only |
| `_Z9FreeBrawlv` | `0x140aeede5` | 28642 | **Undocumented**, inventory only |
| `_Z6Advicev` | `0x140af5dc7` | 637 | New selected trace, partial lifecycle |
| `_Z8DiceGamev` | `0x140af6044` | 79607 | **Undocumented**, inventory only |
| `_Z17ThroneRoomGraphicv` | `0x140b0973b` | 18784 | **Undocumented**, inventory only |
| `_Z12MonsterMakerv` | `0x140b0e09b` | 2194 | New selected trace, partial lifecycle |
| `_Z13MonsterViewerv` | `0x140b0e92d` | 14088 | **Undocumented**, inventory only |
| `_Z12MonsterFightv` | `0x140b12035` | 42636 | **Undocumented**, inventory only |
| `_Z15MonsterLevellerv` | `0x140b1c6c1` | 1694 | New selected trace, partial lifecycle |
| `_Z8Reactionv` | `0x140b1cd5f` | 94713 | Prior selected trace, partial |
| `_Z12SoundEffectsv` | `0x140b33f58` | 10897 | **Undocumented**, inventory only |
| `_Z11FactionRankv` | `0x140b369e9` | 20823 | **Undocumented**, inventory only |
| `_Z14YourMenTrackerv` | `0x140b3bb40` | 218 | **Undocumented**, inventory only |
| `_Z14SetRaceEffectsv` | `0x140b3bc1a` | 3571 | Prior selected trace, partial |
| `_Z10Tournamentv` | `0x140b3ca0d` | 180225 | **Undocumented**, inventory only |
| `_Z20GenerateGoblinSlaverv` | `0x140b68a0e` | 599 | **Undocumented**, inventory only |
| `_Z5Drunkv` | `0x140b68c65` | 71527 | **Undocumented**, inventory only |
| `_Z10FiredStaffv` | `0x140b7a3cc` | 3410 | **Undocumented**, inventory only |
| `_Z14CurrentGoldBarv` | `0x140b7b11e` | 503 | **Undocumented**, inventory only |
| `_Z10IndieDiplov` | `0x140b7b315` | 145529 | **Undocumented**, inventory only |
| `_Z19BanditBodyGeneratorv` | `0x140b9eb8e` | 2550 | **Undocumented**, inventory only |
| `_Z11Tutoricrollv` | `0x140b9f584` | 48883 | **Undocumented**, inventory only |
| `_Z19ChampionColourCheckv` | `0x140bab477` | 210 | **Undocumented**, inventory only |
| `_Z17RuinedLandGraphicv` | `0x140bab549` | 1484 | **Undocumented**, inventory only |
| `_Z14NewLandGraphicv` | `0x140babb15` | 6692 | **Undocumented**, inventory only |
| `_Z13KingdomReportv` | `0x140bad539` | 49978 | **Undocumented**, inventory only |
| `_Z14TimesUpGraphicv` | `0x140bb9873` | 8043 | **Undocumented**, inventory only |
| `_Z12MinerGraphicv` | `0x140bbb7de` | 2419 | **Undocumented**, inventory only |
| `_Z7TimesUpv` | `0x140bbc151` | 59177 | **Undocumented**, inventory only |
| `_Z14ProtofolkTribev` | `0x140bca87a` | 41889 | **Undocumented**, inventory only |
| `_Z18BattleWeatherImagev` | `0x140bd4c1b` | 29199 | **Undocumented**, inventory only |
| `_Z11ArenaTesterv` | `0x140bdbe2a` | 1486 | **Undocumented**, inventory only |
| `_Z16TroopCountReportv` | `0x140bdc3f8` | 19718 | **Undocumented**, inventory only |
| `_Z9ElykDrunkv` | `0x140be10fe` | 19075 | **Undocumented**, inventory only |
| `_Z10AreYouSurev` | `0x140be5b81` | 2789 | **Undocumented**, inventory only |
| `_Z17ClarenceTheSlaverv` | `0x140be6666` | 9737 | **Undocumented**, inventory only |
| `_Z16TravDuneWarriorsv` | `0x140be8c6f` | 1913 | **Undocumented**, inventory only |
| `_Z15TravDuneReaversv` | `0x140be93e8` | 4829 | **Undocumented**, inventory only |
| `_Z13RecruitMasterv` | `0x140bea6c5` | 84123 | **Undocumented**, inventory only |
| `_Z20ArenaChallengeChoicev` | `0x140bfef60` | 4428 | **Undocumented**, inventory only |
| `_Z12ProcGenExplov` | `0x140c000ac` | 538835 | Prior selected trace, partial |
| `_Z13RandChampHirev` | `0x140c8397f` | 2616 | **Undocumented**, inventory only |
| `_Z22GraphicForProcGenExplov` | `0x140c843b7` | 12058 | **Undocumented**, inventory only |
| `_Z21PostBattleOpinionLossv` | `0x140c872d1` | 1819 | **Undocumented**, inventory only |
| `_Z7FemFacev` | `0x140c879ec` | 1335 | **Undocumented**, inventory only |
| `_Z12DrinkingCompv` | `0x140c87f23` | 43558 | **Undocumented**, inventory only |
| `_Z14TrapDoorImpactv` | `0x140c92949` | 18220 | **Undocumented**, inventory only |
| `_Z11CouncilMeetv` | `0x140c97075` | 119970 | **Undocumented**, inventory only |
| `_Z11AutoRecruitv` | `0x140cb4517` | 67194 | Prior selected trace, partial |
| `_Z16CustomArenaFightv` | `0x140cc4b91` | 11211 | **Undocumented**, inventory only |

## Complete text-file catalog

255 entries reused from the prior inventory: 217 Data and 38 Extras. Physical row counts do not equal records, choices or valid combinations. Twenty-seven mutable/settings files are not recaptured; their row sizes are withheld here. Extras metadata is reused rather than reread. Capture means full private retention, not full semantic decoding. Native reference maps and the 38-pool dialogue index are separate evidence.

| File | Physical rows | Bytes | Coverage / retention |
|---|---:|---:|---|
| `Data/Adventurers.txt` | withheld | withheld | Excluded mutable/settings data; prior path only |
| `Data/Advice.txt` | 265 | 28560 | Private captured; semantics partial |
| `Data/Animals.txt` | 267 | 23726 | Private captured; semantics partial |
| `Data/ArasukTalk.txt` | 70 | 5549 | Private captured; semantics partial |
| `Data/ArenaInsults.txt` | 138 | 5114 | Private captured; semantics partial |
| `Data/ArenaTalk.txt` | 41 | 3956 | Private captured; semantics partial |
| `Data/ArtifactTalk.txt` | 41 | 4568 | Private captured; semantics partial |
| `Data/BaiaaTalk.txt` | 46 | 3821 | Private captured; semantics partial |
| `Data/BanditBody/BanditBody_01.txt` | 20 | 147 | Private captured; semantics partial |
| `Data/BanditBody/BanditBody_02.txt` | 14 | 110 | Private captured; semantics partial |
| `Data/BanditBody/BanditBody_03.txt` | 25 | 219 | Private captured; semantics partial |
| `Data/BanditBody/BanditBody_04.txt` | 15 | 133 | Private captured; semantics partial |
| `Data/BanditBody/BanditBody_05.txt` | 45 | 609 | Private captured; semantics partial |
| `Data/BanditBody/BanditBody_06.txt` | 12 | 94 | Private captured; semantics partial |
| `Data/BanditBody/BanditBody_07.txt` | 4 | 32 | Private captured; semantics partial |
| `Data/BanditTalk.txt` | 41 | 3652 | Private captured; semantics partial |
| `Data/BardTalk.txt` | 50 | 3357 | Private captured; semantics partial |
| `Data/BlackmarketTalk.txt` | 212 | 15811 | Private captured; semantics partial |
| `Data/BrawlTalk.txt` | 154 | 13026 | Private captured; semantics partial |
| `Data/Crowns.txt` | 258 | 3448 | Private captured; semantics partial |
| `Data/Currency.txt` | 186 | 1794 | Private captured; semantics partial |
| `Data/CurrencyArt.txt` | 663 | 7254 | Private captured; semantics partial |
| `Data/DarkdaleGuardTalk.txt` | 28 | 2322 | Private captured; semantics partial |
| `Data/DuneHoldTalk.txt` | 35 | 2190 | Private captured; semantics partial |
| `Data/DunewarriorTalk.txt` | 18 | 1398 | Private captured; semantics partial |
| `Data/Faces/Face0.txt` | 4126 | 89756 | Private captured; semantics partial |
| `Data/Faces/Face1.txt` | 1925 | 39843 | Private captured; semantics partial |
| `Data/Faces/Face2.txt` | 3064 | 62597 | Private captured; semantics partial |
| `Data/Faces/Face3.txt` | 1652 | 34001 | Private captured; semantics partial |
| `Data/Faces/Face4.txt` | 1529 | 31403 | Private captured; semantics partial |
| `Data/Faces/Face5.txt` | 2303 | 48118 | Private captured; semantics partial |
| `Data/Faces/Face6.txt` | 2009 | 41393 | Private captured; semantics partial |
| `Data/FactionName.txt` | 378 | 4432 | Private captured; semantics partial |
| `Data/Flag.txt` | 344 | 7566 | Private captured; semantics partial |
| `Data/Flags.txt` | 520 | 11771 | Private captured; semantics partial |
| `Data/GnomeInsults.txt` | 378 | 16548 | Private captured; semantics partial |
| `Data/GoblinwoodDrummerTalk.txt` | 26 | 1900 | Private captured; semantics partial |
| `Data/GoblinwoodPrisonerTalk.txt` | 28 | 1408 | Private captured; semantics partial |
| `Data/GorthmekTalk.txt` | 70 | 5124 | Private captured; semantics partial |
| `Data/Graveyard.txt` | 8 | 150 | Private captured; semantics partial |
| `Data/Helm.txt` | 155 | 2174 | Private captured; semantics partial |
| `Data/HeroStory.txt` | 286 | 47953 | Private captured; semantics partial |
| `Data/Jest.txt` | 290 | 28249 | Private captured; semantics partial |
| `Data/JestersSocietyTalk.txt` | 23 | 1500 | Private captured; semantics partial |
| `Data/Kid Name Suffix.txt` | 53 | 739 | Private captured; semantics partial |
| `Data/KingdomNames.txt` | 1185 | 10798 | Private captured; semantics partial |
| `Data/LadyNames.txt` | 286 | 2448 | Private captured; semantics partial |
| `Data/LeafburnerTalk.txt` | 18 | 1155 | Private captured; semantics partial |
| `Data/LoveCultistTalk.txt` | 19 | 1992 | Private captured; semantics partial |
| `Data/LoveTalk.txt` | 41 | 2292 | Private captured; semantics partial |
| `Data/MageTalk.txt` | 38 | 1958 | Private captured; semantics partial |
| `Data/MercenaryStory.txt` | 337 | 31374 | Private captured; semantics partial |
| `Data/MineTalk.txt` | 41 | 3057 | Private captured; semantics partial |
| `Data/Music/Music Credits.txt` | 26 | 600 | Private captured; semantics partial |
| `Data/Name Suffix Addons.txt` | 644 | 8808 | Private captured; semantics partial |
| `Data/Name Suffix.txt` | 3528 | 70049 | Private captured; semantics partial |
| `Data/Name Type.txt` | 75 | 707 | Private captured; semantics partial |
| `Data/Names/1_NamingSystem.txt` | withheld | withheld | Excluded mutable/settings data; prior path only |
| `Data/Names/2_NamingSystem.txt` | withheld | withheld | Excluded mutable/settings data; prior path only |
| `Data/Names/3_NamingSystem.txt` | withheld | withheld | Excluded mutable/settings data; prior path only |
| `Data/Names/4_NamingSystem.txt` | withheld | withheld | Excluded mutable/settings data; prior path only |
| `Data/Names/5_NamingSystem.txt` | withheld | withheld | Excluded mutable/settings data; prior path only |
| `Data/Names/Abominations Names.txt` | 61 | 655 | Private captured; semantics partial |
| `Data/Names/Aeromancers Names.txt` | 2 | 21 | Private captured; semantics partial |
| `Data/Names/Aquamancers Names.txt` | 2 | 21 | Private captured; semantics partial |
| `Data/Names/Asshthaki Names.txt` | 81 | 1004 | Private captured; semantics partial |
| `Data/Names/Auramancers Names.txt` | 2 | 21 | Private captured; semantics partial |
| `Data/Names/Blogroki Names.txt` | 120 | 1791 | Private captured; semantics partial |
| `Data/Names/Bloodlings Names.txt` | 2 | 27 | Private captured; semantics partial |
| `Data/Names/Bogyemen Names.txt` | 2 | 24 | Private captured; semantics partial |
| `Data/Names/Cannibals Names.txt` | 2 | 29 | Private captured; semantics partial |
| `Data/Names/Centaars Names.txt` | 132 | 1543 | Private captured; semantics partial |
| `Data/Names/Centaurs Names.txt` | 2 | 26 | Private captured; semantics partial |
| `Data/Names/Corpselords Names.txt` | 2 | 24 | Private captured; semantics partial |
| `Data/Names/Cthuul Names.txt` | 93 | 1241 | Private captured; semantics partial |
| `Data/Names/Cyclops Names.txt` | 1552 | 18546 | Private captured; semantics partial |
| `Data/Names/Demigods Names.txt` | 65 | 683 | Private captured; semantics partial |
| `Data/Names/Demons Names.txt` | 135 | 1526 | Private captured; semantics partial |
| `Data/Names/Draconians Names.txt` | 171 | 2323 | Private captured; semantics partial |
| `Data/Names/Druids Names.txt` | 2 | 21 | Private captured; semantics partial |
| `Data/Names/Dryads Names.txt` | 60 | 683 | Private captured; semantics partial |
| `Data/Names/Dwarves Names.txt` | 678 | 6950 | Private captured; semantics partial |
| `Data/Names/Elders Names.txt` | 2 | 21 | Private captured; semantics partial |
| `Data/Names/Elves Names.txt` | 2 | 21 | Private captured; semantics partial |
| `Data/Names/Ents Names.txt` | 294 | 3940 | Private captured; semantics partial |
| `Data/Names/Essfanti Names.txt` | 2 | 27 | Private captured; semantics partial |
| `Data/Names/Faun Names.txt` | 2 | 21 | Private captured; semantics partial |
| `Data/Names/Fiends Names.txt` | 101 | 1128 | Private captured; semantics partial |
| `Data/Names/Folk Names.txt` | 2 | 21 | Private captured; semantics partial |
| `Data/Names/Fungus Folk Names.txt` | 2 | 32 | Private captured; semantics partial |
| `Data/Names/Ghosts Names.txt` | 2 | 21 | Private captured; semantics partial |
| `Data/Names/Ghouls Names.txt` | 85 | 1173 | Private captured; semantics partial |
| `Data/Names/Giants Names.txt` | 65 | 690 | Private captured; semantics partial |
| `Data/Names/Gillghouls Names.txt` | 2 | 24 | Private captured; semantics partial |
| `Data/Names/Gnolls Names.txt` | 33 | 317 | Private captured; semantics partial |
| `Data/Names/Gnomes Names.txt` | 179 | 1854 | Private captured; semantics partial |
| `Data/Names/Goblins Names.txt` | 210 | 1969 | Private captured; semantics partial |
| `Data/Names/Godlings Names.txt` | 57 | 391 | Private captured; semantics partial |
| `Data/Names/Gogs Names.txt` | 46 | 446 | Private captured; semantics partial |
| `Data/Names/Golems Names.txt` | 54 | 492 | Private captured; semantics partial |
| `Data/Names/Gremlins Names.txt` | 2 | 25 | Private captured; semantics partial |
| `Data/Names/Grumpkin Names.txt` | 58 | 520 | Private captured; semantics partial |
| `Data/Names/Half-Demons Names.txt` | 2 | 26 | Private captured; semantics partial |
| `Data/Names/Half-Giants Names.txt` | 2 | 24 | Private captured; semantics partial |
| `Data/Names/Halflings Names.txt` | 2 | 21 | Private captured; semantics partial |
| `Data/Names/Harpies Names.txt` | 2 | 21 | Private captured; semantics partial |
| `Data/Names/Hobgoblins Names.txt` | 2 | 25 | Private captured; semantics partial |
| `Data/Names/Homunculi Names.txt` | 2 | 29 | Private captured; semantics partial |
| `Data/Names/Hydromancers Names.txt` | 2 | 21 | Private captured; semantics partial |
| `Data/Names/Implings Names.txt` | 2 | 22 | Private captured; semantics partial |
| `Data/Names/Imps Names.txt` | 133 | 1235 | Private captured; semantics partial |
| `Data/Names/Kappas Names.txt` | 2 | 24 | Private captured; semantics partial |
| `Data/Names/Kobolds Names.txt` | 73 | 764 | Private captured; semantics partial |
| `Data/Names/Lavamancers Names.txt` | 2 | 21 | Private captured; semantics partial |
| `Data/Names/Liches Names.txt` | 204 | 2459 | Private captured; semantics partial |
| `Data/Names/Lizardmen Names.txt` | 2 | 25 | Private captured; semantics partial |
| `Data/Names/Magi Names.txt` | 55 | 655 | Private captured; semantics partial |
| `Data/Names/Magogs Names.txt` | 2 | 22 | Private captured; semantics partial |
| `Data/Names/Men Names.txt` | 1799 | 17995 | Private captured; semantics partial |
| `Data/Names/Mermen Names.txt` | 84 | 865 | Private captured; semantics partial |
| `Data/Names/Minotaars Names.txt` | 2 | 27 | Private captured; semantics partial |
| `Data/Names/Minotaurs Names.txt` | 140 | 1473 | Private captured; semantics partial |
| `Data/Names/Mushroom Men Names.txt` | 54 | 682 | Private captured; semantics partial |
| `Data/Names/Mutants Names.txt` | 2 | 21 | Private captured; semantics partial |
| `Data/Names/Naga Names.txt` | 2 | 24 | Private captured; semantics partial |
| `Data/Names/Necromancers Names.txt` | 2 | 21 | Private captured; semantics partial |
| `Data/Names/Ogres Names.txt` | 49 | 475 | Private captured; semantics partial |
| `Data/Names/Oracles Names.txt` | 2 | 21 | Private captured; semantics partial |
| `Data/Names/Orclings Names.txt` | 2 | 22 | Private captured; semantics partial |
| `Data/Names/Orcs Names.txt` | 554 | 6464 | Private captured; semantics partial |
| `Data/Names/Orks Names.txt` | 130 | 1558 | Private captured; semantics partial |
| `Data/Names/People Names.txt` | 2 | 23 | Private captured; semantics partial |
| `Data/Names/Protofolk Names.txt` | 95 | 830 | Private captured; semantics partial |
| `Data/Names/Psions Names.txt` | 84 | 922 | Private captured; semantics partial |
| `Data/Names/Pyromancers Names.txt` | 2 | 21 | Private captured; semantics partial |
| `Data/Names/Satyrs Names.txt` | 2 | 24 | Private captured; semantics partial |
| `Data/Names/Shades Names.txt` | 2 | 26 | Private captured; semantics partial |
| `Data/Names/Skeeroks Names.txt` | 48 | 522 | Private captured; semantics partial |
| `Data/Names/Snotlings Names.txt` | 2 | 25 | Private captured; semantics partial |
| `Data/Names/Sorcerers Names.txt` | 2 | 25 | Private captured; semantics partial |
| `Data/Names/Terramancers Names.txt` | 2 | 21 | Private captured; semantics partial |
| `Data/Names/Treemen Names.txt` | 2 | 22 | Private captured; semantics partial |
| `Data/Names/Tritons Names.txt` | 2 | 24 | Private captured; semantics partial |
| `Data/Names/Troglodytes Names.txt` | 2 | 22 | Private captured; semantics partial |
| `Data/Names/Trolls Names.txt` | 73 | 740 | Private captured; semantics partial |
| `Data/Names/Trows Names.txt` | 2 | 22 | Private captured; semantics partial |
| `Data/Names/Underlings Names.txt` | 31 | 337 | Private captured; semantics partial |
| `Data/Names/Vampires Names.txt` | 124 | 1327 | Private captured; semantics partial |
| `Data/Names/Warlocks Names.txt` | 2 | 25 | Private captured; semantics partial |
| `Data/Names/Witches Names.txt` | 44 | 455 | Private captured; semantics partial |
| `Data/Names/Wizards Names.txt` | 2 | 21 | Private captured; semantics partial |
| `Data/Names/Zombies Names.txt` | 2 | 21 | Private captured; semantics partial |
| `Data/NobilityFive.txt` | withheld | withheld | Excluded mutable/settings data; prior path only |
| `Data/NobilityFour.txt` | withheld | withheld | Excluded mutable/settings data; prior path only |
| `Data/NobilityOne.txt` | withheld | withheld | Excluded mutable/settings data; prior path only |
| `Data/NobilityThree.txt` | withheld | withheld | Excluded mutable/settings data; prior path only |
| `Data/NobilityTwo.txt` | withheld | withheld | Excluded mutable/settings data; prior path only |
| `Data/NomadTalk.txt` | 64 | 4986 | Private captured; semantics partial |
| `Data/NorthwatchTalk.txt` | 11 | 686 | Private captured; semantics partial |
| `Data/PrisonTalk.txt` | 51 | 2873 | Private captured; semantics partial |
| `Data/ProtoTalk.txt` | 79 | 2234 | Private captured; semantics partial |
| `Data/QuestItem.txt` | 718 | 25737 | Private captured; semantics partial |
| `Data/Race Faces.txt` | 90 | 1082 | Private captured; semantics partial |
| `Data/RacePacks.txt` | 16 | 744 | Private captured; semantics partial |
| `Data/RacePacks/Creature Races (procedurally generated beast races).txt` | 10 | 1257 | Private captured; semantics partial |
| `Data/RacePacks/Elder Scrolls (please don't sue me bethesda).txt` | 6 | 1017 | Private captured; semantics partial |
| `Data/RacePacks/Everything (All of the races in warsim).txt` | 101 | 18203 | Private captured; semantics partial |
| `Data/RacePacks/Everything but Wizard Races (no wizard races).txt` | 87 | 15511 | Private captured; semantics partial |
| `Data/RacePacks/Greek Mythology (Races like Cyclopes and Minotaurs).txt` | 14 | 2423 | Private captured; semantics partial |
| `Data/RacePacks/Halloween (Spooky races).txt` | 11 | 1899 | Private captured; semantics partial |
| `Data/RacePacks/Humans Only (only human races).txt` | 6 | 876 | Private captured; semantics partial |
| `Data/RacePacks/Insignificant Mortal (only typically strong races).txt` | 14 | 2696 | Private captured; semantics partial |
| `Data/RacePacks/No Creature Races (everything but creature races).txt` | 91 | 16944 | Private captured; semantics partial |
| `Data/RacePacks/Orcs Goblins and Green Things (just green things).txt` | 19 | 3387 | Private captured; semantics partial |
| `Data/RacePacks/Tolkien-like races (orcs, elves, dwarves, goblins and so on).txt` | 11 | 1951 | Private captured; semantics partial |
| `Data/RacePacks/Typically Civil (races that are usually civilised).txt` | 46 | 8071 | Private captured; semantics partial |
| `Data/RacePacks/Typically Savage (for a world of savages).txt` | 36 | 7033 | Private captured; semantics partial |
| `Data/RacePacks/Undead Races Only (for a ghoulish world).txt` | 10 | 1906 | Private captured; semantics partial |
| `Data/RacePacks/Warsim Originals (races that were invented for warsim).txt` | 23 | 3914 | Private captured; semantics partial |
| `Data/RacePacks/Wizard Races (only wizard-like races).txt` | 15 | 2886 | Private captured; semantics partial |
| `Data/RaceSuffix.txt` | 379 | 32721 | Private captured; semantics partial |
| `Data/RaceType.txt` | 101 | 18203 | Private captured; semantics partial |
| `Data/Relations.txt` | withheld | withheld | Excluded mutable/settings data; prior path only |
| `Data/Roof.txt` | 303 | 4240 | Private captured; semantics partial |
| `Data/RosesOrderTalk.txt` | 33 | 3339 | Private captured; semantics partial |
| `Data/Ruffian.txt` | 49 | 2648 | Private captured; semantics partial |
| `Data/Saved Faces/Asvan.txt` | withheld | withheld | Excluded mutable/settings data; prior path only |
| `Data/Saved Faces/Brutus.txt` | withheld | withheld | Excluded mutable/settings data; prior path only |
| `Data/Saved Faces/Dibble.txt` | withheld | withheld | Excluded mutable/settings data; prior path only |
| `Data/Saved Faces/Faraduun.txt` | withheld | withheld | Excluded mutable/settings data; prior path only |
| `Data/Saved Faces/Garold.txt` | withheld | withheld | Excluded mutable/settings data; prior path only |
| `Data/Saved Faces/Karnakk.txt` | withheld | withheld | Excluded mutable/settings data; prior path only |
| `Data/Saved Faces/Morotis.txt` | withheld | withheld | Excluded mutable/settings data; prior path only |
| `Data/Saved Faces/Mutant.txt` | withheld | withheld | Excluded mutable/settings data; prior path only |
| `Data/Saved Faces/Ysaktic.txt` | withheld | withheld | Excluded mutable/settings data; prior path only |
| `Data/ScorpTalk.txt` | 35 | 2618 | Private captured; semantics partial |
| `Data/Settings/Animation.txt` | withheld | withheld | Excluded mutable/settings data; prior path only |
| `Data/Settings/Ascii.txt` | withheld | withheld | Excluded mutable/settings data; prior path only |
| `Data/Settings/Autosave.txt` | withheld | withheld | Excluded mutable/settings data; prior path only |
| `Data/Settings/MainTheme.txt` | withheld | withheld | Excluded mutable/settings data; prior path only |
| `Data/Settings/Music.txt` | withheld | withheld | Excluded mutable/settings data; prior path only |
| `Data/Settings/Sound.txt` | withheld | withheld | Excluded mutable/settings data; prior path only |
| `Data/SewerTalk.txt` | 122 | 6656 | Private captured; semantics partial |
| `Data/ShaianTalk.txt` | 69 | 6523 | Private captured; semantics partial |
| `Data/SlaverTalk.txt` | 61 | 5304 | Private captured; semantics partial |
| `Data/SlumPitTalk.txt` | 23 | 1710 | Private captured; semantics partial |
| `Data/SnowfolkTalk.txt` | 32 | 2414 | Private captured; semantics partial |
| `Data/TavernTalk.txt` | 883 | 75001 | Private captured; semantics partial |
| `Data/Tiles.txt` | 335 | 13398 | Private captured; semantics partial |
| `Data/VillageTalk.txt` | 127 | 7595 | Private captured; semantics partial |
| `Data/WarriorType.txt` | 524 | 6179 | Private captured; semantics partial |
| `Data/Weapons/Blade.txt` | 51 | 627 | Private captured; semantics partial |
| `Data/Weapons/Guard.txt` | 46 | 632 | Private captured; semantics partial |
| `Data/Weapons/Handle.txt` | 11 | 99 | Private captured; semantics partial |
| `Data/Weapons/Pommel.txt` | 13 | 115 | Private captured; semantics partial |
| `Data/Weapons/Tip.txt` | 15 | 340 | Private captured; semantics partial |
| `Data/monsters.txt` | 105 | 16444 | Private captured; semantics partial |
| `Extras/Ascii Art Text Files/Ascii Helmet Concepts.txt` | 39 | 691 | Prior metadata only; semantics unread |
| `Extras/Ascii Art Text Files/Beasts.txt` | 31 | 421 | Prior metadata only; semantics unread |
| `Extras/Ascii Art Text Files/Blogroki Concept Notes.txt` | 60 | 789 | Prior metadata only; semantics unread |
| `Extras/Ascii Art Text Files/Commander Nerrad Ascii Art.txt` | 21 | 527 | Prior metadata only; semantics unread |
| `Extras/Ascii Art Text Files/Concept Helmets.txt` | 63 | 894 | Prior metadata only; semantics unread |
| `Extras/Ascii Art Text Files/Don't read me.txt` | 18 | 563 | Prior metadata only; semantics unread |
| `Extras/Ascii Art Text Files/Essfanti Samples.txt` | 32 | 780 | Prior metadata only; semantics unread |
| `Extras/Ascii Art Text Files/Gillghoul Concepts.txt` | 25 | 465 | Prior metadata only; semantics unread |
| `Extras/Ascii Art Text Files/Gnome Family.txt` | 22 | 607 | Prior metadata only; semantics unread |
| `Extras/Ascii Art Text Files/Goblin Heroes.txt` | 77 | 1048 | Prior metadata only; semantics unread |
| `Extras/Ascii Art Text Files/Golem.txt` | 7 | 98 | Prior metadata only; semantics unread |
| `Extras/Ascii Art Text Files/Halfling Concepts.txt` | 81 | 932 | Prior metadata only; semantics unread |
| `Extras/Ascii Art Text Files/Korgoth.txt` | 10 | 331 | Prior metadata only; semantics unread |
| `Extras/Ascii Art Text Files/Masked Face Concepts.txt` | 23 | 342 | Prior metadata only; semantics unread |
| `Extras/Ascii Art Text Files/Monster Concepts.txt` | 69 | 1253 | Prior metadata only; semantics unread |
| `Extras/Ascii Art Text Files/Need a hand.txt` | 21 | 308 | Prior metadata only; semantics unread |
| `Extras/Ascii Art Text Files/Ogre and Dwarf Face Generation Logs and Notes.txt` | 62 | 3084 | Prior metadata only; semantics unread |
| `Extras/Ascii Art Text Files/Old Grumpkin Faces.txt` | 159 | 1916 | Prior metadata only; semantics unread |
| `Extras/Ascii Art Text Files/Ooolak.txt` | 28 | 673 | Prior metadata only; semantics unread |
| `Extras/Ascii Art Text Files/Orc Concept Faces.txt` | 101 | 1655 | Prior metadata only; semantics unread |
| `Extras/Ascii Art Text Files/Orc Ears.txt` | 31 | 128 | Prior metadata only; semantics unread |
| `Extras/Ascii Art Text Files/Proc gen bandit concept notes.txt` | 48 | 596 | Prior metadata only; semantics unread |
| `Extras/Ascii Art Text Files/Protofolk concepts.txt` | 33 | 366 | Prior metadata only; semantics unread |
| `Extras/Ascii Art Text Files/Sample Satyrs.txt` | 65 | 1101 | Prior metadata only; semantics unread |
| `Extras/Ascii Art Text Files/The Great Coastal Wind.txt` | 27 | 718 | Prior metadata only; semantics unread |
| `Extras/Ascii Art Text Files/Warsim Ascii stuff.txt` | 28 | 445 | Prior metadata only; semantics unread |
| `Extras/Ascii Art Text Files/WeaponOutlines.txt` | 173 | 1565 | Prior metadata only; semantics unread |
| `Extras/Ascii Art Text Files/cthul attempts.txt` | 45 | 707 | Prior metadata only; semantics unread |
| `Extras/Centaars.txt` | 20 | 1027 | Prior metadata only; semantics unread |
| `Extras/Warsim Cheat List.txt` | 116 | 5027 | Prior metadata only; semantics unread |
| `Extras/Warsim Faces/Old Golems/GolemFaces0.txt` | 11 | 217 | Prior metadata only; semantics unread |
| `Extras/Warsim Faces/Old Golems/GolemFaces1.txt` | 9 | 178 | Prior metadata only; semantics unread |
| `Extras/Warsim Faces/Old Golems/GolemFaces2.txt` | 19 | 378 | Prior metadata only; semantics unread |
| `Extras/Warsim Faces/Old Golems/GolemFaces3.txt` | 9 | 177 | Prior metadata only; semantics unread |
| `Extras/Warsim Faces/Old Golems/GolemFaces4.txt` | 5 | 98 | Prior metadata only; semantics unread |
| `Extras/Warsim Faces/Old Golems/GolemFaces5.txt` | 9 | 178 | Prior metadata only; semantics unread |
| `Extras/Warsim Faces/Old Golems/GolemFaces6.txt` | 10 | 198 | Prior metadata only; semantics unread |
| `Extras/Warsim Faces/Old Golems/Old Golems Readme.txt` | 16 | 974 | Prior metadata only; semantics unread |

Sources: [prior generation](../GENERATION_DIGEST.md), [content](../CONTENT_AND_SCOPE_DIGEST.md), [prior REA checkpoint](../pass-2026-10-14-rea/CHECKPOINT.md), [private index](PRIVATE_REFERENCE_INDEX.md).
