# Reconcile ledger, 2026-11-26

*Type: CHRONOLOGICAL ledger. Audience: Weibao and agents resuming OOPS. Current direction lives in [PROJECT.md](../PROJECT.md); this file records where the work stands, not new direction.*

Why: the Codex work audit of 2026-11-26 found 277 modified and 531 untracked paths in the primary checkout, no commit since 2026-11-23, a 1.5 GB `.lane-builds` leftover and three old-save breaks with no standing save-migration gate. This pass landed the work on a local branch and made the owner docs match it. Nothing was pushed, merged, deleted, installed or launched.

## Live

- **Installed desktop app:** not re-checked this pass. [PROJECT.md](../PROJECT.md#release-state) and the [JavaScript/UI task record](gm/dispatch/js-ui-performance-2026-11-06/CHECKPOINT.md) record the 2026-11-06 install of verified build `v0.6-231c350d8838`. Nothing since has been installed, so the installed app lacks every change below.
- **GitHub Pages (`origin/ghpages`):** last updated 2026-06-26 (`fc047803a`). It shows none of the November 24 to 26 work.
- **Releases and tags:** none. `v0.1.0` waits for work at the scale of a [major YAIR update](reviews/YAIR_RELEASE_SCALE_2026-11-08.md).

## Pushed

- `origin/master` is `db24d3a92` (2026-11-23), equal to local `master`. Nothing from this ledger is on the remote.

## Local only

Branch `reconcile/2026-11-26`, cut from `master` at `db24d3a92`, grouped commits (list them with `git log master..reconcile/2026-11-26`). Master is untouched.

| Concern | What it holds |
|---|---|
| Tooling | Owned Chrome lifecycle, Windows-safe fixture helpers, suite scheduling, flow session, canonical text, LF-pinned fixture attributes |
| Old-save compatibility | `restoreGrainCartChoice` in `prepareV06Save`, exact dormant predecessor identities, structured pack identity |
| Capability runs | Ryan Romano's independently saved life |
| Slumber and Soothing | Charm loan, lender stock, materials, upkeep, response, soothing bell, silver charms |
| Tingen daily life | Office day, bakery customer, copy routine, circus notice, tent incident, watch contact, personal earmark |
| Recovery and bed loop | Fang Yuan first night in the guardians' bed, inn sleep, early wake, stone spend, breakfast, granary, healer and leaf work |
| Other leads | Harry library and school day, Paradise opening, intruder and roof, Worm bus, Super Supportive, Perfect Run, Zorian light correction |
| Cheats | Loaded dice, starting insight, glow earned rarity |
| Shared runtime | Simulation, structured packs, management, workspace views, styles, `main.js` wiring |
| Tests and goldens | Remaining tests, invention QA fixtures, procedural grammar fixture |
| Atlas | About 100 `prototypes/world-atlas` files with proofs, tests and screenshots |
| Docs | Rulebooks, vision log, checkpoints, receipts, handoffs and the evidence directories they link |
| dist | `dist/bundle.js` and map, as two commits: the first was stale against seven source files, the second is rebuilt from the final tree |

Intermediate commits are grouped by concern and are not individually buildable, because shared files such as `main.js` carry changes from several concerns. Only the branch tip is verified.

Still uncommitted, on purpose:

- `AGENTS.md`: an agent edit dated 2026-11-25 to the background-work rule (built-in browser for project work, extension for research and user-specific work). It rewrites a rule that encodes a user decision, so it stays out until Weibao confirms it.
- 13 evidence files that no document links (`atlas-build-comparison-2026-11-25`, `atlas-people-2026-11-25`, `lotm-ch130-reading-2026-11-25`, six in `reading-readiness-detail-2026-11-25`, `settings-return-2026-11-25`). Commit or delete once a receipt cites them.
- `.lane-builds/` (1.5 GB, 55 folders) is gitignored and was left alone.

## Checks

| Check | Result |
|---|---|
| `npm test` on the tree before reconciliation | Exit 1. Serial native phase: 10 files, 9 passed, `cast_making_adapter` timed out at 300 s. Parallel phase: 3 shards, 8 failing tests in 8 files (`cast_card_integration`, `cast_topic_talk`, `engine_week_seam`, `lotm_cast_week`, `lotm_rites_live`, `person_memory_persistence`, `place_acts`, `village_lead_line`). Seven were 300 s timeouts or killed child processes, and `engine_week_seam` missed its two-minute budget. The machine ran 28 slots, and 33 files exceeded their duration budget. |
| Rerun of those 9 files alone, 2 at a time | 59 of 59 passed, exit 0. The failures were load, not logic. |
| `project_md_shape`, `build_output` after the PROJECT.md edit and rebuild | 4 of 4 passed |
| `npm run check:arch` | Passed |
| `npm run check:rules` | Passed after this file was added (it had failed only on the missing link to it). |

Not owed again: unit and headless coverage of the November 24 to 26 changes passed in the full run.

Owed on the real route, one step each:

1. **Idle-machine full suite.** Run `npm test` with nothing else running, to prove the nine timeouts do not recur. One command.
2. **Installed app.** Build and install the Tauri package from the branch tip, then load an old save. Needs Weibao's yes to install.
3. **Human playtest.** Every receipt says "agent-verified, not human-reviewed" (AD42). Play Fang Yuan's first night and one Klein charm loan in the browser. One sitting.
4. **8 GB hardware.** The older-computer target is still unqualified ([direction](USER_VISION.md#comfortable-play-on-older-8-gb-computers-2026-11-06)). One run on real hardware.

## Old-save breaks and the save-migration gate

The audit counted three breaks of old saves. The repository records them as: a hospital save from the prior build paused on reload after a wording edit changed its beginning fingerprint ([RUN.md](gm/dispatch/foundation-run-2026-11-12/RUN.md)); open Village grain carts needed the new method added without reopening delivered carts ([grain method receipt](gm/dispatch/play-surface-2026-11-14/VILLAGE_GRAIN_METHOD_2026-11-25.md)); and structured pack identity needed exact reviewed alternatives. Each now has a focused test: `hp_dormant_registration.test.js`, `village_grain_cart.test.js` (modern and legacy migration, idempotence) and the structured pack definition tests, beside the older `v06_migration`, `save_compatibility` and `native_save_fixtures` tests.

What does not exist: one standing gate that loads saves captured at earlier commits into the current build and fails when any lead's life will not resume. Each break was caught by an agent's own replay, then fixed case by case. That gap is decision D3.

## Decision packet

1. **D1. Merge `reconcile/2026-11-26` into `master`.** Recommend yes after a skim of the commit list. It fast-forwards, so `master` gains those commits and the tree becomes clean. No push.
2. **D2. Run an idle-machine `npm test`, then push `master`.** Recommend yes in that order. The push puts about 11 MB of rebuilt bundle and about 7 MB of screenshots on `origin/master`. Pages and the installed app stay as they are until you say so.
3. **D3. Adopt a save-migration gate.** Recommend yes: keep a few saves from earlier commits as fixtures and add one test that loads each lead's save into the current build. It adds a test and a fixture folder, and a one-line rule in the rules index once you accept it.
4. **D4. Delete `.lane-builds/`.** Recommend yes, now that the branch holds the work. It frees 1.5 GB and nothing tracked depends on it.
5. **D5. Confirm or revert the `AGENTS.md` browser-routing edit.** Recommend confirm only if it matches what you told Codex on 2026-11-25. Otherwise `git checkout AGENTS.md`. It stays uncommitted until you answer.

Also noticed, no decision needed yet: the Atlas grew to about 100 prototype files after the advice to keep it small ([USER_VISION](USER_VISION.md#standing-ui-priority-2026-10-13) and the [Atlas goal](research/WORLD_ATLAS_IDEABOARD_2026-11-22.md#standing-world-atlas-goal) still govern). It is committed as one concern so it can be reviewed or shelved separately.

## Origin merge, 2026-11-26

After the reconcile commits landed on local `master`, `origin/master` was found 42 commits ahead (2026-11-24 16:05 to 20:18, author "Weibao", Mac host). Merged with `git merge origin/master` (history of both sides kept; backup branch `backup/pre-origin-merge-2026-11-26`). Not pushed.

- **Source of the 42 commits:** the Mac checkout `/Users/weiwei/code/yet-another-idle-rpg`. It holds one commit not on origin (`988ce5913`, spell held-out blind lexicon v2, 2026-11-24 20:33) and two untracked paths (`away-bank-evidence/`, `docs/gm/dispatch/spell-intent-ranking-2026-11-24/`). No other OOPS clone exists on this PC. Nothing was changed on the Mac.
- **Code conflicts:** `src/main.js`, `src/structured_pack_ui.js`, `src/ui/status_line.js`, `src/book_world_hp_lead_domain.js`, `src/book_world_beginning_registration.js`, `tests/combat_options.test.js` and the Atlas files (`index.html`, `serve.mjs`, `build.mjs`, `canvas.css`, `library-views.mjs`, `reader-findings.mjs`) were combined so both sides' behavior survives.
- **Overlapping features kept side by side, not chosen between:** the running-work click in the status line (local `setWorkStatusJump`, origin `registerWorkTarget`/`openRunningWork`, now chained), and three Atlas surfaces built twice (local Library "Cheat catalogue", Workbench "Ideas and backlogs" and "Implementation handoffs"; origin top-level "Cheats", "Ideas" and Workbench "Implementation"). Weibao decides which survives.
- **Owner docs:** `AGENTS.md` takes origin's short form; the local browser-routing edit of 2026-11-25 moved into `docs/gm/AGENT_WORKFLOWS.md#safety`. `PROJECT.md` keeps the local focus block and the origin pointer to the archived LOTM delivery index.
- **Regenerated:** `dist/bundle.js`, `dist/bundle.js.map`, `index.html` version stamps (`npm run build`).
