# Bounded modularity implementation, 2026-10-21

User: “what can we do to make it easier for more stuff accordingly? if it helps long term we can implement accordingly? does it take advantage of our latest electron runtime?(did that get pushed to master yet?)”

## Scope and authority

AR1–AR5, AR9–AR13, AR16, AD34–AD36, AD39 and existing UI shared-layout rules. Continue accepted incremental extraction, one web codebase plus Electron. No framework migration, broader engine replacement, new save authority, commit or push. Future recommendations remain proposals.

Target: 1920×1080 desktop. Visible outcome: unchanged default UI region order, labels and layout; new region construction follows the layout specification. Mobile optimization deferred. No gameplay or persistence behavior change selected.

Writer reservation for this chat: `src/layout_spec.js`, `src/workspace_layout.js` (region-construction hunk only), `scripts/check_architecture.mjs`, `tests/layout_spec.test.js`, `tests/architecture.test.js`, this record. Other existing dirty changes are inputs to preserve. Checked recent chats and same-day status reservations; no conflicting reservation found for these hunks. Builds and browser evidence use a disposable copied checkout, preserving shared generated files and personal saves.

## Selected changes

- I1: Use ordered region descriptors from the layout spec for DOM construction. Meaningful failure scenario: a reordered or additional region is omitted because the host keeps a second region list. Preserve current five-region order and labels.
- I2: Enforce the existing host-free runtime direction in the architecture gate. Meaningful failure scenario: a feature imports Electron, a Node builtin or a desktop module from `src`, making shared game modules depend on the desktop host. Parse actual imports with esbuild, not text matches.

## Electron and remote state

Fetched origin on 2026-10-21. `origin/master` was `eb043eaa2a4cc32f3f3275e223220f41382b305e`; its package.json has no Electron dependency or desktop scripts. Host introduction `5a213f70c` and latest inspected host fix `61b3f876b` are not ancestors of remote master. The latter is an ancestor of `origin/codex/gameplay-foundations`, then `8dc3ce117484e019c6ce4b6a0711493d05643898`. Thus the host is pushed on the feature branch, not master. This request asks status and local implementation, not merge/push authorization.

Inspected host: Electron pinned to 44.9.2; shared browser bundle loaded from frozen build snapshots; preload exposes narrow host information/prompt bridge; player-controlled build adoption, background mode and crash/hang recovery exist. Browser and desktop deliberately share engine behavior. This does not prove an installed app's currently loaded snapshot, or that the pinned dependency is the newest public release.

## Verification plan

Focused architecture/layout tests during edits. Required completion gates in disposable candidate: build, full tests, architecture and rules checks. No standing rule text changes are planned. Rebuilt fresh-origin browser comparison at the desktop target before/after for region order/labels, selected panel behavior and layout geometry. Run the existing hidden Electron smoke when supported to check actual host plus current state persistence. Record results and exact input identity below; unexercised behavior remains unverified.

## Long-term sequence, proposals after this bounded change

| Code | Next useful change | Trigger and proof |
| --- | --- | --- |
| R1 | Separate another selected model/domain from native rendering and main imports | When the next playable feature touches that owner, inject its few required operations and publish through existing refresh/transaction ownership. Prove a second materially different consumer needs fewer core-owner edits. Hero currently imports both main and display, making it a concrete candidate; do not turn this into an unrelated whole-Hero rewrite |
| R2 | Give a touched panel a narrow read model and command port | When a panel needs a new layout or preview, remove its need to inspect another panel's DOM or raw mutable game state. Mount the same panel in the live shell and a fixture without the old native node |
| R3 | Extend shared visual anatomy and composition data | When a new region or world surface needs it, move the necessary grid sizing/style decisions into the existing spec and role/token contract. This change supplies region nodes only; it does not yet make a sixth region's grid or all world layouts automatic |
| R4 | Add desktop capabilities behind narrow host operations with browser fallbacks | File saves/history and optional host jobs can use Electron without spreading Node imports through game modules. Keep one game/save authority; add an adapter when a selected feature actually needs that capability. Move expensive work off the UI thread only after measuring a blocking workload |

