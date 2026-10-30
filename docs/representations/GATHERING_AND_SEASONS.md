# Gathering, nature and seasons: representation (proposals, 2026-10-30)

**Next slice:** put the gather-site table at the top of Village experiments and retire the separate panel (UR77), then add the season band to the first source that carries a season map (the world clock already knows the season; the village verge does not use it yet).

Everything here is a proposal (AD32) and a draft (round 2 brief item 21); every choice is the current best and open to refactor or replacement with a reason (AD45). Rules applied: UR2 and UR77 (no new route), UR8 (own panel node), UR6 and UR65 (tokens), UR37 (words beside marks), UR42 (density by frequency), UR80 (the observer narrows what is shown), UR63 and UR71 (no invented facts), UIV4 (preview matches commit), AD6-AD8 (truth, knowledge, display), AD46 (each world picks its own form), CLR3 (no canon names in tracked code). Target: desktop 1920×1080 at 14 and 21 px text, Luminous Gothic. Mobile deferred. Branch: primary checkout (shared).

## What a player needs to read and do

| Question | Needs | Today | This slice |
| --- | --- | --- | --- |
| What can I gather here? | the sites at this place and what each gives | one "Gather from the Village verge" button | a site table, one row per source |
| Is it worth going now? | open now, or the first thing it is waiting on | the button greys with a reason | a "Right now" cell: Open now, Waiting: only in spring, Depleted: full in about 2 days |
| How much is left? | stock of capacity, and regrowth | nowhere (the node is saved, never shown) | a stock bar with words ("11 of 12 left; regrows 12 a day, full in about 2 hours") |
| What is in season, and where? | the world's season now, and which yields open in which season | nowhere | a season band with a lane per season-gated yield, drawn only when the world has seasons |
| How fresh is it? | time left before a carried thing spoils | the hearth shelf shows it for three cooked foods only | bar rows, only for things that have a shelf life |
| Yield and risk | what a gather brings, how often, what gates it | prose in the Village trial text | chips per site: name, quantity, often/sometimes/seldom, gate words ("needs sickle", "only 4:00 to 8:00") |
| How does weather change it? | what rain or cold does to the site | nothing | one line, supplied by the adapter; the village verge says weather does not change it |
| What do I do? | one place to act | the Gather button in Village experiments | unchanged; the glance ends with "Open the workshop to gather" |

Doing stays in Village experiments: the one quote (`quoteCrafting({type:'harvest'})`) decides eligibility and cost. The glance takes its "can gather now" line and its blocker reason from that same quote (UIV4).

## The existing home it folds into

Reads the existing craft source owner and odds lens unchanged: `forecastHarvest`, `nodeAt` and `nodeKey` in `src/craft_sources.js`, the saved node owner `craftingOwner.sources.nodes`, and the world clock the crafting reader already holds. `forecastHarvest` takes no draw (GR9), so previewing never changes what a gather gives. No state, no engine rule, no persistence change.

Placement: a record-role panel `gathering` (ST6 reference dock, `after: 'herbal-experiments'`), eligible only where a source can be gathered. It is a new panel but no new route (UR2, UR77): no hotkey, no navigation entry; it appears in "Other known panels" only at the Village. **Proposed fold (not done):** the table replaces the lone Gather button's surroundings at the top of Village experiments, the panel is retired, and a saved layout that pinned `gathering` falls back to Village experiments (UR17). Held back because `crafting_home.js` is a dense file other lanes edit. A second candidate is a tab of the place view (as Today did); the first is closer to the action.

