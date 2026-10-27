# Backlog UI checkpoint, 2026-10-27

```receipt
build: 4c8cd696083f7fe7c54e66cd4aa8a22cb592b971fec603d799692a702e596452
route: natural
state: browser-verified
viewport: 1920x1080 primary; 1536x864 floor; font 14 and 21
persistence: checked
tests: focused crafting_home, village_career, workspace, ui_contract pass; npm test 3504/3505 (CN11 load flake, passes alone); check:arch exit 0; check:rules PASS
review: diff-scoped
surface: disabled-reason decorator; Tingen workroom; Projects drawer; Patrol & custody; carcass processing; Village experiments; module headers; motion tokens
```

Session: `backlog-ui` (Claude, started by the Village loop coordinator). Brief: [BRIEFS.md section 3](BRIEFS.md), [COMMON.md](COMMON.md).
Codes: UIV1 (`docs/audits/UI_DESIGN_CORE_AUDIT.md` round 7), UR43, UR47, AD36, AD42, AD43; Q18 P02-P10 (`docs/audits/IDEAS_TRIAGE_2026-10-26.md`).
Budget (AU1): one coordinator, no subagents unless a P row needs a bounded read; one probe script, focused tests, one full gate run before commit.

## Reading and scope

- Target: desktop 1920x1080 primary, 1536x864 floor, text size 14 and 21. Mobile deferred.
- COMMON reading recorded: the Village loop is the one exception to "Frontier and Mistglass get no new depth"; this session adds no Village or Frontier content and touches no Village loop logic.
- Owned paths: `src/ui_components.js`, `tests/ui_components.test.js`, the one decorator call in `src/book_world_lotm_ui.js`, `scripts/playtest/uiv1-probe.mjs`, this file. `src/main.js`, `src/absorb_c2/local_life.js` and `tests/local_life.test.js` are live in `village-loop`; not touched here.
- Live ownership check (2026-10-27): last `book_world_lotm_ui.js` commit `17f53f76d` (Tingen crossing pause); no uncommitted edits and no linked session lists it.

## UIV1: what the current DOM shows (before)

Probe: `scripts/playtest/uiv1-probe.mjs` on a temp rebuilt bundle, fresh origin.

- F1 Mistglass "Enter Mistglass conservatory" (M2 button): already shows its reason inline. The projects drawer runs `decorateActionComponents`, which writes a visible `small.ui-disabled-reason` beside the button and links it with `aria-describedby`. The gap left is keyboard: a disabled button is skipped by Tab, and so is the note.
- F2 Tingen start buttons (M2 button): no longer blocked. The lotm-launch slice (`bcebdf020`) replaced the probe-gated begin buttons with enabled "Begin as ..." picks; unwritten options are listed as text with reasons.
- F3 Tingen workroom after enrolling: `book_world_lotm_ui.js` `button()` puts the reason in `title` only (bench actions, missions, merit store, place actions, walks). This is the UIV1 gap for Tingen. Two rows already print the reason as text (drink row, merit store row).

## UIV1 change

- `src/ui_components.js` (`decorateActionComponents`, the existing shared seam):
  - A shown reason note gets `tabindex="0"` while its button is disabled, so Tab reaches the reason. Buttons keep native `disabled`; command palette, row menu and playtest scripts key off it. Proposal: the reason, not the dead button, is the Tab stop.
  - When the button's row already prints the same reason (Tingen merit store, drink row, two Village repair-notes buttons sharing one reason), that text becomes the description and Tab stop; no duplicate note. Enabling the button removes the borrowed Tab stop.
- `src/book_world_lotm_ui.js`: one line decorates `#lotm_panel`, so workroom reasons are no longer `title`-only. `title` stays as a duplicate.
- `tests/ui_components.test.js`: regression for the Tab stop, the no-duplicate rule and cleanup on enable.
- `scripts/playtest/uiv1-probe.mjs`: rebuilt temp bundle, fresh origin, headless. Fresh life → Projects → Mistglass disclosure; Tingen life pick → confirm → workroom. For every visible disabled button it asserts the reason is on screen and Tab from the previous control lands on it, at 1920x1080 and 1536x864, text 14 and 21 (text size asserted on `#inventory_div`).

Not in this slice (next UIV1 rows, ranked by how often a player meets them): other title-only sites in `crafting_home.js`, `field_ui.js`, `simulation_ui.js`, `storylet_ui.js`, `pursuit_ui.js`, `party_ui.js`, `tools_panel.js`, `drainage_site_ui.js`, `peer_standing_panel.js`, `hp_brewing_panel.js`, `cohort_battle_domain.js`, `book_world_primordial_ui.js`, `systems_workshop_ui.js`. Each is one decorator call on its panel root plus a probe stop. Decorating `#main_content` wholesale is avoided (observer cost, see `6fae46007`).

