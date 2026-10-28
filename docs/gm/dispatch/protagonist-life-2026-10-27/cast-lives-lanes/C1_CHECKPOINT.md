# C1 checkpoint: perspective control inventory

Scope followed: CL236, CL243, CL268; CLR2, CLR3, CLR9, CLR10, CLR12.
This lane adds a public, name-free inventory for S1 to read later. It adds no
filtering behavior and changes no UI.

## Data probe

| Source count | Expected | Observed | Gate |
| --- | ---: | ---: | --- |
| Named shell items: Stats, Condition, Inventory, Journal, Data, Notebook, Travelers, Projects, Ledger, Worlds, Beginning, Connection, Settings, pane selector, Save, Export, Import, Menu | 18 | 18 named controls represented | yes |
| Stable content regions appended by the LOTM panel | 8 or more | 9 | yes |
| Report kinds emitted by the LOTM host and cast host | 3 or more | 2 (`event`, `background`) | no |

The active route table also contains other route buttons. All 20 route IDs in
`src/layout_spec.js` have menu rows, including those beyond the 18 named probe
controls. The panel source has 20 `data-lotm*` dataset families plus the generic
`data-lotm` command/formula control; each has an inventory row. Data-family rows
are source families and can represent controls not simultaneously rendered.

## Inventory

`src/perspective_controls.js` exports 64 frozen rows. Counts by tag:

| Tag | Rows |
| --- | ---: |
| `in-world` | 45 |
| `system` | 5 |
| `crossing` | 8 |
| `other-seat` | 6 |

Rows by kind: 24 menu, 1 pane, 34 panel-block, 3 header-line and 2 report-kind.
The `bench` rows identify the existing disclosure group. The start picker and
confirmation controls are `other-seat`; continuing connection and the Village
door are `crossing`.

Unclassified: none found in the scoped shell route table, named controls,
header lines, LOTM panel content families or host report kinds. The report-kind
probe found two current kinds against the non-gating expectation of three or
more; both are classified and no kind was inferred to fill the difference.

## Checks

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/perspective_controls.test.js` | PASS, 1/1 | Source coverage checks route IDs, row shape/tags, panel data families, and the generic dynamic command selector; no browser screenshot in this lane. |
| `node scripts/lane_review.mjs --grant src/perspective_controls.js --grant tests/perspective_controls.test.js --grant docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/C1_CHECKPOINT.md src/perspective_controls.js tests/perspective_controls.test.js docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/C1_CHECKPOINT.md` | PASS, `outside-grant=0`, `name-hit-files=0`, `top-level-await-files=0` | Reviewer reports 2 tracked candidate files because the new source and test are untracked until coordinator integration. |

Review state: source-spot-checked. Route kind: static source inventory; browser
coverage in a beside-life screenshot remains the coordinator's check. No build
was run because this lane changes no runtime consumer or UI behavior.

## Coordinator review (2026-10-28)

Focused test PASS 1/1; `lane_review` clean; capitalized-token sweep: ordinary words plus the city name,
which the public LOTM panel already shows. Gaps carried to S1/B1: (1) the workroom walk and supervisor lines
are not rows, so they default to `in-world`; CL236 names them `other-seat`, though the lead joins that
workplace later in the book, so B1 decides per date. (2) The native Village's own Reports lines (quest and
navigation notices) have no report-kind row; CL241 makes them `crossing`. Browser check of tag coverage
waits for S1's filter.
