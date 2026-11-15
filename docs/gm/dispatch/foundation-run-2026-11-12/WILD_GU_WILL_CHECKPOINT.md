# Wild Gu claim: same specimen and a will contest (2026-11-14)

Slice: RWT22 (MR44), RWT19, RWT17 (via the contest), room for RWT34's imprint. Proposals under AD32 and AD56; every number is a dial with a reason in `src/gu_will_contest.js`.

## What changed
- **Same individual (RWT22).** `gu_refinement.js` takes `recipe.claim`: a wild Gu of the recipe's kind and rank is claimed in place. Id, traits and provenance stay; `wild` ends, `provenance.claim` and `imprint {by, strength, at}` are added. The find is in its provenance (`found: 'wolf-tide patrol'`). A failure effect `wary` was added next to destroy and injure.
- **Will contest (RWT19, RWT16).** New leaf `src/gu_will_contest.js` is a kernel law (`gu.will`): `wear_will` publishes KW15 costs and odds and a miss that stops the working with `slipped-hold`; the kernel's draw port rolls it. Gu will: rank, kind temperament, hunger, injury, wariness, another's imprint. Refiner will: rank, realm, steadiness. Cost = ceiling × Gu/refiner, capped at the reserved ceiling (20, or 8 cowed); odds = 700 + 50 × (refiner − Gu) permille, clamped 100 to 950, +200 cowed.
- **Failure is reachable (RWT4, RWT17).** A slipped hold returns the wild Gu to his hand (item +1), adds one to `book.ri.lead.wild_refinement.wary` (the next try's draw key and will change), spends the poured essence, and shows "The wild Gu slipped your hold." The command still reserves the ceiling; the unused part returns as an energy recover.
- The found Gu's hunger (0 to 3) and hurt state are drawn once per find from the seed and ordinal.

## Named gaps
- Refiner realm and steadiness are authored defaults (`RI_WILD_REFINER`, steadiness 2) until a stat owner supplies them.
- No imprint lifting or theft (RWT44/RWT45); the engine only sets the field and `guWill` reads another's imprint.
- No quote line on the row yet (`quoteWillContest` exists, unwired); the row shows the ceiling.
- The item economy keeps wild Gu as an item count; identity continuity is in the engine specimen and is not carried across a slip (wariness is a fact).

## Receipts
- `node --test tests/ri_wild_gu.test.js`: 12 pass (seeded: starving or hurt costs less; rank-two Gu beats a rank-one refiner; slip occurs, Gu stays wild and warier; pack slip through the real command with save and reload).
- `npm run build`, `check:arch`, `check:rules`: pass (one pre-existing stale glob warning).
- Headless play: the pack tests boot the `ri-fang-yuan-wild-gu` fixture from a fresh origin, run both outcomes, save and reload mid-refine. Not separately exercised: a screenshot at 1920x1080 and a second-origin import.
