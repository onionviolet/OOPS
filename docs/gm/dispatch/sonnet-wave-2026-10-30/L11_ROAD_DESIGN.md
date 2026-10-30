# L11: second city and the road (design note, 2026-10-30)

Lane L11 of the Sonnet wave. Gaps GM22 (second-city kit), GM31 (long travel), GM24 (persona standing), GM23 (jurisdiction). Codes: WA48, WA22, WA23, WA37, SR1-SR24, WER1-WER17, AR3, AR12. Engine and data only; no UI. Spoiler line: tracked files name mechanisms; city content from the book stays in the private pack (`private_packs/`, gitignored).

## WA48 sample (shape taken from rows, not from volume 1)

| Source | Rows sampled | What it showed the shape must hold |
| --- | --- | --- |
| LOTM volumes 2, 4, 6, 7 (TRV/LAW/ORG/IDN family ids, private `wb-families-lotm`) | public carriage fare (per km, with a city cap and a suburban cap), station and private special train (price unstated), sealed-transfer between cities by an institution, Backlund risk watch, residence restriction on clerical staff, capture order by notice, identity papers required by housing associations, disguise and face-change methods | A fare is a formula (rate, cap) or a quoted sum or `unstated`. A statute has an act, a place that enforces it, an enforcer and an evidence need. A persona is a face with papers that may or may not link to a body. |
| LOTM later volumes (7-8) | a train to the capital "many hours", passage between a city and a hub by a non-road means, a teleport ban inside ruins | Legs have a `means` (road, rail, sea, crossing), a duration that can be `many hours` only, and a rule that forbids a means in a place. |
| Mother of Learning | mage-badge pickup, mind-magic law with animal exemption, Academy enrollment and housing, legal representation of students | Law is typed by act with exemptions; institutions grant housing and counsel to members; a rule can be local to one campus. |
| Harry Potter | apparition (means), Ministry convictions, house points as a local currency of standing | Standing is per institution, in its own unit; a means is gated by licence. |
| Circle of Inevitability (second era of the same world, shape only; fence below) | public carriage ability, district police structure, mob hierarchy, pro bono counsel | A city is a set of districts each with an enforcer; services reach by standing; a second era changes prices and enforcers, so rows carry an era window (WA23). |

Fields the first slice lacks and the shape holds anyway: `era` window on every row, `unstated` price, `dial` per region (strictness, hazard rate), a `claim` evidence label (S, T, I) with a locator, and exemptions on a statute.

**COI fence.** COI rows were used only to check shapes. No COI fact, name or number is in LOTM data or text, and COI-era facts never backfill LOTM.

## Module layout (new files only)

- `src/region_kit.js`: world-neutral. `defineRegion(row)` validates and freezes one region record; `readRegion(region, ctx)` returns the read model (below). Pure, import-light, no state, no clock.
- `src/travel_legs.js`: `defineRoute(row)`, `quoteRoute(route, ctx)`, `settleRoute(route, ctx)`. A leg is `{id, from, to, means, minutes, fare, hours?, hazard?}`. The fare is `{sum}`, `{perKm, km, cap}` or `{unstated:true}`. A hazard is `{id, chance, kind, harm?}`.
- `src/jurisdiction_rules.js`: `defineStatutes(rows)`, `rulingFor(table, act, place, ctx)`.
- `src/persona_standing.js`: standing keyed by persona id, a dial for how well a persona links to the body, and `attitudeOf(persona, observer)`.
- Content: `src/lotm_next_city_rows.js` (mechanism-level tracked rows, citations as ids and locators only) and the private pack `private_packs/lotm-next-city/` for names and prices.

None of these modify `known_routes.js`, `faction_rank.js`, `cast_journeys.js` or any host. `faction_rank.js` is imported read-only (`rankOf`, `rankAllows`). `cast_journeys.js` already turns a one-hop row into a native job; a trip with several legs is a list of those rows, one per leg, so the integrator can wire a route as chained journeys (patch note for `sw-absorb` in the hand-off).

## Region kit shape

```
{ id, world, label, parent?, era:{from?,to?}, dial:{strictness, hazard, priceLevel},
  arrival:{ id, from, text, evidence },                 // how the lead enters; WER, not a teleport
  places:[{id,label,district?,hours?}],
  institutions:[{id,label,kind,place,hours?,enforcer?,minRank?,services:[{id,label,price?,needs?}]}],
  offices:[{id,label,institution,minRank,grants}],      // an office is a role an actor can hold
  errands:[{id,label,institution,pay?,needs?,minRank?}],
  prices:[{id,label,amount|unstated,unit,basis}],        // basis: quoted | formula | proposed (I)
  customs:[{id,label,effect}],                           // slice 1 stores them, no mechanics
  statutes:[ids]                                         // resolved by jurisdiction_rules
}
```

