# Reading, comprehension, mastery and force

Shown installed managed bodies. Reuses the prior TaiwuDomain and CombatSkillDomain extracts, adding GlobalConfig, ItemDomain, CombatSkill and Shared state helpers. No gameplay execution.

## S1: Damaged does not mean useless

SkillBookPageIncompleteState defines complete0, incomplete1, lost2. BaseReadingSpeed is50/10/1, ReadingPointCost30/60/100 and BaseReadingSuccessRate100/50/25. The speed array is consumed by prior:TaiwuDomain.GetBaseReadingSpeed; the other arrays are definitions, not a claim they govern the same Taiwu active-reading transaction. Physical state, page variant and learned progress are distinct.

`ItemDomain.GetPageIncompleteState` begins with the physical page state and scans reference books of the same template. A compatible reference with a better state supplies the effective lower state; martial normal-page direction must match. It returns effective condition, without mutating the original page here. Calling this physical repair would overstate the evidence.

Life knowledge tracks five pages; martial manuals expose six physical pages, with outline variants and direct/reverse internal page indexes. `prior:TaiwuDomain` can retain reading progress for an art not yet learned. Completion updates reading state/events; acquisition, comprehension and chosen mastery loadout are separate. Reading strategies have page slots and can alter progression/skip/reference behavior; selected facilities, attainment, earlier unread pages, institution and world settings affect speed.

## S2: Active reading is a batch mechanism

Root `GlobalConfig`, not Config.GlobalConfig: ActiveReadingTimeCost1, ActiveReadingAttributeCost3, MaxActiveReadingProgress30, efficiency tiers150/100/50. `prior:TaiwuDomain.ActiveReadOnce` checks remaining days and current attribute5, consumes a day outside adventure or10 action points inside, deducts3 intelligence, increments progress only through30 and settles a reading batch at multiples of10. ClearActiveReadingProgressOnMonthChange preserves remainder modulo10.

A detail worth preserving: costs occur before the max-progress guard. This method by itself does not reject a call at the cap before charging. UI protection and command exposure were not traced, so do not assert the player can lose days at cap. Also do not describe each click as immediate page XP; the handler applies work at batch thresholds.

Monthly and active study are separate entry paths. Prior claims about active-study numeric costs were open; they are now closed at static code/default-config level, not live balance after mods/settings.

## S3: Comprehension and mastery are not synonyms

`CombatSkill.CanBreakout` requires read outline, at least five activatable normal pages via CombatSkillStateHelper and not revoked. This is a breakthrough-readiness predicate, not a realm advancement. `CombatSkill.GetRequirementsAndActualValues` builds actual-vs-required property pairs, applies requirement modifiers and adds proficiency requirement300 for skills with proficiency. That display/helper is not proof of universal hard casting refusal.

`ExtraDomain.AddCharacterMasteredCombatSkill` maintains a separate chosen mastered-skill list, invalidates affected caches and reapplies equipment modifications for Taiwu. `prior:TaiwuDomain.MasteredSkillWillChangePlan` checks whether mastery would affect specific/generic slot capacity. Calling this flag simply “all pages understood” is wrong. Skill proficiency, page reading, breakthrough bonuses, equipment and this mastery selection have distinct consumers.

Several old practice-with-XP helpers in TaiwuDomain are explicit obsolete stubs returning0/null/-1. They must not be mistaken for current training logic. NPC request-study actions separately test agreement and comprehension using grade, qualification, attainment and personality.

## S4: Internal force has multiple ledgers

`CombatSkill.GetTotalObtainableNeili` adds definition capacity, breakthrough-grid property6 and plate bonuses, then clamps0..32767. ObtainNeili clamps per-art obtained force against this ceiling. `CombatSkillDomain.ApplyLoopingNeiliModify` computes the newly obtained delta and adds only that delta to current character force, clamped to max. `prior:Character.CalcMaxNeili` subtracts the cost of base allocations from pure maximum. Allocation is not free extra current reserve.

CalcNeigongLoopingEffect uses reserve gain, disorder and four allocation-progress outputs, plus element relation, consummate level, references, profession, sect self-improvement factor, feast and randomness. The reserve roll ranges around75–125% of computed base. Active-loop defaults parallel reading: one time, three attribute cost,30 progress,150/100/50 efficiencies. Not all active-loop invocation gates were re-audited.

36 NeiliType rows encode composition and combat/stat/effect fields, not merely the five elemental labels. NeiliProportionHelper sorts the five shares; a spread wholly within18..22 selects mixed type5. Otherwise the top share, second share relative to40%/80% of the top, elemental relation and birth-month innate-element tie breaks select a pure or hybrid type. All combat consumers remain unclosed.10 SkillBreakPageEffect rows distinguish direct/reverse and page-specific effects across five equipment categories. Every downstream effect implementation remains a gap.

Proposal: expose source-specific knowledge, comprehension, usable practice, force reserve and capacity/allocation separately where each changes a real choice. Keep reasonable improvement/alternate-copy/teacher routes reachable. No global30-click or per-art lifetime cap is recommended.

## S5: Exact looping element relation

FiveElementsType fixes Metal0/Wood1/Water2/Fire3/Earth4/Mix5. Producing edges are Metal→Water→Wood→Fire→Earth→Metal. Countering edges are Metal→Wood→Earth→Water→Fire→Metal. In CalcNeigongLoopingEffect_GetBenefitAndQiDisorder, mixed returns100 benefit/0 disorder; matching the produced element returns200 and -125×art grade disorder; matching the countered target returns50 and +125×grade; other cases return100/0. FiveElementEquals can apply source-specific modifications, so this base matrix does not exhaust all special effects.
