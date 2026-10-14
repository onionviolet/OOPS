# Progression digest

2026-10-14, installed Steam build 20773316. SHOWN means values in extracted data, not played behavior. Source root: `~/.codex/research/hogwarts-legacy/extract/base/`. Main database: `Phoenix/Content/SQLiteDB/PhoenixShipData.sqlite` (DB below). Names joined to `Phoenix/Content/Localization/WIN64/MAIN-enUS.bin`; descriptions below are paraphrases. Raw tables remain private.

## XP and levels

SHOWN: `ExperienceActions.ExperienceAction,ExperiencePoints` has 115 actions. Positive challenge-progress awards include main quest 260, side quest 180, homework 150, Merlin trial 80, beast capture 30, breeding 100, duel technique 35 and gear stat upgrade 25. Enemy-specific progress has differing rewards. Many similarly named Progression actions are zero. INFERRED: adding both tables as duplicate XP would be wrong. Exact cessation of XP after a challenge fills requires its consumer.

SHOWN: the full `ExperienceLevels.ExperienceLevel,PointsForNextLevel` sequence follows. It rises monotonically, with a large terminal sentinel. Whether the engine compares cumulative XP rather than subtracting each field is a consumer question, not proven by the column name.

| Level | Stored next-level threshold |
|---|---|
| 1 | 500 |
| 2 | 1030 |
| 3 | 1595 |
| 4 | 2195 |
| 5 | 2835 |
| 6 | 3515 |
| 7 | 4240 |
| 8 | 5015 |
| 9 | 5840 |
| 10 | 6715 |
| 11 | 7650 |
| 12 | 8650 |
| 13 | 9700 |
| 14 | 10825 |
| 15 | 12025 |
| 16 | 13300 |
| 17 | 14660 |
| 18 | 16110 |
| 19 | 17650 |
| 20 | 19290 |
| 21 | 21035 |
| 22 | 22885 |
| 23 | 24865 |
| 24 | 26965 |
| 25 | 29205 |
| 26 | 31590 |
| 27 | 34130 |
| 28 | 36830 |
| 29 | 39710 |
| 30 | 42750 |
| 31 | 46000 |
| 32 | 49500 |
| 33 | 53000 |
| 34 | 56500 |
| 35 | 60000 |
| 36 | 63500 |
| 37 | 67000 |
| 38 | 70500 |
| 39 | 74000 |
| 40 | 99999999 |

## Talent nodes and gates

SHOWN: `PerkDefinition` has 56 rows, 48 with nonnegative UIColumn. The visible split is Core 16, Dark Arts 10, Spells 10, Room of Requirement 8 and Stealth 4. Eight other rows are challenge/internal awards, not another player tree. Level bands are 5, 16 and 22. Each row points at AbilityID, and some also require one or two locks. There is no per-node cost column. The UI calls native PurchasePerk. The bounded native trial supports a one-point cost for the first-purchase branch; level-award cadence remains untraced. See REA_TRIAL.md.

All 48 visible candidates and five other internal rows are listed below. S1 covers the remaining three internal award rows privately; their hidden gate details are withheld. Names come from localization when available; row IDs preserve exact lookup. `hidden/internal` means negative UIColumn, not a claim that runtime code cannot award it.

