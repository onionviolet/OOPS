# LP slices integration, 2026-10-14

Branch `hl/integration` from `c83945e5`: merged codex/hl-lp1, lp5, lp6,
lp7, lp8 (--no-ff). Weibao authorized: "merge passing LP slices with
build/test/smoke and push".

Conflicts: dist bundle and index.html version line (resolved by rebuild);
src/simulation_effects.js (LP1 leverFacts + LP6 partnerFacts, both kept);
src/feature_expansion_objects.js and feature_expansion_wave_host.js (LP7
material choices + LP8 drying tracker, both kept).

Checks on the merged tree:
- npm run build: pass. Bundle sha256 prefix e3f195c9231c.
- npm test: 1465 tests, 1462 pass, 0 fail, 3 todo.
- Each lane's own browser script against the merged build at
  127.0.0.1:8203 (fresh contexts, 1366x768; LP1 also 1440x900): LP1 pass
  (0 page errors), LP5 pass, LP6 pass, LP8 pass, LP7 pass 12/12.
- LP7 note: its "advance 4 played minutes" helper (40 x 1 s fake-clock
  steps) failed under heavy machine load on BOTH the merged build and the
  unmerged codex/hl-lp7 branch (3/3). With a 400-step budget both pass
  12/12. Harness timing, not a merge regression.

Not included: LP4 (browser check still running on port 8202 after a port
clash), LP2/LP3 (launch after this lands). Remaining gate: Weibao's play
and taste.

## LP4 follow-up merge

LP4 finished its browser acceptance on port 8202 (`4a030ee3`). Merged onto
the landed tip plus later docs commits (d40b80cb). Conflict: src/main.js
panel init (kept the newer harvest panel line and added LP4's habitat
panel line). npm test: 1473 tests, 1470 pass, 0 fail, 3 todo. LP4's
browser script on the merged build: all checks, errors []. LP1's script
as regression: 12 PASS. LP4 report note: a fresh chance replay spent 120
wool over 24 failed ordinary cloth recipes (existing recipe odds, not LP4
logic); flagged for balance.


## LP2 + LP3 reconciliation

2026-10-14, reconciliation writer on `hl/integration`, merged input `b91a1766`.
Authorized by the supplied reconciliation dispatch. The coordinator owns landing;
this lane commits locally and does not push or merge into `codex/gameplay-foundations`.

The combined player path is **Fitting tools & materials → Meet Eda → buy a fitting
knife → cut a log → dry a stave → Bind one lever practice brace**. Then open
**Here → Field association & workshop → Wedged timber & lever lesson**, complete
hand work and the demonstration in either order, return both records, explain
the pivot rule, and finish the three-minute practice. Practice spends one real
brace, one coin and one stamina. The learned method makes the same useful kit
in two minutes with a spare log lever, rather than six minutes by hand.

D1. The coordinator's combined runtime rule is correct: revision-two practice
requires the returned LP2 evidence and checked rule plus LP3's actual brace.
The completion support retains the LP2 policy. No production source or save
schema edit was needed. LP2 fixtures now supply one controlled brace; LP3
fixtures earn completed hand evidence, demonstration and teacher return. The
undefined LP1 `fixture()` call now uses `createFieldFixture()`. Original test
intents and frozen LP1 definitions remain intact. The LP2 assertions also check
that return alone does not satisfy the rule and that practice consumes exactly
the supplied brace.

D2. No migration. Absent optional lesson/brace state loads unchanged. Existing
revision-one demonstrated/explained and paid-pending jobs preserve their original
terms. Learned LP1 methods retain current useful lever work without a brace
back-charge or repeated practice reward. A pre-LP3 paid pending practice retains
its frozen costs and completes without a retroactive brace charge. These cases
have focused current-loader/scheduler coverage. They were not newly exercised
as legacy save imports in this lane's browser.

