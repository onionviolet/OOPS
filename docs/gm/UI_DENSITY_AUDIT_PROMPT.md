# UI density, scrolling and original-UI comparison audit

Reusable audit prompt, 2026-10-13. Requested by Weibao: compare the current
interface with the original YAIRPG UI, judge information density (too much,
too little, wrong place), scrolling burden and related problems, and learn how
other text-based and idle games handle the same pressures. Writing this prompt
does not launch the audit. Either Codex or Claude can run it.

## Role and limits

You are a UI auditor, not an implementer. Read source freely; do not edit
`src/`, `styles/`, `index.html`, `dist/` or tests. Write only the outputs named
below. No commits, pushes or publication.

- Use disposable browser origins and fresh saves. Never open, copy or modify
  Weibao's personal saves.
- Sealed secrets apply ([rule](../worlds/WORLD_SECRETS_AND_DISCOVERY.md#sealed-secrets-standard-rule-2026-10-10)).
  Screenshots and quotes must not reveal a sealed truth outside its discovery
  route. Refer to secrets by ID.
- Before starting, check live owners: the newest `CHECKPOINT.md`/`STATE.json`
  under `docs/gm/dispatch/` and running Codex/Claude workers. The audit is
  read-only, so it can run beside a writer, but note the source state you
  measured (bundle hash, `git status` summary, time).
- Findings and proposals are not accepted decisions. Follow the project's
  "everything possible, reasonably" rule: where several layouts are
  reasonable, propose them as player-selectable presets or options rather than
  picking one and deleting the rest.

## Read first

1. [PROJECT.md](../../PROJECT.md), especially "Original UI is the baseline
   (2026-10-02)" and "Vanilla stays intact".
2. Earlier audits. Build on them; do not redo their work. State which findings
   are fixed, changed or still open on the current build.
   - [UI consistency and modularity audit, 10-11](../UI_CONSISTENCY_AND_MODULARITY_AUDIT_2026-10-11.md)
   - [UI experience audit, 10-12](../UI_EXPERIENCE_AUDIT_2026-10-12.md) (F1 to F9)
   - [Thematic UI and information design, 10-12](../THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md)
     (P1 to P5, V1 to V5 and the proposed scrolling policy)
   - [UI completion ledger](dispatch/ui-experience-completion-2026-10-12/UI_LEDGER.md)
     and [report](dispatch/ui-experience-completion-2026-10-12/REPORT.md)
   - [Presentation and fourth wall](../PRESENTATION_AND_FOURTH_WALL.md)
3. Relevant UI source: `src/workspace_layout.js`, `src/workspace_views.js`,
   `src/workspace_state.js`, `src/display.js`, `src/structured_pack_ui.js`,
   `src/content_pack_ui.js`, `styles/workspace.css` and whatever they import
   for the panels you inspect.

## Starting observations (2026-10-13, current build, 1024×768 pane)

Quick look only, not measured across states. Verify, extend or correct them.

| ID | Observation |
|---|---|
| S1 | Local actions, where routine decisions happen, shows 143 px of 610 px of content. Opening Find work pushes Talk to someone partly out of view. Location prose takes 187 px and Time & weather 77 px above it. |
| S2 | Skills & practice shows three rows of sort/filter controls above an empty list. A layout toolbar (Authoring, Edit layout, Density) sits across the top during ordinary play. Each panel repeats a header grip. |
| S3 | A side vendor card and four option disclosures (Local life, Optional pacing, Equipment condition, Elemental preparation) share the action panel with Talk and Work. |
| S4 | "Hide completed" and "Hide max level skills" checkboxes sit apart from their labels. The Character & preparation stat list is clipped mid-row. |
| S5 | The opening page has 459 enabled buttons in the DOM, many in hidden or collapsed views. Check whether that cost is visible (focus order, screen readers, performance). |

## Part A: original vs current comparison

Baseline: the original game. Run both side by side.

- **Original:** `upstream/master` (currently `e3356432`, v0.5.5.30). Check it
  out in a separate `git worktree` outside the repo tree or under your
  scratch directory, serve it statically on its own port, and use its own
  fresh origin. If the fork's merged v0.6 differs materially in UI, also note
  the merge-base view.
- **Current:** the shared checkout's built `dist/bundle.js`. Rebuild only into
  a scratch copy if the bundle looks stale against source; do not overwrite
  shared build outputs.

Compare the same player situations in both:

| State | What to reach |
|---|---|
| T1 Opening | Fresh hero, first village screen |
| T2 Busy | A running job or activity with its timer and stop/finish control |
| T3 Combat | An ordinary fight with the combat log active |
| T4 Inventory | A populated inventory (twenty or more items) with equipment comparison |
| T5 Crafting | A crafting or recipe screen with several options |
| T6 Progressed | Several skills leveled, quests in progress, reports/log filled |
| T7 Fork-only | Expansion surfaces with no original counterpart: work ledger, structured packs, livelihood, customization/authoring. Judge these against the original's grammar, not against nothing. |

Viewports: 1366×768, 1440×900 and 1920×1080 usable area, plus one narrow
(about 400 px) layout and 150% zoom/large text. If the browser pane cannot
emulate a size faithfully, say so and use what it can.

For each state and viewport, record in both builds:

- What the original did well that the fork lost, and what the fork improved.
- Whether the next routine action, its cost/time, and current work are visible
  together without scrolling.
- Visual grammar consistency: do expansion controls look and behave like
  native ones?

## Part B: density and scrolling

Measure, don't only describe. Suggested metrics (add better ones if you find
them):

| Metric | Meaning |
|---|---|
| M1 First-screen decisions | Count of meaningful actions reachable with no scrolling or expanding |
| M2 Scroll owners | Number of independently scrolling regions visible at once; nested scrollers inside scrollers |
| M3 Hidden ratio | Content height ÷ visible height for each panel (S1 is 610/143 ≈ 4.3) |
| M4 Chrome ratio | Area given to controls, headers, filters and toolbars versus content |
| M5 Prose load | Words of non-actionable text on the first screen per state |
| M6 Clicks to routine | Clicks, scrolls and expands needed for the five most repeated actions (start work, eat/rest, fight, sell, craft) |
| M7 Stability | Whether refresh, timers or new log lines move buttons, jump scroll or steal focus |
| M8 Empty space | Panels showing empty lists or placeholder bodies at full size |

Then judge, with the measurements as evidence:

- **Too much:** information shown that does not change the current decision.
  Separate "always needed" (vitals, time, current work), "needed now"
  (the active decision's costs and outcomes) and "on request" (lore, history,
  full stats, options).
- **Too little:** missing decision facts (cost, duration, payout condition,
  failure or stop consequence, what changed after an action).
- **Wrong place:** facts shown far from the control they inform; settings and
  options mixed into play space.
- **Scrolling:** whole-page scroll during routine play, repeated scrolling
  between the same two controls, long logs without anchoring, scroll
  position lost on refresh.
- **And more:** progressive disclosure for new systems (how a new player learns
  what a panel is for), notification and log design (how results are
  reported and how old messages age out), number formatting and
  abbreviation, tooltip reliability and bounds, keyboard and focus order,
  contrast and reduced motion, and how theme/world identity affects
  legibility.

## Part C: how other games handle it

Research how text-heavy and idle games manage density, scrolling and
progressive disclosure. Use the games' actual UIs (play the web ones briefly
in a disposable tab, or use screenshots, wikis and developer writeups) and cite
sources. Suggested set, adjust as useful:

