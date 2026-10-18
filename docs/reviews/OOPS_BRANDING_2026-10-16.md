# OOPS branding, 2026-10-16

## Scope and accepted direction

**OOPS · Optimistic Progression Simulator** is the selected identity, with an intentional extra O. [USER_VISION](../USER_VISION.md#oops-project-identity-2026-10-16) owns the decision. Applied AD32, AD34, AD36 and UR1, UR6, UR16–UR17. Surface: existing loading threshold; target: 1366×768 desktop. Gameplay, layout redesign, mobile optimization, historical source-world names, persistence identifiers and GitHub repository renaming are outside scope.

## Changes

Updated browser title, loading title/full-name subtitle and author, metadata, structured data, README and package/lockfile name. Added a local double-O SVG favicon. Repository button now points to the existing personal fork. Removed upstream-only search verification and upstream social image references. README retains explicit Miktaew/upstream credits and original modding notes; LICENSE is unchanged. Historical YAIRPG references and save compatibility identifiers are retained.

## Verification

- `npm run build`: pass, including Ink artifact check. The existing shared-checkout runtime inputs were rebuilt; this task changed no runtime logic.
- `npm run check:rules`: pass, nine warnings for already untracked linked documents.
- Fresh isolated browser at `http://127.0.0.1:19483`, 1366×768: title, loading text, metadata, JSON-LD, fork link, favicon response and branding-element viewport bounds pass. No browser page errors. Served bundle SHA-256 matches the rebuilt local artifact.
- No pre-existing lines removed from PROJECT or USER_VISION compared with pre-edit snapshots. Rules index change is limited to AD32's identity addition.
- [Screenshot](evidence/oops-branding-2026-10-16/loading-1366x768.png) and [check receipt](evidence/oops-branding-2026-10-16/check.json).

No gameplay or persistence behavior changed, so no gameplay regression suite or migration was needed. User saves were not accessed. Existing loading-screen geometry was retained; this is not layout acceptance. Visual taste acceptance remains with Weibao. Local changes only, uncommitted and unpublished.

## Authorized GitHub repository rename, 2026-10-16

Weibao subsequently authorized renaming the GitHub repository and updating links. `gh api --method PATCH repos/onionviolet/yet-another-idle-rpg -f name=OOPS` returned `onionviolet/OOPS`. Local origin now uses `https://github.com/onionviolet/OOPS.git`; upstream remains Miktaew's original repository. README, current PROJECT links and the game's repository button now use the new canonical URL. Earlier evidence and dated dispatch snapshots retain their historical URLs. The repository was renamed remotely; local source changes have not been committed or pushed.

Rename checks: `gh repo view onionviolet/OOPS` confirms the canonical name and URL; `git ls-remote origin HEAD` succeeds. Current README, PROJECT and repository-button URL assertions pass. `npm run check:rules` passes with the same nine pre-existing untracked-document warnings; scoped `git diff --check` passes. Remaining old URLs are in dated history, dispatch assignments and this rename receipt.

## Re-applied to index.html, 2026-10-17

The 2026-10-16 `index.html` edits never reached a commit, and later rebuilds and commits replaced them; only `styles/oops_branding.css` and `resources/img/oops-icon.svg` landed (e1587afcb), unreferenced. This pass re-applied the page hunks from HEAD: browser title, loading title `OOPS` with `#loading_screen_game_subtitle`, author Weibao in the loading screen and metadata, OOPS description and structured data (with `isBasedOn` crediting Miktaew's Yet Another Idle RPG), local SVG favicon, the `oops_branding.css` link and the repository button to `https://github.com/onionviolet/OOPS`. Upstream-only search verification and the upstream social image were removed again. The Ko-fi button, README credits, LICENSE, save identifiers and historical YAIRPG wording are unchanged. Applied AD32, AD36, UR1, UR6, UR16–UR17.

Checks: On a clean detached worktree of HEAD b7dcafc3a plus only this change, `npm run build` passes and `npm test` reports 2113 tests, 2110 pass, 0 fail. In the shared checkout the suite has 2121 tests with one failure (`tests/p23-combat-options.test.js` R51 cooldown ratio, passes 15/15 alone); clean HEAD does not fail it, so it comes from other sessions' uncommitted files, not this change. Fresh origin `http://localhost:19517` (empty storage), 1920×1080 and 1366×768: title, loading title and subtitle, author, JSON-LD name, author meta, stylesheet loaded, favicon served 200 as `image/svg+xml`, repository link and no horizontal overflow all pass; no console errors. The committed `index.html` keeps HEAD's bundle version string; the local rebuild of `dist/` in the shared checkout is not part of this commit.
