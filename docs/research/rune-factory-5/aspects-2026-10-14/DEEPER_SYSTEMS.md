# Three deeper systems by payoff

These were adjacent discoveries beyond the five feature questions. All takeaways are PROPOSALS. Tables are shown; native application is inferred and unverified.

## D1. Recipe knowledge has a supply chain

Sources: `RecipePanShopDataTableArray` six shop offers, `RecipePanCountDataTableArray` eight stock-limit rules, `RecipeData` with separate recipe-release IDs, `RF5PlayerData` daily recipe-pan counters. All tables live in master bundle `382aa2501e16ef256258fc102a8fcea5.bundle` and are preserved privately.

Implementation: the shop offer joins an item, shop type, builder-release ID and price. Stock quantity is another table keyed by shop type and builder-release ID. Recipe entries separately name their skill field and release flag. This gives at least three independent states: supply offered, recipe known and proficiency/resource context. The actual learning selection and refresh/reset policy remain unread. Shop quantities do not prove a lifetime learning limit.

YAIRPG payoff: P03/P04 can quote a real reference acquisition route while keeping learned knowledge after the object is gone. Reuse current lesson/technique owners; do not turn book ownership into knowledge. Acceptance would acquire a reference, learn and use one application, lose the reference and retain knowledge, then reload/import it.

## D2. Co-work leaves a durable mark on the crafted result

Sources: `DualSmithActorDataTableArray` 26 actor profiles, `DualWorkDataTableArray` eight gauge/lottery rows, `DualWorkSmithDataTableArray` eight bonus rows, `DualWorkConst.EnableLevel`, metadata `EquipItemData` co-work fields.

Implementation: actor bonus preferences are separate from relationship-indexed co-work parameters and minigame gauge tuning. Equipment instances retain co-work actor, love level, bonus type and parameter. This supports an inference that a collaborator's contribution can be reconstructed after the encounter, rather than re-reading their current relationship. Exact selection, scaling and minigame success logic remain unread. A higher probability field is not proof of a better final item without the consumer.

YAIRPG payoff: one original optional workshop assistance route could retain the collaborator and accepted terms when they actually affect a useful result. Owner: production/characters and save review. Keep solo alternatives reachable; no mandatory timing minigame is proposed. Acceptance must change a real crafted effect and retain it after partner availability changes and through save/import.

## D3. NPC presence is authored time/weather data

Sources: two sampled `NpcLifeCycleTable` assets for one NPC, `Date_001` and `Def_000_h1`, in bundles `85e23e8af32064aa314a2943ea4b0bba.bundle` and `756bd277b6286f474fb3fc5fcda5f03b.bundle`; catalog of other schedules and 30 lottery assets; metadata `NpcSaveParameter` location/lifecycle fields.

Implementation: each sample names NPC identity, a time list, a weather list and time data. Persistent NPC records also retain place, lifecycle state and event context. The whole schedule corpus, lottery parser, conflicts and fallback behavior remain unread. Two samples establish an authoring format, not a live-world planner or reliable teacher attendance.

YAIRPG payoff: P03/P19 could disclose the next known teacher/partner window using current actor-presence facts and calendar, while alternative study routes remain useful. Owner: skill mechanisms, characters/events. Do not add autonomous population simulation or offline progression on this evidence. Acceptance would reach a natural availability window, complete the useful interaction, then show a truthful blocker outside that window.
