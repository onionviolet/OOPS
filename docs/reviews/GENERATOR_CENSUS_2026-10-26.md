# Generator census, 2026-10-26

Scope: Q7 / IPC61 / FND1. The checker recognizes `gen_kit.js`'s addressed generation helper exports (`pickWeighted`, `pickStratified`, `shuffleBag`, `next`, `sampleAndScore`, `withRetries`, `peek`, `commit`), whose concrete signatures return value/receipt records or their stateful equivalent. Outside that kit it recognizes exported `generate*` functions with address-like parameters and a returned `{value, receipt}` pair. `generateRelic` is not counted: it takes an injected random cursor and returns a relic value directly, so it does not match GR1's kit shape.

This is a static census, not a semantic GR compliance proof. Reader detection searches `src/` outside the defining module for the export name. Test columns search `tests/` for generator-name and signal-word co-occurrence; budget detection searches the defining source for GR11 budget vocabulary. These yes/no marks need human inspection before being treated as complete evidence.

## First-run table

| Generator | Reader | Seed sweep | Golden (3 seeds) | Save/reload | Budget | Source hash |
|---|---:|---:|---:|---:|---:|---|
| `pickWeighted` (src/gen_kit.js) | yes | yes | no | no | no | `bbbd05aea220` |
| `pickStratified` (src/gen_kit.js) | no | no | no | no | no | `bbbd05aea220` |
| `shuffleBag` (src/gen_kit.js) | no | yes | no | yes | no | `bbbd05aea220` |
| `next` (src/gen_kit.js) | yes | yes | no | yes | no | `bbbd05aea220` |
| `sampleAndScore` (src/gen_kit.js) | no | no | no | no | no | `bbbd05aea220` |
| `withRetries` (src/gen_kit.js) | yes | no | no | no | no | `bbbd05aea220` |
| `peek` (src/gen_kit.js) | yes | no | no | no | no | `bbbd05aea220` |
| `commit` (src/gen_kit.js) | yes | yes | no | yes | no | `bbbd05aea220` |
| `generateUnshaped` (tests/fixtures/generators/unshaped.js, fixture only) | no | no | no | no | no | `fixture` |

## Detector fixture

`tests/fixtures/generators/unshaped.js` exports `generateUnshaped(input) { return input; }`. It is included as a fixture-only row with all census signals marked no; it is not counted as a detected source generator. The focused checker test verifies that it is excluded by the GR1 detector.
