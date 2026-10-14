# P03 household lane, 2026-10-14

Status: SOURCE IMPLEMENTED; native gameplay IMPLEMENTED-UNVERIFIED. P00 integration required. Do not final-merge this lane as verified gameplay. No push or merge by this lane.

## Authority and scope

Base HEAD verified `0216ccdefcfce79877378f8cb0ee41129fe11c5d`, branch `absorb-all/p23-household`, clean at entry. Coordinator's current assignment explicitly reserves port 18822 and these file areas and authorizes wave 2 now, overriding the prepared packet's instruction to wait for wave 1. The older runs/SESSIONS.md still lists only wave 1; no independent wave-2 reservation file was found. No listener occupied 18822 before serving. Reads: AGENTS, COMMON, PROJECT, USER_VISION, LIFE_SIM_NORTH_STAR, R15/R63/N08/R12 ledger owners, npc_lives, home_furnishing content/host/facts, furniture projection, pinned original HTML relevant furniture/smoke/home/bed/hearth ranges and reader references. No Proto23 source or assets copied.

Target: 1366×768 desktop. Visible intended native outcome: repeated Moss visits change bond/mood, later gift and sleeping benefit; prepaid hearth dries Wet with visible remaining fuel and optional smoke, with ventilation/extinguish/native exit controls. Fiction and balance are reversible proposals. Mobile optimization deferred. No new fixture construction, portable aura, moral score, NPC lifespan policy or foreign save format. Existing d49cb911/379007d7 features retained without reimplementation.

## Row dispositions

| Row | Disposition | Landing and native status |
| --- | --- | --- |
| R15 | Original household proposal implemented | `src/absorb_p23/household/model.js`: one known brindled cat Moss, identity, bond, mood, played-age growth, repeatable gifts and derived sleeping benefit. `furnitureComfort` in owned furniture area derives distinct active furnishings. Native animal enrollment/acquisition/rest consumer OPEN. |
| R63 pet half | Original repeated-bond proposal implemented | Five played minutes between visits, +10 bond, at 30 bond adopts this home. No fixed lifetime interaction/gift cap. Host root sequence is the idempotency gate. Social consequence half stays P10. Native visits OPEN. |
| N08 | Original prepaid hearth proposal implemented | One owned Rough wood log pays 20 played minutes. Three heated minutes remove native Wet. Closed vent builds smoke only after explicit smoke opt-in. Ventilate, extinguish, disable smoke and native exit remove exposure. Native resources/conditions/travel OPEN. |
| R12 home half | Fuelled home drying implemented in module | P03 supplies warmth/drying; no duplication of P04 portable auras, native cooking multipliers, existing paid material-drying jobs or construction. |

## Exact P00 host requests

H1: Register a `household` Here section using `householdPresentation(snapshot)` from `src/absorb_p23/household/host.js`. UI actions emit `{type:'household',id:<model action>,sequence:<current root sequence>}`. Dispatch as `commitHousehold(host,{type:command.id,sequence:command.sequence})`. Importing these modules initializes no native state. Author one **public discovered** original animal meeting route at an actual owned home, and register Moss's stable identity `household.moss` through native discovery/person owners. Never infer a companion from npc_lives, grant a home, or fabricate home/fixture claims. Use the existing owned installed cottage hearth first; other homes need an actual authored hearth fixture before `hearthOwned` can be true.

H2: Implement synchronous `host.read() -> {household?,context,furnitureInput}`. `context` exactly provides `{sequence,clock,homeId,homeOwned,atHome,alive,controlled,animalKnown,hearthOwned,ownedInventory,wet,knownGift}` from the native root played clock, current body, location/access, fixture claim, discovery and resource/custody owners. `homeId` is the stable **world-qualified home identity**, even while outside; `atHome` changes on native travel. `ownedInventory` maps exact native item keys to safely spendable integer counts, excluding borrowed/foreign/escrow/equipped stock. Fuel key `{"id":"Rough wood log"}` and gift key `{"id":"Rat tail"}` reuse native goods. `knownGift` is true only if the gift item is public/known under the native disclosure rule. No secret loot truth or inferred future owner. `furnitureInput` is the existing furnitureProjection snapshot, including actual housing access and home facts context.

H3: `host.preflight(plan,snapshot) -> true` must validate **all** item deltas and conditions plus save ownership before publication. `host.publish(plan,snapshot)` must compare the root sequence and atomically persist/publish `plan.state`, item deltas, condition intents and notices, or reject with zero mutation. Result `{state,effects,notices}` effects are **intents, not fulfillment evidence**. Item intents use `{type:'item',key,amount}`. `{type:'removeCondition',id:'Wet'}` removes/reset native Wet and its weather counter so it does not instantly reappear from stale counters. `{type:'householdSmoke',active,intensity}` is a reversible, named native exposure with no damage policy; clear immediately outside/after controls. Effects-off is the animation master switch; this module emits no animation or timers. Do not debit fuel in a second callback or award a gift before successful atomic publication.

H4: Every actual played-clock advance settles `{type:'tick',elapsed:<clock delta>,sequence:<current root sequence>}` BEFORE further household commands or travel. `commitHousehold` adds one to the root sequence for its proposed transaction. Tick events operate without meeting an animal, and absent state remains absent. Outside ticks consume only previously paid fuel, not inventory. Publish native exit together with `leave` using destination `atHome:false`; settle the prior indoor tick first. No wall-clock load catch-up. Each elapsed interval must have one authoritative location/body/fixture context; split intervals at travel, ownership or body changes rather than using the destination context for the previous interval. If native resource owner changes without incrementing the root sequence, reject stale publication via its own revision too.

