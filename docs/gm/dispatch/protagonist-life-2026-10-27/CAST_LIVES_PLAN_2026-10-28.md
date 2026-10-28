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
| F4 | **Registry ids are reader-minted, not stable.** Some MoL ids are labels ("stern woman" for Ilsa, "Kiri", "Mister Kazinski (...)" for Zorian); some relations point to a display name in `with` (corrected in round 4: 3,786 of 4,020 MoL relations already resolve to an id; the real gap is routine places, 1,070 of 1,693 not an id). The runtime uses its own ids (`book.mol.ilsa`, LOTM `L.*` places). An id crosswalk is the first job, before any import. | MoL `registry.jsonl`; `overlay_proposed.json` has 39 LOTM redirects unreviewed |
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
| **L4 Living week and arcs** | Wire schedules into the single location authority and arcs into the beat resolver. Sync point: the LOTM host's existing per-command and clock sync (as `syncMolClock` does for MoL) writes `simulation.people[id].location` from `cast_schedule`; no second location store (AR3). Commit beats to `beatLedger`. Headless null-player run for seven days, plus the gap probe on one scene per kind (night-threat fight first) writing the gap ledger (section 8, CL15-CL17) | `src/book_world_lotm_cast_host.js`, `tests/lotm_cast_week.test.js`, `scripts/headless/lead_runs/lotm_week1.mjs` | LOTM host sync; `beat_records` plus `beat_ledger` (built, unwired) | Luna, medium | `node --test tests/lotm_cast_week.test.js` | Co-location gate (`simulation_resolution.js:115-127`) refuses a talk when the person is away with a return-time reason; null-player run settles the canon beats on their dates; replay gives the same result | L2, L3 |
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

## 8. Round 2: finding gaps by running scenes, top down then details (2026-10-28)

Weibao: "How to explore the gaps and then work on implementation? like say during a fight or something?
consider top down design but then fillin in the little detials and more? more to consider?"

### 8.1 What the index says about fights today (counted 2026-10-28)

| Code | Finding | Consequence |
| --- | --- | --- |
| F9 | The schema has a `conflict` block (sides, stakes, means, terrain, outcome, unseen; PLAN 15.1), but readers rarely fill it: LOTM 1 of 13 merged scenes with a fight step, MoL 9 of 146 | A fight's top-down contract has to be rebuilt from the scene's steps, outcomes and cited paragraphs |
| F10 | Fight scenes do record outcomes: MoL fight scenes carry 257 `changed`, 87 `carried` and 41 `blocked` outcome rows | The outcome, the part the world must reproduce, is already there |
| F11 | MoL has 919 ability and spell rules rows; 9% list costs, 50% limits, 19% consequences | Numbers are the thinnest layer; schema 1.4 `costStated` tells a free action from a silent one |
| F12 | Combat owners exist: CBR1-CBR30 (accepted), `combat_math.js`, `check_resolver.js`, `combat_log.js`, the typed outcome publisher (CBR2) | A fight lane extends these; it does not build a new combat system |

### 8.2 The method: scene contract, gap probe, layered fill

Explore gaps by **running** a scene, not by reading docs for what is missing. One loop per scene kind:

1. **Contract (top down).** Write the scene as a contract before any detail: who (cast ids and tiers),
   where and when (place, window), stakes per side, means (verb classes), the outcome as an assertion on
   facts, and the player sentence (PRF2). For a fight: "the lead escapes unhurt; the attacker withdraws;
   a witness reports it next morning". This is PLAN 15.1 WA32: record the conflict, not the choreography.
2. **Gap probe.** Run the contract headless (lead bot, game MCP) with whatever the cast records hold.
   Every place the run stops becomes a typed gap row with the scene's locator. The probe is the
   exploration step: it finds exactly what this scene needs, nothing the scene does not touch (WA41).
