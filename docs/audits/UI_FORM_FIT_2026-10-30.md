# UI form fit: is the web the right shape? (2026-10-30)

Lane `bk-forms` of the [book UI wave](../gm/dispatch/book-ui-wave-2026-10-30/PLAN.md), round 8. Everything here is a proposal (AD32). It applies AD46 (each world and each subject gets the form that fits it) and AD45 (old forms stay reachable until Weibao has seen both).

Weibao: "alot of stuff just turned into webs for representaiton, are those even the most effective? can we be more nuanced? hovering, other stuff, and more?"

## Short answer

- **A web suits the question "what is this thing connected to, in words I can read at once?" when the lines carry labels, and little else.** Where the edges are labelled (people web, walk map, family tree) the plain figure answered most questions by eye (people web 0 steps, walk map 0, family tree 1 of 2 questions). Where edges are unlabelled (knowledge board, study map, fight ring) every answer needed a hover or click in every form.
- **A table with an inspector halves the reading load.** First-paint words on the same data: figure about 126, table about 66, matrix about 80, sentences about 110 (measured, mean over 7 fixtures). The table needs one click per source to reach links, the same as a hover card.
- **The matrix cost the most steps, or tied for most, on all 16 questions** (33 against 17 for the table, among the figure, table and matrix). Default: offer it only for pairwise questions ("who knows whom"), as an alternate.
- **No measured gain justifies replacing a figure with a table or matrix.** The big form wins already landed on master from other lanes (body by part table, fight versus row, departures board, home chips). So this lane ships the interaction layer and a form switch, and replaces nothing (task 5 allowed "at most two where the gain is large"; none qualified).

## 1. Inventory

Live views that draw through `src/ui/figure.js` (`renderFigure`), at master `b16beea7b` plus the lanes merged since:

| View | File | Figure shape | Questions the player brings (source: `docs/representations/`) |
|---|---|---|---|
| People web (disclosure) | `people_ui.js` | radial web, 2 rings | who is close, who owes whom, who saw what I did (RELATIONSHIP_WEB, stated) |
| Family tree | `family_tree_panel.js` | pedigree rows | who inherits, whose child is this, which lives in the line (FAMILY_TREE, inferred) |
| Knowledge board (toggle) | `knowledge_home.js` | node board, `supports` edges | what do I know and how, what is open, what led to what (KNOWLEDGE, stated) |
| Study map and ladder | `research_home.js` | dependency map plus level track | where am I, what is left, what does finishing open (RESEARCH, stated) |
| Lives figure | `continuation_ui.js` | tree plus tracks | which life am I in, which can I return to (SPACETIME, inferred) |
| Talk rapport | `ui/talk_view.js` | four-stop track | how is this person changing toward me (TALK, stated) |
| Walk map | `ui/walk_map.js` | rings plus places | how long to each place, who is usually there (MAPS_AND_TRAVEL, stated; the board table is the default) |
| Home strip | `ui/home_view.js` | track (COV4 moved it to chips on master) | which rooms, what upkeep (HOMES, stated) |
| Body milestones | `ui/body_view.js` | track; the radial map was replaced by body by part | where does harm sit, how long to recover (BODY_AND_CONDITIONS, stated) |
| LOTM circle, making, ladder | `book_world_lotm_ui.js` | ritual ring, tracks | which condition is missing, where does the brew stand (RITUALS_AND_MAKING, stated). Owned by `floor-wire`; not touched |

