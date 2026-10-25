# E4 M10 checkpoint

Authority: sole follow-up of completed C2, explicit G1 M10 dispatch. Worktree `/Users/weiwei/.codex/worktrees/mcp-m10/yet-another-idle-rpg`, branch `codex/mcp-m10-2026-10-25`, base `3dfc49cf3`. C2 verified full head `9ddc47caf3f72cbe87a3f2eee54e240e6f248111`, merged into this branch only. Primary C2 patch was not applied.

Read absolute primary `docs/gm/dispatch/codex-parallel-2026-10-25/{COMMON.md,COMMON_W4.md,WAVE4_RULES.md,README.md,runs/c2-mcp-coverage.last.md}` and limits doc/raw ledger before extending. Read AGENTS, RULES_INDEX, PROJECT, architecture rules, systems register and MAW expansion backlog. Applies AR1–AR16 (seam: existing scenario lamp quote bridge and process-isolated harness), AD6–8/32/34/36/37/41 and sealed-secrets rule. No runtime host changes planned. Desktop target 1920×1080; mobile/layout overhaul deferred.

## Ownership and overlap before edits

E4 owns `scripts/mcp/*`, branch-local limits docs and this checkpoint. Primary `git status --short -- scripts/mcp docs/tools src/main.js` reports `?? scripts/mcp/`, `?? docs/tools/`, ` M src/main.js`. These exact paths overlap; no primary writes. Branch had only the untracked E4 reservation before merge. D2's inventory initialization repair is separate, absent here; no cycle repair authority or delivery claim.

Primary ledger had one unique line, timestamp `2026-10-25T05:02:14.514Z`, reporting PLAY text/action mismatch. It is already covered by B1/C2 startup/visible-text regressions. This additive reconciliation preserves both primary and branch raw ledgers unchanged.

## Checks and status

Planned failure scenarios: unsupported quotes fail with no state delta; independent session clocks/saves survive replace/reload/import/close; frozen reload cannot read changed checkout inputs; missing Electron fails explicitly and DOM text is never image proof. Existing `game_mcp_check.mjs` owns protocol regressions; affected runner/scenario tests remain focused until one final full suite. No broad gameplay fixes or debug API.

Initial reservation status, superseded by the final receipt below: quote/session implementation in progress; freeze and native screenshot pending.

## More-to-consider round E4-1

- ACT NOW, E4-M1 (done in source): freeze must own its reload runner and same-origin static content, not just a bundle pointer. Per-input manifest verification and per-session private copies prevent drift and reject altered supplied snapshots before replacement. Level Sol, medium effort; done check: immutable reload/import regressions.
- ACCOUNT FOR NOW, E4-M2: frozen instrumented source and desktop `dist` are independently hashed inputs. Freeze does not claim build correspondence; build first for native evidence. A screenshot is an isolated saved-state mirror, not restoration of transient panel selection or exact paused time. Level Sol, small; done check: actual CDP PNG receipt plus explicit metadata and unchanged source-session state.
- ACCOUNT FOR NOW, E4-M3: session id is an in-server process key, not a durable save identity. Omitted ids select `default`; close/replacement/exit affect one key. Native import encoding remains owned by the existing loader. Level Sol, small; done check: independent clocks/storage/reload and legacy import regression.
- LATER/DELEGATE, E4-M4 (proposal): additional AR7 quote commands require a concrete player/agent need and observer-safe owner, rather than exposing an arbitrary registry. Level Sol, small per command; done check: funded/unfunded quote and no-consumption regression. No expansion dispatched.
- LATER/DELEGATE, E4-M5 (proposal): exact transient UI screenshots would need one persistent native backend to own actions and clock, not speculative translation of headless UI state. Level Sol, medium; done check: same native session click → image → save/reload without foreground/player-profile access. Not implemented here; the current screenshot tool exposes this limitation explicitly. This is a proposal, not an accepted product decision.

## Intermediate evidence

