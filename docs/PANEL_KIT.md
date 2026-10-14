# Panel kit

Accepted-by-gate contract proposal for the [panel-kit goal](gm/dispatch/panel-kit-2026-10-13/GOAL.md), 2026-10-13. Weibao's taste acceptance is open. This describes the target contract, not proof of implemented gameplay. Desktop/laptop first; mobile optimization and cheat runtime are deferred.

## Contract

`definePanel` in `src/panel_kit.js` adapts a panel to the workspace registry. The descriptor fields are:

| Field | Meaning |
| --- | --- |
| `id` | Stable module ID, lowercase letter followed by letters, digits, `_` or `-` |
| `title` | Known panel name and accessible region label |
| `role` | `actions`, `character`, `records`, `log` or `optional` |
| `node` | Existing content DOM node |
| `home` | Return host; defaults to `node.parentNode` |
| `discovered` | Predicate derived from persisted save facts |
| `eligible` | Predicate for whether the discovered panel works now |
| `unavailableReason` | Panel-specific reason when eligibility is false |
| `settings` | Panel-owned setting specs: `key`, `label`, `options`, `default`; include a useful description |
| `emptyText` | Known, usable panel's empty-state text |
| `after` | Default order anchor for a newly registered module |
| `defaultDock` | Default `left`, `center`, `right` or `float` dock |

No name anywhere before discovery: omit picker/search entries, counts, silhouettes, settings groups and accessible labels. Discovery comes from save facts, never a browser-only unlock flag. Once discovered, an unavailable panel stays known with a disabled entry and a specific reason, such as "Stance choices require a fight." Never use "Not available here right now." Emit the arrival cue once on a live discovery transition, never on reload/import or initial reconstruction of known state. Reduced motion shows the final state immediately.

Shells expose `data-panel-kit="1"`, `data-panel-role`, a labelled `role="region"` and a visible header icon with `aria-hidden="true"`. F6 moves forward between visible panels; Shift+F6 moves backward. Focus must have a visible ring and skip hidden panels.

| Role | Vivid tint | Surface / header / edge |
| --- | --- | --- |
| actions | Blue | `#15204c` / `#22337a` / `#5d78d8` |
| character | Teal | `#0f3438` / `#13585d` / `#35a7a5` |
| records | Violet | `#241a44` / `#3b2a72` / `#8f73e0` |
| log | Plum | `#2a1436` / `#4c2160` / `#c070d8` |
| optional | Green | `#17302a` / `#23503f` / `#5fbf8f` |

Role tints stay constant between worlds. World frames use `html[data-world]`, `--frame-page` and `--frame-accent`; kit shells expose `--panel-frame-accent: var(--frame-accent)`. Native Village retains today's Vivid/Standard values. Frames must not preview unreached worlds. Player Appearance (L7), including explicit per-panel palettes, takes precedence over scheme, world frame and occasion/state overlays; custom palettes retain their colors. See the [UI layers owner](THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md#layers-from-base-to-most-personal).

## Add a panel

Supply a descriptor to `definePanel` around the existing content node. Keep predicates tied to authoritative save facts and attach a concrete unavailable reason. Use compact label/value rows with room to read, and keep long prose in its own reading region.

The existing `registerWorkspaceModule({ id, title, node, home = node?.parentNode, homeHost, defaultDock, after, eligible = () => true, discovered = () => true, critical = false })` remains the layout boundary. The kit adds panel behavior around it; existing saved placement wins over new default docks/order. Do not treat registry defaults as discovery facts.

Register each panel's settings under its discovered name in **This browser**, stored in `yairpg.display.v1`. Use namespaced keys such as `panel.known-people.sort`, with `recent`/`name` choices, and apply the selection to `[data-panel-row]` rows. These are display preferences, not cheat ownership or save-schema additions.

## Cheat panels

[CH1-CH10 data cards](gm/dispatch/panel-kit-2026-10-13/CHEAT_PANEL_CARDS.json) specify reusable screens, not runtime. `discoveredBy` names a proposed persisted fact, not an existing save-field path. All ten need Foundation-owned C0 or later runtime before activation. Follow the [library card fields and C0-C6 phases](CHEAT_LIBRARY.md#building-it-proposal-not-started); quiet cheats have no panel. CH7 is a hover/focus overlay, not a workspace region. CH10 is embedded in its cheat's panel, not a new global settings screen.

Status windows may speak through the Clerk, crack, or go dark when the system dies, as proposals in the [presentation owner](PRESENTATION_AND_FOURTH_WALL.md). Such behavior must follow actual world state, expose only known information and preserve usable controls. No sealed truth appears in names, help, empty states, settings, appraisal or reveal cues outside its discovery route. Rumors stay explicitly unverified; appraisal redacts above its grade.

## Acceptance

Use this template per panel; record each result and evidence separately. A K7 pass only verifies documentation structure and card fields.

| Check | Required evidence |
| --- | --- |
| K1 Contract | `known-people`, `notebook`, `known-routes` (when present), `combat`, `stance`: kit marker, allowed role, labelled region, visible decorative icon; vitals still render; no page errors |
| K2 Reasons | After leaving combat, Combat/Stance picker entries disabled with fight-specific reasons; no generic unavailable text |
| K3 Keyboard | F6 advances, Shift+F6 returns, visible panels only, visible focus ring |
| K4 Settings | Described sort control grouped under People you know in This browser; name choice stored in `yairpg.display.v1` and applied to marked rows; no page errors |
| K5 Frame | `html[data-world]`, nonempty page/accent tokens, kit accent matches world accent; separately exercise Player Appearance precedence |
| K6 Fit | Rebuilt fresh-origin browser at 1366x768, 1440x900 and 1920x1080; visible panel headers reachable, text contrast >=4.5:1, no panel or page horizontal overflow |
| K7 Docs | Four required sections and API name, UI owner link, CH1-CH10 with all required card fields and allowed roles |
| Discovery | No name anywhere before discovery; live reveal once; discovered-but-unavailable reason; reduced-motion final state |
| Restore | Save/reload and literal-file import preserve discovery without replaying cues; browser display preferences remain browser-owned |

The coordinator owns the full frozen gate and regression checks. This docs slice runs only K7. Runtime, rebuilt desktop evidence, discovery/restore behavior and Weibao's taste remain separate acceptance gates.
