# Time and chronicle representations (proposals, 2026-10-30)

Status: agent proposals. Nothing here is accepted until Weibao says so (AD32).
Covers RPX15 (time) and RPX19 (chronicle of a life) from the
[UI design audit](../audits/UI_DESIGN_CORE_AUDIT.md), LTU2 (upcoming strip),
LTU3 (return digest), LTU15 (loop and school-year calendars), RPT6 in
[UI rules](../UI_RULES.md) and coverage-plan B1 and B4 in
[the coverage plan](../gm/dispatch/ui-coverage-2026-10-27/PLAN.md).
Codes TC1-TC16 are new and local to this file.

## Reading (PRF1)

The player should be able to tell, at a glance and in words, what time it is
for them, what is coming, and what happened while they were not looking. Today
there is a clock chip (`01/04/999 08:00, Mon`), a session-only calendar line in
Reports, a "World events" feed with leads and recent news, Life and Heard lists,
and a Journal. Nothing summarizes a stretch of time, and nothing groups it by
the people involved.

Premises: desktop 1920×1080; the lead's life is the main line; time in this game
is the expansion clock (`state.clock`, game minutes) plus each world's calendar
profile (`world_calendar.js`); the game does not advance while closed, so "away"
means game time you did not watch (a long job, sleep, a journey, letting it idle).

## Options weighed (RPX15, RPX19)

| Code | Representation | What it is good at | Where it fails | Fit |
|---|---|---|---|---|
| TC1 | **Week calendar with canon windows.** Seven columns, bands for dawn to night, known appointments and canon windows (a term, a market day, a ritual hour) as blocks. | Planning around fixed dates; school-year and work-week worlds. | Empty in worlds without fixed dates; reads as a spreadsheet; hides who. | `cast_schedule.js` TIME_BANDS and RECURRENCE_DAYS already name the bands and periods. B4's Due tab. |
| TC2 | **Day montage strip.** One horizontal band for today: dawn, morning, noon, afternoon, evening, night, with what you did and what is due placed in its band, now marked. | Idle-game feel: you see the day pass; short; works in every world. | Weak for multi-day jobs and for "what changed". | LTU2's upcoming strip is its right-hand half. Figure ring or track. |
| TC3 | **Return digest grouped by person.** "While you were away, about half a day": one row per person (and one for you, one for places) with what you could know, newest first, each line keeping its source. | Answers the first question on coming back; people are the content of a life; small and textual by nature. | Needs a "since you last looked" marker, which is persistence. | RPT6, LTU3, B1. `knownPeopleView` and `eventFeed` already project only what the player knows. |
| TC4 | **Life timeline.** A long horizontal line from birth or arrival: years as ticks, life-record milestones, worlds entered, deaths and heirs as markers. | Replay, "story so far", the lead's life as an arc. | Little to show in a fresh life; needs life-record density. | RPX19, `life_record.js` years and highlights. Figure track per world. |
| TC5 | **Loop reset view.** A loop as a ring: start, the known fixed events around it, the reset point; inside, what carries over (memory, skills, notes) and outside, what is lost. | Loop worlds read correctly at once: the reset is the spine. | Only loop worlds; carries a sealed-secret risk if fixed events are shown before learned. | LTU15. Figure ring with slots. Show only learned events (UR80). |
| TC6 | **Unusual: the letter.** The return digest written as a short in-world note from whoever was nearest ("Mara left a note on the table"), in the world's voice, with the plain list folded under it. | Strong flavour; the digest becomes part of the fiction; good for book worlds with servants, roommates or familiars. | Needs a plausible writer and prose quality, which is known to be weak; risks telling more than the writer knew. | Later, with the local-AI drafting pass. The list under it is TC3. |
| TC7 | **Years-passing summary.** A time-skip card: "Three winters pass", with per-year counts and highlights. | Long skips and heir play. | Rare until generational play is common. | `eventFeed` already builds "Year N: k moments remembered". |

