# R3 progression consistency, 2026-10-23

Status: R3-F1 corrected in source after explicit incumbent release; focused regression, isolated rebuilt desktop proof, architecture and rules checks pass. Separate post-D1 input ready for integration. No commit, root distribution build, app adoption or combined-delivery claim. Earlier blocked sections below are retained investigation history; the final R3 learned-herb fix section owns current status.

Authority: [dispatch checkpoint](CHECKPOINT.md), R3 only. Rules: AD6/8/32/36/38/41; AR3/7/8/10/15/16; UR45. GTR9/10/12/14/16 are proposal guidance, not newly accepted direction. [Architecture rules](../../../ARCHITECTURE_RULES.md), [UI rules](../../../UI_RULES.md), [player UI routing](../../../../.claude/rules/player-ui.md).

## Ownership and inputs

Own only `R3_REPORT.md` and `r3-*` harness/evidence in this directory. No runtime paths reserved. Exact read inputs, their dirty status and SHA-256 values are in [r3-inputs.json](r3-inputs.json). Shared HEAD at initial inspection: `547209e82c29e897e6b602a4ef5d8e8ab46b3ebf`.

The checkpoint excludes `main.js`, `display.js`, `chain_inspector*`, LOTM, workshop, lifecycle and desktop/style paths. Current `chain_inspector.js`, `reveal_chain.js` and `components/levelable_component.js` are dirty. The complementary checkpoint reserves workshop paths and O4/O5 proof. Ascension's prior checkpoint retains its own leaf/LOTM ownership; no absence of a live process is treated as release. All remain read-only here.

Target: desktop 1920×1080, native developer inspector of a generated completed-lesson fixture. Visible outcome under investigation: completed knowledge should not look like an unmet lesson. Mobile, human pacing, full evaluator migration, offline policy and overflow policy expansion are excluded. Rebuild will use a temporary isolated copy, never root `dist/`.

## Selected failure scenario and checks

Trace the existing Golmoon herb lesson at 19 leaves, 20 leaves, after commitment and after excess leaves. Check the shared descriptor, actual acquisition/staged unlock paths and inspector projection. Test whether an already-granted persistent recipe is incorrectly reported as waiting because the acquisition predicate refuses repeat awards. Preserve observer boundaries and distinguish native interaction from generated-fixture evidence.

Run the focused reveal/gate/ascension/overflow tests only. No full suite; complementary owner retains it. No persistence change is planned.

## R3-F1: completed lesson is reported as waiting

The herb lesson's shared descriptor is an **acquisition predicate**, not retained unlock state. It requires both 20 currently held leaves and `reveal.herbLesson === false`. Refusing a repeat reward after learning is correct. `projectGates` incorrectly interprets every false result as a still-waiting gate, even when the retained learned fact is true.

| Journey boundary | Shown/evaluated requirement | Actual commitment and progress |
| --- | --- | --- |
| 19 held leaves | Player practice hint says `19 / 20`; inspector waiting | No lesson or recipe grant |
| 20 held leaves, unlearned | `heldLesson` true; inspector open | `createAcquisitionLesson` sets the learned fact and grants Weak healing powder |
| Staged 19 → 20 acquisition | `stageRevealKnowledge` selects the same lesson | `prepareNativeUnlocks.write` sets the saved recipe availability before `publish` exposes it |
| Learned, still holding 20 | Acquisition predicate correctly false to prevent replay | Recipe remains granted, leaves unconsumed; inspector incorrectly says `waiting`, `Author: Not yet learned`, `Player sees: Something is still missing` |
| Learned, increased to 25 | Repeat acquisition stays ineligible | No duplicate grant; all 25 leaves retained, no conversion/bank/loss. Player preparation hint stops asking for leaves |

Reproduction: [r3-progression-repro.mjs](r3-progression-repro.mjs), 4/4 passing assertions **confirm the current defect**, not a fix. Both native acquisition and staged saved-availability paths were exercised as module-level transitions. The staged helper is still a separate comparison implementation; matching sampled states does not prove all future dials agree. No wholesale migration is warranted by this reproduction.

Rebuilt native browser: [result](r3-browser-result.json), [1920×1080 screenshot](r3-learned-still-waiting-1920.png). A fresh context generated a new game, then a second fresh context loaded an explicitly DEV SEEDED completed-lesson fixture with 20 leaves, learned fact and unlocked recipe. The actual native inspector renders the contradictory text. Snapshot assertions prove recipe/learned state and zero inventory/fact/availability mutation from inspection; zero page errors. This is **completed-state rendering proof**, not a natural acquisition journey or human visual acceptance. No personal save was read or written.

