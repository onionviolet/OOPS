# Three high-payoff gaps beyond the prior finite traces

These are selected new paths, not complete systems. The ranking favors reusable state relationships. No YAIRPG implementation is selected.

## D1: Dialogue as information exchange

Prior actors research traced ordinary conversation, mood and favour. It did not document the distinct RPG graph and Jianghu information pipeline.

Shown path: Wnd_JianghuTalk.JustTalk selects first contact, interests, known facts or ambient chat using rank, skill, favour and condition checks. GetRandomTalk filters tags/rank/NPC exclusions. TalkAbout's Track branch checks whether a location fact is known, whether it was already told, and whether the target is interested or vigilant. A successful request can update known location, knowledge keys and favour. JianghuMgr.Save retains know-NPC, clue and discovery state. TalkFinish can schedule a future rumour event. This is a conversation with domain consumers, not merely a text unlock.

The parallel RPG path loads DlgDef graphs, filters VisibleScript, orders/disables options via EnableScript and executes Lua after a chosen node. Function nodes support waiting and non-dialogue actions. Speaker identity resolves portraits. All 19 RPG and eight Jianghu talk files were decoded privately after reconstructing the static file reader. The graph scan found 187 nodes, 26 visibility scripts, 22 execute scripts and 23 custom function classes. There are 289 tagged Jianghu data rows after two header lines. The fallback Missing row is present; bad mod overrides could still remove it. Structural reading does not equal full writing or closure coverage.

Sources: `managed/Wnd_JianghuTalk.cs:86-132,824-860,1089-1220,1673-1792`; `managed/XiaWorld/JianghuMgr.cs:743-800,1290-1370`; `managed/XiaWorld/DlgDef.cs`; `managed/XiaWorld/DlgMgr.cs:170-275`; `managed/Wnd_Dlg.cs:108-285`.

PROPOSAL P1, knowledge/social owner: let an actor share one useful route observation under explicit willingness/knowledge conditions. Repeat telling recognizes the prior exchange. Keep knowledge, affection, access and truth separate. Gate: talk, refusal, later use of the learned fact, reload/import and spoiler-safe journal, all on a fresh rebuilt origin. No fixed lifetime limit on attempts.

## D2: Spatial arrangement with actual effects

Prior depth note named fengshui as unread. This pass follows room aggregation and conditional item effects rather than claiming all elemental simulation is solved.

Shown: AreaRoom.DoUpdateData ignores invalid objects and unfinished buildings, accumulates eligible building fengshui, beauty, wall/material temperature and layout occupancy. It averages building contributions, applies layout mapping and evaluates exits/room use. A relic's CheckActive tests actual room placement, room rank/type/size, elemental strength and special placement conditions. The room then applies positive or negative relic contributions and binds character modifiers to item ID and room ID. A changed room rank updates sect aggregate state and owner modifiers. Activation/deactivation has distinct effects. Room owner add/remove handlers also update their character modifiers.

Compare source paths: a relic that satisfies its environment adds its contribution; a failed condition subtracts it and uses a negative modifier scale. A room with no eligible building contribution uses a sentinel rank path. This is not an empirical comparison of two played layouts. Full door geometry, all special predicates, threshold tables, character-need consumers and elemental diffusion remain unread.

Sources: `managed/XiaWorld/AreaRoom.cs:125-147,414-550,688-785`; `managed/XiaWorld/FengshuiItemData.cs:55-110`; `managed/XiaWorld/BuildingHelperFengshui.cs`. The small helper enables the display/control route; the real room math is elsewhere.

PROPOSAL P2, environment/effects owner: one workshop arrangement changes one existing useful process through a reversible site effect. Show the relevant condition and actual beneficiary. Gate: matched two-layout trial with actual resource spending/output, relocation/removal, reload/import and no orphaned modifier. This remains a proposal, not a new construction milestone.

## D3: Regional policy as a funded continuing commitment

Regional agencies were outside the prior selected institution/travel path. Readable Outspread data now provides a concrete chain.

Shown: OutspreadMgr.OnStep updates regions, policies, construction and disasters on separate cadence checks. RegionPolicyCostStep charges once per simulation day check. It tests material/influence/population support, stops an unfunded policy with a shortage reason, otherwise debits and applies daily effects. CostItem draws from global regional storage, space-ring stock and map items. Round-up for material quantities differs from integer abstract costs. This is a materially funded policy, not an unconstrained repeat button.

Readable `policy_Disaster.xml` inherits a relief base with 20 aid per daily effect; drought relief names wheat upkeep, floods/earthquakes use stone and cold uses wood. Focus has a cost multiplier. Aid records its sending school, accumulates received amount and calls solved closure at the threshold. Timeout invokes a different closure. StopDisaster removes the disaster's symbiotic policy unlock and related discovery entries, triggers the selected closure story and clears the disaster. Complete story outputs and every transfer/reservation edge remain unread.

Sources: `input/Settings/Outspread/Policy/policy_Disaster.xml`; `managed/XiaWorld/OutspreadMgr.cs:1914-1955,2943-3045,3770-3855,3958-4078`; `managed/XiaWorld/OutspreadCost.cs`; `managed/XiaWorld/OutspreadPolicyDailyEffect.cs`. Twenty Outspread inputs contain 1,689 XML elements; that count includes structural elements and does not equal policies.

PROPOSAL P3, institution/economy owner: a local relief duty consumes real surplus and advances a shared need; shortage suspends the duty with a recoverable reason. Retain who contributed and whether relief arrived in time. Gate: funded day, shortage day, resumed support, resolved/timeout alternatives and reload/import without duplicate payment. A Province War reader may reuse this dossier as research, but its separate integration authority still applies.
