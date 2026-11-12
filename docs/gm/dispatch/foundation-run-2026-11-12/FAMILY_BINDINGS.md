# Family: bindings (Wave 12 lane design)

*Proposal throughout (AD32), 2026-11-12. Lane `codex/w12-bindings`. Codes: PC98 (family), PC99 (order), PC23 (custody), PC32c (carried by a body), KW22-KW26 (identity), KW35-KW39 (oaths), PFP3, PFP11, AD5, AD38, AD56. Engine first (PC95): tests and the headless engine world, no `src/main.js`, no UI.*

## The shape

A binding is a lasting relation between two holders, written as data and read from records. One module, `src/binding.js`, names no world and holds no world number; every amount, period and threshold arrives in the binding's own data from the caller's pack.

```
defineBinding({id, sides: {a, b}, madeAt, endsAt?, price?, enforce?,
  terms:   [{id, kind: 'forbid'|'require', owes: side, match, by?, penalty?}],
  upkeep:  [{id, owes: side, match, every, from?, gain, loss}],
  standing:{start, max, strainAt, lapseAt, breachLoss},
  channel: {senses: {a: [fields], b: [fields]}, shares: [{id, what, from, to, num, den}],
            answers: [{id, match, role, to: side, bonus?, otherwise: {enforce, effects, costs, cause}}]},
  onDeath: {a: {effects, cause, passesTo?}, b: {...}},
  exits:   [{id, kind, by, consent: [sides], costs, effects, cause, to?}]})
```

Sides are ids. In the fixture they are kernel identity ids, so a side is read through `identityReader` at whichever facet the reader needs (body, item, carried).

## What oaths already cover, and what this adds

| Need | Carried by | New here |
| --- | --- | --- |
| A forbidden act with a price, paid once | `defineOath` forbid term, `oathAuthority` (KW36-KW38) | Nothing. `bindingOaths` compiles each side's forbid and require terms into one oath whose vower is that side's current holder |
| A duty with a deadline | require term, `dueOathBreaches` (KW39) | Nothing |
| Upkeep that recurs | One small oath per period per upkeep row, id `binding/upkeep/n`, deadline at the period end; a missed period is a `dueOathBreaches` row | The expansion, and reading a kept or missed period as a standing change |
| Loyalty that moves with treatment | | **Standing**: derived from start, kept periods (gain), missed periods (loss) and breaches (breachLoss), folded in time order and clamped. The saved inputs suffice to derive it |
| A two-way channel | | **Channel**: `senseThrough` (fields of the other side through a reader), `sharedEffects` (a portion of an effect on one side lands on the other), `answers` (an act through the bound thing answers its bound side; anyone else gets the `otherwise` consequence through KW35) |
| Death, transfer, ending | | **A dated log** of events (`death`, `exit`) beside the receipts. State derives from binding + log + receipts at absolute minutes, so one jump and many agree (KW5) and the save is the binding data plus the log |
| Custody against binding | Identity facets (KW22-KW25) and the owner that answers for them | A stolen sword reads custody from its owner and the bond from the binding (KW23) |

## Standing and status

`bindingState(binding, {now, receipts, log})` returns `{status, standing, sides, since, cause}`. Status is `held`, `strained` (standing at or under `strainAt`), `lapsed` (reached `lapseAt`), `broken` (a breach under a binding whose `standing.breachLoss` is `'all'`, or a break exit), or `ended` (expiry, release, death, buy-out). Default: a lapsed binding stops reading later upkeep, and making it again is a new binding at a new price. Dial: `lapseAt` absent means standing can sit at zero and recover. Reason: trust that is gone is rebuilt, not resumed.

## The bound side acts (PFP11)

`boundSideOptions(binding, state, side, condition)` lists what that side can do now: stay, each exit it may take with the cost, and a leaning (`stay`, `bargain`, `resist`, `leave`) read from standing against the thresholds and from its condition (the caller passes hunger, harm or whatever its pack tracks). The list is for the side's own agent; nothing here decides for it. A lapse is the bound side leaving: `dueBindingEvents` reports it and the host publishes the custody change through the custody owner.

## Ways around (defaults, each with a reason and a cost)

| Way | How it runs | Cost |
| --- | --- | --- |
| Break it | `penalize` is the default: the act settles with the penalty attached. `prevent` is a world's dial, and a `break` exit still opens it | The term's penalty, or the exit's price |
| Loophole | A term matches the method, operation and roles it names. An act by another route or through another person does not match | Whatever the other route costs (a go-between's fee in the fixture) |
| Buy-out | An `exit` of kind `buyout`, with the other side's consent listed or not as the terms say | The exit's costs |
| Hand the duty over | An `exit` of kind `transfer`: from that minute the side is the newcomer, and later oaths name them as vower | The exit's costs, and the consents listed |
| Outlast it | `endsAt`; upkeep ends with the agreement | Time |
| Strain and lapse | Stop paying upkeep; standing falls to `lapseAt` | What the channel gave |
| Take the bound thing | Custody moves at its owner; the bond stays. The taker gets the `otherwise` answer, and may force a `transfer` exit whose `consent` is empty | The `otherwise` consequence each use, or the forced exit's price |

## Carried by a body (PC32c)

A carried holder is a binding whose side `a` is the body and side `b` the passenger, with upkeep the body pays, a channel the passenger senses through, a share of the body's harm, `onDeath` for either side, and removal as an exit. The passenger's identity gains a `carried` facet owned by `binding`, keyed by the binding id; a reader for that owner answers with the host and status, so custody reads the relation and nothing is copied.

## Files

| File | Change |
| --- | --- |
| `src/binding.js` | New. Imports `basics.js` and `kernel_oath.js` |
| `tests/binding.test.js` | New. Five rows, fixture pack data at the top of the file |
| `docs/KERNEL_WORKING_CONTRACT.md` | Not edited. Requests go in `CODEX_RETURN.md` |

## Tests

One test per worked row (tamed animal, familiar, contract with a loophole and a buy-out and a taken-over duty, sworn item stolen and re-bound, a Gu carried by a beast), each checking one jump against several and a serialize and restore in the middle. Rows 2 and 5 keep both holders in an engine world: the channel reads world quantities and shared harm lands through `applyEngineOps`. Row 1 uses `creature_lifecycle` for custody and practice. Row 4 and 5 use `kernel_identity`. One more test reads `src/binding.js` and fails on a world name.

Checks: `node --test tests/binding.test.js tests/kernel_oath.test.js tests/kernel_identity.test.js`, `npm run check:arch`, `npm run check:rules`.
