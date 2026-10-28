# Cast lives: turning the reading index into living actors (plan, 2026-10-28)

Status: plan and Codex lane briefs. Proposals under the 2026-10-27 adoption entry
([USER_VISION](../../../USER_VISION.md#adopt-this-sessions-proposals-as-adjustable-working-direction-2026-10-27)):
adjustable working direction, not frozen spec. No `src/` change, no paid call, no source text in this file.

Weibao's request: "look into turning the shards into gameplay, following the goal of first creating
everything the protagonist interacted with to go through their own stories". Clarified the same day:
"I meant look into the best ways to go about this accordingly? We would have codex work on these".
So this doc is the method plus lane briefs Codex can run; implementation is the lanes' work.

Codes applied: WA5, WA8, WA12, WA18, WA22-WA24 (accepted), WA28, WA34, WA35, WA37, WA38, WA43
(WA25-WA41 adopted as adjustable direction; WA43 proposed), WER (start answers), AR1-AR16, AD36,
AD41, AD42, AD43 (FLR1-FLR6), PRF1-PRF8 as brief prompts, AU5. Owners this extends (PRF5):
[PLAN](PLAN.md) sections 1, 11.3 (LP1-LP12), 15.3, 16.3; [reading gap map](../../../research/READING_GAP_MAP_2026-10-28.md)
GM1-GM3, GM15, GM20 and PG2, PG5, PG7, PG8; [engine lanes checkpoint](ENGINE_LANES_CHECKPOINT.md).

## 1. What exists (findings, checked 2026-10-28)

| Code | Finding | Evidence |
| --- | --- | --- |
| F1 | The index has the raw material for lives. People rows carry `routine` slots (days, place, what), `relations` (with, kind, attitude, basis), `knows`, `reacts`, `wants`, `reveals`; scenes carry `present`, `touched`, `deps`, `outcomes`, `motives`; census carries dated `whereabouts` (WA23). | Merged MoL rows; LOTM shard files |
| F2 | **LOTM volume 1's merge has no people or rules rows.** `merged/merge_report.json` reports every extra at 0, yet 590 volume-1 people rows (383 with a routine, 1,205 relations) sit in the agent shard files. The merge must be rerun before any cast import. | `extras` all 0; `s2_people.jsonl` to `w3s36_people.jsonl` on disk |
| F3 | **Mother of Learning is now merged** (free, local): 106 shards, 2,278 registry rows, 780 scenes (714 lead), 1,702 people rows, 1,704 rules rows. Output in the book's private `lead-run-2026-10-28/merged/`. | This session, `merge_shards.mjs --match '^molc[0-9]+m$'` |
| F4 | **Registry ids are reader-minted, not stable.** Some MoL ids are labels ("stern woman" for Ilsa, "Kiri", "Mister Kazinski (...)" for Zorian); people rows point to each other by display name in `with`. The runtime uses its own ids (`book.mol.ilsa`, LOTM `L.*` places). An id crosswalk is the first job, before any import. | MoL `registry.jsonl`; `overlay_proposed.json` has 39 LOTM redirects unreviewed |
| F5 | **Dates are thin.** LOTM: 7 of 316 merged scenes reach an absolute date; chapters 1-24 lead scenes are 12 S, 31 I, 15 U. MoL: most lead scenes carry `L?-D?`, and source order is not time order across restarts. WA23's dial (source order as the window) holds for LOTM and inside one MoL loop only. | Merged scenes |
| F6 | **Runtime people are one location each, set at install.** `simulation.people[id].location` comes from pack definitions (`src/simulation_resolution.js:74`, LOTM `src/book_world_lotm_host.js:64`) and only moves by player-party travel. The co-location gate already reads it (`simulation_resolution.js:115-127`): a natural FLR4 consumer. | Code |
| F7 | **Engine pieces exist but are unwired:** `recurringWindow` (`src/world_rhythm.js`), `dayIndex` (`src/world_day_index.js`), the beat resolver with `actor` (`src/beat_records.js`) and its save slice (`src/beat_ledger.js`), `obligations_ledger.js`, `people_knowledge.js` (observer-safe person view). | ENGINE_LANES_CHECKPOINT |
| F8 | **Neither pack has the canon cast living.** LOTM's Tingen branch is "Original Tingen probationer account" with original roles (Warden Hale, unnamed officers); no Klein, Dunn, Melissa or Benson in `src/`. MoL has 8 canon people as fixed visitor-campaign contacts, and `MOL_BASELINE` puts festival night and loop control outside its branch. | `book_world_lotm_content.js:27`, `book_world_mol_ids.js:13` |

## 2. The method (default)

Four stages. The first two are deterministic tools (no model calls); the third is where an implementer
reads the cited paragraphs (READINESS round 8); the fourth is engine work through existing seams.

| Stage | Input | Output | Who |
| --- | --- | --- | --- |
| S1 Merge and crosswalk | Shard files | Merged rows with one id per entity (reviewed overlay), plus `crosswalk.json`: index id to runtime id for people, places, organizations and items | Script, then a judgment review of collisions |
| S2 Cast worksheet | Merged rows plus crosswalk | One private worksheet per entity the lead touched: presence rung and count, first and last locator, dated whereabouts, routine slots, relations, knows, wants, the scenes they appear in (in order), and the forward anchors (their next canon appearance) | Script |
| S3 Cast records | Worksheet plus cited paragraphs (`cite_paragraphs.mjs --id`) | Committed pack data in our own words with locators: per person a schedule, relations, knowledge, and an arc of dated beats; fills labelled as proposals | Implementer lane |
| S4 Engine readers | Cast records | People move by schedule, refuse or redirect when away, advance their arcs on their dates with or without the player | Engine lanes |

### 2.1 Index field to runtime owner

| Index field | Runtime owner (reuse) | Notes |
| --- | --- | --- |
| census `rung`, scene `present` counts | Tier per person (WA43: principal, recurring, role, crowd) | Presence count ranks who gets a full life first |
| census `whereabouts` (dated) | Schedule rows with era windows (WA23) | `claimed` rows never move a body; they feed rumor text |
| people `routine` | Schedule rows read through `recurringWindow` and `dayIndex` | Absent `recurrence` (in flight, PG2) defaults to `once` at the scene's window |
| scene `present` and `place` per beat | Arc beats in `beat_records` with `actor` = the person | The person is at that place in that window; the beat's `outcomes` are its effects |
| next canon appearance | Forward anchor (WA24) | A lint fails any fill that contradicts it |
| people `relations` | Relationship and trust rows (WA34, WA42 shape); `obligations_ledger.js` for favours | The `basis` becomes the shown reason line (GM2) |
| people `knows` | `people_knowledge.js` and the knowledge owner (WA12) | Gates lines by date (GM3) |
| people `wants`, scene `motives` | Need tags on the NPC life (PLAN LP7) | Only where an action reads them |
| scene `options` not taken | Stub actions (WA28) | Later lanes; not in the first slice |
| fill rows (`fill/1.3`) | Fills with `layer` and `replaceableBy` | Fills come from world mechanisms (a clerk works office hours, a student attends class in term), never invented events |
| rules, texture, prices | Existing pack owners | Out of this plan except where a cast routine needs a price or an opening hour |

### 2.2 Import order for "everything the protagonist interacted with"

1. **Presence ladder.** Rank every entity in the lead's scenes by `present` count, then `partial`. Principals
   (present in many scenes) get full records; recurring get schedule plus relations; role people (vendor,
   landlady) get a role record keyed by place plus role (PLAN 16.4); crowd stay M1 rows. Places, items and
   organizations follow the same ladder: a place with lead scenes becomes a runtime location; an item the
   lead holds becomes an item with an owner and a whereabouts; an organization gets members and hours.
2. **Each entity's own timeline.** Order its rows by locator: canon beats where it is present, dated
   whereabouts, routine slots. Between canon points, the schedule is its routine; its next canon point is
   a forward anchor.
3. **Gaps filled by mechanism, labelled.** Where the book is silent, the fill comes from the role's
   ordinary mechanism (work hours, school term, household meals, rent day) as `fill` rows with
   `status: authored-proposal` and a basis. Fills may not move, injure or remove anyone before an anchor
   (WA24). Player-caused divergence may (WA15) and is labelled.

### 2.3 The arc continues without the player

Each principal's beats are `beat_records` rows with `actor` set to that person. The resolver settles them
by date as `carried`, `altered`, `deferred`, `lapsed` or `blocked` (`blocked` when a mechanism the engine
lacks is needed, PLAN LP9). The null-player run (lead and cast as NPCs, no player) must reproduce the
canon outcomes on their dates (PLAN LP10b). That run is the test that the cast lives its own story.

## 3. Pilot and first slice

**Pilot: LOTM volume 1** (PLAN 1.2, adopted 2026-10-27). **Second case for AR11: Mother of Learning**,
bounded to chapter 1 through the end of the first restart, because only inside one loop is source order a
timeline (F5).

### 3.1 First slice: "Tingen, the first lived week" (LOTM chapters 1-24)

PRF1 reading: the people and places the lead touches in chapters 1-24 exist in Tingen as lives with
routines, and their week happens whether the player follows the lead or not. PL-A51 already sets the
lived week on chapters 1-24.

- **Cast (from the merged presence count, chapters 1-24; the rerun merge in L1 refreshes it):** the lead,
  Dunn Smith, Melissa, the lead's brother and the household (partial in the count, principal by role),
  the landlady and Iron Cross Street neighbours as role records, the lead's university contacts, the
  street vendors and fortune tent as role records. The two remote gathering members (Audrey Hall, Alger
  Wilson) stay at M1 with dated whereabouts only; their own lives are PLAN step 6 work (PLAN 1.3).
- **Places:** the lead's flat on Iron Cross Street, the Nighthawk office, Tingen University, the street
  market, the fortune tent, routes between them on existing district travel minutes.
- **Continuity default (D1):** a new start profile "beside the lead" opens a declared continuity
  (`book.lotm.tingen.canon_beside`, WA18) where the canon cast lives; the existing original-probationer
  branch and its saves stay unchanged. Warden Hale and the original officers keep their roles in that
  branch. Reason: additive, so no save migration (AR6), and the original branch's no-canon promise holds.
- **Seat default (D2):** `beside` (PLAN step 5 default). The player has an ordinary Tingen life near the
  household; following the lead uses the same travel and talk verbs.
- **Mechanism beats (D3):** beats that need the lead's cheat space or a Beyonder power the engine lacks are
  `blocked by mechanism` and shown as such in the diary; routine continues (LP9). No sealed IDs are
  involved for LOTM (PLAN 1.1).
- **Player sentence (PRF2), shape only; wording and hours come from L3's cited rows:** "Melissa is at
  school; she is usually home by [hour]." "Dunn Smith is at the office until [band]." When the lead's week moves on without the
  player, the people panel shows what the player could know of it (heard, aftermath, present: PX49).
- **Done check (slice):** in a fresh browser life at 1920×1080, the player meets three cast members at
  different places by time of day; asking one who is away fails with the reason and the return time; over
  seven world days with the player idle, at least three canon beats settle on their dates and appear as
  heard or aftermath lines; save, reload, Export and Import keep cast positions and settled beats. The
  null-player headless run reproduces the same settled beats.

### 3.2 Second case: Mother of Learning, first loop (wave 2)

Cyoria, chapter 1 to the first restart: Zorian's household (Kirielle, his mother), the academy (Ilsa, Xvim,
Kael, Zach, Akoja, classmates), Imaya's place. Default (D4): the slice stops before festival night, inside
the current `MOL_BASELINE`; a canon-loop continuity that runs the restart is a later declaration that
waits on the reset fields (PG4) the reading session is adding. AR11 test: the schedule and arc seams from
wave 1 should take MoL with data rows and no core edit; any core edit is recorded as seam revision.

## 4. Codex lanes (wave 1)

Shape per PLAN 14.5, adapted for runtime lanes. All lanes:

- **Local only.** The index data is gitignored under `docs/research/novels/<book>/private/`. Codex must run
  in this checkout, never in the cloud. Committed files carry ids, counts, locators and our own wording;
  never source text, never the cited paragraphs (round 8).
- **Shared checkout rules** (AD41, shared worktree practice): own files only, hunk edits to shared docs,
  commit own paths from a fresh HEAD, no stash, reset, force or push, no `Co-Authored-By`.
- **Schema 1.4** (committed `d37049ebf`, opt-in per plan, older rows unchanged; READINESS_AND_SCOPE
  round 12). Absent means the text is silent, not "no": an importer never turns a missing field into a
  negative fact. Where each field lands:

  | 1.4 field | Lands in | Absent default |
  | --- | --- | --- |
  | routine `recurrence` (once, daily, weekdays, weekly, monthly, term, seasonal, yearly, irregular), `until` | L2 schedule rows; `irregular` gives a window with no fixed phase | `once` at the row's scene window; no end |
  | relations `since` | L3 relation rows, ordered into attitude changes (CL3) | Locator order |
  | rules `acquire` {teacher, prerequisites, time, practice, progressSign, failure, ceiling} | A teacher's schedule (L2) plus the skill owner; wave 2 and GM8 | Not built for that skill |
  | rules kind `reset` with `reset` {trigger, span, resets, keeps, remembers, ends} | L6 MoL restart continuity (D4 lifts once rows exist) | No restart run |
  | rules `enforcement` {penalty, enforcer, detection} | Role people who enforce (constable, proctor) as cast; GM14 | Enforcer unknown |
  | rules `costStated` | Cost lint: `stated-free` is free, `not-mentioned` is a gap | Gap |
  | texture services `kind`, `amount`, `unit`, `per`, `priceId`, `priceStated` | Opening hours and prices a routine needs (a vendor's stall hours, the lead's rent) | Hours from the role mechanism, labelled fill |

  The batch-reading session does not run `merge_shards.mjs`; L1 owns every merge for this plan.
- **Gates** (AD36, AD43): lanes run their focused test file; the committer runs the full `npm test` once,
  plus `npm run build`, `npm run check:arch`, `npm run check:rules`. A lane without the browser and
  persistence lines reports "implemented, below floor".
- **Models:** `gpt-6-luna` low by default; `gpt-6.1-sol` where the brief says judgment.

| Lane | Goal | Owned files | Seam (AR14) | Model | Focused test | Done check | Needs |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **L1 Merge and crosswalk** | Rerun the LOTM volume-1 merge with people and rules; review `overlay_proposed.json` collisions; write `crosswalk.json` (index id to runtime id) for LOTM chapters 1-24 and MoL chapter 1 to first restart; add a `--crosswalk` check that reports unmapped touched ids | `scripts/lead_run/build_crosswalk.mjs`, `tests/lead_run_crosswalk.test.js`; private outputs only | Lead-run tooling (`merge_shards.mjs` API, no edit to it unless a bug) | Sol, medium (collision review is judgment) | `node --test tests/lead_run_crosswalk.test.js` | LOTM merge report shows people and rules extras above 0; every person, place and organization present in chapters 1-24 lead scenes has a crosswalk row or a named reason | None |
| **L2 Cast worksheet and schedule seam** | Script S2 (per-entity worksheet, private). Pure module that turns schedule rows into a location for a person at a time, using `recurringWindow` and `dayIndex`, with a forward-anchor lint | `scripts/lead_run/cast_worksheet.mjs`, `src/cast_schedule.js`, `tests/cast_schedule.test.js` | Pure leaf module; reads world calendar through `world_day_index.js`; no save field | Luna, low | `node --test tests/cast_schedule.test.js` | Given rows, returns place or "away until" with the next window; a fill that contradicts a later anchor fails the lint | L1 |
| **L3 LOTM cast records** | Author the slice cast as pack data from worksheets and cited paragraphs: people definitions, schedule rows, relations with basis, knows by date, arc beats with dates and windows, fills labelled. New start profile and continuity per D1 | `src/book_world_lotm_cast.js` (data), one import line in `src/book_world_lotm_content.js` | LOTM pack content (WA5: world owns nouns) | Sol, medium (reading and judgment) | `node --test tests/book_world_lotm_cast.test.js` | Every row has a locator and an S/I/U label; fills name a basis; lint from L2 passes; no source text over five characters | L1, L2 |
| **L4 Living week and arcs** | Wire schedules into the single location authority and arcs into the beat resolver. Sync point: the LOTM host's existing per-command and clock sync (as `syncMolClock` does for MoL) writes `simulation.people[id].location` from `cast_schedule`; no second location store (AR3). Commit beats to `beatLedger`. Headless null-player run for seven days | `src/book_world_lotm_cast_host.js`, `tests/lotm_cast_week.test.js`, `scripts/headless/lead_runs/lotm_week1.mjs` | LOTM host sync; `beat_records` plus `beat_ledger` (built, unwired) | Luna, medium | `node --test tests/lotm_cast_week.test.js` | Co-location gate (`simulation_resolution.js:115-127`) refuses a talk when the person is away with a return-time reason; null-player run settles the canon beats on their dates; replay gives the same result | L2, L3 |
| **L5 People view and floor** | Show where known people are, when they return, and heard or aftermath lines from the cast's week, through the observer-safe `people_knowledge.js` view (AR8). Run the AD43 floor in a rebuilt browser at 1920×1080 from a fresh origin, with save, reload, Export and Import | `src/cast_people_view.js` and its hook in `people_knowledge.js`; evidence under this folder | Projection only; UI rules UR1-UR75 | Luna, medium | `node --test tests/cast_people_view.test.js` | Section 3.1 done check, with screenshots and one line per check in a checkpoint | L4 |

Order: L1, then L2 and L3 (L3 can start rows while L2 builds the lint), then L4, then L5. One writer per
file; L3 and L4 share no file. Wave 2 is one lane, **L6 MoL first loop**, on the same seams (AR11).

## 5. Risks and their defaults

| Code | Risk | Default |
| --- | --- | --- |
| R1 | Reader rows import outside knowledge (PL-A46) and pull later-volume facts into early lives | L3 confirms each used row against its cited paragraph; a row that fails is dropped, not repaired from memory |
| R2 | Sparse dates make the week drift | Source order within the slice is the window (WA23 dial); the stated anchors (rent day, office hours, dated beats) pin it; unsettled dates stay `U` and get a window, not a guess |
| R3 | Over-modelling | Tiers (WA43): only principals get arcs in wave 1; role people get a schedule only |
| R4 | Schema 1.4 and later fields break the importer | Optional fields with the defaults in section 4; L2's worksheet keeps unknown fields as pass-through |
| R5 | Canon cast in the original branch | Avoided by D1: new continuity, new start profile |

## 6. Decisions recorded as defaults (each adjustable)

- D1 canon cast lives in a new `canon_beside` continuity, reached by a new LOTM start profile.
- D2 the player seat is `beside`.
- D3 mechanism beats are blocked and shown, routine continues.
- D4 MoL wave 2 stops before festival night.
- D5 wave 1 builds principals' arcs only; recurring people get schedules and relations; role people schedules.

Nothing here needs Weibao before L1 starts. The one item that changes saves (a new start profile and
continuity) is additive.

## 7. More to consider (round 1)

| Code | Consideration | Disposition |
| --- | --- | --- |
| CL1 | The crosswalk is the reusable asset: every later book's cast import starts from it. Keep it per book, versioned with the merge's input hash | ACCOUNT FOR NOW: L1 records the hash |
| CL2 | Presence counts undercount family who are `partial` (talked about, in the next room). Rank by present plus partial for household roles | ACCOUNT FOR NOW: L2 worksheet shows both counts |
| CL3 | Attitude change over time (PG8) is a merge-code fix, cheap, and makes relations into arcs of their own | LATER/DELEGATE: merge-code lane, Luna low, done when relations carry `since` from locator order |
| CL4 | The same seams serve Harry Potter's cohort pack (GM20) and Shadow Slave's unspent people rows | LATER: after L6 proves the seam |
| CL5 | A watch view of the lead's week (PLAN LP12) is a cheap reviewer for Weibao once L4 runs | LATER: after L5 |