- `node scripts/mcp/game_mcp.mjs --self-check`: PASS, 80 first-page actions, native save hash `8911b1c547d93c11`, 11 branch raw ledger entries. Initial self-check typo (`a` undefined) corrected before this passing run.
- `YAIRPG_MCP_CHECK_TRACE=1 node scripts/mcp/game_mcp_check.mjs` (quote/session slice plus inherited C2 journeys): PASS, 15 tools, deterministic greeting hash `ce1f755934f76ad5`. First quote test incorrectly compared two mutating native save calls; replaced with observer snapshot hashes around quotes.
- Current master merge: `git merge --no-edit master`, already up to date at `3dfc49cf3422c0262d86810df47459f53f3a4a67`.
- `npm run build`: PASS; generated source map differs locally and is excluded from commits.
- Expanded MCP first attempt: funded/unfunded/unsupported quotes, legacy unmarked export import, session isolation, frozen live-source corruption/reload/import and manifest tampering all passed before native launch. Electron installed preflight passed; sandbox native launch failed `Process failed to launch!` in Playwright `waitForLine`. Library emitted an uncaught rejection and exited MCP. Correction: supervise native rendering in a separate helper, translate crash/launch failures to explicit tool errors. Pending: final regression and real native host route. Working source/runner/HTML/CSS bytes restored (`git diff --quiet` on those paths passed).


## Final M10 receipt

| Feature | Status | Evidence and remaining limit |
|---|---|---|
| E4-F1 AR7 quote | CLOSED | `lamp.toggle` calls existing `scenarioLampOperations.quote`, which calls the native registry owner. Funded, missing-lamp and unsupported-command cases pass; read-only state hashes prove no oil/item/money/clock changes. No runtime host source or quote exposure changed, so no new browser quote seam needs acceptance. No sealed-truth/general registry tool added. |
| E4-F2 sessions | CLOSED | Separate worker process per validated id; omitted id remains `default`. Two games preserve independent clocks, saves, replacement, explicit import, reload and close. Missing/closed/invalid ids cannot select another game. |
| E4-F3 frozen inputs | CLOSED | 74 manifest inputs include instrumented bundle, HTML/CSS/static assets/content, runner/imports, worker, screenshot helper and desktop host source. Live main/runner/HTML/CSS were broken during reload and fully restored. Import reload works; incomplete/mismatched/tampered inputs fail before replacement. Editing supplied snapshot does not alter an existing session's private copy. External Node/Electron/automation installations remain host dependencies, not copied game inputs. |
| E4-F4 native screenshots | CLOSED, bounded renderer | Actual MCP `game_screenshot` returns real Electron/CDP PNGs at 1920×1080 on the available host route, hidden and isolated; source-session snapshot hash stays unchanged. Sandboxed native launch returns an explicit error and leaves MCP alive. This is a saved-state mirror, not the transient headless panel/selection or exact paused timing. No claim of headless layout, full native action backend, app adoption or human UI acceptance. |

### Commands, results and gaps

