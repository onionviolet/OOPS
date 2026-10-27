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
| Q9 | Make the presence ladder, dated whereabouts and forward anchors standing rules (WA22-WA24) | Yes, as WA rules, since every book world needs them | Nothing in P1; P3 promotions follow them either way as plan defaults |
