# L4 Luna brief 3: classify volume 1 potion rows against what the game already models

You write exactly ONE file: `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l4/potion_classes.jsonl` (gitignored). No commits, no web, no edits elsewhere. Reading source output in your own tool calls is allowed (local, private); never paste source sentences into your final message or any file but the one you own.

Inputs (all under `.../private/lead-run-2026-10-27/l4/`): `potion_rows.jsonl` (132 rows: id, locator, shard), `formula_names.txt` (the formula table the game already has: "pathway seq name", 43 rows with known ingredients).
Per row, read the cited paragraph with context: `node scripts/lead_run/cite_paragraphs.mjs docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27 --merged docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/m4-whole-book-2026-10-29/merged --id <id> --context 2 --max 4` (batch several ids per shell call to save time; ids can repeat across locators, match on locator).
What the game already models (do not re-author): potion drinking, acting-count digestion with a felt state (digestion needs N acts in the role, assessment by a senior), promotion exams, loss of control when undigested/out of order, the formula table above (main + auxiliary materials, price tiers).

Classify each row, one JSON line: `{id, locator, class, formula_match, note_en}` where `class` is one of:
- `formula_dup`: restates a formula/ingredient/price fact for a potion in formula_names.txt (put the matching "pathway seq name" in `formula_match`);
- `digestion_dup`: restates digestion by acting/role-play already modeled;
- `risk_dup`: restates loss-of-control/advancement risk already modeled;
- `new_rule`: a stated potion rule the game lacks (compatibility with a pathway, swapping, trait-matching, dosage, mixing, side effect, remedy/herbal preparation, ritual oil): say what in `note_en` (one sentence, own words);
- `no_content`: citation does not show a potion rule.
Use S/T/I prefix in `note_en` for new_rule rows (S shown, T told, I inferred). Do not invent. Done check: 132 lines, valid JSON, a `class` on each.
