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
