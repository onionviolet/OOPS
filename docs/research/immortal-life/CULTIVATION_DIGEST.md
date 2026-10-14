# Cultivation, work and sect recovery

Static evidence from build 17861603. Tables below are TextAssets in installed `ImmortalLife_Data/resources.assets`; exact path IDs are in COVERAGE.json and the private textasset-index. Shown configuration does not prove active loading or runtime settlement.

## C1: Three related progressions

`Level` has seven rows: Qi Refining early/middle/late, Foundation early/middle/late, and Golden Core. These are translated Chinese labels, not proof of seven reachable transitions. Each row has XP, attribute caps, configured stat increments, physical cost and development contribution. `PlayerController.GetCurrentLevelDesc` returns a Level; `PlayerData` retains Level, Exp, SelectedBreakSkillIDs and dic_nowLevelAbilityExp. Their method bodies are not recovered.

| LV | Configured realm label | Exp field | BreakPPSpend | BreakTimeSpend | HP / MP limit |
|---|---|---:|---:|---:|---|
| 1 | Qi early | 12500 | 100 | 0 | 225 / 60 |
| 2 | Qi middle | 28000 | 125 | 0 | 300 / 80 |
| 3 | Qi late | 50000 | 150 | 0 | 375 / 100 |
| 4 | Foundation early | 160000 | 200 | 0 | 627 / 172 |
| 5 | Foundation middle | 230000 | 200 | 0 | 879 / 244 |
| 6 | Foundation late | 300000 | 200 | 0 | 1131 / 316 |
| 7 | Golden Core | 400000 | 400 | 0 | 1491 / 436 |

Do not assume these XP values are lifetime totals or per-stage debits. `PlayerData.LevelUpNeedExp`, `OnLevelUp` and `ClearBreakSkill` are declarations only. LV7 omits the preparation and wave arrays present at LV1–6, so the last row does not establish another complete trial.

C2: LV1–6 carry eight `BreakAbilityDesc` categories: Plant, Collect, Cooking, Fishing, Working, Battle, Course, Alchemy. These link category-specific NeedExp to FightSkill ID/level. LV1 Plant requires 5000 and maps to 7015; Cooking requires 200 and maps to 7013; Battle requires 2200 and maps to 7012. No requirement to grind all eight follows. The [wiki](https://immortallife.wiki.gg/wiki/Breakthrough) states at most three mastered fields may be selected. Selection count is stated, not independently proven by native code here.

C3: FightSkill rows give materially different actions. 7015 links a recovery buff; 7013 uses percentage damage with configured Power 80; 7011 links a buff whose English description says doubled damage and free MP spells. Class 7010 combines a buff and area attack. 6010 uses a projectile and increasing power. Localized descriptions and serialized action types support distinct applications, not verified damage calculations. Several selected skills have six level entries but MaxLevel 5, another reason to retain reachability gaps.

C4: LifeSkillLevel is separate: Plant/Collect/Cooking/Feed/Alchemy/Forge each have 15 rows. Plant row 2 has commands that unlock named seed stock in shop 106. This is profession access, not automatic realm advance. Course and Battle appear in breakthrough preparation but are not among these six profession ladders.

## C5: Methods and capacity

Course has 20 definitions, with paid HP/MP/other-stat ranges and XP ranges; 1101 costs 500 and lists HP 15–24 plus XP 75–115. CourseRule configures three course slots, one-unit time, starts at 13/14/15. Repeat limits are -1 in all Course rows. Exercise has six distinct training definitions; first costs 50 mental, passes two time units and grants HP/MP with a minigame specification. These are configurations, not measured time units or evidence all are exposed.

MeditationPoint has two named sites with hourly MP recovery 6 versus 24 plus QTE recovery. LifeSkill has return, light and movement spells alongside an explicit test row. That test row and ClassSchedule's modern school-subject examples demonstrate that shipped data can include nonfinal content. Do not treat every row as reachable lore.

## C6: Sect life and work

SchoolDevelopment has thresholds 0/1000/2000/6000. Row 2 rewards include trade-route unlocks and courses 1201–1204. Row 3 adds routes and 1301–1304. Row 4 adds alchemy recipes and items. SchoolRenown has its own five thresholds; reputation is not development. Grade has member, steward and elder rows, with Any versus All admission conditions and an elder shop discount. SchoolSalary has 64 rows keyed by four development levels, four grades and four seasons, while Grade has only three rows. The extra salary grade needs a consumer trace.

SchoolUnlockGroup offers contribution-priced unlock groups, separate from cash and ordinary shop stock. Delegation defines three named specialists with 27 destinations, work-time values 3–9 and weighted result packages. This supports authored specialist services; it does not prove a free-form disciple workforce. ACS remains the stronger source for resource custody, job interruption and managed settlement.

Lifespan, old-age death and method-dependent longevity: no dedicated fields found in inspected Level, PlayerInitialData or NPC configuration, nor a matched lifespan declaration from the targeted type-name search. These are unresolved, not absent by proof. Keep YAIRPG's existing chronicle/heir state and accepted optional cultivation direction separate from this source.
