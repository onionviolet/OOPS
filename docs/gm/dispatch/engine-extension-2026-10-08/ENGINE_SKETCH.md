# Engine sketch: one framework for many worlds (Claude Code, 2026-10-08)

*Proposal. Written from the north star's engine audit and the session's
ideas, not from a fresh code read. The engine-extension lane checks it
against the live code and corrects it.*

## The idea in one paragraph

Build a small number of shared shapes once, and let every world, cheat,
faction and event be **data** in those shapes. The engine answers questions
("what is fusion pressure here?", "does this power work here?", "what does
this rewind keep?") through one layered lookup. Vanilla YAIR stays the
default content, untouched. New worlds are content packs, not new
`*_host.js` modules.

## Components

### 1. Rules lookup (the spine)

`rule(key, context)` resolves in layers, first match wins:

1. personal exceptions (a cheat card, a smuggled power, a native-only law)
2. place card
3. world card
4. multiverse events (a thinned barrier, a convergence season)
5. defaults (vanilla behavior)

Everything else asks this instead of hard-coding a world. Absences are
rules too (`concepts.enabled = false`) with an in-world reason string.

### 2. Cards (data shapes)

| Card | Holds |
|---|---|
| World | premise, signature laws, absences, dials, display mode, growth ladders, stance, scarcity, deck, doors, places |
| Place | dial overrides, local deck |
| Edge (barrier) | strength, filter, time ratio, leak rate, direction, carry policy (extends `portableCarrierPolicy`) |
| Power | kind, tier, stage, compatibility mode per world kind, two bars (understood, usable) |
| Cheat | tier, kind (blessing, parasite, con, trap, debt, pure), exact guarantee, exclusions, what it wants |
| Operation | revival, rewind, regression, succession, offline: target, anchor, trigger, history model, restored, retained, observers, reward reset rules |
| Faction / hub | charter: purpose, ranks, seats, salary, duties, shops, return, enforcement, leaving |
| Person | life record, traits, aptitude per path, relations, memories (behavioral, separate from biography), followers |
| Research project | subject, inputs, stages, outputs, partial results, failure progress |
| Event | eligibility, chance, repeat, cooldown group, priority, aftermath, successor |

### 3. Content packs

- A pack = a folder of cards + text + content (items, people, recipes).
- Public packs ship in the repo; private packs (direct adaptations) live in
  a gitignored folder and load if present.
- A missing pack makes its worlds unreachable and keeps saved state dormant,
  the same way Jade Hollow stays dormant today.

### 4. Systems that read cards

- **Growth:** skills (vanilla), plus ladders declared by the world card
  (realms, sequences, Concepts with tier and stage, blueprints). One
  research-project runner serves all of them.
- **Compatibility:** on arrival, each owned power is resolved to works,
  reread, rechannel, weakened or blocked through the rules lookup.
- **Director:** picks eligible events from the current world and place
  decks, with cooldown groups, a monthly disruption budget, a pity timer and
  the saved RNG.
- **People:** named people simulated coarsely by year; unnamed people as
  counts (Tale of Immortal). Followers run routines while idle.
- **Factions:** charters plus yearly coarse simulation (payroll, loyalty,
  promotions, wars) and a few event hooks.
- **Operations:** one runner applies operation cards (what to restore,
  what to keep) so rewinds and revivals don't each need custom code.
- **Knowledge:** Notebook entries with states (unknown, rumored, believed,
  confirmed, disproved) for worlds, powers, enemies and ways around limits.

### 5. Time

One multiverse clock. Each world has a time ratio. The character ages by
subjective time. Unvisited worlds advance lazily when next visited, with a
summary ("five years passed here").

### 6. Saves

- Split the save: a small core (character, current world, notebook index)
  plus per-world deltas against the pack's starting state.
- Compact history by year; keep vital entries, prune ordinary ones after a
  window (Tale of Immortal prunes ordinary logs after five years).
- Compress, and probably move from localStorage to IndexedDB for size.
- Every schema step has a migration and keeps vanilla saves loading.

### 7. UI

Stays inside the original surfaces: center menu for actions, side log with
filters, bio for the life history, Notebook for knowledge, tooltips for
cost ledgers. Display mode per world changes how stats read.

## Smallest playable first step (proposal)

1. Rules lookup with only defaults and one home-world card (no behavior
   change), plus a schema check.
2. One place card that changes one dial (the deep forest's danger), visible
   in play.
3. One power with the two bars and one compatibility mode, tested by
   carrying a Frontier skill into an existing book world.
4. One operation card (the existing heir succession) moved onto the runner.

Each step: rebuild, browser check from a fresh origin, save, reload and
import, per AGENTS.md.
