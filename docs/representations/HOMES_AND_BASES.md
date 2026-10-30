# Homes and base building: representation (proposals, 2026-10-30)

Everything here is a proposal (AD32) and a draft (round 2 brief item 21); every choice is the current best and open to refactor or replacement with a reason (AD45). Rules applied: UR2 and UR77 (no new route without an existing home), UR8 (own panel node), UR6 and UR65 (tokens), UR37 (words beside marks), UR42 (density by frequency), UR80 (lenses narrow what the player knows), UR81 (stops explain themselves), UIV4 (preview matches commit), AD6-AD8 (truth, knowledge, display), CLR3 (no canon names in tracked code). Target: desktop 1920×1080 at 14 and 21 px text, Luminous Gothic. Mobile deferred. Branch: primary checkout (shared).

## What a player needs to read and do

| Question | Needs | Today (SHOWN, from `src/home_panel.js`) | This slice |
| --- | --- | --- | --- |
| Where do I live, and can I use it? | name, tenure, title, here or away, usable for this body | a select and one prose paragraph | one glance line (`data-home-glance`) |
| What is in it? (rooms, fittings) | what stands in each place, what is missing | a long list of "slot: name. description" lines inside a closed disclosure | a room strip: one pip per place, with the fitted names |
| Is it holding up? (upkeep) | structure, dampness, lodging time left | prose plus a rent meter | meters with words: "18 of 100 · unfit to sleep in" |
| Do I have room? (storage) | used of capacity | a heading count in a closed disclosure | a meter in the same block |
| Who is here? (household) | lodger, rota workers, companion | inside separate disclosures | one list, or "Nobody else lives or works here." |
| What is being built or mended? (construction) | kind, work done of needed | inside "Shelter work and moving" | a meter per project, plus sites elsewhere |
| What does rain do? (weather) | raining now, how exposed this home is | a sentence inside "Shelter, weather and repairs" | one line from the owner's exposure table |
| What should I do next? | the one to three things worth doing | nowhere | up to three chips (repair, renew, fit a bed, travel) |

Doing stays in Homes: every quote, commit, rename, rent renewal and furnishing move. The overview acts on nothing and ends with "Open Homes to change anything" (UIV4: one source for every cost).

## The existing home it folds into

Reads `projectHomes()` unchanged (`src/home_domain.js`), the same projection the Homes panel reads, plus the observer (`observerView`, UR80). Numbers come from the owners: `conditionOf`, `homeCapacity`, `homeComfort`, `homeUsable`, `projectProgress`; roof exposure is now the exported `HOME_EXPOSURE` in `src/home_building_model.js` (the table `advanceHomeCondition` already used). No state, no engine rule, no persistence change.

Placement: the panel is a record-role sibling of Homes (`home-overview`, ST6 reference dock, `after: 'homes'`). It is a new panel but no new route (UR2, UR77): it appears with the first known home and has no hotkey or navigation entry. **Proposed fold (not done):** when Weibao settles it, the overview replaces the Homes panel's `intro` and `summary` lines at the top of Homes and the separate panel is retired, which keeps the panel count flat (UR77). Saved layouts that pinned `home-overview` would fall back to Homes (UR17). Held back because it edits `home_panel.js`, which other lanes also touch.

