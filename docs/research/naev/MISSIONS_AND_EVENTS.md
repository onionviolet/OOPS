# NV-D1: Mission and event authoring at scale

Pin `f8982244800e86553217a2dba555a0f41c2b87ba`. Shown means inspected static source, not runtime proof.

The intake corpus has 233 mission and 119 event headers, not that many independent campaigns. The mission directory also contains shared modules, readmes and build metadata. 181 mission headers and 54 event headers mark uniqueness. These flags are source choices, not a solo-player limit YAIRPG should inherit.

The mission loader separates header metadata from the Lua program. Availability supports location, faction, system/place, chance, priority, condition, predecessor completion, chapter and uniqueness. The precise path matters:

| Reader | Static route | Consequence |
|---|---|---|
| mission_meetReq | place/system/faction then mission_meetConditionals | Current place and authored gates differ from active mission state. See NV-F12 chapter anomaly. |
| missions_genList | location, nonzero chance, repeated chance attempts, requirements, create, final sorting | A candidate may fail creation because no valid destination or scene claim exists. Offers can be multiple. |
| missions_run | location, requirements, one modulo-based probability attempt, init/cleanup | Do not extend the board's repetition semantics to every mission trigger. |
| events_trigger | trigger/place/system, chance, unique, faction, chapter, Lua condition, create | Independent matching events can all run. This is not a competition for one event slot. |
| Lua lifecycle | create prepares an offer; accept commits it; hooks react to real world actions; finish marks deletion and optionally completion | Displaying, accepting and completing are different transitions. |
| claim_test | exclusive and non-exclusive system/string claims | Scene conflict arbitration, separate from player ownership and local law. |

`Cargo` has chance 960, so board generation performs nine attempts with probability 0.60 each before eligibility and successful initialization. The unconditional expected number is 5.4 attempts that pass the random test, not a promised offer count. Sorting puts smaller priority numbers first; loader priority also permits earlier scene claims. There is no universal cooldown field in these inspected headers. Recurrence often lives in script predicates or timestamp variables.

Empire Recruitment provides a complete small path: landable faction destination selection, named NPC, accept/refuse scene, marker and zero-mass mission parcel, land callback, access flag, reputation, pay, log, finish. The parcel is an objective payload, not proof that every cargo task consumes hold capacity. Ordinary Cargo separately checks free fleet mission capacity.

Sources: [`src/mission.c`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/mission.c); [`src/event.c`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/event.c); [`src/nlua_misn.c` (`misn_finish`)](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/nlua_misn.c); [`src/claim.c`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/claim.c); [`dat/missions/neutral/cargo.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/missions/neutral/cargo.lua); [`dat/missions/empire/emp_cargo00.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/missions/empire/emp_cargo00.lua). Map: K12/K18/K34, P10/P22.
