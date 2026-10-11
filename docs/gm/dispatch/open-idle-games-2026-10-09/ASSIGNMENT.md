# Open-source idle games: Progress Knight, Idle Loops, Evolve

Dispatched 2026-10-09 by Claude Code at Weibao's request ("send codex to
absorb open accordingly").

Research only: no `src/`, builds, commits or saves in YAIR. Clone the
public repositories into `~/.codex/research/<game>/` (outside the YAIR git
tree), record the commit hash and **the license of each repository**, and
follow it. Disk is tight (about 10 GB free): shallow clones only. Outputs go
in `docs/research/open-idle-games-2026-10-09/`. Paraphrase; don't copy
their code or text into YAIR docs beyond short identifiers.

## Games

| Game | What to learn |
|---|---|
| Progress Knight | Jobs, skills, aging, death and rebirth with carried bonuses: the closest existing loop to the life sim |
| Idle Loops | Actions inside a time loop; what carries between loops; town progression |
| Evolve (idle) | Species and traits, resets, a large tech tree, many prestige layers, events |

Find the canonical repositories (original authors first; note forks that
became the maintained version).

## Lens

Use [LIFE_SIM_NORTH_STAR.md](../../../LIFE_SIM_NORTH_STAR.md), especially
long lives, aging that changes play, carryover between lives, rewind and
operation cards, routines and idle versus active (draft D2b), research as a
standard system, followers, and save size.

1. **The core loop** of each, as data and code: what ticks, what the player
   decides, how offline time works.
2. **Life and death:** aging, lifespan, death, rebirth or loop; exactly what
   carries over and what resets; how prestige layers stack.
3. **Pacing:** how each keeps a long game interesting; when new systems
   unlock; how it avoids or handles grind.
4. **Data design:** how jobs, skills, upgrades and events are defined (data
   tables versus code); how saves are stored, versioned and kept small.
5. **UI:** how a dense idle game stays readable in a browser; tooltips;
   progressive reveal.
6. **Twenty or more small touches,** each mapped to vanilla YAIR.

## Output

A short plain-language REPORT first; findings with file and commit
locators; a license table; five to ten ranked proposals for the north star
(proposals are not decisions); a CHECKPOINT.
