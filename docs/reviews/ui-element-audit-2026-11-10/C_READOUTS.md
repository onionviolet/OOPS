# UI element audit, lane C: readouts (UIC98)

Round 43 of [the UI design core audit](../../audits/UI_DESIGN_CORE_AUDIT.md). Rules checked: UR100, UR101, UR115 (meters and bars), UR116 (progress and timers), UR117 (numbers and units), UR118 (chips, badges, tags), UR119 (lists and rows), UR120 (tables), UR121 (icons and glyphs), UR122 (portraits and figures), UR123 (logs and Reports lines), UR125 (empty, loading and error states), with UR61, UR37 and UR74 as the cross-checks. Audit only: no file under src/, styles/, tests/ or other docs/ was edited. Findings are proposals, not accepted decisions.

## How measured

- **Probe**: scratch scripts in `/private/tmp/claude-501/-Users-weiwei-code-yet-another-idle-rpg/1a897237-6eb5-4362-8c4d-98423e6bc482/scratchpad/element-audit-C/` (`probeA.mjs` meters and progress, `probeB.mjs` lists, chips, tables, icons, `probeC2.mjs` empty and error states, `probeD1.mjs` and `probeD2.mjs` logs, people meters, figures, skills, `probeG.mjs` number text, `probeI.mjs` chip styles, `probeJ.mjs` away bank). Raw results are the `*.json` files beside them. Screenshots are in the same folder only, because they can show sealed text. None of this is in the repo.
- **Harness**: `scripts/playtest/lib.mjs` (`buildBundle`, `serve`, `Session`): headless Chrome, viewport 1920×1080, seeded randomness, frozen wall clock (2026-10-26T15:00Z), `?test_hooks=1`. No window opened.
- **Fixture**: `tests/fixtures/perf/mid.json` with the `availabilities.recipe.undefined` entries deleted, the same edit `broader-ui.mjs` makes. Without the edit the page logs `No such element with availability as "recipe" -> "undefined"`. With it, page errors were empty in every run. Variants: hp 10/60 and stamina 4/40 (`character.hp_to_full=50`, `stamina_to_full=36`) for the low-state check; `expansion.awayBank={schema:1,bankedMinutes:180,remainderMs:0}` for the away bank. Play states were reached through the UI (Find work, patrol, Stop, item Use, travel) and `Session.step`.
- **Bundle identity**: bundle built into a temp dir from HEAD `55fbeb44b`; src/ was clean (the dirty files in `git status` were docs only). Bundle sha256 prefix `5388d7c38a5defc2`. This is a fresh build, not the tracked `dist/bundle.js`.
- **Census method**: `grep` over `src/**/*.js` (1413 files). Counts are lines that match, so they include definitions and imports. They size a kind; they are not call-site proofs.
- **Limits**: one fixture, one world (Village), desktop only. Private packs were blocked (empty manifest), so LOTM and household meters are not covered. Evidence labelled "source" is read from code, not measured in the DOM. Pass rate is PASS / (PASS + GAP) per kind, with N/A and not-exercised cells left out.

## Pass rate by kind

| Kind | Rules | Consumers | PASS | GAP | Pass rate |
| --- | --- | --- | --- | --- | --- |
| Meters and bars | UR115, UR61, UR37 | 7 | 21 | 10 | 68% |
| Progress and timers | UR116 | 4 | 8 | 4 | 67% |
| Numbers and units | UR117 | 7 | 4 | 8 | 33% |
| Chips, badges, tags | UR118 | 5 | 9 | 2 | 82% |
| Lists and rows | UR119 | 5 | 7 | 3 | 70% |
| Tables | UR120 | 4 | 4 | 4 | 50% |
| Icons and glyphs | UR121 | 5 | 2 | 5 | 29% |
| Portraits and figures | UR122 | 3 | 8 | 0 | 100% |
| Logs and Reports lines | UR123 | 2 | 3 | 3 | 50% |
| Empty, loading, error | UR125 | 8 | 5 | 3 | 63% |

