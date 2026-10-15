# Feature game scout, 2026-10-14

Type: PROPOSAL. Weibao, 2026-10-14: "send new chat looking for games with those features for installation". This report names games that implement YAIRPG's current top-ranked packets especially well, so read-only decompile or source lanes can be queued once he installs them. Nothing was bought, installed, launched or logged into. The acquisition queue was not edited; exact proposed edits are at the end.

Labels: **shown** = seen in a cited page or local file this session; **stated** = a source says so, not checked first-hand; **inferred** = my background knowledge, unverified this session. Prices and disk sizes are inferred unless marked; check the Steam page before deciding.

## What "well" means here

Taken from [PACKETS.md](../cross-game-synthesis-2026-10-14/PACKETS.md) and [modular production chains round 5](../../MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md):

| Code | Feature | A donor implements it well when |
|---|---|---|
| P01 | Work receipts, truthful blockers, next useful action | A stopped job names the exact missing input or capacity, the last result is a real receipt, and the resume path is obvious |
| P03 | Teacher, study and manual routes | Different routes (teacher, book, practice) cost differently but reach the same usable application; losing the book keeps the knowledge |
| P19 | Staged dialogue with a paid choice | A response spends a real resource, can fail, and failure leads to a different later action, not a dead end |
| P02 | One good, competing destinations | One held stock has two or more useful uses quoted side by side |
| P04 | Discovery vs permission vs ownership vs usability | The game keeps "I know how", "I may", "I own it" and "I can do it now" as separate states |
| CH | Processing chains and kit-making | Timed stages (soak, dry, tan, refine, distill) with intermediate goods and interruption rules |
| BD | Bodies as separate parts | Constitution, genetics, physique and gender as independent fields that different systems read |
| RT | Research with evidence and revision | Knowledge comes from evidence, carries uncertainty and can be confirmed or revised |

## Exclusions

Games with a dossier under `docs/research/<game>/` were excluded (local `ls`, shown): for example Crusader Kings 3, RimWorld, Dwarf Fortress, Kenshi, Caves of Qud, Disco Elysium, Heaven's Vault, Academagia, Taiwu, Immortal Life, Wildermyth, Factorio, Oxygen Not Included, Outer Wilds, CDDA (in `dcss-dda-depth`). Evolve is covered in `open-idle-games-2026-10-09/EVOLVE.md`. Kittens Game is cited in `docs/RESEARCH_IDLE_GAMES.md` for catch-up and workers but has no dossier and no blocker pass, so it stays in for P01 only. Roadwarden is named in `RESEARCH_IDLE_GAMES.md` and `NICHE_GAME_REFERENCES.md` but has no dossier, so it stays in. TerraFirmaCraft's jar is already downloaded by the Minecraft bulk pass ([completion receipt](../MINECRAFT_DOWNLOAD_COMPLETION_2026-10-14.md), shown) but no TFC mechanic lane exists.

## Local inventory (read-only, shown)

`~/Library/Application Support/Steam/steamapps/appmanifest_*.acf` lists 14 apps: NGU IDLE, Immortal Life, VTube Studio, Your Chronicle, Steamworks Redistributables, 100 Space Cats, Idle Reincarnator, Hearts of Iron IV, Academagia, Warsim, Heaven's Vault, Scroll of Taiwu, Vagrus and Hogwarts Legacy. **None of the candidates below is installed**, so every row is "owned: unknown". `compatibilitytools.d/notproton` exists (shown), so Windows-only rows can use it. Local tools per the [queue](../FUTURE_ACQUISITION_QUEUE_2026-10-13.md) and [coverage refresh](../coverage-refresh-2026-10-14/REPORT.md): Ghidra, dotnet SDK 10 plus `ilspycmd` 11.1. Not installed: unrpyc, a Java decompiler (CFR or Vineflower), a Python 3.7 bytecode decompiler, Cpp2IL, Sims 4 package tools.

**Install note for every Windows-only row:** in Steam, Properties > Compatibility, force the macSteam `notproton` tool before installing, or the download stays a placeholder. The watcher counts an install only when the directory has files; the coverage refresh found five StateFlags-4 directories with no `.exe`, so check for the payload, not the flag.

## Ranked install list (top 15)

At most 5 per primary feature. Most rows also serve a second feature, listed after the slash.

### Free or already on disk

