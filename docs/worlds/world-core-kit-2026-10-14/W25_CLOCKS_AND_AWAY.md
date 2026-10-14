# W25: One world clock and away behaviour

## CHECKPOINT

Complete, design only, 2026-10-14. Own this file and `docs/gm/dispatch/world-core-kit-2026-10-14/W25_REPORT.md` only. Source snapshot began at HEAD `6dd515278a6e8a9982d899ebb985c3eb19e8176f`; HEAD advanced during the lane to `be8658af29e10467481c5ab9e373d1499ab35084`, with no `src/` difference between those commits. Shared dirty tree preserved. No code, tests, builds, saves, branch checkout, staging, commit or push. Refresh HEAD and sibling lane files before later implementation. All defaults below are INFERRED proposals, not accepted policy.

## Scope and prior owners

Extend DR4, KX65/KX66/KX74, MC6/MC8/MC32, MD3/MD7. Read [COMMON](../../gm/dispatch/world-core-kit-2026-10-14/COMMON.md), [kit root](../WORLD_CORE_KIT_2026-10-14.md), [audit playbook](../WORLD_CORE_KIT_AUDIT_PLAYBOOK.md), AGENTS, PROJECT standing priorities and USER_VISION. Reuse [away ledger dispatch](../../gm/dispatch/away-ledger-2026-10-14/GOAL.md), [derived snapshots dispatch](../../gm/dispatch/derived-snapshots-2026-10-14/GOAL.md) and [offline audit](../../research/OFFLINE_TIME_AND_BRANCH_CLOCK_AUDIT_2026-10-14.md). These own elapsed accounting and snapshot derivation; W25 adds consumers and policy rows, not a replacement ledger. [W21](W21_READINESS_K19_K34.md) supplies per-world readiness and its UNKNOWN away fields. W22/W23 output files were not present at the first sibling read; no dependency on their completion is assumed.

SHOWN means source or owner text read with a locator. INFERRED means a conclusion or proposed design. No browser behavior was measured and no test was run in this lane. Franchise rows below are local design proposals, not new canon assertions; local documents are design evidence only. No sealed file was opened.

| Code | Finding and consequence | Evidence |
|---|---|---|
| W25.F1 | Global native calendar, joined elapsed minutes, local instance elapsed and wall milliseconds are different coordinates. Equal numbers are not equal dates. A reader needs world/instance identity and an explicit projection. | SHOWN `src/game_time.js:8`, `:195`; `src/expansion_engine.js:598`; `src/world_instances.js:308`; `src/feature_expansion_destination_native.js:9` |
| W25.F2 | No automatic general closed-browser reconciliation was found in main's imports/startup or the ledger references. Hidden tabs gain only executed callbacks. The pure ledger exists on HEAD, but its existence is not host wiring. | SHOWN `src/away_ledger.js:6`; `src/main.js:7396`, `:7930`; INFERRED absence conclusion, matching prior offline F4/F5 |
| W25.F3 | Several mixed readers exist inside a visited world: local mission clocks plus global weather/light; joined jobs plus global recurring windows; per-callback production plus consumed game minutes. These are routing gaps, not evidence that different world speeds are wrong. | SHOWN readers C2-C13 below; MD7 |
| W25.F4 | HEAD is newer than the old audit and a5 branch. Seeded native streams and anchor/away modules are already present on HEAD. The a5 TODO list describes its branch snapshot, not all of today's HEAD. | SHOWN `src/seeded_streams.js:3`, `:90`; `src/main.js:479`, `:4318`; branch `core/a5-determinism:tests/determinism_replay.test.js:120` |
| W25.F5 | The scheduler already orders causal boundaries and returns unspent time. Adding wall elapsed to a calendar alone would bypass costs, choices, expiry, supported-body guards and lease boundaries. | SHOWN `src/expansion_engine.js:598-640`; `src/main.js:1295-1324`; `src/world_completion_crop_clock.js:8` |

## Clock reader map

Clock codes: **G** native global calendar; **J** joined `expansion.clock` in played minutes; **I** world-instance `clock.elapsed`; **L** lease support on J, authorizing I advancement; **W** wall epoch ms; **B** executed callback/iteration count; **P** supplied pure projection/anchor. J is global elapsed, not G's absolute date. L is not another free-running ticker. A local adapter may use J for receipts/transactions and I for local windows without a bug: the bug is using J as local elapsed while the world is frozen or rate-shifted.

All citations in this section are SHOWN on HEAD unless explicitly marked branch. The appendix enumerates modules found by the clock-expression census, including guards and receipt sinks. The functional rows explain their time authority and important indirect consumers.

| Code | Module or consumer, locator | Reads | Mixed-reader finding / proposed binding |
|---|---|---|---|
| W25.C1 | `src/game_time.js:8-112`, `:189-195`; `src/world_rhythm.js:5-29` | G; P calendar to absolute minutes/window | Fixed 360-day year, 24-hour day, named seasons and lunar cycle. Keep as legacy projection; a world's calendar metadata projects I rather than allocating a new ticker. |
| W25.C2 | `src/weather.js:2-3`, `:63-97`, `:104-195`, `:205-214` | G plus global current_location | MIXED with I in book/nested visits. Rain/light still G; smoothing has module history `previous_temperature_modifier`. Route explicit world/place/calendar into the same derive in live and away modes. W23/W28 own climate shape. |
| W25.C3 | `src/world_instances.js:100-111`, `:308-340`; `src/realm_clock_leases.js:179-209` | J to I; L unioned with body visits | Existing policy validates played-minute freeze. Two visitors/leases do not multiply elapsed. No generic rate multiplier or wall-running-world policy here. MD7 allows different speeds as direction, not evidence they are implemented. |
| W25.C4 | `src/realm_state.js:74-101`; `src/pocket_realm_host.js`; `src/pocket_observation.js`; `src/observation_channels.js` (appendix locators) | J expiry/support, I local activity, L | Pocket observation can keep supported local activity moving while elsewhere in live play. This does not authorize closed-browser work or an unbounded lease. |
| W25.C5 | `src/feature_expansion_destination_native.js:9`, `:20`; `src/feature_expansion_nested_native.js:11`, `:27`; `src/book_world_paradise_native.js:19`, `:37`; `src/book_world_mol_native.js:19`, `:37`; `src/proto23_world_native.js:19`, `:61` | I to saved native local calendar | Five local adapters already exist. Their 06:00 year-one epoch must not be confused with G year 999. Saved projection validation does not prove all environmental readers use it. |
| W25.C6 | Destination/nested/Paradise/MoL/Proto23 host/state modules (appendix); `src/book_world_mol_state.js:55-57` | J to I; local offers/deadlines in I | Local deadlines freeze when visit absent. MoL retrieval is 90 local played minutes, not a festival clock. Local deadline converted into next J boundary only while its visit is active. |
| W25.C7 | `src/main.js:836-842`, `:3501-3573`; `src/conditions.js:225-229`; `src/data/locations.js:349-373`, `:1092-1123`; `src/village_content.js:77`; `src/expansion_engine.js:438`, `:549` | G/hour/season and recurringWindow(P) | Home schedules are G today. A generic action receives calendarMinute in context; no per-world clock guarantee. Hour-sensitive location descriptions and season requirements need the same world frame as availability. |
| W25.C8 | `src/absorb_c2/local_life.js:59-127`; `src/main.js:737` | supplied clock + calendarMinute, both home calendar projection in host | Search/contact do one attempt per observed step, not elapsed batch replay. Watch uses calendar day and 20:00 threshold. A large jump can skip a completed shift into a new day and interrupt it. |
| W25.C9 | `src/components/trader_component.js:87-117`; `src/main.js:7426-7429`; `src/market_saturation.js:76`, `:96` | G restock epoch; B triggers daily recovery | MIXED: restock detects epoch while recovery/trickle run once when callback sees any day increase. Crossing several days in a jump does not apply several daily recoveries. Market module itself takes increments, not a clock. |
| W25.C10 | `src/expansion_engine.js:598-640`; `src/simulation.js:459-501` | J: jobs/checks/controllers/events/conditions | Main causal scheduler; includes local sync, jobs, opportunities, actor controllers, aging, conditions and stop choices. Context facts must be recomputed for crossed boundaries, not borrowed once from departure or return. |
| W25.C11 | `src/causal_situations.js:25-46`; `src/causal_story_core.js:62`; `src/causal_story_host.js` (appendix); `src/storylet_deck.js:29-73`; `src/chronicle.js:12-23` | J and event/deck RNG; P enrollment calendar | Canon/situation deadlines are joined, not universally world-local. Deck eligibility is home-world/place aware. Snapshot derive is a separate pure tool, not this runtime's general canon runner. W24 owns same-tick ordering. |
| W25.C12 | `src/main.js:2608-2638`, `:7590-7700`; `src/models/combat.js:137`, `:232` | B action/combat/production loops, W correction, G availability | Native work/gathering, reading, sleep, regeneration, rain/cold exposure and skill XP depend on executed callbacks. They cannot all be credited by moving G/J. Native crafting is immediate transaction work (`src/main.js:4318-4407`), not a universal pending craft timer. |
| W25.C13 | `src/absorb_e1/pacing.js:29-51`; `src/main.js:698-705` | consumed eligible home played minutes plus G season | Optional E1 hunger/weather freeze outside home, and when not called. One long call uses supplied season throughout; crossing a season needs segmentation. E1 existing policy stays explicit. Food benefits/no hunger death and eligible passive Famine direction remain with PROJECT. |
| W25.C14 | `src/structured_container_runtime.js:51-59`, `:170`; `src/world_completion_crop_clock.js:8-10`; `src/lore_practice_runtime.js`; `src/world_completion_materials_runtime.js` | J, source expiry/support; retained deadlines | Spoilage, workshop/research/crop windows have joined boundaries and body-support retention. An absent-world rule must not silently strip those support guards or invent work from a stored item. |
| W25.C15 | `src/backlog_expansion_time.js:70-86`, `:198-216`, `:259-268`; `src/backlog_expansion_host.js:80-95`; `src/main.js:1531`, `:7317` | W request, escrow, then exact J consumption | Existing elapsed packing is narrow, explicitly reviewed, prepaid and ordinary-clock-pausing. Exclude its claimed interval from any future automatic ledger claim. |
| W25.C16 | `src/away_ledger.js:6-49`; `src/anchor_snapshots.js:39-46`, `:75-104`, `:147-168` | W-to-game allowance P; anchor P with seed/revision/branch | Both are pure HEAD modules. Away currently returns linear XP, not native settlement. Anchors can derive full/incremental history; neither module is evidence of runtime branch switching. |
| W25.C17 | `src/main.js:5056`, `:5389-5390`, `:5519`, `:7398-7405`, `:7799-7859`; `src/save_files.js` (appendix) | W save labels/export reward; B autosave/playtime | Wall export-reward eligibility can mature away; no job production follows. Keep save labels and UI timing outside simulation time. |
| W25.C18 | `src/display.js:4221-4225`; `src/main.js:2379`, `:8537`; `src/titles.js:2-3`; `src/cheat_cards.js:94-96`; `src/generated_people.js:44-46`; `src/main.js:5344` | G displays/seasons/titles/awakening/NPC years; P generated-people minute | MIXED risk beyond weather: skin, moon, life-year/title and NPC aging can disagree with I after travel. Decide actor-age authority separately from place calendar. |
| W25.C19 | Festival search: `src/world_rhythm.js:20`, `src/village_content.js:77`, `src/absorb_c2/local_life.js:143`, `:152`, `:191` | recurring G-derived service windows | No generic festival runner found in src. Existing recurring gatherings are a reusable seam, not a local canon-festival implementation. Add pack-authored occurrence IDs/clock binding, no second festival ticker. |
| W25.C20 | `src/settled_text_effects.js:163`, `:191`; `src/workspace_layout.js:107-108`; `src/verifier.js:21-22` | monotonic performance time | Presentation gesture/debounce and profiling only. Freeze/restart visual effects on return; never use them for elapsed rewards or world dates. |

