# Lane brief: WA23, evidence per killer-move recipe slot (2026-11-24)

Coordinator: Claude session (Gu blockers). Model: Codex Sol, medium. Code and data lane in the primary checkout (AD41), owned files only.

## Why

Weibao: "add the I1 and I2 ideas to the atlas ideaboard, can we start work by coordinating the codex and sending them out to work on those?" WA23 is in the [ideaboard](../../../research/WORLD_ATLAS_IDEABOARD_2026-11-22.md). Evidence: [community research](../../../research/RI_COMMUNITY_ANSWERS_2026-11-24.md) C1-C5 and I1, and the [Gu blocker audit](../../../audits/GU_UNKNOWN_BLOCKERS_SAMPLE_2026-11-24.md) F3. 651 `blocked:roles-unknown` and 63 `blocked:roles-unchecked` rows in `docs/coverage/gu_moves.jsonl` hide partial facts. Example: `ri:ch1561:p13` names four core Immortal Gu and 14 supplementary Gu for one Myriad Self configuration.

## Do

1. **Slot evidence file.** Build `docs/coverage/evidence/gu_move_slots.jsonl` (moved from `docs/coverage/` the same day: the coverage scripts read every top-level `.jsonl` there as a ledger), one line per slot observation: `move` (gu_moves id), `variant` (a short id when a source describes a distinct configuration, such as `myriad-self@ch1561`, else null), `role` (core, support, unnamed), `gu` (a gu_kinds id when resolved, else null), `name` (the source's name), `locator` (`ri:ch<N>:p<k>` or `wiki:<page>#<section>`), `tier` (chapter, wiki, community), `orderStated` (true when the source gives an order, else false), `order` (number or null), `resolution` (exact, alias, unresolved, collision). Names and locators, no text. No passage text goes in this file.
2. **Builder.** `scripts/gu_move_slots.py` (run with `python3 -I`) builds the file deterministically from:
   - the wiki-tier move roles already in `docs/coverage/wiki_tier_labels.json` (`gu_moves`) and the notes on `roles-unchecked` rows;
   - a free chapter pass over the local Reverend Insanity text. Reuse `load_ri`, `gu_terms`, `alias_names` and `norm` from `scripts/chapter_tier_packets.py` and `clean_left` from `scripts/gu_fulltext_rank_pass.py`. Find paragraphs near a move's name that list cores or supports ("The core Immortal Gu were ...", "supplementary Gu worms were ...", "used X Gu as the core"). Resolve each listed name to a gu_kinds id through names and aliases;
   - the chapter-backed community leads C1-C5. Enter each from its stated locator, and keep any entry the text does not support out of the file.
   Include `--self-test` with fixed sample sentences, including the ch1561 list shape and a name collision.
3. **Test.** `tests/gu_move_slots.test.js` (node test, like the other coverage tests) checks the jsonl: schema, known move ids, known gu ids when set, at most one row per (move, variant, role, name, locator), and no `text` field. It must pass without the private novel text.
4. **Do not change ledger states.** Slots are evidence for a second reader and for the atlas fold. Do not edit `gu_moves.jsonl`, `gu_kinds.jsonl` or the ledger scripts.
5. **Report.** Rows written; moves with at least one chapter slot; slots per tier; resolution counts; the 10 moves with the most slots; and 5 extracted chapter slots that you checked by eye against the text. Then the JSON contract the atlas fold should read.

## Rules

- Owned files: `scripts/gu_move_slots.py`, `docs/coverage/evidence/gu_move_slots.jsonl` (moved from `docs/coverage/` the same day: the coverage scripts read every top-level `.jsonl` there as a ledger), `tests/gu_move_slots.test.js`. Touch nothing else. `prototypes/world-atlas/` belongs to the atlas platform session, which wires the fold. Do not commit.
- No paid API, no network, no reading batches. Raw text stays in the private folders.
- Proposals, not decisions (AD32). Mark anything not checked by eye as unchecked.
- Run `node --test tests/gu_move_slots.test.js` and `python3 -I scripts/gu_move_slots.py --self-test`, and report the exit status of each.