D3. Target viewport is **1366×768 desktop**, port **8203**. Visible outcome is the
existing bench stock/slot, separate evidence/return/rule/practice record and real
changed timber task. These remain labelled proposals. Mobile optimization and
new world/prestige work are deferred, consistent with PROJECT.md and USER_VISION.md.

V1. Focused reconciliation command:
`node --test tests/lever_lesson.test.js tests/lever_assignment.test.js tests/lp3_practice_supply.test.js`:
**16 tests, 16 pass, zero fail, zero skipped, zero TODO**.

V2. `npm run build`: PASS, Ink check zero diagnostics. `npm test`:
**1,484 tests, 1,481 pass, zero fail, zero skipped, three existing TODOs**,
200345.807667 ms. The TODOs remain the legacy combat RNG, local-life
search/contact RNG and encounter/loot/craft/market/gather RNG cases in
`tests/determinism_replay.test.js`. No unrelated failure was observed or repaired.

V3. `node docs/research/hogwarts-legacy/lp23-integration-evidence/browser.cjs`:
**34 groups PASS, zero page errors**, fresh isolated contexts at **1366×768** on
port **8203**. Adapted the LP3 bench/timer/persistence harness and LP2's
both-order evidence assertions. Each path earned the bench brace first, then
hand/demonstration evidence in its permitted order, separate rewardless return,
checked rule, brace-consuming practice and one kit from the faster learned task.
The one-evidence record refused teacher return. Return alone still refused
practice. Evidence, return and explanation granted no method. Practice consumed
one brace and one coin; supported completion taught exactly once. Each path
ended with two kits: one hand-work kit and one learned-task kit.

V4. Both paths passed native Save, reload, Export and **literal file-input Import**
at batch pending, brace collected, one evidence, practice pending and completed
task checkpoints. Compared native inventory, purse, XP/levels, clock, RNG,
simulation state and player actor receipts against the actual Export. Pending
practice retained revision two, an unlearned method, zero carried braces and its
paid job. Repeated collected imports retained one brace; repeated completed
imports retained zero braces and one practice receipt. No recollection, reward
replay or tuition respend was observed. Twenty desktop screenshots were captured;
ready-batch, missing-evidence, returned, restored-pending and changed-task views
were visually inspected.

V5. [Checks](../../../research/hogwarts-legacy/lp23-integration-evidence/checks.json),
[browser results](../../../research/hogwarts-legacy/lp23-integration-evidence/results.json)
and [reproducible harness](../../../research/hogwarts-legacy/lp23-integration-evidence/browser.cjs)
are committed with the report. Disposable native Exports remain ignored under
`docs/research/hogwarts-legacy/private/lp23-integration-evidence/`. Authored files
pass `git diff --check`; `node --check` passes for the harness. The generated
bundle's literal-string trailing whitespace is retained as emitted by esbuild.
Served and rebuilt bundle SHA-256:
`836d97ca8e0bb72d99af1253048b5bd741911295753988ac1c41440eaa59a2eb`.

M1. Reconciliation changes are confined to three test files, this append and the
new combined harness/results/screenshots. No shared runtime hot file, original
slice report, frozen LP1 JSON definition or save-schema file was changed. Commit
the reconciliation/evidence first, then rebuild and commit `dist/bundle.js`, its
map and generated `index.html` fingerprints as the final commit. The coordinator
owns the next landing/merge/push. No push or downstream merge was performed.

R1. Native proof reuses the LP3 lane's existing earned R1 checkpoint (95 logs,
three sap), controlling only initial time to 08:00 for the established teacher
window. It does not establish the new-game introduction, natural overnight wait
or full ingredient-gathering journey. No LP evidence, brace, method, production
receipt or reward is injected. Playwright advances normal game timers.

R2. Cancellation, lost support, borrowed-material refusal and legacy restoration
have focused source coverage. Their native browser cases remain
implemented-unverified here. No offline timing or mobile claim is made.
The one remaining authoritative acceptance gate after technical checks is
**Weibao's play and taste**.
