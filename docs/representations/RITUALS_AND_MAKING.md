# Rituals and making: representation (proposals)

**Next slice (2026-10-30):** Brew-ready desktop notification (item 5). Level and effort: Sonnet, small. Done when: the brew-ready transition raises one presence notification; the browser fallback logs one line.

Status: agent proposals, 2026-10-30, from the UI representation wave
([plan](../gm/dispatch/ui-refactor-wave-2026-10-29/PLAN.md); audit rows RPX1, RPX2, RPX3,
MDL2, MDL7, MDL8 in [UI design core audit](../audits/UI_DESIGN_CORE_AUDIT.md)). Nothing here is
accepted until Weibao says so (AD32). Proposed UI rules (UR76-UR82) are cited as proposed.
Making rules [MR1-MR36](../MAKING_RULES.md) bind.

## Reading (PRF1)

Draw a rite in progress and a brew in progress as figures in the place where the player
already prepares them, so the state of each condition, material and step reads at a glance,
with the same facts in words. Premises: desktop 1920×1080, the MDL2 figure primitive
(`src/ui/figure.js`) exists, the Tingen brewing bench already projects the rite grade and
brew timer, Weibao is the player.

## Options weighed

| Code | Representation | What it shows well | Cost or limit |
| --- | --- | --- | --- |
| O1 | **Ritual circle.** Rite conditions as slots on a ring that fill as each is met, a stand-in marked as strain, the stated odds at the centre. On a failed attempt the failing slot turns broken. | Which condition is missing, and that a rite is a laid-out place, not a checklist. | Labels crowd past about five slots; needs a failure record to show broken. |
| O2 | **Brewing track with a heat band.** Ordered steps on a line, the current step live, a heat band and "late adds heat" marker where the law reads heat. | Where a brew stands and what comes next. | A heat band is busywork where the world's law reads time alone (MR16, MR17). |
| O3 | **Gesture strokes.** A wand or hand movement as a stroke path of points, a timing pip, practice drift drawn as a second path. | Learning a spell as a shape. | No world has gesture data; strokes need a path element the primitive lacks. |
| O4 | **Odds ledger** (the unusual one). The stated odds split into what each condition costs, ranked, so the bar reads "fix this first". `gradeRitual` already returns each condition's loss share. | Decisions: which stand-in to replace for the biggest drop. | Not a picture of the rite; a second view beside one, not instead of it. |

## Default (proposal)

O1 and O2 in one spec, as RPX2 asks ("same spec as RPX1"): the circle holds the rite
conditions and the odds; below it, a materials track and a brew track; risk lines in words.
Materials sit on a track rather than inside the circle because they are a list to gather
and spend at the bench, not components laid in the circle; six names inside a ring collided
in the first capture.

- **Dial.** A world with timing law adds rings (hour, moon) to the circle, as in the Low Lamp
  fixture. A world whose law reads heat adds heat steps to the brew track. A rite with no
  conditions draws only tracks. A formula whose materials the notes do not name shows names
  without holdings and no brew track.
- **In-world reason.** A rite is physically laid out around the place where the potion is
  drunk, so a circle is what the character prepares; a brew is a sequence at a bench, so a
  line is what the character watches.
- **States.** met or held is filled (●), a stand-in is strained (!), absent is empty (○);
  brew steps are done (✓), current (▶) and pending (·). Broken (✕) is reserved for a graded
  attempt that failed; nothing is attempted yet, so it is not drawn (MR1: no result before
  the transition).
- **Effects** (MDL8, UR38). Default: glow on settled met conditions and pulse on a brew step
  that is running, because those are the states worth drawing the eye to. Both are CSS classes the effects setting turns off; effects off keeps
  every fact (checked: identical text form).
- **Truth.** The adapter reads the bench projection the panel already shows and nothing
  else, because a projection must not leak truth (MR31).

## Home (proposed UR76 contract)

- **Home:** the Tingen place-service panel, brewing bench disclosure
  (`#lotm_panel [data-lotm-bench]`, UR1 place service, UR42 disclosure), below the existing
  rite lines, for the picked formula.
- **Surface:** inline figure in that disclosure; no new panel, no new navigation.
- **Text form (UR37):** the bench's existing rite and material lines stay unchanged; the
  figure's SVG description and its notes carry the same facts.
