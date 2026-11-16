# UI surface coverage, 2026-11-15 (PS169)

Status: findings and a proposed ranking (AD32). Nothing here is accepted or authorizes a build. Drafts follow PS170 in batches and wait for Weibao's look before anything is built.

Weibao asked for "Ui drafting and cohesion for future capabilities or existing capabiltieis lacking those" ([log](../gm/USER_VISION_LOG_2026-11.md#feel-and-finish-discord-features-and-ui-drafting-lanes-2026-11-15)). This pass lists each capability that has no surface, or whose surface sits outside [round 14's](../gm/dispatch/play-surface-2026-11-14/CONSIDERATIONS.md#round-14-2026-11-15-back-to-yairs-groupings-in-depth) four columns, and ranks them by what a lead's life touches first. Codes are SFC1 onward. The shared forms are on the [UI kit page](../../prototypes/ui-kit-2026-11-15/index.html) (PS171), and the first drafts are in [ui-drafts-2026-11-15](../../prototypes/ui-drafts-2026-11-15/index.html) (PS170).

**Snapshot.** Master at `e36cd2913` (round 14 slice 1, `85f24e634`, had landed: four columns and the footer). ui-cohesion's slices 2 to 4 will move Skills under the Journal and fold the top routes into boxes, so the "today" column is a snapshot and goes stale as those land.

**Sources.**
- The [November 14 atlas](../reports/PROGRESS_ATLAS_2026-11-14.md), especially AT39 (engines outpace consumers) and AT40 (no reason to come back tomorrow).
- [AREA_GUIDE](../AREA_GUIDE.md).
- A walk over `src/` imports: does any DOM-touching file reach the module?
- `definePanel` registrations, the routes in `src/layout_spec.js` and `src/ui/here_kinds.js`.
- Three DEV fixtures opened in headless Chrome at 1920×1080: `lotm-tingen-day3` (Klein), `hp-exam-week` (Harry) and `ri-fang-yuan-wild-gu` (Fang Yuan).

**Limits.** The import walk can miss wiring through `main.js`, `display.js`, dynamic imports or string-registered ports. Rows marked *unverified* need one more check. Five modules were rechecked by grep and have no importer in `src/`: `relationship_view`, `gu_workshop`, `brew_generation`, `check_inspector` and `condition_ladders`. Sealed truths are not named here; a sealed reader goes by its ID.

## Facts behind the ranking

| Code | Fact | Evidence |
| --- | --- | --- |
| SFC1 | **Each lead lives in one catch-all centre panel.** Klein: "Tingen workroom", about 25 sections with its own Here / Work & merit / Notebook tabs. Harry: "The household day", where the duel setup, arrival, exams, home and upkeep stack in one scroll. Fang Yuan: the "Your beginning" panel, where his day's acts are cards with "Details" disclosures and the Gu house sits inside it. | `book_world_lotm_ui.js:500`, `book_world_hp_lead_ui.js:234`, `structured_pack_ui.js:220`, `ui/gu_house_view.js`; fixture captures |
| SFC2 | **About 47 files append straight to `#location_actions_div`.** `here_kinds.js` places only 8 panel ids by kind. Each of these is a stray verb or option waiting for a slot. | grep; `here_kinds.js:21-33` |
| SFC3 | **About 45 registered centre panels have no route.** They show only when discovered or through All panels: Deeds, Companions, Study, Homes, Room plan, Regard, Leads, Statistics, Standing and ledger, Lives and inheritance and more. PS125 maps the 22 routes but not these. | `definePanel` grep; `layout_spec.js:283-304` |
| SFC4 | **The Skills box has no world tabs yet.** Beyonder, Spells and Gu (PS122) have no home, so each lead's power lives in that lead's catch-all panel. | `layout_spec.js` routes; PS122 |
| SFC5 | **Engines outpace consumers.** Creature populations, the potion and spell engines, kernel workings, markets, the check inspector and condition ladders reach no player. Foundations come first and tie-in waits (PROJECT current focus), so these are LATER rows, not drafts. | atlas AT39 |

## Ranked gaps (proposal, AD32)

Rank is set by what a lead meets on day 1 to 3 in the fixtures, then by what that lead reaches within the first week, then by everything else. "Box · tab" is the proposed round 14 home. "Today" names the current surface.

### Tier 1: on a lead's first screen, but stray

| Code | Capability | Lead | Today | Proposed home (box · tab, verb) | Draft |
| --- | --- | --- | --- | --- | --- |
| SFC10 | **Klein's work day**: duties, weekly pay, rent, what he owes, merit | Klein | Workroom "Work & merit" tab and a "What I owe" section; Ledger route repeats it | 2 · **Find work** verb ("Go to Blackthorn Security · 1 shift"); 1 · Character · Bio gets an "Owes" row; 3 · Journal · Data gets the pay ledger | batch 1 (D1) |
| SFC11 | **Klein's path and potion**: ladder, digestion by acting, next crossing, powers (Spirit Vision) | Klein | Workroom sections "Read the ladder", "Plan the next crossing", Powers | 3 · Skills · **Beyonder** tab; powers as rows there; acting progress as the tab head; "Open your Spirit Vision" under **Take an action** | batch 1 (D2) |
| SFC12 | **Klein's home and household**: Moretti flat, rent due, Benson and Melissa, storage, thoughts | Klein | Workroom Home section | 2 · location box "Here:" line names the household; **Your home** verb (YAIR's Sleep and Storage); thoughts to 3 · Journal · Notebook | batch 2 (D7) |
| SFC13 | **Harry's school day**: lessons, exams (0 of 7 papers), the House Cup, timetable | Harry | "The household day" stack | 2 · **Attend** verb (a lesson or a paper, YAIR's Train slot); exams as targets with time; 3 · Journal · Quests holds "End-of-year exams 0 of 7" | batch 1 (D3) |
| SFC14 | **Harry's duel setup**: stance, "if they go down", "if I am losing" | Harry | Top of the household day | 1 · Inventory & combat · **Combat** tab (where round 14 put the fight preferences); the duel itself replaces column 2's middle (PS121) | batch 1 (D3, shown in column 1) |
| SFC15 | **Fang Yuan's Gu care and aperture**: hunger per Gu (FLR4), essence, aperture rank, stones | Fang Yuan | Gu house inside "Your beginning"; essence in the status line | 3 · Skills · **Gu** tab with a per-Gu hunger column and an aperture head; 2 · **Feed your Gu** verb marked "2 hungry". Round 14's `mock-fy.png` sketched the tab; this goes deeper | batch 1 (D4) |
| SFC16 | **Fang Yuan's wild Gu refining** ("Refine the wild Gu", "Cow it with a wolf eye") | Fang Yuan | Two action cards with Details in Beginning | 2 · **Refine** verb opening the work like crafting, replacing the actions box (PS121), with odds, essence cost and the interruption outcome | batch 1 (D4) |

