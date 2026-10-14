# Teaching and event gates

Shown managed bodies and binary records decoded by a task-authored Python parser. The parser mirrors the installed version0.0.2.0 decompiler's read format; it does not evaluate scripts. Five `.twes` packages parse to exact EOF. Generated C# and scripts coexist, so a generated `return true` alone is not a complete permission test.

## E1: Four distinct gate surfaces

`EventScriptRuntime.LoadPackageScripts` attaches event script/type1, event conditions/type2, option script/type3, available conditions/type4 and visible conditions/type5 by event GUID and option sub-GUID. Generated package classes independently contain option condition objects, visible/available checks and selection handlers. No universal goodwill threshold follows from a single helper. `EventConditionList` evaluates nested AND/OR/not conditions; function bodies can record condition hints.

Five decoded packages: CharacterInteraction_Study74 scripts/112 instructions; CharacterInteraction_Main124/341; TaiwuLegacyPassing11/19; SectBuildingInteraction11/14; Adventure_Interaction45/210. Totals265/696 are parsing coverage, not full semantic review or content reachability.

## E2: Exact sect teaching route

Entry event `a9d0bcd8-e378-4ee9-96a6-1e5b9db17371` in Package.CharacterInteraction_Main. Its first two options enter martial/life teaching. Generated condition objects require at least5 days left, a sect NPC and a non-village NPC; visibility also checks sect/non-village. `OptionConditionMatcher.MovePointMore` means calendar days, despite its name.

Selection checks, in order: institution learning allowed, alertness at most3, TaiwuCanGetTaught, and the teacher's previous teaching list. IsSectAllowLearning and event function674 both mean TaiwuExploreStatus==2. TaiwuCanGetTaught delegates to `prior:TaiwuDomain.IsTaiwuAbleToGetTaught`, which blocks a specific punishment-feature/state jurisdiction combination. This is not generic friendship.

The teacher-list helper refuses when at least three listed arts still fail TaiwuCanLearnCombatSkill; if any becomes eligible it clears the list and permits proceeding. This is an art-progress condition, not a permanent three-lesson lifetime rule.

After these shared checks, school-specific routes use gender code, fame and favor. Martial route school1 branches on gender1, fame>-25 and favor>=5; schools2–5 branch on fame>-25 then favor5. Schools6,7,9,10 route directly to their school events. School8 branches on gender0 then favor5. Schools11–15 branch on fame<25 then favor5. Route destinations include different refusal/teaching paths, so do not simplify these comparisons into universal hard permission predicates. Life-teaching has a parallel separately authored branch, not a proven identical roster.

`EventHelper.LearnTargetCombatSkillDependSectApprovingRate` chooses a lowest-grade eligible unlearned/unread school art of requested type, returns a named none-to-teach path if no candidate, and checks a grade ceiling max(0, floor(support/100)-1). For higher grades it requires every lower-grade school art to be present and TaiwuCanLearnCombatSkill. Do not substitute `OrganizationDomain.GetHighestGradeOfTeachableCombatSkill` here: that helper returns1 below300 support and otherwise2+(support-300)/100. Both paths ship; their consumers differ.

## E3: Exact script additions on the same entry

Option sub-GUIDs `8e94e7f9-4532-4762-9ea0-7c6af9c5f297` and `f4560d2f-a824-4722-9ea3-a8021a2167b2` have type4 function888(CharacterId), the alertness<=3 predicate. Book-exchange option `c1d57d6b-9347-452a-85fd-df19e0a65f2b` has function878. Its directed NPC-to-Taiwu favor type must meet behavior-specific thresholds: behavior0→6,1→4,2→3,3→2,4→5, default3. This is an exact exchange condition, not all lending and service prices.

Profession option `72ee5c31-5730-4a46-b0d4-ea6690573e29` has four available checks: function142(CharacterId,Taiwu,operator4,value5),146(profession),148(teaching-date eligibility),163(unlock eligibility). EventConditions maps142 to favor type, EventConditions.PerformOperation maps operator4 to >=, so the directed favor type must be at least5. Function148 requires current date strictly greater than last teaching date+12. Visibility additionally has reversed140(CharacterId,-1) and155(27). The complete profession/local-status interpretation remains a targeted gap.

## E4: Consent, learning and trade settlement

NPC learning actions use directed goodwill and behavior to determine agreement, then separate learner qualification/attainment/personality checks for success. Package.CharacterInteraction_Study has school lesson, selected-art and refusal handlers, including item/manual creation and favor changes. `EventHelper.GetTeachCombatSkillBook` uses known reading variants, chooses an already-read internal page and creates a demanded physical manual.

Book exchanges call `StartExchangeBooksByFavor` or ByApprove, open the BookTrade display event and wait for ExchangeBookComplete. Exact inventory selection, valuation and final frontend/backend settlement were not exhausted. No universal lending fee, service cost or all-dialogue closure is claimed.

The actionable YAIRPG lesson is an explanation composed from the actual failed predicates, with friendly relations, school permission, prior knowledge, availability, cost and consent retained separately. This is a PROPOSAL, not selected implementation.
