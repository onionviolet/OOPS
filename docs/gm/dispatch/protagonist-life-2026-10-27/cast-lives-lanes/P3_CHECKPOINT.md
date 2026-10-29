# P3 checkpoint: unchanged-input facts frame

Status: **implemented, below floor**. Read-only publication reuse implemented; the composition-root registration is an unapplied patch. Agent-verified at focused/Node DOM fixture scope, not human-reviewed. No commit or push. The browser floor belongs to the coordinator (`scripts/floor/run_floor.cjs`).

Rules: AR1-AR16, particularly AR3/9/15; AD36/43/45; CLR2/10/12; CO3, LSD138/143/147, MD3/6. Direction remains the [card](../CAST_LIVES_CARD.md) and [brief](P3_FACTS_FRAME_BRIEF.md). This is a structural optimization with unchanged gameplay, clocks, location authority and save format.

## Ownership and seam

Owned files: `src/facts_frame.js`, `src/simulation_effects.js`, `tests/facts_frame.test.js`, this checkpoint, `P3_INTEGRATION.patch`. No other shared paths edited. B1 retains `src/main.js` and the world files. No world-file patch was needed. The one-line main import replacement routes the existing `withSimulationFrame` publication registration through the new frame; it retains the existing context-builder cache and its copies. Core-owner files directly edited: zero; patch core-owner surface: one line replaced, net zero lines; new cycle edges: zero expected, architecture evidence below.

The frame owns derived facts during one synchronous **read-only publication**, not the whole clock minute. It shares the predicate-independent projection for the same state, registry and context inputs. Context fields use identity tokens; a spread fact dictionary uses its immediate key/value identities. There is no recursive comparison or whole-state hashing. Explicit per-input versions cover supported writes. `clock`/`sequence` changes also miss. Each caller gets a separate facts object, then its own inventory-predicate normalization, including absent stacks. Different predicates therefore cannot add zeros to each other's results. The previous full-facts render cache remains the fallback outside the new frame.

`writeInventory` invalidates state/gameplay. `applySimulationEffects` suppresses caching throughout nested effects and invalidates in `finally`, including partial failed plans. This preserves successive body, immunity, inventory, location, condition and resource reads. Nested frame invalidation propagates to the outer frame. Transaction trials over copied states miss the publication state identity. No saved state, RNG, clock, location, native inventory owner or browser-facing setting was added. The on/off hook is a module export used by tests, with no player control or global hook.

## CLR2 data probe and write boundary

| Gate input | Expected | Observed | Result |
| --- | --- | --- | --- |
| `simulationFacts` entry calls in the P2 diagnostic minute | about 673 | 673 in initial before/after probe | Matches input expectation |
| Expensive base projection builds | distinguish calls from computations | 511 before, 151 candidate in initial probe | 70.45% fewer builds; entry calls still 673 |
| Caller/input inventory | list every direct call | Tables below | Read complete |
| Writes within a synchronous minute | enumerate before choosing lifetime | Table below | Clock-wide cache deliberately not enabled |

The brief literally asks for entry-call count to halve. That gate is **not closed**: 673 per-command reads still occur, but most reuse a computed projection. Reducing those entry calls would require caller batching beyond the granted files. This receipt reports both measures rather than renaming the build counter as a call counter.

| Input that can change | Existing writer/boundary | Treatment |
| --- | --- | --- |
| Simulation effects, actor/world facts, bodies, movement, conditions, powers, resources, custody, equipment | `applySimulationEffects`, including nested effects and preview trials | Cache suppressed during the transaction; affected state/gameplay versions invalidated afterward |
| Native/simulation inventory replacement | `writeInventory` | State/gameplay invalidation |
| Clock, sequence, cloned/published state | `advanceSimulation`, `startCommand`, `persistExpansion` | Frame not extended over those mutations; state identity/clock/sequence also discriminate reads |
| NPC scheduling, cast movement, controller/event/job/session/progression/work-plan writes | simulation advance, cast sync and domain tick owners | Uncached outside publication. Those writers are not granted to P3 |
| Native inventory/equipment/vitals/skills, location, active effects, availability, calendar/weather, care/homes and generated people | native transactions/publication and clock/domain owners in main and other files | Existing context frames are reused during publication; broader invalidation is not assumed |
| Pack/registry load and async callbacks | existing loaders and registries | No new cache crosses the synchronous callback boundary |

Stop condition applied: the remaining clock/planning/native-context inputs have writers outside this lane and no common version port. They remain on the existing path. Default for the next lane: introduce explicit dependency versions at the actual native publication/clock owner, then extend the lifetime only across proven unchanged phases. Do not infer unchanged inputs from cast wakes, clock or sequence alone.

## Direct `simulationFacts` callers and inputs

