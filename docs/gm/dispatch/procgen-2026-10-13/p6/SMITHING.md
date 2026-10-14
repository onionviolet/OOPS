# Smithing, alloys and equipment parts (X1)

Status: PROPOSAL ONLY. Source support: [audit F1-F4/F7](LIVE_AUDIT.md). `src/crafting_recipes.js:144-206,244-302,451-470` picks authored material-result IDs and assembles template parts; `src/alloy_equipment.js:5-27` derives one brace's stats and exact field-technique benefit. Missing: ratio-sensitive alloy truth, treatment state, generated part interfaces and reconstruction through equip/sell/storage/import.

## Product law and axes

| Axis | Proposed contract |
|---|---|
| Product logic | L1 composition for alloy; L2 parts/interfaces for equipment; L3 only for separately installed patterns; L4 exact origin when a selected world requires it. L1-L4 are research product logics, not dispatch workers P1-P4. |
| Inputs | Exact owned metal/feedstock quantities, flux where the local law uses it, tool/vessel, fuel and a part role. Preserve contaminants and residues. Named canon metal remains an authored exemplar. |
| Process | Melt/mix, shape, cool/temper and fit are ordered operations. Same alloy with different treatment can differ structurally without rerolling fractions. A laminate retains layers; melting removes its geometry under a declared law. |
| Skill | Forging precision, process control and fitting affect supported yield/tolerance, not all stats at once. Apparatus enables operations; skill cannot conjure a furnace. Freeze execution terms at paid job admission. |
| Knowledge | Maker knows observations, measured properties and tested methods separately. Unknown true compatibility still resolves; actually missing model data blocks spending. Assay scope does not certify every hazard. |

Generated: resolved alloy fractions, treatment microstructure class, part role/fit, specific derived response and accounted waste. Authored: finite process operators, valid geometry families, response curves, acquisition, UI verbs and consumer laws. No separate authored item for each ratio. A working property has a consumer: a generated brace changes actual `field.pack_drive` effort/yield, or a blade's derived attack behavior reaches combat. Start with the brace consumer only; its current template-ID hook must be adapted to read the selected equipped product, not grant every brace the same bonus.

## Idle and persistence

A learned plan queues exact feedstock and returns reserved apparatus; substitute policy is explicit and opt-in. One supported furnace is real capacity, not a universal anti-abuse once limit. Repeat stops on shortage or unsupported material; observation reports the completed batch, not hypothetical stock. Played game time advances cooling. Sleep/travel only advance a job if its world/site law allows unattended work; closed-browser advancement stays deferred initially.

Save resolved fractions, structural treatment, law/resolver revisions, exact product key, installed parts, condition and job escrow/stage/next boundary. Keep economic provenance separate unless queried. New generated equipment uses a complete decoder; retain legacy ID/components/quality behavior. Repair cannot rewrite its original alloy silently.

## Book laws that change the adapter

- K10, Shadow Slave ch1605/2048: mundane forging and later infusion/weaving are distinct. A forged part is not already a Memory; maker means are required.
- K6, MoL ch43 ¶76/ch46 ¶23: prepared steel structure is distinct from stabilization and battery. Ordinary matching metal properties do not supply the whole golem.
- K12, cultivation member0209: environment/skill and yield tradeoffs can alter processing. Treat this as a qualified local alchemical process, not universal metallurgy.

Locators/limits: [canon ledger](CANON_LOCATORS.md).

## First playable slice S3-A: two braces from one alloy family

At Village, obtain original fictional feedstock, choose two ratios and one supported cooling distinction, forge two generated braces, equip one and perform the actual paid pack-drive job. Compare declared effort or kit yield, then swap. No combat overhaul, universal metallurgy or new world required. Owner: this file plus the materials owners linked in REPORT.

Acceptance, all OPEN: SOURCE proves mass/waste accounting, process-order sensitivity, no preview draws, exact equipped-product reading and failed-write rollback. NATIVE proves paid inputs → two distinct owned braces → equip/swap → different actual supported work with old Springsteel unchanged. PERSISTENCE covers equipped, stored and reserved products, effect withdrawal, Save/reload and Export/literal-file Import. Common desktop/build/legacy gates in REPORT apply. Fiction, feel and numbers remain director-unaccepted.