| Node / lookup ID | Tree | Level | Locks | Placement |
|---|---|---|---|---|
| Storage Expansion I / `GEN_Inventory_1` | ChallengeReward | 0 | none | hidden/internal |
| Storage Expansion II / `GEN_Inventory_2` | ChallengeReward | 0 | none | hidden/internal |
| Storage Expansion III / `GEN_Inventory_3` | ChallengeReward | 0 | none | hidden/internal |
| Storage Expansion IV / `GEN_Inventory_4` | ChallengeReward | 0 | none | hidden/internal |
| Spell Knowledge I / `GEN_SpellLoadouts_1` | Core | 5 | none | visible candidate |
| Spell Knowledge II / `GEN_SpellLoadouts_2` | Core | 5 | none | visible candidate |
| Wiggenweld Potency I / `LOW_WoundCleaningUpgrade1` | Core | 5 | none | visible candidate |
| SKILL Focus Gain / `SKILL_FocusGain` | Core | 5 | `Spell_Protego` | visible candidate |
| Swift / `Talent_Core_DodgeFast` | Core | 5 | none | visible candidate |
| Basic Cast Mastery / `Talent_Core_JinxCooldown` | Core | 5 | none | visible candidate |
| Ancient Magic Throw Expertise / `Talent_Core_OppugnoQuick` | Core | 5 | `Spell_Oppugno` | visible candidate |
| Protego Expertise / `DUEL_Deflect1` | Core | 16 | `Spell_Protego` | visible candidate |
| Spell Knowledge III / `GEN_SpellLoadouts_3` | Core | 16 | none | visible candidate |
| Wiggenweld Potency II / `LOW_WoundCleaningUpgrade2` | Core | 16 | none | visible candidate |
| Evasion Absorption / `Talent_Core_DodgeAM` | Core | 16 | none | visible candidate |
| Basic Cast Airborne Absorption / `Talent_Core_JinxAM` | Core | 16 | none | visible candidate |
| Revelio Mastery / `Talent_Core_RevelioUpgrade` | Core | 16 | none | visible candidate |
| Stupefy Mastery / `Talent_Core_StupefyStun` | Core | 16 | none | visible candidate |
| Protego Mastery / `Talent_Core_ProtegoBlast` | Core | 22 | none | visible candidate |
| Stupefy Expertise / `Talent_Core_StupefyAOE` | Core | 22 | none | visible candidate |
| Blood Curse / `DAC_CurseReflect1` | Dark Arts | 5 | none | visible candidate |
| Stunning Curse / `Talent_Curse_CurseStupefy` | Dark Arts | 5 | none | visible candidate |
| Disarming Curse / `Talent_Spell_Expelliarmus` | Dark Arts | 5 | `Spell_Expelliarmus` | visible candidate |
| Knockback Curse / `Talent_Spell_Flippendo` | Dark Arts | 5 | `Spell_Flipendo` | visible candidate |
| Crucio Mastery / `Talent_Curse_Crucio` | Dark Arts | 16 | `Spell_Crucio` | visible candidate |
| Enduring Curse / `Talent_Curse_CurseLong` | Dark Arts | 16 | none | visible candidate |
| Imperio Mastery / `Talent_Curse_Imperio` | Dark Arts | 16 | `Spell_Imperius` | visible candidate |
| Slowing Curse / `Talent_Spell_Arresto` | Dark Arts | 16 | `Spell_ArrestoMomentum` | visible candidate |
| Avada Kedavra Mastery / `Talent_Curse_AvadaKedavra` | Dark Arts | 22 | `Spell_AvadaKedavra` | visible candidate |
| Curse Sapper / `Talent_Curse_CurseHealth` | Dark Arts | 22 | none | visible candidate |
| SKILL Stupefy1 / `SKILL_Stupefy1` | General | 0 | none | hidden/internal |
| Human Demiguise / `INF_Swift` | Stealth | 5 | `Spell_Disillusionment` | visible candidate |
| Sense of Secrecy I / `Talent_Infil_Evasion1` | Stealth | 5 | `Spell_Disillusionment` | visible candidate |
| Sense of Secrecy II / `Talent_Infil_Evasion2` | Stealth | 16 | none | visible candidate |
| Petrificus Totalus Mastery / `Talent_Infil_PetrificusTotalus` | Stealth | 22 | none | visible candidate |
| Fertiliser / `Talent_Sanc_Cabbage` | Room of Requirement | 5 | `SancWheel_ChompingCabbage_Byproduct` | visible candidate |
| Edurus Potion Potency / `Talent_Sanc_EdurusPotion` | Room of Requirement | 5 | `SancWheel_Edurus` | visible candidate |
| Invisibility Potion Potency / `Talent_Sanc_InvisibilityPotion` | Room of Requirement | 5 | `SancWheel_InvisibilityPotion` | visible candidate |
| Headache / `Talent_Sanc_Mandrake` | Room of Requirement | 16 | `SancWheel_Mandrake_Byproduct` | visible candidate |
| Maxima Potion Potency / `Talent_Sanc_MaximaPotion` | Room of Requirement | 16 | `SancWheel_Maxima` | visible candidate |
| Focus Potion Potency / `Talent_Sanc_AMPotion` | Room of Requirement | 22 | `SancWheel_AMFillPotion` | visible candidate |
| Thunderbrew Potency / `Talent_Sanc_AutoDamagePotion` | Room of Requirement | 22 | `SancWheel_AutoDamagePotion` | visible candidate |
| Noxious / `Talent_Sanc_Venomous` | Room of Requirement | 22 | `SancWheel_VenomousTentacula_Byproduct` | visible candidate |
| Accio Mastery / `Talent_Spell_Accio` | Spells | 5 | `Spell_Accio` | visible candidate |
| Confringo Mastery / `Talent_Spell_Confringo` | Spells | 5 | `Spell_Confringo` | visible candidate |
| Depulso Mastery / `Talent_Spell_Depulso` | Spells | 5 | `Spell_Depulso` | visible candidate |
| Diffindo Mastery / `Talent_Spell_Diffindo` | Spells | 5 | `Spell_Diffindo` | visible candidate |
| Incendio Mastery / `Talent_Spell_Incendio` | Spells | 5 | `Spell_Incendio` | visible candidate |
| Levioso Mastery / `Talent_Spell_Levioso` | Spells | 5 | `Spell_Levioso` | visible candidate |
| Bombarda Mastery / `Talent_Spell_Bombarda` | Spells | 16 | `Spell_Expulso` | visible candidate |
| Descendo Mastery / `Talent_Spell_Descendo` | Spells | 16 | `Spell_Descendo` | visible candidate |
| Glacius Mastery / `Talent_Spell_Glacius` | Spells | 16 | `Spell_Glacius` | visible candidate |
| Transformation Mastery / `Talent_Spell_Transformation` | Spells | 22 | `Spell_TransformationOverland` | visible candidate |

