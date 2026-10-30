# Circle of Inevitability: what each representation needs (proposals, 2026-10-30)

Lane `bk-coi`, book UI wave. Proposal status (AD32); nothing here is accepted direction. Counts and ids come from the private merged rows
(`docs/research/novels/circle-of-inevitability/private/wb8-merged-2026-10-30/`, CLR3: no book text here). Registry 867 rows (140 person, 162 place,
49 organization, 155 item, 117 measure, 91 price, 38 event, 32 clock, 31 creature, 10 deity, 8 ability, 5 calendar, 4 rite, 4 language, 3 law).
Extras 1383 rows (120 ability, 37 rite, 13 spell, 13 potion, 11 reset, 30 custom, 9 institution, 8 law, 669 id-keyed people/places/services, 90 dated
news, 90 priced services). **Scenes 0, fills 0, whereabouts 0**: every row below that says "scene" waits on a reading pass, not on UI.
Affordance: 59 places, 116 of 885 cells filled, 15 action classes.

**Coverage caveat.** The merge covers 28 of 294 shards (chapters 65 to 176 only). A thing missing from the counts below is not shown to be
absent from the book. Raw shard counts are larger (for example 3,520 rule rows, 4,680 people rows over 1,209 ids, 661 service rows, 1,063 news
rows) but ungraded. COI is a fenced second era (L11/R3): its rows shape views and never backfill LOTM data. The coordinator's F1-F25 list
(`readings_cov.md`) is cross-referenced in the table's last column group below.

