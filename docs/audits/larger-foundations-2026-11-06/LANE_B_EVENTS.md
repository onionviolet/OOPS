# Lane B: FD16 event director, reconcile and deepen (2026-11-06)

Root doc: [LARGER_FOUNDATIONS](../LARGER_FOUNDATIONS_2026-11-06.md#fd16-event-director-random-and-not-so-random). Weibao, 2026-11-06: "what about larger foundational and modularity that would be useful? from little stuff like random or not so random events..." He wants each idea in depth, working backwards from the playable outcome.

Everything here is a proposal (AD32). Nothing is accepted, dispatched or built. Labels: **shown** = read in a file at the cited line; **stated** = an owner doc says it; **inferred** = my reading, unverified. Snapshot master `d001a2f9a` plus a dirty tree; read by grep and partial reads, no runtime run, no code changed. LOTM event contents live in the private pack and are named here only by kind and ID. Codes are local to this file (LB-prefix) to avoid the registered prefixes.

## 1. Reconcile

### 1.1 The root doc undercounts the sources (LB-F1)

The root doc says FD16 merges "three sources that already exist apart". The code has at least nine independent emitters. Only the first three were named.

| # | Emitter | Owner and evidence | Reaches the player through |
|---|---|---|---|
| 1 | Weighted storylet cards, four decks | `storylet_deck.js` (shown, :5-8 decks, :64 tick, :70 draw) | storylet panel, `event_feed` simulation leads |
| 2 | Dated world-event book (anchors, spread, restrictions) | `world_events.js` (shown, :6 kinds, :21 placement, :90 `learnedDay`) | LOTM host `settleLotmEvents` into Reports |
| 3 | Consequence cards inside the deck | `story_aftermath.js` `AFTERMATH_ID` (shown, :4), bound at `storyletCandidates` | the same panel |
| 4 | Second dated-event path, `WORLD_DAY_EVENTS` | `world_calendar.js` `worldDayNews` (shown, :147) | `event_feed.js:94` news rows |
| 5 | Legacy per-definition checks with `chance`/`guaranteeAfter` | stated: E5 V1-V5 (`docs/emergent/E5_STORYTELLER_AND_FATE.md:21-40`, citing `simulation.js:64`, `:484-495`; not re-read) | simulation events, chronicle |
| 6 | Chronicle invitations with missed-then-heard reports | `event_feed.js:14-20` (shown) | leads and `heard` list |
| 7 | Household year scans (death, coming of age, quarrels) | `life_events.js` `scan` (shown, :72); quarrel odds `quarrelPermille` (:10) | household panel |
| 8 | Daily market rumour, at most one a day | `economy_standing.js` `drawRumour` (shown, :302) | economy standing view |
| 9 | Pursuit contacts | `event_feed.js` pursuit loop (shown); `ENCOUNTERS_AND_PURSUIT.md` | leads |

Plus one consequence source with no event writer: `owed_ledger_view.js` projects who owes whom and when it is due, read-only (shown, header). `obligations_ledger.js` rows exist; nothing turns a due row into an occurrence.

### 1.2 Overlap classification

| Pair | Class | Why | Action |
|---|---|---|---|
| `world_events` vs `world_calendar` day events | **Compatible variant, incomplete integration** | Both are "dated happening plus news". `world_events` has anchors, spread routes, presence and restrictions (shown). `WORLD_DAY_EVENTS` has text, a date basis and a locator, and feeds `event_feed` directly (shown, `world_calendar.js:147`). Two schemas, two readers, no shared id space. Which worlds use which: inferred, `event_feed.js:94` reads `WORLD_DAY_EVENTS` per `worldId`, LOTM reads the book. | One row shape (section 3.5); `WORLD_DAY_EVENTS` becomes a thin loader onto the book. Check overlap before migrating (LB-Q1). |
| FD16 "one picker" vs E5 "director decides when, not what" | **Compatible variant** once layered | E5 R10: the director changes weights and rates only, no effect list (stated, E5:313-349 table). FD16 as worded merges canon and draws into one picker, which reads as the director writing events. Resolved by the three layers in section 3.1: calendar occupancy is scheduled, never weighted; the draw fills gaps; the tempo only scales the draw. | Adopt E5 R10 as the boundary. |
| FD16 vs `docs/emergent/E2_STORYLETS.md` (card schema, urgency tiers, casting) | **Duplicate, partly delivered** | E2 section 3 gives the full card schema (`needs`, `cast`, `weight`, `cooldown`, `urgency`, `blocks`, `fallback`, `hint`, `receipt`). P3 built 14 Village cards on a subset (stated, E2:11-25; `storylet_content.js` `card()` shown). Not delivered: casting, `blocks` scoping, fallback ladder, tags, `hint` (stated, E2:11-25 and X1-X6). | FD16 adopts the E2 schema as its row shape. It does not invent a second one. |
| FD16 vs E5 tension and comfort, fairness R1-R10, personalities | **Incomplete integration** | E5 is a full draft, never built. `seeded_streams.js:13` already reserves the stream families `director` and `fate` (shown). The deck's only pacing today is `STORYLET_TEMPERS` (calm 3, usual 1, lively .3) scaling the null weight (shown, :11, :70). | Build E5 step 0 and the per-world defaults table (E5:296-311) as FD16's pacing layer. |
| Root doc K32 "tension rhythm" vs E5 tension T | **Duplicate** | K32 (kit row :638) is the one-line version of E5 section 3. | Cite E5; K32 stays the checklist row. |
| K12 canon clock and abstention vs `world_events` | **Compatible variant** | K12.1 "what happens if you are not there" (stated, kit :248-250). `world_events` has `present`, `spread` and `learnedDay`, so abstention is expressible as late hearing (shown, :90-112). It lacks substitutes (K12.2) and divergence (K12.5). | Extend, not replace. |
| `COSMIC_EVENTS` omen ladder vs FD18 "change an event" channel | **Compatible variant** | The ladder (stated, COSMIC:36-54) is the spoiler-safe presentation of any threat that is coming. | Section 3.7 reuses the first four rungs for all events, not just gods. |
| `CHARACTERS_AND_WORLD_EVENTS` "occurrence, discovery, response, aftermath" | **Duplicate, and the right frame** | Stated, :208-242: record an occurrence once, reveal it by witnessing, report or investigation. `world_events` implements occurrence plus discovery (shown). | FD16 adopts the four-stage split as its lifecycle. |
| `NEXT_EVENT_PROPOSAL` broken crossing | **Stale as a gate, live as a palette** | B242 reconciliation (stated, :23-39 area): it does not outrank Klein or Harry and selects no permanent death. | Use as one worked row, not a first build. |
| `RNG_ENCOUNTERS` Oct 2 audit | **Stale input** | Stated, B145 reconciliation: it describes 2026-10-02, not a present census. | Use its principles (chance vs unknown information, reload does not reroll). |
| `PROCEDURAL_STORY` palette (sections A-AF) | **Palette, no conflict** | Stated "a palette, not a spec". | Mine for row families (section 2). |
| AD2, AD25, AD50 | **No disagreement** | AD2 canon follows its course unless disturbed; AD25 threats from actual causes; AD50 a run-ending threat has at least two authored exits and a capable character may turn it (all stated, RULES_INDEX:161, :209, :264). | These constrain weights: no event aims at the player without a cause. |

**Genuine disagreements: none found.** The closest is a wording gap: the root doc says "one picker" and E5 R10 says the director never writes events. Layering removes it. If Weibao wants a director that injects events, E5 already allows it as a fate or world instance, not as the default (stated, E5:58-62).

### 1.3 The deck is locked to one world, and lifting it touches saves (LB-F2)

All shown:
- `storylet_deck.js:67`: the tick returns early unless `worldId==='base.frontier'` and the player is in `Village`.
- `:99`: the validator asserts every card id starts with `village.`.
- `:92`: it asserts the deck count equals the four registered decks.
- `:21`: saved decks carry `storyletSchema=1` with fields `due, interval, rng, ticks, drawn, nulls, cards, miss, lastFamily, receipts`.
- `:14`: it only runs after the opt-in fact `storylets.enabled`.

So "lift the Village deck" is a schema 2 with a migration, not a refactor. By AGENTS.md safety this needs a compatibility decision recorded before code. Default I would propose: schema 2 keeps the four Village decks byte-identical and adds decks keyed `<world>.<name>` with a per-world gate field replacing the hard-coded test.

### 1.4 Determinism state (LB-F3)

- `drawUnit` (shown, `seeded_streams.js:70`) uses per-stream ordinals plus a receipt log. The deck draws with key `tick:${record.ticks}` (shown, `:70` of the deck), and the due check is `record.due>state.clock` (shown, :64) with "never turn absence into retroactive draws" (shown, :63).
- GR17 says draws are keyed by the owning clock and segmented catch-up retains the same draws (stated, GENERATION_FOUNDATION_RULES row GR17). Whether stepping the clock in different chunks changes `ticks` and so the draws is **unverified**: the tick count rises once per due deck, but the due time jumps by `interval` from `state.clock`, not from the old `due`. If a long step lands later than `due`, ticks drift versus a fine-grained run. Test it with a seed sweep before FD16 relies on replay (GR16 asks for it anyway, stated).
- Two paths coexist in the deck: legacy `xorshift32` on `record.rng` and the named stream when `randomSource==='named'` (shown, :18 and :70). `life_events.js:23` hashes with `fnv1a` outside the stream receipts (shown). `drawRumour` takes its own `seed` argument (shown, :302). So there are at least three RNG idioms behind "events". FD16 picks the named stream with GR2 addressing for new rows and leaves the others alone until they move.

### 1.5 Presentation state

`event_feed.js` is already the display merge point: one function folds chronicle, opportunities, simulation events, knowledge, pursuits, receipts and day news into leads plus news (shown, :6-100). It is read-only ("No rolls, rewards, enrollment or save fields", shown, :2). It is not a picker, and several lead rows hard-code `locations:["Village"]` (shown, :15, :20). Its "Never project the global simulation log" guard (shown, :38) is the spoiler gate FD16 must keep.

### 1.6 What the first consumers actually look like

- Village: deck plus chronicle plus household scans (shown). Rich, one world.
- LOTM: the dated book only, behind `LOTM_LEAD_CHANNELS` = newspaper, notice_board, word (shown, `book_world_lotm_events.js:12`). First run does not backfill days before the lead arrived (shown, :33). No weighted draw. A quiet Tingen evening produces nothing unless a dated event lands. This is the biggest felt gap for Klein.
- HP: imports `world_calendar` (shown by grep, `book_world_hp_lead_domain.js`); no deck. No school calendar events were verified.

## 2. Deepen backwards: six outcomes

For each: what the player sees, then back through state, owner and gap.

### O1. A quiet Tingen evening gives Klein a small, plausible happening tied to his job

Sees: after the shift, a line in Reports: "The clerk at the next desk is eating alone and the lamp on the stair is out." Maybe a one-tap response, maybe none.
- State needed: his position and shift slot (lane A, inferred), place, hour, weather, knowledge of the coworker, last non-daily event time.
- Owner today: none. LOTM has dated events only (shown, 1.6). Micro-texture is described in the kit as KM micro rows "generated, rotated, gated by noticing" (stated, kit KM-a/KM-h) and has no deck.
- Gap: a Tingen daily deck (rows tagged `daily`, `job.clerk`), a per-world gate, and a position-tag weight input. Costs nothing if the row is ambient (mode `ambient`, no panel, shown in `card()`).

### O2. A debt you ignored comes due as a visit

Sees: a knock; the creditor or an agent stands at the door, with options that match what you can pay (coin, favour, work, flight).
- State: an obligation row with a due day and a holder (`obligations_ledger.js`, `owed_ledger_sources.js` shown by header); the creditor's location and temper (cast schedule, `cast_schedule.js`); law of the small for what a creditor may do (K24, stated; `law_case.js` has 0 importers, root doc).
- Owner today: read-only projection only (shown, `owed_ledger_view.js` header "writes nothing").
- Gap (LB-F4): a **consequence writer**: a rule "when `due <= today` and the debtor has not settled, open event row `consequence.debt_due@<id>` with the creditor cast". It is a row source, not a new system. Failure to prevent is the abstention outcome: the row fires with the harsh branch if you are away, with the gentle branch pre-chosen by a standing order if you set one (E2 standing orders, stated).

### O3. A canon event fires on its date while you are elsewhere, and you hear late

Sees: days later, a notice-board line or a coworker's remark: "There was a fire on Daffodil Street." Present if you were there.
- State: event window, place, `spread` routes with delay, who holds which channel (shown, `world_events.js:90-112`).
- Owner today: `world_events` plus `eventKnowledgeWrites` (shown). This works for LOTM. It is the best-built part.
- Gaps: (a) substitutes when a canon actor is gone (K12.2, stated, not found in code); (b) divergence visible (K12.5); (c) abstention effects beyond news, such as a closed street (restrictions exist, shown, `restrictionsOn`); (d) the first-run no-backfill rule means a late-joining lead never hears of earlier days (shown, :33, deliberate default, dial it per world).

### O4. Harry gets stared at because of fame

Sees: on the first morning in a corridor, a one-line scene: heads turn, a younger student whispers. Chosen verbs: nod, ignore, lean in.
- State: notoriety as a number or tag held by observers who know the fact "who you are" (K29/K31, stated; FD10 `people_knowledge`).
- Owner today: `persona_standing.js` has `standingOf`, `attitudeOf`, `expose` with a `notice` roll (shown, header and exports). It is region standing for personas, not "recognised by this crowd". No HP deck exists.
- Gap: a weight input `notoriety@place` and a crowd cast spec (E2 section 6 casting, stated, unbuilt), plus a row family `recognition` that fires on **entering** a place rather than on a timer.

### O5. A village festival season

Sees: for ten days, the square fills with stalls, normal rows swap (shop hours, a dance row, a quarrel row), then it ends with a news line.
- State: a dated window with a **season modifier** that reweights decks for its duration, plus shop and curfew restrictions.
- Owner today: `world_events` kind `festival` exists (shown, :6) and `restrictionsOn` handles closure. Weather and season live in `weather_calendar.js` and `world_climate.js` (exist by name; contents not read).
- Gap: a window carries `modifiers: [{tag, mult}]` read by the draw. Today a window carries `effects` of kinds curfew, closure, travel_halt only (shown, :62-72), so weights are an addition to the effect kinds, not a new system.

### O6. A rumour about you spreads

Sees: three days after a public act, a stranger already knows a garbled version; a shopkeeper's price changes.
- State: a fact with a spread, per-listener channel and distortion; trust of the carrier (shown: `economy_standing` `lieRate` 0.25 and "one rumour in four is invented or garbled", `:34`).
- Owner today: two halves. `economy_standing` draws market rumours about prices (shown, :302). `world_events` has spread routes with carrier delay (shown, :90). Nothing spreads a rumour **about the player**.
- Gap (LB-F5): a rumour is an occurrence row whose subject is the player's act, `scope: private` with carriers, learned by NPCs by `learnedDay`. The listener's reaction is an `observer` weight input and a `recognition` row. The two existing halves compose: spread from `world_events`, distortion from `economy_standing`.

## 3. Specification (proposal)

### 3.1 Three layers

1. **Calendar occupancy.** Dated, anchored and ordinal events from the book. Never weighted, never rerolled. A canon beat occupies a window; the world runs it whether you are there (AD2).
2. **Consequence rows.** Due obligations, rippling acts (K29), rumours, missed duties (FD8), aftermath (`story_aftermath`). Triggered by state, deterministic given state, no draw. Consequences are not luck.
3. **Gap draw.** Weighted cards fill the quiet between. One draw per deck tick, with a null weight. This is what storylets do today (shown).

Tempo (E5) only scales layer 3. The director has no effect list (E5 R10, stated). Layers 1 and 2 ignore tempo, except that tempo can decide whether a consequence arrives with a quiet-breaker nudge (see 3.4).

### 3.2 Merge

A single **event registry** holds rows from every source. Sources stay owners of their rows; the registry only indexes by `id`, `layer`, `world`, `place`, `tags`. The picker for a place and hour asks: what does layer 1 occupy, what does layer 2 owe, then run the draw over layer 3 candidates minus anything the first two blocked. This is a merge of **queries**, not of save data. `event_feed.js` stays the display merge.

### 3.3 Weighting inputs

Each is a fact or tag a row's `weight.plus` can read (the shape the deck already uses, shown, `storylet_deck.js:42-45`, `meets(plus.when, facts)`).

| Input | Read from | Status |
|---|---|---|
| place and hour | `actor.location`, `day.hour` (shown, `storyletFacts`) | exists |
| season, weather | `weather_calendar`, `weather.damp` fact (shown, a card uses it) | partial |
| position tags (clerk, pupil, soldier, contractor) | lane A positions (inferred, interface below) | needs lane A |
| notoriety at the place | `persona_standing`, a crowd-level read | gap |
| who knows what | `people_knowledge`, FD10 | exists as module, not read by decks |
| tension and comfort | E5 section 3 | unbuilt |
| recent events | `cards` and `miss` per deck (shown) | exists per card |
| duty slots | FD8 `recurring_duties` / `world_rhythm` windows (shown, `dutyState`) | exists, not read |
| temper dial | `STORYLET_TEMPERS` (shown) | exists |

Weights are integers with top contributors saved (GR9, stated); the deck already saves the top three (shown, receipt `weights`).

### 3.4 Determinism and save replay

- New rows draw from the named stream: `scopedStream('deck:<id>', worldId)` and key `tick:<n>` (the deck's current idiom, shown). `deck`, `director`, `fate` families already exist (shown, `seeded_streams.js:13`).
- Draws are addressed, not counted: per GR2 and GR17 the key includes the owning world clock day and the slot, so catching up in different segments gives the same draws. Before shipping, run the GR16 seed sweep, including different step sizes (see 1.4).
- Freeze on reveal (GR3): once a card is drawn and shown, save the receipt and the text slots, not the seed.
- Absence never turns into retroactive draws (shown, `:63`); keep this. It is the replay-safe default, and a dial can allow a **summary** on return ("while you were away", `return_digest.js` exists by name) that reads consequence rows and canon, never new draws.
- Layer 1 and 2 events are pure functions of the book and state, so they replay with no cursor.
- A skipped or null draw consumes its roll (E5 R7, stated) so later results do not shift.

### 3.5 Authoring shape of an event row

Adopt E2's card schema (stated, E2:118-154) and add the layer fields. Required first slice in bold.

```
{ id, rev, world, layer: calendar|consequence|draw, deck,
  tags[1..6], family,
  **needs** (meets rule), place?, hours?, anchor?|when?,
  weight:{base, plus[]}, cooldown:{self, cast}, once,
  urgency: ambient|soft|hard|crisis, blocks, timeout,
  cast:{role: spec}, text with #slots#, choices[], onIgnore, fallback,
  spread:[{route, delayDays}], scope: public|private,
  modifiers?:[{tag, mult}],          // season rows only
  hint, receipt }
```

Rules that follow from owners: text lives in the pack by `lineKey`, so private books stay private (RPT10, stated in `world_events.js` header); every fact the row writes is listed in `sets` (E2, stated); AD50 exits for any row that can end a run; no row requires the player (AD24).

### 3.6 Density dials

Per world (default, dial, reason; AGENTS.md framing):
- Deck `interval` and `quiet` weight, today fixed per deck in code (shown, `STORYLET_DECKS`), become world data.
- Personality default per world from E5 table (stated, E5:296-311): village Gentle, sect or war Wild, academy Tidal, horror Steady with `callback` x2. Reason is the E5 table's own.
- Per life: `STORYLET_TEMPERS` already is a per-life fact (shown, `storylets.temper`), so the shape exists. Add life stage (E5 section 8, stated): a child gets gentler rows.
- Fairness: E5 R1-R6 default on; `off` is a setting and logged (stated, E5:313-349).

Reason: Tingen's feel is slow and dense with detail; Village's is a calm loop. The same engine with different numbers, no code branch.

### 3.7 How the player sees events, without spoilers

- Four stages: occurrence, discovery, response, aftermath (stated, CHARACTERS:208-242). The player learns only at discovery; `event_feed` already refuses to project the unobserved simulation log (shown, :38).
- Surface by weight of the row: `ambient` goes to Reports or the right-hand log; `soft` waits in the events panel; `hard` and `crisis` are decisions (E2 tiers, stated).
- **Omens for anything coming**, not just gods: whispers, signs, a small sign, a sound (COSMIC rungs 1-4, stated). A threat with a cause shows at least one sign before it lands, scaled to what the character perceives (AD6, AD50).
- A "why this" hover reads the saved top weights (shown, receipts). It shows the inputs the character could know, not hidden ones (AD6, GR15 stated).
- Sealed secrets: event rows and receipts reference secrets by ID and route only; the discovery route text is the only place truth shows (AGENTS.md sealed secrets, stated).

### 3.8 NPC-side events

NPCs get the same rows. The deck today is player-scoped (shown, `actorId:'player'` in `card()`); the legacy simulation has controllers for NPCs (stated, E5 V8). Proposal: a row `cast` can name an NPC as `actor`; the occurrence is saved once with all affected actors (stated, COSMIC and CHARACTERS: "occur once, not rerolled per observer"); observers learn by spread. Default: NPC events run at low detail (a count, an outcome) until observed (GR4, P32, stated); the player sees them through `learnedDay`.

### 3.9 Cooldowns and anti-repetition

Already shown in `storyletCandidates`: per-card cooldown, `once`, 0.6 per previous showing (floor 0.1), 0.5 for the same family as the last draw, and a pity multiplier up to x4 from six misses (shown, :45-48). Cap of three open storylet events per deck (shown, :68). Add E5's R4 quiet breaker and R8 90-day damping (stated). Add a **cast cooldown**: the same person is not the subject twice in a short span (E2 `cooldown.cast`, stated, unbuilt).

### 3.10 Composing with lane A (positions) and lane C (encounters)

Their files did not exist when I wrote this; the interface below is inferred, labelled so, and to be replaced by their actual rows.
- **From lane A:** each held position emits tags (`pos.clerk`, `pos.pupil`, `pos.soldier`), a role label, and **duty windows** from FD8. FD16 reads tags as weight inputs. A duty window **blocks** layer 3 draws that conflict with it (a shift, an exam) but not layer 1 or 2. Position events are rows too: pay day, an exam, a posting order are layer 1 (dated or recurring windows) with the position as `needs`.
- **To lane A:** missed duties and a due debt are layer 2 consequences, so the position record needs no event code of its own.
- **From lane C:** an ambush is a `hard` or `crisis` row (E2 tiers) with `cast` for the attackers and, per AD50, at least two exits on different means. The row hands the situation to the encounter frame (FD17) at the moment it resolves; FD16 owns **when and why**, FD17 owns **what happens in contact**. This matches the encounter owner's split: "trigger, locator, scene" (stated, `ENCOUNTERS_AND_PURSUIT.md:5-20`).
- **To lane C:** the encounter's aftermath (injury, loot, a witness) writes facts that become weights, and a rumour row (O6).

### 3.11 Abstention outcomes

Every layer 1 row declares what happens if the player is absent: nothing visible, late news, a closed street, a changed price. This is the K12.1 requirement (stated) and `world_events` already supports `present`, `spread` and restrictions (shown). The layer 2 row declares the unattended branch and whether a standing order handles it (E2, stated).

## 4. More to consider (round 1)

Levels: S small, M medium, L large. Done check is what proves it.

### ACT NOW (done in this doc)

- **N1.** The source count is nine plus one writer gap, not three (section 1.1). Done.
- **N2.** The one-world lock is a schema decision (section 1.3). Done, flagged.
- **N3.** The root doc's "one picker" and E5 R10 are reconciled by three layers (section 3.1). Done.

### ACCOUNT FOR NOW

- **A1. Row shape decided before any code (S).** Adopt E2 section 3 plus the layer fields (3.5). Done check: one row written for each of O1 through O6 validates against one validator and loads into the registry. Protects against a second schema.
- **A2. Determinism sweep before lifting the deck (S to M).** Run GR16 seed sweep over different step sizes on the current Village deck. Done check: same seed, 1-minute steps vs 30-minute steps, same receipts, or a documented drift with a fix (1.4).
- **A3. Deck schema 2 migration plan (M).** Per-world gate, per-world deck list, byte-identical Village decks. Done check: old saves load and replay; save, reload, import (AGENTS.md verification).
- **A4. Debt-due writer (M).** The consequence writer in O2. Done check: an obligation row due on day N opens one event row with the creditor cast; reload does not duplicate it.
- **A5. Spoiler gate stays a test (S).** A test that a never-observed occurrence cannot appear in `eventFeed` output and that a sealed-secret id does not render truth. Done check: the test passes against rows from each layer.

### LATER / DELEGATE

- **L1. Per-world pacing from E5 (M to L).** Tension, comfort, tempo, fairness R1-R10. Level: Sol (judgment). Done check: a seed sweep shows a calm stretch raises fire rate and a bad stretch lowers it inside a stated band.
- **L2. Tingen daily deck (M, content).** About 12 ambient rows tagged by position and place. Level: Luna on the existing factory pattern. Done check: a headless 7-day Klein run (game MCP) shows at most one non-daily event per day and no repeat within the cooldown.
- **L3. HP recognition rows (M).** Fame and first-week rows on entering places. Needs notoriety input (O4). Done check: the first morning in a corridor draws a recognition row and no row repeats inside its cooldown.
- **L4. Rumour about the player (M).** Join `world_events` spread with `economy_standing` distortion (O6). Done check: a public act produces a garbled line at a listener two days later and changes one price or attitude.
- **L5. Festival season modifiers (S to M).** `modifiers` on a window (O5). Done check: during the window a card's weight rises as stated; after it, the weights return.
- **L6. Substitutes and divergence for canon (L).** K12.2, K12.5. Needs the canon event graph; Sol.
- **L7. Merge `WORLD_DAY_EVENTS` into the book (S to M).** After LB-Q1. Done check: `event_feed` news rows unchanged for each world with day events.

### New angles this round

- **X1. Entering a place is an event trigger, not only the clock (ACCOUNT FOR NOW, S).** Several outcomes (O4, partly O1) fire on arrival. The deck only ticks on intervals (shown). Add an `onEnter` tick source that draws once per arrival with a cooldown. Done check: arriving twice in a minute draws at most once.
- **X2. Season is a window with weights (ACCOUNT FOR NOW, S).** A festival, term break or war rationing as a modifier window, so "season" is not a new subsystem (O5).
- **X3. Receipts as the replay oracle (ACCOUNT FOR NOW, S).** The deck already stores 20 receipts and the stream log 256 (shown). A debug command "replay from receipt" gives a regression for free. Done check: replaying a saved receipt reproduces the card.
- **X4. Idle fit (LATER, M).** Events during long activities and idle time: queue `soft` rows, defer `hard` to the end of the activity (E2 X2 says today a decision pauses everything, stated). Needs the `blocks` scoping.
- **X5. Rows that teach (LATER, S).** A row's choices can grant a small skill note, so quiet evenings are not only flavour (Village cards already grant xp, shown in `storylet_content.js`).
- **X6. A "director off" mode for tests and Weibao (ACT NOW as a requirement, S).** A world flag that disables layer 3 only, so canon-only play and headless proofs stay deterministic. Matches the existing `storylets.enabled` opt-in (shown).

### Questions (answerable from owners, not for Weibao)

- **LB-Q1.** Which worlds use `WORLD_DAY_EVENTS` and which use the book, and do any days overlap? Check before L7.
- **LB-Q2.** Does a Tingen row set read `LOTM_LEAD_CHANNELS` for what Klein can hear, and does a Nighthawk role widen it (the dial comment says so, shown `book_world_lotm_events.js:10-12`)?
- **LB-Q3.** Whether the legacy simulation checks (source 5) will migrate to rows or stay as an adapter. E5 step 0 proposes an adapter (stated).

## 5. Suggested order (proposal)

1. A2 determinism sweep and A5 spoiler test: small, protect everything after.
2. A1 row shape, then A3 schema 2 (a recorded compatibility decision first).
3. A4 debt writer and L2 Tingen daily deck: the first outcomes Weibao can feel (O1, O2) on the world he is playing.
4. X1 on-enter source, then L3 HP rows.
5. L1 E5 pacing once there are two worlds of rows to pace; L4 and L5 after.

## 6. Verification state

Source reads and greps only, on the dirty working tree. No test, build or browser run. No claim here is "implemented" or "verified at runtime". Not read: `simulation.js` (E5's citations of it are stated, not re-checked), `weather_calendar.js`, `world_climate.js`, `return_digest.js`, `law_case.js` contents, and the private LOTM pack.
