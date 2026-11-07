# Wave 11 closure

```receipt
build: 40952623fd47ff4c48dfcbeb17097f3d3208eb51908ff8092df252da8762609e
route: fixture(wave11 closure)
state: browser-verified
viewport: 1920x1080
persistence: checked
tests: focused 48/48; full suite 5514 pass, 0 fail, 5 private-fixture skips; all 5 subsequently passed in a 26/26 focused run
review: diff-scoped
surface: LOTM host, domain, constables, composition-root ports
```

Request: finish the seizure inventory seam and jail clock seam, run final verification, preserve other sessions' work.

Ownership: `src/book_world_lotm_host.js`, `src/book_world_lotm_domain.js`, `src/book_world_lotm_constables.js`, the seizure receipt argument in `src/duties_domain.js`, a narrow port hunk in `src/main.js`, focused regression tests and this receipt. Existing dirty files belong to other sessions, including LOTM UI, tempo fight host, prose rules, audits, build output and shell work. The follow-up request authorizes committing only Wave 11 fixes and closure records; no push requested.

Applies: AR3/AR4/AR6/AR7/AR10, AD36/AD42/AD43, OB2/OB4. Seams: existing staged gameplay inventory publication, native chronicle plan/commit, and `constables@1` pending sentence. No new saved shape. Existing pending sentences are served from their saved remaining minutes. Player-text sample: “You are to spend a night in the cells.”

Failure scenarios: a rejected inventory publication leaves inventory and arrears unchanged; worn/borrowed/quest goods are excluded; a clipped clock charges only actual elapsed time; a rejected clock publication leaves the sentence owed; a fight's ending commits before its sentence runs. Desktop fixture target 1920×1080; mobile deferred. No new UI design.

Runtime closure: the two named Wave 11 integration gaps meet FLR1–FLR6 on named fixtures. Agent-verified, not human-reviewed. Existing wider cross-world acceptance items remain in the original run checkpoint.

## Stable verification boundary

Other sessions changed `src/display.js` during the final shared-tree suite (currency test failed its nested architecture check: 6771 > 6767) and added an unfinished performance receipt. Preserve those writes. Verify the deliverable in `/tmp/oops-wave11-closure-20261106`, detached at `abdaedf0aba222a2580edc58d1f430210dd01135`, with only this task’s source, tests, proof scripts and receipt copied in. This is an integration/verification checkout, not a new delivery branch. Keep it until the checks and native proof have been captured, then retire it after retaining this task’s uncommitted patch and evidence in the primary checkout. Symlinked dependencies/private game packs are inputs and must not be deleted through their links.

Shared-file ownership discovered during verification: another session added `allocatedDoseView` / `issuedDose` to the LOTM host and `calendarMinute` to the main context. They remain intact in the primary checkout. The isolated candidate excludes those unrelated hunks; its source overlay is this task only. Any later staging must use the retained hunk patch, not whole-file staging of `src/main.js` or `src/book_world_lotm_host.js`.

Shared-tree evidence: first full run 5518/5518 passed, before final hardening. Final shared-tree run: 5518 passed, 3 failed, all three failures were nested architecture checks while another session temporarily grew `src/display.js` from baseline 6767 to 6771. Global rules also encountered that session's unfinished `js-ui-performance-2026-11-06/CHECKPOINT.md` without a receipt. These are recorded as shared-tree failures, not waived as passing. Isolated final checks below are authoritative for the Wave 11 overlay.

## Final closure

F1: seizure had no native inventory supplier. `heldGoods` now reads the actual life's inventory, current item values and worn/borrowed/quest protections; `seizeGoods` revalidates and publishes the item debit together with the already-staged arrears. The saved settlement line reaches Reports. Unknown items are left alone.

F2: arrests recorded 720 minutes but had no runtime clock settler. The host now supplies the existing chronicle plan/publisher. A microtask leaves the fight publisher's stack before settling time. Each commit stores only the remaining sentence after actual elapsed time; paused clocks and rejected publications keep the debt. A post-publication display/tick failure cannot restore already-served time. Existing `constables@1` saves require no reset or new shape.

The composition root receives item factory, disposition and time-plan ports; no new clock, save owner or import cycle. Other sessions' source hunks remain intact. At verification close, source was uncommitted. The follow-up authorizes this scoped commit; no push, install or user-save operation is included.

