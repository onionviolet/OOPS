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

---

## Part D. Seeded NPCs and other generated content; engine decisions (addendum, 2026-10-27)

Request: Weibao, "Seeded npc generation and other stuff too would need to be considered, more to consider? engine level decisions and changes?"
([record](../USER_VISION.md#seeded-npcs-and-generated-content-request-record-2026-10-27)). Proposals only. Codes: G = generated-thing rows, K = key proposals,
E = engine decisions, C = ordered changes. Locators checked 2026-10-27.

### D1. Generated-things inventory (what is seeded, saved, recomputed)

"Saved" = the resolved result lives in the save slice, so a reload never re-rolls. "Recomputed" = derived from the seed on demand.

| Row | Thing | Locator | Randomness source | Saved or recomputed | Order/time dependence |
|---|---|---|---|---|---|
| G1 | Travelers (names, traits, needs, asks, rewards, possessions, arrival minute) | `generated_people.js:15-34` | `drawUnit` on stream `world.people:village` (cursor) when streams exist, else `deriveSimulationSeed` xorshift; names via `generatePersonName({seed,key})` | **Saved** (`createGeneratedPeople` returns the people list) | Cursor draws: the batch depends on how many `world.people` draws came before. `arrivedAt` uses the clock at creation |
| G2 | Village lives (family tree, death years, events) | `npc_lives.js:10-29` | `hash(seed:id)` (fnv1a) for lifespans; the family shape is authored | Saved (`validateVillageLives`) | **Pure** in (seed, id); hardship shifts years by data |
| G3 | Village life events (deaths, births, weddings, bonds, mourning) | `life_events.js:23` (`hash`), `scan` 72, `resolve` 161 | fnv1a of keys | Saved (`freshEvents` slice) | Pure in key; driven by `year` argument |
| G4 | Authored NPCs and trader roster | `models/npc.js`, `components/trader_component.js` | none for identity | Static data | n/a |
| G5 | Shop stock | `trader_component.js:119-150` | `gameKeyedRandom(market, [name,template,epoch,i,j,decision])` | Saved inventory; regenerated on refresh | Keyed by epoch (pure); `canBeStarted(context)` adds fact dependence; refresh drops purchases (F3) |
| G6 | Loot and finds | `STREAMS.loot` (`seeded_streams.js:6`), `cheat_mechanisms.js:108` | stream `loot@world`, `n = keyed ? 0 : cursor` | Result applied to inventory | Cursor unless `keyed` |
| G7 | Weather and temperature | `weather_calendar.js:4`, `weather.js:52,79` | fixed tables by day | Recomputed | **Pure** in day |
| G8 | Storylet draws | `storylet_deck.js:70` | `drawUnit(state, deck:<id>, 'tick:n')`; legacy xorshift in `record.rng` for old saves | Saved (open events, receipts, `ticks`/`drawn`) | Cursor (F2) |
| G9 | Encounter and bestiary rolls | `STREAMS.encounter`, `native_battle.js:51`, `cohort_battle.js:92` | per-battle `battle.seed` xorshift32; encounter via stream | Battle seed saved in the battle | Pure inside a battle; encounter entry by cursor |
| G10 | P23 encounter profiles | `absorb_p23/encounter_profiles/profile.js:20-24` | `draw(seed, domain, index)`, domain-separated | Pending seed and exchange index saved | **Good pattern**: domain plus index |
| G11 | Procedural items and relics | `relic_generator.js:24-36` (`seededRandom`), `naming_act.js:53-72` | `hashStreamSeed(seed,'relic')` xorshift | Saved with the item; naming record `at` uses `Date.now()` (`naming_act.js:72`) | Seeded; the timestamp is wall-clock |
| G12 | Mixtures and products | `mixture_state.js:14-60` | `localMixtureSeed(seed, scope)`; `streamSeed` once | Saved (generators keep resolved truth) | Pure in (seed, scope) |
| G13 | Starts and character creation | `start_records.js:4-12` (`seededStartRng`, mulberry-like), `resolveStart(world,choices,seed)` | string seed | Saved as start provenance | Pure in seed string |
| G14 | Relationships and chronicle | `chronicle.js:64` (`relationshipChange`), `:12` | no randomness; caused by actions | Saved | Player-caused, so deltas by nature |
| G15 | Lore history and world events | `lore_history_state.js:119,154` (`world.events@world`, `rollTable`, `rollInt`) | keyed stream | Saved (story outcomes, world history) | Cursor/keyed mix |
| G16 | Cosmetic variety | `Math.random` in `display.js:447-463`, `main.js:3586,3669-3693,4543,8983-8990`, `particles.js` | `Math.random` | Not state | Harmless unless it leaks into state |
| G17 | Real-time inputs | `Date.now` in `cheat_host.js:21,46`, `main.js:589` (furnace accrual), `achievements.js:39`, export reward timers `main.js:6566` | wall clock | Saved as offsets | Real-time by design; keep out of world draws |

Reading of the table [I]: the *identity* of most people and items is already rolled once and saved (G1, G2, G11-G13), which is the safe pattern for
"the same NPC". The gaps are (1) *where and when they appear* depends on a cursor (G1, G6, G8, G15), (2) there is no per-life or per-branch seed (F1),
and (3) there are two generations of random helpers (fnv1a+xorshift in `hash_rng.js`, a mulberry-like in `start_records.js:5`, `relic_generator`'s own).

### D2. Seed keys per category (proposals K1-K9)

Notation: `H(worldSeed, domain, place, day, entity, draw)`. `worldSeed = hash(save root, worldId, instanceId)` (DT1). `instanceId` changes only on a TT4 branch or a new life that the world defines as a new world instance (default: a heir keeps it, a regression or branch gets a new one).

| Key | Category | Key tuple | Notes |
|---|---|---|---|
| K1 | Traveler identity | `(world, 'people.traveler', arrivalSlot)` where `arrivalSlot` = the calendar slot they arrive in (week and arrival index), **not** a cursor | Stable entity id = `traveler:<slot>`; name, traits, asks drawn with a local `draw` counter inside the entity (like `profile.js:20`). The same traveler arrives in the same week on a revisit |
| K2 | Where they are | schedule data keyed `(entityId, dayIndex)`; roam draws `(entityId, dayIndex, 'place')` | NPC absence report: schedules first |
| K3 | Shop offer | `(world, 'market', shopId, epoch, slot, decision)` | Extends `trader_component.js:124` with world seed and shop id |
| K4 | Finds and loot | `(world, 'loot', place, day, nodeId, draw)`; `keyed: true` always for ambient finds | Cursor draws kept for fights and crafts only |
| K5 | Weather | `(world, 'weather', day)` (default: the existing fixed tables; a world may seed variation) | Already pure |
| K6 | Storylet draw | `(world, 'deck:<id>', place, day, slot)` | Replaces `tick:n` cursor for new saves (F2); resolved cards become deltas |
| K7 | Encounter entry | `(world, 'encounter', place, day, spawnSlot)`; a battle then uses its saved `battle.seed` | Pure inside battles already (G9) |
| K8 | Procedural item | `(world, 'item', sourceKind, sourceId, draw)`, e.g. a shop item's affixes keyed by its stock slot | The item then saves its resolved identity (G11); the same shelf item has the same affixes on a revisit (`affixedStockEntries` random is already keyed, `trader_component.js:146`) |
| K9 | Relationship seeds (compat, traits) | `(world, 'people.bond', entityA, entityB)` | Deterministic baseline; player actions are chronicle deltas (G14) |

**Stable entity IDs.** Default: every generated entity has an id built from its key (`traveler:wk12:2`, `find:millford-ditch:d40:coin1`), never an array index and never a cursor
count. Reason: indexes shift when content is added; keys do not. Dial: how long ids stay valid (the life; the instance).

**What happens to an NPC the player already met, killed, befriended or recruited** (proposals, default then dial):
- *Met:* the base NPC is regenerated from the key; a `met` delta and the chronicle record keep what you know. On a revisit before the meeting they are a stranger, with the usual TT1 carry of your memory only.
- *Killed:* a `dead` delta on the entity id. Revisiting a day before the death shows them alive (the base is unchanged); a branch after the death has them dead. The world responds through facts (mourning, G3), not reseeding.
- *Befriended:* the bond is a chronicle delta; a rewind restores it with the snapshot.
- *Recruited:* a recruit becomes a **saved entity** (`addVillageRecruit`, `npc_lives.js:53`), no longer a function of the seed; the key still marks where the base version appears, so a revisit that predates recruitment shows the unrecruited person while the recruit exists elsewhere. Default: an entity that exists in your party is not duplicated by the base layer on the same instance (dial: *how strictly the world forbids doubles*; a time-travel world may allow a "past self" or "past ally", at a cost). This is the only place paradox shows up; it follows the TT dial, not a patch.
- Sealed content: the key names a secret's *route*, never its truth; logs and receipts carry ids and statuses only.

### D3. Engine-level decisions (proposals E1-E12)

Owners are AR rulebook codes ([ARCHITECTURE_RULES](../ARCHITECTURE_RULES.md)); AR3 one authority per fact, AR5 leaf modules, AR6 namespaced save slices, AR7 quote and revalidate, AR8 observer-safe projections, AR12 world variety stays local, AR16 gates.

| Code | Decision | Default | Dial | Reason | Owner |
|---|---|---|---|---|---|
| E1 | **One RNG service** | `seeded_streams.js` stays the single authority (AR3). Add `keyed(world, domain, place, day, entity, draw)` over `unitDecision`; deprecate ad hoc seed helpers (`start_records.js:5`, `relic_generator.js:24`) by routing them through `streamSeed` when touched | How fast to migrate: only when a file is edited anyway | Three RNG idioms means three determinism stories. `hash_rng.js` bodies stay byte-identical (saved cursors) | AR3, AR5 |
| E2 | **Seed stream separation** | Domain strings are the independence boundary: a new roll uses a new `(domain, entity, draw)` and never advances another cursor | Domain granularity: per system (default) or per entity | CA12: an unrelated action must not change another system's result | AR3 |
| E3 | **Draw-order independence** | Ambient content: keyed draws only. Cursor draws: only for player-caused chance, saved as receipts | Which cursor draws may remain (fights, crafts) | Order independence is what makes a revisit equal | AR3, AR7 |
| E4 | **Seed scope** | Per-world-instance seed for ambient content; per-life seed only for player-caused chance streams; one global save root above both | Whether a heir keeps the instance (default yes) and whether a regression gets a new one (default yes) | A heir's world is the same village; a regression is a different line | AR6, AR12 |
| E5 | **Save schema** | Additive only: `streams` unchanged; new optional `world.instances[id] = {seed?, genVersion{domain}}` and `timeDeltas`; absent means derive from `streams.root` and empty log | Bump `schema` only if a field becomes required | Old-save compatibility is deferred (2026-10-17) but this needs none; migration only if later fields become required | AR6 |
| E6 | **Import and seeds** | Import keeps the saved seed and deltas verbatim and never re-rolls. Import into another browser restores the same world. A hand-edited seed is allowed (single player, AD22) and shown in the header | Whether the seed is shown to the player (default yes, not secret) | Seeds are not sealed secrets; truths drawn from them are | AR6, AGENTS safety |
| E7 | **World-pack fingerprint** | Each pack records a fingerprint per generating domain (`genVersion` plus content hash of its templates). On Import or load with a different fingerprint: keep recorded deltas and already-resolved entities; unvisited dates use the new generator; show a plain notice | Strictness: lax (default), warn per domain, or refuse for a world that says its calendar is canon | A template edit silently changes history otherwise (F8; Minecraft [S]) | AR12, AR6 |
| E8 | **Headless test hooks** | A pure `generate(worldSeed, domain, place, day, entity)` per category (no state mutation), plus `replayDay(save, day)`; tests assert identity across two calls, domain independence, and delta layering | Number of hooks: one per domain as it migrates | AR10 wants a player journey, but the pure hook is the cheap regression | AR10, AR16 |
| E9 | **Cost** | Keyed draws are O(1) hashes; no stored cache. Deltas store only changes; prune past an adjective window with a summary | Window: a life (default), a season, a day | File size is the real limit (TIMELINES "save the difference") | AR6 |
| E10 | **Day index** | One helper `dayIndex(world)` over the played calendar; the expansion clock maps to it | Per-world calendar owner | Two clocks otherwise (F6) | AR3 |
| E11 | **Cosmetic random** | `Math.random` allowed for display only; a check fails if it is assigned into saved state | Strictness in `check:arch` | Keeps G16 harmless | AR16 |
| E12 | **Projections** | A revisit view reads `generate()` plus deltas; viewing never rolls or writes | none | AR8 | AR8 |

### D4. Knock-on effects (proposals KN1-KN6)

- **KN1 Carry ledger.** Add a boundary `time travel` with rows per TT kind and per world. Generated entities you made saved (recruits, named relics, G11) default to *this life* when carried through a regression; they stay in the saved party only if the kind says the body carries them. Seeds themselves never carry; knowledge of what the seed produced does.
- **KN2 Heirs and continuation.** A heir keeps the instance seed, so the village repeats, and inherits the delta log's summary (grave, obligations) as already defined. A fresh-life branch asks the world: same instance (default) or a new one. Continuation snapshots must include `world.instances` and `timeDeltas` (extend `continuation_state.js`).
- **KN3 Clocks.** Schedules are data keyed by `dayIndex`; deadlines come only from in-world sources. Generated-people `arrivedAt` becomes a key-derived slot instead of creation-time minute arithmetic (`generated_people.js:32`), so offline and played days agree (TI6).
- **KN4 Return note.** The return recap lists deltas, not generated rolls: "a traveler named X came and left", "you took the lantern". On a rewind it also states what stayed because of the carrier.
- **KN5 Frozen worlds.** Frozen worlds keep their instance, seed, `dayIndex` and deltas untouched; no draws occur while frozen.
- **KN6 Exploit limits (AD22, adjectives).** Repeat days give the *same* offers, so profit comes from knowledge, not rerolls. Limits come from: how scarce the carrier is, how quickly saturation recovers, how responsive the world is (an NPC who remembers odd behaviour is a fact, not a reseed), and how heavy the cost is in time bank. Nothing blocks repeating a day; a world can price it. Save integrity remains the only anti-tamper line.

### D5. Ordered engine changes (smallest first)

| Order | Change | Level | Effort | Done check |
|---|---|---|---|---|
| C1 | `dayIndex(world)` helper and a table of the two clocks (E10) | L1 | 0.5 session | Test: both clocks give the same `dayIndex` on a known day |
| C2 | Pure `generate*` hook for shop stock with world seed and shop id in the key (E8, K3) | L1 | 0.5 | Same seed and day gives identical inventory twice; an unrelated draw between calls changes nothing |
| C3 | `genVersion` per domain plus pack fingerprint recorded, notice on mismatch (E7) | L1 | 0.5-1 | Editing a template without a bump fails a test; Import with a different fingerprint shows the notice |
| C4 | Optional `timeDeltas` slice and shop purchase deltas (E5, SI2) | L2 | 1 | Buy, regenerate the same epoch, offer shows the reduced stack; Save, reload, Export, Import keep the log |
| C5 | Keyed storylet draw `(deck, place, day, slot)` for new saves (E3, K6) | L2 | 1 | Same day repeats the same card; resolved card shows its resolution |
| C6 | Traveler identity keyed by arrival slot with a stable entity id (K1) | L2 | 1-2 | Regenerating week N gives the same traveler; a `met` delta survives a rewind |
| C7 | Finds and loot with `keyed: true` and once-only `found` deltas (K4, SI3) | L2 | 1 | A ditch find is the same on revisit, absent after it is taken, restored by rewind |
| C8 | `world.instances` with reserved instance id; heirs keep, branches get new (E4) | L2 | 1 | Heir sees the same shop; a branch sees a different one |
| C9 | Migrate `start_records` and `relic_generator` seeds through E1 when next edited | L1 each | 0.5 each | Existing start and relic outputs unchanged (byte-identical test) |
| C10 | Entity deltas for killed, recruited, befriended (D2) | L3 | 2-3 | Revisit before and after a death shows both states; recruit not duplicated on the same instance |
| C11 | `time travel` carry-ledger boundary and TT1 rewind outside Frontier (KN1) | L3 | 3+ | A second world rewinds and passes Import |
| C12 | `check:arch` rule: no `Math.random` into state (E11) | L1 | 0.5 | The check fails on a seeded violation |

Each change names its seam (AR14): the RNG service for C1-C3, C5-C9; the save slice for C4, C8; the world registry for C11. Gates per AR16 and AD36.

### D6. More to consider (round 2, additions)

**ACT NOW (done above):** inventory G1-G17; keys K1-K9; engine decisions E1-E12; ordered changes C1-C12; effects KN1-KN6.

**ACCOUNT FOR NOW:**
- **A6. Two traveler generations** (`revision` 1 and 2 in `generated_people.js:15-19`): keep both readers; the keyed rewrite is a third revision, not an edit. L1, 0.5, done: revisions coexist in one test.
- **A7. Real time (G17).** Furnace and export timers use `Date.now`; they must never feed world draws. L1, 0.5, done: grep-based check in C12.
- **A8. Entity id format** is a save-visible contract; fix the grammar now (`kind:scope:slot:n`). L1, 0.5, done: validator rejects other forms.
- **A9. Fact-gated generation** (G5): store the fact hash with each generated day so the "why this differs" line exists (A4). L2, 1, done: a visible line.

**LATER / DELEGATE:**
- **L10. Seeded schedules and roaming for authored NPCs** with the absence-report cards. L2, 2, done: an NPC is in the same place on the same day across a rewind.
- **L11. Per-world dial UI/records** (how fixed, how responsive, how deep the log) in the world pack. L2, 1-2, done: three worlds with different adjectives pass the same hook tests.
- **L12. Double handling** (past self, past ally) as a world-specific mechanism. L3, 2+, done: one world supports a visible past-self encounter with a stated cost.
- **L13. Daily-seed-style fixed instance** for comparing runs (single player, optional). L1, 0.5, done: a start by seed string reproduces day 1 stock.
- **L14. Seed display and edit** in the header (E6). L1, 0.5, done: shown, editable only before the first day.

### D7. Updated top recommendations

1. Make ambient generation (stock, finds, travelers, storylets) keyed by `(world instance, domain, place, day, entity id)` with stable entity ids, and keep cursor draws for player-caused chance only (E1-E3, K1-K9).
2. Put per-instance seed, `genVersion` and pack fingerprint into an additive save slice, with deltas for everything the player changes (E5-E7, C3, C4); begin with C1-C5 on the Village shop and deck.
3. Treat killed, recruited and befriended entities as saved deltas on a regenerable base, so a revisit shows a consistent world and paradox only appears where a time-travel kind chooses it (D2, KN1, C10).
