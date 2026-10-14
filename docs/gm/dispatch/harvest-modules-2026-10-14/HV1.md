# HV1: wolf-rat carcass processing (code)

Read COMMON.md and PLAN.md in `/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/harvest-modules-2026-10-14/` first. Worktree `.claude/worktrees/hv1-carcass`, branch `proc/hv1-carcass`, port 22430. Lane folder `docs/gm/dispatch/harvest-modules-2026-10-14/hv1/` inside the worktree.

Goal: killing a wolf rat (and its family in `src/enemies.js`) leaves a carcass the player can process whole, strip for one part, or leave to auto-process, giving parts with completeness and quality grades that depend on the kill and the handling, and feeding Butchering. Covers PLAN HM1-HM8 and HM11 (developer inspector only).

Stages (commit each, keep CHECKPOINT current):
1. **Audit and decisions.** Trace kill → loot → inventory → recipes. Decide HM4 (which drops the carcass replaces) and HM6 (how a graded material is keyed and consumed). Write both to REPORT before code.
2. **Pure module.** Species part templates (pelt, tail, fang, meat or similar from existing items), specimen draw from the loot stream keyed by kill, grade formulas (completeness from overkill, hits, damage type, crit; quality from skill, tool, freshness), plan/preview without draws, process-whole versus take-one costs. Unit tests, including same-seed replay.
3. **Native hooks.** Kill creates or adds to a per-species carcass lot with cap and freshness; actions to process whole or take one part as timed activities; auto-process setting; Butchering XP; graded parts in inventory; recipes accept graded parts and pass quality on. Unsupported creatures unchanged.
4. **Persistence.** Optional saved owner with schema and revision; old saves load unchanged; caps hold under a long auto-fight; validators on load and import.
5. **Proof.** Natural browser run at 1366x768 and 1600x1000: fight rats, see carcasses, take only a tail, process one whole, compare grades from a clean versus messy kill, use a pelt in a butchering recipe, Save/reload, Export and literal Import. Headless run of many kills for cap and replay.

Done when: tests and build pass; REPORT shows the part table, grade formula and compatibility decisions in plain English so Weibao can judge balance; BACKLOG lists anything unexercised.