Code: `src/home_overview_model.js` (pure `homeOverviewModel`, `homeFigureSpec`), `src/ui/home_view.js` (DOM from the node's own document, MDL13), `src/home_overview_panel.js` (`definePanel`), `styles/home_view.css` (tokens only), fixtures `src/ui/preview/fixtures/homes.js`, tests `tests/home_view.test.js`.

## HB1: the form that fits (item 18)

| Part | Chosen form | Why not a circle |
| --- | --- | --- |
| Rooms and fittings | Horizontal track of pips (the shared figure `tracks`): fitted, empty, strained, broken | A home is a short list of places that are each present or missing. A ring implies a cycle; a track reads left to right as "what stands here" |
| Upkeep, lodging, storage, construction | Labelled meters, words beside each | One question each (UR61): how worn, how long, how full, how far along |
| Weather | One line | A forecast is not owned here; the line says what rain does to this home |
| A real floor plan | The existing grid in the Room plan panel (`home-layout`, manor only) | Spatial placement already exists where it matters (warmth, smoke, bed cell). A plan for every home needs geometry the engine does not hold |
| Many homes | A switcher row of buttons | A map belongs to the Maps session; homes are few |

## HB2: levels and depth (item 19)

Default, dial and reason, per world: **comfort** is the engine's score and label (Unfurnished, Simple shelter, Settled, Lived-in); the glance shows the label, and each fitting's own benefit stays in Homes (UR71). **Structure** bands (sound 80+, worn 50+, failing above 20, unfit to sleep in) are a dial; 20 is the engine's real rest cutoff (`homeSupportsRest`). Later depth: a tier per room (a hearth that is plain, fitted, then a kitchen), what the next tier needs, and tenure rights as a ladder (shared, rented, owned, with what each allows). Deferred until a second consumer needs tiers (UR79).

## HB3: later volumes and other worlds (item 17)

Nothing here names a world. A world declares: its fitting slots and room names (data in `home_content.js`), its exposure table (`HOME_EXPOSURE`), its capacity and comfort rules, and which household rows exist. The strip degrades by data: a form with no hearth shows no hearth row (checked: the bird home shows Sleep and Storage only). Later volumes add rows over existing verbs: an estate with a warehouse, a school circuit or a brood chamber, a sect hall or safehouse for another world, a ship or caravan as a portable home (the tent already packs and travels). World-mechanism rows are gated by a capability (the field chamber, audience `world-mechanism`), so a seat that is not told the mechanism does not see it. Not read this session: the private reading notes (canon detail stays private).

## Round 2 (brief items 1-21, condensed)

### 1. Other games (known = from play or docs; inferred = my reading, unchecked this session)

| Game | What the player sees | Idea to adapt |
| --- | --- | --- |
| RimWorld (known) | Room stats window: impressiveness, cleanliness, beauty, with a breakdown | A short readout per home with plain reasons, not a score alone: our comfort label plus the fitted names |
| Dwarf Fortress (known) | Room and zone designations, upkeep through use | Rooms are defined by what stands in them; our strip is built from fittings, not a separate room list |
| Stardew Valley (known) | Farmhouse upgrades as a short ladder with a stated cost | Rooms as a ladder (restore, study, guest, cat room) with state; costs stay in Homes |
| Valheim (known) | Shelter, wet and rest bonus, the roof matters | Rain wears open shelters; a "too worn to rest in" state in words (done) |
| The Sims (known) | Room score and needs bars | Meters with words, one question each (done) |
| Kenshi (inferred) | Buildings take time and materials, with progress | A meter per project with real work done (done) |

### 2. Fresh-player test

Before: open Homes and read a select, a paragraph of rights, then a stack of closed disclosures; nothing said whether the home was in good shape or what to do. Now: five seconds reads "owned · Lived-in · You are here", a strip of ticks and empty circles, three meters, a dry line. Terms still needing knowing: "tenure" (shown as owned, rented or shared with title), "dampness 0 of 100", "units" of storage. Not fixed: the unit has no object ("units of what"): the Homes panel owns that wording.

### 3. Space, split and density (UR42)

Glance density: the name line, next chips and the strip. One click: Homes, for every action. At 1920×1080 and 14 px the whole overview fits in the center column (the hand-off button at about y=650 to 850); at 21 px the Household section and button sit near the fold, so they scroll inside the panel. Merge, not split: the overview is the top of Homes once the fold is accepted.

### 4. Bars and small signals

Each meter answers one question and carries words (UR37): Structure (how worn), Dampness (how wet), Prepaid lodging (how long), Storage (how full), project meters (how far along). Same marks as the figure states, so a "!" or "✕" means the same everywhere (UR74).

### 5. Pop-outs and Electron

A home overview earns a pop-out on a second screen beside Reports (rain wearing a nest while you hunt). The renderer already draws with `node.ownerDocument`; the panel module still uses the global `document` for its own node. A notification when lodging runs out or a roof fails would use the presence hooks, not built. Browser fallback unchanged.

### 6. Cheats and insight views

A revealed view adds the true condition of homes that are out of sight (a nest you left in rain), the hidden rate behind "slowly wears", and household members' real needs, marked "revealed by cheat". It is a second projection of the same truth (AD6), never a change to the outcome. The field chamber row already uses the capability lens as the pattern. Sealed secrets stay in their discovery route: the overview shows only fittings, upkeep and household the observer can see.

### 7. Visual style

The default is the Luminous Gothic strip with token colors. A second style, "survey sheet" (paper, ruled lines, ink stamps for fitted and a pencilled bar for wear), reads better for upkeep because it suits lists of conditions; it is a token set (UR6), not built this round.

### 8. Use what we have

Reused: `projectHomes`, the figure track, `observerView` and the capability registry, `definePanel`, the Homes quotes (the hand-off). New shape: none. The strip is the shared figure and the meters are `<meter>` rows as in the body view; the meter row is the second consumer to lift into a shared helper (UR79: body view and this view both draw label, meter, words).

### 9. Unconventional option

"The house shows its age": a settled-subject effect (UR38) where the strip's pips dim as structure wears, a rain sheen when it rains, and the household line fills in when a companion curls up at the hearth. Needs per-fitting wear and a rain flag (the flag exists: `raining`). Worth a later slice once repairs have a visible history.

### 10. Audit gaps

- Lead's run: a book life that starts in a family manor sees the field chamber only if the seat is told (tested); the manor's room plan is separate and is not summarized here.
- Other seats and thin lives: legacy homes (Shack, Visitor cottage) have no tracked condition, so the view says so rather than showing 100.
- Empty and error states: no home, home elsewhere, and a failing structure each have words (tested).
- Persistence: none. Performance: about 80 DOM nodes per render (figure plus rows); re-renders only when the model changes (signature check).
- Accessibility: meters have `aria-label` with the words; focus is not stolen on refresh because the panel keeps no focus state of its own. 21 px checked in the evidence run.
- Known limit: weather is "raining now", not a forecast; the engine reads the native calendar at the moment only.

### 11-12. Prior implementations and open for improvement

The Homes panel stays the owner of every action. Known limits: the overview and Homes both show some of the same numbers; the fold (above) removes that. Storage "units" need an object noun. The strip's label wrap is cramped for long fitted names at 14 px (labels wrap in four to six lines).

### 13-16. Flourish, Reports, ability and fold

Flourish: a short glow on a pip when a fitting is installed, under the settled-subject rules and off with effects off. Reports lines proposed (Time and chronicle owns the shell): `Home: Willow House, structure 92 of 100 after rain`, `Home: lodging at Riverside runs out in 6 hours` (UR81 stop explained). Ability flourish: not applicable. Fold: see above.

### 17-21. Later volumes, forms, depth, flair, draft status

See HB1-HB3. Flair roles named in the data: `fitted`, `strained`, `broken` and the capability audience; a motif pack (thatch, timber, stone, a sect hall) restyles pips and meters through tokens without touching the adapter. Everything here is a draft; if homes become a place you move through (a floor plan per home), the strip and meters stay as the glance above it.

## Disposition

**ACT NOW (done):**

| Item | Done check |
| --- | --- |
| Pure model `homeOverviewModel` and figure adapter; the room strip, upkeep meters, storage, weather, household, construction and next steps | `tests/home_view.test.js` (7 tests) |
| `definePanel` panel `home-overview`, layout spec entry, tokens-only stylesheet in the manifest | `tests/ui_contract.test.js` token test, `tests/stylesheet_manifest.test.js` |
| Gallery fixtures (cottage, worn nest in rain, rental plus a site, manor read by two seats) | `tests/representation_contract.test.js` |
| 1920×1080 evidence at 14 and 21 px from a fresh origin, hand-off opens Homes | `scripts/playtest/home-view.mjs`, `docs/representations/evidence/homes/` |

**ACCOUNT FOR NOW:**
- Fold the overview into the top of Homes and retire the separate panel (UR77), with the pin compatibility line (UR17). Needs `home_panel.js`, which others edit.
- Give "units" of storage an object noun in the Homes panel and here.
- The surface test fails on `management` lacking its route representation; that is another lane's entry, not this slice.

**LATER / DELEGATE:**

| Item | Level | Effort | Done check | Reopen trigger |
| --- | --- | --- | --- | --- |
| Lift the label, meter, words row into a shared helper with the body view | Sonnet | small | Both views render through it; their tests unchanged | A third consumer |
| Per-room tiers and "what the next tier needs" | Opus design, Sonnet build | medium | Test compares the line to the owner's cost table | A world with tiered rooms |
| Pop-out and presence (lodging or roof failing) | Sonnet | medium | Renders in a second document in a test | Weibao asks for second-screen use |
| Reports lines for home wear and lodging (UR81) | Sonnet | small | One subject-first line per settled event, no duplicates on reload | Time and chronicle accepts the line kinds |
| House-shows-its-age effect | Opus | large | Effects off removes it, facts unchanged | Per-fitting wear data exists |
| Survey-sheet style token set | Sonnet | small | Gallery shows both, text form identical | Weibao asks for a second style |
| A floor plan for homes beyond the manor | Opus | large | Placement test per grid | The engine holds geometry for more homes |
| Cheat reveal of out-of-sight homes | Sonnet | medium | Labelled projection, outcome unchanged (AD6) | Cheats panel consumer exists |

## Verification record

| Check | Result |
| --- | --- |
| `node --test tests/home_view.test.js tests/representation_contract.test.js tests/stylesheet_manifest.test.js` | 19 passing |
| `tests/ui_contract.test.js` | token test passes; the panel-surface test fails on `management` (another lane's entry, present before this change) |
| Browser, `scripts/playtest/home-view.mjs`, fresh origin, 1920×1080, 14 and 21 px, cottage and bird starts | PASS, hand-off opens Homes, no page errors |
| Review state | agent-verified, not human-reviewed |