Noted, not changed: in the paused test harness the Village repair-notes buttons read "Finish current work in the writable Village tab." on a fresh life with no work running. Likely the harness pause, not a player state; not reproduced in normal play here.

## Checks

| Check | Result | Gaps |
| --- | --- | --- |
| Probe before (fresh origin) | F1-F3 above | First run measured body font and audited a closed drawer; both fixed in the probe |
| `node --test tests/ui_components.test.js tests/lotm_*.test.js` | 145 pass, 0 fail | Focused |
| `node scripts/playtest/uiv1-probe.mjs <scratch>` | PASS: 7 blocked controls per cell (Mistglass Enter, 2 Village repair notes, 4 Tingen workroom), each visible and Tab-reachable, 4 cells | Temp bundle built from the shared checkout, which held `village-loop`'s uncommitted `main.js`/`local_life.js` edits |
| `BUILD_OUT=.lane-builds/backlog-ui npm run build` | ok, bundle sha256 above | Shared `dist/` left to its owner: another session had already rebuilt it |
| `npm test` | 3499 pass, 0 fail | Same shared-checkout inputs |
| `npm run check:arch` / `npm run check:rules` | exit 0 / PASS | |

## Floor (AD43)

| Line | Status |
| --- | --- |
| FLR1 | Lane bundle hash above |
| FLR2 | Earned route from a fresh life (Village opening → Tingen crossing), rebuilt headless browser |
| FLR3 | Each blocked control in scope shows its reason without hover and takes keyboard focus |
| FLR4 | Consumer: the player reading why an action is closed; no state change |
| FLR5 | No persistence change, so no Save/reload/Import run |
| FLR6 | Agent-verified, not human-reviewed |

Follow-up fix (advisor review): the decorator now borrows only row text that equals the reason exactly, and a button that moves off a shared note no longer strips that note's Tab stop. Regression added; probe re-run PASS in all four cells.

