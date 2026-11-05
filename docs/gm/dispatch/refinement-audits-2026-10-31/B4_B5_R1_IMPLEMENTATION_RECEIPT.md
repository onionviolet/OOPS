# B4, B5, R1 implementation receipt: divination energy cost and method gate, 2026-11-03

Status: implemented, below floor (focused-tested, built; no native browser run). Rules: AR1-AR16, AD36, AD43, AD38, AD49. Numbers and the method list are proposals (WPR5).

## Seam and consumers
- B4 seam: the two cast adapters' cost whitelists (`src/cast_divination_adapter.js`, `src/cast_ability_adapter.js`). An `energy` cost with `operation:'use'` and an `energyId` is now legal; the engine already refuses an empty pool or a strained method. Content passes `beSeerUse()` (B1) as a step cost. Cost line: `quoteDivinations` prices the use from the held pool's own policy: "1 Spirituality; 1 strain (pool 3 of 3)". Ability moves keep the cost as stated (not "unknown"). Consumer: ch43 P063 dowsing step; ch46 P073 repeated failure drains it (strain, then refusal).
- B5/R1 seam: new `src/book_world_lotm_divination_method.js` (B1 pattern) plus one additive call in `book_world_lotm_div_supply.js`. Two facts per method: `actor.lotm.div.method.<m>.learned` (lesson taken, knowledge `book.lotm.div.method.<m>`) and `.real` (learned and the BE Seer source supported). Builders `beDivMethodLearnEffects(m,value,situationId)`, `beDivMethodRequires(m,{real})`. Methods: pendulum, dowsing, scrying, astrolabe, mirror, chart, tarot, numerology, dream-divination.
- R1: the existing `need:'method'` means (chart, tarot, numerology, dream) now read true for the BE seat when `.real`, so ch55 P001 rows unlock without the Tingen power. Consumers: ch54 P041 pendulum staging (`requires .learned` for a show, `.real` for a working reading), ch55 P001, ch57 P003 (divination rows; potion acting is not built here).
- Default/dial/reason: the potion alone teaches no method; a lesson alone makes only theatre; any act may grant the lesson; a row picks `.learned` or `.real`. Cast validator not widened; no save change.

## Failure scenarios covered
Empty pool or strain limit refuses (preview ineligible, commit throws); a non-use or pool-less energy cost is refused at authoring; a pendulum row without the lesson, or with the lesson but no potion, does not run; the potion without the lesson does not run; one lesson opens one method.

## Checks
- `node --test` on lotm_be_seat (3 new cases: B5, R1, B4), lotm_divination_supply, cast_divination_adapter, cast_ability_adapter, lotm_divination_rows, lotm_abilities, lotm_seer_slice, lotm_primary_compat: 60 pass, 0 fail (an earlier concurrent run showed 2 failures; the rerun alone was clean, cause not isolated).
- `npm run build`: ok, dist restored, not committed.
- `npm run check:arch`: pass (main.js -5).
- `npm run check:rules`: FAIL, 1 problem not from this change: "register says WA1-WA53, highest in docs/WORLD_ABSORPTION_RULES.md is WA68" (docs this branch does not touch).
- `npm test` full suite: not run.

## Gaps
- Native run not done: the private proof bundles and cast pack are not in this worktree, and no pack row carries a divination with an energy cost yet. First content row (ch43 P063) should run the headless T4 runner and check the cost line at 1920x1080.
- Knowledge basis needs an active situation: pass the cast situation (`LOTM_CAST_SITUATION`) as `situationId`.
- Facts for new methods need adding to `BE_DIV_METHODS` (a throw says so).


## Later evidence qualification B98, 2026-11-04

The original below-floor/no-native receipt is followed by KJ3AA’s first selected native use: ordered method lesson/readiness and one paid dream-divination energy cost on its named bundle. This does not prove continuous drain, every listed method, failed order, all observers or potion acting. R1 acting remains separate. The old rules-index failure is a dated failure; current B92 rules checks pass without certifying the runtime candidate. The active M22 writer owns further method/session changes. See [KJ3AA](KJ3AA_IMPLEMENTATION_RECEIPT.md) for the later candidate and explicit limits.
