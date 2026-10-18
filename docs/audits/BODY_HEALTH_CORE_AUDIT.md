# Body and health core audit (repeatable)

Saved 2026-10-17 with the first run. A standing procedure for re-auditing bodies,
vitality, injury, illness, poison, needs, healing, medicine, recovery, aging
effects and body change. One instance of the
[topic expansion audit playbook](TOPIC_EXPANSION_AUDIT_PLAYBOOK.md).

Running it produces proposals. It never selects build scope, changes a standing
priority or turns deferred work into a gate (AGENTS.md).

## What it keeps current

| Owner | Role |
|---|---|
| [Body and health palette](../BODY_AND_HEALTH_CONSIDERATIONS_2026-10-17.md) | Root palette, rounds appended (BHC codes) |
| [Body and health rules](../BODY_AND_HEALTH_RULES.md) | Proposed rulebook BHR1–BHR30, registered in RULES_INDEX |
| [Part 35](../worlds/world-depth-2026-10-13/35_HEALTH_INJURY_ILLNESS_DEATH.md) | Earlier palette (H35 codes); extended, not replaced |
| [First run dispatch](../gm/dispatch/body-health-2026-10-17/) | Lane outputs B1 and B2 |
| Sibling owners | Hunger and needs, genetics plan GHS44/GHS86, genetics and brood, nonhuman body docs, tools palette, making rules |

## When to rerun

| Trigger | Lanes to rerun |
|---|---|
| Code changes to HP, conditions, active effects, defeat, rest, body progression, status care or saves | B1 (owner map and engine fit) |
| A world or book is added or deep-dived | B2 by-world rows for that world |
| Tools, making rules or genetics plan change a shared contract (verbs, conditions, fact scope) | Root round on BHC-A, BHC-B, BHC-F |
| Weibao accepts, rejects or edits a BHR rule | Update the rulebook status and RULES_INDEX; no lane |

## Lanes

| Lane | Scope | Output |
|---|---|---|
| B1 | Owner map across docs; engine fit with file:line seams | `B1_OWNERS_AND_ENGINE.md` |
| B2 | Game references, per-world canon, real-world grounding | `B2_REFERENCES_AND_WORLDS.md` |

First run used Claude subagents because Codex was not installed on this machine.

## Run log

| Date | Round | What changed |
|---|---|---|
| 2026-10-17 | 1 | Palette BHC1–BHC31, rulebook draft BHR1–BHR30, lanes B1 and B2 |
| 2026-10-17 | 2 | AD38 accepted (things work by how they work); BHC32–BHC37, BHR21 and BHR30 rewritten, fix plan BHF1–BHF5 |
| 2026-10-18 | 3 | BHC38 and rule-fit case: truth-driven care boundaries, actual body clocks, policy-owned reroute and interrupted-work settlement; no lanes |
## Core-rule reconciliation, 2026-10-18

Apply the [shared pass](TOPIC_EXPANSION_AUDIT_PLAYBOOK.md#core-rule-reconciliation-pass-2026-10-18)
to affected future rounds. Codes: BHR18/BHR28, AD6–AD9/AD13/AD16/AD19, AR7/AR8, MR1.

**Composed case:** An unknown condition reaches a care-needed boundary while a staged activity is running. Truth acts; the shown reason reveals no diagnosis the character lacks. Spend/reserve settlement follows the activity owner, and the body clock is explicit.

**Current correction:** Body palette round 3 and the relevant rule owner now carry the
constraint. Current old-save compatibility is deferred; newly built state still
round-trips. Player-facing proof uses current UI_RULES targets. Proposals and
NPC/layout/mobile deferrals keep their status. This is a docs-only rule-fit pass,
not a rerun of source/game-reference lanes or evidence that gameplay works.

Later execution: strong cross-domain agent, medium only when that seam is
selected; reuse the affected existing suite and require a useful rebuilt journey
plus current-state persistence when changed. No lane is dispatched by this entry.
