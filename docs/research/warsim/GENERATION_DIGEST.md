# Generation digest

Labels: SHOWN means installed data or inspected instructions; STATED means a
linked developer description; INFERRED means an architectural reading. Payload
paths below are relative to the Warsim install recorded in TOOLING.md.

## Native joins

**G1 SHOWN:** direct calls in `Warsim.exe!KingdomGenerator` include
`RaceGenerator`, `FactionNameGenerator`, `FaceGenerator`, `FlagGenerator`,
`CurrencyGenerator`, `TileGenerator`, `CrownGenerator`, `PhraseGenerator`,
`KingdomBuildings`, `SetRaceEffects`, `Name` and `NameWriter`.
`MercGenerator` directly calls `FactionNameGenerator`, `FaceGenerator`,
`Name`, `QuickStat` and `WarriorType`. This confirms reuse between kingdoms and
mercenaries. Call presence does not say every path calls each helper.
Raw evidence: `extract/call_edges.json` and the six `.asm` files in the work area.

**G2 SHOWN:** `RaceGenerator` contains calls to `SplitLine`, integer conversion,
file streams and 11 static C `rand` call sites. Named fields referenced include
`RacePop`, `RaceCiv`, `RaceAlignment`, `RaceEffects`, `RaceColor` and each of
`RacePeasantStat`, `RaceSoldierStat`, `RaceKnightStat`.
This connects structured data to race values; the full branch graph and RNG
seed lifecycle were not reconstructed. Eleven sites is not eleven rolls per race.

**G3 SHOWN:** `HeroBackground` at virtual address `0x140ac9273` opens
`Data/HeroStory.txt`, counts lines, reopens it, computes a selected index with
`rand` and integer remainder, scans to that line and assigns `HeroStory`.
The selection instructions are at `0x140ac931d` through `0x140ac932f`; selected
text assignment is at `0x140ac9369` through `0x140ac937d`.
There are no gameplay helper calls in this function. This establishes selection
of authored biography text, not the absence of all possible readers elsewhere.
The helper makes two file passes. A reviewed in-memory table would avoid that
cost in a new implementation; no performance measurement of Warsim was run.

**G4 SHOWN:** `SetRaceEffects` at `0x140b3bc1a` checks `RaceEffectSlot`, then an
independent faction effect code. In the first slot, effect 10 sets `ChildFace`,
effect 7 sets `EyelessFace` and effect 24 sets `DeformedFace`. It also has a
string-find call for `Masked`. Numeric effect codes are real presentation
consumers. This is not a complete list of combat behavior or stacking precedence.
Avoid assigning rule identity from display-name substrings in YAIRPG.

## Tables and grammar

| ID | SHOWN installed table | Structure / what is supported | What is still unknown |
|---|---|---|---|
| G5 | `Data/RaceType.txt` | All 101 rows have 14 dot-separated fields: base label, numeric fields, three troop-label/score pairs and prose tail | Exact meaning of every leading numeric field |
| G6 | `Data/RaceSuffix.txt` | All 379 rows have 12 fields. Slot classes 1=141 rows and 2=238 rows. Labels, numeric operators/codes, prose | Complete modifier application order and cap rules |
| G7 | `Data/FactionName.txt` | Three metadata lines and 375 content rows with role category: 293 general, 71 bandit, seven kingdom, four mercenary | Every grammar branch; header mentions other slots not populated here |
| G8 | `Data/MercenaryStory.txt` | Four metadata lines, 52 universal, 116 normal, 144 goblin and 21 goblin anti-slaver stories | How each eligibility category is selected and retained |
| G9 | `Data/Names/*.txt` | 95 files; 50 begin with NONAME, often followed by a shared file reference; five are naming-system files | Full alias recursion, weights and fallback behavior |
| G10 | `Data/Name Suffix.txt`, `Name Suffix Addons.txt` | 3,528 and 644 rows with numeric fields; 3,527 suffix rows have three dot-separated fields, one has four | Numeric meaning and whether the unusual row is special handling |
| G11 | `Data/Race Faces.txt`, `Data/Faces/Face0..6.txt` | Race-to-number mapping and seven pools of ASCII lines | Valid part-combination totals and per-person freezing |
| G12 | `Data/Currency.txt`, `CurrencyArt.txt`, `Flag.txt`, `Flags.txt` | Word categories, art and flag component pools | Whether currency has exchange mechanics; do not infer that from names |

**G13 INFERRED:** separate role categories cheaply keep a bandit name or
mercenary story in tone without a separate full generator for every faction.
Name aliases are a useful example of shared content. Their filenames alone do
not prove the runtime follows every alias successfully.

**G14 INFERRED:** lore is partly explanatory prose attached to rules and partly
standalone authored text. The useful join is a modifier changing the troop or
policy and also supplying a description. A story claiming a past event should
remain anecdote unless there is a corresponding historical fact.

## Mapping to the foundation, PROPOSAL

Use existing GR1/GR2 addresses for world, faction, person, slot and game-time
inputs. Retain one stable identity across consumers; freeze known results under
GR3/GR10. Role categories become tags under GR7; packs become overlays under
GR8. Preserve grammar references under GR15 and render through knowledge under
GR5. Declare max draw/entity budgets and named fallback under GR6/GR11.

Generate population, combat and policy facts only when a reader exists under
GR12. Shared player/NPC rules under GR13 require actual common resolver calls;
a shared name helper alone is not enough. Runtime text selection is not a
substitute for GR16 seed sweeps, golden cases and next-pick persistence.

A core species, social policy and individual personality are distinct inputs.
Do not convert a source's single civilization score into a universal YAIRPG
personhood or moral worth score. Species physiology can condition actions;
society policies and individual behavior have their own causes.
