# Techniques, items, events and content authoring

**Shown** static architecture unless labelled otherwise. Locators follow [REPORT.md](REPORT.md). This is a mechanism/sample audit, not a copied catalogue or an exhaustive listing of proprietary content.

## Table map

| Content family | Authoring form | Consumer / locator |
|---|---|---|
| Realms/categories | Name arrays and category objects with start/end indices; separate energy/path catalogues | Realm/category helpers L79600-80048 |
| Qi requirements | Generated numeric array from range/multiplier bands | `QI_PER_STAGE_TABLE`, producer L136400-136527; consumer L123091-123131 |
| Weapon skills | Weapon-to-branch descriptors, five levels per branch, typed parameter maps, generated prerequisite IDs and layout positions | Producer L154603-154775; purchase/active checks L154865-154943 |
| Battle manuals | Generated ID/name, weighted rarity, realm requirement, rolled variance and bonus list | `generateManual`, L90623-90649; tier/equip consumers L90707-90784 |
| Forge recipes | Recipe ID, rarity, map gate, time cost and material/quantity requirements; some families generated | Sample L102520-102555; recipe registry L99233-99234 |
| Quests | ID, origin, prerequisite(s), objective, typed rewards and UI category/priority | Registration/chain L268760-268852; threshold/counter evaluators L267915-268045; reward dispatch L268150-268215 |
| Origin progression | Authored quest blocks plus loops generating repeated milestones | Sword samples L268860-269025; ordinary manual slots L272525-272578; sound evolution L272581-272627 |
| Cave rooms | ID, pool, weight, optional depth bounds, objective and compact tile rows | Pool registry/pick L202912-202973; template samples L203005-203063 |
| Cave objectives | Eligible objective descriptors with depth/tier/room pools and build callbacks | `combatClear`, `bossKill`, `sokobanPlates`, L203184-203255 |
| Hidden-site treasure items | Authored site/rarity/weapon metadata combined with generated reward magnitude and unique identity | L204710-204800; not a full site-story read |

## Techniques do more than multiply power

Nine weapon families each have three branches with five generated nodes per branch in the inspected descriptor block. That is 135 generated nodes in that block, not a global technique count. Parameters include strike count, chance per strike, wound duration, fist momentum/speed/impact, palm hitbox/count/travel, axe radius/center damage/waves, spear speed/size/redirection, staff rotation, fan elements/reactions and zither cadence/sustain/resonance. L154603-154775.

Each generated node has an ID, branch, tier, explicit cost, predecessor requirement, position, effect values and a `replace` mode. The purchase executor refuses unknown/already-bought skills, missing purchased prerequisites and insufficient points, then deducts points, records purchased/active state and purchase order, and refreshes caches. Active and purchased are separate predicates. Respec/deactivation cascades when active prerequisites disappear, refunding applicable points. L154865-154943, L155103-155135.

**Inference:** the most useful YAIRPG transfer is a shared effect definition that drives both the action and its explanation. A random name or unlocked tree alone does not establish distinct combat behavior. These source tables specify effects; this pass has not measured every projectile consumer.

## Generated manuals versus fixed techniques

Battle manuals use weighted rarity unless forced, a realm band, random variance from 0.8 to 1.2, generated bonuses and a new identity. Tier upgrades cost spirit stones and generate added bonuses up to the derived maximum tier; equipping checks the slot lock and swaps the previous item back into inventory. L90623-90660, L90707-90784.

This differs from learning a fixed weapon node. One is a rolled item with state; the other is a prerequisite purchase with known effects. A YAIRPG design should preserve that difference and decide where rolls become saved facts. The source generator uses random calls, but this pass does not prove that every shop refresh is reload-safe.

## Recipes are joined material and time contracts

The sampled lesser/celestial beast-seal recipes provide a stable recipe ID, material requirements, time cost, rarity, beast type and optional map unlock. Generated families vary those values by band. L102520-102555 and surrounding recipe families. A recipe catalogue can feed availability checks and previews, but transaction ordering, failures and every alchemy-quality route were not fully audited here.

## Quests are small programs

Objectives dispatch by type. Counter objectives match an event and update a nested state field; threshold objectives inspect state or use a custom getter. The registry supports origin/global/category views, priority ordering, chain traversal and prerequisite arrays. Eligibility filters by completed state, origin, prerequisites and optional callbacks. A threshold sweep repeatedly checks newly available quests so completing one can unlock another in the same sweep. L267915-268045, L268760-268852, L273055-273128.

Rewards dispatch separately by type, including unlock actions. Unlocking dantian control is not just a flag: it releases innate slots, enters setup and grants starter nodes. L268165-268180. Content can also carry executable getters and build callbacks, so calling this a pure JSON content system would be inaccurate.

**Contradiction:** the chosen-origin meridian quest says Golden Core while its objective checks effective realm index 2. The table lists Golden Core at index 5. Similarly, display categories and qi-cost bands differ. A useful authoring check would validate display text against the same selected predicates instead of creating another parallel description table. L272143-272180, L79600-79748, L136400-136527.

## Events combine authored constraints and generated context

Room registration rejects missing IDs/pools/row arrays and duplicate IDs. Selection filters by minimum/maximum depth, falls back to the whole pool if no depth match exists, then performs a weighted pick using an optional RNG provider. That fallback can weaken a supposed depth restriction, so it should be deliberate in any adaptation. L202912-202973.

Templates include timed chest collection, qi toll, resistance hazards and combat clears. Objective build callbacks place foes, treasure, gates or puzzle parts using supplied room/depth context. This is a middle ground between fixed rooms and unrestricted procedural generation. L203005-203063, L203184-203255. No full room distribution, reward economy or hidden-site story catalogue is claimed.

Authoring suggestion is a PROPOSAL: validate IDs, prerequisites, reachable objectives and outcome effects before shipping, with an explicit decision on fallbacks. Preserve sealed YAIRPG truths in their discovery route; none were authored in this research pass.
