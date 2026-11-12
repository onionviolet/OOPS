# World substrate contract

*Version **v1** (save revision 1), 2026-11-12; v0 (revision 0) was the phase-1 shape and migrates on load. Chat W chat W of the [procedural foundation plan](PROCEDURAL_FOUNDATION_PLAN.md#the-overarching-system-one-world-the-parts-embed-into). Owner of the shared world the domains act on: quantities and properties (SB2), effect primitives (SB3), law fields, contact and detail level (O2, O3, O5, PFP10-PFP15, PFP22, OS6, OS8). A proposal under AD56: it widens play, and every number below is a default with a dial. Changes are versioned requests to chat W. The kernel working (how an action quotes and settles) belongs to chat K; this contract is what that action touches.*

Code: [`src/world_substrate.js`](../src/world_substrate.js), vocabulary [`src/world_quantities.js`](../src/world_quantities.js), effect primitives [`src/world_effects.js`](../src/world_effects.js), sky [`src/world_sky.js`](../src/world_sky.js), reference packs in [`src/world_substrate_packs/`](../src/world_substrate_packs/). Tests: [`tests/world_substrate.test.js`](../tests/world_substrate.test.js) (W1-W10) and [`tests/world_effects.test.js`](../tests/world_effects.test.js) (E1-E8).

## What a world is

A world is a clock (whole played minutes, the root clock of TMR1) and a set of **holders**. A holder is a `place`, a `body` (anything alive) or a `thing`. Bodies and things sit in exactly one place; places sit in none. Every holder carries:

| Field | Holds |
| --- | --- |
| `quantities` | Typed integer amounts, each from a declared quantity with a unit and bounds. A keyed family (`energy:mana`, `stock:bread`) shares one unit and bounds across its keys |
| `properties` | Typed values that say what the holder is like: a flag, a level, a label or a set (alive, material, aspects, flammable, senses, concealed, marks, form) |
| `as`, `refs` | Identity (SC7): the kinds a kernel binding may name it as (`gu`, `item`), and the records other owners keep for it (an inventory key, a lifecycle id) |
| `ledger` | Per quantity, the net amount each source contributed, so the amounts carry provenance (SPR25) |
| `state` | One slice per pack, keyed by pack id. A pack reads and writes only its own slice |
| `tags` | What the holder is, for packs' `appliesTo` tests |
| `detail` | Places only: `near` (settled minute by minute) or `far` (settled as rates), default far |

**Law fields** are data scoped to a holder, a place or the whole world: `{id, scope, kind, params, source}`. Laws look them up nearest scope first. They can be added or removed by ops, so a ward, a dao mark or a charm field is a row, not code (O5). Per PFP14 they serve mechanisms that the source treats as laws, not ordinary numbers.

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
| WSC9 | **Cascade depth.** `cascadeDepth` (4) is the number of reacting levels. Effects published by decisions and outside ops are depth 0; an answer is one deeper. An effect at depth `cascadeDepth` or deeper still lands but nothing answers it; its record is marked damped. | Per world. Runaway loops are also damped by in-world causes (fuel runs out, a predator arrives); the depth dial is the backstop, not the design. |
| WSC10 | **Every outcome explains itself.** Each effect keeps a record (time, kind, place, publisher, depth, cause, who answered). The row retains a detached optional `detail` payload across JSON save and restore. Existing revision-1 rows without a payload remain readable, and chain trimming keeps the payload of each retained row. `explainEffect` walks a record back to its root. The ledger says who moved each quantity, including `bound` for what a limit refused, and its entries sum to the change. | `chainCap` 200 records, oldest trimmed first; `ledgerCap` 24 sources per quantity, older ones merged into `earlier` (SPR30). PFP13. |
| WSC11 | **Bounds clamp, never throw, inside time.** A rate that would push a quantity past its bound settles one clamped minute and then reads as stopped at the bound. Outside ops and saves that put an amount out of bounds are refused. | Bounds are part of the quantity's declaration. |
| WSC12 | **Budgeted.** An advance that needs more than `segmentBudget` (20,000) segments returns `pending` with the world settled so far; the caller calls again. | CX5, TMR8. E records settlement time per simulated day (MC16). |
| WSC13 | **Sky is substrate.** `daylight`, `moon_phase`, `rain`, `day` and (where the calendar has seasons) `season` are quantities of a place tagged `sky`, set at dawn, dusk and local midnight by one W law, and each change publishes a `sky.*` effect. Day, minute of day and season come from the world's calendar profile through `projectCalendar`, so `day` equals `dayIndex` (TMR1, TMR2); rain follows the native rain calendar on the native weather minute. | Calendar (world id and the root minute its anchor sits at), dawn and dusk minute, moon cycle days and rain source, per world (OS6, AD46). |
| WSC14 | **Saves are a contract.** The save shape is versioned and every revision step has a migration. | See below (OS8, MC4). |
| WSC15 | **Laws read properties, not categories** (PFP22). A law or reactor selects by what a holder is like (`flammable`, `ignites_at`, `aspects`), never by what it is called. Tags remain for a pack's own bookkeeping. | A property shared by two chats goes in `WORLD_PROPERTIES`; one chat's property stays in its pack (as WSC2). E2: a Gu's heat, a charm, a hot stone and a neighbour's fire all light the hay. |
| WSC16 | **Families, not names per grade.** Energy by kind, stock by good, light by kind, scent by kind and residue by substance are keyed families. Declaring the family covers every key; declaring one key covers only it. | A world adds keys freely (a new essence grade is a key, not a vocabulary change). |
| WSC17 | **Scarcity is derived.** `readScarcity(world, place, good)` reads `stock:<good>` against `want:<good>` of the holders there and is never saved (SPR23). | Days of cover is the default reading; M's price curve and A's wants read it. |
| WSC18 | **One identity, several kinds** (SC7). A holder is the one record of a thing that is an item, a body and a Gu at once. `resolveRef` maps a kernel binding `{kind, id}` to it by id (with the kind in `as` or its physical kind) or by an owner's ref. `substratePort(world)` is K's `ports.read` over the world at its own minute. | Two holders claiming one ref is refused. Custody stays with inventory and K. |
| WSC19 | **Effect primitives are verbs on W objects** (SB3). `applyEffect(rules, world, act, cause)` runs one of twelve verbs (move, add, remove, transform, bind, release, sense, conceal, copy, block, end, alter), the same list as P's effect grammar on quantities, properties, positions or law fields of resolved targets at one minute, and publishes `effect.<verb>` into each target's place. | A new verb needs a canon effect the twelve cannot express and a second consumer (EF2); W and P keep one list (E9). |
| WSC21 | **Effect kinds are vocabulary** (W-B8). A pack declares the kinds it `publishes` and the kinds it `hears` from other packs; shared kinds live in `WORLD_EFFECT_KINDS` and packs import their names. A reactor on an unknown kind is refused at composition and an undeclared publish fails at once. `departed`, `arrived`, `law.lapsed` and the primitives' `effect.<verb>[.<object>]` are built in. | Outside callers declare extra kinds with `composeSubstrate({effectKinds})`. |
| WSC20 | **Counterplay is a verb too** (EF3). `block` is a law field that stops a verb on an object at a scope; `conceal` defeats `sense` on a channel; `release` undoes `bind` and `conceal`; `end` stops a sustained effect (a law field) early; `alter` removes or changes law fields, and a block on `alter` guards a ward. Sustained effects are law fields with `until`, which lapse at that minute's boundary and publish `law.lapsed`. | Durations are whole minutes. |

## Effect primitives and the boundary with P (SB3)

*The table below is W's proposal for the boundary until chat P agrees it (requested in W's checkpoint).*

