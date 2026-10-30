# Maps, routes and travel (RPX14)

**Next slice (2026-10-30):** Walks as its own panel with a pop-out (MT2-5). Level and effort: sonnet build, Opus review, medium. Done when: pops out in the desktop shell and falls back to a center view in the browser.

Proposals, 2026-10-30, from the UI overhaul wave (one session per representation).
Applies RPX14 ([UI design audit round 12](../audits/UI_DESIGN_CORE_AUDIT.md)), SUI6 and
SUI13-SUI16 ([UI rules, scene section](../UI_RULES.md)), SR1, SR6-SR9 and SR24
([site and exploration rules](../SITE_AND_EXPLORATION_RULES.md)), MDL2 and UR37. Nothing
here is accepted until Weibao says so (AD32).

## Brief (PRF1-PRF8)

- **Reading.** Show where you can go, and how long it takes, from the place you stand, in the
  place's own panel at 1920×1080. Premises: walks already exist as timed jobs with real
  minutes (district links). In resident lives the host filters places to what this seat knows;
  the classic probationer view lists all four Tingen places, as its Places list already does.
- **Player sentence.** "Walks from the workroom: the lodging is 2 min, the docks 20, the
  university 25. Click one to go to its walk." When a walk cannot run: the place carries a
  `!` mark and the map says why in words.
- **Ordinary route.** Distance is walking time. Exception: a seat that holds a map of the
  area may see places by compass position (MT-D2).
- **Mechanism.** The figure is a read of the panel view; the walk button stays the verb.
- **Fit.** MDL2 figure (`src/ui/figure.js`), the LOTM place panel's places and moves rows,
  `observer_view` seat seam (via the host's own knowledge filter).
- **Ring covered.** Producer (existing host view), consumer (figure, click focuses walk),
  failure (blocked walks, lone place), UI. Persistence: none changed.
- **Screen.** The Tingen place panel's walks block; the figure sits above the walk buttons
  in a disclosure that stays open by default and remembers being closed.

## Representations weighed

| Code | Representation | Strength | Cost or risk | Verdict |
|---|---|---|---|---|
| MT1 | **District figure with exits**: districts as regions laid out by compass, exits as doors, people's usual places as pins | Reads like a map; good for a city you know | Needs coordinates the data does not have. Inventing a city layout breaks SR1 (no invented canon geography) and SR7 (maps are knowledge artifacts, not free truth) | Dial, not default (MT-D2) |
| MT2 | **Walk-time rings around you**: you at the centre, rings step outward by minutes, each known place on its ring with the minutes on the line | Needs no geometry; seat-relative by construction; quotes SUI6 minutes on the drawing itself | Says nothing about direction; two places 20 min away may be on opposite sides of town | **Default** (MT-D1) |
| MT3 | **Route strip**: one walk as a track of stretches, with the people you passed on the way at your witness level | Makes the route a place (SUI15); natural home for "on the way" meetings and follow mode | Needs a source of who crosses the route; nothing feeds it yet | Second view, for a walk under way or a walk being considered (MT-D3) |
| MT4 | **Text-art map**: a monospaced block, places as labelled boxes joined by lines with minutes | Cheap, copyable, effects-proof | Duplicates the figure's own text form; layout problems as MT1 | Not built; the figure's text form ("The map in words") already does this job |
| MT6 | **Other homes**: site rooms and exits (`drainage_site_ui.js` already draws its own room map from `v.map.edges`; `authored_site_ui.js` quotes activity minutes, not travel) and the Village "Move somewhere else" list (`display.js`, native locations, no walk minutes) | One figure for every place surface | Sites have room adjacency, not walking minutes; native travel has no minutes to quote yet | MT-D1 extends to a home only once it quotes travel minutes (SUI6); sites keep their room map, and a later slice can move it onto the MDL2 figure with rings by steps instead of minutes |
| MT5 | **Day threads** (unusual): time across, places down; each known person's day is a thread through the places, and your reachable window is shaded from your walk minutes | Answers "where can I catch her before noon" in one look; makes schedules and travel one picture; the natural planning view for follow mode (SUI16) | Needs schedule rows projected per seat; heavy for a casual glance | Later, for planning and follow mode (MT-D4) |

## Defaults (proposed)

| Code | Default | Dial | In-world reason |
|---|---|---|---|
| MT-D1 | The place panel shows a walk-time ring map (MT2) of known places, with minutes on every line and blocked walks marked in words | A world or seat can hide it (a blind seat, a world without fixed places) or start it closed | You know a place by walking there; minutes are what your feet learned |
| MT-D2 | Places are drawn by walking time, not by guessed compass position | When the seat holds a map artifact covering the area (SR7, SR8), places on that map may take the map's positions, with the map named as the source and its errors kept | A map is something you own, with its maker's mistakes; without one you have only your own walking |
| MT-D3 | A walk in progress or a walk being quoted shows a route strip (MT3): who you passed, as much as you noticed ("someone" when you did not see clearly) | Witness level per seat and per world; a shadowing skill check where it matters (SUI16) | The route is a place too; you notice what your attention allows |
| MT-D4 | Day threads (MT5) open from a person's usual-place line for planning and follow mode | Threads show only the parts of a day this seat knows; the rest stays blank, not guessed | You learn people's habits by watching or being told, not by reading their diary |
| MT-D5 | Unknown places stay off the map, without "?" markers. A lead to a place (SR6) can appear as a "?" node joined by a dashed line with no minutes | A world can show "rumoured" places once a lead exists | Knowing that a place exists is different from knowing the way (SR6) |

Seats see only their own knowledge: the figure draws nothing beyond the host's view. The
knowledge filter is the host's (`book_world_lotm_host.js`, resident lives only; the classic
probationer view lists every Tingen place and the map shows the same set as the Places list).
People are drawn only at places in the view, and
a person whose usual place is unknown is left off rather than placed at "?" (LTU11, SR9).

