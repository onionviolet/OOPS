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
