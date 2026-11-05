# Crafting UI normal-app adoption, 2026-11-05

```receipt
build: 3cd57f2247f7b06e0e26d4df5e021ae8bd70a22fb14fc46ba433f229a2c4e785
route: fixture(normal-profile-copy)
state: browser-verified
viewport: copied normal Electron window; earlier crafting proof at 1920x1080 and 1536x864 with saved 14/17/21px presets
persistence: checked
tests: hidden frozen Electron save/load/reload PASS; installed files and pointers verified
review: none
```

Weibao authorized: “Update the installed app with these changes so I can try the crafting UI.” The normal frozen app profile now points both `current.json` and `latest.json` to **v0.6-74f7cf7c4eda** (117 files). Previously: `v0.6-e7f0aa4029ca`. This is normal-app snapshot adoption, not a new app bundle or a public release. The player's app was closed and was not visibly launched.

Candidate source: clean archive of commit `2ddf2f0ea4b7d5eb10d7fc3a947d76da2739f748` plus this chat's eleven runtime/CSS paths, listed with SHA-256 in [preparation](../../../../work/crafting-app-adoption-20261105/preparation.json). Unrelated dirty source, tracked dist/index and documentation were not swept into the build. Private content and private fonts came from the prior installed snapshot; candidate had no missing prior files. The resulting bundle exactly matches the [shell/crafting verification](CHECKPOINT.md#shell-sizing-closure-2026-11-05), SHA-256 `3cd57f2247f7b06e0e26d4df5e021ae8bd70a22fb14fc46ba433f229a2c4e785`. The snapshot freezes actual asset bytes; it does not depend on temporary source symlinks.

Verification: `scripts/adopt_candidate.mjs verify` ran hidden frozen Electron on a disposable copy of the normal profile. It served `v0.6-74f7cf7c4eda` at the existing app origin; the save loaded, Save completed, and reload kept the save. Zero page errors and zero missing files. The copy was deleted afterward. No personal save contents were reported. [Verification](../../../../work/crafting-app-adoption-20261105/verify.log).

Installation: `scripts/adopt_candidate.mjs swap --yes --label crafting-ui-20261105` was authorized by the request above. The helper confirmed the app was closed, backed up the profile with a verified SHA-256 manifest, copied the candidate atomically, and switched both pointers. Every non-build profile file matches its backup; all installed candidate files are byte-identical to the verified candidate. A separate pointer and bundle/CSS hash read confirmed the installed state. [Install receipt](../../../../work/crafting-app-adoption-20261105/install.log).

Backup: `/Users/weiwei/.codex/reconciliation-backups/2026-11-05-crafting-ui-20261105/normal-profile-before` with its sibling `normal-profile-before.sha256` manifest. The old snapshot is retained. Rollback with the app closed: use `desktop/snapshot.cjs` `writePointer` to set both `current.json` and `latest.json` back to `v0.6-e7f0aa4029ca`. Only build directories/pointers changed; the real saved game and display preferences were not rewritten or migrated by this task.

Installed and agent-verified, not human-reviewed. Launch the normal OOPS app to try it. No commit or push.
