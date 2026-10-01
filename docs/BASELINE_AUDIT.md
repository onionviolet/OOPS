Historical v0.5 baseline audit. The current foundation is v0.6; see [V06_MIGRATION.md](V06_MIGRATION.md) for adopted source and compatibility evidence.

# YAIRPG baseline audit

Historical prototype audit: Jade Hollow was retired from active content on 2026-10-01. Current preservation behavior is in PROJECT.md and `src/save_compatibility.js`; the cultivation descriptions below record the earlier slice.

Date: 2026-09-30 (America/New_York). Upstream game version: v0.5.5.30.

## Systems and integration points

| System | Existing implementation | Expansion consequence |
|---|---|---|
| Main loop | `src/main.js`: `run`, `update`, one timed tick per second, separate combat timers, training and gathering cycles | Cultivation runs on the same tick, with one ordinary activity at a time |
| Skills | `src/skills.js`: XP curves, levels, parent skills, milestone stats and XP bonuses; `character.js` combines actual and bonus levels | Meditation, Weightlifting, Combat, Herbalism, Cooking and Alchemy retain ordinary XP and gain distinct cultivation uses |
| Gathering/jobs | `activities.js` defines shared activities; `locations.js` defines availability, tool requirements, yields, speed and XP | Dewleaf is harvested through existing Herbalism, with its sickle requirement and skill scaling |
| Crafting | `crafting_recipes.js`: categories, availability, ingredient alternatives, station tiers, probability and quality; `main.js/use_recipe` consumes inventory and awards XP | Tea and pellets are actual Cooking/Alchemy recipes, not separate pretend inventory counters |
| Combat | `enemies.js`, `combat_stances.js`, `main.js`: encounter timers, stamina, accuracy, equipment, loot and kill counts | Combat mastery improves body conditioning; endurance trial rewards Combat XP. Prototype trial is a deterministic timed challenge, not an enemy encounter |
| Travel/environment | `locations.js`, `pathfinding.js`, time/weather modules; safe locations and combat zones; directed travel graph | Jade Hollow is a safe location connected to Village with a workshop and training/gathering |
| Quests/dialogue | `quests.js`, `dialogues.js`, conditions/rewards, quest event processing in main | Preserve base quest state. Mentor quests and branch rewards remain proposed, not implemented |
| Reputation | Character region values and `reputation.js`; rewards and quests can change reputation | Prototype shares Village market region. No custom faction is implemented yet |
| Inventory/storage | `inventory.js`, `items.js`, `storage.js`: item templates and JSON inventory keys, carried and stored quantities | New items use ordinary templates and inventory. Rebirth clears only the three cultivation item IDs from inventory/storage |
| Races | `races.js`, character creation; gameplay bonuses are commented out upstream | Do not count races as an existing progression path |

## Save contract

`main.js/create_save` creates a JSON object; manual and automatic saves write it to origin-scoped localStorage. Live keys are `save data` and `backup save`; development has its own keys (see constants in source). Autosave occurs every 60 ticks and backup every 3600. Export uses base64 JSON. Import stores the decoded payload and reloads. Equipment and items are reconstructed from definitions; character stats are recalculated, and skill levels are replayed from total XP. Locations, activities, recipes, quests, flags, reputation, time, preferences and counters are persisted. Current enemies are not persisted.

The additive `cultivation` property has `schema: 1`, resources, realm, trial progress/seal, discovered status, rebirth count, selected legacy and sickle-loan flag. An absent property initializes a fresh cultivation journey while base progress loads normally. Unsupported cultivation schemas block saving rather than overwrite unknown data. Cultivation exports/imports travel with the normal save; reverting to upstream is not a supported roundtrip because upstream drops unknown fields when saving.

A browser reload exposed Meditation's zero visibility threshold: replaying saved XP before its unlock/skill bar existed failed in the upstream display path. The fork restores the Meditation unlock before XP replay. The original saved payload recovered after this correction.

There is no elapsed-offline-time replay in the inspected upstream load path. The prototype likewise pauses while closed and resumes an existing activity/trial after Play. Background timer behavior follows upstream HackTimer; wall-clock catchup is future work. Do not describe this as verified offline earnings.

## Reproducible build

Node >=22.13, pinned esbuild 0.25.10 and checked-in npm lockfile:

```sh
npm ci
npm test
npm run build
npm run serve
```

Serve binds only 127.0.0.1:8123. The browser uses `dist/bundle.js`, not raw source. Build fingerprints the JavaScript and CSS URLs without changing the upstream save-version parser. Keep MIT attribution. No download/save export in `/Users/weiwei/Downloads/Games/` was read, modified or used for testing.

## Baseline evidence

The original prebuilt game loaded a fresh character with bread, pants, money and the Lost memory quest. Play and the village elder dialogue opened successfully. Rebuilt source loaded on the same isolated preview origin; the additive migration then loaded that upstream-shaped development save. This is a smoke baseline, not completion of upstream quests or exhaustive testing of all content.
