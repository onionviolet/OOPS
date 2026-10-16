Lane `surfaces`, code prefix SF. Read next-parts/COMMON.md in docs/gm/dispatch/ui-foundation-2026-10-15/ first and obey it. Then read NEXT_PARTS Round 8 (L1–L9) and next-parts/census.md.

Task, plan only:
1. **Slot map.** For each `PANELS` value in src/cheat_cards.js:3, and for other discovered systems
   (companions, household, ledger, worlds, making crafts, anchors; grep src/ and docs/ for their current UI),
   propose surface type and home per docs/UI_RULES.md (popup section, inspection section, notice,
   center view, log voice line, footer/status, none). Propose the minimal set of shell-owned host slots and
   the projection a contributor supplies. Reuse existing owners (center-mode controller, panel_kit,
   notices UR29, Part 4 popup). Read docs/gm/CHEAT_ACCESS_DESIGN_DISCUSSION_2026-10-15.md; do not edit it.
2. **Inventory anatomy.** Row and detail anatomy for Part 1 compared with native YAIR, Proto23 and R14
   captures (evidence/r14-proto23-review/, parity-r7/). Stress cases from procedural/made items
   (src/craft_product_registry.js, generated names, affixes, unknown properties, 500 rows).
3. **Fight descriptor (L2).** From CSS and R14 captures, state whether location type tags, their tooltip
   (description, effect, related skill) and the location description are visible and reachable during
   combat in the candidate. Label shown/stated/inferred. Propose the Part 2 descriptor layout.
Effort: high. Done: next-parts/surfaces.md with the COMMON sections.
