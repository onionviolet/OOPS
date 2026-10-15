# Naev: one career across distinct places

Research date: 2026-10-14. Lane `lib-naev`. **Status: PARTIAL, source audit delivered.** No game launch, install, save access or runtime validation.

Naev makes regions play differently by combining local landing rules, faction jobs and reputation, ship and outfit technology, traffic behavior, and authored changes to places. The same pilot keeps a career across them. Player flags, licenses, credits, ships, ship-specific growth and story history have different homes. That separation is more useful to YAIRPG than treating every region as a new world or converting every power into one common level.

The strongest example is a colony whose delivered supplies change actual services on a later visit. The strongest power example separates a learned psychic status from the ship apparatus and Flow needed to use it. The strongest authoring example separates metadata eligibility from Lua lifecycle callbacks, with explicit scene reservations. None proves automatic off-screen resident lives or cross-cosmology portability.

## Evidence and authority

**Shown** means inspected static source or mechanically parsed authored data. **Stated** means primary author notes. **Inferred** means interpretation or a YAIRPG proposal. Source pin: [`f8982244800e86553217a2dba555a0f41c2b87ba`](https://github.com/naev/naev/tree/f8982244800e86553217a2dba555a0f41c2b87ba). The [GitHub repository](https://github.com/naev/naev) identifies itself as a mirror and points to Codeberg; this audit pins the requested mirror, not a claim that it is the newest canonical head.

Read-only owners consulted: [successor kit](../../worlds/WORLD_CORE_KIT_SUCCESSOR_2026-10-14.md), [K1-K34 kit](../../worlds/WORLD_CORE_KIT_2026-10-14.md), [nested-world dispatch](../../gm/dispatch/NESTED_WORLDS_AND_DEEP_TROPE_CHAINS_2026_10_05.md), [start/branch map](../START_AND_BRANCH_INTEGRATION_MAP_2026-10-14.md), [synthesis](../cross-game-synthesis-2026-10-14/REPORT.md), PROJECT top 80 lines and relevant USER_VISION sections. The requested nested-world root path was absent; file search found the dispatch copy. Current priority remains the selected Village work slice and depth before breadth. No proposal here changes that priority or creates a new mandatory gate.

Census: 233 parsed mission headers (181 unique-marked), 119 event headers (54 unique-marked), 2889 XML documents, zero parser errors. Header counts differ from directory file counts. A parsed header is not a read campaign. [Private reference index](private/README.md) points to the full raw Lua/XML clone and extracted headers, conditions, labels, hooks, memory fields and full XML tables. Bulk files stay outside git.

## Ranked PROPOSALS

All are **PROPOSALS** to adapt patterns in original YAIRPG content, not permission to implement or copy code/assets.

| Rank / code | Proposal | Existing synthesis / kit | Owner | Cost and disposition |
|---|---|---|---|---|
| 1. NV-P01 | Adapt P10 with a complete offer lifecycle | P10, P22; K12, K18, K34 | [CHARACTERS_AND_WORLD_EVENTS.md](../../CHARACTERS_AND_WORLD_EVENTS.md); [ENGINE_EXPANSION.md](../../ENGINE_EXPANSION.md) | Medium: a narrow adapter and one content record. Arbitrary Lua execution, a replacement scheduler and every-faction authoring are deferred. |
| 2. NV-P02 | Show the carrier and current support for one earned power | P04, P09, P17; K3, K9, K15, K18 | [worlds/SKILL_MECHANISMS_AND_MEANS_2026-10-13.md](../../worlds/SKILL_MECHANISMS_AND_MEANS_2026-10-13.md); [worlds/MULTIVERSE_STRUCTURES.md](../../worlds/MULTIVERSE_STRUCTURES.md) | Medium: requires a real two-context consumer. A universal mana exchange and a second power store are deferred. |
| 3. NV-P03 | Let paid local work unlock one useful changed place | P12, P02, P16; K5, K8, K12, K16, K29 | [CHARACTERS_AND_WORLD_EVENTS.md](../../CHARACTERS_AND_WORLD_EVENTS.md); [MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md](../../MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md) | Medium: one phase and service. An autonomous settlement economy, copied Antlejos fiction and city building are deferred. |
| 4. NV-P04 | Separate local landing permission from membership and possessions | P04, P07, P14; K5, K7, K9, K24 | [worlds/world-core-kit-2026-10-14/W3_PEOPLE_INSTITUTIONS_LIFE.md](../../worlds/world-core-kit-2026-10-14/W3_PEOPLE_INSTITUTIONS_LIFE.md); [MEANS_AND_APPRAISAL.md](../../MEANS_AND_APPRAISAL.md) | Small to medium: content and one access consumer. Do not turn all worlds into border checkpoints or impose a lifetime join limit. |
| 5. NV-P05 | Keep relationship, completion and the public log separate | P19, P11, P12; K6, K7, K11, K12, K23, K31 | [worlds/DIALOGUE_AND_INTERACTIONS.md](../../worlds/DIALOGUE_AND_INTERACTIONS.md); [CHARACTERS_AND_WORLD_EVENTS.md](../../CHARACTERS_AND_WORLD_EVENTS.md) | Small if an existing scene fits. No free-text dialogue engine or global omniscient reputation is needed. |
| 6. NV-P06 | Lint lifecycle data and restore only supported pending state | P22, P24; K18, K33, K34 | [ENGINE_EXPANSION.md](../../ENGINE_EXPANSION.md); [research/START_AND_BRANCH_INTEGRATION_MAP_2026-10-14.md](../../research/START_AND_BRANCH_INTEGRATION_MAP_2026-10-14.md) | Medium: choose one defect with two real callers before generalizing. Do not copy Naev's direct-write save or skip-missing-content policy. |
| 7. NV-P07 | Give one local actor a distinct lawful operating pattern | P25, P14; K6, K7, K10, K24 | [CHARACTERS_AND_WORLD_EVENTS.md](../../CHARACTERS_AND_WORLD_EVENTS.md); [ENGINE_EXPANSION.md](../../ENGINE_EXPANSION.md) | Higher: defer until its actor and useful command exist. Naev traffic spawning alone is not a resident simulation. |

## Findings and prior-lane reconciliation

| Code | Disposition | What this confirms, corrects or extends | Source |
|---|---|---|---|
| NV-F02 | Extends P10/P22 | XML metadata and lifecycle scripts scale content; engine-side claims arbitrate scene overlap. | [`src/mission.c`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/mission.c) |
| NV-F03 | Corrects an overgeneralization, not a prior Naev error | P10's four-stage audit contract is useful, but Naev has several dispatch paths, independent event attempts and repeated mission rolls, not one weighted pool or universal cooldown. | [`src/mission.c`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/mission.c) |
| NV-F05 | Extends P04/P17 | Learning, apparatus, capacity and usable current resource are different readers. | [`dat/missions/sirius/sirius_awakening.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/missions/sirius/sirius_awakening.lua) |
| NV-F06 | Extends P09/P16 | Some growth belongs to an item/ship, and income is the trigger; it is not global player XP. | [`dat/events/bioship.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/events/bioship.lua) |
| NV-F07 | Extends P12 | Paid work can leave functional place aftermath through authored service changes. | [`dat/scripts/common/antlejos.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/scripts/common/antlejos.lua) |
| NV-F09 | Qualifies P24 | Lua mem and eligible hooks persist, but timers/functions and an arbitrary VN cursor do not follow automatically. Source save failure policy is weaker than YAIRPG's preservation goals. | [`src/save.c`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/save.c) |
| NV-F08 | Qualifies P25 | Spawned faction traffic and flavor do not establish persistent resident lives. | [`dat/factions/spawn/lib/common.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/factions/spawn/lib/common.lua) |
| NV-F12 | New source anomaly | Chapter guards differ between mission and event paths. Needs reproduction before calling it a runtime bug. | [`src/mission.c`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/mission.c) |

No earlier Naev dossier was present at intake. The comparison above is against current shared synthesis packets, not an invented earlier Naev audit. **NV-N1, new evidence leaf:** exclusive/non-exclusive scene reservations under P10/P22. **NV-N2, new evidence leaf:** income-triggered item growth under P09/P16. Neither needs a new generic packet family yet.

## Reading route and limits

[Findings](FINDINGS.json), [implementation packets](IMPLEMENTATION_PACKETS.md), [system digests](SYSTEM_DIGESTS.md), [small touches](SMALL_TOUCHES.md), [aspect pass](aspects-2026-10-14/ASPECTS.md), [tooling](TOOLING.md), [checkpoint](CHECKPOINT.md).

All runtime, target-viewport, persistence and director acceptance gates remain open for any later implementation. If selected, UI acceptance targets a fresh rebuilt 1366×768 desktop origin with visible local work, support and aftermath, plus affected Save/reload/Export/literal Import. Mobile, broad world activation, new schedulers and universal power conversion remain deferred. This lane supplies research only.
