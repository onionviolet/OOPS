# Wave 18, lane E9: one engine host

*Proposal throughout (AD32), 2026-11-12. Lane `fable/w18-host`. Agent-verified by headless tests, not human-reviewed. Codes: PC94, PC95, PC99, PFP3, PFP10, KW3, KW5, KW10, KW11, KW15, KW35, AD5, AD38, AD56, AF1. Engine world and case runner; no `src/main.js`, no UI, no game save change, no build.*

## The rule

The engine world keeps a records slice beside its packs and world. Kernel workings in flight, stored workings and bindings (with their log and what they have published) live there, advance when the world advances, and are written by the one engine save. A caller starts things through engine actions and then calls `advanceEngineWorld`; it writes no loop of its own. Code: `src/engine_records.js` (new), wired through `src/engine_world.js`.

## Records slice

```
save:    {schema: 'engine.world@1', packs, world, records?}
records: {schema: 'engine.records@1',
          workings: {[id]: {law: <law ref>, payer, record: <kernel.working@1>, landed: [{step, at, status, reason?}]}},
          stored:   {[id]: <kernel.stored@1>},
          bindings: [<kernel.binding@1>], log: [...], published: [<event id>],
          dues:     [{at, what, kind, paid?, landed?, reason?}]}
```

Each record keeps its own schema and validator; the slice adds one version of its own. Compatibility: a save with no `records` key (every save before this lane) restores with an empty slice, and a world that holds no records saves without the key, so such saves are unchanged byte for byte. A `records` slice with another version is refused. A working whose law the caller did not pass on restore is kept as saved and waits (`waitingWorkings`), and the rest of the save advances.

What the save cannot hold stays the caller's, like pack settings: `host = {laws, things, costs, effects, ports}`. `laws` are kernel laws by ref (functions), `things` is data for bound things the world keeps no holder for (a medium's temperature, a piece's starting structure), `costs` is the world's price list for the cost owner, `effects` is the keys and reader the effect host needs.

## Advance order, and why

At each stop, a minute at which a deadline, a pulse or a binding date falls:

