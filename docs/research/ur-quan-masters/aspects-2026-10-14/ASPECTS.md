# UQM aspects, 2026-10-14

Pinned official revision and evidence labels are in [SOURCES](../SOURCES.md). Covered means the bounded aspect question has selected source evidence, not a whole-game or native pass. PARTIAL lane status preserves the gaps below. Every YAIRPG takeaway is an INFERRED PROPOSAL. No gameplay was changed or launched.

## A01: Dialogue and conversation

Status: covered. Sources: S01, S02, S03, S04, S05, S20, S25, S27 in [source pins](../SOURCES.md).

SHOWN: per-species C functions register stable phrase references and response callbacks. Selection calls the retained callback, then that callback queues NPC phrases, mutates selected flags and offers the next responses. Loaded phrase text has encounter-local suppression; durable manner/visit/knowledge flags select later meetings. LOCDATA binds portrait/font/music and ambient/talk animation data. Text tables contain both player and alien speech. Multi-speaker Zoq-Fot-Pik uses separate queued speaker callbacks; it is not one generic NPC voice.

INFERRED: deepen P19 through speaker purpose, evidence and an actual paid consequence using existing scoped Ink. K6/K20/K31; dialogue owner. Keep disposable exhaustion distinct from retained memory.

**Limit:** Full predicate reachability and every line were not semantically reviewed. See DIALOGUE_SYSTEMS.md and private call-site index.

## A02: Narrative delivery

Status: covered. Sources: S05, S10, S11, S12 in [source pins](../SOURCES.md).

SHOWN: evidence-dependent talk, surface discovery reports, starbase briefings and dated fleet events distribute the story. CheckBulletins reads flags and CurBulletinMask/STARBASE_BULLETS; repeat and first-delivery paths differ. The event dispatcher changes world facts independently of opening the next conversation.

INFERRED: P20/P12 can give one sourced return report with a changed local consumer. K12/K23/K29; characters/events owner. Do not turn a global truth flag directly into every speaker's knowledge.

**Limit:** All ending and discovery-report branches remain unread.

## A03: Implementation architecture

Status: covered. Sources: S01, S02, S11, S12, S16, S17 in [source pins](../SOURCES.md).

SHOWN: native C modules, global campaign state, queues, function-pointer descriptors and resource IDs supply the inspected runtime. starcon.c:Starcon2Main routes CurrentActivity; its timestep path calls GameClockTick. GenerateFunctions provides per-system hooks over defaults. Official gameev.c switches an event selector to C handlers. Dialogue text is external, but its branching logic is compiled C.

INFERRED: retain YAIRPG definition/instance/host separation, P16 and the typed adapter proposed by START_AND_BRANCH_INTEGRATION_MAP. K18/K33/K34. A source pattern does not justify porting global mutable state.

**Limit:** Rendering/audio backend performance and all activity transitions are unread. Preliminary mirror Lua experiments are not official-main architecture.

## A04: Save and persistence

Status: partial. Sources: S13, S14, S15 in [source pins](../SOURCES.md).

SHOWN: save.h defines a versioned magic and tagged Summary, GlobalState, GameState, Events, queue, scan and group chunks. Carrier resources/slots, event clock, fleets, scanned-node masks and groups persist. The loader has a legacy path, and summary-only reading returns before the full load. SaveGame opens the final slot with wb, then deletes on detected I/O failure; LoadGame assigns SIS state and clears queues before later reads.

INFERRED: K18/K33, P16/P24 should preserve the complete native owner envelope and stage restoration before publication. Tags and a legacy loader do not prove failure-safe persistence.

**Limit:** Legacy-format migration internals, exhaustive malformed-input behavior and power-loss/crash recovery were not tested. Offline wall-time catch-up is not established by the inspected save/clock path.

## A05: AI and NPC behavior

Status: partial. Sources: S12, S18, S19 in [source pins](../SOURCES.md).

SHOWN: species combat AI specializes shared ship_intelligence using enemy trajectory, relative facing, energy and cooldown state. Arilou can react to imminent threats using its teleport special; Spathi controls its rear special through geometry. Fleet growth/missions are scripted calendar handlers.

INFERRED: P25, K10/K12 can borrow small explicit tactical policies, while local social schedules need their own evidence. Do not claim whole-NPC planner or player/NPC rule parity.

**Limit:** Most ship AIs, cyborg.c base evaluation and encounter ecology are inventoried but unread in depth.

## A06: UI and information design

Status: covered. Sources: S01, S07, S08, S10 in [source pins](../SOURCES.md).

SHOWN: map destination fuel estimate, fuel-range display, known fleet influence, orbit scans, landing fuel display, contextual response list, conversation summary and cargo sale feedback expose different horizons. RefreshResponses scrolls a response region; input routes select/cancel to choice/summary actions. Sprite and typography behavior are source paths, not observed screenshots.

