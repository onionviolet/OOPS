# Test-suite leanness audit (proposal only)

**Date:** 2026-10-25  
**Baseline:** committed `HEAD` `9b997ea60a7eb12200dbc825684e6668403aa015`  
**Rules:** AD36 and the Lean tests direction in AGENTS.md / RULES_INDEX.md.

## Scope and method

Inventory covers all 380 tracked test-runner files under `tests/` in committed HEAD (`.test.js`, `.test.mjs`, `.test.cjs`). Fixtures and helper modules are not runner files and were not timed. Ten tracked test files were dirty and 26 test files were untracked in the shared working tree; none entered this HEAD inventory. The run used isolated `git archive HEAD` copies with the checkout dependency directory linked in. Each unique file received one `node --test <file>` timing. Shards ran concurrently, so wall times are one-off estimates under contention, not stable benchmarks.

Five files exited nonzero: `cheat_awakening.test.js` (2/4 subtests passed), `cheat_cards.test.js` (3/4), `headless/defeat_journey.test.js`, `headless/lamplight_journey.test.js`, and `rt_slice1_fixtures.test.js`. Shard wrappers overwrote or truncated failure diagnostics; failure names/reasons are unavailable. Do not treat these as dead-test evidence. `foundation_interaction_policy.test.js` was accidentally executed twice in shard A; its first timing (547 ms) is recorded below and that is the only duplicate invocation.

A HEAD-wide scan found 2,336 literal test titles and no exact duplicate titles (escaped quote handling verified). Near-duplicate review is semantic and called out below. “No candidate established” in the inventory means this bounded pass did not establish a duplicate, shape-only test, or dead test; it is not proof that no such case exists. All proposals remain unaccepted.

## Current inventory

