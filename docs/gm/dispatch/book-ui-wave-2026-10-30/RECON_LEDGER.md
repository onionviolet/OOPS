# Reconciliation ledger (bk-recon, 2026-10-30)

Current state, not history: replace rows when they change. Lane `bk-recon` of the [Book UI and feature wave](PLAN.md#round-2-more-to-consider-2026-10-30-144x) (round 2 F1). Snapshot taken about 15:00 on master `e90e12a1`, then moved on by other sessions (HEAD was `14b99beee` at the last look). Everything below is a proposal for owners; nothing was merged, deleted or reset. Rules: AD36, AD43 (floor), AD42, shared worktree practice.

**How states were judged.** `landed` = branch tip is an ancestor of master, or every commit's patch-id (`git cherry`) or exact subject is on master (the integrator rebased many branches, so hash equality alone under-counts). `unlanded` = neither. Subject matching proves the commit message landed, not that every hunk did; the cleanup batch therefore stays a list for Weibao's yes. "Below floor" rows come from the receipts' own words; I did not re-prove the wiring state of each lane, so each owner confirms that in its next step. The private `docs/research/novels` and `private_packs` entries that show as untracked in every worktree are ignored (shared private data, not strays).

## Counts (snapshot)

| Kind | Rows | landed | unlanded | in progress | abandoned |
| --- | ---: | ---: | ---: | ---: | ---: |
| worktree + branch (42 non-primary worktrees; 21 unmerged branches at snapshot) | 42 | 32 (17 proven, 14 by subject, 1 detached) | 2 (RC1, RC8) | 8 | 0 |
| uncommitted diff on primary master (25 modified, ~1,320 untracked) | 11 groups | | 11 | | |
| patch files (about 150 total) | 5 rows (RC55-RC59) | | 9 candidates + 1 stale group | | |
| below-floor slice groups | 12 | | | 12 | |
| read-model-only slice group | 1 | | | 1 | |
| idea intake files | 2 | 1 folded | 1 partly | | |

Patch note: re-run `git apply --check -R <patch>` before acting. About 100 older patches are historic evidence: reverse-apply fails because the shared files moved on. They are not strays unless an owner says otherwise (RC59).

## Owner key

| Short | Session | Id | State at snapshot |
| --- | --- | --- | --- |
| Book UI | Book UI and feature wave (this wave's coordinator) | `local_5f1a142a-0422-4d34-963f-0e7ec47c9bae` | idle |
| GenUI | General UI improvements (representation branches) | `local_67a1ca1a-cc14-43a3-9cdf-f9804e1db97e` | idle |
| Sonnet | Coordinating Sonnet workers (`sw-*`) | `local_9346d8a9-0d9a-44c8-ac9a-9f2b57cd710a` | running |
| Indexing | Book indexing and re-read strategy | `local_82a9ce30-1520-453e-9072-098132c5f619` | idle |
| floor-wire | Floor wave: wire and browser-prove | `local_97d3526c-5987-4205-aac9-028a22ff0fab` | running |
| ui-defects | Fix player-facing UI defects | `local_2ad52aaa-bb98-43a7-884f-520482f9f691` | idle |
| sw-bridge | Read-model bridges (L13) | `local_3791f23c-7a71-4b21-87cf-278a2f23bf07` | running |
| sw-adv | Advancement ladder (L10) | `local_f6af9e74-06a3-4305-bcb1-a98a516bfc2b` | idle |
| perf-waits | Long-wait crash and pack load time | `local_6527fb70-aafa-4629-a351-056ab8ecfb6b` | running |
| p3c-memory | P3c severity, loyalty, keeping quiet | `local_ceb93fd1-fae1-427c-b4cd-c9dbba2780f6` | running |
| p4-fights | P4-P8 fights on a speed clock | `local_26a3b19b-4af1-4566-b7e0-87d5404cb560` | idle |
| rep-abilities | Abilities representation | `local_73042651-767d-4388-b6e2-e59777fbb096` | running |
| rep-relationship-web | Relationship web representation | `local_e49b54e2-c481-44cf-a354-37c8410e9db5` | running |
| bk-coi / bk-hp / bk-mol / bk-ss / bk-party / bk-gaps | this wave's lanes | `…e5b97cf8` / `…d1efbe67` / `…cb3c2927` / `…e09ffb8b` / `…02186e56` / `…ca305716` | see rows |
| codex | Codex carry-out queue lanes (no Claude session; abandoned rows route to Book UI) | none | none live |

No live session was found for the other 18 `rep-*` worktrees; their sessions are archived or ended. They are routed to GenUI.

## 1. Book UI wave lanes (owner: each lane; escalation: Book UI)

Every lane ends at the floor or writes "implemented, below floor" plus a line here (PLAN round 2). Each owner also lists any uncommitted file it holds and commits own paths only.

| Code | Kind | Evidence | State | Owner | Next step and done check |
| --- | --- | --- | --- | --- | --- |
| RC1 | worktree + branch | `.claude/worktrees/bk-coi-8a8143`, branch `claude/bk-coi-8a8143`, 1 commit `205df106` ("COI needs per representation…") not on master by patch-id or subject; 3 uncommitted | unlanded, in progress | bk-coi `…e5b97cf8` (idle) | Land the commit on master (own paths) or hand to Book UI. Done: `git cherry master claude/bk-coi-8a8143` empty, worktree clean. |
| RC2 | worktree | `bk-hp-83e61f`; `src/read_models/hp_charm_bridge.js`, `tests/hp_charm_bridge.test.js` untracked, `src/book_world_hp_facts.js` modified | in progress | bk-hp `…d1efbe67` (running) | Commit slice or checkpoint to Book UI with floor state. Done: files committed, receipt line says floor or "below floor". |
| RC3 | worktree | `bk-mol-ceda03`; untracked `src/book_world_mol_access*.js`, `src/institution_access.js`, `src/loop_table.js`, 2 tests, `scripts/mol_access_browser.cjs`; `src/lives_carry_domain.js` modified (10 paths) | in progress | bk-mol `…cb3c2927` (idle at snapshot) | Same as RC2. Done: committed, host registration patch sent to floor-wire (single writer). |
| RC4 | worktree | `bk-ss-6f266e`; untracked `src/ascension_paths_ss.js`, `src/structured_ladder_view.js`, `src/world_packs/book_shadow_slave_trial.js`, test; 4 `structured_pack_*`/`book_world_beginning_registration.js` modified (10 paths) | in progress | bk-ss `…e09ffb8b` (running) | Same as RC2. |
| RC5 | worktree | `bk-party-ae89b6`; 8 uncommitted at last look | in progress | bk-party `…02186e56` (running) | Same as RC2; consume `tempo_allies` (see RC38 first: it is untracked on master). |
| RC6 | worktree | `bk-gaps-c82fdb`; clean | in progress | bk-gaps `…ca305716` (running) | Route its gap list to owners with a ledger line. |
| RC7 | merge hazard | all six `bk-*` worktrees sit on `c8244211`, the commit whose index.html dropped 11 stylesheets (master later restored them) | open risk | Book UI | Each lane rebases onto current master before any merge; merge owner verifies `styles/manifest.txt` and `index.html` links survive. Done: no `bk-*` diff touches `index.html` stylesheet links. |

## 2. Representation branches and worktrees (owner: GenUI; merge owner: GenUI)

Twenty `rep-*` worktrees. Subject matching shows every commit but `46860a01` is on master (integrator rebase); `git cherry` is empty for economy, first-hour, items and mixing, and `rep-abilities` is now an ancestor.

| Code | Kind | Evidence | State | Owner | Next step and done check |
| --- | --- | --- | --- | --- | --- |
| RC8 | worktree + branch | `rep-character-sheet-860fe6`, 3 commits behind master in patch-id; `46860a01` "drop duplicated gallery stylesheet link" (1 line in `figure-gallery.html`) matches no master subject; clean | unlanded | GenUI | Cherry-pick `46860a01` if the link is still duplicated on master, else mark obsolete. Done: `git grep` for the duplicate link is clean on master and branch is in the cleanup batch. |
| RC9 | worktree + branch | `rep-abilities-6f77c2`: tip now an ancestor of master (ghost-fill host patch applied in `14b99beee`); 5 uncommitted | in progress (live) | rep-abilities `…73042651` | Finish or checkpoint the uncommitted slice (RS1-RS24 round 3 and G17 Skills tab per PLAN F2). Done: clean worktree, receipt line. |
| RC10 | worktree + branch | `rep-relationship-web-1adecf`: staged snapshot of ~1,370 files at snapshot (looked like master's tree staged onto an old HEAD), re-committed 3 minutes before the last look | in progress (live) | rep-relationship-web `…e49b54e2` | Confirm the branch tip is a clean fast-forward of master (no 100+ file stray commit) before it merges; G18 `whoKnows` next per PLAN F3. Done: `git diff --stat master…branch` lists only relationship files. |
| RC11-RC12 | worktree + branch (2) | `rep-items`, `rep-mixing`: `git cherry master` empty (every commit's patch-id is on master); only regenerable build-output diffs (`dist/item-card-gallery.*`, `dist/bundle.js(.map)`, version-hash lines in `index.html`) | landed (proven by patch-id) | GenUI | Cleanup batch CB-P. |
| RC13-RC14 | worktree + branch (2) | `rep-economy`, `rep-first-hour`: `git cherry` empty; clean | landed (proven by patch-id) | GenUI | Cleanup batch CB-P. |
| RC15-RC21 | worktree + branch (7) | `rep-organizations`, `rep-research`, `rep-rituals`, `rep-talk`, `rep-time`, `rep-crafting`, `rep-worlds`: commit subjects on master, patch-ids differ and whole-diff reverse check fails (later edits overlap); first five carry only regenerable build-output diffs | landed by subject only | GenUI | Cleanup batch CB-S: GenUI confirms nothing unique remains (diff each branch's own files against master), then Weibao's yes. |
| RC22-RC27 | worktree + branch (6) | `rep-body`, `rep-combat`, `rep-family-tree`, `rep-knowledge`, `rep-maps`, `rep-spacetime`; clean; subjects on master, patch-ids differ | landed by subject only | GenUI | Cleanup batch CB-S, same check. |
| RC28 | worktree + branch | `great-ritchie-bf0b79`: 3 commits all on master by subject (LOTM walk report_in); clean; no session found | landed by subject only | Sonnet (LOTM walk was sw-wire territory) | Cleanup batch CB-S. |
| RC29-RC31 | worktree + branch (3) | `lotm-entrance` (`709f8f05`), `m2-blocked-reasons-3cdb2b`, `ui-integration-8e9e92`: ancestors of master, clean | landed (ancestors) | GenUI | Cleanup batch CB-P. |

## 3. Codex carry-out queue worktrees (owner: none live; accountable: Book UI to ask Weibao)

| Code | Kind | Evidence | State | Owner | Next step and done check |
| --- | --- | --- | --- | --- | --- |
| RC32-RC41 | worktree + branch (10) | `.codex/worktrees/q1,q2,q3,q6,q7,q8,q10,q11,q12,q15`. All branches are ancestors of master. Untracked `carry-out-queue-2026-10-26/` copies of files tracked on master; q3, q6, q8 hold files that landed (`scripts/check_doc_slips.mjs`, `check_descriptions.mjs`, `cycle_ledger.mjs`, "Doc slip lint" and "Cycle burn-down" sections present on master; q3/q6 scripts are newer on master) | landed (ancestors) | Book UI (no live codex owner) | Cleanup batch CB-P. |

## 4. Detached and temp worktrees

| Code | Kind | Evidence | State | Owner | Next step and done check |
| --- | --- | --- | --- | --- | --- |
| RC42 | worktree | `/private/tmp/claude-501/gate-wire` detached at `1f3cc069` (ancestor of master); 3 build-output diffs | in progress (floor-wire's gate checkout) | floor-wire `…028a22ff0fab` | Keep until floor-wire finishes; then CB-D. |
| RC43 | worktree | `/private/var/folders/…/yairpg-adopt/worktree` detached at `5dcd2240` (ancestor of master); `dist/bundle.js.map` diff, ignored private fonts | landed, no owner | Book UI | Cleanup batch CB-D after Weibao's yes. |

## 5. Uncommitted diffs on primary master (touch nothing)

25 modified and about 1,320 untracked paths at snapshot (counts drift as sessions commit). Owner is inferred from last-commit subjects and imports. A later commit may already have taken a row.

| Code | Paths | Likely owner (inference) | Hazard and next step |
| --- | --- | --- | --- |
| RC44 | `src/tempo_fight.js`, `tempo_fight_contract.js`, `tempo_fight_domain.js`, `src/main.js`, `tests/tempo_fight.test.js` (modified); `src/tempo_allies.js`, `tests/tempo_allies.test.js`, `tests/stepper_batch_validation.test.js` (untracked) | p4-fights `…26a3b19b` (last commit "P4 floor: tempo contest route…"); stepper test may be perf-waits | `tempo_fight_contract.js` imports untracked `tempo_allies.js`: committed HEAD does not import it (checked with `git show HEAD:`), but committing `tempo_fight_contract.js` without `tempo_allies.js` would break the build. Commit the set together. |
| RC45 | `src/person_silence.js`, `promise_content.js`, `promise_ui.js`, `person_memory_effects.js`, `everyday_life.js`, `simulation_effects.js`, `tests/person_silence.test.js` (modified); `src/person_standing.js` (untracked) | p3c-memory `…ceb93fd1` (P3c) with P6 crowd lines by p4-fights | `promise_ui.js` and the test import untracked `person_standing.js`. Same all-or-nothing rule (HEAD itself is clean). |
| RC46 | `src/home_overview_model.js`, `home_overview_panel.js`, `src/ui/home_view.js`, `src/ui/preview/fixtures/homes.js`, `styles/home_view.css`, `tests/home_view.test.js`, `scripts/playtest/home-view.mjs`, `docs/representations/HOMES_AND_BASES.md`; `src/home_domain.js`, `home_building_model.js` modified | GenUI (Homes view is in its queue; no live session found) | Nothing imports the new files yet (0 references), so safe but unowned work. GenUI names an owner or commits. |
| RC47 | `src/layout_spec.js`, `index.html`, `figure-gallery.html`, `styles/*.css` (8 files), `styles/manifest.txt`, `src/ui/preview/figure_gallery.js`, `fixtures/manifest.js`, `tests/ui_contract_allowlist.json` | GenUI / ui-defects UI refactor wave (last commits "Organizations gets a nav route", "Restore the 11 game stylesheets") | `index.html` and `figure-gallery.html` diffs are version-hash lines; regenerate by build before commit. |
| RC48 | `dist/bundle.js`, `dist/bundle.js.map` | build output | Rebuild once by the committer after the sets above land (`npm run build`). |
| RC49 | `src/book_world_lotm_path.js`, `src/clock_owner.js`, `tests/lotm_advancement.test.js` | sw-adv / floor-wire | Small edits (1 to 12 lines); owner commits or drops. |
| RC50 | `scripts/lead_run/coverage_ledger.mjs`, `tests/lead_run_coverage.test.js` | Sonnet (L2 ledger) | Commit or drop. |
| RC51 | `docs/reviews/DESCRIPTION_LINT_2026-10-26.md` | regenerated lint output | Regenerate by the check script or revert; owner Sonnet. |
| RC52 | `src/lotm_summons_rows.js.bak`, `p51/` (1 file), `prototypes/workbench/built/*` | Book UI (unknown writer) | Backup file and unexplained dir; Book UI asks Sonnet and GenUI whose they are. Delete only with Weibao's yes. |
| RC53 | `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/`: 9 untracked checkpoints (RV1, RV10, RV11, RW4-RW9), `T2_RESUME_3.patch`, `X1_DRIVER_WAIT.patch`; `sonnet-wave-2026-10-30/` L4_LUNA_V2a3-6 briefs and `l8-briefs/`; `ui-refactor-wave-2026-10-29/ROUND2_BRIEF.md` | Indexing (cast-lives), Sonnet (wave docs), GenUI (ROUND2) | Docs only: commit with own paths. |
| RC54 | about 980 screenshots plus about 300 `.save.txt`/`.json` evidence files under `docs/gm/dispatch/*/evidence/` (ui-modular, broader-ui, pc-groups W4-W6, complementary-journeys, distinct-world, cultivation-spacing, w3-*, itch-depth) | Book UI (no live owner) | Policy decision for Weibao: commit, ignore or delete old evidence; recommended default: add a `.gitignore` line for bulk evidence and keep receipts. |

## 6. Patches (owner by lane)

`git apply --check` at snapshot. Candidates that apply cleanly to the index and do not reverse-apply (re-checked with `--cached`, so master's dirty files do not skew it):

| Code | Patch | Owner | Next step |
| --- | --- | --- | --- |
| RC55 | `docs/representations/patches/ladder-ghost-host.patch` | GenUI | Applied during this run (`14b99beee`); verify and mark applied. |
| RC56 | `cast-lives-lanes/CR1_INTEGRATION.patch`, `R1_INTEGRATION.patch`, `D2_LOAD_INTEGRATION.patch`, `P6_FIGHT_HOOK.patch` | floor-wire (single host writer) | Apply, mark superseded, or reject; one receipt line each. Done: each patch reverse-applies or has a "superseded" line. |
| RC57 | `docs/reviews/plan-rule-reconciliation-2026-10-18/ROUND2_ACTIVE_UI_AMENDMENT.patch`, `overarching-reconciliation-2026-10-23/r3-proposed-regression.patch` | GenUI | Rules text: apply or close. |
| RC58 | `sonnet-wave-2026-10-30/codex-r3/c2/build_event_cards_volume.patch`, `docs/research/proto23/private/…/own-report-diff.patch` | Sonnet | Apply or close. |
| RC59 | About 100 other patches (cast-lives `*_INTEGRATION.patch`, pc-groups evidence, ui-foundation parity, 10-01 to 10-26 candidates) fail to apply or reverse-apply because shared files moved | Book UI | Treat as historic evidence. Weibao may bless a sweep that adds one "historic, superseded" line to each owning doc. |

## 7. Below-floor and read-model-only slices

Source: `implemented, below floor` or `read model only` in `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/*CHECKPOINT.md` (37 of 92 files) and the sonnet-wave docs. Floor = AD43 six-line floor. Wiring and browser proof belong to floor-wire; coordinators own the list.

| Code | Lanes | Evidence | Owner | Next step and done check |
| --- | --- | --- | --- | --- |
| RC60 | Engine and card lanes: AD2, B1, CH1, CR1, CR2, D1, D2, DV1, H1, H2, MK1, S1, G1 | 13 checkpoints, status "implemented, below floor"; CR1, CR2, D2 patches in RC56 | floor-wire | Per lane: host-wired yes/no, 1920 browser proof yes/no, one line in the lane's checkpoint. Done: each lane reads "at floor" or names its single blocker. |
| RC61 | Memory and standing: MR1, MR2, MR3 | 3 checkpoints; RC45 holds the live edits | p3c-memory | Land RC45, then floor line. |
| RC62 | Fights and timing: P2, P3, P4, P5, P6, P7, P8 | 7 checkpoints; "Browser timing and natural-rate gates open" | p4-fights, perf-waits | Land RC44, then floor-wire browser proof. |
| RC63 | L3M, L4A, L4B, L4C, L4D, L4E (reader/pack lanes; L4B: person rendering unwired) | 6 checkpoints | Sonnet via sw-bridge | Wire through L13 bridges or mark read-model-only with a consumer owner. |
| RC64 | MF_ABILITY, MF_BODY, MF_DIVINATION, MF_EXCHANGE, MF_INFERENCE, MF_MAKING | 6 checkpoints | Sonnet (L10/L11 owners) | Same as RC63. Divination alone has a host consumer, with no fact supplier (QUEUE state). |
| RC65 | T1, T2 (TH2 in the A checkpoint) | "no 1920×1080 browser run" because of load | floor-wire | Rerun on a quiet machine. |
| RC66 | Sonnet-wave L-A engine slices, "landed, read model only" (QUEUE State) | `QUEUE.md`, `WIRING_HANDOFF_FROM_L-A.md` | sw-bridge, floor-wire | One consumer per slice named in L13; no scripted Chrome floor runner exists yet, floor-wire decides whether to build one. |
| RC67 | GM40 spell seam (focused tests only; nothing registered in a host) | `GM40_SPELL_SEAM.md` | floor-wire + bk-hp | Host registration patch from bk-hp. |
| RC68 | L9 death/restart slices 2-5 (below floor) | `L9_DEATH_RESTART_DESIGN.md` | Sonnet, consumed by bk-mol | bk-mol consumes the restart model; floor-wire registers. |
| RC69 | Representations round 2 proposals (BODY, COMBAT, ECONOMY, KNOWLEDGE, MAPS, RELATIONSHIP_WEB, RITUALS, TIME) | `docs/representations/*.md`, status "proposal / below floor" | GenUI | Each doc keeps a next-slice line; G17, G18, RS items per PLAN F2/F3. |
| RC70 | Reading lanes without checkpoint marks (RV1, RW4-RW9 untracked) | RC53 | Indexing | Commit the checkpoints. |
| RC71 | Book wave lanes bk-hp, bk-mol, bk-ss, bk-party | Section 1 | each lane | End at floor or write below floor. |

## 8. Idea intake files

| Code | File | State | Owner | Next step |
| --- | --- | --- | --- | --- |
| RC72 | `docs/gm/dispatch/sonnet-wave-2026-10-30/ideas/*.md` (9 files, 286 lines) | `cee7415e1` folded 141 intake lines; `sw-death.md` changed after that (`bbac84c50`, L9 slice 5) and `sw-wire.md` has 0 folded marks | Sonnet (`sw-gaps` sweep) | Rerun the sweep; done when each bullet has a `[folded: …]` mark. |
| RC73 | `docs/gm/dispatch/start-sources-2026-10-14/ideas/CHECKPOINT.md` | complete, document-only | Book UI | Nothing owed. |

## Owner replies folded in (current state per code)

| Code | Update | Owner now | Next step |
| --- | --- | --- | --- |
| RC8 | GenUI: obsolete, master's gallery has no such link | GenUI | Drop; branch joins the cleanup batch. |
| RC15-RC28 | GenUI checked by content (each commit 0-13% missing, explained by later edits; rituals `57c8e648` 84/229 replaced by its round 2); Sonnet confirmed `3287d6a2` is on master as `09901eab` | GenUI, Sonnet | Whole CB-S tier confirmed by content: nothing unique remains. |
| RC9 | G17 Skills tab built, uncommitted; commit follows one queued full suite; host patch `skills-tab-host.patch` sent to floor-wire (new unapplied patch); below floor at FLR4 | rep-abilities | Commit after the suite. |
| RC42 | `gate-wire` was made by sw-wire, not floor-wire, idle since | sw-wire (Sonnet) | Sonnet asks sw-wire; then CB-D. |
| RC44 | p4-fights commits its own set after the 1920x1080 run and one gated suite. Set: `tempo_*` (3), `tempo_allies.js`, `clock_owner.js`, its `enemy:Enemy` hunk in `main.js`, 2 tests. `stepper_batch_validation.test.js` and the `validateEnvelopeInBatch` hunks in `main.js` are perf-waits' and are now committed (`4e2cba556`, test tracked, `main.js` equals HEAD). A truncated `main.js` was restored from HEAD (`dfcf3390a`) and about 27 uncommitted lines were lost; perf-waits confirmed both its hunks (batched validation and the `fastForward` rest) are in `4e2cba556`, nothing lost, and its 45-day Chrome proof (1920x1080, save, reload, import) passed. RC62 timing proof can run. | p4-fights, perf-waits | p4-fights tells bk-party when it lands. |
| RC45 | Landed: `fcdfee7ba` holds the whole set (`person_silence`, `promise_*`, `person_memory_effects`, `everyday_life`, `simulation_effects`, test, `person_standing.js`), on master and tracked. Keep-quiet route, severity/loyalty/debt/lie lines and village crowd witness browser-verified at 1920x1080 with save, reload and import; the 45-day wait and the real-fight hook are not yet proven. | p3c-memory | Closed as a stray. Remaining: the two unproven routes. |
| RC61 | MR1-MR3 are at the floor per `docs/LEAD_LIFE_GUIDE.md` section 6 (MR1 implemented and consumed by P3; MR2 at floor for the village workshop route; MR3 at floor for the amends route) | p3c-memory | Closed. |
| RC46, RC47 | A homes worker under GenUI is finishing its suite, then commits `home_overview_*`, `ui/home_view`, `home_view.css`, test and probably the `home_domain`, `home_building_model`, `layout_spec` hunks. `index.html` hash lines: whoever next builds. `styles/manifest.txt`: tooling-defaults. | GenUI homes worker | Commit. |
| RC49 | `book_world_lotm_path.js` closed (`14b99beee`); `clock_owner.js` is p4-fights' (RC44); `tests/lotm_advancement.test.js` to floor-wire | p4-fights, floor-wire | Commit or drop. |
| RC50 | Closed: coverage ledger diff gone from master | none | none |
| RC51 | `DESCRIPTION_LINT_2026-10-26.md` is `check:descriptions` output | ui-defects `local_2ad52aaa` | Commit it with its run. |
| RC52 | Leave `src/lotm_summons_rows.js.bak` and `p51/` in place; list for Weibao's yes; Book UI asks the "Sonnet chat wave planning" session (`local_e9811a9a`) whose they are | Book UI | Question sent before deletion. |
| RC53, RC70 | Done in `ebf3abcd3`. Left out: `cast-lives-lanes/be_seat_floor_probe.cjs.txt`, owner unknown. Sonnet wave briefs (L4_LUNA_V2a3-6, `l8-briefs`) route to the Sonnet wave coordinator. | Indexing (done); Book UI for the probe file | Ask Sonnet who wrote it. |
| RC55 | Applied in `14b99beee` | none | Closed. |
| RC56 | floor-wire: not applied, not reviewed, queued behind divination, second city, L9, news; one receipt line each when reached | floor-wire | Route to Book UI if sooner is wanted. |
| RC57 | `ROUND2_ACTIVE_UI_AMENDMENT` superseded (targets retired 1800x1040 and 1536x864; standing target is 1920x1080); `r3-proposed-regression` already applied | GenUI | Close both. |
| RC58, RC72 | Route to the Sonnet wave coordinator (C2 card-builder patch, `sw-gaps` ideas sweep) | Sonnet wave coordinator (`local_e9811a9a`) | Apply or close; rerun sweep. |
| RC60, RC65, RC67, RC68 | floor-wire: host-wired no, browser proof no for AD2, B1, CH1, CR1, CR2, D1, D2, DV1, H1, H2, MK1, S1, G1, T1, T2, GM40 seam, L9 slices 2-5. L9 wiring hunk is in HEAD (`fe6a8e17c`); left: `context.harmSave`, `harmActionClass`, accrual, tick, `loopPlan`. Divination (L4) played once at 1920x1080 and is still below floor (no fact supplier, import not exercised). Bridges for bk-mol, bk-ss, bk-hp registration go to floor-wire one at a time. | floor-wire | Queue per its O1 order. |
| RC63, RC64, RC66 | sw-bridge (inference, lanes not opened): bridges exist for MF_ABILITY and MF_BODY (consumer: UI integrator at abilities and body views). No bridge for L3M, L4A-E, MF_DIVINATION, MF_INFERENCE, MF_EXCHANGE, MF_MAKING and L-A slices: read-model-only, consumer owner the lane owner, then floor-wire. | sw-bridge, floor-wire | Send sw-bridge a read-model function plus a rep contract per slice it should bridge. |
| RC69 | GenUI writes next-slice lines for BODY, COMBAT, ECONOMY, KNOWLEDGE, MAPS, RITUALS, TIME after its workers land; rep-abilities and rep-relationship-web write their own | GenUI | Done check: each doc has the line. |
| RC1-RC7 | bk lane messages not delivered (send limit); see the notes folder `bk-recon-report.md` | Book UI forwards | Forward. |

## Later wave lanes (started after the snapshot)

| Code | Kind | Evidence | State | Owner | Next step and done check |
| --- | --- | --- | --- | --- | --- |
| RC74 | worktree + branch | `bk-scout-cc90b8`, 2 unmerged commits (`49e8e7188` plus a follow-up), clean, unpushed; docs only: `docs/research/GITHUB_AND_WEB_SCOUT_2026-10-30.md` (new), pointers in `LIBRARIES_TO_INCORPORATE_2026-10-14.md` and `docs/TOOL_REGISTRY.md` | unlanded | bk-scout `local_fef6b2ab` (running); merge owner: Book UI | Integrator merges those three paths. Done: `git cherry master claude/bk-scout-cc90b8` empty. |
| RC75 | worktree | `bk-seams-5e4ce1`, 4 uncommitted, on `c8244211` | in progress | bk-seams `local_2ff55b52` | Commit own paths, rebase before merge (RC7). |
| RC76 | worktree | `bk-ui-directions-65b80d`, 13 uncommitted, on `c8244211`, idle | in progress | bk-ui-directions `local_4a85e652` | Commit own paths or hand to Book UI; rebase (RC7). |
| RC77 | worktree | `bk-benefits-5b89ef`, 7 uncommitted, on `c8244211`, idle | in progress | bk-benefits `local_cf3a9013` | Same as RC76. |

RC1 update: bk-coi's branch has two commits (`205df106`, `09aa46a5`) touching 7 files (`COI_NEEDS.md`, `evidence/coi/*`, `src/owed_ledger_view.js`, `tests/owed_ledger.test.js`); the tracked tree is clean (the earlier "3 uncommitted" were private symlinks). bk-coi rebases in its own worktree, then Book UI lands it; GenUI must OK first because rep-economy lists the owed ledger files. RC7 is resolved for bk-hp, bk-party and bk-gaps (on `e90e12a1`).

## Book wave lanes landed (bk-land, `LANDING_RECEIPT.md`, master tip `46ab02375`, ff-only, not pushed)

Supersedes the state and next step of RC1-RC7 and RC74-RC77 above. Each tip below is an ancestor of master (checked).

| Code | Lane | Landed tip | Floor and leftovers |
| --- | --- | --- | --- |
| RC1 | bk-coi | `d3817cd54` | Landed. rep-economy OK no longer needed. |
| RC2 | bk-hp | `ef250c622` | Below floor: fizzle draw needs a seeded chance in `simulation.js` (floor-wire). |
| RC3 | bk-mol | `1c7caed79` | Below floor. |
| RC4 | bk-ss | `3e724094a` | Below floor: WCO1 carry list. |
| RC5, RC6 | bk-party, bk-gaps | `489d2c5e4`, `ba24c2bb0` | Landed. |
| RC7 | rebase hazard | all lanes on current master | Closed. |
| RC74-RC77 | bk-scout, bk-seams, bk-ui-directions, bk-benefits | `746f5edd0`, `100a7edb6` (seams below floor), `f384a890e`, `18b445603` | Landed. |
| RC78-RC80 | bk-progression, bk-making-ui, bk-forms | `cb66a5929`, `47b492d6f`, `8372b2c2f` | Landed; no earlier row. |

Open after the landing: `dist/`, `index.html` and `figure-gallery.html` were not committed (primary has them dirty; a rebuild commit adds the `working_state.css` link). bk-land reports failures on bare master at `99d997eaa`, not lane bugs: `facts_frame`, `market_life`, `world_lead_pipeline`, `ui_contract` (style.css), `cast_inference_adapter` test 6, `cast_journeys` test 16. Owners for those failures are not assigned in this ledger.

All 15 `bk-*` worktrees are now clean of lane work (bk-hp and bk-ss hold only dist/index.html build output) and are cleanup candidates (batch CB-L, 15, proven by ancestry, plus `bk-land-ecb3eb` itself once its session ends). Their sessions are idle.

## Cleanup batch for Weibao's yes (nothing removed)

Worktrees only (33 of 42). Two tiers, because only patch-id equality or ancestry proves content landed; subject matching proves the message landed, and the whole-diff reverse check failed for all 18 unmerged-by-subject branches (master has since edited the same shared files).

- **CB-P, proven landed, no live session (17):** codex q1, q2, q3, q6, q7, q8, q10, q11, q12, q15 (RC32-RC41); `lotm-entrance`, `m2-blocked-reasons`, `ui-integration` (RC29-RC31); `rep-items`, `rep-mixing`, `rep-economy`, `rep-first-hour` (RC11-RC14). Remove with `git worktree remove` (build-output diffs discarded); delete branches with `-d` for the 13 ancestors, `-D` for the 4 patch-id-equal rep branches.
- **CB-S, landed by subject; GenUI has since confirmed by content that nothing unique remains (14):** `great-ritchie` (RC28) and 13 rep branches (RC15-RC27). Same commands with `-D`. `rep-character-sheet` (RC8, obsolete) can join them, making 34 if Weibao agrees.
- **CB-D, detached, after floor-wire finishes (2):** RC42, RC43.

Keep: RC9, RC10 (live relationship and abilities sessions) and RC8 until Weibao agrees it is obsolete.
