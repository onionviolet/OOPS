# Ranked implementation packets

All P entries are **inferred proposals**, unaccepted and unimplemented. Ranking is within this game's possible YAIR uses, not a comparison between games. Source claims use the F labels in [FINDINGS](FINDINGS.json). Only PROJECT.md accepted decisions and Weibao's words bind. Each world's carry, life and offline policies stay local. Public code would use original names/content and preserve upstream attribution.

Routing only: intended readers are the life-sim experience GM and foundation GM. No other GM folder was written and no worker was dispatched. A packet is not authorization to build.

| Rank | Packet | Smallest result | North star |
|---:|---|---|---|
| 1 | P1 | Show what survived, with an actual carrier | Persistence across runs; heirs/families |
| 2 | P2 | Earn automation for familiar work | Life loop; ordinary growth |
| 3 | P3 | Separate this body’s practice from carried aptitude | Persistence across runs; first life versus later |
| 4 | P4 | Catch up to the next meaningful stop | Life loop; world-specific offline behavior |
| 5 | P5 | Show a life’s gains before its next beginning | Persistence; text life UI |
| 6 | P6 | Part-build a useful shelter | Find footing; shape the world; heirs |
| 7 | P7 | Fix a next-life outcome once, then show its actual carry | Random next life unless planned; heirs |
| 8 | P8 | One artifact with temporary and permanent uses | Persistence; growth; local carriers |

## P1: Show what survived, with an actual carrier

Source: F6/F7/F13/F14/F21 (their exact seen/inferred labels stay in FINDINGS). North-star connection: Persistence across runs; heirs/families.

Existing extension points, read as a source-only map: `src/chronicle.js:createHeirChronicle; src/life_experience.js:lifeGrave; src/life_record.js; src/save_files.js`.

**Proposal / player path:** At one opt-in ended-life boundary, preview body losses, world property, written records, taught people and any world-specific soul/artifact carry. Confirming applies only surviving records. A destroyed cache stays destroyed; a written lesson is discovered/learned, not silently treated as inherited mastery.

**Needed state and boundary:** Need an authoritative inheritance record outside the lossy biography. Current inspected createHeirChronicle still transfers one grave.lesson; this packet is an original expansion to meet accepted heir direction, not a source-backed claim that Increlution simulates heirs.

**Observable acceptance:** End two synthetic lives, one with a surviving manual and one with a destroyed cache. Preview and successor state agree; import/reload neither invents assets nor repeats rewards. Existing saves gain no fabricated legacy.

**Tradeoff:** Ledger can reveal spoilers or overpromise property resolution; show only known/detected entries. Carrier rules belong to that world.

## P2: Earn automation for familiar work

Source: F9/F10/F12/F15 (their exact seen/inferred labels stay in FINDINGS). North-star connection: Life loop; ordinary growth.

Existing extension points, read as a source-only map: `src/simulation.js:setSimulationProgram/advanceSimulationBoundary; src/simulation_content.js:controllers; native jobs in src/main.js`.

**Proposal / player path:** One opt-in Village routine gains a recorded familiarity milestone after completed work, offering automatic repetition. Keep player enable/disable and expose stop reason; use existing eligible command reservation for inputs and wages.

**Needed state and boundary:** Need per-action successful-completion counters and an authored unlock threshold. Keep native skill XP and current job result, rather than a second universal automation currency. Cross-life routine knowledge persists only if a world/teacher/record carries it.

**Observable acceptance:** A canceled shift earns no completion. Eligible completed work unlocks once, a missing input pauses without spend, and save/reload/import keeps the chosen priority without duplicating pay.

**Tradeoff:** Thresholds are a balance proposal; too high creates rote work. Existing bounded programs can supply the first slice without a general-purpose scheduler rewrite.

## P3: Separate this body’s practice from carried aptitude

Source: F7/F8/F13 (their exact seen/inferred labels stay in FINDINGS). North-star connection: Persistence across runs; first life versus later.

Existing extension points, read as a source-only map: `src/data/skills.js; src/life_experience.js; src/life_experience_host.js; src/chronicle.js`.

**Proposal / player path:** In one optional loop world, expose a native skill multiplier breakdown: body/current-life practice plus a named carried instinct. A fresh body loses its own practice but retains the specific artifact/soul trait the world permits.

**Needed state and boundary:** Need explicit source/target stat ownership and skill-rate hook; do not add Increlution’s 12-skill roster or copy its numbers. Artifact aptitude is a proposed local mechanic, distinct from remembered knowledge or inherited possessions.

**Observable acceptance:** Compare fresh and successor bodies using one same action. Carried trait affects only intended skill/rate; absent carrier produces no bonus. Native vanilla skill progress survives untouched; round-trip save retains each layer.

**Tradeoff:** Two XP tracks can crowd the UI and compound too quickly. This local option is separate from bloodline inheritance and is not a global retention rule.

## P4: Catch up to the next meaningful stop

Source: F11/F12/F19 (their exact seen/inferred labels stay in FINDINGS). North-star connection: Life loop; world-specific offline behavior.

Existing extension points, read as a source-only map: `src/simulation.js:advanceSimulationBoundary/waitingSimulationChoice; src/main.js; src/event_feed.js; src/save_files.js`.

