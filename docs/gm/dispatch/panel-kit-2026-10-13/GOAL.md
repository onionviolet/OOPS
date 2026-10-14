# Panel kit: until-done goal (2026-10-13)

Authority: Weibao, 2026-10-13: "yes, set up the panel kit goal, use codex
subagents accordingly". Palette: PK1-PK6, CH1-CH10, PN1-PN10 in the
[considerations](../../../research/proto23/CRAFTING_SCREEN_AND_ADJUSTABILITY_CONSIDERATIONS_2026-10-13.md#more-to-consider-settings-crafting-cheat-panels-and-other-panels-2026-10-13);
layers L1-L7 and per-world UI card in the
[UI owner](../../../THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md#vivid-frame-proto23-flow-worlds-and-occasions-proposal-2026-10-13).
Workers are Codex CLI runs (`runs/`), coordinated and verified by the Claude
session that owns this folder.

## Objective

One shared panel contract (`src/panel_kit.js`, `definePanel(...)`) that every
panel uses for discovery, a panel-specific unavailable reason, role tint and
icon, region landmark with F6 navigation, its own settings, and the world
frame tokens; five existing panels moved onto it; a contract doc and ten
cheat-panel data cards so future cheat panels are mostly data.

## Done check

`check.sh` exits 0: gate integrity for all four goals, rebuild, parity,
`checks/gate.cjs` K1-K7, the settings, crafting and Vivid gates as regression,
rarity unit, `npm test` vs baseline. One item:
`URL=http://127.0.0.1:18311/ node checks/gate.cjs K2` with a server on 18311.

## Items

| ID | What |
| --- | --- |
| K1 | `known-people`, `notebook`, `known-routes`, `combat`, `stance` shells: `data-panel-kit="1"`, `data-panel-role` (actions/character/records/log/optional), `role="region"` with label, visible `aria-hidden` `[data-panel-role-icon]` in the header (V4) |
| K2 | Discovered-but-unavailable picker entries carry a panel-specific reason (Combat/Stance out of a fight mention the fight); no generic "Not available here right now" |
| K3 | F6 / Shift+F6 move focus between visible panels with a visible focus ring |
| K4 | Panels register their own settings into the This browser section, grouped under the panel name; first one `panel.known-people.sort` (recent/name), stored in `yairpg.display.v1`, rows `[data-panel-row]` sorted accordingly |
| K5 | World frame tokens: `<html data-world>`, `--frame-page`, `--frame-accent` (native Village = current Vivid/Standard values, no visual change), kit shells expose `--panel-frame-accent: var(--frame-accent)` |
| K6 | Template guard (passes today): kit panel headers reachable in view, ≥4.5:1, no horizontal overflow at 3 desktop sizes |
| K7 | `docs/PANEL_KIT.md` (Contract, Add a panel, Cheat panels, Acceptance; names the API), linked from the UI owner; `CHEAT_PANEL_CARDS.json` CH1-CH10 with id, panel, role, discoveredBy, holds, reveal, settings, sealedRule, needsFoundation |

## Constraints

- Code worker may edit: new `src/panel_kit.js`, `src/workspace_layout.js`,
  `src/workspace_views.js`, `src/adventure_notebook.js` (registration and the
  known-people row rendering for K4), `src/known_people*.js`/`src/known_routes_ui.js`
  if that is where rows render, `src/display_settings.js` (panel registration
  API), new or existing `styles/*.css`, `index.html` (stylesheet links), `dist/`.
  `src/main.js`: wiring lines only, recorded.
- Docs worker may edit only `docs/PANEL_KIT.md`, `CHEAT_PANEL_CARDS.json` and
  one link line in the UI owner doc.
- No save schema, no gameplay changes, no tests/ edits. Cheat runtime (CHEAT_LIBRARY
  C0 save field) is Foundation-owned and out of scope; cards only mark
  `needsFoundation`.
- Sealed secrets: cards describe panel mechanics, never a sealed world truth.
- No commit/push/publish. All goals' `checks/`, `check.sh`, `GATE.sha256` read-only.

## Stop and ask

A check wrong about the game; any need for a save field; new npm failure in
an untouched area; two rounds without progress.

## Next round

Code worker complete: final K1-K6 PASS; K7 PASS from separate docs worker, untouched by code worker.
Regression: S1-S7 PASS (Node 24 after Node 22 fetch crashes); C1-C9 PASS; I1-I10 PASS plus final affected I4 PASS; npm 609/609 PASS.
Rebuild, gate hashes and diff whitespace checks passed; preference reload/export/import/reset smoke passed. main.js worker addition: line 8398 only.
Desktop 1366×768, 1440×900, 1920×1080 checked; mobile deferred. Human visual acceptance and non-native travel frame behavior remain unverified.
Coordinator: run the frozen aggregate acceptance check. Worker server on 18311 stopped before handoff; no commits.

## Dead ends

(append only)

- K3 first invocation hit the documented Node/HTTP parser assertion before measurements; rerun passed.

- Final Vivid I4 found that aria-label="Panel" on an undiscovered shell made its hidden content enter the label scan. Leave the region unlabelled until discovery; discovered panels retain their title. Rebuild and rerun required.
- Settings regression hit the Node 22 HTTP parser assertion twice before measurements. curl and fetch body read confirmed served bytes; a later exact-command run passed S1-S7.

- Removing the pending label fixed Vivid I4 but K1 requires even the undiscovered known-routes shell to be labelled. Use aria-labelledby to hidden generic "Panel" text until discovery, then aria-label=title. This preserves both gates without exposing the panel name.

- Supplemental preference smoke initially selected Colors while the Layout menu was closed. Opened the menu in the temporary smoke harness; reload/export/import/reset and frame checks passed. No game change needed.
- 2026-10-13 coordinator harness fix: index.html probe uses plain http (no keep-alive) instead of Node 22 fetch, which crashed with undici assert(!this.paused); check.sh logs go to a per-run mktemp dir so parallel runs don't collide. No check loosened.
