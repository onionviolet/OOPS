# Realm requirements, failure and tribulation

Shown in backup tables, not a current runtime balance claim. `角色配置表.xlsx/RoleGrade` row2 names the fields; row3 types them. Numeric-ID records end at row47; later notes must not be counted as realm records.

## Separate the axes

`grade`, `phase`, `quality` select the state. `exp` and `condition` gate it; `drama` references story sequences. `lockFeature` is labelled bottleneck feature. `growItemRequire` supplies allowed required-item IDs and `growItemNum` their configured count; `materialsNum` is capacity for inserted treasures, not a demonstrated requirement to fill every slot. `fateNum`, `growAddLife` and `abilityPoint` are separate outcomes. `itemShowA/B` and `allItemShowA` are display fields, not enough to prove debit or eligibility.

| Code/example | Source rows | Exact table distinction |
|---|---|---|
| B21 Early phase | RoleGrade 5–6 | grade1 phases2/3 exp260/1600; lockFeature120/121; required count0. Display fields still name pills, illustrating why display IDs must not substitute for a payment trace. |
| B22 Foundation choice | 7–9 | grade2 phase1 quality1/3/5: same exp2346, growItemNum1/3/6, materialsNum1/2/3, fateNum1/2/3, abilityPoint12/16/20. All growAddLife480 and failure feature109. Required ID pools differ between low and higher quality. |
| B23 More quality shapes | 15–19 | grade4 quality1/2/3/4/5: required count1/1/1/3/6; optional treasure capacity1/2/3/4/5; fate choices1/1/2/2/3; points20/25/30/35/40. Preparation does not map through one universal linear rule. |
| B24 Later variety | 25–27, 33–36, 39, 42–45 | grade6 quality1/3/5 capacity2/4/6 but required count always1. grade8 qualities2/3/4/5 capacity2/4/5/6. grade9 required count5, treasure capacity0; grade10 has four separate phase1 rows, same grade/quality but separate item pools. Never key only by grade. |
| B25 Story gates | 40–41, 46–47 | grade9 phase2/3 conditions dialogue_2010505_1 / dialogue_2010524_1, lockFeature136/137. grade10 phase2/3 conditions dialogue_7004037_1 / dialogue_7005035_1, lockFeature138/139. Referenced dramas are separate. |

Lifespan additions at major grade-entry rows are480,480,480,960,1440,4320,3360,6000,12000 for grades2–10. The foundation annotation equates480 with40 years, supporting a month-unit inference. They are additions, not maximum ages. In particular grade8 adds fewer units than grade7. No monotonic formula should be invented.

## Failure is not its own success roll

`failFeatureProb` is labelled probability of receiving a feature **on failure**. Major entries read100; this does not mean a100% breakthrough failure chance. No final success RNG/payment consumer recovered. Prior CE28 reports material-rate aggregation in one native body; its bytes are unavailable here and it is not re-proven.

`创角配置表.xlsx/RoleCreateFeature` rows16–20 all last12 months and group401. `角色配置表.xlsx/RoleEffect` rows567–579 supply the effects.

| Failure feature | Table-defined aftermath |
|---|---|
| 109 | attack -10%, growForbid |
| 110 | weapon-method aptitudes -10%, growForbid |
| 111 | spiritual-root aptitudes -10%, growForbid |
| 112 | both aptitude groups -15%, growForbid |
| 113 | attack and both aptitude groups -20%, growForbid |

These are configured temporary conditions. Exact refresh stacking, material loss, healing removal and transaction order remain open.

## Two distinct tribulation scenarios

**B26 Ordinary failure fallback:** RoleGrade points to dungeonID13 with levels5–50. `副本配置表.xlsx/DungeonBase` row7 maps ID13 to type42, timeLimit30 seconds, flee/bossFlee0, victory/fail -1, winFunction/loseFunction0. The sheet's annotation row1322 calls type42 the failed-tribulation dungeon. Thus special code, not these zero hooks alone, must resolve the outcome. Lightning timing, damage, survival return and resource loss are unread. Thirty seconds is a configured limit, not verified survival time.

**B27 Authored late scenario:** DungeonBase row61 ID141/type74 has room25/scene4500, no fleeing, timeLimit-1, and a win command sequence that clears60204, creates60206 and finishes task110032. It is not shown as RoleGrade's generic fallback.

`DungeonSpecial74` rows4–50 configure a starting protective array whose comment says the player is invulnerable while it lives. Three monster weights800/120/80 give energy5/17/30. Lightning monster chance500 per10000, energy cap1200, skill cost300, hold2000ms. phase1EndTime1000ms, phase2StartTime60000ms, phase2EndTime120000ms; inter-wave intervals300/100ms, counts1/6. big/small strike radii150/50, maximum monsters30. winAddLuck147 is a concealed indefinite feature in RoleCreateFeature row54. Units and mechanics are stated in comments, not measured.

**Inference:** an authored trial can use protection, kill-generated energy and movement pressure rather than only a chance check. **Gap:** no universal link from every realm to type74, no proof every listed field is consumed, and no executable victory/payment/refusal trace. `DungonSpecial74sub` row4 also declares a giveUpChance item-deletion command, but its caller is unread; do not present it as a proven safe cancel transaction.
