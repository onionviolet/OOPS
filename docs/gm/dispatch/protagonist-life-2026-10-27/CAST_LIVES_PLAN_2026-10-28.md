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

## 11. Round 5: improvements, dispatch and timing (2026-10-28)

Weibao: "we can improve the stuff accordingly where there is room to improve, send stuff accordingly?
while we still can? More ot consider?"

### 11.1 Done (ACT NOW)

| Code | What | Where |
| --- | --- | --- |
| CL72 | Paste-ready Codex briefs for the two lanes that can start now and run in parallel (disjoint files, no shared data): L1 merge, crosswalk and fitness report (Sol, medium); L2 schedule module (Luna, low). Each names files, seam, done check and stop conditions | [L1](cast-lives-lanes/L1_BRIEF.md), [L2](cast-lives-lanes/L2_BRIEF.md) |
| CL73 | Reader-side asks (CL55 routine place ids, CL56 structured reacts, the slice's people for SV8's targeted re-read list) sent to the batch-reading session ahead of the October credit lapse, quoting Weibao's words and stating that each paid run still needs its own go | Message to the reading session; shared notes file |
| CL74 | Round 1's F4 overstated name joins; corrected in place with the round 4 counts | Section 1 |

**Why the briefs are files, not a launched run:** the `codex` CLI is not on this Mac's PATH (checked
2026-10-28 with a login shell), so this session cannot start a Codex worker or run the usage preflight.
Paste each brief into the Codex app with the working folder set to this checkout.

### 11.2 Improvements to earlier rounds (ACCOUNT FOR NOW)

| Code | Improvement | Applies to |
| --- | --- | --- |
| CL75 | **Wave order tightened.** L1 and L2 run together; L3 starts when L1's crosswalk lands; CL18 (fight contracts) and CL61 (after-interaction actions) start right after L1, before L4, so L4's probe has sourced contracts and rates instead of fills | Section 4 order |
| CL76 | **The schedule is the hub.** Rounds 2-4 all write into schedules (intentions CL63, aftermath CL8, fate weight CL21 as a stored field). L2's row shape carries `source` and `weight` from day one so nothing reshapes it later | L2 brief |
| CL77 | **One classifier, three uses.** The WA25 action-class classifier L1 writes for the fitness report is the same one CL60 (reaction grammar) and CL61 need. Keep it in `build_crosswalk.mjs` as an export, not three copies | L1 brief; CL60, CL61 |
| CL78 | **Probe before polish.** No detail, UI beyond CL36/CL38 or trend lane starts until L4's gap ledger exists for the slice; the ledger ranks what to build next | Section 8.2 |

### 11.3 Timing ("while we still can")

| Code | Consideration | Disposition |
| --- | --- | --- |
| CL79 | **The API credit lapses at month end** (last safe submit: noon on the last day, BATCH_READING_WORKFLOW). Only reads spend it; every lane in this plan is local and free. What benefits from the lapse window is the reading session's targeted 1.4 re-read (SV8), now including the slice's routines and reacts | Reading session's call, with Weibao's go per run file |
| CL80 | **Codex allowance is separate from the API credit.** The lanes draw on the Codex subscription, not the credit, so they need not rush before the lapse; they need the usage preflight once the CLI is available | ACCOUNT FOR NOW |
| CL81 | **Do not wait on reads.** Wave 1 runs on the rows already on disk; 1.4 rows slot in later without a rerun (section 4 table) | ACCOUNT FOR NOW |

### 11.4 More to consider (round 5)

| Code | Consideration | Disposition |
| --- | --- | --- |
| CL82 | **Lane receipts feed the plan.** Each lane writes a checkpoint in `cast-lives-lanes/`; the next brief is written from the last checkpoint, not from this plan's assumptions | ACCOUNT FOR NOW |
| CL83 | **A second Codex lane per wave at most while the shared checkout is busy.** Other sessions commit here (AD41); two writers with disjoint files is the safe ceiling | ACCOUNT FOR NOW |
| CL84 | **Cost of the Sol lanes.** L1 and L3 are the only Sol lanes in wave 1; if either stalls, split it rather than escalating the model | LATER: per checkpoint |
| CL85 | **Install or point to the Codex CLI** so a session can run the preflight and launch detached lanes with recorded PIDs (AGENTS.md multi-agent rules) | LATER: Weibao's choice; until then the Codex app route works |

**Reading session reply (2026-10-28):** CL55 done in `6aec36129` (schema 1.4 people prompts require routine
`place` to be a known-names id or a newly minted one; 1.3 prompts unchanged). CL56 is held until L1's
local classifier (CL77) reports its hit rate; if it falls short, this plan sends the reading session a
1.5 field shape. SV8's targeted re-read now covers routines and reacts for the slice's people; it runs at
schema 1.4 and needs Weibao's go.

