# Codex lane brief · S · Hogwarts spell ledger source check (2026-11-12)

Owner: chat S (`claude/fdn-s-spellcraft-ec4a66`). Launched by the coordinator under Weibao's Codex authorization and usage ceiling; S reviews the diff before anything is committed. Rules that apply: AGENTS.md (no em dashes, sealed secrets by ID, raw book prose stays out of git), SKR1 and SKR3 (every fact names its medium, edition and locator; inference stays labelled), WPR21 (label every claim with evidence), AU13 (one finite plan, no open-ended reading).

## Goal

Source-check the effect truth of the 94 `runs-authored` rows in `docs/coverage/hp_spells.jsonl` against the cited omnibus pages, so the ledger's runs share rests on checked rows. For each row, confirm or correct five fields of `truth` in `src/spell_pack_hogwarts.js` (verb, object, target, time, direction), the locator, the delivery (`spoken`, `whispered`, `mental` and so on) and the gesture, where the cited scene shows them. Mark rows whose cited scene does not support the effect.

## Inputs (read only)

- `src/spell_pack_hogwarts.js`: `HP_SPELL_ROWS` (the rows to check), `HP_SPELL_LEDGER_EXCEPTIONS`.
- `src/spell_effects.js`: the verb, object, target and time vocabulary and `INTENT_LAW`. Use these words and no others; a missing word is a finding for S.
- `docs/research/HOGWARTS_SPELLBOOK_2026-11-11.md` and `docs/research/HOGWARTS_SPELL_VOCABULARY_PROPOSAL_2026-11-11.md`: the catalogue and the earlier scene checks.
- The omnibus search index `docs/research/novels/harry-potter/source-preparation-2026-10-11/search.sqlite` (gitignored, primary checkout). Query it by page or phrase; read a bounded window around each cited page (at most 2 pages either side).

## Files the lane may touch

- `src/spell_pack_hogwarts.js`: edit the `truth`, `locator`, `delivery`, `gesture` and `note` fields of existing rows, and nothing else in the file. No new rows, no removed rows, no new intents.
- `docs/gm/dispatch/foundation-s-2026-11-12/source_check_hp_spells.jsonl` (new): one line per checked row, `{"id", "verdict": "confirmed"|"corrected"|"unsupported"|"not-found", "fields": [changed field names], "locator": "...", "paraphrase": "<one sentence, own words, at most 25 words>", "evidence": "shown"|"stated"|"inferred"}`.
- Private notes, if any: `docs/research/novels/harry-potter/private/spell-source-check-2026-11-12/` (gitignored). Raw prose goes there and nowhere else.

Nothing else. If a correction needs a new intent, verb or object, record it as `"verdict": "unsupported"` with the missing word in `paraphrase`, and leave the row unchanged; S decides (EF2).

## Focused tests

```
node --test tests/spell_grammar.test.js tests/spell_working.test.js
node scripts/spell_coverage.mjs --check
node scripts/check_doc_slips.mjs
```

Run `node scripts/spell_coverage.mjs` (no flag) after editing the pack so the ledger regenerates, then `--check`.

## What to return

1. The diff (pack edits, the new source-check file, the regenerated ledger).
2. Counts: confirmed, corrected, unsupported, not-found, out of 94.
3. Each corrected row in one line: id, field, old value, new value, locator.
4. The focused test output (pass and fail counts).
5. Any query or reading that hit a limit (budget, missing page, index error).

## Done check

- All 94 rows have a verdict in `source_check_hp_spells.jsonl`.
- `node --test tests/spell_grammar.test.js tests/spell_working.test.js` passes, and `node scripts/spell_coverage.mjs --check` passes.
- No raw book sentence longer than 15 words appears in any tracked file (grep the diff).
- No em dashes in the diff.
- Commit nothing; S reviews and commits.

## Budget

94 rows, about 2 pages read per row, one pass. Stop at the usage ceiling the coordinator set and return what is done with the remaining ids listed.
