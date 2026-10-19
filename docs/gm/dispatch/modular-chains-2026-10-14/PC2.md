# PC2: procedural rule modules (docs)

Read COMMON.md in `/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/modular-chains-2026-10-14/` first. Folder `pc2/`.

Goal: one rule module shape covering root MMR1-MMR13: world laws, generated per-save rules, social and institutional rules, local fields, timed rules, spreading rules, player-made rules and cheats that edit rules.

Start from `src/rules.js` (SHOWN: pure, all/any/not, eq/gte/lte, known plus reasons) and `src/tag_store.js`, `src/pocket_realm_rules.js`, `src/realm_boundary_rules.js`, plus GENERATION_FOUNDATION_RULES GR1-GR17 and GA4 overlays, world core kit K2 world laws, and the materials audit resolver contract.

Cover: schema (selector by tag query, effect kinds, priority, scope, knowledge status, receipt, revision); conflict and ordering policy with worked conflicts; who applies effects (the operation resolver, never the evaluator); rule grammars for per-save generated rules, with solvability and freeze-on-reveal; how rules are discovered partially with confidence; social enforcement versus physical impossibility (HV2 M3a distinction); cheats that edit rules with scope and receipts; performance indexing; a test-case table a later code lane can implement; and the first real reader in the game (one chain stage) so it is not write-only (GR12). Show three per-world rule packs as examples (one sealed-secret-safe by ID).
