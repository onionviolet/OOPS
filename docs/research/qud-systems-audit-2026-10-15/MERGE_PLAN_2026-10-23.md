# Qud parity lanes G1-G7: merge plan (2026-10-23)

Plan only; nothing is merged. Lane scope and rationale: [YAIR_PARITY_GAP_2026-10-23.md](YAIR_PARITY_GAP_2026-10-23.md). Every lane is uncommitted in its worktree under `.claude/worktrees/`, cut from `d8af620f2`. Master is now `547209e82` (5 newer commits), and the primary checkout is dirty.

## Lane inventory (non-generated files only)

| Lane | Worktree | New files | Edited files |
|---|---|---|---|
| G1 | qud-g1-reference-123844 | `craft_reference.js`, test | `main.js`, Village crafting panel files |
| G2 | qud-g2-rank-4363ba | `faction_rank.js`, test | `display.js`, `main.js`, `reputation.js`, `skill_expansion_content.js`, `skill_expansion_host.js`, `titles.js` |
| G3 | qud-g3-fetch-6ccc86 | `story_request_unique.test.js` | `story_requests.js`, `generated_people_ui.js`, `items.js`, `main.js`, `lore_history_view.js` |
| G4 | qud-g4-implants-cb17f7 | `implant_service.js`, `source_suppliers.js`, `temporary_construct.js`, test | `backlog_expansion_body.js`, `capabilities.js`, `simulation*.js`, `structured_ability_runtime.js` |
| G5 | qud-g5-history-57e13f | `world_history_consumers.js`, test | `chronicle.js`, `generated_people.js`, `generated_people_ui.js`, `lore_history_state.js` |
| G6 | qud-g6-naming-69da15 | `item_description.js`, `naming_act.js`, `naming_achievements_ui.js`, `relic_generator.js`, test, browser script | `items.js`, `name_grammar.js`, `ui_extras.js`, `main.js` |
| G7 | qud-g7-fields-66ba3f | `field_layer*.js` (4), design doc, test, playtest script | `native_tool_domains.js`, `docs/RULES_INDEX.md` |

## Overlaps and risks

- **R1 master moved.** Commit `8c9cc54db` ("world history") put `deriveWorldHistory` into HEAD. G5 applied the earlier dirty diff of that same function as its base, so G5's `lore_history_state.js` and `chronicle.js` edits will conflict with or duplicate HEAD. Resolve by taking HEAD's version and re-applying only G5's consumer hunks.
- **R2 primary is dirty.** `src/display.js` and `src/lore_history_state.js` carry another chat's uncommitted edits. G2 edits `display.js` and G5 edits `lore_history_state.js`. Commit or park those first (their owner decides); do not stash or reset (shared-worktree rules).
- **R3 file overlaps between lanes.** `src/main.js` (G1, G2, G3, G6), `src/items.js` (G3, G6) and `src/generated_people_ui.js` (G3, G5). Expect small hunk conflicts, mostly wiring lines. G2 and G6 may also touch `titles.js`.
- **R4 generated files.** Lanes G2 to G5 and G7 carry rebuilt `dist/` and `index.html`. Do not merge those; rebuild once after the last merge.
- **R5 lane gaps left open.** G1 attribute-point grants (needs an attribute owner outside G1), G2 and G5 no rendered screenshot, and G7 four items it could not close (see its report). Carry these as acceptance-backlog entries, not merge blockers.
- **R6 verification so far.** Each lane ran only its focused test plus build, `check:arch`, `check:rules` and a headless browser flow. No full `npm test` has run on any combination.

## Order

