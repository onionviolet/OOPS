# Rituals and making: representation (proposals)

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
  process exits silently. With the private pack linked in, 4 of them still fail. A comparison
  run on untouched master was still running at commit; treat as unresolved, not as cleared.
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