- **Idle and incremental:** A Dark Room, Candy Box 2, Kittens Game, Evolve,
  Trimps, Antimatter Dimensions, Melvor Idle, Progress Knight, Increlution,
  Idle Loops, Universal Paperclips, Theory of Magic, Your Chronicle.
- **Direct ancestors:** Proto23, and the original YAIRPG itself.
- **Text-heavy RPG and narrative:** Fallen London, Choice of Games titles,
  Cultist Simulator, Caves of Qud, Dwarf Fortress (Premium UI rework), NetHack
  or DCSS message logs, a modern MUD client such as Mudlet.

For each, extract patterns, not just impressions:

| Pattern family | Questions |
|---|---|
| Progressive disclosure | How are panels and resources revealed as they become relevant? (A Dark Room and Paperclips are strong references.) |
| Tabs vs dashboards | When does a game switch views instead of showing everything? How many tabs before it hurts? |
| Logs | Capacity, filtering, grouping repeated messages, highlighting important events |
| Decision cards | How costs, times and outcomes are attached to buttons (Fallen London storylets, Kittens' tooltips, Melvor skill pages) |
| Density control | Compact modes, collapsible groups, hiding maxed/completed items, player-built layouts |
| Long lists | Inventory sorting/filtering that stays out of the way until needed |
| Fit | Fixed one-screen layouts vs scrolling pages; behavior on laptops and phones |

Say which patterns fit YAIRPG's goals (dense stats, many worlds, life-sim,
original UI as baseline) and which do not, with a reason each.

## Output

1. Report: `docs/UI_DENSITY_AND_ORIGINAL_COMPARISON_AUDIT_<YYYY-MM-DD>.md`.
   Lead with a short conclusion. Then a findings table with codes (`F1`...),
   each with priority, evidence (screenshot path or measurement), affected
   state/viewport, and what is needed. Keep a separate table mapping the
   earlier audits' findings to fixed/changed/open.
2. Evidence: screenshots and a measurements JSON under
   `docs/reviews/ui-density-<YYYY-MM-DD>/`, original and current shots paired
   by state and viewport with matching names.
3. Reference section: the Part C patterns with citations and fit judgments.
4. Proposals: a ranked list of at most five finite implementation slices
   (`A1`...), each playable on its own, with the acceptance check that would
   prove it (state, viewport, metric target). Offer alternatives as player
   options where several are reasonable. Put lower-priority ideas in a
   separate backlog table.
5. Limits: what you could not exercise (states not reached, viewports the
   browser could not emulate, games you could only read about). Label them as
   unverified.

Finish with a short handback: report path, top three findings, top proposed
slice and what remains unverified.
