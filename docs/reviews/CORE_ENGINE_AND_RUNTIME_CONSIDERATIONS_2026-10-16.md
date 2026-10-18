# Core engine and runtime considerations, 2026-10-16

Current continuation, updated 2026-10-16: [modular brief MP1–MP10](../gm/dispatch/modular-seams-2026-10-16/BRIEF.md)
owns the next sequence. Its conditional hardening supersedes this historical
note's suggested all-fields M2.5 bundle. M3 remains stopped; future C/N fields
land for demonstrated consumers rather than as a prerequisite service set.


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


## Round 2: modular engine, redesign and delivery, 2026-10-16

Weibao: "Consider the modular engine stuff and redesign and more?"
More-to-consider pass, proposals only. Applies AR3–AR15, AD7, AD15–AD18,
AD32–AD36 and MR1–MR3 where crafting is the consumer. This is a planning
extension, not authorization to resume a stopped lane, merge branches or build
all C/N proposals. ER12 still owns proposed kernel signatures; AR rules and
accepted direction outrank both rounds. No new rulebook or AD decision is added.

### Evidence recovered for this round

Shared HEAD at inspection: `1e3a59cb17fd4b865fcb8c4add259833f5c0d88b`;
modular worktree HEAD: `3b24c469c867896c2fa69899b503875dcc2c1169`.
Both contain additional working state; these revisions alone do not identify
all inspected bytes. Input SHA-256 receipts are recorded below after writing.

The live lane checkpoint, read from
`/Users/weiwei/.codex/worktrees/modular-seams/yet-another-idle-rpg/docs/gm/dispatch/modular-seams-2026-10-16/CHECKPOINT.md`,
records M1/M2 passed and M3 STOPPED, implemented-unverified. Its final source
was unrebuilt, full gate open, reservation released. These are recovered lane
reports, not rerun results. The shared checkpoint still says dispatched/pending;
use the live copy and its M3 report when resuming. Do not infer current process
ownership from either document. No process handoff was needed for this docs pass.

READ: lane `src/domain_registry.js` and `tests/domain_registry.test.js`, shared
`src/simulation_clock.js`, `src/gameplay_transactions.js`, selected expansion
boundary handling, AR rules, accepted USER_VISION architecture direction, ER12
manifest/cycle cuts and X1–X7, and foundation/rapid-iteration/thread owners.
No game-source comparison or external-source claim was added.

### ACT NOW: planning corrections completed

| Code | Correction completed in this round | Consequence |
| --- | --- | --- |
| MX1 | Separate the small registry's current lifecycle from ER12's larger proposed kernel. The lane registry has optional synchronous hooks; it does not implement staged cross-domain commits, content revision admission or arbitrary bulk simulation. | C1–C8/N1–N8 are a palette of constraints to apply when relevant, not an automatic M2.5 prerequisite bundle. Extend a seam for a demonstrated consumer or failure. |
| MX2 | Reconcile the earlier freeze/thaw recommendation with AD16. Default inactive worlds pause. Current-world away routines stop at choices or exhausted means. | G3/N5 do not authorize elapsed catch-up for every absent world. A domain's absence policy is subordinate to world activation and the owning clock. Existing AD16 already settles the default; no repeated design question is needed. |
| MX3 | Replace the proposed numerical rewrite trigger with evidence of migration cost and retained compatibility. Three difficult migrations alone do not justify a new kernel. | The foundation L7/thread threshold remains an older proposal. Prefer the narrow adapter or core extraction that solves the observed mismatch; a wider replacement needs its own comparison and authorization. |

### ACCOUNT FOR NOW: five consequential design constraints

| Code | Observed pressure and proposed constraint | Failure scenario / observable done check |
| --- | --- | --- |
| MX4 | **Loading is a transaction boundary too.** Registry `load()` migrates and loads each domain sequentially. The function itself provides no rollback if a later loader throws; callers may provide protection, which was not traced end-to-end here. Reuse the existing validation/staging/publication owner rather than add a registry save writer. | Before changing loading, trace the actual caller. Reject a malformed later slice without leaving an earlier slice, inventory, location, timer or RNG partly restored. Unknown/dormant slices survive. This is a local seam risk, not a reproduced whole-game defect. |
| MX5 | **Command ownership must be explicit.** Registry `useItem()` chooses the first accepting domain. The inspected tests cover lifecycle/dependency errors, not ambiguous item handlers. Freeze composition after admission by default; keep legacy ordering until a deliberate compatibility choice. Dependencies express availability, not necessarily contested-resource settlement order. | Two handlers accepting one native item should be rejected at admission or resolved by an explicit owner rule. One action consumes and publishes once. Also compare two equal-deadline jobs competing for one item, since dependency sorting alone cannot prove old outcomes. |
| MX6 | **Multi-minute advance needs boundaries, not just a minutes argument.** The expansion scheduler already exposes choices, remainder and a boundary budget. A domain accepting `tick(minutes)` does not establish equivalent fast-forward. | Compare segmented versus jumped execution from the same retained state and RNG. Stop at the first blocking choice, exhausted supply or lifecycle boundary; retain unconsumed time and make resumption exact. Keep native minute stepping where no equivalence is established. No offline implementation is required for M3. |
| MX7 | **Redesign should reuse a scenario and projection contract.** A scenario can feed the isolated workbench and native browser while each retains its actual navigation, ownership and persistence. Prototypes may use explicit synthetic state; integration evidence must traverse real commands and native inventory. | Target 1366×768, populated save: reach crafting, obtain ingredients, preview, craft, use the result, inspect known consequences, Back/Esc, save/reload/import. Preserve the log column. Carry only observer-safe projections into review exports. A prototype screenshot or headless pass cannot close the native gate. Mobile, wholesale visual redesign and more product families remain deferred for this candidate. |
| MX8 | **Reproducibility and replacement include lifecycle and provenance.** Give scenarios content revision, command sequence, RNG state, clock basis, source/bundle identity and expected semantic result. Replace a domain at a stopped save/load boundary by default. Capture/dispose existing subscriptions, panels and timers when that boundary requires it. | Load/reset twice without duplicate panels, listeners, timers or rewards; an unavailable private pack retains progress and blocks only affected execution through its existing recovery owner. A stripped bug report must omit sealed truths and private pack payloads. Hot reload of live domains is a separate feature, not required infrastructure. |