## Required seam blocker and concrete correction

The smallest correction is in `src/chain_inspector.js` around `INSPECTED_GATES` / `projectGates` (inspected lines 83–90). That path is explicitly excluded by the dispatch while its incumbent writer is unresolved, and it is dirty. Editing a separate leaf cannot change the faulty final label without touching this consumer; changing `evaluateGate` to treat already-learned acquisition as met would risk repeat grants. No unowned runtime correction is available for this observed defect.

[r3-proposed-inspector.patch](r3-proposed-inspector.patch) is an **unapplied proposal** against the recorded hash. It supplies a completion reader for this inspected gate, displays `learned (persistent)` and a no-repeat explanation when its retained learned fact is true, and otherwise preserves current evaluation. It reads existing truth, adds no state, changes no acquisition or save behavior, and stays inside the developer surface. It does not yet model recipes obtained through the descriptor's alternative source; that needs the owner's actual recipe-availability input rather than inferred ownership.

Owner acceptance check: after release of the inspector seam, rebase the hunk onto the live file; update the inspector's existing system test to require learned status after both commitment paths, waiting at 19 and open at 20, with no state mutation and the non-developer fail-closed check retained. Rebuild and repeat the desktop completed-state check. This correction remains **unimplemented**, not complete gameplay.

## R3-F2: ascension and overflow controls, bounded no-defect results

The existing Mistglass practiced/integrated path projection agrees with the actual cultivation settlement at 15, 16, 47, 48 and 60 elapsed practice minutes. Settlement has already advanced the position at each threshold, so the projected next crossing is not erroneously ready. Practice minutes clamp at 48 under the current local mechanism. That clamp is retained behavior, not an accepted new practiced-depth policy. LOTM promotion was excluded and not exercised.

For a frontier capped gain with cap 10, next-level amount 100 and no prior bank: 35 XP awards 10 and holds 25. A later fresh gain of 4 awards 8, leaves 21 banked, and conserves the combined 39. This is the direct overflow seam below its bank limit, not native reading/crafting proof. Existing focused tests cover one-level bank limit, world separation and registry save roundtrip; they do not certify all XP consumers.

| Remaining cap path | Current source status | R3 disposition |
| --- | --- | --- |
| LevelableComponent single-gain cap | Calls `settleCappedSkillGain`; frontier world row banks with a one-level limit and bounded drain | Focused tests/control pass; existing documented bank policy retained |
| `p00NativeSkillXP` | Clips before staging native settlement; does not send excess through the bank | Explicitly excluded in overflow owner. Required file `main.js` is reserved. No claim that this has been reconciled |
| Native crafting cap | Computes per-craft capped quote in `main.js`, then awards with `cap_gained_xp:false` | Same ownership boundary; no change to crafting policy selected here |
| Max-level / locked skills | Separate owners from the single-gain row | Existing overflow doc exclusions remain open; no new policy or wording selected |
| Mistglass reserve/practice caps | Local capacity and 48-minute practice limit | Ascension threshold sample agrees; no strain/conversion/depth feature added |

## Checks and exact input scope

- `node --test .../r3-progression-repro.mjs`: PASS 4/4; [output](r3-reproduction-tests.txt). Current bug reproduced; module transitions, control overflow and ascension threshold sample only.
- `node --test tests/reveal_chain.test.js tests/progression_gates.test.js tests/ascension_paths.test.js tests/skill_overflow.test.js`: PASS 19/19; [output](r3-focused-tests.txt).
- `node .../r3-build-candidate.mjs`: initial snapshot lacked five imported contract/Ink files and failed resolution; script corrected to copy those dependencies. Second isolated esbuild rebuild PASS, 781 inputs. [Candidate manifest](r3-candidate.json) records every input and bundle SHA-256 `88ae9939906485892257ce731ac9a14e9f5a5b2f2584320cc11d258841214c0c`. No root build/dist/index mutation. This is an isolated esbuild bundle, not the root distribution packaging gate.
- `node .../r3-browser.cjs`: PASS rebuilt fresh-origin desktop 1920×1080 completed-state fixture; screenshot inspected. No persistence changes, so reload/export/import not run by R3; existing registry roundtrip tests are separate evidence.
- `npm run check:arch`: PASS; [output](r3-arch.txt), main growth 0. Moving shared checkout at check time, not a combined delivery claim.
- `npm run check:rules`: FAIL, [output](r3-rules.txt): `../PROJECT.md#current-delivery-routing-checked-2026-10-22` broken anchor, plus two existing untracked-rulebook warnings. R3 changed neither linked owner and cannot fix those reserved coordinator paths. Not hidden or counted as passing.
- Rule-behavior: not applicable to report/proposal-only work; no rule or runtime behavior changed. Full suite not run; complementary O5/coordinator owns it. No equivalent root build/suite repeated.
- [Input recheck](r3-input-recheck.json): all 11 selected read inputs unchanged from reservation through final recheck; all snapshot inputs with matching root paths matched when built. No runtime write made by R3.