## Slice: walk map in the Tingen place panel (implemented 2026-10-30)

**UI contract (proposed UR76).** Home: the Tingen place panel (`#lotm_panel`, surface type
place-service, main workspace), in its walks block above the walk buttons. Shape: MDL2
figure inside a disclosure, "Walking map · minutes from here", with "The map in words" as
a second disclosure holding the full text form (UR37). States:

- Normal: "Walks from {place}", one ring per walking time, a line per walk labelled "{n} min".
- Lone place: "You know no other places yet. Places join this map when you learn of them."
- Blocked: the place takes `!` and a line reads "Some walks are blocked now: {reason}".
- People with a known usual place (when the view supplies them): a ☺ node joined to the place
  by a dashed "usually here" line labelled with the time ("mornings").
- People elsewhere: "Off this map: {line}".

Clicking a place focuses that place's walk button, with its minutes and blocked reason in
view; the walk itself stays the existing timed job (SUI14).

## Findings

| Code | Finding | Owner |
|---|---|---|
| MT-F1 | **Every walk in a fresh Tingen probationer life without the private pack fails in the browser** with "Knowledge needs its actual situation context." (`src/causal_situations.js` via the LOTM host walk), before and after reporting in. Reproduced on unchanged master `4a83cac9a` with the map code removed, so not caused by this slice. Lead, not a diagnosis: walk arrival records use `know()` in `book_world_lotm_kit.js`, which cites `I.situation`; that situation begins only at `report_in` (`book_world_lotm_actions.js`), and the browser failure persists after report-in, so something else in the browser state is also missing. Guess: `tests/lotm_districts.test.js` passes because its state differs from the browser start. The map's click lands on the walk button correctly; the walk then fails. | LOTM host owner (`src/book_world_lotm_host.js`, off-limits to this lane) |
| MT-F2 | The host view does not yet carry people's usual places for a seat. The adapter accepts `people` rows and the gallery shows them; the game does not feed them yet. | Next slice, needs a host or cast-host read |
| MT-F3 | `figureText` writes "1 places" for a one-member ring. Shared primitive, not changed here. | Figure owner |
| MT-F4 | `index.html` did not link `styles/figure.css`, so no in-game figure was styled. This lane adds the one link line; sibling lanes need the same line. | Coordinator merge |

