# Topic expansion audit playbook

Saved 2026-10-14. The repeatable method behind Weibao's recurring request
shape: "more to consider? other stuff and more? save and extend accordingly,
send out codex as useful", with follow-up axes such as subtle and micro
details, cheats that would show it, overarching principles, implementation
implications, abstraction, crafting, research, comic and other world types,
and merging. First full instance: [companions core audit](COMPANIONS_CORE_AUDIT.md).
Other topics run the same way (UI at scale, weaponcraft and runes, world core
kit, procedural story); each can get its own `<TOPIC>_CORE_AUDIT.md` here.

Related methods: [source deep dive](../research/SOURCE_DEEP_DIVE_PLAYBOOK.md)
for one book or wiki; this playbook is for one design topic across all worlds.

## Shape of a run

1. **Root palette.** One `docs/<TOPIC>_CONSIDERATIONS_<date>.md` owned by the
   root agent. Rounds are appended, never rewritten; each round gets fresh
   section codes. Add a topic map once it passes about six rounds.
2. **Find owners first.** Search `docs/` for the topic before writing. Link
   sibling owners; do not restate them. If a lane later finds an owner you
   missed, say so plainly in the palette.
3. **Lanes.** Each Codex lane gets `COMMON.md` (rules) plus its own prompt,
   exactly two owned output files (output and report), a CHECKPOINT at the
   top, and evidence labels SHOWN / STATED / INFERRED / MEMORY. Launch
   detached with `runs/launch.py` (setsid double fork) and log session ids.
4. **Lane menu.** Pick what fits; these worked for companions:
   by-world source check; engine fit (code seams, cheapest steps);
   references (games and books); journeys plus stress test; procgen; owner
   map; craft study in books; idle and prestige; real-world grounding (e.g.
   ethology); presentation and line budget; per-world defaults for tensions;
   reveal cheats; implementation implications; comics; crafting and
   research; overarching abstraction.
5. **Rounds while lanes run.** Each round answers the axes Weibao asked, with
   new angles only. Fold lane returns as they land, corrections first.
6. **Record** every round in USER_VISION and keep one IDEA_INDEX entry.
7. **Commit** with [commit_own_paragraphs.py](tools/commit_own_paragraphs.py)
   so only this run's files and paragraphs land while other sessions edit
   the same shared docs. Push and merge only on explicit yes.
8. **Save the audit** as `<TOPIC>_CORE_AUDIT.md` with triggers, lane table and
   a run log, so the next run starts from it.

## Standing rules every round

Default + Dial + Reasonably; no absolutes; no either/or questions to Weibao;
no fixed "once" limits; sealed secrets by ID only; desktop first, mobile
deferred; proposals are not accepted decisions; no em dashes.

## Lessons from the first run

- Lanes find existing owners and existing code the root missed (Rill, the
  nonhuman bonds doc). Run an owner-map lane early.
- MEMORY world rows need a source lane; about a quarter needed correction.
- A stress-test lane (journeys) finds contradictions the palette hides.
- zsh does not word-split `$VAR` file lists; build file lists in Python.
- Other sessions append to USER_VISION and IDEA_INDEX constantly; never
  `git add` those whole files for a topic commit.
