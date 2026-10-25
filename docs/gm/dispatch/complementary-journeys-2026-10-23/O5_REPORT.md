# O5 desktop verification and focused UI contract correction

Status: COMPLETE for the assigned focused correction and frozen desktop proof, 2026-10-23. No commit, push, installation or rebuild authorized in this lane.

## Reservation before editing

Additional exact paths reserved: `styles/material_icons.css` and `tests/ui_contract_allowlist.json`. The former is an existing untracked local-font asset introduced by the active desktop/offline work (`index.html` already loads it); the latter has no current working-tree edits at reservation. O5 changes only the equivalent normal-weight descriptor and exact reasoned contract entries for its required matching glyph face and nominal icon size. No scanning change or file-wide exemption. O5 also owns this report, `o5-desktop.cjs` and `evidence/o5-*`. No shared checkpoint, direction, gear runtime/tests or O4 edits.

## Direction and selected checks

AD36/41; UR6/14/16/18/19/33/65–68 from [UI rules](../../../UI_RULES.md). Existing workshop task surface and Other known panels route. Desktop first: 1920×1080, 1800×1040, 1536×864 at actual computed 14px and 21px. Visible outcome: carried worked dagger, quench with Measured Focus, depleted-resource rejection, existing Heat-treated edge reader and reachable Back/controls. Mobile deferred; human pacing/taste remains separate.

Failure scenario: contract sees `font-family: 'Material Icons'` twice, `font-weight: 400` once and `font-size: 24px` once. Source: `/tmp/yair-complement-full-tests.log`, test 2543. Full suite already ran 2727 tests: 2726 pass, sole failure this contract. Focused `node --test tests/ui_contract.test.js tests/ui_extras.test.js`; browser additionally checks the locally loaded face and ligature geometry. No duplicate full suite in O5. Coordinator owns final full suite.

## Findings and corrections

- F1: The sole full-suite failure was an unledgered offline Material Icons stylesheet. Changed its face weight descriptor from `400` to the equivalent `normal`; added two exact hash-keyed ledger entries, with concrete glyph-family and optical-size reasons. The family entry permits exactly two occurrences, and the size entry exactly one. `tests/helpers/ui_contract.mjs` and its scanning remain untouched. The ledger diff is 16 added lines, no reorder. No suitable existing player type-role token describes the mandatory matching glyph face or nominal 24px icon geometry; a spacing token would have the wrong meaning.
- F2: All six cases have actual computed panel AND every visible workshop button/select at the requested 14px or 21px. Native selects are horizontally bounded and keyboard focused after scrolling; the disabled commit is reachable, Back stays visible and within the viewport. Page scrollHeight equals viewport height in every case, with the full-height log column retained. No integration defect reproduced in the assigned depleted-focus journey.
- F3: Visually inspected `workshop-1920-14.png` and `workshop-1536-21.png`. Primary shows carried dagger, tempered state, Heat-treated edge, quench/oil/focus controls and the recovery reason together. Floor/large-text uses the panel's vertical scroll; the Heat-treated edge, selected focus, recovery reason, disabled Apply and pinned Village return remain readable. Long native option labels are bounded by select widths and remain selectable. Taste acceptance remains Weibao's.
- F4: Offline icon proof loaded the local woff2 successfully, resolved `Material Icons` at 24px/computed 400, and measured the `star` ligature at 24×24, rather than a spelled-out word. Font SHA-256 `4a4dbc62fa335e411b94a532be091c58c0c0c4fa731339f11722577d3cf6443b`.

## Evidence and exact commands

- `node --test tests/ui_contract.test.js tests/ui_extras.test.js`: PASS 17/17; [full output](evidence/o5-focused-tests.log). Repeated once after reducing an unintended ledger reorder to the final append-only diff; no full suite run.
- `URL=http://127.0.0.1:8743/ YAIRPG_PROOF_DIR=docs/gm/dispatch/complementary-journeys-2026-10-23/evidence node docs/gm/dispatch/complementary-journeys-2026-10-23/o5-desktop.cjs`: PASS, six desktop/text cases, zero page errors; [full log](evidence/o5-browser.log), [receipt](evidence/o5-desktop-wO8tWK/o5-desktop.json), [geometry and icon checks](evidence/o5-desktop-wO8tWK/geometry.json), [full workshop text](evidence/o5-desktop-wO8tWK/workshop-context.txt).
- Browser: isolated headless Chrome context, fresh localStorage; literal O1 native export imported through the native file input. Existing deterministic pause hooks prevent unrelated idle changes. No personal save touched; no rebuild; server retained. Source file hashes stayed stable during capture. [Browser input identities](evidence/o5-desktop-wO8tWK/inputs.json) and [final focused-check identities](evidence/o5-desktop-wO8tWK/check-inputs.json).

Primary reviewed image: [1920×1080 / 14px](evidence/o5-desktop-wO8tWK/workshop-1920-14.png). Floor-large-text reviewed image: [1536×864 / 21px](evidence/o5-desktop-wO8tWK/workshop-1536-21.png). The same directory has all six captures.

## Combined coverage reused, with limits

All browser receipts below and O5 loaded bundle SHA-256 `e7ca5a704772147ee629f2f03123c6ae6d6c6f10cfe84cbe0b13a6cf3126e814` at HEAD `547209e82c29e897e6b602a4ef5d8e8ab46b3ebf`. CSS is loaded directly and independently of the bundle. O5 changes no gameplay runtime.

[O1 receipt](evidence/o1-focus-workshop-Nc1Np6/o1-focus-workshop.json): learned/recovered focus, fuel and focus costs, quench/temper, exhausted rejection, item-stat reader and Save/reload/Export/literal Import. O5 replaces the typography claim of the initial six captures with actual computed-control proof; it reuses gameplay/persistence evidence.

[O2 receipt](evidence/o2-ordinary-life-GcgTRN/o2-ordinary-life.json): actual paid local shift and rented room, learned method and staffed office responsibility, reserved funding and reviewed successor delivery; four persistence boundaries. [O3 receipt](evidence/o3-reviewed-absence-ZEucOf/o3-reviewed-absence.json): actual reviewed prepaid absence, conserved supplies, pause/resume/cancel and three persistence boundaries. These are unchanged-input recorded proofs, not reruns. O4 retains its own report and transition proof ownership.

Coordinator update during O5: the owned `src/gear_work.js` now adds a full-hand-control refusal so focus is not spent on a capped result. That source change is not present in this frozen bundle. O5's depleted fixture still exercises its unchanged relevant behavior; O5 does not claim proof for the newer refusal.

## Returned ownership and remaining gate

O5 releases `styles/material_icons.css`, `tests/ui_contract_allowlist.json`, `o5-desktop.cjs`, this report and its `evidence/o5-*` outputs. The stylesheet was already untracked and owned by the desktop work; O5's sole stylesheet edit is the equivalent weight descriptor. No shared/runtime/O4 files edited, commit/push/install performed or server stopped.

The authoritative technical completion gate remains the coordinator's final combined build/full-suite/consolidation after the newer runtime input and O4 completion, including a browser check of the new full-hand-control refusal. This report is bounded to the frozen bundle above. Human pacing/taste acceptance, normal-app adoption/publication and mobile optimization are outside this lane's proof.
