# LCB1-LCB3 implementation receipt (2026-11-03)

Rows LCB1-LCB3 of [the combat deep dive](LOTM_COMBAT_DEEP_DIVE_2026-11-03.md) (branch `claude/gifted-bardeen-7bdcdd`, commit 0491654ba). Cut from L1 commit 87b08418. Every number is an authored proposal (WPR5/AD49), evidence `I`; nothing is canon. Status: **implemented, below the AD43 floor** (pure data and tests; no UI, save or fight consumer yet).

## What changed
- `src/book_world_lotm_bands.js`: notch scale (reference adult 0, signed, no max or min); `BAND_DIALS` `{gain:1.5, logistic:1.1}`; `hitsToDown`, `winChance`, `contest(delta, rng)` (rng required, no built-in default); `REACH_NOTCH_SOURCES.fate` documented hook, not implemented; `PATHWAY_LEANS` for the 22 pathways; `SEQUENCE_CURVE` (+1 per Sequence, Seq 9 to 5; supporting one lower; weak and unlisted 0; Seq 4 and below return no band); `PATHWAY_FORMULA_KEY` (12 map to `lotm_formula_rows.js`, 10 null, including Darkness); dated cast subjects (Dunn: Darkness 7 Nightmare; Leonard: Darkness 8 Midnight Poet; Neil: Hermit, sequence open; all as of v1 ch101-210); unknown people still `no_band`.
- Ten L1 rows converted (minus 2, non-signature clipped to +1, `tools` read as control, `spirit` as spirituality, missing axes 0). **Deviation:** signature axes are also capped at the curve value for that Sequence. Without it Corpse Collector (toughness +3, 3.4 hits) and Gravedigger (+4, 5 hits) break LCT1's three-hit limit.
- `tests/lotm_calibration.test.js` (new, LCT1-LCT4 each named with locator), `tests/lotm_bands.test.js` updated.

## Checks
| Check | Result |
|---|---|
| `node --test tests/lotm_calibration.test.js tests/lotm_bands.test.js` | pass (14 incl. core_ratchets) |
| `npm run build` | pass |
| `npm run check:arch` | pass |
| `npm run check:rules` | pass (17 warnings, none new) |
| grep for a 0-10 ceiling / `referenceAdult:2` in the module and bands tests | none |
| Full `npm test` (once, pre-commit) | 4922 pass, 5 fail before one fix: `core_ratchets` Math.random count (mine, fixed, re-run passes). Four others unrelated to bands, not in files I touched: `book_world_lotm_opening`, two private-root CLI tests (ENOENT on gitignored `docs/research/novels` absent in this worktree), `place_act_sequence` Village shower. Not re-run on a clean base. |

## Unverified
- No browser run; no consumer exists. Nothing persisted, so no save/reload/import.
- Authored rows for Death/Tyrant etc. now sit at or below the curve; the curve rows for the other 12 pathways are inferred from leans only (LCB9 pins them).
- LCT2 assumes a trained adult's control axis is 0 (training adds notches on strength).