- **Seat:** in-world, tagged `lotm.data-figure` in the perspective inventory.
- **Later homes:** the Polyjuice bench (`src/hp_brewing_panel.js`, its day-count simmer and
  lot preparation) and native crafting detail (`src/crafting_detail.js`, which has no rite
  or timeline, so a figure there waits for a reader).

## RPX3 gestures (deferred, CX8)

No world records gesture shapes; the Harry Potter slice names spells by words. Reopen when a
world row stores a gesture as ordered points with a timing window and a practice record, and
a command reads drift. Then the primitive needs a stroke element (an ordered node path with
edges already approximates one).

## Receipt, 2026-10-30

Branch `claude/rep-rituals-70a5e6`, built on master `99c927ec1`.

Files:
- New `src/ui/rite_figure.js`: adapter, bench detail to figure spec.
- `src/book_world_lotm_ui.js`: renders the figure in the bench (two imports, one line).
- `src/ui/figure.js`: primitive fix. Each track grows to its tallest wrapped label, so long
  names no longer run into the next track. Affects every figure with long step labels.
- `src/perspective_controls.js`: one row tagging `data-lotm-figure` in-world.
- `index.html`: links `styles/figure.css`, which the game did not load before.
- New `src/ui/preview/fixtures/rituals.js` and one import line in
  `src/ui/preview/figure_gallery.js`: two invented fixtures through the same adapter.
- New `tests/rite_figure.test.js`.
- Evidence: `docs/representations/evidence/rituals/` (browser script, result.json,
  screenshots).

Change surface (FND2): core-owner files touched are `figure.js`, `perspective_controls.js` and
`index.html`. `check:arch` reports no new cycle edges. `main.js` is not touched.

Checks:
- `node --test tests/rite_figure.test.js`: 5 pass (state words, tracks, inspect and
  main-route rows, glow only on met, gallery registration).
- `node --test tests/figure.test.js tests/perspective_controls.test.js tests/observer_view.test.js`:
  pass after tagging the new data family.
- `npm run build`, `npm run build:figures`: built; game bundle sha256 prefix
  `02810e8444d5a124`. `dist/` is not committed, so the coordinator's merge rebuilds it.
- `node docs/representations/evidence/rituals/browser.cjs`: headless Chrome, fresh origin,
  1920×1080. Fresh life, Village door, probationer, report in, docks, pick the Sequence 5
  formula with a rite: both conditions empty, odds 90 at the centre, brew track at Formula.
  Then buy ordinary ice from the starting purse and walk to the lodging: both conditions
  strained, odds 48. Effects off gives an identical text form. No page errors, no
  horizontal overflow, figure.css applied.
- Gallery at 1920×1080, effects full and off: both fixtures render in Luminous and Neutral,
  no page errors.
- `npm test` (load average above 100): 4106 pass, 9 fail. The failures are live cast-lives
  integrations ("live joins preserve ... Save, reload, Export and Import" and kin) whose worker
  process exits silently. With the private pack linked in, 4 of them still fail. One of them,
  run alone on untouched master `99c927ec1` with the pack linked, fails the same way, so it
  predates this branch; the other eight were not rerun on master.
- `npm run check:arch`: pass, no new cycle edges. `npm run check:rules`: pass (5 existing
  warnings). `npm run check:docs`: this doc clean.
- The substituted-state captures with effects full and off are byte-identical because that
  state draws no glow or pulse; the off capture proves nothing extra there.

AD43 floor:
- FLR1 build: met, bundle `02810e8444d5a124`.
- FLR2 route: fresh life, earned steps, no save edits, rebuilt browser. The MCP-first walk
  was not run because the game MCP serves the primary checkout, not this branch.
- FLR3 shown: met. Words beside the figure, odds as the visible cost.
- FLR4 used: met. The figure displays the grade the drinking hook consumes.
- FLR5 kept: not applicable, no persistence change.
- FLR6 labelled: agent-verified, not human-reviewed.

Verdict: implemented, below floor on the MCP-first part of FLR2 only.

Next slice: draw broken on a failed attempt once an ingestion command calls
`gradeRiteAtTransition` at the moment of drinking. Then add O4 (odds ledger) beside the
circle from the per-condition loss shares, and the Polyjuice bench as a second home.

