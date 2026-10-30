# Lane sw-l9-s3 brief (Sol medium): improvement pass on slices 1-2

Repo /Users/weiwei/code/yet-another-idle-rpg (shared checkout; never git stash/checkout/reset; do not commit; no web). Read `docs/gm/dispatch/sonnet-wave-2026-10-30/L9_DEATH_RESTART_DESIGN.md` (incl. "Slice 2"), then `src/harm_state.js`, `src/harm_restart_scope.js`, the `die:`/`restart:` hunks in `src/continuation_state.js`, and their tests.

## You own exactly
`src/harm_state.js`, `src/harm_restart_scope.js`, `src/continuation_state.js` (die/restart hunks only), `tests/harm_state.test.js`, `tests/harm_parts.test.js`, `tests/harm_restart_scope.test.js`. Touch nothing else.

## Audit each, reproduce with a failing test first, then fix. Report a table: case, reproduced yes/no, fix.
1. **Items and records carried across worlds.** The seat carries an item or a record that another (retained) world also tracks (a purse or item received in the Village, a cross-world ledger entry, carry ledger `src/carry_ledger.js`). After a scoped restart the retained world must not hold something the rewound body no longer has, and the body must not duplicate something the retained world still holds. Pick the consistent rule (the anchor's body state wins for what the seat carries; the retained world's own record of what it gave stays but is not re-created), document it in the module header, test it.
2. **A death during travel.** Seat has an in-progress journey or job (`current_activity`, simulation jobs, a leg of travel with a destination world). `die:` then `restart:` must leave no orphan job, no half-arrived visit and no retained owner mid-visit with the old body; if a retained owner is mid-visit, refuse with a clear message and leave both inputs untouched (existing behavior, add the travel cases).
3. **Save migration.** Old harm slices (`{schema:1,backlash:{}}`, with and without `parts`), old continuation JSON (no `deaths`, no `ended`), a save written by slice 1 code, import of a pre-change export, and hostile values. Round trip through JSON and the real import validators; the harm slice must stay absent when clean.
4. **Graded modifier ranges.** Every `mult` must stay in (0,1] for penalties (never 0 or negative, never NaN), `add` bounded, many stacked parts plus backlash must clamp at a stated floor per axis (propose 0.1 and say why), healing never makes a part better than uninjured, `healPart` never skips rungs without enough care minutes, injuring twice does not lower a worse rung. Rows must carry a `reason` for each number.
5. Anything else you find that would corrupt a save, duplicate a ledger entry on a replayed token, or let a challenge life or an ended life act.

Run only focused tests: `node --test tests/harm_state.test.js tests/harm_parts.test.js tests/harm_restart_scope.test.js tests/continuation_state.test.js tests/anchor_snapshots.test.js`. Report files changed, counts, the table, anything unresolved.
