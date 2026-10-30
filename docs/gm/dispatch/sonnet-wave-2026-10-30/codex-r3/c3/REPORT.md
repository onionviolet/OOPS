# C3 price crosswalk receipt, 2026-10-30

F1. The ledger previously matched book price ids literally, while game amounts use native pence. This lane adds a pure quantity crosswalk and changes the price-count join. Existing ledger output keys, volume filtering, direct-id matching and other families are preserved. This is read-only coverage tooling, not a gameplay implementation or a new price policy. AD36 focused verification and AR3 denomination authority apply; [architecture owner](../../../../../ARCHITECTURE_RULES.md).

F2. Registry input has 1,399 prices across the book, including the ledger's 430 volume 1 ids. Results:

| Scope | Mapped | Band inferred | Unmapped | Traceable in corpus |
| --- | ---: | ---: | ---: | ---: |
| Volume 1 | 382 | 2 | 46 | 99 / 430 (23.0%) |
| Whole registry | 1,199 | 16 | 184 | 153 / 1,399 |

Mapped includes stated ranges: 3 in volume 1, 14 overall. Those ranges have no point value and do not count as consumed through this join. Inferred bands have `inferred: true` and a basis, and likewise do not count. Stated metadata wins over a vague id.

F3. Traceability means an exact quantity and an enumerated game carrier's source fragment are present in the input corpus. It does not prove the same item, service or transaction is implemented. The carriers include the native denomination constants, broker prices, and civil contract pay. Scaled formula prices are not silently equated to canon pounds. A generic conversion constant does not consume arbitrary multiples; bare matching numbers do not count. This remains a source-text proxy, consistent with the existing ledger, rather than parsed code or runtime proof.

## Files

- `src/lotm_price_map.js`: strict whole-field registry quantity parsing, explicit gap reasons, separate stated/inferred bands, game carrier references, pure batch trace join. Native conversion comes from `LOTM_PENCE`.
- `scripts/lead_run/coverage_ledger.mjs`: import, batch trace set and price-only condition.
- `tests/lotm_price_map.test.js`, `tests/lead_run_coverage.test.js`: quantity, band, ambiguity, false-positive and corpus-gated join regressions.
- [price-map.jsonl](price-map.jsonl): one safe output per registry price id, with amounts, status, basis/reason, game refs, volume 1 flag. Exact unresolved ids are the rows with `status: unmapped`.
- [inputs-and-counts.json](inputs-and-counts.json): counts and SHA-256 identities for the registry, changed source/tests and scanned game files. The full general ledger remains outside tracked docs at `/tmp/c3-price-coverage.json`.

## Checks

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/lotm_price_map.test.js tests/lead_run_coverage.test.js` | 9 passed, 0 failed | Focused tooling slice only |
| `node scripts/lead_run/coverage_ledger.mjs --merged docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/m4-whole-book-2026-10-29/merged --out /tmp/c3-price-coverage.json` | Exit 0; prices 430 total, 99 consumed, 23.0% | Other sessions may change corpus after this receipt; hashes identify these inputs |
| `git diff --check -- src/lotm_price_map.js tests/lotm_price_map.test.js scripts/lead_run/coverage_ledger.mjs tests/lead_run_coverage.test.js docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c3` | Passed | No staging or commit |

## Limits and handoff

The parser consumes the merged registry's quantity metadata, not newly read source paragraphs. It deliberately leaves contextual descriptions, OCR corruption, unknown currencies, weights and ambiguous shorthand unmapped rather than extracting a plausible number. `lotm.price.copper-penny` is explicitly unmapped because its merged metadata conflates a one-penny denomination and a four-penny amount. Half-penny quantities translate to 0.5 pence without claiming a matching game carrier.

The 46 volume 1 and 184 whole-registry unresolved ids are fully enumerated in the JSONL with reasons. Their source adjudication and expansion of the enumerated carrier catalogue are future coverage work, not missing steps in this brief. No host change is needed. No runtime, UI, save, build or browser claim is made. Full-suite/integration gates and committing owned files remain with the coordinator. Agent-verified tooling, not human-reviewed; no commit or push.
