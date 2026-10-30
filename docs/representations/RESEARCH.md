# Research and study representation (proposals)

Session `rep-research`, 2026-10-30, branch `claude/rep-research-e34f54`. Everything here is a proposal and a draft
(AD32, AD45); Weibao's words are in [USER_VISION](../USER_VISION.md). Owners it leans on:
[north star research proposal](../LIFE_SIM_NORTH_STAR.md) (line ~1756), [technology palette](../TECHNOLOGY_AND_PROGRESSION.md)
(TK, RV, RQ, RU, RD codes), [idle-game research cases](../RESEARCH_IDLE_GAMES.md), [observation and mystery](../emergent/E7_OBSERVATION_AND_MYSTERY.md),
[SLR rules](../DOMAIN_RULES.md) (SLR4-SLR6, SLR14-SLR18). The sibling [Knows home](KNOWLEDGE.md) owns what you hold; this view owns
what you are working toward. Survey notes: the session notes folder, `rep-research-ideas.md`.

## Round 1: what exists, what the code supports, the gap

**Ideas already written (all proposals; no research UI is accepted).**
- One standard research project for every world: subject, inputs (time, materials, teacher or text, place), stages, outputs, and "two bars": research fills *understanding*, practice fills *usability* (north star ~1756).
- Knowledge fidelity from rumour to mastery (TK0-TK5), research as an idle verb with named stalls (RV), uncertainty shown as fragments and confidence (RU), and "show the consumer: what it would change" (RD1).
- Rules that bind it: new information grows understanding, repetition only grows fluency on a diminishing curve (SLR5, MR22); every gain records its cause (SLR4); texts are claims that testing settles (SLR18); lessons are transactions (SLR16); things work by their mechanism (AD38); sealed truths stay sealed (AD6-AD7).

**What the code already is.** No research project object exists, but the *lessons* are research projects in everything except name. The lever lesson (`src/lever_lesson.js`) and the paid datum lesson (`src/world_completion_learning_content.js`) are chains of commands over a situation, each leaving a knowledge entry with a stage (`seen`, `understood`) and a basis (observation, instruction), timed jobs with `due`, and a final `power learn` that unlocks a repeatable command. In research words: evidence in any order, a returned record, an explanation, supervised practice, then a new option. The notebook already computes "N min remaining" for the running job (`src/adventure_notebook.js`). Skill XP, `recent_learning`, `discovery_codex` and the craft experiment log (`craft_experiment_log.js`, owned by crafting) cover other halves: practice, "seen" ids and trials.

**The gap.** Nothing shows a lesson *as a study*: where you are, what is left, what you have found so far, and what it opens. The player sees one command at a time in the Field panel. Missing as mechanism, not just UI: books and notes as study sources with partial or wrong claims (SLR18), experiments that can fail usefully (AD9), questions that arrive from anomalies (RQ), and theory that accumulates across lessons. These need new state; the first slice deliberately does not add any.

**Decision: projection first, no new state (advisor, 2026-10-30).** The slice reads existing records through data rows. It adds no save slice, so no migration; a discovery flag nothing reads would be below the floor (FLR4), while the lessons' real power grant is a real consumer. A study *state* (anomaly log, notebook claims, theory points) is the next step only when a second mechanism needs it, per the "second consumer" habit (FND5).

### The slice (what was built)

| Piece | File | Role |
|---|---|---|
| Rows | `src/research_content.js` | Two study rows (lever lesson, datum lesson): steps with kind, command id, minutes, prerequisites, plain wording, levels, what it opens. Data only. |
| Projection | `src/research_view.js` | Pure. Seat observer's completed commands and knowledge, the seat's own jobs and powers, in; levels, steps, partial findings, time left, opens, text lines and two figure specs out. Reads no situation record, so sealed truths have no path in. |
| Panel | `src/research_home.js`, `styles/research.css` | Study panel (Find: "Study"), queue list beside a pinned inspector. Registered through `ui_extras.js` (one import line), not a layout route, to stay clear of the Knows tab's `layout_spec` rows. |
| Figures | `src/ui/preview/fixtures/research.js` | Dependency map and level ladder for the gallery, built by the real projection from a hand-made seat. |