Totals: 50 consumer rows, 71 PASS, 39 GAP (65%). Figures lead because one shared component (`src/ui/figure.js`) builds the name, text form and unknown state. Numbers and icons trail because no shared component or formatter exists.

## Meters and bars (UR115, UR61, UR37)

Checks: Q says which question it answers (UR61); V value and maximum as text; T thresholds that change play are marked; C colour is not the only signal (UR37); A role and values reach assistive tech; U unknown reads differently from a low value (UR61, UIV6).

| ID | Consumer | Q | V | T | C | A | U | Evidence | Screenshot |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| M1 | You panel hp (`#character_health_div`) | PASS | PASS | GAP | PASS | GAP | N/A | Text `60/60 hp`; `role` null, no `aria-valuenow`; ariaSnapshot reads `text: 0 / 10 xp 40/40 stamina 60/60 hp`. At 10/60 hp the fill is 17% wide with the same gradient and no `data-state`, class or warning element (0 markers) | A-vitals-baseline.png, A-vitals-low.png |
| M2 | You panel stamina | PASS | PASS | GAP | PASS | GAP | N/A | `40/40 stamina`; shows `40/40 (+0.5/s) stamina` while a meal regenerates. At 4/40 the bar changes width only | A-vitals-low.png |
| M3 | You panel xp | GAP | PASS | N/A | PASS | GAP | N/A | `0 / 10 xp`. Does not say "to the next level"; spacing around `/` differs from hp (`60/60`) | A-vitals-baseline.png |
| M4a | People: Bond meter (`.meter-bar`, `src/meter_bar.js`) | PASS | PASS | N/A | PASS | PASS | N/A | `Bond: Met 0/4 · not started`; `role=progressbar`, `aria-valuetext` "Bond: Met 0/4, not started"; title names the next step | D-people-meters.png |
| M4b | People: Trust and Their warmth | GAP | PASS | N/A | PASS | PASS | GAP | `Their warmth: not read now 1/2` and `Trust: You have not decided 1/2` draw a half-filled bar with `data-stale="false"`. Unknown looks like a middle value. A regard is a signed stance but is announced as a progress bar. Spec in `src/ui/relationship_web.js:116` (`kind:'track', value, max:2`) | D-people-meters.png |
| M5 | Skills panel row bar (`.skill_bar_max`) | PASS | GAP | N/A | PASS | GAP | N/A | `Spatial awareness : level 2/60` and `6.1%`; raw `8 / 130` only in the tooltip; no role or aria values | D-skills.png |
| M6 | Current work xp line (`#action_xp_div`) | PASS | PASS | N/A | PASS | PASS | N/A | `Getting 1 base xp per in-game minute to Spatial awareness (27.77% [20 / 72])` and `Next level in 52 minutes`; plain text | A-patrol-t0.png |

Census: `meter_bar.js` is imported by 15 files; legacy bar markup (`_bar_`, `bar_parent`, `skill_bar`, `progress_bar`, `style.width = …%`) appears in 12 files and 155 lines; only 3 files set `role="progressbar"` or `"meter"`. Two meter systems run side by side. The UR115 delta-on-change check was not run (see Not checked).

## Progress and timers (UR116, UR61)

Checks: U real units in the text; S pending, interrupted and done read differently; B the bar matches the work and reaches full; A the bar is exposed to assistive tech; N a long calculation says "computing" then "ready".

