CHECKPOINT: K4 complete 2026-10-23. Read-only research; only this file written. No code run, no tests, no git. Proposal ranking, not accepted decisions.

# K4: next cheats after system-quests, ranked by cheapest honest implementation

Labels: SHOWN = read in a file this session (path:line). STATED = a doc says it. INFERRED = my reading, unverified.
Codes: C1-C8 candidates, F findings, D decisions, R risks.

## Rules applied

AGENTS.md: default, dial and reason, no absolutes (AD38 things work by how they work); sealed secrets by ID only; no secret truths appear below. All world dials are proposals for Weibao's later call.

## What the card shape is today (SHOWN)

- Card keys: id, family, name, ui, terms, hooks, state, stages, observers, sources (src/cheat_cards.js:2).
- PANELS: status-window, death-menu, anchor-list, system-shop, companion-voice, simulator, simulator-foresight, appraisal-lens, harvest-ledger, harvest-multiplier-ledger, cheat-library, cheat-settings, quiet (cheat_cards.js:3-4).
- card.state is a free JSON object; only `awakened` (boolean) and `points` (safe integer) are typed (cheat_cards.js:37-41). Every other key is unvalidated, so each new card must add its own typed check (AB9 pressure).
- Held cards live in `state.held[id]` as {card, messages, route, at} inside one `{schema:1, held, known}` envelope (cheat_cards.js:48-54). There is no holder field: held is the player's. An NPC-held card has no home yet (F1).
- `hooks` exists but the system-quests card ships `hooks: []` and granting runs nothing (cheat_cards.js:1, 82). No hook runner exists (STATED by the C0 comment, SHOWN empty). Only one consumer: status_window.js:8 reading `cheats` via main.js:9757.
- Awakening is a milestone predicate in awakenCheats (cheat_cards.js:94), called from main.js:406. That is AB6's only user.
- Save: main.js:6529 writes `save_data.cheats`, loads at main.js:627 and 6651.

## F-findings that shape the ranking

- F1 (SHOWN, cheat_cards.js:52-60 plus simulation_contracts.js:217): player cards have a home; NPC-held cards do not. The simulation state already has `powers`, `faculties`, `knowledge` per person (simulation_contracts.js:217). An enemy card should live there as a `card` reference, not in `state.held` (INFERRED).
- F2 (SHOWN, seeded_streams.js:46): every random receipt already carries `via:null, orig:null`. Nothing writes them today (grep found only that line). A roll override has a ready audit field. Peek is cheap too: `unitDecision` (seeded_streams.js:42) is pure, while `keyedUnit` and `drawUnit` call `remember` and mutate (seeded_streams.js:65-72).
- F3 (SHOWN, harvest.js:95-104): `observeCarcass` already stores an Observation {at, skill, ageEstimate{min,max}, freshness band, integrity band}. That is AB2 with range, grade-by-skill and freshness, with no cheat involved.
- F4 (SHOWN, craft_failure_ledger.js:58): `forecastFromLedger` returns verdict untried | near | known-fail with reasons and residue. It is a retained-reading forecast, matching the corrected II2 rule (STATED CHEAT_LIBRARY.md:1448).
- F5 (SHOWN, away_ledger.js:6): `computeAway` is pure, takes capMinutes, barriers, overflow 'drop' | 'bank' and bankedMinutes, and returns stoppedBy. Its own comment: banked minutes are credit, not spent. The Patient Furnace card needs almost nothing new in the maths.
- F6 (SHOWN, carry_ledger.js:31 plus obligations_ledger.js:36,48,54 plus heir_inheritance.js:78): what crosses death is already a data table per world with scopes, debts carry via `carries`, and `deriveHeirLeftovers` computes it. An Heirloom card is a modifier on rows, not a new system.
- F7 (SHOWN, harvest.js:53): `setHarvestRoutine` is an existing automation with target, completed, status. Earned Habit would gate it, not build it.
- F8 (SHOWN, pursuit.js:114): `pursuitContact` decides contact from location and life state only. A rival card can be a tell-and-counter layered on contact, not a new pursuit system.

