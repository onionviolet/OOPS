# UI foundation: overarching design round

2026-10-15. Round 3 of the [format and view decision audit](FORMAT_AND_VIEW_DECISION_AUDIT_2026-10-14.md), after [round 2](UI_IDENTITY_AND_REPRESENTATION_CONSIDERATIONS_2026-10-14.md). Weibao:

> Other aspects to consider? We need to work on the overarching design level stuff accordingly?/
> Send out chat to address the following
> Q4, sure Should everything be redeisnged from thwe way bacl?, Q5, Sure, send new chat accordingly through codex, Q6, Mix at the villiage counter,

**Accepted by Weibao, 2026-10-15:** Q4 (Proto23 frame language as the default look) and Q5 (build order: log and way-back fixes, then tokens and Proto23 skin, then scene/focus panel), dispatched through Codex. Q6 names the Village mixing counter as a no-way-back panel.

## Should everything be redesigned from the ground up?

Reading "from thwe way bacl" as "from the ground up". **Redesign the foundation, not the features.** A rewrite of 466 source files would stall gameplay for weeks and repeat bugs already fixed. The clunky feel comes from three layers that sit under every feature, and fixing those three restyles and reorganizes everything above them:

| Code | Layer | What is wrong now | Foundation fix |
| --- | --- | --- | --- |
| FD1 | **Look** | No shared tokens; five radii, three font stacks, eight sizes, five button styles on one screen (round 2 UF2) | One token set (frame, fill, hairline, accent, radius 0, type scale, two button variants). Proto23 skin is the default token values |
| FD2 | **Places** | Features choose their own home. Seven insert themselves into another panel's DOM (`prepend` into the log box, local actions, location column). Only 4 of 48 `*_ui.js` files register through the panel kit | Every surface registers through `definePanel` with a declared home; no feature writes into another panel's node |
| FD3 | **Modes** | The center column has two mode systems: upstream `display.js` toggles views for dialogue, trade, crafting, reading and sleep, while the mixing panel hides and restores its siblings itself (`mixture_ui.js:23`, `dataset.mixturePreviousDisplay`). Two systems hiding the same nodes is how a view loses its way back | One center-mode controller: open(mode) pushes, back pops, Esc pops, and every mode renders the same visible back control. Native modes and new features both go through it |

Features then migrate one at a time onto the new layers, keeping their logic. That is "redesign everything" in effect, at feature-preserving cost.

## Q6 check: Village mixing counter

Reproduced on a fresh game at 1366×768 in the current working tree (served unbuilt bundle, not a fresh rebuild): **Back to local actions** is present and works. So the dead end appears in a later state. Likely causes, unverified:

- The back button sits mid-row among the mix controls, styled like an ordinary action, and scrolls out of view once the method list and queue output grow.
- Opening native Crafting or a dialogue while the mixing panel is open, or after it, lets `display.js` and `mixture_ui.js` disagree about which children are hidden. The mixing close handler hides the whole `crafting_window`.
- No Esc handling: only three `Escape` handlers exist in all of `src/`.

The Codex lane reproduces this with a populated state before fixing it.

## Other aspects at the overarching level

| Code | Aspect | Account for now |
| --- | --- | --- |
| OA1 | **Why drift happened** | Dozens of parallel lanes each styled and placed their own UI. Without an enforced contract, any redesign drifts back within a week. Add a **UI contract check** to `npm test`: fail on `border-radius`, `font-family`, raw colors or `style.cssText` outside the token file and an allowlist, and on `prepend` or `append` into a node the panel does not own. Existing violations are listed in the allowlist and shrink as features migrate |
| OA2 | **Main-surface governance** | Opt-in proposals (Waypost clerk, Mistglass conservatory, Meadow pen, Elemental preparation) live in Local actions today. Default rule: new or unaccepted features open in a Projects drawer; promotion to the main surface is Weibao's call |
| OA3 | **Always-visible information** | Proto23 keeps you, your opponent, location/time and the log visible at all times. Fix one information hierarchy: status strip and current work always visible; log full height; everything else on demand |
| OA4 | **One look, several worlds** | World frames (UI owner L3) and per-world glyph skins (audit DV6) become token overrides over the Proto23 base, never per-panel CSS |
| OA5 | **Eager hidden DOM** | Hidden panels such as the backlog expansion panel build hundreds of nodes up front. Not urgent; the panel kit's eligibility can defer building until a panel is discovered |
| OA6 | **Keyboard as the back route** | Esc pops the center mode; number keys for routine actions follow later. Click-only parity stays (play-beyond-menus O10) |
| OA7 | **Saved layouts** | Existing player layouts, pins and collapse states must load under the new skeleton. Unknown or moved panels fall back to their declared home; no save schema change unless a compatibility decision is recorded |
| OA8 | **Taste is separate from proof** | Each slice gets technical proof (rebuild, fresh origin, 1366×768, populated save, reload/import) and then Weibao's visual-feel acceptance as a separate gate |

## Dispatch

One Codex lane runs the three slices in order in the shared working tree, because calm-vivid's UI work (taste still unaccepted) is uncommitted there: [ui-foundation-2026-10-15](gm/dispatch/ui-foundation-2026-10-15/COMMON.md).

