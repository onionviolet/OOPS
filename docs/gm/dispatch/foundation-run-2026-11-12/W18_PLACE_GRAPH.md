# W18 place graph (E10, audit AF2)

Status: proposal, built and agent-verified in headless tests. Not human-reviewed.
Finish line: places are linked once in the world; an effect can target within a
number of links; the three packs with private routes read that graph.

## What a link is

A link is a row in the world save (`world.links`), next to holders and law fields:

`{id, kind, from, to, cost, state, oneWay, force?, note?}`

- `kind` is any id a world uses: path, door, air, water, sightline, wire. The
  engine names none of them. A reader passes the kinds it travels.
- `cost` is the link's length in the world's own unit (default 1). `state` is
  `open` or `closed` (default open). `oneWay` runs from `from` to `to`.
- `force` is the stated way past a closed link: `{cost, price: [{quantity, amount}]}`.
  The cost is added length; the price is debited from whoever pushes through.
- A link whose place is missing stays stored and dormant. A world with no links
  keeps the old save shape, so earlier saves load unchanged.

Ops: `link_add`, `link_set` (open, close, re-cost, change force), `link_remove`.
`createWorld` takes `links`.

## The one reader

In `src/world_substrate.js` (the substrate may import nothing, a standing test):
`worldLinks`, `linkExits`, `linkNeighbours`, `linkReach`, `linksWithin`,
`linkDistance`, `reachReport`. Options: `kinds`, `weights` (cost multiplier per
kind), `maxLinks`, `maxCost`, `closed` (`skip`, `force`, `any`). Routes are the
least cost inside both limits, with ties broken by fewer links, then link ids.
Packs read the same thing through their view: `view.links`, `exits`,
`neighbours`, `distance`, `within`.

## Effect targets

New target shape: `{shape: 'within', from, links, kinds, cost?, weights?,
present?, force?, payer?}`. Same-place shapes are untouched. A closed link is a
default, not a refusal:

- An open way round inside the limits is used first, at no price.
- With `force: true` the payer (default the actor) pays each forced link's price
  once per act, and the effect lands beyond it. The door stays closed.
- Otherwise the effect lands on what it can reach and `outcome.unreached` lists
  each place with a reason (`closed`, `price`), the links in the way and the
  price a way would cost. A closed link with no `force` is listed with no price.

## Consumers moved

| Consumer | Before | Now |
| --- | --- | --- |
| forage attraction | `connections` list in the pack | world links of `linkKinds` (default path) |
| mind, directed motion | `routes` list in the pack | world links of `linkKinds` (default path) |
| residue flow | `drains` list in the pack | one-way world links of `linkKinds` (default water); cheapest exit |
| stored working reach | same place, or named holder or mark | also `reach.links: {within, kinds}` |
| worm travel | 60 minute constant | linked route cost with `travel: {kinds, minutesPerCost}`; the constant when unlinked |

The three packs still accept their old lists. Those rows go through the same
reader as one-way links, so the existing tests pass unchanged and a world can
drop the lists once it declares links.

## Proven (tests/place_graph.test.js, eight places, path, door and wire)

1. A ward within one path or door link covers hall, study and yard, stops at the
   closed vault door and names its price; forced, it covers the vault and the
   caster pays; short of the price, the rest still lands.
2. Two links wide, the ward goes round by a one-way chute with nothing forced.
3. A taint spreads along paths by link cost: one jump, minute steps and a
   reload at minute 73 give the same world; closing a path mid-run stops it.
4. A wire reaches the tower in one link where paths need four links and 16 cost.
5. Travel distance is cheapest by cost and respects link limits and one-way links.

## What observers (E15) will need

- Sense links are kinds: sightline, air (sound, smell), wire. An observer row
  asks `linksWithin(from the effect's place, kinds for that sense)`; the graph
  already answers that. E15 owns the filter by senses and concealment.
- Strength over distance: use route `cost` as attenuation. A per-kind `weights`
  entry exists; a per-link damping number (a thick wall) would be a new field.
- A closed door blocks sight but passes muffled sound. Today `state` is one
  value per link, so model this as two links (door and air) between the rooms.
- The route itself (`route`, `forced`) is returned, so a receipt can say how
  the observer learned it ("heard through the vault door").
- Not built: links from or to bodies and things (a carried mirror, a tapped
  line), links that change with time by a law, and geometry (line, cone).

## Open, for the coordinator

- `src/engine_world.js` `createEngineWorld`: pass `links` through to
  `createWorld`. Until then an engine world adds links with `applyEngineOps`.
- `effect_host` does not yet settle a force price through the kernel cost port;
  the substrate debits the payer's quantity directly and names the link in the
  ledger.
- Law fields and block fields still scope to one place. A ward as a standing
  field over linked rooms is one field per reached place for now.
