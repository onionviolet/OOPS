# Round 14 drafts, batch 1, 2026-11-15 (PS170; proposals, AD32)

These draft surfaces for capabilities that have none, or only a stray one. The gaps and their ranking are in the [coverage pass](../../docs/audits/UI_SURFACE_COVERAGE_2026-11-15.md) (SFC codes).

Each draft is drawn in round 14's four columns at 1920x1080, using the [round 14 mock](../yair-columns-2026-11-15/)'s own styles and helpers and the forms from the [UI kit](../ui-kit-2026-11-15/). On every draft:
- a gold dashed outline marks the drafted box;
- a dashed "draft note, not UI" under Reports gives the box and tab, the verb, what the Ready mark says, which numbers are known, estimated or "?", the empty state, and what it replaces.

Nothing is built until Weibao looks.

Open `index.html?d=d1` to `d5` (keys 1 to 5). Add `&cmp` to show a draft beside today's screen of the same life.

| Draft | Gap | Today (closest screen) |
|---|---|---|
| D1 · capture-d1.png, compare-d1.jpg | SFC10 Klein's work day: **Find work** verb, Bio rows for rent and what he owes, one "Pay and debts" ledger in Journal · Data | `lotm-tingen-day3` workroom |
| D2 · capture-d2.png, compare-d2.jpg | SFC11 Klein's path: Skills · **Beyonder** tab, digestion as "?" with signs, powers under **Take an action** | `lotm-tingen-day3` workroom |
| D3 · capture-d3.png, compare-d3.jpg | SFC13 and SFC14 Harry: **Attend** verb for lessons and papers, exams in Journal · Quests, duel setup in Inventory & combat · Combat | `hp-exam-week` household day |
| D4 · capture-d4.png, compare-d4.jpg | SFC15 and SFC16 Fang Yuan: Skills · **Gu** tab (aperture head, hunger per Gu), and the **Refine** bench replacing the actions box | `ri-fang-yuan-wild-gu` beginning panel |
| D5 · capture-d5.png, compare-d5.jpg | SFC20 the wolf tide as a location-box line, **Patrol** targets, and one "Battle merit" ledger | `ri-fang-yuan-wild-gu` (no tide readout exists) |
| D6 · capture-d6.png | DU14 and DU37, agreed with the combat lane: two sides in column 2's middle, laid out on their versus row (your side with "Beside you", one card per foe, fallen dimmed in place). Above the rows sit the stakes chip, the approach strip and the 1/2 decision band with "Other moves (n)". Withdraw is held at the bottom and Inspect is separate. A seeded SVG sigil sits by each name. No runtime file is touched, and the mount point stays open for ui-cohesion's slot selector | the live fight card (combat lane) |

Values come from the code where one exists:
- Klein's pay and advance: `book_world_lotm_wage.js`.
- Harry's subjects: `book_world_hp_day.js`.
- Fang Yuan's refine methods and costs: the fixture.
- Tide phases: `ri_wolf_tide.js`.

Other targets, odds and counts are examples, and each draft note says which.

`today/` holds the DEV fixture captures (headless Chrome at 1920x1080, `node scripts/fixture_browser.cjs <name>`). These are setups, not played lives.

Batch 2 (next, after Weibao looks): SFC12 Klein's home, SFC21 Spellbook as Skills · Spells, SFC22 friends in People, SFC23 one bench grammar for Potioneering and Mixing, SFC24 one home, SFC25 rites.
