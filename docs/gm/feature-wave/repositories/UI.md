# Repository absorption panel

2026-10-05. Implemented-unverified. Owned files: `src/repository_absorption_ui.js` and this document. No existing files, native state, save, build or global styles are changed by this worker.

`createRepositoryAbsorptionPanel({registry, read, command})` imports only `repositoryAbsorptionPresentation` from the root-owned host and returns `{element, render}`. Its stable ID is `repository_absorption_panel`; it uses existing `expedition_panel`, `expedition_card`, `expedition_preview`, `expedition_requirements`, `notebook_preparation` and `expedition_history` styles. Initial attachment follows existing native panels via `location_actions_div`; Notebook subsequently owns the parent.

`read()` supplies `{state, context, enabled, error, inDialogue, inCombat}`. Existing `canWrite` is accepted when `enabled` is absent. `command(request)` is a synchronous durable integrator callback that throws on rejection. Every click reads the live snapshot, refreshes the host projection and stamps the current `state.sequence`. Requests are `{type:'begin', sequence}`, `{type:'command', id, targetId?, sequence}` and `{type:'cancel', id:currentWork.id, sequence}`. Current action targets and cancellation job IDs come from the fresh projection, not a captured old snapshot. The UI owns no planner, RNG, enrollment, clock, inventory or publication.

Presentation fields used: `visible`, `canBegin`, `actions` (`id`, `label`, `description`, `targetId`, `eligible`, `reasons`, `preview`, `duration`, `cancellation`), `records` (`id`, `text`, `basis`, `at`), and optional `work` (`id`, `label`, `remainingMinutes`, `cancellation`, `preview`). Action `preview` strings are the primary exact disclosed cost/duration/cancellation terms; `costs`, `duration` and `cancellation` are display fallbacks when no preview is supplied. Record basis accepts a string or known `text`/`label`/`sourceLabel`; standard observation/testimony/instruction kinds receive readable labels. Raw attributed actor IDs are never shown.

Optional itinerary/stock values are a display string or `{label, text, rows:[{id,label,text}]}`; itinerary may use `steps` in place of `rows`. The host must supply only player-observable display text. A `known:false` value/row is omitted. The UI does not stringify stock/owner structures, inspect hidden registry members, or construct undiscovered controls. Actions and records preserve keyed DOM rows; removed focused controls hand focus to the summary, and a hidden panel hands it to the selected Notebook tab. Native details/summary controls, semantic buttons, descriptive reason links and a polite status region supply accessibility hooks.

## Exact existing-file join for Features

1. In `src/main.js`, import `createRepositoryAbsorptionPanel` from `./repository_absorption_ui.js`, add `let repositoryAbsorptionPanel` beside the existing expansion panels, create it after the other native panels with the current registry, `readProgression()` plus `campaignContext()`, current dialogue/combat flags and `enabled:ownsSave&&!foundationSaveBlocked&&!importProbeToken`, and the root-declared `actRepositoryAbsorption` durable callback.
2. In the existing progression refresh alongside `originalFrontierPanel?.render()`, call `repositoryAbsorptionPanel?.render()` before `adventureNotebook?.render()` moves/shows Notebook panels. The callback checks authority/stale sequence, stages root host begin/command or an existing guarded `cancelSimulationJob`, then invokes the sole `persistExpansion(plan)` publisher.
3. In `src/adventure_notebook.js` `panels`, register `["repository_absorption_panel","here"]`. In `attention`, map a player simulation job whose command group is `"repositories"` to `view:"here", panel:"repository_absorption_panel"`; this makes newly accepted work reachable through the existing one-time attention behavior. No loading/rendering join calls begin or enrolls Miri.

No changes to index, package, global CSS or save schema are required by the panel. Features owns all existing-file integration and bundle regeneration. Later browser, costs/rejection behavior, stale action, cancellation/refund, keyboard/focus, privacy, save/reload/failure, regression and director gates remain deferred.

## Static check receipt

`node --check src/repository_absorption_ui.js` passed after writing the panel; new-file whitespace review is clean. Module import/link check awaits the root-owned host export. These confirm syntax and exports only, not gameplay, rendering or saved behavior.
