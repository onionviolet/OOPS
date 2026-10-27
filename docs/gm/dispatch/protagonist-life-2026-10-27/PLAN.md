# Protagonist-life pipeline: plan pass (step 1), 2026-10-27

Status: plan only, docs only. Proposals; nothing here is accepted until Weibao says so.
Brief: [PROTAGONIST_LIFE_IMPLEMENTATION_PROMPT](../../PROTAGONIST_LIFE_IMPLEMENTATION_PROMPT_2026-10-27.md),
including its "Update 2026-10-27 (Weibao)" section, which replaces "Village mini-line first"
with "start with a real book world, pilot chosen by score". Method owner:
[canon protagonist report Parts G and H](../../../research/CANON_PROTAGONIST_INTERACTIONS_2026-10-27.md)
(PX43 to PX64). Engine owners: [time travel and seeded worlds](../../../research/TIME_TRAVEL_AND_SEEDED_WORLDS_2026-10-27.md)
(C1 to C12) and [conceptual abilities audit](../../../research/CONCEPTUAL_ABILITIES_ENGINE_AUDIT_2026-10-27.md)
(CAE-E1 to E8).

Codes applied: WPR (labels, locators, lane review, more-to-consider round), AR1-AR16 and
WA5 (engine owns verbs, worlds own nouns; each engine lane names its seam), AU5/AU13-AU15
(haiku readers, finite whole-source plan, 12,000-word shards), WER (start answers), AD36,
AD42, AD43, the sealed-secrets rule. Labels: **[S]** sourced, with locator; **[I]**
inference; **[U]** unverified. No sealed truth of any world is stated here; none is needed.

No lane has started. No `src/` edit, no source collection.

---

## 1. Pilot choice

### 1.1 What was checked

| Check | Result |
| --- | --- |
| Local sources | LOTM: Chinese EPUB only, Calibre ID 1, mirrored in `/Users/weiwei/Sync/CalibreLibrary`; the only English LOTM file is the sequel, ID 34 [S `docs/research/novels/LOCAL_LIBRARY.md` source table]. HP: seven-novel private text with FTS5 index and page locators, `docs/research/novels/harry-potter/source-preparation-2026-10-11/` [S its README]. MoL: English "All ARCs" EPUB, Calibre ID 21 [S LOCAL_LIBRARY]. *Dracula*: no local copy [S title search of both Calibre roots for mystery, 诡秘, Dracula and Stoker, 2026-10-27]. |
| Prior reading | LOTM first novel: "1,402 read / 363 reviewed" in private reader notes, units as the census states; 466-record census [S `LOTM_CENSUS_REPORT.md` line 1]. MoL: R1-R4 window passes and a W4 census [S `passes-2026-10-23/`]. HP: FTS index, craft integration, census, world audit folders [S folder listing]. |
| Touched-set nouns in `src/` and `src/world_packs/` | Grep of 12 year-one / volume-one / first-month nouns per world, 2026-10-27 [S command in section 3.3]. HP: 1 of 12 hit (`diagon`, 3 files); Gringotts, Ollivander, Privet, King's Cross, the platform, Quidditch, the train, the Leaky Cauldron, the forest, the Great Hall and Hagrid all 0. LOTM: 7 of 12 (Tingen 32 files, Nighthawks 10, Klein 3, Dunn 3, Tarot 2, Old Neil 1, the lead's cheat space 1); 5 family and club nouns 0. MoL: 9 of 12 (Cyoria 23, Ilsa 6, Kael 6, Zorian 4, Xvim 4, dungeon 2, Cirin, Kirielle, Zach 1 each); summer festival, Novak, Akoja 0. |
| Calendars in code | HP's `hpSchoolCalendar` is an abstract 70-day term with five teaching days a week, not a canon September-to-June year [S `src/book_world_hp_facts.js:4-13`]. LOTM entry era is 1349 [S `src/book_world_lotm_entry.js:9`]. MoL pack is a visitor campaign on an "original independent" branch [S `src/world_packs/book_mol_pack.js` native.worlds]. |
| Arc boundaries from TOC metadata | LOTM: 第一部 小丑 runs from nav entry 2 (`part-1.xhtml`) to 第213章 (`lotm_c_0215.xhtml`); `lotm_c_0216.xhtml` is the author's volume note; 第二部 starts at nav entry 219 [S `OEBPS/Text/nav.xhtml`, read 2026-10-27, metadata only]. MoL: `toc.ncx` has 110 entries (Information, chapters 1 to 106, Epilogue, Afterword) and **no arc labels** [S `toc.ncx`]. HP year one is all of B1 [S manifest]. |
| Weibao's interest | "Recorded LOTM, Reverend Insanity and ORV favorites remain taste anchors" [S `docs/research/SOURCE_DEEP_DIVE_QUEUE_2026-10-24.md:557-558`]. HP and MoL are not on that list. |
| Sealed IDs held | No world-specific sealed-secret IDs for LOTM, HP or MoL turned up in `docs/worlds`, the three novel folders or their `src` files (grep for "sealed"; hits were game items such as LOTM sealed artifacts) [S grep 2026-10-27]. Public franchise twists are not sealed (AGENTS). So criterion 8 scores spoiler density in the arc, with sealed IDs at zero for all three. |

### 1.2 Score table (0 to 3 each; higher is better; criterion 8 is scored so lower load is higher)

| # | Criterion | LOTM vol 1 | HP year 1 | MoL first loops | *Dracula* |
| --- | --- | --- | --- | --- | --- |
| 1 | Dated beats | 2: year 1349 set in code; order is clear; day dates partly [U] | 3: term calendar, feasts, matches, exams give order and dates; calendar year is not in B1 [I] | 2: one month with a fixed start and end; in-loop dates partly [U] | 3: diary and letter entries [I, from memory] |
| 2 | Bounded cast and places | 2: one city plus remote contacts through the lead's cheat space | 2: Privet Drive, London shops, a station, a large school | 3: one city, one academy, a small early cast | 3 |
| 3 | Existing implementation of the touched set | 2: 7/12 nouns; districts, clearance, brewing, ritual, lives | 0: 1/12 nouns; the calendar is abstract; the pack is built round a book-two potion | 2: 9/12 nouns; but the pack is a visitor campaign, not the lead's line | 0 |
| 4 | Source in hand | 2: Chinese only; deep private notes | 3: English text, page locators, search index | 3: English text, passes and census | 0: no local copy; acquiring needs a yes |
| 5 | Lead-run clarity | 3: one path through the volume with known consequences | 3 | 1: each loop differs; which loop is "the" line is a choice; "arc 1" has no TOC boundary | 2: a circle of narrators, not one lead |
| 6 | Determinism fit | 1: ordinary calendar | 2: repeating weekly timetable | 3: a repeating month is a seeded-day test | 1 |
| 7 | Reusability | 3: pathway, potion and church-team patterns recur in its sequel and other cultivation-style worlds | 2: school-year pattern reuses for academies | 2: loop and academy patterns | 2: method dry run in the public repo |
| 8 | Spoiler and sealed load (lower load scores higher) | 2: zero sealed IDs; dense mystery plot | 3: zero sealed IDs; twists widely public | 2: zero sealed IDs; loop cause and the festival are mysteries | 3 |
| 9 | Interest and existing investment | 3: recorded favorite; deepest pack | 1: some investment (brewing, school lives) | 1: pack exists | 0 |
| | **Total** | **20** | **19** | **19** | **14** |

**Choice: Lord of the Mysteries, volume 1 (第一部 小丑), score 20.** The margin is one
point. If any single criterion moves by one in HP's or MoL's favor, the result is a tie,
and the brief's tie default is LOTM volume 1, so the choice holds. HP overtakes only if
two points move its way: for example HP criterion 3 at 2 (a year-one beat pack landed
first). If LOTM instead loses two (criterion 4 at 0, say, because the Chinese text proves
unusable for locators), HP and MoL tie at 19 and the plan returns to Weibao. Sensitivity, not a
tuning target: one score (LOTM criterion 5) was changed after a first total; section 8
records why, and the choice holds without that change.

### 1.3 Arc boundary and scope

- **In scope** [S nav.xhtml]: 第一部 小丑, 第1章 through 第213章, members up to
  `OEBPS/Text/lotm_c_0215.xhtml`. Places: Tingen and the routes the lead takes from it
  within the volume. People: those the lead meets in person or through his cheat space
  within the volume, by ID.
- **Out of scope**: the author's volume note (`lotm_c_0216.xhtml`); 第二部 onward; the
  sequel *Circle of Inevitability* (Calibre ID 34); adaptations; anything the lead only
  hears of without touching. Other Tarot members' own lives stay out except the facts the
  lead touches at a gathering (their L1 lives are step 6 work).
- **Second and third pilots** (after the LOTM P6 checkpoint, proposals): HP year 1 (all of
  B1), then MoL with the boundary set by a bounded reader to "chapter 1 to the end of the
  first restart" [U until read], because the TOC gives none.
- **The Village mini-line** stays as the engine harness (PL-H1 below), not a pilot.

---

## 2. Lead-run table schema

One table per world and line, stored private for named canon (decision Q3). Format:
JSON Lines, one row per beat, plus a header row. A public copy holds only IDs, counts and
labels.

| Column | Type | Meaning |
| --- | --- | --- |
| `beat` | string id | `lr.<world>.<line>.<nnn>`; stable once written |
| `order` | integer | Source order; ties allowed |
| `date` | object | `{world:'<calendar id>', value:'1349-07-??' or a relative form 'D+12', tolerance:days, label:'S'/'I'/'U'}`; `date-unsettled` when no anchor exists |
| `dayIndex` | integer or null | Filled by C1's `dayIndex` once the start month is fixed; null before |
| `place` | fact id | A place record id; `missing:<slug>` if not yet in the pack |
| `deps` | beat ids | Beats whose outcomes this beat needs; `after` (order only) or `needs` (state) per id |
| `touched` | list | `{kind:'place'/'item'/'price'/'law'/'person'/'clock'/'note', id, status:'present'/'partial'/'missing'}` |
| `action` | string | The lead's public verb sequence in the engine's words (go, buy, talk, work, brew, rest), not prose |
| `outcomes` | list | `{fact, value, class}` with class from PX8 (`carried`, `changed`, `blocked`); asserted on facts, never text |
| `footprint` | object | PX43 place set, window, hazard kinds, open roles; required for `great` beats |
| `weight` | enum | `great` / `routine` |
| `sealed` | list | Secret IDs only, with route and status (for example `S?: route, sealed`); never the truth |
| `evidence` | list | `{label:'S'/'I'/'U', locator, kind:'shown'/'stated'/'inferred'}`; one entry minimum |
| `mechanism` | string or null | Name of a lead mechanism the beat needs (for example the lead's cheat space); null when ordinary verbs suffice |

Dates: every row has a date or `date-unsettled`; the calendar id is the world's own
(LOTM's calendar, HP's school year). Relative dates (`D+n` from the start beat) are allowed
until Weibao fixes the start month; they become absolute by one substitution. Dependencies
are typed so the bot knows whether order alone is enough.

Two sample rows (format only; no sealed truth; one HP, one LOTM):

```json
{"beat":"lr.hp.y1.004","order":4,"date":{"world":"hp.school-year","value":"late summer before term","tolerance":20,"label":"I"},"dayIndex":null,"place":"missing:hp.place.wand-shop","deps":[{"id":"lr.hp.y1.003","kind":"after"}],"touched":[{"kind":"place","id":"missing:hp.place.wand-shop","status":"missing"},{"kind":"item","id":"missing:hp.item.wand","status":"missing"},{"kind":"price","id":"missing:hp.price.wand","status":"missing"}],"action":"go wand shop; try; buy","outcomes":[{"fact":"lead.holds.wand","value":true,"class":"carried"},{"fact":"lead.purse.galleons","value":"-7","class":"carried"}],"footprint":null,"weight":"routine","sealed":[],"evidence":[{"label":"S","locator":"B1:PDF-p68","kind":"stated"},{"label":"I","locator":"date from surrounding order","kind":"inferred"}],"mechanism":null}
{"beat":"lr.lotm.v1.017","order":17,"date":{"world":"lotm.calendar","value":"date-unsettled","tolerance":null,"label":"U"},"dayIndex":null,"place":"book.lotm.district.north","deps":[],"touched":[{"kind":"place","id":"book.lotm.district.north","status":"present"},{"kind":"law","id":"lotm.law.jurisdiction.by-church","status":"present"}],"action":"go north quarter; talk church team","outcomes":[{"fact":"lead.knows.team.north","value":true,"class":"carried"}],"footprint":null,"weight":"routine","sealed":[],"evidence":[{"label":"S","locator":"zh 第17章 p79 (as cited at src/book_world_lotm_districts.js:3; reused, not rechecked)","kind":"stated"}],"mechanism":null}
```

The HP row's price is [S B1:PDF-p68]; its date is [I] (B1's order, no in-text date found by
the one FTS query run). The LOTM row's beat number is a placeholder for format; its district id is illustrative; P3 maps it to the real
`LOTM_LOCATIONS` key.

---

## 3. Touched-set inventory method

### 3.1 Categories and how each is found in the pack

| Category | Where it lives now (LOTM) | Present means | Partial means |
| --- | --- | --- | --- |
| Places | `LOTM_LOCATIONS` in `src/book_world_lotm_ids.js`; districts in `book_world_lotm_districts.js` | A location id the player can reach by an existing route | Named in text or a district row but no route or no record |
| Items | Ingredient catalogue, formula rows, sealed-item clearance, pack items | An item definition with a source label | Mentioned in a formula or rule but not an item |
| Prices | `LOTM_PENCE` and per-file amounts (lives, districts) | An amount with [S] or a labelled proposal (WPR5) | A unit exists but not this good or service |
| Laws | Clearance ladder, jurisdiction rows, contract terms | A rule the engine checks | A rule in a comment or doc only |
| People | Pack people, offices (original roles) | A person record with schedule or role | Named in a doc or a comment only |
| Clocks | World clock, weekly minutes in `book_world_lotm_lives.js`, rhythm | A record scoped to a life fact with a period | Implied by a beat's date only |
| Return-note lines | Text keys shown when the player comes back | A note key per beat and witness level (PX49) | A beat with no note |

### 3.2 Procedure

1. P2 writes `touched` ids in the table (one per fact, by category).
2. A small script (P3 lane, proposed name `scripts/lead_touched_inventory.mjs`) resolves
   each id against the pack's exported id tables and the census JSONL kinds, and writes
   `present / partial / missing / out-of-scope` per id. Output: counts per category plus a
   missing list. That is measure M2.
3. Missing ids become P3 data cards. A missing *verb or field* becomes an engine card and
   a stop (WA5); P3 does not invent it.
4. The delta (what the table needed that the first inventory lacked) is recorded per world
   in the checkpoint; it is the checklist for HP and MoL.

### 3.3 Baseline grep (2026-10-27; a first signal, not the inventory)

Command: `grep -rilE "<noun>" src/*.js src/world_packs/*.js | wc -l` per noun. LOTM: places
(Tingen) strong; people (the team captain and a few colleagues) thin; the lead's family and
the club's other members absent; the lead's cheat space mentioned in one file. Items and
laws are deep for the Beyonder path (brewing, rituals, clearance). Prices exist for civil
staff and passage [S `src/book_world_lotm_lives.js:4-7`]. Clocks: a week constant only.
Return-note lines: none keyed to beats [I].

---

## 4. Lanes in dependency order

Ownership is by new files wherever possible, so lanes do not collide with the sessions
now active in this checkout (Village, UI backlog and others). If a lane must edit an
existing shared file, it names the file, checks `git log -3` and the linked-session list
first, and stops if another writer holds it. Models follow the agent rules: haiku for
bounded reading, sonnet for code and synthesis, opus only for review and spot checks.

