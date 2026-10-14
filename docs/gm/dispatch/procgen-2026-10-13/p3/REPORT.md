# P3 Village storylet deck

Final verification completed 2026-10-14 EDT, continuing the 2026-10-13 dispatch. Authorized slice on `proc/p3-storylets`, isolated worktree `proc-p3-storylets`, served on `http://127.0.0.1:19330/`. Scope follows COMMON.md, PLAN.md and P3.md. Desktop target: 1366×768, with 1600×1000 also exercised. Mobile deferred. No main-checkout writes, push, merge, private save access or raw source-library changes.

## Play route and result

**F1.** Speak to the Village elder, close the conversation, open the Notebook, select People, then choose **Begin Village encounters**. This atomically enrolls local services if needed, introduces the original neighbor Sela and starts four competing decks. Remain in Village while ordinary idle time passes. The dedicated Village encounters panel and the existing event feed show offers and decisions; ambient cards appear as news. Responses use existing transactional effects and native inventory, money and skill adapters. Busy native activities continue, although responses require finishing them first.

**F2.** Fourteen of E2's twenty cards are registered and reachable through requirements. Each has a consequence, rather than a text-only line. Fixed original local contact Sela is a bounded single-target bridge. There is no claim that P4 generated-person casting is integrated. Traveling teacher and peddler text does not create simulated traveling actors.

| E2 | Card | Mode | Consequence and/or prerequisite |
|---|---|---|---|
| C01 | cow_on_the_road | ambient | +1 native coin and Sela trust |
| C02 | roof_promise | ambient | Sela roof_neglect accumulates; three observations enable C07 |
| C03 | shower_bench | offer | Actual workbench wet/dry state; optional coin for craftsman respect |
| C04 | rats_nearly_ate_cat | offer | Enables C14; purchased trap enables its alternate response |
| C05 | stray_dog | offer | Real Stale bread cost grants dog flag, enabling C15's dog response |
| C06 | debt_collector_visits | decision | Needs Sela debt ≥20; optional real payment reduces debt; standing beside her grants trust |
| C07 | roof_gives_way | offer | Real wood or coin for trust; repair suppresses future roof cards; explicitly suggested borrowing enables C06 |
| C08 | fence_feud | offer | Mediation grants 8 native Perception XP and trust |
| C10 | child_has_fever | decision | Paid healer or free messenger grants treatment and trust; explicit refusal enables C16 |
| C11 | teacher_passes_through | offer | Real paid/free 30/15 Perception XP lesson |
| C12 | peddler_with_rope | offer | Three real coins buy a real Survey rope; ownership suppresses card |
| C14 | rats_in_the_granary | offer | +2 native coins and 12 Pest killing XP; trap supplies an alternate answer |
| C15 | scouts_on_forest_road | decision | Patrol warning grants 10 Perception XP and prevents repeat scouting; dog alternative needs C05 |
| C16 | fever_spreads | offer | Explicit C10 refusal enables notices; carrying them grants trust and +1 coin, records containment |

## Draws, urgency, time and compatibility

**D1.** Cards compete in sorted ID order in each deck, alongside a quiet slot. Hard requirements, duplicate-open suppression, authored once records and self cooldowns filter candidates first. Conditional weight additions, seen decay, family repetition damping and family pity then adjust weights. One xorshift32 draw chooses a single card or quiet outcome. The stream is derived with the existing `deriveSimulationSeed(simulation.seed, 'deck:'+id)`; P1 integration is deferred to root. Candidate previews never roll. Cooldowns, consumed RNG, next due times, counts and the last twenty receipts per deck are saved in `simulation.decks`, with optional `storyletSchema:1`. Events freeze their response/effect arrays and their draw receipt through the existing `occur()` path.

| Deck | Played-minute interval | Quiet weight | Cooldowns |
|---|---:|---:|---|
| village.daily | 12 | 3 | 48–120, or authored once |
| village.people | 18 | 4 | 120–480 |
| village.chances | 30 | 4 | 120–240 |
| village.threats | 36 | 6 | 120–360, or authored once |

