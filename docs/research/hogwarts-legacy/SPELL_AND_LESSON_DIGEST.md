# Spell and lesson digest

2026-10-14, installed Steam build 20773316. SHOWN means values in extracted data, not played behavior. Source root: `~/.codex/research/hogwarts-legacy/extract/base/`. Main database: `Phoenix/Content/SQLiteDB/PhoenixShipData.sqlite` (DB below). Names joined to `Phoenix/Content/Localization/WIN64/MAIN-enUS.bin`; descriptions below are paraphrases. Raw tables remain private.

## Spell records

SHOWN: 162 SpellDefinition rows and 164 SpellKnowledge rows. These include tools, enemy/development variants and utility functions. The 27 rows flagged AllowInUI are a data candidate list, not a proven shipped player roster. In particular, Expulso has a row; this alone does not prove the player learns it.

DB locators: `SpellKnowledge.SpellTypeID, SpellCategory, CurriculumAssociation, UpgradeID0, Lock, NurtureOnly`; join `SpellDefinition.SpellTypeID, Upgrade`. Cooldown values are `CooldownTime`. Target letters are A animate, I inanimate, P plant, D dead, W water. These booleans are eligibility data, not proof that every object of that kind responds.

| Name / row ID | Category / subject | Cooldown field | Targets flagged | Local room flag |
|---|---|---|---|---|
| Accio / `Accio` | Forceful / Charms | 8.0 | AIPD | 0 |
| Arresto Momentum / `ArrestoMomentum` | CC / Charms | 15.0 | AIPD | 0 |
| Avada Kedavra / `AvadaKedavra` | DarkArts / DarkArts | 90.0 | A | 0 |
| Confringo / `Confringo` | Heavy / DarkArts | 10.0 | AIPD | 0 |
| Conjuring Spell / `Conjuration` | Sanctuary / Transfiguration | 0.0 | AIPDW | 1 |
| Crucio / `Crucio` | DarkArts / DarkArts | 20.0 | A | 0 |
| Depulso / `Depulso` | Forceful / Charms | 10.0 | AIPD | 0 |
| Descendo / `Descendo` | Forceful / Charms | 10.0 | AIPD | 0 |
| Diffindo / `Diffindo` | Heavy / Charms | 15.0 | AIPD | 0 |
| Disillusionment / `Disillusionment` | Tool / Charms | 0.5 | A | 0 |
| Expelliarmus / `Expelliarmus` | Heavy / DADA | 10.0 | AI | 0 |
| Bombarda / `Expulso` | Heavy / Charms | 15.0 | AIPD | 0 |
| Finisher Black Particle Explode / `FinisherBlackParticleExplode` | None / None | 0.0 | AID | 0 |
| Finisher Fiery Send / `FinisherFierySend` | None / None | 0.0 | AID | 0 |
| Finisher Fire Storm / `FinisherFireStorm` | None / None | 0.0 | AIPD | 0 |
| Finisher Lightning Storm / `FinisherLightningStorm` | None / None | 0.0 | AIPD | 0 |
| Flipendo / `Flipendo` | Forceful / DADA | 5.0 | AIPD | 0 |
| Glacius / `Glacius` | CC / Charms | 10.0 | AIPDW | 0 |
| Imperio / `Imperius` | DarkArts / DarkArts | 30.0 | A | 0 |
| Incendio / `Incendio` | Heavy / Charms | 8.0 | AIPDW | 0 |
| Levioso / `Levioso` | CC / DADA | 8.0 | AIP | 0 |
| Lumos / `Lumos` | Tool / Charms | 0.5 | AIPD | 0 |
| Reparo / `Reparo` | Tool / Charms | 0.5 | I | 0 |
| Altering Spell / `Transformation` | Sanctuary / Transfiguration | 0.0 | AIPD | 1 |
| Transformation / `TransformationOverland` | CC / Transfiguration | 20.0 | AIP | 0 |
| Evanesco / `Vanishment` | Sanctuary / Transfiguration | 0.0 | AIPD | 1 |
| Wingardium Leviosa / `Wingardium` | Tool / Charms | 0.5 | IPD | 0 |

SHOWN: Reparo flags only inanimate targets and has cooldown 0.5. Lumos also has 0.5. Accio and Levioso have 8; Glacius 10; their noncombat multiplier fields are 24, 24 and 30. The operation applied to that multiplier is not established by its name. `DamageObject`, `DamageCharacter`, `ImpactType`, `SizeLimit`, duration fields, impulse fields, `CastNoise`, `ImpactNoise` and `BeastCapture` separate damage, control, sensing and capture. No generic mana cost column occurs in SpellDefinition.

