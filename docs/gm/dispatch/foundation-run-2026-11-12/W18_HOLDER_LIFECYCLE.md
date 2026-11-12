# Wave 18 E12: holder lifecycle (proposal)

Finish line E12: birth, death, copy, split, merge, and a cohort becoming individuals and back are world acts that keep identity history and hand quantities on. This closes audit finding AF4 for the engine world. It is a proposal, agent-verified by `tests/holder_lifecycle.test.js`, not human-reviewed. Nothing here is wired into the game.

## What was built

One op in the world substrate, `{op: 'lifecycle', act, ...}`, with seven acts. A pack law or reactor may use the acts its pack declares (`lifecycle: {acts, fault, innate}`). An outside caller may use any. A landed effect carries one in `act.lifecycle` (`applyEffect`), riding the verb in `LIFECYCLE_VERB` and answering a block on that verb over `position`.

| Act | Shape | What it does |
| --- | --- | --- |
| create | `{value, parents?, from?}` | New holder. Its starting amounts are drawn from `from` in order: holders, then `row:<name>` for the rest (default `row:lifecycle.made`) |
| copy | `{holder, value: {id, ...}, from?, innate?}` | New holder with the source's kind, tags, properties, pack state and amounts. Refs stay with the source |
| end | `{holder, remains?, to?, routes?}` | Holder leaves. Remains (a thing by default) take every amount, the properties, state and refs. Law fields scoped to it follow the remains or lapse |
| split | `{holder, into: [{id, share}], keep?, to?}` | Each part takes `floor(amount * share / all shares)`. The rounding rest stays with a kept holder, else goes to the first part. Cohort members divide the same way |
| merge | `{holders, value \| into, to?, routes?}` | Amounts summed into a new holder, or into one that survives |
| promote | `{holder: cohort, ids, kind?, value?}` | Each individual takes one head's share, `floor(amount / count)`, and the cohort's shared properties and state. Count drops |
| demote | `{holders, into: cohort}` | Individuals fold back: amounts added, count raised |

Cohort is a fourth holder kind: a counted group in a place with shared properties and group-total amounts.

**Lineage.** `world.identity` is a `kernel_identity.js` registry, which now has a consumer. Each holder touched by an act gets an identity with a `holder` facet; an ended holder loses the facet and keeps its history. `kernel_identity.js` gained `recordLineage`, `lineageOf`, `lineageKey`, `ancestorsOf`. A lineage row holds the act, parents or what it went into, the minute and the cause. Read it with `readLineage(world, id)` or `view.lineage(id)`; it works for ended holders. An ended id is not reused, so a history is never overwritten.

**Quantities handed on.** `world.rows` holds named rows: the amount that left the holders through each row, negative for a source. `readTotals(world)` gives held amounts, rows, and their sum; the sum is unchanged by every act. What no named destination takes lands on `lifecycle.unclaimed`, and what a bound forces lands on `lifecycle.bound`, so a leak is visible by name. The older outside `holder_remove` now writes `holder.removed`.

**Faults.** An act that cannot be done as asked changes nothing else, charges the price in the pack's `lifecycle.fault` or the op's `fault` (`{quantity, amount, to?}`, default row `lifecycle.fault`), and publishes `lifecycle.fault` with a reason and a way around. Reasons: id-taken, no-holder, no-place, short, occupied, not-cohort. A malformed op or an act the pack did not declare is a contract error and throws, like an undeclared write.

**Design and the trait key (for the saved-dice lane).** A design kept as pack state (W17 G12) goes along on copy, split, promote and remains. The dial `innate` (op, then pack, default `share`) is recorded on the copy's lineage row. `readLineageKey(world, id)` or `view.lineageKey(id)` is the address innate draws should use: a shared copy returns its source's key, a redraw or a birth returns its own id, split parts and remains keep the parent's key, and the nth individual out of a cohort gets `<cohort key>/<n>`. That answers W17 G3: ten clones addressed by this key show the same height. The draw itself is the saved-dice lane's.

## What the test proves

1. Birth from two parents: amounts taken from each, lineage on child and both parents, totals equal.
2. Death: remains hold the body's amounts, properties, state and refs; a law field follows; routes and the unclaimed row balance.
3. Copy: state carried, share and redraw keys, matter from a named row or a named stock.
4. Split 1:2 of 100 gives 34 and 66; budding keeps the holder; merge restores the totals; an overflow goes to a named row.
5. A cohort of 100 gives 3 individuals (97 left), takes them back at 100 with one having gained mass; the next out is `/4`.
6. Nine faults pay their price into a named row and add no holder.
7. A fixture pack law performs birth at minute 40 and two deaths at 70; one jump, 130 single minutes, and a save and restore at 55 give the same saved world.
8. Effects carry copy, end, create and merge; a ward stops one; a fault comes back in `outcome.faults`.

## What `src/creature_lifecycle.js` needs to move onto these acts

Not changed here. To move, per function:

- `settleCohortStock`, `advanceWildHabitat`: a cohort holder per herd (`count` for `stock`, allele counts in pack state). Births and losses become `create` into the cohort (a merge of a counted newcomer) and a count change with a named row. Missing piece: an op that changes a cohort's count with a row, without naming individuals (R2).
- `acquireCreature`, `openCreatureRoster`: `promote`. Its draw address `creature-acquire/<cohort>/<nextIdentity>` becomes the lineage key `<cohort key>/<n>`, which changes existing draws once. Allele removal stays the pack's own state write in the same law step.
- `startCreatureBrood`, `settleCreatureBirth`: `create` with `parents`; the brood id `brood:<a>.<b>.<litter>` stays as the pack's draw address, or moves to the child's lineage key.
- `individual.parents`, `origin`, `serial`, `nextIdentity`: replaced by lineage rows and holder ids.
- It needs a pack wrapper (laws on the substrate shape) first; today it is a state module outside the engine world.

## Open and below the bar

- R1. A cohort's amounts are checked against the quantity's bounds as one holder. Per-head bounds are not modelled; the fixture raises the bound.
- R2. No count-only cohort change (births and losses inside a herd) yet.
- R3. Demote loses per-individual properties and state; the ids stay in the lineage.
- R4. Each act clones the identity registry, and histories have no cap. Fine for tests; E16 should measure it.
- R5. Rate laws still change world totals with no row (the other half of E13).
- R6. The older effect paths (add a thing, copy one property into a new thing) now record lineage but still throw on a used id and still make amounts from no named row.
- R7. Lifecycle acts bypass a pack's `writes` list: declaring the act is the permission.
- R8. Not registered in `src/engine_world.js`; the proof uses a fixture pack.
