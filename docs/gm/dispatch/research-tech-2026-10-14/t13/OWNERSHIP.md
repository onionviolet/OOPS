# T13 ownership and conflict snapshot

2026-10-14, initial detailed recovery 01:12 EDT. R10 is a read-only snapshot,
**not a write reservation or transfer**. T13 session
`01a138d0-cc0f-7d31-a1b5-66da665d6447` writes only this `t13/` directory under
[COMMON](../COMMON.md). Root owns shared-doc synthesis and commits. Exact future
source writers must be named by the live integrator before implementation.

## R10. Owners recovered from live surfaces

Only two root `docs/gm/dispatch/*/STATUS.md` files existed in the inventory:
procgen and wiki-lanes. Other ownership comes from checkpoints, prompts and run
session tables. Absence of STATUS is not release. Process inspection confirmed
concurrent Claude/Codex activity; it did not resolve every process to a file owner.

| Owner / authority locator | Observed state and worktree | Overlap or conflict |
|---|---|---|
| R10a Foundation R15 integration, `docs/gm/dispatch/foundation-adoption-next-2026-10-13/CHECKPOINT.md:55` | G4/G9/G10/CH1 integrated; root remains active watching W1. `.claude/worktrees/r15-g9-world1`, `r15-g10-remaining` and old agent worktrees still present | Root host/main/save/expansion/workshop integrations remain coordinated. Completion of branch source work is not blanket release. No T13 runtime reservation |
| R10b World1 W1, same checkpoint `:47`, `:55` | Later user instruction lifted pause; session ended after C01/C02 with whole campaign incomplete. `.claude/worktrees/w1-campaign`, branch `w1-campaign`, tracked dirty 3 in inventory; root merge pending dirty authority docs | Shared host/adapters and private content remain separately owned. Earlier paused wording at `:11` is superseded; do not install private payloads or treat ended process as release |
| R10c Procgen P1-P4/root, `docs/gm/dispatch/procgen-2026-10-13/STATUS.md:49` | Integration DONE; P1-P4 combined on `proc/wave1-integration`, merged as `4e13f97f`; main dist not rebuilt there, not pushed. `.claude/worktrees/proc-p1-streams`, `proc-p2-mixing`, `proc-p3-storylets`, `proc-p4-people`, `proc-wave1-integration` present, tracked dirty 3 each | Stale upper rows say running; later integration line governs landed status. P1 owns streams/native RNG; P2 owns items/inventory/mixtures/crafting; P3 simulation content/decks; P4 generated people. Refresh exact follow-up reservations, not their old base copies |
| R10d P34 story spine, `docs/gm/dispatch/procgen-2026-10-13/STATUS.md:41`; `.claude/worktrees/proc-p34-spine/docs/gm/dispatch/procgen-2026-10-13/p34/CHECKPOINT.md` | Branch `proc/p34-story-spine`, tip observed `6b0f1f32`, tracked dirty 6; checkpoint advances through S-4, S-5/native proof pending | Main/save/simulation/deck/generated-people publication and loreHistory/known recap collide with evidence/events. P34 economic outcome owner is not duplicated by IM2; shared receipt pin protocol requires an explicit bridge |
| R10e Absorb-all coordinator/P00, `docs/gm/dispatch/absorb-all-2026-10-14/runs/SESSIONS.md:1`; `runs/p23-host-joins.prompt.md:8` | No root STATUS/CHECKPOINT. Coordinator integrates in `/Users/weiwei/code/yair-absorb-all-20261014/integration`; P00 pending after wave1. Many separate feature worktrees registered there | P00 explicitly reserves main/display/items/skills/activities/time/locations/dialogues/save/workspace/styles and host_joins. Potential future reservation already conflicts with every host step. Root must reconcile P00 versus R15/P34 actual IDs before assigning work |
| R10f Cheat stage0 R1, `docs/gm/dispatch/cheat-status-window-2026-10-13/runs/SESSIONS.md`; `runs/r1.prompt.md:9` | `.claude/worktrees/ui-cheats-r1`, branch `ui/cheats-r1`, tracked dirty 7; `.claude/worktrees/ui-cheats-ch1` retained detached/clean. Independent audits also running in own docs | R1 owns cheat_cards/status_window/save validator/minimal main hunks and status styles/tests. Step5 must build from its integrated delivery or explicit transfer; do not overwrite awakening/save hardening |
| R10g Research T6, `../SESSIONS.md:14`; `.claude/worktrees/rt-t6-planner/docs/gm/dispatch/research-tech-2026-10-14/t6/REPORT.md` | Branch `codex/invention-planner`, HEAD `144ed1a0`, tracked clean. Source/test prototype complete as reported; unmerged at read | Owns new invention_planner/demo data/test files. Later T16 assignment explicitly releases T6 files to T16 on its branch. Main still lacks invention_planner.js at the re-check. T13 has no source claim |
| R10g2 T16 planner QA, `../T16.md:3`; `.claude/worktrees/rt-t16-qa/docs/gm/dispatch/research-tech-2026-10-14/t9-build/CHECKPOINT.md` | Newly observed branch `codex/invention-planner-qa`, base 144ed1a0; root selected isolated code lane and released T6 files there. IN PROGRESS, pure QA/limits/lint/receipts, no native wiring | Owns planner modifications and T9 proposed QA/receipt/lint modules/tests/fixtures/scripts. Reuse its completed delivery, do not launch a duplicate pure QA writer. T13 research envelope nesting is a later host adapter proposal, not an instruction to T16 |
| R10h Research T1-T5/T7-T14, `../SESSIONS.md`, each lane checkpoint | Main docs-only, own lowercase directories; T2/T5/T7/T8/T9/T10/T11/T12 reports arrived during T13; all read. No source reservations from these lanes | T5 vocabulary, T7 world power rules, T8 world state, T9 QA, T10 cues, T11 signs, T12 expertise and T14 cards are design joins. Unfinished reports stay named, not assumed accepted or absent forever |
| R10i Derived snapshots/start-records, `docs/gm/dispatch/derived-snapshots-2026-10-14/GOAL.md:11` | Code lane in `/Users/weiwei/.codex/worktrees/start-records/yet-another-idle-rpg`, branch `codex/start-records`; no main start-records root checkpoint found | Endpoint/profile/branch/lifetime and save-shape proposals can affect future research IDs/retention. Research adds no offline time or automatic shared science; actual binding needs this owner |
| R10j Procgen P38/P39/P40, respective main `p38/CHECKPOINT.md`, `p39/CHECKPOINT.md`, `p40/CHECKPOINT.md` | In-progress docs/proposals, not source writers. P38 consolidates state; P39 registry/file conflicts; P40 determinism audit | Reserve research field/module naming with their integrator to avoid competing receipt/schema/registry designs. Their future plans do not automatically own current code |
| R10k Wiki/UI/nonhuman/engine docs, `wiki-lanes-2026-10-13/STATUS.md`, `ui-at-scale-2026-10-14/runs/SESSIONS.md`, nonhuman checkpoints, engine-runtime sessions | World source fixes and design/report lanes; engine/body/viewport proposals are not runtime schema allocations | These qualify world packs, body means and known views. Respect paused game-world queues and future reader contracts; no blanket permission to change canon or shared UI |