## Receipt

Files (all this lane's own unless noted):

- `src/ui/walk_map.js` (new): `walkMapSpec` (view to figure spec), `routeStripSpec`
  (gallery-only proposal), `walkMapBlock` (panel disclosure).
- `src/book_world_lotm_ui.js`: one import, one map-open flag, one call in the walks block.
- `index.html`: one `styles/figure.css` link (shared line, MT-F4).
- `src/ui/preview/fixtures/maps.js` (new) and `src/ui/preview/figure_gallery.js`
  (one import, one spread into the fixture loop).
- `tests/walk_map.test.js` (new), `scripts/playtest/walk-map-probe.mjs` (new).
- Evidence: `docs/representations/evidence/maps/` (`walk-map-1920.png` live panel,
  `walk-map-figure.png`, `walk-map-walk-attempt-1920.png` (walk refused), `walk-map-probe.json`,
  `gallery-*.png`).

Change surface (FND2): no core-owner file, no `main.js` line, no new import cycle.
`dist/bundle.js` is not committed; the coordinator rebuilds after merge.

Checks:

- `node --test tests/walk_map.test.js`: 4 pass (minutes and "current" in the text form,
  rings ordered by minutes, blocked reason in words, unknown person absent, lone and empty
  views draw, click maps to the walk command).
- `node scripts/playtest/walk-map-probe.mjs docs/representations/evidence/maps`: pass on
  bundle `b2dddedfd7fd8ac3` (same as `npm run build` output), 1920×1080, fresh origin, no
  private pack: Village → Tingen probationer start → report in → map shown with text form → clicking the
  25-min place focuses "Walk to … · 25 min" → walk refused by MT-F1.
- Gallery headless capture at 1920×1080: no page errors, both themes.
- `npm run check:arch`: pass (growth 0). `npm run check:rules`: pass, 5 existing warnings.
- `npm test` (once, as committer): 4104 pass, 12 fail, all in cast and lead-run files that
  need the private pack or `docs/research/novels` (absent in this worktree) or time out under
  sibling load. Same failures with this lane's `book_world_lotm_ui.js` change reverted
  (`cast_body_adapter`, `place_acts`: 2 fail either way), so none traces to this slice.

AD43 floor: FLR1 met (bundle `b2dddedfd7fd8ac3`). FLR2 met (fresh life by earned steps,
headless browser; partly met, since the MCP walk was not run: the game MCP serves the primary checkout, not this worktree). FLR3 met (text form, minutes, blocked reason in
words). FLR4 met in part: the click reaches the real walk control, but the walk itself
fails on MT-F1. FLR5 not applicable (no persistence change). FLR6: agent-verified, not
human-reviewed; route kind fresh life, rebuilt headless browser. State: **implemented,
below floor** until MT-F1 is fixed and the walk recentres the map in the probe (the probe
already asserts the recentre once the walk lands).

Next slice: feed people's known usual places (MT-F2) from cast schedules through the host
view, filtered by the seat's knowledge; then the route strip (MT-D3) during a walk, with
"on the way" lines from schedules that cross the route.

## Round 2 (2026-10-30): review against other games, fresh eyes and room

Brief: [round 2](../gm/dispatch/ui-refactor-wave-2026-10-29/ROUND2_BRIEF.md), items 1-21.
Everything here, round 1 included, is a draft and the current best, open to replacement with a
reason (AD45). Codes continue as MT2-*.

### Other games (item 1)

A Sonnet reader summarised these from memory, with no web check this session. "Known" means
recalled from play or docs, not re-verified.

| Game | What it does | Mechanism we take |
|---|---|---|
| Sunless Sea | Sea chart of zones; fuel and supplies tick while you sail (known) | A trip is a priced choice: show what the minutes displace, not only the minutes |
| Disco Elysium | One district as one place with a mood; places open because someone mentioned them (known) | A place joins your list with its source attached ("Mott told you") |
| Caves of Qud | Coarse world map plus a journal of places and what you learned there (known) | The journal is the map's memory: each place carries how and when you learned it |
| Kenshi | Huge map, territory shading, danger learned by walking into it (known) | Route risk as a label from your own last walk ("quiet last time"), never a hidden number |
| Majora's Mask, Bombers' Notebook | Each person's day as entries of place and hour, filled when witnessed (known) | Who-is-where-when as recorded observations, the core of "usually here" |
| Pathologic 2 | Every walk costs the day; people are found at their haunts or not (known) | "Usually here at this hour" with a confidence, so a missed meeting reads as normal |

Our own baselines: the native "Move somewhere else" list (YAIR) is a flat menu without
minutes; the drainage site already draws its own room map. Neither quotes travel time.

### Fresh-player test (item 2)

Opened from a fresh life at 1920×1080 (Village, Tingen probationer, report in). Five-second
read of round 1: the rings look like a map, but nothing says what the rings are until you read
the text form, and the district line under the figure is a wall of names. The walk buttons
sit apart from the map, in per-district disclosures that start closed, so "where can I go" takes
two clicks. Terms a newcomer must know: "district", the church team names, "vouch". Numbers
without meaning: none on the map (every number is minutes), but the rings have no scale label.

### Decisions

| Code | Item | Decision | Why |
|---|---|---|---|
| MT2-1 | 3, 18, 21 | **The default form is a departures board, not the rings.** One row per known place, nearest first: name, a distance meter, minutes, a district and team chip, chips for people usually there, and the walk button with its reason visible when blocked. The ring map moves behind "Show the walking map", closed by default | "Where can I go and how long" is a sorted-list question; a ring shows the same order with less room for words and no buttons. A table with actions first fits better than a circle (item 18) |
| MT2-2 | 4 | Distance meter on each row: a thin bar, share of the farthest known walk, with the minutes in words beside it | Answers "how far compared with the rest" at a glance (UR61); the words carry the fact (UR37) |
| MT2-3 | 18 | Forms by part: board (table) for walking now; rings (figure) for the shape of nearby walks; a positional map (figure, free placement with `at`) only when the seat holds a map (MT-D2); a route strip (track) for a walk under way; swimlanes (places down, hours across) for who is where when (MT5). The ladder alternative (one straight track) is in the gallery and reads worse: `figure.js` tracks count progress ("0 of 5 done"), which a distance scale is not | Each part gets the form of its question; the ladder result is a finding for the figure owner (MT2-F2) |
| MT2-4 | 3, 16 | The board replaces the Tingen panel's "Places" lists and per-district walk disclosures, keeping each walk button's `data-lotm` id, so saved scripts and the floor run still find them | Two views answered one question; merge them (item 3). Panel shell and center density stay with the Worlds lane (item 14) |
| MT2-5 | 5 | Pop-out: a "Walks" panel earns a second-screen pop-out once it is its own panel, showing the board and, beside it, the swimlane of who is where now. No badge or notification by default; a notification only for "the person you are waiting for has arrived" in follow mode | The board is consulted between actions; a second screen keeps it open without covering the work. Arrival is the one event worth an interrupt |
| MT2-6 | 6 | Insight or cheat view: places you have not learned appear as dashed "?" rows marked with the cheat's name (for example "Town sense"), with minutes; people's full schedules fill the swimlane in a cheat colour with the cheat named. Sealed places and sealed people stay out unless the cheat is their discovery route. The developer inspector stays separate | Cheats are features (CS1: knowledge cheats live in records and overlays); the mark keeps earned and granted knowledge apart |
| MT2-7 | 7, 20 | Alternative style in the gallery: the ladder (MT2-3). Semantic roles in specs today: `current` (you), `walk`, `usually here`, `strained` (blocked). Flair later: in a foggy industrial city, gas-lamp halos on lit routes at night and soot-grey for unknown streets; in a cultivation world, routes as qi paths with sect territory as ink washes. Both restyle roles, not the adapter | Item 20: name roles now, motifs later |
| MT2-8 | 9 | Unconventional option: **ask for directions.** No map at all until you own one; you ask a person, and they answer in their words with their errors ("past the fish market, about twenty minutes, mind the dock gate after dusk"). Their answer becomes a board row with the person as source. Worth a later slice: it turns knowledge of places into a social act (SR7, SR8) | Diegetic, and it fits "a place joins with its source" from Disco Elysium |
| MT2-9 | 13 | Flourish: a short settle glow on the row you just arrived at and on a newly learned place, using the existing glow tokens and the `fig-fx--glow` class; off under effects off and reduced | A real event, bound to its subject (UR38, UR62) |
| MT2-10 | 14 | Reports lines for travel, proposed: "Walked to {place} · {n} min", grouped as "3 walks · 47 min" when repeated, the place name linking to its board row; an "on the way" line names who you passed at your witness level. The Reports shell stays with the Time lane | Subject first, repeats grouped (RPT1-RPT12) |
| MT2-11 | 17 | Later volumes and worlds: the board and rings read rows, so a later city adds places and a minutes table, not code. Checked: the reading status and other-books readiness notes carry no travel-specific rows yet. Open needs: more cities joined by journeys of hours or days (the existing Journeys block quotes route text, and belongs on the board as a second section "Farther"), districts by the dozen (group rows by district with the nearest group open), travel by vehicle (a mode column: walk, cab, train, with cost), and places that are not on a street (dream or spirit places reached by a method, shown as a row whose cost is the method, not minutes) | The board scales by rows and groups; the rings do not past about twenty places |
| MT2-12 | 19 | Depth: a place's depth is how well you know it (heard of, found the way, visited, know its hours, know who is there when). The glance shows only minutes and chips; the row opens to that ladder and its sources | Levels beyond "known or not", one click deep (UR42) |

### Audit gaps (item 10)

- Lead run and other seats: the board reads the host view, so resident and classic lives both
  get it; a thin life with one known place gets the empty line. Seat knowledge comes from the
  host's filter, resident lives only (round 1 note).
- Empty and error states: lone place, all walks blocked (each row shows its reason; when every
  row shares one reason this repeats, so a later pass can lift it to one line).
- Persistence: none; the map's open state is panel memory only.
- Performance: the board is one list item per place, rebuilt only on the panel's signature
  change; the figure stays closed until asked for, so its SVG is built only when opened (MT2-F3).
- Accessibility: walk buttons are real buttons in reading order; blocked reasons are visible
  text; the map keeps its text form.

### ACT NOW (done this round)

- MT2-1, MT2-2, MT2-4: `src/ui/walk_board.js` (built by a Sonnet subagent to an exact spec,
  reviewed and adjusted here) with `styles/walk_board.css`; the Tingen panel's walks block now
  shows the board, and the walking map opens from "Show the walking map" (closed by default).
  Walks with no listed place keep a plain button row.
- MT2-3, MT2-7: `walkLadderSpec` in `src/ui/walk_map.js` and the ladder gallery fixture.
- Fresh-player fixes: walks are one click away in reading order, nearest first, each with its
  minutes, district and team on the row; no closed disclosure in the way.

### ACCOUNT FOR NOW

- Keep `data-lotm` ids on walk buttons; floor and replay scripts click them.
- Keep the rings' spec roles stable (MT2-7) so a motif pack can restyle them.

### LATER / DELEGATE

| Item | Level | Effort | Done check |
|---|---|---|---|
| Walks as its own panel with a pop-out (MT2-5) | Sonnet build, Opus review | Medium: panel registration through the domain registry, one `main.js`-neutral line | Pops out in the desktop shell and falls back to a center view in the browser |
| Swimlane layout in `figure.js` for who is where when (MT2-3, MT5) | Sonnet build, coordinator merge (shared file) | Medium | A generic swimlane spec with a test and a gallery fixture; two consumers named (maps, time) |
| Ask for directions (MT2-8) | Opus design | Medium | One person answers with an error that the walk later corrects, recorded with its source |
| Settle glow on arrival and on a newly learned row (MT2-9) | Sonnet build | Small, once walks land (MT-F1) | Glow shows on the arrived row and is absent under effects off |
| Insight view (MT2-6) | Sonnet build | Small once a cheat exists | A cheat-marked "?" row appears and a sealed place does not |
| Group rows by district and a "Farther" journeys section (MT2-11) | Sonnet build | Small | A resident life with more than 12 places shows groups, nearest open |

### Round 2 findings

| Code | Finding | Owner |
|---|---|---|
| MT2-F1 | MT-F1 still blocks every walk; sent to the coordinator with the exact error and the probe command | LOTM host |
| MT2-F2 | `figure.js` tracks always count progress ("0 of 5 done"), so a scale or ladder that is not progress reads wrong. A `progress: false` track option would fix it for every session | Figure owner (shared file) |
| MT2-F3 | The walking map's SVG is built only while it is shown, so a closed map costs nothing per render | This lane, done |

### Round 2 receipt

Files: `src/ui/walk_board.js`, `styles/walk_board.css`, `tests/walk_board.test.js` (new);
`src/ui/walk_map.js` (ladder spec); `src/ui/preview/fixtures/maps.js` (ladder fixture);
`src/book_world_lotm_ui.js` (board replaces the Places lists and district walk disclosures);
`index.html` (one `walk_board.css` link); `scripts/playtest/walk-map-probe.mjs` (board checks);
evidence in `docs/representations/evidence/maps/` (`walk-board.png`, `gallery-walk-ladder.png`,
refreshed live captures and probe JSON).

Checks:

- `node --test tests/walk_board.test.js tests/walk_map.test.js`: 11 pass.
- `node scripts/playtest/walk-map-probe.mjs docs/representations/evidence/maps`: pass on bundle
  `f5cf867cb33cc2f2`, 1920×1080, fresh origin: report in → board shown nearest first, district
  disclosures gone → map opens from the board → a map click focuses that place's board row →
  walk refused by MT-F1.
- Focused set per AD36 (tests importing changed files): `node --test tests/walk_board.test.js tests/walk_map.test.js tests/observer_view.test.js tests/perspective_controls.test.js tests/lotm_cast_week.test.js tests/figure.test.js`: 42 pass, 0 fail. `npm run check:arch`: pass, growth 0. Full suite not run at the coordinator's request (machine load); `tests/cast_ability_adapter.test.js` also imports the panel and timed out before this change (round 1).
- Gallery capture at 1920×1080, both themes: no page errors.
- Not checked: 21 px text and effects off on the live board (the board has no effects; 21 px
  is a known gap for the next capture).

Floor (AD43): unchanged from round 1, implemented, below floor until MT-F1 lands.
Agent-verified, not human-reviewed.

## Travel pacing (proposals, 2026-10-30)

Direction: Weibao, recorded in USER_VISION, "Travel time matters but does not decide the
quality of play (2026-10-30)". Travel time is a real factor and may gate some things through
travel windows, but by default it does not make play much better or worse. Each line below is a
default, a dial and an in-world reason.

| Code | Default | Dial | Reason |
|---|---|---|---|
| TP1 | **Dead time is the enemy, not distance.** A routine walk compresses to one montage line in Reports ("Walked to the docks · 20 min") with the real minutes still quoted and spent (SUI14). A walk can carry work: reading a held note, an inference, talking with a companion, the "on the way" meetings (SUI15) | How much work fits a walk depends on the means (you cannot read while rowing) and the seat's skills | You think, read and chat while you walk; only the clock moves |
| TP2 | **Means trade time for cost, and are earned.** Walk (free, slow), cab or carriage (coin, faster, a driver who sees where you went), a learned movement ability (its own cost and risk), a contact who carries word so you need not go. Each works by its mechanism (AD38); the board's row shows each means you actually have, with its minutes and cost | The world's transport and the seat's money, abilities and contacts | Faster travel exists in the world; you get it by paying, learning or knowing someone, not from a menu |
| TP3 | **A missed window has an aftermath.** The scene settles without you, you learn what happened at your witness level (SUI7, RPT2), and where the world allows there is a later way back in (a second chance, a hearsay lead, an apology) | Loop and deadline worlds can make a window final, with their reason | The world does not wait, but people still talk about what happened |
| TP4 | **Planning helps.** "Go when ready" leaves at the right minute for a known appointment, and the board shows the next firm clock beside its travel time ("Docks · 20 min · shift ends in 35 min", LTU2), so arriving late is a choice, not a surprise | Off for players who want to manage every step | You know how long the walk takes; a sensible person sets off in time |
| TP5 | **Windows are wide by default** (the lead-life timing rule: events, order and windows). A loop or deadline world narrows them with its in-world reason | Per world, per scene | Most of life tolerates being a little late |
| TP6 | **Idle play keeps travelling.** A walk under way continues while you are away, and the return digest says where you are now and who you passed | The Time lane's digest owns the shell | The clock keeps running; the digest is the walk's montage |
| TP7 | **Measure it.** In a fixed-seed run, compare two lives that differ only in a near or far lodging; a large gap in what the player can reach in a week is a calibration signal for minutes or window widths | The size of the acceptable gap is a tuned number | Travel should shape days, not decide outcomes |

Folded into this slice: TP1's quoted minutes on every board row and button, and TP4's groundwork
(the board is where the next firm clock will sit). LATER, with done checks:

| Item | Level | Effort | Done check |
|---|---|---|---|
| TP1 montage Reports line and walk-time work | Sonnet build after MT-F1 | Small | A walk writes one grouped line; a held note can be read during the walk and the walk's minutes are spent once |
| TP2 means column on the board | Sonnet build, Opus review of costs | Medium | A cab row shows coin and fewer minutes only when the seat can afford and reach a cab |
| TP3 missed-window aftermath | Opus design with the scene lane | Medium | Arriving after a window shows what happened, at witness level, and one route back in |
| TP4 "go when ready" and next firm clock on the row | Sonnet build | Small | The university row shows the gatehouse shift end next to 25 min; "go when ready" leaves in time |
| TP7 near/far lodging measurement | Sonnet, headless bot | Small | Two fixed-seed runs reported side by side with the reachable-scene counts |

## Data source and switch-over to the region kit (2026-10-30)

The coordinator assigned the travel model to the sonnet wave's L11 lane ("Second city and the
road": region kit and travel legs, `known_routes.js` and region pack files; PLAN row in
`docs/gm/dispatch/sonnet-wave-2026-10-30/PLAN.md`). The board and the walking map are readers
and keep no travel model of their own. When this was written, L11's design note was not yet in
that folder, so the field names below are this lane's request, not L11's decision.

