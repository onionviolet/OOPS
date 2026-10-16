# Proto23 parity: what YAIR keeps on purpose, and what is still worth absorbing

2026-10-15, after R12. Weibao: "some stuff have reasons to exist for us specifically,
like the top bar to make stuff condensed and seeable and more? Some features are
specific ways here for specific reasons to better fit our end goal, so we need to
establish that accordingly?" Rule recorded as [UR49](../../../UI_RULES.md) and in
[USER_VISION](../../../USER_VISION.md#parity-keeps-yair-specific-reasons-2026-10-15).

Proto23 is the visual/composition baseline (UR12), not a feature checklist. YAIR is a
laptop-first life-sim across many worlds with knowledge-gated discovery; Proto23 is a
single-world combat idle. A divergence is a gap only when it has no YAIR reason.
Everything below is an agent analysis, not accepted direction. Evidence: Proto23 R7
captures (`evidence/parity-r7/proto23-*.png`), R11/R12 captures, and the owners linked.

## K: Divergences YAIR keeps on purpose

| ID | YAIR choice | Reason and owner | Proto23 lesson that still fits inside it |
| --- | --- | --- | --- |
| K1 | Persistent top navigation bar | Weibao 2026-10-15: one-click paths to large panels, little scrolling ([UR21–UR31](../../../UI_RULES.md)). Proto23's five bottom tabs cannot carry YAIR's feature count | Reveal entries by discovery (already live: the bar grew Bestiary/Books/Travelers on the populated save). Labels must name destinations (UR10); see N3 |
| K2 | Full-height Reports column with filters, follow, Stop combat log | UR11, UR44, R7 F17–F18 | Same column as Proto23; lesson is line richness (A3) |
| K3 | Knowledge-gated names ("Unfamiliar material"), no invented enemy rank/level | Sealed secrets, UR36, UR40, R7 F7. Proto23 prints raw model values | Show known facts as plainly as Proto23 does; never the unknown ones |
| K4 | Inspection is free, actions explicit (select then Craft, inspect not retarget) | UR35, crafting screen 2026-10-13 | Keep Proto23's speed with one explicit button, not click-to-act rows |
| K5 | Place actions with keepers, Projects drawer, ~7-entry budget | UR1–UR4 | none needed |
| K6 | Twelve real stats with modifier explanations; full Attributes reference | U9/U10, R10/R11 | Proto23 shows hit/dodge/crit as one plain sentence; keep YAIR depth, borrow the plainness |
| K7 | One card per actual opponent | U5, R9 | Proto23's area progress and battle controls live with the opponent (A4) |
| K8 | Layout menu and Existing-layout compatibility | U1, UR17, PROJECT "play shows one Layout menu" | none; placement question is N2 |
| K9 | Laptop-first use of the whole screen | Standing UI priority 2026-10-13 | Proto23 never leaves a region idle; see A1 |

## N: Divergences with no recorded reason (fix or justify)

| ID | Observation | Disposition |
| --- | --- | --- |
| N1 | "Around you" (upper center) is blank in the Village at idle on the populated save, a third of the play area doing nothing. R7 F14 says it should show the place description and known people | **ACT NOW candidate:** reproduce, then restore F14 or give the region a stated job |
| N2 | Footer in normal play carries Authoring, a presentation picker labelled with an internal round ("Proto23 UI R12"), Comfortable, and a "dummy hit counter" | **ACCOUNT FOR NOW:** one Layout menu is intentional; the round label and counter have no player reason. Move dev/compat choices into Layout or Settings without removing them (UR17) |
| N3 | Top-bar labels "Data", "Beginning", "Ledger" do not say what opens (UR10) | **ACCOUNT FOR NOW:** keep K1, rename or add one-line hover status per UR26/UR31 |
| N4 | During combat the lower center shows only "Combat in progress" and an empty bar | Fold into A4 |

## A: Proto23 strengths still worth absorbing, ranked

Ranked by how often the player sees it and how cleanly it fits K1–K9.

| ID | Strength (Proto23 source) | Fits YAIR how | Cost / risk |
| --- | --- | --- | --- |
| A1 | Every region always earns its space (enemy pane, location header, log) | Fill N1 with place, people and current work; fill N4 with area progress | Low. Presentation only |
| A2 | Equipment slot grid always visible in You, empty slots named (`proto23.html:9063–9137`) | Show the slot grid when measured You space allows, as R11 does for secondary stats; Gear disclosure stays for short screens. UR34 allows disclosure, so this is fit-dependent, not forced | Medium. Competes with secondary stats for space; needs a priority order |
| A3 | Log lines celebrate: one line per milestone, colored nouns ("New Skill Unlocked! 'Walking'", "New item obtained: Wheat x5") (`10296–10332`) | R7/R8 colored categories; per-noun color and milestone phrasing still to compare on a populated stream | Verify first on a live stream (UR44); no change claimed yet |
| A4 | Battle controls and area progress sit with the opponent ("Pause next battle", "Resume", "Area: Training Grounds / 50") | Put native YAIR equivalents (stop/continue fighting, kills or progress in this area) on the opponent panel only where native data exists | Medium. Must map to real native commands; no invented counters |
| A5 | Inventory one-click category tabs with a "new" badge (ALL/WPN/EQP/USE/OTHER) | Same native filter as a tab row instead of a dropdown; YAIR already has the new-item dot and category colors (vivid 2026-10-13) | Low. Search/count stay (UR27) |
| A6 | Sortable skill table (A-Z / type / level, XP column) | Check the native Skills tab first; adopt sort headers if missing | Low |
| A7 | Crafting category filters inside a station (MED/FOD/WEP/MAT) | Useful once a station lists 30+ recipes (Cooking does); R12 left list order native | Low-medium |
| A8 | Mystery placeholder tabs ("???????") revealed by events | Only as a deliberate per-world mystery (UI_SOURCE_ABSORPTION P1); the default stays "absent until known" | Park unless a world asks for it |

Not absorbed, on purpose: raw enemy rank/level (K3), click-to-craft rows (K4), body-part hits (YAIR has no native roll), fixed-coordinate single-file layout.

## Next slice (proposal)

R13: N1 + A1 + A4 together, because they are one question: what each region shows when
you are idle, working or fighting. Then A5/A2. Before building, run the planned
top-bar sweep (every destination at 1366×768 on the populated save) to cover the
feature panels that no round has checked yet. That sweep was started and stopped at
Weibao's interruption; it is not run.

## B: Better implementations for the existing requests (proposals, 2026-10-15)

Weibao: "consider better implmentations for my requests and more". Each row names
what R7–R12 did, a better shape and why. Codes continue from K/N/A. None is built.

| ID | Request | Current implementation | Better implementation | Why better |
| --- | --- | --- | --- | --- |
| B1 | U1/U3/U4 use the screen | Per-feature special cases: R11 measures You for secondary rows; R12 adds a CSS rule so Crafting borrows the right-center column; R10 does the same for Attributes | **Regions yield when idle.** Each region reports what it has now (idle, has target, has task). An empty region gives its space to the neighbor with a declared need, through one rule in the layout owner. Crafting, Attributes, trade and long services stop needing their own CSS | One mechanism instead of one patch per screen; fixes N1 and the R12 short-screen tradeoff together |
| B2 | N1 blank "Around you" | Focus fills only after a selection (`village_workspace.js` `villageFocus` returns nothing at idle) | **Idle Focus is the place card:** place description, known people and things as chips, current work. Selecting a chip swaps in that subject; Esc or deselect returns to the place card. People/Things tabs in the lower center can then shrink to actions | Proto23 lesson (every region earns its space) inside K5; the data already exists in the frame |
| B3 | U9/U10 more stats, auto fit | Fixed secondary order, shown as space allows | **Context sets, stable within a context.** Fighting shows hit/evade/AP/EP; crafting shows skill XP and stamina; travel or cold weather shows Cold Δ and recovery. Order changes only when the context changes, never per tick (R11 rule kept). Pinning a stat (L-later) overrides | The most useful six values instead of the first six |
| B4 | A2 equipment grid vs secondary stats | Gear closed by default; secondary rows fill spare space | **One priority list per region** feeds B1: core stats, then context secondary set, then the slot grid, then more secondary. The fitter places items in order and stops when full | Gear and stats stop competing through two separate fit systems |
| B5 | R12 recipe list | Rows are names; unavailable rows are gray | **Rows carry readiness:** "×3 ready" or "missing 1" at the row's right edge, from the same itemRecipeStatus. Optional result-category chips (A7) only when a station lists 20+ recipes. Station tabs become one scrollable row with the selected one kept in view when the column is narrow in text units | You can scan what is craftable without clicking each row; reclaims the 3-row tab block at 21px |
| B6 | U6 reports | Category colors and controls (R7/R8) | **Render nouns from recorded subjects**, not text matching: item, skill, person and number fragments each get their semantic color and a hover from the subject recorded at emission (UR48). Milestones (new skill, recipe, title) get one bold line like Proto23's | Proto23's celebration (A3) built on YAIR's existing durable subjects |
| B7 | U8 weather | Words and titles for season/weather/temperature | **Connect temperature to you:** hovering the temperature shows your native tolerability and links to Cold Δ in You | Weather becomes a fact about your character, not decoration |
| B8 | A5 inventory | Category dropdown, sort dropdown, Reverse button, search | **Tabs only for categories you hold, with counts; click the sort label to toggle order.** Search and count stay (UR27) | Two controls fewer, one click instead of two, empty categories never shown |
| B9 | N3 top bar | 12–15 flat entries, some opaque | **Grouped clusters** (You · World · Records · System) with thin separators, destination labels, a status dot from UR13/UR26 and hotkey in the hover. Same one-click bar (K1) | Keeps the reason for the bar while making it scannable |
| B10 | N2 footer | Dev/compat controls in play | **Settings ▸ Layout** holds presentation, density and Authoring; the footer keeps Save/Export/Import and a plain save state ("Saved 2 min ago" / "Not saved"), Proto23's clearest footer fact | Removes internal round names from play without removing any choice |
| B11 | A4/N4 fights | Lower center shows "Combat in progress" | **Trip tally while fighting:** kills, loot, XP and time in this area from recorded events, plus the native stop/continue commands on the opponent panel. Tally is a projection of the log, not a new store | Fills the idle region with the numbers idle players watch, without inventing counters |

## More: delivery and verification

| ID | Observation | Proposal |
| --- | --- | --- |
| M1 | Eleven per-round harness libraries (`r3-lib` … `r12-lib`) each rebuild fixtures, open/textSize helpers and screenshot code | One shared harness module plus a **named scenario catalog** (idle village, cooking ready, three-enemy fight, populated log, cold weather) loaded only on test origins. Every round reuses it; comparisons become "same scenario, two builds" by default |
| M2 | R12 commit could not include its layout CSS or bundle because R7–R11 are uncommitted (`ui_tokens.css`, `proto23_shell.js` untracked) | Commit the R7–R11 foundation as its own reviewed checkpoint before R13, so later rounds commit whole. Needs Weibao's go-ahead |
| M3 | Each round's comparison page is hand-built | Generate a contact sheet per scenario × size × build from M1, so before/after review is one page |
| M4 | The R11 interaction harness reads a hover preview with no wait after a Gear click (1 of 5 failed on R12) | Wait for the preview to name the focused stat before asserting; then recheck R12 |

## Recommended order

1. **M2** (if approved), so work stops piling up uncommitted.
2. **R13 = B1 + B2 + B11:** what each region shows when idle, working or fighting. B1 is the mechanism; B2 and B11 are its first two consumers. Run the top-bar sweep first.
3. **B5 + B8:** list readability in crafting and inventory.
4. **B3 + B4**, then B6, B9, B10, B7.
5. **M1/M3** alongside R13, since R13 needs idle/fight scenarios anyway.
