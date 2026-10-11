# D1 TEST FIXTURE saves

Generated heroes for [the A1 browser acceptance loop](../CHECKPOINT.md#A1-single-remaining-playable-acceptance-gate-for-weibao). These skip preparation and do not establish natural progression or balance acceptance.

## Import steps

1. Open the current rebuilt game on a **fresh test origin or separate fresh browser profile**. Keep personal-save origins separate. Start the new game and click PLAY if needed.
2. Open Options, choose **Import**, and select `TEST-FIXTURE-D1-smelting-9.txt` from this directory. Let the import compatibility check finish and the game reload. Click PLAY if shown. The character name must read `TEST FIXTURE D1 Smelting 9`.
3. In Village, choose the native crafting action, then Smelting. Confirm Springsteel ingot is unavailable. Smelt **one Iron ingot**, using five supplied Iron ore and one Coal. This earns Smelting 10 and unlocks Springsteel. Continue A1b by smelting Springsteel, then Crafting → equipment → Amulet with the resulting ingot.
4. Travel from Village to Shack for A1c/A1d. Open the field workshop panel: baseline drive packing is one kit for three drive, while an equipped Springsteel brace quotes two kits for two drive. Recovery is available in Shack; the six-unit reserve is finite. Focus packing is also available for the unrelated-quote comparison.
5. Use `TEST-FIXTURE-D1-smelting-10.txt` on another fresh test profile to check already-earned milestone reconstruction, or restart setup on the same disposable test origin. Continue A1e with exports of your generated test hero only.

**Import the `.txt` files.** The `.json` files are readable decoded companions and are not Import payloads. Import replaces the save at its target origin, so use a disposable test origin/profile throughout.

## What is set

| Setting | Smelting 9 fixture | Smelting 10 fixture |
| --- | --- | --- |
| Name | TEST FIXTURE D1 Smelting 9 | TEST FIXTURE D1 Smelting 10 |
| Smelting XP | Native level-10 threshold minus 1 XP | Exact native level-10 threshold |
| Springsteel saved availability | Locked | Locked, deliberately; native load reapplies earned level-10 unlock |
| Crafting | Level 10 | Level 10 |
| Setup UI flags | Hero created; native crafting unlocked | Same |
| Inventory | 20 Iron ingots, 20 Steel ingots, 30 Coal, 50 Iron ore, 30 Rough wood logs | Same |
| Money | 1,000 native coin units | Same |
| Native location | Village, with its unlocked tier-1 Smelting/Crafting station | Same |
| Travel access | Village and Shack unlocked; directly connected | Same |
| Field workshop | Membership through the supplied craft route; workshop assembled in Shack | Same |
| Load-bearing Step (`field.load_step`) | Taught by craftsman; practiced to mastery 2 | Same |
| Drive | Learned, recovered to 6 units, strain 0 | Same |
| Focus | Learned, recovered to 4 units, strain 0 | Same |
| Springsteel ingot, brace, survey kits | None supplied; make them in the browser | Same |

Hero XP and other native equipment remain at fresh model defaults. Native Crafting/Smelting parent XP and earned rewards are produced by the real skill/reward code. The field setup uses actual enrollment, craft membership, teaching, practice, energy learning/recovery, commissioning, reporting and assembly commands, not invented facility flags. Its resulting field history is generated test history, not campaign play. Native time remains the fresh model time; simulated setup time is held in expansion state. No personal save is an input.

## Regenerate and verify in Node

From the repository root, with the existing dependencies installed:

```sh
node docs/gm/d1-alloy-equipment-2026-10-07/fixture/generate.mjs
```

The script writes both decoded JSON and `YAIR-UTF8-1:` text exports, plus `VERIFICATION.json`. It temporarily bundles source using esbuild and deletes that temporary bundle afterward. It uses `main.js`'s **actual `create_save`**, `save_files.js`'s **actual `encodeSaveFile` and `importSaveFile`**, and **actual `main.js load`** for preflight, the loader also invoked by the browser import probe. Each generation/preflight gets fresh definitions. Import writes only to an in-memory Map. It also checks one native iron-smelt attempt, including a failed roll, earns the level-10 milestone, and checks the native-context baseline workshop quote is eligible in Shack. These checks mutate only disposable loaded heroes, not the fixture files. Source files are never edited, and browser storage is forbidden in the harness.

Presentation exports and DOM surfaces are inert Node stubs except the startup biography body described below. The harness removes browser startup only in its temporary bundle and uses a forwarding bridge for main/model circular dependencies. It rejects native-loader warnings like the browser probe does. This verifies native serialization/import and model reconstruction; it does not exercise the browser iframe, file picker, UI rendering, Web Locks or actual browser storage.

## Remaining browser gate

These fixtures cannot set human acceptance, prove native UI visibility, eliminate craft quality variation, or prove browser save/reload/export/import. Run the complete A1 loop. The saved name and filenames carry `TEST FIXTURE`; no unsupported custom save metadata is required. Equipment facts are derived when the brace is equipped and are not preseeded. Workshop recovery costs and pending-job rules remain native.

## Fixture clock startup repair · 2026-10-08

The original fixtures set `is_hero_created` but saved an empty biography. PLAY called the real `fill_character_bio()` and failed on the missing race before starting the update loop. Direct travel could still advance time. The earlier Node harness stubbed that presentation function and therefore missed startup failure.

Regenerated fixtures now contain the native default biography: Human, Adult, Ambiguous, Average height. Re-import the new `.txt`; reloading an old import keeps its incomplete biography. In a disposable clean profile, press PLAY and verify Village ticks before any travel or work, then save/reload and check again. No road response is required to start time.

```sh
node docs/gm/d1-alloy-equipment-2026-10-07/fixture/diagnose-clock.mjs --expect-ready
```

The diagnostic uses the same Import/preflight/native loader, the actual `run()` and extracted `fill_character_bio()` body, in-memory ownership/storage and captured timer scheduling. It compares completed vanilla creation to both fixture imports, records every `update_timer` gate and the plan branch, checks one native/calendar tick in Village, then saves/reloads into fresh definitions and repeats. `CLOCK_GATES_BEFORE.json` preserves the original startup failure; `CLOCK_GATES_AFTER.json` records clear gates and passing startup/ticks/reloads. Cosmetic tooltip builders and the rest of presentation remain inert. These are Node proofs; the repaired browser loop remains Claude's acceptance gate.

The generator also retains ten ticks in Shack, road-offer/location checks, baseline job completion and native equipment-change rejection while occupied. No gameplay source was changed.
