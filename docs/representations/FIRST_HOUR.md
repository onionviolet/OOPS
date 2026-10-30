# First hour, quests and goals (representation session, 2026-10-30)

Status: **proposals and a draft slice** (AD32). Nothing here is accepted direction; every
choice is the current best and open to refactor or replacement with a reason (AD45).
Target: desktop 1920×1080, Luminous default. Mobile deferred. Owner for the opening
beats and teaching palette: [intro flow](../INTRO_FLOW_CONSIDERATIONS_2026-10-13.md) (IF, CR, TE).
This doc adds a played first-timer log, a representation choice and one shipped slice.

## Round 1: design

### 1. Fresh-player walk (played headlessly, vanilla Village start, 2026-10-30)

Route: `game_new`, look, Talk to someone, elder, four dialogue lines. About 8 clicks and no
game time passes, so "15 in-game minutes" is really "the first 8 clicks"; time only moves
once the player walks to the field. Real Electron screenshot of minute 0 (main-checkout build, before any change) is
[before-electron-minute0.png](evidence/first-hour/before-electron-minute0.png).

| Code | Point of confusion | Evidence | Fix |
| --- | --- | --- | --- |
| FH1 | **No goal anywhere.** The only hint is "Choose someone or something here to inspect." A quest named "Lost memory" starts, but the Journal is not reachable yet, so it cannot be read. | Minute 0: 12 top-strip tabs, "All panels" list of 56 names, 5 location actions | **Shipped:** next-step line (below) |
| FH2 | **The one action that matters is third of five.** "Talk to someone" sits beside "Find work", "Cross to another world: Tingen" and "Mix at the Village counter", all ready at minute 0. | Screenshot | Next-step line names it; the staged-opening idea (FH9) hides the rest |
| FH3 | **Two routes to the elder with different results.** Clicking the elder under "Around you" only inspects; talking needs Local actions, Talk to someone, then Talk to village elder (3 clicks, then "Hello?"). | Walk | LATER: let an inspected person offer "Talk" directly |
| FH4 | **Raw error text as a player choice.** After "Hello?" one option read `"text not found, id: 'Ask about the moonlit herb bed'"`. | Walk, `src/data/dialogues.js:14` | **Shipped:** locale line added |
| FH5 | **Journal appears mid-conversation** ("Journal & received accounts is now available in navigation") with an unexplained "Open" link; "Known things (1 new)" is jargon. | Walk | ACCOUNT FOR NOW (the next-step line ends at the Journal and names it) |
| FH6 | **The stop after the elder's last line is silent.** He mentions a spare weapon, the field and wolf rats, but nothing says "the field is now in Move somewhere else". | Walk | **Shipped:** steps 3 to 5 say so |
| FH7 | **Four action rows and three tabs of Crafting, Mixing, "?"** at minute 0, none usable yet. | Screenshot | LATER: staged reveal by event (FH9) |
| FH8 | **Settings first-screen is 40 unrelated options** (pacing, hazards, kemonomimi). | Menu text | Out of scope; settings owner |
| FH9 | The `stagedOpening` setting exists but is a 4-step "Continue introduction" button gated by a counter, default off. It hides panels by click count, not by what the player has learned. | `src/display_settings.js`, `src/reveal_chain.js:81` | Proposal: drive stages from real events (talked to the elder, left the village, first fight). Default stays off until Weibao says; flipping a fallback changes every browser with no stored key |

### 2. Reference games (known from play or docs unless marked inferred)

| Game | What the first minutes do | Idea to adapt |
| --- | --- | --- |
| Stardew Valley, first week | A letter, a rucksack with tools, a journal with one current task; the map is small and each day opens one more thing | A single current task plus a small world. We already have the task (quest) but hide it |
| Melvor Idle onboarding | Locked skills show as greyed rows with the unlock condition | Show locked panels as one grey row with "after you meet the elder" (UR32), rather than hiding them or showing 56 |
| Disco Elysium opening | The first scene is only talking and inspecting; the game is the dialogue | Our elder dialogue is already this; keep it and add the goal line |
| Hades | Hub with one door that is obviously the run; progression shown as a few meters | One obvious next door: a "Show me" button |
| Idle games' progressive reveal (known pattern) | Panels appear when a counter first moves | Reveal on events with a one-line log (TE2) |
| Her Story / Obra Dinn (inferred fit) | No quest text; the interface is the question | Unconventional option, below |

