# Scene layer spike (CBD254), 2026-11-13

Everything here is a proposal. Nothing in it is accepted direction, and no existing file was changed.

**State reached:** implemented and unit-tested. Below the AD43 floor (no build receipt, no route from a life, nothing shown, no consumer, no save exercised in the app). Not played. Agent-verified, not human-reviewed.

**Files**

- [src/scene_layer.js](../../src/scene_layer.js): pure module, 327 lines. Imports `gen_kit.js` (keyed draws) and `world_substrate.js` (link readers). Nothing imports it.
- [tests/scene_layer.test.js](../../tests/scene_layer.test.js): 9 tests.

**Checks**

| Check | Result | Gap |
|---|---|---|
| `node --test tests/scene_layer.test.js` | 9 pass, 0 fail | Unit only. No engine world, no laws or reactors composed in. |
| `npm run -s check:arch` | exit 0, no new cycle, no `main.js` import | Run on a shared checkout with other sessions' uncommitted edits present. |
| `npm test`, build, browser | not run (out of scope for the spike) | The new test file has no row in `tests/duration_budget.json`; it runs in about 0.2 s. |

Design source: [combat considerations](../COMBAT_AND_CONFLICT_CONSIDERATIONS_2026-10-18.md), CBD62, CBD69 to CBD71, CBD94, CBD95, CBD169 to CBD171, CBD205, CBD206, CBD239 to CBD246, and the CBD254 row.

## What was built

| Code | Part | What it does |
|---|---|---|
| SL1 | `planScene(world, place, opts)` | The fresh generation for a place: spot holders, links, and where each person and thing goes. Reads the place kind, the things recorded there and the place's ways out. Reads nothing that was kept, so it is the yardstick for "what differs". |
| SL2 | `enterSceneOps` | World ops that unfold the plan with last time's kept differences laid over it. |
| SL3 | `leaveSceneOps` | World ops that fold the spots away and write only the differences to the place's `state.scene` slice. No difference, no slice. |
| SL4 | `SCENE_LAYOUTS` | Four place kinds (slope, lane, hall, room) plus a one-spot fallback, so any place can be looked at closely. A lane has one keyed optional spot (a recess) to show the keying. |
| SL5 | `SCENE_PROPERTIES`, `SCENE_VERBS`, `HANDS` | Six thing words (heavy, fixed, lit, brittle, liquid, hinged), a `broken` condition, two spot conditions (dark, slick), and eight verbs offered by properties. |
| SL6 | `addressable(world, {actor, subject, verb}, {means})` | CBD169 in one answer: which of perceive, reach and means fails first, with a reason code and all three results. |
| SL7 | `sceneActions(world, actor)` | The verb and subject pairs the scene offers, generated from properties (CBD94). |

How the done check came out:

- **Same place, same spots.** Two plans of the same record are equal. Enter, leave, enter gives the same holders and links. The keyed recess appears for some draw roots and not others, and never changes between calls.
- **Changed persists, unchanged stores nothing.** After a slick step, a blocked way, a lamp left at the other end and a barred gate, the place keeps three small rows and the world's own gate link is closed. A save and restore in the folded state unfolds to the same scene. Putting everything back removes the slice. An untouched visit leaves holders, links and laws identical to before (see F1 for the one exception, the effect log).
- **Moving a thing changes the scene and an action.** With the cart in the lane there is a spot beside it and "shelter cart" is offered. Wheel the cart into the yard the day before and the lane has no such spot or action, and the slope in the yard has gained one, with no row written for carts (CBD71).
- **The duelling club is a hall plus overrides.** All three hand-built variants (practice, pursuit, plain exchange) come out with the same place ids, the same link rows (id, kind, ends, cost, state) and every person and wand in the same place. Exactly what differs is in F5.

## Findings

**What worked**

- **F1. Spots as ordinary place holders work with no new record kind (CBD239 holds).** `holder_add`, `link_add`, `link_set`, `move` and the `state` op were enough. A spot marks its parent with `refs.scene`, carries `detail: 'near'` and is removed on leave. The link readers (`linkReach`, `worldLinks`) served both the perceive and reach tests unchanged.
- **F2. Most of what a fight changes needs no keeping at all.** Damage, a snuffed lamp or a changed grip sits on the thing, and the thing is the world's thing (CBD70). The scene keeps only position inside the place, spot conditions and link changes. The kept slice in the test is three rows.
- **F3. Ways out can be the world's own links seen from inside.** The plan attaches each link that touches the place to an exit spot. Barring the gate inside the scene writes `closed` to the world link on leave, so nothing about a door is stored twice.
- **F4. Properties decide verbs without a row per thing (CBD94, CBD95, CX3).** A lamp recorded as lit, brittle and liquid offers take, throw, snuff, pour and break. Breaking it drops pour and break. A cart recorded as heavy offers push and shelter. A means row can ignore a property (a lifting charm ignores heavy) or reach along a sightline, and the three tests still answer.
- **F5. The club comparison, exactly.** From the hall row: `floor` (renamed `far-floor`) and `doorway`. From overrides: the dais dropped, two platforms added, bare ids, all of the links, and who stands where. So the hall layout contributes two of four spots and none of the links. Differences from the hand-built world: the generated world has a parent place (`great-hall`) that the hand-built one lacks; generated spots carry `refs.scene`, the tag `scene.spot` and `detail: 'near'`, where the hand-built places have none. A recorded thing that makes several spots (a duelling platform with two ends and a sightline) would move most of that override into the place record; the spike only lets a thing make one spot.

