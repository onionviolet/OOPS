# Engine extension study: one framework for every idea in the north star

Dispatched 2026-10-08 by Claude Code at Weibao's request: "check out how to
extend the engine in a way to bring in all of these possibilities and
more".

**Design study only.** Read code; do not edit `src/`, `dist/`, tests or
saves; do not build or commit. A separate implementation decision by
Weibao comes later. Output goes in `docs/gm/engine-extension-2026-10-08/`
(tracked docs, no copyrighted game or book text).

Read first: AGENTS.md, PROJECT.md, [LIFE_SIM_NORTH_STAR.md](../../../LIFE_SIM_NORTH_STAR.md)
(especially "Can the engine handle it?", "Build plan", "Every idea somewhere,
not everywhere", "Implementation considerations for many worlds", the
rewind/operation cards, cheat cards, followers and factions, research as a
standard system), [WORLD_CARDS.md](../../../WORLD_CARDS.md),
`docs/ENGINE_EXPANSION.md`, and the draft architecture in
[ENGINE_SKETCH.md](ENGINE_SKETCH.md) written by Claude Code the same day.
The working tree has about 140 uncommitted paths from other lanes; read them
as they are and change nothing.

## Questions

1. **Inventory what exists.** Map the live engine: save format and size
   handling (`src/main.js`, `src/save_files.js`), simulation clock and
   commands (`src/simulation*.js`), world instances, carry policy
   (`portableCarrierPolicy`), chronicle and life record, NPC lives and
   household, event feed, techniques, the 55 or so `*_host.js` modules and
   how they register. Which pieces already are the shapes the north star
   needs, and which are one-off code?
2. **Check the sketch.** For each component in ENGINE_SKETCH.md (rules
   lookup, content packs, cards, operation cards, research projects,
   people and factions, director, compaction), say whether the live code
   supports it, what is missing, and the smallest change that would add it.
   Correct the sketch where it is wrong.
3. **Data format.** Propose a concrete schema for world cards, place cards,
   cheat cards, operation (rewind, revival, regression) cards, faction
   cards, research projects and events, with one filled example each drawn
   from WORLD_CARDS.md. Say how they load (static JSON, JS modules, a
   private pack folder) and how a missing private pack degrades.
4. **Save growth.** How a life spanning many worlds stays within browser
   storage: compaction, compression, per-world deltas, IndexedDB versus
   localStorage, migration from the current schema.
5. **Performance.** Off-screen people and worlds: what can be ticked, what
   must be summarized, with numbers from the current `advanceSimulation`
   cap.
6. **Migration path.** How the existing `*_host.js` features move onto the
   framework without breaking saves or the vanilla opening, in small steps,
   each with a browser and save/reload/import gate (per AGENTS.md).
7. **Risks** and anything the north star wants that the browser engine
   can't do.

## Output

1. A short plain-language REPORT first.
2. A component table: exists / partial / missing, with file locators.
3. The schema proposal with examples.
4. A step-by-step migration plan, smallest playable step first. These are
   proposals, not authorization to build.
5. A CHECKPOINT.
