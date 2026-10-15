#!/usr/bin/env python3
"""Writes one prompt per feature-scout lane. Edit LANES, rerun, then launch with runs/launch.py."""
import os
HERE = os.path.dirname(os.path.abspath(__file__))
STEAM = "~/Library/Application Support/Steam/steamapps/common"

HEAD = """You are lane `{key}` in the YAIRPG feature scout wave of 2026-10-14.
Repo: /Users/weiwei/code/yet-another-idle-rpg (main checkout, read-only for you except your output dir).
Read first, in order: docs/gm/dispatch/feature-scout-2026-10-14/FEATURES.md, then docs/gm/dispatch/game-research-wave-2026-10-14/COMMON.md (hard rules) and docs/gm/dispatch/game-research-wave-2026-10-14/ASPECTS.md. They govern this prompt.
Work area: `~/.codex/research/{key}/`
Weibao, 2026-10-14: "send out the free game stuff accordingly, using codex, some of the steam ones are installing, did we consider rimworld yet? more to consider?"

Output dir (the only repo path you may write): `{out}`
Private deep details: `{private}`

## Game and payload
{payload}

## Route
{route}

## Questions (answer each in the Feature answers table)
{questions}

## Done
Per FEATURES.md and COMMON.md. CHECKPOINT.md stays current so a restart resumes. Final message: the answers in one line each, top three proposals, gaps.
"""