| Grammar part (plan) | Who owns it | In W |
| --- | --- | --- |
| Verb | W runs it | `act.verb`, one of the twelve |
| Object | W's vocabulary | a quantity (`vitality`, `energy:mana`), `property:<name>`, `position` or `law:<kind>`. P's object names map through `W_OBJECT_OF`: heat to `temperature`, sound to `noise`, essence to `energy:<kind>`, moisture to `humidity`, light to `light:<kind>`, form to `property:form`, relation to `property:marks`; force, lifespan, mind, information, memory and working belong to other owners and are published as effects |
| Target and shape | P composes; X resolves geometry | W resolves `self`, `holder`, `holders`, `place`, `present`, `marked`, `having`; a line or cone arrives as `holders` |
| Time | P and K | instant is the act; sustained is `until` on a law field; delayed or triggered is a K step deadline or a reactor |
| Carrier | P and K | `act.by` records it for the cause chain; nothing in W reads it |
| Cost and source | K's working, paid from W accounts (`energy:*`, `stock:*`) | not in the act |
| Limits | W for bounds, block fields and concealment; P and K for mass, distance and will | `outcome.blocked`, `outcome.skipped` |

A sentence lowers to one or more acts. E8 runs four from the plan: a Moonblade-style cut (`remove vitality` on resolved holders), Polyjuice (`copy property:form`), Spirit Vision (`sense` through `spirit` reading hidden properties) and a Protego-shaped ward (`block remove vitality` on everything bound to a mark, lapsing at minute 10). `outcome` returns what applied, what was blocked and by which field, what was skipped and why, and what a `sense` observed. An observation is returned, not stored: N records knowledge (SB5).