Not drawn views, so not counted as 13 webs: `combat_situation_ui.js` calls only `figureText` (the fight card's drawing is the versus row; `ui/combat_versus.js` imports only the state marks), `read_models/talk_bridge.js` and `ui/combat_situation.js` build specs, `return_digest.js` mentions figure.js in a comment, and the gallery and style guide are previews. Several of the "web" views were already reworked on master in round 2 (body, fight, departures board, home strip, family fan alternative).

Other ring or web views not on `figure.js` are outside this lane.

## 2. Measurement

Method (scripted, `scripts/form_fit_measure.mjs`, 1920x1080, effects off, headless Chrome, 7 gallery fixtures, 16 questions, 40 facts):

- A fact counts as seen when one visible element holds all of its fragments (for a relation, both ends or the answer word plus its owner). Steps are the hovers and clicks the minimal scripted path needs. Words are the words in the elements that held the facts, and on the first paint.
- **Route kind: gallery fixtures, not live game routes (FLR2).** Fresh-player timing was not measured. "Steps" and "words" are structural proxies for effort: **measured as proxies, inferred as to what a person would feel.** The plain-figure column also assumes a native tooltip costs one hover and lets the eye trace a line for free; that is inferred and flatters the plain figure.
- Evidence: `docs/audits/evidence/form-fit-2026-10-30/measure.json`.

Steps for all questions in the view / mean words in the answering element / mean first-paint words:

| View (fixture) | Qs | Plain figure | Figure + interaction | Table + inspector | Matrix | Sentences |
|---|---|---|---|---|---|---|
| People web | 3 | 0 / 7 / 133 | 6 / 59 / 160 | 6 / 36 / 57 | 6 / 37 / 56 | 0 / 40 / 165 |
| Knowledge board | 2 | 2 / 6 / 91 | 2 / 23 / 118 | 2 / 23 / 117 | 3 / 25 / 166 | 0 / 25 / 173 |
| Study map | 3 | 3 / 6 / 55 | 3 / 17 / 82 | 3 / 17 / 61 | 5 / 16 / 78 | 0 / 17 / 94 |
| Family tree | 2 | 1 / 5 / 112 | 2 / 12 / 139 | 2 / 12 / 61 | 4 / 14 / 90 | 0 / 14 / 126 |
| Walk map | 2 | 0 / 9 / 79 | 2 / 15 / 106 | 1 / 14 / 53 | 6 / 21 / 54 | 0 / 27 / 80 |
| Fight ring | 2 | 1 / 9 / 163 | 1 / 12 / 190 | 1 / 13 / 62 | 3 / 18 / 66 | 0 / 28 / 79 |
| Making flow | 2 | 1 / 4 / 63 | 2 / 11 / 90 | 2 / 11 / 51 | 6 / 8 / 50 | 0 / 9 / 55 |
| **All 16 Qs** | | 8 (15 facts eye-traced) | 18 | 17 | 33 | 0 |

What it says:

- F1 (measured). The plain figure reaches its answers at 0 steps through edge labels, by the eye following the line to the right person; that was 15 of the 40 facts, mostly in the people web, walk map and family tree. Where labels are absent, the plain figure needs a hover in every case.
- F2 (measured). The interaction layer costs more steps than the plain figure in the table because the plain column assumes eye-tracing is free; it buys a card that names the whole neighbourhood in words (one hover per person, not per line) and makes the answer readable without tracing. This is its job: accuracy of the answer, not fewer clicks.
- F3 (measured). The table halves the first-paint text. It is a good form when the question is a list or a sort ("who has the most links", "which are guessed"). It shows shape poorly.
- F4 (measured). The matrix needs a click per marked cell; a row with four links cost four steps. It answers "is there a link between A and B" well and little else.
- F5 (measured). Sentences read at 0 steps but at 1.5 to 3 times the words of the table's answer on 6 of 7 views. Default role: the text form and screen readers.
- F6 (inferred). Walk times, family heirs and the fight ring's "who is striking me" are answered best by the existing non-web defaults (departures board, "Who would inherit" first, versus row). The figures behind them are the alternates.
- F7 (inferred). A dependency chain such as the study map is a layered left-to-right DAG, not a web; the labelled-edge advantage disappears there. It waits on the generic graph layout `rep-abilities` is adding to `figure.js`.

## 3. Verdicts per view (proposal)

| View | Verdict | Reason and evidence |
|---|---|---|
| People web | **Keep plus interaction; Table and Matrix as alternates** (shipped, old figure first) | Labelled edges make the figure the fastest reader (F1). Hover and pin answer "who saw what" and "compare Osric with Brenna" without tracing. Table gives the sortable list for a large cast. |
| Knowledge board | **Keep plus interaction; Table and Sentences as alternates** (shipped). Cases stays the default | Unlabelled `supports` edges: every form needs 2 steps for the one question (measured). Hover card names the backers (screenshot `knowledge-*-3-after-hover-card.png`). |
| Study map | **Keep plus interaction now; replace with a layered DAG later** (LATER L1) | Unlabelled `needs` edges (F7). Table and Sentences alternates shipped. |
| Family tree | **Keep; add interaction when its owner next edits** (LATER L2) | Heirs-first section already answers the main question (F6); the pedigree is a shape view. Not wired: edited today by RPX21. |
| Lives figure | **Keep plus interaction later** (L2) | Tree with a few nodes; hover "why can't I go back" would use the `why` field. No measurement; inferred. |
| Talk rapport | **Keep** | A four-stop track is a sequence, not a web; nothing to measure. |
| Walk map | **Default the board, keep the walking map as the alternate** | MT2-1 says the board leads and the ring map is closed by default; COV4 (`a98b2bc0e`) later made the walking-map disclosure open by default. The two disagree. The table form read 53 words against 106 on first paint (measured), so the proposed default is the board first with the map one click away. The owner of `walk_map.js` decides. |
| Home strip | **Keep the chips on master** | Track of rooms replaced by chip rows in COV4; no web. |
| Body milestones | **Keep** (track); the body-by-part table already replaced the radial map | n/a |
| Fight ring (via the fight card) | **Keep the versus row as the default; ring is an alternate** | Versus row landed in round 2; the ring needs a hover for "who strikes me" in every form (measured). |
| LOTM circle, making, ladder | **Keep; attach interaction when `floor-wire` hands the file back** | Rite ring and tracks, no edges to hover. Not touched (PLAN not-owned list). |
| Making flow (craft-flow fixture) | **Keep plus interaction** | Unlabelled `consumes` and `makes` edges; hover card names inputs and outputs. Not wired into a live panel by this lane. |

## 4. The interaction layer (spec)

Module: `src/ui/figure_interact.js` (pure model plus `attachFigureInteract`). Alternate forms: `src/ui/figure_forms.js` (`mountFormSwitch`, `renderTableForm`, `renderMatrixForm`, `renderSentenceForm`, plus pure models). One generic hook in `figure.js`: `data-from` and `data-to` on every edge group, so edges are matched by spec identity and not by draw order (asked of `rep-abilities`, UR-neutral, no kind or world ids anywhere, AD46).

| Capability | Default behaviour | Dial |
|---|---|---|
| Neighbour highlight | Hover or focus a point: it and its neighbours stay, the rest and their edges fade to 28% opacity, an instant change | `options.hops` (default 1) |
| Hover card | One card per hovered point under the figure: title, state mark and word, ring, optional `detail` and `why`, and each link as a button with its kind word. The native `<title>` tooltip moves into `aria-label` while attached and is restored on destroy | cards are plain DOM; no tooltip library |
| Nested cards (Paradox style) | Hover or focus a link inside a card and that point's card opens beneath it, up to two levels. Clicking a link moves focus to that point | `MAX_NEST` 2 |
| Pin and compare | Click or Enter pins; two pins open a compare pane: linked directly, both connect to, only A, only B. A third pin replaces the oldest | two by default (a compare is a pair) |
| Filter | A text box dims points whose label or ring misses; "k of n match" is announced politely. The model also filters by state and edge kind | `options.filter: false` hides the box |
| Focus plus context | A Focus toggle (or the `f` key) hides labels of points beyond the pinned set's neighbourhood and fades them to 18%. Shape stays | `options.focusMode`, `hops` |
| Why on hover | Shows node and edge `why` ("Why: ...") and `detail` when the spec carries them. A view that derives a value supplies the sentence; the layer adds no sentence of its own | spec field `why` |
| Keyboard | One roving tab stop; arrows move to the nearest point in that direction by drawn position; Home and End; Enter or Space pins; `f` toggles focus; Esc clears hover and pins. Points get `role="button"` and `aria-pressed` | none |
| Motion | Only a real change: pass `options.previous` and points whose state or label changed get `fig-changed` (a stroke, plus a two-beat halo only when effects are on). Under `data-effects` off or reduced there is no animation; dimming is an instant change by default (UR38, UR62) | `changedIds(prev, next)` |

Accessibility and fallbacks: every fact on a card is also in `figureText` and the table or sentence form (no fact lives in hover alone, UR37). A spec with no markers attaches as a no-op. Specs without points (tracks only) are unaffected.

Form switch (`mountFormSwitch`): buttons Figure, Table, Matrix, Sentences (the caller lists which). The figure stays one choice and is the default unless `options.initial` says otherwise (AD45). The chosen form is remembered per figure id in a caller-supplied Map across redraws.

## 5. What shipped, and its state

| Item | State |
|---|---|
| `figure_interact.js`, `figure_forms.js`, CSS in `styles/figure.css`, `data-from` and `data-to` hunk in `figure.js` | Implemented; `tests/figure_interact.test.js` (9 tests: neighbours, filter, compare, cards, arrow moves, change diff, attach and destroy with titles restored, keyboard, form switch). Browser-proven on the gallery at 1920x1080, 14 px and 21 px, effects off (42 screenshots, 0 page errors) |
| Wired into People web, Knowledge board and Study map (`people_ui.js`, `knowledge_home.js`, `research_home.js`) | Implemented; the three views' existing tests pass. **People web: proven live** on rebuilt bundle `38532b70c739`, fresh life, earned elder greeting, 1920x1080 (`scripts/form_fit_live.cjs`; hover card, pin, Table and back to the Figure, text form kept; `evidence/.../live-people/`). The old `scripts/relationship_web_browser.cjs` no longer reaches the web (a Talk row is covered by the center panel before the click; unrelated to this change). **Knowledge board and Study map: implemented, below floor** (unit tests and gallery only; not walked in the game) |
| Replacements | None. No measured gain was large; see short answer |
| Measurement and capture scripts | `scripts/form_fit_measure.mjs`, `scripts/form_fit_capture.mjs` (rerunnable) |

Evidence: `docs/audits/evidence/form-fit-2026-10-30/` holds, per view and text size, `1-before-figure`, `2-after-figure-idle`, `3-after-hover-card`, `4-after-pinned-compare`, `5-after-focus-mode`, `6-alt-table-inspector`, `7-alt-matrix`, plus `measure.json` and `capture.json`.

Known limits (checkpoint wording, AD45): the hover card sits under the figure, not next to the point, so on a tall figure the eye travels; pins reset when a view redraws on a changed spec; the people-web edge labels are a drawn-overlap problem of `figure.js` that fading shows more clearly; matrix has no sort.

## 6. Table: ACT NOW, ACCOUNT FOR NOW, LATER

Level: S small, M medium, L large. Done check is what proves the item.

| Code | When | Item | Level, effort | Done check |
|---|---|---|---|---|
| A1 | ACT NOW (done) | Interaction layer and form switch with tests | M, shipped | `node --test tests/figure_interact.test.js` passes; gallery screenshots |
| A2 | ACT NOW (done) | Wire into People web, Knowledge board, Study map | S, shipped | People proven live; the other two **below floor** until walked (A3) |
| A3 | ACT NOW | Walk the Journal Knows board and Study map routes in the rebuilt game at 1920x1080 and attach the screenshots (People is done) | S, 1 session | FLR1 hash named; hover, pin, table switch seen on each route |
| N1 | ACCOUNT FOR NOW | Specs that want "why on hover" must carry `why` (relationship web edges, family heir mark, lives return block). Say so in each owner's next brief | S | each owner's spec builder sets `why` where it already holds the reason |
| N2 | ACCOUNT FOR NOW | `rep-abilities` graph layout: keep `data-from` and `data-to` and `data-id` on whatever it draws so the layer attaches unchanged | S | `attachFigureInteract` on a layout-drawn figure in `figure_interact.test.js` |
| N3 | ACCOUNT FOR NOW | UR proposal: any figure with edges ships through `mountFormSwitch` or names why it cannot (no new code UR until Weibao accepts) | S | UR text drafted in this doc, not accepted |
| L1 | LATER | Layered left-to-right DAG layout for the study map and ability dependencies (rides on `rep-abilities`' graph layout); table stays the alternate. Reopen when that layout merges | M | study map fixture drawn as layers; 3 Qs measured again |
| L2 | LATER | Wire the layer into Family tree and Lives figure. Reopen when their owners (RPX21 round 2, continuation) finish their current edits | S each | pedigree hover shows heir and parents; `git log -3` clean on the file |
| L3 | LATER | Card next to the hovered point (anchored popover) instead of under the figure | M | card within 40 px of its point at 14 and 21 px, on a 720 px figure |
| L4 | LATER | Per-world default form: each world pack names its default form per subject (AD46). Needs a descriptor field, not a code branch | M | two worlds open the same subject in different forms from data alone |
| L5 | LATER | Real fresh-player timing for the three wired views (two or three sentences from Weibao, since he is the player) instead of structural proxies | S | a short note of his in USER_VISION |
| L6 | LATER | Table sort chips for state and ring, and a matrix with a sortable order | S | click a header, rows reorder, screen reader announces |
| L7 | LATER | Attach to `book_world_lotm_ui` figures when `floor-wire` hands the file back | S | rite ring points focusable |

## 7. Default and conditions (no either/or)

- Default for any figure with edges: the figure with the interaction layer, and a Table next to it. Condition for the table to lead: more than about 10 points, or the question is a sort or filter ("who is most owed"). Condition for plain sentences: screen reader or text-effects-off preference, which the text form already covers.
- Default when edges carry no labels: add a label to the edge in the spec builder first; if the label would crowd the drawing, the card is the substitute.
- Matrix: offered where the question is pairwise ("does A know B"), as an alternate; the figure or table leads.
