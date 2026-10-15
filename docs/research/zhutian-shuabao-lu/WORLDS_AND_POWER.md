# Worlds, institutions and carried growth

SHOWN tables and consumers are separate from STATED help. Locators use [SOURCES](SOURCES.md).

## W1: plane content and entry

`wm.json` has shape 14x34x1: row zero is an unknown sentinel, rows 1-13 are plane definitions. Paraphrased themes in ID order:

| ID | Theme |
|---|---|
| 1 | Late Han / Three Kingdoms |
| 2 | Martial-arts wandering society |
| 3 | Tomb exploration |
| 4 | Crusading kingdoms |
| 5 | Classical Chinese supernatural tales |
| 6 | Japanese warring states |
| 7 | World War II |
| 8 | Mortal cultivation |
| 9 | Interplanetary war |
| 10 | Fighting-energy fantasy continent |
| 11 | Azer-style fantasy continent |
| 12 | Superheroes |
| 13 | Westward mythic journey |

These are source themes, not verified adaptations or YAIRPG world requests. No fidelity claim follows from a title.

S03 SHOWN: plane rows reference sets of encounter regions, images and numeric progression/reward data. `sq.json` has 160x14x1 allocated cells, `cj.json` 166x23x1, `shili.json` 43x26x1. Shapes include sentinel, blank and unused cells; they are not counts of playable content. SHOWN factions span historical states, martial schools, supernatural groups, modern alliances and divine institutions. Each uses shared data formats.

S04 STATED: base completion opens later available planes; towns offer trade, skill learning and recruitment; faction outposts offer tasks, training and recruits; later difficulties and secret realms open after base progress (`bz[3,4]`, `[1,36:40]`, `[4,35:38]`). Unlock handler at `project/6/0/1/157/8/6/8/11/8/9` also has development/demo refusal routes. Rows do not prove admission.

S05 SHOWN: enter-plane accepts a plane and difficulty, assigns current plane, writes `save[36,1,0]`, clears the alternate-world location at `save[88,1,0]`, clears encounter-mode selectors, switches map animation from plane data and refreshes map locations, information, fog and quest checks. The map sprite is explicitly sized 2016x1136. A separate alternate-world entry sets the other coordinate and clears current plane. This is a stateful shared shell, not a separate executable per world.

## W2: place differences with actual value

S04 STATED (`bz` zero-based row,column):

| Difference | Cells | Consequence |
|---|---|---|
| Currency can differ, or be shared across worlds | 5,35; 2,36; 3,36 | Local buying power differs from home cash. Exact exchange/arbitrage consumer unread. |
| Material mix differs by place, attributed to climate/geology | 6,35; 3,49 | Farming destination matters even with shared combat. This does not prove simulated geology. |
| Faction skill groups differ in type, element and effect | 4,38; 5,36 | Travel broadens available methods; admission also uses reputation and prerequisites. |
| Plane reputation is independent; contribution is spent at factions | 7,35; 5,38 | Recognition and spendable service credit should not be conflated. Personal friendship is unproved. |
| Tower in plane 3; beast hunt in 4; rebirth in 8; rift in 10 | 1,41:43; 1,61 | A world offers a reason to return beyond a stronger enemy palette. |
| Every plane has a world tree and guardian | 1,60; 2,60 | Shared recurring challenge can grant special recipes, meta currency and leaves. It is not unique local physics. |

## W3: shared power, compatibility and rebirth

S10 SHOWN: 42x33 career table, 378x52 skill table, 194x37 actor table, 203x12 stat table. Career names range from guards and scholars through martial, magic, cultivation, gunnery and mech roles to cross-plane/divine roles, but the records share a schema and battle consumers. Several career descriptions are placeholders. Do not mistake a rich list for a proven separate magic engine per plane.

S04 STATED: profession controls learnable skill types, normal attack and battle coefficients. Switching profession requires prerequisite career levels and an item; incompatible skill types become ineffective (`bz[6,17]`, `[7,18]`, `[8,18]`, `[2,14]`). Skills can come from teachers or manuals; learned/unlocked skills can enter a practice queue; higher quality skills are stronger but harder to train (`[3,17]`, `[2,32]`, `[6,32]`, `[2,46]`). No claim of arbitrary simultaneous multiclassing follows.

S11 SHOWN: rebirth's successful branch checks tier below 4, level against current tier times 100, unlocked destiny-slot count and required material quantity. It writes current tier plus one to the actor's saved tier and current level plus one to the saved level; calls around the branch and material deduction require a full transaction audit before claiming conservation. Help says the purpose is a higher level cap and another destiny-board region (`bz[2,43]`, `[4,43]`). The selected function is advancement, not proof of death, timeline restart or whole-world reset. A separate late-game sainthood function checks tier 4, level 400 and eight slots; full divine gameplay is unread.

## W4: carry and relationships

INFERRED from S05/S10/S12: one shared roster, item store and growth structures persist while map/encounter selectors change. Help explicitly connects recruited people to team and company work and local equipment to home sales. The inspected entry handler is not an exhaustive border policy. Cargo exceptions, lost equipment, fuel suppression, companion consent, personal memories, body/controller replacement and same-instance social history remain unread.

YAIRPG should retain its richer named carrier contracts. The useful source lesson is that acquired things keep finding useful work. It is not evidence that all learned methods should function everywhere, that a faction score is friendship, or that repeated farming is a lived-world revisit. K3/K5/K6/K7/K8/K9/K15/K18/K25/K29; P02/P03/P04/P05/P06/P07/P17.
