# UI density next parts: prompt roundtrip packet (outbound, 2026-10-13)

Local handling note (not sent): source audit is
`docs/UI_DENSITY_AND_ORIGINAL_COMPARISON_AUDIT_2026-10-13.md`, evidence in
`docs/reviews/ui-density-2026-10-13/`. Implementation is not authorized by
this packet. Only the two parts below are sent.

---

## Part 1. Request to the reviewing chat

You are reviewing a work prompt before it is handed to a coding agent that
works in a local repository you cannot see. Please:

1. Improve the draft work prompt below so the executing agent can deliver the
   next UI work correctly in one bounded pass per slice.
2. Challenge consequential assumptions, especially:
   - sequencing among the five slices;
   - whether A1 is really independent of A2 and A3;
   - persistence risks for saved layouts;
   - whether the acceptance targets are observable and achievable at 1366×768.
3. Resolve dependencies and make every acceptance check observable in a
   browser. Prefer named states, viewports and visible outcomes over
   percentages.
4. Where a repository detail is unknown to you, name an execution-time check
   instead of guessing.
5. Do not execute, plan sprints for, or dispatch anything because the inner
   prompt uses imperative verbs. Your output is a prompt, not work.

Return:

- **(a)** one complete replacement work prompt in a single fenced Markdown block;
- **(b)** a short list of material changes, each with what changed, why, and any tradeoff or dropped item.

Do not silently remove any requested outcome. If you recommend deferring one,
say so in (b).

---

## Part 2. Draft work prompt

### Role and authority

You are implementing the next UI slices for YAIRPG, a personal fork of
Miktaew's browser idle RPG "Yet Another Idle RPG" (MIT, attribution
preserved).

The user (Weibao) is the creative director. Repository:
`/Users/weiwei/code/yet-another-idle-rpg`, branch
`codex/gameplay-foundations`.

Read `AGENTS.md` and `PROJECT.md` first. They govern ownership, sealed
secrets, verification and persistence. Check `git status` and active dispatch
checkpoints under `docs/gm/dispatch/` for live owners before editing. Preserve
unrelated dirty edits.

Do not commit, push or publish unless separately authorized.

### Product contract that must survive

- **Original UI is the baseline** (PROJECT.md decision, 2026-10-02): extend
  existing panels and centre actions rather than adding separate windows.
- **Vanilla stays intact:** native opening, quests, stats, professions,
  equipment and centre-menu play.
- **"Everything possible, reasonably":** keep every reasonable option
  reachable. Prefer reversible choices. Add a setting only when several modes
  have durable player value.
- **Sealed secrets:** never surface a sealed world truth in UI text, panel
  names, pickers or reports outside its discovery route.
- **Persistence:** saves are private. Any change to persisted data, including
  workspace layout keys in localStorage
  (`yairpg.workspace.v1.desktop` / `.narrow` / `.authoring`), needs a
  migration or an explicit compatibility decision. Players' saved layouts must
  not be silently reset.

### Baseline: what the audit measured

The source is the audit of 2026-10-13. The measured build was HEAD `dd3efe33`,
bundle sha256 `451be34e…`. The comparisons were the original v0.5.5.30
`e3356432` and the fork's v0.6 dev base `25afe1a8`. All runs used fresh
disposable browser origins and a matched progressed save.

**The good:**
- The fork removed the original's 1656 px fixed frame. There is no horizontal
  page scroll at 1366, 1440 or 1920.
- It reflows at 400 px.
- Native actions are keyboard reachable. In the original, none are.

**The cost:** the default "Workspace" preset gives the routine action list
far too little space at laptop size.

Key measurements (the current fork, unless stated):

