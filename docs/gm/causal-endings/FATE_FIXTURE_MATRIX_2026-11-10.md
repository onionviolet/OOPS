# Fate fixture matrix and STY24-STY32 wording check

2026-11-10. Design pass, proposal (AD32); no runtime change. Authorized by Weibao ("run the pass"). Inputs: the [fate research handoff](FATE_REDDIT_CLAUDE_HANDOFF_2026-11-10.md) (its LATER/DELEGATE paragraph defines this pass) and [Levels of fate](../../STORY_RULES.md#levels-of-fate) (STY24-STY32, proposals). Source read at HEAD `bc1d8fae5` with unrelated edits in the tree. Verification state: files and tests read, no test run, nothing built, nothing committed. Every row, code and estimate below is a proposal; no build is authorized.

Codes used in this file: G = gap, W = wording change, X = fixture, C = check.

## 1. What the code does today

### 1.1 canon_pull (the one fate-shaped module)

Inputs. A beat table with an opt-in `pull` field naming agents (`src/canon_pull.js:70-78`: id, kind, reason, sign, and a `restore` or `substitute` effect list). A config `{seat, ceiling, worldDial, cap, worldSeed, world, rulesChance}` (`:56`). A push record `{id, day, weight, reaches}` (`:30-34`).

Pull strength (`:57-67`). `ceiling x worldDial x weight`, where ceiling comes from the seat table `{be .9, beside .75, follow .7, bystander .6, ordinary .5}` (`:17`, `:59`) unless `cfg.ceiling` is set. Weight is 1 if `fixed`, else the beat's own weight or its kind weight (`:18`, `:60`). A redundancy bonus is added per extra agent in the pull spec, capped at 0.3 (`:63`). Disturbance from pushes halves per dependency hop (`:37-54`) and cuts the value by inertia (`:65-66`).

Keyed draw (`:86`). `keyedUnitFor(worldSeed, 'fate', ['canon.pull', world, beatId])` (`src/keyed_generation.js:9`). The key holds the beat id and nothing else: no day, attempt or agent. One draw per beat, shared by all its agents. A different pull changes the chance, not the draw, and no other beat's draw (the LSD244 claim holds in code).

Chance and outcome (`:85`, `:89-99`). `chance = strength + (1 - strength) x rulesChance[beat]`. The host passes no `rulesChance`, so it is 0 there (`canon_pull_host.js:25`, `:33`). If the draw misses, outcome is `deviated` with reason `draw`. If it lands, an agent acts:

- Live agents are those whose spend plus cost fits their budget; budget and cost default to 1 each (`:80-81`, `:91`).
- Order: the first live agent with a `restore` if every cause is a plain fact precondition; otherwise the first live agent with a `substitute`, in configured order (`:90-92`). No agent gives `deviated` with reason `spent` or `no_hand` (`:93`).
- Restore rewrites the beat as `needs: null`, with the agent's restore effects first, then the beat's own effects, then a `pull.<beat>` mark fact (`:95-97`). Substitute strips `needs`, `mechanism`, `deps` and `altered` and writes the substitute effects (`:98`).
- The resolver loop replays each day with the modified table until no undecided pull beat is left (`:104-127`).

Saved versus derived. Saved slice `canonPull`: `schema, disturbance, spent, records, beats{done, day}` (`:26`, `:153-163`, `:167-175`); additive, empty writes no key (`:163`, `:168`). Derived and never stored: pull value, chance, inertia, the lean words and the chronicle text (`:57-67`, `:130-149`). Records keep beat, day, status, pull, chance, inertia, disturbance, agent, kind, reason, sign, cost (`:87`, `:99`). They hold no target of the effect.

Read surface. `pullRead` and `deviationChronicle` show beat ids, lean words and the one `sign` line, never the beat content or the agent reason code (`:129-149`, test `tests/canon_pull.test.js:73`).

### 1.2 The one host (canon_pull_host.js, canonPullTick)

One LOTM beat, `lotm.v1.pull.b1`, day 3, `great` kind, needing the lead at their scheduled place (`canon_pull_host.js:11-19`). Two agents: `fate` (restore, `reason fate.coincidence`) and `church` (substitute, `org.contingency`), budget 1 each (`:14-18`). Facts are re-read from the game each tick (`:4-5`, `:23`). The tick waits while the book does not say where the lead is (`:22-23`, `:31`). It runs once per life day, since `day > beats.day` gates it (`:31`; test `tests/canon_pull.test.js:102-130`). Only facts starting `book.lotm.` become simulation effects (`:34`). The caller in `src/book_world_lotm_cast_host.js:644-653` hardcodes seat `'be'`, runs only when `lotmBe(plan.state)`, uses `plan.state.rng ?? 0` as the world seed, commits the slice through the `canonPull` domain and emits a Reports line `Beat b1: <outcome>`. Whether `plan.state.rng` is a fixed seed or an advancing stream across a life: not verified in this pass (see Q1).

### 1.3 world_events

Records with kind, key, placement (`dated`, `anchored`, `ordinal`, `unplaced`), scope (`public`, `private`), evidence label (`src/world_events.js:6-19`). Anchors resolve to windows (`:22-45`); `ordinal` events run on a day the host binds, and not before (`:38`). Restrictions: curfew, closure and travel_halt become per-day rows (`:54-66`), and `openUnder` answers open or closed for a place, institution, leg or means at an hour (`:72-83`). Knowledge: `learnedDay` returns `present` (in the event's place on a window day or listed in `present`, `:94-95`) or `heard` through the first usable spread route, where a private event leaves the room through a named carrier (`via`/`audience`) once the carrier has learned it (`:90-114`). `whoKnows`, `knownTo`, `learnedBetween`, `newsOn` are the queries (`:116-127`). `eventKnowledgeWrites` turns those into knowledge rows with an observation or reported basis (`src/world_events_knowledge.js:6-17`). Nothing here writes world facts.

### 1.4 beat_records and beat_ledger

`resolveBeats` replays days; each beat is `carried`, `altered`, `deferred`, `lapsed` or `blocked` from its `mechanism`, `deps` and `needs` (`src/beat_records.js:133-156`). A mechanism the run does not offer gives `blocked`, "not faked" (`:11-14`, `:135`, `:150`). Mechanisms are a per-run list, `ctx.mechanisms` (`:166`). `lives` get per-life exposure (`present`, `affected`, `aftermath`, `heard`) from scope and attachment mode (`:91-100`, `:107-121`). Beats on one day resolve in table order (`:170-178`). Two writers to one fact overwrite silently; the diff is the one record kept (`:123-131`). A comparison `lt` on a missing fact is false (`:41`), so a fixture must start numeric facts at 0. `beatLedger` is the additive save slice of the same `{facts, done, day}` state (`src/beat_ledger.js:14-85`). Note the pull slice keeps its own copy of `done` and `day` (`canon_pull.js:26`).

### 1.5 What is already proven by tests

- `tests/canon_pull.test.js`: seat dial and fixed beats (`:19`); keyed determinism and every outcome occurring across 300 seeds (`:28`); push raises deviation (`:42`); finite budgets (`:49`); damping by deps (`:58`); substitute satisfies dependants (`:65`); ids-only read (`:73`); slice round trip (`:85`); host tick idempotent per day and waiting (`:102`, `:121`).
- `tests/beat_records.test.js`: scope and miss notes (`:27`); changed input flips a downstream fact (`:40`); deferred then lapse (`:97`); mechanism blocked and dependants blocked (`:114`); determinism and no input mutation (`:138`).
- `tests/world_events.test.js`: news on its day (`:33`); witness versus stated route (`:40`); private events need a carrier (`:50`, `:70`); replayable digest (`:55`); second-hand delay (`:82`); restrictions close places and legs (`:91`).
- `tests/world_events_knowledge.test.js`: heard and observed knowledge writes (`:10`, `:16`). `tests/beat_ledger.test.js`: ledger survives save and import (`:31`, `:84`).

Not proven anywhere: that a missing reach fails a pulled beat, that a pull cannot lift a mechanism block, that two seats share one trace, that two plans on one fact resolve by custody.

### 1.6 Gap list (STY24-STY32 against code)

| Gap | Rows | Finding |
| --- | --- | --- |
| G1 | STY25, STY26 | No seam for reach. An agent has no `reach` or eligibility rule (`canon_pull.js:70-78`). A restore sets `needs: null` (`:97`), so it clears every failing fact, including one that stands for a missing route. A nominal pull of 1 (ceiling 1, dial 1, weight 1) gives chance 1 and the draw always lands, so the missing route is conjured. This falsifies the STY25 headline example as the code stands. |
| G2 | STY25, STY27 | A substitute clears `mechanism` (`:98`). A beat blocked by a hard gate that also has a `pull` spec can be carried by its substitute agent when the draw lands. That contradicts "blocked, not faked" (`beat_records.js:11-14`). The LOTM beat has no mechanism, so the live code cannot hit it. |
| G3 | STY32, STY28 | `PULL_SEATS` makes the pull ceiling depend on the seat (`canon_pull.js:17`, `:59`). The code comment ties this to Weibao's 2026-10-29 direction that the lead's seat holds canon (`:16`; the USER_VISION text was not re-read here). STY32 says perspective changes choices and knowledge, not mechanics, unless the seat carries a world property. The two need one reconciling sentence. |
| G4 | STY26 | Budget is forced: `agent.budget ?? 1` and `agent.cost ?? 1` (`:81`). STY26 cites AD55 (no forced budget). There is no unbounded value except a large number. |
| G5 | STY26, STY29 | An agent's motive is a free `reason` string and a `sign` (`:74`). No sealed premise slot, no seeded agenda, no divination read of the trace. The trace exists as the `pull.<beat>` fact (`:95`) and the sign line (`:148`). |
| G6 | STY24 | No fate level is stored for any fact, place or era. Redundancy is counted by the number of agents (`:63`), not by independent live routes in the world, so "F1, causal mass" is not measured by `pullFor`. The routes exist in the beat table and are not counted. |
| G7 | STY27 | No instrument object. The nearest seams are a mechanism name in `ctx.mechanisms` (`beat_records.js:166`) and a restriction row (`world_events.js:54-66`). No lost-capability record. |
| G8 | STY28 | No bearer. `ctx.mechanisms` is per run, not per person (`beat_records.js:166`); `openUnder` takes no person (`world_events.js:72`). A halt that lists `legs` closes the leg for any means (`:75`); leg AND means cannot be written, just leg OR means. |
| G9 | STY31 | No custody or conflict record. "Acts first" is table order (`beat_records.js:80`, `:170`); a second writer to a fact overwrites without a record (`:123-131`). |
| G10 | STY30 | No `layer` or owner tag on a result or diff (`beat_records.js:152-156`); no inspector (UR80). The five layers exist as separate modules (beats, keyed draw, world events, knowledge, ledger) with no tag joining them. |
| G11 | STY25 (D2 in handoff) | The draw key holds the beat id and nothing more (`canon_pull.js:86`). Adequate for a one-shot beat, short for a repeating fact, which needs an attempt component. No selection among eligible candidates (which ferryman) exists; the agent's effect list is fixed (`:95-98`). |
| G12 | STY9, STY30 | No bridge from a committed beat result to a world event. Events are authored records; a host binds `ordinal` days by hand (`world_events.js:38`). A caller must pass bindings for the beats that carried, as a default. |
| G13 | STY32 | The pull panel reads for the lead (`canon_pull_host.js:41-45`) and the host runs for seat `be` alone (`book_world_lotm_cast_host.js:644`). A local seat has no read and no pull run. That is a knowledge and surface choice, not a different mechanic, but undeclared. |

Rows with no seam at all: STY24 (no level storage), STY27, STY28, STY31. Rows with a partial seam: STY25 and STY26 (draw, budget, but G1, G2, G4), STY29 (sign and mark fact, no reading), STY30 (separate modules, no tag), STY32 (lives and knowledge are seat-neutral; G3). STY30's knowledge half is well covered by `world_events.js` and `world_events_knowledge.js`.

## 2. Suggested wording changes

Only where the trace shows a row is wrong, vague or unimplementable as written. Each quote is the current default wording.

**W1 (STY25, G1, G11).**
- Current default wording: "Soft pull uses `pull + (1 - pull) × p` on one eligible correction; a nominal 100% pull cannot conjure a missing boat unless an actual intervention can supply one."
- Proposed: "Soft pull is the chance that a fate agent acts at all, `pull + (1 - pull) × p`, drawn once per fact with a key that names the fact (repeating facts add an attempt number). What the agent can change is the effect list it declares. An agent declares a reach rule; a restore fixes the facts it lists and leaves every route fact failing, so a missing route fails the beat at any pull. A candidate (which ferryman) is picked by a second keyed draw over the eligible set."
- Reason: the formula in code gates whether an agent acts (`canon_pull.js:85-92`); it does not correct one eligible draw. The "unless an actual intervention can supply one" clause has no check behind it today (G1). Also names the missing target draw (G11).

**W2 (STY25 reload clause).**
- Current default wording: "a reload, a preview or a seat change neither spends an intervention nor advances a draw."
- Proposed: "a reload or a preview spends nothing and advances nothing; a seat change leaves every draw unchanged and changes a chance where the seat carries a world property (STY32)."
- Reason: spend is saved only when an agent acts (`:121`) and `pullRead` is pure, so the first half holds. A seat change today moves the chance (G3).

**W3 (STY26 budget).**
- Current default wording: "it spends a budget where the mechanism has one (AD55: no forced budget)."
- Proposed: add "Default in code: one act per agent; a world sets a larger budget or marks the mechanism unbudgeted. Dial: per agent."
- Reason: code gives every agent a budget of 1 by default (`:81`), which reads as forced (G4). Either the row or the default changes; the row is cheaper.

**W4 (STY26 reach).**
- Current default wording: "It can detect, reach and do what its mechanism allows."
- Proposed: "Its reach is a rule over world facts (who it can detect, which places and people it can touch); an act outside the rule is not drawn."
- Reason: gives "reach" a testable shape. Today there is none (G1, G5).

**W5 (STY27 capability).**
- Current default wording: "Damage to an instrument removes particular capabilities."
- Proposed: add "Default seam: a capability is a named mechanism in the world's offered list; damage removes names from that list, and the beat that needs the mechanism is blocked, not faked (`beat_records.js:135`)."
- Reason: ties the row to the one existing seam. A pull with a substitute must not lift that block (G2); W1 covers the pull side.

**W6 (STY28 bearer).**
- Current default wording: "An exemption attaches to its target and one mechanism."
- Proposed: "An exemption names its bearer, one mechanism and the reason the bearer carries. Default seam: a per-person mechanism list, because the list is per run today (G8)."
- Reason: the row says target; the code has no target field.

**W7 (STY24 level of F1).**
- Current default wording: "F1 for original and ordinary worlds."
- Proposed: "F1 for a fact with two or more independent live routes; F0 for a fact with one route and plain chance. Original and ordinary worlds hold both."
- Reason: F1 is defined by redundant routes (table row), so a one-route fact is F0. The default as written labels every fact F1.

**W8 (STY30 inspector).**
- Current default wording: "A developer inspector shows per fact the layer and owner (UR80)."
- Proposed: add "Default seam: each fact write carries a `layer` tag (mechanism, keyed draw, fate agent, event, committed). No field carries it yet."
- Reason: G10. Without the field the inspector has nothing to show.

**W9 (STY31 conflict).**
- Current default wording: "who gets custody, who acts first and what method is still available decide it."
- Proposed: "A second writer to a fact already written the same day is a recorded conflict, resolved by custody, then order of action, then method. Plans on separate facts coexist."
- Reason: today order is table order and the later write wins unseen (G9).

**W10 (STY32 seat).**
- Current default wording: "Default: changing perspective changes only choices and available knowledge unless the seat carries a real world property."
- Proposed: add "The lead's canon-holding ceiling (`PULL_SEATS`) is that world property in a lore run, and a dial; in an open or non-lore run every seat takes the fact's own ceiling."
- Reason: names the one existing seat-dependent number (G3) and says why it stays.

No change proposed to STY29 (the trace is real; the reading seam is simply unbuilt) and none to STY2-STY11 here.

## 3. Fixture matrix

### 3.0 Shared world: the Harrow grain district (neutral, original)

Two deliveries feed the district. A flood closes the road (cart); the river barge needs a crew. A guild tries to buy the reserve stock. A clerk can reserve stock first. Named people: Tamsin (reeve, lead seat), Wren (clerk, local seat), Odd and Bram (ferrymen), a river oracle (F2/F3 agent, fixture b), the Millers' Hall guild.

Facts at start (numeric facts at 0, per `beat_records.js:41`): `road.open true`, `barge.crewed true`, `reserve.held_by 'open'`, `delivered 0`, `clerk.coin 1`.

Beat table T (day, needs, effects):

| Beat | Day | Needs | Effects |
| --- | --- | --- | --- |
| h.flood | 2 | none | `road.open false` |
| h.reserve (Wren, actor) | 2 | `clerk.coin gte 1`, `reserve.held_by eq 'open'`, `clerk.acts true` | `reserve.held_by 'clerk'`, `clerk.coin add -1` |
| h.guild | 3 | `reserve.held_by eq 'open'` | `reserve.held_by 'guild'` |
| h.cart | 4 | `road.open eq true` | `delivered add 1` |
| h.barge | 4 | `barge.crewed eq true` | `delivered add 1` |
| h.shortage | 6 | `delivered lt 1`, `reserve.held_by ne 'clerk'` | `district.short true` |

World events (one `buildEventBook`): `flood` (dated day 2, `disaster`, place `road`, public, route `dock_talk` delay 0); `guild_buyout` (dated day 3, `institution_notice`, private, `present: ['guild_porter']`, carrier route `via: 'guild_porter'`, `audience: 'wren'`, delay 2); `shortage` (dated day 6, public, route `market_crier` delay 1). Dates are copied from carried beats by the test (G12).

Lives for the beat run: Tamsin (mode `be`) and Wren (mode `ordinary`, not `free` or `background`, which get no note, `beat_records.js:93`), both in one `resolveBeats` run.

Default run (no fate): h.flood carries, h.reserve lapses (Wren does not act: `clerk.acts` false), h.guild carries, h.cart lapses (road closed), h.barge carries, h.shortage lapses (delivered is 1). Redundancy is the whole story.

Test host for all four fixtures: one new file, `tests/fate_fixture_matrix.test.js`, with the tables built inline from `beat_records.js`, `canon_pull.js`, `world_events.js`, `world_events_knowledge.js` and `beat_ledger.js`. No `src/` change for X-a, X-d and most of X-c.

### 3.1 X-a: causal (F1, no fate)

Trace.
- Preconditions: two independent live routes (cart, barge) to `delivered >= 1`; no `pull` field on any beat.
- Intervention or draw: none. No key is spent.
- Committed fact: `delivered 1`, `done[h.cart] = lapsed` with a fact cause on `road.open`, `done[h.barge] = carried`, `done[h.shortage] = lapsed`, `reserve.held_by 'guild'`.
- Observer or consumer: Tamsin and Wren each get the `flood` news by `dock_talk` on day 2; nobody gets a shortage line (it did not happen); the guild buyout is private.

| Check | Falsifies (proposal) | Host module | Cheapest test (`tests/fate_fixture_matrix.test.js`) |
| --- | --- | --- | --- |
| Unchanged replay | STY8 (same replay), STY30 (committed facts persist) | `beat_records.js`, `beat_ledger.js` | `X-a replay`: run T twice, `deepEqual` results and state; serialize and restore through `serializeBeatLedger`/`restoreBeatLedger` at day 3 and resume to day 6, same `done` map. Pattern of `beat_records.test.js:138` and `beat_ledger.test.js:31`. |
| Input-changing divergence | STY2 (causal mass: an input change moves a downstream fact), STY32 | `beat_records.js` | `X-a divergence`: set `clerk.acts true` at start. h.reserve carries, h.guild lapses, `reserve.held_by 'clerk'`, delivered still 1. One input, two downstream flips, no draw spent. |
| Lost cause | STY24 as amended by W7 (F1 needs live routes), STY25 | `beat_records.js` | `X-a lost cause`: `barge.crewed false`. h.barge lapses with cause `{fact: 'barge.crewed', want: true, have: false}`, delivered 0, h.shortage carries, and `beatReport` lists the barge in `unreached` (`beat_records.js:183-192`). With no pull spec nothing rescues it. |
| Hidden until learned | STY9, STY32 (knowledge follows routes) | `world_events.js` | `X-a hidden`: `whoKnows(book, 'guild_buyout', 6, ['wren','tamsin'], ctx)` is empty; add `guild_porter` as the carrier channel and it returns `wren` at day 5 (day 3 plus delay 2) with route as the basis. Pattern of `world_events.test.js:70`. |

### 3.2 X-b: eligible soft influence (F2/F3 actor with reach)

Beat addition: `h.warn`, day 3, kind `great`: the river warning heard by a ferryman. Plain precondition: `warn.signal true`, false at start (nobody watches the river), so the beat is broken. `h.crew` (day 3, after `h.warn`) sets `barge.crewed true` from `warn.heard.odd`, so the barge route in T is itself the fate-fed one in this fixture: start with `barge.crewed false`. Pull spec: agent `oracle`, kind `fate`, reason `fate.river_warning`, sign "a rumour carried to Odd's door", budget 1, restore `[{fact: 'warn.heard.odd', value: true}]`, plus the proposed reach rule `oracle.reach.odd eq true`. Odd sleeps at the shrine (reach true). Bram is out at sea (reach false): the eligible set is {Odd}. The guild keeps trying to buy the reserve at the same time (separate fact, both plans succeed, STY31).

Trace.
- Preconditions: `warn.signal false`, `oracle.reach.odd true`, `oracle` unspent, a pull ceiling above 0.
- Intervention or draw: `keyedUnitFor(seed, 'fate', ['canon.pull', 'harrow.v1', 'harrow.h.warn'])` (the real key shape, `canon_pull.js:86`). If `draw < chance`, the oracle acts and spends 1 (`:121`).
- Committed fact: `warn.heard.odd true`, `pull.harrow.h.warn 'restored'` (`:95`), then h.crew carries, `barge.crewed true`, delivered 1. A record with outcome `restored`, agent `oracle`, reason and sign is saved (`:99`).
- Observer or consumer: Tamsin's panel shows the sign line, never the reason code (`:144-149`). Wren learns that the barge is crewed from a private event `warn.heard` (present `['odd']`, carrier route `via: 'odd'`, `audience: 'wren'`, delay 1). Odd's own knowledge is an observation.

| Check | Falsifies (proposal) | Host module | Cheapest test |
| --- | --- | --- | --- |
| Unchanged replay | STY25 reload clause (W2), STY3 | `canon_pull.js`, `canon_pull_host.js` | `X-b replay`: `resolveWithPull` twice, same seed, `deepEqual` records; round trip the slice through `validateCanonPull` and resume at day 4: no new record, `spent.oracle` still 1 (host idempotence `canon_pull_host.js:31`, test pattern `canon_pull.test.js:102`). |
| Input-changing divergence | STY25 (LSD244: other draws keep their key) | `canon_pull.js` | `X-b divergence`: compute `u = keyedUnitFor(...)`, pick two pushes so chance straddles `u` (`recordPush` on `h.warn` with weights small and large, `:30`, `:64-66`). With the small push the oracle acts; with the large one the outcome is `deviated` reason `draw`. Assert the draw `u` is identical in both runs and that h.guild and h.flood results are unchanged. |
| Lost cause | STY25 headline (W1), STY26 reach (W4) | `canon_pull.js` | `X-b lost cause`: `oracle.reach.odd false`, ceiling 1, dial 1, `fixed` weight so chance is 1. Expected: outcome `deviated`, reason `no_reach` (new reason code), `h.warn` lapsed, `barge.crewed` stays false, h.shortage carries (or the guild and flood continue as in X-a lost cause). On today's code this test is red: the restore nulls `needs` and conjures `warn.heard.odd` (G1). Write it first; it defines the slice. |
| Hidden until learned | STY26 (motive is world truth), STY29 | `canon_pull.js`, `world_events.js` | `X-b hidden`: `deviationChronicle` text contains the sign and not `fate.river_warning` or the id `oracle` (existing assertion style at `canon_pull.test.js:73`); the saved record does hold both; `eventKnowledgeWrites` for Wren on day 3 is empty and on day 5 has the reported basis (carrier delay). |

### 3.3 X-c: hard gate with an exemption (F4 + F5, tiny neutral fixture, not RI)

A Warden's Seal blocks the ford crossing on days 3 to 5. A pass-holder is exempt; outside the seal's reach (the river ferry leg, other days) the ordinary rules resume. Gate: event `seal` with effect `{kind: 'travel_halt', legs: ['ford'], fromDay: 3, toDay: 5}` (`world_events.js:54-66`). Beat `h.cross.ford` (day 4): `needs ford.open true`, effect `delivered add 1`, no `pull` field. The caller computes `ford.open` from `openUnder` before each day (the beat resolver sees facts and nothing else). Exemption: the pass-holder run offers mechanism `warden_pass` through `ctx.mechanisms` to a beat `h.cross.pass` with that `mechanism`; the ordinary run does not (`beat_records.js:135`, `:166`).

Trace.
- Preconditions: seal window 3-5; Tamsin holds `warden_pass`; Wren does not; ferry leg open.
- Intervention or draw: no draw. The gate and the exemption are deterministic.
- Committed fact: Tamsin run: `h.cross.pass` carried, `delivered 1`. Wren run: `h.cross.ford` lapsed with cause `{fact: 'ford.open'}`, `h.cross.pass` blocked with cause `{mechanism: 'warden_pass'}`. Day 6: `openUnder` ford open again; day 4 ferry leg open (outside reach).
- Observer or consumer: the guard sees both; Wren learns the seal by a clerk carrier.

| Check | Falsifies (proposal) | Host module | Cheapest test |
| --- | --- | --- | --- |
| Unchanged replay | STY27, STY30 | `world_events.js`, `beat_records.js` | `X-c replay`: `restrictionsOn(book, 4)` and `openUnder` twice equal; two runs equal; assert `openUnder(..., {leg:'ford', hour:10})` closed on day 4 and open on day 6, and the ferry leg open on day 4 (`:72-83`). |
| Input-changing divergence | STY28 (exemption attaches to the bearer) | `beat_records.js` | `X-c divergence`: same table, `mechanisms: ['warden_pass']` versus `[]`: `h.cross.pass` carried versus blocked, others identical. Seat is irrelevant; the property is. |
| Lost cause | STY25, STY27 (a block holds against pull; "blocked, not faked", `beat_records.js:11-14`) | `canon_pull.js`, `beat_records.js` | `X-c lost cause`: give `h.cross.pass` a `pull` spec with a substitute agent, remove the mechanism, ceiling 1. Expected: `blocked`, no pull record that carries it. Red today: the substitute clears `mechanism` (`canon_pull.js:98`, G2). Remove the pass from the bearer in a second run: the crossing fails and nothing is forced. |
| Hidden until learned | STY28 (the reason travels with the person), STY32 | `world_events.js` | `X-c hidden`: no world-event row names the pass or its bearer; `knownTo(book, 'wren', 4, ctx)` omits the seal until a route delivers it; the guard's `closedBy` lists event ids only (`:82`), so a bounced crossing exposes no exemption reason. |

Gap exposed (G8): `openUnder` cannot express "this leg for these means" or "this bearer". The fixture routes the exemption through the per-run mechanism list. A bearer field on a restriction is the proposal, and costs one field.

### 3.4 X-d: non-lore observer seat (a local clerk)

Wren is the seat. She has no pull ceiling advantage and no quest. Her one action is the h.reserve beat; her knowledge arrives by route.

Trace.
- Preconditions: `clerk.coin 1`, `reserve.held_by 'open'`, `barge.crewed false` (so a shortage threatens), `clerk.acts` true.
- Intervention or draw: the clerk's choice on day 2 (a verb that writes `clerk.acts`); no fate draw.
- Committed fact: h.reserve carried, `reserve.held_by 'clerk'`, h.guild lapsed, h.shortage lapsed (needs `reserve.held_by ne 'clerk'` fails), `district.short` unset. This is a district outcome the lead did not touch.
- Observer or consumer: Wren's exposure from `livesFor` (`beat_records.js:107-121`) for h.shortage is none or `heard`; her news digest (`newsOn`, `world_events.js:127`) has the flood on day 2 and no shortage line; the guild buyout stays hidden because it lapsed and has no event.

| Check | Falsifies (proposal) | Host module | Cheapest test |
| --- | --- | --- | --- |
| Unchanged replay | STY32, STY8 | `beat_records.js`, `world_events.js` | `X-d replay`: Wren's `learnedBetween(book, 'wren', 0, 7, ctx)` equals on a second call (`world_events.test.js:55`) and the run state is `deepEqual` after a ledger round trip. |
| Input-changing divergence | STY32 (a local actor changes a district fact) | `beat_records.js` | `X-d divergence`: `clerk.acts false` against `true`: `district.short` set against unset. No lead action in either run. |
| Lost cause | STY32 and STY28 (no exemption for being the played seat) | `beat_records.js` | `X-d lost cause`: `clerk.coin 0`. h.reserve lapses with cause `{fact:'clerk.coin', op:'gte', want:1, have:0}`, shortage carries. No pull spec exists, so nothing rescues the played seat. |
| Hidden until learned | STY9, STY32 | `world_events.js`, `world_events_knowledge.js` | `X-d hidden`: shortage on day 6 is committed, but `knownTo(book, 'wren', 6, ctx)` omits it and `eventKnowledgeWrites(book, 'wren', 6, 7, ctx, ...)` returns the `market_crier` write on day 7 with a reported basis (`world_events.js:94-110`, `world_events_knowledge.js:6-17`). |

### 3.5 Same trace from the lead seat and the local seat

The beat run is one `resolveBeats` call with both lives, so the committed facts are identical by construction. The test compares the two projections.

| Layer | Lead seat (Tamsin) | Local seat (Wren) | Same or different |
| --- | --- | --- | --- |
| Beat results and committed facts | h.flood carried, h.guild carried, h.barge carried, h.shortage lapsed | same | Same |
| Pull draw and spend (X-b) | key `['canon.pull','harrow.v1',beat]`, one draw | same key, same draw | Same, when `cfg.ceiling` is set equal for both |
| Pull ceiling | `PULL_SEATS.be` 0.9 | `PULL_SEATS.ordinary` 0.5 | Different by default (G3); the test sets `ceiling` explicitly, then states the default as the one seat property (W10) |
| Life exposure | `present` for the flood (footprint road), note line | `heard` or none (mode `ordinary`, no footprint) | Different (knowledge) |
| News digest | flood day 2, shortage not applicable | flood day 2 | Different by presence and channels |
| Pull read and chronicle | Panel shows lean words and the sign line | No panel (G13) | Different surface, not different mechanic |
| Choices | issues orders to the barge crew | reserves stock, hires no one | Different (choices) |

The check, `X-seat`: for the same seed, compare `results`, `state.facts` and `pull.records` for the two seat configs with `ceiling` fixed. Assert deep equality. Then assert the two `learnedBetween` digests and the two `lives` exposures differ. That is the acceptance line: perspective changes choices and knowledge, not mechanics.

## 4. Cost and order (all proposal)

Rank by cost on existing seams. Estimates are ranges for one agent, tests included, no UI.

1. X-a, 2-3 hours. Uses `beat_records.js`, `world_events.js` and `beat_ledger.js` as they stand. Four green tests. Also creates the shared tables the others reuse.
2. X-d, 1-2 hours after X-a. Same tables, adds a second life and one clerk beat. No source change.
3. X-c, 3-4 hours for the green half (gate, replay, divergence, hidden). The lost-cause test is red on G2 until one rule exists in `canon_pull.js`: a substitute keeps a `mechanism` block unless its agent names the mechanism it supplies. Person-level exemption (G8) is a separate field, about half a day if built.
4. X-b, 4-6 hours of test authoring on the existing seam. The replay, divergence and hidden checks are green. The lost-cause check is red on G1 and needs two small source changes: an agent `reach` rule that filters live agents, and restore that fixes only listed facts instead of `needs: null` (`canon_pull.js:91`, `:97`). About a day including the `no_reach` reason and the second target draw (G11) if that is wanted.

Cheapest to build first: X-a, because it needs no source change and builds the table every other fixture shares. The most informative single test: X-b lost cause, because it is the one that turns the STY25 sentence into something that can fail.

What stays not built: any fate level per fact (G6), any instrument object (G7), custody and conflict records (G9), the layer tag and inspector (G10), the event bridge from beats (G12), a local-seat pull read (G13), a world pass or new world, a storyteller, save migration. The fixtures prove the claims on a neutral table; they add no world and no gameplay. If Weibao authorizes a build, the slice follows the AD36 and AD43 gate, and no source change starts before the wording changes in section 2 are accepted or declined.

## 5. Open questions

- Q1: is `plan.state.rng` a fixed world seed across a life or an advancing stream? If it advances, the pull draw key changes between sessions and the replay claim for the live host (not for the pure fixtures) fails. Read `main.js:1444` and the clock path before any host change.
- Q2: does the standing direction on the lead's canon-holding seat (the `canon_pull.js:16` comment) stay a lore-run dial only (W10), or apply in open runs too? This changes the X-seat expectation, not the matrix.
- Q3: should an agent's budget default to unbounded (W3 option) or stay at one act? Either is cheap; W3 picks the wording route.
