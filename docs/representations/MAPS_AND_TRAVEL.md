# Maps, routes and travel (RPX14)

Proposals, 2026-10-30, from the UI overhaul wave (one session per representation).
Applies RPX14 ([UI design audit round 12](../audits/UI_DESIGN_CORE_AUDIT.md)), SUI6 and
SUI13-SUI16 ([UI rules, scene section](../UI_RULES.md)), SR1, SR6-SR9 and SR24
([site and exploration rules](../SITE_AND_EXPLORATION_RULES.md)), MDL2 and UR37. Nothing
here is accepted until Weibao says so (AD32).

## Brief (PRF1-PRF8)

- **Reading.** Show where you can go, and how long it takes, from the place you stand, in the
  place's own panel at 1920×1080. Premises: walks already exist as timed jobs with real
  minutes (district links), and the host already projects only the places this seat knows.
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
| MT5 | **Day threads** (unusual): time across, places down; each known person's day is a thread through the places, and your reachable window is shaded from your walk minutes | Answers "where can I catch her before noon" in one look; makes schedules and travel one picture; the natural planning view for follow mode (SUI16) | Needs schedule rows projected per seat; heavy for a casual glance | Later, for planning and follow mode (MT-D4) |

## Defaults (proposed)

| Code | Default | Dial | In-world reason |
|---|---|---|---|
| MT-D1 | The place panel shows a walk-time ring map (MT2) of known places, with minutes on every line and blocked walks marked in words | A world or seat can hide it (a blind seat, a world without fixed places) or start it closed | You know a place by walking there; minutes are what your feet learned |
| MT-D2 | Places are drawn by walking time, not by guessed compass position | When the seat holds a map artifact covering the area (SR7, SR8), places on that map may take the map's positions, with the map named as the source and its errors kept | A map is something you own, with its maker's mistakes; without one you have only your own walking |
| MT-D3 | A walk in progress or a walk being quoted shows a route strip (MT3): who you passed, as much as you noticed ("someone" when you did not see clearly) | Witness level per seat and per world; a shadowing skill check where it matters (SUI16) | The route is a place too; you notice what your attention allows |
| MT-D4 | Day threads (MT5) open from a person's usual-place line for planning and follow mode | Threads show only the parts of a day this seat knows; the rest stays blank, not guessed | You learn people's habits by watching or being told, not by reading their diary |
| MT-D5 | Unknown places stay off the map, without "?" markers. A lead to a place (SR6) can appear as a "?" node joined by a dashed line with no minutes | A world can show "rumoured" places once a lead exists | Knowing that a place exists is different from knowing the way (SR6) |

Seats see only their own knowledge: the figure is built from the host's view, which already
filters places to what this seat knows; people are drawn only at places the seat knows, and
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
| MT-F1 | **Every walk in a fresh Tingen probationer life fails in the browser** with "Knowledge needs its actual situation context." (`src/causal_situations.js` via the LOTM host walk). Reproduced on unchanged master `4a83cac9a` with the map code removed, so not caused by this slice; `tests/lotm_districts.test.js` passes because its state lacks whatever knowledge row the browser start writes. The walk map's click lands on the walk button correctly; the walk then fails. | LOTM host owner (`src/book_world_lotm_host.js`, off-limits to this lane) |
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
  `walk-map-figure.png`, `walk-map-after-walk-1920.png`, `walk-map-probe.json`,
  `gallery-*.png`).

Change surface (FND2): no core-owner file, no `main.js` line, no new import cycle.
`dist/bundle.js` is not committed; the coordinator rebuilds after merge.

Checks:

- `node --test tests/walk_map.test.js`: 4 pass (minutes and "current" in the text form,
  rings ordered by minutes, blocked reason in words, unknown person absent, lone and empty
  views draw, click maps to the walk command).
- `node scripts/playtest/walk-map-probe.mjs docs/representations/evidence/maps`: pass on
  bundle `b2dddedfd7fd8ac3` (same as `npm run build` output), 1920×1080, fresh origin, no
  private pack: Village → Tingen probationer start → map shown with text form → clicking the
  25-min place focuses "Walk to … · 25 min" → walk refused by MT-F1.
- Gallery headless capture at 1920×1080: no page errors, both themes.
- `npm run check:arch`: pass (growth 0). `npm run check:rules`: pass, 5 existing warnings.
- `npm test` (once, as committer): 4104 pass, 12 fail, all in cast and lead-run files that
  need the private pack or `docs/research/novels` (absent in this worktree) or time out under
  sibling load. Same failures with this lane's `book_world_lotm_ui.js` change reverted
  (`cast_body_adapter`, `place_acts`: 2 fail either way), so none traces to this slice.

AD43 floor: FLR1 met (bundle `b2dddedfd7fd8ac3`). FLR2 met (fresh life by earned steps,
headless browser; MCP walk not run). FLR3 met (text form, minutes, blocked reason in
words). FLR4 met in part: the click reaches the real walk control, but the walk itself
fails on MT-F1. FLR5 not applicable (no persistence change). FLR6: agent-verified, not
human-reviewed; route kind fresh life, rebuilt headless browser. State: **implemented,
below floor** until MT-F1 is fixed and the walk recentres the map in the probe (the probe
already asserts the recentre once the walk lands).

Next slice: feed people's known usual places (MT-F2) from cast schedules through the host
view, filtered by the seat's knowledge; then the route strip (MT-D3) during a walk, with
"on the way" lines from schedules that cross the route.
