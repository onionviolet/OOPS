# Parallel runs outcome check, 2026-10-26

Question: how much of the parallel work leading up to the "what's still unfinished" chat actually succeeded? Read-only review of Codex session logs (`~/.codex/sessions/2026/10/26`, cwd this repo) and each lane's own record. No gameplay or tests rerun. Every "verified" below is agent-verified, not human-reviewed (AD42).

## What ran

On 2026-10-26, 24 chats were started directly and 61 more were created by coordinator chats. Most of the parallel work came from one prompt ("send chats to implement each little detail", 17:27), which fanned out to six pc-group coordinators and about 30 lane chats, plus the Minecraft/cultivation L1–L8 wave (15:00) and the carry-out queue Q1–Q18 (07:07).

All of it reached master. The [master reconciliation](../gm/dispatch/master-reconciliation-2026-10-26/CHECKPOINT.md) committed every lane's source, tests and text evidence, passed the full suite and combined desktop browser/persistence journeys, then was pushed and adopted in the normal app. Being in master means it builds and passes tests together. It does not mean every lane finished its feature.

## Outcome by group

| Group | Outcome | Left open |
| --- | --- | --- |
| Minecraft/cultivation L1–L8 | **Mostly delivered.** L1 planner/person view, L2 applied-use mastery, L3 foundations/method slice, L4 LOTM brewing/acting/power-to-work/artifact handling, L5 two alchemy slices, L6 supplied workshop, L7 Gu companion and trial loops (S1–S3), L8 three feedback fixes. | L4 A5 staged rite (done later 2026-10-26, see priorities). L2 P3/P5 and L5 reference gaps (source evidence missing). L1 cross-world bond transfer. |
| G1 connected making | **One full journey.** HP supplier → paid preparation → settle → assay → cauldron treatment → stored remainder → repeat, with save/import. | Named-method quote/commit parity, quantity forecast, Frontier and LOTM joins (I1 never released). |
| G2 ingredient substitution | **Delivered.** HP abrasive preparation joined to carried inventory, paid preparation, demonstrated methods and useful treatment; 15 connected browser checks. | Full suite hit four missing-capture errors in its own run, cleared by 14/14 targeted reruns; later master suite passed. |
| G3 process actions | **Not delivered as gameplay.** Agitation, thermal, separation and cue leaves were written and unit-tested only. Integration checkpointed before wiring. | Everything player-facing: wiring, real costs, UI, product use, persistence. |
| G4 cross-craft connections | **Not started at runtime.** C1–C4 wrote contracts and waited on each other and on G3. | All of it. Blocked on G3. |
| G5 material foundations | **Delivered as foundations.** Native IDs, cohorts, units, quality/kit preparation and the inspector, used by G1/G2's journeys. | M1 and M3 own pieces stayed below floor on their own; they are proven only through G1/G2. |
| G6 weather/environment | **Bounded journey delivered.** Water, drying, supply and an original apparatus, with 15 persistence checkpoints. | General outdoor rain/fog, rain collection, soil/drainage, seasonal ecology. |
| G7 lore and idea sources | **Delivered.** One browser journey across L1 accounts/trials, L2 preparations/assembly and L3 trace/institution. | None named beyond its own scope. |
| Other-systems depth (body, exploration, learning) | **Body: delivered** (support loss during recovery). **Exploration and learning: found the "missing" features already existed** and verified them instead of rebuilding. | HP and Primordial need new site content. |
| Broader UI follow-through | **Delivered** item-panel repairs at desktop sizes. | Some families unexamined (service stock, late institutions). |
| UI character direction | **Report only.** Its tested build went stale when crafting edits landed after it. | Recheck on a fresh build before acting on it. |
| Carry-out queue Q1–Q18 | **Tooling delivered.** Lane builds, receipt lint, doc lint, description lint, generator census, cycle ledger, ideas triage. | Q18 exclusions, Q11 classification, Q14 sync speedup. Q10/Q11/Q12/Q15 left no commits. |
| Books and sources | **Delivered.** All 33 main volumes of the series pursued that day were fetched, hash-checked and indexed. A discovery list was saved with nothing downloaded from it. | Discovery list delivery unverified. |

## Read

- **10 of 13 groups delivered working results; the UI character report was advice by design.** The two that missed (G3, G4) missed for one reason: G4 depended on G3, and G3 ran out of its allowance before wiring its leaves into the game. That is a sequencing problem, not broken code.
- **Exploration and learning were not wasted.** They disproved a gap instead of building a duplicate, which the rules ask for.
- **Lane records lag their own results.** L4 and L7 headers still said "unfinished" or "not yet verified" after their bodies recorded verified slices. Both headers corrected today. Other headers may have the same lag; trust the latest dated section over the first line.
- **"Combined integration remains L8-owned" lines are superseded** by the master reconciliation, which joined and tested everything. What the reconciliation did not do is rerun each lane's own native journey on the joined code; it ran its own combined journeys instead.

## Next if you want the unfinished half closed

1. LOTM A5 staged rite: done 2026-10-26, see [priorities](UNFINISHED_GAME_PRIORITIES_2026-10-26.md).
2. G3 integration: wire one process leaf (agitation is smallest) into one real book-world consumer. This unblocks G4.
3. G1 I1: named-method quote/commit parity and the quantity forecast.