## Field Guide and Challenges

SHOWN: `AchievementChallenges` has 24 groups and `AchievementCriteria` joins to 88 FGC tier rows. A tier stores `Occurances` (source spelling), a prerequisite lock and its knowledge/evaluation rule. Counts below are per-row requirements with chained locks, not a verified global cumulative-counter algorithm. Ancient progression is S1; its hidden gates are omitted here. Rewards join through `AchievementRewards.AchievementID`.

| Family / row prefix | Tier requirements |
|---|---|
| `FGC_Breed_Beasts` | 10 |
| `FGC_Broom_Collect` | 2, 5, 10, 15 |
| `FGC_Broom_Landing` | 2, 4, 6, 8 |
| `FGC_Capture_Beasts` | 10, 20, 30 |
| `FGC_Complete_Merlin` | 2, 6, 10, 14, 20 |
| `FGC_Defeat_DarkWizards` | 10, 20, 40, 70, 100 |
| `FGC_Defeat_Dugbogs` | 5, 10, 20 |
| `FGC_Defeat_Goblins` | 30, 60, 100 |
| `FGC_Defeat_Inferius` | 10, 20, 36 |
| `FGC_Defeat_NamedEnemies` | 3, 6, 12 |
| `FGC_Defeat_Spiders` | 10, 20, 40, 70, 100 |
| `FGC_Defeat_Trolls` | 5, 10, 15 |
| `FGC_Defeat_Wolves` | 10, 20, 30 |
| `FGC_Duel_Techniques` | 5, 10, 20, 32, 42 |
| `FGC_Find_Astronomy` | 5, 5, 5 |
| `FGC_Hogwarts_Secrets` | 1, 1, 1 |
| `FGC_Increase_Gear_Stats` | 5, 10, 15 |
| `FGC_Mission_Homework` | 2, 4, 6 |
| `FGC_Mission_Main` | 2, 4, 6, 8, 14 |
| `FGC_Mission_Side` | 3, 6, 10, 18, 32 |
| `FGC_Pages_Hogsmeade` | 2, 8, 15, 25 |
| `FGC_Pages_Hogwarts` | 2, 8, 15, 25, 50 |
| `FGC_Pages_Overland` | 2, 4, 8, 16 |

SHOWN: CollectionItems has 640 data rows in 11 categories. This is not the player completion total: DLC, house-exclusive and unlock filters matter. Exploration has 90 Hogwarts, 30 Hogsmeade and 30 Overland entries, while page Challenges include other collection actions as well. Do not equate 150 Revelio collection records with every Field Guide page.

| Category / subgroup | Rows |
|---|---|
| Beasts / None | 13 |
| Brooms / Challenges | 4 |
| Brooms / DLC | 1 |
| Brooms / Vendor | 10 |
| Conjurations / Challenges | 3 |
| Conjurations / Exploration | 96 |
| Conjurations / Missions | 25 |
| Conjurations / Vendor | 16 |
| Enemies / None | 69 |
| Exploration / Hogsmeade | 30 |
| Exploration / Hogwarts | 90 |
| Exploration / Overland | 30 |
| Gear / Challenges | 49 |
| Gear / DLC | 29 |
| Gear / Exploration | 2 |
| Gear / Missions | 30 |
| Potions / None | 10 |
| Seeds / None | 16 |
| Traits / Challenges | 24 |
| Traits / Exploration | 50 |
| Traits / Missions | 1 |
| WandStyle / Exploration | 37 |
| WandStyle / Missions | 5 |

## Gear and loom

SHOWN: six equip slots in `GearSlotTypes`: back, face, hand, head, neck, outfit. `GearItems.NumGeneralAbilities` is distinct from a stat upgrade, and the schema allows 0 to 3. Trait recipes refer to one of 25 ability families at three levels. `GearPowerLevels` has 40 rows; `GearPowerStats` has 500. No exact final damage formula follows from those counts.

SHOWN: `GearStatIncrease` lists rarity-tier increments below. `GearStatUpgrade` independently lists required materials, so a stat number alone is not a recipe. The next table covers all 38 cost rows in the care digest.

| Rarity | Upgrade | Stored amount |
|---|---|---|
| Epic | 1 | 4 |
| Epic | 2 | 8 |
| Epic | 3 | 12 |
| Legendary | 1 | 6 |
| Legendary | 2 | 12 |
| Legendary | 3 | 18 |
| Rare | 1 | 2 |
| Rare | 2 | 4 |
| Rare | 3 | 6 |

Open: exact one-trait slot UI restriction, final stat stacking, talent-point level-award cadence, challenge counter reset semantics. DB schema presence is not proof that deprecated perks or inventory types are reachable.