H5: Persist one optional native save-envelope block `household` (schema 1) and retain it in root transaction snapshots alongside existing owners. P00 owns choosing/staging that join in main and save files; this lane edits neither. In full-envelope import **before any mutation**, call `preflightHouseholdImport(candidate.household,candidatePlayedClock,candidateRootSequence)`. Absent stays absent. Unsupported schema, fields, identity, negative/nonfinite values, future sequence/clock and mismatched native clock reject. Do not synthesize a block for old saves. Restore block without ticking. Publish block and every other affected native owner atomically under existing durable-save fencing.

H6: During actual native **sleeping** recovery only, multiply once by `householdRest(block,context,furnitureComfort(furnitureProjection(furnitureInput)))`, alongside existing furnitureRecovery. No permanent stat/XP accumulation. At 30 bond, content young Moss adds 3%; after 1440 played minutes, 5%. Distinct active owned furnishing comfort adds 1% per point capped at 6%. Smoke, absence, foreign home or unsupported body suppress the household benefit. Do not call a sleep award action to collect repeated free healing. Existing fixture project costs, selected bed jobs and existing passives retain their meanings.

## Compatibility decisions

C1: State is optional and strict schema 1. No old-save enrollment, free fuel, animal, gift or migration grant. JSON serialization is exact in module checks. Block/native clock must match at import, so an old block cannot burn retroactively. Player state and saves were never accessed.

C2: Gift settlement happens only on a real eligible visit, at most one gift per visit, at least 60 played minutes since the prior gift. Missing known item defers it without spending the opportunity. Long absence produces no pile of catch-up gifts. Sequence comparison plus atomic native publisher prevents replay; model evaluation alone cannot guarantee inventory idempotency.

C3: Smoke is explicitly opted in, reversible and nonlethal in this proposal. Extinguishing discards prepaid fuel without refund. Outside clears exposure, while room smoke dissipates on played ticks. No auto-refuel, daily chores, offline debt or retroactive resource charge.

## Checks and evidence

Implementation commit: `c6cb1e75c7701cb47131437c961a9cd04e24b8de` (four task-only source/test paths). No Co-Authored-By, push, merge or committed dist.

| Check | Exact result and evidence |
| --- | --- |
| Focused + furniture regression | `node --test tests/p23-household*.test.js tests/absorb_b.test.js`: 16/16 PASS, 0 failure/skip/cancellation; `focused-test.log`. |
| Build | `npm run build`: PASS initially and on final source; `build.log`, `build-final.log`. |
| Full initial suite | `npm test`: 631/632 PASS, 1 failure, 0 skip/cancellation, 460086.8455 ms. `equipped native brace with an open road offer keeps ticking, travelling and reloading` in `tests/alloy_equipment.test.js:118` failed after 61035.664792 ms; its fixture subprocess has a 60000 ms timeout. No production/test repair outside this lane. |
| Failure isolation | `node --test tests/alloy_equipment.test.js`: 5/5 PASS, 0 failures, 7047.814875 ms; failing subprocess check alone took 6096.203542 ms. This supports host-load timeout as an inference, not a reproduced gameplay defect. |
| Full final suite | `npm test -- --test-concurrency=2`: **632/632 PASS**, 0 failures, 0 skips, 0 cancellations, 80532.67925 ms; `full-test-final.log`. No pre-existing assertion failure reproduced. |
| Fresh-origin browser | PASS baseline load and uncoupled module exercise at 1366×768; `browser.cjs`, `browser-result.json`. Browser native startup screenshot shows fresh PLAY screen with no load issue; zero page errors. No native changed-loop claims. |
| Module browser persistence | Exact fixture localStorage reload and **literal JSON-file input** import PASS, no duplicate gift after another eligible visit. These use mock native owners and raw ES modules, not native Export/import. |

Tested served/local baseline bundle SHA-256 `598e02f54fe7db4c9a35bc79c75a754a7f8dc42eccf9fab828de8fd82e97b615`, fetch equality verified. Household modules are **not registered in this bundle**. `source-bindings.json` hashes the household/furniture source and focused test used by the direct-module browser fixture.

Browser attempts: bundled Chromium executable absent on attempt 1, switched to installed headless Chrome with isolated profile. Attempt 2 completed state assertions but reported two harness page errors from a `window.status` name collision. Explicit DOM selector fixed the harness; attempt 3 PASS, 0 page errors. `attempt-history.md` preserves this. Both screenshots visually reviewed: native baseline is startup only, fixture shows bond 40, gift count 1, fuel 17, smoke cleared and readable buttons at 1366×768.

Checks live in the lane worktree at `docs/gm/dispatch/absorb-all-2026-10-14/checks/p23-household/`. A module fixture and mock JSON import do not satisfy native Save/reload/Export/literal-file Import.

## Integration risks and open gates

R1: P00 exclusively owns main/display/items/skills/activities/calendar/save/workspace/registrations. This lane changes none of them. Missing host joins are the current authoritative technical blocker. Coordinator may assemble a candidate stack for testing, not final-merge it as accepted gameplay.

R2: Wave-1 reports read as available: upstream-dev, p23-ui-polish, air-workshop, fork-fort. Main/save/clock/condition owners changed in those lanes, so P00 must reconcile these contracts on its integrated candidate. p23-life-loops/reveal-chain reports were absent at this read; no counters or reveal implementation was invented here. Only `src/absorb_b/furniture.js` changes an existing file, adding one export and preserving the projection's prior output. P04 must use its own portable aura area. No shared-file ownership transfer was inferred.

R3: Changed native animal loop, fuel/Wet/smoke/exit/sleep loop and exact native Save/reload/Export/literal-file Import remain OPEN. Rebuild the integrated candidate, record served bundle/source bindings and play those loops at 1366×768 before marking them verified. After those technical gates, the remaining authoritative acceptance is Weibao's play/taste.