| File | System covered | Name class | Cross-file overlap / shape / dead-test note | One-off ms / result |
|---|---|---|---|---:|
| `tests/ability_conditions.test.js` | ability conditions | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 327 / PASS |
| `tests/absorb_b.test.js` | absorb wave / feature-specific regressions | wave/slice named | Delivery-wave/slice filename; route to the system owner proposed in R1. No deletion established. | 136 / PASS |
| `tests/absorb_c1.test.js` | absorb wave / feature-specific regressions | wave/slice named | Delivery-wave/slice filename; route to the system owner proposed in R1. No deletion established. | 173 / PASS |
| `tests/absorb_c2.test.js` | absorb wave / feature-specific regressions | wave/slice named | Delivery-wave/slice filename; route to the system owner proposed in R1. No deletion established. | 134 / PASS |
| `tests/absorb_d.test.js` | absorb wave / feature-specific regressions | wave/slice named | Delivery-wave/slice filename; route to the system owner proposed in R1. No deletion established. | 108 / PASS |
| `tests/absorb_e1.test.js` | absorb wave / feature-specific regressions | wave/slice named | Delivery-wave/slice filename; route to the system owner proposed in R1. No deletion established. | 113 / PASS |
| `tests/absorb_e2.test.js` | absorb wave / feature-specific regressions | wave/slice named | Delivery-wave/slice filename; route to the system owner proposed in R1. No deletion established. | 186 / PASS |
| `tests/absorb_e3.test.js` | absorb wave / feature-specific regressions | wave/slice named | Delivery-wave/slice filename; route to the system owner proposed in R1. No deletion established. | 170 / PASS |
| `tests/acquisition.test.js` | trade/acquisition | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 381 / PASS |
| `tests/advance_horizon.test.js` | simulation clock | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 623 / PASS |
| `tests/aging_contact.test.js` | aging and social contact | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 137 / PASS |
| `tests/agreed_duty_continuation.test.js` | duty contracts | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 3,927 / PASS |
| `tests/air_wider_candidate_tool.test.js` | content candidate tools | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 278 / PASS |
| `tests/alloy_equipment.test.js` | craft/equipment | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 1,922 / PASS |
| `tests/anchor_snapshots.test.js` | chronicle anchors | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 109 / PASS |
| `tests/architecture.test.js` | architecture ratchets | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 309 / PASS |
| `tests/ascension_paths.test.js` | progression paths | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 99 / PASS |
| `tests/audit_remainder_nonce_split.test.js` | remainder simulation | system named | Shares R15 G4 combat fixture and command boundary with combat_fit_practice; determinism/split nonce versus paid-practice persistence are different invariants. | 902 / PASS |
| `tests/authored_site.test.js` | authored site content | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 295 / PASS |
| `tests/away_ledger.test.js` | offline/away time | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 99 / PASS |
| `tests/basics_leaf.test.js` | shared primitives | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 115 / PASS |
| `tests/body_progression.test.js` | body progression | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 663 / PASS |
| `tests/book_world_native_binding.test.js` | book-world native integration | system named | Golden trace and save keys are explicitly retained as pre-extraction compatibility invariants (file comments, lines 8-12, 119 onward). | 230 / PASS |
| `tests/center_modes.test.js` | center navigation | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 109 / PASS |
| `tests/chain_inspector.test.js` | read-only inspector | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 115 / PASS |
| `tests/character_bio.test.js` | character knowledge UI | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 368 / PASS |
| `tests/cheat_awakening.test.js` | cheat awakening | system named | Command exited nonzero (2/4 subtests passed); diagnostics overwritten. No deletion/merge conclusion. | 698 / FAIL |
| `tests/cheat_cards.test.js` | cheat persistence/validation | system named | Command exited nonzero (3/4 subtests passed); diagnostics overwritten. No deletion/merge conclusion. | 606 / FAIL |
| `tests/cheat_status_window.test.js` | cheat status UI | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 101 / PASS |
| `tests/check_odds.test.js` | probability/check math | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 2,497 / PASS |
| `tests/check_resolver.test.js` | check resolution | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 140 / PASS |
| `tests/chronicle.test.js` | chronicle/history | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 469 / PASS |
| `tests/claim_runtime.test.js` | claims runtime | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 353 / PASS |
| `tests/clear_state.test.js` | save reset | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 106 / PASS |
| `tests/combat_effect_semantics.test.js` | combat effects | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 658 / PASS |
| `tests/combat_fit_practice.test.js` | combat practice | system named | Shares R15 G4 fixture with audit_remainder_nonce_split; practice cost/completion/persistence are distinct from nonce determinism. | 504 / PASS |
| `tests/combat_focus.test.js` | combat focus | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 106 / PASS |
| `tests/combat_log.test.js` | combat logs | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 130 / PASS |
| `tests/combat_opponents_projection.test.js` | combat projections | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 107 / PASS |
| `tests/companion_bond_rite.test.js` | companion bond | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 126 / PASS |
| `tests/condition.test.js` | conditions | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 108 / PASS |
| `tests/content_authoring.test.js` | content authoring | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 339 / PASS |
| `tests/content_pack_provenance.test.js` | content-pack provenance | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 271 / PASS |
| `tests/content_pack_ui.test.js` | content-pack UI | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 276 / PASS |
| `tests/content_packs.test.js` | content packs | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 269 / PASS |
| `tests/contextual_balm.test.js` | contextual medicine | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 796 / PASS |
| `tests/continuation_clock.test.js` | continuation clock | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 265 / PASS |
| `tests/continuation_state.test.js` | continuation state | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 116 / PASS |
| `tests/cooling_refinement.test.js` | craft/cooling | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 4,250 / PASS |
| `tests/core_ratchets.test.js` | architecture ratchets | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 243 / PASS |
| `tests/craft_batch_goal.test.js` | crafting | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 108 / PASS |
| `tests/craft_cues.test.js` | crafting UI cues | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 112 / PASS |
| `tests/craft_depth_rules.test.js` | craft rules | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 142 / PASS |
| `tests/craft_engine.test.js` | craft engine | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 282 / PASS |
| `tests/craft_failure_ledger.test.js` | craft failure records | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 147 / PASS |
| `tests/craft_reference.test.js` | craft references | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 135 / PASS |
| `tests/crafting_detail.test.js` | crafting UI detail | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 105 / PASS |
| `tests/crafting_home_refresh.test.js` | crafting home UI | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 125 / PASS |
| `tests/crafting_native_reload.test.js` | crafting native persistence | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 3,217 / PASS |
| `tests/crafting_runtime.test.js` | craft runtime | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 136 / PASS |
| `tests/crafting_visibility.test.js` | crafting UI visibility | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 105 / PASS |
| `tests/cultivation-body-carrier.test.js` | cultivation body carrier | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 520 / PASS |
| `tests/cultivation-exposure-status.test.js` | cultivation exposure status | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 114 / PASS |
| `tests/defeat_domain.test.js` | defeat/recovery | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 115 / PASS |
| `tests/desktop_app_path.test.js` | desktop host/UI | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 115 / PASS |
| `tests/desktop_prompt_page.test.js` | desktop host/UI | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 108 / PASS |
| `tests/desktop_snapshot.test.js` | desktop host/UI | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 147 / PASS |
| `tests/determinism_replay.test.js` | deterministic replay | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 1,815 / PASS |
| `tests/distinct_world_history.test.js` | distinct-world content | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 409 / PASS |
| `tests/distinct_world_materials.test.js` | distinct-world content | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 453 / PASS |
| `tests/distinct_world_office.test.js` | distinct-world content | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 116 / PASS |
| `tests/distinct_world_paths.test.js` | distinct-world content | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 403 / PASS |
| `tests/domain_instance_isolation.test.js` | domain instances | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 1,446 / PASS |
| `tests/domain_registry.test.js` | domain registry | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 111 / PASS |
| `tests/durable_save_writer.test.js` | durable saves | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 315 / PASS |
| `tests/earned_drying_tracker.test.js` | drying tracker | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 1,340 / PASS |
| `tests/economy_domain.test.js` | economy domain | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 113 / PASS |
| `tests/economy_standing.test.js` | economy standing | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 111 / PASS |
| `tests/effect_dsl.test.js` | effect DSL/content | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 160 / PASS |
| `tests/equipment_stats.test.js` | equipment stats | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 107 / PASS |
| `tests/event_feed.test.js` | event feed | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 408 / PASS |
| `tests/everyday_life.test.js` | everyday life | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 739 / PASS |
| `tests/exchange.test.js` | exchange/crafting | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 897 / PASS |
| `tests/expansion_engine.test.js` | expansion simulation | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 529 / PASS |
| `tests/expansion_validation_memo.test.js` | expansion validation cache | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 303 / PASS |
| `tests/fa09_routines.test.js` | adoption wave / FA09 routines | wave/slice named | Delivery-wave/slice filename; route to the system owner proposed in R1. No deletion established. | 2,108 / PASS |
| `tests/fa10_manual.test.js` | adoption wave / FA10 manual work | wave/slice named | Delivery-wave/slice filename; route to the system owner proposed in R1. No deletion established. | 1,257 / PASS |
| `tests/fa11_retort.test.js` | adoption wave / FA11 retort | wave/slice named | Delivery-wave/slice filename; route to the system owner proposed in R1. No deletion established. | 1,271 / PASS |
| `tests/fa18_runner_consequence.test.js` | adoption wave / FA18 runner consequence | wave/slice named | Delivery-wave/slice filename; route to the system owner proposed in R1. No deletion established. | 304 / PASS |
| `tests/faction_rank.test.js` | faction rank | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 533 / PASS |
| `tests/family_tree.test.js` | family tree / lineage | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 440 / PASS |
| `tests/feature_panel_save_failure.test.js` | panel save-failure UX | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 303 / PASS |
| `tests/field_layer.test.js` | field simulation | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 127 / PASS |
| `tests/field_works.test.js` | field works | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 3,884 / PASS |
| `tests/field_works_extension.test.js` | field works logistics | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 3,136 / PASS |
| `tests/field_workshop.test.js` | field works | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 1,450 / PASS |
| `tests/fieldcraft_saved_jobs.test.js` | fieldcraft jobs | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 660 / PASS |
| `tests/fork_discovery_views.test.js` | fork discovery projections | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 118 / PASS |
| `tests/fork_fort.test.js` | fort branch | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 131 / PASS |
| `tests/foundation_interaction_policy.test.js` | interaction policy | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 547 / PASS |
| `tests/foundation_start_content.test.js` | foundation start content | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 351 / PASS |
| `tests/frail_start.test.js` | frail start | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 529 / PASS |
| `tests/frontier_campaign.test.js` | frontier campaign | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 901 / PASS |
| `tests/gameplay_foundations.test.js` | gameplay foundations | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 376 / PASS |
| `tests/gear_acquisition.test.js` | gear acquisition | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 258 / PASS |
| `tests/gear_affixes.test.js` | gear affixes | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 175 / PASS |
| `tests/gear_dimensions.test.js` | gear dimensions | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 246 / PASS |
| `tests/gear_workshop.test.js` | gear workshop | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 266 / PASS |
| `tests/gen_kit.test.js` | gen kit | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 413 / PASS |
| `tests/generated_people.test.js` | generated people | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 609 / PASS |
| `tests/generated_rule_grammar.test.js` | generated rule grammar | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 565 / PASS |
| `tests/habitat_care.test.js` | habitat care | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 277 / PASS |
| `tests/harvest.test.js` | harvest | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 2,689 / PASS |
| `tests/headless/collapse_once.test.js` | collapse once | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 5,214 / PASS |
| `tests/headless/defeat_journey.test.js` | defeat journey | system named | Command exited nonzero in isolated HEAD run; TAP detail was overwritten. Do not infer deadness or remove before diagnosing in a later authorized run. | 3,341 / FAIL |
| `tests/headless/economy_journey.test.js` | economy journey | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 5,269 / PASS |
| `tests/headless/household_firewood.test.js` | household firewood | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 17,128 / PASS |
| `tests/headless/lamplight_continuity.test.js` | lamplight continuity | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 28,307 / PASS |
| `tests/headless/lamplight_journey.test.js` | lamplight journey | system named | Command exited nonzero in isolated HEAD run; TAP detail was overwritten. Do not infer deadness or remove before diagnosing in a later authorized run. | 4,050 / FAIL |
| `tests/headless/runner.test.js` | runner | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 29,608 / PASS |
| `tests/heat_grades.test.js` | heat grades | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 161 / PASS |
| `tests/heir_inheritance.test.js` | heir inheritance | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 420 / PASS |
| `tests/home_domain.test.js` | home domain | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 229 / PASS |
| `tests/home_extension.test.js` | home extension | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 492 / PASS |
| `tests/home_household.test.js` | home household | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 411 / PASS |
| `tests/home_system.test.js` | home system | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 114 / PASS |
| `tests/household_firewood.test.js` | household firewood | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 143 / PASS |
| `tests/household_fortunes.test.js` | household fortunes | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 98 / PASS |
| `tests/household_fortunes_domain.test.js` | household fortunes domain | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 225 / PASS |
| `tests/household_play.test.js` | household play | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 136 / PASS |
| `tests/household_scene.test.js` | household scene | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 99 / PASS |
| `tests/hp_brewing.test.js` | hp brewing | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 140 / PASS |
| `tests/ink_lin_parity.test.js` | ink lin parity | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 1,380 / PASS |
| `tests/interaction_native.test.js` | interaction native | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 3,068 / PASS |
| `tests/interaction_system.test.js` | interaction system | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 221 / PASS |
| `tests/invention_danger_lint.test.js` | invention danger lint | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 235 / PASS |
| `tests/invention_planner.test.js` | invention planner | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 118 / PASS |
| `tests/invention_planner_fuzz.test.js` | invention planner fuzz | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 387 / PASS |
| `tests/invention_planner_golden.test.js` | invention planner golden | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 116 / PASS |
| `tests/invention_planner_limits.test.js` | invention planner limits | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 481 / PASS |
| `tests/invention_receipts.test.js` | invention receipts | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 406 / PASS |
| `tests/inventory_composition.test.js` | inventory composition | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 100 / PASS |
| `tests/inventory_overhaul.test.js` | inventory overhaul | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 97 / PASS |
| `tests/inventory_requirement_facts.test.js` | inventory requirement facts | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 99 / PASS |
| `tests/inventory_tabs.test.js` | inventory tabs | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 99 / PASS |
| `tests/known_routes.test.js` | known routes | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 105 / PASS |
| `tests/lamplight_domain.test.js` | lamplight domain | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 107 / PASS |
| `tests/lantern_loan_start.test.js` | lantern loan start | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 317 / PASS |
| `tests/layout_spec.test.js` | layout spec | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 104 / PASS |
| `tests/lever_assignment.test.js` | lever assignment | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 523 / PASS |
| `tests/lever_lesson.test.js` | lever lesson | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 535 / PASS |
| `tests/life_experience_b.test.js` | life experience b | wave/slice named | Delivery-wave/slice filename; route to the system owner proposed in R1. No deletion established. | 341 / PASS |
| `tests/life_experience_c.test.js` | life experience c | wave/slice named | Delivery-wave/slice filename; route to the system owner proposed in R1. No deletion established. | 97 / PASS |
| `tests/life_record.test.js` | life record | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 373 / PASS |
| `tests/lives_carry_codex.test.js` | lives carry codex | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 335 / PASS |
| `tests/local_livelihood.test.js` | local livelihood | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 421 / PASS |
| `tests/loot_log.test.js` | loot log | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 99 / PASS |
| `tests/lore_history.test.js` | lore history | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 505 / PASS |
| `tests/lore_history_view.test.js` | lore history view | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 635 / PASS |
| `tests/lore_immediate_definition.test.js` | lore immediate definition | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 322 / PASS |
| `tests/lotm_abilities.test.js` | lotm abilities | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 676 / PASS |
| `tests/lotm_brew.test.js` | lotm brew | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 1,405 / PASS |
| `tests/lotm_broker.test.js` | lotm broker | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 466 / PASS |
| `tests/lotm_causes.test.js` | lotm causes | system named | Near-neighbor: lotm_primary_compat.test.js:61-67 exercises primary-lane cause projections; this file:48-52 checks save-validator equivalence. Keep both contracts unless invariant-level comparison proves overlap. | 534 / PASS |
| `tests/lotm_clearance.test.js` | lotm clearance | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 769 / PASS |
| `tests/lotm_commands_golden.test.js` | lotm commands golden | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 115 / PASS |
| `tests/lotm_corpse_collector.test.js` | lotm corpse collector | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 1,664 / PASS |
| `tests/lotm_districts.test.js` | lotm districts | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 1,889 / PASS |
| `tests/lotm_ingredient_catalogue.test.js` | lotm ingredient catalogue | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 102 / PASS |
| `tests/lotm_lives.test.js` | lotm lives | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 649 / PASS |
| `tests/lotm_lives_compat.test.js` | lotm lives compat | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 118 / PASS |
| `tests/lotm_primary_compat.test.js` | lotm primary compat | system named | Near-neighbor: lotm_causes.test.js:48-52 validator compatibility; this file:61-67 checks facts and rendered pressure. Distinct observable boundaries. | 579 / PASS |
| `tests/lotm_sailor.test.js` | lotm sailor | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 663 / PASS |
| `tests/lotm_savant.test.js` | lotm savant | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 1,213 / PASS |
| `tests/lotm_seer_digestion.test.js` | lotm seer digestion | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 1,416 / PASS |
| `tests/lotm_seer_slice.test.js` | lotm seer slice | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 1,345 / PASS |
| `tests/lp3_practice_supply.test.js` | lp3 practice supply | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 651 / PASS |
| `tests/lp7_material_choice.test.js` | lp7 material choice | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 657 / PASS |
| `tests/management.test.js` | management | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 1,425 / PASS |
| `tests/material_insights.test.js` | material insights | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 159 / PASS |
| `tests/material_lineage.test.js` | material lineage | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 102 / PASS |
| `tests/meter_bar.test.js` | meter bar | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 255 / PASS |
| `tests/meter_bar_dom.test.js` | meter bar dom | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 112 / PASS |
| `tests/micro_p1_xp.test.js` | micro p1 xp | wave/slice named | Delivery-wave/slice filename; route to the system owner proposed in R1. No deletion established. | 162 / PASS |
| `tests/mixture_adapters.test.js` | mixture adapters | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 166 / PASS |
| `tests/mixture_feedback.test.js` | mixture feedback | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 254 / PASS |
| `tests/mixture_native.test.js` | mixture native | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 276 / PASS |
| `tests/mixture_rule_modules.test.js` | mixture rule modules | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 313 / PASS |
| `tests/mixture_state.test.js` | mixture state | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 116 / PASS |
| `tests/mixture_ui.test.js` | mixture ui | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 249 / PASS |
| `tests/mol_held_job_facts.test.js` | mol held job facts | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 420 / PASS |
| `tests/name_grammar.test.js` | name grammar | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 118 / PASS |
| `tests/naming_items_native.test.js` | naming items native | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 164 / PASS |
| `tests/naming_relics.test.js` | naming relics | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 119 / PASS |
| `tests/native_craft_transaction.test.js` | native craft transaction | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 104 / PASS |
| `tests/native_discovery_policy.test.js` | native discovery policy | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 99 / PASS |
| `tests/native_equipment_ownership.test.js` | native equipment ownership | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 257 / PASS |
| `tests/native_gameplay_binding.test.js` | native gameplay binding | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 252 / PASS |
| `tests/native_material_bridge.test.js` | native material bridge | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 169 / PASS |
| `tests/native_realm_traveler.test.js` | native realm traveler | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 119 / PASS |
| `tests/native_retained_method.test.js` | native retained method | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 83 / PASS |
| `tests/native_storage_transaction.test.js` | native storage transaction | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 271 / PASS |
| `tests/nearby_context_view.test.js` | nearby context view | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 78 / PASS |
| `tests/npc_lives.test.js` | npc lives | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 278 / PASS |
| `tests/obligations_ledger.test.js` | obligations ledger | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 78 / PASS |
| `tests/observation.test.js` | observation | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 918 / PASS |
| `tests/opponent_board.test.js` | opponent board | system named | Exact layout bands/columns/rows are intentional R20/R22 behavior in src/layout_spec.js; no safe shape-only deletion found. | 72 / PASS |
| `tests/optional_ui.test.js` | optional ui | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 130 / PASS |
| `tests/owned_place_clock.test.js` | owned place clock | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 82 / PASS |
| `tests/p23-combat-options.test.js` | p23 combat options | wave/slice named | Delivery-wave/slice filename; route to the system owner proposed in R1. No deletion established. | 91 / PASS |
| `tests/p23-encounter-host.test.js` | p23 encounter host | wave/slice named | Delivery-wave/slice filename; route to the system owner proposed in R1. No deletion established. | 82 / PASS |
| `tests/p23-encounter-profiles.test.js` | p23 encounter profiles | wave/slice named | Delivery-wave/slice filename; route to the system owner proposed in R1. No deletion established. | 89 / PASS |
| `tests/p23-exposure.test.js` | p23 exposure | wave/slice named | Delivery-wave/slice filename; route to the system owner proposed in R1. No deletion established. | 103 / PASS |
| `tests/p23-field-familiarity.test.js` | p23 field familiarity | wave/slice named | Delivery-wave/slice filename; route to the system owner proposed in R1. No deletion established. | 81 / PASS |
| `tests/p23-growth-profile.test.js` | p23 growth profile | wave/slice named | Delivery-wave/slice filename; route to the system owner proposed in R1. No deletion established. | 92 / PASS |
| `tests/p23-host-joins-growth.test.js` | p23 host joins growth | wave/slice named | Delivery-wave/slice filename; route to the system owner proposed in R1. No deletion established. | 74 / PASS |
| `tests/p23-host-joins-known-detail.test.js` | p23 host joins known detail | wave/slice named | Delivery-wave/slice filename; route to the system owner proposed in R1. No deletion established. | 70 / PASS |
| `tests/p23-host-joins-long-life.test.js` | p23 host joins long life | wave/slice named | Delivery-wave/slice filename; route to the system owner proposed in R1. No deletion established. | 70 / PASS |
| `tests/p23-host-joins-step2.test.js` | p23 host joins step2 | wave/slice named | Delivery-wave/slice filename; route to the system owner proposed in R1. No deletion established. | 92 / PASS |
| `tests/p23-host-joins-tranche-one.test.js` | p23 host joins tranche one | wave/slice named | Delivery-wave/slice filename; route to the system owner proposed in R1. No deletion established. | 137 / PASS |
| `tests/p23-host-joins-tranche-two.test.js` | p23 host joins tranche two | wave/slice named | Delivery-wave/slice filename; route to the system owner proposed in R1. No deletion established. | 73 / PASS |
| `tests/p23-host-joins-tranche3.test.js` | p23 host joins tranche3 | wave/slice named | Delivery-wave/slice filename; route to the system owner proposed in R1. No deletion established. | 245 / PASS |
| `tests/p23-host-joins-world-adaptation.test.js` | p23 host joins world adaptation | wave/slice named | Delivery-wave/slice filename; route to the system owner proposed in R1. No deletion established. | 347 / PASS |
| `tests/p23-household.test.js` | p23 household | wave/slice named | Delivery-wave/slice filename; route to the system owner proposed in R1. No deletion established. | 122 / PASS |
| `tests/p23-known-detail.test.js` | p23 known detail | wave/slice named | Delivery-wave/slice filename; route to the system owner proposed in R1. No deletion established. | 414 / PASS |
| `tests/p23-leisure-memory.test.js` | p23 leisure memory | wave/slice named | Delivery-wave/slice filename; route to the system owner proposed in R1. No deletion established. | 96 / PASS |
| `tests/p23-living-gear.test.js` | p23 living gear | wave/slice named | Delivery-wave/slice filename; route to the system owner proposed in R1. No deletion established. | 143 / PASS |
| `tests/p23-long-life.test.js` | p23 long life | wave/slice named | Delivery-wave/slice filename; route to the system owner proposed in R1. No deletion established. | 185 / PASS |
| `tests/p23-market-life.test.js` | p23 market life | wave/slice named | Delivery-wave/slice filename; route to the system owner proposed in R1. No deletion established. | 106 / PASS |
| `tests/p23-native-authority.test.js` | p23 native authority | wave/slice named | Delivery-wave/slice filename; route to the system owner proposed in R1. No deletion established. | 326 / PASS |
| `tests/p23-repeat-search.test.js` | p23 repeat search | wave/slice named | Delivery-wave/slice filename; route to the system owner proposed in R1. No deletion established. | 88 / PASS |
| `tests/p23-reread.test.js` | p23 reread | wave/slice named | Delivery-wave/slice filename; route to the system owner proposed in R1. No deletion established. | 131 / PASS |
| `tests/p23-salvage.test.js` | p23 salvage | wave/slice named | Delivery-wave/slice filename; route to the system owner proposed in R1. No deletion established. | 274 / PASS |
| `tests/p23-save-time-options.test.js` | p23 save time options | wave/slice named | Delivery-wave/slice filename; route to the system owner proposed in R1. No deletion established. | 353 / PASS |
| `tests/p23-world-adaptation.test.js` | p23 world adaptation | wave/slice named | Delivery-wave/slice filename; route to the system owner proposed in R1. No deletion established. | 90 / PASS |
| `tests/p23_life_loops.test.js` | p23 life loops | wave/slice named | Delivery-wave/slice filename; route to the system owner proposed in R1. No deletion established. | 83 / PASS |
| `tests/palette_feedback.test.js` | palette feedback | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 82 / PASS |
| `tests/palette_native.test.js` | palette native | system named | Slow (10,914 ms); no test deletion established from cost alone. | 10,914 / PASS |
| `tests/paradise_chart_enrolment.test.js` | paradise chart enrolment | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 384 / PASS |
| `tests/party_battle.test.js` | party battle | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 824 / PASS |
| `tests/party_partner.test.js` | party partner | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 710 / PASS |
| `tests/peer_standing_domain.test.js` | peer standing domain | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 268 / PASS |
| `tests/people_knowledge.test.js` | people knowledge | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 391 / PASS |
| `tests/perishable_observation.test.js` | perishable observation | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 82 / PASS |
| `tests/place_types_projection.test.js` | place types projection | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 82 / PASS |
| `tests/planning_read_frame.test.js` | planning read frame | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 80 / PASS |
| `tests/pledges.test.js` | pledges | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 93 / PASS |
| `tests/presentation_style.test.js` | presentation style | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 81 / PASS |
| `tests/primordial_credit.test.js` | primordial credit | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 481 / PASS |
| `tests/processed_materials.test.js` | processed materials | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 165 / PASS |
| `tests/procgen_wave1_integration.test.js` | procgen wave1 integration | wave/slice named | Delivery-wave/slice filename; route to the system owner proposed in R1. No deletion established. | 104 / PASS |
| `tests/product_appearance.test.js` | product appearance | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 304 / PASS |
| `tests/progression_gates.test.js` | progression gates | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 85 / PASS |
| `tests/progression_pledges.test.js` | progression pledges | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 85 / PASS |
| `tests/promise_situation.test.js` | promise situation | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 822 / PASS |
| `tests/pursuit.test.js` | pursuit | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 1,078 / PASS |
| `tests/rank_gap_observer.test.js` | rank gap observer | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 96 / PASS |
| `tests/reach_run_admission.test.js` | reach run admission | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 76 / PASS |
| `tests/reach_structured.test.js` | reach structured | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 210 / PASS |
| `tests/realm_cargo.test.js` | realm cargo | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 104 / PASS |
| `tests/realm_connections.test.js` | realm connections | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 109 / PASS |
| `tests/realm_dormant_structured.test.js` | realm dormant structured | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 261 / PASS |
| `tests/realm_optional_context.test.js` | realm optional context | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 90 / PASS |
| `tests/realm_traveler_profiles.test.js` | realm traveler profiles | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 103 / PASS |
| `tests/reedbank_ability_claims.test.js` | reedbank ability claims | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 670 / PASS |
| `tests/reference_optional_target.test.js` | reference optional target | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 382 / PASS |
| `tests/refit_k1_k2.test.js` | refit k1 k2 | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 376 / PASS |
| `tests/relationship_view.test.js` | relationship view | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 97 / PASS |
| `tests/remainder_consequences_native_context.test.js` | remainder consequences native context | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 379 / PASS |
| `tests/replay_harness.test.js` | replay harness | system named | Slow (11,435 ms); no test deletion established from cost alone. | 11,435 / PASS |
| `tests/reputation_state.test.js` | reputation state | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 84 / PASS |
| `tests/resident_allocation_funding.test.js` | resident allocation funding | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 523 / PASS |
| `tests/reveal_chain.test.js` | reveal chain | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 84 / PASS |
| `tests/rt_slice1_fixtures.test.js` | rt slice1 fixtures | wave/slice named | Command exited nonzero; diagnostic not retained. Wave-named fixture scenario, but no deletion conclusion. | 623 / FAIL |
| `tests/rule_modules.test.js` | rule modules | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 165 / PASS |
| `tests/rules.test.js` | rules | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 89 / PASS |
| `tests/rune_grammar.test.js` | rune grammar | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 88 / PASS |
| `tests/save_compatibility.test.js` | save compatibility | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 85 / PASS |
| `tests/save_files.test.js` | save files | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 298 / PASS |
| `tests/scenario_facade.test.js` | scenario facade | system named | Slow (7,438 ms); no test deletion established from cost alone. | 7,438 / PASS |
| `tests/seeded_streams.test.js` | seeded streams | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 438 / PASS |
| `tests/shell_composition.test.js` | shell composition | system named | Exact dimensions exercise the shell sizing function and named layout policy; review pixel constants only if the accepted desktop layout changes. | 102 / PASS |
| `tests/shell_item_description.test.js` | shell item description | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 97 / PASS |
| `tests/shell_strip_boxes.test.js` | shell strip boxes | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 95 / PASS |
| `tests/shop_restock.test.js` | shop restock | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 92 / PASS |
| `tests/simfuzz/simfuzz.test.js` | simfuzz | system named | Slow (9,733 ms); no test deletion established from cost alone. | 9,733 / PASS |
| `tests/simulation.test.js` | simulation | system named | Slow (4,625 ms); no test deletion established from cost alone. | 4,625 / PASS |
| `tests/simulation_extensions.test.js` | simulation extensions | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 631 / PASS |
| `tests/simulation_frame.test.js` | simulation frame | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 275 / PASS |
| `tests/simulation_hidden_display.test.js` | simulation hidden display | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 80 / PASS |
| `tests/simulation_optional_enrollment.test.js` | simulation optional enrollment | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 254 / PASS |
| `tests/simulation_ui_hidden.test.js` | simulation ui hidden | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 262 / PASS |
| `tests/simulation_validation_cache.test.js` | simulation validation cache | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 87 / PASS |
| `tests/skill_coached_practice.test.js` | skill coached practice | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 685 / PASS |
| `tests/skill_disabled_reasons.test.js` | skill disabled reasons | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 488 / PASS |
| `tests/skill_fluency.test.js` | skill fluency | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 555 / PASS |
| `tests/skill_inspector.test.js` | skill inspector | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 389 / PASS |
| `tests/skill_overflow.test.js` | skill overflow | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 89 / PASS |
| `tests/skill_plateau.test.js` | skill plateau | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 797 / PASS |
| `tests/slake_bench_start.test.js` | slake bench start | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 373 / PASS |
| `tests/source_suppliers_constructs.test.js` | 11 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 755 / PASS |
| `tests/start_records.test.js` | 11 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 164 / PASS |
| `tests/stepper_life_commit.test.js` | 1 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 587 / PASS |
| `tests/stepper_retirement_paths.test.js` | 1 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 119 / PASS |
| `tests/stock_view.test.js` | 4 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 1,211 / PASS |
| `tests/storage_comparison.test.js` | 1 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 141 / PASS |
| `tests/story_recognizer_and_world_history.test.js` | 3 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 150 / PASS |
| `tests/story_request_unique.test.js` | 7 named cases | system named | Near-neighbor: story_requests.test.js:11-59 shares request/escrow lifecycle; this file:9-56 protects persistent named-object identity and reclaim/delivery. | 1,832 / PASS |
| `tests/story_requests.test.js` | 8 named cases | system named | Near-neighbor: story_request_unique.test.js:9-56 shares escrow/request lifecycle; ordinary admission/quota/settlement remains distinct. | 2,753 / PASS |
| `tests/story_spine_qa.test.js` | 2 named cases | system named | Slowest observed file (38,230 ms in shard D under concurrent shard load); cost alone is not a deletion reason. Seeded scheduler invariant should remain. | 38,230 / PASS |
| `tests/story_spine_streams.test.js` | 2 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 109 / PASS |
| `tests/storylet_deck.test.js` | 7 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 2,512 / PASS |
| `tests/storylet_ui.test.js` | 1 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 196 / PASS |
| `tests/structured_ability_runtime.test.js` | 8 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 291 / PASS |
| `tests/structured_beginning_choice.test.js` | 2 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 67 / PASS |
| `tests/structured_container_development.test.js` | 3 named cases | system named | One of four container lifecycle suites; see structured_container_* rows and merge proposal M1. | 69 / PASS |
| `tests/structured_container_integration.test.js` | 5 named cases | system named | One of four container lifecycle suites; see structured_container_* rows and merge proposal M1. | 265 / PASS |
| `tests/structured_container_preparation.test.js` | 4 named cases | system named | One of four container lifecycle suites; see structured_container_* rows and merge proposal M1. | 72 / PASS |
| `tests/structured_container_runtime.test.js` | 10 named cases | system named | One of four container lifecycle suites; see structured_container_* rows and merge proposal M1. | 75 / PASS |
| `tests/structured_equipment_runtime.test.js` | 9 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 75 / PASS |
| `tests/structured_expedition_runtime.test.js` | 11 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 316 / PASS |
| `tests/structured_life_runtime.test.js` | 6 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 71 / PASS |
| `tests/structured_origins.test.js` | 12 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 243 / PASS |
| `tests/structured_pack_definitions.test.js` | 9 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 212 / PASS |
| `tests/structured_pack_runtime.test.js` | 15 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 293 / PASS |
| `tests/structured_pack_ui.test.js` | 7 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 74 / PASS |
| `tests/structured_renewal.test.js` | 5 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 275 / PASS |
| `tests/systems_irrigation_model.test.js` | 4 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 70 / PASS |
| `tests/systems_workshop.test.js` | 14 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 1,377 / PASS |
| `tests/tag_store.test.js` | 17 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 75 / PASS |
| `tests/teacher_window.test.js` | 4 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 945 / PASS |
| `tests/techniques.test.js` | 8 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 349 / PASS |
| `tests/temperature_band.test.js` | 2 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 68 / PASS |
| `tests/titles.test.js` | 6 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 67 / PASS |
| `tests/tools_commit_contract.test.js` | 8 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 82 / PASS |
| `tests/tools_domain.test.js` | 4 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 146 / PASS |
| `tests/tools_panel.test.js` | 3 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 76 / PASS |
| `tests/town.test.js` | 6 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 315 / PASS |
| `tests/trader_templates.test.js` | 1 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 68 / PASS |
| `tests/traveler_contract_v2.test.js` | 4 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 499 / PASS |
| `tests/traveler_lint_hint.test.js` | 3 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 1,722 / PASS |
| `tests/ui_change_signal.test.js` | 5 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 77 / PASS |
| `tests/ui_contract.test.js` | 3 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 2,296 / PASS |
| `tests/ui_extras.test.js` | 14 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 107 / PASS |
| `tests/ui_polish.test.js` | 3 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 73 / PASS |
| `tests/upstream_dev.test.js` | 3 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 75 / PASS |
| `tests/v06_migration.test.js` | 4 named cases | version named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 251 / PASS |
| `tests/village_career.test.js` | 5 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 250 / PASS |
| `tests/village_choices.test.js` | 4 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 77 / PASS |
| `tests/village_life.test.js` | 8 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 353 / PASS |
| `tests/village_mentor.test.js` | 4 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 254 / PASS |
| `tests/village_obtainability.test.js` | 4 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 197 / PASS |
| `tests/village_study.test.js` | 3 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 244 / PASS |
| `tests/village_traveler_asks.test.js` | 3 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 180 / PASS |
| `tests/village_workspace.test.js` | 4 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 78 / PASS |
| `tests/warm_hand_start.test.js` | 5 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 288 / PASS |
| `tests/work_ledger_busy_read.test.js` | 1 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 68 / PASS |
| `tests/work_status_view.test.js` | 2 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 71 / PASS |
| `tests/workspace_composition.test.js` | 2 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 71 / PASS |
| `tests/workspace_disclosure.test.js` | 2 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 65 / PASS |
| `tests/workspace_focus.test.js` | 1 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 71 / PASS |
| `tests/workspace_spec.test.js` | 2 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 66 / PASS |
| `tests/world_calendar.test.js` | 7 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 176 / PASS |
| `tests/world_climate.test.js` | 7 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 841 / PASS |
| `tests/world_completion_actor_context.test.js` | 1 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 186 / PASS |
| `tests/world_completion_native_restore.test.js` | 2 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 64 / PASS |
| `tests/world_completion_sample_owner.test.js` | 2 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 83 / PASS |
| `tests/world_history_consumers.test.js` | 1 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 150 / PASS |
| `tests/world_instances.test.js` | 8 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 76 / PASS |
| `tests/world_knowledge.test.js` | 5 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 299 / PASS |
| `tests/world_pack.test.js` | 8 named cases | system named | Adjacent lifecycle suites: manifest, loader, registry, save and invariants. Their tested stages differ; retain absent assertion-level duplication. | 106 / PASS |
| `tests/world_pack_budget.test.js` | 3 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 750 / PASS |
| `tests/world_pack_hp.test.js` | 6 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 105 / PASS |
| `tests/world_pack_invariants.test.js` | 7 named cases | system named | Adjacent world-pack suites; world-pack invariants are separate unless assertions duplicate exactly. | 124 / PASS |
| `tests/world_pack_loader.test.js` | 11 named cases | system named | Adjacent world-pack suites; loading differs from authoring schema and registry wiring. | 139 / PASS |
| `tests/world_pack_manifest.test.js` | 9 named cases | system named | Adjacent world-pack suites; schema/manifest coverage differs from loading and install wiring. | 100 / PASS |
| `tests/world_pack_multiverse.test.js` | 8 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 93 / PASS |
| `tests/world_pack_population.test.js` | 8 named cases | system named | No specific duplicate, incidental-shape, or dead-test candidate established in this bounded scan. | 107 / PASS |
| `tests/world_pack_registry.test.js` | 5 named cases | system named | Adjacent world-pack suites; installation/wiring differs from loader and manifest checks. | 121 / PASS |
| `tests/world_pack_save.test.js` | 9 named cases | system named | Adjacent world-pack suites; save behavior is separate. | 126 / PASS |

