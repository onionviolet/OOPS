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

Dispatched 2026-10-29: MDL9, MDL3/MDL11, MDL2 with MDL7, RIX1-RIX2 and MDL16 run as lanes R1-R5 of the [UI refactor wave](../gm/dispatch/ui-refactor-wave-2026-10-29/PLAN.md); MDL10 waits for the UI freeze fix.

## Round 13, 2026-10-30: visual distinctiveness and flair

Weibao: "Some stuff should have more visual distinctiveness/flair, rather than just being circles, but that is a long term fleshing out thing, thoughts? /more-to-consider". Proposals. Builds on round 10's figure primitive (MDL2), world skins (MDL6), effects rules (MDL8) and round 2 brief items 13, 18 and 20.

### Findings

| Code | Finding | Default, dial and reason |
| --- | --- | --- |
| FLA1 | **Sameness comes from one drawing vocabulary, not from circles.** Every figure today is lines, rings and dots in theme colours, so a ritual, a family and a debt look like cousins. | Default: separate meaning from look. Specs carry semantic roles; a **motif layer** maps role to shape, ornament, texture, symbol and motion. Dial: per world, per subject kind, per player profile. Reason: flair becomes a data pack, so adding it later never touches adapters, tests or text forms. |
| FLA2 | **Distinctiveness should follow the world and the subject.** A Victorian occult city, a school of magic, a cultivation sect and a frontier village each have a material: brass and ink and tarot cards; parchment and house colours; ink wash and jade; rough wood and chalk. | Default: one motif pack per world (frame, line, ornament, texture, glyph set, motion signature) plus per-subject accents (seals for contracts, thread for relationships, flame for rites). Applied through tokens and an SVG symbol sprite, not per-feature CSS (UR6). |
| FLA3 | **Flair must not cost reading.** Ornament competes with facts; texture lowers contrast; motion distracts. | Default: motifs stay off the data layer (labels, values, states keep their contrast and words, UR37, UR60); textures sit behind panels; motion follows UR38 and the effects setting; a "plain" motif is always one setting away. |
| FLA4 | **Assets need a source and a budget.** Hand-drawn SVG symbols are cheap and original; raster textures and illustrations cost bundle size and need a provenance decision. | Default: start with code-drawn SVG symbols and CSS textures; keep each motif pack under a size budget recorded in the gallery; raster art and any generated imagery wait for Weibao's call on source and style, and stay original (no recreation of another game's look). |
| FLA5 | **Distinct is not inconsistent.** Controls, focus, back bars and blocked reasons must look the same everywhere or players relearn the UI per world. | Default: motifs restyle content surfaces (figures, cards, frames, headers); interaction chrome stays shared (UR7, UR9, UR30). |
| FLA6 | **The gallery is where flair is judged.** | Default: the figure gallery gains a motif switcher (plain, Luminous, each world pack) at 14 and 21 px with effects on and off, so a pack is reviewed before it ships. |

Weibao, later the same hour: "Rather than Motif, we might need restructure/rerepresentations for stuff, so dont feel too attached to current ways? right now would just be drafts unless its really good". So restructuring a representation (a different shape, home or split) comes before decorating it, the motif layer below is one later option rather than the plan, and everything built so far is a draft unless it proves genuinely good (AD45). Brief item 21 carries this to the sessions.

### ACT NOW (done this round)

- Round 2 brief item 20: every session names roles rather than looks in its specs and sketches flair for its feature in two worlds; sent with the brief at 01:30.

### ACCOUNT FOR NOW

- `figure.js` and `scene_card.js` keep role names in their specs and class names (`data-role`), so a motif layer can hook in without API changes.
- Sessions adding layouts (tree, grid, timeline) keep shape choice separate from decoration.

### LATER / DELEGATE (ranked)

| Priority | Work | Level / effort / done check |
| --- | --- | --- |
| First | Motif layer in `figure.js` and `scene_card.js`: role → symbol, line, ornament, motion through tokens and an SVG sprite; plain and Luminous packs. | Opus or Sonnet medium after the representation sessions merge, one session. Done: two packs restyle every gallery fixture with no adapter change; text forms identical; effects off clean. |
| Second | First world pack for the lead's world (brass, ink, tarot-card frames for cards and rites). | Sonnet medium, one session, with Weibao's look at the gallery. Done: pack under its size budget, readable at 21 px. |
| Third | Packs for other worlds as their lead runs land; an art-direction note per world in its world pass. | Per world. |
| Later | Raster textures, illustrated portraits or generated imagery. | Weibao's call on source, style and budget first. |

## Round 14, 2026-10-30: grow from the current look, and a better build

Weibao: "Better implementation and stuff and more? Expanding from our current visual style and more? more to consider?" Proposals. Context: about eighteen representation branches are landing at once, each with its own figures, layouts and gallery fixtures.

### Grow the current style rather than invent new ones

| Code | Finding | Default, dial and reason |
| --- | --- | --- |
| VSX1 | **The game already has a visual grammar, but it lives in tokens and memory, not in one place.** Square frames, hairline rows, gradient fills (the pastel vitals), bitmap Gothic numerals, navy and teal task fields, purple Reports, soft luminous edges, glyph tokens (人, 兽). New figures came out as generic SVG: round nodes, thin strokes, system-looking. | Default: a living style guide page in the gallery that shows the grammar with real tokens (frames, rows, bars, chips, glyph tokens, glow levels, motion set) and the rules for extending it. New representations start from it. Reason: one look that grows, instead of eighteen dialects. |
| VSX2 | **Figures should look native.** | Default: the figure primitive's default skin follows the grammar: square or chamfered nodes where a circle carries no meaning, hairline 1 px lines on whole pixels, gradient fills like the vitals for progress, bitmap Gothic labels at their native strikes, glow from the Luminous tokens. Circles stay where the subject is cyclic. Dial: a world skin (round 13) may change shapes and ornament. |
| VSX3 | **A glyph language extends the identity doc's tokens.** | Default: one glyph per subject kind used across chips, figures and Reports (for example 祭 rite, 血 kin, 道 path, 金 money, 契 contract, 夢 dream), each with an English label beside it on first sight and in the text form. Dial: per world glyph sets. Reason: compact, in keeping with the Gothic face, and recognisable at a glance. |
| VSX4 | **Colour roles, not new hues.** | Default: new subjects map to existing semantic roles (UR37: danger, money, bond, knowledge, progress); a new role needs two consumers. |
| VSX5 | **One motion vocabulary.** | Default: settle, glow-in, pulse and fade, each with a duration token and an effects-off fallback; no feature-specific animation without a role in the set. |

### A better build for the merge

| Code | Finding | Default, dial and reason |
| --- | --- | --- |
| RCT1 | **Eighteen branches will each have touched `figure.js` and `figure_gallery.js`, and several added layouts (tree, grid, timeline).** | Default: merge in a fixed order (shared-primitive changes first, deduped into one layout API with tests, then features), with the coordinator reviewing each layout addition before the next branch rebases onto it. |
| RCT2 | **Each session proved its own slice; nothing proves all representations keep the contract.** | Default: one representation contract test that runs every gallery fixture: text form present and matching, no global document access, tokens only, effects off keeps every fact, 21 px fits, seat-limited fixture shows less, DOM node count under a budget. Reason: one check replaces eighteen promises. |
| RCT3 | **Looks can regress silently.** | Default: headless gallery screenshots at a fixed seed with a pixel-diff baseline, run once at merge (not per lane, to protect machine load). |
| RCT4 | **Read models are converging with the sonnet wave's engine lanes.** | Default: at merge, each adapter that defined its own model either switches to the engine lane's read model or names its switch point (plan section "Read models from the sonnet wave"). |
| RCT5 | **Machine load decides what can be verified.** | Default: full suites and browser captures run under a small shared slot limit, and the integrator runs the full suite once. |

### LATER / DELEGATE (ranked)

| Priority | Work | Level / effort / done check |
| --- | --- | --- |
| First | RCT2 representation contract test over the gallery fixtures. | Sonnet medium, half a session. Done: fails on a fixture with no text form or a global lookup; passes on master's two fixtures. |
| Second | VSX1 living style guide page and VSX2 native default skin for figures. | Sonnet medium with an Opus review of the look, one session. Done: gallery shows the grammar; both fixtures restyled, text forms unchanged. |
| Third | RCT1 merge order and layout API review, then merge the representation branches. | Coordinator (this session), with Sonnet subagents per branch. Done: master builds; contract test and full suite pass once. |
| Fourth | VSX3 glyph language and VSX5 motion set as tokens. | Sonnet low, small. |
| Fifth | RCT3 visual regression baseline. | Sonnet low, small. |

## Round 15, 2026-10-31: a journey-level refinement audit

Weibao asked about the small interactions left across the October 30 work and whether UI deserves its own refinement auditor. This is a bounded source-and-evidence review, not a fresh gameplay run or an independent agent review. The [broader refinement review](REFINEMENT_PRIORITIES_2026-10-31.md) owns the cross-system order; the existing representation docs and receipts own each slice. DESIGN.md owns look; its owner status is accepted, while DSG lines remain proposals except where they restate accepted direction. Applies AD6-AD8, AD32, AD34, AD36, AD40, AD42-AD46, DSG1-DSG19, UR1-UR75, proposed UR76-UR82, SUI and RPT. Desktop: 1920×1080; mobile deferred. No new rule or human-review gate is proposed.

### Findings to carry into the next UI pass

