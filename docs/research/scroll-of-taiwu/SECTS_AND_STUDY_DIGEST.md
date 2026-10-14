# Sects, manuals and internal force

## F8: Four social facts to keep distinct

Shown: major sect IDs are 1–15 (`OrganizationDomain.IsLargeSect`). `Settlement.CalcApprovingRate` sums approval held by members in nine grade groups and clamps to an upper limit. World/story progression and settlement bonuses can change that limit. `OrganizationDomain` also has a separate inter-sect favourability matrix. These are distinct from character-to-character affection.

Shown: `GetHighestGradeOfTeachableCombatSkill` returns internal grade 1 below support 300, then `2 + floor((support - 300)/100)` clamped to 0–8. The internal grade grows upward; shipped UI tiers run the other way. `CharacterDomain.GetHighestGradeCombatSkillById` uses the teacher's settlement support to return that limit. This is evidence of a teaching-grade path, not a complete trace of all teaching dialogue conditions.

Shown: `TaiwuDomain.GetAttainmentWithSectApprovalBonus` substitutes the highest relevant life-skill attainment from a sect's configured list. Despite the method name, the inspected substitution itself does not check a minimum support threshold. `CalcReadingSpeedSectApprovalFactor` uses behavioral alignment, direct/reverse page direction and gender/page-specific bonuses, then adds 25 percentage points when support reaches 400. The outline and battle-reading paths skip some page-specific modifiers.

Stated: `Menpaizhichi.tsv` lists support thresholds for teaching tiers and further benefits including reputation, prestige, study efficiency, breakthrough assistance and access to inner facilities. `Menpaienyihudong.tsv` lists distinct sect services. `Menpaixiwu.tsv` supplies sect-specific item categories; it is not a full permission table. Detailed favour costs and every service remain unread.

## F6/F7: A method is more than an XP value

Shown: technique definitions link grade, school, element, manual, public/nonpublic access, using requirements, direct/reverse effect IDs, breakthrough plate and force-training fields (`Config.CombatSkillItem`). Mutable learned skills belong to `(character ID, technique ID)`.

Shown: life manuals have five study pages and martial manuals six, with internal page indices representing direction variants. `SetReadingStrategy` validates one of three strategy slots, charges current intelligence and possibly book durability, applies immediate effects and records expiry. Strategies can change progress, efficiency, next-page gains or existing strategies.

Shown: base speed depends on the effective damage state of the page including reference copies. Bonuses combine existing attainment, school rules, facility, reference texts, strategy and world settings. Each earlier unread page divides the resulting speed by two. Monthly reading can traverse multiple pages while speed remains. Full-book rereading can still grant XP; life rereading also adds seniority. It is not necessarily a dead-end once every page has been read.

Shown: `MakeReadingProgressActuallyWork` consumes durability on reference books and the studied copy, removing broken books. `ActiveReadOnce` spends days/action points and intelligence, adds an active-progress counter and applies an extra reading operation at each ten-count boundary up to the configured maximum. `UpdateReadingProgressOnMonthChange` performs ordinary reading and can add a study event. Exact GlobalConfig active-study costs remain unread.

Proposal P3 should preserve separate object condition and learned knowledge. Show known bottlenecks such as missing prior page, insufficient attainment or exhausted reference; do not expose secret effect rules through a preview.

## F9: Internal-force training has several outputs

Shown: `CombatSkillDomain.CalcNeigongLoopingEffect` calculates reserve growth, qi-disorder change and four allocation-progress values. The base gain includes per-loop technique data and breakthrough effects. Other modifiers include maturity/consummate level, reference methods, selected Qi strategies, profession, sect self-improvement for NPCs and feasts. Gain receives a random factor between three quarters and five quarters of the calculated value.

Shown: the inspected elemental helper returns neutral 100% benefit for mixed type 5; a producing relation yields 200% and a negative disorder term, a countering relation yields 50% and a positive disorder term. The disorder term is grade times 125 before later randomization. Applying the result updates learned-force progress, current reserve, elemental proportions and allocations separately. `Character.GenerateNeigongLoopingImprovementForTaiwu` additionally applies a world-setting multiplier.

Stated: `Neilishuxing.tsv` distinguishes pure, paired and balanced elemental proportions with different requirements, power and backlash consequences. The entire matrix and combat enforcement were not exhaustively traced. Preserve method reserve, capacity, allocation and compatibility as separate claims.

No sect, study or force behavior was tested in a running game. P1/P3/P5 are original adaptations; neither exact formulas nor source text should be imported into YAIRPG.
