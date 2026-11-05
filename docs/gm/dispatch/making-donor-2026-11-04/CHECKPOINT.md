# Making donor: equivalent-exchange slice (2026-11-04)

```receipt
build: n/a
route: fixture(rune bench carve and recarve, test hooks)
state: built
viewport: 1920x1080 and 1536-wide desktop
persistence: checked
tests: 18 and 12 focused tests pass (exchange_ledger, pledges, rune_grammar, progression_pledges); headless run tests/exchange_bench_browser.mjs
review: none
surface: rune bench recarve credit; build SHA-256 was not recorded, so the state stays built, not browser-verified
```

Approved by Weibao 2026-11-04 (playability plan round 12 addendum, row 7). One mechanic, not a new world (WR9). MAW stages 0, 4, 5, 7.

## Fit (stage 0)
- Source claim: FMA Alchemy r78024 (Equivalent Exchange) and Philosopher's Stone r78123 (Composition); packet row "Equivalent exchange accounting" in `docs/worlds/fullmetal-alchemist/MODULE_CATALOGUE.md`. Wiki-revision evidence, secondary. No manga read, nothing downloaded, Witch Hat Atelier untouched.
- Acceptance line: W22.W17 (`docs/worlds/world-core-kit-2026-10-14/W22_DEPENDENCY_CHAINS.md`): conserved stock, typed operation, actual changed object; a provenance card must not create matter or duplicate custody.
- The packet states no universal price function and unquantified rebound. So the units are the game's own (one wood per rune), labelled native accounting, proposal. Not FMA canon, no lore numbers.
- Live gap found in code: recarving (`carve`, `carveCharged`) replaced the worn strip with no receipt; its wood vanished.

## What changed
- `src/exchange_ledger.js` (new, pure): `quoteExchange`, `releasedUnits`, `assertConserved`. Credit plus debit equals need; the old strip's surplus stays as residue, never returned, never minted into a log (MR29: conserved identity keeps its own resolver, not in `rune_grammar.js` or `craft_resolver.js`).
- `src/pledges.js`: `wornRelease`, `carveQuote`; `runeView` carries the release. `src/pledges_domain.js`: both carve commands debit the quoted amount inside the existing `transact()` rollback boundary; under-offering refuses with a reason (no rebound damage). `src/pledges_ui.js`: preview says what the worn strip covers.
- Next consumer, not wired: the craft engine.

## Evidence (kept separate)
| State | Result |
|---|---|
| Source edit | done |
| Focused tests | `node --test tests/exchange_ledger.test.js tests/pledges.test.js tests/rune_grammar.test.js tests/progression_pledges.test.js`: 18 and 12 pass, 0 fail (ledger conservation, refusal, release fade, domain rollback, recarve at zero stock) |
| Build and arch | `npm run build` ok; `npm run check:arch` ok |
| Native browser | `node tests/exchange_bench_browser.mjs` (headless Chrome, fresh origin, test_hooks): carve 3, recarve covered 2 spend 0, stock stays 3, at 1920x1080 and 1536x864 at 14 and 21 px; 0 page errors. `evidence/browser.json`, screenshots |
| Persistence | No new saved field. Reload, Export and literal Import kept stock 3 and the worn tablet at all three sizes. SAVES.md ledger row added |
| Human acceptance | none; agent-verified, not human-reviewed |

## Not done (later depth, proposals)
Rebound damage for under-offering; Stone reserves; array legibility and falsification; craft-engine consumer; weapon-rune inscription beyond the affix reroll; primary-source (manga or Brotherhood scene) pin before any FMA-labelled content.


## Content reconciliation B478: actual rune accounting and missing build identity

All38 receipt lines were read. The exchange ledger, worn-release/quote, domain rollback and recarve preview form a selected native rune-accounting consumer. Released strip credit, newly debited wood and retained residue are distinct; surplus remembered material is not an inventory log. That local accounting is authored in the game's units, not a canon FMA price law or an implemented rebound/Stone mechanism. A source-supported recovery/creation law could behave differently without duplicating this actual stock accidentally. The secondary wiki revision and packet reference do not establish primary-scene source qualification.

The receipt deliberately remains built because its browser run lacks a recorded build SHA256. Reported carve/recarve, dimensions/text sizes, zero page errors and literal persistence are retained observations, not discarded, but they do not meet a pinned browser-verified identity by themselves. No new saved field differs from claiming every earlier/later game state compatible.18 and12 focused results cover their actual ledger/rune/pledge slices; no fresh whole-suite result is implied. The craft-engine consumer, weapon inscription, source pin, rebound/Stone and legibility work remain separate. Current [PROJECT](../../../../PROJECT.md), [making rules](../../../MAKING_RULES.md), AD49/AD36/AD43 and AD42 govern selected extension. No primary source, private excerpt, current code, quote, screenshot, browser/test/build or personal save was newly opened or run.
