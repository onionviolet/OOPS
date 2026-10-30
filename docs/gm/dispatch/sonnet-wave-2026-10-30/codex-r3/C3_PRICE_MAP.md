# C3 (L2 coverage): map book price ids to game pence ids
Model: gpt-6.1-sol medium.
Problem: LEDGER.md L2 section: the registry's 430 `lotm.price.*` ids are quantities (`copper-penny`, `half-penny-coin`, `amt-1-soli`, `pound-note`, `weekly-total`, `cash-on-hand`, `several-hundred-pounds`) while the game stores prices as pence constants (see `src/book_world_lotm_ids.js`, `src/book_world_lotm_broker.js`, `src/lotm_formula_rows.js` and other pence users). So price coverage reads 0%.
Steps:
1. Build a pure mapping: each registry price id to an amount in pence (denominations as the game already defines them) plus the game id(s) or constant(s) that carry that price, or `unmapped` with a reason (vague amounts like several-hundred-pounds get a band, marked inferred).
2. Teach the coverage count to join through the map (read-only change to how `scripts/lead_run/coverage_ledger.mjs` counts prices, behind the existing output shape).
3. Focused tests.
Owned paths: `src/lotm_price_map.js` (new), `tests/lotm_price_map.test.js` (new), the price-count part of `scripts/lead_run/coverage_ledger.mjs` and `tests/lead_run_coverage.test.js`, `docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c3/`.
Done check: `node --test tests/lotm_price_map.test.js tests/lead_run_coverage.test.js` passes; coverage run on `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/m4-whole-book-2026-10-29/merged` reports a nonzero traceable price count; report mapped / band-inferred / unmapped counts.

Common rules (all Codex r3 lanes, 2026-10-30):
- You are one lane of round 3 of the [Sonnet wave](../PLAN.md); read [QUEUE.md](../QUEUE.md) for the walk procedure and [LEDGER.md](../LEDGER.md) for prior results in your family. Touch ONLY the owned paths below. No commits, no push, no stash/reset. Other sessions edit this checkout.
- The LOTM host files (`src/book_world_lotm_{host,state,cast_host}.js`, `src/simulation.js`, `src/domain_registry.js`) belong to floor-wire this round. Do not edit them; write a patch note in your owned folder if a host change is needed.
- Book text stays in gitignored `private/` folders. Tracked files carry ids, counts and your own English summaries only. Sealed secrets: ids only.
- Read cited paragraphs with: `node scripts/lead_run/cite_paragraphs.mjs docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27 --merged docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/m4-whole-book-2026-10-29/merged --id <id> --context 3 --max 8` (batch several ids per call).
- Design lines are default, dial and reason, never always/never. Inferred values are marked `inferred: true` with the basis; stated values win.
- Done report: files written, row counts, checks (command, result, gaps). If you could not finish, list the remaining ids or steps exactly.
- Luna split (only where this brief says so): if the bulk step is larger than about 300 rows, do the prep yourself, then write Luna briefs `luna_<n>.md` in your owned tracked folder, each owning ONE private output file, each ~150-300 rows, self-contained (input path, output path, schema, done check, the placeholder warning: every row must come from paragraphs actually read; unread ids go in a final {"unread":[...]} line). The coordinator launches them. Also write `fold.md`: how to merge the Luna outputs and the 15-row spot-check per family.
