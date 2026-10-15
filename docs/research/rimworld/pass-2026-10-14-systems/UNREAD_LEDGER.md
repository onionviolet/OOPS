# Prior unread-row reconciliation

This retains every unread/open table row from all prior RimWorld checkpoints, including duplicate restatements, with provenance. Root 2026-10-06 has a prose remainder rather than a table: most methods, DLC definitions, full health/combat/pathfinding/quality/other incidents and runtime/YAIRPG acceptance were unreviewed. S01-S15 reduce named slices only. No broad row is silently closed. The grouped inventory also retains all named-only families.

Closed bounded subquestions in this pass: capacity modifier order (S01), treatment/immunity clocks (S02), substance channels (S03), relationship mutations (S04), exposure/recovery counters (S05), training/command state (S06), permits/focus/casting (S07/S08), stock/pricing (S09), forage/needs (S10), diplomatic thresholds (S11), growth/yield (S12), power reserve/flow (S13), inheritance/sequence semantics (S14), Slate/node generation (S15). “Closed” here means the cited static subquestion, never the entire source family or native behavior.

| Prior checkpoint:line | Prior gap (retained) | Current disposition | Evidence / next route |
|---|---|---|---|
| `docs/research/rimworld/aspects-2026-10-14/CHECKPOINT.md:20` | Native RimWorld desktop UI, sound, accessibility, actual save/reload and performance | OPEN unrun/outside research scope | Carry into current CHECKPOINT unread table |
| `docs/research/rimworld/aspects-2026-10-14/CHECKPOINT.md:21` | Individual BackCompatibilityConverter bodies and all corrupt-save cases | PRIOR source framework; converters/runtime OPEN | prior bf D3 |
| `docs/research/rimworld/aspects-2026-10-14/CHECKPOINT.md:22` | All quest scripts, reward parts and complete dialogue builders/portrait routes | REDUCED framework; full content OPEN | S06, S09-S11, S15, prior bf D1/D2 |
| `docs/research/rimworld/aspects-2026-10-14/CHECKPOINT.md:23` | Full prior five-path reconfirmation on 1.7 | OPEN residual | Carry into current CHECKPOINT unread table |
| `docs/research/rimworld/aspects-2026-10-14/CHECKPOINT.md:24` | Full AI/group lords, pathfinding, factions and world economy | REDUCED selected source routes | S06, S09-S11 |
| `docs/research/rimworld/aspects-2026-10-14/CHECKPOINT.md:25` | Effective DLC/mod activation, patched inheritance and validation | REDUCED static semantics; effective activation UNRUN | S14 |
| `docs/research/rimworld/aspects-2026-10-14/CHECKPOINT.md:26` | Full DLC consumers: titles/psycasts, genes/inheritance, ideology/rituals, containment, space/gravships | OPEN residual | Carry into current CHECKPOINT unread table |
| `docs/research/rimworld/aspects-2026-10-14/CHECKPOINT.md:27` | Full combat/body/medical, world generation, balance and global RNG persistence | REDUCED selected source routes | S01-S03, S07-S08 |
| `docs/research/rimworld/aspects-2026-10-14/CHECKPOINT.md:28` | Whole-game offline catch-up and every clock | OPEN residual | Carry into current CHECKPOINT unread table |
| `docs/research/rimworld/aspects-2026-10-14/CHECKPOINT.md:29` | Recovered-code compilation | OPEN unrun/outside research scope | Carry into current CHECKPOINT unread table |
| `docs/research/rimworld/aspects-2026-10-14/CHECKPOINT.md:30` | YAIRPG integration/build/browser/persistence/import/director acceptance | OPEN unrun/outside research scope | Carry into current CHECKPOINT unread table |
| `docs/research/rimworld/aspects-2026-10-14/CHECKPOINT.md:31` | Numeric Steam build-ID change from prior intake | OPEN residual | Carry into current CHECKPOINT unread table |
| `docs/research/rimworld/feature-pass-2026-10-14/CHECKPOINT.md:18` | Full native RimWorld behavior and desktop UI | OPEN unrun/outside research scope | Carry into current CHECKPOINT unread table |
| `docs/research/rimworld/feature-pass-2026-10-14/CHECKPOINT.md:19` | Full prior five-path reconfirmation | OPEN residual | Carry into current CHECKPOINT unread table |
| `docs/research/rimworld/feature-pass-2026-10-14/CHECKPOINT.md:20` | Dialogue/quest grammar and closure (A01/A02 remainder) | REDUCED framework; full content OPEN | S15, prior bf D1/D2 |
| `docs/research/rimworld/feature-pass-2026-10-14/CHECKPOINT.md:21` | Save migrations, autosave and corruption recovery (A04 remainder) | PRIOR source framework; converters/runtime OPEN | prior bf D3 |
| `docs/research/rimworld/feature-pass-2026-10-14/CHECKPOINT.md:22` | Effective XML inheritance/patch/load-order behavior (A07 remainder) | REDUCED static semantics; effective activation UNRUN | S14 |
| `docs/research/rimworld/feature-pass-2026-10-14/CHECKPOINT.md:23` | Full AI/pathfinding, combat, balance, tutorials and clock queues (A05/A06/A08-A11 remainder) | REDUCED selected source routes | S01-S03, S07-S08, S06, S09-S11 |
| `docs/research/rimworld/feature-pass-2026-10-14/CHECKPOINT.md:24` | DLC breadth and gene inheritance/conflicts (A12/BD remainder) | REDUCED selected source routes | S01-S03, S07-S08 |
| `docs/research/rimworld/feature-pass-2026-10-14/CHECKPOINT.md:25` | Suggested repo-private location | CLOSED storage routing within authorized work root | TOOLING.md private store |
| `docs/research/rimworld/feature-pass-2026-10-14/CHECKPOINT.md:26` | YAIRPG proposals | OPEN unrun/outside research scope | Carry into current CHECKPOINT unread table |
| `docs/research/rimworld/feature-pass-2026-10-14/aspects-2026-10-14/CHECKPOINT.md:18` | Full native RimWorld behavior and desktop UI | OPEN unrun/outside research scope | Carry into current CHECKPOINT unread table |
| `docs/research/rimworld/feature-pass-2026-10-14/aspects-2026-10-14/CHECKPOINT.md:19` | Full prior five-path reconfirmation | OPEN residual | Carry into current CHECKPOINT unread table |
| `docs/research/rimworld/feature-pass-2026-10-14/aspects-2026-10-14/CHECKPOINT.md:20` | Dialogue/quest grammar and closure (A01/A02 remainder) | REDUCED framework; full content OPEN | S15, prior bf D1/D2 |
| `docs/research/rimworld/feature-pass-2026-10-14/aspects-2026-10-14/CHECKPOINT.md:21` | Save migrations, autosave and corruption recovery (A04 remainder) | PRIOR source framework; converters/runtime OPEN | prior bf D3 |
| `docs/research/rimworld/feature-pass-2026-10-14/aspects-2026-10-14/CHECKPOINT.md:22` | Effective XML inheritance/patch/load-order behavior (A07 remainder) | REDUCED static semantics; effective activation UNRUN | S14 |
| `docs/research/rimworld/feature-pass-2026-10-14/aspects-2026-10-14/CHECKPOINT.md:23` | Full AI/pathfinding, combat, balance, tutorials and clock queues (A05/A06/A08-A11 remainder) | REDUCED selected source routes | S01-S03, S07-S08, S06, S09-S11 |
| `docs/research/rimworld/feature-pass-2026-10-14/aspects-2026-10-14/CHECKPOINT.md:24` | DLC breadth and gene inheritance/conflicts (A12/BD remainder) | REDUCED selected source routes | S01-S03, S07-S08 |
| `docs/research/rimworld/feature-pass-2026-10-14/aspects-2026-10-14/CHECKPOINT.md:25` | Suggested repo-private location | CLOSED storage routing within authorized work root | TOOLING.md private store |
| `docs/research/rimworld/feature-pass-2026-10-14/aspects-2026-10-14/CHECKPOINT.md:26` | YAIRPG proposals | OPEN unrun/outside research scope | Carry into current CHECKPOINT unread table |
| `docs/research/rimworld/pass-2026-10-14-deep/CHECKPOINT.md:18` | U1 / Native Odyssey movement, active maps, UI, vacuum and actual save/reload | OPEN unrun/outside research scope | Carry into current CHECKPOINT unread table |
| `docs/research/rimworld/pass-2026-10-14-deep/CHECKPOINT.md:19` | U2 / Complete transfer recovery, anchor acquisition, landing failure and all reconnect/cache edges | REDUCED framework; full content OPEN | S15, prior bf D1/D2 |
| `docs/research/rimworld/pass-2026-10-14-deep/CHECKPOINT.md:20` | U3 / Every gene worker, extraction/assembly/implant UI, birth failure callers and full heredity edge cases | OPEN residual | Carry into current CHECKPOINT unread table |
| `docs/research/rimworld/pass-2026-10-14-deep/CHECKPOINT.md:21` | U4 / Full learning activity XP, teacher scheduler, all childhood timeout/generated-child paths | OPEN residual | Carry into current CHECKPOINT unread table |
| `docs/research/rimworld/pass-2026-10-14-deep/CHECKPOINT.md:22` | U5 / Every meme/precept/role/conversion consumer and ritual outcome/obligation body | OPEN residual | Carry into current CHECKPOINT unread table |
| `docs/research/rimworld/pass-2026-10-14-deep/CHECKPOINT.md:23` | U6 / Every Anomaly entity special case, all containment building aggregation and escape AI | OPEN residual | Carry into current CHECKPOINT unread table |
| `docs/research/rimworld/pass-2026-10-14-deep/CHECKPOINT.md:24` | U7 / Every bill/product counter, generated recipe resolution, butchery/smelt entity recovery body and all chain consumers | OPEN residual | Carry into current CHECKPOINT unread table |
| `docs/research/rimworld/pass-2026-10-14-deep/CHECKPOINT.md:25` | U8 / Every storyteller component/incident/quest body, adaptation losses/death policies and cache behavior across targets | REDUCED framework; full content OPEN | S15, prior bf D1/D2 |
| `docs/research/rimworld/pass-2026-10-14-deep/CHECKPOINT.md:26` | U9 / Effective DLC/mod activation, patched inheritance, generated defs and validation | REDUCED static semantics; effective activation UNRUN | S14 |
| `docs/research/rimworld/pass-2026-10-14-deep/CHECKPOINT.md:27` | U10 / Royalty, broad combat/medicine/economy/faction/pathfinding/world-generation and all rendering/accessibility | REDUCED selected source routes | S01-S03, S07-S08, S06, S09-S11 |
| `docs/research/rimworld/pass-2026-10-14-deep/CHECKPOINT.md:28` | U11 / Recovered-code compilation, whole-game clocks/offline behavior and corruption recovery | OPEN unrun/outside research scope | prior bf D3 |
| `docs/research/rimworld/pass-2026-10-14-deep/CHECKPOINT.md:29` | U12 / YAIRPG implementation, rebuilt desktop journey, durable save/reload/literal import and director acceptance | OPEN unrun/outside research scope | Carry into current CHECKPOINT unread table |
