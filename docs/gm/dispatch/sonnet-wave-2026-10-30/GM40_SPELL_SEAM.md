# GM40 spell seam (design note, 2026-10-30)

Status: **implemented, below floor** (focused tests only; nothing is registered in a host, no browser run). All D-codes are proposals.
Rules applied: AD38 (mechanisms, not allowed-outcome lists), AR1-AR16, MR-neutral. Beside [L10](L10_ADVANCEMENT_DESIGN.md) slices 3-4, which it builds on.

## What exists and what this adds

`src/ability_records.js` (GM26) is already the world-neutral row, and its `learn` block already lowers teacher, prerequisites, lesson cost, practice and
mastery to a native power (L10 D7-D10). The seam does not fork that. `src/spell_seam.js` is a wrapper: a spell row is an ability-record row plus four parts
the record lacks, then it lowers through `defineAbilityRecords`.

| Code | Proposal | Reason |
| --- | --- | --- |
| D1 | **origin** is a typed kind: `teacher`, `text`, `observed` (learned: become a `learn` block), `inherited`, `sequence`, `granted` (not learned: the gate becomes a cast condition). | Where knowledge comes from is the one thing five worlds disagree on. |
| D2 | **prepare** is an optional timed command that sets `actor.<prefix>.prepared.<key>`; the cast needs it and consumes it unless `keep`. | HP-style held charms and LOTM rites both prepare; neither needs a new engine. |
| D3 | **failure** = a chance plus typed outcome effects. The chance is the row's, else the adapter default, else none (listed `unstated`). It falls by `perMastery` per mastery above the one needed. The draw is `spellRoll(seed, spellId, castIndex)` from `hash_rng` (pure; the host owns seed and counter). | No source states a number (L10); GM41 says draw from seeded streams. Default none or world dial, reason in the adapter. |
| D4 | **strain** (`carrier, source, weight, protections`) goes to an injected `add(carrier, {source, weight})`, the same shape as `harm_engine.backlashAdder`. `when`: `failure` or `cast`. | harm_state stays the one authority; a world without a ledger refuses strain at authoring. |
| D5 | An adapter is `{worldId, prefix, origins, failure, strain}`, each with a reason: a default, a dial and a reason, never a list of allowed spells. | AD38. |

## Adapters

- **LOTM** (`src/spell_adapter_lotm.js`): typed abilities (`recordFromTyped`) become `sequence`-origin spells (held through the sequence, not taught); divination
  queries map to `granted` spells whose formula is the query's own `means` and `contact`, with the prepare step as D2 and, when a ritual is present, the ritual
  dial's base odds as D3. `defineDivinations` and `defineLotmActs` stay the execution paths and are untouched; the mapping gives them one read model. Strain on, when `failure`.
- **Harry Potter** (`src/spell_adapter_hp.js`), the second world: most spell rows (325 SPL in the family table, 653 in the L10 sample; `hp1_rules` plans exist).
  Teacher, text and observed origins, wand-and-words formula, mastery-driven failure, **no strain** (no backlash ledger). It imports nothing LOTM (tested).
  The tests use a synthetic paraphrased fixture so they always run; a pack row in the private learnable-spells shape maps with `spellFromLearnRow`.

## Evidence (focused)

`tests/spell_seam.test.js`: HP learn/practice/prepare/cast/consume through the native engine, refusal before text and prerequisite; seeded repeatable draw;
strain refused for HP; LOTM typed ability gated by sequence and blocker with `unstated` listed; divination mapping; strain with a protection reaching the ledger.
Neighbours: ability_records, ability_typed_rows, cast_divination_adapter, lotm_act_engine, learnable_spells_packs.

## Not done

Registration (floor-wire, below); a persisted cast counter for `castIndex`; wiring failure `outcome` effects after a draw (the host commits them); faith (separate
feature); GM41 (scale by rung, watching a cast, focus as multiplier); a browser run; any UI.

## Wiring handoff (floor-wire owns `src/simulation.js` and `src/domain_registry.js`)

Proposed, no code change in those files is needed for the commands themselves: `defineSpells(rows, lotmSpellAdapter())` returns `{commands, powers, seeds, definition.sources, spells, cards}`
in the same shape `advanceLadder` already feeds the registry, so register them exactly as `lotm_advancement`'s set is. Two additions need a host:
1. a `castIndex` counter fact per spell, incremented when a `<prefix>.use.<key>` command completes, and the run seed;
2. after completion, `settleSpellCast(spell, id, {seed, castIndex, mastery, masteryNeeded, facts, add: backlashAdder(save).add})`, then commit `result.outcome` effects.
