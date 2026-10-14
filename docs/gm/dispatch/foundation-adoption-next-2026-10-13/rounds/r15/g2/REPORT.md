# R15 G2 production verification

2026-10-13. Worker: `worktree-agent-a31a7ac7607bfd391`. Scope and evidence
labels follow [BRIEF.md](../BRIEF.md). Exact leaf owners remain
[R4](../../r4/ACCEPTANCE_BACKLOG.md), [R6](../../r6/ACCEPTANCE_BACKLOG.md)
and [R7](../../r7/ACCEPTANCE_BACKLOG.md); their earlier attempts are history.

The stopped worker's useful code, regression test, fixtures and browser evidence
were preserved. `codex/gameplay-foundations` was merged at `a697c3d1`.
The source changes applied cleanly. Generated bundle/HTML conflicts were
resolved by rebuilding, and are excluded from the worker commit.

**Result:** FA09 and FA11 have additional seeded-native positives and controls;
FA12's current occupied-residue positive passes. Controlled input rejection
and otherwise unreachable support-loss cases remain source evidence. This is
not a claim that every original native backlog row is closed.

## Method and reproducibility

- Target: headless Chrome, 1600×1100 desktop, worktree server on
  `127.0.0.1:19120`, disposable profiles under `/private/tmp/r15-g2-profile-*`.
  No mobile or broad layout work.
- Rebuilt bundle SHA256:
  `d4999496a25e220c14e09e159bf0dc7e910fa8dfb7781cc94fbec180fbbf5c2a`.
  `evidence/CURRENT-LOADS.json` records actual browser response URLs and hashes
  matching disk. No gameplay source edit followed this build.
- `fixture/generate.mjs` imports earlier disposable R4/R7 exports through real
  `importSaveFile` and `load`, uses actual character/inventory models, then
  `create_save` and `encodeSaveFile`. Fresh model imports check every result.
  All heroes are named `TEST FIXTURE R15 G2 ...`. These are QA prerequisites,
  not natural acquisition or balance proof. No personal saves are read.
- Browser work uses real controls. For exact stamina and short cancellation
  windows, the harness clicks a control and stops the page timer in the same
  task, then reloads to resume ordinary time. It does not edit game state.
  Quota cases inject a failing browser storage write.
- Persistence comparisons use real Save, reload, Export and literal-file
  Import. They compare fully loaded owners **before PLAY** to avoid racing a
  normal played tick. Inventories, money, body, actors, RNG, jobs, sites,
  program/cursor, clock, calendar, location and reference state are compared.
  The first current retort reload advanced one normal tick; its failed exact
  comparison is retained and the before-PLAY comparison passes.

Run `node .../g2/harness.cjs resumed`, then
`node .../g2/run-step.mjs <step>` from the repository root. Step order:
`retort`, `retort-restoration`, `controls`, `program-held`, `mixed`, `merchant`,
`reserve-exhaustion`, `program-controls`, `retort-quota`, `fa12-shots`. Regenerate fixtures
first if needed. These steps replace only the disposable test-origin save.
The controller listens on loopback port 19121. Stop it with its `quit()` helper.

## FA09 routines

