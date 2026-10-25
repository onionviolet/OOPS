# W3 tooling notes: OG1 to OG3, 2026-10-23

Tool work for [OPEN_GAPS](OPEN_GAPS.md) OG1-OG3. Static reads only. Nothing was
executed or installed, nothing committed. Large outputs live under
`private/` (gitignored).

## OG1: Godot 4.3 (bytecode v100) in the shared decoder: done

- Edited in place: `~/.codex/research/idle-reincarnator/tools/decode_gdc.py`
  (writable). Backup of the old file: `decode_gdc.py.v101-only.bak` beside it.
- Change: a `SUPPORTED=(100,101)` table replaces `assert version==101`, and v100
  reads one extra header u32 (the header has five counts, not four; the token
  count is the last). The token enum in `gdscript_tokenizer.h` is identical
  for both versions. This is the same patch the Stacksmith and POTION passes
  made in scratchpad copies.
- Registry: `docs/TOOL_REGISTRY.md`, "Godot 4 bytecode" row (hunk only).
- Done check, run 2026-10-23, `python3 decode_gdc.py <pack> <out>`:

| Pack | Godot | Result |
| --- | --- | --- |
| Cartographomancer (`explore/cartographomancer/pack`) | 4.3, v100 | 90 decoded, 0 errors |
| Alchemyst Apprentice | v100 | 17 decoded, 0 errors |
| CHROMA | v100 | 32 decoded, 0 errors |
| Stacksmith | v100 | 35 decoded, 0 errors |
| Hacksmith (regression, v101) | 4.7 | 28 decoded, 0 errors |

Spot check: Cartographomancer `EditableMap` decodes to readable source
(fields, `CreateImageIfNecessary`). Outputs are in the scratchpad, not the
repo; rerun to regenerate. Follow-ups this unlocks: OG7 (CHROMA and Alchemyst
Apprentice method bodies) and the Cartographomancer logic row in BATCH_EXPLORE.

## OG2: newer dumpers for metadata v39 / v108 and wasm: report only

`scripts/toolsets.py doctor --probe` only checks local paths and offline
probes (all launch tools ready); it does not check upstream. Versions were
checked against GitHub releases.

- Il2CppDumper: installed build is the latest, v6.7.46 (2024-07-06). It has had
  no release since. Open upstream issues for v39 (#887, #898, #903, #925). It
  rejects v39 and v106 here. It does handle wasm for v24.2, v29, v31 (OG3).
- Cpp2IL: installed `2022.1.0-pre-release.21` (2026-02-22) is the newest
  release. Its notes add metadata v35, 38, 39, 104, 105, 106 (up to Unity
  6000.5.0 alpha) and wasm support with `--wasm-framework-file`.
- Not found anywhere: v108. Pre-release 21 stops at 106.
- Tried: Cpp2IL pre-21 on Levers of Democracy (metadata v106, Unity 6000.0,
  wasm plus framework.js, forced Unity versions 6000.0.30f1, 6000.1.0f1,
  6000.2.0f1, 6000.3.0f1). All four died in `LibCpp2IL` at
  `GetFieldDefinitionFromIndex` (IndexOutOfRange) while reading metadata. The
  exact Unity version is unknown, so this may be a version mismatch rather than
  a hard limit; not resolved.
- Verdict for the OG2 done check ("one of these builds yields method bodies"):
  not met. Dumper output on wasm has empty method bodies by design. Slime
  Reborn, Surviving Magic Academy, Terraformental (v39/v108) were not retried.
  Nothing was installed.

## OG3: Il2CppDumper on saved metadata

Command: `scripts/toolsets.py run il2cpp-dumper -- <wasm> <global-metadata.dat> <out>`.
The saved folders held only `global-metadata.dat`; Dumper also needs the wasm,
so three builds' wasm were fetched from the HTML5 CDN (web assets, 5-6 s
spacing, no 429s): Looper `html/14528628` (54 MB), Astroecologist `html/5414258`
(14 MB), Levers of Democracy `html/18126270` (47 MB wasm, 43 MB data, 0.3 MB
framework). Path Past already had its wasm (`b.wasm.gz`, actually raw wasm).

