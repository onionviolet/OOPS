CHECKPOINT: MQ-B, 2026-10-19. Doc-level work, one new file, no code, no commit. Every row below is a proposal, not an accepted decision, and makes no behavior claim. Nothing was run in a browser.

# MQ-B: display and placement for materials, sources and tags (UV1 to UV14)

Owner of the codes: [CRAFTING_ENGINE Round 6](../../CRAFTING_ENGINE.md#round-6-2026-10-19-tags-subtle-properties-new-material-families-places-and-display). Run log: [world dials core audit, Round 2](../WORLD_DIALS_AND_INTERPRETER_CORE_AUDIT.md#round-2-materials-tags-places-and-display). Rules applied: UR1 to UR4, UR6 to UR11, UR13, UR25 to UR27, UR35, UR41 to UR48, UR52, UR56 to UR58 ([UI_RULES](../../UI_RULES.md)), ST1 to ST9 ([surface types](../../UI_SURFACE_TYPES_AND_DRAWING_BOARD_2026-10-15.md)), SC1, SC2, SC9, SC11, GR5, SR12, SR13, SR19, SR20.

Evidence labels: SHOWN (read in a file this session, with file:line), STATED (a doc says so), INFERRED (my reading, unverified), MEMORY (none used).

## Frame

| Item | Value |
|---|---|
| Target viewport | 1920x1080 primary; Weibao's MacBook about 1800x1040 checked each round; floors 1536x864 and 1366x768. STATED UI_RULES viewport targets (2026-10-17), Round 6 UV header (CRAFTING_ENGINE.md:512) |
| Visible outcome | A player sees what a material is as far as they know it, where it can be found, what a place offers, and the odds of a gather, without raw ids |
| Deferred scope | Mobile and touch equivalents (AD34); the director dial editor; a full map redesign; per-world keepers and source content (NX10, PG11); any code |
| Rule count note | The brief cites UR1 to UR49. The live rulebook runs to UR58 (RULES_INDEX.md:40, SHOWN), so UR50 to UR58 also apply; UR52, UR57 and UR58 matter most here |

## What exists today (SHOWN)

| Module | Fact | Use here |
|---|---|---|
| `src/craft_sources.js:82,119,150,171` | `sourcesAt`, `nodeAt`, `forecastHarvest`, `harvest`. The forecast returns exact `stock`, `capacity`, yield `id`s and permille odds (:150-160) | Data owner for UV4, UV5, UV13. Its raw output carries ids and exact numbers, so a projection must sit between it and any view (SC1, GR5) |
| `src/crafting_frontier_runtime.js:9-13` | One frontier source: `village-herbs`, "Village common herb verge", `at:'village'`, capacity 12, `reedherb` variants, quality 40 to 60. Native request type `harvest` at :79, :99 | The just live gather source; fixtures should copy its shape |
| `src/harvest_ui.js:3-6` | `createHarvestPanel` is the carcass panel (`details#harvest_panel`). It sets `panel.style.cssText` (:4) and polls with `setInterval` at 500 ms (near the end of the file) | Not the home for plant or mineral gathering (animal slice, `src/harvest.js:1`). Its inline styling conflicts with UR6 (see conflicts) |
| `src/chain_inspector_ui.js:5-8` | Developer-gated, read-only chain lens; a no-op unless `developer===true` | A developer fixture lens for truth, not a player surface (TQ15) |
| `src/crafting_detail.js:6,18,31` | `UNKNOWN_MATERIAL_LABEL = 'Unfamiliar material'`, a `fact(label,value,attr)` row helper, and `renderCraftingDetail(root, model, handlers)` (presentation, model built by display.js) | Closest pattern for a material card; same presentation-layer contract |
| `src/crafting_visibility.js:3,40` | `recipeMakeableNow`, `itemRecipeStatus({isMaterialKnown,...})` | Knowledge-filter seam for UV10 (recipe slot "where to find") |
| `src/craft_cues.js:4,19` | `CRAFT_CUES` and `craftCue(skillId, level, result)` | Skill-scaled sensory text; seam for UV7 outcome lines |
| `src/center_modes.js:2,31` | `createCenterModes(paint)` stack (open, close, back, local) and `centerModes()` owner with the `← Village` back bar | Home for a place service view (UR9, UR22) |
| `src/panel_kit.js:7` | `definePanel({id,title,role,node,home,discovered,eligible,...})` over `registerWorkspaceModule` | How a new panel registers (UR8) |
| `src/layout_spec.js:26,49,126-133` | `LAYOUT_SPEC` regions, boxes, contexts; most panels still `surface(UNSET)`; just some carry ST types | A new panel adds a `surface('ST2', ...)` row here (UR1) |
| `src/proto23_shell.js:185-205` | Item preview popover (`shell_item_preview`, footer "Inspection is free · Esc closes", `Full item ›` expands `shell-detail`) and the context preview (hover and focus enter, click pins, Esc dismisses) | The hover then pin pattern for UV3 and UV8; already built for items |
| `ui-preview.html`, `src/ui/preview/fixtures.js:35` | 50-line page with in-memory storage and a timer and write counter; `FIXTURES` keys `village` plus five `combat-*`; placeholders stand in for panels drawn elsewhere (:36-68 area) | Add fixtures here (UV14). Preview scenes are DEV SEEDED evidence (UR45) |

## UV rows, one decision each

Surface type uses ST1 to ST9. Budget means the roughly seven routine entries of Local actions (UR3). "Keeper" is a proposal for a world to adopt or replace (UR4, PG7 for commons).

### UV1 Gather entry and home
- **Surface and home:** ST1 routine entry "Gather here" in Local actions, which opens an ST2 place-service region (task region) listing that place's sources. Extends `centerModes()` (`center_modes.js:31`) for the view and `definePanel` (`panel_kit.js:7`) for registration. Default: one entry per place with at least one discovered source; a place with a single source may start that source's panel directly. Dial: world and place. Reason: UR3 and UR41 (place service belongs in its task region).
- **Budget:** one entry. Fits if an entry elsewhere is grouped; the village already lists talk and Open rows for people and things (`fixtures.js:40-44`, SHOWN), so the check is on a populated Village, not an empty one.
- **Keeper and place:** a commons verge has custom, not a keeper (PG7, SR19); a cultivated bed has its steward from `world_completion_materials_*`; a shop has its clerk (AP1, AP5). Proposed per world.
- **Knowledge-filtered text:** entry label names the place's kind ("Gather herbs here") just after the player has discovered a source (PG4); before that the entry is absent (UR13 gives a log line and a dot when it appears).
- **Deferred:** source kinds beyond gather and mine (PG2); NPC gatherers (PG13).

### UV2 Material card
- **Surface and home:** ST6-style reference read, shown as a pinned inspection (UR43) from a belongings row, a gather result or a recipe slot. Extends the `renderCraftingDetail`/`fact` pattern (`crafting_detail.js:18,31`) as a new `material_card` module; the inventory popover (`proto23_shell.js:185`) carries the short peek.
- **Budget:** none; it opens from an item, so it adds no Local actions entry.
- **Keeper and place:** none needed (reference). Source place appears as text.
- **Knowledge-filtered text (SC1, SC2):** observed descriptor from the per-save appearance layer (`product_appearance_state.js`, SHOWN to exist; its fields were not read); then rows in this order: known axes with their stage (seen, tested, understood; TQ6), known tag labels, source place, lot, condition, handling. Unknown fields say "not yet learned", not blank (UR32 spirit); unmeasured is distinct from measured zero (TQ10). The unknown label default reuses `UNKNOWN_MATERIAL_LABEL` (`crafting_detail.js:6`).
- **Deferred:** a comparison table (UV8), provenance display across worlds (TQ5).

### UV3 Tag chips
- **Surface and home:** a chip row inside the material card and the popover, not a surface of its own. Hover or focus gives a short meaning; pin gives detail (UR43, UR47). Extends the context-preview hover and pin code (`proto23_shell.js:185-186`).
- **Budget:** none.
- **Text:** chips grouped by kind label ("Use", "Property", "Handling"), hidden tags absent, no tag ids or kind ids (TQ15). Each chip has a text label, so a label backs every colour cue (UR37, UV11).
- **Deferred:** a chip-kind legend. Note: UR43 says hover then pin is an agent recommendation awaiting Weibao's selection (UI_RULES.md:105), so this row carries the same status.

### UV4 Odds forecast
- **Surface and home:** a section inside the UV1 source panel (ST2), shown before commit. Data: `forecastHarvest` (`craft_sources.js:150`). Inspection is free (SR13, UR35): a preview draws nothing.
- **Budget:** none.
- **Text:** a band such as "likely", "possible", "unlikely" with the top one or two reasons (tool needed, season shut, hour window). Exact permille appears just where a tool or skill makes it known (GR9). Yield names go through the observer projection; the raw forecast carries yield `id`s and exact `stock` (`craft_sources.js:156-157`), so the view reads a projection, not the forecast.
- **Deferred:** rare and pity detail (`craft_sources.js:159-160`), shown as "something rarer may turn up" until learned.

### UV5 Place source list
- **Surface and home:** ST2 task region opened by UV1; one row per discovered source, built as a `definePanel` module with a `surface('ST2', ...)` row in `layout_spec.js` (UR1). Extends `sourcesAt` (`craft_sources.js:82`).
- **Budget:** one Local actions entry opens it; the list scrolls inside the region (UR25: one scroll owner, back bar pinned).
- **Keeper and place:** as UV1.
- **Text:** name, stock band (exact just when known), next open window, declared tool gate, danger, access cost (PG7, PG8). Undiscovered sources are absent, not greyed (RS11, UR52 treats known-empty and unknown as different states).
- **Deferred:** last-seen staleness (UV9) and per-world band widths.

### UV6 Sort, group, search
- **Surface and home:** a tool strip at the head of Belongings and of the UV5 list. Extends `shell-inventory-tools` (`layout_spec.js:49,71`, SHOWN to exist).
- **Budget:** none (UR54: control placement follows the task).
- **Text:** group by family, use, place or quality. Grouping merges comparable stacks for display; selection stays exact per lot (SC11, UR56). A group row shows a count and a range ("5 to 7 grade"), and opens to its lots.
- **Deferred:** saved filters per character (UR58 asks for an owner and reset boundary first).

### UV7 Log rows
- **Surface and home:** ST9 ambient log, the existing Reports column (`layout_spec.js:131`, `messages`: ST9). Extends `craft_cues.js:19` for cue text and the log-subject preview in `proto23_shell.js`.
- **Budget:** none.
- **Text:** one compact row per event, naming the thing, the quantity and what was learned or is still unknown (SP2). A click opens the current related card and says so (UR48); old rows keep the recorded wording.
- **Deferred:** grouping repeated rows (UR56 needs an identity rule first).

### UV8 Compare two materials
- **Surface and home:** a pinned inspection (UR43) with two cards side by side, opened from a "Compare" command on the UV2 card; it replaces Focus for the inspection (UR41), not the lower centre.
- **Budget:** none.
- **Text:** known axes alone; a substitution match appears for a profile the player understands (E4B), else "not enough understood to compare".
- **Deferred:** the substitution engine; a three-way compare.

### UV9 Map layer
- **Surface and home:** not a map in this round. Default: a "last seen" line on each UV5 row (ST2). A map layer waits for the map redesign, which is deferred scope.
- **Budget:** none.
- **Text:** "last seen full, 4 days ago" style lines, stale by the world's clock (SR20). Returning or reading a map is not a renewal cause.
- **Deferred:** the layer itself.

### UV10 Where to find, from a recipe slot
- **Surface and home:** a link inside the recipe detail requirement row (`crafting_detail.js:31` `[data-craft-req]` rows), opening the UV5 list filtered to the slot's profile.
- **Budget:** none.
- **Text:** lists just sources the player already knows could fit (via `isMaterialKnown`, `crafting_visibility.js:40`). A lens cheat may widen it as a labelled layer entry (WDI15) with its route shown; a cheat reveal does not print a sealed truth in chat or UI outside its route.
- **Deferred:** profile-to-source search across unknown families.

### UV11 Text equivalents
- **Surface and home:** a rule on every row above, not a surface. Extends UR37 and SP11.
- **Text:** each colour or sound cue (stock band, hazard, closed window) has a word or symbol in the same row. Check with colour tokens removed.
- **Deferred:** sound design.

### UV12 Late-game density
- **Surface and home:** applies to Belongings, UV5 and the log. Search, filter and a windowed list (UR27: sticky header, count, no jump on refresh). Disambiguate repeated names by place or origin once the player holds both (SC9).
- **Budget:** none.
- **Text:** see the density check below.
- **Deferred:** virtual list implementation detail; per-locale name grammar.

### UV13 Depleted or closed state
- **Surface and home:** a state on the UV5 row; the node stays listed with its cause and clock (SR20, UR13). Changes the row, not a new panel.
- **Budget:** none.
- **Text:** "Picked over, grows back with rain" or "Closed until dawn". A known-empty source reads differently from a filtered-empty list and from an unknown one (UR52).
- **Deferred:** the cause set per world (PG5).

### UV14 Evidence
- **Surface and home:** `ui-preview.html` fixtures first, then a rebuilt native check. Extends `FIXTURES` (`fixtures.js:35`). Preview scenes count as DEV SEEDED, not a native journey (UR45), so each step's done check still needs the rebuilt game.
- **Deferred:** none beyond the fixtures list below.

## Conflicts and risks with accepted rules or existing panels

| Id | Row | Issue | Proposed handling |
|---|---|---|---|
| X1 | UV1 | A new Local actions entry competes with the budget on a populated Village (UR3); the Village fixture already lists one row per person and per thing (`fixtures.js:40-44`) | Count entries on the populated fixture before adding; group or demote another entry as UR3 asks |
| X2 | UV3, UV8 | Hover then pin is a recommendation awaiting Weibao's pick (UI_RULES.md:105) | Build on the existing item popover pattern; mark the choice open in the step's record |
| X3 | UV4, UV5 | `forecastHarvest` returns raw yield ids and exact stock (`craft_sources.js:150-157`); showing it directly breaks SC1 and TQ15 | A projection layer between owner and view; a done check scans rendered text for ids |
| X4 | UV1 | `harvest_ui.js` is the carcass panel with inline `style.cssText` (:4) and a 500 ms poll; extending it for plants would carry a UR6 gap and a UR8-style mount into `container` | New module through `definePanel`; leave the carcass panel to its owner |
| X5 | UV9 | A map layer collides with the deferred full map redesign | Reduce to a text line on UV5 rows |
| X6 | UV10 | A lens cheat that widens results could surface a sealed fact | Cheat entries show the route and the known label; sealed truth stays out of UI text outside its discovery route |
| X7 | UV6 | Grouping can hide same-name lots with different quality or condition (UR56) | Group rows keep a count, a range and an expand path; selection stays per lot |
| X8 | UV14 | The preview page replaces storage with memory and uses placeholders (`ui-preview.html` script, `fixtures.js:60-68`) | Fixtures prove layout alone; label them DEV SEEDED |
| X9 | all | Most `layout_spec.js` surface rows are still UNSET (:126-133) | Each new panel declares its ST type when it registers |

No UV row conflicts with UR11 (log column stays whole) or UR9 (one center-mode controller), provided UV1 opens through `centerModes()`.

## Populated-save density check (SC9, SC11, UV12), proposed method

Nothing was measured. The numbers below are planning assumptions (INFERRED) to size fixtures, not findings.

| Check | Default scenario | Pass reading at 1920x1080 and 1366x768 |
|---|---|---|
| Source list | 12 discovered sources in one place, 3 sharing the name "Low reed" in two places | Back bar visible, no page scroll (UR25), list scrolls in its region, repeated names carry a place suffix |
| Belongings | 40 gathered lots: 8 families x 3 local variants x grades 2 to 5, many same-name rows | Group rows plus count; search finds a lot; row count visible reported per UR34 |
| Material card | A card with 6 axes (2 unknown), 5 chips, source, lot, condition, handling | Fits the pinned region at 1366x768 without clipping, at 100% and 125% text (UR33) |
| Log | 200 gather rows of one source | One compact row per event, scroll and follow intact (UR44) |
| Reflow | A tick lands while a row is hovered or pinned | Pending target and focus do not move (UR52) |

Record for each: page `scrollHeight` against the viewport and which regions overflow (UI_RULES.md:63), click and key cost for "find where to gather X" (UR57).

## Fixtures for `ui-preview` (each at 1920x1080 and 1366x768; 1536x864 and 1800x1040 at spot-check)

All are proposals for `src/ui/preview/fixtures.js`, using the existing `village` placeholders and a `material`/`source` model shaped like the current frontier source.

| Fixture key | Shows |
|---|---|
| `gather-village-one` | The Village with a single "Gather here" entry and one source row |
| `gather-village-populated` | Same entry on the busy Village; entry count visible against UR3 |
| `source-list-12` | 12 rows, repeated names, mixed stock bands, one closed, one picked over |
| `source-forecast` | Odds band plus top reasons, a tool gate unmet, preview consumes nothing |
| `material-card-unknown` | Neutral descriptor alone, "not yet learned" fields |
| `material-card-partial` | Some axes at each stage (seen, tested, understood), two chips |
| `material-card-known` | Full card, condition and handling |
| `belongings-grouped-40` | Grouped lots, count and range, expanded group |
| `filter-empty-states` | Known-empty, filtered-empty and unknown, side by side (UR52) |
| `compare-two` | Side by side with a not-enough-understood note |
| `log-gather-rows` | Compact outcome rows with "learned" and "still unknown" |
| `large-text-125-150` | The card and the list at 125% and 150% text (UR33) |

Each fixture also needs a text-only pass with colour tokens removed (UV11).

## Ranked smallest UI steps (proposals, at most five)

Every done check needs rebuilt browser evidence at the stated viewport; a passing unit test or preview scene alone does not close a step (UR45, AGENTS UI gate).

| Rank | Step | Level | Effort | Done check |
|---|---|---|---|---|
| 1 | Projection plus source list (UV5, UV13) for the single frontier source behind one "Gather here" entry (UV1), registered with `definePanel` and an ST2 row | Balanced | Small code slice, needs Weibao's go | Rebuilt game at 1920x1080 and 1366x768: entry opens a region with a back bar and Esc, row shows band, window and gate, no ids in rendered text, Local actions entry count recorded. Screenshots plus `scrollHeight` |
| 2 | Material card with knowledge stages (UV2, UV3, UV11) | Balanced | Small slice after step 1 | Rebuilt game: the same lot shown unknown, partial and known, no ids or kinds in text, chips readable with colour removed, fits at 1366x768 and 125% text |
| 3 | Odds forecast section (UV4) | Balanced | Small | Rebuilt game: opening the forecast leaves stock and draw history unchanged (compare before and after), band wording matches the commit's resolver snapshot |
| 4 | Grouping, search and repeated-name disambiguation in Belongings (UV6, UV12) | Balanced | Medium | Rebuilt game on a 40-lot save: group counts, exact selection per lot, no jump on tick, rows visible reported at both viewports |
| 5 | Log outcome rows with a "learned, still unknown" clause (UV7) | Light | Small | Rebuilt game: a gather writes one compact row; clicking it says it opens the current card; follow and scroll intact |

Fixtures (above) are built inside each step as its first sub-task; UV8, UV9 and UV10 wait for steps 1 and 2 and for the deferred scope.

## Open questions

- Q1: Does a one-source place show "Gather here" as an entry or start the source panel directly? Default proposed: entry for two or more sources, direct start for one, dial per place.
- Q2: Which owner builds the observer projection for sources and materials (SC1)? INFERRED: the same seam that serves `isMaterialKnown`; not confirmed.
- Q3: Hover then pin remains open (UR43 note).

## What was not checked

- No browser, no build, no test run; no screenshot at any viewport.
- Whether `craft_sources` gathering has any native UI today beyond the `harvest` request in `crafting_frontier_runtime.js:79,99`; I did not trace `display.js`.
- Contents of `product_appearance_state.js` and `world_completion_materials_*`, the exact `ui-preview` bar controls (`src/ui/preview/main.js`), `styles/` token names, and the full `LAYOUT_SPEC` surface table beyond :126-133.
- Real Local actions entry counts on a populated save (the fixture list was the sole source).
- The `.claude/rules` and RULES_INDEX router were read at the rows cited; other AD lines were not.
- Keeper names, source content and per-world dials are not specified here.
