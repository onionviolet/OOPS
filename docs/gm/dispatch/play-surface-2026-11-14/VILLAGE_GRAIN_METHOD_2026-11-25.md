# Village grain-cart method receipt, 2026-11-25

| Preflight | Scope |
| --- | --- |
| Reading and authority | Authorized parallel backlog slice: connect an existing ordinary produced item to an existing person's practical problem, preserving the starting world's native mechanics. [Campaign preservation](../../../worlds/original-frontier/CAMPAIGN.md) keeps the mill's missing grain delivery and native rewards intact; [engine owner](../../../ENGINE_EXPANSION.md) owns meaningful ordinary production/application links. |
| Player sentence | Bring two owned apples and spend thirty minutes leading the grazing delivery horse to the mill. Default two apples and thirty minutes, adjustable costs for a slower supplied alternative to Animal handling 8's ten-minute route. Existing voice sample: “You should let that mischievous duo know that the task is done.” |
| Mechanism and fit | Apples already come from Town farms orchard harvesting through Farming and serve food/cooking. Native `GameAction`, inventory conditions/removal, mill receipt, quest and training unlocks remain authoritative. No new quest, currency, scheduler or reward framework. |
| Coverage check | Crossing, Short Measure, field observations and frames already have ordinary/item/skill alternatives. The found native grain cart has strength, Animal handling and extreme Weightlifting routes, but no food-supply method. Carrot was rejected because Apple is the actual current orchard output. |
| Ring and compatibility | Content, native consumer, failure, load compatibility and UI. New action uses existing availability/progress save fields; additive migration offers it to existing unsolved carts, keeps delivered carts closed and preserves explicit flags. No new save schema. |
| Screen | Headless Chrome 1920×1080, named progressed native Village/mill checkpoint for setup, then actual actions and literal save persistence. Fresh-life combat earning, mobile and generic action refactors are deferred. |
| Files and rules | Village grain leaf; scoped `src/data/locations.js` action/unlock/lock hunks; narrow `src/save_migration.js` import/call; focused tests and browser proof. AR2–AR7, SR1–SR24, PRS4/PRS7, AD36/AD43. Shared main untouched. |
| Failure and checks | Missing apples must refuse without time/reward/item loss; interruption retains apples and no receipt; success consumes exactly two, delivers once, and shares the native downstream mill receipt. Test old open/closed/missing/explicit flags and idempotence, plus browser success and persistence. |

## Verification receipt

F1: The native grain-cart menu now offers “Lead the grain horse with 2 apples · 30 min.” The existing strength, Animal handling and extreme Weightlifting methods retain their meanings. The new route spends the supplied food and time; it teaches 30 native Animal handling XP through the actual delivery. It does not issue a separate quest payout.

F2: Real orchard production fed the new consumer. From the named farm/mill fixture, native harvesting produced two apples. The player travelled through Town outskirts and Forest road to Village, stopped after five minutes without losing food or receiving delivery credit, saved/reloaded the retained partial work, and completed the cart at thirty committed minutes. A check at twenty-nine minutes still found the cart undelivered.

F3: The millers' existing conversation then finished their quest: purse 104 → 604, the existing 250 character XP and native balancing/weightlifting access. Literal Export/Import retained zero apples, the finished quest, its claimed reward and closed alternative delivery methods. No duplicate payout was issued by import.

| Line | Evidence, result and gaps |
| --- | --- |
| FLR1 Build | `BUILD_OUT=.lane-builds/village-grain-20261125 npm run build`: passed; bundle SHA-256 `51c575c4509b87c32368190378104d43bb054eea3652de9ce7aadf729ba176dc`. Existing duplicate `deeds` and `dial` build warnings remain unrelated. |
| FLR2 Route | `node tests/village_grain_browser.mjs`: passed, exit 0, headless Chrome 1920×1080. Composed native mill-cart/orchard checkpoint from `tests/fixtures/perf/mid.json`; first two mill tasks, cart discovery, native farm access and Farming 7 are setup. Apples and Animal handling are not gifted. Original combat/access earning is not covered. |
| FLR3 Shown | Inspected [costed offers](../../../representations/evidence/village-grain-2026-11-25/village-grain-offers.png), [delivered cart](../../../representations/evidence/village-grain-2026-11-25/village-grain-delivered.png), and [native mill receipt](../../../representations/evidence/village-grain-2026-11-25/village-grain-mill-receipt.png). Missing food refuses without delivery. |
| FLR4 Used | Native orchard Apple → native inventory condition/removal → actual cart delivery → existing millers' dialogue, quest reward and training unlocks. All delivery alternatives close after success. |
| FLR5 Kept | Actual Stop, partial-progress Save/reload and literal Export/Import passed. Modern and legacy missing-choice migration, delivered closure, absent discovery, explicit flags and idempotence pass focused tests. No new saved schema. |
| FLR6 Labelled | Agent-verified, not human-reviewed. [Browser result](../../../representations/evidence/village-grain-2026-11-25/result.json) records fixture/build hashes, exact counts, elapsed commitment and no page errors. No release or whole-campaign completion claim. |
| Focused tests | `node --test tests/village_grain_cart.test.js tests/v06_migration.test.js tests/reward_keys.test.js`: 9/9 passed. Includes native start/settlement food conditions, branch closure, existing receipt parity, compatible input preservation and bad-import protection. |
| Architecture | `npm run check:arch`: passed; main growth 0, existing 205 cyclic edges. Two new imports reach the pure Village leaf; no new cycle or registration. |
| Rules | `npm run check:rules`: passed, with existing warning-only lint deltas and absent optional `private_packs/**` glob. |
| Scope | No shared main, quest, dialogue, item, farming or native action framework change. The unrelated native start-condition removal path was not changed or behavior-verified; this route uses the existing supported success-condition removal owner. |
| Cleanup | Browser and server closed normally. No raw save/export artifact retained: Export/Import used an in-memory file buffer. Isolated build retained for this cited proof. Earlier browser retries corrected test selectors for current native groups and conversation controls, without runtime changes. Superseded [selector failure image](../../../representations/evidence/village-grain-2026-11-25/failed.png) and [text](../../../representations/evidence/village-grain-2026-11-25/failure.txt) remain because automatic approval review rejected their exact scoped deletion as “blocked by policy.” No alternate deletion route was attempted. |

```receipt
build: 51c575c4509b87c32368190378104d43bb054eea3652de9ce7aadf729ba176dc
route: fixture(native-mill-cart-orchard)
state: browser-verified
viewport: 1920x1080
persistence: checked
tests: 9 focused tests, build, architecture, rules and rebuilt native browser
review: none
surface: native Village grain cart and existing millers' quest receipt
```
