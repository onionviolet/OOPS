# Province War fit: logistics and supply

Read-only fit check of `/Users/weiwei/code/province-war`, 2026-10-14. **PROPOSALS only.** No Province War file changed or tests/gameplay run. Keep baseline map/UI, troop domains, research and base-game delivery ahead of granular logistics, per its live AGENTS and README.

**F1, SHOWN locally:** `src/routing.mjs` already makes movement duration depend on edge distance, terrain, army speed and travel modifiers. `src/recovery.mjs` already gates paid replacement work on legal owned working barracks, hostile presence and a finite training slot. These are stronger starting points than an unrelated caravan subsystem.

**F2, SHOWN locally:** `src/campaign.mjs` imports the optional activity economy. `extensions/next-economy-v1/upkeep.mjs` snapshots unit identity/activity for each interval, carries fractional demand, allocates paid resources proportionally, records due/paid/shortfall, and checks conservation. It already blocks some operations after measured money/oil shortage and applies a food-shortfall consequence. Do not add a second upkeep debit. This is source evidence, not a fresh acceptance of the extension.

**F3, SHOWN locally:** `src/transport-network.mjs` describes itself as an opt-in scaffold not consumed by the current campaign. Existing `wwii-host`/routing consumers have separate integration. A graph existing on disk is not a functioning supply route.

| Rank | Adaptation from Vagrus | Smallest bounded packet and check |
|---|---|---|
| P1 | Quote total logistics, not travel alone | Add a read-only route quote from current movement and upkeep rules: duration, expected consumption, reserve and delay sensitivity. Quote must not debit or invent stock. Compare quote to actual interval receipts in one existing scenario. |
| P2 | Capacity and physical access constrain deliveries | Later opt-in supply order on one existing friendly land route: source depot, destination formation, finite shipment, carrier capacity and reservation. Capture/blocked edge causes a named interruption. Preserve identity and exact conservation across save/reload. |
| P3 | Infrastructure changes delivered cost | Later connect a real built crossing/road to route duration and delivery access. Invalidate the quote when control/infrastructure changes; compare before/after arrival and consumed support. Do not infer current live logistics from Vagrus's default static import-distance model. |

Accounting invariant for P2: national/source stock, reserved shipment, in-transit goods, received stock, consumed support and losses must reconcile. Decide first whether a shipment transfers already-debited reserves or merely provides access to national stock. Mixing both creates duplicate charges or resources.

Use Vagrus's cargo/support trade-off and explicit interruption state. Keep Province War's continuous tick, unit identity and scenario-specific transport authority. Do not import camp-click pacing, companion loyalty, mandatory caravan food UI or an assumed autonomous merchant AI.

Upstream research evidence: [economy/travel](ECONOMY_TRAVEL.md), [event/interrupt grammar](EVENT_ENGINE.md), [report](REPORT.md). Review links are inside YAIRPG's allowed output directory so Province War can refer to them without a second copied audit owner.