3. **Classify each gap by layer, cheapest first.**

   | Layer | Example in a fight | Fix | Who |
   | --- | --- | --- | --- |
   | Noun | The attacker, the alley, the lead's revolver do not exist | Pack rows from cited paragraphs | Data lane, Luna |
   | Number | No band for the attacker's danger or the lead's aim | Band, then calibrate against the stated outcome (PLAN 15.2 WA33) | Calibration lane, Sol |
   | Rule | No cost or limit on the attacker's power | Rules row; `costStated` from 1.4 | Data lane after the paragraph read |
   | Verb or mechanism | A ritual contest of will has no engine verb | Engine lane, or `blocked by mechanism` (LP9) | Engine lane, Sol, with a second world in view (AR11) |
   | Aftermath | Who was hurt, who heard, what changes in their week | Cast schedule and knowledge rows (sections 2.1, 2.3) | This plan's lanes |
   | Detail | Light, rain, smell, a bystander's line | Texture rows keyed by place and band | Detail lane, Luna, last |

4. **Fill in that order.** A scene is playable once nouns, the outcome and the aftermath exist with
   placeholder bands. Numbers come next, set by calibration, not by taste. Details come last and only
   where something reads them: a description line, a perception note (PX49), a keyed ambient event
   (WA37). Each layer reruns the same probe, so a detail never breaks the outcome.

### 8.3 A fight inside the cast lives model

