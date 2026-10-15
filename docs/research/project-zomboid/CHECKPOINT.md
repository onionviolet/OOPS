# fs-zomboid checkpoint

Status: PARTIAL

The five assigned feature questions are answered from installed source. Remaining gaps are explicitly bounded below. This is a finished source scout with partial wider aspects, not a gameplay verification pass.

## Done

A1: Read FEATURES, COMMON, ASPECTS in order, then PROJECT top 80, relevant vision, P01/P03/P04 and chain round 5. Main checkout has extensive unrelated changes, preserved. No agents spawned and no paths outside the dossier written in the repo.

A2: Install finished: Steam 108600 StateFlags 4, SizeOnDisk 10529753899, build 25485521, zero staging size and matching download/stage totals. Installed Core bytecode identifies 42.21. Never launched game or touched saves/Steam configuration.

A3: Read learning, craft admission/UI, body field readers, action lifecycle, hide/tanning/drying, smithing and pottery slices. Decompiled 17 selected class inputs with CFR 0.152 where Lua could not establish core XP, knowledge, environmental timing or persistence. Saved 3685 raw files and 969 complete recipe blocks privately; hashes retained.

A4: REPORT Feature answers, seven ranked proposals, seven FINDINGS entries, IMPLEMENTATION_PACKETS, 24 SMALL_TOUCHES, TOOLING and three system digests are saved. All twelve aspect keys and complete discovered-directory/Java-package inventory exist; three deeper slices cover practical research, fluid transfer and seasonal foraging. Findings are source-qualified, proposals unaccepted.

A5: Validation checks JSON parsing/schema keys, artifact presence, local Markdown links, private ignore behavior and archived source hashes. Validation receipt is `VALIDATION.json`.

## Resume / unread table

| Code | Unread / untested | Why and next evidence needed |
|---|---|---|
| G1 | Actual game UI, clock timing, real crafting and Save/reload | Lane expressly forbids launching game. Runtime remains untested; no UI behavior/human acceptance claims. A separately authorized runtime pass would be required. |
| G2 | Multiplayer XP transport and rejected-action reason propagation | Single-player `addXp` path read; server branch calls GameServer.addXp. Decompile that transport only for a multiplayer-specific question. |
| G3 | Every craft cancellation/refund and failed output-publication path | CraftLogic stop/cancel hooks and saved input flags read, but no claim of universal lossless interruption. Trace scheduler/resource mutations for a named edge case. |
| G4 | Global save format/storage, autosave cadence, all migrations, corruption recovery and offline time | Selected actor, XP, pending recipe and drying fields read. Whole-save recovery is broader than this feature scout; no private saves accessed. |
| G5 | A01 NPC branching, relationships and portraits; A02 full narrative schedules | Recorded-media structure, effect predicates and print-media read path inspected. No conversation graph established. Native NPC/content paths need a separate targeted read. |
| G6 | A05 autonomous AI; A08 complete balance/RNG; A10 full tutorial | Source/class directories inventoried, only relevant slices read. A01..A12 status is exact in ASPECTS.json. |
| G7 | Human genetics/full physiology, all worldgen/vehicles/agriculture/economy systems | Beyond named field-reader slice; do not infer these from animal breeds or file counts. Inventory marks undocumented areas. |
| G8 | Which duplicate bloom recipe is actually reachable, and all table rows' menu availability | Two recipe IDs have differing fuel values; preserve both, do not silently choose. Load/menu validation requires a bounded further source trace or authorized runtime. |

Next pending item: none required for the delivered source scout. If coordinator wants more, select one gap and resume from TOOLING.md and the private source index, without recollecting the install. Existing P01/P03/P04 and chain owners retain authority. No source implementation or native YAIRPG gate completed.

Disk used at completion: about 46 MiB in `~/.codex/research/fs-zomboid/`; about 1 MiB in dossier including ignored private JSON. Public output is analysis and short identifiers only. No git add/commit/push.