## Away rows for the existing ledger

Two absences must remain distinct: **closed/hidden** loses callbacks unless they execute; **elsewhere** can still advance J while a nonvisited I freezes. Table columns describe current source behavior, not browser-tested outcomes. All proposed Default/Dial columns are INFERRED. “Eligible” means an existing selected activity or sustained applicable condition, sufficient real inputs and lawful body/support, not arbitrary XP. Policy IDs are lane-local proposals for an adapter registry, not new computeAway arguments.

| ID / loop | Today closed; elsewhere | Proposed Default | Dial and in-world reason | Boundary / durable consequence |
|---|---|---|---|---|
| W25.A01 active-life elapsed | No automatic general catch-up; J advances only when host called (F2) | One active life gets one capped allowance from existing computeAway; convert units explicitly | Ratio/cap/bank/drop per selected mode; do not infer live 60:1 from ledger's 1:1 default | wall cursor, remainder, cap overflow, selected life and publication revision; no retroactive old-save credit |
| W25.A02 nonvisited instances | Closed freezes; elsewhere I freeze via C3 except supported lease | Preserve freeze | Authored moving-world exception under timeline T4, with explicit rate/epoch and event budget | separate departure/reentry wall cursor if selected; never repurpose observedAt |
| W25.A03 lease work/observation | Closed not auto-run; elsewhere L support can activate I | Union body and supported lease intervals, clip at expiry | remote support duration/cost per realm contract | exact support/cause/revision; no double minutes from two contacts |
| W25.A04 meditation/passive adaptation | No general ledger-to-native passive adapter; specific played conditions exist | Accrue selected eligible practice/condition through shared elapsed segments | rate/diminishing/rest/condition qualification per world; Famine stays under bodily-needs owner | qualification start/end, native skill receipt; stop if body/source no longer supports it |
| W25.A05 native jobs/gathering | Closed no callbacks; elsewhere native action admission/ownership limits apply | First adapter settles only an already selected supported queue with reserved inputs | work windows, output storage, risk and interruption per occupation | opening/closing, stock exhaustion, output receipt; no retrospective enrollment |
| W25.A06 joined paid jobs/NPC work | Closed no scheduler; elsewhere J jobs can mature subject to guards | Advance existing scheduler by consumed allowance, retain frozen paid outcomes | remote/local job support policy per command, not all NPCs active | due/cost/RNG/participant guards; full native resource envelope |
| W25.A07 crafting/workshop | Native craft is immediate; queued simulation workshop uses J | Immediate crafts earn nothing by absence; existing queued work settles via A06 | station attendance, heat/cooling, assistants, material limit | job phase and reserved inputs; save partial work without a second craft clock |
| W25.A08 reading/research | Native callback reading stops closed; scheduler learning uses J | Only already selected supported reading/research gets elapsed credit | attention/rest and apparatus requirements by subject | page/threshold/completion boundary; no speculative discovery from clock alone |
| W25.A09 schedules/watch/routine | Windows read G; no closed backpay; observed-step watch can interrupt on a date jump | Segment accepted duty at shift end/day change; future windows show on return without auto attendance | standing duty versus drop-in attendance | cycle claim + actual attendance/payment, not render claim |
| W25.A10 traders/prices | Closed unchanged; elsewhere G can change stock epoch/recovery callback | Apply market transitions at each crossed local day boundary in stable region order | recovery cadence, market closure and supply policy by place | stock epoch and saturation effects saved together; no reroll by reopening |
| W25.A11 festivals/canon windows | No general festival runner; J opportunities may expire elsewhere | Authored optional occurrences may pass; blocking choices pause before settlement | observe-only/moving-world/hold-for-player by event contract | occurrence/cause ID, local clock range, missed/held/resolved status, no automatic reward |
| W25.A12 canon storms KX74 | No general storms-crossed return report found | Summarize only actually traversed admitted intervals and discoverable consequences; a barrier-held storm is pending, not missed | authored phase intensity, warning lead and allowable abstention outcome | storm ID, instance, revision, interval, crossed phases, public missed changes and next action; sealed detail remains by ID |
| W25.A13 weather/light | Closed unchanged until play; elsewhere G changes even for frozen I | Same world/place/clock derive for forecast, rendering and elapsed segments | no seasons/indoor/custom cycle per MD1, W23/W28 | weather derived; effects such as spoilage/ferry closure save with cause IDs |
| W25.A14 E1 fullness/weather | Eligible home played time only; elsewhere frozen | Preserve existing disabled/away policy until owner selects an adapter | nourishment/seasonal cycle per E1 owner; no hunger death | saved fullness/phase/remaining and policy revision; split at season changes |
| W25.A15 exposure/vitals/sleep/buffs | Callback rain/cold/regeneration/sleep; joined condition expiry also exists | Admit only supported effects; pause before unselected danger/choice, preserve food direction | safe rest and healing rate per body/place, specific survival rules only when selected | exact effect expiry, health and inventory consumption in shared plan |
| W25.A16 aging/lifespan/relationships | J chronicle/body boundaries; some G-year readers; closed no auto aging | Keep actor age attached to its selected life clock; place absence alone grants no age | species/body/transformation/realm rate policy, not universal local years | stop at existing ended-life/choice gate; no inherited offline death rule |
| W25.A17 container spoilage/crops | J boundary/support adapters; closed no catch-up | Preserve held windows and actual container/body/source eligibility | local climate/crop growth once a world adapter is selected | spoilage object identity, warning and settlement causes, replacement key/quantity |
| W25.A18 travel/mission timers | Existing J travel and I local mission windows; closed no general progress | Advance existing journey only to supported boundary, then recheck arrival/body/cargo | selected crossing cost and clock policy, zero invented generic travel tax | departure, in-transit, arrival, due and extraction receipts remain distinct |
| W25.A19 search/contact/storylet | Step-shaped search/contact; J decks have own saved RNG | Preserve no-retroactive-draw rule; pause these adapters until explicit occurrence cadence selected | future deterministic cadence with missed/quiet occurrences, per local scene | event ordinal and saved RNG; compare equal elapsed partitions before enabling |
| W25.A20 information/debt/ripples | J timestamps/conditions exist; generic carrier/debt floor incomplete | Delegate delivery/interest semantics to W26; reconcile only actual due carriers/obligations | grace, delivery lag, witness reach and acknowledged contract | cause ID + sent/due/received clock coordinates; no debt just from a doc |
| W25.A21 elapsed packing/export/UI | Packing explicitly reviewed; export cooldown wall-based; visual loops ephemeral | Packing retains escrow/claimed-time exclusion; export/UI do not award game minutes | cap/credit terms remain their own owner | same wall interval cannot be paid by packing and A01; labels are not cursors |
| W25.A22 optional/structured packs/endings | Simple active pack countdown uses consumed J; missing structured pack suspends; ended lives stop | Keep eligibility, compatibility suspension and ended-life stop | authored continuation/branch policy only when selected | content revision, active instance/body/life; no new pack or revival on return |

