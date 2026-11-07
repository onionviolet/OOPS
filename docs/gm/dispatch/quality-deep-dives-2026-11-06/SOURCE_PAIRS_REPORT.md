# Source pairs report (SOURCE-PAIRS lane, 2026-11-07)

CHECKPOINT: done except 3 findings with no evidence either way. Counts and refs only; names and evidence live in git-ignored `private/source-pairs/decisions.json`.

## Counts (SHOWN)

| Check | Before | After |
| --- | --- | --- |
| `check_names --private` | 104 (DUP 40, VAR 64) | 2 (DUP 2) |
| `check_continuity` | 11 | 1 |
| `check_names` public | 0 | 0 |

mol had no findings in the 104. hp had 1 (same place, listed as a decided spelling, no pack edit).

## Method (local, deterministic)

- Extracted the English Webnovel EPUB (1,469 files), the Calibre Chinese EPUB (1,391 chapters) and the wiki dump (1,833 pages) to `private/source-pairs/`.
- Cast locators without a `b<N>` prefix do not mean volume 1. Each row was scanned in all 8 volumes (paragraph +-2) for a literal Chinese name.
- Chinese name to English by the wiki `{{Language}}` templates and by chapter-set alignment (global chapter = volume offset + chapter). For the 42 rename groups the Chinese-name chapter set and the English-name chapter set overlap at Jaccard 1.0 for 29, 0.5 to 0.99 for 8; the rest have no English attestation.
- Canonical rule: attested in English text or wiki, else official spelling found by alignment, else majority of pack rows, else closest to the pinyin.

## Decisions

- Same entity, one spelling: 42 groups, 84 rows renamed (`name` only; ids and aliases untouched). 36 person groups, 11 place groups counting the Balam, street and hall groups. Most variants were machine pinyin; 28 groups now carry the official English spelling.
- Same entity, rows linked (checker-only `continuity-links.json`): 82 id links, including DUP pairs that kept their name.
- Distinct, with a reason each: 8 VAR pairs (2 are one person under two deliberate names), 15 DUP names (title beside holder, role-only names, anchor placeholders, ship ranks, two Williams).
- Continuity: 3 ability pairs linked, 1 pair distinct, 2 ship-rank pairs distinct.

## Left open (3), with what was searched

- Two person DUPs (Tracy row pair, Cuixi row pair): locator windows hold no name; English and wiki have 0 hits for the variant spelling.
- One CTR2 (a four-id single-letter title): only one locator window names it.

## Findings worth a human look

- Two place rows are named Backlund but the Chinese is East and West Balam (English 132 and 113 hits). Not renamed (they are distinct, not variants).
- One row's locator holds a street name, not a person (the knight William row). Locators in the pack are approximate.

## Files

- Changed: `private_packs/lotm-cast/cast.json` (84 `name` values), `continuity-links.json`, `private_packs/lotm-abilities/id-links.json`, `private/naming/lotm_spellings.json`, `private/naming/hp_spellings.json` (new), private and continuity baselines.
- Checker hunks (both files were claimed in CLAIMS.md): `scripts/check_names.mjs` adds `loadDistinct` and a third argument to `applySpellings` (reads `distinct` and `distinctDup` from `<world>_spellings.json`); `scripts/check_continuity.mjs` adds `emitDistinct`, maps distinct ids through `applyIdMaps`, and skips a CTR2 group when every id pair is listed. One new test in each of `tests/names_check.test.js` and `tests/continuity_check.test.js`.
- Backups: `private/backup-2026-11-07/sp-*` (pack, links, spellings, baselines, checkers, tests, mol and hp casts).

## Checks

- `node --test tests/names_check.test.js tests/continuity_check.test.js`: 24 pass.
- 52 cast, lotm, mol and hp test files: 664 pass, 6 fail. All 6 fail on `npm run check:arch` (`src/display.js` 6776 over baseline 6767), another session's edit, not a name change. Rerun after that clears.
- Not run: `npm test`, headless boot. A cast rebuild from `build_cast_pack.mjs` overwrites the renames; apply the same map in the authored base.
