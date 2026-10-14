# Implementation packets

PROPOSALS only. Research authorization does not authorize execution. Codes match REPORT.md. One useful slice precedes broader coverage. Preserve dirty state and recover the live writer before any future edit.

The incumbent already validates frozen JSON, separates requirements from costs and plans mutations on cloned state. `src/simulation_contracts.js:108–111,190–194` and `src/simulation.js:566–588` were read here. Do not replace that route with arbitrary Vue getters or global reset rows.

## P1: One shared layer contract

Owner: docs/ENGINE_AUTHORING.md; docs/ENGINE_EXPANSION.md. Evidence: F6,F8,F13,F16,F18.

Seam: Existing definition registry and validator; existing authoring guide.

Smallest playable result: Document and validate one world module with explicit dependencies, stable identity, clock units and reset effects. Produce a collision/missing-reference error that names the authoring location.

Acceptance: Two independent modules register without collision; a renamed persisted ID has a migration decision; seconds/minutes are converted at an explicit boundary. Save/reload/literal Import retains their separate state.

Compatibility and exclusions: No framework adoption; new module fields default safely for old definitions and saves.

## P2: Show why progress slowed

Owner: docs/ENGINE_EXPANSION.md; docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md. Evidence: F3,F4,F10.

Seam: Existing progression formulas and action previews; UI design owner.

Smallest playable result: One known training benefit reports current effect, a world-specific diminishing return and one earned way to change it. Compute text from the same resolved rule used for the effect.

Acceptance: Below, at and above threshold agree with display. No hidden truth leaks. Rebuilt 1440x900 fresh-origin desktop shows the effect and next action at comfortable size.

Compatibility and exclusions: No blanket caps or power nerfs; preserve current rates until explicitly selected.

## P3: Retain completed sections as useful passive activity

Owner: docs/ENGINE_EXPANSION.md; docs/worlds/MULTIVERSE_STRUCTURES.md. Evidence: F9,F11.

Seam: Existing clocks, jobs, retained world state and campaign transitions.

Smallest playable result: One completed local activity retains a productive saved timer and can be revisited. Separate simulation activation from which panel is selected.

Acceptance: Switch view without stopping work; explicit pause stops it; revisit remains available; elapsed time and output agree between continuous and chunked advance. Save/reload/literal Import mid-activity preserves it.

Compatibility and exclusions: Do not copy Communitree child wipes or linear completion locks; define old-save defaults and actor-local costs.

## P4: Use one requirement result for action and display

Owner: docs/ENGINE_AUTHORING.md; docs/ENGINE_EXPANSION.md. Evidence: F13,F14,F15.

Seam: Existing command preview and planned commitment, not a new pay loop.

Smallest playable result: Display one action with a spent resource, non-spent skill need and quantity limit. Aggregate two costs on the same resource before quoting affordability.

Acceptance: Unavailable reason matches execution; same-resource total cannot overspend; stale preview rejects. Bulk equals repeated single actions within rounding rules, or bulk remains unavailable. Persistence passes if receipt changes.

Compatibility and exclusions: No generic function-valued requirement model; no silent clamp used as spending validation.

## P5: Keep a desktop overview beside useful detail

Owner: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md. Evidence: F4,F5,F7,F8.

Seam: Existing desktop workspace and public projections.

Smallest playable result: At 1440x900 keep overview, selected detail and retained activity in useful independent panels. Show reset consequences separately from map links. Routine actions stay in view.

Acceptance: Rebuild and use fresh desktop origin; inspect 1366x768 affected fit and text zoom. Exercise known node, action, automation and return route; preserve saved layout where affected.

Compatibility and exclusions: Mobile optimization deferred; no sealed prerequisite disclosure; human layout acceptance separate.

## P6: Give authors a cross-system balance review

Owner: docs/ENGINE_AUTHORING.md; docs/ENGINE_EXPANSION.md. Evidence: F10,F12,F15,F17.

Seam: Existing authoring validator plus balance fixtures under the owning future task.

Smallest playable result: For one cross-system multiplier, list source, target and gain type; compare both unlock orders and an idle/active trajectory through the affected phase.

Acceptance: No accidental dead route; reset recovery useful; declared dependency cycle reviewed with measured trajectory. A scenario report records assumptions and limits rather than claiming universal balance.

Compatibility and exclusions: Do not impose a closed roster or anti-abuse ceiling on solo play; no full-game balance gate for one slice.

## P7: Offer voluntary automation in one clear panel

Owner: docs/ENGINE_EXPANSION.md; docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md. Evidence: F5,F7.

Seam: Existing routine executor and routine status projection.

Smallest playable result: One saved learned routine appears in a known automation panel with on/off, owned inputs and exact pause reason.

Acceptance: One control starts/stops real work; shortage pauses without phantom production; manual action remains possible; Save/reload/literal Import preserves intent. Rebuilt desktop exercises the route.

Compatibility and exclusions: No parallel scheduler; earned convenience and world-specific prerequisites remain authored choices.