SHOWN: the six sampled player spells have `EnemyShieldBreaker=None`. That field alone does not explain colored shields. Categories and Blueprint gameplay tags must also be followed. A list of shield enums does not establish the yellow/purple/red counter rule. Combo effects require `SpellUpgrades.SpellUpgrade` and ability/Blueprint consumers; unsupported native formulas remain explicit gaps.

## Acquisition routes

SHOWN: `MissionRewards` has 34 Spell reward rows. `MissionDefinition.MissionTitleTextKey, MissionLevel` join to each mission. This table describes reward presentation; unlocking can occur earlier in `MissionSteps`, so reward rows alone are not a full learning proof.

| Route ID | Player-facing route | Spell reward | Level field | Hidden flag |
|---|---|---|---|---|
| `CNF_01` | In the Shadow of the Undercroft | `Spell_Confringo` | 8 | 0 |
| `DMS_01` | The Man Behind the Moons | `Spell_Alohomora_L2` | 0 | 0 |
| `DMS_01` | The Man Behind the Moons | `Spell_Alohomora_L3` | 0 | 0 |
| `EVL_01` | In the Shadow of the Study | `Spell_Crucio` | 0 | 0 |
| `EVL_02` | In the Shadow of Time | `Spell_Imperius` | 0 | 0 |
| `EVL_03` | In the Shadow of the Relic | `Spell_AvadaKedavra` | 0 | 0 |
| `FIG_01` | Secrets of the Restricted Section | `Spell_Disillusionment` | 3 | 0 |
| `FIG_01` | Secrets of the Restricted Section | `Spell_AimMode` | 3 | 1 |
| `GDW_01` | The Caretaker's Lunar Lament | `Spell_Alohomora` | 14 | 0 |
| `INT_01` | The Path to Hogwarts | `Spell_Lumos` | 0 | 0 |
| `INT_01` | The Path to Hogwarts | `Spell_Protego` | 0 | 0 |
| `INT_01` | The Path to Hogwarts | `Spell_Revelio` | 0 | 0 |
| `INT_01` | The Path to Hogwarts | `Spell_Stupefy` | 0 | 0 |
| `OLI_01_Natsai` | Welcome to Hogsmeade | `Spell_Oppugno` | 2 | 0 |
| `OLI_01_Seb` | Welcome to Hogsmeade | `Spell_Oppugno` | 2 | 0 |
| `SNC_01` | The Room of Requirement | `Spell_Conjuration` | 6 | 0 |
| `SNC_01` | The Room of Requirement | `Spell_Vanishment` | 6 | 0 |
| `SNS_01` | Interior Decorating | `Spell_Transformation` | 0 | 0 |
| `ZSB_01` | Professor Howin's Assignment | `Spell_Expulso` | 0 | 0 |
| `ZSD_01` | Professor Sharp's Assignment 1 | `Spell_Depulso` | 0 | 0 |
| `ZSG_01` | Madam Kogawa's Assignment 1 | `Spell_Glacius` | 0 | 0 |
| `ZSI_01` | Professor Hecat's Assignment 1 | `Spell_Incendio` | 0 | 0 |
| `ZSR_01` | Professor Ronen's Assignment  | `Spell_Reparo` | 0 | 0 |
| `ZSW_01` | Professor Garlick's Assignment 1 | `Spell_Wingardium` | 0 | 0 |
| `ZZC_01` | Charms Class | `Spell_Accio` | 1 | 0 |
| `ZZD_01` | Defence Against the Dark Arts Class | `Spell_Levioso` | 1 | 0 |
| `ZZE_01` | Professor Hecat's Assignment 2 | `Spell_Expelliarmus` | 0 | 0 |
| `ZZF_01` | Professor Garlick's Assignment 2 | `Spell_Flipendo` | 0 | 0 |
| `ZZM_01` | Madam Kogawa's Assignment 2 | `Spell_ArrestoMomentum` | 0 | 0 |
| `ZZN_01` | Professor Sharp's Assignment 2 | `Spell_Diffindo` | 0 | 0 |
| `ZZO_01` | Professor Onai's Assignment | `Spell_Descendo` | 0 | 0 |
| `ZZT_01` | Professor Weasley's Assignment | `Spell_TransformationOverland` | 20 | 0 |

## Assignment wiring and useful noncombat methods

L1 SHOWN: Reparo route `ZSR_01`, MissionSteps 12.1 and 12.3, waits on the two page stats `M_ZSR_Page1` and `M_ZSR_Page2`. Step 19.1 marks learned Reparo; 20.1 assigns it to the South spell slot. INFERRED: task evidence and the final lesson are separate, rather than casting the spell repeatedly to buy it.

L2 SHOWN: Incendio route `ZSI_01` step 14.1 checks assignment stat `M_ZFC_AssignmentCheck >= 2`; step 25.1 enables practice objects; step 26.1 unlocks `Spell_Incendio`. The route also explicitly changes the teacher schedule. The assignment stat must be traced to its contributing missions before naming every task as required.

