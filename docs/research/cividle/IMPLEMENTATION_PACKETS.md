# CivIdle implementation packets (PROPOSALS, not accepted, not implemented)

Each packet needs its own rebuild, a fresh-origin desktop browser check and Save/reload/Import proof. No CivIdle code or assets. Codes refer to [REPORT.md](REPORT.md).

## P1: Derived fair value in craft detail (F3)

- **Smallest result:** a pure function computes a "chain value" for each native recipe output from its material values with a small per-input markup. The craft detail panel shows "materials worth X, result worth Y". A dev-only report lists hand-set values outside a band.
- **Seams:** `src/crafting_recipes.js`, `src/crafting_detail.js`, `src/items.js`, a new pure module plus a source test.
- **Player path:** open a recipe and see whether crafting adds value before committing.
- **Acceptance:** covers every supported recipe; no item value changes unless Weibao accepts; cycles are detected and reported, not looped.
- **Coordination:** `crafting_detail.js` has uncommitted edits from the crafting-screen dispatch.

## P2: Opt-in absence split (F5)

- **Smallest result:** a setting "replay up to N% of a 4 h absence cap", default 0 (current behavior). On load, replayed minutes go through the existing drain; the rest goes into a capped "stored hours" reserve spendable as accelerated foreground minutes, followed by a before/after summary.
- **Seams:** `advanceChroniclePlan` in `src/main.js` (L1217), `src/game_time.js`, settings UI, `src/save_files.js` and `src/save_migration.js`.
- **Acceptance:** replaying M minutes equals foreground advance of M minutes from the same save; it stops at a waiting choice; the cap holds; the reserve survives save/reload/import; default 0 changes nothing.

## P3: Era-up insight choices (F2, F9)

- **Smallest result:** in one world the era derives from the most advanced knowledge or advancement node. Each era-up queues one 1-of-3 insight card with original names. In-run duplicates stack with diminishing returns (1, 1/2, 1/3...). The pending queue persists.
- **Seams:** `advancePowerProgression` in `src/simulation.js`, `src/simulation_contracts.js`, `src/techniques.js`, `src/world_knowledge.js`.
- **Acceptance:** an era change fires once and does not re-roll on reload; an unchosen card survives reload; the stacking math is in a tooltip.

## P4: Earned capped carry on transition (F1)

- **Merge into [Modding Tree P1](../modding-tree/IMPLEMENTATION_PACKETS.md).** Add a `carry` entry to a transition: `{domain or resource, cap, grantedBy fact}`.
- **Seams:** `commitCampaignTransition` in `src/simulation.js` (L566), `src/simulation_contracts.js` L193.
- **Acceptance:** the preview lists each carry with grantor and cap; without the grantor nothing carries; the receipt records carried amounts.

## P5: Idle hands to knowledge (F6)

- **Smallest result:** in one opt-in world, an enrolled person with no job yields a slow trickle toward one knowledge track; a person on a job yields a smaller study bonus.
- **Seams:** `src/simulation.js` controllers and `advanceSimulationBoundary`, `src/people_knowledge.js`, `src/world_knowledge.js`.
- **Acceptance:** the trickle accrues only in game time that advanced; the source shows in the tooltip; persistence round-trips.
