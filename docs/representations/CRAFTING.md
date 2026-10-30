# Crafting and workshops: representation (proposals, 2026-10-30)

Branch `claude/rep-crafting-c0b04e`. Everything here is a proposal (AD32) and a draft (brief item 21); every choice is the current best and open to refactor or replacement with a reason (AD45, item 12). Rules applied: UR63, UR42, UR37, UR61, MR4 (preview consumes nothing), MR18 (quick, guided, deep), MR21 (skill improves control, not truth), MR32 (a reader for every maker), CLR3 (no canon names in tracked code). Desktop 1920×1080 first; mobile deferred.

Design palette for weapons, runes, inscription, maker arts and their reveal cheats (owner, 2026-10-30): [Weaponcraft, runes and inscription](../WEAPONCRAFT_RUNES_AND_INSCRIPTION_CONSIDERATIONS_2026-10-14.md#round-4-the-three-companion-palettes-merged-here-2026-10-30). This file covers the screen only.

## What exists today (SHOWN, read from the code)

- `src/crafting_detail.js` renders one recipe's detail beside the list; `src/display.js` `build_item_recipe_model` builds the model from `itemRecipeStatus` (the same availability the row and the native guard read). The Village common bench (`src/crafting_home.js`) calls the same renderer with its own model.
- This detail serves the **items** pages (tinkering, cooking, smelting, ...). Components and equipment pages use `renderRecipeConnections`, and the equipment path has the real quality model: `get_quality_range` (skill, tier and component quality, rounded to a precision, capped by skill).
- Item recipes have a success chance, no quality, no time and no coin cost. An attempt spends its inputs whether or not it succeeds (`main.js` batch loop: attempts consume, successes are rolled). Crafting is instant in the native item path; only the bench's brazier option runs 6 played minutes.
- Fresh-player route: Crafting is disabled until a station exists ("no available station"); stock may be unfamiliar ("Unfamiliar material", CP2) until the item log knows it.

## CF1 (built): the glance, round 1

The first thing seen after selecting a recipe was a stack of labelled rows with the blocked reason at the bottom and a paragraph of batch policy in the middle. The slice puts one status line and one grid at the top, and moves depth one click away:

| Part | Where | Density and why |
| --- | --- | --- |
| Status line (`✓ Ready: N attempts possible now` or `✕` plus the one blocked reason) | top, focusable when blocked (`data-craft-blocked-reason`, `focusFirstBlocker` still works) | Always visible: the first question is "can I?" |
| Needs chips (`✓/✕ name have/need · enough/short N/reserved`) | glance | One line per input; mark plus word (UR37) |
| Time, Cost, Makes, Quality, Success, At | glance grid | Always visible: the facts weighed before Craft. Time says "Instant: no game time passes"; Cost says what is spent and that failure still spends |
| Quality | glance | "Not graded: it works or it does not" for items. A model with a real `quality.range` shows `Quality lo–hi`; nothing is invented (UR63) |
| Success | glance | Percent as before (`data-craft-chance` stays a number) plus a word band: reliable ≥90, likely ≥60, uncertain ≥30, unlikely ≥10, very unlikely. The bands are a default dial per world |
| Input stock (owned / unblocked / blocked) | disclosure, open only when something is short or held | Depth for the "why is this short" question |
| About this recipe (XP, batch policy) | disclosure, closed | Reference prose, read once |
| Result details, known effects, related producers and uses | unchanged | Depth |

Code: `src/ui/craft_glance.js` (pure `craftGlance(model)`, `needChips`, `chanceWord`, `glanceText`; the text form is the same data), one renderer function in `crafting_detail.js`, two optional model fields in `display.js` (`time`, `spendsOnFailure`), CSS at the end of `styles/crafting_detail.css`. A surface that passes neither field (the bench) reads "Not stated" for Time and omits the failure clause: honest, not wrong. No persistence change, no engine change.

Evidence: `docs/representations/evidence/crafting/glance-{blocked,ready}-{14px,21px}.png` (headless Chrome, 1920×1080, fresh seeded origin; the 21 px shots set the context module's font size to 21 px and the script asserts the detail's computed size). Script: `scripts/craft_glance_browser.cjs` asserts the glance text, that the Craft button sits inside the viewport, that a ready recipe has no blocked reason, and runs one real Craft 1 (a failed attempt in the captured run: inputs spent, receipt shown, glance re-rendered, game clock unchanged, `glance-after-craft-14px.png`). At 21 px the Craft controls stay in view but the Success and At rows scroll below the first screen; the glance grid is one column there.

## CF2: forms per part (item 18)

| Part | Chosen form | Why the others fit worse |
| --- | --- | --- |
| Pick a recipe | List with a pinned inspector (as built). Next: a filter chip "can make now" and a sort by readiness | A grid of icons (Minecraft book) needs art we do not have; a tree is for dependencies, not choosing |
| Decide to commit | Workbench card (CF1) | A figure would hide the numbers; prose is slow |
| Understand a chain (what makes this, what it feeds) | Input-output graph, left to right (`fixtures/crafting.js`, `craft-flow-blade`) | The ring is wrong for flow. The existing related-recipes list is one hop; the graph shows the chain and where it is blocked. `figure.js` lacks a layered layout (its free placement clusters nodes and labels collide), so a generic `layout: 'layers'` is the missing shared piece |
| How good will it be | Quality distribution bar: a track from min to cap with the expected range shaded and the current skill cap marked, words at the ends. Equipment path only (it owns a real range) | A single number hides variance; a histogram promises a distribution the engine does not compute (rounded uniform range) |
| Batch and goals | Chips plus a progress line (existing session goal) | A queue board only matters once crafting takes time |
| Failure history | Ledger rows: attempts, successes, what was spent, by recipe, in Reports | A graph of luck invites gambler reading |
| Unconventional | The bench remembers: tools and stations show wear and the maker's marks from past work, and a repeated recipe visibly settles into a "habit" line (fewer prompts at mastery, MR21). See CF8 | |

## CF3: levels and depth (item 19)

Default, dial and reason, per world (MR11, MR15):
- **Quality bands** (equipment): a named band per range slice (rough, serviceable, fine, superior, masterwork) with cutoffs from the world pack, never hard-coded; the glance shows the band word and the number. Skill caps the top band (existing `get_crafting_quality_caps`); station tier and component quality shift the range.
- **Mastery** (MR21): the stages change control, not truth: fewer steps and prompts, narrower variance, a wider window, the right to batch ("All" unlocks as the recipe becomes familiar), and inventing variants (MR9 open slots). The inspector shows the stage and what the next stage changes.
- **What the next tier unlocks**: a one-line footer ("Tier 2 bench: adds X, Y; needs Z"), computed from recipes whose station tier requirement is the next tier (data, not a list).
- **Knowledge depth**: "unfamiliar material" is itself a level. Show it as a ladder: unfamiliar, named, tried, understood, with what each reveals (MR31: projections never leak truth).

## CF4: later volumes and other worlds (item 17)

Checked: the engine owner `docs/CRAFTING_ENGINE.md` rounds 2-10 (world rulebook declarations WR1-WR8, higher sequences and all pathways for potion crafts, styles per world ST). Not read this session: the private reading notes (canon detail stays private, CLR3). What the design needs from them stays data: a world declares its station kinds, verbs, quality model (exact, graded, continuous dose) and chance words; a later volume adds recipe rows, station tiers and band names. The glance already degrades by field presence: no `time` reads "Not stated", no `quality` reads "Not graded". Open: a world whose making has no chance at all (exact formulas, MR7) should drop the Success cell and show "Exact or degraded" instead; a world whose making takes days needs Time to be real and a queue.

## Round 2 (brief items 1-21)

### 1. Other games (known = from play or docs I recall; inferred = my reading, unchecked this session)

| Game | What the player sees | Easy / cost | Idea to adapt |
| --- | --- | --- | --- |
| Atelier series (known) | A synthesis screen with slots, trait chips and a result preview | Easy to see what traits carry over; heavy art and menus | Preview the *traits that carry*: our Quality row, later per-property chips |
| Minecraft and Terraria recipe books (known) | Grid of results; pick one, see inputs; "craftable now" filter | Very fast browsing; no chain view | The readiness filter and sort; our row summaries already say "N ready / Missing" |
| Satisfactory production planning (known) | Rates per machine, a chain with bottlenecks flagged | Great for chains; overwhelming for one item | The bottleneck mark on a graph node (CF2 flow figure) |
| Kenshi research (inferred) | Research queue with time and cost, benefits listed | Clear commitment; slow | Time and cost stated before commit (CF1) |
| Dwarf Fortress workshops (known) | Job queue per workshop with material filters | Powerful; opaque to a new player | Material choice as a stated policy (UR63), kept behind a disclosure |
| Melvor Idle skilling (known) | Per-action card: inputs, time, xp, mastery bar | Calm, readable at a glance | Our glance card is this shape; mastery as a thin bar per recipe (CF3) |

### 2. Fresh-player test

Five-second read before: the detail opened on "Input stock · owned / unblocked / blocked" and a 4% success with a long policy paragraph; the blocked reason sat below the fold of the content. Terms needing knowing: unblocked versus blocked, "attempts versus outputs", "material-stop", "Unfamiliar material". Fixed cheaply: reason now at the top once; time, cost and failure spending stated; stock breakdown only when something is short; policy prose behind "About this recipe". Not fixed: "Unfamiliar material" gives no hint what to try (needs the knowledge ladder, CF3); "Missing" in the list does not say what is missing (ACCOUNT FOR NOW below).

Note on the engine claim in CF1: "instant, no game time" is exercised by the evidence script (clock unchanged across a craft); "failure still spends inputs" was seen in the same run.

### 3. Space, split and density

At 1920×1080 the workspace gives the center column about 700 px; the list (44%) and inspector are already side by side, and the inspector has unused height below the disclosures. Decision: keep list plus pinned inspector (merge, since both answer "what can I make"); use the spare height for a "Chain" disclosure holding the flow graph, not for more text. Density by frequency (UR42): status and Craft controls are glance-density (looked at every craft); needs and chance are one line each; stock, XP, policy and results are one click.

### 4. Bars and small signals

Chips (needs, ready/blocked) answer "can I?"; the success word answers "how likely?"; a mastery bar answers "how practiced?"; the quality track answers "how good?". Each carries a word beside the mark (UR37); the same ok/blocked marks as the figure states keep UR74.

### 5. Pop-outs and Electron

A recipe inspector earns a pop-out: crafting while watching Reports or the map on a second screen. `renderCraftingDetail` already draws into the node it is given but uses the global `document` (`document.createElement`, `document.activeElement`), so a pop-out in another window document needs `root.ownerDocument` threaded through (MDL13). Not done this round (touches the renderer's every helper). Presence: a Dock badge or notification when a timed bench batch finishes (only once Time is real). Browser fallback unchanged.

### 6. Cheats and insight views

A revealed view shows the true quality range and true chance for an unfamiliar recipe and the material properties behind "Unfamiliar material", marked "revealed by cheat" in the status line. Per MR1 and MR31 the numbers shown to a normal observer never change the result; the reveal is a second projection of the same truth. Sealed secrets stay in their discovery route: the glance names inputs only as the observer knows them. Developer inspector stays separate.

### 7. Visual style

Gallery has the flow figure in Luminous Gothic and Neutral beside its text form. A second style, paper-and-ink "recipe card" (ruled lines, ink-stamped ✓/✕, quality as a pencilled range), reads better for the glance because it suits a list of facts; it is a token set (UR6), not built this round.

### 8. Use what we have

Reused: `itemRecipeStatus`, the model builder, `craftBatchProposal`, `figure.js` states and edges, `observer_view` rule (names only as known). New shape: `craft_glance.js`. It has one consumer plus the bench (which can pass `time` and `quality` later); the second consumer is the equipment page, which should adopt it (proposed UR79 needs two).

### 9. Unconventional option (CF8)

"The bench remembers": a settled-subject effect (UR38, UR62) where a station shows the last thing made, a worn edge on a heavily used tool, and a one-line habit note. It could use `settled_text_effects.js`. Needs per-station wear data (none today), so it is a later slice and only worth it once durability exists for tools.

### 10. Audit gaps

Lead's run (LTU): the items detail has no knowledge ladder, so a fresh lead cannot tell what an unfamiliar material is for. Other seats: a thin life with no station sees a disabled nav button and a title attribute only; give the disabled route a visible reason. Empty and error states: no recipes selected shows one prompt (fine); a missing model field now reads "Not stated". Persistence: no change. Performance: the glance adds about 20 DOM nodes per render; the renderer rebuilds all children on each refresh, as before. Accessibility: the status is focusable only when blocked, focus restore list unchanged; 21 px checked with the real detail size (see CF1): controls stay visible, lower glance rows scroll.

### 11. Prior implementations and abstraction

The abstraction is a **commitment card**: target, means, stock, time, cost, odds, blocked reason (UR63), identical for crafting, rituals, mixing, projects. `craftGlance` is that card for crafting; the next consumer should lift the row builder, not copy it. Earlier owners to reconcile: `docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md` (small contextual bars) and the representation ladder (not re-read this session).

### 12. Open for improvement

Known limits: chance bands are a guess; the glance repeats the stock fact (chips and the stock disclosure); the inspector's spare height is unused; item and equipment pages still use two different detail renderers. Likely next refactor: one renderer for both pages plus the commitment card shared with rituals and mixing.

### 13. Flourish

Settle a short glow on the status line when a craft succeeds and a soft pulse on the Craft button when a recipe becomes ready after a stock change, reusing the Luminous glow tokens and `settled_text_effects.js`; bound to the settled subject, off under effects off and reduced. Not built.

### 14. Reports and the center

Reports lines proposed: `⚒ Made 2 Ingot (3 of 5 attempts succeeded, spent 5 Ore)`, grouped by recipe with a link back to it; failures as `⚒ 0 of 3: spent 6 Ore`. The Time and chronicle session owns the shell; this feature supplies subject-first lines. Center: actions first (done: status plus Craft in view), reference prose behind disclosures (done).

### 15. Ability flourish

Not applicable here beyond mastery gain: a one-line cue when a mastery stage is reached (existing `craftCue` is the hook).

### 16. Fold into the existing UI

Folded into the existing detail pane; no new surface. Proposed larger move for the coordinator: the disabled Crafting route should say why and offer "Go to a station" (UR13 log line; saved layouts unaffected).

### 17. Later volumes

See CF4.

### 18. Form per subject

See CF2. Gap for the shared figure: a layered left-to-right layout and a bar/track with a shaded range. Tell the coordinator; the flow fixture shows the cramped result with free placement.

### 19. Levels and depth

See CF3.

### 20. Flair: roles, then motifs

The specs name roles in edges and states (`consumes`, `makes`, `leftover`, `broken` for a blocked step) rather than looks. Flair: in a xianxia-like world, the recipe card is a furnace page where stages are fire phases and quality bands are grades of an elixir; in a school-of-magic world it is a margin-noted formula where the same bands are marks in red ink. Both restyle `craftGlance` output through tokens without touching the adapter.

### 21. Draft status

The renderer, glance and flow figure are drafts. A different structure may serve better: one workbench card shared by every making domain, with the recipe list as a table. Round 1 is kept only where good: the ready/blocked glance and one-place reason.

## Disposition

**ACT NOW (done):** CF1 glance, reason moved to the top once, stock and policy behind disclosures, flow figure fixture, focused tests (`tests/crafting_detail.test.js`: 7 passing, plus the related crafting tests), 1920×1080 evidence.

**ACCOUNT FOR NOW:**
- The list row says "Missing" without naming what; add a short reason (needs row data from `update_item_recipe_row_status`).
- Bench (`crafting_home.js`) passes no `time`; its brazier option should say "6 played minutes" through the glance when the mixing and rituals owners agree.
- The equipment page should adopt `craftGlance` with `quality.range` from `get_quality_range` (compute in the model builder, never in the renderer).

**LATER / DELEGATE:**
| Item | Level | Effort | Done check |
| --- | --- | --- | --- |
| Generic layered layout in `figure.js` and a shaded-range track | Sonnet | medium | Two fixtures render without label collisions; text form intact |
| Equipment page on the glance with real quality band | Sonnet | medium | Test compares the glance range to `get_quality_range`; browser shot at 1920×1080 |
| Pop-out inspector (thread `ownerDocument`) | Sonnet | medium | Renders in a second document in a test |
| Knowledge ladder for unfamiliar materials | Opus design, Sonnet build | large | Observer-safe projection test (MR31) |
| Per-world band names and chance words in the pack | Sonnet | small | Two worlds, two vocabularies, one renderer |
| Bench-remembers effect | Opus | large | Needs tool wear data first |
