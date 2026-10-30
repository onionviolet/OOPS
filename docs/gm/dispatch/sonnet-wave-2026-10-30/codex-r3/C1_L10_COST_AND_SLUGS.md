# C1 (sw-adv / L10): inferred ability costs, then slug clustering
Model: gpt-6.1-sol medium (prep and code); bulk goes to Luna briefs.
Decision basis: [CHOICES item 2](../CHOICES.md) default: rows with no stated cost get a cost inferred from the rung (sequence) and the ability's mechanism, as adjectives per world (cost, cooldown, risk), marked inferred; stated costs win.
Inputs: [L10 design](../L10_ADVANCEMENT_DESIGN.md), `src/ability_records.js`, `src/lotm_advancement.js`, `scripts/lead_run/ability_typing.mjs` and its private outputs (find them from the L10 rows in LEDGER.md and the design note).
Steps:
1. Count ability rows with and without a stated cost. Write the inference rule (rung x mechanism to cost/cooldown/risk adjectives) as a pure function plus focused tests. Where the record shape needs a field, add it as optional.
2. Apply it to every costless row into a private file; stated rows are untouched.
3. Slug clustering: about 1,575 ability slugs. Prep the slug list with counts and one-line meanings, then write about 7 Luna briefs that each cluster a slice into canonical groups (synonyms, same mechanism different name) with a proposed canonical slug, and a fold step that merges clusters across slices.
Owned paths: `src/ability_cost_infer.js` (new), `tests/ability_cost_infer.test.js` (new), optional new fields in `src/ability_records.js` only if needed (tell the coordinator), `docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c1/` (tracked briefs and fold note), `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l10/cost-infer/` and `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l10/slug-cluster/` (private).
Done check: `node --test tests/ability_cost_infer.test.js` passes; every costless row has an inferred cost or a reason; Luna briefs cover every slug exactly once.

Common rules (all Codex r3 lanes, 2026-10-30):
- You are one lane of round 3 of the [Sonnet wave](../PLAN.md); read [QUEUE.md](../QUEUE.md) for the walk procedure and [LEDGER.md](../LEDGER.md) for prior results in your family. Touch ONLY the owned paths below. No commits, no push, no stash/reset. Other sessions edit this checkout.
- The LOTM host files (`src/book_world_lotm_{host,state,cast_host}.js`, `src/simulation.js`, `src/domain_registry.js`) belong to floor-wire this round. Do not edit them; write a patch note in your owned folder if a host change is needed.
- Book text stays in gitignored `private/` folders. Tracked files carry ids, counts and your own English summaries only. Sealed secrets: ids only.
- Read cited paragraphs with: `node scripts/lead_run/cite_paragraphs.mjs docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27 --merged docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/m4-whole-book-2026-10-29/merged --id <id> --context 3 --max 8` (batch several ids per call).
- Design lines are default, dial and reason, never always/never. Inferred values are marked `inferred: true` with the basis; stated values win.
- Done report: files written, row counts, checks (command, result, gaps). If you could not finish, list the remaining ids or steps exactly.
- Luna split (only where this brief says so): if the bulk step is larger than about 300 rows, do the prep yourself, then write Luna briefs `luna_<n>.md` in your owned tracked folder, each owning ONE private output file, each ~150-300 rows, self-contained (input path, output path, schema, done check, the placeholder warning: every row must come from paragraphs actually read; unread ids go in a final {"unread":[...]} line). The coordinator launches them. Also write `fold.md`: how to merge the Luna outputs and the 15-row spot-check per family.