| ID | Consumer | U | S | B | A | N | Evidence | Screenshot |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P1 | Patrol work line and pay bar (`#workspace_current_work`, `#gathering_progress_bar`) | PASS | PASS | GAP | GAP | N/A | Text `next full-round pay in 1 hour 30 minutes`. Pending: `next full-round pay in 2 hours`. Interrupted: `Stop early: no pay for the unfinished round`, `(pay accrued on stopping: nothing)`, then `Hero stopped patrolling: no paid round completed`. Done: `Hero earned 5C`, purse 10C 4W to 15C 4W. Bar width is `385*time/needed px` (`src/display.js:5098`, `5175`) inside a 1132 px track: measured 0%, 4%, 17%, 26%, 34% at minutes 0, 15, 60, 90, 119 of 120, so it cannot fill. No role, label or `aria-valuenow` | A-patrol-t0.png, A-patrol-t119.png, A-patrol-done.png |
| P2 | Next-level line under the work | PASS | N/A | PASS | PASS | N/A | Percent matches `[x / y]` (20/72 gives 27.77%); text line | A-patrol-t0.png |
| P3 | Away bank row (`#return_digest`) | PASS | N/A | N/A | PASS | N/A | `Banked time: 180 minutes. Spending it plays the current routine forward at the normal pace and stops at any choice.` and `Spend 60 banked minutes`. No bar; the 7 day capacity is not shown until time is lost. Spending was not exercised | J-away.png |
| P4 | Loading screen (`#loading_screen_loading_text`) | N/A | PASS | N/A | GAP | GAP | Sequence `LOADING`, `Translating the meows`, `Waiting for you to click 'PLAY'` with status `No issues in the loading process :)`. The ready state reads differently; the busy state names no real work; `#loading_screen_loading_progress` is empty with no role | none |

Mixing showed no timed progress surface in this fixture (no progress elements). Crafting commits at once in the broader-ui flow, so no progress was measured.

## Numbers and units (UR117, UR74)

Checks: S the same quantity formats the same way everywhere; U units are named; P percent and points are told apart; D deltas carry a sign and a word; E exact value one step away; N the player's notation setting is honoured.

| ID | Consumer | S | U | P | D | E | N | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| N1 | Money | GAP | GAP | N/A | N/A | N/A | N/A | The purse is `10C 4W` in the inventory header and `104 coins` in Homes. The patrol offer reads `50 coins`, the debt line `50-coin debt`, the payout `Hero earned 5C`. Credit rows read `Borrow 10`, `limit 10`, `premium 4`, `pays up to 37` with no unit. `format_money` has a local-label branch (`localMoneyLabel`) but the raw `N coins` templates bypass it |
| N2 | Percent | GAP | PASS | PASS | N/A | N/A | N/A | Crit chance is `5.0%` in the sidebar and `5%` in Stats. Crit damage is `Crit × 130.0%` in the sidebar and `Critical damage ×1.3` in Stats. Health recovery says `0 % max hp/s` (space) beside `0%` elsewhere. An unlabelled `[40%]` sits on an inventory row. Percent vs points is clear: `Neutral 0` (points) beside `+0%` (percent), `16% per 28 days` |
| N3 | Durations | GAP | PASS | N/A | N/A | N/A | N/A | One meal buff reads `60m Buff` in Condition, `1h` in item detail, and the same game says `1 hour`, `2 hours`, `[5m]` on travel, `28 days`. Units are named in each, the style is not shared |
| N4 | Derived stats | GAP | PASS | N/A | N/A | PASS | N/A | `AP 32` and `EP 25` in the sidebar, `31.623 AP` and `25.298 EP` in Stats. The exact value is one panel away, so E passes; the two surfaces round differently |
| N5 | Deltas in the item compare | N/A | GAP | PASS | PASS | N/A | N/A | `▼ −0.01 lost`, `▲ +0.5 gained`, `Defense 0 ＝ no change`: sign, glyph and word present. Plural slips `1 points`, `1 hits`; Defense has no unit; `Agility ×0.99` pairs a multiplier with an additive delta |
| N6 | Ratios | GAP | PASS | N/A | N/A | N/A | N/A | `0 / 10 xp`, `[30 / 40]` (spaced) against `60/60 hp`, `40/40 stamina` (tight) |
| N7 | Scientific-notation threshold | GAP | N/A | N/A | N/A | N/A | GAP | Source: `game_options.expo_threshold` is read only inside `expo()` in `src/misc.js`, and `expo(` appears in 2 files (`misc.js`, `display.js`). `formatKnownNumber` in `src/absorb_p23/known_detail/presentation.js` is a second notation path (`toExponential(2)` or `Intl` compact). Stats and vitals text bypass both. Not measured with a large value |

