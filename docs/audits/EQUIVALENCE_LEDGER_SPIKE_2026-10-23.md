# Equivalence Ledger spike (2026-10-23)

Weibao said ProjectE's EMC could be a cheat. [WV2 Part A](../research/minecraft/audits/WV2_ECONOMY_TIERS.md)
(ET1 to ET5, ET21 to ET24) read the algorithm and the seed table but never computed final values. This
spike runs the algorithm on this game's recipes, designs the cheat as library card 13, and plans a build.
Research, proposal and spike only. No game code was edited. Nothing here is accepted direction; the card
is a proposal in [CHEAT_LIBRARY](../CHEAT_LIBRARY.md#13-equivalence-ledger-derived-price-and-exchange-proposal-2026-10-23).

Labels: **verified** = ran or read in this session; **inferred** = my reasoning from verified facts.
Codes are EL (equivalence ledger). Rules applied: AD5, AD22, AD27, AD38, AD11, AD26, AD29, AD30; ECR1, ECR6,
ECR8, ECR12, ECR14, ECR15, ECR16, ECR17, ECR30 ([DOMAIN_RULES](../DOMAIN_RULES.md#economy-rules)); Rulebook 5
and 11 for cheats; AR1 to AR16 for runtime ([runtime-code](../../.claude/rules/runtime-code.md)); AD36 for tests.

## 1. Method

- **Route (verified).** The headless runner, `boot(null, {seed: 7})` in
  [scripts/headless/runner.mjs](../../scripts/headless/runner.mjs), boots the real game in Node and exposes
  `recipes` and `item_templates` through `game.internals`. No stub was needed. The boot includes
  expansion-registered recipes (for example the frontier fort recycling recipes), so the graph is the live one.
- **Scripts (verified, read-only, outside the repo).** `extract.mjs` dumps 864 item templates and 210 recipes to
  JSON; `derive.cjs` runs the solver. Copies, JSON results and this summary's inputs sit in the session notes
  folder `side-session-notes/local_ee5cf879-d3b0-42c5-839b-9da58b7cbd29/`. That folder is scratch, not a
  durable home; if the spike is accepted the derivation becomes the pure module in section 5.
- **Algorithm (verified against `SimpleGraphMapper#generateValues`).** Relaxation to a fixed point: a
  conversion's cost is `sum(ingredient value x count) / output count`; an output keeps the smaller of its
  stored and new value; a conversion with an unpriced ingredient yields nothing; pinned seeds are not
  overwritten. A `material_type` slot is a fake node priced at its cheapest member (ET1). The fuel slot of
  smelting is priced as `load / amount x item value` for the cheapest fuel at or above `minGrade`, using the
  `base.frontier` heat world in [heat_grades.js](../../src/heat_grades.js).
- **Components.** A component recipe lists one alternative per material (`result_id` per row); each row is its own
  conversion of 1 component from `count` of that material.
- **Not modelled (verified gaps).**
  - The 18 equipment recipes: equipment value comes from `getEquipmentValue` over components, not a recipe.
  - Quality: everything is priced at quality 100 with the matching rarity multiplier (`getBaseValue`).
  - [craft_recipes.js](../../src/craft_recipes.js) is the discovery grammar (role slots, `matchRecipe`,
    `generateRecipe`), not a table of priced recipes. I read only its header; it is not a graph input today and
    is a candidate for a later extension (a generated recipe could price its output the same way).
  - Three recipe outputs have no item template in the live boot: Bone short handle, Bone medium handle, Bone long
    handle. They derive 500, 1000 and 2000 but have no authored value to compare. This looks like a data gap or
    a component-generated item; I did not trace which (inferred).
  - Wool and Flax are both gathered and produced by the fort recycling recipes (their other ingredients have no
    authored value), so they are pinned as **fallback pins**; nothing else needed one.
  - Failure: `get_success_chance` runs 0.1 to 1 by recipe and skill; `execute_native_recipe` removes inputs for
    every attempt and scales output by success, so expected cost per item is cost divided by success (verified,
    `main.js` around line 5400).

## 2. Results

Ratio = authored `value` / derived value. Below 1: the output is authored cheaper than its inputs. Above 1:
authored dearer.

| Run | Pins | Items compared | Items with no value | Ratio p10 / median / p90 | Within 0.5x to 2x |
| --- | --- | --- | --- | --- | --- |
| **A. Small hand pin set** (24 anchors, section 2.1) | 24 (+2 fallback) | 130 of 205 | 76 conversions unreachable | 0.18 / 1.1 / 9.4 | 49 of 130 (38%) |
| B. Bound: every raw input pinned | 453 (+2 fallback) | 205 of 205 | 1 | 0.10 / 0.67 / 8.7 | 73 of 205 (36%) |
| C. B with floor division (ET2 style) | same | 205 | 1 | 0.10 / 0.67 / 9.1 | 71 of 205 |
| D. B at minimum success chance | same | 205 | 1 | 0.006 / 0.095 / 1.2 | n/a |
| E. A at minimum success chance | same as A | 130 | 76 | 0.01 / 0.19 / 2.8 | n/a |

All runs: 210 conversions, 209 distinct outputs, solver settles in 4 passes (verified).

**2.1 The pin set (verified; this is the primary run, chosen as ET4 describes).** Iron ore, Low quality iron
ore, Atratan ore, Coal, Rough wood log, Wood log, Ash wood log, Hickory wood log, Boar meat, Flour, Coccoon,
Rat pelt, Wolf pelt, Boar hide, Wolf fang, Weak monster bone, Monster bone, Toxin gland, Golmoon leaf, Belmart
leaf, Silica Sand, Gryphon feather. Coverage is 63% of produced items. The 76 unreachable conversions wait on
unpinned inputs (cooking herbs, turtle shellplate, willow wood, bear and alligator leather, tails and meats).
Pinning those ~25 more raws closes it. **EL1:** the number of anchors a world needs for full coverage is about
50 for this recipe set, not 24. My first attempt picked anchors by graph reach and left out Iron ore, which
silently unpriced the whole metal chain; the anchor list must be checked against coverage, not chosen by feel.

**2.2 Ratio distribution, bound run B.** Buckets of authored/derived: under 0.25: 36; 0.25 to 0.5: 42; 0.5 to
0.9: 39; 0.9 to 1.1: 12; 1.1 to 2: 20; 2 to 5: 26; over 5: 30. So 117 items are authored under their input
cost and 76 over; only 12 sit within 10% of derived. **EL2:** the authored table is not recipe-derived. It is
set by category, which is the same finding ET4 made about ProjectE's own seed table, except that ProjectE then
lets the graph price everything else and this game does not.

By family (median ratio, count): crafting 0.16 (20, trophies and cloth), butchering 0.25 (26), crafting components
0.46 (23), smelting 0.68 (7), cooking 0.78 (24), alchemy 1.0 (12), woodworking items 1.7 (11), forging components
2.0 (44), forging items 7.5 (11), woodworking components 9.2 (25).

- Highest authored over derived: Steel sickle 2000 vs 130 (15.4x), Iron sickle 1000 vs 67 (15x), Willow bark 25
  vs 1.7 (15x), the simple wooden handles 12x to 13.5x, Steel pickaxe 2000 vs 200.
- Lowest: Gryphon trophy 700 vs 31,750 (0.02x), High quality wolf fang 15 vs 600, Bandersnatch trophy 700 vs
  22,400, Sharp bear claw 80 vs 2500, Bufonite 130 vs 4000. These recipes turn dozens of common drops into one
  rare-looking item; a ledger that priced by the recipe would call them very dear.

**2.3 Profit loops.** ProjectE's exploit test is a conversion whose inputs cost less than the output's value (ET3).
Run B has 76 such rows (ratio over 1.1), concentrated in forging and woodworking components and tools.
**EL3 (verified):** none of them is a loop in ProjectE's sense. I ran a strongly-connected-components pass over the
whole conversion graph (fuel and `material_type` slots expanded to members) and found **no cycles at all**.
Value cannot be minted by repeating a recipe because no recipe chain returns to its start. Those 76 rows are
the one-way crafting margin ECR8 and ECR30 intend (make something, sell it dearer than its inputs). Taken at
minimum success chance (run D) 20 rows still exceed 2x and none exceed 5x: the margin is real only for skilled crafters.

**2.4 Trader check (verified reads, inferred conclusion).** A trader sells to you at `value x profit_margin`
(4, 6 and 7 for the three base traders in `data/traders.js`, reduced by Haggling and reputation) and buys at
`value x sell terms` (about 1 at neutral standing, `economy_standing.js`). The round trip through a trader loses
at least roughly 4x before saturation. So buying inputs from a trader and selling crafted output cannot beat the
margin even in the 30 rows over 5x; the exploitable path is gather, craft, sell, which is the intended loop.
`getValueOfMultiple` then applies saturation (caps 500 for goods, 200 for equipment and components, recovering
over time), which erodes repeated sales further.

**2.5 Rounding (verified).** `round_item_price` rounds **up**: ceil to 1 below 200, to 10 above 199, to 100
above 1999, to 1000 above 19,999. ProjectE floors (ET2). In a sale, rounding up favours the seller; splitting a
stack and selling in parts can gain by up to the rounding step. This is small beside the trader margin and
saturation but it is the opposite direction to ET2. In run C, flooring moves 48 of 205 derived values (largest
drop 8), mostly cheap goods. **EL4:** the ledger's own arithmetic must floor credits and ceil charges, or
splitting and recombining gains.

## 3. How this fits the economy rules

- **ECR6 and ECR14 (basket per world, value from recognition and usability):** the derived scale is a yardstick
  issued by one party, not the world's price. It is a designer's proposer and a cheat's tariff, not the market.
- **ECR8 (asymmetric by default):** without a fee the ledger is a shop that sells everything at fair price, with
  the trader's 4x to 7x margin gone. That is the failure mode ECR8 names. The default fee below restores it.
- **ECR12, ECR15, ECR16 (money is a currency with a source; one authority; exact units):** the ledger credit is
  a new currency. `src/economy_domain.js` is a purse-only seam (`setPurse`, `addPurse`, a 500-row debug
  ledger, no save slice); it cannot hold a second currency. The balance should live in the card's own state with
  its own rows, not extend that seam yet (section 5).
- **`src/market_saturation.js`:** authored `value` is the one input to saturation. The ledger should read the same
  `value` (so it agrees with traders' base), count deposits into the regional sold count (so a flood still
  depresses prices), and not draw down a stock (inferred; a design choice, easy to dial).
- **ECR17 (wealth is information):** a balance and a learned path are what a thief or a rival reads; the ledger's
  state is redacted in share summaries by the same redactor as IM16.
- **ECR30 and AD22 (no hardening, in-world pushback):** do not port ProjectE's silent zeroing (ET3). Where a
  loop exists the card reports it to the designer and any pushback comes from the issuer.

## 4. Card summary (full card in the library)

Default: a book or System page holds one credit; deposit at derived worth minus 25%, withdraw at derived worth
plus 25% (round trip about 60%); derived worth is the cheapest known recipe path from the world's anchors;
refuses goods with no path, recognition-valued goods and unlearned paths, each with an on-screen reason. Dials:
fee 0% to 90% per issuer; law strict, loose (house markup) or off; anchors per world; learned-only or all.
Reason: the issuer lives on the spread and the anchors say what the world finds common.

**Against Perfect crafting** (table row, [CHEAT_LIBRARY](../CHEAT_LIBRARY.md)): Perfect crafting changes success and
quality of making; the ledger removes no making, ignores skill and station, and is blind to quality. **Against the
equivalent-exchange note** ([CHEAT_COSMOLOGY](../CHEAT_COSMOLOGY.md#meetings-worth-testing)): that note is a world
law colliding with a 10,000x cheat. The ledger is the cheat that obeys the law, so the pair is a fit, and the fee
is the visible "payer".

**What it is good for in this data (inferred):** moving surplus between goods that share a scale (ore for ore,
pelt for pelt, wood for wood) at pin ratios, and pricing goods the player never sells to a trader. It is a poor
outlet for finished goods: depositing a Steel sickle credits about 130 while a merchant pays up to 2000, so
crafting-and-selling stays better than depositing, matching ECR8.

## 5. Implementation plan (not started)

**Target.** Desktop and laptop first (AGENTS.md, standing UI priority): the book panel at 1920x1080 in
rebuilt Chrome. Visible outcome: the panel lists held goods with derived worth, the reason line, and a
deposit/withdraw pair with the fee shown. Deferred: mobile layout, a shop-style full catalogue, anchor editing UI.

**Seam (AR1 to AR16, [runtime-code](../../.claude/rules/runtime-code.md)).**

1. `src/equivalence_ledger.js`, pure, no import of `main.js` or the engine. Exports `deriveEquivalence({recipes,
   items, anchors, fuels})` returning a map of `{id, worth, via, anchorIds}` plus a `report` (unpriced items,
   authored-over-derived rows, cycles). It is the section 1 algorithm over passed-in data; the data-dumping
   `extract.mjs` becomes a thin adapter inside the runtime registry. One authority per fact: recipe data stays in
   `crafting_recipes.js`, authored `value` stays in `items.js`.
2. A per-world anchor table (`ledger_anchors`, id to authored value, each with a reason string), kept as data
   next to the heat world so a world declares its own. Coverage check as a test (EL1).
3. The cheat itself rides on the existing cheat host work (IM12) and card shape (`cheat_cards.js`: `ui` is one of
   the closed PANELS set, so card 13 would either reuse `system-shop` or add one panel kind; adding a kind is a
   small schema decision, flagged for IM9's tolerant read first).
4. State (inside the existing `cheats` slice, AR namespaced slice): `balance` (non-negative safe integer, like
   `points`), `learned` (list of recipe ids), `rows` (a bounded deposit/withdraw log, like the money ledger's 500).
   **Derived worths are recomputed from data at boot and never saved**, so recipe or value rebalances need no
   migration. The decision (EL5): keep the balance as card state rather than extend `economy_domain.js`; revisit
   if a second non-coin currency appears (rule of two).
5. Deposit and withdraw go through a native transaction like `use_recipe` (`beginNativeCraftTransaction`) so a
   failed step rolls back items, balance and saturation count together. Any coin payout uses `addPurse` with a
   named source such as `cheat.equivalence_ledger` (ECR15). Wiring is one registration line in `main.js` paid for
   by moving a line out (AR net-zero rule).

**Persistence.** Adding `balance`/`learned`/`rows` to card state needs IM9 (tolerant read and quarantine) first.
The heir path currently drops `cheats` (IM1/IM7), so card 13 should not ship before IM7: a grant that vanishes at
the first heir is the failure that note names. Carry follows IM14 (default: balance and learned paths reset,
the stage that lets you hold the book carries; dial per world). Export redaction per IM16.

**Stages.**

- **S0 (small, no player verbs):** `deriveEquivalence` plus a designer report script and `tests/equivalence_ledger.test.js`.
  Gives every future world a price proposer and loop detector now, whether or not the cheat ships.
- **S1:** the card, state, deposit and withdraw for one world (`base.frontier`) with the 25% default.
- **S2:** learn-by-sample, anchor swap event, a second issuer with different anchors.

**Tests (AD36, lean).** Focused file only while editing; the committer runs `npm test` once.
1. Pure: derivation on a six-recipe fixture matches hand arithmetic (min over alternatives, group cheapest member,
   fuel slot, unreachable input yields no value).
2. Invariant: for every priced pair, deposit then withdraw returns less than the start at any fee including 0%
   (floor/ceil rounding), and a fixture with a cycle settles at the pin value.
3. Coverage: with the shipped anchor table every produced item in the live recipe set either has a value or is on a
   named allowlist (catches EL1 and the missing-template gap).
4. Browser (rebuilt, fresh origin, 1920x1080): deposit, reload, withdraw, import a save; persistence changes
   require save, reload and import per AGENTS.md. Anything not exercised is implemented-unverified.
Existing checks to reuse: `tests/craft_depth_rules.test.js`, `tests/crafting_runtime.test.js`, the headless runner,
plus `npm run check:arch`, `check:rules` (and `check:rule-behavior` if a rule row changes).

## 6. Findings and open items

- **EL1** anchors needed for full coverage: about 50, not 24; verify by coverage test.
- **EL2** authored prices are category-set, not recipe-derived: 117 of 205 under input cost, 76 over.
- **EL3** no cycles exist; no recipe loop mints value. The 76 over-input rows are the intended crafting margin.
- **EL4** `round_item_price` rounds up; ledger arithmetic must floor credits, ceil charges.
- **EL5** keep the balance in card state, do not extend the purse seam yet.
- **EL6** three bone handle outputs lack item templates (unverified whether generated elsewhere).
- **EL7** not done: equipment, quality, craft_recipes.js generated recipes, and a trader-with-saturation simulation
  of the margin claim (section 2.4 is reasoned from the code, not simulated).
- No `src/` edits, commits or pushes. Only `docs/CHEAT_LIBRARY.md` (card 13 hunk, 59 added lines, zero-loss
  check 0) and this file were written.

## 7. The one decision for Weibao

Build **S0 only** now (the pure derivation module, the designer report and one test, no player-facing cheat), and
leave the card as a proposal until IM7 and IM9 land? Default answer: yes; S0 gives a price proposer for every
world and costs nothing player-visible.