| Code | Consideration | Default, dial and reason |
| --- | --- | --- |
| CL6 | **Three ways one fight happens.** (a) Off-screen: the beat settles by its outcome with no combat simulation. (b) The player is present but stays out: the engine runs it with calibrated bands; the outcome must match. (c) The player joins: the engine runs it and the result may diverge, labelled (WA15). | Default: (a) whenever the player is not at the footprint. Reason: simulating every off-screen fight costs time and adds drift; the book's outcome is the authority there (WA35 faithful) |
| CL7 | **(a) and (b) must agree.** The calibration test runs (b) over seeded days and checks it reproduces (a) in most runs. A miss means the bands are wrong, not the book | Dial: the share of seeded runs that must match, per world. Reason: the same rule as PLAN 15.2 |
| CL8 | **A fight is an arc beat for every side.** The attacker, the lead and the witnesses each get the beat in their own timeline; injuries, fear and new knowledge change their schedules and lines afterwards (an injured clerk misses office days) | Default: aftermath rows only where the text states or clearly implies them; the rest is a mechanism fill (wounds heal by the world's rate) |
| CL9 | **Forward anchors hold through fights.** A fight the player joins may not kill someone the book still needs unless the player caused it; generator-side fights never do (WA24) | Dial: a world can allow canon deaths from player action; that is labelled divergence |
| CL10 | **The footprint decides exposure.** Who is near the place and window (schedules from L2) is who can be present, affected or hear of it (PX44). The fight reads the schedules; the schedules do not read the fight | Reason: one direction of dependency keeps replay stable |
| CL11 | **Untaken options in a fight** (flee, hide, bluff, call police) stay possible as stub actions with costs (WA28); the book's route is the replay policy, not the only route | LATER: after the first fight runs end to end |

### 8.4 Little details, without drowning

| Code | Consideration | Disposition |
| --- | --- | --- |
| CL12 | **Details attach to place and time band, then to people.** A texture row becomes a line shown when the player is at that place in that band; people details become voice tags and barks (DWF74, DWF76) | ACCOUNT FOR NOW: L3 keeps texture ids on place rows; no detail rendering in wave 1 |
| CL13 | **A detail earns a row only if a consumer reads it** (WA41): a description, a perception note, a price, an hour, a line. Otherwise it stays in the index, where `cite_paragraphs.mjs --topic` can find it later | ACCOUNT FOR NOW: lane briefs repeat this |
| CL14 | **Details are where reader drift hides** (PL-A46). Spot-check one detail in ten against its paragraph; drop rather than repair | ACCOUNT FOR NOW: L3 and the detail lane |
| CL15 | **The gap ledger is the to-do list.** Every probe writes typed gap rows (scene locator, layer, missing id or verb, blocking or cosmetic). Lanes take gaps by layer, so work stays top down: no detail lane starts while a blocking noun or verb gap remains in that scene | ACCOUNT FOR NOW: L4's headless run emits the ledger as a private file plus counts in its checkpoint |

### 8.5 Exploration order across the slice

| Code | Consideration | Disposition |
| --- | --- | --- |
| CL16 | **One vertical slice per scene kind, not one system at a time.** Chapters 1-24 hold an ordinary day, a purchase, a talk that changes a fact, a police questioning, a night threat with flight and a ritual contest (PLAN 15.1). Probe one of each; together they give the gap ledger for the whole week | ACCOUNT FOR NOW: L4 picks one scene per kind for the probe |
| CL17 | **Fight first-case default:** the night threat with flight, because it needs nouns, a danger band and an aftermath but no missing mechanism; the ritual contest waits as `blocked by mechanism` | ACCOUNT FOR NOW |
| CL18 | **Fill the `conflict` block after the fact** for fight scenes (F9): a post-merge pass over scenes with a fight step reads the cited paragraphs and writes sides, stakes, means, terrain and unseen | LATER/DELEGATE: local Codex lane, Luna medium; done when every fight-step scene in the slice has a conflict block with locators; no API spend |
| CL19 | **A probe inspector.** For any person or scene: which row put them here, its label (S/I/U or fill), and the gap rows blocking it. Inspection only, no mutation, never in saves | LATER/DELEGATE: Luna medium after L4; done when the headless report prints the chain for one person and one scene |
| CL20 | **Calibration lane for the first fight.** Bands for the attacker and the lead from cited paragraphs, seeded runs of CL6(b), agreement rate recorded | LATER/DELEGATE: Sol medium after L4 and CL18; done when (b) matches (a) at the world's dial across 20 seeded runs |

Suggestions (not reasons to stop): add the night-threat fight to L4's probe set now; run CL18 before
the calibration lane so the fight contract is sourced, not guessed.

## 9. Round 3: fate, future powerhouses, trends from each book, and the UI (2026-10-28)

Weibao: "What about the UI creation for UI? Relattionship and other subtle systems based on extrapolated
trends from each books? More to consider? Can things be biased to occcured in certain ways and be harder
to change, by virtue of fate and more? or if a charcter becomes an absolute powerhouse in the future, like
at the level of trancending time and stuff, effective their path to become that will kind of be locked in
place, thoughts? Other considerations like this?"

Existing owners this extends: OD7 and OD8 in [TIMELINES_AND_DIVERGENCE](../../../TIMELINES_AND_DIVERGENCE.md)
(canon follows its natural course; it corrects itself only through a world mechanism such as fate or
history), PX21 and PX40 in the [canon protagonist report](../../../research/CANON_PROTAGONIST_INTERACTIONS_2026-10-27.md)
(a "must happen" beat names its enforcer; protective fate is a named mechanism per world), CBR8 (fated
characters survive through in-world agents), "Luck and fate as gameplay" in
[RIVALS_IDENTITIES_AND_FATE](../../../RIVALS_IDENTITIES_AND_FATE.md) (scoped fortune, anchored fate,
reveal a protection before a decisive commit), PLAN 18.2 (WA42 relationships from choices), PLAN 17.4
(lead playthrough surfaces). Sealed or late-volume facts appear here by kind only.

### 9.1 Yes: outcomes can lean, and some lean hard

Thoughts: a weighted future fits the project's rules if the weight comes from somewhere in the world and
shows up as cost, never as a wall (AD5, AD38). Three sources, which stack:

| Code | Source of weight | How it works | Default, dial and reason |
| --- | --- | --- | --- |
| CL21 | **Causal mass** (no metaphysics) | An anchor many later beats depend on has many people steering toward it: their plans, debts and duties converge. The beat graph's `deps` already measures this. Divert it and others step in by their own motives (role slots, PX47) | Default: every world. Reason: it is just people living their lives; it needs no fate rule and explains why history "wants" to happen |
| CL22 | **A world mechanism** (fate, heavenly will, historical correction, a prophecy, an institution) | Named per world with what detects divergence, what it can touch, its reach and cost, who can perceive it (OD8 treatment) | Default: off until the world pass names it with a locator. Dial: from a nudge on keyed draws to active correction by agents |
| CL23 | **A future actor's protection of their own past** | Section 9.2 | Default: only where the world's time model allows it |

**How weight plays.** Weight raises the cost and effort of a change, adds agents who push back and
shifts keyed draws (C1 determinism keeps it repeatable); it never silently cancels a player's action
(PX40, CBR8). Reveal the observable effect before a decisive commit (RIVALS: "reveal the existence or
observable effect of relevant protection"): the quote says "this will be hard: the household's plans all
hinge on it" or "your divination keeps turning cloudy", never the anchor's content. A player who pays
enough can still move it; then it is labelled divergence (WA15), and CL21's substitutes may still produce
a similar result by other hands.

### 9.2 Future powerhouses and a path that locks

If someone will later act across time, their earlier path can be held in place by their own later
agency. Whether that is true depends on the world's **time model**, which each world pass now states
with its evidence (CL24):

| Time model | What happens when the player interferes with a future powerhouse's past | Player sees |
| --- | --- | --- |
| Self-consistent (one history) | The attempt fails through ordinary in-world means: a delay, a rescue, an accident that happens to help. The powerhouse's later acts are already part of history | Repeated near-misses with causes the player can investigate; costs rise each try |
| Branching | The change makes a branch where the powerhouse does not arise; the main line continues, and the main-line powerhouse may notice and act | A branch label (PC5) and a new risk |
| Mutable with correction | The change lands, then the world's correction (CL22) works to restore it at its cost | A visible correction pressure with a clock |
| Ordinary (no time agency) | Only causal mass (CL21) applies | Ordinary cost |

| Code | Consideration | Disposition |
| --- | --- | --- |
| CL24 | **Each world states its time model** with locators, or it stays `U` and defaults to Ordinary. Reason: locking a path the book never locks is the commonest overreach | ACCOUNT FOR NOW: L3 records LOTM's time model as `U` for chapters 1-24; nothing in wave 1 locks a path |
| CL25 | **Who counts as a future powerhouse is a spoiler.** The lock's existence is shown only through observable effects in the player's present. Late-volume rows stay off until the source pass reads that far (WER4); the lock's reason is held by opaque id where sealed | ACCOUNT FOR NOW: the inspector (CL19) shows `locked by id` only |
| CL26 | **The player can become one too.** A save whose character gains time agency later anchors its own earlier life the same way; WA24 then protects the player's past, and earlier visits may show the player's own later traces | LATER: needs the time-travel owner (C1-C12); one design round, Sol, done when one world's time model and the player's own lock are written as a rule pair |
| CL27 | **Locks need a substitute plan.** If the player does break a locked path in a branching world, the beats that depended on that person need substitutes or lapse (`lapsed`, beat_records) | ACCOUNT FOR NOW: L4's resolver already reports `lapsed`; no substitution logic in wave 1 |
| CL28 | **Stolen destiny.** RIVALS' anchored fate and theft rules apply: a lock can be claimed, transferred or contested; a stolen lock is not duplicated by reload | LATER: after CL22 exists in one world |

### 9.3 Relationships and other subtle systems from each book's trends

The book shows a sample of how its people behave. Extract the rates and use them as the world's default
dials where the book is silent (after the last read chapter, off-screen, for people it never followed).

| Code | Trend from the index | Feeds | Disposition |
| --- | --- | --- | --- |
| CL29 | **Attitude drift:** how often and how fast relations change, by kind (family, colleague, rival), from `relations.since` (schema 1.4) ordered by locator | WA42 relationship resolver: the world's default drift rate | LATER/DELEGATE: Luna medium after L1; done when one book prints per-kind change counts per 100 chapters with locators |
| CL30 | **Who helps strangers, who betrays, who keeps a debt:** rates from scene choices and outcomes | Role-person defaults (vendor, clerk, officer) and the resolver's priors | LATER: same lane |
| CL31 | **Rumor and news speed:** how many scenes pass between an event and others knowing it (`knows.since`) | Heard and aftermath timing for the cast (PX49) | ACCOUNT FOR NOW: L4 uses a fixed authored delay labelled fill until CL29's lane runs |
| CL32 | **Institutional response time:** police, church teams, the academy | Enforcement (schema 1.4 `enforcement`) and fight aftermath (CL8) | LATER |
| CL33 | **Prices, wages and their drift** | Economy owners (GM4) | Owned by GM4, not this plan |
| CL34 | **Trends are labelled `I` and are dials, not laws.** A trend never overrides a stated row or a forward anchor; it fills the silence. Calibrate the same way as stats: does the trend reproduce the book's own later choices it was not computed from (hold out the last fifth of the slice)? | ACCOUNT FOR NOW: rule for every trend lane |
| CL35 | **Trajectories after the book ends:** a person's arc continues at the book's observed pace (an ambitious officer seeks the next rank on the cadence the text showed) | LATER: after L4 and CL29; Sol, done when one recurring person's post-slice week is generated from trends and passes the anchor lint |

### 9.4 UI for the cast lives systems (desktop first, 1920×1080)

Every element reuses an existing surface (PLAN 17.4; UR1-UR75; standing UI priority). Owner surfaces:
`src/people_ui.js`, `src/people_knowledge.js` (observer-safe view), `src/relationship_view.js`, the
chronicle and journal, the clock strip and calendar.

| Code | What the player needs | Surface | Rule |
| --- | --- | --- | --- |
| CL36 | Where a known person is now, or "away, usually back by [band]", and what they were doing when last seen | People panel row | UR70-UR75 description; only what the player saw or was told (AR8) |
| CL37 | Why they act as they do toward you: the top reasons from the resolver ("owes you a favour", "wary since the questioning") | Relationship view hover | WA42 "why"; UR47 shared hovers |
| CL38 | What happened in their lives that you could know: heard, aftermath, present lines | Chronicle stream, filtered by person | UR44 log as a stream; PX49 |
| CL39 | Their appointments you know of | Calendar | UR63 dependencies with the task |
| CL40 | That something is weighted, before you commit | The action quote's cost line ("hard to change: ...") with the observable reason only | AR7 quote then revalidate; RIVALS reveal rule; never the anchor content |
| CL41 | Book line status | The existing on-line, shifted, diverged chip (PLAN 17.4) | Overlay off by default |
| CL42 | For Weibao or an agent: why someone is where they are, and which anchors or locks apply | Inspector (CL19), dev only, not in saves | Inspection only |

| Code | Consideration | Disposition |
| --- | --- | --- |
| CL43 | **UI scope for wave 1:** L5 builds CL36 and CL38 only. CL37 waits on the resolver; CL39-CL41 on L4's beats being visible | ACCOUNT FOR NOW: L5 brief |
| CL44 | **Scale:** a principal-heavy world can list dozens of people. Sort by recency of contact and presence tier; collapse crowd and role people into place rows | ACCOUNT FOR NOW: L5 |
| CL45 | **UI for all subtle systems** follows the open "UI coverage for every system" item in USER_VISION; each system names its surface in its lane brief before code | ACCOUNT FOR NOW: lane briefs |

### 9.5 Other considerations of this kind

| Code | Consideration | Disposition |
| --- | --- | --- |
| CL46 | **Importance is earned, not assigned.** The protagonist's weight comes from CL21-CL23, not a halo flag; when the player becomes central (many beats depend on them), the same rules protect and burden the player | ACCOUNT FOR NOW: no halo field anywhere |
| CL47 | **Divination and prophecy read weight.** In worlds with them (LOTM), divination is the player's route to learning that something is anchored, at the world's cost and reliability | LATER: LOTM divination pass after CL22 |
| CL48 | **Butterfly radius.** Divergence spreads along relations and schedules (OD7); recompute only people within the touched footprint and their direct relations, settle the rest by outcome (CL6a). Keeps the simulation cheap and the replay stable | ACCOUNT FOR NOW: L4 recomputes only footprint people |
| CL49 | **Weight is deterministic.** Weighted draws key on day and anchor id (C1), so reload does not reroll fate | ACCOUNT FOR NOW: L2 and L4 |
| CL50 | **Two fates collide.** Two weighted anchors can contradict after a player change; the higher combined weight wins the draw and the other becomes `altered`, both shown in the inspector | LATER: with CL22 |

Wave 1 change from this round: L2 and L3 reserve two optional fields on anchors, `weight` (default from
CL21's dependency count) and `enforcer` (default none, PX21), and L3 records the time model as `U`. No
lane locks a path or applies fate in wave 1.

## 10. Round 4: extend the reading audits, or derive? Relationships and actions from what people do after interactions (2026-10-28)

Weibao: "do we need to extend the readings audits for the batched readers or would it be considered? more
to consider? Other subtle stuff like relationships and actions that can be built from the top down/based
on their actions after interactions? More to consider?"

### 10.1 Answer: extend the audits, not the readers (with two small exceptions)

Standing direction decides most of it: readers record everything and gaps are considered afterwards
(READINESS round 7, Weibao 2026-10-28), and implementers read the source through the index (round 8,
accepted). So the needs from rounds 2-3 are derived after the merge from rows already paid for, and the
place to extend is the **audit**: today's reading audits check that rows are valid (lint, grades, name
accuracy, locators); none checks that a consumer can use them.

What the merged MoL index already holds (counted 2026-10-28, 1,702 people rows, 780 scenes):

| Field | Filled | Serves |
| --- | --- | --- |
| people `relations` | 1,612 rows, 4,020 items (3,786 `with` resolve to an id) | Relationship state and trends (CL29) |
| people `reacts` {to, response} | 1,027 rows, 2,632 items | Reaction rules (10.2) |
| people `knows`, `wants`, `speech` | 1,000, 789, 707 rows | Knowledge gates, goals, voice |
| people `routine` | 998 rows, 1,693 slots; only 623 slot places are registry ids | Schedules (L2): **the weak join** |
| scenes `choices`, `motives`, `knowledge`, `outcomes`, `deps` | 578, 757, 756, 779, 658 of 780 | Choices, after-interaction actions, causal mass (CL21) |
| scenes `conflict` | 9 of 780 | Fights (F9); the batch schema dropped the block on purpose (`batch_lib.mjs` schema note) |

| Code | Need from rounds 2-3 | Route | Why |
| --- | --- | --- | --- |
| CL51 | Causal mass (CL21) | Derive: count `deps` chains per anchor after the merge | Rows exist |
| CL52 | Trends (CL29-CL32) | Derive: counts over relations, reacts, choices, knows by locator order | Rows exist; `since` is rare in text (SV11), locator order carries timing |
| CL53 | Fight contracts (F9) | Derive with cited paragraphs (CL18), no re-read | The outcome rows exist; the implementer reads the paragraphs anyway (round 8) |
| CL54 | Time model and fate mechanism (CL22, CL24) | Targeted implementer read per world: `cite_paragraphs.mjs --topic` over rules rows of kind law, custom, `reset`, plus the world appendix | A world-level fact, stated a few times per book; not a per-shard field |
| CL55 | **Exception 1: routine places.** 63% of MoL routine slot places are free text | Reader prompt line for 1.4-and-later plans: "routine `place` uses a place id from the known-names table, or mint one"; for read books, L1's crosswalk maps free-text places | This is the join schedules depend on; cheap to ask, costly to repair at scale |
| CL56 | **Exception 2: reacts lack a structured trigger.** `to` is free text ("Kirielle waking and pestering him"), with no action class or actor id | Candidate opt-in field for a later schema pilot: `reacts.class` (WA25 classes) and `reacts.by` (id). Until then, derive by classifying `to` locally | Only if the derived classification fails its test (CL60) |

**Audit extension (consumer fitness), scripted, free:** for each book after the merge, print the share of
rows a consumer can use: relations with a resolvable `with`; routine slots with a place id and a time;
reacts whose trigger maps to an action class; scenes with an outcome and a place id; rules with
`costStated`. A topic below its bar goes to the gap ledger (CL15), not to a re-read, unless a targeted
re-read is cheaper than derivation (SV6, SV8). Owner: L1's crosswalk check grows this report.

| Code | Disposition |
| --- | --- |
| CL57 | ACCOUNT FOR NOW: L1 prints the consumer-fitness report for LOTM volume 1 and MoL with the crosswalk |
| CL58 | ACCOUNT FOR NOW: CL55's prompt line goes to the reading session as a suggestion (shared notes); it owns `batch_lib.mjs` |
| CL59 | ACCOUNT FOR NOW: trend lanes hold out the last fifth of the slice (CL34) as the trend audit |

### 10.2 Relationships and actions from what people do after interactions

Top down: start from what the books show people doing **after** someone does something to them, then
build the smallest state that produces it (the WA42 method, applied to reactions instead of choices).

**The interaction loop (default for every world):**

| Step | What happens | Owner |
| --- | --- | --- |
| 1 Act | Someone does a classed action to someone (help, ask, insult, threaten, gift, lie, pay, ignore; WA25 classes) | Commands; beats for off-screen people |
| 2 Perceive | The target reacts to what they perceived, not to what happened (WA12, PX49) | Knowledge owner |
| 3 React now | An immediate response from the person's reaction rules (from `reacts` rows) | Resolver, with "why" |
| 4 Change state | Trust or fear toward the actor, a favour or debt row, a typed memory, new knowledge | Relationship rows, `obligations_ledger.js`, knowledge |
| 5 Act later | The new state produces later actions: repay, avoid, report, seek out, confide, recruit, retaliate. These enter the person's schedule as intentions with a window | Cast schedule (L2), beats |
| 6 Others hear | Gossip spreads along relations at the book's rumor speed (CL31) | Knowledge owner |

| Code | Consideration | Disposition |
| --- | --- | --- |
| CL60 | **Reaction grammar from the rows.** Classify the 2,632 MoL `reacts` items by trigger class and response class; the most common pairs per person tier become the default rules, and per-person rows override them. Test: the rules reproduce held-out `reacts` rows for principals | LATER/DELEGATE: Luna medium for the classification, Sol for the rule table; done when 3 principals' held-out reacts are reproduced in most cases |
| CL61 | **What people did next.** Mine scene sequences: after A acts on B in scene n, B's next scene with A, and its action class. That gives "after interaction" actions with the book's own rates | LATER/DELEGATE: Luna medium after L1; done when a table of after-actions per trigger class prints with locators |
| CL62 | **Actions unlocked by relationship state.** List the actions the book shows between people (lend money, invite home, share a secret, vouch, teach, introduce) and the state each needs; the action is offered when the state is there and refused with the reason when not | LATER: after CL60; feeds UI CL37 |
| CL63 | **Intentions are schedule rows.** A planned repay or visit is a window in the person's schedule, so it shows in "where are they" and can be missed or kept | ACCOUNT FOR NOW: L2's schedule rows allow a `source: intention` kind, unused in wave 1 |
| CL64 | **The cast interacts with each other, not only with the player.** The same loop runs NPC to NPC: off-screen pairs settle by outcome (CL6a) at the book's rates; pairs within the player's footprint run the loop | ACCOUNT FOR NOW: L4 runs canon beats only; the NPC-to-NPC loop is LATER |
| CL65 | **Repetition dampens.** The tenth gift moves trust less than the first, and the same apology twice reads as less sincere; rates come from the rows where the book shows repeats | LATER: with CL60 |
| CL66 | **Groups react as groups.** A household, a team or a class shares news and an attitude toward an outsider, with members who differ | LATER: membership rows exist (organizations); after CL60 |
| CL67 | **Memories are typed and fade by kind.** A betrayal lasts, a small kindness fades; fade rates are world dials calibrated where the book shows an old grudge or a forgotten favour | LATER: RLA3 owner |
| CL68 | **Reputation is aggregated reactions.** What a district or institution thinks of the player is the sum of what its members perceived and passed on, not a separate meter | ACCOUNT FOR NOW: no new reputation meter in wave 1; `reputation.js` stays as is |

### 10.3 More of this kind

| Code | Consideration | Disposition |
| --- | --- | --- |
| CL69 | **Readers' row counts are a style signal, not truth.** A row-dense character may just be described often; tiering (WA43) uses presence in scenes, not row count | ACCOUNT FOR NOW: L2 worksheet |
| CL70 | **Calibrate the rules against the lead too.** The lead is one more person under the same reaction and choice rules; if the rules cannot reproduce the lead's own stated reactions, they are wrong for everyone | LATER: with CL60 |
| CL71 | **Untold off-page interactions.** Between canon scenes, people who share a schedule window interact; those interactions are generated by the loop with rates from CL61 and labelled fill, and must pass the anchor lint | LATER |

The direct answer to "would it be considered": the current pipeline already plans gap work after
recording (round 7), so rounds 2-4 add **consumer audits and derivation lanes**, not a new read. The two
reader-side asks (CL55, CL56) are small and opt-in.