## Chips, badges and tags (UR118)

Checks: F states a fact; K a clickable chip looks clickable and an inert one does not; X a count badge caps its display; G many chips group.

| ID | Consumer | F | K | X | G | Evidence | Screenshot |
| --- | --- | --- | --- | --- | --- | --- | --- |
| C1 | Vows and trials chips (`.ui-chip`) | PASS | PASS | N/A | PASS | 15 chips, all `span`, cursor default, transparent background, 19 px tall; rows of 2 to 4 wrap with no overflow (`flex-wrap: wrap`). Tones accent, warn, good each carry text (`+6% body`, `scar 1 if broken`) | I-pledges.png |
| C2 | People "How you know" chips (`.cs-chip`) | PASS | PASS | N/A | N/A | `A plain look`, `You have met`: inert, same look as `ui-chip` but a different class | D-people-meters.png |
| C3 | Item "Known uses" (`button`) | PASS | PASS | N/A | N/A | `Bread kwas · cooking`: pointer cursor, filled background, 28 px, against 19 px for inert chips | B-inventory-selected.png |
| C4 | Navigation count badge (`button[data-new-count]`) | PASS | N/A | GAP | N/A | Accessible name `Knows, 1 new`. The number is drawn by CSS from `data-new-count` (`styles/ui_extras.css:32`) and `paintBadge` (`src/change_badges.js`) has no cap; no `99+` string exists in `src/` | B-inventory-selected.png |
| C5 | Inventory tab counts (`All 5`, `★ 0`) | PASS | N/A | GAP | N/A | Name `Favorites: 0 stacks, 0 items. Counts ignore the search.`; no display cap in source | idle.png |

Census: chip-like class families in `src/` are `ui-chip`, `cs-chip`, `sg-chip`, `pwc-chip`, `ud-chips`, `scene-chips`, `versus-chip` (7), across 47 files. The grouping threshold (rows wider than the region) was not triggered with this data.

## Lists and rows (UR119, UR27, UR52)

Checks: A anatomy is glyph, name, key fact, trailing value or action; S sort stays stable across a tick; K selection survives a tick; X selection is exposed to assistive tech.

| ID | Consumer | A | S | K | X | Evidence | Screenshot |
| --- | --- | --- | --- | --- | --- | --- | --- |
| L1 | Inventory rows (`#inventory_content_div`) | PASS | PASS | PASS | GAP | Children: favourite star glyph, name and count, trailing price (`4C 6W`). Order identical before and after 10 minutes; detail panel still shows Stale bread. Selected row has `data-ui-selected` only: no `aria-selected`, `aria-current` or `aria-pressed` | B-inventory-selected.png |
| L2 | Around you rows (`[data-inspect-nearby]`) | GAP | N/A | PASS | PASS | Anatomy is bold name plus a small role line, no leading glyph, no trailing value. `aria-pressed` stays `true` after a tick | idle.png |
| L3 | Location action rows | PASS | N/A | N/A | N/A | Anatomy: icon (aria-hidden), name, sub-choices | B-travel-open.png |
| L4 | Travel sub-list | GAP | N/A | N/A | N/A | One sentence per row: `Go to [Wild willow stand] [5m]`, with the time folded into the name and a blank-checkbox glyph as the leading mark | B-travel-open.png |
| L5 | Journal task rows | PASS | N/A | N/A | N/A | Status glyph, description, empty trailing cell | none |

Three row anatomies appear in the five lists sampled. Sort stability was measured only on the inventory.

## Tables (UR120)