### Tier 2: a lead reaches it in the first week, and it sits in a stray panel

| Code | Capability | Lead | Today | Proposed home | Draft |
| --- | --- | --- | --- | --- | --- |
| SFC20 | **Wolf tide state**: phase, wolves at the wall, parts, merit | Fang Yuan | Place description line and the patrol report only; merit is paid in four places (AT41) | 2 · location box line ("Wolf tide · second wave · wall holding"); **Patrol** verb mark; 3 · Journal · Data · "Battle merit" ledger. Waits on PS2 and PS3 (one wolf owner) for the numbers | batch 1 (D5) |
| SFC21 | **Spellbook**: learned spells, method, practice | Harry | `spellbook` panel, a `<details>`, unrouted | 3 · Skills · **Spells** tab; practice as the **Practise** verb | batch 2 (D8) |
| SFC22 | **Friends at school** | Harry | `hp-contact` panel, unrouted | 3 · Journal · People (a "School" filter beside Travelers and Organizations) | batch 2 (D8) |
| SFC23 | **Potioneering** (a second potion bench) | Harry, Klein | `hp-polyjuice` panel beside Mixing | **Mix** verb opens it in place as one more bench; one bench grammar with Mixing (UR94) | batch 2 (D9) |
| SFC24 | **Two homes for one thing** | all | Here's Home tab plus the unrouted `homes`, `home-overview` and `home-layout` panels | **Your home** verb opens one home box in place; the room plan becomes a tab inside it | batch 2 (D7) |
| SFC25 | **Divination, rites and the altar** | Klein | Workroom "Rites and questions", "Altar and rites" | **Take an action** › Rites, which opens the rite figure in place (UR93: the altar is its own form) | batch 2 (D10) |
| SFC26 | **Watch, guard and brokers** (law around Klein) | Klein | Workroom sections | 3 · Journal · People · Organizations, with custody and clearance as rows; a warning on the location box when the watch matters there (UR83) | batch 3 (D11) |
| SFC27 | **Standing and regard** | Klein, Harry | Regard and Standing and ledger panels, unrouted; `reputation_view` has no UI importer | 1 · Character · Bio gets a "Standing" row with "?" where unknown; detail in Journal · People | batch 3 (D11) |
| SFC28 | **Equipment condition shown twice** | all | Condition route, left panel, Here Equipment tab | 1 · Character · Equipment only (PS125 already says so) | none needed; build note |

### Tier 3: Village and other lives, stray

