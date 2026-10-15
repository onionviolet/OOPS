# Realms and what survives travel

2026-10-14. SHOWN means inspected installed data or a named native trace. STATED means the shipped help or interface describes behavior. INFERRED means our interpretation. No game was run.

Source root: `~/Library/Application Support/Steam/steamapps/common/Siralim Ultimate/SiralimUltimate.app/Contents/Resources/`. Full CSVs with all languages and original text are retained privately in `~/.codex/research/mw-siralim/extract/localization/`. Row locators count the CSV header as row 1 and parsed multiline records as one row.

## The realm contract

STATED: a realm is a generated dungeon with its own tiles, encounter objects, creature pool and patron god (`localization/codex.csv`, rows 143-150). Depth selects enemy/reward strength and gates progression; realm type selects the content family. NATIVE_TRACE N12 recovers a nonlinear enemy-level curve with separate difficulty/mode terms, qualified as static inference. Instability is an optional 0-5 axis adding encounter mixing, fusion and more dangerous properties. These axes are distinct. A second planet with its own power system is not demonstrated merely by changing realm type.

SHOWN: `game.ios` ROOM has one generic `realm` room and separate boss and Nether-room templates. Vocabulary rows 386-415 name 30 realm types. This is evidence for shared machinery with authored variation, not thirty separate engines. `scr_GetRaceArrayByRealm`, `scr_RealmGetProperties`, `scr_RealmHasProperty` and `scr_RealmPropertyGetValue` have named native implementations; see NATIVE_TRACE for what was actually decoded.

STATED interface: shrine steps expose depth, enemy level, maximum reached depth, realm type, active properties, hidden-property count, fused enemy race, creature pool and item bonus (`ui.csv:606-632`). A random realm can be free while deliberate realm selection or property reroll costs resources. The useful pattern is a destination quote before commitment, with declared unknowns. It is not an all-seeing planner.

## Concrete place differences

| Place family | Inspected evidence | Different action or encounter | Limit |
|---|---|---|---|
| Forgotten Lab | `OBJT`: `obj_lab_machine1..3`, battery/robot-part/schematic objects; `overworld.csv:372-377,397-405` | Find a battery for a machine; collect parts and assemble a machine; schematics report exhaustion; machines may become enemies | Authored text and object identities, not all caller conditions |
| Gambler's Hive | `obj_hive_craps`, roulette, slots, card tables and house-of-cards objects; `overworld.csv:406-408` | Gambling props and an encounter tied to disturbing constructed cards | Probabilities, prices and every payout unread |
| Astral Gallery | `obj_gallery_largechest`; `overworld.csv:360-363` | Animate art, encounter a living statue, chase a moving brush | Exact chase/reward state unread |
| Damarel | `overworld.csv:364-371` | A clock offers aid, wealth, combat training or refusal | These are authored choices, not proof of calendar time travel |
| Forbidden Depths | `overworld.csv:378-401` | Musical sequence, offering pit, local favor response, creature hazards | Notes and full text retained privately; not a universal rhythm engine |
| Arachnid Nest | `overworld.csv:313-317` | A cocoon can hide treasure, rescue, rare visitors or an ambush | Exact probability and spawn scope unread |
| Overgrown Temple | `overworld.csv:410-411` | A mirror-like hostile party encounter and vegetation that becomes a threat | Enemy copy rules unread |
| Blood-themed places | `overworld.csv:210,258,409`, blood-object identities | Interacting with local ritual props can start encounters | Not evidence of independent persistent societies |

These examples establish more than cosmetic renaming but do not complete every realm's encounter audit. The full 30-name census and native race-pool request receipts are retained privately. The unread table keeps the remaining realm-by-realm join open.

## Carry layers

| Layer | STATED or SHOWN basis | What crosses / what stays local |
|---|---|---|
| Traveler and roster | `codex.csv:194-198,211-214`; save field names in STRG 31617-31754 | Character specialization, trained creatures, items, collections and resources belong to continuing progression. A creature's body, secondary class and traits are separately meaningful. Exact native retention is bounded in NATIVE_TRACE. |
| Castle | `codex.csv:168-171` | Team refit, smithing, projects and a decorated home connect expeditions. Utility NPCs share the housing/decor interface with purely visual props. Home is useful between trips. |
| Patron relationship | `codex.csv:151-154` | Favor rank unlocks a patron shop and benefits; patron-specific emblems are spending stock. This is institution standing, not a proved person-to-person affection simulation. |
| Realm-local benefit | `codex.csv:148` | A god's blessings operate in its own realm. Identical next-battle benefits are stocked for later battles rather than magnified indefinitely. |
| Expedition progress | `codex.csv:144-147`; `ui.csv:606-632` | Realm quest and chosen properties describe a visit. Maximum depth is a progression frontier. Do not equate fresh dungeon generation with remembering a changed lived destination. |
| Auxiliary portals | `codex.csv:149-150`; ROOM Nether templates | Side areas offer extra opportunities, including creature recruitment. Entry threshold in this installed help is depth 30. An older community depth guide is not the build's authority. |

## YAIRPG reading

PROPOSAL: extend P14 with authored place actions over a shared command system (K2/K5/K10/K13), P05 with an explicit traveler/local/visit carry matrix (K15/K18), and P07 with issuer-specific standing and services (K7/K8/K21). Reuse actual `world_instances.js` instance and visit identities. A Siralim-style fresh dungeon may be a renewable excursion attached to a persistent place; it must not reset that place's residents, custody or quest receipts.

PROPOSAL: extend P04/P11 with a shrine-style travel quote: disclosed laws, expected hazards, cost, known arrivals and an explicit unknown count where appropriate (K11/K14/K15/K30). Hidden content stays hidden. First proof target is rebuilt desktop 1366x768 with the ordinary travel action and unchanged cargo after refusal. No mobile optimization or new worlds required by this report.
