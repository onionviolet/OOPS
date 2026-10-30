# L14: dated world events and news (GM18, GM36, GM38 as news)

Lane L14, 2026-10-30. Rules: WA37 (kind and key), WA24 (forward anchors), WA48 (shape on the whole source), RPT1-RPT12 (what reaches Reports), AD38 (mechanisms), AD45. Ids and counts only; row content stays in the private packs.

## What the whole source shows (WA48 sample)

Counts of `news` extras. LOTM volumes 1-8 (`*_news.jsonl` shards, m4 merge): 178 / 1,090 / 1,001 / 809 / 791 / 425 / 336 / 145. MoL 890. HP 2,560. Circle of Inevitability (shape only, nothing enters LOTM data): news shards sampled.

| Finding | Evidence | Consequence for the record |
| --- | --- | --- |
| Few rows carry a real date. Rows with a month, weekday or number: about 7% (v1) to 21% (v2); v8 about 1% | counted over `date` strings per volume | The record cannot require a day. It carries a `placement` that says how sure the day is |
| Most `date` text is relative ("two days after order", "one week after the visit", "before third task", "last Thursday") or unstated | MoL and HP samples | Anchored placement: offset from another event or beat, resolved at load |
| About two thirds of rows are private, one third public | v1-v8 5,181 rows: 3,533 private, 1,648 public | `scope` decides who may ever hear it without being there |
| Many rows are not world events but facts one person holds ("Kirielle's parents prepared a marriage") | MoL, HP samples | `kind` separates `public_event`, `institution_notice`, `private_fact`. Private facts are not on the world calendar; the knowledge owners take them (GM35, `person_memory*`) |
| The carrier names the route: newspaper, telegram, letter, diary, notice board, police file, a named person, overheard | LOTM `carriedBy` counts; HP owls and notices | `spread` is a list of routes, each with a delay and an audience |
| Window events exist: festival days, invasions, an academic year | MoL day-numbered storm and festival; HP term | `when` is a day window, not a point |
| War and city-scale events (GM38) reach the lead as news and as curfews | WAR counts 8/8/12/13/13/0/6/0 | A `curfew` effect on an event, read by the jurisdiction owner (GM23); no war mechanism here |

## Event record (world-neutral, `src/world_events.js`)

```
{ id, kind, key,                  // WA37: kind in public_event | institution_notice | disaster | curfew | festival | canon_beat
  placement: 'dated' | 'anchored' | 'ordinal' | 'unplaced',
  when: { day, endDay? }          // dated: world day index (inclusive window)
  anchor: { eventId, offsetDays } // anchored: resolved at load, cycles rejected
  ordinal: { beat, band? }        // ordinal: book order only; the host maps a beat to a day when the lead reaches it
  place,                          // place id or null (null = whole region)
  scope: 'public' | 'private',
  present: [personId] ,           // who is there as an actor, always knows
  spread: [{route, delayDays, audience?, via?}],
  effects: [{kind:'curfew', place, fromDay, toDay}],   // GM38, read by jurisdiction owner
  evidence: 'S' | 'T' | 'I' | 'U', // evidence label, inspector only (RPT11)
  lineKey,                        // wording key into texture rows (RPT12); text is pack data
  secretId? }                     // sealed truth by ID only
```

Rules:
- **Not before its day.** No route delivers before `endDay + delayDays`. A witness (present at the place during the window) learns at the time. Nobody learns an event that has not ended.
- **Missed events surface only by a stated route.** `spread` names the route and delay. No route, or no access to that route, means the lead never hears it (a private fact stays private). Access is a person-level channel set (`reads_newspaper`, `telegram`, `village_notice`, ...) supplied by the host, plus `via` persons who were present.
- **Unplaced stays dormant.** An `unplaced` (evidence U, no anchor) row is kept in the pack but never runs, per WA24 (no invented date contradicting later canon). Ordinal rows run only when the host binds the beat to a day.
- **Forward anchors (WA24).** Ambient, generated events carry `forbidsOnDays` checks supplied by the host; the reader exposes `happenedOn` so generators can see canon first.
- **Replay-safe (WA37, RPT8).** Pure functions of records, day and a presence callback. Reports are written once by the settling event: the host asks `learnedBetween(person, fromDay, toDay)` at day rollover and commits the lines; the reader itself writes nothing.