## Ranking (cheapest honest first)

### C1. True Appraisal (library SH4, info). Mine: none; from library

- Does: your eye turns a vague reading of a carcass or item (a range) into a tighter or exact one, grade by grade, and shows how old the reading is.
- Rides on: harvest.js:95 `observeCarcass` (ranges and freshness bands) and harvest.js:23 `harvestGrade` for the true value; people_knowledge.js:12 `knownPeopleView` for the same pattern on people (witnessed content only, never hidden state).
- card.state: `{lens:{domains:['carcass'],grade:1,range:'room'},readings:{[factKey]:{value,at,grade,cause}},uses:0}`. Readings are retained values with time and cause, never live reads (STATED CHEAT_LIBRARY.md:1448).
- Panel: `appraisal-lens`.
- Second consumer: the status window is the first reader of facts; this is the second reader of the same fact adapter, with a grade axis and freshness. That is the honest AB1-AB4 pair (STATED rule of two, CHEAT_LIBRARY.md:1411-1413: AB1-AB4 need stage 1 plus SH4). The carcass Observation already exists, so there is no new world fact.
- Failure scenario: carcass inspected at grade 1, then the carcass spoils. The lens must show the old reading with "as of" and not silently update; a save then reload must show identical readings; an exact value must never appear below its grade.
- Dial: default grade 1 gives the existing ranges narrowed one step; dial to exact at high grade or to nothing in worlds where eyes are blinded; reason and cost: reading strains the eye (cost in minutes or Qi per reading), counter: a veiled item reads as its veil.

### C2. Fate Ledger (SH1, info with a mechanical edge)

- Does: shows the next few rolls of one stream (loot, say) as results you can plan around, never all streams.
- Rides on: seeded_streams.js:42 `unitDecision` (pure peek, no cursor move) with the stream cursor from `nextOrdinal` (seeded_streams.js:59). Hits only one named stream from the STREAMS table (seeded_streams.js:6).
- card.state: `{stream:'loot',window:3,peeked:{[n]:{u,at}},charges:0,spent:0}`.
- Panel: `simulator-foresight`.
- Second consumer: AB7 named random stream with peek (STATED "waits for its second user", CHEAT_LIBRARY.md:1413). C3 (Loaded Dice) is the second user of the same seam, so C2 and C3 together satisfy AB7 honestly.
- Failure scenario: peeking must not advance the cursor (SHOWN risk: keyedUnit and drawUnit call `remember`, seeded_streams.js:65-72, so using them for a peek would write receipts). Test: peek three, roll three, rolls equal peek, receipts equal; save/reload mid-window keeps the same values. STATED caution: "same seed, same fights" is stronger than the stream guarantees (CHEAT_LIBRARY.md:1450), so compare receipts, not seeds.
- Dial: default window 1 to 3 rolls of one stream; dial to "shape only" (good/bad) in rough worlds; reason and cost: foresight spends a charge and the world's luck rebalances (the card's own limit, STATED card 10), or fate-readers notice you.

### C3. Loaded Dice (library card 10, mechanical)

