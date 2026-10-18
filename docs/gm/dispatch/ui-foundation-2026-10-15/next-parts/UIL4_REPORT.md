# UIL4 report: travel and at-a-service layout contexts, 2026-10-18

From the [surface manifest proposal](surface-manifest-and-ui-flow-2026-10-18.md) (UIX6, UIY2–UIY4).
Rules applied: UR11, UR17, UR23, UR41, UR52, UR58; AR1–AR16 (AR1 one registration line in
`main.js`, AR3 one authority per fact). Target: desktop, 1920×1080 and 1366×768 at 14px and 21px.
Mobile deferred. Nothing is committed. Weibao's visual acceptance stays open (UR16).

## What a player saw before (reproduced, `evidence/uil4/before-*`)

- **Mixing counter and Crafting:** the R13 rule (`data-center-task`, `ui_tokens.css`) already hides
  Around you and the item detail, widens Inventory and gives the view the whole right-centre column.
  The Journal companion is suppressed. Layout code did not know this was a context: `contextOf`
  returned `idle`, so a placement a player made "for idle" also applied at the counter.
- **Travel:** there is nothing to see on the fixture. Walking between places is instant
  (`change_location` advances the clock). The only lasting travel state is the native journey
  (`original_frontier.travel.remaining > 0`, a journey stopped for a waiting choice). It needs a
  simulation save with the freight introduced; the populated fixture has `simulation: null`, so the
  real journey could not be reproduced in the browser (see Gaps).

## What changed

| File | Change |
| --- | --- |
| `src/layout_spec.js` | Version 4, `placementReads [2, 3]`. `contexts` gains `travel` and `service`, each with `label`, `when` and `companions`; `contextPriority` is `combat, service, travel` then idle. `contextOf({combat, travel, task})` now reads those rules. `contextLabel()`. `regionFor` and `companionsFor` take an explicit `context`; a context a panel does not name uses its idle home |
| `src/workspace_layout.js` | `placementContext()` uses the new inputs; publishes `data-layout-context`; `registerLayoutSignal(name, read)`; reset and move messages use `contextLabel` (Reset this layout (travel)) |
| `src/shell_composition.js` | Reads `data-layout-context` for companions; the attribute is a stable-moment signal |
| `src/shell_layout_edit.js` | Placement contexts come from the spec instead of a literal list. Stored placements without the new contexts read with defaults. (Not on the ownership list, needed for per-context storage; UIL1 touched it too) |
| `src/main.js` | One line: `registerLayoutSignal('travel', …)` reads the journey fact. `centerTask` is the existing published fact from `center_modes.js`; no change to it |
| `styles/shell_layout.css` | A Journal placed beside the actions for the service context shows as a strip under the view |
| `tests/layout_spec.test.js` | Priority, spec defaults, idle homes and log column, per-context storage, v2/v3 reads |
| `docs/gm/dispatch/ui-foundation-2026-10-15/check-uil4.cjs` | Browser harness |

I did not touch `workspace_navigation.js`, `village_workspace.js`, `game_bar.js` or the UIL2 change-signal
files.

## Defaults chosen (proposals, change in `LAYOUT_SPEC.contexts`)

- **P1 Priority: combat, then an open service view, then travel, then idle.** A fight must win
  (task). An open Mixing or Crafting view is something the player just did; a stopped journey is
  background. Reverse it by reordering `contextPriority`.
- **P2 Service = Mixing and Crafting only** (`centerTasks`). Trade and Storage are also place
  services; add them to the list if you want them to count. Reading, dialogue and Rest are not
  services.
- **P3 Travel companion: Journal.** Its Notes tab carries the journey status and known routes. No
  other existing panel serves travel better, so the default looks like idle. The context is still
  real: its own placement, its own reset, its own label.
- **P4 Service companion: none by default.** I tried the Journal as a strip under the view. At 1920 it
  fit; at 1366×768 and 21px it took about 40% of the column and left two crafting recipes visible, and
  the Journal shows "Lost memory" there, which does not help making. Kept the Inventory list (widened
  by R13) as the making companion. A player who places Journal beside the actions for the service
  context gets the strip (verified).
- **P5 Item detail stays with Around you** in all four contexts (the shell hides that region at a
  service under R13). Not moved: the view needs the room.

Restore (UR23): nothing is stored on entering a context, so leaving returns to the context beneath
with its placement, selected item and the center view's remembered scroll. The log column never
moves (UR11); checked as `messages` in `log` in every snapshot.

## Checks

| Check | Command | Result |
| --- | --- | --- |
| Focused | `node --test tests/layout_spec.test.js tests/ui_contract.test.js` | 13/13 pass |
| Full suite | `npm test` | 2137 tests: 2133 pass, **1 fail**, 3 todo. The failure is `native_craft_transaction`: `publishChange is not defined` in `src/components/inventory_component.js`, an uncommitted edit from the parallel UIL2 session. Not in my files |
| Architecture | `npm run check:arch` | Pass, exit 0 |
| Rule behavior | `npm run check:rule-behavior` | **Fails, same cause** (`publishChange is not defined`, 35 pass 1 fail). Passed in UIL1 |
| Rules index | `npm run check:rules` | Fails on AD code contiguity (unrelated uncommitted RULES_INDEX edit), as expected |
| Rebuild | `node build.js` | Built |
| Browser | `R4_URL=… PHASE=before\|after node check-uil4.cjs` | See below |

## Browser results (headless Chrome, fresh origin per target, populated fixture)

Targets: 1920×1080 and 1366×768, each at 14px and 21px. Screenshots in `evidence/uil4/`
(`before-*`, `after-*`; idle, Mixing, Crafting, travel, combat; two placement shots).

- **Defaults unchanged for players:** idle, Mixing and Crafting screenshots are pixel-identical
  before and after on all four targets except one (1920/14 Crafting differs by pixels; region
  contents are identical, cause not investigated).
- **Switch and restore, all four targets, zero page errors:** `idle → service` on Alt+M and Alt+C,
  back to `idle` on Esc with identical regions, companions and selected item text. With the travel
  signal on: `travel`, Mixing gives `service`, Esc gives `travel`, signal off gives `idle`.
- **Combat wins:** on the combat fixture (1920/14 and 1366/21), context stays `combat` with travel on
  and with Alt+M pressed (the Mixing key does not open during a fight).
- **Per-context placement (1920):** a spec-4 placement putting the Journal beside the actions for
  the service context shows the strip at the counter, not in idle, and survives reload and a save
  export and import. A UIL1 spec-3 placement (Inventory top left in idle) loads, applies in idle and
  survives reload and import. Neither was reported stale.

## Gaps and implemented-unverified

- **Travel in the real game: implemented-unverified.** The journey fact is read by the registered
  signal in `main.js`; I could not produce a journey in the browser. The travel checks used a
  scratch test build whose reader was `document.body.dataset.testTravel === '1'` (scratch only, not
  in the tree). Needs one play-through of a journey stopped for a choice. Unknown: whether every
  journey change calls `updateWorkspace` soon enough for the layout to flip (renders that call it
  run on persistence, so likely).
- **Combat starting while Mixing is already open: implemented-unverified.** Priority is
  unit-tested; the browser run only covered a fight that was already on.
- **Rewrite of a stored placement to spec 4 after a layout change in the browser:**
  unit-tested only.
- **Moving a box for the service or travel context through the Layout menu:** the Move to controls
  act on the current context; editing while a service view is open was not exercised.
- Trade and Storage not included (P2). Item detail does not follow the player into service (P5).
- Visual acceptance by Weibao stays open.
