# Immortality Idle: three deeper systems

Chosen for payoff and gaps in prior coverage. Static findings and original proposals remain separate.

## D1 Log retention is part of narrative architecture

Sources: A02; log.service.ts L23-173.

Shown: Five topics own arrays, but persisted LogProperties includes storyLog, enabled topics and unplayed opening entries. Routine topics are capped300, visible merged list299, and adjacent exact repeated messages increment a repeat count. This distinguishes durable story from transient feedback. The repeat trackValue branch refers to imported repeat rather than the log repeat counter; static anomaly recorded, no runtime diagnosis claimed.

PROPOSAL: Use stable event receipts for behavior-changing memories; compact routine log text independently.

Boundary: Full source copied privately. No claim that routine logs survive reload.

## D2 Save reconstruction and rejection boundary

Sources: A04; game-state.service.ts L489-612,L1355-1394.

Shown: The ii2 envelope is URI-encoded JSON inside base64. Prefix mismatch returns before state assignment. A matching prefix can still throw at decoding/parsing. Default readers normalize properties; item IDs recover function-bearing definitions. Service assignments occur sequentially, so a later failing consumer can follow earlier mutations. saveInterval defaults differ between new state and loaded fallback.

PROPOSAL: Decode and normalize a detached candidate, validate references, then apply once. Keep explicit schema versions in YAIR.

Boundary: No malformed import executed; this is control-flow evidence only.

## D3 Farm clocks and conservation

Sources: A08/A09; farm.service.ts L174-240,L303-348,L408-477.

Shown: Active tick first checks death/seclusion/hell access, then pays aggregated upkeep before ageFields. Seclusion records elapsed days for later processing. Fields split land/fallow/crop assignment, work, harvest timer, max yield and annual average; auto-stagger limits harvest count per crop/interval. In the overflow branch fieldYield is first capped, then leftover is calculated by subtracting the same cap, producing zero despite the carry comment. days==1 additionally decrements the timer on a nonharvest route. Smooth output depends on a shared harvested flag and prior consecutive outputs, so scheduling deserves an explicit equivalence check.

PROPOSAL: A project receipt should account for clock, paid inputs, capped output and retained work before offering batch catch-up.

Boundary: No bug fix or simulations, whole seclusion cost path and subscriber ordering remain partial.
