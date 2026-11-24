# Lane brief: WA24, "Check this passage" before a paid read (2026-11-24)

Coordinator: Claude session (Gu blockers). Model: Codex Sol, medium. Code lane in the primary checkout (AD41), owned files only.

## Why

Weibao: "add the I1 and I2 ideas to the atlas ideaboard, can we start work by coordinating the codex and sending them out to work on those?" WA24 is in the [ideaboard](../../../research/WORLD_ATLAS_IDEABOARD_2026-11-22.md). Evidence: [Gu blocker audit](../../../audits/GU_UNKNOWN_BLOCKERS_SAMPLE_2026-11-24.md). Substring matches produced collisions ("Life Gu" inside "Remnant life Gu", "Thief Gu" inside "great thief Gu"). Some "blocked" rows were already answered in the text or by the chapter tier. A local check should come before any paid read.

## Do

1. **Checker.** `scripts/check_passage.py` (run with `python3 -I`). Input is a ledger row id (`--ledger gu_kinds --id plunder`, which reads the row's name plus `ri_aliases.json`), or a name with optional aliases (`--name "Plunder Gu" --alias ...`). Optionally narrow it with `--chapter N` or `--chapters A-B`. Output is the matching Reverend Insanity paragraphs with locator, the matched term, and one tag each:
   - `fact`: a rank, type, effect or recipe role bound to the name. Reuse `ranks_in` and `list_ranks` from `scripts/gu_fulltext_rank_pass.py`, and add effect cues such as "can", "allows", "is used to", "its ability";
   - `mention`: the name appears, with nothing bound to it;
   - `collision`: the match sits inside a longer Gu name (`clean_left` from the rank pass, or a longer known gu_kinds name that contains the term);
   - `hypothesis`: a character's guess (quoted speech with "perhaps", "maybe", "might", "could it be", "I guess", or a question).
   It also reports any existing evidence for the row: chapter-tier and wiki-tier labels (`docs/coverage/chapter_tier_labels.json`, `wiki_tier_labels.json`) and `fulltext_gu_ranks.json` in the private folder if present. That shows whether the row is already answered.
   Modes: human-readable by default; `--json` for the atlas. Reuse `load_ri` and helpers from `scripts/chapter_tier_packets.py`, and cache the loaded text in the gitignored private folder so a second call is fast.
2. **Self-test.** `--self-test` runs fixed sentences through each tag, including the collision and hypothesis cases.
3. **Test.** `tests/check_passage.test.js` runs `--self-test` and checks the `--json` shape on one row. It skips with a message when the private novel text is absent.
4. **Report.** Results for `plunder`, `candidate:life-gu`, `saga:thief-gu`, `fandom:Time_Anchor_Gu` and `lead:myriad-self` as the tag counts and the top fact per row, plus the run time cold and cached. Then the `--json` contract for an atlas gap-card endpoint.

## Rules

- Owned files: `scripts/check_passage.py`, `tests/check_passage.test.js`. Touch nothing else. `prototypes/world-atlas/` belongs to the atlas platform session, which wires the gap-card action. Do not commit.
- `--json` output carries passage text for local dev use. Do not write it into tracked files.
- No paid API, no network.
- Run the test and self-test, and report the exit status of each.