All rows use their supplied state and registry unless noted. Paths are under `src/`. Each numbered site is a separate direct call; import/re-export sites are excluded. Locators are function/operation names because B1 can move lines concurrently.

| Caller | Context/input passed |
| --- | --- |
| `simulation.js`, `previewCommand` | Command context with target normalized to an enrolled person; requires + visible predicates |
| `simulation.js`, `startCommand` formula amounts | Current command context, before costs; mutable staged state |
| `simulation.js`, completion-support check | Job support context; support predicates |
| `simulation.js`, `advancePowerProgression` | Supplied advancement context |
| `simulation.js`, `previewSimulationResponse` | Session target and party over supplied context |
| `simulation.js`, event effects | Event target over supplied context |
| `simulation.js`, scheduled event check | Controller actor/target, current plan external/gameplay, event requires predicates |
| `simulation.js`, `advanceStoryletDecks` callback | Player context, authored target, current output external/gameplay |
| `simulation.js`, controller `targetFacts` | Controller context with scanned target; local per-target memo already exists |
| `simulation.js`, controller candidate `when` fallback | Candidate context when target is not an enrolled person |
| `simulation.js`, `previewCampaignTransition` | Supplied transition context |
| `simulation.js`, `chooseSimulationOrigin` | Supplied origin context |
| `simulation_effects.js`, `effectFacts` | Effect context with plan vitals; formulas only |
| `simulation_effects.js`, condition immunity | Effect actor with plan external/gameplay/vitals/equipment |
| `action_legibility.js`, action fallback | Action context when caller did not supply facts |
| `field_works_projection.js`, requirement evaluation | Supplied projection context |
| `feature_expansion_wave_host.js`, reference controls | Reference gameplay context |
| `feature_expansion_society_host.js`, work projection | Current society context |
| `feature_expansion_society_host.js`, plan visibility | Same current context per plan |
| `feature_expansion_society_host.js`, plan requires | Same current context per plan |
| `agreed_duty_host.js`, base projection | Supplied context with normalized nullable target |
| `structured_renewal.js`, renewal projection | Supplied context with player actor; registry from context |
| `feature_expansion_host.js`, command visibility | Supplied context with declared target |
| `feature_expansion_host.js`, encounter responses | Session/turn context |
| `skill_expansion_host.js`, skill requirements | Supplied context with selected target; requires predicates |
| `repository_absorption_host.js`, work projection | Repository context |
| `audit_remainder_home_host.js`, home projection | Current context with declared NPC target |
| `original_frontier_campaign_host.js`, command visibility | Campaign context with declared target |
| `original_frontier_campaign_host.js`, contest responses | Contest context |
| `structured_pack_runtime.js`, claim compilation | Supplied context with null target; registry from context |
| `structured_pack_runtime.js`, reachability hints | Supplied context with action target; local target memo |
| `structured_pack_runtime.js`, extension preview | Supplied context and its registry |
| `structured_pack_runtime.js`, extension planning | Supplied context and its registry, staged extension operation |
| `crush_social_views.js`, action legibility | Action-specific context |
| `crush_social_views.js`, social projection | Supplied context when simulation is enrolled |
| `audited_kit_reserve_host.js`, support | Supplied context when simulation is enrolled |
| `causal_story_host.js`, counter visibility | Supplied story context |
| `causal_story_host.js`, completion support | Job actor/context with current plan external/gameplay/vitals/equipment |
| `feature_expansion_objects_host.js`, object visibility | Object command context |
| `feature_expansion_work_plan.js`, work-plan advance | Current output state and plan context |
| `feature_expansion_work_plan.js`, work-plan view | Current state and view context |
| `reference_gameplay_host.js`, command visibility | Reference command context |
| `audit_remainder_combat_fit_host.js`, command visibility | Combat-fit command context |
| `book_world_mol_host.js`, response preview | Supplied context with session target |
| `management/host.js`, management projection | Current management context |

## Direct native-context callers and inputs

`simulationNativeContexts` reads the live expansion/native owners. Optional `readFrame` is an existing planning frame, not a new saved input. Its builder reads NPC/native bodies, skill/zone evidence, world projections, equipment, gameplay inventory, location, current time/weather, care/home/availability and generated people.