## Proto23 baseline clarification, 2026-10-15

Weibao reaffirmed: "Proto23 has a better visual deisgn so far, so we should
refactor and then use that UI as baseline accordingly?" [Direction owner](USER_VISION.md#proto23-visual-baseline-reaffirmed-2026-10-15).
The baseline includes composition, hierarchy and space allocation. This extends
the accepted visual direction beyond a token/skin match. Preserve gameplay and
use the existing shared layers. The earlier refactor proposal above is now the
chosen direction at that scope; individual measurements remain design choices.

**F1, live result review:** the foundation checkpoint records S1 and S2 as
technically checked. S1 covers bottom-pinned destination Back/Esc, log recovery
and native mode integration. S2 adds shared tokens/components and the UI
contract. The later S3 suite log records 1,769 tests, 1,764 passes, two failures
and three TODOs. The checkpoint identifies the two failures as baseline
cheat-awakening failures. S3's general browser log has nine passing groups,
including desktop navigation, combat log and literal-file import. These are
reviewed worker artifacts, not checks rerun by this consideration pass.

**F2, still open at inspection:** foundation PID 95335 was live; no final
REPORT.md was present. `s3-scene.log` passed inspection/no-time-or-RNG, then
failed a focus-visibility assertion. NAV/triage/apothecary were still queued.
Thus neither S3 nor UR21–UR33 implementation is established as complete by the
earlier S1/S2 results. Check their live reports before resuming writes.

**F3, visual comparison:** inspected the saved
[YAIRPG candidate at 1366×768](gm/dispatch/ui-foundation-2026-10-15/evidence/s3-village-1366.png)
and [Proto23 reference](research/proto23/UI_AFTER_DIFFICULTY_2026-10-13.png).
The candidate inherits the palette and frames, but stacks separate vitals,
inventory/combat selector, character/preparation, belongings and journal blocks.
Its scene also repeats destinations as chips and rows, while the pictured focus
panel is empty and routine actions extend below their region. Proto23 groups
player information above inventory, gives the opponent/focus and action region
clear adjoining space, and dedicates a tall region to the log. This comparison
is an assessment of saved images at different source dimensions, not a new
rebuilt runtime or equal-viewport measurement.

**D1, implementation constraint:** refactor toward those information
relationships, consolidating repeated shells and entry controls. Keep character
summary, current work and log visible; put detailed character records and
occasional controls behind their named direct routes. Keep the navigation/back,
accessibility and save protections already accepted even where Proto23 differs.
Match the reference's role grouping before tuning decorative effects. A blank
focus region's useful size and idle treatment should be compared explicitly.

**A1, next owned adjustment:** the queued [NAV brief](gm/dispatch/ui-triage-apothecary-2026-10-15/NAV.md)
now links this clarification and requires a reference/candidate composition
comparison inside its existing measurement and scroll-budget work. It must
first recover the foundation's actual final state. No competing UI writer,
new task or gameplay rewrite was launched. The active foundation worker has not
been confirmed to have read this later clarification.

**M1, account for now:** expanding, inspecting, leaving a service and stopping a
job are different actions. Preserve native command ownership and specify each
route's time/cancel behavior. Compact and expanded views share state and
commands; restore selection, filters, focus and scrolling. Search and cross-links
use learned knowledge and never grant remote service access. Larger text and
keyboard routes remain acceptance checks, rather than shrinking text to fit.

Target: populated 1366×768 laptop view, with current work, routine actions,
destination back control and log readable. Also check affected desktop sizes.
Mobile, new gameplay and additional effect systems stay deferred. Rebuild and
fresh-origin proof belong to the implementing lane; save/import checks apply
where affected. Weibao's visual-feel acceptance stays open. The broader
[game comparison](research/PANEL_DESIGN_ABSORPTION_2026-10-15.md) supplies optional
navigation ideas without replacing Proto23 as the baseline.


## Foundation delivery update, 2026-10-15

The foundation writer has now read the later baseline/queue clarification above.
S1–S3 are technically complete in the uncommitted shared tree; the earlier F2
inspection remains dated history, not the current execution status. The final
[report](gm/dispatch/ui-foundation-2026-10-15/REPORT.md) and
[checkpoint](gm/dispatch/ui-foundation-2026-10-15/CHECKPOINT.md) own the live result.
Elder/traveler/clerk focus and a native receipt-backed callback while the traveler
is present now pass, along with no-cost inspection, Projects homes, reload and
literal-file import. The final suite is 1,769 total: 1,764 pass, the same two
baseline cheat-awakening failures and three TODOs.

Bounded nav/hotkey/history/expand work was implemented under the earlier COMMON
wording before the revised NAV assignment was recovered. It is included and
measured, rather than removed or called the full NAV delivery. At populated
1366×768 the page is 768 px high; some normal columns and panels still both
scroll. NAV must recover these APIs/evidence and finish the role-grouping,
composition and remaining UR21–UR33 work in its existing scope. No new writer or
successor was launched here. Weibao's visual-feel acceptance remains open.


## C1 bounded composition receipt, 2026-10-15

