# Family: stored workings (Wave 12 design)

*Proposal throughout (AD32), 2026-11-12, by the family lead for PC98 and PC99. Engine first (PC95): proven in tests and the headless engine world, with no game wiring. Every number below is a dial that lives in pack data passed by the caller (PFP3). Codes: SW1-SW12.*

## The shape (SW1)

One plain JSON record, `kernel.stored@1`, made by `src/stored_working.js`. The module names no world, no domain and no quantity.

| Field | What it holds | Default when pack data is silent |
| --- | --- | --- |
| `carrier` | The world holder the working sits on (a thing, a place or a body) | Required |
| `effects` | Effect sentences with details, landed by the one host (`landEffect`) | Required |
| `trigger` | What sets it off (SW2) | Required |
| `charge` | `{now, max, per}` kept in the record, or `draw: {from, quantity}` taken from a world holder at firing | Fires at no charge cost |
| `decay` | `{every, amount}` in whole minutes, counted from an absolute anchor | Holds its charge |
| `actsFor` | Whom it answers at no extra cost: `holder`, `storer`, `anyone` or a named id | `anyone` |
| `mode` | `once`, `repeating` or `held` | `once` |
| `keys`, `strength`, `reach`, `strangerFactor`, `whenCarrierBreaks` | The dials behind the ways around (SW6-SW9) | No key, no resistance, carrier's place, factor 1, spill |
| `stored` | `{by, at, authority}` read when it was stored | Written by `storeWorking` |
| `receipts`, `status`, `watch` | What happened, `armed / dormant / spent / broken / lost`, and the cursors that keep settlement partition-free | |

Targets in `details` may name `$carrier`, `$place` (the carrier's place now), `$holder` (who holds the carrier now) and `$trigger` (who or what set it off). They are resolved at firing, so a working goes with its carrier and can act for someone who was not there at storing.

## Triggers (SW2)

| Kind | Fires when | Needs someone present |
| --- | --- | --- |
| `quantity` | A named quantity on `$place`, `$carrier`, `$holder` or a named holder passes a threshold (`>=` or `<=`) | No |
| `event` | A world chain row of a named kind matches a `where` filter (a move into the place, a blow that took vitality from the holder) | No |
| `time` | An absolute minute, or every N minutes from storing | No |
| `touch`, `word` | The host offers a stimulus naming who touched or spoke | Yes |

A trigger reads the world and names no pack, so any pack's quantity or effect kind can set off any stored working with no code for the pair (PFP10).

## Settlement (SW3, KW5)

A watching record looks at absolute minutes `storedAt + k * pulse` (the pulse is pack data; reason: a ward's attention has a beat). `advanceStoredWorkings` advances the caller's world to each next pulse, checks records in id order (KW28) and fires. Nothing reads the call time, so one jump and many jumps give the same world, records and receipts. A quantity trigger is edge-read by default (it fires when the condition becomes true) with `again: 'pulse'` as the dial. Event triggers keep the last chain sequence they have seen.

## Charge and decay (SW4, SW5)

Charge at minute t is the stored charge less `amount` for every whole `every` since the anchor; recharge and re-ink reset the anchor. A firing spends `per`, times the cost factors below. A firing with less charge than it needs lands a scaled effect (half the charge, half the amount), and at nothing it goes `dormant`: the pattern stays and can be fed again. `draw` takes the charge from a world quantity instead, which is how a held part costs its holder upkeep and how a ward can drink from its place.

## Authority at both moments (SW6, KW12)

`ports.authority` is asked at storing (`moment: 'store'`) and at every firing (`moment: 'fire'`), with who stored, who fires (or `null` with nobody present), the carrier and the trigger. Every receipt names both answers. A refusal comes from the world's own agents through that port, with their reason and costs, and the receipt lists the ways that remain.

## Ways around each default (SW7-SW10)

| Default | Why | Ways around, each with its cost |
| --- | --- | --- |
| Charge runs out | The working spends what was put in | `rechargeStored` (the feeder pays the pack's rate per unit); `feed` at firing (the firer pays directly); a `draw` source |
| Charge decays | Ink fades, paper breathes | `renewStored` (re-ink: pays the pack's price, resets the anchor, rearms a spent strip); a carrier whose pack data gives no decay |
| It acts where the carrier is | The pattern is on the carrier | `reach`: named far holders or a marked target, at the pack's extra charge per firing; move the carrier |
| It answers its holder or storer | It was attuned to them | A stranger fires it at `strangerFactor` times the charge; a `key` (a mark the actor carries; marks can be bound by anyone who can work a bind, so keys can be forged or stolen) passes a ward with no firing; `breakStored` by force: force at or above `strength` breaks it and the remaining charge lands on the breaker, less force wears that much charge off and sets the ward off |
| Fires once, or was broken | The strip burns its pattern; force tears it | `renewStored` lays it again at the pack's price while the carrier is whole |
| Carrier lost or broken | The working is on the carrier | Gone with a lost carrier (`lost`; the way left is storing again on another carrier); a broken one spills its remaining charge as its effect where it lies, or by pack dial goes quiet |

## Held parts (SW11, TG1)

A held part is the same record in `mode: 'held'`: a time trigger on a short pulse, a sustained effect that lasts one pulse, and a `draw` on its holder. It stays up while other kernel workings settle on the same clock and lapses at the pulse its holder cannot pay. This is the bridge TG1 asks for; the request to K is that a composition slot with `hold: true` lowers to such a record.

## Files (SW12)

- `src/stored_working.js`: new mechanism. First consumers are the four rows below.
- `tests/fixtures/stored_workings/rows.mjs`: the pack data for the four rows (all world numbers live here).
- `tests/stored_working.test.js`: the shape, charge and decay arithmetic, authority at both moments, every way around with its cost, save and restore, refusal of an unknown version.
- `tests/stored_working_engine.test.js`: in the engine world, a rune strip read through `readTalisman` (an unnamed pair still lands something), a ward on a place fired by another pack's quantity with nobody present, a draught held ready and released by a blow, a held guard kept up while another working runs. Each in one settlement and in several, and across serialize and restore.

Not built: game wiring, UI, checker scripts, a far form that finds a threshold crossing without pulsing (a request to W when a long horizon needs it), consuming the carrier thing on a once firing.
