# Uncommitted runtime correctness review, 2026-10-25

Lane B4, read-only review of the primary checkout. Four findings retained after primary-agent source verification; two focused test failures and two direct failure reproductions support them. No runtime or test files were changed, staged or committed.

## Scope and evidence boundary

Started with `git status --short src tests` and reviewed changes against HEAD, including untracked sources and their tests. HEAD remained `9b997ea60a7eb12200dbc825684e6668403aa015`. The final inventory contained 87 modified and 87 untracked paths under `src/` and `tests/`; tracked diff SHA-256 was `f9c3f586cd7ace6978d41af086b7c05c5492981ba537f21cd1db96d587e94b29`. This hash excludes untracked contents and is not a frozen combined-runtime identity. Concurrent writers remained active.

Read [COMMON](../gm/dispatch/codex-parallel-2026-10-25/COMMON.md), PROJECT, the rules router, architecture rules and the [cultivation absorption checkpoint](../gm/dispatch/cultivation-absorption-2026-10-24/CHECKPOINT.md). Applied AR1–AR16, especially AR3, AR5–AR8 and AR10; AD22, AD36 and AD41; MR5 conservation; and AGENTS save-integrity/sealed-secret rules. AR6's documented old-save compatibility exception does not exempt current-state round trips. No sealed truth is disclosed here.

Four Luna-medium reviewers covered disjoint review groups. The primary agent independently checked every retained finding against source and reproduced each failure below. Coverage is a bounded bug hunt, not certification that every changed behavior works.

| System | Review scope |
| --- | --- |
| Cultivation/Mistglass | Adaptation/host joins, techniques, intents, vessel geometry/forks/thread, inquiry/seedbed, trials/routines, pledges, drainage and dojo |
| Crafting/workshop | Resolver, native crafting runtime/domain/panel, references, body treatment, failure ledger, gear dimensions/workshop and naming |
| Household/home | Home model/domain/content/work/staff, cultivation/school/medicine/warehouse/layout/legacy, household fortunes and brood |
| Combat | Native combat math/models/readout/review, encounter settlement, defeat, enemies and party/feature battle joins |
| Continuation | State/host/UI, challenges, retention, laws/intents, physical/equipment baggage, inheritance and lineage |
| LOTM | Untracked pathway-row test versus current pathway exports; no changed LOTM runtime source was present in this inventory |
| UI/other | Changed presenters and composition joins, shop locks, skill records, economy/peer standing, life events/records, journal, companions/NPCs and history |

## Findings, ranked by severity

### U1 · High · Physical baggage can be duplicated through a retained checkpoint

