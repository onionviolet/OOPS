# Wave 17 lane E1: cost owners

*Proposal throughout (AD32), 2026-11-12. Lane `fable/w17-costs`. Codes: PC94, PC95, PC98, PC99, PFP3, PFP10, KW5, KW15, KW35, AD5, AD38, AD56. Engine world and headless tests; no `src/main.js`, no UI, no save-format change.*

## The rule

A working publishes cost rows. `settleCosts` in `src/cost_owner.js` settles them in the same call that settles the working: each row is taken from the payer's account in the quantity the world's data names for that cost, by an ordinary substrate `add` whose ledger source is `<owner pack>:cost:<cause>`, where the owner is the pack (or the world vocabulary) that declared the quantity. The module names no world and holds no rate.

```
cost row:  {kind | quantity, amount, payer?, as?}
accounts:  {[kind]: {quantity, per?, as: 'debit' | 'burden', order?, substitutes: [{quantity, num, den}],
            fault: {id, cause, owed: [{quantity, num, den, holder?}], effects: [{sentence, details, per?}]}}}
backers:   [{for, by, kinds?, owed: {quantity, num, den}}]
```

Default order, a dial per account (`order`): the payer's own account, then substitutes at their listed worse rate, then anyone who backs the payer, who is debited and may charge the payer for it (`owed`, for example debt at interest). Reason for the order: people spend their own first. What is still short settles as a **fault**: the working is not refused, the line records the shortfall, and the fault's price from data lands (an amount owed on a quantity, effects through the one effect host, or both). `paidPermille` tells the family how much was covered, and the family decides what a short payment means for its own result. A `burden` is a cost counted upward, such as strain: it is added, not taken.

Two reports keep gaps visible. A row with no declared quantity, no payer in the world or no whole amount comes back `unowned` with the reason. A shortfall with no fault data comes back `priced: false`.

## Map: where the engine world publishes a cost

| # | Publisher | Cost | Before | Now |
| --- | --- | --- | --- | --- |
| C1 | `binding.js` making price (`price.costs`) | data rows | Accepted, not validated, charged by nothing | Validated; `bindingDues` names the paying side; debited (fixture) |
| C2 | `binding.js` exit price (`takeExit().costs`) | data rows | Returned to the host, charged by nothing | Debited through `bindingDues`; a short buy-out still ends the binding and leaves the fault |
| C3 | `binding.js` term penalties, `otherwise` answers, `kernel_oath.js` penalties | rows on a working receipt (`truth.costs`, KW35) | Charged by nothing | `receiptCosts` reads them; the host call is the same as C8. Not exercised in this lane's fixture |
| C4 | `stored_working.js` authority `costs` at firing | rows from `ports.authority` | Listed on a refused receipt, dropped on an allowed one | Debited from whoever fired, allowed or refused, when the caller passes `costs` |
| C5 | `stored_working.js` recharge, renew, break force | pack price in a quantity | Debited; a short payer was refused (`resisted: price`) | With `costs`: pays what it can, restores or lands that share, fault price applies. Without `costs` the earlier refusal path is unchanged |
| C6 | `stored_working.js` charge and draw per firing | reservoir or a holder's quantity | Debited (record, or substrate `add`); short fires scaled or goes dormant | Unchanged. Not routed through accounts, so no substitute or backer |
| C7 | `body_alteration.js` activation (`quoteActivation().strain`) | a number | Added by the test host by hand | Also published as a cost row, a burden on the row's own course, landed by the cost owner; ledger shows `l.body_alteration:cost:activation` |
| C8 | `process_law.js` exposure steps | none published (PCR3: nothing was spent to keep a forge hot) | Nothing | `options.costs` step data (fuel by the minute from the medium, wear by the step from the tool) is published on the receipt and debited at each step |
| C9 | `l.body_alteration` upkeep | pack rates | Debited by the pack's law; an empty supply drives the course (`unmetPerMinute`), already a priced fault | Unchanged |
| C10 | Effect sentences (`cost` word: stamina, mana, essence) via `effect_host.js` | a word, no amount | Not debited | Not debited. See below |
| C11 | `kernel_working.js` operation `costs` (KW15) in general | rows on receipts | Forecast only | Debited when the host calls `settleCosts(receiptCosts(record, since))` beside landing effects |
| C12 | `m.market`, `g.brew_regulator`, `c.contest` activation | pack-owned quantities | Debited inside their own packs | Unchanged, outside accounts |

## What the fixture proves (`tests/cost_owner.test.js`, 7 tests)

One engine world, one timeline, world data at the top of the file.

1. One jump, minute by minute, and a save and restore at every minute give the same world, records and settlements.
2. Bindings: the making price is paid from the purse and then in grain at three for one; the buy-out is paid by the patron, who is owed debt at three for two, and the rest is a fault written up as debt at double.
3. Stored workings: a refused stranger still owes the toll and gets the fault; an allowed firing pays in grain and through the backer; a recharge with too little ink restores its share and the fault lands as harm through the effect host.
4. Body alteration: the activation price lands as strain by its owner pack, and the second activation reads the first one's leftover strain.
5. Process crafts: fuel and tool wear are debited at each step; the forge runs dry mid-step and the fault wears the tool.
6. Unowned rows and unpriced faults are named; the input world is not edited.
7. The shared module names no world and holds no number beyond permille.

## Still undebited, or below the bar

| Code | Gap | What it needs |
| --- | --- | --- |
| R1 | Effect sentences carry a cost word with no amount (C10), so spells through the effect host charge nothing | A cost amount in `details` and a world key from cost word to account. `effect_grammar.js` is a hot file; request: let `lowerEffect` return `costs: [{kind: sentence.cost, amount: details.cost}]` when `details.cost` is present |
| R2 | The kernel does not know a step was short. The fault sits beside the receipt, not on it | Request for `kernel_working.js`: an optional `ports.settleCosts` called in `settleStep`, with its answer kept as `truth.paid`, so a quote and a settlement share it |
| R3 | A short fuel payment does not cool the forge; the exposure still runs at full heat | The process law reading `paidPermille` as a drive, or fuel as a need row (PCN2) |
| R4 | C3 is reachable through `receiptCosts` and is not run in this fixture | One oath row in a later scene |
| R5 | C6 draw and C12 pack-internal costs bypass accounts, so they have no substitute or backer | Move each to a cost row when a scene needs a way around |
| R6 | No game host calls `settleCosts` yet; stored workings keep the refusal path unless the caller passes `costs` | Host adoption at tie-in |
| R7 | The debit is a direct `add` attributed to the owner, not an effect the owner pack answers | A `cost.due` effect kind with owner reactors, if an owner needs to react to being paid. That needs a row in `engine_world.js` |
| R8 | A backer has no say and no limit beyond their balance | Consent and limits belong to the actor chain (E7) and to bindings |

## Files

`src/cost_owner.js` (new), `tests/cost_owner.test.js` (new), `src/binding.js` (`bindingDues`, price validation), `src/stored_working.js` (optional `costs`), `src/body_alteration.js` (cost row on the activation quote), `src/process_law.js` (`options.costs`).

Checks: `node --test` on the 17 test files that import a changed module plus `tests/stored_working.test.js`, all passing; `npm run check:arch` exit 0. `check:rules` and `check:docs` are left to the fold.
