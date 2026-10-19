# Combat and conflict core audit (repeatable)

Saved 2026-10-18 with the first run. A standing procedure for re-auditing fights,
encounters, enemies, weapons in use, defeat outcomes, fleeing and pursuit,
captives, duels, war and nonviolent conflict. One instance of the
[topic expansion audit playbook](TOPIC_EXPANSION_AUDIT_PLAYBOOK.md).

Running it produces proposals. It never selects build scope, changes a standing
priority or turns deferred work into a gate (AGENTS.md).

## What it keeps current

| Owner | Role |
|---|---|
| [Combat and conflict palette](../COMBAT_AND_CONFLICT_CONSIDERATIONS_2026-10-18.md) | Root palette, rounds appended (CBC, CBX, CBL codes) |
| [Combat rules](../COMBAT_RULES.md) | Rulebook CBR1–CBR30, accepted 2026-10-18 (see RULES_INDEX), registered there |
| [W2 combat grammar](../worlds/world-core-kit-2026-10-14/W2_LAWS_POWER_COMBAT.md) | Per-world K10 rows; extended, not replaced |
| [First run dispatch](../gm/dispatch/combat-2026-10-18/) | Lane outputs C1 and C2 |
| Sibling owners | Body and health rules (BHR), tools palette (TQ, IP), encounters and pursuit, weaponcraft palettes, rivals and fate, means and appraisal |

## When to rerun

| Trigger | Lanes to rerun |
|---|---|
| Code changes to `src/models/combat.js`, `src/combat_math.js`, `kill_player`, the saved battles, durability, pursuit or opponent display | C1 (owner map and engine fit) |
| A world or book is added or deep-dived | C2 by-world rows for that world |
| Body rules, tools palette or making rules change a shared contract (conditions, instrument profiles, wear) | Root round on CBC-B, CBC-C |
| Weibao accepts, rejects or edits a CBR rule | Update the rulebook status and RULES_INDEX; no lane |

## Lanes

| Lane | Scope | Output |
|---|---|---|
| C1 | Owner map across docs; engine fit with file:line seams and cheapest steps | `C1_OWNERS_AND_ENGINE.md` |
| C2 | Game references, per-world canon, design angles | `C2_REFERENCES_AND_WORLDS.md` |

First run used two Claude subagents.

## Run log

| Date | Round | What changed |
|---|---|---|
| 2026-10-18 | 1 | Palette CBC1–CBC42, corrections CBX1–CBX5, later list CBL1–CBL10, rulebook draft CBR1–CBR30, lanes C1 and C2 |
| 2026-10-18 | 2 | CBC43, CBR application and composed reflect/rescue/outcome case; no lanes or runtime run |
## Core-rule reconciliation, 2026-10-18

Apply the [shared pass](TOPIC_EXPANSION_AUDIT_PLAYBOOK.md#core-rule-reconciliation-pass-2026-10-18)
to affected future rounds. Codes: CBR2/CBR3/CBR12/CBR25/CBR27, AD19/AD25/AD38, AR3/AR7/AR8.

**Composed case:** Reflect or rescue creates two related outcomes on one action; publish each actual defeat/reward once at the declared resolution boundary. A tracker acts through faculties rather than a tag permission list.

**Current correction:** Combat palette round 2 and the relevant rule owner now carry the
constraint. Current old-save compatibility is deferred; newly built state still
round-trips. Player-facing proof uses current UI_RULES targets. Proposals and
NPC/layout/mobile deferrals keep their status. This is a docs-only rule-fit pass,
not a rerun of source/game-reference lanes or evidence that gameplay works.

Later execution: strong cross-domain agent, medium only when that seam is
selected; reuse the affected existing suite and require a useful rebuilt journey
plus current-state persistence when changed. No lane is dispatched by this entry.
