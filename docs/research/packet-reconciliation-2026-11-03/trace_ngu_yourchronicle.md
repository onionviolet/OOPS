# Trace B: NGU Idle + Your Chronicle packets vs src/ (read-only, 2026-11-03)

Depth caveat: src/ has ~1035 files. Greps plus reading of structured_renewal.js, action_legibility.js, feature_expansion_work_plan.js, chronicle.js snippets and the named consumer lines. "Untraced" means no keyword hit; it is not proof of absence. No AD/PROJECT.md line defers any of these; PROJECT.md focus is LOTM Klein journey, so none are current-focus work. Desktop-first UI priority applies (mobile deferred).
NGU = docs/research/ngu-idle/IMPLEMENTATION_PACKETS.md (H=heading), ST = SMALL_TOUCHES.md row. YC = docs/research/your-chronicle/IMPLEMENTATION_PACKETS.md (PACKETS.json mirrors, not separately read).

| ID | Claim + locator | Class | Src evidence | Note |
|---|---|---|---|---|
| NGU-P1 | Quantified transition preview (current, next, loss, retention, reactivation) on renewal; NGU IP.md "P1" | partial | structured_renewal.js:23-38 (lost/retain/sequence), :42 stale-sequence assert; main.js:2097,2125 wiring; frontier_campaign_ui.js:46 renders "Lose: ... Keep: ... Gain:" | Read producer, commit and consumer. Rows are prose strings; no numeric current/next values or reactivation conditions seen. |
| NGU-P2 | Unlock reasons: learned vs usable vs blocked from same predicate; "P2" | partial | action_legibility.js:132-159 blockers from preview.reasons + requirement rows; action_legibility_ui.js:132 list consumed by feature_expansion_ui.js:4 and others | Blocker text from the action predicate exists. No separate "learned but missing means" state found. |
| NGU-P3 | Desktop activity board, two jobs side by side; "P3" | missing | Only per-panel work views: projectAcceptedWorkLegibility at feature_expansion_host.js:62, home_household_panel.js:27, original_frontier_campaign_host.js:104 | No cross-activity board file found (grep board/dashboard). Projection inputs exist. |
| NGU-P4 | Voluntary restriction on an existing solution; "P4" | missing | continuation_laws.js:12,17 uses `c.challenge` as a gate for a different mechanic | No voluntary-restriction consumer seen. |
| NGU-P5 | Retained-practice cost/speed projection; "P5" | partial | power_models.js:60 power.costScale; simulation_contracts.js:178 masteryBands; warm_hand_start_content.js:54 costScale 0.5 at mastery 3 | Mastery scaling executes. No next-cost projection to UI found. |
| NGU-P6 | Ready-result reminder; "P6" | missing | Hits only unrelated (home_*.js "unclaimed site") | No reminder consumer found. |
| NGU-P7 | Work-plan target release / capacity-return projection; "P7" | partial | feature_expansion_work_plan.js:12 statuses, :146-156 settleAccepted pauses with reason, :181 | Stop and pause with reason exists. No target/finite-goal control or "capacity returned" display found. |
| NGU-P8 | Multi-means project; "P8" (marked parked) | missing | none | Packet parks itself on content; not traced further. |
| ST-T1 | Resource rails with unit and total | untraced | work_ledger_ui.js:54 only unrelated | |
| ST-T2 | Stable feature address across reset | untraced | | |
| ST-T3 | Learned but needs tool | partial | action_legibility.js:11-17 known/disclosure model; no "learned" label | See P2. |
| ST-T4 | Unknown vs blocked | partial | generated_people_ui.js:65 "N undiscovered"; action_legibility known() gate | Per-surface only. |
| ST-T5 | Ready icon + text | untraced | | |
| ST-T6 | Precise disabled reason | already-implemented | action_legibility.js:132-159 (reason map, requirement rows) | Read the code; consumed via action_legibility_ui.js. |
| ST-T7 | Readable lock text | untraced | | |
| ST-T8 | Current and next values | partial | frontier_campaign_ui.js:46 | Prose only. See P1. |
| ST-T9 | Consequence in play terms | untraced | | |
| ST-T10 | Contributor rows | partial | display.js:4299 create_stat_breakdown (upstream stat breakdown) | Upstream core stats only; not new systems. |
| ST-T11 | Loss separated from retention | already-implemented | structured_renewal.js:38; frontier_campaign_ui.js:46 | Field renewal only. |
| ST-T12 | Dormant retention | missing | | "dormant" hits are LOTM cast place only (book_world_lotm_cast_host.js:321). |
| ST-T13 | Settle before clearing preview | missing | | |
| ST-T14 | Mastery-after-restart explanation | partial | warm_hand_start_content.js:54 | Mechanic only. |
| ST-T15 | Target control states | missing | | See P7. |
| ST-T16 | Capacity returned display | missing | | |
| ST-T17 | Other work runs while page selected | untraced | | |
| ST-T18 | Display vs simulation cadence | untraced | | |
| ST-T19 | Ready-result reminder | missing | | See P6. |
| ST-T20 | Optional challenge terms | missing | | |
| ST-T21 | Different entry reset per conduct | missing | | |
| ST-T22 | Durable personal best | partial | dojo_tower.js:7 `best`; continuation_laws.js:5 best | Different systems; no per-attempt vs best time. |
| ST-T23 | Reward cap clarity | untraced | | |
| ST-T24 | Modifier controls beside inventory | untraced | | |
| ST-T25 | Prose region | untraced | | |
| ST-T26 | Distinct means | missing | | See P8. |
| YC-P1 | Late archive index: paid job after missed inheritance gives routeSignals; YC IP.md "YC-P1" | missing | Producers: chronicle.js:117 (missed), :207-211 (routeSignals set via resolve("cartographer")); consumers: event_feed.js:96, expedition_content.js:71, life_experience.js:4. chronicle_ui.js:136-142 gates inherit on dutyKept | Grep "late index" returns nothing. Prerequisite state exists; the new job does not. |
| YC-P2 | Lio carries archive crate for work quote; "YC-P2" | missing | Lio exists only as combat partner: feature_expansion_powers.js:12-64 (harness, equip_lio); party_battle.js | No noncombat crate or work-quote consumer. Archive crate: none in chronicle. |
| YC-P3 | Renewed field review after re-earning mastery 2; "YC-P3" | missing | Producer exists: frontier_campaign.js:67-69 (field.renewed); consumers audit_remainder_combat_fit_hooks.js:14, audit_remainder_combat_fit_facts.js:102 only expire preparation | No review choice or account found. |
| YC-P4 | Native book/study step in work plans; "YC-P4" | missing | feature_expansion_work_plan.js:50 accepts only command/travel/wait; reading via main.js start_reading (village_ui.js:23) | Doc's stated gap confirmed in code. |

## Top 5 MISSING by value
1. NGU-P3 desktop activity board: matches desktop-first priority; all projection inputs exist (projectAcceptedWorkLegibility in 3 hosts).
2. NGU-P1 numeric current/next/reactivation rows in the renewal preview: small change to structured_renewal.js:38 plus frontier_campaign_ui.js:46.
3. NGU-P7 + ST-T15/T16 work-plan target and capacity-return projection: settleAccepted already holds the data.
4. YC-P4 native reading/study as a work-plan step: unblocks the YC-P1 route; needs a staged adapter.
5. NGU-P6/ST-T19 ready-result reminder: small, but no existing owner file found.
(YC-P1 to YC-P3 are new content with specific prerequisites; rank below these as systems work.)

## Could not trace
ST-T1, T2, T5, T7, T9, T17, T18, T23, T24, T25 (no keyword anchor; need UI-level reading). PACKETS.json not diffed against the md. No tests inspected beyond file names (structured_renewal.test.js, chronicle.test.js, party_battle.test.js exist; not read).
