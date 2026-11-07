# Fix lane CONTINUITY report (2026-11-07)

CHECKPOINT: partial. 146 findings down to 12 (SHOWN: `node scripts/check_continuity.mjs`). Counts and refs only; no names (sealed shape).

## What changed

| Where | Change | Proof |
| --- | --- | --- |
| `scripts/check_continuity.mjs` | Dial `volumeRecords`: a file with top-level `volume` (lotm-abilities typed_v2..v8) is history, compared only with its own volume (CTR1). Dial `placeholderNames`: generic "address" placeholder names skip CTR2. `emitIdMap` now accepts ability and item ids (was person and place only). | CTR1 42 -> 0; 3 placeholder-anchor groups retired. |
| `private_packs/lotm-abilities/id-links.json` (new, checker-only) | 16 ability id variants linked to one id each. Typed files untouched (the game never loads them; only `scripts/lead_run` reads them, and evidence hashes cover them). | 15 CTR2 retired. |
| `private_packs/lotm-cast/continuity-links.json` (new, checker-only) | 106 ids linked in 81 groups (same name, one entity). Not in `private_packs/manifest.json`, so the game and the cast build ignore it. | 81 CTR2 retired. |
| `private_packs/lotm-cast/cast.json` | 21 spelling-variant `name` values on people rows set to the majority spelling (9 canonical names). Ids, indexIds, aliases, knows untouched. Round trip byte-identical (indent 2, ASCII escapes). Backup: `private/backup-2026-11-07/lotm-cast.cast.json`. | `diff` shows 21 changed lines; JSON parses; 62 cast tests pass before and after. |
| `tests/continuity_check.test.js` | One new test: volume dial, ability idMap link, placeholder skip. | 20 of 20 with names test. |
| `scripts/continuity_baseline.json`, `docs/continuity/CONTINUITY_BACKLOG.md` | Regenerated (12 entries). | |

## Left (12, all CTR2, need a human or source call)

- `e59b9ecf` (typed_v3), `3dbb9062` (typed_v4+v6), `eb9d17a8` (typed_v6), `a9ae142f` (typed_v6+v8): ability ids that may be variants or distinct (planned versus done, feed versus whole). Run `--show <ref>`.
- Cast, six groups judged unsure: `7b888db3`, `e67f27b0`, `c6b28f84`, `b5d4d79d`, `813ead49`, `d8249007`, `2279160a`, `0b664123` (title-only people such as shipboard ranks, a four-way title name, a father/MP pair, a mary pair, a cabin pair, a square name). Same-title rows can be different people on different ships, so they stay split.
- typed_v7 holds two ability-use labels filed under person ids (extraction defect, refs `b625524e`, `cf5912b9`). The volume dial hides them; fix is in the typing pipeline, not here.
- Not touched: roughly 190 place spelling variants (translation transliterations of streets, ports, islands) and about 50 person pairs tied on frequency or generic (titles, singular/plural, deliberate aliases). They need one spelling per world in the naming sheet (names lane owns it); then the renames are mechanical.

## Checks

- `node scripts/check_continuity.mjs`: ok, 12 known. `--no-private`: ok, 0.
- `node --test tests/continuity_check.test.js tests/names_check.test.js`: 20 pass.
- 14 cast and pack test files (lotm_cast_*, build_cast_pack, place_acts, cast_card_integration, cast_topic_talk, lotm_rites_live, lotm_pay, others): 128 pass, 0 skipped, so the pack loaded.
- `node scripts/check_names.mjs --private`: before GEN 21, DUP 119, VAR 292 (432). After GEN 21, DUP 123, VAR 269 (413). Renames retire VAR but the names check does not read idMap links, so four become DUP. Private baseline (`private/names_baseline_private.json`) updated. Public `check_names`: 0 findings. `--update-baseline` also rewrote `scripts/names_baseline.json` with identical content (0 keys).
- Not run: `npm test`, headless boot (coordinator).

## Notes for the coordinator

- Hand edits to cast.json are overwritten by a rebuild from `build_cast_pack.mjs`; apply the same name map in the authored base if the names should survive (see the "authored name" test).
- Proposed rulebook hunk for CTR2 (owner: CONTINUITY_RULES): add "volume records are compared only within their volume; placeholder names skip" to CTR1 and CTR2 dials.
