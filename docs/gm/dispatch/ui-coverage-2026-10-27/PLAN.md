# UI coverage plan: a surface for every system without a screen per feature (2026-10-27)

Weibao: "What worries me is the UI flow, and how to give Ui for everything
accordingly?" ([adoption entry](../../../USER_VISION.md#adopt-this-sessions-proposals-as-adjustable-working-direction-2026-10-27)).
Docs only: no `src/`, `index.html` or UI backlog file changed. Everything here is a
proposal. The 2026-10-27 adoption makes today's system proposals adjustable working
direction; it does not accept new UI rules or promote features onto the main surface
(UR2). The proposed rules in section 8 wait for their own yes.

Target: desktop 1920×1080 primary, Weibao's MacBook (about 1800×1040 CSS px) every
round, 1536×864 floor, text 14 px and 21 px. Mobile deferred ([standing UI priority](../../../USER_VISION.md#standing-ui-priority-2026-10-13)).
Rule codes applied: UR1-UR3, UR11, UR21, UR25, UR26, UR29, UR32, UR33, UR41-UR43,
UR47, UR52, UR54, UR61, UR63, UR64, UR70-UR75; AR8; AD36, AD42, AD43; UIV1, UIV3,
UIV4, UIV6; UT1-UT6; UF1-UF7; ZM1-ZM2; PR1-PR3.

## Short answer

The game already has enough homes. It has 20 nav routes (`src/layout_spec.js:239-258`),
5 regions (player, Around you, inventory, actions, log), 4 center modes (idle, fight,
travel, service), the nine surface types ST1-ST9 that UR1 requires, and about 52 panels
registered through `definePanel`. What is missing is a small set of **shapes** that any
system can pour its rows into. Today each system invents its own shape, so each new
system looks like it needs a new screen.

So the plan is **homes stay fixed, shapes are shared**. Every system from today fills a
one-page UI contract: which existing home, which of eight shared primitives, what it
says in each state, and what the player can do. A headless check fails when a system
names a home that does not exist or a shape outside the set. With that, the 18 systems
below need **zero new nav routes, zero new regions and zero new center modes**. They
add seven tabs inside three existing routes, and they add lines and rows to surfaces that
already exist.

The first build is the **note** primitive: the return note and stop-reason lines. It
is the weakest primitive in code, and it is the one that seven of today's proposals
point at.

## 0. What exists, and one naming gap

| Shape in today's proposals | What the code calls it | Source |
| --- | --- | --- |
| "Pinned box" (attention P2, NPC E3) for stop and blocked reasons | **No such surface.** The nearest real home is the work line (`src/work_status_view.js`, "presentation of an existing work owner's clock") and UR11's always-visible current work. UIV3 names the work line as the home of the under-way list. | grep of `src/`: no `pinned box` |
| Blocked reasons | Landed as UIV1: `decorateActionComponents` in `src/ui_components.js` prints the reason and makes it a Tab stop (backlog-ui checkpoint, `f0352c95e`) | [checkpoint](../village-loop-2026-10-27/BACKLOG_UI_CHECKPOINT.md) |
| Change counts | GU8 `src/change_badges.js`: new-row counts on routes, page-only | header |
| News | `src/event_feed.js`: read-only news from owners | header |
| Lives and worlds | "Continuing connection", a tabbed center view (`src/continuation_ui.js`) | header |
| Cheat | "Continuing insight" (`src/cheat_ui.js`) and the status window (`src/status_window.js`) | headers |
| Accounts | `obligations_ledger.js` (one record shape for debts, duties, bindings; pure, not wired), `away_ledger.js`, `work_ledger_ui.js`, `carry_ledger.js`, `craft_failure_ledger.js` | headers |
| Dated things | `world_calendar.js`, `owned_place_clock_panel.js`, `simulation_clock.js`, header date in `village_workspace.js` | headers |
| Scenes | `storylet_ui.js` (it already has a Calm / Usual / Lively "temper") | header |
| People | `people_ui.js` (view-only), `relationship_view.js` (authoritative reads, not observer knowledge) | headers |
| Screens matrix | `scripts/playtest/d1-panel-matrix.mjs`: every discoverable panel at both desktop targets | header |

**Fix for builders:** where a report says "pinned box", read "the work line's status row"
(F1). Do not build a new box.

## 1. Coverage matrix

The columns are: **Home** (an existing route, region or surface type) · **Primitive**
(section 2) · **Says** · **Player can** · **States** (E empty, B blocked, L loading, U
unknown) · **Start** (main = extends an accepted surface; drawer = Projects drawer until
Weibao promotes it, UR2).

| # | System (codes) | Home | Primitive | Says | Player can | States | Start |
| --- | --- | --- | --- | --- | --- | --- | --- |
| M1 | Pace dial and evening budget (P1, P4, R1) | Header strip, beside world · life · date | Chip, then a policy row in a popover | "Lively · next dated event in 3 days"; the budget ("shift window 2 h left") | Change the pace at a rest point | B: "Change at a rest point. You are on watch." L: the chip is hidden until a life exists | main (the storylet temper already exists) |
| M2 | Stop reasons and takeover (P2, E3, E4, 3.2) | Work line status row (actions region) | Note line plus choice row | "Stopped: rye flour ran out (2 of 5 loaves made)" | Resume in one click; open the source (UR29); edit the stop rules (M14) | E: "Running · stops when inputs run out, a choice appears or the shift ends." B: resume is disabled and shows its reason | main |
| M3 | Return note (P3, UT3, E2, C3, N4, K5, TI7) | Top of the Here center view on the first screen after an absence; one grouped log entry (UR64); archived in Journal → Days | Note | What settled, what stopped and why, what was missed and how to recover it, what waits. At most 5 lines, then "and 7 more" | Click a line to open its source; dismiss; keep it pinned | E (frozen world): "The Village waited where you left it." L: "Settling 3 days…" with a count, no input until done. U: nothing about clocks the life is not attached to | main |
| M4 | Clocks and appointments (C1-C3, E1, E7, R2-R5, N3) | Ledger route → new **Due** tab; header chip for the next firm clock | Timeline plus chip | Dated rows with degree (ambient, soft, firm), lead time, what a miss does, recovery | Join, witness or let pass (R3) once inside the lead time; "Skip to the next thing" (R5) | E: "Nothing scheduled concerns this life." (A sparse world stays sparse, R6.) B: skip is disabled with a reason ("a choice is open"). U: unattached clocks are absent, not greyed | main for Village rows; drawer for R5 skip |
| M5 | NPC reach-out, letters, greetings, threats (N1, N4, N7, L6) | The scene card in the center via the storylet deck; a log line; the timeline row for the reply window | Scene card, note line, timeline row | The letter in the world's voice; reply window; tells on a suspect letter in its inspector | Reply (choice rows), defer, open the sender | E: none needed (letters arrive). B: an option shows its reason ("You can't write yet") | main (rides VC12's deck) |
| M6 | Closeness and schedules (N2, N3, N6, RLA) | People route; person inspector | List plus inspector, meter | A closeness meter that names its question (UR61): "Warmth: cooled since you left; the floor holds." A "Usually at the mill, mornings" line once observed | Greet and give a gift where the person is (existing commands); pin the person | U: "Not seen enough to know their hours." E: "You know no one here yet. Talk to people in the Village." | main |
| M7 | Favour and debt ledger (WA34, L4, heirs) | Ledger route → new **Owed** tab | Ledger, policy row on the person | Who, what, since when, due, and what survives an heir | Settle or call in (at the person's place); set a helper's consent (yes / ask me / no) on their inspector | E: "No one owes you and you owe no one." B: "Settle in person at the mill." | main for reads; drawer for consent until L4 exists |
| M8 | Merchant stock and price memory (SI1-SI5, 18.1, WA39) | Shop service view (ST2, service center mode) | List plus inspector, chip, choice row | Stock rows with source chips; "Last agreed with you: 4 d, Tuesday" as a dated observation (UR61); sold-out and restock times | Buy, sell, haggle (choice rows with cost and reason) | E: "Sold out until the next market (3 days)." U: price unknown until asked. Revisit: a "last time you were here" note line | main |
| M9 | Inventory canon / filled / yours badges (17.1, PL-L30) | Inventory region rows; item inspector source line | Chip | **book**, **filled**, **yours**; the inspector says "from the book's day 3", resolving names through the resolver | Filter by source (default all, PL-A29) | Chips appear only in a life whose world has a canon layer; elsewhere none | drawer (lead playthrough) |
| M10 | Seeds, time travel and branches (TT1-TT6, TI5, TI7, DT1) | Connection route → new **Branches** tab; a rewind or branch is a threshold screen (ST3); the day's delta log is in Journal → Days | Timeline, ledger in diff mode, note line | The branch atlas; on rewind, what carries and what is undone (now → after); "Last time you were here you bought the sword" | Rewind or branch (threshold confirm with cost); resume a frozen branch | E: "One line so far." B: "Your carrier has no charge." Import with a new genVersion: a plain note line (TI5) | drawer |
| M11 | Conceptual-ability effects and residue (CAE-P4, K1-K15) | No surface of its own. Effects show through every surface via `refOf`; held operations are listed in Continuing insight | Inspector line, ledger rows in insight | Residue text where a name or record is masked ("someone", "a name you can't hold"); in insight, each held operation with scope, cost, reversal | Use an ability from the target's inspector or from insight (choice row with cost and reason) | U: residue only; a sealed route shows by ID and status. E (insight): "No working held." | drawer |
| M12 | Canon beats, modes and seats (PX1-PX5, PX13-PX15) | Start screen (ST3): mode and seat as choice rows; attached beats are rows in the Due tab; a canon-line chip in the header | Choice row, timeline, chip | Labels per reader dial ("something due at the church office" for a new reader); chip reads "On the book line", "Shifted" or "Diverged" | Pick a mode or seat; join, witness or let pass a beat; set "history leans on" per life (policy row in Connection → This world) | U: beats outside the life's scope are absent (PX5). Sealed outcomes stay off the confirm screen (PX15) | drawer |
| M13 | Lead playthrough (17.4) | Scene card in the center; the rest reuses M3, M4, M9 and Journal → **Knows** | Scene card, the lens of section 4 | Where, when, goal, options; untaken options are "not built yet" | Choose; open the book overlay (off by default) | E: "No scene now. Live the day." The overlay shows only current and past scenes | drawer |
| M14 | Routines, standing orders and plan-before-leaving (3.2, L3, K4) | The routine's own surface (work line or service) for its rules; Ledger route → new **Orders** tab lists them all | Policy row | "Pick when ripe; sell above 6 d; keep seed stock; weekly market only" | Add, edit or pause an order; set stop reasons; "Before you go" plan on the work line | E: "No standing orders. Set one from a field or stall." B: "Unlocks after your first harvest sale." | drawer for orders; main for stop-reason toggles once M2 lands |
| M15 | Battles, allies and optional pressure (15.1, 15.3, P5) | Fight center mode, opponents panel, Around you | List plus inspector, policy row, note | Allies as rows beside opponents; an outing's stop reason; pressure modifiers with their named reward | Pick modifiers on the outing confirm (Hands-on only) | U: unknown stats per UR36. E: no allies, so no rows | main for allies; drawer for P5 |
| M16 | Environment, events and bad actors (16.1, 16.2, CP2, K5, L5) | Header (date, weather, SMU1), Around you prose, log, scene cards | Chip, note line, inspector, choice row | The weather and season; for a loss, its trace ("muddy prints by the shed") in the loss line's inspector | Follow up on recourse (choice row); the temperament is M1's pace | U: a trace that is not yet noticed shows nothing | main |
| M17 | World travel and carry (UF1-UF3, UT1-UT6, TL8) | Header orientation; the crossing confirm (ST3) with now → after; Connection → new **This world** tab (UF3) | Chip, ledger diff, note | "Tingen · your clerk life · 4 June"; what carries; the arrival line | Cross and return with one verb (UT6) | E: carry ledger with no rows: "Nothing physical crosses this way; memories do." | main (UF7 is a GM card) |
| M18 | Base cheat growth (UF4, BC3-BC5) | Continuing insight; status window | Ledger, chip | Stage, verbs, point sources (UT4), limits found, observers who noticed | Spend or choose a branch (choice rows) | U: quiet parts are absent, not greyed (UF4) | main |

New tabs in the table: Ledger → Due, Owed, Orders; Journal → Days, Knows; Connection →
This world, Branches. That is seven tabs in three routes, and no new route.

## 2. Shared primitives and the surface budget

Each primitive cites at least two existing consumers (UR54). A primitive is a shape and
a component, not a home. It renders a projection (AR8). It never decides settlement.

| # | Primitive | Shape | Existing consumers | Covers |
| --- | --- | --- | --- | --- |
| K1 | **Choice row with reason** | Outcome label (UR10), cost and duration, a visible reason when blocked (UIV1), preview equals commit (UIV4) | `decorateActionComponents`; Tingen workroom; Projects drawer | M2, M5, M8, M10-M12, M16-M18 |
| K2 | **Note** | 1-5 lines, each a sentence with a source link; grouped and countable (UR64); dismiss or pin; archived to a reading surface | `event_feed.js`; the arrival line (UF1); the Continuing connection status message. This is the weakest primitive, so it is built first | M2, M3, M5, M8, M10, M16, M17 |
| K3 | **Ledger** | Rows of accounts: subject, counterparty, amount or state, since, due, source; filter, count, sticky header (UR27). Diff mode shows before and after | `obligations_ledger.js`, `away_ledger.js`, `work_ledger_ui.js`, `carry_ledger.js`, `craft_failure_ledger.js` | M7, M10, M11, M14, M17, M18 |
| K4 | **Timeline** | Dated rows on one axis: past (done, missed), now, upcoming with lead time and degree; one row per clock | `world_calendar.js`, `owned_place_clock_panel.js`, `work_status_view.js` (under-way, UIV3) | M4, M5, M10, M12 |
| K5 | **Scene card** | Where, when, goal, options (K1 rows), outcome line | `storylet_ui.js`; threshold start screens (`book_world_lotm_entry.js`) | M5, M13, M16 |
| K6 | **List plus inspector** | A filtered list with counts; hover to peek, click to pin (UR43); effect first (UR70-UR75); every name through `refOf` once CAE-E1 lands | `people_ui.js`, inventory (`decorateInventoryList`), `chain_inspector_ui.js`, `material_inspector.js` | M6, M8, M9, M11, M15, M16 |
| K7 | **Chip** | A short text label plus token colour (UR37); optional count; opens its source | `change_badges.js` (GU8); header date line; nav-route dots | M1, M4, M9, M12, M16-M18 |
| K8 | **Policy row** | Condition → action → value, with what it costs and when it stops; lives on the surface it governs | `storylet_ui.js` temper; `registerPanelSettings` in `panel_kit.js` | M1, M7, M12, M14, M15 |

**Lens** is a rule, not a primitive: see section 4.

**When a feature may add a surface (default: none).**

- Default: a system adds rows, lines, tabs or chips in an existing home.
- A new **tab** inside an existing route is allowed when the system's rows would make
  an existing tab do two jobs, and the route stays at or under 7 tabs.
- A new **Local actions entry** (UR3, about seven) or a new **nav route** needs a
  demotion or a merge plus Weibao's yes. Until then it sits in the Projects drawer (UR2).
- A new **primitive** needs two existing consumers and a reason none of K1-K8 fit.
- A new **threshold screen** (ST3) is allowed for a rare, weighty, hard-to-undo choice
  (crossing, rewind, start mode). It is built from K1, K3 and K5.

**Budget, frozen at today's counts (proposal):** 20 nav routes, 5 regions, 4 center
modes, about 7 Local actions, 7 tabs per route. The coverage check (section 6) reads
`routeTable()` and the region and center-mode specs, and fails when a count rises
without an entry in a ledgered allowlist that has a `reason`.

## 3. Information architecture at the desktop targets

**Always visible (all four sizes):**

- Header strip: world · life · local date and weather (UF2, SMU1), pace chip (M1),
  next firm clock chip (M4), canon-line chip (M12, only in a life that has a canon layer).
- You (vitals, status window), Around you (place, people present), the center (Here,
  scene card or service), the work line with its status row (M2), and the full-height
  log (UR11).

**One click:** nav routes (Ledger → Due, Owed, Orders; Journal → Days, Knows; People;
Connection → This world, Branches; Inventory; Continuing insight). Alt+key from
`layout_spec.js`; tabs keep their place on return (UR23).

**Inspector (hover then pin, UR43):** person, item, stock row, ledger row, clock row,
residue line. It is pinned in its own region, not as a page.

**Drawer:** Projects (drawer-start rows above), Settings (display preferences only; a
routine's policy rows stay on the routine, not in Settings).

**Threshold screen (ST3):** crossing, rewind or branch, start mode and seat. **Quick
confirm (ST4):** spend, leave mid-relay (says what leaving forfeits, VC3a).

**Per size:**

| Size, text | Header | Ledger tabs (list and inspector) | Return note | Scene card |
| --- | --- | --- | --- | --- |
| 1920×1080, 14 px | All chips in one line | List and pinned inspector side by side | 5 lines visible | Options all visible |
| 1800×1040 (MacBook), 14 px | Same | Same | Same | Same |
| 1536×864, 14 px | Chips past the first two fold into "+2", which opens a popover listing them in the same order | Side by side; the inspector narrows | 5 lines | Same |
| 1536×864, 21 px | world · life · date always; then pace; the rest fold into "+n". Chips keep their text, never colour alone (UR37) | The inspector overlays the list's right half inside the panel; Esc returns (UR53) | 3 lines, then "and n more" opens Journal → Days | Options scroll inside the card; the back bar stays pinned (UR33) |

Chip priority when folding: orientation, pace, next firm clock, canon line, then other chips.

**Zoom and text size.** Page zoom is a viewport change (ZM1): 1920 at 125% lays out as
1536, so the 1536 shot doubles as the 125% check. 150% (1280 wide) is untested; record
it as a gap and do not design for it. Cmd/Ctrl with plus or minus should step through the
text-size presets, so the bitmap face stays on whole-pixel strikes (ZM2, proposal, ZM6
lane). Layout sizes change only at stable moments (UR52, UR69); a note arriving does not
move a pending target.

## 4. Progressive disclosure, lenses and observer safety

**PD1. Attached or absent.** A system shows in a life only when it has rows that attach
to that life (C1's attachment test, PX5's scope). With no rows and never met, it is
absent. Once met, an empty state explains how to fill it (UR32). This is what stops the
lead playthrough, world travel, cheats and life-sim views from crowding each other: a
Village life with no canon layer never shows a canon chip, a Branches tab with one line
stays quiet, and quiet cheats stay absent.

**PD2. One owner of the center at a time.** Priority: threshold screen, then a scene card
waiting on a choice, then a service, then Here. The rest show as a chip or count and wait.
Nothing stacks two center views; the shared controller and back bar govern (UR9, UR41).

**PD3. Base first, layers on top.** The life-sim surfaces (Here, work line, people,
inventory, Ledger) are the base for every life. The lead playthrough adds the scene card
and **Knows**; travel adds header orientation and the Connection tabs; the cheat adds
Continuing insight. A layer adds rows and chips, and it never rearranges the base.

**PD4. Lenses only narrow (AR8).** A lens is a filter over the **player projection**. It
cannot switch toward the world view.

- *What the book did* overlay: off by default; reads current and past canon scenes
  through the player projection; never shows a future scene; marks the taken option on
  a scene card and the canon outcome on a past timeline row. Sealed outcomes appear by
  ID and status only (PX15, PL-A30).
- *Reader dial* (PX13: "I know this book" or "new reader"): changes labels only.
- *Observer view* (CAE-P4): every primitive renders `refOf(entity, playerObserver)`; a
  masked reference renders residue. A UI that reads `.name` directly is a leak path; the
  coverage check flags new direct reads once the resolver exists.

**PD5. Spoiler wording follows PR1-PR3.** Start and confirm screens name things by how a
newcomer sees them; a "full premise" disclosure is opt-in.

## 5. Build order

Each row follows AD43's floor, AD36 for evidence reuse, and UR18 for the brief. The
browser evidence plan for every row: rebuild; fresh test origin; screenshots at
1920×1080, 1800×1040 and 1536×864 at 14 and 21 px; page `scrollHeight` against the
viewport (UR25); Tab reaches every reason and action; save, reload, export and import
where state persists. Coordinate file ownership with backlog-ui (UR19).

| Order | Slice | Level | Effort | Done check |
| --- | --- | --- | --- | --- |
| B1 | **Note primitive, return note and stop-reason line** (K2; M2, M3; P2, P3, E2, C3, UT3). Builds on `event_feed.js` and `work_status_view.js`. Needs one persistence decision: what "since you last looked" is stored as | Sonnet medium | One session | A scripted 12 h absence in the Village shows a note with at least one settled, one stopped (with its reason) and one missed line, each opening its source; a frozen-world return shows the "waited" line; the work line shows the stop reason and resumes in one click; after reload the note is still unseen until dismissed; Import does not replay it |
| B2 | **Ledger primitive and Ledger → Owed** (K3; M7), read-only over `obligations_ledger.js` adapters | Sonnet medium | One session | Debt, favour and duty rows show in one tab with filters, counts, an inspector and the empty text; no save fields change; the panel matrix covers it |
| B3 | **Choice-row extension** (K1): reasons on scene-card options, on non-button rows and on VC2n closed rows; preview equals commit (UIV4) | Sonnet low | Half a session; backlog-ui owns `ui_components.js` | Every disabled option in a scene card shows its reason and is a Tab stop; a preview and its commit show the same cost in a scripted case |
| B4 | **Timeline and Ledger → Due, with the next-clock chip** (K4, K7; M4). Before C1 exists it reads `world_calendar`, owned-place clocks and the under-way list (UIV3) | Sonnet medium | One session | Three concurrent timed jobs and one dated event show with time left and degree; the chip names the next firm one; the empty text shows in a fresh life |
| B5 | **Policy row and the pace chip** (K8; M1, M2 toggles), generalising the storylet temper | Sonnet medium, after Weibao's P1 answer | One session | Changing pace at a rest point changes the deck rate in a fixed-seed run; off a rest point the reason shows |

After B5: M6 closeness meter and "usually at" (with N2, N3), the M8 shop rows (with C1/C2
keyed stock), then the drawer rows as their engines land (M9-M13).

## 6. Testing coverage automatically

Build on what exists. Do not add a new universal gate (AD36).

- **T1 Contract check in `tests/ui_contract.test.js`.** Contracts live as data (proposed
  `tests/ui_coverage_contracts.json`, one entry per matrix row, fields as in section 7).
  The test enumerates `routeTable()`, the region and center-mode specs, and the
  `definePanel` and `registerWorkspaceModule` ids. It fails when a contract names a home
  that does not exist, uses a primitive outside K1-K8, or omits a state. It fails when a
  budget count rises without a ledgered allowlist entry with a `reason` (the UR65
  allowlist pattern). A registered panel without a contract is ledgered exactly, and that
  ledger shrinks as panels get contracts, so the test can land before every panel is covered.
- **T2 Screenshot matrix in `scripts/playtest/d1-panel-matrix.mjs`.** Add the MacBook
  size and a state axis: for each contract, a disposable fixture per declared state
  (populated, empty, blocked). Assert as well as capture: no page scroll, the primitive's
  root inside the viewport, every disabled control with a visible reason, non-empty
  empty-state text, the back bar visible. A slice runs only its changed contracts; the full
  run is on demand. Full scale: about 18 contracts × 3 states × 3 sizes × 2 text sizes.
- **T3 Leak check.** Render each contract with a sealed-truth fixture and assert the
  fixture's truth string is absent from DOM text and accessible names. This applies PD4.
- **T4 Game MCP text.** Note and stop-reason lines are plain text in `game_look`, so the
  headless bot (and P6's decision-gap report) can read them.

## 7. UI-contract template (proposed)

Every system card fills this before UI work starts. It is one block in the card, not a
separate document.

```text
UI contract: <system id and codes>
Home:        <existing route / region / center mode / surface type; tab if any>
Primitive:   <K1-K8; a lens if any>
Start:       <main (extends an accepted surface) | Projects drawer (UR2)>
Attaches:    <which lives see it (PD1)>
Says:        populated: <one example line, effect first, UR70>
             empty:     <how to fill it (UR32)>
             blocked:   <the reason the player sees>
             loading:   <what shows while settling, or "none">
             unknown:   <what the observer cannot know, and how that reads (UIV6)>
Actions:     <outcome-labelled commands with cost; preview = commit>
Keyboard:    <Tab order; shortcut if any; Esc behaviour (UR53)>
A11y:        <role and label; text never colour alone (UR37)>
Sealed:      <ID-only fields, or "none">
Persistence: <saved fields or "projection only"; migration decision>
Viewports:   1920x1080, 1800x1040, 1536x864 at 14 and 21 px; what folds at the floor
Evidence:    <matrix states to capture; journey to exercise (UR57)>
```

## 8. Proposed standing rules (proposed 2026-10-27, awaiting Weibao's yes)

The brief said "UR70 onward", but UR70-UR75 already exist (descriptions, 2026-10-25). These
start at UR76. They are not added to UI_RULES.md or the rules index until he says yes;
the yes that accepts them is "yes to UR76-UR82".

| Code | Proposed rule | Mistake it prevents |
| --- | --- | --- |
| UR76 | **Fill the UI contract before building.** Default: a system card names its home from existing homes and its shape from the shared primitives, with every state's text. Dial: a throwaway lab view in the Projects drawer may skip it. Reason: the per-feature screen starts when nobody decides placement first | Each new system arriving with its own panel and its own idea of empty |
| UR77 | **Budget the homes in numbers.** Default: 20 routes, 5 regions, 4 center modes, about 7 Local actions, 7 tabs per route; raising a count needs a demotion or merge and Weibao's yes, ledgered with a reason. Reason: UR3's budget covered one column; the sprawl risk is now routes and tabs | Route and tab creep, one system at a time |
| UR78 | **Content inside an accepted surface is not a promotion.** Rows, lines, chips and tabs in an existing home may ship as adopted direction; a new Local actions entry or route still goes through the Projects drawer (UR2) | Reading adoption as promotion, or parking a stop-reason line in the drawer |
| UR79 | **One shape per kind of information.** Accounts use the ledger, dated things use the timeline, after-the-fact summaries use the note, policies use the policy row. A new primitive needs two existing consumers (UR54) | Five ledgers with five column orders |
| UR80 | **Lenses only narrow.** Overlays, reader dials and observer views filter the player projection (AR8); none reads world truth; sealed outcomes appear by ID and status | A spoiler overlay or debug view leaking a sealed or future fact |
| UR81 | **Stops and absences explain themselves.** Default: a stopped routine, a missed clock and a return after absence each get a note line naming what happened and why, linked to its source; when nothing happened, the note says so. Dial: the player may quiet a category | Silent stalls and empty recaps read as bugs |
| UR82 | **Attached or absent.** A system appears in a life when it has rows attached to that life; once met, its empty state explains how to fill it | Every layer (book, travel, cheat) showing in every life |

## More to consider, round 1 (2026-10-27)

**ACT NOW (done in this file):** the 18-row coverage matrix; the eight primitives with
existing consumers; the budget and the rules for adding a surface; the IA per size;
progressive disclosure and lenses; the B1-B5 order; the T1-T4 tests; the contract
template; UR76-UR82 proposed; the "pinned box" naming gap (F1) mapped to the work line.

**ACCOUNT FOR NOW**

- UC-A1. **The note needs a "last seen" marker.** B1 is the first slice here that
  touches persistence; it needs a migration or compatibility decision before code.
- UC-A2. **backlog-ui owns `ui_components.js`.** B3 is its row or a hand-off; it is not a
  parallel edit (UR19).
- UC-A3. **Tabs are cheap and can still sprawl.** Seven new tabs land across three
  routes; Ledger goes to four or five tabs. Review it at B4.
- UC-A4. **K5 is thin.** It has one strong consumer (`storylet_ui.js`); confirm the
  threshold start screens really share its shape before generalising it.
- UC-A5. **The resolver is a dependency.** M9, M11 and PD4's observer view assume
  CAE-E1's `refOf`; until then they read today's names and cannot show residue.

**LATER or DELEGATE**

| # | Item | Level | Effort | Done check |
| --- | --- | --- | --- | --- |
| UC-L1 | B1 note and stop reasons | Sonnet medium | One session | Section 5, B1 |
| UC-L2 | T1 contract data and test, with the ledgered allowlist | Sonnet low | Half a session | The test fails on a planted contract that names a missing home and passes on the real set; budget counts read live |
| UC-L3 | T2 matrix extension (MacBook size, state axis, assertions) | Sonnet medium | One session | One contract's three states captured at six size and text pairs, with the assertions passing and one planted overflow failing |
| UC-L4 | Contracts written for M1-M18 from this matrix | Haiku | Small | Every row has a contract entry; T1 passes with no ledgered omissions for these rows |
| UC-L5 | UR76-UR82 into UI_RULES and the rules index, on Weibao's yes | Sonnet low | Small | `npm run check:rules` passes; the router names them for UI tasks |
| UC-L6 | 150% page zoom at 1920 (1280 wide) as a recorded gap, checked once ZM6 lands | Sonnet low | Small | One screenshot set and a note of what breaks |

## Verification

- Sources read: UI_RULES (UR1-UR75), `.claude/rules/player-ui.md`, the standing UI priority,
  master plan rounds 4, 5, 9 and 10, GM_PLAN section 17, protagonist PLAN section 17 and
  18.1-18.2, the register, and the 2026-10-27 reports' proposal sections (attention P1-P8,
  3.1-3.3; NPC E1-E8, N1-N7, C1-C5, R1-R6, K1-K8, L1-L8; canon PX1-PX5, PX13-PX15; time
  travel TT1-TT6, TI1-TI7, SI1-SI6; CAE-P4, K1-K15). File headers in `src/` as cited.
- Advisor: one call before writing, on the primitive set. Taken: note first (UIV1 had
  landed), the policy-row primitive, lenses only narrow, numeric budget, checks built on
  the existing test and matrix, the "pinned box" gap.
- `scripts/check_rules_index.mjs` reads rule files and the index only, so proposed codes in
  this dispatch doc do not affect `check:rules`; it was not run (no rule file touched).
- No game run: nothing here is implemented. Every row is a proposal; nothing is
  agent-verified in a browser.
