# bk-mol ideas and gaps (proposals, 2026-10-30)

Rules: GM6, GM11, AD38, AD43. Counts and ids only; no book text.

## Slice as built (proposal status)
- `src/institution_access.js`: pure grant shape (issuer, subject, scope, expiry, suspension) and `accessStatus` that lists what a grant opens, what it never covered, and passes the holder's own skill through untouched.
- `src/book_world_mol_access.js`: Cyoria adapter. Grant = Ilsa's guest pass (fact `book.mol.guestPermit`). Retained skill = `book.mol.formula_operator` mastery and `book.mol.formula` knowledge. Term is a 30-day dial (the pack has none).
- Slice `mol_access` `{schema:1, issuedAt}`, written the first time the permit is seen; absent otherwise (additive, no migration).
- Panel `mol_access` "Cyoria access and loops", records role, visible only in Cyoria. Loop readout is the shared `src/loop_table.js` (PR and COI register their own rows); MoL registers a proposed table.

## Below floor (implemented, below floor)
- **Enforcement.** A lapsed pass is shown, not enforced: moves to protected locations check only the fact (`book_world_mol_host.js:38`) and library commands check the item. Patch idea for `sw-wire`: expose `mol.guestPermitOpen` from `molFacts` (needs `mol_access.issuedAt` passed in context) and require it at host line 38 and on the Ibery commands. Dial: term length. Reason: AD38, a lapse should close the door, not just label it.
- **Reset table.** `harm_restart_scope.js` has no `book.mol.cyoria` row (sw-death owns it). Rows to add: resets body, money, held pass, operator training; carries aptitude. Source: GM11 pass, PG4 text read still needed for the canonical loop (what the lead keeps, who remembers).
- **Housing key and mentor quota** (GM6 MoL `W1`): not built; same grant shape fits (issuer, scope, expiry).

## Questions for Weibao (default and dial)
- Should a lapsed guest pass be renewable at the desk for crowns? Default yes at the same price; dial: price and renewals allowed.
