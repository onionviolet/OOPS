# Next event proposal: the broken crossing

Prepared 2026-10-01. Original, provisional premise for Weibao's review; no event or roster is selected or implemented. Source intent: [USER_VISION.md](USER_VISION.md) U04 (refine existing play), U05 (events/endings), U06 (conditional peer survival), U07 (chance), U11–U12 (granularity/simple rules). Current implementation direction remains [PROJECT.md](../PROJECT.md).

## Premise and two approaches

During an ordinary expedition near Village, a crossing fails and a fellow traveler is stranded. Prior inspection can reveal a usable anchor and a safer footpath. The player chooses an intervention, seeing the available information, committed supplies and outcome estimates. Character and crossing names, costs and exact odds remain provisional.

| Approach | Preparation and decision | Distinct cost and result |
|---|---|---|
| Secure the crossing | Relevant route/anchor knowledge plus a crafted or purchased prepared kit; Crafting/Climbing can improve execution | Spend supplies and more simulated time to reduce injury risk and preserve the crossing for later use |
| Extract the traveler | Strength/endurance preparation, a known escape route and ordinary purchased/crafted equipment | Spend stamina and abandon part of the expedition objective; a strong build needs less specialist crafting but may leave the crossing unusable |

Both should reach the story milestone at comparable total preparation effort. Buying a kit substitutes for personally leveling every profession. Neither is a rare-drop-only entry. Knowing an anchor exists differs from having a usable kit or the strength to act. First occurrence waits for the player; closing the browser does not decide the traveler's fate.

## Outcome and later consequence

Proposed graded outcomes: safe rescue; rescue with an injury/recovery need; withdrawal that opens a follow-up rescue lead at a disclosed cost. Knowledge and preparation change this distribution. These are proposals, not final percentages or a promise that future events never allow death. The first test can exercise aftermath without selecting permanent peer death as a baseline.

At a later authored departure scene, the traveler's condition determines whether they can scout a route, need recovery supplies or are absent awaiting rescue. A repaired crossing changes travel preparation; an extraction preserves the person but leaves a different route problem. This is one small persistent consequence, not a full companion or relationship simulator.

## Engine contracts demonstrated

Use explicit event instance/knowledge/NPC facts, pure eligibility and odds preview, revalidation when committed, transactional input/outcome/reward persistence and a later read of the recorded outcome. Reuse existing skill/inventory/equipment definitions through a narrow adapter. A simulated duration is useful; a general deadline scheduler is needed only if the selected event introduces a real deadline. No new prestige, world, origin, offline combat or dynamic morality system is required.

Acceptance: two fresh generated builds choose different preparations, see matching preview/execution rules, complete different viable interventions, reload during commitment and after resolution without duplicate costs/rewards or rerolls, and see a later consequence. Old-shaped saves and dormant prototype data remain intact. Native file roundtrip is a regression gate for any new persisted event namespace. Human review must judge whether the choice is understandable and worth making.

## Creative decision remaining

Select whether this peer-rescue/crossing premise should be the first playable event. If selected, approve the desired consequence severity: recoverable setbacks initially, or a clearly previewed possibility of permanent death. Exact names, skill thresholds, costs and odds can then be reversible prototype choices tuned through play. No implementation is initiated by saving this proposal.


## Content reconciliation: retained ideas and current scope (B242, 2026-11-04)

F1. Full review retains the broken-crossing rescue palette: securing the route versus extracting the traveler, actual knowledge/kit/strength/time, graded recovery and a later scene that reads the recorded result. Bought preparation can substitute for personal craft mastery. Comparable effort is a proposed prototype comparison, not mandatory equalization of genuinely superior powers under AD22/AD38. A real deadline scheduler is needed only where a selected event has an actual deadline; saving the premise does not create one.

F2. Commit must revalidate the quoted means and preserve actual inputs/outcome/history across pending and settled saves. Fixed event identity/draws prevent replaying one resolution as new rewards, while a genuine selected time/fate mechanic can define a different replay policy. Prior supply commitment, later injury and route repair are separate effects. The first occurrence waiting for the player is local proposed behavior, not a claim about all events or current global absence policy.

F3. The Oct1 question about selecting the first playable event is historical; current campaign/task owners govern build order. It does not insert a rescue event ahead of Klein or Harry, demand a new approval for routine already-authorized prototype choices, or silently select permanent peer death. AD42 makes human review optional; AD36/AD43 govern selected proof. Under AD32 this premise and severity remain proposals, with no new runtime, save namespace or source claim established here.
