# D7 Harry Potter first playable slices, 2026-10-25

Authority: Weibao's D7 brief of 2026-10-25 explicitly selects four slices, in order. Full-world horizon remains broader than this delivery. All original profiles, people, prices, durations, timetable and performance values below are proposals, not canon or accepted balance.

## Ownership and fit

Branch `codex/hp-world-2026-10-25`, worktree `/Users/weiwei/.codex/worktrees/hp-world/yet-another-idle-rpg`, port 5107. Code writer: D7. Two read-only Luna-low helpers: source/card anchors and test/runtime seam extraction; no bulk reading or acquisition. LOTM files excluded.

Rules: AD1–8, AD15–19, AD23, AD32–38, AR1–16, WA1–21 (especially WA13), MR1–36, SR1–24, SLR, PIR, ECR; WPR1–32 as the primary checkout's proposed pass workflow. `WORLD_PASS_RULES.md` is absent on this branch but read from the primary checkout. Scope is reuse-and-check plus implementation, seven English novel baseline with supplemental evidence kept separate. Stop at four verified slices and a next-slice list.

Seam: bundled `book.hp` loader -> plain native life definitions -> existing structured-pack compiler, native start/body, commands/jobs, skills, powers, knowledge and save receipt. No second save owner or spell interpreter. Existing Polyjuice data and behavior retained. Candidate entry is explicit through localhost `structured_candidate`, preserving the default Village opening.

Target: 1920×1080 desktop, plus 1536×864 floor at 14/21 px for the final browser matrix. Visible outcome: player can deliberately enter HP, understand their means, attend scheduled teaching, practice methods, and play a separate adult trade life with travel. Mobile optimization deferred.

Primary overlap checked before editing: `src/main.js` has another session's uncommitted edits. This branch adds only an import and HP structured registration; merger must reconcile those hunks. No primary edits. HP pack/test paths were clean. Baseline branch clean at `3dfc49cf3`; inspected latest 30 master commits and systems register. HP already has a bundled Polyjuice pack; this extends it rather than duplicating brewing. Structured campaigns already supply native body, inventory, jobs and exact saved receipts; population pack deltas do not import active gameplay.

Compatibility: existing command definitions remain unchanged; additive HP life content gets separate IDs. No default enrollment and no change to existing save shapes. Exact structured content hashes guard new HP saves. Baseline default-save journey captured before enrollment; old save validation and browser import required at each slice.

## Planned checks and failure scenarios

Focused owner: `node --test tests/world_pack_hp.test.js`. Protect inert opt-in, atomic re-entry refusal, independent means/body/knowledge, finite stock/debt, schedule commitment/completion boundaries, real native XP/power mastery, unsupported wand/target refusal, native travel and saved receipt round trip. Browser: real UI on port 5107, fresh contexts, save/reload/Export/literal Import. Full build/test/arch/rules once at the end after current-master reconciliation. No rule changes planned. Never commit dist.

## Slice ledger

1. School life entry: PASS. Seven focused tests; rebuilt browser on port 5107, native entry, Save/reload/Export/literal Import exact HP projection; old default save imports without enrollment. `slice-1.json`.
2. Calendar and lessons: PASS. Eight focused tests; rebuilt slice-2 browser completes charms and preserves the method across Save/reload/Export/literal Import, then imports the pre-entry save without HP enrollment. `slice-2.json`.
3. Descriptor wand/spell practice: PASS. Nine focused tests include both spell rows and conserved borrowed-wand return; rebuilt slice-3 browser practices/casts levitation and round-trips. `slice-3.json`. Final matrix will exercise the loan and repair through UI too.
4. Adult trade profile and place layer: PASS. Eleven focused owner tests; final rebuilt browser exercises school tuition, both descriptor spells, borrowed wand use/return and adult repair/travel/sale/restock/debt, with persistence for both lives. `slice-4.json`.

## Checks