Checks: H header semantics (thead, `th` with scope, caption or label, no empty headers); N numbers right-aligned with units in the header; C compare mode where two rows are chosen. Sticky header and sort controls read N/A: every table has 8 rows or fewer, and none has sort controls (`aria-sort` appears in one file, the figure table form).

| ID | Consumer | H | N | C | Evidence | Screenshot |
| --- | --- | --- | --- | --- | --- | --- |
| T1 | Trade standing (`table.ui-table`) | PASS | GAP | N/A | 4 `th` all with scope; 6 numeric cells, 0 right-aligned; header names (`Standing`, `Sells to you`) carry no unit | B-table-economy_standing.png |
| T2 | Held equipment comparison | GAP | N/A | PASS | `aria-label` "Held equipment comparison" and a compare layout, but 3 `th` with empty text and no scope | B-table-equipment-comparison.png |
| T3 | Compare the lives (`#start-compare`) | PASS | N/A | PASS | Caption, 8 `th` with scope, compare mode | B-table-lotm.png |
| T4 | Appearance preview | GAP | GAP | N/A | 2 `th` without scope; the `Amount` cell is left-aligned | B-table-customization-preview.png |

## Icons and glyphs (UR121)

Checks: N each icon has an accessible name or is hidden from assistive tech; M one meaning per icon.

| ID | Consumer | N | M | Evidence |
| --- | --- | --- | --- | --- |
| I1 | Location action and travel icons (`i.material-icons`) | PASS | GAP | 7 visible ligatures, all `aria-hidden="true"`. `check_box_outline_blank` marks a safe travel destination here and an unfinished task in the Journal |
| I2 | Inventory favourite star (`.item_fav_icon`) | GAP | N/A | Ligature text `star_border` sits in the row with no `aria-hidden`; the row text reads "star_border" before the item name |
| I3 | Journal task status (`.task_status_icon`) | GAP | N/A | `check_box` and `check_box_outline_blank` ligatures, not hidden; done versus open is carried by the glyph shape and a class |
| I4 | Skills category header arrows | GAP | N/A | `<a class="material-icons">keyboard_arrow_up</a>` and `keyboard_arrow_down`, no name, no `href`; list text reads `keyboard_double_arrow_downEnvironmental skills keyboard_arrow_up keyboard_arrow_down` |
| I5 | Unicode glyph controls (`▾`, `★`, `×`) | PASS | GAP | Each has a title or `aria-label` (`Collapse Vitals`, `Nothing to clear`). `▾` means "collapse this module" on four controls and "opens a view menu" on the Inventory and Reports controls. `uiCheck` found no unlabelled or bare-toggle controls |

Census: `material-icons` appears in 5 files and 45 lines (41 in `src/display.js`); only 3 files set `aria-hidden` near one.

## Portraits, item art and figures (UR122)

Checks: N accessible name; T text form; U unknown and absent read differently.

| ID | Consumer | N | T | U | Evidence | Screenshot |
| --- | --- | --- | --- | --- | --- | --- |
| F1 | People: relationship web (`src/ui/relationship_web.js`) | PASS | PASS | PASS | `svg role=img` with `aria-labelledby` title and `desc`; `Figure`, `Table`, `Matrix` switch (`aria-pressed`); markers have `aria-label`; `desc` lists "Unknown: …" and the key `? unknown`. The Table form was switched on but its content was not captured | D-web.png |
| F2 | Gathering view (`src/ui/gathering_view.js`) | PASS | PASS | PASS | Same role and `labelledby`; same form switch; site table reads `12 of 12 left; regrows 12 a day; not gathered here yet, so unknown` | D-gathering.png |
| F3 | Body glyph in Condition (`.palette-body-pose`) | PASS | PASS | N/A | `人` is `aria-hidden`; the summary text `Body · Human` carries the fact | idle.png |

