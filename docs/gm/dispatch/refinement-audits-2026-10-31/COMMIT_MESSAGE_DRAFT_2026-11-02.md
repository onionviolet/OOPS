# Commit message draft, Klein campaign batch (2026-11-02)

For Weibao's review. Nothing is committed or pushed. No `Co-Authored-By` trailer. The block below is the message body.

```
Klein campaign KJ1–KJ3D: place-act sequences, remote presence, meal items, task summary, native runner, receipts

Included (family A of the manifest in
docs/gm/dispatch/refinement-audits-2026-10-31/LOTM_PROGRESS_RECONCILIATION_2026-11-02.md):
- New runtime: place_act_sequence, place_remote_presence, household_meal_items,
  ui/lotm_task_summary, ui/local_money_label.
- Modified runtime for the campaign: place_acts, place_act_operations, the
  book_world_lotm host/ui/domain/content/state/actions/cast_host modules, observer_view
  (registerCapability), main (untilIdle stepper hook), display, skill_records_domain,
  constraint_pack, constraint_store, adventure_notebook, today_strip, perspective_controls,
  inventory_tabs, simulation_effects (completed.* facts).
- Tests for the above (new and modified), native playtest runner and probes under
  scripts/playtest, lead_run place-act and edition tools, situation-to-UI map tool.
- Docs: the refinement-audits-2026-10-31 folder (receipts, UI audit evidence, this
  reconciliation) and the owner docs the campaign edited: PROJECT.md, DESIGN.md,
  USER_VISION, VISION_DIGEST, LEAD_LIFE_GUIDE, WORLD_ENTRY_RULES, PROJECT_LOG_2026-10-29,
  WRITEUP_REGISTER, BOOK_WORLD_FEATURE_GAPS, procgen cr3 AUTOMATION.

Excluded, left in the working tree for their own batches:
- B combat L2a/L2b (combat_situation_ui, tempo_fight*, ui/combat_situation,
  ui/tempo_interaction and their tests).
- C canon pull and its panel scope: canon_pull_panel, and the panel `access` hunks in
  panel_kit, workspace_layout and tests/workspace_focus.
- D reconciliation tooling (check_doc_slips, check_rules_index, check_rule_behavior,
  plan_review_status and their tests) and the other modified reconciliation/rules docs.
- E workbench prototypes and the index.html / figure-gallery.html version stamps.
- F stray files (52-46, p51, actions.png, rite_*.py, lotm_summons_rows.js.bak).
- G simulation_content and storylet_content one-line requires fixes.
- dist/ is not rebuilt or staged in this commit.

Verification (agent-verified, not human-reviewed):
- npm run build and npm run check:arch passed; check:rules passed with 2 warnings that
  clear once the folder is committed.
- Full npm test: 4,925 tests, 4,922 passed, 0 failed, 3 cancelled (300 s per-test
  timeouts in live browser integrations under load 12-13). The three files passed alone
  afterwards: cast_making_adapter 5/5, place_acts 13/13, cast_inference_adapter 6/6
  (second run at load 8, same build hash). This is not one clean monolithic run.
- Evidence row reached: agent-verified, not human-reviewed. No playable acceptance
  by Weibao yet.
```