- `node --test tests/world_pack_hp.test.js`: PASS 11/11 final; earlier slice counts 7, 8 and 9. Native opt-in, legacy expansion load, school timing/completion/refund, real XP, method support, loan custody, material/cash conservation, travel, and local clock covered.
- `node scripts/hp_world_browser.cjs 1`, then `2`, then `3`: PASS sequentially on each rebuilt slice. Each uses a fresh context, actual native controls, Save/reload/Export/literal Import and pre-entry default-save import. Intermediate screenshots are superseded by final matrix images.
- `node scripts/hp_world_browser.cjs 4`: PASS both lives, final desktop matrix 1920×1080 and 1536×864 at native saved 14/21 px, no horizontal page overflow, zero page errors. Includes school wand loan/use/return and both spell targets, then adult repair, arrival, sale, purchase and rent settlement. Exact HP player/body/knowledge/power/inventory projection survives reload and literal import. Console/resource failures were not the harness assertion: this checkout lacks private-font and private-manifest files. Font family acceptance remains human review.
- Imported-state assertions: PASS actual native Literacy XP 5, adult purse 8/debt 0/till 24, merchant fragment sets 5/panes 1, closed school wand loan. Input hashes and built bundle hash: `final-inputs-and-imported-state.json`.
- `git merge --ff-only master`: Already up to date, master `3dfc49cf3422c0262d86810df47459f53f3a4a67`. Local worktree metadata needed sandbox elevation. No master mutation.
- `npm run build && npm test`: build PASS; the one full test invocation completed 2,878/2,882 PASS, four failures exclusively `listen EPERM` in browser tests because it was launched inside the sandbox. Full log `/tmp/hp-d7-full-tests.log`.
- `node --test --test-concurrency=1 tests/cheat_awakening.test.js tests/cheat_cards.test.js tests/rt_slice1_fixtures.test.js` with local-port access: PASS 9/9, clearing all four failed cases without a second full-suite invocation. Includes existing actual native old-save/create_save/import coverage. Log `/tmp/hp-d7-port-recheck.log`.
- `npm run check:arch`: PASS. main.js 10,115/baseline 10,115, display.js below baseline, no new cycles/main imports. Log `/tmp/hp-d7-arch.log`.
- `npm run check:rules`: PASS, zero warnings. No rulebook changed; no extra rule-behavior run required. Log `/tmp/hp-d7-rules.log`.
- `git diff --check` on source/docs/test scope: PASS. PROJECT/USER_VISION zero-loss check: 0 missing old nonblank lines in both files.


Shared-file overlap extension: primary `src/simulation_effects.js` and `src/structured_pack_runtime.js` checked before edits; see status recorded below. HP adds one fact projection and one calendar read model, no shared state.

Slice 2 overlap status: primary `src/simulation_effects.js` dirty; `src/structured_pack_runtime.js` clean. Merge the small HP fact hook with the other lane’s additions. Test-fixture correction: native XP requires an enabled skill record, not a scalar; focused fixture now uses the real gameplay snapshot shape.

## Final scope and playable steps

On this branch, rebuild (`npm run build`) and serve the worktree on assigned port 5107.
Open a fresh disposable browser profile at:

- School: `http://127.0.0.1:5107/?structured_candidate=book.hp.school`
- Adult trade: `http://127.0.0.1:5107/?structured_candidate=book.hp.trade`

Click PLAY, open **Beginning** from workspace navigation and click **Begin**.
School: attend introductory charms during the opening morning, practice levitation,
use it on a feather; borrow/return the practice wand; take the optional glass-repair
instruction and practice/use it. The calendar and actual costs appear in the panel.
Adult: repair a pane, walk to the glass counter, sell it, buy fragments or settle rent;
walk back to continue. Save, reload, Export and literal Import retain the same life.
Use separate disposable saves for these mutually exclusive native beginnings.

Existing default saves are not enrolled automatically. Existing Polyjuice commands,
recipe/source identity and native payload revision remain unchanged; the outer HP
pack revision is 2, save-compatible from 1. Final structured life receipts retain
strict exact-content hashes. Intermediate D7 authoring snapshots were not released
save formats; final proof uses the final pinned definitions. Native carried cargo
and Frontier coins remain under the structured-start owner, separate from the local
HP purse. This is an authoring entry, not a proved ordinary cross-world journey.

Target screenshots were inspected at 1920×1080 and the 1536×864/21px floor. Controls
remain in the existing scrollable beginning panel; mobile is deferred. The source,
built browser and persistence gates are verified. Director play/visual acceptance
is open. Master integration, packaging, installed adoption and publication are not
performed by D7. Generated dist/index build changes are excluded from the branch
commit and must be rebuilt after integration.

## Merge ownership and next slices

Primary overlap: `src/main.js` and `src/simulation_effects.js` were dirty when checked.
The HP changes are a two-line registration hook, one fact projection, and a small
calendar/read-model join. `src/structured_pack_runtime.js`, `src/world_calendar.js`,
HP source/test/owner docs and the systems-map file were clean in primary when checked.
Primary PROJECT/USER_VISION are concurrently dirty: merge only D7's dated appended
request/runtime-candidate hunks; preserve their later primary content. No LOTM file
changed. Branch-only delivery follows W4; coordinator owns integration, no push.

More-to-consider is saved in the existing [HP brief](../../../worlds/harry-potter/WORLD_BRIEF.md#more-to-consider-d7-round-1), HP-D7-X1–X5. Next slices, proposals:

1. HP-D7-X3: supply-week arrival, natural life selection and qualified guardian/cargo handling.
2. HP-D7-X4: second-term lesson, assessment, subject practice and holiday return with native readers.
3. HP-D7-X5: a source-qualified potion lesson using existing material/brewing owners.
4. Extend the place layer with access, witnesses, finite suppliers and independent ordinary work.

Stop condition reached: four selected first slices verified in order, final desktop
matrix complete, one full-suite invocation plus focused environmental repairs,
next slices recorded. This is not a full-world completion claim.

D7 server: Python PID 80963, exec session 46296, assigned port 5107; stopped after final proof. Browser workers finished. Intermediate screenshots are historical raw captures; the inspected final slice-4 matrix is authoritative.