Route and gate (AD6, north star ~1085 "nothing in a menu before you have heard of it"): each row has a `heard` fact on the seat's own actor (`field.introduced`, set when the craftsman is asked about the shared workshop; `world.completion.learning.enrolled`, set when the datum terms are heard) and a row is also listed once any of its steps is done or running. A true fresh life therefore shows the empty state, and Find offers no Study panel until a lesson has been introduced. The datum lesson's own `canBegin` is a derived world fact the observer cannot read, so that row appears only after its terms are heard (its "could study" state is not reachable; known limit). Named fixtures for later states are DEV SEEDED expansion states from `scripts/field_fixtures.mjs` loaded through a save edit, as the Knows evidence does.

### Forms weighed per part (item 18)

| Part | Chosen | Why this and not the others |
|---|---|---|
| What you are studying (queue) | Compact rows: title, state and level word, time left | A list answers "what is going on" at a glance; a tree needs a second look and holds two rows today. Civilization and Stellaris show an *active* project plus a short list; the idle-game queue adds time left per row. |
| Progress of one study | Two meter bars (Understanding, Usable) plus a level word | Two bars is the north-star model and answers two questions (do I get it, can I do it). A single percentage hides that a lesson can be understood and not yet practised. Ring forms suit cycles; this has none. |
| Levels (item 19) | A named ladder (Curious, Seen, Checked, Explained, Practised) with "what the next level changes" | Stages with a stated meaning beat numbers. Each level states its means in words. |
| What needs what | Dependency graph, columns left to right, ending at a star for what it opens (behind a disclosure) | Prerequisites are a graph, not a cycle or a bar. Behind a disclosure because the list already carries order in words. |
| Partial findings | A notebook list of the entries the steps wrote, each with its certainty word and cause | Findings are sentences; a figure would shorten them. Reuses the knowledge entries instead of a second store (AD7). |
| Experiments | Not built: the lever "hand-work" step is the one evidence trial today | See round 2 O1. |
| One unconventional form | The craftsman's own board: the study shown as the *teacher's marks* on the timber (done steps struck through in chalk) | Diegetic and cheap as text; deferred. |

### Reference games (known from play or docs; adapted, not copied)

- **Stellaris and Civilization tech**: a short offered list, one active project, "eureka" boosts when you do the thing. Idea taken: show one active project and the *thing that would speed it* as a visible step.
- **Oxygen Not Included research**: per-tier inputs shown on the node. Idea: name the inputs (a brace, a coin, a log) on the step.
- **Cultist Simulator and Book of Hours**: study is a verb on a slot with a visible timer, and reading yields partial insight. Idea: partial findings per step and a time remaining per timed step.
- **Thaumcraft research table**: you assemble the theory yourself from fragments. Idea (later): findings that must be combined (O2).
- **Idle games' research queues**: queue, rate, time left, offline stops at a named reason (RV). Idea: "time left" is counted from the real remaining timed work, and unattended study stops for a reason, never silently.

### Later volumes and worlds (item 17)

A row names ids; a later world adds a row, not code. The mapping is the same wherever a world teaches by commands with stages: a magic school's lessons and library carrels, an occult society's initiations and rites (evidence = a witnessed rite, understanding = an interpreted sign, practice = a controlled attempt), a cultivation sect's scripture study, a workshop's drawn plans. What the first slice does **not** cover and later volumes will want: books with several claims of varying truth, research that waits on people or seasons, shared and rival research, forbidden study, and knowledge carried across lives (SLR20 carrier). The rows lint against the live registry (`tests/research_view.test.js`) so a row cannot drift from its lesson. No later-volume reading output was opened for this slice; checking the reading status for later needs stays open (L1).

## Round 2: review (brief items 1-21)