L3 SHOWN: Charms route `ZZC_01` rewards Accio and checks distinct result values for the class game at steps 33.1, 34.1 and 35.1. A learned method is used in a social exercise with an outcome, not just a combat reward.

L4 SHOWN: noncombat use is represented in data by target flags and named puzzle assets under `Phoenix/Content/Gameplay/SphinxPuzzles/Blueprints/A-Lumos/`. Converted `BP_Sphinx_Puzzle_A_Manager` and `BP_Sphinx_Puzzle_A_Lumos` are in `extract/blueprints/` at those same asset paths. Parsed call/condition evidence is recorded in BLUEPRINT_PASS.md. This separates an available verb from a particular object accepting it.

L5 SHOWN: `Conjuration`, `Transformation` and `Vanishment` have `NurtureOnly=1`. Room objects have separate unlocks in `TransfigurationObjectLocks.ObjectID,LockID`, and finite material costs in `TransfigurationObjects.Resource1_ID,Resource1_Required`. INFERRED: learning the room tool is not unrestricted world conjuration.

Open: colored-shield implementation, full combo operation order, and exact runtime meaning of cooldown multipliers need the asset consumers. No live input timing or lesson minigame success was tested.

## All twelve Assignment-line records

SHOWN: `MissionDefinition.MissionLineID='Assignment'` selects the twelve records below. Predecessors come from MissionSteps.EvalMissionComplete; task conditions come from EvalStat/EvalAchievement joined to AchievementCriteria and the objective's localization key. Names in the left table identify data routes, not spoiler locations or story outcomes. Learning still includes the return/lesson steps; the rows below are a compact prerequisite digest, not the complete mission script.

| Route | Prior mission checks | Paraphrased practical gate and evidence |
|---|---|---|
| `ZSB_01` | PRC_01 | Capture a Diricawl and a Giant Purple Toad. Steps 7.1/7.3 read two HOMEWORK criteria; their rules check species capture stats at least one. “Byproduct” in the criterion IDs does not mean harvest material for this assignment. |
| `ZSD_01` | FGM_02 | Use Focus Potion; overlap Maxima and Edurus. Steps 9.1/9.2 use potion-consumption/combination criteria. |
| `ZSG_01` | FGH_01 | Two balloon sets, each with a stored requirement of five. Steps 9.1/9.3, HOMEWORK_Broom_PopQuaffle and its second variant. |
| `ZSI_01` | FIG_01_Conv | Two completed duel rounds and the separate combination-practice mission ZFP_01. Steps 14.1/14.2. |
| `ZSR_01` | WET_01 | Two separately tracked flying-page tasks. Steps 12.1/12.3 each require its stat to equal one. |
| `ZSW_01` | SNC_01 and CNF_01 | Have an active Venomous Tentacula and affect enemies with Mandrake. Steps 8.1/8.2; the Mandrake criterion stores two occurrences with an impact-tag filter. The score-based plant rule stores zero Occurances, so zero is not “no work required.” |
| `ZZE_01` | FIG_01b and ZSI_01 | Dodge qualifying attacks ten times; hit enemies with Incendio five times. Steps 9.1/9.2 and their criteria. |
| `ZZF_01` | ZSW_01 | Harvest Fluxweed through the Herbology inventory reason; have all three combat plants active. Steps 9.1/9.2. Buying Fluxweed is not the harvest event this rule names. |
| `ZZM_01` | ZSG_01 | Two later flight-balloon sets of five. Steps 7.1/7.3 and the third/fourth balloon criteria. |
| `ZZN_01` | ZSD_01 | Use Invisibility Potion; damage an enemy with Thunderbrew's impact. Steps 9.1/9.2. The second rule requires damage, not merely possession. |
| `ZZO_01` | FGT_01 | Obtain the Troll Bogeys inventory condition; hit a levitated enemy with Depulso. Steps 7.1/7.2, including the Levioso-component condition. |
| `ZZT_01` | AVM_02 | Checks a quiz-progress stat at least one, then a later scene-trigger stat. Steps 9.1/18.2. This is assignment evidence; it is not a recorded OWL-grade system. Other page/scene task handling in this route is not fully reconstructed. |

STATED: shipped localization directly teaches Force/violet and Control/yellow shield counters and matching spell colors (`TUT_Display_AccioBlue_desc`, `TUT_Display_YellowShieldsZZD_desc`, `Hint_BreakShields`). LoadingScreen_Combat11 also describes bypass methods and the Hard-mode Stupefy exception. Exact red/damage tag wiring remains a consumer gap. This text evidence is stronger than guessing from EnemyShieldBreaker=None, but it is still distinct from decoded shield logic or live combat.
