# Master publication and normal-app adoption, 2026-10-26

Authority: Weibao: “push master and update the normal app accordingly”. This
later instruction selects publication and normal-app adoption for the verified
reconciliation, superseding its earlier local-only boundary. Applies AD32,
AD36, AD39, AD41–AD43; AR3/6–10 and the existing frozen-build/profile owners.
No new gameplay scope is selected.

## Result

Runtime master `6077f785a14d8c6e43f1ed82e0bf3efb1b416b6e` was pushed to
`origin/master` and confirmed by `git ls-remote`. The normal app now runs frozen
**`v0.6-948bd45d09cd`**, bundle SHA-256
`cbf3a4ebe392796afba70a847b7dd760b73690c8005015dcbb599744d69b59e2`.
All 90 frozen files match the candidate byte-for-byte. Its original
`app://yairpg` origin and default player profile remain in use. The normal app
is visible at PLAY; no gameplay, character creation or fixture import was
invoked in the player's profile. [Machine-readable result](APP_ADOPTED.json).

The [combined integration receipt](CHECKPOINT.md) supplies the unchanged runtime's
build, 3486 passing tests, architecture/rules checks and browser/persistence
journeys. They are reused without an equivalent full-suite repeat. This release
adds six passing native desktop checks and a fresh separate-profile Electron
route. Documentation may advance master's Git tip beyond the runtime commit
without changing this frozen identity.

## Native verification

`npm run check:desktop`: PASS all six checks: smoke, crash guard, frozen build,
save mirror, presence and offline. [Result](evidence/desktop-checks.txt).

The exact frozen 90-file candidate loaded in a separate hidden Electron profile
at 1920×1080. Natural Village notice→ordinary Tingen enrollment→native
Save/reload/Export/literal Import passed, with matching served bundle hash,
zero page errors and zero missing resources.
[Native result](evidence/native-electron-result.json). Existing combined browser
receipts retain the 1536×864/1920×1080 font/viewport proof. This is
agent-verified, not human-reviewed; mobile and wider unimplemented scope retain
their existing status.

## Save preservation and recovery

The prior normal app was confirmed idle at PLAY. Its storage was flushed and
its window destroyed without calling the manual-save close hook. The closed
profile was copied privately; all **350 files** were SHA-256 verified. Recovery:
`/Users/weiwei/.codex/reconciliation-backups/2026-10-26-master-publish/normal-profile-before/`.
Private profile manifests, keys, hashes and process metadata remain outside Git.

An initial comparison against the old window's pre-shutdown fingerprint failed.
A blank, script-free host at the same origin then inspected separate copies of
the closed backup and post-launch profile. Every persisted value matched.
The old live window's main-save fingerprint differed from the final closed
backup; that pre-flush fingerprint is not the preservation baseline.

The final launch verified against the authoritative closed backup: every
persisted value and the main save's bytes match, both after full startup and
again after reload. The default profile, visible PLAY, current build pointer,
fetched bundle and all 90 snapshot files were checked. Zero page errors or
resource misses were observed. No save migration, restore import or player's
life advancement was used to repair the failed harness expectation.

The normal app was launched detached from the verification shell and remains
open. Existing local/untracked artifacts and source work are preserved. No
private profile or generated player-save content was published.