Census: `src/ui/figure.js` has 27 consumer files; the name and description are generated from the spec (`figure.js:240-242`), which is why the rate is high. The lives, rite, ladder and body figures were not reached on this fixture; the gallery page `ui-preview.html` rendered no figures when opened headless from the served root. No item art or portraits exist in the DOM (4 `img`, none art).

## Logs and Reports lines (UR123, UR44, RPT1 to RPT14)

Checks: F filters; T each line carries its time; R repeats fold with a count; C history is capped with a dial and older lines quieter; K every line has a kind the filters can use.

| ID | Consumer | F | T | R | C | K | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| G1 | Reports stream (`#message_box_div`) | PASS | GAP | PASS | GAP | GAP | Filter box lists Growth, Events, Crafting, Combat, Loot, World; hiding all gives `All report kinds are hidden. Choose kinds below to show existing history.` Lines carry no time element; only the day header has `data-calendar-date`. Repeat folding is source evidence (`src/report_repeats.js`, `data-repeat`); the probe's travel lines alternated, so no `×N` rendered. Caps are fixed per kind (combat 80, events 40, loot 28, unlocks 40, background 28, crafting 28; `src/display.js:1158-1168`): no dial, no quieter older lines, no notice. Two Tessa lines carry `data-log-kind="undefined"` (`src/main.js:3545` calls `log_message` without a type) |
| G2 | "Right now" block | N/A | PASS | N/A | N/A | N/A | `Now: Mon, Summer, Day · 08:12 at Village` |

Only two log-like consumers were found in this fixture. The return digest row appeared with the seeded bank (P3) but holds no history.

## Empty, loading and error states (UR125, UR32, UR55)

| ID | Consumer | State | Result | Evidence |
| --- | --- | --- | --- | --- |
| E1 | Inventory find, no match | empty | PASS | `No items match "zzzz". Clear the filter to see all.` |
| E2 | Home at a glance | empty | PASS | `No home yet. Rent or buy one from the Village home supplier, or build one at a wild site from gathered material.` |
| E3 | Known things, Creatures | empty | PASS | `Defeat an enemy and it is recorded here. Open People` |
| E4 | Reports with every kind hidden | empty | PASS | `All report kinds are hidden. Choose kinds below to show existing history.` |
| E5 | Skills panel before any skill | empty | N/A | The panel is gated: `Alt+k` opened nothing and `#skill_list` is an invisible empty div |
| E6 | Condition with no effects | empty | GAP | `No active effects`: does not say what would add one |
| E7 | Loading screen | loading | GAP | Flavour text (`Translating the meows`), no real unit, no role on the progress div (see P4) |
| E8 | Import of a bad file | error | PASS and GAP | Report line `Import rejected. Current save kept. The file is not a valid save.` says what happened and what was kept; it gives no next step (for example, use a file made by Export). It appears only in Reports, with no dialog or toast |

## Number-formatter census (answers UIC101)

Answer: there are several, not one. The grep found 43 named helpers in 5 families, plus raw `toFixed` and rounding sites. Counts are matching lines / files, including definitions.

