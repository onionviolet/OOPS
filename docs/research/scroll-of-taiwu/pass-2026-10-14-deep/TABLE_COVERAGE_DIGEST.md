# Config coverage and the prior unread table

Shown constructor enumeration using a balanced-expression parser. All IDs below are unique and contiguous over the stated range. Raw constructor expressions remain private. This is structural row coverage, not full semantic reading or proof of player reachability.

| Table | Rows | ID range | New coverage |
|---|---:|---|---|
| Legacy | 749 | 0–748 | All constructor boundaries and IDs checked |
| LegacyPointType | 8 | 0–7 | All constructor boundaries and IDs checked |
| NeiliType | 36 | 0–35 | All constructor boundaries and IDs checked |
| SkillBreakPageEffect | 10 | 0–9 | All constructor boundaries and IDs checked |
| WorldCreation | 15 | 0–14 | All constructor boundaries and IDs checked |
| WorldState | 57 | 0–56 | All constructor boundaries and IDs checked |
| PlanningGoal | 276 | 0–275 | All constructor boundaries and IDs checked |
| PlanningAction | 389 | 0–388 | All constructor boundaries and IDs checked |
| AdventureGenerateCondition | 93 | 0–92 | All constructor boundaries and IDs checked |

Legacy has749 rows,36 permanently-unique flags and configured Cost range -1000..3500. Positive costs alone would miss drawback/compensation choices. Nonnegative target fields occur in204 feature rows,400 property rows,5 behavior rows,3 life-growth rows,3 martial-growth rows,3 building rows,20 building-core rows,45 institution rows and60 state rows. These categories can overlap and are not counts of distinct visible choices. GroupId is -1 in732 rows; remaining groups568/573/707/710 have5/6/3/3 rows. Exact meaning of every special group/effect is not inferred from its count.

LegacyPointType IDs0..7 have third constructor values1,0,2,2,1,0,0,2 respectively. The field's name/consumer is not assumed from these values. Prior LegacyPoint53-source count remains reused evidence. Full award-call-site coverage requires all package/global/other-domain callers, not just TaiwuDomain.AddLegacyPoint.

SkillBreakPageEffect rows0..4 are direct pages1..5; rows5..9 reverse pages1..5. Direct page1 effect IDs are all0; reverse page1 all2. Direct page5 all1; reverse page5 all3. Pages2..4 use distinct IDs by equipment class. This closes the10-row dispatch table, not all34 referenced effect implementations.

WorldCreation15 and WorldState57 rows replace a guessed nonexistent Config.WorldSettings type as concrete starting points. Their full modifiers/consumers, and mod/runtime overrides of GlobalConfig, remain unread. The prior955 technique and319 building counts were not re-extracted. This lane does not claim full semantic coverage of those rows or all associated effects.

Recommended continuation order: finish selected event trade/lesson settlement; trace global award consumers and extra transfer listeners; then pick whole row families only when an intended feature needs their complete semantics. Source breadth is not an adoption requirement.


## Content reconciliation B468: complete record and evidence-depth distinctions

All25 lines and every table row were read against the deep report's remaining-gap table. Constructor boundaries, contiguous IDs and field distributions establish structural enumeration, not complete row meanings, live overrides or reachability. The749 legacy rows include negative/compensation costs; target-category counts overlap and cannot be summed as unique choices. The special-group arithmetic732+5+6+3+3=749 checks its partition, without identifying every group's effect. LegacyPointType's third values have no inferred field name/consumer here. The53 prior point sources do not exhaust all award callers. Ten page-dispatch rows are separate from34 referenced implementations; old955-technique/319-building counts remain reused evidence. WorldCreation/WorldState correct the guessed WorldSettings locator, not all world modifiers. Current [PROJECT](../../../../PROJECT.md) and AD32/AD36 govern a selected consumer. No private constructor, event script, code, runtime/mod state, source tool or personal save was newly read or executed. Preserve exact unresolved global awards, transfer listeners and selected event settlement rather than treating this digest as whole-game or adoption completion.
