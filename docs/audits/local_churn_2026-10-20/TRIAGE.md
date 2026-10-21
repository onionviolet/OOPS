# Local churn triage (DWF82), 2026-10-20

21 outputs from `qwen3.8:27b`, 0 failed, about 12 items each, read in full by title and
checked against [round 3](../../DEEP_WORLD_WORKFLOW_2026-10-19.md#round-3-whole-worlds-characters-dialogue-and-a-local-churn-2026-10-20),
[dialogue D1-D6](../../worlds/DIALOGUE_AND_INTERACTIONS.md#inspected-native-fit-and-missing-adapters)
and the existing owners. Machine-drafted and unreviewed; only the survivors below were
re-judged by a frontier pass. Titles alone were read for most items; the one-line bodies were
not re-read beyond the pilot, so each survivor is a lead to check, not a finding.

**Overall read.** Mostly generic and heavily repeated across lenses (rumor, refusal, return visit,
bark and decay recur in nearly every dialogue file). About 8 of roughly 250 items were new
after de-duplication. That ratio is the evidence for DWF83: give the model voice sheets and fact
packets, not headings.

## Survivors (landed in round 3 as DWF87-DWF94)

| Source files | Lead | Landed as |
|---|---|---|
| char-volume 10, char-longplay 5 | Memory growth for named people over years | DWF87 |
| dlg-legibility 1/3, char-legibility 2, dlg-verify 12 | Mark which layer and model produced a line | DWF88 |
| dlg-verify 2/9, dlg-longplay 2/11 | Rumor arrives no faster than travel; rumors decay | DWF89 |
| dlg-longplay 4, dlg-verify 3 | Repeated refusal or persuasion must not farm or wear out | DWF89 |
| world-longplay 3/5, char-longplay 10 | Stale-loop and contradiction counters in the soak | DWF90 |
| world-verify 3, char-verify 7/10/12 | Random-start, cross-world companion, trait and name-collision fixtures | DWF91 |
| char-fidelity 10 | Sealed canary strings in local-model prompts | DWF92 |
| dlg-volume 1, dlg-longplay 5 | Voice swap test: hide the speaker, can a reader tell? | DWF93 |

## Routed to existing owners, not new

- Companion grief, morale, loyalty, drift, independence: [companions](../COMPANIONS_CORE_AUDIT.md).
- Rival decay, re-entry, asymmetric growth: [rivals](../../RIVALS_IDENTITIES_AND_FATE.md).
- Interruption recovery, single consequence writer: D4 and D2.
- Bark spacing and overload, reaction fatigue: DWF78.
- Resource depletion and economy drift: [economy audit](../ECONOMY_CORE_AUDIT.md).
- Source fidelity, attribution, spoiler containment: [world secrets](../../worlds/WORLD_SECRETS_AND_DISCOVERY.md) and S00.

## Dropped, with reason

Mobile, accessibility colour, loading screens, map labels, localization, onboarding, retention
hooks and performance budgets (outside the standing desktop-first UI priority, or owned by UI
rules); player-driven character creation and cultural-bias items (no direction behind them,
too vague to check); generic "testing harness", "regression suite" and "technical debt" items
(no specific defect named).