| Rank | Game | Feature | Mechanic question the pass would answer | Route | Install notes | Disk | Price |
|---:|---|---|---|---|---|---|---|
| 2 | **Vintage Story survival mod source** | CH / P01 | How do barrels, drying racks and the anvil hold a timed intermediate (soaking hide, drying brick, half-shaped workpiece), and what survives removal, reheating or interruption? | Official C# source on GitHub, `anegostudios/vssurvivalmod`, source-available, "read, learn from it" allowed (stated in README). JSON assets ship with the game | No install. `git clone` into gitignored `docs/research/vintage-story/private/`. Game itself is macOS native but not needed for code | ~0.2 GB source | Free to read; game ~$18.49 (inferred), not on Steam |
| 7 | **The Sims 4 (base game)** | BD / P03 | How do physical frame, clothing preference, pregnancy ability and toilet stance stay separate fields from gender, and which systems read each? How do skill books and practice raise the same skill? | Python scripts as `.pyc` in game zips (needs a 3.7 decompiler), XML tuning inside `.package` files (inferred). Gender split shown in the 2016 patch overview | Steam app 1222670 (inferred), macOS native. Needs an EA account link: Weibao's own login, I must not do it | ~30 to 50 GB (inferred) | Free base game (inferred) |
| 9 | **TerraFirmaCraft** | CH | How does TFC chain knapping, barrel soaking (tanning, brining), drying and anvil welding, and what is its sealed-barrel timer and recipe-by-fluid rule? | Java, open source on GitHub (TerraFirmaCraft/TerraFirmaCraft, inferred); data JSON in the jar | Already downloaded jar (47 MB, shown). Read the jar's `data/` JSON first; source clone for logic | ~0.05 GB jar, ~0.3 GB source | Free |
| 11 | **Kittens Game** | P01 / P04 | How do its build and craft tooltips state the exact missing resource, the time to reach it at current rate, and storage caps that block a cost? | JS, open source (`nuclear-unicorn/kittensgame`, cited in `RESEARCH_IDLE_GAMES.md`, shown) | No install; reuse the pinned commit already cited | ~0.05 GB | Free |

### Would need purchase (each needs Weibao's explicit yes)

