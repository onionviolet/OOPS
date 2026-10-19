# D5b: docs/gm/dispatch duplicate and consistency audit (2026-10-18)

Area: `docs/gm/dispatch/` only. Read-only. Method: find/stat/shasum over every file, git ls-files and check-ignore for tracking state, node scripts for link checks and clustering, targeted reads of STATE/CHECKPOINT/DISPATCH heads. Working files stayed in the session scratchpad.

## Summary

Inventory (VERIFIED): 156 entries (132 folders, 24 loose files), 12,074 files, 1.9 GB on disk (the brief's "about 14,000" is high). Tracked: 8,513 files, 809 MB. Ignored: 3,561 files, 1.25 GB. Untracked and not ignored: 0. Repo pack is 2.04 GiB, so tracked bulk here is a large share of it. Tracked bytes by type: PNG 591 MB (1,228 files), JSON 95 MB, txt 30 MB, JSONL 26 MB, HTML 19 MB, CPU profiles 4.9 MB. One folder, `ui-foundation-2026-10-15`, holds 437 MB tracked (54 percent).

Byte-identical duplicates (VERIFIED, SHA-1 over all files): 482 clusters, 995 extra copies, 210 MB redundant on disk, 125 MB of that between tracked files (111 MB PNG, 14 MB JSON/txt/js).

Findings: 17 total. High 4 (F1, F2, F3, F4), medium 8 (F5 to F12), low 5 (F13 to F17).

## Findings

### D5b-F1 (dup, high): identical screenshots committed under different names, mostly "before" equal to "after"
VERIFIED. 171 PNG/JPG clusters; the 13 largest copies of one image sit in one round.
- `docs/gm/dispatch/ui-foundation-2026-10-15/evidence/r17/{final,fix-effect,noise,spec-lift,structural}/combat-1920x1080-21-{before,after}.png` plus `r18/slack-before/combat-1920x1080-21.png`, `r20/before/three-1920x1080-21.png`, `r20/slack-before/combat-1920x1080-21.png`: 13 files, identical bytes (934,321 B each, 11.2 MB redundant).
- `r17/{before-noise,after-noise,final,noise,spec-lift}/populated-1920x1080-21-*.png`: 9 files identical (1.06 MB each).
- Similar clusters for `combat-1366x768-21`, `fresh-1366x768-21`, `populated-1366x768-21`, `combat-1366x768-14`: 6 to 13 copies each.
Why it matters: when "before" and "after" are byte-identical, the pair proves nothing about the change, or one of them is a mislabelled copy. It also inflates the repo (the r17 folder alone is 81 MB, 121 files). AGENTS.md requires rebuilt target-viewport evidence for UI claims; identical pairs weaken that.
Fix: for each r17 triple, keep the one distinct image per state and a small manifest (sha1 and what it shows); `git rm --cached` the rest; where before equals after, state in `r17/REPORT` that the pixel result did not change. Owner: `ui-foundation-2026-10-15/evidence/r17/` (UI owner).

### D5b-F2 (rule-violation / policy gap, high): ignore rules protect disk status, not the repo; 809 MB still tracked
VERIFIED. `.gitignore:49-64` ignores finished UI rounds (`evidence/parity-r*/`, r12, r13, r14, shell, shell-r2, `next-parts/scratch/`) and natural-play dirs, and `docs/gm/SHARED_WORKTREE_PRACTICE.md:126,140` says chosen evidence stays tracked. But tracked files remain in ignored paths and git history keeps every earlier blob (pack 2.04 GiB). Tracked files that are also under ignore rules include `evidence/parity-r3/populated-multi.save.txt` (7 copies, parity-r3 to r9, 84 KB each), `parity-r6/populated-three.save.txt` (4 copies). Tracked large items: 73 files over 1 MB (115 MB), 1,283 over 200 KB (683 MB).
Largest tracked single files (generated, reproducible or log-like):
- `foundation-completion-2026-10-12/g6-proof/final-journey/WORKFLOW_15645.jsonl` 6.0 MB, plus 56 JSONL total (26 MB); `learning-proof/WORKFLOW_{53092,43718,45365,43281,44551}.jsonl` 1.2 to 3.4 MB each.
- `ui-foundation-2026-10-15/evidence/uil8/comparison/side-by-side-{1920,1366}-{14,21}.html` 5.7, 5.2, 3.2, 3.2 MB (generated HTML, base64 images likely).
- `foundation-adoption-next-2026-10-13/rounds/r3/attempts/07-startup-debug-APPLICATION_NATIVE_RESULT.json` 4.9 MB; `runs-and-endings-2026-10-14/r9/FINAL_SEARCH_EVIDENCE.json` 3.0 MB; `research-tech-2026-10-14/t9-build/case-manifests.json` 2.2 MB (has its own `.gitignore` in the folder, check it still matches); `foundation-completion-2026-10-12/learning-proof/CANCEL_DEBUG_53092.json` 2.4 MB; `interaction-proof/run4/sequence-0.json` 2.2 MB.
- 11 `.cpuprofile` files (4.9 MB) under `absorb-all-2026-10-14/checks/{sim-stepper,stepper-perf}/` and a 735 KB `rounds/r15/g4/ARTIFACTS.tar.xz`.
- 41 tracked `.log` files despite `.gitignore` `*.log` (line 28 area): they were force-added or tracked before the rule.
Why it matters: clone cost, `git status` noise, and the cleanup note claims the bulk is local-only. Fix: add a short "tracked-evidence budget" line to SHARED_WORKTREE_PRACTICE (owner) and run a one-time `git rm --cached` over the generated classes above (keep receipts and hashes in a manifest). History rewrite is a separate decision for Weibao.

### D5b-F3 (dup, high): whole repo source trees snapshotted into dispatch folders
VERIFIED, tracked. Full or partial copies of `src/` are committed as "baseline/rehearsal/integration" inputs:
- `foundation-completion-2026-10-12/ui-reconciliation/rehearsal/src/` 19 files in src (24 files, 1.08 MB in folder; `main.js` 481 KB, `display.js` 259 KB, `workspace_layout.js` 33 KB).
- `ui-experience-completion-2026-10-12/integration-base/src/` (9 files, 878 KB; `main.js` 465 KB, `display.js` 259 KB).
- `proto23-vfx-2026-10-13/baseline/src/` (6 files, 628 KB; `main.js` 489 KB).
- `ui-foundation-2026-10-15/evidence/parity-r{7,8,9,10,11}/{baseline,r*-inputs}/` hold `display.js` (6 variants, 253 to 307 KB), `workspace_layout.js` (5 variants, 55 to 57 KB), `proto23_shell.js`, `village_workspace.js`, `workspace_navigation.js`; ignored on disk now, but 23 of them are still tracked (`parity-r8/r7-inputs/src/display.js` and `parity-r10/r9-inputs/src/display.js` are byte-identical, 293,853 B).
Counterpart: the live files `src/main.js` (684 KB), `src/display.js`, `src/workspace_layout.js`, `src/proto23_shell.js`, `src/village_workspace.js`, `src/workspace_navigation.js`. `diff` of `proto23-vfx/baseline/src/main.js` against live `src/main.js` shows 2,737 changed lines, so these are drifted copies, not mirrors. They appear in greps for functions and can mislead agents into editing or citing the wrong copy; AR rules say one authority per fact.
Fix: replace each snapshot with the git commit hash it was taken from (`git show <hash>:src/main.js` reproduces it), record the hash in the folder's INPUTS.json, and untrack the copies. Owner: the commit hash in the round's INPUTS.json.

### D5b-F4 (contradiction / stale writer claim, high): World1 campaign state disagrees across five owners
VERIFIED.
- `world1-full-completion-2026-10-11/STATE.json`: `goalStatus: "active"`, `activeWriteReservation: true`, `stopReason: "recoverable context/budget boundary; full campaign remains authorized"`, `ownerThreadId: "w1-campaign Codex coordinator"`, `nextAction: "W1-C03/L2-U02 ..."`, successor status "exclusive writes transferred". File mtime 2026-10-18.
- Same folder `CHECKPOINT.md:1-10` (reconciled 2026-10-18): the W1 campaign "ended" at its 2026-10-14 deadline, full section gates open, final tip unmerged. It also says "Active single writer: Codex coordinator in branch `w1-campaign`" (line 16), still unqualified.
- `foundation-completion-2026-10-12/STATE.json`: `"world1GoalStatus": "explicitly paused;do not resume"`, vs `PROJECT.md:1486-1495` ("full pause is lifted", pause snapshot is history).
- `PROJECT.md:539`: "World1 stays paused." in a foundation-livelihood paragraph with no date or "historical" label, contradicting `PROJECT.md:1486`.
- `world1-full-completion-2026-10-11/NEXT_UNIT.md` still directs the next unit as W1-C03.
- `dual-gm-2026-10-11/expansion/continuation/STATE.json`: `stage: finite-edition-candidate-delivered` while its `successors[]` entries read "active/inProgress confirmed; ownership transferred" and `CHECKPOINT.md` says no successor remains.
Why it matters: an agent that reads STATE.json first sees a live exclusive writer and an authorized campaign; one that reads CHECKPOINT sees an ended run. AGENTS.md: handoffs link to owners rather than compete.
Fix: STATE.json gets a top-level `disposition` (`ended-2026-10-14`, `activeWriteReservation: false`, `processes: []` already empty) and a pointer to CHECKPOINT; foundation-completion STATE.json `world1GoalStatus` gets "superseded by PROJECT 2026-10-13 resume". Add "(2026-10-12, historical)" to PROJECT.md:539. Single owner for campaign state: `world1-full-completion-2026-10-11/CHECKPOINT.md`.

### D5b-F5 (stale writer claim, medium): DISPATCH.json states say active or dispatched for finished work
VERIFIED (6 files; all mtime 2026-10-12, last commit 2026-10-13).
- `cheats-sfx-implementation-2026-10-12/DISPATCH.json`: "confirmed active; exclusive dispatch transfer effective"; its `CHECKPOINT.md` says the UI boundary is technically closed.
- `cross-world-rulebook-expansion-2026-10-12/DISPATCH.json`: `state=active`; CHECKPOINT: finite document assignment complete.
- `harry-potter-craft-research-2026-10-12/DISPATCH.json`: `state=active`; CHECKPOINT revision 2 and REPORT.md exist.
- `connection-detail-2026-10-12/DISPATCH.json` and `workflow-foundation-audit-2026-10-12/DISPATCH.json`: `status/state=dispatched`; the latter's CHECKPOINT is titled "complete".
- `foundation-completion-2026-10-12/DISPATCH.json`: "current successor confirmed active" vs STATE.json `technically_complete` and CHECKPOINT final-disposition banner.
DISPATCH.json is dispatcher-owned, so the folder GM cannot edit it, and nobody closed the loop. Fix: add one `closed` record per file written by the dispatcher (or one `docs/gm/dispatch/INDEX.md` table of folder, state, owner file), and treat DISPATCH.json as launch history only. Owner: new index file.

### D5b-F6 (dup, medium): per-campaign harness scripts copied and drifted instead of shared
VERIFIED counts; drift level measured by line overlap.
- `launch.py`: 41 copies in 40 folders, 22 distinct versions, ~1 KB each. Largest identical groups: 15 (`canon-events-2026-10-14/runs`, `cheat-status-window-2026-10-13/runs`, `companions-2026-10-14/runs`, `nonhuman-starts`, `panel-kit`, `maker-arts`, ...), 6 (`absorb-all`, `deep-systems`, `feature-scout`, `game-research-wave`, `multiworld-research`, `topic-wave`). A variant adds `LANE_CWD` support (`absorb-all .../runs/launch.py:14` vs `canon-events .../runs/launch.py` `os.chdir(REPO)`). Hardcodes the Codex binary path and repo root. `docs/gm/SHARED_WORKTREE_PRACTICE.md:79` names `runs/launch.py` as the pattern but no canonical copy exists under `scripts/`.
- `browser.cjs`: 28 copies, 27 distinct, 184 KB, mostly one-off proof scripts, e.g. 17 under `absorb-all-2026-10-14/checks/p23-*/browser.cjs` (52 KB). They repeat the same preamble (playwright require, Chrome path, hash-compare of served and local `dist/bundle.js`, save/reload/import round trip).
- `native.cjs` 15 copies/15 distinct (132 KB), `gate.cjs` 7/4, `helpers.js` 9/9 (42 KB), `harness.mjs` 6/6, `controlled-clock.js` 4/3, `routes.cjs` 4/2, `check.sh` 7/7, `launch_wt.py` 3 identical.
- 265 files under dispatch hardcode `/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright`; 179 hardcode `/Applications/Google Chrome.app/...`. The repo already has `scripts/ui_helpers.cjs:18` (`launchChrome`, `loadPlaywright`, `chromeExecutable`) and 17 scripts/tests using the shared path.
- Repeated helper names across scripts: `open` x63, `select` x27, `fits` x15, `save` x14, `play` x14.
Why it matters: a fix to launching or browser setup has to be applied in dozens of places, and old copies silently disagree. Dispatch scripts are historical proofs, so do not edit them; instead put one canonical `scripts/launch_detached.py` and have new lanes call it. Owner: `scripts/ui_helpers.cjs` for browser, a new `scripts/launch_detached.py` for launch. Cross-area copy: `scripts/ui_helpers.cjs`, `scripts/helpers_browser.cjs`.

### D5b-F7 (dup, medium): same proof payload saved three or more times per round
VERIFIED, tracked.
- `foundation-adoption-next-2026-10-13/rounds/r6/`: `X.json`, `X-imported.json`, `X-reloaded.json` triples with identical bytes, 196 to 207 KB each: `useful-delivery`, `delivery-settled`, `useful-kits-produced`, `second-attempt-pending`, `both-cleared`, `both-filled`, `resin-collected`/`resin-only-imported`/`resin-only-reloaded`, `sound-cut-{completed,paused,pending}`. About 4 MB of redundant bytes in r6.
- `rounds/r8/negative-pending-boundary{,-imported,-reloaded}.json` 215 KB x3; `rounds/r8/final-earned-{imported,reloaded}.json` and `rounds/r10/ENTRY_RESTORED.json` 212 KB x5.
- `foundation-completion-2026-10-12/interaction-proof/run2/receipt-{0..9}.json`: 9 identical 33 KB files.
- 5 tiny `console-errors.json`/`ERRORS.json`/`BROWSER_ERRORS.json` all `[]`-like (2 B) across absorb-all/natural-play-2.
That identical imported/reloaded bytes is itself the evidence (round-trip equals original), so one file plus a sha line suffices. Fix: store original plus `SHA256SUMS` listing the equal copies. Owner: round folder `REPORT.md`.

### D5b-F8 (stale-link, medium): 343 broken markdown links inside dispatch (of 14,119 checked)
VERIFIED with a resolver over 3,209 tracked or on-disk .md files (excluding `sources/` and `private/`). 549 unresolved; 185 are in `runs/*.last.md` (raw model final messages that cite root-relative paths, benign), leaving 364 real; 21 resolve from repo root or `docs/`; 343 dead.
- `steam-wave-2026-10-06` 174: `native-usage/history/*` and `resume-history/*` copies kept from another location, links such as `../../../src/energy_resources.js`, `../../../../research/factorio/native/CHECKPOINT.md`, and `ACQUISITION.json` no longer resolve. Snapshots under `resume-history/*/docs/gm/dispatch/...` are themselves a nested copy of dispatch (66 files).
- `procgen-2026-10-13` 67: absolute `/Users/weiwei/code/yair-*` and `.claude/worktrees/proc-*` paths from deleted worktrees (the SHARED_WORKTREE_PRACTICE cleanup removed them).
- `life-sim-sources-2026-10-07/history/six-ages-identity-correction/{ASSIGNMENT,HANDOFF}.md` 28: relative depth wrong after the move into `history/`.
- `engine-runtime-2026-10-14/ER18/inventory-body.md` (8): `../gm/dispatch/...` and `../ENGINE_*.md` written for a docs-level file.
- `lotm-initiation-2026-10-15/PLAN_BEFORE_CONSOLIDATION_2026-10-15.md` (8): `../USER_VISION.md`, `../worlds/HP_LOTM_...` written for docs/, file now lives in dispatch.
- `modular-seams-2026-10-16/history/PRE_INTERACTION_UPDATE_CHECKPOINT.md -> ../../../ARCHITECTURE_RULES.md` (11 in folder).
- `companions-2026-10-14/OWNER_MAP.md -> ../COMPANIONS_FAMILIARS_AND_PETS_CONSIDERATIONS_2026-10-14.md` plus `worlds/...` forms (missing `../../`).
- `foundation-adoption-next-2026-10-13/rounds/r15/CHECKPOINT_BEFORE_R15.md -> rounds/r14/REPORT.md, reservations/R14_SUCCESSOR_TRANSFER.json`.
- `air-absorb-2026-10-13/reports/minigame-management.md` (3, `../../../../minigames-2026-10-11/DESIGN.md`), `body-health-2026-10-17/B2_REFERENCES_AND_WORLDS.md -> ../../kenshi-depth-2026-10-08/ASSIGNMENT.md`.
Also from outside: no live doc points at a missing dispatch folder, but these text paths are missing: `procgen-2026-10-13/WR1-WR4.md` and `cheat-status-window-2026-10-13/runs/r1/final-{build,served,served-style,style}.sh` (only `.sha256` files exist; referenced in `docs/research/local-ai-2026-10-1{4,5}/.../dirty-*.txt`, harmless dirty-status listings), and `docs/research/power-systems/novel-crawl/INPUTS.json:5,6` hashes `docs/gm/dispatch/power-systems-2026-10-10/ASSIGNMENT_{COMMON,N}.md`: verify these files still exist and still match the recorded hashes (SUSPECTED, not hashed here).
Fix: history copies are frozen records; add one line at the top of each history folder ("links relative to original location") rather than rewriting, and repair only the non-history ones (companions, engine-runtime ER18, lotm, modular-seams, air-absorb, body-health). Owner: each folder's CHECKPOINT.

### D5b-F9 (orphan, medium): dispatched work with no outcome and no marker
VERIFIED by file listing. 19 folders hold only an ASSIGNMENT.md (or 1 to 2 files): `a-novel-concept-2026-10-08`, `anc-depth-2026-10-08`, `divergence-pass-2026-10-10`, `far-field-tropes-2026-10-08`, `hubs-and-heavens-2026-10-08`, `kenshi-depth-2026-10-08`, `noita-2026-10-09`, `novel-wave-2026-10-08`, `novel-wave-2026-10-09`, `novel-wave-2026-10-09b`, `open-idle-games-2026-10-09`, `power-scaling-2026-10-08`, `speedrunning-multiverse-2026-10-07`, `tale-of-immortal-2026-10-08`, `time-rewards-cheats-2026-10-08`, `webnovel-deepread-2026-10-09`, `webnovel-scout-2026-10-09`, `xianxia-masters-2026-10-08`, `engine-extension-2026-10-08`. `novel-wave-2026-10-09b` is the only folder never named anywhere (no doc outside, no sibling reference). Their assignments' outputs, if any, went elsewhere (docs/research) with no back-link, so the assignment reads as still pending. 45 more folders have no CHECKPOINT/REPORT/FINAL/RECEIPT/SUMMARY within two levels, among them large ones: `game-research-wave-2026-10-14` (183 files), `wiki-lanes-2026-10-13` (60), `multiworld-research-2026-10-14` (53), `feature-scout-2026-10-14` (49), `hogwarts-legacy-decompile-2026-10-14` (41), `start-records-2026-10-13` (31), `deep-systems-2026-10-14` (30), `deep-repass-2026-10-14` (21). Only 49 of 132 folders have a CHECKPOINT.md and 34 have REPORT.md. Fix: a one-row-per-folder `docs/gm/dispatch/INDEX.md` (state, outcome link, supersedes) and a "no outcome recorded" mark; also normalise names: `circle-of-inevitability` and `source-gap` have no date.

### D5b-F10 (rule-violation, medium): superseded dispatches are not marked at the folder level
VERIFIED overlap, SUSPECTED intent. World1 has three live-looking owners: `world1-expansion-2026-10-11`, `world1-full-completion-2026-10-11`, `dual-gm-2026-10-11/expansion/continuation` (the last says finite edition delivered, no further execution; PROJECT says the campaign continues). UI has `ui-experience-completion-2026-10-12`, `ui-modularity-2026-10-11`, `ui-density-slices-2026-10-13`, `ui-triage-apothecary-2026-10-15`, `ui-foundation-2026-10-15`; `divergence-earlier-2026-10-10` vs `divergence-pass-2026-10-10`; `novel-wave` x3; `cheats-sfx-implementation` CHECKPOINT mixes "superseded for UI only" prose inside a live checkpoint. Reconciliation banners exist in only some (foundation-completion, world1-full-completion); `grep -L` finds 20 of the 260 CHECKPOINT.md files (all depths) with none of superseded/final/historical/closed/complete/ended. `steam-wave-2026-10-06/native-usage/CHECKPOINT.md` is copied into three `history/` and `resume-history/` trees. Fix: INDEX.md (F9) with a `superseded-by` column; owner: that index.

### D5b-F11 (dup, medium): gitignore and per-folder .gitignore overlap and drift
VERIFIED. Root `.gitignore:37` (`disposable-profile/`), `:15-16` (soldiers-life ASSIGNMENT), `:49-64` (per-round), plus nested `.gitignore` in `rulebook-engine-2026-10-14/{r3,r6,r5/private,r2/private}`, `research-tech-2026-10-14/t9-build`, `absorb-all-2026-10-14/checks/{p23-long-life,fork-fort}`, and `ER4/sources/*/.gitignore` (third-party). Three styles for private content: `/private/` (r6), `private/` (r3), `*` (r5/private). Fix: one rule `**/private/` in root. Cross-check: `/docs/research/*/private/` at `.gitignore:~41` is the same idea for research.

### D5b-F12 (rule-violation, medium): third-party repos and browser profiles sit in the working tree
VERIFIED, ignored on disk. `engine-runtime-2026-10-14/ER4/sources/` has four nested `.git` dirs (candybox, progressknight, trimps, upstream), 944 files, 24 MB, and copies of other projects' `main.js` (`trimps/main.js` 872 KB, `cookie-mirror/main.js` 976 KB, `evolve/src/main.js` 629 KB, `upstream/src/main.js` 273 KB). `ui-foundation-2026-10-15/next-parts/scratch/` 120 MB (255 files) duplicates source files from ER4 (cross-folder hash matches for 272,905 B, 180,147 B, 109,564 B and 52,701 B files). `foundation-adoption-next-2026-10-13/rounds/r6|r7/disposable-profile/` is a Chromium profile (57 MB and 23 MB) containing `Login Data`, `Login Data For Account`, caches, 48 LevelDB `LOCK`/`LOG` files and 4 MB `BrowserMetrics-spare.pma` twice. The 48 `LOCK` files are database locks, not writer claims. Ignored correctly, but nothing records their deletion criteria. Fix: delete after the round's REPORT hashes are recorded; owner: SHARED_WORKTREE_PRACTICE cleanup table.

### D5b-F13 (dup, low): identical tiny logs and CLI output
VERIFIED. `ui-foundation-2026-10-15/runs/`: 15 files `r3-parity.log`-style with the same 141 B, 12 with 74 B, 9 with 193 B, 9 with 140 B, 7 with 171 B, 6 with 114 B, 5 with 138 B (ignored by `*.log`, not tracked). 144 empty files. No action beyond not tracking.

### D5b-F14 (dup, low): near-identical generated comparison pages
SUSPECTED. `ui-foundation-2026-10-15/evidence/uil*/comparison/*.html` (13 `comparison.html`, 16 `index.html` across dispatch, 4 `side-by-side` of 3 to 6 MB) are generated viewers. Keep the generator, drop the output.

### D5b-F15 (dup, low): same fixtures copied into later folders
VERIFIED. Cross-folder byte matches: `cheat-status-window-2026-10-13/runs/r1/...` vs `crafting-screen-2026-10-13/checks/fixtures/` (65 KB, 65 KB), vs `vivid-proto23-flow-2026-10-13/checks/fixtures/` and `checks/browser.cjs` (24 KB), vs `crafting-screen-2026-10-13/checks/gate.cjs` (20 KB); `calm-vivid-2026-10-14/evidence/populated-ui-fixture.json` (62 KB) vs `ui-foundation-2026-10-15/evidence/parity-r4/`; `ui-foundation-2026-10-15/evidence/c1-village-1920.png` vs `ui-triage-apothecary-2026-10-15/evidence/nav...`. Also a regress copy `cheat-status-window-2026-10-13/runs/r1/regressions/vivid-proto23-flow-2026-10-13/` re-tracks another folder's checks. Fix: reference by path.

### D5b-F16 (contradiction, low): evidence JSON versus REPORT.md
VERIFIED negative result. Checked 37 fenced JSON blocks of 600+ bytes in dispatch .md files; none duplicates a sibling JSON file. Largest are `gen-rules-2026-10-14/g5/CATALOG.md` (about 4.8 KB each, intended design catalog entries). No action.

### D5b-F17 (rule-violation, low): sealed secrets and attribution
Not exhaustively checked. SUSPECTED only: no spot-read of `private/` or novels folders was made per brief; `.gitignore:15-16` keeps `soldiers-life-world-2026-10-09/ASSIGNMENT.md` local while `ASSIGNMENT.md` is "Source-identifying dispatch input" – consistent. I did not scan dispatch .md for sealed-secret truth text (see Coverage).

## Coverage

Examined: all 12,074 files by SHA-1, size and git tracking state; all 3,209 .md files for relative link resolution; all DISPATCH.json (16), STATE.json (3), NEXT_UNIT.md (2), the 9 CHECKPOINTs that carry sole-writer or active text; top-level folder structure for CHECKPOINT/REPORT presence (132 folders); 880 script files for name and line-overlap families; external references from PROJECT.md, AGENTS.md, docs, src, tests, scripts to `dispatch/<folder>` and `docs/gm/dispatch/<path>` (230 distinct folder-name forms, 865 full paths).

Skipped or shallow: contents of `private/` and `docs/research/novels` (by rule); content-level duplicate-rule detection across the ~3,200 .md files (only hash and link level); sealed-secret scan of dispatch .md (F17); a CHECKPOINT-versus-NEXT_UNIT-versus-PROGRESS comparison for folders without a STATE.json (only 3 STATE.json and 2 NEXT_UNIT.md exist, so the STATE/CHECKPOINT/NEXT_UNIT triple check was possible for only two folders); content drift for the 22 launch.py variants beyond the one diff; no check of `git log` history size by path; the 6 `power-systems-2026-10-10` hash entries in `INPUTS.json` were not rehashed.

## Not changed

No edits, staging, commits, builds or servers. Only this file was created: `docs/reviews/DEDUP_AUDIT_2026-10-18/D5b.md`. Scratch data stayed in the session scratchpad.
