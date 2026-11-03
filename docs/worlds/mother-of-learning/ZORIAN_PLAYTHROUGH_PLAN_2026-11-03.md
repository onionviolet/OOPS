# Zorian developer playthrough: plan (2026-11-03)

Status: proposal (AD32). Plans a developer playthrough of Zorian's own life, the way the [Klein journey plan](../../gm/dispatch/refinement-audits-2026-10-31/LOTM_KLEIN_FULL_JOURNEY_PLAN.md)
plans Klein's. No code changed. Inputs: [COVERAGE_CENSUS](COVERAGE_CENSUS_2026-11-03.md), [RETENTION_RESET_SEAM](RETENTION_RESET_SEAM_2026-11-03.md),
the lead-life [guide](../../LEAD_LIFE_GUIDE.md) and [rules](../../LEAD_LIFE_RULES.md), the Zorian skill rows ZS1-ZS19 in
`gm/dispatch/protagonist-life-2026-10-27/LEAD_SKILL_TIMELINES_2026-11-03.md` (an untracked file in the main checkout at the time of writing; cited by row code),
and WA25-WA41. Locators are merged-shard chapter indices (`cN`). Sealed lead-run scenes (93 of 780) are not restated; arcs are named by mechanism, not plot.

## Reading and premises (PRF1)

Target: a developer plays Zorian from the opening day to the first point where the lead can see what the loop is and what bounds it, using
the book's own rules for what resets and what carries. Viewport for any UI: desktop 1920x1080, mobile deferred (AGENTS standing UI priority).
Premise: the built MoL world is a visitor branch with no loop and no Zorian seat; PROJECT.md puts Klein's journey first.

## Which milestone, and why

- **Chosen: the Threshold stage, c54-c55.** The lead shares his theory of the loop (c54), then meets the loop's own rules: the iteration cap of one
  month (c55 p20), the per-iteration power budget (c55 p91), and the world resetting bodies to the iteration start (c55). It is the first place
  the text states the mechanism, which is what the seam note's row needs as source. It is also reachable from earlier chapters without a
  later volume.
- **Not chosen: the exit.** The loop is closed by an exit plan built across c84-c92 (a Black Room finished before month end, an exit held open,
  c91 and c92) and the ending across c93-c106. Those need the time-room, simulacrum and key-search families (census rows 20, 6, 18), unread
  by any slice yet. They are listed as later stages, not planned in detail.
- Dial: if Weibao wants "break the loop" to mean the exit, just the last stage changes; stages S0-S5 hold either way.

## Stages (WA25-WA27: classed actions, loops from source, progression from loops)

Each stage names the loop it repeats, the families it needs (census row numbers), the seam owner, and its status on the visitor build.
Status words: **have** (a shared seam is built and used by the visitor), **share** (needs the shared seam that LOTM or another world also uses),
**new** (MoL-first mechanism, proposed shared shape), **content** (rows just).

