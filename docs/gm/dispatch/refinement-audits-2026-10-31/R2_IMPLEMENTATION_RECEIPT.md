# R2 implementation receipt: halfpence and exact change

2026-11-03. Branch `claude/mech-r2-halfpence-d3357b`. **Implemented, below the AD43 floor** (no browser run, no save round trip). Agent-verified, not human-reviewed. Owners: ECC25, ECR16, ECX6; backlog row R2/U4.

## Before coding

| Item | Answer |
| --- | --- |
| Seam | `src/economy_domain.js` setPurse/addPurse (the one purse); pure leaf `src/currency_subunits.js`; quote validation in `src/cast_exchange_adapter.js`; display `src/ui/local_money_label.js` |
| Consumer | ch56 P036 (one-eighth soli = 1.5 pence, halfpence exist); also KJ3V ch45 P017 (two pennies and four halfpence) |
| Failure scenario | a 0.5% fee on a small sum rounds to zero or is charged per coin; change creates or loses a halfpenny; whole-number saves change on load |
| Persistence | no migration: `character.money` stays one number in pence, whole values load unchanged, a halfpenny is x.5. Writes off the halfpenny grain throw |
| Dials | grain (default 1 in quotes, 2 for Tingen purse writes; reason: smallest coin); fee rounding `up` by default and never to zero for a nonzero fee (reason: a fee that reads free is wrong); credits `down`, tender `nearest` |
| Test file | `tests/currency_subunits.test.js` |

## Checks

| Check | Result |
| --- | --- |
| `node --test tests/currency_subunits.test.js` | 7 pass: fee up/dial/never zero, change conserves, coin breakdown, labels, purse seam (whole 2760 path, 0.25 rejected), exchange quote (default whole, 3.5 with tender 5 change 1.5, bad change rejected) |
| `tests/cast_exchange_adapter.test.js` (consumer) | 4 pass on the merged tree |
| `npm run build` | passes; dist and index.html rebuilt, not committed (restored) |
| `npm run check:arch` | passes, no growth |
| `npm run check:rules` | FAIL, not from this change: register says WA1-WA53, WORLD_ABSORPTION_RULES.md has WA68 (docs untouched here) |
| Save / reload / import | NOT done: an attempt to inject a 2732.5 save into localStorage was ignored on reload. Code search found no integer check on money in the save path |
| Headless halfpenny price line | NOT done: could not start the Tingen world headless in time (`be_fresh` route needs the fresh-authority probe). Label covered by unit test only |

## Gaps

- Native plan paths still check whole purses (`natural(plan.external.money)` in backlog_expansion_opportunities, heir_inheritance, continuation_retention): a halfpenny purse can be refused or dropped there. Fix before any content spends halfpence for real.
- `fee` helper is not yet wired to the bank fee (ch23); no content row uses `grain:2`.
- Run the Tingen browser walk and Export/Import with a x.5 purse to reach the floor.