1. Resolve R2 with the owner of the dirty primary changes, then work from a clean tree (or a fresh integration worktree off current master, per [shared worktree practice](../../gm/SHARED_WORKTREE_PRACTICE.md)).
2. Merge in this order, lowest overlap first, running each lane's focused test after each merge: G7, G4, G1, G2, G5, G3, G6. G5 goes before G3 and G6 goes last because they share `generated_people_ui.js` and `items.js`.
3. Per lane: copy the lane's source and test files, apply its hunks to shared files by hand against current master (R1 for G5), skip `dist/` and `index.html`.
4. After the last lane: `npm run build`, then `npm test` once, `npm run check:arch`, `npm run check:rules`, and one headless pass at a laptop viewport over the lane journeys (G1 reference craft, G2 lesson, G3 request, G6 naming, G7 spill and fire).
5. Update PROJECT.md summary, RULES_INDEX rows and AD lines for each lane in the same change; run the shared-doc zero-loss check before committing.
6. Commit each lane's own paths separately from fresh HEAD with a guarded update. Push waits for Weibao's yes. No Co-Authored-By trailer.

## Gates

Authoritative: the single full `npm test` after the integrated build. Per-lane focused results do not stand in for it.

## Integration successor (authorized 2026-10-23)

Weibao authorized one fresh Sonnet coordinator to build a local, reviewable integration candidate. Not authorized: commits, pushes, publication, installs, personal-save changes.

- **Successor:** session `local_9fd79681-810e-4ee4-8ab3-43179024d7d2` (`qud-integration`), isolated worktree on branch `qud-integration` cut from master `547209e82`. Start confirmed by the session tool; first turn running at the time of writing.
- **Inputs:** the seven lane worktrees under `.claude/worktrees/` (all cut from `d8af620f2`, uncommitted), preserved untouched. The successor records per-file SHA256 receipts in `INTEGRATION_INPUTS_2026-10-23.json` in its worktree.
- **G5 rule:** keep master's `deriveWorldHistory` owner (`8c9cc54db`), re-apply only G5's consumer hunks.
- **Excluded from edits:** the primary checkout and its dirty files, the complementary-journeys and overarching-reconciliation dispatch folders, `src/gear_work.js`, `src/heir_inheritance.js`, `styles/material_icons.css`, `tests/ui_contract_allowlist.json`, `desktop/*`, `package.json`, PROJECT.md routing hunks and USER_VISION entries.
- **Remaining gaps going in:** G1 attribute-point grants; G7 four unclosed items; no rendered screenshots for G2 and G5; no combined build or full `npm test`.

## Integration result (candidate, 2026-10-23)

- **Owner:** coordinator session `local_9fd79681-810e-4ee4-8ab3-43179024d7d2` (`qud-integration`, successor id; started by `local_ebdb65bf-9fcb-45bc-9f59-0d7bfb3fcd13`), worktree `.claude/worktrees/qud-integration-c0781f`, branch `claude/qud-integration-c0781f`, cut from master `547209e82`. Nothing is committed, pushed or installed. The seven lane worktrees were only read.
- **Input identities:** [INTEGRATION_INPUTS_2026-10-23.json](INTEGRATION_INPUTS_2026-10-23.json) (master hash, per-lane tracked-diff SHA256, untracked-file SHA256). Patches were applied with `git apply --3way` against master; dist/ and index.html were never copied, only rebuilt.