| Build | Metadata | Result | Output |
| --- | --- | --- | --- |
| Looper | v31 | OK | `private/magic/looper/dump/dump.cs`, `stringliteral.json` |
| Path Past The Mountain | v29 | OK | `private/explore/pathpast/dump/` |
| Astroecologist | v24.2 | OK | `private/explore/astro/dump/` |
| Stoneheart Archive | v39 | FAILED (not run): Dumper does not support v39 and no wasm was saved. Cpp2IL pre-21 lists v39 but needs the wasm (about 100 MB data build, not fetched). Fallback: string scan | `private/explore/stoneheart/metadata_strings.txt` (112,536 identifier strings, no type attribution) |
| Levers of Democracy | v106 (Unity 6000.0) | FAILED: `Metadata file supplied is not a supported version[106]`; Cpp2IL also failed (OG2). Fallback: string scan | `private/economy-levers/web/metadata_strings.txt` (62,739 strings) |

All dumps give names, field offsets and RVAs only. Method bodies are empty
(wasm). So they settle "what exists and how it is typed", not formulas.

### What the dumps show

- **Looper** (`Assembly-CSharp`, 82 types). The consequence key's shape is
  now readable: `Clause` holds `Effect`, `Aspect`, `Target` (all `RuneEnum`),
  with `Clause.Compare(Option)`. `Job` has `customer`, `duration`, `task`,
  `requirements` (list of `Requirement`: `requirement`, `failed`, `options`),
  `negations`, `negatives`. `Spell` is `job` plus `clauses`. `Grade.GradeSpell`
  takes a callback `(Spell, float, float, bool)`. `RuneEnum` has aspects
  (CORRUPTION, NORMAL, POWERFUL, PURE, STRANGE, WEAK), effects (CHARISMA, COLD,
  CONFUSED, DEATH, HATE, LIFE, LOVE, LUCK, SEEK, SMART, WARD and more) and
  targets (ANIMAL, CROWD, ENEMY, FRIEND, MAN, ME, OBJECT and more). Grading
  compares each clause against each job requirement's `options`; the
  per-option consequence text is data, not code, so it is still in the
  serialized assets (OG11 is narrowed, not closed).
- **Path Past The Mountain** (`MainAssembly.dll`, 132 types). Types:
  `StepCounter` (fields `StepMade` signal, two TMP texts, `_stepCount`),
  `SeedGenerator`, `SeedReceptor`, `TerrainMesher`, `TerrainNoise`,
  `FastNoiseLite`, `InfFollowerTerrain`, `ChunkManager<T>`, `ChunkInfo`,
  `DoodadManager` and doodad components, `PuzzleCube`, `SunMoonPositioner`,
  `SolarRotation`, `CompassAdjuster`, `KCharacterController`, `InOutManager`,
  `FootstepManager`. The pedometer lives in `StepCounter` with a signal and
  a plain integer: no error-model fields appear, so the "pedometer error"
  question in the play queue is probably not code-side.
- **Astroecologist** (`Assembly-CSharp`, 156 types). Grid roguelike with
  `ElementType`, `PropagateElementAction`, `PersistentAffectTilesAction`,
  `World`, `MapBuilder*` variants (Branching, Growing, Looping, IslandForest,
  ShopFloor, DemoBossFloor), `Creature` with `Mood` and `TurnDecision`,
  `EntityStats`/`EntityStatMods`, perks (CheatDeath, DamageBonus,
  Resistance, Vampirism), buffs (PeriodicDamageDebuff, StaticCharged, Tarred),
  `ResearcherAction`, `ComputerConsole`, `DayNightCycler`, `DamageEfficacyProfile`.
- **Stoneheart** and **Levers**: strings only. Levers has `District*`
  (`DistrictPolicy`, `DistrictSeatDistribution(Type)`, `DistrictElectionResult`),
  `Election*`, `ElectionCycle`, consistent with the E8 rule structure in
  BATCH_ECONOMY.

## Open after this pass

- Levers (v106) and Stoneheart (v39): need a Cpp2IL build that parses them,
  the exact Unity version, or Stoneheart's wasm. A bodyless dump would still
  not give scoring code.
- Real method bodies for any wasm build need Ghidra with `ghidra_wasm.py` (the
  dumper ships it). Not attempted; out of scope here.
- The Looper consequence table itself (OG11) needs the serialized assets
  (typetree stripped), not the dump.
