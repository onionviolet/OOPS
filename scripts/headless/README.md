# Headless full-game runner

Boots the whole game (native `src/main.js` plus every expansion, presentation
included) in Node, with no browser. The real bundle runs against an in-process
DOM built from `index.html`, in-memory `localStorage`, seeded randomness and a
frozen wall clock. Game time moves only through the engine's own dev stepper
(`advanceTicks`, `?test_hooks=1`), so stepping runs as fast as the CPU allows.

```js
import {boot} from './scripts/headless/runner.mjs';
const game = await boot(saveObjectOrJsonOrNull, {seed: 7});   // null = fresh hero creation
await game.step(1440);                                         // game minutes, invariants per hour
await game.click('.choice_dialogue');                          // same selectors a player clicks
await game.call('change_location', {location_id: 'Shack'});    // window entry points from markup
const saved = await game.save();                               // window.saveProgress -> storage
```

## API

| Call | Path it uses |
| --- | --- |
| `boot(save, {seed, storage, wallStart, heroName})` | Stores the save under `save data`, imports a fresh module instance, fires DOMContentLoaded and `<body onload>`, pauses the engine, clicks PLAY (and Confirm for a fresh hero). |
| `step(minutes, {chunk = 60})` | `advanceTicks` in chunks until the calendar reaches the target, invariants after each chunk; deferred panel renders flush per chunk, as in Chrome's dev stepper. |
| `ticks(n)`, `stepUntil(pred)` | Raw stepper ticks; predicate stepping like `ui_helpers.stepUntil`. |
| `click(sel)`, `clickText(text)`, `fill(sel, v)`, `key(k)` | Pointer and mouse events, focus, `click()` with default activation (details toggle, checkbox, label, submit). Refuses disabled or invisible targets. |
| `call(name, ...args)` | A `window` function (`change_location`, `start_activity`, `save_to_file`, ...). |
| `clickables()` | Every visible enabled control now: a bot's action menu. |
| `save()`, `snapshot()` | Manual save through `lifeSaveStorage`; `simulationTestHooks.snapshot()`. |
| `exportFile()`, `importFile(encoded)` | Options-menu export (`save_to_file`) and import (`load_progress`), which reloads. |
| `load(save)`, `reload()` | Replace stored bytes and reboot, like a fixture init script plus navigation. |
| `check()`, `addInvariant(fn)` | Built-ins: no page errors, no `expansionError`, no loading error, finite non-negative money, clock never backwards. |
| `close()` | Restores Node's timers, Date, crypto, fetch and console. Game console output goes to `game.logs` until then (`verbose: true` echoes it). |
| `settle(ms = 300)` | Microtasks plus native UI timers (250 ms panel intervals) for `ms` of timer time; Date stays frozen. |

`canonicalSave` matches det.cjs (drops `saved_at`, playtime; sorted keys) and
`diffSaves` lists the first differing paths.

## Environment fidelity

- DOM (`dom.mjs`): real node tree, HTML parser, selector engine (combinators,
  attribute operators, `:not/:is/:has/:checked/...`), bubbling and capture,
  inline `on*` attributes in global scope, `window.event`, named `window[id]`
  access, `<details>` toggling, form controls, inert canvas 2D context.
- Visibility (`css.mjs`): the linked stylesheets' `display`/`visibility` rules
  with CSS variables the game toggles on `<html>`, at a 1366x768 desktop.
  `checkVisibility()` covers box-tree suppression (`display:none`, `display:contents`,
  disconnected nodes and existing hidden/details rules); CSS `visibility` is opt-in.
  No layout: geometry reads are zero.
- Classic inline scripts in `index.html` run as scripts (top-level `let` becomes
  `var` so a reboot can redeclare them). Same-origin `fetch` reads the checkout
  and 404s missing files (`private_packs/` behaves as in the browser).
- Seeded `Math.random`, `crypto.getRandomValues` and `randomUUID`; frozen
  `Date` (advance it with `advanceWall`). One live game per process: each boot
  reinstalls the globals.
- A same-origin `<iframe>` (the import preflight) boots as a second game
  instance; the runner swaps every global between the two realms and delivers
  `postMessage` between them.

## Scripts

- `bench.mjs [--minutes N] [fresh|save.json ...]`: game minutes per wall and CPU second.
- `village_route.mjs`: one scripted route (elder, craftsman, equip axe, woodcutting, buy coal, smelt).
- `browser_parity.mjs`: runs that route in Chrome (private port, temp bundle,
  same seed and frozen Date) and headlessly, then compares canonical saves.
- `entry_points.mjs`: static list of window functions, inline handlers and
  data-* action attributes the UI uses.

Tests: `node --test tests/headless/*.test.js` (set `YAIRPG_HEADLESS_DAY=1` for the full
24-hour fresh step).
