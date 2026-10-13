# UI consistency, improvements and modular panels

Requested by Weibao, 2026-10-11. Findings and design proposals only. No runtime
changes, accepted design decisions, commits or private-save access.

## Scope and evidence

Reviewed PROJECT.md, native HTML/CSS, action-legibility components, career,
content-pack, structured-pack, expedition and notebook presentation code.
The checkout was dirty at HEAD `53dc1df1`; this report describes the copied
working source, not that commit alone. Other candidate checkouts are excluded.

A temporary source snapshot was compiled with esbuild and served at a fresh
localhost origin. Headless Chrome used a temporary profile and newly created
hero, at 1440×1000 and 390×844. No page exceptions were observed in this bounded
opening inspection. This was a fresh audit compilation, not the release build
pipeline or a complete gameplay suite. Private packs were intentionally absent;
their absence was not treated as a defect. The Notebook was not visible in this
opening, so its contents and progressed routes were source-reviewed only.

Evidence: [desktop opening](reviews/ui-consistency-2026-10-11/opening.png),
[narrow opening](reviews/ui-consistency-2026-10-11/narrow.png),
[measurements and snapshot hashes](reviews/ui-consistency-2026-10-11/EVIDENCE.json).

## Ranked findings

| ID | Priority | Finding and evidence | Proposed improvement |
| --- | --- | --- | --- |
| F1 | High | Fixed desktop coordinates keep the document 1656 px wide at a 390 px viewport. Location/actions begin at x=415, journal at x=825, and log at x=1235. Even 1440 px clips the fourth column. Browser verified; `style.css:2443`, `2450`, `2714`. | Retain dense desktop panels, but use responsive docking regions. Narrow screens show local actions first with accessible switching to character, belongings and records. Define a supported minimum size. |
| F2 | High | After opening settles, the center viewport is occupied by patrol explanation and a disabled promotion button. Basic conversation/work requires scrolling. The source prepends career and supply panels ahead of native choices (`src/village_career_ui.js:60`, `src/absorb_d/ui.js:13`). Browser verified for the opening. | Put immediate local actions first, with a compact current-work strip. Collapse background career, requirements and teaching detail until requested. Preserve their availability and depth. |
| F3 | Medium | Native rows have large bordered targets, extension buttons use browser defaults, notebook buttons have custom styles, and action cards have another style contract. The desktop screenshot shows small gray promotion controls against large native rows. Generic career/pack selectors lack matching panel styles. | Share font, spacing, focus, primary/secondary/disabled treatment and semantic state colors. Preserve different content layouts where useful. Use world themes through tokens without changing interaction meanings. |
| F4 | High | Native sorting and Stats controls are `DIV`, tabIndex=-1, with no role in the live DOM. HTML provides click handlers. Separately, optional packs replace their complete body on changed views; career controls replace buttons, without focus recovery (`src/content_pack_ui.js:11`, `src/village_career_ui.js:58`). New structured panels attempt recovery and action-legibility uses keyed nodes. Keyboard reachability is browser verified; refresh focus loss is a source-supported risk, not a reproduced progressed-pack result. | Use real buttons with visible focus. Adopt stable keyed updates and deliberate fallback when actions disappear. Preserve scroll, text selection and disclosure state. Provide keyboard movement for layout editing. |
| F5 | Medium | Action information is inconsistent. Structured actions show time, inputs and reasons; older pack activities mainly provide description and a disabled button (`src/structured_pack_ui.js:69`, `src/content_pack_ui.js:23`). Older pack notices say “Saved.” and persist across changing views; richer action cards have contextual status announcements. | Give actions one presentation contract: verb, outcome, duration, inputs, availability reason, current work, cancellation terms and confirmed result. Explain only known requirements. Announce outcomes, not every countdown tick. |
| F6 | High for movable panels | Components enforce their own hosts during rendering. Career, optional and structured panels return to the center; Notebook moves owned panels into its wrappers (`src/adventure_notebook.js:79–84`). Moving an existing DOM node elsewhere conflicts with this ownership. Source verified; drag behavior is not implemented or tested. | Let one workspace layout owner mount and move modules. Modules render their contents and report eligibility, without choosing their parent. Introduce this boundary before dragging. |

F1 is also a desktop laptop concern, not solely a mobile request. F2 and F3
explain the strongest opening inconsistency: substantial new gameplay looks
like explanatory text attached above the old controls.

## D1: Recommended modular workspace proposal

Keep the original UI as the default preset, consistent with PROJECT.md. Add an
optional customizable workspace in the same browser page. New panels are useful
when they answer a distinct player question or support a real comparison.
Do not require a new panel for every new mechanic.

| Module proposal | Player question | Suggested default home |
| --- | --- | --- |
| Local actions | What can I do here now? | Center, primary |
| Current work | What is running, paused or awaiting me? | Compact center strip; expandable dock |
| Character and preparation | What can I execute with this body and equipment? | Left dock; comparison view |
| Belongings and custody | What do I hold, store, owe or have permission to use? | Left dock; local storage when accessible |
| People and commitments | Who do I know, and what agreements are outstanding? | Notebook tab; pinnable |
| Known routes and opportunities | What reachable options have I discovered? | Notebook tab; pinnable |
| Journal and received accounts | What happened and what do I actually know? | Right dock |
| Facilities and production | What does my reachable workshop/home currently do? | Contextual module when supported |

