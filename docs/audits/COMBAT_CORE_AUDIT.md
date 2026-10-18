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
| [Combat rules](../COMBAT_RULES.md) | Proposed rulebook CBR1–CBR30, registered in RULES_INDEX |
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