Adapter row contract proposal: `{policyId, revision, worldId, instanceId, lifeId, clockRef, eligibleWhen, nextBoundary, defaultMode, dial, deriveRef, effectOwner, returnVisibility}`. It describes how a host consumes the existing allowance; computeAway remains its current pure input/output API. Policy tables should never become a second state store.

## Smallest shared derivation and determinism seam

| Code | Existing seam / divergence | Smallest extension and future evidence |
|---|---|---|
| W25.D1 | `computeAway` returns allowance plus linear `gains.xp`; `advanceSimulation` can stop early (C10/C16). Crediting both linear XP and native practice would double pay. A barrier is selected only when `barrier.at < applied` (`src/away_ledger.js:28`), so a barrier exactly at the allowance endpoint does not set stoppedBy. | Retain computeAway as elapsed planner. The host maps eligible allowance to scheduler work and credits each adapter once. Publish cursor/remainder/rewards for **consumed** minutes atomically; retain unspent allowance at a new choice. Define endpoint inclusivity with the existing ledger owner, including barrier at 0, at cap and at exact elapsed endpoint. |
| W25.D2 | `weather.js` accepts time for some helpers but reads current_location and mutable previous smoothing state. A return-only calculation can differ from stepping through midnight. | W28's pure derive should accept a proposed `WorldTimeFrame` with world/instance/revision, local minute/calendar, place and pinned seed. Compute both neighboring temperature peaks from that frame. Live reader, away boundary and forecast call this one derive; no RNG draw on render. |
| W25.D3 | HEAD streams persist root/cells/log; scopedStream uses worldId, craft deliberately stays unscoped (`src/seeded_streams.js:39-44`), and gameStream reads actor worldId (`:90`). WorldId alone does not isolate two AUs of one world. | Preserve existing streams/save semantics. New local weather/events use stable instance + cycle/occurrence key under a versioned policy; do not rename old native craft streams silently. Save causal draws with effects and cursor. A world copy chooses whether to preserve or branch its future stream, through W22's copy contract. |
| W25.D4 | HEAD seeded native craft/gather/reward calls exist (C12/F4), but count/order of calls still matters. Local-life search discards excess step progress (`:104-106`); hub contact makes one elapsed-threshold attempt. Seeded randomness alone cannot make one jump equal many steps. | Reuse each consumer's live boundary segmentation; retain A19 pause until a cadence is selected. Compare RNG ordinals as well as outputs. Do not retrofit historical contacts by multiplying probability or taking one new draw per absent minute. |
| W25.D5 | Simulation jobs freeze outcomes on commitment (`src/simulation.js:183-187`); automatic checks have per-event RNG (`:70`); storylet decks own RNG (`src/storylet_deck.js:43-65`). | Keep incumbent generators. One scheduler call sequence determines boundary order in both modes; changing event registration must not reorder independent draws. W24 owns cause-edge then stable-ID ordering, including any later anchor integration. |
| W25.D6 | Branch `core/a5-determinism`, commit `6fbc319`, adds tests only: `tests/determinism_replay.test.js:73-119` compares 48 causal boundaries, seeds 17/42/0xcafe, frozen work and JSON reload; `:120-127` lists excluded native paths. Its ratchets record counts, not time parity. | Read-only branch evidence, not merged proof and not run here. Extend that style later to equal elapsed partitions, hidden/closed return, resource envelope and streams. Its old TODOs must be reconciled with HEAD bindings, not copied as current missing code. |
| W25.D7 | Anchors support seeded time windows/reset/revision and incremental derivation (`src/anchor_snapshots.js:39-46`, `:75-104`, `:147-168`). Dispatch's older spec says array order for ties; MD6 now calls for causal ordering in runtime. | Reuse anchors for authored snapshot facts, not native inventory/mission settlement. Supply the same pinned era/branch/local time and route effects through existing runtime owners. W24 decides a compatible tie-order policy before joining the two runners; don't silently reorder old snapshots. |

Proposed `WorldTimeFrame` is a read projection, not a seventh clock: `{worldId, instanceId, policyRevision, localMinute, calendar, joinedAt, seedRef}`. Construct it at the existing `advanceSimulation` local-sync/context seam (`src/expansion_engine.js:610-627`), and in the corresponding main read-context builder (`src/main.js:810-842`). A read frame never grants a lease or work eligibility. The existing publisher (`src/main.js:864-989`) remains the durable owner. Weather/climate can adopt the pure signature first without a main.js edit in this lane.

Future bounded comparison: same saved departure, policy, inputs and seeds; settle 120 minutes as one-minute steps, uneven splits, one allowance and reload midway. Compare consumed minutes, G projection, I clocks, escrow/resources, pending jobs, conditions, RNG cells, effect IDs and return report. Distinguish deliberate A19 pause from parity failure. Include midnight/season change, exact barrier equality, lease expiry, a storm held versus crossed, and a stopped scheduler with positive remainder. Later rebuilt desktop save/reload/literal import and hidden/closed journeys remain authoritative gameplay evidence; no such proof is claimed here.

## Per-world floors and new angles

This is a DR4/K8/K28/K32 clock-and-away floor, not a rescore of every kit part. D/R statuses use W21's selected slice and clock rows (K28/K32 and its source key); D partial means relevant design exists but this complete clock/away contract is not authored there. R partial requires a selected local clock/consumer, not a name in a roster. All floor proposals and new angles are INFERRED. No world reaches met for the joined clock + all readers + away settlement + storm report floor in this inspection.

