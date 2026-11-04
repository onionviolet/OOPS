# Making donor: equivalent-exchange slice (2026-11-04)

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
