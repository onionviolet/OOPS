# Knowledge, investigation and perception: representation (proposal)

**Next slice (2026-10-30):** Insight view. Level and effort: sonnet, small. Done when: a cheat-sourced knowledge row renders with its mark and a sealed fixture still stays hidden.

Status: **proposal**, 2026-10-30, from the UI representation wave; it binds nothing until
Weibao says yes (AD32). Codes cited: LTU4 (Journal → Knows home), RPX6 divination results,
RPX7 spirit or second sight, RPX8 dreams and visions, RPX12 investigation board, RPX13
documents ([round 11-12](../audits/UI_DESIGN_CORE_AUDIT.md)), UIV6 one known / guessed / unknown
grammar (proposed), UR76 UI contract (proposed), UR36, UR37, UR42, UR74, AD6-AD8 and the
[sealed-secrets rule](../../AGENTS.md#sealed-secrets).

## What is being drawn

One store: `state.simulation.knowledge[actor][key] = {stage, value, at, cause, basis}`.
`stage` is seen, interpreted or understood. `basis` says how it arrived: observation,
recollection, instruction (told, or read with a `sourceId`), inference (with `evidence` keys and
a stated `uncertainty`); divination adds `method`, `queryId` and a signal `status` of signal,
obscured or unanswered. Intentions live as the seat's own facts
(`inference.<chain>.intention`: considering, active, postponed, cancelled). Inference and
divination adapters already write all of this; nothing new is stored.

## Options weighed

| Code | Representation | Good at | Weak at |
|---|---|---|---|
| KR1 | **Knows list with provenance** (Journal → Knows) | Every line readable, searchable later, the text form for free; date and "how you know" on each line | Shows no structure between clues |
| KR2 | **Investigation board** (RPX12): MDL2 figure, known left, readings middle, open questions and plans right, "supports" edges from `basis.evidence` | Shows what led to what and what is still open; the shape of a case at a glance | Crowds past a dozen nodes; labels must be short |
| KR3 | **Divination fragment cards** (RPX6): a scene card per rite, signal then reading, "seen in the bowl" skin | Rites feel like rites; obscured answers look obscured | Covers one source of knowledge; needs the scene card skin per method |
| KR4 | **Sight lens over the place view** (RPX7): tint people and things with what the seat perceives, with a cost meter | Perception happens where you are; second sight becomes a mode | Needs a place view projection per world; by default a lens narrows what the list shows, because a fact store there would bypass the seat's own learning |
| KR5 | **Document cards** (RPX13): paper skin, sender, date, seal state, clauses | Letters and notices feel held; contracts show who holds which copy | Waits on a document owner, since reads carry a `sourceId` and no text record |
| KR6 | **Unusual: the doubt ledger.** Each guessed line is a small wager card: what would confirm it, what would break it, and which act tests it (ask, read, divine, watch) | Turns doubt into play: the open column becomes a to-do list of tests | Needs per-line "test acts", which the inference adapter does not yet name |

## Default (proposal)

**KR1 as the home, KR2 as its second view, same rows.** The Knows tab in the Journal shows the
list by default, grouped Known, Guessed, Open and What you mean to do; a Board toggle draws
the same rows as a figure whose text form is the list's lines. Dial: a world whose knowledge is
mostly rites (a divination-heavy start) can open the Board or, later, KR3 cards first; a world
with a status-window means can add an AP-level column (MEANS_AND_APPRAISAL). Reason: knowledge
has to be readable before it is pretty, and one adapter feeding both views keeps them from
disagreeing (UR74).

KR3, KR4 and KR5 become skins over the same rows once their owners exist: KR3 groups rows by
`basis.queryId`; KR4 filters rows by the seat's current place; KR5 needs a document owner first.
KR6 is the strongest next idea: it is where investigation becomes a verb.

## Grammar (UIV6, proposed)

| Seat state | Word | Figure state used now | Source |
|---|---|---|---|
| stage seen or understood | Known | `filled` ● | the seat saw, was told, read or learned it |
| stage interpreted | Guessed, with its stated doubt | `pending` · | the seat's own reading; may be wrong |
| divination `obscured` or `unanswered`; a chain still being considered | Open | `unknown` ? | the seat asked and got no answer |

The figure primitive has no `guessed` state, so the board relabels existing states through its
legend ("● filled means known: seen or learned"). Proposal for the coordinator: add a
`guessed` state to `FIGURE_STATES` so the text form reads "(guessed)" instead of "(pending)".

## Sealed secrets and seat limits

The adapter reads only `observerView(state).knowledge()` and `.facts()`. It never reads world
facts, another actor's knowledge or a queued job's frozen effects, so a sealed truth has no path
to the page until the seat itself receives it. Open rows come only from the seat's own
unanswered questions, never from truths it lacks, so an open row cannot reveal that a secret
exists or how many there are. A lens (KR4) can only filter these rows further. A sight means that
reveals more is a knowledge write by its own mechanism, not a display rule.

## Home and contract (UR76, proposed)

- Home: **Journal → Knows** (LTU4). A tab beside Quests, Bestiary, Anthology and Data, and a
  top-nav route `records:knows` (Alt+F), because the shell names Journal tabs in the nav (UR42).
- Shape: list rows (K1) plus an MDL2 figure.
- States in words: empty ("Nothing learned yet. Look around, ask, read or think, and it is kept
  here."); populated (count line plus groups); board over six per column ("N more known lines are
  in the list."). People stay in the People panel; the tab links there.

## Receipt (2026-10-30)

Files: `src/knowledge_view.js` (pure adapter), `src/knowledge_home.js` (Journal tab, domain
registration), `src/ui_extras.js` (one import), `src/layout_spec.js` (one route),
`index.html` (figure.css link), `src/ui/preview/fixtures/knowledge.js` (named fixture through the
real adapter), `src/ui/preview/figure_gallery.js` (one import), `tests/knowledge_view.test.js`,
`scripts/capture_knowledge_evidence.mjs`, evidence in `evidence/knowledge/`.

Change surface (FND2): core-owner files touched: `layout_spec.js` (one route row),
`index.html` (one stylesheet link); new import cycles: none; registration lines: one in
`ui_extras.js`, none in `main.js`. No persistence change: the adapter is projection only, so
no migration (FLR5 n/a).

Checks (one line each):

- `node --test tests/knowledge_view.test.js`: 6 pass. Covers the sealed line planted in world facts, a bystander's knowledge and a queued job's frozen effect, absent from rows, spec JSON, `figureText` and the drawn SVG; the positive control shows it once the seat receives it.
- `node --test tests/layout_spec.test.js`: 19 pass after adding the Knows row to the pinned route table.
- `npm run check:arch`: pass (main.js not grown); `npm run check:rules`: pass, 5 standing warnings; `npm run check:docs`: no findings in this file.
- `npm test` (this worktree): 4123 tests, 4104 pass, 13 fail. One was this slice's: `perspective_controls.test.js` needs every nav route tagged; it is fixed by a `records:knows` row in `src/perspective_controls.js`, and its file now passes. Two (`cast_worksheet`, `lead_run_crosswalk`) fail identically on the untouched base in a fresh worktree, because the gitignored `docs/research/novels` is missing. The other ten are live-integration tests (cast adapters, card integration, person-memory route) that boot `main.js` in the headless DOM. Some timed out, and some failed with a save worker exiting with empty stderr. They are **unverified, not cleared**. Run alone, three still failed. A plain headless boot of this branch did not finish within 280 s while the machine ran at load 194, so load cannot be told apart from this slice's Journal mount, which every such boot now runs. The coordinator's full run at merge settles it. If one fails there, guard `mountKnowsTab` first.
- `node scripts/capture_knowledge_evidence.mjs`: headless Chrome at 1920×1080 on a fresh origin, rebuilt bundle `0a5329b6d6c0`, 0 page errors. Output is in `evidence/knowledge/` (`receipt.json`, screenshots, text forms).

AD43 floor:

- FLR1 build: bundle `0a5329b6d6c0` for round 1. Round 2's capture on `ebded7d99cc7` superseded that evidence and `receipt.json`.
- FLR2 route: from a fresh life, meeting the village elder (earned) opens the Journal; the top-nav Knows tab shows the empty state. For populated play, the named prerequisite fixture unlocks the craftsman meeting, as `tests/person_memory_route.test.js` does. Real clicks follow: meet him, "Follow local people and work", "Ask about his working habits". Knows then lists the two lines the simulation wrote. The board's full grammar is proven by the named gallery fixture `knows-harbor-bell` through the real adapter. No MCP walk: the game MCP serves another checkout's build.
- FLR3 shown: every line carries certainty, provenance and when; the empty state says what to do; reading costs nothing (free inspection). The board appends the same text form.
- FLR4 used: the rows are existing knowledge that inference, divination and frontier powers already read as requirements (`knowledge.<key>` predicates). The display adds no new consumer.
- FLR5 kept: n/a. No persistence change.
- FLR6 labelled: agent-verified, not human-reviewed. Route kind: earned to the home, fixture-assisted for populated content.
- Verdict: **done at the floor**, on the reading that FLR4's consumer is the existing requirement predicates that read these same knowledge rows. The tab shows what those gates use and adds no new store. If a display must add its own consumer, the verdict is "implemented, below floor (FLR4)"; that call is Weibao's.

Known limits: the board spreads few nodes over the full height, and in the Journal box its legend sits below the fold (the list is the default view for this reason). Node labels are cut at 40 characters, with full lines in the list. Bestiary and Anthology show as "???????" in the tab strip on a fresh life, which is existing behaviour. `dist/` and the html `?version=` bumps are not committed; the coordinator rebuilds after merging.

Next slice: KR6 doubt ledger on the inference adapter (name a test act per guessed line), then
KR3 fragment cards grouped by `basis.queryId`.

## Round 2 (2026-10-30, proposal)

Run against the [round 2 brief](../gm/dispatch/ui-refactor-wave-2026-10-29/ROUND2_BRIEF.md).
Everything here, round 1 included, is the current best draft and open to replacement with a
reason (AD45).

### K2-1 How other games do it

Game claims are labelled **known** (from play or published docs) or **inferred**. The adapted
ideas are mechanisms, not looks.

| Game | What the player sees | Makes easy | Costs | Idea taken |
|---|---|---|---|---|
| Return of the Obra Dinn | A ledger: one page per event, fates filled in by the player, confirmed in threes (known) | Certainty arrives in batches, so guessing is safe and a confirmation feels earned | Strict one-answer truth; no room for partial readings | **Cases as ledger pages**: each line of thought is a page, clues to readings to plan (done) |
| Shadows of Doubt | A pinboard per case, notes and string links the player draws, evidence items with sources (known) | Spatial memory of a case; the player owns the links | Gets messy; the player maintains it | **Board stays, but per case and optional**; links come from `basis.evidence`, not hand string (round 1 board) |
| Disco Elysium | Thought cabinet: thoughts researched over time, then internalised with effects (known) | A thought has a lifecycle and a cost while forming | Effects hidden until done | **Intention lifecycle** (considering, active, set aside) shown as the case status (done) |
| Heaven's Vault | A lexicon of glyph guesses, each marked confirmed or not, refined by reuse (known) | Guesses stay visible and improve with evidence | Slow; needs many uses | **Doubt shown in the line** ("doubt: ...") and "from N clues" (done); confirmation by reuse is LATER |
| Her Story | Search box over clips; results show just what you searched (known) | Knowledge comes from your own questions | Hard to know what you missed | **Search over Knows** is LATER; open questions already mark what you asked and lack |
| Proto23 / YAIR baseline | Journal tabs for quests, bestiary, books (known, our code) | Familiar Journal home | Tabs answer "what have I met", not "what do I believe" | Knows joins the Journal tabs rather than a new panel (round 1) |

Abstraction underneath: a **ledger of claims with provenance** (claim, certainty, source,
time, cites), grouped into **cases**. The same ledger serves appraisal results (character
sheet), forecasts and assays, so the grammar lives in one export (`CERTAINTY` in
`src/knowledge_view.js`).

### K2-2 Fresh-player test

A first look at the round 1 tab asked three things: what "Knows" means, what "Guessed" is
measured against, and why the board had two dots in a tall empty space. Done: an intro sentence
under the heading, a glance line ("4 known · 3 guessed · 1 open · 1 plan"), cases by default
so each line sits under what it is about, "from N clues" on readings, and "(understood)" where
a known line was understood rather than only seen. Terms the player meets: known, guessed,
open, plan; each says its meaning in the board legend and the status line.

### K2-3 Space, split and density (1920×1080)

The Knows tab sits in the center expanded Journal (about 720 px wide). Density by frequency
(UR42): the **glance line** is the frequent read; **cases** are the default detail; the **flat
list** grouped by certainty answers "what is still open across everything"; the **board**
answers "what led to what" and is the occasional view. One view per question, so the three stay
separate. LATER: a pinned inspector beside the cases (a clicked line shows its full source chain
and the acts that could test it) once KR6 lands.

### K2-4 Bars and small signals

A change badge on the Knows nav button counts lines added since the tab was last on screen,
through the existing `registerChangeCounter` used by Quests. It answers "did I learn something?"
and is words plus a number (UR37). Certainty chips per line stay words, not colours.

### K2-5 Pop-outs and the desktop app

The board earns a pop-out on a second screen for a long investigation (MDL13: `renderFigure`
draws into its own node's document). LATER, with the browser fallback unchanged. No
notification: learning something is already a Reports line from the adapters.

### K2-6 Cheats and insight views

Knowledge or foresight cheats land in the Records tab (CS1), so an insight view is a **fourth
Knows view marked "Insight"** with a cheat glyph on every line and the cheat's name as the
provenance ("Shown by <cheat>"). A cheat reveals by **writing knowledge through its own
mechanism** (an observation with `basis.kind` and a cheat source), so it passes the same seat
gate and sealed truths still arrive only through their discovery route; a cheat that is itself
a discovery route for a secret is allowed to reveal it, by that route's rule. The developer
inspector (raw keys, world facts) stays separate and is never styled as play. LATER, effort
small once a cheat writes knowledge.

### K2-7 Visual style

Default: list and cases in the Journal's type, which works in Luminous and Neutral at 14 and 21
px with effects off (no motion used). Alternative, LATER: **paper and ink** for cases (a case as
a note card with a ruled line per row, ink colour from tokens), which reads better for
documents (KR5) and worse for dense lists. Proposed in this doc only; no new CSS this round.

### K2-8 Use what we have

Used: `observer_view.js` (seat gate), `figure.js` (board), `reference_kit.js` (`node`,
`visibleRenderer`), the Journal tab bar and nav routes, `change_badges.js`. Not used yet:
`scene_card.js` fits KR3 divination fragments and RPX8 dreams (one card per rite with
"seen in the bowl" provenance), so no new shape is needed for them.

### K2-9 Unconventional option

**The case as a conversation with yourself**: each case renders as a short inner dialogue in
the character's voice ("The rope was cut clean. Ostra swears the tower was locked. So someone
had a key, unless the lock was picked."), generated from the same rows by a template, later by
the local-AI prose pass. Worth a later slice: it makes inference feel like thinking, and the
row list stays as its text form.

### K2-10 Audit gaps

- Other seats: the adapter is seat-neutral, reading the observer; a bystander with few lines gets the
  same view with fewer cases. Not yet shown with a non-lead fixture in the browser.
- Empty and error states: empty state in words; an error state has nothing to report, since the view is a projection.
- Persistence: none. Performance: one render per visible refresh, nodes bounded by row count;
  the board caps six per column. Large saves (hundreds of lines) need paging: LATER.
- Accessibility: buttons with `aria-pressed`, status `role="status"`, text form for the board.
  Keyboard: the nav route has Alt+F. Not yet checked at 21 px.

### K2-11 to K2-21

- **Prior implementations (K2-11):** `known_things.js` is the "what you have met" sibling;
  Knows is "what you believe". They stay separate tabs with distinct questions.
- **Open for improvement (K2-12):** known limits are the board spacing for few nodes, 40-char
  board labels, no search, and case labels guessed from text when a host gives none. The
  likely next refactor passes chain labels from `castInferenceCommands` as `labels`.
- **Flourish (K2-13):** a soft settle glow on a line when it arrives, bound to the new row,
  off under effects off and reduced (UR38). LATER, reusing `settled_text_effects.js`.
- **Reports and center (K2-14):** proposed Reports line shape "◇ Learned: <text>" and
  "◆ Worked out: <text> (from 2 clues)" with a link to the Knows case. The Reports look stays
  with the time session.
- **Fold into existing UI (K2-16):** done by joining the Journal tab bar and nav. Proposal for
  the coordinator: the People panel's "what you know about them" could read the same ledger
  filtered by subject, so the two never disagree (UR74).
- **Later volumes (K2-17):** cases key on adapter addresses (`inference.<chain>`,
  `divination.<query>`), so a later book adds rows, not code. Long series need paging, case
  archiving (settled cases fold away) and subject filters (person, place, power). The reading
  outputs were not opened this round; that check is LATER.
- **Form fits subject (K2-18):** cases are cards (things you act on); certainty groups are a
  list; what-led-to-what is a graph (the board), drawn in columns, not a ring. The who-knows-what
  matrix belongs to the relationship web session (people by subject); Knows is one seat's
  claims, so a matrix fits it worse.
- **Levels and depth (K2-19):** three depths today: seen, read into (guessed), understood; plus
  divination status and the evidence count. Later depth: confirmed by N independent sources,
  contradicted lines (two readings that cannot both hold), and the AP level of the means that
  produced it (MEANS_AND_APPRAISAL).
- **Roles, not looks (K2-20):** board nodes carry `role: clue | reading | question | plan`, so a
  motif pack can restyle them. Flair sketch: in a gaslit city world, cases as a detective's
  notebook with pencil underlines and a wax-seal glyph for sealed-source lines; in a
  cultivation world, clues as jade slips and readings as incense smoke that clears as a reading
  is confirmed.
- **Draft status (K2-21):** round 1's certainty-grouped list was replaced as the default by
  cases, because a player asks "what do I know about this?" before "what is open overall?".

### Round 2 actions

- ACT NOW (done): cases view as default, glance line, intro sentence, "from N clues",
  "(understood)" depth word, plan line without a repeat, board node roles, tests for cases.
- ACCOUNT FOR NOW: the shared certainty grammar with the character-sheet session (appraise and
  identify write knowledge rows and reuse `CERTAINTY`); chain labels from the host.
- LATER/DELEGATE:
  - Insight view: sonnet, small. Done when a cheat-sourced knowledge row renders with its mark and a sealed fixture still stays hidden.
  - KR6 doubt ledger with test acts: opus design plus sonnet build, medium. Done when a guessed line offers an act and the act's result confirms or breaks it.
  - Board pop-out: sonnet, small. Done when it is drawn in the desktop pop-out with the browser fallback unchanged.
  - Search and paging: sonnet, small. Done when 300 rows stay responsive and are searchable.
  - 21 px check: haiku, small.

### Round 2 checks

- `node --test tests/knowledge_view.test.js tests/perspective_controls.test.js tests/layout_spec.test.js`: 28 pass. The knowledge file has 8 tests, two of them new for cases and glance.
- `npm run check:docs`: no findings in this file. `npm run check:arch`: pass, still 205 grandfathered cyclic edges, so the `change_badges.js` import adds no cycle; main.js not grown. `npm run check:rules`: pass.
- `node scripts/capture_knowledge_evidence.mjs`: rebuilt bundle `ebded7d99cc7`, 1920×1080, 0 page errors. The fresh life shows the empty Cases view. After the craftsman route, the Knows nav button reads "Knows, 1 new" (`data-new-count` 1) and Cases shows "2 known · 0 guessed · 0 open" under "Other things you know". New files: `*-cases.png`.
- Not run, at the coordinator's instruction: the full `npm test`. The coordinator runs it once at merge.
- Gap: multi-case grouping (lines of thought and rites) is proven by tests and by the gallery board fixture, not in live browser play. The frontier route writes no inference chains; a cast-life route that does needs the private pack.
- Build: the sonnet subagent built the home's case rendering and capture changes from a bounded brief, and I reviewed the diff. The adapter, tests, badge and doc are mine.