| Code / world | D / R today, pointer | Floor proposal: Default + Dial + in-world reason | New angle |
|---|---|---|---|
| W25.W01 Harry Potter | partial / missing; W21 K28/K32 HP; `docs/worlds/harry-potter/WORLD_BRIEF.md` | One selected school/era I feeds timetable, weather and public events; Default freeze absent copy; Dial attended versus missed optional school calendar | A moving calendar needs lesson alternatives, not retroactive attendance or automatic relationship gains. |
| W25.W02 D&D | partial / missing; W21 DD; `docs/worlds/dnd/FIRST_SLICE.md` | One chosen setting calendar; Default only queued supported practice accrues; Dial rest durations/calendar/planes per campaign | Spell/effect duration belongs to its rule and actor, while shop hours belong to the place. Do not convert both by one wall ratio blindly. |
| W25.W03 TTKS B1-B5 | partial / missing for each of five book slices; W21 TT1-TT5 clock rows | Each selected book/era gets a pinned local epoch; Default frozen absent copy; Dial cultivation/practice work supported by that slice | A later-book ability must not change earlier-book clock or away eligibility merely because a shared name matches. |
| W25.W04 Mother of Learning | partial / partial; `src/book_world_mol_state.js:24`, `:55-57`; W21 ML | Preserve existing visit freeze and local offer window; bind climate/schedules to same I; Dial loop/reset policy only in its selected adapter | Reset and away settlement must agree on which interval/effect IDs survive, without exposing sealed truth or importing generic loop behavior. |
| W25.W05 Lord of the Mysteries | partial / missing; W21 LM clock rows | Selected era clock feeds appointments and public phase windows; Default halt at personal choice; Dial preparation versus elapsed public events | A return summary can state a public change without granting ritual knowledge the character never acquired. |
| W25.W06 Circle of Inevitability | partial / missing; W21 CI | Separate selected copy and era; Default frozen absent copy; Dial local recurrence under explicit policy | Record occurrence and receipt times separately when an apparently repeated day produces news. |
| W25.W07 Shadow Slave | partial / missing; W21 SS Academy/Shore scope | Default independently bound place instances; Dial rate and participation by selected realm/route | Carry actor fatigue and mission terms through crossings without forcing two place calendars to share an epoch. |
| W25.W08 Reincarnation Paradise | partial / partial; `src/book_world_paradise_state.js:35`, `:51-55`; W21 RP | Preserve retained hub/mission local freeze; Default actual mission contract decides advance; Dial hub versus destination pacing | Settlement and extraction must consume the same local deadline interval, without awarding a second idle life during hub absence. |
| W25.W09 Jujutsu Kaisen | partial / missing; W21 JJ | Selected city/era I; Default prepared safe training only; Dial emergency public progression and response barriers | A storm may move institutions while the character trains, but the return report cannot invent a witnessed fight. |
| W25.W10 Bleach | partial / missing; W21 BL | Default explicit local clock for selected society/location; Dial realm-rate mapping | A message delivered across realms needs sender occurrence and recipient local receipt coordinates. |
| W25.W11 Fate | partial / missing; W21 FA | Default one selected scenario/era and preparation queue; Dial timed conflict versus ordinary life windows | Distinguish a contract deadline from a nightly clock window so a later AU does not inherit the wrong conflict schedule. |
| W25.W12 Hunter x Hunter | partial / missing; W21 HX | Default eligible practice with declared rest/inputs; Dial exam/travel/appointment windows by chosen slice | A training result can be retained while an optional public enrollment window passes; do not silently grant exam participation. |
| W25.W13 Fullmetal Alchemist | partial / missing; W21 FM | Default station/material-bound work; Dial local institution hours and journeys | Elapsed time cannot pay missing material costs; failed/blocked work needs a visible reason in the return report. |
| W25.W14 Naruto | partial / missing; W21 NA | Default selected safe practice or commissioned duty; Dial mission clocks and instructor attendance | An unattended drill can grant its own practice but not an instructor's assessment or rank. |
| W25.W15 A Soldier's Life | partial / missing clock/away floor in inspected W1/W8 design; runtime paused per COMMON | Default preserve paused runtime scope; Dial future duty/calendar policy only as documentation | Do not make implementing its duty adapter a gate for the current idle proof. |
| W25.W16 Original Frontier | partial / partial; C1/C7-C14; W21 short home row | Default preserve G epoch while routing one home frame; Dial selected queued practice/work and E1 policy separately | Home is the cheapest place to compare callback versus boundary settlement because both paths already exist. |
| W25.W17 Fallout | Deprioritized; no new local-clock proof inspected | Later selected-world adapter only; no new clock gate for this lane | Preserve existing content. |
| W25.W18 Skyrim | Deprioritized; no new local-clock proof inspected | Later selected-world adapter only; no new clock gate for this lane | Preserve existing content. |
| W25.W19 Elden Ring | Deprioritized; no new local-clock proof inspected | Later selected-world adapter only; no new clock gate for this lane | Preserve existing content. |

## Five ranked repairs, design only

| Rank / code | Exact seam and repair proposal | Why this order / future done check |
|---|---|---|
| 1 / W25.R1 | `src/weather.js:63-195` plus W23/W28 climate derive: remove global place/time and smoothing-history dependence from pure evaluation; route every climate/light reader through one local frame | Smallest isolated seam with visible cross-world mismatch. Same inputs produce same temperature/rain/light after midnight, forecast, reload and away segmentation. Prototype stays under W28's ownership. |
| 2 / W25.R2 | `src/main.js:737-842`, `src/expansion_engine.js:438`, local-native projections C5: make schedule/price/festival facts read the same instance frame; distinguish actor age | Establish authority before catch-up multiplies mistakes. A frozen MoL I cannot display advanced global season or close a local offer because home G moved. Home G compatibility retained. |
| 3 / W25.R3 | `src/main.js:7426-7429`, `src/components/trader_component.js:113`, `src/absorb_c2/local_life.js:87-125`: express crossed day/shift/attempt boundaries explicitly | Fix known partition dependence. Compare shift end before midnight and two crossed market days; A19 remains paused until its cadence is selected. |
| 4 / W25.R4 | Existing `computeAway` + `advanceSimulation` + `persistExpansion` at C10/C16/D1: one host settlement of allowance, actual consumed minutes, eligibility, cursor and rewards | Required before playable closed-return progress; reuse ledger, no second scheduler. Failed publish, reload, literal import and a mid-allowance choice cannot double pay. Keep packing interval excluded. |
| 5 / W25.R5 | `src/event_feed.js`, `src/causal_situations.js`, anchor provenance and existing caused-effect owner: add storm-crossing projection to durable return report | Make missed/held public change legible. No crossing reported outside consumed local interval; no sealed truth; rendering report does not rerun events or claim rewards. W24/W26 own ordering/carriers. |

## More to consider, other stuff

| Code / disposition | Consequence and Default + Dial |
|---|---|
| W25.X1 ACCOUNT FOR NOW: three budgets | Elapsed cap, causal boundary budget and browser execution budget solve different problems. Default return unspent elapsed at a real choice and yield bounded browser work; Dial authored cap/banking. Existing synchronous host draining is not a UI responsiveness guarantee. |
| W25.X2 ACCOUNT FOR NOW: no synthetic weather history | Weather endpoint equality does not prove crops/ferry/exposure equality. Default segment at relevant weather thresholds; Dial analytical integrals only if equivalent. Save caused effects with IDs even when weather itself is derived. |
| W25.X3 ACCOUNT FOR NOW: clock authority on migration | Default preserve old G/I/lease semantics and initialize a new wall cursor with no retro-credit; Dial explicit versioned policy conversion. Pack/source revision pins and saved fractional remainder matter as much as elapsed totals. |
| W25.X4 ACCOUNT FOR NOW: return knowledge versus omniscience | Default show elapsed, gains, blocked work and public missed storms; route learned details through W26 carriers. Dial sandbox inspect detail. A private event's existence must not leak through report totals or warning text. |
| W25.X5 ACCOUNT FOR NOW: active life versus remote economy | Default one player's personal training allowance; independently authorized local NPC/lease work can coexist without duplicating the player. Dial explicitly supported remote sites. Copying a branch must not copy the same unclaimed wall allowance. |
| W25.X6 LATER: named pause semantics | Default distinguish manual pause, blocking choice, unsupported body, absent world and save-failure pause in reports. Dial whether elapsed is held/banked/dropped per owner. Do not let a visual pause decide reward time. |
| W25.X7 LATER: read-only clock lens | Show world/instance, local minute/calendar, joined coordinate, policy, support interval, next barrier and last settlement cause in W27's inspector. Default read only; mutations remain receipt-bearing cheats. Desktop first under existing UI owner. |
| W25.X8 ACCOUNT FOR NOW: cross-world carried duration | Default each condition/contract declares actor-clock or place-clock authority. Dial specific realm-rate adaptation. A potion should not alternately expire under G and I on successive screens. |
| W25.X9 LATER: non-Earth calendar adapter | Default calendar projection may have no season or weekday, with custom day/year length. Dial authored cycles per world. An indoor hub can still have work shifts without inheriting home weather. |

