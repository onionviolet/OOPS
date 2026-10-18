# Capture and reading coverage

2026-10-15. Input assembly2.0.211.56, SHA256 `2cc28fba5a86221e27bfdcaa5f5a91a2e249fd474814dce7cff25a9a649b8589`.

This pass requested **403 exact type names**: **388 nonempty complete class captures**, **350 targeted decompilations**, **38 reused files**, **15 absent type names**. Reuse and export totals are source captures, not independent tests or a whole-game review. Counts overlap the original128-class audit and the earlier cooking archive; do not add them as disjoint coverage.

The requested set covers all supplied skill power classes and parent skill classes, all supplied mutation row classes, all63 Cybernetics-prefixed inventory types and selected base/event/effect/AI consumers. Missing names include stale guesses and data-to-class naming mismatches; exact missing entries are retained in EXPORTS. No empty file is counted as a captured class.

The print-window ledger has **105 distinct types** and **119 read operations**. Some large outputs were truncated, and printed source is not proof every branch was understood. Named claims in the three mechanism reports are the semantic review boundary. Some early manually read classes predate the window helper: BiodynamicPowerPlant, MotorizedTreads, Axe_Cleave, Axe_Berserk, ShortBlades_Shank and Berserk. Their full sources and hashes remain retained. `EXPORTS.source_review` is initial capture metadata; it is not an up-to-date semantic verdict.

| Retained private artifact | Purpose |
|---|---|
| [EXPORTS](../private/depth-1/EXPORTS.json) | Per-type input hash, route, source hash, bytes, tool command/status where fresh |
| [source directory](../private/depth-1/source) | Full class bodies, one receipt per type, fresh exporter stderr |
| [CODE_NAVIGATION](../private/depth-1/CODE_NAVIGATION.json) | Exact declarations and event/gate line navigation for every captured file, automatically extracted and not semantically reviewed |
| [READS](../private/depth-1/READS.jsonl) | Printed windows and hashes, explicitly weaker than semantic closure |
| [COVERAGE](../private/depth-1/COVERAGE.json) | Capture status and printed-window joins per type |
| [NPC_FIXTURES](../private/depth-1/NPC_FIXTURES.json) | Complete direct matching authored nodes, source/index/inheritance,21records |
| [Original tables](../SYSTEM_CATALOG.md) | Full skills, powers, mutations and broad inherited implant/blueprint catalogs |
| [Validation](VALIDATION.json) | Hashes, locators, catalog class resolution, private ignore and artifact links |

## Remaining semantic work

The capture is broad; semantic reading is selective. Many individual mental powers, defects, natural weapons, wings, sensory mutations, long-blade stances, social/follower skills, tinkering/medical consumers and implants remain captured-only or have selected windows only. The archive intentionally does not declare “all remaining systems understood.” Examples requiring more consumers are SunderMind, ForceBubble, Beguile/Proselytize, gas-specific effects, full rifle firing, final shield-chance hooks, item ShatteredArmor, phase/collision, powered-source ordering, generated-turret ammunition, medassist tonic utility and clone economy cleanup.

No native game was launched, no YAIR build/test/browser run was needed for this research-only change, and no save/reload/import behavior was exercised. No current-retail/DLC/mod equivalence is asserted. Findings are pinned-source evidence, not player acceptance or selected YAIR design.
