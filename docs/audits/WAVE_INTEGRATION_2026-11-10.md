# Wave integration, 2026-11-10 (FRC67, FRC68)

The nine decompile-bank slices merged to master on 2026-11-10 were each proven alone. This pass played them together, checked
them against the [architecture rules](../ARCHITECTURE_RULES.md) and fixed the one cross-system defect it found in its owner.
Asked for by [coverage audit round 7](FOUNDATIONAL_RULES_COVERAGE_2026-11-10.md#round-7-2026-11-10-architecture-under-a-wide-build-wave).
Findings are proposals unless marked fixed. State: agent-verified, not human-reviewed.

Input: master at `ce3d6269f` plus this change. Bundle rebuilt from `src` by `scripts/playtest/lib.mjs` for every journey,
sha256/16 `97240c4f82332802` (before the WIN3 fix; the fix touches only the hearth shelf owner, re-proven by its test).
Evidence and scripts: [docs/gm/dispatch/wave-integration-2026-11-10/](../gm/dispatch/wave-integration-2026-11-10/).

## What one save can hold

No single life holds all nine slices: the systems sit in different worlds. Three lives were played in headless Chromium at
1920×1080, fresh origin per open, frozen wall clock, seed 7:

| Life | Slices in it | Route kind |
| --- | --- | --- |
| Frontier village | spoilage (hearth shelf), needs seam (meadow sheep), regional prices (both staple shelves), away bank | fixture coins and goods, then panel buttons ([frontier_ab.mjs](../gm/dispatch/wave-integration-2026-11-10/frontier_ab.mjs)) |
| LOTM Tingen | mood (Dunn's thoughts), storyteller (directed Tingen feed), item knowledge, away bank | private earned checkpoint (game MCP `lotm-kjw33`), then the panel's hand-in button ([lotm_ab.mjs](../gm/dispatch/wave-integration-2026-11-10/lotm_ab.mjs)) |
| HP lead | exams | `hp_exam_fixture.mjs` day 247, then revise buttons ([hp_kept.mjs](../gm/dispatch/wave-integration-2026-11-10/hp_kept.mjs)) |

The Gu keeper (needs seam's second caller) was not played: its host is owned by a running lane. Rule lints have no save
state; they ran through `npm run check:rules`.

## Findings

| Code | Finding | Evidence | Disposition |
| --- | --- | --- | --- |
| WIN1 | **TMR4 holds on the Frontier life.** From one save, 1,500 played minutes and 1,500 banked minutes spent through the away bank (first hour by the visible `#away_bank_spend` button) end on the same clock (1521) with byte-equal saves on every key except `awayBank`. Larder words ("2 Cooked potato stored, spoiled"), the sheep's care line ("needs hay") and the village keeper's price notes match word for word. | [frontier-journey.txt](../gm/dispatch/wave-integration-2026-11-10/evidence/frontier-journey.txt): "differing save keys (A vs B, bank excluded): []" | Pass |
| WIN2 | **TMR4 on the LOTM life.** Handing in the weekly application left Dunn's dated thought (a lapse, -8, five days, because the checkpoint had missed weeks). Then path A played 12 hours (two director windows; three days timed out under load 50) and path B spent 12 banked hours with no stop. Same clock (28932), same Dunn rows, same Events rows with why-lines; whole saves equal once keys are sorted. Raw key order differs in `locations` and `availabilities` because an optional pack place and the LOTM cast places register in a different order. Reload is exact; literal Import differs only by the export reward (`last_rewarded_export`, Spark of Inspiration). | [lotm-journey.txt](../gm/dispatch/wave-integration-2026-11-10/evidence/lotm-journey.txt) | Pass. Note: a raw-JSON save comparison needs sorted keys |
| WIN3 | **Defect, fixed: the hearth shelf asked the spoilage owner the wrong question.** `owned_place_clock.js` used `lifeOf` as its "is this a shelf good" test and assumed `readSpoilage` never returns null. (a) A larder row whose good has no shelf life (a dial changed under a save; the validator allows it) threw `Cannot read properties of null (reading 'spent')` on every panel render and on take. (b) The running storyteller-gu branch adds shared-lot perishables to `spoilage.js` with `result: null`; with the old test the hearth would take a Gu petal lot, and a spoiled take would mint an item `{"id":null}`. | New test in `tests/owned_place_clock.test.js` fails on the pre-fix file with that TypeError and passes after | Fixed in the shelf owner: shelf goods are `PERISHABLES` members only; a row with no shelf life reads "keeping by no clock here" and comes back as itself. No change to `spoilage.js` (owned by a running lane) |
| WIN4 | **Spoiled food does not feed anything, by design, and nothing uses it yet.** It is a Material tagged `compost`. No diet key matches it, and the needs seam's `human` body has no caller, so no human eating reads the seam at all. The one real crossing works: rot taken off the shelf sold to the village keeper for 1 coin and sits on his shelf. The `compost` tag has no reader, and the description promises farmers and tanners. | frontier log: "rot carried after take: 1", "sold rot: {coins:1, onShelf:1}"; `grep compost src` | ACCOUNT FOR NOW: a compost or tanning use is the FLR4 consumer when a farm or tannery slice lands |
| WIN5 | **Spoilage and regional prices never meet.** Perishables (cooked potato, carrot, clam on your own hearth shelf) and staples (coal, stale and fresh bread on keepers' shelves) are disjoint lists. Keepers' shelves never spoil, and food in your pack stops ageing (its age resumes only if you shelve it again). Fresh bread going stale on a keeper's shelf is the natural first crossing: the keeper's stock would then move both the bread price and the rot. | `src/spoilage.js` PERISHABLES vs `src/regional_prices.js` STAPLES; frontier notes unchanged across 25 hours | LATER/DELEGATE, proposal: a "bread goes stale" slice on the keeper's shelf through `readSpoilage` with the shelf as the storage (small, 1 lane; done when a stale-bread count moves the quote in the browser) |
| WIN6 | **The needs seam's consequence half has no reader (FRC68).** `readNeed` returns a stage (fed, peckish, hungry, starved) and an effect (work and heal multipliers, kills). No caller reads `stage` or `effect`: the sheep reads only `level > 0` and its panel shows fed or needs hay; the Gu keeper keeps its own condition rows and `dietNeed` has no caller; `householdAnimalNeed` (Moss) has no caller outside tests. | `grep -rn "effect.work\|need.stage\|dietNeed\|householdAnimalNeed" src` | ACCOUNT FOR NOW: the next needs slice applies the stage to one real verb (sheep wool progress, or the Gu's work), or the seam drops the table it does not use |
| WIN7 | **Mood and the storyteller do not interact, and that is sane.** The director's tension reads LOTM heat only; it writes no effects and no thoughts, and mood is not one of its inputs. Dunn's lapse thought and the directed feed both ran in the same life without touching each other. | `src/book_world_lotm_deck.js` `tingenTension`; lotm log | No change. A later pacing input could read the lead's own mood if Weibao wants a sour week to feel tenser |
| WIN8 | **Mood persistence edges (mood core, lane-owned, not changed).** `fileExpense` writes the thought after the duty attend and persists only when the note or tie wrote; the 60-second autosave covers the rest, so a reload within a minute can drop the thought. After load, `lastNow` is 0, so the next save keeps rows that have already run out until a new thought prunes them (bounded by the 60-row cap; readers ignore them). | `src/book_world_lotm_host.js` fileExpense; `src/mood_thoughts_domain.js` | ACCOUNT FOR NOW: for the mood core owner (FRC64), one line each |
| WIN9 | **HP exams survive Export and Import** (the lane proved save and reload only). Three Charms revisions survive reload and literal file Import with the exams panel text unchanged. | [hp-journey.txt](../gm/dispatch/wave-integration-2026-11-10/evidence/hp-journey.txt) | Pass |
| WIN10 | **Combined save, reload, Export and Import keep every Frontier slice.** `placeClocks`, `meadow_pen`, `awayBank`, `economy_standing`, `homes`, both keepers' shelves and their `last_refresh`, the pack and the clock are equal after reload and after literal Import. A new life cannot inherit mood rows: the registry loads `initialState()` for any slice a save lacks. | frontier log "reload: differing slices: []", "import: differing slices: []"; `src/domain_registry.js` load | Pass |
| WIN11 | **Keeper shelf cycles survive a reload.** `#cycleStart` lives only in memory, but it is set from the saved `last_refresh` at the start of every refresh, so a reload mid-cycle delivers the same carts. | `src/components/trader_component.js` refresh; WIN10 shelves equal after Import | Pass (code read plus the WIN10 equality) |

## Architecture checks per module

`npm run check:arch`: main.js 10,115 lines (growth 0), display.js 6,761 (growth -6), save_files.js 310 (growth 0), no new cycle or main import.

| Module | AR2 registry | AR6 save key | AR19 player route (this pass) |
| --- | --- | --- | --- |
| `needs.js` | Pure reader, no state: not needed | None | Feeding the sheep (played). Gu keeper compile (not played). Moss: no caller (WIN6) |
| `spoilage.js` | Pure; state in `placeClocks` (registered) | `placeClocks` | Store and take on the hearth shelf (played) |
| `regional_prices.js` | Pure; stock in the keepers' inventories, seen prices in `economy_standing` (registered) | existing `inventories`, `economy_standing` | Opening a trade, selling (played) |
| `mood_thoughts.js` / `_domain.js` | `moodThoughts` registered | `moodThoughts` | The LOTM panel's hand-in button (played) |
| `story_director.js` | Pure, derived, saves nothing | None (replays from the seed) | Events list rows with a why-line (played) |
| `away_bank_domain.js` change | `awayBank` registered | `awayBank` | The spend button (played) |
| `item_identity.js` | Pure; reads the knowledge slice | None new | Broker lots and held doses in the LOTM view (lane proof; not exercised here) |
| HP exams (`hp_exam_model.js`, `book_world_hp_exams.js`) | Rides the HP lead domain | Counts on the lead actor's `completed` rows in `expansion` (the world-act pattern) | Revise buttons (played) |
| Rule lints | Script only | None | `npm run check:rules` |

### AR13 change surface per merge (core-owner files)

| Merge | Core-owner files touched | Note |
| --- | --- | --- |
| needs seam | `living_upkeep.js` (Gu care core) | Two other callers adapted locally |
| spoilage | `items.js` (one template) | Shelf folded onto the reader |
| regional prices | `display.js` (5 call sites, net -1 line), `trade.js`, `trader_component.js`, `native_trade_transaction.js`, `economy_standing_domain.js` | Widest surface of the wave: the price join is spread across display call sites rather than one projection |
| mood | `person_ties.js`, `book_world_lotm_host.js`, `native_tool_domains.js` (one registration line) | Host carries the lapse logic inline (WIN12) |
| storyteller | `event_feed_ui.js` (one line) | Deck adapter in the world file |
| offline replay | `main.js` (two lines, net 0) | `fastForward` gains `untilClock` |
| item knowledge | `display.js` (net -1: three item-view joins became one), `book_world_lotm_host.js`, `book_world_lotm_ui.js` | Reduced a display join |
| HP exams | HP lead domain, UI, lessons, calendar, facts, pack (world files only) | No shared core touched |
| rule lints | none (scripts) | |

| Code | Finding | Disposition |
| --- | --- | --- |
| WIN12 | **AR18: `book_world_lotm_host.js` changed in two of nine slices** (mood and item knowledge), and the mood slice put four lines of consumer logic in `fileExpense` (read the lapse, attend, choose the thought). The host has no hook list yet. | LATER: the next slice that touches the LOTM host builds its hook list as a structural change of its own (AR18 stand-in, AR9) |
| WIN13 | **Regional prices spread one price into five `display.js` call sites** (`regionalUnit(...) ?? old price`). A projection that answers "price of this row" would keep the next price cause out of display.js. | LATER: fold into the item-view projection `item_views.js` that item knowledge started |

| WIN14 | **Two of the wave's slices meet in the linter.** The rule-lint slice's TMR1 check flags the exams slice's own day counter: `book_world_hp_exams.js:14` computes `Math.floor((clock - at + 480) / 1440)` instead of reading `world_day_index.js`. It is warning-first, so nothing fails. | `npm run check:rules`: "WARN TMR1 ... (1 new, not failing)" | ACCOUNT FOR NOW: for the HP exams owner. Either read the lead calendar's day, or mark it `// rule-lint: allow` with the reason (the 08:00 lead-clock anchor) |

### FRC68: exported readers with no caller outside tests

New exports in each merge, grepped for a caller in `src` outside their own file:

- No caller anywhere in play: `householdAnimalNeed`, `dietNeed`, `dunnMood`, `HP_REVISE_STAMINA`, `HP_EXAM_WINDOWS`, and the `need` field `habitatFacts` returns (WIN6).
- Used only inside their own file (tidy, not a gap): `needsAny`, `isSelfFed`, `drainPerMinute`, `BODIES`, `bodyData`, `stepStock`, `scarcityFactor`, `worthHere`, `eventFor`, `stapleOf`, `comfortOf`, `categoryWeight`, `directWindow`, `tingenTension`, `tingenDirected`, `TINGEN_DIRECTOR`, `markRange`, `ANON_MEAN`, `COHORT_SIZE`, `regionalNotes`, `moodWords`, `HABITAT_BODY`, `dietBody`, `neverHungers`.

Disposition: ACCOUNT FOR NOW. The first list is the real FRC68 gap; each owner either gives it a caller or drops it in its next slice.

## Checks

| Check | Result | Gaps |
| --- | --- | --- |
| `node --test tests/owned_place_clock.test.js tests/spoilage.test.js` | pass (new WIN3 test fails on the pre-fix file) | |
| `frontier_ab.mjs` | all lines above, no page errors | screenshots in `evidence/` |
| `lotm_ab.mjs` | pass after the 12-hour cut; the old checkpoint logs 11 console lines for HP item availabilities | Screenshots kept out of git (private checkpoint); fonts timed out under load 50+ |
| `hp_kept.mjs` | pass, no page errors | fixture route |
| `npm run build` | pass, dist sha256/16 `d2cf12826289511d` after the fix | |
| `npm run check:arch` | exit 0, growth 0/-6/0 | |
| `npm run check:rules` | exit 0; 1 new TMR1 warning (WIN14) | |
| `npm test` | 5,930 tests: 5,923 pass, 0 fail, 7 skipped | |
