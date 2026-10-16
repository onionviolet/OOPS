# Combat opponent projection (PP5), interface note, 2026-10-16

Engine lane, branch `codex/engine-combat-projection`. Implemented on that branch (unmerged); the shape is the contract R20 can code against now with
`read()` injection (GU8). Changes to it are announced here.

## Access

`domainRegistry.project('combat-opponents')` returns one plain, JSON-safe object (a fresh copy per call).
Registered by `src/combat_opponents_domain.js` with `projection` only: no save slice, no commands, no
clock. Registration runs when `src/ui/combat_display.js` loads; both read one `src/combat_readout.js`.
Browser checks: `window.simulationTestHooks.project('combat-opponents')` under `?test_hooks=1`. Panels re-read it on the existing publication refresh (`domainRegistry.refresh()` / tick renders).

## Shape (schema 1)

```js
{
  schema: 1,
  active: true,              // a native combat is running and not ended
  disclosure: 'native-legacy', // see Knowledge below
  count: 3,                  // opponents in this fight, defeated included
  alive: 2,
  opponents: [{
    slot: 'opponent-1',      // 1-based display order, stable for this fight; no template or internal id
    index: 0,
    name: 'Starving wolf rat',   // exactly the rendered name
    defeated: false,
    health: {current: 19, max: 20, fraction: 0.95}, // ceil'd as rendered; fraction clamped 0..1
    facts: [                 // only the facts the native renderer shows, in its order
      {id: 'attack',         label: 'Attack',         known: true, value: '4 dmg',  number: 4, count: 1},
      {id: 'speed',          label: 'Speed',          known: true, value: '0.82 /s', number: 0.82},
      {id: 'hits-you',       label: 'Hit you',        known: true, value: '35%',    number: 35},
      {id: 'evades-you',     label: 'Evade you',      known: true, value: '18%',    number: 18},
      {id: 'defense',        label: 'Defense',        known: true, value: '0',      number: 0},
      {id: 'you-hit',        label: 'You hit them',   known: true, value: '82%',    number: 82}
    ]
  }]
}
```

Fact variants follow the native renderer's own conditions. **Correction (same day):** the switch is
the size of the player's side, not the number of opponents.

- Player fighting alone (`solo`): `hits-you` and `evades-you` as percentages, plus `you-hit`. If the
  player holds a shield, `hits-you` is `{value: '100%', number: 100, shield: true}` (they always
  connect; the block applies after).
- Player in a party: `attack-rating` (AP) and `evasion-rating` (EP), rounded; no `you-hit`.
- Opponent with a shield: `block` (rounded block strength) replaces `evades-you`/`evasion-rating`.
  The native text shows a stray `2345` after that number; the projection carries the number only.
- `defeated` opponents stay listed (native dims them) with `health.fraction` 0 when at or below zero.
- Inactive: `{schema: 1, active: false, disclosure: 'native-legacy', count: 0, alive: 0, opponents: []}`.

Freshness: the native stats text is recomputed only on some events (fill, a death, stance changes), so
it can lag the current numbers (seen in 1–3 of 15 frames per journey). The projection computes on read
with the same formula and inputs, so it is current. That is not new knowledge; native shows the same
value on its next redraw.

## Knowledge (NX22, KL24/KL25, AD8)

`disclosure: 'native-legacy'` means: these are the numbers the inherited native combat view already
shows. It is not AD8 learned knowledge, and missing knowledge must never default to all-known. R27
owns learning and persistence. Until then every fact is `known: true` because native shows it.
Renderers must handle `{id, label, known: false}` with no `value`/`number` (unknown) so fixture cases
for unknown and partial readings work today. The projection adds no truth read beyond what the native
renderer computes for display: it shares that computation through one readout function.

No internal ids, tags, levels, loot, XP or template keys are emitted. Renderers must not derive class
names, ARIA labels or sort keys from anything other than these fields.