## R3-F3: delivery boundary and changed paths

Only the report, reproduction/proposal, logs and generated evidence below were created. No shared checkpoint, PROJECT, USER_VISION, RULES_INDEX, runtime/test owner, app entry, install, private save, commit, push, other-chat message or agent dispatch was changed. The temporary candidate server was stopped after evidence capture. Temporary candidate copies remain outside the checkout for reproducibility.

Remaining authoritative gate: the incumbent inspector writer must take ownership of and implement/reject the proposed correction, then prove the changed inspector on its final candidate. This report does not close the fix or claim combined delivery. Human pacing and visual acceptance remain separate.

Report link/whitespace check: PASS; [r3-doc-checks.json](r3-doc-checks.json).

Exact created paths (relative to this directory):
- `R3_REPORT.md`
- `r3-arch.txt`
- `r3-browser-result.json`
- `r3-browser.cjs`
- `r3-build-candidate.mjs`
- `r3-candidate.json`
- `r3-focused-tests.txt`
- `r3-input-recheck.json`
- `r3-inputs.json`
- `r3-learned-still-waiting-1920.png`
- `r3-progression-repro.mjs`
- `r3-proposed-inspector.patch`
- `r3-reproduction-tests.txt`
- `r3-rules.txt`
- `r3-doc-checks.json`

## Resumed inspector-only correction, 2026-10-23

Controlling chat `01a16a34-5b5a-7ed0-8544-427ecf7a9523` routed this same confirmed discrepancy back to R3 under Weibao's coordination authorization. Work remains limited to this inspector correction, with no new overflow/cap policy. Explicit incumbent release is still required before runtime/test-owner edits.

Read current Claude coordinator `GAP_AUDIT.md` / `CHECKPOINT.md`, D1 brief and frozen `D1_INPUT_RECEIPT.md`. They contain no inspector/test release to R3. D1's snapshot has the same hashes as the original R3 inputs and explicitly prohibits primary overwrite. This is dependency-transfer evidence, not a release. Current inspector/test remain dirty.

[r3-resume-inputs.json](r3-resume-inputs.json) records live hashes: inspector, reveal-chain, gate and native unlock inputs have no drift from the original reproduction. Re-ran `node --test .../r3-progression-repro.mjs`: PASS 4/4 confirming the same existing defect. No fix is claimed by that result.

Prepared [r3-proposed-regression.patch](r3-proposed-regression.patch), generated by [r3-prepare-regression.mjs](r3-prepare-regression.mjs), against existing `tests/chain_inspector.test.js`. It requires learned status after both real module commitment paths, waiting at 19/open at 20, no repeat award or inspection mutation, and no inference that alternate-source recipe availability proves this handling lesson. Existing non-developer fail-closed tests remain untouched. Both proposed patches pass `git apply --check`. Neither has been applied or executed as changed-runtime proof.

Sent the authorized seam-only ownership request to Claude coordinator `01a16a2e-1664-71d3-8d03-d5eb86313256`, and sent the same pending status to the controlling chat. No broader messaging or dispatch occurred. These later authorized messages supersede only the earlier task-time statement that no messages were sent. At this checkpoint: **release pending, no runtime writes, no new browser/build/full-suite run**. Coordinator owns the previously broken document anchor. Additional created paths this resumption: `r3-resume-inputs.json`, `r3-prepare-regression.mjs`, `r3-proposed-regression.patch`; this report updated.

## R3 learned-herb fix: narrow reservation before edits