These are explicit, reversible pace adaptations from E2's day-scale proposal, chosen to produce an observable idle slice. Every nonambient card lasts 90 played minutes. At most three open cards per deck defer further draws without consuming RNG. This is presentation pacing, not an anti-abuse cap on reward repetitions. Authored once cards preserve E2's specific once-per-life occurrences. No generic one-time reward restriction was added.

**D2.** E2's V4 is still true for existing decisions. For this slice only, a drawn decision stores `nonBlocking:true`, retains its decision mode/urgency in the UI, and follows the existing offer-like expiry path. Waiting-choice checks exclude that flag; expiry boundaries include it. No activity/place interruption policy or automatic paid choice was introduced. At timeout the frozen safe `onExpire` effects run, with no player coin/item/stamina deduction, health damage or hunger death. Fever and debt escalation require explicit responses. The fallback metadata names free answers, but this slice executes safe expiry effects rather than the proposed autonomy scorer or paid fallback ladder. Existing unrelated decisions retain their global pause and indefinite seen-choice behavior.

**D3.** No new offline behavior exists. The native update timer advances played minutes; joined time uses the existing scheduler. Closing the browser leaves cards, expiry and deck streams unchanged. Returning does not use elapsed wall time to roll retroactive cards. Longer played advances process due boundaries in causal order under the existing 512-boundary budget; `main.js` drains that existing budget when appropriate. Decks draw only while the living player is in base.frontier Village. Time elsewhere advances their due schedule without consuming a deck draw; existing offers can close safely during played time elsewhere. No per-advance eight-tick cap from the draft was added, because the existing common scheduler already owns catch-up and its bounded continuation.

Old saves without the opt-in remain unchanged: no decks, retroactive enrollment, neighbor or past events. Starting begins at the current clock. New fields are additive and explicitly validated at Save-envelope load/import and runtime admission. Malformed RNG/cooldown/schema data rejects before import writes. The legacy `village.shower` definition remains registered for saved occurrences; opt-in removes its independent future check, making new shower draws deck-owned. Older builds lacking these definitions are not a supported loader for new storylet saves.

## E2 fact reconciliation before implementation

**F3.** Source was read before edits. Most V1–V18 behavioral descriptions remain useful, but their 2026-10-09 line numbers have drifted substantially. Important limits:

- V1/V2/V3/V4/V5: event modes, frozen responses, seen-decision global pause and independent automatic checks remain as described. The new deck is a separate scheduler hook; only its flagged decisions change waiting/expiry policy.
- V6/V7/V8/V9/V10/V11/V12: scheduled checks, selectors, set-only facts, additive resources, single-target relationships and cause receipts still govern implementation. **V7's unknown-fact limit also applies to negation:** `not(missing == true)` does not pass. Local `storyletFacts` supplies explicit false defaults for its own absent flags and zero for absent Survey rope; global rules are unchanged. Target resource facts are supported; arbitrary target actor facts are not exposed as the sketches imply, so roof repair uses an explicit player storylet fact.
- V13: existing feed projects player-discovered occurrences and caps news at eight. It now routes storylet leads to their own panel, avoiding hidden workshop controls.
- V14/V15: existing played calendar and native timer remain authoritative. Seasonal/hour-slot features and a new offline model are not part of this slice.
- V16/V17/V18: native/yearly NPC records are not automatically castable simulation actors. The real Survey rope, Rough wood log and Stale bread keys are used. The existing shower is preserved for compatibility while future opted-in draws move to the deck.

## Evidence

