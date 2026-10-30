# Representing time travel, branches, spacetime and abstract spaces

Status: proposals (AD32), every choice a draft open to replacement with a reason (AD45). Branch `claude/rep-spacetime-466c46`.
Target viewport 1920×1080 desktop, Luminous Gothic default, Neutral checked. Mobile deferred. Codes: UR6, UR37, UR42, UR61, LTU10, WER, CLR3.

## What exists (read before building)

- **Continuing connection** (`src/continuation_ui.js`, `src/continuation_state.js`): one `continuation` envelope per save. It holds `lives` (each with `initial`, optional `checkpoint`, `paused` snapshot, `tether`), `memories`, `mastery`, `loop {enabled,target,cycles}`, `challenge`, `challengeHistory`, `baggage`. Panel tabs were Return, Anchors & study, Learning; all text and buttons.
- **Remembered years** (`src/life_record_ui.js`): the life record's milestones by year.
- **"Branches"**: no surface by that name exists on this branch. The nearest are the paused lives and the Return tab's "Resume ..." buttons. This doc treats "branches" as paused lives joined by routes.
- **Rewinds keep no history.** A rewind restores a snapshot and drops the future it left ("That point is in an abandoned future"). The save has no record of abandoned branches, so no view can draw them truthfully. Recording them is a schema change (LATER, below).
- **Divergence from canon (LTU10)**: no data yet. Design only.
- Siblings: time owns loop calendars and the return digest (`claude/rep-time-8afe25`); worlds owns crossings and the carry list (`claude/rep-worlds-173cee`, `src/ui/crossing_threshold.js`); knowledge owns dreams, lenses and the certainty grammar (known / guessed / open). This doc reuses and defers to them.

## Round 1: forms weighed per part

Reference works, with what each does well and the idea worth adapting (known from play or docs unless marked inferred).

| Work | What the player sees | Idea to adapt |
| --- | --- | --- |
| Outer Wilds ship log, Majora's Mask | Loop is silent; the log is a rumour graph that fills with what you learned | Carry-over is knowledge, shown as a graph that only grows |
| Zero Escape, Steins;Gate flowcharts | A branch chart of choices and endings, with locked nodes | Lives as nodes, locked or unreachable ones marked in words |
| Braid, Life is Strange | Rewind as a verb; consequences stay | Say plainly what the rewind keeps and what the world forgets |
| The Forgotten City, Hades runs | Loop resets world, keeps knowledge and meta upgrades | A "what you carry" line on every return button |
| Control (Oldest House), Disco Elysium thought space, Kentucky Route Zero | A place that is a graph of ideas, not a floor plan | Rooms as things known, doors as how one thing recalls another |
| Dwarf Fortress legends (inferred) | Times as a long ledger | Remembered years stay the ledger; lives link into it |

Forms weighed and picked per part:

