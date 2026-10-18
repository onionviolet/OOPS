# Lane NAV: getting anywhere without much scrolling

Read `COMMON.md` in this folder first and check its precondition (foundation S3 complete). Weibao, 2026-10-15: "there should be paths back to specific large panels if someone wanted, everything should be viewable without scrolling too much, other stuff and more?" Rules: `docs/UI_RULES.md` UR21–UR33. The foundation lane closed S1/S2 before these rules existed, so this lane extends its shared layers (center-mode controller, tokens, components, panel kit). You are the single owner of those layers while you run (UR19).

## Latest baseline clarification, 2026-10-15

Read [the foundation owner's composition comparison](../../../UI_FOUNDATION_DESIGN_ROUND_2026-10-15.md#proto23-baseline-clarification-2026-10-15)
before editing. Weibao reaffirmed Proto23 as the visual/composition baseline,
with shared-layer refactoring toward it. Colors and square corners alone are
insufficient. During the existing measurement/scroll-budget steps, compare
reference and candidate role grouping: player summary over inventory, contextual
focus above the central action region, dedicated tall log. Consolidate repeated
panel shells and duplicate scene entry controls where they consume routine
action space. Keep detail reachable through named navigation; preserve all
gameplay and saved layouts. If the reference's exact proportions do not fit the
1366×768 target at comfortable text size, report the measured adaptation.

Do not infer that the new direction accepts the current skin or that older S1/S2
proof establishes all navigation rules. Recover final foundation evidence first.
Include the current work, routine actions, return path and log in the populated
comparison screenshot. Inspect/expand/navigation must not inadvertently stop
work or grant offsite service access. Use shared state/commands in compact and
expanded forms. This clarification adds no gameplay systems and does not change
the queue order. Report any remaining composition work outside NAV's shared-layer
scope in the existing report rather than beginning an unbounded redesign.

## Execution

### Latest user steering: shell variant follows NAV

Weibao now explicitly requests a source-faithful Proto23 Shell variant over YAIR
systems, especially inventory/focus/stats. See
`../ui-foundation-2026-10-15/PROTO23_SHELL_VARIANT.md`. Root held the queue
coordinator only; this NAV writer retains its current scope and sole runtime
ownership until final report/checkpoint. Finish the in-progress correctness
work, preserve your changes/evidence and explicitly release. Do not absorb the
entire new variant into NAV or launch TRIAGE/APOTHECARY yourself. The existing
foundation UI worker is preparing read-only and waits for root's source transfer.
Keep the new PROJECT/USER_VISION direction when updating summaries.

### C1 and fuller source reference available, 2026-10-15

Recover `../ui-foundation-2026-10-15/C1_REPORT.md` and its explicit release before
writing. C1 already supplies the fresh Workspace composition, old-layout opt-out,
selected-target scene actions and readable/expandable native combatants, with
15 passing browser groups and a frozen review build. Retain valid C1 evidence;
complete remaining NAV requirements rather than recreating its components or
repeating equivalent checks without a change or specific gap.

Weibao then asked to go deeper than Proto23's opening and use a source-based
variant. The bounded [native exploration](../../../research/PANEL_DESIGN_ABSORPTION_2026-10-15.md#deeper-native-exploration-and-source-lab-2026-10-15)
records normal earned Skills/crafting plus the private lab at
`http://127.0.0.1:19118/` (native Crafting, Skills, Actions, General Store and
Journal renderers; DEV SEEDED states labelled). Review the relevant native view
when adjusting a matching YAIR surface. The lab is reference input, not a new
engine, a normal-acquisition proof or copied code for the distributed game.
Proto23 recipe clicks execute crafting; preserve YAIR's existing explicit
command, inspection and work/stop semantics while adapting the visual structure.
Private source/captures are in `docs/research/panel-design-2026-10-15/private/proto23-lab/`.
Do not alter root's frozen C1 site or comparison artifact.

1. **Measure first.** On a populated fixture at 1366×768 and 1920×1080, record page `scrollHeight` against the viewport, every region that overflows and by how much, and how many clicks/scrolls it takes to reach each large panel (inventory, crafting, journal tabs, People, Projects, ledger, world screen, settings). Save as `NAV_BASELINE.json` plus screenshots.
2. **Nav strip (UR21, UR31).** One persistent strip with a direct entry and hotkey for each large panel; opening focuses the panel header; hotkeys shown in tooltips and a "?" sheet.
3. **History-aware back (UR22, UR23).** Extend the center-mode controller with a history stack; the bottom back bar names the real previous view. Returning restores scroll, selection, open groups and tab.
4. **Expand (UR24) and panel header (UR30).** Any large panel can expand into the center and return via the back bar; one header layout (title, one-line status, collapse, expand, pin) through the panel kit.
5. **Scroll budget (UR25, UR26, UR27).** No page scroll in ordinary play at 1366×768; one scroll owner per region; summary lines on collapsed groups; long lists get sticky header, filter and count and keep selection in view.
6. **Notices link to source (UR29); empty states (UR32).** Log lines, unlock dots and toasts open their panel.
7. **Quick jump (UR28)** only if it falls out cheaply from the nav registry; otherwise record it as a follow-up.
8. Checks: `node build.js`; `npm test` (UI contract test passes, allowlist does not grow); browser driver on a fresh origin with populated fixture: every large panel reachable by nav and hotkey, back history across three hops, restored scroll/selection, expand and return, no page scroll at 1366×768, 125% and 150% text keep the back bar reachable, save/reload with saved layouts/pins intact, Export and literal-file Import. Compare against `NAV_BASELINE.json`.
9. Report: `NAV_REPORT.md` with before/after measurements, changes, evidence and open items.
