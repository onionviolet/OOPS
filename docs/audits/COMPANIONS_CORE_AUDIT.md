# Companions core audit (repeatable)

Saved 2026-10-14 at Weibao's request: "save as core audit to repeat in the
future too". This is a standing procedure for re-auditing companions,
familiars, pets, mounts, summons and every other being or thing that travels
with the player. It is one instance of the general
[topic expansion audit playbook](TOPIC_EXPANSION_AUDIT_PLAYBOOK.md).

Running it produces proposals. It never selects build scope, changes a
standing priority or turns deferred work into a gate (AGENTS.md).

## What it keeps current

| Owner | Role |
|---|---|
| [Companion palette](../COMPANIONS_FAMILIARS_AND_PETS_CONSIDERATIONS_2026-10-14.md) | Root list of considerations, rounds 1+ and lane returns; topic map in round 11 |
| [Companions by world](../worlds/COMPANIONS_BY_WORLD_2026-10-14.md) | Sourced per-world catalogue (lane C1) |
| [First run dispatch](../gm/dispatch/companions-2026-10-14/COMMON.md) | Lane prompts C1 to C16, outputs, reports, session ids |
| Sibling owners | Nonhuman docs (playing AS a companion), [bonds and parties](../worlds/NONHUMAN_BONDS_AND_PARTIES_2026-10-14.md), Paradise beings, part 20 and 29, procgen P11/P19, GN10. [Owner map](../gm/dispatch/companions-2026-10-14/OWNER_MAP.md) says who owns what |

## When to rerun

Rerun the whole audit, or only the affected lanes, when any of these happen:

| Trigger | Lanes to rerun |
|---|---|
| A world or book is added or deep-dived | C1 (by world), C14 if it is a comic, C7 if a novel with companions |
| Code changes to actors, party, relationships, needs, cargo, saves or clocks | C2 (engine fit), C8 (idle and prestige), C13 (implementation) |
| Cheat library or status window changes | C12 (reveal cheats) |
| Procgen people, species or streams change | C5 |
| UI surfaces, journal or people views change | C10 |
| Crafting, materials or knowledge records change | C15 |
| A companion slice is built | C2, C10, C13, then a fresh C4 stress test against what shipped |
| Sibling owner docs change | C6 (owner map), C11 (tension defaults), C16 (abstraction) |
| Nothing changed but a while has passed | C3 (references) and C9 (micro behaviour) for new sources |

## Procedure

1. **Recover state.** Read this file, the palette's topic map and lane
   returns, the latest dispatch's `runs/SESSIONS.md`, and the live owners
   above. Check running Codex processes before writing.
2. **Diff the world.** List what changed since the last run (log below):
   new world folders, new full-book sources, `git log` on `src/` areas named
   in the trigger table, new sibling docs. Pick lanes from the trigger table.
3. **Create a dated dispatch** `docs/gm/dispatch/companions-YYYY-MM-DD/`.
   Copy `COMMON.md` and `runs/launch.py` from the first run. Copy each chosen
   lane prompt (`C<n>.md`), then edit it: new date, "read the previous run's
   output first and report only what changed", and any new owners. Keep one
   writer per file.
4. **Launch** with the detached launcher (`python3 runs/launch.py C<n>
   C<n>.md`); record session ids in `runs/SESSIONS.md`.
5. **Ask the round questions** in the palette while lanes run. Each round,
   look for genuinely new angles along these axes (the ones Weibao asked on
   the first run): more to consider; other stuff; cheats that would show it;
   subtle and micro details; overarching principles; implementation
   implications; abstraction needed; relevant crafting; research; comic and
   other world types; merging. Write Default + Dial + Reasonably, no
   absolutes, no either/or questions, sealed secrets by ID only.
6. **Fold lane returns** into the palette as they land: a short "Lane return"
   section with what it found, corrections first, and links. Keep lane codes
   distinct (prefix with the lane, e.g. `C7:BB01`).
7. **Record** each round in [USER_VISION](../USER_VISION.md) (request quote,
   what was saved, lanes) and keep the [IDEA_INDEX](../IDEA_INDEX.md) entry
   current.
8. **Commit** only this audit's paths when authorized. Other sessions edit
   USER_VISION and IDEA_INDEX at the same time: commit through a temporary
   index with only your paragraphs (see the playbook), preserving the real
   index and other sessions' staged state. Push and merge only on Weibao's explicit yes; the branch
   usually carries other sessions' commits too.