**A1. SOURCE PASS:** `npm test`: **629/629**, including seven deck/content/persistence tests and one UI test. The new tests cover deterministic same-seed draws and varying seeds, one competing draw per tick, preview purity, requirements, cooldown/once/duplicate suppression, real transactional free responses for all nonambient cards, unchanged ordinary decision pausing, opt-out compatibility, exact restore continuation and encoded import corruption rejection before writes. They are controlled source proof, not native gameplay proof for every card's paid branch. `npm run build` passes. Generated `dist/` and `index.html` are intentionally excluded from the commit.

**A2. NATURAL PASS:** Chrome, fresh isolated profile, ordinary creation/elder/begin controls, default native timers, no fabricated advancement. The named disposable hero is `TEST FIXTURE PROCGEN P3 NATURAL`. See [browser-initial.json](browser-initial.json) for the observed played-clock interval and distinct card IDs, and [natural-1366.png](natural-1366.png) for the live laptop notebook. The final fresh run accrued four distinct offer/decision cards from clock 0 to 46. An unmodified restore of that earned disposable save then reached clock 48, naturally drawing the ambient cow card and adding one coin. [browser-natural-resume.json](browser-natural-resume.json) and [natural-resumed-1366.png](natural-resumed-1366.png) own that continuation. Together they exercise all three modes without stopping idle play. The harness compares the served bundle SHA-256 to this worktree's rebuilt bytes. No page errors.

**A3. SEEDED_NATIVE PASS:** [browser-persistence.json](browser-persistence.json) and [browser-persistence.cjs](browser-persistence.cjs). Generated fixture uses real creation/enrollment/commit/draw code and the disposable native save envelope; hero is `TEST FIXTURE PROCGEN P3 PERSISTENCE`. Browser controls observe pending cards, Save/reload exactly preserve deck state and responses, two separate restored branches reach the identical deck/event state through normal native timers at clock 54, and a fever decision's free messenger answer sets treatment and resolves the card. Actual Export download is saved under `/private/tmp`, then selected by literal path in the native Import file input. Deck state, RNG, receipts, pending responses and the completed answer compare exactly after import. No page errors. [pending-1366.png](pending-1366.png), [pending-1600.png](pending-1600.png), [imported-1600.png](imported-1600.png) establish both desktop surfaces. Browser profiles and save payloads are not committed.

An initial harness used Playwright's mocked clock. Even a one-second probe timer failed to fire after reload, so it could not prove next-draw progression. Those attempts are not counted as passing timer evidence. The final harness uses ordinary native timers and contains no mocked clock or direct clock-start invocation.

## Files and remaining gates

Owned runtime files: `src/storylet_content.js`, `src/storylet_deck.js`, `src/storylet_ui.js`, and card-family registration in `src/simulation_content.js`. Tests: `tests/storylet_deck.test.js`, `tests/storylet_ui.test.js`.

Shared edits, to help root merge:

| File | Exact purpose |
|---|---|
| src/simulation.js | Initialize/validate opted-in decks after command commit; deck boundary/draw hook; freeze storylet metadata in occur; exclude flagged decisions from waiting and include them in expiry |
| src/main.js | Import/create/render the panel; atomic elder-gated begin branch; feed focus mapping; work-ledger waiting text excludes flagged decisions |
| src/save_files.js | Optional deck-state envelope validator on native load and import |
| src/adventure_notebook.js | People-tab registration; nonblocking decisions do not force notebook attention |
| src/event_feed.js | Storylet lead routes to the visible panel in Village |
| src/simulation_ui.js | Avoid duplicate storylet responses/false pause text in workshop panel |
| docs/emergent/E2_STORYLETS.md | Dated status link; preserves the earlier draft as proposal/history |

Root merges and unifies P1 streams/P4 casting. Human pacing/fiction/layout acceptance is open. Six unselected E2 cards, full casting, seasons, storyteller gates, autonomy and other-world content remain deferred. Native paid/item/XP branches beyond the tested decision and observed ambient reward remain **IMPLEMENTED_UNVERIFIED**, listed in [BACKLOG.md](BACKLOG.md). No whole-E2 completion is claimed.