LANES = {
  "fs-vintage-story": dict(
    out="docs/research/vintage-story/", private="docs/research/vintage-story/private/fs-vintage-story/",
    payload="Not installed and not owned as far as we know (not on Steam). Anego Studios publishes the survival and essentials mods and the API on GitHub as source-available code: reading and learning are allowed by its README; do not redistribute. Game JSON assets ship only with the paid game, so take numeric values from the official wiki (wiki.vintagestory.at, MediaWiki API, one request per second or slower) and label them stated.",
    route="Clone `anegostudios/vssurvivalmod`, `anegostudios/vsessentialsmod` and `anegostudios/vsapi` into `repos/` and pin commits in TOOLING.md. Read C# directly. Prior scout context: docs/research/GAME_ABSORPTION_SCOUT_2026-10-14-report.md (F2, smithing workpiece).",
    questions="""1. CH: barrels. How does a sealed barrel recipe (soaking hides, lime water, brine) hold inputs, timers and output, and what happens when it is opened early or the liquid amount is wrong?
2. CH: drying and transitions. How do perishable and transitionable properties (drying, curing, rot) work per item stack, and how is ambient condition applied?
3. CH: workpieces. How does the anvil or clay forming keep a half-made voxel workpiece, reheating, and recovery when removed?
4. P02/P01: How does the handbook show where an item is used and why a station cannot work right now?
5. Kit-making: how are multi-part items (tool heads plus handles, armor parts) assembled and what does each part carry?"""),
  "fs-tfc-chains": dict(
    out="docs/research/minecraft/tfc-chains-2026-10-14/", private="docs/research/minecraft/private/fs-tfc-chains/",
    payload="TerraFirmaCraft 3.2.27 (Forge 1.20.1) is already downloaded and decompiled locally: jar `docs/research/minecraft/private/bulk-2026-10-14/terrafirmacraft/`, data extract `docs/research/minecraft/private/extract/terrafirmacraft/`, Java decompile `docs/research/minecraft/private/decomp/terrafirmacraft/src`. Prior read: docs/research/minecraft/audits/WC_WORLDS_COLONIES.md (N13): food, nutrition and metallurgy data were read; climate, seasons and husbandry (G5) were not. Do not repeat what WC already covers; correct it if wrong.",
    route="Read the local decompile and data JSON. Optional: clone the upstream TerraFirmaCraft GitHub repo at the matching tag for readable names; pin it.",
    questions="""1. CH: barrels. Sealed barrel recipes (tanning, brining, lye, limewater): inputs, fluid ratios, duration, what unsealing early does.
2. CH: leather chain. Hide to soaked to scraped to prepared to leather: each stage, tool and station.
3. CH: drying. Drying mats, firing pits and kilns (bricks, pottery): timers, heat, interruption.
4. Kit-making: knapping and molds, tool heads plus handles, and how a part keeps its metal and quality.
5. P02/P04: how the field guide and recipe viewer separate known, craftable now and needs-station states.
6. G5 gap from WC: seasonal climate and calendar effects on processing, only where they change a chain."""),
  "fs-kittens": dict(
    out="docs/research/kittens-game/", private="docs/research/kittens-game/private/fs-kittens/",
    payload="Free, open source web game. Already cited for catch-up and workers in docs/RESEARCH_IDLE_GAMES.md at commit `781e379f79f1e7512d168849cba21ed111502644` of `nuclear-unicorn/kittensgame`. No dossier yet.",
    route="Clone the repo into `repos/` and check out that commit, then compare with current HEAD. Read JS directly; you may serve the static build from your work area and use a headless browser to see tooltips, never the live site's account features.",
    questions="""1. P01: How does a build or craft button state the exact missing resource, the time to reach it at the current rate, and a storage cap that blocks the cost?
2. P01: How does the game report why production stopped (no workers, starving, cap reached) and what the next useful step is?
3. P04: How are tech researched, building unlocked, affordable now and limited by cap kept as separate states in code and UI?
4. P02: Where does one resource compete between upkeep, crafting and building, and how is that shown?"""),
  "fs-stardew": dict(
    out="docs/research/stardew-valley/", private="docs/research/stardew-valley/private/fs-stardew/",
    payload=f"Installed (Steam app 413150, macOS native): `{STEAM}/Stardew Valley/Contents/`. Owned by Weibao. Find the main game assembly and the Content folder inside the app bundle. Compare the build id in the appmanifest.",
    route="ilspycmd on the game DLL (export only the namespaces you need). Content data is in .xnb files: use a pure reader (for example xnbcli or a Python XNB parser in a venv); do not run the game or any tool that boots the game's own runtime. 1.6 data is mostly JSON-shaped models; record which files you parsed.",
    questions="""1. P02: One crop, fish or forage good can be sold, gifted, cooked, put in a bundle, or processed. Where does each destination read the item, and how does the UI quote the choice?
2. CH: Machines (keg, preserves jar, dehydrator, cask, furnace): how is input held, timed and collected; what does removing, pausing or a full output do?
3. P19: Heart events and dialogue: how are conditions, gift effects and event preconditions written, and does any choice cost or fail?
4. P03: Where do skills, recipes and crafting recipes come from (level up, TV, mail, friendship, purchase) and how is learned vs craftable now shown?
5. A04 save: what the save stores for machines in progress and relationships."""),
  "fs-sapiens": dict(
    out="docs/research/sapiens/", private="docs/research/sapiens/private/fs-sapiens/",
    payload=f"Installed (Steam app 1060230, macOS native, so the scout report's Windows-only guess was wrong): `{STEAM}/Sapiens/Sapiens.app/Contents/Resources/GameResources/` holds about 481 plain Lua scripts. Owned by Weibao.",
    route="Read the Lua directly (copy what you need to `extract/` and hash it). The native engine is out of scope unless a question cannot be answered from Lua.",
    questions="""1. RT: Discovery by investigating an object (branch to fire, stone to knapping, hay to thatch): how is a discovery triggered, stored tribe-wide, and what evidence or progress does it need?
2. P03: Skills per sapien: learned by doing, taught by others, or both? How is tribe knowledge kept apart from one sapien's skill and from a role assignment?
3. P04: How does the game separate discovered, assigned (allowed), has tools and materials, and can do now for an order?
4. CH: Drying, firing, threshing and cooking chains: stages, storage and timers.
5. P01: How does an order report why nobody is doing it?"""),
  "fs-rimworld-features": dict(
    out="docs/research/rimworld/feature-pass-2026-10-14/", private="docs/research/rimworld/private/fs-rimworld-features/",
    payload="Owned. Not installed on Steam, but the earlier supplied macOS DMG is at `~/Downloads/rimworld_enUS_1_6_4871_rev588_.dmg` (same 1.6.4871 rev588 build as the prior dossier's INTAKE). The prior private ILSpy export is gone. Prior dossier: docs/research/rimworld/ (REPORT, COVERAGE, FINDINGS). Separately, lane `bf-rimworld` (game research wave backfill) waits for a Steam install to run a full aspect pass into `docs/research/rimworld/aspects-2026-10-14/`; do not write there. Make your extract reusable for it: keep it under `~/.codex/research/fs-rimworld-features/extract/` with HASHES.txt and say so in TOOLING.md.",
    route="Mount the DMG read-only and without Finder (`hdiutil attach -readonly -nobrowse -mountpoint <work>/mnt <dmg>`), copy the main managed assembly and the Data folder (Core plus any DLC folders present) to `extract/`, then `hdiutil detach`. Never run the game or its installer scripts. ilspycmd on the assembly.",
    questions="""1. P01: When a pawn cannot do a bill or job, how are the reasons built (JobFailReason, WorkGiver checks, bill 'cannot find materials' messages) and shown? Which reasons are truthful and which are generic?
2. P02: Bills and stockpiles: how one material competes between bills, priorities, ingredient filters and 'do until X'; how the UI quotes it.
3. RT: Research projects, techprints, benches and tech level: prerequisites, evidence (techprints), and whether anything is revised.
4. P03: Skill learning: passion, learning rate, daily caps, and (if Biotech data is present) children learning and teaching.
5. BD: Genes and xenotypes (if present): how genes, body type, head type, gender and hediffs are separate fields, and which systems read each.
6. Correct the prior dossier where it was wrong; mark which of its five paths you reconfirmed."""),
  "fs-magical-diary": dict(
    out="docs/research/magical-diary-wolf-hall/", private="docs/research/magical-diary-wolf-hall/private/fs-magical-diary/",
    payload=f"Installed (Magical Diary: Wolf Hall, Ren'Py, Windows build but the scripts are platform neutral): `{STEAM}/Magical Diary Wolf Hall/game/` with .rpyc files per week and per character. Owned by Weibao. This is the 'second magic school' cross-check the acquisition queue wanted next to Academagia (docs/research/academagia/).",
    route="unrpyc (pip into a venv under your work area; pick the branch matching the Ren'Py version in `renpy/`), plus an .rpa extractor if archives exist. Never run WolfHall.exe or the .bat files.",
    questions="""1. P03: Classes, study, homework and exams: how study time, stats and exam rolls work, and how a learned spell becomes usable in dungeons or events.
2. P19: Dialogue and dating routes: which choices cost a stat, time slot or relationship, can fail, and change later scenes?
3. P04: Rules and permission: school rules, detention, forbidden areas; known vs allowed vs able.
4. Compare with Academagia's dossier: same school-year problem, different shape. Say what each does better."""),
  "fs-rune-factory-5": dict(
    out="docs/research/rune-factory-5/", private="docs/research/rune-factory-5/private/fs-rune-factory-5/",
    payload=f"Installed (Rune Factory 5, Unity IL2CPP, Windows): `{STEAM}/Rune Factory 5/` with GameAssembly.dll and `Rune Factory 5_Data/` (global-metadata.dat under il2cpp_data). Owned by Weibao.",
    route="IL2CPP route: build Il2CppDumper or Cpp2IL from source with the local dotnet SDK (record which ran) to recover class and field names; read data tables from Unity assets with a pure reader (UnityPy in a venv, or AssetRipper built from source). Never run the game. If names recover but logic stays opaque, answer from tables and field names and mark inferred.",
    questions="""1. P02: Crafting and forging with item upgrades: one material can go to forging, upgrading, cooking, gifting or shipping. How are these destinations and their effects stored?
2. P03/P09: Skills that level by use (dozens of skills): how use maps to XP, and what each level unlocks.
3. P19: Dialogue, gifts and friendship events: conditions and any paid or failable choice.
4. P01: Farm and monster helpers: how assigned work reports its result or blocker.
5. A04 save: what is saved for crafted item stats and relationships."""),
  "fs-zomboid": dict(
    out="docs/research/project-zomboid/", private="docs/research/project-zomboid/private/fs-zomboid/",
    payload=f"Installing (Steam app 108600, macOS native) at `{STEAM}/ProjectZomboid/`. A watcher started you once files appeared; confirm the download finished (appmanifest StateFlags 4 and nonzero SizeOnDisk) before relying on file lists. Owned by Weibao.",
    route="Lua under `media/lua` and recipe and item scripts under `media/scripts` are plain text: read directly. The Java core needs a Java decompiler (Vineflower or CFR, user-local install) only for questions Lua cannot answer. Never run the game.",
    questions="""1. P03: Skill books (XP multiplier within a level band, none alone), recipe magazines, TV and VHS (capped direct XP): how each is implemented and how they combine.
2. P04: How is 'knows recipe' kept apart from 'has station, tools, skill and materials now', and what does the crafting UI show when one is missing?
3. CH: Build 42 chains: butchering, hides, tanning, drying racks, smithing, pottery: stages, timers, stations.
4. BD: Traits, moodles, injuries and body parts: which systems read which field.
5. P01: How a timed action reports why it stopped or cannot start."""),
  "fs-potionomics": dict(
    out="docs/research/potionomics/", private="docs/research/potionomics/private/fs-potionomics/",
    payload=f"Installing (Potionomics, Steam app 1874490) at `{STEAM}/Potionomics/`. A watcher started you once files appeared; confirm the download finished before relying on file lists. Owned by Weibao. Engine not yet confirmed: check for `*_Data/Managed/Assembly-CSharp.dll` (Unity Mono, use ilspycmd) or GameAssembly.dll (IL2CPP).",
    route="Pick the route from what is installed and record it in TOOLING.md. Never run the game.",
    questions="""1. P19: Haggling is a card-based exchange: how does spending stamina or cards change the price, how can it fail, and how does the outcome change later relationships or offers?
2. P02: One ingredient can go into several potion recipes with different magimin ratios; how are ratios, quality bands and destinations shown?
3. P03: How do friendships with heroes and rivals unlock new cards or techniques?
4. P01: Cauldron brewing overnight: what is quoted before, and what is reported after?"""),
}

for key, v in LANES.items():
    with open(os.path.join(HERE, f"{key}.prompt.md"), "w") as f:
        f.write(HEAD.format(key=key, **v))
print("\n".join(LANES))
