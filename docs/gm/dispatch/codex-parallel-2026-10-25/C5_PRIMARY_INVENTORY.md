# C5 primary checkout dirty inventory

Snapshot at the captured porcelain read. The manifest preserves every original `git status --porcelain=v1 -uall` line and adds ownership/status/evidence annotations without changing the captured status. Concurrent edits after the snapshot may change today’s tree.

## Count check

- Captured entries: **1,343**; modified tracked: **140**; untracked: **1,203**; staged: **0**.
- Group totals: **86 groups / 1,343 paths**, equal to the manifest total.
- Every entry retains its exact path/status line and has a group, owner, state, checkpoint and evidence note. For tracked modifications, last committed path receipts are included where available.

## Owner and state map

Checkpoint status means evidence for its stated frozen input, not current merged source, installed behavior or human acceptance. The state map uses the [C5 checkpoint inventory](C5_CHECKPOINT_INVENTORY.md), current final receipt sections and path-specific checkpoint reservations.

| Inventory group | Paths | State / owner | Checkpoint and evidence |
|---|---:|---|---|
| `docs/gm/dispatch/ui-modular-2026-10-22` | 268 | finished and gate-passing at frozen input: UI modularity lane | `docs/gm/dispatch/ui-modular-2026-10-22/CHECKPOINT.md`. UM3/4/5/8/9 browser/full checks and hunk-wise integration recorded; human visual acceptance and several layout cases remain. |
| `runtime-and-verification` | 218 | 16 explicitly active; 59 likely cultivation; 4 MCP lane; 109 unresolved runtime; 28 unresolved host/tooling; 2 generated outputs: mixed feature ownership | `Cultivation checkpoint reservations; C2/README lane records; exact path history in JSON`. Per-path JSON distinguishes explicit mention from feature-family inference; shared dist remains current-input unknown. |
| `docs/gm/dispatch/distinct-world-w1-w4-2026-10-22` | 175 | finished and gate-passing at frozen input: W1–W4 distinct-world owner | `docs/gm/dispatch/distinct-world-w1-w4-2026-10-22/CHECKPOINT.md`. Final isolated full suite, rules, five rebuilt journeys and ten persistence states recorded; reservations released, adoption/human acceptance remain. |
| `docs/gm/dispatch/complementary-journeys-2026-10-23` | 156 | finished and gate-passing at frozen input: O/F/A journeys coordinator | `docs/gm/dispatch/complementary-journeys-2026-10-23/CHECKPOINT.md`. Final frozen receipt records full suite, build/arch/rules and native proof; later O/F/A and Qud landings include the released estate/inspector fixes; app adoption remains separate. |
| `docs/gm/dispatch/cultivation-absorption-2026-10-24` | 50 | in progress: cultivation absorption owner | `docs/gm/dispatch/cultivation-absorption-2026-10-24/CHECKPOINT.md`. Checkpoint records many native slices but explicitly continues social/family/territory/body/law/path/guide variants, drainage work and combined gates; active reservation remains. |
| `docs/gm/dispatch/overarching-reconciliation-2026-10-23` | 44 | finished and gate-passing at frozen scope: documentation/reconciliation coordinator | `docs/gm/dispatch/overarching-reconciliation-2026-10-23/CHECKPOINT.md`. R2/R3 and shared-doc link/zero-loss checks recorded; feature followups were explicitly left with incumbents. |
| `docs/reviews/proto23_desktop_2026-10-21` | 43 | finished and unverified (review evidence only): Review author / named feature owner | `review file itself and referenced owner checkpoint`. Review findings are not acceptance or ownership transfer. |
| `docs/gm/dispatch/high-tier-power-2026-10-23` | 39 | finished and gate-passing at frozen input: high-tier power closure | `docs/gm/dispatch/high-tier-power-2026-10-23/CHECKPOINT.md`. Recorded isolated and integrator combined gates; input-specific. Human acceptance/current combined adoption remain distinct. |
| `docs/gm/dispatch/cultivation-spacing-2026-10-22` | 38 | finished and gate-passing at frozen input: Proto23/Mistglass UI/runtime | `docs/gm/dispatch/cultivation-spacing-2026-10-22/CHECKPOINT.md`. Full suite/build/arch/rules and six desktop/text browser cases recorded on frozen bundle; normal app Save/reload or restart adoption remains. |
| `docs/gm/dispatch/progression-gates-2026-10-23` | 36 | mixed: completed slices plus open/owned followups: progression-gate parent | `docs/gm/dispatch/progression-gates-2026-10-23/CHECKPOINT.md`. GTL6 and D1/D3/Paradise receipts are distinct; some work is Git-confirmed landed, successor D2 and combined ownership remain separate. |
| `docs/gm/dispatch/codex-parallel-2026-10-25` | 27 | in progress / mixed lane returns: A1–C5 Codex dispatch coordinator | `docs/gm/dispatch/codex-parallel-2026-10-25/README.md`. README.md is the owner index. A1–B5 have receipts; C1–C4 retain lanes and C5 reconciliation is active. Do not assume a CHECKPOINT.md exists. |
| `docs/gm/dispatch/itch-wiring-2026-10-23` | 25 | finished and gate-passing at frozen input: W3 wiring / lives-carry owner | `docs/gm/dispatch/itch-wave-2026-10-23/CHECKPOINT.md; docs/gm/dispatch/itch-wiring-2026-10-23/lives-carry-wiring.md`. Use final W3/O-F-A receipts, not the initial failure screenshots: stable-input combined gate and native lineage/lives-carry journeys are recorded; open human acceptance remains. |
| `docs/worlds` | 23 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `world-core-cards-and-source-research` | 22 | finished research / runtime unverified; active You Are Summoned exception: World core kit/source research | `docs/research/SOURCE_DEEP_DIVE_QUEUE_2026-10-24.md and each card`. Read card/queue status; You Are Summoned work remains incumbent-owned. |
| `docs/reviews/corc_ui_2026-10-21` | 22 | finished and unverified (review evidence only): Review author / named feature owner | `review file itself and referenced owner checkpoint`. Review findings are not acceptance or ownership transfer. |
| `docs/gm/dispatch/household-fortunes-wiring-2026-10-23` | 20 | finished and gate-passing at frozen input: household fortunes/social wiring | `docs/gm/dispatch/household-fortunes-wiring-2026-10-23/CHECKPOINT.md`. Focused neighboring tests, build/arch/rules and fresh-origin persistence recorded; follow-up behaviors remain open. |
| `docs/gm/dispatch/w3-lineage-2026-10-23` | 14 | finished and gate-passing at frozen input: W3 lineage lane, integrated by O/F/A | `docs/gm/dispatch/itch-wave-2026-10-23/CHECKPOINT.md; docs/gm/dispatch/features-o1-o5-2026-10-23/RESULT.md`. Final record says serial 1536 and 1920 lineage proof 14/14 each on the D2-applied stable input. Earlier stall was a slow run; later final combined gate is separately recorded. |
| `docs/research/itch-io-2026-10-22` | 10 | finished evidence / integration mixed: W3 source-research lanes | `docs/gm/dispatch/itch-wave-2026-10-23/CHECKPOINT.md`. Notes are source/research outputs, not standalone proof of current combined gameplay. |
| `docs/research/minecraft` | 10 | finished research / implementation separate: Minecraft-fit/WV research owners | `docs/gm/dispatch/minecraft-fit-2026-10-21/CHECKPOINT.md`. Source audits/synthesis are research records; native feature delivery is separately gated. |
| `docs/gm/dispatch/w3-spatial-2026-10-23` | 9 | finished and gate-passing at frozen input: W3 spatial/home-layout proof | `docs/gm/dispatch/features-o1-o5-2026-10-23/RESULT.md; docs/gm/dispatch/itch-wave-2026-10-23/CHECKPOINT.md`. Layout proof records desktop cases and moved-box save; proof saves are excluded from documentary commit candidates. |
| `docs/gm/dispatch/itch-depth-2026-10-23` | 6 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `docs/gm/dispatch/lotm-q2-2026-10-23` | 6 | finished and gate-passing at frozen input: district/region lane; reconciled by lives/regions | `docs/gm/dispatch/lotm-q2-2026-10-23/CHECKPOINT.md`. Browser/reload/import and focused/architecture proof recorded; remaining district/viewport cases remain open and later combined owner reconciles it. |
| `docs/gm/dispatch/claude-coordinator-continuation-2026-10-23` | 5 | finished and unverified: continuation coordinator | `docs/gm/dispatch/claude-coordinator-continuation-2026-10-23/CHECKPOINT.md`. Read-only routing/handoff record; its checkpoint says no gameplay source/tests were changed. |
| `docs/gm/dispatch/w3-events-2026-10-23` | 4 | finished and gate-passing at frozen input: W3 events proof | `docs/gm/dispatch/features-o1-o5-2026-10-23/RESULT.md; docs/gm/dispatch/itch-wave-2026-10-23/CHECKPOINT.md`. Event UI screenshots and final stable-input integration receipts exist; images prove only their recorded states. |
| `docs/gm/dispatch/w3-institutions-2026-10-23` | 4 | finished and gate-passing at frozen input: W3 institutions proof | `docs/gm/dispatch/features-o1-o5-2026-10-23/RESULT.md; docs/gm/dispatch/itch-wave-2026-10-23/CHECKPOINT.md`. Screenshots and final integrated proof exist; wider institutional coverage/human acceptance remain separate. |
| `docs/audits` | 3 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `docs/gm/dispatch/features-o1-o5-2026-10-23` | 3 | finished and gate-passing at frozen input: O1–O5 feature lanes / O-F-A integration | `docs/gm/dispatch/features-o1-o5-2026-10-23/RESULT.md; docs/gm/dispatch/itch-wave-2026-10-23/CHECKPOINT.md`. Final stable candidate gate and browser results are recorded. The later O-F-A integration receipt supersedes earlier pending/no-commit lines. |
| `.claude/rules` | 2 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `docs/gm` | 2 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `docs/tools` | 2 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `resources/fonts` | 2 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `.claude/skills` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `.codex/config.toml` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `AGENTS.md` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `PROJECT.md` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `docs/AGENT_USAGE_RULES.md` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `docs/CHEAT_LIBRARY.md` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `docs/ENGINE_RUNTIME_PERFORMANCE_AND_STACK_CONSIDERATIONS_2026-10-14.md` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `docs/GEAR_DEPTH_BLACKSMITHING_CHEMISTRY_ENERGY_POWERS_CONSIDERATIONS_2026-10-20.md` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `docs/MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `docs/PROGRESSION_GATE_OVERFLOW_2026-10-23.md` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `docs/RULES_INDEX.md` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `docs/SYSTEMS_REGISTER.md` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `docs/TECHNOLOGY_AND_PROGRESSION.md` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `docs/TOOL_REGISTRY.md` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `docs/USER_VISION.md` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `docs/WORLD_CARDS.md` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `docs/gm/dispatch/lotm-lives-regions-2026-10-23` | 1 | finished and gate-passing at frozen input: LOTM pathway/region owner | `docs/gm/dispatch/lotm-lives-regions-2026-10-23/QUEUE.md`. Actual owner record here is QUEUE.md, not CHECKPOINT.md. Q1/Q2/Q3–Q6 and combined tests/browser persistence are recorded; unplayed paths and visual acceptance remain. |
| `docs/gm/dispatch/lotm-q1-2026-10-23` | 1 | finished and gate-passing at frozen input: Corpse Collector lane; superseded by lives/regions | `docs/gm/dispatch/lotm-q1-2026-10-23/CHECKPOINT.md`. Standalone source/test/browser proof is historical; later lives/regions record supersedes pathway switching interpretation. |
| `docs/research/BOOK_CANDIDATES_2026-10-22.md` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `docs/research/ITCH_IO_IDLE_SCREEN_2026-10-22.md` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `docs/research/PROTOLIKE_AND_CULTIVATION_DISCOVERY_2026-10-22.md` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `docs/research/SOURCE_DEEP_DIVE_PLAYBOOK.md` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `docs/research/SOURCE_REQUESTS.md` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `docs/research/power-systems` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `index.html` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `package.json` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `.agents/skills` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `.mcp.json` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `docs/HIGH_TIER_POWER_CONSIDERATIONS_2026-10-23.md` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `docs/WORLD_PASS_RULES.md` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `docs/gm/dispatch/deep-engine-2026-10-20` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `docs/gm/dispatch/engine-bindings-2026-10-22` | 1 | finished and gate-passing at frozen input: E1–E6 binding lane, superseded by W1–W4 | `docs/gm/dispatch/engine-bindings-2026-10-22/CHECKPOINT.md`. Historical E1/E5a proof is closed; later W1–W4 checkpoint owns remaining journeys. |
| `docs/gm/dispatch/itch-wave-2026-10-23` | 1 | in progress: W3 coordinator / later integration | `docs/gm/dispatch/itch-wave-2026-10-23/CHECKPOINT.md`. Checkpoint has dated transitions and names later lineage diagnosis/successor ownership; earlier passes do not close the current combined gate. |
| `docs/gm/dispatch/primordial-credit-2026-10-24` | 1 | finished and unverified: Primordial credit restart lane | `docs/gm/dispatch/primordial-credit-2026-10-24/CHECKPOINT.md`. Bounded code lane and browser pane at a fresh origin recorded; explicit open locators and normal app/human gates remain. |
| `docs/gm/dispatch/reference-mechanics-2026-10-25` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `docs/research/BOOK_ACQUISITION_RECEIPT_2026-10-24.md` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `docs/research/FAN_CYOA_JUMPCHAIN_2026-10-22.md` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `docs/research/FAN_INTERACTIVE_QUESTS_2026-10-22.md` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `docs/research/FAN_INTERACTIVE_TWINE_INK_VN_2026-10-22.md` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `docs/research/PROTOLIKE_UI_REFERENCES_2026-10-24.md` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `docs/research/SAGA_OF_GU_SCOUT_2026-10-24.md` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `docs/research/SOURCE_DEEP_DIVE_QUEUE_2026-10-24.md` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `docs/research/qud-systems-audit-2026-10-15` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `docs/reviews/OVERARCHING_RECONCILIATION_2026-10-23.md` | 1 | finished and unverified (review evidence only): Review author / named feature owner | `review file itself and referenced owner checkpoint`. Review findings are not acceptance or ownership transfer. |
| `docs/reviews/PLAYTEST_SWEEP_2026-10-25.md` | 1 | finished and unverified (review evidence only): Review author / named feature owner | `review file itself and referenced owner checkpoint`. Review findings are not acceptance or ownership transfer. |
| `docs/reviews/TEST_SUITE_LEANNESS_AUDIT_2026-10-25.md` | 1 | finished and unverified (review evidence only): Review author / named feature owner | `review file itself and referenced owner checkpoint`. Review findings are not acceptance or ownership transfer. |
| `docs/reviews/UNCOMMITTED_RUNTIME_REVIEW_2026-10-25.md` | 1 | finished and unverified (review evidence only): Review author / named feature owner | `review file itself and referenced owner checkpoint`. Review findings are not acceptance or ownership transfer. |
| `private_tmp_dummy` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `src_chain_inspector.js` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `src_chain_inspector_ui.js` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `src_display.js` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `src_reveal_chain.js` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `styles/material_icons.css` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `tests_chain_inspector.test.js.patch` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |
| `tests_micro_p1_xp.test.js` | 1 | unknown: Shared or path-specific owner not established from checkpoint index | `PROJECT.md / RULES_INDEX.md and a named owner receipt if found`. Path/status alone does not establish ownership or completion. |

## Runtime ownership detail

- **Explicit cultivation owner:** 16 runtime paths are directly named in the active cultivation checkpoint; each is marked `in progress / owned` in the JSON. Do not separate or stage them while that run remains active.
- **Cultivation-family candidates:** 59 paths are marked as likely cultivation by their feature family and checkpoint sequence. That is an owner lead, not proof of exact reservation; confirm the checkpoint’s current write reservation before assigning a commit.
- **Unresolved runtime:** 109 paths remain explicitly `unknown`; each has the latest tracked commit receipt when present. Paths include overlapping crafting, home, life, combat, host and UI modules, so the broad dirty surface cannot be attributed from a single old report.
- **MCP lane:** 4 `scripts/mcp/` paths remain in lane reconciliation. Compare B1/C2 branch/path hashes and return status before calling these integrated.
- **Generated output:** `dist/bundle.js` and `dist/bundle.js.map` have multiple historical bundle receipts. Their captured bytes are shared and do not identify a single current source owner.

## Documentation-only commit proposals

These exact Markdown paths are final checkpoint/report/queue receipts present in the captured snapshot. The list excludes briefs, superseded-status files, private directories, fixture/evidence directories and save payloads. They are candidates for own-path documentation commits after a fresh diff and ownership check; no staging occurred. Shared PROJECT/USER_VISION/RULES_INDEX hunks are excluded and need the zero-loss check.

### `complementary-journeys-2026-10-23` (3 paths)

```text
docs/gm/dispatch/complementary-journeys-2026-10-23/CHECKPOINT.md
docs/gm/dispatch/complementary-journeys-2026-10-23/O4_REPORT.md
docs/gm/dispatch/complementary-journeys-2026-10-23/O5_REPORT.md
```

### `features-o1-o5-2026-10-23` (2 paths)

```text
docs/gm/dispatch/features-o1-o5-2026-10-23/QUEUE.md
docs/gm/dispatch/features-o1-o5-2026-10-23/RESULT.md
```

### `high-tier-power-2026-10-23` (1 paths)

```text
docs/gm/dispatch/high-tier-power-2026-10-23/CHECKPOINT.md
```

### `household-fortunes-wiring-2026-10-23` (1 paths)

```text
docs/gm/dispatch/household-fortunes-wiring-2026-10-23/CHECKPOINT.md
```

### `itch-wiring-2026-10-23` (1 paths)

```text
docs/gm/dispatch/itch-wiring-2026-10-23/lives-carry-wiring.md
```

### `lotm-q1-2026-10-23` (1 paths)

```text
docs/gm/dispatch/lotm-q1-2026-10-23/CHECKPOINT.md
```

### `lotm-q2-2026-10-23` (1 paths)

```text
docs/gm/dispatch/lotm-q2-2026-10-23/CHECKPOINT.md
```

### `overarching-reconciliation-2026-10-23` (4 paths)

```text
docs/gm/dispatch/overarching-reconciliation-2026-10-23/CHECKPOINT.md
docs/gm/dispatch/overarching-reconciliation-2026-10-23/R2_REPORT.md
docs/gm/dispatch/overarching-reconciliation-2026-10-23/R3_REPORT.md
docs/gm/dispatch/overarching-reconciliation-2026-10-23/R45_REPORT.md
```

## Active exclusions and remaining gates

- Cultivation absorption remains active and owns its named files. Keep its code, tests, evidence and checkpoint out of any independent commit proposal.
- You Are Summoned remains with its active reader. Queue/card status does not authorize C5 to edit or close that owner’s work; no secret truths are reproduced here.
- C1–C4 worktrees remain lane-owned until each returns. Primary MCP copies need exact branch/path reconciliation first.
- Runtime commits need exact reservation release and frozen-input reconciliation, focused owning tests, build, architecture/rules checks and rebuilt browser proof for gameplay claims. Full `npm test` is the committer’s single gate.

## Scope

Primary checkout dirty/untracked paths only. The checkpoint index (26 at its final cutoff) is [C5_CHECKPOINT_INVENTORY.md](C5_CHECKPOINT_INVENTORY.md); worktree/branch/process census and final merge/retirement plan remain in the parent reconciliation. No source owner files or Git history were changed.
