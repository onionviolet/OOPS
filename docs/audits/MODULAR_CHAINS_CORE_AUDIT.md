# Modular production chains core audit

Repeatable audit for the topic "modularity from harvesting and extraction through crafting, use and salvage, plus procedural rules". Method: [topic expansion audit playbook](TOPIC_EXPANSION_AUDIT_PLAYBOOK.md). Root palette: [modular production chains](../MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md).

## Owners to check first

Harvest: [harvest modules wave](../gm/dispatch/harvest-modules-2026-10-14/PLAN.md) (HV1 code, HV2 model). Materials: [materials audit](../PROCEDURAL_MATERIALS_AND_ALCHEMY_AUDIT_2026-10-13.md). Making: [crafting palette](../PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS_2026-10-14.md), [weaponcraft](../WEAPONCRAFT_RUNES_AND_INSCRIPTION_CONSIDERATIONS_2026-10-14.md), P6 and P8 under `gm/dispatch/procgen-2026-10-13/`. Rules and generation: [generation foundation rules](../GENERATION_FOUNDATION_RULES_2026-10-14.md). Worlds: [world core kit](../worlds/WORLD_CORE_KIT_2026-10-14.md).

## Rerun triggers

| Trigger | Rerun lanes |
|---|---|
| HV1 or a later harvest slice merges | PC1 (crosswalk), PC4 (auto and catch-up) |
| A new making family or saved product domain lands | PC1, PC3 |
| `rules.js`, `tag_store.js` or a rule module gets a new consumer | PC2 |
| A new world gets a card or dossier | PC5 |
| Item identity, equipment or body owners change | PC3 |
| Offline or catch-up policy changes | PC4 |

## Lane templates

Prompts and shared rules live in [`gm/dispatch/modular-chains-2026-10-14/`](../gm/dispatch/modular-chains-2026-10-14/COMMON.md) (PC1-PC5). Copy into a new dated folder and update the HEAD and branch references; keep docs-only lanes to two owned files each.

## Run log

| Date | Round | Lanes | Result |
|---|---|---|---|
| 2026-10-14 | 1 | none | Palette ML, MS, MV, MR, MX, MT, MC, MA, MI |
| 2026-10-14 | 2 | PC1-PC5 sent | Correction: harvest end owned by HV1/HV2; FL, SR, AG, KS, GC, CS, OP |
| 2026-10-14 | 3 | PC1-PC5 folded | X1-X19 corrections, shared verdict (no universal engine), top picks T1-T5, R3-1 to R3-5 |
| 2026-10-14 | 4 | TW-C, TW-L, TW-S ([topic wave](../gm/dispatch/topic-wave-2026-10-14/COMMON.md)) | Triggers TR1 (HV1 merged) and TR2 (T3 rule reader merged); game wave evidence GW1-GW10; levels consistency ML-R4a-c |
| 2026-10-14 | 5 | TW-C, TW-L, TW-S folded | FC1-FC7 corrections; shared pieces with two real callers (rules, seeded decisions, world instances); next slice P01 on Village mixing ([prompt](../gm/dispatch/topic-wave-2026-10-14/NEXT_SLICE_P01.md)) |
| 2026-10-15 | 6 | feature scout, deep systems sweep folded | FS1-FS9 stage-specific interruption policies and lot-carried progress constrain T4; production picks from Immortal Life, Taiwu, Academagia, Naev, HyperRogue |
