```text
PASS K1_contract
PASS K2_reasons
PASS K3_f6_navigation
PASS K4_panel_setting
PASS K5_world_frame
PASS K6_template
PASS K7_docs_and_cards
```

K7 came from the separate docs worker; I did not edit its files.

Regression results: settings S1–S7 PASS, crafting C1–C9 PASS, Vivid I1–I10 PASS, plus the final affected I4 rerun PASS. `npm test`: **609 passed, 0 failed**. Preference reload/export/import/reset smoke, frozen gate hashes and whitespace checks passed.

Changed files and lines:

| File | Changes |
|---|---|
| [panel_kit.js](/Users/weiwei/code/yet-another-idle-rpg/src/panel_kit.js:7) | 7–36: shared contract, icons, discovery-safe labels, settings |
| [workspace_layout.js](/Users/weiwei/code/yet-another-idle-rpg/src/workspace_layout.js:8) | 8–20, 96, 129, 315–326: registration hooks, reasons, F6 |
| [workspace_views.js](/Users/weiwei/code/yet-another-idle-rpg/src/workspace_views.js:19) | 19–20, 46: combat/stance registration and world mapping |
| [adventure_notebook.js](/Users/weiwei/code/yet-another-idle-rpg/src/adventure_notebook.js:80) | 80–93, 131–135: record panels and live people sorting |
| [display_settings.js](/Users/weiwei/code/yet-another-idle-rpg/src/display_settings.js:33) | 33–53, 112–148: panel settings API and fieldsets |
| [workspace.css](/Users/weiwei/code/yet-another-idle-rpg/styles/workspace.css:738) | 738–754: icons, role tints, focus ring, frame tokens |
| [main.js](/Users/weiwei/code/yet-another-idle-rpg/src/main.js:8398) | **8398 only**: world identity wiring |

Rebuilt `dist/` and version stamps; updated GOAL/progress with evidence and dead ends.

Settings verification used Node 24 after recurring Node 22 fetch crashes. Human visual acceptance and actual non-native world travel remain unverified. Server stopped; no commits.