## Reader API (slice 1)

- `buildEventBook(records)` validates, resolves anchors, returns a frozen book. Throws on duplicate ids, cycles, bad windows.
- `happenedOn(book, day)`: events whose window contains the day.
- `endedBy(book, day)`: events whose window has closed.
- `knownTo(book, person, day, ctx)`: `{eventId, learnedDay, route, level}[]`; level is `present` or `heard`. `ctx = {presence(person, day) -> place|null, channels(person) -> Set}`. A `via` route delivers to its `audience` once the carrier has learned the event by any route, so second-hand news arrives a delay behind the first teller (chains allowed, loops guarded).
- `whoKnows(book, eventId, day, people, ctx)`: the inverse, for who-can-I-ask and secret checks (GM35).
- `learnedBetween(book, person, fromDay, toDay, ctx)`: lines newly known in `(fromDay, toDay]`, grouped for the RPT6 "While you were away" digest.
- `newsOn(book, person, day, ctx)`: what shows in the strip on this day.

## How it binds

- **Calendar.** Day index is `view.absoluteLocalDay` from `projectCalendar` (`world_calendar.js`), so the book runs on the existing profile with no new clock. Worlds with a sourced date (HP, LOTM) bind `dated` days to profile day numbers; others stay `ordinal`.
- **Reports.** Heard news goes under background (RPT1), witnessed under events; line text comes from the pack by `lineKey` (RPT10, RPT12), names resolve at read time (RPT4), no canon labels (RPT7). Evidence labels and ids stay in the inspector (RPT11).
- **`event_feed`.** `eventFeed` already collects `news` by `{id, at, text}`. The host adds one adapter that maps `newsOn` to that shape. Wiring is `sw-absorb`'s hunk; this lane ships the reader.
- **UI.** No UI. The "Time and chronicle" session consumes the read model: `newsOn`, `happenedOn` (a day strip), `learnedBetween` (digest). `sw-bridge` (L13) maps these to its view contract.

## Slice 2 plan (LOTM volume 1)

Luna medium extracts the dated and anchored scene and news rows with locators into the private pack (`sw-l14-*`). Sol drafts a loader that turns them into the record above. Private rows with no route are filed as `private_fact` for the knowledge owners and are not loaded onto the calendar. Done check: a news item appears on its day and not before; a missed event shows up later only through a stated route.

## Gaps this does not close

- Mapping ordinal beats to days needs the host (cast beats).
- Which people carry which `via` links outside the pack data (ordinary gossip) needs the person-memory owner (GM29, GM35).
- War beyond news and curfews (GM38) has no mechanism here.

## Restrictions (GM38, added 2026-10-30)

City-scale events reach the lead as news and as restrictions on their days. An event's `effects` may hold `{kind: 'curfew' | 'closure' | 'travel_halt', places?, institutions?, legs?, means?, hours?: [start, end], hoursKnown?, fromDay?, toDay?}`; field names follow `region_kit` (place and institution ids, `hours` as an hour pair) and `travel_legs` (leg ids, `means`). `restrictionsOn(book, day)` lists the day's restrictions; `openUnder(restrictions, {place, institution, leg, means, hour})` returns `{open, closedBy, notices}` and the caller ANDs it with its own base hours (`isOpen`). Default, dial and reason: closures and halts bite all day unless hours are given; a curfew bites only in its stated hours; a curfew with no recorded hours is a notice, not a block, because the source gave no hours to enforce. No war mechanism: war reaches the lead as news and these restrictions only.