| # | Lane | Owner model, effort | Owned files (proposed) | Depends on | Done check | Gates | Stop conditions |
| --- | --- | --- | --- | --- | --- | --- | --- |
| P0 | Plan pass | opus | this file | none | This file plus the register and USER_VISION hunks | `check:rules` not needed (no codes registered); link check | Done |
| PL-E0 | C1 `dayIndex` helper and clock table | sonnet, medium | `src/world_day_index.js`, `test/world_day_index.test.js` | none | Both clocks give the same `dayIndex` on a known day [S C1 row] | build, focused test, `check:arch` | Needs a save field: stop for a compatibility decision |
| PL-E1 | C2 keyed shop stock | sonnet, medium | `src/keyed_generation.js`, its test; one call site named in the lane brief | PL-E0 | Same seed and day give identical stock twice; an unrelated draw between calls changes nothing [S C2 row] | as PL-E0 | Call site owned by another session: stop and hand off |
| PL-E2 | Reference resolver CAE-E1, CAE-E2, CAE-E4 | sonnet, medium | `src/ref_resolver.js`, its test; render hook in `src/chronicle.js` only after an owner check | none | CAE-E1/PL-E2/E4 done checks [S CAE rows 300-303] | as PL-E0; old saves render identically | CAE-E2's heir snapshot is a save addition: stop for an additive-migration yes |
| PL-E3 | Beat resolver (L3, R21) | sonnet, high | `src/beat_records.js`, its test | PL-E0 | Two scripted lives: one in scope sees the beat and a miss note, the other nothing; a changed input flips a downstream fact [S report L3] | as PL-E0 | A beat needs a verb the engine lacks: engine card, stop |
| PL-B1 | Scripted-lead bot and lint | sonnet, medium | `scripts/headless/lead_bot.mjs`, `scripts/check_lead_bot.mjs`, `test/lead_bot.test.js` | none (uses the existing headless runner) | The lint rejects a planted state import and a planted clock write; the bot logs every action with verb and world minute | focused test | The runner lacks a click route the bot needs: `game_report_limit`, engine card |
| PL-H1 | Village harness (PX64, reduced) | sonnet, medium | `src/world_packs/village_lead_line.js` (pack data), `test/village_lead_line.test.js` | PL-E0, PL-E3, PL-B1 | PX64 checks 1-5 and 7 on five beats; bystander smoke test (check 6) optional here | build, focused test, `check:arch`, `check:rules`; M8 browser save/reload/import from a fresh origin | Village files owned by the Village session: coordinate by SendMessage before any edit outside the new file |
| P1 | LOTM vol 1 source ledger | haiku readers, one coordinator | private: `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/` | Q2, Q8 | Every ledger row has a locator and a label; every mention in the volume is a census row at M1 (placed, with a dated whereabouts) per WAL1-WAL3; a coverage fraction is reported | AU13 plan declared; sonnet spot-check of a sample (R22) | Budget cap; contradiction recorded, not resolved; a sealed-truth row stored by ID only |
| P2 | LOTM lead-run table | sonnet, medium; opus spot-check of 10% | private: same folder, `lead_run.jsonl`; public: `docs/gm/dispatch/protagonist-life-2026-10-27/LOTM_LEAD_RUN_SUMMARY.md` (IDs and counts only) | P1, Q4 (absolute dates only) | Every row has a date or `date-unsettled`; every touched fact has an id | Schema lint | More than 25% `date-unsettled` [I threshold]: stop and report the blocking passages by locator |
| P3 | LOTM touched-set data | sonnet, medium | public LOTM pack files only for facts already public in `src`; canon-named rows in `private_packs/lotm-lead/` (Q3); `scripts/lead_touched_inventory.mjs` | P2, PL-E0; PL-E1 if the route buys ambient stock; PL-E2 for any name in a note | M2: every touched id resolves | build, focused pack test, `check:arch`, `check:rules` | Missing verb or field: engine card, stop. Save shape change: stop |
| P4 | LOTM scripted lead | sonnet, medium | `scripts/headless/lead_runs/lotm_v1.mjs` and fixture | PL-B1, P3, PL-E3 | k of n beats reached, with causes (PX59) | PL-B1 lint passes on this file | Unreachable beat after the PX59 procedure: report, do not add a shortcut |
| P5 | Golden runs and pokes | sonnet, medium | fixtures and `RUN_REPORT.md` in this folder | P4 | M3 bot run twice identical; M4 null-player run; M5 one poke per `great` beat | full `npm test` by the committer once; `check:arch`; `check:rules` | Flaky result: list nondeterminism sources, do not loosen assertions |
| P6 | Checkpoint and register | opus review | `CHECKPOINT.md` in this folder; register row | P5 | AD43 six lines or "implemented, below floor"; "agent-verified, not human-reviewed" | none | none |
| PL-S1 | Open the seat (brief step 5) | later | named at P6 | P6, Q5, Q6, Q7 | Bystander seven-day smoke test (PX61) | brief gates | Out of this plan's authority |

**Independent of Q1 to Q8 (each starts only on Weibao's launch yes, Q0):** PL-E0, PL-E2 (except CAE-E2's save addition), PL-B1, then PL-E3 and PL-E1
once PL-E0 lands, then PL-H1. These are the engine prerequisites the brief names plus the beat
resolver the brief left out (R21 shows M4 and M5 need it). Up to two lanes at once
(AU default), one writer per file.

**Waits on Weibao:** P1 (edition and budget), P2's absolute dates (start month), P3's
private placement, PL-S1 (seat defaults and the HP offset when HP comes).

**Lead mechanism.** Beats that need the lead's cheat space are marked
`mechanism:<id>` and reported as "blocked by mechanism" until a mechanism lane is
authorized. That lane is a proposal for P6, not part of this plan [I].

---

## 5. Scripted-lead bot design

- **Surface.** The bot drives the headless runner (`scripts/headless/runner.mjs`): `click`,
  `clickText`, `fill`, `key`, `step`, `save`, `load`. `call` is allowed only for window entry
  points the markup itself exposes, as the runner README defines [S `scripts/headless/README.md`
  API table]. The Village precedent is `scripts/headless/village_route.mjs` [S]. The game MCP
  uses the same build, so a bot route can be replayed there by hand.
- **Lint (PL-B1).** The bot module may import only the runner and its own fixture. It may not
  import `src/` state writers, write save fields, set the clock or seeds beyond `boot`'s
  documented seed, or teleport. Every action is logged: verb, selector, cost, world minute.
- **Start.** The lead's declared start record (WER2 to WER9) in the pack, not a cheat. A
  canon windfall needs an in-world source in the pack (an NPC action or a keyed find); if
  none exists, that is a P3 gap.
- **Canon outcomes as assertions.** Each row compiles to `at dayIndex(date) ± tolerance:
  assert fact F == value`, with the PX8 class. Never a prose match.
- **Null-player run.** Same seed, no player life; the lead runs as an NPC life through PL-E3's
  beat resolver; every reachable beat must resolve `carried` on its date (M4). Results must
  equal the bot run's facts.
- **Unreachable beat** (PX59): classify as world gap, chance loss, time overrun or
  dependent; chance loss restores the harness snapshot and retries up to 3 times [I count];
  world gaps file a row naming the blocking fact; downstream beats become `blocked by beat
  N`; mechanism beats become `blocked by mechanism`. The report is "k of n reached, with
  causes". No shortcut is ever added.

---

## 6. Risks and failure modes

| Code | Risk | Mitigation |
| --- | --- | --- |
| R1 | **Overfit to the lead** (PX60): Tingen exists only along the lead's path | L1 rule per place (non-lead users, one alternative route, neighbours); PX61 bystander week before step 6 |
| R2 | **Bot cheating** (PX63) | PL-B1 lint and audit log; code review of the bot is a named review state |
| R3 | **Copyright and private source text** | Raw text only in gitignored `docs/research/novels/.../private/` and `private_packs/`; committed files paraphrase with locators; the public summary carries IDs and counts. `origin` is public, so nothing canon-named from the table is committed (Q3) |
| R4 | **Sealed truths** | By ID, route and status only; witness-level text (PX49); M7 lint. None is held today for these worlds [S grep], and new ones created by YAIRPG changes stay sealed |
| R5 | **Reading budget (AU13)** | Reuse the 1,402-chapter notes and census first; new reading only for rows the notes lack; a declared shard cap (Q8); coverage fraction in every P1 report |
| R6 | **Chinese source and locators** | Locators as `zh 第N章 pM` with member file; English names follow existing `src` usage; a name with no English precedent is marked [U]. 12,000-word shards become a character cap for Chinese (Q8) [I] |
| R7 | **Save compatibility** | New records are additive pack data; CAE-E2's heir snapshot and any beat-result slice need an additive migration and a yes; M8 save, reload, export, import from a fresh origin |
| R8 | **Determinism not landed** | PL-E0 first; until PL-E1 lands, the LOTM route avoids ambient purchases or marks them [I] |
| R9 | **Mechanism dependence** | The lead's cheat-space beats are marked and reported, not faked |
| R10 | **Shared checkout** | New-file ownership; SendMessage before touching another session's files; own-path commits only |
| R11 | **One-point margin** | The choice is robust to one-point moves (tie default); a two-point move is reported in P6, not silently switched |

---

## 7. Decisions for Weibao (each with a recommended default)

| Code | Decision | Recommended default | Blocks |
| --- | --- | --- | --- |
| Q0 | Launch yes for the lanes (the brief is not launched) | Yes for PL-E0, PL-E2, PL-B1, then PL-E3, PL-E1, PL-H1 | Every lane |
| Q1 | Confirm the pilot | LOTM volume 1 (score 20, tie default either way); HP year 1 next | P1-P6 for LOTM |
| Q2 | Edition and source | The local Chinese EPUB (Calibre ID 1) as the canon text, English names from existing `src` usage; no new acquisition. An English translation would need his yes | P1 |
| Q3 | Where the lead-run table and canon-named rows live | Private and gitignored (`docs/research/novels/lord-of-mysteries/private/` and `private_packs/lotm-lead/`); public summary with IDs and counts only | P2, P3 |
| Q4 | LOTM start month (D3) | The month given by the volume's opening date anchors, read by one bounded reader with a locator; until then relative dates `D+n`. My memory says early summer 1349 [U] | P2 absolute dates (relative rows can proceed) |
| Q5 | WER11 rewording (D2) | "Live beside protagonists by default; the protagonist's own life exists as an NPC life and as a test double, not as a player seat unless a world says otherwise." | PL-S1 only; not the lead run, because the bot is a test double |
| Q6 | Default seat | `beside`, natural course (D1) | PL-S1 |
| Q7 | HP cohort offset (D3) | 0 when HP's turn comes; an offset only for lives that ask for it | HP PL-S1 only |
| Q8 | P1 reading budget (AU13) | Gap-only reading over existing notes; 12,000 Chinese characters per haiku shard, at most 15 shards and 6 responses each, two readers at once; a sonnet spot-check of 10% of rows | P1 |

**Top three to answer first** (after Q0, the launch yes): Q2 with Q8 (edition and budget unblock P1), Q3 (private
placement), Q4 (start month). Q1 holds by default unless he picks another book.

**Lanes independent of Q1 to Q8 (still gated on Q0, the launch yes):** PL-E0, PL-E2 (minus its save addition), PL-B1, PL-E3, PL-E1, PL-H1.

---

## 8. Advisor reconciliation (one call, before writing)

The advisor reviewed the survey and a first draft of the scores (HP 22, MoL 20, LOTM 19).

| Advice | What I did |
| --- | --- |
| Score criterion 3 on touched-set nouns, not world depth | Ran the 12-noun grep. HP fell from 2 to 0 (1/12; the pack is book-two Polyjuice and an abstract term). LOTM stayed 2 (7/12). MoL stayed 2 (9/12, but a visitor branch) |
| Cite the favorites line for criterion 9 | Cited queue:557. HP fell from 2 to 1; MoL stayed 1 (adjusted my rubric: 3 favorite and deep pack, 2 one of those, 1 some investment) |
| Score criterion 8 on sealed IDs actually held | None found for any of the three; kept spoiler density as the tiebreak inside the criterion and said so |
| Take arc boundaries from TOC metadata | LOTM boundary from `nav.xhtml`; MoL has no arc labels, so its boundary is [U] |
| Add a sensitivity line; if the margin is ≤1, apply the tie default | Added. I also re-read criterion 5's wording and raised LOTM from 2 to 3: the path is clear; the mechanism dependence belongs in risks (R9), not clarity. That change is mine, not the advisor's, and it does not decide the result: at 19 LOTM would tie and win on the default |
| Build order: engine seams first, add the beat resolver, Village as harness, P1 in parallel | Adopted as PL-E0, PL-E2, PL-B1, PL-E3, PL-E1, PL-H1; P1 parallel once Q2/Q8 are answered |
| Tie decisions to what they block; make private placement a decision | Done in section 7 (Q3) |
| Sample-row dates | The HP row's date is [I]; no year is stated |

---

## 9. More to consider (round 1 of this plan)

**ACT NOW (done):** pilot scored and chosen with sensitivity; arc boundary from TOC; table
schema with two rows; inventory method with baseline; lane table in order; bot design;
risks; decisions with defaults; register row and USER_VISION record.

**ACCOUNT FOR NOW**

- PL-A1. **The lead's cheat space is the first mechanism gap.** Many volume-one beats route
  through it; count them in P2 so the mechanism lane's size is known before P4.
- PL-A2. **The LOTM pack's existing lives are original roles** (a probationer under an original
  warden; a civil clerk) [S `book_world_lotm_lives.js:1-7`]. The lead run adds a canon line
  beside them; the two must not share ids, and the existing lives stay playable.
- PL-A3. **HP's abstract term must not be rewritten for the pilot.** When HP's turn comes, a
  canon school-year calendar sits beside the 70-day term as a separate record, so current
  saves keep their term.
- PL-A4. **Remote contacts.** Gatherings in the cheat space touch people in other cities; only
  the touched facts enter L0, and their places stay out of scope.
- PL-A5. **The public summary is still a spoiler surface.** IDs and counts only; no beat names
  in public files (PL-L5 lint later).

**LATER or DELEGATE**

| # | Item | Level | Effort | Done check |
| --- | --- | --- | --- | --- |
| PL-L1 | Bounded reader for the MoL first-loop boundary | Research, haiku | Small | A chapter number with a locator, or [U] kept |
| PL-L2 | Edition and copy check for *Dracula* | Research | Small | A verified public-domain edition named; acquisition only on his yes |
| PL-L3 | Lead mechanism lane for LOTM (cheat-space verbs) | Engine plus pack | Medium to high | The bot reaches the first mechanism beat through public commands |
| PL-L4 | HP year-one beat pack and canon school-year calendar | World pass | Medium | HP criterion 3 rescored; the 70-day term still loads |
| PL-L5 | Beat-name lint for public files | `check:rules` | Small | A planted beat name in a public doc fails the lint |
| PL-L6 | Propose PX51 (protagonist-first pass) as a WPR candidate | Docs | Small | A proposal paragraph, not a rulebook edit |

---

## 10. Round 2: everything the book mentions (2026-10-27)