| Code | Capability | Today | Proposed home | Draft |
| --- | --- | --- | --- | --- |
| SFC30 | Village patrol and watchcraft | Here panel | **Find work** › Patrol | batch 3 (D12) |
| SFC31 | The 47-file Here dump (Town, Exchange, Routes, Field, Observation, Pursuit, Promise, Party, Pocket realm, Storylet, Technique, Body and more) | Here | Each finds a verb by kind (PS120); a mapping table like PS125's, one row per file | [mapping table](UI_SURFACE_MAPPING_2026-11-16.md) |
| SFC32 | Unrouted centre panels (SFC3) | discovery only | Each gets a box and tab in a PS125 extension; Deeds to Journal · Quests, Companions to Journal · People, Study to **Study** verb, Statistics to Journal · Data, Lives and inheritance to Journal · Beginning | [mapping table](UI_SURFACE_MAPPING_2026-11-16.md) |
| SFC33 | Leads board | `quest-board` unrouted | Journal · Quests | [mapping table](UI_SURFACE_MAPPING_2026-11-16.md) |
| SFC34 | Reports Ready and Story filters | missing (PS124) | Reports footer | in the kit (cell 12) |
| SFC35 | Capability runs lists other lives inside Harry's life (audit G6) | top route | Menu › Tools (PS123) | build note |

### LATER: engine-only, tie-in waits (foundations first)

Listed so the drafts leave room for them. None is drafted now.

| Code | Capability | Likely home when tie-in comes |
| --- | --- | --- |
| SFC40 | Creature populations, herds, evolution | Journal · Bestiary (a population line per kind, "?" where unseen) |
| SFC41 | Potion engine: brew law, dose, assay, generation | The Mix bench (SFC23) reading the new engine |
| SFC42 | Spell engine: law, grammar, invention | Skills · Spells, with an "Invent" target under **Study** |
| SFC43 | Gu workshop, propagation, rubble, sustain, flame, coupled workings, move generation, senses, concealment, defense, flight | Skills · Gu (details per Gu); the **Refine** bench |
| SFC44 | Markets, stock, price words, regional prices | **Visit a merchant** with "?" and estimated prices (PS130) |
| SFC45 | Kernel workings, agency (actors choosing workings) | No direct surface; their receipts reach Reports |
| SFC46 | Mood and mind meters, thought rows (*unverified*: a mood line may already show in Klein's thoughts) | 1 · Character · Bio |
| SFC47 | Condition ladders and affliction tracks (no importer) | 1 · Character · Active effects |
| SFC48 | Check odds and inspector (no importer) | Tooltip on any roll's result, "why it went so" (UR43) |
| SFC49 | Mastery pool for practice | Skills · Skills head ("Learning now", PS146) |
| SFC50 | Relationship axes and receipts (`relationship_view` has no importer) | Journal · People inspector |
| SFC51 | Gifts and daily talk | **Talk to someone** targets |
| SFC52 | Life succession and descent (no importer) | Journal · Beginning |
| SFC53 | Scene layer and situation candidates | Reports "Right now" and the location box |
| SFC54 | Recipe truth, substitution, corrosion, weapon riders | Crafting detail pane (PS165, PS167) |
| SFC55 | Time digest and place history read models (previews only) | Reports "While you were away"; location box description (PS143) |
| SFC56 | Fang Yuan's fate reader (sealed, by ID) | None by design: a reader with no surface |

## Notes for the build lanes

- **A route is not a home.** A page that today is a top route or a discovered centre panel should name its box and tab before anything moves (PS125, SFC32). A page with no fitting box is a finding to raise, and does not become a new top tab.
- **Lead catch-alls split by question, not by section.** Each section of SFC1's three panels maps to a verb (something to do), a Journal tab (something to know) or a Skills tab (something to grow). The drafts show this for the first sections.
- **Numbers follow PS130.** Every draft marks which of its numbers are known, estimated or "?". Pay, wolves at the wall, a Gu's hunger and refining odds are the first consumers of the shared renderer.

## Changes and checks

- Added this file, the kit page `prototypes/ui-kit-2026-11-15/` and the drafts `prototypes/ui-drafts-2026-11-15/`. No runtime code changed.
- Checks: a docs-only change, so the link check is by eye plus `check:rules` for the new doc's wording. Captures are headless Chrome at 1920×1080.

## Resume line (2026-11-16)

Drafts D1–D12, the areas mock and the UI kit are done. D6 waits on ui-cohesion's fight slot selector and feel-finish's timer styling. Everything else waits on Weibao's look before a build lane takes it:
- ui-cohesion: the frame, box tabs, the PS216 variant, the areas mock;
- feature-ui: D1–D5 and D7–D12, the lead and feature panels;
- combat: D6.

SFC31 and SFC32 are mapped in [UI_SURFACE_MAPPING_2026-11-16.md](UI_SURFACE_MAPPING_2026-11-16.md). The PS216 handoff is in [PS216_HANDOFF.md](../../prototypes/ui-drafts-2026-11-15/PS216_HANDOFF.md). This lane is done for the wave.
