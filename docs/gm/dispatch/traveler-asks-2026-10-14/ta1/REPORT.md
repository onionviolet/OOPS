# TA1 Village traveler asks v2

Delivered on `proc/ta1-village-asks` in the isolated worktree, baseline `91ec169e`. This follows [PLAN Amendment 1](../PLAN.md#amendment-1-2026-10-14-asks-can-be-out-of-reach): a mix of ready, stretch and unknown asks, with real routes and higher fees for difficulty/discovery. The initial fresh-player-only filter is superseded. Fiction, weights and balance remain proposals for Weibao to judge. Root merges; no push or merge performed here.

A1. Create a Village hero, talk to the elder, then open Notebook > People > Begin Village encounters. In Reports, open Village travelers > Welcome road travelers. Open a traveler and Meet traveler. New enrollments use revision 2; two travelers are present now and a third arrives after one played day.

A2. Choose Begin remembered requests > Ask about a supply need > Take request. Buy the requested ordinary goods through Visit a merchant, or learn gathering/crafting and bring the requested quantity. Deliver releases the fee already reserved from the traveler's purse. Read Story so far beside the request. Decline returns the reserved coins without player cost. No deadline, absence penalty, reroll on reload or forced delivery.

A3. The request shows current supply reach. An unknown ask gives only its generic fiction clue. Once a source is taught, seen or encountered, it can name that source. Supply reach can improve with knowledge, tools, owned stock or funds, while the agreed fee stays frozen. An exhausted known market offer is stretch until stock returns. A known rat-part route still requires a hunting trip unless you own the item.

## Ask palette for judgment

12 entries, tagged by role/use, with quantities 1-3. Entries reference item IDs and reserve `grade:null`; future grade data/matching must join HV1's actual contract. No graded requirement is offered today. Optional season/weather filters exist, but these opening entries are usable in every season. Before being told about the market, market-only goods are unknown. The bands below assume the opening 102-coin purse and a seen market; gathering/crafting have not yet been taught. Actual stock, prior supplies and learning can change them.

Fees are integer wood coins. Each range corresponds to the entry's quantity range. Ready/stretch/unknown columns show all difficulty quotes for judgment, not three choices on the same saved request.

| Entry / role | Item / quantity | Typical opening reach after seeing market | Fee ready / stretch / unknown | Fiction |
|---|---|---|---|---|
| mender.meal (road_mender) | Stale bread, 1-3 | ready | 102-302 / 125-365 / 150-430 | I need bread for the walk between repairs. |
| mender.needle_heat (road_mender) | Coal, 1-3 | ready | 37-107 / 47-131 / 59-157 | A little coal will heat my needles straight at the next hearth. |
| mender.oil_vial (road_mender) | Glass phial, 1-2 | ready | 52-102 / 65-125 / 80-150 | I need small phials to keep needle oil out of my sewing bag. |
| mender.patch (road_mender) | Rat pelt, 1-1 | unknown until taught or encountered | 96 / 118 / 142 | A rat pelt would patch the worn lining of my tool roll. |
| river.meal (river_walker) | Stale bread, 1-3 | ready | 102-302 / 125-365 / 150-430 | Bread travels better than a meal that spills in the boat. |
| river.line (river_walker) | Survey rope, 1-1 | ready | 22 / 29 / 38 | I need a light line to keep my pack tied beside the boat. |
| river.bottle (river_walker) | Glass bottle, 1-1 | ready | 102 / 125 / 150 | I need a bottle for drinking water along the river. |
| river.firewood (river_walker) | Rough wood log, 1-2 | unknown until taught or encountered | 40-77 / 50-95 / 63-115 | A log or two would spare me searching for fuel at the next stop. |
| courier.meal (hill_carrier) | Stale bread, 1-3 | ready | 102-302 / 125-365 / 150-430 | I need bread for the climb with these letters. |
| courier.tie (hill_carrier) | Survey rope, 1-1 | ready | 22 / 29 / 38 | A light line will hold my parcel stack when the hill wind rises. |
| courier.splints (hill_carrier) | Processed rough wood, 1-3 | unknown until taught or encountered | 45-130 / 56-158 / 70-189 | Small prepared pieces of wood will brace a fragile parcel. |
| courier.firewood (hill_carrier) | Rough wood log, 1-2 | unknown until taught or encountered | 40-77 / 50-95 / 63-115 | The hill shelter needs a little firewood before I stop there. |

D1. Among bands present in a template pool, draw preference is ready:stretch:unknown = 7:2:1. Choose an authored entry, then a quantity within that band. The 1000-draw SOURCE test confirms a ready majority and nonzero harder bands when those routes are known. No route is invented to keep a band present.

D2. Base compensation chooses the cheapest reliable trader replacement quote or estimated gathering/hunting/crafting effort at 0.5 coins per minute. Starting supplies keep their replacement value. Fee = base + ceil(base × 25/50/75%) + 2/5/10 coins for ready/stretch/unknown. The actual chosen fee and basis are saved, and later live stock/economy changes do not reprice them. Higher counts require that many real items. Both direct help and remembered delivery conserve full quantities in native stock, person stock, receipt and recap.

F1. None of the three old asks lacks a world route. Their old 3-6 coin fees fail the new price/effort expectation: Stale bread's opening replacement price is 80; Rat tail drops at 4-8%, Rat pelt at 1-2%. Rat tail leaves the new palette because its fiction fit is weaker. Rat pelt remains a rare mender need with 96/118/142 quotes, rather than a default cheap errand.

F2. Effort is an estimate: opening gather period divided by chance, and an explicit three played minutes per rat kill divided by its real drop chance. Best known Rat tail estimate is 38 minutes, Rat pelt 150. One Rough wood log estimates 60 minutes at initial gathering skill; recipes include ingredient effort and success chance. This is neither a combat timing proof nor a universal progression solver. The index covers the live Village stock/gathers/starting recipes/inventory and rat-part routes used by this palette; unsupported dynamic recipes create no guessed routes.

D3. Compatibility is additive. Missing generationRevision means revision 1; old generation address/key, goals, 3-6 coin rewards, one-item requests and settlement remain unchanged. New native enrollment uses generationRevision:2, contract revision 2 and `world.people:village.generated_people@2@base.frontier`. The factory retains explicit legacy mode for old replay fixtures. No saved goal is rewritten. `needRevision` stays on the new goal/request for later renewal; this slice does not implement renewal cadence. Current ungraded delivery uses ordinary item keys; any future grade matching needs HV1 integration, not an assumed suffix or quality formula.

## Source and browser checks

| Code | Label | Evidence / result |
|---|---|---|
| V1 | SOURCE | Final `npm test`: **867/867**, zero failures/skips; final `npm run build`: PASS. Focused tests cover live routes/prices/rates, bands, fees, draw mix, revision compatibility, quantity conservation, missing stock, durable publication and corrupt imports. [CHECKS](CHECKS.json). |
| V2 | SOURCE | Existing story-spine lint: 15 cards, both request contracts, 12 asks, ready/stretch/unknown, **zero findings**. Negative cases reject no-world-route asks, invalid quantities/grades and out-of-band quotes. |
| V3 | SOURCE | Existing runner seed 43: 3600 played minutes, generation/request revision 2, same seed exact, six scheduler-budget continuations, eight calls. Tests also compare chunking and JSON reload, include resolved people/requests in the projection, and retain revision-1 mode. This runner uses explicit source fixture stock; it is not natural acquisition. |
| V4 | natural, final rebuilt candidate | Seed 2333918603: bought one Glass bottle for 80, delivered it for 102. Seed 3193988720: bought two Glass phials for 80 total, delivered both for 102. Both used ordinary native market buttons; no grants, clock changes or injected seeds. Actual item removal and purse delta, named recap, known market hint, pending Save/reload, completed Save/reload, native Export and literal-file Import to fresh second profiles match. [BROWSER_EVIDENCE](BROWSER_EVIDENCE.json). |
| V5 | seeded-native from naturally earned baseline | Before source changes, baseline code 91ec169e produced and exported a revision-1 request. Final candidate loaded that literal file unchanged, took and delivered one Stale bread, paid the original 6 coins, preserved the goal, and passed pending/completed reload and Export/literal Import. [Baseline metadata](REV1_BASELINE.json), [final evidence](BROWSER_EVIDENCE.json). |
| V7 | natural, unknown ask | Fresh seed 2640414281, before discovering the market: Survey rope asks for 38 coins with only its authored cord clue. The request names no hidden source. Accepted Save/reload matches; a missing-stock delivery refuses without changing inventory, player money or reserved fee. Both desktop clue screenshots and separate known-market hint screenshots inspected. [UNKNOWN_EVIDENCE](UNKNOWN_EVIDENCE.json). |
| V6 | rebuilt bytes / desktop | Each final natural journey compared served bundle bytes to the rebuilt worktree bundle. CHECKS verifies the source map contains the exact eight changed runtime module inputs. Browser SHA is recorded in both evidence files. 1366x768 and 1600x1000 screenshots show the existing independent Reports scroll surface, readable recap/fees and ordinary Village controls. No mobile claim. Zero page errors. |

Final candidate screenshots: `natural-1-*` for the bottle, `natural-2-*` for the two phials, and `rev1-*` for compatibility. Literal exports and profiles stay under `/private/tmp/ta-ta1-*`, with hero names beginning TEST FIXTURE TA TA1. No private user save was read or altered. Older `natural-7-*` images are from the earlier pre-stock-fix candidate and are excluded from the final commit/evidence.

The first browser attempt missed the Visit a merchant menu and never purchased. A later legacy comparison used a pre-Export snapshot whose population clock was one minute older than the literal file. The harness now compares the actual exported file. These failed assertions are not compatibility failures or acceptance evidence. During final review, live stock analysis was corrected so exhausted market stock is stretch and hunting needs a trip; the final suite/build/browser proofs all use that correction.

## Files and remaining boundaries

I1. New runtime modules: `src/village_obtainability.js`, `src/village_traveler_asks.js`, `src/traveler_source_hint.js`. SOURCE-only live declaration reader: `scripts/village_supply_tables.mjs`. The reader evaluates bounded literal declarations with inert constructors, without importing the native DOM graph or running owner gameplay functions. Native enrollment reads the real native tables instead.

I2. Shared runtime edits: `src/generated_people.js`, `src/generated_people_ui.js`, `src/story_requests.js`, `src/lore_history_view.js`, and the small read/publication bridge in `src/main.js`. Extended existing lint/runner and helper fixtures; focused tests are in `tests/`. Trader stock, items, enemies, gather rules and recipes are read, not edited. No source-library or sealed-secret changes. Built dist/index files stay uncommitted.

I3. Required technical delivery gates pass. Human fiction/balance/layout acceptance remains open. Gather/craft/hunt delivery variants, later absence/return and post-merge HV1 grades are not claimed as native proof. Renewal, mixtures, services, other worlds and mobile remain deferred as specified by PLAN. [BACKLOG](BACKLOG.md) owns those limits.

TA1 is ready for root integration and Weibao's play judgment.