Code: `src/gathering_read.js` (pure `readGatherSites`), `src/gathering_model.js` (pure `gatheringModel`, `gatheringFigureSpec`), `src/ui/gathering_view.js` (DOM from the node's own document, MDL13), `src/gathering_panel.js` (the village adapter and `definePanel`), `styles/gathering_view.css` (tokens only, in `styles/manifest.txt`), fixtures `src/ui/preview/fixtures/gathering.js`, tests `tests/gathering_view.test.js`. Wiring: one panel entry and two render calls in `src/crafting_domain.js`, a row each in `panel_directory.js` and `layout_spec.js`.

## What is live and what is fixture (UR63)

| Case | Live now | Shown as |
| --- | --- | --- |
| Site table, stock bar, regrowth words, can-gather reason | Yes, the Village verge (`village-herbs`) | the panel |
| Yield names, quantity, often/sometimes/seldom | Yes, after the first gather there | the panel |
| Season band, season-gated yields, hour and tool gates | No. The engine supports them (`calendar.seasonTags`, `season`, `hours`, `tool`) but the village verge declares none; the richer table is used only in tests | gallery fixtures with invented names |
| Exact odds, rare-find odds | Engine supports them; no cheat consumer exists yet | gallery, marked "revealed by cheat" |
| Freshness | Only the hearth shelf has a shelf life (three cooked foods); gathered herbs do not spoil | gallery |
| Weather | No weather gate exists in the source engine | one honest line; a world with a gate supplies it as data |

## GS1: the form that fits (item 18)

| Part | Chosen form | Why not a circle |
| --- | --- | --- |
| Sites | A table with a stock bar column (figure `tables`) | Sites are a list compared on stock, yield and what blocks them; a ring implies a cycle |
| Seasons | A band along the year, now marked, one lane per season-gated yield (figure `bands`) | A year is a line of named parts with a current one. A season wheel suits a calendar that loops visibly; the band also shows which yield opens when |
| What each site gives | Chips with state, quantity, odds word and gates (figure `chips`) | A yield is a small tag with a reason, not a node |
| Exact odds, freshness | Bar rows with words (figure `bars`) | One question each (UR61): how likely, how long left |
| Where sites are | Not drawn. A map belongs to Maps and travel | Sites at one place need no geometry |

## GS2: levels and depth (item 19)

Default, dial and reason, per world. **Stock** is the owner's own number against capacity. **Odds words** are bands (often at 50 percent or more, sometimes at 20, seldom above 0; `oddsWord`), a dial a world can tune; exact numbers are an insight view. **Quality bands** (the 0 to 100 grade, tool and skill gates) are not shown yet: the village verge grades flat and the lens does not forecast quality. Later depth: skill-gated yields as a ladder ("needs skill 2"), tool tiers, and a site that wears down under heavy use.

## GS3: knowledge lens (AD6-AD8, UR80)

The player sees a site's yields only after gathering there (reason: what a patch holds is a discovery; the lens never names a regional variant before it is held, it names the yield by its own id). Before that the row says "not gathered here yet, so unknown". Rare-find odds are mechanism knowledge behind capability `gather.rare_finds` (audience `world-mechanism`, the same lens the home field chamber uses), so a seat that is not told never sees that row. A world with a field guide or a teacher can supply the names early as data.

## GS4: later volumes and other worlds (item 17)

Nothing in shared code names a world, a place, a material or a season. The adapter (`gathering_panel.js`) names the one source it wires. A world declares: its source table (kind, capacity, regrowth, yields, gates), a season map on the source (`calendar.seasonTags`) and the season list in the view, its day length (the source calendar's units), and any weather line. A world without seasons passes no season and the band is not drawn, with no "no seasons" text (tested). Later volumes add rows: a herb garden or a spirit field as a site with a long regrowth, a fishing ground as a kind, a hunting range, a tapped tree or a salvage heap (the kinds already exist), seasons of different lengths, a world where weather decides yield, a world whose gathering is a rite. A world that gathers by other means (a nest, a hive, a Gu) shows its own sites through the same table. Not read this session: the private reading notes (canon detail stays private); no later-volume claim here rests on them.

## Round 2 (brief items 1-21, condensed)

### 1. Other games (known = from play or docs; inferred = unchecked this session)

| Game | What the player sees | Idea to adapt |
| --- | --- | --- |
| Stardew Valley (known) | A season calendar, crops and forage marked by season | The band: which yield opens in which season, now marked |
| Valheim (known) | A forage that regrows and is spent by the player; time-of-day gates some finds | Stock and regrowth words; hour gates as chips |
| Animal Crossing (known) | What is out now, by month and hour | "Open now" first, the reason second |
| RimWorld (known) | Growing season and fertility per zone with a plain readout | A plain readout of why a site is waiting |
| Don't Starve (known) | Seasons change what grows and what is dangerous | Weather and season as one line each, not a model |
| Dwarf Fortress (known) | Gather zones and seasonal plants listed by month | A table with a column for when |

### 2. Fresh-player test

Before: a Gather button and nothing about how much is left. Now: five seconds reads "1 site here, you can gather now", a stock bar, "Open", then after the first gather the names. Terms that need knowing: "full in about 2 hours" (regrowth), "per find". Not fixed: family ids as names ("Reedherb" is the family id spoken; a display name field on the family is the fix) and "find".

### 3. Space, split and density (UR42)

Glance density: the header line, the table and chips. One click: Village experiments for every action. At 1920×1080 the glance fits the center column at 14 and 21 px (evidence below). Merge, not split: it becomes the top of Village experiments once the fold is accepted.

### 4. Bars and small signals

Stock bar: how much is left. Chips: what is open, with words beside the mark (UR37). Odds and freshness bars: only in the insight view and only where something spoils.

### 5. Pop-outs and the Electron app

A season band and stock glance earn a second-screen pop-out beside Reports during long gathering runs. The renderer draws from the node's own document, so it works in one; the panel module still builds its node with the global document. A Dock badge for "dew is open" or "regrown" is possible through presence hooks, not built.

### 6. Cheats and insight views

The insight view (`view.insight`) shows exact odds and the rare-find line, headed "revealed by cheat", from the same lens (`forecastHarvest`), a second projection of the same truth (AD6) with no change to outcomes. No cheat consumer feeds it yet, so the live adapter passes `false`. Sealed secrets stay in their discovery route.

### 7. Visual style

Default: Luminous Gothic table and band with token colors. A second style, "field notebook" (paper, ink ticks per season, pencilled stock bars), suits a list of sites and a year better than glow does; it is a token set (UR6), not built this round.

### 8. Use what we have

Reused: the source engine and its lens, the figure forms (`tables`, `bands`, `chips`, `bars`) with no new shape, `definePanel`, `observerView` and the capability registry, the Village quote. New shape: none (UR79).

### 9. Unconventional option

"The bank shows the season": a settled-subject effect (UR38) where a site's row warms when its yield opens and dims at the season's end, with a soft pulse when a depleted site regrows. Needs a regrown event; worth a later slice.

### 10. Audit gaps

- Lead's run and other seats: the glance only reads the Village here; a seat in another world sees no panel (tested: a different location reads "elsewhere"). The hearth-shelf freshness is a separate panel and is not merged.
- Empty and error states: no sites here, a place elsewhere, and (a source whose calendar coordinate is missing reads "Cannot be read right now"), depleted, out of season (tested).
- Persistence: none. Performance: one figure of about 120 SVG nodes, re-rendered only when the model changes.
- Accessibility: every fact has a text form; marks pair a glyph and a word. 21 px checked.
- Known limits: SVG text wraps tightly at 14 px ("12 of 12 left" splits across lines); the table's Stock column repeats the stock words beside the bar; weather is a supplied line, not a rule.

### 11-12. Prior implementations and open for improvement

The abstraction underneath is a ledger of renewable stocks with gates. The existing owner is complete; this view only reads it. Known limit: the glance and Village experiments both hold gathering facts until the fold.

### 13-16. Flourish, Reports, ability and fold

Flourish: a short glow on a chip when a gate opens, under the settled-subject rules and off with effects off. Reports lines proposed (Time and chronicle owns the shell): `Gathering: the Village verge has regrown to 12 of 12`, `Gathering: the dew at the bank opens at dawn`. Ability flourish: not applicable. Fold: see above.

### 17-21. Later volumes, forms, depth, flair, draft status

See GS1-GS4. Flair roles named in the data: `open`, `waiting`, `depleted`, `current season`; a motif pack (reeds, frost, blossom, a spirit field) restyles marks through tokens without touching the adapter. In a thatch-and-field world the band could read as a furrow with sowing and harvest marks; in a sea world, as tide and shoal. Everything here is a draft; if gathering becomes a walk over a place, the table and band stay as the glance above it.

## Disposition

**ACT NOW (done):**

| Item | Done check |
| --- | --- |
| Pure read (`readGatherSites`), model and figure adapter: site table, season band, chips, odds and freshness bars | `tests/gathering_view.test.js` (8 tests) |
| Panel `gathering` through `definePanel`, surface entry, directory row, tokens-only stylesheet in the manifest | `tests/ui_contract.test.js` panel-surface test; token test fails only on another lane's `style.css` hunk |
| Gallery fixtures: bloom, fall, no-seasons, insight with freshness and a seat pair | `scripts/playtest/gathering-gallery.mjs`, evidence in `evidence/gathering/` |
| 1920×1080 fresh-origin run at 14 and 21 px; gather once and watch the stock fall; hand-off opens Village experiments | `scripts/playtest/gathering-view.mjs` |

**ACCOUNT FOR NOW:**
- Fold the table into the top of Village experiments and retire the panel (UR77), with the pin line (UR17). Needs `crafting_home.js`.
- A display name for families, so "Reedherb" reads as a name.
- Whether the village verge should declare a season map: the world clock says Summer, the verge ignores it. Owner decision for crafting.

**LATER / DELEGATE:**

| Item | Level | Effort | Done check | Reopen trigger |
| --- | --- | --- | --- | --- |
| Give a village source a season map and hour gate, so the live band appears | Sonnet | small | Live panel shows the band; tests agree with `forecastHarvest` | Crafting owner agrees |
| Sites elsewhere (saved nodes at other places) as "gathered before" rows | Sonnet | medium | Stock words match `nodeAt` at that place | Maps lane wants it |
| Freshness live for gathered items that spoil | Opus design, Sonnet build | medium | One shelf-life owner; bars match the hearth shelf | A perishable gathered item exists |
| Weather as data on a source (a gate or yield change) and the line from it | Opus | medium | Quote and glance agree in rain | A world asks for it |
| Cheat insight consumer for the odds view | Sonnet | small | Labelled projection, outcome unchanged (AD6) | Cheats panel has a consumer |
| Quality bands on yields | Sonnet | small | Test compares to the engine's grade range | The lens forecasts quality |
| Field notebook style token set | Sonnet | small | Gallery shows both, text form identical | Weibao asks for a second style |
| Pop-out and presence ("regrown", "dew open") | Sonnet | medium | Renders in a second document in a test | Weibao asks for second-screen use |
| Season-open and regrown effect | Opus | large | Effects off removes it, facts unchanged | A regrown event exists |

## Verification record

| Check | Result |
| --- | --- |
| `node --test tests/gathering_view.test.js tests/representation_contract.test.js tests/stylesheet_manifest.test.js` | 20 passing |
| `tests/ui_contract.test.js` | panel-surface test passes; token test fails on `style.css` (another session's uncommitted hunk), none from this slice |
| `npm run build`, `npm run build:figures`, `npm run check:arch` | pass; no new cycles |
| Browser, `scripts/playtest/gathering-view.mjs`, fresh origin, 1920×1080, 14 and 21 px | PASS: stock 12 of 12, then 11 of 12 after one gather; names appear; hand-off opens Village experiments |
| Gallery, Luminous Gothic and Neutral | PASS, screenshots saved |
| AD43 floor | Below floor: FLR1 (bundle hash receipt) and the fold are open; the full `npm test` is left to the coordinator |
| Review state | agent-verified, not human-reviewed |
