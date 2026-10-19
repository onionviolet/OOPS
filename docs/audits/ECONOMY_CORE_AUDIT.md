# Economy, trade, money and property core audit (repeatable)

Saved 2026-10-18 with the first run. A standing procedure for re-auditing money,
prices, merchants, selling and buying, currencies, credit, institutions, wealth
exposure, property and carryover of wealth. One instance of the
[topic expansion audit playbook](TOPIC_EXPANSION_AUDIT_PLAYBOOK.md).

Running it produces proposals. It never selects build scope, changes a standing
priority or turns deferred work into a gate (AGENTS.md).

## What it keeps current

| Owner | Role |
|---|---|
| [Economy palette](../ECONOMY_AND_TRADE_CONSIDERATIONS_2026-10-18.md) | Root palette, rounds appended (ECC, ECX, ECL codes) |
| [Economy rules](../ECONOMY_RULES.md) | Rulebook ECR1–ECR33, accepted 2026-10-18 (see RULES_INDEX), registered there |
| [Markets palette](../gm/dispatch/procgen-2026-10-13/p11/REQUESTS_AND_MARKETS.md) | N1–N10 and M1–M28 (rounds 1–5); extended, not replaced |
| [OD11 cross-world value](../worlds/MULTIVERSE_STRUCTURES.md#od11-local-economies-and-cross-world-value-2026-10-15) | EC1–EC5 |
| [First run dispatch](../gm/dispatch/economy-2026-10-18/) | Lane outputs E1 and E2 |
| Sibling owners | P8 trade supply, continuation owner, means and appraisal, making rules, site rules (custody, claims), subsystem scope ladders |

## When to rerun

| Trigger | Lanes to rerun |
|---|---|
| Code changes to `src/trade.js`, `src/native_trade_transaction.js`, `src/market_saturation.js`, `src/components/trader_component.js`, money in `src/main.js`, or money save keys | E1 (owner map and engine fit) |
| A world or book is added or deep-dived | E2 rows for that world (currencies, institutions, basket) |
| Making, site, continuation or cheat rules change a shared contract (appraisal, custody, carriers) | Root round on the affected ECC section |
| Weibao accepts, rejects or edits an ECR rule | Update the rulebook status and RULES_INDEX; no lane |

## Lanes

| Lane | Scope | Output |
|---|---|---|
| E1 | Owner map across docs; engine fit with file:line seams and cheapest steps | `E1_OWNERS_AND_ENGINE.md` |
| E2 | Game references, per-world money canon, missing angles | `E2_REFERENCES_AND_WORLDS.md` |

First run used two Claude subagents.

## Run log

| Date | Round | What changed |
|---|---|---|
| 2026-10-18 | Markets rounds 1–5 | M1–M28 in the markets palette, with corrections to M7, M19 and M20 |
| 2026-10-18 | 1 | Economy palette ECC1–ECC26, later list ECL1–ECL5, rulebook draft ECR1–ECR31, lanes E1 and E2 |
| 2026-10-18 | 1 fold | Lanes E1 and E2 folded: corrections ECX1–ECX10, angles ECC27–ECC36, ECR6 amended, ECR32–ECR33 added, five missed owners linked |
| 2026-10-18 | 2 | ECC37 and ECR qualifications: belief-based quotes, actual currency units, accounting versus valuation, deferred settlement; no lanes |
## Core-rule reconciliation, 2026-10-18

Apply the [shared pass](TOPIC_EXPANSION_AUDIT_PLAYBOOK.md#core-rule-reconciliation-pass-2026-10-18)
to affected future rounds. Codes: ECR7/ECR9/ECR15/ECR16, AD6–AD9/AD22/AD27/AD38, AR7/AR8.

**Composed case:** A speculative quote need not identify a hidden property. Interrupt a selected deferred service: settle spent and reserved value once; ordinary atomic trade remains atomic. Currency divisibility follows its mechanism.

**Current correction:** Economy palette round 2 and the relevant rule owner now carry the
constraint. Current old-save compatibility is deferred; newly built state still
round-trips. Player-facing proof uses current UI_RULES targets. Proposals and
NPC/layout/mobile deferrals keep their status. This is a docs-only rule-fit pass,
not a rerun of source/game-reference lanes or evidence that gameplay works.

Later execution: strong cross-domain agent, medium only when that seam is
selected; reuse the affected existing suite and require a useful rebuilt journey
plus current-state persistence when changed. No lane is dispatched by this entry.
