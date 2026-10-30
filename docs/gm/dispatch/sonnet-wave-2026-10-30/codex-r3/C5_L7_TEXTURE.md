# C5 (L7): classify the LOTM texture rows
Model: gpt-6.1-sol medium for prep; classification goes to Luna briefs.
Context: LEDGER.md 'Whole-book gaps pass (L7)': families were classified for rule ids, but 28,987 LOTM texture and rules_other rows were not; only keyword upper bounds exist. `scripts/lead_run/family_pass.mjs prep|tally` is the existing tool; the GM gap register is [READING_GAP_MAP](../../../../research/READING_GAP_MAP_2026-10-28.md).
Steps:
1. Prep texture rows per volume into TSV inputs with the same family slugs the rule pass used (plus NEW only with a reason). Classification is one label line per id from the row's own summary text; no paragraph reading needed except for ambiguous rows (cap it).
2. Write Luna briefs of about 2,500-3,500 rows each (labelling is light), each owning one private answer file, and use `tally` as the fold.
3. Note: L14 already finished calendar and news for volumes 2-8 (LEDGER L14 section), so news rows are out of scope; skip them.
Owned paths: `docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c5/`, `private/wb-families-texture/` under the LOTM lead-run folder (private).
Done check: every texture id in exactly one Luna brief; tally dry run on prep passes.

Common rules (all Codex r3 lanes, 2026-10-30):
- You are one lane of round 3 of the [Sonnet wave](../PLAN.md); read [QUEUE.md](../QUEUE.md) for the walk procedure and [LEDGER.md](../LEDGER.md) for prior results in your family. Touch ONLY the owned paths below. No commits, no push, no stash/reset. Other sessions edit this checkout.
- The LOTM host files (`src/book_world_lotm_{host,state,cast_host}.js`, `src/simulation.js`, `src/domain_registry.js`) belong to floor-wire this round. Do not edit them; write a patch note in your owned folder if a host change is needed.
- Book text stays in gitignored `private/` folders. Tracked files carry ids, counts and your own English summaries only. Sealed secrets: ids only.
- Read cited paragraphs with: `node scripts/lead_run/cite_paragraphs.mjs docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27 --merged docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/m4-whole-book-2026-10-29/merged --id <id> --context 3 --max 8` (batch several ids per call).
- Design lines are default, dial and reason, never always/never. Inferred values are marked `inferred: true` with the basis; stated values win.
- Done report: files written, row counts, checks (command, result, gaps). If you could not finish, list the remaining ids or steps exactly.
- Luna split (only where this brief says so): if the bulk step is larger than about 300 rows, do the prep yourself, then write Luna briefs `luna_<n>.md` in your owned tracked folder, each owning ONE private output file, each ~150-300 rows, self-contained (input path, output path, schema, done check, the placeholder warning: every row must come from paragraphs actually read; unread ids go in a final {"unread":[...]} line). The coordinator launches them. Also write `fold.md`: how to merge the Luna outputs and the 15-row spot-check per family.
