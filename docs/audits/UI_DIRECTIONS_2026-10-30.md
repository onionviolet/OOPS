# UI directions: four whole-UI structures from one game state (2026-10-30)

Weibao: "Overall UI pass to make things intuitive? different design possibilities and more? Send out design rounds for stuff that need them?" Everything here is a proposal (AD32). Nothing has his yes, no live shell file changed, and the default proceeds unless he objects. This round compares whole structures; it does not repeat [UI design core audit](UI_DESIGN_CORE_AUDIT.md) rounds 8-14 or the single-view [representation docs](../representations/).

Target: desktop and laptop, 1920×1080, Luminous Gothic default, 14 px and 21 px text, effects on and off ([standing UI priority](../USER_VISION.md#standing-ui-priority-2026-10-13)). Mobile and the MacBook size are deferred and were not checked.

## Evidence and its limits

- **Played:** two fresh lives through the `yairpg-game` MCP on this checkout's bundle, which matches `HEAD` (a rebuild produced no diff). Village (seed 3001): first screen, talk route, cross route. Tingen (seed 3002, Nighthawk probationer): the six-life entry page, the "Before you cross" threshold, the first report to Warden Hale, declining the dose, 60 minutes of idle time. That is about ten actions per life, not twenty minutes each; every finding below was seen in those actions and nothing is inferred from other sessions.
- **Browser walk (rebuilt bundle, headless Chromium, 1920×1080, 14 px, fresh Village life, `scripts/ui_directions_live_probe.cjs`, `evidence/…/live-probe.json`):** 85 workspace modules mounted, 11 visible (You, Stats & equipment, Condition, Around you, Inventory tools, Inventory, Village scene, Current work & saving, Local actions, Center views, Reports), 90 visible controls, 9,335 DOM nodes, and an "All panels…" select of 53 entries (56 after the dialogue). The Tingen cross click showed 10 visible modules and 9,801 nodes. The walk reached the Village and the crossing click only, not the Tingen life itself (that is the MCP play above), and did not measure the MacBook size.
- **Gaps doc:** `UI_CAPABILITY_GAPS_2026-10-30.md` (`bk-gaps`) had not landed when this was written. This round designs against UIW1-UIW9 (round 8) and FH1-FH5 ([first hour](../representations/FIRST_HOUR.md)). Fold the gaps doc in when it lands (see LATER).
- **Mocks:** `ui-directions.html` (`npm run build:directions` equivalent: `node scripts/build_ui_directions.mjs`), module `src/ui/preview/ui_directions.js`, fixture `src/ui/preview/fixtures/ui_directions.js`, test `tests/ui_directions.test.js`. Village and Tingen strings are the played ones; the agenda rows, Village place times and Tingen's next-step line are illustrative and marked so in the fixture. Evidence: [ui-directions-2026-10-30](evidence/ui-directions-2026-10-30/).

## What play showed about the structure

| Code | Finding (seen in play) | Why it is structural |
| --- | --- | --- |
| UDF1 | **The first screen offers 13 route buttons, a 53-entry "All panels…" list, 11 visible panels, 90 visible controls (145 in the MCP action list) and about 9,300 DOM nodes from 85 mounted modules**, plus a Next step band that says one thing: "Talk to the village elder." The band is the best part of it. | Counting routes is not the problem; the player must choose between three navigation systems (routes, list, the panels already open). |
| UDF2 | **The Next step band disappears in Tingen.** After the first report and declining the dose, the band was removed and nothing replaced it. Both night-watch tasks stayed blocked with no pointer. | The one orientation device exists in one world. Every direction needs it everywhere. |
| UDF3 | **One click grew Local actions from 7 to 22 entries** in Tingen. An irreversible dose offer sits beside spirit contracts and "Return to Tingen docks" rows that cannot run. | Centre density is set by whatever the last scene registered, with no "available now" fold. |
| UDF4 | **Blocked reasons come in two grades.** "It costs 8 merit; you hold 0." names the cost; "The required knowledge, means or circumstances are missing." (both watch tasks) names nothing (UIW5 confirmed). | A structure that shows blocked rows must show a next move for each. |
| UDF5 | **The header shows "Local weather unavailable" and "Local date unavailable"** at Tingen's first hour (UIW4 confirmed). | Missing readings look like faults. |
| UDF6 | **Idle time says nothing.** Sixty minutes passed with two notices ("Statistics … now available in navigation", "World events …"). No line says what changed, who is waiting or what is due. The job line reads "Current work & saving" whether or not work runs. | The idle-game payoff (a return note, round 8 O3) is not there. This is what separates "idle" from "active" for the player. |
| UDF7 | **New-route notices pile up.** Three "now available in navigation" notices with "Related panel ›" links arrived in the first minute in Tingen and two more within the hour. | Reveals are announced one by one, so navigation growth is noise. |
| UDF8 | **The crossing flow is the best-structured screen played.** The six-life entry page is a document, but "Before you cross" has four fixed headings (Crosses with you, Stays behind, Pauses, Waiting on the far side) and one confirm. | A threshold shape exists and works; other thresholds can copy it. |
| UDF9 | **The Tingen workroom page stacks pathway ladder, plan the next crossing, clearance, merit, evidence store, brewing bench and places in one column.** The first useful step ("Report to the supervisor … Available now") sits mid-page (UIW6 confirmed). | Service views behave as documents when they have many parts. |

## How the directions line up with round 8

Round 8 ranked O1 (finish shared shapes, then clean) as the default and left O2 (six hubs and Ctrl+K), O3 (a day page) and O4 (diegetic scene navigation, "not now") for later. This round uses play to place them.

| Round 8 call | Direction | What play adds |
| --- | --- | --- |
| O1 + O2 | **A** | UDF1, UDF3 and UDF7 are all solved without moving the centre. Agrees with O1 and the order of O2. |
| O3 | **B** | UDF6 is the strongest finding in the round: the day page is not a luxury. Moves O3 from "capstone" to "second step", still after the return note (B1) lands. |
| UR28 jump | **C** | UDF1 and UDF3 are both search problems once a place offers 20+ verbs. Agrees that Ctrl+K belongs; overturns "last" for a first, small version (jump by name, no verbs). |
| O4 | **D** | Does not overturn "not now" for structure. Play shows the Tingen threshold and workroom would gain most from a world-reacting skin, which round 13's motif layer already allows without restructuring. |

## The four directions

All four use the same fixtures: Village at 08:00 on day 1, and Tingen at 09:00 on day 1. Captures are in [evidence/ui-directions-2026-10-30](evidence/ui-directions-2026-10-30/) as `{a,b,c,d}-{village,tingen}-{14,21}px-fx-{full,off}.png` (not every pair is captured; see `capture-report.json`).

### A. The current panels, refined (lowest cost)

- **Idea.** Keep the workspace of docked panels. Replace the 13 route buttons and the 56-entry list with six hubs (You, Belongings, People, Work and time, World, System; round 8 O2) and a Ctrl+K jump. Keep one Next step band in every world, put a return note at the top of Reports, fold Local actions into "available now" and "later", and print each blocked reason in words.
- **First five seconds.** Place, weather and clock; the Next step band with "Show me"; five panels (You, Around you, Local actions, Reports, Belongings) at readable size; six hub buttons, one with a dot. Nothing else needs to be read to act.
- **The 21 views.** Each view keeps its home route and moves under a hub; the mapping is `VIEWS` in the fixture (First hour and chronicle return under Today/Work and time, character sheet and body under You, talk, web and family under People, maps, spacetime and crossings under World). Panels already registered stay registered.
- **Density.** Same grid as today: three columns, about 22 / 50 / 28 percent. At 21 px the left column's stat rows and the centre's quote lines wrap; the layout rules (UR35-UR38) already scroll panel bodies.
- **Effects off.** Every fact is text. The Next step glow and the "pick" accent are the only effects; both drop to a solid accent border.
- **Cost and migration.** About two sessions: group the route strip and list (UIW2, UIW3), lazy-mount hidden panels, move Authoring, Layout and density under Settings, add the band to Tingen. Saved layouts and pins load unchanged (UR17); a moved route keeps its id, so `pin` and `collapse` state survive, and each move logs a line and a dot (UR13). The test in `tests/ui_directions.test.js` checks that the six hubs hold the 13 routes exactly once.
- **Patterns drawn from.** VS Code's activity bar and side panels (hubs over a flat list), Cogmind's always-visible dense panels (nothing hidden behind a menu).

### B. A day or plan hub

- **Idea.** The first thing open on a morning or a return is one Today page: a suggested move as a scene card (built from `scene_card.js`), what is due and when, who wants you, and the return note. Panels become drill-ins (a drawer opened from a chip), not the home.
- **First five seconds.** "Today · 01/04/999", one sentence saying what changed, a framed card whose title is the suggestion and whose rows carry time and cost, the people who want something. The player reads top to bottom once.
- **The 21 views.** Each one becomes a drill-in off one of five Today sections; the day page owns the first hour, the return note and chronicle digest, the timeline and the agenda directly. Combat and crossings are interrupts that take over the page as scene cards (SUI8).
- **Density.** A single reading column of about 900 px beside a rail and a side column; at 21 px the card stays on one screen, the two-up lists stack.
- **Effects off.** The card's glow drops to a border; the "now / open / soon" rows keep their words.
- **Cost and migration.** About four sessions after B1 (return note) and B4 (timeline) land; the page reads their shapes and builds no new model. Panel layouts and pins stay valid because panels still mount, only the default open surface changes (UR17); a "Today" route is added and nothing is removed (UR13).
- **Patterns drawn from.** Football Manager's inbox and dashboard, Crusader Kings 3's notification stack, the morning summary in management sims. Patterns only.

### C. Task-first: palette, verbs, search

- **Idea.** A quiet status screen plus a palette. The palette lists everything doable and openable, ranked by the Next step, filtered by verb chips (Talk, Work, Make, Travel, Study, Inspect, Views) and by typed text. Enter does the thing; Tab opens its view beside the palette.
- **First five seconds.** The screen is deliberately sparse (header, vitals, Reports); the palette opens with the Next step ranked first and a one-line key legend. A new player who does not press anything sees a suggested card and little else.
- **The 21 views.** Each view is a result kind ("View: Relationship web"), each action a verb result, each person a Talk result; panels open on demand as slim drawers beside the status.
- **Density.** Highest information per pixel for a player who knows the verbs; lowest for one who does not, because a blank palette gives no orientation. At 21 px the result list needs only 8 rows.
- **Effects off.** The highlighted first row keeps a solid fill.
- **Cost and migration.** About three sessions for the palette, plus the verb tagging on every action row (a data change on registered actions, with a test that each has a verb). Layouts and pins stay valid if panels stay mounted; the risk is that nothing tells the player the palette exists, which is why A takes only the jump-by-name half.
- **Patterns drawn from.** Command palettes in VS Code and Raycast; NetHack's `#` extended commands.

### D. One unconventional direction: the desk (diegetic, world-reacting)

- **Idea.** The screen is a desk. A notebook holds the next step, today and the return note; a map table holds the places (drawn with `renderFigure`), the people as cards and the actions as a row; letters are Reports; a satchel strip holds items and vitals. The desk re-skins per world by tokens: rough wood and parchment in the Village, brass and ink in Tingen (round 13 FLA2).
- **First five seconds.** A notebook open to one handwritten line ("Talk to the village elder."), a map with "you are here", two person cards. The metaphor explains where things are; it does not explain what to do.
- **The 21 views.** Each maps to an object (`VIEWS` column four: notebook, mirror, satchel, bench, corkboard, ledger book, door, map table, letters). This is the hardest direction to scale: 21 views need 21 object types, and many have no natural place on one desk.
- **Density.** Lowest. The map table's figure and the notebook's margin eat space; at 21 px the notebook wraps past one page.
- **Effects off.** The skin stays; only glow and rotation drop out. Parchment and ink contrast must be checked at 21 px (measured below).
- **Cost and migration.** Rewrite-scale for structure (round 8 O4 said so), but about half a session as a skin: four tokens per world. Saved layouts and pins would not map to desk objects, so a full D needs a written compatibility decision (UR17) and a "Panels" escape hatch.
- **Patterns drawn from.** The book and desk in Return of the Obra Dinn and Papers, Please, the journal in 80 Days. Patterns only.

## Comparison

| | A | B | C | D |
| --- | --- | --- | --- | --- |
| New player, first five seconds | Next step band and five panels | One card, one column | A palette and a hint | A notebook line and a map |
| Returning player | Return note in Reports | The page's first section | Not addressed | Notebook page |
| 21 views fold in | Under six hubs | Under five sections plus drill-ins | As result kinds | As objects (hard) |
| Text size 14 / 21 | Fits, panels scroll | Fits | Fits, fewest rows | Wraps first |
| Effects off | Clean | Clean | Clean | Clean, skin kept |
| Cost | About 2 sessions | About 4, after B1/B4 | About 3 | Skin 0.5; structure rewrite |
| Saved layouts and pins | Unchanged | Unchanged | Unchanged if panels stay mounted | Needs a decision |

## Recommendation (a proposal, proceeds unless Weibao objects)

**Default: A, carrying the return note from B and the jump from C.**

1. **A is the structure.** It solves UDF1, UDF3, UDF7 and UDF9 with the least movement, keeps every saved layout (UR17), and Weibao's standing preference is for independent panels visible at 1920×1080.
2. **B's return note and Today surface come second.** UDF6 shows that nothing tells the player what changed. The return note sits in Reports at first (B1 shape); the full Today page opens on a return or a new morning once B4's timeline shape exists.
3. **C's jump-by-name rides with A.** A first, small Ctrl+K (UR28) that jumps to a place, person, panel or view; verbs and chips wait until a place regularly offers more than about 30 options.
4. **D is a skin, not the structure.** One book world (Tingen first, since its workroom is the most document-like screen played) gets the desk tokens through the motif layer (round 13), with the panels unchanged.

### When the others win

- **B wins** when Weibao plays in short returns across days, or when lives run long between sessions. Dial: open on Today after any absence over an hour of game time, otherwise open on the workspace.
- **C wins** where a place offers more than about 30 verbs, for keyboard-led play, or in Authoring.
- **D wins** for a single book world as a skin, or if he wants a whole-world feel more than speed. It does not win as the structure for all worlds, by cost and by view count.

### Elements worth taking from each, whichever wins

- From A: six hubs, one Next step band everywhere, "available now / later" in Local actions.
- From B: the return note, the "due today" list, the suggested-move scene card.
- From C: verb tags on action rows (also enables filtering in A), Ctrl+K jump by name.
- From D: world skin tokens (surface, ink, rule, accent), a handwritten-style next step line in Tingen, the map table as the map view's home.

## Cheap enough to ship into the current UI now

| Rank | Change | Owner | Level and effort | Done check |
| --- | --- | --- | --- | --- |
| 1 | **A Next step band in every world,** with a fallback: the first ready, reversible action; or, when all are blocked, the blocked reason naming what is missing (UDF2, UDF4). | General UI coordinator (first-hour lane) | Sonnet medium, one session | A fresh Tingen life shows a band after the first report; a blocked-only scene names the missing thing; effects off keeps it. |
| 2 | **Specific blocked reasons and a real header for missing readings** ("The required knowledge…" replaced by the missing thing; "Local weather unavailable" replaced by an in-world line or hidden) (UIW4, UIW5). | `ui-defects` | Haiku or Sonnet low, one session | No generic reason string remains in the Tingen and Village routes; header chips read as the world. |
| 3 | **Fold reveal notices into one Reports line with a dot, and add the return note** after an absence or a long step (UDF6, UDF7; round 8 coverage B1). | General UI coordinator (time and chronicle lane, reuse `RETURN_DIGEST`) | Sonnet medium, one session | Stepping 60 minutes produces one line saying what changed and what is due; three simultaneous reveals produce one line; UR13 dot on the nav. |

## Features that still lack a design round

| Feature | Suggested owner | Level and effort | Done check |
| --- | --- | --- | --- |
| Ctrl+K jump and later verbs (UR28) | General UI coordinator | Sonnet medium, one session for jump by name | Jump reaches every place, person, panel and view by name; no verb layer yet. |
| Notices and reveal system (UDF7), including route reveals and "Related panel" links | General UI coordinator | Sonnet medium, half a session | One reveal batch makes one line; the count is tested. |
| Settings, Layout and Authoring placement (UIW3) | `ui-defects` | Sonnet low, half a session | The player strip holds only player routes. |
| Local actions fold ("available now", "later", irreversible marker) (UDF3) | General UI coordinator | Sonnet medium, one session | Tingen after one click shows under 10 rows open and the rest folded; irreversible rows carry a glyph plus the word. |
| Threshold screens as one shape (crossing, start, return) (UDF8) | General UI coordinator | Sonnet medium, one session | Start and return use the four crossing headings. |
| Companions, party and pets (no owner before `bk-party`) | `bk-party` | Opus design, then Sonnet | Round 1 reference review and a mock; `bk-party` is already working on it, so fold in rather than repeat. |
| MacBook and 21 px layout pass | General UI coordinator | Sonnet low, small, when Weibao asks for laptop size | Capture at 1536×864 and 21 px for A. |
| World skin pack for Tingen (D as skin) | Round 13 motif lane | Sonnet medium, one session, with Weibao's look | Four tokens, contrast at 21 px, text forms unchanged. |

## ACT NOW, ACCOUNT FOR NOW, LATER

- **ACT NOW (done this round):** the findings, the four mocks, the render test, the evidence folder, the CHOICES backlog entry and the loose ideas file.
- **ACCOUNT FOR NOW:** the mock is a proposal; any lane that builds A's pieces cites UR13 and UR17 and runs a saved-layout load test. The gallery imports no live shell file; `tests/ui_directions.test.js` checks this.
- **LATER / DELEGATE:** fold `UI_CAPABILITY_GAPS_2026-10-30.md` into this round when it lands (Sonnet low, small; done when each gap names which direction closes it); rerun the browser walk when a slot is free (`node scripts/slot_run.mjs --kind browser -- node scripts/ui_directions_live_probe.cjs`).

## Part 2: information-dense games, Minecraft mods, sections and the UI system itself

Weibao, later the same day: "For the whole UI direction, we would need to consider other information dense games and more, how things are organized? Consider the difficulty of implementation and more? Consider creativity and more, sectioning things? making them intuitive and easy ish to understand? The UI system should be modified to be able to be as comprehensive as possible? Consider also absorbing or taking inspiration from Minecraft mods and other games and more too?"

**Source status.** Rows G1-G7 below come from the [panel design absorption](../research/PANEL_DESIGN_ABSORPTION_2026-10-15.md) scout, which cites pinned sources. The other rows (Dwarf Fortress, EVE, Paradox, Path of Exile, RimWorld, the mods) are patterns recalled from general knowledge of those games and mods, not re-read or captured this round, so treat them as leads until `bk-scout` or a capture confirms them. Patterns only; nothing is copied, and the scout notes licences differ (Patchouli CC-BY-NC-SA, FTB Quests All Rights Reserved), so no mod assets or text are reused.

### Patterns by reference, and where each direction uses them

| Reference | Pattern worth taking | Used by | Cost to adopt |
| --- | --- | --- | --- |
| Melvor Idle (G2) | Named skill navigation in collapsible groups | A (hubs) | Low, nav only |
| Kittens Game (G3) | Stable regions plus earned tabs; log always visible | A | Low, already close |
| Proto23 (G1) | Earned reveals and list/detail panes | A, B | Moderate, existing owner |
| Factorio (G5) | Factoriopedia: follow inputs and uses; search and pin; an alert opens its exact subject | C (index), A (alerts) | Moderate to high: observer filtering |
| A Dark Room (G7) | A story beat introduces a new place and its home | A, B | Moderate |
| Dwarf Fortress Premium UI | Bottom category bar with context sidebars; keys for everything | C (keys) | Moderate |
| EVE Online | Launcher bar; windows that tab, dock and pop out; filterable overview of what is near | A (docking), C | Layout primitives exist in part |
| Crusader Kings 3, Stellaris | Nested tooltips (hover inside a tooltip, pin it), outliner of things that need you, alert icons on the top bar | B (outliner is the Today list), A (tooltips) | Nested tooltips: moderate; outliner: low once timeline shape lands |
| RimWorld | Alerts at the edge, a grid of priorities in one tab, a colonist bar always visible | B (alerts), A (person bar) | Low to moderate |
| Path of Exile | Search and filter boxes everywhere; compare tooltip beside the equipped item | C (search), A (compare) | Moderate; compare exists as a panel |
| Minecraft: JEI and EMI | Press a key on any item for "where does it come from" and "what uses it" | C, and Part 2 index | Moderate to high |
| Minecraft: FTB Quests, BetterQuesting | Prerequisite tree with visible state per node | B (plans), rep views | Low: `figure.js` track and tree layouts exist |
| Minecraft: Patchouli | In-game guidebook with linked entries that unlock with play | Codex (below) | Moderate; `discovery_codex.js` is the existing seam, not read this round |
| Minecraft: Create Ponder | Short animated demonstration of a mechanism | D, Codex | High; defer |
| Minecraft: Applied Energistics 2 terminals | One searchable, sortable list over everything stored; craft status panel | C, Belongings | Moderate; inventory search exists |
| Minecraft: Waystones, Xaero's map | Named fast-travel list; waypoints on a map | D (map table), A (World hub) | Low to moderate; maps rep exists |

### Sectioning as an axis: the 21 views in each direction's tree

Each direction groups the same 21 views (`VIEWS` in the fixture) differently. Section names are the player's words; a subsection is a tab or a drill-in.

| Section | A: six hubs | B: day page and drill-ins | C: verb results | D: desk objects |
| --- | --- | --- | --- | --- |
| Self | **You:** character sheet, abilities, body and conditions | Drill-in "You" | Inspect: sheet, body; Study: abilities | Mirror (sheet, body), notebook skills |
| Things | **Belongings:** items, mixing, crafting, rituals | Drill-in "Belongings" | Make: crafting, mixing, rituals; Inspect: items | Satchel (items), bench (make) |
| Others | **People:** talk, relationship web, family tree, organizations | "Who wants you" section, drill-in "People" | Talk: talk, web, family; Join: organizations | Table person cards, corkboard (web, tree), letters (orgs) |
| Work and time | **Work and time:** first hour, time and chronicle, knowledge, research, combat | "Due today" and the return note; drill-ins for knowledge and research | Study: knowledge, research; Learn: first hour, chronicle; Fight: combat | Notebook (today, knowledge, research), calendar, door (combat) |
| World | **World:** maps and travel, spacetime, worlds and crossings, economy and institutions | Drill-in "Map"; crossings as an interrupt card | Travel: maps, spacetime, crossings; Trade: economy | Map table (maps, spacetime), door (crossings), ledger book (economy) |
| System | **System:** connection, settings, data, authoring and layout (moved here, UIW3) | Drill-in "Settings" | Views: settings; verbs for save and export | Drawer |

Subsections by hub in A: **You** has Sheet / Body / Abilities; **Belongings** has Carried / Gear / Make; **People** has Here / Known / Web and family / Organizations; **Work and time** has Today / Journal / Knowledge and research / Combat; **World** has Map / Crossings / Economy; **System** has Settings / Data / Layout. The sections come from how the 21 view docs already group (self, things, others, time, world); no view needs a new home, which is why A's migration is mostly a rename of routes.

### Difficulty of implementation, scored

Scale 1 (small) to 5 (large). Footprints come from the repo: `src/workspace_layout.js` 632 lines, `src/village_workspace.js` 313, `src/layout_spec.js` 385, `src/panel_reveal.js` 33, `src/main.js` about 10,000. Existing tests touching them are few (layout_spec in 6 test files, workspace_layout and village_workspace in 3 each, panel_reveal in 2), so the main test cost is new tests, not repairing old ones.

| Direction | Files touched | Migration | Test cost | Total | Reading |
| --- | --- | --- | --- | --- | --- |
| A refined | 2: nav registration in `layout_spec.js` and `village_workspace.js`; `panel_reveal.js`; Local actions fold; band in each world's shell | 1: route ids stay, hubs are a grouping; pins and layouts load unchanged | 2: hubs-hold-routes test, saved-layout load test, band presence per world | 5-6 of 15 | Cheapest |
| B day hub | 3: a new Today surface, B1 note and B4 timeline owners, a default-open rule | 2: new default surface; panel layouts keep | 3: return-note and agenda from fixtures, absence rule, scene-card hosting | 8 of 15 | Needs B1 and B4 first |
| C task-first | 4: palette module, a verb tag on every registered action, index over people, panels, items, views, observer filter | 3: verb tags are data on registered actions; a missing tag must fail a test | 4: search recall, observer safety (no unknown names), keyboard path | 11 of 15 | Index is the hard part; jump-by-name alone scores about 6 |
| D desk | 5+: new structure, object per view, skin tokens | 5: layouts and pins have no desk home; written decision needed (UR17) | 4: every view reachable from an object; contrast at 21 px | 14 of 15 as structure; 4-5 of 15 as a skin | Skin only |

### What the UI system itself needs to be as comprehensive as possible

Default for each capability, with a dial. "Exists" is from the panel menu seen in play (Pin, Options, Dock left/center/right, Floating, collapse, Expand) and the shared modules; "gap" is what is missing.

| Capability | Today | Default | Dial |
| --- | --- | --- | --- |
| **Layout primitives:** docking, tabs, split, pop-out | Dock left/centre/right, float, pin, collapse and expand exist; the figure and scene card are written to draw into a pop-out window (MDL13). Tabs and split are gaps. | Add tabs (stack two panels in one slot) and a drill-in drawer; keep docking and pop-out as is. | Layout menu offers "stack" only in Authoring until tabs prove out. |
| **Nested tooltips** | Item inspection ("Inspection is free · Esc closes") and hover descriptions exist; nesting does not. | Hover a term inside a tooltip to open a second one; Shift pins it. Observer-safe terms only. | Off by default for touch; depth capped at two. |
| **Global search and lookup index** | Ctrl+K is proposed (UR28), not built. Inventory filter exists. | One index over known places, people, panels, views, items and actions, with a JEI-style pair of answers on any item or ability: "where from" and "what uses". Names an unknown thing as "?" only. | Scope: current place, current world, everything known. Keyboard-first, mouse optional. |
| **Guidebook and codex** | `discovery_codex.js` and research views exist (not read this round). | A Patchouli-style codex whose entries unlock by play and link to the rule, the view and the place that uses it; each entry has a text form. | Spoiler dial: hide entries until met, or show titles only. Sealed secrets stay sealed (AGENTS.md). |
| **Keyboard access** | Esc closes inspection; Ctrl+K is not built. | A consistent key map: jump, back, next panel, do suggested action, open codex. Listed in Settings and in the palette's footer. | Remappable in Settings; off for players who do not want it. |
| **Pin and compare** | Pins exist; a separate Equipment comparison panel exists. | Pin any item, person or place card beside the workspace; two pins compare as columns. A pin never grants a remote action (scout, panel design, "watching is not operating"). | Pin cap of four; pins survive reload in saved layout state (UR17). |
| **Alerts that go somewhere** | Notices with "Related panel ›" links exist, one per reveal. | Alerts open their exact subject (Factorio), and a batch is one line (UDF7). | Quiet hours: batch to one line per hour of game time. |

### Creative direction kept

D stays in the round as a skin, per the recommendation, and its tokens give every book world a distinct surface without touching structure. A sixth candidate worth a later round: an **outliner-first** variant of B, a persistent right-hand list of "things that need you" (Paradox), which the Today page would absorb as a section. It was not mocked.

### Updated recommendation

The default stands: A, with B's return note and C's jump-by-name. Part 2 adds three things to A's sequence: **(1)** a section map (the six hubs above) as the migration; **(2)** the lookup index as the second piece of C to pull forward, because "where from, what uses" is the one MC-mod pattern with no equivalent in the game today; **(3)** tabs and nested tooltips as the next layout and tooltip primitives after the hubs. Dial: if the index is built, C's verb chips follow cheaply because verb tags are the same data.

### Libraries that could build these pieces (relayed from `bk-scout`, not verified here)

`bk-scout` reports, with licences and versions checked against npm and GitHub on 2026-10-30 (full doc `docs/research/GITHUB_AND_WEB_SCOUT_2026-10-30.md` on its branch): **dockview** 8.8.2 (MIT, vanilla, floating panels, popouts, JSON layout save and restore) for tabs, split and pop-out; **@tanstack/virtual-core** and **table-core** (MIT) for long lists and sort, filter and group; **@floating-ui/dom** (MIT) for nested tooltips, with focus-trap and tabbable for keyboard focus; **uFuzzy** plus **tinykeys** (MIT) to build the palette, since no maintained vanilla one exists; **dagre** (MIT) for tree layout. **elkjs** is weak copyleft and Patchouli is CC BY-NC-SA, so both are reference-only. None is adopted. Two cautions before any adoption: dockview is the largest decision (bundle size, and its saved layout JSON would need a migration from today's layouts under UR17), and AD45 asks for a replaceable seam, so any library sits behind a port. Effect on difficulty scores: dockview lowers the tabs and split cost for A but adds a layout-migration line; the palette stack cuts C's jump-by-name to about 5 of 15.

### Where several ladders and systems live (Weibao: abilities must not hardcode one path)

Weibao, via the coordinator: abilities must not hardcode one path, and a character may hold several ladders. The played Tingen workroom already lists two pathways at once (Seer and Corpse Collector, with a stated one-pathway-per-life rule), plus Nighthawk merit as a third ladder. The mocks therefore treat a ladder as a list item with a name, where you stand and what is next, never as one fixed track (`ladders` in the fixture; `tests/ui_directions.test.js` fails if a direction shows only one).

| Direction | Where ladders live | Many-ladder behaviour |
| --- | --- | --- |
| A | A "Paths and ladders" panel under You, one row per ladder; the abilities view opens one ladder at a time as a tab | Rows stack; a held ladder sorts above an offered one; tabs scale to any count |
| B | A section of the Today page ("progress due"), with the next rung of each ladder as an agenda row | Only ladders with something due show; the rest sit in the drill-in |
| C | Ladders are a result kind ("Ladder: Seer pathway"); the lookup answers "what uses this" for any rung | Search scales to any count; no screen space is spent until asked |
| D | The notebook's skills page, one spread per ladder, plus a ribbon bookmark per ladder | Page per ladder; many ladders mean a thicker notebook, which is the weak spot of D |

Default: ladders are data rows in every direction and the ladder figure (`ability_ladder_figure.js`) draws any one of them. Dial: with more than four ladders, show the held ones as rows and fold the offered ones under one "Offered" line.

Follow-up from Weibao: "not every world is a ladder either ... branching ... mix paths ... maybe tree for all of them?" The fixture's `ladders` rows now carry a `shape` (ladder, branch, field; wheel, web and none are allowed values). Village shows a ladder plus a field (everyday skills with no order); Tingen shows its two pathways as branches of one fork and merit as a ladder. Mixing paths is a world-owned risk and cost, so the mocks show the fork, not a mixed state. The shape chip is the only per-shape change in the list; drawing a tree or field belongs to the figure primitive's layouts (`figure.js` has tree and track layouts), and the test accepts any shape but requires at least one non-ladder example per fixture. Default: every direction lists paths with a shape chip and opens the matching figure; dial: a tree for all paths is the default drawing when a world has branches, a plain list otherwise.

## Measured captures (headless, 1920×1080, `evidence/ui-directions-2026-10-30/capture-report.json`)

Fonts computed at 14 px and 21 px as asked; the 14 px and 21 px PNGs differ byte-for-byte. Zero page errors across 20 captures. A, B and D hold all facts at 21 px with no clipped control; C's palette keeps eight rows at both sizes.

| Direction | Visible controls | Text characters, Village / Tingen | DOM nodes | Note |
| --- | --- | --- | --- | --- |
| A | 19 / 17 | 1,271 / 1,785 | 149 | Fits at 21 px with room below; the lower third is empty because the mock holds first-screen content only, where the live shell fills it with more panels |
| B | 14 / 12 | 1,146 / 1,698 | about 120 | Card and lists stay on one screen at 21 px |
| C | 1 / 1 (plus 8 palette rows) | 851 / 1,246 | about 80 | The quiet screen sits under the modal palette; its header wraps at the narrow quiet column, a mock artefact |
| D | 5 / 4 | 1,064 / 1,626 | about 120 | The notebook fills its column at 21 px; the map figure is a one-ring placeholder, so D's map table understates what a real map view would need |

For scale, the live Village at 14 px shows 90 controls and 9,335 DOM nodes (above). Every direction drops controls on screen by about 4 to 90 times and nodes by about 60 times, because the mocks mount only what is shown; the live shell mounts 85 modules (UIW2), so that comparison favours the mocks and says nothing about the final cost.