- Does: once in a while you call a result instead of rolling, and you pay for it.
- Rides on: seeded_streams.js:74 `rollChance` and `rollInt` (seeded_streams.js:78) returning receipts, with `via` and `orig` (seeded_streams.js:46) recording that a roll was overridden and what it would have been. Cheat code has so far drawn no randomness (STATED TE, CHEAT_LIBRARY.md:1444); this keeps that true, since an override replaces a roll's value and does not draw a new one.
- card.state: `{charges:2,maxCharges:2,costRung:0,calls:[{receiptId,orig,via:'loaded-dice',at}],balanceDebt:0}`. Cost rung rises per use; balanceDebt is the later luck swing.
- Panel: `system-shop` is wrong for this; use `quiet` with a call button in the card list (INFERRED; no panel kind fits, flagged as gap G1).
- Second consumer: AB7 (with C2). Also AB5 Event: each call emits one provenance-tagged line (first user would be system lines from system-quests; this is a second). AB9: a card with typed charges needs its own state version and quarantine (cheat_cards.js:37-41 validates only two keys).
- Failure scenario: override applied, game saved, reloaded, roll replays: the overridden value must still win via the receipt, and a plain reload must not give a free second charge. Spam test: third call in one fight costs more than the first; with zero charges the call is refused, not queued. Determinism test: same seed with no call yields the original roll `orig`.
- Dial: default charges 1 to 3 per long period (an adjective, not "once"); rising cost; luck balances later (balanceDebt applies a small negative bias to the same stream); reason: a coin that is warm after use (STATED small touch), and luck readers can see too many perfect rolls.

### C4. Earned Habit (library card 8, mechanical automation)

- Does: a task you have done enough times starts doing itself while you do something else.
- Rides on: harvest.js:53 `setHarvestRoutine` plus `pauseHarvestRoutine` and `cancelHarvestRoutine` (harvest.js:58-60); harvest ledger panel already exists.
- card.state: `{habits:{[taskId]:{reps:0,threshold:30,learned:false,adaptsTo:'rat-harvest',lastAt:0}}}`.
- Panel: `harvest-ledger`.
- Second consumer: AB6 milestone predicate on committed state with a non-day clock (reps counted, not days); that is a real second user next to day-3 awakening (cheat_cards.js:94). AB5 for the "chores were done" return note.
- Failure scenario: a habit learned on wolf-rat carcasses must refuse an unfamiliar species (supportedHarvest, harvest.js:10, only five species), and must not run when the player's current job is busy (harvest.js:55 throws); reload during a routine must not double count reps.
- Dial: default threshold in tens of repeats, per task family; dial lower for prodigies, higher for coarse work; reason and cost: bad habits also learn (STATED card 8) and a habit cannot adapt to something new.

### C5. Patient Furnace (library card 2, economic and recovery)

- Does: while you are away, the method keeps working and banks gains, and the return note says what stopped it.
- Rides on: away_ledger.js:6 `computeAway` with capMinutes, barriers, overflow 'bank' and bankedMinutes (F5). The result's `stoppedBy` is already the "why it stopped" the card asks for (STATED CHEAT_LIBRARY.md:437 "return note names what stopped it").
- card.state: `{fuel:0,fuelPerHour:1,bankedMinutes:0,cap:1440,lastSeen:0,remainderMs:0,note:null}`. Fuel is a counted stock consumed by computeAway's minutes (INFERRED; fuel is not in computeAway today, so it is a wrapper that adds a barrier at fuel end).
- Panel: none fits well. `quiet` plus an away note message via `recordCheatMessage` (cheat_cards.js:75) is the cheapest (gap G1).
- Second consumer: AB5 (return-note event) and AB6 (a return/idle-return milestone is a named second clock source, STATED CI7 return clocks, CHEAT_LIBRARY.md:1394). Not a third reader of AB1.
- Failure scenario: clock set backward (computeAway returns stoppedBy 'clock-back', SHOWN away_ledger.js:25), cap overflow with 'drop' versus 'bank', and an unguarded sleeper event barrier. Test: gains never exceed cap; fuel runs out on day two and the note names it.
- Dial: default cap hours, fuel required, no social or new actions during absence; dial to age while it runs or bank stored hours; reason and cost: whoever guards your body, and an unguarded furnace is a target (STATED card 2).

### C6. Traveler's Pattern Book (card 4, craft memory)