Explicit incumbent release read in [GAP_AUDIT](../claude-coordinator-continuation-2026-10-23/GAP_AUDIT.md#narrow-release-to-codex-r3-learned-herb-inspector-state-2026-10-23). R3 now reserves only `src/chain_inspector.js:INSPECTED_GATES/projectGates` and one added regression in `tests/chain_inspector.test.js`. Both live hashes match the frozen release: inspector `edbda4a5a177d959b44e88909c545a9da47ab70c460afd55bd3c1247a39345b6`, test `86bf219c0ee7d3954dd06116420b922e5b716138d22bbaa68b557cecf89978c1`. [Pre-edit source receipt](r3-fix-before.json) preserves exact inputs for a delta against the D1 snapshot. D1 package and all acquisition/progression/overflow/UI/other-chain owners remain untouched. Isolated rebuild selected because root bundle ownership remains unresolved. This dated implementation section supersedes the prior blocked status once its checks below complete.

## R3 learned-herb fix: final result and ownership return

R3-F1 is corrected in the released GTL3 presentation hunk only. The inspector reads the existing learned fact to show `learned (persistent)` and a no-repeat explanation. Acquisition eligibility, transaction order, recipe grants, inventory, saves and overflow are unchanged. Recipe availability obtained by another route is not inferred from this handling-lesson fact. The existing developer fail-closed behavior remains covered.

One regression was added in the existing inspector test file. It checks waiting at 19/open at 20; learned status after native acquisition and staged saved availability; retention after leaves leave inventory; unchanged snapshots; no repeat reward; no inference of handling knowledge from alternative-source recipe availability. Existing tests for non-developer access, no mutation and other chains remain intact.

**Separate input: R3 learned-herb fix.** Apply [r3-learned-herb-fix.patch](r3-learned-herb-fix.patch) **after** the frozen D1 package; do not replace or modify D1. Exact input/post-fix hashes and patch SHA-256: [r3-fix-inputs.json](r3-fix-inputs.json).

| Path | Post-fix SHA-256 |
| --- | --- |
| `src/chain_inspector.js` | `ddc51b466854019103a4433e1ed16755e46ea6dda5d46e8e14f628e876573689` |
| `tests/chain_inspector.test.js` | `5be961f53775555ff1bc9ca3e9e20653494afe68000079115476261b831f261a` |

Verification on these source inputs:

- New regression against the preserved isolated **pre-fix** candidate: expected FAIL, 7 existing tests pass / 1 new regression fails at `waiting` instead of `learned (persistent)`; [red result](r3-fix-red-tests.txt). Primary source was never reverted for this check.
- `node --test tests/chain_inspector.test.js tests/reveal_chain.test.js tests/progression_gates.test.js`: PASS 19/19; [focused result](r3-fix-focused-tests.txt). No full suite repeated.
- `R3_TAG=fix- node .../r3-build-candidate.mjs`: isolated esbuild rebuild PASS, 781 inputs; [candidate manifest](r3-fix-candidate.json), bundle SHA-256 `094547759b7918f59529ab0059cc5b49af6285beccbb9c367b15d11c636b82b8`. Root `dist/`/`index.html` were not built or changed because shared ownership remains unresolved. This is the controlling chat's authorized isolated-build substitute; distribution packaging is not claimed.
- `R3_FIXED=1 node .../r3-browser.cjs`: PASS fresh-origin rebuilt native developer inspector at 1920×1080, [result](r3-fix-browser-result.json), [inspected screenshot](r3-fix-learned-1920.png). DEV SEEDED completed-lesson fixture; learned fact and recipe availability validated; no page errors or inspection mutation. Actual acquisition transitions are covered at module level, not claimed as natural browser progression. No persistence behavior changed, so save/reload/export/import not rerun.
- `npm run check:arch`: PASS zero main growth; [result](r3-fix-arch.txt).
- `npm run check:rules`: PASS with two existing untracked-rulebook warnings; [result](r3-fix-rules.txt). The earlier anchor failure is resolved in coordinator-owned inputs; R3 made no shared-doc change.
- `git diff --check -- src/chain_inspector.js tests/chain_inspector.test.js`: PASS. No rule change selected; rule-behavior suite not applicable.

Exact runtime/test changes are only those two paths and the incremental patch. `R3_REPORT.md`, `r3-build-candidate.mjs` and `r3-browser.cjs` updated; additional generated `r3-fix-*` receipts/logs/screenshot plus `r3-learned-herb-fix.patch` recorded in [final changed-path manifest](r3-final-checks.json). No shared checkpoint, direction owner, D1 package, progression/acquisition/overflow owner, other chain/UI, personal save, commit, push, install or app entry changed by R3.

The temporary proof server was stopped. This report **ends the narrow release**; inspector gate-chain/test ownership returns to progression parent `local_23789a55-a635-4540-ba8b-65cb0c57d4ba`. R3 will send the report and post-D1 input to the authorized controlling/Claude coordinator routes, which relay it to the existing O/F/A and Qud integration owners. No further runtime writes are reserved by R3.

R3-F1 source and bounded proof are complete. Combined candidate integration, the existing owner's final suite and any distribution/app adoption remain with their current owners. Broader cap/overflow exclusions, mobile and human pacing/visual acceptance retain their separate status.
