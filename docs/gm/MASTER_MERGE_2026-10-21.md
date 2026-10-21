# Master integration excluding start menu

User authorization: “Merge everything to our master, excluding the start menu work.” Started 2026-10-20, completed 2026-10-21. This authorizes local commits and master integration; no push was requested.

Rules: AD32, AD34, AD36; AR1–AR16 and the shared-worktree commit/preservation practice. Target for rebuilt browser evidence: 1920×1080; scripts also exercise actual 14/21px at existing laptop/floor targets. Mobile deferred. This integration preserves existing human visual/play gates and does not accept every palette proposal.

## Included work

354 modified/new paths captured from the shared checkout at `b0af7db5bd21770ca603fdf1e7b865b376f46857`, covering retained palette and interaction implementation, five deep-engine pilots, household/light/time continuity, UI details, world detail owners, research and audit records, plus existing committed work since master. Generated outputs were rebuilt from the selected candidate rather than copied from the live menu candidate.

| Branch | Reconciliation |
| --- | --- |
| `codex/gameplay-foundations` | Base committed history plus selected uncommitted snapshot |
| `codex/gear-shared-example` | Shared gear, toughness, heat grades, equipment documentation and tests; current P1 combat readers and explicit zero multipliers retained |
| `claude/engine-a1-a2-native-5dda5c` | Native ability/claim consumers and their tests/evidence |
| `claude/p1-baseline-92e0aa` | Additional measurement report retained alongside the existing baseline |
| `claude/ui-a1-a2-integration-dcbeef` | Visibility guards and integration evidence; newest QR1 and QR2 states combined |
| `claude/trusting-hamilton-9e04c1` | Original toughness ancestry; equivalent successor already included through shared gear, so no duplicate implementation or record |
| `claude/interesting-ritchie-0389d6` | Original heat ancestry; equivalent successor already included through shared gear |
| `claude/p2-pack-loader-0a3cd2` | Alternate loader history reconciled with the ours strategy. Retained the later shipped `world_pack_registry` / `world_packs/book_mol_pack` loader from `f88ce6ab9`, already integrated in foundations. Did not install a second competing loader. Alternate code/evidence remains recoverable in branch history |

All local branch tips are ancestors of the final integration. Fetched `origin/master` at `0d098b2da` is also an ancestor. `origin/ghpages` is a deployment branch, outside source-master integration.

Other worktrees were inspected. Their remaining uncommitted paths are prior UI evidence, local launch configuration, proof copies and regenerable bundles, with no additional `src/`, `tests/`, `scripts/` or `styles/` changes. They remain preserved in their owners; no cleanup was performed.

## Excluded start menu

The [input record](merge-master-2026-10-21/INPUTS.json) lists exact excluded paths. Excluded: new Beginning radio-card renderer, launch stylesheet, launch-specific test helper, launch review/evidence, launch workbench and prototype outputs, intro/starts additions, and launch-only PROJECT/USER_VISION/rules/mockup hunks. Independent shared-file changes were retained. Author metadata remains at the pre-menu baseline. Existing earlier loading-screen credits remain part of committed foundations history.

Exclusion checks passed: `src/new_game_beginning.js`, `tests/helpers/cheat_game.mjs`, and intro-flow owner equal the captured committed baseline; no new launch stylesheet/link or launch-selection direction entry is in the candidate. The original shared checkout's branch, index and files were not changed by this integration. Concurrent menu edits remain there and were not recaptured.

## Verification

| Check | Result |
| --- | --- |
| `npm run build` | PASS; final bundle SHA-256 `dceb8b4bcd6d33b8c321470a83513584c25677957fb5062f5586a96c5af905c1`; 677 embedded project source entries match files exactly |
| `npm test` | PASS 2402/2402, zero failed/skipped/TODO, 57.83 seconds |
| `npm run check:arch` | PASS; main -7/display -55/save 0 against baselines; no new cycle/import violations |
| `npm run check:rules` | PASS; 21 register rows, 40 AD codes, 100 links, zero warnings |
| `npm run check:rule-behavior` | PASS 36/36 |
| `node scripts/playtest/palette-finish.mjs . /tmp/oops-master-browser/palette` | PASS ten checks, including processing intent, native craft/storage/navigation, body recovery, stale observations, opponent departure and current-format Save/reload/Export/literal Import. [Receipt](merge-master-2026-10-21/palette-browser.json) |
| `node scripts/playtest/household-play.mjs . /tmp/oops-master-browser/household` | PASS six checks, native play/preference/cooldown, warmth/smoke, focus retention, exact played/adopted persistence and desktop text sizes. [Receipt](merge-master-2026-10-21/household-browser.json) |
| Content preservation | USER_VISION lost zero nonblank lines relative to selected snapshot. PROJECT replaces one status line; IDEA_INDEX replaces two QR status rows with later evidence; no unrelated sections lost |

Browser setup uses fresh disposable contexts and explicit synthetic fixtures, never personal saves. The existing private MS Gothic font was made available locally for proof and is not committed. The first palette attempt completed interactions but rejected its missing font; the final rerun above supersedes that setup failure. Only the optional private-pack manifest is absent. Inspected the rebuilt 1920 household screenshot. Full natural campaign progression, ordinary equipped Direwolf encounter and human visual/play acceptance remain under existing owners.

Conflict-resolution recovery: a scratch resolution script initially truncated candidate files; the build caught it. Reconstructed all eleven manually resolved inputs from intact parent/base blobs, checked full-file diffs/content preservation, then ran the passing gates above. The shared checkout was untouched. The final master integration is a single commit built from the verified final tree with the source branch tips as parents; scratch commits are not promoted.

No push, deployment, save migration, personal-save access or worktree deletion occurred. Master is checked out in the task's isolated integration worktree; the shared checkout remains on its original branch so ongoing menu work stays intact.


## Later start-menu inclusion, 2026-10-21

Weibao subsequently requested “add the latest start menu work, and then put into master”. The earlier exclusion above is historical. The [follow-up integration receipt](start-menu-master-2026-10-21/REPORT.md) records the latest restored PLAY screen, transparent edited guinea pig, author flair/links and counter removal, plus fresh integrated gates. Separate Beginning-menu design remains deferred. No push requested.
