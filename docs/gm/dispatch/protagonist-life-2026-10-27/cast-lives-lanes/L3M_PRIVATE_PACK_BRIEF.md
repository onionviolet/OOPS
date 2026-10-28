# L3m brief: move canon cast data into the private pack (AD1)

Model: `gpt-6.1-sol`, medium effort (touches the host load path and save compatibility). Runs locally in
`/Users/weiwei/code/yet-another-idle-rpg`. Starts after L4a and L6b report. Do not commit; the
coordinating session commits. Never stash, reset, force or push. Plan:
[CAST_LIVES_PLAN_2026-10-28](../CAST_LIVES_PLAN_2026-10-28.md) section 17 (CL141-CL143, CL153).

## Why

Accepted direction (PROJECT.md book worlds, AD1): direct book recreations live in a private pack outside
git and outside `dist/bundle.js`; the public fork keeps original names. `origin` is public. The cast data
L3 and L6b wrote under `src/` is a direct recreation, so it moves.

## Steps

1. **Pack files.** Write `private_packs/lotm-cast/cast.json` from `LOTM_CAST` in
   `src/book_world_lotm_cast.js`, and `private_packs/mol-cast/cast.json` from L6b's MoL module if it
   exists. Include L4a's day bindings (`src/book_world_lotm_cast_days.js`) in the LOTM pack. `private_packs/`
   is gitignored; confirm with `git check-ignore`.
2. **Bridge modules in `src/`.** Replace each data module with a pure bridge holding no canon names, ids
   or rows: `validateLotmCast(pack)`, `lotmAnchorProbes(pack)` (and the MoL pair). Same validation as now.
   The day-binding module becomes data inside the pack the same way.
3. **Runtime load.** Load the cast packs through the existing private-pack route (`loadContentPacks` in
   `src/content_packs.js` reads `private_packs/manifest.json`), or a sibling loader with the same
   fetch-if-present pattern if the cast pack is not a world pack; add the packs to the manifest. When a
   pack is absent: the beside start is hidden, the four other starts are unchanged, and a save made in a
   beside life loads with the cast shown as unavailable instead of failing (CL153).
4. **Tests.** Focused tests use synthetic fixtures with invented names; nothing in `tests/` names canon
   people. Add `scripts/check_private_cast.mjs`, which validates the real packs when present and prints
   "skipped: private pack absent" otherwise.
5. **Sweep.** `git grep` the tracked tree for the principals' canon names introduced by this work
   (L3, L4a, L6b files) and list any remaining hit; plan and checkpoint docs may name people (committed
   docs paraphrase and link, research rules), code and tests may not.

## Owned files

`src/book_world_lotm_cast.js`, `src/book_world_lotm_cast_days.js`, `src/book_world_mol_cast.js` (if
present), their tests, `scripts/check_private_cast.mjs`, `private_packs/lotm-cast/`, `private_packs/mol-cast/`,
`private_packs/manifest.json` (one line each), and minimal hunks in the host load path L4a created.
Checkpoint: `cast-lives-lanes/L3M_CHECKPOINT.md`.

## Done check

- `npm run build`; `dist/bundle.js` contains none of the principals' canon names (`grep -c`).
- Focused tests pass; `node scripts/check_private_cast.mjs` passes with the packs and skips without them
  (rename the folder temporarily to prove it, then restore it).
- The beside start works with the pack present (L4a's focused test) and is hidden without it; the other
  starts are unchanged either way.
- `npm run check:arch` no growth. One line per check in the checkpoint.

## Not in scope

History. The local commit `92af8ce99` still holds the data; removing it from history is Weibao's call
(CL142). Do not rewrite history.
