# Proto23 Shell: read acknowledgment and preparation

2026-10-15. Read and acknowledge [the authorized packet](PROTO23_SHELL_VARIANT.md),
PROJECT standing priorities, [the latest user instruction](../../../USER_VISION.md#proto23-shell-variant-over-yair-systems-2026-10-15),
[design owner V1](../../../UI_FOUNDATION_DESIGN_ROUND_2026-10-15.md#v1-proto23-shell-variant-2026-10-15),
[UI rules](../../../UI_RULES.md), [C1 report](C1_REPORT.md), the current
[NAV report](../ui-triage-apothecary-2026-10-15/NAV_REPORT.md), and the deeper
native exploration/source-lab notes in the panel-design research owner.

**Read-only preparation complete; runtime ownership has not transferred.**
NAV PID 33400 is live and NAV_REPORT is still in progress at this acknowledgment.
Its final report and actual release must be recovered before implementation,
followed by the coordinator's explicit source transfer. No runtime edits, build,
browser state mutation, worker or successor launch were performed in this turn.
The only write is this acknowledgment. Pending transfer is not variant completion.

## Accepted scope

| Code | Implementation target after transfer |
| --- | --- |
| SV1 | Selectable Proto23 Shell with source-faithful region relationships, compact aligned rows, integrated headings and frame/gradient/type hierarchy at comfortable desktop text sizes |
| SV2 | Integrated player area over fuller native inventory, category/filter/sort controls, aligned item data and adjacent selected-item detail with explicit native actions and reasons |
| SV3 | Contextual person/enemy/item/service detail and action menu; preserve live opponent focus and known-information boundaries while browsing |
| SV4 | Real derived stats and actual equipment slots/commands near the player summary, with a clear larger native route; no parallel stat model or invented slots |
| SV5 | Cohesive crafting/list-detail, skills/known records and log; retain YAIR Back/Esc, current work, NAV history/list stability, accessibility and Appearance choices |

C1 remains a preserved comparison. Existing default and saved layouts are not
silently replaced. Local source-derived experimentation is authorized only in
the ignored private prototype while provenance is unresolved; no Proto23
simulation, timers, save owner or inventory ledger enters YAIR.

## Native seams identified from current disk

| Code | Existing owner / seam | Adaptation boundary |
| --- | --- | --- |
| N1 Inventory | `src/data/character.js` exports the Hero; `src/components/inventory_component.js` owns items. `src/display.js` has `update_displayed_character_inventory`, `create_inventory_item_div`, item tooltip and equipment-comparison renderers. `index.html` owns `inventory_content_div`, category and sort controls | Keep native keys/counts/instances and row controls. Prefer borrowing native nodes; selected detail must invoke existing explicit commands rather than turn selection into a mutation |
| N2 Item actions | `src/main.js`: `character_equip_item`, `character_unequip_item`, `use_item`, `start_reading`; existing window bindings and inventory event routes. Known-item hotkey preflight/commit also includes transactional and supported-item special cases | Reuse the applicable authoritative native path and its eligibility/ownership checks. Inspect full routes after NAV release before choosing adapters; do not bypass special cases with a new dispatcher |
| N3 Focus | `src/village_workspace.js`: `villageFocus`, `createVillageWorkspace`, registered `focus`/`village-scene`; `src/main.js` supplies current observer-filtered frame, native combat target, known people and existing action callbacks | Preserve combat priority and safe unknowns. Extend presentation selection without exposing sealed/unmet information or spending time |
| N4 Stats/equipment | `src/display.js`: `update_displayed_stats`, `update_displayed_equipment`, stat descriptions and comparison tooltips; `character.getFullStats`, attack methods and `getEquipment`; `index.html` character stats/equipment and native slot nodes. Existing `createEquipmentComparison` binding in main reads held/worn native items | Borrow real stats/equipment surface or project authoritative values. Keep actual slots and native equip/unequip route; no duplicate calculations or equipment state |
| N5 Layout/navigation | `definePanel`, workspace registry/layout, `openWorkspaceModule`, `expandWorkspaceModule`, shared `centerModes`, persistent navigation and native `openMixtureCounter` | Consume final NAV fixes, including list bearings, focus/history restoration and notices. Variant selection must be reversible without rewriting existing layout/pins/collapse or gameplay save schema |

These are preparation findings against a moving NAV-owned tree, not a frozen
implementation contract. Re-read affected files and final NAV_REPORT on transfer.

## Reference and verification readiness

Read the private lab UI_LAB and deeper exploration receipt; visually inspected its
saved native Crafting capture at 1366×768, without opening or mutating a browser.
The capture shows integrated player/equipment above inventory, contextual upper
focus, neighboring recipe/detail regions and a tall log. It is DEV SEEDED source
evidence, not YAIR integration proof. Fuller Skills, Actions, Store, Journal/stats
and item-detail references must be inspected before settling shell geometry.

After transfer: recover live dirty/process state, final NAV changes and C1 frozen
provenance; then implement one playable reversible variant slice. Required proof
is the packet's native item action, person/enemy focus, real stats/equipment,
crafting/mixing and restored prior item/tab/scroll, switching back, running combat,
keyboard/mouse, reduced motion, actual 125%/150% text, synthetic save/reload and
Export/literal-file Import plus old-layout preservation. Rebuild before browser
claims; target populated 1366×768 with affected 1440×900 and 1920×1080 checks.
Record served-byte provenance and fuller equal-viewport source comparisons.
Mobile/new content remain deferred; no commits or pushes. Visual acceptance stays
with Weibao. No concrete technical blocker identified beyond pending ownership.

**Ready for explicit source transfer after NAV's actual final release.**