**What the substrate lacked (requests, none made)**

- **R1. A quiet way to place holders.** `move` publishes `departed` and `arrived`. Entering and leaving a lane with four holders wrote 16 rows into the effect log, which is capped at 200, and any reactor on those kinds would fire as if people had walked in. A fold is a change of detail, not travel. Request: a `place` op, or a `quiet` flag on `move`, that changes position with no effect. This is the one thing that stops "an unchanged place stores nothing" from being literally true.
- **R2. No op changes `detail`.** It can only be set when a holder is made. The spike marks the spots near, which does switch the world to near steps while a scene is open, but the parent place stays as it was. Request: a `detail` op on places.
- **R3. A place cannot sit inside a place.** `place` must be empty on a place holder, so "inside" is carried by `refs.scene`, which no substrate reader knows. `present(place)` and effects landing on the parent miss everything standing on a spot while the scene is open. Request: either a parent field on places with readers that can include children, or a stated rule that effects aimed at a place reach its open spots.
- **R4. Tags cannot change after a holder is made**, so spot traits that moves can change (cover worn away, a narrow gap widened) have to be properties. The spike uses tags only for fixed layout traits.
- **R5. Thing properties must be declared by the composing world.** `SCENE_PROPERTIES` uses bare ids (heavy, lit, fixed). They belong in `world_quantities.js` beside `flammable` and `hardness` if two domains read them; the spike could not add them there.
- **R6. `holder_remove` needs an empty place and files quantities to a row.** Spots carry no quantities by default, so this was fine. A spot that gained a quantity (noise, light) would leave a `holder.removed` row at each leave; a tie-in needs to decide whether spot quantities fold into the parent.

**Limits of the spike**

- **G1.** Cover has no facing or toughness (CBD206). A spot beside a big thing is tagged `cover` and nothing reads it.
- **G2.** `slick` is recorded and kept, and no test reads it. Only `dark` (perceive) and closed links (reach) act as conditions (CBD205).
- **G3.** A person standing at a narrow spot does not block the way ("Flint is between you and it"). Reach reads links only.
- **G4.** People are not kept at spots on leave (dial `keepPeople`). Things are.
- **G5.** No attention, coming-events list or seconds-to-minutes conversion (three of CBD241's five parts). No sealed or hidden things: perceive is truth, not what the character knows.
- **G6.** Reason codes (`dark`, `apart`, `closed`, `is:heavy`) are codes, not player text.
- **G7.** The kept slice names spots by id. If a layout row changes later, a kept row for a spot that no longer exists is skipped on enter and dropped at the next leave. There is no layout revision in the draw address yet.

## What a tie-in lane should reuse

- **T1. One call pair per visit.** `enterSceneOps` when the player's place goes near, `leaveSceneOps` when it goes far, both applied through `applyWorldOps` (or `applyEngineOps`) with a cause. The caller owns when; the module never applies anything.
- **T2. `addressable` as the single blocked-reason source** for player choices and for a foe's policy (CBD169, CBD106). `contest.js` and `world_effects.resolveReach` already reason over the same links, so a contest move's contact can be checked by the same function instead of a second reach rule.
- **T3. Layout rows and overrides as content.** A world pack passes `overrides[placeId]` for an authored confrontation; nothing authored goes in the save. The club override in the test is the template.
- **T4. Things carry `scene_spot` and `scene_replaces`** when where they stand matters; otherwise a keyed draw places them. Big things make their own spot.
- **T5. Before a second hand-built scene**, settle R1 and R3 with the substrate owner. Both change how every later reader sees a scene, and both are cheaper now than after fights, stealth and sites depend on the workaround.

## Suggested order (proposal)

1. R1 and R2 as substrate ops (small, the substrate owner's call).
2. R3 decided, since CBD255 (one coming list for a place) needs to know whether a place's events reach its spots.
3. A read-only walk in a DEV fixture: enter a real place from a world pack and print spots and offered actions, as the first step toward the floor.
