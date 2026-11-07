# NMR lane report (names and world vocabulary), 2026-11-06

CHECKPOINT: done for the public tree; partial for the book casts (they live in git-ignored
private packs, so they are covered by a local `--private` mode, not the shared baseline).

## Sweep (SHOWN, `node scripts/check_names.mjs`, 0.2s)

- 1,322 name fields in `src/**/*.js` (frontier 893, shared 275, book worlds about 150). The
  book-world cast is "name-free" in `src/` (AD1), so people for Tingen, Mother of Learning and
  the Hogwarts-era world are only visible in `private_packs/*/cast.json`.
- Public findings: 34 (GEN 31, REG 1, DUP 1, VAR 1). Cross-world collisions (XW): 0.
- Worst public examples: all 19 upstream NPCs in `src/data/npcs.js:65-87` are role names
  ("village elder", "gate guard", "old woman of the slums", "swampland scout"); "cat cafe trader"
  (npcs.js:88, modern word in an original world); "Red ant nest" on four places
  (locations.js:1054); "Village" and "Forest" as whole place names (locations.js:384, 792);
  generic recipe outputs "Axe", "Dagger", "Sword" (crafting_recipes.js:785-819).
- Private casts (SHOWN, local only): 3,074 cast names, 432 findings (DUP 119, VAR 292, GEN 21).
  Examples: one person under several rows ("Emperor Roselle" x3, "Lady Liana" x3, "Magician" x5);
  spelling splits "Pallez/Palez Zoroast", "Palas/Pallas Negan", "Gelman/Gorman Sparo",
  "Urdi Blanch/Blanche", "Welch McGovern/Mcgowen", "Gehrman Sparrow/German Sparrow". Many are
  one entity entered twice (a seat and a person); each needs a merge or a distinguishing mark.
- Village-life, Proto23 and Mistglass files carry almost no name fields in `src/`: their people
  come from generated or pack data (INFERRED), so the public check sees little there.

## Files written

`scripts/check_names.mjs`, `scripts/names_baseline.json`, `docs/NAMING_RULES.md` (NMR1-NMR8),
`docs/names/WORLD_NAMING_SHEETS.md` (generated, `--sheets`), `docs/names/NAMES_BACKLOG.md`
(generated, `--backlog`), `tests/names_check.test.js`, this report. Local only (git-ignored):
`private/names_baseline_private.json`, `private/names_private_report.md`.

## Check and test

- `node scripts/check_names.mjs`: 34 findings, 0 new, 0 stale. Flags `--update-baseline`,
  `--backlog`, `--sheets`, `--private`. Exports `scanSource`, `analyze`, `scanTree`, `checkTree`.
- `node --test tests/names_check.test.js`: 8 pass, 0 fail (fixtures for each code, allow
  comment, current tree vs baseline, runtime under 5s).
- Not run: `npm run check:rules` (package.json is not mine).

## Limits (INFERRED, be honest about them)

- World attribution is by file path. Files named for no world land in `shared`.
- GEN person detection uses a role-word list; "Mara the miller" passes, "the miller" fails.
- VAR uses edit distance 1-2 on person and place names; it has false positives (William and
  Williams, Maid and Maids, Prince and Princes). The private baseline absorbs them; a later
  pass could add a keep-apart list.
- Currency words in the sheets are counts of plain words in each world's files; the curated
  currency line is the authority until Weibao settles each world's money.

## Proposed owner hunks (for the coordinator)

1. `package.json`: `"check:rules": "... && node scripts/check_player_text.mjs && node scripts/check_names.mjs"` and `"check:names": "node scripts/check_names.mjs"`.
2. DESIGN.md DSG13, append to the Why column: "Names and world words follow NMR1-NMR8 ([naming rules](docs/NAMING_RULES.md)); a world's report voice never invents names its sheet lacks."
3. RULES_INDEX register row: `| NMR1-NMR8 | [Naming rules](NAMING_RULES.md) | Proposed 2026-11-06 | people, places, items, currency; check_names.mjs |` and a router row "names, titles, currency words, world vocabulary -> NAMING_RULES".
4. Backlog lane briefs that write names quote one sample from the world's sheet, as PRS7 does for voice.

## Top five backlog items

1. Give the Village and Frontier NPCs names (19 upstream role names, first-hour surface; keep ids, change display names; NMR1).
2. Rename "cat cafe trader" in the Frontier's register (npcs.js:88; NMR3).
3. Resolve "Red ant nest" x4 and the bare "Village"/"Forest" place names (NMR2).
4. Merge or mark the Tingen cast duplicates (locally: Roselle, Liana, Magician, Chief, Sun; NMR2).
5. Fix the Tingen spelling splits ("Pallez/Palez Zoroast", "Palas/Pallas Negan", "Urdi Blanch/Blanche"; NMR6).

## Open questions as defaults

- Upstream lower-case role names: default keep the display role as a title under a given name
  ("Mara, village elder"); credit stays with upstream.
- Whether the private-cast scan joins the shared gate: default no, run it locally before a cast rebuild.