Bundle state: `dist/bundle.js` at `09d77f220` (village-loop's rebuild from the shared disk) already contains the UIV1 decorator and the P02 reasons. The P03 CSS loads from `styles/`. The decorator follow-up fix and later rows are source-committed only until the next shared rebuild.

Status: UIV1 first slice (M2 Mistglass door, Tingen workroom) done at the floor. The M2 Tingen begin buttons need nothing: they are enabled since `bcebdf020`.

## Q18 P02-P10

Each row gets a line here before editing: ready or skipped, with the owner lane checked.

### P02 · DRC10 residual / DRC11 / DRC12 / UIA15

Ownership: `village_career_ui.js` and `harvest_ui.js` are not in `village-loop`'s recorded files (VL1: `local_life.js`, `main.js`, `tests/local_life.test.js`) or GM plan cards; no uncommitted edits. Reasons only; no Village loop logic or command change.

- DRC11 done: Village teaching-term buttons carry the first failing condition (not on your patrol round; watchcraft not executable; teaching already under way) as `data-disabled-reason`, and the panel is decorated, so the five terms share one visible, Tab-reachable reason.
- DRC12 done in source: harvest controls name their cause (unwritable tab; current carcass; current activity, conversation, fight, sleep, reading, trade or other occupation). The last is a list because the UI only sees `frame.ready`. `main.js` already has the exact cause in `harvestBlockReason()`. Hand-off hunk for `village-loop`, not applied: add `readyReason:harvestBlockReason()` to the harvest frame and let `harvest_ui.js` show it in place of the list.
- DRC10 residual: skipped. The audit marks it "Residual: no" (engine cost errors cannot tell player stock from the craftsman's).
- UIA15: not reproduced. A fresh Village life's Around you shows 2 people and 5 services/stations; the empty line only appears in a place with no known subjects. No edit.

| Check | Result | Gaps |
| --- | --- | --- |
| `node --test tests/village_career.test.js tests/harvest.test.js tests/ui_components.test.js` | pass, new DRC11 DOM regression | Harvest reasons have no DOM test |
| Browser | Not run for P02: mentor rank and a carcass need a long earned route | Implemented, below floor (FLR2) for DRC11/DRC12

### P03 · UIA13 / UIA14 / UI L8

Ownership: `styles/ui_tokens.css` last changed `0ae420352` (2 days ago); no uncommitted edits; no live lane names it.

- UI L8 / UIA14 reproduced at 1920x1080, text 14, on a fresh Village life: the two native-button place actions ("Cross to another world: Tingen", "Mix at the Village counter") were 28 px boxed buttons with the theme's control fill among 25.5 px clear rows. Cause: `component_themes.css` gives every button in a themed module `background: var(--theme-control) !important` and a 2em minimum, and the existing r3 "one routine-row grammar" rule (Mix only) used larger padding.
- Fix in `styles/ui_tokens.css`: that existing r3 rule now covers both native-button rows with the div rows' padding (`--ui-space-1`) and no minimum height; one scoped `background: transparent !important` (not on hover or disabled, so theme states stay) beats the theme fill; the Mix glyph is sized like the 20 px row icons. One new `!important`, recorded for UI L10.
- Result: at 14 px all five rows are 25.5 px with clear backing at 1920x1080 and 1536x864. At 21 px the button rows are 34 px against 36.39 px div rows: the div rows' fractional height comes from the fixed 20 px icon line, which is P04's question. Hover and disabled states not exercised in the browser.
- UIA13 measured, no change: `mid` and `crowded` perf fixtures after 6 stepped hours. Reports pane 499×1018 at 1920 is 6% text-filled (8-9% at 1536); Journal (`records`) 5-14%. Fixture loads do not restore the message log and idle stepping wrote 2 lines, so this is still not real-play evidence. DL4/UR69: a sparse capture does not justify lending space away. Re-measure from a played session before any layout change.

| Check | Result | Gaps |
| --- | --- | --- |
| Row geometry, rebuilt temp bundle, fresh origin, 4 cells | Text 14: 5 × 25.5 px, all clear backing. Text 21: div 36.39, buttons 34 | Fractional div height left to P04 |
| `node --test tests/ui_contract.test.js tests/presentation_style.test.js` | 8 pass, 0 fail | |

### P04 · UIA4 / UI L6 (measured, no change)

Scan of the `mid` perf fixture, rebuilt temp bundle, fresh origin, 4 cells (1920x1080 and 1536x864 at text 14 and 21). About 280 visible elements in `#main_content`, 181-190 with fractional height.

- Padding is whole pixels everywhere. Every fractional height is text: unitless line-height × size (14 px: 16.8, 17.5, 18.2, 15.6; 21 px: 25.2, 26.25, 27.3, 23.4). Largest groups: Stats rows (`button.shell-stat-record`, 23.8 / 34.19 px), focus list buttons and labels, inventory tabs and rows. The Village place-action rows (36.39 px at 21) are the same cause: a fixed 20 px icon line plus fractional text leading.
- Off-scale spacing: 3 px (gap ×21, padding ×16-17) and 5 px (inventory rows at 21) are the real off-scale values; the space tokens resolve to 2/4/6/8/12/16.
- Necessary change: none for P04. The fix is whole-pixel leading (UR68 already requires it), which shifts density across the shell; L6 leaves density choices to Weibao. Proposal: source the unitless line-heights from `--ui-line-*` tokens, starting with the Stats rows, behind a geometry harness before/after.

### P05 · UI L7 (synthetic bold fixed; sizes and leading recorded)

- Reproduced: module header titles and the Village scene title (`.workspace-module-header > strong`, `.scene-location-header > strong`) were weight 600 on "OOPS Gothic Bitmap 14", which ships weight 400 only, so the browser drew fake bold (7 per screen). Fix in `styles/corc_readability.css`, following that file's existing Gothic precedent: `--ui-weight-regular` and `font-synthesis:none`. After: no synthetic bold on Gothic in any of the 4 cells; the 1920x1080 21 px capture shows crisp regular titles.
- Recorded, not changed: off-role sizes 11.9, 12.6, 10, 17.85 and 18.9 px, and the fractional leading above (UR68). Migrating them changes visible density; same proposal as P04.
- Stats values (`button.shell-stat-record > strong`) are bold on system-ui, which has a real bold, so they are not synthetic.

| Check | Result | Gaps |
| --- | --- | --- |
| Type scan, `mid` fixture, 4 cells | Synthetic bold on Gothic: 7 → 0 | Fresh and crowded fixtures not scanned |
| `node --test tests/ui_contract.test.js tests/presentation_style.test.js` | 8 pass, 0 fail | |

### P06-P10 and the DRC11/DRC12 browser pass (second request, 2026-10-27)

The coordinator relayed Weibao's "continue": take P06-P10, then run the DRC11/DRC12 browser pass. Ownership check before editing: no live lane names `crafting_home.js`, `workspace_layout.js`, `styles/shell_chrome.css`, `styles/meter_bar.css` or the UI contract files. Before staging, `git diff` of each committed file showed only this lane's hunks. `village_career_ui.js` and `harvest_ui.js` are this lane's from P02. `main.js` has another session's uncommitted edits and is not touched.

#### P06 · DL6 long labels (fixed)

- Probe: `scripts/playtest/long-label-probe.mjs` loads the `crowded` fixture with a 67-character hero name and runs 4 cells. It lists every visible leaf text cut by its box and checks that the full text is available through `title` or `aria-label`.
- Reproduced at 1536x864, text 21: the Reports and Journal module titles were cut to "Rep…" and "Jo…" with no full-name access, while the Reports filter box kept its width.
- Fix:
  - `workspace_layout.js` gives every module header title a `title` equal to its visible text, including companion boxes and the composed "You" and "Inventory" titles.
  - `shell_chrome.css` keeps the Reports title at its own width (`flex:0 0 auto`), so the filter box, which is decoration, shrinks first.
- After: 0 cut labels without full-name access in all 4 cells, and Reports reads in full at 1536/21.
- Left as is:
  - The Journal companion column is about 60 px wide at 1536/21, so "Jo…" stays cut, but its full name is now on the title. Widening the column is a layout-density choice (L6).
  - The hero-name input is clipped at its 12em cap with no ellipsis. The name stays editable and inspectable in the field. Adding a `title` there would mean editing `main.js`.

#### P07 · DL9 time and weather signals (checked, no change)

- Sampled the scene header of the `mid` fixture every game hour for 96 hours at 1920x1080, text 14.
- Every signal carries a word plus a glyph, so none relies on color alone: season ("☀ Summer"), weather ("☂ Rain", "Dry"), temperature with a comfort word ("16.5 °C · cold"), exposure ("Cold exposure") and day part ("☼ Day", "☾ Night").
- Proposal, not applied: the season glyph is ☀ even while raining, which reads as mixed weather. A season-specific glyph would remove that.

#### P08 · DL10 / DL2 motion and tooltip tokens (one token change plus guard)

- Audit:
  - The motion tokens were already zeroed by consumer rules under Effects off or reduced (the default Effects setting is reduced).
  - Two literal transitions bypassed the tokens: `meter_bar.css` `.2s` and the luminous theme's `.12s`.
  - Eight named keyframes each carry their own reduced-motion or Effects guard.
  - Tooltip frame (`--ui-tooltip-frame`, `-outline`, `-shadow`) and reading backing (`--ui-tooltip-fill`, opaque) are already separate tokens, so DL2 is met. The item-inspection repair stays with its incumbent.
- Change:
  - `ui_tokens.css` sets `--ui-motion-fast` and `--ui-motion-normal` to 0ms under Effects off/reduced and under `prefers-reduced-motion`. Reduced motion is now one switch.
  - The two literal transitions now read the tokens.
  - Guard: the UI contract scanner has a new `motion` rule. The ten existing literal durations are allowlisted with reasons; eight of them are animations with their own guard (the five upstream `style.css` ones rely on the workspace kill switch), and the other two are that kill switch's own durations.
- Browser check at 1920x1080:
  - Effects full: button 0.12s, meter 0.18s.
  - Effects reduced and off: 0s.
  - OS reduced motion: 1e-6s (the existing kill switch wins).

#### P09 · DRC9 Drink one names observed effects (fixed)

- `crafting_home.js`: a preparation with observed effects reads "Drink one · observed bind 28". Unknown batches keep "Drink one" (AD6).
- Browser: earned route from a fresh life at 1920x1080/14 and 1536x864/21 (gather, steep three times, drink one). After the drink, the drunk batch is named and the untried batch stays plain.

#### P10 · MC9 return-session diagnostic (not needed)

- Route: a fresh life, the Tingen probationer life, report to the supervisor, then start "Copy a closed case file · 30 min". After 10 minutes, save and reopen in a new context at 1920x1080/14.
- Known goal: the LOTM panel's first action block is "Plan the next crossing · Sequence 9 · Seer · Hold the allocated Seer dose, then drink it".
- Real stop: the work module is open on landing without navigation and shows "…: 20 min remaining" with "Stop (cost not returned)". The job finishes 25 minutes after the return and pays 1 merit.
- Timing: the reopen to a playable screen took about 7 s headless.
- No return-session problem reproduced, so no recap UI was added.
- Recorded:
  - The workroom list grows from 10 to 26 buttons after reporting, and 22 of them are disabled with reasons.
  - "Find step" appears twice.
  - Both are inputs for the UF7 orientation slice, not defects fixed here.

#### DRC11 / DRC12 browser pass (DRC11 at the floor; DRC12 browser-verified on seeded state, below floor)

- Probe: `scripts/playtest/backlog-ui-probe.mjs`.
  - DRC11 is earned from a fresh life: five full patrol rounds with the kit returned, two promotions, then Iona assigned through the Patrol & custody buttons.
  - DRC12 is seeded on that earned save: a running carcass job with two more carcasses waiting. An earned carcass needs a fight, which this pass did not drive.
  - Runs 4 cells, plus the P08 motion and P09 drink checks.
  - Tab reachability is a real Tab walk from the panel's first stop. Focusing a mid-panel control redraws the harvest panel, so the earlier focus-the-predecessor method gave a false miss.
- New defect found and fixed (regression added to the DRC11 test): "Learn from Tessa in person" and "Ask Tessa for Tessa's watchcraft notes" were disabled with no reason at all, held by the shared write/busy gate. The fix is in `village_career_ui.js`:
  - Every control held by that gate now names it: "Finish current work in the writable game tab." or "Finish your current activity, work or occupation first."
  - Read notes and Promotion name their own cause.
- Result: 12 blocked controls per cell (7 Village patrol, 5 carcass), every reason visible without hover and reached by Tab, in all 4 cells.
- Remaining gap: DRC12's carcass is seeded, so DRC12 stays implemented, below floor (FLR2), though its reasons are browser-verified.

| Check | Result | Gaps |
| --- | --- | --- |
| `node --test tests/crafting_home_refresh.test.js` | 2 pass, new DRC9 known/unknown test | |
| `node --test tests/workspace_*.test.js tests/village_workspace.test.js` | 11 pass | |
| `node --test tests/ui_contract.test.js` | 3 pass, motion rule and its catch/allow cases | |
| `node --test tests/village_career.test.js` | 6 pass; DRC11 test now covers the reasonless Watchcraft lesson (busy and unwritable) | |
| `node scripts/playtest/long-label-probe.mjs` | 4 cells, 0 cut labels without full-name access | Journal column stays narrow |
| `node scripts/playtest/backlog-ui-probe.mjs` | PASS: earned mentor career; 4 cells × 12 controls; motion full/reduced/off/OS; drink at 2 cells | DRC12 carcass seeded |
| P07 and P10 diagnostics | Scratch scripts, results above | Not committed as scripts |
| `BUILD_OUT=.lane-builds/backlog-ui npm run build` | ok, bundle sha256 in the receipt | Shared `dist/` left to its owner; this request's JS goes live with the next shared rebuild |
| `npm test` | Final run 3504 pass, 1 fail: CN11 in `native_save_fixtures.test.js`, which passes alone (1/1). An earlier run had `alloy_equipment` fail under load, also passing alone (5/5), and two `SELF_LOCKED_REQUIREMENT` lint failures from another session's uncommitted `village.watch_lantern` card, since cleared | Timing flakes under parallel browser load; shared checkout carries other sessions' uncommitted edits |
| `npm run check:arch` / `npm run check:rules` | exit 0 / PASS | |

Floor (AD43) for this request:

| Row | FLR1 | FLR2 | FLR3 | FLR4 | FLR5 | FLR6 |
| --- | --- | --- | --- | --- | --- | --- |
| P06 headers | Lane hash | Populated `crowded` fixture (UI-only, no state) | Full name on title; Reports keeps its width | Player reading a module title | No persistence change | Agent-verified, not human-reviewed |
| P08 motion | Lane hash | Fresh life, 1920x1080 | Effects setting and OS preference change motion | Every `--ui-motion-*` consumer | No persistence change | Agent-verified, not human-reviewed |
| P09 drink | Lane hash | Earned: fresh life, gather, steep, drink | Button names what was observed | Player choosing which batch to drink | Existing knowledge state; no new field | Agent-verified, not human-reviewed |
| DRC11 | Lane hash | Earned: fresh life to Mentor with Iona | Every held control names its cause | Player reading why a term is closed | No persistence change | Agent-verified, not human-reviewed |
| DRC12 | Lane hash | Seeded carcass job: below floor | Every held control names its cause | As above | No persistence change | Agent-verified, not human-reviewed |

Status: P06, P08, P09 and DRC11 done at the floor. P07 and P10 needed no change. DRC12 is browser-verified but implemented, below floor until an earned carcass route runs.
