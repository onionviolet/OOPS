# Backlog UI checkpoint, 2026-10-27

```receipt
build: 04171f3a7ba386db189a754c0eefa900f9cc1a2ff2f0dd91ba0632befeb57928
route: natural
state: browser-verified
viewport: 1920x1080 primary; 1536x864 floor; font 14 and 21
persistence: unchanged
tests: node --test tests/ui_components.test.js tests/lotm_*.test.js 145/145; npm test 3499/3499; check:arch exit 0; check:rules PASS
review: diff-scoped
surface: shared disabled-reason decorator; Tingen workroom (place service); Projects drawer
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

### P04-P10: hand-over (not started)

Stopped after P03 to keep a clean commit boundary; each row below still needs a live ownership check before editing.

- P04 next. Start from the P03 finding: Village div rows are 36.39 px at text 21 because the fixed 20 px row icon sets the line; native-button rows are 34 px. Measure text width versus padding before changing density.
- P05-P08 as written in Q18. P08 leaves live tooltip implementation to its incumbent.
- P09 (DRC9) is small: `crafting_home.js` "Drink one" names observed effects when known; unknown keeps "Drink one".
- P10 is a diagnostic first; add recap UI only if a return-session problem reproduces.
- Next UIV1 rows are listed under "UIV1 change" above.
- Tooling: `scripts/playtest/uiv1-probe.mjs` is the pattern for a 4-cell, fresh-origin, headless matrix with text size asserted on `#inventory_div`.
