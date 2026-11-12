# Chat K · Kernel, checkpoint 2026-11-12

Owner plan: [procedural foundation plan](../../../PROCEDURAL_FOUNDATION_PLAN.md), chat K. Branch `claude/fdn-k-kernel-a28c4b`, fast-forwarded to the wave start 9bbc51363 before work.

## Phase result: kernel working contract v0 published

- Contract doc: [KERNEL_WORKING_CONTRACT](../../../KERNEL_WORKING_CONTRACT.md) (v0.1, KW1-KW14, backlog KB1-KB9, the one-page comparison of the five shapes plus `making_procedure`, answers to sibling requests).
- Module: `src/kernel_working.js` (imports only `basics.js`; names no domain or world).
- Contract tests: `tests/kernel_working.test.js` (16 tests: a seven-test suite per consumer, a Gu equivalence check and the migration).
- Registered: RULES_INDEX register and router rows; AREA_GUIDE start-here row.
- Not registered in `main.js`, `save_files.js` or `display.js` (AR1); no save key changed (MC4 compatibility line: unchanged).

Two existing consumers pass the contract with their own files untouched (adapters in the test file): `gu_procedures.runGuProcedure` + `finishStrengthReversal` on the ch. 961 Strength Reversing recipe, and `creature_methods.planCreatureMethod` on courier-shaped operations. Both pass the time-partition (one jump, every minute, random partitions) and the save-reload-continue tests. Agent-verified, not human-reviewed. No browser pass: nothing player-facing changed and no player journey crosses the module yet (AR10: "engine ready", not integrated).

## PFP2 counts (kernel scope)

| Count | Value | Note |
| --- | --- | --- |
| Canon cases running as data through the kernel | 1 | Strength Reversing Life and Death as a method row over the recipe |
| Bespoke scene modules added | 0 | |
| Separate working shapes in `src` | 6 (unchanged) | `craft_working`, `spell_working`, `creature_methods`, `gu_procedures`, `method_program`, `making_procedure`; plus the kernel. Retirement is the next phase |

## Checks

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/kernel_working.test.js` | 16/16 pass | Adapters live in tests; domain hosts do not call the kernel yet |
| Mutation: settle at call time instead of step time | 4 tests fail as they should (quote, partition, authority x2); reverted | One mutation only |
| `node --test tests/creature_methods.test.js tests/craft_working.test.js tests/kernel_working.test.js` | 28/28 pass | Consumer files unchanged, so this is a sanity run |
| `npm run build` | pass | |
| `npm run check:arch` | pass (main.js growth -1 from the wave, others 0) | |
| `npm run check:rules` | pass; warnings pre-existing (TMR1 in `book_world_hp_exams.js`, a stale private_packs glob) | |
| Full `npm test` | not run | Integrator runs it at merge (MC7) |

## What the rules could not express

See KB1-KB9 in the contract: cross-beat Gu modifiers, per-operation matter state in a brew (LT31), start-of-work costs with refund policy, binding search, reservations, rates inside a step, lowering to native commands, several workings settling together, quote cost/odds/cause.

## Next phase (K)

1. Retire one old shape: `method_program` (consumers `hp_potion_reactions`, `mol_light_research`, `feature_expansion_ui` belong to other chats; needs their move or consent).
2. v0.2 on request: KB3 + KB9 (costs, odds, cause on the quote) when A and B embed; KB8 when C and M both need joint settlement.
3. PFP7 join with B and G once their leaves run on the kernel.