Three ranked suggestions:

1. **W25.S1:** Feed C1-C20 and A01-A22 to the existing away/derived owners and W23/W28, beginning with the pure explicit clock/place climate derive. Keep host settlement and new policies out of this docs lane.
2. **W25.S2:** Scope the first future playable proof to one supported home queue and one eligible passive condition, one capped elapsed claim and one barrier. Use D1-D7 comparison before broad native consumers; preserve current A19 and E1 policy boundaries.
3. **W25.S3:** Add the storms-crossed public projection and read-only clock page after that proof. Then select world-specific rate/absence adapters in canon-first order, using the existing local-clock campaigns as reuse evidence rather than launching new world engines.

## Appendix: module-level time-expression census

SHOWN lexical inventory of `src/**/*.js` at this snapshot. This includes readers, planners, validators, UI projections and timestamp sinks, so a match is not proof of an independent ticker. Functional authority is C1-C20 above. J labels below for explicit `state.clock`/equivalent joined-state expressions refer to that expression only; a bare supplied `clock` is P until its caller binds it. An I or L projection may coexist with joined receipt checks. Supplemental rows include indirect minute/year and callback readers that a `.clock` search misses. Line samples are enough to locate each module, not an assertion that every receipt use is gameplay advancement. Modules with no temporal expressions, such as declarative recipe data, are covered through their consuming call sites rather than falsely labeled readers.