| Family | Helper (file) | Lines / files | Notes |
| --- | --- | --- | --- |
| Notation | `expo` (`src/misc.js`) | 8 / 2 | The only one tied to the player's `expo_threshold`; used in `display.js` |
| Notation | `formatKnownNumber` (`src/absorb_p23/known_detail/presentation.js`) | 3 / 2 | Second path: `toExponential(2)` or `Intl.NumberFormat` compact |
| Numbers | `statistics_panel.js` `num`, `loadouts.js` `fmt` (1 dp), `titles_ui.js` `fmt` (floor, `en-US`), `tempo_fight.js` and `ui/figure.js` `round1`, `skill_ladder.js` `num` (3 dp), `ui/combat_situation.js` `fmt`, `round_item_price` (23 / 5), `plural` (38 / 17) | 11 helpers | `toLocaleString`: 13 lines in 7 files |
| Money | `format_money` (17 / 2), `localMoneyLabel` (2 / 2), `formatCoins` (1 / 1), `coinWords` (2 / 1), `moneyText` (2 / 2), `currency_subunits.js` half-coin `num` | 6 helpers | Plus raw `N coins` strings in templates |
| Time | `format_time` (10 / 3), `format_reading_time` (4 / 2), `format_working_time` (6 / 3), `durationWords` (3 / 1), `spanPhrase`, `hhmm`, `lamplight_factory.js` `duration`, `organization_view.js` and `causal_story_ui.js` `minutes` | 9 helpers | Three styles seen on screen: `60m`, `1h`, `1 hour` |
| Percent | local `pct` in `recurring_duties`, `tools_panel`, `combat_readout` (returns a number), `aging_contact`, `household_fortunes_panel`, `economy_standing_ui` (signed), `skill_ladder`, `ui/form_adapters`, `ui/figure`, `absorb_b/furniture` (2 dp), `ui/preview/fixtures/redesigns` | 11 helpers | Plus inline `percent_xp` in `display.js`; 173 lines in 77 files build `…%` strings |
| Signed | `item_card_model.js` `sign`, `economy_standing_ui.js` `signed`, `cast_topic_talk.js` `signed` (hyphen), `ui/gu_house_view.js` `signed`, `book_world_hp_lead_ui.js` `signed`, `home_layout_panel.js` `sign` (`toFixed(2)`), plus 5 inline `sign` in `display.js` | 6 helpers | Minus is `−` (U+2212) in some, `-` in others |
| Raw | `.toFixed(` | 83 / 50 | `toFixed(1)` 35 lines, `toFixed(2)` 15, `toFixed(0)` 3 |
| Raw | `Math.round(… * 100)` | 99 / 55 | Hand-rolled percent |

## Gaps ranked

Count is consumer rows with that gap. SHARED means one component or helper change fixes several consumers; LOCAL means one file. Effort: S under half a day, M one to two days, L more than two days. Each fix is a default with a dial and a reason, adjustable.

