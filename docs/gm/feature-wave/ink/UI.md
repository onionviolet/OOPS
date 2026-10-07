# Ink Notebook UI

2026-10-05. Internal Ink UI worker owns only `src/ink_narrative_ui.js` and this file. Source implementation is **implemented-unverified**. Both files are now released to the parent Ink GM; no worker processes or pending writes remain.

Checkpoint: AGENTS, relevant PROJECT expansion/Notebook/observer sections, Ink ASSIGNMENT/CHECKPOINT, feature-wave packet/JSON receipt, Features INTERFACE v1 and native Pocket Realm/Original Frontier/Notebook factories inspected. Dirty shared work retained. No source-bank, shared native/save/package/build/style, private-save, unit, browser or gameplay writes/checks.

## Factory and exact view contract

`createInkNarrativeUI(host)` from `src/ink_narrative_ui.js` returns `{element, render}`. `element` is the single native `details#ink_narrative_panel.expedition_panel` with its own `summary`. The factory starts the details open and preserves the player's subsequent open/closed choice. It does not mount itself. Features must append it to the existing Notebook wrapper and include its `render` in the ordinary native update path.

Host callbacks are required: `read()` returns the observer-safe view below; `act(actionId, token)` and `choose(choiceId, token)` commit through the host's current preview/commit/persist/publish boundary. Callbacks may return synchronously or a Promise; rejection must throw/reject with an observer-safe error message. The UI ignores resolved values and never claims that a command saved, rewarded or completed. Pending asynchronous callbacks disable all controls and expose a polite waiting notice without advancing any local cursor.

```js
{
    visible: true,
    token: {expectedSequence: 0, sessionId: 'ink:1', expectedRevision: 1},
    title: 'Host-supplied conversation title',
    status: 'inactive' | 'active' | 'paused' | 'complete' | 'incompatible',
    paragraphs: ['Observer-safe narrative text'],
    choices: [{
        id: 'stable-choice-id', label: 'Visible response', eligible: true,
        reasons: [], costText: 'Known cost', consequenceText: 'Known consequence'
    }],
    actions: [{id: 'host-action-id', label: 'Pause / interrupt / resume', eligible: true, reasons: []}],
    recoveryText: 'Optional host-supplied interruption/recovery explanation'
}
```

The host token is captured per rendered keyed control and sent with its action, so a stale rendered choice cannot be silently upgraded to a newer cursor boundary.

Only explicit `visible: true` reveals the panel; absent state stays hidden. Only `eligible: true` enables a control. Choices also require `status: 'active'`; inactive/paused/complete/incompatible choices show a plain status blocker if the host supplied no reason. Actions are solely host-listed, so available pause/interrupt/resume/recovery actions use host IDs and legality without the renderer inventing a destination or command. Optional `costText` and `consequenceText` also work on action entries. Missing/duplicate IDs and missing labels are discarded. Unknown status fails closed for choices as incompatible. All narrative, labels, reasons, costs and consequences use `textContent`.

Keyed button rows survive rerenders; changing labels/reasons does not replace the focused button. If the focused control disappears or becomes disabled, focus moves to the panel summary. If the panel becomes hidden, focus returns to its current Notebook tab when available. Open/closed state, focus and a temporary notice are local UI state only. No RNG, reward callbacks, inventory, enrollment, persistence, clock/timer, global bindings or global styles exist here.

Native classes reused: `expedition_panel`, `expedition_card`, `expedition_state`, `expedition_preview`, `expedition_requirements`, `expedition_notice`. Semantic native buttons retain keyboard activation; costs/consequences/reasons are linked using `aria-describedby`; notices use `role="status"`. The panel reads only host-projected text, with no registry or narrative-runtime import.

## Checks and release

Passed `node --check src/ink_narrative_ui.js` and an isolated ESM import confirming the sole callable export `createInkNarrativeUI`. Static source review confirms there is no HTML injection, narrative/runtime import, localStorage, RNG, timer, window/global binding or persistence call. Only the two reserved files were written. Parent added displayed sequence/session/revision tokens after worker release. Current hashes and repeated syntax/import checks are in STATIC_CHECKS.json; the initial worker hash is historical.

Features owns eventual source/current-build correspondence and Notebook/native persistence integration. Required joins: import the factory, pass the Ink host view and actual host `act`/`choose` commitment callbacks, mount `element` in the existing Notebook, and call `render` after host/native updates. Later browser/gameplay/save/reload/failure/keyboard/director checks remain deferred under the current implementation-first wave.
