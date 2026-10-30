# L11 slice 3 brief: secret gatherings (GM30), world-neutral

You are drafting ONE bounded change in /Users/weiwei/code/yet-another-idle-rpg. No commits, no web, no edits outside the owned files, no book text. Mechanism names only.

Owned files (create exactly these): `src/gatherings.js`, `tests/gatherings.test.js`.
Read first (do not edit): `src/persona_standing.js` (standingOf, attitudeOf, emptyPersonas, addPersona, changeStanding), `src/world_events.js` (buildEventBook, happenedOn), `src/basics.js` (check, natural, object, deepFreeze), `src/jurisdiction_rules.js` for style. Match their comment density and style (4-space indent, `check(...)` validation, pure functions, no state, no clock, imports only from basics.js, persona_standing.js, world_events.js).

Mechanism: a recurring meeting whose attendees are known to each other only by persona (seat), who trade information, items and favours, and leave without revealing their bodies.

API:
- `defineGathering(row)`: row = `{id, world, label, schedule:{everyDays (natural>0), offset (natural), hour (0-23)}, eventId? (a world_events id), seats:[{id, personaId, minStanding?:{region, atLeast}}], dial:{secrecy:0..1 default 1}}`. Validate ids (/^[a-z][a-z0-9_.:-]*$/i), unique seat ids and personaIds. Return a deep-frozen clone.
- `meetsOn(g, day, {book = null} = {})`: true when `(day - offset) % everyDays === 0` and day >= offset; when `g.eventId` is set and a `book` is given, it must also be in `happenedOn(book, day)` by event id (an event window gates the meeting); otherwise just the schedule.
- `seatsOn(g, day, {absent = []} = {})`: seat views `{seatId, label: seat.id}` for seats whose personaId is not in `absent` and, when `minStanding` is set, are admitted by `standingOf(personasState, personaId, region) >= atLeast` (take `personas` state in the ctx, default `emptyPersonas()`). A view never contains personaId or bodyId.
- `trade(g, state, {from, to, give, take, personas})`: `from`/`to` seat ids, `give`/`take` each `{kind:'fact'|'item'|'favour', key, qty?}`. Returns `{ok, reasons[], exchanged:{from:[..], to:[..]}, exposed:[]}`. Refuse (ok false, reason string) when a seat is unknown, a seat is the same as the other, or `give`/`take` is empty. `exposed` is empty unless the trade passes `reveal:true` for a seat, in which case it lists `{seatId, personaId}` for that seat (identity revealed on purpose); otherwise secrecy holds. `dial.secrecy` below 1 adds a deterministic `risk` number equal to `1 - secrecy` to the result (no randomness here).
- `leave(g, seatId, {revealed = []} = {})`: returns `{seatId, bodyRevealed: boolean}` true only when the seat id is in `revealed`.
All functions are pure; no mutation of inputs.

Tests (`tests/gatherings.test.js`, node:test, node:assert/strict), use a fixture world, not a book:
1. meeting days follow the schedule and an event window gates them (use buildEventBook with one dated event).
2. seats are shown by seat id only, with no persona or body in the view; an absent persona drops out; a standing gate admits only enough standing (use persona_standing).
3. a trade exchanges a fact for an item and exposes nothing; a trade with `reveal` exposes only that seat's persona; refusals carry reasons.
4. `leave` keeps the body hidden unless revealed.
Done check: `node --test tests/gatherings.test.js` passes. Print nothing else; do not run other suites. Write a 5-line summary in your last message.