| Rank | Game | Feature | Mechanic question the pass would answer | Route | Platform, Steam app id | Disk | Price |
|---:|---|---|---|---|---|---|---|
| 1 | **Project Zomboid** | P03 / P04, CH, BD | Skill books multiply XP only inside a level band and give none alone; magazines unlock recipes; TV and VHS give capped direct XP (stated for Build 42). How is "knows recipe" kept apart from "has station, tools, skill now"? How do B42 drying racks and tanning stages hand off? | Lua (`media/lua`) and recipe script text ship in plain files (inferred); Java core needs CFR or Vineflower | macOS native, 108600 (shown in Steam thread URL) | ~5 to 8 GB | ~$19.99 |
| 3 | **Stardew Valley** | P02 / CH, P19 | One crop or fish goes to sale, gift, bundle, cooking or artisan processing (keg, jar, dehydrator, cask). How are those destinations quoted and how do machine timers hold an input? How do heart events gate on conditions? | .NET, `ilspycmd` on the game DLL (wiki decompile steps, stated); data as JSON after XNB unpack | macOS native, 413150 (inferred) | ~1 GB | ~$14.99 |
| 4 | **Kingdom Come: Deliverance** | P03 / P04, CH | Reading is locked until a scribe teaches it; book volumes need skill 0, 5, 10, 15; paid trainers give one level once per five levels; alchemy is a manual staged recipe and later autobrew (all stated). How are these tables shaped? | CryEngine; game data in `.pak` zip archives with XML tables and Lua (stated by modding tool pages). `unzip` reads them | Windows only, 379430 (shown). Force `notproton` | ~40 to 85 GB (inferred, large) | ~$29.99 |
| 5 | **Roadwarden** | P19 / P04, P01 | Choices cost coin, time of day, appearance or trust, topics unlock from what you learned, and failure reroutes later scenes (inferred from design, stated "time-constrained" in prior scout). How are the condition and cost checks written per line? | Ren'Py; `.rpyc` via unrpyc (needs `pip install unrpyc` into a venv; archives may need an `.rpa` extractor) | macOS native, 1155970 (shown) | ~1 GB | $10.99 list (shown) |
| 6 | **Sapiens** | RT / P03, CH | Discovery by investigating an object (branch to fire, stone to knapping, hay to thatch, stated in guide), skills learned by assigned work. How are investigation, tribe-wide knowledge and individual skill kept apart? | Custom engine with about 481 plain Lua scripts in `Sapiens.app/Contents/Resources/GameResources/` (shown after install) | **Corrected:** macOS native, 1060230 (shown in appmanifest). No `notproton` needed | 0.43 GB (shown) | ~$24.99 (inferred) |
| 8 | **Torment: Tides of Numenera** | P19 | Dialogue checks let you spend Effort from Might, Speed or Intellect pools to lower difficulty, the slider shows the deduction, pools stay spent until rest (stated). How do conversation nodes record the spend and branch on failure? | Unity Mono, `ilspycmd` on Assembly-CSharp; conversation data in assets (inferred) | macOS native (inferred), 272270 (shown) | ~20 to 40 GB | ~$19.99 to $44.99 (check) |
| 10 | **Ostranauts** | P04 / BD, P19 | Every verb is an interaction with CondTrigger requirements on actor and target; conditions sit on crew, items and rooms (stated by wiki). How does it split "can see the action", "allowed" and "able now"? How do social interactions spend status? | Plain JSON in `StreamingAssets/data` (stated); Unity Mono for C# (stated BepInEx route) | Windows only (inferred), 1022980 (shown). Force `notproton` | ~3 GB | ~$24.99 (inferred) |
| 12 | **Captain of Industry** | P01 / CH, P02 | How does a stopped machine report the exact cause (missing input, full output, no workers, no power, maintenance), and how do refining and distillation chains with byproducts route outputs? | Unity Mono, `ilspycmd`; C# mods exist (stated, CaptainOfCheats) | Windows only (inferred), 1594320 (shown). Force `notproton` | ~5 GB | ~$34.99 (inferred) |
| 13 | **Morrowind GOTY (read with OpenMW)** | P04 / P03 | Items and beds carry an owner; taking is possible but theft; faction rank gates services; trainers are capped by their own skill; skill books give +1 (trainer cap inferred, books stated). How are owner, faction and rank fields stored per object? | ESM data read by the open-source engine OpenMW or a converter to JSON; no decompile needed | Data is Windows, 22320 (inferred); OpenMW is macOS native (stated). Force `notproton` only to fetch data | ~2 GB | ~$14.99 |
| 14 | **Niche: a genetics survival game** | BD | Over 100 genes with dominant, recessive and co-dominant inheritance plus drift and mutation (stated). How are genotype, phenotype and visible traits stored and inherited separately? | Unity, `ilspycmd` if Mono (inferred) | macOS native (inferred), 440650 (shown) | ~1 GB | ~$14.99 (inferred) |
| 15 | **Return of the Obra Dinn** | RT | Deductions are confirmed only in batches of three, so evidence accumulates before the game admits a fact. How are guesses, confirmed facts and evidence links stored and revised? | Unity, `ilspycmd` if Mono (inferred) | macOS native (inferred), 653530 (inferred) | ~1 GB | ~$19.99 |

### Alternates, if a row above is skipped

| Game | Feature | Why it is below the cut |
|---|---|---|
| Graveyard Keeper (599140, shown) | P02 / RT | Red, green and blue tech points come from different work types and books (stated); good, but Stardew covers P02 better. Unity Mono, BepInEx (stated) |
| Griftlands (app id unverified) | P19 | Negotiation and paid help in Lua inside a data zip (stated by Klei forum). Overlaps Numenera and Roadwarden |
| Gothic II Gold (app id unverified) | P03 | Teachers charge learning points plus gold (inferred); Daedalus scripts decompile with `mdd` (stated). Overlaps KCD |
| Shadows of Doubt (app id unverified) | RT | Evidence board; likely IL2CPP (inferred) and Cpp2IL is not runnable here |
| Songs of Syx (already queued) | CH / P02 | Java, easy to decompile (inferred); already on the queue's rank 14 row |

## Why this order

