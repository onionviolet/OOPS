# Branch triage, 2026-10-16

Read-only triage of the 37 local branches not merged into
`codex/gameplay-foundations` (HEAD `a362fe2fa` when run). Why it matters: the
[merge-before-dispatch rule](../USER_VISION.md#merge-before-dispatch-2026-10-14)
was skipped when `codex/modular-seams` started moving `main.js` into a domain
registry ([AR1–AR16](../ARCHITECTURE_RULES.md),
[brief](dispatch/modular-seams-2026-10-16/BRIEF.md)). That brief merges
`codex/gameplay-foundations` into its branch every round, so anything landed on
HEAD before seams finishes gets carried through its refactor; anything landed
after has to be re-threaded through the new registry.

The triage itself was read-only. Weibao then said "address the rest reasonably"
(2026-10-16); the [outcome](#outcome-2026-10-16) section records what was merged,
deleted and left. Nothing was pushed.

Method, per branch: `git cherry HEAD <b>` (patch-id), ancestry between branches,
`git diff --name-only $(git merge-base HEAD <b>) <b>` for `src/main.js`,
`src/display.js`, `src/save_files.js`, `git merge-tree --write-tree HEAD <b>`
for conflicts, and the owner dispatch folder's checkpoint/report on HEAD or on
the branch. **`git cherry` found zero patch-equivalent commits on HEAD for all
37**, so "superseded" below always rests on the owner record plus a file diff,
never on patch-id.

## Summary

| Verdict | Count | Branches |
|---|---|---|
| merge | 7 | `hl/integration`, `codex/rbe-r1-resolver`, `core/a4-relationships`, `codex/rt-slice1` + `codex/rt-slice1-fixtures`, `proc/ta1-village-asks`, `claude/engine-perf-scaling-afdada` |
| superseded-delete-candidate | 27 | 7 × `codex/absorb-2026-10-11-*`, `absorb/air-micro-p1-xp`, 17 engine-perf branches contained in `absorb-all/integration` (delete only after it lands), `codex/hl-lp2`, `codex/hl-lp3` (after `hl/integration` lands) |
| needs-owner | 3 | `absorb-all/integration` (merge after owner go, see A2), `codex/rbe-r2-effect-dsl`, `w1-campaign` |

`absorb-all/integration` is counted as needs-owner, but the expected outcome is a
merge: its lanes passed their gates and only the tip lacks a recorded gate (A2).

### Proposed actions (for Weibao's yes)

- **A1. Clean merges, no core files, gates passed:** `core/a4-relationships`,
  `codex/rbe-r1-resolver`, `codex/rt-slice1-fixtures` (with A3). `hl/integration`
  conflicts only in generated `dist/` and `index.html`: take HEAD's, rebuild.
- **A2. `absorb-all/integration` (engine perf wave 2 + F1/F2 fixes + checks
  migration).** Biggest payoff and biggest `main.js` footprint (about +204
  lines, pre-AR1). Conflicts: generated files plus two hunks in
  `src/workspace_layout.js` against UI foundation `58b34e6a0`. Needs a fresh
  gate on the merged tree; no gate is recorded on its tip. Land before seams
  progresses further, or accept re-threading it later.
- **A3. Conflicting merges that touch `main.js` and passed their gates:**
  `codex/rt-slice1` (main/display) and `proc/ta1-village-asks` (main,
  generated_people*). Resolve, rebuild, rerun each lane's own browser proof.
- **A4. Delete after landing:** 17 engine-perf branches after A2; LP2/LP3
  after `hl/integration`. **Delete now if wanted:** 7 absorb-2026-10-11 workers
  and `absorb/air-micro-p1-xp` (work is on HEAD in newer form). Their
  worktrees under `~/code/absorb-2026-10-11-workers/` and the engine-perf/wave
  worktrees under `.claude/worktrees/` would need removing first.
- **A5. Owner calls:** `codex/rbe-r2-effect-dsl` (28 importer questions,
  merge-safe mechanically) and `w1-campaign` (needs private p09/p10 companions
  installed with it).

## Core-file exposure

Branches touching `src/main.js`, `src/display.js` or `src/save_files.js`
(base → tip): 19 total. 16 are the engine-perf lineage (15 branches inside
`absorb-all/integration`, plus that tip, which touches all three), plus `codex/rt-slice1`
(main, display), `proc/ta1-village-asks` (main) and `w1-campaign` (main).
`save_files.js` is touched only by `absorb-all/integration`,
`claude/engine-perf-wave`, `claude/fix-f1-sequence-426668` and
`claude/wave-a-loop-53c42e`, all the same D3 durable-write change. So the
real `main.js` merge work is four units: A2, `rt-slice1`, `ta1`, `w1-campaign`.

## Per-branch evidence

"Behind" = commits on HEAD since the merge base. "+N" = `git cherry` unique
commits (merge commits excluded).

### Engine perf wave and absorb-all integration (19 branches)

Owner: `docs/gm/dispatch/engine-perf-2026-10-14/` and
`docs/research/BROWSER_TESTING_AND_ENGINE_PERF_AUDIT_2026-10-14.md`, both
present only on the branches. The `absorb-all-2026-10-14` dispatch folder is
byte-identical on HEAD and integration; the absorb-all lanes themselves are
already on HEAD, so integration's unlanded content is the engine-perf lineage
plus `5fbd1f7e7` (sandbox gets D3 writer) and two bundle rebuilds.

None of it is on HEAD by another route: HEAD lacks the simfuzz, headless,
replay and perf-gate scripts, `startup.mjs`, `test_queue.mjs`, `dom_sync.js`,
`panel_reveal.js`, and `git grep` finds no `MAX_SIMULATION_CLOCK`,
`createDurableSaveWriter`, `auditRemainderNonceWindow`, `validatedSnapshots`
or the combat deadline scheduler.

Recorded gates: wave 2 merged on Weibao's "merge, no need to rerun for now";
build OK, 1,737 tests / 0 fail / 3 TODO, workshop browser 10/10 and village
check at 1366×768. **All wave-2 time ratios are provisional until a quiet-host
rerun.** F1 fixed in `9062f6579` (simfuzz 0 invariant groups, 17/17
determinism reruns identical, 1,741 tests / 0 fail); F2 fixed in `e0723a0d5`
(clock horizon 2^40). Lane F checks migration: 14 browser checks pass, 13 fail
on HEAD too, 6 unrunnable for missing fixtures. Two patch proposals (WB-V3,
`lane-a-structured.patch`) never applied. **No gate is recorded on the
integration tip `d4bcb1b89`** (its wave-f merge had a conflict).

| Branch | Tip | Behind | +N | Core files | Contained in | Verdict |
|---|---|---|---|---|---|---|
| `absorb-all/integration` | `d4bcb1b89` | 16 | 37 | main, display, save_files | none | **needs-owner → merge** (A2). Merge-tree: `dist/*`, `index.html`, `src/workspace_layout.js` |
| `claude/fix-f1-sequence-426668` | `9062f6579` | 78 | 33 | main, display, save_files | integration | superseded-delete-candidate after A2 |
| `claude/engine-perf-wave` | `e0723a0d5` | 78 | 32 | main, display, save_files | integration, fix-f1 | superseded-delete-candidate after A2 |
| `claude/wave-a-loop-53c42e` (RT8, D3, D4) | `df259bda2` | 78 | 13 | main, save_files | integration, wave | same |
| `claude/wave-b-state-f96892` | `439bf0593` | 78 | 15 | main | integration, wave | same |
| `claude/wave-c-headless-0f7b1d` | `e942ff902` | 78 | 11 | main | integration, wave | same |
| `claude/wave-d-simfuzz-b76281` | `b8045d277` | 78 | 14 | main | integration, wave | same |
| `claude/wave-e-replay-37566f` | `ead6735f2` | 78 | 11 | main, display | integration, wave | same |
| `claude/wave-f-checks-4616ad` | `89f5c760f` | 78 | 11 | main | integration only | same |
| `claude/wave-g-render-887951` | `451f3297e` | 78 | 12 | main, display | integration, wave | same |
| `claude/wave-h-startup-67e16e` | `35201e4d4` | 78 | 11 | main | integration, wave | same |
| `claude/wave-i-combat-d8c88a` | `f76904f4d` | 78 | 12 | main | integration, wave | same |
| `claude/engine-perf` | `8abd3882b` | 187 | 1 | main | integration, wave | same |
| `claude/engine-perf-core-5a93e1` | `951792bac` | 78 | 2 | main | integration, wave | same |
| `claude/engine-perf-d1` | `96aad3dff` | 78 | 4 | main | integration, wave | same |
| `claude/engine-perf-gate-853189` | `6ec2baa84` | 187 | 2 | main | integration, wave | same |
| `claude/engine-perf-harness-7fa4db` | `d8fb43a37` | 79 | 1 | none | integration, wave | same |
| `claude/engine-perf-layout-4d6570` | `eca2ca238` | 79 | 3 | none | integration, wave | same |
| `claude/engine-perf-scaling-afdada` | `c3a9369d0` | 79 | 1 | none | not contained | **merge**: docs/measurement only (D5 long-session scaling: flat saves to clock 100k, linear unyielded skips). Clean vs HEAD; add/add on the audit doc vs integration, so merge after A2 and union that doc |

### Absorb 2026-10-11 workers and Air micro-p1 (8 branches)

Owner: [absorb-2026-10-11 CHECKPOINT](dispatch/absorb-2026-10-11/CHECKPOINT.md):
every worker integrated by the root integrator, "Phase 4 PASSED: full combined
A-E journey", report commit `db2f1abd` (ancestor of HEAD); "Worker
branches/worktrees retained for inspectable provenance." The root reworked the
code on integration, so patch-ids differ, but every file these branches add
already exists on HEAD at the same path in a newer form. All based on
`c83bd8197`, 483 behind; none touch core files.

| Branch | Tip | +N | HEAD owner commits | Merge-tree vs HEAD | Verdict |
|---|---|---|---|---|---|
| `codex/absorb-2026-10-11-b` (furniture) | `d54bf106b` | 1 | `2a3c8af91`, `c6cb1e75c` | add/add conflict; branch lacks HEAD's `furnitureComfort()` | superseded-delete-candidate |
| `codex/absorb-2026-10-11-c1` (accessories) | `a20006786` | 2 | `35a97c456` | clean, identical to HEAD | superseded-delete-candidate |
| `codex/absorb-2026-10-11-c2` (local life) | `3dce81868` | 4 | `99b207e6c`, `f32e32cc5`, `dba165357` | conflicts; branch 152 lines behind | superseded-delete-candidate |
| `codex/absorb-2026-10-11-d` (Fort) | `761fde395` | 3 | `f62e264e9`, `57fce47e8`, `58b34e6a0` | conflicts; branch lacks later Fort UI/hosting | superseded-delete-candidate |
| `codex/absorb-2026-10-11-e1` (hunger/weather) | `e6c657329` | 2 | `8e453fc5c`, `fd737f8a4` | conflict; branch lacks `enabled`, `weatherEfficiency` | superseded-delete-candidate |
| `codex/absorb-2026-10-11-e2` (durability) | `9ef8a719a` | 2 | `8a4c82d90`, `0e31f0534` | conflict; branch lacks `requireIdentity` | superseded-delete-candidate |
| `codex/absorb-2026-10-11-e3` (elemental) | `16bb9ef85` | 2 | `237cf1286` | clean, identical to HEAD | superseded-delete-candidate |
| `absorb/air-micro-p1-xp` | `4414ba25d` | 1 | `252661721` ([MICRO-P1-XP.md](dispatch/air-absorb-2026-10-13/MICRO-P1-XP.md): "Landed on codex/gameplay-foundations as 25266172") | conflicts only in stale `dist/*`, `index.html`; source/test identical | superseded-delete-candidate |

Deleting these loses only worker provenance, not code; the checkpoint kept them
deliberately, so that is Weibao's call.

### Hogwarts LP2/LP3 (3 branches)

| Branch | Tip | Owner | Gates | Superseded on HEAD? | Core files | Merge-tree vs HEAD | Verdict |
|---|---|---|---|---|---|---|---|
| `hl/integration` | `10ff5acb7` | [hogwarts-legacy-decompile-2026-10-14](dispatch/hogwarts-legacy-decompile-2026-10-14/LP23_MERGE_ASSIGNMENT.md); results appended to its `INTEGRATION.md` on the branch | PASS (recorded on branch): focused 16/16; `npm test` 1,484 run, 1,481 pass, 0 fail, 3 TODO; build PASS; combined browser 34 groups at 1366×768 port 8203, zero page errors; Save/reload/Export/literal Import at five checkpoints | No. HEAD has LP1, LP4–LP8 merged (`277c8ffd0`, `09e38aa18`); LP2+LP3 reconciliation is only here. HEAD `b704acd15` still says "reconciliation in progress" | none | Conflicts only in `dist/bundle.js`, `dist/bundle.js.map`, `index.html` (generated) | **merge** (take HEAD's generated files, rebuild after) |
| `codex/hl-lp2` | `d98c40ab9` | same, `LP2_ASSIGNMENT.md` | lane gates recorded in `runs/lp2.last.md` | Fully contained in `hl/integration` | none | n/a | **superseded-delete-candidate** once `hl/integration` lands |
| `codex/hl-lp3` | `849503c51` | same | lane gates recorded in LP3_REPORT | Fully contained in `hl/integration` | none | n/a | **superseded-delete-candidate** once `hl/integration` lands |

Caveat: the reconciliation lane notes legacy LP1/pre-LP3 save cases have loader
tests but were not newly exercised as imported legacy saves in its browser run.

### Rulebook engine R1/R2 (2 branches)

| Branch | Tip | Owner | Gates | Superseded on HEAD? | Core files | Merge-tree vs HEAD | Verdict |
|---|---|---|---|---|---|---|---|
| `codex/rbe-r1-resolver` | `4d168282d` | [rulebook-engine-2026-10-14](dispatch/rulebook-engine-2026-10-14/R1.md), `r1/CHECKPOINT.md` on branch | PASS: 72/72 targeted (72,000 sweep samples), `npm test` 1,828 pass, 0 fail, 3 TODO | No. Adds new `src/check_*.js` (5 files) + tests; none exist on HEAD. HEAD `df342ec53` (CB-T3 rule modules) is a different module | none | clean | **merge** (inert, additive). Checkpoint lists "root review and playable D&D consumer" as later gates, so landing it is not a feature acceptance |
| `codex/rbe-r2-effect-dsl` | `186b553f7` | same, `r2/CHECKPOINT.md`, `r2/CHECKS.json` | PASS: 93/93 focused, `npm test` 1,849 pass, 0 fail, 3 TODO | No. Adds `src/effect_dsl.js`, SRD 5.2.1 pilot data with `ATTRIBUTION.md`, import tools | none | clean | **needs-owner**: checkpoint says "merge only under coordinator authorization" pending review of 28 explicit importer questions; 20/20 drafts need semantic correction. Mechanically safe to merge any time |

### Research-tech slice 1 (2 branches)

| Branch | Tip | Owner | Gates | Superseded on HEAD? | Core files | Merge-tree vs HEAD | Verdict |
|---|---|---|---|---|---|---|---|
| `codex/rt-slice1` | `667fbe118` | [research-tech-2026-10-14](dispatch/research-tech-2026-10-14/B1.md), `slice1/CHECKPOINT.md` on branch | PASS: 16 focused; `npm test` 1,388 pass, 0 fail, 3 TODO; build PASS; seeded-native journey at 1366×768 and 1600×1000 incl. reload/Import. "Root review and feel remain open" | No (`src/craft_cues.js` absent on HEAD) | `main.js`, `display.js` | Conflicts in `src/main.js`, `src/display.js` | **merge** with conflict resolution; do it before modular-seams lands. 220 commits behind |
| `codex/rt-slice1-fixtures` | `aa0c2d221` | same, B2; `slice1-fixtures/REPORT.md` on branch | PASS: `npm test` 1,382 run, 1,379 pass, 0 fail, 3 TODO. Report notes ordinary timed travel hit `Invalid calendar anchor` on the first Town trip while capturing | No | none | clean | **merge** together with `rt-slice1` (fixtures only; depends on it to be meaningful) |

### Core A4, traveler asks TA1, World1 campaign (3 branches)

| Branch | Tip | Owner | Gates | Superseded on HEAD? | Core files | Merge-tree vs HEAD | Verdict |
|---|---|---|---|---|---|---|---|
| `core/a4-relationships` | `c6ea2cbc4` | [core-foundations-2026-10-14 a4](dispatch/core-foundations-2026-10-14/a4/CHECKPOINT.md) | PASS: 15/15 own, 34/34 scoped. No rebuild/browser (unwired read view) | No. [Scorecard](../CORE_FOUNDATIONS_SCORECARD_2026-10-14.md) line 146: "not merged"; A1 plan ranks "review and merge A4" as a first change | none | clean | **merge** (2 new files, unwired) |
| `proc/ta1-village-asks` | `c18da6913` | [traveler-asks-2026-10-14](dispatch/traveler-asks-2026-10-14/PLAN.md) TA1; `ta1/CHECKPOINT.md` on branch | PASS: "Stage 5 complete, ready for root integration"; `npm test` 867/867, build PASS, lint zero findings, natural-seed browser at 1366×768 and 1600×1000, Save/reload/Export/literal Import incl. rev-1 fixture. PLAN: "Root merges TA1 after its gates" | No; HEAD's `generated_people.js` has P34 changes since (`6af99aecd`, `702919063`) | `main.js` | Conflicts in `src/main.js`, `src/generated_people.js`, `src/generated_people_ui.js` | **merge** with conflict resolution, then rerun its browser proof (865-test baseline is far behind HEAD's ~1,850). 265 behind |
| `w1-campaign` | `bc999ea49` | [world1-full-completion-2026-10-11](dispatch/world1-full-completion-2026-10-11/); launched per [foundation-adoption-next CHECKPOINT](dispatch/foundation-adoption-next-2026-10-13/CHECKPOINT.md) | C01, C02 and foundation integration verified on branch: 628/628 tests, seeded-native groups, exact persistence checkpoints at 1600×1100. Whole campaign incomplete (15/15 section gates OPEN). [T13 ownership](dispatch/research-tech-2026-10-14/t13/OWNERSHIP.md): session ended after C01/C02 | No | `main.js` (beginning choice) | Conflicts in `src/main.js`, `PROJECT.md` | **needs-owner**: root must install ignored private companions p09/p10 when merging, and the branch rewrites the World1 CHECKPOINT. 407 behind; the oldest live code branch |

## Not checked

- No branch was built, tested or browser-run in this triage; gate results are
  the owners' recorded results, quoted from their checkpoints and reports.
- Merge-tree conflict lists are against HEAD `a362fe2fa`; HEAD moves often, so
  rerun `git merge-tree --write-tree HEAD <branch>` before each merge.
- Worktree cleanup (many `.claude/worktrees/*` and `~/code/*` worktrees hold
  these branches, several marked prunable) was not assessed beyond noting it
  blocks `git branch -d`.

## Outcome, 2026-10-16

Authority: Weibao, "address the rest reasonably". Merged in a scratch worktree,
gated, then landed on `codex/gameplay-foundations` as `1e658c2f2` with a guarded
`update-ref` over `68bf1cf2f`. Not pushed.

### Merged (9)

`core/a4-relationships`, `codex/rbe-r1-resolver`, `codex/rbe-r2-effect-dsl`,
`codex/rt-slice1-fixtures`, `claude/engine-perf-scaling-afdada`,
`hl/integration`, `absorb-all/integration` (engine perf wave 2 with F1/F2 and
the checks migration), `codex/rt-slice1`, `proc/ta1-village-asks`. Through
`absorb-all/integration` and `hl/integration`, all 17 contained engine-perf
branches and LP2/LP3 are now ancestors of HEAD too.

`codex/rbe-r2-effect-dsl` was merged as an inert module: its 28 importer
questions and the 20 drafts needing semantic correction stay open in
`r2/REPORT.md`. Nothing consumes it yet.

Conflict resolutions:

- `src/workspace_layout.js`: kept HEAD's UI-foundation behavior (composition
  parking, parity regions, `syncPanelHeader`) and applied the perf wave's
  change-guarded setters (`setStyle`, `setProp`, `setData`) to the same writes.
- Engine perf audit doc: add/add with the scaling branch; both sections kept.
- `src/display.js`: HEAD's recipe model (attempts, effects, related uses, back)
  plus RT slice 1's craft cue and pre-craft skill level, using HEAD's graded
  `resultCount()`.
- `src/main.js`: HEAD's publication render batch, with RT slice 1's
  `villageTextChanged` refresh condition; TA1's obtainability import added.
- `src/generated_people.js`: TA1's revision-2 generator, using HEAD's shared
  `xorshift32` helper (equivalent arithmetic, keeps the ratchet count).
- Generated `dist/` and `index.html`: HEAD's copies, then one rebuild commit.

Follow-up fixes (`5052c1653`): the Village supply-table script's opening-stock
anchor (HEAD inserted `commitLocalDateHeader()`), RT slice 1 fixtures predating
the Butchering and Famine skills (zero-XP additions ignored), and the D4
hidden-tab wrapper renaming one existing UI-contract exception (same count,
new key).

AR1 note: the perf wave adds about 200 lines to `src/main.js`. It predates
AR1 and is accepted as pre-AR debt for `codex/modular-seams` to migrate; that
branch merges `codex/gameplay-foundations` each round.

### Checks

| Layer | Result |
|---|---|
| Build on merged tree | PASS |
| `npm test`, HEAD `a7bfba2b2` baseline | 1,791 pass, 0 fail, 3 TODO |
| `npm test`, merged tree | 2,035 pass, 0 fail, 3 TODO (2,038 tests) |
| `check:rules` | 11 problems, identical on the unmerged tip (anchors to uncommitted entries) |
| Lane browser harnesses (LP2/LP3 combined, systems workshop, village) | **Not usable**: all fail on plain HEAD as well. The UI foundation shell (`58b34e6a0`) hides `#notebook_tab_here` and `.end_dialogue_button`, which the scripts click |
| Fresh-origin smoke at 1366×768, HEAD vs merged | Identical: hero confirm, clock advances 20 game minutes, Save/reload round trip matches, zero page errors. The smoke's Import step did not drive the native Import flow on either build, so Import is unverified |

Acceptance backlog from this merge (implemented-unverified at browser level):
LP2+LP3 combined path, RT slice 1 craft cue and Village sentence, TA1 reach
bands and fees, engine perf D3/D4/RT8 in a live tab, and literal-file Import.
All need their harnesses updated for the UI foundation shell first.

### Shared checkout

After landing, 326 changed paths matching the old HEAD were checked out. Seven
files carried older uncommitted edits (`src/main.js`, `display.js`,
`save_files.js`, `simulation.js`, `simulation_effects.js`,
`workspace_layout.js`, `tests/helpers/story_spine.js`). Each edit was replayed
onto the new HEAD with `git merge-file` (all clean, same added-line counts) and
its index entry set to the new blob, so committing those edits no longer
reverts merged code. Originals are backed up outside the repo in the session
scratchpad. `dist/` was rebuilt from the result.

### Deleted (19 branches)

Superseded (work on HEAD in newer form; SHAs kept for recovery):
`codex/absorb-2026-10-11-b` `d54bf106b`, `-c1` `a20006786`, `-c2` `3dce81868`,
`-d` `761fde395`, `-e1` `e6c657329`, `-e2` `9ef8a719a`, `-e3` `16bb9ef85`,
`absorb/air-micro-p1-xp` `4414ba25d`. Their clean worktrees under
`~/code/absorb-2026-10-11-workers/` were removed.

Merged: `core/a4-relationships`, `codex/rbe-r1-resolver`,
`codex/rbe-r2-effect-dsl`, `codex/rt-slice1`, `codex/rt-slice1-fixtures`,
`claude/engine-perf` (clean worktrees removed), and `codex/hl-lp2`,
`codex/hl-lp3`, `hl/integration`, `proc/ta1-village-asks`,
`claude/engine-perf-wave`. Those last five worktrees hold gitignored private
evidence (save exports, sample logs) or untracked dispatch copies, so they were
kept and detached rather than removed.

### Left in place

- `w1-campaign` (**needs-owner**, unmerged). The trial merge hit design
  conflicts, not mechanical ones: HEAD now prefers the livelihood pack and a
  local `structured_candidate` preview for the default beginning, while W1
  makes the first installed pack the default; and W1's predicate-scoped
  `simulationFacts(…, predicates)` collides with the perf wave's per-frame facts
  memo, which would need the predicates in its cache key. Its private p09/p10
  companions exist in `.claude/worktrees/w1-campaign/private_packs/` and are not
  installed in the main checkout.
- Merged but not deleted, because idle Claude sessions still run in their
  worktrees: `claude/engine-perf-core-5a93e1`, `-d1`, `-gate-853189`,
  `-harness-7fa4db`, `-layout-4d6570`, `-scaling-afdada`,
  `claude/fix-f1-sequence-426668`, `claude/wave-a` through `wave-i`. Same for
  `absorb-all/integration`, where 39 Python static servers use the worktree as
  cwd. All are ancestors of HEAD, so `git branch -d` is safe once those
  sessions are archived.
- New since the triage, out of scope: `codex/modular-seams` (active Codex run)
  and `claude/world-pack-loader-9cff81`.