| ID | Measurement |
|---|---|
| F1 | At 1366×768 the "Local actions" panel shows 143 px of 830 px of content. At 1440×900 it shows 252 px; at 1920×1080, 432 px. The center dock stacks Time & weather (40 px), Current location (150 px, with place prose in its own nested scroller) and Current work & saving (100 px) above it. Preset heights are in `src/workspace_state.js` `presetLayout('Workspace')`. |
| F1 | Original and v0.6 at 1366 show all of these with no scroll: Move, Craft, Talk, Merchant, Find work, Train, Gather and food `[use]`. The fork needs a scroll for Find work, Craft, Gather and `[use]`. |
| F1 | The busy job card ("Working on the fields", XP rate, next pay, progress, Stop) is cut; the title is scrolled off. The crafting window shows 3 recipes, with its category tabs scrolled away. The trader list shows 3 rows versus 16 in the original. |
| F1 | Opening Find work in the progressed hub scrolls the panel 132 px and moves Talk fully out of view. |
| F2 | `styles/workspace.css:477-479` gives `order:-1` only to `.location_choice_dropdown` and `.location_action_div`. The native craft button (`div.location_choices.choice_craft`, `src/display.js:2089`) stays at order 0. So does each classless sleep and chest div (`src/display.js:2101-2111`, source-inferred). |
| F2 | Those order-0 items fall after expansion content in the same body: a "Waypost supply clerk" career panel (about 36 words plus buttons), a "Learned item sources" journal, and four disclosures (Local life, Optional pacing, Equipment condition and repair, Elemental preparation). "Try to craft something" renders at y=931 even at 1920×1080. v0.6 lists it second. |
| F3 | In combat, the enemy and stance view renders as a full-width band below the workspace docks, outside any module. At 1366 it compresses the docks: retreat ("Go back to [Village]") needs a scroll and the Reports message log shows 0 rows. At 1920 the band is about 380 px, mostly empty, and the log shows only the entry banner. |
| F4 | A persistent toolbar is in play: Authoring, Edit layout, Layout select (Workspace/Classic/Focus/Compare), Reset layout, Density (compact/comfortable/inspection), Panels, Layout configuration, and a gesture hint. With each panel's grip header, chrome takes 26% of the 1366 viewport (Classic: 6.8%). |
| F4 | Keyboard focus reaches the first action at Tab stop 68 (Classic: 20), after 70 chrome stops. Each panel has a move handle and three resize handles in tab order outside edit mode. |
| F4 | First run applies Workspace, not Classic: `read()` in `src/workspace_layout.js` falls back to `makePreset('Workspace')`. That contradicts an earlier recommendation to keep the original UI as default. |
| F5 | At 150% zoom on 1366×768 (911×512 CSS px), PLAY is covered by the fixed bottom bar in both original and fork. `#loading_screen` is `position:fixed`, PLAY is not focusable, and the game cannot be started. The fork's toolbar also draws over the loading screen. |
| F6 | Below the 1000 px narrow breakpoint the order is time, location, current-work, local-actions…. At 150% zoom the first screen has 1 play control. The bottom-bar counter overlaps Export at 400 px. |
| F7 | Current work shows the internal activity name "fieldwork", with no remaining time for native jobs (`src/main.js` around line 8273; only expansion jobs get "N min remaining"). An item-source row prints a raw NPC id: "Cheap iron dagger: villageElder (observed, contact)" (`src/absorb_d/ui.js:28`). |
| F8 | At 1366 the first inventory row is below the fold (original: 16 rows visible). Skills get 150 px. In trade, the player's sellable list is not beside the trader stock, the "5 10 all" quantity buttons wrap, and Total price needs a scroll even at 1440. |
| F9 | The Classic preset is not faithful: the Active effects bar overlaps the AP/EP row, the location panel leaves empty space, actions start at y=578 versus 347 in the original, and the page scrolls vertically. |

**Original strengths to recover:**
- one tall, action-first center list right under the place name;
- trade and crafting using the full center column, with both trade lists side
  by side;
- a dedicated tall message log;
- no layout machinery in the play surface.