## Round 2, 2026-10-30 (proposals)

From the [round 2 brief](../gm/dispatch/ui-refactor-wave-2026-10-29/ROUND2_BRIEF.md). Round 1 is a
draft; this round keeps the circle where it earns its place and restructures the rest.

### How other games do it

Claims are from general knowledge of these games, not fresh play; treat them as inferred.

| Game | What the player sees | Makes easy | Costs | Idea taken |
| --- | --- | --- | --- | --- |
| Cultist Simulator, Book of Hours | A verb card with empty slots; each slot names the aspect it wants; a ring timer runs once started | Knowing what fits before you have it | Hidden rules, much trial and error | A slot names the *principle* it wants, so a stand-in visibly fits or does not (our `principle.wants`). LATER: show it on hover. |
| Potion Craft | A map; each ingredient pushes a marker toward effects and away from danger | Seeing why a mix drifts | One big mechanic carries the whole game | Risk as distance from a danger edge. Taken in spirit: the risk ledger says which cause moves the risk most. |
| Noita | Wand slots in a row; order changes what fires | Order-dependent sequences read left to right | Opaque modifiers | Ordered things belong on a strip; unordered things do not. So brewing steps are a track and rite conditions are not. |
| Atelier (Ryza) | A synthesis grid of nodes; materials placed raise traits and quality | Seeing quality climb as you place | Grid density at depth | Quality bands as a visible outcome (item 19). LATER, once a world grades brewed quality. |
| Opus Magnum | A board where the machine runs visibly | Debugging a process by watching it | Puzzle game, heavy for an idle shell | Not taken now; the unconventional option below borrows "watch the setup". |

Abstractions underneath: a **slot board** (rite conditions), a **track** (materials, brew), and a
**ledger** (risk by cause). The ledger is new here; a second consumer (combat risk, travel
danger) would make it a shared shape (proposed UR79).

### What changed (ACT NOW, done)

- **Split** (items 3, 21). One figure answered two questions. Now the rite circle and its risk
  ledger share a row (`.fig-row`, side by side when the column is wide enough, stacked when
  not), and the making figure (materials, brew) sits below. The circle keeps a fixed 440 size
  instead of growing with the material count, and the risk mark sits below its centre so
  inward condition labels clear it.
- **Large text** (item 10). Fixed the shared figure primitive's 21 px label collisions; see
  gaps.
- **Glance first** (UR42). Both figures now come before the reference lines in the bench; the
  rite and material lines stay below as the full text form and keep the buy buttons.
- **Risk ledger** (option O4, item 19). Each condition's share of the added risk, largest
  first, with the words to act on: "Fix first: Holding one breath, about 67% of the added
  risk." A native `<meter>` per row, words beside it. The shared `meter_bar.js` did not fit:
  its states mean limits ("near the limit"), and a share of risk is not a limit.
- **Fresh-player wording** (item 2). "Drink now · 48% odds" became "48% risk", with "48% chance
  of losing control if drunk now" in the summary. "0 of 6 done" became "0 of 6 held" (a
  generic `progressWord` on figure tracks). "1440 min" became "24 h". Legend says "missing"
  instead of "still needed" for conditions.
- **Semantic roles** (item 20). Every mark carries a role (`condition`, `risk`, `material`,
  `step`, `circle`, `gather`, `sequence`) that a motif pack can key on. The primitive ignores
  it today.
- **Alternative form** (item 18). A strip version of the rite sits in the gallery beside the
  circle. The circle stays the default: conditions are unordered, and a strip implies an order
  that is not there. This is a different form, not a different visual style; item 7 is LATER.
- **Ledger tokens.** The native meters are styled from theme tokens (accent, warning, danger),
  with low, high and optimum set so a larger share of risk reads as worse.
- **Effects proof.** `evidence/rituals/gallery.cjs` asserts the glow on met conditions and the
  pulse on a running brew are present with effects full and gone with effects off, with an
  identical text form. No reachable game state has a met condition or a running brew yet.

### Forms chosen (item 18)

