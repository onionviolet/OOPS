# theory-of-magic: aspect backfill, 2026-10-14

## Corrections

Same community revision as the prior pass. No contradiction of the Hall-preserves-characters finding was found. Extend prior save/offline omissions: indexedDB character/Hall stores have a localStorage fallback; offline overflow is banked and later consumed through turbo updates. GEvent.rand has an empty branch in the inspected unlock method, so declared random event data is not proof of a working randomized scheduler.

Static reads only. **Shown** means inspected executable code/data; **stated** means page or declaration; **inferred** means the proposed YAIR interpretation. Covered means the bounded aspect question has source support, not that every record was read. Partial/unread limits stay explicit. Sources are pinned in [TOOLING](TOOLING.md); complete acquired files and raw text remain under `/Users/weiwei/.codex/research/bf-idle-src`. No code/assets/text are copied into YAIR.

## A01 Dialogue and conversation

Status: partial.

Shown: event/quest descriptions and encounter narration emit log messages; GEvent unlock can change state/loot through the item mechanism. No speaker/portrait/reply-tree schema established in inspected families. All quest and encounter records remain unread.

Sources: [events.json](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/events.json); [quests.json](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/quests.json); [gevent.js](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/items/gevent.js); [events.js](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/events.js)

PROPOSAL: Use a narrated work consequence with a real state receipt rather than assuming every event is a conversation. Owner: docs/worlds/PROGRESSION_AND_ASSEMBLY.md; src/data/dialogues.js; src/life_record.js.

## A02 Narrative delivery

Status: covered.

Shown: typed log categories record unlocks, loot, titles, combat, retreat and events. Unlock buffering can bundle multiple items into one summary with details. This supports progression narrative, not a full branching social campaign.

Sources: [log.js](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/log.js); [events.js](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/events.js); [events.json](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/events.json); [titles.json](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/titles.json)

PROPOSAL: Bundle related unlock notices while keeping individual known facts inspectable. Owner: docs/worlds/PROGRESSION_AND_ASSEMBLY.md; src/data/dialogues.js; src/life_record.js.

## A03 Implementation architecture

Status: covered.

Shown: Vue reactive state, JSON data loader, typed item classes, inventories/composites/modules, and game/system event buses. Main update evaluates tech tree then timed state updates. Content merges into instantiated objects rather than being only hard-coded UI.

Sources: [package.json](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/package.json); [game.js](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/game.js); [dataLoader.js](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/dataLoader.js); [gameState.js](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/gameState.js); [events.js](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/events.js)

PROPOSAL: Extend existing registries and one simulation clock; avoid a parallel wizard engine. Owner: docs/TECHNOLOGY_AND_PROGRESSION.md.

## A04 Save and persistence

Status: covered.

Shown: JSON state stores version, persistent character ID, lastUpdate, item state, slot IDs, gear, combat and exploration. Profile saves active characters separately from Hall. IndexedDB stores chars/Hall; localStorage is marked fallback. Index exports character or full Hall and routes imported shape accordingly. Legacy resave exists; no all-version semantic migration, quota safety or atomic multi-character import proved.

Sources: [gameState.js](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/gameState.js); [profile.js](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/modules/profile.js); [persist.js](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/modules/persist/persist.js); [persist-db.js](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/modules/persist/persist-db.js); [persistLocal.js](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/modules/persist/persistLocal.js); [index.js](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/index.js)

PROPOSAL: Keep character identity, shared meta and authored definitions separate in persistence. Owner: src/save_files.js; src/save_compatibility.js.

## A05 AI and NPC behavior

Status: partial.

Shown: combat uses actors, actions and target selection; minions distinguish owned inventory from active allies, keep rules and capacity. Full target policy, spells and autonomous NPC schedules unread.

Sources: [combat.js](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/composites/combat.js); [minions.js](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/inventories/minions.js); [monsters.json](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/monsters.json)

PROPOSAL: Distinguish a recruited ally from one assigned to the current fight. Owner: src/npc_lives.js; world CAMPAIGN.md.

## A06 UI and information design

Status: covered.

Shown: separate resource/running panes, filters, skill progress and Hall switching. Reactive item state powers progress/capacity views. Desktop layout/keyboard use not exercised.

