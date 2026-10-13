# Kingdom of Loathing: source audit (2026-10-13)

**Answer first.** KoL has stayed varied for 20+ years mainly by keeping one fixed quest spine (Council quests L2 to L13) and rotating the rules on top of it (F1, F3). About 55 challenge paths each change one or two rules: which organs work, which class you play, how familiars behave. Content then arrives in small modular pieces (F5, F6): each monthly item adds a few daily charges, a zone or a skill. Retired items stay in the economy, and a later path can bring them back as replicas. The daily turn budget, filled through three consumption organs with separate roles (F2, F4), makes every new item a puzzle about squeezing more out of today without learning a new system.

For YAIRPG the new ideas are the fixed spine with rule rotation, organ-style caps that each world names differently, and modules that add charges instead of systems. Challenge runs and per-path carry already exist in our docs.

Findings and packets are proposals, not accepted decisions.

**Route.** The KoL wiki returned 403 on both HTML and the MediaWiki API, and the Coldfront mirror's certificate has expired, so this lane read the open-source **KoLmafia** client instead: its Java and data files encode the game's mechanics. Labels: verified (code) = KoLmafia Java; verified (data) = KoLmafia data files; inferred = general knowledge or this lane's assessment. With the wiki blocked, treat every inferred KoL fact as unconfirmed. Paths are relative to `src/main/resources/data` (data) or `src/main/java/net/sourceforge/kolmafia` (Java) in KoLmafia at [`b11fc583b687`](https://github.com/kolmafia/kolmafia/blob/b11fc583b6872f1d56f5936803de2359cc962328).

| Code | Label | Finding |
|---|---|---|
| F1 | verified (code) | **Ascension paths.** `AscensionPath.java` lists 57 entries (ids 0 to 58 plus Bad Moon 999), about 3 new paths a year since 2004. Each sets `isAvatar` (the path replaces your class with its own), an optional per-path points preference with a maximum and a "bucket" flag (23 paths keep points across runs), and stomach/liver/spleen capacities: Teetotaler 15/0/15, Boozetafarian 0/14/15, Oxygenarian 0/0/15, You, Robot 0/0/0. Default 15/14/15. |
| F2 | verified (code+data) | **Three organs with different jobs.** `KoLCharacter.getCapacity` takes the class override, else the path default, then adds modifiers. Food averages 3.46 adventures per fullness (1166 rows in `fullness.txt`), booze 3.67 per drunkenness (795 rows in `inebriety.txt`). Most spleen items give a buff, not adventures (202 of 260 rows have no quality tier). Over the liver limit sets `isFallingDown`. Some paths block expansion. Quality tiers run from crappy to "super ultra mega turbo EPIC". |
| F3 | verified (data) | **Fixed spine.** `questslog.txt` has Council quests L02 to L13 (the L11 MacGuffin branches, the L12 war, the L13 final). Every run walks this spine; variety comes from path rules and the tools you bring. Separate quest families arrive with content additions. |
| F4 | verified (code) / inferred | **Turn budget.** The "Adventures" modifier matches "+N Adventure(s) per day" (`DoubleModifier.java:220`) on 164 rows. The base of about 40 a day with a 200 bank cap is inferred. Organs turn items into more turns today, so every consumable is a turn-economy choice. |
| F5 | verified (data) | **Daily charges as the content unit.** 1090 daily-reset counters (the "_" prefixes in `defaults.txt`). `dailylimits.txt` lists 442 limits: 216 casts, 163 uses, 29 eats, 20 drinks, 5 chews, 6 tomes (max 3 each; a shared pool is inferred). 11 free-fight counters. A new item usually adds 1 to 3 charges, not a new system. |
| F6 | verified (data) / inferred | **Retirement and replicas.** 6211 modifier rows carry "Last Available: YYYY-MM", so items stop being obtainable but keep working. The Replica Mr. Store (61 entries in `coinmasters.txt`) re-offers old monthly items as replicas inside the Legacy of Loathing path. "Retired things return as run-scoped replicas" is an inference. |
| F7 | verified (code) | **Ascension economy.** `request/AfterLifeRequest.java`: making a skill permanent costs 100 Karma softcore or 200 hardcore, refundable. Astral deli 1 Karma, armory 10. Ronin is 1000 turns (`KoLCharacter.java:3150`), with a daily storage-pull budget; 328 items are "Free Pull" and 102 "Softcore Only". |
| F8 | verified (data) | **Breadth.** 12098 items, 3150 effects, 2971 monsters, 806 locations, 215 zones, 198 outfits, 333 familiars, 1942 skills (about 45 per class; 592 granted by items or paths). |
| F9 | verified (data) | **One modifier language.** 16114 rows from items, effects, skills, familiars, outfits and locations with 675 distinct keys and conditional expressions like `[if(effect(X),6,3)]`. Breadth comes from one shared stat vocabulary every new thing writes into. |
| F10 | verified (data) | **Familiars from primitives.** 333 familiars built from ability primitives (combat, item drop, stat "volleyball-like", meat, mp/hp/block). "Familiar Weight" (443 modifier rows) scales all of them. |
| F11 | verified (data) | **Crafting with requirement flags.** `concoctions.txt` uses 73 method tags: a base type (COMBINE, COOK, MIX, SMITH, JEWEL, STILL...) plus flags for a skill, a tool, a calendar day or a path ban. 30 deterministic fold cycles, 227 random zap groups, 542 smash-to-material rows. |
| F12 | verified (data) | **Standard.** `standard-rewards.txt` has 146 rows of yearly per-class rewards since 2015, tied to a rotating legal-item window (inferred). |
| F13 | inferred | **Clans** are multiplayer. The solo analog is a household or NPC guild stash with daily furniture uses. |
| F14 | inferred | **Why it lasts.** The spine, organs and modifier language stayed fixed while every addition writes into them, so the cost of learning a new path stays small and combinations grow. |
| F15 | inferred / covered | **Already covered in YAIRPG docs:** challenge runs as start-of-life modifiers ([north star](../../LIFE_SIM_NORTH_STAR.md)), per-path carry ([Immortality Idle](../immortality-idle/IMPLEMENTATION_PACKETS.md)), day slots ([Academagia](../academagia/REPORT.md)), day budget ([Groundhog Life](../groundhog-life/IMPLEMENTATION_PACKETS.md)), reset dials. New here: per-path organ capacities, F2, spine plus rule rotation, charges as the unit, retire and replica, two-tier perm price, F9, F11 flags. |

