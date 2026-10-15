# theory-of-magic: three deeper systems

Ranked by payoff for this aspect backfill, especially earlier text/save/authoring gaps. These are targeted traces. Full semantic completeness and future YAIR selection are separate.

## D1 Event record versus event scheduler

Prior status: Previously undocumented code path.

Trace: unlock eligibility -> optional unlock notification -> amount/change -> EVT_EVENT -> typed log; repeated events obey repeat/value guard.

Evidence: https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/items/gevent.js; https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/events.js

Limit: rand has an empty branch here. Do not infer a working chance scheduler from the property comment alone.

PROPOSAL: route this pattern through the existing owners named in ASPECTS; no new parallel scheduler/save store and no automatic source adaptation.

## D2 Character and Hall persistence adapters

Prior status: Explicit prior unread network/storage area narrowed.

Trace: Profile active PID -> character JSON write -> Hall reference save; loader adapters include IndexedDB and fallback localStorage.

Evidence: https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/modules/profile.js; https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/modules/persist/persist.js; https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/modules/persist/persist-db.js; https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/modules/persist/persistLocal.js

Limit: Fallback is not a transaction across characters. Full remote adapter and all import errors remain unread.

PROPOSAL: route this pattern through the existing owners named in ASPECTS; no new parallel scheduler/save store and no automatic source adaptation.

## D3 Combat assignment and minion capacity

Prior status: Explicit prior unread family narrowed.

Trace: owned minion inventory -> active allies/capacity -> timed action/target -> combat result/log.

Evidence: https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/composites/combat.js; https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/inventories/minions.js

Limit: Capacity and actor ownership are separate. Complete AI/target and spell economy remains partial.

PROPOSAL: route this pattern through the existing owners named in ASPECTS; no new parallel scheduler/save store and no automatic source adaptation.

