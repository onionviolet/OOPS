# Content and save digest

## Installed provenance and recovery

Shown: Steam app 3779340 install has an embedded Godot PCK at byte 96,775,168 in a 205,574,104-byte Windows executable. PCK format 3, engine header 4.5.1, flags 2. Directory and all 1,764 entry MD5s validated. Executable SHA-256: `e459d12477e1e57f46cdfbb9cbf84bffda8ee700b2f9a4425c18d8702ae4652d`. `models/game/game.gd` identifies `v1.2.20 Full Version`. These identify this snapshot, not every platform build.

All 234 GDSC v101 buffers were decoded from ZSTD, identifiers, Variant constants and token streams. Consumption reached the end of each buffer. The empty old_player buffer and an addon NodePath required small decoder extensions. Three plain `.gd` entries are also present; the RebirthWindow one is empty. No extracted project or script was run. Binary `.scn`/`.res` files were not converted.

## Table inventory

Shown: 75 JSON files, all valid; 651 rows under `content`, including eight resource descriptors. Separate civilization definitions have eight entries. Inventory values count installed data, not reachable gameplay.

| Category | JSON files | Content rows | Organization |
|---|---:|---:|---|
| Jobs | 6 | 47 | Five profession groups |
| Trainings | 6 | 17 | Mental, physical, worldly, arcane, temporal |
| Skills | 11 | 40 | Ten skill groups |
| Explorations | 13 | 170 | Twelve region/activity groups |
| Lifestyles | 6 | 50 | Home, food, transport, companions, items |
| Spells | 5 | 20 | Four schools |
| Stories | 4 | 177 | Lore, job, life |
| Technologies | 9 | 80 | Eight technology tiers |
| Temporals | 5 | 32 | Four purchased-power tiers |
| Redeems | 2 | 10 | Authored code rewards |
| Resource descriptors | 5 | 8 | Four reset categories |
| Civilizations | 1 | 0 | Eight separate civilization definitions |
| Automations/statistics | 2 | 0 | Navigation metadata |

`models/AssetLoader.gd` reads `assets/<category>/data.json` for labels, groups and requirements, then each subgroup's `content.json`. Constructor functions map category rows into distinct model classes. Effects target overall, category, subgroup or individual IDs and use declared scaling. Group and content IDs also drive image paths and save lookup. Mod loaders can replace/add entries and place them before a named ID; no mods were loaded or run by this audit.

Common row fields include IDs as map keys; names/descriptions; hidden/lockable; requirements/effects; numeric XP/cost data. Exploration adds points, danger, repeat settings, action type, rewards and forced-regression flags. Temporal adds cost/max level; Spell adds slot size; Story adds popup and achievement fields. This is not one universal generic realm record.

## Future-shaped resource data is not live proof

`assets/resources/data.json` labels rebirth, temporal, ascendant and eternal categories. The installed content names Gold, Renown, Miracle, Happiness, Lifespan Day, Temporal Lifespan Day, Temporal Essence and Divinity. `AssetLoader.CONSTRUCTORS` does not initialize resources as an action category. Live wallets are explicit player classes. No ascension operation or Divinity player wallet/serializer was found. The descriptor category claiming a resource disappears on ascension cannot establish a shipped third reset layer. Temporal Essence actually uses a special persistence/award handler. Happiness and lifespan benefits are derived, not fungible region currencies.

## Save envelope and shape

`models/game/Save.gd::get_save_text` serializes a dictionary to JSON, GZIP-compresses UTF-8 bytes, then base64-encodes the bytes. It writes text to `user://savedata/save.sav`. It also knows `user://saves/save.json` and a legacy user-dir mode. Save version is a display version string, with per-model legacy/default handlers rather than a demonstrated ordered schema-migration pipeline.

Top-level fields cover player; each active content category; story/technology/Temporal/redeem state; statistics; automation; loadouts; last-played/bank metadata; UI options; pause-on-reset and speed-reset preferences. Category state is nested by subgroup, then content ID. Typical level state has XP, current level, cycle best and lifetime best. Story/technology state has current unlock and was-unlocked. Exploration adds completion scopes and timings. Lifestyle saves include enhancement level per category.

`player_serialization.gd` keeps life/death and force-regress flags, lifespan components, Gold/Renown/Temporal Essence/Miracle, and current job/training/exploration/lifestyle/spell selections. Equipped action references use type plus ID. Legacy numeric IDs, flat lifespan fields and old resource forms have loader branches. No realm-state map or trait seed appears in this player envelope.

## Save integrity limits

Shown: `save_data` writes a temporary file, backs up an existing save, then renames the temporary file. Loading tries backups and legacy base64 JSON. Parse requires a dictionary. This is useful recovery plumbing, not proof that every malformed field is rejected or that every interrupted write is safe. Nested field indexing and per-model defaults need their own fixtures.

Shown: the autosave controller requests a threaded save every ten elapsed seconds and skips overlapping saves through a saving flag. Thread scheduling and concurrent snapshot behavior were not tested. No user save was read, decoded, fabricated or rewritten.

P8: preserve YAIRPG's own save authority and compatibility rules. Borrow stable IDs, domain-specific retention and backup intent; do not copy proprietary tables, assets, prose or source. Validate every declared field has a runtime consumer and document future/inactive fields separately.
