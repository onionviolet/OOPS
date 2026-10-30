# UI coverage audit, 2026-10-30 (1920x1080, desktop only)

Proposals only. Nothing here changes a standing rule. Codes are COV1-COV15 (proposals) and F1-F12 (findings) so they do not collide with UIA, FLA, VSX or RCT in `docs/audits/UI_DESIGN_CORE_AUDIT.md` (rounds 1-14). Round 13 (motif layer, world packs) and round 14 (native skin, glyph set, motion set, contract test, visual baseline, merge order) are not repeated; where a proposal builds on them it says so.

## What was measured, and how

- **Build under test.** Working tree on master at about 10:00 (dist/bundle.js dated 09:58, includes other sessions' uncommitted edits). One defect (F1) was re-run on a `git archive HEAD` copy to separate it from that work.
- **Capture.** Headless Chrome through `scripts/playtest/lib.mjs` Session, my own static server on a random port (stopped by exiting the node process; PIDs 76399, 95517, 987, 3816, 5671, 5820, 37419, 43072, 8428, 11777, 29557, 32809 all exited on their own, nothing left running). No visible window. Seeded RNG, frozen clock.
- **Lives.** A fresh Village life (one run, plus 600 played minutes), a fresh LOTM Tingen probationer life (crossed from Village, reported in), and a populated Village save (`tests/fixtures/perf/mid.json`) because most figures hide behind state a fresh life lacks.
- **Coverage.** Fresh Village: 48 center panels from the "All panels" list plus home, 3 more disabled. Fresh Tingen: 40 panels, 14 disabled (Village-only). Populated Village: 53 panels. Tingen workroom: 4 tabs. Top-strip buttons, bottom tabs (Here, Crafting, Mixing, ?) and the figure gallery (45 figure sections, 14 captured). About 235 screenshots plus per-panel DOM metrics.
- **Where it lives.** Scratchpad `/private/tmp/claude-501/-Users-weiwei-code-yet-another-idle-rpg/cd176e5e-4ea6-4221-9d6e-7d2193b58158/scratchpad/ui_audit/`: `shots/` (fresh lives, all panels), `shots2/`, `shots3/`, `shots4/` and `shots4h/` (top-strip and the Journal defect, HEAD copy), `shots5/` (populated save, Tingen tabs), `shots6/` (label audit), `gal/` (gallery), `*/metrics.json` (raw numbers), `cap*.mjs` and `gal.mjs` (scripts).
- **Word counts** are `innerText` of the center panel (`#center_mode_content`), so they include button labels and headings. "Longest block" is the longest run of own-text in one element.
- **Not done.** No fight, rite, study or home was started, so combat, rite, study and home figures were judged from the gallery and docs, not from live play. Human-reviewed: nothing. All of this is agent-verified.

---

## 1. Visual-form census

### 1a. Live game (what a player sees today)

| View | Form | Verdict |
| --- | --- | --- |
| Hero column (hp, xp, stamina, 12 stats) | Gradient bars with a number, then a hairline stat grid | Good. The best-looking thing in the game. Keep as the style reference |
| Condition and Body (left column, and again as a panel) | Prose line plus disclosure | Thin. Says "No active effects" in three places |
| Inventory column | Hairline list with chips | Good, but 2 rows in a 940 px tall column on a fresh life |
| Reports column | Log list | Fine, 3 lines in a 940 px tall column on a fresh life |
| Around you (home) | Two grids of bordered cards (people, services) | Good form, the only card layout in the game |
| Local actions (home) | Icon plus label rows | Fine; 5 rows then 300 px empty |
| Next step banner | One-line imperative plus "Show me" | Good (FIRST_HOUR slice) |
| Top strip (24 tabs) | Tab row | Too many, and 3 are dead on fresh lives (F1) |
| Stats / Character & preparation | Master list (42 rows) plus detail pane | Good use of 721 px; 264 words, 43 buttons |
| Vows and trials | Prose plus inline buttons | Text wall (351 words, no structure) |
| Standing and ledger | Prose paragraphs of key-value text | Text wall that should be a table (233 words) |
| Work ledger (Work, Owed) | Tabs, then prose with a button strip | Owed tab is the designed ledger; Work tab is prose |
| Village experiments / herbal | Prose, inline checkboxes, selects | Worst form in the game (F7) |
| Tingen workroom, Here tab | 26 sentence-long buttons in a stack | Menu as a wall (369 words) |
| Tingen workroom, Path tab | **Vertical rail of circle nodes** (ability ladder) | Good, one of three live figures |
| Tingen "Places and walks" | Rows with a small minute bar plus "Walk" buttons; map is behind a button | Bars good, map hidden |
| People you know | Two disclosures; the relationship web is inside the first | Figure exists, closed by default |
| Today, Where I am, Around this place | 3 to 4 line prose blocks | Thin, repeats the home pane |
| Mixing tab | Table (409 words) | Table is right here |
| Equipment comparison, Draft preview | Tables | Fine, but empty on a fresh life (5 words) |
| Appearance, Effects & sound | Form rows | Effects & sound is 877 words and 2900 px tall (F5) |
| Reports panel, Known things, Naming | Lists | Fine |

**Counts, live.** Of 57 center views measured on the populated save (53 panels plus 4 Tingen tabs): **2 contain a figure** (People you know web, closed; Tingen Path ladder), **2 contain bars** (Character vitals, Tingen Here walk minutes), **2 tables** (plus Mixing, 3 overall), **4 disclosure stacks**, **3 lists**, **2 home views** and **42 prose, button and form views**. On fresh lives the count of panels with any SVG is **0 of 48 (Village)** and **0 of 40 (Tingen)**. The walk map is a third figure, behind "Show the walking map". So about **5 percent of live views are drawn**, and **100 percent of those are circle-and-line node graphs** (a radial web, a vertical rail, a hub-and-spoke map).

### 1b. Figure gallery (`figure-gallery.html`, what is designed)

45 figure sections, each shown in Luminous and Neutral with its text form below. Counted over the whole page (both skins, so halve for one skin): **1188 circle/ellipse, 386 line, 70 path, 0 rect, 0 polygon**. So **72 percent of drawn primitives are circles, and nothing is a bar, a card, a cell, a table or a block**. Layout families, by section (classified from ids, screenshots and docs; approximate):

| Layout | Count | Examples |
| --- | --- | --- |
| Vertical rail of circle nodes (ladder) | 14 | 8 ability ladders, org ladders (3), research ladder, walk ladder |
| Horizontal rail of circle nodes (track, strip) | 9 | chant, chase, route strip, craft/rite strips, home strips (3) |
| Ring, radial or hub-and-spoke | 14 | rite rings (3), loop ring, web, ripple, digest, memory palace, walk map (2), fights (2), knows |
| Tree, fan or flow | 8 | family household and stranger, ancestors fan, lives tree, craft flow, research map, divergence, body channels |

Verdict: every drawn view is a node-link diagram. The forms the docs themselves weigh and prefer for some questions (card, table, timeline band, chip row, bar with a number, paper-and-ink sheet) mostly have **no gallery home**. The Owed ledger and the crossing threshold are built and tested but are not in the gallery (their fixtures `economy.js` and `worlds.js` are used only by tests).

### 1c. What the build shows against what a doc designs

See section 5. Short version: 21 view docs, 13 gallery fixture modules registered, about 6 representations reachable on a fresh life.

---

## 2. Text-density offenders

Measured on the populated save and the Tingen tabs. "Struct" is list items plus tables plus bars. Over 80 words: **25 of 57** views. Over 200 words: **10**.

| Words | View | Longest block | Struct | Scroll height | Problem |
| --- | --- | --- | --- | --- | --- |
| 877 | Effects & sound (Appearance) | 42 | 0 | 2900 | Settings as prose; no grouping, no preview |
| 380 | Tingen workroom (Village-side entry) | 72 | 0 | 808 | One 72-word paragraph plus 10 buttons |
| 369 | Tingen workroom, Here tab | 23 | 6 | 1232 | 26 buttons, several of them 30 words long |
| 368 | Village experiments | 34 | 0 | 1652 | Prose, 3 checkboxes read as a sentence, shelf of "Take a copy" |
| 351 | Vows and trials | 36 | 0 | 982 | Each vow is 40 words plus a "Swear" button; tempering block is 150 words |
| 264 | Character & preparation | 14 | 0 | 781 | Fine as a list (it is a reference), listed for completeness |
| 233 | Standing and ledger | 65 | 0 | 781 | Three houses as three identical sentences; credit lines hold the premium formula |
| 223 | Journal & atlas | 28 | 36 | 1194 | A list with 36 rows; acceptable, needs filter on top |
| 223 | Tingen Path tab | 31 | 6 | 1185 | Ladder plus a second path as one-line text; fine |
| 214 | Lives & inheritance | 27 | 14 | 872 | List, should be the lives tree figure |
| 185 | Tingen Work & merit | 24 | 0 | 857 | Prose |
| 180 | Gear workshop | 31 | 0 | 781 | 5 disclosures; ok |
| 137 | Your beginning | **75** | 0 | 781 | One 75-word paragraph, opens collapsed |
| 105 | Riverside exploration | **66** | 0 | 781 | One 66-word paragraph plus a button |
| 100 | Focus | **74** | 0 | 781 | One 74-word paragraph |
| 104 | Notebook (86 buttons, 30 disclosures) | 73 | 8 | 991 | Disclosure maze, first open block is "Known actions" boilerplate |

Single paragraphs over 60 words: **Tingen workroom 72, Your beginning 75, Focus 74, Notebook 73, Riverside exploration 66, Standing and ledger 65.** Everything else is under 50.

Boilerplate seen on unavailable actions (Notebook, known actions): "This action is not available under the current conditions. Review the known preparation or choose another action." is shown instead of the specific reason, 3 sections deep. Engine formulas leak as player text: "Premium is 5% of cargo value times (1 + 8 x route danger)" and "Road danger here is 0.05".

---

## 3. Balance at 1920

Geometry measured on the live shell.

| Region | Home view | Opened panel | Reading |
| --- | --- | --- | --- |
| Hero column | 330 x 380 | 495 x 300 (stat grid reflows to 3 rows) | Resizes when a panel opens; the stat block jumps |
| Inventory column | 330 wide, 570 tall, **2 rows** | 620 wide, 650 tall, 2 rows | **Widens by 290 px when a panel opens and stays nearly empty.** Biggest wasted block |
| Around you (top center) | 1030 x 380 | hidden | Good fill in Village; **empty in Tingen** ("No known subjects here", 150 px of nothing) |
| Local actions (lower center) | 1030 x 420 | replaced | **5 rows then 300 px blank**; in Tingen the list is **empty** ("Options 2", no actions shown) |
| Center panel | 1030 | **721 wide, 780 to 860 tall** | 37 percent of the width carries the panel the player just asked for |
| Reports column | 500 x 940 | 500 x 940 | 3 to 8 lines, 90 percent empty for the first hour. Always visible, never the thing being read |
| Margins | about 20 px | about 20 px | Fine |

So at 1920 the three side columns (hero 495, inventory 620, Reports 500) take **1615 of 1920 px, 84 percent**, while the opened panel gets 721. When a text-heavy panel opens it scrolls (10 of 48 Village panels exceed 800 px; Effects & sound is 3.6 screens) while 1100 px of side columns sit empty. The standing UI rule is desktop first, so this is the target case, not a corner case.

Squeezed: the Tingen workroom buttons (30-word sentences wrap in 680 px), the stat grid (reflows when opened), the Gallery text forms (a 250 px column inside a 900 px frame, figure 150 px inside the same frame; the duel figure fills about 4 percent of its box).

Empty: Reports on a fresh life, inventory below 2 rows, Tingen home center, six panels with 5 to 8 words (Cultivation insights, Projects, Village travelers, Village neighbors, Equipment comparison, Records).

Repeated content (same facts in several places):
- Condition: left column, "Condition" top tab, "Condition" in All panels, "Stats & equipment", and "Character vitals" (5 places for hp, "No active effects", "Body · Human").
- Inventory: left column, "Inventory" tab, "Belongings", "Inventory tools", "Inventory & combat view" (5).
- Home: "Around you", "Local actions", "Around this place", "Where I am", "Village scene" (5 views of "where am I and what can I do").
- Reports: right column and the "Reports" panel (the panel is identical, filter included).
- Knowledge: Journal, Known things, Knows, Stories & history, Naming and achievements, Remembered years, Your journal & atlas (7 entries).
- Identical output: Journal, Data and Knows buttons and Local actions all render the same home view on a fresh life (same 21 words).

---

## 4. Intuitiveness issues, with fixes

| Code | Panel | Issue | Fix |
| --- | --- | --- | --- |
| F1 | **Top strip: Journal, Data, Knows** | On fresh Village and Tingen lives, the buttons "do nothing" visibly. They route to `records:*`, which mounts `#journal_div` at 0 x 0 (reproduced on HEAD archive, so not another session's edit). Knows even carries a "1 new" or "2" badge in Tingen. In the populated save the Journal works. FIRST_HOUR FH1 says the Journal is "not reachable yet", but the tab is shown and clickable | Hide the three tabs until the Journal opens, or make them open the same panel the populated save gets. Add a check that every visible top-strip button changes `data-center-task` or opens a visible node |
| F2 | **Top strip** | 24 tabs at minute 0, mixed in kind: panels (Stats), toggles, a world entry (Worlds), settings, and "All pane" as a select. "Stats ·" and "Condition ·" carry stray dots. `?` is a bottom tab, not the help | Group into 5: Me (Stats, Condition), Things (Inventory), Records (Journal, Knows), People and places (People, Travelers, Worlds), Run (Ledger, Organizations, Projects, Beginning, Connection, Settings); reveal by first reach as FIRST_HOUR proposes (a dot, a Reports line) |
| F3 | **All panels select** | 49 entries with internal names: "Spilled stock and smoke", "Original rules", "Draft preview", "Original site", "Continuing connection", "Inventory & combat view", "Item details" (disabled), "Local actions". Tingen shows 14 greyed Village entries with no reason | Sort by group (Me, Home, World, Run), plain names, a one-line reason on disabled rows ("Village only") |
| F4 | **Bottom tabs: Here, Crafting, Mixing, ?** | `?` is not a label. "Crafting" and "Mixing" are tabs in a lower-center strip but Village experiments and Polyjuice bench are also "crafting"; Mixing opens at the counter only | Rename `?` to "Help"; show Crafting and Mixing only when a bench is present, or say why they are off |
| F5 | **Effects & sound** | 877 words, 2900 px, one column of prose, no preview | Group by effect (motion, sound, receipts) in a two-column board with a live sample per row; 120 words on screen at once |
| F6 | **Vows and trials, Standing and ledger, Work ledger** | Buttons sit at the end of long sentences ("... sleeping through the watch breaks this vow. Swear"). "Borrow 25" repeats three times, disabled with no reason; "Temper without rations" shows "Not ready yet." in 10 px | Make each vow a row (name, effect chip, scar chip, state, Swear); make houses and credit a table with columns; put the disabled reason next to the button in 14 px |
| F7 | **Village experiments** | Three bare checkboxes whose labels run into the next sentence ("Layered brazier formulation ... Press a body-conditioning tablet ... Hold this batch on the brazier"); select "Free experiment (no method)" sits between two paragraphs | Group as a form with a heading "Method", a labelled checkbox column and one Brew button; or fold into the Mixing table that already works |
| F8 | **Tingen workroom, Here** | A stack of 26 equal-weight buttons. "Accept the supervisor's allocated Seer dose (no faculty yet; one pathway per life, switching is a stated cause of loss of control)" is a button label. Several "Return to Tingen docks." lines hang below as muted text | Short verb plus noun on the button ("Accept Seer dose"), the cost chips on the right, the risk in the inspector; group into Bench, Buy, Rest. UR rules already ask for this (UR42) |
| F9 | **Around you, Tingen** | "No known subjects here" plus 150 px empty, and an empty Actions list ("Options 2" hides them) | Show the Options inline when Actions is empty; say "Nothing to do here yet. The supervisor is in the workroom" |
| F10 | **Date line** | "Calendar unknown here" in Tingen is a hole in the header, not a state a player can act on | Show the date the lead knows ("Mon 4 Jun, about midday?") with the guess word, or hide the field |
| F11 | **Unlabeled controls** | Control audit (UR checks): 4 visible buttons with no text, title or aria-label (Homes, Projects, Village travelers, Village neighbors: `#meet_village_neighbors` and 3 anonymous), 48 of 49 panels have a bare `▾` or `▸` as the panel-header toggle label, short labels ("Go", "Got it", "Swear", "Bio", "Take a copy") that rely on context, 6 panels with disabled buttons that give no reason | Label the four, name the disclosure toggles ("Collapse Standing and ledger"), expand "Go" to "Go to Infested field (15 min)" |
| F12 | **Panel names vs titles** | Panel title in the select, in the header and in the card differ ("Your journal & atlas", "Personal journal", "Journal"). Three panel pairs have the same 5-word body | Single name per panel from `LAYOUT_SPEC`, used in all three places |

---

## 5. Designed but unbuilt UI, and the engine data each needs

"Built" means the code exists and a player can reach it on a normal life without a fixture. "Gallery" means only the figure gallery shows it. Findings come from the docs' own receipt lines, the imports in `src/`, and what the live sweep did and did not show.

| Item | Where designed | State | What it needs |
| --- | --- | --- | --- |
| Relationship web | RELATIONSHIP_WEB | Built, but closed inside a disclosure in People you know; the other four shapes (ripple, rings) are gallery only | Cast `relations` records instead of the web's own model (doc, line 261); `told` and `unknown` edge states from person memory |
| Ability ladder | ABILITIES | Built for LOTM Path tab; a compact version, a rung-gained notification (RA17) and the glance (RA11) are not wired | Per-rung experience from the digestion model; presence events for a rung gained |
| Walk map | MAPS_AND_TRAVEL | Built, behind "Show the walking map" in Tingen; the Village has no map | Places with minutes for the Village region; range data for distance rather than stages |
| Rite and brew figure | RITUALS_AND_MAKING | Built in the LOTM bench (not exercised here); needs a rite in progress | Rite state (chant line, component placement, moon window) as a read model |
| Combat card and versus row | COMBAT | Built for the native fight (not exercised); chase adapter is **fixture-only** | Pursuit distance or range; Round 2 says the pursuit model has stages, not distance |
| Body figure, channels, second body | BODY_AND_CONDITIONS | BC1 wired; **BC2 and BC4 fixture-only** | Measured channels (not in the engine); the "Others see" column for the Polyjuice bench |
| Character sheet | CHARACTER_SHEET | Gallery plus `you_sheet.js`; People sheet exists | The dated character read model (WA50) |
| Crafting glance | CRAFTING | Built in `crafting_detail.js`; no crafting panel was open in a fresh life | Optional time model fields in `display.js` |
| Mixing table | MIXING | Built (Mixing tab, 409 words) | Potion map, quality bands and assays are not built (docs 14, 17, 45) |
| Home overview and strips | HOMES_AND_BASES | Built (`home-overview` panel, 32 words) but sparse on a fresh life; 3 strips in the gallery | Home condition and capacity projections already exist; needs a home to be owned |
| Owed ledger | ECONOMY_AND_INSTITUTIONS | Built (Ledger, Owed tab); **no gallery home** for the table form | Due, Orders and Claim tabs; obligation rows from `obligations_ledger.js` |
| Organization view | ORGANIZATIONS | Built for the Market courtyard only. "The live game today has no leadable gang, sect or corporation" | Leadable organization with members, duties, income; the roster fixtures (crew, sect, courtyard) have no live data |
| Talk view | TALK | Built in the dialogue host; the **margin note and bark forms not built** | Person memory `reactionLine` plus a per-world phrase table "once memory is wired into the live game" |
| Time and Chronicle | TIME_AND_CHRONICLE | Return digest built; day montage strip (TC2) and Reports shell (round 2) not built; TC18 folding browser-unexercised | Calendar per place, notification shape |
| Spacetime | SPACETIME | **Gallery only** (loop ring, divergence, memory palace) | Per-place history by era, canon-run divergence tracking, loop state |
| Lives tree | FAMILY_TREE, SPACETIME | Lives & inheritance panel is a 214-word list; the tree is in `continuation_ui` behind Connection | Lives records already exist; nothing new, a placement decision |
| Family tree | FAMILY_TREE | `family_tree_panel.js` built; a fresh life has no Family entry in the select | Household records beyond the Village |
| Knowledge home | KNOWLEDGE | Built; Knows tab is dead on a fresh life (F1) | Known, guessed, unknown grammar over existing rows |
| Research / Study | RESEARCH | Built; **Study is disabled** on a fresh Village life, in Tingen, and in the populated save | A study in progress; experiments (not built), "insight" view |
| Crossing threshold | WORLDS_AND_CROSSINGS | Built; **no gallery home** (tested only); next slices (the seat header, `lead` slot, cast-seat carry list) not built | `observerView` for the cast seat groups; run-mode chip (canon or open) |
| First-hour goal card | FIRST_HOUR | Built (Next step banner); the opt-in main goal needs a per-world data row **and a save migration** | A persisted goal choice |
| Items | ITEMS | Card built; ITM1 provenance, ITM3 one list node, ITM5 per-world bag, ITM6 appraisal by skill, ITM7 non-equipment card | Provenance field written at acquisition (migration), reader level from skills |
| Motif layer, world packs | Round 13 | Not built | Roles on every spec (already done) |
| Style alternatives (paper-and-ink) | CRAFTING, MIXING, ECONOMY, TALK, SPACETIME | Described in six docs, built in none | A second skin in the gallery |

Totals: **21 view docs**, 13 gallery fixture modules registered, 2 fixture modules (`economy`, `worlds`) used only by tests, **3 figures visible in normal play**, **0 alternative styles built**, **4 forms the docs prefer over circles with no gallery home** (table, card, timeline band, ledger line).

---

## 6. Fifteen ranked proposals

Order is by what makes the biggest difference to the five concerns for the least cost. All are Sonnet unless a note says the look needs Weibao. Effort is in sessions: S is half a session, M is one session.

| Rank | Code | Proposal | Level | Effort | Done check |
| --- | --- | --- | --- | --- | --- |
| 1 | COV1 | **Fix the dead top-strip tabs (F1).** Journal, Data and Knows route to a 0 x 0 mount on fresh lives. Make them open the same visible panel the populated save gets, or hide them until reachable. Add a script check that every visible top-strip button changes `data-center-task` or exposes a node with nonzero size | sonnet | S | Fresh Village and Tingen at 1920: click each top-strip button, assert a visible change or no button; `Knows` badge opens something. Covers the original three and any later tab |
| 2 | COV2 | **Reclaim the side columns when a panel opens (section 3).** Keep inventory and Reports at their home widths (330 and 500 or narrower), give the freed 290 px to the center (721 to 1011 px), and collapse Reports to a slim rail while a panel is open. Layout owner approves, saved layouts load unchanged (UR17) | sonnet | M | 1920 screenshot of Village experiments and Effects & sound before and after: center at 980 px or more, scroll height of Effects & sound drops by 25 percent, hero stat grid does not reflow when a panel opens |
| 3 | COV3 | **Text to table or row for the three worst walls.** Vows and trials (row per vow), Standing and ledger (table: house, standing, sells, buys, why on hover), Village experiments (labelled form). Reuse the Owed ledger table shape | sonnet | M | Each panel under 150 words on screen at 1920, no paragraph over 40 words, buttons in a column, a disabled reason beside every disabled control |
| 4 | COV4 | **Open the best figure by default and show a shape that is not a circle.** Put the relationship web, lives tree and walk map open by default where a populated life has data; add one non-node form per doc that prefers one: Owed table in the gallery, crossing threshold card, day montage band (TC2), a chip row for the body, a bar row for study and craft | sonnet | M | Gallery has at least 4 sections with `rect` primitives or HTML tables, and the live game shows at least 6 distinct views with a figure or a bar on a populated save; circle-and-line share of gallery primitives falls below 50 percent |
| 5 | COV5 | **Collapse the five "where am I" views into one place pane.** Around you plus Local actions plus Today plus Where I am plus Around this place share one data model. Keep Around you and Local actions, make the rest tabs inside "Here", drop duplicate panels from All panels | sonnet | M | All panels list falls by 4; no panel with fewer than 25 words remains; Tingen home shows its options inline (F9) |
| 6 | COV6 | **Tidy the All panels select and top strip (F2, F3).** Group, rename in plain words, grey rows carry a reason. Use the names in `LAYOUT_SPEC` for the select, header and card (F12) | sonnet | S | Select has 5 groups, no internal ids, 14 greyed Tingen rows show "Village only"; header and select match for all panels (one script) |
| 7 | COV7 | **Tingen workroom: verb-first buttons and grouped sections (F8).** Short label, cost chips on the right, risk and canon note in the inspector. Group into Bench, Buy, Rest, Walk | sonnet | M | No button label over 8 words; panel under 200 words on screen; each group collapses; buttons keep their data ids so tests pass |
| 8 | COV8 | **Effects & sound as a board (F5).** Two columns, a sample per row, grouped by kind | sonnet | S | Panel under 250 words and 1.3 screens; changing a setting plays a sample |
| 9 | COV9 | **Empty-state rule.** A panel with under 30 words says what the player can do next and where (Cultivation insights, Projects, Village travelers, Village neighbors, Records, Equipment comparison). Hide a panel from All panels until it has content, as Study already does | sonnet | S | Zero panels under 15 words reachable on a fresh life; each empty state has a verb |
| 10 | COV10 | **Label pass (F11).** Name the four anonymous buttons, the 48 bare disclosure toggles, "Go", "Got it" and "Swear" with the target; put the reason beside every disabled button. Add the check to `uiCheck()` | sonnet | S | `uiCheck` reports 0 unlabeled and 0 bare toggles on both lives at 1920; disabled buttons have a visible reason |
| 11 | COV11 | **Move Reports content into use.** On a fresh life the 500 px column holds 3 lines for an hour. Dock the Next step banner, the Today strip and the day's due items there until the log has 8 lines, then let the log take over | sonnet | S | Fresh-life screenshot shows content in the Reports column; the log column is intact after 8 lines (UR11) |
| 12 | COV12 | **Merge the five Condition and five Inventory places (section 3).** One owner each, the others open the same panel through the shared controller | sonnet | M | All panels list has one Condition and one Inventory; hp and condition text appear once per screen; tests for pins and layouts still pass |
| 13 | COV13 | **A second skin for list-shaped views (paper-and-ink).** Six docs ask for it, none built. Build it as a world skin for the Owed ledger and the Mixing table so the gallery shows a non-node, non-glow look. Weibao looks at the gallery before it spreads | sonnet | M | Gallery switcher shows it on 2 fixtures; text forms identical; effects off clean; Luminous remains the default. Builds on VSX2, FLA2 |
| 14 | COV14 | **Put the unbuilt screens in the gallery.** Crossing threshold, Owed ledger and the TC2 band get a section each, with a text form and a 21 px check, so the gallery matches the docs | sonnet | S | Gallery lists the two fixture modules now used only by tests; contract test for them passes (RCT2 is the harness) |
| 15 | COV15 | **Data work to unlock the gated figures.** In order: study in progress for Research, a rite state read model for Rituals, pursuit range for Combat, per-place history for Spacetime. Each is a read model first, with a gallery fixture that matches it | sonnet | M each | A fresh-life route shows the figure for Research and Rituals; each read model has one fixture, one test and a text form identical to the fixture's |

Notes on ranking:
- 1 to 3 fix what a player trips over or reads badly today at no design risk.
- 4 and 13 answer "not every view a circle", but only after 2 and 3 give the figures room. 4 uses forms the docs already chose, so no new look is invented.
- 15 is last on purpose: figures that need engine data stay invisible until their data exists, so it is a prerequisite for 4 only on the Research, Ritual, Combat and Spacetime views.
- Nothing here changes an accepted decision. Where a proposal moves panels (5, 12) it keeps AD36 and UR17 (saved layouts load unchanged).

## Verification states

- Source edit: none. No repo file was touched.
- Captured: yes, headless, at 1920x1080, rebuilt bundle on a fresh origin (existing `dist/bundle.js`, which includes uncommitted work from other sessions).
- F1 reproduced on a `git archive HEAD` copy as well as the working tree.
- Not exercised: a live fight, rite, study, home build, return digest, family tree on a real life; 21 px text; effects off.
- Human-reviewed: no.