- **Today:** `walkMapSpec` and `walkBoard` read the place panel's view: `places` (place,
  district, team, here, minutes) and `moves` (id, label, eligible, reasons). Moves are matched
  to places by the label prefix `Walk to {place} · `. That match is the fragile seam.
- **Switch point:** once L11 projects legs into the host view, both readers take
  `legs: [{to, minutes, means, cost?, moveId, eligible, reasons, window?}]` and drop the label
  match. `means` feeds the board's means column (TP2), `window` feeds the next firm clock (TP4),
  and legs to another city fill the "Farther" section (MT2-11). Places with no leg stay as
  rows with no button.
- **Unchanged by the switch:** seat filtering stays in the host projection; ring and board
  layout, text form, roles and `data-lotm` button ids stay as they are.
- **Done check for the switch:** `tests/walk_board.test.js` and `tests/walk_map.test.js` run
  on a legs-shaped fixture, and the label-prefix match is deleted.

## Integration note (2026-10-30, merge)

- **Window shape confirmed (bridge gap G6).** A leg's `window` is `{hours: [open, close], text, waitMinutes}`, exactly what `legsFromRoute` emits. The board shows `Open {text}` and the wait when `waitMinutes` is above zero.
- **Legs replace the label match.** `walk_board.js` and `walk_map.js` read `view.legs` (`{to, minutes, moveId, eligible, reasons, window?}`) and parse no label. The Tingen host has no route row, so `legsFromMoves` in `src/read_models/travel_legs_bridge.js` builds the legs from `move.to` when present and from the `Walk to {place} · ` label otherwise. That fallback is the only remaining label read; delete it when `book_world_lotm_host.js` puts `to` on its moves (owner: the LOTM absorption session).