Re-check also found `rt-t16-qa`; T15 is a new docs-only comic lane in its own directory, with report absent at this boundary.

Other `.claude/worktrees/` inventory names were agent-a09658bcd5ecc072d,
agent-a31a7ac7607bfd391, agent-a69210d5dc7a62447, agent-a98ba83b128c9a0c3,
agent-ab32482a518df251b, agent-ad82f23d94f196fae, agent-aedda304f5f9605f0,
core-a2-tags, core-a3-travel-tests, core-a4-relationships, core-a5-determinism and
gen-g1-kit. Their presence alone is not live authority. `git worktree list` also
contains prunable historical paths; T13 did not prune or alter any worktree.

## R10l. File conflicts by build step

| Step | File areas from BUILD_ORDER | Current coordination dependency |
|---|---|---|
| R8a text | New texture/data names; crafting_detail/display/current-location readers/display_settings; optional style owner | New names provisionally unclaimed in inspected research source. Display/location/styles conflict with P00; known-detail/UI feature joins and current UI coordinator. No workspace redesign required |
| R8b evidence | New research state/view/host/panel/home-content; main/save_files/expansion_persistence/native rollback/notebook/feed | R15/P00/P34 share publication and host seams. T1 defines content fit only. Exact craft producer and prospective receipt bridge transfer required; P38/P39 coordinate name/contracts |
| R8c rider | Research modules/home content, main cooking hook and local workshop duration consumer | Same shared host owner; P2 native crafting/mixture paths and R15 workshop validators preserve frozen old terms. Record new revision, not overwrite an old job |
| R8d roadmap | T6 planner/data/tests; new registry/pack/compiler + T9 pure QA/lint/receipts/fixtures; research panel/host/state/main/save; panel_kit API | T16 is now that isolated pure QA writer; root merges its passing delivery before dependent integration. Shared integration with P00/R15/P34 and UI owner. No separate writer edits main while pure worker runs. Existing optional-pack loader owned by host integrator |
| R8e revealer | Card data/reveal, cheat_cards/status_window/main acquisition, research panel/host and tests/styles if needed | ui-cheats-r1 and its frozen gates; P00 shared UI/main save joins; T14 data proposals. Integrator decides whether current status-window semantics can host exact research capability without leaking stats |
| R8f world use | research_world/host, seeded_streams/simulation/time/world-instance/fact adapter, recipient/history/generated-people bridges | P1/P3/P4/P34/R15/P00 and derived-snapshot owners. Bind schedule/clock before code. Canon world pack files remain with qualified world owner |
| R8f provenance | research_provenance, items/inventory key loader/native stamp/custody/item views | P2 items/inventory/mixtures and P00 shared files; R15 measured specimen contracts. No equipment-wide identity rewrite, no past maker inference. Exact new specimen consumer and migration own a narrow area |

For every newly proposed module, first check whether an integration already created
it under another name. Planning names are not leases. Tests/fixtures belong with
the matching implementation writer; rebuilt dist/index output belongs only to
that wave's designated builder. Authoritative design owners PROJECT/USER_VISION/
TECHNOLOGY stay with root; T13 does not edit them.

## R10m. Future transfer procedure

Recover branch/head, dirty/index paths, workers and later checkpoint entries; name
actual writer/session and bounded file list with predecessor release. Root merges
finished gate-passing deliveries before launching a dependent integration wave,
per PROJECT's merge-before-dispatch direction. Preserve existing dirty state and
never infer release from a gone process or a clean worktree. New pure modules can
be authored in an isolated lane after selection; host joins remain one writer.
None of these future steps was executed by T13.
