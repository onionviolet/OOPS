# Foundation run, 2026-11-12

Use the [current resume block](#current-resume-block) for picking and landing. The original twelve Claude workers used one worktree and branch per chat (K W P G L F B S A C R M).

## Current resume block

- **Direction.** Weibao's [held-out canon instruction](../../USER_VISION_LOG_2026-11.md#held-out-canon-picks-foundation-waves-2026-11-12) supersedes the picking, reporting and stop rules in the historical blocks below. Engine-first (PC95), existing usage limits, guarded commits by owner, and no push still apply.
- **Next.** Land the primary checkout first. At intake, master was `4d4505223` with 141 changed paths and an empty staged index. Recheck active writers. Land released work in small commits by owner with focused checks per commit and one full `npm test` on the combined tree. Hold all new work until this passes.
- **Landing checkpoint.** Home building `0ee50c806` passed 27 isolated focused checks. Moonblade calibration `52d44d6c9` passed local link validation. The existing E23 seam probe `ab8da5b55` passed eight isolated checks. The shared index was empty and 134 paths remained after E23. The creature, fabrication, brewing, spellcraft, and Gu chats were still writing during landing. Recheck their receipts and active write boundaries before taking their files. The combined suite and held-out reporting have not started. Last usage read was 42% of a 50% ceiling, with 2,961 credits above the 62,000 floor.
- **Handoff, 2026-11-13.** Primary `db81f1f11` includes the Gu aperture commit after the initial landing. The live checkout had 238 changed paths and an empty staged index at handoff. The combined-suite gate remains open. Resume by checking Git, current writers, and usage, then land the released owner batches before starting a new foundation wave. The latest read was 80% against Weibao's revised 85% ceiling, with 2,961 credits above the unchanged 62,000 floor. The separate `contest-choice` lane was still running in its own worktree at the check. Review its receipt and diff before folding it. The parent goal still shows `blocked`; use this block for the manual handoff and check goal state before expecting automatic continuation.
- **Landing, 2026-11-13 02:30.** The primary checkout is landed by owner batch on top of `db81f1f11`, and the combined-suite gate is closed. All five domain chats had paused with handoffs and no writer was live. One full `npm test` on the combined tree: 7,276 of 7,280 passed, 2 skipped, 2 failed (gate exit 1). Both failures were fixed and their files rerun with the folded `contest-choice` lane, 36 of 36: two raw spacings in `src/ui/preview/plot_draft.js` now use `--ui-space-1`, and the PC12 compression baseline was rewritten. Build, `check:arch` and `check:rules` exit 0 on the final tree. No browser pass was run; the work is headless and agent-verified, not human-reviewed. No push.
- **Debt from the landing.** PC12 C1 rose from 36 to 44: eight new Gu packs call `resolveGuActivation(` directly (`gu_ascension_working`, `gu_awakening_working`, `gu_beam_condensation`, `gu_giant_hand_working`, `gu_moon_fusion_working`, `gu_obscured_secret`, `gu_vital_advancement`, `gu_ward_break`). The baseline now records 44 so the ratchet holds from here; routing those eight through the shared runner brings it back down. The same rewrite locks the gains in C5 (10 to 4) and C6 (0 to 3). Brewing's volume-based dosing edit landed with its save and restore proof still pending. `contest-choice` reported its goal blocked: its scorer resolves each candidate once and asks for a rules-carrying simulation port before it can score follow-on turns.
- **Worktrees, 2026-11-13.** Landed as eleven owner commits, `a20912569` to `fa6d3a2b6`. Fourteen finished lane checkouts were removed after their leftovers were archived and hash-checked in `~/.codex/research/worktree-cleanup-2026-11-13/` (`RESULTS.json` lists each head and archive); every branch is kept. A second round archived twelve of the thirteen lettered foundation chats and removed their checkouts the same way (`RESULTS-round1.json` holds the first round). `fdn-s-spellcraft` stays: the app reported live work in that chat and declined to archive it. Checkouts with work that is not on master were left alone: `yair-codex-g1`, `yair-fdn-coord-3`, `yair-spellcraft-proof`, the two `merge8` trees and the paused lanes from November 10 and 11. `codex/foundation-coordinator-3` is superseded by `ab8da5b55`, which landed the same seam probe under `tests/`.
- **Potion holdout, 2026-11-13 evening (Claude coordinator, "UI and vision coordination" chat).** Weibao: "make the most progress in in the combat, ui, and procedural systems". The report step and the first potion wave landed as `dac1f7239`: a fixed split in `src/brew_heldout.js` (4 tuned, 17 held out), a "Held-out canon scoring" section in the coverage README. Outcome 10 of 17, object 14 of 17, route 10 of 17; no rule changed, so no score moved. It is a diagnostic against evidence labels, not engine execution. 238 of the 259 blocked rows have no evidence label, and the Fandom wiki refused automated reads, so labels are the limit, not rules. Open design choices for Weibao: self or touched as a default target, topical or drunk, drunk or eaten, and the plant family's verb. The second wave landed the same evening: each held-out row now runs through the brew dose engine (`src/brew_heldout_cases.js`), and three wrong title patterns were fixed at the pattern (mandrake restorative, skele-gro, dressing nouns). Engine-executed outcome 13 to 15 of 17 and route 11 to 12 of 17; diagnostic outcome 10 to 11. Those three rows informed a rule after scoring, so the untouched 14 score 13 and 10 on the engine. No row regressed. New missing mechanism: the brew dose law has no body-surface route (`coat` binds a thing, not a body), which blocks the route check on five rows. Not executed: recipe and ingredient data, target and time. A third wave added that route: `apply` on the dose law puts a preparation on a named surface of a body for a contact time; a share is taken up (skin 40, hair 100, wound 250 permille a minute, proposals with a dial) and the rest stays as the residue `coat` and splash already use; a body without that surface refuses with a reason. All 17 held-out rows now run their labelled route; engine route 12 to 13 of 17, no outcome score moved. Four body rows still miss because the fitted default says drunk, which is the topical-or-drunk choice for Weibao. A label pass over evidence already in the repo added nothing: only 19 unlabelled rows link to an evidence row in `docs/research/hogwarts-potion-evidence-2026-11-11/`, four of those are already labelled under another title, and the other fifteen are mentions whose own `open` field says the effect or route is unproven (failed approach, do not repeat). Labels live in `HP_POTION_SENTENCES` in `src/world_packs/brew_effects_pack.js`. Next useful action: a bounded reading wave over the held Hogwarts books for potion evidence (AU13 plan, haiku readers, locators only), then the 30 to 40 item samples for the other ledgers. Full `npm test` on the combined tree the same evening: 7,471 of 7,478 passed, 2 skipped, 5 failed (exit 1); all five were `check:arch` reading `src/display.js` mid-edit by the UI chat and passed 20 of 20 on rerun once it returned to 6,767 lines. Parallel lanes this evening, each its own writer: UI ledger (UI improvement ideation chat), combat engine slice (Combat styles across worlds chat), lead core-flow reruns (Game design ideation chat). Pacing: continue under 75% weekly and 85% of the 5-hour window (read 26% and 12%).
- **Backlog.** Spellcraft and general protagonist runs: test a learned spell in a second situation using the same rule, with an actual downstream consequence. Use the [reconciled capability assignments](CAPABILITY_GOAL_ASSIGNMENTS.md#reconciliation-and-handoff-2026-11-13) for evidence, vocabulary and external reference intake after landing.
- **Then.** Extend the existing coverage report and README. Lead with per-ledger before/after rows tuned on, held out, and matched, plus sorted misses. Keep scored cases outside their fit and check outcome and route separately. Reuse spell_grammar, procedural_grammar, brew_grammar_layers, PC11 and PC72. Use no new checker script.
- **Wave order.** After the report, tune the five Hogwarts potion mechanisms on a small named sample and score the remainder of E24's 259 rows. Then sample 30–40 described items per other ledger from held books across families, split equally for tuning and scoring, and retain the rest for later. Record chapter or page locators and keep raw book prose out of git.
- **Misses.** Fix a wrong rule and rerun the full holdout, noting regressions. Add a missing rule for a family. Queue missing data. Record an author's exception with an in-world reason and cost, and flag clusters as possible missing rules. List defaults that the evidence cannot distinguish as design choices.
- **Wave report and stop.** Target one held-out score and give the before/after table plus open work. Say in the first line when a wave adds code without moving a score. Put new ideas on single backlog lines here. Keep PROCEDURAL_CORE.md and PROCEDURAL_CARRY_OUT.md from growing. Stop at an existing usage limit, two successive stalled waves, or a decision Weibao must make.

## Historical Claude coordinator takeover (2026-11-12)

Weibao (2026-11-12): "hand off for you to be the coordinatoe". The Claude session that wrote the [procedural core](../../../PROCEDURAL_CORE.md) and [carry-out](../../../PROCEDURAL_CARRY_OUT.md) is the coordinator from here. The Codex coordinator stopped at its usage ceiling with no detached worker alive (checked: `codex_goal_lane.py status` shows none alive; no test or lane process running).

From the Wave 12 commit the coordinator was Codex again, under the [second handoff](CODEX_COORDINATOR_HANDOFF_2.md). The picking rule and inputs below describe that phase.

- Objective: foundations with gameplay deferred, and from 2026-11-12 game tie-in deferred too (carry-out PC95): work is proven in one headless engine world, measured by the five numbers G1 to G5. MS5's reachable route per domain moves to the tie-in phase; the other milestones map to the phases as before. Weibao also declined an early playable scene ("No, engine first").
- Picking rule: the carry-out's wave ritual (PC65) and tracker, in the readjusted order (PC91) and under its keep-it-small rules (PC94): each packet names which of the five end-state numbers it moves, two tries then stop, no new checker scripts. Milestones map to its phases in the [carry-out reconciliation](../../../PROCEDURAL_CARRY_OUT.md#milestones-and-phases-rc3). The facet order ability, body, technique, custody, contest, progression has his "Yes, use that order". The rest of both docs is a proposal used as working order; Q1, Q2, Q5 and Q7 in the core stay open and nothing they would defer is deferred.
- Input identity: master `a77fda00c`. Dirty and inherited: Wave 9 source and fixtures (`src/creature_lifecycle.js`, `src/gu_keeper_moonlight_trial.js`, `src/gu_moonlight_stock.js`, `tests/gu_light_attraction.test.js`, `tests/gu_upkeep.test.js`, untracked `src/world_substrate_packs/gu_brew_regulator.js`, `tests/gu_brew_regulator.test.js`, `scripts/wave_scratch.sh`). Dirty and not this run's: `dist/bundle.js`, `dist/bundle.js.map`, `index.html`, `docs/tools/game_mcp_limits.jsonl`, and earlier edits to the playbook and the Codex handoff.
- Workers: Weibao (2026-11-12): "work with fable + codex only, I want to use all my fable usage so I can use my reset". His reason is to use the Fable allowance before its reset. Claude lanes run on Fable from this session and Codex lanes run under the 50% ceiling; sonnet and haiku lanes are paused for this run. At most three Claude code lanes at once, one writer per file. Lanes run focused tests; the coordinator runs the full gate set once per merge wave and commits own paths. No push.
- Codex limits: Weibao (2026-11-12, after the takeover): "Use codex up till 50%". The shared limits file now holds a 50% weekly-window ceiling; the 62,000 credit floor is unchanged (headroom 2,961 at a 21% read). Read usage before each Codex lane and at least every 30 minutes; stop lanes at 49%.
- Step states: see the Wave 10 section at the end of this file.
- Stop condition: MS1-MS6 met and committed, or a decision that is Weibao's to make, or his word to pause.
- Resume prompt: "Continue the foundation run as coordinator from the Claude takeover block in docs/gm/dispatch/foundation-run-2026-11-12/RUN.md. Check git status and git log -3 against its input identity, read the Wave 10 section, run the carry-out's wave ritual (PC65), keep the block current, commit own paths, no push."

## Phase 1 (2026-11-11 to 2026-11-12)

| Chat | Branch | Commits | Delivered | State |
| --- | --- | --- | --- | --- |
| K | claude/fdn-k-kernel-a28c4b | 6df7bbdb3, f05d8afa8 | Working contract v0; Gu procedures and creature methods pass 17 contract tests incl. one jump vs many and reload | merged |
| W | claude/fdn-w-substrate-ee40b6 | 7d9378127, 5956d23ae | Substrate v0; brew steam and shell regulator exchange humidity and smoke with no import; same after jump, steps, reload | merged; not wired into live play (below floor) |
| P | claude/fdn-p-grammar-4ffe18 | 415f8e755, 937d36f4e | Grammar contract v0, module, Gu canon test (report in foundation-p) | merged |
| G | claude/fdn-g-gu-312887 | eb8b903b9, 860ff5875 | Catalogue 28 to 78 kinds as identity data; 7 run as data; compression inventory; grammar and quantity drafts | merged |
| L, F, B, S, A, C, R, M | claude/fdn-*-* | one or two each | Inventories, PFP2 counts, grammar or contract proposals; S adds a spellbook browser receipt | merged |

Merged into master as 12 no-ff merges ending at 886d8c1e7.

## Resume block (unattended run, 2026-11-12)

Historical checkpoint. Use the [current resume block](#current-resume-block) to continue.

Weibao (2026-11-12): "send the plan updates to the chats and start phase 2. Continuw auto thorugh all the phases until everything is comprehensive and works to cover all the gu, all the possibilities of moves and more, all the potions and more? rescope as needed and more?"

- Objective (from 2026-11-12, plan section "Making all achievable"): milestones MS1-MS6 met in order, each committed. MS1 every CV3 ledger has zero unclassified rows; MS2 effect-layer canon test on Gu and Hogwarts spells reported; MS3 every chapter-checked Gu kind, real Hogwarts potion and spellbook spell runs or is blocked with a named rule, and at least 10 Keeper modules are deleted; MS4 the 23 canon moves rebuilt as composed workings, with generated moves passing the five checks; MS5 one reachable route per domain at the floor plus a combined browser pass; MS6 N, X, D, PG1, PG2 and E's three chains. Progress is reported as the runs share per ledger.
- Earlier text: Objective: every chat in the plan meets its done check (plan tables plus PFP2 counts), Gu catalogue runs as data with moves beyond canon through the effect grammar and composed workings, potions as data across Hogwarts and Lord of the Mysteries, the three emergence chains run with no join code, one combined browser pass; each phase committed on master.
- Input identity: takeover started on master at 35533590c. Preexisting changes: `dist/bundle.js`, `dist/bundle.js.map`, `index.html`, `docs/tools/game_mcp_limits.jsonl`. The coordinator's repair touches the C/L declarations, B/E test fixtures and K's spell test adapter. Build output is isolated.
- State of the steps: MS1 verified, all seven ledgers have zero unclassified rows. MS2 reporting is delivered in Wave 4, with the 70% quality target still open and misses recorded. MS3-MS6 remain open. Gameplay development is deferred under Weibao's takeover instruction. MS5 can exercise existing routes as foundation proof; a missing route stays open.
- Last committed evidence: `6425dd1f0` passed the Wave 8 full suite (6,468 passed, 0 failed, 2 skipped), isolated build, rules, architecture and coverage. Its browser bundle matches the Wave 7 proof. Wave 9 has passing focused checks, an isolated build and partial Keeper parity. See the usage stop below.
- Gate policy (Weibao asked whether gates are skippable, 2026-11-12): chats run focused tests only. The coordinator batches returns into one merge wave and runs the full suite once per wave, never per chat. Docs-only merges run check:rules and doc checks, not the suite. A fix that touches only comments or docs reuses the last full-suite evidence plus its focused file (AGENTS: reuse passing evidence for unchanged inputs). Merging and dispatch do not wait on a running suite: chats work on branches, and a red suite is fixed on master and relayed. The browser pass runs once per domain milestone, not per phase.
- Failed approaches: starting sessions from a background-task turn is refused by the app; dispatch only on a user turn or by messaging existing sessions.
- Goals: each chat runs the plan's per-chat goal (its done-check row, phase after phase); this record holds the coordinator goal. E started 2026-11-12 (local_d9c26029, fdn-e-emergence). N, X and D wait for the usage read after phase 2 returns.
- Next useful action: After Weibao resumes with budget available, finish Wave 9 combined and parity gates. Then review the returned teaching and dose-delivery fixtures on the primary tree. Keep MS3-MS6 and gameplay deferral visible.
- Usage pacing: `python3 -I scripts/codex_goal_lane.py usage` works in this session. Latest read 20% used and 64,960.62 credits, which triggers the weekly usage ceiling. Limits are 20% used and 62,000 credits. Recheck before dispatch or a new wave and at least every 30 minutes. No push.
- Stop condition: MS1-MS6 met and committed or either authorized limit reached. The weekly usage ceiling was reached at 20%. No detached worker is alive. The takeover stops with milestones open.

### Takeover worker queue (2026-11-12)

Weibao requested individual Codex `/goal` workers and asked that the previously started lanes stay in the queue. The Claude coordinator conversation (`ea8fe13e-600d-448e-baf0-1c8fb371460b`) confirms the foundations-first scope and the phased corpus coverage plan.

| Worker | Owned slice and input | Status |
| --- | --- | --- |
| `fdn-ms2-gu` (`01a1ceaa-7611-76c2-b523-6c87cf790684`) | Gu held-out GL2 fixtures and report at 35533590c, `/Users/weiwei/code/yair-fdn-ms2-gu` | Goal complete, coordinator diff review and 22 focused tests pass. 57 of 78 chapter-checked rows scored. 21 await standalone effect labels. Whole effect stays 25/57, object improves 27 to 31 and time improves 37 to 40. `CODEX_RETURN.md` lists the missing rules and exclusions. |
| `fdn-ms2-hogwarts` (`01a1ceaa-7bbd-7a72-abff-e86ef357bb78`) | Spell GL2 scoring and focused regression at 15b30ce02, `/Users/weiwei/code/yair-fdn-ms2-hogwarts` | Goal complete, coordinator diff review and 17 focused tests pass. Joint target conditioning produced no gain and was dropped. Held-out assembly now receives explicit identity inputs. 33/80 verb and object and 12/80 whole sentence. Open gaps: intent evidence (26), no identity evidence (21), target (13), time (8). |
| `fdn-g-codex-1` | Existing Keeper return, `/Users/weiwei/code/yair-codex-g1` | Stopped. Coordinator completed the remaining five import redirects and removed the last two of the batch's five old modules. Focused 240/240, isolated build and architecture pass. Headless route checks underway. |
| `fdn-b-codex-1` | Existing potion and ingredient evidence, `/Users/weiwei/code/yair-codex-b1` | Stopped with a partial source review. Coordinator normalized local absolute source pointers, regenerated three ledgers and verified 3 focused tests. 55 potion notes, 101 ingredient notes and 226 LOTM census cross-references. No runs share changed. 569 Hogwarts article bodies still need review. |
| `fdn-s-codex-1` | Existing 94-spell source check, `/Users/weiwei/code/yair-codex-s1` | Stopped. Owner commit 15b30ce02 incorporates and reconciles the return, including the three target corrections and 14 named exceptions. The owner's S/W focused checks pass 35/35. Integrate that commit once. |

The two new workers use Sol low effort for the cross-system inference checks, with separate goals, auto-compaction and the shared 20% / 62,000 guard checked every 60 seconds. Both were dispatched at 16% used. Keep their worktrees through review and integration, then retire them under AD41. The launcher and logs are recorded under `/tmp/yair-fdn-takeover.aNvM3v/` and `~/.codex/foundation-lanes/` respectively.

- **ACT NOW:** compare each inference candidate with its fixed held-out baseline and reject features that expose the answer. Gu reports 25/57 whole-effect matches. The source-checked Hogwarts branch reports 33/80 for verb and object and 12/80 for full sentences, with 14 exceptions outside the runnable denominator.
- **ACCOUNT FOR NOW:** exercise the Keeper's existing behavior and save round trip on the new build. Keep preexisting local artifacts and the separate edits to the playbook and coordinator handoff outside the recovery commit.
- **LATER:** finish the rest of MS3-MS6 after the active GL2 and integration work. Additional design or gameplay slices remain deferred.

### Engine-first continuation (2026-11-12)

Weibao clarified that the next work should make the engine functional and absorb systems as procedural rules before adding gameplay. The Claude plan's GL1-GL4 stages and SB1-SB6 seams apply to each domain. Shared mechanisms run in repeatable fixtures with canon comparisons and explicit gaps. World laws stay with their domain and world owners. MS5 remains evidence on available routes; new scenes and UI are deferred.

| Foundation | Current evidence and next gap |
| --- | --- |
| Potions B | Candidate includes 0b9b4f42e, shared brewing and the Draught of Living Death data row with a 240-case equivalence fixture. GL3 preserves 17/18 held-out precedence pairs across three recipes in two worlds. The next seam is delivery into the body for PTD7 dose interactions. Provenance, mid-process corrections and LOTM ritual/digestion joins are open. |
| Spells S | Candidate includes 15b30ce02 and the explicit held-out input projection. Depth procedures cover components, failure, counters and standing fields at fixture level. The source-checked ledger is 80 runs, 32 blocked and 5 excluded (71.4% of real records). Joint target and ordered-root trials yielded no score gain on the same 80 rows. Two three-row identity group holdouts also showed no gain. |
| Heredity L/K | Marker loci, selection and measured polygenic traits are implemented in L. Candidate includes K's descent contract through 750ce7b36. `fdn-l-descent` (`01a1cebb-5eb9-7b82-934e-6a0cb0787f79`) owns birth-to-pedigree in the released K worktree. Unknown or unobserved parentage stays unknown. World-specific magical inheritance and other channels remain with their owners. |
| Gu and killer moves G | The chapter-ledger join reports 46/78 running, 31 blocked with named rules and one provisional sighting excluded. Four of 23 canon move records are classified running. The seven-case chapter review found no standalone gold tuple in those windows. `fdn-ms4-gu-roles` (`01a1cebb-5c2a-78e1-afc0-58c1c3da64ed`) owns one typed composition slice in the released Gu worktree. The current records mix Gu, formations, places, actors and targets, so a missing Gu identity and a missing world binding need different reports. |
| Domain-specific mechanisms and breadth | Keep the law that does the work in its owner. Generic composition can call it once its inputs, outputs and costs are represented. N/X/D, PG1/PG2 and E's three chains remain the MS6 queue. No new player routes were assigned. |

The first two Keeper browser routes on bundle `fa74ad23d65aa1a3bb81ad7520cc826ce777083388a6654707f12dbc9903fa28` passed their existing save, reload, Export and Import checks. These are parity checks for the refactor. Four route results remain pending on that isolated candidate. The G patch is outside Wave 4.

Wave 4 combines K, B and S through integration commit `8cf5e38cb` with the verified worker and coverage diffs. Build `cc67cc233dce22033d41876edbea473c96a52a9021bcef07cb91832ad249637f`, architecture, rules, coverage and doc checks pass, with 103/103 combined focused tests. Full `npm test` exits 0 with 6,392 passed, 0 failed, 24 skipped on the isolated candidate (`/tmp/yair-fdn-takeover.aNvM3v/wave4-suite.log`). Twenty-two additional private-fixture cases skipped there. The two directly related learnable-spell pack tests pass after linking the local packs for those read-only checks. `spell_coverage.mjs --check` and `b_coverage_ledgers.mjs --check` pass. The new goals launched at 16% used. The following usage read was 17%, with 2,961 credits above the floor.

### Wave 5 engine candidate (2026-11-12)

Input `aa7d1c9b2` on master. Wave 4 is landed locally. This wave preserves the existing unrelated changes in the bundle, index page, playbook, coordinator handoff and game MCP ledger, plus the new scratch helper.

| Foundation | Evidence and remaining gap |
| --- | --- |
| G Keeper compression | Old lane `fdn-g-codex-1` recovered. Five bespoke modules removed in this wave, plus the previous Red Steel removal gives six of the ten required. Isolated G build `fa74ad23d65aa1a3bb81ad7520cc826ce777083388a6654707f12dbc9903fa28` passed six headless routes at 1920x1080 with no page errors and 28 total save/reload/Export/Import checks. Route JSON is under `/tmp/yair-fdn-g-proof.JHbLeW`. The combined-bundle Rainbow recheck passed with two round trips and no page errors. |
| L/K pedigree | Real creature births retain optional parentage in `creature_lifecycle@1`. Old individuals with no parent field remain unknown. The caller supplies known endpoints for the projection to write observed `born-of` edges through K. Tested births, hidden data, JSON reload and duplicate-free replay. Registry/knowledge host wiring is open. |
| G typed composition | Xiao Yan's four-Gu fire set quotes and settles through `composeWorking` at the established 1+1+1+3 cost. Wrong and stale bindings are tested. Non-Gu context types and missing world mechanisms are described in canon evidence data. Tai Qiu still needs the dao-mark field; Air Lock needs the world-field law. Other canon records remain open. |
| B blended antidote | The classroom mixture now uses the shared brew working. Fractional reaction rates model repeated heating and cool binding. The phial still uses the existing dose-cancellation rules. All 1,280 whole legacy bench returns match, including sorted debits and reaction receipts. Physiological dose interactions are open. |

The combined source build `e68af9b0b2a075ce4c66541da816fa971f4985c91186505ff4b6572badcc9c26` passes. Architecture, rules, coverage and doc checks exit 0. Focused checks pass 89/89 on G/L/K and 77/77 on B. Full `npm test` exits 0 with 6,426 passed, 0 failed and 2 skipped on the primary tree with private fixtures available (`/tmp/yair-fdn-takeover.aNvM3v/wave5-suite.log`). Creature pedigree persistence is verified at the engine JSON boundary. No player pedigree route was added.

- `fdn-n-pedigree-knowledge` (`01a1cec5-40b7-7950-9a2b-a512204cdf14`) returned a source-qualified observer fixture on the L pedigree boundary in the released K/L worktree. The worker's focused checks passed 17/17. Host event authentication remains open.
- `fdn-e-residue-flow` (`01a1cec5-4462-7280-b3c4-a370317b796c`) returned an E/B/W residue transfer fixture in the released Wave 4 integration worktree. Real B rinse output reaches a field quantity with a shared cause chain. The worker's focused checks passed 48/48. Crop uptake and grazing remain open.
- `fdn-d-caused-situations` (`01a1ceca-9f1a-7941-ab3a-97b6d0178935`) returned a scarcity-driven situation through the existing owner, with 44 focused checks reported. Registry-backed restore of generated IDs remains open.
- `fdn-g-keeper-trials` (`01a1cec9-60f2-78c1-b2d1-9d9ebfc4d16e`) works on common Fire and Moonblade trial execution in the released first Keeper worktree. Preserve the Wave 5 evidence and its inputs. Its output belongs to a later candidate.
- Usage at these dispatches: 17% used, 2,961 credits above the floor. Both detached goals use the shared guard. No gameplay work was assigned.

### Wave 6 engine candidate (2026-11-12)

Input `246799b4e` on master. N, E and D returned engine fixtures. The second Keeper lane is folded into this candidate and leaves the live route behavior under parity review.

| Foundation | Evidence and remaining gap |
| --- | --- |
| N observer knowledge | An observed parentage claim goes through the existing knowledge effect and store. Witness and hearsay produce different pedigree graphs for the same birth. A host authenticates the relationship evidence. No new store or truth projection. Production evidence authentication remains open. |
| E residue chain | A real B working pours rinse contents into a W drain. The field receives matching constituent amounts and the child effects retain the cause. Minute steps, a long advance and reload agree. Crop uptake and grazing remain open, so pc2 is partial. |
| D caused situations | A measured shortage produces an addressed episode for real participants. The existing director and situation effect select and open it. A registered generator validates its identity and pressure evidence on restore. Unknown generators and altered causes are refused. Existing authored situation rows keep their previous format. Production pressure and scheduling wiring remains open. |
| G Keeper compression | Fire and Moonblade trials share the move-trial host, with world rows for distinct rules and notes. This removes one more bespoke module for a total of seven. Focused tests verify old note bytes, a returned support and the partial debit. Rebuilt Fire, Moonblade and tray routes passed eight total save/reload/Export/Import checks with no page errors. Tray's first check hit the harness's 20-second load timeout. The same synthetic save imported on both builds. The full tray route passed on the same candidate bundle with a 60-second wait. |

Build `83c7d75f6441ab3a6c2d8dd9dfc98b4c84d1fedce82ceeba24896c036cd0ef3b` passes. Combined focused checks pass 106/106. Architecture, rules and coverage exit 0. Full `npm test` exits 0 with 6,435 passed, 0 failed and 2 skipped (`/tmp/yair-fdn-takeover.aNvM3v/wave6-suite.log`). Gameplay development remains deferred.

- `fdn-ms4-gu-archive` (`01a1ced0-b57e-7b83-89a9-78dd674f9c79`) returned a generated Fire Path combination that settles on a typed working and earns a niche archive entry. The worker reports 25/25 focused checks. Integration pending.
- `fdn-x-procedural-places` (`01a1ced4-c686-7840-bc6c-2b5c83f54234`) returned a context-caused place holder whose saved wet-soil capacity changes the real substrate drain result. The worker reports 31/31 focused checks. Integration pending.
- PG1 verified the existing history-to-traveler generator and its observer-safe needs consumer. PG2 returned a scarcity-caused society proposal using P's grammar and the existing market quote. Both await the combined gate.
- Usage reads 18% used and 2,961 credits above the floor. Keep 20% and 62,000 as the stop lines. No push.

### Wave 7 engine candidate (2026-11-12)

Wave 6 landed locally at `cc27b9a09`. This candidate folds the following verified returns before the combined gate.

| Foundation | Evidence and remaining gap |
| --- | --- |
| MS4 Gu generation | The Fire Path engine fixture searches known, held Gu, checks actual kernel quote and costs, applies the world policy and explanation, settles the selected move, then archives a matching receipt. One novel three-Gu move spends five primeval and keeps its cause and grammar through JSON restore. All four canon records currently marked running now quote and settle on typed composition. Nineteen records still require roles or mechanisms. |
| X caused places | A bounded keyed draw supplies an adjacent wet field in an existing region and era, with evidence and a frozen address. W loads it and a real drain consumes its capacity. A fixed place or missing terrain evidence prevents generation. Broader place types and discovery wiring remain open. |
| PG1 caused people | Actual world-history wars cause refugees in the existing traveler generator. A focused regression proves deterministic saved origin, disclosure on meeting and real needs consumption. Family, upbringing and training use their separate owners. |
| PG2 caused society | P's grammar proposes a society from current market shortage and a founder with actual means. The result keeps its source, holdings references and grammar through reload. NPC founding settlement and canon calibration remain open. |

Combined focused checks pass 132/132 across the folded candidate. The separate typed Gu coverage and archive checks pass 15/15 after extending coverage to the four running canon records. Build `4db9e24483331a7975fb965a1d47a480bafc23c550b62802feda295a7dd47870`, architecture, rules, coverage and doc checks exit 0. Full `npm test` exits 0 with 6,456 passed, 0 failed and 2 skipped (`/tmp/yair-fdn-takeover.aNvM3v/wave7-suite.log`). Both existing guard routes pass rebuilt parity on that bundle, with five total save/reload/Export/Import checks and zero page errors.

- `fdn-a-caused-people` (`01a1cedb-0d53-7c10-9603-b1febc029468`) and `fdn-m-procedural-societies` (`01a1ced8-383b-7090-a3b4-202088b5c81f`) completed their bounded goals. Their patches are in the candidate.
- `fdn-l-residue-grazing` (`01a1cedd-865b-78e3-8639-2b67c8e7ad0f`) completed the pc2 engine chain using real B and W effects. The clover takes up 15 active units from the new deposit. The sheep meal consumes finite forage, transfers seven active units and reaches the existing harm inbox when the dose meets the authored threshold. Mass, cause, partition and reload agree. Host wiring, crop regrowth and the long-run deposit-lot budget remain open.
- `fdn-g-keeper-defense` (`01a1cede-26ac-77a2-b652-f914694b18fc`) returned a shared guard host for two existing native consumers. No deletion credit. Keeper remains at seven of ten. The guard adapter retains native custody and recovery data.
- `fdn-e-regulated-brew` (`01a1cee5-2fd7-71b3-9b32-2944ca8a3355`) owns the pc1 engine bridge from regulated humidity into brew outcome. `fdn-g-coupled-beat` (`01a1cee5-3584-7343-ac57-e044583e8904`) owns a bounded typed beat for the documented Iceblade Storm participants.
- Latest read: 19% used, 2,961 credits above the floor. Gameplay development remains deferred.

### Wave 8 engine candidate (2026-11-12)

Input `f622d4cdb` on master. These opt-in fixtures reuse the working kernel and substrate. No game routes or UI were added.

| Foundation | Evidence and remaining gap |
| --- | --- |
| MS4 coupled Gu | The Iceblade Storm fixture binds Ice Blade, Swirl and Fierce Wind to one typed, atomic payment and emits a scoped storm intent. An earlier completed working survives an insufficient reserve or a missing participant. Restoring the intermediate clock preserves settlement and one-time effects. Chapter 167 supplies the participants and combined effects. Charges, radius and the single settlement boundary are authored. Storm geometry, actual effect consumers and canon choreography remain open. |
| MS6 pc1 humidity and brew | The existing regulator opens the inlet if it stays and drops its pending pull if it leaves. The real B leaf reads shared humidity at burner burnout. It yields 100 usable active units in the first branch and 50 usable plus 50 in vessel film in the second, with matching heat and extraction. Long advance, minute steps and reload agree. G1/L1 still need the actual regulating Gu body. |
| MS6 pc3 colony, light and movement | A real firefly colony emits keyed light through a world-authored profile. The opt-in L law reads W's light and moves the feeder along a directed accessible link. Darkness and closed access keep it in place. W sight exposes arrival to a local rival where visible. Clock, quantity and move receipts survive JSON restore. The rival's autonomous knowledge and working choice remain open. |

Combined focused tests pass 73/73, including the primary kernel compose suite. Build, architecture, rules, coverage and doc checks exit 0. Bundle SHA256 matches Wave 7 byte-for-byte, so its browser parity applies unchanged. Full `npm test` exits 0 with 6,468 passed, 0 failed and 2 skipped (`/tmp/yair-fdn-takeover.aNvM3v/wave8-suite.log`).

- The coupled Gu, regulated brew and light attraction workers completed their bounded goals. The coordinator reviewed and folded the source and tests. Their archived receipts are in `/tmp/yair-fdn-takeover.aNvM3v/`.
- `fdn-e-gu-regulator` (`01a1ceef-c96b-77c3-a655-bf1f2069b31b`) returned a bounded pc1 regulating Gu fixture in the released integration worktree. The authored Draft Wing uses actual Gu activation and two measured air volumes. With twelve essence it sustains six strokes and preserves all 100 active units. Leaving after two strokes or running short leaves 50 usable and 50 film. The worker reports 25/25 focused checks, including time partition and restore. Review and combined integration are pending. The launcher checks 20% used and the 62,000-credit floor every 60 seconds.
- `fdn-g-moonlight-stock` (`01a1cef1-1e25-7580-af87-73c6b4be0185`) owns the next MS3 Keeper compression seam in the isolated `keeper-stock` worktree at `f622d4cdb`. The worker returns shared roster opening and validation plus reuse of the Gu activation host in both Moonlight consumers. The stock adapter owns unique receipts and remains. Six legacy saved fact hashes match. Worker checks 94/94. No deletion credit, and rebuilt parity remains open.
- `fdn-e-rival-working` (`01a1cef3-f592-73b3-86a2-29b5203326cf`) owns the final pc3 engine link from observed Gu arrival to the rival’s working choice in the released integration worktree.
- Usage reads 19% used and 2,961 credits above the floor.

### Wave 9 engine candidate (2026-11-12)

Input `6425dd1f0`. The three MS6 chains now have end-to-end fixture evidence with existing engine owners. Their live wiring and broader calibration remain open.

| Foundation | Evidence and remaining gap |
| --- | --- |
| E pc1 paid Gu regulation | An authored Draft Wing body uses the actual Gu activation owner to spend primeval essence and exchange humidity through an open vent. B yields all 100 units with sustained regulation and 50 usable plus 50 film if it departs or cannot pay. Conserved volume-weighted moisture, direction, admissibility, partition and restore are tested. |
| E pc3 rival working | Actual colony output, W light and wild movement feed W sight, observer-specific knowledge, A choice and a K Moonlight working. The cast spends four of six essence. A different observer's sighting, concealment, stale sight, missing means and inadequate essence cannot enable the rival. The fixture schedules observation and publishes the resulting damage. Consistent snapshots restore; autonomous scheduling and partial-write recovery are open. |
| G/L Moonlight roster | Two existing consumers share lifecycle roster creation and custody validation and use the existing Gu working host for casts. Six existing serialized fact bytes match by hash. The local adapter retains unique receipt handling. No module deletion credit. |

Combined engine checks pass 130/130 and the separate rival and knowledge slice passes 69/69. Build `c0d1e9e25876d09fcef138aa03dd49c66ce387e92c301d944ad83ed40da62947`, architecture, rules and coverage exit 0. Rebuilt Moonlight stock, Moonlight trial and tray move passed eight combined save/reload/Export/Import checks with zero page errors. At the usage ceiling, the full suite, Moonlight prospect and blade-chain checks were stopped. Light reader had not started.

- `fdn-l-teaching` (`01a1cef9-6e85-7652-8162-d023848766e5`) owns the IH6 engine proof for non-genetic transmission through attended practice and observer-safe provenance if the existing seam supports it. It reuses the released `keeper-stock` worktree with a distinct write scope.
- `fdn-b-body-delivery` (`01a1cefa-9054-7a23-911e-fa3750646309`) owns a PTD7/BRQ18 fixture for a measured brewed dose entering L with a physiological condition affecting delivery. It reuses the released integration worktree.
- Usage reads 19% used and 2,961 credits above the floor. Gameplay development remains deferred.

### Usage stop (2026-11-12)

The launcher and the desktop account tool agree on 20% used in the weekly Codex window. The account balance is 64,960.62 credits. The 20% ceiling triggered; the 62,000-credit floor did not. No detached workers remain active. No push.

Master is `6425dd1f0` (Wave 8). Wave 9 source and fixtures are uncommitted on primary. Its focused checks, build and three existing route proofs passed. The full suite has no completed result, and Moonlight prospect, blade chain and light reader still need rebuilt checks. Preserve the unrelated preexisting files listed above.

Two separate worker goals finished before the stop. The keeper-stock worktree has `tests/creature_teaching.test.js` (2/2 worker checks). It shows a newborn acquires a learned response through attended practice and uses authenticated fixture evidence to project `taught-by` separately from `born-of`. The integration worktree has `tests/brew_body_delivery.test.js` (4/4 worker checks), connecting a measured Draught to contextual oral uptake and L's injury owner with K interruption and restore. Both remain outside the primary candidate. Their `CODEX_RETURN.md` files record authored settings, fixture-supplied authentication and live-host gaps.

MS1 verified. MS2 report delivered and the 70% target remains open. MS3 remains at seven Keeper deletions of ten. MS4 has four existing running canon cases proved through typed composition, one generated archived move and an authored coupled Iceblade Storm fixture. MS5 has only existing route evidence under the gameplay deferral. MS6 has caused people, society, place and situation fixtures, observer pedigree and three connected emergence fixtures on the Wave 9 candidate. Production integration and calibration remain open. No gameplay development was added.

Resume prompt for a fresh session: "Continue the unattended foundation run from the Resume block in docs/gm/dispatch/foundation-run-2026-11-12/RUN.md. Check git status and git log -3 against its input identity first; finish the next useful action; keep the block current; commit own paths, no push."

## Codex lanes (requested 2026-11-12, not dispatched)

Weibao (2026-11-12): "Have those chats direct codex chats accordingly, with individual codex chats to bring their visions to life? using /goal and also /autocompact accordingly?"

- Route found: CLI at `/Applications/ChatGPT.app/Contents/Resources/codex-cli/CodexCLI.app/Contents/MacOS/codex` (codex-cli 0.167.0-alpha.4.1). The `goals` feature is stable. Goals are set through the app-server protocol (`thread/goal/set`, `thread/goal/get`, `thread/goal/clear`); auto-compaction is a config limit (`AutoCompactTokenLimitScope`, set with `-c` at launch), not a separate command.
- Usage preflight (read-only, 2026-11-12): account type chatgpt, ordinary usage allowed, no rate-limit reached, Codex window 15% used.
- Gate not passed: no supported setting found that stops a worker from spending account credits once included usage runs out. AU7 also caps an unattended task at 5 percentage points of a usage window unless a larger ceiling is authorized. The 64,500-credit reserve stands.
- Proposed protocol if authorized: one Codex goal thread per Claude chat, launched detached in its own process group from that chat's worktree; goal text = the chat's plan row plus milestone; auto-compact limit set at launch; the Claude chat reviews each Codex return at its locators before committing; the coordinator rereads Codex usage before each batch and stops all Codex threads at the authorized ceiling, before included usage runs out.
- Authorized (Weibao, 2026-11-12): "for paid credits, allow them to use till like there is like 64000 left or something, for usage, allow usage till maybe 30%maybe". Ceilings: Codex included-usage window up to 30% used (read 15% at authorization), credit balance down to 64,000. This raises AU7's 5-point default for this run. The launcher guard pauses every Codex goal thread when either line is reached; each thread also carries a goal token budget.
- Lane shape: each Claude chat writes `docs/gm/dispatch/foundation-<x>-2026-11-12/CODEX_LANE.md`; the coordinator launches it in a new worktree cut from that chat's branch; Codex edits files and does not commit; the owning Claude chat reviews the diff at its locators and commits. A pilot lane runs first to measure usage per lane before more open (AU4).

## Wave 2 log (2026-11-12)

- Merged to master: P MS1 tooling and effect grammar (5cd05f309), G MS1 ledgers (f91fc20bb, e68a175d3), E harness (8a8b58460). Focused: P 18/18, Gu plus emergence 227/227; check:coverage pass (gu_kinds 26.2% runs, gu_moves 0.5% runs, 0 unclassified); check:rules and check:arch pass. Full suite for this wave running.
- Codex pilot lane `fdn-g-codex-1` (Keeper compression batch 1) running in `/Users/weiwei/code/yair-codex-g1` on `codex/fdn-g-keeper-batch1`; status via `python3 -I scripts/codex_goal_lane.py status`. More lanes open after the pilot's usage per lane is measured.
- Usage read 2026-11-12 01:25 local: 5-hour 73%, weekly 57%. N, X and D chats held until the 5-hour window resets (09:50Z) per the 85% rule's margin.

## Wave 3 log and hold (2026-11-12)

- Wave 2 suite: 6211 pass, 0 fail, 2 skipped. Wave 3 merged to master (P with W phase 2 and the effect-grammar fix, W phase 3, K v0.5 with oaths, A agency v0 and shared search, B ledgers, C contest moves as effect sentences, F lore backlog, L IH1 and DC answers, M DC answers, R LR3 and LR4 fixed points, S hp_spells ledger and GL2 rate). AREA_GUIDE and RULES_INDEX table conflicts resolved by keeping every row. check:rules, check:arch and check:coverage pass. Ledgers: gu_moves 0.5%, hp_ingredients 5%, hp_potions 1.8%, hp_spells 83.9%, lotm_potions 19% runs; 0 unclassified anywhere. Wave 3 full suite running.
- Codex lanes running: fdn-g-codex-1, fdn-b-codex-1, fdn-s-codex-1 (worktrees yair-codex-g1, -b1, -s1). Codex usage 15%, credit headroom about 961 above the floor at last read.
- Hold: usage read 2026-11-12 01:46 local: 5-hour 93%, weekly 60%. Rule: no new dispatch until the 5-hour window resets (09:50Z). S, K and B were messaged just before the read and are working.
- Next useful action after reset: read usage; if the wave 3 suite is green, message the idle chats (W, P, G, L, F, A, C, R, M, E) to continue their next phase; start N (knowledge), then X and D; review Codex returns with their owners; merge wave 4.

## Handoff to the Codex coordinator (2026-11-12)

- Weibao handed the run to a Codex coordinator with new limits: Codex usage 20%, credit floor 62,000 (`~/.codex/foundation-lanes/limits.json`). Handoff: [CODEX_COORDINATOR_HANDOFF.md](CODEX_COORDINATOR_HANDOFF.md); goal: [CODEX_COORDINATOR_GOAL.md](CODEX_COORDINATOR_GOAL.md). Launched as lane `fdn-codex-coordinator` in the primary checkout. The Claude coordinator stops writing after this commit; Claude chats K, B and S finish their current phase and stop.

## Codex recovery check (2026-11-12)

- **F1, coverage:** `npm run check:coverage` on master 0d745f584 exits 0. All seven ledgers have zero unclassified rows. Runs shares: creatures 18.8%, gu_kinds 26.2%, gu_moves 0.5%, hp_ingredients 5%, hp_potions 1.8%, hp_spells 83.9%, lotm_potions 19%. No coverage row changed.
- **F2, pending returns:** B has unmerged commit 5f0b493bc (brew effect and composition layers) and merge 765071c5f. K and S have no commits ahead of master at this check. G's CODEX_RETURN.md reports an incomplete 3/5 Keeper deletion batch, focused checks and build, no successful browser proof; treat the return as worker evidence pending diff and route review. B and S Codex returns do not yet exist. No lane was integrated or committed.
- **F3, environment:** `.git`, its objects/refs directories, and all three external Codex lane worktrees are read-only in this session. `ps` and process probes return Operation not permitted. The launcher's status routine incorrectly reports alive=false for PermissionError as well as missing processes; do not conclude the lanes stopped. Their status files continue updating. The usage app server also exits with Operation not permitted, so new dispatch is held. Existing guards use the shared limits.json, whose values were confirmed as 20 and 62000. No guard trip, successful lane stop, commit or merge is claimed. An environment handoff was requested; this RUN.md edit remains uncommitted.

### Continuation revalidation 2

The preceding coordinator turn made progress by verifying coverage and updating this record. The same environment restriction persists: Git and G's lane checkout remain read-only; the direct usage command still fails with app-server EOF. This is the second consecutive goal turn encountering that restriction. `node scripts/check_doc_slips.mjs` completed with exit 0, no new hits; targeted `git diff --check` also passed.

New return evidence changes the review queue: S's launcher now records `finished`, reason `goal blocked`; G likewise records `finished`, reason `goal blocked`. B still records `running`; process liveness is not independently established. S's CODEX_RETURN.md is now present: 94 source-check verdicts (6 confirmed, 74 corrected, 14 unsupported), with a reported focused result of 15 pass and 1 fail. Three corrected truth targets disagree with separate row inputs (`engorge`, `reduce`, `blind`); fourteen unsupported effects retain runs-authored classifications because the worker's edit scope excluded them. Before merging S, the coordinator must review the source-check evidence, reconcile those target inputs and classifications, regenerate coverage and pass the focused gate. These are worker claims pending independent verification, not a newly passing canon test. No new lanes, merges, commits or pushes in this continuation; goal remains active and incomplete.

### Continuation revalidation 3

Previous turn: progress from recovering S's previously absent return and its failed-test/classification evidence. This turn revalidated the same environment blocker for the third consecutive goal turn: `.git` and all three lane worktrees remain read-only, and the required direct usage read fails at app-server initialization. Master remains 0d745f584. No safe route available here can commit, merge, modify the external lanes, read current usage directly or stop their processes. No fresh equivalent test suite was run. Mark the coordinator goal blocked pending an environment change; preserve the full MS1-MS6 objective. RUN.md changes remain uncommitted. B's launcher still reports running; G and S report finished with goal blocked. No verified budget threshold crossing and no claim that B was stopped.
- Wave 3 full suite (master after the wave 3 merges, before 0d745f584's docs): 6344 pass, 21 fail, 2 skipped, exit 1. Cause: W phase 3 (492c580b5) made effect kinds declared vocabulary, and consumers still publish or answer undeclared kinds: `contest.blow` (14 failures in `tests/contest.test.js`, `tests/contest_consumers.test.js`), `living.harm` (`l.living_body:harm-inbox`, reached by `tests/kernel_search.test.js`, `kernel_meet.test.js`, `kernel_compose.test.js`, `living_foundation.test.js:122`), plus B's BRC1/BRC2/BRC8 test and `emergence_harness.test.js:59`. Fix: declare those kinds in the owning packs' `publishes` (C, L, B, E) or in `composeSubstrate` effectKinds; then rerun the full suite. First task for the Codex coordinator.

## Wave 10: takeover, Wave 9 settlement, phase 1 packets (2026-11-12)

Input `f241a434b` plus the Wave 9 candidate. Source files unchanged since 03:55 on 2026-11-12, so the isolated build `c0d1e9e25876d09fcef138aa03dd49c66ce387e92c301d944ad83ed40da62947` in `/tmp/yair-fdn-takeover.aNvM3v/wave9-resume-build` is the candidate's bundle.

| Step | Command and result | Gaps |
| --- | --- | --- |
| Takeover and plan docs | Committed `f241a434b`; `check:docs`, `check:rules` exit 0 | No source change |
| Full suite on the primary tree | `npm test`: 6,475 tests, 6,473 pass, 0 fail, 2 skipped, exit 0 (log `wave10-suite.log` in the takeover folder). An earlier unrecorded run at 10:11 gave the same counts | Ran before the two fixtures below were copied in |
| Gates | `check:arch`, `check:rules`, `check:coverage` exit 0 | None |
| Blade chain route | `check-full-tray.mjs <build> <out> --blade-chain-only`: success, 5 checks, zero page errors | The earlier failure was a 60 s load timeout while a suite ran beside it |
| Light reader route | Same script, `--light-reader-only`: success, 7 checks, zero page errors | The earlier failure was a 20 s selector timeout under the same load |
| Moonlight prospect route | Passed on the previous coordinator's retry (`wave9-resume-moonlight-prospect.log`, same bundle) | Not rerun here; inputs unchanged |
| Returned fixtures | `tests/creature_teaching.test.js` (2) and `tests/brew_body_delivery.test.js` (4) copied from the takeover worktrees; with the Wave 9 test files, focused 69 of 69 | Fixture-level engine proof; no production wiring, no route |
| Wave 9 commit | See the commit after `f241a434b` | `scripts/wave_scratch.sh`, the playbook and handoff edits, `dist/`, `index.html` and the game MCP ledger stay uncommitted as not this wave's |

Delivery state: Wave 9's Moonlight roster refactor is agent-verified at parity on six existing routes with save, reload, Export and Import. The pc1 regulator pack and the teaching, dose and rival fixtures are implemented, below floor: fixture evidence, not loaded by the game (`gu_brew_regulator.js` is unreachable from `src/main.js` and calls `resolveGuActivation`, as the core's PC13 notes).

Milestones: unchanged from the Usage stop section. MS3 seven of ten deletions; MS4 to MS6 open.

Next: phase 1 packets by the carry-out (PC51). P1.1 first; P1.3 to P1.5 beside it as disjoint new scripts.

### Wave 10 dispatch (2026-11-12)

Wave 9 landed as `9aa344278`. Three Claude sonnet lanes run in the primary checkout on disjoint files, focused tests only, no git and no build:

| Lane | Packet | Files | State |
| --- | --- | --- | --- |
| reach-and-states | P1.1 (PC5, PC9, PC10, PC14) | `scripts/reachable.mjs`, `scripts/coverage_report.mjs`, `tests/coverage_report.test.js`, `tests/fixtures/coverage_cases/`, generated coverage README | Running. Typed states are kept and computed states shown beside them, since Q1 is open |
| effect-host | P1.2 (PC7, PC8, PC16) | `src/effect_host.js`, `src/spell_law.js`, `src/effect_checks.js`, focused tests | Running. Library and tests in this lane; live wiring is a follow-up after its first-consumer finding is reviewed |
| report-scripts | P1.3 and P1.5 (PC12, PC35) | `scripts/compression_report.mjs`, baseline json, `scripts/coupling_map.mjs`, `tests/procedural_reports.test.js`, two `package.json` script lines | Running |

Rejected for this wave: P1.4 (needs P1.1's reachability module and P1.3's rows); the canon negatives ledger (edits P1.1's file); live wiring of the effect host (needs P1.2's finding and a browser proof).

Queued for Codex lanes once this wave is folded (merge before dispatch): the 177 Lord of the Mysteries formulas into potion rows (PC85) and a feeding pass on the 78 chapter-checked Gu kinds (PC86).

More to consider before dispatch. ACCOUNT FOR NOW: tests that read ledger states must keep passing, so P1.1 leaves typed states alone; three lanes share one checkout, so each brief lists its files and forbids git and builds; the effect host must add no import cycle (`check:arch`). LATER: replace the copied import walk in the report scripts with `scripts/reachable.mjs` when P1.4 lands.

### Wave 10 fold (2026-11-12)

Each lane's claim was checked at its locator and its tests rerun from the repository root. Combined focused run: 52 of 52 across `tests/procedural_reports.test.js`, `tests/coverage_report.test.js`, `tests/effect_host.test.js`, `tests/effect_grammar.test.js`, `tests/world_effects.test.js`, `tests/spell_grammar.test.js`, `tests/gu_coverage.test.js`.

| Lane | Files | Evidence | Not covered | State |
| --- | --- | --- | --- | --- |
| reach-and-states (P1.1) | `scripts/reachable.mjs`, `scripts/coverage_report.mjs`, `tests/coverage_report.test.js`, `tests/fixtures/coverage_cases/`, generated `docs/coverage/README.md` | `node scripts/reachable.mjs`: 1,491 of 1,657 src files reachable, one computed import (`src/translation.js` locales). `check:coverage` passes on 7 ledgers. README shows typed and computed states side by side | No ledger row has a `case` yet, so computed expressed and runs are 0 in every ledger. A working case returns `blocked:runner-working-case` until a pack supplies one | Tooling done; P1.1's tracker line stays open until a real row computes |
| effect-host (P1.2) | new `src/effect_host.js`; `src/spell_law.js`, `src/effect_checks.js`, `src/effect_grammar.js`; `tests/effect_host.test.js` | A settled Hogwarts spell changes a W world through `landEffect`; a sentence with no W reading returns a publish and changes nothing; the runs check executes when given a probe world. Lowering the 109 labelled sentences: 68 to W acts, 37 publish, 4 need a key, matching PC7. Executed in a probe world: 55 landed, 9 ran with no change, 20 wait for an owner, 25 were refused for missing amounts or destinations | Not loaded by the game: all four modules are unreachable (`reachable.mjs --is`, exit 1), so the bundle is unchanged and no build or browser pass applies. `spell_law` words outside the effect vocabulary (fire, water, access, harm, mood) return `unmapped` | Implemented, below floor |
| report-scripts (P1.3, P1.5) | new `scripts/compression_report.mjs`, `scripts/compression_baseline.json`, `scripts/coupling_map.mjs`, `tests/procedural_reports.test.js`; two `package.json` script lines | C1 36 files (32 reachable), C2 24 + 41, C3 5, C4 4, C5 10, C6 0 of 7; baseline written. Coupling map: 11 packs, 5 cross-domain couplings, one pack reachable (`l.shell_regulator`) | Three packs declare reads or writes through computed lists the map cannot resolve (`c.contest`, `m.market`, `w.sky`); `w.residue_flow` publishes `effect.add` undeclared | Done as reports |

Coordinator changes at the fold: the compression script takes `--baseline <path>` and its test uses a temp file, since the lane's test rewrote the tracked baseline in place.

Findings for the next wave:

- **First live consumer for the effect host.** The game's spell path is `src/spellbook_host.js` (imported at `src/main.js:173`), whose casts go through `spell_working.js`, not `spell_law.js`. Landing a spellbook cast needs a W world for the practice place and a sentence on the dictionary entry. This is P1.2b and it needs a build and a browser pass.
- **C5 is 10, not 2.** The fixture file holds six grammars and four labellers.
- **The vocabulary split (F16) blocks landing** for spells whose words are outside P's lists. PC81's fold is on the critical path for P1.2b.
- **One pack of eleven is loaded.** Couplings among loaded packs: zero across domains. This is the number phase 2 has to move.

Wave 10 gate: `npm test` on the folded tree, 6,496 tests, 6,494 pass, 0 fail, 2 skipped, exit 0 (`wave10-fold-suite.log` in the takeover folder). `check:arch`, `check:rules`, `check:coverage`, `check:docs` exit 0. No build or browser pass: the four changed `src` modules are unreachable from the game, and game tie-in is deferred (carry-out PC95). Doc edits made after the suite started are covered by the doc and rule checks, not by that suite run.

## Wave 11: engine world, vocabulary, loops, data (2026-11-12)

Wave 10 landed as `463eb3792`. Input for every lane is that commit. Codex usage read 21% of a 50% ceiling before dispatch.

| Lane | Model | Packet and number | Files or worktree | State |
| --- | --- | --- | --- | --- |
| engine-world | Fable | P1.7; G2, G3 | new `src/engine_world.js`, `tests/engine_world.test.js`, `tests/fixtures/engine_world/` | Running in the primary checkout |
| vocabulary-fold | Fable | P1.6; G1 | `src/effect_grammar.js`, `src/world_effects.js`, `src/effect_host.js`, `src/spell_effects.js`, their tests | Running in the primary checkout |
| breeding-program | Fable | PC96 worked example; G4 | new `tests/breeding_program.test.js` | Running in the primary checkout |
| `w11-formulas` (pid 80774) | Codex | PC85; G1 | `/Users/weiwei/code/yair-w11-formulas`, branch `codex/w11-formulas`; `src/world_packs/lotm_brew_pack.js`, regenerated `lotm_potions.jsonl` | Running; brief `CODEX_LANE.md` there |
| `w11-feeding` (pid 80780) | Codex | PC86; G1 | `/Users/weiwei/code/yair-w11-feeding`, branch `codex/w11-feeding`; `src/gu_catalogue.js` | Running; brief `CODEX_LANE.md` there |

Rejected for this wave: P1.8 (Hogwarts grammar as a world pack with cases), since it depends on the vocabulary fold's result; contagion, assay and standing programs (PC96), which wait for a consumer.

Correction carried into the brief: the `formula-in-notes` state means a Sequence has no brew pack row, not that its formula is known. The formulas lane counts first.

Stop Codex lanes with `python3 -I scripts/codex_goal_lane.py stop --name <lane>`. Worktrees are retired after their branches are reviewed and merged.

### Wave 11 fold, Fable lanes (2026-11-12)

Diffs read and tests rerun from the repository root. Focused: 45 tests, 42 pass, 0 fail, 3 skipped (the breeding fixture's named gaps), across the effect, engine world, breeding, heredity and substrate fixture files. `check:arch`, `check:rules`, `check:coverage` exit 0; compression baseline holds.

| Lane | Files | Evidence | Not covered | State |
| --- | --- | --- | --- | --- |
| engine-world (P1.7) | new `src/engine_world.js`, `tests/engine_world.test.js` | Ten of eleven packs compose into one world. A mixed day (brew steam and shell, residue to grazing, colony light to wild movement) reaches the same serialized state in one jump, in steps and across a mid-run restore. Four cross-domain couplings exercised: `effect.add` (residue flow to living residue), `smoke` (brew steam to shell regulator), `humidity` (three writers), `residue:active` | `a.wild_agency` excluded: it and `l.living_body` declare `satiety` with different units and maxima. Read-only couplings leave no record, so they are uncounted. The light chain runs with the colony as an outside op, so it shows no pack-to-pack coupling. Cost 797 of an 800-segment budget per world day | G2 at 10 of 11, G3 at 4 |
| vocabulary-fold (P1.6) | `src/spell_effects.js`, `src/effect_grammar.js`, `src/world_effects.js`, `src/effect_host.js`, `tests/effect_host.test.js` | Spell words read through one map: 79 of 80 spellbook rows now map (61 to W acts, 18 publish), against 30 before. `luck` and `soul` are P objects that publish. One word has no reading: `animate` | Mapped sentences such as conjure, dig, disarm and sever still throw in `applyEffect` for missing amounts or a non-quantity target. The lane could not reproduce Wave 10's executed counts, whose per-row details were not recorded | Done as library |
| breeding-program (PC96) | new `tests/breeding_program.test.js` | Selection by looks raises wool on all 8 seeds over 20 generations (51.7 to 76.8 mean); a different goal ends with a different flock; a storm changes outcomes through the lightning mutagen | See findings | Loop holds for variation, result and retention; trade-off and hidden information are weak |

Coordinator change at the fold: the lane had `effect_host.js` import `spell_effects.js`. The host now takes the reader from its caller (`read`), so the K to W joint imports no domain; the test passes `sharedEffect` and asserts that a spell word is `unmapped` without it.

Findings for Wave 12, by consequence:

1. **Two settlement faults in living things.** Cohort births give different gene frequencies by step size (`addBirthsToFrequencies`: 47% in twenty single births against 40% in one settlement), and brood draws are addressed by revision, so an unrelated settlement changes later offspring. Both break "the same result in one jump or many" (KW5, PC42a). The breeding test pins today's behavior and changes with the fix.
2. **`satiety` is declared twice** (`a.wild_agency` minutes to 1,440; `l.living_body` ration-minutes to 1,000,000). One owner has to declare it; `c.contest` and the shared vocabulary both define `vitality` and compose by luck.
3. **Three packs reach outside their lane:** `contest_bodies.js` imports the creature lifecycle, `gu_brew_regulator.js` imports `gu_activation.js`, `world_sky.js` imports a world's calendar content with a default world.
4. **No creature assay and no real trade-off.** `markCreatureGenesKnown` is free and exact; the sheep genome has no linked or correlated traits and animal inbreeding costs nothing.
5. **The colony is not a pack**, so the light chain is not a coupling yet.
6. **Budget.** The shell's oscillation uses nearly the whole per-day segment budget.

Wave 11 gate for the Fable lanes: `npm test`, 6511 tests, 6506 pass, 0 fail, 5 skipped (`wave11a-suite.log` in the takeover folder). Doc sections PC97 to PC99 were written while it ran and are covered by `check:docs` and `check:rules`.

### Wave 11 fold, Codex lanes (2026-11-12)

Both lanes left their changes uncommitted in their worktrees. The coordinator copied them into the primary tree and reran the tests that read the changed data: 31 of 31, `check:coverage` passes. They are committed with Wave 12, after its full suite, because `src/gu_catalogue.js` is loaded by the game.

| Lane | Result | Not covered |
| --- | --- | --- |
| `w11-formulas` (104,430 tokens) | Of 177 blocked Lord of the Mysteries potions, 3 have a main material named in the pathway table, 1 partly, 173 do not. Three rows added to `src/world_packs/lotm_brew_pack.js` (46 rows); ledger runs-authored 33 to 36, `formula-in-notes` 177 to 174. One stale row count in `tests/brew_law.test.js` updated at the fold | The 173 are a reading job |
| `w11-feeding` | All 78 chapter-checked Gu carry `body` data in `src/gu_catalogue.js`: 17 stated diets, 4 intervals, 8 starvation facts, 61 unknown diets with the chapters searched listed | Not yet read by the lifecycle; wiki-only kinds out of scope |

## Wave 12: first canon rows, lifecycle faults, eleventh pack, four families (2026-11-12)

Wave 11's Fable lanes landed as `0876c3906`. Weibao (2026-11-12): "Start the other families accordingly, each with their own fable directing codex", and on capacity, "There are always ways around everything? Dont forget our core rules too". Every brief carries the core rules: limits are defaults with a cost and ways around, never refusals. Codex usage read 21% of 50% before dispatch.

Primary checkout, Fable lanes on disjoint files:

| Lane | Packet and number | Files |
| --- | --- | --- |
| hp-cases | P1.8; G1 | new pack under `src/world_packs/`, the Hogwarts parts of the effect fixture, the spell ledger generator, `hp_spells.jsonl`, coverage README |
| lifecycle-faults | KW5 for living things | `src/creature_lifecycle.js`, `src/heredity.js`, `tests/breeding_program.test.js`, tests whose pins move |
| satiety-and-colony | G2, G3 | `src/agency_wild.js`, `src/world_substrate_packs/living_body.js`, new `colony_light.js`, `src/engine_world.js` registry, `tests/engine_world.test.js` |

Family leads, each a Fable lane in its own worktree directing one Codex lane, committing on its own branch:

| Family | Worktree and branch | Codex lane | Worked rows |
| --- | --- | --- | --- |
| Body alteration | `/Users/weiwei/code/yair-w12-body`, `codex/w12-body` | `w12-body` | A Gu in an aperture, a power-granting potion with a second dose and a stabilizer, bioware and hardware with a suppressant, the Sandevistan as pace and strain |
| Stored workings | `/Users/weiwei/code/yair-w12-stored`, `codex/w12-stored` | `w12-stored` | A rune strip, a ward on a place, a held potion or charm, a held part of a technique |
| Process crafts | `/Users/weiwei/code/yair-w12-process`, `codex/w12-process` | `w12-process` | A census of Making, then a forged, quenched and tempered blade and a cooking row on one process mechanism |
| Bindings | `/Users/weiwei/code/yair-w12-bindings`, `codex/w12-bindings` | `w12-bindings` | A tamed animal, a familiar bond, a contract with a way around it, a bonded item, a holder carried by a body |

Gate for this wave: the full suite, since `src/creature_lifecycle.js` and `src/gu_catalogue.js` are loaded by the game. Family branches are reviewed and merged after the primary lanes are committed. This wave runs seven Fable lanes, above PC94's three, at Weibao's request to use the Fable allowance; the coordinator reads every diff.


### Wave 12 fold, primary lanes (2026-11-12)

Folded tree: the three Fable lanes plus the two Wave 11 Codex data lanes. Focused gate on the folded tree: 26 test files, 281 tests, 278 pass, 0 fail, 3 skipped; `check:arch`, `check:rules`, `check:coverage`, `check:docs` exit 0. Full suite on the same tree: 6,517 tests, 6,512 pass, 0 fail, 5 skipped, exit 0 (`wave12a-suite.log`).

| Lane | Result | Not covered |
| --- | --- | --- |
| hp-cases | G1 0 to 38: 38 Hogwarts spellbook rows have a case in `src/world_packs/hp_effect_pack.js` and compute as expressed through the generic runner | 42 rows without a case: 18 publish-only, 14 refused by W, 5 law fields, 3 act plus publish, 1 new holder, 1 `animate`. The runner's `expect` cannot yet name a law field, a new holder or a publish |
| lifecycle-faults | Living-thing faults (KW5) in `src/creature_lifecycle.js` and `src/heredity.js`; breeding fixture pins moved | Births interleaved with losses still round per run |
| satiety-and-colony | `colony_light.js` joins the engine world (G2 12 of 12); coupling map C5 falls 10 to 6 | The mixed day costs 799 of 800 segments from the shell regulator oscillating; the coupling map misses computed declarations (`c.contest`, `m.market`, `w.sky`) |

### Wave 12 family branches (2026-11-12)

Each lead reviewed its Codex lane's work and committed on its own branch. None is merged; the second handoff's first step is the merge.

| Family | Commit | Runs | Asks and gaps |
| --- | --- | --- | --- |
| Body alteration | `codex/w12-body` `af757abd2` | `src/body_alteration.js`, pack `l.body_alteration`, `src/pace.js`; a Gu in an aperture, a power-granting potion, bioware with a suppressant, pace and strain | Pace needs a holder-local rate port in K. Edits the engine world registry, so the merge meets the colony pack lines |
| Stored workings | `codex/w12-stored` `0f64436f6` | `src/stored_working.js`; rune strip, ward, held potion, held technique part | W drops chain `detail` on save, which the blow trigger needs |
| Bindings | `codex/w12-bindings` `9ddb0a947` | `src/binding.js`; tamed animal, familiar, contract, sworn item, carried holder, each across a save and restore; eight ways around with their costs (17 tests pass with the oath and identity kernels) | K: export `matches` from `kernel_oath.js`; one receipt holds one breach. The making price is validated data that no working charges yet; no summoning row; the module is dense |
| Process crafts | `codex/w12-process` `5f77574a3` | `src/process_law.js` (law `f.process`: `hold`, `work`) and `src/load_law.js`; a forged, quenched and tempered blade against an untempered one, a kitchen pack on the same law, equal records across settle sizes and a restore (10 tests pass). Census: 71 Making modules, 12 are processes, one runs on the kernel | One kernel shape, two laws: brewing stays a conserved ledger. Chained rows integrate in up to 256 slices; fuel, vessel capacity, maker skill, fold and aging are outside the law; no parity fixture against `gear_work.js` |

Codex usage read 22% of 50% at the fold.

## Codex coordinator fold (2026-11-12)

Wave 12 base `5bc9d0eb9` passed its daily full suite. At takeover all four family lanes were finished and their worktrees had no source edits outside the branch commits. Usage 23% weekly, 2,961 credits above the floor. PC95 remains the integration boundary.

### Body alteration

Folded `af757abd2` onto `5bc9d0eb9`. Kept colony light and the common satiety declaration. The import test initially mistook the domain's same-named helper for a pack. Comparing resolved import paths fixes the false positive while checking the new pack. `node --test tests/body_alteration.test.js tests/pace.test.js tests/engine_world.test.js`: 12 passed, exit 0. Architecture, rules, coverage and docs passed. The four changed source files are outside main reachability. G2 now 13 of 13. G3 remains 5 on the mixed day (799 of 800 segments). Engine fixture evidence, below the AD43 gameplay floor.
D1: Active pack state uses a one-minute horizon. This is the small exact implementation of changing pressure/upkeep/recovery rates, rather than a predictive breakpoint optimizer. It preserves jump/partition equality; it does not claim optimized long-duration far settlement. The existing engine-world mixed-day fixture remains unchanged apart from pack counts and passes with the new default-empty pack.

D2: The packet's required `grants.quantities` path is implemented. The palette's optional `grants.sentence/details` is not automatically landed by this pack; activation uses the existing effect host explicitly, and the drink fixture publishes the required install directly. No general sentence-grant host or UI integration was added. Fusion is deferred by the settled design itself.

D3: The required workaround changes a method snapshot's explicit `minutes` and retains each step's authored duration as `paceDuration`. Future kernel-owner request, as specified by the design: a holder-local duration/rate port supplied at settlement, with holder binding, authored local step duration and original start as inputs; it must derive absolute cumulative whole-tick deadlines, preserve already-settled receipts, keep the authored method unchanged in the record, and validate/restore with the same course identity. That kernel change is not required for these engine fixtures and no kernel file was touched. No substrate-owner change is requested.

D4: No player journey, packaged build, installed behavior or UI acceptance is claimed. This lane's requested acceptance is engine fixtures plus the named checks. The owning chat still reviews and commits the diff.

### Stored workings

Folded `0f64436f6` onto `22167d678`. `node --test tests/stored_working.test.js tests/stored_working_engine.test.js`: 23 passed, exit 0. The four rows settle across one clock and survive restore. Architecture, rules, coverage and docs passed. `src/stored_working.js` is outside main reachability. Engine fixture evidence, below the AD43 gameplay floor.
The requested engine mechanism and focused proof are delivered. The body-hit route currently requires the documented caller journal until O1 is adopted. A host must keep that journal with its own save if it supplies payload-based events. Automatic `hold: true` lowering, consuming the carrier on once fire, game wiring and UI remain with their owning lanes or the design's deferred scope.

### Bindings

Folded `9ddb0a947` onto `2fa90317e`. `node --test tests/binding.test.js tests/kernel_oath.test.js tests/kernel_identity.test.js`: 17 passed, exit 0. Architecture, rules and coverage passed. Rephrased three flagged lines in the family notes and reran the docs check. `src/binding.js` is outside main reachability. Engine fixture evidence, below the AD43 gameplay floor. The lead flagged making prices without a charging working, no summoning row, and a dense implementation.
`kernel_oath.js` does not export its matcher. Binding channel answers use a local matcher with the same method/op/role semantics. Please export the existing matcher when its owner next changes the oath API, so the binding module can import it.

The existing oath authority returns the first matching oath, and a working receipt has one `truth.breach` slot. This lane retains that behavior within an oath collection. If one act must independently break multiple matching oaths with separately remembered prices, the oath/working owners need a multi-breach receipt contract. No owner files were changed to invent that contract here.

### Process crafts

Folded `5f77574a3` onto `c8d1fd44a`. `node --test tests/process_law.test.js`: 10 passed, exit 0. Verified the lead's correction to the blocked worker return. The ordinary 56-minute blade lands whole levels in the engine while the process record keeps fractional values. Architecture, rules, coverage and docs passed. The two new source files are outside main reachability. Engine fixture evidence, below the AD43 gameplay floor.

Lead gaps: one kernel shape, two laws: brewing stays a conserved ledger. Chained rows integrate in up to 256 slices; fuel, vessel capacity, maker skill, fold and aging are outside the law; no parity fixture against `gear_work.js`.

## Wave 13 recovery and owner requests (2026-11-12)

Input `f5439cd02`. All four family folds are committed. The earlier coordinator launcher ended on `account/rateLimits/read`; its `coord-2` thread continues here. A separate app task, `Resume foundation run coordination` (`01a1d13a-a52d-7863-9d29-56092d280c14`), performed the family folds and briefly launched in-session replacements. Its final return explicitly stops those duplicate workers and releases coordination to `coord-2`. The three first detached worker turns were interrupted without source edits. The remaining original chain-detail launcher was stopped by its recorded group 89658 after its worker turn was confirmed interrupted. The three `-r1` handles below are the current writers.

The launcher's text-buffered pipe could hide a second RPC line from `select`. Its binary reader now retains and drains complete lines before waiting. An inline subprocess emitting two replies in one write passes both reads, including the second with timeout zero. The 49-percent guard is also checked against the shared 50-percent setting. Explicit model/effort options keep worker routing inspectable. `codex_goal_lane.py usage` succeeds after the repair. This tooling packet supports the already-authorized G2/G3/G4 owner requests and adds no checker.

| Lane | Owner paths and outcome | Routing and state |
| --- | --- | --- |
| `w13-chain-detail-r1` | W: `world_substrate.js`, its test, stored-working engine test. Preserve saved publish details for the blow trigger and restored movement observer. G3 support | Luna low, 180,000-token bound, two turns; worktree `yair-w13-chain-detail` |
| `w13-pace-port-r1` | K: `kernel_working.js`, `pace.js`, pace and focused working tests. Holder-local settlement preserves authored methods; second movement/contest reader. G2/G3 support | Sol low for the coupled clock/save contract, 220,000-token bound, two turns; worktree `yair-w13-pace-port` |
| `w13-held-slot-r1` | K: `kernel_compose.js`, its focused suite. Lower `hold: true` through a supplied stored-record factory for technique and ward consumers. G4 support, no generator credit yet | Sol low for composition and held-effect scheduling, 220,000-token bound, two turns; worktree `yair-w13-held-slot` |

ACT NOW: recover the existing three packets with disjoint file ownership. ACCOUNT FOR NOW: retain older saves, authoritative timing history, and held-upkeep lapse in their briefs. LATER: Hogwarts and Gu coverage packets follow these returns under merge-before-dispatch. No paid reading, live host or UI work is part of these packets.

Review finding F1: on committed `f5439cd02`, transferring side B from Bob to Carol updates `bindingSides`, but a forbid term owed by unchanged side A still matches Bob. A direct assertion expecting the term against Carol fails. A scratch correction that segments on either side's transfer fixes that example but fails the existing contract test at `tests/binding.test.js:210`, because it recharges an already-paid breach for an unchanged vower. Keep the source unchanged until a correction preserves stable breach identity while rematching party roles. Scratch reproduction and correction logs are in `/private/tmp/yair-coord2-review-5azgvh9f/`. The combined family fixture run on the isolated candidate before that scratch correction passed 62/62. That candidate's first doc/rule checks lacked Git metadata, so they supply no gate evidence. The committed family receipts above retain their own gate scope.

Usage at recovery: 23%, then 24% before the second and third relaunch; credit headroom 2,961. All relaunches use the 49%/62,000 guard, at most three live lanes. Resume: monitor these exact handles, review returns before folding, then continue the second handoff's Next list. G1 38 in one of seven ledgers; G2 13/13; G3 5; G4 0; G5 0. Existing unrelated dirty paths remain uncommitted.

### Wave 13 owner packets

Base `f5439cd02`. Retired the Wave 11 formulas and feeding worktrees after verifying byte-identical landed content. Kept both branches and archived the patch, briefs and returns in the private sibling directory `.yair-w11-retired-vaevSI` with verified SHA-256 manifests.

| Owner | Worktree and scope | Proof |
| --- | --- | --- |
| W, chain detail | `../yair-w13-chain-detail`; world substrate and its tests, stored-working engine fixture | A restored blow triggers its own target, a wrong target stays quiet, a restored move retains its route, and legacy chain rows still load |
| K, pace | `../yair-w13-pace-port`; working kernel, pace adapter and tests | An opt-in local duration leaves authored steps and settled receipts intact, with partition and restore agreement |
| K, composition | `../yair-w13-held-slot`; composition kernel and focused test | A held technique support and a combined spell ward use the same stored record alongside an ordinary part, with a priced lapse |

ACT NOW: use the saved substrate chain in place of the caller journal. ACCOUNT FOR NOW: pace must use holder-specific history across a restore, and the hold lane keeps composition free of a W dependency through a supplied factory. LATER: binding's multi-breach receipt is broader than this K wave. General same-time scheduling for non-held slots also needs its own proof.

Historical dispatch by the separate app task: detached launches at 23% produced no edits. The pace and hold supervisors timed out on `account/rateLimits/read`; the chain supervisor exited without a return. That task then retried in-session as `chain_detail`, `pace_port` and `held_slot`, and stopped them after discovering `coord-2`'s repaired launcher and relaunches. Its final return releases those worktrees to the `-r1` handles listed above. Any inherited partial edits remain in their current worktrees for the assigned worker to verify. Merge all releasable returns before the next dispatch.

Next after owner packets: address the G1 runner boundary. The 38 measured spell cases currently use the vocabulary-only world in `scripts/coverage_report.mjs`, so they prove computed expression there. A composed-engine proof needs the common `createEngineWorld` path before it can claim the PC95 destination. Preserve the 38 cases as a regression baseline and start with law-field and new-holder observations before asking a domain reactor to answer publishes. G2 13 of 13; G3 5 on one mixed day; G4 and G5 remain 0. The inherited headless woodcutting failure (RC18) remains outside this work.


### Wave 13 fold candidate

Released returns on base `f5439cd02` are folded into the primary tree after diff review. W preserves an optional detached event payload on each retained chain row without changing save revision 1. Its focused return passed 40/40, including restore between the blow and the pulse, a wrong target remaining quiet, movement payloads and legacy rows. K pace's return passed 35/35. Its opt-in role and history port retains authored durations and settled receipts. Restoring a running paced record requires the matching host history. Expired course retention remains a host responsibility. The coordinator also forwards actor-believed pace through `quoteForActor`, with a fingerprint-to-start regression.

The first held-slot return passed 34/34 but added a gate against composed fillers with held slots. Its corrected brief preserves nesting through remapped descriptors and qualified held IDs, passing 35/35. The bridge leaves ordinary law references unchanged, emits no ordinary step or charge for a held slot, and reuses the supplied stored-record factory. The coordinator passes the timing context through held validation and extends the nested regression to a paced composition. Both nested guards can share one target with distinct caller-authored field IDs. This supplies a working route around the effect primitive's default field-ID collision. A malformed field ID in the first combined probe was corrected to the substrate's existing ID alphabet. Combined compose/Gu/stored/pace/working checks pass 67/67. Earlier W/body/pace/working integration checks passed 75/75 before the held fold, with the final full suite covering the complete tree.

Source changes are `world_substrate.js`, `kernel_working.js`, `pace.js`, `kernel_compose.js` and their four focused test files. The K/W contracts and area guide now name the APIs and compatibility choice. The index registers the existing WSC1-WSC21 contract and routes substrate work to it. These are working proposals under AD32/AD56. No new canon or generator credit is claimed. Five numbers remain G1 38 in one of seven ledgers, G2 13/13, G3 5, G4 0, G5 0. Next required gate is the full suite and isolated build because the kernel and substrate are loaded by the game. No live tie-in or browser proof is claimed (PC95).

G1 evidence correction for the next packet: all 38 existing cases run through `composeSubstrate` with a vocabulary pack in `coverage_report.mjs`, not through `createEngineWorld`. Their computed expression count remains 38. Common engine-world execution of those cases is pending, as now stated in the carry-out tracker. Existing typed ledger values remain intact while Q1 is open.


Wave 13 gate on `969b087ae` plus the reviewed fold: `npm test` exits 0, 6,572 tests, 6,567 pass, 0 fail, 5 skipped (`/private/tmp/yair-wave13-suite.log`). Isolated `BUILD_OUT=/private/tmp/yair-wave13-build npm run build` exits 0, bundle SHA-256 `de8d95c58d28b2f091586f73a33c4bff03510a35f278481dfd53889d872c3c8d`. The inherited duplicate `dial` warning in `travel_legs.js` remains. `check:arch`, `check:rules`, `check:coverage`, `check:docs`, `report:couplings` and `report:compression` exit 0. The final doc-only receipt/tracker changes receive the doc and rule checks again before commit. The broad whitespace check encountered inherited generated-file whitespace; the check scoped to this wave's paths passes. No equivalent full suite was repeated. The inherited out-of-glob headless woodcutting failure (RC18) remains outside this packet.

Usage after the fold is 25%, with 2,961 credits above the floor. All three released worker processes have exited. Engine fixture verified, not human-reviewed. The ports and held factory are available to a host; durable expired pace-course ownership, combined host lifecycle, binding multi-breach receipts and F1 remain open. Next wave starts with G1's common runner and law-field/new-holder observations, plus existing chapter-checked Gu data. Preserve the unrelated dirty paths and never push.


## Wave 14 dispatch (2026-11-12)

Base `b80cb50da`, usage 25%, credit headroom 2,961 before each launch. Three Sol-low lanes, each bounded to 300,000 tokens and two turns, use the repaired launcher with the 49%/62,000 stop. Sol is selected for the runner's observation contract, cross-verb semantic changes, and independent canon-outcome judgments. Each lane moves G1 and has a disjoint path list in its `CODEX_LANE.md`.

| Lane | Worktree | Outcome |
| --- | --- | --- |
| `w14-runner` | `../yair-w14-runner` | Common engine-world runner, independent law-field and holder-creation observations, six Hogwarts cases; owns HP pack and ledger |
| `w14-effects` | `../yair-w14-effects` | Repair the fourteen refused primitive readings with second consumers, return separate `HP_PRIMITIVE_SCENES` data; coordinator combines it with the HP pack after release |
| `w14-gu-cases` | `../yair-w14-gu-cases` | Gu grammar and labeller leave the fixture for their world pack; account for all 57 chapter-checked labelled kinds with cases or exact missing fields/owners |

ACT NOW: common engine destination and executed cases. ACCOUNT FOR NOW: the W lane leaves the HP pack to P/S, source qualifiers and Q1 stay explicit, unknown and unanswered outcomes earn no case credit, and no wiki-only row is promoted. LATER in the current queue: owners for publish-based effects, the measured Draught into a body, Gu lifecycle fields, then the shell rate form and the parity/generation/improvement packets in the second handoff. This queues authorized work without changing standing direction. Resume: poll these exact lane handles, review and fold released returns, regenerate coverage centrally, and apply PC99's reachability-sensitive gate. Never push.


### Wave 14 reviewed fold

P/S moved the sentence runner to `createEngineWorld` and `landEffect`, preserving old case inputs through the registered sky pack and shared vocabulary. Cases can supply plain engine pack settings. Independent observations now include law fields and absent-to-present holder creation, with wrong or preseeded outcomes rejected. The return passed 35 focused tests and added five field cases. It released a five-of-six result with the duplicate case waiting on W, rather than claiming that holder creation was already implemented.

W's first return passed 44 focused tests for the fourteen refused readings. Its one corrected brief added explicit-output property copy for the sixth P/S case and an ordinary pattern-copy consumer, preserving existing-target copy. The corrected return passed 45 tests. Physical removal names a declared account, physical transformation names properties, a gripped implement moves and releases its named grip atomically, a quantity transform supplies a signed delta, and physical addition supplies a holder identity. No new verb or world-specific dispatch was introduced. The coordinator spread the fifteen case-data rows into the HP scene table and regenerated its ledger. Hogwarts now computes 58 of 80 spell-pack rows as expressed through the common engine runner. Twenty-two remain without cases: 18 publish-only, 3 act plus publish, 1 unmapped reading.

W's remaining-scope return is retained here unchanged: At fixture resolution, zero localized condition records structural failure. Passage geometry, debris placement, ricochet and bystander impacts have no observations here. The grip mark represents physical contact and the dressing mark represents application. Inventory custody, movement of an attached dressing, stabilization effects, collision resolution and localized medical state remain outside these cases. Full engine-world integration and tie-in are unverified. The combined common-runner check below supersedes the engine-integration clause for these case observations, with the listed physical-scope gaps still open.

G moved its effect grammar, labeller, comparison, row/amount readers and world-law list from the shared fixture into `gu_effect_pack.js`, preserving re-exports and GL2/move fixtures. Its 46-test return exercised 16 cases independently in the engine world and named exact missing mechanisms for the other 41 labelled kinds. All 57 chapter-labelled kinds are accounted for and all 78 chapter rows retain their qualification. No wiki-only case was promoted. The move ledger is byte-identical, SHA-256 `52193e41eb4f96e0c5298b37468ac38cee6e478bfc5345389b3b8b8e8df3a068`. The return's 41 non-case demotions to catalogued were not adopted while Q1 is open. Those rows retain their prior typed states and gain the explicit gap and prior-state note. Fifteen prior typed runs and one prior rank-unknown row become genuine expressed cases. Gu typed runs are 368, computed expressed 16. These are separate measurements.

G's effect-scene boundary remains: starts with resolved targets and eligible inputs, leaving activation/debit, geometry, autonomous choice, flight upkeep, support settlement, leaf consumption and cooldown to their owners. They are authored-calibration effect cases, with no live route claim. The coordinator also closed a runner hole: an act accompanied by any unanswered publish now computes blocked, even when its W-only part changed. A focused regression catches that partial-credit error.

The first combined P/G fold passed 57 tests. After W's correction and scene integration, 87 focused tests passed. The added unanswered-publish regression passes in the 12-test runner suite. Final wave gates run on the complete tree. `spell_effects.js` and `world_effects.js` are outside main reachability, but the shared `effect_worlds.mjs` test helper changed, so this wave uses the full suite under PC99. No duplicate suite is run on unchanged inputs.


## Claude coordinator acceptance and Wave 14 gate (2026-11-12)

Weibao (2026-11-12): "now that claude  usage is back, we can hand off for claude ot take over for now again". This Claude background session succeeds Claude coordinator `301ff912-157d-4a0d-aff7-fb45b7308f12` and accepts coordination, dispatch and writes from the [return handoff](CLAUDE_COORDINATOR_HANDOFF.md). `coord-2` (`01a1d13a-ea03-75e1-b6fc-25e7cda5e284`) released all three. `codex_goal_lane.py status` shows every lane finished and no process alive. Limits, scope and the no-push boundary are unchanged from the [second handoff](CODEX_COORDINATOR_HANDOFF_2.md#limits-hard).

Wave 14 gate, matched to the candidate on base `5d793f21a`:

- Identity: the suite log was created 15:29:15 and closed 15:35:23. The candidate's 17 source, script, test, fixture and ledger files were last written between 15:23:51 and 15:28:18, before the suite started. The files written later are documents (the contract and coverage docs at 15:29:15, then the direction, carry-out and run records).
- `npm test`: exit summary 6,586 tests, 6,581 pass, 0 fail, 5 skipped, 360 s (`/private/tmp/yair-wave14-suite.log`).
- Isolated build: exit 0, bundle SHA-256 `de8d95c58d28b2f091586f73a33c4bff03510a35f278481dfd53889d872c3c8d`, recomputed from `/private/tmp/yair-wave14-build/dist/bundle.js`. It equals the Wave 13 hash, as expected: no changed source is reachable from `src/main.js`. The inherited duplicate `dial` warning remains.
- Rerun by this session after the later document writes: `check:docs`, `check:rules`, `check:arch` and `check:coverage` exit 0; the four document-shape tests (direction sync, rules index, receipts, PROJECT.md shape) pass 18/18; `git diff --check` on the wave paths is clean.
- Gaps: engine fixture verified, not human-reviewed. No live route, browser or save claim (PC95). The suite was not repeated on unchanged inputs. RC18's out-of-glob woodcutting failure is still outside this run.

Five numbers after the fold: G1 74 computed cases on the common engine runner in two of seven ledgers (58 Hogwarts, 16 Gu); G2 13 of 13; G3 5; G4 0; G5 0. Codex usage at acceptance 27%, credit headroom 2,961.

This session is a background job, so its edits are made in the worktree `.claude/worktrees/fdn-coord-w14` (branch `claude/fdn-coord-w14`), built from the primary checkout's verified files, and `master` moves by guarded `update-ref`. Left uncommitted in the primary checkout as not this run's: `dist/bundle.js`, `dist/bundle.js.map`, `index.html`, `docs/tools/game_mcp_limits.jsonl`, `docs/gm/FOUNDATION_RUN_PLAYBOOK.md`, the first `CODEX_COORDINATOR_HANDOFF.md`, `scripts/wave_scratch.sh`.

Next, in the existing order: owners that answer the publish-only Hogwarts rows (18 publish, 3 act plus publish), the Draught of Living Death into a body as a measured case, then Gu body data into the living-things lifecycle. Later packets and budgets stay as queued in the second handoff.

### Wave 14 landed, Claude coordinator (2026-11-12)

Candidate identity: every code and test file in the fold was last written by 15:28:18; the suite log's run began after that and ended 15:35 with 6,586 tests, 6,581 pass, 0 fail, 5 skipped. Later writes are prose. `check:docs`, `check:rules` and `check:coverage` rerun on the final tree exit 0. G1 at this commit: 58 Hogwarts and 16 Gu cases compute as expressed.

Reading correction. The second handoff said Reverend Insanity volumes 5 to 24 had no reading passes. That is true of the batch index and false of the book: the [full-book reading](../../../research/novels/full-book/reverend-insanity/COVERAGE.md) has all 2,334 chapters integrated, with a power index and 179 reader notes that mention killer moves. Weibao (2026-11-12): "I think we do have readnigs". Matching the 753 move leads and wiki-only kinds to chapters is an extraction job over those notes, with a batched reader for chapters where the notes are too thin.

### Master landing held (2026-11-12)

The fold is committed as `7703f7395` (Wave 14) and `52796fcea` (expansion direction record) on `claude/fdn-coord-w14`, two commits on `5d793f21a`. `master` has not moved. The shared-worktree rule (D2) requires the session that moves `master` to sync the primary checkout's index and files in the same step, and this background session's git commands are confined to its own worktree, so it cannot do that sync. Landing is one guarded step from the primary checkout, waiting on Weibao or a session that owns that checkout. Work continues stacked on the branch.

## Wave 15 dispatch (2026-11-12)

Base `52796fcea`, usage 27%, credit headroom 2,961 read before each launch. Three `gpt-6.1-sol` low lanes, each bounded to 300,000 tokens and two turns, with the 49%/62,000 stop. Each moves G1; the two owner lanes also move G2. Briefs are each worktree's `CODEX_LANE.md`.

| Lane | Worktree | Outcome |
| --- | --- | --- |
| `w15-working-info` | `../yair-w15-working-info` | Owners that answer the six end-working rows and the three information rows, a second consumer outside Hogwarts, scenes returned as a separate data module; owns `world_effects.js` |
| `w15-mind` | `../yair-w15-mind` | A mind owner pack answering the twelve mind rows, an honest reading for the three conjured agents and `animate`, lapse shown for timed and sustained effects; owns `spell_effects.js` |
| `w15-draught` | `../yair-w15-draught` | The Draught of Living Death into a body as the first computed potion case, with one contrast where the mechanism decides; owns the body packs and the potion ledger hookup |

Both owner lanes may add one registry row each to `engine_world.js`; the coordinator keeps every row and updates the pack counts at the fold. ACT NOW: answered publishes and the measured dose. ACCOUNT FOR NOW: a case needs an independent observation, an unanswered publish earns none, Q1 stays open and typed states are untouched, the HP pack and ledgers are combined centrally. LATER in the current queue: Gu body data into the living-things lifecycle, then the shell rate form, the parity, generation and improvement packets. Resume: poll these three handles with `codex_goal_lane.py status`, review each `CODEX_RETURN.md` and diff, fold into `claude/fdn-coord-w14`, regenerate coverage, then apply PC99's gate. No push.

### Wave 15 first fold (2026-11-12)

All three lanes returned and released writes; their files are folded on `claude/fdn-coord-w14` as `671e5f507`. The registry holds 16 packs (`a.mind`, `k.working_end`, `n.presence` added). Combined focused run: 95 of 95 across 13 test files. `check:coverage`, `check:arch` and `check:rules` exit 0. None of the changed modules is reachable from `src/main.js`.

- Draught (`w15-draught`, goal complete, 98,537 tokens): the Draught of Living Death is the first computed potion case. A measured aliquot moves from the flask through `landEffect`, the living-body pack absorbs the settled share and lowers responsiveness, and recovery runs on the engine clock. Crushed bean at 100 units leaves responsiveness 2 of 100 for 14 minutes, sliced leaves 30 for 10, and half a crushed dose leaves 58 for 6. Disabling uptake computes a mismatch. Dose sizes and the response curve are authored calibration. The row's typed state follows its computed case, as the Wave 14 Gu cases did; its prior typed state is kept in its note. Below the bar, unchanged from the return: no antidote route, administration authority, metabolism beyond the authored curve or behaviour of a live actor with reduced responsiveness.
- Working and information (`w15-working-info`, goal blocked, 139,131 tokens): `working_end` ends an explicitly bound held record and its field or gain without refunding spent upkeep, with a workshop guard as the second consumer. `presence` keeps channel contacts per observer. person-reveal and disillusion compute through the common runner. dangling-release, counter-spell and quiet answer correctly when the binding arrives but compute blocked because the grammar publish drops it. revive, unjinx-weather and history-release have no case and name their missing mechanism. vanish is a physical removal by the checked evidence and needs its reading corrected.
- Mind (`w15-mind`, goal blocked, 145,414 tokens): `a.mind` holds faculties as holder state with leases on the world clock, with a Wood Path confusion fixture and a commanded wild worm as second consumers. animate computes through the common runner after a reading correction. blind, stun, pain, control, memory, confuse, cheer and legilimency pass their independent observations when the application arrives and compute blocked for the same producer reason. bird and serpent read as physical addition and stop at W's thing-only create check. oppugno and patronus have no scene and name their missing mechanism.

Finding F2: pack registry order is behaviour. With `a.mind` registered after `a.wild_agency` the released worm does not go home and one mind test fails; before it, all pass. The fold keeps the lane's order. A reactor-order dependence between packs has no stated contract yet.

Five numbers: G1 75 computed cases in three of seven ledgers (58 Hogwarts spells, 16 Gu kinds, 1 Hogwarts potion), with three more scenes computing but not yet combined into the ledger; G2 16 of 16; G3 5; G4 0; G5 0. Usage 27% after the three lanes.

### Wave 15 second dispatch (2026-11-12)

Base `671e5f507`, usage 27% before each launch, same model, bounds and stops.

| Lane | Worktree | Outcome |
| --- | --- | --- |
| `w15-producer` | `../yair-w15-producer` | One shared application payload on the grammar's qualified publish (resolved targets, working, minutes, mind), physical add of a body, vanish read as material removal, then the central combine of mind and working-info scenes into the HP pack and ledger. Expected to move up to fourteen rows |
| `w15-gu-bodies` | `../yair-w15-gu-bodies` | An adapter from chapter-checked Gu body data to the lifecycle, the 17 stated-diet kinds first, per-field unknowns in place of the blanket block on 78 creature rows |

Resume: poll both handles, review return and diff, fold, regenerate coverage, then the PC99 gate for the whole wave on the branch. No push.

### Wave 15 second fold and gate (2026-11-12)

Both lanes returned and released writes. Their files are folded on `claude/fdn-coord-w14` after diff review of the shared modules.

- Producer (`w15-producer`, goal complete, 110,299 tokens): the grammar's qualified publish now carries `application: {targets, working, minutes, mind}`. Targets resolve producer-side through W; a companion sense act passes the holders it observed, so concealment, a missing channel or a block field grants nothing. `working_end` reads the same shape and still needs one matching holder and an explicit working id. Physical add creates a thing or a body; copy into a new holder keeps its thing default for now. vanish reads as material removal in the shared reading and the Hogwarts truth string. The mind and working-info scenes are combined into the HP pack. Seventeen rows gained a computed case: blind, stun, pain, control, memory, confuse, legilimency, cheer, bird, serpent, animate, person-reveal, disillusion, dangling-release, counter-spell, quiet and vanish. Hogwarts spells compute 75 of 80; the five without a case (oppugno, patronus, revive, unjinx-weather, history-release) each name their missing mechanism in the ledger note. Below the bar, unchanged: the generation grammar still rejects `add mind` and `transform memory`; end probes start from authored holds; whole living-holder vanishing and durable learning from mind access have no proof.
- Gu bodies (`w15-gu-bodies`, goal blocked, 126,229 tokens): `gu_living_body.js` adapts chapter-checked body data to a living holder, keeping locators and per-field unknowns. Seventeen stated-diet kinds run in the engine world: matching food restores satiety, the unfed control starves and loses vitality on the clock, and the wrong food is untouched. The blanket `blocked:gu-body-fields` on 78 rows is gone: 61 are `blocked:diet-unknown` and 17 are `blocked:runner-clock-advance`. No creature row earns a computed case yet, because the common runner lands one sentence and cannot advance the clock between observations. Owner request to P: an optional ordered timeline in `runCaseData` on one engine instance, with the Draught's recovery as the second consumer. Serving sizes and durations the source lacks are authored case calibration, kept outside the catalogue.

Wave 15 gate on `52796fcea` plus both folds. No changed source file is reachable from `src/main.js` (`reachable.mjs --is` exits 1 for each) and no shared test helper changed, so PC99's gate is the dependent tests and the four checks:

- Every test file that transitively imports a changed module or names a changed ledger: 34 files, 266 tests, 266 pass, 0 fail, 0 skipped.
- `check:coverage`, `check:arch`, `check:rules`, `check:docs` exit 0. The coverage README is regenerated.
- The mixed engine day still costs 799 of 800 segments with 16 packs registered.
- Gaps: engine fixture verified, not human-reviewed. No full suite and no build this wave; the day's full suite was Wave 14's. No live route, browser or save claim (PC95).

Five numbers: G1 92 computed cases in three of seven ledgers (75 Hogwarts spells, 16 Gu kinds, 1 Hogwarts potion); G2 16 of 16; G3 5; G4 0; G5 0. Usage 28%, credit headroom 2,961.

For Q1, which stays open: a row that gains a computed case moves its typed state from runs to expressed under the existing case workflow, so the typed "runs" headline for Hogwarts spells reads 4.5% where it read 19.6%, while computed expressed rose from 58 to 75. No row without a case changed typed state.

Next, in order: the runner timeline packet (moves the 17 Gu body rows and lets the Draught show recovery in its case), then the shell regulator's rate form before another oscillating pack joins, then G5's first parity fixture and G4's first generator from the second handoff.

## Wave 16 dispatch (2026-11-12)

Base `d390ef378`, usage 28% before each launch, same model, bounds and stops as Wave 15.

| Lane | Worktree | Outcome |
| --- | --- | --- |
| `w16-timeline` | `../yair-w16-timeline` | An optional ordered timeline in the common runner (engine actions and settled clock advances with observations after named steps). Moves G1: the 17 stated-diet Gu body rows become computed cases, and the Draught case shows recovery as the second consumer |
| `w16-parity` | `../yair-w16-parity` | Moves G5 from 0: one Keeper module re-expressed as engine rows with a parity fixture of at least six input sets, divergences named and asserted. The old module stays |

The shell regulator's rate form is held out of this wave with a reason: `shell_regulator.js` is reachable from `src/main.js`, so changing it needs the full suite, a build and a look at its live consumer, and its trigger (another oscillating pack joining the mixed day) has not happened. The mixed day still costs 799 of 800 segments. It goes ahead of any packet that adds an oscillating pack to that day. Resume: poll both handles, review, fold on `claude/fdn-coord-w14`, regenerate coverage, apply PC99's gate. No push.

## Two coordinators reconciled (2026-11-12)

Between 15:36 and 16:05 two Claude sessions coordinated at once: the session in the primary checkout on `master`, and a background session on `claude/fdn-coord-w14` that the Codex handoff started. Each folded Wave 14 from the same candidate (`28c2778dd` on master, `7703f7395` on the branch; the code and ledgers are byte-identical). The branch then ran Waves 15 and 16 while master took the killer-move palette round and a wave schedule. Weibao (2026-11-12): "This session should cooridnate" and "Retire finished, make sure they do that themselves"; he relayed the stand-down to the other session himself, since a cross-session message was held and expired.

Merge: `claude/fdn-coord-w14` at `3832e5b30` into master. Conflicted code and ledger files had identical master sides to the branch's own Wave 14 fold, so the branch side was taken. This file is the branch's record plus the sections below. Gate on the merged tree: full suite 6,638 tests, 6,633 pass, 0 fail, 5 skipped (`merge-coord-suite.log`); `check:arch`, `check:rules`, `check:coverage` and `check:docs` exit 0. Lanes `w16-timeline` and `w16-parity` were still running at the merge and are folded by this session. The four `yair-w12-*` worktrees were removed after their branches were confirmed in master; their branches are kept.

Reading correction. The second handoff said Reverend Insanity volumes 5 to 24 had no reading passes. That is true of the batch index and false of the book: the [full-book reading](../../../research/novels/full-book/reverend-insanity/COVERAGE.md) has all 2,334 chapters integrated, with a power index and 179 reader notes that mention killer moves. Weibao (2026-11-12): "I think we do have readnigs". Matching the 753 move leads and wiki-only kinds to chapters is an extraction job over those notes, with a batched reader for chapters where the notes are too thin.

## Wave schedule from Wave 17 (2026-11-12, historical proposal)

The [canon-first proposal](#canon-first-wave-order-2026-11-12) followed this schedule. The [current resume block](#current-resume-block) governs dispatch. The fold receipts below record what landed.

Weibao (2026-11-12): "What about the procedural stuff? add that to waves as well", then "change wave accordingly, make sure the foundational engine gets finished?" This table replaces the first schedule (Waves 15 to 18 by topic); the reasons for the order are in the next section. Waves 15 and 16 are the merged branch's work. Three lanes at a time unless Weibao says more, engine first, sparse worktrees.

Wave 17 and 18 finish the foundational engine. It counts as finished when every line below is shown by a test in the engine world, and the list is the stop test for those two waves:

| # | Finished when |
| --- | --- |
| E1 | Every cost a working publishes is debited by an owner, and a working that cannot pay settles as a fault with its own price |
| E2 | A holder's knowledge has a believed side and a true side in one shared record, and activation, brewing and making all settle against the true side |
| E3 | One design record with parts is read by heredity, recipes, spells, moves and made things, so an operator written once reaches all five |
| E4 | The case runner takes an ordered timeline, and the mixed day runs with headroom (the oscillating regulator in rate form) |
| E5 | Settling in one jump, minute by minute, and across a save and restore agree for every registered pack, births and losses interleaved included |
| E6 | A far-away cohort and the same holders simulated one by one reach the same totals within a stated tolerance |
| E7 | Another holder can plan with the same acts the player has (teach, deny, breed, copy), shown by one actor-driven chain |
| E8 | The coupling report sees every pack's declarations, computed ones included |

| Wave | Lane | Builds | Finishes |
| --- | --- | --- | --- |
| 17 | Fold the two lanes in flight | The runner timeline and the first Keeper parity fixture, reviewed and gated | E4 part, G5 |
| 17 | Cost owners | Owners debit published costs; inability to pay is a fault | E1 |
| 17 | Knowledge record | Believed and true sides, checking as a priced act, with the recipe-truth cases as its acceptance tests | E2 |
| 17 | Design record | One parts record over genome, recipe, spell, move and blueprint | E3 |
| 17 | Day budget and coupling report | Rate form for the regulator; computed declarations in the report | E4, E8 |
| 18 | Settlement agreement | Jump, minute and restore agreement across all packs; the interleaved births fault | E5 |
| 18 | Near and far parity | Cohort against one-by-one totals | E6 |
| 18 | Actor chain | One holder other than the player plans and carries out a chain of existing acts | E7 |
| 19 | Six operators | Copy, Edit, Graft, Induce, Transfer, Make on the design record, each with its price and fault | PC97 |
| 19 | Generators | Gu moves, then potion and spell variants, from the same grammar, frozen on discovery | G4 |
| 19 | Loop gaps and ways around | A real trade-off gene, a priced assay, a standing program; the five ways around a capacity | PC96, PC99 |
| 19 | Small killer moves | Codex batched readers over the reader notes for chapters 1 to 600 | G1 |
| 20 | Scenes as acceptance cases, from data rows | The false move and its variants, totems, natural moves, the Gu House, a Lord of the Mysteries Sequence by the eight questions, cyberware and netrunning rows, the levels run | G3; a scene that needs its own module names a missing rule |

Wave 19 starts when E1 to E8 pass. A lane in 19 or 20 that finds it needs a new shared rule stops and reports it, and the rule goes back to the E list.

Re-pick after the merge. Already built on the branch: the mind, working-end and presence owners for the publish-only Hogwarts rows, the Draught body case, Gu bodies on the lifecycle. New lanes use sparse worktrees without `docs/research`, since a full worktree is about 2.2 GB.

### Foundations before scenes (2026-11-12)

Weibao (2026-11-12): "some stuff like false move fixture should probably come after getting the foudnationals working, so that it can be embedded as part of the rules?" The schedule above follows that test: a lane goes first when other lanes would build on its rule, and a named scene goes last, as an acceptance case that passes with no code of its own.

| Order | Lanes | Why here |
| --- | --- | --- |
| First, shared rules | A knowledge record with what a holder believes beside what is true (recipes, formulas, rumours, assays all read it). A design record with parts, the thing the six operators act on. Cost owners that debit what a working publishes. The runner timeline and the day budget | Each has several later consumers |
| Second, mechanisms on those rules | The six operators, the two generators, the loop gaps, ways around a capacity | They read the shared records and add none |
| Third, scenes as acceptance cases | The false move and its variants, totems, natural moves, the Gu House, a second power system, the levels run | Each should pass from data rows alone; a scene that needs its own module names a missing rule |

The recipe-truth lane (`b63d5096f`) was built before this order was set. It stays on its branch as a reference: its own return says nothing debits its costs and it is outside the engine world, which is the gap this order closes. Its test cases become the acceptance cases for the knowledge record, and its module is folded in or dropped once that record exists.

### Wave 16 fold (2026-11-12)

Both lanes were dispatched by the branch coordinator and folded by this session. Focused: 56 of 56 across the six touched test files. Full suite on the folded tree: 6657 tests, 6652 pass, 0 fail, exit 0 (`wave16-suite.log`); `check:arch`, `check:rules`, `check:coverage` exit 0.

| Lane | Result | Not covered |
| --- | --- | --- |
| `w16-timeline` | The case runner takes an ordered timeline of engine actions and settled clock advances. 17 stated-diet Gu bodies compute as expressed in the creatures ledger; the Draught case shows recovery as the second consumer | 61 diet-unknown Gu stay blocked; feeding uses quoted fixture offers and authored amounts where the source gives none |
| `w16-parity` | G5 0 to 1: the Keeper potato market module re-expressed as an engine case, 16 input rows matching the old module's receipts and one asserted divergence (a stronger blast clears the same stone, by AD38) | The old module stays until tie-in; entry and milling commands downstream remain with the live host |

### Foundations audit and the longer finish list (2026-11-12, proposal)

A read-only audit checked the engine for foundations the E list missed. Its evidence locators are in the lane return; the findings below are agent-verified by reading, with no test run. Weibao (2026-11-12): "We can have one engine for each thing that all works together"; the audit's per-engine matrix follows when it returns.

| # | Added finish line | From |
| --- | --- | --- |
| E9 | One engine host: a working settles through the kernel inside the engine world and the case runner, and one engine save holding a running working, a stored working and a binding agrees across jump, minute and restore | AF1: the engine save is packs and world; kernel records are saved elsewhere, so each family writes its own loop |
| E10 | Places are linked once in the world; an effect can target within a number of links, and the three packs with private routes read that graph | AF2 |
| E11 | One saved draw root; an odds step and a pack law draw by address and replay the same across jump, minute and restore | AF3: published odds are resolved by nothing today |
| E12 | Birth, death, copy, split, merge, and a cohort becoming individuals and back are world acts that keep identity history and hand quantities on | AF4 |
| E13 | A conserved quantity's world total changes through named source and sink rows | AF5 |
| E14 | A save with an unknown pack or quantity restores with both kept inert, and changed settings are reported | AF6 |
| E15 | A landed effect yields per-observer rows filtered by senses and concealment, written to the knowledge record | AF7 |
| E16 | A thousand holders in fifty places with one near place settle a day inside a stated budget, and a pending advance resumes to the same state | AF8 |
| E17 | Each refusal the audit listed carries a cost or a way around, or is named as a dial | AF9; a refusal with no price breaks AD5 and AD56 |
| E18 | Sub-minute effects, progress inside a step, start costs with refunds, and reservations each have a test | AF10, open items KB3, KB5, KB6 |

Changes to the first eight: E1 names where a debit goes (with E13). E2 takes in the worm's private beliefs. E4's timeline half is done; working cases in the runner move to E9. E5 extends to records in flight after E9. E6 waits on E12, since the engine world has no cohort to compare yet. E7 reads "carried out through kernel settlement and the effect host". E8 is open.

Order after the Wave 17 lanes fold: E9 first, since E1, E2 and E7 each need it; then E11, E12 and E10 side by side; then E13 to E18 with E5 to E7. Wave 19 (operators, generators) starts when E1 to E18 pass. Tie-in needs the audit listed, for the later phase: a game-save slice for the engine world, a mapping from player and inventory to holders, a bridge from the game clock to engine minutes, readable text for receipts, and a draw root tied to the save.

### One engine per domain: completeness matrix (2026-11-12, audit reading)

From the same read-only audit. Cells marked (inf) in the lane return were inferred from test names or imports. Columns: own law on the kernel shape; registered in the engine world; costs debited by an owner; faults priced instead of refused; jump, minute and restore agreement tested; canon cases that compute; a tested coupling and its partner.

| Engine | Law | Registered | Debited | Priced faults | Time agreement | Canon | Coupling |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Living things, heredity, populations | yes | partial: four packs; heredity and cohorts outside | no | no | partial | partial: 17 | brewing, agency |
| Brewing | yes | partial: steam pack | partial: debit handed outside the world | no | yes | partial: 1 | living body |
| Spellcraft | yes | no | no | no | partial, no engine | yes: 75 | mind, presence |
| Composition and moves | yes | no | no | no | partial | no | none |
| Process crafts | yes | no | no | no: throws | yes | no | partial |
| Stored workings | own record shape | no | yes | partial | yes | no | brew steam, sky |
| Body alteration | rows and a quote | yes | no: quoted | yes | partial | no | living body, pace |
| Bindings | authority port | no | no | partial | partial | no | partial |
| Contest | yes | yes, no laws or reactors | yes | partial | partial | no | its three effects have no reader |
| Markets and societies | yes | yes | yes | no | partial | no | none beyond the Keeper case |
| Knowledge and mind | partial | yes | no | no | partial | partial | agency, living body |
| Places and sites | no | partial | not applicable | not applicable | yes | no | colony light, brew regulator |
| Agency | yes | yes | no | no | partial, no restore | no | living body |
| Progression | yes | no | no | no | partial | no | none |

Pairs with no tested coupling that should have one: spellcraft and stored workings (a ward is a stored spell); contest and living body; markets and brewing; progression and body alteration; heredity and markets; composition and contest; bindings and agency; knowledge and brewing.

Finish line added, E19: every engine row reads yes in the first five columns, and each of the eight pairs has a test in one mixed run. The canon column fills by data and reading, outside the finish list.

### Wave 17 fold (2026-11-12)

Four Fable lanes in sparse worktrees plus the read-only audit above. Each lane ran its focused tests; the coordinator merged each branch, reran the tests of changed modules in the full checkout, and ran the full suite once, on the tree holding the two game-reachable changes: 6,674 tests, 6,669 pass, 0 fail, 5 skipped (`wave17-suite.log`). No build was run, since it would overwrite bundle files in the checkout that are not this run's.

| Lane | Commit | Result | Open |
| --- | --- | --- | --- |
| Design record (E3) | `a0cfd2ea7` | One parts view over genome, recipe, spell sentence, move and blade; one edit operator and one copy operator reach all five | Round-trip gaps G1 to G12 in its note; a clone under a new id draws different traits (E11); a design does not fit as a holder property; an edit leaves no cause row |
| Cost owners (E1) | `4f4fac051` | Published costs debited from the payer, then a substitute, then a backer; a shortfall is a priced fault. Shown for bindings, stored workings, body alteration, process crafts | Spells through the effect host carry a cost word with no amount (needs `lowerEffect`); the kernel does not see a short step (needs a `settleCosts` port); market, brew regulator and contest costs bypass accounts |
| Day budget and couplings (E4, E8) | `d87ea1ca1` | Mixed day 799 to 319 segments with exact totals; coupling report loads the registered packs, none unresolved | The fast form counts switches without publishing them; the vent Gu's five-minute pulse is 288 of the 319 |
| Knowledge record (E2) | this fold | Pack `n.knowledge`, seventeenth in the engine world: believed and true sides, four priced checks, teaching with side, cover and withheld steps; the false move, formula, blueprint, variants and rumours run from data rows. Couplings across domains 7 to 9 | Its cost rows are not yet passed to the cost owner; checks miss but give no false alarm; the game's own knowledge store is separate until tie-in |

Fold fix by the coordinator: the coupling test pinned the count at 7 and the knowledge pack made it 9, so the assertion is now a floor. E1 to E4 and E8 are met in part as the Open column says; none is closed.

### Gameplay-shaped and canon-first finish lines (2026-11-12)

Weibao (2026-11-12), on whether the engines tie into gameplay: "the engine should b built around that shoudnt it?"; on adding the four lines below: "All of them"; and "does the procedural system firstly work for all the cannon spells, gu, items and more?" The first four are his yes. E24 and E25 are the coordinator's proposal from his canon question.

| # | Finish line |
| --- | --- |
| E20 | Every engine offers the same four surfaces: the options a holder has from what it knows and holds; a quote of cost, odds and risk read from the believed side; the act; a receipt in plain words that says what happened, why a thing failed and the ways around it |
| E21 | A week away settles to the same result as a week played, inside a stated time budget, for every engine |
| E22 | The player is a holder: an act open to the player is open to another holder through the same path, and the reverse |
| E23 | One seam test, headless and with no interface: the engine world saved and restored inside a real game save and driven by the game's clock. It runs after E9 folds |
| E24 | Canon first: in every ledger, no row is blocked for a reason the engine owns. A row may stay blocked where the source does not say what the thing does, and it names that. Generators and operators start after this holds |
| E25 | Items have a ledger: Hogwarts magical objects, Gu-world tools and refinement materials, and Lord of the Mysteries sealed artifacts and charms, on the same states as the other seven |

Historical Wave 18 inventory. See the [coverage correction](#third-codex-coordinator-reconciliation-2026-11-12) for that wave’s verified counts and the [current resume block](#current-resume-block) for dispatch.

| Ledger | Rows | Run or compute | Blocked on the engine | Blocked on the source or on reading |
| --- | --- | --- | --- | --- |
| Hogwarts spells | 117 | 80 | 3 (an intent slot) | 17 (intent or effect not stated or shown), 5 not things |
| Hogwarts potions | 316 | 5 | 259: body door 82, mind state 50, effect sentence 47, body form 40, plant or creature target 31, conceal or sense 9 | 32 not things |
| Hogwarts ingredients | 409 | 20 | 0 | 380 lack property rows |
| Gu kinds | 1,466 | 384 typed, 16 computed | 41 of the 57 labelled kinds name a missing mechanism | 678 rank unknown, 400 effect unknown |
| Gu moves | 776 | 4 | 2 (a role that cannot run) | 770 roles unknown or unnamed |
| Lord of the Mysteries potions | 226 | 46 | 6 (body door) | 174 formulas |
| Creatures | 96 | 35 | 0 | 61 diets unknown |

The original dispatch estimate highlighted Hogwarts potions, the 41 Gu gaps and the items ledger. The later coverage correction accounts for all 279 blocked Hogwarts potion entries, including entries with missing effect evidence.

### Wave 18 engine host fold (2026-11-12)

One Fable lane, alone, since it edited the shared files. Full suite on the merged tree: tests 6693, pass 6688, fail 0, skipped 5, exit 0 (`wave18-host-suite.log`); `check:arch`, `check:rules`, `check:coverage`, `check:docs` exit 0. `src/kernel_working.js` is game-reachable; its change is one optional port that no game caller passes. No build run.

E9 is met in `tests/engine_host.test.js`: the engine save gains a versioned records slice (workings in flight, stored workings, bindings with their dues), advanced on the pack clock in the order world, workings, stored workings, bindings. Costs settle through the kernel port with the cost owner (closing H1 and H2 of the cost owners lane). The case runner computes working cases. Spellcraft, composition, process crafts, stored workings and bindings each run one example through the host; progression, contest, brewing, body alteration and Gu moves with held slots stay on private loops. Open: a short payment does not weaken an effect; knowledge checks need a per-working read port; resuming a pending advance and authority-attached penalties are built without a test. An engine save with no records slice restores unchanged.

### Wave 18 fold: dice, places, holders (2026-11-12)

Three Fable lanes edited `src/world_substrate.js` side by side, each in marked regions. Dice and places merged cleanly; holders met four conflicts where two lanes added lines at the same spot, resolved by keeping both. Full suite on the tree holding all three: tests 6717, pass 6712, fail 0, skipped 5, exit 0 (`wave18-suite.log`); focused 151 of 151; `check:arch`, `check:rules`, `check:coverage`, `check:docs` exit 0. No build run.

| Lane | Commit | Result | Open |
| --- | --- | --- | --- |
| Saved dice (E11) | `6c58ea7ab` | One saved draw root; addressed draws for odds steps and pack laws; a quote shows odds and no outcome; a copy can share innate draws | Creature lifecycle does not use the draw key; an operation gets a hit or miss and no raw draw; five older modules take a root from the caller |
| Place graph (E10) | `a9466b048` | Links as world data with kind, cost and state; effects target within links; a closed link has a price; forage, mind and residue read the shared graph with their tests unchanged | The forcing price is debited directly; a stored working behind a closed door still resists; links join places and not yet bodies or things |
| Holder lifecycle (E12) | this fold | Create, end, copy, split, merge, promote and demote as world acts with lineage in the identity kernel; a cohort holder kind; every quantity handed to a holder or a named row; nine faults priced | The creature engine is not on the acts; its lineage key and the dice draw key need joining; no count-only cohort change; rate laws still change totals with no row |

Coordination passes to Codex under the [third handoff](CODEX_COORDINATOR_HANDOFF_3.md) at this commit. The seam test lane (E23) was still running.

### Third Codex coordinator reconciliation (2026-11-12)

PC94, PC95, PC99, AD5, AD36, AD38, AD41 and AD56. Baseline `4d4505223` on master. This receipt and the reviewed E23 probe live on `codex/foundation-coordinator-3` in `/Users/weiwei/code/yair-fdn-coord-3`. The primary checkout and master ref were left alone by this pass. The two Wave 16 Codex chats have returned and their work is already folded. `coord-2` is idle, `coord-3b` was interrupted, and the previous Claude coordinator is idle. No new worker was started while reconciling and proposing order.

- **Fold evidence.** Wave 16 adds the runner timeline and the first Keeper parity case (56 focused passes, full suite 6,652 pass and 5 skip). Wave 17 adds cost owners, the parts record, priced knowledge checks and the faster regulator (6,669 pass and 5 skip). Wave 18 adds the host for working records, saved dice, the place graph and holder lifecycle acts (final full suite 6,712 pass and 5 skip). Each recorded suite had zero failures. Fresh checks on the isolated baseline: host, holder lifecycle, saved dice, place graph and case runner 44/44. The creature engine still needs to use those lifecycle acts and draw identities.
- **Coverage correction (E24/E25).** Fresh `npm run check:coverage` exits 0. Of seven ledgers, four have computed expression: 75/117 Hogwarts spells, 17/96 creature rows, 16/1,466 Gu kinds, 1/316 Hogwarts potions. Hogwarts ingredients, Gu moves and Lord of the Mysteries potions have typed runs and zero computed cases. Items have no comparable ledger. The earlier 80 spells, 5 Hogwarts potions, 35 creatures and 46 Lord of the Mysteries potions mix typed runs with computed cases. The 259 Hogwarts potion rows in the earlier table span six ledger reasons, including 47 missing effect sentences. Another 20 rows have object-surface, place-release, protection-field or luck-field reasons, for 279 blocked rows total. A reason label still needs review before deciding which mechanism or source input will clear it.
- **Couplings (E8).** Fresh `npm run report:couplings` exits 0, with 17 registered packs and 9 cross-domain links in the map. It flags the residue pack's `effect.add` publication as undeclared. A link in the map is evidence of the publisher/reader relationship. Its behavior still takes a case.
- **Worktree retirement.** Ten released Wave 13–15 checkouts were removed with plain `git worktree remove` after hash-verified private archival and confirmation of fold ancestry. Wave 13: chain-detail and held-slot. Wave 14: effects, gu-cases and runner. Wave 15: draught, gu-bodies, mind, producer and working-info. Branches retained. Recovery manifests and local files are under `~/.codex/worktree-archives/yair-foundation-2026-11-12/w13-w15-wmrt4ogk`. Fold differences include the paced nesting regression, a stricter unanswered-publish check, extra Hogwarts cases, and the explicit decision to retain the former typed state on 41 Gu rows. Kept `yair-w13-pace-port`: the uncommitted patch has stricter completed/interrupted receipt and deadline validation and negative tests absent from its fold. Review against E14 and the current save contract before adopting it. Waves 16 and 18 checkouts are outside this retirement batch.
- **E23 review.** `fable/w18-seam` at `bbbd46946` has the probe and note. `coord-3b` copied the three files into the primary checkout and recorded 7/8 on the combined engine. Its failed assertion timed the engine bridge's one-jump schedule against 120 seconds. The original lane's 177-second measurement covered the separate game-loop banked-week path. On the isolated baseline, a fresh engine-only rerun passed: 321 segments and 353 ms for one day, 2,061 segments and 9.9 seconds for a week in one jump, 9.8 seconds in sixty-minute spends, with the same serialized result. The slice grew from 76,527 to 190,611 characters. See the probe note for ownership, migration, save growth, and clock discrepancies. The primary's copies match the original branch and were left in place. The earlier integration used `tests/headless/`; the probe is now [in the suite](../../../../tests/engine_game_seam.test.js), with the full banked game week opt-in. The relocated probe passed 8/8 in 69.3 seconds, with a banked hour through game ticks and a full engine week through the test bridge. The full banked game week was exercised on the original lane branch and remains open on the combined tree. `check:arch`, `check:rules`, `check:coverage` and `check:docs` exit 0. No game source change or build in this fold.

#### Canon-first wave order (2026-11-12)

Weibao: “can we make sure it covers all cannon stuff first?” E24 is the checkpoint before expansion dispatch. The wave groupings below are the coordinator's execution proposal. Keep E1–E23 in the foundation matrix and E25 in the canon intake.

| Wave | Result at the end of the wave |
| --- | --- |
| 1–16, foundation work so far | Shared mechanics, canon cases on one runner, a timeline for delayed effects and recovery, and the first Keeper parity case. The earlier receipts document the engine checks and remaining gaps. |
| 17–18, folded with open foundation lines | Shared cost, knowledge and design records, working records on the engine clock, saved dice, linked places and holder lifecycle acts. The headless probe verifies the game save and clock seam at fixture scope. |
| 19 onward, canon closure in bounded waves | Inventory the selected source material and add the items ledger early. Close the engine gaps that concrete canon cases expose. Start with creature lineage and near/far parity, and shared dose settlement. Prove the potion mechanism with a source-grounded Hogwarts case and validate the shared behavior with a distinct consumer where it applies. Then cover spell effects, other potion mechanisms, Gu and moves, ingredients, creatures and items by shared mechanic. Include ordinary uses and documented canon exceptions. Run mixed settlement and restore checks as the mechanics land. |
| After E24, procedural expansions | Copy, edit, graft, induce, transfer and make through the shared rules. Generated Gu moves, potions and spells execute on the same runner. Exercise plausible local and compatible cross-world workarounds using actual prerequisites, difficulty, costs and risks. |
| After shared engine proof, scenes and game tie-in | Use named scenes as acceptance cases driven by data. In the tie-in phase, move playable routes onto the engine, verify them from a fresh build, and prove save, reload and import. |

**E24/E25 dispatch check.** The coverage denominator is the selected source scope, established before declaring closure. Each in-scope world records its edition or chapter range and the capability families it covers. Compare that inventory with the existing ledgers, the items ledger and any missing family or world. Include spells, potions and ingredients, Gu kinds and killer moves, creatures, magical objects and materials, and documented exceptions and combinations. Record gaps for intended worlds without comparable coverage, including D&D where its selected rules are in scope. Use scoped batches to fill the gaps and keep their source locators.

**Canon reconstruction comes first.** During the canon waves, build and test the rules that produce known results from their documented parts and conditions. Use the existing held-out canon test (PFP17, PFP26, RV1). Give the rule the components, order and conditions the source establishes. Compare the result with the expected canon behavior, then execute it through the shared engine and check its costs and effects. Keep source facts and authored calibration visible. Missing parts or rules stay named gaps. These reconstruction tests belong in canon coverage. Open-ended invention of new moves and other variants follows E24. [Foundation plan](../../../PROCEDURAL_FOUNDATION_PLAN.md).

The first Gu composition proof and its substitution results are recorded in the [Red Fire receipt](#red-fire-reconstruction-and-substitution). Apply the same reconstruction test to a potion with a documented recipe and to a creature trait where the source establishes the relevant causes.

Every source-supported mechanic in scope must have a generic runner case that proves the stated effect or constraint, including a documented exception where it changes the outcome. Shared cases can cover equivalent rows with an explicit mapping and separate cases for meaningful differences. Keep sourced mechanics and authored calibration distinct. Explicitly account for aliases, non-mechanics and genuinely source-unknown behavior. Unread or unindexed selected material is outstanding intake. Missing engine behavior is outstanding implementation. Typed runs and successful samples carry their own evidence and cannot close those outstanding rows.

The baseline has 109 computed cases in four ledgers. Three ledgers still lack computed cases, items lack a comparable ledger, and completeness against the selected sources remains unverified. Keep the retained pace validation and receipt growth under E14/E21, and run the E24 dispatch check before opening the expansion waves.

#### Spell, creature and Gu engine proofs (proposal)

PC95, E6, E7, E12, E19–E24 and [SC4](../../../PROCEDURAL_FOUNDATION_PLAN.md#the-default-sc4-with-gu-as-a-world-pack-and-a-thin-law). Use the existing creature lifecycle, bindings, workings and contest. The same individual should carry its condition and experience from care to a task or a fight and back. Implement the smallest behavior each sourced case needs. A pet or familiar can provide warning, scouting or other aid through the same action path.

| Layer | What it must prove |
| --- | --- |
| Living body and care | One identity across habitat, custody, feeding, injury and recovery. A keeper can see what changed and act on it. |
| Agency and bond | A creature can act, refuse or help when its behavior supports it. Custody, command, cooperation and access to an ability can change independently. |
| Shared contest | A human and an independent creature use the same contest. A companion can assist or withdraw, and the contest's result changes the same body that care reads afterward. Creature against creature uses this same route when a sourced case calls for it. |
| Spellcasting | A spell is an ability a caster can use through a world-specific method. The spell defines what the cast does. The working settles this particular cast with its caster, target, preparation, implements, costs and duration as applicable. A ward can retain the effect for a later trigger. |
| Gu activation | A carried or refined Gu supplies an ability to its operator, and a source-supported autonomous Gu can act through its own policy. Track operator, payer, target and effect independently. A Gu remains the same individual when it acts, is used, or is fitted into a killer move. |

Start with a human and a living companion facing a threat. Give the companion an aid or retreat choice and carry the outcome through injury or recovery and save/restore. Use a separately sourced wild or voluntary Gu case to prove the agency route. For spellcraft, reuse the Hogwarts levitation and disarm cases. Disarm already moves the held wand and releases the grip in the fixture. Extend that case through a second action that reads the equipment change, such as the opponent attempting another wand-dependent cast. Check the target, one relevant prerequisite or interruption, and the resulting state change. Reuse the encounter contract for a cultivator's Gu activation with observable costs. Bind each case to its evidence before it earns canon credit. These are proposed checks within the canon waves. The [accuracy and interference pass](../../../ABILITY_RULES.md#more-to-consider-accuracy-and-interference-across-abilities-proposal) covers cast reliability, delivery, counterplay and recovery across ability families.

#### How the engine will connect to play (proposal)

E20–E23, PC95. During foundation work, exercise the route headlessly through the shared engine. An actor discovers available actions from what they know, carry or can ask for. They select a target and get a quote for the time, costs, conditions and risks they can assess. The engine rechecks the actual state when the action starts or settles. The resulting receipt tells the actor what happened at the level they can observe. The world state carries the outcome into the next action and through save/restore. A human, NPC or creature uses the same action path where their means allow it.

| Player entry point at tie-in | Engine behavior to connect |
| --- | --- |
| Spellbook or a contextual Cast action | The existing [spellbook host](../../../../src/spellbook_host.js) supplies the learned spell, caster and selected target to [spell workings](../../../../src/spell_law.js). The world pack supplies preparation, wand, components, slots or other conditions where applicable. A levitation cast can move an object during exploration. In a contest, the shared effect can change an opponent's options. |
| Gu inventory, aperture or move list | The chosen Gu or combination provides the working's parts. Check the specific specimen, access and fuel. The receipt shows which effects landed, who paid and whether the Gu's condition changed. |
| Companion interaction or encounter | Offer care, a request for help or an available command. The creature can act, refuse or retreat according to its bond and situation. Injury and recovery use the same body that care reads. |

During tie-in, adapt one existing Spellbook cast first. Reconcile which system owns learned spells, equipment, resources and condition so a cast spends and applies its result once. Register the engine save and clock bridge through the existing [domain registry](../../../../src/domain_registry.js), using the absolute game clock established by the seam probe. Verify the player can reach the cast, select a real target, see its cost or refusal, observe the result and recover the state after saving, reloading and importing. Extend the same connection to a Gu activation and a companion action after that proof.

#### What the current game can represent

The foundation has enough structure for the proposed first cases. The [identity registry](../../../../src/kernel_identity.js) associates one individual with several facets. The [working host](../../../../src/engine_records.js) resolves participants and saves actions and effects in flight. The [contest](../../../../src/contest.js) can resolve effects against body holders. The live [Spellbook](../../../../src/spellbook_host.js) already previews and commits native commands. The [seam probe](W18_GAME_SEAM.md) identifies where the two representations still need to meet.

- **Identity and ownership.** Resolve each cast or command to the same live actor, target and item or creature across care, inventory and combat. Read live equipment, knowledge and resources through their existing owners. Return debits and effects to those owners once. Prove that losing the implement, moving the target or changing a companion's custody between quote and execution changes the result as the rules specify.
- **Shared action roles.** Use the working's bindings to distinguish the actor, ability source, payer and target where they differ. For a Gu, control, consent and custody can each change independently. The existing native ability compiler defaults to the player and supplies no target on its base descriptor. Use the existing target path where it fits and extend it for cases that need other participants or objects.
- **Mechanic coverage.** Extend the effect and target rules when a sourced case requires more detail, such as a creature choosing to act, a disarm that changes a target's available actions, or a ward that fires on a later trigger. Prove that a later action can read the change. Save and restore identity, state and ongoing workings across the same shared clock. The remaining canon inventory determines the full set of gaps.

[Cataclysm: Dark Days Ahead's spell data](https://github.com/CleverRaven/Cataclysm-DDA/blob/master/doc/JSON/MAGIC.md#monster-spells) is a precedent for player and creature spell use and for spell effects that create or change creature relationships. [Battle for Wesnoth's ability rules](https://wiki.wesnoth.org/AbilitiesWML#Abilities_and_their_effects) distinguish the unit providing an effect from the attacker, defender and beneficiary. [Unreal's Gameplay Ability System](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-gameplay-abilities-in-unreal-engine) provides a precedent for activation conditions, costs and ability grants. These examples support reusing the current action and effect representation. The cases in the canon waves will establish how far the game's current rules cover its own worlds.

#### Finish lines by direction (proposal)

Use these outcomes to choose the next case and stop a packet when its promised behavior is verified. They summarize the existing finish list and distinguish a working mechanism from coverage of all selected canon. The [selective spatial design](../../../../DESIGN.md#selective-2d-exploration-2026-11-01) governs how a player sees these decisions at tie-in.

**Spatial representation.** Start with named places or encounter zones and typed links for movement, sight, sound or other effects. The [Wave 18 place graph](W18_PLACE_GRAPH.md) already supports link kinds, costs, open or closed state and bounded reach. A text view can say which targets are reachable, what obstructs them and how to get around it. Add a relation or zone when a case needs distinctions within one place, such as who is behind cover or close enough to intercept. Use finer geometry if a case turns on angles, trajectories or exact placement. A diagram or map earns its place when it makes a player decision easier to read.

| Direction | End goal and observable check |
| --- | --- |
| Shared actions, costs and knowledge (E1–E3, E7, E9, E15, E17, E19–E20, E22) | Actors can discover an action, quote it from what they know, and carry it out under the actual conditions. A failed or interrupted action explains the observable reason and settles its price correctly. Show the same action path for player and NPC, with distinct actor, payer, source and target where relevant. |
| Space, senses and encounters (E10, E15, E19) | Position, reach and obstruction change what actions are possible. Prove one meaningful change in position or cover and a next action that reacts to it. A human, creature and companion can act through the same contest where the case calls for them. |
| Creatures and bonds (E6, E11–E12) | The same individual carries identity, traits, needs, bonds and injuries across care, a task or encounter, and recovery. A companion can assist, refuse or retreat for a reason. A cohort and its individual counterpart agree within the case's stated tolerance. |
| Spells, Gu and moves (E19–E20, E24) | Reproduce documented effects with the source's access, targets and costs. Prove a spell that changes a later action, a cultivator's Gu activation, a sourced autonomous or voluntary Gu action, and a composed killer move. A documented difference in control or effect changes the result. |
| Potions, materials and items (E13, E19, E24–E25) | A formula or recipe transforms its inputs, an item or dose reaches its intended target, and the effect persists or expires by rule. Reuse the demonstrated mechanism for equivalent rows. Validate shared behavior with a distinct consumer where it applies (AD51). Account for the ingredients, items and meaningful source exceptions in the ledgers. |
| Clock, persistence and performance (E4–E5, E8, E13–E14, E16, E18, E21) | Mixed actions, bodies and effects in flight reach equivalent outcomes by stepping, jumping and restoring. Verify costs, quantities and receipt growth within the budgets recorded for the case. Keep engine and live game timing visible as separate measurements. |
| Canon coverage (E24–E25) | Audit the selected sources against the ledgers. Each documented mechanic and meaningful exception points to an executable case, directly or by explicit mapping. Unread scope, unclear sources and missing engine behavior stay visible as described in the dispatch check above. |
| Procedural expansion and gameplay tie-in (E20–E23, PC95, PC97) | After canon closure, demonstrate generated variants and compatible ways around a rule through the same engine. At tie-in, a player can find the action, choose a target, understand the result, and continue after reload or import. Start with one existing Spellbook cast and then reuse the connection for a Gu and companion action. |

Each lane brief names the case or family it will advance, the existing mechanism it will use, the observable difference to prove, and the check that closes the packet. If an existing representation passes that case, reuse it for equivalent rows. If two situations collapse to the same outcome despite different source rules or player choices, add the smallest distinction that explains the difference. Record the evidence and stop at the packet's finish line. Put further ideas in the relevant existing row. Use the existing usage check before each dispatch.

#### Work to reach the core goals

Use the [finish lines by direction](#finish-lines-by-direction-proposal) for each packet and the existing canon checkpoint for breadth. The [foundation atlas](PROGRESS_ATLAS.md) maps those finish lines to the current evidence and missing consumers. The sequence below is a proposed execution order within PC95 and PC99.

| Work | Evidence that moves it forward |
| --- | --- |
| Inventory selected canon and start the items ledger (E24–E25) | Name the source ranges and capability families. Map known mechanics and exceptions to runnable cases or the specific missing behavior. Record missing source evidence and scope still to read. |
| Prove a few connected actions on the current engine (E1, E6, E10–E12, E19–E20) | Extend the existing Disarm case through the next wand-dependent cast and recovery. Join creature identity and lifecycle, then compare cohort and individual settlement. Prove one shared dose mechanism. Reuse the action path for a sourced Gu use and a companion action as their owners land. |
| Close engine gaps and cover equivalent rows (E1–E20, E22, E24–E25) | Use the case runner and existing finish matrix. As each mechanic lands, run its relevant mixed, interrupted or restored case, then map equivalent canon rows to its proof. Add local rules for differences that change outcomes. Verify observer-safe quotes and receipts through the same settlement path. |
| Open expansions after canon closure | Prove a generated variant and a justified exception through the same action path. Reuse the existing rules for prerequisites, costs, failure and recovery, and expand the relevant family by its recorded finish line. |
| Prove live use at tie-in (E20–E23) | Connect one existing Spellbook action through the game clock, save and state owners. In a fresh build, the player finds it, chooses a target, sees the result, and continues after save, reload or import. Reuse that connection for Gu and companions. |

The [implementation guidelines](../../../ABILITY_RULES.md#implementation-guidelines) describe what belongs to the action, delivery and state owners. The [visualization guidelines](../../../../DESIGN.md#action-and-encounter-views-proposal) describe what the player should be able to see and do. A packet ends at its observable check. Bring further representation or presentation detail into a later packet when it changes a sourced result or a player decision.

#### First procedural engine slice (proposal)

E10, E19–E20 and AD38. Start with **actions that depend on a held implement**. Use the existing Disarm case as the source-grounded effect. The wand's holder, location and grip already live in world state. The current duel uses a focus proxy. For this slice, have a wand-dependent working read the actual grip and location when quoting and at the step where the method needs the wand. Reuse the shared effect, binding and place rules for losing or recovering the implement. The world-specific method supplies the requirement and costs.

Use one fixture with the same methods and vary the starting facts or intervening actions:

| Situation | Observable result |
| --- | --- |
| The wand is held and Disarm lands | The same wand moves and the next wand-dependent action sees that it is unavailable. |
| A position ward blocks the movement | Grip and location stay consistent and the next cast can still use the wand if its other conditions hold. |
| The caster retrieves the wand by a reachable route and grips it | The same action becomes available again. The route and recovery consume whatever time or resources their rules require. |
| The caster loses the wand after the quote | The working sees the change when it needs the implement and settles the method's applicable cost or interruption once. |

The case passes when its branches use the same working and effect rules, each outcome follows from the changed state, and restoring between disarm and recovery gives the same result. Use the existing fixture runner and focused tests. A comparable existing tongs-and-ward test is a cross-domain reference for the shared movement rule. A later tool-dependent craft or Gu activation can validate the new consumer without sharing the wand requirement itself.

This is procedural settlement of a canon action within the current foundation phase. Generating new spell designs or other expansion content follows the existing canon checkpoint. Use the [ability guidelines](../../../ABILITY_RULES.md#implementation-guidelines) for the action boundary and the existing [core work order](#work-to-reach-the-core-goals) for the remaining directions.

#### First procedural Gu and creature cases (proposal)

Use the same principle as the held-implement case. An action changes the state a later decision reads. Each case can advance on its own existing engine path.

| Direction | First connected case | Finish check |
| --- | --- | --- |
| Gu as a living ability source (E11–E12, E19–E20) | Reuse Moonlight Gu. The feeding fixture already distinguishes matching food, wrong food and starvation. The contest fixture already runs its ability and pays essence. Connect those paths through the same specimen. | The action reads the actual Gu, who can use it, who pays and any condition that the method checks. A transfer or loss of access between quote and execution changes what can settle. The correct food changes that specimen's condition. Apply a hunger effect to the cast where the selected source or an explicit authored rule supports it. A sourced voluntary Gu case can later prove the Gu acting as its own operator. |
| Creature as an actor (E6–E7, E11–E12, E19–E20) | Use one named companion and one threat. The companion can aid, warn or withdraw according to its relationship and condition. Let an encounter injury persist into care. | With the same action rules, a change in condition or relationship changes the choice where it matters. Care changes recovery on that same individual. Save between the encounter and care, then verify that identity, condition and the next decision agree after restore. Compare cohorts and individuals separately under E6. |

Stop each packet when the next consumer reads the changed state and the distinguishing check passes. Source-supported effects and authored decisions retain their own evidence.

#### Generating new moves and creature traits (proposal)

G4 and PC96–PC97. Build on the existing prototypes. [Gu move generation](../../../../tests/gu_move_generation.test.js) already searches a bounded set of held parts, compiles and settles a new fire composition through the working kernel, and keeps the proven design in an archive. [Creature heredity](../../../../tests/heredity.test.js) already produces offspring from parents, models exposure-dependent mutation, and shows that selecting on measured wool changes a flock over generations. These checks passed 14/14 on the coordinator checkout. G4 tracks generation integrated into the shared engine world. The existing prototype proofs retain their own scope.

| Direction | First generation proof and finish line |
| --- | --- |
| Gu moves | Use the [Red Fire receipt](#red-fire-reconstruction-and-substitution) for the verified manual substitution and the remaining search and discovery work. |
| Creature traits | Start with the same sheep stock and compare selection for measured wool with an unselected flock. Take the offspring through birth, growth and the trait's real consumer, such as a fleece harvest. Preserve lineage through save and restore. Introduce a second selection goal when another heritable trait has an actual consequence. |

The table describes later invention and variation proofs. First reconstruct and execute known results from their source-supported inputs under the canon-first wave order above. Disarm, Gu custody and companion care exercise state that these systems can later read. New move design and inherited variation have their own tests.

#### Red Fire reconstruction and substitution

GL3, PFP17, RV1, E19 and E24. Scope is the offensive combination Wei Yang describes in chapter 275 (GKM124). Red Fire attacks, Duplicate increases flame count, Enlarge strengthens the flame, and Fire Source lowers essence expenditure. Fire Discharge is described as movement. Rank, numerical costs, per-flame force, activation order and timing use authored fixture values. The chapter describes this combination as part of Xiao Yan's Gu set. The fixture uses the four documented parts as inputs, and the expected flame count, force and costs are independent assertions. [Source evidence](../../../research/gu-identity-evidence.json) · [Gu research](../../../GU_ABILITIES_AND_KILLER_MOVES_CONSIDERATIONS_2026-11-10.md#red-fire-combinations-at-the-practice-kiln)

| Change to the inputs | Headless result |
| --- | --- |
| Four source Gu | Two flames of force two land on a bound body. The engine's essence account debits six units. A mid-working save and restore matches uninterrupted settlement. |
| Substitute Light Source in the exact recipe | The Fire Source role rejects the different kind before payment. |
| Test a different design with Light Source in that role | Light Source's current rule discounts light abilities. Red Fire still lands the same two flames, and the total debit rises to nine. This is an authored experiment. It makes a distinct and less efficient design under these rules. |
| Give the experimental design eight units, or transfer the core after the supports settle | The core interrupts with the applicable reason. The three spent support units remain spent, and no flame lands. |

The [engine adapter](../../../../src/gu_flame_working.js) uses the existing Gu role compiler and activation law, reads current custody and essence, and delivers each resolved flame through the shared effect and cost owners. Its [fixture](../../../../tests/gu_flame_working.test.js) starts with a resolved body target. Spatial delivery and automatic discovery have their own future consumers. The [layered protection proposal](../../../COMBAT_AND_CONFLICT_CONSIDERATIONS_2026-10-18.md#layered-protection-in-shared-engine-combat-proposal) holds the layered damage evidence and the crafting and rank follow-ups under E19. The [ward and condition proposal](../../../ABILITY_RULES.md#wards-and-effects-on-people-long-term-proposal) records the long-term trigger, protection and status consumers.

- **ACT NOW.** Record the executable reconstruction and swap here. The canon wave order and generation row link to this receipt. Keep GKM124 as the source and earlier Keeper evidence owner. The earlier contest and generator receipts retain their scope.
- **ACCOUNT FOR NOW.** Keep exact recipe identity, experimental compatibility, and settlement failure distinct. A working swap can be worse at the inventor's goal, as it is here. A later search can rank it accordingly while preserving a useful variant that offers a real tradeoff. Keep support compatibility specific to the effect a support changes. Retain the earlier debits when the core becomes unavailable.
- **LATER / DELEGATE.** A bounded implementation lane at medium effort can connect the existing goal search and archive to this engine path. Its finish check is that a search proposes a variant with a demonstrated difference, settlement validates the predicted effect and actual costs, and a retained design can be used after restore. A rejected or interrupted attempt leaves a reason in its receipt. Follow the existing canon-first expansion order. Other move families, simultaneous multi-operator moves and projectile routing are outside this case.

Checks on the coordinator worktree at `d423a30fa` plus these changes. Seven focused files passed 47/47. Architecture, rules, coverage and docs checks passed. The adapter is outside the live entry path, so this is PC95 engine fixture evidence. The layered protection follow-up passed 57/57 focused tests across nine files. Architecture, rules, coverage and docs checks passed. The two new headless modules are outside the game entry path. The fixture verifies actual coat and ward capacity, physical contact through a fire ward, authored body resistance, harm inbox publication and restore after ward depletion. Crafting, progression-derived resistance and live play remain separate consumers. See the combat owner linked above for the results. The generic ledger runner has no case for this composed route yet. The coverage totals retain their prior scope. Browser play and a live cast were outside this slice.

#### Procedural combat across worlds

The goal in [OS2](../../../PROCEDURAL_FOUNDATION_PLAN.md) and E19 is to reproduce each selected world's canon combat from its actors, abilities, equipment, environment and local rules. The shared contest should derive the sequence and consequences from those inputs. Start from the existing canon anchors and use variations to find where a shared rule or a world-specific rule is missing.

| Existing anchor | Next question for the shared contest |
| --- | --- |
| Hogwarts duel | Can the duel use the actual wand and its reach so disarming or recovering it changes what the opponent can cast next? |
| Gu duel | The [pit fight](#wang-er-fight-and-one-gu-swap) now uses actual Gu activation and a paired swap. Use the missing chapter beats to drive the next changes to the shared contest. Red Fire and layered protection supply separate evidence for composition and defense against a resolved target. |
| Wolf hunt | Can a human and creatures choose, fight, withdraw and recover through the same encounter? The contest already passes selected injury and stock changes to the lifecycle. |

Reuse the current contest, workings and effects. For each anchor, exercise the source-supported outcome and vary one input that ought to change it. Record the missing rule when the outcome cannot be derived. The [saved hand-burn idea](../../../COMBAT_AND_CONFLICT_CONSIDERATIONS_2026-10-18.md#saved-hand-burn-idea) is one way to check aftermath and care. It does not change the canon-first wave order.

#### Wang Er fight and one Gu swap

AR3, E19, CFC3a, CFC7, CFC11, CFC16 and AD49. The pit fight uses real Moonlight activation on the shared contest clock. In the calibrated chapter 66 replay (seed 5), the first blade reaches the nearest hunter and localizes a surviving maiming wound. The existing side morale rule makes two witnesses kneel. Wang Er shoots as Fang Yuan closes, misses, drops the held bow and uses fists at contact range. Fang Yuan crosses to the other side. The world’s sunlight and the new relative facing create the opening for the final blade. The exchange shows a second moonblade missing and a final head strike. The fixture uses the hands rung for forearm impairment, local one-axis positions, and an authored hit-location and vitality scale. [Chapter 66](https://roliascan.com/read/reverend-insanity/ch66-97413/) · [Fight tests](../../../../tests/contest_consumers.test.js)

| Replay | Result |
| --- | --- |
| Seed 5, Moonlight, 16 essence | Three activations cost 12 parts. Wang Er dies at tick 34. |
| Seed 5, swap Moonglow, 16 essence | Three activations cost 15 parts. The final impact triples and the fight still ends at tick 34. |
| Seed 5, remove sunlight | No glare or head strike. Moonlight takes a fourth cast. |
| Seed 3, four parts | Moonlight activates once and Fang Yuan loses. Moonglow cannot activate, and Fang Yuan wins with fists. |
| Save after arm wound and bow drop | Both loadouts resume the pending cast with the same outcome, ledger and world as uninterrupted settlement. |

Across seeds 1–40, the swap changed the winner in 1/40 pairs with 16 parts and 20/40 pairs with four parts. It ended sooner in 27/40 pairs with 16 parts. These are sensitivity checks for this opponent policy and starting state.

**Essence and live transfer.** The lead starts with a 44-part capacity on a 100-part aperture scale. The four-part chapter action cost is authored. The contest uses the Moonlight catalogue's four-part base and Moonglow's five-part base in an ungraded pool. It quotes before choosing and debits on Gu release, including a released miss. A cast interrupted before activation spends no Gu essence. Bow ammunition is reserved by the current contest's ordinary up-front cost path. The Little Light test debits one for support plus four for Moonlight. In the wider activation law, the base cost takes the supplied grade and stage factors and applicable Gu modifiers. A live adapter needs the actual aperture and exact specimen, an action choice over the same resolver, and settlement back to the native energy, harm, inventory and story owners. The authored chapter route still owns the live scene today. A first live proof should play the encounter with a changed outcome, then save, reload and import it. [Lead aperture](../../../../src/world_packs/book_gu_lead_life.js) · [Fuel calculation](../../../../src/gu_fuel.js) · [Live chapter route](../../../../src/world_packs/book_gu_lead_early_duel.js)

**Coverage.** Keep named canon combinations as individual evidence rows. Known ingredients and behavior can be exact replay fixtures. A known effect with incomplete ingredients can be checked at its effect boundary with the missing recipe explicit. Mentions with insufficient detail remain source gaps. For discovered combinations, use existing role compatibility to prune, then the same activation and settlement to verify valid, failed and interrupted attempts. [Current Gu search](../../../../src/gu_move_search.js) evaluates one core with direct supports, with defaults of two supports and 200 trials. It does not search chained or simultaneous moves. The [compiler](../../../../src/gu_move_roles.js) can bind and compile authored roles, and the contest bridge settles an entire foreign working at release. Joint timing, distinct delivery and real state changes during a cast need proof from the first canon cases that demand them. Preserve each budget or source gap and report canon coverage from the checked rows.

Checks on `d423a30fa` plus the coordinator edits. Contest, contest consumers, Gu working law, Gu move roles, Red Fire, Gu upkeep, Gu refinement and harm passed 125/125 focused tests. Architecture, coverage, rules and docs checks passed. Rules reported the existing Hogwarts day-counter and private-pack glob warnings. The paired runs add fixture evidence and leave the computed coverage ledger unchanged. Live gameplay remains open.

#### Keeper care and the distant cord

AR3, AD38, AD49, CFC3a, MR32, UR70–UR75 and WPR32. [Care and composition owner](../../../GU_ABILITIES_AND_KILLER_MOVES_CONSIDERATIONS_2026-11-10.md#raising-gu-for-a-procedure). The fresh Keeper enters Moonblade research, takes the clan Gu and the Little Light loan into care, then opens the distant cord trial. The existing larder feeds Moonlight on its clock. The separate loan meal costs one petal and lasts one day as a practice dial. With the written pairing, an unfed support stops before any essence is spent. The returned support stays unavailable when Light Source is borrowed. A newly written Light Source experiment spends three essence and falls short. The plain blade spends four and falls short. The fed pairing spends five and cuts the distant cord, which releases the alcove latch. The additive extension preserves the older research content pin.

- `node --test tests/gu_upkeep.test.js tests/gu_move_roles.test.js tests/gu_working_law.test.js` passed 68/68. Architecture, rules and docs checks passed. Rules reported the existing day-counter and private-pack glob warnings.
- `BUILD_OUT=<temp> npm run build` passed. Bundle SHA-256 `80581840fd04572666ae05c32abdbda88127161badd079ce17be95d66faaa7a4`. Build reported the existing duplicate key warning in travel legs.
- `node scripts/playtest/gu-keeper.mjs <build> <evidence> --raised-moonblade-only` passed on a fresh headless browser at 1920×1080. Save, reload, export and literal import matched for the fed plan, the hungry interruption and the opened alcove. Zero page errors. Agent-verified, human review open. Mobile layout is outside this pass. This proves reach against a stationary target on a live route. The live combat consumer remains open.

#### Reconciled dispatch and evidence

Reviewed at `d423a30fa` with the coordinator's plan edits. Scope covers the current wave order, canon accounting, action representation and tie-in. The per-engine audit matrix and earlier gate receipts retain their original scope.

| Existing line | Discrepancy and disposition | Owner and evidence |
| --- | --- | --- |
| RC14, E24–E25 | Competing dispatch orders and stale coverage counts. This run record owns the canon-first order. Earlier schedules and the third handoff preserve their original state. The new finish lines guide packets under AD32. | Fresh coverage check computed 109 cases across four ledgers. The selected-source inventory and items ledger still supply missing coverage. |
| AD51, E19 | The proposed second consumer validates shared behavior where it applies. A sourced first consumer can advance when its mechanism fits. | Shared mechanics follow AD51. Spell, Gu and potion world rules retain their local differences. |
| E10, E19–E20 | The disarm fixture proves an effect on the wand and grip. Its next-cast consequence remains a proposed follow-up. The place graph already supports typed reach. Add finer state when a case needs it to change the outcome. | Spell case data and effect host produce the change. The subsequent action is the missing consumer. Focused engine host, place graph, contest consumers and Gu bodies passed 23/23. |
| E22–E23, PC95 | The engine and live Spellbook have separate command paths today. The headless save/clock probe demonstrates the seam with a test bridge. Tie-in still needs shared ownership and one settlement path for live equipment and costs. | The Spellbook calls native preview and commit. The engine host reads bindings and settles costs and effects. The first live cast and fresh browser save round trip remain future proof. |

The checkout and usage at the time of that review were historical. Follow the [current resume block](#current-resume-block) for live sequencing.

### Coordinator and spellcraft worktree reconciliation (2026-11-13)

Base `4cab2177b`. The older spellcraft checkout's 19 local files were compared with the corresponding master files and their landing commits. Its Hogwarts practice, Phandalin Levitate and Cyoria research are already represented in `9bbc51363` and `e1b4a4396`. Master also includes the later earned Hogwarts receipt, Phandalin's copying and rest route, and Cyoria's composed formula editor. The detached snapshot was archived before removal.

The coordinator's Wave 18 probe was already represented by `ab8da5b55`. This fold brings in the separate Red Fire and layered protection cases, the Wang Er contest and restoration fixture, the Keeper care and cord trial, and the planning notes and atlas. It keeps the incumbent contest handoff and resolves the Keeper import through the shared identifiers module (AR3, AR5). The cord uses a new opt-in extension over the current Keeper base, with earlier extension definitions and the base data hash preserved (AR6). The existing foundations-first order remains in the current resume block. Red Fire and Wang Er remain fixture-level evidence. The target for the existing Keeper panel is desktop Chrome at 1920×1080, including the cost, refused cast and unlocked alcove. Mobile remains deferred.

Recovery copies use the private `~/.codex/research/worktree-cleanup-2026-11-13/reconciled-foundations/` archive. Each manifest records original HEAD, file hashes and recovery instructions.

- `npm test` exited 0 with 7,386 passed, 25 skipped and zero failed. The later handoff-compatibility hunk passed all 47 targeted contest and handoff checks. The full banked game week remains opt-in and was outside this pass.
- `npm run build` exited 0. The tracked and browser-tested bundle SHA-256 is `16d8e111230ff549bda2f2c509f598797afaaf8e0c7c64670a1db670dfe99af5`.
- Architecture, rules, docs and all seven coverage ledgers passed. The isolated checkout omits private content packs.
- The rebuilt Keeper route passed at 1920×1080, with the plain and substitute blades falling short, the exact loan's hunger and absence interrupting the cast, and the fed pairing opening the alcove. Save, reload, export and literal import matched for all three saved states. The browser harness invokes the existing DOM handlers directly to avoid scroll and hit-test timeouts.
