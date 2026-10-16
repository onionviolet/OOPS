# Core engine and runtime considerations, 2026-10-16

Weibao: "we need a /more-to-consider for the core engine and runtime accordingly
to cover these? we can inherit/be inspired by caves of cud and other games with
similar ideas but we dont need to be limited by them". Claude's recommendations,
not accepted direction. No runtime code changed.

## Owners this builds on (do not fork them)

- [Own-engine kernel design (ER12)](../research/OWN_ENGINE_KERNEL_DESIGN_2026-10-14.md):
  kernel interface (`preview`, `dispatch`, `advance`, `read`, `subscribe`),
  module manifest, cycle cuts, strangler order X1–X8, stop conditions. **ER12
  owns signatures.** This note adds angles and constraints to it.
- [Idle and sim engine references (ER4)](../research/IDLE_AND_SIM_ENGINE_REFERENCES_2026-10-14.md)
  and the [offline time audit](../research/OFFLINE_TIME_AND_BRANCH_CLOCK_AUDIT_2026-10-14.md).
- Caves of Qud source reads: [report](../research/caves-of-qud/REPORT.md),
  [deeper systems](../research/caves-of-qud/aspects-2026-10-14/DEEPER_SYSTEMS.md),
  [system inventory](../research/caves-of-qud/aspects-2026-10-14/SYSTEM_INVENTORY.md).
- [E4 tags and rules](../emergent/E4_TAGS_AND_RULES.md), the merged but inert
  `src/effect_dsl.js` (rulebook R2), [architecture rules](../ARCHITECTURE_RULES.md),
  [foundation considerations](FOUNDATION_CONSIDERATIONS_2026-10-16.md) and
  [rapid iteration](RAPID_ITERATION_CONSIDERATIONS_2026-10-16.md).

## Answer

Own one thing: the game's **causal contract** for time, transactions, identity,
knowledge and saves. ER12-F1 reached the same conclusion. Around it, take the
content side from Qud: objects built from parts, blueprints with inheritance
baked at load, tags and events. Then go further than Qud where YAIR's goals
need it: many worlds with different laws, several lives and heirs, truth kept
separate from knowledge, and cheats that edit rules. Don't build a renderer, a
general ECS or a story VM; keep DOM, panel_kit and inkjs.

## What to borrow, adapt or skip

Status: **SHOWN/READ** = from this repo's source reads; **STATED** = Claude's
general knowledge, not verified here.

