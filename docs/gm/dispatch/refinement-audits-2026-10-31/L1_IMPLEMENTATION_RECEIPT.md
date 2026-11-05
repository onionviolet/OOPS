# L1 implementation receipt: pathway-and-sequence band table (2026-11-03)

Round row L1 of [B2/B3 more to consider](B2_B3_MORE_TO_CONSIDER_2026-11-03.md) (D1/R1; WA33, WA43, WA50; AD36, AD43, AD38, AD49). Seam: new data module only, no `main.js` line.

## Built
- `src/book_world_lotm_bands.js`: `LOTM_BAND_ROWS` (Tyrant, Death, Fool, Visionary, Door at Sequence 9 and 8), two shapes (`physical`: strength, speed, toughness, endurance; `perceptual`: perception, spirit, tools, force), `bandFor`, `subjectOf`, `fightWindow`. Sequence unknown is carried `open` (the pathway's lowest row as a floor, marked `open`); pathway unknown reads a generic open Beyonder floor; a person with no subject is refused (`no_band`).
- Every number is a proposal (WPR5/AD49); each row has evidence `I` and a locator naming the Sequence 9/8 abilities it was inferred from.
- `tests/lotm_bands.test.js`: sailor hostile (Tyrant, Seq 8, physical) and Old Neil (open) both read a band; `fightWindow` refuses an unknown person.

## Evidence rows
| Row | State |
|---|---|
| source-edited | yes |
| focused-tested | `node --test tests/lotm_bands.test.js`: 3 pass |
| built | `npm run build` ok; `check:arch` PASS; `check:rules` PASS (17 UR-citation warnings, not from this change) |
| native (browser/MCP play) | not exercised: nothing in the game calls `fightWindow` yet |

## Not verified or not done
- Full `npm test` not run (committer gate).
- No novel paragraph pinned: all rows are `I`, locators point to the repo's ability rows. Upgrade to `S`/`T` needs text passes.
- Old Neil's, Dunn's and Leonard's pathway and sequence are not stated in the repo, so they read the open floor. Savant has no formula row pathway, so the sv hostile reads the open floor.
- Other pathways (Sun, etc.), sequences 7 and below, and the cast pack are untouched. No combat engine or UI consumer exists; hidden-strength split (shown vs believed vs actual) is not modelled here.


## Content reconciliation B470: receipt scope and later consumer evidence

All22 L1 receipt lines were read. Ten rows for five pathways/two sequences, the physical/perceptual shapes, open floors and no_band refusal were a bounded data/source/test slice at that date. Evidence I and ability-row locators are authored inference, not pinned novel paragraphs or current character truth. Three focused tests, build/architecture/rules checks and zero native consumer exercise are separate states. Later LCB1–LCB3 changes supersede selected scale/subject assumptions; do not repeat L1's old cast floor assignments or no-consumer statement as current fact. The cast pack, unknown actual strength and displayed/believed values retain separate owners. Current [PROJECT](../../../../PROJECT.md), AD49/AD32/AD36/AD43 govern selected implementation; this reconciliation adds no combat consumer or source qualification and ran no runtime/test/build/browser.