- Does: keeps designs and failed attempts so a recipe you tried is not retried blind, and shows exactly what is missing.
- Rides on: craft_failure_ledger.js:36 `recordBatchAttempt` and :58 `forecastFromLedger`; ledger family 'craft.failures@1' with MAX_PAIRS 200 and MAX_TRIES_PER_PAIR 12 (craft_failure_ledger.js:9-11). The card adds imported patterns from other worlds, so the new data is a `patterns` map.
- card.state: `{patterns:{[patternId]:{origin:'worldId',needs:['ingredient'],lawsNeeded:['law'],verified:false,note:''}},ledgerRef:'craft.failures@1'}`. Does not copy the ledger; reads it.
- Panel: `simulator` (forecast panel).
- Second consumer: AB10 reuse of an existing record type (ledger) instead of a duplicate, plus AB1 facts with a spoiler class (a pattern whose verdict hides until tested). It is the weakest AB1 claim; mark as thin.
- Failure scenario: a pattern from another world needs a law that does not exist here; the forecast must say "missing law X", not "fail". Corrupt pattern entry must quarantine inertly with a reason, not reset (STATED FR3 correction, CHEAT_LIBRARY.md:1449).
- Dial: default imports a design only (not materials or skill); dial to wrong copies or a prodigy copier; reason and cost: copies can be wrong, and guilds and thieves want the book (STATED card 4).

### C7. Rehearsed Foe (rival-held Echo Anchor; ENEMY side; mine as a thin slice of library card 1's enemy version)