1. **Project Zomboid** first: one plain-text install answers P03 (three learning routes with different rules), P04 (recipe known vs station and tools present), part of CH and bodies (traits). Cheap and macOS native.
2. **Vintage Story source** second: free, no install, and the earlier [absorption scout](../GAME_ABSORPTION_SCOUT_2026-10-14-report.md) already called it the clearest material donor (F2). It directly serves the next chain slice, T4 dry to kit.
3. **Stardew** for P02: the cleanest "one stock, many useful uses" in a life sim, readable with tools already installed.
4. **KCD** for P03 depth, despite the disk cost.
5. **Roadwarden** and **Numenera** for P19: one text-first, one with a literal spend slider.

## Proposed queue edits (not applied)

Target: [FUTURE_ACQUISITION_QUEUE_2026-10-13.md](../FUTURE_ACQUISITION_QUEUE_2026-10-13.md). The coverage refresh's [QUEUE_EDITS.patch](../coverage-refresh-2026-10-14/QUEUE_EDITS.patch) is also unapplied; apply that first or merge by hand.

**E1.** Under "Free titles to consider", add:

```markdown
| 5 | Vintage Story survival mod source | CH: how timed intermediates (barrel soak, drying rack, anvil workpiece) survive interruption. Source-available on GitHub, no install. [Scout](feature-game-scout-2026-10-14/REPORT.md) |
| 6 | TerraFirmaCraft | CH: barrel, drying and anvil chains. Jar already downloaded; read data JSON, then source |
| 7 | Kittens Game | P01: exact-missing-resource and time-to-afford tooltips. Public JS, pinned commit in RESEARCH_IDLE_GAMES.md |
| 8 | The Sims 4 base game | BD: gender split into frame, clothing, pregnancy and stance fields. Free on Steam; needs Weibao's EA login |
```

**E2.** Add a new section after "Short list":

```markdown
## Feature scout additions (2026-10-14)

From [feature game scout](feature-game-scout-2026-10-14/REPORT.md). Purchase needs Weibao's yes. Windows-only rows need macSteam `notproton` forced in Properties > Compatibility.

| Rank | Game | Feature | Route | Steam app |
|---:|---|---|---|---|
| 1 | Project Zomboid | P03, P04, CH | Lua and script text; Java needs CFR | 108600 |
| 2 | Stardew Valley | P02, CH | ilspycmd plus XNB data | 413150 |
| 3 | Kingdom Come: Deliverance | P03, CH | `.pak` zip XML and Lua | 379430 |
| 4 | Roadwarden | P19 | Ren'Py, unrpyc | 1155970 |
| 5 | Sapiens | RT, P03 | Lua scripts | 1060230 |
| 6 | Torment: Tides of Numenera | P19 | Unity Mono, ilspycmd | 272270 |
| 7 | Ostranauts | P04, BD | JSON data | 1022980 |
| 8 | Captain of Industry | P01, CH | Unity Mono, ilspycmd | 1594320 |
| 9 | Morrowind (with OpenMW) | P04, P03 | ESM via OpenMW | 22320 |
| 10 | Niche | BD | Unity, ilspycmd | 440650 |
| 11 | Return of the Obra Dinn | RT | Unity, ilspycmd | 653530 |
```

**E3.** For the backfill watcher: each new lane needs a `lanes/backfill/<key>.prompt.md` and a `gate.names` entry in `lanes.json` matching the lowercase Steam name (for example `"project zomboid"`). The watcher's "2" rule skips names containing "2" unless the gate does too; none of these names do. Propose, not added.

**E4.** Tool installs a lane would need first (each a small local install, no purchase): `unrpyc` (Roadwarden), CFR or Vineflower (Zomboid Java), a Python 3.7 bytecode decompiler (Sims 4), OpenMW (Morrowind).

## Sources

