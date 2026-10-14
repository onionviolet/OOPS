# Rolls, skill steps and exams

Evidence label: **shown** in installed build 2453605, decompiled with ILSpy 11.1. No executable was launched. Extract root: `~/.codex/research/academagia-decompile/extract/`. Paths below are relative to that root. Equations are paraphrased, not copied code.

## R1. Normal roll

`GameLogic.dll/Academagia.Roll/BaseRollRule.cs:Calculate` draws an integer uniformly from **1 through max(1, 2 × attribute)**, inclusive, then adds the effective skill. Research can replace that skill with a larger integer-half research level. Maximize and Minimize effects alter the draw bounds; substitution rules can change the linked attribute or skill.

`Academagia.GameSystems/RollSystem.cs:CalculateRoll` adds context bonuses and `min(2, floor(Glory / 10))` on ordinary non-sentinel powers, then floors negative totals at zero. Illness contributes -5 through the bonus path. Planned stress can add to the player's contextual roll. Chance-of-failure is checked first; chance-of-success is checked afterward and can overwrite it. The contextual overload uses success sentinel 1999; the simpler overload used by stories uses 99. These are large powers, not guaranteed wins against arbitrary targets.

`RollResult.cs:TestPower`: normal success requires **initiator > target**. Penetrate changes the contextual comparison to ≥. Roll types: Type1 fixed power versus fixed threshold; Type2 fixed power versus target roll; Type3 initiator roll versus target roll; Type4 initiator roll versus fixed threshold.

The prior wiki formula, skill + random(0–2) × attribute, is **corrected**. It neither gives the same bounds nor the same distribution. A separate `RollSystem.Power` helper uses skill + uniform integer **0 through 2 × attribute - 1** + bonus. That helper is used by stress resistance. Do not combine the two routes.

`ReRollRollRule.cs:Calculate` takes magnitude + 1 total draws and returns their best or worst. The RNG in `Academagia.Storage/RandomGenerator.cs` wraps `System.Random`, initially seeded from wall-clock minute × second. This is **not** a stable date seed. Class calendars and exam results are stored, which explains some reload stability without proving every unplayed roll is stable.

The UI difficulty estimator in `StorySystem.GetRollDifficult` uses skill, attribute and threshold bands, not exact odds with all effects. Its highest possible equal-threshold case can be labelled possible even though normal success is strict. `RollSystem.GetProbabilitySuccessChance` also has suspicious integer arithmetic in the decompile; it is not a trustworthy probability oracle. Runtime UI colours were not checked.

## R2. Skill hierarchy and step cost

`GameLogic.dll/ContentModel/ActorSkill.cs` sorts child skills descending and takes the lowest of the top three. Fewer than three gives parent level zero. The base has 55 such parent records, including Bond; the patch reconstruction has 56. Child count is 3–7. Parent derived maximum is set to 99 in this path, so 10 is not a universal hard cap.

For current level L, dominant attribute A clamped to at least 1, child train multiplier c and parent multiplier p, `SkillSystem.GetNextLevelStepNumber` calculates:

**steps = floor(c × p × max(1, ceil((L + 1) / A) - 1) + 0.5)**.

For a skill without a parent, p = 1. Multipliers come from actor statistics and can be changed by effects. `StatisticKeyHelper` converts the shipped decimal modifier into percent units. A successful step threshold grants a level and resets steps to zero; excess does not carry through this path. Perks fire at reached levels and their recorded applications persist.

Study and Train are distinct content actions with magnitude-1 Expand effects. Study changes the course Study record; Train changes skill steps. Study has a 0–10 hard range. Inform discovers a skill; on a failed story roll, `InformRollSkill` informs the named subskill or a random child if the roll names a parent. Failure is not proof of training.

## R3. Exam score

`GameLogic.dll/Academagia.GameSystems/ExamSystem.cs:GetMidtermExamScore`, also called for finals:

- K = course parent skill level; S = study level; E = extra credit; F = Fitness.
- Draw K independent integers uniformly from S through 10, inclusive.
- If ill, add `min(0, (F - 5) × K)`; otherwise add zero.
- Add E and floor the final total at zero.

Thus the expected score before the floor is **K × (S + 10) / 2 + illness penalty + E**, rather than K × S. With K = 6 and S = 4, the expected draw sum is 42, with range 24–60. Extra credit and illness can change it. Detention skill quizzes use a separate skill × 10 minus illness penalty formula, with a passing threshold of 20.

The score dictionaries are populated only when a character has no score for that course and exam. They are saved separately for midterm and final. Academic year score truncates toward zero after combining `final × finalWeight/100 + midterm × (1-finalWeight/100)`.

## R4. Grading

| Style | Exact rule shown |
|---|---|
| Distribution | First ≥75; Upper Second ≥60; Lower Second ≥50; Third ≥40; otherwise Failure |
| Curve | Sort scores descending; First below rounded 10% rank boundary; Failure at or above rounded 90%; Upper Second below rounded 40%; Third at or above rounded 80%; remaining ranks Lower Second |
| HybridDistribution | Worse of curve and absolute band |
| HybridCurve | Better of curve and absolute band |
| PNP | Pass when course parent skill ≥5; otherwise NotPass, independent of drawn score |

Round means floor(x + 0.5). `ExamResult` enum ranks First = 0 through Failure = 4, so the hybrid max/min operations mean worse/better respectively. Equal-score sorting has no explicit tie-sharing policy. Percentiles are not fractional scores.

All 17 course weights, exam dates and class gain allocations are in [CLASS_TABLES.md](CLASS_TABLES.md). Final weights are **80–99%**, correcting the web lane's 80–95%. Exams replace the morning slot and cannot be changed by `ActionScheduleDay.CanChangeAction`, including illness cases. This is source proof, not a played exam.
