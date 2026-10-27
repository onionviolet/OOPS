# Time travel and seeded worlds (research and proposals, 2026-10-27)

Request: [USER_VISION record](../USER_VISION.md#time-travel-gimmicks-and-seeded-worlds-request-record-2026-10-27).
Status: research and proposals only. Nothing here is accepted; no runtime changes.
Builds on [TIMELINES_AND_DIVERGENCE](../TIMELINES_AND_DIVERGENCE.md#repeatability-answer-and-research-across-rewinds-2026-10-15)
(CA12: same actual conditions normally repeat; no universal deterministic or fresh-roll policy),
OD23/OD4 ([DIRECTION_SUMMARY](../DIRECTION_SUMMARY.md)), [NPC absence and reach-out](NPC_ABSENCE_AND_REACH_OUT_2026-10-27.md)
(clocks as schedules by default) and the carry ledger (`src/carry_ledger.js`).
Tags: [S] sourced, [U] unverified memory, [I] inference. Engine owns verbs, worlds own nouns (WA5).

## Short answer

The engine is closer than expected. Shop stock is already a keyed draw (`trader_component.js:119-124`) and rain is
a pure function of the day (`weather_calendar.js:4`). What is missing is (1) the draw key uses the *save's* stream root, not a
world/life/branch seed, (2) several systems draw by a moving cursor, so the same day gives different results depending on
how many rolls happened before, and (3) there is no delta log, so "what you already took" is baked into the stock
instead of layered over it. Fix those three and a revisited day repeats.

---

## Part A. Repo reality

### A1. Randomness ownership today

| Owner | Mechanism | Locator | Pure in (seed, date, place)? |
|---|---|---|---|
| Per-save streams | `createStreams(seed)` makes `{root, cells, log}`; root = `hashStreamSeed(seed,'streams.root')` | `src/seeded_streams.js:18` | Root is per save, from the legacy `state.rng` (`main.js:618`, `main.js:6670`) |
| Pure keyed decision | `unitDecision(s, stream, key, n, salt)` = `mix32(hash(root, [stream,key,salt,n]))` | `seeded_streams.js:47` | **Yes**: a pure function of root, stream, key, n, salt |
| One-time generator seed | `streamSeed(state, stream, key)`, no cursor, no receipt | `seeded_streams.js:56` | Yes (generators then save their resolved truth) |
| Cursor draw | `drawUnit` uses `nextOrdinal` (a per-stream counter `cells[stream].n`) | `seeded_streams.js:64-72` | **No**: result depends on how many draws came before |
| Keyed draw with receipt | `keyedUnit` / `gameKeyedRandom(name,key)` | `seeded_streams.js:75` | Yes if the key carries the date and place |
| Hash and step leaf | `fnv1a`, `xorshift32`, `mix32` (saved cursors depend on exact bodies) | `src/hash_rng.js` | Yes |
| Shop stock | `fillInventoryFromTemplate`: epoch = `day_count + 1 - day_count % refresh_time`; every roll is `gameKeyedRandom(market, [trader name, template, epoch, i, j, decision])` | `components/trader_component.js:119-150` | **Yes in the draw**; inputs gated by `canBeStarted(context)` (live state) |
| Shop cadence | `last_refresh`, `can_refresh()` | `trader_component.js:97,108` | Stored state, resets on rewind only if snapshot restores it |
| Rain | 13-day `rainCycle`, `isRainingOnDay(day)`, `nativeRainAtClock` | `src/weather_calendar.js:4-18` | **Yes**, pure by design ("historical weather without mutating") |
| Temperature | `daycount_temperature_modifier[day_count % 11]` | `src/weather.js:52,79` | Yes (a fixed table) |
| Storylet evening deck | `drawUnit(state, deck:<id>, 'tick:<n>')` for new saves; legacy `roll(record)` otherwise | `src/storylet_deck.js:70` | **No**: cursor `n` advances per draw, key is a tick count, not a date |
| Other legacy generators | own xorshift cursors (`expansion_engine.js:568`, `simulation.js:208`) | listed in `seeded_streams.js:6` comment "Legacy generators remain owners of their own cursors" | No (sequential) |
| P23 encounters | `draw(seed, domain, index)`, domain-separated, "no Math.random" | `src/absorb_p23/encounter_profiles/profile.js:20-24` | Seeded, but the seed is a saved pending value |
| `Math.random` | cosmetic only: particles, floating click effects, flavour sounds, failure text variants | `display.js:447-463`, `main.js:3586,3669-3693,4543,8983-8990`, `particles.js` | Not state; harmless if kept cosmetic |

Other facts:
- The streams doc comment (`seeded_streams.js:8`) and E7 in `docs/ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md:41`
  already say: persist streams and resolved outcomes; viewing must not advance RNG.
- `main.js` still holds `Math.random` consumers; "whole-game deterministic replay" is not claimed
  (`ENGINE_SAVES_AND_SCALE_REVIEW...:23`).

### A2. Time, saves, lives

- Time: `current_game_time.day_count` is the native day; pure helpers exist for intervals (`weatherClockMinute`,
  `nativeRainAtClock`). The expansion engine has its own `clock` (`expansion_engine.js:85`). [I] Two clocks means a revisited
  "day" must say which clock it keys on; default is the world's played calendar day.
- Saves: snapshots keep the *whole save*; `continuationEligibility` (`src/continuation_state.js:30-40`) allows rewind only
  in `base.frontier` with no other retained worlds, pause/resume for `TRAVEL_WORLDS`. Commit `17f53f76d` made a Tingen
  crossing pause the Village life and resume either way, with per-life save files; rewinds stay Frontier-only.
- Carry ledger: `src/carry_ledger.js` has scopes `this life / last life / any life` and boundaries
  `death / rebirth / world crossing`; only `base.frontier` and `book.paradise.hub` are written, others register via
  `registerCarryRules`. There is no `time travel` boundary yet.
- Old-save compatibility is currently deferred (2026-10-17, [RULES_INDEX](../RULES_INDEX.md) row "Saves and persistence"),
  but new state still needs Save, reload, Export, Import. Unknown retired content IDs follow the 2026-10-18 decision.
- Direction: PROJECT.md:1385-1396 (CA12: ordinary temporal return rewinds current-world history by default, qualified by means;
  enduring base-cheat upgrades carry), PROJECT.md:1466 (time bank follows the continuing journey), PROJECT.md:1620
  (OD23: ordinary play advances time; rates, offline aging open), PROJECT.md:1546 and 1717 (rewind, resurrection and run
  endings are proposals). Forward/backward time options are "considerations, not selected mechanics" (PROJECT.md:1608).

### A3. What must be a pure function, what is stateful

**Pure base (f of world seed, branch, date, place, fact set):**
- Shop stock offers: presence, count, quality, affixes (already keyed; add the world seed and the place/shop id in the key, keep the template epoch).
- Weather and temperature (already pure).
- Ambient events: storylet draws, travelers, local-life events, found-on-the-road items, forageable and one-off finds.
- Calendar facts: festivals, canon dates, tide-like schedules (data, not rolled).
- Encounter spawn tables per place and day.
- Price drift (market_saturation baseline). The *baseline* is pure; saturation from your sales is a delta.

**Genuinely stateful (delta log, never regenerated):**
- Anything the player did: items bought, taken, killed, sold into the market (`market_saturation`), shop locks (`shop_locks`).
- Fact changes caused by those actions: NPC attitudes, open obligations, discovered sites.
- Body, skills, inventory, coins, reputation.
- Stock that a campaign conserves (`conservedCampaignKeys`, `trader_component.js:84-96`).
- Resolved outcomes of chance events already shown (receipts in `streams.log`, `seeded_streams.js:59`).

**Fact-set caveat:** `canBeStarted(context)` gates stock entries on live facts (`trader_component.js:130`). So stock is
f(seed, date, place, facts). That is correct for a world that responds (a plague closes the market), but a revisit with
different facts gives different stock. Default: this is a feature; log the fact set a day was generated under.

### A4. Where determinism breaks today (F-codes)

- **F1. Seed scope.** `streams.root` is per save. Two lives in one save, or a pre/post-rewind branch, share the root, so
  "life/branch" cannot yet change the world. A fresh Village life and a Tingen life share one root namespace only by
  the `@worldId` suffix (`scopedStream`, `seeded_streams.js:42`).
- **F2. Cursor draws.** `drawUnit` (`seeded_streams.js:70`) and the storylet deck (`storylet_deck.js:70`) depend on call count.
  A snapshot rewind restores the cursor, so a rewound day repeats; a loop reset that keeps `cells` (to preserve other progress)
  would not. An unrelated UI action must not shift results (CA12), so cursors that serve scene draws are a risk.
- **F3. Purchases bake into stock.** `refresh()` empties and refills inventory (`trader_component.js:85-97`), keeping only
  conserved campaign stock and shop locks. Revisiting a refreshed day regenerates the offer *as if you had not bought*
  unless a delta log subtracts it. Today there is no log.
- **F4. `last_refresh` is state, not a function of the date.** It decides whether stock regenerates at all.
- **F5. Epoch anchor.** `epoch = day + 1 - day % refresh_time` is date-pure but every shop shares one hash scheme through
  `inventory_template` name; two shops using one template with the same `this.name` collide (names are unique today [I]).
- **F6. Two clocks.** Native `day_count` vs `expansion.clock` (A2).
- **F7. Cosmetic `Math.random`** is fine unless it leaks into state; the comment at `display.js:447` already pins this rule.
- **F8. Generator version.** Nothing records which generator version produced stock; editing a template silently changes
  what an old date offers (Minecraft has the same issue [S, below]).
- **F9. Rewind scope.** Rewinds are Frontier-only (`continuation_state.js:35-39`), so no other world can currently test the contract.

---

## Part B. How other games and fiction do it (summary; full notes below the table link)

Full per-title notes and sources: the subagent working file is
`/Users/weiwei/Library/Application Support/Claude/side-session-notes/local_9a7a47f4-e929-4473-804d-be85e9fd8ef3/time_travel_partB.md`
(outside the repo). Unreachable: Fandom wikis (402/403) and the Stardew wiki (403), so Stardew, Slay the Spire stream
splitting, Caves of Qud, Idle Loops and most Re:Zero limits are [U]. Web-novel sources were thin; that list is [U]/[I].

| Source | Resets | Persists | Repeated randomness | Exploit limit | Paradox |
|---|---|---|---|---|---|
| Majora's Mask [S: [Wikipedia](https://en.wikipedia.org/wiki/The_Legend_of_Zelda:_Majora%27s_Mask)] | 3-day clock, quests, rupees unless banked [U] | gear, masks, songs | none: fixed NPC timetable | Notebook shows schedules; Double Time songs; real-time cap | reset, no branching |
| Outer Wilds [S: [Wikipedia](https://en.wikipedia.org/wiki/Outer_Wilds)] | everything every loop | the ship-log knowledge | none: clockwork world | nothing to exploit but knowledge | closed loop |
| Braid [S: [Wikipedia](https://en.wikipedia.org/wiki/Braid_(video_game))] | per world rule | per world rule | none | puzzle design | embraced (shadow copy) |
| Sands of Time [S: [Wikipedia](https://en.wikipedia.org/wiki/Prince_of_Persia:_The_Sands_of_Time)] | last ~10 s on rewind; whole timeline at the end | Prince's memory only | not relevant | Sand Tanks refilled from enemies | single memory-holder |
| Hades [S: [Wikipedia](https://en.wikipedia.org/wiki/Hades_(video_game))] | obols, run upgrades | weapons, standing, quests | preset rooms, shuffled | Pact of Punishment | diegetic death |
| Slay the Spire [U] | the run | unlocks | one seed per run, separate streams per system, one daily seed | one scored daily attempt | none |
| Dwarf Fortress / Qud [S for DF: [Wikipedia](https://en.wikipedia.org/wiki/Dwarf_Fortress)] | n/a | generated history is frozen into the world | seed accepted at worldgen [U] | n/a | n/a |
| Minecraft [S: [wiki](https://minecraft.wiki/w/Seed_(level_generation))] | n/a | world | same seed gives the same terrain; generator updates change it | n/a | n/a |
| Stardew daily luck [U] | n/a | n/a | luck = f(unique ID, days played), so reload repeats | save-scum gains nothing | n/a |
| Idle Loops [U] | the loop | skills and stuff | actions deterministic, so replay is exact | mana is the time budget | n/a |
| Re:Zero [S: [Wikipedia](https://en.wikipedia.org/wiki/Re:Zero)] | world to a save point | Subaru's memory | world responds, so knowledge decays [U] | pain, cannot tell others [U] | old timeline discarded |
| Steins;Gate [S: [Wikipedia](https://en.wikipedia.org/wiki/Steins;Gate)] | world line | Okabe's memory | n/a | personality cost in one route | embraced; attractor fields [U] |
| Chrono Trigger [S: [Wikipedia](https://en.wikipedia.org/wiki/Chrono_Trigger)] | money, key items on New Game Plus | levels, tech, gear | n/a | needs repair quests | explicit repair quest |
| Life Is Strange [S: [Wikipedia](https://en.wikipedia.org/wiki/Life_Is_Strange)] | seconds to minutes | items, env. changes | n/a | short range, rising cost | butterfly consequences |
| Loop Hero [S: [Wikipedia](https://en.wikipedia.org/wiki/Loop_Hero)] | the expedition (70% loss on death) | retreat keeps resources | generated | retreat gives less | none |
| Katana Zero [S: [Wikipedia](https://en.wikipedia.org/wiki/Katana_Zero)] | checkpoint | enemy positions not restored | n/a | slow-motion meter | restarts framed as foresight |
| Deathloop [S: [Wikipedia](https://en.wikipedia.org/wiki/Deathloop)] | midnight, uninfused gear | memories, infused gear | fixed schedule per period | Residuum cost | closed loop |
| Dishonored 2 [S: [Wikipedia](https://en.wikipedia.org/wiki/Dishonored_2)] | n/a | observation only | n/a | cannot intervene | bystander design |
| Web-novel regression [U/I] | n/a | knowledge | market and event knowledge is the lever | butterfly effect, weak body, rival regressors, cost | world responds |

Technique [S]: counter-based RNGs compute any output from (key, counter) with no stream order dependence
([Wikipedia](https://en.wikipedia.org/wiki/Counter-based_random_number_generator), Salmon et al. 2011). Event sourcing stores
changes and rebuilds by replay, with snapshots to shorten replay ([Fowler](https://martinfowler.com/eaaDev/EventSourcing.html)).
Minecraft shows the generator-version lesson ([wiki](https://minecraft.wiki/w/Seed_(level_generation))).

Patterns that matter here [I]:
1. **Fixed or derived randomness makes knowledge valuable; re-rolling destroys it.** Majora, Outer Wilds, Deathloop,
   Stardew (U) all fix the world; that is why they can be "learn the world" games.
2. **Exploits are limited by four things**, rarely by "no": time cost, cash resetting, scarcity of the carrier, and world response.
3. **Persistence ladder:** knowledge only, then knowledge plus bounded items, then knowledge plus stats.
4. **Paradox is handled by discarding the old timeline, one memory-holder, a repair quest, or embraced as the puzzle.**
5. **Bystander time (Dishonored 2) sidesteps paradox entirely.**
6. **A hash of (seed, domain, place, day, id, draw index) beats a shared sequential RNG**, and the generator needs a version.

---

## Part C. Proposals for YAIRPG

Default, dial, reason throughout. None accepted.

### C1. Determinism contract (proposal DT1)

**Default.** Every ambient roll is `H(worldSeed, domain, placeId, dayIndex, subject, drawIndex)`, where:
- `worldSeed` = per world instance: `hash(save root, worldId, worldInstanceId)`. A *branch* (world line) gets a new `worldInstanceId`
  only when the branch is explicitly a different world line; a rewind inside one life keeps it (so the day repeats).
- `domain` = the existing stream families (`market`, `encounter`, `loot`, `world.events`, `deck`, `gather`, `weather`).
- `dayIndex` = world-calendar day (default the native `day_count`; the expansion clock must map to it).
- `placeId` and `subject` = shop id plus slot (`i,j`), event deck id, forage node, and so on.
- `drawIndex` = a local counter inside one subject, never a global cursor.

The existing `unitDecision` already has this shape; the contract is a rule that **ambient content uses keyed draws, not `drawUnit` cursors**.
Cursor draws remain for *player-caused* chance (a fight's hits, a craft quality), which are saved as receipts when they happen.

**Layer on top: a delta log.** `deltas[worldInstanceId][dayIndex][placeId] = [{kind, subject, count, by, atMinute}]`.
Regeneration is `base(day, place)` minus/plus deltas: taken items, killed encounters, bought stock, sold-into saturation.
Receipts that matter (a found item taken) are deltas; a shown-but-unrolled day is never stored.

**Dials (per world, as adjectives):**
- *How fixed:* fixed (Majora style), mostly fixed with light drift, or per-visit fresh (a drifting dream world). Default: **fixed for stock, finds and scheduled events; mostly fixed for weather; fresh only where the world's own mechanism says so** (e.g. a market-spirit world). Reason: CA12 says same conditions normally repeat, chance qualified.
- *How deep the delta log remembers:* a day, a season, the life. Default: the life; pruned past an adjective-sized window with a summary line (cost: save size, [TIMELINES_AND_DIVERGENCE](../TIMELINES_AND_DIVERGENCE.md) "save the difference").
- *How world-responsive:* does your presence change tomorrow's base (butterfly)? Default: **small, via logged deltas and fact changes, not by reseeding**. Reason: reseeding hides cause; the player can see *why* it changed.

**Rules that keep it honest:**
- A new roll in one system never moves another (domain separation + local draw index). Add a test for it.
- The generator carries a `genVersion` per domain; a template edit bumps it, and old dates keep their recorded `genVersion` if a delta log or snapshot exists (F8). Default: new content applies to dates not yet visited.
- Viewing never rolls and never writes (E7).

### C2. Time-travel kinds as world-specific mechanisms (proposal TT1-TT6)

The engine supplies verbs (`rewind`, `restore-to-date`, `branch`, `observe-past`); worlds name them and set cost. Each kind lists what carries,
using the carry-ledger shape (add a boundary `time travel`, rows with scopes this life / last life / any life, per world).

| Kind | What happens | Carries by default | Cost and limit (adjectives) | Where it fits [I] |
|---|---|---|---|---|
| TT1 Rewind within a life | Restore a snapshot of this world's state; keep the same `worldInstanceId`, so every day repeats exactly | Memory only (the player and the character); optional bounded kept items via the carrier | A recoverable cost in time bank or a scarce charge; short range ("a little", "a day", "a season") | Frontier already (Frontier-only today); a talisman or cheat elsewhere |
| TT2 Loop reset | World resets to a fixed morning each cycle; stock and events identical; a small kept list persists | Knowledge, skills, a short named list; coins usually reset | A fixed cycle length; leaving the loop is a goal | A Majora/Outer Wilds style world; Tingen-like quiet cycle |
| TT3 Regression to an earlier date | The character, with knowledge, returns to a younger body and earlier date; new life branch for that world | Memory, mastery "according to its nature" (CA12/continuation), enduring base cheat | Weak body, rivals who may also know, world responds; no key-event guarantee | Xianxia/web-novel worlds, LOTM style |
| TT4 Branch / world line | New `worldInstanceId` with a copy of the delta log up to the fork; the old branch is kept as a frozen life | Everything in the copy; the branch atlas (TIMELINES) | File size grows by deltas only; resume either; heirs inherit the atlas | Parallel worlds, Steins;Gate style |
| TT5 Bystander visit to the past | Observe the base world of an earlier date; no deltas written, or deltas written to a scratch layer and discarded | Knowledge only | No intervention, or intervention is a branch (TT4) | Dishonored 2 style, historical sites |
| TT6 Forward leap / skip | Advance days in one step; the world plays its base plus a catch-up summary | Everything | Aging and missed schedules apply (OD4, not retroactive draws, per `storylet_deck.js:63`) | Time bank, wait-for-festival |

Rules shared by all kinds:
- **Knowledge always carries**, because it lives with the player and the character's journal; the carry ledger decides what *body* things carry.
- **Exploits are limited by cost and world response, not by blocks.** Market arbitrage over a repeated day: stock is the same, but your own purchases are deltas and
  saturation recovers on the game's clock, so a loop yields a *known* profit only until the sell-side saturates. Cost: each loop spends the carrier.
  AD22: Weibao is the only player, so no anti-cheat beyond save integrity.
- **Paradox default:** discard the abandoned timeline (TT1, TT2, TT3), keep it as a frozen life (TT4), or write nothing (TT5). Embrace paradox only where a world's own mechanism says so (Steins;Gate-like), as a dial, not a bug.
- **Identity:** body identity, retention and the exact time-bank price remain open (PROJECT.md OD23, OD4). TT3 defaults to a fresh younger body in the same life branch; TT1 keeps the body.

### C3. Interactions (proposals TI1-TI7)

- **TI1 Clocks (schedules vs deadlines).** Default: clocks are schedules, deadlines come only from in-world sources
  ([NPC absence, many clocks scoped to the life](NPC_ABSENCE_AND_REACH_OUT_2026-10-27.md#update-2026-10-27-weibaos-correction-many-clocks-scoped-to-the-life-proposals)).
  Schedules are exactly what makes a revisited day repeat (Majora). Canon-date deadlines (a scripted event) are *base-world facts*; time travel changes who knows, not when, unless the world has a divergence mechanism (OD7). The canon-protagonist session owns the canon-deadline split; this doc only requires that its dates be data keyed by `dayIndex`.
- **TI2 Frozen worlds.** Other worlds freeze by default. Rewind or branch in the current world never touches a frozen world's deltas; a frozen world's `dayIndex` stays where it paused. Crossing back resumes at that frozen day, not at "now". This matches `17f53f76d`.
- **TI3 Continuing journey and the time bank.** The bank follows the journey (PROJECT.md:1466). Default: rewinds that spend "time" draw on banked eligible time; going back does not refund spent time. Bank restoration needs a selected contract (TIMELINES says so).
- **TI4 Deaths and heirs.** Death is a boundary in the ledger, not a rewind. Default: an heir starts at the *next* day in the same world instance, so the world's base repeats for them and the delta log tells them what the old life left (grave, obligations). A regression after death is a TT3, a separate item.
- **TI5 Saves and Import.** A save stores `worldSeed`, `genVersion` per domain, and deltas; never the generated stock. Import with a different `genVersion` shows a plain notice and applies the new generator to unvisited dates only. Per-life save files already exist; they should each carry their own instance id.
- **TI6 Offline and away routines.** Chosen routines progress using the same keyed draws for each elapsed day (no "retroactive" `drawUnit`), so offline day N equals played day N.
- **TI7 UI.** A revisited day shows a short "last time you were here" line and the delta log in the day's journal; a rewind shows what carried and what was undone. Desktop first (standing UI priority); evidence at the target viewport before any UI claim.

### C4. Same item, same place (proposals SI1-SI6)

- **SI1 Stock is a function.** `offer(shop, day) = base(seed, shop, epoch, slot) filtered by facts`. Already close at `trader_component.js:123-124`; extend the key with the world instance seed and the shop place id.
- **SI2 What "the same" means after you bought or took it:**
  - Default: *the same offer, minus what you took*. The item is in the base list but flagged `taken` by a delta; the shop shows it as sold, or the stack is reduced. After you sell it back, it is a delta in the other direction.
  - Reason: the world is consistent (the sword is gone from the shelf), and the log explains it.
  - Dial: *how stock replenishes within the epoch*: none until next epoch (default), a partial restock after a few days (adjective), or never (rare relic).
- **SI3 One-off finds.** Hidden finds (a coin in a ditch, a rare herb node) use the same key with `kind:'find'` and a once-only delta: found on day D at place P stays found for that world instance. Rewinding to before D restores it, because rewind restores the delta log with the snapshot. Sealed discoveries stay sealed: a find's *route* is keyed, its truth remains in sealed files and is never printed in logs.
- **SI4 Events.** The storylet deck draws by `(deck, placeId, dayIndex, slot)` rather than a tick cursor (F2). A shown-and-resolved storylet is a delta (resolved with option X), so revisiting shows the same card, already resolved, with the memory of how it went.
- **SI5 Saturation and prices.** `market_saturation` baseline is the pure part; your sales are deltas that decay on the clock. A revisited day shows the pre-sale price with your logged sales layered, so arbitrage is consistent rather than free.
- **SI6 What changes on purpose.** A world with a fresh-per-visit dial (rare) re-keys with a `visitIndex`. A divergence event (a fire in town) changes facts and so changes `canBeStarted` output; that is the intended butterfly.

### C5. Minimal first slice (proposal FS1) and save safety

**Slice (docs-ready, runtime later):** make the *Village shop stock* and *one ambient event deck* deterministic by date and place, add a small delta log, and a headless test.

1. Add a derived `worldSeed` (read-only, from `streams.root` + world id; no new stored field required for an existing save, so
   existing saves keep working as the same stock they already got).
2. In `fillInventoryFromTemplate`, put the shop place id into the key (the name already is unique per shop [I]; confirm) and read `genVersion` from the template (default `1`).
3. Add `state.timeDeltas` (additive, optional field, absent in old saves = empty log). Record shop `bought` and `taken` deltas with `{world, day, place, key, count}`.
4. `refresh()` applies the log after regeneration (replaces the ad hoc `retainShopStock` only for logged deltas; keep it for locks).
5. Storylet draw: switch the keyed branch to `keyedUnit(..., 'tick:'+n)` plus a `(dayIndex, placeId)` key for new saves; keep the cursor path for saves marked `randomSource` of the older kind (the file already has that fork, `storylet_deck.js:23,95`).

**Headless test (one focused file, by system not wave):** `tests/time_seeded_world.test.js`
- Given the same save seed and `day_count`, `fillInventoryFromTemplate` twice yields byte-identical inventories.
- Adding an unrelated draw (a craft roll) between the two calls does not change the stock (domain independence).
- A different `day_count` in a different epoch gives a different offer (so the seed is not constant).
- Buy 1 of item X, force `refresh()`, regenerate the same epoch: the offer shows X reduced by 1 and the delta log lists the purchase.
- Revisit the day through snapshot restore: the shop is the same offer, and the journal text includes "you took X here".
- Same for the event deck: the card for `(deck, place, day)` repeats and a resolved card shows its resolution.

**Save safety:** additive. `timeDeltas` is optional; absent means empty. A save without `worldSeed` derives it from `streams.root` and the world id, so
old shops draw the same keys they already drew. Old-save compatibility is deferred (2026-10-17), but this slice needs none. Save, reload, Export, Import must all keep the delta log
(AGENTS verification). `genVersion` unknown on import: keep the older, show a notice (TI5). No change to `hash_rng.js` bodies (saved cursors depend on them).

Existing-state rules this slice applies: AR (runtime code seam: the keyed draw seam is `seeded_streams.js`), MR on saves (Rulebook 9, AR6), AD36 floor for completion (six lines), AD22 (limits are adjectives), WA5.

---

## More to consider (round 1)

Levels: L1 small, L2 medium, L3 large. Effort in sessions.

### ACT NOW (done in this doc)
- Mapped every ambient RNG to pure vs cursor vs cosmetic (A1) and listed the breakage points F1-F9.
- Reduced the contract to one rule: ambient content uses keyed draws; player-caused chance uses saved receipts.
- Treated "same" after buying as "same offer minus logged deltas" rather than re-rolled.

### ACCOUNT FOR NOW (shape the slice so these stay possible)
- **A1. Two clocks.** Native `day_count` vs `expansion.clock`: choose one `dayIndex` mapping before any key uses it. Level L1, effort 0.5 session, done: one helper and a test that both clocks agree on the same day.
- **A2. Template edits change history.** Add `genVersion` now (default 1) even if unused. L1, 0.5, done: field exists, test fails if a template changes without a bump.
- **A3. World instance id.** Reserve the field in the per-life save so TT4 branches do not need a migration. L1, 0.5, done: field present on new lives, ignored on old.
- **A4. Fact-gated stock.** `canBeStarted(context)` makes stock depend on facts; record the fact snapshot hash with a day's delta so a revisit with different facts says why stock differs. L2, 1, done: a visible "this changed because ..." line.
- **A5. Cosmetic randomness boundary.** Keep `Math.random` out of state; add a lint-style check in `check:arch`. L1, 0.5, done: check fails on a new `Math.random` assigned into state.

### LATER / DELEGATE
- **L1. Carry-ledger boundary `time travel`** with rows per world and per kind (TT1-TT6). L2, 1-2, done: `carryLedger(world)` returns time-travel rows for Frontier and one other world; UI shows what carried.
- **L2. Rewind beyond Frontier** (Village, Tingen, Proto23) under `continuationEligibility`. L3, 3+, done: a rewind in a second world passes the headless test and Import.
- **L3. Branch atlas as delta copies (TT4)**, per TIMELINES "save the difference". L3, 3+, done: fork a life, play a day each way, file size grows by deltas only.
- **L4. Bystander mode (TT5).** L2, 1-2, done: visit an earlier day with no writes to the live delta log.
- **L5. Price/saturation deltas (SI5)** across a loop; check arbitrage limits as adjectives. L2, 1-2, done: a 3-loop run shows saturation shrinking profit.
- **L6. Regression knowledge UX (TT3):** a journal of "what I know happens" with source and confidence, so knowledge carries without hidden state. L2, 2, done: journal survives a regression; wrong entries are marked changed after a divergence.
- **L7. Web-novel limit set** (butterfly, weak body, rival regressors, cost) as per-world dials. L2, 1-2, needs a source pass (the one here is thin): done: three source citations from real novels in a research file.
- **L8. Source check for [U] items** (Stardew luck, Slay the Spire streams, Qud, Idle Loops) from a game wiki. L1, 0.5, done: each [U] row above becomes [S] or is dropped.
- **L9. Offline catch-up with keyed draws (TI6).** L2, 1, done: a 7-day away summary equals seven played days of the same seed.

## Top three recommendations

1. **Adopt the one-rule contract (DT1):** ambient content uses keyed draws from a per-world-instance seed; player-caused change is a logged delta on top. It costs little because `unitDecision` and the shop key already do it.
2. **Build the first slice (FS1) on the Village shop and one event deck,** with the headless test, additive `timeDeltas`, `genVersion` and a reserved world-instance id. It proves "same item, same place" without touching existing saves.
3. **Make time travel a ledger boundary with kinds (TT1-TT6),** starting with rewind-in-life (TT1) and bystander (TT5), which need no new world copies, then loop reset (TT2) for a world that wants a fixed cycle.

Proposals only; the user's direction (Weibao's words) still decides which kinds a world gets.