| Part | Forms considered | Pick | Why |
| --- | --- | --- | --- |
| Lives and rewinds | Branch tree; braided swimlanes; spiral; palimpsest | **Hub-and-spoke graph of lives, plus one return-point track per life** | The data is a few lives joined by routes, not a tree of abandoned futures. Swimlanes need dated events per life the save does not hold. |
| Loops | Spiral with carry-over; ring of cycles | **Ring of cycles around a day ring, a track of what you carry** | A loop is cyclic and short; a ring is the one honest place for a circle here. |
| Divergence from canon | Ledger; overlaid timeline | **Two aligned tracks (the book, your run)** | One glance shows the first differing step. Opt-in behind the canon overlay (SUI4), off by default. |
| Eras and other times | Calendar band; palimpsest | **Palimpsest, later**: one place with its versions listed by era | Needs per-place history (time session's calendar). Not built. |
| Between worlds as spacetime | Route map; carry list | **Defer to the worlds session's crossing carry list**; a lives edge can cross worlds later | Reuse, do not duplicate. |
| Abstract spaces | Graph with no geography; map with fake coordinates | **Graph, rooms as things known, edges as kinds of recall**, nodes discovered only when linked | Fake geography would lie. A graph says "reachable from", which is all the player can know. |
| Unconventional | Diegetic: the world itself shows how many times it has reset | **Residue**: objects the player left in earlier loops appear worn or moved. Needs per-loop world deltas; later. | Teaches the loop through the world, not a panel. |

**Character remembers versus player knows.** The panel states what the *character* keeps (memories, compatible mastery, connection upgrades) and what the world forgets (body, stock, doors). The player's own notes persist outside the figure; the figure never reveals a fact the character has not learned (guessed and open states from the knowledge session apply). A thin seat (less knowledge) draws fewer nodes, never placeholder lives.

**Seat limits.** The adapter takes `continuationView`, which already is the player's own journey; no lead-identity read (the observer seam test still passes). Dreams and spirit places use the knowledge session's lenses for what the seat may see.

**Fresh-player legibility of abstract spaces.** Title says "abstract space" and "No map". A legend names each edge kind in plain words ("one thing recalls another", "needs something you lack"). Only entered or told-about rooms draw. Every figure has the text form beside it.

**Sealed places.** Drawn by ID only ("Sealed room (S-11)"), state `unknown`; the lock edge names what is lacking, never what is inside.

**Later volumes and worlds (item 17).** Nothing here names a world. The lives adapter reads the generic envelope; a new world adds lives, not code. Loop worlds from the readiness doc plug into the loop figure as data (cycle count, days per cycle, carried items). Abstract spaces use the same node/edge spec; a world picks its edge kinds. Width is capped (8 lives drawn, 4 tracks) with a "more not drawn" line.

## Slice built

- `src/ui/lives_figure.js`: pure `livesFigure(view)` and `livesFromView(continuationView)`; no save change.
- A **Lives** tab on the Continuing connection panel (`src/continuation_ui.js`), first in the strip; draws through `renderFigure`. `continuationView` gains one read-only field `activeId`. `index.html` links `styles/figure.css` (same byte-identical line the siblings add).
- Gallery fixtures `src/ui/preview/fixtures/spacetime.js` (one import line in `figure_gallery.js`): lives tree (through the adapter), loop, divergence ledger (design only), memory palace (abstract space).
- Tests: `tests/lives_figure.test.js` (6) with `figure.test.js`, `observer_view.test.js`, `continuation_state.test.js`.
- Evidence: `docs/representations/evidence/spacetime/*.png` (1920×1080, Luminous and Neutral side by side, effects full and off; `scripts/capture_spacetime_gallery.mjs`).
- **Verification state:** gallery rendering exercised in headless Chrome, 0 page errors. The Lives tab inside the live game is implemented and unit-covered but **not exercised in a rebuilt game**; it needs an enrolled continuation (fresh life: Journal undiscovered until the elder, then the enroll button). Implemented-unverified.

## Round 2

Items 1-21, short. Everything is a draft.

1. **Other games**: table above. Each idea maps to a part; nothing copies a look.
2. **Fresh-player test (from the fixture, not a live game)**: five-second read is "four lives, I'm in number 2, 4 has no way back". Terms needing knowing: "return point", "route", "isolated challenge". The legend defines route, and the track says Start, Later point, Now. Cheap fix applied: dropped the overlapping "both ways" edge label. Not fixed: the panel still starts on Anchors & study; proposing Lives as default (ACCOUNT FOR NOW, changes the tab existing browser scripts click).
3. **Density (UR42)**: glance is the node row plus the "you remember" line; the per-life tracks are second level; the old Return buttons stay one tab away.
4. **Signals**: a loop chip "cycle 6" and a "paused lives: 3" chip fit the panel's home card (`#continuation_panel`). Each answers "can I go back, and where". LATER.
5. **Pop-out**: a lives view on a second screen earns it for loop worlds (watch cycles while playing). Proposal; browser fallback is the same renderer.
6. **Cheat view**: a revealed view could add the abandoned futures and every checkpoint, marked cheat-sourced. No data today, so none built.
7. **Style**: palimpsest (stacked translucent layers per era) tried on paper only; it needs per-place history. Graph reads better for what we hold today.
8. **Use what we have**: figure, text form, `continuationView`, knowledge certainty words. Two consumers for the node/edge-with-track shape: lives and palace.
9. **Unconventional**: residue (see table). Needs per-loop world deltas; worth a later slice for loop worlds only.
10. **Audit gaps**: no abandoned-branch record; challenge runs hide the Lives tab (the panel returns early); no fixture for a travel-only world's single life beyond the empty state; cross-world lives (Tingen) draw as ordinary lives with no world label; keyboard/focus not tested on the new tab; 21 px not checked.
11. **Abstraction**: a *ledger of states over time* (lives track, divergence) and a *graph of reachable things* (lives, palace). Future time features reuse these two.
12. **Open for improvement**: hub layout does not scale past about 8 lives; next refactor is a layered layout once branches are recorded.
13. **Flourish**: the active life glows; effects off keeps every fact (captured). A settle pulse on the node when a rewind completes is proposed, bound to the settled subject (UR38).
14. **Reports and center**: Reports lines (time session owns the shell): "Returned to the Y1 9/20 point, kept 14 memories". Center: Lives first, buttons second.
15. Ability flourish: n/a.
16. **Folding in**: the Lives tab folds into the existing panel; no new surface. Remembered years could link each milestone to its life node (LATER; link, do not copy).
17. Later volumes: covered above.
18. Forms: chosen per part above; only the loop uses a circle.
19. **Depth**: a life's depth is its track (start, later point, now). Next: what each return point costs and carries, from the existing `effect` text.
20. **Roles, not looks**: `current`, `paused`, `route`, `shelved parent`, `seal`, `recall`. Flair in two worlds: a clockwork town (tick marks on the cycle ring), a dream-realm (ink bleed on room edges), both through a motif pack, no change to specs.
21. **Restructure over decoration**: if branches get recorded, replace the hub with a layered branch chart; keep the text form.

### ACT NOW (done)
Lives adapter and tab, four fixtures, tests, evidence.

### ACCOUNT FOR NOW
- Lives as default tab; check `scripts/continuation_*browser.mjs` clicks first (low effort).
- Exercise the tab in a rebuilt game from a continuation fixture (medium).
- Add a shared `guessed` figure state (coordinator; knowledge and family sessions asked for it).

### LATER / DELEGATE
- Record abandoned branches: bump `CONTINUATION_SCHEMA`, migration, then a layered chart (high, Opus design).
- Loop residue and per-loop world deltas (high).
- Divergence data (LTU10) from the canon run records (medium, after the canon overlay).
- Pop-out for loop worlds (low, Sonnet).
