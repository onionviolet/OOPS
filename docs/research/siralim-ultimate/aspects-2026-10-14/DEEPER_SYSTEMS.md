# Three deeper reads worth keeping

2026-10-14. These are bounded static research results and explicit remaining questions. Full text/data/native output is private. Proposals do not change YAIRPG's current slice or create acceptance gates.

## D1: realm identity, generated properties and the visit boundary

SHOWN resource structure: `game.ios` has one generic `realm` ROOM and 30 named realm types in `localization/vocabulary.csv:386-415`, with distinct lab, hive, art, ritual and other object families. Native names separate `scr_BiomeGod`, `scr_GetRaceArrayByRealm`, `scr_SetBiome`, `scr_GetEnemyLevelByRealmLevel`, `scr_RealmGetProperties`, `scr_RealmHasProperty` and `scr_RealmPropertyGetValue`. These are meaningful authoring seams. Their existence alone does not prove the generator's filters or formula.

STATED behavior: the shrine quotes depth, known enemies, realm type, optional instability, active properties, hidden-property count and item reward bonus (`ui.csv:606-632`). Each god has its own favor route and shop; its blessings apply in that realm (`codex.csv:143-154`). Thus player choice spans where to go, how far to push, which challenge modifications to accept and which patron to cultivate.

The interesting implementation question is the join: biome -> authored race list and object families -> generated visit -> local modifier readers -> reward/return retention. [NATIVE_TRACE](../NATIVE_TRACE.md) records which native links were actually decoded. Full realm-by-realm object spawn/quest/race joins remain unread. A new random floor should not be mislabeled a persistent changed society.

PROPOSAL: SU-P01 and SU-P03 extend synthesis P14/P05. Bind one useful original local action and actual carry contract to existing world instance and visit owners. Keep jurisdiction, power source, item custody and known conditions separate. No new generic universe type is needed to imitate generated dungeons.

## D2: build combinations, trigger order and useful bounds

STATED: six creatures combine innate/fused/artifact/temporary traits, specialization perks, spells, conditions and relics (`codex.csv:132-142,180,190-195,211-214`). The combinatorial space is expressed through named triggers and source identity, not just total power. The text inventory includes 2,169 trait description rows and 661 perk description rows; some authored/referenced content may not be reachable.

STATED: per-turn action limits, per-battle resurrection/trait limits, Calm Mode and relic exemptions bound combat chains. A stat floor and diminished high-end gains address other runaway cases. The startup phases establish dependency order, but the help contradicts itself about which numbered phase starts the battle. `bc_Event*` and `bc_On*` names establish dispatch/reaction families, not actual queue completeness.

Unread high-payoff consumer: what enqueues an event, which lifetime owns its count, when the count resets, how exceptions enter, and whether independent pending events can be lost. The official developer bug list includes an old queue-loss fix; that is a warning to verify consumers, not proof this build is broken. No runtime failure was reproduced. [Official 2.0 notes](https://www.thylacinestudios.com/blog/siralim-ultimate-2-0-patch-notes).

PROPOSAL: SU-P04 is a new bounded extension to P14/P16. Pick one real native effect cycle and show its explicit termination policy, lawful cost and legible causal record. Do not copy Siralim's numeric limits or convert a local turn policy into a once-per-life limit.

## D3: retained state versus presentation and reconstructible definitions

SHOWN: serializer names exist for creature, item, quest, project, decoration, stats and notification domains. STRG near indexes 31617-31754 includes version labels, depth frontier, castle, realm and hidden properties, fusion, projects, gods/favor, macros, wardrobe and collections. Full private tables retain identities and text separately from these mutable domains.

STATED: the castle is the refit/home loop, projects unlock useful services, and favor/emblems/local blessings have different roles. That suggests a retained account of the traveler, roster and patron progression alongside temporary expedition state. It does not prove every pending action, object or destination survives an exit. Read [NATIVE_TRACE](../NATIVE_TRACE.md) for the whole-save wrapper and Create evidence, its conditional file copying and the Step decompile timeout. Backup-like copying is not atomic recovery.

Unread high-payoff consumers: `scr_LoadMain`, per-domain serializer field order, format/version gates, output replacement, backup selection, failure recovery and a complete save roundtrip. Inspecting personal saves was prohibited and did not occur. Version-shaped strings do not establish a migration chain, and a helper called SaveGame does not establish atomic durability.

PROPOSAL: SU-P03/SU-P06 extend P05/P12/P16/P24. Save actual acquired identity and paid state, recompute display text, retain explicit local versus visitor lifetime, and reject incompatible content recoverably. A useful return journey with Save/reload/Export/literal Import is the later integration proof; this research earns no such credit.
