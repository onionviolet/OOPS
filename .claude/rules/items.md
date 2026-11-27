---
paths:
  - "src/items.js"
  - "src/inventory_*.js"
  - "src/components/inventory_component.js"
  - "src/acquisition.js"
  - "src/absorb_e2/durability.js"
  - "src/equipment_*.js"
  - "src/*_equipment*.js"
  - "src/native_storage_transaction.js"
  - "src/storage_*.js"
  - "src/gear_*.js"
  - "src/relic_generator.js"
  - "src/heirloom_items.js"
  - "src/tools_*.js"
  - "src/item_*.js"
  - "src/trade.js"
  - "docs/ITEM_RULES.md"
---

Code here follows [item rules](docs/ITEM_RULES.md) ITM1–ITM24 (items, inventory, storage, equipment, wear, unique items). ITM1–ITM23 are adjustable working defaults under AD56; lines in the [limiting lines review](docs/audits/LIMITING_LINES_REVIEW_2026-11-10.md) stay proposals. ITM24 is standing direction: keep charge, contents or consequential history on the particular item and derive actions from its current state. Stack equivalent pieces; one instance id; write through `stageAcquisition`; stats through the one pipeline; no carrying cap unless a world has one. Cite the codes you apply in the task record or commit message; `node scripts/rule_routes.mjs --for <path>` lists them.