The coordinator relayed explicit authorization for C1 before the existing queue.
[C1_REPORT.md](gm/dispatch/ui-foundation-2026-10-15/C1_REPORT.md) owns its delivery,
compatibility decision, measurements and source release. Fresh/explicit Workspace
now groups You above Inventory, contextual Focus/place/actions in center and a
680 px log region at 1366×768; idle Focus is 35 px. Existing user layouts remain
opted out unless Workspace is chosen. Scene targets no longer repeat as a full
second list. The reviewed native combatant sliver is corrected to a readable
114 px body with an exercised Expand/return route while combat continues.

Build, 15 rebuilt browser groups and 11 focused source checks pass; the full suite
has 1,766 passes, the same two baseline failures and three TODOs. The original
Proto23 reference was captured at 1366×768 through its normal introduction and
Normal difficulty, after the reveal reached opacity 1. The coordinator's
[side-by-side viewer](gm/dispatch/ui-foundation-2026-10-15/evidence/comparison-c1/index.html)
uses current equal-viewport images. No source/assets were copied into YAIR.
Source ownership is released for coordinator review, not human taste acceptance.
Remaining NAV/triage/apothecary and further Proto23 research stay in their existing
queue/scope. No successor was launched by this writer.

## V1: Proto23 shell variant, 2026-10-15

Weibao reviewed C1 and said Proto23 still looks better, explicitly requesting a
variant using its UI shell with YAIR systems underneath, preserving saves and
gameplay, especially inventory/focus and possibly stats, with useful parts of
both games. [Original direction](USER_VISION.md#proto23-shell-variant-over-yair-systems-2026-10-15).

**Accepted outcome:** a selectable playable Proto23 Shell variant, beyond C1's
grouping/skin. The fuller source renderer views are the baseline for region
geometry, type/border/gradient hierarchy, dense aligned inventory and nearby
details, contextual focus/menu, and compact real stats/equipment. Exact values
are reversible implementation choices at comfortable text size. YAIR's native
commands, save/progression owners, known-information boundaries, readable return
paths and accessibility remain. No Proto23 simulation/save layer is introduced.

The [bounded packet](gm/dispatch/ui-foundation-2026-10-15/PROTO23_SHELL_VARIANT.md)
defines SV1–SV5, compatibility and rebuilt evidence, including fuller reference
panels at populated 1366×768. Local source-based experimentation is authorized;
unresolved-provenance source stays private, with no publication or reassignment
of its license. The current C1 variant/frozen comparison remains available and
existing saved layouts are not overwritten. Visual acceptance remains open.

Current NAV writer completes its shared correctness checkpoint first. Its queue
coordinator was held, leaving TRIAGE/APOTHECARY queued while the existing
foundation UI worker reads/acknowledges V1. Only an explicit source transfer after
NAV release permits that worker's runtime edits. This avoids a second writer
while allowing read-only shell preparation. The packet does not mark V1 delivered.


### V1 technical receipt, 2026-10-15

After verified NAV release and explicit transfer, the existing foundation writer
implemented the selectable Proto23 Shell over native YAIR owners. Integrated
player/stats/equipment, dense inventory and adjacent item detail, contextual
person actions/live opponent Focus and stable upper context retain shared
Back/Esc, list/history, current work and log. Separate presentation/layout keys
preserve the existing default and saved layouts; no game/layout schema change.
Build, 24 flow groups, four compatibility/accessibility and four final visual
checks pass; full suite 1,768 pass, two inherited failures, three TODOs. Source
and served bytes match; C1 frozen artifacts are unchanged. [Report and release](gm/dispatch/ui-foundation-2026-10-15/SHELL_VARIANT_REPORT.md)
records compact inventory density and other visible limits. Source ownership is
released to root; Weibao's visual acceptance stays open. This receipt supersedes
the preceding preparation-only sequencing status, not the V1 scope or its gates.

## R2 execution evidence, 2026-10-15

Under Weibao's [spacing/color/combat refinement](USER_VISION.md#proto23-shell-spacing-color-and-combat-refinement-2026-10-15), the same worker delivered more inventory space, legible native enemy facts, quieter role colors and reduced-motion compliance. [R2 report](gm/dispatch/ui-foundation-2026-10-15/R2_REPORT.md) owns exact technical checks, source comparisons and limits. Root reviewed final mapped combat facts and current source/served parity. Upper widths remain different; 150% compact inventory is82px. No visual acceptance or changed default is inferred. Common UR34–UR38 live only in UI_RULES. Runtime source is released to root; downstream queue stays held.

## R3 execution evidence, 2026-10-15

The fresh actual-ID UI owner delivered the structural shared-grid revision, source-derived palette roles/bar grouping, directional native combat facts and usable actual150% inventory. [R3 report](gm/dispatch/ui-foundation-2026-10-15/R3_REPORT.md) owns measurements, preserved native flows, frozen demo/comparison and known deviations. Root rechecked source/served parity and the frozen artifact manifest. Global rank remains a separately scoped proposal. R3 technical delivery does not imply visual acceptance or change the default. Runtime writes are released to root; no next lane is dispatched.
