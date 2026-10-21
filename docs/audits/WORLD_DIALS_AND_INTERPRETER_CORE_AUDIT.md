# World dials and interpreter core audit (repeatable)

Saved 2026-10-19 at Weibao's request ("send out accordingly" after the dials and
interpreter round). One instance of the
[topic expansion audit playbook](TOPIC_EXPANSION_AUDIT_PLAYBOOK.md). Running it
produces proposals. It never selects build scope, changes a standing priority or
turns deferred work into a gate (AGENTS.md).

## What it keeps current

| Owner | Role |
|---|---|
| [Dials and interpreter palette](../WORLD_DIALS_AND_INTERPRETER_CONSIDERATIONS_2026-10-19.md) | Root list, codes WDI1 to WDI40, rounds appended |
| [Engine expansion, world profiles](../ENGINE_EXPANSION.md#world-profiles-elements-and-small-interactions), [genetics AB7](../GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md), [crafting WR](../CRAFTING_ENGINE.md), [scale plan](../IDEABOARD_SCALE_PLAN_2026-10-19.md) | Sibling owners; link, do not restate |
| `src/rule_modules.js`, `src/check_rule_pack.js`, `src/effect_dsl.js` | The live resolver the proposals extend |

## When to rerun

| Trigger | Lanes to rerun |
|---|---|
| `rule_modules.js` facts, targets or layer ordering change | L2 |
| A world profile format or dial overlay format is decided (scale plan WA10) | L1, L5 |
| A new consumer reads a dial (constitution, crafting, generation, checks) | L1 coverage list |
| Weibao picks a world pair or approves the registry code lane | L5, L3 |

## Run log

| Date | Run | Route | Lanes | Notes |
|---|---|---|---|---|
| 2026-10-19 | Round 1 | Claude sessions (see below) | L1, L2 sent; L3 to L5 held | Codex subscription usage not verifiable from this chat, so no Codex lane was launched (AU1, AU5). L1 and L2 returned the same day and are folded in the palette (WDI41 to WDI45 corrections first). Session ids are in the palette's dispatch note |

## Lane rules (COMMON)

- Doc output only; exactly one owned output file per lane, path below, nothing else edited.
- Read first: [palette](../WORLD_DIALS_AND_INTERPRETER_CONSIDERATIONS_2026-10-19.md), [RULES_INDEX](../RULES_INDEX.md) router, ARCHITECTURE_RULES AR1 to AR16, GENERATION_FOUNDATION_RULES GR1 to GR17.
- Label evidence SHOWN, STATED, INFERRED or MEMORY; cite file and line for code.
- Default, dial, reason; no never/always/only; no either/or questions; no em dashes.
- Do not touch `.codex/config.toml`, `dist/*`, `index.html`, the acceptance-prep docs, USER_VISION, IDEA_INDEX or PROJECT.md. Commit nothing, switch no branch, push nothing.
- Start with a CHECKPOINT line at the top of the output file; end with open questions and what was not checked.

## Lanes

| Lane | Output file | Applies |
|---|---|---|
| L1 fact vocabulary governance | `docs/audits/world_dials_2026-10-19/L1_FACT_VOCABULARY.md` | GR5, GR12, AD7, AD38, AR3 |
| L2 resolver feasibility | `docs/audits/world_dials_2026-10-19/L2_RESOLVER_FEASIBILITY.md` | AR1 to AR16, GR1 to GR17, MR |

## Rerun note

Start the next run by checking `src/world_pack*.js` and `src/rule_modules.js` for changes, then rerun L2 first. The first run missed the world pack profile code; the owner map for any rerun must list it.

## Round 2: materials, tags, places and display

Owner for the codes: [CRAFTING_ENGINE Round 6](../CRAFTING_ENGINE.md#round-6-2026-10-19-tags-subtle-properties-new-material-families-places-and-display)
(TQ, NX, PG, UV). This audit only records the run, because the topic already has an owner.

| Date | Round | Route | Lanes | Notes |
|---|---|---|---|---|
| 2026-10-19 | Round 2 | Claude sessions, doc only (Codex usage unverified, AU1/AU5) | MQ-A tag inventory (existing L1 session, new file), MQ-B display placement (fresh session) | MQ-A and MQ-B returned the same day and are folded in CRAFTING_ENGINE Round 6 (TQ16 to TQ20, UV15 to UV16). Per-world source lane held (AU budget, deep-dive route). Outputs in `docs/audits/materials_tags_2026-10-19/` |

Owned files: MQ-A `docs/audits/materials_tags_2026-10-19/MQ_A_TAG_INVENTORY.md`; MQ-B
`docs/audits/materials_tags_2026-10-19/MQ_B_DISPLAY_PLACEMENT.md`. Lane rules are the COMMON list above,
plus: read CRAFTING_ENGINE Round 6 first; comparison against live definitions needs file and line.

## Round 3: alchemy and procedural interactions

Owner: [CRAFTING_ENGINE Round 7](../CRAFTING_ENGINE.md#round-7-2026-10-19-alchemy-and-procedural-interactions-from-tier-difference-and-tags) (IX1 to IX24). One doc lane sent, IX-A, `docs/audits/materials_tags_2026-10-19/IX_A_INTERACTION_MODEL.md`. Dominance search and tier vocabulary held.

## Round 4: rule grammars and derived detail

Owner: [WORLD_RULE_GRAMMARS_AND_DERIVED_DETAIL](../WORLD_RULE_GRAMMARS_AND_DERIVED_DETAIL_2026-10-19.md) (DG1 to DG30). IX-A returned and is folded in CRAFTING_ENGINE Round 7 (IX25 to IX29). Lanes sent: DG-A1 (HP, existing private notes only) and DG-A2 (D&D SRD structured data), outputs in `docs/audits/world_grammar_2026-10-19/`. LOTM, cultivation and comic grammars held (AU budget).

Round 4 fold: DG-A1 and DG-A2 returned the same day and are folded in the grammar palette (DG31 to DG35, corrections first).

## Round 5: per-world meters

Owner: [dials palette Round 5](../WORLD_DIALS_AND_INTERPRETER_CONSIDERATIONS_2026-10-19.md#round-5-per-world-meters-bars-2026-10-20) (WDI46 to WDI60). Done in the controlling chat on 2026-10-20 from existing code reads (energy policies, vitals readers, LOTM actions); no lanes sent. M1 to M4 held for Weibao's go.