**Location:** [src/continuation_state.js:158](../../src/continuation_state.js#L158), with rewind at lines 149–153. **Confidence: high, directly reproduced.**

**Owner:** Cultivation absorption, equipment-baggage/continuation slice in the checkpoint above. The selected mechanism moves the exact physical copy and debits its source. [Continuation direction CA6](../worlds/CONTINUATION_CHOICE_CONSIDERATION_2026-10-13.md) defaults to the external recipient retaining the only exported object; explicit temporal duplication remains a separate possible means, not this bag's described behavior.

**Failure scenario:** Own one loose tracked equipment copy in life A, establish a reachable checkpoint containing it, buy a baggage slot, select the copy and enter a fresh life B. `transferBaggage` removes it from A's current snapshot, then stores that debited snapshot in `life.paused`. A's reachable `life.checkpoint` and `life.initial` retain their old inventory and auxiliary facts. Resume A and choose its checkpoint: the same `e2_instance` returns in A while B retains its transferred copy.

**Verification:** A primary-agent `node --input-type=module` probe called real `beginContinuation`/`planContinuation` with a count-one `Cheap leather pants` key bearing `e2_instance: e2.1`. Sequence: `set → baggage:buy → baggage:item:<key> → fresh → resume:life-1 → checkpoint`. Immediately after transfer, source stock was absent and target count was one. After rewind, both source and B's paused inventory held count one of the identical key. Existing transfer tests cover the immediate source debit and reciprocal return, but omit the subsequent rewind. This violates current cross-life custody/save integrity, rather than ordinary intentional world rewind (AR3, AR6, MR5, AD22).

**Repair boundary:** Reconcile exported custody across every reachable source snapshot, or suppress incompatible rewinds with an explicit mechanism. Preserve ordinary rewind behavior and explicit future temporal-copy options.

### U2 · High · Crafting-depth changes remove the landed reference-crafting journey

**Location:** [src/crafting_frontier_runtime.js:95](../../src/crafting_frontier_runtime.js#L95) and command dispatch at lines 119–136; removed controls in [src/crafting_home.js:8](../../src/crafting_home.js#L8). **Confidence: high, source trace and existing regression failure.**

**Owner:** Cultivation absorption crafting/formulation work overlapping the already-landed G1 reference shelf. PROJECT's worktree-reconciliation round 2 explicitly says the uncommitted crafting-depth work must merge onto G1's reference shelf.

**Failure scenario:** A Village player attempts to take a shelf book/slate, learn its recipe, read its training, return a reference or examine a gathered material. The changed projection exposes only materials/products; the panel removes those controls; quote dispatch now rejects their requests as `Unknown crafting command`. Reference helper exports and runtime execution paths disappeared without a replacement owner. Existing carried reference item materialization remains, and the crafting domain still claims their keys, so those items are stranded from their established actions.

**Verification:** Primary-agent `node --test tests/craft_reference.test.js tests/lotm_pathway_rows.test.js` reproduces the reference journey failure at `tests/craft_reference.test.js:101`: `rt.referenceKey is not a function`. Source searches found the pure reference engine/content and native item support, but no replacement runtime commands or panel. Restoring the export alone would not restore the deleted journey. AR10's integrated consumer requirement and preservation of the merged baseline apply; this is a regression, not a request for new crafting scope.

**Repair boundary:** Merge formulation/body-treatment behavior with the existing shelf, method/read/learn/examine and reference validation paths. Keep the existing native journey regression.

### U3 · Medium · The untracked LOTM test cannot link against this checkout

**Location:** [tests/lotm_pathway_rows.test.js:11](../../tests/lotm_pathway_rows.test.js#L11). **Confidence: high, directly reproduced.**

**Owner:** Copied LOTM B2/B3 pathway-row test context; exact current writer is not established. The [A2 dispatch](../gm/dispatch/codex-parallel-2026-10-25/A2_lotm_q3.md) says this test was copied as context, and A2's saved result already acknowledges an inherited copied-test API mismatch. This is not evidence that A2 introduced the problem.

**Failure scenario:** A committer runs the normal test discovery with this untracked file included. Node aborts its module instantiation because `src/book_world_lotm_pathways.js` does not export `LOTM_ASSESSORS`; the test also imports `LOTM_LOSS_CAUSES` absent from that module. No test assertion runs, so this file cannot validate its advertised pathway/assessor seam and blocks the suite.

**Verification:** The primary-agent focused command in U2 reproduced `SyntaxError: ... does not provide an export named 'LOTM_ASSESSORS'`. The runtime source itself is unchanged against HEAD. This is a current test/source contract mismatch, not a verified runtime pathway defect (AD36).

**Repair boundary:** Reconcile the copied test with the actual landed API, or bring in its missing implementation under the owning lane. Do not treat this as passing pathway evidence.

### U4 · Medium · A failed rust-setting save leaves the setting and native skill penalty changed

**Location:** [src/skill_records_domain.js:37](../../src/skill_records_domain.js#L37), especially line 40. **Confidence: high, directly reproduced.**

**Owner:** Cultivation absorption records/retention work; its checkpoint lists `skill_records_domain.js` among current runtime owners. The original feature is the leftover-itch G27 skill-record/rust slice.

**Failure scenario:** A player has rust enabled and a two-level Swords penalty, then disables rust while persistence throws, such as quota failure. `setRust` replaces `records`, calls `observe(0)` and `apply()` to clear the hero's native penalty, then calls `ports.persist`. There is no transaction or catch restoring records and applied stats. The command reports failure, but the active game uses the uncommitted setting and a later successful save can silently retain it (AR3, AR7).

**Verification:** The primary agent configured the real domain with an actor exposing a minimal levelable component, loaded a validated record with `Swords.rust=2`, and made `persist` throw `Error('quota')`. Before the command, `flat.rust` was `{"Swords":-2}`. `setRust(false)` threw `quota`; afterward `flat.rust` was `{}` and the domain's save projection had `rustOn['base.frontier']=false`. This is a transaction-boundary reproduction, not a browser quota test.

**Repair boundary:** Snapshot/restore the skill-record owner and derived native bonuses around persistence, following the existing native transaction pattern. Verify the failed save preserves both preference and live penalty.

## Checks and remaining limits

| Command / execution | Result | Scope and gaps |
| --- | --- | --- |
| `git status --short src tests`; `git diff -- src tests` and scoped source reads | Reviewed | Live shared tree; untracked files read separately; no frozen build claim |
| `npm run check:arch` | PASS | Main 10113/10115 lines, display 6727/6767, save_files 310/310; grandfathered 6 main imports and 226 cyclic edges remain. Passing does not prove all import entry orders are safe |
| `npm run check:rules` | PASS, one warning | `docs/WORLD_PASS_RULES.md` exists but is untracked |
| `node --test tests/craft_reference.test.js tests/lotm_pathway_rows.test.js` | FAIL: 6 passing subtests, 2 failures | U2 existing native reference journey and U3 module-link failure |
| `node --input-type=module` continuation probe described in U1 | Reproduced | Identical tracked copy exists in two live histories after source rewind; no browser claim |
| `node --input-type=module` skill-record probes described in U4 | Reproduced | Failure preserves neither changed setting nor derived penalty; no browser claim |
| `node --test tests/cultivation_away.test.js tests/cultivation_formulation.test.js tests/cultivation_guidance.test.js tests/cultivation_intents.test.js tests/cultivation_root.test.js tests/dojo_tower.test.js tests/drainage_site.test.js tests/home_cultivation.test.js tests/trial_bodies.test.js tests/trial_routine.test.js tests/vessel_forks.test.js tests/vessel_geometry.test.js tests/vessel_thread.test.js tests/p23-host-joins-world-adaptation.test.js tests/p23-world-adaptation.test.js tests/pledges.test.js` | PASS 94/94, cultivation reviewer | Focused test slice only |
| `node --test tests/craft_engine.test.js tests/crafting_runtime.test.js tests/crafting_native_reload.test.js tests/craft_failure_ledger.test.js tests/gear_workshop.test.js tests/gear_dimensions.test.js tests/home_domain.test.js tests/home_household.test.js tests/household_fortunes_domain.test.js tests/home_cultivation.test.js tests/home_layout.test.js tests/household_brood.test.js tests/vessel_thread.test.js` | PASS 99/99, crafting/home reviewer | Focused test slice only |
| `node --test tests/craft_reference.test.js tests/crafting_home_refresh.test.js tests/craft_depth_rules.test.js` | FAIL: 14/15, crafting/home reviewer | U2 reference journey fails; primary reproduced the same failure above |
| `node --test tests/continuation_state.test.js tests/heir_inheritance.test.js tests/lineage_traits.test.js tests/life_record.test.js tests/life_events.test.js tests/personal_journal.test.js tests/companion_wishes.test.js tests/npc_lives.test.js tests/relationship_view.test.js tests/aging_contact.test.js` | PASS 86/86, continuation reviewer | Does not cover U1's post-transfer checkpoint rewind |
| `node --test tests/shop_locks.test.js tests/gear_dimensions.test.js tests/combat_review.test.js tests/economy_standing.test.js tests/peer_standing_domain.test.js` | PASS 24/24, combat/other reviewer | Focused test slice only |

The focused runs overlap; their counts must not be added into a unique-test or combined-suite claim. No build, full `npm test`, installed-app check or rebuilt-browser play was run. No additional confirmed defect was retained in the reviewed cultivation, home, combat or general UI paths. Candidate law-memory wiring and retention-application concerns were dropped after checking the actual `main.js` context bridge and reload path. The existing person/inventory import-cycle warning was treated as a baseline hazard, not falsely reported as a newly introduced defect.

Before commit, the owners need to resolve U1–U4 and the committer needs the authorized combined pre-commit gates on reconciled inputs. Fresh rebuilt-browser persistence/gameplay acceptance remains separate from this source review. B4 made no runtime repairs.
