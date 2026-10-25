# Physical field layer: design note (G7, proposal, 2026-10-23)

Status: **proposal and first slice**, not an accepted decision. Source: gap G7 in the
[Qud parity gap audit](research/qud-systems-audit-2026-10-15/YAIR_PARITY_GAP_2026-10-23.md),
using Qud's field and gravity traces in the
[depth-4](research/qud-systems-audit-2026-10-15/depth-4/REPORT.md) and
[depth-5](research/qud-systems-audit-2026-10-15/depth-5/REPORT.md) reports.
Rules applied: AD38 (things work by how they work), AD22 (limits are adjectives),
AD15–AD17 (game time), AR1–AR8, AR14 (runtime seam), MR1/MR5 (mixtures keep their
truth), SR22 (sites keep state), AD36 (lean checks).

## What is missing, in mechanism terms

YAIR has non-spatial craft mixtures, weather clocks and authored fire scripts. It has
no state that lives in a *place*, moves between *parts* of that place, and changes
by itself with time. Qud's fields (gas, fire, stasis, force) share three things: a
material with properties, a space it occupies, and a per-turn rule that spreads or
decays it. That triple is the whole idea; Qud's tile grid is only its encoding.

## Model: stacked levels per place, no tile map

Each place that holds field material has three **levels**: `floor`, `shelf`,
`rafters` (index 0, 1, 2). Levels give gravity a direction without a map, and give
spread an adjacency (up, down). A place is a Village room, the Shack or any later
site. Default dials per place: vent rate (how fast gas leaves; open air high, closed
cellar low) and level count. Dials are adjectives per place or world, not constants
(AD22).

A level holds:

- `solid`: loose material in the **mixture's own shape**: integer fractions
  `{restore, vigor, trace, matrix}` over a retained mass (fictional-mass units),
  exactly the fields of `mixture_state.js`. Nothing parallel is invented.
- `gas`: `{smoke, fume}` integer units.
- `fire`: whether it burns.

Conservation (MR1): `poured = solid + gas + ash + vented`, where ash is `matrix`
left in the solid. Validate checks it, so a save cannot invent or lose mass.

### Properties come from the mixture fractions

| Fraction | Reading (default, per-world dial) | Why |
|---|---|---|
| `vigor` (Emberseed) | flammable, weight 1.0 | resinous seed burns hot |
| `restore` (bellleaf) | flammable, weight 0.4 | plant matter burns poorly |
| `trace` | becomes `fume` (dense, sinks) when heated or burning | a mixture's trace is its concentrated residue |
| `matrix` (water, salt) | inert and damp: a level with `matrix` over `DAMP_LIMIT` × flammable load will not ignite | wet stock does not burn |

Burning flammable units becomes `smoke` (buoyant, rises). Any item whose retained
fractions are known can be a source: Village mixture products and raw ingredient
packs resolve through the existing mixture owner. Nothing here edits
`mixture_state.js` or `mixture_rules.js`.

### Per-minute rules (deterministic, integer, order fixed)

1. **Fall.** Loose solid in a level above the floor drains a quarter per minute
   (per fraction, rounded up) into the level below. Spilled stock on a shelf
   ends up on the floor, as liquids and powders do.
2. **Burn.** A burning level consumes up to `BURN_RATE` flammable units per
   minute (vigor first). Consumed mass becomes smoke in that level; its `trace` share
   becomes fume. A level with no flammable left stops burning.
3. **Spread.** A burning level ignites the level above and below if it holds
   enough flammable and is not damp. Fire climbs by default; hot smoke does not
   ignite anything in this slice.
4. **Buoyancy.** A third of the smoke in a level rises one level; a third of the
   fume sinks one level. Smoke at the top and fume at the floor pool there.
5. **Vent.** Each level loses `ceil(gas × vent / 10)` units to outside (at least 1 if
   any gas remains), counted in `vented`.
6. **Settle.** Nothing happens when no level burns and no gas remains and solid has
   reached the floor. The place is dropped from state.

Rules are order-fixed and take no random input, so `tick(a+b)` equals `tick(a)` then
`tick(b)`; a save mid-burn reloads to the same future.

### Away time and caps (AD15–AD17)

No second clock and no player offline policy (`main.js` says that is still a
design decision, so `computeAway` stays unwired). Journeys and idle already deliver
their minutes through the registry's `tick(minutes)`; the field domain steps that
many minutes, **stopping early at settle**. A technical bound of 2880 minutes per
call applies; the test proves every state reachable under the pour limit settles
well inside it, so the bound loses no outcome. If a later world loads minutes
differently, it supplies them through the same `tick`.

## Built (second pass, same day), in `src/field_layer*.js`

- Fire and fumes in a place loaded with your own mixtures (vials and ingredient packs), lit by a lit
  oil lamp; Spring water douses a level. Panel "Spilled stock and smoke" (open it from More panels).
- **Collapse and fall.** A shelf or rafters level that burns `COLLAPSE_AFTER` (10) minutes gives way:
  its load drops one level and the level is gone (stock falls past it; nothing can be spilled on it).
  A collapse onto the floor while you stand there is harm.
- **Field blocking.** Each edge between levels can hold sources (`raiseField`, standing or timed). The edge
  blocks fall, fire spread and gas flow while any source remains; removing the last source opens it.
  Player-facing source: bar the hatch. World-facing sources (a ward, stasis) use the same call.
- **People.** The layer reads the person's exposure per minute (burning floor, fumes, smoke, falls) and
  hands the host a bounded harm (`HARM` dials; default 2 health per burning minute, 6 per collapse,
  stamina from fumes and smoke). The host never lets it take health below 1 (AD19). A burning place
  lights its floor through the hero's existing light-source seam.
- **Places.** Ventilation dials per place (closed cellar to open village), with home and workshop
  places on the same dial. Doorways (10-minute connections or less) are recorded where stock is
  spilled; fire burning `SPREAD_AFTER` (8) minutes jumps to a connected floor that can burn, both ways.
- **Weather.** Rain puts out fires in open-air places (ventilation 6 or more), not in closed ones. The
  tick reads whether it is raining when it runs, so a long absence uses that one reading.
- **Away time.** Minutes arrive through the registry tick; `advance` steps up to 2880 per call and stops
  at settle. Tested: the busiest place at the pour cap settles inside the bound, so the bound loses nothing.

Save: slice `fields`, schema 2 (schema 1 from the first pass upgrades by `upgradeFields`).
Missing slice means no fields (AR6, 2026-10-17 decision).

## Open items and reasons

| Item | Why it is not built |
|---|---|
| Smoke dimming light | The hero sums light sources clamped at zero (`models/hero.js`), so a source cannot subtract. A negative-light reader belongs to the hero owner. |
| Burning carried items; burning home thatch | The tick may not mutate item or home owners (AR3). Needs a quoted settlement through those owners. |
| Harm is one injected write into a person | Flagged against AR3: capped, logged, injected by the host. A proper route is a body-owner exposure command (BHR). |
| Panel starts parked | Shell parks unpinned panels; the player opens it from More panels, as for Tools. A box placement belongs to the layout spec owner. |