Weibao asked whether we implement everything the book mentions, with other characters
existing somewhere and filled in slowly, and whether to set up absorption rules. The
answer and the considerations are saved in their owner,
[world absorption rules round 4](../../../WORLD_ABSORPTION_RULES.md#more-to-consider-round-4-everything-the-book-mentions-lead-first-2026-10-27)
(WAL1-WAL17). Absorption rules already exist and are accepted (WA1-WA21); the round adds
the link to this pipeline. Changes to this plan:

- **ACT NOW (done):** P1's done check now records every mention in volume 1 as a census
  row placed at an address and era (WAL1-WAL3), not only the lead's touches.
- **ACCOUNT FOR NOW:** P3 promotes only lead-touched rows to M3; other rows stay M1 or M2
  (WAL2). Any fill between canon mentions reads that entity's future anchors (WAL4). A
  census-to-pack id map comes before the first promotion (WAL11); canon rows sit beside
  the existing original LOTM slice, never over it (WAL12).
- **LATER / DELEGATE:** WAL14 (whether WAL2-WAL4 become WA22-WA24, Weibao's yes), WAL15
  (census schema v2), WAL16 (id map), WAL17 (rung counter). Added to decisions as Q9 below.

| Code | Decision | Recommended default | Blocks |
| --- | --- | --- | --- |
| Q9 | Make the presence ladder, dated whereabouts and forward anchors standing rules (WA22-WA24) | **Answered 2026-10-27: yes.** Accepted as WA22-WA24 in [WORLD_ABSORPTION_RULES](../../../WORLD_ABSORPTION_RULES.md) and the rules index | None now |

---

## 11. Round 3: a sampled reading, improvements, and the lead living his own life (2026-10-27)

Weibao: "Yes, send a lesser reader to sample a little and then consider improvements, and
then, how will the thing go through and implement the main character as if they are
playing through their own life? more to consider? details to absorb?" The "Yes" answered
Q9 (WA22-WA24 accepted). Proposals below; nothing else is accepted.

### 11.1 What ran (AU and WPR7 ledger)

| Item | Value |
| --- | --- |
| Reader | 1 haiku agent, fresh context, 5 tool uses, retired after one shard |
| Source read | Volume 1, chapters 1 to 3 (`lotm_c_0001` to `lotm_c_0003.xhtml`), 8,747 Chinese characters, extracted to a private shard with paragraph numbers |
| Output (private, gitignored) | `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/`: 23 lead-run rows, 82 census rows, a friction note |
| Coordinator review (WPR18-WPR19) | 5 locators opened at source: 5 correct. A script checked every census row's first-mention locator against its Chinese name: 72 exact, 4 off by one paragraph, 6 rows whose `zh` field is a paraphrase rather than the literal name |
| Coverage | 3 of 213 chapters (1.4%) of volume 1 [S nav count] |

### 11.2 What the sample showed, and the improvements (schema v1.1, proposals)

| Code | Finding [S sample files] | Improvement |
| --- | --- | --- |
| SF1 | **Too fine.** 23 rows for three chapters projects to about 1,600 rows for the volume [I, linear]; 10 of 23 were marked `great`, several of them the lead thinking or planning | Two levels: **scenes** (one row per place-and-time with a goal or a world change) and **steps** (routine actions folded into the scene's `steps[]` or into schedule records). `great` only when a world fact changes and a footprint exists |
| SF2 | **Thought is not a beat.** Remembering, realizing and planning rows change what the lead knows or wants, not the world | Move them to the lead's knowledge list (LP5) and motive tags (LP7) with locators; a beat may cite them as inputs |
| SF3 | **Dates are relative and no field holds time of day.** Only 1 of 23 rows had a stated date (the next dawn); bells, moon and dawn carry the clock | Add `anchor` (the beat a relative date counts from) and `timeOfDay` with its evidence (bell count, light, moon). The start-month decision (Q4) turns `D+n` into dates in one pass |
| SF4 | **Amounts had nowhere to go.** Fees, fares, caps and coin values sat in notes | Census `amount: {value, unit, per, cap}`; a separate `estimateBy` when a character converts to another world's money (a claim, WA23) |
| SF5 | **Kinds did not match** between `touched` and the census (event, organization, deity, language, measure) | One kind vocabulary for both files, validated by the schema lint |
| SF6 | **`action` shape was undefined** | `actions: [{verb, object, cost}]` with engine verbs |
| SF7 | **Evidence could not tell narration from the lead's thought or another speaker** | `kind`: `shown`, `narration`, `thought:<who>`, `dialogue:<who>`, `inferred` |
| SF8 | **One lead, two identities** (the arriving mind and the host body's name) | One life id; names as aliases; two knowledge lists in the start package (LP1); names resolved through the resolver (WA22 rows, CAE-E1/E4) |
| SF9 | **English names guessed as pinyin** | `nameSource: repo / wiki / pinyin-unconfirmed`; repo usage wins, then the wiki dump already saved (`wiki-api-2026-10-25`) |
| SF10 | **Locators drift by a paragraph and `zh` gets paraphrased** | The locator check above becomes a P1 gate script: `zh` must be literal and found in the cited paragraph or the next two |
| SF11 | **Mechanism beats appear at once.** The opening's first rows already depend on things ordinary verbs cannot do (four rows were marked with a mechanism) | Expected (A1); the mechanism lane's size is measurable from P2's counts |
| SF12 | **The opening is dense with daily-life facts**: 10 price rows, 4 clock rows and 3 calendar rows in three chapters, most not in the runtime [I, grep pending] | This is the strongest support for LP3 and LP4: the lead's ordinary days are where the touched set grows fastest |

### 11.3 The lead lives his own life: how the run works

The bot is not a list of teleports between plot points. It is a **life** in the engine,
with the same records a player life has, driven by a **lead policy** instead of clicks
from Weibao. Three layers (codes LP1-LP12, proposals):

| Code | Layer | What it does | Default, dial and reason |
| --- | --- | --- | --- |
| LP1 | **Start package** | The lead's day-one record per WA13 and WER2-WER9: body, purse, debts, lodging, household, job, papers and two knowledge lists (the host's memories and the arriving mind's own) | Default: built from beat 001's touched facts. Reason: the lead starts where the book starts, with nothing granted that the pack cannot source (PX57) |
| LP2 | **Beat goals** | Each lead-run row becomes a goal: be at place P inside the date window with inputs I, then do the action | Default: goals only for rows; the policy plans the route with the same travel, buy and talk verbs a player uses |
| LP3 | **Days between beats are lived** | Between goals the lead runs the ordinary routine a player life would: work shift, meals, rent, sleep, family time, from his schedule records | Default: routine from pack schedules, never skipped time. Reason: this is what "playing through his own life" means, and it is what tests prices, wages and clocks |
| LP4 | **Ledger anchors** | Where the book states the lead's money, possessions or debts, that becomes an assertion on that date (for example purse after a purchase) | Default: every stated amount is an anchor. Reason: a world whose prices and wages do not reproduce the lead's purse is wrong somewhere, and the anchor says where |
| LP5 | **Knowledge-gated acting** | The policy may use only facts on the lead's knowledge list at that date (WA12); each new fact enters by a beat with a locator | Default: strict. Reason: stops the bot from playing with the reader's knowledge, the commonest canon error (DWF68) |
| LP6 | **Choices are recorded as branch points** | Where the book shows the lead weighing options, the row stores the option taken and the options named; these become role slots and divergence points when the seat opens | Default: options named in text only (S), others marked I. Reason: free material for step 5 and for poke tests |
| LP7 | **Motives drive routine, not prose** | Fear, need and want become need-profile tags on the lead (RLB) that the routine and the choice points read | Default: tags only where an action depends on them |
| LP8 | **The engine writes his diary** | Each beat and each lived day writes chronicle and return-note lines through the resolver; the run report compares the diary's beat list with the table (M1) | Reason: proves return notes exist for every beat and that names resolve (CAE-E1/E4) |
| LP9 | **Mechanism beats wait** | A beat that needs a power the engine lacks is `blocked by mechanism`; routine continues around it so later ordinary beats still run | Reason: one missing power must not stop the rest of the life |
| LP10 | **Three runs, one table** | (a) lead as the player life, driven through the UI by the bot; (b) lead as an NPC with no player (null-player); (c) later, lead as NPC with a bystander beside. (a) proves the player path; (b) proves NPC autonomy; their facts must agree | Default: (a) and (b) both in P5 |
| LP11 | **Daily snapshots** | One snapshot per world day in the harness, so a failed anchor can be bisected to the day that drifted | Reason: cheap with seeded days (C1) |
| LP12 | **Watch mode (later)** | A read-only replay of the lead's life at speed, with the diary and anchor ticks beside it | LATER: a demo and a review tool for Weibao; inspection only, no mutation |

### 11.4 Details to absorb (what a lived life needs; checklist for P1 readers)

Taken from the sample's rows and from LP1-LP12; each is a census kind or a field. Readers
record every one they see, with a locator.

| Code | Detail | Why the lead's life needs it |
| --- | --- | --- |
| DA1 | Coin denominations, their values and **rounding** (the sample shows small coins too coarse, so purchases round) | Purse anchors (LP4) and every price |
| DA2 | Prices with unit, per and cap (fares by distance with zone caps; fees per week by school type) | Routine costs (LP3) |
| DA3 | Household budget: who earns, who pays rent, utilities, food, schooling | The lead's start package and monthly balance |
| DA4 | Metered utilities and how they are paid (the lamp row needed a payment) | Daily routine costs and a reason to keep coins |
| DA5 | Lodging layout and shared facilities (washroom down the hall) | Where routine steps happen; bystander lodging later (PX61) |
| DA6 | Family members' schedules and their own economies (walking to school to save the fare) | Household NPC lives beside the lead; L1 people |
| DA7 | Walking times and transit options between named places | Route planning (LP2) and the time cost of a day |
| DA8 | Public clocks: bells, light, moon phases; the week and its rest day; month and year length | Day boundaries, `timeOfDay`, the C1 day index |
| DA9 | Appointments with time and place (an interview the next day) | Beat windows and dependencies |
| DA10 | Body state and its changes (injury, healing, fatigue, hunger) | Whether the lead can act; mechanism flags |
| DA11 | Knowledge events: what the lead learns, from whom, when | LP5 knowledge gating |
| DA12 | Languages and scripts the lead can read, and how he came to read them | Knowledge list and mechanism flags |
| DA13 | Religious observance and church calendar where it shapes the day | Routine and rest days; laws (WA4) |
| DA14 | Documents and identity papers | Starts, jobs, travel (the existing pack already prices papers) |
| DA15 | The lead's choices and the options he names | LP6 branch points |
| DA16 | Motives that change behavior (fear, money worry, duty to family) | LP7 tags |

### 11.5 More to consider (round 3)

**ACT NOW (done):** one sampled reading under budget with review; SF1-SF12; WA22-WA24
recorded on Weibao's yes; LP1-LP12; DA1-DA16; Q9 closed.

**ACCOUNT FOR NOW**

- PL-A6. **Living the days multiplies the touched set.** LP3 means P3 must cover the
  routine (meals, rent, utilities, fares, work) before the bot can pass a month, not only
  the beats. The first P5 target is therefore one lived week, not the volume.
- PL-A7. **Ledger anchors will find inconsistencies in the book itself.** When the book's
  own amounts do not add up, keep both (WPR20) and mark the anchor `source-inconsistent`
  rather than tuning the world to fit.
- PL-A8. **Interior rows are spoiler-dense.** Knowledge-list rows reveal what the lead
  learns; they stay in the private table, IDs only in public files.
- PL-A9. **Scenes, not chapters.** P1 shards stay chapter-aligned for budgeting, but rows
  are per scene; a scene that crosses a shard boundary carries a `continues` link.

**LATER or DELEGATE**

| # | Item | Level | Effort | Done check |
| --- | --- | --- | --- | --- |
| PL-L7 | Schema v1.1 file and lint (SF1-SF10), with the locator check as a script | Sonnet, small | One session | The three sample files convert; the lint flags a planted wrong locator and a paraphrased `zh` |
| PL-L8 | Re-run the same three chapters under v1.1 with one fresh haiku reader | Haiku, small | 1 shard | Fewer rows than 23; amounts in fields; kinds match |
| PL-L9 | Grep the runtime for the sample's price, clock and calendar rows | Haiku, small | Minutes | A present, partial or missing list (M2 baseline) |
| PL-L10 | One lived week (LP3, LP4) as the first P5 target | Sonnet, medium, after PL-E0 and P3 for that week | One session | The bot lives seven days with routine costs and every stated amount matches its anchor |
| PL-L11 | Watch mode (LP12) | Sonnet, medium, later | One session | A read-only replay shows the diary and anchor ticks; no state changes |

---

## 12. Round 4: schema 1.1 built, the bot, different information, path changes, blanks and surfaces (2026-10-27)

Weibao: "Consider and record missing stuff accordingly and then implementing it? More to
consider? Can we find out how the bot would play differently given different info long
term? more to consider? We should change the path accordingly? more to consider? How does
each prose detail even get shown in the game? More to consider? how does the 'bot' work?
more to consider?" and, mid-round: "there will be alot of work needed to implement each
location and more? and the people in each location? the stuff in the merchant's inventory
that isnt stated? Lots of blanks we can reasonably fill at the same time(not stated in the
book)?" Proposals, except the tooling built in 12.1.

### 12.1 What was built and run

| Item | Result |
| --- | --- |
| [LEAD_RUN_SCHEMA](LEAD_RUN_SCHEMA.md) 1.1 | Scenes, census and a new `fill/1.1` file for blanks; F1-F10 clarifications from the re-run |
| `scripts/lead_run/lint_lead_run.mjs` | Pure lint plus CLI; checks SF1-SF10, footprint shape, numeric anchors, choice locators, literal-name locators against a private shard, and a quote guard. Prints codes and counts only |
| `tests/lead_run_lint.test.js` | 4 tests, invented fixture text: `node --test tests/lead_run_lint.test.js` passed 4 of 4 |
| Lint on the first sample (1.0) | Every row fails the schema tag as expected; plus 10 `great` rows without footprint, 17 evidence kinds, 10 prices without amounts, 10 kinds, 14 whereabouts statuses, 7 names not at their locator |
| Re-run under 1.1 | 1 haiku reader, fresh context, 6 tool uses, same 8,747-character shard. 5 scenes (from 23), 47 census rows, 5 fills. Lint: census clean; scenes failed only `date-label` (prose in the label field, now F9) |
| New findings | Census recall fell from 82 rows to 47 when scenes were compressed (F10); every row stayed M0 because the rung had no criteria (F8, now defined). The five fills each cite stated facts as basis; one fill gives a stated person (the landlord) a duty the text does not state, which is what a fill is for, and stays `authored-proposal` |

### 12.2 How the bot works

The bot is a test harness that owns no game state. Parts (new files under
`scripts/headless/lead_bot/`, owned by PL-B1):

| Part | Input | Output |
| --- | --- | --- |
| **Compiler** | Scenes, census, fills (schema 1.1) | Goals (be at P in window W with inputs I, do steps), assertions (outcomes, anchors), knowledge events by date |
| **Calendar** | C1 `dayIndex`, the start-month decision (Q4) | Absolute dates for `anchor + offsetDays` rows |
| **Knowledge gate** | The lead actor's facts (per-actor facts already exist: `src/world_knowledge.js:3` takes an `actorId`) plus the compiled knowledge events | Which facts the policy may use today |
| **Policy** | Goals due, routine schedule, motives, knowledge | Today's ordered intents. Two modes: `replay` (do the scene's steps) and `model` (choose by motives and needs; canon is the expected answer, 12.3) |
| **Planner** | An intent and the world map | A route of public verbs: travel, buy, talk, work, rest. A missing route or verb is a world-gap row (PX59), never a teleport |
| **Driver** | Verbs | `ui` driver: clicks through `scripts/headless/runner.mjs` with the lead as the player life. `npc` driver: the same intents handed to the lead's NPC life through the beat resolver (PL-E3) with no player |
| **Checker** | World facts after each day | Pass, fail or `source-inconsistent` per assertion; the first failing day |
| **Snapshots** | Harness state each world day | Bisecting a drift to its day (LP11) |
| **Reporter** | Log and checks | "k of n scenes reached, with causes", anchor table, gap rows, diary-versus-table diff (LP8) |

Daily loop, the same for both drivers:

```text
for day from start to end:
  facts = knowledgeGate(day)
  intents = policy(goalsDue(day), routine(day), motives, facts)
  for intent in intents: for verb in planner(intent): driver.do(verb); log(verb, cost, minute)
  checker(assertionsDue(day)); snapshot(day)
report()
```

### 12.3 How the lead would play differently with different information

Only the `model` policy can answer this; `replay` just repeats the book. Order:

1. **Fidelity first.** At every recorded choice point (LP6), give the model the lead's
   canon knowledge and motives and see whether it picks the canon option. Score: k of n
   choices reproduced. A low score means the motive tags are wrong or thin, not that the
   book is wrong.
2. **Then change one input.** Add, remove or delay one knowledge fact at one date (what a
   player could do through the PX37 channels: tell, warn, rumor, hide). Re-run from that
   day's snapshot. Report: the first choice that changed; each later scene as carried,
   shifted (time), moved (place), averted, replaced or blocked; the end-of-run world facts
   that differ; the influence-ledger rows (PX42).
3. **Long term.** Divergence compounds. After the first change, later canon scenes run by
   their causal preconditions (WA15): a scene whose needs still hold happens; one whose
   needs fail is averted, not forced (AD2). Decisions canon never showed are labelled
   `policy-inferred`.

Each counterfactual is a cheap headless re-run from a snapshot; the cost is authoring the
motive and need tags well enough that fidelity is high. Uses: testing the influence
channels before the seat opens; a "what would he do if told X" preview for design; finding
which facts the lead's line actually depends on (a fact whose removal changes nothing is
not a dependency).

### 12.4 Changing the path accordingly

Yes, and by rule rather than by hand:

| Code | Rule (proposal) | Reason |
| --- | --- | --- |
| PC1 | Re-plan only the affected subgraph: scenes reachable through `needs` edges from the changed fact | Keeps the rest of the canon line stable and cheap to check |
| PC2 | Each scene gets a status: carried, shifted, moved, averted, replaced, blocked | The same words in the run report, the influence ledger and the return note |
| PC3 | After divergence the lead's goals come from his motives, not from the dropped canon scene | He keeps living a life, not waiting for a plot that no longer happens |
| PC4 | Forward anchors (WA24) still bind generators; player-caused change may break them and is labelled; the continuity becomes divergent (WA18) with the dropped anchors listed | WA24's dial, applied |
| PC5 | Divergent runs are branches with a label, never edits of the canon table | The canon run stays the regression baseline |

### 12.5 Blanks the book never states (locations, people, merchant stock)

Yes, it is a lot of work if each blank is hand-written, so most blanks are not. Three
routes, cheapest last:

| Route | What | When | Rules |
| --- | --- | --- | --- |
| **Scene kit** (authored proposals, reviewed) | For every place a scene uses: who runs and staffs it, hours, stock categories, a price band, regulars, sounds and smells | At the same pass as the reading, as `fill/1.1` rows | `basis` cites the stated facts; `respects` lists laws and forward anchors (WA24); never claims source truth (WA3) |
| **Generators** (for anything repeated) | Shop stock from a shop-type grammar plus the world's laws, era and stated price anchors, keyed by place and day (C2); people from cast tiers (DWF67): principals authored, recurring role templates, crowd derived | When the scene kit names a type that recurs | WA7, GR1-GR17; stated prices calibrate the band; frozen on first reveal |
| **Lazy fill** | Everything nobody has looked at | First visit by any life | Same generators; costs nothing until visited (WAL5, WO1) |

Fill priority follows the lived week (PL-L10): the places the lead's ordinary days use come
first, then places other lives can reach (WAL13). Stated facts always win over fills; a
later reading that contradicts a fill replaces it, and the fill's id is kept with
`supersededBy` (WAC25).

### 12.6 How a prose detail reaches the screen

The book's prose never does. A detail becomes a fact, and the fact is shown in our own
words on a surface when it matters:

| Detail kind | Fact | Surface and trigger |
| --- | --- | --- |
| Place description, smells, sounds | Place record fields | Look text on arrival; ambient line by time of day |
| Prices, coins, rounding | Price and currency records | Shop panel and receipt; a rounding note when the change is short |
| Bells, dawn, moon | Clock records | Clock strip; a line at the hour |
| People's routines and habits | Schedule records | Seen where they are; mentioned in talk and rumor |
| Events | Beat records with footprints | Return note and diary at the witness level (PX44, PX49); rumor and news with travel delay (DWF70) |
| What a character knows or says | Knowledge and claims (WA23) | Dialogue barks from voice sheets (DWF74, DWF76); claimed versus true marks |
| Laws and customs | Law records (WA4) | The plain result when they block or permit; the reason once learned (WAC21) |
| Items and documents | Item records | Inspect panel |

Proposal for census 1.2: a `surfaces: [{surface, trigger}]` field, so a lint can report
details with no surface. A detail with no surface is either data that a mechanic uses (a
price inside a wage) or texture waiting in a queue; both are fine, but the count is visible.

### 12.7 Missing pieces recorded (what a lived lead needs that no lane owns yet)

| Code | Missing | Existing seam to grow | Owner lane |
| --- | --- | --- | --- |
| MS1 | The lead as an NPC life that runs a daily routine from schedules, not only beats | Beat resolver (PL-E3); NPC absence schedules-first clocks | PL-E3 scope grows to "routine plus beats", or a new PL-E4 |
| MS2 | Dated knowledge per actor (gained on a date, from a source) | Per-actor facts exist (`src/world_knowledge.js`, `src/people_knowledge.js`) [S file headers]; dating them is [U] | PL-E4 |
| MS3 | Zone-capped fares, coin rounding, metered utilities | Trade and travel cost seams (`trade.js`, `shop_restock.js`) [I] | P3 data, engine card if a cap rule needs a verb |
| MS4 | Shared household purse and budget | `home_household.js`, `household_fortunes*` [S file list] | P3 with an owner check |
| MS5 | Per-life diary with resolver names | `chronicle.js` plus CAE-E1/E4 (PL-E2) | PL-E2 |
| MS6 | Public clocks (bells, light, moon) as signals a life can read | `world_rhythm.js` [S file list] | P3 data |
| MS7 | The `model` policy and choice-point fidelity score | None | PL-B2 (new, after PL-B1) |
| MS8 | A `surfaces` field and the count of details with no surface | None | PL-L13 |
| MS9 | Grep baseline: coach fares, washroom and rest day have no hits in the LOTM runtime files; bells 1 file [S grep 2026-10-27] | | PL-L9 |

### 12.8 More to consider (round 4)

**ACT NOW (done):** schema 1.1, lint and test built and run twice; F1-F10 settled; the bot's
parts and loop; information variants; path-change rules PC1-PC5; three fill routes for
blanks; detail-to-surface table; MS1-MS9 recorded.

**ACCOUNT FOR NOW**

- PL-A10. **Two policies, two purposes.** `replay` proves the world (golden run);
  `model` explores what-ifs. Never let a `model` result redefine the canon table.
- PL-A11. **Fill review is the real cost.** Readers can propose fills cheaply; reviewing them
  against stated facts and forward anchors is where effort goes. Batch review per place, and
  let generators replace fills for any type that repeats.
- PL-A12. **Recall versus compression.** Scenes compress; the census never does (F10).
- PL-A13. **Counterfactual runs need snapshots and seeded days** (PL-E0, LP11) before they
  mean anything.
- PL-A14. **Surfaces have an attention budget.** Showing every detail at once buries the
  useful ones; triggers decide (UI rules). A detail used only inside a mechanic is fine.

**LATER or DELEGATE**

| # | Item | Level | Effort | Done check |
| --- | --- | --- | --- | --- |
| PL-L12 | Census recall check: deterministic candidate list from the shard compared with census rows | Sonnet, small | One session | Reports missed amounts and names per shard; the first sample's misses appear |
| PL-L13 | Census 1.2 `surfaces` field and a no-surface count | Sonnet, small | Small | Lint prints the count per kind |
| PL-B2 | `model` policy with choice-point fidelity score | Sonnet high, opus review | Medium | On the first lived week, k of n canon choices reproduced, reported |
| PL-L14 | One counterfactual demo: remove one knowledge fact at one date and re-run | Sonnet, after PL-B2 and PL-E0 | Small | A divergence report with scene statuses (PC2) |
| PL-L15 | Shop-type stock grammar for Tingen, keyed by place and day (C2) | Sonnet, after PL-E1 | Medium | Two visits on the same day give the same stock; the band matches stated price anchors |

---

## 13. Round 5: measured reading, time precision, read-ahead and the lead play flow (2026-10-27)

Weibao's questions this round (verbatim in USER_VISION): a longer sample to find what the
lead needs to play through all his own options while also building what exists but is not
touched; whether events need to be down to the hour; whether tiny reads save or cost
tokens; reading ahead so an implementor catches up later; the best chapters per read; and
the UI flow for playing the lead's life as in the book. Proposals except where marked built.

### 13.1 What ran (AU and WPR7 ledger)

Six haiku readers, fresh contexts, chapters 1-15 of volume 1 (7.0% of the volume's 213
chapters), all output private and gitignored. Token counts are the harness's reported
subagent totals [S task notifications].

| Run | Chapters | Source chars | Tool calls | Tokens | Rows (scenes / census / fills) | Tokens per source char | Tokens per row | Lint on return |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| s1 (schema 1.0) | 1-3 | 8,747 | 5 | 137,571 | 23 / 82 / 0 | 15.7 | 1,310 | not applicable |
| s1 re-run (1.1) | 1-3 | 8,747 | 6 | 116,813 | 5 / 47 / 5 | 13.4 | 2,049 | 1 code (date label) |
| s2 | 4-6 | 10,465 | 9 | 236,715 | 11 / 223 / 15 | 22.6 | 951 | **failed**: reader did not run the lint; 22 names not at locator, 17 id namespaces, schema tags missing |
| s3 | 7-8 | 7,670 | 11 | 155,767 | 5 / 173 / 5 | 20.3 | 851 | pass, after over-budget self-fixes |
| s4 | 9-11 | 10,000 | 6 | 142,743 | 8 / 104 / 6 | 14.3 | 1,210 | pass first time |
| s5 (lean protocol) | 12-14 | 9,683 | 7 | 154,059 | 9 / 121 / 6 | 15.9 | 1,133 | pass after 2 fixes |
| s6 (lean protocol) | 15 | 2,738 | 5 | 108,289 | 4 / 52 / 6 | 39.6 | 1,747 | pass |

Totals for chapters 1-15 under schema 1.1 or later: 42 scenes, 720 census rows, 43 fills,
89 options (47 not taken), 4 scenes with hour or minute precision out of 37 in chapters 4-15.

Coordinator review (WPR18-WPR19): the s2 reader reported a money conflict between two
paragraphs; opened at source, the two agree (one note spent at each of two shops), so the
claim was a misreading and is not folded. Earlier spot checks: 5 of 5 locators correct.

### 13.2 Do tiny reads save tokens? No: they cost more per chapter

Fitting the runs with similar tool counts (s4 and s6): about **95,000 tokens of fixed
overhead per reader** (brief, schema, and the whole context resent on every tool call) plus
about **4.8 tokens per source character** [I, two-point fit, checked against s1 and s5 within
about 15%]. So:

| Shard size | Predicted tokens | Per source char |
| --- | --- | --- |
| 1 chapter (about 3,000 chars) | about 110,000 | about 37 |
| 3 chapters (about 10,000) | about 143,000 | about 14 |
| 4 chapters (about 13,000, over the AU cap) | about 157,000 | about 12 |

The big lever is **tool calls, not shard size**: s2 (9 calls) and s3 (11) cost 40-65% more
than s4 (6) for similar text, because each call resends everything so far. The "lean"
four-call protocol did not hold (7 and 5 calls) because the readers read the brief and the
schema separately and fixed their own output. Overrun causes: a reader rereading its own
files, self-fixing after the lint, and the brief arriving as a separate file.

Whole-volume estimate: chapters average about 3,300 characters [S 49,303 chars / 15
chapters], so volume 1 is about 700,000 characters, about 61 three-chapter shards and about
9 million haiku tokens at today's rate [I]; cutting each reader to four calls would save
perhaps 20-30% [I].

### 13.3 Best chapters per read

**Default: about three chapters, 8,000 to 11,500 Chinese characters, split at a scene
boundary** (proposed WA30). Evidence: errors tracked whether the reader ran the lint, not
shard size (s2 failed without it; s3, s4, s5 and s6 passed with it); census recall varied by
reader far more than by size (16 to 87 rows per chapter); one-chapter shards paid the
overhead three times over. Split by scene rather than chapter when a scene crosses the
boundary (`continues`), and keep two-chapter shards when the next chapter would pass
11,500 characters. Going larger needs a change to the AU 12,000-word cap, which is
Weibao's call, and buys only about 15% per character.

### 13.4 Hours and minutes: where they matter

Only 4 of 37 scenes in chapters 4-15 had hour or minute precision, each from a bell, a
pocket watch, a stated recurring time or the night hour. Proposed WA29:

| Case | Precision | Why |
| --- | --- | --- |
| Appointments, interviews, recurring gatherings with a stated hour | minute window | Another life can be there or miss it |
| Opening hours, shop and office hours | hour | Decides whether an action is possible |
| Bells and public clocks | hour | The world's own clock signal, shown to the player |
| Transit and walking times | minutes as a duration | Fill the lived day correctly (LP3) |
| Deadlines with a stated day | day plus band | A day is enough unless the text sets an hour |
| Routine meals, chores, rest, most scenes | band | Nothing reads a minute here |

The engine runs in minutes already (`src/book_world_hp_facts.js` uses minute clocks), so
this is about **what readers must extract**, not what the engine can hold. Cost: almost
none, because readers record a time only when the text gives one; the bot fills the rest
from schedules.

### 13.5 Read ahead, catch up later

Yes, once the schema is stable. An advance ledger per shard holds everything an implementor
needs without rereading: scenes, census, fills, untaken options, loops, open questions,
and a **shard header row** (proposed WA31): schema version, reader model, source member
hashes, date, lint result, audit grade (A: lint pass plus five locators and every conflict
checked; B: lint pass only; C: lint failed). Rules:

1. An implementor uses grade A, or grade B after a five-locator check; grade C is reread.
2. A minor schema change (1.1 to 1.2) converts by script; a major change rereads.
3. **Catch-up checklist** for the implementor: run the inventory script (section 3) against
   the current pack, list ledger ids now present, partial or missing; reconcile cross-shard
   ids first (see 13.7 RF2); then take the missing list for the lived week in order.
4. Freshness: a repo change that renames a pack id updates the id map, not the ledger.

Recommendation: read the rest of volume 1 in advance only after PL-L7's v1.2 and the
cross-shard id registry (RF2) land, and after Weibao's yes on the budget (Q8 at about
9 million haiku tokens).

### 13.6 The lead's play flow in the UI

The bot and a player-as-lead use the same screens; the bot proves the path first. Playing
**as** the lead needs Q5 (the WER11 wording); until then this flow is for the bot run and
for a later decision. Target viewports 1920x1080 and 1536x864 (standing UI priority).

| Element | What the player sees | Existing owner to reuse |
| --- | --- | --- |
| **Scene card** | Where and when, the goal, and the options: the canon choice and the untaken ones (playable at their rung or marked as not built) | Storylet deck and UI (`src/storylet_deck.js`, `storylet_ui.js`) |
| **The lived day** | Ordinary panels between scenes: go, shop, work, cook, rest, family, with the clock strip and purse | Existing location, shop and household panels; direct paths (UR21) |
| **Diary and return note** | What happened today in plain words, beat statuses, and the witness-level line | Chronicle (`src/chronicle.js`) and return notes (PX44) |
| **Clocks and amounts** | Bells, time band, purse with coin rounding, stated anchors ticking | Clock and money surfaces (12.6) |
| **Book line toggle** | "Follow the book" shows the next canon scene as optional guidance; turning it off leaves only the life | New small panel; progressive disclosure (UR42) |

**Minimal first screen:** the lodging room at night on day one: the scene card with its
goal and options, the purse and clock strip, the room's look text, and one exit to the
washroom. Done check: the bot reaches scene 2 through clicks at 1920x1080 and 1536x864,
saves, reloads and imports with the same state.

### 13.7 The longer sample: necessary core and the untaken-option ledger

**Unit:** chapters 1-15 now (done: they cover the opening days through the first job offer
[I]); the next unit is "one lived week" measured in story days, not chapters.

**Method:**
1. *Necessary core* = everything in `touched` for taken steps and options, plus every
   `needs` id of a taken option (what must be built to replay the book).
2. *Untaken-option ledger* = each untaken option with its `needs` (47 so far). Each gets a
   stub action at rung M2 (cost, requirement, plain result; WA28) when its needs exist, or a
   gap row when they do not. Their needs are mostly items (18), people (8), fills (7) and
   organizations (3) [S counts over s2-s4].
3. *Present but untouched* = scene `present` ids (45 so far) and the rest of the census
   (720 rows): placed at M1, shallow at M2 only where a life can reach them (WA22).
4. *Out:* off-lead viewpoint scenes become census and other lives' rows, not lead scenes;
   later volumes; mechanism verbs until a mechanism lane is approved.

**Findings from the longer read (RF codes):**

| Code | Finding | Fix |
| --- | --- | --- |
| RF1 | Readers handle off-lead viewpoint chapters differently: one dropped them to census only, another wrote them as lead scenes | Add `pov` to scenes; lead runs use only `pov: lead`; other viewpoints feed other lives (L1) |
| RF2 | The lead's lodging got five different ids across shards | A shared id registry handed to every reader, plus a merge script; needed before any read-ahead |
| RF3 | Dream content, deadlines with no stated date, and storms or weather had no home | Evidence kind `dream:<who>`; deadline windows as `{anchor, offsetDays, label: I}` with the assumption in a fill; hazard list gains `weather` |
| RF4 | Readers wrote `deps` as places | `deps` are beat ids only; place needs go in `touched` |
| RF5 | Recall still varies by reader (16 to 87 census rows per chapter) | PL-L12's deterministic recall check before grading |

---

## 14. Round 6: actions, gameplay loops, lived days and proposed rules (2026-10-27)

Weibao: "consider actions and more too? Adding in Gameplay loops? Stuff like training
skills, researching this, or something else and more? More to consider? Set up rules
accordingly for the future?" Built: schema 1.2 lint support; a private loop file for
chapters 1-15. Proposed: WA25-WA31.

### 14.1 Action layer

Readers wrote 88 distinct free-form verbs in fifteen chapters ("pocket", "rotate",
"season", "call-out") [S scene files]. Schema 1.2 adds, on every step and option:
`class` (study, practice, research, craft, trade, work, travel, fight, socialize, rest,
care, appraise, ritual, other), `inputs`, `time` (`minutes` or `band`), `outputs`,
`gains` (skill, knowledge, standing, money), `requires`, and `label`. The lint enforces the
class and label on 1.2 rows and checks loop records (`--loops`); the focused test passes 5
of 5. The class is the engine verb (WA5); the free verb stays as the world's noun.

### 14.2 Loops the book shows (chapters 1-15)

Eight loop records, private, lint clean (`loop/1.2`). By type, without scene detail:

| Loop | Classes | Rhythm | Rewards | YAIRPG owner |
| --- | --- | --- | --- | --- |
| Household meals | trade, care | schedule, daily | family fed, purse spent | `home_household.js` partial; food and price data missing |
| Money keeping | trade | schedule | solvency | **gap**: shared household purse (MS4) |
| Job seeking | study, socialize | deadline | standing, a job offer | job ladder (`faction_rank.js`, DWF110) partial |
| Divination practice | appraise, ritual | opportunity | knowledge, skill | **gap**: no divination verb |
| Recurring gathering through the lead's cheat space | ritual, socialize, trade | schedule, weekly | knowledge, contacts | `book_world_lotm_ritual.js` partial; mechanism gap |
| Reading and notes | research, study | opportunity | knowledge | `lore_practice_*` partial |
| Family routine | care, travel | schedule, weekly | ties, fare savings | `home_household.js`, `family_tree.js` partial |
| Night safety | rest, appraise | opportunity | safety | **gap**: threat and hiding verbs |

**Gaps Weibao named:** *training skills* does not appear in chapters 1-15 [S scene files]; it
should be expected later in the volume, and `life_experience.js` and `teacher_window.js` are
the seams to grow. *Researching a thing* appears as reading and notes; it needs a research
loop with a question, sources, time and a confidence result (the `lore_practice_*` family is
closest). **Other:** divination, the gathering's trade of information for favors, and
household budgeting each need a loop the engine does not have.

**Progression from loops (proposed WA27):** knowledge comes from reading, divination and
gatherings; standing and the job offer come from the job-seeking loop and its interview
deadline, with the offer itself granted by a beat the text shows; skill comes from practice
loops; any advancement (the book's sequence ladder) maps to the loop or beat the text
shows producing it, never to a calendar date.

### 14.3 The lived-day filler

Between scenes the bot (and a player-as-lead) runs loops by rhythm: schedules first
(meals, family routine, the weekly gathering), then deadlines (the interview), then
opportunities when idle (reading, divination). Each loop step costs time and money from the
pack; the day's purse must reproduce the book's stated anchors (LP4). Where a loop is a gap,
the bot logs "loop not built" and the day continues; the count of such days is a measure of
how far the world is from playable.

### 14.4 Rules for the future

WA25-WA31 are written into [WORLD_ABSORPTION_RULES](../../../WORLD_ABSORPTION_RULES.md)
marked "proposed 2026-10-27, awaiting Weibao's yes", with the RULES_INDEX register and
router rows updated; `check:rules` passes. **The yes that accepts them:** "yes to
WA25-WA31" (or a named subset).

### 14.5 Lane brief template (what every world lane brief must name)

1. World, line and boundary (chapters or volume), with the source snapshot hash.
2. Rule codes applied, including WA22-WA24 and, once accepted, WA25-WA31.
3. Shard plan: size, count, reader model, call cap, token budget, the lint command.
4. Schema version and the shared id registry file.
5. Audit gate: grade rule and locator sample size.
6. Output folder (private for named canon) and the public summary rule (IDs and counts).
7. What counts as a scene, an option, a loop and a fill, by link to LEAD_RUN_SCHEMA.
8. Stop conditions: budget, a failed audit, a sealed truth, a missing source.
9. Report: the AU ledger line, rows by type, lint result, the RF-style findings.

### 14.6 More to consider (rounds 5 and 6)

**ACT NOW (done):** six measured reads; the cost model; shard and precision defaults; the
read-ahead design; the play-flow table; the untaken-option ledger method; RF1-RF5; schema
1.2 lint and test; eight loop records; WA25-WA31 drafted as proposals; lane brief template.

**ACCOUNT FOR NOW**

- PL-A15. **Readers must run the lint before returning** (s2 shows why); make it the last
  line of every brief.
- PL-A16. **Id reconciliation before scale** (RF2): without it, 61 shards produce dozens of
  ids for one room.
- PL-A17. **The brief and schema in one file** so a reader's first call reads both; this is
  the cheapest token cut.
- PL-A18. **Loop gaps decide build order.** The household purse, divination and research loops
  carry most of chapters 1-15; build them before mechanism verbs.
- PL-A19. **Public plan detail.** Rounds 5 and 6 name loop types and counts, not scene
  content; keep it that way (PL-A5).

**LATER or DELEGATE**

| # | Item | Level | Effort | Done check |
| --- | --- | --- | --- | --- |
| PL-L16 | Shared id registry and merge script for shards (RF2) | Sonnet, small | One session | Chapters 1-15 merge to one id per entity; the lodging has one id |
| PL-L17 | Combined brief-plus-schema file and a three-call reader protocol; re-measure on one shard | Haiku run, coordinator | Small | Tool calls at most 4; tokens per char at or below 14 |
| PL-L18 | Convert chapters 1-15 to schema 1.2 (action classes) by script plus one reader for gaps | Sonnet small, haiku | Small | Lint passes with `lead-run/1.2` on all six shards |
| PL-L19 | Household purse and meal loop as pack data on existing household seams | Sonnet, medium, after PL-E0 | One session | One lived day where the purse matches a stated anchor |
| PL-L20 | Divination and research loops as engine cards (WA5 verbs) | Opus design, sonnet build | Medium | A loop record runs in the headless harness with time and cost |
| PL-L21 | Grade and header rows for the six shards (WA31) | Haiku, small | Small | Each shard has a header row with grade A, B or C |

---

## 15. Round 7: battles, stats, allies, gaps found, and codifying the book (2026-10-27)

Weibao (relayed): "Filling in battles and more? How to abstract things into stats and more?
Ally system? Other gaps discovered and need to be covered on the way? Codifying the book
into the game in a way that reasonably makes sense? More to consider?" Docs only. Owners
reused: combat rules CBR1-CBR30 ([DOMAIN_RULES](../../../DOMAIN_RULES.md#combat-rules),
accepted), ability rules ABR1-ABR22 (proposed), the conceptual-abilities channel model and
reference resolver (CAE), the companions audit, `src/obligations_ledger.js`,
`src/check_resolver.js`. Proposed rules WA32-WA35 below.

### 15.1 Battles and conflicts in the lead run

Chapters 1-15 hold four conflict kinds [S scene files, by type only]: a night threat with
flight and hiding, a questioning by police, a ritual contest of will at a residence, and a
storm fight seen from another viewpoint (RF1: not a lead scene).

**Method (proposed WA32): record the conflict, not the choreography.**

| Field on a conflict scene | Meaning | Engine owner |
| --- | --- | --- |
| `sides` | Who is involved, by census id, with their means (tools, powers, numbers) | Combat opponents and party seams |
| `stakes` | What each side wants: escape, information, capture, survival, a confession | CBR30: conflict is wider than combat |
| `means` | Verb classes used (fight, appraise, socialize, ritual, travel for flight) | WA25 classes |
| `terrain` | Place, light, exits, hiding spots, bystanders | Site rules; footprint (PX43) |
| `outcome` | The stated result as an assertion on facts (CBR2 typed outcome: withdrew, captured, yielded, survived, ...) | One outcome publisher (CBR2) |
| `unseen` | What the text skips (how long, who else was hurt) as fills with `basis` | `fill/1.1` |

Same outcome, different routes: the assertion is on the outcome fact, so the bot may reach
"the lead escapes unhurt" by running, hiding or bluffing if the world allows it; the replay
policy uses the book's route, the model policy may use another. A fated survival is an
in-world agent (CBR8), never a hidden invulnerability. What is avoided or lost in the book
stays avoidable or losable in play; a loss in canon is an outcome to reproduce, not a
script to force on a player.

**Filling the unseen parts:** duration, injuries and witnesses come from the engine's own
resolution under the world's numbers; where the book states them, they are calibration
targets (15.2). **Gaps:** a ritual contest of will has no engine verb (mechanism lane);
police questioning needs the CBR30 debate and trial model on the conflict publisher, which
is not wired for book worlds [I].

### 15.2 Abstracting prose into stats

**Method (proposed WA33): ladder, band, calibrate.**

1. **Pick the scale the world already uses** (WAC23: local units, no universal power scale).
   For LOTM: sequence rank for Beyonders, ordinary skill tiers for ordinary people, money in
   pence.
2. **Turn each prose claim into a band, not a point:** "an experienced officer" becomes a
   skill band such as practiced to expert, with its evidence label (S stated, I inferred)
   and the speaker if it is a claim (WA23).
3. **Calibrate against stated outcomes.** For each outcome the book states (who won, who
   escaped, how long a task took, what it cost), run the engine's resolution
   (`src/check_resolver.js`, combat math) inside the bands. If the stated outcome is not
   reproduced in most seeded runs, **the stats are wrong, not the book**: narrow or move the
   bands and record why.
4. **Keep it qualitative** where no mechanic reads a number: personality, beauty, fame
   outside a reputation system, mood. These stay text and tags.
5. **Unknown stays unknown** (WA8): an opponent's hidden ability is a learned field
   (CBR14), not a guessed number.

| Prose kind | Engine form | Calibration target |
| --- | --- | --- |
| Strength, danger | Combat profile band, threat tier | Stated fight outcomes |
| Skill | Skill tier band with practice history | Stated task results and durations |
| Rank | Discrete rank (sequence, office) | Stated permissions and who defers to whom |
| Wealth | Purse and assets in local money | Stated prices, wages and purchases (LP4 anchors) |
| Influence | Standing per organization, favour ledger rows | Who helps or obeys, as stated |
| Knowledge | Knowledge facts with source and confidence | What a character knows at a date (LP5) |

Same facts, different worlds: a "strong" fighter is a different band in a mundane city, a
cultivation sect or a superhero city; the world card sets the ladder. Cheats and powers go
through the channel model (CAE): what it reads, what it writes, who observes, so a power's
stat is its effect on the channel, not a flat bonus. Names in any stat text go through the
resolver (CAE-E1/E4).

### 15.3 Allies, contacts, organizations and enemies

**Method (proposed WA34): allies are lives with ledgers, and party membership is a state.**

| Part | Model | Existing seam |
| --- | --- | --- |
| Who they are | NPC life with needs, schedule, knowledge list and motives | NPC absence clocks; per-actor facts |
| Closeness and trust | Recognition ladder (PX39) plus trust per direction | Companions audit; relationships owner |
| Favours and debts | One row per favour or obligation, with what was given and what is owed | `src/obligations_ledger.js` (pure, not wired) |
| Shared goals | Goal records both lives hold; help offers come from overlap | Role slots (PX47) |
| Betrayal and leaving | Conditions from motives and pressure, never a timer | RLB need profiles |
| Organizations | Rank, duties, pay, standing, rules (WA4) | `src/faction_rank.js`, job ladder (DWF110) |
| Party member or world NPC | A party is a temporary state for a shared goal (an investigation, a journey); outside it they live their own lives | `src/companion_roster.js`, party seams |

The player who is not the lead meets the same people through the same ledgers: the lead's
allies have their own trust toward the player, starting from what they know of the player
(nothing, by default). **Sequencing:** AD33 deprioritizes NPC-heavy work. The proposal
therefore builds only the allies the lived week needs (the household and the first
organization's members), as lives with ledgers, and leaves a general ally system for
Weibao to schedule.

### 15.4 Gaps found on the way (no existing owner covers them)

| Code | Gap | Source of the finding | Owner proposal | Effort | Blocks the pilot |
| --- | --- | --- | --- | --- | --- |
| GF1 | Cross-shard id registry and merge | RF2 | PL-L16, reading tooling | Small | **Yes**, before read-ahead |
| GF2 | Shared household purse and budget loop | MS4, loop gap | P3 on household seams | Medium | **Yes**, for the lived week |
| GF3 | Lead as an NPC life with routine | MS1 | PL-E3 or a new PL-E4 | Medium | **Yes**, for the null-player run |
| GF4 | Dated knowledge per actor | MS2 | PL-E4 | Small to medium | Yes, for LP5 |
| GF5 | Divination verb and loop | Loop gap | Engine card (WA5), PL-L20 | Medium | No; marked blocked |
| GF6 | Research loop with question, sources and confidence | Loop gap | Grow `lore_practice_*`, PL-L20 | Medium | No |
| GF7 | Threat, hiding and flight verbs outside full combat | Loop gap, 15.1 | Combat seams with CBR25 exit rules | Medium | Partly: the opening nights |
| GF8 | Ritual contest of will; the lead's cheat space | 15.1, A1 | Mechanism lane (PL-L3) | High | No; beats marked blocked |
| GF9 | Conflict publisher for questioning and debate in book worlds | 15.1 | CBR30 owner | Medium | No |
| GF10 | Zone-capped fares, coin rounding, metered utilities | MS3, DA1, DA4 | P3 data, engine card if needed | Small | Yes, for anchors |
| GF11 | Census recall check | F10, RF5 | PL-L12 | Small | No; affects quality grades |
| GF12 | Viewpoint field and off-lead scenes | RF1 | Schema 1.2 (done in doc), lint later | Small | No |
| GF13 | Stat calibration harness (seeded runs against stated outcomes) | 15.2 | New test helper on `check_resolver.js` | Medium | No for the lived week; yes before any fight beat |
| GF14 | Favour and obligation ledger wired to saves | 15.3 | `obligations_ledger.js` owner; additive migration | Medium | No |

### 15.5 Codifying the book reasonably

**Principles (proposed WA35): faithful, approximate or open, per fact.**

- **Faithful:** stated outcomes, stated prices, stated dates and stated rules. The engine
  must reproduce them in the canon run (assertions).
- **Approximate:** mechanisms behind them (how strong, how long, how likely). Modelled with
  bands and dials, calibrated to the faithful facts.
- **Open:** what the book does not settle. Kept as a question (WA8), filled only by labelled
  proposals (WA3, WA24).
- **Claims and unreliable narration:** a character's statement is a claim with a speaker
  (WA23); the narrator's own statement is `narration`; contradictions keep both readings
  (WPR20).
- **Sealed truths** stay by opaque ID with route and status (WA11).

Worked examples by kind (generic, no plot detail):

| Kind | Faithful | Approximate | Open |
| --- | --- | --- | --- |
| A fixed event (an interview on a stated day) | The day and the result | How long it took; who else waited | What was asked beyond the text |
| A character's power | What the text shows it doing and its stated limits | Its numbers in the world's ladder, calibrated | Undescribed uses: allowed if the mechanism reasonably works (AD38) |
| A cheat-like mechanism (the lead's private space) | Its stated rules of entry, exit and who can be brought | Time costs and failure chances | Anything the book only hints; sealed by ID if the truth is a twist |
| A prophecy or divination | That it was given and what it said, as a claim | How reliable divination is in this world, as a dial | Whether it comes true in a divergent run |
| An organization | Its stated structure, pay, duties and rules | Its staff numbers and schedules | Its internal politics beyond the text |
| An item | Its stated function and price | Its condition, weight, wear | Its origin when unstated |

### 15.6 Proposed rules

WA32-WA35 are added to [WORLD_ABSORPTION_RULES](../../../WORLD_ABSORPTION_RULES.md) beside
WA25-WA31, marked "proposed 2026-10-27, awaiting Weibao's yes". **The yes that accepts
them:** "yes to WA32-WA35" (or together, "yes to WA25-WA35").

### 15.7 More to consider (round 7)

**ACT NOW (done):** conflict fields and routes; the prose-to-stat method with calibration;
the ally model with AD33 sequencing; GF1-GF14; the faithful, approximate and open
principle with worked examples; WA32-WA35 drafted.

**ACCOUNT FOR NOW**

- PL-A20. **Calibration is where the book's numbers meet the engine's.** A failed
  calibration is a finding about our model; record it, never edit the canon assertion.
- PL-A21. **Allies wait on AD33.** Build only the lived week's people until Weibao
  reorders.
- PL-A22. **Conflict fields join schema 1.3**, not 1.2, so the six shards stay valid.
- PL-A23. **Five gaps block the pilot** (GF1, GF2, GF3, GF4, GF10); they come before any
  mechanism work.

**LATER or DELEGATE**

| # | Item | Level | Effort | Done check |
| --- | --- | --- | --- | --- |
| PL-L22 | Schema 1.3 conflict fields (sides, stakes, means, terrain, outcome, unseen) with lint | Sonnet, small | One session | The four conflict scenes in chapters 1-15 convert and lint |
| PL-L23 | Calibration harness (GF13): seeded runs against a stated outcome | Sonnet, medium | One session | A planted mis-banded opponent fails calibration; a fixed band passes |
| PL-L24 | Lived-week allies as lives with favour rows (household, first organization) | Sonnet, medium, after PL-E4 | One session | The bot's week shows two favour rows and one help offer from a shared goal |

---

## 16. Round 8: environment, events, NPC interactions and filling the blanks (2026-10-27)

Weibao (relayed): "What about environment and events? They will get to those situations
eventually but should be considered, more to consider? Interactions with NPCs, filling in
the blanks for merchants, some stuff from book, some stuff extrapolated and more? more to
consider?" Docs only. Evidence: the six private reads (counts and generic types only here),
`src/weather_calendar.js`, `src/world_calendar*.js`, `src/book_world_lotm_districts.js`,
`src/event_feed.js`, `src/life_events.js`, `src/npc_lives.js`, the time-travel report
(C1-C12) and the canon-protagonist report (PX43-PX46). Proposed rules WA36-WA39.

### 16.1 Environment as facts the lead run touches

| Aspect | Book-stated in chapters 1-15 [S scene and census files, by type] | Extrapolated | Feeds | Existing code |
| --- | --- | --- | --- | --- |
| Weather and season | Storm (other viewpoint), night and dawn light, a red moon | Daily weather by season and place | Exposure, travel time, crowding, footprint hazard `weather` | `src/weather_calendar.js` is one shared 13-day rain cycle for all worlds [S file header]; `src/world_calendar_content.js` has per-world calendar profiles and no LOTM entry [S grep] |
| Light and dark | Gas lamps, candles, moonlight, the hour of dawn | Street lighting by district | Risk at night, reading and work hours | None specific [I] |
| Crowding, noise, smell | Market and street scenes, the shared washroom | Per district and hour | Ambient lines, pickpocket and witness chances | None [I] |
| District character | Who polices which quarter, the docks, the university area | Ordinary trades per district | Who answers an incident, errand pay, rumor speed | `src/book_world_lotm_districts.js` (teams, churches, endorsement, errands) [S header] |
| Buildings and interiors | The lodging, a bakery, a market, a fortune tent, a residence | Layout beyond what is shown | Where steps happen, hiding spots, exits | Place records; site rules |
| Transport and routes | Omnibus fare by distance with zone caps; walking times | Routes and stops | Travel time and cost (LP3) | Travel seams; fares are a gap (GF10) |

**Source order** (WA38 below): stated, then implied by a stated fact, then period-consistent
extrapolation, then free invention; each with its label. **Feed rule:** environment changes
play only through a stated mechanism (exposure, time, hours, risk, visibility), never as a
flat modifier.

### 16.2 Events: four kinds, all keyed

| Kind | Example type | Seed and key | Clock model | How it appears |
| --- | --- | --- | --- | --- |
| Scheduled | Services on the rest day, school days, a weekly gathering at a stated hour, newspaper days | Calendar records; no draw | Schedule, scoped to the life facts that hold it | Clock strip, notices, routine |
| Reactive | Police visit after a death the lead reports | Caused by an action record; the cause id is the key | Deadline from the cause, when the text states one | Return note and diary |
| Ambient | Street incidents, vendor calls, rumors | Keyed draw `H(worldSeed, domain, placeId, dayIndex, subject, drawIndex)` (C1, C2, C7) | Opportunity | Ambient lines, rumor with travel delay (DWF70) |
| Canon beat | The lead's great scenes | Beat record with footprint (PX43) | Schedule or deadline per the beat | Exposure ladder for other lives (PX44-PX46); witness-level text (PX49) |

Keying means the canon run and every replay see the same ambient day. Ambient and reactive
events obey forward anchors (WA24): a street incident may not remove someone the book still
needs. A player in another seat sees scheduled and ambient events where they are, reactive
events only through a channel that reaches them, and canon beats by exposure.

### 16.3 NPC interactions

Readers found service and social contact with landladies, bakers, vendors, police, a
fortune teller, family and recruiters [S census kinds, generic]. Model:

| Part | Rule |
| --- | --- |
| What a talk changes | One or more typed results: information (a knowledge fact), price (a quote or a discount), trust (a ledger row, WA34), access (a door, a list, an appointment). Never prose alone |
| Book-shown versus extrapolated | Book-shown talks are faithful (WA35) on their results; their wording is ours. Extrapolated talks (asking the baker about rye prices on another day) use the same result types and the speaker's stated manner |
| The lead's manner | The lead's observed manner (cautious, polite, money-conscious in these chapters [I]) is a voice and policy tag that the model policy and extrapolated lines respect |
| Unnamed people | Role records (baker, clerk, conductor) with stable ids from place plus role (16.4) |
| Existing owners | [Dialogue and interactions](../../../worlds/DIALOGUE_AND_INTERACTIONS.md) (D1-D6), storylets, voice sheets (DWF74), barks (DWF76) |

### 16.4 Filling the blanks, merchants first

**Layers and labels:** `stated` (S), `implied` (I, from a stated fact), `period` (I, consistent
with the world's era and genre), `invented` (proposal). Each fill row carries its layer,
its basis, the forward anchors it respects, and `replaceableBy: "later reading"`; when a later
shard states otherwise, the stated row replaces the fill and the fill keeps its id with
`supersededBy` (WAC25).

**Unnamed merchants:** id `<world>.person.<place>.<role>.<n>`, generated by a keyed draw on
place and role, so the same baker exists on every replay and in every seat. Stock comes from
the shop-type grammar keyed by day (C2, PL-L15); prices from bands calibrated to stated
anchors.

**Worked example (chapters 1-15, private census, amounts only):**

| Fact | Amount | Layer |
| --- | --- | --- |
| Coins and notes | 12 pence a shilling, 20 shillings a pound; coin and note denominations | stated |
| Bakery | 8 lb rye order at 9 pence now, 11 before, 15 before a tax repeal | stated |
| Market | A fish at 5 pence called by a vendor; 1 lb mutton at 7 pence | stated |
| A shopping trip | Two shilling notes plus one penny, 25 pence in all, with 3 pence change at the bakery | stated |
| Omnibus | 1 penny per km, capped at 4 pence in the city and 6 outside | stated |
| School fees | 1, 3 and 9 pence a week by school type | stated |
| Wages | Factory about 1 pound a week; a sibling's 1.5; a trainee lecturer 2, then 3.5; the clerk post below | stated |
| Rent | A detached house 19 shillings, up to 38; the lead's own rent not yet seen | stated; own rent open |
| Market stock beyond fish and mutton, bakery hours, other bread | | period or invented fills |

**Calibration and arithmetic (proposed WA38):** stated amounts must reconcile. The trip
checks: 24 pence in notes plus 1 penny is 25; the bakery takes 9 from a 12-penny note and
gives 3 back; the market takes the remaining 16, of which 7 is mutton, leaving 9 for unstated
items [I arithmetic]. The same check caught a reader error: the chapter-15 reader recorded the
clerk's base wage as 2 pounds, while the text says 2 pounds 10 soli [S zh 第15章 p57, opened
by the coordinator], which is what makes the stated weekly total reconcile; the existing LOTM
code already cites it correctly (`src/book_world_lotm_lives.js:6`). Readers also wrote the
same unit three ways (shilling, sol, gold-pound): a shared unit list joins the id registry
(GF1).

### 16.5 Gaps

| Code | Gap | Owner proposal | Effort | Blocks the pilot |
| --- | --- | --- | --- | --- |
| GF15 | LOTM calendar profile and per-world weather (only a shared 13-day rain cycle exists) | `world_calendar_content.js`, `world_climate.js` owners | Small to medium | Yes, for dated days and exposure |
| GF16 | Ambient event table keyed by place and day | Time-travel C7 lane | Medium | No; the lived week can run without ambient events |
| GF17 | Typed talk results (information, price, trust, access) for book worlds | Dialogue owner D1-D6 | Medium | Partly: price talk at shops |
| GF18 | Unnamed-merchant id scheme and keyed generation | P3 with C2 | Small | Yes, for shops the lead uses |
| GF19 | Amount arithmetic lint (sums, change, conversions) and a shared unit list | Lead-run lint (PL-L7 family) | Small | Yes, for anchors |
| GF20 | Lighting, crowding and noise as place-hour facts | Site owner | Small | No |

### 16.6 Proposed rules

WA36-WA39 added to [WORLD_ABSORPTION_RULES](../../../WORLD_ABSORPTION_RULES.md), marked
"proposed 2026-10-27, awaiting Weibao's yes". **The yes that accepts them:** "yes to
WA36-WA39", or "yes to WA25-WA39" for every proposed group.

### 16.7 More to consider (round 8)

**ACT NOW (done):** environment table with sources and code; the four event kinds with keys;
the talk model; fill layers with replaceability; the merchant id scheme; the worked price
example; one reader error found and verified; GF15-GF20; WA36-WA39 drafted.

**ACCOUNT FOR NOW**

- PL-A24. **Arithmetic is the cheapest truth check.** Every stated amount joins a sum check;
  run it in the reader's lint, not after.
- PL-A25. **The shared weather cycle is not a world's weather.** LOTM needs its own season and
  weather profile before footprints with `weather` hazards mean anything.
- PL-A26. **Ambient events wait for keyed draws** (C1, C2, C7); until then the lived week runs
  without them and says so.
- PL-A27. **Extrapolated merchants must be replaceable.** Never let a fill's id be reused for a
  different person when a later chapter names the real baker; supersede instead.

**LATER or DELEGATE**

| # | Item | Level | Effort | Done check |
| --- | --- | --- | --- | --- |
| PL-L25 | Amount arithmetic lint and unit list (GF19) | Sonnet, small | One session | The chapter-15 wage row fails; a corrected row passes |
| PL-L26 | LOTM calendar and weather profile (GF15) | Sonnet, medium | One session | A Tingen day shows its own weather; other worlds unchanged |
| PL-L27 | Typed talk results for shop talk (GF17) | Sonnet, medium, after P3 | One session | Asking a baker changes a quote or a knowledge fact, logged |
| PL-L28 | Unnamed-merchant generation keyed by place and role (GF18) | Sonnet, small, after PL-E1 | Small | The same baker id on two replays and in two seats |

---

## 17. Round 9: two-layer inventory and states, what else to pull from the book, and the lead playthrough UI (2026-10-27)

Weibao (relayed): "The generated inventory can be seeded too, with the canon inventory
also being there? Other aspects like these to consider? What else can we pull from the
book? How to consider UI flow and more for the UI main character playthrough?" Docs only.
Owners reused: inventory (`src/inventory_composition.js`, `inventory_tabs.js`,
`inventory_filters.js`), change badges (`src/change_badges.js`, GU8), personal journal
(`src/personal_journal*.js`), workspace layout and navigation (`src/workspace_*.js`),
storylets, chronicle, the reference resolver (CAE-E1/E4), the seeded-day contract (C1-C12),
[UI rules](../../../UI_RULES.md) and `.claude/rules/player-ui.md`. Proposed rules WA40-WA41.

### 17.1 Inventory in two layers, plus the player's changes

| Layer | What | Source | Form |
| --- | --- | --- | --- |
| **Canon** | What the lead carries, wears, owns and keeps at home on each dated scene, with amounts | Census rows and scene anchors (LP4) | Dated assertions; forward anchors for everything else (WA24) |
| **Seeded filler** | Loose coins within the stated purse, receipts, groceries, clutter, wear | Keyed draw `H(worldSeed, 'inventory', holderId, dayIndex, slot, n)` (C1, C2, C7) | Stable ids per holder, day and slot; the same day shows the same things |
| **Player deltas** | What the player or the bot changed | Saved receipts | Applied over both layers, never rewriting either |

Rules: filler never adds up to more than a stated amount (a purse of 5 pence holds 5 pence
of coins, split by the keyed draw); filler never contains an item the book introduces later
(forward anchor); at each canon date the checker compares the effective inventory with the
canon layer and reports `carried`, `changed by player` or `drift` (a bug). In the UI each row
carries a small source badge: **book**, **filled** or **yours**, using the change-badge
component's styling rather than a new one; badge text resolves names through the resolver so
a later rename or reveal does not break saved rows.

### 17.2 Other states with the same shape

| State | Canon-stated (examples by type) | Canon-implied | Extrapolated | Seeded |
| --- | --- | --- | --- | --- |
| Body: health, fatigue, hunger, injury, appearance | A wound and its healing; waking at night | Tiredness after a sleepless night | Meal timing | Small daily variation within bounds |
| Clothing | A formal suit kept for interviews | One everyday outfit | Wear and laundry days | Which shirt today |
| Documents and papers | Notes the lead reads; identity papers in the existing pack | A diploma from his studies | Receipts | Paper clutter |
| Correspondence and news | Newspapers mentioned; letters [I] | A news cycle by weekday | Headlines in period style | Which stories run, keyed by day |
| Home contents | The stash, a revolver, cooking stock shortages | Furniture of a cheap flat | Kitchen items | Exact counts within bands |
| Contacts and addresses | Named people and where they live, when stated | Neighbours | Shop regulars | Unnamed people by place and role (GF18) |
| Knowledge at date | What he learns, from whom (LP5) | Common knowledge of his class and city | Rumors heard in passing | Which rumor reaches him first |
| Memory versus mind | The arriving mind's own memories and the body's | Gaps in the body's memories | Neither | None: never seeded |
| Reputation and legal standing | Witness status, police attention | Neighbourhood standing | How fast word spreads | Rumor travel timing |
| Habits | Walking to save fares (family); cautious money use | Daily routine | Small routines | Order of chores |
| Language and manner | Reads unfamiliar scripts in the opening [S scene files, generic] | Polite, careful speech | Barks in his manner | Line variant choice |
| Vehicles and pets | None in chapters 1-15 | | | |

Each state lives with its existing owner (body with the body owners, clothing with
equipment, documents and letters with items, knowledge with per-actor facts). The two-layer
rule is one shape, not a new store (AR: one authority per fact).

### 17.3 What else to pull from the book

| Catalogue item | Example type | Best home in the engine | Cheap per shard? | Add to schema? |
| --- | --- | --- | --- | --- |
| Voice and diction samples | Three short anchor lines per principal, our paraphrase | Voice sheets (DWF74) | Yes | Census `voice` note on person rows, 1.3 |
| Slang and idiom | Forms of address, oaths | Voice sheets, barks | Yes | Census kind `language` already fits |
| Units and money | Coins, conversions, measures | Unit list (GF19) | Yes | Done (`amount`) |
| Laws and customs | Rest day, school fees, police practice | Law records (WA4) | Yes | Done (kind `law`) |
| Institutions' procedures | How a witness is questioned; how a clerk is hired | Organization records, conflict publisher | Medium | Census `procedure` steps on organizations, 1.3 |
| Religion and ritual forms | Services, prayers, ritual steps | Ritual records (`book_world_lotm_ritual.js`) | Medium | Kind `law` or `event`; no new field |
| Fashion and food | The suit, rye bread, mutton stew | Items, fills | Yes | Existing kinds |
| Technology level | Gas lamps, revolvers, ironclads, omnibuses | World card | Yes, once | Census `tech` tag, 1.3 |
| Maps and routes | Walking times, districts | Places and routes | Yes | `whereabouts` plus a `route` kind later |
| Newspapers, ads, notices | Mentioned papers and notices | Notice surfaces, rumors | Yes | Kind `document` |
| Rumors | What people say | Rumor lines with travel delay (DWF70) | Yes | Census `claimant` already |
| Background and one-line characters | A vendor's call, a passing child | Crowd and role templates (DWF67) | Yes | Existing rows at M1 |
| Humor and emotional beats | A wry aside, a moment of grief | Return-note and storylet voice | Medium | Scene `tone` tag, 1.3 |
| Foreshadowing | Hints of later events | Sealed by opaque ID (WA11) | Medium | Scene `sealed` already |
| Unanswered questions and hooks | Things the lead wonders about | Open questions (WA8), hooks for storylets | Yes | Scene `open` list, 1.3 |
| Narrator reliability | The lead's misjudgements | Claims (WA23), `thought:<who>` | Yes | Done |
| Chapter-end hooks | The cliff at each chapter end | Pacing for return notes | Yes | Scene `hook: true`, 1.3 |
| Recurring motifs | Images that recur | Ambient line palette | Medium | Census kind `note`; no field |

Rule of thumb: add a field only if a consumer reads it within one milestone (proposed WA41).
The 1.3 candidates above are small: `voice`, `procedure`, `tech`, `tone`, `open`, `hook`.

### 17.4 UI flow for the lead playthrough (desktop first)

Targets: 1920x1080 primary and 1536x864, mobile deferred (standing UI priority). Playing
**as** the lead still needs Q5 (WER11 wording); the same screens serve the bot run now.
Every element reuses an existing surface.

| Element | Surface (existing) | Rules |
| --- | --- | --- |
| Scene card: where, when, goal, options (taken in canon marked only when the overlay is on; untaken playable or marked "not built yet") | Storylet deck in the center view | UR41 scope, UR42 disclosure, UR70-UR75 descriptions |
| Lived day between scenes | Normal location, shop, household and work panels | UR21 direct paths, UR25 scroll budget |
| Diary and return note | Chronicle and personal journal; return note on coming back | UR44 log as a stream, UR48 event versus subject |
| Purse and inventory with book / filled / yours badges | Inventory tabs and filters; change badges | UR47 shared hovers, GU8 badge rules |
| Clocks and appointments | Clock strip and calendar; appointments list | UR61 meters say what they answer, UR63 dependencies with the task |
| What the lead knows | A journal tab listing knowledge facts with source and date | UR43 pinned inspection |
| "What the book did" overlay | Opt-in setting, off by default, spoiler-safe: shows only the current and past canon scenes | Sealed truths by ID only |
| Time controls | Existing speed and step controls | No new control |
| Canon versus divergence indicator | One status chip: on the book line, shifted, or diverged (PC2) | UR26 summary first |
| Save and branch points | Existing save; a branch label at each divergence (PC5) | Persistence gates M8 |

**Paper wireframe (1920x1080, first screen; times, amounts and option wording are placeholders, not canon):**

```text
+--------------------------------------------------------------------------------------+
| You / time strip: [Night · first bell unknown]  Purse 5 d [book]   Book line: ON (chip) |
+-------------------------+------------------------------------------+-----------------+
| Place: lodging room     | SCENE CARD                               | Log (stream)    |
|  look text (our words)  |  Where: room, night  Goal: find out what | 23:10 woke ...  |
|  exits: washroom (hall) |  happened                                | 23:12 lit lamp  |
|                         |  Options:                                |                 |
| Inventory [book/filled] |   ( ) inspect the room                   |                 |
|  coins 5 d [book]       |   ( ) light the lamp (costs a coin)      |                 |
|  notebook [book]        |   ( ) go to the washroom                 |                 |
|  clutter x3 [filled]    |  [What the book did: off]                |                 |
+-------------------------+------------------------------------------+-----------------+
| Back bar (Esc)                                     Journal · Knows · Diary · Calendar |
+--------------------------------------------------------------------------------------+
```

**Minimal first screen:** the room at night, the scene card with three options, the purse
and inventory with badges, one exit. **Browser-evidence plan:** rebuild; fresh origin;
1920x1080 and 1536x864; screenshots of the first screen, the inventory badges, the scene
card after one option, the return note; save, reload, export and import with the same state
and badges; the overlay off by default and on after the setting; no page scroll (UR25).
Label anything unexercised "implemented-unverified".

### 17.5 Proposed rules

WA40-WA41 added to [WORLD_ABSORPTION_RULES](../../../WORLD_ABSORPTION_RULES.md) as proposed.
**The yes that accepts them:** "yes to WA40-WA41", or "yes to WA25-WA41" for every proposed
group. The UI items above belong to UI_RULES owners and are not proposed as WA rules.

### 17.6 More to consider (round 9)

**ACT NOW (done):** the two-layer inventory with player deltas and badges; the state table;
the extraction catalogue with homes and schema candidates; the playthrough UI table,
wireframe, minimal screen and evidence plan; WA40-WA41 drafted.

**ACCOUNT FOR NOW**

- PL-A28. **Filler must sum to stated amounts.** The arithmetic lint (PL-L25) applies to
  generated coins too.
- PL-A29. **Badges add visual load.** Keep them small and filterable, and default the
  inventory filter to "all" so the badge is information, not a gate.
- PL-A30. **The overlay is a spoiler surface.** Off by default; never shows future scenes;
  sealed truths by ID.
- PL-A31. **Memory versus mind is never seeded.** What each identity knows comes only from
  the text and play.

**LATER or DELEGATE**

| # | Item | Level | Effort | Done check |
| --- | --- | --- | --- | --- |
| PL-L29 | Keyed inventory filler for one holder (the lead) | Sonnet, medium, after PL-E1 | One session | Two replays show the same filler; filler never exceeds the stated purse |
| PL-L30 | Source badge on inventory rows (book, filled, yours) | Sonnet, medium, UI lane | One session | Browser evidence at both viewports; badges survive save, reload, import |
| PL-L31 | Schema 1.3 small fields (`voice`, `procedure`, `tech`, `tone`, `open`, `hook`) with lint | Sonnet, small | Small | Chapters 1-15 convert; lint passes |
| PL-L32 | First playthrough screen per the wireframe, bot-driven | Sonnet high, UI lane, after PL-B1 | One session | The bot clicks through scene 1 to 2 at 1920x1080 and 1536x864 with evidence |

---

## 18. Round 10: merchant inventory, a top-down relationship system, and other worlds (2026-10-27)

Weibao (relayed): "Inventory also for merchant inventory? More to consider? Going about
implementing relationship system and more, using the book as basis, considering choices
people make, and then coding up relationship and stuff and more that leads up to that roll
and action, so kind of top down design? More to consider? Long term stuff to consider for
other worlds as well?" Docs only. Owners reused: `src/components/trader_component.js`,
`src/data/traders.js`, `src/data/inventory_templates.js`, `src/market_saturation.js`,
`src/seeded_streams.js`, `src/relationship_view.js`, `src/npc_lives.js`,
[relationships and canon](../../../RELATIONSHIPS_AND_CANON_CONSIDERATIONS_2026-10-18.md)
(RLA, RLB), WA34, WA39, WA40. Proposed rules WA42-WA44.

### 18.1 Merchant inventory in the same three layers

Native traders already draw stock by a keyed random on trader name, template, refresh epoch
and slot (`gameKeyedRandom(STREAMS.market, [name, template, epoch, i, j, decision])`
[S `src/components/trader_component.js:124`]) with a refresh period in days [S lines 34-51].
So the time-travel C2 contract exists for native shops; book-world shops (the LOTM broker in
`book_world_lotm_broker.js`) re-derive their own quotes (DWF113).

| Layer | For a book shop | Change needed |
| --- | --- | --- |
| Canon stock | What the book shows or implies a shop sells, with a dated window and price (the bakery's rye order and its price history; market fish and mutton) | Canon rows as anchors the generator must include in their window |
| Seeded stock | Template by shop type, keyed on world seed, shop id, day, slot; restock period; scarcity by season and supply region | Book-world shops adopt the trader keyed draw (or the C2 hook) instead of their own; add `worldSeed` and shop id to the key for book worlds |
| Player deltas | What was bought or sold, by receipt | Existing trade receipts; restock does not resurrect sold canon items before their window says so |

**Price memory and haggling:** a quote is a typed talk result (WA39); the merchant remembers
the last price agreed with this buyer (a ledger row, WA34), and haggling is a check whose
inputs are the relationship state below. `market_saturation.js` already lowers prices for
items sold repeatedly; book shops keep that as a dial. **Calibration:** stated prices are
fixed points; generated prices band around them, and the lead's purse anchors (LP4, WA38)
must reconcile after every canon purchase.

### 18.2 Relationships, designed top down from the book's choices

**Method (proposed WA42).** Start from a choice a person makes in the book; ask what state
makes that choice the natural one; store that state; let a resolver turn state into the choice
with a visible "why". The stored state explains the action, so no meter drives it.

1. **Choice** (from the scene's `choices`, with its locator).
2. **Reasons**: the motives, needs, information, obligations and circumstances the text gives
   or implies for it (scene `motives`, `knowledge`, anchors, the household budget).
3. **State** that holds those reasons (the data model below).
4. **Resolver**: utility per option from state, plus a seeded roll for close calls, with the
   top reasons shown as the "why".
5. **Calibration**: at the book's date, does the state reproduce the book's choice? If not,
   the state is wrong, not the book (as WA33 does for stats).

**Data model (fields by tier; reuses the NPC life model):**

| Field | Principal | Recurring | Role | Crowd |
| --- | --- | --- | --- | --- |
| Traits and manner (voice sheet) | yes | short | template | none |
| Needs and motives (RLB1) | yes | top two | role need | none |
| Loyalties and group memberships (organizations, family) | yes | yes | role's organization | district |
| Information held (per-actor facts, dated) | yes | key facts | role facts | rumors only |
| Secrets | by opaque ID (WA11) | by ID | none | none |
| Directed trust and fear toward each person (RLA1-RLA2) | yes | toward the lead and the player | toward the player on contact | none |
| Debts, favours, obligations (`obligations_ledger.js`, WA34) | yes | yes | open accounts only | none |
| History of interactions (typed memories, RLA3) | yes | last few | last one | none |
| Mood in the moment | yes | yes | yes | none |

Tiers keep it from over-modelling: a crowd person is a role and a rumor; a principal carries
everything. Promotion between tiers follows play (WA22 rungs).

**Worked example (chapter 9, no sealed content).** Choice: the lead is hungry and has meat
for a stew, and he waits for his sister to come home rather than cooking half of it now
[S lead-run scene 302, choice locator zh 第9章 p29; motives `hunger` p33 and `thrift` p23].

| Option | Utility from state | Inputs |
| --- | --- | --- |
| Cook half now | + hunger relief | Hunger high; meat on hand |
| Wait for his sister | + thrift (one meal from one cut), + family duty (eat together), + her portion | Household purse low (anchors); she is due home after school (family routine loop); duty toward family (loyalty) |

With the stated purse and the family-routine schedule, "wait" wins unless hunger passes a
threshold. Calibration passes when the stored hunger, purse and family loyalty reproduce
"wait" on that date in most seeded runs. A player in his place can still cook now: the
resolver explains what it costs (a thinner stew later, a small family-ledger row), and the
world records the choice.

The same method applies to others: his sister walking to school to save the omnibus fare
(thrift plus a 1-penny-per-km fare capped at 4 pence [S census]) is a choice her state must
reproduce, and it tells us she holds the household budget as her own motive.

**How player choices change state:** as the lead, through the lead's actions (helping,
breaking a promise, sharing food); as a bystander, through the same talk results and ledger
rows toward the people met. The reference resolver keeps names in remembered history stable.

**Gap:** `relationship_view.js` reads directed simulation edges [S header] but holds no
utility resolver; a decision resolver on `check_resolver.js` (seeded, with reasons) is new.
This is NPC-heavy work under AD33: build it for the lead's household first.

### 18.3 Long term: other worlds

**World-agnostic engine:** presence rungs and dated whereabouts (WA22-WA24); scene, census,
fill and loop schemas and their lint; action classes; the three-layer held state (WA40) for
inventories and shop stock; keyed events; the decision resolver with reasons; calibration
tests for stats, prices and choices; the bot and its two drivers; the source-layer labels.

**World-specific:** nouns, units, laws, calendars and weather, loops' owners, mechanisms
(cheats, powers), tone and voice, which states are layered, tier assignments.

| World | What differs for this pipeline |
| --- | --- |
| Harry Potter | School calendar drives schedules; a canon school-year calendar beside the 70-day term (A3); a large cast in one building; public franchise twists are not sealed |
| Mother of Learning | The repeating month is the seeded-day test; each loop is a branch with its own choices; the lead's state carries across loops, the world's resets |
| Proto23 | A reference game, not a book: loops come from decompiled systems and play, not prose; port permission with credit is recorded (USER_VISION) |
| YAIR base game | Original content; no canon layer, so fills are the canon; the bot replays the native journeys |
| Village | Original, public; the harness for engine lanes (PL-H1); every fact is authored |

**Per-world checklist (reuse for every pilot):**

1. Source boundary, edition and hash; budget from the cost model (13.2).
2. Id registry and unit list seeded before reading (GF1, GF19).
3. Shards at about three chapters with lint in the reader's loop (WA30).
4. Scenes, census, fills, loops, conflicts; untaken options; choices with motives.
5. Calibration targets: stated amounts, outcomes, choices.
6. Two-layer states the world needs (inventory, shops, body, knowledge).
7. Mechanism gaps named and marked blocked.
8. Lived-week target and its bot run.

**Measure now for the next world:** tokens per chapter and per row (13.1); lint failure
rate per reader; recall per chapter against a candidate list (PL-L12); share of untaken
options with buildable needs; share of `date-unsettled` rows; reader errors per 100 rows
found by arithmetic and locator checks (two so far: the money "conflict" and the wage);
coordinator minutes per shard review.

**What the pilot hands the next world:** the schemas and lint; the reader brief in one file;
the id-registry and merge script; the cost and quality numbers; the loop library (which
loops recur across worlds: meals, money, work, study, family); the decision-resolver
calibration harness; the bot's two drivers; the gap list with which gaps proved world-
agnostic.

### 18.4 Proposed rules

WA42-WA44 added to [WORLD_ABSORPTION_RULES](../../../WORLD_ABSORPTION_RULES.md), proposed.
Shop stock needs no new rule: it is a held state under WA40. **The yes that accepts them:**
"yes to WA42-WA44".

**Status update (2026-10-27):** Weibao adopted this session's proposals as adjustable
working direction ([record](../../../USER_VISION.md#adopt-this-sessions-proposals-as-adjustable-working-direction-2026-10-27),
[register 5b](../../WRITEUP_REGISTER.md#5b-adoption-2026-10-27)). Per that entry, WA25-WA41
are now recorded as accepted (adjustable) in the rulebook and rules index; earlier "awaiting
yes" lines in rounds 5-9 are history. WA42-WA44 stay proposed because the entry names
WA25-WA41; the plan's open values (Q0 launch, Q2/Q8 budget, Q3 placement, Q4 start month,
HP offset) stay open as the entry says.

### 18.5 More to consider (round 10)

**ACT NOW (done):** shop stock in three layers on the existing keyed trader draw; price memory
and haggling as relationship inputs; the top-down relationship method with tiers; a worked
example with calibration; the world-agnostic split; per-world checklist; metrics to measure;
the hand-off list; WA42-WA44 drafted.

**ACCOUNT FOR NOW**

- PL-A32. **Readers wrote choice labels as prose** in one shard (s4); the lint should check
  `choices[].label` like `date.label` (schema friction).
- PL-A33. **Calibration of choices needs enough motives.** Scenes with no motive tags cannot
  be calibrated; readers must tag motives on every choice.
- PL-A34. **Book shops and native traders should share one keyed draw.** Two stock systems
  drift; the broker should adopt the trader draw (DWF113).
- PL-A35. **AD33 still applies.** The relationship resolver starts with the household and the
  first organization only.

**LATER or DELEGATE**

| # | Item | Level | Effort | Done check |
| --- | --- | --- | --- | --- |
| PL-L33 | Decision resolver with reasons on `check_resolver.js` | Opus design, sonnet build | Medium | The chapter-9 choice reproduces in most seeded runs and shows its top two reasons |
| PL-L34 | Book-world shop stock on the trader keyed draw with canon anchors | Sonnet, medium, after PL-E1 | One session | The bakery's stated price appears on its stated day; generated stock repeats on replay |
| PL-L35 | Choice-label and motive lint (PL-A32, PL-A33) | Sonnet, small | Small | s4's prose labels fail; a motive-less choice warns |
| PL-L36 | Per-world checklist as a lane-brief appendix | Docs, small | Small | The HP pilot brief can be filled from it without new questions |

---

## 19. Round 11: other systems to build top down (2026-10-27)

Weibao: "Other systems to build from top down? More to consider?" (recorded in the
[adoption entry](../../../USER_VISION.md#adopt-this-sessions-proposals-as-adjustable-working-direction-2026-10-27)).
Under that entry this round is adjustable working direction, not frozen. Method as in 18.2:
start from what the book shows a person doing, work back to the stored state, motives,
information and circumstances that make it natural, then forward to the check or roll.

**Evidence base (chapters 1-15, private files, counts only):** 50 recorded choices, 81
knowledge events, 16 purse anchors, 34 price rows, 8 loops; motive tags are free-form and
sparse (about 20 distinct tags, most used once), so a shared motive vocabulary comes first
(PL-L37).

### 19.1 Build now (ranked by value to the lead run and build order)

| Rank | System | Book evidence | Stored state | Decision or roll it feeds | Owner to reuse | Measure in the pilot | Agnostic / specific |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | **Money and livelihood** | Money-keeping and meals loops; 34 price rows; 16 purse anchors; the walk-versus-fare and wait-to-cook choices | Purse, household budget, wages, debts, prices seen | Buy or skip, walk or ride, cook now or wait, take a job | `trade.js`, `market_saturation.js`, `home_household.js`, `obligations_ledger.js` | Anchor pass rate per lived day | Agnostic ledger; world units and prices |
| 2 | **Household and family schedules** (includes school and work timetables) | Family-routine loop; school fees; a sibling's work week | Members, schedules, duties, shared purse | Who cooks, who pays, who is home when | `home_household.js`, `family_tree.js`, `village_family.js`, `world_rhythm.js` | Days where the household routine runs without a gap | Agnostic schedules; world calendars |
| 3 | **Knowledge and information flow** (how the lead finds out: reading, notes, talk, news, rumor, divination results) | 81 knowledge events; reading-and-notes loop | Dated per-actor facts with source and confidence | Act on it or not; whom to ask; what to hide | Per-actor facts (`world_knowledge.js`, `people_knowledge.js`), event feed | LP5 violations (acting on unknown facts) per run | Agnostic; channels are world-specific |
| 4 | **Law, investigation and consequences** | Police questioning and witness status (chapters 9-11 scenes) | Legal standing, what officials know, evidence held, procedures | Answer, deny, confess, hide evidence; officials' next step | CBR29-CBR30, conflict publisher (GF9), organization records | Calibration of the lead's answers in questioning | Agnostic procedure shape; world laws |
| 5 | **Danger and risk-taking** | Night threat, hiding a weapon, flight (chapters 12-14 scenes); fear and self-protection motives | Known threats, fear, exits, hiding spots, allies nearby | Hide, flee, confront, call for help | Combat exit rules (CBR25), footprints and idle safety (PX46), GF7 | Calibration of hide versus flee choices | Agnostic risk model; world threats |

### 19.2 Parked, with triggers

| System | Trigger to start |
| --- | --- |
| Health, fatigue, hunger and injury | The lived-week bot shows fatigue or hunger changing a choice (the chapter-9 example already hints at hunger) |
| Sleep, dreams and divination-like mechanisms | A mechanism lane is approved (GF5, GF8) |
| Organizations and ranks | The lead run reaches a joined organization (after the chapter-15 offer) |
| Reputation and rumor | Keyed ambient events land (C7, GF16) |
| Travel and logistics beyond walking and fares | A route the lead takes needs more than walking or the omnibus |
| Shopping and crafting | Shopping is covered by money and shop stock; crafting starts at the first brewing or making beat |
| Ritual and ability use | The mechanism lane (as divination) |
| News and information flow as its own system | Newspaper rows grow past the knowledge system's channels |

### 19.3 One calibration test pattern for all of them

For each recorded choice: take the stored state at the book's date, the options, and N seeded
runs of the resolver. **Pass** when the book's option wins in at least k of N (default 8 of
10) and the shown reasons include the motive the text gives. **Sanity flip:** change the one
input the text says mattered (more money, no threat, the sister already home) and the choice
should change as the text implies. **Fail** means the state or the weights are wrong; record
the fix with the choice's locator; never change the book's choice. The same harness serves
stats (WA33), prices (WA38) and relationships (WA42). Proposed WA45 generalizes it.

### 19.4 More to consider (round 11)

**ACT NOW (done):** five systems ranked with evidence, state, decisions, owners, measures and
the agnostic split; eight parked with triggers; one shared calibration pattern; WA45 drafted.

**ACCOUNT FOR NOW**

- PL-A36. **A motive vocabulary before any calibration.** Free-form tags used once cannot be
  weighted; readers pick from a short list and add a new tag only with a reason.
- PL-A37. **Rank 1 and 2 share one ledger.** Money and household schedules are one build for
  the lived week, not two lanes.
- PL-A38. **Law and danger lean on mechanisms the engine half has** (the conflict publisher,
  hiding verbs); keep their first slice to the choices, not full systems.

**LATER or DELEGATE**

| # | Item | Level | Effort | Done check |
| --- | --- | --- | --- | --- |
| PL-L37 | Motive vocabulary (about 20 tags) and a lint check | Sonnet, small | Small | Chapters 1-15 motives map to the list with no orphan tags |
| PL-L38 | Shared calibration harness (19.3) on the decision resolver (PL-L33) | Sonnet, medium | One session | The chapter-9 choice passes 8 of 10; its sanity flip changes the choice |
| PL-L39 | Lived week on systems 1 and 2 together | Sonnet, medium, after PL-E0 and PL-L19 | One session | Seven days pass with routine costs, household schedules and every purse anchor matching |

---

## 20. Round 12: standards for things built many times (2026-10-27)

Weibao (relayed): "Consider standards for things that will be implemented multiple times,
like merchants, alchemists, other stuff and more?" Working direction under the 2026-10-27
adoption (adjustable). Owners reused: `src/components/trader_component.js`,
`src/data/inventory_templates.js`, `src/craft_recipes.js` (recipe grammar with role slots
and explained misses [S header]), `src/dose_process.js` and `src/lotm_formula_rows.js`
(43 LOTM formula rows on a shared process envelope, 23 brewable [S header]),
`src/hp_brewing_*`, `src/craft_dose_rules.js`, `src/faction_rank.js`, `src/npc_lives.js`.
The UI contract defers to the ui-coverage plan's primitives when it lands. Proposed rules
WA46-WA47.

### 20.1 What recurs (evidence)

Chapters 1-15 census, 720 rows [S private files]: 92 person rows, 94 places, 67
organizations, 172 items, 34 prices. A keyword pass over person labels and notes [I, rough,
duplicates across shards not merged] finds family 15, officials and clerks 9, fortune and
divination 4, household staff 3, guards and enforcers 3, crafts 3, merchants and vendors 3,
teachers and scholars 2, landlady 1, courier 1; potion or formula items 4. Places: homes and
lodgings 20, schools 7, inns and taverns 5, offices, stations and churches 4, shops 3. Across
worlds the same roles recur in the Village (traders, craftsman, elder), HP (shops, teachers,
brewing), Frontier careers and Proto23 shops.

### 20.2 Archetype standard (one definition, many instances)

An archetype is implemented once as engine behavior and instantiated as pack data (WA5,
WA1). Fields:

| Field | Content | Existing seam |
| --- | --- | --- |
| `services` | Verb classes offered (trade, craft, care, study, appraise...) with the world's nouns | WA25 classes |
| `stock` / `recipes` | Stock template and restock period; recipe list by the recipe standard (20.5) | Trader keyed draw; `craft_recipes.js`, `dose_process.js` |
| `schedule` | Hours, days, rest day, seasonal closures | `world_rhythm.js`, calendars |
| `relationshipHooks` | Trust and fear axes toward buyers, favour and debt rows, price memory | WA34, WA39, `obligations_ledger.js` |
| `decisionProfile` | Motives and weights for the top-down resolver (refuse, discount, extend credit, report to police) | WA42, WA45 |
| `talkSlots` | Greeting, quote, haggle, refuse, rumor, farewell; typed results | WA39, voice sheets |
| `priceQuality` | Price band rule, quality tiers, haggling limits, saturation dial | `market_saturation.js` |
| `failure` | Refusals and failure behaviors: out of stock, closed, distrust, illegal request, failed brew | CBR30, the resolver's reasons |
| `variation` | What a keyed draw varies per instance (name, manner, stock mix, hours offset) with stable ids | C1-C2, GF18 |
| `canon` | Overrides and dated anchors for named canon instances | WA24, WA40 |
| `fill` | Replaceable-fill markers for unstated fields | WA38 |
| `ui` | Declared surface contract (panel, scene card, inspect) | UI rules; ui-coverage primitives |
| `tests` | Conformance hooks (20.4) | New harness |

### 20.3 Instances

| Instance kind | Source | Rung and fidelity | Cost |
| --- | --- | --- | --- |
| Named canon person (the baker the lead buys from) | Archetype plus overrides from census rows; anchors on stated prices and dates | M2 to M3 as the lead touches them | Authored overrides only |
| Unnamed seeded person (another baker in another district) | Archetype plus a keyed draw on place and role | M1 to M2, generated on first visit | Near zero until visited |
| Promoted seeded person | Becomes named when play or a later reading names them; keeps the id, gains overrides, or is superseded by the canon person (WA38) | As touched | Small |

### 20.4 Conformance test (every archetype and every instance)

1. Loads and lints (schema, ids, kinds, WA5 verbs).
2. Schedule resolves for a seeded week with no gaps or overlaps that block the lead's loop.
3. Stock and prices calibrate: stated prices appear in their windows; generated prices fall in
   band; a stated purse reconciles after a scripted purchase.
4. Relationship hooks fire: one favour row, one price-memory row, one refusal with a reason.
5. Decision profile passes the shared calibration pattern (19.3) on any book choice it has.
6. UI contract is declared and renders at 1920x1080 and 1536x864 (browser evidence for the
   first instance of each archetype; data rows after that follow AD36 item 7).
7. Save, reload, export and import round trip keeps stock, ledgers and overrides.
8. No sealed text in any public field (WA11 lint).

### 20.5 Recipe standard for brewers, alchemists and crafters

One shape for book potions and invented ones, on the existing grammar and process envelope:
`inputs` (role slots: exact item, tag query or property threshold, from `craft_recipes.js`),
`process` (steps, heat or bench, time in minutes, from `dose_process.js`), `skill` (the
check and its band, WA33), `failure` (by mechanism: wrong auxiliary, interrupted step, poor
material), `quality` (tiers from inputs and the check), `effects` (by the world's law),
`secrecy` (formula known or not per actor; a sealed formula by opaque ID), `source` (canon
row with locator, or proposal). LOTM's 43 formula rows and HP's brewing already sit near this
shape; the standard names it so a new world adds rows, not code.

### 20.6 Per-world dials, extension and versioning

| World | What "merchant" means |
| --- | --- |
| Tingen (LOTM) | Weekly-wage economy in pence; bakeries, markets, brokers for Beyonder materials with church oversight |
| Village | Original traders with weekly refresh (`traders.js`); simple stock |
| HP school | Term-time shops in a market street; student pocket money |
| Proto23 | Ported shop systems per the recorded permission |
| YAIR base | Native traders and templates as they are |

Packs extend an archetype by adding fields and overriding values, never by copying it
(WA18's overlay rule). Archetypes carry `id@revision`; a revision that changes saved fields
needs an additive migration; instance data records the archetype revision it used (WA10).

**Lane brief checklist for any archetype or instance:** archetype id and revision; instances
and their sources (canon rows or seeded); overrides and anchors; the conformance steps run;
the UI contract; save compatibility.

### 20.7 Worked examples (chapters 1-15, no sealed content)

**Merchant: the bakery the lead buys from** (archetype `baker`). Canon overrides from the
census: the owner is named; the shop sells rye by an 8 lb order with a dated price history (9
pence now, 11 before, 15 before a tax repeal); it gives change; it also sells cakes the lead
does not buy. Seeded: hours, other breads, regulars, the owner's manner beyond what is shown.
Decision profile: sells, gives change, and could extend credit to a known regular (a fill,
replaceable). Conformance step 3 passes when the 9-penny order and 3 pence change reproduce.

**Alchemist-like role: a potion formula source** (archetypes `broker` plus `brewer`). The
chapters show formulas traded for favours or money between people at a gathering [S scene
types, generic]; the runtime already holds formula rows (`lotm_formula_rows.js`). The
instance offers `appraise` and `trade` services, a recipe list by the recipe standard, a
decision profile that weighs what is offered against risk, and secrecy per formula (a formula
known to one actor and not another). Ingredients and brewing go through the shared process
envelope.

### 20.8 Build order for the pilot (at most three)

1. **Shopkeeper** (baker, market vendor): the lived week buys food daily.
2. **Household member** (family archetype): the household schedule and purse (19.1 rank 2).
3. **Official or clerk**: questioning and the job offer path (19.1 rank 4).

Brewers and brokers follow when the mechanism lane opens.

### 20.9 Proposed rules

WA46-WA47 added to [WORLD_ABSORPTION_RULES](../../../WORLD_ABSORPTION_RULES.md), proposed.
**The yes:** "yes to WA46-WA47" (or "yes to WA42-WA47" for every proposed group).

### 20.10 More to consider (round 12)

**ACT NOW (done):** recurrence counts; the archetype fields; instance kinds; the conformance
test; the recipe standard on existing code; per-world dials, extension and versioning; two
worked examples; build order; WA46-WA47 drafted.

**ACCOUNT FOR NOW**

- PL-A39. **Role counts need the id merge** (GF1) before they are exact; the keyword pass
  double-counts people across shards.
- PL-A40. **UI contracts wait for the ui-coverage plan.** Archetypes declare the surface
  now and adopt its primitives when it lands.
- PL-A41. **The first instance of each archetype pays the full browser matrix**; later
  instances are data rows (AD36 item 7).

**LATER or DELEGATE**

| # | Item | Level | Effort | Done check |
| --- | --- | --- | --- | --- |
| PL-L40 | Archetype schema and conformance harness (20.2, 20.4) | Opus design, sonnet build | Medium | The baker archetype and its canon instance pass all eight steps |
| PL-L41 | Recipe standard adapter over `craft_recipes.js` and `dose_process.js` | Sonnet, medium | One session | One LOTM formula row and one HP brew load through the same adapter |
| PL-L42 | Household-member and official archetypes | Sonnet, medium, after PL-L40 | One session | Both pass conformance with one canon instance each |