9. **Log the run** below.

## Lane templates (first run prompts)

All in [companions-2026-10-14](../gm/dispatch/companions-2026-10-14/):

| Lane | Prompt | Output | Purpose |
|---|---|---|---|
| C1 | C1.md | worlds/COMPANIONS_BY_WORLD | Verify per-world rows, extend to all worlds and books |
| C2 | C2.md | ENGINE_FIT | Existing code seams, smallest fit, ranked cheap steps |
| C3 | C3.md | REFERENCES | Games and books with companion systems; new angles |
| C4 | C4.md | JOURNEYS | Whole-life journeys; stress-test the palette (JX rows) |
| C5 | C5.md | PROCGEN | Generated individuals, species, evolution, determinism |
| C6 | C6.md | OWNER_MAP | Which doc owns which topic; overlaps; gaps |
| C7 | C7.md | BOND_CRAFT | How books make bonds feel earned; beats and anti-patterns |
| C8 | C8.md | IDLE_AND_PRESTIGE | Resets, clocks, offline, idle economy |
| C9 | C9.md | MICRO_BEHAVIOUR | Real ethology as text cues |
| C10 | C10.md | PRESENTATION | UI surfaces, line budget, desktop layouts |
| C11 | C11.md | TENSION_DEFAULTS | Per-world defaults for tensions and gaps |
| C12 | C12.md | REVEAL_CHEATS | Cheats that show hidden companion state |
| C13 | C13.md | IMPLEMENTATION_IMPLICATIONS | State model, pipelines, saves, tests, build layers |
| C14 | C14.md | COMICS | Comic world companions and comic mechanics |
| C15 | C15.md | CRAFTING_AND_RESEARCH | Crafting for, of, with and from companions; in-world research |
| C16 | C16.md | ABSTRACTION | Overarching abstraction for bonds of every kind |

## Fold status

All sixteen first-run lanes are folded into the palette ("Lane returns"
sections). Next run starts from those sections and the trigger table.

## Quality checks before reporting

- Every lane wrote only its owned files; root palette edited only by root.
- Corrections from lanes are folded in and the old claim is marked, not
  silently replaced.
- MEMORY claims are either checked (CONFIRMED / CORRECTED) or still labelled.
- No em dashes; no absolutes; no either/or questions; no sealed truths.
- Playable claims need rebuilt browser evidence at current UI_RULES targets,
  including 1920×1080 primary and 1366×768 floor; historical evidence stays dated.
- Report: what changed, lanes run, what is still running, commit state.

## Run log

| Date | Scope | Lanes | Result | Commit |
|---|---|---|---|---|
| 2026-10-14 | First full run, palette rounds 1 to 11 | C1 to C16, all folded | Palette A to IC; H checked (8 confirmed, 3 corrected); Rill found as existing dog; stray-dog N1 to N5 ranked; 33 JX tensions; 59-source micro register; owner map; abstraction; C11 to C16 folded (corrections to GC3 cue saving, line-rate tension, narrower observation channels, build layers L00 to L07, CM1 to CM12) | 9a0c049b (rounds 1-11, C1-C10); be47d1dd (audit, C11-C13, C15-C16 files); fd176f27 (C14 files, by peer session); fold commit |
| 2026-10-18 | Core-rule reconciliation | none | Actual helper means, knowledge and clock; NPC-heavy work still deferred; unsafe reset instruction qualified | not committed |
## Core-rule reconciliation, 2026-10-18

Apply the [shared pass](TOPIC_EXPANSION_AUDIT_PLAYBOOK.md#core-rule-reconciliation-pass-2026-10-18)
to affected future rounds. Codes: AD6/AD11–AD13/AD16/AD33/AD38, AR3/AR7/AR8.

**Composed case:** A companion participates only through its actual location, body/faculty clock, stock and delegated policy. A paused world does not provide a free teacher/helper, and companion knowledge is not player knowledge.

**Current correction:** Companion palette reconciliation and the relevant rule owner now carry the
constraint. Current old-save compatibility is deferred; newly built state still
round-trips. Player-facing proof uses current UI_RULES targets. Proposals and
NPC/layout/mobile deferrals keep their status. This is a docs-only rule-fit pass,
not a rerun of source/game-reference lanes or evidence that gameplay works.

Later execution: strong cross-domain agent, medium only when that seam is
selected; reuse the affected existing suite and require a useful rebuilt journey
plus current-state persistence when changed. No lane is dispatched by this entry.