These are presentation proposals. They do not assert new engine support,
remote facility access, all-world knowledge or unified NPC omniscience.
Separate known, suspected, unavailable and undiscovered states. A panel picker,
search index, disabled reason or layout export must not disclose sealed content.

### D2: Movement and layout behavior

Start with dock, reorder, resize, collapse and pin. Make drag handles explicit,
with equivalent “Move to…” and ordering controls. Dragging should not intercept
action clicks, inventory operations or scrolling. Snap into named regions;
retain minimum useful dimensions and viewport bounds. Resizing should change
content layout, not merely shrink text.

Floating panels can follow if comparison needs justify overlap management.
Provide bring-to-front, docking and one-click reset. Keep notifications,
mandatory choices and recovery controls reachable when a panel is hidden.
Browser popouts are a separate proposal: current save ownership and Web Locks
make extra interactive windows consequential. Qualify read-only versus command
ownership before allowing them.

### D3: Module boundary

Each module needs a stable ID, title, safe view projection, command adapter,
eligible locations/worlds, minimum size, and mount/update/destroy lifecycle.
The layout owner handles parent containers, geometry, focus and visibility.
Game state and command validation stay in their existing authoritative owners.

Moving a module must not restart work, create a second command handler or timer,
change the played clock, duplicate rewards, or bypass location/means gates.
Prefer moving one live instance. If comparison requires a second view, make its
read/write behavior explicit and keep the underlying state singular.

Existing presentation projections and keyed action-legibility updates offer
useful foundations. Avoid a framework rewrite merely to add docking. Many
panels poll every 250 ms; consolidate subscriptions where warranted, but measure
a representative busy layout before claiming a performance problem or gain.

### D4: Layout persistence and recovery

Store a versioned layout separately from gameplay state: module IDs, dock,
order, size, collapsed/pinned state, density and chosen preset. Preserve saves
and treat corrupt or missing layout data as recoverable UI configuration.
Maintain different desktop/narrow layouts rather than reusing raw pixel
coordinates. Remap removed IDs and clamp restored sizes when screens change.

Define whether preferences belong to this device, character or world. A modest
proposal is device-level layouts with optional world overrides. Layout export
should carry presentation configuration only. “Reset layout” must never reset
the run. Hidden panels stay recoverable through the panel picker; unavailable
content follows observer eligibility, including after pack removal/restoration.

### D5: More to consider

| Concern | Design consequence |
| --- | --- |
| Information density | Compact, comfortable and inspection modes; avoid long tooltips as the only explanation. Let prose be selectable where useful; body currently disables selection (`style.css:122–133`). |
| Active versus background information | Pin relevant values and current work; tuck histories and full rule explanations behind disclosure. Make paused and failed work distinguishable from completed work. |
| Compare and navigate | Item comparison, known-person inspection and actionable journal links should open the relevant module while retaining return context. Search covers known content only. |
| Theme and accessibility | Keep state labels, focus and text contrast consistent across world palettes. Check zoom, text size, reduced motion and color-independent meaning. |
| Fictional UI effects | Anchor effects to current module bounds. A fictional panel crack or rearrangement must preserve usable controls and must not overwrite the player's saved layout. Existing presentation proposals already distinguish effects from the underlying panel. |
| Notifications | Separate immediate required decisions from background reports. Allow per-category filtering without suppressing save failure or active decision access. |
| Save ownership | Read-only and failed-saving states remain clear in every dock. Moving a control cannot grant write ownership. |

## Proposed implementation sequence and acceptance

| ID | Bounded slice | Observable gate |
| --- | --- | --- |
| A1 | Action hierarchy and shared visual treatment | Fresh opening exposes conversation/work without scrolling past career prose; disabled actions explain known blockers; keyboard reaches all changed controls. |
| A2 | Layout owner and two movable existing modules | Reorder/dock by mouse and keyboard; no reattachment fight, duplicate handlers, clock changes or focus loss across native refreshes. |
| A3 | Responsive docks and saved presets | 390, 768, 1440 and 1920 px plus 200% zoom; core actions remain reachable; reload restores a useful layout; corrupted configuration recovers. |
| A4 | Additional contextual panels and comparisons | Use actual progressed fixtures and means-qualified views; compare items/people/work without new knowledge or command permission. |
| A5 | Optional floating panels and world styling | Resize, overlap, reset, reduced motion and screen changes remain usable; effects retain original layout; multi-window behavior gets its own ownership gate if selected. |

All implementation gates are unrun. The audit verifies the public opening and
the named source boundaries only. Private-pack, combat, crafting, long-running
job, renewal, save/reload/import and progressed-world journeys remain required
for any later change affecting them. No user save should be used as a fixture.
