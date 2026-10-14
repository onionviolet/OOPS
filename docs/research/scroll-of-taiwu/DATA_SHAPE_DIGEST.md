# Config tables and domain data

## F12: Compiled rules, separate prose

Shown: `Backend/GameData.Shared.dll` holds Config types and compiled row construction; `Backend/GameData.dll` holds mutable domain behavior. The Unity client also carries managed assemblies. This is a Mono/managed route, not an IL2CPP-only native payload. No UnityPy install was necessary for the questions answered here.

| Table | Measured shape | Selected fields / links |
|---|---|---|
| CombatSkill | 955 constructors, unique contiguous IDs 0–954; 124 readonly definition fields | Grade, SectId, FiveElements, BookId, IsNonPublic, UsingRequirement, DirectEffectID, ReverseEffectID, SkillBreakPlateId, force fields |
| BuildingBlock | 319 constructors, IDs 0–318 | FuncType, Type, Class, BaseBuildCost, DependBuildings, OperationTotalProgress, BaseMaintenanceCost, role/manager and event fields |
| LegacyPoint | 53 constructors, IDs 0–52 | Type, BasePoint, MaxPoint and settings-related references |
| Legacy | Item schema inspected; full table not extracted | Cost, uniqueness, random weighting, property/world/sect effects |
| SectApprovingEffect | Generated table inspected for school-rule shape | RequirementSubstitutions, BehaviorTypeBonuses, CombatSkillDirectionBonuses, male/female page bonuses |

Count method: parse every `new <Table>Item(<integer ID>, ...)` occurrence, including decompiler-created local list aliases. Counting only `_dataArray.Add` incorrectly misses aliases in large split initializers. Count checks verified uniqueness and a contiguous ID range; they do not prove which rows players can acquire. CombatSkill.Init allocates capacity 955 and invokes sixteen CreateItems methods.

The Shared type listing contains 313 top-level `Config.*Item` classes by the stated name filter. This is a schema inventory measure, not proof that all classes are large gameplay tables or fully read.

Shown: `ConfigData<T,TKey>` uses a base list, string reference-name map and extra-data dictionary. It has generated-row initialization, ID/reference lookup and mod/import support. Negative IDs return null in the ordinary getter; missing positive extra IDs can create a default row with a warning. No import/export or game code was executed during research.

Shown: strings are addressed by table-specific language keys through LocalStringManager, with CN, CNH, EN and KO directories. Shipped encyclopedia TSVs are presentation/help material with rich-text links and merged-cell markup. They should not be confused with authoritative config CSVs. Reference-name maps are another distinct layer. A tiny identifier is sufficient for a report; bulk prose and rows stay private in the work area.

## Mutable identities

Shown from call sites: combat skills use character-plus-template keys; items use ItemKey with instance identity; buildings use area/block/building-index keys; warehouse ownership uses settlement ID; world month routines operate across domain services. Source rekey/copy operations explain succession better than table definitions alone.

P7 translation: keep original YAIRPG definitions, current actor state and player-visible explanations separate. Validate links and local policy variants. Do not convert 955 Taiwu definitions into a mandatory roster or treat localization text as executable rules.

Open: exhaustive row semantics, remaining Config tables, Unity asset bundles, event-script conditions and game serialization compatibility. Hashes for extracted material are in `~/.codex/research/taiwu/extract/HASHES.txt`.