| Caller in `main.js` | Input/consumer |
| --- | --- |
| `growthContext` | No argument; joined vital projection |
| `persistExpansion`, causal reconciliation | Optional planning `readFrame`; amends copied contexts with staged vitals/equipment/location |
| `persistExpansion`, commitment validation | Same optional `readFrame`; staged vital support |
| `structuredContext` | No argument; structured body/inventory/equipment projection |
| `advanceExpeditions` | No argument; simulation advance contexts |
| `advanceChroniclePlan` | Optional `readFrame`; player facts replaced from expedition context before advance |
| `actSimulation` | No argument; current vital map for command |
| `actOriginalFrontier` | No argument; equipment map |
| `campaignContext`, equipment field | Optional `readFrame`; equipment map |
| `campaignContext`, vitals field | Same optional `readFrame`; vital map |
| `actPocketRealm` | No argument; equipment map |
| Pursuit panel reader | No argument; snapshot + vital map |
| Pocket-realm panel reader | No argument; campaign + equipment map |
| Body panel reader | No argument; snapshot + vital map |
| Field/Here-action panel reader | No argument; snapshot + vital map |

## Verification and measurement

Final receipts follow after the frozen-input diagnostic and focused checks. The initial harness recovered P2's private local pack and Node DOM method. It measured entry calls and base builds separately with nested inclusive/exclusive marks. Initial before 1721.64 ms, candidate 1734.90 ms while other verification was active; do not infer a speed improvement from that pair. Cast scheduling was unchanged. No Chrome launch was attempted because the brief assigns that floor to the coordinator.

Final sequential diagnostic, over one frozen source snapshot and the same pack: **1573.33 ms before, 1307.52 ms candidate**, about 16.90% less elapsed CPU time in this sample. This is one sample per input, not browser timing or a stable benchmark. Before uses the unmodified HEAD `simulation_effects.js`; after uses the delivered leaf plus the one-line main patch. Other runtime files are identical. Neither sample includes P2's unapplied cast-queue patch, so this measures P3 independently.

| Mark | Before calls | Before exclusive ms | Candidate calls | Candidate exclusive ms |
| --- | ---: | ---: | ---: | ---: |
| `book_world_lotm_actions.js:lotmFacts` | 996 | 113.53 | 636 | 79.34 |
| `main.js:buildSimulationNativeContexts` | 11 | 574.29 | 11 | 601.01 |
| `main.js:simulationNativeContexts` | 18 | 56.92 | 18 | 61.59 |
| `simulation_effects.js:buildSimulationFacts` | 511 | 650.33 | 151 | 295.19 |
| `simulation_effects.js:simulationFacts` | 673 | 43.36 | 673 | 132.14 |
| `main.js:campaignContext` | 15 | 1.73 | 15 | 1.77 |
| `main.js:create_save` | 1 | 3.06 | 1 | 3.22 |
| `main.js:renderPublishedDisplays` | 1 | 0.53 | 1 | 0.55 |
| `simulation.js:previewSimulationCommand` | 507 | 4.04 | 507 | 3.01 |
| `cast_schedule.js:whereabouts` | 75 | 0.66 | 75 | 0.70 |
| `book_world_lotm_cast_host.js:syncLotmCast` | 2 | 0.06 | 2 | 0.07 |
| `book_world_lotm_host.js:view` | 1 | 1.27 | 1 | 1.34 |
| `book_world_lotm_ui.js:render` | 1 | 0.32 | 1 | 0.33 |
| `main.js:renderPublicationPanels` | 1 | 33.73 | 1 | 34.06 |
| `main.js:persistExpansion` | 1 | 23.20 | 1 | 23.82 |
| `book_world_lotm_cast_host.js:planLotmCastBeats` | 1 | 0.21 | 1 | 0.23 |
| `book_world_lotm_host.js:tick` | 1 | 0.67 | 1 | 0.73 |
| `main.js:renderClockPanels` | 1 | 2.72 | 1 | 2.99 |
| `main.js:update_timer` | 1 | 62.65 | 1 | 65.40 |

`simulationFacts` rows exclude separately marked `buildSimulationFacts` time; both are shown to distinguish request count from actual computation. Native-context requests remain 18 and builds remain 11. Preview requests remain 507. The current local pack is 36 people, 77 schedule rows, 60 day bindings, 84 beat bindings; the fixture explicitly verifies that pack people were loaded. A 270-person pack was not measured.