## Pack shape

```js
{
  id: 'b.brew_steam', revision: 0,
  quantities: [WORLD_QUANTITIES.humidity],   // declared, with unit and bounds
  reads: ['humidity'], writes: ['humidity'],
  laws: [{id, appliesTo(holder), rates?, watches?, horizon?, advance?, decide?}],
  reactors: [{id, on: ['smoke'], appliesTo(holder), react(view, id, effect)}],
  properties: [WORLD_PROPERTIES.flammable],  // optional; reads/writes may name properties too
}
```

The plan's other three pack parts (workings, generators, catalogue rows) are not substrate: workings go through K, generators through P, catalogue rows are the pack's own data. A pack id starts with its chat letter (`b.`, `l.`, `g.`, `w.`).

Ops a law or reactor may return: `state` (its own slice), `add` and `set` (quantities it writes), `property` (properties it writes), `carry` (start carrying a quantity), `publish`, `move`, `law_add` (with optional `until`), `law_remove`, `law_params`. The view adds `property(id, name)` and `properties(id)`. Outside callers (a kernel settlement, a player action) also have `holder_add` and `holder_remove`, through `applyWorldOps(rules, world, ops, cause)`.

## Entry points

| Call | Does |
| --- | --- |
| `composeSubstrate({packs, quantities, dials})` | Merges packs into frozen rules; checks vocabulary agreement and declarations |
| `createWorld(rules, {clock, holders, lawFields})` | A validated world |
| `applyWorldOps(rules, world, ops, cause)` | Outside changes at the current minute; effects settle at once |
| `advanceWorld(rules, world, toClock)` | `{world, segments, pending}` |
| `readQuantity`, `readProvenance`, `explainEffect` | Reading and cause chains |
| `readScarcity`, `resolveRef`, `substratePort` | Derived scarcity, identity, the kernel read port |
| `applyEffect`, `resolveTargets` (`world_effects.js`) | The effect primitives |
| `substrateFacts(world, id)` | `self.<q>`, `here.<q>`, `world.clock` in the simulation predicate shape, for `meets` rules |
| `serializeWorld`, `restoreWorld`, `migrateWorldSave` | The save contract |

Every call returns a new world and leaves its input untouched.

## Save shape (OS8)