## 12. Round 6: after L1 and L2 land (2026-10-28)

Weibao: "what to consider after tthey are done? I allowed L1 to get past checkpoint". State when written:
L1 stopped at its ambiguity gate (26 item ids in 12 groups, [checkpoint](cast-lives-lanes/L1_CHECKPOINT.md)),
then continued on Weibao's go; the LOTM volume-1 re-merge now loads 590 people and 490 rules rows. L2's
module and its six focused tests pass in the working tree. Neither lane is committed.

### 12.1 Item identity default (closes L1's stop for later lanes)

| Code | Default, dial and reason |
| --- | --- |
| CL86 | **Items are types unless the rows show one object.** Same-named items (keys, a key) stay separate ids and map to one runtime item type; an id becomes an instance only when rows give it one holder, one place or a unique description (the lead's notebook, a specific revolver). People, places and organizations take overlay redirects; items do not in wave 1. Reason: the cast import needs one id per person and place; item instances matter only for things that change hands in a beat, and L3 reads those paragraphs anyway |

### 12.2 Review checklist when each lane reports done

| Code | Check | Lane |
| --- | --- | --- |
| CL87 | `tests/lead_run_crosswalk.test.js` exists and passes on fixtures (missing when this round was written) | L1 |
| CL88 | Every person, place and organization present in LOTM chapters 1-24 lead scenes has a crosswalk row or a named skip reason; counts in the checkpoint | L1 |
| CL89 | The fitness table is filled for both books (no "not measured"), and the classifier's hit rate on `reacts` is stated: that number decides CL56 (send a 1.5 field shape to the reading session, or not) | L1 |
| CL90 | The MoL first-restart chapter is named with its locator, or left `U` with the reason; L6 needs it | L1 |
| CL91 | No edit to `merge_shards.mjs` or `batch_lib.mjs`; committed files carry ids, counts and locators only | L1 |
| CL92 | Tests cover each case the brief lists (weekend gap, `once`, `irregular`, precedence, `until`, the anchor lint both ways); `check:arch` no new cycle; no save field; labelled "engine ready, not integrated" | L2 |
| CL93 | Each lane commits only its own paths from a fresh HEAD; the committer runs `npm run build`, the full `npm test` once, `check:arch` and `check:rules` | Both |

### 12.3 What comes next, in order

| Code | Next | Model | Done check |
| --- | --- | --- | --- |
| CL94 | **Worksheet script** (`scripts/lead_run/cast_worksheet.mjs`): the plan's S2 stage was left out of the L2 brief. One private worksheet per slice entity from the merged dir plus the crosswalk | Luna, low | One worksheet per crosswalk person in chapters 1-24, with presence and partial counts (CL2), whereabouts, routine slots, relations, reacts, anchors |
| CL95 | **CL18 fight contracts and CL61 after-interaction mining**, both from L1's output and classifier (CL77) | Luna, medium | As in sections 8.5 and 10.2 |
| CL96 | **L3 cast records** (Sol, medium), briefed from L1's final checkpoint (CL82). Includes D1: the new "beside the lead" start profile and `canon_beside` continuity, which is the first save-touching step. It is additive (a new start, no change to existing saves); the brief must state that compatibility decision (AGENTS.md safety) | Sol, medium | Section 4 L3 row |
| CL97 | **L4 living week**, after L3: wires `cast_schedule` into the location authority and runs the gap probe (section 8) | Luna, medium | Section 4 L4 row |

### 12.4 More to consider (round 6)

| Code | Consideration | Disposition |
| --- | --- | --- |
| CL98 | **The Codex CLI is on disk**, inside `/Applications/ChatGPT.app/Contents/Resources/codex-cli/`, just not on PATH. Round 5's "not installed" was wrong about the binary; a session could run the usage preflight and launch lanes detached once that path is confirmed | LATER: confirm the binary path and add it to the tool registry |
| CL99 | **Codex stop gates work.** L1 stopped exactly where the brief told it to; keep numeric stop lines in every brief, and give the default (like CL86) in the next brief so the same stop does not recur | ACCOUNT FOR NOW |
| CL100 | **Lane drift.** L1 found the narrower prefix regex dropped four early shards before correcting it; a later brief names the expected shard count so the lane can check itself | ACCOUNT FOR NOW: L3 and later briefs carry expected counts |

## 13. Coordination log (2026-10-28, Weibao: "Work with them accordingly")

| Code | Event | State |
| --- | --- | --- |
| CL101 | **L2 reviewed and repaired.** The brief's row shape had no date, so a `once` row matched every day; the lint skipped `intention` rows, which are generated and must obey WA24. Added an optional `day` (first day; required for `once`, phase for repeating rows) and linted every non-canon row. Codex's L2 session had finished uncommitted, so this session took over its two files | `src/cast_schedule.js`, `tests/cast_schedule.test.js`; focused test 6/6 |
| CL102 | **L1 found a merge hazard.** `merge_shards.mjs` applies people-pass `same_as` claims before overlay review, and some merged different people. L1 blocks unreviewed claims in the private overlays instead of editing the merge | L1 running; owner of `merge_shards.mjs` is the batch-reading session (tell it once L1 reports) |
| CL103 | **Codex CLI route confirmed:** `/Applications/ChatGPT.app/Contents/Resources/codex-cli/bin/codex` (0.165.0-alpha), ChatGPT login, ordinary usage allowed, 3% of the window used. Lanes launch detached with API keys stripped from the environment so they cannot fall back to API billing | Supersedes CL98's "LATER" |
| CL104 | **Next briefs ready:** [L2b worksheets](cast-lives-lanes/L2B_WORKSHEET_BRIEF.md) (Luna, low) and [L2c fight contracts and after-actions](cast-lives-lanes/L2C_CONFLICT_AND_AFTER_BRIEF.md) (Luna, medium). Both start when L1 reports done; they share no files | Waiting on L1 |
| CL105 | **L1 landed** (`b3b2c0c8e`): crosswalk for every entity touched in LOTM chapters 1-24 (297 rows, 0 runtime matches, as expected) and MoL chapter 1 to the first restart (`en b1 c5 p9`; 109 rows, 5 runtime matches); reviewed overlays keep uncertain ids apart; `classifyAction` exported | [L1 checkpoint](cast-lives-lanes/L1_CHECKPOINT.md); focused 15/15, `npm test` 3,652/3,652 |
| CL106 | **L2b and L2c launched** detached through the Codex CLI (Luna low and Luna medium; logs and PIDs in this session's scratchpad); L3 brief written and waits on L2b | [L2b](cast-lives-lanes/L2B_WORKSHEET_BRIEF.md), [L2c](cast-lives-lanes/L2C_CONFLICT_AND_AFTER_BRIEF.md), [L3](cast-lives-lanes/L3_CAST_RECORDS_BRIEF.md) |
| CL107 | **Told the reading session:** CL56 evidence (the keyword classifier places 40% of LOTM slice triggers and 37% of MoL's) with a proposed 1.5 `reacts` shape, and CL102 (unreviewed `same_as` applied by the merge) | Its call |

## 14. Round 7: what L1's numbers change (2026-10-28)

Weibao: "its dont, work on next part? More to consider?"

| Code | Finding or consideration | Disposition |
| --- | --- | --- |
| CL108 | **Timing is the thinnest layer.** Only 11 of 131 LOTM slice routine slots (10 of 76 MoL) carry both a registry place and a time; most give days without hours, which is the text, not the reader. The first week will run mostly on role-mechanism fills | ACCOUNT FOR NOW: L3 fills hours from the role with a basis and searches LOTM rows for stated hours first |
| CL109 | **An hours table per world.** The fills L3 writes (office, school, market, church hours) are world facts, not personal ones; collect them once as a Tingen hours table that every role reads (GM5) | LATER/DELEGATE: Luna low after L3; done when role rows reference the table instead of repeating hours |
| CL110 | **L3 is data only.** The new "beside the lead" start and `canon_beside` continuity (D1) move to L4, which owns the host wiring and the save-touching step, and must state its additive compatibility decision | ACCOUNT FOR NOW: L3 brief |
| CL111 | **Most of the 297 LOTM entities stay at M1.** L3 takes at most 8 principals, 12 recurring and role records; the rest are listed by id in its checkpoint as the next promotion queue (WA22, WA43) | ACCOUNT FOR NOW |
| CL112 | **The classifier is a floor, not the rule table.** At about 40% coverage, CL60's reaction grammar needs either the 1.5 field or a slice-sized hand classification (196 LOTM and 100 MoL triggers) by a reading lane | LATER/DELEGATE: Luna medium, after L2c reports its unplaced share; done when every slice trigger has a class or a stated reason |
| CL113 | **Re-imports after a re-read.** If SV8 re-reads the slice at schema 1.4, rerun L1's two merge and crosswalk commands; crosswalk addresses are deterministic, so L3's ids survive, and new rows arrive as additions. L3 records the merge input hashes it was built from | ACCOUNT FOR NOW |
| CL114 | **Lanes did not commit by themselves** (L1, L2). The launcher prompt now says to commit; this session reviews and commits when a lane stops short | ACCOUNT FOR NOW |
| CL115 | **MoL is cheap to prove.** Its slice is 25 lead scenes (chapters 1-5), so L6, the AR11 second case, is small once L4 works | ACCOUNT FOR NOW |
| CL116 | **L2b landed** (`df85427a7`): 187 private worksheets for LOTM chapters 1-24, 148 candidate schedule rows, 36 with a usable time. Principals by presence: the lead (26 scenes), Dunn Smith (13), Melissa (6 plus 2 partial), Benson (1 plus 2 partial), a Nighthawk colleague (4); the two remote gathering members rank high but stay M1 (plan 3.1) | [L2b checkpoint](cast-lives-lanes/L2B_CHECKPOINT.md) |
| CL117 | **L2c landed after a relaunch** (`c0488206a`): the first run found 0 fights because 130 of 161 slice steps have no class (read before classes existed); the widened rule finds 5 candidates (2 conflicts, 3 not-conflict with reasons). After-action pairs LOTM 9, MoL 21. The classifier leaves 60% of slice `reacts` triggers unplaced, which supports CL56 | [L2c checkpoint](cast-lives-lanes/L2C_CHECKPOINT.md), [addendum](cast-lives-lanes/L2C_ADDENDUM.md) |
| CL118 | **Tool gap:** `cite_paragraphs.mjs --id` takes entity ids, not beat ids; lanes read a scene's paragraphs through its evidence locators instead | LATER: a `--beat` option (Luna low), owned with the reading tools |
| CL119 | **Codex sandbox cannot write `.git`**, so lanes never commit; this session reviews, runs the full suite where code changed, and commits each lane's own paths | Launcher prompt and briefs updated |
| CL120 | **L3 running** (Sol, medium). **L4a brief written** ([L4a](cast-lives-lanes/L4A_LIVING_WEEK_BRIEF.md), Sol, medium): the beside start, schedule-driven locations through the one location store, talk gated by presence, additive save decision; the day index counts from the life's start because the LOTM start month is still Weibao's open question. Beats, the null-player run and the gap probe split off as L4b | Waiting on L3 |

## 15. Round 8: scenes in the UI, a leaner pipeline, and what else (2026-10-28)

Weibao: "What else to consider? anything to be more optimal? Ohter stuff? Rules on how to create the
scenes into our UI?"

### 15.1 Scene-to-UI rules (proposed SUI1-SUI12)

These turn a book scene into what the player sees. They restate and apply existing owners (UR41-UR49,
UR70-UR75, AR7, AR8, PX49, PLAN 17.4) for this case; proposals until Weibao accepts them. Target:
1920×1080 desktop first; mobile deferred.

| Code | Rule (default, dial and reason) | Restates |
| --- | --- | --- |
| SUI1 | **A scene is state, not prose.** The UI draws place, time band, who is here, available actions and results from game state; every line is our own wording generated from fields. Source text never reaches the screen. Reason: copyright and one truth (AR8) | AR8, research rules |
| SUI2 | **Pick the surface by what the scene asks of the player** (UR41): a routine moment lives in the location panel; a scene with a choice opens a scene card in the center view through the shared controller with the back bar and Esc; a fight uses the existing combat surface; a scene the player is not in becomes a log line | UR41, PLAN 17.4 |
| SUI3 | **Witness level decides the text** (PX49): present gets the card; affected gets the outcome and its effect on you; aftermath gets what you find afterwards; heard gets a rumor line marked as told to you. Never more than the player perceived | PX49, AR8 |
| SUI4 | **No canon labels by default.** Options are not marked "what the book did"; the opt-in overlay shows past and current canon scenes only | PLAN 17.4, sealed-secrets rule |
| SUI5 | **Untaken options stay visible** as actions with their cost, or as a quiet "not possible yet: [what is missing]" line; never silently absent (WA28) | WA28, UR72 |
| SUI6 | **Quote before commit.** Every scene action shows time, cost, who is affected and, where weighted, the observable resistance (CL40) before the click, and rechecks on commit | AR7, UR71, CL40 |
| SUI7 | **Scenes keep their window, not the player's attention.** A scene you are part of waits within its window and shows in the calendar and an "upcoming" strip; past the window it settles without you (CL6a) and reaches you at your witness level. No forced pause; an optional notice for appointments | NPC absence report, CL6 |
| SUI8 | **One card at a time.** Several live scenes queue in the upcoming strip in time order; cards never stack | UR42 |
| SUI9 | **Lead with meaning** (UR70): the card's first line says what is at stake for you in one sentence; mechanics follow (UR71) | UR70, UR71 |
| SUI10 | **People on the card are links** to their person view (CL36, CL37): where they usually are, why they act toward you as they do | UR43, UR47 |
| SUI11 | **The log line is the receipt.** Every settled scene writes one compact subject-first log line (UR44) through the name resolver, so a missed scene is still traceable | UR44, CAE-E1 |
| SUI12 | **Each new scene kind earns browser evidence** at 1920×1080 on a populated save before it is called done (AD43) | AD43, UR rules |

| Code | Disposition |
| --- | --- |
| CL121 | ACCOUNT FOR NOW: L4a uses SUI2 (talk through the existing action list, no new card yet), SUI3 (log line for an away person is not needed in wave 1) and SUI6 |
| CL122 | LATER/DELEGATE: the scene card itself (SUI2, SUI8, SUI9) after L4b's beats exist; Sol, medium; done when one chapter 1-24 choice scene renders as a card at 1920×1080 with quote, commit and log receipt |
| CL123 | ACCOUNT FOR NOW: register SUI1-SUI12 in UI_RULES and the rules index only after Weibao accepts them |

### 15.2 A leaner pipeline (what the first six lanes taught)

| Code | Finding | Change |
| --- | --- | --- |
| CL124 | Two lanes lost a run to wrong assumptions about the data (L2c's fight filter, L1's prefix regex) | ACT NOW (done for L6a): every brief opens with a **five-minute data probe** that counts the fields it depends on and stops if a count is under half the expectation |
| CL125 | Luna handled the scripted lanes (L2, L2b, L2c) well; Sol was right for identity review (L1) and paragraph reading (L3) | ACCOUNT FOR NOW: keep the split; escalate a Luna lane to medium before switching to Sol |
| CL126 | Lanes block on one another (L4a waits on L3) while unrelated lanes could run | ACT NOW (done): L6a, the MoL worksheets, runs beside L3; at most two writers at once (CL83) |
| CL127 | The coordinator's review found real defects in two of six lanes (L2's undated `once` rows, L2c's selection) | ACCOUNT FOR NOW: keep the review step: diff read, focused test, one data spot check, before each commit |
| CL128 | The full suite takes about two minutes and lanes cannot commit | ACCOUNT FOR NOW: when two lanes finish close together, run the suite once and commit both, one commit each |
| CL129 | Codex usage was 3% then 4% of the window across five lanes | ACCOUNT FOR NOW: run the preflight before each batch; no need to throttle at this rate |
| CL130 | Briefs that link plan sections stay short; the lane reads the sections it needs | ACCOUNT FOR NOW |

### 15.3 Other things to consider

| Code | Consideration | Disposition |
| --- | --- | --- |
| CL131 | **A lane runner.** The launcher, PID watch and preflight live in this session's scratchpad; a repo script (`scripts/codex_lane.mjs`: preflight, launch detached with API keys stripped, record session id and PID, report on exit) would let any session coordinate Codex lanes | LATER/DELEGATE: Luna low; done when one lane runs end to end through it and AGENTS.md's multi-agent section links it |
| CL132 | **Promotion queue.** L3 leaves most of the 187 LOTM entities at M1; when the player meets one, promote them by the same worksheet path (WA22) instead of improvising | LATER: after L4a |
| CL133 | **The lead as a player-visible life.** Once beats run (L4b), the lead's own week is the richest test of every system; the watch view (CL5) shows it to Weibao | LATER |
| CL134 | **Golden fixture.** Keep one saved "day 3, beside start" fixture for every later lane's regression check (games lens: a save fixture per important state) | ACCOUNT FOR NOW: L4a adds it under `tests/fixtures/` if its test needs one |
| CL135 | **Hidden coupling with the original branch.** The beside start shares Tingen places with the original probationer branch; a later change to the original pack's places must keep the cast's place ids valid | ACCOUNT FOR NOW: L3's test checks every cast place exists in the pack or the cast data |

## 16. Coordination log, continued (2026-10-28)

| Code | Event | State |
| --- | --- | --- |
| CL136 | **L6a landed** (`d5122883b`): the worksheet tool takes `--world` and a locator range; 93 MoL first-loop worksheets; LOTM output byte-identical. MoL rows carry no loop field, so every later appearance is held as `anchorsOtherLoops`, not a forward anchor (conservative, plan F5) | Second world ready for an L3-style lane |
| CL137 | **L3 landed** (`92af8ce99`): 8 principals, 12 recurring, 16 role records, 28 places, 77 schedule rows, 84 beats, 108 entities queued at M1; PL-A46 rejections listed by locator; `npm test` 3,666/3,666 | [L3 checkpoint](cast-lives-lanes/L3_CHECKPOINT.md) |
| CL138 | **L3 left the day binding open, correctly.** Every canon row is `irregular` and every beat waits on a window fact, because no lane had chosen how source order maps to civil days. L4a now does it first (step 0) with a labelled source-order default, kept in its own data file so it can be replaced | L4a brief step 0 |
| CL139 | **Runtime ids are hashed** (`lotm.person.cast-<hash>`), readable names in `indexId`. Fine for play; awkward for debugging and briefs | LATER: readable slugs when the crosswalk is next regenerated, with a redirect map |
| CL140 | **L4a launched** (Sol, medium; Codex usage 5% of the window) | Running |

## 17. Round 9: book text, details, emergence, travel between scenes, durability, and build order (2026-10-28)

Weibao: "For descriptions of locations and more, we can literally use text from the bookj and more? even
for character? what about the little details? Emergent behavior? Other stuff? UI travel path from on
scene to the net? mroe to consider? Make stuff alst long term and more? The Playthrough and also as NPC?
Or should we finish playthrough first and then set up the NPC versioon? More to conisder?"

### 17.1 ACT NOW: the canon cast belongs in the private pack

| Code | Finding | Disposition |
| --- | --- | --- |
| CL141 | **Wrong home for canon data.** Accepted direction: "Direct recreations live in a private pack outside git and outside `dist/bundle.js`; the public fork keeps original names" (PROJECT.md book worlds, AD1). `origin` is public. L3 put the canon cast (names, relations, beats) in `src/book_world_lotm_cast.js`, committed locally in `92af8ce99`, **not pushed**. My L3 brief named that path; the error is the brief's | Move the data to `private_packs/lotm-cast/` (gitignored, fetched at runtime by the existing `loadContentPacks` route, like `a-soldiers-life`); `src/` keeps only world-neutral code and a pure bridge that validates a pack object (the `lotm_ingredient_catalogue.js` pattern). The beside start appears only when the private pack is present. Same for L6b's MoL cast |
| CL142 | **The local commit still holds the data.** A later removal leaves it in history, which a push would publish. Removing it from history needs a rewrite, which the shared-checkout rules forbid without Weibao's explicit yes | Ask Weibao before any push; until then nothing here is pushed |
| CL143 | **Tests cannot read the private pack** (the public repo's tests run without it). Focused tests use synthetic fixtures; checks against the real cast run through a private check command that skips cleanly when the pack is absent | ACCOUNT FOR NOW: the move lane (L3m) and every later brief |

### 17.2 Using the book's own text

| Code | Default, dial and reason |
| --- | --- |
| CL144 | **Yes, in the private pack, and only there.** The private pack is local, gitignored and never bundled, the same privacy class as the private research folders. It may carry book text for place descriptions, a person's first-meeting description and canon dialogue in canon-faithful scenes, each with its locator. The public build always uses our own wording (SUI1 holds for it). Dial: per world, quote, paraphrase or both. Reason: Weibao plays his private copy; the book's own description is the best description, and the locator keeps it traceable |
| CL145 | **Quoted text is a layer over our own text, not a replacement.** Each description has our version (always present) and an optional book version (private). The UI shows the book version when present, marked "from the book"; mechanics and effects stay in our words (UR70, UR71). Reason: a quote never carries the mechanical meaning, and the public build needs a full description anyway |
| CL146 | **Extrapolated lines stay ours.** Lines for things the book never shows (a vendor on another day, a talk the player starts) use the person's voice tags from `speech` rows, never stitched book quotes. Reason: stitched quotes put words in a character's mouth the text never gave them (WA35) |
| CL147 | **Choose quotes by an implementer reading the paragraph** (round 8), short and about the subject; a lane never bulk-copies chapters into the pack | LATER/DELEGATE: a "book text" lane after L3m, Sol, medium; done when 10 slice places and the 8 principals have a quoted description with locator in the private pack |

### 17.3 Little details and emergent behavior

| Code | Consideration | Disposition |
| --- | --- | --- |
| CL148 | **Details are keyed to place, time band, weather and witness** (texture rows, CL12): a detail shows when the player is there at that band and perceives it; it repeats rarely (a seen-detail list per place) | LATER: after the scene card (CL122) |
| CL149 | **Emergence comes from the loops, not from scripts:** schedules put people in the same place, the interaction loop (10.2) changes their state, the state changes their next actions. Nothing new needs authoring for it to happen | ACCOUNT FOR NOW: no scripted "emergent events" |
| CL150 | **Emergence has guard rails:** forward anchors (WA24), deterministic keyed draws (CL49), the butterfly radius (CL48), and an emergence log listing what happened that the book never showed, labelled divergence, so Weibao can read what the world did on its own | LATER/DELEGATE: emergence log with L4b; Luna medium; done when one idle week prints its non-canon events |
| CL151 | **A surprise budget per world:** how much off-book life a world generates per day, a dial set by the world (a quiet town low, a war high) | LATER |

### 17.4 Travel from one scene to the next (UI)

| Code | Rule (proposed, extends SUI1-SUI12) |
| --- | --- |
| SUI13 | **Every closed scene points onward.** The card's close shows what is next that the player knows of: an appointment, a lead, a person's usual place, each with the travel action and its time quoted (SUI6) |
| SUI14 | **Travel is the real move verb**, with real minutes (district links), never a jump to the next scene. Arriving early means waiting or doing something else; arriving late means the scene settled without you (SUI7) |
| SUI15 | **The route is a place too.** People whose schedules cross the route can be met on the way; a short "on the way" line shows who you passed, at your witness level |
| SUI16 | **Follow mode:** "follow [person]" moves the player with them by the same verbs, at a distance the world sets (shadowing is a skill check where it matters), so watching the lead's day is one action, not many |

| Code | Disposition |
| --- | --- |
| CL152 | ACCOUNT FOR NOW: L4a's talk refusal already points onward (where and when the person is back); SUI13-SUI16 build after L4b |

### 17.5 Lasting long term

| Code | Consideration | Disposition |
| --- | --- | --- |
| CL153 | **Saves hold state, never pack content.** A save stores what changed (where a person is if moved by play, settled beats, relations changed by play); the pack supplies the rest. A save without the pack loads, hides the beside start and shows the cast as unavailable rather than failing | ACCOUNT FOR NOW: L3m and L4a |
| CL154 | **Every pack carries its input identity** (merge hashes, crosswalk hash, schema version), which L1 and L3 already record; a regenerated pack keeps ids stable through the crosswalk, and changed ids ship with a redirect map | ACCOUNT FOR NOW |
| CL155 | **One importer per world, world-neutral engine.** `cast_schedule`, `beat_records`, the worksheet and crosswalk tools stay world-neutral; each world adds data and at most a thin bridge (AR11, AR12). L6b's AR11 report is the check | ACCOUNT FOR NOW |
| CL156 | **Docs say where things live.** The plan, briefs and checkpoints stay the record; when the slice is done, PROJECT.md gets one summary line and the rules index gets codes only when Weibao accepts them | ACCOUNT FOR NOW |

### 17.6 Order: the NPC version first, then the lead's playthrough

| Code | Default and reason | Disposition |
| --- | --- | --- |
| CL157 | **Build the NPC version first** (now under way: the beside start, cast schedules, then the null-player run in L4b). Reasons: it serves every seat (beside, follow, bystander and later playing as the lead); the null-player run is the regression harness every later change is checked against; and it needs no player-facing powers, while the lead's own playthrough hits `blocked by mechanism` beats (the cheat space) early | ACCOUNT FOR NOW |
| CL158 | **Then the lead's playthrough driven by the bot** (PLAN LP10a): the same records, the lead as the player life, the bot using the same commands a player has. Where it diverges from the null-player run, one of the two is wrong | LATER: after L4b |
| CL159 | **Then the seat for Weibao as the lead** ("be" mode), private pack only (AD1), after the WER11 wording he has not yet settled (implementation prompt D2) | LATER: needs his WER11 answer |
| CL160 | **Nothing is built twice.** The cast records, schedules, beats and UI rules are the same in all three; only the driver changes (NPC policy, bot, Weibao) | ACCOUNT FOR NOW |

**CL142 decided (Weibao, 2026-10-28): "Keep history".** Local commit `92af8ce99` keeps the cast data in
history; no rewrite. Going forward the data lives in the private pack (L3m), and `src/` holds only the
name-free bridge.

## 18. Round 10: the lead's own actions, reproducible through our UI (2026-10-28)

Weibao: "I meant from one scene to the next, we need an accurate UI flow possiblity too? so its as if the
main character themselves can reproduce their own actions through the interface of our game?"

Reading: every action the lead takes in the book, in order, should be doable by a player through the
game's real screens, with what the lead knew and had at that moment. This is PLAN LP10a (the bot plays the
lead through the same commands a player uses) made into a UI test. Measured 2026-10-28: LOTM chapters 1-24
hold 58 lead scenes with 161 steps (31 classed), 113 named options and 58 choices; the LOTM pack has 350
player commands.

### 18.1 Method: step table, UI path, replay

| Code | Step | Default, dial and reason |
| --- | --- | --- |
| CL161 | **Step table.** Each lead step becomes one row: verb, action class, place, time band, inputs and outputs, and its locator | From the scenes rows; the classifier (CL77) fills the class, a reader fills the rest where it misses |
| CL162 | **Map, fold or gap.** Each step maps to an existing game action, folds into a coarser one (book steps below the game's granularity, such as getting dressed, fold into "morning at home"), or becomes a gap row naming what is missing (a verb, a place, an item, knowledge) | Dial: the world's action granularity. Reason: one button per prose verb would bury the UI; a fold must keep every input, cost and outcome the step had |
| CL163 | **UI path, not internal command.** For each mapped step, from the screen the previous step left, the action must be visible and reachable through the real interface (navigation, panel, button) in a few clicks, with its cost quoted (SUI6). A step only the code can run counts as a gap | Reason: the request is about the interface; AR10 says integration means a player journey crosses it |
| CL164 | **Only what the lead knew** (LP5). A step must be findable from what is on screen plus the lead's knowledge at that date; a step that needs reader knowledge is a gap in the UI's disclosure or in the knowledge record | Reason: otherwise the replay plays with the book open |
| CL165 | **Replay through the UI.** The bot (game MCP `game_look`, `game_click`, `game_step`, or the headless lead bot) clicks through the mapped steps in order and asserts the anchors on their dates (purse, place, knowledge, outcomes). No teleport, no direct state writes, no cheat verbs | Reason: a passing run through a shortcut proves nothing (implementation prompt) |
| CL166 | **Score and ledger.** Report the share of steps reproducible through the UI, folded, and gapped, by gap kind (missing verb, missing UI path, hidden by disclosure, missing knowledge, blocked by mechanism). The ledger feeds the gap probe (CL15) | Default target for the slice: every step either reproducible, folded or a named gap; no silent skips |
| CL167 | **Seat.** Until the "be" seat exists (CL159, private pack, WER11 answer pending), the replay runs in the beside start with a player body standing in for the lead; identity-bound steps (the lead's own family, his post) are recorded as `needs seat: be` rather than faked | Reason: the map and most UI paths are identical; only identity differs |
| CL168 | **The same table drives the NPC lead.** The lead as an NPC (L4b) runs the same mapped actions through the same commands, so the NPC version and the playthrough cannot drift apart (CL160) | ACCOUNT FOR NOW: L4b brief |

### 18.2 What this adds to the UI rules

| Code | Rule (proposed, extends SUI1-SUI16) |
| --- | --- |
| SUI17 | **Every lead step has a reachable control or a named fold.** A world is UI-complete for a slice when its step table has no unmapped, unfolded step |
| SUI18 | **The next step is findable from the current screen.** Where the lead's next action happens elsewhere, the current screen offers the route (SUI13, SUI14); where it needs an item or knowledge, the screen shows what is missing (SUI5) |
| SUI19 | **Folded actions show their parts.** A folded action's description lists the book steps it stands for, in our words, so the player sees the lead's morning as it happened |

### 18.3 Lane

| Code | Lane | Model | Done check |
| --- | --- | --- | --- |
| CL169 | **L5r, UI replay audit, chapters 1-3 first** (the opening night and morning), then the rest of the slice. Step table (private), mapping file with folds and gaps (committed: ids, action ids, counts), and a replay script through the UI; starts after L4a and L3m so it runs on the private-pack cast | Sol, medium (mapping judgment); the replay script itself Luna | Chapters 1-3: every step reproducible, folded or a named gap; the replay passes its anchors through the UI; the score table is in the checkpoint; browser screenshots at 1920×1080 for three steps |

| Code | Event | State |
| --- | --- | --- |
| CL170 | **L6b landed, AR11 holds for data:** MoL first loop, 60 schedules and 44 beats, with zero edits to `cast_schedule`, `beat_records`, core owners, registration or saves. Its seven needs (loop identity, day derivation, a late-evening band, multi-place scenes, alias resolution, dated learning, same-loop anchors) are world data or host consumer work, not seam changes ([L6b checkpoint](cast-lives-lanes/L6B_CHECKPOINT.md) F3). Not yet an integrated second-world journey | Checkpoint committed; `src/book_world_mol_cast.js` and its test **left uncommitted** so no more canon data enters history; L3m moves them into `private_packs/mol-cast/` first (CL141) |
