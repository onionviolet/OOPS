# Foundation considerations, 2026-10-16

Weibao: "What about future considerations and more? would a stronger foundation
be better and more? /more-to-consider accordingly?" Follows the
[architecture rules](../ARCHITECTURE_RULES.md), the
[rapid iteration note](RAPID_ITERATION_CONSIDERATIONS_2026-10-16.md) and the
modular seams run (M1–M2 passed, M3 stopped unverified). Everything below is
Claude's recommendation, not accepted direction. No runtime code changed.

## Answer

Yes, a stronger foundation is worth it. Build it as a defined **kernel
contract** inside the current game, not as a new repo. If the kernel's
contract never depends on `main.js`, then "keep growing it in place" and "new
kernel, port content into it" stop being two different designs. They become
two ways to deploy the same design, and no work is wasted whichever way it goes.
The cheapest time to settle that contract is now, while only two domains use
the registry.

## What "foundation" should mean here

| Code | Kernel part | On HEAD today | Gap |
| --- | --- | --- | --- |
| K1 | One clock and scheduler: tick, pause, time scale, fast-forward, offline catch-up | `engineTimeout`, `stepping()`, test-hook `fastForward`; single `update()` loop | No player offline policy ("No player offline policy exists yet", `main.js` near line 9460). Ticks are one minute at a time |
| K2 | Save envelope: namespaced slices, per-domain versioned migrations, atomic writes, real old-save fixtures | Native authority, validators in `save_files.js`, 7 `migrate*` functions | Durable save writer sits unmerged on the engine-perf lineage |
| K3 | Domain registry | `codex/modular-seams` M2 (two domains, byte-identical saves) | Not merged; contract still minimal |
| K4 | Commands: quote, then execute, with serializable arguments | Pattern exists per feature | Not uniform; not recorded, so no replay or undo |
| K5 | Seeded RNG streams | `seeded_streams.js` | 30 `Math.random` uses remain in 7 files, mostly cosmetic or flavor text |
| K6 | Observer-safe projections | Crafting and knowledge owners | Not uniform across domains |
| K7 | Content definitions with stable IDs and reference validation | Registries, `content_packs.js` | Content is mostly JS; only 4 JSON files under `src` |
| K8 | Observability: scenarios, headless runner, invariants, inspector | Test hooks only | Headless/simfuzz/replay unmerged; no scenarios (rapid iteration F3, F6) |
| K9 | Render model: views render from projections when state changes | Shared panel and center controllers | `main.js` polls displays every 250–1000 ms with four `setInterval`s |

## Angles that change the decision

- **Idle-game core (K1).** An idle game without offline progress is missing its
  core promise. Catch-up by plain simulation costs 30–130 ms per game minute
  (rapid iteration F4): 43 s to over 3 minutes per day away. So offline support
  forces either a cheaper tick or domains that can advance many minutes in one
  step. That decides the registry's `tick` signature now.
- **Many worlds, lives and heirs.** State lives at different scopes: this life,
  the lineage or heir, a world instance, and account or meta progress. Prestige,
  heir carryover and world travel all depend on knowing each slice's scope.
  Declaring it per slice now is cheap; inferring it later from 500 files is not.
- **Timelines and divergence.** [Timelines](../TIMELINES_AND_DIVERGENCE.md)
  needs cheap snapshots and branches of state. 398 `structuredClone` calls suggest
  copying is already heavy; namespaced slices let snapshots copy only what changed.
- **Replay and legibility.** Recorded commands plus seeded streams give
  reproducible bug reports, a player-facing "what happened" chronicle and AI
  reuse of player verbs from one mechanism.
- **Agent production.** A conformance test every domain must pass (save
  round-trip, old save without its slice, scenario builds, headless tick
  invariants, no sealed truth in projections) makes lanes self-checking. Of
  everything here, this does the most to speed up parallel work.
- **Sealed secrets.** A dev inspector and scenarios must not show Weibao sealed
  truth while he plays. Inspectors read projections by default; a truth view sits
  behind a dev-build flag.
- **Scale and load.** The bundle is 5.5 MB minified, and every world loads at
  start. Per-world domains could load lazily later, provided the registry
  declares dependencies now.
- **Naming.** Runtime modules carry lane names (`audit_remainder_combat_*`,
  `feature_expansion_*`, `backlog_expansion_*`). Registry IDs should name
  in-world domains so later agents find owners by meaning.

## ACT NOW

| Code | Item | Why now | Disposition |
| --- | --- | --- | --- |
| A1 | Do not merge `codex/modular-seams` M3 as playable | Crafting is implemented-unverified | Recorded in its checkpoint; merge M1–M2 only when merged |
| A2 | Merge order: `codex/rt-slice1`, `proc/ta1-village-asks` and the engine-perf lineage before `codex/modular-seams` | Each has `main.js` conflicts that get harder after the registry lands ([triage](../gm/BRANCH_TRIAGE_2026-10-16.md)) | Needs Weibao's go and owners |
| A3 | Owners commit `UI_RULES.md`, `SITE_AND_EXPLORATION_RULES.md`, `MOCKUP_SYSTEM.md` and the modularity assessment | Worktree agents cannot see standing rules | Owners act; not swept by this pass |

## ACCOUNT FOR NOW: registry contract additions

Before more domains migrate. Each is a field or convention, not feature work.
These extend the [ER12 kernel manifest](../research/OWN_ENGINE_KERNEL_DESIGN_2026-10-14.md#module-manifest-with-two-existing-systems),
which owns signatures; [core engine considerations](CORE_ENGINE_AND_RUNTIME_CONSIDERATIONS_2026-10-16.md)
adds N1–N8.

| Code | Constraint |
| --- | --- |
| C1 | `tick(minutes, ctx)` accepts multi-minute steps; domains declare a cadence (each minute, hourly, daily, on demand) |
| C2 | Each save slice declares a scope: `life`, `lineage`, `world`, `meta` |
| C3 | Commands take serializable arguments and an injected RNG stream, so they can be recorded and replayed |
| C4 | Domain code gets randomness only from an injected stream; no direct `Math.random` in new domain code |
| C5 | Projections declare redaction for sealed facts; inspectors read projections |
| C6 | Domains may register scenario steps built from their own commands |
| C7 | A shared conformance test runs against every registered domain |
| C8 | Registry IDs are in-world domain names, with dependencies declared |

Suggested executor: strong model, medium effort, as an M2.5 round on
`codex/modular-seams` before M3 resumes. Done check: two migrated domains satisfy
C1–C8, the conformance test passes, and saves stay byte-identical.

## LATER / DELEGATE

| Code | Item | Note |
| --- | --- | --- |
| L1 | Offline progress design | Fits the per-world adjectives approach: each world can say how time away works. Weibao's design call when it comes up; C1 keeps every option open |
| L2 | Render on change from projections instead of polling intervals | After K6 is uniform; reduces idle CPU |
| L3 | Lazy-load per-world domains | After C8; measure startup first |
| L4 | Audit stats and modifiers for one pipeline with source tracking | Not inspected in this pass; assumption only |
| L5 | Cheap snapshots for timelines | Builds on C2 slices |
| L6 | Rename lane-named modules into domain folders | Only when a domain migrates; no mass rename |
| L7 | New-kernel fallback trigger | Switch only if three or more migrations fight the global-state tick (136 top-level `let`/`var` in `main.js`). The same contract ports over |

## Limits

Counts are static greps on the shared checkout on 2026-10-16. The stats/modifier
pipeline, save size at late game and startup time were not measured. Tick costs
come from the 2026-10-14 headless lane on a busy host.
