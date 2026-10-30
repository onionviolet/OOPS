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
- (Round 2) The digest moved to the top of Reports, so the World events module's
  closed-by-default state no longer hides it.
- (Round 2) Person rows now open People (TC20).

**Next slice:** TC12 upcoming strip in the time chip region from `eventFeed`
leads and the pending job list, then the person-row links.

## Round 2 (2026-10-30): references, fresh eyes, Reports shell

Brief: [round 2](../gm/dispatch/ui-refactor-wave-2026-10-29/ROUND2_BRIEF.md) items
1-21. This session owns the Reports panel's overall look (item 14). Everything
here, round 1 included, is a draft and the current best, open to refactor or
replacement with a reason (AD45). Codes TC17 onward.

### How other games do it (item 1)

Claims are from general knowledge of these games (play and public docs), not a
fresh study session; "inferred" marks my reading of why it works.

| Game | What the player sees | Makes easy | Costs | Idea taken |
|---|---|---|---|---|
| Persona 5 | A day page: date, weather, time slot (after school, evening), the calendar flips on a new day; deadlines as "N days left". | Planning by slot; deadline pressure. | Rigid slots; little room for idle time. | **Time as named slots and countdown phrases**, not clocks (TC9, TC12). |
| Stardew Valley | Season calendar with birthdays and festivals; the day-end summary lists what you earned. | Recurring dates at a glance; a ritual end-of-day receipt. | The summary is money-only. | **A day-end receipt grouped by kind**, which the digest generalizes to people (TC3). |
| Majora's Mask | A three-day clock; the Bombers' notebook tracks who is where when and what you learned about them. | Loop worlds: who matters at which hour, and what carries over. | Heavy to author per person. | **Per-person schedule rows that fill as you learn them** (TC5, TC14). |
| Outer Wilds | A loop with a ship log: rumor mode (links between leads) and map mode; the reset keeps only knowledge. | "What did I learn this loop" without a quest list. | Needs knowledge-only progress. | **The log is knowledge, not tasks**: the digest and loop view show what you now know (TC11, TC14). |
| Dwarf Fortress legends | Years of events per figure, site and entity, browsable after the fact. | Emergent history readable as a chronicle. | Raw and dense; little narrative shape. | **Every line belongs to a subject**: group by person and place, link to the subject (TC10, TC20). |
| Idle games (Melvor Idle, Cookie Clicker, Antimatter Dimensions) | An offline-progress popup on return: time away, what you gained, sometimes per skill. | The return moment is satisfying and short. | Usually a modal that blocks; numbers without stories. | **One summary on return, not a modal**, with the time away as a phrase (TC8, TC17). |

Own references first (UR12, UR49): Proto23's message log is the baseline for
the Reports column (compact subject-first lines, kind tags); YAIR upstream logs
by kind with filter buttons. Both are kept; nothing here removes a filter.

### Fresh-player test (item 2)

Opening a fresh life, then twelve hours later, as a first-time player:

- Before this round the digest lived in the World events module, which starts
  closed and closes again on reload. A fresh player would never see it.
  **Fixed (TC17):** it is pinned at the top of Reports, which is on screen in the
  default layout.
- "Mark as read" is clear. "About half a day ago" is clear. "You · 1" is clear
  once lines show under it.
- Terms needing knowledge: none new. The person name is a link only when that
  person is in People (TC20).
- Numbers without meaning: none; the only number is a count beside a name.

### Space, split and density (item 3)

- **Reports (right column)**: the glance. The digest takes at most 40% of the
  column and scrolls inside itself, so the stream keeps its room. Density: one
  heading line, one line per person, the lines indented under them (UR42: looked
  at on every return).
- **World events (center)**: leads and recent news stay there. Split rule: the
  digest answers "what changed while I was gone", World events answers "what can
  I act on"; one question per view.
- **Upcoming strip (TC12, next slice)**: one line in the time chip region; the
  wide week calendar (TC13) only in a center mode or pop-out.

### Bars and small signals (item 4)

