---
paths:
  - "src/world_pack*.js"
  - "src/world_packs/**"
  - "src/world_society_sheet.js"
  - "src/world_report_voice.js"
  - "src/world_look.js"
  - "src/world_calendar_content.js"
  - "docs/WORLD_KIND_RULES.md"
---

Code here follows [world kind rules](docs/WORLD_KIND_RULES.md) WKR1–WKR21: working defaults under AD56, adjustable; WKR19 stays a proposal (LLR31). A kind is a preset over `WORLD_AXES` in `world_pack_manifest.js`, never a code branch: readers read axis values and mechanism facts, not a preset id. A new world registers the minimum kit (WKR6) into existing modules, uses `world_pack_*` plus `windowKit` (WKR9), and its presets come out of canon worlds that are built and calibrated first (WKR21). Cite the codes you apply in the task record or commit message; `node scripts/rule_routes.mjs --for <path>` lists them.