| Code | Source | Idea | For YAIR |
| --- | --- | --- | --- |
| G1 | Caves of Qud (SHOWN) | Objects are bags of parts; 1,367 part classes; blueprints across 14 XML files with inheritance, ordered mixins and named overrides baked before the factory builds parts | **Adapt.** Parts as data plus behavior modules for new content. Bake definitions at load into frozen objects with stable IDs |
| G2 | Caves of Qud (SHOWN) | Events run handlers that act directly; conversation `Entered` runs actions with per-action logging and no rollback | **Improve on it.** Handlers return staged changes inside ER12's guarded commit, so a failure rolls back cleanly |
| G3 | Caves of Qud (SHOWN) | Inactive zones freeze to a cache; thaw supplies the elapsed ticks | **Adopt** for world instances and distant places (ER12-K6): frozen state plus elapsed time, resolved on return |
| G4 | Caves of Qud (SHOWN) | Save version 409 with accepted range 395–409, section sentinels, `.bak` copy before write, per-subsystem loaders | **Adopt the shape** inside YAIR's existing publisher: version range, per-domain sections, last-known-good. Not Qud's format |
| G5 | Caves of Qud (SHOWN) | HistoryKit and Annals generate a world's past as entity events (67 Annals classes) | **Adapt** for world pasts and legends; feeds rumors, books and ruins (site rules) |
| G6 | Caves of Qud (SHOWN) | ModManager handles dependencies, order, build and conflicts; Compat.xml | **Adapt** as the content manifest (ER12-A2). Lanes act as mod authors |
| G7 | RimWorld (STATED) | Defs with abstract parents; ThingComps; Normal/Rare/Long tick types; Storyteller | **Adopt** tick cadences (C1) and abstract parent definitions; storyteller already lives in E5 |
| G8 | Dwarf Fortress (STATED; ER4-F4 READ) | Raws as data; materials carry properties; abstract populations that materialize individuals on return; legends | **Adopt** the materialization contract: coarse state turns into identities, stock and history when observed |
| G9 | Cataclysm DDA (STATED; ER4-F4 READ) | JSON with `copy-from`; mods as overlays; absent map areas actualized on load | **Adopt** overlays for world packs and canon variants |
| G10 | Factorio (STATED; ER4-F3) | Deterministic simulation; save/load must continue identically; only active entities update | **Adopt** the continuation invariant as a test: save, load, continue N ticks equals no save |
| G11 | Brogue and other roguelikes (STATED) | Seed plus recorded inputs replays a whole game | **Adopt** through recorded commands (C3) for bug reports and a player chronicle |
| G12 | Idle games: Antimatter Dimensions, Kittens, Melvor, Evolve (ER4 READ) | Bounded replay, per-subsystem fast-forward, capped offline, banked faster time | **Per world.** Each world picks an offline adjective; domains support multi-minute advance |
| G13 | Crusader Kings 3 (ER4-F6 STATED) | Narrow candidate work, cache derived values, spread periodic work | **Adopt** for NPC scale later (NPC work is currently deprioritized) |

## Where YAIR should go further than these games

- **Many worlds with different laws.** Qud has one world. YAIR needs world law
  modules that swap per instance: the same object behaves differently under
  different physics, magic or making rules (MR world styles).
- **Truth separate from knowledge.** Qud has identification and examination.
  YAIR needs observer-qualified projections everywhere, plus sealed secrets
  (AGENTS.md). The event and query layer must answer "what does this observer
  know", not only "what is true".
- **Lives, heirs and meta scopes.** State persists at different scopes (C2).
  Most reference games have one character or one colony.
- **Rules as data that cheats and titles can edit.** E4's "tags on rules"
  needs rules addressable by ID, so a cheat can modify or suspend one rule
  within a scope. Hardcoded `if` chains can't be targeted.
- **Transactional safety.** Quote, then revalidate, then commit or roll back.
  This beats Qud's no-rollback handlers and suits a game that agents extend
  in parallel.

## Engine layers and their gaps today

| Code | Layer | Today (READ, 2026-10-16) | Direction |
| --- | --- | --- | --- |
| E1 | Objects | `items.js` uses class inheritance (`Item` → `Equippable` → `Weapon`, 4,600 lines, 153 constructor calls) from upstream | New content uses parts/tags data; old classes reached through an adapter (G1). Hybrids such as a coating that is also a reagent need parts |
| E2 | Events | Direct calls; 6 custom DOM events; per-feature hooks | Two kinds: pure **queries** (can I, what modifier) and post-commit **notifications** (G2) |
| E3 | Definitions | JS registries with stable IDs (`expansion_engine.js` admission); only 4 JSON files | Baked frozen definitions with ID plus revision; inheritance and overlays (G1, G9) |
| E4 | Tags and rules | E4 proposal; `effect_dsl.js` merged inert with 20 drafts needing semantic fixes | One rule addressing scheme before any consumer adopts the DSL |
| E5 | Stats | Per-feature modifiers (for example the work ledger) | One query pipeline with source tracking; not inspected in full (assumption) |
| E6 | Time | One `update()` loop; expansion scheduler with boundaries; no offline policy | Cadences, freeze/thaw (G3), materialization (G8), per-world offline (G12) |
| E7 | Randomness | `seeded_streams.js`; xorshift in expansion; `Math.random` in native combat and flavor text | Injected streams only in domain code; continuation test (G10) |
| E8 | Saves | Native authority publisher, durable writer and validators now on HEAD | Version range, per-domain sections, unknown-field preservation (G4, ER12-S3) |
| E9 | History | `chronicle.js`, `lore_history_state.js` | Generated pasts as entity events (G5) |
| E10 | Knowledge | Crafting and knowledge projections; sealed-secret rules | Observer-qualified queries across all layers |
| E11 | Content manifest | Composition imports worlds eagerly (ER12-C4) | Manifest admission and overlays (G6) |
| E12 | Observability | Headless runner, simfuzz, replay and perf gate merged on 2026-10-16 (triage) | Scenarios (rapid iteration O3), inspector, continuation test |

