# Worlds, crossings and transmigration: representations

Status: proposals, 2026-10-30 (UI refactor wave, worlds lane). Nothing here is an
accepted rule. Codes cited as "(proposed)" stay proposed until Weibao says yes.

Sources: [world entry rules](../WORLD_ENTRY_RULES.md) WER1-WER17;
[UI design core audit](../audits/UI_DESIGN_CORE_AUDIT.md) RPX20, LTU8, LTU14, MDL6,
MDL12; [ui-refactor wave plan](../gm/dispatch/ui-refactor-wave-2026-10-29/PLAN.md);
UR76-UR82 (proposed) in the [coverage plan](../gm/dispatch/ui-coverage-2026-10-27/PLAN.md#8-proposed-standing-rules-proposed-2026-10-27-awaiting-weibaos-yes).
Shared pieces used: `src/ui/scene_card.js`, `src/observer_view.js`, `src/carry_ledger.js`.

## What a crossing has to show

A crossing is the most irreversible thing a player does: a body, a purse, a name
and a whole life change at once. WER3 already makes every start answer nine
questions (body, memories, base cheat, money and items, name and papers,
language, who notices, the former life, what you owe). Today those answers render
as nine flat paragraphs. They are correct, but the player has to sort them in
their head to learn the three things that matter at the door: **what comes with
me, what stays, and what I wake up owing.**

## Options weighed

| Code | Representation | Good at | Weak at |
| --- | --- | --- | --- |
| WCO1 | **Threshold carry list.** The confirm step as a scene card: header (from → to, start, era), one stakes sentence, then the WER3 answers grouped as *Crosses with you*, *Stays behind*, *Pauses* (or *Ends here*), *Waiting on the far side*, then the choices. | Answers the door question at a glance; reuses the nine answers verbatim, so wording still matches mechanics (WER3); works for every world without code (any start supplies answers). | Only exists at the moment of crossing; says nothing about worlds you already hold. |
| WCO2 | **Multiverse map.** A figure (`figure.js`) with one node per world: the active one lit, paused lives dimmed with their departure date, unvisited worlds outlined, edges labelled by carrier (Continuing connection, a door, a hub). Text form lists each world with its state. | The standing overview LTU8 and WER13 want: which lives exist, which pause, how they connect. Natural home: the existing Worlds route. | A map invites implying links between worlds that WER1 says are separate. Edges must come only from real carriers, never geography. |
| WCO3 | **Per-world skin tokens.** Each world declares palette, frame, glyph set and figure style as tokens (MDL6). Precedence (MDL12): player choice, then world skin, then the Luminous default. | Worlds feel distinct at no per-feature cost; crossing becomes visible as a change of light. | Not information by itself; must never carry meaning that the text form lacks (UR37). |
| WCO4 | **The packing table** (unusual). The threshold as a diegetic scene: your hands, a table and a door. Things that cross are already in your pockets; what stays sits on the table; the paused life is the coat on the hook. Each object reads its WER3 line on hover and in the text form. | Turns a ledger into a memorable moment; gives WER9's "needs a carrier" a physical place (a bound bag, a sealed letter). | Highest art cost; the same facts as WCO1 with more pixels. Worth it for a world whose crossing is itself a scene (a rite, a summoning). |

## Proposed default

**WCO1 first, as the floor for every start; WCO2 next in the Worlds route; WCO3
as tokens once two worlds have looks; WCO4 as a per-world dial.**

- **Default:** every crossing confirm step is a threshold carry list built from the
  start's WER3 answers. Grouping is by question, never by parsing answer text, and
  an unknown question lands in *Also*, so a world that adds a question never loses
  it.
- **Dial:** a world whose crossing is itself an event (a summoning, a rite, a
  cocoon release) may stage the same groups as a scene (WCO4) or a rite figure,
  with the carry list kept as its text form. Independent new lives show their
  answers as *How it begins* with no crossing groups.
- **In-world reason:** at a real door the traveller checks pockets, not a
  questionnaire. The groups are the questions a person asks before stepping
  through.

Grouping rules (proposed): Memories and Base cheat cross. Money and items stays
behind (the answer names what replaces it). The former life pauses when a
continuing connection can carry it and is titled *Ends here* when it cannot.
Body, Name and papers, Language, Who notices and What you owe wait on the far
side. In an in-person crossing (XM3), Body and Language cross instead.

### Seat header and taking a seat (LTU8, LTU14)

The carry list header already carries place, start and era. For a cast seat
(LTU14) the same card takes four groups instead: *What you know*, *What you own*,
*Whom you know*, *Which book facts now lock*. Those read from `observerView`, never
from the lead's identity. The run-mode chip (LTU8: canon or open run) belongs in
the header's `lead` slot. Both are the next slices, not built here.

### World skin precedence (MDL6, MDL12)

- **Default:** player choice > world skin > Luminous default. A world skin
  supplies only token values (`--ui-accent`, frame, glyph set, figure style),
  applied under the player's chosen component theme. A player who picked a palette
  or Neutral keeps it everywhere.
- **Dial:** a player setting "Let worlds set their look" (on by default) turns
  world skins on or off as a whole. A world may mark one moment, such as the
  crossing card or a dream scene (RPX8), as a skin moment that tints only that
  card.
- **Reason:** the player is the one who reads the screen for hours. A world's mood
  must not cost them legibility. `componentThemeTokens` already recovers contrast
  per palette, and world tokens must pass through the same check.

### Multiverse map notes (WCO2)

- Home: the existing **Worlds** route (`optional-worlds`). It adds no new route
  (UR77, proposed).
- Nodes come from real state only: the active world, paused lives from the
  continuation record, and worlds the player can enter. Edges come from carriers:
  the Continuing connection, a place door, a hub. None comes from adjacency or
  lore (WER1).
- Sealed secrets: an undiscovered world's real nature stays sealed. The node shows
  only what the seat knows (`observerView`).

## UI contract (UR76, proposed)

| Field | Value |
| --- | --- |
| Home | The `lotm` center module's entry step (*Tingen workroom*, opened from the Village place action "Cross to another world: Tingen"). Later starts use their own existing entry step. |
| Shape | Scene card (`scene_card.js`) plus a carry-list section inside it (`src/ui/crossing_threshold.js`). |
| States | Returnable crossing (*Pauses*); one-way (*Ends here*); in-person (body and language cross); blocked (the reason prints beside Confirm); independent new life (*How it begins*). |
| Text form | `thresholdText(view)`: the header line, the stakes, each group with its rows, and each choice with its blocked reason. |
| Tokens | `styles/crossing_threshold.css`, tokens only (UR6). Groups are labelled in words. Colour is an extra cue, never the only one. |

## Receipt (2026-10-30)

Files:
- `src/ui/crossing_threshold.js`: generic adapter and renderer (`carryGroups`, `thresholdScene`, `thresholdText`, `renderCrossingThreshold`). Holds no world names.
- `src/book_world_lotm_threshold.js`: maps the existing entry view (`profiles[].answers`, `returnable`, `axes`, `startable`) to a threshold view. It keeps the `data-lotm` tokens (`enroll`, `enroll_<key>`, `entry_back`) and the `data-lotm-entry-answers` and `data-lotm-answer` hooks.
- `src/book_world_lotm_ui.js`: the old answer box and button row replaced by one `renderCrossingThreshold` call.
- `styles/crossing_threshold.css`, plus one stylesheet link in `index.html`.
- `src/ui/preview/fixtures/worlds.js`: named fixtures `CROSSING_RETURNABLE` and `CROSSING_ONE_WAY_BLOCKED`, using invented places only (CLR3). The figure gallery renders only figures, so this slice has no gallery registration line.
- `tests/crossing_threshold.test.js`.
- Evidence: `docs/representations/evidence/worlds/` (`threshold-confirm-1920.png`, `threshold-choice-1920.png`, `threshold-text-form.txt`, `reconcile-master-result.json`).

Checks:
- `node --test tests/crossing_threshold.test.js tests/perspective_controls.test.js tests/lotm_ui_replay.test.js`: 11 pass. Covers grouping, all nine answers kept once per live profile, button tokens, blocked reason, text form and tokens-only CSS.
- `npm run build`: pass.
- `node scripts/playtest/reconcile-master.mjs <worktree> <out>`: PASS at 1920×1080 and 1536×864, sizes 14 and 21. The route is fresh Village → door → pick → nine answers → Back → confirm → pause and resume both lives → Save, reload, Export and literal Import. The first run failed only on console 404s for gitignored private fonts that this worktree lacked. With those fonts copied in locally (not committed), it passed.
- `npm test` (once, pre-commit): 4105 pass, 9 fail, none in files this slice touches and none using the entry step. Seven are live native-save browser tests (timeouts or silent save-worker failures). `tests/place_acts.test.js` fails the same way on a clean master copy, so these predate this change. Two need the private `docs/research/novels` folder, which this worktree lacks. One perf timing test also failed outside the nine (2000 disabled buttons in 102 ms) while ten sessions shared the machine.
- `npm run check:arch`: pass (no growth). `npm run check:rules`: PASS.
- `dist/bundle.js` and the `index.html` bundle version are rebuilt artifacts. On merge, resolve them by rebuilding.

AD43 floor (FLR1-FLR6):
- FLR1 Build: met. The receipt names the proven bundle as `dist/bundle.js` sha256 `589c6c6e2ba5` in round 1; the result file now holds the round 2 rerun on `b208dc513ad8`, also PASS (`reconcile-master-result.json`).
- FLR2 Route: met. The route is fresh life → Village → "Cross to another world: Tingen" → pick a life → threshold card. There are also named fixtures `CROSSING_RETURNABLE` and `CROSSING_ONE_WAY_BLOCKED`. The UI proof is a rebuilt headless desktop browser run at 1920×1080. The MCP walk could not cover this branch, because `game_new` serves the primary checkout's build, not a worktree. That limit is reported to the game MCP ledger.
- FLR3 Shown: met. Each row keeps its WER3 description. Confirm quotes its cost ("Your Village life pauses" or "Cannot be undone on this save"). A blocked start prints its reason beside the button. Text form: `evidence/worlds/threshold-text-form.txt`, with both fixtures and the live card.
- FLR4 Used: met. The card is the consumer for the existing entry view and drives the existing enroll and Back actions.
- FLR5 Kept: not applicable. No save shape changed. reconcile-master still passes Save, reload, Export and literal Import across the crossing.
- FLR6 Labelled: agent-verified, not human-reviewed. The route kind is a fresh-life place action.

Implemented-unverified: the `beside` and independent `be` starts. Both need the private cast pack, and the headless route stubs an empty pack manifest. Their grouping is covered only by `tests/crossing_threshold.test.js` (beside) and by the independent-life fixture case.

Open wording notes (WER3):
- In the civil, in-person start, *Money and items* sits under **Stays behind**. Its answer leads with the money that stays, but also names the 5 pounds funded for arrival. The row is accurate. The grouping files it by what is left behind.
- The independent-life stakes line uses the host's own wording ("kept until the new life is ready"). It does not claim the old life survives.
- The seat filter hides `closest('[data-panel-row]')`, or failing that the control itself. Scene-card option rows have no `data-panel-row`. If `control.start-confirm` is ever hidden for a seat, its quote line would stay visible. Before enrollment every seat shows the entry step, so this is low risk. The next slice that adds seat-gated options should mark option rows.

Next slice: WCO2, the multiverse map in the Worlds route. It would be built from
the continuation record's paused lives and the active world, with carrier-only
edges. After that comes the LTU14 seat threshold, using the same card with the
four seat groups.

## Round 2 (2026-10-30): review, density and the workroom split

Brief: [ROUND2_BRIEF](../gm/dispatch/ui-refactor-wave-2026-10-29/ROUND2_BRIEF.md), items 1-21. Everything below is a proposal (AD32). Every choice is the current best and is open to refactor or replacement with a reason (AD45, item 12). This session owns center-view density for service and world screens (item 14).

### W2-1 Other games (item 1)

Claims marked K come from play or published docs. Claims marked I are inferred.

| Game | What the player sees | Makes easy | Costs | Idea taken |
| --- | --- | --- | --- | --- |
| Slay the Spire, route choice | A whole act as a node map with typed icons. The player picks the next node from the reachable ones (K). | Seeing consequences two or three steps ahead. | Icons must be learned; a legend is needed (K). | **Show what a start leads to before choosing.** The threshold card's groups are that preview. A later "first week" strip could show the first duties (I). |
| Library of Ruina, floors | A building whose floors each have their own realm, palette and staff. The player switches floors by tab (K). | Many realms that each feel distinct, with one shell. | A floor's look is authored per floor (K). | **World skin as tokens on one shell** (MDL6). Worlds as floors of one Worlds view. |
| Sunless Skies, regions | Each region has its own palette, music and an entry title card (K). | Knowing at once which world you are in. | Strong mood can cost legibility (I). | **A short entry title card on crossing**, tinted by the destination skin, gated by effects off (item 13). |
| Stellaris, galaxy map | One map with map modes (political, trade, and others) and filters (K). | One overview answering several questions. | Dense at scale and needs zoom (K). | **The multiverse map (WCO2) uses modes, not one busy picture:** state (active, paused, unvisited), time rate, carriers. |
| Transmigration status windows (novel-adapted games) | A "system" panel listing host body, identity, mission and inventory carried (I). | Answering "who am I here and what came with me" in one glance. | Can turn into a stat dump (I). | **The carry list is the status window.** The *Crosses with you* group is its inventory line. |
| Proto23 and YAIR baselines (UR12, UR49) | A location panel with the place text, then the action list (K, from the repo). | Acting at once. | Prose and actions share one column. | **Actions first, reference prose second**, which the workroom split now follows. |

### W2-2 Fresh-player test (item 2)

From a fresh life: Village → "Cross to another world: Tingen" → pick → threshold → enroll → workroom.
- **Before (round 1 card):** five seconds to grasp the threshold is fine. The workroom is not: about 2,600 characters of mixed path, clearance, merit and rules prose come before the place actions.
- **Fixed now:** the workroom opens on **Here**, with the actions and walks for this place. Path, clearance, merit and the bench move to their own tabs, and the move is announced. Reference prose ("one pathway per life", "finding a step spends nothing", "prepare this body") moved into one **How this works** disclosure. Before, the switching rule printed once per pathway.
- **Still open (host-owned text, not this lane's file):**
  - "Warden Hale's attention 6" is a number with no stated meaning (UR61).
  - "no Beyonder source" assumes the term is known.
  - The Places list repeats the walk buttons' times. The maps session is adding a walk map there.

### W2-3 Space, split and density (items 3 and 14)

Measured headless at 1920×1080 on bundle `b208dc513ad8` (`evidence/worlds/workroom-density-result.json`). The figures are the same at text size 14 and 21.

| View | Visible characters | Characters before the first enabled action | Buttons |
| --- | --- | --- | --- |
| Old single scroll (every tab forced visible) | 2,625 | 653 | 15 |
| **Here** (default tab, includes the paused-life line) | 1,050 | 313 | 10 |
| Path | 819 | 653 | 6 |
| Work & merit | 1,156 | none enabled on day one | 9 |
| Notebook | 520 | — | 5 |

Decisions:
- **Split by question:** *what can I do here* (Here), *where am I going* (Path: ladders, plan, clearance; the paused other life leads Here, since it is a crossing fact), *what do I hold and owe* (Work & merit: custody, merit, jobs, the bench), *what do I know* (Notebook).
- **Density by frequency (UR42):** status and meters stay above the tabs as the compact glance. Each tab carries a one-word badge ("ready", "2 running", a record count), so a hidden tab still signals. Full detail is one click away.
- **Compatibility:** tabs live inside the existing `lotm` module. Panel id, docking and saved layouts are unchanged (UR17), and the tab choice lives in memory only, so no persistence changes. The move is told once with a dismissible line (UR13).
- **Seat filter:** tabs hide blocks with `data-tab-off`, never `hidden`, so seat filtering (which owns `hidden`) still works. The block anchors in `perspective_controls.js` shifted by one, and a new tab block row was added.
- **Two panels or tabs:** at 1920 the center column is about 740 px wide, so a side-by-side split of two panels would squeeze both. **Tabs are the default.** As a dial, a player who docks the workroom wide or pops it out (item 5) could get Here and Path side by side. Later slice.
- **Other service screens:** each now gets the same treatment, done by its owner. Reuse `mountWorkroomTabs`' pattern (generalise it to `src/ui/` when a second consumer appears, UR79). The rule: actions-first tab default, reference prose in one disclosure, and blocks hidden by attribute, not `hidden`.
- **Merit and clearance rows:** these belong to the economy session. I told them the containers did not move.

### W2-4 Bars and small signals (item 4)

The tab badges are the small signals. Each answers one question: *is a step ready?* (Path), *is work running?* (Work), *how many records?* (Notebook). They are words, not colour alone. Proposed next: a supervisor-attention meter with words ("watched closely", "trusted") that replaces the bare number. The host owns its meaning; a chip goes beside the status line.

### W2-5 Pop-outs and the Electron app (item 5)

- The threshold card is a moment, not a monitor, so it gets no pop-out.
- The workroom earns an optional pop-out once Here and Path sit side by side. The renderer already draws into its own nodes (MDL13 holds for `crossing_threshold.js`; the tab module uses the global document through `reference_kit` and would need its `node` helper to accept a document).
- A Dock badge or notification fits "a paused life has been away N days" only if Weibao wants it. Proposed off by default.

### W2-6 Cheats and insight views (item 6)

- A continuing-insight cheat could add a fifth group to the threshold, *What this world will notice*, drawn from the world's real noticing mechanisms (WER12). It would be marked "insight" with its source named.
- Sealed truths about a world's entry mechanism (WER4 late reveals) stay inside their discovery route. The card shows only what the seat knows (`observerView`).
- The developer inspector stays separate.

### W2-7 Visual style (item 7)

- **Default:** Luminous, as committed.
- **Alternative proposal:** a "luggage tag" style for the threshold. Each group is a tag with a punched hole glyph and a hand-ruled line, through tokens only. It reads better than plain columns for *Crosses with you* versus *Stays behind*, because the metaphor is physical.
- Both pass Neutral, 21 px text and effects off, since the meaning sits in the group headings.
- Not built this round. The scene card has no gallery home yet.

### W2-8 Use what we have (item 8)

The pieces reused are `scene_card.js` (threshold), `reference_kit.createTabs` (tabs, already used by Known things), the existing `<details>` disclosure, `observer_view.js` (seat), and the existing `lotm` center module. Nothing new was added as a shared primitive. The tab mount stays lotm-local until a second service screen uses it.

### W2-9 Unconventional option (item 9)

**The world reacts to your crossing.** For the first in-world hour after a crossing, the Here tab's first line is the host body's own fragments (from the *Memories* answer), surfacing one at a time as you act: "your hand knows the office door". Each fragment is a real knowledge entry the seat gains (LSD memory lane). Cost: one entry list per start plus a settled-text reveal (`settled_text_effects.js`, UR38). Worth a later slice once the memory lane lands, because it turns the WER3 promise into felt play.

### W2-10 Audit gaps (item 10)

- **Other seats:** the be-seat and beside starts are unverified in a browser (private pack). Thin lives get the same tabs; empty tabs hide themselves.
- **Empty state:** an enrolled life with no actions still shows Here with its walks, and the fallback picks the first non-empty tab.
- **Performance:** tabs only toggle an attribute, so no extra render.
- **Accessibility:** arrow keys, Home and End on tabs come from `createTabs`. Focus stays on the selected tab. 21 px text checked.
- **Gap:** the moved notice reappears every page load (in memory only). A persisted "seen" flag would need a UI-preference slice. Dial: keep it until the UI preference store gets a home.

### W2-11 Prior implementations and abstraction (item 11)

- The threshold is a **grouped ledger** (rows sorted into labelled groups). The workroom split is **sections by question**.
- Prior owners checked: thematic UI "Small contextual bars", the scale palette ("Where cheats go") and the representation ladder. The ledger and tabs shapes are already in the coverage plan, so no new shape.

### W2-12 Flourish (item 13)

- The selected tab underline uses the accent token.
- **Proposed:** a single soft settle on the *Crosses with you* group when the card appears, and a destination-tinted title card on arrival. Both settle on a real event and obey effects off and reduced (UR38, UR62). Neither is built yet.

### W2-13 Fold into existing UI (item 16)

Done in place: the threshold replaced the answer box, and the tabs live inside the existing module. Proposed for the coordinator: the Worlds route (`optional-worlds`) becomes the home of the multiverse map. The Beginning view and the in-game start list share the threshold card (WER13: one start list, one confirm shape).

### W2-14 Later volumes and worlds (item 17)

- The threshold is data-driven by question name, and unknown questions fall into *Also*. Later eras (WER6), later methods (the "by design" route, young hosts) and hub worlds (WER17, where the hub is the carrier) add answers, not code.
- Checked against WER17: a hub start needs a sixth group, *Through the hub* (points, contracts, storage). That is a `GROUP_OF` row plus a label.
- The workroom tabs take more blocks by adding a block name to a tab. A later Sequence or institution adds rows inside Path or Work.
- **Open:** a world with more than four sections (a sect or company with its own ranks) may want a fifth tab, *Standing*. Coordinate with the organizations session.

### W2-15 Form fits subject (item 18)

- Threshold: grouped list (columns). Not a ring: crossing is a partition, not a cycle.
- Multiverse map: graph with modes, not a ring.
- Path ladders: vertical track (currently a text arrow line; the abilities session owns the ladder figure).
- Workroom: tabs by question.

### W2-16 Levels and depth (item 19)

The threshold shows depth through each answer's own wording. Proposed: a *how sure* marker per group row (memories "whole" versus "fragments") as a word chip, read from start data and not parsed.

### W2-17 Semantic roles for later flair (item 20)

Group ids are roles: `crosses`, `held`, `pauses`, `far`, `other`. A motif pack restyles by role.
- In a fog-and-gas-lamp industrial world: *Crosses* as a pocket watch chain, *Stays behind* as a left-luggage ticket.
- In a cultivation world: *Crosses* as the soul's light, *Stays behind* as a shed husk.
- The text form is unchanged in both.

### W2-18 Draft status (item 21)

The round 1 threshold card stays: it is genuinely good, because it groups facts the player needs before an irreversible step. The flat workroom was not, so it was restructured rather than decorated. The tab set is a draft. If a later round finds Path and Work read better side by side in a wider dock, that replaces the tabs.

### Round 2 checks

- Focused tests: `node --test` on workroom_tabs, crossing_threshold, perspective_controls, lotm_ui_replay, observer_view and seat_profiles. 32 pass.
- `reconcile-master.mjs` on bundle `b208dc513ad8`: PASS. Its first run failed because the paused-life line had moved into the Path tab. That line now leads Here, and the run passes.
- `workroom-density.mjs`: PASS at text sizes 14 and 21 with effects off.
- I did not run the full `npm test` this round. The coordinator asked sessions to stop, because the shared machine was overloaded. The coordinator runs it once at merge.
- Floor (AD43): the workroom split is agent-verified, not human-reviewed. Persistence is unchanged.

### Round 2 actions

ACT NOW (done):
- **A1 Workroom tabs.**
  - Files: `src/book_world_lotm_tabs.js` (built by a Sonnet subagent, reviewed), `styles/workroom_tabs.css`, `tests/workroom_tabs.test.js`.
  - Mount: `src/book_world_lotm_ui.js`. Anchors: `src/perspective_controls.js`.
  - Moved notice per UR13.
- **A2 Reference prose behind a "How this works" disclosure.** The duplicated switching rule now prints once.
- **A3 Capture script** `scripts/playtest/workroom-density.mjs` (Sonnet-built, fixed after its first run). Evidence is in `evidence/worlds/workroom-*`.

ACCOUNT FOR NOW:
- **A4** Host wording gaps: attention number, "Beyonder source", duplicate places list. Owned by the host and maps lanes.
- **A5** The moved notice is not persisted.
- **A6** The tab module uses the global document. That matters for pop-outs (MDL13).

LATER / DELEGATE:

| Code | Work | Level and effort | Done check |
| --- | --- | --- | --- |
| A7 | Multiverse map in Worlds (WCO2) with map modes | Opus design, Sonnet build, medium | Fresh life shows Village active; after crossing, both lives with carrier edge; text form |
| A8 | Generalise the tab mount to `src/ui/panel_tabs.js` when a second service screen adopts it | Sonnet, small | Two consumers, one test |
| A9 | Attention meter with words | Host lane plus Sonnet, small | Number replaced by a worded meter; UR61 line |
| A10 | Crossing title card and skin tokens (MDL6/MDL12 precedence) | Sonnet, medium | Player theme wins over world skin; effects off shows no motion |
| A11 | Memory-fragment arrival (W2-9) | After the memory lane, medium | Fragments are real knowledge entries; text form lists them |