Rank per region reuses `faction_rank.js` ladders (`rankOf(region, reputation)`), so standing in a second city starts at Stranger and is separate from the home city's (WA22: an entity the source never locates stays at M0 with the question kept).

### Read model (what the UI sessions consume)

`readRegion(region, {reputation, hour, day, money, known})` returns:

```
{ id, label, rank:{id,name,feeling,next}, arrival,
  institutions:[{id,label,kind,place,open:boolean,hoursText,services:[{id,label,priceText,available,reasons[]}]}],
  offices:[{id,label,held,eligible,reasons[]}],
  errands:[{id,label,eligible,reasons[],payText}],
  priceList:[{id,label,text,basis}],
  customs:[{id,label,effect}] }
```

`quoteRoute(route, {money, day, hour, rankOf})` returns `{legs:[{id,from,to,means,minutes,fareText,eligible,reasons}], totalMinutes, totalDays, totalFare, eligible, reasons}`. `settleRoute` returns `{minutes, days, fareCharged, events:[{legId,hazard,result}], arrivedAt}`; the caller applies the clock, purse and relocation through native owners (AR3).

| UI session | Reads |
| --- | --- |
| Maps and travel | `quoteRoute` legs, totals, hazards named by kind only |
| Economy and institutions | `readRegion().priceList`, institution services with hours and rank gates |
| Worlds and crossings | `region.arrival` and `means` on legs, WER entry kind |
| Organizations | institutions, offices, errands, `minRank` by region rank |

## Long travel (GM31)

- A route is an ordered list of legs. Total days = ceil(sum of leg minutes / 1440) when legs chain with no overnight wait; an `hours` window on a leg adds the wait until it opens (the clock is what owns waiting, so the quote adds it and names it).
- Fare is charged per leg at departure of that leg, by the purse owner; an `unstated` fare quotes "fare not recorded" and costs the dial's proposed price marked `basis: proposed`.
- Hazard roll keyed per WA37: an ambient event keyed by `(worldId, routeId, legId, day)` through `hashStreamSeed`, so replays repeat and a forward anchor is not disturbed. `chance` is multiplied by the region dial `hazard`. A hazard has a kind and a plain result; a harm result is a row the continuation owner consumes (L9), not applied here.
- Days away is what the integrator hands to the clocks: `settleRoute().minutes`. Where the lead is away, `cast_schedule` rows keep their own windows (WA23 dated addresses).

## Jurisdiction overlay (GM23)

A statute row: `{id, act, places:[place or region ids], penalty:{kind, amount?, text}, enforcer, evidence:{needs:[...], known:bool}, exemptions:[{when, text}], era, evidence_label}`. `rulingFor` takes the act and the actor's current jurisdiction and returns `{lawful, penalty, enforcer, needs, why}`; the same act in two jurisdictions yields different rulings. Dial: strictness per region scales whether weak evidence is enough (default: evidence needed is what the row says; strictness 2 accepts one item fewer). Default, dial and reason, not a universal.

## Persona standing (GM24)

State slice (owned by this module, plain data): `personas: {[personaId]: {bodyId, link:0..1, standing:{[region]: reputation}}}`. Standing is read by persona id, not body. `link` is how well observers connect persona and body; when an act exposes a link above the observer's `notice`, standing leaks: a share of the persona's reputation (and its sign) is applied to the body's. `attitudeOf` returns the rank band an observer holds toward a persona in a region, so one NPC can hold different bands toward two personas of the same body.

Ids for `sw-chars`: persona records are `{id: 'persona.<slug>', bodyId, link}`; the sheet field should store only `personaIds: []`, and standing is looked up here by `standingOf(state, personaId, region)`.

## Slices

1. Kit, travel leg, jurisdiction and persona seams, each with a focused test.
2. LOTM's second city as a thin pack: arrival, two institutions, one office, one errand, a price list; every row cited by id and locator; source-derived names and numbers in `private_packs/lotm-next-city/`.

Deferred: more cities, sea voyages as multi-day events with a ship cast, church structure rows (GM34), city-scale events (GM38). Not wired into any host in this lane.

## Slice 2 and hand-off (2026-10-30)

Built: `src/lotm_next_city.js` (validator and loader, mechanism only) and the private pack `private_packs/lotm-next-city/region.json` (gitignored): arrival by steam train, two institutions (public transport, a clearing bank with hours), one office (rank-gated, evidence I), one errand, a five-row price list, one custom and a one-leg route from Tingen. Every row carries an S/T/I label and a zh locator; the leg's minutes are authored (I). Test: `tests/lotm_next_city.test.js` (the pack tests skip when the private pack is absent).