- Project Zomboid books and VHS: [pzfans books](https://pzfans.com/item-books/), [B42 crafting overhaul](https://pzfans.com/b42_crafting_overhaul_surviving_the_apocalypse_one_skill_at_a_time/), [VHS guide](https://pzfans.com/hit_vid_hustle_build_41_vs_42_vhs_secrets_in_project_zomboid/), [Steam thread, app 108600](https://steamcommunity.com/app/108600/discussions/0/595135824845100602)
- Vintage Story: [vssurvivalmod](https://github.com/anegostudios/vssurvivalmod), [decompilation forum thread](https://www.vintagestory.at/forums/topic/22422-is-code-decompilation-okay-for-creating-tools-for-the-game/), [Wikipedia](https://en.wikipedia.org/wiki/Vintage_Story)
- Sapiens: [Creative Mode Lua mod](https://github.com/SirLich/sapiens-creative-mode), [press kit](https://majic-jungle.prezly.com/sapiens-press-kit), [guide hub](https://Techraptor.net/gaming/guides/sapiens-guides-guide-hub)
- Kingdom Come: [skill trainers and books](https://guides4gamers.com/kingdom-come-deliverance/article/skill-trainers-and-books), [Reading wiki](https://kingdom-come-deliverance.fandom.com/wiki/Reading), [kcd-modder](https://npmjs.org/package/kcd-modder), [Steam app 379430 thread](https://steamcommunity.com/app/379430/discussions/0/2860219962099898069)
- Torment: Tides of Numenera: [Effort system update](https://gamebanshee.com/k9fa8), [review](https://www.godisageek.com/reviews/torment-tides-of-numenera-review), [Steam app 272270](https://steamcommunity.com/app/272270/discussions/0/133258092249317216)
- Niche: [Steam 440650](https://store.steampowered.com/app/440650/_/), [Common Sense review](https://www.commonsense.org/education/game/niche-a-genetics-survival-game)
- Stardew Valley decompile steps: [wiki revision](https://stardewvalleywiki.com/Special:MobileDiff/119914)
- The Sims 4 gender options: [2016 update overview](https://simscommunity.info/2016/06/02/the-sims-4-june-2016-update-gender-customization-overview/)
- Roadwarden: [itch.io (Ren'Py, macOS)](https://assemble-entertainment.itch.io/roadwarden), [SteamData 1155970](https://steamdata.ai/game/1155970), [unrpyc](https://docsearch.algolia.com/mcp/docs/repo/censoredusername/unrpyc)
- Captain of Industry: [Steam app 1594320 modding thread](https://steamcommunity.com/app/1594320/discussions/4/3425564314035878340)
- Ostranauts: [Data modding](https://ostranauts.wiki.gg/wiki/Modding/Data_Modding), [Interactions](https://ostranauts.wiki.gg/wiki/Modding/Interactions), [Steam app 1022980 thread](https://steamcommunity.com/app/1022980/discussions/3/523083510998653000)
- Morrowind and OpenMW: [OpenMW install game files](https://openmw-trav.readthedocs.io/en/latest/manuals/installation/install-game-files.html), [OpenMW changelog](https://git.cijber.net/krageon/openmw-tes3coop/src/tag/openmw-0.20.0/readme.txt)
- Graveyard Keeper: [Steam 599140 thread](https://steamcommunity.com/app/599140/discussions/0/1734336452566456705), [blue points guide](https://twinfinite.net/guides/graveyard-keeper-blue-points-how-get/), [BepInEx mod](https://www.nexusmods.com/graveyardkeeper/mods/159)
- Griftlands: [Klei early mod support](https://forums.kleientertainment.com/forums/topic/116914-early-mod-support/)
- Gothic: [mdd decompiler](https://skwrus.duckdns.org/GothicKit/mdd), [Ninja](https://github.com/szapp/Ninja/wiki/Inject-Changes)
- Local: Steam `appmanifest_*.acf` and `compatibilitytools.d` listings; repo dossier directory listing; [prior absorption scout](../GAME_ABSORPTION_SCOUT_2026-10-14-report.md)

## Checks and limits

Read the AGENTS.md and CLAUDE.md rules, the queue, the coverage refresh, the tool-fit note, the P01 to P04 and P19 packets, and chain round 5. Ran standard web searches (no extended) and the local manifest listing. Not done: no store pages opened for live prices or disk sizes, no ownership check beyond installed manifests, no game files read. App ids marked inferred and the Sapiens platform and Lua route should be confirmed on the store page before a purchase decision. Nothing committed; only this folder was written.

## Round 2 (2026-10-14 20:55): lanes sent, RimWorld, more to consider

Weibao, 2026-10-14: "send out the free game stuff accordingly, using codex, some of the steam ones are installing, did we consider rimworld yet? more to consider?"

### Corrections first

| Code | Was | Now |
|---|---|---|
| C1 | Sapiens Windows only, Lua inferred | macOS native with about 481 plain Lua files (shown in the install) |
| C2 | No candidate installed | Installed since: Sapiens, Stardew Valley, Project Zomboid, Potionomics, Magical Diary: Wolf Hall, Rune Factory 5 (appmanifests, StateFlags 4, shown). Ownership of these six is now shown |
| C3 | Potionomics engine unknown | Unreal Engine (an `Engine/` folder and `Manifest_NonUFSFiles_Win64.txt` are shown), not Unity |

### Lanes sent

Ten Codex lanes, registry in [SESSIONS.md](../../gm/dispatch/feature-scout-2026-10-14/SESSIONS.md), brief in [FEATURES.md](../../gm/dispatch/feature-scout-2026-10-14/FEATURES.md). Free: Vintage Story source, TerraFirmaCraft chains, Kittens Game. Installed: Stardew, Sapiens, Project Zomboid, Potionomics, Magical Diary, Rune Factory 5. Plus a RimWorld feature pass (below). Magical Diary and Rune Factory 5 were not in this scout's list but are installed and unlaned, so they got lanes with the same feature questions.

### RimWorld

Yes, it was considered, and excluded from the install list only because it already has a dossier. Shown: [rimworld](../rimworld/COVERAGE.json) read five paths from a private ILSpy export of 1.6.4871 (jobs, needs and health, social memory, storyteller, materials and production). That export is gone, and backfill lane `bf-rimworld` waits for a Steam install. Two things were missed: (1) the same 1.6.4871 rev588 DMG is still in `~/Downloads` (shown), so no reinstall is needed; (2) the dossier never answered the scout's features: job and bill failure reasons (P01), material competition between bills (P02), research and techprints (RT), skill learning and teaching (P03), and genes, body and gender fields (BD). Lane `fs-rimworld-features` now covers those from the DMG.

### More to consider

**ACT NOW (done this round)**

- M1. Only `docs/research/*/private/` is gitignored (shown in `.gitignore` line 41). A `private/` one level deeper, such as `rimworld/feature-pass-2026-10-14/private/`, would be committed raw. FEATURES.md now sends every lane's raw details to `docs/research/<game>/private/<lane>/`. A current untracked scan found no nested private folders.
- M2. Report corrected for Sapiens (C1).

**ACCOUNT FOR NOW**

- M3. bf-rimworld and fs-rimworld-features would extract the same build twice. The fs lane keeps its extract reusable at `~/.codex/research/fs-rimworld-features/extract/`. PROPOSAL for the backfill owner: point bf-rimworld at that extract or the DMG instead of gating on Steam. Not edited here, because `lanes.json` belongs to the game research wave.
- M4. Potionomics is Unreal (C3). Its lane picks the route from what is installed. UE pak reading needs a user-local tool such as a CUE4Parse-based reader, and logic in Blueprints may stay partly opaque, so expect PARTIAL.
- M5. Rune Factory 5 is IL2CPP. Cpp2IL was "not runnable" earlier, so names may recover only through an Il2CppDumper or Cpp2IL source build. Expect table-level answers marked inferred.
- M6. Merge before dispatch: these lanes only write docs, create no branches and run nothing in `src/`, so no merge sweep was needed for them. The root session's code-branch sweep is unchanged.
- M7. Commits: lanes do not commit. The root session commits the ten output dirs plus this dispatch folder after each CHECKPOINT says COMPLETE or PARTIAL.

**LATER / DELEGATE (suggested, not dispatched)**

- M8. Fold the feature answers into the PACKETS.md "Source comparisons" lines (P01, P02, P03, P04, P19) once lanes return. That belongs to the cross-game synthesis owner. Suggested: one Codex medium-effort lane; done when each packet cites at least one new donor with a shown claim.
- M9. The Sims 4 is free but needs Weibao's own EA login and a 30 to 50 GB install. Once he links it, one lane covers BD (gender fields) and P03 (skill books and classes).
- M10. Paid rows still waiting on a purchase decision: KCD, Roadwarden, Torment: Tides of Numenera, Ostranauts, Captain of Industry, Morrowind, Niche and Obra Dinn. Of these, Roadwarden ($10.99, Ren'Py, the same route as the Magical Diary lane) is the cheapest add for P19.
- M11. Queue edits E1 and E2 should now mark Stardew, Sapiens, Zomboid and Potionomics as owned and laned, and add Magical Diary and Rune Factory 5 as owned and laned. That is still a proposal; the queue is untouched.
- M12. Disk: the six installs use about 25 GB (shown with `du`). Extracts in `~/.codex/research/fs-*` add more; RF5 and Potionomics assets could be several GB. Lanes are told to export only what their questions need.