| Part | Form | Why not the others |
| --- | --- | --- |
| Rite conditions | Circle of slots | They are placed around one act and unordered; a strip implies order, a table hides "laid out". |
| Risk by cause | Ledger with bars | It is a ranking; a ring segment of equal size cannot show shares. |
| Materials | Track (count held) | A shopping list; a grid adds nothing at two to six items. |
| Brew | Track (ordered steps) | Strictly ordered; this bench reads time and nothing else, so no heat band (MR17). |
| Grade | Words plus a state mark | One value; a chip in the formula picker is LATER. |

### Density at 1920×1080

The Tingen panel is the known worst case (round 8 UIW6, owned by the Worlds and crossings
session). Here: glance row (circle, ledger) first, making tracks second, reference prose last.
Larger moves (bench as its own center tab, prose behind a disclosure) are for that session;
old browser scripts read the rite lines' text, so they stay visible for now.

### Account for now

- **Flourish** (item 13). Glow on met conditions and pulse on a running brew exist. Particles
  (`src/particles.js`) are a background effect and do not fit a subject-bound event.
- **Reports** (item 14). Proposed line when a grade changes: "Rite of X: now met with
  stand-ins, 48% risk" with the circle glyph, grouped per formula. Owner: Time and chronicle.
- **Pop-out and Electron** (item 5). No pop-out: a rite is prepared at the bench.
- **Cheat or insight view** (item 6). An insight view would list stand-ins the character does
  not hold with their fit to the principle, marked as insight-sourced, never the sealed truth of
  a rite.

### LATER / DELEGATE

| Item | Level | Effort | Done when |
| --- | --- | --- | --- |
| Brew-ready desktop notification (item 5) | Sonnet | Small | The brew-ready transition raises one presence notification; the browser fallback logs one line. |
| Settle flourish when a condition becomes met (item 13) | Sonnet, after the coordinator adds a non-looping effect to the primitive | Small | One short settle on the changed slot, none on reload, none with effects off or reduced. |
| Principle on hover (Cultist Simulator idea) | Sonnet | Small | Hovering or focusing a condition slot shows its principle and wanted traits; the text form already has them. |
| Insight view of unheld stand-ins (item 6) | Opus design, Sonnet build, with the cheat surface work | Medium | Rows marked insight-sourced; a test proves no sealed field is read. |
| Reports line on grade change (item 14) | Sonnet, with Time and chronicle | Small | One grouped line per formula per change, linking to the bench. |
| Alternative visual style (item 7) | Sonnet | Small | A token-override fixture (paper and ink) beside the default in the gallery, Luminous and Neutral, 14 and 21 px, effects off. |
| Failure state: broken slot on a failed attempt | Sonnet, after ingestion calls `gradeRiteAtTransition` | Small | A failed attempt marks its failing condition broken in the figure and the ledger. |
| Quality bands (item 19) | Opus design | Medium | A world that grades brewed quality shows the band on the Bottle step and in the product line. |
| Timing rings and many-condition rites (item 17) | Sonnet | Medium | A condition with a time window draws an hour or moon ring; more than six conditions switch to two rings or the grouped strip. |
| Laid-out room (item 9) | Opus design | Large | A free-placement layout in the primitive and placement data for one rite, with a text form. |
- **Later volumes** (item 17). Data-driven: conditions, materials and steps come from rows. Gaps:
  later rites with many conditions (more than about six crowd a ring: switch to two rings or the
  strip with grouping), mass rites with participants (a second ring of people), and timing laws
  (hour and moon rings from the Low Lamp fixture once a condition carries a window, not a
  boolean). Checked against the rite scales in the formula rows (solitary, creature, mass); no
  private reading notes opened.

### Unconventional option (item 9)

**The laid-out room.** Draw the rite as the space the character actually prepares, seen from
above: the ice, the canvas over the window, the candle, where the body lies. Missing pieces are
outlines where they would go. It shows *why* a stand-in is weaker (light leaking past a shutter)
better than a slot can. Cost: a free-placement layout in the primitive and per-rite placement
data. Worth a later slice after the failure state lands.

### Flair in two worlds (item 20)

In the foggy industrial world: a chalk circle on floorboards, condition slots as brass sockets,
risk as a pressure gauge needle, wax drips on met slots. In the wizarding school: a parchment
recipe card, steps as numbered quill lines, the cauldron's bubbles as the brew's pulse, risk as
a smudge spreading across the card. Both restyle by role without touching the adapter.