| Leaf | What was checked | Label | Result / limit |
|---|---|---|---|
| F09-1 three-acceptance reserve exhaustion | Start with zero kits, three resin and six sound staves. Two accepted batches reach four carried kits and hold. Store two kits through the native chest, return and explicitly resume; the third accepted batch completes. Six kits total, including the two in the chest; no inputs remain and no fourth job | seeded-native | PASS; `CURRENT-RESERVE.json` |
| F09-2 accepted support-loss refund and used slot | Existing common scheduler tests move the accepted job's context away from support, refund inputs/effort, retain the used slot and require explicit resume. Three refunded acceptances exhaust the budget | source | PASS source; native OPEN. Ordinary travel, equipment and other activities are guarded while this player job is accepted, so no honest UI transition was found to remove its support mid-job |
| F09-3 program funding depletion | Three-coin fixture funds one pack. Purse becomes one, kit count increases once, two repetitions remain paused. Explicit resume without funds spends nothing; exact persistence passes | seeded-native | PASS; `CURRENT-PROGRAM-HELD.json` |
| F09-4 program material depletion and pause/resume/current cancel | One-log fixture has funds for three packs but pauses after the first. Separate five-coin run pauses future repetitions while retaining the current pack, lets it finish, explicitly resumes and cancels the accepted next pack with its money/log returned | seeded-native | PASS; `CURRENT-PROGRAM-CONTROLS.json` |
| F09-5 mixed depletion/current/future controls | One-log household itinerary pauses at supply before charge. Future cancellation retains Orr's already funded repair but stops the cursor. Another run reaches manual Shack travel; resume accepts personal packing, current cancel returns its owned log without a kit. WorkPlans 1 and exact restorations pass | seeded-native | PASS; `CURRENT-MIXED.json` |
| F09-6 mixed participant attention loss | Existing test exhausts Orr's attention at the actual wait step; no resident acceptance appears and the plan pauses | source | PASS source; native OPEN. No UI control removes that resident's attention at this specific pending boundary |
| F09-7 stale/forged projection, cursor, policy and receipt; custody/equipment/foreign body/realm/site/tool rejection | Existing 16 routine tests plus one new chronology/downgrade test exercise exact current seams. New check rejects future start/sequence, negative update time and a reserve wrongly tagged as legacy WorkPlans 1 without mutating the valid input | source | PASS within these cases. No claim of every clock/custody combination; forged inputs have no honest ordinary UI path |
| F09-8 exact stamina debit/refund | Held native reserve acceptance changes `stamina_to_full` 0→1; current cancellation returns it to 0, with resin/staves unchanged and one acceptance slot used | seeded-native | PASS; `CURRENT-CONTROLS.json` |
| F09-9 failed publisher and explicit retry | One injected acceptance write fails, durable full save equals the prior save. Reload and one explicit retry reserve only one batch, one resin and two staves | seeded-native | PASS at acceptance; completion-write failure remains source-only |
| F09-10 old-save readers | Real legacy household WorkPlans 1 cursor survives current Save/reload/literal Import. Source tests retain schema 1/2 reads and reject illegal stock fields under grammar 1 | seeded-native | PASS current legacy import. An actual older browser binary rejecting a schema-2 reserve was not run and remains OPEN |
| F09-11 held no polling / closed browser | Seven-kit reserve holds without accepting a batch. Browser closed for six real seconds; reopened before PLAY with identical stock, cursor, clock and calendar. Source boundary is Infinity | seeded-native | PASS for this held state; no universal offline claim |

## FA11 two-receiver retort

| Leaf | What was checked | Label | Result / limit |
|---|---|---|---|
| F11-1 resume through three batches | Six supplied sap. Each batch reserves one sap, one fuel log and both empty trays. Completion pauses until both receivers are cleared; clearing alone never resumes. Explicit resumes settle all three, consuming exactly three sap/logs. Exact final persistence passes | seeded-native | PASS; `CURRENT-RETORT.json` |
| F11-2 current cancellation/refund | Cancel the accepted batch: sap, fuel and both trays return; stamina 0→1→0; no output. Exact cancelled-state persistence passes. Already completed measured-pack routine remains complete | seeded-native | PASS; `CURRENT-CONTROLS.json` |
| F11-3 future cancellation | Stop future batches while one is accepted. The job remains paid and finishes once after reload, returning two filled receivers; no automatic later batch | seeded-native | PASS; `CURRENT-CONTROLS.json` |
| F11-4 support loss | Existing tests remove supported location/alive body/hands/health at common completion, with exact input/fuel/receiver refund and no completion | source | PASS source; native OPEN for the same guarded mid-job support transitions described in F09-2 |
| F11-5 receiver ownership | A receiver is moved to the real trader inventory model as a seeded sale prerequisite. Browser batch is disabled with one shop tray and zero carried trays; merchant-owned persistence matches | seeded-native | PASS browser ownership/control; `CURRENT-MERCHANT.json`. A natural sale/rebuy remains OPEN |
| F11-5R merchant refresh | The real `TraderComponent.refresh` preserves the actual tray and a real serializer/importer/loader roundtrip retains it | source | PASS; `fixture/MERCHANT-SOURCE.json`. Browser day-boundary refresh remains OPEN |
| F11-6 foreign/equipped/borrowed/stored/forged receivers | Source tests check admission, complete envelope conservation and frozen-job corruption; predecessor browser proof also stores the tray in the native chest and cannot resume | source | PASS source scope; no browser claim for impossible equipment/loan/forged variants |
| F11-7 failed publisher/quota | Native acceptance publication fails without a durable change; reload and one explicit retry accept exactly one batch. Pending save/reload/literal Import and single settlement are checked | seeded-native | PASS acceptance; completion publication is source-only |
| F11-8 old absence/readers and broader keyboard controls | Existing tests retain old absence and WorkPlans 1/2. Current plan starts with focused keyboard Enter | source | PASS compatibility tests. Actual older browser rejection and broad Tab/focus matrix remain OPEN; Enter alone does not close that matrix |

