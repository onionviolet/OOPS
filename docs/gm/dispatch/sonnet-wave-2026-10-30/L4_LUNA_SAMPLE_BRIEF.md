# L4 Luna brief: schema sample over later-volume rite and potion rows (WB1)

You write exactly ONE file: `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l4/later_schema_report.md` (gitignored; later-volume plot may appear there). No commits, no web, no edits elsewhere. Reading source output in your own tool calls is allowed (local, private); never paste source sentences into your final message.

Input: `.../private/lead-run-2026-10-27/l4/later_sample.jsonl` (20 rows: id, kind, shard, locator, volumes 2-8). For each id run
`node scripts/lead_run/cite_paragraphs.mjs docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27 --merged docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/m4-whole-book-2026-10-29/merged --id <id> --context 3 --max 8`.

Compare with what volume 1 rows needed (see `src/lotm_divination_rows.js`: fields id, targetId, question, method, label, description, locator, means, contact, ritual?, steps[kind prepare|rite|attempt|interpret|unknown, minutes, costs, status signal|obscured|unanswered, signal, belief, effects]).
Report, per row, in one line: id, volume, what the rite or potion procedure needs that those fields cannot hold. Then a summary list of NEW field or step-kind needs, each with a count out of 20 and example ids. Examples to look for: multiple participants or a ritual leader, sacrifice or offering consumed, spoken incantation naming a being, a summoned/responding entity with its own reply, cost in spirituality or health, time-of-day or moon conditions, dream/spirit-world location, repeated or conditional branching, group or item preconditions, potion digestion/acting-method conditions, backlash and loss of control, permanent changes to the user.
Keep descriptions generic (no later-volume plot names or events in the summary list; names only in the per-row ids). Done check: 20 lines plus a summary list with counts.