### Gaps left (item 10)

- Other seats: the bench belongs to the lead; cast making rows have no figure.
- Empty and error states: a formula with no rite and no named materials draws nothing, and
  the reference lines explain why. Checked in tests.
- 21 px text: the first capture showed every label colliding, in both figures. The cause was
  in the shared primitive (SVG text grew in CSS pixels while the drawing kept its geometry), so
  every figure in every session had it. Fixed in `figure.js`/`figure.css`: text is drawn at the
  12 px design base in the drawing's own units and the drawing is sized in em of the small type
  token, so larger text scales labels and spacing together. Recapture at 21 px: zero label
  overlaps in either figure, no horizontal overflow. Trade-off: a figure still shrinks to fit
  its column. At 21 px the rite circle (fits) grew about 1.31×, measured from the captures,
  while the making figure hit the roughly 700 px column and its labels grew about 1.13×
  (estimated from widths), so large text reaches clamped figures only partly. Before the fix
  labels grew fully and collided. The alternative is to let a clamped figure scroll inside its
  own box (`overflow-x: auto` on the host, no `max-width`), which keeps full text size at the
  cost of horizontal scrolling in narrow panels; that changes every sibling's figures, so it
  is the coordinator's call.
- Effects off, set through Settings and Apply and save: the figures' text form is identical to
  effects full.
- A brewing state is not reachable from the starting purse: the cheapest formula costs 1200
  pence and its main material 522, both refused with "Insufficient money." The brew track's
  running state is proven in tests and the gallery fixture, not in the game. No save was funded.
- At 1920×1080 the Tingen panel's center column is about 700 px, so the circle and its ledger
  wrap into a stack rather than sitting side by side. Side by side needs the wider center view
  the Worlds and crossings session is proposing.
- Performance: each bench render rebuilds two small SVGs when the signature changes (once a
  game minute while brewing). Not measured.

### Open for improvement (item 12)

All of this is the current best (AD45). Known limits: equal condition weights assumed in the
ledger; no failure state; the circle's size is fixed; materials have no source shown. Likely
next refactor: when ingestion calls `gradeRiteAtTransition`, the adapter gains the failed
condition and draws it broken, and the ledger becomes a shared shape if a second feature uses it.

### Data owners (coordinator note, 2026-10-30)

The sonnet wave's sw-rites lane owns rite, summons, divination and formula rows. This adapter
models none of them: it reads the bench projection the LOTM host already builds from
`src/book_world_lotm_ritual.js` (graded rites) and `src/lotm_formula_rows.js` (formulas), so row
changes there reach the figure with no adapter change. Divination queries
(`src/lotm_divination_rows.js`, on master at `00ab553e1`, not on this branch's base) and summons
rows are separate families with ordered steps and no graded conditions; they would draw as a
track from their own host projection once a panel shows them. Not built here.

### Round 2 receipt

Files: `src/ui/rite_figure.js` (split into `riteCircleSpec`, `makingSpec`, `riskLedger`),
`src/book_world_lotm_ui.js` (glance row first, ledger with native meters),
`src/ui/figure.js` and `styles/figure.css` (text scaling, `progressWord`, `.fig-row`,
`.fig-ledger`), `src/perspective_controls.js` (ledger tag), `src/ui/preview/fixtures/rituals.js`
(five fixtures with the strip alternative), `tests/rite_figure.test.js`,
`docs/representations/evidence/rituals/` (browser script extended by a Sonnet subagent: ledger
assertions, 21 px overlap scan, effects off through Settings, brewing attempt).

Checks: `node --test tests/rite_figure.test.js tests/figure.test.js tests/perspective_controls.test.js`
pass; `npm run check:arch` no new cycle edges; `npm run check:docs` clean for this doc; the
browser journey and gallery capture are in the evidence folder with the bundle hash in
`result.json`. Full `npm test` was not rerun this round (the machine's load average stayed above
80 and the round 1 run's failures were live cast-lives integrations unrelated to these files).

AD43 floor: unchanged from round 1. Implemented, below floor on FLR2's MCP-first walk only;
agent-verified, not human-reviewed.