```json
{"schema": "oops.world-substrate", "revision": 1, "clock": 190, "decidedAt": 190, "seq": 25,
 "holders": {"workshop": {"id": "workshop", "kind": "place", "place": null, "tags": [],
   "as": [], "refs": {}, "quantities": {"humidity": 74}, "properties": {}, "ledger": {"humidity": {"b.brew_steam:batch:batch": 124, "bound": -34}},
   "state": {}}},
 "laws": [], "chain": []}
```

- Each domain's save keys hang from `holders[id].state[packId]`. A slice for a pack this build does not load is kept untouched, so a world saved with the Gu pack survives a build without it.
- `migrateWorldSave` runs one migration per revision step and refuses a save newer than the build. Revision 0 to 1 adds empty `properties`, `as` and `refs` to every holder (E7).
- Compatibility line (MC4): **unchanged.** v0 adds no key to the game save. Wiring the substrate into `state` is the embed phase, and it will add one namespaced slice through the domain registry (AR1-AR16).

## Detail level

Near and far are the same settlement with a different step. A place marked `near` caps segments at `nearStep`; otherwise segments run to the next boundary. W3 runs one contact case near and far and finds equal quantities, ledgers, effect records and pack state, with far using under half the segments. A room draining to its bound settles 600 minutes in at most 3 segments (W7), and 20 days of sky in about three segments a day (W8).

## The first contact case (for chat E)

**CC1 · Steam and the shell.** One workshop place with humidity. Two packs that never import each other:

- **`b.brew_steam`** wraps the existing thermal leaf (`craft_process_thermal.js`) closed-form. While the burner is lit it steams 4 humidity a minute into its place. When the burner goes out it publishes `smoke`.
- **`l.shell_regulator`** is the living regulator of `living_regulator.js` and the meadow shell (`SHELL_LAW`) on the substrate. A shell body watches its place's humidity with hysteresis, and a linked inlet follows it after a delay. Open drafts the air dry; closed lets it recharge. Smoke startles the shell shut for 15 minutes. W1 holds minute-by-minute parity with `advanceLivingRegulator` in open, closed and linked modes.

The exchange: the brew's steam is a quantity the regulator reads, and the brew's smoke is an effect the regulator answers. The startled shell's pull then closes the inlet one turn plus its delay later. The departure case (PFP7, LT31) is W4: the keeper carries the shell out at minute 109, one minute before a correction it was driving is due. The inlet hears the `departed` effect of the body it follows. By default (`onLeave: 'drop'`) the correction stays unsettled and the inlet stays latched where it was; with `onLeave: 'finish'` (an actuator with its own means) it completes that stroke and then stays. Either way the stored heat keeps working, and the smoke lands with nobody to answer it.

E's harness can start from `tests/world_substrate.test.js` fixtures: `composeSubstrate({packs: [shellPack, brewPack]})` and the `workshop()` holders.

## What v1 cannot express yet

- **Partitioned detail.** One near place makes the whole world step by minutes. Places that share no holder could settle apart; that waits for E's cost numbers (MC16).
- **Rates between holders by distance or contact area.** Rates are written by laws; there is no built-in diffusion between neighbouring places or between a thing and its place. The first domain that needs it (B for heat moving through a batch and a room) requests it.
- **Effects within a minute.** Everything happens on whole-minute boundaries. A fight's seconds stay in C's own state until a contest needs the substrate.
- **Geometric target shapes.** Line, cone and radius need places with positions (X). P passes their result as `holders`.
- **Knowledge.** `sense` returns observations; storing who knows what, from which source and how sure is N's (SB5).
- **Units conversion.** Units are labels that must match; there is no converter.
- **Contested law fields.** Fields can be added and removed; stacked fields of one kind simply apply in scope order. Contests between fields (two dao marks interfering) need a rule from G or S.
- **Live wiring.** Nothing in play uses the substrate yet. The away-time equivalence harness case (SPR28, `tests/headless/away_bank_equivalence.test.js`) lands when the first domain embeds into live state; W3 proves the substrate's own one-jump, many-step and reload equivalence, not live play.
