# R2 implementation receipt: halfpence and exact change

2026-11-03. Branch `claude/mech-r2-halfpence-d3357b`. **Implemented; AD43 floor met except a real-Chrome run** (the proof is the repo's headless runner, see Checks). Agent-verified, not human-reviewed. Owners: ECC25, ECR16, ECX6; backlog row R2/U4.

## Before coding

| Item | Answer |
| --- | --- |
| Seam | `src/economy_domain.js` setPurse/addPurse (the one purse); pure leaf `src/currency_subunits.js`; quote validation in `src/cast_exchange_adapter.js`; display `src/ui/local_money_label.js` |
| Consumer | ch56 P036 (one-eighth soli = 1.5 pence, halfpence exist); also KJ3V ch45 P017 (two pennies and four halfpence) |
| Failure scenario | a 0.5% fee on a small sum rounds to zero or is charged per coin; change creates or loses a halfpenny; whole-number saves change on load |
| Persistence | no migration: `character.money` stays one number in pence, whole values load unchanged, a halfpenny is x.5. Where the dial is on, writes off the halfpenny grain throw |
| Dials | **grain, per world** (`WORLD_GRAIN` in `src/currency_subunits.js`, bound to the live world by one line in `src/main.js` via `bindMoneyGrain`): default 1 = off, today's arithmetic, no purse check (a rate or percentage income elsewhere keeps working); 2 only for `book.lotm.tingen`, the BE seat's Loen purse (reason: the halfpenny is the smallest coin). Exchange quotes take `price.grain` (default 1); fee rounding `up` by default and never to zero for a nonzero fee (reason: a fee that reads free is wrong); credits `down`, tender `nearest` |
| Test file | `tests/currency_subunits.test.js` |

## Checks

| Check | Result |
| --- | --- |
| `tests/currency_subunits.test.js` | 8 pass: fee up / dial / never zero, change conserves, coin breakdown, labels, purse seam under grain 2 (2760 path, 0.25 rejected), dial off elsewhere (0.1 income kept), exchange quote (default whole, 3.5 with tender 5 change 1.5, bad change rejected) |
| `tests/currency_subunits_save.test.js` | pass: live-source build, BE seat enrolled in `book.lotm.tingen`, purse 2732.5 shows "2732½ pence" in `#money_div`, native Save, Export, Import, reload and 2 steps keep 2732.5, no page errors, saving not blocked. Uses the headless runner (`scripts/headless`), not real Chrome |
| `economy_domain`, `heir_inheritance`, `cast_exchange_adapter`, `cast_ability_adapter` tests | 23 + 5 pass |
| `npm run build` | passes; dist and index.html are tracked build output, rebuilt, not committed (restored) |
| `npm run check:arch` | passes; main.js 10110 lines (baseline 10115) |
| `npm run check:rules` | FAIL, not from this change: register says WA1-WA53, WORLD_ABSORPTION_RULES.md has WA68 (no docs touched here) |
| Other failures seen | `tests/book_world_lotm_opening.test.js` imports a missing `canonPullVisible` from `src/canon_pull_panel.js` (master state, unrelated) |

## Whole-purse checks

Made grain-aware (accept whole numbers and halfpenny multiples, still reject anything finer): `heir_inheritance.js` (carried purse and ledger money), `backlog_expansion_opportunities.js` (supply order purse check). `continuation_retention.js` checks the cost, not the purse, so it needs no change.

## Gaps

- Real Chrome from a fresh origin was not run; the headless runner stands in (AD43 line named in the brief). A price line from an actual exchange row with `grain:2` is covered by the quote unit test and the purse label by the save test, not by one combined walk.
- The fee helper is not wired to the bank fee (ch23) and no content row uses `grain:2` yet.
- Dial off is not a guard: in a world with grain 1 a fractional write is accepted exactly as before.