INFERRED: P01/P18/P19 should show context, actual means and available next action together. K5/K14. Future YAIRPG target is 1366x768 desktop, prose scrolling locally; mobile deferred.

**Limit:** No native visual, keyboard usability, accessibility or current installed display was verified.

## A07: Content authoring and modding

Status: partial. Sources: S02, S16, S17, S27 in [source pins](../SOURCES.md).

SHOWN: phrase IDs in strings.h pair with external #(id) text entries; C callbacks own conditions and state changes. resinst.h and LOCDATA bind content resources. Default planet generation is selectively replaced through GenerateFunctions. Packed and loose resource handling exists under sc2/src/libs/resource and file; it was inventoried only.

INFERRED: P16/P22 and K1/K33/K34 can lint response IDs, external text references, state keys and local overrides. Reuse current YAIRPG schema/Ink validators.

**Limit:** Full addon precedence, all resource pack formats and a stable mod API were not audited. Compiled authoring cost is higher than adding text alone.

## A08: Balance and numbers

Status: covered. Sources: S04, S06, S08, S09, S22, S23 in [source pins](../SOURCES.md).

SHOWN: landingFuel=min(2*SurfaceGravity,3*FUEL_TANK_SCALE); integer travel estimates; per-hazard chance tables; cargo/module/escort limits; technology prices and ownership-aware offers; distinct RU and Melnorme-credit loops. Shield checks can still allow crew damage at the inspected 5 percent failure branch. These are source formulas, not measured balance.

INFERRED: P17/P18 and K5/K8/K9/K28 should quote units and useful limits; exposure/protection and acquisition currency stay distinct. Adapt relationships, not UQM numerical tuning.

**Limit:** No global equilibrium, expected crew-loss simulation, RNG distribution audit or all combat curves.

## A09: Time and scheduling

Status: covered. Sources: S11, S12 in [source pins](../SOURCES.md).

SHOWN: day/month/year with Gregorian leap-year handling, absolute/relative event validation, a date-sorted queue, immediate handling for relative zero delay, played ticks and explicit MoveGameClockDays. The recurring portal opens through an event and schedules closure; closure schedules the next monthly opening. Certain local fleet events defer while the player is in that system.

INFERRED: P10/P13 and K12/K32 can state entry cadence, due consequences and same-boundary policy explicitly. Keep the nested-world owner's local/transit/absence clocks distinct.

**Limit:** No browser-closed progression inferred. Whole-game pause/rate behavior and every event ordering combination were not executed.

## A10: Onboarding and reveal

Status: partial. Sources: S03, S04, S10 in [source pins](../SOURCES.md).

SHOWN: early Spathi contact supports stepped questions; Melnorme procedure flags gate first explanations of fuel/tech/information commerce; zero-credit purchase attempts explain the trade loop; starbase talk supplies equipment and strategic advice. Available options depend on retained progress.

INFERRED: P04/P19 and K4/K11 expose a useful next action when the player first has the means, with repeatable explanation. Avoid hiding routine work behind an entire conversation replay.

**Limit:** Whole fresh-game tutorial ordering, failed-start recovery and all reveal leaks were not reviewed.

## A11: Little touches

Status: covered. Sources: S01, S03, S04, S09, S10, S20, S25, S26 in [source pins](../SOURCES.md).

SHOWN: varying return greetings, speech colors/music/portraits, group banter, dynamic number speech, cargo unloading that can be sped up, distinct full-hold sound, pickup amount/name feedback, summary access and remembered news make a sparse screen feel specific. Voice evidence is text and source, not listened audio.

INFERRED: K14/K19/K20/K27/K31 and P19/P21 benefit from one or two touches per local identity. Keep reward logic outside repaint and audio callbacks.

**Limit:** Twenty-eight individually sourced options are in SMALL_TOUCHES.md; none implemented.

## A12: Other systems

Status: covered. Sources: S04, S06, S09, S12, S22, S23, S24 in [source pins](../SOURCES.md).

SHOWN: expedition refit, allied escort supply, landing risk, a second information economy, unique device possession, travel-layer exits and global fleet politics form connected progression. A device reward can become a real traversal consumer: planets/devices.c requires HyperSpace and enough fuel before setting PORTAL_COUNTER.

INFERRED: K7/K8/K9/K13/K15, P07/P18 and new candidate UQM-N1 provide connected growth between journeys. Keep carriers, permission, knowledge, currency and item possession separate.

**Limit:** Super Melee, netplay, complete ending logic and unrelated subsystems are catalogued, not audited. This source does not establish world-to-world innate-power conversion.
