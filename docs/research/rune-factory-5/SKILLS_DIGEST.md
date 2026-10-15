# Skill and use digest

F1. The 39 skills span weapon styles, elemental magic, farm/resource work, cooking/forging/chemistry/crafting, searching, movement and ordinary bodily activity, defenses, monster handling, throwing, leadership, trade and catching. All definitions have parameter coefficients, RP reduction, a level cap and a curve ID. Full definitions and every action grant are in private `skills-joined.json` and `skill-actions-joined.json`.

F2. The action table has 411 rows. Each can target up to three skills. A plow action names Farming and Earth; logging names Logging, Wind and Earth. Failed fishing has less Fishing XP than successful fishing while both name Water XP. Eating, sleeping, walking and bathing also have authored grants. These are table facts, not proof of dispatch cadence. Some named action targets explicitly have zero XP.

F3. Skill effects and XP costs are separate. Five threshold arrays each contain 99 entries; 28 skills have a cap of 999 and 11 a cap of 99. Native extrapolation above the supplied curve range is unread. Do not extend the curve by guesswork. Parameter coefficients include different health/resource, physical, magical and defensive effects depending on skill. Exact level multiplication, stacking, rounding and RP reduction math remain unread.

F4. `SkillManager` exposes separate RP-only, XP-only and combined operations. It also exposes `ExpUp`, `GetNextLevelExp` and `OrderFlagCheck`. That supports an architecture inference that useful actions share explicit learning dispatch while resource charging can be separate. The actual call sites and ordering need native-body reads.

F5. `NeedSkillLevel=50` appears on 42 action rows beside RP costs and multipliers. It must not be called an unlock requirement before its consumer is read. Recipe `SkillLv` and `RecipeRelease` are separate fields; teacher/manual knowledge routes are not established here. No complete per-level functional unlock list is claimed.

YAIRPG proposal: one supported useful job can grant related practice through the existing technique owner, then expose a concrete useful application. Keep ordinary results valuable, give failed attempts only their declared evidence and keep knowledge separate from tool access and affordability. This does not recommend harmful-condition grinding, compulsory active clicks or adding all donor skills.

Sources: master bundle `382aa2501e16ef256258fc102a8fcea5.bundle`, `SkillActionDataTableArray`, `SkillDataTableArray`, `SkillLevelupTypeDataTableArray`; English master `2a7ffd6c74027741cd44253e7638237a.bundle`, `SkillUINameData`/`SkillUIDiscriptData`; metadata `SkillID`, `SkillActionID`, `SkillManager`. See [private reference store](private/fs-rune-factory-5/README.md).