## How YAIRPG compares

- **Rule profile:** `src/chronicle.js` createChronicle and createHeirChronicle hold the per-life mode, the natural place for path modifiers. No path id or path-points store exists.
- **Carry:** `src/heir_inheritance.js` carries items, lessons and obligations. No karma-style meta-currency or softcore/hardcore tier.
- **Organ caps:** `src/energy_resources.js` has capacity, strainLimit and strainPerUse, which can model a liver or spleen. `src/nethack_fieldcraft_content.js` gives Rill satiety max 4. No player organ trio.
- **Content modules:** `src/content_packs.js` and `src/structured_pack_definitions.js` are an IotM-shaped seam.
- **Crafting:** `src/crafting_recipes.js` splits recipes into families but lacks composable requirement flags.
- **Companions:** `src/party_content.js` (Lio) and Rill; no shared primitives or weight scalar.
- **Daily:** `src/world_rhythm.js`, `src/game_time.js`. Limits must be per-world adjectives, never a fixed "once".

Packets: [IMPLEMENTATION_PACKETS.md](IMPLEMENTATION_PACKETS.md). Touches: [SMALL_TOUCHES.md](SMALL_TOUCHES.md). Coverage: [CHECKPOINT.md](CHECKPOINT.md).

## Sources

- [KoLmafia at b11fc583b687](https://github.com/kolmafia/kolmafia/blob/b11fc583b6872f1d56f5936803de2359cc962328) (BSD-3-Clause): `AscensionPath.java`, `KoLCharacter.java`, `request/AfterLifeRequest.java`, `request/StorageRequest.java`, `modifiers/DoubleModifier.java`, and data files `fullness.txt`, `inebriety.txt`, `spleenhit.txt`, `dailylimits.txt`, `defaults.txt`, `questslog.txt`, `concoctions.txt`, `modifiers.txt`, `familiars.txt`, `classskills.txt`, `coinmasters.txt`, `foldgroups.txt`, `zapgroups.txt`, `standard-rewards.txt`, `items.txt`.
- KoL wiki (blocked, 403): https://wiki.kingdomofloathing.com/Ascension. A web search snippet confirmed the 100 and 200 Karma perm prices.