- Does: a rival who has fought you before predicts your opening move, so the first exchange goes worse for you, and you can see the tell.
- Rides on: pursuit.js:114 `pursuitContact` (contact decision), simulation_contracts.js:64 knowledge stages seen | interpreted | understood (what the rival has learned about you, with a basis), simulation_contracts.js:217 `powers` per person (the holder's card home, per F1). Read side: people_knowledge.js:12 shows only witnessed content.
- Card (holder-side): `{holder:'actorId',loop:{rehearsals:0,remembers:{[playerActionKey]:'seen'|'interpreted'|'understood'},scar:0},policy:{usesAt:'first-contact',retreat:'at-scar-3'}}`. The `holder` key is new (D1).
- Panel (player-visible side): `quiet` until the player learns its tell; then a line in the existing people view (no count, no name before discovery route; STATED silhouettes conflict, CHEAT_LIBRARY.md:1451).
- Second consumer: same card shape on the holder side tests that `hooks`, `state`, `observers` work with the card outside `state.held`. Real second user of AB2 (observation of the player by an NPC with grade and version) and AB10 (recurring actor).
- Failure scenario: player reads the foe's rehearsal state without having earned it: must be a leak failure (sealed by ID). Reload mid-fight: rival decisions use the seeded stream (STATED "enemy cheat decisions use seeded RNG", CHEAT_LIBRARY.md:379), same result. The player's counter (change opening) must break the prediction.
- Dial: default one rehearsed exchange per rival per period; dial from "knows your habits" to "knows your move"; reason and cost: rival keeps a scar per loop and cannot predict an unseen technique; a pursued player who leaves the zone resets contact (pursuitContact requires same location, pursuit.js:116).

### C8. Heirloom Compact (card 3, recovery and economic)

- Does: you name what your heir gets from this life, and creditors and enemies inherit too.
- Rides on: carry_ledger.js:31 `carryLedger` rows (what crosses death), heir_inheritance.js:78 `deriveHeirLeftovers`, obligations_ledger.js:54 `carriedObligations` (debts that carry).
- card.state: `{bequests:[{rowRef:'death:coins',scope:'last life',carrier:'vault',claimable:true}],heir:null,disputes:[]}`. The carrier is mandatory for each row (STATED card 3).
- Panel: `death-menu`.
- Second consumer: AB10 (reuse of office/record types) and AB9 (state version/migration, since persistence changes need a migration or compatibility decision, AGENTS.md Safety). Heaviest persistence surface, so it ranks last.
- Failure scenario: a bequest names a row that world rules mark 'drops'; the card must refuse with a reason, never overwrite world law (PARADISE rule: only memory and base cheat survive, carry_ledger.js:20-24). Credit debt: estate settles Village kit debt first (carry_ledger.js:14).
- Dial: default exactly the existing rows' carry scopes; dial up in worlds with strong succession law, down in worlds where nothing crosses without a carrier; reason and cost: heirs are different people with different builds; creditors and old enemies also inherit.

## Type coverage check (requirement)

| Candidate | Kind | Holder |
| --- | --- | --- |
| C1, C2, C6 | information | player |
| C3 | mechanical (roll override) | player |
| C4 | mechanical (automation) | player |
| C5 | economic and recovery (offline) | player |
| C8 | recovery and economic (succession) | player |
| C7 | enemy-held | rival |

Non-information: C3, C4, C5, C8 (four). Enemy-held: C7. Mine versus library: C1, C2, C3, C4, C5, C6, C8 are library cards (SH4, SH1, card 10, card 8, card 2, card 4, card 3). C7 is my slice of library card 1's STATED enemy version ("a rival who remembers the fight you've only had once", CHEAT_LIBRARY.md:420). No comic CK card chosen, because CK needs comic-world scaffolding that does not exist (INFERRED).

## Build order of three

1. **C1 True Appraisal. This one makes card 2.** It is the cheapest, adds no new world fact, and is the second reader of facts beside the status window, so AB1-AB4 get their honest rule-of-two pair. It also forces the first typed state for a card (readings) and the first non-status panel kind (`appraisal-lens`).
2. **C3 Loaded Dice. This one proves the module boundary.** It is the only candidate that must change a game outcome from a card. The boundary is: `cheat_cards.js` stays pure data and validation (it imports nothing from game modules, SHOWN: the file has no imports); a host adapter calls the stream and writes `via` and `orig` on the receipt (seeded_streams.js:46). If the dice work without cheat_cards importing seeded_streams, the card module is separate from the engine. If it needs an import, the boundary has failed and we learn that cheaply. C2 Fate Ledger is the natural follow-up on the same seam and makes AB7 a true two-user abstraction.
3. **C7 Rehearsed Foe. This one tests the shape on the other side.** Only an NPC-held card exposes the missing `holder` field (F1) and checks that nothing in the card format assumes the player. Ranked 7th by cost, but the audit asks that both sides are tested; build only the thin slice (one rival, one rehearsed exchange, one tell) before more rival cards.

Why not C4/C5 third: both are cheaper than C7, but they add a player-side consumer of a pattern the first two already cover; neither tests a new side of the card shape. Pick C5 as the fourth build.

## Decisions and risks to record

- D1 (proposal): add `holder` to the card envelope or keep NPC cards under `simulation.powers[actorId]`. INFERRED: the latter avoids a save-schema change for player cards. Needs Weibao's call only if it touches persistence (AGENTS.md Safety: migration or explicit compatibility decision).
- D2 (proposal): add typed validators per card id for `state` instead of the free object (cheat_cards.js:37-41), so unknown keys cannot ride through (AB9).
- R1: a hook runner does not exist (hooks `[]`). C3, C4, C5 and C7 each need one. Build one runner for C3 and have C4/C5 reuse it, or the rule of two on hooks fails.
- R2: `keyedUnit` and `drawUnit` mutate (seeded_streams.js:65-72). C2 must use `unitDecision` directly.
- G1: no panel kind for "action list without a panel" or "away note". Either reuse `quiet` plus messages or add a PANELS entry; a new entry is a change to cheat_cards.js and needs the same lane's tests.
- R3: sealed secrets. None of these cards needs a world's secret truth; any bound world dial referencing one should use its ID only.

## What is not verified

No test run, no code executed, no game opened. Line numbers are from files as they exist in the working tree today (many files are modified uncommitted per git status; lines may shift). AB rule-of-two judgments are INFERRED from CHEAT_LIBRARY.md:1409-1415 and the corrections at :1446-1452, not from running code. The comic CK cards were read as a table only.