Sources: [panes](https://gitlab.com/mathiashjelm/arcanum/-/tree/a2632d2edf3e07e9168fff81167b11f2792e9197/src/ui/panes); [filterbox.vue](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/ui/components/filterbox.vue); [hall.vue](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/ui/hall/hall.vue); [skill.vue](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/ui/items/skill.vue)

PROPOSAL: At 1440x900, keep work, resource capacity and known study options independently visible. Owner: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md.

## A07 Content authoring and modding

Status: covered.

Shown: JSON catalogues, module selection and parser/tech-tree instantiate requirements and values; runtime classes supply behavior. Full extension ordering and validation rules remain partial. No arbitrary public mod-loader contract established.

Sources: [dataLoader.js](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/dataLoader.js); [techTree.js](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/techTree.js); [modules.json](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/modules.json); [parsing.js](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/modules/parsing.js)

PROPOSAL: Author techniques with IDs, explicit prerequisites and named effect consumers. Owner: docs/TECHNOLOGY_AND_PROGRESSION.md.

## A08 Balance and numbers

Status: partial.

Shown: value/property/stat classes and authored resource caps/skill/furniture modifiers. Furniture changes useful tasks/capacity, not only flavor. Every growth curve, combat modifier and RNG policy remains unread.

Sources: [values](https://gitlab.com/mathiashjelm/arcanum/-/tree/a2632d2edf3e07e9168fff81167b11f2792e9197/src/values); [skill.js](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/items/skill.js); [resources.json](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/resources.json); [furniture.json](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/furniture.json)

PROPOSAL: Make a bench change one actual task or capacity with a named source. Owner: docs/TECHNOLOGY_AND_PROGRESSION.md.

## A09 Time and scheduling

Status: covered.

Shown: oversized wall-clock delta banks overflow in offlinetime; turbo consumes that store with coarse ticks and a fractional remainder. Tech-tree reevaluation occurs between coarse updates. This is not a proven exact fine-tick replay or unlimited offline production.

Sources: [game.js](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/game.js); [timer.js](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/timer.js); [runner.js](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/modules/runner.js)

PROPOSAL: Document coarse versus fine time semantics before choosing an absence policy. Owner: src/feature_expansion_work_plan.js; src/simulation.js.

## A10 Onboarding and reveal

Status: covered.

Shown: prerequisites progressively unlock tasks/classes/furnishings; combat tutorial is a named module. Complete early-to-late class closure unread.

Sources: [techTree.js](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/techTree.js); [classes.json](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/classes.json); [tasks.json](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/tasks.json); [combattutorial.json](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/modules/combattutorial.json)

PROPOSAL: Teach a technique by ordinary work, a useful object and a visible unlock. Owner: src/native_discovery_policy.js; src/observation_channels.js.

## A11 Little touches

Status: covered.

Shown: grouped unlock logs, filter/hide controls, progress and stop/rest/resume feedback. No measured accessibility or animation claim.

Sources: [events.js](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/events.js); [filterbox.vue](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/ui/components/filterbox.vue); [running.vue](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/ui/panes/running.vue)

PROPOSAL: Let a blocked task explain its missing stock and retain its intended target. Owner: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md.

## A12 Other systems

Status: partial.

Shown inventory: Hall, combat/minions, exploration, spells/loadouts, generated equipment, enchantments, housing, professions, potions, resources, titles and modules. Hall does not force destruction of the previous character. Full magic/combat and seasonal modules remain unread.

Sources: [hall.js](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/modules/hall.js); [explore.js](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/composites/explore.js); [itemgen.js](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/modules/itemgen.js); [spells.json](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/spells.json)

PROPOSAL: Keep learned method, crafted carrier and current equipped function distinct. Owner: docs/worlds/ABILITY_AUTHORING.md.

## Remaining scope

All spells/minions/combat actions, complete class/quest progression, module load order, remote persistence and fine/coarse tick equivalence remain unread. Source matches prior community snapshot, not a user installation. No install needed.

All proposals use the existing actor/stock/job/clock/knowledge/save owners. Preserve reasonable alternative paths, repeatable solo play, one realm/one prestige first milestone and canon-specific rules. UI target for future packets is 1440x900 laptop; mobile optimization deferred. No source/build/runtime/save/human acceptance gate is claimed passed.
