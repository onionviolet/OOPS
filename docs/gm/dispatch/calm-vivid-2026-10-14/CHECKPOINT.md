# Calmer Vivid and progressive UI disclosure

Authorized by Weibao, 2026-10-14: implement the calmer Vivid layout and Proto23-style UI unlocks, retain useful panels and laptop space, check populated saves, and account for latest work and future extension.

Target: 1366×768 laptop, with affected checks at 1440×900 and 1920×1080. Visible outcome: quieter inactive controls and panel chrome, clear current actions, meaningful reference-tab discovery, and preserved simultaneous inventory/character/action/report views. Mobile redesign, new gameplay, a UI framework, new offline behavior and unrelated mechanics are deferred.

Authority: [user vision](../../../USER_VISION.md#standing-ui-priority-2026-10-13), [UI owner](../../../THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md#density-staged-disclosure-and-visual-hierarchy-follow-up-2026-10-14), [project](../../../../PROJECT.md).

Preflight: branch `codex/gameplay-foundations`, HEAD `ce005a31`. Existing dirty docs and evidence retained. UI-density and Vivid checkpoints explicitly release their workers/paths. Latest absorb-all changes are integrated at this tip, including native skill/journal gates and opt-in staged opening. Do not duplicate those features. Active natural-play-2 is a separate audit/proof lane. No current source/style changes observed at preflight. Baseline hashes: BASELINE.json; source copies in `/tmp/yair-calm-vivid-baseline`.

This task owns its folder, calm Vivid CSS in `styles/workspace.css`, narrowly scoped UI wiring in `src/workspace_views.js` / `src/main.js`, and new disclosure code/tests as needed. Rebuild generated outputs from current shared source; preserve later unrelated edits. No commits or pushes.

Checks planned: rebuilt fresh-origin opening, populated disposable fixture (explicitly synthetic where enriched), native discovery/combat transition, reload and literal-file import, manual collapse/pin/layout, keyboard/reduced motion, custom palette/Standard compatibility, contrast and reachability. No personal saves are read or changed.

Status: technical slice complete. [Report](REPORT.md) owns changed behavior, current rebuilt screenshots, 13 browser groups, visual/contrast/palette checks and the passing full suite. Human visual-feel acceptance and real browser zoom remain open. No commit/push. Ownership of task source/style/build paths is released; preview server on port 19064 is retained for review. `build.js` also gained the workspace stylesheet fingerprint. Latest integration at `ba46670a` was preserved and included in the build.