## ACT NOW

| Code | Item | Disposition |
| --- | --- | --- |
| A1 | `codex/modular-seams` is behind the 2026-10-16 triage merges (engine-perf lineage, `rt-slice1`, `ta1`), all of which touched `main.js` | Merge HEAD into the branch before any M2.5 or M3 work. Next lane run's first step |
| A2 | Avoid two competing kernel specs: the foundation note's C1–C8 and ER12's manifest overlap | Done in this note: ER12 owns signatures; C1–C8 and N1–N7 below are additions to its manifest, not a second contract |
| A3 | `effect_dsl.js` is merged but has 20 drafts needing semantic correction | No consumer adopts it until those are corrected and E4 addressing (N6) is settled |

## ACCOUNT FOR NOW: manifest constraints

These add to ER12's manifest and to C1–C8. Each is a field or rule, not feature work.

| Code | Constraint |
| --- | --- |
| N1 | Handlers stage changes; they never mutate live state. Only the coordinator commits (improves on G2) |
| N2 | Queries are pure and may be cached per commit. Notifications run after commit and may enqueue commands, never mutate. No reentrant event chains |
| N3 | Definitions are frozen at load with stable ID plus revision. Saves store IDs and instance deltas, not copies of definitions. Retired content stays retained |
| N4 | New content prefers parts and tags over new `Item` subclasses. Each part declares its save fields, queries and commands |
| N5 | Each domain declares its absence policy: `freeze`, `elapsed-on-thaw` or `abstract-then-materialize` (ER12 manifest `clocks.absence`) |
| N6 | Rules carry addressable IDs and scopes, so tags, titles and cheats can target them (E4) |
| N7 | Every generated thing records its seed and generator revision, so a generator change never reshuffles existing saves |
| N8 | World law modules are data plus code bound per world instance; the same object asks the active laws, never a global constant |

Suggested executor for folding N1–N8 and C1–C8 into the registry: strong model,
medium effort, as one M2.5 round on `codex/modular-seams` after A1. Done check:
the two migrated domains satisfy the constraints that apply, the conformance
test passes, saves stay byte-identical, and the continuation test (G10) passes
headless.

## LATER / DELEGATE

| Code | Item | Executor hint |
| --- | --- | --- |
| L1 | Parts pilot on one product family (crafting carriers), through the registry | Balanced model, medium effort; done when a hybrid item works without a new subclass |
| L2 | Generated world past (G5, G8) for one world, feeding rumors and sites | Strong model; design first, with Weibao's world choice |
| L3 | Content manifest admission and overlays for world packs (G6, G9) | Strong model; after ER12 X4 |
| L4 | Freeze/thaw for world instances and distant places (G3) | Strong model; after N5 |
| L5 | Recorded-command replay and a player-facing chronicle (G11) | Balanced; after C3 |
| L6 | Offline semantics per world (G12) | Weibao's design call when it comes up; the engine keeps every option open |
| L7 | Stats pipeline audit and consolidation (E5) | Balanced; read-only audit first |

## Limits

Qud facts come from the repo's static source reads; everything marked STATED
is general knowledge, not checked here. Counts are static greps from
2026-10-16. Nothing was run for this note.
