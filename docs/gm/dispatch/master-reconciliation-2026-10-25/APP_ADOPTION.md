# Verified master publication and normal-app adoption, 2026-10-25

Authority: Weibao: “Sounds good, push master and update the normal app to this verified build, preserving my saves and the active work.” This later instruction supersedes the prior no-push/no-adoption boundary for this finite release. Rules: AD32/36/39/41, AR3/6–10 and existing desktop snapshot/mirror ownership. Human pacing/taste and unimplemented source/content horizons remain with their existing owners.

## Result

The verified runtime commit `df847a5c37ecff4de72fdbc523df8f6a5c812345` was pushed to `origin/master` and confirmed by `git ls-remote`. The normal player app now serves **`v0.6-0e5bb8f76aef`**, bundle SHA-256 `4987a62a2f3b22f1f31b574f2e5ef0f35379db11142873a6407c6ccfbd98ee8f`. All 85 frozen runtime files match the staged candidate. [Machine-readable receipt](APP_ADOPTED.json).

The current working runtime and all 1,421 recorded source/test hashes matched the [combined verification](VERIFICATION.json), so its build, 3,214 passing tests, architecture/rules checks and seven browser journeys are reused. No equivalent full suite was repeated. The release is frozen from exact committed runtime blobs, plus existing local fonts/assets/private packs. Active source-harvest/tooling/lanes/planning edits are excluded. No rebuild writes to the shared checkout.

## Save and active-work preservation

The normal player profile was closed. The existing visible Electron process used a different disposable profile on a recovery page; it was left untouched. Before starting the normal app, the entire closed normal profile was copied privately and all **236 files** were SHA-256 verified. Recovery location: `/Users/weiwei/.codex/reconciliation-backups/2026-10-25-master/app-update/normal-profile-before/`. Profile manifests, private hashes and process/debug metadata remain in the sibling private recovery folder, not this public receipt.

The existing snapshot mechanism staged the frozen build, then the normal app launched with its original userData and `app://yairpg` origin. The current pointer confirms the new build. Save presence and an opaque in-page hash were checked before and after a normal page reload; the save bytes were identical. No save content was parsed or returned, no fixture was imported, and PLAY, character creation and gameplay were not invoked in the normal profile. The app remains visible at PLAY with ordinary prompts and export dialogs.

An earlier launch-check assertion expected a start-screen dataset before initialization had settled; the app itself had launched successfully. The follow-up waited for the real visible PLAY control and verified the same running process. No second normal-profile launch, recovery import or save rewrite was used to repair that harness expectation.

## Native check

A separate hidden Electron profile loaded the exact frozen 85-file snapshot. Startup, fresh PLAY, native Save/reload, fetched bundle identity, hidden-window state and zero resource misses passed. The normal app then reported the same exact build/bundle and zero observed page errors, retained its save bytes across reload, and retained the current pointer. This verifies adoption without exercising the private player's life. Existing normal-origin delivery conditions still apply; localhost-only starts are not unlocked by publishing this build.

The publication/adoption boundary is closed. Human pacing/taste remains open. Supplementary documentation may advance master's Git tip without changing this frozen runtime identity.