1. The packs and the world reach the minute, so each record reads today's world.
2. Kernel workings, by id, one step at a time: authority (bindings and their oaths, over the caller's own), the operation, the step's costs debited, its effects landed. Paying comes before landing so a fault's price and the effect are both in the world before the next step reads it.
3. Stored workings, by id. Their pulse reads what step 2 just landed and the chain rows it wrote.
4. Bindings, by event time then id. Upkeep and duties read the receipts step 2 just wrote, so a meal settled at the deadline minute counts; their prices and aftermath land last.

Stops come from the records, so one jump and minute steps visit the same record minutes. An action taken at a minute (`startEngineWorking`, `storeEngineWorking`, `fireEngineStored`, `makeEngineBinding`, `exitEngineBinding`) settles what is due at that minute at once. A pending world advance returns early and resumes on the next call.

## Costs inside the host

- H1: `lowerEffect` returns a `costs` row when it is given an amount, and `sentenceCosts(parts, details)` reads `details.cost` (and `details.payer`). With no amount there is no row, as before.
- H2: `settleWorking` asks an optional `ports.settleCosts` once per settled step, allowed or refused, and keeps the answer as `truth.paid`. With no port, or an undefined answer, the receipt is unchanged. A quote passes `forecast: true` and keeps nothing.
- The host passes `src/cost_owner.js` as that port. Rows the operation published, rows the authority attached (KW35, oath penalties included) and rows carried by the step's sentences are debited from the row's payer or the working's `payer`. A payer who is short gets the account's fault and its price; the working is not refused.

## What joined

| Engine | Example run through the host | Old entry point |
| --- | --- | --- |
| Spellcraft | A cast on the spell effect law (`spell_law.js`): effort debited, the hurt landed; a second cast short of effort lands and takes the rest from the body | `quoteSpells`, direct `settleWorking` unchanged |
| Composition | A two-part move from `composeWorking` (guard, then strike), each part paying at its own step | unchanged |
| Process crafts | The tempered blade: four exposure steps over 56 minutes, fuel by the minute, the dry forge faulting onto the hammer, properties landed on the piece | unchanged |
| Stored workings | A ward on a clock trigger with leaking charge; a touch fired by hand | `advanceStoredWorkings` unchanged, and the host calls it |
| Bindings | A keeper's bond: making price debited, upkeep read from a feed working the host settled, missed meals to a lapse, a priced exit, a refused exit written down | reader functions unchanged |

The case runner takes `working`, `store` and `fire` steps and a top-level `working`. Four cases compute in `tests/fixtures/coverage_cases/working_cases.mjs`: the Shield Charm then a strike, an overdrawn strike, the tempered blade, a ward firing. No ledger row was added; `docs/coverage/README.md` is the coordinator's.

## Still on a private loop

| Code | What | Needs |
| --- | --- | --- |
| P1 | `contest.js` ticks its own record (tenths of a second) | A sub-minute clock (E18) or a contest record kind in the slice |
| P2 | Knowledge checks, teaching and closing (`knowledge_record.js`) run in their test runner | A per-working read port: checks read through `knowledgeRead` and `conditionAuthority`, and the host has one reader |
| P3 | Spellbook drafts (`spell_working.js`) publish `spell.native` labels, which nothing lands | A sentence on those effects, or a host reader for native commands |
| P4 | Gu moves through `gu_move_roles.js`, and held slots (`storeHeld`) | A start action that also lays the held records |
| P5 | Brewing, body alteration activation, creature lifecycle, heredity, cohorts, progression | Each a start through the host; body alteration needs its quote as a working |
| P6 | Stored working draw per firing, market, brew regulator and contest costs | Cost rows instead of direct debits (W17 R5) |

Below the bar: the pending-advance resume and the debit of authority-attached rows (oath penalties, W17 C3) are built and have no test here; a short payment does not yet weaken the effect (no family reads `paidPermille`); a quote through the port prices each step against today's world, not cumulatively; no engine action interrupts a working; paced workings pass their port through untested; finished workings and `dues` stay in the save because bindings derive state from receipts; binding history is recomputed at each stop, and a pulse of one minute forces minute stops (E4, E16).

## What later lanes need from the host

- **E5** (agreement for every pack): add records to the mixed-pack run. The host gives one `play(stops, reload)` shape; E5 supplies births and losses, and has to decide what a record does when a bound holder is gone mid-step (today: `role-unavailable`, interrupted, no price).
- **E7** (actor chain): an actor's plan is a list of engine actions. It needs a quote action that reads through the actor's knowledge (`quoteForActor`) with the cost port in forecast mode, and a consent answer for backers (W17 R8).
- **E11** (one draw root): a saved root in the slice, with `address` (`<working>/<step>`, `stored:<id>:<at>`) as the draw key, and an odds step resolved in step 2 before costs.
- **E12** (birth, death, copy, split, merge): identity acts as engine actions that write the binding log (`death`, `transfer`) and rebind or end records naming the holder; `host.things` should move into holder state so a copy carries its design (W17 design record G12).

## Files and checks

`src/engine_records.js`, `tests/engine_host.test.js`, `tests/fixtures/coverage_cases/working_cases.mjs` (new); `src/engine_world.js`, `src/kernel_working.js`, `src/effect_grammar.js`, `scripts/coverage_report.mjs`, `tests/coverage_report.test.js` (changed).

Reachable from `src/main.js` (`node scripts/reachable.mjs --is`): `src/kernel_working.js` is reachable. The change there is one optional port, off unless a caller passes `settleCosts`, and no game caller does; it was not rebuilt or exercised in a browser. The other changed files are not reachable.

Checks: `node --test tests/engine_host.test.js tests/coverage_report.test.js` 20 of 20; the 54 test files that import a changed module or a family the host calls, 419 of 420 with `docs/research` linked in from the primary checkout (the one failure is `tests/b_coverage_ledgers.test.js` reading a doc the sparse checkout does not have); `npm run check:arch` exit 0. The full suite, `check:rules` and `check:docs` are left to the fold.