| Check | Final result and scope |
| --- | --- |
| V1 `BUILD_OUT=.lane-builds/wave11-closure npm run build` | PASS on the isolated overlay. SHA-256 above. Existing duplicate `dial` warning in `travel_legs.js`, outside this change. |
| V2 `npm test` | PASS: 5514 passed, 0 failed, 5 skipped (5519 total), 493.3 seconds. The machine-wide limiter was used normally. |
| V3 skipped-fixture follow-through | Made the existing reference inputs available, then `node --test tests/character_sheets.test.js tests/lotm_constraint_host.test.js tests/lotm_slice_tools.test.js`: 26/26, 0 skips. This covers all five skipped cases; no source change or broad suite repeat. |
| V4 Wave 11 focused files | `authority_strikes`, `lotm_seizure_host`, `obligations_more`, `inquiry_book_lives`, `lotm_panel_gaps`, `frontier_bow`, `sell_surplus`: 48/48. |
| V5 `npm run check:arch` | PASS: main -2 lines, display/save 0 growth, no new cycle edges. |
| V6 `npm run check:rules` | PASS: rules index, receipts, direction sync and player-text checks, no warnings in the isolated candidate. |
| V7 `node scripts/seam_register.mjs --write` / `--check` | Generated register refreshed; PASS current. Primary register is regenerated from its actual shared tree. |
| V8 native browser | `w11-closure-proof.mjs`: 400 synthetic comparator units became 40; six arrears became zero; seizure kept on reload and literal Export/Import. Arrest advanced exactly 720 minutes; reload and literal Import repeat neither time nor arrest. Console errors: zero. |
| V9 additional UI samples | `w11-library-proof.mjs`: two real button clicks spend 120 minutes, write the understood record, and keep it after reload. `w11-jail-ui-proof.mjs`: waits for the populated 1920×1080 panel and visible cells receipt before capturing it. Both pass with zero console errors. |
| V11 final shared-tree checks | `check:arch` and `check:rules` also PASS on the primary checkout after peer changes settled. Existing untracked-prose and PROJECT-log warnings belong to other active work. |
| V10 diff/ownership | `git diff --check` PASS. Owned host seam and remaining owned source files match the isolated candidate. Peer dose-view and calendar-context hunks remain separate. |

Harness note: headless macOS could stall PLAY on compositor stability. `scripts/playtest/lib.mjs` now forces only that startup-overlay click; gameplay controls retain normal click checks. The proof waits for a visible panel before capturing it. The isolated checkout also reads the primary checkout's private packs, local font assets and reference fixtures through input links. No link target is modified or removed.

Artifacts and reproduction: `work/w11-closure/` in the primary checkout retains JSON results, screenshots, logs, source manifest and the isolated overlay archive. Run the closure proof against a fresh isolated build first (it generates its own synthetic origin), then the library and jail-UI samples. All origins are synthetic; no personal save was read. The overlay archive identifies base `abdaedf0a`; later primary HEAD `04c5fd798` contains the other session's changes. The follow-up commit uses only owned hunks over fresh HEAD and preserves the other sessions’ index entries.

Verification checkout retired with plain `git worktree remove` after the overlay, bundle and evidence were archived and payload hashes checked. Archive: `work/w11-closure/wave11-verification-overlay.tar.gz`; SHA-256 in the adjacent `SHA256SUMS`. Input link targets remain intact.

## Commit boundary

Weibao authorized: “Commit just the Wave 11 fixes and closure receipt, preserving the other sessions’ changes.” Includes the seizure and sentence host seams, regression tests, native proof scripts, the startup-overlay harness correction required by those proofs, the generated Wave 11 seam rows, this receipt and its original-checkpoint link. Excludes build output, private evidence archives, prose/rule edits and performance work. Reuse the completed isolated full suite and native proof for unchanged owned inputs; recheck the focused slice, architecture and rules at this commit boundary. No push.

Commit-boundary checks: focused Wave 11 files 48/48; `check:arch` PASS; `check:rules` PASS with the existing shared-tree prose-tracking and PROJECT-log warnings; owned diff whitespace check PASS. Runtime inputs match the verified overlay, with peer hunks supplied by fresh HEAD.
