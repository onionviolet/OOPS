# Shared rules lanes (2026-11-24)

Coordinator: Claude session (Gu blockers). Weibao: "work on the missing shared rules next", following the [reconciliation results](../../../audits/PROPOSAL_RECONCILIATION_2026-11-24.md#results-2026-11-24-agent-verified-not-human-reviewed).

**Why these two.** The cross-world blocker census on `d5faedc5d` puts `area-field` first (2,933 rows in 156 ledgers). The area-field law (`src/area_field_law.js`) exists but stays a spec: its dry run took 8.4%, under the PWC60 quarter floor (`docs/coverage/fields/law_take.json`). Its misses:
- 1,281 have no stated sentence (a labelling gap, out of scope here);
- about 420 hit objects with "no world account" (`add.force` 167, `alter.force` 57, `move.position` 50, `remove.thing` 14, and others);
- 92 have delayed or triggered time with "no pulse model".

The item-bound law (PWC55) left 726 rows on the same missing objects, and form-transformation defers force, position and thing to "another law". So a shared world-account layer and a timing model unblock several laws at once.

| Lane | Work | Model | Owned files |
|---|---|---|---|
| R1, terms and timing | World accounts for objects the world layer already supports; delayed and triggered pulses; area-field dry run; wire it if it passes | Codex Sol, medium | `src/item_bound_law.js`, `src/area_field_law.js`, `scripts/law_defaults.mjs`, `docs/coverage/fields/law_take.json`, `docs/coverage/derivation_rules.json` (law rows), a new area-ledger attach script if wiring, their tests, `r1/` here |
| R2, force | Design and build the `force` object in the world layer | Codex Sol, medium | `src/world_effects.js`, a new `src/force_*.js` if useful, their tests, `docs/research/FORCE_OBJECT_DESIGN_2026-11-24.md`, `r2/` here |

Shared rules:
- Touch owned files alone. Do not commit, stash, reset, force or push.
- The coordinator regenerates `docs/coverage/README.md` and adds R2's force terms to R1's table after both land.
- No paid API, no network.
- Runtime code follows AR1–AR16 (`docs/ARCHITECTURE_RULES.md`); no rewrite.
- Proposals (AD32), agent-verified, not human-reviewed.

## Coordinator result (2026-11-24)

F1. R1 raised the area-field dry-run take from 8.4% to 16.2% (476 of 2,933). That is below PWC60's 25%, so area-field stays a spec.

F2. R2's held force works in W. Adding `add`, `alter`, `remove` and `block.force` to the shared terms lifted the dry run to 27.4% (holdout 25.7%). A read of the labelled area rows showed that the label rarely means held force. Of 208 `add.force` rows, 133 describe damage or blasts and about 7 describe stored force. Most `block.force` rows are barriers and most `alter.force` rows are gravity or quakes. The force terms were left out of the table, and the take stays at R1's 16.2%. R2's `force` stays an engine verb that authored workings can use directly.

F3. The force label conflates three meanings: impact damage, a barrier, and a gravity or pressure change. Splitting it is a labelling decision, so it is parked as a proposal and not acted on.

F4. R1's wider terms attach 121 more item-bound rows: `move.position` 48, `add.thing` 39, `move.thing` 11, and others. The ledgers were regenerated so the sidecar rebuild tests match. A sample read mostly fits, with some label-level misreads that come from the unchecked labels.