### Files per lane
- **G7:** `field_layer*.js` (4), test, design doc, `scripts/playtest/fields-continuity.mjs`; `native_tool_domains.js`. G7's `docs/RULES_INDEX.md` hunk was NOT applied (reserved); its row is under proposed updates.
- **G4:** `implant_service.js`, `source_suppliers.js`, `temporary_construct.js`, test; `backlog_expansion_body.js`, `capabilities.js`, `simulation*.js` (3), `structured_ability_runtime.js`.
- **G1:** `craft_reference.js`, `craft_reference_content.js`, test, `scripts/reference_browser.cjs`; `crafting_domain.js`, `crafting_frontier_runtime.js`, `crafting_home.js`, `crafting_native_items.js`, `main.js`.
- **G2:** `faction_rank.js`, test; `display.js`, `main.js`, `reputation.js`, `skill_expansion_content.js`, `skill_expansion_host.js`, `titles.js`.
- **G5:** `world_history_consumers.js`, test; `chronicle.js`, `chronicle_ui.js`, `generated_people.js`, `generated_people_ui.js`.
- **G3:** `heirloom_items.js`, `story_request_unique.test.js`; `story_requests.js`, `generated_people_ui.js`, `items.js`, `main.js`, `lore_history_view.js`, plus `material_lineage_domain.js` and `models/hero.js` (not in the plan inventory).
- **G6:** `item_description.js`, `naming_act.js`, `naming_achievements_ui.js`, `relic_generator.js`, `achievements.js` (see gaps), 2 tests, `scripts/naming_relics_browser.cjs`; `items.js`, `main.js`, `name_grammar.js`, `ui_extras.js`.
- **Integration-only edits:** `src/layout_spec.js` (surface rows for `fields` and `naming`), `styles/ui_extras.css` (`.data_entry_feeling` rule replacing G2's inline cssText in `display.js`), `src/progression_gates.js` (baseline copy, below).

### Conflicts and resolutions
- **G7 `native_tool_domains.js`:** master added `configureAgingContact`; kept both configure calls.
- **G1 crafting (4 files):** master's crafting-depth wave (depth owner, standing/grudge, rough-batch failure, overdose) overlapped G1's reference code. Kept master's logic and added G1's `REFERENCE_CARRIER`, the acquire/return/learn/read/examine request branches, `checkMethod` before `resolveBatch`, the `references/shelf/methods/examinable` projection keys, and the shelf/method/sample UI. The return value carries both master's `batch/failure/depth/overdose` and G1's `grant/outcome`. The run notice shows G1's outcome text first, then master's.
- **G5 `lore_history_state.js`:** lane copy byte-identical to master's committed `deriveWorldHistory` version, so G5's hunks were dropped. `chronicle.js`: re-applied G5's `ensureWorldHistory` on enroll and `read_mural` command beside master's new `remember` command.
- **G3 `items.js`:** union of imports (`heirloomText` from master, `parseHeirloomKey` from G3). **G6 `items.js`:** G6's `addDescriptionClauses` replaces the one-string description; master's `heirloomText` line is kept as a separate `history` clause with source `heirloom`. **G6 `main.js`:** `mountWorkspaceNavigation` ports now carry master's `villageCareer` plus G6's `refreshGear` and `logAchievement`.
- **G2 vs G6 `titles.js`:** no conflict.

### Baseline problems found in master (not caused by the lanes)
- **B1:** master `547209e82` imports `src/progression_gates.js` from tracked `pledges.js` and `pledges_content.js`, but that file is untracked in the primary checkout. A clean checkout of master cannot build. Copied it read-only into the candidate (SHA in the inputs JSON). Whoever owns the dirty primary must commit that file.
- **B2:** `.gitignore` line 2 (`achievements.js`) ignores any file of that name, so G6's `src/achievements.js` is invisible to `git status` and the lane's untracked listing. It was copied by hand. A G6 commit needs `git add -f` or a rename or a narrower ignore rule (Weibao's call).

### Zero-loss check
Every added line of each saved lane patch (except G7's RULES_INDEX row) was searched in the candidate file: G3, G4, G5, G7 verbatim; G1 (7 lines), G2 (1) and G6 (1) differ only where a hunk was hand-merged as recorded above (G2's inline cssText moved to CSS). All lane-new files are byte-identical to the receipts in the inputs JSON.

### Checks (AD36, one line each)
- Lane focused tests after each port: G7 19/19, G4 11/11, G1 7/7 (plus crafting set 60/60), G2 8/8, G5 1/1 (chronicle, lore, generated people 28/28), G3 20/20, G6 9/9.
- `npm run build`: passed (rebuilt twice; dist/ and index.html changed, not integrated by hand).
- `npm test` once: 2718 tests, 2716 pass, 2 fail (`ui_contract`: G2 inline cssText/spacing/type in `display.js`; `fields` and `naming` panels lacked LAYOUT_SPEC surface rows). Fixed in the integration-only edits above; `tests/ui_contract.test.js` rerun 3/3. No second full run, per AD36; the fix is a focused-test claim only.
- `npm run check:arch`: pass (main.js growth 0). `npm run check:rules`: pass with one warning (G7 design doc untracked).
- Headless rendered evidence: see [integration-evidence/RECEIPTS.txt](integration-evidence/RECEIPTS.txt). Screenshots: `g7/*`, `g1/*`, `g6/*`, `combined/*`, `component/*`.

### Remaining gaps
- **G1:** attribute-point grants still need an attribute owner outside G1.
- **G7:** the four items the lane could not close (see its report; not re-opened here).
- **G2 and G5 inside the full app:** the lesson row and the mural were rendered by real panels with real engine state in a minimal page (`component-harness.mjs`), not in the full app. A seeded save never opened the notebook People or skills panel. G2 rank text was rendered in the full app (Data tab).
- **G3:** the unique-request row has no rendered check. One full-app attempt (Travelers panel, fixture seed) did not show the button within 6s; left as a gap (engine tests only). **G4:** no player-facing UI, engine tests only.
- **Rule gates not run:** `npm run check:rule-behavior` (no rule changes were made by this pass).
- **Verification state:** full suite at pre-fix input (2716/2718), then the 62 tests in the 8 files that reference `layout_spec`, `display.js`, `ui_extras` or the field layer all pass at the final input. No second full run, per AD36.

### Proposed owner-doc updates (not applied; reserved paths)
- PROJECT.md: one summary line per lane G1-G7 with the candidate branch, and the open gaps above.
- docs/RULES_INDEX.md: add G7's router row verbatim: `| Gas, fire, smoke, spill, spread, gravity or fall, force fields, anything that lives in a place and changes by itself with time | AD38, AD22, AD15–AD17, AR1–AR8, AR14, MR1, SR22 | [Physical field layer design](PHYSICAL_FIELD_LAYER_DESIGN_2026-10-23.md) (proposal; first slice fire and fumes in a loaded place, `src/field_layer*.js`) |`. Then add G1 (reference shelf), G2 (rank ladder dials), G3 (unique request), G4 (supplier/construct), G5 (world-history consumers), G6 (naming, item description clauses) register rows and any AD lines after Weibao accepts the proposals. Note B2 for the `.gitignore` decision.
- docs/USER_VISION.md: no new direction was set by this pass; nothing proposed.
- Parity-gap doc link above points at the primary's untracked `YAIR_PARITY_GAP_2026-10-23.md`; it is not copied here.

### Peer offers received after the candidate was built (not applied)
- **D1 progression-gates package** (`docs/gm/dispatch/progression-gates-2026-10-23/d1-package/`, receipt `b6965629...`): its `src/progression_gates.js` is byte-identical (sha `3e7cf495...`) to the baseline copy already in this candidate, so B1 is covered. The rest (7 tracked patches including `display.js`, `reveal_chain.js`, `chain_inspector*.js`, plus 5 more new files) is outside the G1-G7 authorization and would need a rerun of the combined gate. `display.js` would overlap G2's hunk.
- **R3 learned-herb fix** (`overarching-reconciliation-2026-10-23/r3-learned-herb-fix.patch`): depends on D1; touches `chain_inspector.js` and its test only. Not applied.
- Decision for Weibao or the parent coordinator: integrate D1 then R3 into this candidate (then rerun build and one full `npm test`), or keep them as separate lanes.
- **D3 original-world overflow pilot** (`progression-gates-2026-10-23/D3_REPORT.md`, `d3-overflow.patch` sha `567750f3...`, plus `d3-skill_overflow_domain-hunk.txt`): UNSELECTED peer offer (Weibao authorized only D1, R3 and the conditional estate label; D3 note appended by the prior owner before the transfer, kept as record). Proposal, applies after D1 and R3, touches `src/main.js` (p00NativeSkillXP hunk, net zero lines) and D1's `skill_overflow_domain.js`. Not applied.

## QUD closure (2026-10-23)

- **Owner:** closure coordinator, Claude Sonnet 5.5, session transcript id `4c5724e2-baab-4606-86b8-d4bfad1a1d79` (started by `local_ebdb65bf-9fcb-45bc-9f59-0d7bfb3fcd13`; it does not appear under a `local_` id in the session list). It took over this worktree exclusively; prior owner `local_9fd79681-810e-4ee4-8ab3-43179024d7d2` was idle in the session tool and sent a handover note. Nothing committed, pushed, installed or published; no personal saves touched; headless browsers only.
- **Takeover identity (step 0):** HEAD `547209e82c29e897e6b602a4ef5d8e8ab46b3ebf`; per-file hashes in [closure-step0-hashes.txt](integration-evidence/closure-step0-hashes.txt). Final inputs: [closure-final-hashes.txt](integration-evidence/closure-final-hashes.txt) (tracked-diff and untracked SHA256 prefixes plus bundle).
- **Release inputs** (copied read-only from the primary into [closure-inputs/](closure-inputs/), SHA256 prefixes): D1 receipt `b6965629`, `d1-package/patches/ALL_TRACKED.patch` `e0663ccf`, `r3-learned-herb-fix.patch` `62403825`, `estate-label-proposed.patch` `3cf68ae4`, `SUPERSEDED_ESTATE_STATUS.md` `93eb871f`, `D1_REPORT.md` `e3723c19`; full list in that folder.

### Decisions
- **D1 integrated** (`ALL_TRACKED.patch` applied with `git apply`; five new files copied; `progression_gates.js` byte-identical). The `display.js` hunks did not overlap G2's rank hunk textually, so no hand merge was needed; G2's rank/feeling text still renders (full-app proof below).
- **R3 integrated separately** after D1 (it does not apply before D1). Touches `chain_inspector.js` and its test only.
- **Estate label included.** Reason: the status doc and the complementary CHECKPOINT record an explicit narrow release of the `heirLeftoverLines` label callback, the `previewHeir` call site and one regression; this candidate consumes `heirLeftoverLines` at `main.js` `previewHeir`; the exact patch applied cleanly. Its own isolated desktop proof is the lane's; this candidate's heir test passes in the full suite.
- **D3 not applied** (unselected, see peer offers).
- **Wiring fix (G4):** shipped content had no entry for temporary constructs or a second supplier of one source. Added two actions in `src/backlog_expansion_body.js`, family `device`: `backlog.body.copy_brass_lung` (needs BL-01 installed and one log; 30-minute copy holding the log, second supplier `construct:backlog.brass_copy` of the brass source) and `backlog.body.dismiss_brass_copy`. Remove BL-01 is refused while the copy lives ("Let the lung copy go before removing BL-01; the copy keeps the source alive."), because the loose-specimen validation forbids an installed-looking source after removal; relaxing that validation was not done. Regression extended in `tests/source_suppliers_constructs.test.js`.
- **Register row:** `docs/RULES_INDEX.md` here gained the identical `Progression gate rules` register row that the primary's uncommitted index already holds (needed for `check:rules` since D1 adds `PROGRESSION_GATE_RULES.md`). Nothing was written to the primary; the merge of identical text is a no-op.
- **UI contract:** G2's inline cssText stays in `styles/ui_extras.css`, `fields` and `naming` rows stay in `src/layout_spec.js`; `tests/ui_contract.test.js` passes inside the full run.
- `src/achievements.js` remains gitignored (`.gitignore` line 2): kept in the candidate, not committed (packaging receipt gap B2).

### Full-app proofs (headless, fresh origin per journey, 1920x1080 and 1536x864, Save/reload/Export/literal Import canonical-equal after each changed state)
- Workers (Sonnet, no source writes): `adc66af89403ca8a9` (G3, G5; own server/origin, folder `integration-evidence/closure-g3g5/`) and `a984ecbbe35aa414b` (G4, G2; folder `integration-evidence/closure-g4g2/`). I re-ran the G4 copy scenarios myself on the final bundle.
- **G3** Travelers panel: raise, take, report lost, reclaim (3 coins), deliver (+10), and early acquire ("you already had it", stack untouched) then deliver. PASS. (The earlier timeout was a collapsed `<details>`.) Note `closure-g3g5-receipt.json` was overwritten by the later G5-only run; G3 evidence is the `g3-*` screenshots.
- **G4** panel "Optional lives and local experiments": BL-01 buy/install/remove; copy made (records line plus two suppliers); remove refused with reason while the copy lives, then dismiss and remove; early dismiss; expiry after 35 minutes with the lung installed (log returns). PASS (`g4-receipt.json`, `g4b-*-receipt.json`).
- **G2** Data tab "Neighbour (60)" with feeling line; skills Practice lesson row "Learn Shared inquiry at a neighbour's price" costing 1 coin (full-price row absent; 2 coins at reputation 0). PASS (`g2-receipt.json`).
- **G5** notebook (More panels select) People view: "Read the village mural" clicked in real UI; mural text shown. PASS. Reaching the notebook needs a familiar save (chronicle plus world history) and a stepped clock.

### Gate (one run, final stable source; source untouched after except the docs register row)
- `npm run build`: pass.
- `npm test`: 2729 tests, 2729 pass, 0 fail ([closure-gate-npm-test.txt](integration-evidence/closure-gate-npm-test.txt)).
- `npm run check:arch`: pass (display.js growth -43).
- `npm run check:rules`: first run failed (no register row for `PROGRESSION_GATE_RULES.md`), pass with one warning (untracked doc) after the row was added; docs-only change, suite not rerun.
- `npm run check:rule-behavior`: not run (no rules changed by this pass).
- Verification state: source edits, full local suite and headless full-app proofs. Not committed, not installed, not human-accepted.

### Remaining gaps
- G1 attribute-point grants and G7's four unclosed mechanisms (named backlog, out of scope).
- At 1536x864, a workspace `role=separator` / `.shell-resize-handle` overlay blocks a normal click on the elder's `hello` textline right after a viewport resize (workers used dispatched click or Enter). Not investigated.
- G4 construct and copy are a minimal brass-lung proof, not a general content catalogue; Remove is refused while a copy lives.
- Packaging: gitignored `src/achievements.js` (B2); untracked D1 and G-lane files must be added deliberately; `dist/` and `index.html` are rebuilt outputs.
- Pre-existing `check:rules` warning: `docs/PROGRESSION_GATE_RULES.md` and the G7 design doc are untracked.
- Mobile deferred. Human taste/pacing acceptance not done.

### Owner-doc proposals against the current primary docs (read-only; none applied here)
- PROJECT.md (primary has an uncommitted Progression gate rules paragraph near line 505): add one line each for G1-G7 plus D1/R3/estate label with this branch and the gaps above.
- docs/RULES_INDEX.md (primary already has the Progression gate rules register row and router row): still to add G7's router row (verbatim under Proposed owner-doc updates above) and register or router rows for G1 reference shelf, G2 rank dials, G3 unique request, G4 supplier/construct/implant, G5 world-history consumers, G6 naming and description clauses; decide the `.gitignore` rule for B2.
- docs/USER_VISION.md: none.
- GAP_AUDIT: `docs/gm/dispatch/claude-coordinator-continuation-2026-10-23/GAP_AUDIT.md` is not in this worktree; the proposed update is [GAP_AUDIT_PROPOSED_HUNK_2026-10-23.md](GAP_AUDIT_PROPOSED_HUNK_2026-10-23.md).