| Rank | Code | Gap | Consumers | Likely cause | Fix suggestion | Effort | Scope |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | UR117 | The same quantity formats differently across surfaces (money, percent, crit, durations, ratios, derived stats) and the notation setting reaches 2 files | 6 of 7 | No shared formatter: 43 helpers in 5 families | Default: one `format` module (money, percent, duration, ratio, multiplier, signed) that reads the existing notation setting, with the exact value on hover or focus. Dial: start with money, percent and duration on the sidebar, Stats and Homes, then migrate by family. Reason: `5.0%` and `5%` read as two numbers (UR117, UR74) | L | SHARED |
| 2 | UR115, UR61, UR121 | Legacy bars have no role or values for assistive tech and no marked low threshold | M1, M2, M3, M5, P1 (5) | `display.js` draws vitals, skill and pay bars by hand while `meter_bar.js` already supports role, `aria-valuetext` and states | Default: render the vitals and skill bars through `createMeterBar` (or add `role=meter`, `aria-valuenow`, `aria-valuetext` to the existing update functions) and set a `warningDistance` for hp and stamina. Dial: threshold per pool. Reason: at 10/60 hp the bar reads as a plain narrower bar | M | SHARED |
| 3 | UR121 | Icon ligatures read as text or have no name, and `▾` and `check_box_outline_blank` carry two meanings | I2, I3, I4 text leaks; I1, I5 double meaning (5) | `display.js` emits 41 ligature lines by hand; only 3 files hide them | Default: one `icon(name, {label})` helper that sets `aria-hidden` or `aria-label`; split `▾` into collapse and menu glyphs; use a distinct glyph for safe travel. Dial: world glyph set (UR121 L4). Reason: a screen reader reads "keyboard_arrow_up" | M | SHARED |
| 4 | UR116 | Patrol pay bar is capped at 385 px and reads 34% at minute 119 of 120 | P1 (1) | Fixed pixel width in `display.js:5098` and `5175` inside a 1132 px track | Default: set the width as a percentage of the track and add `role=progressbar` with `aria-valuetext` from the line above it. Dial: none needed. Reason: a bar that cannot fill misreads progress | S | LOCAL |
| 5 | UR61, UIV6 | Unknown regard and warmth drawn as a half-full bar; a signed stance announced as progress | M4b (2 meters) | `relationship_web.js:116` gives every reading `value`, `max:2`, `kind:'track'` | Default: add an "unknown" meter state (hatched or empty track, `aria-valuetext` "not read now") and a signed or stance form for trust and warmth. Dial: how unknown is hatched, shared with UIV6. Reason: unknown and low must read differently (UR122) | S | LOCAL (spec) with a SHARED state in `meter_bar.js` |
| 6 | UR120 | Table headers lack scope or text; numbers left-aligned; units not in headers | T1, T2, T4 (3) | No shared table helper; 4 files build tables | Default: a `ui-table` builder that sets scope, right-aligns numeric cells and puts the unit in the header. Dial: column set per task. Reason: compare tables carry the alternate forms of figures | S | SHARED |
| 7 | UR123 | No per-line time, fixed caps with no dial or notice, untyped lines | G1 (3 checks) | `display.js:1158-1168` caps; `main.js:3545` calls `log_message` with no type | Default: add the occurrence time to each line's tooltip or compact form, expose the cap in display settings, mark the cut line ("older lines hidden"), and give every `log_message` call a type. Dial: cap per player setting. Reason: the log is the always-visible record (UR11) | M | LOCAL (three small edits) |
| 8 | UR118 | Seven chip families and an uncapped count badge | C4, C5 (cap); all chips (family) | No chip component; `paintBadge` and the CSS badge print the raw number | Default: one `chip` component (inert and button variants) and a badge that shows `99+` with the exact count in the accessible name. Dial: cap value; grouping threshold per region width. Reason: chip rows wrap into noise as counts grow | M | SHARED |
| 9 | UR119, UR27 | Selection is visual only on inventory rows; two list anatomies differ from the rule | L1 (X), L2, L4 (A) | `data-ui-selected` has no ARIA twin; Around you and travel rows are built separately | Default: add `aria-current` or `aria-selected` where `data-ui-selected` is set; give Around you rows a leading glyph. Dial: columns per list. Reason: selection should reach assistive tech | S | LOCAL |
| 10 | UR125, UR55 | Loading names no real work; Condition empty has no next step; bad import gives no next step | E6, E7, E8 (3) | Authored strings | Default: loading says the phase being done (for example, reading the save); empty Condition names what causes effects; import error adds "use a file made by Export". Dial: world voice (DSG13). Reason: first-contact states | S | LOCAL |

## Not checked

- Mixing and Research panels (the Research option timed out when selected), crafting commit progress, the favourites tab (`★ 0`) empty state, Travelers, Projects and Notebook empty text.
- LOTM and household meters, the rite figure, lives figure, ladders and body view (private packs blocked; the gallery page rendered nothing headless).
- Combat bars and fighter lines (no enemy reached).
- Away bank spend: the row appeared and read correctly, but spending, the capacity line and `lastReturn` after a real gap were not exercised. Backdating `saved_at` banked nothing, because a save without the `expansion.awayBank` slice starts empty by design.
- `×N` repeat folding rendered in the DOM (only the source and the `data-repeat` attribute were seen); the history cap at its limit; the long-run quieting of older lines.
- Meter delta on change (UR115, UR91), reduced motion, 150% text (UR33), each world dress (UR98), the `expo` setting with a large value, contrast ratios, keyboard order inside rows, and mobile (deferred by the standing UI priority).
- Table form content for the web and gathering figures (the switch was present; the table body was not captured).
- Sort stability for lists other than inventory; sticky headers and sort controls (no table in the sample is long enough to need them).
- The Stats panel colour roles (UR37) beyond the vitals bars; tooltips (UR74 copy parity beyond the numbers listed).