## Proposals

### Merges

| ID | Proposed change | Reason | Risk | Invariant that must remain covered |
|---|---|---|---|---|
| M1 | Consolidate `structured_container_{development,integration,preparation,runtime}.test.js` into `structured_container.test.js`, retaining named lifecycle cases. | Four system-named files cover one container subsystem and create navigation overhead; assertions at development:18-31, integration:23-44, preparation:16-48, runtime:17-60 describe different stages rather than duplicate tests. | A large file can obscure stage ownership and make focused runs costlier; keep sections and meaningful names, and retain the same focused command. | Definition/development rules; prepared state; real ownership/title and custody; actual access debit; storage/retrieval, clock freeze and expiry; refusal atomicity; save/legacy behavior. |
| M2 | Consider a single `native_host_joins.test.js` for the P23 tranche/step host-join files, after separating cases by joined system and comparing assertion coverage. | Current names encode delivery batches (`p23-host-joins-step2`, `tranche-one/two/3`, plus growth, known-detail, long-life, world-adaptation). | They join different domains; a blind concatenation could hide owner boundaries or accidentally drop a unique edge case. Do not merge mechanically. | Each join still proves its actual host boundary, owner-specific admission, durable state, and failure atomicity. |

### Renames into system files

| ID | Current files | Proposed system owner / destination | Reason | Risk | Invariant that must remain covered |
|---|---|---|---|---|---|
| R1 | `absorb_b.test.js`, `absorb_c1.test.js`, `absorb_c2.test.js`, `absorb_d.test.js`, `absorb_e1.test.js`, `absorb_e2.test.js`, `absorb_e3.test.js` | Split assertions by owning system: home furnishing, craft/equipment, local-life exposure/search, fort supply, pacing, durability, and combat/affinity. Extend existing system suites where present; use `fort_supply.test.js` only if no owner exists. | `absorb_*` identifies an absorption batch, not the protected system; some files mix multiple owners. | Moving mixed coverage can break imports/fixtures or erase adoption history; move each case once and retain test behavior and focused discovery. | Existing behavior for home bonuses, native acquisition/craft/equipment, local-life and fort state, pacing/exposure, durability, and elemental combat as covered by each source case. |
| R2 | `p23-combat-options.test.js`, `p23-encounter-host.test.js`, `p23-encounter-profiles.test.js`, `p23-exposure.test.js`, `p23-field-familiarity.test.js`, `p23-growth-profile.test.js`, `p23-household.test.js`, `p23-known-detail.test.js`, `p23-leisure-memory.test.js`, `p23-living-gear.test.js`, `p23-long-life.test.js`, `p23-market-life.test.js`, `p23-native-authority.test.js`, `p23-repeat-search.test.js`, `p23-reread.test.js`, `p23-salvage.test.js`, `p23-save-time-options.test.js`, `p23-world-adaptation.test.js`, `p23_life_loops.test.js` | Route cases to combat, encounter/native host, cultivation/exposure, field works, household, knowledge/reading, companion/living gear, titles, economy, save/backup, and world adaptation system owners. Use a semantic new owner only where no existing system suite owns that boundary. | `p23-*` reports project wave provenance, not system organization. | Several files are already distinct system boundaries; rename does not imply combining them. Preserve every case, fixture and focused runner entry during move. | The named feature behavior in each source file, especially persistence, replay prevention, eligibility, custody and native host publication gates. |
| R3 | `p23-host-joins-growth.test.js`, `p23-host-joins-known-detail.test.js`, `p23-host-joins-long-life.test.js`, `p23-host-joins-step2.test.js`, `p23-host-joins-tranche-one.test.js`, `p23-host-joins-tranche-two.test.js`, `p23-host-joins-tranche3.test.js`, `p23-host-joins-world-adaptation.test.js` | `native_host_joins.test.js` or owner-specific host integration files, grouped by joined domain. | The filenames preserve tranche/step dispatch history. | A shared file could conceal distinct host adapters; retain test-case ownership labels and do not force unrelated domains together. | Host integration still proves current owner wiring, one-time commit/persistence, and rejection without partial mutation for each joined domain. |
| R4 | `fa09_routines.test.js`, `fa10_manual.test.js`, `fa11_retort.test.js`, `fa18_runner_consequence.test.js` | Route to expedition/routine, manual work, retort/crafting, and local-life/runner consequence system owners. | FA identifiers are delivery references; the tests exercise separate mechanics. | Some files have cross-domain setup; do not collapse distinct systems into one generic expansion suite. | Paid and earned causes, actual stock/fund conservation, location/work gates, consequence and idempotent settlement from each case. |
| R5 | `life_experience_b.test.js`, `life_experience_c.test.js`, `micro_p1_xp.test.js` | Chronicle/life record and XP progression owners. | Suffixes encode delivery slices. | Preserve lifecycle and compatibility cases; avoid combining separate progression contracts just to reduce file count. | Existing life-history, inheritance, experience and XP invariants in the source cases. |
| R6 | `procgen_wave1_integration.test.js`, `rt_slice1_fixtures.test.js` | `generated_people.test.js` / `seeded_streams.test.js` integration owner; save compatibility / native loader fixture owner, respectively. | Both filenames are wave/slice labels instead of the system under test. | `rt_slice1_fixtures` failed in the one-time run with no retained diagnostic; defer its move until a later run can preserve the cause and establish whether the fixture still represents a needed path. | Seeded generation remains deterministic and non-consuming; representative old saves restore through the current native loader with craft, levels and completed progression preserved. |