| Code | Evidence and limit | Player consequence and next check |
| --- | --- | --- |
| UIF1 | **Misleading safety word, source and captured.** `TEMPO_MOVES.withdraw.safe` means eligible for the cautious handover policy; its text also says a miss costs a free blow. `combat_situation_ui.js` renders that internal flag as `Safe.` and calls the handover a "safe turn"; the fallback in `tempo_fight_domain.js` does likewise. The [recorded screenshot](../representations/evidence/combat-surface/tempo-card-typed-1920.png) and [receipt](../representations/evidence/combat-surface/journey.json) show it on bundle `f445ed30d920`. A direct module read on 2026-10-31 confirmed the flag and text; no current browser run was made. | Rename the player-facing idea to a cautious or non-attacking policy and keep its real risks visible. Check withdrawal, yield, brace and handover in both surfaces, including a failed withdrawal. This changes wording, not the policy's eligibility. |
| UIF2 | **HP mismatch in the candidate's evidence.** The same screenshot shows `60/60` in the hero panel while the fight card shows `58.4/60`; its [receipt](../representations/evidence/combat-surface/journey.json) confirms the fight card's latter value. The [combat owner](../representations/COMBAT.md#round-3-2026-10-30-one-fight-surface-damage-types-in-tempo-merge-census) records source-level sync (`428015d90`); `runMove` now writes `plan.vitals.player` per move. | The saved capture does not establish DSG11's visible agreement. Reproduce on a rebuilt current bundle and trace native publication and repaint; a later fix may already have resolved it. Assert the two visible values after damage, healing, reload and import, not just the fight-card value. |
| UIF3 | **Evidence label corrected.** The capability audit's cited `before/t03` image was the loading screen and the before receipt skipped the lead-hour steps. Its later `after/t03` is the playable lead screen, and the after receipt records three hour steps. [Correction](UI_CAPABILITY_GAPS_2026-10-30.md#method-and-review-state). | Evidence needs the actual screen, state, route and bundle identity; a successful selector or click is not the claimed view. Recapture changed flows after load and distinguish before from after. |
| UIF4 | **A possible social-knowledge leak needs a real route.** `silenceLine` calls `silenceCase` over the holder's memories and shows an exact chance and top factors. A synthetic call to `silenceExplanation` with private pressure and a rival offer prints both factors. No observer-knowledge filter is visible in that function; whether callers already restrict those inputs on a playable route was not established. | Compare what the player actually witnessed with the displayed reason, including hidden bribes, a rumour and later discovery. Show only knowable reasons or an explicitly sourced insight; retain the real internal calculation. Do not publish unseen causes as fact. |
| UIF5 | **Interaction lifetime, not just the figure.** `combat_situation_ui.js` replaces the fight card's children on redraw. [UI_FORM_FIT](UI_FORM_FIT_2026-10-30.md#5-what-shipped-and-its-state) says figure pins reset on a changed spec. `tempo_fight_domain.js` keeps aim in a module variable, so a page reload does not itself restore that selection. | Check focus after a move, an event refresh, a changed subject and closing an inspector; compare pin, filter, scroll and aim after redraw, reload and import. Choose the right lifetime for each state rather than promising all selections persist. |
| UIF6 | **Per-world voice coverage is narrower than its name.** `world_report_voice.js` parses arrival text to find a place; non-frontier activity unlocks fall back to generic. `tests/world_look.test.js` scans a particular literal `*_LOCATIONS` shape and checks a global set of voiced place names. | A passing test does not by itself prove each enterable world's actual start/work actions have a usable, correctly scoped voice. Probe a real world ID and source event through the rendered control; include a repeated place name across two worlds and a missing or sealed location. Keep generic fallbacks where their stated dial permits them. |
| UIF7 | **Density needs an interaction test.** In the saved 21 px [talk screenshot](../representations/evidence/talk/talk-21px-effects-off-1920.png), the stat strip is very tight and the same topic appears in two different explanatory areas. Gallery word counts and the [form-fit study](UI_FORM_FIT_2026-10-30.md) measure useful proxies on fixtures, not actual comprehension. | Test long names, large text, dense panels and different states; keep distinctions that answer different questions while removing repeated facts. Compare glance, actionable panel and deeper inspector. A graph, table, block and prose can each win for a different question. |
| UIF8 | **The design-owner handoff is incomplete.** The [front door](../systems/README.md#cross-cutting-owners) now correctly records that DESIGN.md is merged. Its separate [writing draft](../gm/dispatch/ui-identity-combat-2026-10-30/WRITING_VOICE_DRAFT.md) is still a proposal and includes implementation claims that predate the later world-voice and damage-name code. | Reconcile the durable tone, terminology and observable writing needs into the existing look owner when that area is next edited; do not paste stale status claims or start a competing style owner. RPT13-RPT14 stand independently of the draft. |

### Proposed focused UI auditor packet

**Outcome.** Produce an evidence-backed refinement backlog for the shared desktop shell and affected book-world surfaces, covering truth, interaction and appearance together. This is an audit packet, not a dispatch, implementation authorization or new project gate. Existing lanes keep their ownership; check current HEAD, dirty paths and live owners before any capture or handoff. Use the primary checkout unless a clean, noninterfering build needs an existing or disposable isolated checkout. Never use the player's saves or a visible window.

**Representative journeys.** First, start a lead life, find a real action, see its known cost or blocker, act, and return to the relevant panel. Second, exercise a populated encounter through a changed HP value, a cautious move, keyboard focus and save/reload/import. Third, choose one available second-world school, access or crossing route and check its own progression and wording. Label fixtures and inaccessible routes, and include empty, unavailable, in-progress and changed-state cases where the selected surface supports them. Inventory the remaining world/representation families against [DSG19's existing census](WORLD_UI_KIT_CENSUS_2026-10-30.md); unchecked is not missing. The three journeys sample the system, not a demand to finish every world before any other slice.

**Review axes.** Trace one fact from its owner to each visible copy; identify action, disabled reason, cost, result and interruption; check discovery and historical perspective; check keyboard/focus, navigation return and saved layout; compare the actual populated 1920×1080 screen at 14 and 21 px with effects off and the applicable normal setting; inspect grouping, world vocabulary, density and form. Where a layout is unsettled, compare current plus two genuinely different options, including one unusual option, using the existing gallery or a bounded prototype. Keep the map, lists, panels and text forms where each serves a different need. Inspect behavior through the actual app, not only gallery mocks.

**Deliverable and evidence gate.** Extend this round or the affected owner, not a second rules authority. For each finding: player scenario, expected versus observed behavior, current input identity including relevant dirty inputs, route kind, screenshot or text evidence, owning model and surface, severity, existing code/ledger, next action and a specific done check. Separate source observation, prior screenshot, current rebuilt-browser observation, fixture, proposed design and installed-app state. A visual candidate is a proposal; human taste feedback is optional under AD42. Do not treat a screenshot, test count, missing fixture or a broad inventory as proof that a whole system works.

**Execution fit.** One `gpt-6.1-sol` medium auditor is the proposed judgment-bearing route, with a `gpt-6-luna` low helper only for a bounded inventory if the controlling task explicitly authorizes delegation and the shared budget has room. Respect active AU limits, existing worker ownership and no paid fallback. A later implementer takes one confirmed, dependency-ready behavior at a time; this packet does not start one.

### ACT NOW / ACCOUNT FOR NOW / LATER

- **ACT NOW (done):** examined the named saved 1920 captures and current source; confirmed UIF1 by a pure module read; corrected UIF3's evidence pointer; saved this round and the packet. No code, browser journey, agent dispatch, full suite or rule change was performed.
- **ACCOUNT FOR NOW:** use labels that describe the actual caution and risk; test one-fact display and observer-safe reasons across the whole journey; preserve actual panel routes, desktop density, player Appearance, save safety and owner boundaries. Classify each observation at its actual evidence level.
- **LATER / DELEGATE:** UIF1 wording and UIF2 HP agreement: Sol medium, small each; done when rebuilt real controls and the relevant failure/changed-state checks agree. UIF4 observer audit: Sol medium, medium; done when a hidden-factor scenario stays hidden and a genuinely learned factor becomes visible without changing the verdict. UIF5 focus/state: Sol medium, small per touched view; done when a keyboard journey and the named redraw/reload case retain or intentionally reset their state. Focused UI auditor: Sol medium, one bounded audit as above; reopen when its owner is free and a noninterfering current build can be captured.

### Independent auditor follow-through (2026-10-31)

Weibao dispatched the focused auditor on `gpt-6.1-terra` max. Its [receipt](../gm/dispatch/refinement-audits-2026-10-31/UI_AUDIT_RECEIPT.md) records a separate rebuilt snapshot, three desktop journeys, six captures, input identity, priorities and done checks. It found:

- **UIA-R1:** a later source-step control is visible at the opening location before its discovery conditions; the receipt names its ID and route without disclosing its truth.
- **UIF1, UIF2 and UIF5:** on a seeded fight, a risky withdrawal is labeled safe, fight and hero HP disagree after damage and through reload/import, and a keyboard attack loses focus. Healing, final settlement and an earned route remain open.
- **UIA-R2, UIA-R3 and CG3:** current source explains the previously observed inaccessible story panel; the rebuilt lead opening hides useful local controls and labels the native clock as local even though the cast calendar has its own base.
- **UIA-R4–UIA-R7:** the HP school sample shows ambiguous repayment inputs, generic known-prerequisite blockers, developer-facing wording in play and dense equally weighted actions. Its learning/practice/cast sample survived reload and import; the layout comparison remains a design proposal.

These are agent-verified samples, not a claim that the installed app or every world was reviewed. Follow the receipt's owned checks when an affected slice is selected; the audit adds no universal gate.

## Round 16, 2026-11-01: full-world UI wiring and visual direction

Weibao asked how full-world implementation can ensure UI wiring, what counts as good UI, how to improve future UI, and whether to move from text toward a Stardew Valley style. This round expands the design palette; it does not select a visual replacement or authorize runtime work. DESIGN.md remains the look owner, UI_RULES the interaction owner, and the existing world/campaign record the delivery owner. Applies AD6-AD8/AD32/AD34/AD36/AD43-AD46, WA54-WA57, DSG6-DSG19, UR35/41-43/47/52/55/70-75 and SUI/RPT with their existing statuses. Proposed practices below add no universal completion gate.

Target for a future comparison: populated desktop 1920x1080, normal and large text. Visible outcome: identify the current situation, find an appropriate action, understand its known commitment, perform it and locate/use its consequence without developer help. Mobile, whole-world art conversion and new simulation systems are deferred.

### UFW1: completion means a connected player journey

The existing WA54 engine/UI contract and AD43 floor already cover more than button presence. In the existing arc record, give each distinct player operation a row with: situation/intent, ordinary entry route, owning state/command, known cost or blocker, feedback, result consumer, return route, affected persistence and proof identity. Reuse an established contract for content rows with the same behavior; exceptions get their own scenario. A source situation is not automatically a separate screen.

Trace the complete chain: **discover -> inspect -> prepare -> commit -> see progress/result -> use the result -> return/resume**. Include its actual supplying screen and downstream consumer. A purchased ingredient must be usable at the relevant bench; a learned fact must reach the appropriate notebook/action without revealing unseen truth. A new meter with no decision or consumer remains incomplete under FLR4.

Check relevant state transitions: unknown versus empty, blocked with a knowable reason, ready, pending, settled, failed/interrupted, changed eligibility after returning, and save/reload/import where affected. Distinguish a genuinely uncertain in-world cause from absent implementation. In tests, prefer stable action/subject IDs and actual player controls over screenshots alone. In runtime code, trace supplier -> read model -> rendered control -> command -> state change -> refreshed consumers. Preview and commit read the same owning calculation, with revalidation if state changes.

Keep evidence stages separate in that record: source mapped, contract specified, engine connected, normal UI route reached, rebuilt-browser exercised, persistence exercised where affected, packaged/installed if actually done. These are descriptive columns, not a new ladder of mandatory gates. Use AD36/AD43 for the actual requirements. Name fixtures and uncovered branches; sampled coverage does not establish a whole novel's completion.

### UFW2: what good UI lets the player do

| Question | Useful evidence in the selected journey |
| --- | --- |
| Where am I, and what needs attention? | Place, relevant people, work and immediate situation can be found at a glance; changes stand out without repainting everything. |
| What can I try, and why might it work? | Contextual verbs, meaningful known prerequisites and an inspection route; advanced options can expand without burying common work. |
| What am I committing? | Actual target, resource/time cost, uncertainty and interruption policy are understandable before payment. Precise odds appear when the observer has grounds for them. |
| Did it happen, and what changed? | Prompt feedback, a useful consequence, updated dependent views and a restrained Report; current state and remembered history remain distinguishable. |
| Can I continue comfortably? | Back/Esc and keyboard focus behave predictably; refresh retains relevant selection/scroll; larger text and reduced effects remain usable. |
| Does it feel like this world? | Its own meaningful vocabulary, progression form, institutions and appropriate visual tasks, supported by shared reliable controls. |

Evaluate the tasks, not decoration counts: wrong turns, unexplained failures, repeated clicks to routine work, missed consequences and lost context are useful observations. Establish a baseline before choosing numerical targets. Automated checks establish behavior and visible agreement; agent task walks estimate clarity; optional player feedback establishes personal preference, without becoming a release blocker under AD42.

Accessibility supports this direction: readable adjustable text, contrast, redundant cues beyond colour, clear interactivity and reduced movement are supported by [Game Accessibility Guidelines](https://gameaccessibilityguidelines.com/full-list/). They are design references, not claims of accessibility certification.

### UFW3: compare representations by the decisions they serve

Stardew is several separable choices: pixel art, a walkable top-down space, direct interaction, and a lived routine of home/work/relationships. Its [official description](https://www.stardewvalley.net/about/) documents home customization, daily character schedules, farming, relationships and exploration. The following fit/cost assessment is a project proposal, not a sourced claim that one style is universally better.

| Option | Where it helps OOPS | Cost / condition |
| --- | --- | --- |
| O1: refined text and instrument panels | Fast routine decisions, knowledge, comparison, long-range planning and unusually deep mechanics. | Strong hierarchy and consequence feedback still need work; prose alone can make places feel interchangeable. |
| O2: hybrid visual workspace, recommended default proposal | Clickable district/room maps, portraits, inventory/equipment shapes, relationship views, task timelines and world-specific work surfaces where they expose a real choice. Retain concise prose and exact inspection. | Bind visuals to existing state/commands; use a representation when it answers a player question better. Maps need known-location filtering. A visual task need not become a dexterity minigame. |
| O3: Stardew-like walkable 2D | Homes, local exploration, placement, routes and encounters where position or proximity matters. | Adds art/animation, map authoring, movement, interaction/focus and possibly collision/pathfinding work across worlds. Movement needs a chosen clock policy and a reason beyond extra travel clicks. Prototype a bounded locality before adopting. |
| O4: illustrated atlas and dossier, unusual candidate | Places as connected illustrated pages, people/evidence as inspectable entries, with task overlays. Can give book worlds a strong sense of place without continuous movement. | Test whether it supports repeated routine play and comparisons; avoid turning tasks into page hunting. |

The recommendation is O2 now as a candidate direction, O3 selectively if its movement adds enjoyable decisions, O1 retained where precision wins, and O4 as a comparison candidate. Existing Luminous Gothic and shared composition remain the current direction. Pixel art can accompany any candidate; it does not require changing the game loop or engine.

### UFW4: more to account for before a visual shift

| Interaction | Default, dial and reason |
| --- | --- |
| Space and time | Decide whether movement spends world time, triggers encounters or is presentation. Dial by locality. Reason: adding avatar movement must not silently change job timing or actor availability. |
| Knowledge and discovery | Filter map labels, portraits, links, tooltips and animations through observer knowledge. Dial by learned source. Reason: a visual can spoil just as readily as prose. |
| Multiple simultaneous tasks | Give the current task a clear focus while preserving work and important consequences elsewhere. Dial panel density by activity. Reason: a beautiful scene should still support idle play and returning after absence. |
| Authoring and scale | Test one busy place, long names, many items and a later-life state before multiplying art/templates. Dial detail by actual choices. Reason: a good opening mockup can fail under a full world's density. |
| Shared controls, distinct worlds | Share input, focus, inspection, navigation and rendering primitives; choose spatial/timeline/ledger/other forms per world task. Dial by mechanism. Reason: common reliability need not flatten world differences. |
| Presentation and persistence | Derive views from the existing state owner; record a compatibility decision for any new durable position/state. Dial transient focus versus saved work separately. Reason: changing the renderer need not duplicate the simulation or damage saves. |

### ACT NOW / ACCOUNT FOR NOW / LATER

- **ACT NOW (done):** read current direction/design/contracts and the prior UI audit; saved UFW1-UFW4 in this existing audit. No runtime, art, rule, installed-app or priority changes. Existing confirmed defects remain in round 15's owned receipt rather than becoming a new queue here.
- **ACCOUNT FOR NOW:** apply existing WA54/AD43 through an arc's connected journey; compare forms by player task; retain desktop priority, observer-safe display, shared commands and player Appearance. These are recommendations for future authorized slices.
- **LATER / DELEGATE, P1:** during the next authorized arc, fill UFW1's fields in its existing record and exercise its normal route plus a meaningful failure/changed-state scenario. Suggested executor: Sol medium, small per distinct operation; done check: actual command/result/consumer and rebuilt UI proof meet the existing floor. Reopen when that arc is selected.
- **LATER / DELEGATE, P2:** compare the same small locality/task as current refined panels, O2 and O3, with O4 if it tests a distinct hypothesis. Suggested executor: Sol medium, medium bounded prototype; done check: runnable candidates on identical scenario/state, observed navigation/clarity and explicit clock/movement policy. Reopen when choosing a presentation slice; do not build a whole town to decide.
- **LATER / DELEGATE, P3:** grow the winning form with one representative dense/later-life state and another genuinely different world contract before a broad conversion. Suggested executor: Sol medium, medium; done check: reusable controls, preserved world differences and relevant persistence/knowledge checks. Reopen after a candidate shows a concrete benefit. No agents dispatched by this round.

Verification: documentation-only expansion, no fresh runtime observation. Python structure/link check passed for round 16 (unique heading, UFW1-UFW4/dispositions present, external reference pages read through web). `npm run check:docs` failed on other shared documents, with no finding in this audit file. Previous browser receipts remain evidence of their own inputs. No runtime tests were needed or run for this prose addition.

## Round 17, 2026-11-01: same LOTM scene in three interactive forms

Weibao requested an interactive same-scene comparison in current panels, hybrid and Stardew-like walkable form, implementation/scaling/underlying-system implications, broader considerations and budget awareness, supplying an RI teaser. This authorizes the prototype and analysis, not adoption or a runtime conversion. Applies the same standing codes as round 16 plus MW1-MW8 in [the shared workbench](../MOCKUP_SYSTEM.md). No new rule codes or priority changes. [Reproducible study](../../prototypes/workbench/studies/lotm-scene/README.md), registered as `lotm-scene` in the shared workbench, owns fixture source, input hashes and captures.

### ACT NOW (done): bounded playable comparison

**PT1: scope and fidelity.** Current panels approximates the standing dense navy/teal panel vocabulary with the Reports column; Hybrid scene binds subjects directly to a room/street illustration; Walkable town adds a visible avatar, tile movement, illustrative collision, interaction range, keyboard/on-screen controls and click-to-route. The latter two share the same original code-drawn room and street. All three run one in-memory model and the same commands. Switching views spends nothing and preserves domain state, selected subject and reports. Workbench Compare mirrors resulting snapshots without replaying commands. The inline carousel uses the same generated fragment/model; no second fixture implementation.

This is a sketch, explicitly **not native-current-shell UI proof**. The opening-household receipt supplies broad context, not proof of these prices or this follow-on errand. Original scene paraphrase, 12-pence purse, 4-pence bread, 14-minute happy path, map layout and three-loaf stock are synthetic comparison values. No sealed content, source prose, player save or production command is imported. The test task is read note -> collect purse -> leave -> buy loaf -> return -> serve; bread's consumer is the table. Blocked serving, shortage and closed shop demonstrate refusal without charging. This samples a household/economy task, not LOTM's full UI needs.

**PT2: budget envelope and reference evidence.** Live host allowance at the start showed 85% used in the weekly Codex window, approximately 15% remaining; this is a point-in-time allowance, not a dollar estimate. The implementation used the current controlling chat, zero spawned workers, no paid API/model/image calls, no asset purchases, no new dependencies and a focused existing headless Playwright route. Existing account credits are not permission to spend. Main costs here are included allowance, authoring time and local browser work. Future production costs are unknown until an actual integration slice is measured; no dollar/hour multiplier is claimed.

The [supplied RI post](https://www.reddit.com/r/ReverendInsanity/comments/1xjqghl/ri_the_game_update_and_teaser/) was read on 2026-11-01. Its developer states that work/life constraints prompted 3D -> 2D to protect content, and describes a bounded awakening-to-academy-finals prequel MVP plus cultivation/feeding/refinement. These are author statements, not independently played or source-verified functionality. Comments describe a free release and possible browser alpha/executable beta. The teaser video was not played frame by frame; no asset pipeline, performance or cost conclusion is drawn from its appearance. Relevant inference: representation can be reduced while retaining a chosen content goal; a teaser does not establish complete system depth or the cost of our many-world plan.

### ACCOUNT FOR NOW: what becomes easier, and what does not

| Code | Dimension | Current panels | Hybrid | Walkable |
| --- | --- | --- | --- | --- |
| PT3 | Routine UI authoring | Reusable lists/forms and inspect routes; long undifferentiated action lists are a risk. | Reuses those forms, plus semantic subject positions/hotspots. Common scene templates can amortize art. | Adds placement, routes, interaction range, obstacle/hit geometry and focus across movement/dialogue. Tilesets help art reuse but do not author the locality. |
| PT4 | Underlying mechanics | Knowledge, eligibility, cost, state transitions, jobs, consequences and persistence still need owners. | Same requirements. A shared projection and command path can remove duplicate wiring/math. | Same requirements plus spatial state and its relation to time, presence and targeting when those become gameplay. Graphics themselves remove none of the earlier requirements. |
| PT5 | Where representation simplifies a problem | Exact comparisons, stock, obligations, schedules and evidence. | Spatial relationships, equipment locations, process stages and known connections can become easier to see. | Reachability, nearby interaction, placement and genuine spatial tactics can become easier to express when the mechanic actually depends on position. Abstract clues, institutions and distant obligations still benefit from panels. |
| PT6 | Scaling over arcs/worlds | Mainly semantic content, states and exceptional rules; UI density must be managed. | Adds image/scene authoring and bindings. Use reusable scene families with world-specific content, not one hand-painted screen per source scene. | Adds maps, exits, asset/animation variants and traversal validation. Different bodies, vertical movement, transformations and nonphysical spaces can pressure a fixed grid; keep the spatial renderer replaceable. |
| PT7 | Long-term budget | Lower incremental presentation cost for new mechanics, though prose and interaction design are real work. | A reasonable middle candidate if visuals serve choices and reuse scene/subject definitions. | Highest additional locality/content pipeline cost in this comparison. A small home or exploration site can still justify it on enjoyment; no obligation to convert every world. |

**PT8: the useful shared boundary.** The prototype's one state/command model demonstrates interchangeable presentation on a synthetic task. Production would bind the existing observer-safe projections and native quote/command/result seams under WA54; it would discard the prototype economy rather than transplant it. Reuse stable world/place/subject/action IDs; keep display selection, hover and avatar animation separate from durable actor/job/evidence state. A current-style panel and new scene can coexist. There is no demonstrated reason here for an engine rewrite, new ECS, separate world simulator or global schema migration.

**PT9: fairness and scope limits.** Movement here costs player inputs but no world minutes, while explicit travel costs the same five minutes in each view. That isolates presentation, but production spatial play needs an explicit movement/time/pause policy and compatible NPC/job updates. Collision prevents stepping onto target anchor tiles and bounds, not whole drawn furniture footprints; the router is synchronous and movements snap between tiles. No walk cycle, moving NPC AI, occlusion, combat or real map streaming is claimed. Those omitted costs make this cheaper than a finished Stardew-like game. The 24-item crowded scenario is one disclosure with a long-name example, not a full inventory renderer/performance proof. All views receive the same fixture advantages and limitations.

**PT10: broader consequences.** Maps/portraits/connections can leak identities and unknown places, so observer filtering belongs before rendering. Object placement can imply exact distances the source never established; separate authored presentation from world truth. Return after offline progress needs a useful summary regardless of visuals. Keep quick repeat/batch actions for errands once walking ceases to add a choice; automated travel and detailed walking can coexist under world mechanisms. Large numbers, simultaneous work, history and comparison still need readable nonspatial surfaces. Colour, motion, audio and art can enrich all three forms; avoid making essential information dependent on them. Art generation can reduce a first illustration's cost while leaving consistency, edits, tile edges, collision masks and animation integration to be solved. A reusable licensed tileset is a later option, not a purchase this task authorizes.

### Evidence and verification state

- `node prototypes/workbench/studies/lotm-scene/build.mjs`: passed; writes isolated sketch files and the inline fragment, records exact SHA-256 inputs/outputs in INPUTS.json. No main build or installed-app files touched.
- `node --check prototypes/workbench/studies/lotm-scene/scene.js`: passed before the interaction checks; final code executed in the checked browsers.
- `node prototypes/workbench/studies/lotm-scene/check.cjs http://127.0.0.1:60891/`: passed, 35 checks, zero page errors. Same task and final money/bread/clock/stock/outcome across all views; blocked serving/shortage/closed shop do not charge; view switching preserves exact state; movement/E/Esc and mirrored shared-workbench state exercised. Geometry sampled 1920x1080, 1800x1040, 1536x864 and inline-width 1024 with 14/21px text, with no horizontal overflow. At 1920/21px the walkable sketch requires 44px of vertical scrolling; controls remain reachable. No mobile acceptance claimed.
- All three 1920/14px captures were visually inspected after reducing the scene height; the ordinary actions are visible. Keyboard focus lost after interact/canvas selection was reproduced and corrected. Initial harness failures included attempting a normal Playwright click on aria-disabled actions and selecting a hidden peer's objective; those failures are not passing evidence. Final checks use keyboard refusal attempts and the actual visible peer.
- `node prototypes/workbench/studies/lotm-scene/inline-check.cjs`: passed; rendered inline sandbox read-note interaction updates the objective, zero page errors, recorded in `evidence/inline-check.json`. Earlier wrapper capture was stale after a generated-fragment change and did not establish final behavior. Workbench freshness and the current INPUTS.json distinguish input identity from sketch fidelity.

Round 17 document links/structure and `git diff --check` passed. Repository `npm run check:docs` still reports other shared-document findings; no round 17 finding remains after correcting two unsupported-status phrases.

Agent-verified prototype, not human-reviewed; no native full-suite/build, game save/reload/import, installation, commit, push or production adoption is claimed. Those native gates belong to a selected runtime change. Local review server at the checked URL: PID 70204, execution session 89229; it serves the shared workbench, independent of gameplay. Source can be rebuilt and served on a new port using the README.

### LATER / DELEGATE, ranked proposals

| Code | Follow-up / reopen trigger | Capability / effort | Done check |
| --- | --- | --- | --- |
| PT11 | If this comparison supports hybrid, bind one useful visual surface to the next authorized LOTM arc's existing native subjects/actions. | Sol medium; small bounded native integration, followed by its existing gates. | Actual supplier/quote/command/consumer and observer behavior agree through a rebuilt desktop journey; no duplicate economy. |
| PT12 | If walking feels enjoyable, choose one home or exploration locality where movement/placement has a purpose, then measure content authoring and time policy. | Sol medium; medium prototype/integration. | Movement, footprint collision, clock/jobs, interaction focus and affected persistence work on the selected locality; record actual effort before estimating world-scale cost. |
| PT13 | Before adopting a representation broadly, sample a knowledge-heavy task, time-critical encounter and dense later-life state; compare forms by the same task again. | Sol medium; medium bounded study, not a whole second world. | Known/unknown, interruption, multiple work and readable comparison survive without forcing all tasks into a map. |

Recommendation remains a proposal: use hybrid where scene grounding adds value, retain panels for depth and routine work, and allow walkable places when spatial play earns their added authoring cost. This comparison does not reduce the standing many-world/full-journey vision or establish a new pre-implementation gate.

## Round 18, 2026-11-01: deeper case and a distinctive 2D candidate

Weibao requested the three-style comparison on a more complex LOTM investigation or combat scene before choosing, with budget in mind, then clarified that the 2D direction might be more stylistic, with the RI video as a reference, without needing to decide every atmospheric consideration now. This authorizes the deeper prototype and comparison, not a selected production art style or native combat revision. Applies round 17's AD/WA/UR/MW owners and statuses. The original morning study is retained. [New reproducible study](../../prototypes/workbench/studies/lotm-investigation/README.md) is registered as `lotm-investigation` in the existing shared workbench.

### ACT NOW (done)

**PT14: deeper comparison.** Built Current panels, Hybrid caseboard and Gaslight cutaway against one new synthetic case model. Original LOTM-inspired training case, explicitly not a canon event, source-qualified mechanic or native runtime. Physical observations, reported testimony and a working inference have separate descriptions and sources. A third perception route spends spirituality; preparatory focus supports a later response. Disturbance advances on committed turns and escalates into a deterministic confrontation. Ammunition, health, spirituality, shelter, retaliation, containment and withdrawal have actual consumers and visible costs. Unknown evidence and the approaching figure are absent from player-visible views until admitted by their routes. No ultimate cause or identity is supplied outside discovery, and no sealed project material is used.

The same model updates all views. Switching styles preserves selected subject, evidence, inference, focus, resource values, turns and consequences. Shared-workbench Compare mirrors state without repeating the command. Walking adds proximity, keyboard/on-screen movement and click-to-route with a blocked central footprint. Movement is presentation time; decisions use the shared turn policy. In this comparison, spatial movement does not confer extra damage/line-of-sight rules unavailable to other views. These limits make the comparison fair but leave native spatial combat unproven.

**PT15: reversible visual grammar.** The 2D proposal is a gaslit cutaway with tall repeating windows, engraved/brass framing, long hard-edged shadows, restrained blue-green stone and coat silhouettes. Hybrid uses the same scene art, so walking is not given a unique art-quality advantage. Its notebook groups observed/reported evidence and a distinct inference strip, rather than making lines on a board establish truth. This is an authored stylistic candidate, not a simulation of gaslight, weather, sound, fear or supernatural visibility. The director need not decide all atmosphere systems to judge this candidate. The earlier RI post is contextual inspiration for a readable 2D world; its video has not been directly inspected frame by frame, and no detailed animation, rendering or engine claim about it is made.

**PT16: budget.** Live allowance still showed 85% used in the weekly window at this task's start. Reused the comparison harness, styling basis, build path, protocol and local browser tools. Zero generated agents, paid API/image calls, purchases, dependency installations or native full-suite runs. One scene plus three starting fixtures bounds the experiment. No monetary or production-hours estimate is inferred from this short sketch.

### ACCOUNT FOR NOW: results and their limits

| Code | Observation / assessment | Implication |
| --- | --- | --- |
| PT17 | All views can carry the same evidence/resource/turn mechanics. The checked long route reaches the same state and outcome. | Representation is replaceable; underlying knowledge, action eligibility and settlement still require shared owners. This proves toy-model parity, not native integration or canon fidelity. |
| PT18 | In inspected desktop captures, panels put the commitment and consequences in a wide reading area; hybrid shows subject positions beside the selected response. Walkable adds a subject approach before that same response. | Agent assessment: panels suit dense comparison, hybrid adds spatial context, and walking needs enjoyable exploration or meaningful spatial decisions to justify its interaction cost. Player enjoyment and task-completion time were not measured. |
| PT19 | Evidence is identified as observed, reported or inferred, and selecting/reading does not advance the encounter. Inspecting a real clue or using perception does advance it. | Give inspection versus commitment a clear boundary. A notebook and predictable pause policy can protect reasoning time in all representations. This fixture's exact turn policy is a proposal, not a universal LOTM rule. |
| PT20 | Shelter consumes a turn, reduces that turn's hit and supports a later withdrawal; unprepared/low-resource responses refuse without payment. | Combat UI needs aftermath and alternative routes, not a menu of attacks. An incomplete withdrawal retains notes without implying a solved mystery. Repeated actions after settlement should remain observational/refused. |
| PT21 | Richer style can come from a few consistent shapes/materials and scene bindings. The same art supports hybrid and walkable. | Separate art direction from locomotion and atmosphere simulation. A single visual grammar can be evaluated now; high-cost animation/weather/audio can reopen when play gives a reason. |

Additional considerations for a later native slice: character knowledge filters must cover maps, target outlines and notebook links as well as text; seen does not mean understood. World lighting can remain illustrative until a consumer needs actual illumination. If line of sight, cover, range or movement turns become mechanics, their native state must supply the same quotes/reasons to panels and visuals; do not calculate them in a renderer. Topology can be a room graph, cutaway or local grid according to the scene; the full world need not become one detailed tilemap. Preserve ordinary and supernatural views as distinct observations, without a permanent glowing marker for unknown truth. A visual art vocabulary can change across worlds while shared controls and knowledge rules stay reliable. Pathfinding, animation, dense evidence selection and later-era transformations remain significant production work.

### Verification and remaining boundary

- `node prototypes/workbench/studies/lotm-investigation/build.mjs`: passed; isolated HTML/JS/CSS and inline fragment generated with SHA-256 input/output manifest. No production source/build/app touched. Initial hybrid-section hidden markup was made explicit after the main run; it retains the same rendered state and was included in the inline verification.
- `node --check prototypes/workbench/studies/lotm-investigation/scene.js`: passed.
- `node prototypes/workbench/studies/lotm-investigation/check.cjs http://127.0.0.1:60891/`: passed, 38 checks, zero page errors. Across all views: unknown information absent before examination, long evidence/inference/focus/perception/confrontation route matches, switching preserves state, insufficient spirituality spends nothing, shelter/withdrawal and ammunition/retaliation settlement work, movement/E/Esc work, mirrored workbench evidence updates without replay. Sampled 1920x1080, 1536x864 and inline-width 1024 at 14/21px; no horizontal overflow. Vertical scrolling is permitted in the sketch and is recorded in evidence/checks.json.
- All three 1920px confrontation captures visually inspected. They establish this scene's composition, not clarity for every novel situation. Native physics, source lore, save/reload/import, installed-app delivery and human preference are outside this experiment.
- `node prototypes/workbench/studies/lotm-investigation/inline-check.cjs`: passed; sandbox examination updates recorded evidence, zero page errors. Round 18 reference/structure and `git diff --check` passed; document lint has no findings in this task's paths, while unrelated shared-document findings remain. Workbench freshness reports matching source/output inputs with sketch fidelity. Prior study evidence retains its earlier input identity.

### LATER / DELEGATE

| Code | Reopen trigger and bounded work | Level / effort / done check |
| --- | --- | --- |
| PT22 | When choosing an actual integration slice, bind one chosen case/notebook surface to current native observer projections and commands. | Sol medium; small-to-medium; rebuilt normal UI route proves real cost/result/consumer and knowledge filtering, using existing AD36/AD43 gates. Discard the toy model. |
| PT23 | If walkable combat is desired, prototype an actual range/cover/movement-time decision with identical native semantics exposed to all forms. | Sol medium; medium; position changes the intended quote/outcome and failure/recovery paths, with affected persistence exercised. No new tactical engine is authorized here. |
| PT24 | After visual feedback, reuse this scene's grammar in one other room and one dense case state before commissioning broader art/animation. | Sol medium; small; record actual authoring/revision cost and show subject readability without new mood systems. No purchase or delegation dispatched. |

Recommendation remains provisional: retain precise panels, use hybrid where place/evidence context helps, and judge distinctive 2D art independently from whether walking improves play. Current Luminous Gothic and the full-journey/many-world direction are unchanged under AD32/AD44-AD46. Agent-verified sketch, not human-reviewed; no commit, push, install or runtime adoption.

## Round 19, 2026-11-01: actual RI teaser playback and budgeted style borrowing

Weibao asked to actually watch the linked Reddit video, compare its 2D style with the prototype, and consider distinctiveness, budget and implementation difficulty. This is a visual-reference review and proposal, not a selected art direction or authorization to convert the runtime. Continues PT codes from round 18; DESIGN.md remains the look owner, with AD32/AD34/AD44-AD46 and UR59-UR64/MW1-MW8 preserving reference fidelity and evidence scope. Target for any later art trial: the same populated desktop 1920x1080 case, with actions and Reports retained; mobile and world-scale conversion remain deferred.

### ACT NOW (done): actual playback, replacing the earlier evidence gap

**PT25: directly reviewed media.** Opened the [supplied post](https://www.reddit.com/r/ReverendInsanity/comments/1xjqghl/ri_the_game_update_and_teaser/) in the hidden in-app browser and reviewed its actual 66.239979-second video, muted, using playback, replay and paused frames. First ordinary headless Chrome navigation reached a bot challenge; switched routes without solving the challenge. The background in-app route loaded the public player without signing in. No source video was downloaded, no foreground/native window was opened and no external account action occurred. Media id: `0h53o8ndznyh1`. The earlier rounds' statement that the video had not been directly inspected remains accurate history, superseded for this review.

| Media position checked | Direct visual observation |
| --- | --- |
| 5.005 s, replayed around 5.566 s | Small dark-haired sprite on a pale path, dense tree/rock/plant borders, layered ground variation and a soft haze. |
| 10.364 s during replay | A mountain vista with repeated terrain forms and a different scene palette. |
| 15.115 s | A title/interstitial card, not a gameplay interface. |
| 19.993 s and around 23.739 s | Ornate courtyard/hall environments, repeated stone patterns, columns, props and multiple small character sprites. |
| 28.840 s, 32.064 s, 45.246 s and paused at 45.578 s | Blue/purple cave environments, crystals, water/bridge geometry, sprites and visible atmospheric particles/light variation. |
| 52.372 s and around 63.088 s | Title and coming-soon/credit material. |

These are a visual playback review with timestamped samples, not frame-by-frame analysis or an audio review. Observed reference style reads as a classic top-down sprite RPG; that is a visual assessment, not an identification of its engine. The montage does not demonstrate its deeper investigation/combat UI, actual collision, AI, animation implementation, source assets, development hours or performance. Do not use the post's system-completeness statements as evidence of those properties.

Compared the reference against the actual saved `walk-combat-1920.png` from [our investigation study](../../prototypes/workbench/studies/lotm-investigation/README.md), re-opened this round. The prototype's readable costs, evidence states and commands are interactive; its simple geometric figures, repeated rectangular surfaces, tile snapping and continuously visible subject labels are sketch affordances. The reference is stronger in visual density, character definition and environmental staging. It is not a fair test of which game's deeper interface is easier to use, because the teaser presents different tasks and mostly scene imagery. A finished-art reference and a deliberately cheap sketch have different fidelity.

### ACCOUNT FOR NOW: what to borrow, with the work attached

| Code / proposed order | Borrow the principle; adapt for OOPS | Implementation and budget consequence |
| --- | --- | --- |
| PT26 / first | **Composition and depth.** Give a locality a clear route, asymmetric focal landmark, foreground/middle/background layers, and a small set of purposefully placed props. For Tingen that could be a shopfront, worn desk, streetlamp, paper notices and ironwork. | Low-to-medium for one static scene. Reuse wall/floor/prop modules; Y-order or explicit layers place actors behind tall props. Painted obstacles need matching footprint/hit metadata. Do not hand-paint every source situation. |
| PT27 / second | **Character definition and motion.** A recognisable coat/hat/hair silhouette, consistent feet/shadow anchors and direction-specific poses would improve our block figures. The hybrid can use the same sprite in an idle pose. | Medium: a bounded candidate is four directions with three walking frames each, reusing an idle frame. This is a planning choice, not the reference's measured frame count or a universal requirement. Sprite authoring, anchors, integer scaling and motion/turn timing need review. Smooth interpolation should depict committed movement, without charging another action or moving the UI's selected target. |
| PT28 / alongside first | **Consistent materials and palette.** The reference's locations have distinct material/colour groups. Our LOTM candidate can keep ink-blue/green, brass, worn wood, paper and restrained highlights, with a different silhouette/landmark per locality. | Low for a palette/material pass; medium for a reusable environment kit. Distinctive art does not require every tile to be unique. Keep readable text/UI contrast independent of scene grading. Pixel, illustrated and cut-paper treatments remain candidates, not a final selection. |
| PT29 / after the above | **A small atmospheric layer.** Use authored light pools, a restrained mist/particle overlay or a selected-subject response when it makes the scene clearer. Let supernatural perception use a separate, observer-filtered presentation. | Low-to-medium for baked/overlay effects. Real-time shadows, volumetric light, weather simulation and many effects raise both authoring and technical cost. Pause hidden views, respect reduced motion and keep underlying evidence/visibility in its native owner. An effect cannot supply knowledge the character has not acquired. |
| PT30 / conditional | **More room for the scene.** Offer a scene-focused exploration view with selected-subject details available, then a readable case/combat workspace when decisions need it. This is an alternative to shrinking every fact around a picture. | Medium navigation/layout work: preserve selected subject, Reports, keyboard focus and return position. The current standing panel composition remains the default until changed under AD32. The teaser's mostly unobstructed footage is not proof that its normal game has no HUD. |

Default recommendation is to try PT26/PT28 and one PT27 sprite on the existing room before expanding atmosphere or map scope. Dial the art finish to actual benefit and reuse; reason: this measures whether a small asset kit supplies the desired distinction without precommitting to a whole-world renderer. It is a proposal, not an implementation started by this review.

**PT31: the underlying systems remain their own work.** A richer illustration, sprite sheet, layer ordering or camera is mostly presentation. Accurate cover, ranges, moving NPCs, stealth/vision, changing geometry, attacks or time spent walking introduce native spatial semantics, tick order and save decisions. Shared scene metadata can make geometry/interaction binding easier and prevent misplaced targets; scenery does not implement knowledge, jobs, ritual mechanisms, inventory or aftermath. Borrowing a visual language is not evidence that another engine's architecture or gameplay model fits OOPS. No engine rewrite is justified by this clip.

**PT32: scope scaling and budget.** Reuse room/street modules and character bases; keep distinctive landmarks, scene scripts and exceptional bodies as explicit content work. World maps can remain graphs with detailed localities where choices need them, preserving the broader full-journey/many-world direction. A generic tileset may lower initial art effort while requiring deliberate silhouettes, palette and layouts for identity. Existing owned/reusable assets or an original small kit are candidates; the clip does not establish asset availability or reuse rights, and this task buys nothing. AI images may help exploration but tile seams, sprite consistency, transparency, frame timing and edits remain costs. No new worker, paid model/image call, dependency or asset was used for this review. No dollar/hour estimate is claimed from the teaser.

**PT33: further design interactions.** Dense decoration can make interactable evidence harder to find; use a discoverable inspect/highlight route instead of a permanent label on every prop, while retaining keyboard access. Larger scenes increase travel friction, so intentional direct travel and detailed walking can coexist. Tall foreground art needs occlusion/selection rules so it does not hide the actor or consume clicks meant for a target. Keep texture density and sprite resolution consistent before adding detail. Revisions and later transformations can cost more than the first asset, so test one edited room and a second layout with the same kit before estimating a whole world. Multiple appearances of the same subject should read its existing observer-safe projection rather than duplicating description/cost logic.

### LATER / DELEGATE, ranked and not dispatched

| Code | Reopen trigger / bounded task | Level, effort and observable done check |
| --- | --- | --- |
| PT34 | On authorization for a style-refinement slice, apply one reusable environment kit and one more defined sprite to the existing case; preserve the old sketch for comparison. | Sol medium; small-to-medium. Same task/state/commands, better-defined subject/route/actor at desktop 14/21px, cost/resource outcomes unchanged, recorded asset/authoring scope. No new atmosphere simulator. |
| PT35 | If the refined room is useful, rearrange that kit into one second locality and test editing one landmark/character pose. | Sol medium; small. Reuse is demonstrated, actual revision effort recorded, geometry/occlusion/click/focus still agree. This supplies evidence for broader cost estimates. |
| PT36 | If spatial tactics or moving NPCs are selected, implement the relevant native position/time consumer as its own bounded mechanic slice. | Sol medium; medium. Quotes/outcomes and persistence agree across panel/hybrid/scene views under existing AD36/AD43, without moving mechanics into rendering. |

Verification state: direct visual playback and paused media frames, plus reinspection of our existing prototype capture and design owner. No runtime, prototype-art or source-asset changes; no native build/tests are called for by this documentation review. Round 19 links/structure and `git diff --check` passed. `npm run check:docs` reports no finding in this audit file; other shared-document findings remain. Human style selection remains open under AD42, not a blocker to the review's completion.

## Round 20, 2026-11-01: best representation for the long-term goals

Weibao followed the actual-video review by asking which representation best serves our goals and what to consider long term. This is a recommendation, not a selected redesign. Uses current VISION_DIGEST/PROJECT direction, DESIGN.md, AD5/AD6-AD8/AD32/AD38/AD44-AD46, WA54-WA57 and rounds 16-19. No runtime implementation or priority change. The deeper LOTM/full-journey and many-world ambition stays intact.

### ACT NOW (done)

**PT37: recommended direction.** An evolving hybrid: a stable desktop workspace with player/current situation, work and Reports accessible; a task-appropriate main representation; and world-specific art/semantics. Scenes ground a place, notebooks preserve sourced evidence and interpretations, tables compare stock/equipment, timelines expose simultaneous jobs, and spatial views serve movement/placement/range where the mechanism needs them. A world/life chooses its own useful forms. Text supplies precision, narrative and an accessible route to meaning without having to depict every exception as an animated scene.

The actual RI video strengthens the case for improving scene composition and character definition, not for assuming all future systems need top-down walking. This recommendation combines our depth/knowledge/many-world goals with the observed presentation opportunity. It does not establish the reference's deeper systems or dictate a generic skin for every world.

### ACCOUNT FOR NOW: long-term consequences

| Code | Consideration | Proposed default, dial and reason |
| --- | --- | --- |
| PT38 | Maintenance and budget | Grow one coherent product UI from shared subject projections, quotes and commands. Reuse interaction components and add a new representation for a demonstrated task. The three prototype renderers are experiments, not a promise to maintain three complete games. A compact text/inspection route can reuse the same components rather than become another fully separate renderer. |
| PT39 | Source/world exceptions | Keep identity, mechanism, actor knowledge and consequences outside the renderer. A room graph, local grid, process diagram or ledger can use the same subject IDs with different semantics. Later bodies, powers, scales and nonphysical spaces can replace a local representation without rewriting the campaign or forcing its rules into ordinary walking. |
| PT40 | Detail and content cost | Treat scenes as reusable localities, not one bespoke screen per source paragraph. Author a small material/prop/character kit and distinctive landmarks; measure actual edits and a second locality. Scale depiction to choices, retaining inspectable/playable coverage labels. This changes representation effort, not accepted world/content scope. |
| PT41 | Pace, continuity and accessibility | Keep routine repeat actions efficient, return context stable and offline consequences summarised. A scene can expand for exploration and yield space for dense decisions at deliberate moments. Maintain larger-text, keyboard, reduced-motion and colour-independent meaning; scene appearance does not decide knowledge or cost. |
| PT42 | Durable versus display state | Save actor position when gameplay consumes it; keep pan/zoom/selection/animation transient or explicitly owned as UI preferences. Native jobs, evidence, inventory and outcomes stay in their owners. A visual upgrade need not migrate game saves unless it introduces a real durable mechanic. |

**PT43: what would change the recommendation.** Strong player preference for spatial exploration plus a native locality where position creates worthwhile decisions would justify more walkable coverage. A dense research/economy arc can favour a notebook/table without abandoning scenes elsewhere. Measure clarity, repetition, authoring/revision effort and enjoyment on the same actual task; no teaser or toy-fixture pass settles every future representation. No universal conversion or new engine is proposed.

### LATER / DELEGATE

Extend PT34's bounded room-and-sprite refinement, then PT35's reuse/revision test if that work is selected. Suggested route remains one Sol-medium executor, small-to-medium effort, with the unchanged task and native-input boundary stated. Done check: a better-defined scene and accessible inspection improve the selected task, reusable assets survive a second layout/edit, and existing state/command meanings remain intact. Broader spatial mechanics reopen through PT36, not through an art pass. No agents dispatched, purchases or new code made by this round.

Verification: recommendation reconciled with live startup owners read during this task and the directly inspected reference/prototype. Documentation-only addition; no gameplay or human-selection claim. Document lint/format checks recorded in the task response.

## Round 21, 2026-11-01: selective 2D and Proto23 housing reconciliation

Weibao asked whether selected aspects should gain more 2D representation while everything else keeps its current shape, asked how Proto23 handles housing, and explicitly requested saving/reconciliation. Applied reconcile-project to this bounded representation/housing topic. [Exact question and authority boundary](../USER_VISION.md#selective-2d-representation-exploration-2026-11-01). This is a narrowed working recommendation, not blanket adoption of PT1-PT43 or a runtime task. Existing AD32/AD34/AD45-AD46, WA54-WA57, DESIGN and UI_RULES retain their statuses. No new AD/DSG codes.

### PT44: source-checked Proto23 housing

Fetched the immutable [Proto23 source revision e93a8cd](https://github.com/23html/23html.github.io/blob/e93a8cd617932fb698ff889b968a32f9a20d48f3/index.html), SHA-256 `a43e55e2eeb455f1c1ae589e3fc074a588813fe6cd57cfba827dcf923f3755d5`, matching the existing October 10 source audit. Re-read actual file ranges 1429-1445, 1451-1467, 1558-1584, 8234-8259, 11155-11243, 11477-11500 and 12705-12738. This is bounded source evidence, not a new playthrough, latest-version claim or another full-source read.

- Home is a location with menu actions for furnishings, fireplace, storage, cat and other supported home routes. `chss.home` routes to those subjects (12693 onward; selected actions re-read at 12705-12738).
- Furniture uses a counted list, descriptions, selection and applicable removal controls, with a home-rating display; it does not expose a room-placement grid in this inspected path (11155-11168, 11210-11242). Best-quality bed/tableware/blanket/pillow slots are described in the [source reading](../research/proto23/readers-2026-10-10/R1_core_time_titles_effects_furniture.md#6-furniture-1429-1583-givefurniture-11477-home-sector-8234-8280-bed-12845-12865).
- Storage is a two-column carried-versus-container interface (11170-11180). Rest, fuel/stockpile, reading support and cat interactions make home useful without needing avatar movement. Furnishing activation/deactivation is tied to entering/leaving home (8234-8259); selected furnishing definitions and item-return behavior were re-read.
- The safe analogy is a functional home hub represented through choices and lists. A walkable furnished room or drag-and-drop floor plan is not established by this pinned source. Later dated Discord references to fireplace animation or restoration ideas retain their separate evidence status; do not merge them into this version's proved UI.

The old October 10 reader's statements about OOPS rejecting passive furniture bonuses are historical and explicitly superseded by the later note at the top of [the comparison](../research/proto23/PROTO23_VS_YAIRPG_2026-10-10.md). They are not used as current OOPS restrictions. No current native home feature was newly verified in this round.

### PT45: reconciliation delta into existing owners

| Selected original locator | Disposition and current meaning | Owner / consumer and distinguishing check |
| --- | --- | --- |
| Round 16 UFW3; PT3/PT6; PT37 | **Compatible variant, narrowed recommendation.** Selective 2D within the current interface is the preferred working interpretation of hybrid here. It need not replace the shell, turn every task into a scene, or commit to walking. | DESIGN's new selective-2D section and VISION_DIGEST's current-taste pointer. A later selected surface proves its player task while other existing surfaces retain their route/meaning. No redesign selected. |
| PT8/PT31/PT38-PT42 | **Retained architecture consideration.** Use shared observer-safe subjects, quote/command/result owners; keep display placement separate from durable mechanical position. | Existing WA54-WA57/AD45-AD46. Source wiring and persistence proof belong to the future actual runtime slice, not this note. |
| PT11-PT13/PT22-PT24/PT34-PT36 | **Historical proposals, not active dispatch.** Art trials, alternate tasks, second-locality reuse and spatial mechanics remain conditional candidates. The request does not make them all required work. | Original rows keep their IDs/effort/checks and prototype receipts. No new agent, asset or runtime lane is started. |
| PT25-PT30 | **Retained reference assessment.** Direct RI playback supports visual borrowing ideas; specific art, animation and scene-focus proposals remain unselected. | Round 19's source/timestamp scope. This note does not enlarge its playback or system-completeness evidence. |
| Proto23 R1/R4 home evidence | **Source question resolved at pinned scope.** Functional list/menu housing is established. Pictured room layout, placement rules or a walkable home remain possible OOPS choices, not copied Proto23 facts. | Immutable source hash/ranges above; original source reports retain their dates and their superseded OOPS absence claims. |

### PT46: proposed fit for housing and other aspects

A pictured home with clickable furniture is a useful candidate: it can show the room, installed things and lived character while opening current storage, inspection, rest or work controls. Walking and free placement are separate choices. Default to authored positions for a first visual candidate; add durable coordinates when capacity, reach, adjacency, access or another real mechanism uses them, with a stated reason/dial per world. A list can remain a compact alternative for large collections and keyboard use. This is a proposal, not a selected housing implementation.

Selected exploration, site layouts, construction/placement and spatial encounters are further candidates when their tasks benefit. Inventory, stat/progression inspection, evidence details, work queues and Reports can keep their current task forms. Their current shape remains improvable under AD45, so the recommendation does not freeze an existing defect. A visual addition reuses commands; it does not add another source of costs, home effects or save state by implication.

### Saved state and checks

Saved the exact request with its exploratory status in USER_VISION, added the current working recommendation in DESIGN, and linked it from VISION_DIGEST. PROJECT's focus/standing priorities and RULES_INDEX's AD/DSG ranges were left intact because this question selects no new build priority or binding rule. Earlier rounds and prototypes remain history/evidence; no blanket acceptance or automatic new gate was introduced.

Declared owner-document bytes changed; prior prototype INPUTS manifests and browser receipts retain their original hashes and timestamps. This append changes no tested JS/CSS/fixture/output. Whole-file freshness may flag the DESIGN addition, but the delta is an explicit planning consideration, not proof of broken behavior or a refreshed test. Rebuild/recheck relevant inputs when a new representation is actually selected.

Verification: pinned source SHA-256 matched; bounded housing paths re-read. Round 21 local links/heading anchors and `git diff --check` passed. `npm run check:docs` reports no findings in the changed owner/audit paths; unrelated shared-document findings remain. No native runtime edit, game build, persistence test, installation, commit, push, worktree cleanup or paid work occurred.

## Round 22, 2026-11-01: functional home first after prototype feedback

Weibao found the 2D home representation unhelpful and preferred an improved version of Proto23's functional interface, asking whether other aspects differ. [Exact direction](../USER_VISION.md#functional-proto23-style-ui-over-the-pictured-home-2026-11-01). This supersedes the pictured-home build as the selected experiment to pursue; existing deeper-world/campaign priorities are unchanged. Applies DSG1/DSG5, AD32/AD45-AD46 and existing UI/observer/native-command owners. No new rule code, runtime lane or acceptance gate.

### PT47: ACT NOW (done)

Stopped expansion of the pictured-home experiment, updated DESIGN and VISION_DIGEST to the current preference, recorded the user's words in USER_VISION, and preserved superseded recommendation wording in the project log. The native-home workbench entry is labelled unfinished/superseded. Its files are retained, not deleted or presented as completed gameplay. No running `native-home/probe.cjs` process was present in the bounded process check; an existing shared workbench server was retained because its current ownership was not established as this task's exclusive process.

The interrupted prototype had reached an isolated current native build (`built/native-home`, bundle SHA-256 `cdd2eb177d8b1916e0925d3001f9fb6e5e3528c3302fbe4bdd9d92277b42af32`) and a first browser route through the actual Cottage owner beginning. The room was visually inspected; the native Homes projection reported the local cottage, its bed/blanket/hearth and native purse. Bed navigation reached the existing “Take a nap” target without committing sleep. Storage transfer, repair work, rest execution, return navigation, larger-text matrix and persistence were not completed. It is an unfinished navigation experiment, not a passed native slice. The initial builder import error was corrected before that build; an existing duplicate-key warning in travel_legs was not changed. The prototype owns no production source paths. Its workbench changes support the isolated native entry (worker CSP scope and native-fidelity comparison handling), with broader regression not claimed.

### PT48: proposed better home representation

A compact home overview can show rights/occupancy, current rest suitability, installed furnishings and their actual active effects, storage occupancy, and work under way. Furniture rows should expose the useful action or inspection directly; selecting a row can show its richer description, provenance, costs and dependencies. Native storage transfer, rest and work keep their existing owners and commands. This improves Proto23's functional pattern without copying its dated tuning, making a second home simulation or freezing the current scattered controls. Exact layout remains a proposal, not implementation authorised by this feedback.

### PT49: ACCOUNT FOR NOW, other aspects can differ

| Aspect | Default proposal | When another form earns its cost |
| --- | --- | --- |
| Routine fishing and gathering | Keep the existing activity controls and improve current spot, tool/conditions, progress, catch/result and stop/continue feedback using real known state. | A river/shore map helps when selecting a spot, depth, reach or another spatial factor changes a real outcome. A bobber animation is optional feedback; a timing minigame changes gameplay and needs a separate choice. |
| Crafting, trade and storage | Lists, comparison, recipe/offer inspection and useful current effects; keep repeated work efficient. | A diagram helps when arrangement or a process dependency is itself a player decision. A pictured bench that opens the same list adds little by itself. |
| Investigation | Sourced evidence, testimony, uncertainty and a readable notebook with selected-case context. | A floor plan or link diagram helps when location or relationships support a real inference. Decorative clue connections do not establish truth. |
| Combat, exploration and construction | Keep readable intentions, commitments, resources and consequences. | Range, cover, routes, placement, adjacency and access are strong candidates for a spatial view when their native mechanisms actually consume those facts. No generic grid is imposed on every world. |

The practical test is the decision improved: can the player understand a relationship, choose an action or follow its consequence more easily? Scenery that adds navigation before the same decision has ongoing art and interaction cost. The user's home feedback is evidence about this candidate, not proof that every scene is useless. The reverse also holds: another game's good-looking scene does not establish a benefit for our task. Budget goes first to native wiring, clear controls, effects and feedback; broader art remains a conditional opportunity.

### PT50: reconciled prior candidates and next boundary

PT34-PT35's room/sprite/reuse art sequence and PT46's pictured-home candidate are superseded as the immediate housing recommendation. PT37's task-dependent representation, PT38's one coherent UI and PT31/PT39/PT42's shared owner boundaries remain compatible. PT36/PT43's meaningful spatial mechanics remain conditional proposals. Rounds 16-21 and their artifact/test identities stay historical; no old receipt was refreshed or expanded. No exact improved-home layout or fishing change is selected here.

LATER / DELEGATE: when functional housing refinement is selected, one Sol-medium executor, small-to-medium bounded scope, can compare an improved overview/furniture inspector against the current native panel. Done: the same home state, known active effects, storage/rest/work routes and real failure/return behavior are clearer on a rebuilt desktop interface, under existing AD36/AD43 where applicable. No worker or new prototype dispatched now.

Verification: documentation/registry status edits, source-owner reconciliation and prior experiment boundary recorded. Link/format/lint results follow the bounded checks; no additional runtime tests, build, purchase, commit, push or save mutation was performed after the change of direction.

## Round 23, 2026-11-01: functional home comparison and panel design ideas

### PT51: ACT NOW, native cottage comparison

Weibao requested a better Proto23-style home with furniture effects, storage, rest and work wired to real systems, keeping the shell and budget. His later screenshot asks us to consider common controls and useful-task automation too. Treat its assistant answer as reference material, not adopted policy or implementation evidence. This round follows PT47-PT50, AD32, AD36, AD43 and desktop-first direction. Target: 1920×1080, with 1800×1040 and 1536×864 checks, actual 14/21 px. Mobile, production integration and other homes/worlds are deferred.

[Functional-home study](../../prototypes/workbench/studies/functional-home/README.md) supplies an isolated native cottage owner fixture. Current and improved presentations share one running life. Existing shell, carried inventory, vitals and Reports remain. Candidate brings known furnishing effects, selected inspection, residence storage, rest and paid room repairs into one task surface. Native commands retain quotes, eligibility and settlement. No production source/build, personal save, installed app or schema was changed by this study. The disposable DOM bridge is prototype wiring; a selected implementation should expose explicit command/read ports.

Budget: use existing assets, native model functions, public fixture and workbench. No new dependency, paid asset/API or delegated agent. The available allowance was approximately 13% weekly at task start; that is a dated observation, not a current quota promise. Avoid a parallel housing simulation, room art pipeline or generic scheduler as prerequisites.

Verification on the frozen build: `node prototypes/workbench/studies/functional-home/build.mjs` passed; `node prototypes/workbench/studies/functional-home/check.cjs http://127.0.0.1:49684/` passed 16 checks, zero page errors. Receipt: [checks.json](../../prototypes/workbench/studies/functional-home/evidence/checks.json), screenshots in the same folder. Tests exercise unchanged state on presentation switch, store/take conservation, sleep start/tick/stop, actual repair payment (20 coins, five logs, 30 played minutes), capacity change, unpaid missing-material refusal, furnishing removal effects and reload. Six viewport/text combinations verify actual computed font sizes and no horizontal page overflow. Workbench switches presentations and disables unsupported native mirroring. This is agent-verified, not human-reviewed.

Native bundle SHA256: `cdd2eb177d8b1916e0925d3001f9fb6e5e3528c3302fbe4bdd9d92277b42af32`. Generated `prototypes/workbench/built/functional-home/INPUTS.json` binds native sources and overlay/style outputs. Post-check freshness: matching sources/outputs. Initial checks found a save-ownership race on reload and an inherited font variable preventing actual 21 px; the bridge now waits for ownership and the overlay receives local font variables. Final evidence supersedes partial/failure receipts. Existing source duplicate-key warning (`travel_legs.js`, `dial`) and optional resource/pack 404s remain; no optional pack route is proved. Export/import, other body forms, manor/global effects and complex job interactions are outside this receipt. No universal runtime completion, installation or human acceptance claimed.

### PT52: ACCOUNT FOR NOW, common controls and automation

The screenshot's main ideas already have owners: [CA1 common actions](../../DESIGN.md#common-actions-and-task-automation-2026-11-01) and [CA2-CA5 useful-task automation](../gm/dispatch/procgen-2026-10-13/cr3/AUTOMATION.md#common-actions-and-useful-task-automation-2026-11-01). Keep those as the specifications under consideration rather than copying a second queue design here.

New comparison implications: predictable placement is useful, but availability still depends on place, body and world. A local Rest action can coexist with common actions when both invoke one authoritative operation. Distinguish **stop repeating**, **cancel this job** and **pause world time** in labels and effects. A routine's remaining intent is separate from already committed work; interruption prevents the next commitment while native settlement/cancellation governs the current one. A repeat can target five stored outputs, a held-stock reserve or a maximum in-world currency spend, with an explicit result when the target becomes impossible. Quote changes, supplies, provider support and observed decisions use CA3-CA5. Unknown danger must not become a clairvoyant pause reason.

Prefer finish-current-task and bounded repeats as the first proposed controls. A useful Wait target is a known event or duration with a current quote, not an assumed tick/minute conversion. Keep developer clock Step in the workbench toolbar: it was removed from the player home panel. This prototype implements native rest controls, not a common toolbar or a universal player routine menu. Travel, fishing, study, care and shopping remain candidates qualified through their actual owners.

### PT53: ACCOUNT FOR NOW, distinguish panels by their decisions

This is a bounded source sample, not an audit of every panel or a live defect claim for the following panels.

| Source sample | Existing strength | Proposed next improvement |
| --- | --- | --- |
| Home panel and home overview | Native controls and a separate actionless overview/read model | Bring frequent tasks and current effects together; preserve overview/navigation where useful. Candidate PT51 tests this for one cottage. |
| Gathering panel | Site-aware summary hands off to Workshop | Preserve selected site/task across handoff. Show supplied conditions; add seasonal/weather modifiers when their owner supplies them. |
| Tools panel | Fuel/condition, selected-tool inspector and current job | Make wear, changed effectiveness, repair inputs and action a continuous task path. It already has useful differentiation. |
| Gear workshop | Component/material/history inspection and quote reasons linked to controls | Show before/after effect and process dependencies when owner data supports them, instead of adding more undifferentiated selects. |
| Family tree | Relationship graph plus Read as text | Keep the graph for actual kinship/inheritance relationships and readable provenance. A generic card grid would lose that structure. |
| Field layer | Per-level hazards/stock, edges and hatches | Consider layer/flow diagrams where topology affects decisions; verify disabled reasons remain accessible beyond title text before declaring a live defect. |

Use shared typography, button behavior, focus handling and cost/reason conventions while allowing task-specific structure: comparisons for equipment, dependencies and results for work, sources and uncertainty for investigations, capacities and effects for home. Separate current facts, intended work, active work and historical results. Show held versus needed resources and meaningful changes close to actions. Functional furnishings without numeric bonuses should not read as inactive. Keep frequent operations visible; disclose rare configuration while leaving eligibility and costs near the action. Preserve selection, keyboard focus and reading position as clocks update.

Distinctiveness can come from vocabulary, hierarchy, functional diagrams and restrained material accents within the existing theme. A new illustrated skin per panel adds maintenance without necessarily improving decisions. Routine fishing can remain a focused activity panel with spot/tool/conditions, progress, result and stop/repeat. A map earns its cost when location changes reach, depth, access or another modeled outcome; a timing minigame is separate gameplay scope.

Research basis: [NN/g progressive disclosure](https://www.nngroup.com/articles/progressive-disclosure/) supports placing common choices first and infrequent options later; it does not justify hiding failure reasons. [Recognition rather than recall](https://www.nngroup.com/articles/recognition-and-recall/) supports visible context and options. [Visibility of system status](https://www.nngroup.com/articles/visibility-system-status/) supports timely feedback near the task. [Game Accessibility Guidelines text formatting](https://gameaccessibilityguidelines.com/use-simple-clear-text-formatting/) supports readable formatting and adjustable text. Applying these to this game's tasks is our design inference; research does not choose an exact layout for Weibao.

### PT54: LATER / DELEGATE, bounded adoption path

| Proposed follow-up | Level / effort | Done check / reopen condition |
| --- | --- | --- |
| Integrate selected home improvements through explicit native ports | Sol medium / small-to-medium | Reopen after comparison selects useful elements. Same effects, quotes, eligibility and commands; rebuilt desktop action/failure/reload proof under AD36/AD43. No DOM bridge promoted into shared architecture. |
| Qualify one finish/repeat activity through CA2-CA5 | Sol medium / medium | Reopen with a chosen supported native activity. Manual/auto outcomes agree; budgets, partial stop, interruption and persistence/import exercised. No scheduler rewrite implied. |
| Apply task-specific structure to one newer panel | Sol medium / small | Reopen when a concrete decision or handoff is unclear. Show a before/after task result at 14/21 px, then reuse the elements that proved useful. |

No worker dispatched and no layout adopted here. Exact candidate remains a proposal. PT47/PT48's functional-first direction now has a playable experiment; PT49's activity-dependent representations remain conditional. Common controls and automation continue in CA1-CA5, not a second implementation queue. Documentation link/format checks are recorded below; production runtime gates are not substituted by the focused study.

Visual review limitation: at actual 21 px the repairs column becomes narrow and needs improved wrapping or stacked rows before production adoption. Vertical scrolling remains necessary; absence of horizontal page overflow is not proof of ideal readability.

Documentation verification: task-path `git diff --check` passed. `npm run check:docs` still reports unrelated shared-checkout findings; this round’s new findings were corrected and the affected files rechecked. Source/output freshness matched after the final native browser run. No commit or push.

## Round 24, 2026-11-01: modular possibilities without screen overload

Weibao asks how to make things modular, swappable, attractive and comprehensible without overwhelming the player. This is a design expansion under AD45/AR1-AR13 and DSG5-DSG19, not authorization for a general rewrite or a newly adopted layout. Continues PT51-PT54 and CA1-CA5. Documentation scope; any later UI slice targets desktop 1920×1080 with actual 14/21 px; mobile remains deferred. Skill: more-to-consider, focused architecture/UI/lifecycle lens.

### PT55: ACT NOW, distinguish three kinds of swap

Saved this round in the existing owner and linked it from DESIGN. Focused source inspection confirms `src/domain_registry.js` exposes registered commands/projections and lifecycle hooks, while `src/panel_kit.js` delegates discovery, availability, layout and settings to existing workspace ownership. `src/home_model.js` already derives capacity and benefits from home definitions, fixtures and improvements. These are usable boundaries, not proof that every feature is cleanly modular. No runtime source changed or new playable behavior claimed.

| Kind | Example | Proposed boundary and cost |
| --- | --- | --- |
| Presentation swap | Furniture table versus compact list; relationship text versus graph | Both consume the same observer-safe projection and commands. Preserve selected subject, navigation and focus. Normally no gameplay migration, though saved presentation preferences need a fallback. |
| Implementation swap | Replace a housing calculation or a world-specific resolver | Keep a narrow observable contract; preserve semantics for structural changes. A changed rule needs an explicit behavior/compatibility decision, separate from refactoring. |
| In-world replacement | Replace hearth, lure, tool component, room function or service provider | Go through native custody, access, installation, materials, time and consequences. Handle current jobs and dependent routines using their owners. Appearance is not authority to change state. |

Stable content identity is distinct from an installed instance: two otherwise identical furnishings can have different ownership, condition and history. Renaming display text should not rename saved references. Swapping content used by active work requires a native decision: keep the committed instance, settle/cancel according to policy, or reconfigure future work. Do not silently rebind a reservation to a new object. Removing or disabling a feature also needs readable unresolved references, preserved belongings and an explicit recovery/migration decision where relevant (AR6 and its current compatibility qualification).

### PT56: ACCOUNT FOR NOW, possibilities through mechanisms

Prefer content data for variations supported by existing mechanisms: material, condition, capacity, fuel need, access, effects and their sources. Add behavior at a domain seam when a genuinely different mechanism needs it. A description or capability tag alone does not establish that a real consumer exists. Mechanical eligibility uses quantities and relationships where needed, rather than a growing list of named allowed combinations (AD38, CX2/CX3). Shared infrastructure can cover transactions, identity, custody and observer knowledge while the world's rule choices remain local (AR12, AD46).

Example, proposed rather than implemented: a hearth's fuel consumption and smoke output can interact with a room's ventilation and a sleeper's exposure through their respective owners. Adding a second hearth should mostly supply data if the mechanism is the same. A supernatural heat source can use a different resolver with explicit outputs and costs. It should not have to pretend to be ordinary wood fuel, nor require a hand-coded exception for every room. Compatibility is an explainable relation: what fits, what is missing, what changes and why. Some effects remain unknown to the actor, so the inspector cannot promise certainty using sealed truth.

A narrow feature boundary can expose observer-safe inspection, available action quotes, command execution and a result identity the UI can inspect. Existing owners retain save slices, elapsed time and committed work. This is a description of current architecture direction, not a new mandatory omnibus interface. Manual use and bounded automation can share commands without sharing a duplicate state machine. UI widgets receive the few operations they need (AR4), rather than access to all state. Source-tracked effects should explain the actual consumer's calculation and disappear correctly when the source stops applying; a tooltip calculation invented separately is a drift risk.

### PT57: ACCOUNT FOR NOW, visual depth on demand

Proposed default: stable shell, task-specific working area, selected detail. Keep the current status, next useful action and immediate cost/consequence visible; move explanation, provenance and rare configuration into a reachable inspector. Allow relevant comparisons to stay pinned. This is visual hierarchy, not a universal three-panel count or mandatory wizard. Several decisions can remain visible together on desktop when comparison benefits from them. Do not hide a dangerous cost or blocked reason merely to make a screen quieter.

Illustrative home flow, not new game values:

- Glance: which residence, access, storage used/capacity, current rest/work state.
- Working list: installed furniture and meaningful current effects, transfer controls, available repairs with held/needed inputs.
- Selected detail: what the item does here, effect sources, compatible replacements, cost and expected known changes before committing.

Prefer a restrained accent for selection/action, consistent spacing and alignment, clear type roles, and compact ordinary rows with more space for selected explanations. Avoid giving every row its own heavy frame, meter and glowing button. Known quantities can align in columns; longer reasons need flexible wrapping or stacked layout at 21 px. The prior prototype's narrow repair rows show why “no page overflow” is weaker than readable task layout. Preserve theme choice and contrast; color can reinforce labels rather than carrying the meaning alone. Motion can mark a meaningful change without restarting on every clock redraw.

Distinguish unavailable, unknown, empty, in-progress and unsupported. “Nothing stored here” and “you cannot inspect this storage” lead to different next actions. Preserve reading position and selection during updates; refresh changed values without rebuilding a moving target under the pointer. Keep UI preview/selection separate from a paid commitment, and expose the result near the task with a route to Reports. Count, filter/search and batch controls can become useful as owned objects scale, without creating one visible panel per object. Derived summaries should retain a route to their source and avoid hiding exceptional failures among routine successes.

Three workable representations were considered: an inspector-led workbench is the default proposal for rich object/task work; a document-like surface can suit LOTM evidence and correspondence; a spatial view is useful where arrangement changes an actual outcome. A node canvas is another possible authoring/relationship view, but becomes costly if it merely turns ordinary lists into draggable boxes. These can coexist task by task; neither a universal card dashboard nor a universal 2D map is required.

### PT58: LATER / DELEGATE, budget and proof

The next useful experiment is one replace/compare workflow, not a framework project: select an installed furnishing or tool component, inspect compatible alternatives and source-tracked effects, quote a replacement, commit through its native owner, then inspect the result. Reuse the current panel, inspector and registry seams where they fit. Do not build a plugin marketplace, generic layout editor or universal content DSL to prepare for hypothetical swaps. A second materially different consumer is the evidence for extracting another shared piece (AR11).

| Follow-up proposal | Capability / effort | Reopen / done evidence |
| --- | --- | --- |
| One native replace/compare slice | Sol medium / medium, depending on existing replacement command | Reopen with a concrete player task. Correct custody/costs/effects, stale quote refusal, active-work handling, native reload and persistence checks where changed; populated rebuilt desktop at 14/21 px. |
| Demonstrate reuse in a different domain | Sol medium / small-to-medium | Reopen after first slice. Identify which parts reused and which rules stayed local; adding the second case should reduce core edits without duplicating truth or adding custom adapters everywhere. |
| Large collection treatment | Sol medium / small | Reopen when actual inventories/jobs make scanning or redraw slow. Measure a representative populated save; filter/batch operations preserve selection and native eligibility. |

No workers dispatched, paid resources purchased or runtime work added. Practical modularity measures: how many authoritative/core files a new case changes, whether the UI duplicates calculations, whether replacement releases old effects/resources correctly, and whether a second domain can reuse the seam. File count and number of configurable switches are weak substitutes. Proposed default is a small set of reusable interaction patterns with varied world mechanisms, not every feature becoming independently toggleable.

## Round 25, 2026-11-01: native furniture replacement and reusable review

Weibao requested a furniture replacement prototype with compatible options, before/after effects, real costs, modular reuse for tools, budget awareness and related-panel consideration. Extends PT55-PT58, following AD32/AD45, AR3/AR4/AR7/AR8/AR11/AR12 and DSG5-DSG11. Prototype scope: native Cottage, human owner, desktop 1920×1080 plus 1536×864 at actual 14/21 px. Mobile, production integration and native tool changes deferred. Skills: prototype-to-decision and more-to-consider. Current shell and baseline remain; no new paid resources, dependencies or delegated agents.

### PT59: ACT NOW, playable staged replacement

[Study instructions](../../prototypes/workbench/studies/functional-home/README.md#furniture-replacement-extension) own the route. New workbench study `home-replacement` uses the existing isolated build and `?replacement=1` setup. From the public fresh fixture and native Cottage owner start, native travel to Village and back consumes ten played minutes. Native supplier purchases pay eight coins for wooden tableware and fifteen for clay; wood is installed through its existing command. Initial money 102 becomes 79. This is a named prepared fixture, not personal save data or an earned-income journey. Reload in the same session does not repeat purchases.

Select tableware, review clay, pack the current item, then review/install. Existing native rules require an empty slot and a carried replacement; there is no atomic replacement command. The prototype reflects that staged reality. Packing returns the exact original key to carried inventory. Installation consumes one carried item. These native operations currently charge zero coins and zero played minutes; no fee or duration was invented to make the UI look substantial. Acquisition price is separated from installation quote. Uncarried ceramic is a compatible catalogue option with a 28-coin supplier list price, but local commitment is blocked; supplier procurement and travel remain separate actions.

Before/after uses `planHome` on hypothetical plans, with native `homeBenefits`, `homeCapacity` and `homeComfort` for the same current conditions. Clay changes aggregate Cooking learning from ×1.05 to ×1.08; other current effects stay equal. Changed effects appear first; unchanged rows are disclosed. Storage/access/body/ownership and native removal guards can refuse a plan. This is scoped reuse of pure home functions, not a complete observer-safe planner port for every home/world. Do not extend manor/qi or other special effects by assuming this separately bundled model has every registry consumer.

Preview does not mutate the live game. Review identity binds home/context, carried items, money and clock; changing stock after review disables commitment until a new review. Execution delegates to the existing native panel command, whose quote/execute revalidates terms, and checks the expected installed-slot outcome. The live slot is empty between stages; the old item and alternative remain carried. Reload preserves that state. No automatic rollback, resale, delivery or saved UI intent is claimed. The player can return to the current panel or restore the original through the same workflow.

### PT60: ACCOUNT FOR NOW, modularity and boundaries

The prototype separates `replacement-review.js` (options, selected review, before/after display, stale state, feedback and commit interaction) from `furniture-replacement.js` (home slots/body, available carried items, plan forecasts and native request mapping). The renderer has no furniture catalogue, item-key decoding, effect arithmetic or coin rules. Its read/preview/commit ports do not introduce another state/save owner. A synthetic tool-shaped port probe exercises the same renderer with grip/equipment vocabulary. That proves a bounded presentation contract, not that actual tools are integrated or that their work semantics match furniture.

For production selection, native commands should be injected directly in place of this disposable DOM bridge. Reuse existing `src/ui/panel_sections.js` grammar and `panel_kit` registration rather than promoting every prototype helper into a second UI toolkit. Preview identity can become the owner's narrow revision/quote identity; whole-context serialization here is deliberately conservative and unsuitable as the default for large worlds. Broad “swap” must not erase the differences between staged replacement, atomic equipment exchange, gradual repair and irreversible material treatment.

### PT61: ACCOUNT FOR NOW, other panels and deeper interactions

Focused source sample, not a comprehensive UI audit or newly proved defect:

| Panel / task | Evidence and useful shared display | What stays with its owner |
| --- | --- | --- |
| Gear workshop | `src/gear_workshop_panel.js` already exposes component slots, swap/repair/process choices and quoted commit. Best direct candidate for compatible parts and before/after review. | Maker, skill, material role, condition/history, equipped-item restriction, uncertain process results and actual work. Do not present unknown outcome as guaranteed. |
| Tools | `src/tools_panel.js` already has wear/condition, hand-repair quotes, work progress and material-return cancellation. Useful for repair versus replace comparison. | Current equipment, repair timing/support, spent inputs, fuel/condition, job interruption. A repair operates on the same item, unlike a furnishing replacement. |
| Home building / rooms | `src/home_building_panel.js` presents material reservations, repairs and staff orders. Reuse costs, known capacity/shelter changes and dependency explanations. | Rights, builder/support, paid time, weather, occupied rooms and in-flight reservations. A room upgrade is not automatically removable furniture. |
| Other home/furniture entries | `src/home_furniture_panel.js` is a contextual readout linking Homes. Keep a selected-subject handoff rather than a second independently wired replacement screen. | Same current home and effect projection; avoid duplicate eligibility calculations or independent mutation. |
| Crafting and supplier comparisons | Adjacent proposal, not exercised in this round. Known ingredient substitutions, output comparisons and offers could use the same review grammar. | Actual recipe constraints, uncertain quality, seller location/stock/current quote, currency, shipping and ownership. Catalogue compatibility is not procurement eligibility. |

New implications beyond the prior round: a stat upgrade may reduce storage capacity or remove a service during the pack/install gap; compare functional availability as well as numbers. Native storage guards may reject packing before the replacement is fitted, even when the final configuration would fit. That is a real command limitation, not something to bypass with temporary duplicated capacity. Household/landlord furnishings retain their ownership, reserved inputs retain their claims, and a fuelled hearth must satisfy its native removal guard. If atomic exchange is later wanted, implement it in the native transaction owner with explicit invariants rather than two UI clicks disguised as atomic work.

Installed quality/condition and provenance must remain tied to the actual instance. Display compatibility separately from possession, access and readiness. Compare all known losses as well as gains; a larger number is not universally better and some choices affect costs, upkeep or world mechanisms outside a single score. Another use may already consume an item before the final click; stale review then re-quotes rather than silently substituting another instance. Automation intent should refer to native supported operations and respect the current policy for interrupted or unsupported replacement. No extra queue was added.

### PT62: LATER / DELEGATE, smallest useful follow-up

| Proposal | Capability / effort | Reopen and done check |
| --- | --- | --- |
| Native tool/gear adapter for the selected review pattern | Sol medium / medium | Reopen if this interaction is useful. Use existing gear quotes and actual carried parts; one real change and refusal/cancel path, known before/after, identity/condition/costs retained, rebuilt desktop and persistence evidence as applicable. |
| Direct home quote/command ports | Sol medium / small-to-medium | Reopen for production adoption. Remove DOM proxy, retain staged semantics or explicitly implement a native atomic exchange; same current/baseline outcomes, failure and reload checks under AD36/AD43. |
| Acquisition-aware comparison | Sol medium / medium | Reopen when chosen supplier/task needs it. Separate owned/local/retrievable/purchasable options, real quote and trip costs, chosen budget; no invented delivery or buyback. |

No worker dispatched, native gear refactor, universal replacement engine or new content tier. Default remains one proved home interaction, then one materially different native consumer to justify extraction (AR11). Full runtime completion/installation is not claimed by a prototype receipt. Selection remains a proposal under AD32.

Verification receipt, PT59-PT62:

- `node prototypes/workbench/studies/functional-home/build.mjs`: PASS; isolated native bundle `cdd2eb177d8b1916e0925d3001f9fb6e5e3528c3302fbe4bdd9d92277b42af32`, overlay `0535e023233ab6ae7ca0f421033d8b287a7e70cd181e4201036c21b50794db9e`; generated INPUTS binds sources and runtime outputs. Existing `travel_legs.js` duplicate-key warning remains.
- `node prototypes/workbench/studies/functional-home/replacement-check.cjs http://127.0.0.1:49684/`: PASS, 16 focused checks, zero page errors; native fixture spend/time, pure preview, missing carried option, stale review, item conservation, intermediate/completed reload, reverse operation, same-state baseline switch, 1920/1536 at actual 14/21 px, separate synthetic tool renderer probe and registered workbench load. [Receipt](../../prototypes/workbench/studies/functional-home/evidence/replacement/checks.json); screenshots in that directory. Agent visual inspection covered final 1920 at 14/21 px. Scrolling is necessary for selected detail; this is not a no-scroll layout.
- `node prototypes/workbench/studies/functional-home/check.cjs http://127.0.0.1:49684/`: PASS, original 16 home checks, zero page errors. Optional resource/pack 404 console messages remain; no optional-pack route claimed.
- `studyFreshness` for functional-home and home-replacement: matching, no changed input/output identities after final tests. Synthetic probe source is a separate workbench contract exercise, not part of the native bundle.
- `npm run check:docs`: unrelated shared-checkout findings remain; no findings in this round's DESIGN/audit paths. Task-path `git diff --check`: PASS. No production-runtime full suite run for this prototype-only extension; no persistence schema changes, export/import or installed-app proof. No commit/push. Agent-verified, not human-reviewed.

## Round 26, 2026-11-01: native equipment reviews and UI priority check

Weibao requested real tool repair and component-swap adapters, housing benefits and deeper implications, then asked whether this system deserves focus compared with general UI and higher priorities. Treat the later question as a scope check: finish the bounded adapters already built, record useful implications, and recommend sequencing without turning an agent recommendation into accepted priority. Existing LOTM-first direction, AD32/AD45/AD46, AR3/AR7/AR8/AR11/AR12 and DSG5-DSG19 retain authority. Skills: prototype-to-decision and more-to-consider. No agents, paid assets/APIs or new dependencies. No native product source or personal save changed by this task.

### PT63: ACT NOW, real adapters with different rules

[Equipment study](../../prototypes/workbench/studies/equipment-comparison/README.md) uses the existing isolated workbench build, native shell and actual command owners. Public midgame fixture is explicitly prepared with a worn identified pickaxe, carried identified sword, stock and enabled durability/crafting. This is test setup, not earned acquisition. The isolated entry bundles `main.js` once with narrow references to the existing tool and workshop quote/execute exports; it does not create duplicate domain instances or change production exports.

Native hand repair is a timed, probabilistic job. The review shows actual skill/station/material shortfalls, success chance, conditional restored condition, failure loss of best condition, duration and the materials reserved at admission. Condition does not improve at start. The existing cancellation returns reserved material; completion uses the native clock and outcome draw. Short requirements can still permit a weaker attempt. Native gear swap is immediate under its current command, consumes the selected part and any maker-specific service stock, keeps the gear's identity/current condition and returns the replaced part at degraded quality. Those differences remain visible rather than being flattened into one Replace button.

The review renderer now supports task-specific choice/review labels and unique reason IDs for concurrent instances. Adapters own operation semantics. Deterministic swap comparisons use native unworn item calculations, explicitly excluding wear and final character combat modifiers. Initial inspection exposed a misleading comparison if a future uncommitted item key used default full condition while the existing key used actual wear; the adapter now compares unworn native base values on both sides and shows retained condition separately. Predictions do not temporarily mutate live durability to compute a preview. A native command's own quote revalidation remains authoritative even when the displayed review is stale.

Prototype routing initially placed the new view beside a parked/hidden workspace module. It now follows the actual expanded native Gear workshop node after opening the view. This is a disposable presentation bridge, not a new navigation owner. Current Tools/Gear screens remain reachable on the same running state. Production registration, direct ports and whole-context identity optimization remain future work if this pattern is selected.

### PT64: ACCOUNT FOR NOW, general UI outranks more comparison infrastructure

Recommendation: do not make a universal cross-panel comparison system the next major project. A comparison is valuable when alternatives have consequential tradeoffs; simple actions can retain a concise inline quote. A universal wizard would add clicks and maintenance to ordinary play. The current two real adapters answer the reuse question sufficiently for this round; they do not justify converting every panel.

Rank the next bounded work by player outcome, within existing LOTM-first direction:

| Proposed order | Player outcome | Scope and observable check |
| --- | --- | --- |
| P1: finish the selected connected LOTM situation | Understand where/who they are, available choices, costs, result and continuation | Use the current campaign/coverage owner. A case journey crosses real suppliers, command, consequences and return. Existing L2b below-floor work remains in its owning queue; this record does not take its files or dispatch workers. |
| P2: readable current situation and action hierarchy | Identify the immediate decision and meaningful changes without scanning unrelated panels | On a populated 1920×1080 state at actual 14/21 px, relevant actions/status and inline reasons are reachable, Reports preserves useful consequences, and unrelated optional surfaces do not displace the task. Keep useful desktop panels independently visible. |
| P3: findability and continuity | Find the relevant person/item/task and return without losing context | Reuse Find/palette, navigation and selected-subject handoffs that already exist. Test an actual confusing route before adding another global menu. Preserve focus, selection and reading position. |
| P4: consistency and visual identity | Read the same meanings/costs across worlds while recognizing each world's task form | Apply existing tokens and DSG world hooks; fix concrete wrapping/contrast/empty-state issues on the selected slice. Avoid a new skin/framework or all-world sweep as a prerequisite. |
| P5: specialized depth | Compare complex gear, refine housing or add routines where play needs them | Reopen with a repeated player difficulty or selected activity consumer. Reuse this prototype's patterns where helpful; no blanket panel conversion. |

Evidence context: `UI_CAPABILITY_GAPS_2026-10-30.md` records findability/first-screen problems and also existing Next step, Find/palette and inventory tools. Its October observations are historical leads, not verified current defects. `WORLD_UI_KIT_CENSUS_2026-10-30.md` supplies six basic questions but does not prove today's coverage. The live `LOTM_SITUATION_UI_COVERAGE.md` has later KJ1/KJ2 receipts and LM1-LM5 gaps; use those current owners before claiming an old opening defect is still present. This pass did not launch a fresh LOTM audit or reorder its queue.

Budget choice: stop after the current native experiment and documentation. A single connected player journey finds higher-value problems than polishing more hypothetical component combinations. No numeric allowance claim is inferred from the earlier task's dated quota observation. UI clarity can require a missing underlying supplier/command; layout alone cannot make an unsupported action work.

### PT65: ACCOUNT FOR NOW, home features with actual consumers

Added a What this home offers disclosure to the existing home prototype, reading actual `homeRestable`, storage access and current native learning effects. It states that practice still needs an available activity and inputs. It introduces no new passive bonus, crafting station, simulation clock or save slice. [HB4 housing palette](../representations/HOMES_AND_BASES.md#hb4-useful-housing-benefits-2026-11-01) saves rest/preparation, logistics, learning/evidence, household/privacy and portable/borrowed alternatives, with existing versus proposed mechanisms distinguished.

Deeper implications: a home is an access/custody/work dependency as much as a bonus source. Packing a furnishing, moving or losing tenure can interrupt work; prepared materials and shared funds keep their actual owners. A supposedly safe room must have world-specific protection mechanisms, not a decorative safety label. A bookcase does not grant unread knowledge; routine automation does not gain hidden warnings. Shared facilities, rentals and portable shelters can support real goals without forcing house ownership on every life. These are account-for-now constraints, not a new housing feature wave.

### PT66: LATER / DELEGATE, when to revisit cross-panel reuse

Reopen production comparison integration when a selected player task needs it, not because another panel exists. Sol medium, small-to-medium: use native read/quote/execute ports, operation-specific uncertainty and completion models, current/predicted values with the same condition basis, accessible independent instances, native failures and persistence where changed. Done: a second actual task becomes clearer with less bespoke wiring; simple actions retain their short route. No worker or new framework dispatched.

Before broad adoption, qualify the missing dimensions on the selected consumer: stable quote/instance identity; reservations shared across panels; deterministic versus conditional outcomes; final character versus base-item effects; changed input stock and maker/location/support; cancellation after partial work; save/reload/import where the feature changes persistence; keyboard focus and readable large text. Selection and a preview are intent, not acquired output. Current proof covers prepared tool repair and sword head swap, not all equipment, worlds, remote suppliers, mods or an installed app.

Verification, PT63-PT66:

- `node prototypes/workbench/studies/equipment-comparison/build.mjs`: PASS; isolated native bundle `5cc9ea19f7b284a93456d3d9b7900551efc8f3789ef6484f3725df8617705110`, overlay `9d71fe7849a6a81e18ac13466e96ec12b68374c4dc09e4c706c7a98fe2135dc7`. Existing duplicate-key `dial` warning remains. Generated INPUTS binds sources/outputs; the test-only native entry is not installed in production.
- `node prototypes/workbench/studies/equipment-comparison/check.cjs http://127.0.0.1:64516/`: PASS, 17 focused checks, zero page errors. Real repair quote/start/reservation, cross-panel stale review, refund/cancel, in-flight reload, clock-driven completion, actual swap/custody/salvage/base-value forecast, maker fee/refusal, incompatible part, same-state current screen, four viewport/text combinations, final reload and workbench loading. [Receipt](../../prototypes/workbench/studies/equipment-comparison/evidence/checks.json). Snapshot comparisons exclude the native export timestamp, not gameplay state. Successful final run supersedes partial/failure receipts from harness fixes.
- `node prototypes/workbench/studies/functional-home/replacement-check.cjs http://127.0.0.1:64516/`: PASS, 17 checks, zero page errors, including real home support disclosure and the existing replacement/reload/reversal cases. Reused native bundle `cdd2eb177d8b1916e0925d3001f9fb6e5e3528c3302fbe4bdd9d92277b42af32`; final home overlay `1c08c953c9f81e57272d9a409cbd236608ab70bc7679a3567928e3a22c6a604e`. Later rebuild changed registry/test documentation identity, with runtime bundle/overlay unchanged from that passing run.
- Freshness for equipment-comparison and home-replacement: matching source/output hashes, no changed inputs after final build. Headless desktop screenshots captured at 1920×1080 and 1536×864, actual 14/21 px; agent inspected final populated review at 1920. Selected details scroll; no horizontal page overflow in checked views. Optional resource/pack 404s remain outside coverage.
- Task-path `git diff --check`: PASS. `npm run check:docs`: unrelated shared-checkout findings remain; new owner-path lint findings were corrected. No production full suite, installed-app proof or new schema. Native reload tested; export/import not exercised by this prototype extension. Agent-verified, not human-reviewed; no commit/push. No further comparison/housing expansion dispatched after the priority check.

## Round 27, 2026-11-01: populated LOTM journey before more UI infrastructure

### PT67: ACT NOW, one native general-UI slice

Weibao selected the recommendation to test a populated LOTM journey and fix exposed gaps, with clarity, navigation, costs/consequences and budget in focus. [Journey receipt](../gm/dispatch/refinement-audits-2026-10-31/LOTM_POPULATED_UI_JOURNEY_RECEIPT.md) owns source changes, target viewport, input identity and exact acceptance. MCP first sampled fresh developer-lead desk/notebook work. Rebuilt browser then uses a named earned KJ2 checkpoint for a richer current task, actual shopping money and supplies, travel, timed work and preparation. It does not fabricate a fresh-life inventory or replay the entire novel.

Corrections: current task and admitted next action/walk become directly connected without auto-execution; existing quote terms and last settled consequence are labelled; common Wait controls follow scene choices; Tingen's native purse balance displays pence instead of home-world coin symbols. Native costs, stock, time, eligibility, knowledge and sequence authority are unchanged. A pure helper reads the admitted projection; no extra quest state or comparison framework. New production source is limited to the owning UI, leaf presentation helpers and a currency-format hunk; installed packaging/commit/push are outside this request.

### PT68: ACCOUNT FOR NOW, full saga without a foundation detour

[Saga-wide advice SG1-SG6](../gm/dispatch/refinement-audits-2026-10-31/LOTM_KLEIN_FULL_JOURNEY_PLAN.md#saga-wide-delivery-advice-and-populated-ui-pass-2026-11-01) saves the strategy in the existing campaign owner: saga-wide dependency horizon, first-novel current spine, source-qualified contiguous situations, later counterexample checks, actual shared mechanisms and arc-to-arc continuity. Qualified source, mapped operations, engine support, playable continuity and desktop proof stay distinct. Sequel/other-life coverage is not inferred from Klein's existing 34 stages. This round did not research the saga anew, dispatch readers or estimate a fictional completion date.

### PT69: LATER / DELEGATE, adjacent work held

Higher-value follow-up is the next actual player situation through the campaign/coverage owners. Do not grow generalized comparison, room art, universal queues or panel conversion merely because they are available. Existing HB4 and CA1-CA5 retain housing and automation ideas. Concrete leads to reopen when relevant: known-only Maps/Nearby/Find handoffs and selected-subject continuity; report/receipt provenance across completed work; other currencies and multiple payer accounts; interrupted local/remote work and its support; ordinary alternate-life starts. Sol medium, bounded small-to-medium per chosen consumer; done is a native action/refusal/result/return at actual desktop 14/21 px, plus persistence proof where changed. No worker or additional feature dispatched.