## Default (proposal)

**TC8. Default: the return digest (TC3), then the upcoming strip (TC2 right half).**
Dial: the digest appears once at least four game hours have passed since you last
marked it read and there is at least one line; a world can lower the threshold
(a day-by-day school world) or raise it (a long-voyage world). In-world reason:
when you come back from a long job, a night or a journey, the first thing a
person asks is "what did I miss, and from whom". Cost: one saved number per
life (the clock you last looked at). The lines stay where they already live
(World events news, people's memories, Reports); the digest only groups them.

**TC9. Times read as phrases (LSD161).** The digest says "about half a day",
"an hour ago", "earlier this evening", never `720 minutes`. An exact clock time
appears only where the player has a clock (the header chip already shows it).
The phrase function is shared by all time surfaces here.

**TC10. Grouping order.** People first (most lines first, then most recent),
then **You** (your own completed work), then **Around** (place news with no
person), then **Missed** (events that closed while you were away, only once
heard). Each person row is a link to their People entry when one exists.

**TC11. What never enters the digest.** Only sources that already pass the
player-knowledge test: `knownPeopleView` memories, `eventFeed` news and heard
lines. No NPC private state, no unobserved simulation log, no sealed truth
(AD8, UR80). If the seat changes, the digest reads the seat through
`observer_view.js`; it never compares against the lead's identity.

**TC12. Upcoming strip (next slice).** LTU2's strip: the next three firm things
(a job finishing, an opening, a canon window) as phrases ("your kit, in about two
hours"; "the market, tomorrow morning"), from `eventFeed` leads, the pending job
list and owned-place clocks. Home: the time chip region (`time_and_location`),
one line, expanding to the Due tab (B4).

**TC13. Week calendar (TC1) is the Due tab's wide form.** Only in worlds whose
calendar profile has a week and at least one recurring row; otherwise the Due
tab stays a list.

**TC14. Loop and school-year markers (LTU15).** Loop worlds show the reset as
a ring figure (TC5) in Branches with "carries over" and "is lost" sides; the
header chip adds "day 9 of the loop". School-year worlds add "term 1, week 3".
Both read from the world's calendar profile, never from a hard-coded world id.

**TC15. Life timeline (TC4) at the Journal and at a return after death or a
long skip.** The "story so far" recap (RPX19) is TC4's last segment plus the
years-passing summary (TC7).

**TC16. The letter (TC6) is a dial on TC3.** Off by default; on in worlds that
author a plausible note-writer, and only with the list folded under it, so the
plain facts stay one click away.

## Player sentences (PRF2)

- Works: "While you were away (about half a day). Mara Venn: lent you her
  lantern; asked about the debt. You: finished the road check. Around: the
  market closed early."
- Nothing to say: no row at all. The World events panel stays as it was.
- Cannot run (saving blocked): "Mark as read" is disabled with "Saving is
  unavailable, so this stays unread." The digest still shows.

## Persistence and compatibility (B1, UC-A1)

The digest needs one saved value: the expansion clock at which you last marked it
read. It is a namespaced domain slice `returnDigest: {schema: 1, seenAt}` in the
native save envelope through `domain_registry.js` (the same seam as
`skillRecords` and `pledges`), not a field in the expansion engine state.

Compatibility decision: a save without the slice loads with the marker set to the
current expansion clock, so an old save never replays its whole history as a
digest. The first "Mark as read" writes the slice. A slice whose `seenAt` is
ahead of the clock (an imported older save after a newer marker) clamps to the
clock. Export carries the slice, so Import does not replay a digest already read.
No engine schema bump.

## Receipt (slice 1: return digest, 2026-10-30)

**Home (UR76, proposed):** the World events panel (`#world_event_feed`, panel id
`world-events`, opened from All panels), above its leads. Raw lines stay in
Recent news, Life and Reports (RPT6).

**Files**

- `src/return_digest.js`: pure adapter. `spanPhrase`/`agoPhrase` (TC9),
  `groupDigest` (TC10), `returnDigest(state, registry, {facts, lifeRecord, seenAt, feed})`
  over `knownPeopleView` and `eventFeed` (TC11), `digestFigure` for the gallery.
- `src/return_digest_domain.js`: `returnDigest` domain slice `{schema: 1, seenAt}`,
  validate, lazy baseline, clamp, `markRead` command.
- `src/return_digest_ui.js`: the row (plain lists; it is its own text form).
- `src/event_feed_ui.js`: mounts the row; panel also shows when only the digest
  has something; `reportProjection('events')` carries `away` text.
- `src/native_tool_domains.js`: one import, one configure line. `main.js` untouched.
- `style.css`: four `#return_digest` rules on spacing tokens (UR65).
- `src/ui/preview/fixtures/time.js` and one side-effect import line in
  `src/ui/preview/figure_gallery.js`: named fixture `time-return-digest`.
- `tests/return_digest.test.js`; evidence in
  [evidence/time/](evidence/time/) (`browser.cjs`, `gallery.cjs`, results, PNGs).

**Persistence:** new namespaced save slice through the domain registry; the
compatibility decision is in the section above (no slice → baseline at the
save's own clock; future marker clamps; Export carries it). No engine schema bump.

**Checks**

- `node --test tests/return_digest.test.js`: 6/6 pass (phrases, grouping and
  dedupe, dial and clamp, real-state adapter read-only, slice validate/save/load/
  markRead including the unwritable case, fixture validates and its text form
  carries every line).
- `node docs/representations/evidence/time/browser.cjs` (headless Chrome,
  1920×1080, fresh origin, rebuilt bundle): see `result.json`. Route: fresh life,
  talk to the elder, open Notes, practice & people from All panels, investigate
  the waypost, open World events from All panels, twelve game hours; Save and
  reload (still unread), Mark as read, Save, Export, Import (not replayed), a copy
  with the slice removed (baselines, no replay). Screenshots
  `digest-away-1920x1080.png`, `digest-read-1920x1080.png`.
- `node docs/representations/evidence/time/gallery.cjs`: fixture in Luminous and
  Neutral with its text form, `gallery-return-digest-1920x1080.png`.
- `npm run check:arch`: PASS (main.js growth −48, no new cycle). `npm run check:rules`: PASS (5 existing warnings).
- `npm test` (full, while six sibling suites ran): every failure seen is a 180 s timeout in live-browser `cast_*` integration tests or the two private-folder CLI checks that need the gitignored `docs/research/novels`; none touch these modules.

**AD43 floor**

| Line | State |
|---|---|
| FLR1 Build | Proven on the bundle hash in `evidence/time/result.json`. `dist/` not committed (coordinator rebuilds). |
| FLR2 Route | Fresh life by earned steps in the rebuilt browser; named fixture `time-return-digest`. |
| FLR3 Shown | Heading with the span as a phrase, grouped lines with "when" phrases, Mark as read; unwritable state says why. |
| FLR4 Used | Consumer: the player's Mark as read, which writes the marker the next digest reads; each line is an existing owner's record. |
| FLR5 Kept | Save, reload, Export, Import and a pre-slice save exercised. |
| FLR6 Labelled | Agent-verified, not human-reviewed. Browser route kind. |

**Known limits**

- A fresh life idling in the Village has nothing the digest may show until a
  knowable owner starts (people met, a receipt, the chronicle). That is correct
  under TC11, but it means the first digest needs a step like the waypost.
- `eventFeed` caps Recent news at eight lines, so a very long absence shows the
  newest eight non-person lines; people's memories are not capped.
- The World events module starts closed and the workspace does not reopen it
  after reload; the row is still unread and shows when the panel is opened.
- Person rows do not link to their People entry yet (TC10 asks for it).

**Next slice:** TC12 upcoming strip in the time chip region from `eventFeed`
leads and the pending job list, then the person-row links.