### Deletions

No deletion is proposed. No obviously dead test was established, and the five command failures lack diagnostics. Runtime cost alone does not show redundancy. Preserve the separate compatibility, persistence, native boundary, and user-visible layout checks unless assertion-level evidence shows an invariant is already covered elsewhere.

## Sol review and limits

I reviewed the flagged source locators against committed HEAD. `opponent_board.test.js:36-42, 45-53, 66-75` checks count bands, grouping, height and slot behavior defined as R20/R22 in `src/layout_spec.js:115, 132, 353-367`; these are explicit layout behavior, not safe incidental-shape deletions. `shell_composition.test.js:13-21, 31-40` checks exact sizing outputs from a pure sizing function; retain while those desktop layout values remain the accepted behavior, and revisit only with a design change. `book_world_native_binding.test.js:8-12` explicitly declares its golden trace/save keys as compatibility checks, so its broad snapshot is intentional. The listed shared-fixture and lifecycle pairs exercise different observable invariants; no merge is justified solely by common setup or domain adjacency.

The exact-title scan was independently repeated over the isolated archive. Static semantic overlap review was sampled, not exhaustive for every assertion in 380 files. Results are proposal input, not accepted cleanup.

## Timing and result notes

Recorded durations are the elapsed wall time around each child `node --test` invocation, rounded to milliseconds. All paths used HEAD source from isolated archive copies; dirty test contents were not executed. Shard A’s duplicate invocation means the first observed timing for `foundation_interaction_policy.test.js` is listed. Run-to-run variability and concurrent shard load limit these figures to rough per-file cost indicators.

No test or source file was edited. This document is the only requested output.