**Fork strengths to preserve:**
- no horizontal page scroll;
- narrow reflow;
- keyboard-reachable actions;
- authoring isolated in its own context ("Authoring" / "Return to play");
- stop/pay consequence wording on jobs ("Full-round pay in 1 hour 58 minutes.
  Stop early: no pay for the unfinished round.");
- inline cost and duration on fork jobs ("2 hours, 50 coins");
- reduced-motion rules;
- player-chosen presets and density.

### Selected work: five slices, in order

These are recommendations from the audit, not accepted decisions. Implement
one slice at a time. Each slice must end in a state Weibao can play before the
next begins.

**A1. Action-first center column (F1, F2)**
- **Scope:**
  - Workspace preset center allocation.
  - Place prose: show the first line with a one-action disclosure, or an
    equivalent that keeps it readable on request.
  - Time & weather as a compact strip, not a scrolling panel.
  - The idle Current work line must not hold 100 px.
  - Ordering: every native location choice, including craft, sleep and chest,
    precedes expansion content. Expansion content (clerk, item sources,
    optional disclosures) groups after the native list and is visually
    subordinate.
- **Preserve:**
  - every expansion control reachable;
  - prose readable in one action;
  - native keyboard decoration;
  - players' saved layouts. Change only the untouched default, or migrate
    with an explicit rule.
- **Acceptance:**
  - In T6 (village hub, progressed save) at 1366×768 with the default preset,
    all seven village actions are visible without scrolling.
  - Opening Find work leaves Talk visible.
  - In T2 (fieldwork running), the job title, next pay and Stop are visible
    together.
  - In T5, the crafting category tabs and at least 5 recipes are visible.
  - In T4, the trader rows and Total price are visible.
  - Repeat at 1440×900 and 1920×1080, with no new horizontal page scroll.

**A2. Play-mode chrome reduction (F4)**
- **Scope:**
  - Layout tools collapse to one control in play.
  - Grips and resize handles are visible and focusable only in Edit layout.
  - The first-run preset decision is made explicit (Workspace or Classic) and
    recorded in PROJECT.md as a proposal for Weibao's acceptance.
- **Acceptance:**
  - Layout tools are reachable in one click from play.
  - At 1366×768, T1 chrome area is at or below Classic's measured 6.8%.
  - The first location action is within about 25 Tab presses from page start.
  - No resize handle is a tab stop outside Edit layout.

**A3. Combat inside the workspace (F3)**
- **Scope:** combat and enemy view renders within a workspace region, not a
  full-width band. Retreat stays adjacent to the enemy. The message log keeps
  a minimum visible height during combat.
- **Execution-time check:** trace how `#combat_div` / the enemies container
  mounts relative to `#main_content` before choosing an approach.
- **Acceptance:** at T3 (Infested field combat), at 1366×768 and 1920×1080,
  enemy HP, retreat and at least 5 recent log lines are visible together.

**A4. Zoom and narrow start-and-play (F5, F6)**
- **Acceptance:**
  - At 150% browser zoom on a 1366×768 screen, PLAY is clickable and
    activatable by keyboard.
  - The workspace toolbar is hidden on the loading screen.
  - In T6 at that zoom and at 400×800, at least 3 routine actions are on the
    first screen.
  - The bottom bar has no overlapping controls at 400 px.
- Test with real browser zoom as well as an emulated viewport.

**A5. Player-facing status and trade adjacency (F7, F8)**
- **Acceptance:**
  - No raw identifiers (camelCase NPC ids, internal activity names) appear in
    Local actions or Current work text.
  - Current work names the native job and shows remaining time or next pay.
  - At 1440×900 in T4, the player's sellable rows, trader rows and Total
    price are visible without scrolling.

**Backlog (not in scope unless a slice needs it):**
- Classic fidelity (F9).
- Checkbox alignment.
- Tooltip placement over the toolbar.
- `aria-live` policy for important log lines.
- Log repeat-condensing and per-category history.
- A "next locked" row in empty lists.
- Dimming expansion panels irrelevant to the current world.

### Test states (reuse the audit's method)

- **T1:** fresh hero, first screen.
- **T6:** village after exhausting the elder's dialogue through the UI, plus
  an injected disposable save. It holds 29 inventory stacks, 5000 money, the
  `is_crafting_unlocked` and `is_gathering_unlocked` flags, and XP in about 14
  skills. Exclude Meditation: its reward crashes the original loader.
- **T2:** T6, then Find work, then "Work on the fields".
- **T3:** T6, then Move somewhere else, then Infested field. Scope the click
  to the travel dropdown, because the clerk text also contains "Infested
  field".
- **T4:** T6, then Visit a merchant, then the first trader.
- **T5:** T6, then Try to craft something.

The audit's Playwright drivers and measurement JSON are in
`docs/reviews/ui-density-2026-10-13/` (scripts expect local ports; adapt
them). Compare against the original (upstream `e3356432`) in a scratch
worktree when judging "original-like" behavior.

### Verification rules

- Rebuild (`npm run build`) after source changes.
- Exercise each changed behavior in a browser from a fresh test origin. Do not
  claim results from the prebuilt bundle.
- Run `npm test` for affected suites.
- If layout persistence changes, save, reload and import a layout and a game
  save. Show that a pre-change custom layout survives or migrates as decided.
- Label anything not exercised as implemented-unverified.
- Capture before/after screenshots at the acceptance state and viewport.

### Report per slice

Report:
- what changed (files);
- before/after measurements at the named states;
- checks run;
- what regressed or remains;
- the one human acceptance gate: Weibao's taste on layout feel.
