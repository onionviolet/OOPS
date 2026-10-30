# L4 Luna brief: typed divination and summoning rows (volume 1)

You write exactly ONE file: `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l4/luna_rows.jsonl` (gitignored; Chinese source prose may appear there). No commits, no web, no edits to any other file, Reading the cites file and cite_paragraphs output in your own tool calls is expected and allowed (it is local and private); just never paste source sentences into your final message or any file other than the one you own.

Input: `.../private/lead-run-2026-10-27/l4/cites1.txt` (cited paragraphs for 8 ids; `*` marks the cited paragraph, others are context). For more context run
`node scripts/lead_run/cite_paragraphs.mjs docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27 --merged docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/m4-whole-book-2026-10-29/merged --id <id> --context 4 --max 12`.
Ids: lotm.rite.altar-dream-divination, lotm.rite.altar-search-divination, lotm.rite.cane-dowsing, lotm.rite.copper-whistle-summon, lotm.rite.copper-whistle-messenger, lotm.craft.coin-divination, lotm.craft.pendulum-divination, lotm.rite.mirror-divination. (altar-dream and altar-search share ch 121; if they are one procedure, say so in `merge_with`.)

One JSON object per id, fields:
`id`, `locators` (["zh 第N章 pM", ...] the paragraphs you used), `method_label` (short English), `conditions` (what must be true: place, time, tools held, state), `inputs` (objects held/spent, with quantity if stated), `steps` (ordered list of {kind: prepare|rite|attempt|interpret, text_en: one short English sentence, minutes_stated: number|null}), `signal_form` (what the lead perceives; observation only), `products` (what is learned or caused), `costs` (spirituality, money, items, risk), `failure` (stated failure or backlash, else null), `tags` (per field name -> "S" shown on page, "T" told by a character, "I" inferred by you), `gaps` (fields the paragraphs do not support: list them rather than invent).

Rules: English summaries in your own words, never copy source sentences. Only S or T content goes in non-gap fields; anything inferred is labelled I and kept minimal. Do not invent numbers. If the cited paragraphs show a rite performed but not its inputs and results, set `usable: false` and list gaps. Add `usable: true|false` to every row.
Done check: the file has 8 lines, each valid JSON, each with `usable`.
