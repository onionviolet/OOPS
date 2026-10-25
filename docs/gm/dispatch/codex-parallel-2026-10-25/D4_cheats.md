Lane D4: implement the remaining cheats (2026-10-25). Follow docs/gm/dispatch/codex-parallel-2026-10-25/COMMON.md and COMMON_W4.md in the primary checkout (/Users/weiwei/code/yet-another-idle-rpg). Port 5104.

Worktree: ~/.codex/worktrees/cheats/yet-another-idle-rpg, branch codex/cheats-2026-10-25 from current master.

Owners: docs/CHEAT_LIBRARY.md (including the round "More to consider: cheat implementations, carry, wiring and the next cards, 2026-10-23", IM1-IM20), docs/audits/CHEAT_CORE_AUDIT.md, docs/CHEATS_BY_WORLD.md, docs/CHEAT_COSMOLOGY.md, docs/SIMULATORS_AND_CHEAT_IMPLEMENTATION.md, docs/gm/dispatch/cheat-implementation-2026-10-23/, and docs/PROGRESSION_GATE_RULES.md (GTL/GTR). Direction: things work by how they work (AD38); limits are adjectives (AD22).

Scope: build an inventory of every cheat or cheat card with its current state (built / partial / proposal) and the existing engine owner it should use. Then implement the unbuilt cheats in priority order on the existing engine: the base cheat, modules, UI wiring and carry. No permission lists; model the mechanisms and their costs. Carry and continuation integration should go through the existing continuation owners; the cultivation run is editing continuation_* files in the primary checkout, so record any overlap in your checkpoint (M4). Use up to 4 subagents for per-card source reading and test drafting; you own the code. Each cheat gets a regression and appears in the UI; run a headless browser check of at least the top five. Commit in small slices.

Checkpoint: docs/gm/dispatch/cheats-2026-10-25/CHECKPOINT.md (inventory table, what you built, one line per check). Update CHEAT_LIBRARY's statuses in your branch only.
