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
