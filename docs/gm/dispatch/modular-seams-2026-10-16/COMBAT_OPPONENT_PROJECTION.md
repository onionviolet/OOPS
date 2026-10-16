# Combat opponent projection (PP5), interface note, 2026-10-16

Engine lane, branch `codex/engine-combat-projection`. Proposal under implementation; the shape is the
contract R20 can code against now with `read()` injection (GU8). Changes to it are announced here.

## Access

`domainRegistry.project('combat-opponents')` returns one plain, JSON-safe object (a fresh copy per call).
Registered by `src/combat_opponents_domain.js` with `projection` only: no save slice, no commands, no
clock. Panels re-read it on the existing publication refresh (`domainRegistry.refresh()` / tick renders).

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

Fact variants follow the native renderer's own conditions:

- One opponent of the player: `hits-you` and `evades-you` as percentages; a shield gives
  `hits-you` `{value: '100%', number: 100, shield: true}`.
- Several: `attack-rating` (AP) and `evasion-rating` (EP) replace them, numbers rounded.
- Opponent with a shield: `block` (rounded block strength) replaces `evades-you`/`evasion-rating`.
- `you-hit` appears only when the native renderer shows it (player present, one opponent).
- Inactive: `{schema: 1, active: false, disclosure: 'native-legacy', count: 0, alive: 0, opponents: []}`.

## Knowledge (NX22, KL24/KL25, AD8)

`disclosure: 'native-legacy'` means: these are the numbers the inherited native combat view already
shows. It is not AD8 learned knowledge, and missing knowledge must never default to all-known. R27
owns learning and persistence. Until then every fact is `known: true` because native shows it.
Renderers must handle `{id, label, known: false}` with no `value`/`number` (unknown) so fixture cases
for unknown and partial readings work today. The projection adds no truth read beyond what the native
renderer computes for display: it shares that computation through one readout function.

No internal ids, tags, levels, loot, XP or template keys are emitted. Renderers must not derive class
names, ARIA labels or sort keys from anything other than these fields.