### 3. Forms (brief item 18; each fits a different question)

1. **Goal card with a next step** (shipped). One line plus where to click. Fits "what do I do now": it is a single imperative, so a card.
2. **Staged reveal of panels.** Fits "what exists": a set that grows. Driven by events, with greyed stubs that say how they unlock.
3. **"What can I do here" overlay.** A key (`?` or Ctrl+K, UR28) that lists this place's verbs with one line each; no schedule, opened by the player. Fits "what are my options" and doubles as the discoverability answer for UIV2.
4. **Quest log with leads.** The Journal as a ledger: *Leads* (open threads, each with a next step) above *Done*. A lead is a promise that costs nothing to ignore. Fits several parallel threads later in the game.
5. **Unconventional: the world nudges.** No UI. The elder walks up, a neighbor mentions the field, the Reports log says it in character at the moment it becomes relevant. Needs a trigger table and prose per world; worth a later slice, since prose quality is a known gap.

Rejected: a modal tutorial (blocks the thing it teaches), a tooltip tour (UR38 and no memory).

### 4. Optional main goal (opt-in)

Accepted background: a world may offer an optional main goal and the player chooses whether to pursue it (OD24 and the 2026-10-29 direction in `LEAD_LIFE_RULES.md`). Proposal:
- **Default:** a world exposes at most one `goal` row (id, one-sentence aim, first step, what it asks for, what it changes). Nothing is assigned. The Journal's top row reads "Aim: none chosen" with "Choose one" listing the world's offered goals and "Just live here".
- **How the player opts in:** from that Journal row, or by an in-world offer (the elder's "Continue your search" is already one). Accepting adds a lead; dropping it removes the lead and never a consequence.
- **Dial and reason:** goal assignment can be on for a world whose story needs a spine (a book lead) and off for a sandbox start, because goals follow the player. The next-step line reads the chosen goal first, then the world's tutorial rows.
- Not built this slice (needs a per-world data row and a persisted choice, which is a save migration).

### 5. Where new systems announce themselves (UIV2)

Default: when a system first becomes reachable in a life, three things happen at once: a Reports line with the place ("Tingen is now in Worlds"), a dot on its nav tab until opened (TE3), and a row in the Journal's *Where things are* list (one line per unlocked system, with the click path). All panels stays a reference route. The shipped line already uses the same text shape ("Local actions: Talk to someone, then ...").

## Slice (shipped on this branch)

Reading (PRF1): a first-timer should see, at minute 0, one sentence saying what to do and the clicks to do it, without any saved layout changing.

| Item | Where |
| --- | --- |
| Derived next-step line; rows are data keyed on the opening quest's per-task finished flags and on the elder's own conversation lines (field cleared, field reported, cave cleared), so the line never asks for a report the elder cannot take; one authority, no new save fields. Shown only in the home Village world (`base.frontier`), so a player who crossed elsewhere sees nothing | `src/first_hour.js`, 1 mount line in `src/main.js` |
| Display setting "Next-step line (proposal)", default On, per browser, in "This browser" | `src/display_settings.js` |
| Style from workspace tokens only (UR6); sits under the top strip; hidden when the quest is done or the setting is off | `styles/workspace.css` |
| Fix: raw "text not found" dialogue option | `locales/english.js` |

Player sentence (PRF2): "Next step: Talk to the village elder. In Local actions: Talk to someone, then Talk to village elder." Text form is the line itself (UR37); "Show me" opens the named panel (UR32 equivalent for keyboard: it is a button in tab order).
Saved layouts (UR17): untouched; the card is not a workspace module. Existing saves with the quest in progress get the matching line; finished saves see nothing.
Rows beyond this world: add rows keyed on another opening quest (FND5: data first).

Evidence at 1920×1080, bundle sha256 prefix `aad58a34f98adbb1` (built from this branch, vanilla Village start, headless Chromium via `scripts/first_hour_browser.cjs`, route kind: browser, earned steps; the script also asserts that no dialogue option shows `text not found`, which proves FH4):
- before (setting Off): `evidence/first-hour/before-minute0.png`, `before-after-first-answer.png`, `before-sent-to-the-field.png`
- after (setting On): `evidence/first-hour/after-minute0.png`, `after-after-first-answer.png`, `after-sent-to-the-field.png`; step texts in `after-log.json`

Checks: `node --test tests/first_hour.test.js` (3, key on the task flag not a count, fight-before-weapon does not loop back, every row has words and a known module); reveal_chain, condition, combat_log, known_detail tests 31 pass; `check:arch` pass (`main.js` +2 lines, the import and the mount call, unpaid, inside the master baseline slack); `check:rules` pass. Not run: full `npm test` (the integrator runs it at merge, per the coordinator, 2026-10-30; my queued run was stopped), persistence (nothing persisted changes). Review state: agent-verified, not human-reviewed.

### ACT NOW / ACCOUNT FOR NOW / LATER

- **ACT NOW (done):** next-step line, setting, locale fix, tests, evidence.
- **ACCOUNT FOR NOW:** the card only covers the vanilla opening quest; other worlds' starts show nothing until rows exist (silent by design, FH empty state is "no card"). Decisions left to Weibao: the `stagedOpening` default and Journal eligibility. Journal eligibility during the opening quest left unchanged (one-line change in the registration loop in `main.js`; existing saves unaffected since they have already met the elder).
- **LATER/DELEGATE:** (a) event-driven staged reveal replacing the click counter, Sonnet, medium, done when a fresh life shows 5 panels and each new one logs its reason; (b) Journal *Leads* and *Where things are*, Sonnet, medium, done when a fresh Frontier life lists the elder's lead and Tingen's entrance; (c) optional main-goal row and persisted choice, Opus design plus migration, done when save, reload, Export and Import keep it; (d) Talk from the inspected person, small.

## Round 2 (review, brief items 1-21)

1. **Other games, with the adaptation.** Covered above (Stardew, Melvor, Disco Elysium, Hades, idle reveal). Plus own history: INTRO_FLOW TE1-TE9 (known), UR12/UR49 baseline: Proto23 and the original open straight onto one action list with no panels, which is why they read clearly (inferred from the baselines in the UI rules, not replayed this round).
2. **Fresh-player test.** Terms needing knowing at minute 0: "Local actions", "Around you", "Options · 5 (3 ready)", "All panels…", "Beginning", "Connection". Numbers without a meaning: AP 32, EP 25, Crit ×130%, "10C 2W" (UR61, UR70). Cheap fixes made: the next-step line, the raw-error row. Not made: the stat jargon (character-sheet session's panel).
3. **Space and density.** The line is one row at full width under the top strip: a compact glance (one line, many looks per minute, UR42), with the click path inline rather than behind a click. A split proposal: the center "Around you" panel answers "who and what is here" and "what can I do" at once; split the verbs into the Local actions panel only (it already exists) and leave Around you as inspection. Not done: shared shell.
4. **Bars and signals.** A step meter ("Step 2 of 5") was rejected: the number is arbitrary and the steps are not equal (UR61). A dot on the Journal tab when the quest changes is proposed (TE3).
5. **Pop-out and Electron.** No pop-out: the line must be where the eyes are. A Dock badge or notification is wrong for a first-hour hint. Browser fallback unaffected (the card draws into the node given, MDL13).
6. **Cheats and insight.** A revealed view would show the whole opening chain as a ladder with the player's place marked, labelled "from a cheat view"; sealed secrets are never in these rows because they are task text and click paths only. Developer inspector stays separate.
7. **Visual style.** Added one style only: a left accent bar and surface from workspace tokens. Alternative proposed for the gallery: paper-and-ink "margin note" (no box, a handwritten-feeling line and a pointer). Not built; the shared gallery file is frozen for this session. Works in Neutral by tokens; 14/21 px wraps (the `small` flexes to its own line); effects off: it has no motion.
8. **Use what we have.** Reused: quest task flags, `openWorkspaceModule`, display-settings registry, workspace tokens. Not reused and should be: `scene_card.js` for the optional goal row (two consumers: goals and quests), the notice-panel "Open" links.
9. **Unconventional.** "The world nudges" (form 5). Takes a trigger table (condition, speaker, line) per world and prose per world; worth one later slice after the Journal leads exist.
10. **Audit gaps.** Lead's run: the line must not tell a book lead what to do before a world offers a goal (rows are keyed on the quest, so none appear). Other seats and failure rows: nothing yet. Empty/error: no active quest means no card (hidden, not blank). Persistence: none. Performance: a 1 s tick that rewrites the DOM only on a step change; an event hook would be better (known limit). Accessibility: real `section` with aria-label and a button; 21 px wraps; effects off unaffected. Keyboard: card is first in tab order after the strip.
11. **Abstraction.** A *track* with a current row, keyed on a flag set (same shape as ledger rows and quest tasks). The next feature (a world tutorial, a goal) adds rows.
12. **Open for improvement.** Likely next refactor: replace the tick with a quest-progress event, and move the rows into per-world data. Known limit: the click-path text is hand-written and can drift if the UI is renamed; a test that checks each named control exists would catch it (not written).
13. **Flourish.** A soft pulse on the "Show me" target panel when pressed, using the existing glow token and obeying effects off. Not built (a settled, optional touch).
14. **Reports and center.** Reports: the quest changes already log as "Made some progress in quest"; the better line is subject-first, "Lost memory: next, the Infested field" with the glyph the time session defines. Center: the next-step line lifts the instruction out of the conversation prose; reference prose stays behind the dialogue. Shared shells left to the time and worlds sessions.
15. **Ability flourish.** Not this feature.
16. **Fold into existing UI.** Placed in the existing strip area, not a new surface. Proposed adjustment: the Journal quest row should show the current task's click path under it (reusing `first_hour` rows); "Known things" renamed to say what it holds. Saved layout and pins unaffected (UR17); a log line should say where the Journal now lives (UR13) when it unlocks.
17. **Later volumes and worlds.** Rows are data, keyed per opening quest; a book world adds its own quest id and rows. Checked: the lead-life rule that goals are optional and player-chosen; not checked: the later-volume reading outputs, left open, since the goal row's shape depends on the per-world start record.
18. **Form per part.** Goal: card. Systems that exist: staged reveal list. Options here: overlay. Threads: ledger with leads. Why not circles or a progress ring: the first hour is a sequence of instructions, not a cycle.
19. **Levels and depth.** Glance: one line. Depth one click away: the full chain with done, current and later rows (proposed *Leads* view). Later steps stay unnamed until reached, to avoid spoiling the chain.
20. **Semantic roles.** The marks mean `lead` (the current step), `done`, `locked-until` (a greyed stub). A world's motif could restyle them: in a school world a marginal note and a bell; in a wilderness world a trail blaze and a cairn.
21. **Drafts.** If a different structure is better: fold the line into the Journal's pinned top row and drop the banner. Reason to keep the banner for now: the Journal is not reachable at minute 0 (FH5). Revisit once leads exist.

### Gaps and limits (honest list)

Played only the vanilla Village start; Frontier and book-world starts were not walked. The headless MCP serves the main checkout, so the after captures use a Chromium script against this branch's bundle. Steps after the weapon (fight, report the field, clear the cave, report, Journal) are unit-tested against the elder's real chain (the quest's third task finishes on the cave report, not the field) but were not played end to end in a browser this round. The `stagedOpening` flip is proposed, not made.
