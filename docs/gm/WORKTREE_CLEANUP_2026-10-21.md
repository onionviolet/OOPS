# Finished-worktree cleanup, 2026-10-21

User request: "Check which worktrees are still needed, clean up the finished ones safely, and make the primary checkout the default for future work."

Rules: AD32, AD36, AD41; [shared-worktree practice](SHARED_WORKTREE_PRACTICE.md#primary-checkout-default-2026-10-21). This is operational cleanup, with no gameplay or persistence change. No commit or push is authorized by this request.

## Current outcome

Removed 26 finished isolated checkouts. Kept the primary checkout, the reserved master integration checkout, the newly created gear-depth lane and four worktrees with processes using them. A gear-depth worktree was added during the audit, so the original conversation count was 32 and the audit inventory contained 33. Final registration count: **7**, down from 33 at audit time (32 at the original question).

The primary working directory is now the default under AD41. AGENTS, PROJECT, USER_VISION, RULES_INDEX, GAME_MASTER_PROMPT and the shared-worktree procedure carry consistent routing. This selects a directory default; the other active coordinator owns master integration and any separately authorized push. This cleanup does not change the primary branch/index or master, and does not stop active processes.

## Preservation and verification

For every removed checkout, its exact HEAD was proven an ancestor of local master, with HEAD/status rechecked before removal. Local changed, untracked and ignored files were inventoried; ignored node_modules installs were excluded as regenerable dependencies. File and symlink manifests, staged/unstaged binary patches, and local-files.tar.gz preserve residual content. Every archived file was SHA-256 verified against the archive before removal. Symlinks were archived as links without following or deleting their targets.

Private recovery directory: `/Users/weiwei/.codex/research/worktree-cleanup-2026-10-21`. Each numbered subdirectory contains `manifest.json`, `index.patch`, `worktree.patch` and `local-files.tar.gz`; `RESULTS.json` maps original paths to recovery directories. Content stays local, outside the public repo. Existing branches were retained. Detached lane commits remain reachable through master.

A process cwd scan covered each checkout and its descendants and was repeated immediately before removal. Active or reserved worktrees were retained even when their commits were integrated. Only already archived changes in retired isolated checkouts were cleared, followed by plain git worktree remove; no force/reset/stash was used. No personal primary saves were accessed or changed. Test exports and local pack artifacts in retired lanes were preserved in private archives.

To recover a lane: create a worktree at the manifest HEAD (use a detached checkout if its old branch is occupied), apply index.patch with git apply --index, apply worktree.patch with git apply, then overlay local-files.tar.gz in the new checkout without following existing symlinks. The archive preserves local files; reinstall node_modules as needed.

## Per-checkout disposition

| Checkout | Result | Reason or recovery folder |
|---|---|---|
| `/Users/weiwei/code/yet-another-idle-rpg` | keep | Primary checkout |
| `/private/tmp/claude-501/-Users-weiwei-code-yet-another-idle-rpg/826e262b-5ffa-4590-b387-994d8e81dcf4/scratchpad/merge21b` | removed | `01-merge21b` |
| `/private/tmp/claude-501/-Users-weiwei-code-yet-another-idle-rpg/826e262b-5ffa-4590-b387-994d8e81dcf4/scratchpad/merge21c` | removed | `02-merge21c` |
| `/private/tmp/claude-501/-Users-weiwei-code-yet-another-idle-rpg/add14f73-2e56-4dad-be67-79364f110ed5/scratchpad/show` | removed | `03-show` |
| `/Users/weiwei/.codex/worktrees/gear-depth/yet-another-idle-rpg` | keep | New active gear-depth lane, created during audit |
| `/Users/weiwei/.codex/worktrees/master-except-start-menu/yet-another-idle-rpg` | keep | Reserved master integration writer |
| `/Users/weiwei/.codex/worktrees/ui-r18/yet-another-idle-rpg` | removed | `06-ui-r18` |
| `/Users/weiwei/code/yair-absorb-all-20261014/integration` | keep | Processes use checkout: 1192,1676,1913,5519,7191,7783,8236,14346,14350,15586,16696,18242,19667,20985,22568,22667,24769,25279,26030,26317,28116,28119,46276,46443,47587,71919,71924,75599,79042,85103,87183,88154,88163,89035,92895,94481,95174,96946,98796 |
| `/Users/weiwei/code/yair-absorb-all-20261014/p23-ui-polish` | removed | `08-p23-ui-polish` |
| `/Users/weiwei/code/yair-air-absorb-20261013/systems-cheats-completion` | removed | `09-systems-cheats-completion` |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/admiring-perlman-6ce62b` | removed | `10-admiring-perlman-6ce62b` |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/agent-ac52ddffa4e1deb75` | removed | `11-agent-ac52ddffa4e1deb75` |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/agent-ad82f23d94f196fae` | keep | Processes use checkout: 4410 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/engine-a1-a2-native-5dda5c` | removed | `13-engine-a1-a2-native-5dda5c` |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/features-and-fixes-f490c6` | removed | `14-features-and-fixes-f490c6` |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/gear-affixes-l3-add84f` | removed | `15-gear-affixes-l3-add84f` |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/gear-shared-example` | removed | `16-gear-shared-example` |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/interesting-ritchie-0389d6` | keep | Processes use checkout: 76037,76038,76039 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/p1-baseline-92e0aa` | removed | `18-p1-baseline-92e0aa` |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/p2-pack-loader-0a3cd2` | removed | `19-p2-pack-loader-0a3cd2` |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/p2-pack-loader-50a210` | removed | `20-p2-pack-loader-50a210` |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/ta1-village-asks` | removed | `21-ta1-village-asks` |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/tools-ip1-3-8c989c` | removed | `22-tools-ip1-3-8c989c` |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/trusting-hamilton-9e04c1` | removed | `23-trusting-hamilton-9e04c1` |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/ui-a1-a2-integration-dcbeef` | removed | `24-ui-a1-a2-integration-dcbeef` |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/ui-r20-opponent-board-be97bc` | removed | `25-ui-r20-opponent-board-be97bc` |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/ui-r21-layout-edit` | removed | `26-ui-r21-layout-edit` |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/ui-r21b-retire-selector` | removed | `27-ui-r21b-retire-selector` |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/ui-r21c-status-window-home` | removed | `28-ui-r21c-status-window-home` |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/ui-r22b-screen-use` | removed | `29-ui-r22b-screen-use` |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/w1-campaign` | removed | `30-w1-campaign` |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/wave-f-checks-4616ad` | keep | Processes use checkout: 61232 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/world-pack-loader-9cff81` | removed | `32-world-pack-loader-9cff81` |

## Checks

Archive SHA-256 verification, merge ancestry, fresh HEAD/status/file checks and process-cwd checks passed for every removed checkout. Documentation/rule checks and final inventory are recorded below after completion. Runtime build/browser/tests are not evidence for this filesystem operation; gameplay files were not changed by this task.

Final checks: `git worktree list --porcelain` confirms 7 retained registrations and all 26 removed paths absent. All 26 archive checksums reverified after removal; every removed HEAD remains reachable from master. `npm run check:rules` PASS, 41 AD codes and 105 links, with two existing untracked-owner warnings (tool registry and gear depth palette). `npm run check:rule-behavior` PASS, 36/36. Per-task whitespace and preserved-line checks PASS.

Codex project registration was also checked: `yet-another-idle-rpg` already resolves to `/Users/weiwei/code/yet-another-idle-rpg`. AD41 changes agent checkout selection, so no app project relocation is needed. Workflow edits remain uncommitted in the primary checkout for the active integration coordinator to reconcile.

Ownership released: this cleanup is complete and its seven documentation paths are available for the active integration coordinator to capture hunk-wise. Preserve newer master-only decisions and fixes; this task grants no authority to replace them from older primary snapshots. Machine-readable cleanup status: `/tmp/oops-worktree-cleanup-status.json`.


## Follow-up: orphaned processes retired, 2026-10-21

Weibao asked whether the four retained process-occupied checkouts were actually
needed and authorized their cleanup if finished. The earlier seven-checkout
count above is historical. All four lane HEADs are integrated into current
master. Fresh process inspection found 41 orphaned Python HTTP preview servers
from October 13–14 and an October 20 heat-browser process with its tail/esbuild
helpers, 44 processes total. They had no established TCP clients. Command,
start-time and PID identity were checked before SIGTERM to each exact PID; all
44 exited. No broad process-name kill was used.

The four checkout HEADs, changed/untracked/ignored content and process use were
rechecked after stopping. Their local files and binary patches were archived
and hash-verified before plain worktree removal. Archive checksums were
verified again afterward. The follow-up recovery folder is
`/Users/weiwei/.codex/research/worktree-cleanup-2026-10-21/followup`, including
`RESULTS.json`, manifests and the process/connection receipts.

| Retired checkout | Archive directory |
|---|---|
| `/Users/weiwei/code/yair-absorb-all-20261014/integration` | `00-integration` |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/agent-ad82f23d94f196fae` | `01-agent-ad82f23d94f196fae` |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/interesting-ritchie-0389d6` | `02-interesting-ritchie-0389d6` |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/wave-f-checks-4616ad` | `03-wave-f-checks-4616ad` |

Current result: **30 old worktrees removed across both rounds; 3 registrations
remain**, including the primary master checkout, active gear-depth lane and
the baseline integration/verification checkout. Primary branch alignment was
performed by the other authorized coordinator, not this cleanup. This follow-up
changed no runtime source, primary index or branch, and made no commit/push.
