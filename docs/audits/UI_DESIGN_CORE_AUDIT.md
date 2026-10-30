# UI design core audit

Repeatable root for UI rule and design-quality audits. Each rerun adds a dated
round below and keeps codes stable (UIA1 onward). Findings and LATER items are
proposals; only UR rules recorded in [UI_RULES](../UI_RULES.md) are standing.

Rules applied: UR6, UR7, UR14, UR17, UR25, UR32, UR33, UR46, UR49, UR52, UR53, UR59, UR60, UR65–UR69; AD34, AD36, AR (layout engine seam).

## Round 1, 2026-10-22

Weibao: "ui optimization rules? creating base rules for every little thing to
make development easier?" then "Audit and improve rules in general? More to
consider? Yes do spacing but consider more as well, and other general design
gaps that makes things harder or less intuitive? or not making use of space, or
not looking the best they can look?"
[Direction record](../USER_VISION.md#ui-small-detail-tokens-and-design-audit-2026-10-22).

### Evidence and its limits

- **Source census.** `style.css`, `index.html`, `styles/*.css` (7,309 CSS lines)
  and `src/**/*.js` style strings, measured with a scratch regex census on
  2026-10-22 against the working tree at `e59df9a28` plus uncommitted edits.
- **Browser.** Rebuilt bundle (`npm run build`), served from the primary
  checkout, 1920×1080 emulated viewport, 14 px text. Fresh origin
  `127.0.0.1:18452`, first with a new character, then seeded with
  `tests/fixtures/perf/mid.json` the same way
  `scripts/playtest/proto23-desktop-comparison.mjs` seeds it. Computed
  geometry came from the page; screenshots came from a scaled pane (800×450
  frame), so pixel-level crispness is **not** visually confirmed.
- An earlier reading on `localhost:18452` showed system-font stats. That origin
  held an existing save with a display preference, so it was discarded as
  evidence; the fresh origin renders Gothic as intended.
- Not exercised: 125%/150% text layout, other targets (MacBook, 1536×864),
  hover/popover stacking, long-played logs.

### Rules as a system

| Code | Finding | Consequence |
| --- | --- | --- |
| UIA1 | UR1–UR33 are one-line table rules. UR41–UR64 grew into paragraph rules, several hundred characters each, with process detail mixed into the rule | Hard to apply mid-task. Agents skim and miss parts (UR20 exists because a correction was missed) |
| UIA2 | Small details had a token and a check only for color, font family, radius and cssText (UR6). Spacing, control heights, layers, line-height, weight and motion had neither | Every lane picked its own values, so drift grows with each round. Prose rules can't stop this; defaults and checks can |

### Measured drift

| Code | Family | Measurement | Consequence |
| --- | --- | --- | --- |
| UIA3 | Spacing | 713 nonzero literal padding/margin/gap declarations in 538 exact snippets (710 CSS, 3 JS style strings); 313 distinct values including zero; 13 token uses | No shared rhythm. **Addressed by UR65** (below) |
| UIA4 | Fractional pixels | New-character origin: 95 visible elements with fractional padding/margin/gap (2.52px, 1.68px, 5.6px); line-heights of 15.6, 17.5, 18.2 and 19.6 px | The bitmap Gothic strikes are integer-sized. Half-pixel offsets likely soften glyphs or make rows uneven (inference, not visually confirmed) |
| UIA5 | Control heights | New-character origin: 12 distinct heights among visible controls (18 to 57 px). Nine controls are under 20 px, eight of them at 18 px, mostly panel headers and tabs (You, Tools, Condition, Inventory, Reports, Latest) | Uneven rhythm and small click targets on a laptop trackpad |
| UIA6 | Layers | 54 literal `z-index` values, 25 distinct (1 to 1000), no layer tokens | Tooltip/popover/drawer/modal order is ad hoc, which makes UR53 dismissal order fragile |
| UIA7 | Type roles | 115 literal line-heights (14 values). 129 literal font-weights (11 values: bold, 600, 700, 500…) on a single-weight bitmap face | Synthetic bold and uneven leading. Each panel reinvents the label/value/prose roles that UR60 names |
| UIA8 | Font sizes | 101 literal sizes, mostly em (.85em, .9em, .8em). Visible computed sizes include 10, 11.67, 11.9, 12.6 and 13.33 px | Non-strike sizes on the bitmap face. `--custom-small-size` already exists as the right small strike |
| UIA9 | Cascade | 546 `!important` in CSS. Later parity rounds (`[data-parity="r3"]`) override earlier rules instead of editing the owner | The root cause of the drift above: each round patches over the last, so a token in `:root` can lose to an older override |
| UIA10 | Motion | 24 literal durations, 15 distinct (0.2 s to 4 s); reduced motion forced with `.001ms !important` | No shared feel for fast, normal and slow feedback |
| UIA11 | Stray face | New-character origin: one visible element computes to Arial | Minor; one face outside the UR60 default |

### Space use and intuitiveness (populated mid fixture, 1920×1080)

| Code | Finding | Consequence |
| --- | --- | --- |
| UIA12 | **Region splits did not lend free space.** Around you scrolled (290/185 px) beside a Local actions list 31% filled. *Corrected in round 2:* the stats-block "scroll" (279/160) is the closed Gear disclosure's hidden list, which scrolls by design (`shell_composition.js` excludes disclosure content), so it is not a finding | Places cut services off mid-line while space below sat empty, against UR25. **Addressed by UR69** (round 2) |
| UIA13 | Reports (499×1018) is 11% filled right after load; the Journal side pane (336×603) is 14% | Expected early in a session, since logs fill over time. Unverified after real play; re-measure before acting |
| UIA14 | In Local actions, "Mix at the Village counter" renders as a different button style from its sibling rows, and only some rows carry icons | One list with two action grammars (UR7). Seen in a scaled screenshot; confirm at full resolution |
| UIA15 | The new-character Around you region shows "No known subjects" with no next step | UR32 empty-state guidance is partial on first launch |
| UIA16 | The loading screen packs a small mixed-font cluster into the middle of a 1920 canvas, with the status toast offset beside PLAY | First impression looks unfinished. Low priority |

### ACT NOW (done this round)

- **UR65 spacing scale.** `styles/ui_tokens.css` defines `--ui-space-1` to
  `--ui-space-7`, `--ui-space-hairline` and `--ui-space-panel` on
  `:where(:root, .customization-module)`. Steps derive from `--custom-size`
  and round to whole pixels.
  - Verified in the rebuilt browser: inside a panel at 14 px the steps compute
    to 2/6/12/24 px. At 17.5 px they compute to 3/8/15/30, and at 21 px to
    3/9/18/36. The panel inset follows the player's spacing setting (8 px).
  - No existing rule consumes the tokens yet, so the layout is unchanged.
- **Guard.** `tests/helpers/ui_contract.mjs` gains a `spacing` rule for CSS declarations and JS style strings.
  `tests/ui_contract_allowlist.json` adds the 538 existing spacing snippets as
  exact exceptions (a kept exception may carry a `reason` field) and leaves the earlier entries unchanged.
  `tests/ui_contract.test.js` adds caught and passing cases.

### ACCOUNT FOR NOW

- New or edited UI uses `--ui-space-*`. When a file migrates, delete its
  spacing ledger entries in the same change.
- Use the tokens as declared. Don't redeclare the scale inside a component:
  it re-resolves per module so per-panel text size works.
- A token can still lose to an older `!important` override (UIA9). Check the
  computed value in a rebuilt browser before claiming a migrated region changed.

### LATER / DELEGATE (ranked)

Status: L1–L5 were done in round 2 (below).

| Rank | Item | Level, effort | Done check |
| --- | --- | --- | --- |
| L1 | Control-height and layer tokens (`--ui-control-sm/md/lg`, `--ui-layer-*`) plus scanner rules and ledger, same pattern as UR65 (UIA5, UIA6) | sonnet, small | Tokens defined; `z-index`/`min-height` literals ledgered; caught/passing test cases; check:rules passes |
| L2 | Type-role tokens bundling size, line-height and weight for label, value, prose and title, mapped to native Gothic strikes (UIA7, UIA8, UIA11) | sonnet, medium | No non-strike computed sizes or synthetic bold on a populated 1920×1080 save; ledger for literals |
| L3 | Content-aware region splits for the left column and Focus/Local actions (UIA12). Start in the mockup workbench, since the layout is unsettled. Keep saved layouts and user edits (UR17) | design-heavy, medium to large | On the mid fixture at 1920×1080, the stats block and Around you need no inner scroll while space below is free; saved layouts load unchanged; Weibao's visual acceptance stays open |
| L4 | Migrate literal spacing file by file onto the scale, shrinking the ledger (UIA3, UIA4) | haiku or sonnet, mechanical, per file | Ledger entries removed; no fractional box pixels in the migrated region; before/after geometry equal or an intentional, recorded change |
| L5 | Rules quick-reference card (one screen: where it goes, what to use, what to check) and tighter UR41–UR64 wording without changing meaning (UIA1) | sonnet, small | One-screen card linked from player-ui.md; check:rules passes; each rule keeps its code and meaning |

Further: replace the `!important` stack with CSS cascade layers once L4 has
shrunk it (UIA9; large, design-level). Add a full-resolution screenshot step
(the Playwright harness in `scripts/playtest/`) so crispness claims can be
checked (UIA4, UIA14). Fix the action-row grammar after confirming at full
resolution (UIA14). Re-measure log and Journal fill after real play (UIA13).

## Round 2, 2026-10-22

Weibao: "all of them" (L1–L5 above), then "consider any design choices we should
learn from the Discord stuff as well". Same evidence route as round 1, plus a
headless geometry harness, `scripts/playtest/ui_geometry_snapshot.mjs`. It
records every visible box, padding and z-index on a disposable origin: the mid
fixture at 14 and 21 px and a new character at 14 px, all at 1920×1080. Two
baseline runs matched exactly (0 changed elements), so diffs are real changes.

### Discord-derived lessons

From a read-only pass over the Proto23/Corc and YAIR Discord research, the
Discord absorption check and the UI status audit. Evidence labels follow UR59.
The sources state no row heights, gaps, z-index or durations. **The token
values are our own choices, not source numbers.** Proto23 dimensions stay
reference, not targets (UR49).

| Code | Lesson | Evidence | Applied |
| --- | --- | --- | --- |
| DL1 | A label or value sits on quiet backing above a lively fill; check it at low and full fill, selected, and at 21 px | Shown (stripe crossing HP text) and developer-stated (outlined rarity text) | Existing UR60/UR61; layer order backdrop < fill < text < reactions noted for UR67 |
| DL2 | Frame style and reading isolation are separate choices | Our inference from an unused draft | LATER: tooltip/popover token pass |
| DL3 | Tooltip stability depends on width, collision and pointer rules, not placement alone | Shown clip; developer-stated fixes | Existing UR43/UR47; UR67 gives popovers one layer |
| DL4 | Don't lend space away while the player reads; one sparse capture does not prove waste | Our inference from shown cards | **UR69**: sizes change only at stable moments, bottom content wins |
| DL5 | Separate numeric alignment from prose; emphasis on a single-weight face comes from color/outline, not fake bold; report whether the face really loaded | Shown specimens; our inference | **UR68** type roles and no synthetic bold on Gothic |
| DL6 | Long labels drop decoration before meaning; the full name stays inspectable | Developer-stated configurable names | Existing UR60; LATER truncation-priority check |
| DL7 | An inspector title names the subject and baseline; the frame stays put when the occupant changes | Shown | Existing UR41/UR63 |
| DL8 | Encounter controls stay still while lists grow; lists scroll inside | Shown; developer-stated rewrite | Existing UR11/UR25/UR52; UR69 keeps fights on their own rule |
| DL9 | Day/night/weather/season signals compete for density and need a non-color form | Player-suggested | Existing UR37; LATER scene-strip density check |
| DL10 | Reduced motion has static equivalents; menu animation owns no clock | Our inference | Existing UR38/UR62; motion tokens stay LATER |

Tension kept, not resolved: an earlier proposal mixed MS Gothic (for rhythm)
with separate prose text. The 2026-10-21 direction (UR60) makes Gothic the
default for prose too. That is a dated difference, not a conflict.

### ACT NOW (done this round)

- **L1, L2: tokens and guards.** `--ui-control-sm/md/lg` (20/28/42 px at
  14 px), `--ui-layer-*` (ten named layers following the existing order), and
  `--ui-line-compact/body/small/prose` plus `--ui-weight-*`. The contract test
  gains `control-height`, `layer` and `type` rules, with caught and passing
  cases. Rules UR66–UR68.
- **L4: migration.** A script converted only values that compute the same at
  14 px text, across `style.css` and 24 `styles/*.css` files:
  - 208 on-scale px spacing values became `--ui-space-*`.
  - 773 em/rem spacing values became `round(value, 1px)`.
  - 32 exact z-index values became layer tokens.
  - 211 off-scale px spacing values (mostly 3 and 5 px) and 22 unmatched
    z-index values remain, ledgered.
- **Ledger.**
  - Spacing: 610 declarations. Each rounded or partly migrated entry carries a `reason`.
  - Type: 175. Control-height: 14. Layer: 20.
  - The earlier color, font, cssText and foreign-host entries are unchanged.
- **Geometry, before vs after migration.** The page stays 1920×1080 in all
  three scenes. Fractional padding/margin dropped from 107, 105 and 94
  elements to 4, 5 and 4. The remaining fractional boxes come from text width
  and letter-spacing (UIA7). Shifts are whole-pixel snapping that adds up:
  0.6 px per nav button and at most about 4 px down a stat column. No region
  boundary moved.
- **L3: region lending (UR69).** `topRowHeight` accepts `below`, the bottom
  row's intrinsic content. Outside a fight, idle Around you prose and
  yielding stat rows may borrow only that free space. `intrinsicExtent` counts
  parts pinned to a region edge (the action nav bar, Around you's closing hint)
  by their height.
  - Fixed a ratchet found while testing: Around you grew 14 px per measure.
  - Fights are unchanged (test).
  - Headless A/B: at mid 14 px the top row went from 303 to 419 px, Around you
    from 290/185 to fully visible, and nothing scrolls. At mid 21 px Around you
    went from 461/281 to 461/385 and is still bounded by the bottom content.
    The new character at 14 px fits fully.
  - Five `topRowHeight` regression cases were added.
- **L5: rules.** [One-screen card](../ui/UI_RULES_CARD.md). UR41–UR64 are now
  table rows in UI_RULES. The verbatim long form is archived in
  [UI_RULES_LONGFORM](../ui/UI_RULES_LONGFORM_UR41_UR64_2026-10-22.md), with a
  [zero-loss review](../ui/UR41_UR64_COMPACTION_REVIEW_2026-10-22.md).
  "Silently" was restored in UR43. UR46 keeps the retired-1366 note.

### Verification state

- Source edits: done.
- `npm test` 2557/2557, `check:arch` (exit 0), `check:rules` PASS, and
  `check:rule-behavior` 36/36 passed after a rebuild.
- Rebuilt-browser geometry at 1920×1080: as above. Full-resolution
  screenshots of before and after on mid 14 px were reviewed.
- Not done:
  - Weibao's visual-feel acceptance.
  - Exercising 125%, the 1536×864 and MacBook targets, or combat with many
    opponents.
  - Save/reload/import: persistence is untouched (no save fields changed).
- Not committed. Shared files carry other sessions' hunks, and a UI modularity
  session is landing grid changes in `ui_tokens.css`, `layout_spec.js` and
  `shell_layout.css`.

### LATER / DELEGATE (ranked)

| Rank | Item | Level, effort | Done check |
| --- | --- | --- | --- |
| L6 | Visual pass on the 211 off-scale px spacing values (3/5 px) and the rounded em values: choose scale steps with full-resolution before/after, shrinking the ledger | sonnet with screenshots, medium | Ledger shrinks; Weibao picks density where it changes |
| L7 | Migrate literal type values (175) onto UR68 roles, including synthetic-bold removal on Gothic (visible change, DL5) | sonnet, medium; needs visual acceptance | No synthetic bold or non-strike sizes on mid fixture; ledger shrinks |
| L8 | Unify the Local actions grammar ("Mix at the Village counter" renders as a boxed button among rows, UIA14, confirmed at full resolution) | sonnet, small | One row style in the list; UR7 |
| L9 | Motion tokens (UIA10, DL10) and tooltip/popover frame tokens (DL2) | sonnet, small | Tokens plus guard, like UR66–UR68 |
| L10 | Cascade layers to retire the `!important` stack (UIA9) once L6/L7 shrink it | design-level, large | `!important` count falls; geometry harness shows no change |

## Round 3, 2026-10-26: a stable screen, item inspection, hover and reports

Weibao, with two screenshots of the item details view (desktop Electron, Village):
"Consider the Ui negatives of changing the netire screen when clicking into
certain menus like more actions, we should figure out how to make ui more
intuitive and not shifting and more? ... for the reports section it still doesnt
look as good? And what happened to hover items?"

Codes UIS1-UIS14 (prefix unused before this round). Findings are from source
reading and the screenshots; nothing here was exercised in a rebuilt browser.

### Findings

| Code | Finding | Evidence | Status |
| --- | --- | --- | --- |
| UIS1 | **Correction, 2026-10-26: selection and expansion are separate.** The earlier claim that `defaultDock:'center'` proves a click swaps the place view was incorrect. Baseline browser selection keeps the place/actions/work; More actions explicitly expands `shell-detail`, replacing the center task and adding a back bar. The rules already say otherwise: UR41 lets a short item inspection anchor to the item, and UR43 says a fuller view "is available when useful, not the automatic default for item interaction". | `src/proto23_shell.js:258`; screenshot 2 | Rule bypassed in code; fix is implementation, not a new rule |
| UIS2 | **Hover previews stop once any item is selected.** The inventory hover preview returns early while a selected item's detail panel is rendered, and only runs when `main_content` is in parity mode `r3`. After one click, hovering other items shows nothing until the detail closes. Likely the "what happened to hover items" report. | `src/proto23_shell.js:196-198` | Inferred from source; reproduce first (UR15) |
| UIS3 | **An empty slot offers item commands.** The feet slot shows "Empty slot / Equipped · feet" with Take off, Full item and More actions. | Screenshots 1 and 2 | Defect |
| UIS4 | **Correction, 2026-10-26: the screenshots show different disclosure states.** One shows Full item and closed More actions; the other shows expanded commands. The two captures do not establish width as the cause. Reproduce the same subject, revision and disclosure state at each target before attributing a width defect. | Screenshots 1 vs 2 | Width cause unverified; same-subject commands tested in round 4 |
| UIS5 | **Reports read as raw log text.** Bracketed date dividers, literal asterisks ("*You hear some rustling*"), music-note glyphs, every name underlined as a link, identical lines not condensed, no category color, and a tall empty area below. The combat log already has a cleaner grammar (UI R22: letters, dealt/taken wording, quieter misses, xN). | Screenshot 2, Reports panel | Presentation gap; UR64 (condense) and UR47/UR48 (hover subjects, event vs subject now) apply |

### ACCOUNT FOR NOW

| Code | Constraint for the next UI slice |
| --- | --- |
| UIS6 | **Opening or closing an inspector keeps the frame still.** Default: inspecting an item, person, effect or log line does not move or replace another region; the place view, work line and inventory keep their boxes. Measure it with `scripts/playtest/ui_geometry_snapshot.mjs`: region rectangles before and after open/close match, except the inspector's own. Center replacement stays for large tasks the player chose (UR41), through the one controller (UR9). |
| UIS7 | **Hover peeks, click pins in the same place.** Hover shows the quick preview anchored beside the item; click pins that same box with its commands, keyboard focus and Esc (UR43). A pinned inspector does not disable hover on other rows; a second hover may show beside it or replace it, but never nothing. "Full item" opens the larger view only on request. |
| UIS8 | **Commands only for the subject that exists.** An empty slot shows what can go there (fitting items held, or "nothing held fits") instead of Take off. Same rule for empty stations, vacant people slots and finished jobs. |
| UIS9 | **One command set per subject, whatever the width.** Width may fold commands into More actions, but the same commands exist at every width. |
| UIS10 | **Coordinate with the live tooltip lane.** Another session is implementing UR70-UR75 descriptions in the same inspection code (`src/proto23_shell.js`, `src/display.js`) and adopting them into the normal app. UIS1, UIS2 and UIS7 wait for that lane to land or are given to it, to avoid two writers in one file. |

### LATER / DELEGATE (ranked)

| Rank | Item | Level, effort | Done check |
| --- | --- | --- | --- |
| UIS11 | Item inspection anchored to the item (UIS1, UIS6, UIS7, UIS8): dock Item details beside the inventory by default, hover-then-pin in one box, empty-slot contents, "Full item" for the center view | Sonnet, medium; after the tooltip lane lands; worktree | Rebuilt 1920×1080 and 1536×864 at 14/21 px: clicking an item leaves the place view's rectangle unchanged (geometry snapshot), hover works with an item pinned, empty slot shows fitting items, Save/reload keeps selection behavior sane |
| UIS12 | Reports grammar pass (UIS5): quiet date dividers, no literal asterisks, links shown on hover/focus, condensed repeats with xN, category color from tokens, reuse of the combat-log grammar | Sonnet, medium; mockup workbench first if layout is unsettled | Before/after screenshots at the target viewport; repeated lines condensed; no change to stored log data (presentation only) |
| UIS13 | Reproduce UIS2 first: hover an item, click it, hover another; and in a non-r3 parity mode | Haiku or sonnet with the browser, small | A short note with the observed behavior and parity mode, before UIS11 changes it |
| UIS14 | A stability check in the geometry harness: open and close each inspector type and fail if any other region's box moves more than a pixel | Sonnet, small to medium | Fails on today's item-detail center swap; passes after UIS11 |

Verification: source lines read directly; screenshot observations as shown;
no build, browser run or code change in this round.

## Round 4, 2026-10-26: broader ordinary-play interactions

Weibao corrected the scope: “The Ui problems is broader than just item inspection
but alot of other stuff too.” [Consideration U9–U13 and revised P1](RULES_CONSIDERATION_2026-10-26.md#broader-ui-correction-item-inspection-is-one-symptom)
and [execution/checkpoint](../gm/dispatch/broader-ui-follow-through-2026-10-26/CHECKPOINT.md)
own the finite eight-family map, selected delivery, actual inputs and check results.
This is implementation authority from that request, not acceptance of every audit proposal.

### Corrections to round 3 proposals

- UIS6/UIS14: preserve the current task, selected subject, pending choices,
  work/log access, focus, scroll and return. Universal one-pixel immobility is
  superseded. Full views and UR69 may deliberately reflow.
- UIS7: focus/hover can preview, explicit selection pins, a command commits.
  Another preview must not replace a pending choice. If an inspector contains
  keyboard focus, preserve its controls; moving focus to another row offers its
  preview. There is no requirement to cover controls with a second box.
- UIS10/UIS11: the description implementation/adoption is recorded in
  [its receipt](../reviews/ui-descriptions-2026-10-25/REPORT.md). Live file-path
  custody is checked again for this delivery. A new chat does not require a
  worktree (AD41); obsolete tooltip-lane/worktree prerequisites are superseded.

### Delivery and remaining repairs

UIA17: shared view choices previously displayed state such as Name ↑ or All
recipes without visible search/filter purpose. Inventory, Skills, Quests,
Crafting and Reports now use the existing control-box primitive with a visible
purpose and separate current state. The primitive focuses an actually rendered
control and uses the shared minimum control token.

UIA18: center navigation retained scroll/disclosures but did not restore the
invoking keyboard control. The existing owner now restores a connected visible
opener on Back, with the current heading as fallback. No saved-layout schema
changes. Native stop and settlement callbacks remain the existing owner's work.

UIS1–UIS3: More actions remains local; empty slots describe their vacancy and
held fitting gear; focus previews another row without selecting it. Full item
remains deliberate. All-hidden Reports filters explain recovery in the existing
filter panel, retaining history. Verification state is solely the linked receipt.

LATER (proposals, not additional gates): UIS12's longer-run report grammar and
semantically equivalent noncombat repeats need occurrence-time evidence; do not
merge changed outcomes or hide every subject affordance until hover. Specific
service/person departure and late-game work menus retain their existing owners.
The eight-family map records unexamined coverage honestly; sampled journeys do
not certify every interface family. Human review is optional feedback under AD42.

UIA19: the shared list decorator called every subject a stack/item and counted
collapsed skill rows as unmatched. It now counts admitted skill matches
independently of category collapse and uses skills/books/entries for the other
existing consumers. Skill search temporarily reveals matching groups; clearing
it restores the pre-search category state. Unknown skill names remain whatever
the native observer-facing row displays. Inventory retains its stacks/unit count.

UIS5 follow-through: a stronger full-width shell row rule overrode the native
category display variables. The initial control-state assertions missed this;
actual-size screenshot review found visible rows while all filters were off.
The reproduced old build shows two rows; the repair follows the six native
category variables and checks visible rows plus unchanged occurrence history.
This implements truthful filtering, not general event rewriting or repeat merging.

Final round-4 result: [delivered receipt](../gm/dispatch/broader-ui-follow-through-2026-10-26/CHECKPOINT.md),
agent-verified, not human-reviewed. Six desktop/text cases and six native edge
journeys passed on its named immutable bundle. Larger-text floor header
truncation remains for a future density pass; whole-interface completion and
normal-app adoption are not claimed.

## Round 5, 2026-10-26: character, local detail and prototype fidelity

UIC1–UIC13 are noncolliding proposal/finding codes, not new UR rules.
[Owning palette](../THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md#character-audit-round-uic1uic13-2026-10-26);
[full source/browser report](../reviews/UI_CHARACTER_DIRECTION_2026-10-26.md#fresh-audit-and-runnable-comparison-2026-10-26).
Rules: AD6–8/32/34/36/40–42, UR37–38/49/59–69, MW1–7, WPR19–23/27.

- **UIC1–UIC3, ACT NOW:** proposed Gothic/frame/role-color vocabulary, fresh native
  browser evidence and reference mechanisms. Frozen bundle identity and seeded
  prerequisites are in the report. Current interface already has character;
  large saturated fields compete with small local details. Proto23's saved fixed
  coordinates are not a suitable transplant for OOPS's desktop/laptop shells.
- **UIC4–UIC8, ACCOUNT FOR NOW:** explicit module surface homes, observer-safe
  atmosphere, settled craft publication, existing Moss presentation and captured
  competence cues. Trace each producer through its public projection/receipt to
  the visible consumer. Existing session snapshots are not living-place history.
- **UIC9/UIC13, experiment result:** two shared-workbench treatments run and preserve
  fixture state, but Weibao found the mockup less fleshed out than Proto23. Current
  presenters inside a reduced original shell do not represent the full native UI.
  Treat the studies as material sketches; the global direction remains a hypothesis.
  A faithful current-shell comparison is missing, not a mandatory new production gate.
- **UIC10–UIC12, LATER / DELEGATE:** medium four-surface styling, small known-household
  emphasis, then medium craft/atmosphere cadence. Capability, cost, source map and
  observable completion checks are in the report. No runtime dispatch or acceptance.

Verification: native six desktop/text cases per game plus ordinary fixture-backed
commands and household Save/reload; four native effects modes; eight prototype
viewport/text/treatment journeys, shared workbench ten groups; 26 focused existing
tests. Optional private-pack manifest absent from the isolated tree produced 404s;
no page exceptions. Full installed app, every world service, weather/tool/recovery
transitions and native integration of a visual treatment remain unexamined.
Agent-inspected; director feedback on fixture insufficiency retained, no visual
selection. Production runtime was untouched.

UIC14, 2026-10-26: Weibao selected fixing workbench fidelity/freshness and a fresh
separate audit. [MW8](../MOCKUP_SYSTEM.md#standing-rules) now owns distinct source
currency versus visual-fidelity labels and live drift warnings; matching inputs
cannot certify a simplified shell. The visible banner and source/output hash
checks are implemented and tested. [Rerun brief](../reviews/UI_CHARACTER_RERUN_2026-10-26.md)
dispatched to `01a17948-448e-77a2-b895-11128bed5435`; it owns the faithful populated
current-shell comparison. Earlier material sketches remain historical proposals.

## Round 6, 2026-10-26: faithful native character comparison

Codes UIC15–UIC22 extend round 5 without reusing its codes or treating proposals
as accepted direction. [Full source-linked rerun, dispositions and checks](../reviews/UI_CHARACTER_DIRECTION_2026-10-26.md#uic15uic22-faithful-current-shell-rerun-2026-10-26).
Applied AD6–8/32/34/36/42, UR37–38/49/59–69, MW1–8 and WPR4/19–24/27.
Primary 1920×1080, laptop 1536×864, actual 14/21px; mobile deferred.

- **UIC15/UIC21, ACT NOW:** baseline and two runnable treatments use the current
  full shell/controllers, 30 public native inventory entries, actual recipe
  dependencies/costs, equipment, results/Reports and a native homeowner/Moss
  route. Sixty full-size native captures plus three large-text actor captures.
  Twelve native command journeys and four actual effects modes pass. The earlier
  sparse shell no longer stands in for the full-interface comparison.
- **UIC16/UIC17, finding/proposal:** reopen Proto23 source/capture provenance;
  inspect contrasting Kittens, Trimps and Fallen London mechanisms. Recommend
  the existing vivid Gothic frame with stable role colors and locally fitting
  material. Signal is the general proposal, Folio warmth a local proposal.
  None is director-selected, and no universal journal skin is inferred.
- **UIC18/UIC19, ACCOUNT FOR NOW:** exact producer/projection/receipt/presenter/
  consumer traces, subject lifetime, repetition, current versus remembered
  information, four surface reading roles and service-specific materials. The
  existing Moss scene is the cheapest useful O5 source; new crowds/durable
  place memory carry separate simulation/art costs.
- **UIC22, ACT NOW:** default native study, isolated general-builder integration,
  declared runtime graph/copied input/output hashes and live freshness warning.
  A native rebuild alone is not renewed visual acceptance. Simultaneous native
  command mirroring is explicitly unavailable; single-instance Layout switching
  preserves state and the static gallery provides the alongside view.
- **UIC20, LATER / DELEGATE:** ranked four-surface styling, known-household
  emphasis, settled craft tuning, public local atmosphere and deferred durable
  remembrance/crowds. Capability/effort/source map and done checks stay in the
  report. No worker or production implementation is dispatched.

Final native bundle `da32191acbd8786502e439fb4487780517fda9df8aff1e32c943576db10e9675`;
source/output identity matched after packaging; the closing banner correctly
flags subsequent edits to `craft_recipes.js` and `craft_material_fit.js` as stale.
The preserved manifest and screenshots identify the tested snapshot, not those
newer recipe bytes. Native 12 cases, effects
4 cases, extras, freshness 2 tests, shared workbench 10 groups, rules and scoped
syntax/whitespace checks pass. Only expected optional private-pack manifest 404;
no final page exceptions or save-lock/worker errors. Initial mockup startup races
were repaired and their affected evidence superseded; they are not current
production findings. Long policy content and the household scene require scroll
at laptop/large text; every service/world, weather/tool/recovery transition and
installed app remain unexamined. Audit/prototypes are agent-verified, not
human-reviewed; production styling/behavior remains unimplemented.

## Round 7, 2026-10-26: general UI after the parallel wave

Weibao: "Other general UI stuff and more to consider?" Read-only round against
the [M1 route walk](../gm/dispatch/m1-route-walk-2026-10-26/ROUTES.md),
[M2 blocked reasons](../gm/dispatch/m2-blocked-reasons-2026-10-26/CHECKPOINT.md),
[Q18 triage](IDEAS_TRIAGE_2026-10-26.md) P02–P10 and the
[parallel-run outcomes](../reviews/PARALLEL_RUNS_OUTCOMES_2026-10-26.md). Rounds 3–6
(stable frame, inspection, reports, character styling) and Q18 P02–P10 are not
repeated. Desktop first (1920×1080, 1536×864); mobile deferred. Proposals only;
no browser run in this round.

### ACCOUNT FOR NOW

| Code | Evidence and consequence | Default, dial and reason |
| --- | --- | --- |
| UIV1 | **Blocked reasons hide in `title` tooltips.** The M2 fix put reasons in button `title` text; its own record says a player may not see them without hovering. UI_RULES has no rule on native `title` use. Keyboard users and slow hovers get nothing. | Default: a disabled action shows its reason inline or on focus/click in the same pinned box as UR43; `title` may duplicate it, never hold it alone. Dial: very short reasons may sit beside the button. Reason: a reason the player never sees does not explain the block. |
| UIV2 | **Delivered features are hard to find.** Tingen started only through All panels; G2's HP journey starts from generated stock because no earned return route exists. | Default: when a system first becomes reachable in a life, the Journal records where it is and the place view shows its entrance. All panels stays a reference and dev route, not the only way in. Reason: Weibao plays the normal app; unreachable work reads as missing. |
| UIV3 | **Everything under way needs one home.** The wave added timed work (20-minute settles, suspensions, drying, recovery, lessons), and the route walk found a false "nothing else under way" refusal. | Default: one under-way list on the existing work line, each row with time left, what finishes it and what leaving or travel does to it (PC52). Dial: fold to a count when long. Reason: idle play is mostly waiting on clocks the player cannot see. |
| UIV4 | **Preview must match commit.** Route-walk friction #4 (two-step Find work) and G1's open named-method quote/commit parity are the same player promise. | Default: what a preview shows is what commit does; if state changed in between, commit refuses or states the change before charging. Joins G1 I1's runtime fix. Reason: a cost that shifts after you agree feels like a cheat. |
| UIV5 | **The screen should survive save and import.** Route-walk friction #5 saw currency labels and the nearby-people panel change between the live and re-imported view. | Default: the geometry harness (UIS14) also compares visible text before Save and after literal Import on one populated fixture. Reason: persistence checks prove state, not what the player sees. |
| UIV6 | **One known / guessed / unknown grammar.** UR36 covers this for combat only, while assays, forecasts (PC51), drink effects (DRC9) and the material inspector each mark uncertainty their own way. | Default: extend UR36's distinction to every subject with one shared token and wording, under UR74. Reason: the same doubt should look the same everywhere. |
| UIV7 | **UI reviews go stale under live source lanes.** The UI character report's tested build was overtaken by crafting edits the same evening. | Default: schedule UI review after source lanes in the same area have released, and name the inputs that would invalidate it. Reason: a stale screenshot sends styling work after a screen that no longer exists. |

### LATER / DELEGATE (ranked, after LOTM A5)

| Priority | Work | Capability / effort / done check |
| --- | --- | --- |
| First | UIV1 visible blocked reasons, starting with the M2 Mistglass and Tingen buttons. | Sol medium, small. Done: rebuilt 1920×1080 browser shows each reason without hover, and keyboard focus reaches it. |
| Second | UIV4 with G1 I1: quote/commit parity in one book-world route. | Sol medium, medium. Done: changed state between preview and commit yields a stated change or refusal, no silent charge. |
| Third | UIV3 under-way list on the work line. | Sol medium, medium. Done: three concurrent timed jobs show time left and travel consequence; save and import keep them. |
| Fourth | UIV5 text comparison in the geometry harness. | Luna low, small. Done: catches the friction #5 drift on its fixture, or records that it no longer reproduces. |

## Round 8, 2026-10-29: general overhaul options and cleanup

Weibao: "Consider general UI overhauls and more that we can do to improve in
general." Proposals only; none of it has Weibao's yes and no `src/` file changed.
Builds on the [UI coverage plan](../gm/dispatch/ui-coverage-2026-10-27/PLAN.md)
(homes fixed, eight shared shapes, B1-B5, proposed UR76-UR82) and does not repeat
UIV1-UIV7 or Q18 P02-P10.

Evidence (UR45): a native interaction on a populated localhost test save, this
checkout's working-tree `dist/bundle.js` (sha256 `7c0bcaf9792b`, carrying another
session's uncommitted rebuild), 1920×1080 only, panel rectangles measured by script;
a fresh hero through the game MCP; the 10-27 Tingen evidence PNG. The MacBook size,
1536×864 and 21 px text were not checked. Not the frozen `v0.6-948bd45d09cd` app.

### Findings

| Code | Evidence and consequence | Default, dial and reason |
| --- | --- | --- |
| UIW1 | **Developer status leaks into player text.** "(a proposal)" ends player rows in `src/book_world_lotm_merit.js:28`, `book_world_lotm_bench.js:41`, `book_world_lotm_ritual.js:48-56` and `ritual_conditions.js:97`; Settings shows "(proposal, off by default)" and "Assignments and prices are proposals". | Default: proposal status is a badge in the Authoring context, never in player strings (UR73). Dial: the Authoring toggle shows it. Reason: the player reads it as the world being unfinished. |
| UIW2 | **Panel sprawl behind the nav.** 83 registered panels, 76 hidden but mounted (about 9,700 DOM nodes), 56 entries in "All panels…", with near-duplicates (Projects ×2, Condition ×2; Inventory, Belongings, Inventory & combat view, Inventory tools; Stats & equipment, Character & preparation). UR77 budgets routes, not panels. | Default: the list groups entries under their home route, drops duplicates and dev-only panels, and hidden panels mount on first open. Dial: Authoring shows the full list. Reason: the escape hatch has become a second, flat navigation. |
| UIW3 | **Dev controls sit in the player strip.** Authoring, Layout and the density toggle share the top strip with player routes. | Default: they move under Settings → Layout, with Authoring behind a dev flag. Reason: UR50, chrome earns space through a player need. |
| UIW4 | **"Unavailable" reads as broken.** Tingen's header shows "Local weather unavailable" and "Local date unavailable". | Default: an in-world line or the field hidden with a reason, through the UF2 header chips. Reason: a missing reading should look like the world, not a bug. |
| UIW5 | **Blocked reasons are generic.** The Tingen night watch says "The required knowledge, means or circumstances are missing." UIV1 makes reasons visible; this makes them specific. | Default: name the missing thing and where to get it, from the eligibility guard's own result. Folds into B3. Reason: a reason that names nothing does not help the next move. |
| UIW6 | **Service views become documents.** The Tingen workroom center is a long page of pathway, clearance and merit prose, with actions mid-text and the scene's main move below the fold. | Default: the service view uses the scene-card shape: status line, actions with costs, then a "Rules here" disclosure (UR42, UR63). Dial: a reference-heavy place may open on its reference tab. Reason: the player came to act. |
| UIW7 | **Back label may name a panel, not a place.** The Tingen evidence shows "← Appearance". Not reproduced this round. | Default: reproduce first (UR15); if real, UR22's history stack names the real previous place. |
| UIW8 | **One 7.6 MB bundle.** 902 `src` files ship in one `dist/bundle.js`. Load time not measured. | Default: measure first load and tick cost on the populated save; if load passes about 2 s, book worlds load on first entry. Reason: every world added makes every session start slower. |
| UIW9 | **The MCP screenshot shows a different screen.** The Electron mirror renders the classic grid (empty bands at bottom and right at 1920×1080) while the live build renders the workspace filling the viewport. Logged with `game_report_limit`. | Default: UI claims use the browser route until the mirror renders the live layout. Reason: a wrong picture sends work at a screen nobody plays. |

### Overhaul options

| Code | Option | Verdict |
| --- | --- | --- |
| O1 | **Finish the shared shapes, then clean.** Build coverage-plan B1-B5 (note, ledger, choice row, timeline, policy row), with UIW1-UIW6 as small riders. | Recommended default. It is already planned, needs no new homes, and B1's return note is the idle-game payoff. |
| O2 | **Grouped navigation.** Replace the flat route strip and the 56-entry list with about six task hubs (You, Belongings, People, Work and time, World, System) and a Ctrl+K jump (UR28). | Do after O1, when B2/B4 have settled what Ledger and Journal hold; doing it first would regroup tabs that are about to move. |
| O3 | **A day page** (unusual). Each in-game morning, or a return after absence, opens one threshold screen: what is due, what changed, who wants you, one suggested next move. It reads the note and timeline shapes. | Worth it as O1's capstone after B1 and B4; it turns the clocks the player cannot see into a reason to come back. |
| O4 | **Diegetic scene navigation** (unusual). Places and people in the center become the main navigation; panels open as cards on the scene. | Not now: it reopens UR9/UR12's settled baseline at rewrite cost for a feel change. Keep as a palette idea for one book world. |

Rejected in a line: a framework rewrite (AR forbids it, no player gain), and a reskin alone (fixes look, not flow).

### ACT NOW (done this round)

- Findings and options saved here; MCP mirror limit logged.

### LATER / DELEGATE (ranked)

| Priority | Work | Level / effort / done check |
| --- | --- | --- |
| First | UIW1 strip proposal text from player strings into the Authoring badge. | Haiku low or Luna low, small. Done: no player-visible string ends in "proposal"; the Authoring toggle still shows status. |
| Second | Coverage-plan B1 return note (its own done check), then B3 with UIW5. | Sonnet medium, one session each. Done: as the plan states, plus every blocked Tingen and Village option names what is missing. |
| Third | UIW2 + UIW3: group and dedupe the panel list, lazy-mount hidden panels, move dev controls. | Sonnet medium, one session. Done: list grouped by route with no duplicate names; DOM node count on the populated save drops; saved layouts and pins load unchanged (UR17). |
| Fourth | UIW6 scene-card shape for the Tingen workroom. | Sonnet medium, half a session. Done: at 1920×1080 the main action and its cost show without scrolling. |
| Fifth | UIW8 load measurement; UIW4 and UIW7 checks. | Luna low, small. Done: numbers recorded; UIW7 reproduced or closed. |

O2 and O3 wait until B2 and B4 land.

## Round 9, 2026-10-29: the rulebook itself, reconciliation and improvement

Weibao: "Consider UI rules and then reconciliation and improvement and more?
more to consider?" Read-only round over [UI_RULES](../UI_RULES.md), the proposed
UR76-UR82 in the [coverage plan](../gm/dispatch/ui-coverage-2026-10-27/PLAN.md#8-proposed-standing-rules-proposed-2026-10-27-awaiting-weibaos-yes),
the [rules index](../RULES_INDEX.md) rows for UI, the check scripts and round 8.
Proposals only; no rule text changed.

### Findings

| Code | Evidence and consequence | Default, dial and reason |
| --- | --- | --- |
| UIX1 | **Too long to apply, ordered by date.** 72 rule rows plus routing prose, 6,840 words. Rows run UR70-UR75, UR1-UR13, UR65-UR68, UR14-UR17, UR21-UR33, UR69, UR34-UR64; UR18-UR20 are bullets, not rows. An agent touching one button cannot tell which ten matter. | Default: keep every code and its text, add a one-screen **UI checklist** at the top (about twelve rules most often missed, grouped place / build / check), and order the reference body by task with a dated changelog below. Dial: a lane brief may cite the checklist alone for a small fix. Reason: GROUND_RULES found that rules nobody can hold in mind recur as mistakes. |
| UIX2 | **Few rules have a check.** Just UR9, UR11, UR12, UR18, UR47 and UR65-UR68 appear in `scripts/` or `tests/`. GROUND_RULES' own lesson is that prose rules without a check recur. Round 8's UIW1 (dev words in player text) is a UR73 slip no check caught. | Default: add checks to existing owners, ranked by how often the mistake recurs: UR73 dev-term lint in `check_descriptions.mjs` (proposal, seam, stored field, adapter), UR25 page-scroll and UR14 back-label in `check_desktop.mjs`, UR77 counts as a test once he says yes. Dial: a rule about taste stays prose. Reason: a check is cheaper than the next audit round. |
| UIX3 | **"Proposal" means two things on screen.** UR2 sends unaccepted *features* to the Projects drawer, yet LOTM rows on the main surface say "(a proposal)" about their *numbers* (pay, prices, odds). Those numbers are tuned defaults, which LSD425-LSD440 already treats as readable numbers with revisions. | Default: a tuned number ships as a plain number; its revision history lives in the Authoring view. UR2 applies to features, not to values inside an accepted surface (same line as proposed UR78). Reason: resolves round 8 UIW1 from existing authority without a new rule. |
| UIX4 | **Proposed rules and defaults pile up undecided.** UR76-UR82 (10-27), UIV1-UIV7 (10-26), PRF1-PRF8 and the round 8 defaults all sit as proposals; the index still says UR1-UR75. Lanes cite them anyway, so they act as half-rules. | Default: one short acceptance packet listing each proposed UI rule with a one-line "what changes if accepted", sent to Weibao as one yes/edit list (build order and acceptance are his calls; no either/or). Until then briefs cite them as "proposed". Reason: half-rules drift faster than either state. |
| UIX5 | **Absolute wording in a defaults house.** Rule titles use never/no/only in four rows (UR6 tokens, UR7, UR8, UR13), against AD5's default, dial and reason. For code hygiene (tokens, own your node) a hard default is right. | Default: keep the hard default and add its dial in one clause (for example UR6: an exception needs a token added first). Reason: same meaning, consistent with the house rule, and the blanket-claim sweep stops flagging it. |
| UIX6 | **Rules cover screens, not budgets of what is mounted.** Round 8 found 83 panels, 76 hidden but mounted. UR3 budgets Local actions and proposed UR77 budgets routes, regions and center modes; nothing budgets panels, the All panels list or render cost. | Default: extend proposed UR77 with a panel count by home and a mount-on-first-open default; record DOM size and first-load time on the populated fixture as a watched number, not a gate. Reason: every system adds a panel; nothing makes one leave. |
| UIX7 | **Evidence names the build but not which app.** Weibao plays the frozen `v0.6-948bd45d09cd` app; UI rules are proven on dev builds, and the MCP Electron mirror shows a third layout (round 8 UIW9). UR45 covers how state was reached, not which app. | Default: UR45 evidence also names the app (dev build hash, frozen app, or mirror) and says whether the change has reached the app he plays. Reason: "fixed" means little if his app still shows the old screen. |
| UIX8 | **The lead's life will add panels fastest.** Current focus is cast lives, with LSD design up to LSD440 and runtime lanes (MR2 memory effects) landing now. Proposed UR76 (fill the UI contract first) is what keeps those from each inventing a screen, but it is not accepted. | Default: cast-lives runtime briefs fill the UR76 contract as a proposal now (it costs a paragraph) and cite which existing home and shape they use. Reason: the main line should not be where the sprawl comes from. |
| UIX9 | **Description rules and the description inventory are separate.** UR70-UR75 own description quality; `check_descriptions.mjs` inventories missing descriptions only for registries, not UI strings built in `*_ui.js` and row files like `book_world_lotm_rows.js`. | Default: the inventory adds UI row strings from book-world row files as a second source, reported, not failing. Reason: the strings players read most are outside its view. |

### ACCOUNT FOR NOW

- UIX3 answers round 8 UIW1's design question: the fix is removing the label, not moving rows to the drawer.
- Briefs touching UI cite UR76-UR82 and UIV codes as "proposed" until UIX4's packet is answered.
- Evidence lines name the app (UIX7) starting with the next UI receipt.

### LATER / DELEGATE (ranked)

| Priority | Work | Level / effort / done check |
| --- | --- | --- |
| First | UIX4 acceptance packet for UR76-UR82, UIV1-UIV7 and UIX3, UIX5, UIX6 wording. | Sonnet low, small, docs. Done: one page, each item with its effect on a yes; nothing marked as his decision without his words. |
| Second | UIX2 dev-term lint in `check_descriptions.mjs`, report mode, then fix the hits (round 8 UIW1). | Sonnet low, small. Done: lint lists the six LOTM hits and the Settings lines; after the fix it lists none; `npm test` passes. |
| Third | UIX1 checklist and task ordering of UI_RULES, codes unchanged, plus RULES_INDEX row. | Sonnet medium, half a session. Done: every UR code still resolves; `check:rules` passes; checklist fits one screen. |
| Fourth | UIX2 page-scroll and back-label checks in `check_desktop.mjs`. | Sonnet medium, small. Done: fails on a seeded page-scroll fixture, passes on the populated save at 1920×1080. |
| Fifth | UIX6 mounted-panel and load numbers recorded on the populated fixture. | Luna low, small. Done: numbers in the checkpoint with bundle hash. |

### Round 9 follow-through, 2026-10-29

Weibao: "lint fix and packet".

- UIX2 first slice: `scripts/check_descriptions.mjs` reports status labels in `src/` string literals (qualifier forms; "Name (proposal)" feature titles stay, for the reason UR2 gives) and flags them in registry descriptions; regression in `tests/check_descriptions.test.js`.
- Round 8 UIW1: 16 labels removed across LOTM rows, ritual odds, merit, Primordial hall, HP school, the native-growth line, the gust toggle and formula gaps, plus one nested label in `field_ui.js` the lint cannot see. One stays: `book_shadow_slave_life.js:71`, whose revision-two command contract is hash-pinned for save compatibility; changing it needs a revision three.
- UIX4: [acceptance packet](UI_RULES_ACCEPTANCE_PACKET_2026-10-29.md), P1-P16, waiting on Weibao.
- Checks: focused tests 87/87 after the revert and LOTM-related 290/290; build `fb5065ed3b00`; fresh `127.0.0.1` origin shows no labels in the DOM and no console errors. The Tingen merit and ritual rows were not reached in the browser (implemented-unverified for those rows; string and replay tests cover them). Full `npm test` not run; nothing committed.

## Round 10, 2026-10-29: long-term UI for the lead's run, other seats, modularity and representations

Weibao: "long term required UI improvements based on all the gaps and for
implementing the systems for bringiing things to parity for book main character
run, and future non main character runs?" then "modularity stuff and more? consider
all the future scenes and representations that we havent even considered yet, from
visually representing rituals and more? more to consider?"

Proposals only. Sources: a read-only sonnet pass over
[LEAD_LIFE_SYSTEMS_DESIGN](../gm/dispatch/protagonist-life-2026-10-27/LEAD_LIFE_SYSTEMS_DESIGN.md),
the [cast-lives card](../gm/dispatch/protagonist-life-2026-10-27/CAST_LIVES_CARD.md) and lane checkpoints
(no lane has rebuilt 1920×1080 evidence for its UI yet; "has UI" below means source exists);
the [coverage plan](../gm/dispatch/ui-coverage-2026-10-27/PLAN.md) homes and primitives (K1-K8, M1-M15);
the [representation ladder](../UI_IDENTITY_AND_REPRESENTATION_CONSIDERATIONS_2026-10-14.md) RP1-RP6;
the [scale palette](../UI_AT_SCALE_CONSIDERATIONS_2026-10-14.md); SUI1-SUI19 and RPT1-RPT12 (binding defaults).
Today the game draws almost everything as DOM text: 52 `definePanel` panels, canvas in 8 files and
SVG in 3 (particles, journal, battle hosts), and no shared way to draw a figure.

### A. What the lead's run needs on screen (parity)

Ranked by how many lead steps each unblocks. "Home" names the coverage-plan home or primitive.

| Code | Need | Today | Home |
| --- | --- | --- | --- |
| LTU1 | **Quoted choice rows everywhere**: time, cost, risk and exposure in words, a blocked reason naming what is missing, untaken canon options locked as "Not how it happened" (SUI5, SUI6, LSD9, LSD103) | Partial: LOTM Actions show cost and blocked text; risk and exposure not quoted | K1 choice row (coverage B3) |
| LTU2 | **Scene card and upcoming strip**: one card at a time, stakes line first, people as links, closes pointing onward (SUI2, SUI7-SUI10, SUI13) | None; canon steps go to Reports for now | K5 scene card, K4 timeline |
| LTU3 | **Return digest and result notes**: "While you were away" grouped by person; check results say what happened, why, what it cost and who saw (RPT6, LSD94) | Reports ledger exists; digest and result note do not | K2 note (coverage B1) |
| LTU4 | **Knowledge home**: dated knowledge lines, inner inferences, his intentions, open matters (LSD116, LSD118, LSD264) | Partial in the place panel | Journal → Knows (M13) |
| LTU5 | **Person view that remembers**: usual place, why they act as they do, memory and provenance, traits learned by seeing (LSD108, LSD145, LSD399) | `people_ui.js` and `relationship_view.js` exist; memory not wired (MR2 running) | K6 list and inspector (M6) |
| LTU6 | **Owed and due**: favours, debts, loyalty, deadlines (LSD409) | `obligations_ledger.js` not wired | Ledger → Owed and Due (coverage B2, B4) |
| LTU7 | **Fight situation card**: intent shown, lethal telegraphed, odds in words, text-first tempo (LSD91, LSD93, LSD294, LSD384) | None beyond native combat | K5 inside the fight center mode (M15) |
| LTU8 | **Run mode and seat header**: canon or open run, seat, a legend that reopens mid-life (LSD105; reader gap G1) | Partial: header wording exists, start disabled until B1 lands | Header chip (M12) plus threshold screen (ST3) |
| LTU9 | **Coverage and folds**: a folded action lists the book steps it stands for; a slice is UI-complete when no step is unmapped (SUI17, SUI19) | None | K1 row detail, plus a dev coverage view |
| LTU10 | **Divergence and pull**, opt-in: what now differs from the book, and fate or pull traces where a world has them (LSD223, LSD240; reader gaps G3, G5) | None | Ledger diff mode (K3) behind the canon overlay (SUI4) |

### B. What changes for other seats

| Code | Default, dial and reason |
| --- | --- |
| LTU11 | **Every surface reads the seat, never "is the lead"** (LSD226). Header labels, names (RPT4), Knows and locked rows come from the seat's own knowledge. Reason: a bystander must not see the lead's facts. Check: each surface's test runs once with a non-lead fixture. |
| LTU12 | **Failure is a first-class row.** Refused, caught, short of money and too late each get a choice-row state and a note (LSD227). Reason: the canon run tests success paths; other seats live in the rest. |
| LTU13 | **Thin lives lean on montage.** A seat with mostly `fill` days shows day cards and policies more than step controls (LSD128, section C of the lead-life rules); locked rows collapse to a count. Dial: day zoom. |
| LTU14 | **Taking a seat is a threshold screen** that shows what you know, what you own, whom you know and which book facts now lock for you (LSD129). |
| LTU15 | **Loop and calendar worlds get a reset marker and carry view**: what persists across a loop (Mother of Learning) and a school-year calendar (HP) in the header and Branches (M10). |

### C. Modularity: shapes and renderers, not screens

| Code | Proposal | Reason and check |
| --- | --- | --- |
| MDL1 | **Representation registry.** A subject kind (ritual, person, place, item, body, timeline, contract) registers renderers on a ladder: line → row → card → figure → scene. A surface asks for "this subject at card size" and gets the world's renderer or the shared default. Every renderer has a text form. | One subject looks the same everywhere (UR74); a new world adds renderers, not screens. Check: a registry test fails when a kind has no line or row renderer. |
| MDL2 | **One figure primitive.** A small declarative spec (nodes, rings, slots, tracks, edges, labels, states) drawn once in SVG with glyph text and tokens. Rituals, relationship webs, meridians, district maps, timelines and investigation boards are all data for it. | The cheapest route to visual rituals without a renderer per feature. Check: three different kinds render from fixtures with no kind-specific drawing code. |
| MDL3 | **Scene card as slots.** Header, stakes line, people chips, options with quotes, result, onward line. By default a scene kind fills slots instead of building DOM (SUI1-SUI13). | New scene kinds cost data, not UI. |
| MDL4 | **Seat-parametric projection.** Every renderer takes the observer and seat and reads the player projection (AR8, proposed UR80). | Non-lead runs reuse every renderer unchanged. |
| MDL5 | **Lenses as layers.** Spirit sight, divination, disguise and canon overlay add or filter a layer over existing renderers with their cost and duration shown; none reads world truth. | Perception powers do not each need a screen. |
| MDL6 | **World skin as tokens.** A world sets palette, frame, glyph set and figure style through tokens (UR6) by default, rather than per-feature CSS. Luminous Gothic, Neutral, Arcane and Workshop are already the start of this. | Book worlds can feel distinct at no code cost. |
| MDL7 | **Mount on open and a representation gallery.** Hidden panels mount on first open (round 8 UIW2); `ui-preview.html` with `src/ui/preview/fixtures.js` grows into a gallery showing every renderer and figure at 1920×1080 from fixtures. | The fast way to see a representation before a lane wires it, and the visual regression baseline. |
| MDL8 | **Effects bound to subjects, honest and capped.** Ritual glow, strain flicker or madness tint attach to a subject's settled state by default, do not move controls or hide facts, and obey effects off and reduced (UR38, UR62). | Visual intensity without breaking reading or saves. |

### D. Representations not yet designed (palette, pick per world)

Each row gives the cheapest form and the capable form on the primitives above. Idea rows, not specs.

| Code | Scene or subject | Cheapest | Capable |
| --- | --- | --- | --- |
| RPX1 | **Rituals** | Step list with components, timing window and risk line | MDL2 circle: rings for timing (hour, moon), slots for placed components that fill as you place them, chant lines on a track, risk as a ring colour with words; failure shows which slot or step broke |
| RPX2 | **Brewing and making sequences** | Ordered steps with heat and time | Figure track with heat band, add points and a live "late adds heat" marker; same spec as RPX1 |
| RPX3 | **Spellcasting and gestures** (HP wandwork, incantations) | Named spell with success words | Small glyph stroke figure and timing pip; practice shows drift |
| RPX4 | **Cultivation and body paths** | Realm and stage line | Meridian or channel figure; blockages and breakthroughs as node states |
| RPX5 | **Advancement ladders** (sequences, realms, ranks) | Ladder text (exists for Tingen) | Vertical track with known, rumoured and unknown rungs (UIV6 grammar), digestion as fill |
| RPX6 | **Divination results** | Result line with confidence | Fragment cards (images as our words), dowsing needle figure, dream as a short sequence of scene fragments marked "seen in a dream" |
| RPX7 | **Spirit or second sight** | Extra lines on the place view | MDL5 lens tinting people and things with auras and labels, with a cost meter |
| RPX8 | **Dreams, visions and memory scenes** | A journal entry | A scene card in a distinct skin (MDL6), with "remembered" provenance |
| RPX9 | **Altered states** (loss of control, intoxication, poison, fear) | Condition line | MDL8 effects: tinted frames, an intruding log voice marked as such, unreliable labels flagged as unreliable; effects-off shows the words alone |
| RPX10 | **Disguise and identity** (Polyjuice, masks, secret roles) | "Appearing as" line | You panel in a second body view, with who sees which face (seat projection) |
| RPX11 | **Relationship web and who knows what** | People list with lines | MDL2 web: you at the centre, edges for trust, debt and what each knows about you (limited to what you know) |
| RPX12 | **Investigation board** | Clue list | Board figure: clues, inferences, open questions, links drawn by the player or by inference acts |
| RPX13 | **Documents** (letters, newspapers, contracts, notices) | Text block | Document card with paper skin, sender, date, seal state; contracts show clauses and who holds which copy (our wording, RPT10) |
| RPX14 | **Maps and routes** | Exit buttons and district links | District figure with people's usual places, "on the way" meetings (SUI15) and follow mode (SUI16) |
| RPX15 | **Time** | Clock chip and calendar list | Day montage strip, week calendar with windows, loop reset view, years-passing summary |
| RPX16 | **Duels, chases and multi-party fights** | Combat log | Situation card with positions, intent arrows and tempo; chase as a track with distance |
| RPX17 | **Crowds, rumours and spreading news** | Rumour lines | Ripple figure: who heard, from whom, how far it travelled |
| RPX18 | **Institutions and standing** | Rank and merit lines | Org figure: your place, who above can clear what (clearance grades exist in Tingen) |
| RPX19 | **Chronicle of a life** | Journal list | Life timeline figure for replay and the "story so far" recap at a return |
| RPX20 | **Crossing and transmigration** | Threshold text | Threshold screen with a carry list: what crosses, what is held, what pauses (WER rules) |

### ACCOUNT FOR NOW

- **The glow is an Appearance profile, and the default is Neutral.** Weibao asked for glow across the UI on 2026-10-20 ([direction](../USER_VISION.md#typography-component-styling-and-glow-2026-10-20)); the TSG receipt delivered it as an explicit "Luminous Gothic draft" in Appearance, while new and reset profiles start on Neutral (`src/customization_profiles.js:14`). Verified 2026-10-29 on bundle `fb5065ed3b00`, fresh `127.0.0.1` origin: before, the You panel had no glow shadow and theme `neutral`; after "Luminous Gothic draft" → "Apply and save", theme `luminous` and the glow shadow return. A read-only second tab refuses the apply ("profile changes require the active save owner"). Whether Luminous becomes the default for unedited profiles is his call; explicit Appearance choices stay as they are.
- New lead-life UI uses the coverage homes (LTU1-LTU10) and fills the UR76 contract as a proposal (round 9 UIX8).
- No new renderer is built per feature before MDL1-MDL3 exist; until then, cheapest forms in the RPX table.

### LATER / DELEGATE (ranked)

| Priority | Work | Level / effort / done check |
| --- | --- | --- |
| First | Coverage B1 note and B3 choice row, shaped as LTU3 and LTU1 for the lead's run. | Sonnet medium, one session each. Done: in the be seat, a blocked step names what is missing and a 12 h absence shows a per-person digest, at 1920×1080. |
| Second | MDL3 scene card slots and LTU2 upcoming strip, with one LOTM choice scene. | Sonnet medium, one session. Done: two scene kinds from data, one card at a time, onward line with quoted travel. |
| Third | MDL2 figure primitive with RPX1 ritual circle and RPX11 web from fixtures in the MDL7 gallery. | Sonnet medium, one session. Done: both render from specs with no kind-specific drawing; text form matches; effects off keeps the facts. |
| Fourth | MDL1 registry and MDL4 seat projection, proven with a non-lead fixture on LTU4 and LTU5. | Sonnet medium, one session. Done: the same panels show the lead's and a bystander's knowledge correctly. |
| Fifth | LTU6 Owed and Due (coverage B2, B4). | Sonnet medium, one session. Done: as the coverage plan states. |

LTU7-LTU10, LTU13-LTU15, MDL5, MDL6 and RPX2-RPX20 follow as each world's lead run reaches them.

## Round 11, 2026-10-29: Luminous default and refactors to plan for

Weibao: "Sure, but consider other features first, or future considerations? If
major refactors will be needed in the future> making luminous gothic as default?
save accordingly and push". [Direction record](../USER_VISION.md#luminous-gothic-is-the-default-look-2026-10-29).

### What was wrong

The glow lived in an opt-in Appearance profile while new and reset profiles started on Neutral, and the pastel vitals were switched off for any palette that differed from Neutral's, Luminous included (`styles/ui_tokens.css:727-728`). So Neutral had pastel without glow and Luminous had glow without pastel.

### Delivered

- Luminous Gothic is the default; untouched old Neutral saves upgrade once; a `customization_default` save marker keeps a later explicit Neutral (`src/customization_profiles.js`, `src/main.js`). Persistence: additive top-level key, ignored by older builds; customization schema unchanged at 1.
- A theme's own preset palette no longer counts as custom, so Luminous keeps the pastel HP, XP and stamina fills.
- Regression: `tests/presentation_style.test.js` (default, upgrade, edited and multi-profile saves kept).
- Hidden Electron, fresh profile, `app://yairpg`, 1920×1080: new game theme `luminous` with glow and pastel vitals; injected legacy Neutral save upgraded on relaunch; explicit Neutral with the marker kept; zero page errors; no proposal labels in the DOM. Script kept in the session scratchpad; not a repo check.

### Refactors to plan for before they get expensive

Ranked by how much later work they would otherwise have to touch. Proposals.

| Code | Refactor | Why now rather than later | Trigger and cost |
| --- | --- | --- | --- |
| MDL9 | **Seat-aware projection seam** (MDL4, LTU11) | Every panel built against "the player" has to be revisited when non-lead seats arrive; 83 panels today and growing with cast lives | Do the seam before the next lead-life panel; one session, then panels move as touched |
| MDL10 | **Mount on first open** (round 8 UIW2) | Changes panel lifecycle; each new panel written assuming eager mount adds to the retrofit | One session with the layout owner; saved layouts and pins must load unchanged (UR17) |
| MDL11 | **Scene card slots before more hand-built scenes** (MDL3) | LOTM scenes built as bespoke DOM each need rework later | Before the second LOTM choice scene; one session |
| MDL12 | **Appearance precedence: player > world skin > default** (MDL6) | Luminous is now the base; per-world skins will need a clear order so a world never overrides a player's choice, and the custom-palette flag must stay theme-relative | Decide in the first world-skin slice; small |
| MDL13 | **Renderers that work in pop-out windows** | The Electron host has pop-out panels (A3); a renderer that queries the global document breaks there | Rule for MDL1 renderers from the start: render into the node given, no global lookups; costs nothing now |
| MDL14 | **LOTM host to world-neutral host** (LSD141) | UI rows written against LOTM-named state double when Mother of Learning arrives | At the second book's first slice, as planned; UI rows go through the generic choice row (LTU1) meanwhile |
| MDL15 | **Bundle split by world** (round 8 UIW8) | Build and import structure; harder once worlds cross-import | Measure first; split when first load passes about 2 s |
| MDL16 | **Frozen-app adoption as a routine** | Every UI change waits for a manual snapshot swap before Weibao sees it in his app | A one-command "candidate snapshot, hidden check, ask, swap" path; small |

Additive work that needs no refactor and can wait: the figure primitive (MDL2), the representation registry (MDL1) and the RPX palette.

## Round 12, 2026-10-29: what is next, and rules in one place

Weibao: "whats next? other stuff we need to implement? Rules all in one place? more to consider?" Proposals.

### Rules in one place

The [rules index](../RULES_INDEX.md) is already the single front door: 28 registered sets with router rows by task. Its domain rules were consolidated into one [DOMAIN_RULES](../DOMAIN_RULES.md) file earlier, with stubs at the old paths. The gap is sets that still live in dated working documents:

| Code | Finding | Default, dial and reason |
| --- | --- | --- |
| RIX1 | CLR1-CLR13 sit in the cast-lives card; SUI1-SUI19 and RPT1-RPT12 sit inside the dated cast-lives plan; CX1-CX8 sit in a dispatch part doc. Binding defaults in working documents are how SUI and RPT went unrouted from UI work until round 9. | Default: move each into a standing rulebook with codes and wording unchanged and a stub at the old place, as DOMAIN_RULES did: SUI and RPT into a "Scene and report rules" section of UI_RULES, CLR into LEAD_LIFE_RULES, CX into GROUND_RULES. Reason: one home per rule, found by path rules. |
| RIX2 | Nothing checks that a registered code family is reachable from a router row or a path rule. | Default: `check:rules` warns when a register row's codes appear in no router row, and when a register owner lives under `docs/gm/dispatch/`. Dial: warn first, fail later. |
| RIX3 | About 600 registered codes; an agent cannot hold them. | Default: one-screen checklists per area (UI per UIX1, runtime, world passes, lead life), each citing codes; the full books stay reference. |
| RIX4 | Proposed sets (UR76-UR82, PRF, LSD) and binding sets look alike in citations. | Default: the index marks each set binding or proposed in its register row; briefs cite proposed codes with "(proposed)". The UI packet is the first batch to settle. |

### What is next (ranked)

1. **See it in the normal app.** Pushing does not change the Electron app he plays: it serves frozen `v0.6-948bd45d09cd`. Adopting a new snapshot (MDL16) needs his yes; until then Luminous and today's fixes show in dev and the web build, not his app.
2. **Answer the UI packet** (P1-P16), which turns the coverage plan's shapes into rules.
3. **Return note and choice rows** (coverage B1, B3; LTU3, LTU1), first in the lead's be seat.
4. **Seat projection seam** (MDL9) before the next lead-life panel, then scene card slots (MDL11).
5. **Rules moves RIX1-RIX2**, docs and a check, one small session.

Also waiting: the other lane's uncommitted work in the shared checkout fails 45 tests (`Invalid game calendar for recurring service.`, `src/world_rhythm.js:8`); they pass on clean HEAD and with this session's changes alone, so they belong to that lane (CLR13).