## FA12 production comparison

| Leaf | What was checked | Label | Result |
|---|---|---|---|
| F12-1 occupied residue on current bytes | After the first batch, collect only resin. The next batch remains unavailable; both **collect spent residue** and **dispose of the held tray's residue** show their current terms. Disposal spends its ordinary minute/effort and returns the empty receiver. Collection is used on batch two. Neither choice automatically resumes the plan | seeded-native | PASS; `CURRENT-RETORT.json` and `current-fa12-occupied.jpg` |
| F12-2 stale/custody/opposite input matrix | Covered by the existing production/routine/retort source seams, not another UI redesign | source | PASS exact tested seams; native corruption matrix remains OPEN |

## Defect, source changes and compatibility

**D1:** cancelling an unrelated retort batch changed an already completed
measured-pack program to `paused`, even with zero repetitions left. The stopped
worker reproduced this and left the repair/test. Current browser F11-2 confirms
the completed program stays complete; the source regression passes.

The sole gameplay source change is the small conditional in
`src/simulation.js::cancelSimulationJob`: preserve a completed program when
the cancelled job belongs to another command. Cancelling its own command still
uses the existing routine behavior. `src/main.js` and `src/save_files.js` are
untouched by G2. Tests changed: `tests/fa11_retort.test.js` (regression) and
`tests/fa09_routines.test.js` (invalid chronology/legacy downgrade).

No save format or job terms changed; no migration is required. Existing saves
are read as before. The repair does not rewrite historical paused programs or
replay any old completion.

## Verification, artifacts and remaining scope

**source:** `npm run build` passed. Final `npm test`: **611/611 PASS**, zero failures.
Focused routine/retort tests: **32/32 PASS**, included in that total.
These counts are not additive. `evidence/FINAL-BINDINGS.json` records hashes
and the final check summary. The worker commits its source/tests and this
folder only, with no `dist/`, `index.html`, browser profiles or push.

`CURRENT-*` journals and restoration/load lists own the new browser claims.
Lossless archives retain full save snapshots, exports and their manifests;
extract an exported `.txt` before literal Import. Two fixture `.txt` files remain
directly available; extract the others from `fixture/FIXTURES.tar.xz` or regenerate.
`PREDECESSOR-ARTIFACTS.tar.xz` preserves the stopped
worker's full state/export evidence without rewriting it as current proof.
Its saved mixed reload differed by one played tick; current F09-5 supplies the
exact replacement comparison. Unasserted predecessor quota/debug images are
not credited as a pass.

Native support-loss/refunded reserve-slot and participant-attention transitions,
actual older browser readers, natural receiver sale/rebuy/day refresh, completion
publication faults and the broad keyboard matrix remain as stated above.
Rejected-input seams intentionally remain source-level where ordinary UI cannot
produce the input. Human fiction/balance acceptance and the root's integrated
recovery/review remain outside this worker delivery.