- `npm run build`: PASS on current-master+C2+E4 inputs; only local generated map differs, excluded from the payload. Source bytes did not change after this build (temporary immutability probes restored them); helper-only changes need no browser-bundle rebuild.
- `npm run check:arch`: PASS, main 10113/10115, display 6724/6767, save_files 310/310; no new runtime cycles/imports. `/tmp/e4-arch.log`.
- `npm run check:rules`: PASS, 22 register rows, 41 AD codes, 125 relative links, zero warnings. `/tmp/e4-rules.log`. No rule change, so no rule-behavior gate added.
- `YAIRPG_MCP_CHECK_TRACE=1 node scripts/mcp/game_mcp_check.mjs`: PASS, 15 tools, deterministic greeting hash `ce1f755934f76ad5`; sandbox Electron failure returned as an honest error and subsequent protocol/C2 journeys completed. `/tmp/e4-mcp-final.log`. Later helper pinning/pixel-scale changes are covered by the two targeted slices below, not by claiming an unchanged full-check identity.
- `node scripts/mcp/game_mcp_check.mjs --native-only` on authorized host route: PASS, actual native tool plus frozen session hash immutability and PNG dimensions. `/tmp/e4-native-tool.log`.
- `YAIRPG_MCP_REQUIRE_ELECTRON=1 node scripts/mcp/game_mcp_check.mjs --freeze-only` on authorized host route: PASS on final helper/manifest inputs, all frozen drift/import/negative cases plus mandatory real native PNG; no mocked success. `/tmp/e4-freeze-final.log`.
- `node --test tests/headless/runner.test.js tests/headless/lamplight_journey.test.js tests/lamplight_domain.test.js tests/scenario_facade.test.js`: 20/21 pass. One existing headless journey checks a message via `lastLog()`, whose first-300-character excerpt misses that action message. `/tmp/e4-focused.log`.
- `node --test tests/headless/lamplight_journey.test.js`: reproduces that same assertion alone at line 43. `/tmp/e4-lamp-repro.log`. `git diff --quiet 9ddc47caf3f72cbe87a3f2eee54e240e6f248111 -- src scripts/headless tests index.html style.css styles` passes: relevant runtime/runner/test inputs are byte-identical to C2. This is an open inherited harness assertion, not an M10 regression or a claim that the full journey passed. No out-of-scope repair made.
- `npm test`: one full run, 2873/2877 pass, four failures all `listen EPERM` on localhost in two cheat files and the RT fixture file. `/tmp/e4-full-test.log`. This remains a qualified full-suite receipt, not a blanket all-green full run.
- `node --require /tmp/e4-port.cjs --test --test-concurrency=1 tests/cheat_awakening.test.js tests/cheat_cards.test.js tests/rt_slice1_fixtures.test.js`: authorized host environmental retry, 9/9 pass; preload redirects their ephemeral listen requests to assigned port 5114, sequential browser use. `/tmp/e4-env-retry.log`. No tests edited for this retry.
- `git diff --check`, syntax checks of changed modules, restored-source byte comparison and raw-ledger status: PASS. No primary MCP/docs/ledger edits; no runtime files changed. No master merge, push, deletion, cultivation contact, account action or recursive dispatch.

### Artifact identities

Final frozen proof manifest SHA-256: `3781212cfe9011379348d39480e8091129333bb378e66b9dc4b9aee95a5cf1ac`.
Instrumented bundle SHA-256: `8d33629eb8ab52f010a0d1625c9551f96a1ab67cb8b2980c9b2ee15f8309f294`.
Manifest path: `/var/folders/xb/njlqv84d65zbhd229mkw85zh0000gn/T/yairpg-mcp-frozen-FWVbW0/snapshot.json`. This external test bundle was deliberately tampered after boot to test rejection; its manifest describes the originally captured bytes retained by the running session. For a new session create a new snapshot; the independent native-only snapshot at `.../yairpg-mcp-frozen-7EmS6c/` was not tampered.
Native PNG: `/var/folders/xb/njlqv84d65zbhd229mkw85zh0000gn/T/yairpg-mcp-electron-217wqS/screenshot.png`, 769069 bytes, SHA-256 `48129ffce859402601b11c5e979123c8b21457efdb8307413781065833bc0bce`, actual 1920×1080. Visually inspected: real rendered native Village page, not a startup/error screen. Fresh private profile; app closed by helper.

Final source hashes:

```text
ee3d47e92b97f609e83c026ed71725639303db2638af7b6d99f1e1903a99637a scripts/mcp/electron_backend.mjs
3f3308c8810a076c9c5e1a3167fda2e320596223b54bac23e2458c5e35cef5fa scripts/mcp/frozen_build.mjs
fdbf2a337cfffba555be2f121a7f7108d5b9defe1f2deb68ac78e8a88a21f1e8 scripts/mcp/game_mcp.mjs
46b304ffe0ddc9a3fcce8d7bffa16a3054e4cfd6ac64f9a4b5f62c1c4a612f15 scripts/mcp/game_mcp_check.mjs
07178e1ba8126d5398625e6fe773b7d89a1c524059ce05cd899e13c9eaf0bb2b scripts/mcp/game_worker.mjs
```

The existing headless log assertion remains open for its owner. Exact transient UI screenshots remain a disclosed capability limit. M10 is ready for scoped branch integration review; no gameplay/UI acceptance or master release is claimed. Final branch is `codex/mcp-m10-2026-10-25`; the exact committed tip is in E4's final reply (a commit cannot include its own content hash).