Owner key: `sw-adv` (pathways), `sw-road` (regions, institutions), `sw-calendar` (news, dated events), `sw-absorb` (cast, routines),
`sw-death` (restart model), `rep-*` (the view's own lane), `bk-coi` (this lane, done).

| # | View | COI needs that the view lacks | Rows / ids | Kind | Owner |
| --- | --- | --- | --- | --- | --- |
| 1 | ECONOMY_AND_INSTITUTIONS (Owed) | Own currency names. Bare "coin" read wrong for verl d'or, coppets, licks | 29+10 verl d'or, 12 coppet(s), 13 lick(s) priced extras; `coi.price.silver-coin`, `coi.price.gold-coin` | data, **fixed** (`unit` on a coin row, per-currency totals) | bk-coi |
| 2 | ECONOMY (price lists) | Price rows with a per-week/per-day unit and a place: rent 9, lodging 6, food 30, fee 14, transport 9, wage 12 | `coi.price.lodging-upper-week`, `lodging-lower-week`, `shared-space-low-week` | data (host adapter) | sw-road |
| 3 | ECONOMY / ORGANIZATIONS | 49 organizations: Church of the Eternal Blazing Sun, Church of Steam and Machinery, Church of the God of Combat, Intis intelligence, Bureau 8, Inquisition, police, Savoie mob, Carbonari, cult, Curly-haired Baboons research society. Duplicated spellings (church-steam, church-of-the-god-of-steam-and-machinery, god-of-steam-and-machinery-church) need the overlay | 49 `coi.organization.*`; 40 proposed redirects, 20 collisions for review | data + overlay review | sw-road |
| 4 | ABILITIES (ladder) | A second pathway family: Hunter, Dancer, Provoker, Fire mage, Invisibility; the circle-inhabitant boon. Ladder shows one family's rungs; COI rungs are unnamed in the rows | 8 `coi.ability.*` (`hunter-abilities`, `dancer-power`, `provoker`, `provoker-potion`, `fire-mage`, `circle-inhabitant-boon`, `invisibility`, `villain`), 120 ability extras, 13 potions | code (rung data) | sw-adv (GM9); `rep-abilities` holds the files |
| 5 | ABILITIES (rows) | Spells (13) and learned abilities (120) as held rows with cost, limit, consequence | extras kinds spell/ability | data | sw-adv |
| 6 | RITUALS_AND_MAKING | Rites with conditions, steps, costs and consequences: sacrificial dance, summoning dance, Twelfth Night ritual, messenger summoning method, boon extraction | 37 rite extras, 4 `coi.rite.*`; 31 `other`, 4 craft | data (rite figure takes rows as is) | sw-adv |
| 7 | TIME_AND_CHRONICLE | The loop: one law row and one event row that restarts the day; 11 reset rows. The digest has no "this day has happened before" concept | `coi.law.time-loop`, `coi.event.time-loop`, 11 reset extras | code | sw-death (restart model) |
| 8 | TIME_AND_CHRONICLE | Dated events: April 1, April 3, Lent, Twelfth Night, the Fourth Epoch; 5 calendar rows. Years, epochs and Lent are not day-of-year | `coi.calendar.april-1`, `april-3`, `lent`, `fourth-epoch`, `day` | data + a calendar-name hook | sw-calendar |
| 9 | TIME_AND_CHRONICLE | News: 90 dated, scoped (public/private) rows with a carrier. Many dates are relative ("last night"), which the digest cannot place | 90 dated extras | data, needs a resolve step | sw-calendar |
| 10 | TIME_AND_CHRONICLE | Clock times: dawn, noon, midnight, half past ten, cathedral clock; durations in minutes to years. Minute-of-day only today | 32 `coi.clock.*`, 117 `coi.measure.*` | data | sw-calendar |
| 11 | MAPS_AND_TRAVEL | A new city's places: Cordu, village square, cemetery, mausoleum, tomb chamber, cathedral; distances in metres and steps | 162 `coi.place.*`; 59 with affordances; 117 measures | data | sw-road (GM19) |
| 12 | MAPS_AND_TRAVEL / FIRST_HOUR | What can be done here: 15 classes, 116 of 885 cells filled, 0 with steps or options (texture only) | affordance.json | data, thin | sw-road, then reading pass |
| 13 | KNOWLEDGE | Languages (Hermes, Ancient Hermes, Intis, one more) and documents (11): which tongue a source is in and who can read it | 4 `coi.language.*`, 11 `coi.document.*` | data | sw-absorb |
| 14 | KNOWLEDGE | Laws of the world stated as rules (mysticism, convergence law) with a "known / guessed" state | 3 registry laws, 8 law extras | data | rep-knowledge |
| 15 | BODY_AND_CONDITIONS | Corruption, possession-like and divine-contact conditions; the body view has harm rungs only | 4 `coi.rite.*`, boon-extraction consequence rows, 9 institution extras | code (new carrier kinds) | sw-death / body lane |
| 16 | CHARACTER_SHEET | Names that change by context; 51 labels with aliases | 51 aliases, 140 people | data | sw-absorb |
| 17 | RELATIONSHIP_WEB / FAMILY_TREE | Family and group ties of the lead, plus a cult/church membership edge; the cast is 140 people, 409 with routines in extras | 140 `coi.person.*`; 669 id-keyed extras (routine, relations, knows, reacts, speech) | data | sw-absorb |
| 18 | TALK | What each person knows, wants and reveals, and how they speak. 9 reveals flagged for review (sealed: refer by id only) | `reveals` field on id-keyed extras | data | sw-absorb |
| 19 | COMBAT | Creatures (31) and spirit enemies; provocation as a combat verb | 31 `coi.creature.*`; `coi.note.provocation` | data | sw-adv |
| 20 | ITEMS / CRAFTING | 155 items, mostly ritual and mundane goods (mercury mirror, powders, incense); no item-use rows | 155 `coi.item.*`, 4 craft extras | data | sw-absorb |
| 21 | WORLDS_AND_CROSSINGS | Deities as sources of power (10), including The Fool and Eternal Blazing Sun | 10 `coi.deity.*` | data | sw-adv |
| 22 | Scenes (all views) | Scene beats: none yet, so FIRST_HOUR, TALK and the chronicle cannot show any COI scene | scenes 0, fills 0 | reading pass | coordinator |

## Cross-reference to F1-F25 (coordinator's readings list)

| F code | Rows above | Note |
| --- | --- | --- |
| F1-F3 (loop, daily baseline, scoped restarts) | 7, 15 | One shared loop feature with Mother of Learning and The Perfect Run, not a COI patch; needs a cycle-day chip and a what-resets / what-carries list (TC5, TC14, gallery only today) |
| F4, F8, F15 (convergence, contracts, patrons) | 17, 18 | Encounter log, contract terms with drawback, letter inbox: all data on existing seams (`world_events.js`, `obligations_ledger.js`) |
| F5, F6 (boons, stand-ins) | 4, 5, 6, 20 | Item card lacks charge, cooldown and aftereffect fields |
| F10 | 4 | More rungs and role/event-based advancement |
| F12-F14 (church settlement, statutes, gatherings) | 3 | Needs a jurisdiction banner and ruling readout; seams `jurisdiction_rules.js`, `gatherings.js` |
| F17 (aliases) | 16 | Alias picker, per-alias standing (`persona_standing.js`) |
| F18, F21 (Cordu, Trier, sea) | 11, 12 | Era window needed (WA23) |
| F19 (money) | 1, 2 | Row 1 fixed for display; a conversion line between units is still a gap (sw-road) |
| F25 (news) | 8, 9 | Public vs private scope already present on the 90 dated rows |

## Gap logged, not fixed

`scripts/lead_run/build_cast_pack.mjs` filters on the `lotm.place.` prefix and the Tingen districts, so it cannot build a COI cast pack.
Routed to `sw-absorb`. `floor-wire` is the one writer for the LOTM host, simulation and registry.

## What changed in this lane

- **Owed ledger** (`src/owed_ledger_view.js`): coin rows may carry `unit` (a string or `{one, many}`), and summary totals are per currency.
  Before, every money row read "N coins" whatever the world's money (UR61: numbers carry units). Default unchanged. Test:
  `tests/owed_ledger.test.js` (the last case). Capture: `evidence/coi/owed-coi-1920.png` (1920x1080 headless, no console errors). It is a bare harness page without the game shell styles, so it proves the wording and units, not the styling; in-game placement is implemented, below floor.

## Not fixed here, with reason

- Rows 4, 5, 19, 21: held by `rep-abilities` and `sw-adv`.
- Rows 7, 15: need engine seams (`sw-death`), not an adapter field.
- Rows 2, 3, 11: these need a COI world pack and host registration (`sw-wire`), which this lane may not touch.

## Queue entries for the coordinator

1. `sw-adv`: second pathway family (GM9), ability rows 4, 5, 6, 19, 21; rung names are absent from the rows.
2. `sw-road`: regions (GM19) and institutions (GM6): rows 2, 3, 11, 12; the 49 organizations need the overlay (40 proposed redirects, 20 collisions) reviewed.
3. `sw-calendar`: rows 8, 9, 10; relative dates ("last night") and Lent/epoch names need a resolve step.
4. `sw-absorb`: rows 13, 16, 17, 18, 20: 409 routines and 669 id-keyed people rows.
5. `sw-death`: row 7, the loop as a restart with kept knowledge (11 reset rows).
6. Coordinator: scenes and fills are empty in the COI merge; no COI scene appears in any view until a reading pass fills them.
