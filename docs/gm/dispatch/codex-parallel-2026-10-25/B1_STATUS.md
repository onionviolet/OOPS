# B1 game MCP fix and playtest, 2026-10-25

Input: isolated `codex/game-mcp-play-2026-10-25`, master `3a1180dc274868d1e4350058a74725ac6b534394`, copied untracked primary `scripts/mcp/` and `docs/tools/`. `node_modules` remains a symlink and untouched. Applies AD6–AD8, AD32, AD36–AD38, AD41, AU1–AU15; no game runtime or product-direction changes. Headless evidence does not establish desktop layout or human acceptance.

P1 diagnosis: `boot()` already clicks PLAY. The shim's `body.innerText` still includes hidden startup text, and `clickText()` searches fewer control kinds than `clickables()`. The old stdio regression passed on this input, including elder dialogue. Wrapper correction filters hidden text, explicitly reports `started`, matches text against the same actionable controls, and pages/scopes views. `game_new.url` permits localhost opt-in world test origins, preserving the test-hooks requirement.

Finite playtest plan: four Luna-medium workers, one area each, no descendants, isolated server per worker. Parent owns MCP changes and final report, workers own only B1 area reports and temporary client scripts. Included-allowance telemetry unavailable; no paid fallback. No game source changes or private saves.

Frozen-bundle option deferred: `runner.reload()` closes over `bundleGame()` and imports a harness-instrumented module, while HTML/CSS/fetches still come from the checkout. Merely accepting a bundle path in this wrapper would imply a freeze it cannot provide. This sweep pins the committed isolated worktree instead.

Checks:
- Original `node scripts/mcp/game_mcp_check.mjs`: PASS, nine tools, deterministic elder dialogue/persistence; did not assert hidden startup text or livelihood reachability.
- Updated `node scripts/mcp/game_mcp_check.mjs`: PASS before localhost option, adds started/hidden text and reachable Village Find work regression, deterministic seed/save/export/import and ledger checks. Final run pending.

Playtest and completion gates running. Full source suite reserved for one pre-commit run. No push authorized.

Partial follow-up: parent reproduced Village patrol step failure at seed251035, 120 minutes (`skill_required` undefined); recorded as P2 in the primary report without source changes. MCP regression stops after reaching/clicking Patrol, separating tool reachability from this runtime defect. Full suite: 2,873/2,877 passed, four local-HTTP tests failed EPERM under sandbox; targeted three-file rerun outside sandbox running. Build/arch/rules passed. Build-only sourcemap path change restored from isolated HEAD, not committed.

Parallel safety fix: export filenames used virtual Date.now in a shared temp directory. Wrapper now uses node:crypto randomUUID, with a same-instant two-export regression; no save bytes changed.

Final tool checks on the current MCP inputs:
- `node scripts/mcp/game_mcp_check.mjs` (log `/tmp/b1-mcp-resume.log`): PASS, nine tools, deterministic hash `e03130b905d6f533`; includes native export/resume and unique filenames. Replaced the overbroad patrol ticking assertion after it reproduced P2, retaining reachable/control-click checks.
- `npm run build`: PASS on baseline source plus MCP changes. No product code changed; generated source-map path-only output restored.
- `npm run check:arch`: PASS; baseline grandfathered cycles unchanged.
- `npm run check:rules`: PASS, 22 register rows, 41 AD codes, zero warnings. No rule changes; rule-behavior gate not applicable.
- `npm test`: 2,873/2,877 PASS; four failures are local HTTP bind EPERM in the sandbox, not assertion failures.
- `node --test tests/cheat_awakening.test.js tests/cheat_cards.test.js tests/rt_slice1_fixtures.test.js` outside sandbox: 9/9 PASS, covering all four denied tests. Full suite not rerun; runtime inputs unchanged.

A household worker reproduced encoded-export `game_new(path)` failure; wrapper fixed and regression passes. All tool fixes await coordinator application; no primary scripts or tool ledger modified directly.

## Completion receipt

Four Luna-medium area workers completed bounded player-visible sweeps. Every area's retained test life reached at least Day3 and exercised save/export/import; manor Day3 01:15, Frontier/Mistglass idle Day3 08:00, LOTM-route attempt idle Day4 08:00. Active progression was exercised for the reached Frontier and household actions; idle days do not prove multi-day routine pacing. Worker artifacts own exact seeds, actions, hashes and gaps. Parent reviewed all returns and deduplicated patrol errors. BFA2 remains the native-dropdown code; new crafting ambiguity is BFA3 (do not reuse the earlier code).

Additional wrapper fix: listener-only `.location_choice_dropdown` controls are now included. Natural Village → Wild willow stand → Village journey passes; final stdio check `/tmp/b1-mcp-final-complete.log` PASS, including this regression and the page80 action regression. No `src/`, headless runner, transport, dependency or installed-app change.

Open findings include patrol runtime error, ambiguous crafting percentage, storage identity, and inaccessible Mistglass/Tingen/continuation routes. The consolidated primary `docs/reviews/PLAYTEST_SWEEP_2026-10-25.md` records full repros, actual coverage, positive play feedback and ranked top10. These blockers mean the requested cultivation/combat/continuation/LOTM mechanics are explicitly untested, not complete gameplay coverage.

Coordinator delivery: `B1_game_mcp.patch` uses git no-index diffs against the copied original scripts/tools, plus new lane records. The consolidated report is already updated directly in primary and mirrored into this isolated branch, so it is intentionally excluded from the patch to avoid double application. No primary tool/runtime files changed here. Apply patch, rerun the direct-stdio regression in primary; no merge/push or installed adoption implied. Frozen-build input remains deferred for a runner-owned change.
