# Family: body alteration (Wave 12 design)

*Proposal throughout (AD32), 2026-11-12. Owner of the design: the Fable lead for this family. Applies PC94, PC95, PC98, PC99, PFP3, PFP10, KW5, AD5, AD22, AD38, AD56. Engine world only; no game tie-in.*

## Core reading

Everything is possible, reasonably. Capacity is a pressure with a cost curve; nothing in this family refuses an install, a second power or an activation. "One power per person" is a budget whose default capacity is 1 in that world's data. Going past it works and costs more, and each world prices its ways around.

## Row shape (data, authored by a world pack or a fixture)

```
{id, carrier,                      // hardware | bioware | nanotech | genetic | chemical | magical (a label; no law branches on it)
 slot,                             // free text from the world: spine, aperture, blood, pathway
 load: {<budget>: units},          // any budgets the world names: body, mind, aperture, power, tolerance
 upkeep: [{quantity, perMinute}],  // drawn from the bearer; scaled by pressure
 unmetPerMinute,                   // course drive while any upkeep quantity is empty
 course: {key, perMinute, overPerMinute},   // rejection, backlash, strain, dependence: one keyed quantity each
 grants: {quantities: [{quantity, amount}], sentence, details},  // body quantities, or an effect sentence the host lands
 settles: {perMinute, floor},      // digestion: load on each budget falls toward floor
 lasts,                            // minutes, for a dose that wears off (absent: stays)
 activation: {...}}                // optional, see pace
```

## Quantities (all on holders in the engine world, keyed families)

| Quantity | Meaning |
| --- | --- |
| `alteration_capacity:<budget>` | How much fits. Anything may add to it (training, a bigger aperture, a clinic) |
| `alteration_load:<budget>` | What is carried now. Install adds, removal and digestion subtract |
| `alteration_course:<key>` | Rejection, backlash, strain: rises by row drives, falls by recovery |
| `alteration_relief:<key>` | A suppressant, a seal, a regulating Gu: while above zero it blocks a share of that course's drive, and it drains |

Because these are plain quantities, a dose, a clinic (a place law field `alteration.care` that scales recovery) or a second alteration meet them with no code for the pair.

## Cost curve

Pressure per budget, in permille: 1000 while load is at or under capacity. Past it, piecewise linear in the overshoot share, with the breakpoints and slopes in pack settings (`budgets[b].curve`), steeper further out. A row's pressure is the highest among the budgets it loads (default; a world may want the sum). Pressure multiplies upkeep and adds `overPerMinute * (pressure - 1000) / 1000` to the row's course drive. Slots crowd the same way: a slot has room (default 1 in settings); each occupant past room multiplies the newcomer's load by the slot's crowd factor. Nothing is refused.

## Ways around capacity (each runs in the fixture, each has a price)

| Code | Way | How it runs | Price |
| --- | --- | --- | --- |
| W1 | Raise it | `add` to `alteration_capacity` | Whatever the world charges for the raise (fixture: a clinic working with a cost row) |
| W2 | Go past it | Install anyway | Pressure: more upkeep, faster course |
| W3 | Stabilize the excess | `add` to `alteration_relief` by a dose, a seal or a Gu | The stabilizer is itself a row: it loads another budget (tolerance) and wears off |
| W4 | Move the load | Install with `bearer` naming another holder (an item, a familiar) | The bearer's own budgets and course carry it; lose the bearer, lose the grant |
| W5 | Change what counts | `settles` digests load over time | Time, with the course running until it settles |

Fusing two rows into one lighter row is the same W5 idea and is not built in this packet.

## Stages

Each course has thresholds in settings (`courses[key].stages`). Crossing one records the stage in pack state and publishes `alteration.stage`; a stage may name one further publish from data (for example `living.harm`), which reaches the body's harm inbox through the substrate with no import.

## Pace

- Pace is a law field of kind `time` scoped to the holder, with params `{permille, from, to, per}`: a rate, a window in ticks, and ticks per world minute. It is added by the one effect host from the sentence `alter time, self, sustained`. Several fields multiply.
- `src/pace.js` reads the fields into a course and maps holder-local step durations onto the clock: a step ends at the first tick where the integral of pace reaches its cumulative local duration. Deadlines are computed from absolute cumulative durations, so one settlement and many agree (KW5).
- On top of the kernel: `pacedMethod` writes the scaled duration of each step into the method's own `minutes`, so the kernel's record validates unchanged. `retimeWorking` does the same for the unsettled steps of a running record when a window opens later.
- Coarse read: `paceContest` gives, per holder, actions in a window (integral over step cost) and the order of first action. It must equal the count of steps the near run settles.
- Price: activation adds strain as one amount, `perTick * (permille - 1000) * ticks`, multiplied by the row's past-threshold factor read from the body's current strain and by mind pressure. Strain is `alteration_course:strain`; cooldown is strain above the row's threshold, where the next activation still works and costs steeply more. Rest recovers it.
- Kernel request (not built here): a holder-local rate port, so deadlines derive from authored durations at settlement and the snapshot keeps the authored method.

## Files

`src/body_alteration.js` (shared law, pure), `src/world_substrate_packs/body_alteration.js` (pack `l.body_alteration`), `src/pace.js`, one registry line in `src/engine_world.js`, `tests/body_alteration.test.js`, `tests/pace.test.js`, and the count in `tests/engine_world.test.js`.

## Tests

1. Gu in an aperture: load against aperture capacity, feeding as upkeep, unfed raises backlash.
2. Potion: first dose under the power budget is quiet; a second goes past with a rising cost; a stabilizer lowers the course at a tolerance price; digestion brings load down.
3. Bioware and hardware on one body, a suppressant dose lowering rejection, a clinic law field speeding recovery, a bearer carrying one row.
4. Sandevistan: near and coarse totals agree, two users meet at the ratio of their paces, strain feeds stages and recovers, a second activation above the threshold costs more.
5. One jump against many, and save and restore, for every row.