| Module / locator samples | Clock evidence in this module | Role / qualification |
|---|---|---|
| `src/absorb_b/furniture.js:104` | J | Time use/guard/receipt; see functional family above |
| `src/absorb_c2/local_life.js:51`; `src/absorb_c2/local_life.js:61`; `src/absorb_c2/local_life.js:62` | P supplied/projected time | Time use/guard/receipt; see functional family above |
| `src/absorb_d/fort.js:52`; `src/absorb_d/fort.js:67`; `src/absorb_d/fort.js:83` | J | Time use/guard/receipt; see functional family above |
| `src/absorb_e1/pacing.js:4`; `src/absorb_e1/pacing.js:5`; `src/absorb_e1/pacing.js:6` | P supplied/projected time | Time use/guard/receipt; see functional family above |
| `src/action_legibility.js:472` | I | Time use/guard/receipt; see functional family above |
| `src/active_effects.js:15`; `src/active_effects.js:19`; `src/active_effects.js:28` | P supplied/projected time | Time use/guard/receipt; see functional family above |
| `src/adventure_notebook.js:37`; `src/adventure_notebook.js:41`; `src/adventure_notebook.js:42` | J | Time use/guard/receipt; see functional family above |
| `src/agreed_duty_continuation.js:89`; `src/agreed_duty_continuation.js:124`; `src/agreed_duty_continuation.js:139` | J | Time use/guard/receipt; see functional family above |
| `src/agreed_duty_facts.js:11`; `src/agreed_duty_facts.js:37`; `src/agreed_duty_facts.js:69` | J | Time use/guard/receipt; see functional family above |
| `src/anchor_snapshots.js:24`; `src/anchor_snapshots.js:39`; `src/anchor_snapshots.js:75` | P supplied/projected time | Time use/guard/receipt; see functional family above |
| `src/audit_remainder_combat_fit_facts.js:31`; `src/audit_remainder_combat_fit_facts.js:37`; `src/audit_remainder_combat_fit_facts.js:90` | J | Time use/guard/receipt; see functional family above |
| `src/audit_remainder_combat_fit_hooks.js:37`; `src/audit_remainder_combat_fit_hooks.js:49` | J | Time use/guard/receipt; see functional family above |
| `src/audit_remainder_combat_fit_host.js:69`; `src/audit_remainder_combat_fit_host.js:78` | J | Time use/guard/receipt; see functional family above |
| `src/audit_remainder_combat_objectives_battle.js:56`; `src/audit_remainder_combat_objectives_battle.js:73`; `src/audit_remainder_combat_objectives_battle.js:104` | J | Time use/guard/receipt; see functional family above |
| `src/audit_remainder_combat_objectives_content.js:36`; `src/audit_remainder_combat_objectives_content.js:41` | J | Time use/guard/receipt; see functional family above |
| `src/audit_remainder_combat_objectives_state.js:16`; `src/audit_remainder_combat_objectives_state.js:22`; `src/audit_remainder_combat_objectives_state.js:32` | J | Time use/guard/receipt; see functional family above |
| `src/audit_remainder_consequences_facts.js:27`; `src/audit_remainder_consequences_facts.js:28`; `src/audit_remainder_consequences_facts.js:52` | J | Time use/guard/receipt; see functional family above |
| `src/audit_remainder_home_facts.js:20`; `src/audit_remainder_home_facts.js:24`; `src/audit_remainder_home_facts.js:33` | J | Time use/guard/receipt; see functional family above |
| `src/audit_remainder_home_host.js:43`; `src/audit_remainder_home_host.js:48` | J | Time use/guard/receipt; see functional family above |
| `src/audit_remainder_host.js:27` | J | Time use/guard/receipt; see functional family above |
| `src/audit_remainder_livelihood_facts.js:33`; `src/audit_remainder_livelihood_facts.js:34`; `src/audit_remainder_livelihood_facts.js:57` | J | Time use/guard/receipt; see functional family above |
| `src/audit_remainder_livelihood_host.js:64` | J | Time use/guard/receipt; see functional family above |
| `src/audit_remainder_offers_host.js:50` | J | Time use/guard/receipt; see functional family above |
| `src/audit_remainder_offers_state.js:14`; `src/audit_remainder_offers_state.js:29`; `src/audit_remainder_offers_state.js:30` | J | Time use/guard/receipt; see functional family above |
| `src/audit_remainder_runtime.js:25` | J | Time use/guard/receipt; see functional family above |
| `src/audit_remainder_state.js:39`; `src/audit_remainder_state.js:49`; `src/audit_remainder_state.js:65` | J | Time use/guard/receipt; see functional family above |
| `src/audited_workshop_fixture.js:106`; `src/audited_workshop_fixture.js:166` | J | Time use/guard/receipt; see functional family above |
| `src/audited_workshop_lesson.js:90`; `src/audited_workshop_lesson.js:108`; `src/audited_workshop_lesson.js:159` | J | Time use/guard/receipt; see functional family above |
| `src/away_ledger.js:6`; `src/away_ledger.js:8`; `src/away_ledger.js:22` | W | Time use/guard/receipt; see functional family above |
| `src/backlog_expansion_body.js:103`; `src/backlog_expansion_body.js:113`; `src/backlog_expansion_body.js:130` | J | Time use/guard/receipt; see functional family above |
| `src/backlog_expansion_core.js:30`; `src/backlog_expansion_core.js:65` | J | Time use/guard/receipt; see functional family above |
| `src/backlog_expansion_host.js:33`; `src/backlog_expansion_host.js:86`; `src/backlog_expansion_host.js:88` | J | Time use/guard/receipt; see functional family above |
| `src/backlog_expansion_opportunities.js:87`; `src/backlog_expansion_opportunities.js:107`; `src/backlog_expansion_opportunities.js:153` | J | Time use/guard/receipt; see functional family above |
| `src/backlog_expansion_replacement.js:55`; `src/backlog_expansion_replacement.js:65`; `src/backlog_expansion_replacement.js:68` | J | Time use/guard/receipt; see functional family above |
| `src/backlog_expansion_time.js:132`; `src/backlog_expansion_time.js:165`; `src/backlog_expansion_time.js:173` | J | Time use/guard/receipt; see functional family above |
| `src/backlog_expansion_transit.js:50`; `src/backlog_expansion_transit.js:133`; `src/backlog_expansion_transit.js:172` | J | Time use/guard/receipt; see functional family above |
| `src/body_progression.js:66` | J | Time use/guard/receipt; see functional family above |
| `src/body_ui.js:23` | J | Read projection; no clock ownership implied |
| `src/book_care_facts.js:20`; `src/book_care_facts.js:74`; `src/book_care_facts.js:108` | J | Time use/guard/receipt; see functional family above |
| `src/book_care_runtime.js:20`; `src/book_care_runtime.js:24`; `src/book_care_runtime.js:36` | J | Time use/guard/receipt; see functional family above |
| `src/book_world_effects.js:19`; `src/book_world_effects.js:21` | J | Time use/guard/receipt; see functional family above |
| `src/book_world_mol_actions.js:122`; `src/book_world_mol_actions.js:124`; `src/book_world_mol_actions.js:125` | J, I | Time use/guard/receipt; see functional family above |
| `src/book_world_mol_host.js:23`; `src/book_world_mol_host.js:24`; `src/book_world_mol_host.js:40` | J, I | Time use/guard/receipt; see functional family above |
| `src/book_world_mol_native.js:37`; `src/book_world_mol_native.js:38`; `src/book_world_mol_native.js:142` | I | Time use/guard/receipt; see functional family above |
| `src/book_world_mol_state.js:25`; `src/book_world_mol_state.js:27`; `src/book_world_mol_state.js:36` | J, I | Time use/guard/receipt; see functional family above |
| `src/book_world_paradise_actions.js:190`; `src/book_world_paradise_actions.js:209`; `src/book_world_paradise_actions.js:224` | J, I | Time use/guard/receipt; see functional family above |
| `src/book_world_paradise_campaign_facts.js:16`; `src/book_world_paradise_campaign_facts.js:31`; `src/book_world_paradise_campaign_facts.js:49` | J | Time use/guard/receipt; see functional family above |
| `src/book_world_paradise_campaign_runtime.js:18`; `src/book_world_paradise_campaign_runtime.js:22`; `src/book_world_paradise_campaign_runtime.js:32` | J | Time use/guard/receipt; see functional family above |
| `src/book_world_paradise_carriers.js:10`; `src/book_world_paradise_carriers.js:23`; `src/book_world_paradise_carriers.js:30` | J, I | Time use/guard/receipt; see functional family above |
| `src/book_world_paradise_host.js:19`; `src/book_world_paradise_host.js:28`; `src/book_world_paradise_host.js:29` | J, I | Time use/guard/receipt; see functional family above |
| `src/book_world_paradise_native.js:37`; `src/book_world_paradise_native.js:38`; `src/book_world_paradise_native.js:142` | I | Time use/guard/receipt; see functional family above |
| `src/book_world_paradise_state.js:18`; `src/book_world_paradise_state.js:19`; `src/book_world_paradise_state.js:36` | J, I | Time use/guard/receipt; see functional family above |
| `src/capabilities.js:52` | J | Time use/guard/receipt; see functional family above |
| `src/causal_situations.js:25`; `src/causal_situations.js:26`; `src/causal_situations.js:31` | J | Time use/guard/receipt; see functional family above |
| `src/causal_story_actors.js:73`; `src/causal_story_actors.js:130`; `src/causal_story_actors.js:134` | J | Time use/guard/receipt; see functional family above |
| `src/causal_story_core.js:61`; `src/causal_story_core.js:62`; `src/causal_story_core.js:69` | J | Time use/guard/receipt; see functional family above |
| `src/causal_story_host.js:42`; `src/causal_story_host.js:48`; `src/causal_story_host.js:84` | J | Time use/guard/receipt; see functional family above |
| `src/causal_story_native.js:140` | J | Time use/guard/receipt; see functional family above |
| `src/causal_story_ui.js:285`; `src/causal_story_ui.js:286` | P supplied/projected time | Read projection; no clock ownership implied |
| `src/character_bio.js:15`; `src/character_bio.js:31`; `src/character_bio.js:50` | J | Read projection; no clock ownership implied |
| `src/cheat_cards.js:94`; `src/cheat_cards.js:96` | P supplied/projected time | Time use/guard/receipt; see functional family above |
| `src/chronicle.js:158` | J | Time use/guard/receipt; see functional family above |
| `src/chronicle_ui.js:82`; `src/chronicle_ui.js:83`; `src/chronicle_ui.js:118` | J | Read projection; no clock ownership implied |
| `src/components/trader_component.js:87`; `src/components/trader_component.js:99`; `src/components/trader_component.js:113` | G | Time use/guard/receipt; see functional family above |
| `src/conditions.js:225`; `src/conditions.js:229` | G | Time use/guard/receipt; see functional family above |
| `src/content_packs.js:18`; `src/content_packs.js:112`; `src/content_packs.js:115` | P supplied/projected time | Time use/guard/receipt; see functional family above |
| `src/contextual_balm_facts.js:8`; `src/contextual_balm_facts.js:30`; `src/contextual_balm_facts.js:31` | J | Time use/guard/receipt; see functional family above |
| `src/contextual_balm_host.js:38`; `src/contextual_balm_host.js:41`; `src/contextual_balm_host.js:44` | J | Time use/guard/receipt; see functional family above |
| `src/contextual_balm_native.js:18`; `src/contextual_balm_native.js:28`; `src/contextual_balm_native.js:31` | J | Time use/guard/receipt; see functional family above |
| `src/cooling_refinement_facts.js:31`; `src/cooling_refinement_facts.js:34`; `src/cooling_refinement_facts.js:41` | J | Time use/guard/receipt; see functional family above |
| `src/cooling_refinement_host.js:27`; `src/cooling_refinement_host.js:28`; `src/cooling_refinement_host.js:70` | J | Time use/guard/receipt; see functional family above |
| `src/crush_social_facts.js:9` | J | Time use/guard/receipt; see functional family above |
| `src/crush_social_host.js:102`; `src/crush_social_host.js:119` | J | Time use/guard/receipt; see functional family above |
| `src/crush_social_views.js:70`; `src/crush_social_views.js:82`; `src/crush_social_views.js:155` | J | Time use/guard/receipt; see functional family above |
| `src/data/locations.js:349`; `src/data/locations.js:365`; `src/data/locations.js:367` | G | Time use/guard/receipt; see functional family above |
| `src/display.js:4221`; `src/display.js:4225` | G | Read projection; no clock ownership implied |
| `src/event_feed.js:13`; `src/event_feed.js:17`; `src/event_feed.js:18` | J | Read projection; no clock ownership implied |
| `src/everyday_life.js:46` | J | Time use/guard/receipt; see functional family above |
| `src/exchange_ui.js:17`; `src/exchange_ui.js:28` | J | Read projection; no clock ownership implied |
| `src/expansion_engine.js:141`; `src/expansion_engine.js:148`; `src/expansion_engine.js:164` | J | Time use/guard/receipt; see functional family above |
| `src/expedition_ui.js:66`; `src/expedition_ui.js:68`; `src/expedition_ui.js:69` | J | Read projection; no clock ownership implied |
| `src/factorio_retort_host.js:54`; `src/factorio_retort_host.js:86`; `src/factorio_retort_host.js:101` | J | Time use/guard/receipt; see functional family above |
| `src/feature_expansion_battle.js:119`; `src/feature_expansion_battle.js:272` | J | Time use/guard/receipt; see functional family above |
| `src/feature_expansion_book_host.js:67`; `src/feature_expansion_book_host.js:75`; `src/feature_expansion_book_host.js:131` | J | Time use/guard/receipt; see functional family above |
| `src/feature_expansion_destination_host.js:21`; `src/feature_expansion_destination_host.js:25`; `src/feature_expansion_destination_host.js:26` | J, I | Time use/guard/receipt; see functional family above |
| `src/feature_expansion_destination_native.js:20`; `src/feature_expansion_destination_native.js:75`; `src/feature_expansion_destination_native.js:110` | I | Time use/guard/receipt; see functional family above |
| `src/feature_expansion_host.js:62` | J | Time use/guard/receipt; see functional family above |
| `src/feature_expansion_nested_carriers.js:10`; `src/feature_expansion_nested_carriers.js:24`; `src/feature_expansion_nested_carriers.js:31` | J, I | Time use/guard/receipt; see functional family above |
| `src/feature_expansion_nested_chains.js:286` | J | Time use/guard/receipt; see functional family above |
| `src/feature_expansion_nested_chains_host.js:80`; `src/feature_expansion_nested_chains_host.js:95` | J | Time use/guard/receipt; see functional family above |
| `src/feature_expansion_nested_host.js:43`; `src/feature_expansion_nested_host.js:44`; `src/feature_expansion_nested_host.js:61` | J, I | Time use/guard/receipt; see functional family above |
| `src/feature_expansion_nested_life.js:147` | J | Time use/guard/receipt; see functional family above |
| `src/feature_expansion_nested_native.js:27`; `src/feature_expansion_nested_native.js:108` | I | Time use/guard/receipt; see functional family above |
| `src/feature_expansion_objects_host.js:10`; `src/feature_expansion_objects_host.js:131` | J | Time use/guard/receipt; see functional family above |
| `src/feature_expansion_powers_host.js:62` | J | Time use/guard/receipt; see functional family above |
| `src/feature_expansion_refinements_host.js:63`; `src/feature_expansion_refinements_host.js:68` | J | Time use/guard/receipt; see functional family above |
| `src/feature_expansion_society.js:50` | J | Time use/guard/receipt; see functional family above |
| `src/feature_expansion_society_host.js:88` | J | Time use/guard/receipt; see functional family above |
| `src/feature_expansion_work_plan.js:111`; `src/feature_expansion_work_plan.js:129`; `src/feature_expansion_work_plan.js:143` | J | Time use/guard/receipt; see functional family above |
| `src/field_care_battle.js:11`; `src/field_care_battle.js:21` | J | Time use/guard/receipt; see functional family above |
| `src/field_care_facts.js:11`; `src/field_care_facts.js:24`; `src/field_care_facts.js:43` | J | Time use/guard/receipt; see functional family above |
| `src/field_care_host.js:26` | J | Time use/guard/receipt; see functional family above |
| `src/field_ui.js:45`; `src/field_ui.js:46`; `src/field_ui.js:60` | J | Read projection; no clock ownership implied |
| `src/field_workshop.js:121` | J | Time use/guard/receipt; see functional family above |
| `src/foundation_interaction_policy.js:58`; `src/foundation_interaction_policy.js:67`; `src/foundation_interaction_policy.js:96` | J | Time use/guard/receipt; see functional family above |
| `src/game_absorption_assay_facts.js:54`; `src/game_absorption_assay_facts.js:76`; `src/game_absorption_assay_facts.js:84` | J | Time use/guard/receipt; see functional family above |
| `src/game_time.js:18`; `src/game_time.js:44`; `src/game_time.js:55` | G | Time use/guard/receipt; see functional family above |
| `src/generated_people.js:27`; `src/generated_people.js:30`; `src/generated_people.js:45` | P supplied/projected time | Time use/guard/receipt; see functional family above |
| `src/home_furnishing_facts.js:22`; `src/home_furnishing_facts.js:31`; `src/home_furnishing_facts.js:75` | J | Time use/guard/receipt; see functional family above |
| `src/home_furnishing_host.js:30`; `src/home_furnishing_host.js:32`; `src/home_furnishing_host.js:34` | J | Time use/guard/receipt; see functional family above |
| `src/ink_narrative.js:136`; `src/ink_narrative.js:151`; `src/ink_narrative.js:234` | J | Time use/guard/receipt; see functional family above |
| `src/known_routes_host.js:155` | J | Time use/guard/receipt; see functional family above |
| `src/life_experience_host.js:14` | P supplied/projected time | Time use/guard/receipt; see functional family above |
| `src/lore_practice_facts.js:21`; `src/lore_practice_facts.js:25`; `src/lore_practice_facts.js:41` | J | Time use/guard/receipt; see functional family above |
| `src/lore_practice_host.js:93` | J | Time use/guard/receipt; see functional family above |
| `src/lore_practice_runtime.js:29`; `src/lore_practice_runtime.js:85`; `src/lore_practice_runtime.js:108` | J | Time use/guard/receipt; see functional family above |
| `src/main.js:319`; `src/main.js:325`; `src/main.js:556` | G, J, W | Time use/guard/receipt; see functional family above |
| `src/management/host.js:72`; `src/management/host.js:74` | J | Time use/guard/receipt; see functional family above |
| `src/management/validation.js:8`; `src/management/validation.js:39`; `src/management/validation.js:41` | J | Time use/guard/receipt; see functional family above |
| `src/market_saturation.js:76`; `src/market_saturation.js:96` | P supplied/projected time | Time use/guard/receipt; see functional family above |
| `src/mixture_ui.js:25`; `src/mixture_ui.js:27`; `src/mixture_ui.js:37` | P supplied/projected time | Read projection; no clock ownership implied |
| `src/models/combat.js:137`; `src/models/combat.js:230`; `src/models/combat.js:232` | W | Time use/guard/receipt; see functional family above |
| `src/models/hero.js:8` | P supplied/projected time | Time use/guard/receipt; see functional family above |
| `src/native_battle.js:33`; `src/native_battle.js:35` | J | Time use/guard/receipt; see functional family above |
| `src/native_realm_traveler.js:22`; `src/native_realm_traveler.js:58` | J | Time use/guard/receipt; see functional family above |
| `src/native_trade_transaction.js:39` | P supplied/projected time | Time use/guard/receipt; see functional family above |
| `src/nethack_fieldcraft_facts.js:11`; `src/nethack_fieldcraft_facts.js:28`; `src/nethack_fieldcraft_facts.js:33` | J | Time use/guard/receipt; see functional family above |
| `src/nethack_fieldcraft_feats.js:18` | J | Time use/guard/receipt; see functional family above |
| `src/nethack_fieldcraft_host.js:19`; `src/nethack_fieldcraft_host.js:38` | J | Time use/guard/receipt; see functional family above |
| `src/observation_channels.js:100`; `src/observation_channels.js:103`; `src/observation_channels.js:130` | P supplied/projected time | Time use/guard/receipt; see functional family above |
| `src/observation_ui.js:15` | J | Read projection; no clock ownership implied |
| `src/original_frontier_campaign_host.js:41`; `src/original_frontier_campaign_host.js:73`; `src/original_frontier_campaign_host.js:75` | J | Time use/guard/receipt; see functional family above |
| `src/party_battle.js:15`; `src/party_battle.js:57`; `src/party_battle.js:59` | J | Time use/guard/receipt; see functional family above |
| `src/party_ui.js:26` | J | Read projection; no clock ownership implied |
| `src/pocket_observation.js:63`; `src/pocket_observation.js:65`; `src/pocket_observation.js:75` | J | Time use/guard/receipt; see functional family above |
| `src/pocket_realm_host.js:62`; `src/pocket_realm_host.js:89`; `src/pocket_realm_host.js:104` | J, I, L | Time use/guard/receipt; see functional family above |
| `src/pocket_realm_scenes.js:303` | P supplied/projected time | Time use/guard/receipt; see functional family above |
| `src/promise_ui.js:43`; `src/promise_ui.js:69` | J | Read projection; no clock ownership implied |
| `src/proto23_world_actions.js:27` | J | Time use/guard/receipt; see functional family above |
| `src/proto23_world_host.js:38`; `src/proto23_world_host.js:40`; `src/proto23_world_host.js:82` | J | Time use/guard/receipt; see functional family above |
| `src/proto23_world_native.js:61`; `src/proto23_world_native.js:62`; `src/proto23_world_native.js:168` | I | Time use/guard/receipt; see functional family above |
| `src/proto23_world_state.js:38`; `src/proto23_world_state.js:44`; `src/proto23_world_state.js:120` | J | Time use/guard/receipt; see functional family above |
| `src/pursuit.js:37`; `src/pursuit.js:42`; `src/pursuit.js:45` | J | Time use/guard/receipt; see functional family above |
| `src/pursuit_ui.js:28` | J | Read projection; no clock ownership implied |
| `src/realm_boundary_rules.js:69`; `src/realm_boundary_rules.js:94`; `src/realm_boundary_rules.js:100` | P supplied/projected time | Time use/guard/receipt; see functional family above |
| `src/realm_cargo.js:173`; `src/realm_cargo.js:178`; `src/realm_cargo.js:189` | P supplied/projected time | Time use/guard/receipt; see functional family above |
| `src/realm_clock_leases.js:30`; `src/realm_clock_leases.js:31`; `src/realm_clock_leases.js:32` | I, L | Time use/guard/receipt; see functional family above |
| `src/realm_connections.js:84`; `src/realm_connections.js:133`; `src/realm_connections.js:160` | P supplied/projected time | Time use/guard/receipt; see functional family above |
| `src/realm_state.js:25`; `src/realm_state.js:28`; `src/realm_state.js:30` | J, I, L | Time use/guard/receipt; see functional family above |
| `src/realm_traveler_profiles.js:189`; `src/realm_traveler_profiles.js:192`; `src/realm_traveler_profiles.js:259` | P supplied/projected time | Time use/guard/receipt; see functional family above |
| `src/reference_gameplay_feats.js:54`; `src/reference_gameplay_feats.js:166`; `src/reference_gameplay_feats.js:186` | J | Time use/guard/receipt; see functional family above |
| `src/reference_gameplay_host.js:7`; `src/reference_gameplay_host.js:33`; `src/reference_gameplay_host.js:47` | J | Time use/guard/receipt; see functional family above |
| `src/reference_gameplay_state.js:25`; `src/reference_gameplay_state.js:27`; `src/reference_gameplay_state.js:29` | J | Time use/guard/receipt; see functional family above |
| `src/repository_absorption_facts.js:19` | J | Time use/guard/receipt; see functional family above |
| `src/repository_absorption_host.js:133` | J | Time use/guard/receipt; see functional family above |
| `src/repository_absorption_workplan.js:133`; `src/repository_absorption_workplan.js:245` | J | Time use/guard/receipt; see functional family above |
| `src/save_files.js:66`; `src/save_files.js:159` | P supplied/projected time | Time use/guard/receipt; see functional family above |
| `src/seeded_streams.js:42`; `src/seeded_streams.js:97`; `src/seeded_streams.js:98` | P supplied/projected time | Deterministic stream scope, not a ticker |
| `src/settled_text_effects.js:163`; `src/settled_text_effects.js:191` | monotonic wall | Time use/guard/receipt; see functional family above |
| `src/simulation.js:53`; `src/simulation.js:54`; `src/simulation.js:59` | J | Time use/guard/receipt; see functional family above |
| `src/simulation_contracts.js:223`; `src/simulation_contracts.js:248`; `src/simulation_contracts.js:249` | J | Time use/guard/receipt; see functional family above |
| `src/simulation_effects.js:90`; `src/simulation_effects.js:118`; `src/simulation_effects.js:124` | J | Time use/guard/receipt; see functional family above |
| `src/simulation_ui.js:51`; `src/simulation_ui.js:83` | J | Read projection; no clock ownership implied |
| `src/skill_expansion_content.js:200`; `src/skill_expansion_content.js:210` | J | Time use/guard/receipt; see functional family above |
| `src/skill_expansion_host.js:60` | J | Time use/guard/receipt; see functional family above |
| `src/status_care_facts.js:18`; `src/status_care_facts.js:35`; `src/status_care_facts.js:38` | J | Time use/guard/receipt; see functional family above |
| `src/steam_boh_facts.js:50`; `src/steam_boh_facts.js:88`; `src/steam_boh_facts.js:111` | J | Time use/guard/receipt; see functional family above |
| `src/steam_boh_host.js:39` | J | Time use/guard/receipt; see functional family above |
| `src/steam_boh_runtime.js:24`; `src/steam_boh_runtime.js:28`; `src/steam_boh_runtime.js:47` | J | Time use/guard/receipt; see functional family above |
| `src/steam_df_facts.js:23`; `src/steam_df_facts.js:39`; `src/steam_df_facts.js:55` | J | Time use/guard/receipt; see functional family above |
| `src/steam_df_runtime.js:31`; `src/steam_df_runtime.js:32`; `src/steam_df_runtime.js:45` | J | Time use/guard/receipt; see functional family above |
| `src/steam_lamb_facts.js:46`; `src/steam_lamb_facts.js:95` | J | Time use/guard/receipt; see functional family above |
| `src/steam_lamb_runtime.js:20`; `src/steam_lamb_runtime.js:46`; `src/steam_lamb_runtime.js:51` | J | Time use/guard/receipt; see functional family above |
| `src/steam_oni_facts.js:40`; `src/steam_oni_facts.js:86` | J | Time use/guard/receipt; see functional family above |
| `src/steam_oni_runtime.js:29`; `src/steam_oni_runtime.js:40`; `src/steam_oni_runtime.js:57` | J | Time use/guard/receipt; see functional family above |
| `src/storylet_deck.js:16`; `src/storylet_deck.js:21`; `src/storylet_deck.js:33` | J | Time use/guard/receipt; see functional family above |
| `src/storylet_ui.js:21`; `src/storylet_ui.js:24` | J | Read projection; no clock ownership implied |
| `src/structured_container_runtime.js:51`; `src/structured_container_runtime.js:59`; `src/structured_container_runtime.js:90` | J | Time use/guard/receipt; see functional family above |
| `src/structured_life_runtime.js:11`; `src/structured_life_runtime.js:16`; `src/structured_life_runtime.js:32` | J | Time use/guard/receipt; see functional family above |
| `src/structured_pack_runtime.js:63`; `src/structured_pack_runtime.js:66`; `src/structured_pack_runtime.js:72` | J | Time use/guard/receipt; see functional family above |
| `src/structured_pack_state.js:47`; `src/structured_pack_state.js:70` | J, I | Time use/guard/receipt; see functional family above |
| `src/structured_renewal.js:48` | J | Time use/guard/receipt; see functional family above |
| `src/systems_workshop_runtime.js:11`; `src/systems_workshop_runtime.js:13` | J | Time use/guard/receipt; see functional family above |
| `src/systems_workshop_ui.js:19` | J | Read projection; no clock ownership implied |
| `src/systems_workshop_validation.js:29`; `src/systems_workshop_validation.js:30` | J | Time use/guard/receipt; see functional family above |
| `src/technique_ui.js:109` | J | Read projection; no clock ownership implied |
| `src/techniques.js:142`; `src/techniques.js:144`; `src/techniques.js:159` | J | Time use/guard/receipt; see functional family above |
| `src/titles.js:3`; `src/titles.js:35`; `src/titles.js:36` | P supplied/projected time | Time use/guard/receipt; see functional family above |
| `src/town_content.js:76` | J | Time use/guard/receipt; see functional family above |
| `src/town_ui.js:41` | J | Read projection; no clock ownership implied |
| `src/verifier.js:21`; `src/verifier.js:22`; `src/verifier.js:76` | monotonic wall | Profiling only |
| `src/village_career.js:161` | P supplied/projected time | Time use/guard/receipt; see functional family above |
| `src/weather.js:104`; `src/weather.js:118`; `src/weather.js:125` | G | Time use/guard/receipt; see functional family above |
| `src/workspace_layout.js:107`; `src/workspace_layout.js:108` | monotonic wall | Time use/guard/receipt; see functional family above |
| `src/world_completion_bridge.js:23`; `src/world_completion_bridge.js:45` | J | Time use/guard/receipt; see functional family above |
| `src/world_completion_learning_facts.js:37`; `src/world_completion_learning_facts.js:42`; `src/world_completion_learning_facts.js:55` | J | Time use/guard/receipt; see functional family above |
| `src/world_completion_learning_runtime.js:16`; `src/world_completion_learning_runtime.js:41`; `src/world_completion_learning_runtime.js:44` | J | Time use/guard/receipt; see functional family above |
| `src/world_completion_lens_facts.js:40`; `src/world_completion_lens_facts.js:48`; `src/world_completion_lens_facts.js:62` | J | Time use/guard/receipt; see functional family above |
| `src/world_completion_lens_host.js:58` | J | Time use/guard/receipt; see functional family above |
| `src/world_completion_lens_runtime.js:31`; `src/world_completion_lens_runtime.js:49`; `src/world_completion_lens_runtime.js:52` | J | Time use/guard/receipt; see functional family above |
| `src/world_completion_life_facts.js:19`; `src/world_completion_life_facts.js:30`; `src/world_completion_life_facts.js:54` | J | Time use/guard/receipt; see functional family above |
| `src/world_completion_life_runtime.js:14` | J | Time use/guard/receipt; see functional family above |
| `src/world_completion_materials_facts.js:37`; `src/world_completion_materials_facts.js:124`; `src/world_completion_materials_facts.js:202` | J | Time use/guard/receipt; see functional family above |
| `src/world_completion_materials_host.js:38`; `src/world_completion_materials_host.js:62` | J | Time use/guard/receipt; see functional family above |
| `src/world_completion_materials_runtime.js:43` | J | Time use/guard/receipt; see functional family above |
| `src/world_instances.js:108`; `src/world_instances.js:109`; `src/world_instances.js:110` | I | Time use/guard/receipt; see functional family above |
| `src/world_rhythm.js:5`; `src/world_rhythm.js:6`; `src/world_rhythm.js:7` | P supplied/projected time | Time use/guard/receipt; see functional family above |
| `src/world_visit_history.js:30` | J | Time use/guard/receipt; see functional family above |