Instrumented probes both emitted the existing queued-reader teardown warning (`document is not defined`) after close. This is a diagnostic gap, not a clean browser result. The settled on/off test separately asserts zero recorded page errors for each of its six game boots. It compares three fixture minutes: fresh unenrolled life (facts correctly reject until enrollment), a clock fixture seven minutes into the interval toward the first wait boundary, and an enrolled beside life with the local pack. Contexts, available facts and full `create_save()` bytes match. The mid-wait fixture does not claim a persisted pending-wait object; the current wait runs synchronously.

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/facts_frame.test.js` | PASS 9/9, zero skips | Includes three full-game Node DOM equivalence subtests; no browser |
| `node --test tests/inventory_requirement_facts.test.js tests/lotm_cast_week.test.js tests/lotm_be_seat.test.js tests/simulation.test.js tests/simulation_extensions.test.js tests/simulation_frame.test.js tests/planning_read_frame.test.js` | PASS 82/82 | Focused existing consumers; full pre-commit suite left to coordinator |
| `python3 /tmp/p3-profile.py`; `node /tmp/p3-profile.mjs`; restore frozen source; `python3 /tmp/p3-profile.py on`; `node /tmp/p3-profile-after.mjs` | Diagnostic table above; 511 to 151 builds | Entry-call halving unmet; one sample, teardown warning, no Chrome |
| `npm run check:arch` (shared and uninstrumented patched scratch) | PASS: main 10090/10115, display 6730/6767, save files 310/310; 6 grandfathered main imports, 205 cyclic edges | No growth; scratch includes the integration line |
| `npm run check:rules` | PASS: 27 register rows, 45 AD codes, 151 links, 16 receipts, zero warnings/problems | Existing legacy receipt paths remain skipped by that check |
| `BUILD_OUT=/tmp/yairpg-p3-browser npm run build` (uninstrumented scratch) | PASS | Bundle built; not exercised in Chrome |
| `git apply --check --whitespace=error docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/P3_INTEGRATION.patch` | PASS against current main | Not applied to shared source; recheck after B1 release |
| `node scripts/lane_review.mjs` with all five owned paths as both grants and paths | PASS: 3 source/test files, 118 private-name tokens, zero name hits, zero top-level awaits, zero outside grants | Scoped review; patch payload reviewed separately below |
| `git diff --check -- src/simulation_effects.js`; `node --check src/facts_frame.js`; `node --check src/simulation_effects.js` | PASS | Whitespace/syntax only |

Input identity: final HEAD at snapshot `abf0ff3234ac5bcc6ae51bfad8717fd053cfec15`. Build/diagnostic source copies are in `/tmp/yairpg-p3-source` and `/tmp/p3-final-src`. The latter retains the unpatched main and final leaf; the former is restored to uninstrumented source with the main patch applied. Diagnostics: `/tmp/p3-profile-before.json`, `/tmp/p3-profile-after.json`, `/tmp/p3-before.log`, `/tmp/p3-after.log`; tests/build: `/tmp/p3-facts-final.log`, `/tmp/p3-existing-final.log`, `/tmp/p3-build-final.log`, `/tmp/p3-arch-candidate.log`. These are local recovery evidence, not a portable release. No player save/profile was read or changed.

| Input/artifact | SHA-256 |
| --- | --- |
| Unpatched frozen main | `73adee928115dd2e8f5a7ea5370c80302c615e454cfbd3e7fffc1baf0c059687` |
| Facts frame | `caf37ef1949054c0cf6855349cdf45d4df6a1d42914f11f4a8f40ebf66e28d9a` |
| Simulation effects | `834a310ac85ca5af94bfa5d13fe27c7eac76fd629f66cd915da00e3b2843d91d` |
| Focused equivalence test | `18991d9aa7b378576617bb679f0ef4555ca938dba5f3d0780b290cf4152e1d42` |
| Private pack bytes | `f4baca3963e4fd9128933c8540fad738a8781cd6637db4431724a2b60da1eeba` |
| Uninstrumented browser bundle | `93dfba5311260e5320f68e3c66707dd9bb6bc5a8a3565c99c947840861bff7b2` |

Patch publication review: `review({root:"/tmp/yairpg-p3-source", grants:["src/main.js"], paths:["src/main.js"]})` reports one name-hit file and one top-level-await file for both the frozen unpatched main and the patched main. These are pre-existing whole-file findings outside P3's ownership, not a passing whole-main publication gate. A separate review of exactly the patch's added import line as a scratch `src/` module passes: 118 private-name tokens, zero name hits, zero top-level awaits, zero outside grants. The three owned source/test files pass the normal scoped review. No existing main content or names were changed to clear another lane's finding.

## Known limits and remaining acceptance (AD45)

The new frame closes repeated predicate-base projection work during ordinary publication. It does not batch previews or change the native clock, simulation scheduler, actor queue, render cadence, storage cadence or asynchronous work. Full native contexts still build outside the proven publication phase. Developer render-batch flushes use the existing render frame, not this new frame; their predicate reads remain uncached. Next refactor: RF3 clock extraction with writer-version ports and MD2 grouped native inputs, followed by dependency-specific projection groups when each fact provider declares its inputs. Current all-world facts remain one dependency group, so a supported state write invalidates that group's projections conservatively.

Coordinator: reconcile/apply the one-line patch after B1 releases the composition root, run the full pre-commit suite once, build and run the fresh-origin desktop browser floor with save/reload/Export/Import parity. Agent Node evidence does not close the browser or natural-rate gate. Human review is optional under AD42. No claim of a halved entry-call count or a solved natural-speed problem is made.