Electron enables native host capabilities; it does not automatically make game state ownership modular or simulation faster. The present code already uses it for host lifecycle, frozen assets, prompts/download handling and recovery. Keeping one renderer codebase and exposing explicit preload operations follows Electron's [process model](https://www.electronjs.org/docs/latest/tutorial/process-model) and [context isolation guidance](https://www.electronjs.org/docs/latest/tutorial/context-isolation). Browser parity remains intentional. No new Electron-specific gameplay feature was selected by this implementation.

## Delivered and checked

I1 and I2 are source-implemented and verified at the following scope. No source migration or save field was added. `LAYOUT_SPEC.regions` now supplies DOM reading order and accessibility labels; its original order and labels are preserved. The import scan parses static ESM, dynamic literal imports and literal CommonJS require calls. It rejects host dependencies without a grandfathered host exemption. General nonliteral runtime code generation is outside this static check.

Evidence: [input manifest](modularity_2026-10-21/input-hashes.json), [browser receipt](modularity_2026-10-21/receipt.json), [after 14px](modularity_2026-10-21/after-14.png), [after 21px](modularity_2026-10-21/after-21.png). The manifest fingerprints 1,204 candidate source/test/script/desktop/style files; comparing matching root files at completion found no drift. HEAD remained `b0af7db5bd21770ca603fdf1e7b865b376f46857`; dirty inputs, not just HEAD, define the tested candidate. Generated shared index/dist and personal saves were not written.

| Check | Result and scope |
| --- | --- |
| Focused architecture/layout tests | Passed during edits, including parser-level host import rejection and a new/reordered region. Covered by the final full suite |
| `npm run build` | PASS, disposable candidate only; shared bundle remains untouched |
| `npm test` | Final 2,409/2,409 PASS after the scanner was extended to include require calls; [log](modularity_2026-10-21/modularity-full-tests-final.txt) |
| `npm run check:arch` | PASS on final inputs; six existing main imports and 226 cyclic edges remain grandfathered, unchanged. [log](modularity_2026-10-21/modularity-arch-final.txt) |
| `npm run check:rules` | PASS; 99 tracking warnings in the copied non-git candidate. No rule text changed, so no rule-behavior change was selected. [log](modularity_2026-10-21/modularity-rules.txt) |
| Rebuilt Chrome, fresh contexts/origins, 1920×1080, 14/21px | Exact before/after region IDs, accessibility labels and rectangles match. Actual Journal click opens the shared view; Escape restores local navigation state. Sixth test-only region mounts with its label from the spec, without another host edit. No browser errors on final runs. This proves mounting, not a complete sixth-region grid design |
| Existing hidden Electron smoke | PASS against the candidate build and installed Electron 44.9.2: play, Save/reload, quit/relaunch, Export/literal Import. Actual host viewport 1800×1035 follows display work area; Chrome above owns the 1920×1080 comparison. Fresh disposable userData/downloads only. [log](modularity_2026-10-21/modularity-electron.txt) |
| Owned whitespace | `git diff --check` PASS on shared-root owned paths |

Final shared-root `npm run check:rules` also PASS with two existing untracked-owner warnings (`TOOL_REGISTRY.md` and the gear-depth considerations owner), resolving the copied candidate's broader tracking-warning ambiguity.

Verification corrections: the first custom browser assertion wrongly expected the center container to disappear on Escape. It remains mounted for local actions; corrected the verifier to inspect the actual `data-center-task` owner. The supplied mid fixture also retained an undefined recipe key, and the isolated copy lacked the ignored local font. Removed only that fixture key and copied the existing local font into the disposable candidate. No production fix was inferred from those setup failures; the final before/after uses identical corrected fixtures/assets. The one-off [browser verifier](modularity_2026-10-21/modularity-browser.mjs) ran as `scripts/modularity-browser.mjs` in the candidate; its before variant reconstructs only this change's old region data/loop, preserving other dirty UI inputs.

The first full suite passed before the parser was broadened; final full-suite evidence above supersedes that tooling input. Runtime/build/browser/Electron inputs did not change during that parser-only revision.

Remaining: human visual/play judgment, arbitrary grid composition and further engine/UI boundary extraction. No broad modularity completion, installed player snapshot adoption, commit, merge or push is claimed. Writer reservations in this record are released at completion.
