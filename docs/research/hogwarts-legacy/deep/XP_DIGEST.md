# XP and level rewards

2026-10-14. Steam build 20773316. This closes the first pass's cumulative-threshold question and traces a challenge-progress award route. All findings are static. SHOWN means installed rows or decoded native instructions; INFERRED means a cross-file interpretation. None means played or save-tested.

Executable SHA256: `b713e88e0034cb23562b7ffeba6febe5d6a679578215cb595e1644cfc56245a1`. Tools: REA 6.4.0 at `bb540826d65316c164d2de8ba4ef10f81a8ad073`, with the first pass's declared bounded-import patch; Ghidra 12.1.4 and OpenJDK 21.0.12.1. [NATIVE_CHAINS](NATIVE_CHAINS.md) records REA success, follow-up startup timeouts and direct fallback. SDK names were leads; current-build registration, reflection records, SQL strings and call instructions supplied addresses and selected field bindings.

Full detail: [private native notes and pseudocode](../private/native/deep/CHAIN_NOTES.md), [XP action rows](../private/tables/ship/ExperienceActions.json), [all level thresholds](../private/tables/ship/ExperienceLevels.json), [challenge definitions](../private/tables/ship/AchievementChallenges.json), [criteria](../private/tables/ship/AchievementCriteria.json).

## D1: cumulative thresholds, not a fresh bill each level

SHOWN: AddExperience wrapper `0x1436365c0` calls body `0x142d6c270`. The body adds the adjusted award to the accumulated points field. Instructions at `0x142d6c328..0x142d6c34d` pass that updated total to the level lookup at `0x142d775d0`. That lookup tests total points against cached start/end ranges and stops at level 40. It does not subtract a fresh PointsForNextLevel bill from the total on each level-up.

SHOWN: the static loading region at `0x142d7cdf2` uses the query `SELECT * from ExperienceLevels;` at `0x1478c3280`. Its row loop reads ExperienceLevel and PointsForNextLevel, carries the previous threshold forward as the next range start and stores the current threshold minus one as its end. `0x142d89db0` returns the cached start/end pair. The loader was recovered from a PE runtime-function fragment; its decompiler has inherited-register warnings. The row-loop relationship, raw SQL/column strings and downstream range comparison are the evidence, not a claim that the whole initializer's boundaries are recovered.

INFERRED from those joined operations: PointsForNextLevel is a cumulative boundary. For the shipped rows, level 1 covers 0..499, level 2 starts at 500 and ends at 1029, and level 3 starts at 1030. The additional requirement from the start of level 2 to level 3 is 530, not 1030 more points. Level 40 begins at 74,000. Its 99,999,999 terminal field is a sentinel-style boundary, not evidence for a playable level 41.

The first pass's complete 40-row values are retained in the private export. This corrects its deliberately unresolved interpretation without changing its recorded numbers.

## D2: action awards and challenge exhaustion

SHOWN: GainExperienceByAction wrapper `0x143636b10` calls `0x142d738b0`. That body constructs `SELECT ExperiencePoints FROM ExperienceActions WHERE ExperienceAction = '%s'`, resolves the row and calls AddExperience. The query string at `0x1478c3450` and column string at `0x1478c33d8` were read directly from the executable. A similarly named zero-valued action does not generate a duplicate positive award.

SHOWN: ApplyKnowledgeAction wrapper `0x14353ebc0` calls `0x1429caf70`. In the selected matching subject/action route, it checks rule eligibility and an existing completion flag before advancing the criterion. When its associated challenge has a ProgressExperience reference, it calls `0x142d738b0` with that reference. The loader region `0x1429d78be` reads `AchievementChallenges.ProgressExperience` into the same challenge-record slot consumed by this branch. This is a native join from challenge progress to an ExperienceActions award, rather than merely two tables with similar names.

The same branch marks a criterion complete when its count reaches its goal, still allows that final qualifying event's progress award, and then invokes completion handling. Later visits to an already-completed criterion skip this award block. The companion ApplyAchievementIncrease body `0x1429cab50` and stat-change evaluation routes also explicitly reject completed criteria, but not every such entry path was proved to award ProgressExperience identically.

INFERRED: **XP from this challenge-progress route stops when its eligible challenge work is exhausted.** That is a category/criterion rule, not a global ban on future XP. Other still-active challenges and direct AddExperience callers can remain sources. Next-tier activation, all evaluation-rule variants and every source caller were not exhaustively traced. The final event can pay; the guard is not simply “reject an event that fills the bar.”

Stored base awards include main quest 260, side quest 180, homework 150, Merlin-trial progress 80, capture 30, breeding 100, duel-technique progress 35 and gear-stat upgrade 25. They are base row values before the native modifier. Full action IDs and zero rows remain private.

## D3: talent cadence, gear and difficulty

SHOWN: after AddExperience detects a level change, its increasing-level path checks that the new level exceeds four. If the perk manager exists, it calls the same point updater identified in the first pass, `0x143110180`, with `newLevel - max(oldLevel, 4)`. This handles multi-level gains. The purchase path separately spends one point on a first purchase; earning and spending are different chains.

INFERRED: the normal increasing-level branch awards one point for each newly crossed level from 5 through 40, or 36 points across that whole interval. This is not proof of every initialization, respec or exceptional/debug level setter. A talent UI unlock is distinct from the arithmetic in the level-gain path.

SHOWN: `GearPowerLevels` has 40 rows keyed by PlayerLevel, with MinPowerLevel, MaxPowerLevel, EpicStatBonus, LegendaryStatBonus and ExpectedGearLevel. `GearPowerStats` separately maps PowerLevel to damage/reduction/cooldown inputs. These establish a level-linked gear range, not a free gear-item reward at every level. Actual loot selection and equipping are further consumers.

SHOWN: AddExperience applies a float multiplier from player getter `0x142ad7840` before converting the result to an integer and adding it. That getter reads offset `0x2408`; fresh reflection places the player's GainExperienceModifier property at `0x23b8`. INFERRED: this is the property's evaluated-value storage. Zero adjusted awards are skipped in the inspected path. The current-build property receipt is retained, rather than borrowing the SDK's older offset.

The inspected award/lookup path has no direct difficulty-reader call. `EnemyDifficultyScaling` has damage, timing, tickets and defense inputs, but no XP column. **An unconditional claim that difficulty never changes XP remains unproved:** the upstream assignments/modifiers feeding the player property were not exhaustively enumerated. No difficulty-specific XP multiplier was located in these inspected consumers or tables. Difficulty values elsewhere are not silently applied to XP.

Private: [gear level ranges](../private/tables/ship/GearPowerLevels.json), [gear stat lookup](../private/tables/ship/GearPowerStats.json), [difficulty rows](../private/tables/ship/EnemyDifficultyScaling.json), [native reflection and comparison](../private/native/deep/CHAIN_NOTES.md).

## YAIRPG implication

PROPOSAL: D1/D2 sharpen LP8 with explicit counters, award causes and exhaustion rules. Separate “this known task no longer teaches this lesson” from “the world no longer grants progression.” D3 sharpens LP7's level-linked capability/gear distinction. Legacy's finite challenge ladder does not override YAIRPG's accepted passive/idle progression direction or select a new XP model.
