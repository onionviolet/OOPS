# R2 force lane

## Preflight

| Field | Record |
| --- | --- |
| Reading | Give area, item and form callers a shared world-layer verb for held force. The lane is engine-only. |
| Authority | The R2 brief and AD5, AD32, AD38, AD56. AR3 keeps impact with its existing authority. |
| Player sentence | No new player text. Engine proof shows a ward holding while supplied and opening when its force drops. |
| Ordinary route | A working adds force to a holder that carries it. A particular shove or blow spends or transmits it through that world's move or hit mechanism. |
| Mechanism | W writes a bounded quantity. An existing threshold block can read it. The caller owns contact, cost and timing. |
| Fit | `W_OBJECT_OF`, `applyEffect`, W quantity operations and threshold checks. |
| Ring | Sentence, settlement, threshold consumer, failure and substrate serialization. Law attachment and browser play belong to integration. |
| Rule codes | AD5, AD32, AD36, AD38, AD43, AD56, AR3, AR6, AR10. |
| Files | R2 design, `src/world_effects.js`, `src/force_effects.js`, `tests/world_effects_force.test.js` and this report. |
| Failure and checks | A place-wide pulse must leave a holder without a force account alone. A guard powered by force must stop blocking when the force drops below threshold. Run the focused W tests and architecture and rules checks. |

## Coordinator handoff

[Design proposal](../../../../research/FORCE_OBJECT_DESIGN_2026-11-24.md) · [W executor](../../../../../src/world_effects.js) · [Quantity declaration](../../../../../src/force_effects.js)

```js
'add.force': {quantity: 'force', direction: 'up'},
'alter.force': {quantity: 'force', direction: 'up'}, // positive-delta proof fixture
'remove.force': {quantity: 'force', direction: 'down'},
```

Include `FORCE_QUANTITY` in each law fixture's `engine.shared.quantities` and seed `start.force` above zero, with room for repeats. An `alter.force` fixture sends `details.delta = D.amount` for the listed up case. Real decreases use a negative delta and a down expectation. `add.force` and `remove.force` send the existing positive `details.amount`. The fixture's direction establishes settlement of the authored delta. For ledger take, use source evidence for whether a row carries force and which direction it changes. Damage, defence, friction and other uses of the label need their own effects or readers.

The effect host lowers all three. Stored working scales `details.amount`; a signed `details.delta` runs as authored. Integration should exercise any case that expects partial charge to scale a delta. The separate grammar assembler still rejects quantity `alter` under `VERB_ACCEPTS` in `src/effect_grammar.js`. Coordinator wiring through the assembler would need a force-specific allowance there. The coverage and law tables still need integration and a new take measurement.

## Receipt

Source verified in the moving shared checkout. Runtime and test SHA-256 prefixes are `ca97ad696890` (executor), `b4e366642cf4` (declaration), `689882b6bcb4` (W suite) and `f82a9ffe0a52` (force suite).

| Command | Exit and result | Gap |
| --- | --- | --- |
| `node --test tests/world_effects_force.test.js` | 0, 3 passed | Headless fixture |
| `node --test tests/world_effects*.test.js` | 0, 17 passed | Headless W suite |
| `node --test tests/world_substrate.test.js tests/effect_grammar.test.js tests/effect_host.test.js tests/gu_effect_pack.test.js tests/gu_giant_hand_working.test.js tests/spell_working.test.js` | 0, 47 passed | Focused regression set |
| `npm run -s check:arch` | 0 | Shared checkout, 205 grandfathered cyclic edges |
| `npm run -s check:rules` | 0 | Nine non-failing source warnings outside R2, one stale glob |
| `git diff --check -- src/world_effects.js tests/world_effects.test.js` | 0 | Tracked R2 source and test edits |
| Relative link and trailing whitespace check on both R2 docs | 0 | Local link targets |

FLR1–FLR3 remain for integration. The lane exercised the `hall` fixture headlessly, with no rebuilt bundle, fresh browser route or new player text. FLR4 is backed by the existing threshold ward reading force. FLR5 passed the substrate JSON round trip with a legacy holder and a loaded spring. There is no save schema change. Opted-in worlds serialize force in the existing holder quantities and ledger. Full app save, reload, Export and Import remain unexercised. FLR6 is agent-verified, not human-reviewed. Implemented, below floor (AD43). No new registration or cycle. The coordinator owns the combined gate.

Retained verification logs in `/tmp/oops-r2-force-{focused,world,extra,arch,rules}.log`.