MX4–MX8 are proposed checks for touched paths, not five new universal suites.
AR9 governs extraction: compare the same scenario before/after and change no
costs, timing, content identity or disclosure as incidental cleanup. No mass
conversion of items, stats, event hooks or content files follows from this pass.

### LATER / DELEGATE: ranked follow-up proposals, no dispatch

| Code | Bounded next work | Level / effort / done check |
| --- | --- | --- |
| MX9 | Recover M3 from its stopped candidate and reconcile current foundation inputs through its owner; isolate native readiness from the crafting resolver before changing either. | Strong / medium. Rebuild final input, run required focused/full/architecture gates, and pass MX7 plus old-save absence and failed-save no-consumption. Preserve previous failed evidence. No blind retry of the paused harness. |
| MX10 | Use one different existing domain to test the smallest missing registry port after M3. Choose by the demonstrated consumer, not a required new world or product family. | Balanced implementation, strong review for persistence / medium. Fewer bespoke core edits, one authority per fact, unchanged behavior and full native persistence. Revise the seam if it merely hides adapters. |
| MX11 | Add a shared scenario descriptor to existing harnesses, then measure iteration cost on that one journey. | Balanced / small to medium. Same command route works headless and in the rebuilt browser; record setup time, execution time and failure diagnostics with input identities. No general editor or all-harness migration. |
| MX12 | Profile the selected journey before event-driven rendering, batching, snapshots, lazy packs or a stats pipeline. | Balanced / small investigation. Separate command planning, validation, serialization/write and rendering costs; select one measured bottleneck. End-to-end improvement must retain gameplay and failure semantics. |

Recommended build order is MX9, then the demonstrated seam check MX10; MX11
can accompany the journey when it removes its setup failure. C/N contract
fields land only as required by those cases. Broader Qud-style parts, generated
histories, NPC scale, timeline copying and a new kernel remain separate proposals.

### Verification and limits

Docs-only: preserved all pre-existing owner text, checked new relative links and
proposal labels, and recorded input hashes. No runtime edit, build, test run,
browser exercise, branch merge, commit or worker launch. Reported lane passes
remain inherited evidence. Runtime acceptance remains the rebuilt native M3
journey and its required persistence/failure gates; human visual/play acceptance
stays separate. This pass changes no accepted design direction or rulebook.

Input receipts (SHA-256, inspected files only):

```text
7f6dbec81e7eef78729e19f9508524cf49173067f9145acdb6f5efcdfd05940c  /Users/weiwei/.codex/worktrees/modular-seams/yet-another-idle-rpg/src/domain_registry.js
2ef3b4344b004425625d49c61d328a5abac43cc82983cc9712a36d0ce3f75dcc  /Users/weiwei/.codex/worktrees/modular-seams/yet-another-idle-rpg/tests/domain_registry.test.js
e59a63567f89bbb28ef8b7757693c23cb4dc0766327fea122c8d298a997143ef  /Users/weiwei/.codex/worktrees/modular-seams/yet-another-idle-rpg/docs/gm/dispatch/modular-seams-2026-10-16/CHECKPOINT.md
02e5e74028285e95d0f959b5a42739500b7dc5686830467cbb2058584d3b4897  src/simulation_clock.js
c829c00bd66ec7d986d4f836e3dd6b3cf9af6e86e3eb868171e167b270387cf5  docs/research/OWN_ENGINE_KERNEL_DESIGN_2026-10-14.md
```

## Current cross-audit qualification, 2026-10-18

N1/N2 and MX5/MX6 already own staged publication, reaction order and chunked
advance. Apply [G26–G30](SUBTLE_RULE_GAPS_2026-10-18.md#round-4-latest-audits-together-2026-10-18)
there for the next selected consumer, rather than duplicating an effect/job/time
framework. N3's retained retired content and old-save requirements are historical
proposals qualified by the 2026-10-17 compatibility and 2026-10-18 ID decisions.
Newly created state still round-trips; present loaded references must be coherent.

The M3 STOPPED recovery discussion records an earlier state. The later
[checkpoint](../gm/dispatch/modular-seams-2026-10-16/CHECKPOINT.md) reports B4,
merge and a post-merge browser follow-up. This pass neither reran those gates nor
proved today's input identity. M4 and broader EI/UIE mechanisms remain separately
selected work, not an automatically authorized foundation bundle.
