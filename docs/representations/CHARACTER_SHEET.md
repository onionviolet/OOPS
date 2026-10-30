# Character sheet and inspection by means

Owner doc for the character sheet: one data-driven sheet for any character (you, the lead, anyone
met), where what you see of someone else depends on how you are looking. Started 2026-10-30 by the
rep-character-sheet session, from Weibao's ask to "digitalize each character, stats wise, ability wise
and everything" and to show "how things look with specific abilities, such as inspect skill".

**Status.** Everything here is a proposal (AD32) and the current best, open to refactor or replacement
with a reason (AD45). Codes CS1-CS19 are this doc's own; they cite UR, AA, ABR and MN codes rather
than restating them.

**Applies:** UR35, UR36, UR37, UR40, UR42, UR43, UR47, UR70-UR75, UIV6 (proposed), AA9-AA15,
MEANS_AND_APPRAISAL AP0-AP9 and MN1, ABR19, ABR21, MDL13, LTU5, LTU11, AD6-AD8, AD38, AD45.

## What exists after this slice

| Piece | File | Role |
|---|---|---|
| Projection | `src/character_sheet.js` | Pure: subject truth + observer + reads → rows marked known, guessed or unknown. Display never sees the truth. |
| Renderer | `src/ui/character_sheet_view.js` | Draws a view into the node it is given (pop-out safe). Wide grid or narrow disclosures; compose slots for sibling figures; text form. |
| Style | `styles/character_sheet.css` | Tokens only; honours the player's text size; flourish off under reduced and off effects. |
| People adapter | `src/character_sheet_people.js` | A People-you-know row (already the observer's knowledge) becomes a subject. |
| In-game mount | `src/people_ui.js` | Every People-you-know card gets a "Character sheet" disclosure. |
| Fixtures | `src/ui/preview/fixtures/character_sheet.js` | You and one met person (invented), eight named reads. |
| Gallery | `src/ui/preview/character_sheet_gallery.js`, one line in `figure_gallery.js` | Read toggles; `?only=character-sheet&reads=…&theme=…&size=21&layout=narrow`. |
| Tests | `tests/character_sheet.test.js` | Rough read hides exact values in view, text form and every DOM channel; ceiling; schema `???`; scope; self blind spot in two seats; adapter; layouts. |
| Evidence | `docs/representations/evidence/character-sheet/` | Headless 1920×1080 captures, gallery and real game. |

## Round 1, 2026-10-30: shape of the sheet

### The reading (PRF1)

One sheet shape serves your own expanded You view and the inspector for anyone else. Its rows come
from a projection of the subject through the observer's means, so an inspect, appraise, identify or
sense skill, a divination or plain observation each change which rows exist and how exact they are.
Premises: desktop 1920×1080 first, Weibao is the only player, sealed secrets stay sealed, seat
knowledge comes from `observer_view.js`.

### Four shapes weighed

| Code | Shape | What it does well | What it costs |
|---|---|---|---|
| CS1 | **Tabs** (Stats · Abilities · Body · Gear · Relations), the classic RPG character window | Short per tab; familiar | Hides most facts behind clicks; the moment an appraisal firms up three sections at once, the player sees one. Answers "what changed?" badly. |
| CS2 | **One scrolling sheet**, every section stacked | Nothing hidden; ctrl-F friendly | At 1920 wide a single column wastes two thirds of the width and becomes long scroll. |
| CS3 | **Paper-doll centre with satellites**: body and gear figure in the middle, stats, abilities, traits around it | Strong identity; gear and body read spatially | Body diagrams belong to rep-body and ability ladders to rep-abilities, so the centre would be someone else's figure; most characters you meet have little gear or body known, leaving a big empty doll. |
| CS4 | **Unusual: the dossier.** The sheet is a file your means wrote: every line carries how you know it (a plain look, she told you, Appraise rank 3, Divination), and deeper reads add or firm up lines in place | Makes provenance and uncertainty the subject; fits MN1 and AA9-AA15 directly; diegetic | Pure dossier prose is slower to scan than a stat block. |

### Default (CS5)

**Default: a wide sectioned sheet (CS2 laid out as a grid of section cards) with the dossier's
provenance (CS4) on every row.** At 1920×1080 the sections flow into three columns, so the met
person's whole known sheet fits one screen without clicks. Each row names its source only when it
differs from the section's usual one, with a "Mostly from" line under the section.

**Dial:** the renderer's `layout`. `wide` for the pinned inspector and the expanded You view;
`narrow` stacks sections as disclosures (read ones open) for a docked side panel or a person card.
A world or seat can also order sections (a system-window world leads with stats, a court world with
standing).

**Reason:** the sheet's job is the comparison "what do I know about this person, and how sure am I".
Tabs and a doll hide that comparison; a grid shows it at once, and provenance keeps a guess from
reading like a fact. CS3's figure joins later through compose slots (CS9), not as the frame.

### The projection (CS6)

| Code | Rule | Default, dial and reason |
|---|---|---|
| CS6a | **Rows exist only when read.** | Each row carries the appraisal level it needs (`reveal`, AP0-AP9); sections give defaults (appearance AP0, names AP1, relative AP2, numbers AP3, ability names AP4, detail AP5, hidden layers AP6, history and ties AP7, intent AP8). A row may override it (an open badge is AP0, a concealed knife AP4). |
| CS6b | **Bands snap to a grid.** | Precision 0-3 gives widths 10, 5, 2 and exact. A band is floored to its width (38 at width 5 reads "35 to 39"), so a band's midpoint never equals the truth. |
| CS6c | **The ceiling.** | A read whose rank is below the subject's falls to a relative sense (AP2: "far beyond you"). Dial: a means that reads past rank omits `rank`. |
| CS6d | **Schema and channel.** | A power outside the read's schema shows as `???` ("Something your read cannot name"), never by name or id; a row on a channel the read lacks does not appear at all. |
| CS6e | **Scope.** | A specialist read lists only its sections (a physician's eye reads body and conditions, and says nothing about level or name, header included). |
| CS6f | **Guess reads.** | Divination, rumour and similar mark every row they produce as guessed. |
| CS6g | **Merge.** | Several reads merge row by row: known beats guessed beats unknown; a narrower band beats a wider; a tie keeps the first read that showed it. |
| CS6h | **No counts.** | A core section with nothing read shows one line whose words never depend on the truth, so a stranger with ten powers reads the same as one with none (ABR19, AA13). |
| CS6i | **Self.** | You read yourself at AP5, exact on native stats, blind to hidden layers until a deeper self-read exists. Self is `subject.id === observer.actorId`, never a lead comparison (LTU11). |
| CS6j | **Learned facts.** | A row with a `knowKey` the observer knows is known with basis "You learned this"; a learned name identifies the person. |
| CS6k | **Between you** is the observer's own memory and always known. |

### Known, guessed, unknown (CS7)

Unknown and guessed rows carry a mark and a word (`?` unknown, `≈` guessed); known rows carry
neither. Guessed values are italic as a third, redundant channel. The same marks appear in the text
form (`[guessed]`, `[unknown]`). `figure.js` has no guessed state yet; the `≈` mark matches the
family-tree note so the coordinator can unify them.

### The playable slice (CS8)

- Gallery: the player's sheet beside Edda Marrow's (invented), with reads as toggles: Introduced,
  Fighter's sense, Appraise rank 1 (ceiling), Appraise rank 3, Physician's eye, Soul sight,
  Divination. Your own side toggles the Status window read.
- Real game: open People (top bar) after meeting the village elder; each card has a Character sheet
  disclosure read at "You have met". Route kind: fresh life, earned steps (talk to the elder), rebuilt
  bundle.

### Compose, do not redraw (CS9)

Sections may name a slot: `body-figure` (rep-body's diagram) and `ability-ladder` (rep-abilities'
ladder). The renderer calls `options.compose[slot](node, section)`; when no owner answers, the rows
are the text form and nothing is drawn here. No sibling file is imported.

### Round 1 checks

| Check | Result | Gaps |
|---|---|---|
| `node --test tests/character_sheet.test.js` | 7 pass | Fake DOM, not a browser |
| Focused set: character_sheet, build_output, people_knowledge, generated_people, desktop_snapshot, adopt_candidate | 32 pass | Full `npm test` stopped on the coordinator's instruction (machine load); coordinator runs it at merge |
| `npm run check:arch`, `npm run check:rules` | PASS (rules: 5 pre-existing warnings) | |
| `npm run build:figures` | Gallery closure stays off the game core | |
| `npm run build` then headless Chrome 1920×1080 via Playwright | In-game card shows the sheet; no page errors | One person (village elder) |
| Headless captures, gallery | Luminous, Neutral, 21 px, effects off, narrow | Reduced effects not captured separately |

## Round 2, 2026-10-30: the brief's twenty steps

Weibao's round 2 ask and additions are in
`docs/gm/dispatch/ui-refactor-wave-2026-10-29/ROUND2_BRIEF.md`. Reference-game claims below are from
general knowledge of those games, not replayed this session: read them as "stated or widely known",
not "shown".

### 1. How other games do it

| Game | What the player sees | Makes easy | Costs | Idea to adapt |
|---|---|---|---|---|
| Pathfinder CRPGs (Kingmaker, Wrath) | Bestiary entries whose lines unlock with a knowledge-skill check: name, then defences, then weaknesses | Clear link between a skill and more information | All-or-nothing per check; no "guessed" band | A read reveals sections by level (CS6a) |
| Shadow of Mordor / War (Nemesis) | Enemy captains with strengths and weaknesses shown as "?" until intel is gathered | Unknowns as visible slots make hunting intel a goal | Slot counts leak how much is hidden | Unknown as a first-class state, but without slot counts (CS6h) |
| Crusader Kings III | Character window: traits as icons, opinion breakdown on hover, secrets visible only when discovered | Dense, everything one hover away | Icon literacy; heavy hover dependence | A breakdown on demand (UR43), with words beside every icon |
| Disco Elysium | Your sheet as skills with personalities; others are read only through dialogue and checks | Self-knowledge as character | No inspector for others at all | "How you know" as voice: the provenance chip (CS4) |
| RimWorld | Pawn inspector with tabs (Needs, Health, Social, Bio); health by body part | Fast, systematic | Omniscient: you see every pawn's exact numbers | A tabbed narrow mode for docked panels; omniscience only as a cheat read (step 6) |
| Transmigration-novel status windows (genre) | Appraisal boxes with `???` fields and rank-locked readings | Reads that fail upward ("far beyond you") are dramatic | Often numbers-only | The ceiling (CS6c) and schema `???` (CS6d) |

Own references first: UR36 already separates unknown, unassessed and unavailable for opponents;
MEANS_AND_APPRAISAL supplies the ladder; the opponent `dl` grid in `styles/opponents.css` is the
nearest existing stat block (its global `dl` rules broke the first capture, see step 10).

### 2. Fresh-player test

Opened the real-game card and the gallery cold.

- **Found:** a stranger's sheet was six closed boxes saying "Not read". **Fixed:** unread sections
  fold into one line, "Not read yet: How they look, Stats, … A closer look or another means could
  tell more."
- **Found:** "Read by" reads as jargon. **Fixed:** "How you know:".
- **Found:** the source repeated on every row. **Fixed:** shown only where it differs, plus a
  "Mostly from" line.
- **Open:** "Level 22 to 23" means nothing without a scale. Account for now: the header should say
  "yours is 7" beside a band (UR75).
- Terms a fresh player meets: guessed, unknown, Appraise rank, ceiling. Each has words on screen; the
  ceiling still relies on the read's own label.

### 3. Space, split and density at 1920×1080

- **Split:** the sheet answers "who is this and what can they do"; "what happened between us" stays
  in the person card's history above it, and the sheet's Between-you section holds only the
  observer's facts. One view, one question.
- **Use the room:** wide layout fills three columns; a pinned person inspector beside the People list
  (list left, sheet right) is the next layout step, through the shared center controller (UR24).
- **Density by frequency:** glance = the person card's title line plus one level word; full sheet one
  click away in its disclosure; per-row descriptions small and muted.

### 4. Bars and small signals

The sheet should not grow bars for unknown quantities. Proposed chips, each answering one question:
**How sure** (a chip per read: plain, told, measured, guessed); **Stronger or weaker** (the AP2 word,
reused on combat targets so it reads the same, UR74). Relationship bars belong to rep-relationship-web;
the sheet links to them rather than drawing a second set.

### 5. Pop-outs and the Electron app

Earns a pop-out: comparing two sheets (you and a rival, or two candidates to hire) on a second screen.
The renderer already draws through the host node's document (MDL13). No notification or badge; a
newly firmed read is not urgent. Browser fallback: the same sheet in the center.

### 6. Cheats and insight views

A cheat or continuing-insight power is a read like any other, carrying `source: 'cheat'` (account for
now): its chip takes the cheat style from "Where cheats go", and it can exceed rank or schema by its
own mechanism (AD38). Sealed truths stay out unless the cheat's discovery route covers them. The
developer inspector stays separate: it is the existing `?skill_inspector=1` dev view, never a read.

### 7. Visual style

Default: Luminous card grid. Alternative in the gallery: the **narrow disclosure stack**
(`?layout=narrow`), which reads better in a docked panel and on the person card; the grid reads
better pinned at full width. Both work in Neutral, at 21 px (`?size=21`) and with effects off. A
paper-and-ink dossier skin through tokens is a later motif (step 20).

### 8. Use what we have

Reused: `observer_view.js` (self versus other, learned facts), `customization_profiles.js` themes,
the gallery page, `people_knowledge.js` rows, the existing People card. Not reused: `figure.js`, since
a sheet is rows not a figure; it joins through compose slots. New shape: the projected row
`{id, label, state, text, desc, basis}`. Its second consumer is the People adapter; a third would be
combat targets (UR36), which should move onto it.

### 9. One unconventional option

**The world reacts to being read.** An active appraisal is an action in the fiction (MN, "means can
be noticed"): a sensitive subject feels it, and the sheet gains a line on their side ("She noticed
you studying her"), which feeds the relationship owner. It takes a notice field on the read, one
consumer in the relationship owner and a Reports line. Worth a later slice once reads are real
actions with costs (CRL35).

### 10. Audit gaps

| Gap | State |
|---|---|
| Lead's run (LTU5 person view that remembers) | Partial: sheet in the card; memory wiring is the memory lane's |
| Other seats (LTU11) | Covered by test in two seats; thin lives get mostly unread sheets, which the fold keeps short |
| Empty and error states (UR32) | Unread fold; no error state needed (pure projection) |
| Persistence | None changed: reads are passed in, not saved. Storing past reads with time (AA9, CRL36) needs a namespaced slice and migration |
| Performance | One sheet ≈ 60-120 nodes; People cards re-render only on signature change |
| Accessibility | Marks are `aria-hidden` with a word beside; disclosures are native; focus ring from tokens; 21 px captured |
| Global CSS bleed | `component_themes.css` styles every `.theme-preview dl` as two columns; the sheet now sets its own `dl` display. Coordinator note: that rule is broad |
| Leak found by evidence | A scoped (physician) read banded the level in the header. Fixed, with a regression |

### 11. Prior implementations and abstraction

The abstraction underneath is a **projection ledger**: rows of (subject field, observer, means) →
(state, value, basis). Spreadsheets with permission-masked cells and medical charts with "reported by
patient / measured" provenance are the software analogues. The next feature that reuses it: item
appraisal (gear quality, curses) and opponent cards, by passing a different section list.

### 12. Open for improvement

Current best, open to replacement with a reason (AD45). Known limits: reads are passed in, not yet
actions with costs or a stored history; the player's own sheet in the game has no adapter yet;
sections are fixed in one list. Likely next refactor: section definitions become world data, and
the combat opponent card moves onto the projection.

### 13. Flourish and small interactions

Rows a new read firms up settle once with a short accent glow (`data-firmed`), never moving layout,
off under reduced and off effects (UR38, UR62). Later: particles from `src/particles.js` on a read
that breaks a ceiling, bound to the header.

### 14. Reports and the center

Reports line proposal (time and chronicle owns the panel look): subject first, glyph for the means,
one line per firmed read: "Edda Marrow · Appraise: magic now 38, three abilities named". Repeats
group by person. Center: the sheet is a reference surface, so it opens pinned beside its list, actions
(talk, appraise again) as buttons in the header, prose behind row descriptions.

### 15. Ability flourish

Using an inspect skill should feel like focusing: the read chip appears first, then rows resolve in
reading order. Same effect rules as step 13.

### 16. Fold into the existing UI

Folded: People you know cards (done). Proposed adjustments for the coordinator:

- **You panel expanded view** uses the same sheet: the status window (`src/status_window.js`) and the
  bio (`src/character_bio_ui.js`) become sections of your sheet rather than separate panels. Needs a
  read seam from the character object (one registration line in `main.js`, paid by moving one out,
  AR rules). Saved layouts keep the `status-window` panel id as an alias (UR17); a log line says
  "Your status window now lives in your character sheet" (UR13).
- **Opponent card** (UR36) moves onto the projection so a combat target and a met person read the
  same.

### 17. Later volumes and later worlds

Data-driven by design: sections, reveal levels, schemas and channels are fields, so a later volume
adds rows (higher sequences, new power kinds, foreign schemas from another world) without code.
Not checked this session: the reading outputs for later volumes (READING_STATUS, OTHER_BOOKS_READINESS);
the assumption is that higher ranks and new power kinds are covered by the rank and schema fields. Open: worlds whose appraisal reads colours or feelings rather than
numbers need an output mode per read (MEANS "By output"); the band text is the only output today.

### 18. Form that fits

A **grid of cards with rows** (a table with an inspector), because the subject is comparison of many
labelled values. A circle fits nothing here; a ladder belongs to abilities; a tree to lineage; the
body figure to rep-body; all join through slots.

### 19. Levels and depth

Abilities show name at AP4, level and tier at AP5, rules (description) at AP5, hidden ones at AP6.
Your own abilities show level, tier and what the skill does. Account for now: what the next level
changes and prerequisites come from rep-abilities' ladder in the `ability-ladder` slot; the sheet
shows depth of *knowledge* of an ability (named, measured, understood), the ladder shows depth of the
ability.

### 20. Semantic roles now, motifs later

Rows carry roles (`section`, `state`, `basis`) rather than looks, so a motif pack restyles them. Flair
sketch: in a gothic city world the sheet is a warden's dossier, inked lines, guessed lines in pencil
grey, a wax seal on hidden layers once read; in a status-window world it is a glowing system panel,
numbers ticking into place, `???` fields flickering.

### 21. Everything is a draft: what to restructure

Kept from round 1 because it holds up: the projection (truth, reads, rows) and its leak rules; the
card grid at full width. Restructure proposed rather than decorated:

- **Three panels become one sheet.** Today your own character is split across the top stat block,
  the Attributes inspector, the Status window panel and the bio (How you look, conditions, traits).
  Each answers part of "who am I". The proposal makes them sections of your sheet: the stat block
  stays as the glance (one line per stat, as now), the sheet is its one-click expansion, and the
  Status window becomes a read chip on that sheet rather than a separate panel.
- **Person views become one inspector.** People you know cards, the opponent card and any future
  "inspect" button open the same sheet at whatever read the observer holds.
- **The figure is optional, not the frame.** Body and ladder figures sit in slots; a world with no
  body figure loses nothing.

### Abilities ladder in the sheet (composition contract)

rep-abilities (branch `claude/rep-abilities-6f77c2`) offers `ladderGlance(pathView, {felt})` and
`ladderFigureSpec(pathView, {layout: 'compact', perspective: 'witness', seen, insight})`. Placement
here: the glance line becomes the first row of Abilities and powers (your own path, or another
person's at the read that saw their rungs), and the compact figure fills the `ability-ladder` slot.
For someone else, `perspective: 'witness'` with `seen` is the ladder's own projection, so the sheet
passes the rungs its reads have shown and never the truth. Wire at merge; not imported here.

### Reading from the dated character read model (WA50)

The coordinator asked that the sheet read from the sonnet wave's `src/character_sheets.js`
(`sheetAsOf(sheet, chapterRef, {openGates})`, schema in
`docs/gm/dispatch/sonnet-wave-2026-10-30/L8_CHARACTER_SHEET_SCHEMA.md`). At this commit that file is
an uncommitted draft in the primary checkout, not on master, so nothing here imports it. The two
layers fit: `sheetAsOf` answers "what is true of this person at this chapter"; this projection
answers "what does this observer see of it". Switch-over is one adapter, `subjectFromDatedSheet`,
beside `character_sheet_people.js`:

| `sheetAsOf` field | Sheet section and reveal |
|---|---|
| `identities.shown`, `affiliation.shown` | Standing, public (AP0) |
| `identities.actual`, `affiliation.actual` | Standing, AP4 |
| `power` (path, level, title) | Header level and Abilities glance (abilities ladder contract above) |
| `abilities` (rule ids, conditions, costs) | Abilities: name AP4, conditions and costs AP5; `gate` entries hidden layers AP6 |
| `stats` (axis, band) | Stats: the band is already a word, so AP2-AP3 show it as guessed; exact needs a numeric source |
| `condition` | Body and conditions |
| `held`, `money` | Gear; money only when shown or learned |
| `believed` with `by` | Guessed rows, only when `by` is this observer |

Gap for the coordinator: `sheetAsOf` returns `hidden`, a count of gated entries. That count must
never reach player UI (CS6h, ABR19); the adapter drops it.

### ACT NOW (done)

Unread fold; "How you know"; source shown only where it differs; player text size honoured;
scope leak fixed with a regression; in-game People card mount; firm-up flourish; narrow layout in the
gallery.

### ACCOUNT FOR NOW

| Item | Why now |
|---|---|
| Band beside your own value ("yours is 7") | UR75: a band needs a baseline |
| `source: 'cheat'` read style | Cheat reads arrive with rep-abilities' powers |
| People card repeats location, details and memories in the sheet's Between you (UR73) | Done 2026-10-30: the sheet owns them (Follow-up slice 4) |
| Shared `guessed` mark in `figure.js` | Coordinator; family tree and this doc use `≈` |
| Global `.theme-preview dl` rule | Breaks any new `dl` in a themed module |

### LATER / DELEGATE

| Item | Level, effort | Done check |
|---|---|---|
| You panel expanded view on the sheet (step 16) | Done 2026-10-30, see Follow-up slices | Fresh life: your sheet shows native stats exact, status window as a read after awakening, saved layout with the old panel id still opens it |
| Reads as actions with cost and stored history (AA9, CRL35-CRL36) | Sonnet medium, persistence slice with migration | Appraise once, save, reload, Import: the read and its time survive; a stale read says so |
| Opponent card on the projection (UR36) | Done 2026-10-30, see Follow-up slices | A combat target and the same person met read identical rows at the same means |
| Being-read notice (step 9) | Sonnet low after the above | A sensitive subject's relationship gains a line when appraised |
| Pinned person inspector beside the People list | Sonnet medium, center controller | 1920×1080: list left, sheet right, Esc returns to the list position |

## Follow-up slices, 2026-10-30

Desktop 1920×1080, Luminous Gothic. Evidence in `docs/representations/evidence/followups/`. Proposals (AD32).

### Slice 1: You expanded view opens on the sheet

`src/you_sheet.js` builds the self subject from what the status window already reads and mounts the sheet at
the top of the Character & preparation view (Attributes ›). Native stats read exact (CS6i). The status window
is a read scoped to Standing, added only after the system awakens, so system points and the quest appear then
and never before. The `status-window` panel id and its compact You-box panel are untouched, so a saved layout
with the old id still places it. `main.js` was not touched. A self sheet leaves out sections no owner has filled
instead of saying "not read yet" about you.

| AD43 line | State |
|---|---|
| Build identity | Rebuilt bundle served; fresh origin, page errors none |
| Natural route | Attributes › in You opens the view; sheet first |
| Shown description and cost | Rows and "How you know" chips; no cost (a read of yourself) |
| Consumer | `status_window.js` mounts it; `tests/you_sheet.test.js` (3 pass) |
| Persistence | Reload and Import show the identical sheet; sheet state is not saved, it derives from the save |
| Review | Agent-verified, not human-reviewed |

Known limits: the compact status panel still repeats stats and level in the You box (it is the alias target);
bio and abilities are not yet sections of the sheet.

### Slice 3: opponent card on the projection (UR36)

`src/opponent_sheet.js` turns a fight's facts into stat rows and reads them through `characterSheetView` at the
means the fight gives (`COMBAT_READ`: exact numbers, stats only, no names or powers). Both card sources
(`projectNativeOpponents`, `fromCombatOpponentsProjection` in `opponent_board.js`) now route their facts through it, so a combat
target and the same person met elsewhere read identical rows at the same means, and a rougher means bands both alike
and marks the card's values as estimates. A row owner's own wording for an exact value rides on the stat row as `exactText`
(`character_sheet.js`), so "5 dmg x2" and "31.623" read exactly as the fight shows them today. Facts without a leading
number, and facts the fight does not know, pass through as given.

| AD43 line | State |
|---|---|
| Build identity | Rebuilt bundle; Infested field fight at 1920×1080 from a fresh origin, no page errors |
| Natural route | Elder lines, travel to Infested field, Opponent panel (`opponent-card-1920.png`) |
| Shown description and cost | Card rows unchanged for the player: Atk 6 dmg, Spd 0.99 /s, Hit you 32%, Evade 18%, Defense 1 |
| Consumer | The Opponent panel and the Around-you fight card; `tests/opponent_sheet.test.js` (3 pass) beside the opponent_board, situation and sheet tests |
| Persistence | Not applicable: display only, no save field |
| Review | Agent-verified, not human-reviewed |

Gap: no way yet to hand the card a second read (an inspect skill used on the target), so only `COMBAT_READ` reaches it today;
`opponentFacts(facts, observer, reads)` takes the list when a lane supplies one.

### Slice 4: the sheet owns the person lines (UR73)

The People card (`src/people_ui.js`) no longer draws the last-known location, the details or accounts, or the
memories. They are the sheet's Between you rows (`character_sheet_people.js` already built them), drawn once. The card keeps
the name, the glance, the bond bar and the sheet link, now worded "Character sheet · where, what you know, what you remember"
and open by default, so the lines stay one look away. A test asserts the card carries no paragraph or list of its own and the
location appears once (`tests/people_card_sheet.test.js`); `tests/relationship_web.test.js` and `tests/people_knowledge.test.js` still pass.

| AD43 line | State |
|---|---|
| Build identity | Rebuilt bundle; fresh origin at 1920×1080, no page errors |
| Natural route | Elder greeting, People, expand the card (`people-card-sheet-1920.png`) |
| Shown description and cost | Where, what you know and what you remember read as before, under the sheet |
| Consumer | The People panel; relationship web and bond bar untouched |
| Persistence | Not applicable: display only |
| Review | Agent-verified, not human-reviewed |

Gap: the accounts caveat line ("current condition and private possessions are not assessed here") is gone with the card block;
each account row still names its basis. `scripts/people_browser.cjs` was tried and stops at its Talk click, which the
center overlay intercepts in the current shell (before it reaches any card), so it is not evidence for this slice.
