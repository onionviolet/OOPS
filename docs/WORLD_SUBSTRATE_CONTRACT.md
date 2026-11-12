# World substrate contract

*Version **v0** (revision 0), 2026-11-12, chat W of the [procedural foundation plan](PROCEDURAL_FOUNDATION_PLAN.md#the-overarching-system-one-world-the-parts-embed-into). Owner of the shared world the domains act on: quantities, law fields, contact and detail level (O2, O3, O5, PFP10-PFP15, OS6, OS8). A proposal under AD56: it widens play, and every number below is a default with a dial. Changes are versioned requests to chat W. The kernel working (how an action quotes and settles) belongs to chat K; this contract is what that action touches.*

Code: [`src/world_substrate.js`](../src/world_substrate.js), vocabulary [`src/world_quantities.js`](../src/world_quantities.js), sky [`src/world_sky.js`](../src/world_sky.js), reference packs in [`src/world_substrate_packs/`](../src/world_substrate_packs/). Tests: [`tests/world_substrate.test.js`](../tests/world_substrate.test.js) (W1-W10).

## What a world is

A world is a clock (whole played minutes, the root clock of TMR1) and a set of **holders**. A holder is a `place`, a `body` (anything alive) or a `thing`. Bodies and things sit in exactly one place; places sit in none. Every holder carries:

| Field | Holds |
| --- | --- |
| `quantities` | Typed integer amounts, each from a declared quantity with a unit and bounds |
| `ledger` | Per quantity, the net amount each source contributed, so the amounts carry provenance (SPR25) |
| `state` | One slice per pack, keyed by pack id. A pack reads and writes only its own slice |
| `tags` | What the holder is, for packs' `appliesTo` tests |
| `detail` | Places only: `near` (settled minute by minute) or `far` (settled as rates), default far |

**Law fields** are data scoped to a holder, a place or the whole world: `{id, scope, kind, params, source}`. Laws look them up nearest scope first. They can be added, removed or contested by outside ops, so a ward, a dao mark or a charm field is a row, not code (O5). Per PFP14 they serve mechanisms that the source treats as laws, not ordinary numbers.

## The rules (WSC)

| Code | Default | Dial and reason |
| --- | --- | --- |
| WSC1 | **Domains touch the world, not each other.** A pack declares the quantities it reads and writes and gets a view that shows quantities, places, presence, law fields and its own state slice only. Writing an undeclared quantity throws. | A direct import between packs needs a reason in the pack's checkpoint (PFP10). The contact test reads each pack's import lines. |
| WSC2 | **One vocabulary.** Shared quantities are named in `world_quantities.js` with unit and bounds; two packs that declare one name must agree on both or composition fails. | A quantity used by one pack stays in that pack. A new shared entry needs a reader and a writer in two packs (PFP5). This is the guard against generic sludge. |
| WSC3 | **Whole units.** Amounts and per-minute rates are whole numbers in the quantity's unit. | Fractions live inside a pack's own state (the thermal leaf keeps float seconds). Whole units make one jump and many steps give equal totals exactly. |
| WSC4 | **Two kinds of law.** A *linear* law reports per-minute `rates` and the `watches` (threshold predicates) its behaviour depends on. A *closed-form* law reports a `horizon` (minutes until its behaviour can change) and an `advance(k)` that settles its own state exactly over k minutes. Either may have a boundary `decide`. | A law can mix both. Exponential and anchored processes (the thermal leaf) are closed-form; flows between holders are linear. |
| WSC5 | **Segments.** Time advances in segments. A segment ends at the soonest of: the target minute, any watched predicate flipping, a quantity reaching a bound, any closed-form horizon, or the near step. Inside a segment all rates are constant. | `nearStep` (1 minute) while any place is near. Far places settle as rates in as few segments as the boundaries allow (PFP12, SPR28). |
| WSC6 | **Decisions once per minute boundary.** At every whole minute the advance reaches (the target minute included) each law's `decide` runs once, in fixed order. A later call never reruns a minute already decided. A new world counts its first minute as decided. If any decision would still act on the current state, the next segment is one minute long. | Effects published from decisions fire on a state change, so a reload at the deciding minute cannot publish twice (W3). |
| WSC7 | **Fixed order.** Packs in composition order, then laws in pack order, then holders by id. Effects settle breadth first; present holders react with the place first, then by id. Outside ops apply in the order given. | The order is part of the world: an effect a later pack publishes reaches an earlier pack's law on its next turn, usually the next minute (W5). A reload reproduces the run. |
| WSC8 | **Effects land on whatever is there.** An effect `{kind, place, quantity?, amount?, detail}` first lands on the place's quantity (clamped), then every present holder whose pack has a reactor for that kind may answer with ops: change its own state, add to quantities it writes, move, or publish further effects one level deeper. Moving a body or thing publishes `departed` and `arrived`. | Effects are discrete. Continuous exchange goes through rates. |
| WSC9 | **Cascade depth.** An effect deeper than `cascadeDepth` (4) still lands but nothing answers it; its record is marked damped. | Per world. Runaway loops are also damped by in-world causes (fuel runs out, a predator arrives); the depth dial is the backstop, not the design. |
| WSC10 | **Every outcome explains itself.** Each effect keeps a record (time, kind, place, publisher, depth, cause, who answered). `explainEffect` walks a record back to its root. The ledger says who moved each quantity, including `bound` for what a limit refused, and always sums to the change. | `chainCap` 200 records, oldest trimmed first; `ledgerCap` 24 sources per quantity, older ones merged into `earlier` (SPR30). PFP13. |
| WSC11 | **Bounds clamp, never throw, inside time.** A rate that would push a quantity past its bound settles one clamped minute and then reads as stopped at the bound. Outside ops and saves that put an amount out of bounds are refused. | Bounds are part of the quantity's declaration. |
| WSC12 | **Budgeted.** An advance that needs more than `segmentBudget` (20,000) segments returns `pending` with the world settled so far; the caller calls again. | CX5, TMR8. E records settlement time per simulated day (MC16). |
| WSC13 | **Sky is substrate.** `daylight`, `moon_phase`, `rain` and `day` are quantities of a place tagged `sky`, set at dawn, dusk and midnight by one W law from the root clock, and each change publishes a `sky.*` effect. | Dawn and dusk minute, moon cycle days, rain source (default the native 13-day calendar) and epoch, per world (OS6, AD46). |
| WSC14 | **Saves are a contract.** The save shape is versioned and every revision step has a migration. | See below (OS8, MC4). |

## Pack shape

```js
{
  id: 'b.brew_steam', revision: 0,
  quantities: [WORLD_QUANTITIES.humidity],   // declared, with unit and bounds
  reads: ['humidity'], writes: ['humidity'],
  laws: [{id, appliesTo(holder), rates?, watches?, horizon?, advance?, decide?}],
  reactors: [{id, on: ['smoke'], appliesTo(holder), react(view, id, effect)}],
}
```

The plan's other three pack parts (workings, generators, catalogue rows) are not substrate: workings go through K, generators through P, catalogue rows are the pack's own data. A pack id starts with its chat letter (`b.`, `l.`, `g.`, `w.`).

Ops a law or reactor may return: `state` (its own slice), `add` and `set` (quantities it writes), `carry` (start carrying a quantity), `publish`, `move`, `law_add`, `law_remove`. Outside callers (a kernel settlement, a player action) also have `holder_add` and `holder_remove`, through `applyWorldOps(rules, world, ops, cause)`.

## Entry points

| Call | Does |
| --- | --- |
| `composeSubstrate({packs, quantities, dials})` | Merges packs into frozen rules; checks vocabulary agreement and declarations |
| `createWorld(rules, {clock, holders, lawFields})` | A validated world |
| `applyWorldOps(rules, world, ops, cause)` | Outside changes at the current minute; effects settle at once |
| `advanceWorld(rules, world, toClock)` | `{world, segments, pending}` |
| `readQuantity`, `readProvenance`, `explainEffect` | Reading and cause chains |
| `substrateFacts(world, id)` | `self.<q>`, `here.<q>`, `world.clock` in the simulation predicate shape, for `meets` rules |
| `serializeWorld`, `restoreWorld`, `migrateWorldSave` | The save contract |

Every call returns a new world and leaves its input untouched.

## Save shape (OS8)

```json
{"schema": "oops.world-substrate", "revision": 0, "clock": 190, "decidedAt": 190, "seq": 25,
 "holders": {"workshop": {"id": "workshop", "kind": "place", "place": null, "tags": [],
   "quantities": {"humidity": 74}, "ledger": {"humidity": {"b.brew_steam:batch:batch": 124, "bound": -34}},
   "state": {}}},
 "laws": [], "chain": []}
```

- Each domain's save keys hang from `holders[id].state[packId]`. A slice for a pack this build does not load is kept untouched, so a world saved with the Gu pack survives a build without it.
- `migrateWorldSave` runs one migration per revision step and refuses a save newer than the build. v0 has no earlier shape, so its table is empty.
- Compatibility line (MC4): **unchanged.** v0 adds no key to the game save. Wiring the substrate into `state` is the embed phase, and it will add one namespaced slice through the domain registry (AR1-AR16).

## Detail level

Near and far are the same settlement with a different step. A place marked `near` caps segments at `nearStep`; otherwise segments run to the next boundary. W3 runs one contact case near and far and finds equal quantities, ledgers, effect records and pack state, with far using under half the segments. A room draining to its bound settles 600 minutes in at most 3 segments (W7), and 20 days of sky in about three segments a day (W8).

## The first contact case (for chat E)

**CC1 · Steam and the shell.** One workshop place with humidity. Two packs that never import each other:

- **`b.brew_steam`** wraps the existing thermal leaf (`craft_process_thermal.js`) closed-form. While the burner is lit it steams 4 humidity a minute into its place. When the burner goes out it publishes `smoke`.
- **`l.shell_regulator`** is the living regulator of `living_regulator.js` and the meadow shell (`SHELL_LAW`) on the substrate. A shell body watches its place's humidity with hysteresis, and a linked inlet follows it after a delay. Open drafts the air dry; closed lets it recharge. Smoke startles the shell shut for 15 minutes. W1 holds minute-by-minute parity with `advanceLivingRegulator` in open, closed and linked modes.

The exchange: the brew's steam is a quantity the regulator reads, and the brew's smoke is an effect the regulator answers. The startled shell's pull then closes the inlet one turn plus its delay later. The departure case (PFP7, LT31) is W4: the keeper carries the shell out mid-brew, the inlet stays latched where its last correction left it, the stored heat keeps working, and the smoke lands with nobody to answer it.

E's harness can start from `tests/world_substrate.test.js` fixtures: `composeSubstrate({packs: [shellPack, brewPack]})` and the `workshop()` holders.

## What v0 cannot express yet

- **Partitioned detail.** One near place makes the whole world step by minutes. Places that share no holder could settle apart; that waits for E's cost numbers (MC16).
- **Rates between holders by distance or contact area.** Rates are written by laws; there is no built-in diffusion between neighbouring places or between a thing and its place. The first domain that needs it (B for heat moving through a batch and a room) requests it.
- **Effects within a minute.** Everything happens on whole-minute boundaries. A fight's seconds stay in C's own state until a contest needs the substrate.
- **Units conversion.** Units are labels that must match; there is no converter.
- **Calendar profiles.** The sky computes its own day from the root clock and an epoch; reading the day through `dayIndex` and seasons from the world calendar profile (TMR1, TMR2) is the next sky step.
- **Live wiring.** Nothing in play uses the substrate yet. The away-time equivalence harness case (SPR28, `tests/headless/away_bank_equivalence.test.js`) lands when the first domain embeds into live state; W3 proves the substrate's own one-jump, many-step and reload equivalence, not live play.