For `sw-absorb` (integrator), all patches outside my files:
1. Add `"lotm-next-city/region.json"` to `supplements` in `private_packs/manifest.json`, then call `loadNextCity()` at boot beside the cast loader and keep the result.
2. Feed `readRegion(city.region, {reputation, hour, money})` from the lead's per-region reputation (`faction_rank.js` derives rank per region id `backlund`; the default ladder applies, no entry needed).
3. Turn `city.route.legs` into `defineJourneys` rows in `cast_journeys.js` (one row per leg, `fare` from `quoteRoute`, hours from the leg) and apply `settleRoute().minutes` through the clock; `events` go to the continuation owner (L9) as harm rows.
4. Persona state (`persona_standing.js`) needs a save slice with a migration if a host persists it; none is wired.

For `sw-chars`: persona ids are `persona.<slug>`; a sheet stores `personaIds: []` only and reads standing with `standingOf(state, personaId, region)`.

## Slices 3 and 4 (2026-10-30)

**Slice 3, GM30 gatherings** (`src/gatherings.js`, drafted by Sol medium `sw-l11-gather`, reviewed by Sonnet; brief `L11_SOL_GATHERING_BRIEF.md`; `tests/gatherings.test.js`, 6 tests). A gathering has a schedule (`everyDays`, `offset`, `hour`), an optional world-event id that must be active (reads `happenedOn` from `world_events.js`, L14), and seats keyed to persona ids. `seatsOn` returns seat ids only, admits by `standingOf`; `trade` returns exchange receipts and exposes a persona only when an offer sets `reveal: true`; `leave` reports whether a body was revealed. The host applies receipts; nothing is stored here. LOTM's weekly circle is the first data row (private pack `gathering` key; seat names stay private). COI shape only; none of it in tracked text.

**Slice 4, Luna verification** (`sw-l11-verify`, verdicts private). 19 pack rows against their cited paragraphs: 10 supported, 5 partly, 4 not in text, 0 contradicted. Corrections made: the North District place, the bank's opening hours, the anonymous-account service (its price is now `unstated`; the text gives a balance, not a fee), the Night Watch liaison office and the six-hour train leg stay marked authored (I) with `hoursEvidence` and `fareEvidence` fields carried into provenance; the newspaper and guide-fee labels lost details the text does not state. Read model unchanged.

## Slice 5: sea city, volume 3 (2026-10-30)

Second city pack in path order: a port reached by one ticket across two sea legs (`private_packs/lotm-baiyam/region.json`, three institutions, one office, one errand, a two-row price list, two customs). `lotm_next_city.js` now lists city supplements (`CITY_SUPPLEMENTS`) and `loadCities()` loads every one the manifest names. Hazards on legs carry their own provenance (`city.provenance[hazardId]`). Luna checked 20 rows: 11 supported, 6 partly, 3 not in text (two hazard locators corrected to the right paragraph, lodging stays authored); leg fares and durations are marked authored. The manifest entry for `lotm-baiyam/region.json` is another integrator patch. GM39 and GM37 findings are in `ideas/sw-road.md`.

## Slice 6: frontier camp and the creature hazard (2026-10-30)

A third pack in path order (`private_packs/lotm-afternoon-town/region.json`, volumes 3, 5, 6) that is an expedition camp in a ruined town, not a trading city. It runs through the same kit unchanged, which is the world-neutral test: prices and hours are `unstated` and the read model says "not recorded"; custom rows are expedition rules; the one road leg carries a cited creature hazard (`kind: creature`), the first row in this lane that fills GM39 as a route hazard. Luna checked 16 rows: 11 supported, 5 partly or not in text; arrival, the camp supply and a party-size custom were softened and the leg's minutes and fare stay authored (I). Languages (GM37) still have no cited gate on any road, so none was built. Manifest entry `lotm-afternoon-town/region.json` is another integrator patch (the `CITY_SUPPLEMENTS` list already names it).

## Slice 7: rail-stop city (2026-10-30)

A fourth pack in path order (`private_packs/lotm-utopia/`, volumes 7-8), reached by rail with a forced overnight stop. Dossier by Luna (`sw-l11-dossier-utopia`: numbered candidates in, slot picks out, 162 candidates), pack drafted and reviewed by Sonnet, rows checked by Luna (`sw-l11-verify4`): 23 rows, 17 supported, 6 partly or not in text. Corrections: an invented opening window for the square removed, a "free" statement fee changed to not stated, two labels softened. The return leg has a cited morning departure (S) so a late arrival waits (test: reaching the station at 02:00 waits six hours); the outbound weather halt is cited as a common occurrence (T) with an authored chance. Fares and durations are not cited and stay marked authored. Manifest entry `lotm-utopia/region.json` is another integrator patch.
