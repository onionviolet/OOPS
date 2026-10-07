# YAIRPG expansion project

A single-player browser idle RPG built on Yet Another Idle RPG, inspired by
Proto23 and cultivation/progression fiction. Weibao directs and reviews the
playable result; agents implement. Personal creative project.

## Vision

- Multiple worlds with distinct rules, economies and progression, plus
  meaningful interactions between them.
- Dense stats and interconnected skills where ordinary skills stay useful late.
- Deepen existing YAIRPG systems as well as adding new ones.
- The starting world is a full campaign of its own, alongside the others.
- Prestige/rebirth, kept separate from travel and ascension.

Full original requests: [User vision](docs/USER_VISION.md). Design families:
[Idea index](docs/IDEA_INDEX.md). Candidate world families and the original
expansion proposal: [log](docs/gm/PROJECT_LOG.md#expansion-design-proposal).

## Accepted decisions

- **First milestone:** one realm and one prestige layer. This sequences
  delivery; it does not cap the vision.
- **Branch dimension (2026-10-03):** the expanded setting is its own branch of
  YAIRPG, distinct from the original developer's continuity.
- **Vanilla stays intact (2026-10-03):** inherited opening, native quests,
  stats, professions, equipment and center-menu play. New story is opt-in. No
  forced restart, cultivation or second world on entry.
- **Cultivation slice retired (2026-10-01):** Jade Hollow is archived; its
  saved data stays dormant. Cultivation remains a possible later path.
- **Original UI is the baseline (2026-10-02):** extend existing panels and
  center actions rather than adding separate windows.
- **Worlds:** original worlds and direct book/anime/game settings are both
  allowed. A referenced book is not automatically a direct adaptation, and no
  final favorite list is required to start.
- **Reference games:** Theory of Magic and Path of Achra lead the research
  shortlist (with Orb of Creation, Siralim Ultimate, Loop Hero). Your
  Chronicle's expansion/balance principles are accepted as review criteria.
- **Defeat:** native defeat stays unconsciousness and recovery. True death,
  run endings and rewind remain proposals.

Still undecided: realm names, main story, skill roster, reset and retention
rules, balance, and which book worlds become campaigns.

## Current status (2026-10-07)

- **Branch:** `codex/gameplay-foundations`, on the v0.6 development foundation
  (see [v0.6 migration](docs/V06_MIGRATION.md)).
- **Build:** bundle `e77080593d4b`, about 1,227 simulation commands, 52
  controllers, 23 conditions, 7 plans. Save schema: expansion 11,
  simulation 5, plus optional `proto23Village` and `motherOfLearning1`.
- **Destinations:** home world `base.frontier`; nested hub, Saltworks and
  Archive; Folded Glasshouse; Tidemark; Paradise hub and Goa; Mother of
  Learning Cyoria; Proto23 village branch. Depth is uneven, so ten IDs do not
  mean ten finished worlds.
- **Verification: nothing since 2026-10-04 has been played.** Every wave
  is "implemented-unverified" (last browser proof: [Exchange and Returned Gaze](docs/PLAYTEST.md), 2026-10-04): build, syntax, import and link checks pass, but
  no gameplay, browser, save/reload or regression tests have run. Open gates
  per wave live in each `docs/gm/<wave>/ACCEPTANCE_BACKLOG.md`.

Wave-by-wave delivery history: [project log](docs/gm/PROJECT_LOG.md).

## Next step

1. Playtest the current build from a fresh origin: base opening, one home-world
   loop, one book world, then save, reload and import.
2. Work through the acceptance backlogs, starting with save compatibility.
3. Only then start the next content wave.

## Repository

- Fork: https://github.com/onionviolet/yet-another-idle-rpg (public)
- Upstream: https://github.com/miktaew/yet-another-idle-rpg
- Keep the MIT license and upstream attribution.
- Source in `src/` (content `src/data/`, models `src/models/`, shared state
  `src/components/`). The browser loads `dist/bundle.js`, built by esbuild.
- Node >= 22.13: `npm ci`, `npm test`, `npm run build`.
- Serve: `python3 -m http.server 8123 --bind 127.0.0.1`, open
  http://127.0.0.1:8123. Use a separate fresh origin for tests and one game
  tab per origin. Saving needs Web Locks (localhost or HTTPS, not file://).
- Private save exports in `~/Downloads/Games/` stay untouched.
- `docs/research/novels/` is local-only (gitignored): derived notes from
  copyrighted books, kept out of the public repo.

Other owners: [playtest log](docs/PLAYTEST.md),
[engine contracts](docs/ENGINE_EXPANSION.md),
[creative proposals](docs/DIRECTION_SYNTHESIS.md),
[superseded prototypes](docs/PROTOTYPE_HISTORY.md),
[GM workflow](docs/GAME_MASTER_PROMPT.md).