**Proposal / player path:** Let one harmless authored routine consume permitted offline time, then stop at a new choice or commitment. Show time processed, output, reason for stopping and any time discarded/retained. A local harsh survival mode may spend life offline if explicitly chosen.

**Needed state and boundary:** Need declared world offline policy and bounded catch-up receipt using the existing common clock. Increlution’s three-day timestamp cap and health-consuming catch-up are evidence of one different policy, not a selected YAIR default.

**Observable acceptance:** Close/reopen a fresh test origin around a routine and around an unresolved choice. Correct outputs occur once; blocked choice remains waiting; no unselected death policy appears. Compare save/import behavior.

**Tradeoff:** Clock drift, extra catch-up after import and accidental aging are risks. Define retained backlog separately from maximum newly credited gap.

## P5: Show a life’s gains before its next beginning

Source: F8/F16/F17/F18 (their exact seen/inferred labels stay in FINDINGS). North-star connection: Persistence; text life UI.

Existing extension points, read as a source-only map: `src/life_record_ui.js; src/life_experience_host.js; src/chronicle_ui.js; src/event_feed_ui.js`.

**Proposal / player path:** Extend the existing life panel with last-life/current-life comparison: time spent by activity, meaningful milestones, retained gains and losses. Distinguish ordinary new life, replay/undo and any larger campaign reset.

**Needed state and boundary:** Need a small summary snapshot derived from authoritative activity/results. Existing life_record is bounded prose, never the reward source. A three-life detail window is an option; retain separate durable lineage milestones if the world needs them.

**Observable acceptance:** A known fixture life produces expected deltas and a truthful empty-state. Expired details compact without removing inheritance facts. Reload/import neither duplicates entries nor treats display text as currency.

**Tradeoff:** Lossy summaries can erase important history. Increlution’s three snapshots solve performance comparison, not every family-history need.

## P6: Part-build a useful shelter

Source: F5/F10/F15 (their exact seen/inferred labels stay in FINDINGS). North-star connection: Find footing; shape the world; heirs.

Existing extension points, read as a source-only map: `src/crafting_recipes.js; src/simulation.js:pending commands and cancellations; src/steam_df_runtime.js; src/life_record.js`.

**Proposal / player path:** One original home-world project accepts incremental materials/work and changes a real local capability on completion. Show paid materials, remaining work and whether the structure survives an ended life under local ownership rules.

**Needed state and boundary:** Need durable project/custody state and transactional spending; existing crafting/commands are extension points, not proof partial construction already works. Increlution resets huts at rebirth; persistent heir shelter is a separate YAIR proposal.

**Observable acceptance:** Part-fund, interrupt and return without double spend; complete once; successor finds only the surviving structure; fresh-origin reload/import preserves paid progress.

**Tradeoff:** Refund and survival policies need explicit local decisions. Keep one project, not a settlement simulator.

## P7: Fix a next-life outcome once, then show its actual carry

Source: F2/F3/F17/F21 (their exact seen/inferred labels stay in FINDINGS). North-star connection: Random next life unless planned; heirs.

Existing extension points, read as a source-only map: `src/simulation.js:chooseSimulationOrigin; src/chronicle.js:createHeirChronicle; src/save_files.js; docs/worlds/ORIGINS_AND_WORLD_TIMELINES.md`.

**Proposal / player path:** An optional world with random rebirth resolves and saves one eligible next-life result at the boundary. A surviving plan can narrow its eligible pool. The next life gets only its declared carriers; repeat the reveal safely after reload.

**Needed state and boundary:** Original proposal prompted by the source’s absence of random birth. Need committed roll/result identity, valid origin pool and actual plan survival records. The named origins/timelines doc is a design routing owner, not asserted working implementation.

**Observable acceptance:** Unplanned and planned fixture deaths select within distinct valid pools. Reload/import cannot reroll; a destroyed plan stops affecting the pool. Do not alter vanilla unconsciousness/recovery.

**Tradeoff:** This cannot be advertised as absorbed Increlution code. Random life, heirs and replay are different local continuation types.

## P8: One artifact with temporary and permanent uses

Source: F14 (their exact seen/inferred labels stay in FINDINGS). North-star connection: Persistence; growth; local carriers.

Existing extension points, read as a source-only map: `src/items.js; src/simulation.js:commitSimulationCommand; src/simulation_effects.js; src/expansion_engine.js`.

**Proposal / player path:** An original artifact offers a safe temporary benefit or costly attunement that binds one persistent effect. Explain present-life versus later-life effects separately. Repeated attunement can cost more while remaining optional.

**Needed state and boundary:** Need carrier identity and attunement record with one transactional effect. Source hourglass powers use completion counters; YAIR should not infer property possession from a biography line.

**Observable acceptance:** Preview the cost/risk, apply once, end the life and retain only bound effect. Sell/destroy ordinary item under declared local policy; reload/import never reapplies the same attunement reward.

**Tradeoff:** Numerical survival power can encourage farming. Choose an effect that changes a local action and review the repeated cost before expanding.

If one packet is later selected, its own source edit, tests, rebuild, fresh-origin browser exercise and save/reload/import gate establish implementation status. None happened in this research pass. No selected packet may infer inheritance from lossy history or invent earlier progress in old saves.