The digest needs no bar. The upcoming strip (TC12) will carry a small "time
left" chip per item in words ("about two hours"), with a thin track only when
the job has a known total (reuses `meter_bar.js` via `work_status_view.js`).

### Pop-outs and the desktop app (item 5)

- **Calendar pop-out (LATER):** the week calendar (TC13) is the one view in this
  feature that earns a second screen; it draws into its given node (MDL13) so
  `desktop/popout_host.cjs` can host it, with the browser fallback in-page.
- **Notification (ACCOUNT FOR NOW):** when the app regains focus and the digest
  is visible, the desktop presence can badge the Dock with the line count. No
  sound; the row itself is the content.

### Cheats and insight views (item 6)

A "while you were away" cheat (an all-seeing servant, a status window's log)
adds a **Revealed** group under the digest: lines the player did not witness,
each marked with the cheat's name as source, never mixed into person groups.
It reads from the cheat's declared source, never from the simulation log, and
sealed outcomes appear by ID and status only (UR80). The developer inspector
stays separate.

### Visual style (item 7)

Default: plain indented lists in the theme's body type, which work in Luminous
and Neutral, at 14 px and 21 px, and with effects off (no effect is used). The
gallery shows the alternative **radial "who it came from" figure**
(`time-return-digest`). It reads worse for the digest itself: a list scans
faster than a star for five or fewer groups, and the figure only earns its room
for a long absence with many people. Kept as the gallery form and a possible
"story so far" view (TC4).

### Use what we have (item 8)

`eventFeed` (news, heard, leads), `knownPeopleView` (per-person memories),
`domain_registry` (save slice), `combat_log.addCombatOccurrence` (×N folding,
now reused for all kinds), `figure.js` (gallery form), the Reports filters and
`notice-panel-link`. New code: one adapter, one row, one domain, one key helper.

### Unconventional option (item 9)

**The letter (TC6)**: the digest written as a note from whoever was nearest,
in the world's voice, with the plain list folded under it. Needs a plausible
writer per world and the later local-AI drafting pass. Worth a later slice in
book worlds with servants or roommates; not before prose quality improves.

### Audit gaps (item 10)

- **Lead's run (LTU3):** the digest groups by person, which is LTU3's shape.
  The LOTM be-seat run needs its cast memories to reach `knownPeopleView`;
  until then a Tingen return shows You and Around only. ACCOUNT FOR NOW.
- **Other seats:** the adapter reads only player-knowledge owners; a thin life
  with few known people gets a short digest, which is correct.
- **Empty and error:** no row when nothing is new; unwritable save says why.
- **Performance:** the digest reuses the feed already built per render; it adds
  one `knownPeopleView` call per World events render. Measure if render cost
  shows up.
- **Accessibility:** the row is a labelled section with real buttons; person
  names are buttons with titles; no motion.

### Prior implementations and abstraction (item 11)

The abstraction underneath is a **note** (coverage plan K2): a dated summary of
a stretch, grouped by subject, each line pointing back to its source. The
thematic UI owner's "small contextual bars" section already asks for this kind
of return summary; the digest is its first note. The next note (a journey's
arrival summary, a loop reset) reuses `groupDigest` with different sources.

### Flourish (item 13)

LATER: a one-time soft settle when the digest first appears (the existing
settled-text effect), off under effects off and reduced. No particles: a return
summary is not an event.

### Reports in this feature and the Reports shell (item 14)

ACT NOW, done in this round:

- **TC17. Digest pinned at the top of Reports** (RPT6). Moved from World events;
  the stream below is untouched. Log line not needed: the row was never visible
  to a player in its old home.
- **TC18. Repeated lines fold into ×N** for every kind, not only combat. A line
  that repeats the newest visible line (same kind, same text) adds to its ×N
  with the time of each occurrence; calendar day headers never fold; the
  existing "detailed" repeat setting turns it off. Reuses the combat helper and
  its CSS. (`src/report_repeats.js`, three lines' worth of hook in `display.js`.)
- **TC20. Person rows link to People** (RPT9: the log forgets, the person view
  remembers).

ACCOUNT FOR NOW (proposals for the shell; other sessions propose their lines):

- **TC19. A glyph before the kind label.** The r3 shell already prints the kind
  (Event, Discovery, Loot, Crafting, Combat, World) above each line. A small
  glyph per kind (◆ event, ✦ discovery, ◇ loot, ⚒ crafting, ⚔ combat, ☼ world)
  beside the word, never instead of it (UR37). Level: CSS only, one rule per
  kind; done check: both themes at 14 and 21 px. Deferred because the Luminous
  log rules are dense and another session's freeze fix is in flight nearby.
- **TC21. Band grouping (RPT5).** Lines from one time band fold under a band
  header ("Morning") when more than three arrive together. Needs the day-header
  line to carry the band; level: Sonnet, half a day.
- **TC22. Subject-first rewrite** of the oldest native lines ("You obtained X"
  becomes "X · obtained"), only where the line is ours (RPT3). Level: content
  pass, Sonnet.

### Form per part (item 18)

| Part | Form | Why not the others |
|---|---|---|
| Return digest | Grouped list (subject, then lines) | A ring hides order and scans slower; a table wastes width on few columns. |
| Upcoming strip | One-line chips, soonest first | A calendar is too heavy for three items. |
| Week calendar | Swimlane grid (days × bands) | Rings suit cycles of one day, not a week. |
| Loop reset | Ring with slots (the loop is a cycle) | The one place a circle fits the subject. |
| Life timeline | Horizontal timeline with year ticks | A tree suits lineage, not one life. |

`figure.js` lacks a timeline and swimlane layout; TC4 and TC13 need one. Tell
the coordinator before adding it, since others may add layouts.

### Levels and depth (item 19)

Time has depth as **precision**: "about half a day" at a glance, the exact clock
only where the player has a clock (LSD161). The digest's depth is one click: a
person row opens People with the full memory list.

### Later volumes and worlds (item 17)

Checked against the round-1 sources only: the digest reads owners, not a world,
so a later volume adds people and news rows, not code. Loop worlds (TC14) and
school years need the calendar profile to declare a loop length and a term; that
is a data field on `world_calendar_content.js` profiles. Not checked this round:
private reading notes for later volumes' time skips (open).

### Flair later (item 20)

Marks are named by role (`person`, `you`, `around`, `missed`). A ship-voyage
world might draw the digest as a logbook with a tide line between days; a
school world as a pinned notice board with a note per person. Both restyle the
same groups.

### Open for improvement (item 12)

Known limits: Recent news caps at eight lines; LOTM cast memories do not reach
People yet; the World events module still closes on reload (no longer affects
the digest). Likely next refactor: when a second note exists, move
`groupDigest` into a shared note primitive.

### Round 2 checks

- `node --test tests/return_digest.test.js tests/report_repeats.test.js tests/combat_log.test.js tests/event_feed.test.js`: 19/19 pass.
- `node docs/representations/evidence/time/browser.cjs`: PASS on bundle `2f5dfae1b4f15e64`, 1920×1080, fresh origin; the digest now shows at the top of Reports after twelve hours and again after reload with no panel step; Mark as read, Export, Import and a pre-slice save as in round 1. Screenshot `digest-away-1920x1080.png` replaced.
- TC18 ×N folding: unit-tested (key rules) and built; not yet exercised by a repeated line in the browser (implemented, browser-unexercised).
- TC20 person links: built; the evidence route has no known person with memories, so the link is not exercised in the browser.
- `npm run check:arch`: PASS (display.js 6748, under its 6767 baseline). `npm run check:rules`: PASS.
- Built by: TC18 by a Sonnet subagent (reviewed here); TC17, TC20 and this doc by this session. No other session started.

AD43 floor for round 2: TC17 meets FLR1-FLR6 (agent-verified, not human-reviewed); TC18 and TC20 are implemented, below floor (FLR2 browser route not exercised).