Findings are proposals. **ACT NOW** = done in this branch. **ACCOUNT FOR NOW** = a decision that shapes what comes next. **LATER/DELEGATE** = level, effort, done check.

**1. How other games do it** (see the reference list above; each claim known from play unless marked). Disco Elysium's thought cabinet (known): an *internalising* timer with a stated cost and a stated reward; adapt the "while this runs, it costs" line to timed study steps (ACT NOW: done steps stay terse, running ones show minutes left). Outer Wilds ship log (known): the log is a graph of what you found with "more to learn" markers; adapt "unknown next steps" as locked steps that name their blocker (ACT NOW: `After: ...` text). Heaven's Vault translation (known): confidence per word and revision when later evidence arrives; adapt for later wrong-then-corrected claims (LATER, O1). Return of the Obra Dinn and Shadows of Doubt belong to the Knows and case-board session; this view links, never duplicates.

**2. Fresh-player test.** Read from `introduced-screen.png` (the lead's workshop introduced, nothing done; a true fresh life has no Study panel yet, `fresh-life` records that). Five-second read: "Study / 2 to begin / two titles with a state and a time". A new player can say what it is and what to do first ("Show me where"). Terms needing knowing: "Curious", "Understanding", "Usable" (each explained in the inspector line and the meter notes), "Evidence/Practice" kind words (ACT NOW: kept only in the text line). Hidden clicks: the map is behind a disclosure on purpose. Numbers without meaning: none; every number is minutes or "n of m". Cheap fixes done: done steps drop their how-text; "Time left" says "plus asking" because conversation costs no timed minutes. Fixed: a study with no practice step no longer shows an empty Usable bar (A1).

**3. Space, split, density at 1920×1080.** List plus pinned inspector (UR24). Density: queue rows are one glance line (state, level, time); the inspector is the one-click depth; the dependency map is two clicks deep. Merge decision: the Knows tab keeps "what you hold"; Study keeps "what you are doing about it". When the panel is expanded into the center the inspector reads at about 700 px; at the right dock the list stacks above the inspector (CSS grid at narrow widths is NOT yet verified; desktop-first, mobile deferred).

**4. Bars and small signals.** Reused `createMeterBar` (track kind, words beside the bar, same look as other meters, UR74). Understanding answers "do I get it?", Usable answers "can I do it?". A row-level chip (`Started · Explained`) is the glance form.

**5. Pop-outs and Electron.** A study pop-out earns its place for a long study on a second screen (queue plus time left). The panel draws into the node it is given, so the existing pop-out host works (MDL13); not wired here. A Dock badge or notification when a timed step completes belongs to the Time session's digest (LATER, S1). Browser fallback unchanged.

**6. Cheat and insight views.** Solo play means cheats are features. Proposal: an insight view reveals the *next level's needs and the full step list including steps not yet visible* and marks each revealed row "Seen by insight" (not "You were taught"), through the same `provenance` field. It never reveals a situation's private truth; that stays in its discovery route (sealed secrets standard). The developer inspector stays separate. Not built (LATER, S2).

**7. Visual style.** Brief item 7 asks for an alternative style in the gallery: **not met this round** (only the default style is built; gallery captured in Luminous and Neutral with effects full and off; 21 px not captured). Default is the Luminous Gothic panel as built, checked in Neutral through the gallery. Proposed alternative, *notebook page*: the findings list and steps rendered as ruled lines with a margin glyph column, ink-style type and no meter bars (the two bars become "n of m" in words). It would read better for the book-and-lesson worlds (a magic school) and worse for numbers-heavy ones. Not built this round (LATER, S3: tokens only, 14 px and 21 px, effects off).

**8. Use what we have.** Reused: `figure.js` (tracks and positioned nodes, no change), `meter_bar.js`, `reference_kit`, `observer_view.js`, `panel_kit`, the lessons' knowledge entries and powers. New shape: study rows (one consumer today; the second consumer is the datum row, a second lesson shape, not a second UI). Extending `figure.js` with a layered graph layout is not done: nodes are placed by `at`, which crosses an edge over a label in the map (known limit, M2).

**9. Unconventional option.** *The teacher's marks*: studying shown as chalk on the actual timber and a pivot sketch that gains lines as steps finish, drawn by `figure.js` with a motif pack. Needs a motif set and a study-specific layout; worth a later slice once motifs exist (item 20).

**10. Audit gaps.** Lead's run: both rows cover Frontier lessons only; lead lives in book worlds have none yet (the largest gap, L2). Other seats: the observer limits the view to the seat's world and its own records; a seat with no rows sees "Nothing here can be studied yet" (UR32 empty state, tested). Failure rows: a failed practice (refunded) leaves no marker; the step stays Ready. Persistence: none to break. Performance: one projection per refresh while the panel is visible (`visibleRenderer`), tens of nodes. Accessibility: buttons and a status line are real elements; the figures carry the text form; keyboard and 21 px not exercised in a browser this round.

**11. Prior implementations and abstraction.** The abstraction under this is a *staged track over a ledger*: ordered steps with prerequisites, each writing a certainty-tagged entry, ending in a grant. The same shape is a ritual's preparation, a craft's apprenticeship and an ability's training; the abilities session should reuse the row and level shape instead of a new one (A2). Our own history: the thematic UI owner's "small contextual bars" and the scale palette's "where cheats go" informed items 4 and 6.

**12. Open for improvement.** Every choice is the current best and open to replacement with a reason (AD45). Known limits: rows hand-copy minutes and wording from the lessons (the lint catches id and duration drift, not wording); the map layout is a stagger, not a layered layout; the panel is a records panel found by Find, not yet a Journal tab. Likely next refactor: derive step wording from the command definitions' own descriptions, so a row is only ids and prerequisites.

**13. Flourish.** ACT NOW: hover and focus glow on queue rows from the accent token; the ready step gets an accent edge. No particles. LATER (S4): a soft pulse on a newly ready step and a one-off glow when the opens line flips to open, bound to a settled subject and off under effects off (UR38, UR62).

**14. Reports and the center.** Reports lines proposal (subject first, glyph, link to source, RPT1-RPT12): `★ Studied: Why the long arm lifts opened lever-setting`, `◆ Ready: Explain the pivot rule`, grouped repeats as `Fitted 4 strips`. The Time session owns the panel shell; this lists the lines only (ACCOUNT FOR NOW, A3). Center: the inspector opens actions-first ("Show me where"), reference prose (map) behind a disclosure.

**15. Ability flourish.** Not this feature's; the abilities session owns it. A finished study could hand it a "learned" moment through the same opens line.

**16. Fold into existing UI.** The study belongs beside Knows in the Journal group and the notebook's Practice view where the lessons live. Proposed: a Journal tab "Study" next to "Knows" once their route row lands, with the Find entry kept; the notebook's "Show me where" already opens the Field panel. Layout and pin compatibility: a new panel id changes no saved layout (UR17); a log line "Study is now in Find and the panel list" on first discovery (UR13) is not yet written (ACCOUNT FOR NOW, A4).

**17. Later volumes and worlds.** See round 1. Data-driven rows; no canon names in tracked files. Reading outputs unchecked (L1).

**18. Form per part.** See the table above.

**19. Levels and depth.** Five named levels per study with a stated meaning each, a next-level line listing the missing steps, two bars, repeat counts for repeatable steps, an "opens" line with how it repeats. Not yet shown: synergies and conflicts between studies, costs that scale, and how deep your knowledge of your own ability is (the abilities and sheet sessions).

**20. Flair roles, not looks.** Marks are named by meaning: `evidence`, `understanding`, `practice` (step kinds), `opens` (the star), `seal` for locked, `ready`, `doing`. A motif pack could restyle them without touching the adapter. In a magic school: ink-and-margin-note glyphs and a quill-scratch settle on each finished step. In a cultivation sect: stone-tablet tiers with carved stage marks and a slow seal-break glow when a realm of understanding opens.

**21. Everything is a draft.** Considered and kept: a list beside an inspector, because the studies are few and sequential. Considered and rejected for now: a tree as the main view (two rows), a Journal tab (waits on the shared route), a new save slice (no second mechanism needs it). If studies become many or cross-linked, the map should become the main view and the list a filter.

### ACT NOW (done in this branch)
The Usable bar hides for a row with no practice step (A1); terse finished steps; hover and focus glow; stagger layout and plain legend wording in the map; empty-state test; sealed-line test.

### ACCOUNT FOR NOW
- A1 (UI done; no test yet because no row lacks a practice step): add one when such a row exists.
- A2: abilities session reuses row, level and opens shapes; coordinator to confirm.
- A3: Reports lines (item 14) go to the Time session's grammar.
- A4: first-discovery log line and a Journal tab route row after Knows lands.

### LATER/DELEGATE
- O1 experiment bench and wrong-then-corrected claims: new state (claims with status, trials). Level: Opus design, Sonnet build, effort M. Done: a book claim that is partly wrong, a trial that settles it, a migration, save/reload/import.
- O2 combined findings (fragments you assemble). Level: Opus, effort M.
- L1 check later-volume needs in the reading outputs and private notes. Level: Haiku for lookup, effort S.
- L2 rows for book worlds (a magic-school lesson set and an occult-society study). Level: Sonnet per world, effort M each; done: row lint against the registry plus one sampled journey.
- M2 layered graph layout in `figure.js` (coordinator, shared file). Effort S-M.
- S1 notification and Dock badge; S2 insight view; S3 notebook-page style; S4 settle and pulse effects. Level: Sonnet, effort S each.

## Checks and gaps

| Check | Result | Gap |
|---|---|---|
| `node --test tests/research_view.test.js` (7 tests) | pass | Not the full suite (machine overloaded; committer runs it once). |
| Rows lint against the live registry | pass (ids, minutes, powers) | Wording is not linted. |
| 1920×1080 headless captures, rebuilt bundle, fresh test origin | `evidence/research/` fresh life (no panel), introduced, checked, explained, finished, plus gallery map and ladder in Luminous and Neutral with effects full and off | Fixture states are DEV SEEDED saves. A mid-practice job did not survive the browser reload (cause not confirmed; inferred: the game restores jobs against its own inventory), so "in progress" with time left is proven in the focused test, not the browser. "Show me where" gives honest feedback but did not bring the Field panel on screen in the seeded state (inferred: the game-side craftsman-met fact is absent in a seeded save). Not exercised: 21 px, effects off, keyboard-only, narrow dock. |
| Persistence | none changed | Nothing to migrate or import. |

Capture note: the Find-to-Study step is timing-sensitive on this overloaded machine; the script retries, and `receipt.json` holds the last (partial) run, so the bundle hash there is the rebuilt bundle and the step list is from the final `introduced` plus gallery pass. Label: agent-verified, not human-reviewed. Route kind: Find ("Study") in the rebuilt desktop browser. Below the floor on FLR4 for the datum row's fresh-life path (gates are the lessons' own) and on FLR5 (no state).

COV15 wiring (2026-10-30, view side): not wired, left honestly as it was. `studyProjectFromLearn` needs a learn view and a set of ability ids the seat has heard of, and no live host supplies either: `skillRows` and `learnView` have no live caller, and the Seer rung's ability cards load only from an optional private pack through the ladder figure. The Study panel therefore still lists only the registry rows, and a fresh life shows its empty state (a fresh life reaches Study only after the craftsman introduction, which this round did not exercise, so no fresh-life route shows Research yet; blocker: no live learn-view feed). Missing input: a world-neutral feed of the seat's learnable cards plus heard-of ids registered with the Study panel. Gallery fixtures `fx-study-bridge-ladder` and `fx-study-bridge-map` run the bridge on an invented learn record (`evidence/cov15/gallery.cjs`). AD43 floor: fixture only, below floor on FLR2 and FLR4 for the bridge; FLR6 agent-verified, not human-reviewed.