| Stage | Chapters | What the player does (loop, classes) | Families needed | Status |
|---|---|---|---|---|
| S0 Ordinary first days | c1-c4 | Wake, household, school day, shaping practice, measured reserve (the lead's 8 then 10 casts, ZS1-ZS3); social errands; a dance as the first dated event | 1, 2, 7, 6 | have (household, library, access, study chain) plus content; **new**: the Zorian seat |
| S1 First restart | c5-c13 | The month ends or the lead dies, the day returns to its start, memory and skill stay, a letter and a visit recur at their pulls | 21, 12, 15 | **new**: reset row v2 with a date and a death trigger; day-indexed events (GM18); carried-knowledge items (seam note) |
| S2 Using the month | c13-c24 | Re-run known days faster; book a teacher for a lesson series (c15); a housing plan; learn divination and a mind shield; first ally told of the loop (c16, c25) | 6, 7, 13, 14, 15 | share (spell learning GM40, mind effects GM29, divination from LOTM); **new**: witnesses (who remembers, since) |
| S3 The month's dated pressure | c21-c27 | Prepare for the month's end event; learn a teleport; discover a summoning block (c22 p126); two invader mages killed; first-day storm (c27 p39) | 12, 10, 11, 22 | **new** (calendar); content; combat is below floor, so keep outcomes as asserted facts (WA32) |
| S4 Skills abroad | c28-c36 | Leave Cyoria for a wilderness teacher, a contract job, a crystal trade, soul awareness lessons, ward bypass | 11, 5, 9, 14, 3 | share (travel GM31, economy GM4, crafts GM25); **new**: soul perception (ZS13) |
| S5 Mind work and allies | c37-c53 | Weekly mind lessons; trust gates crossed by a prediction list and a code phrase (c49-53); Taiven learns of the loop and trains (c43-c45); a golem and a workshop; a timed training room (c50) | 14, 6, 9, 20, 21 | share (teacher windows, GM1/GM8); **new**: carriers, time rooms |
| S6 **Threshold (milestone)** | c54-c55 | Share the theory of the loop with the other looper; reach the Threshold and read the cap and budget | 21 | **new**: reset row v2 `budget` readout; a fixed-text discovery route (Weibao: sealed by ID if any truth is changed; MoL's public rules are not sealed) |
| Later S7 | c56-c83 | Black Room, simulacrum, key search, allied operations | 20, 6, 18, 10, 17 | not planned |
| Later S8 | c84-c92 | A soul wound ends casting for months (ZS19), exit plan, the exit held open | 14, 21 | not planned |
| Later S9 | c93-c106 | Late-journey events and ending | 22, 10, 17 | not planned |

## Mechanisms the plan needs, ordered (what each stage forces)

| # | Mechanism | Stage that forces it | Owner and state |
|---|---|---|---|
| M1 | A Zorian seat: his body, pack key and commands under `actorId` of the lead rather than the visitor (WA51: a condition fact needs a named supplier) | S0 | **new**; ZS rows say 0 of 19 skills pass the seat test (3 partial) |
| M2 | Reset row v2: several triggers, carry classes with carriers, witnesses, budget, staleness | S1, S5, S6 | `harm_loops.js` extension, see seam note |
| M3 | Day-indexed events and a fixed month length, with restart-day lights and storm | S1, S3 | GM18, `world_calendar.js`, `event_feed` |
| M4 | Carried-knowledge items: a fact with a day stamp, a carrier and a decay clock; foreknowledge shown as a prediction the lead can check | S1, S2 | `people_knowledge`, notes; seam note `staleness` |
| M5 | Spells by teacher and practice with an efficiency discount | S2, S4 | GM8/GM40 (shared with HP, LOTM) |
| M6 | Mind and soul effects as typed abilities | S2, S4, S5 | GM29 (shared, 5 worlds) |
| M7 | Allies as lives with trust and a ledger, re-won each run unless a carrier holds | S2, S5 | WA34, WA42; witnesses in M2 |
| M8 | Time rooms spending from a budget | S5 | later; reads M2 `budget` |

## Alignment with the checks in WA25-WA41

- WA26 loops: the three repeating loops are the school day, the month replay (the whole restart), and the weekly lesson series. Each gets trigger,
  steps, rhythm and owner.
- WA27: skills come from the loops. The lead's gains are dated by elapsed years and soul-bound (ZS rows): 8 to 10 casts early, 20 by the fourth year,
  about 35 later, all credited to efficiency not size. These stay banded proposals; the text has no per-spell numbers (W4 census).
- WA33/WA35: reserve, magnitude and cast counts are the just stated measures; mark all other cost numbers as approximate (banded).
- WA37: scheduled events come from the month's calendar record, reactive ones from the action, ambient ones from keyed draws; the dance and the
  month's end are scheduled, the invasion's first day is a canon beat.
- WA48/WA56: the reset row was shaped on all 106 chapters; stages S7-S9 just add optional fields.

## First playable slice, and the decision to stop at the plan

The lead-life guide's own first slice is "one MoL loop restart that keeps knowledge and replays two beats at their pulls, with a second world as
the fixture" ([guide section 4.4](../../LEAD_LIFE_GUIDE.md), after the beat-checkpoint join). In this plan that is **S1**: Zorian's day 1, a restart
at a month end or a death, two recurring beats, carried knowledge shown to the player.

I did not build it. Reasons, each checked against the census and the files:

1. **No Zorian seat exists.** Every host command is player-bound and the world key is the visitor branch. M1 is a new seat, not a content row.
2. **The shape change is shared.** Two triggers per reset row edits `harm_loops.js` and the validator that LOTM's `book.lotm.tingen` row also passes.
   That is a change in a file the Klein lane reads; it needs its own packet and a regression on the LOTM death row.
3. **The calendar is missing.** The one fixed-length month needs the day-indexed event list (GM18), which is not built for any world.
4. **AD43 floor is out of reach for a small change.** FLR2 needs a fresh-life route to the restart, FLR3 a populated UI readout at 1920x1080, FLR5
   save/reload/Export/Import of the carried knowledge, FLR4 a consumer for it. None of the five exists for this slice, and the new seat is the
   first of them.
5. **PROJECT.md puts Klein's full LOTM journey first.** A Zorian runtime slice would take shared seams that lane is reading.

Result: **planned, not implemented.** Below floor is not claimed; nothing was built.

## Proposed work packets (not dispatched; each its own bounded task)

| Pkt | Task | Level and effort | Done check |
|---|---|---|---|
| P1 | Paper-test the reset row v2 on the LOTM death row, the Perfect Run try budget and MoL (rows just, no code) | sonnet, medium | the three rows fill every field or name the gap; no change to a current row |
| P2 | Zorian seat decision: a lead seat on the existing Cyoria pack versus a new key; list which `book.mol.*` commands become actor-bound | sonnet, medium | each of the 19 ZS skills has a named consumer or a gap |
| P3 | M3 day-indexed calendar for the first restart (storm and light show, a dance, the month's end), reusing `world_calendar.js` | sonnet, medium | the news strip shows an event on its day and not before (GM18) |
| P4 | S1 slice: restart keeps carried knowledge and replays two beats | sonnet, medium, after P1-P3 and after the Klein lane releases the shared files | AD43 six-line floor, a headless journey from a fresh origin with save/reload/import |
| P5 | Content passes on S2-S4 rows, using GM8/GM40 and GM29 as the seams | haiku shards, then sonnet merge | WA48 sample of 20 rows per type before a field is fixed |

Weibao decisions: (a) soul-bound carry versus an aptitude multiplier for a restart (shown in the seam note); (b) whether the visitor and Zorian
share one Cyoria pack or split. Both are reversible prototype choices until a slice ships.
